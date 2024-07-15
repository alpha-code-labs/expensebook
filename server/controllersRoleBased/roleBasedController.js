import Joi from "joi";
import { financeLayout } from "../controllers/financeController.js";
import dashboard from "../models/dashboardSchema.js";
import HRMaster from "../models/hrMasterSchema.js";

export const employeeSchema = Joi.object({
    tenantId: Joi.string().required(),
    empId:Joi.string().required()
});

const getEmployeeRoles = async (tenantId, empId) => {

    const hrDocument = await HRMaster.findOne({
        tenantId,
        'employees.employeeDetails.employeeId': empId,
    });
    if (!hrDocument) {
        throw new Error("HR document not found");
    }
    const employee = hrDocument?.employees.find(emp => emp.employeeDetails.employeeId === empId);
    if (!employee || !employee.employeeRoles) {
        throw new Error("Employee roles not found");
    }
    return employee.employeeRoles;
};


export const roleBasedLayout = async (req, res) => {
  try {

    const { error, value} = employeeSchema.validate(req.params)

    if(error){
        return res.status(400).json({error: error.details[0].message})
    }

    const { tenantId, empId } = value;

    // Get employee roles and execute layout functions
    const dashboardViews = await getDashboardViews(tenantId, empId);

    // Send response
    return res.status(200).json(dashboardViews);
  } catch (error) {
    console.error("Error:", error);
    // Handle the error, but do not send another response
    return;
  }
};


//----------------------------------------------------------------------------employeeRole 
const getDashboardViews = async (tenantId, empId) => {
    try {
        const employeeRoles = await getEmployeeRoles(tenantId, empId);
        const layoutFunctions = {
            employee: async () => employeeLayout(tenantId, empId),
            employeeManager: async () => managerLayout(tenantId, empId),
            finance: async () => financeLayout(tenantId, empId),
            businessAdmin: async () => businessAdminLayout(tenantId, empId),
            superAdmin: async () => superAdminLayout(tenantId, empId)
        };

        const applicableRoles = Object.keys(employeeRoles).filter(role => employeeRoles[role]);

        console.log("applicableRoles", applicableRoles)

        const dashboardViews = await Promise.all(applicableRoles.map(async role => {
            try {
                const data = await layoutFunctions[role]();
                return { [role]: data };
            } catch (error) {
                console.error("Error fetching data for role", role, "Error:", error);
                return { [role]: null }; // Handle the error case as needed
            }
        }));

        const formattedDashboardViews = dashboardViews.reduce((acc, curr) => ({ ...acc, ...curr }), {});

        return {
            dashboardViews: formattedDashboardViews,
            employeeRoles
        };
    } catch (error) {
        console.error("Error fetching dashboard views:", error);
        throw error; // Propagate the error to the caller
    }
};


const employeeLayout = async (tenantId, empId) => {
    // console.log("Entering employeeLayout function...", tenantId, empId);
try {

    const promises = [
        travelStandAloneForEmployee(tenantId, empId),
        travelWithCashForEmployee(tenantId, empId),
        getTripForEmployee(tenantId, empId),
        getAllExpensesForEmployee(tenantId, empId),
        getOverView(tenantId,empId),
        getAllCashAdvance(tenantId,empId)
    ]

    const [travelStandAlone,travelWithCash, trip,expense, allTravelRequests, allCashAdvance] = await Promise.all(promises)


    const {rejectedCashAdvances} = travelWithCash
    const { trips,reimbursements } = trip
    const { upcomingTrips,transitTrips, completedTrips,rejectedTrips} = trips
    const { allTripExpenseReports, allNonTravelReports,} = expense
    const {nonTravelCashAdvance, travelCashAdvance} = allCashAdvance


    const travelRequestCombined = [ ...travelStandAlone.travelRequests, ...travelWithCash.travelRequests]
    const rejectedTravelRequestsCombined = [ ...travelStandAlone.rejectedTravelRequests, ...travelWithCash.rejectedTravelRequests]

    //screens
    const overviewUi = {transitTrips,upcomingTrips,allTravelRequests , expense}
    const cashAdvanceUi = {...allCashAdvance}
    const expenseUi = {}

    const employee = { 
        overview:overviewUi,
        cashAdvance:cashAdvanceUi,
        travelRequests :travelRequestCombined,
        rejectedTravelRequests:rejectedTravelRequestsCombined,
        rejectedCashAdvances,
        ...trip,
        expense:expense,
    }
    return employee;
  } catch (error) {
    console.error("Error:", error);
    throw new Error({ message: 'Internal server error' });
  }
};

const getOverView = async(tenantId,empId) => {
    console.log("getOverView",tenantId,empId)
 try{

 const getAllTravelRequests = await dashboard.find({
    tenantId,
    $or:[
        {'travelRequestSchema.createdBy.empId':empId},
        {'cashAdvanceSchema.travelRequestData.createdBy.empId':empId}
    ]
}) 


if(getAllTravelRequests.length > 0){
    const travelRequests = getAllTravelRequests
    .filter(travelRequest => travelRequest?.travelRequestSchema?.createdBy?.empId === empId
        && travelRequest?.travelRequestSchema?.isCashAdvanceTaken === false
    )
    .map(travelRequest => ({
        travelRequestId: travelRequest?.travelRequestSchema?.travelRequestId,
        travelRequestNumber: travelRequest?.travelRequestSchema?.travelRequestNumber,
        tripPurposeDescription: travelRequest?.travelRequestSchema?.tripPurposeDescription,
        tripName: travelRequest?.travelRequestSchema?.tripName ?? '',
        travelRequestStatus:travelRequest?.travelRequestSchema?.travelRequestStatus,
    }))

    const travelRequestWithCash = getAllTravelRequests
    .filter(travelRequest => travelRequest?.cashAdvanceSchema?.travelRequestData?.createdBy?.empId == empId)
    .map(travelRequest => ({
        travelRequestId: travelRequest?.cashAdvanceSchema?.travelRequestData?.travelRequestId,
        travelRequestNumber: travelRequest?.cashAdvanceSchema?.travelRequestData?.travelRequestNumber,
        tripPurposeDescription:travelRequest?.cashAdvanceSchema?.travelRequestData?.tripPurposeDescription,
        tripName:travelRequest?.cashAdvanceSchema?.travelRequestData?.tripName ?? '',
        travelRequestStatus:travelRequest?.cashAdvanceSchema?.travelRequestData?.travelRequestStatus,
    }))

    const allTravelRequests = [...travelRequests, ...travelRequestWithCash]
    // console.log("allTravelRequests kaboom", allTravelRequests)

    return {allTravelRequests}
} else {
    return []
}
 } catch(error){
    console.error("Error:", error);
    throw new Error('Error in Fetching Overview')
 }
}

const getAllCashAdvance = async(tenantId,empId) => {
    try{

        const allCashReports = await dashboard.find({
            tenantId,
            'cashAdvanceSchema.cashAdvancesData.createdBy.empId':empId,
        })

        console.log("allCashReports",JSON.stringify(allCashReports, '' , 2))
        

        if(allCashReports?.length > 0){
            
            const nonTravelCashAdvance = allCashReports
            .filter(cash => cash?.cashAdvanceSchema && !cash?.cashAdvanceSchema?.hasOwnProperty('travelRequestId'))
            .map(cash => ({
                cashAdvanceId: cash?.cashAdvanceSchema?.cashAdvancesData?.cashAdvanceId,
                cashAdvanceNumber: cash?.cashAdvanceSchema?.cashAdvancesData?.cashAdvanceNumber,
                cashAdvanceStatus: cash?.cashAdvanceSchema?.cashAdvancesData?.cashAdvanceStatus,
                amountDetails: cash?.cashAdvanceSchema?.cashAdvancesData?.amountDetails,
            })).filter(Boolean)

            const travelCashAdvance = allCashReports
            .flatMap(c => c?.cashAdvanceSchema?.cashAdvancesData?.map(ad => ({
                travelRequestId: ad.travelRequestId,
                cashAdvanceId: ad.cashAdvanceId,
                cashAdvanceNumber: ad.cashAdvanceNumber,
                tripName: c?.cashAdvanceSchema?.travelRequestData?.[ad.travelRequestId]?.tripName ?? '',
                travelRequestNumber: ad.travelRequestNumber,
                amountDetails: ad.amountDetails,
              }))).filter(Boolean);

            console.log("travelCashAdvance", travelCashAdvance)
            return {nonTravelCashAdvance, travelCashAdvance}
        }
    } catch(error){
        console.error("Error:", error);
        throw new Error('Error in Fetching CashAdvance')
    }
}

//----------------travel standalone for an employee
// const travelStandAloneForEmployee = async (tenantId, empId) => {
//     console.log("Fetching travelStandAloneForEmployee...", tenantId, empId);

//     try {
//         let allTravelRequests = [];
//         let rejectedRequests = [];
//         let rejectedItineraryLines = [];

//         const travelRequestDocs = await dashboard.find({
//             'travelRequestSchema.tenantId': tenantId,
//             'createdBy.empId': empId,
//             $or: [
//                 {
//                     'travelRequestSchema.travelRequestStatus': { $in: ['draft', 'pending approval', 'approved'] },
//                 },
//                 {
//                     'travelRequestSchema.travelRequestStatus': { $in: ['rejected'] },
//                 },
//                 {
//                     'travelRequestSchema.travelRequestStatus': { $nin: ['rejected'] },
//                 },
//             ],
//         });
        

//         travelRequestDocs.forEach((travelRequest) => {
//             const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus } = travelRequest;
//             allTravelRequests.push({ travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus });
//         });

//         travelRequestDocs.forEach((travelRequest) => {
//             const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, rejectionReason } = travelRequest;
//             rejectedRequests.push({ travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, rejectionReason });
//         });

//         travelRequestDocs.forEach((travelRequest) => {
//                 const { itinerary } = travelRequest.travelRequestSchema;
            
