import React from 'react';
import { TouchableOpacity,  Text, View } from 'react-native';

const  Button=(props)=>{

    const { text, onPress, variant = 'fit', disabled = false } = props;

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
        className={`${variant=='fit'? 'w-fit':'w-full' } ${disabled? 'focus:bg-indigo-400 hover:text-gray-400 bg-indigo-400 text-gray-400 cursor-not-allowed': 'hover:bg-indigo-500  text-white cursor-pointer' } h-12  bg-indigo-600 rounded-[32px] justify-center items-center cursor-pointer`}>
     
            <Text className="w-full h-6 text-center text-white text-base font-medium font-cabin">{text}</Text>
      
        </TouchableOpacity>
    </>)
}

export default Button