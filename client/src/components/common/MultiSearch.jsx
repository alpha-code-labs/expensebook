import { useState, useRef, useEffect } from "react";
import { titleCase } from "../../utils/handyFunctions";

export default function Search(props){
    const placeholder = props.placeholder || "Placeholder Text";
    const title = props.title || "Title";
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null)
    const optionsList = props.options || []
    const currentOption = props.currentOption || null
    const [selectedOption, setSelectedOption] = useState(currentOption? currentOption : []) 
    const [textInput, setTextInput] = useState(currentOption? `${currentOption.map(o=>o.name).join(', ')}${currentOption.length>0? ', ': ''}` : '')
    const [filteredOptionsList, setFilteredOptionsList] = useState(null)
    const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(-1)
    const error = props.error || null

    //refs for filtered options
    const dropdownOptionsRef = useRef([]);

    useEffect(()=>{
        setKeyboardFocusIndex(-1)
    },[filteredOptionsList])

    //methods passed as props
    const onSelect = props.onSelect || null
    
    //length of input text above which dropdown appears
    const startShowingOptions = optionsList.length < 200 ? -1 : 0

    const inputChange = (e)=>{
        e.preventDefault()

        const inputValue = e.target.value 
        const keywords = inputValue.split(',').map((keyword) => keyword.trim());
        setTextInput(inputValue)

        const caretIndex = inputRef.current.selectionStart
        console.log(caretIndex, 'caretIndex')

        if(keywords[keywords.length-1].length == 0){
            setShowDropdown(false)
        }

        if(keywords.length == selectedOption.length ){

            
            selectedOption.forEach((option, index)=>{
                
                //not sure if we should keep this
                if(selectedOption.slice(0, index+1).map(o=>o.employeeName).join(', ').length == caretIndex){
                    removeOption(option)
                }    
            })

            //&& selectedOption[selectedOption.length-1].employeeName !== keywords[keywords.length-1]            
           // removeOption(selectedOption[selectedOption.length-1])
        }

        console.log(selectedOption, 'selectedOption')

        if (keywords.length > 0 && keywords[keywords.length - 1].length > startShowingOptions) {
            //console.log(optionsList, 'optionsList') 
            const filteredOptions = optionsList.filter(option=> option?.employeeName?.toLowerCase()?.startsWith(keywords[keywords.length - 1]?.toLowerCase()) )
            setFilteredOptionsList(filteredOptions)
            if(filteredOptions.length > 0){
                setShowDropdown(true)
            }
        }
    }

    const inputFocus = () => {
        inputRef.current.setSelectionRange(textInput.length, textInput.length)
        const keywords = textInput.split(',').map((keyword) => keyword.trim());
      
        if (keywords.length > 0 && keywords[keywords.length - 1].length > startShowingOptions) {
          const filteredOptions = optionsList.filter((option) =>
            option?.employeeName?.toLowerCase()?.startsWith(keywords[keywords.length - 1]?.toLowerCase())
          );
          setFilteredOptionsList(filteredOptions);
      
          if (filteredOptions.length > 0) {
            setShowDropdown(true);
          }
        }
    }

    const inputBlur = (e)=>{
        //bad idea...
        //setShowDropdown(false)
        if(textInput.length>0 && textInput[textInput.length-1] != ','){
            const keywords = selectedOption.map(o=>o.employeeName)  
            setTextInput(keywords.join(', ')+', ')
            //setTextInput(textInput+', ')
        }
        if(selectedOption.length==0){
            setTextInput('')
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
        if(!selectedOption.some(o=> o.employeeId == option.employeeId)){
            const updatedSlectedOption = [...selectedOption, option]
            setSelectedOption(updatedSlectedOption)
            
            setTextInput(updatedSlectedOption.map(o=>o.employeeName).join(', ')+', ')
        
            if(onSelect != null){
                onSelect(updatedSlectedOption)
            }

            setShowDropdown(false)
        }
        else{
            setTextInput(selectedOption.map(o=>o.employeeName).join(', ')+', ')
            setShowDropdown(false)   
        }
    }

    const removeOption = (option)=>{
        const updatedSelectedOption = selectedOption.filter(o=> o.employeeId!=option.employeeId)
        setSelectedOption(updatedSelectedOption)

        updatedSelectedOption.length>0? setTextInput(updatedSelectedOption.map(o=>o.employeeName).join(', ') + ', ') : setTextInput('')

        if(onSelect != null){
            onSelect(updatedSelectedOption)
        }
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
                        onKeyDown={inputKeyDown}
                        onClick={(e)=>{e.stopPropagation()}}
                        className=" w-full h-full decoration:none px-6 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " 
                        value={textInput} 
                        placeholder={placeholder}></input>

                        {!showDropdown && textInput.length<1 && error?.set && <div className="absolute px-6 top-[45px] w-full text-xs text-red-600 font-cabin">
                            {error?.message}
                        </div>}
                </div>
                
                {/* options */}
                {showDropdown && 
                <div
                    ref={dropdownRef}
                    className={`absolute z-10 w-[calc(100%-10px)] h-fit max-h-[230px] overflow-y-scroll scroll rounded-b left-[5px] top-11 bg-white transition-all border-b  border-l border-r border-neutral-300 shadow-sm`}
                >
                    {filteredOptionsList &&
                    filteredOptionsList.map((option, index) => (
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
                                {`${titleCase(option.employeeName)}-${option.employeeId}`}
                            </p>
                            <div className='flex px-4 pb-3 pt-.5 gap-1'>
                                <p className="text-xs font-medium font-cabin text-neutral-400">{`${option.designation? titleCase(option?.designation) : ''}`} </p>
                                <p className="text-xs font-medium font-cabin text-neutral-400">{`${option.department? titleCase(option?.department) : ''}`} </p>
                            </div>
                        {index != optionsList.length - 1 && <hr key={option} />}
                        </div>
                    ))}
                </div>
                }
            </div>
      </div>
    </>)
}