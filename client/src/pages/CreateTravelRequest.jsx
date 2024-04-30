import { useState, useEffect, createContext, useMemo } from "react";
import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom'
import BasicDetails from "./basicDetails/BasicDetails";
//import Itinerary from "./itinerary/Itinerary"
import Itinerary from "./itinerary/NewItinerary";
import Review from "./review/Review"
import { getOnboardingData_API } from "../utils/api";
import Error from "../components/common/Error";
import AllocateTravelObjects from './allocations/AllocateTravelObjects'
import SelectTravelType from "./SelectTravelType";
import ModifiedItinerary from "./ModifiedItinerary";
import { generateUniqueIdentifier } from "../utils/uuid";

export default function () {

  const TRAVEL_API = import.meta.env.VITE_TRAVEL_API_URL 
  const {tenantId, employeeId} = useParams();

  console.log(tenantId, employeeId, 'tId, employeeId')
  const EMPLOYEE_NAME = 'Kanhaiya Verma'
  const companyName = 'Studio Innovate'

  const [employeeName, setEmployeeName] = useState('')

  const [formData, setFormData] = useState({
    travelRequestId: null,
    approvers: [],
    tenantId: tenantId,
    travelType: 'international',
    tenantName: companyName,
    companyName: companyName,
    travelRequestStatus: 'draft',
    travelRequestState: 'section 0',
    createdBy: {name: employeeName, empId: employeeId},
    createdFor: null,
    travelAllocationHeaders:[],
    tripPurpose:null,
    
    raisingForDelegator:false,
    nameOfDelegator:null,
    isDelegatorManager:false,
    selectDelegatorTeamMembers:false,
    delegatorsTeamMembers:[],

    bookingForSelf:true,
    bookiingForTeam:false,
    teamMembers : [],
    sentToTrip:false,
    itinerary: {
      carRentals:[],
      cabs:[],
      trains:[],
      flights:[],
      buses:[],
      personalVehicles:[],
      hotels:[]
    },

    travelDocuments:[],
    tripType:{oneWayTrip:true, roundTrip:false, multiCityTrip:false},
    preferences:[],
    travelViolations:{
      tripPurpose:null,
      class:null,
      amount:null,
    },
    isCancelled:false,
    cancellationDate:null,
    cancellationReason:null,
    isCashAdvanceTaken:null,
    sentToTrip:false,
  })

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

  const [onBoardingData, setOnBoardingData] = useState()

  //flags
  
const [isLoading, setIsLoading] = useState(true)
const [loadingErrMsg, setLoadingErrMsg] = useState(null)


useEffect(() => {
  (async function(){
    const response = await getOnboardingData_API({tenantId, employeeId, travelType:formData.travelType})
    if(response.err){
      setLoadingErrMsg(response.err)
    }  
    else{
      setOnBoardingData(response.data.onboardingData)
      if(response?.data?.onboardingData?.employeeData?.employeeDetails?.employeeName!= null || response?.data?.onboardingData?.employeeDetails?.employeeName!=undefined){
        console.log('setting name to ', response?.data?.onboardingData?.employeeData?.employeeDetails?.employeeName )
        setFormData(pre=>({...pre, createdBy:{...pre.createdBy, name:response?.data?.onboardingData?.employeeData?.employeeDetails?.employeeName}}))
      }
      
      console.log(response.data.onboardingData)
      setIsLoading(false)
    }
  })()
},[formData.travelType])


  return <>  
      {isLoading && <Error message={loadingErrMsg} />}

      {!isLoading &&
      <Routes>
        <Route path='/' element={<SelectTravelType 
                                    formData={formData} 
                                    setFormData={setFormData}
                                    onBoardingData={onBoardingData}
                                    setOnBoardingData={setOnBoardingData} 
                                    nextPage={`/create/${tenantId}/${employeeId}/section0`} />} />
        <Route path='/section0' element={<BasicDetails 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            lastPage={`/create/${tenantId}/${employeeId}/`}
                                            nextPage={`/create/${tenantId}/${employeeId}/section1`} />} />
        {/* <Route path='/section1' element={<Itinerary 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={onBoardingData?.travelAllocationFlags.level3 ?  `/create/${tenantId}/${employeeId}/allocations` : `/create/${tenantId}/${employeeId}/section2` }
                                            lastPage={`/create/${tenantId}/${employeeId}/section0`} />} /> */}
        <Route path='/section1' element={<ModifiedItinerary
                                            currentFormState={currentFormState}
                                            setCurrentFormState={setCurrentFormState}
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={onBoardingData?.travelAllocationFlags.level3 ?  `/create/${tenantId}/${employeeId}/allocations` : `/create/${tenantId}/${employeeId}/section2` }
                                            lastPage={`/create/${tenantId}/${employeeId}/section0`} />} />

        <Route path='/allocations' element={<AllocateTravelObjects 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={`/create/${tenantId}/${employeeId}/section2`}
                                            lastPage={`/create/${tenantId}/${employeeId}/section0`} />} />
        <Route path='/section2' element={<Review 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={`/create/${tenantId}/${employeeId}/section2`}
                                            lastPage={onBoardingData?.travelAllocationFlags.level3 ? `/create/${tenantId}/${employeeId}/allocations` :  `/create/${tenantId}/${employeeId}/section1`} />} />
      </Routes>}
  </>;
}


