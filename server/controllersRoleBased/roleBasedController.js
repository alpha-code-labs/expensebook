import { cashAdvanceSchema } from "../models/cashSchema.js";
import HRCompany from "../models/hrCompanySchema.js";
import { travelRequestSchema } from "../models/travelSchema.js";

//Role based Layout
export const roleBasedLayout = async (req, res) => {
    try {
        const { tenantId, empId } = req.params;

        const hrDocument = await HRCompany.findOne({
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

        switch (true) {
            case employeeRoles.employee:
                await employeeLayout(tenantId, empId);
                break;
            case employeeRoles.employeeManager:
                await managerLayout(tenantId, empId);
                break;
            case employeeRoles.finance:
                await financeLayout(tenantId, empId);
                break;
            case employeeRoles.businessAdmin:
                await businessAdminLayout(tenantId, empId);
                break;
            case employeeRoles.superAdmin:
                await superAdminLayout(tenantId, empId);
                break;
            default:
                break;
        }

        return res.status(200).json({ employeeRoles });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

//-------------------------------------------------employeeRole 

const employeeLayout = async ({tenantId,empId}) => {
     try{
        const travelStandAlone = await travelStandAloneForEmployee(tenantId,empId);
        const travelWithCash = await travelWithCashForEmployee(tenantId,empId);
        const trip = await getTripForEmployee(tenantId,empId);

        res.status.status(200).json({ success: true,
        travelStandAlone,
        travelWithCash,
        })

     } catch(error){
       return res.status(500).json({message:'internal server error'})
    }
}

// travel standalone
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
  
// travel with cash
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

//---------------------------------------------------------------
const processTripsByStatus = (tripDocs, status) => {
    const trips = [];
  
    tripDocs.forEach((trip) => {
      const { tripSchema } = trip.tripSchema;
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
      } = tripSchema;
  
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
  
      if (status === 'transit') {
        travelExpenseData.forEach((travelExpense) => {
          const { tripId, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus } = travelExpense;
          tripWithExpense.travelExpenses.push({ tripId, expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus });
        });
      }
  
      trips.push(tripWithExpense);
    });
  
    return { [status]: trips };
  };
  
  const getTripForEmployee = async (tenantId, empId) => {
    try {
      const tripDocs = await cashAdvanceSchema.find({
        tenantId,
        'createdBy.empId': empId,
        $or: [
          { 'tripSchema.travelRequestData.travelRequestStatus': { $in: ['transit'] } },
          { 'tripSchema.travelRequestData.travelRequestStatus': { $in: ['upcoming'] } }
        ],
        'tripSchema.cashAdvanceData.cashAdvanceStatus': { $nin: ['rejected'] },
      });
  
      if (!tripDocs || tripDocs.length === 0) {
        return { message: 'There are no trips found for the user' };
      }
  
      const transitTrips = processTripsByStatus(tripDocs.filter(trip => trip.tripSchema.travelRequestData.travelRequestStatus === 'transit'), 'transit');
      const upcomingTrips = processTripsByStatus(tripDocs.filter(trip => trip.tripSchema.travelRequestData.travelRequestStatus === 'upcoming'), 'upcoming');
      const completedTrips = processTripsByStatus(tripDocs.filter(trip => trip.tripSchema.travelRequestData.travelRequestStatus === 'completed'), 'completed');

  
      return { transitTrips, upcomingTrips, completedTrips };
    } catch (error) {
      return { error: 'Error in fetching employee Dashboard' };
    }
  };
  



