// // Toggle.js
// import React, { useEffect, useState } from 'react';

// const Toggle = ({ label, initialValue, onClick }) => {
//   const [checked, setChecked] = useState(initialValue);

//   useEffect(() => {
//     setChecked(initialValue);
//     console.log('initialValue',initialValue)
//   }, [initialValue]);

//   return (
//     <div className="flex items-center">
//       <label className="flex items-center cursor-pointer">
//         <div className="relative">
//           <input
//             type="checkbox"
//             className="hidden"
//             checked={checked}
//             onChange={() => {
//               setChecked(!checked);
//               if (onClick) {
//                 onClick(!checked);
//               }
//             }}
//           />
//           <div
//             className={`toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner ${
//               checked ? 'bg-green-500' : 'bg-gray-400'
//             }`}
//           ></div>
//           <div
//             className={`toggle__dot absolute top-[-4px] w-6 h-6 bg-white rounded-full bg-indigo-600 shadow inset-y-0 ${
//               checked ? 'left-4' : 'left-0'
//             }`}
//           ></div>
//         </div>
//         <div className="ml-2 text-gray-700">{label}</div>
//       </label>
//     </div>
//   );
// };

// export default Toggle;

import React, { useEffect, useState } from 'react';

const Toggle = ({ title, initialValue, onClick,checked,setChecked }) => {
  

  useEffect(() => {
    setChecked(initialValue);
    console.log('initialValue', initialValue);
  }, [initialValue]);

  const handleToggle = (flag) => {
    
    setChecked(flag);
    onClick(flag) 
  };

  return (
    <div className="w-full h-[73px] flex-col justify-start items-start gap-2 inline-flex mb-3">
      {/* title */}
      <div className="text-zinc-600 text-sm font-cabin">{title}</div>

      {/* Toggle Switch */}
      <div className="relative w-full h-full bg-white items-center flex">
        <div
          className="flex text-neutral-700 w-full h-full text-sm font-medium font-cabin "
          
        >
          {/* "Yes" button, active when checked */}
          <div
          onClick={()=>handleToggle(true)}
            className={`rounded-l-md w-16 h-full text-center border flex justify-center items-center font-inter font-medium cursor-pointer transition-colors ${
              checked
                ? 'bg-indigo-100 text-indigo-600 border-indigo-600'
                : 'bg-white text-neutral-700 border-slate-300  border-r-0'
            }`}
          >
            <p>Yes</p>
          </div>

          {/* "No" button, active when not checked */}
          <div
           onClick={()=>handleToggle(false)}
            className={`rounded-r-md w-16 h-full text-center border flex justify-center items-center font-inter font-medium cursor-pointer transition-colors ${
              !checked
                ? 'bg-indigo-100 text-indigo-600 border-indigo-600'
                : 'bg-white text-neutral-700 border-slate-300 border-l-0'
            }`}
          >
            <p>No</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toggle;