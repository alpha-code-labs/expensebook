import React , {useState} from 'react';
import { the_food_bill, down_arrow,chevron_down ,up_arrow } from '../../assets/icon';
import Dropdown from '../common/Dropdown';
import { titleCase } from '../../utils/handyFunctions';

const NonTravelExpense = ({filterExpenseDataByStatus ,getStatusClass ,expenseStatus ,expenseStatusOnChange ,months}) => {
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortedData, setSortedData] = useState(filterExpenseDataByStatus);

  // Function to toggle the sorting order and update the sorted data
  const handleSortChange = (order) => {
    setSortOrder(order);

    // Use a sorting function to sort the data based on the date field
    const sorted = [...sortedData].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setSortedData(sorted);
  };
  
  
  return (
    <>
        
 
    <div className="absolute top-[22px] left-[44px] text-black">
            Non Travel Expenses
          </div>
        
     <div className="absolute top-[178px] left-[24px] flex flex-col items-start justify-start gap-[8px] ">
            <div className="">
              <div className="bg-white flex flex-row items-center justify-center text-gray-A500">
               
                <div className="relative flex items-center justify-center w-[150px] h-14  shrink-0 text-center">
                  <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_50px)] tracking-[0.03em] font-medium">
                    Purpose
                  </div>
                </div>
                <div className="relative w-[126px] h-14 overflow-hidden shrink-0">
                  <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_31px)] tracking-[0.03em] font-medium">
                    Employee
                  </div>
                </div>
                <div className="relative w-14 h-14  shrink-0">
                  <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_21px)] tracking-[0.03em] font-medium">
                    Invoice
                  </div>
                </div>
                <div className="relative w-[126px] h-14 overflow-hidden shrink-0 ml-1 ">
                  <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_27px)] tracking-[0.03em] font-medium">
                    Amount
                  </div>
                </div>
                <div className="relative w-[126px] h-14 overflow-hidden shrink-0">
                  <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_17px)] tracking-[0.03em] font-medium">
                    Date
                  </div>
                </div>
                <div className="relative w-[126px] h-14 overflow-hidden shrink-0">
                  <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_15px)] tracking-[0.03em] font-medium">
                    
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start text-sm h-[230px] overflow-auto pr-1">
            {filterExpenseDataByStatus.map((expenseDetails, index) => (
              // expenseData.map((expenseDetails, index)=>(
                 <>
                <div className="flex flex-col items-center justify-center" key={index}>
                <div className="bg-white flex flex-row items-start justify-center border-b-[1px] border-solid border-gray-100">
                  <div className="relative w-[140px] h-14  shrink-0 text-neutral-800">
                    <div className="absolute top-[calc(50%_-_9px)] w-[150px] left-[calc(50%_-_42px)] tracking-[0.03em] font-medium truncate">
                      {expenseDetails.purpose}
                    </div>
                  </div>
                  <div className="relative w-[140px] h-[56px]  shrink-0 text-neutral-800">
                    <div className="absolute top-[calc(50%_-_7px)] left-[calc(50%_-_15px)]">
                      {expenseDetails.createdFor[0].name}
                    </div>
                  </div>
                  <div className="relative w-14 h-14 overflow-hidden shrink-0 ml-6 ">
                    <div className="absolute top-[calc(50%_-_16px)] left-[calc(50%_-_16px)] rounded-full bg-gray-A300   w-8 h-8 overflow-hidden">
                      <img
                        className="absolute top-[1px] left-[8px] w-[15px] h-[30px] object-cover"
                        alt=""
                        src={the_food_bill}
                      />
                    </div>
                  </div>
                  <div className="relative w-[126px] h-14 overflow-hidden shrink-0 text-xs">
                    <div className="absolute top-[calc(50%_-_7px)] left-[calc(50%_-_13px)]">
                      {expenseDetails.amount}
                    </div>
                  </div>
                  <div className="relative w-[126px] h-14 overflow-hidden shrink-0 text-xs">
                    <div className="absolute top-[calc(50%_-_7px)] left-[calc(50%_-_21px)]">
                      {expenseDetails.date}
                    </div>
                  </div>
                  <div className="relative w-[126px] h-14 overflow-hidden shrink-0 text-xs">
                  <div className="h-[52px] flex flex-col items-center justify-start text-center">
      <div className="flex-1 flex items-center justify-center py-2 px-6">
        <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
         <a>View Details</a> 
        </b>
      </div>
    </div>
                  </div>
                  
                  <div className="w-[139px] h-[56px] py-[5px] px-3 flex justify-center items-center">
                  <div className={` relative flex justify-center items-center w-[129px] h-8 rounded-[48px] ${getStatusClass(expenseDetails.status)}`}>
                    <div className="text-[14px] font-medium text-center font-cabin  shrink-0">
                    {titleCase(expenseDetails.status)}
                    </div>
                  </div>
                  </div>
                </div>
              </div>
             </>
              ))}
            </div>
          </div>
          <div className="absolute top-[153.5px] left-[16.5px] box-border w-[883px] h-px border-t-[1px] border-solid border-ebgrey-100" />
          <div className="absolute top-[65px] left-[44px] flex flex-row items-center justify-start gap-[24px] text-justify text-xs text-ebgrey-400">
           
            <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
  <input
    type="text"
    className="relative tracking-[0.01em] outline-none border-none"
    placeholder="Search by Employee"
  />
