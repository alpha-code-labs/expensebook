import close_icon from '../../assets/close.svg' 
import Icon from '../../components/common/Icon'
import { useNavigate } from 'react-router-dom'
import { formatDate2, formatDate3, titleCase,  } from "../../utils/handyFunctions"
import Button from '../../components/common/Button'
import { updateTravelRequest_API} from '../../utils/api'
import { useEffect, useState } from 'react'
import Modal from '../../components/common/Modal'
import Cities from './Itinerary'
import Preferences from './Preferences'
import Itinerary from './Itinerary'
import Error from '../../components/common/Error'

const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL
const CASH_URL = import.meta.env.VITE_CASH_URL

export default function (props){
    //next and last pages
    const nextPage = props.nextPage
    const lastPage = props.lastPage
    const currentFormState = props.currentFormState;
    console.log(currentFormState, 'current form state from review...')
    
    const onBoardingData = props.onBoardingData
    const travelAllocationFlags = onBoardingData.travelAllocationFlags
    const cashAdvanceAllowed = onBoardingData.cashAdvanceAllowed

    const formData = props.formData
    const tenantId = formData.tenantId 
    const employeeId = formData.createdBy.empId 
    
    const setFormData = props.setFormData  
    const [showPopup, setShowPopup] = useState(false)
    const [loadingErrMsg, setLoadingErrMsg] = useState(false)

    const navigate = useNavigate()
    
    useEffect(()=>{
        console.log(showPopup, 'showPopup')
    }, [showPopup])
      
    const handleClose = () => {
        //navigate to section1
        navigate(lastPage)
    }

    const handleCashAdvance = async (needed)=>{
        //send data to backend
        if(needed){
            //redirect to create cash advance page
            //navigate(`${CASH_URL}/create/advance/${formData.travelRequestId}`)
            window.location.href = `${CASH_URL}/create/advance/${formData.travelRequestId}`
            setShowPopup(false)
        }    
        else{

            //post message to close iframe
            window.parent.postMessage('closeIframe', DASHBOARD_URL);
           
            // //redirect to desktop
            // window.location.href = `${DASHBOARD_URL}/${tenantId}/${employeeId}/overview`
            // setShowPopup(false)
        }

    }

    const [requestDrafted, setRequestDrafted] = useState(false)
    const [showSaveAsDraftPopup, setShowSaveAsDraftPopup] = useState(false)

    const handleSaveAsDraft = async ()=>{
        if(formData.travelRequestId){
            console.log('sending call')
            setShowSaveAsDraftPopup(true)
            setRequestDrafted(false)
            const res = await updateTravelRequest_API({travelRequest:{...formData, formData:currentFormState,  isCashAdvanceTaken:false}, submitted:false})
            if(res.err){
                setLoadingErrMsg(res.err)
                return
            }
            else{
                setRequestDrafted(true)
                setTimeout(()=>{
                    //navigate to dashboard
                    window.location.href = `${DASHBOARD_URL}/${tenantId}/${employeeId}/overview`
                    setShowSaveAsDraftPopup(false)   
                   }, 5000)
            }

            console.log(res)        
        }
    }

    const [requestSubmitted, setRequestSubmitted] = useState(false)

    const handleSubmit = async()=>{
        if(formData.travelRequestId){
            console.log('sending call')
            setShowPopup(true)
            setRequestSubmitted(false)
            const res = await updateTravelRequest_API({travelRequest:{...formData, formData:currentFormState,  isCashAdvanceTaken:false}, submitted:true})
            
            if(res.err){
                setLoadingErrMsg(res.err)
                return
            }
            else{
                setRequestSubmitted(true)
            }

            console.log(res)        
        }
    }

    return(
        <div className={`${showPopup && 'overflow-hidden'} w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none`}>
            {/* app icon */}
            
            <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
                <Icon/>
            </div>

            {/* Rest of the section */}
            <div className="w-full rounded-md shadow-xl h-full mt-10 p-10">
                <div className='flex w-full flex-row-reverse'>
                    <div className='rounded-full hover:bg-gray-50 p-1'>
                        <img src={close_icon} onClick={handleClose} className='cursor-pointer w-5'/>
                    </div>
                </div>
                <div className="w-full h-full font-cabin tracking-tight">
                    <p className="text-2xl text-neutral-600 mb-5">{`${formData.tripPurpose} Trip`}</p>
                    <div className='flex flex-col sm:flex-row'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10 '>
                            <div className="flex gap-2 font-cabin text-sm tracking-tight">
                                <p className="w-[100px] text-neutral-600">Raised By:</p>
                                <p className="text-neutral-700">{formData.createdBy.name}</p>
                            </div>
                            <div className="flex gap-2 font-cabin text-sm tracking-tight">
                                <p className="w-[100px] text-neutral-600">Raised For:</p>
                                <p className="text-neutral-700">{formData.createdFor?.name??'Self'}</p>
                            </div>
                            <div className="flex gap-2 font-cabin text-sm tracking-tight">
                                <p className="w-[100px] text-neutral-600">Team-members:</p>
                                <p className="text-neutral-700">{formData.teamMembers.length>0 ? formData.teamMembers.map(member=>`${member.name}, `) : 'N/A'}</p>
                            </div>
                            <div className="flex gap-2 font-cabin text-sm tracking-tight">
                                <p className="w-[100px] text-neutral-600">Approvers:</p>
                                <p className="text-neutral-700">{formData.approvers.length>0 ? formData.approvers.map(approver=>`${approver.name}, `) : 'N/A'}</p>
                            </div>
                            {/* {formData?.travelAllocationHeaders.length>0 && 
                                <div className="flex gap-2 font-cabin text-sm tracking-tight">
                                    <p className="w-[100px] text-neutral-600">Travel Allocations:</p>
                                    {(travelAllocationFlags.level1 || travelAllocationFlags.level2)  && <p className="text-neutral-700">{formData.travelAllocationHeaders.length>0 ? formData.travelAllocationHeaders.map(allocation=>`${allocation.headerName}:${allocation.headerValue}(${allocation?.percentage??100}%), `) : 'N/A'}</p>}
                                    {travelAllocationFlags.level3 && <p className="text-neutral-700">
                                        {formData.travelAllocationHeaders.length>0 && 
                                            formData.travelAllocationHeaders.map(cat=>{
                                                return (<>
                                                    {`${titleCase(cat.categoryName)} ::`}
                                                    {cat.allocations.map(allocation=>
                                                        (<div className='flex'>
                                                            <div className='flex'>
                                                                <p className='text-neutral-600'>{allocation.headerName}</p>
                                                                <p className='text-neutral-700'>{allocation.headerValue}</p>  
                                                                ,
                                                            </div>
                                                        </div>)
                                                    )}
                                                </>)
                                    })}</p>}
                                </div>} */}
                        </div>
                    </div>
                </div>
                <hr className='mt-4'></hr>
                <div className="mt-5 flex flex-col gap-4" />
                <Itinerary itinerary={formData.itinerary} />

                {false && <div className='mt-4'>
                    <Preferences preferences={formData.preferences} />
                </div>}

            <div className='my-8 w-full flex justify-between'>
                <Button 
                    variant='fit'
                    text='Save As Draft' 
                    onClick={handleSaveAsDraft} />

                <Button 
                    variant='fit'
                    text='Submit' 
                    onClick={handleSubmit} />
            </div>

                <Modal showModal={showPopup} setShowModal={setShowPopup} skipable={true}>
                    {!requestSubmitted && <Error/>}
                    {requestSubmitted && <div className='p-10'>
                        <p className='text-2xl text-neutral-700 font-semibold font-cabin'>Travel Request Submitted !</p>
                        { cashAdvanceAllowed && <> 
                            <p className='text-zinc-800 text-base font-medium font-cabin mt-4'>Would you like to raise a cash advance request for this trip?</p>
                            <div className='flex gap-10 justify-between mt-10'>
                                <Button text='Yes' onClick={()=>handleCashAdvance(true)} />
                                <Button text='No' onClick={()=>handleCashAdvance(false)} />
                            </div>
                         </>
                        }

                        {!cashAdvanceAllowed && <div className='flex gap-10 justify-between mt-10'>
                                <Button text='Ok' onClick={()=>handleCashAdvance(false)} />
                            </div>}

                    </div>}
                </Modal>

                <Modal showModal={showSaveAsDraftPopup} setShowModal={setShowSaveAsDraftPopup} skipable={true}>
                    {!requestDrafted && <Error/>}
                    {requestDrafted && <div className='p-10'>
                        <p className='text-2xl text-neutral-700 font-semibold font-cabin'>{`Your travel Request #${formData.travelRequestId} is saved as draft`}</p>
                    </div>}
                </Modal>

            </div>           
        </div>
    )
}
