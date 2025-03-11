import React, { useState, useEffect, useRef } from 'react';


const ReportMS = ({ visible, setVisible, src }) => {

  const  iframeRef = useRef(null);


  
  return (

    (
     <>
   <iframe
    ref={iframeRef}
    src={src}
    className="w-[100%] max-h-screen h-full overflow-hidden"
    title="Embedded Content">
    </iframe>    
     </>
     
    )
  );
};

export default ReportMS;