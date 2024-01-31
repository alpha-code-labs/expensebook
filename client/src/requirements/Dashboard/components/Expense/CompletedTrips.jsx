
import React,{useEffect, useState} from 'react'
import { View ,Text,Image,Button, Pressable, FlatList, SectionList, ScrollView, ScrollViewComponent} from 'react-native'
import { breifcase_icon, list_icon,down_right_icon, cancel_icon, edit_icon } from '../../../../../assets/icon';
import { getStatusClass, titleCase } from '../../../../utils/handyFunctions';
import { allTravelRequest } from '../../../../dummyData/dashboard/travel';


const CompletedTrips = ({data,navigation}) => {

  return (
    <View className='h-[450px]  px-2 py-2 bg-white mt-5 w-full rounded-[12px]'>
    <View className=' flex flex-row gap-2  items-center  h-[56px] w-fit  '>
      <Image source={breifcase_icon} alt='transit-icon' className='w-6 h-6' />
      <Text className='font-Cabin font-semibold text-base text-neutral-800 leading-normal'>Completed Trips</Text>
    </View>
    <Text  className='text-red-200 px-2 py-2 text-center'>*Please submit your expenses before 90 days</Text>

  <FlatList 
  nestedScrollEnabled
  showsVerticalScrollIndicator={false}
  className='h-auto'
  data={data}
  renderItem={(({item, index})=>(
    <View key={index} className='flex justify-center items-center  '> 
    <View  className='flex flex-col border-[1px] border-neutral-300  rounded-[12px] h-auto mb-3  w-full'>
        
     <View className='flex flex-row   justify-between   px-2 py-2  h-[129px]'>     
     <View className='flex-1 justify-evenly'>     
      <Text style={{fontFamily: 'Cabin'}} className='font-Cabin leading-[0.28px] text-neutral-600 text-base tracking-[0.5px] font-semibold'>
        {item?.tripNumber}
      </Text>
     
       <Text numberOfLines={1} ellipsizeMode="tail" style={{fontFamily: 'Cabin'}} className='w-auto overflow-hidden  text-neutral-700 text-base font-medium  text-left  tracking-[0.28px] leading-normal font-Cabin '>
          {titleCase(item?.tripPurpose ?? "")}
      </Text>
      </View>
     <View className='flex-1 flex-col justify-evenly'>

        <Pressable onPress={()=>handlePress(index)} className='flex items-end pr-2 top-[-5px] '>
           <Image source={list_icon} alt='menu-icon' className='w-6 h-6 rounded-full ' />
        </Pressable> 
     <View className=' items-end '>
        <Pressable className='bg-indigo-600  active:bg-indigo-400 px-2 py-2 rounded-[16px]'>
       <Text style={{fontFamily: 'Cabin'}} className='   text-white text-base font-medium    tracking-[0.28px] leading-normal font-Cabin '>
          Book Expense
      </Text>
      </Pressable>
      </View>
      </View>
      
     </View>


   


    
     
     { item?.travelExpense?.length>0 && <View className='bg-neutral-300 h-[1px] mx-2'/>}
     {item && item?.travelExpense?.map((trItem, trIndex)=>(
      
    <View index={trIndex} className='flex flex-row px-2 py-2 justify-between items-center  pl-4'>

    <View className='flex flex-row'>
      <Image source={down_right_icon} alt='right-arrow-icon' className='w-6 h-6' />
      <Text style={{fontFamily: 'Cabin'}} className='font-Cabin leading-[0.28px] text-neutral-600 text-base tracking-[0.5px]'>
        {trItem?.expenseHeaderNumber}
      </Text>
    </View>
    <View className=' flex-1  items-center'>
       <View className={`${getStatusClass(trItem?.expenseHeaderStatus)} py-1 px-2 rounded-[12px] w-fit`}>
              <Text  style={{fontFamily: 'Cabin'}} className={`${getStatusClass(trItem?.expenseHeaderStatus)} text-xs`}>
                {titleCase(trItem?.expenseHeaderStatus ?? "")}
              </Text>
       </View>
       </View>

   </View>
     ))}
     

    </View>
    


    </View>

  ))} 
  />

 
</View>  
 
// {/* <View className='flex flex-col w-full h-[485px] mb-2'> 

//   <View className='mt-8'>
//           <View className=' flex flex-row gap-2  items-center h-[56px] w-fit  px-2'>
//             <Image source={breifcase_icon} alt='transit-icon' className='w-6 h-6' />
//             <Text className='font-Cabin font-semibold text-base text-neutral-800 leading-normal'>All Travel Requests</Text>
//           </View>
//         <FlatList 
//         className='h-[400px]'
//         data={travelData}
//         renderItem={(({item, index})=>(
//           <View key={index} className='w-fit flex  justify-center items-center'> 
//           <View  className='flex flex-col w-[330px] border-[1px] border-neutral-300  rounded-[12px] h-auto mb-3 '>
//             <View className='flex flex-row w-[330px]  px-2 py-2  h-[129px]'>
//             <View className='flex-1  justify-evenly'>
//             <Text style={{fontFamily: 'Cabin'}} className='font-Cabin leading-[0.28px] text-neutral-600 text-base tracking-[0.5px] font-semibold'>
//               {item.travelRequestNumber}
//             </Text>
           
//              <Text numberOfLines={1} ellipsizeMode="tail" style={{fontFamily: 'Cabin'}} className='w-[200px] overflow-hidden  text-neutral-700 text-base font-medium  text-left  tracking-[0.28px] leading-normal font-Cabin '>
//                 {titleCase(item?.tripPurpose ?? "")}
//             </Text>
           
//           <View className='w-fit'>
//             <View className={`${getStatusClass(item.travelRequestStatus)} w-auto items-center py-2 rounded-[12px] `}>
//               <Text  style={{fontFamily: 'Cabin'}} className={`${getStatusClass(item.travelRequestStatus)}`}>
//                 {titleCase(item?.travelRequestStatus ?? "")}
//               </Text>
//             </View>
//            </View>
           
//             </View>
//             <View className='flex-1 flex-col items-end justify-between pb-2'>
              
                
//               <Pressable onPress={() => console.log(`hello `,)}>
//            <Image source={list_icon} alt='menu-icon' className='w-6 h-6' />

//            </Pressable>
//               <Pressable className='py-2 rounded-[12px] px-2 bg-indigo-100/40' onPress={()=>(console.log('Raise adance'))}>
//               <Text style={{fontFamily: 'Cabin'}} className='font-Cabin text-indigo-600 leading-normal tracking-[0.28px] font-bold text-sm'>
//                 Raise Advance
//               </Text>
//             </Pressable>          
//            </View>
//            </View>
          
           
//            { item?.cashAdvances?.length>0 && <View className='bg-neutral-300 h-[1px] mx-2'/>}
//            {item && item?.cashAdvances?.map((caItem, caIndex)=>(
            
//             <View index={caIndex} className='flex flex-row justify-start items-center pl-4 gap-2'>
              
//             <Image source={down_right_icon} alt='right-arrow-icon' className='w-6 h-6' />
//             <Text style={{fontFamily: 'Cabin'}} className='font-Cabin leading-[0.28px] text-neutral-600 text-base tracking-[0.5px] font-bold'>
//               {caItem?.cashAdvanceNumber}
//               </Text>
//             <View  className='flex flex-col px-2 py-2'> 
//             {caItem?.amountDetails?.map((amtItm,amtIndex)=>(
//             <View key={amtIndex} className='flex-row flex h-auto'>  
//                 <Text className='font-Cabin text-[14px] font-bold text-neutral-500'>{amtItm.currencyType}</Text>
//                 <Text className='font-Cabin text-[14px] font-bold text-neutral-500'>{amtItm.amount}</Text>
//            </View>
//             ))}
//             </View>

//              <View className='flex flex-row gap-4 tra translate-y-[-8px]'>
             
//              <Image source={cancel_icon} alt='right-arrow-icon' className='w-8 h-8' />
//              <View className='w-8 h-8 bg-indigo-100 flex justify-center items-center rounded-full'>
//              <Image source={edit_icon} alt='right-arrow-icon' className='w-4 h-4' />
             
//               </View>
//               </View>


            
//          </View>
//            ))}
           

//           </View>
          


//           </View>
//         ))} 
//         />
//    </View>        
//          </View> */}
        


    
  )
}

export default CompletedTrips
