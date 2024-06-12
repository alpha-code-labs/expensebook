import React from 'react';
import { Pressable,  Text, View } from 'react-native';

const  CancelButton=(props)=>{

    const { text, onPress, variant = 'fit', disabled = false , text_color ,bg_color} = props;
  

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    } else {
      console.log('disabled');
    }
  };

    return(<>
    <Pressable
       onPress={handlePress}
       onPressIn={() => {}}
      onPressOut={() => {}}
        className={`${variant=='fit'? 'w-fit  ':'w-full border-red-200' } ${disabled? ' bg-red-200  text-gray-400 cursor-not-allowed': ` ${bg_color || 'bg-white'} border-[1px]   cursor-pointer` } h-8  rounded-[32px] px-6 py-5 justify-center items-center cursor-pointer`}>
     
            <Text className={`w-[113px] ${text_color || 'text-white'} h-5 text-center  text-medium translate-y-[-2px]   font-medium font-Cabin`}>{text}</Text>
      
        </Pressable>
    </>)
}

export default CancelButton