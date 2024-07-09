import React, { useEffect } from 'react';
import { cancel } from '../assets/icon';

const TravelMS = ({ visible, setVisible, src }) => {


  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [visible]);

  return (
    
    visible && (
      <div className='relative'>
      <div className='fixed  w-[100%] h-[100%] left-0 top-0 bg-black/30 z-10'>

       </div>
      <div className="fixed w-[100%] h-[100%] left-0 top-0 md:w-[80%] md:h-[80%] md:left-[10%] blur-0 md:top-[10%] px-6 sm:px-0 sm:rounded-lg shadow-lg z-[100] bg-white-100 ">
        <div onClick={()=>setVisible(false)} className='cursor-pointer absolute right-0 hover:bg-red-100 p-2 rounded-full mt-2 mr-4'>
        <img src={cancel} alt="" className='w-6 h-6' />
      </div>
      
        <iframe
          src={src}
          className="rounded-lg w-[100%] h-[100%] "
          title="Embedded Content"
        ></iframe>
       
      </div>
      </div>
    )
  );
};

export default TravelMS;