</div>
<div className="flex  flex-row items-center justify-start gap-[8px] text-left text-neutral-800">
              <div className="relative font-medium">Select Month</div>
              <div className="relative w-[133px] h-8 text-sm text-black">
                <div className="absolute top-[-5px] left-[0px] rounded-md bg-white box-border w-[93px] h-8">
                 
                  <Dropdown
              name="expenseStatus"
              id="expenseStatus"
              options={expenseStatus}
              icon={chevron_down}
              onChange={expenseStatusOnChange}
              />
                    
                 
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-start gap-[8px] text-left text-neutral-800">
              <div className="relative font-medium">Select Month</div>
              <div className="relative w-[133px] h-8 text-sm text-black">
                <div className="absolute top-[-5px] left-[0px] rounded-md bg-white box-border w-[93px] h-8">
                 
                  <Dropdown
              name="months"
              options={months}
              icon={chevron_down}
              />
                    
                 
                </div>
              </div>
            </div>
        
          </div>

<div className="absolute top-[113px] left-[44px] flex flex-row items-start justify-start gap-[48px]">
        <div className="flex flex-row items-center justify-start gap-[8px]">
          <div className="flex flex-row items-center justify-start gap-[3px]">
            <img
              className="relative w-6 h-6 overflow-hidden shrink-0"
              alt=""
              src={up_arrow}
              onClick={() => handleSortChange('asc')} // Add this click event
            />
            <div className="flex flex-row items-end justify-start">
              <div className="relative tracking-[0.03em] font-medium">
                dates {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </div>
            </div>
          </div>
          <img
            className="relative rounded-2xl w-4 h-4 overflow-hidden shrink-0"
            alt=""
            src="/frame-341.svg"
          />
        </div>
        <div className="flex flex-row items-center justify-start gap-[8px] text-sm">
          <div className="flex flex-row items-center justify-start gap-[8px]">
            <img
              className="relative w-6 h-6 overflow-hidden shrink-0"
              alt=""
              src={down_arrow}
              onClick={() => handleSortChange('desc')} // Add this click event
            />
            <div className="relative">dates {sortOrder === 'asc' ? 'Ascending' : 'Descending'}</div>
          </div>
          <div className="relative rounded-2xl box-border w-4 h-4 overflow-hidden shrink-0 border-[1px] border-solid border-ebgrey-400" />
        </div>
      </div>
         
    </>
  )
}

export default NonTravelExpense
// import React from 'react';
// import { the_food_bill } from '../../assets/icon';

// const NonTravelExpense = ({filterExpenseDataByStatus ,getStatusClass}) => {

//   return (
//     <>
//      <div className="absolute top-[178px] left-[24px] flex flex-col items-start justify-start gap-[8px] ">
//             <div className="">
//               <div className="bg-white flex flex-row items-center justify-center">
               
