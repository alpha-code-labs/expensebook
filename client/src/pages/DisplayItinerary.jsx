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
import { Children, useEffect, useState } from "react";



export default function ({itinerary, setItinerary}) {

    function flattenObjectToArray(obj) {
        return Object.values(obj).reduce((acc, val) => {
          if (Array.isArray(val)) {
            return acc.concat(flattenObjectToArray(val));
          } else {
            return acc.concat(val);
          }
        }, []);
      }

    const handleDragEnd = (event)=>{
        console.log('drag end called');
        const {active, over} = event;

        setFlattendedItinerary(items=>{
            const activeIndex = items.findIndex(item=>item.id == active.id) //items.indexOf(active.id);
            const overIndex = items.findIndex(item => item.id == over.id);

            console.log(activeIndex, overIndex);

            return arrayMove(items, activeIndex, overIndex);
        })
    
        console.log(active.id, 'active, over ', over.id);
    }

    const [flattendItinerary, setFlattendedItinerary] = useState(flattenObjectToArray(itinerary).filter(item=>item.category != null && item.category != undefined).sort((a,b)=> a.sequence - b.sequence))
    console.log('flattened itinerary', flattenObjectToArray(itinerary).filter(item=>item.category != null && item.category != undefined).sort((a,b)=> a.sequence - b.sequence) )

    return(<>
        <DndContext
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}>

            <div className='p-4 w-[800px]'>
                <SortableContext
                    strategy={verticalListSortingStrategy}
                    items={flattendItinerary}>
                    {flattendItinerary.map(item=>{
                        if(item.category == 'flights'){
                            return( 
                            <SortableItem id={item.id} key={item.id}>
                                <FlightCard
                                    id={item.id} 
                                    from={item.from} 
                                    to={item.to} 
                                    date={item.date}
                                    returnDate={item.returnDate}
                                    returnTime={item.returnTime}
                                    travelClass={item.travelClass} 
                                    mode={'Flight'}
                                    time={item.time}/>
                            </SortableItem>)
                        }

                        if(item.category == 'trains'){
                            <SortableItem id={item.id} key={item.id}>
                                <FlightCard
                                    id={item.id} 
                                    from={item.from} 
                                    to={item.to} 
                                    date={item.date}
                                    travelClass={item.travelClass} 
                                    mode={'Train'}
                                    time={item.time}/>
                            </SortableItem>
                        }

                        if(item.category == 'buses'){
                            <SortableItem id={item.id} key={item.id}>
                                <FlightCard
                                    id={item.id} 
                                    from={item.from} 
                                    to={item.to} 
                                    date={item.date}
                                    travelClass={item.travelClass} 
                                    mode={'Bus'}
                                    time={item.time}/>
                            </SortableItem>
                        }

                        if(item.category == 'cabs'){
                            <SortableItem id={item.id} key={item.id}>
                                <FlightCard
                                    id={item.id} 
                                    from={item.pickupAddress} 
                                    to={item.dropAddress} 
                                    date={item.date}
                                    travelClass={item.travelClass} 
                                    mode={'Cab'}
                                    time={item.time}/>
                            </SortableItem>
                        }

                        if(item.category == 'hotels'){
                            <SortableItem id={item.id} key={item.id}>
                                <HotelCard
                                    id={item.id} 
                                    checkIn={item.checkIn} 
                                    checkOut={item.checkOut} 
                                    location={item.location}
                                    time={item.preferredTime}/>
                            </SortableItem>
                        }

                    })}
                </SortableContext>
            </div>

        </DndContext>
    </>)
}

function FlightCard({from, to, date, returnDate, time, returnTime, travelClass, onClick, mode='Flight', id}){
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
    if(dateString==null || dateString == undefined) return ''
    // Convert string to Date object
    const dateObject = new Date(dateString);
    // Convert Date object back to ISO string
    const isoDateString = dateObject.toDateString();
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
        return timeValue;
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
            {children}
        </div>
    </>)
}


 