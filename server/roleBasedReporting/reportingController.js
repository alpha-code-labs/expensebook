import reporting from '../models/reportingSchema.js';
import Joi from 'joi';
import { approverStatusEnums, cashAdvanceStatusEnum, tripStatusEnum } from '../models/reportingSchema.js';
import {expenseHeaderStatusEnums} from '../models/travelExpenseSchema.js'
import HRCompany from '../models/hrCompanySchema.js';
import REIMBURSEMENT from '../models/reimbursementSchema.js'
import { extractTrip, getItinerary } from '../controllers/tripController.js';
import { getEmployeeDetails } from '../utils/functions.js';
import { financeCashAdvanceStatusEnum } from '../utils/enums.js';

const getEnums = {approverStatusEnums, cashAdvanceStatusEnum,tripStatusEnum,expenseHeaderStatusEnums}

const getEmployeeRoles = async (tenantId, empId) => {
  try {
    if (!tenantId || !empId) {
      throw new Error("Invalid arguments: tenantId and empId are required.");
    }
    const empIdStr = empId.toString()

    const hrDocument = await HRCompany.findOne({
      tenantId,
      'employees.employeeDetails.employeeId': empId
    });

    if (!hrDocument) {
      throw new Error(`Company not found for tenantId: ${tenantId}`);
    }
    const employee = hrDocument.employees.find(emp => emp.employeeDetails.employeeId === empIdStr);

    if (!employee) {
      throw new Error(`Employee not found for employeeId: ${empIdStr}`);
    }

    if (!employee.employeeRoles) {
      throw new Error("Employee roles not found");
    }

    return employee.employeeRoles;
  } catch (error) {
    console.error("Error in getEmployeeRoles:", error.message);
    throw error;  // Re-throw the error to be handled by the calling function
  }
};



const roleBasedLayoutSchema = Joi.object({
  tenantId: Joi.string().required(),
  empId: Joi.string().required(),
})


const roleBasedLayout = async (req, res) => {
  try {
    let{tenantId, empId } = req.params
    const { error, value } = roleBasedLayoutSchema.validate({tenantId, empId });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    ({ tenantId, empId } = value)
    const reportingViews = await getReportingViews(tenantId, empId);
    if(!reportingViews){
      return res.status(400).json({success:false, reportingViews})
    }
    return res.status(200).json(reportingViews);
  } catch (err) {
    console.error("Error fetching reporting views:", err.message);
    return res.status(500).json({success:false, error:err.message });
  }
};



const getReportingViews = async (tenantId, empId) => {
    try {
      const options = { employee:true}
        const employeeRoles = await getEmployeeRoles(tenantId, empId);
        const layoutFunctions = {
            employee: async () => employeeLayout(tenantId, empId,options),
            // employeeManager: async () => managerLayout(tenantId, empId),
            employeeManager: null,
            businessAdmin: null,
            finance: async() => financeLayout(tenantId,empId),
            superAdmin: null,
        };

        const applicableRoles = Object.keys(employeeRoles).filter(role => employeeRoles[role]);

        const reportingViews = await Promise.all(applicableRoles.map(async role => {
          try {
              if (layoutFunctions[role]) {
                  const data = await layoutFunctions[role]();
                  return { [role]: data };
              } else {
                  console.warn(`No layout function for role: ${role}`);
                  return { [role]: null }; // Handle the absence of function
              }
          } catch (error) {
              console.error("Error fetching data for role", role, "Error:", error);
              return { [role]: null }; // Handle the error case as needed
          }
      }));
      

        // const formattedReportingViews = reportingViews.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        const formattedReportingViews = reportingViews.reduce((acc, curr) => {
          Object.entries(curr).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              acc[key] = value; 
            }
          });
          return acc;
        }, {});

        return {
            employeeRoles,
            reports:formattedReportingViews.employee
        };
    } catch (error) {
        console.error("Error fetching Reporting views:", error);
        throw error; // Propagate the error to the caller
    }
};


