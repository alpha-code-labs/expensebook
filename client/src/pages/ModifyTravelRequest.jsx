import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom'
import axios from 'axios'
import BasicDetails from "./basicDetails/BasicDetails";
//import Itinerary from "./itinerary/Itinerary"
import Itinerary from "./itinerary/NewItinerary";
import Review from "./review/Review"
import Error from "../components/common/Error";
import { TR_frontendTransformer } from "../utils/transformers";
import { getTravelRequest_API, getOnboardingData_API } from "../utils/api";
import AllocateTravelObjects from "./allocations/allocateTravelObjects";
import SelectTravelType from "./SelectTravelType";



export default function () {
  //get travel request Id from params
    const {travelRequestId} = useParams()
    console.log(travelRequestId, 'travelRequestId')
    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)

    //hardcoded for now we will get it from dashboard/token
    const tenantId = 'tynod76eu' 
    const EMPLOYEE_ID  = '1001' 
    const EMPLOYEE_NAME = 'Abhishek Kumar'

    const [formData, setFormData] = useState()
    const [onBoardingData, setOnBoardingData] = useState()

    //fetch travel request data from backend
    useEffect(() => {
      (async function(){
         
        const travel_res = await getTravelRequest_API({travelRequestId})
        if(travel_res.err){
          setLoadingErrMsg(travel_res.err)
          return
        }
        const travelRequestDetails = travel_res.data
        const travelType = travelRequestDetails.travelType

        const currentFormData = {
          travelRequestId: travelRequestDetails.travelRequestId,
          approvers: travelRequestDetails.approvers,
          tenantId: travelRequestDetails.tenantId,
          travelType: travelRequestDetails?.travelType,
          tenantName:travelRequestDetails.tenantName,
          companyName:travelRequestDetails.companyName,
          status: travelRequestDetails.status,
          state: travelRequestDetails.state,
          createdBy: travelRequestDetails.createdBy,
          createdFor: travelRequestDetails.createdFor,
          travelAllocationHeaders:travelRequestDetails.travelAllocationHeaders,
          tripPurpose:travelRequestDetails.tripPurpose,

          raisingForDelegator: travelRequestDetails.createdFor === null ? false : true,
          nameOfDelegator: travelRequestDetails?.createdFor?.name || null,
          isDelegatorManager: false,
          selectDelegatorTeamMembers:false,
          delegatorsTeamMembers:[],

          bookingForSelf:true,
          bookiingForTeam:false,
          teamMembers : travelRequestDetails.teamMembers,
          travelDocuments: travelRequestDetails.travelDocuments,
          itinerary: travelRequestDetails.itinerary,
          tripType: travelRequestDetails.tripType,
          preferences:travelRequestDetails.preferences,
          travelViolations:travelRequestDetails.travelViolations,
          cancellationDate:travelRequestDetails.cancellationDate,
          cancellationReason:travelRequestDetails.cancellationReason,
          isCancelled:travelRequestDetails.isCancelled,
          travelRequestStatus:travelRequestDetails.travelRequestStatus,
       }

       const response = await getOnboardingData_API({tenantId, EMPLOYEE_ID, travelType})
        if(response.err){
          setLoadingErrMsg(response.err)
          return
        }


        setFormData(currentFormData)
        setOnBoardingData(response.data.onboardingData)
        console.log(response.data.onboardingData)
        setIsLoading(false)
      })()
    },[])
    
  return <>
        {isLoading && <Error message={loadingErrMsg} />}
      {!isLoading && <Routes>
        <Route path='/' element={<SelectTravelType 
                                    formData={formData} 
                                    setFormData={setFormData}
                                    onBoardingData={onBoardingData} 
                                    nextPage={`/modify/${travelRequestId}/section0`} />} />
        <Route path='/section0' element={<BasicDetails 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            lastPage={`/modify/${travelRequestId}/`}
                                            nextPage={`/modify/${travelRequestId}/section1`} />} />
        <Route path='/section1' element={<Itinerary 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={`/modify/${travelRequestId}/allocation`}
                                            lastPage={`/modify/${travelRequestId}/section0`} />} />
        <Route path='/allocation' element={<AllocateTravelObjects 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={`/modify/${travelRequestId}/section2`}
                                            lastPage={`/modify/${travelRequestId}/section1`} />} />
        <Route path='/section2' element={<Review 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={`/modify/${travelRequestId}/section2`}
                                            lastPage={`/modify/${travelRequestId}/allocation`} />} />
      </Routes>}
  </>;
}
