import React ,{useState}from 'react'
import { View,Text ,Image, Pressable} from 'react-native'
import { bell_icon, list_icon, logout_icon, travel_c_icon } from '../../../../assets/icon'
import { upcomingTrip1 } from '../../../dummyData/dashboard/trips'




const Overview = () => {


  






  return (
    <View className=''>
        
        <View className=' flex flex-row gap-4 items-center justify-end px-4 py-4'>
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
        </View>

       <View className='top-6 flex flex-col justify-center items-center mx-4 border '>
        <View className='h-[450px] w-full  border mb-4'>
          <TransitTrip />
        </View>
        <View className='h-[450px] w-full  border'>
          {/* <UpcomingTrip/> */}
        </View>
        
        </View>


    </View>
  )
}

export default Overview



// function UpcomingTrip({ tripData }) {

//   const initialTabs = Array.from({ length: tripData.length }, () => 'Trip');
//   const [activeTab, setActiveTab] = useState(initialTabs);

//   const handleTabChange = (index, tab) => {
//     setActiveTab((prevTabs) => {
//       const newTabs = [...prevTabs];
//       newTabs[index] = tab;
//       return newTabs;
//     });
//   };
//   // Conditionally render content based on activeTab
//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'Trip':
//         return <TripContent />;
//       case 'Cash Advance':
//         return <CashAdvanceContent />;
//       case 'Expense':
//         return <ExpenseContent />;
//       default:
//         return null;
//     }
//   };

//   return (

//     <View className='bg-white'>
//       <View className='flex flex-row justify-between px-6 py-8'>
//         <View className='flex flex-row gap-2 '>
//           <Image source={travel_c_icon} alt='transit-icon' className='w-6 h-6' />
//           <Text className='font-semibold text-base text-neutral-800 leading-normal'>Transit Trip</Text>
//         </View>

//         <Pressable onPress={() => console.log('open menu')}>
//           <Image source={list_icon} alt='menu-icon' className='w-6 h-6' />
//         </Pressable>
//       </View>

//       <View className='flex flex-row items-center justify-start text-center p-4'>
//         <Pressable
//           className={`py-1 px-2 rounded-xl   ${activeTab === 'Trip' ? 'font-medium bg-indigo-600  text-white text-xs rounded-xl' : ''}`}
//           onPress={() => handleTabChange('Trip')}
//         >
//           <Text className={`${activeTab === 'Trip' && 'font-medium bg-indigo-600 text-white text-xs'}`}>Trip </Text>
//         </Pressable>
//         <Pressable
//           className={`py-1 px-2 rounded-xl    ${activeTab === 'Cash Advance' ? 'font-medium bg-indigo-600 text-white text-xs ' : ''}`}
//           onPress={() => handleTabChange('Cash Advance')}
//         >
//           <Text className={`${activeTab === 'Cash Advance' && 'font-medium bg-indigo-600 text-white text-xs'}`}>
//             {' '}
//             Cash Advance{' '}
//           </Text>
//         </Pressable>
//         <Pressable
//           className={`py-1 px-2 rounded-xl    ${activeTab === 'Expense' ? 'font-medium bg-indigo-600 text-white text-xs ' : ''}`}
//           onPress={() => handleTabChange('Expense')}
//         >
//           <Text className={`${activeTab === 'Expense' && 'font-medium bg-indigo-600 text-white text-xs'}`}> Expense </Text>
//         </Pressable>
//       </View>

//       {/* Render the content based on the active tab */}
//       <View>{renderTabContent()}</View>
      
//     </View>
//   );
// }

// function TransitTrip({activeTab,handleTabChange}){

  
//   return(
//     <View className='bg-white'>
//       <View className='flex flex-row justify-between px-6 py-8'>
//         <View className='flex flex-row gap-2 '>
//           <Image source={travel_c_icon} alt='transit-icon' className='w-6 h-6' />
//           <Text className='font- font-semibold text-base text-neutral-800 leading-normal'>Transit Trip</Text>
//         </View>
        
//        <Pressable onPress={()=>console.log('open menu')}>
//         <Image source={list_icon} alt='menu-icon' className='w-6 h-6'/>
//       </Pressable>
//       </View>

//       <View className='flex flex-row items-center justify-start text-center p-4'>
//             <Pressable className={`py-1 px-2 rounded-xl   ${activeTab==="Trip" ? ' font-medium bg-indigo-600  text-white text-xs rounded-xl':""}`} onPress={()=>handleTabChange("Trip")}>
//              <Text className={`${activeTab==="Trip" && 'font-medium bg-indigo-600 text-white text-xs'}`}>Trip </Text> 
//             </Pressable>
//             <Pressable className={`py-1 px-2 rounded-xl    ${activeTab==="Cash Advance" ? 'font-medium bg-indigo-600 text-white text-xs ': ""}`} onPress={()=> handleTabChange("Cash Advance" )}>
//             <Text className={`${activeTab==="Cash Advance" && 'font-medium bg-indigo-600 text-white text-xs'}`}> Cash Advance </Text> 
//             </Pressable>  
//             <Pressable className={`py-1 px-2 rounded-xl    ${activeTab==="Expense" ? 'font-medium bg-indigo-600 text-white text-xs ': ""}`} onPress={()=> handleTabChange("Expense" )}>
//             <Text className={`${activeTab==="Expense" && 'font-medium bg-indigo-600 text-white text-xs'}`}> Expense </Text> 
//             </Pressable>  
//       </View>




//     </View>
//   )

// }




function TransitTrip({}){

  return(
    <View >
      <Text> Upcoming Trip</Text>
    </View>
  )
}




const TripContent = () => (
  <View className='bg-white px-6 w-full border'>
    {/* Content for the "Trip" tab */}
    <Text className='text-black'>Business Trip for Investores Meeting</Text>
  </View>
);

const CashAdvanceContent = () => (
  <View className='bg-white'>
    {/* Content for the "Cash Advance" tab */}
    <Text className='text-black'>hello cash</Text>
  </View>
);

const ExpenseContent = () => (
  <View className='bg-white'>
    {/* Content for the "Expense" tab */}
    <Text className='text-black'>hello expense</Text>
  </View>
);