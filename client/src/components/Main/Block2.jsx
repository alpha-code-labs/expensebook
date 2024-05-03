import React from 'react'
import { features1 } from '../../assets/icon'
import { features } from '../../data/contentData'

const Block2 = () => {
  return (
    
       
       <div className='py-20 sm:px-20 px-6  '>
<h2  className='sm:mb-12 mb-9 leading-normal text-center font-extatica sm:leading-10  gradient-text font-semibold w-full h-full sm:text-[32px] text-[28px]'>Features that suit your needs</h2>

<div className='flex flex-wrap gap-y-12'>
  {features.map((content, index) => (
    <React.Fragment key={index}>
      <div className='w-full sm:w-1/2 md:w-1/3 flex-col gap-4 justify-start items-start px-3'>
        <div className='inline-flex justify-center items-center gap-x-3 mb-4'>
          <div className='w-8 h-8 bg-blue-500/30  flex justify-center items-center rounded-[2px] rotate-45'>
            <div className='w-8 h-8 -rotate-45 bg-blue-600 flex justify-center items-center rounded-[2px]'>
              <img src={content.icon} className={content.style} alt='Feature Icon' />
            </div>
          </div>
          <h1 className='text-start font-inter leading-6 text-neutral-700 font-semibold w-auto text-[18px]'>
           {content.title}
          </h1>
        </div>
        <p className='text-start font-inter leading-6 text-neutral-400 font-normal w-auto text-[16px]'>
          {content.content}
        </p>
      </div>
    </React.Fragment>
  ))}
</div>

       </div>
      
   
  )
}

export default Block2
