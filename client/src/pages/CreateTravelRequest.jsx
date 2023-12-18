import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import BasicDetails from "./basicDetails/basicDetails";
import Itinerary from "./itinerary/Itinerary"
import Review from "./review/Review"
import { getOnboardingData_API } from "../utils/api";
import Error from "../components/common/Error";
import { createNoSubstitutionTemplateLiteral } from "typescript";

export default function () {
  
  const TRAVEL_API = import.meta.env.VITE_TRAVEL_API_URL 
  const EMPLOYEE_ID  = '1001'
  const tenantId = 'tynod76eu'
  const EMPLOYEE_NAME = 'Abhishek Kumar'
  const companyName = 'Amex'

  const [formData, setFormData] = useState({
    travelRequestId: null,
    approvers: [],
    tenantId: tenantId,
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
    itinerary: [{
      from:null,
      to:null,
      departure: {
        from: null,
        to: null,
        date: null,
        time: null,
        violations:{
          class: null,
          amount: null,
        },
        bkd_from: null,
        bkd_to: null,
        bkd_date: null,
        bkd_time: null,
        bkd_violations:{
          class: null,
          amount: null,
        },
        modified: false,
        isCancelled: false,
        cancellationDate: null,
        cancellationReason: null,
        status:'draft',
        bookingDetails:{
          docURL: null,
          docType: null,
          billDetails: {}, 
        }
      }, 
      return:{
        from: null,
        to: null,
        date: null,
        time: null,
        violations:{
          class: null,
          amount: null,
        },
        bkd_from: null,
        bkd_to: null,
        bkd_date: null,
        bkd_time: null,
        bkd_violations:{
          class: null,
          amount: null,
        },
        modified: false,
        isCancelled: false,
        cancellationDate: null,
        cancellationReason: null,
        status:'draft',
        bookingDetails:{
          docURL: null,
          docType: null,
          billDetails: {}, 
        }
        },
      hotels:[],
      cabs:[],
      modeOfTransit:null,
      travelClass:null,
      needsVisa:false,
      transfers:{
        needsDeparturePickup:false,
        needsDepartureDrop:false,
        needsReturnPickup:false,
        needsReturnDrop:false,
      },
      needsHotel:false,
      needsCab:false,
      modified:false, 
    }],

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
    const response = await getOnboardingData_API({tenantId, EMPLOYEE_ID})
    if(response.err){
      setLoadingErrMsg(response.err)
    }  
    else{
      setOnBoardingData(response.data.onboardingData)
      console.log(response.data.onboardingData)
      setIsLoading(false)
    }
  })()
},[])

  return <>  
      {isLoading && <Error message={loadingErrMsg} />}

      {!isLoading &&
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
      </Routes>}
  </>;
}
