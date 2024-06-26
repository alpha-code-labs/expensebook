import {
  calender_icon,
  clock_icon,
  biderectional_arrows_icon as double_arrow,
  location_icon,
} from "../assets/icon";
import {closestCorners, DndContext} from '@dnd-kit/core';
import {useSortable, SortableContext, verticalListSortingStrategy, arrayMove} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import { material_flight_black_icon, material_train_black_icon, material_bus_black_icon, material_cab_black_icon, material_car_rental_black_icon, material_hotel_black_icon, material_personal_black_icon } from "../assets/icon";
import { titleCase } from "../utils/handyFunctions";
import { useState } from "react";



const itinerary_ = [
    {
        "itineraryId": {
            "$oid": "66795e09b2e14ac28c9ed0c2"
        },
        "formId": "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784f",
        "sequence": {
            "$numberInt": "2"
        },
        "from": "Delhi",
        "to": "Lucknow",
        "date": "12-16-14",
        "returnDate": null,
        "time": null,
        "returnTime": null,
        "travelClass": null,
        "isReturnTravel": false,
        "violations": {
            "class": null,
            "amount": null
        },
        "approvers": [
            {
                "empId": "1002",
                "name": "Emma Thompson",
                "status": "pending approval",
                "_id": {
                    "$oid": "66795e09b2e14ac28c9ed0ba"
                }
            }
        ],
        "bkd_from": null,
        "bkd_to": null,
        "bkd_date": null,
        "bkd_returnDate": null,
        "bkd_time": null,
        "bkd_returnTime": null,
        "bkd_travelClass": null,
        "bkd_violations": {
            "class": null,
            "amount": null
        },
        "modified": false,
        "cancellationDate": null,
        "cancellationReason": null,
        "rejectionReason": null,
        "status": "pending approval",
        "bookingDetails": {
            "docURL": null,
            "docType": null,
            "billDetails": {
                "vendorName": null,
                "taxAmount": null,
                "totalAmount": null
            }
        },
        "_id": {
            "$oid": "66795e09b2e14ac28c9ed0b9"
        },

        "category" : 'flight'
    },

    {
        "category" : 'flight',
        "itineraryId": {
            "$oid": "66795e09b2e14ac28c9ed0c2"
        },
        "formId": "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784j",
        "sequence": {
            "$numberInt": "2"
        },
        "from": "Delhi",
        "to": "Lucknow",
        "date": "12-24-14",
        "returnDate": null,
        "time": null,
        "returnTime": null,
        "travelClass": null,
        "isReturnTravel": false,
        "violations": {
            "class": null,
            "amount": null
        },
        "approvers": [
            {
                "empId": "1002",
                "name": "Emma Thompson",
                "status": "pending approval",
                "_id": {
                    "$oid": "66795e09b2e14ac28c9ed0ba"
                }
            }
        ],
        "bkd_from": null,
        "bkd_to": null,
        "bkd_date": null,
        "bkd_returnDate": null,
        "bkd_time": null,
        "bkd_returnTime": null,
        "bkd_travelClass": null,
        "bkd_violations": {
            "class": null,
            "amount": null
        },
        "modified": false,
        "cancellationDate": null,
        "cancellationReason": null,
        "rejectionReason": null,
        "status": "pending approval",
        "bookingDetails": {
            "docURL": null,
            "docType": null,
            "billDetails": {
                "vendorName": null,
                "taxAmount": null,
                "totalAmount": null
            }
        },
        "_id": {
            "$oid": "66795e09b2e14ac28c9ed0b9"
        }
    },

    {
        "category" : 'flight',
        "itineraryId": {
            "$oid": "66795e09b2e14ac28c9ed0c2"
        },
        "formId": "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784k",
        "sequence": {
            "$numberInt": "2"
        },
        "from": "Delhi",
        "to": "Lucknow",
        "date": '"12-25-14"',
        "returnDate": null,
        "time": null,
        "returnTime": null,
        "travelClass": null,
        "isReturnTravel": false,
        "violations": {
            "class": null,
            "amount": null
        },
        "approvers": [
            {
                "empId": "1002",
                "name": "Emma Thompson",
                "status": "pending approval",
                "_id": {
                    "$oid": "66795e09b2e14ac28c9ed0ba"
                }
            }
        ],
        "bkd_from": null,
        "bkd_to": null,
        "bkd_date": null,
        "bkd_returnDate": null,
        "bkd_time": null,
        "bkd_returnTime": null,
        "bkd_travelClass": null,
        "bkd_violations": {
            "class": null,
            "amount": null
        },
        "modified": false,
        "cancellationDate": null,
        "cancellationReason": null,
        "rejectionReason": null,
        "status": "pending approval",
        "bookingDetails": {
            "docURL": null,
            "docType": null,
            "billDetails": {
                "vendorName": null,
                "taxAmount": null,
                "totalAmount": null
            }
        },
        "_id": {
            "$oid": "66795e09b2e14ac28c9ed0b9"
        }
    },
]



