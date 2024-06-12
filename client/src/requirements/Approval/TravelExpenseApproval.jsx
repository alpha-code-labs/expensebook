import React, { useState, useEffect } from 'react';
import { View,Text } from 'react-native';
import { expenseDataForApproval } from '../../dummyData/approval';
import { getTravelExpenseDataApi } from '../../utils/api/approvalApi';
import Error from '../../components/common/Error';
import { titleCase } from '../../utils/handyFunctions';




const TravelExpenseApproval = () => {

  const [travelExpenseData , setTravelExpenseData]=useState(null);
  const [alreadyBookedExpense, setAlreadyBookedExpense]=useState(null);
  const [lineItems, setLineItems]= useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [loadingErrMsg, setLoadingErrMsg] = useState(null);
  const [isUploading  , setIsUploading]=useState(false);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const { data } = await getTravelExpenseDataApi();
  //       setTravelExpenseData(data);
  //         console.log('travel data for approval fetched.');
  //       setIsLoading(false);
  //       console.log(data)
  //     } catch (error) {
  //       console.error('Error in fetching travel data for approval:', error.message);
  //       setLoadingErrMsg(error.message);
  //       setTimeout(() => {setLoadingErrMsg(null);setIsLoading(false)},5000);
  //     }
  //   };

  //   fetchData(); 

  // }, []);


  useEffect(()=>{
    setTravelExpenseData(expenseDataForApproval) 
  },[])

  useEffect(()=>{
    setAlreadyBookedExpense(travelExpenseData?.alreadyBookedExpenseLines)
    setLineItems(travelExpenseData?.expenseLines)
  },[travelExpenseData])


  console.log('alreadyBooked amount' , lineItems && lineItems)

  ///for  already booked expenses start
  const categories = ['flights', 'cabs', 'hotels', 'trains', 'buses'];
  let totalAllCategories = 0;

  const calculateTotalAmount = (category)=>{
    if(alreadyBookedExpense[category]){
      totolAmount = alreadyBookedExpense[category].reduce(
        (accumlator , item)=> accumlator + parseFloat(item.amount),0 );
        return totolAmount.toFixed(2)
    }
    return "00.00";
  }

  // for already booked expense ended


  const [groupedExpenses, setGroupedExpenses] = useState({});

  // Group expenses by category and calculate the total amount for each category
  const groupExpenses = () => {
    const grouped = lineItems && lineItems.reduce((accumulator, expense) => {
      const { categoryName, 'Total Amount': totalAmount, 'Total Fair': totalFair } = expense;

      // Use a generic property name ('total') to store the total amount
      const total = parseFloat(totalAmount) || parseFloat(totalFair) || 0;

      if (!accumulator[categoryName]) {
        accumulator[categoryName] = {
          categoryName,
          totalAmount: total,
        };
      } else {
        accumulator[categoryName].totalAmount += total;
      }

      return accumulator;
    }, {});

    setGroupedExpenses(grouped);
  };

  //Call groupExpenses when the component mounts
  useEffect(() => {
   lineItems &&  groupExpenses();
  }, [lineItems]);

  
  return (
    <>
 {isLoading && <Error loadingErrMsg={loadingErrMsg}/>}
 { !isLoading &&  <View className='w-full'>
        <View className='h-1/4  p-2'>
          <View className=' bg-indigo-100 h-full py-2 px-2'>
          <Text numberOfLines={1} ellipsizeMode="tail" className='text-indigo-600 w-auto font-Cabin text-xl font-semibold tracking-normal truncate'>{titleCase(travelExpenseData?.tripPurpose)}</Text>

          <View className='py-2'>
  <Text className='text-Cabin text-medium text-neutral-600'>{`Requested By                 - ${travelExpenseData?.createdBy?.name}`}</Text>
  <Text className='text-Cabin text-medium text-neutral-600'>{`Trip Number                   - ${travelExpenseData?.tripNumber}`}</Text>
  <Text className='text-Cabin text-medium text-neutral-600'>{`Expense Number          - ${travelExpenseData?.expenseHeaderNumber}`}</Text>
</View>

         
          <View className='h-8 flex text-start justify-center bg-indigo-600 rounded-md'>
          <Text className='px-2 font-Inter font-semibold text-white  '>Total Cash-Advance  - {travelExpenseData?.expenseAmountStatus?.totalCashAmount?.toFixed(2)}</Text>
          </View>
          </View>
          
         
        </View>
        <View className='h-3/4 border'>
          <View>
            <View className='p-2 border-[1px] border-neutral-300 bg-slate-100'>
            <Text className='text-Inter text-lg font-semibold text-neutral-600'>
              Already Booked Expense
            </Text>
            </View>
            <View className=' '>

    <View>
      {alreadyBookedExpense && categories.map((category) => {
        const totalAmount = calculateTotalAmount(category);
       
        if (parseFloat(totalAmount) > 0) {
          totalAllCategories += parseFloat(totalAmount);
          return (
            <View key={category} className="p-2 border-b-[1px] border-neutral-300">
              <Text className="text-lg text-Inter font-semibold mb-1 text-neutral-800">{titleCase(category)}</Text>
              <Text className="text-base text-neutral-600 ">{`$${totalAmount}`}</Text>
            </View>
          );
        }
        return null;
      })}
      
      {totalAllCategories > 0 && (
        <View className="px-4 py-2 border-b-[1px] border-neutral-300 flex flex-row justify-between items-center bg-slate-100">
          <Text className="text-lg text-Inter font-semibold mb-1">Total Amount</Text>
          <Text className="text-base text-gray-600 font-medium pl-4">{`${totalAllCategories.toFixed(2)}`}</Text>
        </View>
      )} 
    </View> 
    <View>
      {Object.values(groupedExpenses).map((category) => (
        <View key={category.categoryName} style="p-2 border-b">
          <Text className="text-lg font-semibold mb-1">{category.categoryName}</Text>
          <Text className="text-base">{`Total Amount: ${category.totalAmount.toFixed(2)}`}</Text>
        </View>
      ))}
    </View>        
          </View>
          </View>

        </View>
    </View>}
    </>
  )
}

export default TravelExpenseApproval
