import { ActivityIndicator ,View,Text} from "react-native";

import React from 'react'

const Error = () => {
  return (
    <>
    
   
        <View className='w-full h-full items-center justify-center'>
        <ActivityIndicator size="large" color="#0000ff"/>
        <Text>Loading...</Text>  
        </View> 
   
    </>
   
  )
}

export default Error
