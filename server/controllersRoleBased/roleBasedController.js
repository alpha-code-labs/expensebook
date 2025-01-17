import Joi from "joi";
import { financeLayout } from "../controllers/financeController.js";
import dashboard from "../models/dashboardSchema.js";
import HRMaster from "../models/hrMasterSchema.js";
import { earliestDate, extractStartDate } from "../utils/date.js";
import { countViolations, extractValidViolations } from "../utils/count.js";
import REIMBURSEMENT from "../models/reimbursementSchema.js";
import { fetchEmployeeNotifications } from "../controllers/notificationController.js";
import { getPolicyDetails } from "../helpers/hrdata.js";

export const employeeSchema = Joi.object({
  tenantId: Joi.string().required(),
  empId: Joi.string().required(),
});

function getItinerary(itinerary) {
  const status = {
    PENDING_BOOKING: "pending booking",
    BOOKED: "booked",
  };
  const itineraryToSend = Object.fromEntries(
    Object.entries(itinerary)
      .filter(([category]) => category !== "formState")
      .map(([category, items]) => {
        let mappedItems;
        if (category === "hotels") {
          mappedItems = items
            .filter((item) => item.status === status.BOOKED)
            .map(
              ({
                itineraryId,
                status,
                bkd_location,
                bkd_class,
                bkd_checkIn,
                bkd_checkOut,
                bkd_violations,
                cancellationDate,
                cancellationReason,
                bookingDetails: { docURL },
              }) => ({
                category,
                itineraryId,
                status,
                bkd_location,
                bkd_class,
                bkd_checkIn,
                bkd_checkOut,
                bkd_violations,
                cancellationDate,
                cancellationReason,
                bookingDetails: { docURL },
              })
            );
        } else if (category === "cabs") {
          mappedItems = items
            .filter((item) => item.status === status.BOOKED)
            .map(
              ({
                itineraryId,
                status,
                isFullDayCab,
                bkd_date,
                bkd_returnDate,
                bkd_time,
                bkd_class,
                bkd_pickupAddress,
                bkd_dropAddress,
                bookingDetails: { docURL },
              }) => ({
                category,
                itineraryId,
                status,
                isFullDayCab,
                bkd_date,
                bkd_returnDate,
                bkd_time,
                bkd_class,
                bkd_pickupAddress,
                bkd_dropAddress,
                bookingDetails: { docURL },
              })
            );
        } else {
          mappedItems = items
            .filter((item) => item.status === status.BOOKED)
            .map(
              ({
                itineraryId,
                status,
                bkd_from,
                bkd_to,
                bkd_date,
                bkd_time,
                bkd_travelClass,
                bkd_violations,
                bookingDetails: { docURL },
              }) => ({
                category,
                itineraryId,
                status,
                bkd_from,
                bkd_to,
                bkd_date,
                bkd_time,
                bkd_travelClass,
                bkd_violations,
                bookingDetails: { docURL },
              })
            );
        }

        return [category, mappedItems];
      })
  );
  return itineraryToSend;
}

function getAddALegItinerary(itinerary) {
  const status = {
    PENDING_BOOKING: "pending booking",
  };
  const itineraryToSend = Object.fromEntries(
    Object.entries(itinerary)
      .filter(([category]) => category !== "formState")
      .map(([category, items]) => {
        let mappedItems;

        if (category === "hotels") {
          mappedItems = items
            .filter((item) => item.status === status.PENDING_BOOKING)
            .map((item) => ({
              category,
              itineraryId: item.itineraryId,
              status: item.status,
              location: item.location,
              class: item["class"],
              checkIn: item.checkIn,
              checkOut: item.checkOut,
              violations: item.violations,
              cancellationDate: item.cancellationDate,
              cancellationReason: item.cancellationReason,
            }));
        } else if (category === "cabs") {
          mappedItems = items
            .filter((item) => item.status === status.PENDING_BOOKING)
            .map((item) => ({
              category,
              itineraryId: item.itineraryId,
              isFullDayCab: item.isFullDayCab,
              status: item.status,
              date: item.date,
              returnDate: item.returnDate,
              time: item.time,
              class: item["class"],
              pickupAddress: item.pickupAddress,
              dropAddress: item.dropAddress,
            }));
        } else {
          mappedItems = items
            .filter((item) => item.status === status.PENDING_BOOKING)
            .map((item) => ({
              category,
              itineraryId: item.itineraryId,
              status: item.status,
              from: item.from,
              to: item.to,
              date: item.date,
              time: item.time,
              travelClass: item.travelClass,
              violations: item.violations,
            }));
        }

        return [category, mappedItems];
      })
  );

  return itineraryToSend;
}

const getEmployeeRoles = async (tenantId, empId) => {
  // console.log("tenantId type", typeof tenantId)
  const hrDocument = await HRMaster.findOne({
    tenantId,
    "employees.employeeDetails.employeeId": empId,
  });
  if (!hrDocument) {
    throw new Error("HR document not found");
  }
  const employee = hrDocument?.employees.find(
    (emp) => emp.employeeDetails.employeeId === empId
  );
  if (!employee || !employee.employeeRoles) {
    throw new Error("Employee roles not found");
  }
  return employee.employeeRoles;
};

const roleBasedLayout = async (req, res) => {
  try {
    // let { tenantId,empId} = req.user
    let { tenantId, empId } = req.params;

    const { error, value } = employeeSchema.validate({ tenantId, empId });
    // console.log("jwt in controller - req.user",JSON.stringify(req.user,'',2))

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    ({ tenantId, empId } = value);

    // Get employee roles and execute layout functions
    const dashboardViews = await getDashboardViews(tenantId, empId);

    // Send response
    return res.status(200).json(dashboardViews);
  } catch (err) {
    console.error("Error:", err);
    // Handle the error, but do not send another response
    return res.status(500).json({ success: false, error: err.message });
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
      superAdmin: async () => superAdminLayout(tenantId, empId),
    };

    const applicableRoles = Object.keys(employeeRoles).filter(
      (role) => employeeRoles[role]
    );

    // console.log("applicableRoles", applicableRoles)

    const dashboardViews = await Promise.all(
      applicableRoles.map(async (role) => {
        try {
          const data = await layoutFunctions[role]();
          return { [role]: data };
        } catch (error) {
          console.error("Error fetching data for role", role, "Error:", error);
          return { [role]: null }; // Handle the error case as needed
        }
      })
    );

    const formattedDashboardViews = dashboardViews.reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {}
    );

    const notifications = await fetchEmployeeNotifications(
      tenantId,
      empId,
      applicableRoles
    );

    return {
      dashboardViews: formattedDashboardViews,
      employeeRoles,
      notifications,
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
      getOverView(tenantId, empId),
      getAllCashAdvance(tenantId, empId),
    ];

    const [
      travelStandAlone,
      travelWithCash,
      trip,
      expense,
      allTravelRequests,
      allCashAdvance,
    ] = await Promise.all(promises);

    const { rejectedCashAdvances = [] } = travelWithCash || {};
    const { trips = {}, reimbursements = [] } = trip || {};
    const {
      upcomingTrips = [],
      transitTrips = [],
      completedTrips = [],
      rejectedTrips = [],
      transitFormValidations = [],
    } = trips;
    const { nonTravelCashAdvance = [], travelCashAdvance = [] } =
      allCashAdvance || {};
    const { completedFormValidations, ...getExpense } = expense;
    // const travelRequestCombined = [ ...travelStandAlone.travelRequests, ...travelWithCash.travelRequests]
    // const rejectedTravelRequestsCombined = [ ...travelStandAlone.rejectedTravelRequests, ...travelWithCash.rejectedTravelRequests]

    // console.log("completedFormValidations", completedFormValidations)
    //screens
    const overviewUi = {
      transitTrips,
      upcomingTrips,
      allTravelRequests,
      expense,
    };
    const cashAdvanceUi = { ...allCashAdvance };
    const expenseUi = { ...getExpense };
    const formValidations = {
      ...transitFormValidations,
      ...completedFormValidations,
    };
    const employee = {
      overview: overviewUi,
      cashAdvance: cashAdvanceUi,
      // travelRequests :travelRequestCombined,
      // rejectedTravelRequests:rejectedTravelRequestsCombined,
      // rejectedCashAdvances,
      // ...trip,
      expense: expenseUi,
      formValidations,
    };
    return employee;
  } catch (error) {
    console.error("Error:", error);
    throw new Error({ message: "Internal server error" });
  }
};

