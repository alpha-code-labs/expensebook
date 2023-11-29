import { useState, useRef, useEffect } from "react";
import chevron_down from "../../../assets/chevron-down.svg";
import {titleCase} from '../../../utils/handyFunctions'

export default function ObjectSelect(props) {
  const placeholder = props.placeholder || "Placeholder Text";
  const title = props.title || "Title";
  const currentOption = props.currentOption || null
  const [hidePlaceholder, setHidePlaceholder] = useState(currentOption?.name ? true : false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const selectDivRef = useRef(null)
  const optionsList = props.options;
  const onSelect = props.onSelect || null
  const [selectedOption, setSelectedOption] = useState(currentOption?.name)
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
      const option = JSON.parse(dropdownOptionsRef.current[keyboardFocusIndex].getAttribute('data'))
       handleOptionSelect(option)
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
    setSelectedOption(option.name)
    if(option.name != placeholder){
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
          <div className={`grow relative shrink basis-0 self-stretch px-6 py-2 bg-white rounded-md border border-neutral-300 justify-between items-center flex`} >
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
                <img src={chevron_down} />
              </div>
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
                    <div
                        className="cursor-pointer transition-color hover:bg-gray-200 focus-visible:outline-0 focus-visible:bg-gray-100"
                        tabIndex={index+1}
                        onKeyDown={handleDropdownKeyDown}
                        //ref={firstDropDownOptionsRef}
                        onClick={(e)=>{ handleOptionSelect(option, index) }}
                        data={JSON.stringify(option)}
                        ref={el => dropdownOptionsRef.current[index] = el}
                        key={index}>
                        <p className="text-xs font-medium font-cabin text-neutral-700 px-4 pt-3">
                            {titleCase(option.name)}
                        </p>
                        <div className='flex px-4 pb-3 pt-.5 gap-1'>
                            <p className="text-xs font-medium font-cabin text-neutral-400">{`${option.designation? titleCase(option?.designation) : ''}`} </p>
                            <p className="text-xs font-medium font-cabin text-neutral-400">{`${option.department? titleCase(option?.department) : ''}`} </p>
                        </div>
                        {index != optionsList.length - 1 && <hr key={option} />}
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
