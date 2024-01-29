import { useState, useRef, useEffect } from "react";
import { titleCase } from "../../utils/handyFunctions";

export default function Search(props){
    const placeholder = props.placeholder || "Placeholder Text";
    const title = props.title || "Title";
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const optionsList = props.options || []
    const currentOption = props.currentOption || null
    const [selectedOption, setSelectedOption] = useState(props.defaultValue || '') 
    const [textInput, setTextInput] = useState('')
    const [filteredOptionsList, setFilteredOptionsList] = useState(null)
    const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(-1)
    const allowCustomInput = props.allowCustomInput || false
    const error = props.error || {set:false, message:''}

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
        if(textInput.length > startShowingOptions && optionsList.length>0){
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

        if(allowCustomInput && ((filteredOptionsList && filteredOptionsList.length<1) || textInput=='')){
            console.log('called ....')
            handleOptionSelect(textInput)
        }
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
          onSelect(option )
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
    useEffect(() => {
        // Update textInput when defaultValue changes
        setTextInput(props.defaultValue || '');
      }, [props.defaultValue]);
    
    

    return(<>
        <div className="min-w-[214px] w-full max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
            {/* title */}
            <div className="text-zinc-600 text-sm font-cabin">{title}</div>

            {/* input */}
            <div
                 
                className="relative w-full h-full bg-white-100 items-center flex">
                
                <div className="text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                    <input
                        ref={inputRef}
                        onChange={inputChange} 
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        onKeyDown={inputKeyDown}
                        onClick={(e)=>{e.stopPropagation()}}
                        className=" w-full h-full decoration:none px-6 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " 
                        value={textInput} 
                        placeholder={placeholder} />
                        
                        {!showDropdown && textInput.length<1 && error?.set && <div className="absolute px-6 top-[45px] w-full text-xs text-red-600 font-cabin">
                            {error?.message}
                        </div>}
                </div>
                
                {/* options */}
                {showDropdown && 
                <div
                    ref={dropdownRef}
                    className={`absolute z-10 w-[calc(100%-10px)] h-fit max-h-[230px] overflow-y-scroll scroll rounded-b left-[5px] top-11 bg-white-100 transition-all border-b  border-l border-r border-neutral-300 shadow-sm`}
                >
                    {filteredOptionsList &&
                    filteredOptionsList.map((option, index) => (
                        <>
                        <p
                            key={index}
                            tabIndex={index+1}
                            onKeyDown={handleDropdownKeyDown}
                            //ref={firstDropDownOptionsRef}
                            ref={el => dropdownOptionsRef.current[index] = el} 
                            onClick={(e)=>{ handleOptionSelect(option, index) }}
                            className="text-xs font-medium font-cabin text-neutral-700 px-4 py-3 cursor-pointer transition-color hover:bg-gray-200 focus-visible:outline-0 focus-visible:bg-gray-100"
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