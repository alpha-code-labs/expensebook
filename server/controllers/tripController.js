import reporting, {
  cashAdvanceStatusEnum,
  tripStatusEnum,
} from "../models/reportingSchema.js";
import {
  getWeekRange,
  getMonthRange,
  getQuarterRange,
  getYear,
} from "../helpers/dateHelpers.js";
import HRCompany from "../models/hrCompanySchema.js";
import { expenseHeaderStatusEnums } from "../models/travelExpenseSchema.js";
import {
  getEmployeeDetails,
  getEmployeeIdsByDepartment,
  getGroupDetails,
} from "../utils/functions.js";
import { tripFilterSchema } from "./financeController.js";

function getItinerary(itinerary) {
  try {
    const extractItinerary = Object.fromEntries(
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
              })
            );
          }

          return [category, mappedItems];
        })
    );
    return extractItinerary;
  } catch (error) {}
}

const extractTrip = (tripDocs) => {
  try {
    if (!tripDocs?.length) {
      return [];
    }
    const getTrips = tripDocs.map((trip) => {
      const {
        travelRequestData,
        cashAdvancesData,
        travelExpenseData,
        expenseAmountStatus,
        tripId,
        tripNumber,
        tripStartDate,
        tripCompletionDate,
        tripStatus,
      } = trip || {};
      const { totalCashAmount, totalRemainingCash } = expenseAmountStatus || {};
      const {
        travelRequestId,
        travelRequestNumber,
        travelRequestStatus,
        tripPurpose,
        createdBy,
        tripName,
        isCashAdvanceTaken,
        travelType,
        approvers,
        itinerary,
      } = travelRequestData || {};

      const itineraryToSend = getItinerary(itinerary);

      return {
        tripId,
        tripNumber,
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
        cashAdvances: isCashAdvanceTaken
          ? cashAdvancesData
            ? cashAdvancesData.map(
                ({
                  cashAdvanceId,
                  cashAdvanceNumber,
                  amountDetails,
                  cashAdvanceStatus,
                  approvers,
                  cashAdvanceRequestDate,
                  paidBy,
                  recoveredBy,
                  cashAdvanceRejectionReason,
                }) => ({
                  cashAdvanceId,
                  cashAdvanceNumber,
                  amountDetails,
                  cashAdvanceStatus,
                  approvers,
                  cashAdvanceRequestDate,
                  paidBy,
                  recoveredBy,
                  cashAdvanceRejectionReason,
                })
              )
            : []
          : [],
        // travelExpenses: travelExpenseData?.map(({ expenseHeaderId, expenseHeaderNumber, expenseHeaderStatus, approvers ,expenseLines,travelType}) => ({
        //   expenseHeaderId,
        //   expenseHeaderNumber,
        //   expenseHeaderStatus,
        //   approvers, expenseLines,
        // travelType
        // })),
        travelExpenses: travelExpenseData,
        itinerary: itineraryToSend,
      };
    });

    if (!getTrips) {
      return [];
    }
    return getTrips;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// const filterTrips = async (req, res) => {
//   try {
//     const { error, value } = tripFilterSchema.validate({
//       ...req.params,
//       ...req.body
//     });

//     if (error) {
//       console.log("what is the error", error)
//       return res.status(400).json({ message: error.details[0].message ,  trips:[], success: false
//       });
//     }

//     console.log("filter trips - value", JSON.stringify(value,'',2))
//     const { tenantId, empId, role, filterBy, date, empNames, fromDate, toDate, travelType, tripStatus,cashAdvanceStatus, travelAllocationHeaders, approvers , getGroups=[]} = value;

//     console.log({role})
//     const forTeam = [getGroups]
// let getHrInfo;
// let getHrData;
// let empIds;
// let employeeDocument, employeeDetails, group, getAllGroups, matchedEmployees;

// switch (role) {
//   case 'myView':

//   break;

//   case 'financeView':

//   default:
//     break;
// }
// console.info({empIds})

//     if (getGroups?.length) {
//       console.log({getGroups})
//     getHrInfo = await getGroupDetails(tenantId, empId, getGroups);
//     ({ employeeDocument, employeeDetails, group, getAllGroups, matchedEmployees } = getHrInfo);
//     empIds = matchedEmployees ? matchedEmployees.map(e => e.empId) : [empId];
//     }
//     console.info({empIds})

//     if(empNames?.length){
//     getHrData = await getEmployeeDetails(tenantId,empId)
//     empIds = empNames ? empNames.map(e => e.empId) : [empId];
//     }
//     console.info({empIds})

//     console.log("get Groups kaboom",typeof getGroups , JSON.stringify(getGroups,'',2))

//     console.log("empIds", JSON.stringify(empIds,'',2))
//     let filterCriteria = {
//       tenantId: tenantId,
//     };

//     if(empIds?.length){
//       filterCriteria['createdBy.empId'] = { $in: empIds }
//     }

//     if (filterBy && date && (!fromDate && !toDate)) {
//       if (date) {
//         const parsedDate = new Date(date);

//         switch (filterBy) {
//           case 'date':
//             filterCriteria['tripCompletionDate'] = {
//                 $gte: parsedDate,
//                 $lt: new Date(parsedDate.setDate(parsedDate.getDate() + 1)),
//             };
//             break;

//           case 'week':
//             const { startOfWeek, endOfWeek } = getWeekRange(parsedDate);
//             filterCriteria['tripCompletionDate'] ={
//                 $gte: startOfWeek,
//                 $lt: new Date(endOfWeek.setDate(endOfWeek.getDate() + 1)),
//               };
//             break;

//           case 'month':
//             const { startOfMonth, endOfMonth } = getMonthRange(parsedDate);
//             filterCriteria['tripCompletionDate'] = {
//                 $gte: startOfMonth,
//                 $lt: new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)),
//             };
//             break;

//           case 'quarter':
//             const { startOfQuarter, endOfQuarter } = getQuarterRange(parsedDate);
//             filterCriteria['tripCompletionDate'] =  {
//                 $gte: startOfQuarter,
//                 $lt: new Date(endOfQuarter.setDate(endOfQuarter.getDate() + 1)),
//             };
//             break;

//           case 'year':
//             const { startOfYear, endOfYear } = getYear(parsedDate);
//             filterCriteria['tripCompletionDate'] = {
//                 $gte: startOfYear,
//                 $lt: new Date(endOfYear.setDate(endOfYear.getDate() + 1)),
//             };
//             break;

//           default:
//             break;
//         }
//       }
//     }

//     if (fromDate && toDate) {
//       filterCriteria['tripCompletionDate'] =  {
//           $gte: new Date(fromDate),
//           $lte: new Date(toDate),
//       };
//     }

//     console.log("filter applied", filterCriteria)
//     if (travelType) {
//       filterCriteria['travelRequestData.travelType'] = travelType;
//     }

//     if(tripStatus?.length){
//       filterCriteria.tripStatus= {$in: tripStatus};
//     }

//     if (cashAdvanceStatus?.length) {
//       console.log("i got here", cashAdvanceStatus)
//       filterCriteria.cashAdvancesData = {
//         $elemMatch:{
//           cashAdvanceStatus: { $in: cashAdvanceStatus }
//         }
//       };
//   }

//     // console.log("filterCriteria", JSON.stringify(filterCriteria,'',2))
//     if(travelAllocationHeaders){
//       filterCriteria['travelRequestData.travelAllocationHeaders'] = {
//         $elemMatch:{
//           headerName:{$in:travelAllocationHeaders.map((header)=> header.headerName)},
//           headerValue:{$in:travelAllocationHeaders.map((header)=> header.headerValue),}
//         }
//       };
//     }

//     if(approvers){
//       filterCriteria['travelRequestData.approvers'] ={
//         $elemMatch:{
//           name:{$in:approvers.map((approver)=> approver.name)},
//           empId:{$in:approvers.map((approver)=> approver.empId)}
//           }
//           }
//     }

//     if(empNames && empIds){
//           filterCriteria['createdBy.empId'] = {$in:empIds}
//     }

//     console.info({getHrInfo,getHrData})
//     console.log("filterCriteria finally", JSON.stringify(filterCriteria,'',2))
//     const tripDocs = await reporting.find(filterCriteria);

//     if (tripDocs.length === 0) {
//       return res.status(204).json({
//         success: true,
//         trips:[],
//         message: 'No trips found matching the filter criteria',
//       });
//     }

//     const getTrips = extractTrip(tripDocs)
//     const updatedTrips = getTrips.map(trip => ({
//       ...trip,
//       groupName:getGroups
//     }))
//     return res.status(200).json({success:true , trips:updatedTrips});
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({message:e.message });
//   }
// };
const filterTrips = async (req, res) => {
  try {
    const { error, value } = tripFilterSchema.validate({
      ...req.params,
      ...req.body,
    });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, trips: [], success: false });
    }

    const {
      tenantId,
      empId,
      role,
      filterBy,
      date,
      empNames,
      fromDate,
      toDate,
      travelType,
      tripStatus,
      cashAdvanceStatus,
      travelAllocationHeaders,
      approvers,
      getGroups = [],
      getDepartments = [],
    } = value;

    console.log("role filter trips", role);

    const isMyView = role === "myView";
    const isFinanceView = role === "financeView";
    const isTeamView = role === "teamView";
    const isSuperAdmin = role === "superAdmin";

    console.log("my view", typeof role);
    // let empIds = [empId];
    // if (isFinanceView || getGroups.length) {
    //   const { matchedEmployees} = await getGroupDetails(
    //     tenantId,
    //     empId,
    //     getGroups
    //   );
    //   empIds = matchedEmployees?.map((e) => e.empId) || empIds;
    // } else if (isMyView && empNames?.length) {
    //   await getEmployeeDetails(tenantId, empId);
    //   empIds = empNames.map((e) => e.empId);
    // } else if (isFinanceView) {
    // } else if(getDepartments.length){
    //   const getEmpIds = await getEmployeeIdsByDepartment(tenantId,empId,department)
    //   console.log("getEmpIds for filterTrips superAdmin", getEmpIds)
    // }
    const addUniqueIds = (currentIds, newIds) => [
      ...new Set([...currentIds, ...newIds]),
    ];

    let empIds = [empId];

    if (isFinanceView || getGroups.length) {
      const { matchedEmployees } = await getGroupDetails(
        tenantId,
        empId,
        getGroups
      );
      const newEmpIds = matchedEmployees?.map((e) => e.empId) || [];
      empIds = addUniqueIds(empIds, newEmpIds);
    }

    if (isMyView && empNames?.length) {
      await getEmployeeDetails(tenantId, empId);
      const newEmpIds = empNames.map((e) => e.empId);
      empIds = addUniqueIds(empIds, newEmpIds);
    }

    if (getDepartments.length) {
      const getEmpIds = await getEmployeeIdsByDepartment(
        tenantId,
        empId,
        department
      );
      console.log("getEmpIds for filterTrips superAdmin", getEmpIds);
      empIds = addUniqueIds(empIds, getEmpIds);
    }

    console.log("empIds for filter TRips", empIds);
    const filterCriteria = buildFilterCriteria({
      tenantId,
      empIds,
      filterBy,
      date,
      fromDate,
      toDate,
      travelType,
      tripStatus,
      cashAdvanceStatus,
      travelAllocationHeaders,
      approvers,
    });

    const tripDocs = await reporting.find(filterCriteria);

    console.log("filterCriteria trips", filterCriteria);
    if (tripDocs.length === 0) {
      return res.status(204).json({
        success: true,
        trips: [],
        message: "No trips found matching the filter criteria",
      });
    }

    const updatedTrips = extractTrip(tripDocs).map((trip) => ({
      ...trip,
      groupName: getGroups,
    }));
    return res.status(200).json({ success: true, trips: updatedTrips });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

const buildFilterCriteria = ({
  tenantId,
  empIds,
  filterBy,
  date,
  fromDate,
  toDate,
  travelType,
  tripStatus,
  cashAdvanceStatus,
  travelAllocationHeaders,
  approvers,
}) => {
  const filterCriteria = { tenantId, "createdBy.empId": { $in: empIds } };

  if (filterBy && date && !fromDate && !toDate) {
    const parsedDate = new Date(date);
    const dateRange = getDateRange(filterBy, parsedDate);
    if (dateRange) {
      filterCriteria.tripCompletionDate = dateRange;
    }
  } else if (fromDate && toDate) {
    filterCriteria.tripCompletionDate = {
      $gte: new Date(fromDate),
      $lte: new Date(toDate),
    };
  }

  if (travelType) filterCriteria["travelRequestData.travelType"] = travelType;
  if (tripStatus?.length) filterCriteria.tripStatus = { $in: tripStatus };
  if (cashAdvanceStatus?.length) {
    filterCriteria.cashAdvancesData = {
      $elemMatch: { cashAdvanceStatus: { $in: cashAdvanceStatus } },
    };
  }
  if (travelAllocationHeaders) {
    filterCriteria["travelRequestData.travelAllocationHeaders"] = {
      $elemMatch: {
        headerName: { $in: travelAllocationHeaders.map((h) => h.headerName) },
        headerValue: { $in: travelAllocationHeaders.map((h) => h.headerValue) },
      },
    };
  }
  if (approvers) {
    filterCriteria["travelRequestData.approvers"] = {
      $elemMatch: {
        name: { $in: approvers.map((a) => a.name) },
        empId: { $in: approvers.map((a) => a.empId) },
      },
    };
  }

  return filterCriteria;
};

const getDateRange = (filterBy, date) => {
  const ranges = {
    date: () => ({
      $gte: date,
      $lt: new Date(date.setDate(date.getDate() + 1)),
    }),
    week: () => {
      const { startOfWeek, endOfWeek } = getWeekRange(date);
      return {
        $gte: startOfWeek,
        $lt: new Date(endOfWeek.setDate(endOfWeek.getDate() + 1)),
      };
    },
    month: () => {
      const { startOfMonth, endOfMonth } = getMonthRange(date);
      return {
        $gte: startOfMonth,
        $lt: new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)),
      };
    },
    quarter: () => {
      const { startOfQuarter, endOfQuarter } = getQuarterRange(date);
      return {
        $gte: startOfQuarter,
        $lt: new Date(endOfQuarter.setDate(endOfQuarter.getDate() + 1)),
      };
    },
    year: () => {
      const { startOfYear, endOfYear } = getYear(date);
      return {
        $gte: startOfYear,
        $lt: new Date(endOfYear.setDate(endOfYear.getDate() + 1)),
      };
    },
  };

  return ranges[filterBy] ? ranges[filterBy]() : null;
};

