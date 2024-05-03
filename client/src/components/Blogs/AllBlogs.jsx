import React from 'react'
import { arrow_icon, calender_icon } from '../../assets/icon'
import { blogsData } from '../../data/contentData'

const AllBlogs = () => {
  return (
    <div className=' lg:px-[160px] px-6  sm:py-20 py-8 bg-blue-50'>
<h1 className='sm:mb-12 mb-9 leading-normal sm:text-center text-start sm:pl-0 pl-4 font-extatica sm:leading-10  gradient-text font-semibold w-full h-full sm:text-[32px] text-[28px]'>Blogs</h1>
<div  className='p-4'>

<div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
  {blogsData?.map((item, index) => (
    <React.Fragment key={index}>
      <div className={index === 0 ? 'col-span-1 md:col-span-2 lg:col-span-3 bg-white flex md:flex-row flex-col-reverse    p-2 rounded-lg justify-center' : 'col-span-1 bg-white flex flex-col-reverse p-2 rounded-lg h-full'}>
        <div className='flex flex-col items-start justify-between w-auto'>
          <div className='px-4 py-2 flex flex-col gap-3 items-start'>
            <p className={`line-clamp-3 font-inter text-[24px] font-semibold text-neutral-600 leading-9`}>{item?.heading}</p>
            <div className='inline-flex gap-1 justify-center items-center'>
              <img src={calender_icon} alt='calender' className='w-[14px] h-[14px]' />
              <p className='text-[14px] font-normal leading-5 font-inter text-neutral-400'>{item?.date}</p>
            </div>
          </div>
          <a href='/blog-page'>
          <div className='inline-flex gap-1 px-4 py-4  justify-center items-center cursor-pointer'>
         
            <p className='text-[14px] font-semibold leading-5 font-inter text-blue-300'>Read More</p>
            <img src={arrow_icon} alt='arrow' className='w-4 h-4' />
         
          </div>
          </a>  
        </div>
        <div className={index === 0 ? 'p-2  min-w-[418px] grow shrink h-[232px]' : 'p-2 w-auto h-[232px]'}>
          <div className={index === 0 ? 'w-auto flex shrink flex-grow bg-slate-400 h-[100%] rounded' : 'flex bg-slate-400 h-[100%] rounded'}></div>
        </div>
      </div>
    </React.Fragment>
  ))}
</div>


</div>








    </div>
    
  )
}

export default AllBlogs