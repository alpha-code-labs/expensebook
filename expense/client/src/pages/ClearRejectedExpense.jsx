import React,{ useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, useParams, useNavigate} from 'react-router-dom'
import Error from "../components/common/Error";
import Icon from "../components/common/Icon";
import {  arrow_left as left_arrow_icon , report_icon} from "../assets/icon";
import { getRejectionDataForTravelExpenseApi } from "../utils/api";
///this is perfect nothing to change

const ClearRejectedExpense=()=>{

    const {tenantId,empId,tripId, expenseHeaderId} = useParams()
    
    const [isLoading, setIsLoading] = useState(false)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const [data, setData] = useState(null)
    

    //for now i add a variable
    // const [rejectionReason, setRejectionReason] = useState(null)

    const navigate = useNavigate()

 const rejectionReason = " your expense report has rejected due to  Document Constraints"

  
      useEffect(() => {
        const fetchData = async () => {
          try {
            setIsLoading(true);
            const response = await getRejectionDataForTravelExpenseApi(tenantId, empId, tripId,expenseHeaderId);
            setData(response)
            console.log('trip data fetched successfully', response)
            setIsLoading(false);  
          } catch (error) {
            setLoadingErrMsg(error.message);
            setTimeout(() => {
              setIsLoading(false);
              setLoadingErrMsg(null)
            }, 4000);
          } 
        };
      
        // Call the fetchData function whenever tenantId, empId, or tripId changes
        fetchData();
      }, [tenantId, empId, tripId]);
      console.log(data)

    



    return(

        <>
        {isLoading && <Error message={loadingErrMsg} />}

        {!isLoading && data && <div className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
            {/* app icon */}
            <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
                <Icon/>
              
            </div>

            {/* Rest of the section */}
            <div className="w-full h-full mt-10 p-10 font-cabin tracking-tight">
                {/* back link */}
                <div className='flex items-center gap-4 cursor-pointer'>
                    <img className='w-[24px] h-[24px]' src={left_arrow_icon} />
                    <p className='text-neutral-700 text-md font-semibold font-cabin'>Clear rejected Expense Report</p>
                </div>

                <div className='w-full bg-slate-50 px-6 py-4 rounded-md mt-10'>
                    <p className='text-neutral-700 text-lg font-medium'>Your Expense Report has been rejected</p>
                    <p className='text-neutral-500 text-sm tracking-tight my-2'>
                        Expense Report Number: {<span className="text-medium text-neutral-800">{data?.expenseHeaderNumber}</span>} associated with Trip Number: <span className="text-medium text-neutral-800">{data?.tripNumber}</span>
                    </p>
                   
                    
                

 <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
 <div className="flex justify-center items-center rounded-full w-9 h-9 bg-gray-900">
 <img src={report_icon}  />
 </div>
 <div className="w-full flex sm:block">
 <p className=" ml-2 w-full text-neutral-600 text-lg">Expense Header Number :  {data?.expenseHeaderNumber}</p>   
 </div>
 </div>




                    <div className="mt-4 text-red-500 px-6 py-2 rounded-md bg-red-100">
                        <p>{data?.rejectionReason}</p>
                    </div>
                    <div className='text-sm mt-10'>Please take appropriate action to clear this rejection</div>
                    <div className="flex justify-between mt-6">
                        <div className="text-neutral-500 px-4 py-2 hover:bg-slate-200 bg-slate-100 hover:text-neutral-400 cursor-pointer" onClick={()=>navigate(`/api/internal/expense/fe/tr-ex-create/${tenantId}/${empId}/${tripId}/cancelFlag?`)}>Cancel</div>
                        <div className="text-neutral-500 px-4 py-2 hover:bg-slate-200 bg-slate-100 hover:text-neutral-400 cursor-pointer" onClick={()=>navigate(`/api/internal/expense/fe/tr-ex-create/${tenantId}/${empId}/${tripId}/`)}>Modify/Resubmit</div>
                    </div>
                </div>
            </div>

            </div>
        }
      </>
    )
}


export default ClearRejectedExpense










// import React,{ useState, useEffect, createContext } from "react";
// import {BrowserRouter as Router, Routes, Route, useParams, useNavigate} from 'react-router-dom'
// import Error from "../components/common/Error";
// // import Icon from "../components/common/Icon";
// import {  arrow_left as left_arrow_icon ,house_simple} from "../assets/icon";
// import { getExpenseLineItems } from "../utils/api";
// import { titleCase } from "../utils/handyFunctions";



// const ClearRejectedExpense=()=>{

//     const {travelRequestId, cashAdvanceId} = useParams()
//     console.log(travelRequestId, cashAdvanceId, 'travelRequestId, cashAdvanceId')
//     const [isLoading, setIsLoading] = useState(false)
//     const [data, setData] = useState(null)

//     const [loadingErrorMsg, setLoadingErrorMsg] = useState(null)
//     //for now i add a variable
//     // const [rejectionReason, setRejectionReason] = useState(null)

//     const navigate = useNavigate()

//  const rejectionReason = " your expense report has rejected due to  Document Constraints"
//     useEffect(() => {
//         const fetchData = async () => {
//           try {
//             setIsLoading(true);
//             const { data, error } = await getExpenseLineItems();
    
