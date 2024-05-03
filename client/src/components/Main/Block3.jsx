import React from 'react'
import { branch_icon, hrms_icon } from '../../assets/icon'
import { integrantions } from '../../data/contentData'

const Block3 = () => {
  return (
    <div className='sm:pt-12 sm:pb-[100px] sm:py-0 py-12 sm:px-[120px] px-6 flex items-center justify-center flex-col sm:gap-0 gap-6 bg-blue-50'>
       <h2  className=' leading-normal text-center font-extatica sm:leading-10 pb-1  gradient-text font-semibold w-full h-auto sm:text-[40px] text-[28px]'>Integrations</h2>
       <div className='lg:h-32 w-auto  h-auto sr-only sm:not-sr-only' ><img src={branch_icon}  alt="Branch" className=' z-10 w-auto  '/></div>
       
<div className='flex sm:flex-row flex-col gap-8 z-20'>

{integrantions.map((item , index)=>(
  <React.Fragment key={index}>
  <div className={`flex flex-col gap-y-5 sm:w-1/3 w-full border-[1px] bg-gradient-to-r ${item?.style?.box} p-5 rounded-2xl`}>
  <div className='inline-flex gap-x-2'>
    <div className={`w-8 h-8 ${item?.style?.iconBg} flex justify-center items-center rounded`}>
      <img src={item?.icon}  alt="HRMS" className='w-5 h-5'/>

    </div>
    <h1 className='text-start font-inter leading-7 text-neutral-700 font-semibold w-auto text-[20px]'>{item?.title}</h1>

  </div>
 <div>
  <p className='text-start font-inter leading-6 text-neutral-400 font-normal w-auto text-[16px]'>
  {item?.content1}
  </p>
  <p className='text-start font-inter leading-6 text-neutral-400 font-normal w-auto text-[16px] mt-3'> {item?.content2}</p>
  </div>
 </div>
 </React.Fragment>
))}
       
</div>

    </div>
  )
}

export default Block3
