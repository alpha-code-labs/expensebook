import { useState, useEffect, createContext, useMemo } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useQuery } from "../utils/hooks";
import BasicDetails from "./basicDetails/BasicDetails";
//import Itinerary from "./itinerary/Itinerary"
import Itinerary from "./itinerary/NewItinerary";
import Review from "./review/Review"
import { getOnboardingData_API } from "../utils/api";
import Error from "../components/common/Error";
import AllocateTravelObjects from './allocations/AllocateTravelObjects'
import SelectTravelType from "./SelectTravelType";

export default function () {
  
  const query = useQuery()
  const travelType = query.get('type')

  const TRAVEL_API = import.meta.env.VITE_TRAVEL_API_URL 
  const EMPLOYEE_ID  = '1002'
  const tenantId = '65cdc0b6832f2c93ee8a3980'
  const EMPLOYEE_NAME = 'Kanhaiya Verma'
  const companyName = 'Studio Innovate'

  const [formData, setFormData] = useState({
    travelRequestId: null,
    approvers: [],
    tenantId: tenantId,
    travelType: 'international',
    tenantName: companyName,
    companyName: companyName,
    travelRequestStatus: 'draft',
    travelRequestState: 'section 0',
    createdBy: {name: EMPLOYEE_NAME, empId: EMPLOYEE_ID},
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

  const [onBoardingData, setOnBoardingData] = useState()

  //flags
  
const [isLoading, setIsLoading] = useState(true)
const [loadingErrMsg, setLoadingErrMsg] = useState(null)


useEffect(() => {
  (async function(){
    const response = await getOnboardingData_API({tenantId, EMPLOYEE_ID, travelType:formData.travelType})
    if(response.err){
      setLoadingErrMsg(response.err)
    }  
    else{
      setOnBoardingData(response.data.onboardingData)
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
                                    nextPage={'/create/section0'} />} />
        <Route path='/section0' element={<BasicDetails 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            lastPage={'/create/'}
                                            nextPage={'/create/section1'} />} />
        <Route path='/section1' element={<Itinerary 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={onBoardingData?.travelAllocationFlags.level3 ?  '/create/allocations' : '/create/section2' }
                                            lastPage={'/create/section0'} />} />
        <Route path='/allocations' element={<AllocateTravelObjects 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={'/create/section2'}
                                            lastPage={'/create/section0'} />} />
        <Route path='/section2' element={<Review 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={'/create/section2'}
                                            lastPage={onBoardingData?.travelAllocationFlags.level3 ? '/create/allocations' :  '/create/section1'} />} />
      </Routes>}
  </>;
}
