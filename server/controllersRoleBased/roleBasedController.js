import { financeLayout } from "../controllers/financeController.js";
import { cashAdvanceSchema } from "../models/cashSchema.js";
import dashboard from "../models/dashboardSchema.js";
import HRMaster from "../models/hrMasterSchema.js";
import { travelRequestSchema } from "../models/travelSchema.js";

//Role based Layout
export const roleBasedLayout = async (req, res) => {
    try {
        const { tenantId, empId } = req.params;

        const hrDocument = await HRMaster.findOne({
            'tenantId': tenantId,
            'employees.employeeDetails.employeeId': empId,
        });

        if (!hrDocument) {
            return res.status(404).json({ error: "HR document not found" });
        }

        const { employeeRoles } = hrDocument.employees;

        if (!employeeRoles) {
            return res.status(404).json({ error: "Employee roles not found" });
        }

        const rolesToAccess = [];

        if (employeeRoles.employee) {
            rolesToAccess.push('employeeLayout');
        }
        if (employeeRoles.employeeManager) {
            rolesToAccess.push('managerLayout');
        }
        if (employeeRoles.finance) {
            rolesToAccess.push('financeLayout');
        }
        if (employeeRoles.businessAdmin) {
            rolesToAccess.push('businessAdminLayout');
        }
        if (employeeRoles.superAdmin) {
            rolesToAccess.push('superAdminLayout');
        }
      
        // Mapping each layout function name to its implementation function
        const layoutFunctionByRole = {
            'employeeLayout': employeeLayout,
            'managerLayout': managerLayout,
            'financeLayout': financeLayout,
            'businessAdminLayout': businessAdminLayout,
            'superAdminLayout': superAdminLayout
        };

        for (const role of rolesToAccess) {
            await layoutFunctionByRole[role](tenantId, empId);
        }

        return res.status(200).json({ employeeRoles });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};


//----------------------------------------------------------------------------employeeRole 

const employeeLayout = async ({tenantId,empId}) => {
     try{
        const travelStandAlone = await travelStandAloneForEmployee(tenantId,empId);
        const travelWithCash = await travelWithCashForEmployee(tenantId,empId);
        const trip = await getTripForEmployee(tenantId,empId);

        res.status.status(200).json({ success: true,
        travelStandAlone,
        travelWithCash,
        trip
        })

     } catch(error){
       return res.status(500).json({message:'internal server error'})
    }
}

//----------------travel standalone for an employee

const travelStandAloneForEmployee = async (tenantId, empId) => {
    try {
        let allTravelRequests = [];
        let rejectedRequests = [];
        let rejectedItineraryLines = [];

        const travelRequestDocsApproved = await travelRequestSchema.find({
            tenantId,
            'createdBy.empId': empId,
            'travelRequestSchema.travelRequestStatus': { $in: ['draft', 'pending approval', 'approved'] },
        });

        const travelRequestDocsRejected = await travelRequestSchema.find({
            tenantId,
            'createdBy.empId': empId,
            'travelRequestSchema.travelRequestStatus': { $in: ['rejected'] },
        });

        const travelRequestDocsLegRejected = await travelRequestSchema.find({
            tenantId,
            'createdBy.empId': empId,
            'travelRequestSchema.travelRequestStatus': { $nin: ['rejected'] },
        });

        travelRequestDocsApproved.forEach((travelRequest) => {
            const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus } = travelRequest;
            allTravelRequests.push({ travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus });
        });

        travelRequestDocsRejected.forEach((travelRequest) => {
            const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, rejectionReason } = travelRequest;
            rejectedRequests.push({ travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, rejectionReason });
        });

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
            

        return { allTravelRequests, rejectedRequests, rejectedItineraryLines };

    } catch (error) {
        return { error: 'Error in fetching employee Dashboard' };
    }
};

//----------------travel with cash for an employee

