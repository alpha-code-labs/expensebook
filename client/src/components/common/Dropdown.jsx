// import { useState, useRef, useEffect } from "react";
// //dependencies...
// import {down_arrow} from "../../assets/icons"; // will provide it seperately


// const Dropdown =(props) =>{
//   const placeholder = props.placeholder || "Placeholder Text";
//   const title = props.title || "Title";
//   const [hidePlaceholder, setHidePlaceholder] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef(null);
//   const selectDivRef = useRef(null)
//   const optionsList = props.options;
//   const onSelect = props.onSelect || null
//   const currentOption = props.currentOption || null
//   const handleAddButtonClick = props.handleAddButtonClick 
  
  
//   const [selectedOption, setSelectedOption] = useState(currentOption)
//   const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(-1)

//     //refs for filtered options
//     const dropdownOptionsRef = useRef([]);

//     useEffect(()=>{
//         setKeyboardFocusIndex(-1)
//     },[optionsList, showDropdown])
 

//   const handleSelectClick = () => {
//     selectDivRef.current.focus()
//     setShowDropdown((prev) => (prev ? false : true));
//   };

//   //changes focused element on arrow key down/up press
//   useEffect(()=>{
//     if( keyboardFocusIndex!=-1 && dropdownOptionsRef.current[keyboardFocusIndex]){
//         dropdownOptionsRef.current[keyboardFocusIndex].focus()
//     }
// },[keyboardFocusIndex])

// //iterating through options using keyboard
// const handleDropdownKeyDown = (e)=>{
//     if(e.keyCode == 40 || e.keyCode == 38){
//         e.preventDefault()
//     }
            
//     if(e.keyCode == 38){
//         if(keyboardFocusIndex==-1){
//             setKeyboardFocusIndex(0)
//         }
//         else{
//             setKeyboardFocusIndex(pre=> (pre-1 > -1)? pre-1 : optionsList.length-1)
//         }
//     }

//     if(e.keyCode == 40 ){
//         if(keyboardFocusIndex==-1){
//             setKeyboardFocusIndex(0)
//         }
//         else{
//             setKeyboardFocusIndex(pre=> (pre+1 < optionsList.length)? pre+1 : 0)
//         }
      
//     }

//     if(e.keyCode == 13){
//         console.log(keyboardFocusIndex)
//         console.log(dropdownOptionsRef.current[keyboardFocusIndex])
//        handleOptionSelect(dropdownOptionsRef.current[keyboardFocusIndex].innerHTML)
//     }
    

//     //tab or escape pressed.. close dropdown
//     if(e.keyCode == 9 || e.keyCode == 27) {
//           setShowDropdown(false)
//     }
// }

// const selectKeyDown = (e)=>{

//     if(e.keyCode == 40 || e.keyCode == 38){
//         e.preventDefault()
//     }

//     if(e.keyCode == 40){
//      if(dropdownOptionsRef.current[0]){
//        // dropdownOptionsRef.current[0].focus()
//         setKeyboardFocusIndex(0)
//      }
//     }

//     //tab or escape pressed.. close dropdown
//     if(e.keyCode == 9 || e.keyCode == 27) {
//       setShowDropdown(false)
//     }

// }

// const selectDivFocus = (e)=>{
//   console.log('select div focused')
// }

//   //handles selection of option
//   const handleOptionSelect = (option, index=0)=>{
//     setSelectedOption(option)
//     if(option != placeholder){
//         setHidePlaceholder(true)
//     }

//     if(onSelect != null){
//         onSelect(option)
//     }

//     console.log(option)
//     setShowDropdown(false)
//   }


//   //close dropdown on outside click
//   useEffect(() => {
//     let flag = false;
//     const handleClick = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         if (flag) setShowDropdown(false);
//         flag = true;
//       }
//     };
//     document.addEventListener("click", handleClick);
//     return () => {
//       document.removeEventListener("click", handleClick);
//     };
//   }, [showDropdown]);




//   return (
//     <>
//       <div className="min-w-[300px] w-full max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
//         {/* title*/}
//         <div className="text-zinc-600 text-sm font-cabin">{title}</div>
//         <div className="self-stretch h-12 justify-start items-start gap-4 inline-flex">
//           <div className={`grow relative shrink basis-0 self-stretch px-6 py-2 bg-white rounded-md border border-black justify-between items-center flex`} >
//             <div
//               tabIndex={0}
//               onKeyDown={selectKeyDown}
//               onFocus={selectDivFocus}
//               ref={selectDivRef}
//               className="grow shrink basis-0 h-6 justify-between items-center flex cursor-pointer focus-visible:outline-0"
//               onClick={handleSelectClick}
//             >
//               {!hidePlaceholder && (
//                 <div className="text-zinc-400 text-sm font-normal font-cabin">
//                   {placeholder}
//                 </div>
//               )}
//               {hidePlaceholder && <div className='text-neutral-700 text-sm font-normal font-cabin'>{selectedOption}</div>}
//               <div className={`w-6 h-6 relative transition ${showDropdown && 'rotate-180'}`}>
//                 <img src={down_arrow} />
//               </div>
//             </div>

