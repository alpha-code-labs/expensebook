
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
            <View className='flex flex-row w-[330px]  px-2 py-2  h-auto'>
            <View className='justify-between gap-2'>
            <Text style={{fontFamily: 'Cabin'}} className='font-Cabin leading-[0.28px] text-neutral-600 text-base tracking-[0.5px] font-semibold'>
              {item?.travelRequestNumber}
            </Text>
           
             <Text numberOfLines={2} ellipsizeMode="tail" style={{fontFamily: 'Cabin'}} className='w-[200px] overflow-hidden  text-neutral-700 text-base font-medium  text-left  tracking-[0.28px] leading-normal font-Cabin '>
                {titleCase(item?.tripPurpose ?? "")}
            </Text>
           
        
           
            </View>


            <View className=' flex-col items-center justify-between'>
              
                
         
         <Pressable onPress={()=>handlePress(index)} className='relative flex top-2'>
              <Image source={info_icon} alt='menu-icon' className='w-6 h-6 rounded-full ' />
        </Pressable> 

    
      {showMessage === index && (
              <View  className='absolute h-auto flex justify-center z-20 w-auto min-w-[100px] max-w-[200px] right-0 top-8 bg-white shadow-xl shadow-neutral-800 rounded-[12px]  px-2' >
                <Text className='font-Inter text-center text-neutral-800 font-normal w-full  '>{titleCase(item?.rejectionReason ?? "")}</Text>
              </View>
        )}
    

    <Pressable>
                  <Text className='font-Cabin font-semibold text-indigo-600'>Clear Rejected</Text>
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
