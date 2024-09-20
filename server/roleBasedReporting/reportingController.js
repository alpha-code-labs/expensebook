import reporting from '../models/reportingSchema.js';
import Joi from 'joi';
import { approverStatusEnums, cashAdvanceStatusEnum, tripStatusEnum } from '../models/reportingSchema.js';
import {expenseHeaderStatusEnums} from '../models/travelExpenseSchema.js'
import HRCompany from '../models/hrCompanySchema.js';
import REIMBURSEMENT from '../models/reimbursementSchema.js'
import { extractTrip, getItinerary } from '../controllers/tripController.js';
import { getEmployeeDetails } from '../utils/functions.js';

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
  const { error, value } = roleBasedLayoutSchema.validate(req.params);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { tenantId, empId } = value;
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
        const employeeRoles = await getEmployeeRoles(tenantId, empId);
        const layoutFunctions = {
            employee: async () => employeeLayout(tenantId, empId),
            // employeeManager: async () => managerLayout(tenantId, empId),
            employeeManager: null,
            businessAdmin: null,
            finance: null,
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


const employeeLayout = async (tenantId, empId, isAdmin=false) => {
  try {

    const promises = [
      hrDetailsService(tenantId, empId,isAdmin),
      getLastMonthTrips(tenantId, empId),
      getLastMonthTravel(tenantId,empId),
      getLastMonthReimbursement(tenantId, empId)
    ]

    if(!isAdmin){
      promises.push(findListOfApprovers(tenantId, empId))
    }

    const [hrData,monthlyTrips,monthlyTravel,reimbursement,approvers] = await Promise.all(promises)
    const {hrDetails,employeeDetails} = hrData

    return { travel:monthlyTravel,trips:monthlyTrips,reimbursement, hrDetails,employeeDetails, listOfApprovers: approvers};
  } catch (error) {
      console.error("Error:", error);
      throw new Error({ message: 'Internal server error' });
  }
};


const getHrDataService = (employeeDocument) => {
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

  return {
    defaultCurrency,
    companyName,
    travelData,
    reimbursementExpenseCategory,
    getEnums,
  };
};

const hrDetailsService = async (tenantId, empId, isAdmin = false) => {
  try {
    const  {employeeDocument,employeeDetails} = await getEmployeeDetails(tenantId, empId);

    if(!isAdmin){
      const hrDetails = getHrDataService(employeeDocument);
      return {
        employeeDetails,
        hrDetails,
      };
    }
  
    return {
      employeeDetails,
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


const getLastMonthTrips = async (tenantId, empId) => {
    try {
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() -1, today.getDate());
      // console.log("today date", today , "last month", lastMonth ,"tenantId", tenantId, "empId", empId)

      const tripDocs = await reporting.find({
        tenantId,
        'createdBy.empId': empId,
        'tripStartDate': { $gte: lastMonth, $lte: today },
      }).lean().exec();
  
    // console.log("trip in last month", tripDocs)
      const trips = extractTrip(tripDocs)
    //   console.log("trips", trips);
      return trips;
    } catch (error) {
      console.error("Error in fetching employee Reporting:", error);
      throw new Error('Error in fetching employee Reporting');
    }
};

const getLastMonthTravel = async (tenantId, empId) => {
  try {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() -1, today.getDate());
    // console.log("travel -----------","today date", today , "last month", lastMonth ,"tenantId", tenantId, "empId", empId)

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


const getLastMonthReimbursement = async (tenantId, empId) => {
  try {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() -1, today.getDate());
    console.log("today date", today , "last month", lastMonth)

    const docs = await REIMBURSEMENT.find({
      tenantId,
      'createdBy.empId': empId,
      'expenseSubmissionDate': { $gte: lastMonth, $lte: today },
    }).lean().exec();

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


export const findListOfEmployees = async (tenantId, empId) => {
  try {

    const tripDocs = await reporting.find({
      'tenantId': tenantId,
      'travelRequestData.approvers.empId': empId,
    }).lean().exec();

    const employeesArray = Array.from(
      new Set(
          tripDocs
              .map(trip => trip.createdBy) 
              .filter(Boolean)
              .map(createdBy => JSON.stringify({ empId: createdBy.empId, name: createdBy.name }))
      )
  ).map(item => JSON.parse(item));
  
  // console.log("employeesArray", JSON.stringify(employeesArray,'',2));
  
    return (employeesArray);
  } catch (error) {
    console.error(error);
    throw new Error({ error: 'Internal server error' });
  }
};


const managerLayout = async(tenantId, empId) =>{
  try {

    const [employeeRoles,listOfEmployees,getEmpDetails] = await Promise.all([
      getEmployeeRoles(tenantId,empId),
      findListOfEmployees(tenantId,empId),
      getEmployeeDetails(tenantId,empId)      
    ])
    
    if(!listOfEmployees){
      return []
    }

    const {employeeDocument,employeeDetails } = getEmpDetails
    const { employeeName, employeeId , department, designation,grade,project} = employeeDetails
    const hrDetails = getHrDataService(employeeDocument);


    const  { employeeDetailsArray, allEmployeeReports,reports} = await getAllEmployeeReports(tenantId, listOfEmployees, 'true');

    listOfEmployees.forEach(employee => {
      const matchedDetails = employeeDetailsArray.find(hr => hr.employeeId.toString() === employee.empId)
      if(matchedDetails){
        const { companyName, department,designation,grade, project} = matchedDetails

        Object.assign(employee,{
          companyName, department,designation,grade, project
        })
      } 
    })

    return {employeeRoles,listOfEmployees,allEmployeeReports,reports,employeeDetailsArray,hrDetails}
  } catch (error) {
    throw error
  }
}


const getAllEmployeeReports = async (tenantId, listOfEmployees) => {
  try {
    const isAdmin = true
    const getAllReports = await Promise.all(
      listOfEmployees.map(async (e) => {
        const employee = await employeeLayout(tenantId, e.empId, isAdmin);
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

export{
  roleBasedLayout,
  getAllManagerReports
}





