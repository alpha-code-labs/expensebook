import React, { useState ,useEffect} from 'react';
import { useData } from '../api/DataProvider';
import { getStatusClass ,titleCase} from '../utils/handyFunctions';
import { Alltrips } from '../components/trips/Alltrips';
import { receipt, chevron_down, calender, double_arrow , three_dot ,validation_sym, down_left_arrow, money} from '../assets/icon';
import Dropdown from '../components/common/Dropdown';
import RejectedCA from '../components/cashAdvance/RejectedCA';
import { useParams } from 'react-router-dom';
import Error from '../components/common/Error';
// import CashAdvance from '../components/settlement/CashAdvance';

const CashAdvance = ({isLoading ,fetchData,loadingErrMsg}) => {  
  const {tenantId,empId,page}= useParams();
  useEffect(()=>{

    fetchData(tenantId,empId,page)

  },[])
  const { employeeData } = useData();

  const [cashAdvanceData,setCashAdvanceData]=useState(null)

  useEffect(()=>{
    const cashAdvances = employeeData && employeeData?.dashboardViews?.employee

    
    setCashAdvanceData(cashAdvances)
  },[employeeData])
  console.log('cashdata from cashadvance',cashAdvanceData?.rejectedCashAdvances)

 

    const cashAdvanceData1 = [
      
     
        {
          travelRequestId: "TRAM00000002",
          cashAdvanceId: '#CA0005',
          cashAdvanceNumber: 'CAnumber57',
          rejectionReason: 'Insufficient documentation',
          amountDetails: [
            {
              amount: '250.50',
              currencyType: 'USD',
            },
            {
              amount: '15000.25',
              currencyType: 'INR',
            },
            {
              amount: '12000.00',
              currencyType: 'INR',
            },
          ],
          date: '10-Mar-2024',
          violation: 'missing receipts',
          status: 'rejected',
        },
        {
          travelRequestId: "TRAM00000003",
          cashAdvanceId: '#CA0006',
          cashAdvanceNumber: 'CAnumber58',
          rejectionReason: 'Invalid destination',
          amountDetails: [
            {
              amount: '300.00',
              currencyType: 'USD',
            },
            {
              amount: '18000.75',
              currencyType: 'INR',
            },
            {
              amount: '22000.00',
              currencyType: 'INR',
            },
          ],
          date: '15-Apr-2024',
          violation: 'unapproved location',
          status: 'rejected',
        },
        {
          travelRequestId: "TRAM00000003",
          cashAdvanceId: '#CA0006',
          cashAdvanceNumber: 'CAnumber58',
          rejectionReason: 'Invalid destination',
          amountDetails: [
            {
              amount: '300.00',
              currencyType: 'USD',
            },
            {
              amount: '18000.75',
              currencyType: 'INR',
            },
            {
              amount: '22000.00',
              currencyType: 'INR',
            },
          ],
          date: '15-Apr-2024',
          violation: 'unapproved location',
          status: 'rejected',
        },
        {
          travelRequestId: "TRAM00000003",
          cashAdvanceId: '#CA0006',
          cashAdvanceNumber: 'CAnumber58',
          rejectionReason: 'Invalid destination',
          amountDetails: [
            {
              amount: '300.00',
              currencyType: 'USD',
            },
            {
              amount: '18000.75',
              currencyType: 'INR',
            },
            {
              amount: '22000.00',
              currencyType: 'INR',
            },
          ],
          date: '15-Apr-2024',
          violation: 'unapproved location',
          status: 'rejected',
        },
        {
          travelRequestId: "TRAM00000003",
          cashAdvanceId: '#CA0006',
          cashAdvanceNumber: 'CAnumber58',
          rejectionReason: 'Invalid destination',
          amountDetails: [
            {
              amount: '300.00',
              currencyType: 'USD',
            },
            {
              amount: '18000.75',
              currencyType: 'INR',
            },
            {
              amount: '22000.00',
              currencyType: 'INR',
            },
          ],
          date: '15-Apr-2024',
          violation: 'unapproved location',
          status: 'rejected',
        },
        {
          travelRequestId: "TRAM00000003",
          cashAdvanceId: '#CA0006',
          cashAdvanceNumber: 'CAnumber58',
          rejectionReason: 'Invalid destination',
          amountDetails: [
            {
              amount: '300.00',
              currencyType: 'USD',
            },
            {
              amount: '18000.75',
              currencyType: 'INR',
            },
            {
              amount: '22000.00',
              currencyType: 'INR',
            },
          ],
          date: '15-Apr-2024',
          violation: 'unapproved location',
          status: 'rejected',
        },
        {
          travelRequestId: "TRAM00000003",
          cashAdvanceId: '#CA0006',
          cashAdvanceNumber: 'CAnumber58',
          rejectionReason: 'Invalid destination',
          amountDetails: [
            {
              amount: '300.00',
              currencyType: 'USD',
            },
            {
              amount: '18000.75',
              currencyType: 'INR',
            },
            {
              amount: '22000.00',
              currencyType: 'INR',
            },
          ],
          date: '15-Apr-2024',
          violation: 'unapproved location',
          status: 'rejected',
        },
        {
          travelRequestId: "TRAM00000004",
          cashAdvanceId: '#CA0007',
          cashAdvanceNumber: 'CAnumber59',
          rejectionReason: 'Travel dates overlap with holidays',
          amountDetails: [
            {
              amount: '400.25',
              currencyType: 'USD',
            },
            {
              amount: '22000.50',
              currencyType: 'INR',
            },
            {
              amount: '18000.00',
              currencyType: 'INR',
            },
          ],
          date: '20-May-2024',
          violation: 'conflicting schedule',
          status: 'rejected',
        },
        {
          travelRequestId: "TRAM00000005",
          cashAdvanceId: '#CA0008',
          cashAdvanceNumber: 'CAnumber60',
          rejectionReason: 'Incomplete travel itinerary',
          amountDetails: [
            {
              amount: '150.75',
              currencyType: 'USD',
            },
            {
              amount: '12000.00',
              currencyType: 'INR',
            },
            {
              amount: '15000.00',
              currencyType: 'INR',
            },
          ],
          date: '25-Jun-2024',
          violation: 'missing return details',
          status: 'rejected',
        },
        {
          travelRequestId: "TRAM00000006",
          cashAdvanceId: '#CA0009',
          cashAdvanceNumber: 'CAnumber61',
          rejectionReason: 'Exceeds maximum duration',
          amountDetails: [
            {
              amount: '600.50',
              currencyType: 'USD',
            },
            {
              amount: '25000.00',
              currencyType: 'INR',
            },
            {
              amount: '20000.00',
              currencyType: 'INR',
            },
          ],
          date: '30-Jul-2024',
          violation: 'extended trip duration',
          status: 'rejected',
        },
      ];
      
    


    // const rejectedRequests = tripArray.filter((trip) => {
    //   return trip.cashAdvance.some((ca) => ca.status === 'rejected');
    // });
    
    


    
  return (
    <>
     {isLoading && <Error message={loadingErrMsg}/>}
 
 {!isLoading && 
      
      <div className="w-auto min-h-screen  flex flex-col items-center px-2 lg:px-10 xl:px-20  pt-[50px] bg-slate-100   ">
        {/* <div className='relative w-fit mb-2 border border-indigo-600 px-2 py-2'>
       {cashAdvanceData?.rejectedCashAdvances?.length > 0 &&  <div className=' absolute right-0  top-[-8px] w-fit p-[6px] bg-green-200 border border-white-100 rounded-full '/>}
        <div className={`cursor-pointer py-1 px-2 w-fit min-w-[100px]  font-medium rounded-xl bg-purple-500 text-xs text-gray-900 truncate`}
                  // onClick={() => handleScreenChange('Rejected Cash Advances')}
                >
                Rejected Cash Advances
        </div>
        </div> */}
        
          <div className="w-full  bg-white-100  h-auto lg:h-[581px] rounded-lg border-[1px] border-slate-300 shrink-0 font-cabin mt-3 sm:mt-[60px] ">          
           <>
           <div className="w-auto h-6 flex flex-row gap-3 sm:px-8 px-4 mt-7 items-center ">
      <img className="w-6 h-6" src={money} alt="receipt" />
      <div className="text-base tracking-[0.02em] font-bold w-auto">Rejected Cash Advances</div>
    </div>
    <div className="box-border mx-4  mt-[46px] w-auto    border-[1px]  border-b-gray "/>
    <div className='h-[420px] overflow-auto mt-6 w-auto flex flex-col items-center mx-8'>  
           <RejectedCA rejectedCashAdvance={cashAdvanceData?.rejectedCashAdvances}/>
           </div>
          </>          
        </div>
       
        </div>}
    </>
  );
};

