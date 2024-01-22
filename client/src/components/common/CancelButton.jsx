import React from 'react';
import { TouchableOpacity,  Text, View } from 'react-native';

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
    <TouchableOpacity
       onPress={handlePress}
       onPressIn={() => {}}
      onPressOut={() => {}}
        className={`${variant=='fit'? 'w-fit ':'w-full' } ${disabled? ' bg-red-200  text-gray-400 cursor-not-allowed': ` ${bg_color || 'bg-white'} border-[1px] border-red-200  cursor-pointer` } h-12   rounded-[32px] px-6 justify-center items-center cursor-pointer`}>
     
            <Text className={`w-[113px] ${text_color || 'text-white'} h-5 text-center  text-sm font-medium font-cabin`}>{text}</Text>
      
        </TouchableOpacity>
    </>)
}

export default CancelButton