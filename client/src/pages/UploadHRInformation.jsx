import axios from 'axios';
import DownloadTemplate from '../components/DownloadExcelTemplate';
import { useState, useEffect, useRef } from 'react';
import chevronDownIcon from '../assets/chevron-down.svg'
import leftFrame from '../assets/leftFrame.svg'
import Icon from '../components/common/Icon';
import file_icon from '../assets/teenyicons_csv-solid.svg'
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import UploadFile from '../components/common/UploadFile';
import { useNavigate, useParams } from 'react-router-dom';
import { postProgress_API, postTenantHRData_API, updateFormState_API } from '../utils/api';
import { motion } from 'framer-motion';
import check_icon from '../assets/check.svg'
import LeftProgressBar from '../components/common/LeftProgressBar';
import MainSectionLayout from './MainSectionLayout';
import Prompt from '../components/common/Prompt';

const WEB_PAGE_URL = import.meta.env.WEB_PAGE_URL
const LOGIN_PAGE_URL = import.meta.env.LOGIN_PAGE_URL

export default function ({progress, setProgress}){

  const {tenantId} = useParams()
  const [formData, setFormData] = useState({companyName:'', businessCategory:'', teamSize:'', companyHQ:'',  filename:''},)

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [excelData, setExcelData] = useState(null)
  const [readyToProceed, setReadyToProceed] = useState(false)

  const [diyFlag, setDiyFlag] = useState(true); //initialize this with the actual value
  const [prompt, setPrompt] = useState(null);
  const [prompt_, setPrompt_] = useState({showPrompt:false, promptMsg:null});

  const [showPrompt, setShowPrompt] = useState(false)
  const [showSkipModal, setShowSkipModal] = useState(false)
  const [processed, setProcessed] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

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

        if(excelData.length == 0){
          setShowPrompt(true)
          setPrompt('Seems like you uploaded an empty excel file. Without HR data the system will not work. Please make sure the uploaded file has values and try again.')
          setSelectedFile(null)
          setFileSelected(false)

          goAhead = false
          return
        }

        const target = ['employee name', 'employee id', 'email id']
        excelData.forEach(row=>{
            const keys = Object.keys(row).map(key=>key.toLowerCase())
            const isValidExcel = (target, keys) => target.every(o=>keys.includes(o))

            if(!isValidExcel(target, keys)){
                setShowPrompt(true)
                setPrompt('The File you uploaded is missing some required fileds')
                setSelectedFile(null)
                setFileSelected(false)
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

    console.log(excelData)
    //transform excel data
    let transformedExcelData = [];

    excelData.forEach(row => {
        const transformedRow = {}
        Object.keys(row).map(key => {
            transformedRow[titleCaseToCamelCase(key)] = row[key]
        })

        transformedExcelData.push(transformedRow)
    })

    console.log(transformedExcelData)

    setIsUploading(true);
    const res = await postTenantHRData_API({tenantId, hrData:transformedExcelData})

    if(res.err){
      setShowPrompt(true)
      setPrompt('Unable to upload file please try again later')
      setFileSelected(false)
      setSelectedFile(null)
      return
    }

    //upload successful
    console.log(res.data)
    const progress_copy = JSON.parse(JSON.stringify(progress));

    progress_copy.sections['section 2'].state = 'done';
    progress_copy.sections['section 2'].coveredSubSections = 1;
    progress_copy.activeSection = 'section 3';

    if(progress.maxReach==undefined || progress.maxReach==null || progress.maxReach.split(' ')[1] < 3){
      progress_copy.maxReach = 'section 3';
    }
  
    const progress_res = await postProgress_API({tenantId, progress:progress_copy})

    setIsUploading(false);

    if(!progress_res.err){

      setPrompt_({showPrompt:true, promptMsg: 'Data uploaded successfully'})

      setTimeout(()=>{
        setProgress(progress_copy);
        //navigate to next section 
        navigate(`/${tenantId}/setup-expensebook/`)
      }, 3000)
    }
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

    const update_res = await updateFormState_API({tenantId, state: `/${tenantId}/setup-expense-book`})
    window.location.href = WEB_PAGE_URL
  }

  useEffect(()=>{
    if(progress!= undefined && progress?.activeSection != 'section 2'){
      setProgress(pre=>({...pre, activeSection:'section 2'}))
    }
  },[progress])

  return (
    <>
        <MainSectionLayout>    
            <div className='px-6 py-10  bg-white  w-full'>
                {!readyToProceed && <div>
                    <p className='text-lg text-neutral-800'>Upload HR data.</p>
                    <p className='mt-1 text-normal text-neutral-600'>Below is a sample filled excel file. You can take a look to know what kind of information we are requesting from you. If you want to know further why we are asking to provide you a certain field please click here to see the full list.</p>
                    <TemplateGridView/>
                    <DownloadTemplate columns = {templateColumns} data={templateData}/>

                    <p className='mt-10 font-cabin text-lg text-neutral-800'>
                      Instructions for filling the excel file:
                    </p>
                    
                    <ul className='mt-2 list-disc font-cabin text-md text-neutral-600'>
                      <li className='ml-6'>Fields marked with * are mandatory to fill.</li>
                      <li className='ml-6'>In the L1 Manager, L2 Manager & L3 Manager columns put the employee Id for the manager.</li>
                      <li className='ml-6'>If your organization does not have some headers eg. Cost Center etc. then you can leave them blank, please do not delete the columns</li>
                    </ul>

                    
                    
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
                            Upload your company HR details in CSV or Excel format
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
                             {selectedFile.name}
                            </div>
                        </div>
                        ) : (
                        null
                        )}
                    </div>}
                </div>
                
                <div className='px-6 mt-20 w-full flex justify-between items-center flex-wrap'>
                    {/* <Button variant='fit' disabled={!processed} text='Save as Draft' onClick={()=>{handleSaveAsDraft();}} /> */}
                    <Button variant='fit' isLoading={isUploading} disabled={!processed} text='Save and Continue' onClick={()=>{handleSubmit();}} />
                </div>
                </>}
            </div>
            <Prompt prompt={prompt_} setPrompt={setPrompt_}/>
        </MainSectionLayout>
    
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
                      <Button text='Ok' onClick={()=>{window.location.href = WEB_PAGE_URL}} />
                    </div>
                </div>
            </div>
      </Modal>

      <Modal showModal={false}>
        <div className='w-[80%] h-[80%] bg-gray-200'>
            <p>Sumary for the uploaded file</p>
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

function TemplateGridView(){

  const colsNames = ['Employee Name', 'Employee Id', 'Designation', 'Grade', 'Department', 'Business Unit', 'Legal Entity', 'Cost Center', 'Profit Center', 'Respo. Center', 'Division']
  const cols = [
    {name: 'Employee Name', mandatory:true, data:['Sumesh Nair', 'Kanhaiya Verma', 'Jasraj Singh', 'Rahul Rawal']},
    {name: 'Employee Id', mandatory:true, data:['1001', '1004', '1003', '1002']},
    {name: 'Email Id', mandatory:true, data:['sumesh.nai@alphacodelabs.com', 'k.verma@alphacodelabs.com', 'j.sing@alphacodelabs.com', 'rahul.rawal@alphacodelabs.com']},
    {name: 'Designation', mandatory:false,  data:['Project Manager', 'Design Lead', 'Intern', 'Full Stack Engineer']},
    {name: 'Grade', mandatory:false, data:['', '', '', '']},
    {name: 'Department', mandatory:false, data:['Software Development', 'Software Development', 'Software Development', 'Software Development']},
    {name: 'Business Unit', mandatory:false, data:['ACL', 'ACL', 'ACL', 'ACL']},
    {name: 'Legal Entity', mandatory:false, data:['Studio Innovate.', 'Studio Innovate', 'Studio Innovate', 'Studio Innovate']},
    {name: 'Cost Center', mandatory:false, data:['', '', '', '']},
    {name: 'Profit Center', mandatory:false, data:['', '', '', '']},
    {name: 'Responsibility Center', mandatory:false, data:['', '', '', '']},
    {name: 'Division', mandatory:false, data:['', '', '', '']},
    {name: 'Project', mandatory:false, data:['', '', '', '']},
    {name: 'Geographical Location', mandatory:false, data:['', '', '', '']},
    {name: 'Grade', mandatory:false, data:['', '', '', '']},
    {name: 'L1 Manager', mandatory:false, data:['', '', '', '']},
    {name: 'L2 Manager', mandatory:false, data:['', '', '', '']},
    {name: 'L3 Manager', mandatory:false, data:['', '', '', '']},
    {name: 'Joining Date', mandatory:false, data:['', '', '', '']},
    {name: 'Mobile Number', mandatory:false, data:['', '', '', '']},
    {name: 'Phone Number', mandatory:false, data:['', '', '', '']},
  ]

  return(<>
    <div className='mt-10 rounded-t'>
        <div className='flex font-cabin text-xs divide-x overflow-x-scroll no-scroll border-l border-r rounded-t'>
          {cols.map(col=>(
            <div className='flex flex-col gap-2 rounded-t'>
              <div className='font-mono px-2 bg-indigo-400 whitespace-nowrap h-[30px] flex items-center text-gray-50 border-b border-neutral-200'>
                {col.name}
                  {col.mandatory && <span className='text-red-900 text-lg'>*</span>}                
                </div>
              
              {col.data.map((cell,ind)=>(<div key={ind} className='whitespace-nowrap bg-indigo-100 font-mono h-[22px] px-2 flex items-center text-neutral-700 border-b border-neutral-200'>
                {cell}
              </div>))}
            </div>
          ))}
        </div>


    </div>
  </>)
}