export default function () {

    const handleDragEnd = (event)=>{
        console.log('drag end called');
        const {active, over} = event;

        setItinerary(items=>{
            const activeIndex = items.findIndex(item=>item.formId == active.id) //items.indexOf(active.id);
            const overIndex = items.findIndex(item => item.formId == active.id);

            return arrayMove(items, activeIndex, overIndex);
        })
    
        console.log(active.id, 'active, over ', over.id);
    }

    const [itinerary, setItinerary] = useState(itinerary_);

    // const combinedItinerary = [
    //     ...itinerary.flights?.map((flight, index)=>{
    //         return({
    //             sequence:flight.sequence,
    //             element: <div key={flight.sequence}>
    
    //             <div className='flex flex-col gap-2 mt-2'>
    //             {<>
    //                 <FlightCard
    //                     id={index} 
    //                     from={flight.from} 
    //                     to={flight.to} 
    //                     date={flight.date}
    //                     returnDate={flight.returnDate}
    //                     returnTime={flight.returnTime}
    //                     travelClass={flight.travelClass} 
    //                     mode={'Flight'}
    //                     time={flight.time}/>
    //                 {/* {(flight.return?.date??false) && 
    //                     <FlightCard 
    //                         id={index}
    //                         from={flight.to} 
    //                         to={flight.from} 
    //                         date={flight.returnDate}
    //                         travelClass={'N/A'} 
    //                         mode={'flight'} 
    //                         time={flight.returnTime }/>
    //                 } */}
    //              </>}
    //             </div>
    //         </div>
    //         }) 
    //      }),   
    
    //      ...itinerary.trains?.map((train, index)=>{
    //         return({
    //             sequence: train.sequence,
    //             element: <div key={index}>
    
    //             <div className='flex flex-col gap-2 mt-2'>
    //             {<>
    //                 <FlightCard
    //                     id={train.sequence} 
    //                     from={train.from} 
    //                     to={train.to} 
    //                     date={train.date}
    //                     travelClass={train.travelClass} 
    //                     mode={'Train'}
    //                     time={train.time}/>
    //              </>}
    //             </div>
    //         </div>
    //         }) 
    //      }),
    
    //      ...itinerary.buses?.map((bus, index)=>{
    //         return({
    //             sequence:bus.sequence,
    //             element: <div key={bus.sequence}>
    
    //             <div className='flex flex-col gap-2 mt-2'>
    //             {<>
    //                 <FlightCard
    //                     id={index} 
    //                     from={bus.from} 
    //                     to={bus.to} 
    //                     date={bus.date}
    //                     travelClass={bus.travelClass} 
    //                     mode={'Bus'}
    //                     time={bus.time}/>
    //              </>}
    //             </div>
    //         </div>
    //         }) 
    //      }),
    
    //      ...itinerary.cabs?.map((cab, index)=>{
    //         return({
    //             sequence: cab.sequence,
    //             element: <div key={cab.sequence}>
             
    //             <div className='flex flex-col gap-2 mt-2'>
    //             {<>
    //                 <CabCard
    //                     id={index} 
    //                     from={cab.pickupAddress} 
    //                     to={cab.dropAddress} 
    //                     date={cab.date}
    //                     travelClass={cab.travelClass} 
    //                     mode={'Cab'}
    //                     time={cab.time}/>
    //              </>}
    //             </div>
    //         </div>
    //         }) 
    //      }),
    
    //      ...itinerary.hotels?.map((hotel, index)=>{
    //         return({
    //             sequence: hotel.sequence,
    //             element: <div key={hotel.sequence}>
             
    //             <div className='flex flex-col gap-2 mt-2'>
    //             {<>
    //                 <HotelCard
    //                     id={index} 
    //                     checkIn={hotel.checkIn} 
    //                     checkOut={hotel.checkOut} 
    //                     location={hotel.location}
    //                     time={hotel.preferredTime}/>
    //              </>}
    //             </div>
    //         </div>
    //         }) 
    //      })
    // ]

    
    // console.log(combinedItinerary.sort((a,b)=>a.sequence-b.sequence));

    return(<>

        {/* {combinedItinerary.sort((a,b)=>a.sequence-b.sequence).map(itm=>itm.element)} */}

        <DndContext 
             onDragEnd={handleDragEnd}
             collisionDetection={closestCorners}>
            <div className='p-4 w-[700px] flex flex-col gap-4 border border-gray-500 m-4 rounded-md'>
                <SortableContext  
                    strategy={verticalListSortingStrategy}
                    items={itinerary}>
                    {itinerary.map((item, index)=>{
                        if(item.category == 'flight'){
                            return (
                            <SortableItem id={item.formId} key={item.formId} >
                                <FlightCard
                                    id={index} 
                                    from={item.from} 
                                    to={item.to} 
                                    date={item.date}
                                    returnDate={item.returnDate}
                                    returnTime={item.returnTime}
                                    travelClass={item.travelClass} 
                                    mode={'Flight'}
                                    time={item.time}/>
                            </SortableItem>
                            )
                        }    
                    })}
                </SortableContext>
            </div>
        </DndContext>
        

    </>)
}

