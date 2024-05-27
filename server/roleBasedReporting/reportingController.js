import reporting from '../models/reportingSchema.js';
import hrmaster from '../models/hrCompanySchema.js';
import Joi from 'joi';

const getEmployeeRoles = async (tenantId, empId) => {
    const toString = empId.toString();
    const hrDocument = await hrmaster.findOne({
        'tenantId': tenantId,
        'employees.employeeDetails.employeeId': empId,
    });
    if (!hrDocument) {
        throw new Error("Error in fetching company details, company not found");
    }
    const employee = hrDocument?.employees.find(emp => emp.employeeDetails.employeeId === empId);
    if (!employee || !employee.employeeRoles) {
        throw new Error("Employee roles not found");
    }
    return employee.employeeRoles;
};

export const roleBasedLayout = async (req, res) => {
    try {
      const { tenantId, empId } = req.params;
  
      // Input validation
      if (!tenantId || !empId) {
        return res.status(400).json({ error: "Invalid input parameters" });
      }
  
      const reportingViews = await getReportingViews(tenantId, empId);
  
      // Send response
      return res.status(200).json(reportingViews);
    } catch (error) {
      console.error("Error:", error);
      // Handle the error, but do not send another response
      return;
    }
};


const getReportingViews = async (tenantId, empId) => {
    try {
        const employeeRoles = await getEmployeeRoles(tenantId, empId);
        const layoutFunctions = {
            employee: async () => employeeLayout(tenantId, empId),
            // employeeManager: async () => managerLayout(tenantId, empId),
            // employee: async () => {},
            employeeManager: async () => {},
            // finance: async () => financeLayout(tenantId, empId),
            // businessAdmin: async () => businessAdminLayout(tenantId, empId),
            // superAdmin: async () => superAdminLayout(tenantId, empId)
            finance: async() => {message:"Finance Layout "},
            superAdmin: async () => { message:"SuperAdmin Layout"},
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
    // console.log("Entering employeeLayout function...", tenantId, empId);
  try {
    //   const travelStandAlone = await travelStandAloneForEmployee(tenantId, empId);
    // // console.log("employeeLayout --travelStandAlone", travelStandAlone);
    // const travelWithCash = await travelWithCashForEmployee(tenantId, empId);
    //  console.log("employeeLayout---travelWithCash", travelWithCash);
    // const trip = await getTripForEmployee(tenantId, empId);
    const monthlyTrips = await getLastMonthTrips(tenantId, empId);
    console.log("reporting trip", monthlyTrips)
    //   const {rejectedCashAdvances} = travelWithCash
    // const travelRequestCombined = [ ...travelStandAlone.travelRequests, ...travelWithCash.travelRequests]
    // const rejectedTravelRequestsCombined = [ ...travelStandAlone.rejectedTravelRequests, ...travelWithCash.rejectedTravelRequests]
    // const employee = { travelRequests :travelRequestCombined,rejectedTravelRequests:rejectedTravelRequestsCombined , rejectedCashAdvances , ...trip }
    // const testing = {travelStandAlone, travelWithCash}
      return monthlyTrips;
  } catch (error) {
      console.error("Error:", error);
      throw new Error({ message: 'Internal server error' });
  }
};


const getLastMonthTrips = async (tenantId, empId) => {
    try {
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      console.log("today date", today , "last month", lastMonth)

      const tripDocs = await reporting.find({
        'tripSchema.tenantId': tenantId,
        'tripSchema.createdBy.empId': empId,
        'tripSchema.tripCompletionDate': { $gte: lastMonth, $lte: today },
      }).lean().exec();
  
    //console.log("trip in last month", tripDocs)
      const trips = tripDocs.map(trip => {
        const { tripSchema } = trip;
        const { travelRequestData, cashAdvancesData, travelExpenseData, expenseAmountStatus, tripId, tripNumber, tripStartDate, tripCompletionDate } = tripSchema || {};
        const { totalCashAmount, totalremainingCash } = expenseAmountStatus || {};
        const { travelRequestId, travelRequestNumber, travelRequestStatus, tripPurpose, isCashAdvanceTaken, itinerary } = travelRequestData || {};
  
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
  
    //   console.log("trips", trips);
      return trips;
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
              const { totalCashAmount, totalremainingCash } = expenseAmountStatus ||  {};
              const {travelRequestId,travelRequestNumber,travelRequestStatus,tripPurpose, isCashAdvanceTaken, itinerary} = travelRequestData || {};
        
              const itineraryToSend = Object.fromEntries(
                Object.entries(itinerary)
                    .filter(([category]) => category !== 'formState')
                    .map(([category, items]) => {
                        let mappedItems;
                        if (category === 'hotels') {
                            mappedItems = items.map(({
                                itineraryId, status, bkd_location, bkd_class, bkd_checkIn, bkd_checkOut, bkd_violations, cancellationDate, cancellationReason,
                            }) => ({
                                category,
                                itineraryId, status, bkd_location, bkd_class, bkd_checkIn, bkd_checkOut, bkd_violations, cancellationDate, cancellationReason,
                            }));
                        } else if (category === 'cabs') {
                            mappedItems = items.map(({
                                itineraryId, status, bkd_date, bkd_class, bkd_pickupAddress, bkd_dropAddress,
                            }) => ({
                                category,
                                itineraryId, status, bkd_date, bkd_class, bkd_pickupAddress, bkd_dropAddress,
                            }));
                        } else {
                            mappedItems = items.map(({
                                itineraryId, status, bkd_from, bkd_to, bkd_date, bkd_time, bkd_travelClass, bkd_violations,
                            }) => ({
                                category,
                                itineraryId, status, bkd_from, bkd_to, bkd_date, bkd_time, bkd_travelClass, bkd_violations,
                            }));
                        }
            
                        return [category, mappedItems];
                    })
            );

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
                //   totalremainingCash,
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
  endDate: Joi.date().optional()
});


// Define the schema for validating request parameters
const paramsSchema = Joi.object({
  tenantId: Joi.string().required(),
  empId: Joi.string().required()
});


//get trips by tripCompletionDate or multiple tripStatus
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
    const { tripStatuses, tripCompletionDate, startDate, endDate} = bodyValue;

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
          const { totalCashAmount, totalremainingCash } = expenseAmountStatus || {};
          const { travelRequestId, travelRequestNumber, travelRequestStatus, tripPurpose, isCashAdvanceTaken, itinerary } = travelRequestData || {};
  
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




