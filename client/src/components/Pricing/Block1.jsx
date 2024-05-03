import React, { useEffect, useState } from 'react'
import { arrow_icon, checkBox_icon, check_icon, toggleOff_icon, toggle_icon } from '../../assets/icon'
import { pricingData } from '../../data/contentData'


const isToggle = localStorage.getItem('isToggled') === "true" ? true : false;
const Block1 = () => {
  
  const [toggle, setToggle] = useState(isToggle);

  const handleToggle = () => {
    const newToggleValue = !toggle;
    setToggle(newToggleValue);
    localStorage.setItem("isToggled", JSON.stringify(newToggleValue));
  };
 

 
  return (
    <div className='sm:py-20 py-12 bg-blue-50 sm:px-[120px] px-6'>
     <div className='md:px-[143px] px-0 flex items-center flex-col gap-y-16'>
            <div className='space-y-9'>
              <h1 className='sm:mb-12 mb-9 leading-normal text-center font-extatica sm:leading-10  gradient-text font-semibold w-full h-full sm:text-[32px] text-[28px]'>Flexible plans for all businesses, be it a start-up, mid-size or enterprise</h1>
              <div className='flex sm:flex-row flex-col sm:gap-1 gap-4 justify-evenly items-start'>
              <div className='inline-flex justify-center text-center'>
                <img src={checkBox_icon} alt='checkbox' className='w-5 h-5'/> 
                <p className='text-center font-inter  sm:leading-5 leading-4 font-medium w-auto  text-neutral-600  sm:text-[16px] text-[12px] '>Free trial</p>

              </div>
              <div className='inline-flex justify-center text-center'>
                <img src={checkBox_icon} alt='checkbox' className='w-5 h-5'/>
                <p  className='text-center font-inter  sm:leading-5 leading-4 font-medium w-auto  text-neutral-600  sm:text-[16px] text-[12px] '>No hidden costs</p>

              </div>
              <div className='inline-flex justify-center text-center'>
                <img src={checkBox_icon} alt='checkbox' className='w-5 h-5'/>
                <p  className='text-center font-inter  sm:leading-5 leading-4 font-medium w-auto  text-neutral-600  sm:text-[16px] text-[12px] '>Globally scalable</p>

              </div>
              
            </div>
            </div>
            <div className='inline-flex justify-center items-center'> 
              <h2 className={`text-center  font-inter   sm:leading-6 leading-4   ${toggle ? 'text-blue-100  text-[18px]':'text-neutral-600  text-[18px] ' }  font-semibold sm:text-[18px] `}   >Monthly</h2>
              <img src={toggle ? toggle_icon : toggleOff_icon} alt='toggle' className='w-10 h-6 mx-2' onClick={handleToggle} />
              <h2 className={`text-center font-inter font-semibold    sm:leading-6 leading-4  ${!toggle ? 'text-blue-100  text-[18px]':'text-neutral-600  text-[18px] '} `}  > Yearly <span className='text-neutral-400 font-normal'>(Save upto 25%)</span></h2>
            </div>
           

     </div>
     <div className='flex xl:flex-row flex-col gap-4 justify-between items-center mt-9'>
      {pricingData?.map((item , index)=>(
        <React.Fragment key={index}>
          <div className={`border-[1px] relative rounded-lg w-[260px] ${item?.version == 'PREMIUM' ? 'h-[807px] border-[2px] rounded-lg border-violet-400/80 shadow-md shadow-violet-400/50 ' :' h-[767px]'} bg-white`}>
            {item?.version === 'PREMIUM' &&<div className='top-0 absolute inset-x-0 bg-violet-500/30 rounded-t-md h-11 flex justify-center items-center'>
              <p className='font-inter text-center text-[16px] font-semibold leading-5 text-violet-600'>Most Popular</p>

            </div>}
        <div className=' px-7 py-[72px] flex flex-col items-center justify-center gap-6 '>
          <p className='text-center text-[20px] font-inter font-normal leading-6 tracking-[.3em] text-neutral-400'>{item?.version}</p>
          <div>
          <div className='flex items-end'>
            <p className='block pb-2 text-[20px] font-inter font-normal leading-6 tracking-[.3em] text-neutral-400'>
              ₹
            </p>
            <span className='text-[48px] font-inter font-semibold leading-[62px]  text-neutral-600' >{ toggle ? item?.cost?.monthly :item?.cost?.yearly }</span>
          </div>
         <div>
         
          <p className='text-center text-[12px] font-inter font-normal leading-4 text-neutral-400'>Per user/month</p>
          <p className='text-center text-[12px] font-inter font-normal leading-4 text-neutral-400'>{toggle ? 'Billed monthly':'Billed annually'}</p>
         </div>
         </div>
         <div  className=''>
         <div className='border-[1px]  rounded bg-indigo-100 border-indigo-200 transition duration-300 hover:shadow-lg hover:shadow-indigo-200 cursor-pointer'>
  <p className='px-3  py-2 hover:text-[18px]   text-center text-[16px] font-inter font-semibold leading-4 text-blue-600'>
    Get Started
  </p>
</div>
<div className='w-auto h-4 mt-3'>
{item?.minimumUsers.length>0 && <p className='text-center text-[12px] font-inter font-normal leading-4 text-neutral-400'>Minimum Users: <span className='font-medium text-neutral-600'>{item?.minimumUsers}</span></p>}
</div>
</div>

    


         <div className='text-start  py-5 border-y-[1px] text-[12px] font-inter font-normal leading-4 text-neutral-400'>
         {item?.appropriateFor}
         </div>

         <div className=''>
          <p className='text-start   text-[12px] font-inter font-normal leading-4 text-neutral-400 pb-1'>{index !==0 && `Includes everything in`}</p>
          <h2 className='text-start   text-[16px] font-inter font-semibold leading-5 text-neutral-600'>
          {item?.features?.title}
          </h2>
          <div className='space-y-3 mt-4'>
            {item?.features?.points?.map((point, index)=>(<React.Fragment key={index}>
              <div className='inline-flex gap-1'>
              <img src={check_icon}  alt="Checkmark" className='w-4 h-4'/>
              <p className='text-start text-[12px] font-inter font-normal leading-4 text-neutral-400'>{point}</p>
            </div>
            </React.Fragment>))}
           
          </div>
         </div>

        </div>

      </div>
        </React.Fragment>
      ))}
      
     </div>
     
<div className='flex xl:flex-row flex-col-reverse justify-between items-center xl:mt-0 mt-6'>
  <div className='inline-flex cursor-pointer py-3'>
    <p className='underline underline-offset-4  text-blue-300 text-[16px] font-inter font-medium leading-5'> See the complete features comparison</p>
    <img src={arrow_icon} alt='arrow' className='w-5 h-5'/>  
  </div>
  <p className='font-inter text-[12px] italic font-normal leading-4 text-neutral-400'>*Prices are exclusive of GST</p>
</div>
     
    </div>
  )
}

export default Block1
