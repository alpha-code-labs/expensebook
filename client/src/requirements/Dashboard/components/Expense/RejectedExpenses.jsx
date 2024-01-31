import React, { useEffect, useState } from 'react'
import {View , Text,Image, FlatList, ScrollView , Pressable} from 'react-native'
import { cancel_icon, down_right_icon, edit_icon, exp_c_icon, info_icon } from '../../../../../assets/icon'
import { travelExpense ,nonTravelExpenses ,} from '../../../../dummyData/dashboard/expense'
import { titleCase } from '../../../../utils/handyFunctions';

const RejectedExpenses= ({data}) => {
  const [showMessage, setShowMessage] = useState(null);

  const handlePress = (index) => {
    setShowMessage(index);
    // Hide the message after 5 seconds
    setTimeout(() => {
      setShowMessage(null);
    }, 5000);
  };


  return (
 <ScrollView
    pagingEnabled
    className='my-5'> 
   <View className='flex px-2 mt-2 h-[900px] mb-20'> 
    <View className=' min-w-full w-auto mb-5  flex-1 bg-white rounded-[12px] shadow-md shadow-neutral-800'>
    {/* <TravelExpenseBlock title={'Travel Expense'} data={travelExpenseData}/> */}
    <View className='h-full px-2 py-2'>
          <View className=' flex flex-row gap-2  items-center  h-[56px] w-fit  '>
            <Image source={exp_c_icon} alt='transit-icon' className='w-6 h-6' />
            <Text className='font-Cabin font-semibold text-base text-neutral-800 leading-normal'>Rejected Expenses</Text>
          </View>
   
        <FlatList 
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        className='h-auto'
        data={data}
        renderItem={(({item, index})=>(
          <View key={index} className='flex  justify-center items-center'> 
          <View  className='flex flex-col border-[1px] border-neutral-300 z-10  rounded-[12px] h-auto mb-3   w-full'>

            <View className='flex flex-row items-center   px-2 py-2  h-[48px]'>          
            <Text style={{fontFamily: 'Cabin'}} className='font-Cabin leading-[0.28px] text-neutral-600 text-base tracking-[0.5px] font-semibold'>
              {item?.tripNumber}
            </Text>
           
             {/* <Text numberOfLines={1} ellipsizeMode="tail" style={{fontFamily: 'Cabin'}} className='w-[200px] overflow-hidden  text-neutral-700 text-base font-medium  text-left  tracking-[0.28px] leading-normal font-Cabin '>
                {titleCase(item?.tripPurpose ?? "")}
            </Text> */}

           </View>
          
           
           { item?.travelExpenses?.length>0 && <View className='bg-neutral-300 h-[1px]  mx-2'/>}
           {item && item?.travelExpenses?.map((trItem, trIndex)=>(
            
            <View index={trIndex} className='flex flex-row justify-between items-center p-2'>
              <View className='flex flex-row'>
            <Image source={down_right_icon} alt='right-arrow-icon' className='w-6 h-6' />
            <Text style={{fontFamily: 'Cabin'}} className='font-Cabin leading-[0.28px] text-neutral-600 text-base tracking-[0.5px]'>
              {trItem?.expenseHeaderNumber}
            </Text>
            </View>

    <View className='flex  flex-row gap-2 justify-end items-center'>
            
              <Pressable onPress={()=>handlePress(`${trIndex+ trItem?.expenseHeaderNumber }`)} className='relative '>
                    <Image source={info_icon} alt='menu-icon' className='w-6 h-6 rounded-full ' />
                  
              </Pressable> 
              {showMessage === (trIndex+trItem?.expenseHeaderNumber) && (
              <View  className='absolute h-full line-clamp-2 flex justify-center z-20 w-auto min-w-[100px] max-w-[200px] right-0 top-8 bg-white shadow-xl shadow-neutral-800 rounded-[12px]  px-2' >
                <Text className='font-Inter text-center text-neutral-800 font-normal w-full  '>{titleCase(trItem?.expenseRejectionReason ?? "")}</Text>
              </View>
            )}
         
                  <Pressable className='py-2 rounded-[12px] px-2 bg-indigo-100/40' onPress={()=>(console.log('reject reason'))}>
                    <Text  className='font-Cabin text-indigo-600 leading-normal tracking-[0.28px] text-sm'>
                      Clear Rejected
                    </Text>
                  </Pressable>  
    </View>
           


            
         </View>
           ))}
           

          </View>
          


          </View>
        ))} 
        />
      
       
   </View>  
    </View>
   </View>
   </ScrollView>
 
  
  )
}

export default RejectedExpenses