//                 Object.keys(itinerary).forEach((category) => {

//                     itinerary[category].forEach((itineraryItem) => {
//                         if (itineraryItem.status === 'rejected') {
//                             const { itineraryId, rejectedReason, status } = itineraryItem;
//                             const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus } = travelRequest;
            
//                             rejectedItineraryLines.push({
//                                 itineraryId,
//                                 rejectedReason,
//                                 status,
//                                 travelRequestId,
//                                 travelRequestNumber,
//                                 tripPurpose,
//                                 travelRequestStatus,
//                             });
//                         }
//                     });
//                 });
//             });

//             const travelRequests = { ...allTravelRequests };
//             const rejectedTravelRequests = { ...rejectedRequests, ...rejectedItineraryLines };
        
//             let message;
//             if (!travelRequests.length && !rejectedTravelRequests.length) {
//                 message = 'No travel request found and no rejected travel request found';
//             } else if (!travelRequests.length) {
//                 message = 'No travel request found';
//             } else if (!rejectedTravelRequests.length) {
//                 message = 'No rejected travel request found';
//             }
        
//             return { 
//                 travelRequests: travelRequests.length ? travelRequests : [],
//                 rejectedTravelRequests: rejectedTravelRequests.length ? rejectedTravelRequests : [],
//                 message
//             };

//     } catch (error) {
//       console.error("Error in fetching employee Dashboard:", error);
//       // Return an object indicating the error occurred
//       throw new Error({ error: 'Error in fetching employee Dashboard' });
//     }
// };
const travelStandAloneForEmployee = async (tenantId, empId) => {
    // console.log("Fetching travelStandAloneForEmployee...", tenantId, empId);

    try {
        const travelRequestDocs = await dashboard.find({
            'travelRequestSchema.tenantId': tenantId,
            'travelRequestSchema.createdBy.empId': empId,
            'travelRequestSchema.isCashAdvanceTaken':false,
            $or: [
                { 'travelRequestSchema.travelRequestStatus': { $in: ['draft', 'pending approval', 'approved'] } },
                { 'travelRequestSchema.travelRequestStatus': { $in: ['rejected'] } },
                { 'travelRequestSchema.travelRequestStatus': { $nin: ['rejected'] } },
            ],
        });

        if(travelRequestDocs?.length>0){
            // console.log("travel standAlone From db....",travelRequestDocs)

            const allTravelRequests = travelRequestDocs
            .filter(({travelRequestSchema:{travelRequestStatus}}) => travelRequestStatus !== 'rejected' && travelRequestStatus !== 'booked')
            .map(({ travelRequestSchema: { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, isCashAdvanceTaken } }) => ({
                travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus , isCashAdvanceTaken
            }));
            
    
            const rejectedRequests = travelRequestDocs.filter(({ travelRequestSchema: { travelRequestStatus } }) => travelRequestStatus === 'rejected').map(({travelRequestSchema:{ travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, rejectionReason, isCashAdvanceTaken } }) => ({
                travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, rejectionReason , isCashAdvanceTaken
            }));
    
            // const rejectedItineraryLines = [];
            // travelRequestDocs.filter(({travelRequestSchema:{travelRequestStatus}}) => travelRequestStatus !== 'rejected')
            // .forEach(({ travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, travelRequestSchema: { itinerary } }) => {
            //     Object.values(itinerary).flat().forEach(({ itineraryId, rejectedReason, status }) => {
            //         if (status === 'rejected') {
            //             rejectedItineraryLines.push({
            //                 itineraryId, rejectedReason, status, travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus
            //             });
            //         }
            //     });
            // });

            let rejectedItineraryLines = [];

            travelRequestDocs.filter(({travelRequestSchema:{travelRequestStatus}}) => travelRequestStatus !== 'rejected')
                .forEach(({travelRequestSchema: { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus,isCashAdvanceTaken, itinerary } }) => {
                    Object.entries(itinerary).forEach(([itineraryType,itineraryArray]) =>
                    itineraryArray.forEach(({itineraryId, rejectionReason, status}) => {        
                         if (status === 'rejected') {
                            // Extract the necessary details and add them to the rejectedItineraryLines array
                            rejectedItineraryLines.push({
                                travelRequestId,
                                travelRequestNumber,
                                tripPurpose,
                                travelRequestStatus,
                                isCashAdvanceTaken,
                                itineraryType,
                                itineraryId,
                                rejectionReason,
                                status,
                            });
                        }
                    }));
                });      

    
            const message = !allTravelRequests.length && !rejectedRequests.length && !rejectedItineraryLines.length
                ? 'No travel request found and no rejected travel request found'
                : !allTravelRequests.length ? 'No travel request found'
                : !rejectedRequests.length ? 'No rejected travel request found'
                : '';
            
                const rejectedTravelRequests = [...rejectedRequests, ...rejectedItineraryLines];

            return {
                travelRequests: allTravelRequests,
                rejectedTravelRequests,
                message
            };

        } else{
            return {
                travelRequests: [],
                rejectedTravelRequests: [],
                message: 'Raise a travel request'
            };
        }
    } catch (error) {
        console.error("Error in fetching employee Dashboard:", error);
        throw new Error('Error in fetching employee Dashboard');
    }
};

//----------------travel with cash for an employee

