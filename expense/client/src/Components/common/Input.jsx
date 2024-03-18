// // Input.js
// import React, { useState, useRef, useEffect } from "react";
// import { titleCase } from "../../utils/handyFunctions";

// const Input = ({ title, placeholder, onChange, error, initialValue, type }) => {
//   const inputRef = useRef(null);
//   const [inputValue, setInputValue] = useState("");

//   useEffect(() => {
//     if (initialValue !== undefined) {
//       setInputValue(initialValue);
//     }
//   }, [initialValue]);

//   const showError = error?.set && !inputValue.trim();

//   return (
//     <div className="min-w-[200px] w-full h-[73px] flex-col justify-start items-start gap-2 inline-flex mb-3">
//       <div className="text-zinc-600 text-sm font-cabin">{title}</div>
//       <div className="relative w-full h-full bg-white items-center flex">
//         <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin">
//           <input
//             ref={inputRef}
//             onChange={(e) => {
//               setInputValue(e.target.value);
//               onChange && onChange(e.target.value);
//             }}
//             type={type}
//             className="w-full h-full decoration:none px-6 py-2 rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 "
//             value={inputValue}
//             placeholder={placeholder}
//           />
//         </div>
//         {showError && (
//           <div className="absolute  top-[48px] w-full text-xs text-red-500 font-cabin">
//             {error.message}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Input;


import React, { useState, useRef } from "react";


const Input = ({ title, placeholder, onChange ,error,initialValue,type,inputRef}) => {

  const [inputValue, setInputValue] = useState("");
  const showError = error?.set && !inputValue.trim();

  return (
    <div className="min-w-[200px] w-full h-[73px] flex-col justify-start items-start gap-2 inline-flex mb-3">
      {/* title */}
      <div className="text-zinc-600 text-sm font-cabin">{title}</div>

      {/* input */}
      <div className="relative w-full h-full bg-white items-center flex">
        <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin">
          <input
            ref={inputRef}
            onChange={(e) => {
              setInputValue(e.target.value);
              onChange && onChange(e.target.value);
            }}
            type={type}
            className="w-full h-full placeholder:normal-case capitalize decoration:none px-6 py-2 rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 "
            value={initialValue || inputValue}
            placeholder={placeholder}
          />
        </div>
        {error?.set && (
        <div className="absolute  top-[48px] w-full text-xs text-red-500 font-cabin">
          {error?.msg}
        </div>
      )} 
      </div>
      
    </div>
  );
};

export default Input;



// import { useState, useRef, useEffect } from "react";
// import { titleCase } from "../../utils/handyFunctions";



// export default function Input(props){
//     const placeholder = props.placeholder || "Placeholder Text";
//     const value = props.value
//     const name = props.name
//     const id = props.id
//     const title = props.title ;
//     const onBlur = props.onBlur
//     const onChange = props.onChange
//     const inputRef = useRef(null)
//     const type= props.type
//     const [textInput, setTextInput] = useState(value || '')
//     const error = props.error 
//     // || {set:false, message:''}
//     const [inputEntered, setInputEntered] = useState(false)

//     const showErros= error?.set
//     const handleChange = (e)=>{
//         e.preventDefault()
//         setTextInput(e.target.value)
//         if(e.target.value == '')
//             setInputEntered(false)
//         else setInputEntered(true)
//         if(onChange??false){
//             onChange(e)
//         }
//     }

//     const handleBlur= (e)=>{
//         setTextInput(pre=>titleCase(pre))
//         if(onBlur??false){
//             onBlur(e)
//         }
//     }



    
//     return(<>
//         <div className="min-w-[200px] w-full md:w-fit max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
//             {/* title */}
//             <div className="text-zinc-600 text-sm font-cabin">{title}</div>
//             {/* input */}
//             <div className="relative w-full h-full bg-white items-center flex">
//                 <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin">
//                     <input
//                       id={id}
//                        type={type}
//                         name={name}
//                         ref={inputRef}
//                         onChange={handleChange} 
//                         onBlur={handleBlur}
//                         className="w-full h-full decoration:none px-6 py-2 appearance-none rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600" 
//                         value={textInput} 
//                         placeholder={placeholder}></input>
//                 </div>
//                 <div className="absolute text-xs text-red-600 left-0 px-6 top-[44px]">
//                     {showErros  && error.msg}                   
//                 </div>
//             </div>

//       </div>

//     </>)
// }