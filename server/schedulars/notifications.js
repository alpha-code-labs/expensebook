import cron from 'node-cron'
import dotenv from 'dotenv'
import dashboard from "../models/dashboardSchema.js"; 
import Notification from "../models/notification.js";

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

const setEmployeeNotifications = async (tenantId) => {
    try {
        const now = new Date();
        const maxDaysAhead = Math.max(...NOTIFICATION_DAYS);
        const futureDate = new Date(now.getTime() + maxDaysAhead * 24 * 60 * 60 * 1000);
        const pastDate = new Date(now.getTime() - maxDaysAhead * 24 * 60 * 60 * 1000);

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
    const schedule = process.env.SCHEDULE_TIME??'*/5 * * * * *';
    cron.schedule(schedule, async () => {
      console.log('Running Notification batchJob...');
      try {
        await setEmployeeNotifications();
        console.log('Notification batchJob completed successfully.');
      } catch (error) {
        console.error('Error running NotificationBatchJob batchJob :', error);
      }
    });
    console.log('scheduled Notification batchJob run successfully ')
}

export {
    scheduleToNotificationBatchJob,
}




