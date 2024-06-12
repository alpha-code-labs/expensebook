import React ,{useEffect, useLayoutEffect, useState}from 'react';
import { View,Text ,Image, Pressable, ScrollView ,ListItem ,List, FlatList} from 'react-native';
import { bell_icon, breifcase_icon, down_right_icon, list_icon, logout_icon, profile_icon, travel_c_icon } from '../../../../assets/icon';
import { transitTrip1, upcomingTrip1 } from '../../../dummyData/dashboard/trips';
import { getStatusClass, titleCase } from '../../../utils/handyFunctions';
import CancelButton from '../../../components/common/CancelButton';
import { useNavigation } from '@react-navigation/native';
import Menu from '../../../components/common/Menu';




const Overview = () => {

  const navigation = useNavigation();
  const [upcomingTrip, setUpcomingTrip]=useState(null);


  useEffect(()=>{
    const trip = upcomingTrip1
    setUpcomingTrip(trip)

  },[])

useLayoutEffect(()=>{
  navigation.setOptions({
    headerRight:()=>(
      <View className=' flex flex-row gap-4 items-center  justify-end  p-4 '>
      <Pressable onPress={()=>console.log('logout')}>
        <View className='bg-white p-2  shadow-xl shadow-neutral-800 rounded-md '>
        <Image source={logout_icon} alt='logout-icon ' className='w-6 h-6'/>
        </View>
      </Pressable>
    <Pressable>
    <View className='bg-white p-2  shadow-xl shadow-neutral-800 rounded-md'>
        <Image source={bell_icon} alt='bell-icon' className='w-6 h-6'/>
    </View>
    </Pressable>
    <Pressable onPress={() => navigation.navigate('Profile')}>
    <View className='bg-white p-2  shadow-xl shadow-neutral-800 rounded-md'>
        <Image source={profile_icon} alt='bell-icon' className='w-6 h-6'/>
    </View>
    </Pressable>
  </View>
    )
  })
})

 

  return (
    <View className='mt-8'>
        
      <ScrollView
      vertical
      pagingEnabled
      
      >
       <View className='flex flex-col justify-center items-center mx-4 '>
        <View className=' w-full h-[450px] mb-4'>
          <TransitTrip tripData={transitTrip1}/>
        </View>
        <View className='min-h-[450px] w-full mb-28'>
          <UpcomingTrip tripData={upcomingTrip}/>
        </View>
        
        </View>
    </ScrollView>
    



    </View>
  )
}

export default Overview



function UpcomingTrip({ tripData }) {
  const [trip, setTrip]=useState(tripData)
  const initialTabs = Array.from({ length: tripData&& tripData.length }, () => 'Trip');
  const [activeTabs, setActiveTabs] = useState(initialTabs);

  const handleTabChange = (index, tab) => {
    setActiveTabs((prevTabs) => {
      const newTabs = [...prevTabs];
      newTabs[index] = tab ;
      return newTabs;
    });
  };


 



  const renderTabContent = (index, item) => {
    
  
    switch (activeTabs[index]) {
      case 'Trip':
        return <TripContent index={index} itinerary={item.itinerary} tripPurpose={item.tripPurpose} />;
      case 'Cash Advance':
        return <CashAdvanceContent index={index} cash={item.cashAdvances} />;
      case 'Expense':
        return <ExpenseContent index={index} expense={item.travelExpenses} />;
      default:
        return <TripContent index={index} itinerary={item.itinerary} tripPurpose={item.tripPurpose}/>;
    }
  };
  

  return (
    <>
      <View className='bg-white  h-[450px] rounded-[8px] shadow-xl'>
        <View className='flex flex-row justify-between px-6 py-8'>
          <View className='flex flex-row gap-2 '>
            <Image source={breifcase_icon} alt='transit-icon' className='w-6 h-6' />
            <Text className='font-Cabin font-semibold text-base text-neutral-800 leading-normal'>Upcoming Trip</Text>
          </View>
        </View>
       

    <FlatList  

    data={tripData} 
    horizontal
    renderItem={({item, index})=>(
      <View key={index} className={`relative min-w-[327px] flex flex-col ${index==0? '' : 'ml-4'}`}>
      <View className='flex flex-row items-center justify-start text-center p-4 border-[1px] border-neutral-300  rounded-md shadow-xl'>
        {/* <View className='flex flex-row'> */}
          <Pressable
            className={`py-1 px-2 rounded-xl   ${activeTabs[index] === 'Trip' ? 'font-medium bg-indigo-600  text-white text-xs rounded-xl' : ''}`}
            onPress={() => handleTabChange(index, 'Trip')}
          >
            <Text className={`${activeTabs[index] === 'Trip' && 'font-medium bg-indigo-600 text-white text-xs'}`}>Trip </Text>
          </Pressable>
          <Pressable
            className={`py-1 px-2 rounded-xl    ${activeTabs[index] === 'Cash Advance' ? 'font-medium bg-indigo-600 text-white text-xs ' : ''}`}
            onPress={() => handleTabChange(index, 'Cash Advance')}
          >
            <Text className={`${activeTabs[index] === 'Cash Advance' && 'font-medium bg-indigo-600 text-white text-xs'}`}>
              {' '}
              Cash Advance{' '}
            </Text>
          </Pressable>
          {/* <Pressable
            className={`py-1 px-2 rounded-xl    ${activeTabs[index] === 'Expense' ? 'font-medium bg-indigo-600 text-white text-xs ' : ''}`}
            onPress={() => handleTabChange(index, 'Expense')}
          >
            <Text className={`${activeTabs[index] === 'Expense' && 'font-medium bg-indigo-600 text-white text-xs'}`}> Expense </Text>
          </Pressable> */}
        {/* </View> */}
        
      </View>
    


      <View>{renderTabContent(index ,item)}</View>
      <View className='absolute z-20 flex  w-full rounded-b-[12px] px-2 flex-row bottom-0 bg-white py-2' key={index}>
      <View className='w-[150px] flex-1 pr-2'> 
      <CancelButton onPress={()=>{console.log(item.tripId)}}  variant='fit' text='Raise Advance' text_color='text-indigo-600' />
      </View>
      
      
    </View>
    </View>)}

    />
 

    
         
      </View>
    </>
  );
}