function FlightCard({from, to, date, returnDate, time, returnTime, travelClass, onClick, mode='Flight'}){
  return(
      <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
      <div className="flex flex-col justify-center">
        <img src={spitImageSource(mode)} className='w-4 h-4 md:w-6 md:h-6' />
      </div>
      <div className="w-full flex sm:block">
            <div className="mx-2 text-sm w-full flex gap-1 flex-col lg:flex-row lg:justify-between lg:items-center">
                <div className='flex items-center gap-1 lg:justify-center flex-1'>
                    <div className="text-lg semibold">
                        {titleCase(from)}     
                    </div>
                    <img src={double_arrow} className="w-5"/>
                    <div className="text-lg semibold">
                        {titleCase(to)}     
                    </div>
                </div>
                <div className="flex-1 justify-center">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Departure Date</p>
                    <div className="flex items-center gap-1">
                        <img src={calender_icon} className='w-4'/>
                        <p>{isoString(date)}</p>
                    </div>
                </div>
                {returnDate!=null && returnDate != undefined && 
                <div className="flex-1 justify-center">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Return Date</p>
                    <div className="flex items-center gap-1">
                        <img src={calender_icon} className='w-4'/>
                        <p>{isoString(returnDate)}</p>
                    </div>
                </div>
                }

                <div className="flex-1 justify-center">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Prefferred Time</p>
                    <div className='flex items-center gap-1'>
                        <img src={clock_icon} className='w-4'/>
                        <p>{formattedTime(time)??'--:--'}</p>    
                    </div>
                </div>
              

                {returnTime!=null && 
                <div className="flex-1 justify-center">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Retrun Time</p>
                    <div className='flex items-center gap-1'>
                        <img src={clock_icon} className='w-4'/>
                        <p>{formattedTime(returnTime)??'--:--'}</p>    
                    </div>
                </div>
                }

            </div>
        </div>
      
  </div>)
}