const travelWithCashForEmployee = async (tenantId, empId) => {
    // console.log("entering travelWithCashForEmploy", tenantId, empId);
    try {
      const query = {
        'cashAdvanceSchema.travelRequestData.tenantId': tenantId,
        'cashAdvanceSchema.travelRequestData.createdBy.empId': empId,
        $or: [
          {
            'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $in: ['draft', 'pending approval', 'approved'] },
            'cashAdvanceSchema.cashAdvanceData.cashAdvanceStatus': { $nin: ['rejected'] },
          },
          { 'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $in: ['rejected'] } },
          { 'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $nin: ['rejected'] } },
          { 'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus': { $in: ['rejected'] } },
        ],
      };
  
    //   console.log("Fetching cashSchema ...", tenantId, empId);
      const travelRequestDocs = await dashboard.find(query);
    //   console.log("Fetched cashSchema:", travelRequestDocs);

    if (travelRequestDocs?.length === 0) {
        return  {
            travelRequests: [],
            rejectedTravelRequests: [],
            rejectedCashAdvances: [],
            message: 'Raise a travel request'
    }} else{

    // const processTravelRequests = (docs) => {
    //     // First, filter out travel requests where travelRequestStatus is not 'rejected'
    //     const filteredDocs = docs.filter(travelRequest => {
    //         const { travelRequestStatus } = travelRequest.cashAdvanceSchema.travelRequestData;
    //         return travelRequestStatus !== 'rejected' && travelRequestStatus !== 'booked';
    //        });
           
       
    //     // Then, map over the filtered documents to transform them into the desired structure
    //     return filteredDocs.map(travelRequest => {
    //        console.log("each travelRequest .........", travelRequest.cashAdvanceSchema.travelRequestData.itineraryData);
    //        const { cashAdvanceSchema } = travelRequest;
    //        const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus } = cashAdvanceSchema.travelRequestData;
    //        const cashAdvancesData = cashAdvanceSchema?.cashAdvancesData || [];
       
    //        const cashAdvances = cashAdvancesData.map(({ cashAdvanceId, cashAdvanceNumber, amountDetails }) => ({
    //          cashAdvanceId,
    //          cashAdvanceNumber,
    //          amountDetails,
    //        }));
       
    //        return {
    //          travelRequestId,
    //          travelRequestNumber,
    //          tripPurpose,
    //          travelRequestStatus,
    //          cashAdvances,
    //        };
    //     });
    //    };
       
    //    const allTravelRequests = processTravelRequests(travelRequestDocs);
    const processTravelRequests = (docs) => {
        // First, filter out travel requests where travelRequestStatus is not 'rejected'
        const filteredDocs = docs.filter(travelRequest => {
           const { travelRequestStatus } = travelRequest.cashAdvanceSchema.travelRequestData;
           return travelRequestStatus !== 'rejected' && travelRequestStatus !== 'booked';
        });
       
        // Then, map over the filtered documents to transform them into the desired structure
        return filteredDocs.map(travelRequest => {
           const { cashAdvanceSchema } = travelRequest;
           const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, isCashAdvanceTaken } = cashAdvanceSchema.travelRequestData;
           const cashAdvancesData = cashAdvanceSchema?.cashAdvancesData || [];
       
           const cashAdvances = cashAdvancesData.map(({ cashAdvanceId, cashAdvanceNumber,cashAdvanceStatus, amountDetails }) => ({
             cashAdvanceId,
             cashAdvanceNumber,
             cashAdvanceStatus,
             amountDetails
            //  amountDetails: amountDetails.map(detail => ({
            //    amount: detail.amount,
            //    shortName: detail.currency.shortName, 
            //    mode: detail.mode
            //  })),
           }));
       
           return {
             travelRequestId,
             travelRequestNumber,
             tripPurpose,
             isCashAdvanceTaken,
             travelRequestStatus,
             cashAdvances,
           };
        });
       };
       
       const allTravelRequests = processTravelRequests(travelRequestDocs);
       
       
    // console.log("Processed travelRequestDocs: allTravelRequests .....", allTravelRequests);

    // const processRejectedTravelRequests = (docs) => {
    //     // First, filter out travel requests where travelRequestStatus is not 'rejected'
    //     const filteredDocs = docs.filter(travelRequest => {
    //         const { travelRequestStatus } = travelRequest.cashAdvanceSchema.travelRequestData;
    //         return travelRequestStatus == 'rejected' ;
    //        });
           
       
    //     // Then, map over the filtered documents to transform them into the desired structure
    //     return filteredDocs.map(travelRequest => {
    //     //    console.log("each travelRequest .........", travelRequest);
    //        const { cashAdvanceSchema } = travelRequest;
    //        const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus } = cashAdvanceSchema.travelRequestData;
    //        const cashAdvancesData = cashAdvanceSchema?.cashAdvancesData || [];
       
    //        const cashAdvances = cashAdvancesData.map(({ cashAdvanceId, cashAdvanceNumber, amountDetails }) => ({
    //          cashAdvanceId,
    //          cashAdvanceNumber,
    //          amountDetails,
             
    //        }));
       
    //        return {
    //          travelRequestId,
    //          travelRequestNumber,
    //          tripPurpose,
    //          travelRequestStatus,
    //          cashAdvances,
    //        };
    //     });
    //    };
       
    //    const rejectedTravelRequestsAll = processRejectedTravelRequests(travelRequestDocs);
    const processRejectedTravelRequests = (docs) => {
        // First, filter out travel requests where travelRequestStatus is 'rejected'
        const filteredDocs = docs.filter(travelRequest => {
           const { travelRequestStatus } = travelRequest.cashAdvanceSchema.travelRequestData;
           return travelRequestStatus === 'rejected';
        });
       
        // Then, map over the filtered documents to transform them into the desired structure
        return filteredDocs.map(travelRequest => {
           const { cashAdvanceSchema } = travelRequest;
           const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, isCashAdvanceTaken } = cashAdvanceSchema.travelRequestData;
           const cashAdvancesData = cashAdvanceSchema?.cashAdvancesData || [];
       
           const cashAdvances = cashAdvancesData.map(({ cashAdvanceId, cashAdvanceNumber,cashAdvanceStatus, amountDetails }) => ({
             cashAdvanceId,
             cashAdvanceNumber,
             cashAdvanceStatus,
             amountDetails,
            //  amountDetails: amountDetails.map(detail => ({
            //    amount: detail.amount,
            //    shortName: detail.currency.shortName, 
            //    mode: detail.mode, 
            //  })),
           }));
       
           return {
             travelRequestId,
             travelRequestNumber,
             tripPurpose,
             travelRequestStatus,
             isCashAdvanceTaken,
             cashAdvances,
           };
        });
       };
       
       const rejectedTravelRequestsAll = processRejectedTravelRequests(travelRequestDocs);
       
  
       let rejectedItineraryLines = [];

       travelRequestDocs.filter(({cashAdvanceSchema:{travelRequestData:{travelRequestStatus}}}) => travelRequestStatus !== 'rejected')
           .forEach(({cashAdvanceSchema:{travelRequestData: { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus,isCashAdvanceTaken, itinerary }} }) => {
               // Iterate over each key in the itinerary object
               Object.entries(itinerary).forEach(([itineraryType, itineraryArray]) => {
                   // Iterate over each item in the array under the current key
                   itineraryArray.forEach(({ itineraryId, rejectionReason, status }) => {
                       if (status === 'rejected') {
                           // Extract the necessary details and add them to the rejectedItineraryLines array
                           rejectedItineraryLines.push({
                              travelRequestId,
                              travelRequestNumber,
                              tripPurpose,
                               travelRequestStatus,
                               isCashAdvanceTaken,
                               itineraryType, 
                               itineraryId,
                               rejectionReason,
                               status,
                           });
                       }
                   });
               });
           });
       
       
    
    //   console.log("Processed rejectedItineraryLines:", rejectedItineraryLines);
  
     // Assuming travelRequestDocs is an array of documents returned from your MongoDB query
const filteredDocs = travelRequestDocs.filter(doc => 
    doc.cashAdvanceSchema.cashAdvancesData.some(cashAdvance => 
       cashAdvance.cashAdvanceStatus === 'rejected'
    )
   );
   
   const rejectedCashAdvances = filteredDocs.flatMap(doc =>
    doc.cashAdvanceSchema.cashAdvancesData
      .filter(cashAdvance => cashAdvance.cashAdvanceStatus === 'rejected')
      .map(({ travelRequestId, cashAdvanceId, cashAdvanceNumber, amountDetails, cashAdvanceStatus, rejectionReason }) => ({
        travelRequestId,
        cashAdvanceId,
        cashAdvanceNumber,
        cashAdvanceStatus,
        rejectionReason,
        amountDetails,
        // amountDetails: amountDetails.map(detail => ({
        //   amount: detail.amount,
        //   shortName: detail.currency.shortName
        // }))
      }))
  );
  
   
    //   console.log("Processed rejectedCashAdvances:", rejectedCashAdvances);
    // const rejectedCashAdvances = filteredDocs.flatMap(doc => 
    //     doc.cashAdvanceSchema.cashAdvancesData
    //        .filter(cashAdvance => cashAdvance.cashAdvanceStatus === 'rejected')
    //        .map(({ travelRequestId, cashAdvanceId, cashAdvanceNumber, amountDetails, cashAdvanceStatus, rejectionReason }) => {
    //          // Extract amount and shortName from each object inside amountDetails array
    //          const extractedAmountDetails = amountDetails.map(detail => ({
    //            amount: detail.amount,
    //            shortName: detail.currency.shortName, 
    //          }));
    
    //          return {
    //            travelRequestId,
    //            cashAdvanceId,
    //            cashAdvanceNumber,
    //            cashAdvanceStatus,
    //            amountDetails: extractedAmountDetails,
    //            rejectionReason,
    //          };
    //        })
    // );
    
      const travelRequests = [...allTravelRequests];
      const rejectedTravelRequests = [...rejectedTravelRequestsAll, ...rejectedItineraryLines,];
      
    //   console.log("Returning data:", { travelRequests, rejectedTravelRequests , rejectedCashAdvances});
      return { travelRequests, rejectedTravelRequests, rejectedCashAdvances };
    } } catch (error) {
      console.error("Error in fetching employee Dashboard:", error);
      // Return an object indicating the error occurred
      throw new Error({ error: 'Error in fetching employee Dashboard' });
    }
};


