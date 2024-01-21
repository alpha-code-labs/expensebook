import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route, useParams, useNavigate} from 'react-router-dom'
import axios from 'axios'
import BasicDetails from "./basicDetails/basicDetails";
import Itinerary from "./itineraryLegacy/Itinerary"
import Review from "./review/Review"
import Error from "../components/common/Error";
import { getTravelRequest_API } from "../utils/api";
import Icon from "../components/common/Icon";
import { left_arrow_icon } from "../components/common/Icons";

const TRAVEL_API = import.meta.env.VITE_TRAVEL_API_URL

export default function () {

  //get travel request Id from params
    const {travelRequestId} = useParams()
    console.log(travelRequestId, 'travelRequestId')
    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const [rejectionReason, setRejectionReason] = useState(null)

    const navigate = useNavigate()

    //fetch travel request rejection reason
    useEffect(()=>{
        (async function(){
            const res = await getTravelRequest_API({travelRequestId})
            if(res.err){
                setLoadingErrMsg(res.err)
                return;
            }
            setRejectionReason(res.data.rejectionReason);
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
                    <p className='text-neutral-700 text-md font-semibold font-cabin'>Clear rejected travel request</p>
                </div>

                <div className='w-full bg-slate-50 px-6 py-4 rounded-md mt-10'>
                    <p className='text-neutral-700 text-lg font-semibold'>Your travel request has been rejected</p>
                    <div className="mt-4 text-red-500 px-6 py-2 rounded-md bg-red-200">
                        <p>Rejected because of too many violations</p>
                    </div>
                    <div className='text-sm mt-10'>Please take appropriate action to clear this rejection</div>
                    <div className="flex justify-between mt-6">
                        <div className="text-neutral-500 px-4 py-2 hover:bg-slate-200 bg-slate-100 hover:text-neutral-400 cursor-pointer" onClick={()=>navigate(`/cancel/${travelRequestId}`)}>Cancel</div>
                        <div className="text-neutral-500 px-4 py-2 hover:bg-slate-200 bg-slate-100 hover:text-neutral-400 cursor-pointer" onClick={()=>navigate(`/modify/${travelRequestId}`)}>Modify/Resubmit</div>
                    </div>
                </div>
            </div>

            </div>
        }
      </>
}