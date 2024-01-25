import { useState, useRef, useEffect } from "react";
import { chevron_down_icon } from "../../../../assets/icon";
import { titleCase } from "../../../utils/handyFunctions";
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Pressable } from "react-native";

export default function Select(props) {
  const placeholder = props.placeholder || "Placeholder Text";
  const title = props.title || "Title";
  const [hidePlaceholder, setHidePlaceholder] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const selectDivRef = useRef(null)
  const optionsList = props.options;
  const onSelect = props.onSelect || null
  const currentOption = props.currentOption || null
  const [selectedOption, setSelectedOption] = useState(currentOption)
  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(-1)
  const violationMessage = props.violationMessage || null
  const error = props.error || null
  const required = props.required || false
  const submitAttempted = props.submitAttempted || false

    console.log('select component')

    useEffect(()=>{
      if(currentOption != null && currentOption != undefined && currentOption != '' ){
        setHidePlaceholder(true)
      }
      else{setHidePlaceholder(false)}
      setSelectedOption(currentOption)
    },[currentOption])

    //refs for filtered options
    const dropdownOptionsRef = useRef([]);
    const documentRef = useRef(null)

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
  console.log('select View focused')
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
  const handleClickOutside = (e)=>{
    setShowDropdown(false)
    console.log('clicked outside search component')
  }


  return (
    <>

    <TouchableWithoutFeedback className={`bg-blue-100 ${showDropdown? 'w-full h-full' : '' } `} onPress={handleClickOutside}>
        <View style={`${showDropdown? {elevation:5}:{elevation:0}}`} className={`w-[302px] ${showDropdown? 'z-[100]':''} h-[73px] flex-col justify-start items-start gap-2 flex`}>
            {/* title*/}
            <Text style={{fontFamily:'Cabin'}} className="text-zinc-600 text-sm font-Cabin">{title}</Text>
           
            <View className="self-stretch w-full h-12 justify-start items-start flex">
                <View className={`w-full h-12 relative px-6 py-3 bg-white rounded-md border border-neutral-300 justify-between items-center flex`} >
                    <Pressable
                    tabIndex={0}
                    onKeyDown={selectKeyDown}
                    onFocus={selectDivFocus}
                    ref={selectDivRef}
                    className="w-full h-6 relative cursor-pointer focus-visible:outline-0"
                    onPress={handleSelectClick}
                    >
                    <View className="w-full h-6 relative justify-between flex flex-row cursor-pointer focus-visible:outline-0">
                    {!hidePlaceholder && (
                        <Text style={{fontFamily:'Cabin'}} className="text-zinc-400  h-6 text-sm font-normal font-Cabin">
                            {placeholder}
                        </Text>
                    )}
                    {hidePlaceholder && <View className='text-neutral-700 h-6 text-sm font-normal font-Cabin'>
                        <Text style={{fontFamily:'Cabin'}} className='font-Cabin h-6 text-neutral-700 text-sm font-normal'>{selectedOption}</Text>
                        </View>}

                    <View className={`w-6 h-6 relative  transition-all  ${showDropdown && 'rotate-180'}`}>
                        <Image source={chevron_down_icon} className='w-6 h-6' alt='chevron-down' />
                    </View>

                    
                    {!showDropdown && hidePlaceholder && violationMessage && <View className="absolute top-[35px] w-full">
                        <Text style={{fontFamily:'Cabin'}} className='text-xs text-yellow-600 font-Cabin'>
                            {violationMessage}
                        </Text>
                    </View>}
                    
                    {!showDropdown && !hidePlaceholder && error?.set && <View className="absolute top-[35px] w-full">
                        <Text style={{fontFamily:'Cabin'}} className='text-xs text-red-600 font-Cabin'>{error?.message}</Text>
                    </View>}

                    </View>
                    </Pressable>

                    {/* options */}
                    {showDropdown && (
                    <View
                        key='dropdown'
                        ref={dropdownRef}
                        className="absolute w-[292px] h-fit max-h-[230px] overflow-y-scroll scroll rounded-b left-[5px] top-11 bg-white transition-all border-b  border-l border-r border-neutral-300 shadow-sm"
                    >
                        <ScrollView >
                            {optionsList &&
                            optionsList.map((option, index) => (
                                <View key={index}>
                                <TouchableOpacity
                                    tabIndex={index+1}
                                    onKeyDown={handleDropdownKeyDown}
                                    ref={el => dropdownOptionsRef.current[index] = el} 
                                    onPress={()=>{ handleOptionSelect(option, index) }}
                                    className="text-xs focus-visible:outline-0 focus-visible:bg-gray-100 font-medium font-Cabin text-neutral-700 px-4 py-3 cursor-pointer transition-color hover:bg-gray-100"
                                >
                                    <Text style={{fontFamily:'Cabin'}} className='text-sm text-neutral-700 font-Cabin'>{titleCase(option)}</Text>
                                </TouchableOpacity>
                                {index != optionsList.length - 1 && <View
                                    key='dropdown'
                                    className="w-[292px] h-[1px] bg-neutral-300"
                                />}
                            </View>
                            ))}
                        </ScrollView>
                    </View>
                    )}
                </View>
            </View>
        </View>
    </TouchableWithoutFeedback>
        

    </>
  );
}
