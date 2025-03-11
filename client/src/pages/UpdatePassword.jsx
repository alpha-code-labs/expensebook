import { useState, useEffect, useRef } from 'react';
import Icon from '../components/common/Icon';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { postSetPassword_API} from '../utils/api';
import PopupMessage from '../components/common/PopupMessage';
import { validatePassword } from '../utils/handyFunctions';
import { login_icon } from '../assets/icon';
// update password after forgot password
//inputs: company name, full name of user, mobile number, company HQ, email Id, password and confirm Password

export default function UpdatePassword(props){
  const setPopupMsgData = props.setPopupMsgData
  const popupMsgData = props.popupMsgData
  const initialPopupData = props.initialPopupData



  const {companyName }=useParams()
  const [formData, setFormData] = useState({email:'',password:'', confirmPassword:''})
  const [showPopup ,setShowPopup]=useState(false);
  const [message,setMessage]=useState(null)  
  const [isUploading , setIsUploading]= useState({update:false})
  const [prompt, setPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);


  const navigate = useNavigate()
  const [errors, setErrors] = useState({  emailError:{set:false, message:null}, passwordError:{set:false, message:null}, confirmPasswordError:{set:false, message:null}})
//for otp submit

// for login
useEffect(()=>{
  const storedEmail = sessionStorage.getItem('email');
  setFormData(prevState => ({ ...prevState, email:storedEmail }));
  console.log('storedEmail',storedEmail)
},[])

console.log('email from update',formData.email)

const handleUpdate = async () => {

  let allowSubmit = true;

  if (formData.password === '') {
    setErrors((pre) => ({
      ...pre,
      passwordError: { set: true, message: 'Password is required.' },
    }));
    allowSubmit = false;
  }else if(!validatePassword(formData.password)){
    setErrors(pre=>({...pre,passwordError: {
     set: true,
     message: 'Password must be at least 8 characters long and include uppercase, lowercase, special character.'
 }}))
 allowSubmit=false
   } 
  else {
    setErrors((pre) => ({ ...pre, passwordError: { set: false, message: '' } }));
  }

  if (formData.confirmPassword === '') {
    setErrors((pre) => ({
      ...pre,
      confirmPasswordError: { set: true, message: 'Please confirm your password' },
    }));
    allowSubmit = false;
  } else if (formData.password !== formData.confirmPassword) {
    setErrors((pre) => ({
      ...pre,
      confirmPasswordError: { set: true, message: 'Entered Passwords do not match' },
    }));
    allowSubmit = false;
  } else {
    setErrors((pre) => ({ ...pre, confirmPasswordError: { set: false, message: '' } }));
  }
  
  if(allowSubmit){
      
    setIsUploading(prevState => ({ ...prevState, update: true }));
    const {error,data} =  await postSetPassword_API(formData);

    if (error) {
      // Handle API error here
     
      console.error('API Error:', error);
      
      setIsUploading(prevState => ({ ...prevState, update: false }));
      // setMessage(error.message || "An unexpected error occurred.");
      // setShowPopup(true)
      setPopupMsgData({showPopup:true, message:error?.message, iconCode:'102'})
      setTimeout(()=>{
        setPopupMsgData(initialPopupData)
      },5000)
    } else {
      // Check the result and perform necessary actions
      console.log('API Response:', data.message);
      setIsUploading(prevState => ({ ...prevState, update: false }));
      // setMessage(data.message);
      // setShowPopup(true)
      // setTimeout(()=>{
      //   setMessage(null)
      //   setShowPopup(false)
      // },5000)
      setPopupMsgData({showPopup:true, message:data?.message, iconCode:'101'})
      setTimeout(()=>{
        setPopupMsgData(initialPopupData);
      },5000)
      
      // For example, you can redirect to another page after successful update
       navigate('/sign-in');
    }
}
};


 
  return (
    <>
    
    <div className=' flex md:flex-row flex-col min-h-screen '>
    <div className='static md:fixed bg-white py-4 px-4 w-fit  inset-x-0 top-0 left-0'>
        <Icon/>
    </div>
    <div className=' w-full md:w-1/2  flex items-center justify-center mt-6 md:mt-0'>
      <img src={login_icon} className=' bg-cover  w-[70%]  '/>
    </div> 
    <div className=' w-full md:w-1/2 border-l border-slate-300  flex justify-center items-center'>
    
    {/* <div className='fixed sr-only lg:not-sr-only left-0 top-0 h-[100vh] w-[40vw] flex flex-col justify-center items-center [background:linear-gradient(187.95deg,_rgba(76,_54,_241,_0),_rgba(76,_54,_241,_0.03)_9.19%,_rgba(76,_54,_241,_0.06)_17.67%,_rgba(76,_54,_241,_0.1)_25.54%,_rgba(76,_54,_241,_0.14)_32.86%,_rgba(76,_54,_241,_0.19)_39.72%,_rgba(76,_54,_241,_0.25)_46.19%,_rgba(76,_54,_241,_0.31)_52.36%,_rgba(76,_54,_241,_0.38)_58.3%,_rgba(76,_54,_241,_0.46)_64.08%,_rgba(76,_54,_241,_0.53)_69.79%,_rgba(76,_54,_241,_0.62)_75.51%,_rgba(76,_54,_241,_0.71)_81.31%,_rgba(76,_54,_241,_0.8)_87.28%,_rgba(76,_54,_241,_0.9)_93.48%,_#4c36f1)]'>
      <img src={leftFrame} className='w-fit' />
    </div> */}

    <div className='w-full md:w-auto overflow-x-hidden flex  items-center justify-center px-4'>
      <div className="w-full flex flex-col items-start justify-start gap-[24px]  ">
        
        <div className="flex flex-col items-start justify-start gap-[24px] w-full">
          <div className="flex flex-col items-start justify-start gap-[8px]">
            <div className="text-neutral-800 text-xl tracking-tight font-semibold font-cabin">
              Update Password !
            </div>
          </div>
        </div>

          <form className='w-full border-neutral-400  rounded-lg border p-4 '>
            <div className="flex w-full md:min-w-[390px] shrink  flex-col items-start justify-start gap-[24px] text-sm">

            <div className='flex w-full'>
            <div className="text-neutral-800 text-xl tracking-tight font-semibold font-cabin">
              {companyName}
            </div>
            </div>
            {/* <div className='flex w-full'>
                <Input
                    title='Mobile Number' 
                    placeholder='mobile number'
                    value={formData.mobileNumber}
                    error={errors.mobileNumberError} 
                    onBlur={(e)=> setFormData(pre=>({...pre, mobileNumber:e.target.value})) } />

                <Input
                    title='Email Id' 
                    placeholder='email id'
                    value={formData.email}
                    titleCase={false}
                    error={errors.emailError} 
                    onBlur={(e)=> setFormData(pre=>({...pre, email:e.target.value})) } />
                   
            </div> */}
            



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
            </div>

            <div className='mt-10 mb-10 w-full px-6  flex-grow flex items-center flex-row-reverse'>
                <Button variant='full' uploading={isUploading.update} disabled={isUploading.update} text={ 'Update'} onClick={()=>{handleUpdate()}}
 />
            </div>

          </form>

      </div>
    </div>
    <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>
  </div> 
  </div>


  

  </>
  );

}



