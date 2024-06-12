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
import Profile from './src/requirements/Dashboard/components/Overview/Profile.jsx';
import HeaderButton from './src/components/common/HeaderButton.jsx';
import TravelApproval from './src/requirements/Approval/TravelApproval.jsx';
import TravelExpenseApproval from './src/requirements/Approval/TravelExpenseApproval.jsx';



const Stack = createStackNavigator()
const App = () => {

  const [fontsLoaded] = useFonts({
    "Cabin": require("./assets/fonts/cabin-regular.ttf"),
    "Inter": require("./assets/fonts/Inter-Regular.ttf"),
    // "SourceCodePro-LightIt": require("./assets/fonts/SourceCodePro-LightIt.otf"),
  });

  const [showBackButtonOnTravelRequest, setShowBackButtonOnTravelRequest] = useState(true)

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }
 
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Travel-Expense'>
          <Stack.Screen name='dashboard' component={Index} options={{ headerShown: false }}/>
          <Stack.Screen 
            name='createTravel'
            options={{ title: 'Create Travel Request' }}
          >
            {(props) => <CreateTravelRequest  {...props} />}
          </Stack.Screen>
          <Stack.Screen name='Cancel-Trip' component={CancelTrip} options={{ headerShown: false }}/>
          <Stack.Screen name="Profile" component={Profile}/>
          <Stack.Screen name="Travel" component={TravelApproval}/>
          <Stack.Screen name="Travel-Expense" component={TravelExpenseApproval}/>
          
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
