import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text,Image,Keyboard,Pressable } from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { app_bg } from '../../../assets/icon';
import Search from '../../components/common/Search';



const Login = () => {
  const [companiesList, setCompaniesList] = useState(['Mining', 'Construction', 'Manufacturing', 'Transportation', 'Information', 'Finance and Insurance', 'Real State and Rental Leasing', 'Accomodation and Food', 'Educational', 'Health Care', 'Others'])
  const [formData, setFormData] = useState({companyName:'',  email:'', password:''})
  const [errors, setErrors] = useState({  emailError:{set:false, message:null}, passwordError:{set:false, message:null}, companyNameError:{set:false, message:null}})

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const pressForgotPassword =()=>{
    setIsForgotPassword((prev)=>(!prev))
  }

 
  handleTemporaryPassword=()=>{
    const {companyName , email} = formData
    console.log('forgot password' ,{companyName , email})
    let allowSubmit = true
    if(formData.companyName == '' || formData.companyName == undefined){
      setErrors(pre=>({...pre, companyNameError:{set:true, message:'Please select company name'}}))
      allowSubmit=false
    }else{setErrors(pre=>({...pre, companyNameError:{set:false, message:''}}))}

   

    if(formData.email == ''){
      setErrors(pre=>({...pre, emailError:{set:true, message:'Please enter email Id'}}))
      allowSubmit=false
    }
    else if(!validateEmail(formData.email)){
      setErrors(pre=>({...pre, emailError:{set:true, message:'Please enter valid email id'}}))
      allowSubmit=false
    }else{setErrors(pre=>({...pre, emailError:{set:false, message:''}}))}
  }




  const handleLogin = () => {
    let allowSubmit = true
    if(formData.companyName == '' || formData.companyName == undefined){
      setErrors(pre=>({...pre, companyNameError:{set:true, message:'Please select company name'}}))
      allowSubmit=false
    }else{setErrors(pre=>({...pre, companyNameError:{set:false, message:''}}))}

   

    if(formData.email == ''){
      setErrors(pre=>({...pre, emailError:{set:true, message:'Please enter email Id'}}))
      allowSubmit=false
    }
    else if(!validateEmail(formData.email)){
      setErrors(pre=>({...pre, emailError:{set:true, message:'Please enter valid email id'}}))
      allowSubmit=false
    }else{setErrors(pre=>({...pre, emailError:{set:false, message:''}}))}


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

    // Implement your login logic here
    console.log('data',formData);
    console.log('Logging in with:');
  };


  return (
    <Pressable onPress={Keyboard.dismiss}>
    <View className='flex-1 justify-center items-center relative'>
       <Image
        source={app_bg} 
        className='w-[380px] h-[800px] bg-cover opacity-50 absolute'
        
      />
      <View className="p-6 flex justify-center items-center">
      <Text className="text-neutral-800 text-xl tracking-tight font-semibold font-cabin">{isForgotPassword ? 'Forgot Password ?' : 'Login in to your account!'}</Text>
      {isForgotPassword && <Text className='text-center'>Temporary password will be sent to your registered email address.</Text>}
      </View>
    <View className=' flex flex-col gap-16  ' >
      <View className=' w-[300px]'>
        <Search
        autoFocus={true}
        title='Company Name' 
        placeholder='company name'
        options={companiesList}
        onSelect={(text)=>setFormData((prev)=>({...prev,companyName:text}))}
        error={errors.companyNameError}
        />
      </View>
      <View className='h-10 w-[300px]'>
        <Input
        
         title="Email" 
         placeholder="email"
         value={formData.email}
         onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
         error={errors.emailError}
        />

     </View>  
     {!isForgotPassword && 
     <View className='h-10 w-[300px]'>
     <Input
      title="Password" 
      placeholder="password"
      type='password'
      onChangeText={(text) => setFormData((prev) => ({ ...prev, password: text }))}
      error={errors.passwordError}
      
     />

  </View>  }    
          
     
  <Text onPress={pressForgotPassword}  className=" text-sm font-cabin font-semibold text-indigo-600 hover:text-indigo-500"> {isForgotPassword ? 'Return to login page':'Forgot password?'}</Text>
     
      <View className='top-5'>

       <Button text={isForgotPassword ? 'Submit' : 'Login'} variant='fit' onPress={()=>{isForgotPassword ? handleTemporaryPassword() : handleLogin()}}/>

     </View>      
    </View>
    </View>
    </Pressable>
  );
};

export default Login;



const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};