const filterCash = async (req, res) => {
  try {
    const { error, value } = tripFilterSchema.validate({
      ...req.params,
      ...req.body,
    });

    if (error) {
      console.log("what is the error", error);
      return res
        .status(400)
        .json({ message: error.details[0].message, trips: [], success: false });
    }

    console.log("filter trips - value", JSON.stringify(value, "", 2));
    const {
      tenantId,
      empId,
      filterBy,
      date,
      fromDate,
      toDate,
      travelType,
      tripStatus,
      cashAdvanceStatus,
      travelAllocationHeaders,
      approvers,
      getGroups,
    } = value;

    let filterCriteria = {
      tenantId: tenantId,
      "createdBy.empId": empId,
    };

    if (filterBy && date && !fromDate && !toDate) {
      if (date) {
        const parsedDate = new Date(date);

        switch (filterBy) {
          case "date":
            filterCriteria["tripCompletionDate"] = {
              $gte: parsedDate,
              $lt: new Date(parsedDate.setDate(parsedDate.getDate() + 1)),
            };
            break;

          case "week":
            const { startOfWeek, endOfWeek } = getWeekRange(parsedDate);
            filterCriteria["tripCompletionDate"] = {
              $gte: startOfWeek,
              $lt: new Date(endOfWeek.setDate(endOfWeek.getDate() + 1)),
            };
            break;

          case "month":
            const { startOfMonth, endOfMonth } = getMonthRange(parsedDate);
            filterCriteria["tripCompletionDate"] = {
              $gte: startOfMonth,
              $lt: new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)),
            };
            break;

          case "quarter":
            const { startOfQuarter, endOfQuarter } =
              getQuarterRange(parsedDate);
            filterCriteria["tripCompletionDate"] = {
              $gte: startOfQuarter,
              $lt: new Date(endOfQuarter.setDate(endOfQuarter.getDate() + 1)),
            };
            break;

          case "year":
            const { startOfYear, endOfYear } = getYear(parsedDate);
            filterCriteria["tripCompletionDate"] = {
              $gte: startOfYear,
              $lt: new Date(endOfYear.setDate(endOfYear.getDate() + 1)),
            };
            break;

          default:
            break;
        }
      } else if (fromDate && toDate) {
        filterCriteria["tripCompletionDate"] = {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        };
      }
    }

    if (travelType) {
      filterCriteria["travelRequestData.travelType"] = travelType;
    }

    if (tripStatus?.length) {
      filterCriteria.tripStatus = { $in: tripStatus };
    }

    if (cashAdvanceStatus?.length) {
      filterCriteria.cashAdvancesData.cashAdvanceStatus = {
        $in: cashAdvanceStatus,
      };
    }

    console.log("filterCriteria", JSON.stringify(filterCriteria, "", 2));
    if (travelAllocationHeaders) {
      filterCriteria["travelRequestData.travelAllocationHeaders"] = {
        $elemMatch: {
          headerName: {
            $in: travelAllocationHeaders.map((header) => header.headerName),
          },
          headerValue: {
            $in: travelAllocationHeaders.map((header) => header.headerValue),
          },
        },
      };
    }

    if (approvers) {
      filterCriteria["travelRequestData.approvers"] = {
        $elemMatch: {
          name: { $in: approvers.map((approver) => approver.name) },
          empId: { $in: approvers.map((approver) => approver.empId) },
        },
      };
    }

    const tripDocs = await reporting.find(filterCriteria);

    console.log("tripDocs", tripDocs);
    if (tripDocs.length === 0) {
      return res.status(204).json({
        success: true,
        trips: [],
        message: "No trips found matching the filter criteria",
      });
    }

    const getTrips = extractTrip(tripDocs);
    return res.status(200).json({ success: true, trips: getTrips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const filterTravelExpenses = async (req, res) => {
  try {
    const { error, value } = tripFilterSchema.validate({
      ...req.params,
      ...req.body,
    });

    if (error) {
      console.log("what is the error", error);
      return res
        .status(204)
        .json({ message: error.details[0].message, trips: [], success: true });
    }

    console.log("filter trips - value", JSON.stringify(value, "", 2));
    const {
      tenantId,
      empId,
      filterBy,
      role,
      date,
      fromDate,
      empNames,
      toDate,
      travelType,
      tripStatus,
      expenseHeaderStatus,
      travelAllocationHeaders,
      approvers,
      getGroups = [],
      getDepartments = [],
    } = value;

    const approverEmpIds = approvers?.map((a) => a.empId);
    const forTeam = [getGroups];
    let getHrInfo;
    let getHrData;
    // const addUniqueIds = (currentIds, newIds) => [...new Set([...currentIds, ...newIds])];

    // let empIds = [empId];
    let employeeDocument,
      employeeDetails,
      group,
      getAllGroups,
      matchedEmployees;

    const isMyView = role === "myView";
    const isFinanceView = role === "financeView";
    const isTeamView = role === "teamView";

    console.log("my view", typeof role);

    // if (isFinanceView && getGroups?.length) {
    //   getHrInfo = await getGroupDetails(tenantId, empId, getGroups);
    //   ({
    //     employeeDocument,
    //     employeeDetails,
    //     group,
    //     getAllGroups,
    //     matchedEmployees,
    //   } = getHrInfo);
    //   empIds = matchedEmployees
    //     ? matchedEmployees.map((e) => e.empId)
    //     : [empId];
    // }

    // if (!empNames?.length || isMyView || empNames?.length) {
    //   getHrData = await getEmployeeDetails(tenantId, empId);
    //   empIds = empNames ? empNames.map((e) => e.empId) : [empId];
    // }

    // let filterCriteria = {
    //   tenantId: tenantId,
    // };

    // console.log("get Groups", typeof getGroups);

    // if (empIds?.length) {
    //   filterCriteria["createdBy.empId"] = { $in: empIds };
    // } else {
    //   filterCriteria["createdBy.empId"] = empId;
    // }
    const addUniqueIds = (currentIds, newIds) => [
      ...new Set([...currentIds, ...newIds]),
    ];

    let empIds = [empId];

    if (isFinanceView && getGroups?.length) {
      getHrInfo = await getGroupDetails(tenantId, empId, getGroups);
      const { matchedEmployees } = getHrInfo;
      const newEmpIds = matchedEmployees
        ? matchedEmployees.map((e) => e.empId)
        : [];
      empIds = addUniqueIds(empIds, newEmpIds);
    }

    if (!empNames?.length || isMyView || empNames?.length) {
      await getEmployeeDetails(tenantId, empId);
      const newEmpIds = empNames ? empNames.map((e) => e.empId) : [];
      empIds = addUniqueIds(empIds, newEmpIds);
    }

    if (getDepartments.length) {
      const getEmpIds = await getEmployeeIdsByDepartment(
        tenantId,
        empId,
        department
      );
      console.log("getEmpIds for filterTrips superAdmin", getEmpIds);
      empIds = addUniqueIds(empIds, getEmpIds);
    }

    let filterCriteria = { tenantId };

    if (empIds?.length) {
      filterCriteria["createdBy.empId"] = { $in: empIds };
    } else {
      filterCriteria["createdBy.empId"] = empId;
    }

    if (approvers?.length) {
      filterCriteria["travelExpenseData.approvers.empId"] = {
        $in: approverEmpIds,
      };
    }

    if (filterBy && date && !fromDate && !toDate) {
      if (date) {
        const parsedDate = new Date(date);

        switch (filterBy) {
          case "date":
            filterCriteria["tripCompletionDate"] = {
              $gte: parsedDate,
              $lt: new Date(parsedDate.setDate(parsedDate.getDate() + 1)),
            };
            break;

          case "week":
            const { startOfWeek, endOfWeek } = getWeekRange(parsedDate);
            filterCriteria["tripCompletionDate"] = {
              $gte: startOfWeek,
              $lt: new Date(endOfWeek.setDate(endOfWeek.getDate() + 1)),
            };
            break;

          case "month":
            const { startOfMonth, endOfMonth } = getMonthRange(parsedDate);
            filterCriteria["tripCompletionDate"] = {
              $gte: startOfMonth,
              $lt: new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)),
            };
            break;

          case "quarter":
            const { startOfQuarter, endOfQuarter } =
              getQuarterRange(parsedDate);
            filterCriteria["tripCompletionDate"] = {
              $gte: startOfQuarter,
              $lt: new Date(endOfQuarter.setDate(endOfQuarter.getDate() + 1)),
            };
            break;

          case "year":
            const { startOfYear, endOfYear } = getYear(parsedDate);
            filterCriteria["tripCompletionDate"] = {
              $gte: startOfYear,
              $lt: new Date(endOfYear.setDate(endOfYear.getDate() + 1)),
            };
            break;

          default:
            break;
        }
      }
    }

    if (fromDate && toDate) {
      filterCriteria["tripCompletionDate"] = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    if (travelType) {
      filterCriteria["travelRequestData.travelType"] = travelType;
    }

    if (tripStatus?.length) {
      filterCriteria.tripStatus = { $in: tripStatus };
    }

    if (expenseHeaderStatus?.length) {
      filterCriteria.travelExpenseData = {
        $elemMatch: {
          expenseHeaderStatus: { $in: expenseHeaderStatus },
        },
      };
    }

    // console.log("filterCriteria for mongodb ", JSON.stringify(filterCriteria,'',2))
    if (travelAllocationHeaders) {
      filterCriteria["travelRequestData.travelAllocationHeaders"] = {
        $elemMatch: {
          headerName: {
            $in: travelAllocationHeaders.map((header) => header.headerName),
          },
          headerValue: {
            $in: travelAllocationHeaders.map((header) => header.headerValue),
          },
        },
      };
    }

    if (approvers) {
      filterCriteria["travelRequestData.approvers"] = {
        $elemMatch: {
          name: { $in: approvers.map((approver) => approver.name) },
          empId: { $in: approvers.map((approver) => approver.empId) },
        },
      };
    }

    const tripDocs = await reporting.find(filterCriteria);

    console.log("tripDocs", tripDocs);
    if (tripDocs.length === 0) {
      return res.status(200).json({
        success: false,
        trips: [],
        message: "No trips found matching the filter criteria",
      });
    }

    const getTrips = extractTrip(tripDocs);
    const trips = getTrips.map((trip) => ({
      ...trip,
      groupName: getGroups,
    }));
    return res.status(200).json({ success: true, trips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getExpenseRelatedHrData = async (req, res) => {
  try {
    const { tenantId, tenantName } = req.params;
    const companyDetails = await HRCompany.findOne({ tenantId, tenantName });

    if (!companyDetails) {
      return res.status(404).json({ message: "Company details not found" });
    }

    const defaultCurrency = companyDetails.companyDetails.defaultCurrency;
    const travelAllocations = companyDetails?.travelAllocations;
    const advanceSettlementOptions = companyDetails?.advanceSettlementOptions;
    const expenseSettlementOptions = companyDetails?.expenseSettlementOptions;

    res.status(200).json({
      defaultCurrency,
      travelAllocations,
      advanceSettlementOptions,
      expenseSettlementOptions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { extractTrip, getItinerary, filterTrips, filterTravelExpenses };