const getTripForEmployee = async (tenantId, empId) => {
    // console.log("entering trips db")
  try {

      const tripDocs = await dashboard.find({
        $or: [
          { 
            'tripSchema.tenantId': tenantId,
            'tripSchema.travelRequestData.createdBy.empId': empId,
            $or: [
              { 'tripSchema.tripStatus': { $in: ['transit', 'upcoming', 'completed'] } },
              { 'tripSchema.travelExpenseData.expenseHeaderStatus': 'rejected' },
              { 'tripSchema.cashAdvanceData.cashAdvanceStatus': { $nin: ['rejected'] }},
            ],
          },
          { 'reimbursementSchema.createdBy.empId': empId }, 
        ],
      }).lean().exec();

      if (tripDocs?.length === 0) {
          return { message: 'There are no trips found for the user' };
      } 
// console.log("tripDocs............", tripDocs)

    const upcomingTrips = tripDocs
    .filter(trip => trip?.tripSchema?.tripStatus === 'upcoming')
    .map(trip => {
    //   console.log("each trip", trip)
        const { tripSchema} = trip
        const {travelRequestData, cashAdvancesData, travelExpenseData, expenseAmountStatus, tripId, tripNumber, tripStartDate,tripCompletionDate} = tripSchema || {};
        const { totalCashAmount, totalRemainingCash } = expenseAmountStatus ||  {};
        const {travelRequestId,travelRequestNumber, tripName, travelRequestStatus,tripPurpose, isCashAdvanceTaken, itinerary} = travelRequestData || {};

        const itineraryToSend = Object.fromEntries(
            Object.entries(itinerary)
                .filter(([category]) => category !== 'formState')
                .map(([category, items]) => {
                    let mappedItems;
                    if (category === 'hotels') {
                        mappedItems = items.map(({
                            itineraryId, status, bkd_location, bkd_class, bkd_checkIn, bkd_checkOut, bkd_violations, cancellationDate, cancellationReason,needBreakfast,needLunch,needDinner,needNonSmokingRoom
                        }) => ({
                            category,
                            itineraryId, status, bkd_location, bkd_class, bkd_checkIn, bkd_checkOut, bkd_violations, cancellationDate, cancellationReason,needBreakfast,needLunch,needDinner,needNonSmokingRoom
                        }));
                    } else if (category === 'cabs') {
                        mappedItems = items.map(({
                            itineraryId, status, bkd_date, bkd_returnDate, bkd_isFullDayCab, bkd_class, bkd_pickupAddress, bkd_dropAddress,
                        }) => ({
                            category,
                            itineraryId, status, bkd_date,bkd_returnDate, bkd_isFullDayCab, bkd_class, bkd_pickupAddress, bkd_dropAddress,
                        }));
                    } else {
                        mappedItems = items.map(({
                            itineraryId, status, bkd_from, bkd_to, bkd_date, bkd_time,bkd_returnTime, bkd_travelClass, bkd_violations,
                        }) => ({
                            category,
                            itineraryId, status, bkd_from, bkd_to, bkd_date, bkd_time,bkd_returnTime, bkd_travelClass, bkd_violations,
                        }));
                    }
        
                    return [category, mappedItems];
                })
        );

        // console.log("itineraryTosend.........................................", itineraryToSend)
        return {
            tripId: tripId ?? '', 
            tripNumber: tripNumber ?? '', 
            tripName: tripName ?? '',
            travelRequestId,
            travelRequestNumber,
            tripPurpose,
            tripStartDate,
            tripCompletionDate,
            travelRequestStatus,
            isCashAdvanceTaken,
            totalCashAmount,
            totalRemainingCash,
            // cashAdvances: isCashAdvanceTaken ? (cashAdvancesData ? cashAdvancesData.map(({ cashAdvanceId, cashAdvanceNumber, amountDetails, cashAdvanceStatus }) => ({
            //     cashAdvanceId,
            //     cashAdvanceNumber,
            //     amountDetails,
            //     cashAdvanceStatus
            // })) : []) : [], 
            // travelExpenses: travelExpenseData,
            itinerary: itineraryToSend
        };
    });
    // console.log("upcomingTrips", upcomingTrips)

      const transitTrips = tripDocs
          .filter(trip => trip?.tripSchema?.tripStatus === 'transit')
          .map(trip => {
            // console.log("each trip", trip)
            const { tripSchema} = trip
              const {travelRequestData, cashAdvancesData, travelExpenseData, expenseAmountStatus,  tripId, tripNumber, tripStartDate,tripCompletionDate} = tripSchema || {};
              const { totalCashAmount, totalRemainingCash } = expenseAmountStatus ||  {};
              const {travelRequestId,travelRequestNumber,travelRequestStatus,tripName,tripPurpose, isCashAdvanceTaken, itinerary} = travelRequestData || {};
        
              const itineraryToSend = Object.fromEntries(
                Object.entries(itinerary)
                    .filter(([category]) => category !== 'formState')
                    .map(([category, items]) => {
                        let mappedItems;
                        if (category === 'hotels') {
                            mappedItems = items.map(({
                                itineraryId, status, bkd_location, bkd_class, bkd_checkIn, bkd_checkOut, bkd_violations, cancellationDate, cancellationReason,needBreakfast,needLunch,needDinner,needNonSmokingRoom
                            }) => ({
                                category,
                                itineraryId, status, bkd_location, bkd_class, bkd_checkIn, bkd_checkOut, bkd_violations, cancellationDate, cancellationReason,needBreakfast,needLunch,needDinner,needNonSmokingRoom
                            }));
                        } else if (category === 'cabs') {
                            mappedItems = items.map(({
                                itineraryId, status, bkd_date, bkd_returnDate, bkd_isFullDayCab, bkd_class, bkd_pickupAddress, bkd_dropAddress,
                            }) => ({
                                category,
                                itineraryId, status, bkd_date,bkd_returnDate, bkd_isFullDayCab, bkd_class, bkd_pickupAddress, bkd_dropAddress,
                            }));
                        } else {
                            mappedItems = items.map(({
                                itineraryId, status, bkd_from, bkd_to, bkd_date, bkd_time,bkd_returnTime, bkd_travelClass, bkd_violations,
                            }) => ({
                                category,
                                itineraryId, status, bkd_from, bkd_to, bkd_date, bkd_time,bkd_returnTime, bkd_travelClass, bkd_violations,
                            }));
                        }
            
                        return [category, mappedItems];
                    })
            );

            return {
                tripId: tripId ?? '',
                tripNumber: tripNumber ?? '',
                tripName: tripName ?? '',
                travelRequestId: travelRequestId ?? '',
                travelRequestNumber: travelRequestNumber ?? '',
                tripPurpose: tripPurpose ?? '',
                tripStartDate: tripStartDate ?? '',
                tripCompletionDate: tripCompletionDate ?? '',
                travelRequestStatus: travelRequestStatus ?? '',
                isCashAdvanceTaken: isCashAdvanceTaken ?? false,
                // cashAdvances: isCashAdvanceTaken
                //   ? (cashAdvancesData?.length
                //       ? cashAdvancesData.map(({ cashAdvanceId, cashAdvanceNumber, amountDetails, cashAdvanceStatus }) => ({
                //           cashAdvanceId: cashAdvanceId ?? '',
                //           cashAdvanceNumber: cashAdvanceNumber ?? '',
                //           amountDetails: amountDetails ?? '',
                //           cashAdvanceStatus: cashAdvanceStatus ?? '',
                //         }))
                //       : [])
                //   : [],
                // travelExpenses: travelExpenseData?.length
                //   ? travelExpenseData.map(({ expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus }) => ({
                //       expenseHeaderId: expenseHeaderId ?? '',
                //       expenseHeaderNumber: expenseHeaderNumber ?? '',
                //       expenseHeaderStatus: expenseHeaderStatus ?? '',
                //     }))
                //   : [],
                itinerary: itineraryToSend,
              };
              
          });
        //   console.log("transitTrips", transitTrips)

      const completedTrips = tripDocs
          .filter(trip => trip?.tripSchema?.tripStatus === 'completed' && trip?.tripSchema?.travelExpenseData && trip?.tripSchema?.travelExpenseData?.length > 0 )
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
            // console.log("trip after filter", trip);
            // Assuming createdBy is an object with empId property
            return trip?.reimbursementSchema?.createdBy?.empId === empId;
          })
          .flatMap(trip => {
            // console.log("before reimbursement schema:", trip);
            const { expenseHeaderId, createdBy, expenseHeaderNumber, expenseHeaderStatus } = trip.reimbursementSchema;
            return [{
              expenseHeaderId,
              createdBy,
              expenseHeaderNumber,
              expenseHeaderStatus
            }];
          });
        
        // console.log("reimbursements reports:", reimbursements);
        
        const trips = {           
            upcomingTrips,
            transitTrips,
            completedTrips,
            rejectedTrips, }

          return {
            trips,reimbursements
        };
  } catch (error) {
      console.error("Error in fetching employee Dashboard:", error);
      throw new Error ( { error: 'Error in fetching employee Dashboard' });
  }
};

const getAllExpensesForEmployee = async (tenantId, empId) => {
    // console.log("entering trips db")
  try {
      const tripDocs = await dashboard.find({
        $or: [
          { 
            'tripSchema.tenantId': tenantId,
            'tripSchema.travelRequestData.createdBy.empId': empId,
            $or: [
              { 'tripSchema.tripStatus': { $nin: ['upcoming'] } },
            ],
        },
        { 'reimbursementSchema.createdBy.empId': empId }, 
        ],
    }).lean().exec();
    

    if (tripDocs?.length === 0) {
        return { message: 'There are no trips found for the user' };
    } 
//  console.log("tripDocs............", tripDocs)

    const allTripExpenseReports = tripDocs
    ?.filter(trip => trip?.tripSchema?.travelExpenseData?.length > 0)
    ?.map(trip => {
    //   console.log("each trip", trip)
    const { tripSchema} = trip
        const {travelRequestData, cashAdvancesData, travelExpenseData, expenseAmountStatus, tripId, tripNumber, tripStartDate,tripCompletionDate} = tripSchema || {};
        // const { totalCashAmount, totalRemainingCash } = expenseAmountStatus ||  {};
        const {travelRequestId,travelRequestNumber,travelRequestStatus,tripName,tripPurpose, isCashAdvanceTaken, itinerary} = travelRequestData || {};

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

        const travelExpenseReports = travelExpenseData.map(expense => ({
            expenseHeaderId: expense?.expenseHeaderId ?? '',
            createdBy: expense?.createdBy ?? '',
            expenseHeaderStatus: expense?.expenseHeaderStatus ?? '',
            expenseLines: expense?.expenseLines ?? '',
        }))

        // console.log("itineraryTosend.........................................", itineraryToSend)
        return {
            tripId: tripId ?? '', 
            tripNumber: tripNumber ??'', 
            tripName: tripName ??'',
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
            travelExpenses: travelExpenseReports,
            itinerary: itineraryToSend
        };
    });
    // console.log("allTripExpenseReports", allTripExpenseReports)

    //   const allTrip = tripDocs
    //       .filter(trip => trip?.tripSchema?.tripStatus === 'upcoming' && trip?.tripSchema?.travelExpenseData && trip?.tripSchema?.travelExpenseData?.length > 0 )
    //       .flatMap(trip => trip.tripSchema.travelExpenseData.map(({ tripId, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus }) => ({
    //           tripId,
    //           tripPurpose: trip.tripSchema.travelRequestData.tripPurpose || '',
    //           expenseHeaderId: expenseHeaderId || '',
    //           expenseHeaderNumber: expenseHeaderNumber || '',
    //           expenseHeaderStatus:expenseHeaderStatus|| '',
    //       })));


        const allNonTravelReports = tripDocs
        .filter(trip => {
            // console.log("trip after filter", trip);
            // Assuming createdBy is an object with empId property
            return trip?.reimbursementSchema?.createdBy?.empId === empId;
          })
          .flatMap(trip => {
            // console.log("before reimbursement schema:", trip);
            const { expenseHeaderId, createdBy, expenseHeaderNumber, expenseHeaderStatus, expenseLines } = trip?.reimbursementSchema;
            // return expenseLines.map(expenseLine => ({lineItemId, lineItemStatus,})
            return [{
              expenseHeaderId,
              createdBy,
              expenseHeaderNumber,
              expenseHeaderStatus,
              expenseLines
            }];
          });
        
        // console.log("allNonTravelReports reports:", allNonTravelReports);
        
        return {           
            allTripExpenseReports,
            allNonTravelReports,
         }

    
  } catch (error) {
      console.error("Error in fetching employee Dashboard:", error);
      throw new Error ( { error: 'Error in fetching employee Dashboard' });
  }
};


//----------------trip, travel and non-travel expenseReports for an employee
// const processTripsByStatus = async (tripDocs, status) => {
//     const trips = [];
//     const travelExpenseContainer = [];
//     const rejectedExpenseReports = [];
    
//     tripDocs.forEach((trip) => {
//       const {
//         travelRequestId,
//         travelRequestNumber,
//         tripPurpose,
//         tripStartDate,
//         tripCompletionDate,
//         travelRequestStatus,
//         isCashAdvanceTaken,
//         cashAdvancesData,
//         travelExpenseData,
//         expenseAmountStatus
//       } = trip.tripSchema;
    
//       const { totalCashAmount, totalRemainingCash } = expenseAmountStatus;
    
//       const tripWithExpense = {
//         travelRequestId,
//         travelRequestNumber,
//         tripPurpose,
//         tripStartDate,
//         tripCompletionDate,
//         travelRequestStatus,
//         isCashAdvanceTaken,
//         totalCashAmount,
//         totalRemainingCash,
//         cashAdvances: [],
//         travelExpenses: []
//       };
    
//       cashAdvancesData.forEach((cashAdvance) => {
//         const { cashAdvanceId, cashAdvanceNumber, amountDetails } = cashAdvance;
//         tripWithExpense.cashAdvances.push({ cashAdvanceId, cashAdvanceNumber, amountDetails });
//       });
    
