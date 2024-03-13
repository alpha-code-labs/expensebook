import Trip from "../../models/tripSchema.js";

const createTrip = async (travelRequest) => {
    const { travelRequestData, cashAdvancesData } = travelRequest;
    const { tenantId, tenantName, travelRequestId } = travelRequestData;
  
    const itinerary = travelRequestData?.itinerary ?? {};
  
    // Extract all booking dates
    const bookingDates = Object.values(itinerary).flatMap(bookings => bookings.map(booking => new Date(booking.bkd_date)));
  
    // Find earliest and latest date and time
    const earliestDateTime = new Date(Math.min(...bookingDates));
    const lastDateTime = new Date(Math.max(...bookingDates));
  
    return {
      tenantId,
      tenantName,
      travelRequestId,
      tripStartDate: earliestDateTime,
      tripCompletionDate: lastDateTime,
      travelRequestData,
      cashAdvancesData
    };
  };
  
  
  const updateOrCreateTrip = async (trip) => {
    const { tenantId, tenantName, travelRequestId, tripStartDate, tripCompletionDate, travelRequestData, cashAdvancesData } = trip;
    const { isCashAdvanceTaken } = travelRequestData;
  
    try {
      let updateFields = {
        tripStartDate,
        tripCompletionDate,
        travelRequestData,
      };
  
      // Conditionally update the cashAdvancesData field based on isCashAdvanceTaken
      if (isCashAdvanceTaken) {
        updateFields.cashAdvancesData = cashAdvancesData;
      } else {
        updateFields.cashAdvancesData = [];
      }
  
      const updatedTrip = await Trip.findOneAndUpdate(
        {
          tenantId,
          tenantName,
          "travelRequestData.travelRequestId": travelRequestId,
        },
        updateFields,
        {
          upsert: true,
          new: true,
        }
      );
  
      console.log('Trip updated/created successfully:', updatedTrip);
      return updatedTrip; 
    } catch (error) {
      console.error('Error updating/creating trip:', error);
      throw error;
    }
  };
  
  
  export const processTravelRequestsWithCash = async (tripArray) => {
    console.log("from travel", tripArray)
    if (tripArray.length === 0) {
      return [];
    }
  
    const resultData = await Promise.all(tripArray.map(async (travelRequest) => {
      try {
        const trip = await createTrip(travelRequest);
        return trip;
      } catch (error) {
        console.error('Error creating trip:', error);
        throw error;
      }
    }));
  
    await Promise.all(resultData.map(async (trip) => {
      try {
        const tripsAdded = await updateOrCreateTrip(trip);
        if(tripsAdded){
          //send to dashboard all newly added trips.
        }
      } catch (error) {
        console.error('Error updating/creating trip:', error);
        throw error;
      }
    }));
  
    return resultData;
  };