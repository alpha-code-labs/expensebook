import axios from 'axios';
import DownloadTemplate from '../components/DownloadExcelTemplate';
import { useState, useEffect, useRef } from 'react';
import chevronDownIcon from '../assets/chevron-down.svg'
import leftFrame from '../assets/leftFrame.svg'
import Icon from '../components/common/Icon';
import Search from '../components/common/Search';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import file_icon from '../assets/teenyicons_csv-solid.svg'
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { set } from 'mongoose';
import UploadFile from '../components/common/UploadFile';


export default function CompanyAndHRInformation(){
  const [companyList, setCompanyList] = useState([])
  const [businessCategoriesList, setBusinessCategoriesList] = useState([])
  const [locationsList, setLocationsList] = useState(['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata'])
  const [formData, setFormData] = useState({companyName:'', businessCategory:'', teamSize:'', companyHQ:'',  filename:''},)

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSelected, setFileSelected] = useState(false);

  const [diyFlag, setDiyFlag] = useState(true); //initialize this with the actual value
  const [prompt, setPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false)


  useEffect(()=>{
    //make axios call to get the list of companies
    //for now

    setCompanyList(['BMS', 'Google', 'Amazon', 'Microsoft', 'Apple', 'Facebook'])
    setBusinessCategoriesList(['IT', 'Finance', 'Manufacturing', 'Retail', 'Others'])

  },[])

  const handleCompanySearch = (option)=>{
    let flag = true
    console.log(option, '..option')
    companyList.forEach(company=>{
      if(company.toLowerCase() == option.toLowerCase()){
        flag=false
        console.log('diyFlag set to true')
      }
    })

    setDiyFlag(flag)

    setFormData({...formData, companyName:option})
  }

  const handleBusinessCategory = (option)=>{
    setFormData({...formData, businessCategory:option})
  }

  const handlTeamSize = (option)=>{
    setFormData({...formData, teamSize:option})
  }

  const handleHqLocation = (option)=>{
    console.log(option, '...option')
    setFormData({...formData, companyHQ:option})  
  }

  useEffect(()=>{
    console.log(formData, '...formData')
  },[formData])

  const [errors,setErrors] = useState({companyNameError:false, businessCategoryError:false, teamSizeError:false, companyHQError:false})
  const [filename, setFileName] = useState(null)

  const handleSubmit = () => {

    let allowSubmit = true

    const data = new FormData();

      
    //validate form
   (function async(){
    return new Promise((resolve, reject)=>{
      if(formData.companyName == ''){
        setErrors(pre=>({...pre, companyNameError:true}))
        allowSubmit=false
      }
      if(formData.businessCategory == ''){
        setErrors(pre=>({...pre, businessCategoryError:true}))
        allowSubmit=false
      }
      if(formData.teamSize == ''){
        setErrors(pre=>({...pre, teamSizeError:true}))
        allowSubmit=false
      }
      if(formData.companyHQ == ''){
        setErrors(pre=>({...pre, companyHQError:true}))
        allowSubmit=false
      }

      resolve()
    })
  })().then(()=>{
   
   if(diyFlag){
      if (selectedFile) {
        data.append('file', selectedFile);
        axios.
        post('http://localhost:8001/api/upload-hrInfo', data)
        .then((response) => {
          console.log('File uploaded successfully:', response.data);
      
          // Make a POST request using Axios to post the filename along with other data to the backend
          if(allowSubmit){
          // Make a POST request using Axios
          console.log('trying to submit....', formData)
            axios
            .post('http://localhost:8001/api/hrCompanyInfo/new', {...formData, filename:response.data.fileName})
            .then((response) => {
              console.log('HR master created:', response.data);
            })
            .catch((error) => {
              console.error('Error in uploading information:', error);
            });
          }
    
        })
        .catch((error) => {
          console.error('Error in uploading file:', error);
          return
        })
      } else {
        setPrompt('Without HR information this process cannot be completed. We have your email Id and will get in touch with you shortly.');
        setShowPrompt(true)
        return
      }
   }
   else{
    if(allowSubmit){
          // Make a POST request using Axios
      console.log('trying to submit....', data)

      axios
      .post('http://localhost:8001/api/hrCompanyInfo/new', {companyName:formData.companyName, businessCategory:formData.businessCategory, teamSize:formData.teamSize, companyHQ:formData.companyHQ })
      .then((response) => {
        console.log('File uploaded successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error in uploading file:', error);
      });
    }

   }

  })

  };



  return (
    <div className="flex bg-white w-full h-full overflow-x-hidden font-cabin tracking-tight">
    
    <div className='fixed left-0 top-0 h-[100vh] w-[40vw] flex flex-col justify-center items-center [background:linear-gradient(187.95deg,_rgba(76,_54,_241,_0),_rgba(76,_54,_241,_0.03)_9.19%,_rgba(76,_54,_241,_0.06)_17.67%,_rgba(76,_54,_241,_0.1)_25.54%,_rgba(76,_54,_241,_0.14)_32.86%,_rgba(76,_54,_241,_0.19)_39.72%,_rgba(76,_54,_241,_0.25)_46.19%,_rgba(76,_54,_241,_0.31)_52.36%,_rgba(76,_54,_241,_0.38)_58.3%,_rgba(76,_54,_241,_0.46)_64.08%,_rgba(76,_54,_241,_0.53)_69.79%,_rgba(76,_54,_241,_0.62)_75.51%,_rgba(76,_54,_241,_0.71)_81.31%,_rgba(76,_54,_241,_0.8)_87.28%,_rgba(76,_54,_241,_0.9)_93.48%,_#4c36f1)]'>
      <img src={leftFrame} />
    </div>

    <div className='absolute left-0 w-[100%] md:left-[50%] md:w-[50%] top-0 overflow-x-hidden flex justify-center items-center'>
      <div className="mx-auto pt-10 flex flex-col items-start justify-start gap-[24px]">
        
        <div className=" min-w-[403px] flex flex-col items-start justify-start gap-[24px] w-full">
          <div className="flex flex-col items-start justify-start gap-[8px]">
            <div className="relative text-neutral-800 text-2xl tracking-tight font-semibold font-cabin">
              Tell us a bit about your company
            </div>
            <div className="relative text-sm tracking-tight text-zinc-400 font-cabin font-normal">
              Enter the company details.
            </div>
          </div>

          <div className="flex w-full flex-col items-start justify-start gap-[24px] text-sm">
            <Search 
                title='Company Name' 
                placeholder='company name' 
                options={companyList} 
                allowCustomInput={true}
                error={{set:errors.companyNameError, message:'Please enter company name'}} 
                onSelect={(option)=>{handleCompanySearch(option)}} />
            <Select 
                title='Business Category' 
                placeholder='Select business category' 
                options={businessCategoriesList}
                error={{set:errors.businessCategoryError, message:'Please select business category'}} 
                onSelect={(option)=>{handleBusinessCategory(option)}} />
            <Select 
                title='Team Size' 
                options={['1-10', '10-50', '50-100', '100-500', '>500']} 
                placeholder='Select team size' 
                error={{set:errors.teamSizeError, message:'Please select team size'}}
                onSelect={(option)=>handlTeamSize(option)} />
            <Search 
              title='Company HQ Location' 
              allowCustomInput={true} 
              options={locationsList} 
              placeholder='City'
              error={{set:errors.companyHQError, message:'Please enter company headquarter location'}}
              onSelect={(option)=>{handleHqLocation(option)}} />
          </div>


          </div>

         {diyFlag && <div className="flex flex-col items-start justify-start gap-[16px] text-sm">
            <div className="flex flex-col items-start justify-start gap-[8px]">
              <div className="font-medium font-cabin text-sm text-neutral-700">HR Details</div>
              <div className="flex flex-row items-start justify-start gap-[16px] text-dimgray">
                <div className="tracking-tight text-zinc-400 font-cabin">
                  Upload your company HR details in CSV format
                </div>
                {DownloadTemplate()}
              </div>
            </div>

            <UploadFile 
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
                  BMS Data
                </div>
              </div>
            ) : (
              null
            )}
          </div>}

          <div className='mb-10 w-full float-right flex justify-center items-center'>
            <Button text='Continue' onClick={()=>{handleSubmit();}} />
          </div>

      </div>
    </div>
    
    <Modal showModal={showPrompt} setShowModal={setShowPrompt} skipable={true} >
          <div className='p-10'>
              <p className='text-zinc-800 text-base font-medium font-cabin mt-4'>
                {prompt}  
              </p>
              <div className='inline-flex justify-end w-[100%] mt-10'>
                  <div className='w-[150px]'>
                    <Button text='Ok' />
                  </div>
              </div>
          </div>
    </Modal>

  </div> 
  );
};

