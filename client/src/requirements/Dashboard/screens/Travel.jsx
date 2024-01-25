import React,{useEffect, useState} from 'react'
import { View ,Text,Image, Pressable, FlatList, SectionList, ScrollView, ScrollViewComponent} from 'react-native'
import Button from '../../../components/common/Button'
import { breifcase_icon, list_icon } from '../../../../assets/icon';
import { getStatusClass, titleCase } from '../../../utils/handyFunctions';
import { allTravelRequest } from '../../../dummyData/dashboard/travel';
import AllTravelRequest from './AllTravelRequest';

const Travel = ({navigation}) => {

  const [activeScreen, setActiveScreen] = useState('All Travel Requests');
  const handleScreenChange = (screen) => {
    setActiveScreen(screen);
  };


  const [allTravelReq , setAllTravelReq]=useState(null);

  useEffect(()=>{
    setAllTravelReq(allTravelRequest)

  },[])
  console.log(allTravelReq)

  return (
  <View className='flex justify-center items-center mx-2 mt-8 '>
<View className='bg-white w-full rounded-[12px] h-auto flex items-center shadow-xl shadow-neutral-800'>
<View style={{fontFamily: 'Cabin'}} className="flex flex-row items-center justify-start gap-2 sm:gap-4 font-cabin py-4 ">
      <Pressable
        className={`cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate ${activeScreen === 'All Travel Requests' ? 'font-medium rounded-xl bg-indigo-600 text-xs text-gray-900' : ''}`}
        onPress={() => handleScreenChange('All Travel Requests')}
      >
       <Text style={{fontFamily: 'Cabin'}} className= {`${activeScreen === 'All Travel Requests' ? 'font-medium rounded-xl  text-xs text-white' : ''}`}>All Travel Requests</Text> 
      </Pressable>
      <Pressable 
        className={`cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate ${activeScreen === 'Rejected Travel Requests' ? 'font-medium rounded-xl bg-indigo-600 text-xs text-gray-900' : ''}`}
        onPress={() => handleScreenChange('Rejected Travel Requests')}
      >
       <Text style={{fontFamily: 'Cabin'}} className= {`${activeScreen === 'Rejected Travel Requests' ? 'font-medium rounded-xl  text-xs text-white' : ''}`}> Rejected Travel Requests</Text>
      </Pressable>
</View>

    {activeScreen=== 'All Travel Requests' && <AllTravelRequest travelData={allTravelReq}/>}
    {activeScreen=== 'Rejected Travel Requests' && <RejectedTravelRequest/>}
  

</View>
      
</View>
  )
}

export default Travel







function RejectedTravelRequest(){


  return(
    <View><Text>rejeceted Travel request</Text></View>
  )
}