import { useState, useRef, useEffect } from "react";
import chevron_down from "../../assets/chevron-down.svg";
import {titleCase} from '../../utils/handyFunctions'
import close_icon from '../../assets/close_FILL0_wght200_GRAD0_opsz48.svg'

export default function MultiSelect(props) {
  const placeholder = props.placeholder || "Placeholder Text";
  const title = titleCase(props.title) || "Title";
  const [hidePlaceholder, setHidePlaceholder] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const selectDivRef = useRef(null);
  const optionsList = props.options;
  const onSelect = props.onSelect || null;
  const currentOption = props.currentOption || null;
  const [selectedOption, setSelectedOption] = useState(currentOption); 
  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(-1);
  const violationMessage = props.violationMessage || null;
  const error = props.error || null;
  const required = props.required || false;
  const submitAttempted = props.submitAttempted || false;


    useEffect(()=>{
      if(currentOption != null && currentOption != undefined && currentOption.length!==0 ){
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

    if(selectedOption!=null && !selectedOption.includes(option)){
        setSelectedOption(pre=>[...pre, option])
    }
    else{
        setSelectedOption([option])
    }

    if(option != placeholder){
        setHidePlaceholder(true)
    }

    if(onSelect != null){
        if(selectedOption!=null && !selectedOption.includes(option)){
            onSelect([...selectedOption, option])
        }
        else{
            onSelect([option])
        }
        
    }

    console.log(option)
    setShowDropdown(false)
  }

  const handleOptionRemove = (e, index)=>{
    e.stopPropagation()

    const selectedOptions_copy = JSON.parse(JSON.stringify(selectedOption))
    selectedOptions_copy.splice(index,1)
    setSelectedOption(selectedOptions_copy)

    if(selectedOption.length==1){
        setHidePlaceholder(false)
    }

    if(onSelect != null){
        onSelect(selectedOptions_copy)
    }

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
      <div className="min-w-[214px] w-full max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
        {/* title*/}
        <div className="text-zinc-600 text-sm font-cabin tracking-tight">{title}</div>
        <div className="self-stretch h-12 justify-start items-start gap-4 inline-flex">
          <div className={`grow relative shrink basis-0 self-stretch px-6 py-2 bg-white rounded-md border border-neutral-300 justify-between items-center flex`} >
            <div
              tabIndex={0}
              onKeyDown={selectKeyDown}
              onFocus={selectDivFocus}
              ref={selectDivRef}
              className="grow shrink basis-0 h-6 relative justify-between items-center flex cursor-pointer focus-visible:outline-0"
              onClick={handleSelectClick}
            >
              {!hidePlaceholder && (
                <div className="text-zinc-400 text-sm font-normal font-cabin tracking-tight">
                  {placeholder}
                </div>
              )}
              {hidePlaceholder && 
                selectedOption.map((option,index)=>
                <div key={index} className="flex gap-1">
                    <div className="px-1 py-.5 rounded-sm bg-slate-100 items-center flex gap-.5 border shadow-sm ml-1">
                        <div className='text-neutral-700 text-xs font-normal font-cabin tracking-tight'>{option}</div>
                        <div className="w-4 h-4" onClick={(e)=>handleOptionRemove(e,index)}>
                            <img src={close_icon} alt="close icon" />
                        </div>
                    </div>
                </div>)
                }
              <div className={`w-6 h-6 relative transition ${showDropdown && 'rotate-180'}`}>
                <img src={chevron_down} />
              </div>

              
            {!showDropdown && hidePlaceholder && violationMessage && <div className="absolute top-[35px] w-full text-xs text-yellow-600 font-cabin tracking-tight">
              {violationMessage}
            </div>}
            
            {!showDropdown && !hidePlaceholder && error?.set && <div className="absolute top-[35px] w-full text-xs text-red-600 font-cabin tracking-tight">
              {error?.message}
            </div>}


            </div>

            {/* options */}
            {showDropdown && (
              <div
                key='dropdown'
                ref={dropdownRef}
                className="absolute z-10 w-[calc(100%-10px)] h-fit max-h-[230px] overflow-y-scroll scroll rounded-b left-[5px] top-11 bg-white transition-all border-b  border-l border-r border-neutral-300 shadow-sm"
              >
                {optionsList &&
                  optionsList.map((option, index) => (
                    <div key={index}>
                      <p
                        tabIndex={index+1}
                        onKeyDown={handleDropdownKeyDown}
                        ref={el => dropdownOptionsRef.current[index] = el} 
                        onClick={()=>{ handleOptionSelect(option, index) }}
                        className="text-xs focus-visible:outline-0 focus-visible:bg-gray-100 font-medium font-cabin tracking-tight text-neutral-700 px-4 py-3 cursor-pointer transition-color hover:bg-gray-100"
                      >
                        {isNaN(option) && option? titleCase(option): option}
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