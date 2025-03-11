import { useState, useEffect, useRef } from 'react';
import Icon from '../components/common/Icon';
import axios from 'axios';
import { signup_icon, verify_shield } from '../assets/icon';
import Search from '../components/common/Search';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { Link, useNavigate } from 'react-router-dom';
import { getCityList_API, postOtpValidation_API, postSignupData_API } from '../utils/api';
import PopupMessage from '../components/common/PopupMessage';
import Error from '../components/common/Error';
import { validatePassword } from '../utils/handyFunctions';


//signup  with  set password first time
//inputs: company name, full name of user, mobile number, company HQ, email Id, password and confirm Password

export default function CompanyAndHRInformation(props){
  const setPopupMsgData = props.setPopupMsgData
  const popupMsgData = props.popupMsgData
  const initialPopupData = props.initialPopupData
  const [locationsList, setLocationsList] = useState([])
  const [formData, setFormData] = useState({companyName:'', fullName:'', email:'', password:'', confirmPassword:'', companyHQ:'', mobileNumber:''})
  const [isLoading,setIsLoading]=useState(false)
  const [isUploading,setIsUploading]=useState({signup:false,otpValidation:false})
  const [loadingErrorMsg, setLoadingErrorMsg]=useState(false)
  const [showPopup , setShowPopup]=useState(false)
  const [message,setMessage]=useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  

  const navigate = useNavigate()


  const handleGetCities=async()=>{

      const {error,data} = await getCityList_API({ "country":"india" });
      
      if (error) {
        // Handle API error here
      
       setIsLoading(false)
        console.error('API Error:', error);
        // setMessage(error.message || "An unexpected error occurred.");
        // setShowPopup(true)
        setPopupMsgData({showPopup:true, message:error?.message, iconCode: '102'})
        setTimeout(()=>{
          // setMessage(null)
          // setShowPopup(false)
          setPopupMsgData(initialPopupData)
        

        },3000)
      } else {
        setIsLoading(false)
        // Check the result and perform necessary actions
        const nestedArray = data?.data
        const cityList = nestedArray.flat()
        console.log('city API Response:',cityList);
        setLocationsList(cityList)
        
      }
  
  }
  // useEffect(()=>{
  //   handleGetCities()
  // },[]) 



  


  const [errors, setErrors] = useState({digitErrors: [false, false, false, false, false, false],},{companyNameError:{set:false, message:null}, fullNameError:{set:false, message:null}, emailError:{set:false, message:null}, passwordError:{set:false, message:null}, confirmPasswordError:{set:false, message:null}, companyHQError:{set:false, message:null}, mobileNumberError:{set:false, message:null}})

  const handleSubmit = () => {

    let allowSubmit = true

    const data = new FormData();

    
    //validate form
   (function async(){
    return new Promise((resolve, reject)=>{
      if(formData.companyName == '' || formData.companyName == undefined){
        setErrors(pre=>({...pre, companyNameError:{set:true, message:'Company name is required.'}}))
        allowSubmit=false
      }else{setErrors(pre=>({...pre, companyNameError:{set:false, message:''}}))}

      if(formData.fullName == ''){
        setErrors(pre=>({...pre, fullNameError:{set:true, message:'Please enter full name'}}))
        allowSubmit=false
      }else{setErrors(pre=>({...pre, fullNameError:{set:false, message:''}}))}

      if(formData.email == ''){
        setErrors(pre=>({...pre, emailError:{set:true, message:'Email is required.'}}))
        allowSubmit=false
      }
      else if(!validateEmail(formData.email)){
        setErrors(pre=>({...pre, emailError:{set:true, message:'Please enter valid email id'}}))
        allowSubmit=false
      }else{setErrors(pre=>({...pre, emailError:{set:false, message:''}}))}

      if(formData.mobileNumber == '' || formData.mobileNumber == undefined || formData.mobileNumber == null) {
        setErrors(pre=>({...pre, mobileNumberError: {set:true, message: 'Please enter your mobile number'}}))
        allowSubmit = false
      }else if(isNaN(formData.mobileNumber)){
        setErrors(pre=>({...pre, mobileNumberError: {set:true, message: 'Please enter your mobile number'}}))
        allowSubmit=false
      }else {setErrors(pre=>({...pre, mobileNumberError:{set:false, message:''}}))}

      if(formData.password == ''){
        setErrors(pre=>({...pre, passwordError:{set:true, message:'Password is required.'}}))
        allowSubmit=false
      } else if(!validatePassword(formData.password)){
       setErrors(pre=>({...pre,passwordError: {
        set: true,
        message: 'Password must be at least 8 characters long and include uppercase, lowercase, special character.'
    }}))
    allowSubmit=false
      }
      else{setErrors(pre=>({...pre, passwordError:{set:false, message:''}}))}

      if(formData.confirmPassword == ''){
        setErrors(pre=>({...pre, confirmPasswordError:{set:true, message:'Please confirm your password'}}))
        allowSubmit=false
      }
      else if(formData.password != formData.confirmPassword){
        setErrors(pre=>({...pre, confirmPasswordError:{set:true, message:'Entered Passwords do not match'}}))
        allowSubmit=false
      }else{setErrors(pre=>({...pre, confirmPasswordError:{set:false, message:''}}))}

      if(!formData.companyHQ){
        setErrors(pre=>({...pre, companyHQError:{set:true, message:'Please select company location'}}))
        allowSubmit=false
       
      }else{setErrors(pre=>({...pre, companyHQError:{set:false, message:''}}))}

      resolve()
    })
  })().then(async()=>{
   
    if(allowSubmit){
      
        setIsUploading(prevState => ({ ...prevState, signup: true }));
        const {error,data} = await postSignupData_API({ formData });

        if (error) {
          // Handle API error here
         
          console.error('API Error:', error);
         // setMessage(error.message || "An unexpected error occurred.");
          setIsUploading(prevState => ({ ...prevState, signup: false }));
         // setShowPopup(true)
         setPopupMsgData({showPopup:true, message: error?.message, iconCode: '102'})
          setTimeout(()=>{
            setPopupMsgData(initialPopupData)
            // setMessage(null)
            // setShowPopup(false)
           // navigate("/sign-in")
          },3000)
        } else {
          // Check the result and perform necessary actions
          console.log('API Response:', data.message);
          setIsUploading(prevState => ({ ...prevState, signup: false }));
          navigate("/sign-in")
          // setMessage(data.message);
          // setShowPopup(true)
          // setTimeout(()=>{
          //   setMessage(null)
          //   setShowPopup(false)
          //   navigate("/sign-in")
          // },3000)
          // For example, you can redirect to another page after successful signup
          // navigate('/success-page');
        }
    }
    
  })

  };
  


  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);

  const handleDigitChange = (index, newValue) => {
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = newValue;
    setOtpDigits(newOtpDigits);
  };

  const handleOtpSubmit = async() => {
    // Check for errors in the OTP input
    const newErrors = {
      digitErrors: otpDigits.map((digit) => digit === ''),
    };
  
    // Check if there are any errors
    if (newErrors.digitErrors.some((error) => error)) {
      // If there are errors, update the state with the new error information
      setErrors(newErrors);
    } else {
      const otpCode = otpDigits.join('');
    console.log(otpCode);
      const validationData = {email:formData.email,otp:otpCode}
        setIsUploading(prevState => ({ ...prevState, otpValidation: true }));
        const {error,data} = await postOtpValidation_API(validationData);

        if (error) {
          // Handle API error here
         
          console.error('API Error:', error);
          //setMessage(error.message || "An unexpected error occurred.");
          setIsUploading(prevState => ({ ...prevState, otpValidation: false }));
          //setShowPopup(true)
          setPopupMsgData({showPopup:true, message:error?.message, iconCode:'102'})
          setTimeout(()=>{
            setPopupMsgData(initialPopupData)
          },3000)
        } else {
          // Check the result and perform necessary actions
          console.log('API Response:', data.message);

          setIsUploading(prevState => ({ ...prevState, otpValidation: false }));
          // setMessage(data.message);
          // setShowPopup(true)
          setPopupMsgData({showPopup:true, message:data?.message, iconCode: '101'})
          setTimeout(()=>{
           setPopupMsgData(initialPopupData)
          },3000)
          // For example, you can redirect to another page after successful signup
          // navigate('/success-page');
        }
    

    }
  };

 
  
  return (
    <>
    {isLoading && <Error message={loadingErrorMsg}/>}
    {!isLoading && 
    <>
   

    <div className='flex flex-col md:flex-row min-h-screen'>
    <div className='static md:fixed bg-white py-4 px-4 w-fit  top-0 left-0'>
        <Icon/>
    </div>
   
     <div className='w-full md:w-1/2 flex items-center justify-center'>
      <img src={signup_icon} className=' bg-cover h-full w-[80%] '/>
    </div>
    <div className=' w-full md:w-1/2  border-l border-slate-300    flex justify-center items-center'>
    
   
      <div className=" flex flex-col items-start justify-start  ">
         
        <div className="flex flex-col items-start justify-start ">
          <div className="flex flex-col items-start justify-start gap-[8px]">
            <div className=" text-neutral-800 py-6 text-xl tracking-tight font-semibold font-cabin">
            Create your account now to get started!
            </div>
          </div>
        </div>

          <form className='p-4 pt-6 rounded-lg border border-slate-300'>
            <div className="flex w-full flex-col items-start justify-start gap-[24px] text-sm">

            <div className='flex gap-2 flex-col md:flex-row w-full'>
                <Input
                   textCase='titleCase'
                    title='Company Name' 
                    placeholder='company name'
                    value={formData.companyName}
                    error={errors.companyNameError} 
                    onBlur={(e)=> setFormData(pre=>({...pre, companyName:e.target.value.trim().toLowerCase()}))}/>

                <Input
                    textCase='titleCase'
                    title='Full Name' 
                    placeholder='full name'
                    value={formData.fullName}
                    error={errors.fullNameError} 
                    onBlur={(e)=> setFormData(pre=>({...pre, fullName:e.target.value.trim()})) } />

            </div>

            {/* <div className='flex gap-2 flex-col w-full'> */}
            <div className='w-full flex flex-row'>
              {/* <Select/> */}
                <Input
                    type = 'contact'
                    title='Mobile Number' 
                    placeholder='mobile number'
                    value={formData.mobileNumber}
                    error={errors.mobileNumberError} 
                    onBlur={(e)=> setFormData(pre=>({...pre, mobileNumber:e.target.value.trim()})) } />
            </div>        

                <Input
                    title='Email Id' 
                    placeholder='email id'
                      type='email'
                    value={formData.email}
                    titleCase={false}
                    error={errors.emailError} 
                    onBlur={(e)=> setFormData(pre=>({...pre, email:e.target.value.trim().toLowerCase()})) } />
            {/* </div> */}

            {/* <div className='flex gap-2 flex-col md:flex-row w-full'> */}
                <Input
                    title='Password' 
                    placeholder='password'
                    value={formData.password}
                    type='password'
                    titleCase={false}
                    error={errors.passwordError} 
                    onBlur={(e)=> setFormData(pre=>({...pre, password:e.target.value.trim()})) } />

                <Input
                    title='Confirm Password' 
                    placeholder='confirm password'
                    value={formData.confirmPassword}
                    type='password'
                    titleCase={false}
                    error={errors.confirmPasswordError} 
                    onBlur={(e)=> setFormData(pre=>({...pre, confirmPassword:e.target.value.trim()})) } />
            {/* </div> */}
            <div className='w-full '> 
                <Search 
                title='Company HQ Location' 
                focusHandle={handleGetCities}
                allowCustomInput={true} 
                options={locationsList} 
                currentOption = {formData.companyHQ} 
                placeholder='Select the City' 
                error={errors.companyHQError} 
                onSelect={(option)=> setFormData(pre=>({...pre, companyHQ:option}))} />
            </div>
            </div>

            <div  className='flex flex-col mt-10 mb-5 w-full px-6  flex-grow gap-2 items-center '>
                <Button variant='full' uploading={isUploading.signup} disabled={isUploading.signup} text='Sign Up' onClick={()=>handleSubmit()} />
          <div className="text-sm font-cabin" >
           <Link to='/sign-in'><p  className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">Already have an account?</p></Link> 
          </div>
            </div>
            

          </form>

      </div>
    </div>
  </div> 


    <Modal showModal={showPrompt} setShowModal={setShowPrompt}  >
    {/* <div className="flex min-h-screen items-center justify-center bg-blue-500"> */}
      <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md">
        <header className="h-16 w-16 bg-indigo-500  text-2xl rounded-full flex items-center justify-center">
          <img src={verify_shield} height={20} width={20}/>
        </header>
        <h4 className="text-lg font-semibold text-gray-700 mt-4">Enter OTP Code</h4>
        <form action="#" className="flex flex-col items-center">
      <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs gap-2 mt-5">
        {otpDigits.map((value, index) => (
          <DigitInput 
          key={index} 
          value={value}
          onChange={(newValue) => handleDigitChange(index, newValue)} 
          error={errors.digitErrors[index]}/>
        ))}
      </div>

      <div className="mt-6 w-full text-white text-base border-none py-3 rounded-md " disabled>
        <Button uploading={isUploading.otpValidation} disabled={isUploading.otpValidation} variant="full" text="Submit" onClick={handleOtpSubmit} />
      </div>
      <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
        <p>Didn't receive code?</p> <a className="flex flex-row items-center text-indigo-600" href="http://" target="_blank" rel="noopener noreferrer">
          Resend
        </a>
      </div>
    </form>
      </div>
   
    </Modal>
    {/* <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/> */}
    </>
    }

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



  function DigitInput({ value, onChange ,error  }) {
    const borderStyle = error ? "border border-red-500" : "border border-gray-200";
    const handleInputChange = (e) => {
      // Ensure that only numeric values are entered
      const newValue = e.target.value.replace(/[^0-9]/g, '');
  
      // Call the provided onChange function with the sanitized value
      onChange(newValue);
    };
  
    return (
      <div className="w-16 h-12">
        <input
          type="text"
          maxLength="1"
          value={value}
          onChange={handleInputChange}
          className={`w-full h-full flex flex-col items-center justify-center text-center px-2 outline-none rounded-xl ${borderStyle} text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-indigo-600`}
        />
      </div>
    );
  }