function TransitTrip({ tripData }) {
  const navigation = useNavigation();
  const [trip, setTrip]=useState(tripData)
  const initialTabs = Array.from({ length: tripData&& tripData.length }, () => 'Trip');
  const [activeTabs, setActiveTabs] = useState(initialTabs);

  const handleTabChange = (index, tab) => {
    setActiveTabs((prevTabs) => {
      const newTabs = [...prevTabs];
      newTabs[index] = tab;
      return newTabs;
    });
  };



  const renderTabContent = (index, item) => {
    
   
    switch (activeTabs[index]) {
      case 'Trip':
        return <TripContent navigation={navigation}  index={index} itinerary={item.itinerary} tripPurpose={item.tripPurpose} />;
      case 'Cash Advance':
        return <CashAdvanceContent index={index} cash={item.cashAdvances} />;
      case 'Expense':
        return <ExpenseContent index={index} expense={item.travelExpenses} />;
      default:
        return <TripContent index={index} itinerary={item.itinerary} tripPurpose={item.tripPurpose}/>;
    }
  };
  

  return (
    <>
      <View className='bg-white  h-[450px] rounded-[8px] shadow-xl'>
        <View className='flex flex-row justify-between px-6 py-8'>
          <View className='flex flex-row gap-2 '>
            <Image source={breifcase_icon} alt='transit-icon' className='w-6 h-6' />
            <Text className='font-Cabin font-semibold text-base text-neutral-800 leading-normal'>Transit Trip</Text>
          </View>
        </View>
       

    <FlatList  
    nestedScrollEnabled
    data={tripData} 
    horizontal
    renderItem={({item, index})=>(
      <View key={index} className={`relative min-w-[327px] flex flex-col ${index==0? '' : 'ml-4'}`}>
      <View className='flex flex-row items-center justify-start text-center p-4 border-[1px] border-neutral-300  rounded-md shadow-xl'>
        {/* <View className='flex flex-row'> */}
          <Pressable
            className={`py-1 px-2 rounded-xl   ${activeTabs[index] === 'Trip' ? 'font-medium bg-indigo-600  text-white text-xs rounded-xl' : ''}`}
            onPress={() => handleTabChange(index, 'Trip')}
          >
            <Text className={`${activeTabs[index] === 'Trip' && 'font-medium bg-indigo-600 text-white text-xs'}`}>Trip </Text>
          </Pressable>
          <Pressable
            className={`py-1 px-2 rounded-xl    ${activeTabs[index] === 'Cash Advance' ? 'font-medium bg-indigo-600 text-white text-xs ' : ''}`}
            onPress={() => handleTabChange(index, 'Cash Advance')}
          >
            <Text className={`${activeTabs[index] === 'Cash Advance' && 'font-medium bg-indigo-600 text-white text-xs'}`}>
              {' '}
              Cash Advance{' '}
            </Text>
          </Pressable>
          <Pressable
            className={`py-1 px-2 rounded-xl    ${activeTabs[index] === 'Expense' ? 'font-medium bg-indigo-600 text-white text-xs ' : ''}`}
            onPress={() => handleTabChange(index, 'Expense')}
          >
            <Text className={`${activeTabs[index] === 'Expense' && 'font-medium bg-indigo-600 text-white text-xs'}`}> Expense </Text>
          </Pressable>
        {/* </View> */}
        
      </View>
     
      <View>
        {renderTabContent(index ,item)}
    </View>
   
    <View className='absolute z-20 flex  w-full rounded-b-[12px] px-2 flex-row bottom-0 bg-white py-2' key={index}>
      <View className='w-[135px] flex-1 mr-2'>
      <CancelButton onPress={()=>{console.log(item.tripId)}}  variant='fit' text='Raise Advance' text_color='text-indigo-600' />
      </View>
      <View className='w-[135px] flex-1'> 
      <CancelButton variant='fit' text='Book Expense' bg_color='bg-indigo-600'  />
      </View>
      
    </View>

    
      
    </View>)}

    />
 

    
         
      </View>
    </>
  );
}