//       const isTransitTrip = status === 'transit';
//       const isCompletedTrip = status === 'completed';
//       const isRejectedExpenseReport = status === 'rejected';
  
//       if (isTransitTrip) {
//         travelExpenseData.forEach((travelExpense) => {
//           const { tripId, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus } = travelExpense;
//           tripWithExpense.travelExpenses.push({ tripId, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus });
//         });
//         trips.push(tripWithExpense);
//       } else if (isCompletedTrip) {
//         travelExpenseData.forEach((travelExpense) => {
//           const { tripId, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus } = travelExpense;
//           travelExpenseContainer.push({ tripId, tripPurpose, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus });
//         });
//       } else if (isRejectedExpenseReport) {
//         travelExpenseData.forEach((travelExpense) => {
//           const { tripId, tripNumber, expenseHeaderNumber, expenseHeaderId, expenseAmountStatus } = travelExpense;
//           rejectedExpenseReports.push({ tripId, tripPurpose, tripNumber, expenseHeaderNumber, expenseHeaderId, expenseAmountStatus });
//         });
//       }
//     });
  
//     if (isTransitTrip) {
//       return { [status]: trips };
//     } else if (isCompletedTrip) {
//       return { [status]: travelExpenseContainer };
//     } else {
//       return { [status]: rejectedExpenseReports };
//     }
// };

// non travel expense reports for an employeee
// const processNonTravelExpenseReports = (tripDocs, empId) => {
//     const nonTravelExpenseReports = [];
  
//     tripDocs.forEach((expense) => {
//       const { reimbursementSchema } = expense;
//       const { createdBy, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus } = reimbursementSchema;
  
//       const isValidEmployee = empId === createdBy.empId;
  
//       if (isValidEmployee) {
//         nonTravelExpenseReports.push({ expenseHeaderId, createdBy, expenseHeaderNumber, expenseHeaderStatus });
//       }
//     });
  
//     if (nonTravelExpenseReports.length > 0) {
//       return { [empId]: nonTravelExpenseReports };
//     } else {
//       return {}; // Return an empty object if there are no valid non-travel expense reports for the employee
//     }
// };

// const processTripsByStatus = async (tripDocs, status) => {
//     const transitTrips = [];
//     const travelExpenseContainer = [];
//     const rejectedExpenseReports = [];
//     const upcomingTrips = [];
  
//     tripDocs.forEach(trip => {
//       const {
//         travelRequestId,
//         travelRequestNumber,
//         tripPurpose,
//         tripStartDate,
//         tripCompletionDate,
//         travelRequestStatus,
//         isCashAdvanceTaken,
//         itinerary,
//         cashAdvancesData,
//         travelExpenseData,
//         expenseAmountStatus
//       } = trip.tripSchema;
  
//       const { totalCashAmount, totalRemainingCash } = expenseAmountStatus;
  
//       const commonTripDetails = {
//         travelRequestId,
//         travelRequestNumber,
//         tripPurpose,
//         tripStartDate,
//         tripCompletionDate,
//         travelRequestStatus,
//         isCashAdvanceTaken,
//         totalCashAmount,
//         totalRemainingCash,
//         ItineraryArray: []
//       };
  
//       if (status === 'transit') {
//         const transitTrip = { ...commonTripDetails, cashAdvances: [], travelExpenses: [] };
  
//         cashAdvancesData.forEach(cashAdvance => {
//           const { cashAdvanceId, cashAdvanceNumber, amountDetails } = cashAdvance;
//           transitTrip.cashAdvances.push({ cashAdvanceId, cashAdvanceNumber, amountDetails });
//         });
  
//         travelExpenseData.forEach(travelExpense => {
//           const { tripId, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus } = travelExpense;
//           transitTrip.travelExpenses.push({ tripId, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus });
//         });
  
//         Object.keys(itinerary).forEach(category => {
//           if (category !== 'formState') {
//             const modifiedCategory = itinerary[category].map(item => ({
//               bkd_from: item.bkd_from,
//               bkd_to: item.bkd_to,
//               status: item.status,
//               itineraryId: item.itineraryId
//             }));
//             transitTrip.ItineraryArray.push({ [category]: modifiedCategory });
//           }
//         });
  
//         transitTrips.push(transitTrip);
//       } else if (status === 'completed') {
//         travelExpenseData.forEach(travelExpense => {
//           const { tripId, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus } = travelExpense;
//           travelExpenseContainer.push({ tripId, tripPurpose, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus });
//         });
//       } else if (status === 'rejected') {
//         travelExpenseData.forEach(travelExpense => {
//           const { tripId, tripNumber, expenseHeaderNumber, expenseHeaderId, expenseAmountStatus } = travelExpense;
//           rejectedExpenseReports.push({ tripId, tripPurpose, tripNumber, expenseHeaderNumber, expenseHeaderId, expenseAmountStatus });
//         });
//       } else if (status === 'upcoming') {
//         const upcomingTrip = { ...commonTripDetails, cashAdvances: [], ItineraryArray: [] };
  
//         upcomingTrips.push(upcomingTrip);
  
//         cashAdvancesData.forEach(cashAdvance => {
//           const { cashAdvanceId, cashAdvanceNumber, amountDetails } = cashAdvance;
//           upcomingTrip.cashAdvances.push({ cashAdvanceId, cashAdvanceNumber, amountDetails });
//         });
  
//         Object.keys(itinerary).forEach(category => {
//           if (category !== 'formState') {
//             const modifiedCategory = itinerary[category].map(item => ({
//               bkd_from: item.bkd_from,
//               bkd_to: item.bkd_to,
//               status: item.status,
//               itineraryId: item.itineraryId
//             }));
//             upcomingTrip.ItineraryArray.push({ [category]: modifiedCategory });
//           }
//         });
//       }
//     });
  
//     if (status === 'transit') {
//       return { [status]: transitTrips };
//     } else if (status === 'completed') {
//       return { [status]: travelExpenseContainer };
//     } else if (status === 'upcoming') {
//       return { [status]: upcomingTrips };
//     } else {
//       return { [status]: rejectedExpenseReports };
//     }
//   };
  
// //trip for the employee 
// const getTripForEmployee = async (tenantId, empId) => {
//     try {
//       const tripDocs = await cashAdvanceSchema.find({
//         tenantId,
//         'createdBy.empId': empId,
//         $or: [
//           { 'tripSchema.tripStatus': { $in: ['transit', 'upcoming', 'completed'] } },
//           { 'tripSchema.travelExpenseData.expenseHeaderStatus': { $in: ['rejected'] } },
//         ],
//         'tripSchema.cashAdvanceData.cashAdvanceStatus': { $nin: ['rejected'] },
//         'reimbursementSchema.createdBy.empId': empId,
//       }).lean().exec();
  
//       if (!tripDocs || tripDocs.length === 0) {
//         return { message: 'There are no trips found for the user' };
//       }
  
//       const transitTrips = await processTripsByStatus(tripDocs.filter(trip => trip.tripSchema.tripStatus === 'transit'), 'transit');
//       const upcomingTrips = await processTripsByStatus(tripDocs.filter(trip => trip.tripSchema.tripStatus === 'upcoming'), 'upcoming');
//       const completedTrips = await processTripsByStatus(tripDocs.filter(trip => trip.tripSchema.tripStatus === 'completed'), 'completed');
//       const rejectedExpenseReports = await processTripsByStatus(tripDocs.filter(trip => trip.tripSchema.travelExpenseData.expenseHeaderStatus === 'rejected'), 'rejected');
  
//       const nonTravelExpenseReports = [];
//       for (const expense of tripDocs) {
//         const { reimbursementSchema } = expense;
//         const { createdBy, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus } = reimbursementSchema;
//         const isValidEmployee = empId === createdBy.empId;
//         if (isValidEmployee) {
//           nonTravelExpenseReports.push({ expenseHeaderId, createdBy, expenseHeaderNumber, expenseHeaderStatus });
//         }
//       }
  
//       if (nonTravelExpenseReports.length > 0) {
//         return { [empId]: nonTravelExpenseReports };
//       } else {
//         return {}; // Return an empty object if there are no valid non-travel expense reports for the employee
//       }
//     } catch (error) {
//       return { error: 'Error in fetching employee Dashboard' };
//     }
//   };
  
// const getTripForEmployee = async (tenantId, empId, res) => {
//     try {
//       const tripDocs = await dashboard.find({
//         tenantId,
//         'createdBy.empId': empId,
//         $or: [
//           { 'tripSchema.tripStatus': { $in: ['transit', 'upcoming', 'completed'] } },
//           { 'tripSchema.travelExpenseData.expenseHeaderStatus': 'rejected' },
//         ],
//         'tripSchema.cashAdvanceData.cashAdvanceStatus': { $nin: ['rejected'] },
//         'reimbursementSchema.createdBy.empId': empId,
//       }).lean().exec();
  
//       if (!tripDocs || tripDocs.length === 0) {
//         return { message: 'There are no trips found for the user' };
//       }
  
//       const transitTrips = [];
//       const travelExpenseContainer = [];
//       const rejectedExpenseReports = [];
//       const upcomingTrips = [];
//       const nonTravelExpenseReports = [];
  
//       tripDocs.forEach((trip) => {
//         const {
//           travelRequestId,
//           travelRequestNumber,
//           tripPurpose,
//           tripStartDate,
//           tripCompletionDate,
//           travelRequestStatus,
//           isCashAdvanceTaken,
//           itinerary,
//           cashAdvancesData,
//           travelExpenseData,
//           expenseAmountStatus,
//           tripStatus,
//         } = trip.tripSchema;
  
//         const { totalCashAmount, totalRemainingCash } = expenseAmountStatus;
  
