import React, { useState, useRef, useEffect } from 'react';

const NotificationBox = ({ buttonText, children ,disable=false}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = (event) => {
    event.stopPropagation(); // Prevent the event from bubbling up
    setIsOpen(prevState => !prevState);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  
  const handleBlur = () => {
    setIsOpen(false); 
  };
  
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('blur', handleBlur);
    } else {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('blur', handleBlur);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block">
    <div onClick={disable ? () => 'notification disabled' : handleToggle}>
      {buttonText}
    </div>
    { isOpen &&(
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-start justify-end pt-8"
        onClick={handleToggle} // Clicking outside the dropdown closes it
      >
        <div
          ref={dropdownRef}
          className="relative bg-white border-none border-slate-300 rounded-md shadow-lg p-2 pt-3 mt-4 h-full"
          onClick={(e) => e.stopPropagation()} // Prevents click from propagating to the overlay
        >
          <div className='absolute left-10 -top-1 w-3 rotate-45 h-3 bg-white'></div>
          {children}
        </div>
      </div>
    )}
  </div>
  );
};

export default NotificationBox;
// import React, { useState, useRef, useEffect } from 'react';

// const NotificationBox = ({ buttonText, children ,disable=false}) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const handleToggle = (event) => {
//     event.stopPropagation(); // Prevent the event from bubbling up
//     setIsOpen(prevState => !prevState);
//   };

//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setIsOpen(false);
//     }
//   };
  
//   const handleBlur = () => {
//     setIsOpen(false); 
//   };
  
//   useEffect(() => {
//     if (isOpen) {
//       document.addEventListener('click', handleClickOutside);
//       window.addEventListener('blur', handleBlur);
//     } else {
//       document.removeEventListener('click', handleClickOutside);
//       window.removeEventListener('blur', handleBlur);
//     }
//     return () => {
//       document.removeEventListener('click', handleClickOutside);
//       window.removeEventListener('blur', handleBlur);
//     };
//   }, [isOpen]);

//   return (
//     <div className="relative inline-block">
//       <div onClick={disable ? ()=>'notification disabled':handleToggle}>
//         {buttonText}
//       </div>
//       {isOpen && (
       
//         <div
//           ref={dropdownRef}
//           className="absolute right-0 top-8 mt-2 w-auto  h-fit bg-white border-none border-slate-300 rounded-md shadow-lg p-2"
//           style={{ zIndex: 1000 }}
//         >
//            {/* <div className='w-full h-full bg-black border border-red-200 inset-x-0'> */}
//           {children}
//         {/* </div> */}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBox;
