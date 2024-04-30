import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom'
import axios from 'axios'
import BasicDetails from "./basicDetails/BasicDetails";
import Review from "./review/Review"
import Error from "../components/common/Error";
import { TR_frontendTransformer } from "../utils/transformers";
import { getTravelRequest_API, getOnboardingData_API } from "../utils/api";
import AllocateTravelObjects from "./allocations/AllocateTravelObjects";
import SelectTravelType from "./SelectTravelType";
import ModifiedItinerary from "./ModifiedItinerary";
import { generateUniqueIdentifier } from "../utils/uuid";


export default function () {
  //get travel request Id from params
    const {travelRequestId} = useParams()
    console.log(travelRequestId, 'travelRequestId')
    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const [formData, setFormData] = useState()
    const [onBoardingData, setOnBoardingData] = useState()

    const [currentFormState, setCurrentFormState] = useState({
      isReturnTravel: false,
      itinerary: [
      {
          formId: generateUniqueIdentifier(),
          mode : 'flight',
          from : '',
          to : '',
          date: new Date().toISOString,
          returnDate: undefined,
          hotelNights: '',
          pickUpNeeded: false,
          dropNeeded: false,
          fullDayCabs: 0,
          fullDayCabDates: [],
          dateError:{set:false, message:null},
          returnDateError:{set:false, message:null},
          fromError: {set:false, message:null},
          toError: {set:false, message:null},
      }
  ]});

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
          ...travelRequestDetails /* other travel request details */
       }

       console.log(travelRequestDetails.formData);
       
       if(travelRequestDetails.formData != null && travelRequestDetails.formData.itinerary!=undefined){
        setCurrentFormState(travelRequestDetails.formData);
       }

        const response = await getOnboardingData_API({tenantId:travelRequestDetails.tenantId, employeeId:travelRequestDetails.createdBy.empId, travelType:travelRequestDetails.travelType})
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
        <Route path='/section1' element={<ModifiedItinerary
                                            currentFormState={currentFormState}
                                            setCurrentFormState={setCurrentFormState}
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={onBoardingData?.travelAllocationFlags.level3 ?  `/modify/${travelRequestId}/allocation` : `/modify/${travelRequestId}/section2` }
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
                                            currentFormState={currentFormState}
                                            onBoardingData={onBoardingData}
                                            nextPage={`/modify/${travelRequestId}/section2`}
                                            lastPage={onBoardingData?.travelAllocationFlags.level3 ? `/modify/${travelRequestId}/allocation` :  `/modify/${travelRequestId}/section1`}
                                             />} />
      </Routes>}
  </>;
}


// import { useState, useEffect, createContext } from "react";
// import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom'
// import axios from 'axios'
// import BasicDetails from "./basicDetails/BasicDetails";
// //import Itinerary from "./itinerary/Itinerary"
// import Itinerary from "./itinerary/NewItinerary";
// import Review from "./review/Review"
// import Error from "../components/common/Error";
// import { TR_frontendTransformer } from "../utils/transformers";
// import { getTravelRequest_API, getOnboardingData_API } from "../utils/api";
// import AllocateTravelObjects from "./allocations/AllocateTravelObjects";
// import SelectTravelType from "./SelectTravelType";



// export default function () {
//   //get travel request Id from params
//     const {travelRequestId} = useParams()
//     console.log(travelRequestId, 'travelRequestId')
//     const [isLoading, setIsLoading] = useState(true)
//     const [loadingErrMsg, setLoadingErrMsg] = useState(null)
//     const [formData, setFormData] = useState()
//     const [onBoardingData, setOnBoardingData] = useState()

//     //fetch travel request data from backend
//     useEffect(() => {
//       (async function(){
         
//         const travel_res = await getTravelRequest_API({travelRequestId})
//         if(travel_res.err){
//           setLoadingErrMsg(travel_res.err)
//           return
//         }
//         const travelRequestDetails = travel_res.data
//         const travelType = travelRequestDetails.travelType


