import { useState, useRef, useEffect } from "react";
import {chevron_down} from "../../assets/icon";
import {titleCase} from '../../utils/handyFunctions'

export default function Dropdown(props) {
  const placeholder = props.placeholder || "Placeholder Text";
  const title = props.title || "Title";
  const [hidePlaceholder, setHidePlaceholder] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const selectDivRef = useRef(null)
  const optionsList = props.options;
  const onSelect = props.onSelect || null
  const currentOption = props.currentOption || null
  const [selectedOption, setSelectedOption] = useState(currentOption)
  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(-1)
  const violationMessage = props.violationMessage || null
  const error = props.error || null
  const required = props.required || false
  const submitAttempted = props.submitAttempted || false


    useEffect(()=>{
      if(currentOption != null && currentOption != undefined && currentOption != '' ){
        setHidePlaceholder(true)
      }
      else{setHidePlaceholder(false)}
      setSelectedOption(currentOption)
    },[currentOption])

    //refs for filtered options
    const dropdownOptionsRef = useRef([]);

    useEffect(()=>{
        setKeyboardFocusIndex(-1)
    },[optionsList, showDropdown])
 

  const handleSelectClick = () => {
    selectDivRef.current.focus()
    setShowDropdown((prev) => (prev ? false : true));
  };

  //changes focused element on arrow key down/up press
  useEffect(()=>{
    if( keyboardFocusIndex!=-1 && dropdownOptionsRef.current[keyboardFocusIndex]){
        dropdownOptionsRef.current[keyboardFocusIndex].focus()
    }
},[keyboardFocusIndex])

//iterating through options using keyboard
const handleDropdownKeyDown = (e)=>{
    if(e.keyCode == 40 || e.keyCode == 38){
        e.preventDefault()
    }
            
    if(e.keyCode == 38){
        if(keyboardFocusIndex==-1){
            setKeyboardFocusIndex(0)
        }
        else{
            setKeyboardFocusIndex(pre=> (pre-1 > -1)? pre-1 : optionsList.length-1)
        }
    }

    if(e.keyCode == 40 ){
        if(keyboardFocusIndex==-1){
            setKeyboardFocusIndex(0)
        }
        else{
            setKeyboardFocusIndex(pre=> (pre+1 < optionsList.length)? pre+1 : 0)
        }
      
    }

    if(e.keyCode == 13){
        console.log(keyboardFocusIndex)
        console.log(dropdownOptionsRef.current[keyboardFocusIndex])
       handleOptionSelect(dropdownOptionsRef.current[keyboardFocusIndex].innerHTML)
    }
    

    //tab or escape pressed.. close dropdown
    if(e.keyCode == 9 || e.keyCode == 27) {
          setShowDropdown(false)
    }
}

const selectKeyDown = (e)=>{

    if(e.keyCode == 40 || e.keyCode == 38){
        e.preventDefault()
    }

    if(e.keyCode == 40){
     if(dropdownOptionsRef.current[0]){
       // dropdownOptionsRef.current[0].focus()
        setKeyboardFocusIndex(0)
     }
    }

    //tab or escape pressed.. close dropdown
    if(e.keyCode == 9 || e.keyCode == 27) {
      setShowDropdown(false)
    }

}

const selectDivFocus = (e)=>{
  console.log('select div focused')
}

  //handles selection of option
  const handleOptionSelect = (option, index=0)=>{
    setSelectedOption(option)
    if(option != placeholder){
        setHidePlaceholder(true)
    }

    if(onSelect != null){
        onSelect(option)
    }

    console.log(option)
    setShowDropdown(false)
  }


  //close dropdown on outside click
  useEffect(() => {
    let flag = false;
    const handleClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (flag) setShowDropdown(false);
        flag = true;
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showDropdown]);


  return (
    <>
      <div className=" w-full  h-[73px] flex-col justify-start items-start gap-2 inline-flex">
        {/* title*/}
        <div className="text-zinc-600 text-sm font-cabin">{title}</div>
        <div className="self-stretch h-12 justify-start items-start gap-4 inline-flex">
          <div className={`grow relative shrink basis-0 self-stretch px-6 py-2 bg-white-100 rounded-md border border-neutral-300 justify-between items-center flex`} >
            <div
              tabIndex={0}
              onKeyDown={selectKeyDown}
              onFocus={selectDivFocus}
              ref={selectDivRef}
              className="grow shrink basis-0 h-6 relative justify-between items-center flex cursor-pointer focus-visible:outline-0"
              onClick={handleSelectClick}
            >
              {!hidePlaceholder && (
                <div className="text-zinc-400 text-sm font-normal font-cabin">
                  {placeholder}
                </div>
              )}
              {hidePlaceholder && <div className='text-neutral-700 text-sm font-normal font-cabin'>{selectedOption}</div>}
              <div className={`w-6 h-6 relative transition ${showDropdown && 'rotate-180'}`}>
                <img src={chevron_down} />
              </div>

              
            {!showDropdown && hidePlaceholder && violationMessage && <div className="absolute top-[35px] w-full text-xs text-yellow-600 font-cabin">
              {violationMessage}
            </div>}
            
            {!showDropdown && !hidePlaceholder && error?.set && <div className="absolute top-[38px] left-0 w-full text-xs text-red-600 font-cabin">
              {error?.message}
            </div>}


            </div>

            {/* options */}
            {showDropdown && (
              <div
                key='dropdown'
                ref={dropdownRef}
                className="absolute z-10 w-[calc(100%-10px)] h-fit max-h-[160px] overflow-y-scroll scroll rounded-b left-[5px] top-11 bg-white transition-all border-b  border-l border-r border-neutral-300 shadow-sm"
              >
                {optionsList &&
                  optionsList.map((option, index) => (
                    <div key={index}>
                      <p
                        tabIndex={index+1}
                        onKeyDown={handleDropdownKeyDown}
                        ref={el => dropdownOptionsRef.current[index] = el} 
                        onClick={()=>{ handleOptionSelect(option, index) }}
                        className="text-xs focus-visible:outline-0 focus-visible:bg-gray-100 font-medium font-cabin text-neutral-700 px-4 py-3 cursor-pointer transition-color hover:bg-gray-100"
                      >
                        {titleCase(option)}
                      </p>
                      {index != optionsList.length - 1 && <hr key={`${option}-${index}`} />}
                    </div>
                  ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </>
  );
}


// import React, { useState } from 'react';
// import { titleCase } from '../utils/handyFunctions';




// const Dropdown = (props) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(null);

//   const icon = props.icon;
//   const label = props.label;
//   const options = props.options;
//   const htmlFor = props.htmlFor;
//   const id = props.id;
//   const name = props.name;
//   const onChange = props.onChange; 
 

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const selectOption = (value) => {
//     setSelectedOption(value);
//     setIsOpen(false);
//     if (onChange) {
//       onChange(value);
//     }
//   };

//   return (
//     <>
//       <label htmlFor={htmlFor} className=" flex justify-start font-medium text-gray-400 font-cabin text-start  leading-normal text-[14px]">
//         {label}
//       </label>
//       <div className="flex w-full h-full mt-[6px]">
//         <button
//           onClick={toggleDropdown}
//           type="button"
//           className="flex justify-between items-center w-full rounded-md border-[1px] border-solid border-gray-600 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:border-purple-500 focus:border-purple-500"
//           id="options-menu"
//           aria-haspopup="listbox"
//           aria-expanded="true"
//         >
//           <div className='truncate'>
//           {selectedOption || options[0]}
//           </div>
//           <img src={icon} className="ml-2" alt="Dropdown Icon" />
//         </button>
//       </div>

//       {isOpen && (
//         <div className="relative z-50 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
//           <div
//             className="py-1 h-36 overflow-auto"
//             role="menu"
//             aria-orientation="vertical"
//             aria-labelledby="options-menu"
//             id={id}
//             name={name}
//           >
//             {options.map((value, index) => (
//               <div
//                 key={index}
//                 onClick={() => selectOption(value)}
//                 className="px-4 py-2  text-sm text-gray-700 hover:bg-indigo-500 hover:text-white cursor-pointer bg-white"
//                 role="menuitem"
//               >
//                 {titleCase(value)}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
      
//     </>
//   );
// };

// export default Dropdown;

