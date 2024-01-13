import { Approval } from "../../models/approvalSchema.js";

//travel standalone
export const updateTravel = async (payload) => {
      try {
      const updated = await Approval.updateOne(
        { 'travelRequestData.tenantId': payload.tenantId},
        {
          $set: {
            'tenantId':payload.tenantId,
            'tenantName':payload.tenantName,
            'companyName':payload.companyName,
            'approvalType':'travel',
            'travelRequestData': payload,
            }  
        },
        { upsert: true, new: true }
      );
      console.log('Saved to travelRequestData in approval microservice: using async queue', updated);
      return { success: true, error: null}
    } catch (error) {
      console.error('Failed to update travelRequestData in approval microservice: using synchronous queue', error);
      return { success: false, error: error}
    }
}

//travel standalone - status update
export const updateTravelStatus = async (payload) => {
  try {
  const updated = await Approval.findOneAndUpdate(
    { 'travelRequestData.tenantId': payload.tenantId,
       'travelRequestData.travelRequestId':payload.travelRequestId,},
    {
      $set: {
        'approvalType':'travel',
        'travelRequestData.travelRequestStatus': payload.travelRequestStatus,
        }  
    },
    { upsert: true, new: true }
  );
  console.log('travelRequestData - travel request status update in approval microservice: using async queue', updated);
  return { success: true, error: null}
} catch (error) {
  console.error('Failed to update travelRequestStatus in travelRequestData -update in approval microservice: using async queue', error);
  return { success: false, error: error}
}
}

//travel standalone - cancel travel request
export const cancelTravel = async (payload) => {
  try {
  const updated = await Approval.findOneAndUpdate(
    { 'tenantId': payload.tenantId,
       'travelRequestData.travelRequestId':payload.travelRequestId,},
    {
      $set: {
        
        'travelRequestData.travelRequestStatus': payload.travelRequestStatus,
        }  
    },
    { upsert: true, new: true }
  );
  console.log('travelRequest standalone - travel request is cancelled update in approval microservice: using async queue', updated);
  return { success: true, error: null}
} catch (error) {
  console.error('Failed to update travelRequestStatus in travelRequestData -update in approval microservice: using async queue', error);
  return { success: false, error: error}
}
}

//travel with cash cancel travel and cash
export const cancelTravelWithCash = async (payload) => {
  try {
  const updated = await Approval.findOneAndUpdate(
    { 'travelRequestData.tenantId': payload.tenantId,
      'travelRequestData.travelRequestId':payload.travelRequestId,},
    {
      $set: {
        'travelRequestData.travelRequestStatus': 'cancelled',
        'cashAdvancesData?.$[].cashAdvanceStatus':'cancelled',
        }  
    },
    { upsert: true, new: true }
  );
  console.log('travelRequestData - travel request status update in approval microservice: using async queue', updated);
  return { success: true, error: null}
} catch (error) {
  console.error('Failed to update travelRequestStatus in travelRequestData -update in approval microservice: using async queue', error);
  return { success: false, error: error}
}
}

//travel and cash full update
export const TravelAndCashUpdate = async (payload) => {
  try {
  const updated = await Approval.updateOne(
    { 'tenantId': payload.tenantId,
      'travelRequestId':payload.travelRequestId},
    {
      $set: {
        'travelRequestData': payload.travelRequestData ,
        'cashAdvancesData':payload?.cashAdvancesData ?? [],
        'tenantId':payload.travelRequestData.tenantId,
        'tenantName':payload.travelRequestData.tenantName,
        'companyName':payload.travelRequestData.companyName,
        'travelRequestId':payload.travelRequestData.travelRequestId,
        'approvalType':'travel',
        }  
    },
    { upsert: true, new: true }
  );
  console.log('travelRequestData - travelRequestData and cashAdvanceData in approval microservice: using async queue', updated);
  return { success: true, error: null}
} catch (error) {
  console.error('Failed to update travelRequestStatus in travelRequestData -update in approval microservice: using async queue', error);
  return { success: false, error: error}
}
}

// cash status update
export const updateCashStatus = async (payload) => {
  try {
    const updated = await Approval.findOneAndUpdate(
      { 'tenantId': payload.tenantId, 'cashAdvanceData.travelRequestId': payload.travelRequestId },
      {
        $set: {
          'cashAdvanceData.$[elem].cashAdvancesData.$[inner].cashAdvanceStatus': payload.travelRequestStatus,
        },
      },
      { 
        arrayFilters: [
          { 'elem.travelRequestId': payload.travelRequestId },
          { 'inner.cashAdvanceId': payload.cashAdvanceId }
        ],
        upsert: true,
        new: true
      }
    );

    console.log('Travel request status updated in approval microservice:', updated);
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to update travel request status in approval microservice:', error);
    return { success: false, error: error };
  }
};


//Itinerary added to during trip - came for approval - add it to travelRequestData
export const itineraryAddedToTravelRequest = async (payload) => {
  try {
    const { tenantId, travelRequestId, isAddALeg, itineraryType, itineraryDetails } = payload;

    const updated = await Approval.updateOne(
      {
        'travelRequestData.tenantId': tenantId,
        'travelRequestData.travelRequestId': travelRequestId
      },
      {
        $set: {
          'travelRequestData.isAddALeg': isAddALeg
        },
        $push: {
          [`travelRequestData.itinerary.${itineraryType}`]: {
            $each: itineraryDetails
          }
        }
      },
      { upsert: true, new: true }
    );

    console.log('Saved to travelRequestData in approval microservice: using async queue', updated);
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to update travelRequestData in approval microservice: using synchronous queue', error);
    return { success: false, error: error };
  }
};




