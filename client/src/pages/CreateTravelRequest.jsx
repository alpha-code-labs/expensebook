import { useState, useEffect} from "react";
import { Routes, Route, useParams } from 'react-router-dom'
import BasicDetails from "./basicDetails/BasicDetails";
import { getOnboardingData_API } from "../utils/api";
import Error from "../components/common/Error";
import { generateUniqueIdentifier } from "../utils/uuid";


export default function () {

  const TRAVEL_API = import.meta.env.VITE_TRAVEL_API_URL
  const { tenantId, employeeId } = useParams();

  console.log(tenantId, employeeId, 'tId, employeeId')
  const [employeeName, setEmployeeName] = useState('')
  const [travelRequestId, setTravelRequestId] = useState(null);

  const [formData, setFormData] = useState({
    travelRequestId: null,
    approvers: [],
    tenantId: tenantId,
    travelType: 'international',
    tenantName: '',
    companyName: '',
    travelRequestStatus: 'draft',
    travelRequestState: 'section 0',
    createdBy: { name: employeeName, empId: employeeId },
    createdFor: null,
    travelAllocationHeaders: [],
    tripPurpose: null,

    raisingForDelegator: false,
    nameOfDelegator: null,
    isDelegatorManager: false,
    selectDelegatorTeamMembers: false,
    delegatorsTeamMembers: [],

    bookingForSelf: true,
    bookiingForTeam: false,
    teamMembers: [],
    sentToTrip: false,
    itinerary: {
      carRentals: [],
      cabs: [],
      trains: [],
      flights: [],
      buses: [],
      personalVehicles: [],
      hotels: []
    },

    travelDocuments: [],
    tripType: { oneWayTrip: true, roundTrip: false, multiCityTrip: false },
    preferences: [],
    travelViolations: {
      tripPurpose: null,
      class: null,
      amount: null,
    },
    isCancelled: false,
    cancellationDate: null,
    cancellationReason: null,
    isCashAdvanceTaken: null,
  })

  const [currentFormState, setCurrentFormState] = useState({
    isReturnTravel: false,
    itinerary: [
      {
        formId: generateUniqueIdentifier(),
        mode: 'flight',
        from: '',
        to: '',
        date: new Date().toISOString().split('T')[0],
        returnDate: undefined,
        hotelNights: '',
        pickUpNeeded: false,
        dropNeeded: false,
        fullDayCabs: 0,
        fullDayCabDates: [],
        dateError: { set: false, message: null },
        returnDateError: { set: false, message: null },
        fromError: { set: false, message: null },
        toError: { set: false, message: null },
      }
    ]
  });


  useEffect(() => {
    if (formData.travelRequestId != null) {
      setTravelRequestId(formData.travelRequestId);
    }

  }, [formData.travelRequestId])

  const [onBoardingData, setOnBoardingData] = useState()

  //flags

  const [isLoading, setIsLoading] = useState(true)
  const [loadingErrMsg, setLoadingErrMsg] = useState(null)


  useEffect(() => {
    (async function () {
      const response = await getOnboardingData_API({ tenantId, employeeId, travelType: formData.travelType })
      if (response.err) {
        setLoadingErrMsg(response.err)
      }
      else {
        setOnBoardingData(response.data.onboardingData)
        const companyName = response.data.onboardingData.companyName;
        if (response?.data?.onboardingData?.employeeData?.employeeDetails?.employeeName != null || response?.data?.onboardingData?.employeeDetails?.employeeName != undefined) {
          console.log('setting name to ', response?.data?.onboardingData?.employeeData?.employeeDetails?.employeeName)
          setFormData(pre => ({ ...pre, companyName, tenantName: companyName, createdBy: { ...pre.createdBy, name: response?.data?.onboardingData?.employeeData?.employeeDetails?.employeeName } }))
        }

        console.log(response.data.onboardingData)
        setIsLoading(false)
      }
    })()
  }, [formData.travelType])


  return <>
    {isLoading && <Error message={loadingErrMsg} />}

    {!isLoading &&
      <Routes>
        
        <Route path='/' element={<BasicDetails
          formData={formData}
          setFormData={setFormData}
          onBoardingData={onBoardingData} />} />

        <Route path='/section0' element={<BasicDetails
          formData={formData}
          setFormData={setFormData}
          onBoardingData={onBoardingData} />} />

      </Routes>}
  </>;
}


function dateDiffInDays(a, b) {
  a = new Date(a);
  b = new Date(b);
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}