//         const commonTripDetails = {
//           travelRequestId,
//           travelRequestNumber,
//           tripPurpose,
//           tripStartDate,
//           tripCompletionDate,
//           travelRequestStatus,
//           isCashAdvanceTaken,
//           totalCashAmount,
//           totalRemainingCash,
//           ItineraryArray: [],
//         };
  
//         if (tripStatus === 'transit') {
//           const transitTrip = { ...commonTripDetails, cashAdvances: [], travelExpenses: [] };
  
//           cashAdvancesData.forEach((cashAdvance) => {
//             const { cashAdvanceId, cashAdvanceNumber, amountDetails } = cashAdvance;
//             transitTrip.cashAdvances.push({ cashAdvanceId, cashAdvanceNumber, amountDetails });
//           });
  
//           travelExpenseData.forEach((travelExpense) => {
//             const {  expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus } = travelExpense;
//             transitTrip.travelExpenses.push({  expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus });
//           });
  
//           Object.entries(itinerary).forEach(([category, items]) => {
//             if (category !== 'formState') {
//               const modifiedCategory = items.map((item) => ({
//                 bkd_from: item.bkd_from,
//                 bkd_to: item.bkd_to,
//                 status: item.status,
//                 itineraryId: item.itineraryId,
//               }));
//               transitTrip.ItineraryArray.push({ [category]: modifiedCategory });
//             }
//           });
  
//           transitTrips.push(transitTrip);
//         } else if (tripStatus === 'completed') {
//           travelExpenseData.forEach((travelExpense) => {
//             const { tripId, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus } = travelExpense;
//             travelExpenseContainer.push({ tripId, tripPurpose, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus });
//           });
//         } else if (tripStatus === 'rejected') {
//           travelExpenseData.forEach((travelExpense) => {
//             const { tripId, tripNumber, expenseHeaderNumber, expenseHeaderId, expenseAmountStatus } = travelExpense;
//             rejectedExpenseReports.push({ tripId, tripPurpose, tripNumber, expenseHeaderNumber, expenseHeaderId, expenseAmountStatus });
//           });
//         } else if (tripStatus === 'upcoming') {
//           const upcomingTrip = { ...commonTripDetails, cashAdvances: [], ItineraryArray: [] };
  
//           upcomingTrips.push(upcomingTrip);
  
//           cashAdvancesData.forEach((cashAdvance) => {
//             const { cashAdvanceId, cashAdvanceNumber, amountDetails } = cashAdvance;
//             upcomingTrip.cashAdvances.push({ cashAdvanceId, cashAdvanceNumber, amountDetails });
//           });
  
//           Object.entries(itinerary).forEach(([category, items]) => {
//             if (category !== 'formState') {
//               const modifiedCategory = items.map((item) => ({
//                 bkd_from: item.bkd_from,
//                 bkd_to: item.bkd_to,
//                 status: item.status,
//                 itineraryId: item.itineraryId,
//               }));
//               upcomingTrip.ItineraryArray.push({ [category]: modifiedCategory });
//             }
//           });
//         }
//       });
  
//       // Fetching non-travel expense reports related to the employee
//       for (const expense of tripDocs) {
//         const { reimbursementSchema } = expense;
//         const { createdBy, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus } = reimbursementSchema;
//         const isValidEmployee = empId === createdBy.empId;
//         if (isValidEmployee) {
//           nonTravelExpenseReports.push({ expenseHeaderId, createdBy, expenseHeaderNumber, expenseHeaderStatus });
//         }
//       }
  
//       if (nonTravelExpenseReports.length > 0) {
//         return responseData ={ [empId]: nonTravelExpenseReports };
//       } else {
//         return { message: 'No valid non-travel expense reports found for the employee' };
//       }
//     } catch (error) {
//       console.error("Error in fetching employee Dashboard:", error);
//       // Return an object indicating the error occurred
//       return { error: 'Error in fetching employee Dashboard' };
//     }
// };
  
//------------------------------------------------------------------------------- employeeManger

const managerLayout = async (tenantId,empId) => {
    try{
       const approvals = await approvalsForManager(tenantId,empId);

      //  res.status.status(200).json({ success: true,
      //  approvals,if

        return approvals
       } catch(error){
          throw new Error({message:'internal server error'});
   }
}

//------------- employee manager Approvals 


// cashAdvanceSchema
// cashAdvanceSchema.forEach((cashAdvance) => {
//     const { travelRequestData, cashAdvanceData } = cashAdvance;

//     const isValidTravelStatus = travelRequestData.travelRequestStatus === 'pending approval';
//     const isValidStatus = status === travelRequestData.approvers.status;
//     const isValidApprover = empId === travelRequestData.approvers.empId;


//     // travel and cash both are - pending approval 
//     if ( isValidTravelStatus && isValidStatus && isValidApprover) {
//       const { travelRequestId, approvers, travelRequestNumber, travelRequestStatus } = travelRequestData;

//       const isValidCashStatus = cashAdvanceData.cashAdvanceStatus === 'pending approval';
//       if (isValidCashStatus){
//         // Assuming cashAdvanceData is an array and iterating through it
//           cashAdvanceData.forEach((cashAdvance) => {
//         const { travelRequestNumber, cashAdvanceNumber, cashAdvanceId } = cashAdvance;
//         currentTrWithCash.cashAdvance.push({travelRequestNumber, cashAdvanceNumber, cashAdvanceId })
//       });

//       travelWithCashForApproval.push({ travelRequestId, approvers, travelRequestNumber, travelRequestStatus, cashAdvance });

//       }
//       const currentTrWithCash = {  travelRequestId, approvers, travelRequestNumber, travelRequestStatus , cashAdvance:[]};

//       travelWithCashForApproval.push({ travelRequestId, approvers, travelRequestNumber, travelRequestStatus, cashAdvance });
//     }
//   });

// travel, cash for approval
  const oldprocessApproval = async (approvalDoc, status, empId, res) => {
    const travelRequestForApproval = [];
    const travelWithCashForApproval = [];

    approvalDoc.forEach((approval) => {
        const { cashAdvanceSchema } = approval;
        const { travelRequestData, cashAdvanceData } = cashAdvanceSchema;

        const keysToExtract = ['travelRequestId', 'approvers', 'travelRequestNumber', 'travelRequestStatus', 'isCashAdvanceTaken'];
        const isValidStatus = keysToExtract.includes('travelRequestStatus') && travelRequestSchema.travelRequestStatus === status;
        const isValidApprover = keysToExtract.includes('approvers') && travelRequestSchema.approvers.empId === empId;

        // Extract from travelRequestSchema
        Object.entries(travelRequestSchema).forEach(([key, value]) => {
            if (keysToExtract.includes(key) && isValidStatus && isValidApprover) {
                travelRequestForApproval.push({ [key]: value });
            }
        });

        // Extract from travelRequestData using KeysToExtractCash
        const KeysToExtractCash = ['travelRequestId', 'approvers', 'travelRequestNumber', 'travelRequestStatus'];
        Object.entries(travelRequestData).forEach(([key, value]) => {
            if (KeysToExtractCash.includes(key)) {
                const isValidTravelStatus = key === 'travelRequestStatus' && value === 'pending approval';
                if (isValidTravelStatus) {
                    travelWithCashForApproval.push({ [key]: value });
                }
            }
        });

        // Extract from cashAdvanceData (assuming it's an array)
        const isValidCashStatus = cashAdvanceData.some(cashAdvance => cashAdvance.cashAdvanceStatus === 'pending approval');
        if (isValidCashStatus) {
            const currentTrWithCash = { cashAdvance: [] };
            cashAdvanceData.forEach((cashAdvance) => {
                const { travelRequestNumber, cashAdvanceNumber, cashAdvanceId } = cashAdvance;
                currentTrWithCash.cashAdvance.push({ travelRequestNumber, cashAdvanceNumber, cashAdvanceId });
            });
            travelWithCashForApproval.push(currentTrWithCash);
        }
    });

    if (travelRequestForApproval.length > 0) {
        return { [empId]: travelRequestForApproval };
    } else if (travelWithCashForApproval.length > 0) {
        return { travelWithCashForApproval };
    } else {
        return {}; // Handle the case when both arrays are empty
    }
};

const processApproval = async (approvalDoc, status, empId) => {
    const travelRequestForApproval = approvalDoc.map(approval => {
        const { travelRequestSchema, cashAdvanceSchema } = approval;
        const { travelRequestData, cashAdvanceData } = cashAdvanceSchema;

        const keysToExtract = ['travelRequestId', 'approvers', 'travelRequestNumber', 'travelRequestStatus', 'isCashAdvanceTaken'];
        const isValidStatus = keysToExtract.includes('travelRequestStatus') && travelRequestSchema.travelRequestStatus === status;
        const isValidApprover = keysToExtract.includes('approvers') && travelRequestSchema.approvers.empId === empId;

        const extractedTravelRequest = Object.entries(travelRequestSchema)
            .filter(([key, value]) => keysToExtract.includes(key) && isValidStatus && isValidApprover)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        return extractedTravelRequest;
    });

    const travelWithCashForApproval = approvalDoc.map(approval => {
        const { travelRequestData, cashAdvanceData } = approval.cashAdvanceSchema;
        const isValidCashStatus = cashAdvanceData.some(cashAdvance => cashAdvance.cashAdvanceStatus === 'pending approval');

        if (isValidCashStatus) {
            const cashAdvanceDetails = cashAdvanceData.map(cashAdvance => ({
                travelRequestNumber: cashAdvance.travelRequestNumber,
                cashAdvanceNumber: cashAdvance.cashAdvanceNumber,
                cashAdvanceId: cashAdvance.cashAdvanceId
            }));

            return { cashAdvance: cashAdvanceDetails };
        }
        return null;
    }).filter(Boolean);

    const addALegForApproval = approvalDoc.map(approval => {
        const { travelRequestData, cashAdvanceData} = approval.cashAdvanceSchema;
        const isAddALeg = travelRequestData.filter(travelRequest => travelRequest.isAddALeg);

        if (isAddALeg) {
            const cashAdvanceDetails = cashAdvanceData.map(cashAdvance => ({
                travelRequestNumber: cashAdvance.travelRequestNumber,
                cashAdvanceNumber: cashAdvance.cashAdvanceNumber,
                cashAdvanceId: cashAdvance.cashAdvanceId
            }));

            return { cashAdvance: cashAdvanceDetails };
        }
        return null;
    }).filter(Boolean);

    if (travelRequestForApproval.length > 0) {
        return { [empId]: travelRequestForApproval };
    } else if (travelWithCashForApproval.length > 0) {
        return { travelWithCashForApproval };
    } else {
        return {}; // Handle the case when both arrays are empty
    }
};



