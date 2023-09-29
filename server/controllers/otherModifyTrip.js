import { saveTripData, updateApprovalContainer } from '../services/tripService.js';

export const modifyTrip = async (req, res) => {
  try {
    const modifiedTripDetails = req.body;
    const tripId = req.params.tripId;
    
    const today = new Date();
    const tenDaysFromToday = new Date(today);
    tenDaysFromToday.setDate(today.getDate() + 10);

    const firstTravelDate = new Date(modifiedTripDetails.tripStartDate);

    if (firstTravelDate < tenDaysFromToday) {
      return res.status(400).json({
        message: 'We detect that your first date of travel is less than 10 days away. We recommend you talk to your business admin/travel person to make the alterations on priority.',
      });
    }

    const isPolicyEnabled = modifiedTripDetails.isPolicyEnabled;

    if (isPolicyEnabled === 'N') {
      const isApprovalFlowAvailable = modifiedTripDetails.isApprovalFlowAvailable;

      if (isApprovalFlowAvailable === 'Y') {
        const isCashAdvanceAssociated = modifiedTripDetails.isCashAdvanceAssociated;

        if (!isCashAdvanceAssociated) {
          // Save trip data and update approval container
          await saveTripData(modifiedTripDetails, tripId);
          await updateApprovalContainer(modifiedTripDetails);

          return res.status(200).json({ message: 'Trip modification is saved.' });
        }
      }
    }

    // If no special conditions are met, proceed with saving the data
    await saveTripData(modifiedTripDetails, tripId);

    res.status(200).json({ message: 'Trip modification is saved.' });
  } catch (error) {
    console.error('Error modifying trip details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
