import Select from "../common/Select";
import AddMore from "../common/AddMore"
import Checkbox from "../common/Checkbox";
import MultiSearch from "../common/MultiSearch"
import ObjectSelect from "../common/ObjectSelect";
import { useState, useEffect } from "react";
import Error from "../common/Error";
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Image } from "react-native";
import { policyValidation_API } from "../../../utils/api/travelApi";
import Button from "../common/Button";
import { postTravelRequest_API } from "../../../utils/api/travelApi";


export default function({formData, setFormData, onBoardingData, nextPage, navigation}){

    //loader state
    const [isLoading, setIsLoading] = useState(false)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    console.log(nextPage, 'nextPage')
    
    //onboarding data...
    const APPROVAL_FLAG = onBoardingData?.APPROVAL_FLAG
    const MANAGER_FLAG =  onBoardingData?.MANAGER_FLAG
    const DELEGATED_FLAG = onBoardingData?.DELEGATED_FLAG
    const listOfAllManagers = onBoardingData?.listOfManagers
    const travelAllocations = onBoardingData?.travelAllocations 
    const tripPurposeOptions = onBoardingData?.tripPurposeOptions
    const delegatedFor = onBoardingData?.delegatedFor
    const travelAllocationFlags = onBoardingData?.travelAllocationFlags??{level1:false, level2:false, level3:false}



        //details of current employee
        
        //get this as props
        const EMPLOYEE_ID  =  '123'
        const groups =  ['group 1']
    
        //get this from onboarding....
        const teamMembers =  [{name: 'Aman Bhagel', empId: '204', designation: 'Sales Executive'}, {name: 'Vikas Rajput', empId: '245', designation:'System Engineer II'}, {name: 'Rahul Suyush Singh', empId: '318', designation:'Sr. Software Engineer'}, {name: 'Vilakshan Vibhut Giri Babaji Maharaj', empId: '158', designation:'Sr. Sales Executive'}]
        
        //local states
        const [tripPurposeViolationMessage, setTripPurposeViiolationMessage] = useState(formData.travelViolations.tripPurposeViolationMessage)
        const [errors, setErrors] = useState({tripPurposeError:{set:false, message:'Trip Purpose is required'}, approversError:{set:false, message:'Please select approvers'}})
    
        const handleContinueButton = async ()=>{
            setIsLoading(true)
    
            console.log(sectionForm)
            console.log(formData)
            let allowSubmit = false
            //check required fields
            async function checkRequiredFields(){
                return new Promise((resolve, reject)=>{
                    
                    if(formData.tripPurpose==null){
                        setErrors(pre=>{
                            return {...pre, tripPurposeError:{...pre.tripPurposeError, set:true}}
                        })
                    }
                    else{
                        setErrors(pre=>{
                            return {...pre, tripPurposeError:{...pre.tripPurposeError, set:false}}
                        })
                    }
            
                    if(!formData?.approvers?.length>0){
                        setErrors(pre=>{
                            return {...pre, approversError:{...pre.approversError, set:true}}
                        })
                    } 
                    else{
                        setErrors(pre=>{
                            return {...pre, approversError:{...pre.approversError, set:false}}
                        })
                    }    
    
                    if(formData.tripPurpose==null || (APPROVAL_FLAG && formData?.approvers?.length==0)){
                        allowSubmit = false
                    }
                    else allowSubmit = true
    
                    resolve()
                })
            }
            
            await checkRequiredFields()
    
            setIsLoading(false)
    
    
            if(allowSubmit){
                setIsLoading(true)
                console.log('submit allowed')
                if(!formData.travelRequestId){
                    console.log('posting tr')
                    const res = await postTravelRequest_API({...formData, travelRequestState:'section 0', travelRequestStatus:'draft',})
                    
                    if(res.err){
                        console.log('Error in submission')
                        setLoadingErrMsg(res.err)
                        return
                    }
    
                    const travelRequestId = res.data.travelRequestId
    
                    console.log(travelRequestId, 'travel request id')
                    const formData_copy = JSON.parse(JSON.stringify(formData))
                    formData_copy.travelRequestId = travelRequestId
                    setFormData(formData_copy)
                    navigation.navigate(nextPage)
                }
                else{
                    setIsLoading(true)
                    navigation.navigate(nextPage)
                }
            }
        }
    
        const handleSaveAsDraft = async ()=>{
            console.log(sectionForm)
            console.log(formData)
            setIsLoading(true)
            let allowSubmit = false
            //check required fields
            async function checkRequiredFields(){
                return new Promise((resolve, reject)=>{
                    
                    if(formData.tripPurpose==null){
                        setErrors(pre=>{
                            return {...pre, tripPurposeError:{...pre.tripPurposeError, set:true}}
                        })
                    }
                    else{
                        setErrors(pre=>{
                            return {...pre, tripPurposeError:{...pre.tripPurposeError, set:false}}
                        })
                    }
            
                    if(!formData?.approvers?.length>0){
                        setErrors(pre=>{
                            return {...pre, approversError:{...pre.approversError, set:true}}
                        })
                    } 
                    else{
                        setErrors(pre=>{
                            return {...pre, approversError:{...pre.approversError, set:false}}
                        })
                    }    
    
                    if(formData.tripPurpose==null || (APPROVAL_FLAG && formData?.approvers?.length==0)){
                        allowSubmit = false
                    }
                    else allowSubmit = true
    
                    resolve()
                })
                }
                
                await checkRequiredFields()
                setIsLoading(false)
        
                if(allowSubmit){
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
    
        useEffect(()=>{
            console.log(errors, 'errors')
        },[errors])
    
        //update form data
        const updateTripPurpose = async (option)=>{
    
            let tripPurposeViolationMessage_ = null
            const res = await policyValidation_API({tenantId:formData.tenantId, type:'international', policy:'trip purpose', value:option, groups:groups})
            if(!res.err){
                tripPurposeViolationMessage_ = res.data.response.violationMessage
                setTripPurposeViiolationMessage(tripPurposeViolationMessage_)
                console.log(tripPurposeViolationMessage_)
                console.log(res.data)
            }
    
            const formData_copy = JSON.parse(JSON.stringify(formData))
            formData_copy.tripPurpose = option
            formData_copy.travelViolations.tripPurposeViolationMesssage = tripPurposeViolationMessage_
            setFormData(formData_copy)
        }
    
        const updateApprovers = (option)=>{
            const formData_copy = JSON.parse(JSON.stringify(formData))
            formData_copy.approvers = option.map(o=>({name: o.employeeName, empId:o.employeeId, status:'pending approval'}))
            setFormData(formData_copy)
        }
    
        const updateTravelRequestCreatedFor = (option)=>{
            //update form data
            const formData_copy = JSON.parse(JSON.stringify(formData))
            formData_copy.createdFor = {name:option.name, empId:option.empId}
            
    
            //update delegator satates if applicable
            if(DELEGATED_FLAG && option.empId){
    
                formData_copy.raisingForDelegator = true
    
                const delegator = delegatedFor.filter(employee=>employee.empId == formData_copy.createdFor.empId)
                const nameOfDelegator = delegator[0].name
    
                formData_copy.nameOfDelegator = nameOfDelegator
                
                const teamMembers = delegator[0].teamMembers
                formData_copy.delegatorsTeamMembers = teamMembers
                
                //this logic might not be right if there is a fuckup in integrating the company.
                //some explicit variable from backend might be needed
                formData_copy.isDelegatorManager = teamMembers && teamMembers.length>0
            }
    
            else{
                formData_copy.raisingForDelegator = false
                formData_copy.nameOfDelegator=null
                formData_copy.delegatorsTeamMembers=[]
                formData_copy.isDelegatorManager=false
            }
    
            setFormData(formData_copy)
        }
    
        const handleBookingForSelf = ()=>{
            //update form data
            const formData_copy = JSON.parse(JSON.stringify(formData))
            if(formData_copy.bookingForSelf){
                formData_copy.bookingForSelf = false
                formData_copy.bookingForTeam = true
            }
            else{
                formData_copy.bookingForSelf=true
                formData_copy.bookingForTeam=false
            }
    
            formData_copy.createdFor = {name:null, empId:null}
            formData_copy.selectedTravelAllocationHeaders=[]
            formData_copy.selectDelegatorTeamMembers=false
            formData_copy.isDelegatorManager=false
            formData_copy.delegatorsTeamMembers=[]
            formData_copy.raisingForDelegator=false
            formData_copy.nameOfDelegator=null
            formData_copy.teamMembers=[]
            setFormData(formData_copy)
        }
    
        const handleBookingForTeam = ()=>{
            //update form data
            const formData_copy = JSON.parse(JSON.stringify(formData))
            if(formData_copy.bookingForTeam){
                formData_copy.bookingForSelf = true
                formData_copy.bookingForTeam = false
            }
            else{
                formData_copy.bookingForSelf=false
                formData_copy.bookingForTeam=true
            }
    
            formData_copy.createdFor = {name:null, empId:null}
            formData_copy.selectedTravelAllocationHeaders=[]
            formData_copy.isDelegatorManager=false
            formData_copy.delegatorsTeamMembers=[]
            formData_copy.raisingForDelegator=false
            formData_copy.nameOfDelegator=null
            formData_copy.selectDelegatorTeamMembers=false
            formData_copy.teamMembers=[]
            setFormData(formData_copy)
        }
    
        const updateSelectDelegatorTeamMembers = (value)=>{
            const formData_copy = JSON.parse(JSON.stringify(formData))
            formData_copy.selectDelegatorTeamMembers = value
            formData_copy.teamMembers=[]
            setFormData(formData_copy)
        }
    
        //form states
        const [selectedTravelAllocationHeaders, setSelectedTravelAllocationHeaders] = useState(formData.travelAllocationHeaders)
        //team member state 
        const [selectedTeamMembers, setSelectedTeamMembers] = useState(formData?.teamMembers?.map(item=>item.empId))
        
        useEffect(()=>{
            console.log(formData.teamMembers)
        },[selectedTeamMembers])
        
        const handleTeamMemberSelect = (e, id)=>{
    
            console.log(id)
            console.log(selectedTeamMembers.includes(id))
            let updatedTeamMembers = []
    
            if(e.target.checked){
                if(!selectedTeamMembers.includes(id)){
                    updatedTeamMembers = selectedTeamMembers.slice()
                    updatedTeamMembers.push(id)
                    setSelectedTeamMembers(updatedTeamMembers)
                }
            }
            else{
                if(selectedTeamMembers.includes(id)){
                    console.log('this also ran')
                    const index = selectedTeamMembers.indexOf(id)
                    updatedTeamMembers = selectedTeamMembers.slice()
                    updatedTeamMembers.splice(index,1)
                    console.log(updatedTeamMembers)
                    setSelectedTeamMembers(updatedTeamMembers)
                }
            }
    
    
            const formData_copy = JSON.parse(JSON.stringify(formData))
    
            let teamMembers_ = []
    
            if(formData.selectDelegatorTeamMembers && !formData.bookingForTeam){
                formData.delegatorsTeamMembers.forEach(item=>{
                    if(updatedTeamMembers.includes(item.empId)){
                        teamMembers_.push(item)
                    }
                })
            }
    
            if(formData.bookingForTeam && !formData.selectDelegatorTeamMembers){
                teamMembers.forEach(item=>{
                    if(updatedTeamMembers.includes(item.empId)){
                        teamMembers_.push(item)
                    }
                })
            }
    
    
            formData_copy.teamMembers = teamMembers_
            setFormData(formData_copy)
        }
    
        const handleAllocationHeaderSelect = (headerName, option)=>{
            let optionPresent = false
            
            if(selectedTravelAllocationHeaders && selectedTravelAllocationHeaders.length>0){
                selectedTravelAllocationHeaders.forEach(item=>{
                    if(item.headerName.toLowerCase() === headerName.toLowerCase() && item.headerValue.toLowerCase() == option.toLowerCase() ){
                        optionPresent=true
                        return
                    }
                })
            }
            
            if(!optionPresent){
                setSelectedTravelAllocationHeaders((pre)=>[...pre, {headerName, headerValue:option}])
            }
            
        }
    
        useEffect(()=>{
            //update form data
            const formData_copy = JSON.parse(JSON.stringify(formData))
            formData_copy.travelAllocationHeaders = selectedTravelAllocationHeaders
            setFormData(formData_copy)
        },[selectedTravelAllocationHeaders])
    
        const sectionForm =  {
            createdBy:EMPLOYEE_ID,
            createdFor: formData.createdFor,
            teamMembers: formData.teamMembers,
            travelAllocationHeaders: selectedTravelAllocationHeaders,
            approvers: formData.approvers
        }

        useEffect(()=>{
            console.log('LOADING:', isLoading)
        },[isLoading])

        
    return(<>
        {isLoading && <Error message={loadingErrMsg}/> }
        {!isLoading && <>
            <View className="w-full h-full relative bg-white px-4 py-4 select-none">
                {/* only for manager */}
                    { MANAGER_FLAG && <>
                        <View className="w-fit justify-start items-center gap-4 flex flex-row mt-5">
                            <TouchableOpacity onPress={handleBookingForSelf}>
                                <Text style={{fontFamily:'Cabin'}} className={`${ formData.bookingForSelf? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer transition`}>For You </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleBookingForTeam}>
                                <Text style={{fontFamily:'Cabin'}} className={`${ formData.bookingForTeam? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer transition`}>For Team</Text>
                            </TouchableOpacity>
                        </View>

                        <View className='h-[1px] bg-neutral-300 w-full mt-1' /> 
                        </> 
                    }
                {/* only for manager.. ends.... */}

                {/* form */}

                {/* Trip Purpose */}
                <View className="mt-8">
                    <Select 
                        title='Select trip purpose'
                        placeholder='Select puropse of trip'
                        options={tripPurposeOptions}
                        violationMessage={tripPurposeViolationMessage}
                        error={errors.tripPurposeError}
                        currentOption={formData.tripPurpose}
                        onSelect = {(option)=> {updateTripPurpose(option)}} />
                </View>

                <View className='mt-9 flex flex-col'>
                    {/* Booking for.. will be displayed if employee is delegated  */}
                    {DELEGATED_FLAG  && !formData.bookingForTeam && <ObjectSelect
                        options={delegatedFor}
                        currentOption={formData?.createdFor}
                        placeholder='Name of the travelling employeee' 
                        onSelect={(option)=>{updateTravelRequestCreatedFor(option)}}
                        title='Assign request for' />}

                    {/* Select approvers */}

                    {APPROVAL_FLAG &&
                    <MultiSearch 
                        drop='up'
                        title='Who will Approve this?'
                        placeholder="Name's of managers approving this"
                        onSelect = {(option)=>{updateApprovers(option)}}
                        error={errors.approversError}
                        currentOption={formData.approvers && formData.approvers.length>0? formData.approvers : []}
                        options={listOfAllManagers}/>}
                </View>
                
                {/* slect team members */}
                {((MANAGER_FLAG && formData.bookingForTeam) || formData.isDelegatorManager) && <View className='mt-8'>
                    <View className='flex flex-rwo gap-x-4 items-center'>
                        {formData.isDelegatorManager && !formData.bookingForTeam && <Checkbox checked={formData.selectDelegatorTeamMembers} onClick={(e)=>{updateSelectDelegatorTeamMembers(e.target.checked)}} />} 
                        <Text style={{fontFamily:'Cabin'}} className='text-base font-medium text-neutral-700 font-cabin'>{`${formData.isDelegatorManager && !formData.bookingForTeam? `Select ${formData.nameOfDelegator.split(' ')[0]}'s team members for this trip` : 'Select team members for this trip'}`}</Text>
                    </View>

                    {/* table */}
                   { (formData.selectDelegatorTeamMembers || formData.bookingForTeam) &&  
                   <View className='mt-4 w-full h-fit max-h-[800px] px-auto py-8 border border-neutral-200 flex flex-row rounded-xl justify-center items-center'>
                        <View className='w-3/4 mx-1/4 flex flex-row justify-between '>
                            
                            {MANAGER_FLAG && teamMembers &&  !formData.selectDelegatorTeamMembers &&
                                <>
                                    <CheckboxCol checked={selectedTeamMembers} onClick={(e, id)=>handleTeamMemberSelect(e, id)} employees={teamMembers}/>
                                    <EmpIdCol employees={teamMembers} />
                                    <NameCol employees={teamMembers}/>
                                    <DesignationCol employees={teamMembers}/>

                                </>
                            }

                            {formData.isDelegatorManager && formData.delegatorsTeamMembers && formData.selectDelegatorTeamMembers && !formData.bookingForTeam &&
                            <>
                                <CheckboxCol checked={selectedTeamMembers} onClick={(e, id)=>handleTeamMemberSelect(e, id)} employees={formData.delegatorsTeamMembers}/>
                                <EmpIdCol employees={formData.delegatorsTeamMembers} />
                                <NameCol employees={formData.delegatorsTeamMembers}/>
                                <DesignationCol employees={formData.delegatorsTeamMembers}/>
                            </>
                            }
                            
                        </View>
                    </View>}

                </View>}

                <View className='mt-10 w-full flex flex-row justify-between items-center'>
                    <Button disabled={isLoading} isLoading={isLoading} variant='fit' text='Save as Draft' onClick={handleSaveAsDraft}/>
                
                    <Button 
                        variant='fit'
                        text='Continue' 
                        onClick={handleContinueButton} />
                </View>

            </View>
        </>}
    </>)

}



function CheckboxCol(props){
    const employees = props.employees
    const onClick = props.onClick
    const checked = props.checked || []

    return(
        <View className=''>
            <View className="flex-col justify-start items-center gap-2 flex">
                <View className="max-w-[134px] py-2 h-10 justify-start items-center flex">
                </View>
                {employees && employees.map((employee, index)=>
                    <View key={index} className="max-w-[134px] shrink py-2 h-10 justify-start items-center flex">
                        <Checkbox onClick={(e,id)=>onClick(e, id)} checked={checked.includes(employee.empId)} id={employee.empId} />
                    </View>)}
            </View>
        </View>
    )
}

function NameCol(props){
    const employees = props.employees

    return(
        <View className='flex-col justify-start items-start gap-6 flex'>
            <View className="flex-col justify-start items-center gap-2 flex">
                <TableItem text='Name' header='true' />
                {employees && employees.map((employee, index)=><TableItem key={index} text={employee.name} />)}
            </View>
        </View>
    )
}

function EmpIdCol(props){
    const employees = props.employees

    return(
        <View className='flex-col sr-only md:sr-only lg:not-sr-only justify-start items-start gap-6 flex'>
            <View className="flex-col justify-start items-center gap-2 flex">
                <TableItem text='Employee Id' header='true' />
                {employees && employees.map((employee, index)=><TableItem key={index} text={employee.empId} />)}
            </View>
        </View>
    )
}

function DesignationCol(props){
    const employees = props.employees
    return(
        <View className='flex-col sr-only md:not-sr-only justify-start items-start gap-6 flex'>
            <View className="flex-col justify-start items-center gap-2 flex">
                <TableItem text='Designation' header='true' />
                {employees && employees.map((employee, index)=><TableItem key={index} text={employee.designation} />)}
            </View>
        </View>
    )
}


function TableItem(props){
    const text = props.text || 'text'
    const header = props.header || false

    return(
            <View className="w-[134px] shrink text-ellipsis overflow-hidden py-2 h-10 justify-start items-center inline-flex">
                <View className={`${header? 'text-neutral-500' : 'text-neutral-700'} text-sm font-normal font-cabin`}>{text}</View>
            </View>
    )
}