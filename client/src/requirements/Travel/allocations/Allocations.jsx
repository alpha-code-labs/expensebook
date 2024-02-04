import { useState, useEffect } from 'react'
import Select from '../common/Select'
import Button from '../common/Button'
import { postTravelRequest_API, updateTravelRequest_API, policyValidation_API } from '../../../utils/api/travelApi'
//import PopupMessage from '../../components/common/PopupMessage'
import Error from '../../components/common/Error'
import { TouchableWithoutFeedback } from 'react-native'
import Checkbox from '../common/Checkbox'


export default function({formData, setFormData, nextPage, lastPage, onBoardingData, navigation}){

    console.log('from allocations...')

    //const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL
    //loader state
    const [isLoading, setIsLoading] = useState(false)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    
    //onboarding data...
    const travelAllocations = onBoardingData.travelAllocations
    const travelAllocationFlags= onBoardingData.travelAllocationFlags

    if(!travelAllocationFlags.level3){
        //no need to show this page
        navigation.navigate(nextPage)
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
                navigation.navigate(nextPage)
            }
            else{
                setFormData(pre=>({...pre, travelAllocationHeaders:selectedTravelAllocationHeaders}))
                setIsLoading(true)
                navigation.navigate(nextPage)
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
                        // navigation.navigate to dashboard after 5 seconds
                        //navigation.navigate(DASHBOARD_URL)
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
                    // navigation.navigate to dashboard after 5 seconds
                    //navigation.navigate(DASHBOARD_URL)
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
            //nothing is needed. navigation.navigate to last page
            navigation.navigate(nextPage)
        }
        setSelectedItineraryObjects(tmpItineraryObjects)

        console.log(tmpItineraryObjects)
        console.log(travelAllocations)
    },[])

    return(<>
            {isLoading && <Error message={loadingErrMsg}/> }
            {!isLoading && <TouchableWithoutFeedback>
            <View className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
            {/* app icon */}
            {/* Rest of the section */}
            <View className="w-full h-full mt-10 Text-10">
            

                <View>
                    { selectedItineraryObjects?.length>0 && <View>
                    <Text style={{fontFamiliy:'Cabin'}} className='text-base font-medium text-neutral-700 font-cabin'>Allocate travel.</Text>
                    
                    {selectedItineraryObjects.length>0 && selectedItineraryObjects.map((cat, catInd)=>{
                        const categoryAllocationDetails = travelAllocations[travelType].find(c=>c.categoryName.toLowerCase() == cat.toLowerCase())
                        const allocations = categoryAllocationDetails?.allocation??[]

                        console.log(allocations)

                        return(
                            <View key={`${cat}-${catInd}`}  className='mt-8 flex flex-col gap-4'>
                                <Text style={{fontFamiliy:'Cabin'}} className='text-lg font-cabin text-neutral-700'>{cat}</Text>
                                <View className='flex flex-wrap gap-4'>
                                    {allocations.map((header, index)=>{
                                        return(
                                            <>
                                            <Select
                                                currentOption={selectedTravelAllocationHeaders[index]?.allocations.find(h=>h.headerName == header.headerName)?.headerValue}
                                                options={header.headerValues}
                                                onSelect = {(option)=>{handleAllocationHeaderSelect(cat, header.headerName, option)}}
                                                placeholder={`Select ${header.headerName}`} 
                                                title={header.headerName} />
                                            </>
                                        )
                                    })}
                                </View>
                                {<View className='my-2 h-1 bg-gray-200 w-full'/>}
                            </View>
                        )
                    })}
                         
                                  
                    { selectedTravelAllocationHeaders && selectedTravelAllocationHeaders.length == 0 && 
                    <View className='mt-6 flex gap-4'>
                        <Checkbox />
                        <Text style={{fontFamiliy:'Cabin'}} className='text-zinc-800 text-sm font-medium font-cabin'>Not Sure</Text>
                    </View>}
                    
                </View> }

                </View>

                <View className='my-8 w-full flex justify-between items-center'>
                    <Button disabled={isLoading} variant='fit' text='Save as Draft' onClick={handleSaveAsDraft}/>
                
                    <Button 
                        variant='fit'
                        text='Continue' 
                        onClick={handleContinueButton} />
                </View>
                    
                </View> 
            </View>
        {/* <PopupMessage message={popupMessage} showPopup={showPopup} setshowPopup={setshowPopup} /> */}
        </TouchableWithoutFeedback>}
    </>)
}
