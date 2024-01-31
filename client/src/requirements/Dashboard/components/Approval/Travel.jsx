
import React,{useEffect, useState} from 'react'
import { View ,Text,Image, Pressable, FlatList, SectionList, ScrollView, ScrollViewComponent} from 'react-native'
import Button from '../../../../components/common/Button'
import { breifcase_icon, list_icon,down_right_icon, cancel_icon, edit_icon } from '../../../../../assets/icon';
import { getStatusClass, titleCase } from '../../../../utils/handyFunctions';



const Travel = ({data,navigation}) => {

  return (
 

    <View className=' px-2 py-2 w-full bg-white mt-5 h-[80%] rounded-[12px]'>
            <View className=' flex flex-row gap-2  items-center  h-[56px] w-fit '>
              <Image source={breifcase_icon} alt='transit-icon' className='w-6 h-6' />
              <Text className='font-Cabin font-semibold text-base text-neutral-800 leading-normal'>Travel Expenses</Text>
            </View>
        <FlatList 
        className='h-[400px]'
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={(({item, index})=>(
          <View key={index} className='w-fit flex  justify-center items-center'> 
          <View  className='flex flex-col  border-[1px] border-neutral-300  rounded-[12px] h-auto mb-3 '>
            <View className='flex flex-row w-full  px-2 py-2  h-auto'>
            <View className=' justify-between gap-2'>
            <Text style={{fontFamily: 'Cabin'}} className='font-Cabin leading-[0.28px] text-neutral-600 text-base tracking-[0.5px] font-semibold'>
              {item.travelRequestNumber}
            </Text>
             <Text numberOfLines={2} ellipsizeMode="tail" style={{fontFamily: 'Cabin'}} className='w-[200px] overflow-hidden  text-neutral-700 text-base font-medium  text-left  tracking-[0.28px] leading-normal font-Cabin '>
                {titleCase(item?.tripPurpose ?? "")}
            </Text>
            </View>

            <View className='flex-1 flex-col items-center justify-center gap-4 '>
            <View className={`${getStatusClass(item.travelRequestStatus)} py-1 px-2 rounded-[12px] w-fit`}>
              <Text  style={{fontFamily: 'Cabin'}} className={`${getStatusClass(item.travelRequestStatus)} text-xs`}>
              {titleCase(item?.travelRequestStatus ?? "")}
              </Text>
           </View> 
           <Pressable>
                  <Text className='font-Cabin font-semibold text-indigo-600'>View Details</Text>
           </Pressable>        
           </View>
           </View>
          
           
           { item?.cashAdvances?.length>0 && <View className='bg-neutral-300 h-[1px] mx-2'/>}
           {item && item?.cashAdvances?.map((caItem, caIndex)=>(
            
            <View index={caIndex} className='flex flex-row justify-between items-start py-2'>
              
       
           <View  className='flex flex-row pl-4'>   
           <Image source={down_right_icon} alt='right-arrow-icon' className='w-6 h-6' />
            <View>
            <Text style={{fontFamily: 'Cabin'}} className='font-Cabin leading-[0.28px] text-neutral-600 text-base tracking-[0.5px]'>
              {caItem?.cashAdvanceNumber}
            </Text>
            <View className='h-fit'>
    <Text className='font-Cabin font-semibold'>
      Currency Details:
    </Text>
    {caItem?.amountdetails?.map((amtItm, amtIndex)=>(
      <>
      <View key={amtIndex} className='flex flex-row h-fit'>
        <Text className='font-Cabin text-[14px] font-bold text-neutral-500'>{amtItm?.currencyType}</Text>
        <Text className='font-Cabin text-[14px] font-bold text-neutral-500'>{amtItm?.amount}</Text>
      </View>
      </>
      
    ))}
</View> 
</View> 
</View> 

            <Pressable>
                  <Text className='font-Cabin text-center top-[40%] right-7 font-semibold text-indigo-600'>View Details</Text>
            </Pressable>


            
         </View>
           ))}
           

          </View>
          


          </View>
        ))} 
        />
   </View>        
       
        


    
  )
}

export default Travel