function CabCard({from, to, date, time, travelClass, onClick, mode, isTransfer=false}){
  return(
      <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
      <div className='font-semibold text-base text-neutral-600'>
      <img src={spitImageSource(mode)} className='w-4 h-4 md:w-6 md:h-6' />
      </div>
      <div className="w-full flex sm:block">
          
          <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
              <div className="flex-1 justify-center">
                 <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Pickup Location</p>
                  <div className="flex items-center gap-1">
                    <img src={location_icon} className="w-4 h-4"/>
                    <p className="whitespace-wrap">{from??'not provided'}</p>
                  </div>     
              </div>
              <div className="flex-1 justify-center">
                  <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Drop Location</p>
                  <div className="flex items-center gap-1">
                    <img src={location_icon} className="w-4 h-4"/>
                    <p className="whitespace-wrap">{to??'not provided'}</p>
                  </div>     
              </div>
              <div className="flex-1 justify-center">
                  <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">{mode} Date</p>
                  <div className="flex items-center gap-1">
                    <img src={calender_icon} className="w-4 h-4"/>
                    <p className="whitespace-wrap">{isoString(date)??'not provided'}</p>
                  </div>
              </div>
              <div className="flex-1 justify-center">
                  <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Prefferred Time</p>
                  <div className="flex items-center gap-1">
                    <img src={clock_icon} className="w-4 h-4"/>
                    <p className="whitespace-wrap">{formattedTime(time)??'not provided'}</p>
                  </div>
              </div>
             {!isTransfer && <div className="flex-1 justify-center">
                  {travelClass??'N/A'}
              </div>}
          </div>
      </div>
  </div>)
}

function HotelCard({checkIn, checkOut, location, onClick}){
  return(
      <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
      <img src={material_hotel_black_icon} className="w-4 h-4 md:w-6 md:h-6"/>
      <div className="w-full flex sm:block">
          <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
          <div className="flex-1 justify-center">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">CheckIn Date</p>
                    <div className="flex items-center gap-1">
                        <img src={calender_icon} className='w-4'/>
                        <p>{isoString(checkIn)}</p>
                    </div>
                </div>
                <div className="flex-1 justify-center">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">CheckOut Date</p>
                    <div className="flex items-center gap-1">
                        <img src={calender_icon} className='w-4'/>
                        <p>{isoString(checkOut)}</p>
                    </div>
                </div>
                <div className='flex-1 justify-center'>
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Location</p>
                    <div className="flex items-center gap-1">
                        <img src={location_icon} className='w-4'/>
                        <p>{location??'not provided'}</p>
                    </div>
                </div>
          </div>
      </div>
  </div>)
}

function spitBoardingPlace(modeOfTransit){
  if(modeOfTransit === 'Flight')
      return 'Airport'
  else if(modeOfTransit === 'Train')
      return 'Railway station'
  else if(modeOfTransit === 'Bus')
      return 'Bus station'
}

function spitImageSource(modeOfTransit){
    if(modeOfTransit === 'Flight')
        return material_flight_black_icon
    else if(modeOfTransit === 'Train')
        return material_train_black_icon
    else if(modeOfTransit === 'Bus')
        return material_bus_black_icon
    else if(modeOfTransit === 'Cab')
        return material_cab_black_icon
    else if(modeOfTransit === 'Cab Rentals')
        return material_car_rental_black_icon
    else if(modeOfTransit === 'Personal Vehicle')
        return material_personal_black_icon
}

function isoString(dateString){
    console.log('receivedDate', dateString)
    if(dateString==null || dateString == undefined) return ''
    // Convert string to Date object
    const dateObject = new Date(dateString);
    // Convert Date object back to ISO string
    const isoDateString = dateObject.toDateString();
    console.log(isoDateString);
    return isoDateString
}

function formattedTime(timeValue){
    try{
        if(timeValue == null || timeValue == undefined) return timeValue
        const hours = timeValue.split(':')[0]>=12? timeValue.split(':')[0]-12 : timeValue.split(':')[0]
        const minutes = timeValue.split(':')[1]
        const suffix = timeValue.split(':')[0]>=12? 'PM' : 'AM'

        return `${hours}:${minutes} ${suffix}`
    }
    catch(e){
        return timeValue
    }
}

const SortableItem = ({id, key, children})=>{
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});

    const style={
        transition,
        transform: CSS.Transform.toString(transform)
    }
    
    return(<>
        <div ref={setNodeRef} {...attributes} {...listeners} style={style} key={key} >
            <div className=''>
                {children}
            </div>
        </div>
    </>)
}
 