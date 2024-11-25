import { useState, useEffect} from "react";
import { Routes, Route, useParams } from 'react-router-dom'
import BasicDetails from "./basicDetails/BasicDetails";
import Error from "../components/common/Error";
import { getTravelRequest_API, getOnboardingData_API } from "../utils/api";
import AllocateTravelObjects from "./allocations/AllocateTravelObjects";
import LatestItinerary from "./Itinerary/LatestItinerary";



export default function () {
  //get travel request Id from params
  const { travelRequestId } = useParams()
  //console.log(travelRequestId, 'travelRequestId')
  const [isLoading, setIsLoading] = useState(true)
  const [loadingErrMsg, setLoadingErrMsg] = useState(null)
  const [formData, setFormData] = useState()
  const [onBoardingData, setOnBoardingData] = useState()

  //fetch travel request data from backend
  useEffect(() => {
    (async function () {

      const travel_res = await getTravelRequest_API({ travelRequestId })
      if (travel_res.err) {
        //setLoadingErrMsg(travel_res.err)
        window.parent.postMessage({message:"travel message posted" , 
        popupMsgData: { showPopup:true, message:travel_res.err, iconCode: "102" }}, DASHBOARD_URL);
        return
      }
      const travelRequestDetails = travel_res.data
      const travelType = travelRequestDetails.travelType


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

      //console.log(travelRequestDetails.formData);

      if (travelRequestDetails.formData != null && travelRequestDetails.formData.itinerary != undefined && Object.keys(travelRequestDetails.formData.itinerary).lenght > 0) {
        setCurrentFormState(travelRequestDetails.formData);
      }

      const response = await getOnboardingData_API({ tenantId: travelRequestDetails.tenantId, employeeId: travelRequestDetails.createdBy.empId, travelType: travelRequestDetails.travelType })
      if (response.err) {
        setLoadingErrMsg(response.err)
        return
      }

      setFormData(currentFormData)
      setOnBoardingData(response.data.onboardingData)
      //console.log(response.data.onboardingData)
      setIsLoading(false)
    })()
  }, []);

  useEffect(()=>{
    (async function(){
      if(formData?.travelType??false){
        setIsLoading(true);
        const response = await getOnboardingData_API({ tenantId: formData.tenantId, employeeId: formData.createdBy.empId, travelType: formData.travelType })
        if (response.err) {
          setLoadingErrMsg(response.err)
          return
        }
  
        setOnBoardingData(response.data.onboardingData)
        setIsLoading(false);
      }
    })()
   
  },[formData?.travelType])

  

  return <>
    {isLoading && <Error message={loadingErrMsg} />}
    {!isLoading && <Routes>
      <Route path='/' element={<BasicDetails
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
        nextPage={`/modify/${travelRequestId}/section1`} />} />

      <Route path='/section1' element={<LatestItinerary
        formData={formData}
        setFormData={setFormData}
        onBoardingData={onBoardingData}
        nextPage={onBoardingData?.travelAllocationFlags.level3 ? `/modify/${travelRequestId}/allocations` : undefined}
        lastPage={`/modify/${travelRequestId}/section0`} />} />

      <Route path='/allocations' element={<AllocateTravelObjects
        formData={formData}
        setFormData={setFormData}
        onBoardingData={onBoardingData}
        nextPage={undefined}
        lastPage={`/modify/${travelRequestId}/section1`} />} />
    </Routes>}
  </>;
}