import axios from 'axios';
import DownloadTemplate from '../components/DownloadExcelTemplate';
import { useState, useEffect, useRef } from 'react';
import leftFrame from '../assets/newLeftFrame.svg'
import Icon from '../components/common/Icon';
import Search from '../components/common/Search';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useNavigate, useParams} from 'react-router-dom';
import { getTenantCompanyInfo_API, postProgress_API, postTenantCompanyInfo_API } from '../utils/api';
import {currenciesList} from '../data/currenciesList';
import Error from '../components/common/Error';
import MainSectionLayout from './MainSectionLayout';
import Prompt from '../components/common/Prompt';

const WEB_PAGE_URL = import.meta.env.VITE_WEB_PAGE_URL

export default function CompanyAndHRInformation({progress, setProgress}){

  const {tenantId} = useParams()
  const [companyList, setCompanyList] = useState([])
  const [businessCategoriesList, setBusinessCategoriesList] = useState([])
  const [locationsList, setLocationsList] = useState(['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata'])
  const [formData, setFormData] = useState({companyName:'', businessCategory:'', teamSize:'', companyHQ:'', onboardingCompleted: false, state: 'section_1', defaultCurrency: {}, companyEmail:''})

  const [diyFlag, setDiyFlag] = useState(true); //initialize this with the actual value
  const [showPrompt, setShowPrompt] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingErr, setLoadingErr] = useState(null)
  const [isUploading, setIsUploading] = useState(false);

  const [prompt, setPrompt] = useState({showPrompt:false, promptMsg:null});

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
    // companyList.forEach(company=>{
    //   if(company.toLowerCase() == option.toLowerCase()){
    //     flag=false
    //     console.log('diyFlag set to true')
    //   }
    // })

    // setDiyFlag(flag)

    setFormData(pre=>({...pre, companyName:option}))
  }

  const handleCompanyEmail = (option)=>{
    setFormData(pre=>({...pre, companyEmail:option}))
  }

  const handleCurrencySelection = (option)=>{
    console.log(option.split('-')[1])
    const defaultCurrency = currenciesList.find(currency=>currency.shortName == option.split('-')[1])
    setFormData({...formData, defaultCurrency})
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

  const [errors, setErrors] = useState({companyNameError:false, businessCategoryError:false, teamSizeError:false, companyHQError:false, defaultCurrencyError:false, companyEmailError:false})
  const [filename, setFileName] = useState(null)

  const handleSubmit = async () => {


    let allowSubmit = true
    const data = new FormData();
    setErrors({companyName:false, businessCategoryError:false, teamSizeError:false, companyHQError:false, defaultCurrencyError: false, companyEmailError:false})
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
      if(Object.keys(formData.defaultCurrency).length == 0){
        setErrors(pre=>({...pre, defaultCurrencyError:true}))
        allowSubmit=false
      }
      if(formData.companyEmail == '' || formData.companyEmail == undefined || formData.companyEmail == null){
        setErrors(pre=>({...pre, companyEmailError:true}))
        console.log(formData.companyEmail, 'company email from errors')
        allowSubmit=false
      }else if(!validEmail(formData.companyEmail)){
        console.log(validEmail(formData.companyEmail, 'is valid email'))
        setErrors(pre=>({...pre, companyEmailError:true}))
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

      setIsUploading(true)
      const res = await postTenantCompanyInfo_API({tenantId, companyInfo:{...formData}})
      const progress_copy = JSON.parse(JSON.stringify(progress));
      progress_copy.sections['section 1'].state = 'done';
      progress_copy.sections['section 1'].coveredSubsections = 1;
      progress_copy.activeSection = 'section 2';
      
      if(progress.maxReach==undefined || progress.maxReach==null || progress.maxReach.split(' ')[1] < 2){
        progress_copy.maxReach = 'section 2';
      }
      
      console.log(progress_copy, 'progress..copy')
      
      const progress_res = await postProgress_API({tenantId, progress:progress_copy})

      setIsUploading(false)

      if(res.err || progress_res.err){
        setLoadingErr(res.err??progress_res.err)
        setPrompt({showPrompt:true, promptMsg:res.err??progress_res.err??'Something went wrong. Please try again later'})
        return
      }

        setPrompt({showPrompt:true, promptMsg: 'Company Details Updated!'})
      
      setTimeout(() => {
        setProgress(progress_copy)
        navigate(`/${tenantId}/upload-hr-data/`, {state:{tenantId}})
      }, 3100);
      
    }
  
  }

  function validEmail(email) {
    // Regular expression for a basic email pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Test the email against the regex pattern
    return emailRegex.test(email);
  }

  const handleSaveAsDraft = async ()=>{
    let allowSubmit = true
    const data = new FormData();
    //validate form
    setErrors({companyName:false, businessCategoryError:false, teamSizeError:false, companyHQError:false, defaultCurrencyError: false, companyEmailError:false})
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
        if(Object.keys(formData.defaultCurrency).length == 0){
          setErrors(pre=>({...pre, defaultCurrencyError:true}))
          allowSubmit=false
        }
        if(formData.companyEmail == '' || formData.companyEmail == undefined || formData.companyEmail == null){
          setErrors(pre=>({...pre, companyEmailError:true}))
          console.log(formData.companyEmail, 'company email from errors')
          allowSubmit=false
        }else if(!validEmail(formData.companyEmail)){
          console.log(validEmail(formData.companyEmail, 'is valid email'))
          setErrors(pre=>({...pre, companyEmailError:true}))
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
      window.location.href = WEB_PAGE_URL
    }
  }

  useEffect(()=>{
    (async function(){
      const res = await getTenantCompanyInfo_API({tenantId})
      if(res.err){
        setLoadingErr(res.err);
      }
      if(!res.err){
        const companyInfo = res.data.companyDetails
        console.log(companyInfo)
        setFormData(pre=>({...pre, businessCategory:companyInfo?.industry, teamSize:companyInfo?.companySize, companyName:companyInfo?.companyName, defaultCurrency:companyInfo?.defaultCurrency??{}, companyHQ:companyInfo?.companyHeadquarters, companyEmail:companyInfo?.companyEmail}))
        setIsLoading(false)
      }
    })()
  },[])


  useEffect(()=>{
    if(progress!= undefined && progress?.activeSection != 'section 1'){
      setProgress(pre=>({...pre, activeSection:'section 1'}))
    }
  },[progress])


  useEffect(()=>{
    console.log(errors, 'errors')
  }, [errors])

  return (<>
  <MainSectionLayout>
    {isLoading && <Error message={loadingErr} />}
    {!isLoading && 

          <div className="px-4 md:px-0 w-full pt-10 flex flex-col items-center justify-center gap-[24px]">
            
            <div className="md:px-0 md:min-w-[403px] flex flex-col items-center justify-start gap-[24px] w-full">
              <div className="flex flex-col items-start justify-start gap-[8px]">
                <div className="relative text-neutral-800 text-2xl tracking-tight font-semibold font-cabin">
                  Tell us a bit about your company
                </div>
                <div className="relative text-sm tracking-tight text-zinc-400 font-cabin font-normal">
                  Enter the company details.
                </div>
              </div>

              <div className="flex w-full flex-col items-start md:items-center justify-start gap-[24px] text-sm">
                <div className='flex w-full sm:w-[403px] md:w-fit flex-col gap-4 lg:flex-row lg:gap-1'>
                  <Input 
                      title='Company Name' 
                      placeholder='company name' 
                      // options={companyList}
                      value = {formData?.companyName} 
                      // allowCustomInput={true}
                      error={{set:errors.companyNameError, message:'Please enter company name'}} 
                      onBlur={(e)=>{handleCompanySearch(e.target.value)}} />

                  <Input 
                      title='Company Email' 
                      placeholder='company email' 
                      value = {formData?.companyEmail} 
                      // allowCustomInput={true}
                      error={{set:errors.companyEmailError, message:'Please provide valid email'}} 
                      onBlur={(e)=>{handleCompanyEmail(e.target.value)}} />
                </div>
                <Select 
                    titleCase={false}
                    title='Business Category' 
                    placeholder='Select business category'
                    currentOption = {formData?.businessCategory} 
                    options={businessCategoriesList}
                    error={{set:errors.businessCategoryError, message:'Please select business category'}} 
                    onSelect={(option)=>{handleBusinessCategory(option)}} />
                <Select 
                    title='Team Size' 
                    options={['1-10', '10-50', '50-100', '100-500', '>500']} 
                    placeholder='Select team size' 
                    currentOption = {formData?.teamSize}
                    error={{set:errors.teamSizeError, message:'Please select team size'}}
                    onSelect={(option)=>handlTeamSize(option)} />
                <Search 
                  title='Company HQ Location' 
                  allowCustomInput={true} 
                  options={locationsList} 
                  placeholder='City'
                  currentOption = {formData?.companyHQ}
                  error={{set:errors.companyHQError, message:'Please enter company headquarter location'}}
                  onSelect={(option)=>{handleHqLocation(option)}} />

                <Select title='Select Currency' 
                    drop='up'
                    titleCase={false}
                    onSelect={handleCurrencySelection}
                    currentOption = {`${formData?.defaultCurrency?.fullName}-${formData?.defaultCurrency?.shortName}`}
                    error={{set:errors.defaultCurrencyError, message:'Please select company\'s default currency'}} 
                    options={currenciesList.map(currency=>`${currency.fullName}-${currency.shortName}`).sort()} />
            
              </div>

              </div>

              <div className='mb-10 w-full flex gap-8 items-center justify-end flex-wrap '>
                {/* <Button variant='fit' text='Save as Draft' onClick={()=>{handleSaveAsDraft();}} /> */}
                <Button isLoading={isUploading} variant='fit' text='Save and Continue' onClick={()=>{handleSubmit();}} />
              </div>

          </div>} 
          <Prompt prompt={prompt} setPrompt={setPrompt} />
  </MainSectionLayout>
  </>
  );
};

