
import React,{useEffect, useState} from 'react'
import { View ,Text,Image, Pressable, FlatList, SectionList, ScrollView, ScrollViewComponent} from 'react-native'
import Button from '../../../components/common/Button'
import { breifcase_icon, list_icon } from '../../../../assets/icon';
import { getStatusClass, titleCase } from '../../../utils/handyFunctions';
import { allTravelRequest } from '../../../dummyData/dashboard/travel';


const AllTravelRequest = ({travelData}) => {
  return (
 
<View className='flex flex-col w-full h-[485px] mb-2'>
    
<View className='absolute px-6 py-2 w-[180px] bg-black  rounded-lg cursor-pointer  right-2'>
    <Text className='text-white text-center  font-medium text-xs font-cabin' onPress={()=>navigation.navigate('createTravel')}>Create Travel Request</Text>
  </View>

  <View className='mt-8 '>
          <View className=' flex flex-row gap-2  items-center h-[56px] w-fit  px-2'>
            <Image source={breifcase_icon} alt='transit-icon' className='w-6 h-6' />
            <Text className='font-Cabin font-semibold text-base text-neutral-800 leading-normal'>All Travel Requests</Text>
          </View>



        <FlatList 
        className='h-[400px]'
        data={travelData}
        renderItem={(({item, index})=>(
          <View className='w-fit flex  justify-center items-center'> 
          <View  className='flex flex-row w-[330px] border-[1px] px-2 py-2 border-neutral-300   h-[129px]'>
            <View className='flex-1  justify-evenly'>
            <Text style={{fontFamily: 'Cabin'}} className='font-Cabin leading-[0.28px] text-neutral-600 text-base tracking-[0.5px] font-semibold'>TRAM00000001</Text>
            <Text style={{fontFamily: 'Cabin'}} className='text-neutral-700 text-base font-medium  text-left  tracking-[0.28px] leading-normal font-Cabin '>
                Data is from datasjfl
            </Text>
            <View className={`${getStatusClass('pending booking')} w-fit px-4 py-2 rounded-[12px] `}>
              <Text style={{fontFamily: 'Cabin'}} className={`${getStatusClass('pending booking')}`}>
                {titleCase('pending settlement' ?? "")}
              </Text>
              </View>
            </View>
            <View className='flex-1 flex-col items-end justify-between pb-2'>
              
                
              <Pressable onPress={() => console.log(`hello `,)}>
           <Image source={list_icon} alt='menu-icon' className='w-6 h-6' />

           </Pressable>
              <Pressable className='py-2 rounded-[12px] px-2 bg-indigo-100/40' onPress={()=>(console.log('Raise adance'))}>
              <Text style={{fontFamily: 'Cabin'}} className='font-Cabin text-indigo-600 leading-normal tracking-[0.28px] font-bold text-sm'>
                Raise Advance
              </Text>
            </Pressable>          
           </View>

            </View>


          </View>
        ))} 
        />
   </View>        
         </View>
        


    
  )
}

export default AllTravelRequest
