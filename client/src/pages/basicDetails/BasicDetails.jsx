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
import { camelCaseToTitleCase } from '../../utils/handyFunctions'

export default function BasicDetails(props){
    const query = useQuery()
    const travelType = props.formData.travelType
    const navigate = useNavigate()

    if(!['international', 'domestic', 'local'].includes(travelType)){
        return navigate(props.lastPage)
    }
    const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL

    //loader state
    const [isLoading, setIsLoading] = useState(false)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    
    //onboarding data...
    const onBoardingData = props.onBoardingData
    const APPROVAL_FLAG = onBoardingData?.APPROVAL_FLAG
    const MANAGER_FLAG =  onBoardingData?.MANAGER_FLAG
    const DELEGATED_FLAG = onBoardingData?.DELEGATED_FLAG
    const listOfAllManagers = onBoardingData?.listOfManagers
    const travelAllocations = onBoardingData?.travelAllocations?.allocation 
    const tripPurposeOptions = onBoardingData?.tripPurposeOptions
    const delegatedFor = onBoardingData?.delegatedFor
    const employeeGroups = onBoardingData?.employeeGroups??[]
    const travelAllocationFlags = onBoardingData?.travelAllocationFlags??{level1:false, level2:false, level3:false}

    console.log(onBoardingData)

    //popup message
    const [showPopup, setshowPopup] = useState(false)
    const [popupMessage, setPopupMessage] = useState(null)
    
    //form data
    const formData = props.formData
    const setFormData = props.setFormData

    console.log(formData, 'form data')

    //next page
    const nextPage = props.nextPage
    console.log(nextPage, props.lastPage,  'nextPage - lastPage')

    //details of current employee
    
    //get this as props
    const EMPLOYEE_ID  = props.EMPLOYEE_ID 
    const groups = props.groups 

    //get this from onboarding....
    const teamMembers = props.teamMembers
    
    //local states
    const [tripPurposeViolationMessage, setTripPurposeViiolationMessage] = useState(formData.travelViolations.tripPurposeViolationMessage)
    const [errors, setErrors] = useState({tripPurposeError:{set:false, message:'Trip Purpose is required'}, approversError:{set:false, message:'Please select approvers'}})

    async function checkRequiredFields(){
        return new Promise((resolve, reject)=>{
            
            let allowSubmit = true;

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
    
            // if(!formData?.approvers?.length>0){
            //     setErrors(pre=>{
            //         return {...pre, approversError:{...pre.approversError, set:true}}
            //     })
            // } 
            // else{
            //     setErrors(pre=>{
            //         return {...pre, approversError:{...pre.approversError, set:false}}
            //     })
            // }
            
            if(onBoardingData.approvalFlow != null && formData?.approvers?.length!=onBoardingData?.approvalFlow?.length){
                setErrors(pre=>{
                    return {...pre, approversError:{...pre.approversError, message:`Please select ${onBoardingData?.approvalFlow?.length} approver/s`, set:true}}
                })
            } 
            else{
                setErrors(pre=>{
                    return {...pre, approversError:{...pre.approversError, set:false}}
                })
            }

            if(formData.tripPurpose==null || (onBoardingData.approvalFlow != null && formData?.approvers?.length != onBoardingData?.approvalFlow?.length)){
                allowSubmit = false
            }
            else allowSubmit = true

            resolve(allowSubmit)
        })
    }

    const handleContinueButton = async ()=>{
        setIsLoading(true)

        console.log(sectionForm)
        console.log(formData)
        let allowSubmit = false
        //check required fields
        console.log('checking required fields');

        allowSubmit = await checkRequiredFields()

        console.log('submission allowed :', allowSubmit)

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
                navigate(nextPage)
            }
            else{
                setIsLoading(true)
                navigate(nextPage)
            }
        }
    }

    const handleSaveAsDraft = async ()=>{
        console.log(sectionForm)
        console.log(formData)
        setIsLoading(true)
        let allowSubmit = await checkRequiredFields()
        //check required fields
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

    useEffect(()=>{
        console.log(errors, 'errors')
    },[errors])

    //update form data
    const updateTripPurpose = async (option)=>{

        let tripPurposeViolationMessage_ = null
        console.log(employeeGroups, 'employeeGroups')
        const res = await policyValidation_API({tenantId:formData.tenantId, type:formData.travelType, policy:'Allowed Trip Purpose', value:option, groups:employeeGroups})
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

    return(<>
            {isLoading && <Error message={loadingErrMsg}/> }
            {!isLoading && <>
            <div className="w-full h-full relative bg-white md:px-6 md:mx-6 sm:px-6 sm:mx-auto py-6 select-none">
            {/* app icon */}
            <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
                <Icon/>
            </div>

            {/* Rest of the section */}
            <div className="w-full h-full ">
                {/* back link */}
                <div className='flex items-center gap-4 cursor-pointer'>
                    <img className='w-[24px] h-[24px]' src={leftArrow_icon} onClick={()=>navigate(props.lastPage)} />
                    <p className='text-neutral-700 text-md font-semibold font-cabin'>Create travel request</p>
                </div>

                {/* only for manager */}
               { MANAGER_FLAG && <>
               <div className="w-fit h-6 justify-start items-center gap-4 inline-flex mt-5">
                    <div onClick={handleBookingForSelf} className={`${ formData.bookingForSelf? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer transition`}>For You </div>
                    <div onClick={handleBookingForTeam} className={`${ formData.bookingForTeam? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer transition`}>For Team</div>
                </div>

                <hr className='mt-2 -mb-4' /> </> }
                {/* only for manager.. ends.... */}

                {/* form */}

                {/* Trip Purpose */}
                <div className="mt-8">
                    <Select 
                        title='Select trip purpose'
                        placeholder='Select puropse of trip'
                        options={tripPurposeOptions}
                        violationMessage={tripPurposeViolationMessage}
                        error={errors.tripPurposeError}
                        currentOption={formData.tripPurpose}
                        onSelect = {(option)=> {updateTripPurpose(option)}} />
                </div>


                <div className='mt-8 flex gap-8 flex-wrap'>
                    {/* Booking for.. will be displayed if employee is delegated  */}
                    {DELEGATED_FLAG  && !formData.bookingForTeam && <ObjectSelect
                        options={delegatedFor}
                        currentOption={formData?.createdFor}
                        placeholder='Name of the travelling employeee' 
                        onSelect={(option)=>{updateTravelRequestCreatedFor(option)}}
                        title='Assign request for' />}

                    {/* Select approvers */}

                    {APPROVAL_FLAG && 
                    <div className='relative'>
                    <MultiSearch 
                        title='Who will Approve this?'
                        placeholder="Name's of managers approving this"
                        onSelect = {(option)=>{updateApprovers(option)}}
                        error={errors.approversError}
                        currentOption={formData.approvers && formData.approvers.length>0? formData.approvers : []}
                        options={listOfAllManagers}/> 
                        <p className='absolute text-xs text-neutral-600 top-[4px] left-[140px]'> 
                            {`(Select ${onBoardingData.approvalFlow.map((a,ind)=> `${a} ${ind<onBoardingData.approvalFlow.length-1?',' : ''} ${onBoardingData.approvalFlow.length>1? 'managers' : 'manager'}`)})`} 
                        </p>
                    </div>}

                </div>
                <hr className='my-8' />
                

                {/* allocating travel budget... will be displayed if travel allocation headers are present */}
                {!travelAllocationFlags.level3 && travelAllocations?.length>0 && <div>
                    <p className='text-base font-medium text-neutral-700 font-cabin'>Allocate travel.</p>
                    
                    <div className='mt-8 flex flex-wrap gap-4'>
                        {travelAllocations?.length>0 && travelAllocations.map((header, index)=>{
                            return(
                                <>
                                <Select
                                    currentOption={formData?.travelAllocationHeaders[index]?.headerValue}
                                    options={travelAllocations[index].headerValues}
                                    onSelect = {(option)=>{handleAllocationHeaderSelect(travelAllocations[index].headerName, option)}}
                                    placeholder={`Select ${travelAllocations[index].headerName}`} 
                                    title={camelCaseToTitleCase(travelAllocations[index].headerName)} />
                                </>
                            )
                        })}
                    </div>      
                                  
                    { selectedTravelAllocationHeaders && selectedTravelAllocationHeaders.length == 0 && 
                    <div className='mt-6 flex gap-4'>
                        <input type='radio' />
                        <p className='text-zinc-800 text-sm font-medium font-cabin'>Not Sure</p>
                    </div>}
                    
                </div> }
                
                {/* slect team members */}
                {((MANAGER_FLAG && formData.bookingForTeam) || formData.isDelegatorManager) && <div className='mt-8'>
                    <div className='flex gap-4 items-center'>
                        {formData.isDelegatorManager && !formData.bookingForTeam && <Checkbox checked={formData.selectDelegatorTeamMembers} onClick={(e)=>{updateSelectDelegatorTeamMembers(e.target.checked)}} />} 
                        <p className='text-base font-medium text-neutral-700 font-cabin'>{`${formData.isDelegatorManager && !formData.bookingForTeam? `Select ${formData.nameOfDelegator.split(' ')[0]}'s team members for this trip` : 'Select team members for this trip'}`}</p>
                    </div>

                    {/* table */}
                   { (formData.selectDelegatorTeamMembers || formData.bookingForTeam) &&  
                   <div className='mt-4 w-full h-fit max-h-[800px] px-auto py-8 border border-neutral-200 inline-flex rounded-xl justify-center items-center'>
                        <div className='w-3/4 mx-1/4 flex flex-row justify-between '>
                            
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
                            
                        </div>
                    </div>}

                </div>}
             
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

function CheckboxCol(props){
    const employees = props.employees
    const onClick = props.onClick
    const checked = props.checked || []

    return(
        <div className='flex-col justify-start items-start gap-6 inline-flex'>
            <div className="flex-col justify-start items-center gap-2 flex">
                <div className="max-w-[134px] py-2 h-10 justify-start items-center inline-flex">
                </div>
                {employees && employees.map((employee, index)=>
                    <div key={index} className="max-w-[134px] shrink py-2 h-10 justify-start items-center inline-flex">
                        <Checkbox onClick={(e,id)=>onClick(e, id)} checked={checked.includes(employee.empId)} id={employee.empId} />
                    </div>)}
            </div>
        </div>
    )
}

function NameCol(props){
    const employees = props.employees

    return(
        <div className='flex-col justify-start items-start gap-6 inline-flex'>
            <div className="flex-col justify-start items-center gap-2 flex">
                <TableItem text='Name' header='true' />
                {employees && employees.map((employee, index)=><TableItem key={index} text={employee.name} />)}
            </div>
        </div>
    )
}

function EmpIdCol(props){
    const employees = props.employees

    return(
        <div className='flex-col sr-only md:sr-only lg:not-sr-only justify-start items-start gap-6 inline-flex'>
            <div className="flex-col justify-start items-center gap-2 flex">
                <TableItem text='Employee Id' header='true' />
                {employees && employees.map((employee, index)=><TableItem key={index} text={employee.empId} />)}
            </div>
        </div>
    )
}

function DesignationCol(props){
    const employees = props.employees
    return(
        <div className='flex-col sr-only md:not-sr-only justify-start items-start gap-6 inline-flex'>
            <div className="flex-col justify-start items-center gap-2 flex">
                <TableItem text='Designation' header='true' />
                {employees && employees.map((employee, index)=><TableItem key={index} text={employee.designation} />)}
            </div>
        </div>
    )
}