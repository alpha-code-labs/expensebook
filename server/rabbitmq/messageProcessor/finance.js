import dashboard from "../../models/dashboardSchema.js";

// Helper function to update cash advance
const updateCashAdvance = async (tenantId, travelRequestId, cashAdvanceId, updateData) => {
  return await dashboard.findOneAndUpdate(
      {
          tenantId,
          travelRequestId,
        $or:[
          {'tripSchema.cashAdvancesData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId } }},
          {'cashAdvanceSchema.cashAdvancesData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId } }}
        ] 
      },
      { $set: updateData },
      { new: true }
  );
};

//settle cashAdvance- 
export const settleCashAdvance = async (payload) => {
  try {
      console.log("settleCashAdvance ------ payload : -----",JSON.stringify(payload, '', 2));
      const { tenantId, travelRequestId, cashAdvanceId, cashAdvanceStatus, paidBy, paidFlag } = payload;

      const trip = await dashboard.findOne({
          tenantId,
          travelRequestId,
          $or: [
              { 'tripSchema.cashAdvancesData': { $elemMatch: { cashAdvanceId } } },
              { 'cashAdvanceSchema.cashAdvancesData': { $elemMatch: { cashAdvanceId } } }
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
          'cashAdvanceSchema.cashAdvancesData.$.cashAdvanceStatus': cashAdvanceStatus,
          'cashAdvanceSchema.cashAdvancesData.$.paidBy': paidBy,
          'cashAdvanceSchema.cashAdvancesData.$.paidFlag': paidFlag
      };

      console.log(JSON.stringify("settleCashAdvance - trip doc ------",trip))
      console.log(JSON.stringify("trip.cashAdvanceSchema.travelRequestData.travelRequestStatus",trip.cashAdvanceSchema.travelRequestData.travelRequestStatus))
      console.log(JSON.stringify("trip.cashAdvanceSchema ",trip.cashAdvanceSchema.cashAdvancesData,'',2 ))
      // Check the travelRequestStatus and update accordingly
      if (trip?.cashAdvanceSchema && trip?.cashAdvanceSchema?.travelRequestData?.travelRequestStatus === 'booked') {
        await updateCashAdvance(tenantId, travelRequestId, cashAdvanceId, updateData);
      } else {
        await updateCashAdvance(tenantId, travelRequestId, cashAdvanceId, {
              'cashAdvanceSchema.cashAdvancesData.$.cashAdvanceStatus': cashAdvanceStatus,
              'cashAdvanceSchema.cashAdvancesData.$.paidBy': paidBy,
              'cashAdvanceSchema.cashAdvancesData.$.paidFlag': paidFlag
          });
      }

      const getTrip = await dashboard.findOne({
        tenantId,
        travelRequestId,
    });

    console.log("gotYou",JSON.stringify(getTrip.cashAdvanceSchema.cashAdvancesData,'',2))

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
              { 'cashAdvanceSchema.cashAdvancesData': { $elemMatch: { 'cashAdvanceId': cashAdvanceId } } }
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
          'cashAdvanceSchema.cashAdvancesData.$.cashAdvanceStatus': cashAdvanceStatus,
          'cashAdvanceSchema.cashAdvancesData.$.recoveredBy': recoveredBy,
          'cashAdvanceSchema.cashAdvancesData.$.recoveredFlag': recoveredFlag
      };

      // Check the travelRequestStatus and update accordingly
      if (trip.cashAdvanceSchema && trip.cashAdvanceSchema.travelRequestData.travelRequestStatus === 'booked') {
          const updatedTrip = await updateCashAdvance(tenantId, travelRequestId, cashAdvanceId, updateData);
          console.log('Travel request status updated in approval microservice:', updatedTrip);
      } else {
          const updatedTrip = await updateCashAdvance(tenantId, travelRequestId, cashAdvanceId, {
              'cashAdvanceSchema.cashAdvancesData.$.cashAdvanceStatus': cashAdvanceStatus,
              'cashAdvanceSchema.cashAdvancesData.$.recoveredBy': recoveredBy,
              'cashAdvanceSchema.cashAdvancesData.$.recoveredFlag': recoveredFlag
          });
          console.log('Cash advance status updated in approval microservice:', updatedTrip);
      }

      return { success: true, error: null };
  } catch (error) {
      console.error('Failed to update travel request status in approval microservice:', error);
      return { success: false, error: error };
  }
};

