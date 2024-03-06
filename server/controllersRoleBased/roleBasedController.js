import { financeLayout } from "../controllers/financeController.js";
import { cashAdvanceSchema } from "../models/cashSchema.js";
import dashboard from "../models/dashboardSchema.js";
import HRMaster from "../models/hrMasterSchema.js";

//Role based Layout
// export const roleBasedLayout = async (req, res) => {
//     try {
//         const { tenantId, empId } = req.params;
//        console.log('params', req.params)
//         const hrDocument = await HRMaster.findOne({
//             'tenantId': tenantId,
//             'employees.employeeDetails.employeeId': empId,
//         });

//         if (!hrDocument) {
//             return res.status(404).json({ error: "HR document not found" });
//         }

//         const employee = hrDocument?.employees.find(emp => emp.employeeDetails.employeeId === empId);

//         const { employeeRoles } = employee;

//         console.log("employeeRoles", employeeRoles)
//         if (!employeeRoles) {
//             return res.status(404).json({ error: "Employee roles not found" });
//         }

//         const rolesToAccess = [];

//         if (employeeRoles.employee) {
//             rolesToAccess.push('employeeLayout');
//         }
//         if (employeeRoles.employeeManager) {
//             rolesToAccess.push('managerLayout');
//         }
//         if (employeeRoles.finance) {
//             rolesToAccess.push('financeLayout');
//         }
//         if (employeeRoles.businessAdmin) {
//             rolesToAccess.push('businessAdminLayout');
//         }
//         if (employeeRoles.superAdmin) {
//             rolesToAccess.push('superAdminLayout');
//         }
//       console.log("rolesToAccess", rolesToAccess);
//         // Mapping each layout function name to its implementation function
//         const layoutFunctionByRole = {
//             'employeeLayout': employeeLayout,
//             'managerLayout': managerLayout,
//             'financeLayout': financeLayout,
//             'businessAdminLayout': businessAdminLayout,
//             'superAdminLayout': superAdminLayout
//         };

//         for (const role of rolesToAccess) {
//             const dashboardView = await layoutFunctionByRole[role](tenantId, empId);
//             console.log("dashboardView", dashboardView)
//         }

//         return res.status(200).json({ dashboardView });
//     } catch (error) {
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };

