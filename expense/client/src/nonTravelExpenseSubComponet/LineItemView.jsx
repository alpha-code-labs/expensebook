import React from "react";
import { categoryIcons } from "../assets/icon";
import Button1 from "../Components/common/Button1";
import { camelCaseToTitleCase, rearrangeKeyForLineItem } from "../utils/handyFunctions";
import { lineItems } from "../utils/dummyData";
import { StatusBox } from "../Components/common/TinyComponent";
import CancelButton from "../Components/common/CancelButton";

export function LineItemView({selectedLineItemId, expenseHeaderStatus, isUploading, active, flagToOpen, expenseHeaderId, lineItem, index, newExpenseReport, handleEdit, handleDeleteLineItem }) {

  const excludedKeys = ['settlementBy','isMultiCurrency','convertedAmountDetails', 'isPersonalExpense', 'Tax Amount', 'personalExpenseAmount','policyValidation', 'Category Name', 'expenseLineId', 'billImageUrl', 'group', 'expenseLineAllocation', 'allocations', 'multiCurrencyDetails', 'lineItemStatus', 'lineItemId', '_id','approvers'];
  const includedKeys = ['Total Fair', 'Total Fare','personalExpenseAmount','Tax Amount', 'Total Amount', 'Subscription Cost', 'Cost', 'Premium Cost'];
  
     const arrangedItems=rearrangeKeyForLineItem(lineItem,includedKeys)
     console.log('arranged lineitem', arrangedItems)

  return (
    <div className="flex justify-between flex-col h-[600px] sm:h-screen">
      <div className="w-full flex-row   overflow-y-auto scrollbar-hide">

        <div className="sticky  top-0 bg-white z-20 w-full flex-row justify-between flex items-center h-12 px-4 border-dashed  border-y border-slate-300 py-4">
          <div className="flex items-center justify-center gap-2">
            <div className="bg-slate-100 p-2 rounded-full">
              <img src={categoryIcons[arrangedItems?.['Category Name']]} className="w-4 h-4 rounded-full" />
            </div>
            <p>{index + 1}. {arrangedItems?.['Category Name']}</p>
          </div>
          <div>
           <StatusBox status={arrangedItems?.lineItemStatus}/>
          </div>
        </div>
          {arrangedItems?.allocations?.length > 0 && 
          <div className="pb-4 px-4 flex flex-wrap items-center justify-evenly border-b border-slate-300" >
           <p className='text-start w-full  px-2 py-2 text-base text-neutral-700 font-inter'>Allocations</p>
         {  arrangedItems?.allocations?.map((allocation, index) => (
              <div key={index} className="min-w-[200px] min-h-[52px] ">
                <div className="text-zinc-600 text-sm font-cabin capitalize py-1">{allocation.headerName}</div>
                <div className="w-full h-12 bg-white items-center flex border border-neutral-300 rounded-md">
                  <div>
                    <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin px-6 py-2">
                      {allocation.headerValue}
                    </div>
                  </div>
                </div>
              </div>
            )) }
            </div>
           }
        
        <div>
        { 

// Object.entries(arrangedItems)
//   .filter(([key, value]) => !excludedKeys.includes(key) && !includedKeys.includes(key) && value !== null)
//   .map(([key, value]) => {
//     if (key === 'Currency' && value && typeof value === 'object') {
//       const currencyShortName = value.shortName;
//       console.log('currency name 11',currencyShortName)
//       return includedKeys.map((includedKey) => {
//         if (arrangedItems[includedKey]) {
//           return (
//             <div key={includedKey} className="w-full h-[84px] px-4 ">
//               <p className="capitalize text-zinc-600 truncate whitespace-nowrap text-sm font-normal font-cabin pb-1">{`${camelCaseToTitleCase(includedKey)}`}</p>
//               <div className="border rounded-md inline-flex justify-start items-center h-[48px] w-full border-slate-300 text-neutral-700 truncate text-sm font-normal font-cabin px-4 py-2">
//                 <p>{currencyShortName} {String(arrangedItems[includedKey])}</p>
//               </div>
//               <p>{key=== 'convertedAmountDetails' ? value.amount : ""}</p>
//             </div>
//           );

//         }
//         return null;
//       });
//     }
    

//     // if (includedKeys.includes(key)) {
//     //   return (
//     //     <div key={key} className="w-full h-[73px] px-4">
//     //       <p className="capitalize text-zinc-600 truncate whitespace-nowrap text-sm font-normal font-cabin pb-1">{camelCaseToTitleCase(key)}:</p>
//     //       <div className="border rounded-md inline-flex justify-start items-center h-[48px] w-full border-slate-300 text-neutral-700 truncate text-sm font-normal font-cabin px-4 py-2">
//     //         <p>{String(value)}</p>
//     //       </div>
//     //     </div>
//     //   );
//     // }

//     return (
//       <div key={key} className="w-full h-[84px] px-4">
//         <p className="capitalize text-zinc-600 truncate whitespace-nowrap text-sm font-normal font-cabin pb-1">{camelCaseToTitleCase(key)}</p>
//         <div className="border rounded-md inline-flex justify-start items-center h-[48px] w-full border-slate-300 text-neutral-700 truncate text-sm font-normal font-cabin px-4 py-2">
//           <p>{String(value)}</p>
//         </div>
//       </div>
//     );
//   })
//   .flat()


  Object.entries(arrangedItems)
    .filter(([key, value]) => !excludedKeys.includes(key) && !includedKeys.includes(key) && value !== null)
    .map(([key, value]) => {
      if (key === 'Currency' && value && typeof value === 'object') {
        const currencyShortName = value.shortName;
        return includedKeys.map((includedKey) => {
          if (arrangedItems[includedKey]) {
            return (
              <div key={includedKey} className=" w-full h-fit px-4 ">
                <p className="capitalize text-zinc-600 truncate whitespace-nowrap text-sm font-normal font-cabin pb-1">{`${camelCaseToTitleCase(includedKey)}`}</p>
                <div className="border rounded-md inline-flex justify-start items-center h-[48px] w-full border-slate-300 text-neutral-700 truncate text-sm font-normal font-cabin px-4 py-2">
                  <p>{currencyShortName} {String(arrangedItems[includedKey])}</p>
                
                </div>
                {/* Check for 'convertedAmountDetails' and display its amount */}
                <div>   
                {arrangedItems.convertedAmountDetails&& includedKey !== 'Tax Amount'  && (
                  <p className=" text-sm text-neutral-600  pl-2 ">
                   {arrangedItems.convertedAmountDetails.amount}
                    {`Amount in ${arrangedItems.convertedAmountDetails?.defaultCurrencyName} ${arrangedItems.convertedAmountDetails?.convertedTotalAmount} | 1 ${arrangedItems.convertedAmountDetails?.convertedCurrencyName} = ${arrangedItems.convertedAmountDetails?.defaultCurrencyName} ${arrangedItems.convertedAmountDetails?.conversionRate}`}
                  </p>
                )}
                {
                  (arrangedItems?.policyValidation?.[0]?.greenFlag) === false && !['Tax Amount','personalExpenseAmount'].includes(includedKey) &&
                  <p className="text-xs  pl-2  text-yellow-600 ">{`Expense exceeds the allowed limit of ${arrangedItems?.policyValidation[0]?.currencyName} ${arrangedItems?.policyValidation[0]?.amountAllowed}`}</p>
                }
                </div>
              </div>
            );
          }
          return null;
        });
      }

      return (
        <div key={key} className="w-full h-[84px] px-4 ">
          <p className="capitalize text-zinc-600 truncate whitespace-nowrap text-sm font-normal font-cabin pb-1">{camelCaseToTitleCase(key)}</p>
          <div className="border rounded-md inline-flex justify-start items-center h-[48px] w-full border-slate-300 text-neutral-700 truncate text-sm font-normal font-cabin px-4 py-2">
            <p>{String(value)}</p>
          </div>
        </div>
      );
    })
    .flat()
  
    // Object.entries(arrangedItems)
    //   .filter(([key, value]) => !excludedKeys.includes(key) && !includedKeys.includes(key) && value !== null)
    //   .map(([key, value]) => {
    //     if (key === 'Currency' && value && typeof value === 'object') {
    //       const currencyShortName = value.shortName;
    //       return includedKeys.map((includedKey) => {
    //         if (arrangedItems[includedKey]) {
    //           return (
    //             <div key={includedKey} className="w-full h-[84px] px-4">
    //               <p className="capitalize text-zinc-600 truncate whitespace-nowrap text-sm font-normal font-cabin pb-1">{`${camelCaseToTitleCase(includedKey)}`}</p>
    //               <div className="border rounded-md inline-flex justify-start items-center h-[48px] w-full border-slate-300 text-neutral-700 truncate text-sm font-normal font-cabin px-4 py-2">
    //                 <p>{currencyShortName} {String(arrangedItems[includedKey])}</p>
    //               </div>
    //               {/* Show 'convertedAmountDetails' except below 'Tax Amount' */}
    //               {arrangedItems.convertedAmountDetails && includedKey !== 'Tax Amount' && (
    //                 <p className="text-sm text-neutral-600 mt-1">
    //                   Converted Amount: {currencyShortName} {arrangedItems.convertedAmountDetails.amount}
    //                 </p>
    //               )}
    //             </div>
    //           );
    //         }
    //         return null;
    //       });
    //     }
  
    //     return (
    //       <div key={key} className="w-full h-[84px] px-4">
    //         <p className="capitalize text-zinc-600 truncate whitespace-nowrap text-sm font-normal font-cabin pb-1">{camelCaseToTitleCase(key)}</p>
    //         <div className="border rounded-md inline-flex justify-start items-center h-[48px] w-full border-slate-300 text-neutral-700 truncate text-sm font-normal font-cabin px-4 py-2">
    //           <p>{String(value)}</p>
    //         </div>
    //       </div>
    //     );
    //   })
    //   .flat()
  
  


}

        </div>


      </div>

      <div className=' bottom-0 p-2 bg-white border-y  border-slate-300'>
        {!['paid', 'paid and distribute'].includes(expenseHeaderStatus) && (
          <div className="w-full flex sm:justify-start justify-center gap-4">
            <Button1  text={"Edit"} onClick={() => handleEdit(arrangedItems)} />
            <CancelButton loading={false} text="Delete" onClick={()=>handleDeleteLineItem()} />
          </div>
        )}
       
      </div>
    </div>
  );
}

