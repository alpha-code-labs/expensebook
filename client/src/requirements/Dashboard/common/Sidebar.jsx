import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Overview from '../screens/Overview';
import Travel from '../screens/Travel';
import Cash from '../screens/Cash';
import Expense from '../screens/Expense';
import Approval from '../screens/Approval';
import { Image } from 'react-native';
import { employeeRole } from '../../../dummyData/dashboard/employeeRole';
import { cash_icon, overview_icon, exp_c_icon, exp_icon, travel_icon } from '../../../../assets/icon';

const Tab = createBottomTabNavigator();

const Sidebar = () => {
 

  const sidebarItems = [
    { label: 'Overview', icon: overview_icon, screen: Overview },
    { label: 'Travel', icon: travel_icon, screen: Travel },
    { label: 'Advance', icon: cash_icon, screen: Cash },
    { label: 'Expense', icon: exp_icon, screen: Expense },
  ];

  if (employeeRole.employeeRoles.employeeManager) {
    sidebarItems.push({ label: 'Approval', icon: exp_icon, screen: Approval });
  }

  return (

   
 <Tab.Navigator
      screenOptions={{
        
        tabBarLabelStyle: {
          // color: ({ focused }) => (focused ? '#4C36F1' : '#5E606E'),
          color: '#4C36F1',
          fontFamily: 'Cabin',
          fontSize: 14,
          fontWeight: 400,
          letterSpacing: 0.28,
        },
      }}
    >
      {sidebarItems.map((item, index) => (
        <Tab.Screen key={index} name={item.label} component={item.screen} options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Image
               className={` ${focused ? 'w-8 h-8' : 'w-6 h-6' }`}
                source={item.icon}

                // style={{tintColor: color ,activeTintColor: '#4C36F1',}} 
              />
            ),
          }}/>
      ))}
    </Tab.Navigator>
   
  );
};

export default Sidebar;


// import React from 'react'
// import { View } from 'react-native'
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import { employeeRole } from '../../../dummyData/dashboard/employeeRole'
// import Overview from '../screens/Overview'
// import Travel from '../screens/Travel'
// import Cash from '../screens/Cash'
// import Expense from '../screens/Expense'
// import Approval from '../screens/Approval'
// import { cash_icon,overview_icon,exp_c_icon,exp_icon,travel_icon } from '../../../../assets/icon'

// const Tab = createBottomTabNavigator()
// const sidebarItems = [
//     { label: 'Overview', icon: overview_icon  },
//     { label: 'Travel', icon: travel_icon },
//     { label: 'Cash-Advance', icon: cash_icon },
//     { label: 'Expense', icon: exp_icon },
//   ];

// if(employeeRole.employeeRoles.employeeManager){
//     sidebarItems.push({label:'Approval',icon:exp_icon})
// }  

// const Sidebar = () => {
//   return (
//     <Tab.Navigator>
//         <Tab.Screen name="OverView" component={""}/>
//     </Tab.Navigator>
//   )
// }

// export default Sidebar
