import React, { useEffect, useState } from 'react';
import { View, TextInput,CheckBox, TouchableOpacity,SafeAreaView, Text,Image,Keyboard,Pressable, ScrollView,Modal } from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { app_bg,circle,check_circle,x_w_icon } from '../../../assets/icon';
import Search from '../../components/common/Search';
import CancelButton from '../../components/common/CancelButton';
import {dummyTripData} from '../../dummyData/tripData'
import { titleCase } from '../../utils/handyFunctions';
import Error from '../../components/common/Error';



const CancelTrip = () => {
   const [tripData , setTripData]=useState(null);
   const [itinerary , setItinerary]=useState(null)
   const [isLoading , setIsLoading]=useState(false);
   const [loadingErrorMsg, setLoadingErrorMsg]= useState('data');
   const [selectedIds, setSelectedIds]=useState([]);

   const [isModalVisible ,setIsModalVisible]=useState(false)


  const handleSelectedIds=(itineraryId)=>{
    setSelectedIds((prevIds)=>{
      const isAlreadySelected = prevIds.includes(itineraryId)
      if(isAlreadySelected ){
        return prevIds.filter((id)=> id !== itineraryId )
      }else{
        return[...prevIds,itineraryId]
      }
    })
  }

const handleSelectedItinerary=()=>{
  console.log(selectedIds)
}


   useEffect(()=>{
    setTripData({...dummyTripData})
    
    const itineraries = dummyTripData?.travelRequestData?.itinerary
    setItinerary(itineraries)
    // console.log(itineraries)
   },[])



    //use for get data ok
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setIsLoading(true);
  //       const { data, error } = await getTripDataApi();

  //       if (error) {
  //         setLoadingErrorMsg(error.message);
  //       } else {
  //         setTripData(data);
  //       }
  //     } catch (error) {
  //       setLoadingErrorMsg(error.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);


  const handleModalVisible = () => {
    setIsModalVisible((prev) => (!prev));
}
  
    const pressSelect = () => {
      setSelectedIds((prev) => !prev);
    };
   
  return (
<>
    {isLoading && <Error/>} 
    {loadingErrorMsg && <Text>{loadingErrorMsg}</Text>}
    <View  className='flex-1 w-full py-[60px] backdrop-blur-sm px-2 bg-slate-300 bg-blend-multiply  blur-md  flex justify-center items-center'>
    
    
      <View className='flex bg-white rounded-[24px] flex-col justify-center items-center h-full max-h-[938px] w-full' >

        
      <View className='  items-start relative  flex flex-col w-full h-[20%] px-4 pt-4 bg-indigo-300 rounded-t-[24px]'>
     
        
       
        <Text numberOfLines={1} ellipsizeMode="tail" className='text-white w-full pr-16   h-8 font-Cabin text-lg font-semibold tracking-normal truncate'>{tripData?.tripPurpose}</Text>
        
        <TouchableOpacity onPress={()=>console.log('redirect to dashboard')} className='absolute right-4 top-3 rounded-full p-1 active:bg-white'> 
        <Image source={x_w_icon} className='w-8 h-8'/>
        </TouchableOpacity>
      
       
        <Text  className='font-Cabin font-semibold text-lg text-indigo-500'>
          Please choose the itinerary, you would like to cancel or cancel the trip.
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className='px-4 min-w-full mt-1'>  
        

       <View className='flex'>  
       {['flights', 'trains', 'buses', 'cabs', 'hotels'].map((itnItem, itnItemIndex)=>{
      if(itinerary && itinerary[itnItem].length>0){
        return (
          <View className='' key={itnItemIndex}>
        <Text  className='text-xl text-neutral-700'>{titleCase(itnItem || "")} </Text>
        <View className='py-2'>
          {itinerary[itnItem].map((item, itemIndex)=>{
            if(['flights', 'trains', 'buses'].includes(itnItem)){
              return (

                <View key={itemIndex}>
                    <Flight
                    index={itemIndex}
                    from={item.bkd_from ?? ""}
                    to={item.bkd_to ?? ""}
                    date={item.date ?? ""}
                    time={item.time ?? ""}
                    itineraryId={item.itineraryId ?? ""}
                    selectedIds={selectedIds}
                    handleSelectedIds={handleSelectedIds}/>
                </View>
              )

            } else if(itnItem == 'cabs'){
              return (
                <View key={itemIndex}>
                   <Cab
                   index={itemIndex}
                   itineraryId={item?.itineraryId}
                   date={item?.bkd_date}
                   preferredTime={item?.bkd_preferredTime}
                   pickupAddress={item?.bkd_pickupAddress ?? ""}
                   dropAddress = {item?.bkd_dropAddress ?? ""}
                   selectedIds={selectedIds}
                   handleSelectedIds={handleSelectedIds}/>
                </View>
              )

            }else if(itnItem =='hotels'){
              return (
                <View key={itemIndex}>
                 <Hotel 
                 index={itemIndex}
                 itineraryId={item.itineraryId}
                 location={item.bkd_location}
                 checkIn={item.bkd_checkIn}
                 checkOut={item.bkd_checkOut}
                 selectedIds={selectedIds}
                 handleSelectedIds={handleSelectedIds}/>
              </View>
              )
            }
          })}
          </View>
        </View>

        )
      }
       
       })}  
       
       
       
        </View> 
      
      </ScrollView>

      <View className=' flex flex-row py-4  gap-2'>
      <View >
      <CancelButton onPress={handleSelectedItinerary} variant='fit' text='Cancel Selected' text_color='text-red-200' />
      </View>
      <View> 
      <CancelButton variant='fit' text='Cancel Trip' bg_color='bg-red-200' onPress={handleModalVisible} />
      </View>
      </View>
       

      </View>
      
  
       
       
   
     
   
    </View>
    {/* <Modal visible={isModalVisible} transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
        <View style={{ width: '80%', minHeight: '70%', backgroundColor: 'white', borderRadius: 10, overflow: 'hidden' }}>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontFamily: 'cabin' }}>Select option for Enter Expense Line</Text>
            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
  <TouchableOpacity onPress={() => handleScanPress()} style={{ flex: 1, marginRight: 5 }}>
    <Text style={{ fontSize: 16, color: 'white', backgroundColor: 'blue', padding: 10, borderRadius: 5, textAlign: 'center' }}>Scan</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={handleModalVisible} style={{ flex: 1, marginLeft: 5 }}>
    <Text style={{ fontSize: 16, color: 'white', backgroundColor: 'green', padding: 10, borderRadius: 5, textAlign: 'center' }}>Manually</Text>
  </TouchableOpacity>
</View>

          </View>
        </View>
      </View>
    </Modal> */}
    <Modal visible={isModalVisible} transparent animationType='slide' >
<View className="fixed  max-h-4/5 flex-1 justify-center items-center  backdrop-blur-sm w-full h-full bg-gray-800/60 scroll-none ">
                <View className='z-10 mx-6 max-w-4/5 min-h-4/5 max-h-4/5 scroll-none  rounded-lg shadow-md '>
                    <View className="  flex gap-2 px-8 py-6 bg-slate-100 rounded-3xl">
                      <View className='flex flex-col  justify-center gap-2'>
                        
                        <Text className="text-xl font-semibold text-neutral-600 font-cabin">Are you sure you want to cancel the trips?</Text>
                        <Text className='text-xs text-neutral-600'>This will notify the booking admin to recover the trip.</Text>
                       
                      </View>  
                        <View className="flex mt-10 flex-row justify-between gap-2">
                          <View className='flex-1'>
                          
                            <CancelButton variant='full' text_color='text-red-200' text='Scan' onPress={""} />
                          </View>
                           <View className='flex-1'>
                            <CancelButton variant='full' bg_color='bg-red-200' text='Manually' onPress={handleModalVisible} />
                           </View>
                            
                        </View>
                    </View>
                </View>
  </View>
        </Modal>
       

</>    
    
  
   
 
   
 
  );
};

