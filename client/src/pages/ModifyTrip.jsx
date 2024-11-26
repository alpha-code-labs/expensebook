/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect} from "react";
import { Routes, Route, useParams } from 'react-router-dom';
// import BasicDetails from "./basicDetails/BasicDetails";
import Error from "../components/common/Error";
import { getTrip_API, getOnboardingData_API } from "../utils/api";
import AllocateTravelObjects from "./allocations/AllocateTravelObjects";
import LatestItinerary from "../itinerary/LatestItinerary";



export default function () {
  //get travel request Id from params
  const dashboardBaseUrl = `${import.meta.env.VITE_DASHBOARD_URL}`;
  const { tenantId,empId,tripId } = useParams()
  console.log(tripId, 'travelRequestId')
  const [isLoading, setIsLoading] = useState(true)
  const [loadingErrMsg, setLoadingErrMsg] = useState(null)
  const [formData, setFormData] = useState()
  const [onBoardingData, setOnBoardingData] = useState()
  const [bookedItineraryIds,setBookedItineraryIds] = useState([])
  const [modifiedTripsIds , setModifiedTripsIds] = useState([]) //for cancel the booked itinerary
  const [addedItineraries, setAddedItineraries]= useState({"flights":[],"buses": [],"trains":[],"personalVehicles": [],"hotels":[],"cabs": [], "carRentals": [],})
  const newItinerary = {
    "newFlights":[...addedItineraries.flights] || [],
    "newBuses": [...addedItineraries.buses] || [],
    "newTrains":[...addedItineraries.trains] || [],
    "newPersonalVehicles": [...addedItineraries.personalVehicles]|| [],
    "newHotels":[...addedItineraries.hotels]|| [],
    "newCabs": [...addedItineraries.cabs]|| [], 
    "newCarRentals": [...addedItineraries.carRentals] || [] }
  //add a leg or modified object array
  const [allocations , setAllocation]=useState() // for level 3

  //fetch travel request data from backend
  useEffect(() => {
    (async function () {
      const travel_res = await getTrip_API({tenantId,empId, tripId })
      if (travel_res.err) {
        window.parent.postMessage({message:"expense message posted", 
          popupMsgData: { showPopup:true, message:travel_res.err, iconCode: "102" }}, dashboardBaseUrl);
        // setLoadingErrMsg(travel_res.err)
        return
      }
      const travelRequestDetails = travel_res.data.trip
      console.log(travelRequestDetails,'trip details')
      const travelType = travelRequestDetails.travelType
      console.log(travelType,'travelType')
      
      const currentFormData = {
        travelRequestId: travelRequestDetails.travelRequestId,
        approvers: travelRequestDetails.approvers,
        tenantId: travelRequestDetails.tenantId,
        travelType: travelRequestDetails?.travelType,
        tenantName: travelRequestDetails.tenantName,
        companyName: travelRequestDetails.companyName,
        status: travelRequestDetails.status,
        state: travelRequestDetails.state,
        createdBy: travelRequestDetails.createdBy,
        createdFor: travelRequestDetails.createdFor,
        travelAllocationHeaders: travelRequestDetails.travelAllocationHeaders,
        tripPurpose: travelRequestDetails.tripPurpose,
        raisingForDelegator: travelRequestDetails.createdFor === null ? false : true,
        nameOfDelegator: travelRequestDetails?.createdFor?.name || null,
        isDelegatorManager: false,
        selectDelegatorTeamMembers: false,
        delegatorsTeamMembers: [],
        bookingForSelf: true,
        bookiingForTeam: false,
        teamMembers: travelRequestDetails.teamMembers,
        travelDocuments: travelRequestDetails.travelDocuments,
        itinerary: travelRequestDetails.itinerary,
        tripType: travelRequestDetails.tripType,
        preferences: travelRequestDetails.preferences,
        travelViolations: travelRequestDetails.travelViolations,
        cancellationDate: travelRequestDetails.cancellationDate,
        cancellationReason: travelRequestDetails.cancellationReason,
        isCancelled: travelRequestDetails.isCancelled,
        travelRequestStatus: travelRequestDetails.travelRequestStatus,
        ...travelRequestDetails /* other travel request details */
      }

      console.log(travelRequestDetails.formData);

      if (travelRequestDetails.formData != null && travelRequestDetails.formData.itinerary != undefined && Object.keys(travelRequestDetails.formData.itinerary).lenght > 0) {
        setCurrentFormState(travelRequestDetails.formData);
      }

      const response = await getOnboardingData_API({ tenantId , employeeId: empId, travelType: travelRequestDetails.travelType })
     
      if (response.err) {
        // setLoadingErrMsg(response.err)
        window.parent.postMessage({message:"expense message posted", 
          popupMsgData: { showPopup:true, message:travel_res.err, iconCode: "102" }}, dashboardBaseUrl);
        return
      }

      setFormData(currentFormData)
      setOnBoardingData(response.data.onboardingData)
      console.log(response.data.onboardingData)
      setIsLoading(false)
    })()
  }, []);

  useEffect(()=>{
    (async function(){
      if(formData?.travelType??false){
        setIsLoading(true);
        const response = await getOnboardingData_API({ tenantId: tenantId, employeeId: empId, travelType: formData.travelType })
        if (response.err) {
          window.parent.postMessage({message:"expense message posted", 
          popupMsgData: { showPopup:true, message:travel_res.err, iconCode: "102" }}, dashboardBaseUrl);
         // setLoadingErrMsg(response.err)
          return
        }
        setOnBoardingData(response.data.onboardingData)
        setIsLoading(false);
      }
    })()
   
  },[formData?.travelType])

  return <>
    {isLoading && <Error message={loadingErrMsg} />}
    {!isLoading && 
    <Routes>
      {/* <Route path='/' element={<BasicDetails
        formData={formData}
        setFormData={setFormData}
        onBoardingData={onBoardingData}
        lastPage={`/modify/${travelRequestId}/`}
        nextPage={`/modify/${travelRequestId}/section1`} />} />

      <Route path='/section0' element={<BasicDetails
        formData={formData}
        setFormData={setFormData}
        onBoardingData={onBoardingData}
        lastPage={`/modify/${travelRequestId}/`}
        nextPage={`/modify/${travelRequestId}/section1`} />} /> */}

      <Route path='/section1' 
        element={
        <LatestItinerary
        modifiedTripsIds={modifiedTripsIds}
        bookedItineraryIds={bookedItineraryIds}
        addedItineraries={addedItineraries}
        setBookedItineraryIds={setBookedItineraryIds}
        setAddedItineraries={setAddedItineraries}
        setModifiedTripsIds={setModifiedTripsIds}
        formData={formData}
        setFormData={setFormData}
        onBoardingData={onBoardingData}
        nextPage={onBoardingData?.travelAllocationFlags.level3 ? `/${tenantId}/${empId}/modify/${tripId}/allocations` : undefined}
        lastPage={`/modify/${tripId}/section0`} />} />

        <Route path='/allocations' element={
        <AllocateTravelObjects
        bookedItineraryIds={bookedItineraryIds}
        modifiedTripsIds={modifiedTripsIds}
        addedItineraries={newItinerary}
        setAllocation={setAllocation}
        allocations={allocations}
        formData={formData}
        setFormData={setFormData}
        onBoardingData={onBoardingData}
        nextPage={undefined}
        lastPage={`/${tenantId}/${empId}/modify/${tripId}/section1`} />} />
      </Routes>}
  </>;
}
