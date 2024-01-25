import { ActivityIndicator ,View,Text, Modal} from "react-native";

import React from 'react'

const Error = ({loadingErrMsg=null}) => {
  return (
    <>  
        <Modal transparent>
          <View className='w-full h-full flex items-center justify-center bg-gray-800/30'>
             {loadingErrMsg==null && <ActivityIndicator size="large" color="#0000ff"/>}
            {loadingErrMsg!=null && <Text style={{fontFamily:'Cabin'}} >{loadingErrMsg}</Text>} 
         </View> 
        </Modal> 
    </>
   
  )
}

export default Error