//         const currentFormData = {
//           travelRequestId: travelRequestDetails.travelRequestId,
//           approvers: travelRequestDetails.approvers,
//           tenantId: travelRequestDetails.tenantId,
//           travelType: travelRequestDetails?.travelType,
//           tenantName:travelRequestDetails.tenantName,
//           companyName:travelRequestDetails.companyName,
//           status: travelRequestDetails.status,
//           state: travelRequestDetails.state,
//           createdBy: travelRequestDetails.createdBy,
//           createdFor: travelRequestDetails.createdFor,
//           travelAllocationHeaders:travelRequestDetails.travelAllocationHeaders,
//           tripPurpose:travelRequestDetails.tripPurpose,

//           raisingForDelegator: travelRequestDetails.createdFor === null ? false : true,
//           nameOfDelegator: travelRequestDetails?.createdFor?.name || null,
//           isDelegatorManager: false,
//           selectDelegatorTeamMembers:false,
//           delegatorsTeamMembers:[],

//           bookingForSelf:true,
//           bookiingForTeam:false,
//           teamMembers : travelRequestDetails.teamMembers,
//           travelDocuments: travelRequestDetails.travelDocuments,
//           itinerary: travelRequestDetails.itinerary,
//           tripType: travelRequestDetails.tripType,
//           preferences:travelRequestDetails.preferences,
//           travelViolations:travelRequestDetails.travelViolations,
//           cancellationDate:travelRequestDetails.cancellationDate,
//           cancellationReason:travelRequestDetails.cancellationReason,
//           isCancelled:travelRequestDetails.isCancelled,
//           travelRequestStatus:travelRequestDetails.travelRequestStatus,
//           ...travelRequestDetails /* other travel request details */
//        }

//         const response = await getOnboardingData_API({tenantId:travelRequestDetails.tenantId, employeeId:travelRequestDetails.createdBy.empId, travelType:travelRequestDetails.travelType})
//         if(response.err){
//           setLoadingErrMsg(response.err)
//           return
//         }

//         setFormData(currentFormData)
//         setOnBoardingData(response.data.onboardingData)
//         console.log(response.data.onboardingData)
//         setIsLoading(false)
//       })()
//     },[])
    
//   return <>
//         {isLoading && <Error message={loadingErrMsg} />}
//       {!isLoading && <Routes>
//         <Route path='/' element={<SelectTravelType 
//                                     formData={formData} 
//                                     setFormData={setFormData}
//                                     onBoardingData={onBoardingData} 
//                                     nextPage={`/modify/${travelRequestId}/section0`} />} />
//         <Route path='/section0' element={<BasicDetails 
//                                             formData={formData} 
//                                             setFormData={setFormData} 
//                                             onBoardingData={onBoardingData}
//                                             lastPage={`/modify/${travelRequestId}/`}
//                                             nextPage={`/modify/${travelRequestId}/section1`} />} />
//         <Route path='/section1' element={<Itinerary 
//                                             formData={formData} 
//                                             setFormData={setFormData} 
//                                             onBoardingData={onBoardingData}
//                                             nextPage={onBoardingData?.travelAllocationFlags.level3 ?  `/modify/${travelRequestId}/allocation` : `/modify/${travelRequestId}/section2` }
//                                             lastPage={`/modify/${travelRequestId}/section0`} />} />
//         <Route path='/allocation' element={<AllocateTravelObjects 
//                                             formData={formData} 
//                                             setFormData={setFormData} 
//                                             onBoardingData={onBoardingData}
//                                             nextPage={`/modify/${travelRequestId}/section2`}
//                                             lastPage={`/modify/${travelRequestId}/section1`} />} />
//         <Route path='/section2' element={<Review 
//                                             formData={formData} 
//                                             setFormData={setFormData} 
//                                             onBoardingData={onBoardingData}
//                                             nextPage={`/modify/${travelRequestId}/section2`}
//                                             lastPage={onBoardingData?.travelAllocationFlags.level3 ? `/modify/${travelRequestId}/allocation` :  `/modify/${travelRequestId}/section1`}
//                                              />} />
//       </Routes>}
//   </>;
// }
