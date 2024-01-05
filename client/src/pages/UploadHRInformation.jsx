import axios from 'axios';
import DownloadTemplate from '../components/DownloadExcelTemplate';
import { useState, useEffect, useRef } from 'react';
import chevronDownIcon from '../assets/chevron-down.svg'
import leftFrame from '../assets/leftFrame.svg'
import Icon from '../components/common/Icon';
import file_icon from '../assets/teenyicons_csv-solid.svg'
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { set } from 'mongoose';
import UploadFile from '../components/common/UploadFile';
import { useNavigate, useParams } from 'react-router-dom';
import { postTenantHRData_API, updateFormState_API } from '../utils/api';
import { transform } from 'typescript';


export default function (){
  const {tenantId} = useParams()
  const [formData, setFormData] = useState({companyName:'', businessCategory:'', teamSize:'', companyHQ:'',  filename:''},)

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [excelData, setExcelData] = useState(null)
  const [readyToProceed, setReadyToProceed] = useState(false)

  const [diyFlag, setDiyFlag] = useState(true); //initialize this with the actual value
  const [prompt, setPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false)
  const [showSkipModal, setShowSkipModal] = useState(false)
  const [processed, setProcessed] = useState(false)
  const templateColumns = [
    {header: 'Employee Name', key: 'employeeName', width: 20},
    {header: 'Employee Id', key: 'employeeId', width: 20},
    {header: 'Designation', key: 'designation', width: 20},
    {header: 'Grade', key: 'grade', width: 20},
    {header: 'Department', key: 'department', width: 20},
    {header: 'Business Unit', key: 'businessUnit', width: 20},
    {header: 'Legal Entity', key: 'legalEntity', width: 20},
    {header: 'Cost Center', key: 'costCenter', width: 20},
    {header: 'Profit Center', key: 'profitCenter', width: 20},
    {header: 'Responsibility Center', key: 'responsibilityCenter', width: 20},
    {header: 'Division', key: 'division', width: 20},
    {header: 'Project', key: 'project', width: 20},
    {header: 'Geographical Location', key: 'geographicalLocation', width: 20},
    {header: 'L1 Manager', key: 'l1Manager', width: 20},
    {header: 'L2 Manager', key: 'l2Manager', width: 20},
    {header: 'L3 Manager', key: 'l3Manager', width: 20},
    {header: 'Joining Date', key: 'joiningDate', width: 20},
    {header: 'Mobile Number', key: 'mobileNumber', width: 20},
    {header: 'Phone Number', key: 'phoneNumber', width: 20},
    {header: 'Email Id', key: 'emailId', width: 20}
  ]
  const templateData = []

  useEffect(()=>{
    //extract excel data when selectedfile changes
    if(selectedFile){
        console.log(excelData)
        let goAhead = true
        setProcessed(false)
        const target = ['employee name', 'employee id', 'email id']
        excelData.forEach(row=>{
            const keys = Object.keys(row).map(key=>key.toLowerCase())
            const isValidExcel = (target, keys) => target.every(o=>keys.includes(o))

            if(!isValidExcel(target, keys)){
                setShowPrompt(true)
                setPrompt('The File you uploaded is missing some required fileds')
                goAhead = false
                return
            }
        })

        if(goAhead){
          setProcessed(true)
        }
    }

  },[selectedFile])

  const navigate = useNavigate()

  const handleSubmit = async () => {
    setProcessed(false)
    console.log(excelData)
    //transform excel data
    let transformedExcelData = []
    excelData.forEach(row => {
        const transformedRow = {}
        Object.keys(row).map(key => {
            transformedRow[titleCaseToCamelCase(key)] = row[key]
        })
        transformedExcelData.push(transformedRow)
    })

    console.log(transformedExcelData)

    const res = await postTenantHRData_API({tenantId, hrData:transformedExcelData})
    if(res.err){
      setShowPrompt(true)
      setPrompt('Unable to upload file please try again later')
      setFileSelected(false)
      setSelectedFile(null)
      return
    }
    console.log(res.data)
    //navigate to next section 
    navigate(`/${tenantId}/expense-allocations/`)
  }

  const handleSaveAsDraft = async ()=>{
    setProcessed(false)
    console.log(excelData)
    //transform excel data
    let transformedExcelData = []
    excelData.forEach(row => {
        const transformedRow = {}
        Object.keys(row).map(key => {
            transformedRow[titleCaseToCamelCase(key)] = row[key]
        })
        transformedExcelData.push(transformedRow)
    })

    console.log(transformedExcelData)

    const res = await postTenantHRData_API({tenantId, hrData:transformedExcelData})
    if(res.err){
      setShowPrompt(true)
      setPrompt('Unable to upload file please try again later')
      setFileSelected(false)
      setSelectedFile(null)
      return
    }
    console.log(res.data)

    const update_res = await updateFormState_API({tenantId, state: '/upload-hr-data'})
    window.location.href = 'https://google.com'
  }

  return (
    <>
        <Icon/>
        <div className="bg-slate-50 min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">    
            <div className='px-6 py-10  bg-white rounded shadow w-full'>
                {!readyToProceed && <div>
                    <p className='text-lg'>Please upload your company HR data. Download the attached file and upload</p>
                    <div className='flex justify-between mt-16'>
                        <Button variant='fit' text='Yes, I want to proceed' onClick={()=>setReadyToProceed(true)} />
                        <Button 
                            variant='fit'
                            text='No, I am not comfortable' 
                            onClick={()=>{setShowSkipModal(true); setPrompt('We understand, our representative will reach out to you shortly')}} />
                    </div>
                    </div>}
                {readyToProceed && <>
                <div className="bg-white m-auto w-fit h-full overflow-x-hidden font-cabin tracking-tight">

                    {<div className="flex flex-col items-start justify-start gap-[16px] text-sm">
                        <div className="flex flex-col items-start justify-start gap-[8px]">
                        <div className="font-medium font-cabin text-sm text-neutral-700">HR Details</div>
                        <div className="flex flex-row items-start justify-start gap-[16px] text-dimgray">
                            <div className="tracking-tight text-zinc-400 font-cabin">
                            Upload your company HR details in CSV format
                            </div>
                            {<DownloadTemplate columns = {templateColumns} data = {templateData} />}
                        </div>
                        </div>

                        <UploadFile 
                        selectedFile={selectedFile} 
                        setSelectedFile={setSelectedFile} 
                        fileSelected={fileSelected}
                        setExcelData={setExcelData} 
                        setFileSelected={setFileSelected} />

                        {fileSelected ? (
                            <div className="flex flex-col items-start justify-start gap-[8px] text-[12px]">
                            <img
                            className="relative w-10 h-10 overflow-hidden shrink-0"
                            alt=""
                            src={file_icon}
                            />
                            <div className="relative font-medium inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[43px]">
                            BMS Data
                            </div>
                        </div>
                        ) : (
                        null
                        )}
                    </div>}
                </div>
                
                <div className='px-6 mt-20 w-full flex justify-between items-center flex-wrap'>
                    <Button variant='fit' disabled={!processed} text='Save as Draft' onClick={()=>{handleSaveAsDraft();}} />
                    <Button variant='fit' disabled={!processed} text='Save and Continue' onClick={()=>{handleSubmit();}} />
                </div>
                </>}
            </div>
        </div>
    
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

    <Modal showModal={showSkipModal} setShowModal={setShowSkipModal} skipable={false} >
          <div className='p-10'>
              <p className='text-zinc-800 text-base font-medium font-cabin mt-4'>
                {prompt}  
              </p>
              <div className='inline-flex justify-end w-[100%] mt-10'>
                  <div className='w-[150px]'>
                    <Button text='Ok' onClick={()=>{window.location.href = 'https://google.com'}} />
                  </div>
              </div>
          </div>
    </Modal>

  </> 
  );
};

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
