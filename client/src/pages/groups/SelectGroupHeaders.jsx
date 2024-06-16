import back_icon from '../../assets/arrow-left.svg'
import Icon from '../../components/common/Icon'
import HollowButton from '../../components/common/HollowButton';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Checkbox from '../../components/common/Checkbox';
import { updateFormState_API } from '../../utils/api';
import UploadAdditionalHeaders from '../expenseAllocations/UploadAdditionalHeaders';
import Error from '../../components/common/Error';
import MainSectionLayout from '../MainSectionLayout';
import { postProgress_API } from '../../utils/api';

export default function ({progress, setProgress}) {
  
const [showSkipModal, setShowSkipModal] = useState(false);
const [showAddHeaderModal, setShowAddHeaderModal] = useState(false)
const [updatedOrgHeaders, setUpdatedOrgHeaders] = useState([])

const {state} = useLocation()
const navigate = useNavigate();
const [flags, setFlags] = useState({ORG_HEADERS_FLAG:true, GROUPING_HEADERS_FLAG:true})
const [orgHeaders, setOrgHeaders] = useState([])
const [groupHeaders, setGroupHeaders] = useState([])
const [readyToSelect, setReadyToSelect] = useState(false)
const tenantId = state?.tenantId || '1yu6mk0lo'
console.log(tenantId, '...tenantId')

const [selectedOrgHeaders, setSelectedOrgHeaders] = useState([])
const [selectedGroupHeaders, setSelectedGroupHeaders] = useState([])
const [loading, setLoading] = useState(true)

const ONBOARDING_API = import.meta.env.VITE_PROXY_URL

    //see if grouping headers and grouping labels are available. if so set the selectedOrgHeaders to that
    // {target: {checked: true}}
    //fetch available group headers and Org headers
    useEffect(() => {
     
        (async function (){
            await axios.get(`${ONBOARDING_API}/tenant/${tenantId}/org-headers`)
            .then(res => {
                console.log(res.data, '...res.data')
                let orgHeadersData = res.data.orgHeaders
                let tmpOrgHeaders = []
                Object.keys(orgHeadersData).forEach(key => {
                if(orgHeadersData[key].length !== 0){
                    tmpOrgHeaders.push(key)
                }
                })
        
                if(tmpOrgHeaders.length === 0){
                    setFlags(prev => ({...prev, ORG_HEADERS_FLAG:false}))
                }
                else{
                setOrgHeaders(tmpOrgHeaders)
                }
                
            })
            .catch(err => console.log(err))
            

            //set groupHeaders 
            axios.get(`${ONBOARDING_API}/tenant/${tenantId}/group-headers`)
            .then(res => {
                console.log(res.data, '...res.data')
                let groupHeadersData = res.data.groupHeaders
                let tmpGroupHeaders = []
                Object.keys(groupHeadersData).forEach(key => {
                    if(groupHeadersData[key].length !== 0){
                    tmpGroupHeaders.push(key)
                    }
                })
            
                console.log(tmpGroupHeaders, '...tmpGroupHeaders')
            
                if(tmpGroupHeaders.length === 0){
                    setFlags(prev => ({...prev, GROUPING_HEADERS_FLAG:false}))
                }
                else{
                    setGroupHeaders(tmpGroupHeaders)
                }
                
                setLoading(false)
            }) 
        })()


    },[updatedOrgHeaders])

    const selectAllRef = useRef(null);
    const [allSelected, setAllSelected] = useState(false);
  
    const handleOrgHeaderSelection = (e,index) => {
        console.log(e, e.target.checked, index, 'what is clicked in org headers')


        let tmpSelectedOrgHeaders = [...selectedOrgHeaders]
        if(e.target.checked){
            console.log('target is checked ')
            tmpSelectedOrgHeaders.push(orgHeaders[index])
        }
        else{
            let orgHeaderIndex = tmpSelectedOrgHeaders.indexOf(orgHeaders[index])
            tmpSelectedOrgHeaders.splice(orgHeaderIndex,1)
        }

        setSelectedOrgHeaders(tmpSelectedOrgHeaders)    
    }

    const handleGroupHeaderSelection = (e, index) => {
        let tmpSelectedGroupHeaders = [...selectedGroupHeaders]
        if(e.target.checked){
            tmpSelectedGroupHeaders.push(groupHeaders[index])
        }
        else{
            let groupHeaderIndex = tmpSelectedGroupHeaders.indexOf(groupHeaders[index])
            tmpSelectedGroupHeaders.splice(groupHeaderIndex,1)
        }

        setSelectedGroupHeaders(tmpSelectedGroupHeaders)    
    }

    useEffect(()=>{
        if(selectedGroupHeaders.length == groupHeaders.length && selectedOrgHeaders.length == orgHeaders.length){
            console.log('everything got selected', selectAllRef.current);
            if(selectAllRef.current != null){
                selectAllRef.current.checked = true;
            }
        }

    }, [selectedGroupHeaders, selectedOrgHeaders])

    const saveGroupHeaders = async () => {
        //save travel allocation headers...
        console.log(selectedOrgHeaders, selectedGroupHeaders, '...selectedGroupHeaders')
        //get org headers
        const orgHeadersData = await axios.get(`${ONBOARDING_API}/tenant/${tenantId}/org-headers`)
        console.log(orgHeadersData, '...orgHeadersData')
        let selectedOrgHeadersData = selectedOrgHeaders.map(orgHeader => ({headerName:orgHeader, headerValues:orgHeadersData.data.orgHeaders[orgHeader]}))
        
        const groupHeadersData = await axios.get(`${ONBOARDING_API}/tenant/${tenantId}/group-headers`)
        console.log(groupHeadersData, '...groupHeadersData')
        let selectedGroupHeadersData = selectedGroupHeaders.map(groupHeader => ({headerName:groupHeader, headerValues:groupHeadersData.data.groupHeaders[groupHeader]}))


        axios
        .post(`${ONBOARDING_API}/tenant/${tenantId}/grouping-labels`, {groupingLabels:[...selectedOrgHeadersData, ...selectedGroupHeadersData]})
        .then(res => {
            console.log(res.data, '...res.data')
            
        })
        
        const groupingLabels_res = await axios.post(`${ONBOARDING_API}/tenant/${tenantId}/grouping-labels`, {groupingLabels:[...selectedOrgHeadersData, ...selectedGroupHeadersData]})
        
        const progress_copy = JSON.parse(JSON.stringify(progress));

        progress_copy.sections['section 4'].subsections.forEach(subsection=>{
            if(subsection.name == 'Select Filters') subsection.completed = true;
        });

        progress_copy.sections['section 4'].subsections.forEach(subsection=>{
            if(subsection.name == 'Select Filters') subsection.completed = true;
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

        setProgress(progress_copy);

        navigate(`/${tenantId}/groups/create-groups`, {state:{tenantId}})

        
    }

    const handleSaveAsDraft = async () => {
        //save travel allocation headers...
        console.log(selectedOrgHeaders, selectedGroupHeaders, '...selectedGroupHeaders')
        //get org headers
        const orgHeadersData = await axios.get(`${ONBOARDING_API}/tenant/${tenantId}/org-headers`)
        console.log(orgHeadersData, '...orgHeadersData')
        let selectedOrgHeadersData = selectedOrgHeaders.map(orgHeader => ({headerName:orgHeader, headerValues:orgHeadersData.data.orgHeaders[orgHeader]}))
        
        const groupHeadersData = await axios.get(`${ONBOARDING_API}/tenant/${tenantId}/group-headers`)
        console.log(groupHeadersData, '...groupHeadersData')
        let selectedGroupHeadersData = selectedGroupHeaders.map(groupHeader => ({headerName:groupHeader, headerValues:groupHeadersData.data.groupHeaders[groupHeader]}))


        axios
        .post(`${ONBOARDING_API}/tenant/${tenantId}/grouping-labels`, {groupingLabels:[...selectedOrgHeadersData, ...selectedGroupHeadersData]})
        .then(res => {
            console.log(res.data, '...res.data')
           // navigate(`/${tenantId}/groups/create-groups`, {state:{tenantId}})
        })
        
        //update form state
        const update_res = await updateFormState_API({tenantId, state:'groups/create-groups'})
        if(update_res.err){
            console.log(update_res.err)
            return
        }
        window.location.href = 'http://google.com'
    }

    const handleSelectAll = (e)=>{
        let tmpGroupHeaders = [];
        let tmpOrgHeaders= [];

        if(e.target.checked){
            orgHeaders.forEach((header) => tmpOrgHeaders.push(header))
            groupHeaders.forEach((header) => tmpGroupHeaders.push(header));
        }

        setSelectedGroupHeaders(tmpGroupHeaders);
        setSelectedOrgHeaders(tmpOrgHeaders);
    }


    useEffect(() => {
        console.log(selectedOrgHeaders, '...selectedOrgHeaders')
        console.log(selectedGroupHeaders, '...selectedGroupHeaders')

        if(selectedGroupHeaders.length == groupHeaders.length && selectedOrgHeaders.length == orgHeaders.length){
            setAllSelected(true);
        }else{ setAllSelected(false); }

    },[selectedOrgHeaders, selectedGroupHeaders])

    return(<>
    <MainSectionLayout>
        {loading && <Error/> }
        {!loading && <>
        
            <div className='px-6 py-10 bg-white'>
               
                {/* rest of the section */}
                <div className='w-full flex flex-col gap-4'>  
                    
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-4 items-center'>
                           {readyToSelect && <div className='cursor-pointer'>
                                <img src={back_icon} onClick={()=>{setReadyToSelect(false)}} />
                            </div>}
                            {!readyToSelect && <div className='cursor-pointer'>
                                <img src={back_icon} onClick={()=>{navigate(-1)}} />
                            </div> }
                            <p className='text text-xl font-cabin text-neutral-700'>
                                {!readyToSelect ? `Let's setup your groups` : `Setup Groups`}
                            </p>
                        </div>
                        <div>
                            <HollowButton title='Skip' onClick={()=>navigate(`/${tenantId}/others`, {state:{tenantId}})} />
                        </div>
                    </div>

                    <hr/>
                  { !readyToSelect && <>
                        <p className='text text-base font-cabin text-neutral-700'>
                        We have identified the following elements from your HR data, that we think can be used to form groups. 
                    </p>

                    <div className='text text-sm font-cabin'>
                        {orgHeaders.map((orgHeader,ind) => {
                            return <div key={`${orgHeader}-${ind}`} className='flex px-6'>
                                <div className='text-md text-neutral-600'>{camelCaseToTitleCase(orgHeader)}</div>
                            </div>
                        })}
                        {groupHeaders.map(groupHeader => {
                            return <div className='flex px-6'>
                                <div className='text-md text-neutral-600'>{camelCaseToTitleCase(groupHeader)}</div>
                            </div>
                        })}
                    </div>

                    <div>
                    <p className='text text-base font-cabin text-neutral-700'>
                            Are all the values you want present in above list? 
                        </p>
                        <div className='flex gap-10 mt-4'>
                            <div>
                                <Button text='Yes' onClick={()=>setReadyToSelect(true)} />
                            </div>
                            <div>
                                <Button text='No' onClick={()=>setShowAddHeaderModal(true)} />
                            </div>
                        </div>
                    </div>
                    </>
                  }

                    {readyToSelect &&                     
                        <>
                        <div className='flex justify-between pr-6'>
                            <p className='text text-base font-cabin text-neutral-700'>
                                Please select the relevant elements to form groups
                            </p>
                            <Checkbox checked={allSelected??false} ref={selectAllRef} onClick={handleSelectAll} />
                        </div>

                         <div classsName='shadow bg-white border border-grey-200'>
                            {orgHeaders.map((orgHeader,index) => {
                                return <div className='flex justify-between items-center px-6 py-4 border-b border-grey-200'>
                                    <div className='text text-md font-cabin text-neutral-700'>{camelCaseToTitleCase(orgHeader)}</div>
                                    <div className='text text-base font-cabin text-neutral-700'>
                                        <Checkbox checked={selectedOrgHeaders.includes(orgHeader)} id={index} onClick={(e, id)=>handleOrgHeaderSelection(e,id)} />
                                    </div>
                                </div>
                            })}
                            {groupHeaders.map((groupHeader,index) => {
                                return <div className='flex justify-between items-center px-6 py-4 border-b border-grey-200'>
                                    <div className='text text-md font-cabin text-neutral-700'>{camelCaseToTitleCase(groupHeader)}</div>
                                    <div className='text text-base font-cabin text-neutral-700'>
                                        <Checkbox checked={selectedGroupHeaders.includes(groupHeader)}  id={index} onClick={(e, id)=>handleGroupHeaderSelection(e,id)} />
                                    </div>
                                </div>
                            })}    
                        </div>

                        <div className='flex justify-between'>
                            {/* <Button text='Save As Draft' variant='fit' disabled={selectedGroupHeaders.length==0 && selectedOrgHeaders.length==0} onClick={handleSaveAsDraft} /> */}
                            <div className='fit'>
                                <div>
                                    <Button text='Continue' disabled={selectedGroupHeaders.length==0 && selectedOrgHeaders.length==0} onClick={()=>setShowSkipModal(true)} />
                                </div>
                            </div>
                        </div>
                        </>
                    }
                </div>
            </div>

            
            <Modal showModal={showSkipModal} setShowModal={setShowSkipModal} skipable={true}>
                <div className='p-10'>
                    
                    { (selectedOrgHeaders.length>0 || selectedGroupHeaders.length>0) &&  <>
                        <p className='text-neutral-700 text-base font-cabin '>Selected Options: </p>
                    <div className='flex flex-col gap-4 mt-4'>
                        {[...selectedOrgHeaders, ...selectedGroupHeaders].map(header => {
                            return <div className='text text-sm font-cabin text-neutral-700'>{camelCaseToTitleCase(header)}</div>
                        })}
                    </div>

                    <div className='w-[200px] mt-10'>
                        <Button text='Correct' onClick={()=>{saveGroupHeaders()}} />
                    </div>
                    </>
                    }

                    {selectedOrgHeaders.length===0 && selectedGroupHeaders.length ==0 && <>
                        
                        <p className='text-neutral-700 text-base font-cabin '>You have not selected any options, do you want to skip this step? </p>
                        <div className='flex justify-between items-center mt-6  '> 
                            <div className=''>
                                <Button text='Yes' onClick={()=>{navigate('/expense-allocations/travel-related', {state:{tenantId}})}} />
                            </div>
                            <div>
                                <Button text='No' onClick={()=>{setShowSkipModal(false)}} />
                            </div> 
                        </div>
                    </>}

                    
                </div>
            </Modal>

            {showAddHeaderModal && 
                <UploadAdditionalHeaders 
                showAddHeaderModal={showAddHeaderModal} 
                tenantId={tenantId}
                setUpdatedOrgHeaders={setUpdatedOrgHeaders}
                setShowAddHeaderModal={setShowAddHeaderModal} />}
            
        </>}
    </MainSectionLayout>
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

