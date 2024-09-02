import React from "react";
import { categoryIcons } from "../assets/icon";
import Button1 from "../Components/common/Button1";
import { camelCaseToTitleCase, rearrangeKeyForLineItem } from "../utils/handyFunctions";
import { lineItems } from "../utils/dummyData";

export function LineItemView({ expenseHeaderStatus, isUploading, active, flagToOpen, expenseHeaderId, lineItem, index, newExpenseReport, handleEdit, handleDeleteLineItem }) {

  const excludedKeys = ['isMultiCurrency','convertedAmountDetails', 'isPersonalExpense', 'Tax Amount', 'personalExpenseAmount','policyValidation', 'Category Name', 'expenseLineId', 'billImageUrl', 'group', 'expenseLineAllocation', 'allocations', 'multiCurrencyDetails', 'lineItemStatus', 'lineItemId', '_id','approvers'];
  const includedKeys = ['Total Fair', 'Total Fare','personalExpenseAmount','Tax Amount', 'Total Amount', 'Subscription Cost', 'Cost', 'Premium Cost'];
  const totalAmountKeys = includedKeys.filter(key => key !== 'personalExpenseAmount');


     const arrangedItems=rearrangeKeyForLineItem(lineItem,includedKeys)
     console.log('arranged lineitem', arrangedItems)
  return (
    <div className="flex justify-between flex-col h-[600px] sm:h-screen">
      <div className="w-full flex-row   overflow-y-auto scrollbar-hide">

        <div className="sticky top-0 bg-white z-20 w-full flex items-center h-12 px-4 border-dashed  border-y border-slate-300 py-4">
          <div className="flex items-center justify-center gap-2">
            <div className="bg-slate-100 p-2 rounded-full">
              <img src={categoryIcons[arrangedItems?.['Category Name']]} className="w-4 h-4 rounded-full" />
            </div>
            <p>{index + 1}. {arrangedItems?.['Category Name']}</p>
          </div>
        </div>

        <div className="pb-4 px-4 flex flex-wrap items-center justify-evenly border-b border-slate-300" >
        <p className='text-start w-full  px-2 py-2 text-base text-neutral-700 font-inter'>Allocations</p>
          {arrangedItems?.allocations ?
            arrangedItems?.allocations?.map((allocation, index) => (
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
            )) : ""}
        </div>
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
                {arrangedItems.convertedAmountDetails&& !['Tax Amount','personalExpenseAmount'].includes(includedKey)  && (
                  <p className=" text-sm text-neutral-600  pl-2 ">
                   {arrangedItems.convertedAmountDetails.amount}
                    {`Amount in ${arrangedItems.convertedAmountDetails?.defaultCurrencyName} ${arrangedItems.convertedAmountDetails?.convertedTotalAmount} | 1 ${arrangedItems.convertedAmountDetails?.convertedCurrencyName} = ${arrangedItems.convertedAmountDetails?.defaultCurrencyName} ${arrangedItems.convertedAmountDetails?.conversionRate}`}
                  </p>
                )}
                {arrangedItems.convertedAmountDetails&&  !['Tax Amount',...totalAmountKeys].includes(includedKey)  && (
                  <p className=" text-sm text-neutral-600  pl-2 ">
                   {arrangedItems.convertedAmountDetails.amount}
                    {`Amount in ${arrangedItems.convertedAmountDetails?.defaultCurrencyName} ${arrangedItems.convertedAmountDetails?.convertedPersonalAmount} | 1 ${arrangedItems.convertedAmountDetails?.convertedCurrencyName} = ${arrangedItems.convertedAmountDetails?.defaultCurrencyName} ${arrangedItems.convertedAmountDetails?.conversionRate}`}
                  </p>
                )}
                {
                  (arrangedItems?.policyValidation[0]?.greenFlag) === false && !['Tax Amount','personalExpenseAmount'].includes(includedKey) &&
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
            <Button1 text="Edit" onClick={() => handleEdit(arrangedItems?.expenseLineId, arrangedItems?.['Category Name'], arrangedItems.travelType)} />
            <Button1 loading={false} text="Delete" onClick={() => handleDeleteLineItem()} />
          </div>
        )}
      </div>
    </div>
  );
}











// import React from "react";
// import { categoryIcons } from "../assets/icon";
// import Button1 from "../Components/common/Button1";



//  export function LineItemView({expenseHeaderStatus,isUploading,active,flagToOpen,expenseHeaderId,arrangedItems, index ,newExpenseReport ,handleEdit, handleDeleteLineItem}) {

//     const excludedKeys = ['isMultiCurrency','isPersonalExpense','policyValidation','Category Name', 'expenseLineId', 'Currency', 'billImageUrl', 'group', 'expenseLineAllocation','allocations', 'multiCurrencyDetails', 'lineItemStatus', 'lineItemId', '_id'];
//     const includedKeys =['Total Fair','Total Fare','Total Amount',  'Subscription Cost', 'Cost', 'Premium Cost','personalExpenseAmount'];
//     return (
//      <div className="border relative flex justify-between flex-col">
//         <div className="w-full flex-row pb-[56px] h-[710px] overflow-y-auto scrollbar-hide">
         