export default CancelTrip;



// const validateEmail = (email) => {
//   return String(email)
//     .toLowerCase()
//     .match(
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//     );
// };


function Flight({ selectedIds,from , to , itineraryId , date , time ,handleSelectedIds,index,}){
  return(
    <View  key={index} className='bg-slate-100 rounded-[12px] px-2 py-2 w-full'>
          <View className='flex flex-row justify-between items-center'>
            <View className=''>
            <Text className=' px-1 text-xs text-neutral-600 font-Cabin'>Destination</Text>
            <Text className='text-neutral-600 rounded-[12px] text-base font-Cabin'> {titleCase(from)} <Text className=' text-neutral-500 text-sm'> to</Text> {titleCase(to)}</Text>
            </View>
         
          
            <TouchableOpacity onPress={()=>handleSelectedIds(itineraryId)}>
            <Image 
             source={selectedIds.includes(itineraryId) ? check_circle  : circle}
             className='w-8 h-8'/> 
             </TouchableOpacity>
         </View>
          <View className='px-1  '>
          <View className='  flex  flex-row'>
            <Text className='flex-1 text-xs text-neutral-600 font-Cabin'>Date</Text>
            <Text className='flex-1 text-xs text-neutral-600 font-Cabin'>Preferred Time</Text>
          </View>
          <View className='  text-sm  flex  flex-row '>
           <Text className='flex-1 text-sm font-semibold text-neutral-600 font-Cabin'>{date}</Text>
           <Text className='flex-1 text-sm font-semibold text-neutral-600 font-Cabin'>{time}</Text>
          </View>
         </View>

         

          
        </View>
  )
}