const TripContent = ({navigation, itinerary, tripPurpose, index }) => {
  const menuOptions = [{
    title:'Cancel',
    navigate:'Cancel-Trip'
  },
{
  title:'Add a Leg',
  navigate:'Cancel-Trip'
}];


return(
  <View className='  px-2 flex flex-grow shrink w-[327px]   ' key={index}>
    {/* Content for the "Trip" tab */}
    <View className='flex flex-row  justify-between   py-2'>

    <Text className='text-neutral-700 text-base font-medium font-Cabin'>{tripPurpose}</Text>
    {/* <Pressable onPress={() => navigation.navigate('Cancel-Trip')}> */}
    {/* onOptionPress={(option)=>{console.log(option)}} */}
          <View>
          <Menu  options={menuOptions}  />
          </View>
   
    </View>

 
    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} className='min-w-full mt-1  rounded-[12px] mb-44'> 
       <View className='flex '>  
       {['flights', 'trains', 'buses', 'cabs', 'hotels'].map((itnItem, itnItemIndex)=>{
      if(itinerary && itinerary[itnItem]){
        return (
          <View className='' key={itnItemIndex}>
        <Text  className='text-xl text-neutral-700'>{titleCase(itnItem || "")} </Text>
        <View className='py-2'>
        <FlatList 
        nestedScrollEnabled
  data={itinerary && itinerary[itnItem]}
  renderItem={({ item: flatListItem, index: flatItemIndex }) => { 
    if(['flights', 'trains', 'buses'].includes(itnItem)){
      return (
        <View key={flatItemIndex}>
          <Flight
            index={flatItemIndex}
            from={flatListItem.bkd_from ?? ""}
            to={flatListItem.bkd_to ?? ""}
            date={flatListItem.date ?? ""}
            time={flatListItem.time ?? ""}
            itineraryId={flatListItem.itineraryId ?? ""}
            status={flatListItem?.status ?? ""}
          />
        </View>
      )
    } else if(itnItem == 'cabs'){
      return (
        <View key={flatItemIndex}>
          <Cab
            index={flatItemIndex}
            itineraryId={flatListItem?.itineraryId}
            date={flatListItem?.bkd_date}
            preferredTime={flatListItem?.bkd_preferredTime}
            pickupAddress={flatListItem?.bkd_pickupAddress ?? ""}
            dropAddress={flatListItem?.bkd_dropAddress ?? ""}
            status={flatListItem?.status ?? ""}
          />
        </View>
      )
    } else if(itnItem === 'hotels'){
      return (
        <View key={flatItemIndex}>
          <Hotel 
            index={flatItemIndex}
            itineraryId={flatListItem.itineraryId}
            location={flatListItem.bkd_location ?? ""}
            checkIn={flatListItem.bkd_checkIn ?? ""}
            checkOut={flatListItem.bkd_checkOut ?? ""}
            status={flatListItem?.status ?? ""}
          />
        </View>
      )
    }
  }}
/>

          </View>
        </View>

        )
      }
       
       })}  
       
       
       
        </View> 
       
      
    </ScrollView>
     
  </View>
);}


