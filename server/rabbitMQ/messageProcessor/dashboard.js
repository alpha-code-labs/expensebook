import TravelRequest from "../../models/travelRequest.js"
import HRMaster from "../../models/hrMaster.js"

export async function addALeg(payload) {
    try {
        const { travelRequestId, tenantId, itineraryType, itineraryDetails } = payload;

        if (typeof travelRequestId !== 'string' || !Array.isArray(itineraryDetails) || typeof itineraryType !== 'string') {
            throw new Error('Invalid input');
        }

        const travelRequest = await TravelRequest.findOne({travelRequestId }); 
        if (!travelRequest) {
            return { success: false, error: 'Travel Request not found' };
        }

        if (!travelRequest.itinerary[itineraryType]) {
            return { success: false, error: 'Invalid itinerary type' };
        }

        travelRequest.itinerary[itineraryType] = [
            ...travelRequest.itinerary[itineraryType], 
            ...itineraryDetails
        ];

        travelRequest.isAddALeg = true;

        await travelRequest.save();

        return { success: true, error: null };
    } catch (error) {
        console.error('Error adding a leg:', error.message);
        return { success: false, error: error.message };
    }
}

export const addLeg = async (payload) => {
    try {
      if (!payload || typeof payload !== 'object') {
        throw new Error('Invalid payload format.');
      }
  
      const { travelRequestId } = payload;
  
      if (!travelRequestId) {
        throw new Error('Travel Request ID is required.');
      }
  
      const travelRequest = await TravelRequest.findOneAndUpdate(
        { travelRequestId },
        { $set: {...payload } },
      );

      if (!travelRequest) {
        return { success: false, error: 'Travel Request not found' };
      }
  
      return { success: true, message: 'Travel Request updated successfully' };
  
    } catch (err) {
      console.error('Error adding leg:', err.message);
      return { success: false, error: err.message };
    }
  };

export async function updatePreferences(payload /* */){
    try{
        const {tenantId, employeeId, travelPreferences, imageUrl} = payload
        
        const tenant = await HRMaster.findOne({tenantId})
        if(!tenant) return {success: false, error: 'Tenant not found'}
        let employeeData = tenant.employees.filter(emp=> emp.employeeId == employeeId)

        if(employeeData.length > 0){
            employeeData = employeeData[0];
            employeeData.travelPreferences = travelPreferences;
            employeeData.imageUrl = imageUrl;
            tenant.save();
            return {success:true, error:null}
        }

        return {success:false, error: 'Employee not found'}

    }catch(e){
        return {success:false, error:e}
    }
}


export async function updateBookingAdmin(payload){
    try{
        const {travelRequestId, assignedTo} = payload;
        
        const res = await TravelRequest.updateOne({travelRequestId}, {$set: { assignedTo  }}) 
        
        if(res.matchedCount == 0) {
            return {success: false, error: 'Travel Request not found'}
        }

        return {success: true, error: null}

    }catch(e){
        return {success: false, error:e}
    }
}

export async function updateFinanceAdmin(payload){
    try{
        const {travelRequestId, assignedTo} = payload;
        
        const res = await TravelRequest.updateOne({travelRequestId}, {$set: { 'assignedTo' : assignedTo }}) 
        
        if(res.matchedCount == 0) {
            return {success: false, error: 'Travel Request not found'}
        }

        return {success: true, error: null}

    }catch(e){
        return {success: false, error:e}
    }
}

