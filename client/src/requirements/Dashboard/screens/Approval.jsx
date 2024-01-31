import React,{useEffect, useState} from 'react'
import { View ,Text,Image, Pressable, FlatList, SectionList, ScrollView, ScrollViewComponent} from 'react-native'
import Expenses from '../components/Expense/Expenses';
import CompletedTrips from '../components/Expense/CompletedTrips';
import RejectedExpenses from '../components/Expense/RejectedExpenses';
import { travelApprovalData, expenseApprovalData} from '../../../dummyData/dashboard/approval';
import Travel from '../components/Approval/Travel';
import ExpenseReport from '../components/Approval/ExpenseReport';


const Approval = ({navigation}) => {
//for travel approval
  const [travelData , setTravelData] = useState(null);
  const [expenseData , setExpenseData]= useState(null);

  useEffect(()=>{

    setTravelData(travelApprovalData)
    setExpenseData(expenseApprovalData)

  },[])

  const [activeScreen, setActiveScreen] = useState('Travel & Cash-Advances');
  const handleScreenChange = (screen) => {
    setActiveScreen(screen);
  };


  const screenTabs=[
    {name:'Travel & Cash-Advances'},
    {name:'Travel Expense Reports'},
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
{activeScreen === 'Travel & Cash-Advances' && <Travel data={travelData }  navigation={navigation} />}
{activeScreen === 'Travel Expense Reports' && <ExpenseReport data={expenseData}  navigation={navigation}/>}
</View>
  )
}

export default Approval

