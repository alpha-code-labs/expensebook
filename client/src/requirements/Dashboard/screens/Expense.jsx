import React,{useEffect, useState} from 'react'
import { View ,Text,Image, Pressable, FlatList, SectionList, ScrollView, ScrollViewComponent} from 'react-native'
import Button from '../../../components/common/Button'
import { breifcase_icon, list_icon } from '../../../../assets/icon';
import { getStatusClass, titleCase } from '../../../utils/handyFunctions'
import Expenses from '../components/Expense/Expenses';
import CompletedTrips from '../components/Expense/CompletedTrips';
import RejectedExpenses from '../components/Expense/RejectedExpenses';

import { completedTrips , rejectedExpenseReport } from '../../../dummyData/dashboard/expense';


const Expense = ({navigation}) => {

  const [completedTripData , setCompletedTripData] = useState(null);

  useEffect(()=>{

    setCompletedTripData(completedTrips)

  },[])

  const [activeScreen, setActiveScreen] = useState('Travel & Non-Travel Expenses');
  const handleScreenChange = (screen) => {
    setActiveScreen(screen);
  };

  const screenTabs=[
    {name:'Travel & Non-Travel Expenses'},
    {name:'Completed Trips'},
    {name:'Rejected Expense'}
  ]
  

  return (
<View className='flex justify-start items-start mx-2 mt-8'>
<View className='bg-white py-4 px-2   w-full rounded-[12px] h-auto flex flex-col items-center justify-center shadow-xl shadow-neutral-800'>


<FlatList data={screenTabs}
horizontal

showsHorizontalScrollIndicator={false}
renderItem={(({item,index})=>(
<View className='flex justify-center items-center '>
<Pressable key={index}
        className={`py-1 px-2 cursor-pointer  w-auto min-w-[100px] truncate ${activeScreen === item?.name ? 'font-medium rounded-xl bg-indigo-600 text-xs text-gray-900' : ''}`}
        onPress={() => handleScreenChange(item?.name)}
      >
       <Text style={{fontFamily: 'Cabin'}} className= {`${activeScreen === item?.name ? 'font-medium rounded-xl text-center  text-xs text-white' : ''}`}>{item?.name}</Text> 
      </Pressable>
</View>
))}/>
      







  
</View>

{activeScreen=== 'Travel & Non-Travel Expenses' && <Expenses  navigation={navigation}/>}
{activeScreen=== 'Completed Trips' && <CompletedTrips data={completedTripData}  navigation={navigation}/>}
{activeScreen=== 'Rejected Expense' && <RejectedExpenses data={rejectedExpenseReport} navigation={navigation}/>}
  
</View>
  )
}

export default Expense




















// <View className='flex-1  justify-evenly'>
// <Text style={{fontFamily: 'Cabin'}} className='font-Cabin leading-[0.28px] text-neutral-600 text-base tracking-[0.5px] font-semibold'>
//   {item?.travelRequestNumber}
// </Text>

//  <Text numberOfLines={1} ellipsizeMode="tail" style={{fontFamily: 'Cabin'}} className='w-[200px] overflow-hidden  text-neutral-700 text-base font-medium  text-left  tracking-[0.28px] leading-normal font-Cabin '>
//     {titleCase(item?.tripPurpose ?? "")}
// </Text>



// </View>
// <View className='flex-1 flex-col items-end justify-between pb-2'>
  
    

// <View>
// <Pressable onPress={()=>handlePress(index)} className='relative flex pr-10 top-6'>
//   <Image source={list_icon} alt='menu-icon' className='w-6 h-6 rounded-full ' />
// </Pressable> 

// {/* {showMessage === index && (
// <View className='absolute z-20 right-2 top-6 bg-white shadow-xl shadow-neutral-800 rounded-[12px] px-4 py-4'>
// <Text style={{fontFamily: 'Cabin'}} className='text-neutral-800 font-normal'>{titleCase(item?.rejectionReason ?? "")}</Text>
// </View>
// )} */}
// </View>
//   <Pressable className='py-2 rounded-[12px] px-2 bg-indigo-100/40' onPress={()=>(console.log('reject reason'))}>
//   <Text style={{fontFamily: 'Cabin' ,}} className='font-Cabin text-indigo-600 leading-normal tracking-[0.28px]   text-sm'>
//     Clear Rejected
//   </Text>
// </Pressable>          
// </View>