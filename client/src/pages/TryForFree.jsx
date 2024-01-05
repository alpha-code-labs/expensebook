import { useState, useEffect, useRef } from 'react';
import chevronDownIcon from '../assets/chevron-down.svg'
import leftFrame from '../assets/leftFrame.svg'
import Icon from '../components/common/Icon';
import Search from '../components/common/Search';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useNavigate } from 'react-router-dom';

//inputs: company name, full name of user, mobile number, company HQ, email Id, password and confirm Password

export default function CompanyAndHRInformation(){
  const [companyList, setCompanyList] = useState([])
  const [businessCategoriesList, setBusinessCategoriesList] = useState(['Mining', 'Construction', 'Manufacturing', 'Transportation', 'Information', 'Finance and Insurance', 'Real State and Rental Leasing', 'Accomodation and Food', 'Educational', 'Health Care', 'Others'])
  const [locationsList, setLocationsList] = useState(['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata'])
  const [formData, setFormData] = useState({companyName:'', fullName:'', email:'', password:'', confirmPassword:'', companyHQ:'', mobileNumber:''})

  const [prompt, setPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false)

  const navigate = useNavigate()

  useEffect(()=>{
    console.log(formData, '...formData')
  },[formData])

  const [errors, setErrors] = useState({companyNameError:{set:false, message:null}, fullNameError:{set:false, message:null}, emailError:{set:false, message:null}, passwordError:{set:false, message:null}, confirmPasswordError:{set:false, message:null}, companyHQError:{set:false, message:null}, mobileNumberError:{set:false, message:null}})

  const handleSubmit = () => {

    let allowSubmit = true

    const data = new FormData();

    
    //validate form
   (function async(){
    return new Promise((resolve, reject)=>{
      if(formData.companyName == '' || formData.companyName == undefined){
        setErrors(pre=>({...pre, companyNameError:{set:true, message:'Please enter company name'}}))
        allowSubmit=false
      }else{setErrors(pre=>({...pre, companyNameError:{set:false, message:''}}))}

      if(formData.fullName == ''){
        setErrors(pre=>({...pre, fullNameError:{set:true, message:'Please enter full name'}}))
        allowSubmit=false
      }else{setErrors(pre=>({...pre, fullNameError:{set:false, message:''}}))}

      if(formData.email == ''){
        setErrors(pre=>({...pre, emailError:{set:true, message:'Please enter email Id'}}))
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

      if(formData.companyHQ == ''){
        setErrors(pre=>({...pre, companyHQError:{set:true, message:'Please select company location'}}))
        allowSubmit=false
      }else{setErrors(pre=>({...pre, companyHQError:{set:false, message:''}}))}

      resolve()
    })
  })().then(()=>{
   
    if(allowSubmit){

    }
    
  })

  };


  return (
    <>
    <div className='fixed bg-white py-4 px-4 w-full z-10 top-0'>
        <Icon/>
    </div>

    <div className='mx-auto w-fit'>
    
    {/* <div className='fixed sr-only lg:not-sr-only left-0 top-0 h-[100vh] w-[40vw] flex flex-col justify-center items-center [background:linear-gradient(187.95deg,_rgba(76,_54,_241,_0),_rgba(76,_54,_241,_0.03)_9.19%,_rgba(76,_54,_241,_0.06)_17.67%,_rgba(76,_54,_241,_0.1)_25.54%,_rgba(76,_54,_241,_0.14)_32.86%,_rgba(76,_54,_241,_0.19)_39.72%,_rgba(76,_54,_241,_0.25)_46.19%,_rgba(76,_54,_241,_0.31)_52.36%,_rgba(76,_54,_241,_0.38)_58.3%,_rgba(76,_54,_241,_0.46)_64.08%,_rgba(76,_54,_241,_0.53)_69.79%,_rgba(76,_54,_241,_0.62)_75.51%,_rgba(76,_54,_241,_0.71)_81.31%,_rgba(76,_54,_241,_0.8)_87.28%,_rgba(76,_54,_241,_0.9)_93.48%,_#4c36f1)]'>
      <img src={leftFrame} className='w-fit' />
    </div> */}
    
    <div className='mx-auto mt-10 w-full p-4 mx-auto overflow-x-hidden flex  items-center'>
      <div className="md:p-0 lg:pt-10 flex flex-col items-start justify-start gap-[24px]">
        
        <div className="flex flex-col items-start justify-start gap-[24px] w-full">
          <div className="flex flex-col items-start justify-start gap-[8px]">
            <div className="text-neutral-800 text-xl tracking-tight font-semibold font-cabin">
              Sign Up !
            </div>
          </div>
        </div>

          <form className='border-neutral-400 p-4 rounded-lg border'>
            <div className="flex w-full flex-col items-start justify-start gap-[24px] text-sm">

            <div className='flex gap-2 flex-col md:flex-row w-full'>
                <Input
                    title='Company Name' 
                    placeholder='company name'
                    value={formData.companyName}
                    error={errors.companyNameError} 
                    onBlur={(e)=> setFormData(pre=>({...pre, companyName:e.target.value})) } />

                <Input
                    title='Full Name' 
                    placeholder='full name'
                    value={formData.fullName}
                    error={errors.fullNameError} 
                    onBlur={(e)=> setFormData(pre=>({...pre, fullName:e.target.value})) } />

            </div>

            <div className='flex gap-2 flex-col md:flex-row w-full'>
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
            </div>

            <div className='flex gap-2 flex-col md:flex-row w-full'>
                <Input
                    title='Password' 
                    placeholder='password'
                    value={formData.password}
                    type='password'
                    titleCase={false}
                    error={errors.passwordError} 
                    onBlur={(e)=> setFormData(pre=>({...pre, password:e.target.value})) } />

                <Input
                    title='Confirm Password' 
                    placeholder='confirm password'
                    value={formData.confirmPassword}
                    type='password'
                    titleCase={false}
                    error={errors.confirmPasswordError} 
                    onBlur={(e)=> setFormData(pre=>({...pre, confirmPassword:e.target.value})) } />
            </div>

            <Search 
            title='Company HQ Location' 
            allowCustomInput={true} 
            options={locationsList} 
            currentOption = {formData.companyHQ}
            placeholder='City'
            error={errors.companyNameError}
            onSelect={(option)=> setFormData(pre=>({...pre, companyHQ:option}))} />
            </div>

            <div className='mt-10 mb-10 w-full max-w-[403px] flex items-center flex-row-reverse'>
                <Button text='Sign Up' onClick={()=>{handleSubmit()}} />
            </div>

          </form>

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

  </>
  );

};


const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