const travelWithCashForEmployee = async (tenantId, empId) => {
    try {
        let allTravelRequests = [];
        let rejectedRequests = [];
        let rejectedItineraryLines = [];
        let rejectedCashAdvances = [];

        const travelRequestDocsApproved = await cashAdvanceSchema.find({
            tenantId,
            'createdBy.empId': empId,
            'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $in: ['draft', 'pending approval', 'approved'] },
            'cashAdvanceSchema.cashAdvanceData.cashAdvanceStatus':{$nin:['rejected']}
        });

        const travelRequestDocsRejected = await cashAdvanceSchema.find({
            tenantId,
            'createdBy.empId': empId,
            'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $in: ['rejected'] },
        });

        const travelRequestDocsLegRejected = await cashAdvanceSchema.find({
            tenantId,
            'createdBy.empId': empId,
            'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $nin: ['rejected'] },
        });

        const travelRequestDocsCashRejected = await cashAdvanceSchema.find({
            tenantId,
            'createdBy.empId': empId,
            'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus':{$in:['rejected']}
        });


        // travelRequest with cash advance
        travelRequestDocsApproved.forEach((travelRequest) => {
            const { travelRequestId,travelRequestNumber,tripPurpose,travelRequestStatus,cashAdvancesData } = travelRequest;
        
            const travelWithCash = {travelRequestId,travelRequestNumber, tripPurpose, travelRequestStatus,cashAdvances: [] };
        
            cashAdvancesData.forEach((cashAdvance) => {
                const {
                    cashAdvanceId,
                    cashAdvanceNumber,
                    amountDetails
                } = cashAdvance;
        
                travelWithCash.cashAdvances.push({
                    cashAdvanceId,
                    cashAdvanceNumber,
                    amountDetails
                });
            });
        
            allTravelRequests.push(travelWithCash);
        });
         
        //Rejected travel Request
        travelRequestDocsRejected.forEach((travelRequest) => {
            const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, rejectionReason } = travelRequest;
            rejectedRequests.push({ travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus, rejectionReason });
        });

        //rejected itinerary
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
        
        //Rejected cashAdvance
        travelRequestDocsCashRejected.forEach((cashAdvance) => {
            const {travelRequestId,cashAdvanceId, cashAdvanceNumber, amountDetails, rejectionReason} = cashAdvance;
            rejectedCashAdvances.push({travelRequestId,cashAdvanceId, cashAdvanceNumber, amountDetails, rejectionReason})
        })

        return { allTravelRequests, rejectedRequests, rejectedItineraryLines , rejectedCashAdvances };

    } catch (error) {
        return { error: 'Error in fetching employee Dashboard' };
    }
};

//----------------trip, travel and non-travel expenseReports for an employee
const processTripsByStatus = (tripDocs, status) => {
    const trips = [];
    const travelExpenseContainer = [];
    const rejectedExpenseReports = [];
    
    tripDocs.forEach((trip) => {
      const {
        travelRequestId,
        travelRequestNumber,
        tripPurpose,
        tripStartDate,
        tripCompletionDate,
        travelRequestStatus,
        isCashAdvanceTaken,
        cashAdvancesData,
        travelExpenseData,
        expenseAmountStatus
      } = trip.tripSchema;
    
      const { totalCashAmount, totalremainingCash } = expenseAmountStatus;
    
      const tripWithExpense = {
        travelRequestId,
        travelRequestNumber,
        tripPurpose,
        tripStartDate,
        tripCompletionDate,
        travelRequestStatus,
        isCashAdvanceTaken,
        totalCashAmount,
        totalremainingCash,
        cashAdvances: [],
        travelExpenses: []
      };
    
      cashAdvancesData.forEach((cashAdvance) => {
        const { cashAdvanceId, cashAdvanceNumber, amountDetails } = cashAdvance;
        tripWithExpense.cashAdvances.push({ cashAdvanceId, cashAdvanceNumber, amountDetails });
      });
    
      const isTransitTrip = status === 'transit';
      const isCompletedTrip = status === 'completed';
      const isRejectedExpenseReport = status === 'rejected';
  
      if (isTransitTrip) {
        travelExpenseData.forEach((travelExpense) => {
          const { tripId, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus } = travelExpense;
          tripWithExpense.travelExpenses.push({ tripId, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus });
        });
        trips.push(tripWithExpense);
      } else if (isCompletedTrip) {
        travelExpenseData.forEach((travelExpense) => {
          const { tripId, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus } = travelExpense;
          travelExpenseContainer.push({ tripId, tripPurpose, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus });
        });
      } else if (isRejectedExpenseReport) {
        travelExpenseData.forEach((travelExpense) => {
          const { tripId, tripNumber, expenseHeaderNumber, expenseHeaderId, expenseAmountStatus } = travelExpense;
          rejectedExpenseReports.push({ tripId, tripPurpose, tripNumber, expenseHeaderNumber, expenseHeaderId, expenseAmountStatus });
        });
      }
    });
  
    if (isTransitTrip) {
      return { [status]: trips };
    } else if (isCompletedTrip) {
      return { [status]: travelExpenseContainer };
    } else {
      return { [status]: rejectedExpenseReports };
    }
};

  // non travel expense reports for an employeee