//approver- cash raised later
const processApprovalCashRaisedLater = async (approvalDoc, status, empId) => {
    const travelWithCashRaisedLater = [];

    approvalDoc.forEach((approval) => {
        const { cashAdvanceSchema } = approval;
        const { travelRequestData, cashAdvanceData } = cashAdvanceSchema;

        // Extract from travelRequestData for cash raised later
        const KeysToExtractCash = ['travelRequestId', 'approvers', 'travelRequestNumber', 'travelRequestStatus'];
        Object.entries(travelRequestData).forEach(([key, value]) => {
            if (KeysToExtractCash.includes(key)) {
                const isValidTravelStatus = key === 'travelRequestStatus' && value === status;
                if (isValidTravelStatus && travelRequestData.approvers.empId === empId) {
                    travelWithCashRaisedLater.push({ [key]: value });
                }
            }
        });

        // Extract from cashAdvanceData 
        const isValidCashStatus = cashAdvanceData.some(cashAdvance => cashAdvance.cashAdvanceStatus === status && cashAdvance.approvers.empId === empId); 
        if (isValidCashStatus) {
            const currentTrWithCash = { cashAdvance: [] };
            cashAdvanceData.forEach((cashAdvance) => {
                if (cashAdvance.approvers.empId === empId) {
                    const { travelRequestNumber, cashAdvanceNumber, cashAdvanceId } = cashAdvance;
                    currentTrWithCash.cashAdvance.push({ travelRequestNumber, cashAdvanceNumber, cashAdvanceId });
                }
            });
            travelWithCashRaisedLater.push(currentTrWithCash);
        }
    });

    if (travelWithCashRaisedLater.length > 0) {
        return { travelWithCashRaisedLater };
    } else {
        return { message: 'No cash raised later approvals found for the user' };
    }
};

// for travel expense reports
const processApprovaltravelExpenseReports = async (approvalDoc, status, empId) => {
    const travelExpenseReportsApproval = [];

    approvalDoc.forEach((approval) => {
        const { tripSchema } = approval;
        const { travelExpenseData } = tripSchema;

        travelExpenseData.forEach((expenseDataItem) => {
            const KeysToExtractCash = ['tripId', 'approvers', 'expenseHeaderNumber', 'expenseHeaderStatus'];
            const { approvers, expenseHeaderStatus } = expenseDataItem;

            if (
                expenseHeaderStatus === status &&
                approvers && approvers.empId === empId
            ) {
                const filteredExpenseData = {};
                KeysToExtractCash.forEach((key) => {
                    if (expenseDataItem.hasOwnProperty(key)) {
                        filteredExpenseData[key] = expenseDataItem[key];
                    }
                });
                travelExpenseReportsApproval.push(filteredExpenseData);
            }
        });
    });

    if (travelExpenseReportsApproval.length > 0) {
        return { travelExpenseReportsApproval };
    } else {
        return { message: 'No travel expense reports found for the user' };
    }
};


/**
 * Retrieves approval documents for a manager based on their tenant ID and employee ID.
 * @param {string} tenantId - The ID of the tenant for which the approvals are being retrieved.
 * @param {string} empId - The ID of the manager for whom the approvals are being retrieved.
 * @returns {Object} - An object containing the processed approval data.
 * @throws {Error} - If there is an error in fetching approvals for the dashboard.
 */
const approvalsForManager = async (tenantId, empId) => {
    console.log("entering manager - approvals", tenantId, empId);
    try {
        const approvalDoc = await dashboard.find({
            $or: [
                        {
                            'travelRequestSchema.tenantId': tenantId,
                            'travelRequestSchema.approvers.empId': empId,
                            'travelRequestSchema.isCashAdvanceTaken': false,
                            'travelRequestSchema.travelRequestStatus': 'pending approval',
                            'travelRequestSchema.approvers.status': 'pending approval'
                        },
                        {
                            'cashAdvanceSchema.travelRequestData.tenantId': tenantId,
                            'cashAdvanceSchema.travelRequestData.travelRequestStatus': 'pending approval',
                            'cashAdvanceSchema.travelRequestData.approvers':{
                             $elemMatch :{'empId': empId,'status': 'pending approval',}
                            }
                        },
                        {
                            'cashAdvanceSchema.travelRequestData.tenantId': tenantId,
                            'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $in: ['approved', 'booked'] },
                            'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus': { $in: ['pending approval'] },
                            'cashAdvanceSchema.cashAdvancesData.approvers':{
                                $elemMatch :{'empId': empId,'status': 'pending approval',}
                               }
                        },
                        // {
                        //     'tripSchema.travelRequestData.tenantId': tenantId,
                        //     'tripSchema.travelRequestData.isAddALeg': true,
                        //     'tripSchema.travelRequestData.approvers.empId': empId,
                        // },
                        {
                            'tripSchema.travelExpenseData': {
                              $elemMatch: {
                                tenantId: tenantId,
                                expenseHeaderStatus: 'pending approval',
                                'approvers': {
                                  $elemMatch: {
                                    empId: empId,
                                    status: 'pending approval'
                                  }
                                }
                              }
                            }
                          }                          
            ]
        }).lean().exec();

        if (approvalDoc?.length === 0) {
            return { message: 'There are no approvals found for the user' };
        } else {
            
            const travel = await ( async() => {
                const filteredApprovals = approvalDoc.filter(approval =>
                    approval.travelRequestSchema?.approvers &&
                    approval.travelRequestSchema.approvers.length > 0 &&
                    approval.travelRequestSchema.isCashAdvanceTaken === false &&
                    approval.travelRequestSchema.approvers.some(approver =>
                        approver.empId === empId &&
                        approver.status === 'pending approval'
                    )
                )
                return filteredApprovals.map(approval => {
                    const { travelRequestId, approvers, tripPurpose, travelRequestNumber, travelRequestStatus, isCashAdvanceTaken } = approval.travelRequestSchema;
                    return {travelRequestId, approvers,tripPurpose, travelRequestNumber, travelRequestStatus, isCashAdvanceTaken}
                }).filter(Boolean);
            })()


            const travelWithCash = await (async () => {
                const filteredApprovals = approvalDoc.filter(approval => 
                    approval?.cashAdvanceSchema?.travelRequestData?.travelRequestStatus === 'pending approval' &&
                    approval?.cashAdvanceSchema.travelRequestData.approvers?.some(approver =>
                        approver?.empId === empId && 
                        approver?.status === 'pending approval'
                    )
                );                
                
                    return filteredApprovals.map(approval => {
                        const { travelRequestData, cashAdvancesData } = approval.cashAdvanceSchema;
                        const isValidCashStatus = cashAdvancesData.some(cashAdvance => cashAdvance.cashAdvanceStatus === 'pending approval');
                        const { travelRequestId, approvers, travelRequestNumber,tripPurpose, travelRequestStatus, isCashAdvanceTaken } = travelRequestData;
                        const travelRequest = { travelRequestId,travelRequestNumber, tripPurpose, travelRequestNumber, travelRequestStatus, approvers,isCashAdvanceTaken };

                        if (isValidCashStatus) {
                            const cashAdvanceDetails = cashAdvancesData?.map(cashAdvance => ({
                                travelRequestNumber: cashAdvance.travelRequestNumber,
                                cashAdvanceNumber: cashAdvance.cashAdvanceNumber,
                                cashAdvanceId: cashAdvance.cashAdvanceId,
                                amountDetails: cashAdvance.amountDetails,
                            }));

                            return { ...travelRequest, cashAdvance: cashAdvanceDetails };
                        } else{
                            return { ...travelRequest, cashAdvance: []};
                        }
                    }).filter(Boolean);
                })();

            const cashAdvanceRaisedLater = await (async() =>{
                const filteredApprovals = approvalDoc.filter(approval =>
                    (
                        approval?.cashAdvanceSchema?.travelRequestData?.travelRequestStatus === 'booked' ||
                        approval?.cashAdvanceSchema?.travelRequestData?.travelRequestStatus === 'approved'
                    ) && approval?.cashAdvanceSchema?.cashAdvancesData?.some(cash => cash.cashAdvanceStatus === 'pending approval' && 
                      cash.approvers.some(approver =>
                        approver?.empId === empId &&
                        approver?.status === 'pending approval'
                    ))
                );
                                   

                return filteredApprovals.map(approval => {
                    // console.log("cashAdvanceRaisedLater", approval)
                    const { travelRequestData, cashAdvancesData } = approval.cashAdvanceSchema;
                    const isValidCashStatus = cashAdvancesData.some(cashAdvance => cashAdvance.cashAdvanceStatus === 'pending approval');
            
                    const { travelRequestId, travelRequestNumber,tripPurpose, travelRequestStatus } = travelRequestData;
                    const travelRequest = { travelRequestId, tripPurpose, travelRequestNumber, travelRequestStatus };
                    
                    if (isValidCashStatus) {
                        const cashAdvanceDetails = cashAdvancesData.map(cashAdvance => ({
                            travelRequestNumber: cashAdvance.travelRequestNumber,
                            cashAdvanceNumber: cashAdvance.cashAdvanceNumber,
                            cashAdvanceId: cashAdvance.cashAdvanceId,
                            amountDetails: cashAdvance.amountDetails,
                        }));
                        return { ...travelRequest, cashAdvance: cashAdvanceDetails };
                    } else {
                        return { ...travelRequest, cashAdvance: []};
                    }
                    return null;
                }).filter(Boolean);
                })();

            const addAleg = await (async() =>{
                const filteredApprovals = approvalDoc.flatMap(approval => {
                    return Object.entries(approval?.tripSchema?.travelRequestData?.itinerary || {}).map(([key, value]) => {
                        if (Array.isArray(value) && value.length > 0 && value[0]?.approvers?.some(approver =>
                            approver?.empId === empId && 
                            approver?.status === 'pending approval'
                        )) {
                            const { travelRequestId, tripPurpose, travelRequestNumber, travelRequestStatus } = approval.tripSchema.travelRequestData;
                            return {
                                travelRequestId,
                                tripPurpose,
                                travelRequestNumber,
                                travelRequestStatus,
                                [key]: value,
                            };
                        }
                        return null;
                    }).filter(item => item); // filter out null items
                });
                
        })();

        const travelExpenseReports = await (async () => {
            try {
                const filteredApprovals = approvalDoc.filter(approval => {
                    // console.log("Checking approval:", approval);
                    return approval?.tripSchema?.travelExpenseData?.some(expense => {
                        // console.log("Checking expense:", expense);
                        return expense.tenantId === tenantId &&
                            expense.expenseHeaderStatus === 'pending approval' &&
                            expense.approvers.some(approver => {
                                // console.log("Checking approver:", approver);
                                return approver.empId === empId &&
                                    approver.status === 'pending approval';
                            });
                    });
                });
        
                // console.log("Filtered approvals:", filteredApprovals);
        
                const travelExpenseDataList = filteredApprovals.flatMap(approval => {
                    // console.log("Processing approval:", approval);
                    return approval.tripSchema.travelExpenseData.map(expense => {
                        // console.log("Processing expense:", expense);
                        const { tripId, tripNumber, tripStatus } = approval.tripSchema;
                        const { tripPurpose} = approval.tripSchema.travelRequestData
                        const { expenseHeaderNumber,expenseHeaderId, expenseHeaderStatus, approvers } = expense;
                        return { tripId,tripNumber,tripPurpose,tripStatus, expenseHeaderNumber,expenseHeaderId, expenseHeaderStatus, approvers };
                    });
                });
        
                // console.log(" expense reports for approval:", travelExpenseDataList);
        
                return travelExpenseDataList;
            } catch (error) {
                // console.error('Error occurred:', error);
                return []; // Return an empty array or handle the error accordingly
            }
        })();
        
        const uniqueTravelWithCash = [...travel, ...travelWithCash]
        const filteredTravelWithCash = Object.values(uniqueTravelWithCash.reduce((uniqueItems, currentItem) => {
            const existingItem = uniqueItems[currentItem.travelRequestId];
            if (!existingItem || (currentItem.cashAdvance && currentItem.cashAdvance.length)) {
                uniqueItems[currentItem.travelRequestId] = currentItem;
            }
            return uniqueItems;
        }, {}));

        // console.log("rule1", travel)
        // console.log("rule2"), travelWithCash
        // console.log("rule12", uniqueTravelWithCash)
     
        const responseData = {
                // travelAndCash: [...travelRequests, ...travelWithCash,cashAdvanceRaisedLater, addAleg],
                travelAndCash: [ ...filteredTravelWithCash, ...cashAdvanceRaisedLater, ],
                travelExpenseReports: travelExpenseReports,
        };

        return responseData;
        }
    } catch (error) {
        console.error("Error in fetching employee Dashboard:", error);
        // Return an object indicating the error occurred
        throw new Error('Error in fetching employee Dashboard');
    }
};

