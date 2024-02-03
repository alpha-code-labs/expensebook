
import React,{useEffect, useState} from 'react'
import { View ,Text,Image, Pressable, FlatList, SectionList, ScrollView, ScrollViewComponent} from 'react-native'
import Button from '../../../../components/common/Button'
import { breifcase_icon, list_icon,down_right_icon, cancel_icon, edit_icon, info_icon } from '../../../../../assets/icon';
import { getStatusClass, titleCase } from '../../../../utils/handyFunctions';
import { allTravelRequest } from '../../../../dummyData/dashboard/travel';


const RejectedTravelRequest = ({travelData,navigation}) => {
    console.log('object',travelData)
    const [showMessage, setShowMessage] = useState(null);

    const handlePress = (index) => {
      setShowMessage(index);
  
      // Hide the message after 5 seconds
      setTimeout(() => {
        setShowMessage(null);
      }, 5000);
    };

  return (
 
<View className='flex flex-col w-full h-[485px] mb-2'> 

  <View className='mt-8'>
          <View className=' flex flex-row gap-2  items-center h-[56px] w-fit  px-2'>
            <Image source={breifcase_icon} alt='transit-icon' className='w-6 h-6' />
            <Text className='font-Cabin font-semibold text-base text-neutral-800 leading-normal'>Rejected Travel Requests</Text>
          </View>
        <FlatList 
        className='h-[400px]'
        data={travelData}
        pagingEnabled
        renderItem={(({item, index})=>(
          <View key={index} className='w-fit flex  justify-center items-center'> 
          <View  className='flex flex-col w-[330px] border-[1px] border-neutral-300  rounded-[12px] h-auto mb-3 '>
            <View className='flex flex-row w-[330px]  px-2 py-2  h-[129px]'>
            <View className='flex-1  justify-evenly'>
            <Text style={{fontFamily: 'Cabin'}} className='font-Cabin leading-[0.28px] text-neutral-600 text-base tracking-[0.5px] font-semibold'>
              {item?.travelRequestNumber}
            </Text>
           
             <Text numberOfLines={1} ellipsizeMode="tail" style={{fontFamily: 'Cabin'}} className='w-[200px] overflow-hidden  text-neutral-700 text-base font-medium  text-left  tracking-[0.28px] leading-normal font-Cabin '>
                {titleCase(item?.tripPurpose ?? "")}
            </Text>
           
        
           
            </View>
            <View className='flex-1 flex-col items-end justify-between pb-2'>
              
                
         
            <View>
         <Pressable onPress={()=>handlePress(index)} className='relative flex pr-10 top-6'>
              <Image source={info_icon} alt='menu-icon' className='w-6 h-6 rounded-full ' />
           </Pressable> 

      {showMessage === index && (
        <View className='absolute z-20 right-2 top-6 bg-white shadow-xl shadow-neutral-800 rounded-[12px] px-4 py-4'>
          <Text style={{fontFamily: 'Cabin'}} className='text-neutral-800 font-normal'>{titleCase(item?.rejectionReason ?? "")}</Text>
        </View>
      )}
    </View>
              <Pressable className='py-2 rounded-[12px] px-2 bg-indigo-100/40' onPress={()=>(console.log('reject reason'))}>
              <Text style={{fontFamily: 'Cabin' ,}} className='font-Cabin text-indigo-600 leading-normal tracking-[0.28px]   text-sm'>
                Clear Rejected
              </Text>
            </Pressable>          
           </View>
           </View>
          
           
          
           

          </View>
          


          </View>
        ))} 
        />
   </View>        
         </View>
        


    
  )
}

export default RejectedTravelRequest
