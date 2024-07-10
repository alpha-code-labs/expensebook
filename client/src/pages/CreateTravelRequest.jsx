import { useState, useEffect } from "react";
import { Routes, Route, useParams } from 'react-router-dom'
import BasicDetails from "./basicDetails/BasicDetails";
import { getOnboardingData_API } from "../utils/api";
import Error from "../components/common/Error";

export default function () {

  const { tenantId, employeeId } = useParams();

  console.log(tenantId, employeeId, 'tId, employeeId')
  const [employeeName, setEmployeeName] = useState('')

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
    tripName: null,
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
        setEmployeeName(response?.data?.onboardingData?.employeeData?.employeeDetails?.employeeName ?? '');

        const approvers = [];

        if(onBoardingData.approvalFlow.length != 0){
          
          if(onBoardingData.approvalFlow.includes('L1')){
            const l1Manager = onBoardingData?.listOfManagers?.find(manager=>onBoardingData?.employeeData?.employeeDetails?.l1Manager == manager?.employeeId);
            if(l1Manager??false){
              approvers.push({ name: l1Manager.employeeName, empId: l1Manager.employeeId, status: 'pending approval' });
            }    
          }

          if(onBoardingData.approvalFlow.includes('L2')){
            const l2Manager = onBoardingData?.listOfManagers?.find(manager=>onBoardingData?.employeeData?.employeeDetails?.l2Manager == manager?.employeeId);
            if(l2Manager??false){
              approvers.push({ name: l2Manager.employeeName, empId: l2Manager.employeeId, status: 'pending approval' });
            }    
          }

          if(onBoardingData.approvalFlow.includes('L2')){
            const l3Manager = onBoardingData?.listOfManagers?.find(manager=>onBoardingData?.employeeData?.employeeDetails?.l3Manager == manager?.employeeId);
            if(l3Manager??false){
              approvers.push({ name: l3Manager.employeeName, empId: l3Manager.employeeId, status: 'pending approval' });
            }    
          }
        }

        if (response?.data?.onboardingData?.employeeData?.employeeDetails?.employeeName != null || response?.data?.onboardingData?.employeeDetails?.employeeName != undefined) {
          console.log('setting name to ', response?.data?.onboardingData?.employeeData?.employeeDetails?.employeeName)
          setFormData(pre => (
            { 
              ...pre, 
              companyName, 
              tenantName: companyName, 
              createdBy: { ...pre.createdBy, name: response?.data?.onboardingData?.employeeData?.employeeDetails?.employeeName },
              approvers 
            }))
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