import { useState, useEffect } from 'react'
import leftArrow_icon from '../assets/arrow-left.svg'
import Select from '../components/common/Select'
import ObjectSelect from '../components/custom/page_1/ObjectSelect'
import MultiSearch from '../components/common/MultiSearch'
import Search from '../components/custom/page_1/Search'
import Button from '../components/common/Button'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/common/Icon'
import InputPercentage from '../components/common/InputPercentage'
import Checkbox from '../components/common/Checkbox'
import TableItem from '../components/table/TableItem'

const teamMembers2 = [{name: 'Rajat Rathor', empId: '201', designation: 'Executive'}, {name: 'Ashish Pundir', empId: '205', designation: 'Program Planner'}, {name: 'Ankit Pundir', empId:'209', designation:'Manager'}]

//dummy onboarding data...
const options = ['Meeting with client', 'Sales Trip', 'Business Trip']

const dummyDelegatedFor = [
        {name: 'Ajay Singh', empId:'121', group:'', EmpRole:'', teamMembers:[]}, 
        {name: 'Abhijay Singh', empId:'124', group:'', EmpRole:'', teamMembers:teamMembers2}, 
        {name: 'Akshay Kumar', empId:'127', group:'', EmpRole:'', teamMembers:[]}, 
        {name:'Anandhu Ashok K.', empId:'129', group:'', EmpRole:'', teamMembers:[]}, 
        {name:'kanhaiya', empId:'', group:'135', EmpRole:'', teamMembers:[]}
    ]

    //approvals 
    const APPROVAL_FLAG =  true
    const listOfAllManagers = [
        {name: 'Preeti Arora', empId: '005'},
        {name: 'Abhas Kamboj', empId: '045'},
        {name: 'Sandeep Nair', empId: '061'}
    ]

    //allocation header 
    const ALLOCATION_HEADER = true
    const travelAllocationHeaders = ['Sales', 'Marketing', 'Engineering', 'Research']
    