const processNonTravelExpenseReports = (tripDocs, empId) => {
    const nonTravelExpenseReports = [];
  
    tripDocs.forEach((expense) => {
      const { nonTravelExpenseSchema } = expense;
      const { createdBy, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus } = nonTravelExpenseSchema;
  
      const isValidEmployee = empId === createdBy.empId;
  
      if (isValidEmployee) {
        nonTravelExpenseReports.push({ expenseHeaderId, createdBy, expenseHeaderNumber, expenseHeaderStatus });
      }
    });
  
    if (nonTravelExpenseReports.length > 0) {
      return { [empId]: nonTravelExpenseReports };
    } else {
      return {}; // Return an empty object if there are no valid non-travel expense reports for the employee
    }
};
  
//trip for the employee 
const getTripForEmployee = async (tenantId, empId) => {
    try {
        const tripDocs = await cashAdvanceSchema.find({
            tenantId,
            'createdBy.empId': empId,
            $or: [
              { 'tripSchema.tripStatus': { $in: ['transit', 'upcoming', 'completed'] } },
              { 'tripSchema.travelExpenseData.expenseHeaderStatus': { $in: ['rejected'] } },
            ],
            'tripSchema.cashAdvanceData.cashAdvanceStatus': { $nin: ['rejected'] },
            'nonTravelExpenseSchema.createdBy.empId': empId, 
          }).lean().exec(); // Use .lean().exec() to execute the query and await the result
          
      if (!tripDocs || tripDocs.length === 0) {
        return { message: 'There are no trips found for the user' };
      }

      if(tripDocs){
         const transitTrips = await processTripsByStatus(tripDocs.filter(trip => trip.tripSchema.tripStatus === 'transit'), 'transit');
      const upcomingTrips = await  processTripsByStatus(tripDocs.filter(trip => trip.tripSchema.tripStatus === 'upcoming'), 'upcoming');
      const completedTrips = await processTripsByStatus(tripDocs.filter(trip => trip.tripSchema.tripStatus === 'completed'), 'completed');
      const rejectedExpenseReports = await processTripsByStatus(tripDocs.filter(trip =>trip.tripSchema.travelExpenseData.expenseHeaderStatus === 'rejected'), 'rejected');
      const nonTravelExpenseReports = await processNonTravelExpenseReports(tripDocs.filter(trip => trip.nonTravelExpenseSchema.createdBy.empId === empId), empId);
  
      return { transitTrips, upcomingTrips, completedTrips, rejectedExpenseReports, nonTravelExpenseReports};

      }
  
     
    } catch (error) {
      return { error: 'Error in fetching employee Dashboard' };
    }
};

//------------------------------------------------------------------------------- employeeManger

