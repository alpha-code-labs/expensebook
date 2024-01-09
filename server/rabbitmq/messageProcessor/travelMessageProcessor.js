// Process travel request
//Trip microservice --All trip updates --- asynchronous rabbitmq route --- 
export const processTravelRequest = async (message) => {
      const {
        tenantId,
        tenantName,
        companyName,
        // tripId,
        // tripNumber,
        tripPurpose,
        tripStatus,
        tripStartDate,
        tripCompletionDate,
        travelRequestData,
      } = message.travel;
  
      try {
      const updated = await dashboard.findOneAndUpdate(
        { 'tripId': tripId },
        {
          $set: {
            'tenantId': tenantId ?? undefined,
            'tenantName': tenantName ?? undefined,
            'companyName': companyName ?? undefined,
            // 'tripId': tripId ?? undefined,
            // 'tripNumber': tripNumber ?? undefined,
            // 'tripPurpose': tripPurpose ?? undefined,
            // 'tripStatus': tripStatus ?? undefined,
            // 'tripStartDate': tripStartDate ?? undefined,
            // 'tripCompletionDate': tripCompletionDate ?? undefined,
            'isSentToExpense': isSentToExpense ?? undefined,
            'travelRequestData': travelRequestData ?? undefined,
          },
        },
        { upsert: true, new: true }
      );
      console.log('Saved to dashboard:', updated);
  
    } catch (error) {
      console.error('Failed to update dashboard:', error);
      // Collect failed updates
      failedUpdates.push(trip);
      console.error('Failed to update dashboard:', error);
    }
  
}