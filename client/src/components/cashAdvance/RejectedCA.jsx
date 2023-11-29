import React, { useState } from 'react';
import { getStatusClass ,titleCase} from '../../utils/handyFunctions';
import { receipt, chevron_down, calender, double_arrow , three_dot ,validation_sym, down_left_arrow} from '../../assets/icon';
import Dropdown from '../common/Dropdown';



const RejectedTravel = () => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];


 



  const dataArray = [
    {
      trId: 'TR00001',
      cashAdvance: [
        {
          caId: '#CA0001',
          details: [
            {
              amount: '180.75',
              currencyType: 'USD',
            },
            {
              amount: '20000.75',
              currencyType: 'INR',
            },
          ],
          date: '05-Feb-2024',
          violation: 'amt is within the limit',
          status: 'rejected',
        },
      ],
    },
    {
      trId: 'TR00001',
      cashAdvance: [
        {
          caId: '#CA0001',
          details: [
            {
              amount: '180.75',
              currencyType: 'USD',
            },
            {
              amount: '20000.75',
              currencyType: 'INR',
            },
          ],
          date: '05-Feb-2024',
          violation: 'amt is within the limit',
          status: 'rejected',
        },
      ],
    },
    {
      trId: 'TR00002',
      cashAdvance: [
        {
          caId: '#CA0002',
          details: [
            {
              amount: '250.50',
              currencyType: 'GBP',
            },
            {
              amount: '1500.25',
              currencyType: 'JPY',
            },
          ],
          date: '10-Feb-2024',
          violation: 'amt is within the limit',
          status: 'rejected',
        },
      ],
    },
    {
      trId: 'TR00002',
      cashAdvance: [
        {
          caId: '#CA0002',
          details: [
            {
              amount: '250.50',
              currencyType: 'GBP',
            },
            {
              amount: '1500.25',
              currencyType: 'JPY',
            },
          ],
          date: '10-Feb-2024',
          violation: 'amt is within the limit',
          status: 'rejected',
        },
      ],
    },
    {
      trId: 'TR00003',
      cashAdvance: [
        {
          caId: '#CA0003',
          details: [
            {
              amount: '300.00',
              currencyType: 'USD',
            },
            {
              amount: '350.75',
              currencyType: 'EUR',
            },
            {
              amount: '3000.00',
              currencyType: 'EUR',
            },
          ],
          date: '15-Feb-2024',
          violation: '',
          status: 'rejected',
        },
      ],
    },
    {
      trId: 'TR00003',
      cashAdvance: [
        {
          caId: '#CA0003',
          details: [
            {
              amount: '300.00',
              currencyType: 'USD',
            },
            {
              amount: '350.75',
              currencyType: 'EUR',
            },
            {
              amount: '3000.00',
              currencyType: 'EUR',
            },
          ],
          date: '15-Feb-2024',
          violation: '',
          status: 'rejected',
        },
      ],
    },
    {
      trId: 'TR00003',
      cashAdvance: [
        {
          caId: '#CA0003',
          details: [
            {
              amount: '300.00',
              currencyType: 'USD',
            },
            {
              amount: '350.75',
              currencyType: 'EUR',
            },
            {
              amount: '3000.00',
              currencyType: 'EUR',
            },
          ],
          date: '15-Feb-2024',
          violation: '',
          status: 'rejected',
        },
      ],
    },
    {
      trId: 'TR00003',
      cashAdvance: [
        {
          caId: '#CA0003',
          details: [
            {
              amount: '300.00',
              currencyType: 'USD',
            },
            {
              amount: '350.75',
              currencyType: 'EUR',
            },
            {
              amount: '3000.00',
              currencyType: 'EUR',
            },
          ],
          date: '15-Feb-2024',
          violation: '',
          status: 'rejected',
        },
      ],
    },
    {
        trId: 'TR00001',
        cashAdvance: [
          {
            caId: '#CA0001',
            details: [
              {
                amount: '180.75',
                currencyType: 'USD',
              },
              {
                amount: '20000.75',
                currencyType: 'INR',
              },
            ],
            date: '05-Feb-2024',
            violation: 'amt is within the limit',
            status: 'rejected',
          },
        ],
      },
    // ... (repeat the structure for additional objects)
  ];
  
  console.log(dataArray);
  

  return (
   
   
 
    
      <>
    <div className="box w-auto max-w-[896px] h-auto  mx-2 sm:mx-4 mb-2  font-cabin">
    <div className="">
     
<div className='h-auto'>
{dataArray.map((caDetails,index)=>(
<>
<div className='flex flex-row items-center h-[52px]  gap-2 text-gray-200 border-b-[1px]  border-b-gray'>


<div className='w-auto flex-1 max-w-[100px] flex justify-center items-center px-3 py-2'>
<div className='  text-[14px] tracking-[0.02em]  font-bold'>
#{caDetails.trId}
</div>
</div>


{caDetails.cashAdvance.map((currencyDetails,index)=>(
<>
{/* ca date */}
{/* <div className=' flex flex-1 justify-center items-center w-auto min-w-[130px] h-[44px] px-3 py-2 sr-only  sm:not-sr-only'>
<div className=' tracking-[0.03em] leading-normal text-[14px] text-center'>
{currencyDetails.date}
</div>
</div>  */}
 <div className="flex flex-1 justify-center items-center w-auto min-w-[130px] h-[44px] px-3 py-2 sr-only  sm:not-sr-only gap-2">
      <div className='pl-2 md:pl-0'>
      <img src={calender} alt="calendar" className="w-[16px]"/>
      </div>
      <div className=" tracking-[0.03em] leading-normal text-gray-A300 text-[12px]">
      
      {currencyDetails.date}
      </div>
    </div>


{/* <div className='flex w-auto sm:w-[170px] min-w-[120px] justify-center items-center px-0 sm:py-2 sm:px-3 font-cabin gap-2'> */}



{/* caId */}
<div className=' flex flex-1 justify-center items-center w-auto min-w-[130px] h-[44px] px-3 py-2 sr-only  sm:not-sr-only'>
<div className=' tracking-[0.03em] leading-normal text-[14px] text-center'>
{currencyDetails.caId}
</div>
</div> 

<div className='w-5 h-5 flex-none'>
{currencyDetails.violation.length>0 ?(
<img src={validation_sym} alt='three dot' className='w-[20px] h-[20px] ' />
) :  <div></div>}
</div>
{/* CA amt */}
<div className='flex-1'>
{currencyDetails.details.map((currency,index)=>(
    <>
    
    <div className='text-[14px]'>
    <span className='text-gray-300'>{currency.currencyType}</span>
    {currency.amount},
    </div>
    </>
))}
</div>


{/* </div> */}


</>
))}


<div className="rounded-[32px] w-auto box-border h-[33px] flex flex-row items-center justify-center py-4 px-2 cursor-pointer border-[1px] border-solid border-purple-500">
      <div className="font-semibold text-[12px] min-w-[72px] w-auto  h-[17px] text-purple-500 text-center">Clear Rejected Req.</div>
    </div>
</div>
</>
))}
</div>
</div>
</div>
      </>
    
  
    
  )
}

export default RejectedTravel