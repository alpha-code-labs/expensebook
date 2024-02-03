import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Overview from '../screens/Overview';
import Travel from '../screens/Travel';
import Cash from '../screens/Cash';
import Expense from '../screens/Expense';
import Approval from '../screens/Approval';
import { Image } from 'react-native';
import { employeeRole } from '../../../dummyData/dashboard/employeeRole';
import { cash_icon, overview_icon, exp_c_icon, exp_icon, travel_icon, travel_c_icon, cash_c_icon, travel_c2_icon, overview_c_icon } from '../../../../assets/icon';

const Tab = createBottomTabNavigator();

const Sidebar = () => {
 

  const sidebarItems = [
    { label: 'Overview', icon: overview_icon, activeIcon: overview_c_icon, screen: Overview },
    { label: 'Travel', icon: travel_icon, activeIcon: travel_c2_icon, screen: Travel },
    { label: 'Advance', icon: cash_icon, activeIcon: cash_c_icon, screen: Cash },
    { label: 'Expense', icon: exp_icon, activeIcon: exp_c_icon, screen: Expense },
  ];

  if (employeeRole.employeeRoles.employeeManager) {
    sidebarItems.push({ label: 'Approval', icon: exp_icon,activeIcon: exp_c_icon, screen: Approval });
  }

  return (

   
 <Tab.Navigator
  initialRouteName='Expense'
      screenOptions={{
        tabBarLabelStyle: {
          color:'#5E606E', 
          fontFamily: 'Cabin',
          fontSize: 14,
          fontWeight: 400,
          letterSpacing: 0.28,
        },
        
      }}
    >
      {sidebarItems.map((item, index) => (
        <Tab.Screen
        
         key={index} name={item.label} component={item.screen} options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Image
               className={` ${focused ? 'w-6 h-6' : 'w-6 h-6' }`}
                source={focused ? item.activeIcon : item.icon}

                
              />
            ),
          }}/>
      ))}
    </Tab.Navigator>
   
  );
};

export default Sidebar;

