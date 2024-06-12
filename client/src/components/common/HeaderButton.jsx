import React from 'react'
import { View,Text, Pressable } from 'react-native'
const HeaderButton = ({text,onPress,variant}) => {
  return (
    <Pressable onPress={onPress} className={`${variant == 'ml' ? 'ml-4 ' : 'mr-4'} py-2  px-4 bg-indigo-600 active:bg-indigo-200 rounded-[32px]`}>
    
        <Text className='translate-y-[-2px] text-center font-Cabin text-white text-base'>{text}</Text>
    
    </Pressable>
  )
}

export default HeaderButton
