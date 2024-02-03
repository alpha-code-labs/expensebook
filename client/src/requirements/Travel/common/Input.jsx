import { useState, useRef, useEffect } from "react";
import { titleCase } from "../../../utils/handyFunctions";
import { TextInput, View, Text } from "react-native";

export default function Input(props){
    const placeholder = props.placeholder || "Placeholder Text";
    const value = props.value
    const title = props.title || "Title";
    const onBlur = props.onBlur
    const onChange = props.onChange
    const inputRef = useRef(null)
    const [textInput, setTextInput] = useState(value? titleCase(value) : '')
    const error = props.error || {set:false, message:''}
    const [inputEntered, setInputEntered] = useState(false)
    
    const handleChange = (textInput)=>{
        setTextInput(textInput)
        if(textInput == '')
            setInputEntered(false)
        else setInputEntered(true)
        if(onChange??false){
            onChange({target:{value:textInput}})
        }
    }

    const handleBlur= (e)=>{
        console.log('input blurred', e.nativeEvent.target.value)
        //setTextInput(textInput)
        // if(onBlur??false){
        //     onBlur({target:{value:textInput}})
        // }
    }

    const handleEditSubmit = (e)=>{
        console.log(e.nativeEvent.text, 'edit submit')
        setTextInput(textInput)
        if(onBlur??false){
            onBlur({target:{value:textInput}})
        }
    }


    
    return(<>
        <View className="w-[302px] h-[73px] flex-col justify-start items-start gap-2 flex">
            {/* title */}
            <Text style={{fontFamily:'Cabin'}} className="h-6 text-zinc-600 text-sm">{title}</Text>

            {/* input */}
            <View className="relative w-[302px] h-12 bg-white items-center flex">
                <View className="text-neutral-700 w-full  h-full text-sm font-normal">
                    <TextInput
                        ref={inputRef}
                        onChangeText={handleChange} 
                        //onBlur={handleBlur}
                        //onSubmitEditing={handleEditSubmit}
                        onEndEditing={handleEditSubmit}
                        style={{fontFamily:'Cabin'}}
                        className=" w-full h-full decoration:none px-6 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " 
                        value={textInput} 
                        placeholder={placeholder}/>
                </View>

                <Text className="absolute text-xs text-red-600 left-0 px-6 top-[44px]">
                    {error.set && !inputEntered && error.message}
                </Text>
            </View>

      </View>

    </>)
}