const employeeLayout = async (tenantId, empId,options={},filter) => {
  try {
    const {employee= false, manager=false , finance = false} = options
    const promises = [
      hrDetailsService(tenantId, empId,options),
      getLastMonthTrips(tenantId, empId,options,filter),
      getLastMonthTravel(tenantId,empId,options,filter),
      getLastMonthReimbursement(tenantId, empId,options,filter)
    ]

    if(!manager || !finance || employee){
      promises.push(findListOfApprovers(tenantId, empId))
    }

    const [hrData,monthlyTrips,monthlyTravel,reimbursement,approvers] = await Promise.all(promises)
    const {hrDetails,employeeDetails,group} = hrData
    const { employeeName, employeeId , department, designation,grade,project} = employeeDetails
    // const getTravel = monthlyTravel.map(travel => ({...travel,groupName:group,department, designation,grade,project}))
    // const getTrips = monthlyTrips.map(travel => ({...travel,groupName:group,department, designation,grade,project}))
    // const getReimbursement = reimbursement.map(r => ({...r,groupName:group,department, designation,grade,project}))

    const mapWithGroupInfo = (dataArray) => 
      dataArray && dataArray.length > 0
        ? dataArray.map(item => ({
            ...item,
            groupName: group,
            department,
            designation,
            grade,
            project,
          }))
        : [];
    
    const getTravel = mapWithGroupInfo(monthlyTravel);
    const getTrips = mapWithGroupInfo(monthlyTrips);
    const getReimbursement = mapWithGroupInfo(reimbursement);

    return { travel:getTravel,trips:getTrips,reimbursement:getReimbursement, hrDetails,employeeDetails, group,listOfApprovers: approvers};
  } catch (error) {
      console.error("Error:", error);
      throw new Error({ message: 'Internal server error' });
  }
};


const getHrDataService = (employeeDocument,options) => {
 try{
  if(!employeeDocument){
    throw new Error(`Employee document : -error `)
  }
  const isFinance = options?.finance

  const {
    companyDetails: { defaultCurrency, companyName } = {},
    reimbursementExpenseCategories = [],
    flags: { policyFlag } = {},
    travelAllocationFlags = {},
    travelAllocations = {},
    travelExpenseCategories = [],
    expenseSettlementOptions = {},
  } = employeeDocument;

  const expenseCategoryNames = travelExpenseCategories.map(category => category.categoryName);
  const reimbursementExpenseCategory = reimbursementExpenseCategories.map(category => category?.categoryName);

  const travelData = {
    travelAllocationFlags,
    travelExpenseCategories,
    expenseCategoryNames,
    travelAllocations,
    expenseSettlementOptions,
  };

  const response = {
    defaultCurrency,
    companyName,
    travelData,
    reimbursementExpenseCategory,
    getEnums: {...getEnums},
  }

  console.log("options", options)
  if(isFinance){
    console.log({isFinance})
    response.getEnums.cashAdvanceStatusEnum = financeCashAdvanceStatusEnum
  }
  return response ;
 } catch(e){
  throw e
 }
};

const hrDetailsService = async (tenantId, empId,options={}) => {
  try {
    const {manager=false, finance=false} = options
    const  {employeeDocument,employeeDetails,group, getAllGroups} = await getEmployeeDetails(tenantId, empId);

    if(!manager || !finance){
      const hrDetails = getHrDataService(employeeDocument);
      hrDetails.getAllGroups = getAllGroups
      return {
        employeeDetails,
        hrDetails,
        group,
      };
    }
  
    return {
      employeeDetails,
      group,
      getAllGroups
    };
  } catch (error) {
    console.error("Error in fetching employee Reporting:", error);
    throw error;
  }
};



export const findListOfApprovers = async (tenantId, empId) => {
  try {
    const tripDocs = await reporting.find({
      'tenantId': tenantId,
      'createdBy.empId': empId,
    }).lean().exec();

    // Create a Set to store unique approvers
    const uniqueApprovers = new Set();

    // Iterate over the tripDocs and extract unique approvers
    tripDocs.forEach((trip) => {
      trip.travelRequestData.approvers.forEach((approver) => {
        uniqueApprovers.add(JSON.stringify({ empId: approver.empId, name: approver.name }));
      });
    });

    // Convert the Set back to an array and parse the JSON strings
    const approversArray = Array.from(uniqueApprovers).map(JSON.parse);

    return (approversArray);
  } catch (error) {
    console.error(error);
    throw new Error({ error: 'Internal server error' });
  }
};