// import { categoryIcons } from "../assets/icon";
// import Button1 from "../Components/common/Button1";
// import { totalAmountKeys } from "../utils/data/keyList";
// import { titleCase } from "../utils/handyFunctions";

// export function LineItemView({ index, lineItem, handleEdit, handleDelete, isUploading, active }) {
//     const excludedKeys = ['isMultiCurrency', 'Category Name', 'expenseLineId', 'Currency', 'billImageUrl', 'group', 'expenseLineAllocation', 'multiCurrencyDetails', 'lineItemStatus', 'lineItemId', '_id'];
  
    
//     return (
//       <div className="flex flex-col justify-between h-screen overflow-y-auto scrollbar-hide ">
//         <div className="sticky top-0 bg-white z-20 w-full flex items-center h-12 px-4 border-dashed  border-y border-slate-300 py-4">
//           <div className="flex items-center justify-center gap-2">
//             <div className="bg-slate-100 p-2 rounded-full">
//               <img src={categoryIcons[lineItem?.['Category Name']]} className="w-4 h-4 rounded-full" />
//             </div>
//             <p>{index + 1}. {lineItem?.['Category Name']}</p>
//           </div>
//         </div>
  
//         <div className="px-4">
//           {lineItem?.expenseLineAllocation?.map((allocation, i) => (
//             <div key={i} className="w-full min-h-[52px]">
//               <div className="text-zinc-600 text-sm font-cabin capitalize">{allocation.headerName}</div>
//               <div className="w-full h-12 bg-white flex items-center border border-neutral-300 rounded-md">
//                 <div className="text-neutral-700 w-full h-full text-sm font-cabin px-6 py-2">{allocation.headerValue}</div>
//               </div>
//             </div>
//           ))}
//         </div>
  
