import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import axios from 'axios'
import BasicDetails from "./basicDetails/basicDetails";
import Itinerary from "./itinerary/Itinerary"
import Review from "./review/Review"


export default function () {
  
  const TRAVEL_API = import.meta.env.VITE_TRAVEL_API_URL 
  const EMPLOYEE_ID  = '1001'
  const tenantId = 'tynod76eu'
  const EMPLOYEE_NAME = 'Abhishek Kumar'


  const [formData, setFormData] = useState({
    travelRequestId: null,
    approvers: [],
    tenantId:tenantId,
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


    itinerary: [{
      journey:{
        from:null, 
        to:null, 
        departure:{date:null, time:null, isModified:false, isCanceled:false, cancellationDate:null, cancellationReason:null} , 
        return:{date:null, time:null, isModified:false, isCanceled:false, cancellationDate:null, cancellationReason:null}
      },
      hotels:[{class:null, checkIn:null, checkOut:null, hotelClassViolationMessage:null, isModified:false, isCanceled:false, cancellationDate:null, cancellationReason:null}],
      cabs:[{date:null, class:null, prefferedTime:null, pickupAddress:null, dropAddress:null, cabClassVioilationMessage:null, isModified:false, isCanceled:false, cancellationDate:null, cancellationReason:null}],
      modeOfTransit:null,
      travelClass:null,
      needsVisa:false,
      needsBoardingTransfer:false,
      needsHotelTransfer:false,
      boardingTransfer:{
        prefferedTime:null,
        pickupAddress:null,
        dropAddress:null, 
        isModified:false, 
        isCanceled:false, 
        cancellationDate:null, 
        cancellationReason:null
      },
      hotelTransfer:{
        prefferedTime:null,
        pickupAddress:null,
        dropAddress:null, 
        isModified:false, 
        isCanceled:false, 
        cancellationDate:null, 
        cancellationReason:null
      },
      needsHotel:false,
      needsCab:false,
      isModified:false, 
      isCanceled:false, 
      cancellationDate:null, 
      cancellationReason:null
    }],

    travelDocuments:[],
    tripType:{oneWayTrip:true, roundTrip:false, multiCityTrip:false},
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
    .get(`${TRAVEL_API}/initial-data/${tenantId}/${EMPLOYEE_ID}`)
    .then((response) => {
      console.log(response.data)
      setOnBoardingData(response.data)
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
