import React from 'react'
import { info_icon, receipt } from '../assets/icon';
import { CardLayout, SettleNowBtn, TripName } from '../common/TinyComponent';
import { formatAmount } from '../utilis/handyFunctions';

const SettleNonTravelExpense = ({trip, handleActionConfirm}) => {

function financeMsg(amt, cashAdvance, currency){
  const amt1 = formatAmount(amt)

  if (amt >= 0){
    return <div className='text-sx font-cabin text-red-600'>{`${amt1} owed to company.`}</div>
  }else{
    return <div className='text-sx font-cabin text-neutral-700'>{`owed to employee.`}</div>
  }

}


  return (
    <div>
      <CardLayout >
            <div className='w-full py-2'>           
            <div className='flex gap-2 flex-col'> 
            <div className='flex flex-row justify-between'>
            <div className='flex gap-2 items-center'>
                {/* <input onChange={() => handleSelect(trip)} type='checkbox' className='w-4 h-4 accent-indigo-600' checked={isTravelRequestSelected(trip?.travelRequestId)}/> */}
             <div>
                <p className='header-title'>Created By</p>
                <p className='header-text'>{trip?.createdBy?.name ?? <span className='text-center'>-</span>}</p>
              </div>
              </div>

              
              {/* <Button1 text="Take Action" variant="fit" onClick={() => {openModal("expenseDetails");setExpenseDetails(trip)}}/> */}
              {/* <ActionButton approve={"Approve"} reject={"Reject"}/> */}

            {/* <div className='flex items-center justify-center'>
             <img src={info_icon} className='w-4 h-4'/>
              <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'travel-approval-view' )}}}>
                <p className='text-indigo-600 font-semibold'>View Details</p>
              </div>
              </div> */}
              </div>  
             
             {/* <div className='flex flex-row justify-between'>
              
              <TripName tripName={trip?.tripName}/>
             <div className='flex items-center justify-center'>
             <img src={info_icon} className='w-4 h-4'/>
              <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'travel-approval-view' )}}}>
                <p className='text-indigo-600 font-semibold'>View Details</p>
              </div>
              </div>
             </div> */}
              </div>

                    {/* {trip?.expenseType === "Travel Expense" &&
                     <div className='flex gap-2 items-center '>
                     <img src={briefcase} className='w-4 h-4'/>
                     <div className='font-medium font-cabin  text-sm uppercase text-neutral-700 '>
                      {splitTripName(trip?.tripName)}
                     </div>
                     <div className='font-medium font-cabin  text-sm  text-neutral-700 '>
                      {extractAndFormatDate(trip?.tripName)}
                     </div>
                     </div>
                    } */}
                    
                    <div className='mt-2 space-y-2'>
                      {/* {filteredTripExpenses?.map((trExpense, index) => ( */}
                        <div  className='border border-slate-300 rounded-md px-2 py-1'>
                <div className='flex flex-row justify-between items-center py-1  font-cabin font-xs'>
                  <div className='flex gap-4'>
                    <div className='flex gap-2 items-center '>
                      <img src={receipt} className='w-5 h-5'/>
                      <div>
                        <div className='header-title'>Expense Header No.</div>
                        <p className='header-text'>{trip?.expenseHeaderNumber}</p>
                      </div>
                    </div>
              <div>
                <p className='header-title'>Expense Amount</p>
                <div className='font-medium text-sm font-cabin text-neutral-700'>

    <div>
      {`${trip?.defaultCurrency?.shortName ?? "-"} ${formatAmount(trip?.expenseTotalAmount)}`}
    </div>

  </div>
                {/* <p className='header-text'> {financeMsg(trip?.expenseAmountStatus?.totalRemainingCash,trip?.expenseAmountStatus?.totalCashAmount,trip.defaultCurrency.shortName)}</p> */}
              </div>
              </div>
                    
              <div className='flex items-center justify-center'>
              {/* <img src={info_icon} className='w-4 h-4'/> */}
                {/* <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'travel-approval-view' )}}}>
                  <p className='text-indigo-600 font-semibold'>View Details</p>
                </div> */}
                 <SettleNowBtn
            onClick={()=>handleActionConfirm('settleNonTravelExpense',{ expenseHeaderId:trip?.expenseHeaderId})}
            text={"Settle Now"}/>
                </div>
                            {/* <div className={`text-center rounded-sm ${getStatusClass(trip?.expenseHeaderStatus ?? "-")}`}>
                              <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{trip?.expenseHeaderStatus ?? "-"}</p>
                            </div> */}
                            {/* <div onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleTravelExpense(trip?.tripId, filteredTripExpenses?.expenseHeaderId,  'trip-ex-modify' ,)}}} className={`w-7 h-7 bg-indigo-100 rounded-full border border-white flex items-center justify-center ${disableButton(trip?.travelRequestStatus) ? ' cursor-not-allowed opacity-50' : ' cursor-pointer'}`}>
                              <img src={modify} className='w-4 h-4' alt="modify_icon" />
                            </div> */}
                          </div>
                          
                          {/* <div className='overflow-x-hidden overflow-y-auto max-h-[236px] py-1 pt-2 h-auto px-2 space-y-2'>
                            {trip?.expenseLines?.map((line, index) => (
                              <div key={`${index}-line`} className='flex  text-neutral-700 flex-row justify-between items-center font-cabin text-sm'>
                                <div className='bg-indigo-50 border-2 shadow-md shadow-slate-900/50 translate-x-4 border-white p-2 rounded-full'>
                                  <img src={categoryIcons?.[line?.["Category Name"]]} className='w-4 h-4' />
                                </div>
                                <div className='flex border-slate-400 border flex-row justify-between text-neutral-700 flex-1 items-center gap-2 py-4 px-4 pl-6 rounded-md bg-slate-100'>
                                  <div>{line?.["Category Name"]}</div>
                                  <div>{line?.["Currency"]?.shortName} {formatAmount(line?.["Total Amount"])}</div>
                                </div>
                              </div>
                            ))}
                          </div> */}
                        </div>
                      {/* // ))} */}
                    </div>
                  </div>
                  </CardLayout>
    </div>
  )
}

export default SettleNonTravelExpense
