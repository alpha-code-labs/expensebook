import axios from "axios";

const ONBOARDING_MICROSERVICE_URL = "";
const DASHBOARD_MICROSERVICE_URL = "";

const onBoardingDataDummy = {
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
    {name: 'Abhijay Singh', empId:'124', group:'', EmpRole:'', teamMembers:[{name: 'Rajat Rathor', empId: '201', designation: 'Executive'}, {name: 'Ashish Pundir', empId: '205', designation: 'Program Planner'}, {name: 'Ankit Pundir', empId:'209', designation:'Manager'}]}, 
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

export async function fetchOnboardingData(
  tenantId,
  employeeId /* for whom travel request is created*/
) {
  try {

    return({onboardingData: onBoardingDataDummy})

    axios
      .get(ONBOARDING_MICROSERVICE_URL)
      .then((response) => {
        if (response.error) {
          console.error(response.error);
        } else {
          return { onboardingData: response.data };
        }
      })
      .catch((e) => {
        console.error(e.toJSON);
      });
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