// import { useState, useEffect, createContext, useMemo } from "react";
// import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom'
// import BasicDetails from "./basicDetails/BasicDetails";
// //import Itinerary from "./itinerary/Itinerary"
// import Itinerary from "./itinerary/NewItinerary";
// import Review from "./review/Review"
// import { getOnboardingData_API } from "../utils/api";
// import Error from "../components/common/Error";
// import AllocateTravelObjects from './allocations/AllocateTravelObjects'
// import SelectTravelType from "./SelectTravelType";
// import ModifiedItinerary from "./ModifiedItinerary";
// import { generateUniqueIdentifier } from "../utils/uuid";

// export default function () {

//   const TRAVEL_API = import.meta.env.VITE_TRAVEL_API_URL 
//   const {tenantId, employeeId} = useParams();

//   console.log(tenantId, employeeId, 'tId, employeeId')
//   const EMPLOYEE_NAME = 'Kanhaiya Verma'
//   const companyName = 'Studio Innovate'

//   const [employeeName, setEmployeeName] = useState('')

//   const [formData, setFormData] = useState({
//     travelRequestId: null,
//     approvers: [],
//     tenantId: tenantId,
//     travelType: 'international',
//     tenantName: companyName,
//     companyName: companyName,
//     travelRequestStatus: 'draft',
//     travelRequestState: 'section 0',
//     createdBy: {name: employeeName, empId: employeeId},
//     createdFor: null,
//     travelAllocationHeaders:[],
//     tripPurpose:null,
    
//     raisingForDelegator:false,
//     nameOfDelegator:null,
//     isDelegatorManager:false,
//     selectDelegatorTeamMembers:false,
//     delegatorsTeamMembers:[],

//     bookingForSelf:true,
//     bookiingForTeam:false,
//     teamMembers : [],
//     sentToTrip:false,
//     itinerary: {
//       carRentals:[],
//       cabs:[],
//       trains:[],
//       flights:[],
//       buses:[],
//       personalVehicles:[],
//       hotels:[]
//     },

//     travelDocuments:[],
//     tripType:{oneWayTrip:true, roundTrip:false, multiCityTrip:false},
//     preferences:[],
//     travelViolations:{
//       tripPurpose:null,
//       class:null,
//       amount:null,
//     },
//     isCancelled:false,
//     cancellationDate:null,
//     cancellationReason:null,
//     isCashAdvanceTaken:null,
//     sentToTrip:false,
//   })

//   const [currentFormState, setCurrentFormState] = useState({
//     isReturnTravel: false,
//     itinerary: [
//     {
//         formId: generateUniqueIdentifier(),
//         mode : 'flight',
//         from : '',
//         to : '',
//         date: new Date().toISOString,
//         returnDate: undefined,
//         hotelNights: '',
//         pickUpNeeded: false,
//         dropNeeded: false,
//         fullDayCabs: 0,
//         fullDayCabDates: [],
//         dateError:{set:false, message:null},
//         returnDateError:{set:false, message:null},
//         fromError: {set:false, message:null},
//         toError: {set:false, message:null},
//     }
// ]});

