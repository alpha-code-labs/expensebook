import React, { useState,useRef, useEffect } from 'react'
import {logo_icon, menu_icon, x_icon} from '../assets/icon'
import Button from './Button'
import { navbarElement, signupUrl } from '../data/contentData'


const Navbar = () => {
    const [open , setOpen]=useState(false)
    const menuRef = useRef()
    

    useEffect(()=>{
        let handler =(e)=>{
            if(!menuRef.current.contains(e.target)){
                setOpen(false)
            }
          
        }
        document.addEventListener("mousedown",handler)
    })


    const handleMenu = ()=>{
        setOpen(prev=>!prev)
    }

    
  return (
    <div className='border-b-[1px] border-slate-300 bg-blue-50'>
        <div className='lg:px-[120px] px-4 py-3 flex flex-row justify-between' ref={menuRef}>
           
            <a href='/' className='px-2 py-3'><img src={logo_icon} alt='logo' width={140} height={40} className='w-[166px] '/></a>
           
        <div  className={`static max-lg:absolute  flex max-lg:flex-col flex-row max-lg:top-16  max-lg:shadow-lg rounded-b-md max-lg:right-0 max-lg:w-full    gap-x-2 ${open ? 'max-lg:block':' max-lg:hidden'}` }  >
           <div className='flex max-lg:flex-col flex-row max-lg:gap-y-2 bg-blue-50'>
            {
                navbarElement?.map((element, index)=>(
                    <React.Fragment key={index}>
                       
                    <p className='font-inter leading-5 font-normal w-fit px-5 py-3  text-neutral-400 text-[16px]'>
                    <a href={element.url} className='active:text-neutral-600 hover:text-neutral-600 hover:font-semibold font-normal'> {element.name}</a>
                    </p>
                   
                    </React.Fragment>
                    
                ))
            }
            </div>
            <div className='max-lg:w-full max-lg:px-4 max-lg:py-4 bg-blue-50 '>
                <div className='w-fit'>
                <Button   label={'Start Trial'} onClick={()=>{location.href = signupUrl}}/>
                </div> 
            </div>

        </div>
        <div className=' hidden max-lg:block w-11 h-11 px-2 py-2 items-center justify-center '  onClick={handleMenu}>
        
            <img 
            src={open ? x_icon : menu_icon}
            alt='menu'
            width={25}
            height={25}
            />
            </div>
        </div>
      
    </div>
  )
}

export default Navbar


// import React, { useState } from 'react'
// import {logo_icon, menu_icon} from '../assets/icon'
// import Button from './Button'
// import { navbarElement } from '../data/contentData'

// const Navbar = () => {
//     const [open , setOpen]=useState(false)

//     const handleMenu = ()=>{
//         setOpen(prevOpen => !prevOpen)

//     }


   
//   return (
//     <div className='border-b-[1px] border-slate-300'>
//         <div className='sm:px-[120px] px-4 py-3 flex flex-row justify-between'>
           
//             <a href='/' className='px-2 py-3'><img src={logo_icon} alt='logo' width={140} height={40} className='w-[166px] '/></a>
           
//         <div className='absolue max-lg:static  flex max-lg:flex-row fle gap-x-2 max-lg:hidden'>
//            <div className='flex flex-row '>
//             {
//                 navbarElement?.map((element, index)=>(
//                     <React.Fragment key={index}>
//                     <p className='font-inter leading-5 font-normal w-auto px-5 py-3 active:text-neutral-600 hover:text-neutral-600 text-neutral-400 text-[16px]'>
//                         {element.name}
//                     </p>
//                     </React.Fragment>
                    
//                 ))
//             }
//             </div>
//             <div className='right-0'>
//                 <Button label={'Start Trial'}/>
//             </div>

//         </div>
//         <div className=' hidden max-lg:block w-11 h-11 px-2 py-2 items-center justify-center '  onClick={handleMenu}>
        
//             <img 
//             src={menu_icon}
//             alt='menu'
//             width={25}
//             height={25}
//             />
//             </div>
//         </div>
      
//     </div>
//   )
// }

// export default Navbar
