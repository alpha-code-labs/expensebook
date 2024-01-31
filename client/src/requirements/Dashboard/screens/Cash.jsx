
import React,{useEffect, useState} from 'react'
import { View ,Text,Image, Pressable, FlatList,} from 'react-native'
import { cash_c_icon, info_icon } from '../../../../assets/icon';
import { titleCase } from '../../../utils/handyFunctions';
import { cashadvances } from '../../../dummyData/dashboard/cashadvances';


const Cash = () => {
  const [cashAdvanceData , setCashAdvanceData]=useState(null)

  useEffect(()=>{
    setCashAdvanceData(cashadvances)

  },[])


  const [showMessage, setShowMessage] = useState(null);

  const handlePress = (index) => {
    setShowMessage(index);

    // Hide the message after 5 seconds
    setTimeout(() => {
      setShowMessage(null);
    }, 5000);
  };
  console.log('cash advacne data ', cashadvances)

  return (
    <View className='flex justify-center items-center mt-8 mx-2'>
    <View className='bg-white w-full rounded-[12px] h-auto flex items-start  shadow-xl shadow-neutral-800 px-2 py-4'>
    <View className='flex flex-col w-full h-[485px] mb-2 '> 

          <View className=' flex flex-row gap-2  items-center h-[56px] w-fit  '>
            <Image source={cash_c_icon} alt='transit-icon' className='w-8 h-8' />
            <Text className='font-Cabin font-semibold text-base text-neutral-800 leading-normal'>Rejected Cash Advances</Text>
          </View>
          
        <FlatList 
        className='h-[400px]'
        data={cashAdvanceData}
        renderItem={(({item, index})=>(
          <View key={index} className='w-fit flex  justify-center items-center border-[1px] border-neutral-300 mb-2 rounded-[12px]  '> 
          <View  className='flex flex-col w-[330px]  rounded-[12px] h-auto mb-3 '>
            <View className='flex flex-row w-[330px]  px-2 py-2 h-auto  min-h-[129px]'>
           
<View className=' flex flex-1 min-w-[100px] flex-col justify-between items-start'>

<Text className='font-Cabin text-neutral-700 text-base font-semibold'>{item?.cashAdvanceNumber ?? ''}</Text>


<View className='h-fit'>
    <Text className='font-Cabin font-semibold'>
      Currency Details:
    </Text>
    {item?.amountDetails.map((amtItm, amtIndex)=>(
      <>
      <View key={amtIndex} className='flex flex-row h-fit'>
        <Text className='font-Cabin text-[14px] font-bold text-neutral-500'>{amtItm?.currency}</Text>
        <Text className='font-Cabin text-[14px] font-bold text-neutral-500'>{amtItm?.amount}</Text>
      </View>
      </>
      
    ))}
</View> 

</View>

<View className='flex-1 flex-col items-end justify-between pb-2'>
              
                
         
            <View>
         <Pressable onPress={()=>handlePress(index)} className='relative flex pr-10 top-6'>
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
          
           
         
         
           

          </View>
          


          </View>
        ))} 
        />
   
         </View> 
    

      
    
    </View>

    
          
    </View>
 

        


    
  )
}

export default Cash



 