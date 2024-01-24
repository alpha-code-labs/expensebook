import { useState, useRef, useEffect } from "react";
import { titleCase } from "../../utils/handyFunctions";
import { TextInput,View,Text,Pressable,TouchableWithoutFeedback } from "react-native";


    export default function Search(props) {
        const placeholder = props.placeholder || 'Placeholder Text';
        const title = props.title || 'Title';
        const autoFocus = props.autoFocus
        const error = props.error || { set: false, msg: '' };
        const [showDropdown, setShowDropdown] = useState(false);
        const dropdownRef = useRef(null);
        const inputRef = useRef(null);
        const optionsList = props.options || [];
        const currentOption = props.currentOption || null;
        const [selectedOption, setSelectedOption] = useState(currentOption);
        const [textInput, setTextInput] = useState('');
        const [filteredOptionsList, setFilteredOptionsList] = useState(null);
        const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(-1);
      
        // Refs for filtered options
        const dropdownOptionsRef = useRef([]);
      
        useEffect(() => {
          setKeyboardFocusIndex(-1);
        }, [filteredOptionsList]);
      
        // Methods passed as props
        const onSelect = props.onSelect || null;
      
        // Length of input text above which dropdown appears
        const startShowingOptions = optionsList.length < 200 ? 0 : 0;
      
        const inputChange = (text) => {
          setTextInput(text);
          // console.log(text)
      
          if (text.length === 0) {
            setShowDropdown(false);
          }
      
          if (text.length > startShowingOptions && optionsList.length > 0) {
            const filteredOptions = optionsList.filter((option) =>
              option.toLowerCase().startsWith(text.toLowerCase())
            );
            setFilteredOptionsList(filteredOptions);
            if (filteredOptions.length > 0) {
              setShowDropdown(true);
            }
          }
        };
      
        const inputFocus = () => {
          if (textInput.length > startShowingOptions && optionsList.length > 0) {
            const filteredOptions = optionsList.filter((option) =>
              option.toLowerCase().startsWith(textInput.toLowerCase())
            );
            setFilteredOptionsList(filteredOptions);
            if (filteredOptions.length > 0) {
              setShowDropdown(true);
            }
          }
        };
      
        const inputBlur = () => {
          // Bad idea...
          setShowDropdown(false)
        };
      
        // Changes focused element on arrow key down/up press
        useEffect(() => {
          if (keyboardFocusIndex !== -1 && dropdownOptionsRef.current[keyboardFocusIndex]) {
            dropdownOptionsRef.current[keyboardFocusIndex].focus();
          }
        }, [keyboardFocusIndex]);
      
        // Iterating through options using keyboard
        const handleDropdownKeyDown = (e) => {
          if (e.nativeEvent.key === 'ArrowDown' || e.nativeEvent.key === 'ArrowUp') {
            e.preventDefault();
          }
      
          if (e.nativeEvent.key === 'ArrowUp') {
            setKeyboardFocusIndex((prev) => (prev - 1 > -1 ? prev - 1 : filteredOptionsList.length - 1));
          }
      
          if (e.nativeEvent.key === 'ArrowDown') {
            setKeyboardFocusIndex((prev) => (prev + 1 < optionsList.length ? prev + 1 : 0));
          }
      
          if (e.nativeEvent.key === 'Enter') {
            console.log(keyboardFocusIndex);
            console.log(dropdownOptionsRef.current[keyboardFocusIndex]);
            handleOptionSelect(dropdownOptionsRef.current[keyboardFocusIndex].props.children);
          }
      
          // Tab or Escape pressed.. close dropdown
          if (e.nativeEvent.key === 'Tab' || e.nativeEvent.key === 'Escape') {
            setShowDropdown(false);
          }
        };
      
        const inputKeyDown = (e) => {
          if (e.nativeEvent.key === 'ArrowDown' || e.nativeEvent.key === 'ArrowUp') {
            e.preventDefault();
          }
      
          if (e.nativeEvent.key === 'ArrowDown') {
            if (dropdownOptionsRef.current[0]) {
              setKeyboardFocusIndex(0);
            }
          }
      
          // Tab or Escape pressed.. close dropdown
          if (e.nativeEvent.key === 'Tab' || e.nativeEvent.key === 'Escape') {
            setShowDropdown(false);
          }
        };
      
        // Handles selection of options
        const handleOptionSelect = (option) => {
          setSelectedOption(option);
          setTextInput(option);
      
          if (onSelect !== null) {
            onSelect(option);
          }
      
          setShowDropdown(false);
        };
       

    return(<>
        <TouchableWithoutFeedback >

       <View className="min-w-[300px] w-full max-w-[403px] h-[54px] flex-col justify-start items-start gap-2 inline-flex">
            {/* title */}
           <View className="text-zinc-600 text-sm font-cabin"><Text>{title}</Text></View>

            {/* input */}
           <View
                 
                className="relative w-full h-full bg-white rounded-md items-center flex">
                
               <View className="text-neutral-700 w-full   h-full text-sm font-normal font-cabin  ">
                    <TextInput
                        ref={inputRef}
                        autoFocus={autoFocus}
                        onChangeText={inputChange}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                        onKeyDown={inputKeyDown}
                        onClick={(e)=>{e.stopPropagation()}}
                        className=" w-full h-full decoration:none px-6 py-2 border rounded-md   border-neutral-300 focus:border-indigo-600 " 
                        value={textInput} 
                        placeholder={placeholder}></TextInput>
                </View>
                
                {/* options */}
                {showDropdown && 
               <View
                    ref={dropdownRef}
                    className={`absolute z-[100] w-[95%] h-fit max-h-[230px] overflow-y-scroll scroll rounded-b left-[5px] top-14 bg-white transition-all border-b  border-l border-r border-neutral-300 shadow-sm`}
                >
                    {filteredOptionsList &&
                    filteredOptionsList.map((option, index) => (
                        <>
                        <Pressable
                            key={index}
                            tabIndex={index+1}
                            onKeyDown={handleDropdownKeyDown}
                            // ref={firstDropDownOptionsRef}
                            ref={el => dropdownOptionsRef.current[index] = el} 
                            onPress={(e)=>{ handleOptionSelect(option, index) }}
                            className="text-xs font-medium font-cabin text-neutral-700 px-4 py-3 cursor-pointer transition-color hover:bg-gray-200 focus-visible:outline-0 focus-visible:bg-gray-100"
                        >
                           <Text>{titleCase(option)}</Text> 
                        </Pressable>
                        {index != optionsList.length - 1 && <Text key={option} />}
                        </>
                    ))}
                </View>
                }

                {error.set &&               
                <View className="absolute text-xs text-red-600 left-0 px-6 top-14">
                    <Text className='text-red-600'>*{error.message}</Text>
                </View>}
               
            </View>

      </View>
      </TouchableWithoutFeedback>
      

    </>)
}