export default function Page_1(props){

    //details of current employee
    
    const EMPLOYEE_ID  = '123'
    const MANAGER_FLAG =  true
    const teamMembers = [{name: 'Aman Bhagel', empId: '204', designation: 'Sales Executive'}, {name: 'Vikas Rajput', empId: '245', designation:'System Engineer II'}, {name: 'Rahul Suyush Singh', empId: '318', designation:'Sr. Software Engineer'}, {name: 'Vilakshan Vibhut Giri Babaji Maharaj', empId: '158', designation:'Sr. Sales Executive'}]
    

    //trip purpose state variable
    const [tripPurpose, setTripPurpose] = useState(null)
    //can raise request for someone else
    const DELEGATED_FLAG = props.DELEGATED_FLAG || true
    //allowed to raise request for these employees
    const delegatedFor = props.delegatedFor || dummyDelegatedFor

    const [travelRequestCreatedFor, setTravelRequestCreatedFor] = useState([])

    //delegator states
   
    const [raisingForDelegator, setRaisingForDelegator] = useState(false)
    const [nameOfDelegator, setNameOfDelegator] = useState('') 
    const [isDelegatorManager, setIsDelegatorManager] = useState(false)
    const [delegatorsTeamMembers, setDelegatorsTeamMembers] = useState([])
    const [selectDelegatorTeamMembers, setSelectDelegatorTeamMembers] = useState(false)
    const [approvers, setApprovers] =  useState([])

    useEffect(()=>{
        if(DELEGATED_FLAG && travelRequestCreatedFor.length>0 && EMPLOYEE_ID != travelRequestCreatedFor[0]){
            setRaisingForDelegator(true)
            const delegator = delegatedFor.filter(employee=>employee.empId == travelRequestCreatedFor[0])
            const nameOfDelegator = delegator[0].name
            setNameOfDelegator(nameOfDelegator)
            const teamMembers = delegator[0].teamMembers
            setDelegatorsTeamMembers(teamMembers)
            //this logic might not be right if there is a fuckup in integrating the company.
            //some explicit variable from backend might be needed
            
            setIsDelegatorManager(teamMembers && teamMembers.length>0)

            console.log(travelRequestCreatedFor[0])
            console.log(delegatedFor.filter(employee=>employee.empId == travelRequestCreatedFor[0]))
            console.log( {nameOfDelegator, teamMembers, isDelegatorManager} )
        }
    },[travelRequestCreatedFor])

    useEffect(()=>{
        setSelectedTeamMembers([])
    },[selectDelegatorTeamMembers])
    

    const [selectedTravelAllocationHeaders, setSelectedTravelAllocationHeaders] = useState([])

    //if employee is a manager
    const [bookingForSelf, setBookingForSelf] = useState(true)
    const [bookingForTeam, setBookingForTeam] = useState(false)

    useEffect(()=>{
        //reset everything 
        setTravelRequestCreatedFor([])
        setSelectedTravelAllocationHeaders([])

    },[bookingForTeam])


    //team member state and selection method
    const [selectedTeamMembers, setSelectedTeamMembers] = useState([])

    useEffect(()=>{
        console.log(selectedTeamMembers)
    },[selectedTeamMembers])

    const handleTeamMemberSelect = (e, id)=>{

        console.log(id)
        console.log(selectedTeamMembers.includes(id))
        
        if(e.target.checked){
            if(!selectedTeamMembers.includes(id)){
                let updatedMembers = selectedTeamMembers.slice()
                updatedMembers.push(id)
                setSelectedTeamMembers(updatedMembers)
            }
        }
        else{
            if(selectedTeamMembers.includes(id)){
                console.log('this also ran')
                const index = selectedTeamMembers.indexOf(id)
                let updatedMembers = selectedTeamMembers.slice()
                updatedMembers.splice(index,1)
                console.log(updatedMembers)
                setSelectedTeamMembers(updatedMembers)
            }
        }
    }

    const navigate = useNavigate()

    const handleContinueButton = ()=>{
        console.log(sectionForm)
        navigate('/section1')    
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


    const sectionForm =  {
        createdBy:EMPLOYEE_ID,
        createdFor:travelRequestCreatedFor,
        teamMembers:selectedTeamMembers,
        travelAllocationHeaders: selectedTravelAllocationHeaders,
        approvers: approvers
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
                    <div onClick={()=>{setBookingForSelf(pre=>!pre); setBookingForTeam(pre=>!pre)}} className={`${ bookingForSelf? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer transition`}>For You </div>
                    <div onClick={()=>{setBookingForSelf(pre=>!pre); setBookingForTeam(pre=>!pre)}} className={`${ bookingForTeam? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer transition`}>For Team</div>
                </div>

                <hr className='mt-2 -mb-4' /> </> }
                {/* only for manager.. ends.... */}

                {/* form */}

                {/* Trip Purpose */}
                <div className="mt-8">
                    <Select 
                        title='Select trip purpose'
                        placeholder='Select puropse of trip'
                        options={options}
                        currentOption={tripPurpose}
                        onSelect = {(option)=> {setTripPurpose(option.empId)}} />
                </div>


                <div className='mt-8 flex gap-8 flex-wrap'>
                    {/* Booking for.. will be displayed if employee is delegated  */}
                    {DELEGATED_FLAG && <ObjectSelect
                        options={delegatedFor}
                        placeholder='Name of the travelling employeee' 
                        onSelect={(option)=>setTravelRequestCreatedFor([option.empId])}
                        title='Assign request for' />}

                    {/* Select approvers */}
                    {APPROVAL_FLAG && 
                    <Search
                        options={listOfAllManagers}
                        onSelect = {(option)=>{setApprovers(option)}}
                        placeholder='Name of manager approving this' 
                        title='Who will Approve this?' />}
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
                        <div className='flex justify-between gap-1 items-center flex-wrap'>
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
                {((MANAGER_FLAG && bookingForTeam) || isDelegatorManager) && <div className='mt-8'>
                    <div className='flex gap-4 items-center'>
                        {isDelegatorManager && <Checkbox checked={selectDelegatorTeamMembers} onClick={(e)=>{setSelectDelegatorTeamMembers(e.target.checked)}} />} 
                        <p className='text-base font-medium text-neutral-700 font-cabin'>{`${isDelegatorManager? `Select ${nameOfDelegator.split(' ')[0]}'s team members for this trip` : 'Select team members for this trip'}`}</p>
                    </div>

                    {/* table */}
                   { (selectDelegatorTeamMembers || bookingForTeam) &&  
                   <div className='mt-4 w-full h-fit max-h-[800px] px-auto py-8 border border-neutral-200 inline-flex rounded-xl justify-center items-center'>
                        <div className='w-3/4 mx-1/4 flex flex-row justify-between '>
                            
                            {MANAGER_FLAG && teamMembers &&  !selectDelegatorTeamMembers &&
                                <>
                                    <CheckboxCol checked={selectedTeamMembers} onClick={(e, id)=>handleTeamMemberSelect(e, id)} employees={teamMembers}/>
                                    <EmpIdCol employees={teamMembers} />
                                    <NameCol employees={teamMembers}/>
                                    <DesignationCol employees={teamMembers}/>

                                </>
                            }

                            {isDelegatorManager && delegatorsTeamMembers && selectDelegatorTeamMembers &&
                            <>
                                <CheckboxCol checked={selectedTeamMembers} onClick={(e, id)=>handleTeamMemberSelect(e, id)} employees={delegatorsTeamMembers}/>
                                <EmpIdCol employees={delegatorsTeamMembers} />
                                <NameCol employees={delegatorsTeamMembers}/>
                                <DesignationCol employees={delegatorsTeamMembers}/>
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
                {employees && employees.map(employee=>
                    <div className="max-w-[134px] shrink py-2 h-10 justify-start items-center inline-flex">
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
                {employees && employees.map(employee=><TableItem text={employee.name} />)}
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
                {employees && employees.map(employee=><TableItem text={employee.empId} />)}
            </div>
        </div>
    )
}

function DesignationCol(props){
    const employees = props.employees
    console.log('this ran', employees.length)
    return(
        <div className='flex-col sr-only md:not-sr-only justify-start items-start gap-6 inline-flex'>
            <div className="flex-col justify-start items-center gap-2 flex">
                <TableItem text='Designation' header='true' />
                {employees && employees.map(employee=><TableItem text={employee.designation} />)}
            </div>
        </div>
    )
}
