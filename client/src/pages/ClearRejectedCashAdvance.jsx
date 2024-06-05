import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route, useParams, useNavigate} from 'react-router-dom'
import Error from "../components/common/Error";
import { getTravelRequest_API } from "../utils/api";
import Icon from "../components/common/Icon";
import { left_arrow_icon } from "../assets/icon";
import { getCashAdvance_API } from "../utils/api";

export default function () {

  //get travel request Id from params
    const {travelRequestId, cashAdvanceId} = useParams()
    console.log(travelRequestId, cashAdvanceId, 'travelRequestId, cashAdvanceId')
    const [isLoading, setIsLoading] = useState(true)
    const [cashAdvance, setCashAdvance] = useState({amountDetails:[{currency:{shortName: 'INR'}, amount:5000}, {currency:{shortName: 'USD'}, amount:500}]})

    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const [rejectionReason, setRejectionReason] = useState(null)

    const navigate = useNavigate()

    //fetch cash advance details (rejection reason is only required field)
    useEffect(()=>{
        (async function(){
            const res = await getCashAdvance_API({travelRequestId, cashAdvanceId})
            if(res.err){
                setLoadingErrMsg(res.err)
                return;
            }
            console.log(res.data)
            setRejectionReason(res.data.cashAdvance?.cashAdvanceRejectionReason??'Requested amount exceeds allowed cash advance limit');
            setCashAdvance(res.data.cashAdvance)
            setIsLoading(false)
        })()
    },[])

  return <>
        {isLoading && <Error message={loadingErrMsg} />}

        {!isLoading && <div className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
            {/* app icon */}
            <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
                <Icon/>
            </div>

            {/* Rest of the section */}
            <div className="w-full h-full mt-10 p-10 font-cabin tracking-tight">
                {/* back link */}
                <div className='flex items-center gap-4 cursor-pointer'>
                    <img className='w-[24px] h-[24px]' src={left_arrow_icon} />
                    <p className='text-neutral-700 text-md font-semibold font-cabin'>Clear rejected cash advance</p>
                </div>

                <div className='w-full bg-slate-50 px-6 py-4 rounded-md mt-10'>
                    <p className='text-neutral-700 text-lg font-semibold'>Your Cash Advance has been rejected</p>
                    <p className='text-neutral-500 text-sm tracking-tight mt-2'>
                        {`Cash Advnce Number: ${cashAdvance?.cashAdvanceNumber} associated with Travel Request Number: ${cashAdvance?.travelRequestNumber}`}
                    </p>
                    <p className='text-sm text-neutral-500 mt-2'>Amount Details</p>
                    <div className='mt-1 flex-col gap-1'>
                        {cashAdvance.amountDetails.map(amt=>
                        <div className="text-sm flex gap-1">
                            <p className='text-neutral-600'>{amt?.currency?.shortName}</p>
                            <p className='text-neutral-600'>{amt?.amount}</p>
                        </div>)}
                    </div>
                    <div className="mt-4 text-red-500 px-6 py-2 rounded-md bg-red-200">
                        <p>{rejectionReason}</p>
                    </div>
                    <div className='text-sm mt-10'>Please take appropriate action to clear this rejection</div>
                    <div className="flex justify-between mt-6">
                        <div className="text-neutral-500 px-4 py-2 hover:bg-slate-200 bg-slate-100 hover:text-neutral-400 cursor-pointer" onClick={()=>navigate(`/cancel/advance/${travelRequestId}/${cashAdvanceId}`)}>Cancel</div>
                        <div className="text-neutral-500 px-4 py-2 hover:bg-slate-200 bg-slate-100 hover:text-neutral-400 cursor-pointer" onClick={()=>navigate(`/modify/advance/${travelRequestId}/${cashAdvanceId}`)}>Modify/Resubmit</div>
                    </div>
                </div>
            </div>

            </div>
        }
      </>
}