function TravelExpenseBlock({data}){
  const [showMessage, setShowMessage] = useState(null);

  const handlePress = (index) => {
    setShowMessage(index);

    // Hide the message after 5 seconds
    setTimeout(() => {
      setShowMessage(null);
    }, 5000);
  };

  return(
   

  <View className='h-full px-2 py-2'>
          <View className=' flex flex-row gap-2  items-center  h-[56px] w-fit  '>
            <Image source={exp_c_icon} alt='transit-icon' className='w-6 h-6' />
            <Text className='font-Cabin font-semibold text-base text-neutral-800 leading-normal'>Rejected Expenses</Text>
          </View>
   
        <FlatList 
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        className='h-auto'
        data={data}
        renderItem={(({item, index})=>(
          <View key={index} className='flex  justify-center items-center'> 
          <View  className='flex flex-col border-[1px] border-neutral-300  rounded-[12px] h-auto mb-3   w-full'>

            <View className='flex flex-row items-center   px-2 py-2  h-[48px]'>          
            <Text style={{fontFamily: 'Cabin'}} className='font-Cabin leading-[0.28px] text-neutral-600 text-base tracking-[0.5px] font-semibold'>
              {item?.tripNumber}
            </Text>
           
             {/* <Text numberOfLines={1} ellipsizeMode="tail" style={{fontFamily: 'Cabin'}} className='w-[200px] overflow-hidden  text-neutral-700 text-base font-medium  text-left  tracking-[0.28px] leading-normal font-Cabin '>
                {titleCase(item?.tripPurpose ?? "")}
            </Text> */}

           </View>
          
           
           { item?.travelExpense?.length>0 && <View className='bg-neutral-300 h-[1px] mx-2'/>}
           {item && item?.travelExpense?.map((trItem, trIndex)=>(
            
            <View index={trIndex} className='flex flex-row justify-between items-center px-4 gap-2 py-2'>
              <View className='flex flex-row'>
            <Image source={down_right_icon} alt='right-arrow-icon' className='w-6 h-6' />
            <Text style={{fontFamily: 'Cabin'}} className='font-Cabin leading-[0.28px] text-neutral-600 text-base tracking-[0.5px]'>
              {trItem?.expenseHeaderNumber}
            </Text>
            </View>

             <View className='flex  flex-row gap-2 justify-end items-center'>
             <View>
         <Pressable onPress={()=>handlePress(index)} className='relative'>
              <Image source={info_icon} alt='menu-icon' className='w-6 h-6 rounded-full ' />
         </Pressable> 

      {showMessage === index && (
        <View className='absolute z-20  right-2 top-12 bg-white shadow-xl shadow-neutral-800 rounded-[12px] flex item-center justify-center px-4' >
          <Text style={{fontFamily: 'Cabin'}} className='text-neutral-800 font-normal w-full   text-center'>{titleCase(item?.rejectionReason ?? "")}</Text>
        </View>
      )}
    </View>

             <Pressable className='py-2 rounded-[12px] px-2 bg-indigo-100/40' onPress={()=>(console.log('reject reason'))}>
              <Text style={{fontFamily: 'Cabin'}} className='font-Cabin text-indigo-600 leading-normal tracking-[0.28px] text-sm'>
                Clear Rejected
              </Text>
            </Pressable>  
            </View>
           


            
         </View>
           ))}
           

          </View>
          


          </View>
        ))} 
        />
      
       
   </View>        
    

   
  )
}

// function NonTravelExpenseBlock({data}){

//   return(
//     <View className='h-full px-2 py-2'>
//     <View className=' flex flex-row gap-2  items-center  h-[56px] w-fit  '>
//       <Image source={exp_c_icon} alt='transit-icon' className='w-6 h-6' />
//       <Text className='font-Cabin font-semibold text-base text-neutral-800 leading-normal'>Non-Travel Expenses</Text>
//     </View>

//   <FlatList 
//   nestedScrollEnabled
//   showsVerticalScrollIndicator={false}
//   className='h-auto   '
//   data={data}
//   renderItem={(({item, index})=>(
   
//     <View key={index} className='flex flex-row border-[1px] border-neutral-300 justify-between items-center  rounded-[12px] h-auto  w-full px-2 py-2 mb-2'>

//       <View className='flex flex-1 flex-col gap-2'>    

//       <Text style={{fontFamily: 'Cabin'}} className='font-Cabin leading-[0.28px] text-neutral-600 text-base tracking-[0.5px] font-semibold'>
//         {item?.expenseHeaderNumber}
//       </Text>
      
//       <Text numberOfLines={1} ellipsizeMode="tail" style={{fontFamily: 'Cabin'}} className='   text-neutral-700 text-base font-medium  text-left  tracking-[0.28px] leading-normal font-Cabin '>
//           {titleCase(item?.category ?? "")}
//       </Text> 

//      </View>

//      <View className='flex-1 flex-row justify-end gap-2'>
   
             
//              <Image source={cancel_icon} alt='right-arrow-icon' className='w-8 h-8' />
//              <View className='w-8 h-8 bg-indigo-100 flex justify-center items-center rounded-full'>
//              <Image source={edit_icon} alt='right-arrow-icon' className='w-4 h-4' />
//              </View>

//      </View>
    
     
     
     
     

//     </View>
    


   
//   ))} 
//   />

 
// </View>  

//   )
// }
