import { useState, useRef, useEffect } from "react";
import { titleCase } from "../../../utils/handyFunctions";


export default function Search(props){
    const placeholder = props.placeholder || "Placeholder Text";
    const title = props.title || "Title";
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const ref = useRef(null);
    const inputRef = useRef(null)
    const optionsList = props.options || []
    const isObject = optionsList.length > 0 ? typeof(optionsList[0]) == 'object' ? 'object' : null : null;
    const currentOption = props.currentOption || null
    const searchChildren = props.searchChildren??'name'
    const [selectedOption, setSelectedOption] = useState(currentOption) 
    const [textInput, setTextInput] = useState('');
    const [filteredOptionsList, setFilteredOptionsList] = useState(null)
    const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(-1)
    const visible = props.visible;
    const setVisible = props.setVisible;

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

        if(e.target.value.length > startShowingOptions && optionsList.length>0){
            const filteredOptions = optionsList.filter(option=> isObject? getValueByPath(option, searchChildren).toLowerCase().startsWith(e.target.value.toLowerCase()) : option.toLowerCase().startsWith(e.target.value.toLowerCase())  )
            setFilteredOptionsList(filteredOptions)
            console.log('filtered options', filteredOptions);
        }else{
            setFilteredOptionsList(optionsList);
        }
    }

    const inputFocus = (e)=>{
        if(textInput && textInput.length > startShowingOptions && optionsList.length>0){
            const filteredOptions = optionsList.filter(option=> isObject? getValueByPath(option, searchChildren).toLowerCase().startsWith(e.target.value.toLowerCase()) : option.toLowerCase().startsWith(e.target.value.toLowerCase())  )
            setFilteredOptionsList(filteredOptions)
            if(filteredOptions.length > 0){
                setShowDropdown(true)
            }
        }
    }

    const inputBlur = (e)=>{
        //bad idea...
        //setShowDropdown(false)
        if(!showDropdown){
            if(inputRef.current.value != selectedOption){
                setSelectedOption('')
                setTextInput('')
            }
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
            //console.log(keyboardFocusIndex)
            console.log(dropdownOptionsRef.current[keyboardFocusIndex].getAttribute('data'))
            const option = JSON.parse(dropdownOptionsRef.current[keyboardFocusIndex].getAttribute('data'))
           handleOptionSelect(option)
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
      setSelectedOption(isObject? getValueByPath(option, searchChildren) : option)
  
      if(onSelect != null){
          onSelect(option)
      }
      console.log('selected option')
      setVisible(false)
    }

    //for closing the dropdown on outside click
    let firstClick = true
    useEffect(() => {
      const handleClick = (event) => {
        event.preventDefault();
        console.log('click event occured', visible, ref?.current, ref?.current?.contains(event.target))
        event.stopPropagation()
        if (visible && !ref?.current?.contains(event.target) && !firstClick ) {
            console.log('setting visible to false')
            setVisible(false);
        }
        firstClick = false;
      };

      document.addEventListener("click", handleClick)

      return () => {
        console.log('removing dropdown')
        document.removeEventListener("click", handleClick)
      }

    }, []);
    
    useEffect(()=>{
        setFilteredOptionsList(optionsList);
    }, [])

    return(<>
        {<div ref={ref} className="min-w-[300px] w-full max-w-[403px] h-[40px] flex-col justify-start items-start gap-2 inline-flex shadow-md">
    
            {/* input */}
            <div
                 
                className="relative w-full h-full bg-white items-center flex">
                
                <div className="text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                    <input
                        ref={inputRef}
                        onChange={inputChange} 
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        onKeyDown={inputKeyDown}
                        onClick={(e)=>{e.stopPropagation()}}
                        className="w-full h-full decoration:none px-6 py-2 rounded-md focus-visible:outline-0 focus-visible:border-0 " 
                        value={textInput} 
                        placeholder={'Search'}/>
                </div>
                
                {/* options */}
                {
                <div
                    ref={dropdownRef}
                    className={`absolute z-10 w-[calc(100%)] h-fit max-h-[230px] overflow-y-scroll scroll rounded-b-lg top-[38px] bg-white transition-all shadow-lg border border-neutral-100`}
                >
                    {filteredOptionsList &&
                    filteredOptionsList.map((option, index) => (
                        <div key={index}
                            tabIndex={index+1}
                            onKeyDown={handleDropdownKeyDown}
                            //ref={firstDropDownOptionsRef}
                            ref={el => dropdownOptionsRef.current[index] = el}
                            data={JSON.stringify(option)}  
                            onClick={(e)=>{ handleOptionSelect(option, index) }} 
                            className="flex gap-4 items-center pl-4 text-neutral-600 px-4 py-3 cursor-pointer transition-color hover:bg-gray-200 focus-visible:outline-0 focus-visible:bg-gray-100">
                        {option.imageUrl && <img src={option.imageUrl} className="w-6 h-6 rounded-full"/>}
                        <p className="text-sm font-medium font-cabin">
                            {titleCase(isObject? getValueByPath(option, searchChildren) : option)}
                        </p>

                        {index != optionsList.length - 1 && <hr key={option} />}
                        </div>
                    ))}

                    {filteredOptionsList && filteredOptionsList?.length == 0 && <p className="flex items-center w-full text-sm font-medium font-cabin text-neutral-500 px-4 py-3 cursor-pointer transition-color hover:bg-gray-200 focus-visible:outline-0 focus-visible:bg-gray-100">
                            No Results
                    </p> }
                </div>
                }
            </div>

      </div>}
    </>)
}

function getValueByPath(obj, path) {
    // Split the path into an array of keys
    const keys = path.split('.');
    
    // Traverse the object using the keys
    return keys.reduce((acc, key) => {
      // If acc is undefined or null, return undefined
      if (acc === undefined || acc === null) {
        return undefined;
      }
      return acc[key];
    }, obj);
  }