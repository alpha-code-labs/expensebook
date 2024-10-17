import express from 'express';
import { addBus, addCab, addFlight, addHotel, addTrain } from '../controllers/overviewController.js';

const overview = express.Router();

// Dashboard - overview - add various items to an existing trip
overview.post('/addleg/:tenantId/:tripId/:empId', (req, res) => {
  const { action } = req.body;

  // Input validation for the request body
  if (!action) {
    return res.status(400).json({ error: 'Action is required in the request body.' });
  }

  // Delegate to the appropriate controller function based on the action
  switch (action) {
    case 'addFlight':
      return addFlight(req, res);
    case 'addBus':
      return addBus(req, res);
    case 'addTrain':
      return addTrain(req, res);
    case 'addHotel':
      return addHotel(req, res);
    case 'addCab':
      return addCab(req, res);
    default:
      return res.status(400).json({ error: 'Invalid action in the request body.' });
  }
});

export default overview;