const managerLayout = async ({tenantId,empId}) => {
    try{
       const approvals = await approvalsForManager(tenantId,empId);

       res.status.status(200).json({ success: true,
       approvals,
       })

    } catch(error){
      return res.status(500).json({message:'internal server error'})
   }
}

//------------- employee manager Approvals 


// cashAdvanceSchema
cashAdvanceSchema.forEach((cashAdvance) => {
    const { travelRequestData, cashAdvanceData } = cashAdvance;

    const isValidTravelStatus = travelRequestData.travelRequestStatus === 'pending approval';
    const isValidStatus = status === travelRequestData.approvers.status;
    const isValidApprover = empId === travelRequestData.approvers.empId;


    // travel and cash both are - pending approval 
    if ( isValidTravelStatus && isValidStatus && isValidApprover) {
      const { travelRequestId, approvers, travelRequestNumber, travelRequestStatus } = travelRequestData;

      const isValidCashStatus = cashAdvanceData.cashAdvanceStatus === 'pending approval';
      if (isValidCashStatus){
        // Assuming cashAdvanceData is an array and iterating through it
          cashAdvanceData.forEach((cashAdvance) => {
        const { travelRequestNumber, cashAdvanceNumber, cashAdvanceId } = cashAdvance;
        currentTrWithCash.cashAdvance.push({travelRequestNumber, cashAdvanceNumber, cashAdvanceId })
      });

      travelWithCashForApproval.push({ travelRequestId, approvers, travelRequestNumber, travelRequestStatus, cashAdvance });

      }
      const currentTrWithCash = {  travelRequestId, approvers, travelRequestNumber, travelRequestStatus , cashAdvance:[]};

      travelWithCashForApproval.push({ travelRequestId, approvers, travelRequestNumber, travelRequestStatus, cashAdvance });
    }
  });

// travel, cash for approval
  const processApproval = async (approvalDoc, status, empId) => {
    const travelRequestForApproval = [];
    const travelWithCashForApproval = [];

    approvalDoc.forEach((approval) => {
        const { travelRequestSchema, cashAdvanceSchema } = approval;
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


//All Approvals for manager
const approvalsForManager = async (tenantId, empId) => {
    try {
        const approvalDoc = await cashAdvanceSchema.find({
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
                    'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $nin:['pending approval']} 
                    },
                    {
                    'cashAdvanceSchema.travelRequestData.approvers.empId': empId,
                    'cashAdvanceSchema.travelRequestData.approvers.status': 'pending approval'
                    },
                ]
              },
              {
                'tripSchema.travelExpenseData.approvers.empId': empId,
                'tripSchema.travelExpenseData.approvers.status': 'pending approval'
              },
            ]
          }).lean().exec(); // Use .lean().exec() to execute the query and await the result
          
      if (!approvalDoc || approvalDoc.length === 0) {
        return { message: 'There are no approvals found for the user' };
      }

      if (approvalDoc){
      const travelRequests = await processApproval(approvalDoc.filter(approval => approval.travelRequestSchema.approvers.status === 'pending approval'), 'pending approval', empId);
      const travelWithCash = await processApproval(approvalDoc.filter(approval => approval.cashAdvanceSchema.travelRequestData.approvers.status === 'pending approval'), 'pending approval',empId);
      const cashAdvanceRaisedLater = await processApprovalCashRaisedLater(
        approvalDoc.filter(approval => { 
            return (
                approval.cashAdvanceSchema.travelRequestData.travelRequestStatus !== 'pending approval' &&
                approval.cashAdvanceSchema.travelRequestData.approvers.empId === empId &&
                approval.cashAdvanceSchema.travelRequestData.approvers.status === 'pending approval'
            );
        }),
        'pending approval',
        empId
    );    

    const travelExpenseReports = await processApprovaltravelExpenseReports(
        approvalDoc.filter(approval => {
            return (
                approval.tripSchema.travelExpenseData.approvers.status === 'pending approval' &&
                approval.tripSchema.travelExpenseData.approvers.empId === empId
            );
        }),
        'pending approval',
        empId
    );
    
      return {travelRequests,travelWithCash,cashAdvanceRaisedLater,travelExpenseReports};
      }
  
    } catch (error) {
        return { error: 'Error in fetching approvals for Dashboard' };
      }
};


