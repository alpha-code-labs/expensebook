import { useState, useEffect, useRef } from 'react';
import chevronDownIcon from '../assets/chevron-down.svg'
import leftFrame from '../assets/leftFrame.svg'
import Icon from '../components/common/Icon';
import { verify_shield } from '../assets/icon';
import Search from '../components/common/Search';
import Error from '../components/common/Error';
import PopupMessage from '../components/common/PopupMessage'
import { useCookies } from 'react-cookie';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useNavigate } from 'react-router-dom';


import { getCompanyList_API, postLogin_API} from '../utils/api';
import { urlRedirection } from '../utils/handyFunctions';

//inputs: company name, full name of user, mobile number, company HQ, email Id, password and confirm Password

export default function CompanyAndHRInformation(props){
  const setPopupMsgData = props.setPopupMsgData
  const popupMsgData = props.popupMsgData
  const initialPopupData = props.initialPopupData


  const navigate= useNavigate()
  const [companyList, setCompanyList] = useState([])
  const [businessCategoriesList, setBusinessCategoriesList] = useState(['Mining', 'Construction', 'Manufacturing', 'Transportation', 'Information', 'Finance and Insurance', 'Real State and Rental Leasing', 'Accomodation and Food', 'Educational', 'Health Care', 'Others'])
  const [locationsList, setLocationsList] = useState(['YourCompany', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata'])
  const [formData, setFormData] = useState({companyName:'',  email:'', password:'', confirmPassword:''})
  const [isLoading,setIsLoading]=useState(false)
  const [loadingErrorMsg, setLoadingErrorMsg]=useState(false)
  const [openModal,setOpenModal]=useState(false);
  const [showPopup ,setShowPopup]=useState(false);
  const [message,setMessage]=useState(null)  ///this is for modal message
 
  const [errors, setErrors] = useState({companyNameError:{set:false, message:null},  emailError:{set:false, message:null}, passwordError:{set:false, message:null}, confirmPasswordError:{set:false, message:null}})

  const [prompt, setPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false)
  const [cookies] = useCookies(['authToken']);
  const [tenantId, setTenantId] = useState(null);
  const [empId, setEmpId] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await getCompanyList_API();

        if (error) {
          // setLoadingErrorMsg(error.message);
          setPopupMsgData({showPopup:true, message:error?.message, iconCode: '102'})
        } else {
          setCompanyList(data);
        }
      } catch (error) {
        setPopupMsgData({showPopup:true, message:error?.message, iconCode: '102'})
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

    const data = new FormData();

    
    //validate form
   (function async(){
    return new Promise((resolve, reject)=>{
      if(formData.companyName == '' || formData.companyName == undefined){
        setErrors(pre=>({...pre, companyNameError:{set:true, message:'Company name is required.'}}))
        allowSubmit=false
      }else{setErrors(pre=>({...pre, companyNameError:{set:false, message:''}}))}

     

      if(formData.email == ''){
        setErrors(pre=>({...pre, emailError:{set:true, message:'Email is required.'}}))
        allowSubmit=false
      }
      else if(!validateEmail(formData.email)){
        setErrors(pre=>({...pre, emailError:{set:true, message:'Please enter valid email id'}}))
        allowSubmit=false
      }else{setErrors(pre=>({...pre, emailError:{set:false, message:''}}))}


      if(formData.password == ''){
        setErrors(pre=>({...pre, passwordError:{set:true, message:'Password is required.'}}))
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

   
      resolve()
    })
  })().then(async()=>{
   
    if(allowSubmit){
        console.log('data',formData)
  
        try{
          setIsLoading(true)
          const {error,data} = await postLogin_API(formData)
          document.cookie = `authToken=${data.data}; path=/;`;
          // Redirect to the dashboard page with the authToken as a query parameter
         urlRedirection( `http://localhost:5100/dashboard?authToken=${data.data}`);

          if (error) {
            setLoadingErrorMsg(error.message);
          }
          // navigate('/dashboard')
        }catch(error){
          setLoadingErrorMsg(error.message)
          setTimeout(()=>{
            // setShowPopup(false)
          },3000)
          
        }finally{
          setIsLoading(false)
        }
    }
  })

  };
 
  return (
    <>
     {/* {isLoading && <Error/>} */}
        {loadingErrorMsg && <h2>{loadingErrorMsg}</h2>}
    <div className='fixed bg-white py-4 px-4 w-full  top-0'>
        <Icon/>
    </div>

    <div className='mx-auto w-fit'>
    
    {/* <div className='fixed sr-only lg:not-sr-only left-0 top-0 h-[100vh] w-[40vw] flex flex-col justify-center items-center [background:linear-gradient(187.95deg,_rgba(76,_54,_241,_0),_rgba(76,_54,_241,_0.03)_9.19%,_rgba(76,_54,_241,_0.06)_17.67%,_rgba(76,_54,_241,_0.1)_25.54%,_rgba(76,_54,_241,_0.14)_32.86%,_rgba(76,_54,_241,_0.19)_39.72%,_rgba(76,_54,_241,_0.25)_46.19%,_rgba(76,_54,_241,_0.31)_52.36%,_rgba(76,_54,_241,_0.38)_58.3%,_rgba(76,_54,_241,_0.46)_64.08%,_rgba(76,_54,_241,_0.53)_69.79%,_rgba(76,_54,_241,_0.62)_75.51%,_rgba(76,_54,_241,_0.71)_81.31%,_rgba(76,_54,_241,_0.8)_87.28%,_rgba(76,_54,_241,_0.9)_93.48%,_#4c36f1)]'>
      <img src={leftFrame} className='w-fit' />
    </div> */}
    
    <div className='mx-auto mt-10 w-full p-4 overflow-x-hidden flex  items-center'>
      <div className="md:p-0 lg:pt-10 flex flex-col items-start justify-start gap-[24px]">
        
        <div className="flex flex-col items-start justify-start gap-[24px] w-full">
          <div className="flex flex-col items-start justify-start gap-[8px]">
            <div className="text-neutral-800 text-xl tracking-tight font-semibold font-cabin">
              Login In !
            </div>
          </div>
        </div>

          <form className='border-neutral-400 p-4 rounded-lg border'>
            <div className="flex w-full flex-col items-start justify-start gap-[24px] text-sm">

            <div className='flex gap-2 w-full'>
                    <Search
                    title='Company Name' 
                    placeholder='company name'
                    options={locationsList}
                    onSelect={handleSelect}
                    error={errors.companyNameError}
                    />

               
            </div>

            <div className='flex gap-2  w-full'>
              

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
            <div className="text-sm font-cabin">
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
          </div>
            </div>

            <div className='mt-10 mb-10 w-full max-w-[403px] flex items-center flex-row-reverse'>
                <Button text='Login In' onClick={()=>(handleLogin()) } />
            </div>

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
          
          <div className="mt-6 w-full text-white text-base border-none py-3 rounded-md " disabled>
          <Button variant='full' text="Submit"/>
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

  </>
  );

};


const validateEmail = (email) => {
    return String(email)
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