const CashAdvanceContent = ({ cash, index }) => (
  <View className='bg-white mb-16 ' key={index}>


    <FlatList showsVerticalScrollIndicator={false} nestedScrollEnabled  data={cash} renderItem={({ item, index }) => (
      
          <View key={index}  className='flex flex-row justify-between  px-4 py-2 h-[150px] border-b-[1px] border-neutral-300 rounded-[8px]'>
          <View className='relative flex flex-1 min-w-[100px] flex-grow  flex-col justify-between items-start'>

          <Text className='font-Cabin text-neutral-700 text-base font-semibold'>{item?.cashAdvanceNumber ?? ''}</Text>

          <View className='absolute top-8'>
              <Text className='font-Cabin font-semibold'>
                Currency Details:
              </Text>
              {item?.amountDetails.map((amtItm, amtIndex)=>(
                <>
                <View key={amtIndex} className='flex flex-row '>
                  <Text className='font-Cabin text-[14px] font-bold text-neutral-500'>{amtItm.currency}</Text>
                  <Text className='font-Cabin text-[14px] font-bold text-neutral-500'>{amtItm.amount}</Text>
                </View>
                </>
                
              ))}
          </View> 
          
          </View>

          <View className='flex flex-1 flex-col justify-between items-end'>
            
              <Pressable onPress={() => console.log(`hello ${index}`,)} className='flex-1'>
              <Image source={list_icon} alt='menu-icon' className='w-6 h-6' />
              </Pressable> 
            <View className='flex-1 items-center '>
              <View className={`${getStatusClass(item?.cashAdvanceStatus)} w-fit px-2 py-1 rounded-[12px] mt-5`}>
              <Text style={{fontFamily: 'Cabin'}} className={`${getStatusClass(item?.cashAdvanceStatus)} text-xs`}>
                {titleCase(item?.cashAdvanceStatus ?? "")}
              </Text>
              </View>
              </View>
          </View>
          
          
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
    
  </View>
);


const ExpenseContent = ({ expense, index }) => (
  <View className='bg-white mb-16 mx-2' key={index}>

    <FlatList nestedScrollEnabled showsVerticalScrollIndicator={false} data={expense} renderItem={({ item, index }) => (
      
      <View key={index}  className='border h-[48px] rounded-[12px] flex flex-row justify-between items-center px-4 py-2 my-2' >
        <View className='flex flex-row items-center'>
       <Image source={down_right_icon} alt='right-arrow-icon' className='w-8 h-8' />
       <Text className='font-Cabin text-neutral-600 text-base font-semibold'>{item.expenseHeaderNumber}</Text>
       </View>
       <Pressable onPress={() => console.log(`hello ${index}`,)}>
          <Image source={list_icon} alt='menu-icon' className='w-6 h-6' />
        </Pressable>
     </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
    
  </View>
);


function Flight({ from , to , itineraryId , date , time ,index,status}){
  return(
    <View  key={index} className='bg-slate-100 rounded-[12px] px-2 py-2 w-full'>
          <View className='relative flex flex-row justify-between items-center '>
            <View className='w-full'>
            <Text className=' px-1 text-xs text-neutral-600 font-Cabin'>Destination</Text>
            <Text className='text-neutral-600 rounded-[12px] text-base font-Cabin'> {titleCase(from)} <Text className=' text-neutral-500 text-sm'> to</Text> {titleCase(to)}</Text>
            </View>
           
              <View className={` ${getStatusClass(status)} w-fit px-2 py-1 rounded-[12px]  absolute  right-0`}>
              <Text style={{fontFamily: 'Cabin'}} className={`${getStatusClass(status)} text-xs`}>
                {titleCase(status) ?? ""}
              </Text>
              </View>
             
             
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


function Hotel({itineraryId,index,status,
  location,
  checkIn,
  checkOut}){
  return(
    <View  key={index} className='bg-slate-100 rounded-[12px] px-2 py-2 w-full'>
          <View className='flex flex-row justify-between items-center relative'>
         
          <View className=''>
            <Text className=' px-1 text-xs text-neutral-600 font-Cabin'>Location</Text>
            <Text className='px-1 text-neutral-600 rounded-[12px] text-base font-Cabin'>{titleCase(location)}</Text>
            </View>
         
          
            <View className={` ${getStatusClass(status)} w-fit px-2 py-1 rounded-[12px]  absolute  right-0`}>
              <Text style={{fontFamily: 'Cabin'}} className={`${getStatusClass(status)} text-xs`}>
                {titleCase(status) ?? ""}
              </Text>
              </View>
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



function Cab({itineraryId,date, preferredTime, pickupAddress,dropAddress,index ,status}){
  return(
    <View  key={index} className='bg-slate-100 rounded-[12px] px-2 py-2  w-full'>
          <View className='flex flex-row justify-between items-center relative'>
         
              <View className=''>
                <Text className=' px-1 text-xs text-neutral-600 font-Cabin'>Date & Time</Text>
                <Text className='text-neutral-600 rounded-[12px] text-base font-Cabin'> {`${date} ${preferredTime}`}</Text>
              </View>
         
              <View className={` ${getStatusClass(status)} w-fit px-2 py-1 rounded-[12px]  absolute  right-0`}>
              <Text style={{fontFamily: 'Cabin'}} className={`${getStatusClass(status)} text-xs`}>
                {titleCase(status) ?? ""}
              </Text>
              </View>
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