const getLastMonthTrips = async (tenantId, empId,options,filter) => {
    try {
      const {employee= false, manager=false , finance = false} = options

      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() -1, today.getDate());
      // console.log("today date", today , "last month", lastMonth ,"tenantId", tenantId, "empId", empId)

      const filterObject = {
        tenantId,
        'tripStartDate': { $gte: lastMonth, $lte: today },
      }

      if(employee) {
        filterObject['createdBy.empId']=empId
      }else if(filter){
        Object.assign(filterObject,filter)
      } 

      console.log("filter object", JSON.stringify(filterObject,'',2))

      const tripDocs = await reporting.find().lean().exec();
  
    // console.log("trip in last month", tripDocs)
      const trips = extractTrip(tripDocs)
    //   console.log("trips", trips);
      return trips;
    } catch (error) {
      console.error("Error in fetching employee Reporting:", error);
      throw new Error('Error in fetching employee Reporting');
    }
};

const getLastMonthTravel = async (tenantId, empId,options) => {
  try {
    const {employee= false, manager=false , finance = false} = options

    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() -1, today.getDate());
    // console.log("travel -----------","today date", today , "last month", lastMonth ,"tenantId", tenantId, "empId", empId)

    if(employee){}
    const travelDocs = await reporting.find({
      tenantId,
      'travelRequestData.createdBy.empId': empId,
      'travelRequestData.travelRequestDate': { $gte: lastMonth, $lte: today },
    }).lean().exec();

  // console.log("travel in last month", travelDocs)
    const travelRequests = travelDocs.map(travel => {
      const { travelRequestData, cashAdvancesData, travelExpenseData, expenseAmountStatus, tripId, tripNumber, tripStartDate, tripCompletionDate ,tripStatus} = travel || {};
      const { totalCashAmount, totalRemainingCash } = expenseAmountStatus || {};
      const { travelRequestId, travelRequestNumber, travelRequestStatus, tripPurpose,createdBy,tripName, isCashAdvanceTaken,travelType,approvers, itinerary } = travelRequestData || {};

      const itineraryToSend = getItinerary(itinerary)

      return {
        tripId, tripNumber,
        tripName,
        travelRequestId,
        travelRequestNumber,
        createdBy,
        tripPurpose,
        tripStartDate,
        tripStatus,
        tripCompletionDate,
        travelRequestStatus,
        isCashAdvanceTaken,
        expenseAmountStatus,
        travelType,
        approvers,
        cashAdvances: isCashAdvanceTaken ? (cashAdvancesData ? cashAdvancesData.map(({ cashAdvanceId, cashAdvanceNumber, amountDetails, cashAdvanceStatus , approvers}) => ({
          cashAdvanceId,
          cashAdvanceNumber,
          amountDetails,
          cashAdvanceStatus,
          approvers
        })) : []) : [],
        // travelExpenses: travelExpenseData?.map(({ expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus, approvers ,expenseLines,travelType}) => ({
        //   expenseHeaderId,
        //   expenseHeaderNumber,
        //   expenseHeaderStatus,
        //   approvers, expenseLines,
        // travelType
        // })),
        travelExpenses:travelExpenseData,
        itinerary: itineraryToSend,
      };
    });

  //console.log("trips", trips);
    return travelRequests;
  } catch (error) {
    console.error("Error in fetching employee Reporting:", error);
    throw new Error('Error in fetching employee Reporting');
  }
};


const getLastMonthReimbursement = async (tenantId, empId, options) => {
  try {
    const {employee= false, manager=false , finance = false} = options

    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() -1, today.getDate());
    console.log("today date", today , "last month", lastMonth)

    const filterObject = {
      tenantId,
      'expenseSubmissionDate': { $gte: lastMonth, $lte: today },
    }
    if(employee){
    filterObject['createdBy.empId'] =empId
    }
    
    const docs = await REIMBURSEMENT.find(filterObject).lean().exec();

    if(!docs){
      return { message: 'There are no reimbursement found for the user' };
    } else {
      return docs
    }
  } catch (error) {
    console.error("Error in fetching employee Reporting:", error);
    throw new Error('Error in fetching employee Reporting');
  }
};