export default CashAdvance;




// {activeScreen=== 'All Travel Request' && 
// <>
// <div className='flex flex-row justify-between items-end px-8'>
// <div className="w-full lg:w-[200px] h-6 flex flex-row gap-3 mt-7 items-center">
// <img className="w-6 h-6" src={receipt} alt="receipt" />
// <div className="text-base tracking-[0.02em] font-bold">All Travel Request</div>
// </div>

// {/* <div className='lg:ml-4 mt-4 lg:mt-0'>
// <div className='inline-flex h-8 w-auto  items-center justify-center bg-black text-white-100 flex-shrink rounded-lg'>
// <div className='text-center p-4 font-medium text-xs font-cabin' onClick={()=>(console.log("Add Travel Request"))}>Add Travel Request</div>
// </div>
// </div> */}
// </div>           
//  <div className="w-auto max-w-[100px] sm:max-w-[250px] flex flex-col sm:flex-row items-center sm:items-center justify-start gap-[8px] text-left text-neutral-800 mt-[25px] mx-11">
//    <div className="relative font-medium">Select Status</div>
//    <div className="relative w-[93px] h-8 text-sm text-black">
//      <div className="absolute top-[-5px] left-[0px] rounded-md bg-white box-border w-[93px] h-8">
//        <Dropdown name="months" options={months} icon={chevron_down} />
//      </div>
//    </div>
//  </div>

 
// <div className="box-border mx-4 mt-[46px] w-auto max-w-[932px]  h-px border-t-[1px]  border-b-gray "/>
// {/* //data div */}
// <div className='h-[360px]  overflow-y-auto overflow-x-hidden mt-6'>
//  {tripArray.map((travelDetails ,index)=>(
//    <>
//  <div className="box w-auto  max-w-[896px]  h-auto  mx-2 sm:mx-4 mb-2  font-cabin">

