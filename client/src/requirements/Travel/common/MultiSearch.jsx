import { useState, useRef, useEffect } from "react";
import { titleCase } from "../../../utils/handyFunctions";
import { Pressable, TextInput, View, Text, ScrollView, Keyboard, TouchableWithoutFeedback} from "react-native";

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
    const focusOut = props.focusOut??false

    const error = props.error || null
    const drop = props.drop || 'down'

    //refs for filtered options
    const dropdownOptionsRef = useRef([]);

    useEffect(()=>{
        setKeyboardFocusIndex(-1)
    },[filteredOptionsList])

    useEffect(()=>{
        if(showDropdown || inputRef.current.isFocused()){
            setShowDropdown(false)
            Keyboard.dismiss()
        }
    },[focusOut])

    //methods passed as props
    const onSelect = props.onSelect || null
    
    //length of input text above which dropdown appears
    const startShowingOptions = optionsList.length < 200 ? -1 : 0
    const [caretIndex, setCaretIndex] = useState(0)


    const inputChange = (text)=>{
        const inputValue = text
        const keywords = inputValue.split(',').map((keyword) => keyword.trim());
        setTextInput(inputValue)

        // const caretIndex = inputRef.current.onSelectionChange
        // console.log(inputRef.current.NativeProps)
        console.log(caretIndex, 'caretIndex')

        if(keywords[keywords.length-1].length == 0){
            setShowDropdown(false)
        }

        if(keywords.length == selectedOption.length ){

            
            selectedOption.forEach((option, index)=>{
                
                //not sure if we should keep this
                if(selectedOption.slice(0, index+1).map(o=>o.employeeName).join(', ').length <= caretIndex){
                    removeOption(option)
                }    
            })

            //&& selectedOption[selectedOption.length-1].employeeName !== keywords[keywords.length-1]            
           // removeOption(selectedOption[selectedOption.length-1])
        }



        if (keywords.length > 0 && keywords[keywords.length - 1].length > startShowingOptions) {
            //console.log(optionsList, 'optionsList') 
            const filteredOptions = optionsList.filter(option=> option?.employeeName?.toLowerCase()?.startsWith(keywords[keywords.length - 1]?.toLowerCase()) )
            setFilteredOptionsList(filteredOptions)
            if(filteredOptions.length > 0){
                setShowDropdown(true)
            }
        }
    }

    const handleSelectionChange = (event) => {
        const { start } = event.nativeEvent.selection;
        setCaretIndex(start);
      };

    const inputFocus = () => {
        
        const keywords = textInput?.split(',')?.map((keyword) => keyword.trim());
      
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
        
        console.log('input blur event')
        if(textInput.length>0 && textInput[textInput.length-1] != ','){
            const keywords = selectedOption.map(o=>o.employeeName)  
            setTextInput(keywords.join(', ')+', ')
            //setTextInput(textInput+', ')
        }
        if(selectedOption.length==0){
            setTextInput('')
        }

        //setShowDropdown(false)
    }

    useEffect(()=>{
        console.log('show dropdown', showDropdown)
    }, [showDropdown])

    // //changes focused element on arrow key down/up press
    // useEffect(()=>{
    //     if( keyboardFocusIndex!=-1 && dropdownOptionsRef.current[keyboardFocusIndex]){
    //         dropdownOptionsRef.current[keyboardFocusIndex].focus()
    //     }

    //     console.log('focus changed')
    // },[keyboardFocusIndex])

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
        console.log('this ran...')
        if(!selectedOption.some(o=> o.employeeId == option.employeeId)){
            const updatedSlectedOption = [...selectedOption, option]
            setSelectedOption(updatedSlectedOption)
            
            setTextInput(updatedSlectedOption.map(o=>o.employeeName).join(', ')+', ')
        
            if(onSelect != null){
                onSelect(updatedSlectedOption)
            }

            setShowDropdown(false)
            //Keyboard.dismiss
        }
        else{
            setTextInput(selectedOption.map(o=>o.employeeName).join(', ')+', ')
            setShowDropdown(false)  
            //Keyboard.dismiss 
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
    // useEffect(() => {
    //   const handleClick = (event) => {
    //     event.stopPropagation()
    //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    //         setShowDropdown(false)
    //     }
    //   };
    //   document.addEventListener("click", handleClick)

    //   return () => {
    //     console.log('removing dropdown')
    //     document.removeEventListener("click", handleClick)
    //   }

    // }, []);

    const handleOutsideClick = ()=>{
        // Keyboard.dismiss
        // setShowDropdown(false)
    }


    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
            setKeyboardVisible(true); // or some other action
        }
        );
        const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
            setKeyboardVisible(false); // or some other action
        }
        );

        return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
        };
    }, []);
    
    useEffect(()=>{
        if(!isKeyboardVisible){
            //delay by 100ms
            
        }
    },[isKeyboardVisible])

    return(<>

        <View style={`${showDropdown? {elevation:5}:{elevation:0}}`} className={`w-[302px] ${showDropdown? 'z-10' : ''} h-[73px] flex-col justify-start items-start gap-2 inline-flex`}>
            {/* title */}
            <Text style={{fontFamily:'Cabin'}} className="text-zinc-600 text-sm font-cabin">{title}</Text>

            {/* input */}
            <View className="relative w-full bg-white items-center flex">
                
                <View className="text-neutral-700 w-full  text-sm font-normal font-cabin">
                    <TextInput
                        ref={inputRef}
                        onChangeText={inputChange} 
                        onSelectionChange={handleSelectionChange}
                        //onFocus={inputFocus}
                        //onBlur={inputBlur}
                        //onSubmitEditing={inputBlur}
                        //onKeyPress={inputKeyDown}
                        
                        className=" w-full  decoration:none px-6 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " 
                        value={textInput} 
                        placeholder={placeholder} /> 

                        {!showDropdown && textInput.length<1 && error?.set && <Text style={{fontFamily:'Cabin'}} className="absolute px-6 top-[45px] w-full text-xs text-red-600 font-cabin">
                            {error?.message}
                        </Text>}
                </View>
                
                {/* options */}
                {showDropdown && 
                <View
                    ref={dropdownRef}
                    className={`absolute z-10 w-[292px] h-fit max-h-[230px] overflow-y-scroll scroll left-[5px] ${drop=='down'? 'top-11 border-b rounded-b' : 'bottom-[45px] border-t rounded-t'} bg-white transition-all  border-l border-r border-neutral-300`}
                >
                    <ScrollView >
                        {filteredOptionsList &&
                        filteredOptionsList.map((option, index) => (
                            <Pressable
                                className="cursor-pointer w-full transition-color hover:bg-gray-200 focus-visible:outline-0 focus-visible:bg-gray-100"
                                //tabIndex={index+1}
                                //onKeyDown={handleDropdownKeyDown}
                                //ref={firstDropDownOptionsRef}
                                onPress={(e)=>{e.preventDefault(); e.stopPropagation(); handleOptionSelect(option, index) }}
                                data={JSON.stringify(option)}
                                key={index}>
                                <Text style={{fontFamily:'Cabin'}} className="text-sm font-medium font-cabin text-neutral-700 px-4 pt-3">
                                    {`${titleCase(option.employeeName)}-${option.employeeId}`}
                                </Text>
                                <View className='flex flex-row px-4 pb-3 pt-.5 gap-1'>
                                    <Text style={{fontFamily:'Cabin'}} className="text-xs font-medium font-cabin text-neutral-400">{`${option.designation? titleCase(option?.designation) : ''}`} </Text>
                                    <Text style={{fontFamily:'Cabin'}} className="text-xs font-medium font-cabin text-neutral-400">{`${option.department? titleCase(option?.department) : ''}`} </Text>
                                </View>
                            {index != optionsList.length - 1 && <View className='h-[1px] bg-neutral-300' key={option} />}
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
                }
            </View>
        </View>

    </>)
}
