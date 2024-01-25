import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Text, View ,SafeAreaView} from 'react-native';
import {useFonts} from 'expo-font';
import Login from './src/requirements/LoginLogout/Login.jsx';
import UpdatePassword from './src/requirements/LoginLogout/UpdatePassword.jsx';
import CancelTrip from './src/requirements/Trip/CancelTrip.jsx';
import Sidebar from './src/requirements/Dashboard/common/Sidebar.jsx';
import Index from './src/requirements/Dashboard/common/Index.jsx';
import CreateTravelRequest from './src/requirements/Travel/CreateTravelRequest.jsx';




const Stack = createStackNavigator()
const App = () => {


  const [fontsLoaded] = useFonts({
    "Cabin": require("./assets/fonts/cabin-regular.ttf"),
    // "SourceCodePro-LightIt": require("./assets/fonts/SourceCodePro-LightIt.otf"),
  });

  const [showBackButtonOnTravelRequest, setShowBackButtonOnTravelRequest] = useState(true)

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }
 
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='dashboard'>
          <Stack.Screen name='dashboard' component={Index} options={{ headerShown: false }}/>
          <Stack.Screen 
            name='createTravel'
            options={{ title: 'Create Travel Request' }}
          >
            {(props) => <CreateTravelRequest  {...props} />}
          </Stack.Screen>
        </Stack.Navigator>

      </NavigationContainer>

      

    //   <SafeAreaView className="flex-1 bg-blue-900  items-center  font-Cabin  justify-center">
      
    //   {/* <Text className='text-blue-900'>Open up t working on your app! data is there</Text>
    //   <StatusBar style="auto" /> */}
      
      // <CancelTrip/>
     //d <Login/> 
    //   {/* <UpdatePassword/> */}
   
    // </SafeAreaView>
    )
  
  
}

export default App
