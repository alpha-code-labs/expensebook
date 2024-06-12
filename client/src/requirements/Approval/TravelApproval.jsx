import React, { useEffect, useState } from 'react';
import { View, TextInput,CheckBox, SafeAreaView, Text,Image,Keyboard,Pressable, ScrollView,Modal, TouchableWithoutFeedback, FlatList } from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { app_bg,circle,check_circle,x_w_icon, green_tick_icon, cancel_icon, cash_c_icon, info_icon, exclamation_icon } from '../../../assets/icon';
import Search from '../../components/common/Search';
import CancelButton from '../../components/common/CancelButton';
import {travelApprovaldata} from '../../dummyData/approval'
import { titleCase } from '../../utils/handyFunctions';
import Error from '../../components/common/Error';
import { useNavigation } from '@react-navigation/native';
import { approveCashAdvanceApi, approveLineItemApi, approveTravelRequestApi, getTravelDataforApprovalApi, rejectCashAdvanceApi, rejectLineItemApi, rejectTravelRequestApi } from '../../utils/api/approvalApi';
import Select from '../../components/common/Select';




const TravelApproval = () => {
  const navigation = useNavigation();
   const [travelData , setTravelData]=useState(null);
   const [itinerary , setItinerary]=useState(null);
   const [cashadvanceTaken , setCashadvanceTaken]=useState(null)
   const [cashAdvanceData , setCashAdvanceData]=useState();
   const [isLoading, setIsLoading] = useState(true)
   const [loadingErrMsg, setLoadingErrMsg] = useState(null)
   const [isUploading  , setIsUploading]=useState(false)
   const [selectedIds, setSelectedIds]=useState([]);
   const [isModalVisible ,setIsModalVisible]=useState(false);




   useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getTravelDataforApprovalApi();
          setTravelData(data);
          console.log('travel data for approval fetched.');
        setIsLoading(false);
        console.log(data)
      } catch (error) {
        console.error('Error in fetching travel data for approval:', error.message);
        setLoadingErrMsg(error.message);
        setTimeout(() => {setLoadingErrMsg(null);setIsLoading(false)},5000);
      }
    };

    fetchData(); 

  }, []);


  useEffect(()=>{

    setTravelData({...travelApprovaldata})
    const itineraries = travelApprovaldata?.travelRequestData?.itinerary
    setItinerary(itineraries)
    const isCashadvance =travelApprovaldata.travelRequestData?.isCashAdvanceTaken
    setCashadvanceTaken(isCashadvance)
    
    if(travelApprovaldata.travelRequestData?.isCashAdvanceTaken){
        setCashAdvanceData(travelApprovaldata?.cashAdvancesData)
    } 
    // console.log(itineraries)
   },[travelData])


  const handleModalVisible = () => {
    setIsModalVisible((prev) => (!prev));
}
  


//for valations if there
    const [showMessage, setShowMessage] = useState(null);

    const handlePress = (index) => {
      setShowMessage(index);
  
      // Hide the message after 5 seconds
      setTimeout(() => {
        setShowMessage(null);
      }, 5000);
    };

 
 const [actionData , setActionData]=useState({})
 const rejectionOptions=['Too Many Violations', 'Budget Constraints','Insufficient Documents','Upcoming Project Deadline']
 const [selectedRejReason, setSelectedRejReason]=useState(null)
 const [error , setError] = useState({set: false , message:""})
    
 // on action click 
const  handleAction=(itineraryId ,action)=>{
      handleModalVisible()
      const {tenantId , createdBy , travelRequestId,isCashAdvanceTaken,travelRequestStatus} = travelData?.travelRequestData;
      const apiData = {tenantId,empId: createdBy?.empId,travelRequestId,itineraryId,isCashAdvanceTaken,action ,travelRequestStatus}
      setActionData(apiData)
    }

    console.log('actionData',actionData)


