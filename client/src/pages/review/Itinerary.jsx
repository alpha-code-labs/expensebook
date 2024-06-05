import { formatDate2 } from "../../utils/handyFunctions";
import {
  calender_icon,
  airplane_icon,
  bus_icon,
  train_icon,
  cab_icon,
  clock_icon,
  biderectional_arrows_icon as double_arrow,
  location_icon,
} from "../../assets/icon";

import { material_flight_black_icon, material_train_black_icon, material_bus_black_icon, material_cab_black_icon, material_car_rental_black_icon, material_hotel_black_icon, material_personal_black_icon } from "../../assets/icon";
import { titleCase } from "../../utils/handyFunctions";
import { useEffect, useMemo, useState } from "react";

export default function ({ itinerary }) {
    

    const a = useMemo(()=>{
        console.log('Rendering again in review')
        
        const combinedItinerary = [
            ...itinerary.flights?.map((flight, index)=>{
                return({
                    sequence:flight.sequence,
                    element: <div key={flight.sequence}>
        
                    <div className='flex flex-col gap-2 mt-2'>
                    {<>
                        <FlightCard
                            id={index} 
                            from={flight.from} 
                            to={flight.to} 
                            date={flight.date}
                            returnDate={flight.returnDate}
                            returnTime={flight.returnTime}
                            travelClass={flight.travelClass} 
                            mode={'Flight'}
                            time={flight.time}/>
                        {/* {(flight.return?.date??false) && 
                            <FlightCard 
                                id={index}
                                from={flight.to} 
                                to={flight.from} 
                                date={flight.returnDate}
                                travelClass={'N/A'} 
                                mode={'flight'} 
                                time={flight.returnTime }/>
                        } */}
                     </>}
                    </div>
                </div>
                }) 
             }),   
        
             ...itinerary.trains?.map((train, index)=>{
                return({
                    sequence: train.sequence,
                    element: <div key={index}>
        
                    <div className='flex flex-col gap-2 mt-2'>
                    {<>
                        <FlightCard
                            id={train.sequence} 
                            from={train.from} 
                            to={train.to} 
                            date={train.date}
                            travelClass={train.travelClass} 
                            mode={'Train'}
                            time={train.time}/>
                     </>}
                    </div>
                </div>
                }) 
             }),
        
             ...itinerary.buses?.map((bus, index)=>{
                return({
                    sequence:bus.sequence,
                    element: <div key={bus.sequence}>
        
                    <div className='flex flex-col gap-2 mt-2'>
                    {<>
                        <FlightCard
                            id={index} 
                            from={bus.from} 
                            to={bus.to} 
                            date={bus.date}
                            travelClass={bus.travelClass} 
                            mode={'Bus'}
                            time={bus.time}/>
                     </>}
                    </div>
                </div>
                }) 
             }),
        
             ...itinerary.cabs?.map((cab, index)=>{
                return({
                    sequence: cab.sequence,
                    element: <div key={cab.sequence}>
                 
                    <div className='flex flex-col gap-2 mt-2'>
                    {<>
                        <CabCard
                            id={index} 
                            from={cab.pickupAddress} 
                            to={cab.dropAddress} 
                            date={cab.date}
                            travelClass={cab.travelClass} 
                            mode={'Cab'}
                            time={cab.time}/>
                     </>}
                    </div>
                </div>
                }) 
             }),
        
             ...itinerary.hotels?.map((hotel, index)=>{
                return({
                    sequence: hotel.sequence,
                    element: <div key={hotel.sequence}>
                 
                    <div className='flex flex-col gap-2 mt-2'>
                    {<>
                        <HotelCard
                            id={index} 
                            checkIn={hotel.checkIn} 
                            checkOut={hotel.checkOut} 
                            location={hotel.location}
                            time={hotel.preferredTime}/>
                     </>}
                    </div>
                </div>
                }) 
             })
        ]

        return combinedItinerary.sort((a,b)=>a.sequence-b.sequence).map(itm=>itm.element);

    }, [itinerary])

    // const a  = combinedItinerary.sort((a,b)=>a.sequence-b.sequence).map(itm=>itm.element)

    return(<>

        {a}

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
                <div className='flex items-center gap-1 flex-1'>
                    <div className="text-lg semibold">
                        {titleCase(from)}     
                    </div>
                    <img src={double_arrow} className="w-5"/>
                    <div className="text-lg semibold">
                        {titleCase(to)}     
                    </div>
                </div>
                <div className="flex-1" >
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Departure Date</p>
                    <div className="flex items-center gap-1">
                        <img src={calender_icon} className='w-4'/>
                        <p>{isoString(date)}</p>
                    </div>
                </div>
                {returnDate!=null && returnDate != undefined && 
                <div className="flex-1">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Return Date</p>
                    <div className="flex items-center gap-1">
                        <img src={calender_icon} className='w-4'/>
                        <p>{isoString(returnDate)}</p>
                    </div>
                </div>
                }

                {returnTime!=null && 
                <div className="flex-1">
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
              <div className="flex-1">
                 <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Pickup Location</p>
                  <div className="flex items-center gap-1">
                    <img src={location_icon} className="w-4 h-4"/>
                    <p className="whitespace-wrap">{from??'not provided'}</p>
                  </div>     
              </div>
              <div className="flex-1">
                  <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Drop Location</p>
                  <div className="flex items-center gap-1">
                    <img src={location_icon} className="w-4 h-4"/>
                    <p className="whitespace-wrap">{to??'not provided'}</p>
                  </div>     
              </div>
              <div className="flex-1">
                  <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">{mode} Date</p>
                  <div className="flex items-center gap-1">
                    <img src={calender_icon} className="w-4 h-4"/>
                    <p className="whitespace-wrap">{isoString(date)??'not provided'}</p>
                  </div>
              </div>
              <div className="flex-1">
                  <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">Prefferred Time</p>
                  <div className="flex items-center gap-1">
                    <img src={clock_icon} className="w-4 h-4"/>
                    <p className="whitespace-wrap">{formattedTime(time)??'not provided'}</p>
                  </div>
              </div>
             {!isTransfer && <div className="flex-1">
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
          <div className="flex-1">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">CheckIn Date</p>
                    <div className="flex items-center gap-1">
                        <img src={calender_icon} className='w-4'/>
                        <p>{isoString(checkIn)}</p>
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">CheckOut Date</p>
                    <div className="flex items-center gap-1">
                        <img src={calender_icon} className='w-4'/>
                        <p>{isoString(checkOut)}</p>
                    </div>
                </div>
                <div className='flex-1'>
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