//  <div className='w-auto  max-w-[932px]  rounded-md'>
// <div className="w-auto  max-w-[900px] bg-white-100 h-auto max-h-[200px] lg:h-[52px] flex flex-col lg:flex-row items-start lg:items-center justify:start lg:justify-center border-b-[1px] m-2 border-b-gray">    
// <div className='flex  flex-row w-full  gap-2'>
// <div className='flex flex-col md:flex-row '>

// {/* Trip Id */}
// <div className="flex w-auto lg:w-[80px] h-auto md:h-[52px] items-center justify-start min-w-[60px]   py-0 md:py-3 px-2 order-1 gap-2">

// <div className=" text-[16px] md:text-[12px] text-left font-medium tracking-[0.03em] leading-normal text-neutral-800 font-cabin lg:truncate">
// #{travelDetails.trId}
// </div>
// </div> 
// {/* Trip Title */}
// <div className="group flex h-[52px] relative   items-center justify-start [210px]  xl:w-[200px] lg:[100px] py-0 md:py-3 px-2 order-1 gap-2">
// <div className="md:text-[14px]  w-auto xl:w-auto lg:w-[100px] md:w-[200px] text-[16px] text-left font-medium tracking-[0.03em] leading-normal text-neutral-800 font-cabin lg:truncate md:truncate  ">
// {travelDetails.travelName}
// <span className="hidden md:group-hover:block top-[-6px] left-[20%] absolute z-10 bg-gray-200 shadow-sm font-cabin  text-black text-center py-2 px-4 rounded h-8  w-auto  ">
// {travelDetails.travelName}
// </span>
// </div>


// </div> 


// {/* Date */}
// <div className="flex   h-[52px] w-auto xl:w-[150px]  xl:min-w-[210px]  items-center justify-start py-0 md:py-3 gap-1 px-0 lg:px-2 order-3 lg:order-2">
// <div className='pl-2 md:pl-0'>
// <img src={calender} alt="calendar" className="w-[16px]"/>
// </div>
// <div className=" tracking-[0.03em] leading-normal text-neutral-800 text-[12px]">

// {travelDetails.departureDate} to {travelDetails.returnDate}
// </div>
// </div>

// {/* Origin and Destination */}
// <div className="flex w-auto flex-col justify-center items-start lg:items-center min-w-[130px] h-auto md:h-[52px]  py-0 md:py-3 px-2 order-2 lg:order-3">
// <div className="flex w-[130px] xl:w-auto xl:min-w-[130px] text-xs text-neutral-800 font-medium truncate">
// <div>{travelDetails.to}</div>
// <img src={double_arrow} alt="double arrow"/>
// <div>{travelDetails.from}</div>
// </div>
// </div>
// </div>
// <div className='flex flex-1  items-end md:items-center justify-around    flex-col-reverse md:flex-row gap-2'>
// {/* Status */}

// <div className="flex  h-[52px] px-2 py-3 items-center justify-center  w-[100px]">

// <div className={`flex text-center px-2 justify-center  pt-[6px] w-[100px] pb-2 py-3 rounded-[12px] text-[14px]  truncate font-medium tracking-[0.03em] ${
// getStatusClass(travelDetails.status)
// }`}
// >
// {titleCase(travelDetails.status)}

// </div>

// </div>

// <div className="rounded-[32px] w-auto box-border h-[33px] flex flex-row items-center justify-center py-4 px-2 cursor-pointer border-[1px] border-solid border-purple-500">
// <div className="font-semibold text-[12px] min-w-[72px] truncate xl:w-auto  lg:truncate lg:w-[72px]  h-[17px] text-purple-500 text-center">Request Advance</div>
// </div>
// </div>


// </div>
// </div>
// </div>

// </div>
//    </>
//  ))}
// </div>
// </>}