const getEmployeeRoles = async (tenantId, empId) => {
    const toString = empId.toString();
    const hrDocument = await HRMaster.findOne({
        'tenantId': tenantId,
        'employees.employeeDetails.employeeId': toString,
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

const executeLayoutFunctions = async (tenantId, empId, employeeRoles, res) => {
  const rolesToAccess = [];
  if (employeeRoles.employee) {
      rolesToAccess.push('employeeLayout');
  }
  if (employeeRoles.employeeManager) {
      rolesToAccess.push('managerLayout');
  }
  // if (employeeRoles.finance) {
  //     rolesToAccess.push('financeLayout');
  // }
  if (employeeRoles.businessAdmin) {
      rolesToAccess.push('businessAdminLayout');
  }
  // if (employeeRoles.superAdmin) {
  //     rolesToAccess.push('superAdminLayout');
  // }

  const layoutFunctionByRole = {
      'employeeLayout': employeeLayout,
      'managerLayout': managerLayout,
      // 'financeLayout': financeLayout,
      'businessAdminLayout': businessAdminLayout,
      // 'superAdminLayout': superAdminLayout
  };

  const dashboardViews = {};
  for (const role of rolesToAccess) {
      if (typeof layoutFunctionByRole[role] !== 'function') {
          console.error(`Function for role '${role}' is not defined or not a function.`);
          continue;
      }
      dashboardViews[role] = await layoutFunctionByRole[role](tenantId, empId, res);
  }
  return dashboardViews;
};

// export const roleBasedLayout = async (req, res) => {
//     try {
//         const { tenantId, empId } = req.params;

//         // Input validation
//         if (!tenantId || !empId) {
//             return res.status(400).json({ error: "Invalid input parameters" });
//         }

//         const employeeRoles = await getEmployeeRoles(tenantId, empId);
//         const rolesToAccess = getRolesToAccess(employeeRoles);
//         const dashboardViews = await executeLayoutFunctions(tenantId, empId, rolesToAccess, res);

//         return res.status(200).json({ dashboardViews });
//     } catch (error) {
//         console.error("Error:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };


export const roleBasedLayout = async (req, res) => {
  try {
    const { tenantId, empId } = req.params;

    // Input validation
    if (!tenantId || !empId) {
      return res.status(400).json({ error: "Invalid input parameters" });
    }

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

const getDashboardViews = async (tenantId, empId) => {
    // console.log("getDashboardViews", "tenantId", tenantId, "empId", empId);

    const employeeRoles = await getEmployeeRoles(tenantId, empId);
    // console.log("employeeRoles", employeeRoles);

    const layoutFunctions = {
        employee: async () => employeeLayout(tenantId, empId),
        employeeManager: async () => managerLayout(tenantId, empId),
        finance: async () => financeLayout(tenantId, empId),
        businessAdmin: async () => businessAdminLayout(tenantId, empId),
        superAdmin: async () => superAdminLayout(tenantId, empId)
    };
    // console.log("Layout functions retrieved:", layoutFunctions);

    const applicableRoles = Object.keys(employeeRoles).filter(role => employeeRoles[role]);

    // console.log("Applicable roles:", applicableRoles);

    const dashboardViews = await Promise.all(applicableRoles.map(async role => {
        // console.log("Processing role:", role);

        try {
            const data = await layoutFunctions[role]();
            // console.log("Successfully retrieved data for role:", role, "Data:", data);
            return { [role]: data };
        } catch (error) {
            console.error("Error fetching data for role", role, "Error:", error);
            return { [role]: null }; // Handle the error case as needed
        }
    }));

    // console.log("dashboardViews for employee....", dashboardViews);
    return dashboardViews.reduce((acc, curr) => ({ ...acc, ...curr }), {});
};



//----------------------------------------------------------------------------employeeRole 

const WorkemployeeLayout = async (tenantId, empId) => {
    console.log("Entering employeeLayout function...", tenantId, empId);
  try {
      const travelStandAlone = await travelStandAloneForEmployee(tenantId, empId);
      console.log("travelStandAlone", travelStandAlone);
      const travelWithCash = await travelWithCashForEmployee(tenantId, empId);
      console.log("travelWithCash", travelWithCash);
      const trip = await getTripForEmployee(tenantId, empId);
      console.log("trip", trip)
      return { travelStandAlone, travelWithCash, trip };
  } catch (error) {
      console.error("Error:", error);
      throw new Error({ message: 'Internal server error' });
  }
};

const employeeLayout = async (tenantId, empId) => {
    // console.log("Entering employeeLayout function...", tenantId, empId);
  try {
      const travelStandAlone = await travelStandAloneForEmployee(tenantId, empId);
    // console.log("employeeLayout --travelStandAlone", travelStandAlone);
    const travelWithCash = await travelWithCashForEmployee(tenantId, empId);
     console.log("employeeLayout---travelWithCash", travelWithCash);
     const trip = await getTripForEmployee(tenantId, empId);
      const {rejectedCashAdvances} = travelWithCash
    const travelRequestCombined = [ ...travelStandAlone.travelRequests, ...travelWithCash.travelRequests]
    const rejectedTravelRequestsCombined = [ ...travelStandAlone.rejectedTravelRequests, ...travelWithCash.rejectedTravelRequests]
    const employee = { travelRequests :travelRequestCombined,rejectedTravelRequests:rejectedTravelRequestsCombined , rejectedCashAdvances}
    const testing = {travelStandAlone, travelWithCash}
      return trip;
  } catch (error) {
      console.error("Error:", error);
      throw new Error({ message: 'Internal server error' });
  }
};

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
            $or: [
                { 'travelRequestSchema.travelRequestStatus': { $in: ['draft', 'pending approval', 'approved'] } },
                { 'travelRequestSchema.travelRequestStatus': { $in: ['rejected'] } },
                { 'travelRequestSchema.travelRequestStatus': { $nin: ['rejected'] } },
            ],
        });

        if(travelRequestDocs?.length>0){
            // console.log("travel standAlone From db....",travelRequestDocs)

            const allTravelRequests = travelRequestDocs.filter(({travelRequestSchema:{travelRequestStatus}}) => travelRequestStatus !== 'rejected').map(({ travelRequestSchema: { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus } }) => ({
                travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus
            }));
            
    
            const rejectedRequests = travelRequestDocs.filter(({ travelRequestSchema: { travelRequestStatus } }) => travelRequestStatus === 'rejected').map(({travelRequestSchema:{ travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, rejectionReason } }) => ({
                travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, rejectionReason
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
                .forEach(({travelRequestSchema: { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, itinerary } }) => {
                    Object.entries(itinerary).forEach(([itineraryType,itineraryArray]) =>
                    itineraryArray.forEach(({itineraryId, rejectionReason, status}) => {        
                         if (status === 'rejected') {
                            // Extract the necessary details and add them to the rejectedItineraryLines array
                            rejectedItineraryLines.push({
                                travelRequestId,
                                travelRequestNumber,
                                tripPurpose,
                                travelRequestStatus,
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
// const travelWithCashForEmployee = async (tenantId, empId) => {
//     try {
//         let allTravelRequests = [];
//         let rejectedRequests = [];
//         let rejectedItineraryLines = [];
//         let rejectedCashAdvances = [];

//         const travelRequestDocsApproved = await dashboard.find({
//             tenantId,
//             'createdBy.empId': empId,
//             'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $in: ['draft', 'pending approval', 'approved'] },
//             'cashAdvanceSchema.cashAdvanceData.cashAdvanceStatus':{$nin:['rejected']}
//         });

//         const travelRequestDocsRejected = await dashboard.find({
//             tenantId,
//             'createdBy.empId': empId,
//             'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $in: ['rejected'] },
//         });

//         const travelRequestDocsLegRejected = await dashboard.find({
//             tenantId,
//             'createdBy.empId': empId,
//             'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $nin: ['rejected'] },
//         });

//         const travelRequestDocsCashRejected = await dashboard.find({
//             tenantId,
//             'createdBy.empId': empId,
//             'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus':{$in:['rejected']}
//         });


//         // travelRequest with cash advance
//         travelRequestDocsApproved.forEach((travelRequest) => {
//             const { travelRequestId,travelRequestNumber,tripPurpose,travelRequestStatus,cashAdvancesData } = travelRequest;
        
//             const travelWithCash = {travelRequestId,travelRequestNumber, tripPurpose, travelRequestStatus,cashAdvances: [] };
        
//             cashAdvancesData.forEach((cashAdvance) => {
//                 const {
//                     cashAdvanceId,
//                     cashAdvanceNumber,
//                     amountDetails
//                 } = cashAdvance;
        
//                 travelWithCash.cashAdvances.push({
//                     cashAdvanceId,
//                     cashAdvanceNumber,
//                     amountDetails
//                 });
//             });
        
//             allTravelRequests.push(travelWithCash);
//         });
         
//         //Rejected travel Request
//         travelRequestDocsRejected.forEach((travelRequest) => {
//             const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, rejectionReason } = travelRequest;
//             rejectedRequests.push({ travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, rejectionReason });
//         });

//         //rejected itinerary
//         travelRequestDocsLegRejected.forEach((travelRequest) => {
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
//         });
        
//         //Rejected cashAdvance
//         travelRequestDocsCashRejected.forEach((cashAdvance) => {
//             const {travelRequestId,cashAdvanceId, cashAdvanceNumber, amountDetails, rejectionReason} = cashAdvance;
//             rejectedCashAdvances.push({travelRequestId,cashAdvanceId, cashAdvanceNumber, amountDetails, rejectionReason})
//         })

//         const travelRequests = {...allTravelRequests };
//        const rejectedTravelRequests = {...rejectedRequests, ...rejectedItineraryLines , ...rejectedCashAdvances };

//        return {travelRequests: travelRequests, rejectedTravelRequests: rejectedTravelRequests}
//     } catch (error) {
//       console.error("Error in fetching employee Dashboard:", error);
//       // Return an object indicating the error occurred
//       throw new Error({ error: 'Error in fetching employee Dashboard' });
//     }
// };
const worktravelWithCashForEmployee = async (tenantId, empId) => {
    try {
        let allTravelRequests = [];
        let rejectedRequests = [];
        let rejectedItineraryLines = [];
        let rejectedCashAdvances = [];

        console.log("Fetching cashSchema ...", tenantId, empId);
        const travelRequestDocsApproved = await dashboard.find({
            'cashAdvanceSchema.travelRequestData.tenantId':tenantId,
            'cashAdvanceSchema.createdBy.empId': empId,
            $or:[
                {            
                'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $in: ['draft', 'pending approval', 'approved'] },
                'cashAdvanceSchema.cashAdvanceData.cashAdvanceStatus':{$nin:['rejected']}
                },
                {'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $in: ['rejected'] }},
                {'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $nin: ['rejected'] }},
                {            'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus':{$in:['rejected']}            }
            ]

        });
        console.log("Fetched travelRequestDocsApproved:", travelRequestDocsApproved);

        console.log("Fetching travelRequestDocsRejected...");
        const travelRequestDocsRejected = await dashboard.find({
            'cashAdvanceSchema.travelRequestData.tenantId':tenantId,
            'cashAdvanceSchema.createdBy.empId': empId,
        });
        console.log("Fetched travelRequestDocsRejected:", travelRequestDocsRejected);

        console.log("Fetching travelRequestDocsLegRejected...");
        const travelRequestDocsLegRejected = await dashboard.find({
            'cashAdvanceSchema.travelRequestData.tenantId':tenantId,
            'cashAdvanceSchema.createdBy.empId': empId,
        });
        console.log("Fetched travelRequestDocsLegRejected:", travelRequestDocsLegRejected);

        console.log("Fetching travelRequestDocsCashRejected...");
        const travelRequestDocsCashRejected = await dashboard.find({
            'cashAdvanceSchema.travelRequestData.tenantId':tenantId,
            'createdBy.empId': empId,
        });

        console.log("Fetched travelRequestDocsCashRejected:", travelRequestDocsCashRejected);

        // travelRequest with cash advance
        console.log("Processing travelRequestDocsApproved...");
        travelRequestDocsApproved.forEach((travelRequest) => {
            const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, cashAdvancesData } = travelRequest;

            const travelWithCash = { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, cashAdvances: [] };

            cashAdvancesData.forEach((cashAdvance) => {
                const { cashAdvanceId, cashAdvanceNumber, amountDetails } = cashAdvance;

                travelWithCash.cashAdvances.push({
                    cashAdvanceId,
                    cashAdvanceNumber,
                    amountDetails
                });
            });

            allTravelRequests.push(travelWithCash);
        });
        console.log("Processed travelRequestDocsApproved:", allTravelRequests);

        // Rejected travel Request
        console.log("Processing travelRequestDocsRejected...");
        travelRequestDocsRejected.forEach((travelRequest) => {
            const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, rejectionReason } = travelRequest;
            rejectedRequests.push({ travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, rejectionReason });
        });
        console.log("Processed travelRequestDocsRejected:", rejectedRequests);

        // Rejected itinerary
        console.log("Processing travelRequestDocsLegRejected...");
        travelRequestDocsLegRejected.forEach((travelRequest) => {
            const { itinerary } = travelRequest.travelRequestSchema;

            Object.keys(itinerary).forEach((category) => {
                itinerary[category].forEach((itineraryItem) => {
                    if (itineraryItem.status === 'rejected') {
                        const { itineraryId, rejectedReason, status } = itineraryItem;
                        const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus } = travelRequest;

                        rejectedItineraryLines.push({
                            itineraryId,
                            rejectedReason,
                            status,
                            travelRequestId,
                            travelRequestNumber,
                            tripPurpose,
                            travelRequestStatus,
                        });
                    }
                });
            });
        });
        console.log("Processed travelRequestDocsLegRejected:", rejectedItineraryLines);

        // Rejected cashAdvance
        console.log("Processing travelRequestDocsCashRejected...");
        travelRequestDocsCashRejected.forEach((cashAdvance) => {
            const { travelRequestId, cashAdvanceId, cashAdvanceNumber, amountDetails, rejectionReason } = cashAdvance;
            rejectedCashAdvances.push({ travelRequestId, cashAdvanceId, cashAdvanceNumber, amountDetails, rejectionReason });
        });
        console.log("Processed travelRequestDocsCashRejected:", rejectedCashAdvances);

        const travelRequests = { ...allTravelRequests };
        const rejectedTravelRequests = { ...rejectedRequests, ...rejectedItineraryLines, ...rejectedCashAdvances };

        console.log("Returning data:", { travelRequests, rejectedTravelRequests });
        return { travelRequests, rejectedTravelRequests };
    } catch (error) {
        console.error("Error in fetching employee Dashboard:", error);
        // Return an object indicating the error occurred
        throw new Error({ error: 'Error in fetching employee Dashboard' });
    }
};

const travelWithCashForEmployee = async (tenantId, empId) => {
    console.log("entering travelWithCashForEmploy", tenantId, empId);
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

    if (!travelRequestDocs || travelRequestDocs?.length === 0) {
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
           const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus } = cashAdvanceSchema.travelRequestData;
           const cashAdvancesData = cashAdvanceSchema?.cashAdvancesData || [];
       
           const cashAdvances = cashAdvancesData.map(({ cashAdvanceId, cashAdvanceNumber, amountDetails }) => ({
             cashAdvanceId,
             cashAdvanceNumber,
             amountDetails: amountDetails.map(detail => ({
               amount: detail.amount,
               shortName: detail.currency.shortName, 
               mode: detail.mode
             })),
           }));
       
           return {
             travelRequestId,
             travelRequestNumber,
             tripPurpose,
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
           const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus } = cashAdvanceSchema.travelRequestData;
           const cashAdvancesData = cashAdvanceSchema?.cashAdvancesData || [];
       
           const cashAdvances = cashAdvancesData.map(({ cashAdvanceId, cashAdvanceNumber, amountDetails }) => ({
             cashAdvanceId,
             cashAdvanceNumber,
             amountDetails: amountDetails.map(detail => ({
               amount: detail.amount,
               shortName: detail.currency.shortName, 
               mode: detail.mode, 
             })),
           }));
       
           return {
             travelRequestId,
             travelRequestNumber,
             tripPurpose,
             travelRequestStatus,
             cashAdvances,
           };
        });
       };
       
       const rejectedTravelRequestsAll = processRejectedTravelRequests(travelRequestDocs);
       
  
       let rejectedItineraryLines = [];

       travelRequestDocs.filter(({cashAdvanceSchema:{travelRequestData:{travelRequestStatus}}}) => travelRequestStatus !== 'rejected')
           .forEach(({cashAdvanceSchema:{travelRequestData: { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, itinerary }} }) => {
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
   
//    const rejectedCashAdvances = filteredDocs.flatMap(doc => 
//     doc.cashAdvanceSchema.cashAdvancesData
//        .filter(cashAdvance => cashAdvance.cashAdvanceStatus === 'rejected')
//        .map(({ travelRequestId, cashAdvanceId, cashAdvanceNumber, amountDetails,cashAdvanceStatus, rejectionReason }) => ({

//          travelRequestId,
//          cashAdvanceId,
//          cashAdvanceNumber,
//          cashAdvanceStatus,
//          amountDetails,
//          rejectionReason,
//        }))
//    );

   
    //   console.log("Processed rejectedCashAdvances:", rejectedCashAdvances);
    const rejectedCashAdvances = filteredDocs.flatMap(doc => 
        doc.cashAdvanceSchema.cashAdvancesData
           .filter(cashAdvance => cashAdvance.cashAdvanceStatus === 'rejected')
           .map(({ travelRequestId, cashAdvanceId, cashAdvanceNumber, amountDetails, cashAdvanceStatus, rejectionReason }) => {
             // Extract amount and shortName from each object inside amountDetails array
             const extractedAmountDetails = amountDetails.map(detail => ({
               amount: detail.amount,
               shortName: detail.currency.shortName, 
             }));
    
             return {
               travelRequestId,
               cashAdvanceId,
               cashAdvanceNumber,
               cashAdvanceStatus,
               amountDetails: extractedAmountDetails,
               rejectionReason,
             };
           })
    );
    
      const travelRequests = [...allTravelRequests];
      const rejectedTravelRequests = [...rejectedTravelRequestsAll, ...rejectedItineraryLines,];
      
      console.log("Returning data:", { travelRequests, rejectedTravelRequests , rejectedCashAdvances});
      return { travelRequests, rejectedTravelRequests, rejectedCashAdvances };
    } } catch (error) {
      console.error("Error in fetching employee Dashboard:", error);
      // Return an object indicating the error occurred
      throw new Error({ error: 'Error in fetching employee Dashboard' });
    }
  };
  

const getTripForEmployee = async (tenantId, empId) => {
    console.log("entering trips")
  try {
      const tripDocs = await dashboard.find({
          'tripSchema.tenantId': tenantId,
          'tripSchema.travelRequestData.createdBy.empId': empId,
          $or: [
              { 'tripSchema.tripStatus': { $in: ['transit', 'upcoming', 'completed'] } },
              { 'tripSchema.travelExpenseData.expenseHeaderStatus': 'rejected' },
          ],
          'tripSchema.cashAdvanceData.cashAdvanceStatus': { $nin: ['rejected'] },
          'reimbursementSchema.createdBy.empId': empId,
      }).lean().exec();

      if (!tripDocs || tripDocs.length === 0) {
          return { message: 'There are no trips found for the user' };
      }

      const transitTrips = tripDocs
          .filter(trip => trip.tripSchema.tripStatus === 'transit')
          .map(trip => {
              const { cashAdvancesData, travelExpenseData, itinerary, tripSchema, _id } = trip;
              const { totalCashAmount, totalremainingCash } = tripSchema.expenseAmountStatus;

              return {
                  _id,
                  travelRequestId: tripSchema.travelRequestId,
                  travelRequestNumber: tripSchema.travelRequestNumber,
                  tripPurpose: tripSchema.tripPurpose,
                  tripStartDate: tripSchema.tripStartDate,
                  tripCompletionDate: tripSchema.tripCompletionDate,
                  travelRequestStatus: tripSchema.travelRequestStatus,
                  isCashAdvanceTaken: tripSchema?.isCashAdvanceTaken,
                  totalCashAmount,
                  totalremainingCash,
                  cashAdvances: isCashAdvanceTaken ? cashAdvancesData?.map(({ cashAdvanceId, cashAdvanceNumber, amountDetails }) => ({
                      cashAdvanceId,
                      cashAdvanceNumber,
                      amountDetails
                  })) : 'Raise a Cash Advance',
                  travelExpenses: travelExpenseData?.map(({ expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus }) => ({
                      expenseHeaderId,
                      expenseHeaderNumber,
                      expenseHeaderStatus
                  })),
                  ItineraryArray: Object.entries(itinerary)
                      .filter(([category]) => category !== 'formState')
                      .map(([category, items]) => ({
                          [category]: items.map(({ bkd_from, bkd_to, status, itineraryId }) => ({
                              category,
                              bkd_from,
                              bkd_to,
                              status,
                              itineraryId
                          }))
                      }))
              };
          });

      const completedTrips = tripDocs
          .filter(trip => trip.tripSchema.tripStatus === 'completed')
          .flatMap(trip => trip.tripSchema.travelExpenseData.map(({ tripId, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus }) => ({
              tripId,
              tripPurpose: trip.tripSchema.tripPurpose,
              expenseHeaderId,
              expenseHeaderNumber,
              expenseHeaderStatus
          })));

      const rejectedTrips = tripDocs
          .filter(trip => trip.tripSchema.tripStatus === 'rejected')
          .flatMap(trip => trip.tripSchema.travelExpenseData.map(({ tripId, tripNumber, expenseHeaderId, expenseHeaderNumber, expenseAmountStatus }) => ({
              tripId,
              tripPurpose: trip.tripSchema.tripPurpose,
              tripNumber,
              expenseHeaderId,
              expenseHeaderNumber,
              expenseAmountStatus
          })));

      const upcomingTrips = tripDocs
          .filter(trip => trip.tripSchema.tripStatus === 'upcoming')
          .map(trip => {
              const { tripSchema, cashAdvancesData, itinerary, _id } = trip;
              const { totalCashAmount, totalremainingCash } = tripSchema.expenseAmountStatus;

              return {
                  _id,
                  travelRequestId: tripSchema.travelRequestId,
                  travelRequestNumber: tripSchema.travelRequestNumber,
                  tripPurpose: tripSchema.tripPurpose,
                  tripStartDate: tripSchema.tripStartDate,
                  tripCompletionDate: tripSchema.tripCompletionDate,
                  travelRequestStatus: tripSchema.travelRequestStatus,
                  isCashAdvanceTaken: tripSchema.isCashAdvanceTaken,
                  totalCashAmount,
                  totalremainingCash,
                  cashAdvances: cashAdvancesData.map(({ cashAdvanceId, cashAdvanceNumber, amountDetails }) => ({
                      cashAdvanceId,
                      cashAdvanceNumber,
                      amountDetails
                  })),
                  ItineraryArray: Object.entries(itinerary)
                      .filter(([category]) => category !== 'formState')
                      .map(([category, items]) => ({
                          [category]: items.map(({ bkd_from, bkd_to, status, itineraryId }) => ({
                              bkd_from,
                              bkd_to,
                              status,
                              itineraryId
                          }))
                      }))
              };
          });

      const nonTravelExpenseReports = tripDocs
          .flatMap(trip => trip.reimbursementSchema.filter(({ createdBy }) => createdBy.empId === empId))
          .map(({ expenseHeaderId, createdBy, expenseHeaderNumber, expenseHeaderStatus }) => ({
              expenseHeaderId,
              createdBy,
              expenseHeaderNumber,
              expenseHeaderStatus
          }));

          return {
            transitTrips,
            completedTrips,
            upcomingTrips,
            rejectedTrips,
            nonTravelExpenseReports
        };
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
    
//       const { totalCashAmount, totalremainingCash } = expenseAmountStatus;
    
//       const tripWithExpense = {
//         travelRequestId,
//         travelRequestNumber,
//         tripPurpose,
//         tripStartDate,
//         tripCompletionDate,
//         travelRequestStatus,
//         isCashAdvanceTaken,
//         totalCashAmount,
//         totalremainingCash,
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
  
//       const { totalCashAmount, totalremainingCash } = expenseAmountStatus;
  
//       const commonTripDetails = {
//         travelRequestId,
//         travelRequestNumber,
//         tripPurpose,
//         tripStartDate,
//         tripCompletionDate,
//         travelRequestStatus,
//         isCashAdvanceTaken,
//         totalCashAmount,
//         totalremainingCash,
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
  
//         const { totalCashAmount, totalremainingCash } = expenseAmountStatus;
  
//         const commonTripDetails = {
//           travelRequestId,
//           travelRequestNumber,
//           tripPurpose,
//           tripStartDate,
//           tripCompletionDate,
//           travelRequestStatus,
//           isCashAdvanceTaken,
//           totalCashAmount,
//           totalremainingCash,
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

const managerLayout = async ({tenantId,empId}) => {
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
  try {
    const approvalDoc = await dashboard.find({
      tenantId,
      $or: [
        {
          'travelRequestSchema.approvers.empId': empId,
          'travelRequestSchema.approvers.status': 'pending approval'
        },
        {
          $and: [
            {
              'cashAdvanceSchema.travelRequestData.travelRequestStatus': 'pending approval'
            },
            {
              'cashAdvanceSchema.travelRequestData.approvers.empId': empId,
              'cashAdvanceSchema.travelRequestData.approvers.status': 'pending approval'
            },
          ]
        },
        {
          $and: [
            {
              'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $nin: ['pending approval'] }
            },
            {
              'cashAdvanceSchema.travelRequestData.approvers.empId': empId,
              'cashAdvanceSchema.travelRequestData.approvers.status': 'pending approval'
            },
          ]
        },
        {
          $or: [
            {
              'tripSchema.travelRequestData.isAddALeg': true,
              'tripSchema.travelRequestData.approvers.empId': empId,
            },
            {
              'tripSchema.travelExpenseData.approvers.empId': empId,
              'tripSchema.travelExpenseData.approvers.status': 'pending approval'
            }
          ]
        },
      ]
    }).lean().exec();

    if (!approvalDoc?.length) {
      return { message: 'There are no approvals found for the user' };
    } else {
      const travelRequests = await processApproval(
        approvalDoc.filter(approval => approval.travelRequestSchema.approvers.status === 'pending approval'),
        'pending approval',
        empId
      );
      const travelWithCash = await processApproval(
        approvalDoc.filter(approval => approval.cashAdvanceSchema.travelRequestData.approvers.status === 'pending approval'),
        'pending approval',
        empId
      );
      const cashAdvanceRaisedLater = await processApprovalCashRaisedLater(
        approvalDoc.filter(approval =>
          approval.cashAdvanceSchema.travelRequestData.travelRequestStatus !== 'pending approval' &&
          approval.cashAdvanceSchema.travelRequestData.approvers.empId === empId &&
          approval.cashAdvanceSchema.travelRequestData.approvers.status === 'pending approval'
        ),
        'pending approval',
        empId
      );

      const addAleg = await processApproval(
        approvalDoc.filter(approval =>
          approval.tripSchema.travelRequestData.isAddALeg.status === true &&
          approval.tripSchema.travelRequestData.approvers.empId === empId
        ),
        'pending approval',
        empId
      );

      const travelExpenseReports = await processApprovaltravelExpenseReports(
        approvalDoc.filter(approval =>
          approval.tripSchema.travelExpenseData.approvers.status === 'pending approval' &&
          approval.tripSchema.travelExpenseData.approvers.empId === empId
        ),
        'pending approval',
        empId
      );

      return  responseData = {
        travelAndCash: [...travelRequests, ...travelWithCash, ...cashAdvanceRaisedLater, ...addAleg],
        travelExpenseReports: travelExpenseReports.travelExpenseReportsApproval
      };
    }
  } catch (error) {
    console.error("Error in fetching employee Dashboard:", error);
    // Return an object indicating the error occurred
    throw new Error({ error: 'Error in fetching employee Dashboard' });
  }
};

//---------------------------------------------------------------------Travel admin
const businessAdminLayout = async ({ tenantId, empId}) => {
    try {
        const bookingDoc = await dashboard.find({
            tenantId,
            $or: [
                { 'travelRequestSchema.travelRequestStatus': 'pending booking' },
                { 'cashAdvanceSchema.travelRequestData.travelRequestStatus': 'pending booking' },
                { $and:[
                        {'tripSchema.travelRequestData.isAddALeg': true},
                        {'tripSchema.travelRequestData.travelRequestStatus': 'booked'} 
                    ]  
                },
                { 'tripSchema.travelRequestData.tripStatus': 'paid and cancelled' },
            ],
        })
        .lean()
        .exec();

        if (!bookingDoc || bookingDoc.length === 0) return { error: 'Error in fetching data for business admin' };

        const pendingBooking = [];
        const paidAndCancelledTrips = [];
        const pendingItineraryLines = [];

        bookingDoc.forEach((booking) => {
            const { travelRequestSchema, cashAdvanceSchema, tripSchema } = booking;

            if (travelRequestSchema.travelRequestStatus === 'pending booking' || travelRequestSchema.isAddALeg === true) {
                const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, isAddALeg } = travelRequestSchema;
                pendingBooking.push({ travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, isAddALeg });
            }

            const { travelRequestData } = cashAdvanceSchema;
            const extractedProperties = Object.keys(travelRequestData)
                .filter(key => ['travelRequestId', 'travelRequestNumber', 'tripPurpose', 'travelRequestStatus'].includes(key))
                .reduce((acc, key) => {
                    acc[key] = travelRequestData[key];
                    return acc;
                }, {});

            if (Object.keys(extractedProperties).length > 0) {
                pendingBooking.push(extractedProperties);
            }

            if (tripSchema.travelRequestData.tripStatus === 'paid and cancelled') {
                const { tripId, tripNumber, tripStatus } = tripSchema.travelRequestData;
                paidAndCancelledTrips.push({ tripId, tripNumber, tripStatus });
            }

            const { travelRequestData: tripData } = tripSchema;
            const isAddALeg = tripData.isAddALeg;

            const filteredItineraries = Object.entries(tripData.itinerary).reduce((acc, [key, value]) => {
                const filteredArray = value.filter(item => item.status === 'pending booking' || item.status === 'paid and cancelled');
                if (filteredArray.length > 0) {
                    acc.push({ itineryKEYName: key, itineraryStatus: 'pending booking' ||  'paid and cancelled'});
                }
                return acc;
            }, []);

            if (isAddALeg && filteredItineraries.length > 0) {
                Object.entries(tripData.itinerary).forEach(([category, items]) => {
                    items.forEach((itineraryItem) => {
                        if (itineraryItem.status === 'pending booking') {
                            const { itineraryId, status } = itineraryItem;
                            const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus } = booking;
                            pendingItineraryLines.push({
                                itineraryId,
                                status,
                                travelRequestId,
                                travelRequestNumber,
                                tripPurpose,
                                travelRequestStatus,
                            });
                        }
                        if (itineraryItem.status === 'paid and cancelled') {
                            const { itineraryId, status } = itineraryItem;
                            const { travelRequestId, travelRequestNumber,  travelRequestStatus } = booking;
                            paidAndCancelledTrips.push({travelRequestId, travelRequestNumber,  travelRequestStatus})
                            const itinerary = []
                            itinerary.push({
                                itineraryId,
                                status,
                            });
                            paidAndCancelledTrips.push({itinerary})
                        }
                    });
                });
            }
        });

        return responseData = { pendingBooking, paidAndCancelledTrips, pendingItineraryLines };
    } catch (error) {
      console.error("Error in fetching employee Dashboard:", error);
      // Return an object indicating the error occurred
     throw new Error({ error:'Error in fetching data for business admin' });
    }
};