//---------------------------------------------------------------------Travel admin
const businessAdminLayout = async (tenantId, empId) => {
    try {
// console.log("verified bussiness admin layout", tenantId, empId);

            const bookingDoc = await dashboard.find({
                $or: [
                    { 'travelRequestSchema.tenantId': tenantId,
                    'travelRequestSchema.travelRequestStatus': 'pending booking',
                   },
                    { 'cashAdvanceSchema.travelRequestData.tenantId': tenantId,
                    'cashAdvanceSchema.travelRequestData.travelRequestStatus': 'pending booking' 
                   },
                   {
                    'tripSchema.travelRequestData.tenantId': tenantId,
                    'tripSchema.travelRequestData.isAddALeg': true,
                    'tripSchema.travelRequestData.travelRequestStatus': 'booked'
                  },
                    {
                    'tripSchema.travelRequestData.tenantId': tenantId,
                     'tripSchema.travelRequestData.tripStatus': {$nin:['paid and cancelled']}
                 },
                ],
            })
            .lean()
            .exec();
    
            if (bookingDoc?.length === 0){
                return { error: 'Error in fetching data for business admin' };
            } 
            // console.log("booking from database .......................", bookingDoc)

            const travel = await (async () => {
                // console.log("booking", bookingDoc)
                const filteredBooking = bookingDoc.filter(booking =>
                    booking?.travelRequestSchema?.travelRequestStatus === 'pending booking'
                );
            
                // console.log("filteredBooking for travel", filteredBooking)
                return filteredBooking.map(booking => {
                    const { travelRequestId, tripPurpose, travelRequestNumber, travelRequestStatus, isCashAdvanceTaken, assignedTo } = booking.travelRequestSchema;
                    return { travelRequestId, tripPurpose, travelRequestNumber, travelRequestStatus, isCashAdvanceTaken, assignedTo };
                }).filter(Boolean);
            })();
            
            // console.log("travel booking .......", travel)
            const travelWithCash = await (async () => {
                const filteredBooking = bookingDoc.filter(booking => 
                    booking?.cashAdvanceSchema?.travelRequestData?.travelRequestStatus === 'pending booking'
                );                
                            
                return filteredBooking.map(booking => {
                    const { travelRequestData } = booking?.cashAdvanceSchema;
                    const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus , isCashAdvanceTaken, assignedTo} = travelRequestData;
                    return { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, isCashAdvanceTaken , assignedTo};
                }).filter(Boolean);
            })();

            // console.log("travel booking .......", travelWithCash)

        
            const trips = await (async () => {
                const filteredBooking = bookingDoc.filter(booking => 
                    booking?.tripSchema?.travelRequestData?.travelRequestStatus === 'booked' && 
                    booking?.tripSchema?.travelRequestData?.isAddALeg == true
                );
            
                return filteredBooking.flatMap(booking => {
                    const { tripId, tripNumber, tripStatus, travelRequestData } = booking.tripSchema;
                    const { itinerary, assignedTo } = travelRequestData;
            
                    return Object.entries(itinerary).flatMap(([category, items]) => {
                        return items.filter(item => item.status === 'pending booking').map(item => ({
                            tripId,
                            tripNumber,
                            tripStatus,
                            travelRequestId: travelRequestData.travelRequestId,
                            travelRequestNumber: travelRequestData.travelRequestNumber,
                            tripPurpose: travelRequestData.tripPurpose,
                            assignedTo,
                            travelRequestStatus: travelRequestData.travelRequestStatus,
                            itineraryKey: category,
                            itineraryId: item.itineraryId,
                            status: item.status
                        }));
                    });
                });
            })();
            
            const tripsPaidAndCancelled = await (async () => {
                const filteredBooking = bookingDoc.filter(booking => 
                    booking?.tripSchema?.travelRequestData?.tripStatus !== 'cancelled' &&
                    booking?.tripSchema?.travelRequestData?.travelRequestStatus === 'booked'
                );
            
                return filteredBooking.flatMap(booking => {
                    const { tripId, tripNumber, tripStatus, travelRequestData } = booking.tripSchema;
                    const { itinerary } = travelRequestData;
            
                    return Object.entries(itinerary).flatMap(([category, items]) => {
                        return items.filter(item => item.status === 'paid and cancelled').map(item => ({
                            tripId,
                            tripNumber,
                            tripStatus,
                            travelRequestId: travelRequestData.travelRequestId,
                            travelRequestNumber: travelRequestData.travelRequestNumber,
                            tripPurpose: travelRequestData.tripPurpose,
                            travelRequestStatus: travelRequestData.travelRequestStatus,
                            itineraryKey: category,
                            itineraryId: item.itineraryId,
                            status: item.status
                        }));
                    });
                });
            })();
            
            const pendingBooking = [ ...travel, ...travelWithCash];
            const paidAndCancelledTrips = [...tripsPaidAndCancelled];
            const pendingItineraryLines = [...trips];

            // const responseData = {pendingBooking, paidAndCancelledTrips, pendingItineraryLines };
    
            // return responseData 

            const responseData = { pendingBooking, paidAndCancelledTrips, pendingItineraryLines };

         const result = Object.values(responseData).some(value => value.length > 0) ? responseData : [];

      return result;
    } catch (error) {
      console.error("Error in fetching employee Dashboard:", error);
      // Return an object indicating the error occurred
     throw new Error({ error:'Error in fetching data for business admin' });
    }
};

// -----------------------------------------------------Super Admin
// i need to test and improve below code as per the dashboard view 
const superAdminLayout = async (tenantId, empId) => {
    try {
        const layoutAccess = {
            employee: async () => await employeeLayout(tenantId, empId),
            employeeManager: async () => await managerLayout(tenantId, empId),
            finance: async () => await financeLayout(tenantId, empId),
            businessAdmin: async () => await businessAdminLayout(tenantId, empId),
        };

        const results = await Promise.all([
            layoutAccess.employee(),
            layoutAccess.employeeManager(),
            layoutAccess.finance(),
            layoutAccess.businessAdmin()
        ]);

        return {
            employee: results[0],
            employeeManager: results[1],
            finance: results[2],
            businessAdmin: results[3]
        };

    } catch (error) {
        console.error("Error in superAdminLayout:", error);
        throw error;
    }
};





