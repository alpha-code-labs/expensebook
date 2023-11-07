import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import axios from 'axios'
import BasicDetails from "./basicDetails/basicDetails";
import Itinerary from "./itinerary/Itinerary"
import Review from "./review/Review"


export default function () {
  
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
      console.error(err)
      //handle possible scenarios
    })
},[])

  return <>  
      <Routes>
        <Route path='/' element={<BasicDetails 
                                    formData={formData} 
                                    setFormData={setFormData} 
                                    onBoardingData={onBoardingData} 
                                    nextPage={'/create/section1'} />} />
        <Route path='/section0' element={<BasicDetails 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={'/create/section1'} />} />
        <Route path='/section1' element={<Itinerary 
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
                                            lastPage={'/create/section1'} />} />
      </Routes>
  </>;
}
