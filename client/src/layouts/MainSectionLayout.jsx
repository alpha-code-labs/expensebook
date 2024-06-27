// Layout.js
import React from 'react';

const MainSectionLayout = ({ children }) => {
  
  

  return (
    <div className="mt-[63px] ml-[100px] md:px-[10px] lg:px-[100px] md:w-[calc(100%-230px)] w-[calc(100%-100px)]  tracking-tight ">
        {children}
    </div>
  );
};

export default MainSectionLayout;
