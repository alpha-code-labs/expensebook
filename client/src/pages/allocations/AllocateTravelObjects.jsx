import { useState, useEffect } from 'react'
import leftArrow_icon from '../../assets/arrow-left.svg'
import Select from '../../components/common/Select'
import ObjectSelect from '../../components/custom/page_1/ObjectSelect'
import MultiSearch from '../../components/common/MultiSearch'
import Button from '../../components/common/Button'
import { useNavigate } from 'react-router-dom'
import Icon from '../../components/common/Icon'
import InputPercentage from '../../components/common/InputPercentage'
import Checkbox from '../../components/common/Checkbox'
import TableItem from '../../components/table/TableItem'
import { postTravelRequest_API, updateTravelRequest_API, policyValidation_API } from '../../utils/api'
import CloseButton from '../../components/common/closeButton'
import PopupMessage from '../../components/common/PopupMessage'
import Error from '../../components/common/Error'
import { useQuery } from '../../utils/hooks'
import { TR_backendTransformer } from '../../utils/transformers'
import { camelCaseToTitleCase } from '../../utils/handyFunctions'

export default function({formData, setFormData, nextPage, lastPage, onBoardingData}){

    console.log('from allocations...')

    const navigate = useNavigate()
    const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL
    //loader state
    const [isLoading, setIsLoading] = useState(false)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    
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

    const handleSaveAsDraft = async ()=>{
        console.log(sectionForm)
        console.log(formData)
        setIsLoading(true)
        //check required fields
        
        if(true){
            setIsLoading(true)
            if(!formData.travelRequestId){
                const res = await postTravelRequest_API({...formData, travelRequestState:'section 0', travelRequestStatus:'draft'})
                if(res.err){
                    setLoadingErrMsg(res.err)
                    return
                }

                const travelRequestId = res.data.travelRequestId
                console.log(travelRequestId, 'travel request id')
                const formData_copy = JSON.parse(JSON.stringify(formData))
                formData_copy.travelRequestId = travelRequestId
                setFormData(formData_copy)

                setIsLoading(false)

                if(travelRequestId){
                    //show popup
                    setIsLoading(true)
                    const res = await updateTravelRequest_API({travelRequest:formData, submitted:false})
                    if(res.err){
                        setLoadingErrMsg(res.err)
                        return
                    }
                    setIsLoading(false)
                    setPopupMessage(`Your draft travel request with ID ${travelRequestId} has been saved`)
                    setshowPopup(true)

                    setTimeout(()=>{
                        setshowPopup(false)
                        setPopupMessage(null)
                        // navigate to dashboard after 5 seconds
                        //navigate(DASHBOARD_URL)
                    },5000)
                }
                else{
                    //show server error
                    console.log('server error')
                }
            }
            else{
                setIsLoading(true)
                const res = await updateTravelRequest_API({...formData, travelRequestState:'section 0', travelRequestStatus:'draft', tenantId:formData.tenantId})
                if(res.err){
                    setLoadingErrMsg(res.err)
                    return
                }
                
                setPopupMessage(`Your travel request with ID ${formData.travelRequestId} has been saved as draft successfull`)
                setshowPopup(true)

                setTimeout(()=>{
                    setshowPopup(false)
                    setPopupMessage(null)
                    // navigate to dashboard after 5 seconds
                    //navigate(DASHBOARD_URL)
                },5000)
            }
        }        
    }

    //form states
    const [selectedTravelAllocationHeaders, setSelectedTravelAllocationHeaders] = useState(formData.travelAllocationHeaders??[])
    //team member state 
    
    useEffect(()=>{
        console.log(selectedTravelAllocationHeaders, '..selected headers')
    }, [selectedTravelAllocationHeaders])

    const handleAllocationHeaderSelect = (category, headerName, option)=>{
        
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
            <div className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
            {/* app icon */}
            <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
                <Icon/>
            </div>

            {/* Rest of the section */}
            <div className="w-full h-full mt-10 p-10">
                {/* back link */}
                <div className='flex items-center gap-4 cursor-pointer'>
                    <img className='w-[24px] h-[24px]' src={leftArrow_icon} onClick={()=>navigate(lastPage)} />
                    <p className='text-neutral-700 text-md font-semibold font-cabin'>Allocate Travel</p>
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
                                            <>
                                            <Select
                                                currentOption={selectedTravelAllocationHeaders.find(h=>h.categoryName == cat)?.allocations.find(h=>h.headerName == header.headerName)?.headerValue}
                                                options={header.headerValues}
                                                onSelect = {(option)=>{handleAllocationHeaderSelect(cat, header.headerName, option)}}
                                                placeholder={`Select ${camelCaseToTitleCase(header.headerName)}`} 
                                                title={camelCaseToTitleCase(header.headerName)} />
                                            </>
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

                <div className='my-8 w-full flex justify-between items-center'>
                    <Button disabled={isLoading} variant='fit' text='Save as Draft' onClick={handleSaveAsDraft}/>
                
                    <Button 
                        variant='fit'
                        text='Continue' 
                        onClick={handleContinueButton} />
                </div>
                    
                </div> 
            </div>
        <PopupMessage message={popupMessage} showPopup={showPopup} setshowPopup={setshowPopup} />
        </>}
    </>)
}