const getOverView = async (tenantId, empId) => {
  // console.log("getOverView",tenantId,empId)
  try {
    const getAllTravelRequests = await dashboard.find({
      tenantId,
      $or: [
        {
          "travelRequestSchema.createdBy.empId": empId,
          "travelRequestSchema.isCashAdvanceTaken": false,
        },
        {
          "cashAdvanceSchema.travelRequestData.isCashAdvanceTaken": true,
          "cashAdvanceSchema.travelRequestData.createdBy.empId": empId,
        },
      ],
    });

    const status = {
      BOOKED: "booked",
    };

    if (getAllTravelRequests.length > 0) {
      // console.log("getAllTravelRequests - total", getAllTravelRequests.length)
      const travelRequests = await Promise.all(
        getAllTravelRequests
          .filter(
            (travelRequest) =>
              travelRequest?.travelRequestSchema?.createdBy?.empId === empId &&
              travelRequest?.travelRequestSchema?.isCashAdvanceTaken ===
                false &&
              travelRequest?.travelRequestSchema?.travelRequestStatus !==
                status.BOOKED
          )
          .map(async (travelRequest) => {
            const tripStartDate =
              travelRequest?.travelRequestSchema?.tripStartDate ??
              (await earliestDate(
                travelRequest?.travelRequestSchema?.itinerary
              ));
            return {
              travelRequestId:
                travelRequest?.travelRequestSchema?.travelRequestId,
              travelRequestNumber:
                travelRequest?.travelRequestSchema?.travelRequestNumber,
              tripPurposeDescription:
                travelRequest?.travelRequestSchema?.tripPurposeDescription,
              tripName: travelRequest?.travelRequestSchema?.tripName ?? "",
              tripStartDate: tripStartDate,
              travelRequestStatus:
                travelRequest?.travelRequestSchema?.travelRequestStatus,
            };
          })
      );

      const travelRequestWithCash = await Promise.all(
        getAllTravelRequests
          .filter(
            (travelRequest) =>
              travelRequest?.cashAdvanceSchema?.travelRequestData?.createdBy
                ?.empId == empId &&
              travelRequest?.travelRequestSchema?.isCashAdvanceTaken === true &&
              travelRequest?.cashAdvanceSchema?.travelRequestData
                ?.travelRequestStatus !== status.BOOKED
          )
          .map(async (travelRequest) => {
            const tripStartDate =
              travelRequest?.travelRequestSchema?.tripStartDate ??
              (await earliestDate(
                travelRequest?.travelRequestSchema?.itinerary
              ));
            return {
              travelRequestId:
                travelRequest?.cashAdvanceSchema?.travelRequestData
                  ?.travelRequestId,
              travelRequestNumber:
                travelRequest?.cashAdvanceSchema?.travelRequestData
                  ?.travelRequestNumber,
              tripPurposeDescription:
                travelRequest?.cashAdvanceSchema?.travelRequestData
                  ?.tripPurposeDescription,
              tripName:
                travelRequest?.cashAdvanceSchema?.travelRequestData?.tripName ??
                "",
              tripStartDate: tripStartDate,
              travelRequestStatus:
                travelRequest?.cashAdvanceSchema?.travelRequestData
                  ?.travelRequestStatus,
            };
          })
      );

      const allTravelRequests = [...travelRequests, ...travelRequestWithCash];

      // console.log("travelRequests kaboom", travelRequests);
      // console.log("travelRequestWithCash kaboom", travelRequestWithCash);

      return { allTravelRequests };
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error in Fetching Overview");
  }
};

const getAllCashAdvance = async (tenantId, empId) => {
  try {
    const allCashReports = await dashboard.find({
      tenantId,
      "cashAdvanceSchema.cashAdvancesData.createdBy.empId": empId,
    });

    // console.log("allCashReports",JSON.stringify(allCashReports, '' , 2))

    if (allCashReports?.length > 0) {
      const isEmptyObject = (obj) => Object.keys(obj).length === 0;

      const getNonTravelCashAdvance = allCashReports
        .filter(
          (cash) =>
            cash?.cashAdvanceSchema &&
            !cash?.cashAdvanceSchema?.hasOwnProperty("travelRequestId")
        )
        .map((cash) => ({
          cashAdvanceId:
            cash?.cashAdvanceSchema?.cashAdvancesData?.cashAdvanceId ?? "",
          cashAdvanceNumber:
            cash?.cashAdvanceSchema?.cashAdvancesData?.cashAdvanceNumber ?? "",
          cashAdvanceStatus:
            cash?.cashAdvanceSchema?.cashAdvancesData?.cashAdvanceStatus ?? "",
          amountDetails:
            cash?.cashAdvanceSchema?.cashAdvancesData?.amountDetails ?? "",
          cashAdvanceRejectionReason:
            cash?.cashAdvanceSchema?.cashAdvancesData
              ?.cashAdvanceRejectionReason ?? "",
        }))
        .filter(Boolean);

      const allEmpty = getNonTravelCashAdvance.every(isEmptyObject);

      // const  nonTravelCashAdvance = allEmpty ? [] : getNonTravelCashAdvance;
      const nonTravelCashAdvance = [];

      const travelCashAdvance = allCashReports.map((cash) => ({
        travelRequestId:
          cash?.cashAdvanceSchema.travelRequestData?.travelRequestId,
        travelRequestNumber:
          cash?.cashAdvanceSchema.travelRequestData?.travelRequestNumber,
        tripName: cash?.cashAdvanceSchema?.travelRequestData?.tripName ?? "",
        createdBy: cash?.cashAdvanceSchema?.travelRequestData?.createdBy,
        cashAdvances: cash?.cashAdvanceSchema?.cashAdvancesData
          ?.map((advance) => ({
            cashAdvanceId: advance.cashAdvanceId,
            cashAdvanceNumber: advance.cashAdvanceNumber,
            cashAdvanceStatus: advance.cashAdvanceStatus,
            amountDetails: advance.amountDetails,
            cashAdvanceRejectionReason:
              cash?.cashAdvanceSchema?.cashAdvancesData
                ?.cashAdvanceRejectionReason,
          }))
          .filter(Boolean),
      }));
      //   console.log("travelCashAdvance", JSON.stringify(travelCashAdvance,'',2))

      // console.log("travelCashAdvance", travelCashAdvance)
      return { nonTravelCashAdvance, travelCashAdvance };
    }
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error in Fetching CashAdvance");
  }
};

//----------------travel standalone for an employee
const travelStandAloneForEmployee = async (tenantId, empId) => {
  // console.log("Fetching travelStandAloneForEmployee...", tenantId, empId);

  try {
    const travelRequestDocs = await dashboard.find({
      "travelRequestSchema.tenantId": tenantId,
      "travelRequestSchema.createdBy.empId": empId,
      "travelRequestSchema.isCashAdvanceTaken": false,
      $or: [
        {
          "travelRequestSchema.travelRequestStatus": {
            $in: ["draft", "pending approval", "approved"],
          },
        },
        { "travelRequestSchema.travelRequestStatus": { $in: ["rejected"] } },
        { "travelRequestSchema.travelRequestStatus": { $nin: ["rejected"] } },
      ],
    });

    if (travelRequestDocs?.length > 0) {
      // console.log("travel standAlone From db....",travelRequestDocs)

      const allTravelRequests = travelRequestDocs
        .filter(
          ({ travelRequestSchema: { travelRequestStatus } }) =>
            travelRequestStatus !== "rejected" &&
            travelRequestStatus !== "booked"
        )
        .map(
          ({
            travelRequestSchema: {
              travelRequestId,
              travelRequestNumber,
              tripPurpose,
              travelRequestStatus,
              // travelType,
              isCashAdvanceTaken,
            },
          }) => ({
            travelRequestId,
            travelRequestNumber,
            tripPurpose,
            travelRequestStatus,
            isCashAdvanceTaken,
          })
        );

      const rejectedRequests = travelRequestDocs
        .filter(
          ({ travelRequestSchema: { travelRequestStatus } }) =>
            travelRequestStatus === "rejected"
        )
        .map(
          ({
            travelRequestSchema: {
              travelRequestId,
              travelRequestNumber,
              tripPurpose,
              travelRequestStatus,
              rejectionReason,
              isCashAdvanceTaken,
            },
          }) => ({
            travelRequestId,
            travelRequestNumber,
            tripPurpose,
            travelRequestStatus,
            rejectionReason,
            // travelType,
            isCashAdvanceTaken,
          })
        );

      let rejectedItineraryLines = [];

      travelRequestDocs
        .filter(
          ({ travelRequestSchema: { travelRequestStatus } }) =>
            travelRequestStatus !== "rejected"
        )
        .forEach(
          ({
            travelRequestSchema: {
              travelRequestId,
              travelRequestNumber,
              tripPurpose,
              travelType,
              travelRequestStatus,
              isCashAdvanceTaken,
              itinerary,
            },
          }) => {
            Object.entries(itinerary).forEach(
              ([itineraryType, itineraryArray]) =>
                itineraryArray.forEach(
                  ({ itineraryId, rejectionReason, status }) => {
                    if (status === "rejected") {
                      // Extract the necessary details and add them to the rejectedItineraryLines array
                      rejectedItineraryLines.push({
                        travelRequestId,
                        travelRequestNumber,
                        tripPurpose,
                        travelType,
                        travelRequestStatus,
                        isCashAdvanceTaken,
                        itineraryType,
                        itineraryId,
                        rejectionReason,
                        status,
                        bookingDetails: { docURL },
                      });
                    }
                  }
                )
            );
          }
        );

      const message =
        !allTravelRequests.length &&
        !rejectedRequests.length &&
        !rejectedItineraryLines.length
          ? "No travel request found and no rejected travel request found"
          : !allTravelRequests.length
          ? "No travel request found"
          : !rejectedRequests.length
          ? "No rejected travel request found"
          : "";

      const rejectedTravelRequests = [
        ...rejectedRequests,
        ...rejectedItineraryLines,
      ];

      return {
        travelRequests: allTravelRequests,
        rejectedTravelRequests,
        message,
      };
    } else {
      return {
        travelRequests: [],
        rejectedTravelRequests: [],
        message: "Raise a travel request",
      };
    }
  } catch (error) {
    console.error("Error in fetching employee Dashboard:", error);
    throw new Error("Error in fetching employee Dashboard");
  }
};

//----------------travel with cash for an employee

const travelWithCashForEmployee = async (tenantId, empId) => {
  // console.log("entering travelWithCashForEmploy", tenantId, empId);
  try {
    const query = {
      "cashAdvanceSchema.travelRequestData.tenantId": tenantId,
      "cashAdvanceSchema.travelRequestData.createdBy.empId": empId,
      $or: [
        {
          "cashAdvanceSchema.travelRequestData.travelRequestStatus": {
            $in: ["draft", "pending approval", "approved"],
          },
          "cashAdvanceSchema.cashAdvanceData.cashAdvanceStatus": {
            $nin: ["rejected"],
          },
        },
        {
          "cashAdvanceSchema.travelRequestData.travelRequestStatus": {
            $in: ["rejected"],
          },
        },
        {
          "cashAdvanceSchema.travelRequestData.travelRequestStatus": {
            $nin: ["rejected"],
          },
        },
        {
          "cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus": {
            $in: ["rejected"],
          },
        },
      ],
    };

    //   console.log("Fetching cashSchema ...", tenantId, empId);
    const travelRequestDocs = await dashboard.find(query);
    //   console.log("Fetched cashSchema:", travelRequestDocs);

    if (travelRequestDocs?.length === 0) {
      return {
        travelRequests: [],
        rejectedTravelRequests: [],
        rejectedCashAdvances: [],
        message: "Raise a travel request",
      };
    } else {
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
        const filteredDocs = docs.filter((travelRequest) => {
          const { travelRequestStatus } =
            travelRequest.cashAdvanceSchema.travelRequestData;
          return (
            travelRequestStatus !== "rejected" &&
            travelRequestStatus !== "booked"
          );
        });

        // Then, map over the filtered documents to transform them into the desired structure
        return filteredDocs.map(async (travelRequest) => {
          const { cashAdvanceSchema } = travelRequest;
          const {
            travelRequestId,
            travelRequestNumber,
            tripPurpose,
            travelRequestStatus,
            isCashAdvanceTaken,
            travelType,
            itinerary,
          } = cashAdvanceSchema?.travelRequestData;
          //    console.time('tripStartDate time')
          const tripStartDate = (await earliestDate(itinerary)) ?? "";
          //    console.log("tripStartDate",tripStartDate)
          //    console.timeEnd('tripStartDate time')
          //    console.log("hello ....................",tripStartDate ? tripStartDate : 'No valid dates found');

          const cashAdvancesData = cashAdvanceSchema?.cashAdvancesData || [];

          const cashAdvances = cashAdvancesData.map(
            ({
              cashAdvanceId,
              cashAdvanceNumber,
              cashAdvanceStatus,
              amountDetails,
            }) => ({
              cashAdvanceId,
              cashAdvanceNumber,
              cashAdvanceStatus,
              tripStartDate,
              amountDetails,
              //  amountDetails: amountDetails.map(detail => ({
              //    amount: detail.amount,
              //    shortName: detail.currency.shortName,
              //    mode: detail.mode
              //  })),
            })
          );

          return {
            travelRequestId,
            travelRequestNumber,
            tripPurpose,
            travelType,
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
        const filteredDocs = docs.filter((travelRequest) => {
          const { travelRequestStatus } =
            travelRequest.cashAdvanceSchema.travelRequestData;
          return travelRequestStatus === "rejected";
        });

        // Then, map over the filtered documents to transform them into the desired structure
        return filteredDocs.map((travelRequest) => {
          const { cashAdvanceSchema } = travelRequest;
          const {
            travelRequestId,
            travelRequestNumber,
            tripPurpose,
            travelRequestStatus,
            isCashAdvanceTaken,
            travelType,
          } = cashAdvanceSchema.travelRequestData;
          const cashAdvancesData = cashAdvanceSchema?.cashAdvancesData || [];

          const cashAdvances = cashAdvancesData.map(
            ({
              cashAdvanceId,
              cashAdvanceNumber,
              cashAdvanceStatus,
              amountDetails,
            }) => ({
              cashAdvanceId,
              cashAdvanceNumber,
              cashAdvanceStatus,
              amountDetails,
              //  amountDetails: amountDetails.map(detail => ({
              //    amount: detail.amount,
              //    shortName: detail.currency.shortName,
              //    mode: detail.mode,
              //  })),
            })
          );

          return {
            travelRequestId,
            travelRequestNumber,
            tripPurpose,
            travelType,
            travelRequestStatus,
            isCashAdvanceTaken,
            cashAdvances,
          };
        });
      };

      const rejectedTravelRequestsAll =
        processRejectedTravelRequests(travelRequestDocs);

      let rejectedItineraryLines = [];

      travelRequestDocs
        .filter(
          ({
            cashAdvanceSchema: {
              travelRequestData: { travelRequestStatus },
            },
          }) => travelRequestStatus !== "rejected"
        )
        .forEach(
          ({
            cashAdvanceSchema: {
              travelRequestData: {
                travelRequestId,
                travelRequestNumber,
                tripPurpose,
                travelRequestStatus,
                isCashAdvanceTaken,
                itinerary,
                travelType,
              },
            },
          }) => {
            // Iterate over each key in the itinerary object
            Object.entries(itinerary).forEach(
              ([itineraryType, itineraryArray]) => {
                // Iterate over each item in the array under the current key
                itineraryArray.forEach(
                  ({ itineraryId, rejectionReason, status }) => {
                    if (status === "rejected") {
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
                        bookingDetails: { docURL },
                      });
                    }
                  }
                );
              }
            );
          }
        );

      //   console.log("Processed rejectedItineraryLines:", rejectedItineraryLines);

      // Assuming travelRequestDocs is an array of documents returned from your MongoDB query
      const filteredDocs = travelRequestDocs.filter((doc) =>
        doc.cashAdvanceSchema.cashAdvancesData.some(
          (cashAdvance) => cashAdvance.cashAdvanceStatus === "rejected"
        )
      );

      const rejectedCashAdvances = filteredDocs.flatMap((doc) =>
        doc.cashAdvanceSchema.cashAdvancesData
          .filter((cashAdvance) => cashAdvance.cashAdvanceStatus === "rejected")
          .map(
            ({
              travelRequestId,
              cashAdvanceId,
              cashAdvanceNumber,
              amountDetails,
              cashAdvanceStatus,
              rejectionReason,
            }) => ({
              travelRequestId,
              cashAdvanceId,
              cashAdvanceNumber,
              cashAdvanceStatus,
              rejectionReason,
              amountDetails,
              bookingDetails: { docURL },
              // amountDetails: amountDetails.map(detail => ({
              //   amount: detail.amount,
              //   shortName: detail.currency.shortName
              // }))
            })
          )
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
      const rejectedTravelRequests = [
        ...rejectedTravelRequestsAll,
        ...rejectedItineraryLines,
      ];

      //   console.log("Returning data:", { travelRequests, rejectedTravelRequests , rejectedCashAdvances});
      return { travelRequests, rejectedTravelRequests, rejectedCashAdvances };
    }
  } catch (error) {
    console.error("Error in fetching employee Dashboard:", error);
    // Return an object indicating the error occurred
    throw new Error({ error: "Error in fetching employee Dashboard" });
  }
};

const getTripForEmployee = async (tenantId, empId) => {
  // console.log("entering trips db")
  try {
    const tripDocs = await dashboard
      .find({
        $or: [
          {
            "tripSchema.tenantId": tenantId,
            "tripSchema.travelRequestData.createdBy.empId": empId,
            $or: [
              {
                "tripSchema.tripStatus": {
                  $in: ["transit", "upcoming", "completed"],
                },
              },
              {
                "tripSchema.travelExpenseData.expenseHeaderStatus": "rejected",
              },
              {
                "tripSchema.cashAdvanceData.cashAdvanceStatus": {
                  $nin: ["rejected"],
                },
              },
            ],
          },
          { "reimbursementSchema.createdBy.empId": empId },
        ],
      })
      .lean()
      .exec();

    if (tripDocs?.length === 0) {
      return { message: "There are no trips found for the user" };
    }
    // console.log("tripDocs............", tripDocs)

    const allTransitTravelTypes = new Set();
    const upcomingTrips = tripDocs
      .filter((trip) => trip?.tripSchema?.tripStatus === "upcoming")
      .map((trip) => {
        //   console.log("each trip", trip)
        const { tripSchema } = trip;
        const {
          travelRequestData,
          cashAdvancesData,
          travelExpenseData,
          expenseAmountStatus,
          tripId,
          tripNumber,
          tripStatus,
          tripStartDate = "",
          tripCompletionDate,
        } = tripSchema || {};
        const { totalCashAmount, totalRemainingCash } =
          expenseAmountStatus || {};
        const {
          travelRequestId,
          travelRequestNumber,
          tripName,
          travelRequestStatus,
          tripPurpose,
          travelType,
          isCashAdvanceTaken,
          itinerary,
        } = travelRequestData || {};

        // const itineraryToSend = Object.fromEntries(
        //     Object.entries(itinerary)
        //         .filter(([category]) => category !== 'formState')
        //         .map(([category, items]) => {
        //             let mappedItems;
        //             if (category === 'hotels') {
        //                 mappedItems = items.map(({
        //                     itineraryId, status, bkd_location, bkd_class, bkd_checkIn, bkd_checkOut, bkd_violations, cancellationDate, cancellationReason,needBreakfast,needLunch,needDinner,needNonSmokingRoom
        //                 }) => ({
        //                     category,
        //                     itineraryId, status, bkd_location, bkd_class, bkd_checkIn, bkd_checkOut, bkd_violations, cancellationDate, cancellationReason,needBreakfast,needLunch,needDinner,needNonSmokingRoom
        //                 }));
        //             } else if (category === 'cabs') {
        //                 mappedItems = items.map(({
        //                     itineraryId, status, bkd_date, bkd_returnDate, bkd_isFullDayCab, bkd_class, bkd_pickupAddress, bkd_dropAddress,
        //                 }) => ({
        //                     category,
        //                     itineraryId, status, bkd_date,bkd_returnDate, bkd_isFullDayCab, bkd_class, bkd_pickupAddress, bkd_dropAddress,
        //                 }));
        //             } else {
        //                 mappedItems = items.map(({
        //                     itineraryId, status, bkd_from, bkd_to, bkd_date, bkd_time,bkd_returnTime, bkd_travelClass, bkd_violations,
        //                 }) => ({
        //                     category,
        //                     itineraryId, status, bkd_from, bkd_to, bkd_date, bkd_time,bkd_returnTime, bkd_travelClass, bkd_violations,
        //                 }));
        //             }

        //             return [category, mappedItems];
        //         })
        // );

        const itineraryToSend = getItinerary(itinerary);
        const addALegItinerary = getAddALegItinerary(itinerary);

        // console.log("itineraryTosend.........................................", itineraryToSend)
        return {
          tripId: tripId ?? "",
          tripNumber: tripNumber ?? "",
          tripName: tripName ?? "",
          travelRequestId,
          travelType: travelType ?? "",
          travelRequestNumber,
          tripPurpose,
          tripStartDate,
          tripCompletionDate,
          tripStatus,
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
          itinerary: itineraryToSend,
          addALegItinerary,
        };
      });
    // console.log("upcomingTrips", upcomingTrips)

    const transitTrips = tripDocs
      .filter((trip) => trip?.tripSchema?.tripStatus === "transit")
      .map((trip) => {
        // console.log("each trip", trip)
        const { tripSchema } = trip;
        const {
          travelRequestData,
          cashAdvancesData,
          travelExpenseData,
          expenseAmountStatus,
          tripId,
          tripNumber,
          tripStatus,
          tripStartDate,
          tripCompletionDate,
        } = tripSchema || {};
        const { totalCashAmount, totalRemainingCash } =
          expenseAmountStatus || {};
        const {
          travelRequestId,
          travelRequestNumber,
          travelRequestStatus,
          tripName,
          tripPurpose,
          travelType,
          isCashAdvanceTaken,
          itinerary,
        } = travelRequestData || {};

        if (travelType) {
          // console.log("inside transit trips", travelType)
          allTransitTravelTypes.add(travelType);
        }
        const itineraryToSend = getItinerary(itinerary);
        const addALegItinerary = getAddALegItinerary(itinerary);

        return {
          tripId: tripId ?? "",
          tripNumber: tripNumber ?? "",
          tripName: tripName ?? "",
          travelRequestId: travelRequestId ?? "",
          travelType: travelType ?? "",
          travelRequestNumber: travelRequestNumber ?? "",
          tripPurpose: tripPurpose ?? "",
          tripStartDate: tripStartDate ?? "",
          tripCompletionDate: tripCompletionDate ?? "",
          tripStatus,
          travelRequestStatus: travelRequestStatus ?? "",
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
          addALegItinerary,
        };
      });
    //   console.log("transitTrips", transitTrips)

    const uniqueTransitTravelTypes = Array.from(allTransitTravelTypes);

    const transitFormValidations =
      uniqueTransitTravelTypes.length > 0
        ? await getPolicyDetails(tenantId, empId, uniqueTransitTravelTypes)
        : [];

    const completedTrips = tripDocs
      .filter(
        (trip) =>
          trip?.tripSchema?.tripStatus === "completed" &&
          trip?.tripSchema?.travelExpenseData &&
          trip?.tripSchema?.travelExpenseData?.length > 0
      )
      .flatMap((trip) =>
        trip.tripSchema.travelExpenseData.map(
          ({
            tripId,
            expenseHeaderId,
            expenseHeaderNumber,
            expenseHeaderStatus,
          }) => ({
            tripId,
            travelType: trip.tripSchema.travelRequestData.travelType,
            tripPurpose: trip.tripSchema.travelRequestData.tripPurpose || "",
            expenseHeaderId: expenseHeaderId || "",
            expenseHeaderNumber: expenseHeaderNumber || "",
            expenseHeaderStatus: expenseHeaderStatus || "",
          })
        )
      );

    const rejectedTrips = tripDocs
      .filter((trip) => trip?.tripSchema?.tripStatus === "rejected")
      .flatMap((trip) => {
        //   console.log("travelExpenseData", trip.tripSchema.travelExpenseData);
        return trip.tripSchema.travelExpenseData.map(
          ({
            tripId,
            tripNumber,
            expenseHeaderId,
            expenseHeaderNumber,
            expenseAmountStatus,
          }) => ({
            tripId,
            tripPurpose: trip.tripSchema.tripPurpose,
            tripNumber,
            expenseHeaderId,
            expenseHeaderNumber,
            expenseAmountStatus,
          })
        );
      });

    const getReimbursementReports = await REIMBURSEMENT.find({
      "createdBy.empId": empId,
    });

    const reimbursements = getReimbursementReports
      .filter((report) => {
        // console.log("trip after filter", trip);
        // Assuming createdBy is an object with empId property
        return report?.createdBy?.empId === empId;
      })
      .flatMap((report) => {
        // console.log("before reimbursement schema:", trip);
        const {
          expenseHeaderId,
          createdBy,
          expenseHeaderNumber,
          expenseHeaderStatus,
        } = report;
        return [
          {
            expenseHeaderId,
            createdBy,
            expenseHeaderNumber,
            expenseHeaderStatus,
          },
        ];
      });

    // console.log("reimbursements reports:", reimbursements);

    const trips = {
      upcomingTrips: upcomingTrips ?? [],
      transitTrips: transitTrips ?? [],
      completedTrips: completedTrips ?? [],
      rejectedTrips: rejectedTrips ?? [],
      transitFormValidations,
    };

    return {
      trips,
      reimbursements: reimbursements ?? [],
    };
  } catch (error) {
    console.error("Error in fetching employee Dashboard:", error);
    throw new Error({ error: "Error in fetching employee Dashboard" });
  }
};

const fetchEmployeeReimbursementReports = (tenantId, empId) => {
  return REIMBURSEMENT.find({
    tenantId,
    "createdBy.empId": empId,
  });
};

const fetchEmployeeExpenseReports = (tenantId, empId) => {
  return dashboard
    .find({
      "tripSchema.tenantId": tenantId,
      "tripSchema.travelRequestData.createdBy.empId": empId,
      $or: [{ "tripSchema.tripStatus": { $nin: ["upcoming", "recovered"] } }],
    })
    .lean()
    .exec();
};

const getAllExpensesForEmployee = async (tenantId, empId) => {
  // console.log("entering trips db")
  try {
    const [tripDocs, reimbursementReports] = await Promise.all([
      fetchEmployeeExpenseReports(tenantId, empId),
      fetchEmployeeReimbursementReports(tenantId, empId),
    ]);

    if (tripDocs?.length === 0 && reimbursementReports?.length === 0) {
      return {
        allTripExpenseReports: [],
        allNonTravelReports: [],
        completedTrips: [],
      };
    }
    //  console.log("tripDocs............", tripDocs)

    const status = {
      COMPLETED: "completed",
    };

    const allTravelTypes = new Set();
    const allCompletedTravelTypes = new Set();

    const allTripExpenseReports = tripDocs
      // ?.filter((trip) => trip?.tripSchema?.travelExpenseData?.length > 0)
      ?.map((trip) => {
        //   console.log("each trip", trip)
        const { tripSchema } = trip;
        const {
          travelRequestData,
          cashAdvancesData,
          travelExpenseData,
          expenseAmountStatus,
          tripId,
          tripNumber,
          tripStartDate,
          tripCompletionDate,
        } = tripSchema || {};
        const {
          travelRequestId,
          travelRequestNumber,
          travelRequestStatus,
          tripName,
          tripPurpose,
          travelType,
          isCashAdvanceTaken,
          itinerary,
        } = travelRequestData || {};

        if (travelType) {
          allTravelTypes.add(travelType);
        }

        const itineraryToSend = getItinerary(itinerary);

        const travelExpenseReports = travelExpenseData.map((expense) => ({
          expenseHeaderId: expense?.expenseHeaderId ?? "",
          expenseHeaderNumber: expense?.expenseHeaderNumber ?? '',
          createdBy: expense?.createdBy ?? "",
          expenseHeaderStatus: expense?.expenseHeaderStatus ?? "",
          expenseLines: expense?.expenseLines ?? "",
        }));

        // console.log("itineraryTosend.........................................", itineraryToSend)
        return {
          tripId: tripId ?? "",
          tripNumber: tripNumber ?? "",
          tripName: tripName ?? "",
          travelRequestId,
          travelRequestNumber,
          tripPurpose,
          tripStartDate,
          tripCompletionDate,
          travelRequestStatus,
          isCashAdvanceTaken,
          expenseAmountStatus,
          cashAdvances: isCashAdvanceTaken
            ? cashAdvancesData
              ? cashAdvancesData.map(
                  ({
                    cashAdvanceId,
                    cashAdvanceNumber,
                    amountDetails,
                    cashAdvanceStatus,
                  }) => ({
                    cashAdvanceId,
                    cashAdvanceNumber,
                    amountDetails,
                    cashAdvanceStatus,
                  })
                )
              : []
            : [],
          travelExpenses: travelExpenseReports,
          itinerary: itineraryToSend,
        };
      });

    const completedTrips = tripDocs
      ?.filter(
        (trip) =>
          trip?.tripSchema?.travelExpenseData?.length >= 0 &&
          trip?.tripSchema?.tripStatus == status.COMPLETED
      )
      ?.map((trip) => {
        const { tripSchema } = trip;
        const {
          travelRequestData,
          cashAdvancesData,
          travelExpenseData,
          expenseAmountStatus,
          tripId,
          tripNumber,
          tripStartDate,
          tripCompletionDate,
        } = tripSchema || {};
        // const { totalCashAmount, totalRemainingCash } = expenseAmountStatus ||  {};
        const {
          travelRequestId,
          travelRequestNumber,
          travelRequestStatus,
          tripName,
          tripPurpose,
          travelType,
          isCashAdvanceTaken,
          itinerary,
        } = travelRequestData || {};

        if (travelType) {
          // console.log("inside completed", travelType)

          allCompletedTravelTypes.add(travelType);
        }

        const itineraryToSend = Object.fromEntries(
          Object.entries(itinerary)
            .filter(([category]) => category !== "formState")
            .map(([category, items]) => {
              let mappedItems;
              if (category === "hotels") {
                mappedItems = items.map(
                  ({
                    itineraryId,
                    status,
                    bkd_location,
                    bkd_class,
                    bkd_checkIn,
                    bkd_checkOut,
                    bkd_violations,
                    cancellationDate,
                    cancellationReason,
                    bookingDetails: { docURL },
                  }) => ({
                    category,
                    itineraryId,
                    status,
                    bkd_location,
                    bkd_class,
                    bkd_checkIn,
                    bkd_checkOut,
                    bkd_violations,
                    cancellationDate,
                    cancellationReason,
                    bookingDetails: { docURL },
                  })
                );
              } else if (category === "cabs") {
                mappedItems = items.map(
                  ({
                    itineraryId,
                    status,
                    bkd_date,
                    bkd_class,
                    bkd_pickupAddress,
                    bkd_dropAddress,
                    bookingDetails: { docURL },
                  }) => ({
                    category,
                    itineraryId,
                    status,
                    bkd_date,
                    bkd_class,
                    bkd_pickupAddress,
                    bkd_dropAddress,
                  })
                );
              } else {
                mappedItems = items.map(
                  ({
                    itineraryId,
                    status,
                    bkd_from,
                    bkd_to,
                    bkd_date,
                    bkd_time,
                    bkd_travelClass,
                    bkd_violations,
                    bookingDetails: { docURL },
                  }) => ({
                    category,
                    itineraryId,
                    status,
                    bkd_from,
                    bkd_to,
                    bkd_date,
                    bkd_time,
                    bkd_travelClass,
                    bkd_violations,
                    bookingDetails: { docURL },
                  })
                );
              }

              return [category, mappedItems];
            })
        );

        const travelExpenseReports = travelExpenseData?.map((expense) => ({
          expenseHeaderId: expense?.expenseHeaderId ?? "",
          expenseHeaderNumber: expense?.expenseHeaderNumber ?? '',
          createdBy: expense?.createdBy ?? "",
          expenseHeaderStatus: expense?.expenseHeaderStatus ?? "",
          expenseLines: expense?.expenseLines ?? "",
        }));

        // console.log("itineraryToSend.........................................", itineraryToSend)
        return {
          tripId: tripId ?? "",
          tripNumber: tripNumber ?? "",
          tripName: tripName ?? "",
          travelRequestId,
          travelType: travelType ?? "",
          travelRequestNumber,
          tripPurpose,
          tripStartDate,
          tripCompletionDate,
          travelRequestStatus,
          isCashAdvanceTaken,
          expenseAmountStatus,
          cashAdvances: isCashAdvanceTaken
            ? cashAdvancesData
              ? cashAdvancesData.map(
                  ({
                    cashAdvanceId,
                    cashAdvanceNumber,
                    amountDetails,
                    cashAdvanceStatus,
                  }) => ({
                    cashAdvanceId,
                    cashAdvanceNumber,
                    amountDetails,
                    cashAdvanceStatus,
                  })
                )
              : []
            : [],
          travelExpenses: travelExpenseReports,
          itinerary: itineraryToSend,
        };
      });

    // console.log("allCompletedTravelTypes",allCompletedTravelTypes)
    const getUniqueTravelTypes = Array.from(allCompletedTravelTypes);
    // console.log("getUniqueTravelTypes",getUniqueTravelTypes)
    const completedFormValidations = await getPolicyDetails(
      tenantId,
      empId,
      getUniqueTravelTypes
    );

    const allNonTravelReports = reimbursementReports
      .filter((report) => {
        return report?.createdBy?.empId === empId;
      })
      .flatMap((report) => {
        const {
          expenseHeaderId,
          createdBy,
          expenseAmountStatus,
          expenseHeaderNumber,
          expenseHeaderStatus,
          expenseLines,
        } = report;
        return [
          {
            expenseHeaderId,
            createdBy,
            expenseAmountStatus,
            expenseHeaderNumber,
            expenseHeaderStatus,
            expenseLines,
          },
        ];
      });

    // console.log("allNonTravelReports reports:", allNonTravelReports);

    return {
      allTripExpenseReports,
      allNonTravelReports,
      completedTrips,
      completedFormValidations,
    };
  } catch (error) {
    console.error("Error in fetching employee Dashboard:", error);
    throw new Error({ error: "Error in fetching employee Dashboard" });
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

const managerLayout = async (tenantId, empId) => {
  try {
    const approvals = await approvalsForManager(tenantId, empId);
    return approvals;
  } catch (error) {
    throw new Error({ message: "internal server error" });
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
  // console.log("entering manager - approvals", tenantId, empId);
  try {
    const [approvalDoc, reimbursementReports] = await Promise.all([
      fetchApprovalDocuments(tenantId, empId),
      fetchReimbursementReports(tenantId, empId),
    ]);

    if (approvalDoc.length === 0 && reimbursementReports.length === 0) {
      return { message: "There are no approvals found for the user" };
    }

    let travelAndCash;
    let trips;
    let travelExpenseReports;
    let nonTravelExpenseReports;

    if (approvalDoc?.length) {
      const travel = await Promise.all(
        approvalDoc
          .filter(
            (approval) =>
              approval.travelRequestSchema?.travelRequestStatus ===
                "pending approval" &&
              approval.travelRequestSchema?.approvers &&
              approval.travelRequestSchema?.approvers.length > 0 &&
              approval.travelRequestSchema?.isCashAdvanceTaken === false &&
              approval.travelRequestSchema.approvers.some(
                (approver) =>
                  approver.empId === empId &&
                  approver.status === "pending approval"
              )
          )
          .map(async (approval) => {
            const {
              travelRequestId,
              approvers,
              tripPurpose,
              tripName,
              createdBy,
              travelRequestNumber,
              travelRequestStatus,
              isCashAdvanceTaken,
              itinerary,
            } = approval.travelRequestSchema;

            // Await earliestDate if tripStartDate is not present
            const tripStartDate =
              approval.travelRequestSchema?.tripStartDate ??
              (await earliestDate(itinerary));
            const check = "preApproval";
            const allBkdViolations = extractValidViolations(itinerary, check);
            const violationsCounter = countViolations(allBkdViolations);

            return {
              travelRequestId,
              approvers,
              tripPurpose,
              tripName,
              tripStartDate,
              travelRequestNumber,
              createdBy,
              travelRequestStatus,
              isCashAdvanceTaken,
              violationsCounter,
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
                (approver) =>
                  approver?.empId === empId &&
                  approver?.status === "pending approval"
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
            const check = "preApproval";
            const allBkdViolations = extractValidViolations(itinerary, check);
            const violationsCounter = countViolations(allBkdViolations);

            const travelRequest = {
              travelRequestId,
              travelRequestNumber,
              createdBy,
              tripStartDate,
              tripPurpose,
              tripName,
              travelRequestNumber,
              travelRequestStatus,
              approvers,
              isCashAdvanceTaken,
              violationsCounter,
            };

            if (isValidCashStatus) {
              const cashAdvanceDetails = cashAdvancesData?.map(
                (cashAdvance) => ({
                  travelRequestNumber: cashAdvance.travelRequestNumber,
                  cashAdvanceNumber: cashAdvance.cashAdvanceNumber,
                  cashAdvanceStatus: cashAdvance.cashAdvanceStatus,
                  cashAdvanceId: cashAdvance.cashAdvanceId,
                  amountDetails: cashAdvance?.amountDetails,
                  cashViolationsCounter: cashAdvance?.cashAdvanceViolations
                    ? 1
                    : 0,
                })
              );

              return { ...travelRequest, cashAdvance: cashAdvanceDetails };
            } else {
              return { ...travelRequest, cashAdvance: [] };
            }
          })
      );
      // console.log("travelWithCash", JSON.stringify(travelWithCash,'',2))

      // console.log("approvalDoc", approvalDoc)
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
                  (approver) =>
                    approver?.empId === empId &&
                    approver?.status === "pending approval"
                )
            );

            return isValidTravelRequestStatus && hasPendingApprovalCashAdvance;
          })
          .map(async (approval) => {
            const { travelRequestData, cashAdvancesData } =
              approval.cashAdvanceSchema;
            const {
              travelRequestId,
              travelRequestNumber,
              tripPurpose,
              tripName,
              createdBy,
              travelRequestStatus,
              isCashAdvanceTaken,
              itinerary,
            } = travelRequestData;

            const tripStartDate =
              travelRequestData?.tripStartDate ??
              (await earliestDate(itinerary));
            const allBkdViolations = extractValidViolations(itinerary);
            const violationsCounter = countViolations(allBkdViolations);

            const travelRequest = {
              travelRequestId,
              tripPurpose,
              tripName,
              tripStartDate,
              travelRequestNumber,
              createdBy,
              isCashAdvanceTaken,
              travelRequestStatus,
              violationsCounter,
            };

            const cashAdvanceDetails = cashAdvancesData
              .filter(
                (cashAdvance) =>
                  cashAdvance.cashAdvanceStatus === "pending approval"
              )
              .map((cashAdvance) => ({
                travelRequestNumber: cashAdvance.travelRequestNumber,
                cashAdvanceNumber: cashAdvance.cashAdvanceNumber,
                cashAdvanceStatus: cashAdvance.cashAdvanceStatus,
                cashAdvanceId: cashAdvance.cashAdvanceId,
                amountDetails: cashAdvance.amountDetails,
                cashViolationsCounter: cashAdvance?.cashAdvanceViolations
                  ? 1
                  : 0,
              }));

            return { ...travelRequest, cashAdvance: cashAdvanceDetails };
          })
      );

      // console.log("cashAdvanceRaisedLater", cashAdvanceRaisedLater)
      const addALeg = await (async () => {
        if (!Array.isArray(approvalDoc) || approvalDoc.length === 0) {
          return {};
        }

        const result = approvalDoc
          .map((approval) => {
            const { tripStartDate, travelRequestData = {} } =
              approval.tripSchema || {};
            const { itinerary = {} } = travelRequestData;

            const filteredItinerary = {};
            ["flights", "hotels", "cabs", "trains"].forEach((category) => {
              const items = itinerary[category] || [];
              const pendingApprovalItems = items.filter((item) =>
                item?.approvers?.some(
                  (approver) =>
                    approver?.empId === empId &&
                    approver?.status === "pending approval"
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
              tripName: travelRequestData.tripName ?? "",
              travelRequestNumber: travelRequestData.travelRequestNumber,
              travelRequestStatus: travelRequestData.travelRequestStatus,
              tripStartDate: tripStartDate,
              violationsCounter: countViolations(
                extractValidViolations(itinerary)
              ),
              itinerary: filteredItinerary,
            };
          })
          .filter((item) => Object.keys(item.itinerary).length > 0);

        return result;
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
          // Filter the approvals where any expense matches the criteria
          const filteredApprovals = approvalDoc.filter((approval) => {
            return approval?.tripSchema?.travelExpenseData?.some((expense) => {
              return (
                expense.tenantId === tenantId &&
                expense.expenseHeaderStatus === "pending approval" &&
                expense.approvers.some((approver) => {
                  return (
                    approver.empId === empId &&
                    approver.status === "pending approval"
                  );
                })
              );
            });
          });
      
          // Extract the relevant travel expense data for those filtered approvals
          const travelExpenseDataList = filteredApprovals.flatMap((approval) => {
            return approval.tripSchema.travelExpenseData
              .filter((expense) => {
                // Only include expenses with "pending approval" status and the approver check
                return (
                  expense.tenantId === tenantId &&
                  expense.expenseHeaderStatus === "pending approval" &&
                  expense.approvers.some(
                    (approver) =>
                      approver.empId === empId && approver.status === "pending approval"
                  )
                );
              })
              .map((expense) => {
                const { tripName } = approval.travelRequestSchema;
                const { tripId, tripNumber, tripStatus, tripStartDate } = approval.tripSchema;
                const { tripPurpose, createdBy } = approval.tripSchema.travelRequestData;
                const {
                  expenseHeaderNumber,
                  expenseHeaderId,
                  expenseHeaderStatus,
                  approvers,
                  expenseLines,
                } = expense;
      
                // Return the relevant fields for each expense
                return {
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
      
          return travelExpenseDataList;
        } catch (error) {
          console.error('Error occurred:', error);
          return []; // Return an empty array or handle the error accordingly
        }
      })();      
    }

    if (reimbursementReports?.length) {
      nonTravelExpenseReports = await (async () => {
        try {
          const nonTravelExpenseDataList = reimbursementReports.map(
            (approval) => {
              const {
                expenseHeaderNumber,
                expenseHeaderId,
                expenseHeaderStatus,
                createdBy,
                approvers,
                expenseLines,
              } = approval;

              return {
                expenseHeaderNumber,
                expenseHeaderId,
                expenseHeaderStatus,
                createdBy,
                approvers,
                expenseLines,
              };
            }
          );

          return nonTravelExpenseDataList;
        } catch (error) {
          console.error("Error occurred:", error);
          return []; 
        }
      })();
    }

    const responseData = {
      travelAndCash: travelAndCash,
      trips: trips,
      travelExpenseReports: travelExpenseReports,
      nonTravelExpenseReports: nonTravelExpenseReports,
    };

    return responseData;
  } catch (error) {
    console.error("Error in fetching employee Dashboard:", error);
    throw error;
  }
};
//--new approvals

// const approvalsForManager = async (tenantId, empId) => {
//     console.log("Entering manager - approvals", tenantId, empId);
//     try {
//         const [approvalDoc, reimbursementReports] = await Promise.all([
//             fetchApprovalDocuments(tenantId, empId),
//             fetchReimbursementReports(tenantId, empId)
//         ]);

//         if (approvalDoc.length === 0 && reimbursementReports.length === 0) {
//             return { message: 'There are no approvals found for the user' };
//         }

//         const [travelAndCash, trips, travelExpenseReports] = await Promise.all([
//             processTravelAndCashRequests(approvalDoc, empId),
//             processAddALegRequests(approvalDoc, empId),
//             processTravelExpenseReports(approvalDoc, tenantId, empId)
//         ]);

//         const nonTravelExpenseReports = processNonTravelExpenseReports(reimbursementReports);

//         return {
//             travelAndCash,
//             trips,
//             travelExpenseReports,
//             nonTravelExpenseReports
//         };
//     } catch (error) {
//         console.error("Error in fetching employee Dashboard:", error);
//         throw error;
//     }
// };

export const fetchApprovalDocuments = (tenantId, empId) => {
  return dashboard
    .find({
      tenantId,
      $or: [
        {
          "travelRequestSchema.approvers.empId": empId,
          "travelRequestSchema.isCashAdvanceTaken": false,
          "travelRequestSchema.travelRequestStatus": "pending approval",
          "travelRequestSchema.approvers.status": "pending approval",
        },
        {
          "cashAdvanceSchema.travelRequestData.travelRequestStatus": {
            $in: ["pending approval", "approved", "booked", "pending booking"],
          },
          "cashAdvanceSchema.travelRequestData.approvers": {
            $elemMatch: {
              empId: empId,
              status: { $in: ["pending approval", "approved"] },
            },
          },
          "cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus":
            "pending approval",
          "cashAdvanceSchema.cashAdvancesData.approvers": {
            $elemMatch: { empId: empId, status: "pending approval" },
          },
        },
        {
          "tripSchema.travelRequestData.isAddALeg": true,
          "tripSchema.travelRequestData.approvers.empId": empId,
        },
        {
          "tripSchema.travelExpenseData": {
            $elemMatch: {
              tenantId: tenantId,
              expenseHeaderStatus: "pending approval",
              approvers: {
                $elemMatch: {
                  empId: empId,
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

export const fetchReimbursementReports = (tenantId, empId) => {
  return REIMBURSEMENT.find({
    tenantId,
    approvers: {
      $elemMatch: {
        empId: empId,
        status: "pending approval",
      },
    },
  });
};

const processTravelAndCashRequests = async (approvalDoc, empId) => {
  const travelRequests = approvalDoc
    .filter(
      (approval) =>
        approval.travelRequestSchema?.travelRequestStatus ===
          "pending approval" &&
        approval.travelRequestSchema?.approvers?.some(
          (approver) =>
            approver.empId === empId && approver.status === "pending approval"
        )
    )
    .map((approval) => mapTravelRequest(approval.travelRequestSchema));

  const cashAdvanceRequests = approvalDoc
    .filter(
      (approval) =>
        ["pending approval", "approved", "booked", "pending booking"].includes(
          approval.cashAdvanceSchema?.travelRequestData?.travelRequestStatus
        ) &&
        approval.cashAdvanceSchema?.cashAdvancesData?.some(
          (cash) =>
            cash.cashAdvanceStatus === "pending approval" &&
            cash.approvers?.some(
              (approver) =>
                approver.empId === empId &&
                approver.status === "pending approval"
            )
        )
    )
    .map((approval) => mapCashAdvanceRequest(approval.cashAdvanceSchema));

  return [...travelRequests, ...cashAdvanceRequests];
};

const processTravelExpenseReports = async (approvalDoc, tenantId, empId) => {
  try {
    const filteredApprovals = approvalDoc.filter((approval) =>
      approval?.tripSchema?.travelExpenseData?.some(
        (expense) =>
          expense.tenantId === tenantId &&
          expense.expenseHeaderStatus === "pending approval" &&
          expense.approvers.some(
            (approver) =>
              approver.empId === empId && approver.status === "pending approval"
          )
      )
    );

    return filteredApprovals.flatMap((approval) =>
      approval.tripSchema.travelExpenseData.map((expense) =>
        mapTravelExpense(expense, approval)
      )
    );
  } catch (error) {
    // console.error('Error occurred:', error);
    return []; // Return an empty array or handle the error accordingly
  }
};

const processAddALegRequests = async (approvalDoc, empId) => {
  return approvalDoc
    .filter((approval) => approval.tripSchema?.travelRequestData?.isAddALeg)
    .map((approval) => mapAddALegRequest(approval.tripSchema, empId));
};

const processNonTravelExpenseReports = (reimbursementReports) => {
  return reimbursementReports.map(mapNonTravelExpense);
};

// Helper functions for mapping data
const mapTravelRequest = (travelRequestSchema) => {};

const mapCashAdvanceRequest = (cashAdvanceSchema) => {};

const mapAddALegRequest = (tripSchema, empId) => {};

const mapTravelExpense = (expense, approval) => {
  const { tripName } = approval.travelRequestSchema;
  const { tripId, tripNumber, tripStatus, tripStartDate } = approval.tripSchema;
  const { tripPurpose, createdBy } = approval.tripSchema.travelRequestData;
  const {
    expenseHeaderNumber,
    expenseHeaderId,
    expenseHeaderStatus,
    approvers,
    expenseLines,
  } = expense;

  return {
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
};

const mapNonTravelExpense = (approval) => {
  const {
    expenseHeaderNumber,
    expenseHeaderId,
    expenseHeaderStatus,
    createdBy,
    approvers,
    expenseLines,
  } = approval;

  return {
    expenseHeaderNumber,
    expenseHeaderId,
    expenseHeaderStatus,
    createdBy,
    approvers,
    expenseLines,
  };
};

//---------------------------------------------------------------------Travel admin

const workingExtractItinerary = (itinerary) => {
  try {
    // Define property lists for each category
    const properties = {
      hotels: [
        "itineraryId",
        "status",
        "bkd_location",
        "bkd_class",
        "bkd_checkIn",
        "bkd_checkOut",
        "bkd_violations",
        "cancellationDate",
        "cancellationReason",
        "needBreakfast",
        "needLunch",
        "needDinner",
        "needNonSmokingRoom",
      ],
      cabs: [
        "itineraryId",
        "status",
        "bkd_date",
        "bkd_returnDate",
        "bkd_isFullDayCab",
        "bkd_class",
        "bkd_pickupAddress",
        "bkd_dropAddress",
      ],
      default: [
        "itineraryId",
        "status",
        "bkd_from",
        "bkd_to",
        "bkd_date",
        "bkd_time",
        "bkd_returnTime",
        "bkd_travelClass",
        "bkd_violations",
      ],
    };

    // Helper function to map and filter items based on the category
    const mapAndFilterItems = (items, propertyList) => {
      return items.reduce((acc, item) => {
        if (item.status === "pending booking") {
          const filteredItem = propertyList.reduce((result, prop) => {
            if (prop in item) result[prop] = item[prop];
            return result;
          }, {});
          acc.push(filteredItem);
        }
        return acc;
      }, []);
    };

    // Ensure 'itinerary' is an object and not null
    if (typeof itinerary !== "object" || itinerary === null) {
      throw new Error("Invalid itinerary object");
    }

    // Map and filter the items for each category
    const itineraryToSend = Object.entries(itinerary)
      .filter(([category]) => category !== "formState")
      .reduce((acc, [category, items]) => {
        const propertyList = properties[category] || properties.default;
        if (Array.isArray(items)) {
          acc[category] = mapAndFilterItems(items, propertyList);
        } else {
          console.warn(
            `Expected array for category '${category}', but found:`,
            items
          );
        }
        return acc;
      }, {});

    return itineraryToSend;
  } catch (error) {
    console.error("Error in extracting itinerary:", error.message);
    throw new Error(`Error in extracting itinerary: ${error.message}`);
  }
};

const extractItinerary = (itinerary) => {
  try {
    // Ensure 'itinerary' is an object and not null
    if (typeof itinerary !== "object" || itinerary === null) {
      throw new Error("Invalid itinerary object");
    }

    // Helper function to filter items based on status
    const filterPendingBookings = (items) => {
      return items.filter((item) => item.status === "pending booking");
    };

    // Extract and filter the items for each category
    const itineraryToSend = Object.entries(itinerary)
      .filter(([category]) => category !== "formState") // Skip 'formState' if it exists
      .reduce((acc, [category, items]) => {
        if (Array.isArray(items)) {
          acc[category] = filterPendingBookings(items);
        } else {
          console.warn(
            `Expected array for category '${category}', but found:`,
            items
          );
        }
        return acc;
      }, {});

    return itineraryToSend;
  } catch (error) {
    console.error("Error in extracting itinerary:", error.message);
    throw new Error(`Error in extracting itinerary: ${error.message}`);
  }
};

const gradeForEmployee = async (empId) => {
  try {
    const getEmployee = await HRMaster.findOne({
      employees: {
        $elemMatch: {
          "employeeDetails.employeeId": empId,
        },
      },
    });

    // console.log('verifiedEmployee:', verifyEmployee);
    if (getEmployee) {
      const employee = getEmployee.employees.find(
        (employee) => employee.employeeDetails.employeeId === empId
      );

      const grade = employee.employeeDetails.grade;
      //   console.log('jackpot', grade);

      return grade;
    }
  } catch (error) {
    console.error("Error in travelAdmin:", error);
    throw error;
  }
};

const businessAdminLayout = async (tenantId, empId) => {
  try {
    // console.log("verified business admin layout", tenantId, empId);

    const bookingDoc = await dashboard
      .find({
        tenantId,
        $or: [
          {
            "travelRequestSchema.travelRequestStatus": "pending booking",
            "travelRequestSchema.isCashAdvanceTaken": false,
          },
          {
            "cashAdvanceSchema.travelRequestData.travelRequestStatus":
              "pending booking",
            "travelRequestSchema.isCashAdvanceTaken": true,
          },
          {
            "tripSchema.travelRequestData.isAddALeg": true,
            "tripSchema.travelRequestData.travelRequestStatus": "booked",
          },
          {
            "tripSchema.travelRequestData.tripStatus": {
              $nin: ["paid and cancelled"],
            },
          },
        ],
      })
      .lean()
      .exec();

    if (bookingDoc?.length === 0) {
      return { error: "Error in fetching data for business admin" };
    }

    // console.log("booking from database .......................", bookingDoc)

    // const travel = await (async () => {
    //     // console.log("booking", bookingDoc)
    //     const filteredBooking = bookingDoc.filter(booking =>
    //         booking?.travelRequestSchema?.travelRequestStatus === 'pending booking'
    //     );

    //     // console.log("filteredBooking for travel", filteredBooking)
    //     return filteredBooking.map(booking => {
    //         const { travelRequestId, tripPurpose,createdBy, travelRequestNumber,tripName, travelRequestStatus, isCashAdvanceTaken, assignedTo, itinerary } = booking.travelRequestSchema;
    //         const {empId}= createdBy
    //         const grade = await gradeForEmployee(empId)
    //         const itineraryToSend = extractItinerary(itinerary)
    //         const tripStartDate = extractStartDate(itinerary)

    //         return { travelRequestId,grade, tripPurpose,tripName,tripStartDate, itinerary:itineraryToSend, travelRequestNumber, travelRequestStatus, isCashAdvanceTaken, assignedTo };
    //     }).filter(Boolean);
    // })();
    const travel = await (async () => {
      // Filter bookings where the travelRequestStatus is 'pending booking'
      const filteredBooking = bookingDoc.filter(
        (booking) =>
          booking?.travelRequestSchema?.travelRequestStatus ===
            "pending booking" &&
          booking?.travelRequestSchema?.isCashAdvanceTaken === false
      );

      // Process each filtered booking
      const results = await Promise.all(
        filteredBooking.map(async (booking) => {
          try {
            const {
              travelRequestId,
              tripPurpose,
              createdBy,
              travelRequestNumber,
              tripName,
              travelRequestStatus,
              isCashAdvanceTaken,
              assignedTo,
              itinerary,
              isAddALeg,
            } = booking.travelRequestSchema;
            const { empId } = createdBy;

            // Fetch the grade for the employee
            const grade = await gradeForEmployee(empId);

            // Extract itinerary details
            const itineraryToSend = extractItinerary(itinerary);
            const tripStartDate = extractStartDate(itinerary);

            // Return the processed booking
            return {
              travelRequestId,
              grade,
              createdBy,
              tripPurpose,
              tripName,
              tripStartDate,
              itinerary: itineraryToSend,
              travelRequestNumber,
              travelRequestStatus,
              isCashAdvanceTaken,
              assignedTo,
              isAddALeg,
            };
          } catch (error) {
            console.error(
              `Error processing booking ${booking.travelRequestSchema.travelRequestId}:`,
              error
            );
            return null; // Ensure that errors don't break the whole map operation
          }
        })
      );

      // Filter out any falsy values from the results array
      return results.filter(Boolean);
    })();

    // console.log("travel booking .......", travel)
    // const travelWithCash = await (async () => {
    //     const filteredBooking = bookingDoc.filter(booking =>
    //         booking?.cashAdvanceSchema?.travelRequestData?.travelRequestStatus === 'pending booking'
    //     );

    //     return filteredBooking.map(booking => {
    //         const { travelRequestData } = booking?.cashAdvanceSchema;
    //         const { travelRequestId,createdBy, travelRequestNumber,itinerary,tripPurpose,tripName, travelRequestStatus , isCashAdvanceTaken, assignedTo} = travelRequestData;
    //         const { empId}= createdBy
    //         const grade = await gradeForEmployee(empId);

    //         const itineraryToSend = extractItinerary(itinerary)
    //         const tripStartDate = extractStartDate(itinerary)

    //         return { travelRequestId,grade, travelRequestNumber,tripStartDate, tripPurpose,tripName,itinerary:itineraryToSend, travelRequestStatus, isCashAdvanceTaken , assignedTo};
    //     }).filter(Boolean);
    // })();
    const travelWithCash = await (async () => {
      // Filter bookings where the travelRequestStatus is 'pending booking'
      const filteredBooking = bookingDoc.filter(
        (booking) =>
          booking?.cashAdvanceSchema?.travelRequestData?.travelRequestStatus ===
            "pending booking" &&
          booking?.cashAdvanceSchema?.travelRequestData?.isCashAdvanceTaken ===
            true
      );

      // Process each filtered booking with an async function
      const results = await Promise.all(
        filteredBooking.map(async (booking) => {
          const { travelRequestData } = booking?.cashAdvanceSchema;
          const {
            travelRequestId,
            createdBy,
            travelRequestNumber,
            itinerary,
            tripPurpose,
            tripName,
            travelRequestStatus,
            isCashAdvanceTaken,
            assignedTo,
            isAddALeg,
          } = travelRequestData;
          const { empId } = createdBy;

          try {
            // Fetch the grade for the employee
            const grade = await gradeForEmployee(empId);

            // Extract itinerary details
            const itineraryToSend = extractItinerary(itinerary);
            const tripStartDate = extractStartDate(itinerary);

            // Return the processed booking
            return {
              travelRequestId,
              grade,
              createdBy,
              travelRequestNumber,
              tripStartDate,
              tripPurpose,
              tripName,
              itinerary: itineraryToSend,
              travelRequestStatus,
              isCashAdvanceTaken,
              assignedTo,
              isAddALeg,
            };
          } catch (error) {
            console.error(
              `Error processing booking ${travelRequestId}:`,
              error
            );
            return null; // Return null for any booking that failed to process
          }
        })
      );

      // Filter out any falsy values from the results array
      return results.filter(Boolean);
    })();

    // console.log("travel booking with cash .......", travelWithCash)
    // const trips = await (async () => {
    //     const filteredBooking = bookingDoc.filter(booking =>
    //         booking?.tripSchema?.travelRequestData?.travelRequestStatus === 'booked' &&
    //         booking?.tripSchema?.travelRequestData?.isAddALeg == true
    //     );

    //     return filteredBooking.map(booking => {
    //         const { tripId, tripNumber, tripStatus,tripStartDate, travelRequestData } = booking.tripSchema;
    //         const { travelRequestId,createdBy, travelRequestNumber,itinerary, tripPurpose,tripName, travelRequestStatus , isCashAdvanceTaken, assignedTo} = travelRequestData;
    //         const { empId } = createdBy;
    //         const grade = await gradeForEmployee(empId);

    //         const itineraryToSend = extractItinerary(itinerary)

    //         return { tripId,grade,
    //             tripNumber,
    //             tripStatus,tripStartDate, travelRequestId, travelRequestNumber, tripPurpose,tripName,itinerary:itineraryToSend, travelRequestStatus, isCashAdvanceTaken , assignedTo};
    //     }).filter(Boolean)
    // })();
    const trips = await (async () => {
      // Filter bookings where the travelRequestStatus is 'booked' and isAddALeg is true
      const filteredBooking = bookingDoc.filter(
        (booking) =>
          booking?.tripSchema?.travelRequestData?.travelRequestStatus ===
            "booked" &&
          booking?.tripSchema?.travelRequestData?.isAddALeg === true
      );

      const results = await Promise.all(
        filteredBooking.map(async (booking) => {
          const {
            tripId,
            tripNumber,
            tripStatus,
            tripStartDate,
            travelRequestData,
          } = booking.tripSchema;
          const {
            travelRequestId,
            createdBy,
            travelRequestNumber,
            itinerary,
            tripPurpose,
            tripName,
            travelRequestStatus,
            isCashAdvanceTaken,
            assignedTo,
            isAddALeg,
          } = travelRequestData;
          const { empId } = createdBy;

          try {
            const grade = await gradeForEmployee(empId);

            // Extract itinerary details
            const itineraryToSend = extractItinerary(itinerary);

            // Return the processed booking
            return {
              tripId,
              grade,
              createdBy,
              tripNumber,
              tripStatus,
              tripStartDate,
              travelRequestId,
              travelRequestNumber,
              tripPurpose,
              tripName,
              itinerary: itineraryToSend,
              travelRequestStatus,
              isCashAdvanceTaken,
              assignedTo,
              isAddALeg,
            };
          } catch (error) {
            console.error(`Error processing trip ${tripId}:`, error);
            return null; // Return null for any booking that failed to process
          }
        })
      );

      // Filter out any falsy values from the results array
      return results.filter(Boolean);
    })();

    // console.log("Add a leg .......", JSON.stringify(trips,'',2))

    const tripsPaidAndCancelled = await (async () => {
      // Filter bookings where the tripStatus is not 'cancelled' and travelRequestStatus is 'booked'
      const filteredBooking = bookingDoc.filter(
        (booking) =>
          booking?.tripSchema?.travelRequestData?.tripStatus !== "cancelled" &&
          booking?.tripSchema?.travelRequestData?.travelRequestStatus ===
            "booked"
      );

      // Process each filtered booking with an async function
      const results = await Promise.all(
        filteredBooking.map(async (booking) => {
          const {
            tripId,
            tripNumber,
            tripStartDate,
            tripStatus,
            travelRequestData,
          } = booking.tripSchema;
          const {
            travelRequestId,
            itinerary,
            createdBy,
            travelRequestNumber,
            tripPurpose,
            tripName,
            travelRequestStatus,
            isCashAdvanceTaken,
            assignedTo,
          } = travelRequestData;
          const { empId } = createdBy;

          try {
            // Fetch the grade for the employee
            const grade = await gradeForEmployee(empId);

            // Extract itinerary details
            const itineraryToSend = extractItinerary(itinerary);

            // Return the processed booking
            return {
              tripId,
              grade,
              createdBy,
              tripNumber,
              tripStatus,
              tripStartDate,
              travelRequestId,
              travelRequestNumber,
              tripPurpose,
              tripName,
              itinerary: itineraryToSend,
              travelRequestStatus,
              isCashAdvanceTaken,
              assignedTo,
            };
          } catch (error) {
            console.error(`Error processing trip ${tripId}:`, error);
            return null; // Return null for any booking that failed to process
          }
        })
      );

      // Flatten and filter out any falsy values from the results array
      return results.filter(Boolean);
    })();

    const pendingBooking = [...travel, ...travelWithCash, ...trips];
    const paidAndCancelledTrips = [...tripsPaidAndCancelled];

    // const responseData = {pendingBooking, paidAndCancelledTrips, pendingBookingTrips};
    // return responseData

    const responseData = { pendingBooking, paidAndCancelledTrips };

    const result = Object.values(responseData).some((value) => value.length > 0)
      ? responseData
      : [];

    return result;
  } catch (error) {
    console.error("Error in fetching employee Dashboard:", error);
    // Return an object indicating the error occurred
    throw new Error({ error: "Error in fetching data for business admin" });
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
      layoutAccess.businessAdmin(),
    ]);

    return {
      employee: results[0],
      employeeManager: results[1],
      finance: results[2],
      businessAdmin: results[3],
    };
  } catch (error) {
    console.error("Error in superAdminLayout:", error);
    throw error;
  }
};

export { roleBasedLayout, gradeForEmployee };
