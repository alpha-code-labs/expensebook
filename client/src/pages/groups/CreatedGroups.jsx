import Button from "../../components/common/Button"
import Icon from "../../components/common/Icon"
import { useNavigate, useParams } from "react-router-dom"
import { useLocation } from "react-router-dom"
import axios from 'axios'
import { useState, useEffect } from "react"

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

    useEffect(()=>{
        if(state==null){
            axios.get(`http://localhost:8001/api/tenant/${tenantId}/groups`)
            .then(res=>{
                const groups = res.data.groups
                if(groups.length>0){
                    setGroupData(groups)
                    setLoading(false)
                    setError(null)
                }
                else if(groups.length==0){
                   // setError(`No groups are found. Click <a href={`/${tenantId}/groups`}>here</a> to setup groups`)
                    setRedirectToSetupGroups(true)
                }

            })
            .catch(error=>{
                if(error.response){
                    //server responded with som error message
                    setError(error.response.data.error)
                }
                else if(error.request){
                    //request placed but no response from server
                    setError('Server error.')
                }
                else{
                    //can not place request
                    setError('Something went wrong. Please try again later')
                    console.log(error)
                }
            })
        }
        else{
            setError('No groups formed yet')
        }
    },[])

    const handleRemove = (index)=>{
        const groupData_copy = JSON.parse(JSON.stringify(groupData))
        groupData_copy.splice(index,1)
        setGroupData(groupData_copy)
    }

    const handleEdit = (index)=>{
        navigate(`${tenantId}/groups/create-groups`, {state:{tenantId:tenantId, groupIndex:index}})
    }

    const updateTenantGroups = async ()=>{
        //Post grups data to backend
        await axios.post(`http://localhost:8001/api/tenant/${tenantId}/groups`, {groups: groupData})
                .then(res=>{
                    console.log(res.data)
                    navigate(`/${tenantId}/setup-company-policies`, {state:{groups:groupData.map(group=>group.groupName)}})
                })

    }

    return(<>
            <Icon/>
            <div className="bg-slate-50 min-h-calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full">
                <div className='px-6 py-10 bg-white rounded shadow'>
                    {loading && <div className='text-lg font-cabin'>
                        {!redirectToSetupGroups && (!error? 'loading...' : error)}
                        {redirectToSetupGroups && <div className="text text-xl font-cabin">No groups are found. Click <a className="underline text-indigo-600" href={`/${tenantId}/groups`}>here</a> to setup groups</div>}
                        </div>}
                    {!loading && <div className="flex flex-col gap-4">
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
                                        <p className='text-sm flex-1 font-cabin text-neutral-700 tracking-tight'>{group.employees.length}</p>
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
                            
                            <div className='w-fit'>
                            <Button
                                onClick={() => updateTenantGroups()} 
                                text='Save & Continue' />
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
    </>)
}