//         <div className="w-full flex flex-col items-start py-4 px-4 gap-y-4">
//           {Object.entries(lineItem).map(([key, value]) => (
//             !excludedKeys.includes(key) && (
//               <div key={key} className="w-full min-h-[52px]">
//                 {key !== 'Currency' && <div className="text-zinc-600 text-sm font-cabin">{titleCase(key)}</div>}
//                 <div className="w-full h-[48px] bg-white flex items-center border border-neutral-300 rounded-md">
//                   <div className="text-neutral-700 w-full h-10 text-sm font-cabin px-6 py-2">
//                     {totalAmountKeys.includes(key)
//                       ? `${lineItem['Currency']?.shortName} ${value}`
//                       : `${key === 'group' ? value?.group : value}`}
//                   </div>
//                 </div>
//                 {totalAmountKeys.includes(key) && (lineItem?.multiCurrencyDetails?.convertedAmount > (lineItem?.group?.limit || 0)) && (
//                   <div className="w-[200px] text-xs text-yellow-600 font-cabin line-clamp-2">{lineItem?.group?.message}</div>
//                 )}
//               </div>
//             )
//           ))}
  
//           {lineItem?.multiCurrencyDetails && (
//             <div className="px-4 mb-3">
//               <div className="min-w-[200px] w-full h-auto flex flex-col gap-2">
//                 <div className="text-zinc-600 text-sm font-cabin">Converted Amount Details:</div>
//                 <div className="w-full h-full text-sm font-cabin border border-neutral-300 rounded-md">
//                   <div className="sm:px-6 px-4 py-2 flex sm:flex-row flex-col justify-between bg-slate-100 rounded-md">
//                     <div className="text-[16px] font-semibold text-neutral-600">Total Amount</div>
//                     <div className="text-neutral-600">{lineItem?.multiCurrencyDetails?.defaultCurrency} {lineItem?.multiCurrencyDetails?.convertedAmount?.toFixed(2)}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
  
//         <div className="sticky bottom-0 bg-white flex flex-row gap-4 items-center px-4 py-2 border-t border-t-slate-300 ">
//           <Button1 text="Edit" disabled={isUploading.edit}  loading={isUploading?.edit?.id === lineItem?.lineItemId && isUploading?.edit?.visible} onClick={() => handleEdit(lineItem?.lineItemId, lineItem?.['Category Name'])} />
//           <Button1 text="Delete" disabled={isUploading.delete}  loading={isUploading?.delete?.id === lineItem?.lineItemId && isUploading?.delete?.visible} onClick={() => handleDelete(lineItem?.lineItemId)} />
//         </div>
//       </div>
//     );
//   }