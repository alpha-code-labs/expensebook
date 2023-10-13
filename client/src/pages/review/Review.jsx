import close_icon from '../../assets/close.svg' 
import Icon from '../../components/common/Icon'
import { useNavigate } from 'react-router-dom'
import arrows_icon from '../../assets/clarity_two-way-arrows-line.svg'
import calendar_icon from '../../assets/calendar.svg'
import star_icon from '../../assets/ic_baseline-star.svg'
import vegetarian_icon from '../../assets/mdi_lacto-vegetarian.svg'
import seat_icon from '../../assets/seat.svg'
import { formatDate2 } from "../../utils/handyFunctions"
import Button from '../../components/common/Button'
import { updateTravelRequest_API } from '../../utils/api'
import { useEffect, useState } from 'react'
import Modal from '../../components/common/Modal'
import Cities from './Cities'
import Preferences from './Preferences'

export default function (props){

    const onBoardingData = props.onBoardingData
    const formData = props.formData
    const setFormData = props.setFormData  
    const [showPopup, setShowPopup] = useState(false)
    const navigate = useNavigate()
    
    const handleSubmit = () => {
        //send data to backend
        updateTravelRequest_API({...formData, travelRequestStatus: formData.approvers?.length>0? 'pending approval' : 'pending booking'})
        .then(setShowPopup(true))
    }

    useEffect(()=>{
        console.log(showPopup, 'showPopup')
    }, [showPopup])
      
    const handleClose = () => {
        //navigate to section1
        navigate('/section1')
    }

    return(
        <div className={`${showPopup && 'overflow-hidden'} w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none`}>
            {/* app icon */}
            
            <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
                <Icon/>
            </div>

            {/* Rest of the section */}
            <div className="w-full rounded-md shadow-xl h-full mt-10 p-10">
                <div className="flex justify-between item-center">
                    <p className="text-neutral-700 text-xl font-semibold font-cabin">Trip Details</p>
                    <img src={close_icon} onClick={handleClose} alt="close" className="w-6 h-6 cursor-pointer"/>
                </div>
                
                <Cities cities={formData.itinerary.cities} />

               {formData?.createdFor?.length>0 && formData.createdFor[0]!=formData.createdBy && <div className="mt-10">
                    <p className='text-neutral-400 text-sm font-cabin'>Booked for</p>
                    <p className='text-neutral-700 text-sm font-cabin'>{formData.createdFor[0].name}</p>
                </div>}

               { formData.tripPurpose && <div className="mt-4">
                    <p className='text-neutral-400 text-sm font-cabin'>Trip purpose</p>
                    <p className='text-neutral-700 text-sm font-cabin'>{formData.tripPurpose}</p>
                </div>}

            
               {formData?.teamMembers && formData?.teamMembers?.length>0 && <div className="mt-4">
                    <p className='text-neutral-400 text-sm font-cabin'>Team members coming on trip</p>
                    <p className='text-neutral-700 text-sm font-cabin'>
                        {formData.teamMembers.map((item, index)=><>{item.name}{index!=formData.teamMembers.length-1 && <>, </>}</>)}
                    </p>
                </div>}

                {formData?.approvers && formData?.approvers?.length>0 && <div className="mt-4">
                    <p className='text-neutral-400 text-sm font-cabin'>Approvers</p>
                    <p className='text-neutral-700 text-sm font-cabin'>
                    {formData.approvers.map((item, index)=><>{item.name}{index!=formData.approvers.length-1 && <>, </>}</>)}
                    </p>
                </div>}

                {formData?.travelAllocationHeaders?.length>0 && <div className="mt-4">
                    <p className='text-neutral-400 text-sm font-cabin'>Travel budget allocation</p>
                    <p className='text-neutral-700 text-sm font-cabin'>
                    {formData.travelAllocationHeaders.map((item, index)=><>{item.department}<span className='text-neutral-400'>({item.percentage})</span>{index!=formData.travelAllocationHeaders.length-1 && <>, </>}</>)}
                    </p>
                </div>}
                    
                <hr className='mt-4'></hr>

                {formData.itinerary.modeOfTransit && <div className="mt-4">
                    <p className='text-neutral-400 text-sm font-cabin'>Mode of Transit</p>
                    <p className='text-neutral-700 text-sm font-cabin'>{formData.itinerary.modeOfTransit} <span className='text-neutral-400'>(Economy)</span>  </p>
                </div>}

               {formData.itinerary.needsHotel && <div className="mt-4">
                    <p className='text-neutral-400 text-sm font-cabin'>Hotels</p>
                    {formData.itinerary.hotels.map((item, index)=><p className='text-neutral-700 text-sm font-cabin'>{item.class} <span className='text-neutral-400'>({formatDate2(item.checkIn)} to {formatDate2(item.checkOut)})</span> </p>)}
                </div>}

                <div className="mt-4">
                    <p className='text-neutral-400 text-sm font-cabin'>Cabs</p>
                    <p className='text-neutral-700 text-sm font-cabin'>13th Aug, 14 Aug</p>
                </div>

            <Preferences preferences={formData.preferences} />


            <div className='my-8 w-[134px] float-bottom float-right'>
                <Button 
                    text='Submit' 
                    onClick={handleSubmit} />
            </div>

                <Modal showModal={showPopup} setShowModal={setShowPopup} skipable={true}>
                    <div className='p-10'>
                        <p className='text-2xl text-neutral-700 font-semibold font-cabin'>Travel Request Submitted !</p>
                        <p className='text-zinc-800 text-base font-medium font-cabin mt-4'>Would you like to raise a cash advance request for tis trip?</p>
                        <div className='flex gap-10 justify-between mt-10'>
                            <Button text='Yes' />
                            <Button text='No'  />
                        </div>
                    </div>
                </Modal>

            </div>           
        </div>
    )
}