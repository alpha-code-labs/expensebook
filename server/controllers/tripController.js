import { Trip } from '../models/tripSchema.js';
import { extractAndCompareData } from '../scheduler/extractAndCompareData.js';

export const createTrip = async (req, res) => {
  try {
    // Fetch and process data
    const processedData = await extractAndCompareData();

    // Create an array to hold the new Trip instances
    const newTrips = [];

    // Iterate through unique travel requests
    for (const travelRequestId of processedData.uniqueTravelRequests) {
      const travelRequestData = processedData.travelRequestMap.get(travelRequestId);
      const cashAdvanceData = processedData.cashAdvanceMap.get(travelRequestId);

      // Create a new Trip instance
      const newTrip = new Trip({
        tenantId: travelRequestData.tenantId,
        userId: travelRequestData.createdBy,
        tripName: travelRequestData.travelName,
        tripStatus: 'upcoming',
        tripStartDate: travelRequestData.travelBookingDate,
        tripCompletionDate: travelRequestData.travelCompletionDate,
        notificationSentToDashboardFlag: false,
        embeddedTravelRequest: travelRequestData,
        embeddedCashAdvance: cashAdvanceData,
      });

      newTrips.push(newTrip);
    }

    if (newTrips.length === 0) {
      // No new trips to create, return an appropriate response
      return res.status(204).send(); // 204 No Content
    }

    // Save all new trips to MongoDB
    const savedTrips = await Trip.insertMany(newTrips);

    // Return a success response with the created trips
    return res.status(201).json(savedTrips);
  } catch (error) {
    console.error('Error creating trips:', error);

    // Handle specific error types and provide meaningful responses
    if (error instanceof SyntaxError) {
      return res.status(400).json({ error: 'Bad Request', code: 'BAD_REQUEST', message: 'Invalid request syntax.' });
    } else if (error.name === 'ValidationError') {
      return res.status(422).json({ error: 'Validation Error', code: 'VALIDATION_ERROR', message: 'Data validation failed.', details: error.details });
    } else if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(409).json({ error: 'Conflict', code: 'CONFLICT', message: 'Duplicate data detected.' });
    } else if (error.message === 'No upcoming trips to create') {
      return res.status(404).json({ error: 'Not Found', code: 'NOT_FOUND', message: 'No upcoming trips to create.' });
    }

    // For unhandled errors, provide a generic error response
    return res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_SERVER_ERROR', message: 'An internal server error occurred.' });
  }
};



// import { Trip } from '../models/tripSchema.js';
// import { extractAndCompareData } from '../scheduler/extractAndCompareData.js';

// export const createTrip = async (req, res) => {
//   try {
//     // Fetch and process data
//     const processedData = await extractAndCompareData();

//     // Create an array to hold the new Trip instances
//     const newTrips = [];

//     // Iterate through unique travel requests
//     for (const travelRequestId of processedData.uniqueTravelRequests) {
//       const travelRequestData = processedData.travelRequestMap.get(travelRequestId);
//       const cashAdvanceData = processedData.cashAdvanceMap.get(travelRequestId);

//       // Create a new Trip instance with dynamic field mapping
//       const newTrip = new Trip({
//         tenantId: travelRequestData.tenantId,
//         userId: travelRequestData.createdBy,
//         tripStatus: 'upcoming',
//         tripStartDate: travelRequestData.travelBookingDate,
//         tripCompletionDate: travelRequestData.travelCompletionDate,
//         notificationSentToDashboardFlag: false,
//         embeddedTravelRequest: travelRequestData,
//         embeddedCashAdvance: cashAdvanceData,
//       });

//       newTrips.push(newTrip);
//     }

//     if (newTrips.length === 0) {
//       // No new trips to create, return an appropriate response
//       return res.status(204).send(); // 204 No Content
//     }

//     // Save all new trips to MongoDB
//     const savedTrips = await Trip.insertMany(newTrips);

//     // Return a success response with the created trips
//     res.status(201).json(savedTrips);
//   } catch (error) {
//     console.error('Error creating trips:', error);

//     // Handle specific error types and provide meaningful responses
//     if (error instanceof SyntaxError) {
//       return res.status(400).json({ error: 'Bad Request' });
//     } else if (error.name === 'ValidationError') {
//       return res.status(422).json({ error: 'Validation Error', details: error.details });
//     }

//     // For unhandled errors, provide a generic error response
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
































// import { Trip } from '../models/tripSchema.js';
// import { extractAndCompareData } from '../scheduler/extractAndCompareData.js';

// export const createTrip = async (req, res) => {
//   try {
//     // Fetch and process data
//     const processedData = await extractAndCompareData();
//     // console.log(processedData);

//     // Create an array to hold the new Trip instances
//     const newTrips = [];

//     // Iterate through unique travel requests
//     for (const travelRequestId of processedData.uniqueTravelRequests) {
//       const travelRequestData = processedData.travelRequestMap.get(travelRequestId);
//       const cashAdvanceData = processedData.cashAdvanceMap.get(travelRequestId);

//       // Create a new Trip instance with dynamic field mapping
//       const newTrip = new Trip({
//         tenantId: travelRequestData.tenantId,
//         userId: travelRequestData.createdBy,
//         tripStatus: 'upcoming',
//         tripStartDate: travelRequestData.travelBookingDate,
//         tripCompletionDate: travelRequestData.travelCompletionDate,
//         notificationSentToDashboardFlag: false,
//         embeddedTravelRequest: travelRequestData,
//         embeddedCashAdvance: cashAdvanceData,
//       });
 
//       newTrips.push(newTrip);
//     }

//     // Save all new trips to MongoDB
//     const savedTrips = await Trip.insertMany(newTrips);
//     res.status(201).json(savedTrips);
//   } catch (error) {
//     console.error('Error creating trips:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
