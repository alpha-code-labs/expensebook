import { useState, useRef, useEffect } from "react";
import { chevron_down_icon } from "../../../../assets/icon";
import {titleCase} from '../../../utils/handyFunctions'
import { ScrollView, Text, View, Pressable, TouchableOpacity, TouchableWithoutFeedback, Image } from "react-native";

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
  console.log('select View focused')
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
//   useEffect(() => {
//     let flag = false;
//     const handleClick = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         if (flag) setShowDropdown(false);
//         flag = true;
//       }
//     };
//     document.addEventListener("click", handleClick);
//     return () => {
//       document.removeEventListener("click", handleClick);
//     };
//   }, [showDropdown]);


//close dropdown on outside click
const handleClickOutside = (e)=>{
    setShowDropdown(false)
    console.log('clicked outside search component')
  }

  return (
    <>
    <TouchableWithoutFeedback className={`bg-blue-100/0 ${showDropdown? 'w-full h-full z-10' : '' } `} onPress={handleClickOutside}>
      <View style={`${showDropdown? {elevation:5}:{elevation:0}}`} className={`w-[302px] h-[73px] ${showDropdown? 'z-10':''} flex-col justify-start items-start gap-2 flex`}>
        {/* title*/}
        <Text className="text-zinc-600 text-sm font-Cabin">{title}</Text>

        <View className="h-12">
          <View className={`relative h-12 w-[302px] px-6 py-2 bg-white rounded-md border border-neutral-300 justify-between items-center flex`} >
            <Pressable
              tabIndex={0}
              onKeyDown={selectKeyDown}
              onFocus={selectDivFocus}
              ref={selectDivRef}
              className="h-6"
              onPress={handleSelectClick}
            >
             <View className='h-6 justify-between flex flex-row focus-visible:outline-0 items-center'>
              {!hidePlaceholder && (
                <Text className="text-zinc-400 text-sm font-normal font-Cabin">
                  {placeholder}
                </Text>
              )}
              {hidePlaceholder && <Text className='text-neutral-700 text-sm font-normal font-Cabin'>{selectedOption}</Text>}
              <View className={`w-6 h-6 relative transition ${showDropdown && 'rotate-180'}`}>
                <Image source={chevron_down_icon} />
              </View>
              </View>

            </Pressable>

            {/* options */}
            {showDropdown && (
              <View
                key='dropdown'
                ref={dropdownRef}
                className="absolute z-10 w-[292px] h-fit max-h-[230px] overflow-y-scroll scroll rounded-b left-[5px] top-11 bg-white transition-all border-b  border-l border-r border-neutral-300 shadow-sm"
              >
                <ScrollView>
                {optionsList &&
                  optionsList.map((option, index) => (
                    <TouchableOpacity
                        className="cursor-pointer transition-color hover:bg-gray-200 focus-visible:outline-0 focus-visible:bg-gray-100"
                        tabIndex={index+1}
                        onKeyDown={handleDropdownKeyDown}
                        //ref={firstDropDownOptionsRef}
                        onPress={(e)=>{ handleOptionSelect(option, index) }}
                        data={JSON.stringify(option)}
                        ref={el => dropdownOptionsRef.current[index] = el}
                        key={index}>
                        <Text className="text-xs font-medium font-Cabin text-neutral-700 px-4 pt-3">
                            {titleCase(option.employeeName)}
                        </Text>
                        <View className='flex px-4 pb-3 pt-.5 gap-1'>
                            <Text className="text-xs font-medium font-Cabin text-neutral-400">{`${option.designation? titleCase(option?.designation) : ''}`} </Text>
                            <Text className="text-xs font-medium font-Cabin text-neutral-400">{`${option.department? titleCase(option?.department) : ''}`} </Text>
                        </View>
                        {index != optionsList.length - 1 && <View key={option} className='h-[1px] bg-neutral-300 w-[292px]' />}
                    </TouchableOpacity>
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
