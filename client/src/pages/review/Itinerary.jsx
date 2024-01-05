import { formatDate2 } from "../../utils/handyFunctions";
import {
  calender_icon,
  airplane_icon,
  bus_icon,
  train_icon,
  cab_icon,
  biderectional_arrows_icon,
} from "../../assets/icon";
import { titleCase } from "../../utils/handyFunctions";

export default function ({ itinerary }) {
    
    return(<>
        {itinerary.map((leg, index)=>{
           return(<div key={index}>
            <div className="flex items-center gap-2">
                <p className="text-xl text-neutral-700">
                    {`${titleCase(leg.departure.from)}`}
                </p>
                <img src={biderectional_arrows_icon} className="w-6 h-6"/>
                <p className="text-xl text-neutral-700">
                    {`${titleCase(leg.departure.to)} `}
                </p>
            </div>

            <div className='flex flex-col gap-2 mt-2'>
            {<>
                <FlightCard
                    id={index} 
                    from={leg.departure.from} 
                    to={leg.departure.to} 
                    date={leg.departure.date}
                    travelClass={leg.travelClass} 
                    mode={leg.modeOfTransit}
                    time={leg.departure.time}/>
                {(leg.return?.date??false) && 
                    <FlightCard 
                        id={index}
                        from={leg.journey.to} 
                        to={leg.journey.from} 
                        date={leg.journey.return.date}
                        travelClass={leg.travelClass} 
                        mode={leg.modeOfTransit} 
                        time={leg.journey.return.time }/>
                }
             </>}

             {leg.needsCab && leg.cabs.length>0 && leg.cabs.map((cab,ind)=>
                <CabCard
                from={cab.pickupAddress} 
                to={cab.dropAddress} 
                date={cab.date} 
                isTransfer={cab.type!='regular'}
                mode={leg.modeOfTransit}
                time={cab.prefferedTime}/>
             )}

            {leg.needsHotel && leg.hotels.length>0 && leg.hotels.map((hotel, ind)=>
                <HotelCard
                checkIn={hotel.checkIn} 
                checkOut={hotel.checkOut}
                hotelClass={hotel.class}
                preference={'Close to Airport'} 
                />
             )}
            </div>
        </div>) 
        })}
    </>)
}


function FlightCard({from, to, date, time, travelClass, onClick, mode='Flight'}){
  return(
      <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
      <img src={spitImageSource(mode)} className='w-4 h-4' />
      <div className="w-full flex sm:block">
          <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
              <div className="flex-1">
                  From     
              </div>
              <div className="flex-1" >
                  To     
              </div>
  
              <div className="flex-1">
                      Date
              </div>
              <div className="flex-1">
                  Preffered Time
              </div>
              <div className="flex-1">
                  Class/Type
              </div>
          </div>
  
          <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
              <div className="flex-1">
                  {titleCase(from)}     
              </div>
              <div className="flex-1">
                  {titleCase(to)}     
              </div>
              <div className="flex-1">
                  {date}
              </div>
              <div className="flex-1">
                  {time??'N/A'}
              </div>
              <div className="flex-1">
                  {travelClass??'N/A'}
              </div>
          </div>
      </div>
  </div>)
}



function CabCard({from, to, date, time, travelClass, mode, isTransfer=false}){
  return(
      <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
      <div className='font-semibold text-base text-neutral-600'>
      <img src={cab_icon} className='w-6 h-6' />
          {isTransfer && <p className="text-xs text-neutral-500">Transfer Cab</p>}
      </div>
      <div className="w-full flex sm:block">
          <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
              <div className="flex-1">
                  Pickup     
              </div>
              <div className="flex-1" >
                  Drop    
              </div>
              <div className="flex-1">
                  Date
              </div>
              <div className="flex-1">
                  Preffered Time
              </div>
              {!isTransfer && <div className="flex-1">
                  Class/Type
              </div>}
          </div>
  
          <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
              <div className="flex-1">
                  {from??'not provided'}     
              </div>
              <div className="flex-1">
                  {to??'not provided'}     
              </div>
              <div className="flex-1">
                  {date??'not provided'}
              </div>
              <div className="flex-1">
                  {time??'N/A'}
              </div>
             {!isTransfer && <div className="flex-1">
                  {travelClass??'N/A'}
              </div>}
          </div>
      </div>
  </div>)
}

function HotelCard({checkIn, checkOut, hotelClass, onClick, preference={preference}}){
  return(
      <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
      <p className='font-semibold text-base text-neutral-600'>Hotel</p>
      <div className="w-full flex sm:block">
          <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
              <div className="flex-1">
                  Check-In  
              </div>
              <div className="flex-1" >
                  Checkout
              </div>
              <div className="flex-1">
                  Class/Type
              </div>
              <div className='flex-1'>
                  Site Preference
              </div>
          </div>
  
          <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
              <div className="flex-1">
                  {checkIn}     
              </div>
              <div className="flex-1">
                  {checkOut}     
              </div>
              <div className="flex-1">
                  {hotelClass??'N/A'}
              </div>
              <div className='flex-1'>
                  {preference??'N/A'}
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
      return airplane_icon
  else if(modeOfTransit === 'Train')
      return train_icon
  else if(modeOfTransit === 'Bus')
      return bus_icon
}