//---------------------------------------------------------------------Travel admin
const businessAdminLayout = async ({tenantId,empId}) => {
    try {
        const bookingDoc = await dashboard.find({
                tenantId,
                $or: [
                    {
                        $or: [
                            { 'travelRequestSchema.isAddALeg': true },
                            { 'travelRequestSchema.travelRequestStatus': 'pending booking' },
                        ],
                    },
                    {
                        $or: [
                            { 'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $in: ['pending booking', 'booked'] } },
                            { 'cashAdvanceSchema.travelRequestData.isAddALeg': true },
                        ],
                    },
                    { 
                        'tripSchema.travelRequestData.isAddALeg':true, // to get tripId
                    }
                ],
            })
            .lean()
            .exec();

        if(bookingDoc){

        //travel standalone -- pending booking or add a leg
         const pendingBooking = [];
         const filteredTravelDocs = bookingDoc.filter((travel) => {return(
                travel.travelRequestSchema.travelRequestStatus === 'pending booking' || travelRequestSchema.isAddALeg === true 
            )
        });

        filteredTravelDocs.forEach((travel) => {
        const { travelRequestSchema } = travel;
    
        const { travelRequestId, travelRequestNumber, tripPurpose, travelRequestStatus , isAddALeg } = travelRequestSchema;
    
         pendingBooking.push({
           travelRequestId,
           travelRequestNumber,
           tripPurpose,
           travelRequestStatus,
           isAddALeg
         });
        });

        // cashAdvanceSchema -- extracting travel booking
        const filteredCashDocs = bookingDoc.filter((cash) => {return( 
            cash.cashAdvanceSchema.travelRequestData.travelRequestStatus === 'pending booking' ||
            cash.cashAdvanceSchema.travelRequestData.travelRequestStatus === 'booked' ||
            cash.cashAdvanceSchema.travelRequestData.isAddALeg === true)})
        
        filteredCashDocs.forEach((booking) => {
            const { cashAdvanceSchema } = booking;
            const {travelRequestData} = cashAdvanceSchema;

            const extractedProperties = {};
            const extractedKeyValuePairs = ['travelRequestId', 'travelRequestNumber', 'tripPurpose','travelRequestStatus'];
         Object.entries(travelRequestData).forEach(([key, value]) => {
             if(extractedKeyValuePairs.includes(key)){
                extractedProperties[key] = value;
             }
           });
          });

            if (Object.keys(extractedKeyValuePairs).length > 0) {
                  pendingBooking.push(extractedProperties);
           }
        }    

        return { pendingBooking };

    } catch (error) {
        return { error: 'Error in fetching data for business admin' };
    }
};




// const travelBooking = [];
// const cancelledTrips = [];

// bookingDoc.forEach((approval) => {
//     const { cashAdvanceSchema } = approval;
//     const { travelRequestData } = cashAdvanceSchema;


//     const extractedKeyValuePairs = ['travelRequestId', 'travelRequestNumber', 'tripPurpose','travelRequestStatus'];
//       Object.entries(travelRequestData).forEach(([key, value]) => {
//     if (extractedKeyValuePairs.includes(key)) {
//         const isValidTravelStatus = key === 'travelRequestStatus' && value === status;
//         if (isValidTravelStatus && travelRequestData.approvers.empId === empId) {
//             travelWithCashRaisedLater.push({ [key]: value });
//         }
//     }
// });

//     if (Object.keys(extractedKeyValuePairs).length > 0) {
//         travelBooking.push({ approvalId: approval._id, extractedKeyValuePairs });
    
//     }
// });

// return { travelBooking };






