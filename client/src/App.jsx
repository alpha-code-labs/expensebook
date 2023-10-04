import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
//import axios from 'axios'

import "./App.css";
import Page_1 from './pages/Page_1'
import Page_2 from './pages/Page_2'
import Page_3 from './pages/Page_3'
import Page_4 from './pages/Page_4'


function App() {
  
  const TRAVEL_MICROSERVICE_SERVER_URL = "";
/* 
  const onBoardingData = {
    MANAGER_FLAG:true,
    APPROVAL_FLAG:true,
    managersList:[],
    teamMembers:[],
    tripPurposeOptions:[],
    delegatedFor:[],
    travelAllocationHeaderOptions:[],
    modeOfTransitOptions:[],
    travelClassOptions:[],
    hotelClassOptions:[],
  }

  */

  //dummy onboarding..

  const teamMembers2 = [{name: 'Rajat Rathor', empId: '201', designation: 'Executive'}, {name: 'Ashish Pundir', empId: '205', designation: 'Program Planner'}, {name: 'Ankit Pundir', empId:'209', designation:'Manager'}]
  const EMPLOYEE_ID  = '123'

  const onBoardingData = {
    MANAGER_FLAG:true,
    APPROVAL_FLAG:true,
    ALLOCATION_HEADER:true,
    DELEGATED_FLAG:true,
    managersList:[
      {name: 'Preeti Arora', empId: '005'},
      {name: 'Abhas Kamboj', empId: '045'},
      {name: 'Sandeep Nair', empId: '061'},
      {name: 'Sumesh', empId: '114'},
      {name: 'Prabhat', empId: '181'},
  ],
    teamMembers:[],
    tripPurposeOptions:['Meeting with client', 'Sales Trip', 'Business Trip'],
    delegatedFor:[
      {name: 'Ajay Singh', empId:'121', group:'', EmpRole:'', teamMembers:[]}, 
      {name: 'Abhijay Singh', empId:'124', group:'', EmpRole:'', teamMembers:teamMembers2}, 
      {name: 'Akshay Kumar', empId:'127', group:'', EmpRole:'', teamMembers:[]}, 
      {name:'Anandhu Ashok K.', empId:'129', group:'', EmpRole:'', teamMembers:[]}, 
      {name:'kanhaiya', empId:'', group:'135', EmpRole:'', teamMembers:[]}
  ],
    travelAllocationHeaderOptions:['Sales', 'Marketing', 'Engineering', 'Research'],
    modeOfTransitOptions:['Flight', 'Train', 'Bus', 'Cab'],
    travelClassOptions:{'flight':['Business', 'Economy', 'Premium Economy', 'Private'],
    'train': ['Sleeper', 'Chair Car', 'First AC', 'Second AC', 'Third AC'],
    'bus': ['Sleeper', 'Semi-Sleeper', 'Regular'],
    'cab': ['Sedan', 'Mini']
   },
    hotelClassOptions:['4 Star',  '3 Start', '2 Star'],
    cabClassOptions: ['Sedan', 'Mini'],

  }


  const [formData, setFormData] = useState({
    status: 'draft',
    state: 'section0',
    createdBy: EMPLOYEE_ID,
    createdFor: [],
    travelAllocationHeaders:[],
    itinerary: {
      cities:[{from:null, to:null, departure: {date:null, time:null}, return: {date:null, time:null}}],
      hotels:[],
      cabs:[],
      modeOfTransit:null,
      travelClass:null,
      needsVisa:false,
      needsAirportTransfer:false,
      needsHotel:false,
      needsFullDayCabs:false,
      tripType:{oneWayTrip:true, roundTrip:false, multiCityTrip:false}
    }
  })




  
  //flags
  
/*
  axios
    .get(`${TRAVEL_MICROSERVICE_SERVER_URL}/initial-data`)
    .then((response) => {

    })
    .catch(err=>{ 
      console.err(err)
      //handle possible scenarios
    })
*/

  return <>
    <Router>
      <Routes>
        <Route path='/' element={<Page_1 formData={formData} setFormData={setFormData} onBoardingData={onBoardingData} />} />
        <Route path='/section0' element={<Page_1 formData={formData} setFormData={setFormData} onBoardingData={onBoardingData} />} />
        <Route path='/section1' element={<Page_2 formData={formData} setFormData={setFormData} onBoardingData={onBoardingData} />} />
        <Route path='/section2' element={<Page_3 formData={formData} setFormData={setFormData} onBoardingData={onBoardingData} />} />
        <Route path='/section3' element={<Page_4 formData={formData} setFormData={setFormData} onBoardingData={onBoardingData} />} />
      </Routes>
    </Router>
  </>;
}

export default App;
