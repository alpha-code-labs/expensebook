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
import { getTenantCompanyInfo_API, postTenantCompanyInfo_API } from '../utils/api';
import Error from '../components/common/Error';

const WEB_PAGE_URL = 'http://localhost:575/home'

export default function ({tenantId}){

  const [locationsList, setLocationsList] = useState(['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata'])
  const [formData, setFormData] = useState({companyName:'', businessCategory:'', companySize:'', companyHeadquarters:''})

  const [diyFlag, setDiyFlag] = useState(true); //initialize this with the actual value
  const [showPrompt, setShowPrompt] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingErr, setLoadingErr] = useState(false)

  useEffect(()=>{
    (async function(){
        try{
            setIsLoading(true)
            //make axios call to get the list of companies
            const res = await getTenantCompanyInfo_API({tenantId})
            if(res.err){
                setLoadingErr(res.err)
                console.log(res.err)
                return
            }

            console.log(res.data, 'fetched company data')
            setIsLoading(false)
            setFormData(pre=>({...pre, ...res.data.companyDetails}))
        }catch(e){
            console.log(e)
        }
    })()
    
  },[])

  const handleCompanyNameChange = (option)=>{
    let flag = true
    console.log(option, '..option')

    setFormData({...formData, companyName:option})
  }

  const handleBusinessCategory = (option)=>{
    setFormData({...formData, businessCategory:option})
  }

  const handlTeamSize = (option)=>{
    setFormData({...formData, companySize:option})
  }

  const handleHqLocation = (option)=>{
    console.log(option, '...option')
    setFormData({...formData, companyHeadquarters:option})  
  }

  useEffect(()=>{
    console.log(formData, '...formData')
  },[formData])

  const [errors,setErrors] = useState({companyNameError:false, businessCategoryError:false, teamSizeError:false, companyHeadquartersError:false})
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
      if(formData.companyHeadquarters == ''){
        setErrors(pre=>({...pre, companyHeadquartersError:true}))
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
    }
  
  }



  return (
    <>
    {isLoading && <Error message={loadingErr} /> }
    {!isLoading && 
    
        <div className="flex bg-slate-50 w-full h-full overflow-x-hidden font-cabin tracking-tight">
    <div className='overflow-x-hidden flex mx-auto justify-center items-center'>
      <div className="mx-auto pt-10 flex flex-col items-start justify-start gap-[24px]">
        
        <div className=" min-w-[403px] flex flex-col items-start justify-start gap-[24px] w-full">
          
          <div className="flex w-full flex-col items-start justify-start gap-[24px] text-sm">
            <div className='flex gap-1'>
                <Input 
                    title='Company Name' 
                    placeholder='company name' 
                    value={formData.companyName} 
                    error={{set:errors.companyNameError, message:'Please enter company name'}} 
                    onBlur={(e)=>{handleCompanyNameChange(e.target.value)}} />
                <Input 
                title='Company HQ Location'
                placeholder='City'
                value={formData.companyHeadquarters}
                error={{set:errors.companyHeadquartersError, message:'Please enter company headquarter location'}}
                onBlur={(e)=>{handleHqLocation(e.target.value)}} />
            </div>

            <Select 
                title='Business Category' 
                placeholder='Select business category' 
                currentOption={formData.businessCategory}
                error={{set:errors.businessCategoryError, message:'Please select business category'}} 
                onSelect={(option)=>{handleBusinessCategory(option)}} />
            <Select 
                title='Team Size' 
                options={['1-10', '10-50', '50-100', '100-500', '>500']} 
                placeholder='Select team size'
                currentOption= {formData.companySize} 
                error={{set:errors.teamSizeError, message:'Please select team size'}}
                onSelect={(option)=>handlTeamSize(option)} />

          </div>

          </div>

          <div className='mb-10 w-full flex gap-8 items-center flex-wrap'>

            <Button variant='fit' text='Save Changes' onClick={()=>{handleSubmit();}} />
          </div>

      </div>
    </div>
    </div>} 
    </>
  );
};

