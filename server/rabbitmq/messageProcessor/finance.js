import dashboard from "../../models/dashboardSchema.js";

// Helper function to update cash advance
const updateCashAdvance = async (tenantId, travelRequestId, cashAdvanceId, updateData) => {
  return await dashboard.findOneAndUpdate(
      {
          tenantId,
          travelRequestId,
          'tripSchema.cashAdvancesData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId } }
      },
      { $set: updateData },
      { new: true }
  );
};

//settle cashAdvance- 
export const settleCashAdvance = async (payload) => {
  try {
      console.log(JSON.stringify(payload, '', 2));
      const { tenantId, travelRequestId, cashAdvanceId, cashAdvanceStatus, paidBy, paidFlag } = payload;

      const trip = await dashboard.findOne({
          tenantId,
          travelRequestId,
          $or: [
              { 'tripSchema.cashAdvancesData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId } } },
              { 'cashAdvanceSchema.cashAdvanceData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId } } }
          ]
      });

      if (!trip) {
          console.error('Trip not found');
          return { success: false, error: 'Trip not found' };
      }

      // Prepare update data
      const updateData = {
          'tripSchema.cashAdvancesData.$.cashAdvanceStatus': cashAdvanceStatus,
          'tripSchema.cashAdvancesData.$.paidBy': paidBy,
          'tripSchema.cashAdvancesData.$.paidFlag': paidFlag,
          'cashAdvanceSchema.cashAdvanceData.$.cashAdvanceStatus': cashAdvanceStatus,
          'cashAdvanceSchema.cashAdvanceData.$.paidBy': paidBy,
          'cashAdvanceSchema.cashAdvanceData.$.paidFlag': paidFlag
      };

      // Check the travelRequestStatus and update accordingly
      if (trip.cashAdvanceSchema && trip.cashAdvanceSchema.travelRequestData.travelRequestStatus === 'booked') {
          const updatedTrip = await updateCashAdvance(tenantId, travelRequestId, cashAdvanceId, updateData);
          console.log('Travel request status updated in approval microservice:', updatedTrip);
      } else {
          const updatedTrip = await updateCashAdvance(tenantId, travelRequestId, cashAdvanceId, {
              'cashAdvanceSchema.cashAdvanceData.$.cashAdvanceStatus': cashAdvanceStatus,
              'cashAdvanceSchema.cashAdvanceData.$.paidBy': paidBy,
              'cashAdvanceSchema.cashAdvanceData.$.paidFlag': paidFlag
          });
          console.log('Cash advance status updated in approval microservice:', updatedTrip);
      }

      return { success: true, error: null };
  } catch (error) {
      console.error('Failed to update travel request status in approval microservice:', error);
      return { success: false, error: error };
  }
};

//Recover CashAdvance
export const recoverCashAdvance = async (payload) => {
  try {
      console.log(JSON.stringify(payload, '', 2));
      const { tenantId, travelRequestId, cashAdvanceId, cashAdvanceStatus, recoveredBy, recoveredFlag } = payload;

      const trip = await dashboard.findOne({
          tenantId,
          travelRequestId,
          $or: [
              { 'tripSchema.cashAdvancesData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId } } },
              { 'cashAdvanceSchema.cashAdvanceData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId } } }
          ]
      });

      if (!trip) {
          console.error('Trip not found');
          return { success: false, error: 'Trip not found' };
      }

      // Prepare update data
      const updateData = {
          'tripSchema.cashAdvancesData.$.cashAdvanceStatus': cashAdvanceStatus,
          'tripSchema.cashAdvancesData.$.recoveredBy': recoveredBy,
          'tripSchema.cashAdvancesData.$.recoveredFlag': recoveredFlag,
          'cashAdvanceSchema.cashAdvanceData.$.cashAdvanceStatus': cashAdvanceStatus,
          'cashAdvanceSchema.cashAdvanceData.$.recoveredBy': recoveredBy,
          'cashAdvanceSchema.cashAdvanceData.$.recoveredFlag': recoveredFlag
      };

      // Check the travelRequestStatus and update accordingly
      if (trip.cashAdvanceSchema && trip.cashAdvanceSchema.travelRequestData.travelRequestStatus === 'booked') {
          const updatedTrip = await updateCashAdvance(tenantId, travelRequestId, cashAdvanceId, updateData);
          console.log('Travel request status updated in approval microservice:', updatedTrip);
      } else {
          const updatedTrip = await updateCashAdvance(tenantId, travelRequestId, cashAdvanceId, {
              'cashAdvanceSchema.cashAdvanceData.$.cashAdvanceStatus': cashAdvanceStatus,
              'cashAdvanceSchema.cashAdvanceData.$.recoveredBy': recoveredBy,
              'cashAdvanceSchema.cashAdvanceData.$.recoveredFlag': recoveredFlag
          });
          console.log('Cash advance status updated in approval microservice:', updatedTrip);
      }

      return { success: true, error: null };
  } catch (error) {
      console.error('Failed to update travel request status in approval microservice:', error);
      return { success: false, error: error };
  }
};

