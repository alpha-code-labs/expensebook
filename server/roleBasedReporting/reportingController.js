import reporting from '../models/reportingSchema.js';
import Joi from 'joi';
import { approverStatusEnums, cashAdvanceStatusEnum, tripStatusEnum } from '../models/tripSchema.js';
import {expenseHeaderStatusEnums} from '../models/travelExpenseSchema.js'
import HRCompany from '../models/hrCompanySchema.js';

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


export const roleBasedLayout = async (req, res) => {
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
            // employee: async () => {},
            employeeManager: async () => ({}),
            // finance: async () => financeLayout(tenantId, empId),
            // businessAdmin: async () => businessAdminLayout(tenantId, empId),
            // superAdmin: async () => superAdminLayout(tenantId, empId)
            finance: async() => ({ message:"Finance Layout "}),
            superAdmin: async () => ({ message:"SuperAdmin Layout"}),
        };

        const applicableRoles = Object.keys(employeeRoles).filter(role => employeeRoles[role]);

        const reportingViews = await Promise.all(applicableRoles.map(async role => {
            try {
                const data = await layoutFunctions[role]();
                return { [role]: data };
            } catch (error) {
                console.error("Error fetching data for role", role, "Error:", error);
                return { [role]: null }; // Handle the error case as needed
            }
        }));

        const formattedReportingViews = reportingViews.reduce((acc, curr) => ({ ...acc, ...curr }), {});

        return {
            employeeRoles,
            reportingViews: formattedReportingViews,
        };
    } catch (error) {
        console.error("Error fetching Reporting views:", error);
        throw error; // Propagate the error to the caller
    }
};


const employeeLayout = async (tenantId, empId) => {
  try {
    const hrDetails = await hrDetailsService(tenantId, empId);
    // console.log("reporting hr", hrDetails)
    const approvers = await findListOfApprovers(tenantId, empId);
    console.log("list of approvers", approvers)
    const monthlyTrips = await getLastMonthTrips(tenantId, empId);
    // console.log("reporting trip", monthlyTrips)
    const reimbursement = await getLastMonthReimbursement(tenantId, empId)
     return { trips:monthlyTrips,reimbursement:reimbursement, hrDetails:hrDetails, approvers};
  } catch (error) {
      console.error("Error:", error);
      throw new Error({ message: 'Internal server error' });
  }
};


const hrDetailsService = async (tenantId, empId) =>{
  try {
  
    const employeeDocument = await HRCompany.findOne({
      tenantId,
      'employees.employeeDetails.employeeId': empId
    });

    if (!employeeDocument) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found for the given IDs',
      });
    }

    const { employeeName, employeeId } = employeeDocument?.employees[0]?.employeeDetails;

    if (!employeeId) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found for the provided ID',
      });
    }

    const {
      companyDetails: { defaultCurrency, companyName } = {},
      reimbursementExpenseCategories,
    } = employeeDocument || {};

    let {
      flags:{policyFlag} = {}, // the name need to be cross-checked with hrcompany later --
      travelAllocationFlags = {}, // 3 types
      travelAllocations = {},
      travelExpenseCategories = {},
      expenseSettlementOptions = {},
  } =  employeeDocument || {};

       // const { travelExpenseCategories = [],  } = companyDetails 
        const expenseCategoryNames = travelExpenseCategories.map(category => category.categoryName);

    const reimbursementExpenseCategory = Array.isArray(reimbursementExpenseCategories)
      ? reimbursementExpenseCategories.map(category => category?.categoryName)
      : [];


    const isLevel3 = travelAllocationFlags?.level3
  let travelData
 if(isLevel3){
   travelData = { travelAllocationFlags, travelExpenseCategories, expenseCategoryNames,travelAllocations, expenseSettlementOptions}
  return {defaultCurrency,
  employeeName,
  companyName, travelData: travelData , reimbursementExpenseCategory, getEnums}
 }
 travelData = { travelAllocationFlags, travelExpenseCategories, expenseCategoryNames,travelAllocations, expenseSettlementOptions}
console.log("hr data", travelData)
    return {defaultCurrency,
  employeeName,
  companyName, travelData: travelData ,reimbursementExpenseCategory, getEnums};
  } catch (error) {
    console.error("Error in fetching employee Reporting:", error);
    throw new Error('Error in fetching employee Reporting');
  }
};


