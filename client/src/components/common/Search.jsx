import { useState, useRef, useEffect } from "react";
import { titleCase } from "../../utils/handyFunctions";
import chevron_down from "../../assets/chevron-down.svg";

export default function Search(props){
    const placeholder = props.placeholder || "Placeholder Text";
    const title = props.title || "Title";
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null)
    const optionsList = props.options || []
    const currentOption = props.currentOption || null
    const [selectedOption, setSelectedOption] = useState(currentOption) 
    const [textInput, setTextInput] = useState('')
    const [filteredOptionsList, setFilteredOptionsList] = useState(null)
    //methods passed as props
    const onSelect = props.onSelect || null
    
    //length of input text above which dropdown appears
    const startShowingOptions = optionsList.length < 200 ? 0 : 1

    const inputChange = (e)=>{
        e.preventDefault()
        setTextInput(e.target.value)

        if(e.target.value.length == 0){
            setShowDropdown(false)
        }

        if(e.target.value.length > startShowingOptions && optionsList.length>0){
            const filteredOptions = optionsList.filter(option=> option.toLowerCase().startsWith(e.target.value.toLowerCase()) )
            setFilteredOptionsList(filteredOptions)
            if(filteredOptions.length > 0){
                setShowDropdown(true)
            }
        }
    }

    const inputFocus = ()=>{
        if(textInput.length > 1 && optionsList.length>0){
            const filteredOptions = optionsList.filter(option=> option.toLowerCase().startsWith(textInput.toLowerCase()) )
            setFilteredOptionsList(filteredOptions)
            if(filteredOptions.length > 0){
                setShowDropdown(true)
            }
        }
    }

    const inputBlur = ()=>{

    }

    
    //handles selection of options
    const handleOptionSelect = (option, index)=>{
      setSelectedOption(option)
      setTextInput(option)
  
      if(onSelect != null){
          onSelect(option)
      }

      setShowDropdown(false)
    }
  
  
    //for closing the dropdown on outside click
    useEffect(() => {
      let flag = false;
      const handleClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          if (flag){
            setShowDropdown(false)
          }
          flag = true
        }
      };
      document.addEventListener("click", handleClick)
      return () => {
        document.removeEventListener("click", handleClick)
      }
    }, [showDropdown]);
    

    return(<>
        <div className="min-w-[300px] w-full max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
            {/* title */}
            <div className="text-zinc-600 text-sm font-cabin">{title}</div>

            {/* input */}
            <div
                 
                className="relative w-full h-full bg-white items-center flex">
                
                <div className="text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                    <input
                        ref={inputRef}
                        onChange={inputChange} 
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        className=" w-full h-full decoration:none px-6 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " value={textInput} placeholder={placeholder}></input>
                </div>
                
                {/* options */}
                {showDropdown && 
                <div
                    ref={dropdownRef}
                    className="absolute z-10 w-full h-fit rounded-b left-0 top-11 bg-white transition-all border border-neutral-300 shadow-sm"
                >
                    {filteredOptionsList &&
                    filteredOptionsList.map((option, index) => (
                        <>
                        <p
                            key={index}
                            onClick={(e)=>{ handleOptionSelect(option, index) }}
                            className="text-xs font-medium font-cabin text-neutral-700 px-4 py-3 cursor-pointer"
                        >
                            {titleCase(option)}
                        </p>
                        {index != optionsList.length - 1 && <hr key={option} />}
                        </>
                    ))}
                </div>
                }
            </div>

      </div>

    </>)
}