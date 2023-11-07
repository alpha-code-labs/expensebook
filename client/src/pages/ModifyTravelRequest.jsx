import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom'
import axios from 'axios'
import BasicDetails from "./basicDetails/basicDetails";
import Itinerary from "./itinerary/Itinerary"
import Review from "./review/Review"


export default function () {
  //get travel request Id from params
    const {travelRequestId} = useParams()
    console.log(travelRequestId, 'travelRequestId')

    const [loadingTR, setLoadingTR] = useState(true)
    const [loadingOnboardingData, setLoadingOnboardingData] = useState(true)

    //fetch travel request data from backend
    useEffect(()=>{
        axios
        .get(`${TRAVEL_MICROSERVICE_SERVER_URL}/travel-requests/${travelRequestId}`)
        .then((response) => {
            console.log(response.data)
            const travelRequestDetails = response.data
           //set form data...

           const currentFomData = {
                travelRequestId: travelRequestDetails.travelRequestId,
                approvers: travelRequestDetails.approvers,
                tenantId: travelRequestDetails.tenantId,
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
                preferences:travelRequestDetails.preferences,
                travelViolations:travelRequestDetails.travelViolations,
           }

           setFormData(currentFomData)
           setLoadingTR(false)
        })
        .catch(err=>{ 
            console.error(err)
            //handle possible scenarios
        })
    },[])


  const TRAVEL_MICROSERVICE_SERVER_URL = 'http://localhost:8001/travel/api' 
  const EMPLOYEE_ID  = '123'
  const EMPLOYEE_NAME = 'Abhishek Kumar'


  const [formData, setFormData] = useState({
    travelRequestId: null,
    approvers: [],
    tenantId: 144,
    status: 'draft',
    state: 'section0',
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
    travelDocuments:[],
    itinerary: {
      cities:[{from:null, to:null, departure: {date:null, time:null}, return: {date:null, time:null}}],
      hotels:[{class:null, checkIn:null, checkOut:null}],
      cabs:{class:null, dates:[]},
      modeOfTransit:null,
      travelClass:null,
      needsVisa:false,
      needsAirportTransfer:false,
      needsHotel:false,
      needsFullDayCabs:false,
      tripType:{oneWayTrip:true, roundTrip:false, multiCityTrip:false}
    },
    preferences:[],
    travelViolations:{
      tripPurposeViolationMessage:null,
      travelClassViolationMessage:null,
      hotelClassViolationMessage:null,
      cabClassVioilationMessage:null,
    },
  })

  const [onBoardingData, setOnBoardingData] = useState()

  //flags
  
useEffect(() => {
  
  axios
    .get(`${TRAVEL_MICROSERVICE_SERVER_URL}/initial-data/144/${EMPLOYEE_ID}`)
    .then((response) => {
      console.log(response.data.data.onboardingData.onboardingData)
      setOnBoardingData(response.data.data.onboardingData.onboardingData)
      setLoadingOnboardingData(false)
    })
    .catch(err=>{ 
      console.error(err)
      //handle possible scenarios
    })
},[])

  return <>
        {(loadingTR || loadingOnboardingData) && <div>Loading Travel Request...</div>}
      {!loadingTR && !loadingOnboardingData && <Routes>
        <Route path='/' element={<BasicDetails 
                                    formData={formData} 
                                    setFormData={setFormData} 
                                    onBoardingData={onBoardingData}
                                    nextPage={`/modify/${travelRequestId}/section1`} />} />
        <Route path='/section0' element={<BasicDetails 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={`/modify/${travelRequestId}/section1`} />} />
        <Route path='/section1' element={<Itinerary 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={`/modify/${travelRequestId}/section2`}
                                            lastPage={`/modify/${travelRequestId}/section0`} />} />
        <Route path='/section2' element={<Review 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={`/modify/${travelRequestId}/section2`}
                                            lastPage={`/modify/${travelRequestId}/section1`} />} />
      </Routes>}
  </>;
}