function Hotel({itineraryId,selectedIds,handleSelectedIds,index,
  location,
  checkIn,
  checkOut}){
  return(
    <View  key={index} className='bg-slate-100 rounded-[12px] px-2 py-2 w-full'>
          <View className='flex flex-row justify-between items-center'>
         
          <View className=''>
            <Text className=' px-1 text-xs text-neutral-600 font-Cabin'>Location</Text>
            <Text className='px-1 text-neutral-600 rounded-[12px] text-base font-Cabin'>{titleCase(location)}</Text>
            </View>
         
          
            <TouchableOpacity onPress={()=>handleSelectedIds(itineraryId)}>
            <Image 
             source={selectedIds.includes(itineraryId) ? check_circle  : circle}
             className='w-8 h-8'/> 
             </TouchableOpacity>
         </View>
          <View className='px-1  '>
          <View className='  flex  flex-row'>
          
            <Text className='flex-1 text-xs text-neutral-600 font-Cabin'>Check-In</Text>
            <Text className='flex-1 text-xs text-neutral-600 font-Cabin'>Check-Out</Text>
          </View>
          <View className='  text-sm  flex  flex-row '>
           <Text className='flex-1 text-sm font-semibold text-neutral-600 font-Cabin'>{checkIn}</Text>
           <Text className='flex-1 text-sm font-semibold text-neutral-600 font-Cabin'>{checkOut}</Text>
          </View>
         </View>

         

          
        </View>

  )
}



function Cab({selectedIds,itineraryId,date, preferredTime, pickupAddress,dropAddress,handleSelectedIds,index}){
  return(
    <View  key={index} className='bg-slate-100 rounded-[12px] px-2 py-2 w-full'>
          <View className='flex flex-row justify-between items-center'>
         
          <View className=''>
            <Text className=' px-1 text-xs text-neutral-600 font-Cabin'>Date & Time</Text>
            <Text className='text-neutral-600 rounded-[12px] text-base font-Cabin'> {`${date} ${preferredTime}`}</Text>
          </View>
         
          
            <TouchableOpacity onPress={()=>handleSelectedIds(itineraryId)}>
            <Image 
             source={selectedIds.includes(itineraryId) ? check_circle  : circle}
             className='w-8 h-8'/> 
             </TouchableOpacity>
         </View>
          <View className='px-1  '>
          <View className='  flex  flex-row'>
          
            <Text className='flex-1 text-xs text-neutral-600 font-Cabin'>Pick-Up</Text>
            <Text className='flex-1 text-xs text-neutral-600 font-Cabin'>Drop-Off</Text>
          </View>
          <View className='text-sm  flex  flex-row'>
           <Text className='flex-1 text-sm font-semibold text-neutral-600 font-Cabin'>{titleCase(pickupAddress)}</Text>
           <Text className='flex-1 text-sm font-semibold text-neutral-600 font-Cabin'>{titleCase(dropAddress)}  </Text>
          </View>
         </View>

         

          
        </View>

  )
}