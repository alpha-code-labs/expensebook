import { ActivityIndicator ,View,Text, Modal} from "react-native";

import React from 'react'

const Error = () => {
  return (
    <>  
        <Modal transparent>
          <View className='w-full h-full flex items-center justify-center bg-gray-800/30'>
             <ActivityIndicator size="large" color="#0000ff"/>
            <Text>Loading...</Text> 
         </View> 
        </Modal> 
    </>
   
  )
}

export default Error
