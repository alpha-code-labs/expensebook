import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BasicDetails from './basicDetails/basicDetails';
import TravelType from './travelType/TravelType.jsx';
import Itinerary from './Itinerary/Itinerary.jsx';
import { getOnboardingData_API } from '../../utils/api/travelApi.js';



const Stack = createStackNavigator()

export default function({navigation}){

  const EMPLOYEE_ID  = '1001'
  const tenantId = 'tynod76eu'
  const EMPLOYEE_NAME = 'Abhishek Kumar'
  const companyName = ''

  const [showBackButton, setShowBackButton] = useState(true)

  useEffect(()=>{
    navigation.setOptions({headerShown: showBackButton})
  },[navigation, showBackButton])

    const [formData, setFormData] = useState({
        travelRequestId: null,
        approvers: [],
        tenantId: tenantId,
        travelType: null,
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
        itinerary: {
          carRentals:[],
          cabs:[],
          trains:[],
          flights:[],
          buses:[],
          personalVehicles:[],
          hotels:[]
        },
    
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
    

    // return (
    //   <NavigationContainer independent={true}>
    //     <Stack.Navigator initialRouteName='travelType'>
    //       <Stack.Screen name='travelType'  component={<TravelType formData={formData} setFormData={setFormData} onBoardingData={onBoardingData} nextPage={'basicDetails'} />} options={{ title: 'Select Type of Travel' }}/>
    //       <Stack.Screen name='basicDetails'  component={<BasicDetails formData={formData} setFormData={setFormData} onBoardingData={onBoardingData} nextPage={'basicDetails'}/>} options={{ title: 'Basic Details' }}/>
    //     </Stack.Navigator>
    //   </NavigationContainer>
    //   )

      return (
        <NavigationContainer independent={true}>
          <Stack.Navigator initialRouteName="travelType">
            <Stack.Screen
              name="travelType"
              options={() => ({
                title: 'Select Type of Travel',
                headerShown: false, 
                props: { formData, setFormData, onBoardingData, nextPage: 'basicDetails' },
              })}
            >
              {(props) => <TravelType setShowBackButton={setShowBackButton} formData={formData} setFormData={setFormData} onBoardingData={onBoardingData} setOnBoardingData={setOnBoardingData} nextPage={'basicDetails'} {...props} />}
            </Stack.Screen>

            <Stack.Screen
              name="basicDetails"
              options={() => ({
                title: 'Travel Type',
              })}
            >
              {(props) => <BasicDetails formData={formData} setFormData={setFormData} onBoardingData={onBoardingData} setOnBoardingData={setOnBoardingData} lastPage={'travelType'} nextPage={'itinerary'} {...props} />}
            </Stack.Screen>

            <Stack.Screen
              name="itinerary"
              options={() => ({
                title: 'Basic Details',
              })}
            >
              {(props) => <Itinerary formData={formData} setFormData={setFormData} onBoardingData={onBoardingData} setOnBoardingData={setOnBoardingData} lastPage={'basicDetails'} nextPage={'travelAllocations'} {...props} />}
            </Stack.Screen>

          </Stack.Navigator>
        </NavigationContainer>
      );
    
}