//                 <div className="relative flex items-center justify-center w-[150px] h-14  shrink-0 text-center">
//                   <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_50px)] tracking-[0.03em] font-medium">
//                     Purpose
//                   </div>
//                 </div>
//                 <div className="relative w-[126px] h-14 overflow-hidden shrink-0">
//                   <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_31px)] tracking-[0.03em] font-medium">
//                     Employee
//                   </div>
//                 </div>
//                 <div className="relative w-14 h-14  shrink-0">
//                   <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_21px)] tracking-[0.03em] font-medium">
//                     Invoice
//                   </div>
//                 </div>
//                 <div className="relative w-[126px] h-14 overflow-hidden shrink-0 ml-1 ">
//                   <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_27px)] tracking-[0.03em] font-medium">
//                     Amount
//                   </div>
//                 </div>
//                 <div className="relative w-[126px] h-14 overflow-hidden shrink-0">
//                   <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_17px)] tracking-[0.03em] font-medium">
//                     Date
//                   </div>
//                 </div>
//                 <div className="relative w-[126px] h-14 overflow-hidden shrink-0">
//                   <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_15px)] tracking-[0.03em] font-medium">
                    
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-col items-start justify-start text-sm h-[230px] overflow-auto pr-1">
//             {filterExpenseDataByStatus.map((expenseDetails, index) => (
//               // expenseData.map((expenseDetails, index)=>(
//                  <>
//                 <div className="flex flex-col items-center justify-center" key={index}>
//                 <div className="bg-white flex flex-row items-start justify-center border-b-[1px] border-solid border-gray-100">
//                   <div className="relative w-[140px] h-14  shrink-0 text-neutral-800">
//                     <div className="absolute top-[calc(50%_-_9px)] w-[150px] left-[calc(50%_-_42px)] tracking-[0.03em] font-medium truncate">
//                       {expenseDetails.purpose}
//                     </div>
//                   </div>
//                   <div className="relative w-[140px] h-[56px]  shrink-0 text-neutral-800">
//                     <div className="absolute top-[calc(50%_-_7px)] left-[calc(50%_-_15px)]">
//                       {expenseDetails.createdFor[0].name}
//                     </div>
//                   </div>
//                   <div className="relative w-14 h-14 overflow-hidden shrink-0 ml-6 ">
//                     <div className="absolute top-[calc(50%_-_16px)] left-[calc(50%_-_16px)] rounded-full bg-gray-A300   w-8 h-8 overflow-hidden">
//                       <img
//                         className="absolute top-[1px] left-[8px] w-[15px] h-[30px] object-cover"
//                         alt=""
//                         src={the_food_bill}
//                       />
//                     </div>
//                   </div>
//                   <div className="relative w-[126px] h-14 overflow-hidden shrink-0 text-xs">
//                     <div className="absolute top-[calc(50%_-_7px)] left-[calc(50%_-_13px)]">
//                       {expenseDetails.amount}
//                     </div>
//                   </div>
//                   <div className="relative w-[126px] h-14 overflow-hidden shrink-0 text-xs">
//                     <div className="absolute top-[calc(50%_-_7px)] left-[calc(50%_-_21px)]">
//                       {expenseDetails.date}
//                     </div>
//                   </div>
//                   <div className="relative w-[126px] h-14 overflow-hidden shrink-0 text-xs">
//                   <div className="h-[52px] flex flex-col items-center justify-start text-center">
//       <div className="flex-1 flex items-center justify-center py-2 px-6">
//         <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
//          <a>View Details</a> 
//         </b>
//       </div>
//     </div>
//                   </div>
//                   <div className="w-[139px] h-[56px] py-[5px] px-3 flex justify-center items-center">
//                   <div className={` relative flex justify-center items-center w-[129px] h-8 rounded-[48px] ${getStatusClass(expenseDetails.status)}`}>
//                     <div className="text-[14px] font-medium text-center font-cabin  shrink-0">
//                     {expenseDetails.status}
//                     </div>
//                   </div>
//                   </div>
//                 </div>
//               </div>
//              </>
//               ))}
//             </div>
//           </div>
//     </>
//   )
// }

// export default NonTravelExpense


///sidde bar
 {/* <div className="absolute top-[0px] left-[0px] bg-gray-100 box-border w-[244px] h-[832px] overflow-hidden border-[1px] border-solid border-gray-300">
        <img
          className="absolute top-[40px] left-[calc(50%_-_106px)] w-[149px] h-10 overflow-hidden"
          alt=""
          src="/frame-505.svg"
        />
        <div className="absolute top-[101px] left-[0px] flex flex-col items-start justify-start gap-[16px]">
          <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
            <div className="absolute top-[calc(50%_-_8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src="/airplay.svg"
              />
              <div className="relative">Overview</div>
            </div>
          </div>
          <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
            <div className="absolute top-[calc(50%_-_8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src="/airplay1.svg"
              />
              <div className="relative">Travel</div>
            </div>
          </div>
          <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
            <div className="absolute top-[calc(50%_-_8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src="/airplay2.svg"
              />
              <div className="relative">Cash Advances</div>
            </div>
          </div>
          <div className="relative bg-eb-primary-blue-50 w-[244px] h-8 overflow-hidden shrink-0 text-eb-primary-blue-500">
            <div className="absolute top-[calc(50%_-_8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src="/checkcircle.svg"
              />
              <div className="relative font-medium">Expense dasboard</div>
            </div>
          </div>
          <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
            <div className="absolute top-[calc(50%_-_8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src="/airplay3.svg"
              />
              <div className="relative">Expenses</div>
            </div>
          </div>
        </div>
        <div className="absolute top-[781px] left-[32px] flex flex-row items-center justify-start gap-[18px] text-base text-eb-primary-blue-500">
          <img
            className="relative w-4 h-4 overflow-hidden shrink-0"
            alt=""
            src="/logout.svg"
          />
          <div className="relative">Logout</div>
        </div>
      </div> */}
