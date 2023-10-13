import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import axios from 'axios'

import "./App.css";
import Page_1 from './pages/legacy/Page_1'
import BasicDetails from "./pages/basicDetails/basicDetails";
import Itinerary from "./pages/itinerary/Itinerary"
import Review from "./pages/review/Review"


function App() {
  
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
    })
    .catch(err=>{ 
      console.err(err)
      //handle possible scenarios
    })
},[])


  return <>
    <Router>
      <Routes>
        <Route path='/' element={<Page_1 formData={formData} setFormData={setFormData} onBoardingData={onBoardingData} />} />
        <Route path='/section0' element={<BasicDetails formData={formData} setFormData={setFormData} onBoardingData={onBoardingData} />} />
        <Route path='/section1' element={<Itinerary formData={formData} setFormData={setFormData} onBoardingData={onBoardingData} />} />
        <Route path='/section2' element={<Review formData={formData} setFormData={setFormData} onBoardingData={onBoardingData} />} />
      </Routes>
    </Router>
  </>;
}

export default App;