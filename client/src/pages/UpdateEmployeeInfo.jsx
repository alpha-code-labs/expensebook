import back_icon from '../assets/arrow-left.svg'
import Icon from '../components/common/Icon'
import HollowButton from '../components/common/HollowButton';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Checkbox from '../components/common/Checkbox';
import Input from '../components/common/Input';
import remove_icon from '../assets/XCircle.svg'
import UploadFile from '../components/common/UploadFile';
import DownloadTemplate from '../components/DownloadExcelTemplate';
import file_icon from '../assets/teenyicons_csv-solid.svg'
import { titleCase } from '../utils/handyFunctions';
import close_icon from "../assets/close.svg"
import { getTenantEmployees_API, updateTenantHrMaster_API } from '../utils/api';
import Error from '../components/common/Error';

export default function ({tenantId}) {
  

const [flags, setFlags] = useState({ORG_HEADERS_FLAG:true})
console.log(tenantId, '...tenantId')
const [headers, setHeaders] = useState([''])
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
const [loading, setLoading] = useState(false)
const [loadingErr, setLoadingErr] = useState(null)



    const handleUpload = async ()=>{
        setExcelDataError(null)
        setLoading(true)
        let errorSet = false
        console.log(excelData, '...excelData')

        if(excelData){
            ['employeeName', 'employeeId', 'emailId'].forEach(header => {
                excelData.forEach(row => {
                    if(row[camelCaseToTitleCase(header)] === undefined || row[header]==='' || row[header]===null){
                        setExcelDataError(`Header ${header} is missing values for one or more employees`)
                        console.log(`Header ${header} is missing values for one or more employees`)
                        errorSet = true
                        setLoading(false)
                        return
                    }
                })
            })

            if(!errorSet){
                //added header have values..
                console.log('everthing is fine with data..')
                async function updateEmployeesData(){
                    try{            
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
                        
                        const confirmation = confirm('Please double check the data you are uploading. It may irreversibly change all data')
                        if(!confirmation) return
                        setLoading(true)
                        const res = await updateTenantHrMaster_API({tenantId, hrMaster:transformedExcelData})
                        setLoading(false)

                        if(res.err){
                            alert('Could not update employee data. Please try again later')
                            return
                        }
                        
                        alert('Employee Data Updated')
                    }
                    catch(e){
                        console.log(e)
                        setPrompt('Some Error occured please try again later')
                        setShowPrompt(true)
                        setLoading(false)
                    }
                }

                updateEmployeesData()
            }
            else{
                setExcelDataError('Excel File missing values')
                setPrompt('Excel File missing values')
                setShowPrompt(true)
            }

        }
        else{
            setExcelDataError('Empty Excel File received')
            setPrompt('Excel File missing values')
            setShowPrompt(true)
            setLoading(false)
        }

    }
  

    useEffect(()=>{

        (async function(){
            setLoading(true)
            const res = await getTenantEmployees_API({tenantId})
            if(res.err){
                setLoadingErr(res.err)
                return
            }

            console.log(res.data.map(employee=>employee.employeeDetails), '...res.data')

            //set template columns
            let tmpTemplateColumns = []
            let tmpHeaders = []
            Object.keys(res.data[0].employeeDetails).forEach(key => {
                tmpTemplateColumns.push({header:camelCaseToTitleCase(key), key:key, width:20})
                tmpHeaders.push(key)
            })
            
            setHeaders(tmpHeaders)
            setTemplateColumns(tmpTemplateColumns)

            const employeeData = res.data.map(employee=>employee.employeeDetails)
            setTemplateData(employeeData.map(employee => {
                let rowData = JSON.parse(JSON.stringify(employee))    
                return rowData
            }))

            console.log(setTemplateData, setTemplateColumns)

            setLoading(false)
            setLoadingErr(null)
        })()

    },[])


    return(
        <>
            {loading && <Error message={loadingErr} />}
            {!loading &&
            <div  className="overflow-hidden flex justify-center items-center inset-0 w-full h-[100vh] scroll-none">       
               
                <div className='px-10 pb-10 pt-4 w-fit max-w-[480px] rounded-lg bg-white mx-auto'>
                    {/* allow user to upload file*/}
                    { <>
                        <p className='text-neutral-700 text-base font-cabin '>First Download the template excel file, then upload it after filling in the values for all the headers that are present in your organization for each employee</p>
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
                        
                    <div className='flex w-full flex-row-reverse mt-10'>
                        <Button variant='fit' disabled={!fileSelected} isloading={loading} text='Upload File' onClick={handleUpload} />
                    </div>

                        </>
                    }
                </div>
                
            </div>
            }
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

