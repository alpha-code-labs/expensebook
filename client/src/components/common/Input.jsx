
import React, { useState, useRef } from 'react';
import { View, TextInput, Image, Text, Button, TouchableOpacity , TouchableWithoutFeedback } from 'react-native';
import { titleCase } from '../../utils/handyFunctions';
import { visibility_off,visibility_on } from '../../../assets/icon';

const Input = (props) => {
  const autoFocus = props.autoFocus
  const placeholder = props.placeholder || 'Placeholder Text';
  const value = props.value;
  const title = props.title || 'Title';
  const onBlur = props.onBlur;
  const type = props.type ?? 'text';
  const onChangeText = props.onChangeText;
  const inputRef = useRef(null);
  const titleCaseFlag = props.titleCase ?? true;
  const [textInput, setTextInput] = useState(value ? titleCase(value) : '');
  const error = props.error || { set: false, message: '' };
  const [inputEntered, setInputEntered] = useState(false);
  const [visibility, setVisibility] = useState(true);

  const handleChange = (text) => {
    setTextInput(text);
    if (text === '') setInputEntered(false);
    else setInputEntered(true);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  // const handleBlur = () => {
  //   if (titleCaseFlag) setTextInput(titleCase(textInput));
  //   if (onBlur) {
  //     onBlur();
  //   }
  // };



 
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
    if (titleCaseFlag) setTextInput(titleCase(textInput));
    if (onBlur) {
      onBlur();
    }
  };

  const handleVisibilityToggle = () => {
    setVisibility((prev) => !prev);
  };


  return (
    
    <View className='w-full flex-col justify-start items-start gap-2'>
      {/* title */}
      <Text className='text-zinc-600 text-sm font-cabin'>{title}</Text>

      {/* input */}
      <View className='w-full  h-[52px]  items-center flex'>
        <View className='relative bg-white     rounded-md w-full h-full text-sm font-normal font-cabin flex items-center justify-between'>
          <TextInput
            ref={inputRef}
            autoFocus={autoFocus}

            onChangeText={handleChange}
            onFocus={() => handleFocus}
        onBlur={() => console.log('hello0')}
            secureTextEntry={visibility ? false : type === 'password'}
            className='w-full h-full px-6 py-2 border rounded-md border-neutral-300 focus:outline-0 focus:border-indigo-600'
            value={textInput}
            placeholder={ placeholder}
          />
          {type === 'password' && 
        <TouchableOpacity onPress={handleVisibilityToggle}  className='absolute w-6 top-4 right-3 bg-white'>
          <Image  source={visibility ? visibility_on : visibility_off}   />
        </TouchableOpacity>
          }
        </View>

        <View className='absolute text-xs text-red-600 left-0 px-6 top-14'>
          {error.set && <Text className='font-size-12 text-red-600'>*{error.message}</Text>}
        </View>
      </View>
    </View>
   
  );
};

export default Input;