// on action confirm
const handleConfirm=async()=>{
     
    const {tenantId  , empId , travelRequestId , itineraryId , isCashAdvanceTaken,action,travelRequestStatus}= actionData
    const rejectionReason = selectedRejReason
     let api;
      if(action==='travel-approve'){
        api=approveTravelRequestApi(tenantId , empId, travelRequestId , isCashAdvanceTaken)
        console.log('travel api hit')
      }else if (action==="cashadvance-approve"){
        api= approveCashAdvanceApi(travelRequestStatus, tenantId ,empId,travelRequestId)
      }else if (action === "itinerary-approve"){
        api = approveLineItemApi(tenantId,empId,travelRequestId,itineraryId)
      }else if (action === 'travel-reject'){
        api = rejectTravelRequestApi(tenantId,empId,travelRequestId,isCashAdvanceTaken,rejectionReason)
      }else if (action === 'itinerary-reject'){
        api = rejectLineItemApi(tenantId,empId,travelRequestId,itineraryId,rejectionReason)
      }else if( action === 'cashadvance-reject'){
        api = rejectCashAdvanceApi(travelRequestStatus, tenantId ,empId,travelRequestId,rejectionReason)
      }
let validConfirm = true

 if((action === 'travel-reject' || action === 'cashadvance-reject' ||action === 'itinerary-reject') && selectedRejReason === null){
  setError({set:true,message:'Please select a reason'})
  validConfirm =false
 }else{
  setError({set:false,message:''})
 }

if(validConfirm){
  try {
    setIsLoading(true);
    // const response = await postTravelPreference_API({ tenantId, empId, formData });
    const response = await api
    if (response.message === "Success") {
      setLoadingErrMsg('Profile has been updated successfully.');
    }
  
  } catch (error) {
    setLoadingErrMsg(`Please retry again : ${error.message}`); 
    setTimeout(() => {setIsLoading(false);setLoadingErrMsg(null)},2000);

  }
  handleModalVisible()
  setActionData({})
  setSelectedRejReason(null)
}
     
    }
   
  return (
<>
{isLoading && <Error loadingErrMsg={loadingErrMsg} />}
{!isLoading && 
<>
<View  className='flex-1 w-full py-4 backdrop-blur-sm  bg-slate-300/50 bg-blend-multiply  blur-md  flex justify-center items-center'>
    
  <View className='flex rounded-[24px] flex-col justify-start items-center h-full max-h-[938px] w-full' >

        
    <View className='items-start   flex flex-col  w-full    rounded-t-[24px]'>
    <View className=' w-full  rounded-t-3xl  bg-indigo-200  px-4 pt-8'>
   
    <Pressable onPress={() => navigation.navigate('dashboard')} className='absolute top-2 right-4  rounded-full  w-auto p-1  active:bg-white/20'> 
         <Image source={x_w_icon} className='w-6 h-6'/>
    </Pressable>
    <Text numberOfLines={1} ellipsizeMode="tail" className='translate-y-[-8px] text-indigo-600 w-auto font-Cabin text-xl font-semibold tracking-normal truncate'>{travelData?.travelRequestData?.tripPurpose}</Text>
    </View>
    
    <ScrollView showsVerticalScrollIndicator={false} className='px-4 min-w-full    h-[450px] bg-white'>
    
    <View className='flex '>  
       {['flights', 'trains', 'buses', 'cabs', 'hotels'].map((itnItem, itnItemIndex)=>{
      if(itinerary && itinerary[itnItem].length>0){
        return (
          <View className='' key={itnItemIndex}>
        <Text  className='text-xl text-neutral-700 '>{titleCase(itnItem  || "")} </Text>
        <View className='py-2 '>
          {itinerary[itnItem].map((item, itemIndex)=>{
            if(['flights', 'trains', 'buses'].includes(itnItem)){
              return (

                <View key={itemIndex}>
                    <Flight
                    handleAction={handleAction}
                    index={itemIndex}
                    from={item.from ?? ""}
                    to={item.to ?? ""}
                    date={item.date ?? ""}
                    time={item.time ?? ""}
                    status={item?.status ?? ""}
                    travelClass={item.travelClass ?? ""}
                    itineraryId={item.itineraryId ?? ""}
                    selectedIds={selectedIds}
                    />
                </View>
              )

            } else if(itnItem == 'cabs'){
              return (
                <View key={itemIndex}>
                   <Cab
                   handleAction={handleAction}
                   index={itemIndex}
                   itineraryId={item?.itineraryId}
                   date={item?.bkd_date}
                   preferredTime={item?.bkd_preferredTime}
                   status={item?.status ?? ""}
                   pickupAddress={item?.bkd_pickupAddress ?? ""}
                   dropAddress = {item?.bkd_dropAddress ?? ""}
                   selectedIds={selectedIds}
                   />
                </View>
              )

            }else if(itnItem =='hotels'){
              return (
                <View key={itemIndex}>
                 <Hotel 
                 handleAction={handleAction}
                 index={itemIndex}
                 itineraryId={item.itineraryId}
                 location={item?.bkd_location ?? ""}
                 checkIn={item?.checkIn ?? ""}
                 status={item?.status ?? ""}
                 checkOut={item?.checkOut ?? ""}
                 hotelClass={item?.class ?? ""}
                 selectedIds={selectedIds}
                 />
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

       
      
       
{/* ///cashadvance start */}
{cashadvanceTaken && 
<View className='flex flex-col w-full h-[485px] mb-2 '> 
    <View className=' flex flex-row gap-2  items-center h-[56px] w-fit  '>
      <Image source={cash_c_icon} alt='transit-icon' className='w-8 h-8' />
      <Text className='font-Cabin font-semibold text-base text-neutral-800 leading-normal'>Cash Advances</Text>
    </View>

{cashAdvanceData &&  cashAdvanceData.map((caItem, caIndex)=>(
<View key={caIndex} className='w-fit flex bg-slate-50  justify-center items-center border-[1px] border-neutral-300 mb-2 rounded-[12px]  '> 
<View  className='flex flex-col w-[330px]  rounded-[12px] h-auto mb-3 '>
  <View className='flex flex-row w-[330px]  px-2 py-2 h-auto  min-h-[129px]'>
<View className=' flex flex-1 min-w-[100px] flex-col justify-between items-start'>

<Text className='font-Cabin text-neutral-700 text-base font-semibold'>{caItem?.cashAdvanceNumber ?? ''}</Text>


<View className='h-fit'>
<Text className='font-Cabin font-semibold'>
Currency Details:
</Text>
{caItem?.amountDetails.map((amtItm, amtIndex)=>(
<>
<View key={amtIndex} className='flex flex-row h-fit'>
<Text className='font-Cabin text-[14px] font-bold text-neutral-500'>{amtItm?.currency?.code}</Text>
<Text className='font-Cabin text-[14px] font-bold text-neutral-500'>{amtItm?.amount}</Text>
</View>
</>

))}
</View> 
</View>

<View className='flex-1 flex-col items-center justify-between pb-2'>
  <View>
    {caItem?.cashAdvanceViolations.length>0 &&<Pressable onPress={()=>handlePress(caIndex)} className='relative flex  top-6'>
    <Image source={exclamation_icon} alt='menu-icon' className='w-6 h-6 rounded-full ' />
</Pressable>  }


{showMessage === caIndex  && (
<View className='absolute z-20  right-2 top-12 bg-white shadow-xl shadow-neutral-800 rounded-[12px] flex item-center justify-center px-4' >
<Text style={{fontFamily: 'Cabin'}} className='text-neutral-800 font-normal w-full   text-center'>{titleCase(caItem?.cashAdvanceViolations ?? "")}</Text>
</View>
)}
</View>
{caItem?.cashAdvanceStatus === 'pending approval' &&
        <View className='flex flex-row  justify-center items-center bg-white/50  p-2 rounded-[12px]'>
                    <Pressable onPress={()=>handleAction(caItem?.cashAdvanceId ,'cashadvance-approve')} className='mr-4 '>
                    <Image 
                    source={green_tick_icon}
                    className='w-8 h-8 rounded-full p-1'/> 
                    </Pressable>
                    <Pressable onPress={()=>handleAction(caItem?.cashAdvanceId ,'cashadvance-reject')}>
                    <Image 
                    source={cancel_icon}
                    className='w-6 h-6 rounded-full'/> 
                    </Pressable>
        </View>  }     
 </View>

 </View>
</View>



</View>
))} 
{/* />  */}

</View> }
{/* ///cashadvance start */}   
   
      </ScrollView>
   
    </View>

    <View className=' flex flex-row  justify-evenly py-2  bg-white w-full rounded-b-3xl'>
    {travelData?.travelRequestData?.travelRequestStatus ==='pending approval' && <>
      <View >
      <CancelButton onPress={()=>handleAction('','travel-approve')} variant='fit' text='Approve' bg_color='bg-green-100 border-green-200' text_color='text-green-200' />
      </View>
      <View> 
      <CancelButton variant='fit' text='Reject' bg_color='bg-red-100 border-red-200' text_color='text-red-200'  onPress={()=>handleAction('','travel-reject')} />
      </View>
      </>}
      </View>   

    </View>  
    </View>
   
    <Modal onRequestClose={handleModalVisible} visible={isModalVisible} transparent animationType='slide' >
    <TouchableWithoutFeedback onPress={()=>{handleModalVisible(); setError(null)}}>
<View className="fixed  max-h-4/5 flex-1 justify-center items-center  backdrop-blur-sm w-full h-full bg-gray-800/60 scroll-none ">
                <View className='z-10 mx-6 max-w-4/5 min-h-4/5 max-h-4/5 scroll-none  rounded-lg shadow-md '>
                  <TouchableWithoutFeedback>
                  
                 
                    <View className=" w-full flex gap-2 px-8 py-6 bg-slate-100 min-w-[300px] rounded-3xl">
                     <View>
                     <Text className="font-Inter text-[20px] text-neutral-600 ">{`Click on confirm for ${titleCase(actionData?.action)}`}</Text>
                     </View>
                      { (actionData?.action === 'travel-reject' || actionData?.action === 'cashadvance-reject' ||actionData?.action === 'itinerary-reject') &&
                      <View className='mb-8'>
                      <Select
                      currentOption={selectedRejReason}
                      title='Please select the reason for reject'
                      placeholder='Select Reason'
                      options={rejectionOptions}
                      onSelect={(value)=>(setSelectedRejReason(value))}
                      error={error}/> 
                      </View>}
                        <View className="flex mt-10 flex-row justify-between gap-2">
                        <View className='flex-1'>
                          
                            <CancelButton variant='full' bg_color='border-indigo-600' text_color='text-indigo-600' text='Cancel' onPress={()=>{handleModalVisible();setActionData({});setError(null)}} />
                        </View>
                           <View className='flex-1'>
                            <CancelButton variant='full' bg_color='bg-indigo-600 border-indigo-600'  text='Confirm' onPress={handleConfirm} />
                           </View>                           
                        </View>
                    </View>              
                    </TouchableWithoutFeedback> 
                </View>
  </View>
  </TouchableWithoutFeedback>
    </Modal>    
        </>}
</>    
  );
};

export default TravelApproval;




// const validateEmail = (email) => {
//   return String(email)
//     .toLowerCase()
//     .match(
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//     );
// };


function Flight({status, handleAction, selectedIds,from , to , itineraryId , date , time ,handleSelectedIds,index,travelClass}){
  return(
    <View  key={index} className='bg-slate-50 rounded-[12px] px-2 py-2 w-full'>
          <View className='flex flex-row justify-between items-center'>
            <View className=''>
            <Text className=' px-1 text-xs text-neutral-600 font-Cabin'>Destination</Text>
            <Text className='text-neutral-600 rounded-[12px] text-base font-Cabin'> {titleCase(from)} <Text className=' text-neutral-500 text-sm'> to</Text> {titleCase(to)}</Text>
            </View>
         {status === 'pending approval' &&
         <View className='flex flex-row  justify-center items-center bg-white/50  p-2 rounded-[12px]'>
         <Pressable onPress={()=>handleAction(itineraryId,'itinerary-approve')} className='mr-4'>
         <Image 
         source={green_tick_icon}
         className='w-8 h-8 rounded-full p-1'/> 
         </Pressable>
         <Pressable onPress={()=>handleAction(itineraryId, 'itinerary-reject')}>
         <Image 
         source={cancel_icon}
         className='w-6 h-6 rounded-full'/> 
         </Pressable>
</View> }
             
         </View>
          <View className='px-1  '>
          <View className='  flex justify-between  flex-row'>
            <Text className='flex-1   text-xs text-neutral-600 font-Cabin'>Date</Text>
            <Text className='flex-1  text-xs text-neutral-600 font-Cabin'>Preferred Time</Text>
            <Text className='flex-1 text-xs text-neutral-600 font-Cabin'>Class/Type</Text>
          </View>
          <View className='  text-sm  flex  flex-row '>
           <Text className='flex-1 text-sm font-semibold text-neutral-600 font-Cabin'>{date}</Text>
           <Text className='flex-1 text-sm font-semibold text-neutral-600 font-Cabin'>{time}</Text>
           <Text className='flex-1 text-sm font-semibold text-neutral-600 font-Cabin'>{travelClass}</Text>
          </View>
         </View>

         

          
        </View>
  )
}


function Hotel({status,handleAction,hotelClass,itineraryId,selectedIds,handleSelectedIds,index,
  location,
  checkIn,
  checkOut ,
  
 }){
  return(
    <View  key={index} className='bg-slate-50 rounded-[12px] px-2 py-2 w-full'>
          <View className='flex flex-row justify-between items-center'>
         
          <View className=''>
            <Text className=' px-1 text-xs text-neutral-600 font-Cabin'>Location</Text>
            <Text className='px-1 text-neutral-600 rounded-[12px] text-base font-Cabin'>{titleCase(location)}</Text>
            </View>
            {status === 'pending approval' &&
         <View className='flex flex-row  justify-center items-center bg-white/50  p-2 rounded-[12px]'>
         <Pressable onPress={()=>handleAction(itineraryId,'itinerary-approve')} className='mr-4'>
         <Image 
         source={green_tick_icon}
         className='w-8 h-8 rounded-full p-1'/> 
         </Pressable>
         <Pressable onPress={()=>handleAction(itineraryId, 'itinerary-reject')}>
         <Image 
         source={cancel_icon}
         className='w-6 h-6 rounded-full'/> 
         </Pressable>
</View> }  
           
         </View>
          <View className='px-1  '>
          <View className='  flex  flex-row '>
          
            <Text className='flex-1   text-xs text-neutral-600 font-Cabin'>Check-In</Text>
            <Text className='flex-1   text-xs text-neutral-600 font-Cabin'>Check-Out</Text>
            <Text className='flex-1   text-xs text-neutral-600 font-Cabin'>Class/Type</Text>
          </View>
          <View className='  text-sm  flex  flex-row '>
           <Text className='flex-1 text-sm font-semibold text-neutral-600 font-Cabin'>{checkIn}</Text>
           <Text className='flex-1 text-sm font-semibold text-neutral-600 font-Cabin'>{checkOut}</Text>
           <Text className='flex-1 text-sm font-semibold text-neutral-600 font-Cabin'>{hotelClass}</Text>
        
          </View>
         </View>

         

          
        </View>

  )
}



function Cab({status,handleAction,selectedIds,itineraryId,date, preferredTime, pickupAddress,dropAddress,handleSelectedIds,index}){
  return(
    <View  key={index} className='bg-slate-50 rounded-[12px] px-2 py-2 w-full'>
          <View className='flex flex-row justify-between items-center'>
          <View className=''>
            <Text className=' px-1 text-xs text-neutral-600 font-Cabin'>Date & Time</Text>
            <Text className='text-neutral-600 rounded-[12px] text-base font-Cabin'> {`${date} ${preferredTime}`}</Text>
          </View>
          {status === 'pending approval' &&
         <View className='flex flex-row  justify-center items-center bg-white/50  p-2 rounded-[12px]'>
         <Pressable onPress={()=>handleAction(itineraryId,'itinerary-approve')} className='mr-4'>
         <Image 
         source={green_tick_icon}
         className='w-8 h-8 rounded-full p-1'/> 
         </Pressable>
         <Pressable onPress={()=>handleAction(itineraryId, 'itinerary-reject')}>
         <Image 
         source={cancel_icon}
         className='w-6 h-6 rounded-full'/> 
         </Pressable>
</View> }
          
         </View>
          <View className='px-1  '>
          <View className='  flex  flex-row'>
          
            <Text className='flex-1 text-xs text-neutral-600 font-Cabin'>Pick-Up</Text>
            <Text className='flex-1 text-xs text-neutral-600 font-Cabin'>Drop-Off</Text>
            <Text className='flex-1 text-xs text-neutral-600 font-Cabin'>Class/Type</Text>
          </View>
          <View className='text-sm  flex  flex-row'>
           <Text className='flex-1 text-sm font-semibold text-neutral-600 font-Cabin'>{titleCase(pickupAddress)}</Text>
           <Text className='flex-1 text-sm font-semibold text-neutral-600 font-Cabin'>{titleCase(dropAddress)}  </Text>
           <Text className='flex-1 text-sm font-semibold text-neutral-600 font-Cabin'>{titleCase(dropAddress)}  </Text>
          </View>
         </View> 
        </View>

  )
}