//             {/* options */}
//             {showDropdown && (
//               <div
//                 key='dropdown'
//                 ref={dropdownRef}
//                 className="absolute z-10 w-[calc(100%-10px)] h-fit max-h-[230px] overflow-y-scroll scroll rounded-b left-[5px] top-11 bg-white transition-all border-b  border-l border-r border-neutral-300 shadow-sm"
//               >
//                 {optionsList &&
//                   optionsList.map((option, index) => (
//                     <>
//                       <p
//                         key={`${index}-${option}`}
//                         tabIndex={index+1}
//                         onKeyDown={handleDropdownKeyDown}
//                         ref={el => dropdownOptionsRef.current[index] = el} 
//                         onClick={()=>{ handleOptionSelect(option, index) }}
//                         className="text-xs focus-visible:outline-0 focus-visible:bg-gray-100 font-medium font-cabin text-neutral-700 px-4 py-3 cursor-pointer transition-color hover:bg-gray-100"
//                       >
//                         {/* {titleCase(option)} */}
//                         {option}
//                       </p>
//                       {index != optionsList.length - 1 && <hr key={`${option}-${index}`} />}
//                     </>
//                   ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
       
//       <div className="cursor-pointer rounded-13xl bg-eb-primary-blue-500 h-10 flex flex-row items-center justify-center py-4 px-8 box-border text-base text-white font-cabin" onClick={handleAddButtonClick}>
//         <div className="relative">Add</div>
//       </div>
//     </>
//   );
// }

// export default Dropdown



import { useState, useRef, useEffect } from "react";
//dependencies...
import {down_arrow} from "../../assets/icons"; // will provide it seperately


const Dropdown =(props) => {

  const placeholder = props.placeholder || "Placeholder Text";
  const title = props.title || "Title";
  const [hidePlaceholder, setHidePlaceholder] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const selectDivRef = useRef(null)
  const optionsList = props.options;
  const onSelect = props.onSelect || null
  const currentOption = props.currentOption || null
  const handleAddButtonClick = props.handleAddButtonClick 
  
  
  const [selectedOption, setSelectedOption] = useState(currentOption)
  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(-1)

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
      <div className="min-w-[300px] w-full max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
        {/* title*/}
        <div className="text-zinc-600 text-sm font-cabin">{title}</div>
        <div className="self-stretch h-12 justify-start items-start gap-4 inline-flex">
          <div className={`grow relative shrink basis-0 self-stretch px-6 py-2 bg-white rounded-md border border-black justify-between items-center flex`} >
            <div
              tabIndex={0}
              onKeyDown={selectKeyDown}
              onFocus={selectDivFocus}
              ref={selectDivRef}
              className="grow shrink basis-0 h-6 justify-between items-center flex cursor-pointer focus-visible:outline-0"
              onClick={handleSelectClick}
            >
              {!hidePlaceholder && (
                <div className="text-zinc-400 text-sm font-normal font-cabin">
                  {placeholder}
                </div>
              )}
              {hidePlaceholder && <div className='text-neutral-700 text-sm font-normal font-cabin'>{selectedOption}</div>}
              <div className={`w-6 h-6 relative transition ${showDropdown && 'rotate-180'}`}>
                <img src={down_arrow} />
              </div>
            </div>

            {/* options */}
            {showDropdown && (
              <div
                key={'option'}
                ref={dropdownRef}
                className="absolute z-10 w-[calc(100%-10px)] h-fit max-h-[230px] overflow-y-scroll scroll rounded-b left-[5px] top-11 bg-white transition-all border border-b  border-l border-r border-neutral-300 shadow-sm"
              >
                {optionsList &&
                  optionsList.map((option, index) => (
                    <>
                      <p
                        key={`${index}-${option}`}
                        tabIndex={index+1}
                        onKeyDown={handleDropdownKeyDown}
                        ref={el => dropdownOptionsRef.current[index] = el} 
                        onClick={()=>{ handleOptionSelect(option, index) }}
                        className="text-xs focus-visible:outline-0 focus-visible:bg-gray-100 font-medium font-cabin text-neutral-700 px-4 py-3 cursor-pointer transition-color hover:bg-gray-100"
                      >
                        {/* {titleCase(option)} */}
                        {option}
                      </p>
                      {index != optionsList.length - 1 && <hr key={`${option}-${index}`} />}
                    </>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
       
      <div className="cursor-pointer rounded-13xl bg-eb-primary-blue-500 h-10 flex flex-row items-center justify-center py-4 px-8 box-border text-base text-white font-cabin" onClick={handleAddButtonClick}>
        <div className="relative">Add</div>
      </div>
    </>
  );
}

export default Dropdown;
  