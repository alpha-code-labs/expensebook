import Button from "../../components/common/Button"
import Icon from "../../components/common/Icon"
import { useNavigate, useParams } from "react-router-dom"
import HollowButton from "../../components/common/HollowButton"
import { useEffect, useState } from "react"
import axios from 'axios'
import Input from "../../components/common/Input"
import Checkbox from "../../components/common/Checkbox"
import ObjectSearch from "../../components/common/ObjectSearch"
import close_icon from "../../assets/close.svg"


export default function (props){
    const navigate = useNavigate()
    const {tenantId} = useParams()

    const [loading, setLoading] = useState(true)
    const [loadingError, setLoadingError] = useState(null)
    const [blanketDelegations, setBlanketDelegations] = useState({groups:[], employees:[]})
    const [groups, setGroups] = useState([])
    const [employees, setEmployees] = useState([])


    useEffect(()=>{
        //get tenant expense data
        (async function(){
            try{
                const res = await axios.get(`http://localhost:8001/api/tenant/${tenantId}/blanket-delegations`)
                const groups_res = await axios.get(`http://localhost:8001/api/tenant/${tenantId}/groups`)
                const employees_res = await axios.get(`http://localhost:8001/api/tenant/${tenantId}/employees`)

                const blanketDelegations = res.data.blanketDelegations

                if(res.status === 200 && groups_res.status === 200 && employees_res.status === 200){
                    setBlanketDelegations(blanketDelegations)
                    setGroups(groups_res.data.groups)
                    if(blanketDelegations.groups.toString()!=groups_res.data.groups.toString()){
                        setBlanketDelegations(pre=>({...pre, groups:groups_res.data.groups.map(group=>({...group, canDelegate:false}))}))
                    }
                    const employees = employees_res.data.map(empData=>empData.employeeDetails)
                    setEmployees(employees.map(employee=>({...employee, name:employee.employeeName})))

                    setLoading(false)
                    setLoadingError(null)

                }
                
            }
            catch(e){
                if(e.response){
                    console.error(e.response.data)
                    setLoadingError('Sorry, can not fetch account data at the moment')
                }
                else if(e.request){
                    console.error('Internal server error', e)
                    setLoadingError('Something went wrong, this is on us! We will fix it soon. Please try again later')
                }
                else{
                    console.error('Something went wrong', e)
                    setLoadingError('Something went wrong, this is on us! We will fix it soon. Please try again later')
                }
            }
        })()

    },[])

    useEffect(()=>{
        console.log(blanketDelegations)
    },[blanketDelegations])

    const handleBlanketDelegationGroupChange = (e, index)=>{
        const blanketDelegations_copy = JSON.parse(JSON.stringify(blanketDelegations))
        blanketDelegations_copy.groups[index].canDelegate = e.target.checked
        console.log(blanketDelegations_copy.groups[index])

        setBlanketDelegations(blanketDelegations_copy)
    }   

    const saveBlanketDelegations = async () => {
        //save data to backend
        //do some validation

        try{
            const res = await axios.post(`http://localhost:8001/api/tenant/${tenantId}/blanket-delegations`, {blanketDelegations})
            if(res.status == 200){
                alert('Blanket Delegations Updated !')
                navigate(`/${tenantId}/others/account-lines`)
            }
        }
        catch(e){
            if(e.response){

            }
            else if(e.request){

            }
            else{

            }

            alert('Cant save changes at the moment, please try again later')
        }
    }

    const handleEmployeeSelection = (option)=>{
        
        let alreadySelected = false
        blanketDelegations.employees.forEach(employee=>{
            if(employee.employeeId === option.employeeId){
                alreadySelected = true
                return
            }
        })

       if(!alreadySelected){
        const blanketDelegations_copy = JSON.parse(JSON.stringify(blanketDelegations))
        //check if employee already in list

        blanketDelegations_copy.employees.push(option)
        console.log(blanketDelegations_copy)

        setBlanketDelegations(blanketDelegations_copy)
       }
    }

    const removeSelectedEmployee = (index)=>{
        const blanketDelegations_copy = JSON.parse(JSON.stringify(blanketDelegations))
       
        blanketDelegations_copy.employees.splice(index, 1)

        console.log(blanketDelegations_copy)

        setBlanketDelegations(blanketDelegations_copy)  
    }

    
    return(<>
        <Icon/>
        {loading && <div className="bg-slate-50 min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
            <div className='px-6 py-10 bg-white rounded shadow'>
                {loadingError? loadingError : 'loading..'}
            </div>
        </div>}
        {!loading && <div className="bg-slate-50 min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
            <div className='px-6 py-10 bg-white rounded shadow'>
                <div className="flex justify-between">
                    <div className="gap-2">
                        <p className="text-neutral-700 text-xl font-semibold tracking-tight">
                            Setup Blanket Delegations
                        </p>
                        <p className="text-gray-600 text-sm font-normal font-cabin" >
                            Here you can add groups or employees who are allowed to delegate their reponsibility to other employees
                        </p>
                    </div>
                    <div className="">
                        <HollowButton title='Skip' onClick={()=>navigate(`/${tenantId}/others/account-lines`)} showIcon={false} />
                    </div>
                </div>

                <hr className='mt-4' />

                <div className="mt-10 flex flex-col gap-4">
                    <p className="text-neutral-800 text-sm font-cabin">Select Groups which can delegate</p>
                    <div className="p-4 border border-gray-300 rounded-xl max-w-[380px]">
                        {blanketDelegations.groups.length>0 && blanketDelegations.groups.map((group, index)=>(
                            <>
                                <div className="flex flex-wrap gap-4 lg:gap-8 items-center mt-2">
                                    <p className='text whitespace-wrap text-sm font-cabin text-neutral-700 w-[300px]'>
                                        {group.groupName}
                                    </p>
                                    <div className=''>
                                        <Checkbox checked={group.canDelegate} onChange={(e)=>handleBlanketDelegationGroupChange(e, index)} />
                                    </div>
                                </div>
                            </>
                        )

                        )}
                    </div>
                </div>
                <hr className="mt-8"/>
                <div className='mt-8'>
                            <ObjectSearch title='Search employee who can delegate ?' placeholder='search employee' options={employees} onSelect={handleEmployeeSelection} />
                        </div>
                        {blanketDelegations.employees.length>0 && <>
                        <p className="mt-4 text-sm font-normal text-neutral-700">Selected Employees</p>
                        <div className='mt-2 max-w-[200px] border border-gray-300 rounded-xl p-4 flex flex-col gap-2'>
                            {blanketDelegations.employees.map((emp,index)=><div key={index}>
                                    <div className="flex gap-4 items-center">
                                        <p className='text-neutral-600 w-3/4 text-sm font-cabin'>{emp.name}</p>
                                        <img className='w-4 h-4 cursor-pointer' src={close_icon} onClick={()=>removeSelectedEmployee(index)} />
                                    </div>
                                </div>)}
                        </div></>}
                    
                <div className="mt-10 w-full">
                    <div className="w-fit">
                        <Button text='Save Delegations' onClick={()=>saveBlanketDelegations()} />
                    </div>
                </div>

            </div>
        </div>}
    </>)
}