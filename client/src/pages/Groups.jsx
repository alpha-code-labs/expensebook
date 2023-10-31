import { useEffect, useRef, useState } from 'react'
import Icon from '../components/common/Icon'
import Select from '../components/common/Select'
import MultiSelect from '../components/common/MultiSelect'
import Search from '../components/common/Search'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { titleCase } from '../utils/handyFunctions'
import { useNavigate, useLocation } from 'react-router-dom'

//tracking-tight --for font spacing


export default function Groups(props){

    const navigate = useNavigate()
    const setGroupData = props.setGroupData
    const groupData = props.groupData
    const groupHeaders = props.groupHeaders
    const employeeData = props.employeeData
    const {state} = useLocation()

    console.log(state, 'state')


        //list of employee after applying filters
    const [filteredEmployeeList, setFilteredEmployeeList] = useState(JSON.parse(JSON.stringify(employeeData)))
    const [selectedFilters, setSelectedFilters] = useState(groupHeaders.map(item=>[]))
    const employeeCount = employeeData.length
    const [groupName, setGroupName] = useState('')
    const [groupEmployeeList, setGroupEmployeeList] = useState([])

    const [filters, setFilters] = useState([
        {title:'Designation', type:'select', options:['CEO', 'CTO', 'COO', 'CFO', 'Manager', 'Developer', 'Designer', 'Tester', 'Intern']},
        {title:'Department', type: 'select', options:['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Legal', 'Support']},
        {title:'Location', type: 'select', options:['Mumbai', 'Delhi', 'Grugaon']},
        {title:'Years of Experience', type: 'select', options:['0-1', '1-2', '2-3', '3-4', '4-5', '5+']}
    ])


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

    
    const handleSelect = (options, filter)=>{
        console.log(options, filter)
        const index = groupHeaders.indexOf(filter.toLowerCase())

        const selectedFilters_copy = JSON.parse(JSON.stringify(selectedFilters))
        selectedFilters_copy[index] = options
        
        setSelectedFilters(selectedFilters_copy)
    }

    const handleCreateGroup = async ()=>{
        
       await (function(){
            return new Promise((resolve, reject)=>{
                if(filteredEmployeeList.length === 0){
                    alert('No employees found for the selected filters')
                    return
                }
                else if(filteredEmployeeList.length === employeeCount){
                    //create default group if no name is given
                    if(groupName === ''){
                        setGroupName('Default Group')
                    }
                    setGroupEmployeeList(employeeData)
        
                    const groupData_copy = JSON.parse(JSON.stringify(groupData))
                    groupData_copy.push({name:groupName, employees:employeeData})
                    setGroupData(groupData_copy)
                }
                else{
                    if(groupName === ''){
                        alert('Please enter a group name')
                        return
                    }
                    setGroupEmployeeList(filteredEmployeeList)
                    const groupData_copy = JSON.parse(JSON.stringify(groupData))
                    groupData_copy.push({name:groupName, employees:filteredEmployeeList, filters:selectedFilters})
                    setGroupData(groupData_copy)
                }

                resolve()
            })
        })()

        navigate('/created-groups')
    }

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

        for(const index in selectedFilters){
            if(selectedFilters[index].length != 0){
                filteredEmployeeList = filteredEmployeeList.filter(employee=> selectedFilters[index].indexOf(employee[groupHeaders[index]])!=-1)
            }
            setFilteredEmployeeList(filteredEmployeeList)
          }
        
        },[selectedFilters])
    

    useEffect(()=>{
        console.log(selectedFilters)
    },[selectedFilters])

    
    return(<>

        <div className="bg-slate-50 px-[104px] py-20">
            <Icon/>
            <div className='px-6 py-10 bg-white mt-6 rounded shadow'>
                <p className='text-neutral-700 text-lg font-medium font-cabin'>Apply filters to set groups</p>
                <div ref={filtersDivRef} className='sticky top-5 z-10 bg-white'>
                    <div className='mt-6 w-full flex flex-wrap gap-10'>
                        {filters.map((filter, index) => {
                            if(filter.type === 'select'){
                                return ( <div className='min-w-[214px]'>
                                            <MultiSelect 
                                                onSelect={(option)=>{handleSelect(option, filter.title)}}
                                                currentOPtion={selectedFilters?.length>0 ? selectedFilters[index]: null}
                                                key={index} 
                                                title={filter.title} 
                                                placeholder={`Select ${filter.title}`}
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
                            <div className='relative w-3/4 mx-1/4 flex flex-col justify-between gap-4 overflow-y-scroll scroll'>
                                <>
                                    <div className='sticky top-0 pt-2 bg-white border-b'>
                                        <div className='bg-white w-full flex flex-row justify-between'>
                                            {['name', ...groupHeaders].map((header,index)=>
                                                <TableItem key={index} text={titleCase(header)} header='true' />
                                            )}    
                                        </div>
                                    </div>

                                    <Table employees={filteredEmployeeList} headers={['name', ...groupHeaders]}/>
                                </>
                            </div>
                    </div>
                </div>

                <div className='relative mt-8 flex items-center flex-wrap justify-between bg-white z-20'>
                    <Input 
                        onBlur={(e)=>{setGroupName(e.target.value)}}
                        title='Group Name' 
                        placeholder='eg. Sales Team' />
                    <div className='flex gap-4 flex-wrap md:no-wrap'>
                        <div className='w-fit'>
                            <Button text='Create Group' onClick={handleCreateGroup} />
                        </div>
                        <div className='w-fit'>
                            <Button text='Show Groups' onClick={()=>{navigate('/created-groups')}} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        </>)
}



function TableItem(props){
    const text = props.text || 'text'
    const header = props.header || false

    return(
            <div className="w-[134px] shrink whitespace-nowrap text-ellipsis overflow-hidden  py-2 h-8 justify-start items-center inline-flex">
                <div className={`${header? 'text-neutral-500' : 'text-neutral-700'} text-sm tracking-tight font-normal font-cabin`}>{text}</div>
            </div>
    )
}


function Table(props){
    const employees = props.employees
    const headers = props.headers


    console.log(headers, 'headers...', employees.length, 'employees length')

    return(
        <>
            {employees.map((employee, index)=>(
                <div key={index} className='w-full flex flex-row justify-between'>
                   {headers.map((header,index)=>
                        <TableItem key={index} text={employee[header]}/>
                    )}              
                </div>
            ))}
        
        </>
    )

}

