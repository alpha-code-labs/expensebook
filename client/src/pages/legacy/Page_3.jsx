import close_icon from '../assets/close.svg' 
import Icon from '../../components/common/Icon'
import { useNavigate } from 'react-router-dom'
import arrows_icon from '../assets/clarity_two-way-arrows-line.svg'
import calendar_icon from '../assets/calendar.svg'
import star_icon from '../assets/ic_baseline-star.svg'
import vegetarian_icon from '../assets/mdi_lacto-vegetarian.svg'
import seat_icon from '../assets/seat.svg'
import { formatDate2 } from "../../utils/handyFunctions"
import Button from '../../components/common/Button'
import { updateTravelRequest_API } from '../../utils/api'
import { useEffect, useState } from 'react'
import Modal from '../../components/common/Modal'

export default function (props){

    const onBoardingData = props.onBoardingData
    const formData = props.formData
    const setFormData = props.setFormData  
    const [showPopup, setShowPopup] = useState(false)
    
    const sampleTravelRequest = {
        tenantId: "yourTenantId",
        travelRequestId: "yourTenantId_createdBy_tr_1",
        travelRequestStatus: "draft",
        travelRequestState: "section 0",
        createdBy: [{ empId: "employee1", name: "John Doe" }],
        createdFor: [{ empId: "employee2", name: "Jane Smith" }],
        travelAllocationHeaders: [
          {
            department: "Finance",
            percentage: 60,
          },
          {
            department: "Marketing",
            percentage: 40,
          },
        ],
        itinerary: {
          cities: [
            {
              from: "City A",
              to: "City B",
              departure: { date: "2023-10-15", time: "08:00 AM" },
              return: { date: "2023-10-20", time: "06:00 PM" },
            },
          ],
          hotels: [
            {
              class: "4-star",
              checkIn: "2023-10-15",
              checkOut: "2023-10-20",
            },
          ],
          cabs: [],
          modeOfTransit: "Flight",
          travelClass: "Business",
          needsVisa: true,
          needsAirportTransfer: true,
          needsHotel: true,
          needsFullDayCabs: false,
          tripType: { oneWayTrip: false, roundTrip: true, multiCityTrip: false },
        },
        travelDocuments: ["Passport", "Visa"],
        bookings: [
          {
            vendorName: "Airline XYZ",
            billNumber: "12345",
            billDescription: "Flight booking",
            grossAmount: 1200,
            taxes: 100,
            date: "2023-09-20",
            imageUrl: "https://example.com/receipt-image.png",
          },
          {
            vendorName: "Hotel ABC",
            billNumber: "67890",
            billDescription: "Hotel booking",
            grossAmount: 500,
            taxes: 50,
            date: "2023-09-25",
            imageUrl: "https://example.com/hotel-receipt.png",
          },
        ],
        approvers: ["approver1", "approver2"],
        preferences: ["Non-smoking room", "Vegetarian meals"],
        travelViolations: ["None"],
        travelRequestDate: "2023-09-10",
        travelBookingDate: "2023-09-20",
        travelCompletionDate: "2023-10-21",
        travelRequestRejectionReason: "",
        travelAndNonTravelPolicies: {
          travelPolicies: ["Policy 1", "Policy 2"],
          nonTravelPolicies: ["Policy A", "Policy B"],
        },
      };

    const handleSubmit = () => {
        //send data to backend
        updateTravelRequest_API({...formData, travelRequestStatus: formData.approvers?.length>0? 'pending approval' : 'pending booking'})
        .then(setShowPopup(true))
    }

    useEffect(()=>{
        console.log(showPopup, 'showPopup')
    }, [showPopup])
      
      
    const navigate = useNavigate()
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
                
                {formData.itinerary.cities.map((item, index)=>
                    <div key={index} className="mt-4 flex items-center gap-4 flex-wrap">
                    <div className="flex items-center">
                        <p className='text-neutral-800 text-sm font-cabin'>{item.from}</p>
                        <img src={arrows_icon} className='w-5 mx-1' />
                        <p className='text-neutral-800 text-sm font-cabin'>{item.to}</p>
                    </div>

                    <div className="flex items-center gap-1">
                        <img src={calendar_icon} className='w-4 h-4' />
                        <p className='text-neutral-700 text-sm font-cabin'>{formatDate2(item.departure.date)}</p>
                        {item.return && <> <p className='text-neutral-500 text-sm font-cabin'>to</p>
                        <p className='text-neutral-700 text-sm font-cabin'>{formatDate2(item.return.date)}</p></>}                    
                    </div>
                </div>
                )}

               {formData?.createdFor?.length>0 && formData.createdFor[0]!=formData.createdBy && <div className="mt-10">
                    <p className='text-neutral-400 text-sm font-cabin'>Booked for</p>
                    <p className='text-neutral-700 text-sm font-cabin'>{formData.createdFor[0].name}</p>
                </div>}

               { formData.tripPurpose && <div className="mt-4">
                    <p className='text-neutral-400 text-sm font-cabin'>Trip purpose</p>
                    <p className='text-neutral-700 text-sm font-cabin'>{formData.tripPurpose}</p>
                </div>}

            
               {formData.teamMembers && formData.teamMembers.length>0 && <div className="mt-4">
                    <p className='text-neutral-400 text-sm font-cabin'>Team members coming on trip</p>
                    <p className='text-neutral-700 text-sm font-cabin'>
                        {formData.teamMembers.map((item, index)=><>{item.name}{index!=formData.teamMembers.length-1 && <>, </>}</>)}
                    </p>
                </div>}

                {formData.approvers && formData.approvers.length>0 && <div className="mt-4">
                    <p className='text-neutral-400 text-sm font-cabin'>Approvers</p>
                    <p className='text-neutral-700 text-sm font-cabin'>
                    {formData.approvers.map((item, index)=><>{item.name}{index!=formData.approvers.length-1 && <>, </>}</>)}
                    </p>
                </div>}

                {formData.travelAllocationHeaders.length>0 && <div className="mt-4">
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


                <div className="w-[312px] h-[110px] flex-col justify-start items-start gap-4 inline-flex">
                    <div className="text-zinc-800 text-base font-medium font-cabin">Your preferences </div>
                    <div className="justify-start items-start gap-20 inline-flex">
                        <div className="flex-col justify-start items-start gap-4 inline-flex">
                            <div className="text-zinc-800 text-base font-normal font-cabin">Hotel</div>
                            <div className="justify-start items-start gap-6 inline-flex">
                                <div className="flex-col justify-center items-center gap-2 inline-flex">
                                    <div className="flex-col justify-start items-center gap-2 flex">
                                        <div className="justify-center items-center gap-2 inline-flex">
                                        <div className="w-4 h-4 relative" >
                                                <img src={vegetarian_icon} />
                                            </div>
                                            <div className="text-center text-neutral-500 text-sm font-normal font-cabin">Veg</div>
                                        </div>
                                    </div>
                                    <div className="text-center text-zinc-800 text-xs font-normal font-cabin">Food </div>
                                </div>
                                <div className="flex-col justify-center items-start gap-2 inline-flex">
                                    <div className="justify-center items-center gap-1 inline-flex">
                                        <div className="w-4 h-4 relative" >
                                            <img src={star_icon} />
                                        </div>
                                        <div className="text-center text-neutral-500 text-sm font-normal font-cabin">5</div>
                                    </div>
                                    <div className="text-center text-zinc-800 text-xs font-normal font-cabin">Rating</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-col justify-start items-start gap-4 inline-flex">
                            <div className="text-zinc-800 text-base font-normal font-cabin">Flight</div>
                            <div className="justify-start items-start gap-6 inline-flex">
                                <div className="flex-col justify-center items-center gap-2 inline-flex">
                                    <div className="flex-col justify-start items-center gap-2 flex">
                                        <div className="justify-center items-center gap-2 inline-flex">
                                            <div className="w-4 h-4 relative" >
                                                <img src={vegetarian_icon} />
                                            </div>
                                            <div className="text-center text-neutral-500 text-sm font-normal font-cabin">Veg</div>
                                        </div>
                                    </div>
                                    <div className="text-center text-zinc-800 text-xs font-normal font-cabin">Food </div>
                                </div>
                                <div className="flex-col justify-start items-center gap-2 inline-flex">
                                    <div className="justify-start items-center inline-flex">
                                        <div className="w-4 h-4 relative">
                                            <div className="w-2.5 h-[13.50px] left-[3px] top-[1.50px] absolute">
                                                <img src={seat_icon} />
                                            </div>
                                        </div>
                                        <div className="text-center text-neutral-500 text-xs font-normal font-cabin">Window</div>
                                    </div>
                                    <div className="text-center text-zinc-800 text-xs font-normal font-cabin">Seat</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


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