// import { useState, useRef, useEffect } from "react";
// import { titleCase } from "../../utils/handyFunctions";
// import { TextInput,View,Text } from "react-native";

// export default function Search(props){
//     const placeholder = props.placeholder || "Placeholder Text";
//     const title = props.title || "Title";
//     const error = props.error || {set:false,msg:""}
//     const [showDropdown, setShowDropdown] = useState(false);
//     const dropdownRef = useRef(null);
//     const inputRef = useRef(null)
//     const optionsList = props.options || []
//     const currentOption = props.currentOption || null
//     const [selectedOption, setSelectedOption] = useState(currentOption) 
//     const [textInput, setTextInput] = useState('')
//     const [filteredOptionsList, setFilteredOptionsList] = useState(null)
//     const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(-1)

//     //refs for filtered options
//     const dropdownOptionsRef = useRef([]);

//     useEffect(()=>{
//         setKeyboardFocusIndex(-1)
//     },[filteredOptionsList])

//     //methods passed as props
//     const onSelect = props.onSelect || null
    
//     //length of input text above which dropdown appears
//     const startShowingOptions = optionsList.length < 200 ? 0 : 0

//     const inputChange = (e)=>{
//         e.preventDefault()
//         setTextInput(e.target.value)

//         if(e.target.value.length == 0){
//             setShowDropdown(false)
//         }

//         if(e.target.value.length > startShowingOptions && optionsList.length>0){
//             const filteredOptions = optionsList.filter(option=> option.toLowerCase().startsWith(e.target.value.toLowerCase()) )
//             setFilteredOptionsList(filteredOptions)
//             if(filteredOptions.length > 0){
//                 setShowDropdown(true)
//             }
//         }
//     }

//     const inputFocus = ()=>{
//         if(textInput.length > startShowingOptions && optionsList.length>0){
//             const filteredOptions = optionsList.filter(option=> option.toLowerCase().startsWith(textInput.toLowerCase()) )
//             setFilteredOptionsList(filteredOptions)
//             if(filteredOptions.length > 0){
//                 setShowDropdown(true)
//             }
//         }
//     }

//     const inputBlur = (e)=>{
//         //bad idea...
//         //setShowDropdown(false)
//     }


//     //changes focused element on arrow key down/up press
//     useEffect(()=>{
//         if( keyboardFocusIndex!=-1 && dropdownOptionsRef.current[keyboardFocusIndex]){
//             dropdownOptionsRef.current[keyboardFocusIndex].focus()
//         }
//     },[keyboardFocusIndex])

