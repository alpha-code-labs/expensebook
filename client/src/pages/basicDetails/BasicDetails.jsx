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


export default function BasicDetails(props){
    
    //onboarding data...
    const onBoardingData = props.onBoardingData
    const APPROVAL_FLAG = onBoardingData?.APPROVAL_FLAG
    const MANAGER_FLAG =  onBoardingData?.MANAGER_FLAG
    const DELEGATED_FLAG = onBoardingData?.DELEGATED_FLAG
    const listOfAllManagers = onBoardingData?.managersList
    const ALLOCATION_HEADER = onBoardingData?.ALLOCATION_HEADER
    const travelAllocationHeaders = onBoardingData?.travelAllocationHeaderOptions 
    const tripPurposeOptions = onBoardingData?.tripPurposeOptions
    const delegatedFor = onBoardingData?.delegatedFor

    //form data
    const formData = props.formData
    const setFormData = props.setFormData

    console.log(formData, 'form data')

    //next page
    const nextPage = props.nextPage

    //details of current employee
    
    //get this as props
    const EMPLOYEE_ID  = props.EMPLOYEE_ID || '123'
    const group = props.group || 'group 1'
    //get this from onboarding....
    const teamMembers = props.teamMembers || [{name: 'Aman Bhagel', empId: '204', designation: 'Sales Executive'}, {name: 'Vikas Rajput', empId: '245', designation:'System Engineer II'}, {name: 'Rahul Suyush Singh', empId: '318', designation:'Sr. Software Engineer'}, {name: 'Vilakshan Vibhut Giri Babaji Maharaj', empId: '158', designation:'Sr. Sales Executive'}]
    
    //local states
    const [tripPurposeViolationMessage, setTripPurposeViiolationMessage] = useState(formData.travelViolations.tripPurposeViolationMessage)
    const [errors, setErrors] = useState({tripPurposeError:{set:false, message:'Trip Purpose is required'}, approversError:{set:false, message:'Please select approvers'}})
    
    const navigate = useNavigate()

    const handleContinueButton = async ()=>{
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

        if(allowSubmit){
            if(!formData.travelRequestId){
                const travelRequestId = await postTravelRequest_API({...formData, travelRequestState:'section 0', travelRequestStatus:'draft', tenantId:144,  })
                
                console.log(travelRequestId, 'travel request id')
                const formData_copy = JSON.parse(JSON.stringify(formData))
                formData_copy.travelRequestId = travelRequestId
                setFormData(formData_copy)

                if(travelRequestId){
                    navigate(nextPage)
                }
                else{
                    //show server error
                    console.log('server error')
                }
            }
            else{
                const res = await updateTravelRequest_API({...formData, travelRequestState:'section 0', travelRequestStatus:'draft', tenantId:144,  })
                console.log(res, 'res')
                //do some error handling if updation fails
                navigate(nextPage)
            }
        }

    }

    useEffect(()=>{
        console.log(errors, 'errors')
    },[errors])

    //update form data
    const updateTripPurpose = async (option)=>{

        let tripPurposeViolationMessage_ = null
        await policyValidation_API({type:'international', policy:'trip purpose', value:option, group:group})
        .then(res=>{tripPurposeViolationMessage_ = res.violationMessage})
        .catch(err=>console.error('error in policy validation ', err))

        setTripPurposeViiolationMessage(tripPurposeViolationMessage_)

        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.tripPurpose = option
        formData_copy.travelViolations.tripPurposeViolationMesssage = tripPurposeViolationMessage_
        setFormData(formData_copy)
    }

    const updateApprovers = (option)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.approvers = option
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

    const handleAllocationPercentageChange = (percentage, item)=>{
        const updatedSelectedTravelAllocationHeaders =  
        selectedTravelAllocationHeaders.map(prevItem=>{
            if(JSON.stringify(prevItem) == JSON.stringify(item)){
                console.log('item matches')
                return{...prevItem, percentage}
            }
            else{
                console.log('item doesnt matches')
                return prevItem
            }
        })

        console.log(updatedSelectedTravelAllocationHeaders)
        setSelectedTravelAllocationHeaders(updatedSelectedTravelAllocationHeaders)
    
    }

    const handleAllocationHeaderSelect = (option)=>{
        let optionPresent = false
        
        if(selectedTravelAllocationHeaders && selectedTravelAllocationHeaders.length>0){
            selectedTravelAllocationHeaders.forEach(item=>{
                if(item.department.toLowerCase() == option.toLowerCase() ){
                    optionPresent=true
                    return
                }
            })
        }
        
        if(!optionPresent){
            setSelectedTravelAllocationHeaders((pre)=>[...pre, {department:option, percentage:''}])
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
        <div className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
            {/* app icon */}
            <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
                <Icon/>
            </div>

            {/* Rest of the section */}
            <div className="w-full h-full mt-10 p-10">
                {/* back link */}
                <div className='flex items-center gap-4 cursor-pointer'>
                    <img className='w-[24px] h-[24px]' src={leftArrow_icon} />
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
                    <MultiSearch 
                        title='Who will Approve this?'
                        placeholder="Name's of managers approving this"
                        onSelect = {(option)=>{updateApprovers(option)}}
                        error={errors.approversError}
                        currentOption={formData.approvers && formData.approvers.length>0? formData.approvers : []}
                        options={listOfAllManagers}/>}
                </div>
                <hr className='my-8' />
                

                {/* allocating travel budget... will be displayed if travel allocation headers are present */}
                { ALLOCATION_HEADER && <div>
                    <p className='text-base font-medium text-neutral-700 font-cabin'>Select responsible departments for this journey.</p>
                    <div className='mt-8'>
                        <Select
                            options={travelAllocationHeaders}
                            onSelect = {(option)=>{handleAllocationHeaderSelect(option)}}
                            placeholder='Select department' 
                            title='Select department' />
                    </div>
                    
                    { selectedTravelAllocationHeaders && selectedTravelAllocationHeaders.length == 0 && 
                    <div className='mt-6 flex gap-4'>
                        <input type='radio' />
                        <p className='text-zinc-800 text-sm font-medium font-cabin'>Not Sure</p>
                    </div>}
                    
                    {selectedTravelAllocationHeaders && selectedTravelAllocationHeaders.length>0 &&
                        <div className='mt-8'>
                        <p className='text-base font-medium text-neutral-700 font-cabin'>Allocate percentage for selected department</p>
                        <div className='flex gap-4 items-center flex-wrap'>
                            {selectedTravelAllocationHeaders && selectedTravelAllocationHeaders.map((item,index)=> 
                                <div className='mt-4 border border-white hover:border-gray-100'>
                                    <InputPercentage 
                                    key={index}
                                    title={item.department} 
                                    textInput={item.percentage}
                                    onBlur={(percentage)=>handleAllocationPercentageChange(percentage, item)}
                                    />
                                </div> )}
                        </div>
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
                        
                <div className='my-8 w-[134px] float-bottom float-right'>
                    <Button 
                        text='Continue' 
                        onClick={handleContinueButton} />
                </div> 
            </div>
        </div>
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


