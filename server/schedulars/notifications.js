import cron from "node-cron";
import dotenv from "dotenv";
import dashboard from "../models/dashboardSchema.js";
import Notification from "../models/notification.js";
import { earliestDate } from "../utils/date.js";
import HRMaster from "../models/hrMasterSchema.js";
import REIMBURSEMENT from "../models/reimbursementSchema.js";
import EXPENSE_NOTIFICATION from "../models/reimbursementNotification.js";
import FinanceNotification from "../models/financeNotification.js";
import FB_NOTIFICATION, {
  notificationTypeEnums,
} from "../models/fbNotification.js";

dotenv.config();

export const createUrlData = (key, ...props) => {
  if (!key || props.length % 2 !== 0)
    throw new Error(
      "Invalid input: Key is required, and properties must be in pairs."
    );
  return {
    [key]: Object.fromEntries(
      props.reduce((acc, val, i) => {
        if (i % 2 === 0) acc.push([val, props[i + 1]]);
        return acc;
      }, [])
    ),
  };
};

const createCompletionNotificationMessage = (trip) => {
  const tripName = trip.tripSchema.travelRequestData.tripName;
  const tripCompletionDate = new Date(
    trip.tripSchema.tripCompletionDate
  ).toDateString();
  return `Please Book Your Expenses. Your trip "${tripName}" was completed on ${tripCompletionDate}.`;
};

const createNotificationMessage = (trip, daysUntilTrip) => {
  const tripName = trip.tripSchema.travelRequestData.tripName;
  const tripStartDate = new Date(trip.tripSchema.tripStartDate).toDateString();
  return `Info:Your trip "${tripName}" starts in ${daysUntilTrip} day${
    daysUntilTrip !== 1 ? "s" : ""
  } on ${tripStartDate}.`;
};

export const getTripStatus = (tripStartDate) => {
  const today = new Date();
  const dateDifference = Math.ceil(
    (tripStartDate - today) / (1000 * 60 * 60 * 24)
  );

  if (dateDifference <= 0 || dateDifference <= 3) {
    return "urgent";
  } else if (dateDifference <= 10) {
    return "alert";
  } else if (dateDifference <= 20) {
    return "reminder";
  } else {
    return "information";
  }
};


export function getPendingCashAdvances(cashAdvanceArray) {
  const pendingCashAdvances = cashAdvanceArray.filter(
    (item) => item.cashAdvanceStatus === "pending approval"
  );

  if (pendingCashAdvances.length > 0) {
    return pendingCashAdvances.map((item) => ({
      cashAdvanceId: item.cashAdvanceId,
      cashAdvanceStatus: item.cashAdvanceStatus,
    }));
  } else {
    return [];
  }
}
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
        [this.heap[index], this.heap[parentIndex]] = [
          this.heap[parentIndex],
          this.heap[index],
        ];
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

      if (
        leftChild < this.heap.length &&
        this.comparator(this.heap[leftChild], this.heap[smallestIndex]) < 0
      ) {
        smallestIndex = leftChild;
      }
      if (
        rightChild < this.heap.length &&
        this.comparator(this.heap[rightChild], this.heap[smallestIndex]) < 0
      ) {
        smallestIndex = rightChild;
      }

      if (smallestIndex !== index) {
        [this.heap[index], this.heap[smallestIndex]] = [
          this.heap[smallestIndex],
          this.heap[index],
        ];
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

  const futureDate = new Date(
    now.getTime() + maxDaysAhead * 24 * 60 * 60 * 1000
  );
  const pastDate = new Date(now.getTime() - maxDaysAhead * 24 * 60 * 60 * 1000);

  return {
    now,
    futureDate,
    pastDate,
  };
}

const setEmployeeNotifications = async (tenantId) => {
  try {
    const { now, futureDate, pastDate } =
      calculateFutureAndPastDates(NOTIFICATION_DAYS);
    // const testPastDate = new Date(2023,10,1)

    const { upcomingTrips, completedTrips } = await fetchTrips(
      tenantId,
      now,
      futureDate,
      pastDate
      // testPastDate
    );

    // console.log("employee notification", upcomingTrips, completedTrips);
    const notificationQueue = createNotificationQueue(upcomingTrips);
    await processNotificationQueue(notificationQueue);

    // Handle completed trips notifications
    if (completedTrips.length > 0) {
      await processCompletedTripNotifications(completedTrips);
    }
  } catch (error) {
    console.error("Error managing employee notifications:", error);
    throw error;
  }
};

const fetchTrips = async (tenantId, now, futureDate, pastDate) => {
  const getTrips = await dashboard
    .find(
      {
        tenantId,
        $or: [
          { "tripSchema.tripStartDate": { $gte: now, $lte: futureDate } },
          { "tripSchema.tripCompletionDate": { $gte: pastDate, $lte: now } },
        ],
      },
      {
        tenantId: 1,
        "tripSchema.tripId": 1,
        "tripSchema.createdBy": 1,
        "tripSchema.travelRequestData.createdBy": 1,
        "tripSchema.tripStartDate": 1,
        "tripSchema.travelRequestData.tripName": 1,
        "tripSchema.tripCompletionDate": 1,
        travelRequestId: 1,
      }
    )
    .lean();

  const classifyTrips = (trips, now, isUpcoming) => {
    return trips.map((trip) => {
      const dateKey = isUpcoming ? "tripStartDate" : "tripCompletionDate";
      const tripDate = new Date(trip.tripSchema[dateKey]);
      const status = getStatus(tripDate, now, isUpcoming);
      return { ...trip, status };
    });
  };

  const upcomingTrips = classifyTrips(getTrips, now, true).filter((trip) => {
    const tripStartDate = new Date(trip.tripSchema.tripStartDate);
    return tripStartDate >= now && tripStartDate <= futureDate;
  });

  const completedTrips = classifyTrips(getTrips, now, false).filter((trip) => {
    const tripCompletionDate = new Date(trip.tripSchema.tripCompletionDate);
    return (
      tripCompletionDate.toDateString() === now.toDateString() ||
      tripCompletionDate >= pastDate
    );
  });

  return { upcomingTrips, completedTrips };
};

