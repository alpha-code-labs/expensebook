import React from 'react'
import { View ,Text,Image,FlatList, Pressable,} from 'react-native'
import { exp_c_icon ,down_right_icon} from '../../../../../assets/icon'
import { getStatusClass, titleCase } from '../../../../utils/handyFunctions'

const ExpenseReport = ({data}) => {

  return (
    <View className=' px-2 py-2 w-full bg-white mt-5 h-[80%] rounded-[12px]'>
            <View className=' flex flex-row gap-2  items-center  h-[56px] w-fit  '>
              <Image source={exp_c_icon} alt='transit-icon' className='w-6 h-6' />
              <Text className='font-Cabin font-semibold text-base text-neutral-800 leading-normal'>Travel Expenses</Text>
            </View>
          <FlatList 
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          className='h-auto'
          data={data}
          renderItem={(({item, index})=>(
            <View key={index} className='flex  justify-center items-center w-full'> 
            <View  className='flex flex-col border-[1px] border-neutral-300  rounded-[12px] h-auto mb-3  w-full'>
  
              <View className='flex flex-row items-center justify-between   px-4 py-2  h-[48px]'>  
                <View className='w-1/2'>  
              <Text style={{fontFamily: 'Cabin'}} className='font-Cabin leading-[0.28px] text-neutral-600 text-base tracking-[0.5px] font-semibold'>
                {item?.tripNumber}
              </Text>
              </View>
             <View className='w-1/2 flex items-center'>
              <View className={`${getStatusClass(item.tripStatus)} py-1 px-2 rounded-[12px] w-fit`}>
              <Text  style={{fontFamily: 'Cabin'}} className={`${getStatusClass(item.tripStatus)} text-xs`}>
              {titleCase(item?.tripStatus ?? "")}
              </Text>
             </View>
             </View>
  
             </View> 
             { item?.travelExpense?.length>0 && <View className='bg-neutral-300 h-[1px] mx-2 '/>}
             {item && item?.travelExpense?.map((trItem, trIndex)=>(
              
              <View index={trIndex} className='flex flex-row justify-between items-center px-4 gap-2 py-2'>
                <View className='flex flex-row'>
              <Image source={down_right_icon} alt='right-arrow-icon' className='w-6 h-6' />
              <Text style={{fontFamily: 'Cabin'}} className='font-Cabin leading-[0.28px] text-neutral-600 text-base tracking-[0.5px]'>
                {trItem?.expenseHeaderNumber}
              </Text>
              </View>
  
               <Pressable>
                  <Text className='font-Cabin font-semibold text-indigo-600'>View Details</Text>
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

export default ExpenseReport

