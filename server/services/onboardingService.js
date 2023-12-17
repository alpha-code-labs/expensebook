import axios from "axios";
import HRMaster from "../models/hrMaster.js";

const ONBOARDING_MICROSERVICE_URL = "";
const DASHBOARD_MICROSERVICE_URL = "";

const onBoardingDataDummy = {
  MANAGER_FLAG:true,
  APPROVAL_FLAG:true,
  ALLOCATION_HEADER:true,
  DELEGATED_FLAG:true,
  managersList:[
    {name: 'Preeti Arora', empId: '005', designation: 'Manager', department: 'Sales'},
    {name: 'Abhas Kamboj', empId: '045', designation: 'Manager', department: 'Recruitment'},
    {name: 'Sandeep Nair', empId: '061', designation: 'Manager', department: 'Engineering'},
    {name: 'Sumesh', empId: '114', designation: 'Executive', department: 'Software'},
    {name: 'Prabhat', empId: '181', designation: 'Executive', department: 'Sales'},
],
  teamMembers:[],
  tripPurposeOptions:['Meeting with client', 'Sales Trip', 'Business Trip'],
  delegatedFor:[
    {name: 'Ajay Singh', empId:'121', designation: 'Executive', department: 'Software', group:'', EmpRole:'', teamMembers:[]}, 
    {name: 'Abhijay Singh', empId:'124', designation: 'Manager', department: 'Recruitment', group:'', EmpRole:'', teamMembers:[{name: 'Rajat Rathor', empId: '201', designation: 'Executive'}, {name: 'Ashish Pundir', empId: '205', designation: 'Program Planner'}, {name: 'Ankit Pundir', empId:'209', designation:'Manager'}]}, 
    {name: 'Akshay Kumar', empId:'127', designation: 'Executive', department: 'Software', group:'', EmpRole:'', teamMembers:[]}, 
    {name:'Anandhu Ashok K.', empId:'129', designation: 'Executive', department: 'Software', group:'', EmpRole:'', teamMembers:[]}, 
    {name:'kanhaiya', empId:'', group:'135', designation: 'Executive', department: 'Software', EmpRole:'', teamMembers:[]}
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

export async function fetchOnboardingData(
  tenantId,
  employeeId, /* for whom travel request is created*/
  travelType='international',
) {
  try {
    console.log(tenantId, employeeId)
    let tenantData = await HRMaster.find({tenantId})
    if(tenantData.length===0) throw new Error('Tenant do not exists or can not fetch tenant details at them moment')
    tenantData = tenantData[0]
 
    let employeeData = tenantData.employees.filter(emp=>emp.employeeDetails.employeeId === employeeId)
    if(employeeData.length===0) throw new Error('can not fetch tenant details for given employeeId at them moment')
    employeeData = employeeData[0]

    const employeeGroups = employeeData.group
    const employeeRoles = employeeData.employeeRoles
    const tenantPolicies = tenantData.policies
    const travelAllocations = [
      {
        headerName: "circles",
        headerValues: [
          "North India",
          "South India",
          "Central India"
        ],
      },
      {
        headerName: "department",
        headerValues: [
          "HR",
          "Finance",
          "Engineering",
          "Marketing"
        ],
      }
    ]
   //tenantData.travelAllocation
    const MANAGER_FLAG = employeeRoles.employeeManager
    const APPROVAL_FLAG = tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Approval Flow'].approval.approvers.length>0 ? true : false
    const approvers = tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Approval Flow'].approval.approvers
    const DELEGATED_FLAG = true
    const delegatedFor = [
      {name: 'Ajay Singh', empId:'121', designation: 'Executive', department: 'Software', group:'', EmpRole:'', teamMembers:[]}, 
      {name: 'Abhijay Singh', empId:'124', designation: 'Manager', department: 'Recruitment', group:'', EmpRole:'', teamMembers:[{name: 'Rajat Rathor', empId: '201', designation: 'Executive'}, {name: 'Ashish Pundir', empId: '205', designation: 'Program Planner'}, {name: 'Ankit Pundir', empId:'209', designation:'Manager'}]}, 
      {name: 'Akshay Kumar', empId:'127', designation: 'Executive', department: 'Software', group:'', EmpRole:'', teamMembers:[]}, 
      {name:'Anandhu Ashok K.', empId:'129', designation: 'Executive', department: 'Software', group:'', EmpRole:'', teamMembers:[]}, 
      {name:'kanhaiya', empId:'', group:'135', designation: 'Executive', department: 'Software', EmpRole:'', teamMembers:[]}
  ]
  const modeOfTransitOptions=['Flight', 'Train', 'Bus', 'Cab']
  const travelClassOptions={'flight':Object.keys(tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Flights'].class),
  'train': Object.keys(tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Trains'].class),
  'bus': ['Sleeper', 'Semi-Sleeper', 'Regular'],
  'cab': Object.keys(tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Car Rentals'].class)
 }
  const hotelClassOptions = Object.keys(tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Hotels'].class)
  const cabClassOptions = Object.keys(tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Car Rentals'].class)
  const tripPurposeOptions = Object.keys(tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Allowed Trip Purpose'].class)
     

    return({
        employeeData, 
        employeeGroups, 
        employeeRoles, 
        tenantPolicies, 
        travelAllocations, 
        MANAGER_FLAG,
        APPROVAL_FLAG,
        approvers,
        DELEGATED_FLAG,
        delegatedFor,
        modeOfTransitOptions,
        travelClassOptions,
        tripPurposeOptions,
        hotelClassOptions,
        cabClassOptions
     })
  } catch (e) {
    throw e;
  }
}

export async function fetchGroupAndPoliciesData(tenantId, employeeId) {
  //for now
  return {
    travelPolicy: {
      InternationalPolicy: {
        airfareClass: {
          economy: ["group1", "group2", "group3", "group5", "group7", "group8"],
          business: ["group3", "group5", "group7", "group8"],
          private: ["group7", "group8"],
        },
      },
      domoesticPolicy: {},
      localPolicy: {},
    },
    nonTravelPolicy: {},
  };

  try {
    axios
      .get(DASHBOARD_MICROSERVICE_URL)
      .then((response) => {
        if (response.error) {
          console.error(response.error);
        } else {
          return { profileData: response.data };
        }
      })
      .catch((e) => {
        console.error(e.toJSON);
      });
  } catch (e) {
    throw e;
  }
}
