import Button from "../../components/common/Button"
import Icon from "../../components/common/Icon"
import { useNavigate, useParams } from "react-router-dom"
import { useLocation } from "react-router-dom"
import axios from 'axios'
import { useState, useEffect } from "react"
import { updateFor } from "typescript"
import { getTenantGroups_API, updateFormState_API, updateTenantGroups_API } from "../../utils/api"
import Prompt from "../../components/common/Prompt"

export default function CreatedGroups(props){
    const groupData = props.groupData
    const setGroupData = props.setGroupData
    const groupHeaders = props.groupHeaders
    const [error, setError] = useState(null)
    const [redirectToSetupGroups, setRedirectToSetupGroups] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const {state} = useLocation()
    const {tenantId} = useParams()
    const [networkStates, setNetworkStates] = useState({isLoading:false, isUploading:false, loadingErrMsg:null})
    const [prompt, setPrompt] = useState({showPrompt:false, promptMsg:null, success:null})

    useEffect(()=>{

        async function getGroups(){
            setNetworkStates(pre=>({...pre, isLoading:true}))
            const res = await getTenantGroups_API({tenantId})
            if(res.err){
                networkStates(pre=>({...pre, loadingErrMsg:res.err??'Something went wrong while fetching data'}))
                return
            } 
            const groups = res.data.groups 
            if(groups.length>0){
                setGroupData(groups)
                setNetworkStates(pre=>({...pre, isLoading:false, loadingErrMsg:null}))
            }
            else if(groups.length==0){
               // setError(`No groups are found. Click <a href={`/${tenantId}/groups`}>here</a> to setup groups`)
                setRedirectToSetupGroups(true)
            }
        }

        if(state == null)
            getGroups()
        else setNetworkStates({isLoading:false, loadingErrMsg:null, isUploading:false})

    },[])

    const handleRemove = (index)=>{
        const groupData_copy = JSON.parse(JSON.stringify(groupData))
        groupData_copy.splice(index,1)
        setGroupData(groupData_copy)
    }

    const handleEdit = (index)=>{
        navigate(`/${tenantId}/groups/create-groups`, {state:{tenantId:tenantId, groupIndex:index}})
    }

    const updateTenantGroups = async ()=>{
        //Post grups data to backend
        setNetworkStates({isLoading:false, isUploading:true, loadingErrMsg:null})
        const res = await updateTenantGroups_API({tenantId, groups: groupData})

        if(res.err){
            setPrompt({showPrompt:true, promptMsg:res.err, success:false})
            return
        }
        else{
            setPrompt({showPrompt:true, promptMsg:'Groups update', success:true})
            await updateFormState_API({tenantId, state:'/setup-company-policies'})
            console.log(res.data)
            navigate(`/${tenantId}/setup-company-policies`, {state:{groups:groupData.map(group=>group.groupName)}})
        }

    }

    const handleSaveAsDraft = async ()=>{
        setNetworkStates({isLoading:false, isUploading:true, loadingErrMsg:null})
        const res = await updateTenantGroups_API({tenantId, groups: groupData})

        if(res.err){
            setPrompt({showPrompt:true, promptMsg:res.err, success:false})
            return
        }
        else{
            setPrompt({showPrompt:true, promptMsg:'Groups update', success:true})
            await updateFormState_API({tenantId, state:'/setup-company-policies'})
            console.log(res.data)
            window.location.href = import.meta.WEB_PAGE_URL
            //navigate(`/${tenantId}/setup-company-policies`, {state:{groups:groupData.map(group=>group.groupName)}})
        }
    }

    return(<>
            <Icon/>
            <div className="bg-slate-50 min-h-calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full">
                <div className='px-6 py-10 bg-white rounded shadow'>
                    {networkStates.isLoading && <div className='text-lg font-cabin'>
                        {!redirectToSetupGroups && (!error? 'loading...' : error)}
                        {redirectToSetupGroups && <div className="text text-xl font-cabin">No groups are found. Click <a className="underline text-indigo-600" href={`/${tenantId}/groups`}>here</a> to setup groups</div>}
                        </div>}
                    {!networkStates.isLoading && <div className="flex flex-col gap-4">
                        <div className="flex gap-20 mb-5">
                            <p className='text-sm flex-1 font-cabin text-neutral-500 tracking-tight'>Group Name</p>
                            <p className='text-sm flex-1 font-cabin text-neutral-500 tracking-tight'>Employee Count</p>
                            <p className="flex-1"></p>
                        </div>

                        {
                            groupData.map((group, index) => {
                            return(<>
                                    <div className="flex gap-20">
                                        <p className='text-sm flex-1 font-cabin text-neutral-700 tracking-tight'>{group.groupName}</p>
                                        <p className='text-sm flex-1 font-cabin text-neutral-700 tracking-tight'>{}</p>
                                        <div className="flex-1 flex gap-6">
                                            <p 
                                                onClick={()=>handleEdit(index)}
                                                className="text-neutral-700 hover:text-neutral-400 cursor-pointer text-xs font-medium font-cabin">Edit</p>
                                            <p 
                                                onClick={()=>handleRemove(index)}
                                                className="text-red-500 hover:text-red-700 cursor-pointer text-xs font-medium font-cabin">Remove</p>
                                        </div>
                                    </div>
                                    <hr></hr>
                            </>)  
                            })
                        }

                        <div className="flex mt-10 flex-wrap w-full justify-between">
                            
                            <div className='w-fit '>
                                <Button
                                    onClick={() => navigate(`/${tenantId}/groups/create-groups`, {state:{tenantId:tenantId}})} 
                                    text='Add Group' />
                            </div>
                            <Button text='Save As Draft' disabled={groupData?.length>0? false : true } onClick={handleSaveAsDraft}/>
                            <div className='w-fit'>
                            <Button
                                disabled={groupData?.length>0? false : true }
                                onClick={() => updateTenantGroups()} 
                                text='Save & Continue' />
                            </div>
                        </div>

                        <Prompt prompt={prompt} setPrompt={setPrompt}/>
                    </div>}
                </div>
            </div>
    </>)
}