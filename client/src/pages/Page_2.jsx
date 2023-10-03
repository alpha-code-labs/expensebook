import Icon from "../components/common/Icon"
import leftArrow_icon from '../assets/arrow-left.svg'
import upload_icon from '../assets/upload.svg'
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../components/common/Input"
import DateTime from "../components/common/DateTime"
import Date from "../components/common/Date"
import Select from "../components/common/Select"
import Checkbox from "../components/common/Checkbox"
import SlimDate from "../components/common/SlimDate"
import AddMore from "../components/common/AddMore"
import Button from "../components/common/Button"


//onboarding data
const modeOfTransitList = ['Flight', 'Train', 'Bus', 'Cab']
const travelClassOptions = {'flight':['Business', 'Economy', 'Premium Economy', 'Private'],
                      'train': ['Sleeper', 'Chair Car', 'First AC', 'Second AC', 'Third AC'],
                      'bus': ['Sleeper', 'Semi-Sleeper', 'Regular'],
                      'cab': ['Sedan', 'Mini']
                     }
const allowedHotelClass = ['4 Star',  '3 Start', '2 Star']
const allowedCabClass = ['Sedan', 'Mini']




export default function (){

    const [oneWayTrip, setOneWayTrip] = useState(true)
    const [roundTrip, setRoundTrip] = useState(false)
    const [multiCityTrip, setMultiCityTrip] = useState(false)
    const [needsVisa, setNeedsVisa] = useState(false)
    const [needsAirportTransfer, setNeedsAirportTransfer] = useState(false)
    const [needsHotel, setNeedsHotel] = useState(true)
    const [needsFullDayCab, setNeedsFullDayCab] = useState(true)
    const [hotelClass, setHotelClass] = useState(null)
    const [cabClass, setCabClass] = useState(null)

    const navigate = useNavigate()

    const handleBackButton = ()=>{
        navigate('/section0')    
    }

    const handleContinueButton = ()=>{
        navigate('/section2')
    }

    function selectTripType(type){

        switch(type){
            case 'oneWay':{
                setOneWayTrip(true)
                setRoundTrip(false)
                setMultiCityTrip(false)
                return
            }

            case 'round':{
                setOneWayTrip(false)
                setRoundTrip(true)
                setMultiCityTrip(false)
                return
            }

            case 'multiCity':{
                setOneWayTrip(false)
                setRoundTrip(false)
                setMultiCityTrip(true)
                return
            }

            default : {
                setOneWayTrip(true)
                setRoundTrip(false)
                setMultiCityTrip(false)
                return
            }

        }
    }

    //format: from, to , departureDate, returnDate
    const [cities, setCities] = useState([])
    const [modeOfTransit, setModeOfTransit] = useState('Flight')
    const [travelClass, setTravelClass] = useState('Business')
    const [hotels, setHotels] = useState([{}])

    const addHotel = ()=>{
        const hotels_copy = JSON.parse(JSON.stringify(hotels))
        hotels_copy.push({})
        setHotels(hotels_copy)
    }

    useEffect(()=>{
        if(modeOfTransit && !travelClassOptions[modeOfTransit.toLowerCase()].includes(travelClass)){
            setTravelClass(null)
        }
    },[modeOfTransit])

    return(<>
        <div className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
            {/* app icon */}
            <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
                <Icon/>
            </div>

            {/* Rest of the section */}
            <div className="w-full h-full mt-10 p-10">

                {/* back link */}
                <div className='flex items-center gap-4 cursor-pointer' onClick={handleBackButton}>
                    <img className='w-[24px] h-[24px]' src={leftArrow_icon} />
                    <p className='text-neutral-700 text-md font-semibold font-cabin'>Add travel details</p>
                </div>

                {/* one way, round trip, multi-city */}
               <div className="w-fit h-6 justify-start items-center gap-4 inline-flex mt-5">
                    <div onClick={()=>{selectTripType('oneWay')}} className={`${ oneWayTrip? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer`}>One Way </div>
                    <div onClick={()=>selectTripType('round')} className={`${ roundTrip? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer `}>Round Trip</div>
                    <div onClick={()=>{selectTripType('multiCity')}} className={`${ multiCityTrip? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer `}>Multi City</div>
                </div> 
                <hr className='mt-2 -mb-4' />

                {/* from, to , date */}
                <div className="mt-8 flex gap-8 items-center flex-wrap">
                    <Input title='From'  placeholder='City'/>
                    <Input title='To' placeholder='City' />
                    <DateTime/>
                </div>
                <hr className='mt-4' />

                <div className="pt-8">
                    <div className="flex gap-8 flex-wrap">
                        <Select 
                            options={modeOfTransitList}
                            onSelect={(option)=>{setModeOfTransit(option)}}
                            currentOption={modeOfTransit}
                            title='Select mode of transit' 
                            placeholder='Select travel mode' />
                        <Select 
                            options={modeOfTransit? travelClassOptions[modeOfTransit.toLowerCase()] : []}
                            onSelect={(option)=>{setTravelClass(option)}}
                            currentOption={travelClass}
                            title='Select travel Class' 
                            placeholder='Select travel class' />
                    </div>
                </div>

               { modeOfTransit=='Flight' &&  <>
                    <hr className='my-8' />
                    <div className=" flex gap-8">
                    <div className="flex gap-2 items-center">
                        <p className="text-neutral-700 w-full h-full text-sm font-normal font-cabin">
                            Will you need a visa?
                        </p>
                        <Checkbox checked={needsVisa} onClick={(e)=>{setNeedsVisa(e.target.checked)}} />
                    </div>

                    <div className="flex gap-2 items-center">
                        <p className="text-neutral-700 w-full h-full text-sm font-normal font-cabin">
                            Will you need an airport transfer?
                        </p>
                        <Checkbox checked={needsAirportTransfer} onClick={(e)=>{setNeedsAirportTransfer(e.target.checked)}} />
                    </div>

                </div> </>}

                <hr className='mt-8' />

                <div className="py-8">
                    <div className="flex gap-2">
                        <p className='text-base font-medium text-neutral-700 font-cabin'>Upload trip related documents</p>
                        <p className='text-base font-medium text-neutral-500 font-cabin'>{`(Optional)`}</p>
                    </div>

                    <div className="flex mt-4 flex-wrap">
                       <div className="flex max-w-[583px] h-[153px] w-fit md:w-full bg-stone-100 rounded-md border-neutral-400 justify-center items-center px-6 py-2">
                            <div className="flex flex-col justify-center items-center gap-4">
                                <div className="w-6 h-6 relative">
                                    <img src={upload_icon}/>
                                </div>
                                <div className="text-center">
                                    <span className="text-neutral-500 text-sm font-normal font-cabin">Drag and drop or </span>
                                    <span className="text-indigo-600 text-sm font-normal font-cabin underline cursor-pointer">Browse</span>
                                </div>
                            </div>
                       </div>
                    </div>
                    <hr className='mt-8' />
                </div>


                {/* hotel */}
                    
                    <div className="flex gap-2 items-center">
                        <p className="text-neutral-700 text-sm font-normal font-cabin">
                            Will you need a hotel?
                        </p>
                        <Checkbox checked={needsHotel} onClick={(e)=>{setNeedsHotel(e.target.checked)}} />
                    </div>

                    {needsHotel && <> 
                        {hotels && hotels.map((hotel,index)=><div key={index} className="flex flex-wrap gap-8 mt-8">
                            {allowedHotelClass && allowedHotelClass.length>0 && 
                            <Select options={allowedHotelClass}
                                    title='Hotel Class'
                                    placeholder='Select hotel class'
                                    currentOption={hotelClass} 
                                    onSelect={(option)=>hotels[index].class = option} />}
                            <SlimDate title='Check In'/>
                            <SlimDate title='Check Out'/>
                        </div>)}
                        
                        <div className="mt-8">
                           <AddMore onClick={addHotel} /> 
                        </div>
                            
                        </> 
                        }
                
                {/* cab */}
                <hr className='mt-8 mb-8' />
                <div className="flex gap-2 items-center">
                        <p className="text-neutral-700 text-sm font-normal font-cabin">
                            Will you need a full day cab?
                        </p>
                        <Checkbox checked={needsFullDayCab} onClick={(e)=>{setNeedsFullDayCab(e.target.checked)}} />
                </div>

                {needsFullDayCab && 
                <>
                    <div  className="flex flex-wrap gap-8 mt-8 items-center">
                        <Date />
                            {allowedCabClass && allowedCabClass.length>0 && 
                            <Select options={allowedCabClass}
                                    title='Cab Class'
                                    placeholder='Select cab class'
                                    currentOption={cabClass} 
                                    onSelect={(option)=>setCabClass(option)} />}
                        </div>    
                </>
                }


                <div className='my-8 w-[134px] float-bottom float-right'>
                    <Button 
                        text='Continue' 
                        onClick={handleContinueButton} />
                </div> 

            </div>
        </div>
    </>)
}