export const getStatus = (tripDate, now, isUpcoming) => {
  const isToday = tripDate.toDateString() === now.toDateString();
  const daysDiff =
    (isUpcoming ? tripDate - now : now - tripDate) / (1000 * 60 * 60 * 24);

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
  const queue = new PriorityQueue(
    (a, b) => a.notificationDate - b.notificationDate
  );
  const now = new Date();

  trips.forEach((trip) => {
    const tripStartDate = new Date(trip.tripSchema.tripStartDate);
    NOTIFICATION_DAYS.forEach((days) => {
      const notificationDate = new Date(
        tripStartDate.getTime() - days * 24 * 60 * 60 * 1000
      );
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
  const notifications = completedTrips.map((trip) => {
    return createNotification(trip, null, true);
  });
  await Promise.all(notifications);
};

// approved or rejected TR Notification
export const sendToEmpNotification = async (array) => {
  try {
    if (!Array.isArray(array)) {
      throw new Error("Input must be an array of travel request objects.");
    }

    await Promise.all(
      array.map(async (travel) => {
        const {
          tenantId,
          travelRequestId,
          approvers,
          createdBy,
          tripName,
          travelRequestStatus,
          rejectionReason,
          cashAdvances:[]
        } = travel;

        let status
        let messageText
        let getUrlData

        const isRejected = travelRequestStatus == "rejected";
        const isApproved = travelRequestStatus == "approved";

        if(isRejected || isApproved){
          status = isRejected ? "action" : "information";
          messageText = isRejected
            ? `Action: Please take action, Your travel request ${tripName} has been rejected.`
            : `Info: Your Travel Request ${tripName} is approved.`;
  
          getUrlData = createUrlData(
            isRejected ? "trRejected" : "trApproved",
            "tenantId",
            tenantId,
            "createdBy",
            createdBy,
            "travelRequestId",
            travelRequestId,
            "travelRequestStatus",
            travelRequestStatus,
            "rejectionReason",
            rejectionReason,
            "approvers",
            approvers
          );
        }
        if(isCashRejected){

        }
      

        const data = {
          tenantId,
          travelRequestId,
          createdBy,
          status,
          messageText,
          getUrlData,
        };

        console.log("is Data", data)
        // Set notification
        await setEmpNotification(data);
      })
    );
  } catch (error) {
    console.error("Error in sendToEmpNotification:", error.message);
  }
};


const createNotification = async (trip, daysUntilTrip, isCompletedTrip) => {
  const data = createNotificationData(trip, daysUntilTrip, isCompletedTrip);
  await setEmpNotification(data);
};

// for employee - newly created trip and  completed trips
const createNotificationData = (trip, daysUntilTrip, isCompletedTrip) => {
  const messageText = isCompletedTrip
    ? createCompletionNotificationMessage(trip)
    : createNotificationMessage(trip, daysUntilTrip);

  const { tenantId, travelRequestId, status } = trip;
  const employeeId = trip.tripSchema.travelRequestData.createdBy.empId;
  const tripId = trip.tripSchema.tripId;
  const createdBy = trip.tripSchema.travelRequestData.createdBy;

  const getUrlData = isCompletedTrip
    ? createUrlData(
        "bookExpense",
        "tenantId",
        tenantId,
        "empId",
        employeeId,
        "tripId",
        tripId
      )
    : createUrlData(
        "overview",
        "tenantId",
        tenantId,
        "empId",
        employeeId,
        "tripName",
        tripName,
        "tripStartDate",
        tripStartDate
      );

  return {
    tenantId,
    travelRequestId,
    createdBy,
    status,
    messageText,
    getUrlData,
  };
};

//create or update Notification
const setEmpNotification = async (data) => {
  const {
    tenantId,
    travelRequestId,
    createdBy,
    status,
    messageText,
    getUrlData,
  } = data;

  // console.log("kaboom", {data})
  const { empId } = createdBy;
  const existingNotification = await Notification.findOne({
    tenantId,
    travelRequestId,
    "employee.empId": empId,
  });

  if (existingNotification) {
    const messageExists = existingNotification.messages.some(
      (msg) => msg.text === messageText
    );

    if (!messageExists) {
      existingNotification.messages.push({
        text: messageText,
        status,
        urlData: getUrlData,
        createdAt: new Date(),
        isRead: false,
      });
      await existingNotification.save();
    }
  } else {
    const newNotification = new Notification({
      tenantId,
      travelRequestId,
      employee: createdBy,
      messages: [
        {
          text: messageText,
          status,
          urlData: getUrlData,
          createdAt: new Date(),
          isRead: false,
        },
      ],
    });
    await newNotification.save();
  }
};

const scheduleToNotificationBatchJob = () => {
  const schedule = process.env.SCHEDULE_TIME ?? "*/5 * * * * *";
  cron.schedule(schedule, async () => {
    // console.log('Running Notification batchJob...');
    try {
      const list = await HRMaster.find().select({ tenantId: 1, _id: 0 });
      const tenantIds = list.map((doc) => doc.tenantId.toString());
      // console.info("list", list, 'tenantIds', tenantIds)

      const notificationPromises = tenantIds.map((tenantId) =>
        Promise.all([
          setEmployeeNotifications(tenantId),
          setManagerNotifications(tenantId),
          setFinanceNotifications(tenantId),
        ])
      );

      await Promise.all(notificationPromises);
      // console.log('Notification batchJob completed successfully.');
    } catch (error) {
      console.error("Error running NotificationBatchJob:", error);
    }
  });
  // console.log('Scheduled Notification batchJob to run successfully.');
};

export const getApprovalDocuments = (tenantId, now, futureDate, pastDate) => {
  return dashboard
    .find({
      tenantId,
      $or: [
        {
          "travelRequestSchema.isCashAdvanceTaken": false,
          "travelRequestSchema.travelRequestStatus": "pending approval",
          "travelRequestSchema.approvers.status": "pending approval",
        },
        {
          "cashAdvanceSchema.travelRequestData.travelRequestStatus": {
            $in: ["pending approval", "approved", "booked", "pending booking"],
          },
          "cashAdvanceSchema.travelRequestData.approvers": {
            $elemMatch: { status: { $in: ["pending approval", "approved"] } },
          },
          "cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus":
            "pending approval",
          "cashAdvanceSchema.cashAdvancesData.approvers": {
            $elemMatch: { status: "pending approval" },
          },
        },
        {
          "tripSchema.travelRequestData.isAddALeg": true,
        },
        {
          "tripSchema.travelExpenseData": {
            $elemMatch: {
              tenantId: tenantId,
              expenseHeaderStatus: "pending approval",
              approvers: {
                $elemMatch: {
                  status: "pending approval",
                },
              },
            },
          },
        },
      ],
    })
    .lean()
    .exec();
};

export const getReimbursementReports = async (
  tenantId,
  now,
  futureDate,
  pastDate
) => {
  const projections = {
    tenantId: 1,
    travelRequestId: 1,
    createdBy: 1,
    approvers: 1,
    expenseSubmissionDate: 1,
    expenseHeaderNumber: 1,
    expenseHeaderId: 1,
    expenseHeaderStatus: 1,
    expenseAmountStatus: 1,
  };

  const reports = await REIMBURSEMENT.find(
    {
      tenantId,
      approvers: {
        $elemMatch: {
          status: "pending approval",
        },
      },
    },
    projections
  );

  return reports.length > 1 ? reports : [];
};

// Manager Notifications
const getDocs = async (tenantId, filters, projections) => {
  return await dashboard
    .find({ tenantId, $or: filters }, projections)
    .lean()
    .exec();
};

const getApprovalReports = async (tenantId, now, futureDate, pastDate) => {
  // console.log("tenantId", tenantId, typeof tenantId);
  const filters = [
    {
      "travelRequestSchema.isCashAdvanceTaken": false,
      "travelRequestSchema.travelRequestStatus": "pending approval",
      "travelRequestSchema.approvers.status": "pending approval",
    },
    {
      "cashAdvanceSchema.travelRequestData.travelRequestStatus": {
        $in: ["pending approval", "approved", "booked", "pending booking"],
      },
      "cashAdvanceSchema.travelRequestData.approvers": {
        $elemMatch: { status: { $in: ["pending approval", "approved"] } },
      },
      "cashAdvanceSchema.cashAdvancesData": {
        $elemMatch: {
          cashAdvanceStatus: "pending approval",
          approvers: { $elemMatch: { status: "pending approval" } },
        },
      },
    },
    { "tripSchema.travelRequestData.isAddALeg": true },
    {
      "tripSchema.travelExpenseData": {
        $elemMatch: {
          tenantId: tenantId,
          expenseHeaderStatus: "pending approval",
          approvers: { $elemMatch: { status: "pending approval" } },
        },
      },
    },
  ];

  const projections = {
    tenantId: 1,
    travelRequestId: 1,
    "travelRequestSchema.tenantId": 1,
    "travelRequestSchema.createdBy": 1,
    "travelRequestSchema.tripName": 1,
    "travelRequestSchema.itinerary": 1,
    "travelRequestSchema.approvers": 1,
    "travelRequestSchema.travelRequestStatus": 1,
    "travelRequestSchema.travelRequestId": 1,
    "travelRequestSchema.isCashAdvanceTaken": 1,
    "travelRequestSchema.createdBy": 1,
    "cashAdvanceSchema.travelRequestData.tenantId": 1,
    "cashAdvanceSchema.travelRequestData.tripName": 1,
    "cashAdvanceSchema.travelRequestData.itinerary": 1,
    "cashAdvanceSchema.travelRequestData.approvers": 1,
    "cashAdvanceSchema.travelRequestData.isCashAdvanceTaken": 1,
    "cashAdvanceSchema.travelRequestData.travelRequestStatus": 1,
    "cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus": 1,
    "cashAdvanceSchema.cashAdvancesData.createdBy": 1,
    "cashAdvanceSchema.travelRequestData.travelRequestId": 1,
    "cashAdvanceSchema.travelRequestData.createdBy": 1,
    "cashAdvanceSchema.cashAdvancesData.approvers": 1,
    "tripSchema.travelRequestData.createdBy": 1,
    "tripSchema.tripStartDate": 1,
    "tripSchema.travelRequestData.tripName": 1,
    "tripSchema.tripCompletionDate": 1,
    "tripSchema.travelExpenseData.expenseHeaderId": 1,
  };

  const reports = await getDocs(tenantId, filters, projections);
  // console.log("reports?.length before manager", reports)
  return reports?.length > 1 ? reports : [];
};

const setManagerNotifications = async (tenantId) => {
  try {
    // console.info("in notification 0 manager", tenantId);
    const { now, futureDate, pastDate } =
      calculateFutureAndPastDates(NOTIFICATION_DAYS);

    const [approvalDoc, nonTravelExpenseReports] = await Promise.all([
      getApprovalReports(tenantId, now, futureDate, pastDate),
      getReimbursementReports(tenantId),
    ]);

    if (approvalDoc.length === 0 && nonTravelExpenseReports.length === 0) {
      // console.log("There are no");
      return { message: "There are no approvals found for the user" };
    }

    let travelAndCash = [];
    let trips = [];
    let travelExpenseReports = [];

    // console.info("set manager", approvalDoc?.length);

    if (approvalDoc.length > 0) {
      // console.log("approvalDoc", approvalDoc);
      const filteredApprovals = approvalDoc.filter((approval) => {
        // console.log("Checking approval:", approval);

        const travelRequestSchema = approval.travelRequestSchema;

        if (!travelRequestSchema || !travelRequestSchema.approvers) {
          // console.warn("No travelRequestSchema or approvers found for approval:", approval);
          return false;
        }

        const isPending =
          travelRequestSchema.travelRequestStatus == "pending approval";
        const hasApprovers = travelRequestSchema.approvers.length > 0;
        const isNotCashAdvance = !travelRequestSchema.isCashAdvanceTaken;
        const hasPendingApprovers = travelRequestSchema.approvers.some(
          (approver) => approver.status === "pending approval"
        );

        // console.log("Filter conditions:", { isPending, hasApprovers, isNotCashAdvance, hasPendingApprovers });

        return (
          isPending && hasApprovers && isNotCashAdvance && hasPendingApprovers
        );
      });

      const travel = await Promise.all(
        filteredApprovals.map(async (approval) => {
          // console.log("Processing approval:", approval);
          const {
            travelRequestId,
            approvers,
            tripName,
            createdBy,
            travelRequestStatus,
            itinerary,
            isCashAdvanceTaken,
          } = approval.travelRequestSchema;
          const tripStartDate =
            approval.travelRequestSchema.tripStartDate ??
            (await earliestDate(itinerary));

          return {
            travelRequestId,
            approvers,
            tripName,
            tripStartDate,
            createdBy,
            travelRequestStatus,
            isCashAdvanceTaken,
          };
        })
      );
    }

    if (approvalDoc.length > 0) {
      // console.info("b4 zebra", approvalDoc?.length);

      const travel = await Promise.all(
        approvalDoc
          .filter(
            (approval) =>
              approval.travelRequestSchema?.travelRequestStatus ===
                "pending approval" &&
              approval.travelRequestSchema?.approvers?.length > 0 &&
              !approval.travelRequestSchema.isCashAdvanceTaken &&
              approval.travelRequestSchema.approvers.some(
                (approver) => approver.status === "pending approval"
              )
          )
          .map(async (approval) => {
            const {
              tenantId,
              travelRequestId,
              approvers,
              tripName,
              createdBy,
              travelRequestStatus,
              itinerary,
              isCashAdvanceTaken,
            } = approval.travelRequestSchema;
            const tripStartDate =
              approval.travelRequestSchema?.tripStartDate ??
              (await earliestDate(itinerary));

            return {
              tenantId,
              travelRequestId,
              approvers,
              tripName,
              tripStartDate,
              createdBy,
              travelRequestStatus,
              isCashAdvanceTaken,
            };
          })
      );

      const travelWithCash = await Promise.all(
        approvalDoc
          .filter(
            (approval) =>
              approval?.cashAdvanceSchema?.travelRequestData
                ?.travelRequestStatus === "pending approval" &&
              approval?.cashAdvanceSchema.travelRequestData.approvers?.some(
                (approver) => approver?.status === "pending approval"
              )
          )
          .map(async (approval) => {
            const { travelRequestData, cashAdvancesData } =
              approval.cashAdvanceSchema;
            const isValidCashStatus = cashAdvancesData.some(
              (cashAdvance) =>
                cashAdvance.cashAdvanceStatus === "pending approval"
            );
            const {
              tenantId,
              travelRequestId,
              approvers,
              createdBy,
              travelRequestNumber,
              tripPurpose,
              tripName,
              travelRequestStatus,
              isCashAdvanceTaken,
              itinerary,
            } = travelRequestData;
            const tripStartDate =
              travelRequestData?.tripStartDate ??
              (await earliestDate(itinerary));

            const travelRequest = {
              tenantId,
              travelRequestId,
              approvers,
              tripName,
              tripStartDate,
              createdBy,
              travelRequestStatus,
              isCashAdvanceTaken,
            };

            const cashAdvanceDetails = isValidCashStatus
              ? cashAdvancesData.map((cashAdvance) => ({
                  cashAdvanceStatus: cashAdvance.cashAdvanceStatus,
                  amountDetails: cashAdvance?.amountDetails,
                }))
              : [];

            return { ...travelRequest, cashAdvance: cashAdvanceDetails };
          })
      );

      const cashAdvanceRaisedLater = await Promise.all(
        approvalDoc
          .filter((approval) => {
            const travelRequestStatus =
              approval?.cashAdvanceSchema?.travelRequestData
                ?.travelRequestStatus;
            const cashAdvancesData =
              approval?.cashAdvanceSchema?.cashAdvancesData;

            const isValidTravelRequestStatus = [
              "booked",
              "approved",
              "pending booking",
            ].includes(travelRequestStatus);
            const hasPendingApprovalCashAdvance = cashAdvancesData?.some(
              (cash) =>
                cash.cashAdvanceStatus === "pending approval" &&
                cash.approvers.some(
                  (approver) => approver?.status === "pending approval"
                )
            );

            return isValidTravelRequestStatus && hasPendingApprovalCashAdvance;
          })
          .map(async (approval) => {
            const { travelRequestData, cashAdvancesData } =
              approval.cashAdvanceSchema;
            const {
              tenantId,
              travelRequestId,
              travelRequestNumber,
              tripPurpose,
              approvers,
              tripName,
              createdBy,
              travelRequestStatus,
              isCashAdvanceTaken,
              itinerary,
            } = travelRequestData;
            const tripStartDate =
              travelRequestData?.tripStartDate ??
              (await earliestDate(itinerary));

            const travelRequest = {
              tenantId,
              travelRequestId,
              tripName,
              approvers,
              tripStartDate,
              travelRequestNumber,
              createdBy,
              isCashAdvanceTaken,
              travelRequestStatus,
            };
            const cashAdvanceDetails = cashAdvancesData
              .filter(
                (cashAdvance) =>
                  cashAdvance.cashAdvanceStatus === "pending approval"
              )
              .map((cashAdvance) => ({
                cashAdvanceStatus: cashAdvance.cashAdvanceStatus,
                cashAdvanceId: cashAdvance.cashAdvanceId,
                amountDetails: cashAdvance.amountDetails,
              }));

            return { ...travelRequest, cashAdvance: cashAdvanceDetails };
          })
      );

      const addALeg = await (async () => {
        if (!Array.isArray(approvalDoc) || approvalDoc.length === 0) {
          return [];
        }

        return approvalDoc
          .map((approval) => {
            const { tripStartDate, travelRequestData = {} } =
              approval.tripSchema || {};
            const { tenantId, itinerary = {} } = travelRequestData;

            const filteredItinerary = {};
            ["flights", "hotels", "cabs", "trains"].forEach((category) => {
              const items = itinerary[category] || [];
              const pendingApprovalItems = items.filter((item) =>
                item?.approvers?.some(
                  (approver) => approver?.status === "pending approval"
                )
              );

              if (pendingApprovalItems.length > 0) {
                filteredItinerary[category] = pendingApprovalItems;
              }
            });

            return {
              tenantId,
              travelRequestId: travelRequestData.travelRequestId,
              tripPurpose: travelRequestData.tripPurpose,
              createdBy: travelRequestData.createdBy,
              tripName: travelRequestData.tripName ?? "",
              travelRequestStatus: travelRequestData.travelRequestStatus,
              tripStartDate,
              itinerary: filteredItinerary,
            };
          })
          .filter((item) => Object.keys(item.itinerary).length > 0);
      })();

      const uniqueTravelWithCash = [...travel, ...travelWithCash];
      const filteredTravelWithCash = Object.values(
        uniqueTravelWithCash.reduce((uniqueItems, currentItem) => {
          const existingItem = uniqueItems[currentItem.travelRequestId];
          if (
            !existingItem ||
            (currentItem.cashAdvance && currentItem.cashAdvance.length)
          ) {
            uniqueItems[currentItem.travelRequestId] = currentItem;
          }
          return uniqueItems;
        }, {})
      );

      travelAndCash = [...filteredTravelWithCash, ...cashAdvanceRaisedLater];
      trips = [...addALeg];

      travelExpenseReports = await (async () => {
        try {
          const filteredApprovals = approvalDoc.filter((approval) => {
            return approval?.tripSchema?.travelExpenseData?.some((expense) => {
              return (
                expense.tenantId === tenantId &&
                expense.expenseHeaderStatus === "pending approval" &&
                expense.approvers.some((approver) => {
                  return approver.status === "pending approval";
                })
              );
            });
          });

          return filteredApprovals.flatMap((approval) => {
            return approval.tripSchema.travelExpenseData.map((expense) => {
              const { tenantId, tripName } = approval.travelRequestSchema;
              const { tripId, tripNumber, tripStatus, tripStartDate } =
                approval.tripSchema;
              const { tripPurpose, createdBy } =
                approval.tripSchema.travelRequestData;
              const {
                expenseHeaderNumber,
                expenseHeaderId,
                expenseHeaderStatus,
                approvers,
                expenseLines,
              } = expense;
              return {
                tenantId,
                tripId,
                tripName,
                tripNumber,
                tripPurpose,
                createdBy,
                tripStatus,
                tripStartDate,
                expenseHeaderNumber,
                expenseHeaderId,
                expenseHeaderStatus,
                approvers,
                expenseLines,
              };
            });
          });
        } catch (error) {
          console.error("Error occurred:", error);
          return [];
        }
      })();
    }

    const reports = {
      travelAndCash,
      trips,
      travelExpenseReports,
      nonTravelExpenseReports,
    };
    const createNotifications = await createNotificationForManager(reports);
    return createNotifications;
  } catch (error) {
    console.error("Error in setManagerNotifications:", error);
    return { message: "An error occurred while fetching notifications." };
  }
};

const createNotificationForManager = async (reports) => {
  const {
    travelAndCash = [],
    trips = [],
    travelExpenseReports = [],
    nonTravelExpenseReports = [],
  } = reports;

  function getPendingCashAdvances(cashAdvanceArray) {
    const pendingCashAdvances = cashAdvanceArray.filter(
      (item) => item.cashAdvanceStatus === "pending approval"
    );

    if (pendingCashAdvances.length > 0) {
      return pendingCashAdvances.map((item) => ({
        cashAdvanceId: item.cashAdvanceId,
        cashAdvanceStatus: item.cashAdvanceStatus,
      }));
    } else {
      return [];
    }
  }

  if (travelAndCash?.length) {
    const processNotifications = async (travelAndCash) => {
      try {
        const notificationPromises = travelAndCash.map(async (trip) => {
          const {
            tenantId,
            createdBy,
            travelRequestId,
            approvers = [],
            tripName = "Trip",
            tripStartDate,
            travelRequestStatus,
            isCashAdvanceTaken,
            cashAdvance,
          } = trip;
          const date = tripStartDate.toDateString();
          const status = getTripStatus(tripStartDate);
          const employeeId = createdBy.empId;
          const isPA = travelRequestStatus === "pending approval";
          const hasPendingCashAdvance = cashAdvance?.some(
            (advance) => advance.cashAdvanceStatus === "pending approval"
          );

          let messageText = `Urgent! Please approve the trip "${tripName}", scheduled to start on ${date}.`;
          if (hasPendingCashAdvance) {
            messageText += " This trip includes cash advance.";
          }

          let getUrlData = createUrlData(
            "pendingApproval",
            "tenantId",
            tenantId,
            "approvers",
            approvers,
            "travelRequestId",
            travelRequestId
          );
          if (!isPA) {
            const result = getPendingCashAdvances(cashAdvance);
            if (result.length > 0) {
              console.log("Pending Cash Advances:", result);
            }

            getUrlData = createUrlData(
              "raisedLater",
              "tenantId",
              tenantId,
              "empId",
              employeeId,
              "travelRequestId",
              travelRequestId,
              "cashAdvanceData",
              result
            );
          }

          return await createOrUpdateManagerNotification({
            tenantId,
            travelRequestId,
            approvers,
            messageText,
            status,
            getUrlData,
          });
        });

        await Promise.all(notificationPromises);

        // console.log('All notifications processed successfully.');
      } catch (error) {
        console.error("Error processing notifications:", error);
      }
    };
    await processNotifications(travelAndCash);
  }

  if (trips?.length) {
    const processNotifications = async (reports) => {
      try {
        reports.map(async (trip) => {
          const { tenantId, travelRequestId } = trip;
          const employeeId = trip.travelRequestData.createdBy.empId;
          const approvers = trip.travelRequestSchema.approvers;
          const tripName =
            trip.tripSchema?.travelRequestData?.tripName || "Unnamed Trip";
          const tripStartDate = new Date(
            trip.tripSchema?.tripStartDate
          ).toDateString();
          const hasPendingCashAdvance = cashAdvance?.some(
            (advance) => advance.cashAdvanceStatus === "pending approval"
          );
          const status = getTripStatus(tripStartDate);
          let getUrlData = createUrlData(
            "addALegApproval",
            "tenantId",
            tenantId,
            "approvers",
            approvers,
            "travelRequestId",
            travelRequestId
          );

          let messageText = `Urgent!, Please approve the leg item added for the trip "${tripName}", which started on ${tripStartDate}`;
          if (hasPendingCashAdvance) {
            messageText += " This trip includes cash advance.";
            const result = getPendingCashAdvances(cashAdvance);
            getUrlData = createUrlData(
              "raisedLater",
              "tenantId",
              tenantId,
              "empId",
              employeeId,
              "travelRequestId",
              travelRequestId,
              "cashAdvanceData",
              result
            );
          }

          const result = await createOrUpdateManagerNotification({
            tenantId,
            travelRequestId,
            approvers,
            messageText,
            status,
            getUrlData,
          });
          return result;
        });

        // console.log('All notifications processed successfully.');
      } catch (error) {
        console.error("Error processing notifications:", error);
      }
    };
    await processNotifications(trips);
  }

  if (travelExpenseReports?.length) {
    const processNotifications = async (reports) => {
      try {
        // Map over reports and create notifications
        const notificationPromises = reports.map(async (trip) => {
          const {
            tenantId,
            travelRequestId,
            tripStartDate,
            tripId,
            expenseHeaderId,
          } = trip;
          const approvers = trip.travelRequestSchema?.approvers || [];
          const tripName = trip.travelRequestSchema?.tripName || "Unnamed Trip";
          const messageText = `Reminder!, Please approve the expense reports submitted for trip titled "${tripName},"`;
          const status = "important";

          let getUrlData = createUrlData(
            "expenseApproval",
            "tenantId",
            tenantId,
            "approvers",
            approvers,
            "tripId",
            tripId,
            "expenseHeaderId",
            expenseHeaderId
          );

          return await createOrUpdateManagerNotification({
            tenantId,
            travelRequestId,
            approvers,
            messageText,
            status,
            getUrlData,
          });
        });

        await Promise.all(notificationPromises);

        // console.log('All notifications processed successfully.');
      } catch (error) {
        console.error("Error processing notifications:", error);
      }
    };
    await processNotifications(travelExpenseReports);
  }

  if (nonTravelExpenseReports?.length) {
    const processNotifications = async (reports) => {
      try {
        const notificationPromises = reports.map(async (report) => {
          const {
            tenantId,
            expenseHeaderId,
            expenseHeaderNumber,
            approvers = [],
            expenseAmountStatus = {},
          } = report;

          const totalExpenseAmount =
            expenseAmountStatus.totalExpenseAmount || 0;
          const messageText = `Action: Please approve the reimbursement report ${expenseHeaderNumber} totaling ${totalExpenseAmount}.`;
          const status = "action";

          let getUrlData = createUrlData(
            "nonTravelExpenseApproval",
            "tenantId",
            tenantId,
            "approvers",
            approvers,
            "expenseHeaderId",
            expenseHeaderId
          );

          return await createOrUpdateManagerNotifications({
            tenantId,
            expenseHeaderId,
            approvers,
            messageText,
            status,
            getUrlData,
          });
        });

        await Promise.all(notificationPromises);

        // console.log('All notifications processed successfully.');
      } catch (error) {
        console.error("Error processing notifications:", error);
      }
    };
    await processNotifications(nonTravelExpenseReports);
  }
};

export const createOrUpdateManagerNotification = async (data) => {
  try {
    const {
      tenantId,
      travelRequestId,
      approvers,
      messageText,
      status,
      getUrlData,
    } = data
    const existingNotification = await Notification.findOne({
      tenantId,
      travelRequestId,
    });

    if (existingNotification) {
      const messageExists = existingNotification.messages.some(
        (msg) => msg.text === messageText
      );
      if (!messageExists) {
        existingNotification.messages.push({
          text: messageText,
          status,
          createdAt: new Date(),
          isRead: false,
          urlData: getUrlData,
        });
        await existingNotification.save();
      }
    } else {
      const newNotification = new Notification({
        tenantId,
        travelRequestId,
        approvers,
        messages: [
          {
            text: messageText,
            status,
            createdAt: new Date(),
            isRead: false,
            urlData: getUrlData,
          },
        ],
      });
      await newNotification.save();
    }

    return {
      success: true,
      message: "Notification created or updated successfully.",
    };
  } catch (error) {
    console.error("Error in createOrUpdateNotification one:", error);
    return {
      success: false,
      message: "An error occurred while creating or updating the notification.",
    };
  }
};

const createOrUpdateManagerNotifications = async ({
  tenantId,
  expenseHeaderId,
  approvers,
  messageText,
  status,
  getUrlData,
}) => {
  try {
    const existingNotification = await EXPENSE_NOTIFICATION.findOne({
      tenantId,
      expenseHeaderId,
    });

    if (existingNotification) {
      const messageExists = existingNotification.messages.some(
        (msg) => msg.text === messageText
      );
      if (!messageExists) {
        existingNotification.messages.push({
          text: messageText,
          status,
          urlData: getUrlData,
          createdAt: new Date(),
          isRead: false,
        });
        await existingNotification.save();
      }
    } else {
      const newNotification = new EXPENSE_NOTIFICATION({
        tenantId,
        expenseHeaderId,
        approvers,
        messages: [
          {
            text: messageText,
            status,
            urlData: getUrlData,
            createdAt: new Date(),
            isRead: false,
          },
        ],
      });
      await newNotification.save();
    }

    return {
      success: true,
      message: "Notification created or updated successfully.",
    };
  } catch (error) {
    console.error("Error in createOrUpdateNotification two:", error);
    return {
      success: false,
      message: "An error occurred while creating or updating the notification.",
    };
  }
};

//finance
const setFinanceNotifications = async (tenantId) => {
  const statusFilters = {
    cashAdvance: ["pending settlement", "Paid and Cancelled"],
    travelExpense: ["pending settlement", "Paid"],
    reimbursement: ["pending settlement"],
  };

  const filter = {
    tenantId,
    $or: [
      {
        "cashAdvanceSchema.cashAdvancesData": {
          $elemMatch: {
            cashAdvanceStatus: { $in: statusFilters.cashAdvance },
          },
        },
      },
      {
        "tripSchema.travelExpenseData": {
          $elemMatch: {
            expenseHeaderStatus: { $in: statusFilters.travelExpense },
          },
        },
      },
    ],
  };

  try {
    const [dashboardDocuments, reimbursementDocuments] = await Promise.all([
      dashboard.find(filter).exec(),
      REIMBURSEMENT.find({
        tenantId,
        expenseHeaderStatus: { $in: statusFilters.reimbursement },
      }).exec(),
    ]);

    if (
      dashboardDocuments.length === 0 &&
      reimbursementDocuments.length === 0
    ) {
      return { message: "There are no approvals found for the user" };
    }

    if (dashboardDocuments.length > 0) {
      // console.log('Dashboard Documents: For Finance batch job', dashboardDocuments);

      const processTravelWithCash = async (dashboardDocuments) => {
        try {
          const notificationPromises = dashboardDocuments.map(async (cash) => {
            let { tripStartDate: tripDate } = cash.tripSchema || {};
            const { travelRequestData, cashAdvancesData } =
              cash.cashAdvanceSchema;
            const isValidCashStatus = cashAdvancesData.some(
              (cashAdvance) =>
                cashAdvance.cashAdvanceStatus === "pending settlement"
            );
            const {
              tenantId,
              createdBy,
              tripName,
              itinerary,
              travelRequestId,
            } = travelRequestData;
            const addStatus = ["booked"];
            // console.log("tripDate", tripDate)
            // console.log("itinerary", itinerary)
            const tripStartDate =
              tripDate ?? (await earliestDate(itinerary, addStatus));
            // console.log("tripStartDate in finance",tripStartDate)
            const date = tripStartDate.toDateString();
            const status = getTripStatus(tripStartDate);

            const formatAmountDetails = (amountDetails) => {
              return amountDetails
                .map((detail) => {
                  const { amount, currency } = detail;
                  const currencySymbol =
                    currency && currency.symbol ? currency.symbol : "-";
                  return `${currencySymbol}${amount}`;
                })
                .join(", ");
            };

            const cashAdvanceDetails = isValidCashStatus
              ? cashAdvancesData
                  .filter(
                    (cashAdvance) =>
                      cashAdvance.cashAdvanceStatus == "pending settlement"
                  )
                  .map((cashAdvance) => ({
                    cashAdvanceId: cashAdvance.cashAdvanceId,
                    cashAdvanceStatus: cashAdvance.cashAdvanceStatus,
                    amountDetailsFormatted: formatAmountDetails(
                      cashAdvance.amountDetails
                    ),
                  }))
              : [];

            const formattedString =
              cashAdvanceDetails.length > 0
                ? cashAdvanceDetails
                    .map((detail) => detail.amountDetailsFormatted)
                    .join(", ")
                : "-";

            const cashAdvanceId =
              cashAdvanceDetails.length > 0
                ? cashAdvanceDetails.map((d) => d.cashAdvanceId)
                : "cashAdvanceId";
            // console.log("cashAdvanceDetails kaboom", cashAdvanceDetails,"formattedString", formattedString)

            const messageText = `Urgent! Please Settle Cash Advance "${formattedString}" for trip "${tripName}", scheduled to start on ${date}.`;
            let getUrlData = createUrlData(
              "settleCash",
              "tenantId",
              tenantId,
              "travelRequestId",
              travelRequestId,
              "cashAdvanceId",
              cashAdvanceId
            );

            return await createOrUpdateFinanceNotification({
              tenantId,
              messageText,
              status,
              getUrlData,
            });
          });

          await Promise.all(notificationPromises);
          // console.log('All notifications processed successfully.');
        } catch (error) {
          console.error("Error processing notifications:", error);
        }
      };

      await processTravelWithCash(dashboardDocuments);
    }

    if (reimbursementDocuments.length > 0) {
      // console.log('Reimbursement Documents:For Finance batch job ', reimbursementDocuments?.length);
      //reimbursement cash settlement is not yet added to the system
    }

    return;
  } catch (error) {
    console.error("Error fetching settlements:", error);
    throw new Error("Could not fetch settlements.");
  }
};

const createOrUpdateFinanceNotification = async ({
  tenantId,
  messageText,
  status,
  getUrlData,
}) => {
  try {
    const getTenant = await FinanceNotification.findOne({
      tenantId,
    });
    const employeeType = "finance";

    if (getTenant) {
      // Check if a message with the same travelRequestId already exists
      const messageIndex = getTenant.messages.findIndex(
        (msg) =>
          msg.urlData?.settleCash?.travelRequestId?.toString() ===
          getUrlData?.settleCash?.travelRequestId?.toString()
      );

      if (messageIndex !== -1) {
        // If the message with the same travelRequestId exists, replace the text and urlData
        getTenant.messages[messageIndex].text = messageText;
        getTenant.messages[messageIndex].urlData = getUrlData;
        await getTenant.save();
      } else {
        // If no matching travelRequestId, check if the message already exists (same text and urlData)
        const duplicateMessage = getTenant.messages.some(
          (msg) =>
            msg.text === messageText &&
            JSON.stringify(msg.urlData) === JSON.stringify(getUrlData)
        );

        if (!duplicateMessage) {
          // If no duplicate message exists, add the new message
          if (getTenant.messages.length < 100) {
            getTenant.messages.push({
              text: messageText,
              status,
              urlData: getUrlData,
              createdAt: new Date(),
              isRead: false,
            });
            await getTenant.save();
          } else {
            // If the array exceeds 100, remove the oldest message
            getTenant.messages.push({
              text: messageText,
              status,
              urlData: getUrlData,
              createdAt: new Date(),
              isRead: false,
            });

            // Ensure the array has no more than 100 messages
            if (getTenant.messages.length > 100) {
              getTenant.messages.shift(); // Removes the oldest message
            }

            await getTenant.save();
          }
        } else {
          // console.log("Duplicate message detected. No new message added.");
        }
      }
    } else {
      // If no notification exists, create a new one
      const newNotification = new FinanceNotification({
        tenantId,
        employeeType,
        messages: [
          {
            text: messageText,
            status,
            urlData: getUrlData,
            createdAt: new Date(),
            isRead: false,
          },
        ],
      });
      await newNotification.save();
    }

    return {
      success: true,
      message: "Notification created or updated successfully.",
    };
  } catch (error) {
    console.error("Error in createOrUpdateFinanceNotification:", error);
    return {
      success: false,
      message: "An error occurred while creating or updating the notification.",
    };
  }
};

const determineTravelStatus = async (
  travelDate,
  currentDate,
  tripName,
  travelStartDate
) => {
  try {
    const timeDifference = travelDate - currentDate;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference < 0) {
      return {
        status: "urgent",
        messageText: `Urgent: Travel date has passed. Please book the travel request for ${tripName} starting on ${travelStartDate}.`,
      };
    } else if (daysDifference <= 3) {
      return {
        status: "urgent",
        messageText: `Urgent: Please book the travel request for ${tripName} starting on ${travelStartDate}.`,
      };
    } else {
      return {
        status: "action",
        messageText: `Action: Please book the travel request for ${tripName} starting on ${travelStartDate}.`,
      };
    }
  } catch (error) {
    console.error("Error determining travel status:", error);
    throw new Error("Unable to determine travel status at this time.");
  }
};

//to handle both finance and booking admin notifications
const createOrUpdateNotification = async ({
  tenantId,
  messageText,
  status,
  employeeType,
  getUrlData,
}) => {
  try {
    // console.log("createOrUpdateNotification", tenantId, messageText, status, employeeType);

    if (!notificationTypeEnums.includes(employeeType)) {
      throw new Error(`Invalid employeeType: ${employeeType}`);
    }

    const updatedNotification = await FB_NOTIFICATION.findOneAndUpdate(
      { tenantId },
      {
        $set: { employeeType },
        $setOnInsert: { tenantId },
        $push: {
          messages: {
            $each: [
              {
                text: messageText,
                urlData: getUrlData,
                status,
                createdAt: new Date(),
                isRead: false,
              },
            ],
          },
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    // console.log('Notification updated or created:', updatedNotification);
    return {
      success: true,
      message: "Notification created or updated successfully.",
    };
  } catch (error) {
    console.error("Error in createOrUpdateNotification:", error);
    return {
      success: false,
      message: "An error occurred while creating or updating the notification.",
    };
  }
};

export {
  determineTravelStatus,
  createOrUpdateNotification,
  scheduleToNotificationBatchJob,
};
