import React from 'react'
import { CardLayout, SettleNowBtn, TripName, Violation } from '../common/TinyComponent'
import { formatAmount, isMultiCurrencyAvailable } from '../utilis/handyFunctions'
import { attachment_icon, cancel, close_icon, file_icon } from '../assets/icon'
import FileUpload from '../common/FileUpload'
import CommentBox from '../common/CommentBox'

const SettleCashAdvance = ({selectAll,handleCommentChange,handleFileUpload,filesForUpload,comments,handleSelect,fileId, setFileId, trip,handleActionConfirm,handleRemoveFile, fileSelected, setFileSelected, selectedFile, setSelectedFile}) => {
  console.log('attachment for finance', selectedFile, fileSelected)
  
 

  return (
    <div>
       <CardLayout index={trip?.tripId}>
            <div  className='w-full py-1 '>
            <div className='flex gap-2 flex-col '> 
            <div className='flex flex-row justify-between'>
                <div className='flex gap-2 items-center'>
                {/* <input onChange={() => handleSelect(trip)} type='checkbox' className='w-4 h-4 accent-indigo-600' checked={isTravelRequestSelected(trip?.travelRequestId)}/> */}
             <div>
                <p className='header-title'>Created By</p>
                <p className='header-text'>{trip?.createdBy?.name ?? <span className='text-center'>-</span>}</p>
             </div>
              </div>

            {/* / */}
            <div className='flex items-center justify-center'>

              {/* <div className={`${trip?.violationsCounter?.total === 0 ? 'hidden':'block'}  flex flex-row gap-2 justify-center items-center text-yellow-200 font-cabin  text-sm`}>
                <img src={violation_icon} className='w-4 h-4'/>
                <p>
  {trip?.violationsCounter?.total} 
  {trip?.violationsCounter?.total === 1 ? ' violation' : ' violations'}
</p>

            </div> */}
            {/* <Violation violationCount={trip?.violationsCounter?.total}/> */}
             
              {/* <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'travel-approval-view' )}}}>
                <p className='text-indigo-600 font-semibold'>View Details</p>
              </div> */}
              </div>
            {/* / */}
              </div>
             <div className='flex flex-row justify-between'>
              
             <TripName tripName={trip?.tripName} />
             {/* <div className='flex items-center justify-center'>
             <img src={info_icon} className='w-4 h-4'/>
              <div className='text-sm font-cabin px-2 py-1 cursor-pointer' onClick={()=>{if(!disableButton(trip?.travelRequestStatus)){handleVisible(trip?.travelRequestId,  'travel-approval-view' )}}}>
                <p className='text-indigo-600 font-semibold'>View Details</p>
              </div>
              </div> */}
             </div>
              </div>
              
              {trip?.cashAdvance && trip?.cashAdvance?.map((advance,index) => (
                <div key={index} className={`px-2 py-2 ${index < trip?.cashAdvance.length-1 && 'border-b border-slate-400 '}`}>
                  <div className='flex justify-between'>
                    <div className='flex flex-row items-center justify-center gap-4'>
                    <input onChange={()=>handleSelect("settleCashadvance", {travelRequestId:trip?.travelRequestId, cashAdvanceId:advance?.cashAdvanceId})} type='checkbox' checked={selectAll?.some(all=> all?.travelRequestId === trip?.travelRequestId && all?.cashAdvanceId === advance?.cashAdvanceId)} className='w-4 h-4 accent-neutral-900' />
                      
                    <div className='flex flex-col justify-center max-w-[120px]'>
                   <div className='font-medium text-sm font-cabin text-neutral-400'>Advance Amount</div>
                   <div className='font-medium text-sm font-cabin text-neutral-700'>
                     {advance?.amountDetails?.map((amount, index) => (
                       <div key={index}>
                         {`${amount.currency.shortName} ${formatAmount(amount.amount)}`}
                         {index < advance.amountDetails.length - 1 && <span>, </span>}
                       </div>
                     ))}
                     </div>
                     </div>
                      </div>
      
  <div className='flex justify-center items-center gap-2'>
                          {advance?.comment}
                            <CommentBox
                              title="Settlement Remarks :"
                              value={
                                comments.find(
                                  (c) =>
                                    c.cashAdvanceId === advance?.cashAdvanceId &&
                                    c.travelRequestId === trip?.travelRequestId
                                )?.comment || ""
                              }
                              onChange={(e) =>
                                handleCommentChange(
                                  trip?.travelRequestId,
                                  advance?.cashAdvanceId,
                                  "comment",
                                  e.target.value
                                )
                              }
                            />
                                      {/* {(fileSelected && fileId === expense?.expenseHeaderId)  ? <> <div className='flex justify-center cursor-default items-center px-2 py-1 bg-slate-100 rounded-md text-xs'><img src={file_icon} className='w-4 h-4' /><p className='w-20 truncate'>{selectedFile?.name}</p></div><img src={close_icon} className='w-4 h-4' onClick={handleRemoveFile}/></> : */}
                                        {filesForUpload?.[advance?.cashAdvanceId]?.name}
                                        <FileUpload 
                                        setFileId={setFileId} 
                                        id={advance?.cashAdvanceId} 
                                        isFileSelected={fileSelected} 
                                        setIsFileSelected={setFileSelected} 
                                        setSelectedFile={(file) =>
                                          handleFileUpload(
                                            trip?.travelRequestId,
                                            advance?.cashAdvanceId,
                                            file
                                          )
                                        }
                                        selectedFile={selectedFile} 
                                      />
                                      {/* // }                      */}
                                   {/* <SettleNowBtn
                                    onClick={()=>handleActionConfirm('settleTravelExpense',{ travelRequestId : trip?.travelRequestId, expenseHeaderId:expense?.expenseHeaderId})}
                                    text={"Settle Now"}/> */}
                                
            {/* {(fileSelected && fileId === trip?.travelRequestId) ? <> <div className='flex justify-center cursor-default items-center px-2 py-1 bg-slate-100 rounded-md text-xs'><img src={file_icon} className='w-4 h-4' /><p className='w-20 truncate'>{selectedFile?.name}</p></div><img src={close_icon} className='w-4 h-4' onClick={handleRemoveFile}/></> :
            <FileUpload 
            id={trip?.travelRequestId} 
            setFileId={setFileId} 
            isFileSelected={fileSelected} 
            setIsFileSelected={setFileSelected} 
            setSelectedFile={setSelectedFile} 
            selectedFile={selectedFile} 
          />} */}
            {/* <SettleNowBtn
            onClick={()=>handleActionConfirm('settleCashAdvance',{ travelRequestId : trip?.travelRequestId, cashAdvanceId:advance?.cashAdvanceId})}
            text={"Settle Now"} disabled={isMultiCurrencyAvailable(advance?.amountDetails) ? false : true} onHover={'Currency unavailable for settlement. Kindly contact your administrator.'}/> */}
                  </div>
                  </div>
                </div>
))}
</div>
            </CardLayout>
    </div>
  )
}

export default SettleCashAdvance
