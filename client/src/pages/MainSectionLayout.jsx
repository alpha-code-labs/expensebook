// Layout.js
import React from 'react';

const MainSectionLayout = ({ children }) => {
  
  return (
    <div className="mt-[63px] ml-[230px] md:px-[10px] lg:px-[100px] w-[calc(100%-230px)] min-h-[calc(100vh-107px)]  tracking-tight">
        {children}
    </div>
  );
};

export default MainSectionLayout;
