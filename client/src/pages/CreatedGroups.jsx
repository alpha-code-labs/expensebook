import Button from "../components/common/Button"
import Icon from "../components/common/Icon"
import { useNavigate } from "react-router-dom"

export default function CreatedGroups(props){
    const groupData = props.groupData
    const setGroupData = props.setGroupData
    const groupHeaders = props.groupHeaders
    const navigate = useNavigate()

    const handleRemove = (index)=>{
        const groupData_copy = JSON.parse(JSON.stringify(groupData))
        groupData_copy.splice(index,1)
        setGroupData(groupData_copy)
    }

    const handleEdit = (index)=>{
        navigate('/setup-group', {state:{groupIndex:index}})
    }

    return(<>
        <div className="bg-slate-50 px-[104px] py-20">
            <Icon/>
            <div className='px-6 py-10 bg-white mt-6 rounded shadow'>
                <div className="flex flex-col gap-4">
                    <div className="flex gap-20 mb-5">
                        <p className='text-sm flex-1 font-cabin text-neutral-500 tracking-tight'>Group Name</p>
                        <p className='text-sm flex-1 font-cabin text-neutral-500 tracking-tight'>Employee Count</p>
                        <p className="flex-1"></p>
                    </div>

                    {
                        groupData.map((group, index) => {
                          return(<>
                                <div className="flex gap-20">
                                    <p className='text-sm flex-1 font-cabin text-neutral-700 tracking-tight'>{group.name}</p>
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
                                onClick={() => navigate('/setup-group')} 
                                text='Add Group' />
                        </div>
                        
                        <div className='w-fit'>
                        <Button
                            onClick={() => navigate('/setup-company-policies', {state:{groups:groupData.map(group=>group.name)}})} 
                            text='Continue' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}