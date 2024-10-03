import { useState, useEffect } from 'react'
import leftArrow_icon from '../../assets/arrow-left.svg'
import Select from '../../components/common/Select'
import Button from '../../components/common/Button'
import { useNavigate } from 'react-router-dom'
import { postTravelRequest_API, updateTravelRequest_API } from '../../utils/api'
import PopupMessage from '../../components/common/PopupMessage'
import Error from '../../components/common/Error'

import { camelCaseToTitleCase } from '../../utils/handyFunctions'
import Modal from '../../components/common/Modal'

export default function({formData, setFormData, nextPage, lastPage, onBoardingData}){

    const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL
    const navigate = useNavigate()
    const tenantId = formData.tenantId 
    const employeeId = formData.createdBy.empId 

    //loader state
    const [isLoading, setIsLoading] = useState(false)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const cashAdvanceAllowed = onBoardingData.cashAdvanceAllowed
    const allowCashAdvance = false;
    
    //onboarding data...
    const travelAllocations = onBoardingData.travelAllocations
    const travelAllocationFlags= onBoardingData.travelAllocationFlags


    if(!travelAllocationFlags.level3){
        //no need to show this page
        navigate(nextPage)
    }

    //popup message
    const [showPopup, setshowPopup] = useState(false)
    const [popupMessage, setPopupMessage] = useState(null)
    const [showModal, setShowModal] = useState(false);

    const [requestSubmitted, setRequestSubmitted] = useState(false)
    const [requestDrafted, setRequestDrafted] = useState(false)
    const [showSaveAsDraftPopup, setShowSaveAsDraftPopup] = useState(false)
    
    const travelType = formData.travelType
    console.log(formData, 'form data')

    //next page
    console.log(nextPage, 'next page from allocations')

    //details of current employee
    
    const handleContinueButton = async ()=>{

        console.log(formData)
        let allowSubmit = false
        //check required fields
        
        if(true){
            setIsLoading(true)

            if(!formData.travelRequestId){
                const res = await postTravelRequest_API({...formData, travelRequestState:'section 0', travelRequestStatus:'draft',})
                
                if(res.err){
                    setLoadingErrMsg(res.err)
                    return
                }

                const travelRequestId = res.data.travelRequestId
                setFormData(pre=>({...pre, travelAllocationHeaders:selectedTravelAllocationHeaders}))
                console.log(travelRequestId, 'travel request id')
                const formData_copy = JSON.parse(JSON.stringify(formData))
                formData_copy.travelRequestId = travelRequestId
                setFormData(formData_copy)
                navigate(nextPage)
            }
            else{
                setFormData(pre=>({...pre, travelAllocationHeaders:selectedTravelAllocationHeaders}))
                setIsLoading(true)
                navigate(nextPage)
            }
        }
    }

    const handleSubmit = async()=>{
        if(formData.travelRequestId){
            console.log('sending call')
            setShowModal(true)
            setRequestSubmitted(false)
            const res = await updateTravelRequest_API({travelRequest:{...formData, travelAllocationHeaders:selectedTravelAllocationHeaders, isCashAdvanceTaken:false}, submitted:true})
            
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

    const handleCashAdvance = async (needed)=>{
        if(needed){
            window.parent.postMessage(`raiseAdvance ${tenantId} ${formData.travelRequestId}`, DASHBOARD_URL);
            setShowModal(false)
        }    
        else{
            //post message to close iframe
            window.parent.postMessage('closeIframe', DASHBOARD_URL);
        }
    }


    //form states
    const [selectedTravelAllocationHeaders, setSelectedTravelAllocationHeaders] = useState(formData.travelAllocationHeaders??[])
    //team member state 
    
    useEffect(()=>{
        console.log(selectedTravelAllocationHeaders, '..selected headers')
    }, [selectedTravelAllocationHeaders])

    const handleAllocationHeaderSelection = (category, headerName, option)=>{
        
        const selectedTravelAllocationHeaders_copy = JSON.parse(JSON.stringify(selectedTravelAllocationHeaders))

        const ind = selectedTravelAllocationHeaders.findIndex(c=>c.categoryName == category)

        if(ind != -1){
            
            const headerInd = selectedTravelAllocationHeaders[ind].allocations.findIndex(h=> h.headerName.toLowerCase() == headerName.toLowerCase())

            if(headerInd != -1){
                if( selectedTravelAllocationHeaders_copy[ind].allocations[headerInd].headerValue != option){
                    selectedTravelAllocationHeaders_copy[ind].allocations[headerInd].headerValue = option
                    setSelectedTravelAllocationHeaders(selectedTravelAllocationHeaders_copy)
                }
            }
            else{
                selectedTravelAllocationHeaders_copy[ind].allocations.push({headerName: headerName, headerValue:option})
                setSelectedTravelAllocationHeaders(selectedTravelAllocationHeaders_copy)
            }
        }
        else{
            selectedTravelAllocationHeaders_copy.push({
                categoryName: category, 
                allocations: [{ headerName: headerName, headerValue: option }],
            })
            setSelectedTravelAllocationHeaders(selectedTravelAllocationHeaders_copy)
        }


   
    }

    const [selectedItineraryObjects, setSelectedItineraryObjects] = useState([])

    useEffect(()=>{
        const newItinerary = formData.itinerary 

        const tmpItineraryObjects = []

        Object.keys(newItinerary).forEach(key=>{
            if(key!='formState' || key!='personalVehicles' || key!='buses'){
                if(newItinerary[key].length != 0){
                    tmpItineraryObjects.push(key.slice(0,-1))
                }
            }
            if(key == 'buses'){
                if(newItinerary[key].length != 0){
                    tmpItineraryObjects.push('bus')
                }
            }
        })

        if(tmpItineraryObjects.length == 0){
            //nothing is needed. navigate to last page
            navigate(nextPage)
        }
        setSelectedItineraryObjects(tmpItineraryObjects)

        console.log(tmpItineraryObjects)
        console.log(travelAllocations)
    },[])

    return(<>
        {isLoading && <Error message={loadingErrMsg}/> }
        {!isLoading && <>
            <div className="h-full relative bg-white mx-auto max-w-[712px] py-6 select-none px-6 sm:px-8">
                {/* Rest of the section */}
                <div className="w-full h-full mx-auto">
                    {/* back link */}
                    <div className='flex items-center gap-4 cursor-pointer'>
                        <img className='w-[24px] h-[24px]' src={leftArrow_icon} onClick={()=>navigate(lastPage)} />
                        <p className='text-neutral-700 text-md font-semibold font-sans-serif'>Allocate Travel</p>
                    </div>

                    <div>
                        { selectedItineraryObjects?.length>0 && <div>
                        
                        {selectedItineraryObjects.length>0 && selectedItineraryObjects.map((cat, catInd)=>{
                            const categoryAllocationDetails = travelAllocations[travelType].find(c=>c.categoryName.toLowerCase() == cat.toLowerCase())
                            const allocations = categoryAllocationDetails?.allocation??[]

                            console.log(allocations)

                            return(
                                <div key={`${cat}-${catInd}`}  className='mt-8 flex flex-col gap-4'>
                                    <p className='text-lg font-cabin text-neutral-700'>{camelCaseToTitleCase(cat)}</p>
                                    <div className='flex flex-wrap gap-4'>
                                        {allocations.map((header, index)=>{
                                            return(
                                                <div className='relative'>
                                                    <Select
                                                        currentOption={selectedTravelAllocationHeaders.find(h=>h.categoryName == cat)?.allocations.find(h=>h.headerName == header.headerName)?.headerValue}
                                                        options={header.headerValues}
                                                        onSelect = {(option)=>{handleAllocationHeaderSelection(cat, header.headerName, option)}}
                                                        placeholder={`Select ${camelCaseToTitleCase(header.headerName)}`} 
                                                        title={camelCaseToTitleCase(header.headerName)} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {<hr className='py-2' />}
                                </div>
                            )
                        })}
                            
                                    
                        { selectedTravelAllocationHeaders && selectedTravelAllocationHeaders.length == 0 && 
                        <div className='mt-6 flex gap-4'>
                            <input type='radio' />
                            <p className='text-zinc-800 text-sm font-medium font-cabin'>Not Sure</p>
                        </div>}
                        
                    </div> }

                    </div>

                    <div className='my-8 w-full flex justify-end items-center'>
                       
                        <Button 
                            variant='fit'
                            text='Submit' 
                            onClick={handleSubmit} />
                    </div>
                </div> 
            </div>

            <Modal showModal={showModal} setShowModal={setShowModal} skipable={true}>
                {!requestSubmitted && <Error/>}
                {requestSubmitted && <div className='p-10'>
                    <p className='text-2xl text-neutral-700 font-semibold font-cabin'>Travel Request Submitted !</p>
                    { false && allowCashAdvance && <> 
                        <p className='text-zinc-800 text-base font-medium font-cabin mt-4'>Would you like to raise a cash advance request for this trip?</p>
                        <div className='flex gap-10 justify-between mt-10'>
                            <Button text='Yes' onClick={()=>handleCashAdvance(true)} />
                            <Button text='No' onClick={()=>handleCashAdvance(false)} />
                        </div>
                        </>
                    }

                    {true && <div className='flex gap-10 justify-between mt-10'>
                            <Button text='Ok' onClick={()=>handleCashAdvance(false)} />
                        </div>}

                </div>}
            </Modal>

            <PopupMessage message={popupMessage} showPopup={showPopup} setshowPopup={setshowPopup} />
        </>}
    </>)
    }
