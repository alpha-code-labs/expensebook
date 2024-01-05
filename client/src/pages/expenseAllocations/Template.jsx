import back_icon from '../../assets/arrow-left.svg'
import Icon from '../../components/common/Icon'
import HollowButton from '../../components/common/HollowButton';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Checkbox from '../../components/common/Checkbox';
import Input from '../../components/common/Input';
import remove_icon from '../../assets/XCircle.svg'
import UploadFile from '../../components/common/UploadFile';
import DownloadTemplate from '../../components/DownloadExcelTemplate';
import file_icon from '../../assets/teenyicons_csv-solid.svg'
import { updateFormState_API } from '../../utils/api';
import { titleCase } from '../../utils/handyFunctions';


export default function ({type, next, tenantId}) {
  
const [showSkipModal, setShowSkipModal] = useState(false);
const [showAddHeaderModal, setShowAddHeaderModal] = useState(false)

const {state} = useLocation()
const navigate = useNavigate();
const [flags, setFlags] = useState({ORG_HEADERS_FLAG:true})
const [orgHeaders, setOrgHeaders] = useState([])
const [readyToSelect, setReadyToSelect] = useState(false)
console.log(tenantId, '...tenantId')
const [selectedOrgHeaders, setSelectedOrgHeaders] = useState([])
const [addedHeaders, setAddedHeaders] = useState([''])
const [readyToUpload, setReadyToUpload] = useState(false)
const [selectedFile, setSelectedFile] = useState(null);
const [fileSelected, setFileSelected] = useState(false);
const [excelData, setExcelData] = useState(null)
const [employeeData, setEmployeeData] = useState([])
const [templateColumns, setTemplateColumns] = useState([])
const [templateData, setTemplateData] = useState([])
const modalRef = useRef(null);
const [excelDataError, setExcelDataError] = useState(null)
const [headersUpdated, setHeadersUpdated] = useState(false)
const [showPrompt, setShowPrompt] = useState(false)
const [prompt, setPrompt] = useState(false)


    useEffect(()=>{
        if(showSkipModal || showAddHeaderModal){
            document.body.style.overflow = 'hidden'
        }
        else{
            document.body.style.overflow = 'visible'
        }

    },[showSkipModal, showAddHeaderModal])

    const handleUpload = async ()=>{
        setExcelDataError(null)
        let errorSet = false
        console.log(excelData, '...excelData')
        if(excelData){
            addedHeaders.forEach(header => {
                excelData.forEach(row => {
                    if(row[header] === undefined || row[header]==='' || row[header]===null){
                        setExcelDataError(`Header ${header} is missing values for one or more employees`)
                        errorSet = true
                        return
                    }
                })
            })

            if(!errorSet){
                //added header have values..

                async function updateOrgHeaders(){
                    try{            
                        const existingOrgHeadersData = await axios.get(`http://localhost:8001/api/tenant/${tenantId}/org-headers`)

                        let extraOrgHeaders = addedHeaders.map(header => ({ header:header, values:[...new Set(excelData.map(row => row[header]))] }))

                        //append extraOrgHeaders to existingOrgHeadersData
                        extraOrgHeaders.forEach(extraOrgHeader => {
                            existingOrgHeadersData.data.orgHeaders[titleCaseToCamelCase(extraOrgHeader.header)] = extraOrgHeader.values
                        })
                        
                        
                        console.log(existingOrgHeadersData.data.orgHeaders, '...existingOrgHeadersData.data.orgHeaders')
                        
                        //transform excel data
                        let transformedExcelData = []
                        excelData.forEach(row => {
                            const transformedRow = {}
                            Object.keys(row).map(key => {
                                transformedRow[titleCaseToCamelCase(key)] = row[key]
                            })
                            transformedExcelData.push(transformedRow)
                        })

                        console.log(transformedExcelData, '...transformedExcelData')
                        
                        //added headers have values, add values update employee data & org headers in database
                        await axios
                        .post(`http://localhost:8001/api/tenant/${tenantId}/employeeDetails`, {employeeDetails:transformedExcelData})
                        .then(res => {res.status === 200})

                        //update org headers in database
                        await axios
                        .post(`http://localhost:8001/api/tenant/${tenantId}/org-headers`, {orgHeaders:existingOrgHeadersData.data.orgHeaders})
                        .then(res => {
                            if(res.status === 200){
                                setHeadersUpdated(pre=>!pre)
                                console.log('headers updated')
                            }})
                        
                    }
                    catch(e){
                        console.log(e)
                    }
                }

                updateOrgHeaders()
            }
            else{
                setExcelDataError('Excel File missing values')
                setReadyToUpload(false)
                setShowAddHeaderModal(false)
                setPrompt('Excel File missing values')
                setShowPrompt(true)
            }

        }
        else{
            setExcelDataError('Empty Excel File received')
            setReadyToUpload(false)
            setPrompt('Excel File missing values')
            setShowPrompt(true)
        }

    }

    useEffect(() => {
        (async function(){
            try{
            const res = await axios.get(`http://localhost:8001/api/tenant/${tenantId}/org-headers`)
            const flags_res = await axios.get(`http://localhost:8001/api/tenant/${tenantId}/flags`)
            const flags = flags_res.data.flags
                
            if(res.status === 200 && flags_res.status === 200){
    
                console.log(res.data, '...res.data')
                let orgHeadersData = res.data.orgHeaders
                let tmpOrgHeaders = []
                Object.keys(orgHeadersData).forEach(key => {
                if(orgHeadersData[key].length !== 0){
                    tmpOrgHeaders.push(key)
                }
                })
        
                console.log(tmpOrgHeaders, '...tmpOrgHeaders')
        
                if(tmpOrgHeaders.length === 0){
                    setFlags({...flags, ORG_HEADERS_FLAG:false})
                }
                else{
                setOrgHeaders(tmpOrgHeaders)
                setFlags({...flags, ORG_HEADERS_FLAG:true})
                console.log()
                }
                setShowAddHeaderModal(false)
            }
            }catch(e){
            console.log(e)
            }
        })()
    },[headersUpdated])
  
    const handleOrgHeaderSelection = (e,index) => {
        let tmpSelectedOrgHeaders = [...selectedOrgHeaders]
        if(e.target.checked){
            tmpSelectedOrgHeaders.push(orgHeaders[index])
        }
        else{
            let orgHeaderIndex = tmpSelectedOrgHeaders.indexOf(orgHeaders[index])
            tmpSelectedOrgHeaders.splice(orgHeaderIndex,1)
        }
        setSelectedOrgHeaders(tmpSelectedOrgHeaders)    
    }

    const handleSaveAsDraft = async ()=>{
        //if travel allocations headers were selected thatn update them
        if(selectedOrgHeaders.length>0){
            const orgHeadersData = await axios.get(`http://localhost:8001/api/tenant/${tenantId}/org-headers`)
            console.log(orgHeadersData, '...orgHeadersData')
            let allocationHeaders = selectedOrgHeaders.map(orgHeader => ({headerName:orgHeader, headerValues:orgHeadersData.data.orgHeaders[orgHeader]}))
            const res = await axios.post(`http://localhost:8001/api/tenant/${tenantId}/${type == 'travel'? 'travel-allocation' : 'travel-expense-allocation'}`, {allocationHeaders})

            if(res.status>199 && res.status<300){
                //update form state
                console.log(res.data)
            }
        }

        //update form state
        const res = await updateFormState_API({tenantId, state:type == 'travel' ? 'section_3' : 'section_4'})
        if(res.err){
            console.log(err)
        }
        console.log('state updated')
        //window.location.href = 'https://google.com'
    }

    const saveTravelAllocationHeaders = async () => {
        //save travel allocation headers...
        console.log(selectedOrgHeaders, '...selectedOrgHeaders')
        //get org headers
        const orgHeadersData = await axios.get(`http://localhost:8001/api/tenant/${tenantId}/org-headers`)
        console.log(orgHeadersData, '...orgHeadersData')
        let allocationHeaders = selectedOrgHeaders.map(orgHeader => ({headerName:orgHeader, headerValues:orgHeadersData.data.orgHeaders[orgHeader]}))
        axios
        .post(`http://localhost:8001/api/tenant/${tenantId}/${type == 'travel'? 'travel-allocation' : 'travel-expense-allocation'}`, {allocationHeaders})
        .then(res => {
            console.log(res.data, '...res.data')
            navigate(next, {state:{tenantId}})
        })
        //navigate to next page
     
    }

    //handle header input change when user adds custom header
    const handleHeaderInputChange = (e, index)=> {
        let tmpAddedHeaders = [...addedHeaders]
        tmpAddedHeaders[index] = titleCase(e.target.value)
        console.log(tmpAddedHeaders, '...tmpAddedHeaders')
        setAddedHeaders(tmpAddedHeaders)
    }

    //remove header input when user clicks on remove icon
    const removeHeaderInput = (index) => {
        let tmpAddedHeaders = [...addedHeaders]
        tmpAddedHeaders.splice(index,1)
        setAddedHeaders(tmpAddedHeaders)
    }

    const handleOutsideClick = (e)=>{
        e.preventDefault()
        e.stopPropagation()
        setShowAddHeaderModal(false)
        setReadyToUpload(false)
        setAddedHeaders([''])
    }

    useEffect(()=>{
        try{
            axios
            .get(`http://localhost:8001/api/tenant/${tenantId}/employees`)
            .then(res => {
                console.log(res.data.map(employee=>employee.employeeDetails), '...res.data')
                setEmployeeData(res.data.map(employee=>employee.employeeDetails))

                //set template columns
                let tmpTemplateColumns = []
                Object.keys(res.data[0].employeeDetails).forEach(key => {
                    tmpTemplateColumns.push({header:camelCaseToTitleCase(key), key:key, width:20})
                })
                tmpTemplateColumns = [...tmpTemplateColumns, ...addedHeaders.map(header => ({header:header, key:titleCaseToCamelCase(header), width:20}))]
                console.log(addedHeaders, '...addedHeaders')
                setTemplateColumns(tmpTemplateColumns)

                setTemplateData(employeeData.map(employee => {
                    let rowData = JSON.parse(JSON.stringify(employee))

                    for(let i=0; i<addedHeaders.length; i++){
                        rowData = {...rowData, [titleCaseToCamelCase(addedHeaders[i])]:''}
                    }    
                    return rowData
                }))
            })
        }
        catch(e){
            console.log(e)
        }
    },[readyToUpload])

    useEffect(() => {
        console.log(selectedOrgHeaders, '...selectedOrgHeaders')
    },[selectedOrgHeaders])

    return(<>

        <Icon/>
        
        { <div className="bg-slate-50 min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
            
            <div className='px-6 py-10 bg-white rounded shadow w-full'>
               
                {/* rest of the section */}
                <div className='w-full flex flex-col gap-4'>  
                    
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-4 items-center'>
                           {readyToSelect && <div className='cursor-pointer'>
                                <img src={back_icon} onClick={()=>{setReadyToSelect(false)}} />
                            </div>}
                            <p className='text text-xl font-cabin text-neutral-700'>
                                {!readyToSelect ? `Let's setup how you allocate ${type? 'Travel' : 'Travel related expenses'}` : `setup ${type? 'travel' : 'travel related expense'} allocations`}
                            </p>
                        </div>
                        <div>
                            <HollowButton title='Skip' onClick={()=>navigate(next, {state:{tenantId}})} />
                        </div>
                    </div>

                    <hr/>
                    { !readyToSelect && <>
                     

                     <div className='p-4 border border-gray-200 rounded-xl w-fit'>
                         <div className='text text-sm font-cabin'>
                             {orgHeaders.map(orgHeader => {
                                 return <div className='flex px-6'>
                                     <div className='text-md text-neutral-600'>{camelCaseToTitleCase(orgHeader)}</div>
                                 </div>
                         })}
                     </div>
 
                     </div>
                     
                     <div>
                     <p className='text text-base font-cabin text-neutral-700'>
                     We have gathered the above headers from your HR data. <br/> Do you have all you need or are they headers missing 
                         </p>
                         <div className='flex gap-10 mt-4'>
                             <div>
                                 <Button text='I have all I need' onClick={()=>setReadyToSelect(true)} />
                             </div>
                             <div>
                                 <Button text='I have some other headers' onClick={()=>setShowAddHeaderModal(true)} />
                             </div>
                         </div>
                     </div>
                     </>
                   }

                    {readyToSelect &&                     
                        <>
                        <p className='text text-base font-cabin text-neutral-700'>
                            Select the entities to which you want to allocate travel
                        </p>

                         <div classsName='shadow bg-white border border-grey-200'>
                            {orgHeaders.map((orgHeader,index) => {
                                return <div className='flex justify-between items-center px-6 py-4 border-b border-grey-200'>
                                    <div className='text text-md font-cabin text-neutral-700'>{camelCaseToTitleCase(orgHeader)}</div>
                                    <div className='text text-base font-cabin text-neutral-700'>
                                        <Checkbox id={index} onClick={(e, id)=>handleOrgHeaderSelection(e,id)} />
                                    </div>
                                </div>
                            })}    
                        </div>

                        <div className='flex justify-between'>
                            <Button text='Save as Draft' onClick={handleSaveAsDraft} />
                            <Button variant='fit' text='Save and Continue' onClick={()=>setShowSkipModal(true)} />
                        </div>
                        </>
                    }
                </div>
            </div>

            
            <Modal showModal={showSkipModal} setShowModal={setShowSkipModal} skipable={true}>
                <div className='p-10'>
                    
                    { selectedOrgHeaders.length>0 && <>
                        <p className='text-neutral-700 text-base font-cabin '>Selected Options... </p>
                    <div className='flex flex-col gap-4 mt-4'>
                        {selectedOrgHeaders.map(orgHeader => {
                            return <div className='text text-sm font-cabin text-neutral-700'>{camelCaseToTitleCase(orgHeader)}</div>
                        })}
                    </div>

                    <div className='w-[200px] mt-10'>
                        <Button text='Correct' onClick={()=>{saveTravelAllocationHeaders()}} />
                    </div>
                    </>
                    }

                    {selectedOrgHeaders.length===0 && <>
                        
                        <p className='text-neutral-700 text-base font-cabin '>You have not selected any options, do you want to skip this step? </p>
                        <div className='flex justify-between items-center mt-6  '> 
                            <div className=''>
                                <Button text='Yes' onClick={()=>{navigate(next, {state:{tenantId}})}} />
                            </div>
                            <div>
                                <Button text='No' onClick={()=>{setShowSkipModal(false)}} />
                            </div> 
                        </div>
                    </>}

                    
                </div>
            </Modal>

            {showAddHeaderModal && flags.DIY_FLAG && <div onClick={handleOutsideClick} className="fixed z-[1000] overflow-hidden flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div ref={modalRef} onClick={(e)=>e.stopPropagation()} className='z-[1001] max-w-[600px] w-[90%] md:w-[75%] lg:w-[60%] min-h-[200px] scroll-none bg-white rounded-lg shadow-md'>
                <div className='p-10'>
                    {/* allow user to add headers*/}
                    {!readyToUpload && <>
                        <p className='text-neutral-700 text-base font-cabin '>Add Headers for the values you want to upload </p>
                        {/* display empty boxes to add headers*/}
                        <div className='flex flex-wrap gap-2 mt-4'>

                            {addedHeaders.length>0 && addedHeaders.map((header, index) => {
                                return(
                                    <div key={index}  className='flex gap-2 items-center'>
                                        <Input placeholder='Header Name' showTitle={false} onChange={(e)=>handleHeaderInputChange(e, index)} />
                                        <img src={remove_icon} onClick={()=>removeHeaderInput(index)} />
                                    </div>)
                            })}
                        </div>

                        <div className='flex justify-between items-center mt-6  '>
                            <div className=''>
                                <HollowButton title='Add' onClick={()=>{setAddedHeaders(pre=>[...pre, ''])}} />
                            </div>

                            <div className=''>
                                <Button text='Done' onClick={()=>{
                                    let ignore = true
                                    if(addedHeaders.length>0){
                                        console.log(addedHeaders, '...addedHeaders')
                                        addedHeaders.forEach(header => {
                                            if(header!=='' && header!='null' && header!=undefined){
                                                setReadyToUpload(true)
                                                console.log(header, '...addedHeaders')
                                                ignore=false
                                                return
                                            }
                                        })
                                    }
                                    if(ignore){
                                        setReadyToUpload(false)
                                      //  setShowAddHeaderModal(false)
                                    }
                                }} />
                            </div>
                        </div>

                    </>}

                    {/* allow user to upload file*/}
                    {readyToUpload && <>
                        <p className='text-neutral-700 text-base font-cabin '>First Download the template excel file, then upload it after filling in the values for the headers you have added</p>
                        <div className="flex flex-col items-start justify-start gap-[16px] text-sm">
                        
                        <div className="flex flex-col items-start justify-start gap-[8px] w-full">
                            <div className="mt-6 w-full flex flex-wrap gap-8 text-dimgray">
                                <div className="tracking-tight text-zinc-400 font-cabin">
                                    Upload the excel file
                                </div>
                                <div>
                                    {<DownloadTemplate linkText='Download HR template' columns={templateColumns} data={templateData} />}
                                </div>
                            </div>
                        </div>

                        <UploadFile 
                        setExcelData={setExcelData}
                        selectedFile={selectedFile} 
                        setSelectedFile={setSelectedFile} 
                        fileSelected={fileSelected} 
                        setFileSelected={setFileSelected} />

                        {fileSelected ? (
                            <div className="flex flex-col items-start justify-start gap-[8px] text-[12px]">
                            <img
                            className="relative w-10 h-10 overflow-hidden shrink-0"
                            alt=""
                            src={file_icon}
                            />
                            <div className="relative font-medium inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[43px]">
                            {selectedFile.name}
                            </div>
                        </div>
                        ) : (
                        null
                        )}
                    </div>
                        
                    <div className='flex w-full flex-row-reverse mt-4'>
                        <Button variant='fit' disabled={!fileSelected} text='Upload File' onClick={handleUpload} />
                    </div>
                        </>
                    }
                </div>
                </div>
            </div>}

            {showAddHeaderModal && !flags.DIY_FLAG && <div onClick={handleOutsideClick} className="fixed z-[1000] overflow-hidden flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div ref={modalRef} onClick={(e)=>e.stopPropagation()} className='z-[1001] max-w-[600px] w-[90%] md:w-[75%] lg:w-[60%] min-h-[200px] scroll-none bg-white rounded-lg shadow-md'>
                <div className='p-10'>
                                        
                    <p className='text-neutral-800 font-cabin text-lg'>
                        We detect that you are onboarded through People Strong, If you want to add extra headers for allocating travel Related expenses please contact your company
                    </p>
                    
                </div>
                </div>
            </div> }
            

        </div>}

        <Modal showModal={showPrompt} setShowModal={setShowPrompt} skipable={true} >
          <div className='p-10'>
              <p className='text-zinc-800 text-base font-medium font-cabin mt-4'>
                {prompt}  
              </p>
              <div className='inline-flex justify-end w-[100%] mt-10'>
                  <div className='w-[150px]'>
                    <Button text='Ok' onClick={()=>{setSelectedFile(null); setFileSelected(null)}} />
                  </div>
              </div>
          </div>
        </Modal>
        
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

