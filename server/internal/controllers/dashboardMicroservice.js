import Trip  from '../../models/tripSchema.js';

  // Function to update a single trip or create a new one if it doesn't exist
export const updateAddLegToTrip = async (req, res) => {
   try {
        // Fetch the Trip update data from the request body
        const addLegToTrip = req.body;
        console.log('add a leg data received from dashboard ', addLegToTrip);
        
         // Validate the data here
      if (!addLegToTrip.tenantId || !addLegToTrip.itinerary || !addLegToTrip.travelRequestId) {
        return res.status(400).json({ error: 'Bad Request', message: 'Invalid or missing data fields.', data: addLegToTrip });
      }
  
      // Find the document matching specific criteria
      const filter = {
        'tenantId': addLegToTrip.tenantId,
        'tenantName': addLegToTrip.tenantName,
        'companyName': addLegToTrip.companyName,
        'travelRequestId': addLegToTrip.travelRequestId,
      };
  
      // Update the document with the new data
      const update = {
        $set: {
          // Set the fields to be updated
          'tenantId': addLegToTrip.tenantId,
          'tenantName': addLegToTrip.tenantName,
          'companyName': addLegToTrip.companyName,
          'itinerary': addLegToTrip.itinerary,
          'tripStatus': addLegToTrip.tripStatus,
          'tripStartDate': addLegToTrip.tripStartDate,
          'tripCompletionDate': addLegToTrip.tripCompletionDate,
        },
      };
  
    
        // Use the upsert option to create a new document if it doesn't exist
        const options = { upsert: true, new: true };
    
        try {
          // Perform the update
          const updatedTrip = await Trip.findOneAndUpdate(filter, update, options);
          return res.status(200).json({ updatedTrip });
        } catch (error) {
          console.error('Error updating Trip:', error);
          return res.status(500).json({ error: 'Update Failed', message: error.message, data: addLegToTrip });
        }
      } catch (error) {
        console.error('Error updating Trip:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: 'An internal server error occurred.' });
      }
    };
    
    

  