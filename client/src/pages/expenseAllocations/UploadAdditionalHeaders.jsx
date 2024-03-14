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
import { getTenantOrgHeaders_API, postTenantOrgHeaders_API, updateEmployeeDetails_API, updateFormState_API } from '../../utils/api';
import { titleCase } from '../../utils/handyFunctions';
import close_icon from "../../assets/close.svg"
import Prompt from '../../components/common/Prompt';

export default function ({showAddHeaderModal, setShowAddHeaderModal, tenantId, setUpdatedOrgHeaders}) {
  
const [showSkipModal, setShowSkipModal] = useState(false);
const {state} = useLocation()
const navigate = useNavigate();
const [flags, setFlags] = useState({ORG_HEADERS_FLAG:true})
const [orgHeaders, setOrgHeaders] = useState([])
console.log(tenantId, '...tenantId')
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
const [isUploading, setIsUploading] = useState(false)
const [prompt, setPrompt] = useState({showPrompt:false, promptMsg:null, success:null})


const ONBOARDING_API = import.meta.env.VITE_PROXY_URL 

const api_endpoint =  `${ONBOARDING_API}/tenant`

    const handleUpload = async ()=>{
        setExcelDataError(null)
        setIsUploading(true)
        let errorSet = false
        console.log(excelData, '...excelData')
        if(excelData){
            addedHeaders.forEach(header => {
                excelData.forEach(row => {
                    if(row[header] === undefined || row[header]==='' || row[header]===null){
                        setExcelDataError(`Header ${header} is missing values for one or more employees`)
                        errorSet = true
                        setIsUploading(false)
                        return
                    }
                })
            })

            if(!errorSet){
                //added header have values..

                async function updateOrgHeaders(){
                    try{            
                        let existingOrgHeadersData //= await axios.get(`${api_endpoint}/${tenantId}/org-headers`)
                        
                        const orgHeaders_res = await getTenantOrgHeaders_API({tenantId})
                        if(!orgHeaders_res.err){
                            existingOrgHeadersData = orgHeaders_res
                        }
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
                        setIsUploading(true)
                        const res = updateEmployeeDetails_API({tenantId, orgHeaders:existingOrgHeadersData.data.orgHeaders, employeeDetails:transformedExcelData, addedHeaders:addedHeaders.map(h=>titleCaseToCamelCase(h)) })
                        if(!res.err){
                            setPrompt({showPrompt:true, promptMsg:'Data updated successfully', success:true})
                            console.log('Employees Updated')
                            setUpdatedOrgHeaders(existingOrgHeadersData.data.orgHeaders)
                            setIsUploading(false)
                            setTimeout(()=>setShowAddHeaderModal(false), 2000)
                        }else{
                            setIsUploading(false)
                            setPrompt({showPrompt:true, promptMsg: 'Some error occured. Please try again later', success: false})
                            //alert('Unable to update data at the moment')
                            throw new Error('Unable to update employees')
                        }

                    }
                    catch(e){
                        console.log(e)
                        setPrompt({showPrompt:true, promptMsg: 'Some error occured. Please try again later', success: false})
                        setIsUploading(false)
                    }
                }

                updateOrgHeaders()
            }
            else{
                setExcelDataError('Excel File missing values')
                setReadyToUpload(false)
                setShowAddHeaderModal(false)
                setPrompt({showPrompt:true, promptMsg: 'Excel file missing values', success:false})
            }

        }
        else{
            setExcelDataError('Empty Excel File received')
            setReadyToUpload(false)
            setPrompt({showPrompt:true, promptMsg: 'Excel file missing values', success:false})
            setIsUploading(false)
        }

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

    const handleClose = (e)=>{
        setShowAddHeaderModal(false)
        setAddedHeaders([''])
    }

    useEffect(()=>{
        try{
            axios
            .get(`${api_endpoint}/${tenantId}/employees`)
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

    return(<>
            {showAddHeaderModal && <div  className="fixed z-[1000] overflow-hidden flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div className='z-[1001] max-w-[600px] w-[90%] md:w-[75%] lg:w-[60%] min-h-[200px] scroll-none bg-white rounded-lg shadow-md'>
                <div className='flex w-full h-10 items-center flex-row-reverse pr-6 pt-6'>
                    <img src={close_icon} onClick={()=>handleClose()}/>
                </div>
                <div className='px-10 pb-10 pt-4'>
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
                        <Button variant='fit' disabled={!fileSelected} isloading={isUploading} text='Upload File' onClick={handleUpload} />
                    </div>
                        </>
                    }
                </div>
                </div>
            </div>}

            {showAddHeaderModal && false && <div className="fixed z-[1000] overflow-hidden flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div className='z-[1001] max-w-[600px] w-[90%] md:w-[75%] lg:w-[60%] min-h-[200px] scroll-none bg-white rounded-lg shadow-md'>
                <div className='flex w-full h-10 items-center flex-row-reverse pr-6 pt-6'>
                    <img src={close_icon} onClick={()=>handleClose()}/>
                </div>
                <div className='px-10 pb-10 pt-4'>
                                        
                    <p className='text-neutral-800 font-cabin text-lg'>
                        We detect that you are onboarded through People Strong, If you want to add extra headers for allocating travel Related expenses please contact your company
                    </p>
                    
                </div>
                </div>
            </div> }

            <Prompt prompt={prompt} setPrompt={setPrompt}/>
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

