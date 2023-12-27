// import express from 'express';
// import { addBus, addCab, addFlight, addHotel, addTrain } from '../controllers/tripController.js';

// const trip = express.Router();

// // Dashboard - trip - add various items to an existing trip
// trip.post('/addleg/:tenantId/:tripId/:empId', (req, res) => {
//   const { tenantId, tripId, empId } = req.params; // sent as params for add a leg 
//   const { action } = req.body;

//   // Input validation for the request body
//   if (!action) {
//     return res.status(400).json({ error: 'Action is required in the request body.' });
//   }

//   let extendedUrl;
//   // Determine the extended URL based on the action
//   switch (action) {
//     case 'addflight':
//       extendedUrl = '/addflight';
//       break;
//     case 'addbus':
//       extendedUrl = '/addbus';
//       break;
//     case 'addtrain':
//       extendedUrl = '/addtrain';
//       break;
//     case 'addhotel':
//       extendedUrl = '/addhotel';
//       break;
//     case 'addcab':
//       extendedUrl = '/addcab';
//       break;
//     default:
//       return res.status(400).json({ error: 'Invalid action in the request body.' });
//   }

//   const tripBaseUrl = 'http://tripmicroservice.com/api/trip'; // Replace with your actual trip microservice URL
//   const currentTripUrl = `${tripBaseUrl}${extendedUrl}`;

//   // Forward the request to the appropriate controller function in the trip microservice
//   switch (action) {
//     case 'addflight':
//       return addFlight(req, res, currentTripUrl);
//     case 'addbus':
//       return addBus(req, res, currentTripUrl);
//     case 'addtrain':
//       return addTrain(req, res, currentTripUrl);
//     case 'addhotel':
//       return addHotel(req, res, currentTripUrl);
//     case 'addcab':
//       return addCab(req, res, currentTripUrl);
//     default:
//       return res.status(400).json({ error: 'Invalid action in the request body.' });
//   }
// });

// export default trip;
