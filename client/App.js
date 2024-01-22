


import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View ,SafeAreaView} from 'react-native';
import {useFonts} from 'expo-font';
import Login from './src/requirements/LoginLogout/Login.jsx';
import UpdatePassword from './src/requirements/LoginLogout/UpdatePassword.jsx';
import CancelTrip from './src/requirements/Trip/CancelTrip.jsx';



const App = () => {


  // const [fontsLoaded] = useFonts({
  //   "Cabin-Regular": require("./assets/fonts/Cabin-Regular.ttf"),
  //   // "SourceCodePro-LightIt": require("./assets/fonts/SourceCodePro-LightIt.otf"),
  // });
  // if (!fontsLoaded) {
  //   return <Text>Loading...</Text>;
  // }
 
    return (
      <SafeAreaView className="flex-1 bg-blue-900  items-center  font-Cabin  justify-center">
      
      {/* <Text className='text-blue-900'>Open up t working on your app! data is there</Text>
      <StatusBar style="auto" /> */}
      {/* <Login/> */}
      
      <CancelTrip/>
      {/* <UpdatePassword/> */}
   
    </SafeAreaView>
    )
  
  
}

export default App
