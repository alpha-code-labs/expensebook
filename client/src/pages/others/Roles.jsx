import Button from "../../components/common/Button"
import ObjectSearch from "../../components/common/ObjectSearch"
import { useEffect, useState } from "react"
import axios from 'axios'
import close_icon from "../../assets/close.svg"
import Error from "../../components/common/Error"
import Prompt from "../../components/common/Prompt"
import MainSectionLayout from "../../layouts/MainSectionLayout"


export default function ({tenantId}){
    const [employees, setEmployees] = useState([])
    const [showFinanceSection, setShowFinanceSetion] = useState(true)
    const [showTravelAdminSection, setShowTravelAdminSection] = useState(false)
    const [showSystemAdminSection, setShowSystemAdminSection] = useState(false)

    const [systemRelatedRoles, setSystemRelatedRoles] = useState({finance:[], businessAdmin:[], superAdmin:[]})
    const [loading, setLoading] = useState(true)
    const [loadingError, setLoadingError] = useState(null)
    const [prompt, setPrompt] = useState({showPrompt:false, promptMsg:null})

    const [networkStates, setNetworkStates] = useState({isLoading:false, isUploading:false, loadingErrMsg:null})

    const ONBOARDING_API = import.meta.env.VITE_PROXY_URL

    useEffect(()=>{
        async function fetchEmployees(){
            try{
                setNetworkStates(pre=>({...pre, isLoading:true}))

                const res = await axios.get(`${ONBOARDING_API}/tenant/${tenantId}/employees`)
                const rolesRes = await axios.get(`${ONBOARDING_API}/tenant/${tenantId}/system-related-roles`)

                if(res.status === 200){
                    const employees = res.data.map(empData=>empData.employeeDetails)

                    setEmployees(employees.map(employee=>({...employee, name:employee.employeeName})))
                    console.log(employees.map(employee=>({...employee, name:employee.employeeName})))
                }

                if(rolesRes.status === 200){
                    const systemRelatedRoles = rolesRes.data.systemRelatedRoles
                    setSystemRelatedRoles(systemRelatedRoles)
                }

                if(res.status === 200 && rolesRes.status === 200){
                    setNetworkStates(pre=>({...pre, isLoading:false}))
                }


            }catch(e){
                setNetworkStates(pre=>({...pre, loadingErrMsg: 'Something went wrong, please try again later'}))
                console.log(e)
            }
        }

        if(employees.length === 0){
            fetchEmployees()
        }
    },[])

    const handleFinanceEmployeeSelection = (option)=>{
        if(systemRelatedRoles.finance.find(x=> JSON.stringify(x) == JSON.stringify(option))) return;

        const systemRelatedRoles_copy = JSON.parse(JSON.stringify(systemRelatedRoles))
        systemRelatedRoles_copy.finance.push(option)
        console.log(systemRelatedRoles_copy)

        setSystemRelatedRoles(systemRelatedRoles_copy)
    }

    const removeFinanceEmployee = (index)=>{
        const systemRelatedRoles_copy = JSON.parse(JSON.stringify(systemRelatedRoles))
       
        systemRelatedRoles_copy.finance.splice(index, 1)

        console.log(systemRelatedRoles_copy)

        setSystemRelatedRoles(systemRelatedRoles_copy)  
    }

    const handleBusinessAdminEmployeeSelection = (option)=>{
        if(systemRelatedRoles.businessAdmin.find(x=> JSON.stringify(x) == JSON.stringify(option))) return;

        const systemRelatedRoles_copy = JSON.parse(JSON.stringify(systemRelatedRoles))
        systemRelatedRoles_copy.businessAdmin.push(option)
        console.log(systemRelatedRoles_copy)

        setSystemRelatedRoles(systemRelatedRoles_copy)
    }

    const removeBusinessAdminEmployee = (index)=>{
        const systemRelatedRoles_copy = JSON.parse(JSON.stringify(systemRelatedRoles))
        systemRelatedRoles_copy.businessAdmin.splice(index, 1)

        console.log(systemRelatedRoles_copy)

        setSystemRelatedRoles(systemRelatedRoles_copy)  
    }

    const handleSystemAdminEmployeeSelection = (option)=>{
        if(systemRelatedRoles.superAdmin.find(x=> JSON.stringify(x) == JSON.stringify(option))) return;

        const systemRelatedRoles_copy = JSON.parse(JSON.stringify(systemRelatedRoles))
        systemRelatedRoles_copy.superAdmin.push(option)
        console.log(systemRelatedRoles_copy)

        setSystemRelatedRoles(systemRelatedRoles_copy)
    }

    const removeSystemAdminEmployee = (index)=>{
        const systemRelatedRoles_copy = JSON.parse(JSON.stringify(systemRelatedRoles))
       
        systemRelatedRoles_copy.superAdmin.splice(index, 1)

        console.log(systemRelatedRoles_copy)

        setSystemRelatedRoles(systemRelatedRoles_copy)  
    }

    const [travelAdminSelectd, setTravelAdminSelected] = useState(false);
    const [financeAdminSelectd, setFinanceAdminSelected] = useState(false);
    const [superAdminSelected, setSuperAdminSelected] = useState(false);

    useEffect(()=>{
        if(systemRelatedRoles.businessAdmin.length > 0){
            setTravelAdminSelected(true);
        }else setTravelAdminSelected(false);
        
        if(systemRelatedRoles.finance.length > 0){
            setFinanceAdminSelected(true);
        }else setFinanceAdminSelected(false);

        if(systemRelatedRoles.superAdmin.length > 0){
            setSuperAdminSelected(true);
        }else setSuperAdminSelected(false);

    },[systemRelatedRoles])

    const handleSaveChanges = async ()=>{
        console.log(systemRelatedRoles)

        try{
            setNetworkStates(pre=>({...pre, isUploading:true}))
            const res = await axios.post(`${ONBOARDING_API}/tenant/${tenantId}/system-related-roles`, {systemRelatedRoles})
            let currentSubSection = 'Roles Setup'

            setNetworkStates(pre=>({...pre, isUploading:false}))

            if(res.status === 200){
                //alert('System roles updated!')
                setPrompt({showPrompt:true, promptMsg: 'System roles updated!', success: true})
            }
        }catch(error){
            console.log(error)

            if(error.response){
                if(error.response.status(404)){
                    setPrompt({showPrompt: true, promptMsg: 'Cannot update requested resource', success: false})
                }
            }
            if(error.request){
                setPrompt({showPrompt: true, promptMsg: 'Internal server error', success: false})
            }
            else{
                setPrompt({showPrompt: true, promptMsg: 'Something went wrong please try again later', success: false})
            }
        }
    }

    useEffect(()=>{
        console.log(systemRelatedRoles)
    }, [systemRelatedRoles])

    return(<>
        <MainSectionLayout>
            {networkStates.isLoading && <Error message={networkStates.loadingErrMsg}/>}
            {!networkStates.isLoading && <> 
                <div className='px-6 py-10 bg-white'>
                    <div className="flex justify-between">
                        <div className="gap-2">
                            <p className="text-neutral-700 text-xl font-semibold tracking-tight">
                                System Roles Setup
                            </p>
                            <p className="text-gray-600 text-sm font-normal font-cabin" >
                                This section will help you setup some important roles
                            </p>
                        </div>
                        {/* <div className="">
                            <HollowButton title='Skip' onClick={()=>navigate(`/${tenantId}/others/cash-advance-settlement-options`)} showIcon={false} />
                        </div> */}
                    </div>
                    <hr className='mt-8'/>
                    <div className="mt-10">
                        <div className='border border-gray-300 p-4'>
                        {showFinanceSection && <> <div className="bg-violet-100 rounded-xl border border-indigo-600 ">
                            <div className="p-4 text-base text-indigo-600 font-cabin">
                                <p className='font-medium'>Finance Role</p>
                                <p className='font-medium'>Employees who are tagged with Finance role will be able to settle cash related actions. e.g settling cash advance</p>
                            </div>
                            </div>

                            <div className='mt-8'>
                                <ObjectSearch title='Search Employee' placeholder='search employee' options={employees} onSelect={handleFinanceEmployeeSelection} />
                            </div>
                            {systemRelatedRoles.finance.length>0 && <>
                            <p className="mt-4 text-sm font-normal text-neutral-700">Selected Employees (Fianance)</p>
                            <div className='mt-2 max-w-[200px] border border-gray-300 rounded-xl p-4 flex flex-col gap-2'>
                                {systemRelatedRoles.finance.map((emp,index)=><div key={index}>
                                        <div className="flex gap-4 items-center">
                                            <p className='text-neutral-600 w-3/4 text-sm font-cabin'>{emp.name}</p>
                                            <img className='w-4 h-4 cursor-pointer' src={close_icon} onClick={()=>removeFinanceEmployee(index)} />
                                        </div>
                                    </div>)}
                            </div></>}
                            <div className='mt-10 w-full flex flex-row-reverse'>
                                <div className="w-fit">
                                <div className="w-fit">
                                    <Button disabled={!financeAdminSelectd} text='Next' onClick={()=>{setShowFinanceSetion(false); setShowTravelAdminSection(true); setShowSystemAdminSection(false)}} />
                                </div>
                                </div>
                            </div>
                            </>}

                            {showTravelAdminSection && <> 
                            <div className="bg-violet-100 rounded-xl border border-indigo-600 ">
                            <div className="p-4 text-base text-indigo-600 font-cabin">
                                <p className='font-medium'>Travel Admin Role</p>
                                <p className='font-medium'>Travel Admin is/are responsible for taking care of travel booking e.g booking Flight/Train/Hotel tickets etc. They will be notified whenerver a travel request needs booking</p>
                            </div>
                            </div>

                            <div className='mt-8'>
                                <ObjectSearch title='Search Employee' placeholder='search employee' options={employees} onSelect={handleBusinessAdminEmployeeSelection} />
                            </div>
                            {systemRelatedRoles.businessAdmin.length>0 && <>
                            <p className="mt-4 text-sm font-normal text-neutral-700">Selected Employees (Travel Admin)</p>
                            <div className='mt-2 max-w-[200px] border border-gray-300 rounded-xl p-4 flex flex-col gap-2'>
                                {systemRelatedRoles.businessAdmin.map((emp,index)=><div key={index}>
                                        <div className="flex gap-4 items-center">
                                            <p className='text-neutral-600 w-3/4 text-sm font-cabin'>{emp.name}</p>
                                            <img className='w-4 h-4 cursor-pointer' src={close_icon} onClick={()=>removeBusinessAdminEmployee(index)} />
                                        </div>
                                    </div>)}
                            </div></>}
                            <div className='mt-10 w-full flex justify-between'>
                                <div className="w-fit">
                                    <Button text='Back' onClick={()=>{setShowFinanceSetion(true); setShowTravelAdminSection(false); setShowSystemAdminSection(false)}} />
                                </div>

                                <div className="w-fit">
                                    <Button disabled={!travelAdminSelectd} text='Next' onClick={()=>{setShowFinanceSetion(false); setShowTravelAdminSection(false); setShowSystemAdminSection(true)}} />
                                </div>
                            </div>
                            </>}

                            {showSystemAdminSection && <> 
                            <div className="bg-violet-100 rounded-xl border border-indigo-600 ">
                            <div className="p-4 text-base text-indigo-600 font-cabin">
                                <p className='font-medium'>Super Admin Role</p>
                                <p className='font-medium'>Super Admin is/are responsible for making system level changes which includes - configuring groups, policies, system related roles, updating employee database (if not integrated through API or SFT)</p>
                            </div>
                            </div>

                            <div className='mt-8'>
                                <ObjectSearch title='Search Employee' placeholder='search employee' options={employees} onSelect={handleSystemAdminEmployeeSelection} />
                            </div>
                            {systemRelatedRoles.superAdmin.length>0 && <>
                            <p className="mt-4 text-sm font-normal text-neutral-700">Selected Employees (System Admin)</p>
                            <div className='mt-2 max-w-[200px] border border-gray-300 rounded-xl p-4 flex flex-col gap-2'>
                                {systemRelatedRoles.superAdmin.map((emp,index)=><div key={index}>
                                        <div className="flex gap-4 items-center">
                                            <p className='text-neutral-600 w-3/4 text-sm font-cabin'>{emp.name}</p>
                                            <img className='w-4 h-4 cursor-pointer' src={close_icon} onClick={()=>removeSystemAdminEmployee(index)} />
                                        </div>
                                    </div>)}
                            </div></>}
                            <div className='mt-10 w-full flex justify-between'>
                                <div className="w-fit">
                                    <Button text='Back' onClick={()=>{setShowFinanceSetion(false); setShowTravelAdminSection(true); setShowSystemAdminSection(false)}} />
                                </div>

                                <div className="w-fit">
                                    <Button disabled={!superAdminSelected} isLoading={networkStates.isUploading} text='Save and Continue' onClick={()=>{handleSaveChanges()}} />
                                </div>
                            </div>
                            </>}

                            <Prompt prompt={prompt} setPrompt={setPrompt} timeout={2700}/>
                        </div>
                    </div>
                </div>
            </>}
        </MainSectionLayout>
    </>)
}