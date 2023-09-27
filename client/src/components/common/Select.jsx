import { useState, useRef, useEffect } from "react";
import chevron_down from "../../assets/chevron-down.svg";
import {titleCase} from '../../utils/handyFunctions'

export default function Select(props) {
  const placeholder = props.placeholder || "Placeholder Text";
  const title = props.title || "Title";
  const [hidePlaceholder, setHidePlaceholder] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const optionsList = props.options;
  const onSelect = props.onSelect || null
  const currentOption = props.currentOption || null
  const [selectedOption, setSelectedOption] = useState(currentOption) 

  const handleSelectClick = () => {
    setShowDropdown((prev) => (prev ? false : true));
  };


  //handles selection of option
  const handleOptionSelect = (option, index)=>{
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
          <div className={`grow relative shrink basis-0 self-stretch px-6 py-2 bg-white rounded-md border border-neutral-300 justify-between items-center flex`} >
            <div
              className="grow shrink basis-0 h-6 justify-between items-center flex cursor-pointer"
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
                className="absolute z-10 w-full h-fit max-h-[230px] overflow-y-scroll scroll rounded-b left-0 top-11 bg-white transition-all border border-neutral-300 shadow-sm"
              >
                {optionsList &&
                  optionsList.map((option, index) => (
                    <>
                      <p
                        key={index}
                        onClick={()=>{ handleOptionSelect(option, index) }}
                        className="text-xs font-medium font-cabin text-neutral-700 px-4 py-3 cursor-pointer"
                      >
                        {titleCase(option)}
                      </p>
                      {index != optionsList.length - 1 && <hr key={`${option}-${index}`} />}
                    </>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
