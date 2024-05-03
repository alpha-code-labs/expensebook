import React from 'react'
import { prfile1_icon } from '../../assets/icon'
import { userReviews } from '../../data/contentData'

const Block4 = () => {
  return (
    
    <div className='sm:pt-20 sm:pb-[120px] py-12 border sm:px-[120px] px-6 sm:space-y-[70px] space-y-[35px] '>
      
       <h2  className=' leading-normal text-center font-extatica sm:leading-[52px] pb-1  gradient-text font-semibold w-full h-auto sm:text-[40px] text-[28px]'>Our customers love us</h2>

       <div className='flex sm:flex-row flex-col sm:gap-10 gap-5'>

        {userReviews?.map((item, index)=>(
          <React.Fragment key={index}>
            
        <figure className={`sm:w-1/3 w-full p-6 border-[1px] ${item.style} rounded-xl`}>
        <blockquote className='mb-7'>
        <p className='text-start font-inter leading-6 text-neutral-400 font-normal w-auto text-[16px]'>
        ExpenseBook has truly streamlined our travel setup. No more emails and delays in booking. No mor unknown overruns in expense. Everything is trackable, and the configurability they offer is outstanding.
        </p>
        </blockquote>
        <figcaption className='flex gap-x-4'>
        <img src={prfile1_icon} alt='Profile ' className='w-12 h-12'/>
        <div>
          <h1 className='text-start font-inter leading-7 text-neutral-600 font-semibold w-auto text-[20px]'>
             Tim Cook
          </h1>
          <p className='text-start font-inter leading-4 text-neutral-400 font-normal w-auto text-[14px]'>CEO, Alpha Code Labs</p>
        </div>
        </figcaption>
         

          </figure>
          

          </React.Fragment>
        ))}
      
       </div>
      
    </div>
    
  )
}

export default Block4
