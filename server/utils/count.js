// export function extractValidViolations(itinerary){
//     const allBkdViolations = [];

//     Object.keys(itinerary).forEach(key => {
//       const items = itinerary[key];

//       if (Array.isArray(items)) {
//         items.forEach(item => {
//           if (item.status === "booked" && item.bkd_violations) {
//             const { bkd_violations } = item;
//             const { class: classValue, amount } = bkd_violations;

//             // Check if either class or amount is valid
//             if (classValue !== null && classValue !== undefined && classValue !== 0 ||
//                 amount !== null && amount !== undefined && amount !== 0) {
//               allBkdViolations.push({
//                 [key]: [item],
//                 ...bkd_violations
//               });
//             }
//           }
//         });
//       }
//     });

//     const countViolations = (allBkdViolations) => {
//         const counts = {};

//         violationsArray.forEach(violationObj => {
//           Object.keys(violationObj).forEach(key => {
//             if (Array.isArray(violationObj[key])) {
//               const item = violationObj[key][0];
//               const { class: classValue, amount } = item.bkd_violations;
//               counts[key] = (counts[key] || 0) +
//                 (classValue !== null && classValue !== undefined && classValue !== 0 ? 1 : 0) +
//                 (amount !== null && amount !== undefined && amount !== 0 ? 1 : 0);
//             }
//           });
//         });

//         counts.total = Object.values(counts).reduce((total, count) => total + count, 0);
//         return counts;
//       };

//     return countViolations;
// };

export const extractValidViolations = (itinerary, check) => {
  const allBkdViolations = [];
  Object.keys(itinerary).forEach((key) => {
    const items = itinerary[key];

    if (Array.isArray(items)) {
      items.forEach((item) => {
        const getViolations =
          check == "preApproval" ? item.violations : item.bkd_violations;
        console.log(getViolations);
        if (item.status === "booked" && getViolations) {
          const { bkd_violations } = item;
          const { class: classValue, amount } = bkd_violations;

          // Check if either class or amount is valid
          if (
            (classValue !== null &&
              classValue !== undefined &&
              classValue !== 0) ||
            (amount !== null && amount !== undefined && amount !== 0)
          ) {
            allBkdViolations.push({
              key,
              item,
              bkd_violations,
            });
          }
        }
      });
    }
  });

  return allBkdViolations;
};

// Function to count violations from the extracted valid violations
export const countViolations = (violationsArray) => {
  const counts = {};

  violationsArray.forEach((violationObj) => {
    const { key, bkd_violations } = violationObj;
    const { class: classValue, amount } = bkd_violations;

    counts[key] =
      (counts[key] || 0) +
      (classValue !== null && classValue !== undefined && classValue !== 0
        ? 1
        : 0) +
      (amount !== null && amount !== undefined && amount !== 0 ? 1 : 0);
  });

  counts.total = Object.values(counts).reduce(
    (total, count) => total + count,
    0
  );
  return counts;
};

// approveCashAdvance(tenantId,empId,travelRequestIds,cashReports))

// export const approveCashAdvance = async (tenantId, empId, travelRequestIds,cashReports) => {
//   console.log("Starting cash advance approval process...");
//   try {
//   const approvedStatuses = ['approved', 'booked'];

// const filteredDocs = cashReports.filter(doc =>
//   doc.cashAdvanceSchema?.travelRequestData?.travelRequestStatus &&
//   approvedStatuses.includes(doc.cashAdvanceSchema.travelRequestData.travelRequestStatus)
// );
//     // Extract travelRequestIds from cashReports
//     const allTravelRequestIds = filteredDocs?.map(doc => doc.travelRequestId.toString());

//     // Filter travelRequestIds to get only those that match the travelRequestIds
//     const matchedTravelRequests = travelRequestIds.filter(request =>
//       allTravelRequestIds.includes(request.travelRequestId.toString())
//     );

//     const cashAdvanceIds = matchedTravelRequests.flatMap(request =>
//       request.cashAdvanceData.map(cashAdvance => cashAdvance.cashAdvanceId)
//     );

//     const getReports = await updateCashAdvanceStatus(filteredDocs, cashAdvanceIds, empId);

//     // Construct the payload
//     const payload = {
//       tenantId,
//       getReports,
//     };

//     console.log("Payload successfully for cash raised later:", payload);
//     return { status: 200, json: payload };

//   }catch (error) {
//     console.error('An error occurred while updating approval:', error.message);
//     return { status: 500, json: { error: 'Failed to update approval.', details: error.message } };
//   }
// };
