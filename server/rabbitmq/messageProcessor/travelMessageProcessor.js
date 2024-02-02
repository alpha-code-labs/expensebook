import Trip from "../../models/tripSchema.js";

const createTrip = async (travelRequest) => {
  const {travelRequestData } = travelRequest;
  const {tenantId, tenantName, travelRequestId} = travelRequestData
  const itinerary = travelRequestData?.itinerary ?? {};
  let earliestDateTime = null;
  let lastDateTime = null;

  for (const key in itinerary) {
    if (Object.prototype.hasOwnProperty.call(itinerary, key)) {
      const bookings = itinerary[key];

      for (const booking of bookings) {
        const bookingDateTime = new Date(booking.bkd_date);

        // Find earliest date and time
        if (!earliestDateTime || bookingDateTime < earliestDateTime) {
          earliestDateTime = bookingDateTime;
        }

        // Find latest date and time
        if (!lastDateTime || bookingDateTime > lastDateTime) {
          lastDateTime = bookingDateTime;
        }
      }
    }
  }

  return {
    tenantId,
    tenantName,
    travelRequestId,
    tripStartDate: earliestDateTime,
    tripCompletionDate: lastDateTime,
    travelRequestData,
  };
};

const updateOrCreateTrip = async (trip) => {
  const { tenantId, tenantName, travelRequestId, tripStartDate, tripCompletionDate, travelRequestData } = trip;

  try {
    const updatedTrip = await Trip.findOneAndUpdate(
      {
        tenantId,
        tenantName,
        "travelRequestData.travelRequestId": travelRequestId,
      },
      {
        tripStartDate,
        tripCompletionDate,
        travelRequestData,
      },
      {
        upsert: true,
        new: true,
      }
    );

    console.log('Trip updated/created successfully:', updatedTrip);
  } catch (error) {
    console.error('Error updating/creating trip:', error);
    throw error;
  }
};

export const processTravelRequests = async (tripArray) => {
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
      await updateOrCreateTrip(trip);
    } catch (error) {
      console.error('Error updating/creating trip:', error);
      throw error;
    }
  }));

  return resultData;
};



// Usage
try {
  const resultData = await processTravelRequests(req.body.tripArray);
  console.log('Processing completed. Result:', resultData);
} catch (error) {
  console.error('Error processing travel requests:', error);
  // Handle error response or logging as needed for production
}



