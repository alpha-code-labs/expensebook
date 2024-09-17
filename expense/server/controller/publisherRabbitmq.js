import { sendToOtherMicroservice } from "../rabbitmq/publisher.js"


async function sendTravelExpenseReport(payload, action, comments) {
  const endpoints = ['dashboard', 'trip', 'reporting'];

  const requests = endpoints.map(endpoint =>
    sendToOtherMicroservice(payload, action, endpoint, comments)
  );

  try {
    await Promise.all(requests);
    console.log('All requests completed successfully.');
  } catch (error) {
    console.error('Error sending requests:', error);
    throw error; 
  }
}




const sendUpdate = async(payload,options) => {
    try{
      const {action,comments, includeTrip=false,includeCash=false, includeNonTravel=false} = options
      const services = ['dashboard']
  
      if(includeTrip){
        services.push('trip','expense')
      }
  
      if(includeCash){
        services.push('cash')
      }
  
      if(includeNonTravel){
        services.push('expense')
      }
  
      console.log("non travel - services", services)
  
      console.log("payload sent for other ms ....",payload)
      const results = await Promise.allSettled([
        services.map(service => sendToOtherMicroservice(payload,action,service,comments))
      ])
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`Service ${index + 1} succeeded with:`, result.value);
        } else {
            console.error(`Service ${index + 1} failed with reason:`, result.reason);
        }
    });
    } catch(error){
      console.error(error)
      throw new Error(error.message)
    }
}

export {sendTravelExpenseReport ,sendUpdate}