//  function TR_backendTransformer(data){

//     const itinerary = data.itinerary

//     let transformedData = {
//         cabs:[],
//         carRentals:[],
//         trains:[],
//         flights:[],
//         buses:[],
//         hotels:[],
//         personalVehicle:[],
//         formState:[]
//     }
    
//     itinerary.forEach((item,index)=>{
//         item.cabs.forEach(cab=>transformedData.cabs.push({...cab, formId:index}))
//         item.hotels.forEach(hotel=>transformedData.hotels.push({...hotel, formId:index}))
//         if(item.modeOfTransit == 'Train'){
//             transformedData.trains.push({...item.departure, formId:index, travelClass:item.travelClass, isReturnTravel:false})
//             if(itinerary.tripType == 'roundTrip'){
//                 transformedData.trains.push({...item.return, formId:index, travelClass:item.travelClass, isReturnTravel:ture})    
//             }
//         }
//         if(item.modeOfTransit == 'Flight'){
//             transformedData.flights.push({...item.departure, formId:index, travelClass:item.travelClass, isReturnTravel:false})
//             if(itinerary.tripType == 'roundTrip'){
//                 transformedData.flights.push({...item.return, formId:index, travelClass:item.travelClass, isReturnTravel:ture})    
//             }
//         }
//         if(item.modeOfTransit == 'Bus'){
//             transformedData.trains.push({...item.departure, formId:index, travelClass:item.travelClass, isReturnTravel:false})
//             if(itinerary.tripType == 'roundTrip'){
//                 transformedData.buses.push({...item.return, formId:index, travelClass:item.travelClass, isReturnTravel:ture})    
//             }
//         }
//         if(item.modeOfTransit == 'Car Rentals'){
//             transformedData.carRentals.push({...item.departure, formId:index, travelClass:item.travelClass, isReturnTravel:false})
//             if(itinerary.tripType == 'roundTrip'){
//                 transformedData.carRentals.push({...item.return, formId:index, travelClass:item.travelClass, isReturnTravel:ture})    
//             }
//         }
//         if(item.modeOfTransit == 'personalVehicle'){
//             transformedData.carRentals.push({...item.departure, formId:index, travelClass:item.travelClass, isReturnTravel:false})
//             if(itinerary.tripType == 'roundTrip'){
//                 transformedData.carRentals.push({...item.return, formId:index, travelClass:item.travelClass, isReturnTravel:ture})    
//             }
//         }

//         transformedData.formState.push({modeOfTransit:item.modeOfTransit, formId:index, travelClass:item.travelClass, needsVisa:item.needsVisa, needsHotel:item.needsHotel, needsCab:item.needsCab, transfers:item.transfers})
//     })
//     console.log(transformedData)

//     return {...data, itinerary:transformedData}
// }

function TR_backendTransformer(data){
    return data
}


//  function TR_frontendTransformer(data) {
//     const itinerary = data.itinerary
//     console.log(itinerary)
//     const newItinerary = itinerary.formState.map((formState, index) => {
//         const item = {
//             from:null,
//             to:null,
//             departure: {},
//             return: {},
//             transfers: {},
//             hotels: [],
//             cabs: [],
//             modeOfTransit: formState.modeOfTransit,
//             travelClass: formState.travelClass,
//             needsVisa: formState.needsVisa,
//             needsHotel: formState.needsHotel,
//             needsCab: formState.needsCab,
//             transfers: formState.transfers
//         };

//         // Copy properties from itinerary arrays based on formId
//         item.cabs = itinerary.cabs.filter(cab => cab.formId == index);
//         item.hotels = itinerary.hotels.filter(hotel => hotel.formId == index);

//         if (formState.modeOfTransit === 'Train') {
//             const trainDeparture = itinerary.trains.find(train => train.formId == index);
//             if(trainDeparture?.isReturnTravel??false) item.return = { ...trainDeparture };
//             else item.departure = { ...trainDeparture };
//             item.from = trainDeparture?.from??''
//             item.to = trainDeparture?.to??''
//         } else if (formState.modeOfTransit === 'Flight') {
//             const flightDeparture = itinerary.flights.find(flight => flight.formId == index);
//             console.log(flightDeparture, itinerary.flights[0].formId, index, 'flight Departure')
//             if(item?.isReturnTravel??false) item.return = { ...flightDeparture };
//             else item.departure = { ...flightDeparture };
//             item.from = flightDeparture?.from??''
//             item.to = flightDeparture?.to??''
            
//         } else if (formState.modeOfTransit === 'Bus') {
//             const busDeparture = itinerary.buses.find(bus => bus.formId == index);
//             if(item?.isReturnTravel??false) item.return = { ...busDeparture };
//             else item.departure = { ...busDeparture };
//             item.from = busDeparture?.from??''
//             item.to = busDeparture?.to??''
//         }

//         console.log(formState.modeOfTransit)
//         return item;
//     });
//     console.log(newItinerary)
//     return {...data, itinerary:newItinerary}
// }

function TR_frontendTransformer(data){
    return(data)
}

export {TR_backendTransformer, TR_frontendTransformer}

