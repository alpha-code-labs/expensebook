import express from 'express';
import { addBus, addCab, addFlight, addHotel, addTrain } from '../controllers/overviewController.js';

const overview = express.Router();

// Dashboard - overview - add various items to an existing trip
overview.post('/addleg/:tenantId/:tripId/:empId', (req, res) => {
  const { tenantId, tripId, empId } = req.params; // sent as params for add a leg 
  const { action } = req.body;

  // Input validation for the request body
  if (!action) {
    return res.status(400).json({ error: 'Action is required in the request body.' });
  }

  // Delegate to the appropriate controller function based on the action
  switch (action) {
    case 'addflight':
      return addFlight(req, res);
    case 'addbus':
      return addBus(req, res);
    case 'addtrain':
      return addTrain(req, res);
    case 'addhotel':
      return addHotel(req, res);
    case 'addcab':
      return addCab(req, res);
    default:
      return res.status(400).json({ error: 'Invalid action in the request body.' });
  }
});

export default overview;
