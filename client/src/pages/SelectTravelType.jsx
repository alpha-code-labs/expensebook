import { useEffect, useState } from "react"
import Error from "../components/common/Error"
import {useNavigate } from "react-router-dom"
import Icon from "../components/common/Icon"
import Button from "../components/common/Button"


export default function({nextPage, formData, setFormData, setOnBoardingData}){
    const [travelType, setTravelType] = useState(formData.travelType)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(()=>{
        setIsLoading(false)
    }, [])

    useEffect(()=>{
        console.log(travelType)
    }, [travelType])


    const handleContinueButton = ()=>{
        //navigate to creating page
        setFormData(pre=>({...pre, travelType:travelType}))
        
        navigate(nextPage)
    }


    return(<>
        {isLoading && <Error message={null}/> }

        {!isLoading && <>
        <div className="w-full h-full relative bg-white md:px-6 md:mx-0 sm:px-0 sm:mx-auto py-6 select-none">
        {/* app icon */}
        <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
            <Icon/>
        </div>

        {/* Rest of the section */}
        <div className="w-full h-full">

            <fieldset className='mt-4'>
                    <legend className='font-cabin mt-4 text-neutral-700 text-lg'>Select type of travel?</legend>

                    <div className='flex gap-4 border border-indigo-400 max-w-[350px] accent-indigo-600 px-6 py-2 rounded mt-4'>
                        <input type="radio" id="International" name="travelType" value="traveltype" checked={travelType == 'international'} onChange={(e)=>setTravelType('international')} />
                        <div>
                            <p className='font-cabin text-neutral-800 text-lg tracking-wider'> International </p>
                            <p className='font-cabin -mt-1 text-neutral-600 text-sm tracking-tight'>Travelling out of country</p>
                        </div>
                    </div>

                    <div className='flex gap-4 border border-indigo-400 max-w-[350px] accent-indigo-600 px-6 py-2 rounded mt-4'>
                        <input type="radio" id="Domestic" name="travelType" value="traveltype" checked={travelType=='domestic'} onChange={(e)=>setTravelType('domestic')} />
                        <div>
                            <p className='font-cabin text-neutral-800 text-lg tracking-wider'> Domestic </p>
                            <p className='font-cabin -mt-1 text-neutral-600 text-sm tracking-tight'>Travelling within country</p>
                        </div>
                    </div>

                    <div className='flex gap-4 border border-indigo-400 max-w-[350px] accent-indigo-600 px-6 py-2 rounded mt-4'>
                        <input type="radio" id="Local" name="travelType" value="traveltype" checked={travelType == 'local'} onChange={(e)=>setTravelType('local')} />
                        <div>
                            <p className='font-cabin text-neutral-800 text-lg tracking-wider'> Local </p>
                            <p className='font-cabin -mt-1 text-neutral-600 text-sm tracking-tight'>Travelling nearby</p>
                        </div>
                    </div>

                </fieldset>

                <div className='my-8 w-full flex justify-between items-center flex-row-reverse'> 
                    <Button 
                        variant='fit'
                        text='Continue' 
                        onClick={handleContinueButton} />
                </div>

        </div>

        </div>
    </>}
</>)
}