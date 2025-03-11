import React, { useState, useRef, useEffect } from "react";
import { titleCase } from "../../utils/handyFunctions";
import { search_Icon } from "../../assets/icon";



export default function Search(props){
    const placeholder = props.placeholder || "Placeholder Text";
    const title = props.title || "Title";
    const error = props.error || {set:false,msg:""}
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null)
    const optionsList = props.options || []
    const focusHandle = props.focusHandle || (() => {});
    const currentOption = props.currentOption || null
    const [selectedOption, setSelectedOption] = useState(currentOption) 
    const [textInput, setTextInput] = useState('')
    const [filteredOptionsList, setFilteredOptionsList] = useState(null)
    const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(-1)

    //refs for filtered options
    const dropdownOptionsRef = useRef([]);

    useEffect(()=>{
        setKeyboardFocusIndex(-1)
    },[filteredOptionsList])

    //methods passed as props
    const onSelect = props.onSelect || null
    
    //length of input text above which dropdown appears
    const startShowingOptions = optionsList.length < 200 ? 0 : 0

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
        focusHandle()
        if(optionsList.length===1){
            setShowDropdown(true)
        }
        else if(textInput.length > startShowingOptions && optionsList.length>0){
            const filteredOptions = optionsList.filter(option=> option.toLowerCase().startsWith(textInput.toLowerCase()) )
            setFilteredOptionsList(filteredOptions)
            if(filteredOptions.length > 0){
                setShowDropdown(true)
            }
        }
    }

    const inputBlur = (e)=>{
        //bad idea...
        //setShowDropdown(false)
    }


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
                setKeyboardFocusIndex(pre=> (pre-1 > -1)? pre-1 : filteredOptionsList.length-1)
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

    const inputKeyDown = (e)=>{
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
    
    //handles selection of options
    const handleOptionSelect = (option, index=0)=>{
      setSelectedOption(option)
      setTextInput(option)
  
      if(onSelect != null){
          onSelect(option)
      }

      setShowDropdown(false)
    }

    //for closing the dropdown on outside click
    useEffect(() => {
      const handleClick = (event) => {
        event.stopPropagation()
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false)
        }
      };
      document.addEventListener("click", handleClick)

      return () => {
        console.log('removing dropdown')
        document.removeEventListener("click", handleClick)
      }

    }, []);
    

    return(<>
        <div className="min-w-[300px] w-full  h-[73px] flex-col justify-start items-start gap-2 inline-flex">
            {/* title */}
            <div className="text-zinc-600 text-sm font-cabin">{title}</div>

            {/* input */}
            <div
                 
                className="relative w-full h-full bg-white items-center flex">
                
                <div className="text-neutral-700 w-full flex items-center h-full text-sm font-normal font-cabin">
                    <input
                        ref={inputRef}
                        onChange={inputChange} 
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        onKeyDown={inputKeyDown}
                        onClick={(e)=>{e.stopPropagation()}}
                        className=" w-full h-full relative placeholder:normal-case decoration:none px-6 py-2 capitalize rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " 
                        value={textInput} 
                        placeholder={placeholder}>
                            
                    </input>
                        <img src={search_Icon}  className="absolute right-4 w-4 h-4"/>
                    

                </div>
     
                {/* options */}
                {showDropdown && 
                <div
                    ref={dropdownRef}
                    className={`absolute z-10 w-[calc(100%-10px)] h-fit max-h-[230px] overflow-y-scroll scroll rounded-b left-[5px] top-11 bg-white transition-all border-b  border-l border-r border-neutral-300 shadow-sm`}
                >
                    {filteredOptionsList &&
                    filteredOptionsList.map((option, index) => (
                        <React.Fragment key={index}>
                        <p
                            key={index}
                            tabIndex={index+1}
                            onKeyDown={handleDropdownKeyDown}
                            //ref={firstDropDownOptionsRef}
                            ref={el => dropdownOptionsRef.current[index] = el} 
                            onClick={(e)=>{ handleOptionSelect(option, index) }}
                            className="text-xs  font-medium font-cabin text-neutral-700 px-4 py-3 cursor-pointer transition-color hover:bg-gray-200 focus-visible:outline-0 focus-visible:bg-gray-100"
                        >
                            {titleCase(option)}
                        </p>
                        {index != optionsList.length - 1 && <hr key={option} />}
                        </React.Fragment>
                    ))}
                </div>
                }
                <div className="absolute text-xs text-red-600 left-0 px-6 top-[44px]">
                    {error.set && error.message}
                </div>
            </div>

      </div>
      

    </>)
}