//             if (error) {
//               setLoadingErrorMsg(error.message);
//             } else {
//               setData(data);
//             }
//           } catch (error) {
//             setLoadingErrorMsg(error.message);
//           } finally {
//             setIsLoading(false);
//           }
//         };
    
//         fetchData();
//       }, []);
//       console.log(data)

    
//     //fetch cash advance details (rejection reason is only required field)
//     // useEffect(()=>{
//     //     (async function(){
//     //         const res = await getExpenseLineItems({travelRequestId, cashAdvanceId})
//     //         if(res.err){
//     //             setLoadingErrorMsg(res.err)
//     //             return;
//     //         }
//     //         console.log(res.data)
//     //         setRejectionReason(res.data.cashAdvance?.cashAdvanceRejectionReason??'Requested amount exceeds allowed cash advance limit');
//     //         setCashAdvance(res.data.cashAdvance)
//     //         setIsLoading(false)
//     //     })()
//     // },[])


//     return(

//         <>
//         {isLoading && <Error message={loadingErrorMsg} />}

//         {!isLoading && <div className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
//             {/* app icon */}
//             <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
//                 {/* <Icon/> */}
//                 Application Icon
//             </div>

//             {/* Rest of the section */}
//             <div className="w-full h-full mt-10 p-10 font-cabin tracking-tight">
//                 {/* back link */}
//                 <div className='flex items-center gap-4 cursor-pointer'>
//                     <img className='w-[24px] h-[24px]' src={left_arrow_icon} />
//                     <p className='text-neutral-700 text-md font-semibold font-cabin'>Clear rejected Expense Report</p>
//                 </div>

//                 <div className='w-full bg-slate-50 px-6 py-4 rounded-md mt-10'>
//                     <p className='text-neutral-700 text-lg font-semibold'>Your Expense Report has been rejected</p>
//                     <p className='text-neutral-500 text-sm tracking-tight mt-2'>
//                         {/* {`Cash Advnce Number: ${cashAdvance?.cashAdvanceNumber} associated with Travel Request Number: ${cashAdvance?.travelRequestNumber}`} */}
//                     </p>
//                     <p className='text-sm text-neutral-500 mt-2'>Amount Details</p>
//                     <div className='mt-1 flex-col gap-1'>
//                         {/* {cashAdvance.amountDetails.map(amt=>
//                         <div className="text-sm flex gap-1">
//                             <p className='text-neutral-600'>{amt?.currency?.shortName}</p>
//                             <p className='text-neutral-600'>{amt?.amount}</p>
//                         </div>)} */}
//                     </div>
//                     {data && (

// data.map((item,index)=>(
//                     <React.Fragment key={index}>
//      <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
//  <img src={house_simple} className='w-4 h-4' />
//  <div className="w-full flex sm:block">
//      <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
//          <div className="w-[100px]">
//             Sr.{index + 1}   
//          </div>
//          <div className="flex-1">
//              Category   
//          </div>
//          <div className="flex-1" >
//              Currency     
//          </div>
//          <div className="flex-1" >
//              Bill Amount     
//          </div>

//          <div className="flex-1">
//                 Is Personal Expense?
//          </div>
//          <div className="flex-1">
//             Expense Allocation
//          </div>
//          <div className="flex-1">
//              Bills
//          </div>
//      </div>

//      <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
//      <div className="w-[100px]">
           
//          </div>
//          <div className="flex-1">
//              {titleCase(item.category)}     
//          </div>
//          <div className="flex-1">
//              {(item.currency)}     
//          </div>
//          <div className="flex-1 flex-col">
//              {/* {date} */}
//              <h2>Bill Amt- {(item.billAmount)} </h2>
//              <h2>Converted Amt-{(item.convertedBillAmount)}</h2>
//          </div>
//          <div className="flex-1">
//              {item.isPersonalExpense ? 'Yes':'No'}
//          </div>
//          <div className='flex-1'>
//              {titleCase(item.allocationHeader)}
//          </div>
//          <div className='flex-1 flex-col'>

//              <img src={house_simple} alt='document'/>
//              {(item?.document?.name??"file not found")}
//          </div>
//      </div>
//  </div>

 


//  </div>
//   </React.Fragment>)))}
//                     <div className="mt-4 text-red-500 px-6 py-2 rounded-md bg-red-100">
//                         <p>{rejectionReason}</p>
//                     </div>
//                     <div className='text-sm mt-10'>Please take appropriate action to clear this rejection</div>
//                     <div className="flex justify-between mt-6">
//                         <div className="text-neutral-500 px-4 py-2 hover:bg-slate-200 bg-slate-100 hover:text-neutral-400 cursor-pointer" onClick={()=>navigate(`/cancel/advance/${travelRequestId}/${cashAdvanceId}`)}>Cancel</div>
//                         <div className="text-neutral-500 px-4 py-2 hover:bg-slate-200 bg-slate-100 hover:text-neutral-400 cursor-pointer" onClick={()=>navigate(`/modify/advance/${travelRequestId}/${cashAdvanceId}`)}>Modify/Resubmit</div>
//                     </div>
//                 </div>
//             </div>

//             </div>
//         }
//       </>
//     )
// }


// export default ClearRejectedExpense