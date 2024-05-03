import React,{useRef, useEffect, useState} from 'react'
import { applicationUsers } from '../../data/contentData'
import Form from '../Form'

const Block1 = () => {
  
  

  return (
    <>
    <div className='px-6 sm:py-14 py-12'>
     <div className='  flex flex-col items-center justify-center'>
      <h2 className='text-center font-inter sm:leading-9 leading-4 gradient-text font-medium w-auto text-neutral-600   sm:text-[28px] text-[14px]'>
        The World’s Most Configurable
      </h2>
      <h1 className='text-center font-extatica sm:leading-[4.5rem] leading-8 font-semibold w-auto text-neutral-700   sm:text-[56px] text-[28px]'>
        Travel & Expense Management Software
      </h1>
      <p className='max-w-[878px] text-center font-inter  sm:leading-6 leading-4 font-normal w-auto  text-neutral-400  sm:text-[20px] text-[12px] sm:mt-9 mt-5 '>
      Configure <a href='/rules'> <span>any </span></a>rule. Enable a world class mobile experience for your users. Get seamless reporting & integrations. Inbuilt OCR expense scanning. Manage travel & non-travel expenses. Open APIs to connect with external systems.
      </p>
      
     </div>
     <Form/>
    </div>
    <div className='sm:border-[1px] border-0  border-slate-300 rounded-[14px] sm:mx-[120px] mx-0  '>
      <div className='w-auto max-w-full sm:px-16 px-0 pt-8 pb-10 flex flex-col justify-center gap-y-8'>
      <h1 className='text-center leading-5 font-normal w-auto text-neutral-400 tracking-[.25em] text-[16px]'>USED BY OVER 50 ENTERPRISES</h1>
        <div className="flex flex-row overflow-hidden  items-center justify-center w-full before:bg-gradient-to-r before:from-indigo-500 before:h-full before:w-4  "    >
        <div className="flex space-x-4 ">
        {/* <div className="flex space-x-4 animate-moveRightToLeft "> */}
        {applicationUsers.map((users, usersIndex)=>(
          <React.Fragment key={usersIndex}>
          <div className='w-[108px] h-[30px] animate-loop-scroll' >
          <img src={users?.img}  alt='users' className='w-[108px] h-[30px] '/>
          </div>
          </React.Fragment>
        ))}
        
       

       </div>
       
       </div>
      </div>

    </div>
    </>
  )
}

export default Block1
