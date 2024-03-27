import { useState, useEffect, useRef } from 'react';

import chevronDownIcon from '../assets/chevron-down.svg'
import leftFrame from '../assets/leftFrame.svg'
import Icon from '../components/common/Icon';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useNavigate, useParams } from 'react-router-dom';
import { postLogin_API, postOtpValidation_API, postSetPassword_API, postSignupData_API } from '../utils/api';
import PopupMessage from '../components/common/PopupMessage';
import { urlRedirection } from '../utils/handyFunctions';
//after done onboarding user get email and otp
//inputs: company name, full name of user, mobile number, company HQ, email Id, password and confirm Password

export default function CompanyAndHRInformation(){
  const navigate = useNavigate()
  const {companyName}=useParams()
  const [formData, setFormData] = useState({email:'',otp:''})

  // const [formData, setFormData] = useState({companyName:'', email:'',otp:''})
  const [isLoading,setIsLoading]=useState(false)
  const [loadingErrorMsg, setLoadingErrorMsg]=useState(false)
  const [verifyFlag,setVerifyFlag]=useState(false)
  const [message , setMessage]=useState(null);
  const [isUploading, setIsUploading]= useState(false)
  const [showPopup,setShowPopup]=useState(false)
  

  useEffect(()=>{
    console.log(formData, '...formData')
  },[formData])

  const [errors, setErrors] = useState({  emailError:{set:false, message:null}, passwordError:{set:false, message:null}, confirmPasswordError:{set:false, message:null}, otpError:{set:false, message:null}})

//for otp submit
const handleVerifyOtp = async () => {
  // validate form
  let allowSubmit = true;

  if (formData.email === '') {
    setErrors((pre) => ({ ...pre, emailError: { set: true, message: 'Please enter email Id' } }));
    allowSubmit = false;
  } else if (!validateEmail(formData.email)) {
    setErrors((pre) => ({ ...pre, emailError: { set: true, message: 'Please enter a valid email id' } }));
    allowSubmit = false;
  } else {
    setErrors((pre) => ({ ...pre, emailError: { set: false, message: '' } }));
  }
  if (formData.otp === '') {
    setErrors((pre) => ({ ...pre, otpError: { set: true, message: 'Please enter OTP' } }));
    allowSubmit = false;
  } else {
    setErrors((pre) => ({ ...pre, otpError: { set: false, message: '' } }));
  }

  // Move the resolve() inside the validation block
  if (allowSubmit) {
    setIsUploading(true)
    // Assuming resolve is defined somewhere in your code

    // setShowPrompt(true)
    const { error, data } = await postOtpValidation_API(formData);

    if (error) {
      console.error('API Error:', error);
      setIsUploading(false)
      setMessage(error.message || 'An unexpected error occurred.');
      setShowPopup(true);
      setTimeout(() => {
        setMessage(null);
        setShowPopup(false);
      }, 3000);
    } else {
      console.log('API Response:', data.message);
      sessionStorage.setItem('email', formData.email);
      setIsUploading(false);
      setMessage(data.message);
      setShowPopup(true);
      setTimeout(() => {
        setMessage(null);
        setShowPopup(false);
      }, 3000);
      setVerifyFlag(true);
    }
  }
};




// for login
const handleSetPassword=async()=>{
let allowSubmit =true

  if(formData.password == ''){
        setErrors(pre=>({...pre, passwordError:{set:true, message:'Please enter a password'}}))
        allowSubmit=false
      }else{setErrors(pre=>({...pre, passwordError:{set:false, message:''}}))}

      if(formData.confirmPassword == ''){
        setErrors(pre=>({...pre, confirmPasswordError:{set:true, message:'Please confirm your password'}}))
        allowSubmit=false
      }
      else if(formData.password != formData.confirmPassword){
        setErrors(pre=>({...pre, confirmPasswordError:{set:true, message:'Entered Passwords do not match'}}))
        allowSubmit=false
      }else{setErrors(pre=>({...pre, confirmPasswordError:{set:false, message:''}}))}

      if(allowSubmit){

        console.log({
          email:formData.email,
          password :formData.password })
          if(allowSubmit){
            console.log('data',formData)
            // const data1 = {...formData,companyName,confirmPassword:formData.password}
      
           // navigate('/success-page');
            
           setIsUploading(prevState => ({ ...prevState, logFog: true }));
              const {error,data} = await postSetPassword_API(formData)
              // Redirect to the dashboard page with the authToken as a query parameter
              if (error) {
              console.error('API Error:', error);
    
              setMessage(error.message || "An unexpected error occurred.");
              setIsUploading(prevState => ({ ...prevState, logFog: false }));
              setShowPopup(true)
              setTimeout(()=>{
                setMessage(null)
                setShowPopup(false)
              },3000)
              }else{
                const temporaryPasswordFlag = data.temporaryPasswordFlag
                const onboardingFlag = data.onboardingFlag
                document.cookie = `authToken=${data.data}; path=/;`;
                console.log('API Response:', data.message);
                sessionStorage.setItem('email', formData.email);
                setIsUploading(prevState => ({ ...prevState, logFog: false }));
                setMessage(data.message);
                setShowPopup(true)
                setTimeout(()=>{
                  setMessage(null)
                  setShowPopup(false)
                },3000)
                if(temporaryPasswordFlag){
                  navigate(`/update-password`);
                  console.log(formData.email)
                }else{
                  navigate(`/user-login`)
                }
              }
           
        }
      } 
}  

 
  return (
    <>
    <div className='fixed bg-white py-4 px-4 w-full z-10 top-0'>
        <Icon/>
    </div>

    <div className='mx-auto w-fit'>
    
    {/* <div className='fixed sr-only lg:not-sr-only left-0 top-0 h-[100vh] w-[40vw] flex flex-col justify-center items-center [background:linear-gradient(187.95deg,_rgba(76,_54,_241,_0),_rgba(76,_54,_241,_0.03)_9.19%,_rgba(76,_54,_241,_0.06)_17.67%,_rgba(76,_54,_241,_0.1)_25.54%,_rgba(76,_54,_241,_0.14)_32.86%,_rgba(76,_54,_241,_0.19)_39.72%,_rgba(76,_54,_241,_0.25)_46.19%,_rgba(76,_54,_241,_0.31)_52.36%,_rgba(76,_54,_241,_0.38)_58.3%,_rgba(76,_54,_241,_0.46)_64.08%,_rgba(76,_54,_241,_0.53)_69.79%,_rgba(76,_54,_241,_0.62)_75.51%,_rgba(76,_54,_241,_0.71)_81.31%,_rgba(76,_54,_241,_0.8)_87.28%,_rgba(76,_54,_241,_0.9)_93.48%,_#4c36f1)]'>
      <img src={leftFrame} className='w-fit' />
    </div> */}

    <div className='mx-auto mt-10  w-full min- p-4 overflow-x-hidden flex  items-center'>
      <div className="md:p-0  lg:pt-10 flex flex-col items-start justify-start gap-[24px]">
        
        <div className="flex flex-col items-start justify-start gap-[24px] w-full">
          <div className="flex flex-col items-start justify-start gap-[8px]">
            <div className="text-neutral-800 text-xl tracking-tight font-semibold font-cabin">
              Kindly verify the otp  sent to your email address
            </div>
          </div>
        </div>

          <form className='border-neutral-400 p-4 rounded-lg border '>
            <div className="flex min-w-[390px] shrink w-full flex-col items-start justify-start gap-[24px] text-sm">

            <div className='flex w-full'>
            <div className="text-neutral-800 text-xl tracking-tight font-semibold font-cabin">
              {companyName}
            </div>
            </div>
            <div className='flex w-full'>
                {/* <Input
                    title='Mobile Number' 
                    placeholder='mobile number'
                    value={formData.mobileNumber}
                    error={errors.mobileNumberError} 
                    onBlur={(e)=> setFormData(pre=>({...pre, mobileNumber:e.target.value})) } /> */}

                <Input
                    title='Email Id' 
                    type='email'
                    placeholder='email id'
                    value={formData.email}
                    titleCase={false}
                    error={errors.emailError} 
                    onBlur={(e)=> setFormData(pre=>({...pre, email:e.target.value})) } />
                   
            </div>
            
{verifyFlag ? 

<>
<div className='flex w-full'>
      <Input
          title='Password' 
          placeholder='password'
          value={formData.password}
          type='password'
          titleCase={false}
          error={errors.passwordError} 
          onBlur={(e)=> setFormData(pre=>({...pre, password:e.target.value})) } />
 </div>
 <div className='flex w-full'>
      <Input
          title='Confirm Password' 
          placeholder='confirm password'
          value={formData.confirmPassword}
          type='password'
          titleCase={false}
          error={errors.confirmPasswordError} 
          onBlur={(e)=> setFormData(pre=>({...pre, confirmPassword:e.target.value})) } />
  </div> 
</> :<>
<div className='flex w-full flex-col items-center'>
            <h4 className="text-lg font-semibold text-gray-700 mt-4">Enter OTP Code</h4>
            <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs gap-2 mt-5">
            {[...Array(6)].map((_, index) => (
              <>
              <DigitInput value={formData.otp[index] || ''} 
              onChange={(e) => {
              const newOtp = [...formData.otp];
              newOtp[index] = e.target.value;
              setFormData((prev) => ({ ...prev, otp: newOtp.join('') }));
            }
            }/>
              </>
              ))}
            </div>
            <div className="text-xs text-red-600 mt-2 ">
    {errors.otpError.set && errors.otpError.message}
  </div>
           

            <div className="flex flex-row items-start justify-start text-center text-sm font-medium space-x-1 text-gray-500">
                <p>Didn't recieve code?</p> <a className="flex flex-row items-center text-indigo-600" href="http://" target="_blank" rel="noopener noreferrer">Resend</a>
          </div>
          </div>
</>}

            

            

    
            </div>

            <div className='mt-10 mb-10 w-full max-w-[403px] flex items-center flex-row-reverse'>
                <Button uploading={isUploading} disabled={isUploading} text={verifyFlag ? 'Submit'  : 'Verify'} onClick={() => (verifyFlag ? (handleSetPassword()) : handleVerifyOtp())}
 />
            </div>

          </form>

      </div>
    </div>
  </div> 


  
  <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>
  </>
  );

}


const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };



function DigitInput({value,onChange,error}){
  return(
   <>
  
    <div className="w-16 h-12 ">
                <input value={value} onChange={onChange}  type="text" maxLength="1"   className="w-full h-full flex flex-col items-center justify-center text-center px-2 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-indigo-600"  name="" id=""/>
    </div>
    
    
  </>  


  )
}