import React from 'react'
import { Text, FlatList, View } from 'react-native'
import { getStatusClass } from '../../../utils/handyFunctions'

const CashAdvance = ( {cash}) => {


  return (
    <View >
    <FlatList 
      
      data={cash}

      renderItem={({ item, index }) => (
      
          <View key={index}  className='w-full px-4 py-2 h-[150px] border-b-[1px] border-neutral-300 rounded-[8px]'>
            <View>
            <Text>{item?.cashAdvanceNumber ?? ''}</Text>
          <View className={`${getStatusClass(item?.cashAdvanceStatus)} w-fit`}>
          <Text >
            {item?.cashAdvanceStatus ?? ""}
          </Text>
          </View>
            </View>
          
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
    </View>
  )
}
export default CashAdvance


// const CashAdvanceContent = ({ cash, index }) => (
//     <View className='bg-white ' key={index}>
//       <Text>
//         Cash sdfa
//         {console.log('datajcash', cash)}
//       </Text>
  
  
    
//    <ScrollView  className='bg-black'>
//     <View >
//       <FlatList 
        
//         data={cash}
  
//         renderItem={({ item, index }) => (
        
//             <View key={index}  className='w-full px-4 py-2 h-[150px] border-b-[1px] border-neutral-300 rounded-[8px]'>
//               <View>
//               <Text>{item?.cashAdvanceNumber ?? ''}</Text>
//             <View className={`${getStatusClass(item?.cashAdvanceStatus)} w-fit`}>
//             <Text >
//               {item?.cashAdvanceStatus ?? ""}
//             </Text>
//             </View>
//               </View>
            
//           </View>
//         )}
//         keyExtractor={(item, index) => index.toString()}
//       />
//       </View>
//    </ScrollView>   
//     </View>
//   );