export const transformTripDataForRecover = (tripData) => {
    const flights = tripData.travelRequestData.itinerary.flights.filter(item=>item?.status === 'paid and cancelled') || [];
    const buses = tripData.travelRequestData.itinerary.buses.filter(item=>item?.status === 'paid and cancelled') || [];
    const trains = tripData.travelRequestData.itinerary.trains.filter(item=>item?.status === 'paid and cancelled') || [];
    const hotels = tripData.travelRequestData.itinerary.hotels.filter(item=>item?.status === 'paid and cancelled') || [];
    const cabs = tripData.travelRequestData.itinerary.cabs.filter(item=>item?.status === 'paid and cancelled') || [];
  
    const groupedData = {
      flights,
      buses,
      trains,
      hotels,
      cabs,
    };
  
    const itineraryArray = Object.entries(groupedData)
    .filter(([mode, data]) => data.length > 0)
    .map(([mode]) => mode) || []

    const transformedData = {
      // tenantId: tripData.tenantId,
      // tenantName: tripData.tenantName,
      // companyName: tripData.companyName,
      // userId: tripData.userId,
      // tripId: tripData.tripId,
      tripNumber: tripData.tripNumber,
      // tripPurpose: tripData.tripPurpose,
      tripStatus: tripData.tripStatus,
      tripStartDate: tripData.tripStartDate,
      tripCompletionDate: tripData.tripCompletionDate,
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
      // cashAdvancesData: tripData.cashAdvancesData,
      itineraryArray,
    };


    
  
    return transformedData
  };