//   const [onBoardingData, setOnBoardingData] = useState()

//   //flags
  
// const [isLoading, setIsLoading] = useState(true)
// const [loadingErrMsg, setLoadingErrMsg] = useState(null)


// useEffect(() => {
//   (async function(){
//     const response = await getOnboardingData_API({tenantId, employeeId, travelType:formData.travelType})
//     if(response.err){
//       setLoadingErrMsg(response.err)
//     }  
//     else{
//       setOnBoardingData(response.data.onboardingData)
//       if(response?.data?.onboardingData?.employeeData?.employeeDetails?.employeeName!= null || response?.data?.onboardingData?.employeeDetails?.employeeName!=undefined){
//         console.log('setting name to ', response?.data?.onboardingData?.employeeData?.employeeDetails?.employeeName )
//         setFormData(pre=>({...pre, createdBy:{...pre.createdBy, name:response?.data?.onboardingData?.employeeData?.employeeDetails?.employeeName}}))
//       }
      
//       console.log(response.data.onboardingData)
//       setIsLoading(false)
//     }
//   })()
// },[formData.travelType])


//   return <>  
//       {isLoading && <Error message={loadingErrMsg} />}

//       {!isLoading &&
//       <Routes>
//         <Route path='/' element={<SelectTravelType 
//                                     formData={formData} 
//                                     setFormData={setFormData}
//                                     onBoardingData={onBoardingData}
//                                     setOnBoardingData={setOnBoardingData} 
//                                     nextPage={`/create/${tenantId}/${employeeId}/section0`} />} />
//         <Route path='/section0' element={<BasicDetails 
//                                             formData={formData} 
//                                             setFormData={setFormData} 
//                                             onBoardingData={onBoardingData}
//                                             lastPage={`/create/${tenantId}/${employeeId}/`}
//                                             nextPage={`/create/${tenantId}/${employeeId}/section1`} />} />
//         {/* <Route path='/section1' element={<Itinerary 
//                                             formData={formData} 
//                                             setFormData={setFormData} 
//                                             onBoardingData={onBoardingData}
//                                             nextPage={onBoardingData?.travelAllocationFlags.level3 ?  `/create/${tenantId}/${employeeId}/allocations` : `/create/${tenantId}/${employeeId}/section2` }
//                                             lastPage={`/create/${tenantId}/${employeeId}/section0`} />} /> */}
//         <Route path='/section1' element={<ModifiedItinerary
//                                             currentFormState={currentFormState}
//                                             setCurrentFormState={setCurrentFormState}
//                                             formData={formData} 
//                                             setFormData={setFormData} 
//                                             onBoardingData={onBoardingData}
//                                             nextPage={onBoardingData?.travelAllocationFlags.level3 ?  `/create/${tenantId}/${employeeId}/allocations` : `/create/${tenantId}/${employeeId}/section2` }
//                                             lastPage={`/create/${tenantId}/${employeeId}/section0`} />} />

//         <Route path='/allocations' element={<AllocateTravelObjects 
//                                             formData={formData} 
//                                             setFormData={setFormData} 
//                                             onBoardingData={onBoardingData}
//                                             nextPage={`/create/${tenantId}/${employeeId}/section2`}
//                                             lastPage={`/create/${tenantId}/${employeeId}/section0`} />} />
//         <Route path='/section2' element={<Review 
//                                             formData={formData} 
//                                             setFormData={setFormData} 
//                                             onBoardingData={onBoardingData}
//                                             nextPage={`/create/${tenantId}/${employeeId}/section2`}
//                                             lastPage={onBoardingData?.travelAllocationFlags.level3 ? `/create/${tenantId}/${employeeId}/allocations` :  `/create/${tenantId}/${employeeId}/section1`} />} />
//       </Routes>}
//   </>;
// }
