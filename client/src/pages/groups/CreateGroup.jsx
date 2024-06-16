import React from 'react'
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
import { getEmployeeDetails_API, getTenantGroupingLabels_API, getTenantGroups_API, updateTenantGroups_API } from '../../utils/api'
import Error from '../../components/common/Error'
import MainSectionLayout from '../MainSectionLayout'
import { postProgress_API } from '../../utils/api'

//tracking-tight --for font spacing


export default function ({progress, setProgress, groupData, setGroupData}){

    const navigate = useNavigate()
    //const groupHeaders = props.groupHeaders
    //const employeeData = props.employeeData
    const {state} = useLocation()
    const {tenantId} = useParams()

    console.log(state, 'state')
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
    
    const [filters, setFilters] = useState()

    const [networkStates, setNetworkStates] = useState({isLoading:false, isUploading:false, loadingErrMsg:null})
    const [groupsExist, setGroupsExist] = useState(false)

    //fetch grouping labels and employee data
    useEffect(()=>{
        console.log('This got run')

        async function fetchDetails(){
            try{
                console.log('Trying to fetch data...')
                //fetch grouping labels and employee data
                setNetworkStates(pre=>({...pre, isLoading:true}))
                const label_res = await getTenantGroupingLabels_API({tenantId})
                const emp_res = await getEmployeeDetails_API({tenantId})
                const groups_res = await getTenantGroups_API({tenantId})
                
                if(groups_res.data.groups.length>0){
                    setGroupsExist(true)
                }

                console.log(label_res, 'label res', emp_res )
    
                if(emp_res.err || label_res.err){
                    setLoadingErrMsg(emp_res.err??label_res.err??'Some error ocurred while fetching data')
                    return
                }
    
                const {groupingLabels} = label_res.data
                console.log(groupingLabels)
                setGroupHeaders(groupingLabels.map(label=>label.headerName))
                setSelectedFilters(groupingLabels.map(label=>[]))
                const filters = groupingLabels.map(label=>({title:label.headerName, type:'select', options:label.headerValues}))
                setFilters(filters)
                
                const employeesData = emp_res.data.map(employee=>employee.employeeDetails)
                setEmployeeData(employeesData)
                setFilteredEmployeeList(JSON.parse(JSON.stringify(employeesData)))
                setNetworkStates(pre=>({...pre, isLoading:false}))
            }catch(e){
                console.log(e)
            }
        }

        fetchDetails()

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

    //update delegate checkboxes if filtered employee list changes
    useEffect(()=>{
        setCanDelegate(filteredEmployeeList.map(e=>false))
        setCanDelegateForAll(false) 
    },[filteredEmployeeList])

    //update delegate checkboxes if user selectes or deselects all employees throught select all checkbox
    useEffect(()=>{
        if(canDelegateForAll){
            setCanDelegate(filteredEmployeeList.map(e=>true))
        }
        else{
            setCanDelegate(filteredEmployeeList.map(e=>false))
        }
    }, [canDelegateForAll])
    
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
                    alert('No employees found for the selected filters')
                    return
                }
                else if(filteredEmployeeList.length === employeeData.length){
                    //create default group if no name is given
                    if(groupName === ''){
                        setGroupName('All')
                    }
                    setGroupEmployeeList(employeeData)
        
                    const groupData_copy = JSON.parse(JSON.stringify(groupData))
                    groupData_copy.push({groupName:'All', employees:employeeData, canDelegate, filters:selectedFilters})
                    setGroupData(groupData_copy)
                }
                else{
                    if(groupName === ''){
                        alert('Please enter a group name')
                        return
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




        //Post grups data to backend
        setNetworkStates({isLoading:false, isUploading:true, loadingErrMsg:null})
        const res = await updateTenantGroups_API({tenantId, groups: current_groups_data.map(g=>({groupName:g.groupName, filters:g.filters}))})

        const progress_copy = JSON.parse(JSON.stringify(progress));

        progress_copy.sections['section 4'].subsections.forEach(subsection=>{
            if(subsection.name == 'Create Groups') subsection.completed = true;
        });

        progress_copy.sections['section 4'].subsections.forEach(subsection=>{
            if(subsection.name == 'Create Groups') subsection.completed = true;
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

        const progress_res = await postProgress_API({tenantId, progress: progress_copy})

        if(res.err || progress_res.err){
            setPrompt({showPrompt:true, promptMsg:res.err??progress_res.err, success:false})
            return
        }
        else{
            console.log(res.data)
            setProgress(progress_copy)
            navigate(`/${tenantId}/groups/created-groups`, {state:{groupData}})
        }
    
        
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

    
    return(<>
    <MainSectionLayout>
        {networkStates.isLoading && <Error message={networkStates.loadingErrMsg}/>}
        {!networkStates.isLoading && <>
            <div className='px-6 py-10 bg-white'>
                <p className='text-neutral-700 text-lg font-medium font-cabin'>Apply filters to set groups</p>
                <div ref={filtersDivRef} className='sticky top-5 z-10 bg-white'>
                    <div className='mt-6 w-full flex flex-wrap gap-10'>
                        {Array.isArray(filters) && filters.length>0 && filters.map((filter, index) => {
                            if(filter.type === 'select'){
                                return ( <div key={filter.title} className='min-w-[214px]'>
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
                                return (<React.Fragment key={filter.title}>
                                    <Search  title={filter.title} options={filter.options}/>
                                </React.Fragment>)
                            }
                        })}                    
                    </div>

                    <hr className='mt-10' />
                
            
                    <div className={`-mt-2 sticky top-[${currentFiltersDivHeight}px] bg-white top-0 w-full max-h-[300px] px-auto border border-neutral-200 flex flex-col items-center rounded-xl justify-center`}>
                            <div className='relative w-3/4 mx-1/4 flex flex-col justify-between gap-4 overflow-y-scroll scroll'>
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

                <div className='relative mt-8 flex items-center flex-wrap justify-between bg-white z-20'>
                    <Input 
                        onBlur={(e)=>{setGroupName(e.target.value)}}
                        title='Group Name' 
                        placeholder='eg. Sales Team' />
                    <div className='flex gap-4 flex-wrap md:no-wrap mt-6'>
                        <div className='w-fit'>
                            <Button text='Create Group' onClick={handleCreateGroup} />
                        </div>
                        <div className='w-fit'>
                            <Button text='Show Groups' disabled={!groupsExist} onClick={()=>{navigate(`/${tenantId}/groups/created-groups`)}} />
                        </div>
                    </div>
                </div>
            </div>
        </>}
    </MainSectionLayout>
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