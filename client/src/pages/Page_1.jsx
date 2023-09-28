import { useState, useEffect } from 'react'
import leftArrow_icon from '../assets/arrow-left.svg'
import Select from '../components/common/Select'
import MultiSearch from '../components/common/MultiSearch'
import Search from '../components/common/Search'
import Button from '../components/common/Button'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/common/Icon'
import InputPercentage from '../components/common/InputPercentage'


const options = ['Meeting with client', 'Sales Trip', 'Business Trip']
const dummyDelegatedFor = [{name: 'Ajay Singh', empId:'', group:'', EmpRole:'', teamMembers:[]}, {name: 'Abhijay Singh', empId:'', group:'', EmpRole:'', teamMembers:[]}, {name: 'Akshay Kumar', empId:'', group:'', EmpRole:'', teamMembers:[]}, {name:'Anandhu Ashok K.', empId:'', group:'', EmpRole:'', teamMembers:[]}, {name:'kanhaiya', empId:'', group:'', EmpRole:'', teamMembers:[]}]

export default function Page_1(props){

    const [tripPurpose, setTripPurpose] = useState(null)
    const APPROVAL_FLAG = props.APPROVAL_FLAG || true
    const MANAGER_FLAG = props.MANAGER_FLAG || true
    //can raise request for someone else
    const DELEGATED_FLAG = props.DELEGATED_FLAG || true

    //allocation header 
    const ALLOCATION_HEADER = true
    const allocationHeaderDepartments = ['Sales', 'Marketing', 'Engineering', 'Research']
    const [selectedAllocationHeaders, setSelectedAllocationHeaders] = useState([])

    //allowed to raise request for these employees
    const delegatedFor = props.delegatedFor || dummyDelegatedFor
    const [bookingForSelf, setBookingForSelf] = useState(true)
    const [bookingForTeam, setBookingForTeam] = useState(false)
    const navigate = useNavigate()

    const handleContinueButton = ()=>{
        navigate('/section1')    
    }

    const handleAllocationPercentageChange = (percentage, item)=>{
        
        const updatedSelectedAllocationHeaders =  
        selectedAllocationHeaders.map(prevItem=>{
            if(JSON.stringify(prevItem) == JSON.stringify(item)){
                console.log('item matches')
                return{...prevItem, percentage}
            }
            else{
                console.log('item doesnt matches')
                return prevItem
            }
        })

        console.log(updatedSelectedAllocationHeaders)
          setSelectedAllocationHeaders(updatedSelectedAllocationHeaders)
    
    }

    const handleAllocationHeaderSelect = (option)=>{
        let optionPresent = false
        
        if(selectedAllocationHeaders && selectedAllocationHeaders.length>0){
            selectedAllocationHeaders.forEach(item=>{
                if(item.department.toLowerCase() == option.toLowerCase() ){
                    optionPresent=true
                    return
                }
            })
        }
        
        if(!optionPresent){
            setSelectedAllocationHeaders((pre)=>[...pre, {department:option, percentage:''}])
        }
        
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
                        onSelect = {(option)=> {setTripPurpose(option)}} />
                </div>


                <div className='mt-8 flex gap-8 flex-wrap'>
                    {/* Booking for.. will be displayed if employee is delegated  */}
                    {DELEGATED_FLAG && <Search
                        options={delegatedFor.map(employee=>employee.name)}
                        placeholder='Name of the travelling employeee' 
                        title='Assign request for' />}

                    {/* Select approvers */}
                    {APPROVAL_FLAG && <MultiSearch
                        placeholder='Name of manager approving this' 
                        title='Who will Approve this?' />}
                </div>
                <hr className='my-8' />
                

                {/* allocating budget... will be displayed if allocation headers are present */}
                { ALLOCATION_HEADER && <div>
                    <p className='text-base font-medium text-neutral-700 font-cabin'>Select responsible departments for this journey.</p>
                    <div className='mt-8'>
                        <Select
                            options={allocationHeaderDepartments}
                            onSelect = {(option)=>{handleAllocationHeaderSelect(option)}}
                            placeholder='Select department' 
                            title='Select department' />
                    </div>
                    
                    { selectedAllocationHeaders && selectedAllocationHeaders.length == 0 && 
                    <div className='mt-6 flex gap-4'>
                        <input type='radio' />
                        <p className='text-zinc-800 text-sm font-medium font-cabin'>Not Sure</p>
                    </div>}
                    
                    
                    {selectedAllocationHeaders && selectedAllocationHeaders.length>0 &&
                        <div className='mt-8'>
                        <p className='text-base font-medium text-neutral-700 font-cabin'>Allocate percentage for selected department</p>
                        <div className='flex justify-between gap-1 items-center flex-wrap'>
                            {selectedAllocationHeaders && selectedAllocationHeaders.map((item,index)=> 
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

                            


                <div className='my-8 w-[134px] float-bottom float-right'>
                    <Button 
                        text='Continue' 
                        onClick={handleContinueButton} />
                </div> 
            </div>

</div>
    </>)
}