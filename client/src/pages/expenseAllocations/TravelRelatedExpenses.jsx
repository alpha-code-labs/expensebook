import back_icon from '../../assets/arrow-left.svg'
import Icon from '../../components/common/Icon'
import HollowButton from '../../components/common/HollowButton';
import Button from '../../components/common/Button';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Checkbox from '../../components/common/Checkbox';
import { getTenantOrgHeaders_API, getTenantTravelExpenseAllocations_API, postTenantTravelExpenseAllocation_API } from '../../utils/api';
import Error from '../../components/common/Error';



export default function ({tenantId}) {
  
const [flags, setFlags] = useState({ORG_HEADERS_FLAG:true})
const [orgHeaders, setOrgHeaders] = useState([])
const [selectedOrgHeaders, setSelectedOrgHeaders] = useState([])
const modalRef = useRef(null);
const [showPrompt, setShowPrompt] = useState(false)
const [prompt, setPrompt] = useState(false)

const [isLoading, setIsLoading] = useState(false)
const [loadingErr, setLoadingErr] = useState(null)
    

    useEffect(() => {
        (async function(){
            setIsLoading(true)
            const res = await getTenantOrgHeaders_API({tenantId})
            const flags_res = await axios.get(`http://localhost:8001/api/tenant/${tenantId}/flags`)
            const allocation_res = await getTenantTravelExpenseAllocations_API({tenantId})

            const flags = flags_res.data.flags

            if(res.err || allocation_res.err){
                setLoadingErr(res.err??allocation_res.err)
                console.log('Error fetching data')
                return
            }
                
            console.log(res.data, '...res.data')
            let orgHeadersData = res.data.orgHeaders
            let tmpOrgHeaders = []
            Object.keys(orgHeadersData).forEach(key => {
                if(orgHeadersData[key].length !== 0){
                    tmpOrgHeaders.push({headerName:key, headerValues:orgHeadersData[key]})
                }
            })
    
            console.log(tmpOrgHeaders, '...tmpOrgHeaders')
    
            if(tmpOrgHeaders.length === 0){
                setFlags({...flags, ORG_HEADERS_FLAG:false})
            }
            else{
            setOrgHeaders(tmpOrgHeaders)
            setFlags({...flags, ORG_HEADERS_FLAG:true})
            console.log(tmpOrgHeaders)
            }

            setSelectedOrgHeaders(allocation_res.data.travelExpenseAllocation)
            setIsLoading(false)

        })()
    },[])
  
    const handleOrgHeaderSelection = (e,index) => {
        let tmpSelectedOrgHeaders = [...selectedOrgHeaders]
        if(e.target.checked){
            tmpSelectedOrgHeaders.push(orgHeaders[index])
        }
        else{
            tmpSelectedOrgHeaders = selectedOrgHeaders.filter(h=>h.headerName != orgHeaders[index].headerName)
        }
        setSelectedOrgHeaders(tmpSelectedOrgHeaders)    
    }


    const saveTravelAllocationHeaders = async () => {
        //save travel allocation headers...
        console.log(selectedOrgHeaders, '...selectedOrgHeaders')
        setIsLoading(true)
        const res = await postTenantTravelExpenseAllocation_API({tenantId, allocationHeaders: selectedOrgHeaders})
        setIsLoading(false)
        if(!res.err) alert('Travel Allocations updated !')
    }

    useEffect(() => {
        console.log(selectedOrgHeaders, '...selectedOrgHeaders')
    },[selectedOrgHeaders])

    return(<>
        {isLoading && <Error message={loadingErr} />}
        {!isLoading && <div className="bg-slate-50 min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
            
            <div className='px-6 py-10 bg-white rounded shadow w-full'>
               
                {/* rest of the section */}
                <div className='w-full flex flex-col gap-4'>  
                    
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-4 items-center'>
                            <p className='text text-xl font-cabin text-neutral-700'>
                                {`setup travel related expenses allocations`}
                            </p>
                        </div>
                    </div>

                    <hr/>
                   
                    <p className='text text-base font-cabin text-neutral-700'>
                        Select the entities to which you want to allocate travel related expense
                    </p>

                        <div classsName='shadow bg-white border border-grey-200'>
                        {orgHeaders.map((orgHeader,index) => {
                            return <div className='flex justify-between items-center px-6 py-4 border-b border-grey-200'>
                                <div className='text text-md font-cabin text-neutral-700'>{camelCaseToTitleCase(orgHeader.headerName)}</div>
                                <div className='text text-base font-cabin text-neutral-700'>
                                    <Checkbox id={index} checked={selectedOrgHeaders?.find(h=>h.headerName == orgHeader.headerName)} onClick={(e, id)=>handleOrgHeaderSelection(e, id)} />
                                </div>
                            </div>
                        })}    
                    </div>

                    <div className='flex justify-between'>
                        <Button variant='fit' text='Save Changes' onClick={saveTravelAllocationHeaders} />
                    </div>
                
                    
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

