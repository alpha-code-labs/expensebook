import React from 'react'
import { close_icon, file_icon, info_icon, receipt } from '../assets/icon';
import { CardLayout, SettleNowBtn, TripName } from '../common/TinyComponent';
import { formatAmount } from '../utilis/handyFunctions';
import FileUpload from '../common/FileUpload';
import CommentBox from '../common/CommentBox';

const SettleTravelExpense = ({length, selectAll, comments, filesForUpload, handleFileUpload, handleCommentChange, handleSelect, fileId, setFileId, trip, handleActionConfirm, handleRemoveFile, fileSelected, setFileSelected, selectedFile, setSelectedFile}) => {

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
            <div className='w-full py-1'>           
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
             
             <div className='flex flex-row justify-between'>
              
              <TripName tripName={trip?.tripName}/>
             {/* <div className='flex items-center justify-center'>
             <img src={info_icon} className='w-4 h-4'/>
              <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'travel-approval-view' )}}}>
                <p className='text-indigo-600 font-semibold'>View Details</p>
              </div>
              </div> */}
             </div>
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
                       {trip?.travelExpenseData.map((expense,index)=>
                       
                       (
                        <div key={index}  className='border border-slate-300 rounded-md px-2 py-1'>
                        <div className='flex flex-row justify-between items-center py-1  font-cabin font-xs'>
                          <div className='flex gap-4'>
                            <div className='flex gap-2 items-center'>
                            <input onChange={()=>handleSelect("settleTravelExpense", {travelRequestId:trip?.travelRequestId, expenseHeaderId:expense?.expenseHeaderId})} type='checkbox' checked={selectAll?.some(all=> all?.travelRequestId === trip?.travelRequestId && all?.expenseHeaderId === expense?.expenseHeaderId)} className='w-4 h-4 accent-neutral-900' />
                              <img src={receipt} className='w-5 h-5'/>
                              <div>
                                <div className='header-title'>Expense Header No.</div>
                                <p className='header-text'>{expense?.expenseHeaderNumber}</p>
                              </div>
                            </div>
                      <div>
                        <p className='header-title'>Expense Amount</p>
                        <div className='font-medium text-sm font-cabin text-neutral-700'>
        
            <div >
              {`${expense?.defaultCurrency?.shortName} ${formatAmount(expense?.expenseAmountStatus?.totalAlreadyBookedExpenseAmount - expense?.expenseAmountStatus?.totalExpenseAmount)}`}
            </div>
        
                      </div>
                        <p className='header-text'> {financeMsg(expense?.expenseAmountStatus?.totalRemainingCash,expense?.expenseAmountStatus?.totalCashAmount,expense.defaultCurrency.shortName)}</p>
                      </div>
                      </div>
                            
                            <div className='flex items-center justify-center gap-2'>
                              {expense?.comment}
                              <CommentBox
                    title="Settlement Remarks :"
                    value={
                      comments.find(
                        (c) =>
                          c.expenseHeaderId === expense?.expenseHeaderId &&
                          c.travelRequestId === trip?.travelRequestId
                      )?.comment || ""
                    }
                    onChange={(e) =>
                      handleCommentChange(
                        trip?.travelRequestId,
                        expense?.expenseHeaderId,
                        "comment",
                        e.target.value
                      )
                    }
                  />
                            {/* {(fileSelected && fileId === expense?.expenseHeaderId)  ? <> <div className='flex justify-center cursor-default items-center px-2 py-1 bg-slate-100 rounded-md text-xs'><img src={file_icon} className='w-4 h-4' /><p className='w-20 truncate'>{selectedFile?.name}</p></div><img src={close_icon} className='w-4 h-4' onClick={handleRemoveFile}/></> : */}
                              {filesForUpload?.[expense?.expenseHeaderId]?.name}
                              <FileUpload 
                              setFileId={setFileId} 
                              id={expense?.expenseHeaderId} 
                              isFileSelected={fileSelected} 
                              setIsFileSelected={setFileSelected} 
                              setSelectedFile={(file) =>
                                handleFileUpload(
                                  trip?.travelRequestId,
                                  expense?.expenseHeaderId,
                                  file
                                )
                              }
                              selectedFile={selectedFile} 
                            />
                            {/* // }                      */}
                         {/* <SettleNowBtn
                          onClick={()=>handleActionConfirm('settleTravelExpense',{ travelRequestId : trip?.travelRequestId, expenseHeaderId:expense?.expenseHeaderId})}
                          text={"Settle Now"}/> */}
                        </div>
                                   
                                  </div>
                                  
                               
                                </div>

                       ))} 
                     
                    </div>
                  </div>
                  </CardLayout>
    </div>
  )
}

export default SettleTravelExpense