export const findListOfApprovers = async (tenantId, empId) => {
  try {
    const tripDocs = await reporting.find({
      'tripSchema.tenantId': tenantId,
      'tripSchema.createdBy.empId': empId,
    }).lean().exec();

    // Create a Set to store unique approvers
    const uniqueApprovers = new Set();

    // Iterate over the tripDocs and extract unique approvers
    tripDocs.forEach((trip) => {
      trip.tripSchema.travelRequestData.approvers.forEach((approver) => {
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

function getItinerary(itinerary){
  try {
   const extractItinerary = Object.fromEntries(
      Object.entries(itinerary)
        .filter(([category]) => category !== 'formState')
        .map(([category, items]) => {
          let mappedItems;
          if (category === 'hotels') {
            mappedItems = items.map(({ itineraryId, status, bkd_location, bkd_class, bkd_checkIn, bkd_checkOut, bkd_violations, cancellationDate, cancellationReason }) => ({
              category,
              itineraryId, status, bkd_location, bkd_class, bkd_checkIn, bkd_checkOut, bkd_violations, cancellationDate, cancellationReason,
            }));
          } else if (category === 'cabs') {
            mappedItems = items.map(({ itineraryId, status, bkd_date, bkd_class, bkd_pickupAddress, bkd_dropAddress }) => ({
              category,
              itineraryId, status, bkd_date, bkd_class, bkd_pickupAddress, bkd_dropAddress,
            }));
          } else {
            mappedItems = items.map(({ itineraryId, status, bkd_from, bkd_to, bkd_date, bkd_time, bkd_travelClass, bkd_violations }) => ({
              category,
              itineraryId, status, bkd_from, bkd_to, bkd_date, bkd_time, bkd_travelClass, bkd_violations,
            }));
          }

          return [category, mappedItems];
        })
    );
    return extractItinerary;
  } catch (error) {
    
  }
}

const getLastMonthTrips = async (tenantId, empId) => {
    try {
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() -1, today.getDate());
      console.log("today date", today , "last month", lastMonth ,"tenantId", tenantId, "empId", empId)

      const tripDocs = await reporting.find({
        'tripSchema.tenantId': tenantId,
        'tripSchema.createdBy.empId': empId,
        'tripSchema.tripStartDate': { $gte: lastMonth, $lte: today },
      }).lean().exec();
  
    console.log("trip in last month", tripDocs)
      const trips = tripDocs.map(trip => {
        const { tripSchema } = trip;
        const { travelRequestData, cashAdvancesData, travelExpenseData, expenseAmountStatus, tripId, tripNumber, tripStartDate, tripCompletionDate ,tripStatus} = tripSchema || {};
        const { totalCashAmount, totalRemainingCash } = expenseAmountStatus || {};
        const { travelRequestId, travelRequestNumber, travelRequestStatus, tripPurpose,createdBy,tripName, isCashAdvanceTaken,travelType,approvers, itinerary } = travelRequestData || {};
  
        const itineraryToSend = Object.fromEntries(
          Object.entries(itinerary)
            .filter(([category]) => category !== 'formState')
            .map(([category, items]) => {
              let mappedItems;
              if (category === 'hotels') {
                mappedItems = items.map(({ itineraryId, status, bkd_location, bkd_class, bkd_checkIn, bkd_checkOut, bkd_violations, cancellationDate, cancellationReason }) => ({
                  category,
                  itineraryId, status, bkd_location, bkd_class, bkd_checkIn, bkd_checkOut, bkd_violations, cancellationDate, cancellationReason,
                }));
              } else if (category === 'cabs') {
                mappedItems = items.map(({ itineraryId, status, bkd_date, bkd_class, bkd_pickupAddress, bkd_dropAddress }) => ({
                  category,
                  itineraryId, status, bkd_date, bkd_class, bkd_pickupAddress, bkd_dropAddress,
                }));
              } else {
                mappedItems = items.map(({ itineraryId, status, bkd_from, bkd_to, bkd_date, bkd_time, bkd_travelClass, bkd_violations }) => ({
                  category,
                  itineraryId, status, bkd_from, bkd_to, bkd_date, bkd_time, bkd_travelClass, bkd_violations,
                }));
              }
  
              return [category, mappedItems];
            })
        );
  
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
  
    //   console.log("trips", trips);
      return trips;
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

    const docs = await reporting.find({
      'reimbursementSchema.tenantId': tenantId,
      'reimbursementSchema.createdBy.empId': empId,
      'reimbursementSchema.expenseSubmissionDate': { $gte: lastMonth, $lte: today },
    }).lean().exec();

    if(!docs){
      return { message: 'There are no reimbursement found for the user' };
    } else {
      const extractDocs = docs.map(doc => doc.reimbursementSchema)
      return extractDocs
    }
  } catch (error) {
    console.error("Error in fetching employee Reporting:", error);
    throw new Error('Error in fetching employee Reporting');
  }
};


const getTripForEmployee = async (tenantId, empId) => {
    console.log("entering trips db")
  try {
      const tripDocs = await reporting.find({
        $or: [
          { 
            'tripSchema.tenantId': tenantId,
            'tripSchema.travelRequestData.createdBy.empId': empId,
            $or: [
              { 'tripSchema.tripStatus': { $in: ['transit', 'completed', 'closed'] } },
              { 'tripSchema.travelExpenseData.expenseHeaderStatus': 'rejected' },
              { 'tripSchema.cashAdvanceData.cashAdvanceStatus': { $nin: ['rejected'] }},
            ],
          },
          { 'reimbursementSchema.createdBy.empId': empId }, 
        ],
      }).lean().exec();
      

      if (!tripDocs || tripDocs.length === 0) {
          return { message: 'There are no trips found for the user' };
      } 
 console.log("tripDocs............", tripDocs)

      const transitTrips = tripDocs
          .filter(trip => trip?.tripSchema?.tripStatus === 'transit')
          .map(trip => {
            console.log("each trip", trip)
            const { tripSchema} = trip
              const {travelRequestData, cashAdvancesData, travelExpenseData, expenseAmountStatus,  tripId, tripNumber, tripStartDate,tripCompletionDate} = tripSchema || {};
              const { totalCashAmount, totalRemainingCash } = expenseAmountStatus ||  {};
              const {travelRequestId,travelRequestNumber,travelRequestStatus,tripPurpose, isCashAdvanceTaken, itinerary} = travelRequestData || {};
        
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
                //   totalCashAmount,
                //   totalRemainingCash,
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
          console.log("transitTrips", transitTrips)

      const completedTrips = tripDocs
        //   .filter(trip => trip?.tripSchema?.tripStatus === 'completed' && trip?.tripSchema?.travelExpenseData && trip?.tripSchema?.travelExpenseData?.length > 0 )
        .filter(trip => (trip?.tripSchema?.tripStatus === 'completed' || trip?.tripSchema?.tripStatus === 'closed') && trip?.tripSchema?.travelExpenseData && trip?.tripSchema?.travelExpenseData?.length > 0 )
          .flatMap(trip => trip.tripSchema.travelExpenseData.map(({ tripId, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus }) => ({
              tripId,
              tripPurpose: trip.tripSchema.travelRequestData.tripPurpose || '',
              expenseHeaderId: expenseHeaderId || '',
              expenseHeaderNumber: expenseHeaderNumber || '',
              expenseHeaderStatus:expenseHeaderStatus|| '',
          })));

          const rejectedTrips = tripDocs
          .filter(trip => trip?.tripSchema?.tripStatus === 'rejected')
          .flatMap(trip => {
              console.log("travelExpenseData", trip.tripSchema.travelExpenseData);
              return trip.tripSchema.travelExpenseData.map(({ tripId, tripNumber, expenseHeaderId, expenseHeaderNumber, expenseAmountStatus }) => ({
                  tripId,
                  tripPurpose: trip.tripSchema.tripPurpose,
                  tripNumber,
                  expenseHeaderId,
                  expenseHeaderNumber,
                  expenseAmountStatus
              }));
          });

          const reimbursements = tripDocs
          .filter(trip => {
            console.log("trip after filter", trip);
            // Assuming createdBy is an object with empId property
            return trip?.reimbursementSchema?.createdBy?.empId === empId;
          })
          .flatMap(trip => {
            console.log("before reimbursement schema:", trip);
            const { expenseHeaderId, createdBy, expenseHeaderNumber, expenseHeaderStatus } = trip.reimbursementSchema;
            return [{
              expenseHeaderId,
              createdBy,
              expenseHeaderNumber,
              expenseHeaderStatus
            }];
          });
        
        console.log("reimbursements reports:", reimbursements);
        
        const trips = {           
            transitTrips,
            completedTrips,
            }

          return {
            trips,reimbursements
        };
  } catch (error) {
      console.error("Error in fetching employee Reporting:", error);
      throw new Error ( { error: 'Error in fetching employee Reporting' });
  }
};

const tripStatusSchema = Joi.object({
  tripStatuses: Joi.array().items(
    Joi.string().valid(
      'upcoming',
      'modification',
      'transit',
      'completed',
      'paid and cancelled',
      'cancelled',
      'recovered'
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
        'tripSchema.tenantId': tenantId,
        'tripSchema.travelRequestData.createdBy.empId': empId,
        'tripSchema.tripStatus': { $in: tripStatuses }
      };
  
      // Add the tripCompletionDate filter only if it's present in the request body
      if (tripCompletionDate) {
        query['tripSchema.tripCompletionDate'] = tripCompletionDate;
      }

      // Add startDate and endDate filters if both are present
       if (startDate && endDate) {
        query['tripSchema.tripCompletionDate'] = { $gte: startDate, $lte: endDate };
      }

      if(travelType){
        query['tripSchema.travelRequestData.travelType'] = travelType
      }
  
      const tripDocs = await reporting.find(query).lean().exec();
  
      if (!tripDocs || tripDocs.length === 0) {
        return res.status(200).json({ message: 'No Trips found for this filter, update the filter and try again', success: 'true' });
      } else{
        console.log("tripDocs", tripDocs)
        const trips = tripDocs
        // .filter(trip => tripStatuses.includes(trip?.tripSchema?.tripStatus) && trip?.tripSchema?.tripCompletionDate === tripCompletionDate)
        .map(trip => {
          const { tripSchema } = trip;
          const { travelRequestData, cashAdvancesData, travelExpenseData, expenseAmountStatus, tripId, tripNumber, tripStartDate, tripCompletionDate } = tripSchema || {};
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