const tripStatusSchema = Joi.object({
  tripStatuses: Joi.array().items(
    Joi.string().valid(
      ...tripStatusEnum
    )
  ),
  // tripCompletionDate: Joi.date().required()
  tripCompletionDate: Joi.date().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  travelType: Joi.string().valid('domestic', 'international','local').optional()
});

// Define the schema for validating request parameters
const paramsSchema = Joi.object({
  tenantId: Joi.string().required(),
  empId: Joi.string().required()
});


//get trips by tripCompletionDate or multiple tripStatus or travelType
export const getTrips = async (req, res) => {
  try {
    // Validate the request body using Joi
    const { error: bodyError, value: bodyValue } = tripStatusSchema.validate(req.body);
    if (bodyError) {
      return res.status(400).json({ success: 'false', message: bodyError.details[0].message });
    }

    // Validate the request parameters using Joi
    const { error: paramsError, value: paramsValue } = paramsSchema.validate(req.params);
    if (paramsError) {
      return res.status(400).json({ success: 'false', message: paramsError.details[0].message });
    }

    const { tenantId, empId } = paramsValue;
    const { tripStatuses, tripCompletionDate, startDate, endDate, travelType} = bodyValue;

      const query = {
        tenantId,
        'travelRequestData.createdBy.empId': empId,
        'tripStatus': { $in: tripStatuses }
      };
  
      // Add the tripCompletionDate filter only if it's present in the request body
      if (tripCompletionDate) {
        query['tripCompletionDate'] = tripCompletionDate;
      }

      // Add startDate and endDate filters if both are present
      if (startDate && endDate) {
        query['tripCompletionDate'] = { $gte: startDate, $lte: endDate };
      }

      if(travelType){
        query['travelRequestData.travelType'] = travelType
      }
  
      const tripDocs = await reporting.find(query).lean().exec();
  
      if (!tripDocs || tripDocs.length === 0) {
        return res.status(200).json({ message: 'No Trips found for this filter, update the filter and try again', success: 'true' });
      } else{
        console.log("tripDocs", tripDocs)
        const trips = tripDocs
        // .filter(trip => tripStatuses.includes(trip?.tripSchema?.tripStatus) && trip?.tripSchema?.tripCompletionDate === tripCompletionDate)
        .map(trip => {
          const { travelRequestData, cashAdvancesData, travelExpenseData, expenseAmountStatus, tripId, tripNumber, tripStartDate, tripCompletionDate } = trip || {};
          const { totalCashAmount, totalRemainingCash } = expenseAmountStatus || {};
          const { travelRequestId, travelRequestNumber, travelRequestStatus, tripPurpose, isCashAdvanceTaken, itinerary } = travelRequestData || {};
  
          const itineraryToSend = getItinerary(itinerary)
  
          return {
            tripId, tripNumber,
            travelRequestId,
            travelRequestNumber,
            tripPurpose,
            tripStartDate,
            tripCompletionDate,
            travelRequestStatus,
            isCashAdvanceTaken,
            expenseAmountStatus,
            cashAdvances: isCashAdvanceTaken ? (cashAdvancesData ? cashAdvancesData.map(({ cashAdvanceId, cashAdvanceNumber, amountDetails, cashAdvanceStatus }) => ({
              cashAdvanceId,
              cashAdvanceNumber,
              amountDetails,
              cashAdvanceStatus
            })) : []) : [],
            travelExpenses: travelExpenseData?.map(({ expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus }) => ({
              expenseHeaderId,
              expenseHeaderNumber,
              expenseHeaderStatus
            })),
            itinerary: itineraryToSend,
          };
        });
  
      console.log("trips", trips);
      return res.status(200).json({success: 'true', trips});
      }

    } catch (error) {
      console.error("Error in fetching employee Reporting:", error);
      return res.status(404).json({ success: 'false',message:'Error in fetching data'});
    }
};


