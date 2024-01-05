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
import { useNavigate, useParams} from 'react-router-dom';
import { postTenantCompanyInfo_API } from '../utils/api';

const WEB_PAGE_URL = 'http://localhost:575/home'

export default function CompanyAndHRInformation(){
  const {tenantId} = useParams()
  const [companyList, setCompanyList] = useState([])
  const [businessCategoriesList, setBusinessCategoriesList] = useState([])
  const [locationsList, setLocationsList] = useState(['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata'])
  const [formData, setFormData] = useState({companyName:'', businessCategory:'', teamSize:'', companyHQ:'', onboardingCompleted: false, state: 'section_1'})

  const [diyFlag, setDiyFlag] = useState(true); //initialize this with the actual value
  const [showPrompt, setShowPrompt] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingErr, setLoadingErr] = useState(false)

  const navigate = useNavigate()

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

  const handleSubmit = async () => {

    let allowSubmit = true
    const data = new FormData();
    //validate form
   async function validateForm(){
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
  }

  await validateForm()
   
    // Make a POST request using Axios to post company data to the backend
    if(allowSubmit){
    // Make a POST request using Axios
    console.log('trying to submit....', formData)
      setIsLoading(true)
      const res = await postTenantCompanyInfo_API({tenantId, companyInfo:{...formData}})
      if(res.err){
        setLoadingErr(res.err)
        return
      }
      navigate(`/${response.data.tenantId}/upload-Excel`, {state:{tenantId}})
    }
  
  }

  const handleSaveAsDraft = async ()=>{
    let allowSubmit = true
    const data = new FormData();
    //validate form
   async function validateForm(){
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
  }

  await validateForm()
   
    // Make a POST request using Axios to post company data to the backend
    if(allowSubmit){
    // Make a POST request using Axios
    console.log('trying to submit....', formData)
      setIsLoading(true)
      const res = await postTenantCompanyInfo_API({tenantId, companyInfo:{...formData}})
      if(res.err){
        setLoadingErr(res.err)
        return
      }
      
      //navigate to main page
      //window.location.href = WEB_PAGE_URL
    }
  }


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

          <div className='mb-10 w-full flex gap-8 items-center flex-wrap'>
            <Button variant='fit' text='Save as Draft' onClick={()=>{handleSaveAsDraft();}} />
            <Button variant='fit' text='Save and Continue' onClick={()=>{handleSubmit();}} />
          </div>

      </div>
    </div>
  </div> 
  );
};

