import React,{useState} from 'react'
import { validateEmail } from '../utils/handyFunctions'
import { dot_icon } from '../assets/icon'
import Button from './Button'
import Input from './Input'
import Modal from './Modal'
import { signupUrl } from '../data/contentData'

const Form = () => {
    const [form , setForm]= useState({"name": "", "email":""});
    const [error, setError] = useState({ name: false, email: false });

    const [isOpenModal , setIsOpenModal]= useState(false)

    const handleOpenModal= ()=>{
      setIsOpenModal(!isOpenModal);
    }
    const handleSubmit = () => {
      const errors = {
        name: form.name.trim() === '',
        email: form.email.trim() === '' || !validateEmail(form.email),
      };
      
      setError({
        name: errors.name,
        email: errors.email,
      });
    
      if (!errors.name && !errors.email) {
        console.log(form);
        window.location.href = signupUrl;
      }
    };
    
 
  
  return (
    <div className='sm:pt-10 pt-8'>
      <div className='flex sm:flex-row flex-col justify-center items-center gap-4'>
        <div className='flex sm:flex-row flex-col gap-2  sm:w-auto  w-full '>
        <div className='sm:w-[200px] w-full'>
          <Input 
          placeholder={"Name"} 
          onChange={(value)=> setForm( {...form, "name": value} )}
          error={error.name}/>
          
        </div>
        <div className='sm:w-[352px] w-full'>
          <Input
          placeholder={'Official email ID'}
          onChange={(value) => setForm({ ...form, "email": value }) }
          error={error.email} />
        </div>
        </div>
        <div className='sm:w-fit w-full '>
          <Button label={'Start Trial'} onClick={handleSubmit}/>
        </div>

      </div>
      <div className='flex flex-row items-center justify-center gap-3 my-4'>
        <p className='font-inter leading-5 font-normal w-auto text-neutral-600  text-[16px]'>
        30 Days free trial
        </p>
        <img src={dot_icon} alt='dot' className='w-2 h-2'/>
        <p className='font-inter leading-5  font-normal w-auto text-neutral-600  text-[16px]'>Upto 10 users</p>

      </div>

      <Modal isOpen={isOpenModal} onClose={handleOpenModal}/>

     </div>
  )
}

export default Form
