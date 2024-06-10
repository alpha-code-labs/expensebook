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
    //console.log(tenantData)

    if(tenantData.length===0) throw new Error('Tenant do not exists or can not fetch tenant details at the moment')
    tenantData = tenantData[0]
    const companyName = tenantData.companyDetails.companyName ?? '';
 
    let employeeData = tenantData.employees.filter(emp=>emp.employeeDetails.employeeId === employeeId)
    if(employeeData.length===0) throw new Error('can not fetch tenant details for given employeeId at the moment')
    employeeData = employeeData[0]

    const employeeGroups = employeeData.group
    const employeeRoles = employeeData.employeeRoles
    const flags = tenantData.flags
    const tenantPolicies = tenantData?.policies.travelPolicies??[]
    const travelAllocationFlags = tenantData?.travelAllocationFlags //{level1:false, level2:false, level3:true}
    const travelAllocations = tenantData?.travelAllocations 
    
   //tenantData.travelAllocation
    const MANAGER_FLAG = employeeRoles.employeeManager
    const listOfManagers = tenantData.employees.filter(employee=>employee.employeeRoles.employeeManager).map(emp=> emp.employeeDetails)
    
    //related to policies
    let APPROVAL_FLAG = false
    let approvalFlow = null
    let minDaysBeforeBooking = null
    let cashAdvanceAllowed = true

    if(flags.POLICY_SETUP_FLAG){
      // approval flag and flow
      employeeGroups.forEach(group=>{
        const res = getPolicy(group, 'Approval Flow', travelType, tenantPolicies)

        //look for the least number of approvers
        if(res.approval.approvers){
          if(approvalFlow == null){
            approvalFlow = res.approval.approvers
            if(res.approval.approvers.length>0){
              APPROVAL_FLAG = true
            }
            else APPROVAL_FLAG = false
          }

          else if(approvalFlow.length > res.approval.approvers.lenght){
              approvalFlow = res.approval.approvers
              if(res.approval.approvers.length>0){
                APPROVAL_FLAG = true
              }
              else APPROVAL_FLAG = false
          }
        }

      })

      //minimum days before which travel can be booked
      employeeGroups.forEach(group=>{
        const res = getPolicy(group, 'Minimum Days to Book Before Travel', travelType, tenantPolicies)

        if(minDaysBeforeBooking == null){
          minDaysBeforeBooking = res.dayLimit.days??0
        }
        else if(res.dayLimit.days < minDaysBeforeBooking){
          minDaysBeforeBooking = res.dayLimit.days
        }
      })

      //cashAdvance Allowed

      let caPermissions = []
      employeeGroups.forEach(group=>{
        const res = getPolicy(group, 'Per Diem allowance / Cash Advance allowed', travelType, tenantPolicies)
        caPermissions.push(res.permission.allowed)
      })

      if(caPermissions.length>0 && caPermissions.every(item=>!item)){
        cashAdvanceAllowed = false
      }

    }

    // const APPROVAL_FLAG = !tenantPolicies?  false : tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Approval Flow'].approval.approvers.length>0 ? true : false
    // const approvalFlow = tenantPolicies? (tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Approval Flow'].approval.approvers) : []
    // const minDaysBeforeTravelBooking = tenantPolicies? (tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Minimum Days to Book Before Travel']?.dayLimit?.days??0) : 0
    // const cashAdvanceAllowed = tenantPolicies? (tenantPolicies[0][Object.keys(tenantPolicies[0])[0]]?.[travelType]?.['Per Diem allowance / Cash Advance allowed']?.permission?.allowed)??true : true
    //end policies related


    //console.log('approval flow', tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Approval Flow'])
    const DELEGATED_FLAG = false
    const delegatedFor = [
      // {name: 'Ajay Singh', empId:'121', designation: 'Executive', department: 'Software', group:'', EmpRole:'', teamMembers:[]}, 
      // {name: 'Abhijay Singh', empId:'124', designation: 'Manager', department: 'Recruitment', group:'', EmpRole:'', teamMembers:[{name: 'Rajat Rathor', empId: '201', designation: 'Executive'}, {name: 'Ashish Pundir', empId: '205', designation: 'Program Planner'}, {name: 'Ankit Pundir', empId:'209', designation:'Manager'}]}, 
      // {name: 'Akshay Kumar', empId:'127', designation: 'Executive', department: 'Software', group:'', EmpRole:'', teamMembers:[]}, 
      // {name:'Anandhu Ashok K.', empId:'129', designation: 'Executive', department: 'Software', group:'', EmpRole:'', teamMembers:[]}, 
      // {name:'kanhaiya', empId:'', group:'135', designation: 'Executive', department: 'Software', EmpRole:'', teamMembers:[]}
  ]
  const modeOfTransitOptions=['Flight', 'Train', 'Bus', 'Cab', 'Car Rentals', 'Bike', 'Personal Car']
  const travelClassOptions={
    'flight': ['Economy', 'Premium Economy', 'Business', 'First Class'], //Object.keys(tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Flights'].class),
    'train': ['First AC ', 'Second AC', 'Third AC', 'Sleeper', 'Chair Car'], //Object.keys(tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Trains'].class),
    'bus': ['Sleeper', 'Semi-Sleeper', 'Regular'],
    'cab': ['Economy', 'Business', 'Executive'], //Object.keys(tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Car Rentals'].class),
    'Bike': [],
    'Car Rentals': [],
    'Personal Car': [],
 }
  const hotelClassOptions = ['3 star', '4 star', '5 star'] //Object.keys(tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Hotels'].class)
  const cabClassOptions = ['Economy', 'Business', 'Executive'] //Object.keys(tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Car Rentals'].class)
  const tripPurposeOptions = ['Business', 'Training', 'Events', 'Personal', 'Others']  //Object.keys(tenantPolicies[0][Object.keys(tenantPolicies[0])[0]][travelType]['Allowed Trip Purpose'].class)
     
    return({
        companyName,
        employeeData, 
        employeeGroups, 
        employeeRoles, 
        travelAllocations, 
        MANAGER_FLAG,
        listOfManagers,
        APPROVAL_FLAG,
        approvalFlow,
        cashAdvanceAllowed,
        DELEGATED_FLAG,
        delegatedFor,
        modeOfTransitOptions,
        travelClassOptions,
        tripPurposeOptions,
        hotelClassOptions,
        cabClassOptions,
        travelAllocationFlags,
        minDaysBeforeTravelBooking:minDaysBeforeBooking,
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

const getPolicy = (group, policy, travelType, policies)=>{
  let result = null
  policies.forEach(groupPolicy=>{
    if(groupPolicy[group]!=null && groupPolicy[group]!=undefined){
        result = groupPolicy[group][travelType][policy] 
        return
    }
  })
  return result
}