export const findListOfEmployees = async (tenantId, empId, options = {}) => {
  try {
    const filter = buildFilter(tenantId, empId, options);
    const tripDocs = await reporting.find(filter).lean().exec();

    console.log("tripDocs", tripDocs)
    if(!tripDocs){
      throw new Error('Document not found :findListOfEmployees')
    }

    const listOfEmployees = extractUniqueEmployees(tripDocs);
    return {listOfEmployees,filter}
  } catch (error) {
    console.error(error);
    throw new Error('Internal server error');
  }
};

const buildFilter = (tenantId, empId, options) => {
  console.log("options - findListOfEmployees ", options)
  const { manager = false, finance = false } = options;
  const filter = { tenantId };

  if (manager) {
    filter['travelRequestData.approvers.empId'] = empId;
  }

  if (finance) {
    filter.$or =[
      {
        cashAdvancesData :{
          $elemMatch:{
            $or:[
              { "paidBy.empId":empId},
              { "recoveredBy.empId":empId}
            ]
          }
        }
      },
      {
        travelExpenseData :{
          $elemMatch:{
            "recoveredBy.empId": empId}
        }
      }
    ]
  }

  console.log("filter before", JSON.stringify(filter,'',2))
  return filter;
};

const extractUniqueEmployees = (tripDocs) => {
  const employeesSet = new Set(
    tripDocs
      .map(trip => trip.createdBy)
      .filter(Boolean)
      .map(createdBy => JSON.stringify({ empId: createdBy.empId, name: createdBy.name }))
  );

  return Array.from(employeesSet).map(item => JSON.parse(item));
};



const managerLayout = async(tenantId, empId) =>{
  try {
    const options = {
      manager: true,
    }
    const [employeeRoles, getListOfEmployees,getEmpDetails] = await Promise.all([
      getEmployeeRoles(tenantId,empId),
      findListOfEmployees(tenantId,empId,options),
      getEmployeeDetails(tenantId,empId)      
    ])
    
    if(!getListOfEmployees){
      return []
    }

    const {listOfEmployees, filter } = getListOfEmployees

    const {employeeDocument,employeeDetails , group,getAllGroups} = getEmpDetails
    const { employeeName, employeeId , department, designation,grade,project} = employeeDetails
    const hrDetails = getHrDataService(employeeDocument,options);

    hrDetails.getAllGroups = getAllGroups

    const  { employeeDetailsArray, allEmployeeReports,reports} = await getAllEmployeeReports(tenantId, listOfEmployees,filter, options);

    listOfEmployees.forEach(employee => {
      const matchedDetails = employeeDetailsArray.find(hr => hr.employeeId.toString() === employee.empId)
      if(matchedDetails){
        const { companyName, department,designation,grade, project} = matchedDetails

        Object.assign(employee,{
          companyName, department,designation,grade, project , group
        })
      } 
    })

    return {employeeRoles,listOfEmployees,allEmployeeReports,reports,employeeDetailsArray,hrDetails}
  } catch (error) {
    throw error
  }
}


const getAllEmployeeReports = async (tenantId, listOfEmployees,filter,options={}) => {
  try {
    console.info("listOfEmployees kanbam", listOfEmployees)
    const getAllReports = await Promise.all(
      listOfEmployees.map(async (e) => {
        const employee = await employeeLayout(tenantId, e.empId, options,filter);
        return employee;
      })
    );

    if(!getAllReports?.length){
      return {
        employeeDetailsArray:[],
        allReports:[],
        reports:[]
      }
    }
    // console.info("getAllReports", getAllReports.length , JSON.stringify(getAllReports,'',2))
    console.info("getAllReports", getAllReports.length )
  const { travel:monthlyTravel,trips:monthlyTrips,reimbursement, hrDetails,employeeDetails, listOfApprovers: approvers} = getAllReports

    const employeeDetailsArray = []
    const allReports =[]

    getAllReports.forEach(({employeeDetails, ...rest})=> {
      employeeDetailsArray.push(employeeDetails)
      allReports.push(rest)
    })

  if(allReports?.length){
        const reports = {
          travel: allReports.reduce((acc, report) => {
            return acc.concat(report.travel);
          }, []),
          
          trips: allReports.reduce((acc, report) => {
            return acc.concat(report.trips);
          }, []),
          
          reimbursement: allReports.reduce((acc, report) => {
            return acc.concat(report.reimbursement);
          }, []),
        };
    
        return {
          employeeDetailsArray,
          allReports,
          reports
        }
  }

  } catch (error) {
    console.error('Error fetching employee reports:', error);
    throw error; // Rethrow or handle as needed
  }
};


