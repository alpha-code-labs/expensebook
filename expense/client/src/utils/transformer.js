export const transformedTravel = (tripData) => {
  const flights = tripData.travelRequestData.itinerary.flights || [];
  const buses = tripData.travelRequestData.itinerary.buses || [];
  const trains = tripData.travelRequestData.itinerary.trains || [];
  const hotels = tripData.travelRequestData.itinerary.hotels || [];
  const cabs = tripData.travelRequestData.itinerary.cabs || [];

  const groupedData = {
    flights,
    buses,
    trains,
    hotels,
    cabs,
  };

  const itineraryArray = Object.entries(groupedData)
  .filter(([mode, data]) => data.length > 0)
  .map(([mode]) => mode);

  const transformedData = {
    // tenantId: tripData.tenantId,
    // tenantName: tripData.tenantName,
    // companyName: tripData.companyName,
    // userId: tripData.userId,
    // tripId: tripData.tripId,
    // tripNumber: tripData.tripNumber,
    // tripPurpose: tripData.tripPurpose,
    // tripStatus: tripData.tripStatus,
    // tripStartDate: tripData.tripStartDate,
    // tripCompletionDate: tripData.tripCompletionDate,
    // isSentToExpense: tripData.isSentToExpense,
    // notificationSentToDashboardFlag: tripData.notificationSentToDashboardFlag,
    travelRequestData: {
      tenantId: tripData.travelRequestData.tenantId,
      tenantName: tripData.travelRequestData.tenantName,
      companyName: tripData.travelRequestData.companyName,
      travelRequestId: tripData.travelRequestData.travelRequestId,
      travelRequestNumber: tripData.travelRequestData.travelRequestNumber,
      tripPurpose: tripData.travelRequestData.tripPurpose,
      travelRequestStatus: tripData.travelRequestData.travelRequestStatus,
      travelRequestState: tripData.travelRequestData.travelRequestState,
      createdBy: tripData.travelRequestData.createdBy,
      createdFor: tripData.travelRequestData.createdFor,
      teamMembers: tripData.travelRequestData.teamMembers,
      travelAllocationHeaders: tripData.travelRequestData.travelAllocationHeaders,
      itinerary: groupedData,
      tripType: tripData.travelRequestData.tripType,
      travelDocuments: tripData.travelRequestData.travelDocuments,
      bookings: tripData.travelRequestData.bookings,
      approvers: tripData.travelRequestData.approvers,
      assignedTo: tripData.travelRequestData.assignedTo,
      bookedBy: tripData.travelRequestData.bookedBy,
      recoveredBy: tripData.travelRequestData.recoveredBy,
      preferences: tripData.travelRequestData.preferences,
      travelViolations: tripData.travelRequestData.travelViolations,
      travelRequestDate: tripData.travelRequestData.travelRequestDate,
      travelBookingDate: tripData.travelRequestData.travelBookingDate,
      travelCompletionDate: tripData.travelRequestData.travelCompletionDate,
      cancellationDate: tripData.travelRequestData.cancellationDate,
      travelRequestRejectionReason: tripData.travelRequestData.travelRequestRejectionReason,
      isCancelled: tripData.travelRequestData.isCancelled,
      cancellationReason: tripData.travelRequestData.cancellationReason,
      isCashAdvanceTaken: tripData.travelRequestData.isCashAdvanceTaken,
      sentToTrip: tripData.travelRequestData.sentToTrip,
    },
    cashAdvancesData: tripData.travelRequestData.isCashAdvanceTaken && tripData.cashAdvancesData,
    itineraryArray,
  };

  

  return transformedData
};



// const transformBackendDataToFrontend = (backendData) => {
//   const { travelRequestData, cashAdvancesData } = backendData;

//   // Transform travel request data
//   const {
//     travelRequestNumber,
//     travelRequestId,
//     travelRequestDate,
//     travelRequestStatus,
//     itinerary,
//     approvers,
//     bookedBy,
//     assignedTo,
//     recoveredBy,
//     isAddALeg,
//     travelDocuments,
//     bookings,
//     tripType,
//     preferences,
//     travelViolations,
//     travelRequestRejectionReason,
//     isCancelled,
//     cancellationReason,
//     isCashAdvanceTaken,
//     sentToTrip,
//   } = travelRequestData;

//   const transformedTravelRequestData = {
//     travelRequestNumber,
//     travelRequestId,
//     travelRequestDate,
//     travelRequestStatus,
//     itinerary,
//     approvers,
//     bookedBy,
//     assignedTo,
//     recoveredBy,
//     isAddALeg,
//     travelDocuments,
//     bookings,
//     tripType,
//     preferences,
//     travelViolations,
//     travelRequestRejectionReason,
//     isCancelled,
//     cancellationReason,
//     isCashAdvanceTaken,
//     sentToTrip,
//   };

//   // Transform cash advances data only if isCashAdvanceTaken is true
//   const transformedCashAdvancesData = isCashAdvanceTaken
//     ? cashAdvancesData.map((cashAdvance) => {
//         const {
//           cashAdvanceNumber,
//           cashAdvanceId,
//           cashAdvanceStatus,
//           cashAdvanceRequestDate,
//           cashAdvanceApprovalDate,
//           cashAdvanceSettlementDate,
//           cashAdvanceViolations,
//           cashAdvanceRejectionReason,
//           amountDetails,
//           approvers,
//           assignedTo,
//           paidBy,
//           recoveredBy,
//         } = cashAdvance;

//         return {
//           cashAdvanceNumber,
//           cashAdvanceId,
//           cashAdvanceStatus,
//           cashAdvanceRequestDate,
//           cashAdvanceApprovalDate,
//           cashAdvanceSettlementDate,
//           cashAdvanceViolations,
//           cashAdvanceRejectionReason,
//           amountDetails,
//           approvers,
//           assignedTo,
//           paidBy,
//           recoveredBy,
//         };
//       })
//     : [];

//   return {
//     transformedTravelRequestData,
//     transformedCashAdvancesData,
//   };
// };

// export default transformBackendDataToFrontend;

