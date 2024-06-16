import Button from "../../components/common/Button"
import React from "react"
import Icon from "../../components/common/Icon"
import { useNavigate, useParams } from "react-router-dom"
import { useLocation } from "react-router-dom"
import axios from 'axios'
import { useState, useEffect } from "react"
import { getTenantGroups_API, updateFormState_API, updateTenantGroups_API } from "../../utils/api"
import Prompt from "../../components/common/Prompt"
import MainSectionLayout from "../MainSectionLayout"
import { postProgress_API } from "../../utils/api"

const redirectionTimeout = import.meta.env.VITE_REDIRECT_TIMEOUT??3000
const promptTimeout = import.meta.env.VITE_PROMPT_TIMEOUT??2700

export default function CreatedGroups({progress, setProgress, groupData, setGroupData}){

    const [error, setError] = useState(null)
    const [redirectToSetupGroups, setRedirectToSetupGroups] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const {state} = useLocation()
    const {tenantId} = useParams()
    const [networkStates, setNetworkStates] = useState({isLoading:false, isUploading:false, loadingErrMsg:null})
    const [prompt, setPrompt] = useState({showPrompt:false, promptMsg:null, success:null})
    const [activeButton, setActiveButton] = useState(null)


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

    const handleRemove = async (index)=>{
        const groupData_copy = JSON.parse(JSON.stringify(groupData))
        groupData_copy.splice(index,1)
       

        setNetworkStates({isLoading:false, isUploading:true, loadingErrMsg:null})
        const res = await updateTenantGroups_API({tenantId, groups: groupData_copy.map(g=>({groupName:g.groupName, filters:g.filters}))})
        if(res.err){
            setPrompt({showPrompt:true, promptMsg:'Can not remove group at the moment please try again', success:false})
            return;
        }

        setGroupData(groupData_copy)
    }

    const handleEdit = (index)=>{
        navigate(`/${tenantId}/groups/create-groups`, {state:{tenantId:tenantId, groupIndex:index}})
    }

    const updateTenantGroups = async ()=>{
        //Post grups data to backend
        setNetworkStates({isLoading:false, isUploading:true, loadingErrMsg:null})
        setActiveButton('Save and Continue')
        const res = await updateTenantGroups_API({tenantId, groups: groupData})
        const progress_copy = JSON.parse(JSON.stringify(progress));

        progress_copy.sections['section 4'].subsections.forEach(subsection=>{
            if(subsection.name == 'Created Groups') subsection.completed = true;
        });

        progress_copy.sections['section 4'].subsections.forEach(subsection=>{
            if(subsection.name == 'Created Groups') subsection.completed = true;
        });

        const markCompleted = !progress_copy.sections['section 4'].subsections.some(subsection=>!subsection.completed)

        let totalCoveredSubsections = 0;
        progress_copy.sections['section 4'].subsections.forEach(subsection=>{
            if(subsection.completed) totalCoveredSubsections++;
        })

        progress_copy.sections['section 4'].coveredSubsections = totalCoveredSubsections; 

        if(markCompleted){
            progress_copy.sections['section 4'].state = 'done';
            if(progress.maxReach==undefined || progress.maxReach==null || progress.maxReach.split(' ')[1] < 5){
                progress_copy.maxReach = 'section 5';
              }
        }else{
            progress_copy.sections['section 4'].state = 'attempted';
        }

        progress_copy.activeSection = 'section 5';

        const progress_res = await postProgress_API({tenantId, progress: progress_copy})

        setNetworkStates({isLoading:false, isUploading:false, loadingErrMsg:null})

        if(res.err || progress_res.err){
            setPrompt({showPrompt:true, promptMsg:res.err??progress_res.err, success:false})
            return
        }
        else{
            setPrompt({showPrompt:true, promptMsg:'Groups Updated!', success:true})
            await updateFormState_API({tenantId, state:'/setup-company-policies'})
            
            console.log(res.data)
            setTimeout(()=>{
                setProgress(progress_copy)
                navigate(`/${tenantId}/setup-company-policies`, {state:{groups:groupData.map(group=>group.groupName)}})
            }, redirectionTimeout)   
        }
    }

    const handleSaveAsDraft = async ()=>{
        setNetworkStates({isLoading:false, isUploading:true, loadingErrMsg:null})
        setActiveButton('Save as Draft')
        const res = await updateTenantGroups_API({tenantId, groups: groupData})
        setNetworkStates({isLoading:false, isUploading:false, loadingErrMsg:null})

        if(res.err){
            setPrompt({showPrompt:true, promptMsg:res.err, success:false})
            return
        }
        else{
            setPrompt({showPrompt:true, promptMsg:'Groups Updated!', success:true})
            await updateFormState_API({tenantId, state:'/setup-company-policies'})

            console.log(res.data)

            setTimeout(()=>{
                window.location.href = import.meta.env.VITE_WEB_PAGE_URL
            }, redirectionTimeout)
        }
    }

    return(<>
        <MainSectionLayout> 
            <div className='px-6 py-10 bg-white'>
                {networkStates.isLoading && <div className='text-lg font-cabin'>
                    {!redirectToSetupGroups && (!error? 'loading...' : error)}
                    {redirectToSetupGroups && <div className="text text-xl font-cabin">No groups are found. Click <a className="underline text-indigo-600" href={`/${tenantId}/groups`}>here</a> to setup groups</div>}
                    </div>}
                {!networkStates.isLoading && <div className="flex flex-col gap-4">
                    <div className="flex gap-20 mb-5">
                        <p className='text-sm flex-1 font-cabin text-neutral-500 tracking-tight'>Group Name</p>
                        <p className="flex-1"></p>
                    </div>

                    {
                        groupData.map((group, index) => {
                        return(<React.Fragment key={group.groupName}>
                                <div className="flex gap-20">
                                    <p className='text-sm flex-1 font-cabin text-neutral-700 tracking-tight'>{group.groupName}</p>
                                    <p className='text-sm flex-1 font-cabin text-neutral-700 tracking-tight'>{}</p>
                                    <div className="flex-1 flex gap-6">
                                    {/* <p 
                                        onClick={()=>handleEdit(index)}
                                        className="text-neutral-700 hover:text-neutral-400 cursor-pointer text-xs font-medium font-cabin">Edit</p> */}
                                        <p 
                                            onClick={()=>handleRemove(index)}
                                            className="text-red-500 hover:text-red-700 cursor-pointer text-xs font-medium font-cabin">Remove</p>
                                    </div>
                                </div>
                                <hr></hr>
                        </React.Fragment>)  
                        })
                    }

                    <div className="flex mt-10 flex-wrap w-full justify-between">
                        
                        <div className='w-fit '>
                            <Button
                                onClick={() => navigate(`/${tenantId}/groups/create-groups`, {state:{tenantId:tenantId}})} 
                                text='Add Group' />
                        </div>
                        {/* <Button 
                            isLoading={networkStates.isUploading && activeButton == 'Save as Draft'}
                            text='Save As Draft' 
                            disabled={groupData?.length>0? false : true } 
                            onClick={handleSaveAsDraft}/> */}

                        <div className='w-fit'>
                        <Button
                            isLoading={networkStates.isUploading && activeButton == 'Save and Continue'}
                            disabled={groupData?.length>0? false : true }
                            onClick={() => updateTenantGroups()} 
                            text='Save and Continue' />
                        </div>
                    </div>

                    <Prompt prompt={prompt} setPrompt={setPrompt} timeout={promptTimeout}/>
                </div>}
            </div>     
        </MainSectionLayout>
    </>)
}