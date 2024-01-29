// Toggle.js
import React, { useEffect, useState } from 'react';

const Toggle = ({ label, initialValue, onClick }) => {
  const [checked, setChecked] = useState(initialValue);

  useEffect(() => {
    setChecked(initialValue);
    console.log('initialValue',initialValue)
  }, [initialValue]);

  return (
    <div className="flex items-center">
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className="hidden"
            checked={checked}
            onChange={() => {
              setChecked(!checked);
              if (onClick) {
                onClick(!checked);
              }
            }}
          />
          <div
            className={`toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner ${
              checked ? 'bg-green-500' : 'bg-gray-400'
            }`}
          ></div>
          <div
            className={`toggle__dot absolute top-[-4px] w-6 h-6 bg-white rounded-full bg-indigo-600 shadow inset-y-0 ${
              checked ? 'left-4' : 'left-0'
            }`}
          ></div>
        </div>
        <div className="ml-2 text-gray-700">{label}</div>
      </label>
    </div>
  );
};

export default Toggle;


// // Toggle.js
// import React, { useEffect } from 'react';

// const Toggle = ({ label, checked, onClick ,initialValue }) => {

  
//   return (
//     <div className="flex items-center">
//       <label className="flex items-center cursor-pointer">
//         <div className="relative">
//           <input
//             type="checkbox"
//             className="hidden"
//             checked={checked}
//             onChange={onClick}
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
