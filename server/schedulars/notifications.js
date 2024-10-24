import cron from 'node-cron'
import dotenv from 'dotenv'
import dashboard from "../models/dashboardSchema.js"; 
import Notification from "../models/notification.js";
import { earliestDate } from '../utils/date.js';

dotenv.config();


class PriorityQueue {
    constructor(comparator = (a, b) => a - b) {
        this.heap = [];
        this.comparator = comparator;
    }

    push(value) {
        this.heap.push(value);
        this.bubbleUp(this.heap.length - 1);
    }

    pop() {
        const result = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.bubbleDown(0);
        }
        return result;
    }

    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.comparator(this.heap[index], this.heap[parentIndex]) < 0) {
                [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    bubbleDown(index) {
        while (true) {
            let smallestIndex = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < this.heap.length && this.comparator(this.heap[leftChild], this.heap[smallestIndex]) < 0) {
                smallestIndex = leftChild;
            }
            if (rightChild < this.heap.length && this.comparator(this.heap[rightChild], this.heap[smallestIndex]) < 0) {
                smallestIndex = rightChild;
            }

            if (smallestIndex !== index) {
                [this.heap[index], this.heap[smallestIndex]] = [this.heap[smallestIndex], this.heap[index]];
                index = smallestIndex;
            } else {
                break;
            }
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

const NOTIFICATION_DAYS = new Set([5, 3, 1]);

function calculateFutureAndPastDates(notificationDays) {
    const now = new Date();
    const maxDaysAhead = Math.max(...notificationDays);
    
    const futureDate = new Date(now.getTime() + maxDaysAhead * 24 * 60 * 60 * 1000);
    const pastDate = new Date(now.getTime() - maxDaysAhead * 24 * 60 * 60 * 1000);
    
    return {
        now,
        futureDate,
        pastDate
    };
}

const setEmployeeNotifications = async (tenantId) => {
    try {

        const {now, futureDate, pastDate } = calculateFutureAndPastDates(NOTIFICATION_DAYS);
        const { upcomingTrips, completedTrips } = await fetchTrips(tenantId, now, futureDate, pastDate);

        const notificationQueue = createNotificationQueue(upcomingTrips);
        await processNotificationQueue(notificationQueue);

        // Handle completed trips notifications
        if (completedTrips.length > 0) {
            await processCompletedTripNotifications(completedTrips);
        }

    } catch (error) {
        console.error('Error managing employee notifications:', error);
        throw error;
    }
};

const fetchTrips = async (tenantId, now, futureDate, pastDate) => {
    const getTrips = await dashboard.find(
        {
            tenantId,
            $or: [
                { 'tripSchema.tripStartDate': { $gte: now, $lte: futureDate } },
                { 'tripSchema.tripCompletionDate': { $gte: pastDate, $lte: now } },
            ],
        },
        {
            tenantId: 1,
            'tripSchema.createdBy': 1,
            'tripSchema.travelRequestData.createdBy': 1,
            'tripSchema.tripStartDate': 1,
            'tripSchema.travelRequestData.tripName': 1,
            'tripSchema.tripCompletionDate': 1,
            travelRequestId: 1,
        }
    ).lean();

    const classifyTrips = (trips, now, isUpcoming) => {
        return trips.map(trip => {
            const dateKey = isUpcoming ? 'tripStartDate' : 'tripCompletionDate';
            const tripDate = new Date(trip.tripSchema[dateKey]);
            const status = getStatus(tripDate, now, isUpcoming);
            return { ...trip, status }; 
        });
    };

    const upcomingTrips = classifyTrips(getTrips, now, true).filter(trip => {
        const tripStartDate = new Date(trip.tripSchema.tripStartDate);
        return tripStartDate >= now && tripStartDate <= futureDate;
    });

    const completedTrips = classifyTrips(getTrips, now, false).filter(trip => {
        const tripCompletionDate = new Date(trip.tripSchema.tripCompletionDate);
        return tripCompletionDate.toDateString() === now.toDateString() || tripCompletionDate >= pastDate;
    });

    return { upcomingTrips, completedTrips };
};

const getStatus = (tripDate, now, isUpcoming) => {
    const isToday = tripDate.toDateString() === now.toDateString();
    const daysDiff = (isUpcoming ? tripDate - now : now - tripDate) / (1000 * 60 * 60 * 24);

    if (isUpcoming) {
        if (isToday) return "urgent"; // If the trip starts today
        if (daysDiff >= 3) return "information"; // If the trip starts in 3 or more days
    } else {
        if (isToday) return "action"; // If the trip is completed today
        if (daysDiff > 2) return "urgent"; // If the trip was completed more than 2 days ago
    }
    return "information"; // Default case if no conditions match
};



const createNotificationQueue = (trips) => {
    const queue = new PriorityQueue((a, b) => a.notificationDate - b.notificationDate);
    const now = new Date();

    trips.forEach(trip => {
        const tripStartDate = new Date(trip.tripSchema.tripStartDate);
        NOTIFICATION_DAYS.forEach(days => {
            const notificationDate = new Date(tripStartDate.getTime() - days * 24 * 60 * 60 * 1000);
            if (notificationDate >= now) {
                queue.push({ trip, notificationDate, daysUntilTrip: days });
            }
        });
    });

    return queue;
};

const processNotificationQueue = async (queue) => {
    const notifications = [];
    while (!queue.isEmpty()) {
        const { trip, daysUntilTrip } = queue.pop();
        notifications.push(createNotification(trip, daysUntilTrip, false)); 
    }
    await Promise.all(notifications);
};

const processCompletedTripNotifications = async (completedTrips) => {
    const notifications = completedTrips.map(trip => {
        return createNotification(trip, null, true); 
    });
    await Promise.all(notifications);
};



const createNotification = async (trip, daysUntilTrip, isCompletedTrip) => {
    const messageText = isCompletedTrip
        ? createCompletionNotificationMessage(trip)
        : createNotificationMessage(trip, daysUntilTrip);
    
    const {tenantId,travelRequestId, status} = trip
    const employeeId = trip.tripSchema.travelRequestData.createdBy.empId;
    const existingNotification = await Notification.findOne({
        tenantId,
        travelRequestId,
        'employee.empId': employeeId,
    });

    if (existingNotification) {
        const messageExists = existingNotification.messages.some(msg => msg.text === messageText);
        if (!messageExists) {
            existingNotification.messages.push({
                text: messageText,
                status,
                createdAt: new Date(),
                isRead: false,
            });
            await existingNotification.save();
        } 
    } else {
        const newNotification = new Notification({
            tenantId,
            travelRequestId,
            employee: trip.tripSchema.travelRequestData.createdBy,
            messages: [{
                text: messageText,
                status,
                createdAt: new Date(),
                isRead: false,
            }],
        });
        await newNotification.save();
    }
};


const createCompletionNotificationMessage = (trip) => {
    const tripName = trip.tripSchema.travelRequestData.tripName;
    const tripCompletionDate = new Date(trip.tripSchema.tripCompletionDate).toDateString();
    return `Please Book Your Expenses. Your trip "${tripName}" was completed on ${tripCompletionDate}.`;
};

const createNotificationMessage = (trip, daysUntilTrip) => {
    const tripName = trip.tripSchema.travelRequestData.tripName;
    const tripStartDate = new Date(trip.tripSchema.tripStartDate).toDateString();
    return `Your trip "${tripName}" starts in ${daysUntilTrip} day${daysUntilTrip !== 1 ? 's' : ''} on ${tripStartDate}.`;
};


const scheduleToNotificationBatchJob = () => {
    const schedule = process.env.SCHEDULE_TIME ?? '*/5 * * * * *';
    cron.schedule(schedule, async () => {
        console.log('Running Notification batchJob...');
        try {
            const tenantId = '66e048c79286e2f4e03bdac1'
            await Promise.all([
                setEmployeeNotifications(tenantId),
                setManagerNotifications(tenantId)
            ]);
            console.log('Notification batchJob completed successfully.');
        } catch (error) {
            console.error('Error running NotificationBatchJob:', error);
        }
    });
    console.log('Scheduled Notification batchJob to run successfully.');
};


export const getApprovalDocuments = (tenantId, now, futureDate, pastDate) => {
    return dashboard.find({
        tenantId,
        $or: [
            {
                'travelRequestSchema.isCashAdvanceTaken': false,
                'travelRequestSchema.travelRequestStatus': 'pending approval',
                'travelRequestSchema.approvers.status': 'pending approval'
            },
            {
                'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $in: ['pending approval', 'approved', 'booked', 'pending booking'] },
                'cashAdvanceSchema.travelRequestData.approvers': {
                    $elemMatch: { 'status': { $in: ['pending approval', 'approved'] } }
                },
                'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus': 'pending approval',
                'cashAdvanceSchema.cashAdvancesData.approvers': {
                    $elemMatch: { 'status': 'pending approval' }
                }
            },
            {
                'tripSchema.travelRequestData.isAddALeg': true,
            },
            {
                'tripSchema.travelExpenseData': {
                    $elemMatch: {
                        tenantId: tenantId,
                        expenseHeaderStatus: 'pending approval',
                        'approvers': {
                            $elemMatch: {
                                status: 'pending approval'
                            }
                        }
                    }
                }
            }
        ]
    }).lean().exec();
};

export const getReimbursementReports = (tenantId, now, futureDate, pastDate) => {
    return REIMBURSEMENT.find({
        tenantId,
        'approvers': {
            $elemMatch: {
                empId: empId,
                'status': 'pending approval'
            }
        }
    });
};

// Manager Notifications
const fetchDocuments = async (tenantId, filters, projections) => {
    return await dashboard.find(
        { tenantId, $or: filters },
        projections
    ).lean().exec();
};

const getApprovalReports = async (tenantId, now, futureDate, pastDate) => {
    const filters = [
        {
            'travelRequestSchema.isCashAdvanceTaken': false,
            'travelRequestSchema.travelRequestStatus': 'pending approval',
            'travelRequestSchema.approvers.status': 'pending approval'
        },
        // {
        //     'cashAdvanceSchema.travelRequestData.travelRequestStatus': { $in: ['pending approval', 'approved', 'booked', 'pending booking'] },
        //     'cashAdvanceSchema.travelRequestData.approvers': {
        //         $elemMatch: { 'status': { $in: ['pending approval', 'approved'] } }
        //     },
        //     'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus': 'pending approval',
        //     'cashAdvanceSchema.cashAdvancesData.approvers': {
        //         $elemMatch: { 'status': 'pending approval' }
        //     }
        // },
        // {
        //     'tripSchema.travelRequestData.isAddALeg': true,
        // },
        // {
        //     'tripSchema.travelExpenseData': {
        //         $elemMatch: {
        //             tenantId: tenantId,
        //             expenseHeaderStatus: 'pending approval',
        //             'approvers': {
        //                 $elemMatch: {
        //                     status: 'pending approval'
        //                 }
        //             }
        //         }
        //     }
        // }
    ];

    const projections = {
        tenantId: 1,
        travelRequestId: 1,
        'travelRequestSchema.createdBy': 1,
        'travelRequestSchema.tripName': 1,
        'travelRequestSchema.itinerary': 1,
        'cashAdvanceSchema.travelRequestData.tripName': 1,
        'cashAdvanceSchema.travelRequestData.itinerary': 1,
        'tripSchema.travelRequestData.createdBy': 1,
        'tripSchema.tripStartDate': 1,
        'tripSchema.travelRequestData.tripName': 1,
        'tripSchema.tripCompletionDate': 1,
    };

    const reports = await fetchDocuments(tenantId, filters, projections);
    console.log("reports?.length before manager", reports)
    let approvalReports
    if(reports?.length){
      console.log("reports?.length)", reports?.length)
    }

    return approvalReports
};



const setManagerNotifications = async (tenantId) => {
    try {
        console.info("in notification 0 manager")
        const {now, futureDate, pastDate } = calculateFutureAndPastDates(NOTIFICATION_DAYS);
        const [approvalDoc, reimbursementReports] = await Promise.all([
            getApprovalReports(tenantId, now, futureDate, pastDate),
            getReimbursementReports(tenantId, now, futureDate, pastDate)
        ]);

        if (approvalDoc.length === 0 && reimbursementReports.length === 0) {
            return { message: 'There are no approvals found for the user' };
        }

            let travelAndCash 
            let trips
            let travelExpenseReports
            let nonTravelExpenseReports
            
            if(approvalDoc.length > 0){

                console.info("b4 zebra", approvalDoc)
           const travel = await Promise.all(
                    approvalDoc
                    .filter(approval =>
                        approval.travelRequestSchema?.travelRequestStatus === 'pending approval'&&
                        approval.travelRequestSchema?.approvers &&
                        approval.travelRequestSchema?.approvers.length > 0 &&
                        approval.travelRequestSchema?.isCashAdvanceTaken === false &&
                        approval.travelRequestSchema.approvers.some(approver =>
                        approver.empId === empId &&
                        approver.status === 'pending approval'
                        )
                    )
                    .map(async approval => {
                        const { 
                        travelRequestId, approvers, tripName, createdBy, 
                        travelRequestStatus, itinerary 
                        } = approval.travelRequestSchema;
                        
                        // Await earliestDate if tripStartDate is not present
                        const tripStartDate = approval.travelRequestSchema?.tripStartDate ?? await earliestDate(itinerary);
                        
                        return {
                        travelRequestId, approvers, tripName, tripStartDate,
                        createdBy, travelRequestStatus, 
                        };
                    })
                );
        
                const travelWithCash = await Promise.all (approvalDoc
                        .filter(approval => 
                            approval?.cashAdvanceSchema?.travelRequestData?.travelRequestStatus === 'pending approval' &&
                            approval?.cashAdvanceSchema.travelRequestData.approvers?.some(approver =>
                                approver?.empId === empId && 
                                approver?.status === 'pending approval'
                            )
                        )
                        .map(async approval => {
                                const { travelRequestData, cashAdvancesData } = approval.cashAdvanceSchema;
                                const isValidCashStatus = cashAdvancesData.some(cashAdvance => cashAdvance.cashAdvanceStatus === 'pending approval');
                                const { travelRequestId, approvers, createdBy, travelRequestNumber,tripPurpose,tripName, travelRequestStatus, isCashAdvanceTaken, itinerary } = travelRequestData;
                                const tripStartDate = travelRequestData?.tripStartDate ?? await earliestDate(itinerary)
                                const check= "preApproval"
                                const allBkdViolations = extractValidViolations(itinerary, check);
                                const violationsCounter = countViolations(allBkdViolations);
        
                                const travelRequest = { travelRequestId,travelRequestNumber,createdBy,tripStartDate, tripPurpose,tripName, travelRequestNumber, travelRequestStatus, approvers,isCashAdvanceTaken , violationsCounter};
        
        
                                if (isValidCashStatus) {
                                    const cashAdvanceDetails = cashAdvancesData?.map(cashAdvance => ({
                                        travelRequestNumber: cashAdvance.travelRequestNumber,
                                        cashAdvanceNumber: cashAdvance.cashAdvanceNumber,
                                        cashAdvanceStatus: cashAdvance.cashAdvanceStatus,
                                        cashAdvanceId: cashAdvance.cashAdvanceId,
                                        amountDetails: cashAdvance?.amountDetails,
                                        cashViolationsCounter: cashAdvance?.cashAdvanceViolations ? 1:0 ,
                                    }));
        
                                    return { ...travelRequest, cashAdvance: cashAdvanceDetails };
                                } else{
                                    return { ...travelRequest, cashAdvance: []};
                                }
                            })
                        )
                    // console.log("travelWithCash", JSON.stringify(travelWithCash,'',2))
        
                        // console.log("approvalDoc", approvalDoc)
                    const cashAdvanceRaisedLater = await Promise.all(
                            approvalDoc
                                .filter(approval => {
                                    const travelRequestStatus = approval?.cashAdvanceSchema?.travelRequestData?.travelRequestStatus;
                                    const cashAdvancesData = approval?.cashAdvanceSchema?.cashAdvancesData;
                        
                                    const isValidTravelRequestStatus = ['booked', 'approved', 'pending booking'].includes(travelRequestStatus);
                                    const hasPendingApprovalCashAdvance = cashAdvancesData?.some(cash =>
                                        cash.cashAdvanceStatus === 'pending approval' &&
                                        cash.approvers.some(approver => approver?.empId === empId && approver?.status === 'pending approval')
                                    );
                        
                                    return isValidTravelRequestStatus && hasPendingApprovalCashAdvance;
                                })
                                .map(async approval => {
                        
                                    const { travelRequestData, cashAdvancesData } = approval.cashAdvanceSchema;
                                    const { travelRequestId, travelRequestNumber, tripPurpose, tripName, createdBy, travelRequestStatus, isCashAdvanceTaken, itinerary } = travelRequestData;
                        
                                    const tripStartDate = travelRequestData?.tripStartDate ?? await earliestDate(itinerary);
                                    const allBkdViolations = extractValidViolations(itinerary);
                                    const violationsCounter = countViolations(allBkdViolations);
                        
                                    const travelRequest = { travelRequestId, tripPurpose, tripName, tripStartDate, travelRequestNumber, createdBy, isCashAdvanceTaken, travelRequestStatus, violationsCounter };
                        
                                    const cashAdvanceDetails = cashAdvancesData
                                        .filter(cashAdvance => cashAdvance.cashAdvanceStatus === 'pending approval')
                                        .map(cashAdvance => ({
                                            travelRequestNumber: cashAdvance.travelRequestNumber,
                                            cashAdvanceNumber: cashAdvance.cashAdvanceNumber,
                                            cashAdvanceStatus: cashAdvance.cashAdvanceStatus,
                                            cashAdvanceId: cashAdvance.cashAdvanceId,
                                            amountDetails: cashAdvance.amountDetails,
                                            cashViolationsCounter: cashAdvance?.cashAdvanceViolations ? 1 : 0,
                                        }));
                        
                                    return { ...travelRequest, cashAdvance: cashAdvanceDetails };
                                })
                        );
                        
                    // console.log("cashAdvanceRaisedLater", cashAdvanceRaisedLater)
                    const addALeg= await (async () => {
                        if (!Array.isArray(approvalDoc) || approvalDoc.length === 0) {
                            return {}; 
                        }
                    
                        const result = approvalDoc.map(approval => {
                        
                            const { tripStartDate, travelRequestData = {} } = approval.tripSchema || {};
                            const { itinerary = {} } = travelRequestData;
                    
                            const filteredItinerary = {};
                            ['flights', 'hotels', 'cabs', 'trains'].forEach(category => {
                                const items = itinerary[category] || [];
                                const pendingApprovalItems = items
                                .filter(item =>
                                    item?.approvers?.some(approver =>
                                        approver?.empId === empId && 
                                        approver?.status === 'pending approval'
                                    )
                                );
                    
                                if (pendingApprovalItems.length > 0) {
                                    filteredItinerary[category] = pendingApprovalItems;
                                }
                            });
                
                            // console.log("here...",JSON.stringify(filteredItinerary,null,2))
                    
                            return {
                                travelRequestId: travelRequestData.travelRequestId,
                                tripPurpose: travelRequestData.tripPurpose,
                                createdBy: travelRequestData.createdBy,
                                tripName: travelRequestData.tripName ?? '',
                                travelRequestNumber: travelRequestData.travelRequestNumber,
                                travelRequestStatus: travelRequestData.travelRequestStatus,
                                tripStartDate:tripStartDate,
                                violationsCounter: countViolations(extractValidViolations(itinerary)),
                                itinerary: filteredItinerary
                            };
                        }).filter(item => Object.keys(item.itinerary).length > 0);
                    
                        return result;
                    })();
        
                    const uniqueTravelWithCash = [...travel, ...travelWithCash]
                    const filteredTravelWithCash = Object.values(uniqueTravelWithCash.reduce((uniqueItems, currentItem) => {
                        const existingItem = uniqueItems[currentItem.travelRequestId];
                        if (!existingItem || (currentItem.cashAdvance && currentItem.cashAdvance.length)) {
                            uniqueItems[currentItem.travelRequestId] = currentItem;
                        }
                        return uniqueItems;
                    }, {}));
            
                    console.log("travelExpenseReports", approvalDoc.length)
            
                    travelAndCash = [ ...filteredTravelWithCash, ...cashAdvanceRaisedLater,]
                    trips =[...addALeg]
                    
                    travelExpenseReports = await (async () => {
                    try {
                        const filteredApprovals = approvalDoc.filter(approval => {
                            return approval?.tripSchema?.travelExpenseData?.some(expense => {
                                return expense.tenantId === tenantId &&
                                    expense.expenseHeaderStatus === 'pending approval' &&
                                    expense.approvers.some(approver => {
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
                                const {tripName} = approval.travelRequestSchema
                                const { tripId, tripNumber, tripStatus, tripStartDate } = approval.tripSchema;
                                const { tripPurpose, createdBy} = approval.tripSchema.travelRequestData
                                const { expenseHeaderNumber,expenseHeaderId, expenseHeaderStatus, approvers, expenseLines,} = expense;
                                return { tripId,tripName,tripNumber,tripPurpose,createdBy,tripStatus,tripStartDate, expenseHeaderNumber,expenseHeaderId, expenseHeaderStatus, approvers, expenseLines };
                            });
                        });
                        // console.log(" expense reports for approval:", travelExpenseDataList);
                
                        return travelExpenseDataList;
                    } catch (error) {
                        // console.error('Error occurred:', error);
                        return []; // Return an empty array or handle the error accordingly
                    }
                    })();
                
            //    console.log("nonTravelExpenseReports",nonTravelExpenseReports)
                }


            console.log("kaboom". JSON.stringify(travel[0],'',2))
    } catch (error) {
    }
}

const createNotificationForManager = async (trip, daysUntilTrip, isCompletedTrip) => {
    const messageText = isCompletedTrip
        ? createCompletionNotificationMessage(trip)
        : createNotificationMessage(trip, daysUntilTrip);
    
    const {tenantId,travelRequestId, status} = trip
    const employeeId = trip.tripSchema.travelRequestData.createdBy.empId;
    const existingNotification = await Notification.findOne({
        tenantId,
        travelRequestId,
        'employee.empId': employeeId,
    });

    if (existingNotification) {
        const messageExists = existingNotification.messages.some(msg => msg.text === messageText);
        if (!messageExists) {
            existingNotification.messages.push({
                text: messageText,
                status,
                createdAt: new Date(),
                isRead: false,
            });
            await existingNotification.save();
        } 
    } else {
        const newNotification = new Notification({
            tenantId,
            travelRequestId,
            employee: trip.tripSchema.travelRequestData.createdBy,
            messages: [{
                text: messageText,
                status,
                createdAt: new Date(),
                isRead: false,
            }],
        });
        await newNotification.save();
    }
};

export {
    scheduleToNotificationBatchJob,
}






