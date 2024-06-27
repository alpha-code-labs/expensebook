import { useEffect, useRef, useState } from 'react'
import Icon from '../../components/common/Icon'
import Select from '../../components/common/Select'
import MultiSelect from '../../components/common/MultiSelect'
import Search from '../../components/common/Search'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { titleCase } from '../../utils/handyFunctions'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import axios from 'axios'
import Checkbox from '../../components/common/Checkbox'
import { getTenantEmployees_API, getTenantGroupingLabels_API, getTenantGroups_API, updateTenantGroups_API } from '../../utils/api'
import Error from '../../components/common/Error'
import React from "react"
import Prompt from '../../components/common/Prompt'

//tracking-tight --for font spacing


export default function ({tenantId}){

    const [groupData, setGroupData] = useState([])
    //const groupHeaders = props.groupHeaders
    //const employeeData = props.employeeData


    //list of employee after applying filters
    const [groupHeaders, setGroupHeaders] = useState([])
    const [filteredEmployeeList, setFilteredEmployeeList] = useState([])
    const [selectedFilters, setSelectedFilters] = useState()
    const [employeeData, setEmployeeData] = useState([])
    const [groupName, setGroupName] = useState('')
    const [canDelegate, setCanDelegate] = useState([])
    const [canDelegateForAll, setCanDelegateForAll] = useState(false)
    const [groupEmployeeList, setGroupEmployeeList] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingErr, setLoadingErr] = useState(null)
    const [networkStates, setNetworkStates] = useState({isLoading:false, isUploading:false, loadingErrMsg:null});
    const [prompt, setPrompt] = useState({showPrompt: false, success: false, promptMsg: null});

    const [showCreatedGroups, setShowCreatedGroups] = useState(true)
    
    const [filters, setFilters] = useState()

    //fetch groups, grouping labels and employee data
    useEffect(()=>{
        (async function(){

            //fetch groups
            const groups_res = await getTenantGroups_API({tenantId})
            //fetch grouping labels
            const groupingLabels_res = await getTenantGroupingLabels_API({tenantId})
            //fetch employees
            const employees_res = await getTenantEmployees_API({tenantId})

            if(groups_res.err || groupingLabels_res.err || employees_res.err){
                setLoadingErr(groups_res.err??groupingLabels_res.err??employees_res.err)
                return
            }

            //groups
            setGroupData(groups_res.data.groups)

            //labels
            const {groupingLabels} = groupingLabels_res.data
            setGroupHeaders(groupingLabels.map(label=>label.headerName))
            setSelectedFilters(groupingLabels.map(label=>[]))
            const filters = groupingLabels.map(label=>({title:label.headerName, type:'select', options:label.headerValues}))
            setFilters(filters)

            //employees
            const employeesData = employees_res.data.map(employee=>employee.employeeDetails)
            setEmployeeData(employeesData)
            setFilteredEmployeeList(JSON.parse(JSON.stringify(employeesData)))

            setLoading(false)
        })()
    },[])

    //setup filters
      useEffect(()=>{
        const filters = []

        for(const header of groupHeaders){
            const filter = {title:header, type:'select', options:[]}
        //create list of unique values for each header
        const list = [...new Set(employeeData.map(item => item[header]))]
        //sort the list
        if(!isNaN(list[0]))
            list.sort((a,b)=> a-b)
        else 
            list.sort()

        //add the list to the filter
        filter.options = list
        filters.push(filter)
        }

        setFilters(filters)
    },[])

    
    //handle filter selection
    const handleSelect = (options, filter)=>{
        console.log(options, filter, groupHeaders, selectedFilters)
        const index = groupHeaders.indexOf(filter)

        const selectedFilters_copy = JSON.parse(JSON.stringify(selectedFilters))
        selectedFilters_copy[index] = options
        
        setSelectedFilters(selectedFilters_copy)
    }

    const handleCreateGroup = async ()=>{
        let current_groups_data = [];

       await (function(){
            return new Promise((resolve, reject)=>{
                if(filteredEmployeeList.length === 0){
                    setPrompt({showPrompt:true, promptMsg:'No employees found for the selected filters', success:false, informational: true})
                    return
                }
                else if(filteredEmployeeList.length === employeeData.length){
                    //create default group if no name is given
                    console.log(current_groups_data, 'current group data');

                    if(groupName === '' && !groupData.some(g=>g.groupName == 'All')){
                        setGroupName('All')
                    }else{
                        setPrompt({showPrompt:true, promptMsg:'Company wide group "All"  is already present', success:false, informational: true})
                        return;
                    }
                    setGroupEmployeeList(employeeData)
        
                    const groupData_copy = JSON.parse(JSON.stringify(groupData))
                    groupData_copy.push({groupName:'All', employees:employeeData, canDelegate, filters:selectedFilters})
                    setGroupData(groupData_copy)
                    current_groups_data = groupData_copy;
                }
                else{
                    
                    if(groupData.some(g=> JSON.stringify(g.filters) == JSON.stringify(selectedFilters))){
                        const groupName = groupData.find(g=> JSON.stringify(g.filters) == JSON.stringify(selectedFilters)).groupName;
                        setPrompt({showPrompt:true, promptMsg:`Group with selected filters already present by the name  "${groupName}"`, success:false, informational:true})
                        return;
                    }
                    else if(groupName === ''){
                        setPrompt({showPrompt:true, promptMsg:'Please enter a group name', success:false,  informational: true})
                        return
                    }else if(groupData.some(g=>g.groupName == groupName)){
                        setPrompt({showPrompt:true, promptMsg:'Group name already assigned', success:false, informational: true})
                        return;
                    }

                    setGroupEmployeeList(filteredEmployeeList)
                    const groupData_copy = JSON.parse(JSON.stringify(groupData))
                    groupData_copy.push({groupName, employees:filteredEmployeeList, filters:selectedFilters, canDelegate})
                    setGroupData(groupData_copy)
                    current_groups_data = groupData_copy;
                }

                resolve()
            })
        })()


        //Post groups data to backend
        setNetworkStates({isLoading:false, isUploading:true, loadingErrMsg:null})
        const res = await updateTenantGroups_API({tenantId, groups: current_groups_data.map(g=>({groupName:g.groupName, filters:g.filters}))})

        setShowCreatedGroups(true)
    }

    const handleCanSelectChange = (e, index)=>{
        //console.log(e, index)
        let tmpCanDelegate = canDelegate.slice()
        tmpCanDelegate[index] = e.target.checked
        setCanDelegate(tmpCanDelegate)
    }

    
    useEffect(()=>{
        console.log(canDelegate)
    },[canDelegate])


    //for making the table sticky
    const filtersDivRef = useRef(null);
    const [currentFiltersDivHeight, setCurrentFiltersDivHeight] = useState(0);
    useEffect(() => {
        if (filtersDivRef.current) {
          const height = filtersDivRef.current.clientHeight;
          setCurrentFiltersDivHeight(height);
          console.log("Height of the div: " + height + "px");
        }
      }, []);

    //update the filterd employee list, whenevr filters are applied
    useEffect(()=>{
        let filteredEmployeeList = JSON.parse(JSON.stringify(employeeData))
        console.log(groupHeaders, '..groupheaders')
        console.log(selectedFilters)
        for(const index in selectedFilters){
            if(selectedFilters[index].length != 0 && filteredEmployeeList.length>0){
                console.log(index, 'index')
                console.log(selectedFilters[index], groupHeaders[index])
                filteredEmployeeList = filteredEmployeeList.filter(employee=> selectedFilters[index].map(fo=>fo.toLowerCase()).indexOf(employee[groupHeaders[index]].toLowerCase())!=-1)
            }
            setFilteredEmployeeList(filteredEmployeeList)
          }
        
        },[selectedFilters])
    

    useEffect(()=>{
        console.log(selectedFilters)
    },[selectedFilters])

    const handleRemove = (index)=>{
        const groupData_copy = JSON.parse(JSON.stringify(groupData))
        groupData_copy.splice(index,1)
        setGroupData(groupData_copy)
    }

    const updateTenantGroups = async ()=>{
        //Post grups data to backend
        const res = await updateTenantGroups_API({tenantId, groups: groupData})
        if(res.err){
            alert('Unable to update groups at the moment')
        }
        else{
            alert('Groups Updated!')
        }
    }
    
    return(<>
        {loading && <Error message={loadingErr} />}
        {!loading && <>
            {!showCreatedGroups && <>
            {loading && <div className="-h-[100vh] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
                <div className='px-6 py-10 bg-white rounded shadow'>
                    loading grouping labels..
                </div>
            </div> }
            {!loading && <div className="min-h-[100vh] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
                <div className='px-6 py-10'>
                    <p className='text-neutral-700 text-lg font-medium font-cabin'>Apply filters to set groups</p>
                    <div ref={filtersDivRef} className='sticky top-5 z-10'>
                        <div className='mt-6 w-full flex flex-wrap gap-10'>
                            {filters.map((filter, index) => {
                                if(filter.type === 'select'){
                                    return ( <div className='min-w-[214px]'>
                                                <MultiSelect 
                                                    onSelect={(option)=>{handleSelect(option, filter.title)}}
                                                    currentOPtion={selectedFilters?.length>0 ? selectedFilters[index]: null}
                                                    key={index} 
                                                    title={camelCaseToTitleCase(filter.title)} 
                                                    placeholder={`Select ${camelCaseToTitleCase(filter.title)}`}
                                                    options={filter.options}/>
                                            </div>)
                                }
                                else if(filter.type === 'search'){
                                    return <Search key={index} title={filter.title} options={filter.options}/>
                                }
                            })}                    
                        </div>

                        <hr className='mt-10' />
                    
                
                        <div className={`-mt-2 sticky top-[${currentFiltersDivHeight}px] bg-white top-0 w-full max-h-[300px] px-auto border border-neutral-200 flex flex-col items-center rounded-xl justify-center`}>
                                <div className='relative w-3/4 mx-1/4 flex flex-col justify-between gap-4 overflow-y-scroll no-scroll'>
                                    <>
                                        <div className='sticky top-0 pt-2 bg-white border-b z-[100]'>
                                            <div className='bg-white w-full flex flex-row justify-between'>
                                                {['employeeName', ...groupHeaders].map((header,index)=>
                                                    <TableItem key={index} text={camelCaseToTitleCase(header)} header='true' canDelegateForAll={canDelegateForAll} setCanDelegateForAll={setCanDelegateForAll} />
                                                )}    
                                            </div>
                                        </div>

                                        <Table employees={filteredEmployeeList} headers={['employeeName', ...groupHeaders]} handleCanSelectChange={handleCanSelectChange} checked={canDelegate} />
                                    </>
                                </div>
                        </div>
                    </div>

                    <div className='relative mt-8 flex items-center flex-wrap justify-between z-20'>
                        <Input 
                            onBlur={(e)=>{setGroupName(e.target.value)}}
                            title='Group Name' 
                            placeholder='eg. Sales Team' />
                        <div className='flex gap-4 flex-wrap md:no-wrap mt-6'>
                            <div className='w-fit'>
                                <Button text='Create Group' onClick={handleCreateGroup} />
                            </div>
                            <div className='w-fit'>
                                <Button text='Show Groups' onClick={()=>{setShowCreatedGroups(true)}} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </>}
        
        {showCreatedGroups && <>
            <div className="min-h-[100vh] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full">
                <div className='px-6 py-10'>
                    {<div className="flex flex-col gap-4">
                        <div className="flex gap-20 mb-5">
                            <p className='text-sm flex-1 font-cabin text-neutral-500 tracking-tight'>Group Name</p>
                            <p className='text-sm flex-1 font-cabin text-neutral-500 tracking-tight'>Employee Count</p>
                            <p className="flex-1"></p>
                        </div>

                        { groupData.length>0 &&
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
                                    onClick={() => setShowCreatedGroups(false)} 
                                    text='Add Group' />
                            </div>
                
                            <div className='w-fit'>
                            <Button
                                disabled={groupData?.length>0? false : true }
                                onClick={() => updateTenantGroups()} 
                                text='Save & Continue' />
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </>}

        <Prompt prompt={prompt} setPrompt={setPrompt} />
        </>}

        </>)
}



function TableItem(props){
    const text = props.text || 'text'
    const header = props.header || false
    const canDelegateForAll = props.canDelegateForAll 
    const setCanDelegateForAll = props.setCanDelegateForAll 

    return(
            <div className="w-[134px] shrink whitespace-nowrap text-ellipsis overflow-hidden  py-2 h-8 justify-start items-center inline-flex">
                <div className='flex items-center gap-2'>
                    {// header && text=='Can Delegate' && <Checkbox checked={canDelegateForAll} onChange={(e)=>setCanDelegateForAll(e.target.checked)} />
                    }
                    <div className={`${header? 'text-neutral-500' : 'text-neutral-700'} text-sm tracking-tight font-normal font-cabin`}>{text}</div>
                </div>
            </div>
    )
}

function Table(props){
    const employees = props.employees  
    const headers = props.headers
    const handleCanSelectChange = props.handleCanSelectChange
    const checked = props.checked

    console.log(employees)

    console.log(headers, 'headers...', employees.length, 'employees length')

    return(
        <>
            {employees.map((employee, index)=>(
                <div key={index} className='w-full flex flex-row justify-between'>
                   {headers.map((header,ind)=>{

                    // if(header === 'canDelegate')
                    //     return(<div className="w-[134px] shrink whitespace-nowrap text-ellipsis overflow-hidden  py-2 h-8 justify-start items-center inline-flex " >
                    //         <Checkbox checked={checked[index]} onChange={(e)=>{handleCanSelectChange(e,index)}} />
                    //     </div>)
                    // else
                        return(<TableItem key={ind} text={employee[header]}/>)

                   }
                        
                    )}              
                </div>
            ))}
        
        </>
    )

}

function camelCaseToTitleCase(inputString) {
    // Use a regular expression to split words at capital letters
    const words = inputString.split(/(?=[A-Z])/);
  
    // Capitalize the first letter of each word and join them with spaces
    const titleCaseString = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
    return titleCaseString;
  }

function titleCaseToCamelCase(inputString) {
    // Split the title case string into words using spaces
    const words = inputString.split(' ');
  
    // Capitalize the first letter of the first word and convert the rest to lowercase
    const camelCaseString = words[0].toLowerCase() + words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  
    return camelCaseString;
  }