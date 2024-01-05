import axios from "axios";
import HRMaster from "../models/hrMaster.js";

const ONBOARDING_MICROSERVICE_URL = "";
const DASHBOARD_MICROSERVICE_URL = "";


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
    const travelAllocation = tenantData.travelAllocation
    const MANAGER_FLAG = employeeRoles.employeeManager
    const APPROVAL_FLAG = tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Approval Flow'].approval.approvers.length>0 ? true : false
    const approvers = tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Approval Flow'].approval.approvers
    const DELEGATED_FLAG = true

    //currently hardcoded. Need to be replaced when we have a decision on delegation mechanism
    const delegatedFor = [
      {name: 'Ajay Singh', empId:'121', designation: 'Executive', department: 'Software', group:'', EmpRole:'', teamMembers:[]}, 
      {name: 'Abhijay Singh', empId:'124', designation: 'Manager', department: 'Recruitment', group:'', EmpRole:'', teamMembers:[{name: 'Rajat Rathor', empId: '201', designation: 'Executive'}, {name: 'Ashish Pundir', empId: '205', designation: 'Program Planner'}, {name: 'Ankit Pundir', empId:'209', designation:'Manager'}]}, 
      {name: 'Akshay Kumar', empId:'127', designation: 'Executive', department: 'Software', group:'', EmpRole:'', teamMembers:[]}, 
      {name:'Anandhu Ashok K.', empId:'129', designation: 'Executive', department: 'Software', group:'', EmpRole:'', teamMembers:[]}, 
      {name:'kanhaiya', empId:'', group:'135', designation: 'Executive', department: 'Software', EmpRole:'', teamMembers:[]}
  ]

  //this is hardcoded because we can't have anthing other than this
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
        travelAllocation, 
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