//         <div className="sticky top-0 bg-white z-20 w-full flex items-center h-12 px-4 border-dashed  border-y border-slate-300 py-4">
//           <div className="flex items-center justify-center gap-2">
//             <div className="bg-slate-100 p-2 rounded-full">
//               <img src={categoryIcons[arrangedItems?.['Category Name']]} className="w-4 h-4 rounded-full" />
//             </div>
//             <p>{index + 1}. {arrangedItems?.['Category Name']}</p>
//           </div>
//         </div>

//         <div className="pb-4 px-4 flex flex-wrap items-center justify-evenly" >
//         {arrangedItems?.allocations ? 
//             arrangedItems?.allocations?.map((allocation, index) => (
//               <div key={index} className="min-w-[200px] min-h-[52px] ">
//                 <div className="text-zinc-600 text-sm font-cabin capitalize py-1">{allocation.headerName}</div>
//                 <div className="w-full h-12 bg-white items-center flex border border-neutral-300 rounded-md">
//                   <div>
//                     <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin px-6 py-2">
//                       {allocation.headerValue}
//                     </div>
//                   </div>
//                 </div>
//                 {/* <div className="w-full text-xs text-yellow-600 font-cabin">{['policyViolation']}</div> */}
//               </div> 
//             )): ""}
//         </div>

//         <div key={index} className="w-full  flex flex-col items-start gap-y-8 justify-between py-4 px-4">
//             {Object.entries(arrangedItems).map(([key, value]) => (
    
//          !excludedKeys.includes(key)  && value !== null && value !== 0 &&(
    
//       <React.Fragment key={key}>
//        {key !== 'convertedAmountDetails'&& 
//           <div className=" w-full  h-[48px]  flex-col justify-start items-start ">
                            
//                 <div className="text-zinc-600 text-sm font-cabin capitalize"> {(key !== 'convertedAmountDetails' && key === 'personalExpenseAmount') ? 'Personal Expense' : key}</div>
//                 <div className=" w-full overflow-x-scroll  overflow-hidden scrollbar-hide h-full bg-white items-center flex border border-neutral-300 rounded-md ">
                
                
//                       <div key={key}>
//                         <div className="text-neutral-700   truncate  w-full h-full text-sm font-normal font-cabin px-6 py-2 ">
                          
//                         {includedKeys.includes(key) ? `${(arrangedItems['Currency']?.shortName)} ${parseFloat(value).toFixed(2)}` : `${key === 'group' ? value?.group : value}`}
//                         </div>
                        
//                       </div>
                      
                    
//                 </div> 
//                 {/* <div className=" w-full text-xs text-yellow-600 font-cabin">{['policyViolation']}</div> */}
//           </div>}
    
//       {key === 'convertedAmountDetails' &&   
//     <div className="min-w-[200px] w-full  h-auto flex-col justify-start items-start gap-2 inline-flex my-6">
//     <div className="text-zinc-600 text-sm font-cabin">Coverted Amount Details :</div>
//     <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin  ">
//       <div className="w-full h-full decoration:none  rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600">
//         <div className={`sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start min-h-12  justify-between bg-slate-100 rounded-t-md ${!value?.convertedPersonalAmount ? "rounded-md" :"rounded-t-md" }`}>
//           <div className="text-[16px] font-medium text-neutral-600">Total Amount </div> 
//           <div className="text-neutral-600 font-cabin">{value?.defaultCurrencyName} {value?.convertedTotalAmount && parseFloat(value?.convertedTotalAmount).toFixed(2)}</div>
//       </div>
    
//     {value?.convertedPersonalAmount && (
//       <>
//         <div className="sm:px-6 px-4  py-2 flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100">
//           <div className="text-[16px] font-medium text-neutral-600">Personal Amount </div>
//           <div className="text-neutral-600 font-cabin">
//             {value?.defaultCurrencyName} {parseFloat(value?.convertedPersonalAmount ?? 0).toFixed(2)}
//           </div>
//         </div>
//         <div className="sm:px-6 px-4 py-2 flex sm:flex-row flex-col  sm:items-center items-start justify-between min-h-12 bg-slate-200 rounded-b-md">
//           <div className="text-[16px] font-medium text-neutral-600 max-w-full  whitespace-nowrap"><p className=" text-ellipsis">Final Reimbursement Amount </p></div>
//           <div className="text-neutral-600 font-cabin">
//             {value?.defaultCurrencyName} {parseFloat(value?.convertedBookableTotalAmount ?? 0).toFixed(2)}
//           </div>
//         </div>
//       </>
//     )}
    
//       </div>
    
//     </div>
    
//     </div>} 
//             </React.Fragment>
//              )
//              ))}
             
        
             
           
//         </div>
//         </div>

//         <div className='absolute p-2 bg-indigo-50 inset-x-0 bottom-0 border-t-[1px]'>
//         {  !['paid', 'paid and distribute'].includes(expenseHeaderStatus) &&<div className="w-full flex sm:justify-start justify-center gap-4" >
//                 <Button1 text="Edit"   onClick={()=>handleEdit(arrangedItems?.expenseLineId,arrangedItems?.['Category Name'],arrangedItems.travelType)} />
//                 <Button1  loading={(active?.delete?.id === arrangedItems?.expenseLineId ? active?.delete?.visible : false)}   text="Delete" onClick={()=>(handleDeleteLineItem(arrangedItems))} />
//               </div>}
//         </div>      
//      </div>
//     );
//  }
