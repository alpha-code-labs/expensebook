import { useState, useEffect, useRef } from 'react';
import Icon from '../components/common/Icon';
import { forgetPassword_icon, login_icon, verify_shield } from '../assets/icon';
import Search from '../components/common/Search';
import Error from '../components/common/Error';
import PopupMessage from '../components/common/PopupMessage'
import { useCookies } from 'react-cookie';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { Link, useNavigate } from 'react-router-dom';
import {  getCompanyList_API, postForgotPassword_API, postLogin_API} from '../utils/api';
import { urlRedirection } from '../utils/handyFunctions';

//inputs: company name, full name of user, mobile number, company HQ, email Id, password and confirm Password

export default function CompanyAndHRInformation(props){

  const setPopupMsgData = props.setPopupMsgData
  const popupMsgData = props.popupMsgData
  const initialPopupData = props.initialPopupData

  const emailRef = useRef()
  const passwordRef = useRef()

  const DASHBOARD_PAGE_URL  = import.meta.env.VITE_DASHBOARD_PAGE_URL
  const ONBOARDING_PAGE_URL = import.meta.env.VITE_ONBOARDING_PAGE_URL
  const navigate= useNavigate()
  const [companyList, setCompanyList] = useState(["tesla"])
  const [formData, setFormData] = useState({companyName:'',  email:'', password:'', })
  const [isLoading,setIsLoading]=useState(false)
  const [loadingErrorMsg, setLoadingErrorMsg]=useState(false)
  const [errors, setErrors] = useState({companyNameError:{set:false, message:null},  emailError:{set:false, message:null}, passwordError:{set:false, message:null}, confirmPasswordError:{set:false, message:null}})
  const [isUploading,setIsUploading]=useState({logFog:false,login:false})



  const [showPrompt, setShowPrompt] = useState(false)
  const [cookies] = useCookies(['authToken']);
  const [isForgotPassword, setIsForgotPassword] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await getCompanyList_API();

        if (error) {
          // setLoadingErrorMsg(error.message);
          setPopupMsgData({showPopup:true, message:error?.message, iconCode: "102"})
          setIsLoading(false)
        } else {
          setCompanyList(data.companyNames);
        }
      } catch (error) {
        setPopupMsgData({showPopup:true, message:error?.message, iconCode: "102"})
        setIsLoading(false)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
 
  console.log(companyList)

  





  const handleSelect = (selectedValue) => {
    setFormData((prevData) => ({ ...prevData, companyName: selectedValue }));
  };



  const handleLogin = () => {

    let allowSubmit = true
    const email = emailRef?.current?.value || ""
    const password = passwordRef?.current?.value

    const data = new FormData();

    
    //validate form
   (function async(){
 
    return new Promise((resolve, reject)=>{
      if(formData.companyName == '' || formData.companyName == undefined){
        setErrors(pre=>({...pre, companyNameError:{set:true, message:'Company name is required.'}}))
        allowSubmit=false
      }else{setErrors(pre=>({...pre, companyNameError:{set:false, message:''}}))}

     

      if(!email){
        setErrors(pre=>({...pre, emailError:{set:true, message:'Email is required.'}}))
        allowSubmit=false
      }
      else if(!validateEmail(email)){
        setErrors(pre=>({...pre, emailError:{set:true, message:'Please enter valid email id'}}))
        allowSubmit=false
      }else{setErrors(pre=>({...pre, emailError:{set:false, message:''}}))}


      if(!password){
        setErrors(pre=>({...pre, passwordError:{set:true, message:'Password is required.'}}))
        allowSubmit=false
      }else{setErrors(pre=>({...pre, passwordError:{set:false, message:''}}))}

      // if(formData.confirmPassword == ''){
      //   setErrors(pre=>({...pre, confirmPasswordError:{set:true, message:'Please confirm your password'}}))
      //   allowSubmit=false
      // }
      // else if(formData.password != formData.confirmPassword){
      //   setErrors(pre=>({...pre, confirmPasswordError:{set:true, message:'Entered Passwords do not match'}}))
      //   allowSubmit=false
      // }else{setErrors(pre=>({...pre, confirmPasswordError:{set:false, message:''}}))}

   
      resolve()
    })
  })().then(async()=>{
   
    if(allowSubmit){
        console.log('data',formData)
  
       // navigate('/success-page');
        
          setIsUploading(prevState => ({ ...prevState, logFog: true }));
          const {error,data} = await postLogin_API({companyName:formData.companyName, email, password})
          // Redirect to the dashboard page with the authToken as a query parameter
          if (error) {
          console.error('API Error:', error);
          setIsUploading(prevState => ({ ...prevState, logFog: false }));
          // setShowPopup(true)
          // setMessage(error.message || "An unexpected error occurred.");
          setPopupMsgData({showPopup:true, message:error?.message, iconCode:'102'})
          setTimeout(()=>{
            // setMessage(null)
            // setShowPopup(false)
            setPopupMsgData(initialPopupData);
          },3000)
          }else{
            const temporaryPasswordFlag = data.temporaryPasswordFlag
            const onboardingFlag = data.onboardingFlag
            document.cookie = `authToken=${data.data}; path=/;`;
            console.log('API Response:', data.message);
            sessionStorage.setItem('email', `${email}`);
            setIsUploading(prevState => ({ ...prevState, logFog: false }));
            setPopupMsgData({showPopup:true, message:data.message, iconCode:'101'})
            // setMessage(data.message);
            // setShowPopup(true)
            
            setTimeout(()=>{
              setPopupMsgData(initialPopupData)
            },3000)
            if(temporaryPasswordFlag){
              navigate(`/update-password`);
              console.log(formData.email)
            }else{
              if(onboardingFlag){ 
                urlRedirection(`${DASHBOARD_PAGE_URL}/${data.tenantId}/${data.empId}/overview`); 
              }else{
                urlRedirection( `${ONBOARDING_PAGE_URL}/${data.tenantId}/welcome`);  
                // urlRedirection( `http://localhost:5173/onboarding?authToken=${data.data}`);  
              }
            }
          }
       
    }
  })

  };


  const clickForgotPassword =()=>{
    setIsForgotPassword((prev)=>(!prev))
  }

  
  const handleForgotPassword =async()=>{

    const email = emailRef?.current?.value
    let allowSubmit = true    
    //validate form
  
      if(formData.companyName == '' || formData.companyName == undefined){
        setErrors(pre=>({...pre, companyNameError:{set:true, message:'Please select company name'}}))
        allowSubmit=false
      }else{setErrors(pre=>({...pre, companyNameError:{set:false, message:''}}))}

      if(!email){
        setErrors(pre=>({...pre, emailError:{set:true, message:'Email is required.'}}))
        allowSubmit=false
      }
      else if(!validateEmail(email)){
        setErrors(pre=>({...pre, emailError:{set:true, message:'Please enter valid email id'}}))
        allowSubmit=false
      }else{setErrors(pre=>({...pre, emailError:{set:false, message:''}}))}
   

   
    if(allowSubmit){
      
       const {companyName }= formData
      
       
       const ForgotPasswordInputs ={
        companyName,email
       }
       console.log(ForgotPasswordInputs)
  
    
       setIsUploading(prevState => ({ ...prevState, logFog: true }));
          const {error,data} =   await postForgotPassword_API(ForgotPasswordInputs)
          if (error) {
            // Handle API error here
           
            // console.error('API Error:', error);
           
            setIsUploading(prevState => ({ ...prevState, logFog: false }));
            // setMessage(error.message || "An unexpected error occurred.");
            // setShowPopup(true)
            setPopupMsgData({showPopup:true, message:error.message, iconCode:'102'})
            setTimeout(()=>{
              // setMessage(null)
              // setShowPopup(false)
              setPopupMsgData(initialPopupData)
  
            },3000)
          } else {
            // Check the result and perform necessary actions
            console.log('API Response:', data.message);
  
            setIsUploading(prevState => ({ ...prevState, logFog: false }));
            // setMessage(data.message);
            // setShowPopup(true)
            setPopupMsgData({showPopup:true, message:error.message, iconCode:'101'})
            
            setTimeout(()=>{
             setPopupMsgData(initialPopupData)
            },3000)
            setIsForgotPassword(false)
            // For example, you can redirect to another page after successful signup
            // navigate('/success-page');
          }
          
          // navigate('/dashboard')
        
    }
  }


  const email = emailRef?.current?.value
  const password = passwordRef?.current?.value
 console.log('login data', formData,email,password)
  return (
    <div> 
      {isLoading && <Error message={loadingErrorMsg}/>}
    {!isLoading &&
    <>
    <div className=' min-h-screen flex flex-col md:flex-row'>
    <div className='static md:fixed bg-white py-4 px-4 w-fit  top-0 left-0'>
        <Icon/>
    </div>
  <div className='w-full md:w-1/2 flex items-center justify-center mt-6 md:mt-0'>
      <img src={isForgotPassword ? forgetPassword_icon : login_icon} className=' bg-cover h-full w-[70%] '/>
    </div>
    <div className='w-full md:w-1/2 border-l border-slate-300'>
    
    {/* <div className='fixed sr-only lg:not-sr-only left-0 top-0 h-[100vh] w-[40vw] flex flex-col justify-center items-center [background:linear-gradient(187.95deg,_rgba(76,_54,_241,_0),_rgba(76,_54,_241,_0.03)_9.19%,_rgba(76,_54,_241,_0.06)_17.67%,_rgba(76,_54,_241,_0.1)_25.54%,_rgba(76,_54,_241,_0.14)_32.86%,_rgba(76,_54,_241,_0.19)_39.72%,_rgba(76,_54,_241,_0.25)_46.19%,_rgba(76,_54,_241,_0.31)_52.36%,_rgba(76,_54,_241,_0.38)_58.3%,_rgba(76,_54,_241,_0.46)_64.08%,_rgba(76,_54,_241,_0.53)_69.79%,_rgba(76,_54,_241,_0.62)_75.51%,_rgba(76,_54,_241,_0.71)_81.31%,_rgba(76,_54,_241,_0.8)_87.28%,_rgba(76,_54,_241,_0.9)_93.48%,_#4c36f1)]'>
      <img src={leftFrame} className='w-fit' />
    </div> */}
    
    <div className='justify-center rounded-md  mt-[20%] w-full overflow-x-hidden  flex  items-center'>
      <div className=" flex flex-col items-start justify-start gap-[24px]">
        
        <div className="flex flex-col items-start justify-start gap-[24px] w-full">
          <div className="flex flex-col items-start justify-start gap-[8px]">
            <div className="text-neutral-800 text-xl tracking-tight font-semibold font-cabin">
              {isForgotPassword ? 'Forgot Password !' : 'Please login to your account!'}
            </div>
          </div>
        </div>

          <form className='p-4 pt-6 border-neutral-400 w-full md:min-w-[400px] rounded-lg border'>
            <div className="flex w-full flex-col items-start justify-start gap-[24px] text-sm">

            <div className='flex gap-2 w-full'>
                    <Search
                    title='Company Name' 
                    placeholder='Select company name'
                    options={companyList}
                    onSelect={handleSelect}
                    error={errors.companyNameError}
                    />

               
            </div>

            <div className='flex gap-2  w-full'>
              

            <Input
            ref={emailRef}
      title='Email Id' 
      placeholder='email id'
      type='email'
      value={formData.email}
      titleCase={false}
      error={errors.emailError} 
      
      onBlur={(e) => setFormData(prev => ({ ...prev, email: e.target.value.trim() }))}
    />
            </div>
{isForgotPassword ? null :
            <div className='flex gap-2 flex-col md:flex-row w-full'>
                <Input
                ref={passwordRef}
                    title='Password' 
                    placeholder='password'
                    value={formData.password}
                    type='password'
                    titleCase={false}
                    error={errors.passwordError} 
                   
                    onBlur={(e)=> setFormData(pre=>({...pre, password:e.target.value})) } />

                {/* <Input
                    title='Confirm Password' 
                    placeholder='confirm password'
                    value={formData.confirmPassword}
                    type='password'
                    titleCase={false}
                    error={errors.confirmPasswordError} 
                    onBlur={(e)=> setFormData(pre=>({...pre, confirmPassword:e.target.value})) } /> */}
            </div>
            }

            
            </div>

            <div className='mt-10 mb-5 w-full px-6 flex-grow flex flex-col gap-2 items-center'>
                <Button variant='full'  uploading={isUploading.logFog} disabled={isUploading.logFog} text={isForgotPassword ? 'Submit' :'Sign in'} onClick={()=>(isForgotPassword ? handleForgotPassword(): handleLogin()) } />
            <div className="cursor-pointer text-sm font-cabin" onClick={clickForgotPassword}>
                  <p  className="font-semibold text-indigo-600 hover:text-indigo-500">{isForgotPassword ?  `Sign in `:`Forgot password?`}</p>
            </div>
            </div>
<div className='border-b mb-4 border-neutral-400'/>
            <Link to='/sign-up'  className="text-sm font-cabin text-center" onClick={clickForgotPassword}>
                  <p  className=" ">Don't have ExpenseBook account?<span className='pl-2 font-semibold text-indigo-600 hover:text-indigo-500'>Sign up now</span></p>
            </Link>

          </form>

      </div>
    </div>
    {/* <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/> */}
  </div> 


    <Modal showModal={showPrompt} setShowModal={setShowPrompt} skipable={true} >
    {/* <div className="flex min-h-screen items-center justify-center bg-blue-500"> */}
      <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md">
        <header className="h-16 w-16 bg-indigo-500  text-2xl rounded-full flex items-center justify-center">
          <img src={verify_shield} height={20} width={20}/>
        </header>
        <h4 className="text-lg font-semibold text-gray-700 mt-4">Enter OTP Code</h4>
        <form action="#" className="flex flex-col items-center">
           <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs gap-2 mt-5">
              <DigitInput/>
              <DigitInput/>
              <DigitInput/>
              <DigitInput/>
              <DigitInput/>
              <DigitInput/>
            </div>
          
          <div className="mt-6 w-full text-white text-base border-none py-3 rounded-md " >
          <Button  variant='full' text="Submit" onClick={()=>{console.log('object')}} />
          </div>
          <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                <p>Didn't recieve code?</p> <a className="flex flex-row items-center text-indigo-600" href="http://" target="_blank" rel="noopener noreferrer">Resend</a>
          </div>
        </form>
      </div>
    {/* </div> */}
          {/* <div className='p-10'>
              <p className='text-zinc-800 text-base font-medium font-cabin mt-4'>
                {prompt}  
              </p>
              <div className='inline-flex justify-end w-[100%] mt-10'>
                  <div className='w-[150px]'>
                    <Button text='Ok' />
                  </div>
              </div>
          </div> */}
    </Modal>
    </div>
  </>}
  </div>
  );

}


const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };



function DigitInput(){
  return(
    <div className="w-16 h-12 ">
                <input type="text" maxLength="1"   className="w-full h-full flex flex-col items-center justify-center text-center px-2 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-indigo-600"  name="" id=""/>
              </div>
  )
}