import Button from '../../components/common/Button';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Checkbox from '../../components/common/Checkbox';
import Error from '../../components/common/Error';
import { getTenantGroupingLabels_API } from '../../utils/api';

export default function ({tenantId}) {
  
const [flags, setFlags] = useState({ORG_HEADERS_FLAG:true, GROUPING_HEADERS_FLAG:true})
const [groupHeaders, setGroupHeaders] = useState([])
const [groupingHeaders, setGroupingHeaders] = useState([])
console.log(tenantId, '...tenantId')

const [selectedOrgHeaders, setSelectedOrgHeaders] = useState([])
const [selectedHeaders, setSelectedHeaders] = useState([])

const [isLoading, setIsLoading] = useState(true)
const [loadingErr, setLoadingErr] = useState(null)

useEffect(()=>{
    console.log(selectedHeaders)
}, [selectedHeaders])
    //see if grouping headers and grouping labels are available. if so set the selectedOrgHeaders to that

    //fetch available group headers and Org headers
    useEffect(() => {
     
        (async function (){
            await axios.get(`http://localhost:8001/api/tenant/${tenantId}/org-headers`)
            .then(res => {
                console.log(res.data, '...res.data')
                let orgHeadersData = res.data.orgHeaders
                let tmpOrgHeaders = []
                Object.keys(orgHeadersData).forEach(key => {
                if(orgHeadersData[key].length !== 0){
                    tmpOrgHeaders.push({headerName:key, headerValues:orgHeadersData[key]})
                }
                })
        
                if(tmpOrgHeaders.length === 0){
                    setFlags(prev => ({...prev, ORG_HEADERS_FLAG:false}))
                }
                else{
                    setGroupingHeaders(tmpOrgHeaders)
                }
                
            })
            .catch(err => console.log(err))


            //get groupHeaders 
            axios.get(`http://localhost:8001/api/tenant/${tenantId}/group-headers`)
            .then(res => {
                console.log(res.data, '...res.data')
                let groupHeadersData = res.data.groupHeaders
                let tmpGroupHeaders = []
                Object.keys(groupHeadersData).forEach(key => {
                    if(groupHeadersData[key].length !== 0){
                        tmpGroupHeaders.push({headerName:key, headerValues:groupHeadersData[key]})
                    }
                })
            
                console.log(tmpGroupHeaders, '...tmpGroupHeaders')
            
                if(tmpGroupHeaders.length === 0){
                    setFlags(prev => ({...prev, GROUPING_HEADERS_FLAG:false}))
                }
                else{
                    setGroupHeaders(tmpGroupHeaders)
                    setGroupingHeaders(pre=>[...pre, ...tmpGroupHeaders])
                }
                
                setIsLoading(false)
            })
            
            //get current grouping labesl
            const gl_res = await getTenantGroupingLabels_API({tenantId})
            console.log({gl_res})
            setSelectedHeaders(gl_res.data.groupingLabels)
        })()
    },[])

    const handleHeaderSelection = (e,index) => {
        let tmpSelectedOrgHeaders = [...selectedHeaders]
        if(e.target.checked){
            tmpSelectedOrgHeaders.push(groupingHeaders[index])
        }
        else{
            tmpSelectedOrgHeaders = selectedHeaders.filter(h=>h.headerName != groupingHeaders[index].headerName)
        }
        setSelectedHeaders(tmpSelectedOrgHeaders)    
    }

    const saveGroupHeaders = async () => {
        //save travel allocation headers...
        setIsLoading(true)
        axios
        .post(`http://localhost:8001/api/tenant/${tenantId}/grouping-labels`, {groupingLabels:selectedHeaders})
        .then(res => {
            console.log(res.data, '...res.data')
            setIsLoading(false)
            alert('Grouping Labels Updated')
        })
    }

    return(<>

        {isLoading && <Error message={loadingErr} /> }

        {!isLoading && <div className="bg-slate-50 min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
            
            <div className='px-6 py-10 bg-white rounded shadow w-full'>
               
                {/* rest of the section */}
                <div className='w-full flex flex-col gap-4'>  
                    
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-4 items-center'>
                            <p className='text text-xl font-cabin text-neutral-700'>
                                {`Setup Grouping Labels`}
                            </p>
                        </div>
                    </div>

                    <hr/>
                
                    <>
                    <p className='text text-base font-cabin text-neutral-700'>
                        Please select the relevant elements to form groups
                    </p>

                        <div classsName='shadow bg-white border border-grey-200'>
                        {groupingHeaders.map((orgHeader,index) => {
                            return <div className='flex justify-between items-center px-6 py-4 border-b border-grey-200'>
                                <div className='text text-md font-cabin text-neutral-700'>{camelCaseToTitleCase(orgHeader.headerName)}</div>
                                <div className='text text-base font-cabin text-neutral-700'>
                                    <Checkbox checked={selectedHeaders.find(h=>h.headerName == orgHeader.headerName)} id={index} onClick={(e, id)=>handleHeaderSelection(e,id)} />
                                </div>
                            </div>
                        })}  
                    </div>

                    <div className='flex flex-row-reverse justify-between'>
                        <Button variant='fit' text='Save Changes' onClick={saveGroupHeaders} />
                    </div>
                    </>
                    
                </div>
            </div>

        </div>}
        
        </>
    );
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