const employeeSchema = Joi.object({
  empId: Joi.string().required(),
  tenantId: Joi.string().required()
})

const getAllManagerReports = async(req,res) => {
  try{
    const {error, value} = employeeSchema.validate(req.params)
    if(error) return res.status(400).json({success:false, message:error.message})
    const { tenantId, empId } = value;

    const getAll  = await managerLayout(tenantId,empId)
    if(!getAll){
      return res.status(200).json({success:true, message:'No reports found' , getAll:{} })
    }
    const {employeeRoles,listOfEmployees, reports,employeeDetailsArray,hrDetails } = getAll

    reports.hrDetails = employeeDetailsArray
    reports.listOfEmployees = listOfEmployees
    reports.hrDetails = hrDetails
    return  res.status(200).json({success:true, employeeRoles,reports })

  } catch(error){
    console.error(error);
    return res.status(500).json("internal server error")
  }
}

const getAllFinanceReports = async(req,res) => {
  try{
    const {error, value} = employeeSchema.validate(req.params)
    if(error) return res.status(400).json({success:false, message:error.message})
    const { tenantId, empId } = value;

    console.info("getAllFinanceReports ----tenantId, empId ", tenantId, empId )
    const getAll  = await financeLayout(tenantId,empId)
    if(!getAll){
      return res.status(200).json({success:true, message:'No reports found' , getAll:{} })
    }
    const {employeeRoles,listOfEmployees, reports,employeeDetailsArray,hrDetails } = getAll

    reports.hrDetails = employeeDetailsArray
    reports.listOfEmployees = listOfEmployees
    reports.hrDetails = hrDetails
    return  res.status(200).json({success:true, employeeRoles,reports })

  } catch(error){
    console.error(error);
    return res.status(500).json("internal server error")
  }
}

const financeLayout = async(tenantId,empId) => {
  try {
    const options = {
      finance:true
    }
    const [employeeRoles,getListOfEmployees,getEmpDetails] = await Promise.all([      
      getEmployeeRoles(tenantId,empId),
      findListOfEmployees(tenantId,empId,options),
      getEmployeeDetails(tenantId,empId)
    ])

    // console.log("finance layout - promise ,all ",employeeRoles,"listOfEmployees",listOfEmployees, "getEmpDetails" ,getEmpDetails )
    if(!getListOfEmployees){
      return []
    }

    const {listOfEmployees, filter } = getListOfEmployees
    const {employeeDocument,employeeDetails ,group, getAllGroups} = getEmpDetails
    const { employeeName, employeeId , department, designation,grade,project} = employeeDetails
    const hrDetails = getHrDataService(employeeDocument,options);
    hrDetails.getAllGroups = getAllGroups

    const  { employeeDetailsArray, allEmployeeReports,reports} = await getAllEmployeeReports(tenantId, listOfEmployees,filter,options);

    // console.info(" employeeDetailsArray", employeeDetailsArray,"allEmployeeReports", allEmployeeReports, "reports",reports)
    // if(!employeeDetailsArray || !allEmployeeReports || !reports){
    //   throw new Error(`Failed to getAllEmployeeReports:Finance Layout`)
    // }

    listOfEmployees.forEach(employee => {
      const matchedDetails = employeeDetailsArray.find(hr => hr.employeeId.toString() === employee.empId)
      if(matchedDetails){
        const { companyName, department,designation,grade, project} = matchedDetails

        Object.assign(employee,{
          companyName, department,designation,grade, project , group
        })
      } 
    })

    return {employeeRoles,listOfEmployees,allEmployeeReports,reports,employeeDetailsArray,hrDetails}
  } catch (error) {
    console.error(error.message)
    throw error
  }
}



export{
  roleBasedLayout,
  getAllManagerReports,
  getAllFinanceReports
}





