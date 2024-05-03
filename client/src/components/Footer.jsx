import React from 'react'
import { contact_icon, instagram_icon, linkedIn_icon, location_icon, logo_icon, youtube_icon } from '../assets/icon'
import { navbarElement } from '../data/contentData'

const Footer = () => {
    const contacts = {
        email: "contact@michael-davies.com",
        phone: {
            nama: 'Address' , icon : location_icon
        },
        contact: {
            name: '+91 8888888888' , icon: contact_icon
        }
    }

    const socialMediaLink= [
        {icon:linkedIn_icon , url: '/instagram'},
        {icon:youtube_icon , url: '/instagram'},
        {icon:instagram_icon , url: '/instagram'}
]

    

  return (
   
        <div className='sm:px-[120px] px-4 pt-12 pb-[100px] border  '>
           <div className='flex sm:flex-row flex-col mb-[96px] sm:gap-0 gap-8'>
           
            <div className='flex-1'>
            <a href='/' className='px-2 py-3'><img src={logo_icon} alt='logo' width={140} height={40}/></a>

            </div>
            <div className='flex-1 '>
                <div className='flex flex-col gap-4 justify-center items-start mb-10'>
                   
                    <div className='inline-flex text-start justify-center'>
                        <img src={location_icon} alt='location' className='w-6 h-6 mr-2'/>
                        <p className='font-inter leading-5 font-normal w-auto active:text-neutral-600 text-neutral-600  text-[14px] pt-1'>Sec-44 , Rider House Gurgaon , Haryana</p>
                    </div>
                    <div className='inline-flex'>
                        <img src={contact_icon} alt='location' className='w-6 h-6 mr-2'/>
                        <p className='font-inter leading-5 font-normal w-auto active:text-neutral-600 text-neutral-600  text-[14px]'>+91  8888888888</p>
                    </div>

                </div>
                <div className='inline-flex gap-x-3 pl-[6px]'>
                    <h2 className='font-inter leading-5 font-normal w-auto active:text-neutral-600 text-neutral-400  text-[14px]'>
                        Social Media 
                    </h2>
                    <div className='flex flex-row gap-x-6'>
                        {socialMediaLink.map((item, index)=>(
                            <React.Fragment key={index}><a  href={item.url} className='w-6 h-6'><img src={item.icon} alt='logo' width={140} height={40}/></a></React.Fragment>
                        ))}
                    
                    </div>

                </div>

            </div>
            </div> 

            <div className='flex  sm:flex-row flex-col gap-[28px] sm:gap-0'>
                <div className='flex-1 inline-flex justify-between'>
                    {navbarElement.map((item, index)=>(
                        <React.Fragment key={index}>
                        <a href={item.url} ><h2 className='font-inter leading-5 font-normal w-auto hover:text-neutral-600 text-neutral-400  text-[14px]'>{item.name}</h2></a>
                        </React.Fragment>
                    ))}

                </div>
                <div className='flex-1 sm:text-right text-left font-assistant leading-5 font-normal w-auto hover:text-neutral-600 text-neutral-400  text-[14px]'>
                Copyright © 2024 • ExpenseBook
                </div>
            </div>  
        </div>
  )
}

export default Footer
