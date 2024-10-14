import Trip from "../../models/tripSchema.js";


export const cashStatusUpdatePaid = async(payloadArray)=>{
  try{
    // console.log("cash status update batchJob", JSON.stringify(payloadArray,'',2))
    // console.log("payload length",payloadArray.length)

    const results =[]

    for(const payload of payloadArray){
      const {travelRequestData,cashAdvancesData} = payload
      const {travelRequestId} = travelRequestData
        const updateCashStatus = Trip.findOneAndUpdate(
          { 'travelRequestData.travelRequestId':travelRequestId},
          { $set:{ 'cashAdvancesData':cashAdvancesData}},
          {new: true}
        );

        if(!updateCashStatus){
          console.log("updateCashStatus",updateCashStatus)
          results.push({
            travelRequestId,
            success:false,
            message:'failed to update cash'
          })
        } else {
          console.log("updateCashStatus",updateCashStatus)
          results.push({
            travelRequestId,
            success:true,
            message:'cash'
          })
        }
    }

    console.log("updateCashStatus", JSON.stringify(updateCashStatus,'',2))
    return {success: true, error: null, message: 'cash status updated successfully'}

  } catch(error){
    console.log("error", error)
    return { success:false, error:error.message}
  }
}

//priority cash update-
/**
 * 
 * important - set 'isCashAdvanceTaken': true , in travelRequestData , when updating cashAdvanceData
 */
export const partialCashUpdate = async (payload) => {
    try {
        console.log
    const updated = await Trip.updateOne(
      { 'tenantId': payload.tenantId,
        'travelRequestData.travelRequestId':payload.travelRequestId},
      {
        $set: {
          'travelRequestData.isCashAdvanceTaken':true ,
          }  
      },
      {
       $push: {
       'cashAdvancesData': payload 
     }
      },
      { upsert: true, new: true }
    );
    console.log(' cashAdvanceData updated in trip microservice: using async queue', updated);
    return { success: true, error: null}
  } catch (error) {
    console.error('travelRequestData -update in trip microservice: using async queue', error);
    return { success: false, error: error}
  }
}

export const cashStatusUpdate = async(payload) => {
    try{
        const updated = await Trip.updateOne(
            { 'tenantId': payload.tenantId,
             'travelRequestData.travelRequestId':payload.travelRequestId},
          {
            $set: {
              'travelRequestData.isCashAdvanceTaken':true ,
              }  
          },
          {
           $push: {
           'cashAdvancesData': payload 
         }
          },
          { upsert: true, new: true }
        );
        console.log(' cashAdvanceData updated in trip microservice: using async queue', updated);
        return { success: true, error: null}
      } catch (error) {
        console.error('travelRequestData -update in trip microservice: using async queue', error);
        return { success: false, error: error}
      }
}

// cash status- cancel cash
export const updateCashStatus = async (payload) => {
    try {
      const updated = await Trip.findOneAndUpdate(
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
  
      console.log('Travel request status updated in Trip microservice:', updated);
      return { success: true, error: null };
    } catch (error) {
      console.error('Failed to update travel request status in Trip microservice:', error);
      return { success: false, error: error };
    }
};








