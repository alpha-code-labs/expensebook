import React from 'react';
import { addOnes, applicationUsers, trustedByData } from '../../data/contentData';
import { arrow_icon, check_icon, label_icon, rightArrow_icon, support1_icon } from '../../assets/icon'

const Block2 = () => {
  return (
    <div className='sm:px-[120px] px-6 sm:py-20 py-12 bg-blue-50/50'>
      <div className='flex flex-col sm:gap-5 gap-3 justify-center items-center'>
        
        <p className='text-center font-inter  sm:leading-6 leading-4 font-normal w-auto  text-neutral-400  sm:text-[20px] text-[16px]  '>You’re currently viewing the pricing for India edition</p>
        <h1 className='max-w-[604px] w-auto text-center font-inter  sm:leading-10 leading-6 font-semibold  text-neutral-600  sm:text-[28px] text-[18px] '>Looking to implement ExpenseBook across multiple countries? Get a <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-100  to-blue-200'>customized quote.</span></h1>
      </div>

      <div className='h-[2px] bg-slate-300 w-[100%] sm:my-[56px] my-[40px] '/>

      <div className='flex flex-col sm:gap-10 gap-8'>
          
              <h1 className=' w-auto text-center font-extatica  sm:leading-[45px] leading-9 font-semibold   sm:text-[36px] text-[28px] gradient-text'>Add-ons</h1>
        
          <div className='flex sm:flex-row flex-col justify-around sm:gap-16 gap-6 mx-auto'>
              {addOnes.map((item, index)=>(
                <React.Fragment key={index}>
                  <div className='border-[1px] border-slate-300 sm:w-1/2 w-full rounded-lg'>
                            <div className='py-8 px-9 flex gap-6 justify-between flex-col'>
                              <div className='flex flex-row gap-3'>
                                <div className='w-14 h-14 p-[6px] bg-blue-50 flex rounded-md items-center justify-center'>
                                <img src={item?.icon} alt='support' className='w-[28px] h-[28px]' />
                                </div>
                              
                                <div>
                                  <h2 className='w-full flex  text-start font-inter leading-8 font-semibold  text-neutral-600  text-[24px]'>
                                    {item?.title}
                                  </h2>
                                  <p className=' text-start font-inter leading-4 font-normal  text-neutral-400  text-[16px]'>
                                    {item?.shortDes}
                                  </p>
                                </div>

                              </div>

                              <div className='flex flex-col gap-3 justify-start items-start'>   
                              {item?.service?.map((subItem, index)=>(
                                <React.Fragment key={index}>
                                <div className='inline-flex justify-center items-center gap-1'> 
                                  <img src={check_icon} className='w-5 h-5'/>
                                  <p className='w-auto text-start font-inter leading-4 font-normal  text-neutral-400  text-[16px] '>{subItem}</p>             
                                </div>

                                </React.Fragment>
                              )) }      
                                
                                
                              </div>

                              <div className='border-[1px] border-slate-300' />

                              <div className=''>
                                <p className='w-auto  font-inter leading-4 font-normal  text-neutral-400  text-[18px]'>Start From <span className='w-auto text-start font-inter leading-5 font-semibold  text-neutral-600 text-[18px]'>{item?.cost}</span></p>
                                <div className='inline-flex gap-1 justify-center items-center my-2 cursor-pointer'>
                                  < p className='w-auto text-center font-inter leading-4 font-semibold  text-blue-300  text-[18px] '>{item?.linkTitle}</p>
                                  <img src={rightArrow_icon} className='w-6 h-6' />
                                </div>

                              </div>


                              </div>

                          </div>
                  </React.Fragment>
              ))}
          </div>
      
      </div> 

<div>
      <div className='mx-[96px] sm:mt-20 mt-14 mb-9 flex flex-row justify-center items-center gap-6'>
        <div className='bg-slate-300 h-[1px] w-full'/>
      
        <img src={label_icon} alt='label' className='w-[145px] h-[42px] relative'></img>
        <p className='absolute font-inter text-[18px] font-normal text-blue-300'>Trusted By</p>
       
        <div className='bg-slate-300 h-[1px] w-full'/>
      </div>

      <div className='flex flex-row overflow-hidden  items-center justify-center w-full'>
        <div className="flex space-x-4 animate-moveRightToLeft">
        {applicationUsers.map((users, usersIndex)=>(
          <React.Fragment key={usersIndex}>
          <div className='w-[108px] h-[30px] ' >
          <img src={users?.img}  alt='users' className='w-[108px] h-[30px] '/>
          </div>
          </React.Fragment>
        ))}
       

       </div>
       </div>
</div>      


      
    </div>
  )
}

export default Block2
