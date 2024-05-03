import React from 'react'
import { arrow_icon, calender_icon, downArrow_icon } from '../../assets/icon'
import { blogPageData } from '../../data/contentData'

const BlogPage = () => {
  return (
    <div className='min-h-screen md:px-[120px] lg:px-[240px]  px-6 sm:pt-[32px] py-12 sm:pb-[80px] '>
        <div className='flex flex-col sm:gap-12 gap-4'>
         
        <a href='/blogs' className='inline-flex gap-3 justify-start  items-center'>
          <img src={downArrow_icon} alt='back icon' className='rotate-90 w-4 h-4' />
          <p className='font-inter text-neutral-600 text-[16px] font-normal leading-6'>Back</p>
        </a>
      
        <div className='flex flex-col sm:gap-9 gap-6'>
        <div className='flex flex-col gap-4'>
        <p className={`line-clamp-3 font-inter text-[24px] font-semibold text-neutral-600 leading-9`}>{blogPageData.heading}</p>
        <div className='inline-flex gap-1 justify-start items-center'>
              <img src={calender_icon} alt='calender' className='w-[14px] h-[14px]' />
              <p className='text-[14px] font-normal leading-5 font-inter text-neutral-400'>{blogPageData?.date}</p>
        </div> 
        </div>
        <div >
          <img src={blogPageData?.imgUrl} className='w-full h-[500px]'/>
        </div>
        <p className='text-neutral-400 font-inter inline-block leading-relaxed font-normal text-[18px] '>
          {blogPageData?.content}
        </p>
        </div>

           
        </div>
       

    </div>
  )
}

export default BlogPage