//     //iterating through options using keyboard
//     const handleDropdownKeyDown = (e)=>{
//         if(e.keyCode == 40 || e.keyCode == 38){
//             e.preventDefault()
//         }
                
//         if(e.keyCode == 38){
//             if(keyboardFocusIndex==-1){
//                 setKeyboardFocusIndex(0)
//             }
//             else{
//                 setKeyboardFocusIndex(pre=> (pre-1 > -1)? pre-1 : filteredOptionsList.length-1)
//             }
//         }

//         if(e.keyCode == 40 ){
//             if(keyboardFocusIndex==-1){
//                 setKeyboardFocusIndex(0)
//             }
//             else{
//                 setKeyboardFocusIndex(pre=> (pre+1 < optionsList.length)? pre+1 : 0)
//             }
          
//         }

//         if(e.keyCode == 13){
//             console.log(keyboardFocusIndex)
//             console.log(dropdownOptionsRef.current[keyboardFocusIndex])
//            handleOptionSelect(dropdownOptionsRef.current[keyboardFocusIndex].innerHTML)
//         }
        

//         //tab or escape pressed.. close dropdown
//         if(e.keyCode == 9 || e.keyCode == 27) {
//               setShowDropdown(false)
//         }
//     }

//     const inputKeyDown = (e)=>{
//         if(e.keyCode == 40 || e.keyCode == 38){
//             e.preventDefault()
//         }

//         if(e.keyCode == 40){
//          if(dropdownOptionsRef.current[0]){
//            // dropdownOptionsRef.current[0].focus()
//             setKeyboardFocusIndex(0)
//          }
//         }

//         //tab or escape pressed.. close dropdown
//         if(e.keyCode == 9 || e.keyCode == 27) {
//             setShowDropdown(false)
//         }

//     }
    
//     //handles selection of options
//     const handleOptionSelect = (option, index=0)=>{
//       setSelectedOption(option)
//       setTextInput(option)
  
//       if(onSelect != null){
//           onSelect(option)
//       }

//       setShowDropdown(false)
//     }

//     //for closing the dropdown on outside click
//     useEffect(() => {
//       const handleClick = (event) => {
//         event.stopPropagation()
//         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//             setShowDropdown(false)
//         }
//       };
//     //   document.addEventListener("click", handleClick)

//       return () => {
//         console.log('removing dropdown')
//         // document.removeEventListener("click", handleClick)
//       }

//     }, []);
    

//     return(<>
//        <View className="min-w-[300px] w-full max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex">
//             {/* title */}
//            <View className="text-zinc-600 text-sm font-cabin"><Text>{title}</Text></View>

//             {/* input */}
//            <View
                 
//                 className="relative w-full h-full bg-white items-center flex">
                
//                <View className="text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
//                     <TextInput
//                         ref={inputRef}
//                         onChange={inputChange} 
//                         onFocus={inputFocus}
//                         onBlur={inputBlur}
//                         onKeyDown={inputKeyDown}
//                         onClick={(e)=>{e.stopPropagation()}}
//                         className=" w-full h-full decoration:none px-6 py-2 rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " 
//                         value={textInput} 
//                         placeholder={placeholder}></TextInput>
//                 </View>
                
//                 {/* options */}
//                 {showDropdown && 
//                <View
//                     ref={dropdownRef}
//                     className={`absolute z-10 w-[calc(100%-10px)] h-fit max-h-[230px] overflow-y-scroll scroll rounded-b left-[5px] top-11 bg-white transition-all border-b  border-l border-r border-neutral-300 shadow-sm`}
//                 >
//                     {filteredOptionsList &&
//                     filteredOptionsList.map((option, index) => (
//                         <>
//                         <p
//                             key={index}
//                             tabIndex={index+1}
//                             onKeyDown={handleDropdownKeyDown}
//                             //ref={firstDropDownOptionsRef}
//                             ref={el => dropdownOptionsRef.current[index] = el} 
//                             onClick={(e)=>{ handleOptionSelect(option, index) }}
//                             className="text-xs font-medium font-cabin text-neutral-700 px-4 py-3 cursor-pointer transition-color hover:bg-gray-200 focus-visible:outline-0 focus-visible:bg-gray-100"
//                         >
//                             {titleCase(option)}
//                         </p>
//                         {index != optionsList.length - 1 && <hr key={option} />}
//                         </>
//                     ))}
//                 </View>
//                 }
//                <View className="absolute text-xs text-red-600 left-0 px-6 top-[44px]">
//                     <Text>{error.set && error.message}</Text>
//                 </View>
//             </View>

//       </View>
      

//     </>)
// }