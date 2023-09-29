import { Trip } from '../models/tripSchema.js';

export const getTop3TripsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you pass the user ID as a parameter

    // Fetch the top 3 trips related to the user, sorted by tripStartDate in ascending order
    const top3Trips = await Trip.find({
      'userId': userId,
      'tripStatus': { $in: ['upcoming', 'modification', 'transit', 'completed', 'cancelled'] },
    })
    .sort({ tripStartDate: 1 }) // Sort by tripStartDate in ascending order
    .limit(3); // Limit to the top 3 trips

    if (!top3Trips || top3Trips.length === 0) {
      // If no trips are found for the user, return a message and end the request
      return res.status(404).json({ message: 'No trips found for the user.' });
    }

    // Check if there are any trips in "transit" status among the top 3 trips
    const transitTrips = top3Trips.some((trip) => trip.tripStatus === 'transit');

    if (transitTrips) {
      // If there are "transit" trips, show a message and stop the modification process
      return res.status(400).json({ message: 'You are currently In Transit. Please contact your admin for modifications.' });
    }

    // Check if there are any "upcoming" trips among the top 3 trips
    const upcomingTrips = top3Trips.some((trip) => trip.tripStatus === 'upcoming');

    if (upcomingTrips) {
      // If there are "upcoming" trips, check if the first date of travel is less than 10 days from today
      const today = new Date();
      const tenDaysFromToday = new Date(today);
      tenDaysFromToday.setDate(today.getDate() + 10);

      const isWithinTenDays = top3Trips.some((trip) => {
        const firstTravelDate = new Date(trip.tripStartDate);
        return firstTravelDate < tenDaysFromToday;
      });

      if (isWithinTenDays) {
        // Display a message and handle user response here (e.g., show a confirmation dialog)
        // If the user chooses to continue, navigate to the modify trip form
        // If the user cancels, end the process
        // You can implement this logic according to your frontend framework (React, Angular, etc.)
        // For simplicity, I'll return a message here
        return res.status(200).json({ message: 'Your first date of travel is less than 10 days away. Please contact your admin for modifications.' });
      }
    }

    // If no special conditions are met, proceed with modifying the trip
    // Handle the modification logic here

    // For simplicity, I'll return a success message
    res.status(200).json({ message: 'Trip modification is allowed.' });
  } catch (error) {
    console.error('Error fetching trip status:', error);

    // Handle specific error types and provide meaningful responses
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    // For unhandled errors, provide a generic error response
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getTripStatusByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you pass the user ID as a parameter

    // Fetch trips related to the user with upcoming or transit status
    const trips = await Trip.find({
      'userId': userId,
      'tripStatus': { $in: ['upcoming', 'modification', 'transit', 'completed', 'cancelled'] },
    });

    if (!trips || trips.length === 0) {
      // If no trips are found for the user, return a message and end the request
      return res.status(404).json({ message: 'No trips found for the user.' });
    }

    // Check if there are any trips in "transit" status
    const transitTrips = trips.filter((trip) =>
      trip.tripStatus === 'transit'
    );

    if (transitTrips.length > 0) {
      // If there are "transit" trips, show a message and stop the modification process
      return res.status(400).json({ message: 'You are currently In Transit. Please contact your admin for modifications.' });
    }

    // Check if there are any trips in "upcoming" status
    const upcomingTrips = trips.filter((trip) =>
      trip.tripStatus === 'upcoming'
    );

    if (upcomingTrips.length > 0) {
      // If there are "upcoming" trips, check if the first date of travel is less than 10 days from today
      const today = new Date();
      const tenDaysFromToday = new Date(today);
      tenDaysFromToday.setDate(today.getDate() + 10);

      const isWithinTenDays = upcomingTrips.some((trip) => {
        const firstTravelDate = new Date(trip.tripStartDate);
        return firstTravelDate < tenDaysFromToday;
      });

      if (isWithinTenDays) {
        // Display a message and handle user response here (e.g., show a confirmation dialog)
        // If user chooses to continue, navigate to the modify trip form
        // If user cancels, end the process
        // You can implement this logic according to your frontend framework (React, Angular, etc.)
        // For simplicity, I'll return a message here
        return res.status(200).json({ message: 'Your first date of travel is less than 10 days away. Please contact your admin for modifications.' });
      }
    }

    // If no special conditions are met, proceed with modifying the trip
    // Handle the modification logic here

    // For simplicity, I'll return a success message
    res.status(200).json({ message: 'Trip modification is allowed.' });
  } catch (error) {
    console.error('Error fetching trip status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



//Get single trip status
export const getSingleTripStatus = async (req, res) => {
  try {
    const tripId = req.params.tripId; // Extract tripId from URL parameter
    console.log('Received tripId:', tripId);

    // Use the Mongoose model for 'Trip' when calling findTripById
    const trip = await Trip.findById(tripId);

    console.log('Found trip:', trip);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const tripStatus = trip.tripStatus;

    if (isTransit(tripStatus)) {
      return res.status(400).json({ message: 'You are currently in transit. Please contact your admin for modifications.' });
    }

    if (isUpcoming(tripStatus)) {
      const firstTravelDate = new Date(trip.tripStartDate);

      if (isWithinTenDays(firstTravelDate)) {
        return res.status(200).json({ message: 'We detect that your first date of travel is less than 10 days away. We recommend you talk to your business admin/travel person to make the alterations on priority.' });
      }
    }

    res.status(200).json({ message: 'Trip details form opens up for modification.' });
  } catch (error) {
    console.error('Error fetching trip status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Helper Functions
const isTransit = (tripStatus) => {
  return tripStatus === 'transit';
};

const isUpcoming = (tripStatus) => {
  return tripStatus === 'upcoming';
};

const isWithinTenDays = (date) => {
  const today = new Date();
  const tenDaysFromToday = new Date(today);
  tenDaysFromToday.setDate(today.getDate() + 10);
  return date < tenDaysFromToday;
};



















// import { Trip, TravelRequest, CashAdvance } from '../models/tripSchema.js';
  
// //for an individual user
// export const getAllTripStatus = async (req, res) => {
//     try {
//       const userId = req.params.userId; 
  
//       // Fetch trips related to the user with upcoming or transit status
//       const trips = await Trip.find({
//         'users.userId': userId,
//         'users.trips.tripStatus': { $in: ['upcoming', 'transit','completed','cancelled'] },
//       });
  
//       res.status(200).json(trips);
//     } catch (error) {
//       console.error('Error fetching trip details:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };

//   //For a user
//   export const getTripStatus = async (req, res) => {
//     try {
//       const userId = req.params.userId; // Assuming you pass the user ID as a parameter
  
//       // Use the getAllTripStatus controller to fetch trips for the user
//       const trips = await getAllTripStatus(req, res);
  
//       if (!trips || trips.length === 0) {
//         // If no trips are found for the user, return a message and end the request
//         return res.status(404).json({ message: 'No trips found for the user.' });
//       }
  
//       // Check if there are any trips in "transit" status
//       const transitTrips = trips.filter((trip) =>
//         trip.users.some((user) => user.trips.some((t) => t.tripStatus === 'transit'))
//       );
  
//       if (transitTrips.length > 0) {
//         // If there are "transit" trips, show a message and stop the modification process
//         return res.status(400).json({ message: 'You are currently In Transit. Please contact your admin for modifications.' });
//       }
  
//       // Check if there are any trips in "upcoming" status
//       const upcomingTrips = trips.filter((trip) =>
//         trip.users.some((user) => user.trips.some((t) => t.tripStatus === 'upcoming'))
//       );
  
//       if (upcomingTrips.length > 0) {
//         // If there are "upcoming" trips, check if the first date of travel is less than 10 days from today
//         const today = new Date();
//         const tenDaysFromToday = new Date(today);
//         tenDaysFromToday.setDate(today.getDate() + 10);
  
//         const isWithinTenDays = upcomingTrips.some((trip) => {
//           const firstTravelDate = new Date(trip.users[0].trips[0].tripStartDate); // Assuming the trip structure
//           return firstTravelDate < tenDaysFromToday;
//         });
  
//         if (isWithinTenDays) {
//           // Display a message and handle user response here (e.g., show a confirmation dialog)
//           // If user chooses to continue, navigate to the modify trip form
//           // If user cancels, end the process
//           // You can implement this logic according to your frontend framework (React, Angular, etc.)
//           // For simplicity, I'll return a message here
//           return res.status(200).json({ message: 'Your first date of travel is less than 10 days away. Please contact your admin for modifications.' });
//         }
//       }
  
//       // If no special conditions are met, proceed with modifying the trip
//       // Handle the modification logic here
  
//       // For simplicity, I'll return a success message
//       res.status(200).json({ message: 'Trip modification is allowed.' });
//     } catch (error) {
//       console.error('Error fetching trip status:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };
  




































  
// export const getUserTrips = async (req, res) => {
//   try {
//     // Extract user ID from the request
//     const { userId } = req.params;

//     // Fetch all trips linked to the user
//     const userTrips = await Trip.find({
//       'users.userId': userId,
//     }).populate('users.trips.travelRequest');

//     // Process each trip
//     const tripMessages = [];

//     for (const userTrip of userTrips) {
//       for (const user of userTrip.users) {
//         for (const trip of user.trips) {
//           const { travelRequest } = trip;
//           if (trip.tripStatus === 'transit') {
//             // If the trip is in transit, display a message
//             tripMessages.push({
//               message: 'We detect that you are In Transit. We recommend you talk to your business admin/travel person to make the alterations on priority.',
//               tripId: userTrip._id,
//             });
//           } else if (trip.tripStatus === 'upcoming') {
//             // If the trip is upcoming, check if the first date of travel is less than 10 days
//             const today = new Date();
//             const travelStartDate = new Date(travelRequest.itinerary.departureDate);
//             const timeDifference = travelStartDate.getTime() - today.getTime();
//             const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

//             if (daysDifference < 10) {
//               // If less than 10 days, display a message and open a form
//               tripMessages.push({
//                 message: 'We detect that your first date of travel is less than 10 days. We recommend you talk to your business admin/travel person to make the alterations on priority.',
//                 tripId: userTrip._id,
//               });
//             }
//           }
//         }
//       }
//     }

//     // Return the trip messages to the user
//     res.status(200).json(tripMessages);
//   } catch (error) {
//     console.error('Error fetching user trips:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
