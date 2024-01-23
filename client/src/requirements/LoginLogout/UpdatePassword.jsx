import React, { useState } from 'react';
import { View, TextInput, Pressable, Text,Image } from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { app_bg } from '../../../assets/icon';
import Search from '../../components/common/Search';



const UpdatePassword = () => {
    const [formData, setFormData] = useState({email:'',password:'', confirmPassword:''})
    const [errors, setErrors] = useState({  emailError:{set:false, message:null}, passwordError:{set:false, message:null}, confirmPasswordError:{set:false, message:null}})
 


  const pressUpdatePassword = () => {
    console.log(formData)
    // Implement your login logic here
    console.log('Logging in with:');
    if (formData.password === '') {
        setErrors((pre) => ({
          ...pre,
          passwordError: { set: true, message: 'Please enter a password' },
        }));
        allowSubmit = false;
      } else {
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
     
      const data = formData
  };



  return (
    <View className='flex-1 justify-center items-center relative'>
       <Image
        source={app_bg} 
        className='w-[380px] h-[800px] bg-cover opacity-50 absolute'
        
      />
      <View className="p-6 flex justify-center items-center">
      <Text className="text-neutral-800 text-xl tracking-tight font-semibold font-cabin"> Update Password !</Text>
      <Text   className=" text-sm font-cabin font-semibold text-indigo-600 hover:text-indigo-500"> Please enter your new password!</Text>
      </View>
    <View className=' flex flex-col gap-16 '> 
    
     <View className='h-10 w-[300px]'>
     <Input
      title="New password" 
      placeholder="password"
      type='password'
      
      value={formData.password}
      onChangeText={(text) => setFormData((prev) => ({ ...prev, password: text }))}
      error={errors.passwordError}
     />

     </View> 

     <View className='h-10 w-[300px]'>
     <Input
      title="Confirm new Password" 
      placeholder="confirm"
      type='password'
      value={formData.confirmPassword}
      onChangeText={(text) => setFormData((prev) => ({ ...prev, confirmPassword: text }))}
      error={errors.confirmPasswordError}
     />

      </View> 
   
     
      <View className='top-10'>

       <Button text= 'Update Password'  variant='fit' onPress={pressUpdatePassword}/>

     </View>      
    </View>
    </View>
  );
};

export default UpdatePassword;