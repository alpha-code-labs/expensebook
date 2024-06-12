import React,{useEffect, useLayoutEffect, useState} from 'react'
import { View,Text, ActivityIndicator,Image, SafeAreaView, ScrollView } from 'react-native'
import { getPreferenceDataApi, postTravelPreference_API } from '../../../../utils/api//dashboard/dashboardApi'
import { travelPreferences,preference } from '../../../../dummyData/dashboard/profile'
import { profile_bg,arrow_left, mail_icon, location_icon, exp_icon } from '../../../../../assets/icon.js'
import Input from '../../../../components/common/Input.jsx'
import Select from '../../../../components/common/Select.jsx'
import { titleCase } from '../../../../utils/handyFunctions.js'
import Error from '../../../../../src/components/common/Error.jsx'
import Button from '../../../Travel/common/Button.jsx'
import HeaderButton from '../../../../components/common/HeaderButton.jsx'



const Profile = ({navigation}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const [isUploading  , setIsUploading]=useState(false)
    const [preferenceData , setPreferenceData]= useState(null) //get preferences option
    
    useLayoutEffect(()=>{
      navigation.setOptions({
        headerRight:()=>(
          <HeaderButton text='Save' onPress={()=>handleSaveProfile()}/>
        )
      })

    },[handleChange])

    useEffect(() => {
      const fetchData = async () => {
        try {
          const { data } = await getPreferenceDataApi();
            setPreferenceData(data);
            console.log('Preference data fetched.');
         
          setIsLoading(false);
        } catch (error) {
          console.error('Error in fetching preference data:', error.message);
          setLoadingErrMsg(error.message);
          setTimeout(() => {setIsLoading(false);setLoadingErrMsg(null)},2000);
          
        }
      };
  
      fetchData(); 
  
    }, []);

   


    const [formData, setFormData] = useState({
        flightPreference: { seat: '', meal: '' },
        busPreference: { seat: '', meal: '' },
        trainPreference: { seat: '', meal: '' },
        hotelPreference: { roomType: '', bedType: '' },
        emergencyContact: { contactNumber: '', relationship: '' },
        dietaryAllergy: '',
      });
    
    
    
      //get data 
      useEffect(()=>{
          const backendData = travelPreferences
          setFormData(backendData)
      
      },[])
      
      const dietaryAllergyField = formData && formData.dietaryAllergy
      console.log(dietaryAllergyField)
    
      
      // useEffect(() => {
      //   if (showCancelModal) {
      //     document.body.style.overflow = 'hidden'
      //   }
      //   else {
      //     document.body.style.overflow = 'auto'
      //   }
      // }, [showCancelModal])
    
      const handleChange = (field, value, fieldFor) => {
        if (fieldFor === 'flight') {
          setFormData((prevData) => ({
            ...prevData,
            flightPreference: { ...prevData.flightPreference, [field]: value },
          }))
        } else if (fieldFor === 'train') {
          setFormData((prevData) => ({ ...prevData, trainPreference: { ...prevData.trainPreference, [field]: value } }))
        } else if (fieldFor === 'bus') {
          setFormData((prevData) => ({ ...prevData, busPreference: { ...prevData.busPreference, [field]: value } }))
        } else if (fieldFor === 'hotel') {
          setFormData((prevData) => ({ ...prevData, hotelPreference: { ...prevData.hotelPreference, [field]: value } }))
        } else if (fieldFor === 'contactDetails') {
          setFormData((prevData) => ({ ...prevData, emergencyContact: { ...prevData.emergencyContact, [field]: value } }))
        } else if (fieldFor === 'dietary') {
          setFormData((prevData) => ({ ...prevData, [field]: value }))
        }
      };
    
    
       const tenantId = '123 tenantid'
       const empId = 'empId'

       const handleSaveProfile = async () => {
        console.log(formData);
      
        // Add logic to send formData to the backend for saving/updating
        try {
          setIsLoading(true);
          const response = await postTravelPreference_API({ tenantId, empId, formData });
          if (response.message === "Success") {
            setLoadingErrMsg('Profile has been updated successfully.');
          }
        } catch (error) {
          setLoadingErrMsg(`hello ${error.message}`); 
          setTimeout(() => {setIsLoading(false);setLoadingErrMsg(null)},5000);
        }
      };
      
      

  return (
    <>{isLoading && <Error loadingErrMsg={loadingErrMsg}/> }
    {!isLoading && <SafeAreaView className='flex-1'>
   <ScrollView>
    
      <View className=''>
        <Image source={profile_bg}  className='w-full h-[100px]'/>
        <View className='translate-y-[-50px] '>
        <View className="rounded-full bg-indigo-100 flex   w-[104px] h-[104px] items-center justify-center  mx-auto  shadow-md border-4 border-white transition duration-200 transform active:scale-110">
              <Text className="text-white font-medium ]">K V</Text>
        </View>
        <View className="flex flex-col items-center">
                  <Text className="font-Cabin text-lg text-neutral-800">Ashneer Grover</Text>
                  <Text className="font-Inter text-medium text-neutral-600">CEO</Text>
        </View>
        </View>

       

         

<View className=" flex-col  gap-2 px-2 h-auto border-[1px] border-slate-300  rounded-[16px] bg-slate-50 w-auto  flex justify-center items-center py-2">
<View className="border-[1px] border-slate-300  rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-auto ">
              <View className="w-full flex flex-col  justify-center items-center gap-2 py-2 px-2">
                <View className="flex-row items-center justify-center">
                  <Image source={mail_icon} alt="mail-icon" className="w-5 h-5" />
                  <Text className="text-center text-base font-cabin text-neutral-800">ashneergrover@bharatpay.com</Text>
                </View>
                <View className="flex-row items-center justify-center">
                  <Image source={location_icon} alt="mail-icon" className="w-5 h-5"/>
                  <Text className="text-center text-base font-cabin text-neutral-800">Delhi,India</Text>
                </View>
              </View>
          </View>
              <View style={{elevation:10}}  className="py-4 border-[1px] flex-col border-slate-300  rounded-[16px] bg-slate-50 w-full flex justify-center">
                <Text className="font-cabin  text-center ">
                  Flight Preference 
                </Text>
                
                <View className='flex-col items-center justify-center gap-y-4 py-4'>
                <View className='w-[302px]'> 
                  <Select
                    currentOption={titleCase(formData.flightPreference?.seat ?? "")}
                    title='Seat preference'
                    placeholder='Select Seat Preference'
                    options={preference.flightSeatPreference}
                    onSelect={(value) => handleChange('seat', value, 'flight')}
                  />
                </View> 
                <View className='w-[302px]'>
                <Select
                  currentOption={titleCase(formData.flightPreference?.meal ?? "")}
                  title='Meal preference'
                  placeholder='Select Meal Preference'
                  options={preference.mealPreference}
                  onSelect={(value) => handleChange('meal', value, 'flight')}
                />
                </View>
                </View>
              </View>
              <View style={{elevation:10}} className="py-4 border-[1px] flex-col border-slate-300  rounded-[16px] bg-slate-50 w-full flex justify-center">
                <Text className="font-cabin  text-center ">
                 Train Preference 
                </Text>
                
                <View className='flex-col items-center justify-center gap-y-4 py-4'>
                <View className='w-[302px]'>
                  <Select
                    currentOption={titleCase(formData.trainPreference?.seat ?? "")}
                    title='Seat preference'
                    placeholder='Select Seat Preference'
                    options={preference.flightSeatPreference}
                    onSelect={(value) => handleChange('seat', value, 'train')}
                  />
                </View> 
                <View className='w-[302px]'>
                <Select
                  currentOption={titleCase(formData.trainPreference?.meal ?? "")}
                  title='Meal preference'
                  placeholder='Select Meal Preference'
                  options={preference.mealPreference}
                  onSelect={(value) => handleChange('meal', value, 'train')}
                />
                </View>
                </View>
              </View>
              <View style={{elevation:20}} className="py-4 border-[1px] flex-col border-slate-300  rounded-[16px] bg-slate-50 w-full flex justify-center">
                <Text className="font-cabin  text-center ">
                 Bus Preference 
                </Text>
                
                <View className='flex-col items-center justify-center gap-y-4 py-4'>
                <View className='w-[302px]'>
                  <Select
                    currentOption={titleCase(formData.busPreference?.seat ?? "")}
                    title='Seat preference'
                    placeholder='Select Seat Preference'
                    options={preference.flightSeatPreference}
                    onSelect={(value) => handleChange('seat', value, 'bus')}
                  />
                </View> 
                <View className='w-[302px]'>
                <Select
                  currentOption={titleCase(formData.busPreference?.meal ?? "")}
                  title='Meal preference'
                  placeholder='Select Meal Preference'
                  options={preference.mealPreference}
                  onSelect={(value) => handleChange('meal', value, 'bus')}
                />
                </View>
                </View>
              </View>
              <View style={{elevation:10}} className="py-4 border-[1px] flex-col border-slate-300  rounded-[16px] bg-slate-50 w-full flex justify-center">
                <Text className="font-cabin  text-center ">
                 Hotel Preference 
                </Text>
                
                <View className='flex-col items-center justify-center gap-y-4 py-4'>
                <View className='w-[302px]'>
                  <Select
                   currentOption={titleCase(formData.hotelPreference?.roomType ?? "")}
                   options={preference.hotelPreference.roomType}
                   title='Room preference'
                   placeholder='Select Seat Preference'
                   onSelect={(value) => handleChange('roomType', value, 'hotel')}
                  />
                </View> 
                <View className='w-[302px]'>
                <Select
                  title='Bed preference'
                  placeholder='Select Bed Preference'
                  currentOption={titleCase(formData.hotelPreference?.bedType ?? "")}
                  options={preference.hotelPreference.bedType}
                  onSelect={(value) => handleChange('bedType', value, 'hotel')}
                />
                </View>
                </View>
              </View>
              <View style={{elevation:10}} className=" py-4 border-[1px] flex-col  border-slate-300  rounded-[16px] bg-slate-50 w-full  h-auto flex justify-center  ">
              <Text className="font-cabin  text-center ">
                     Emergency Contact 
                </Text>
                <View className='flex-col items-center justify-center gap-y-4 py-4'>
                <View className="">
                  <Input
                    initialValue={formData.emergencyContact?.contactNumber}
                    // value={"formData.emergencyContact?.contactNumber"}
                    onChangeText={(value) => handleChange('contactNumber', value, 'contactDetails')}
                    title='Contact Number'
                    placeholder='Enter Contact Number'
                  />
                </View>
                <View className='w-[302px]'>
                <Select
                  title='Relationship'
                  placeholder='Select Relationship'
                  currentOption={titleCase(formData.emergencyContact?.relationship ?? "")}
                  options={preference.relationship}
                  onSelect={(value) => handleChange('relationship', value, 'contactDetails')}
                />
                </View>
                </View>
              </View>
              <View style={{elevation:0}} className=" py-4 border-[1px] flex-col   border-slate-300  rounded-[16px] bg-slate-50 w-full  h-auto  flex justify-center  ">
              
                <View className='py-4 flex-col items-center justify-center '>
                <View>
                  <Input
                    initialValue={dietaryAllergyField}
                    // value={"formData.emergencyContact?.contactNumber"}
                    onChangeText={(value) => handleChange('dietaryAllergy', value, 'dietary') }
                    title='Dietary Allergic'
                    placeholder='Type about allergy related...'
                  />
                </View>  
                
                
                </View>
              </View>
              

             
         
         
             
            </View>
          
           
      </View>
      </ScrollView>
       </SafeAreaView>}
    </>    
  )
}

export default Profile


// <View className="mt-0 px-2 border-[1px] flex-col border-slate-300  rounded-[16px] bg-slate-50 w-full flex justify-center items-center  ">
// <Text className="font-cabin">
//   Train Preference :
// </Text>
// <Select
//   currentOption={titleCase(formData.trainPreference?.seat ?? "")}
//   title='Seat preference'
//   placeholder='Select Seat Preference'
//   options={preference.trainSeatPreference}
//   onSelect={(value) => handleChange('seat', value, 'train')}
// />
// <Select
//   currentOption={titleCase(formData.trainPreference?.meal ?? "")}
//   title='Meal preference'
//   placeholder='Select Meal Preference'
//   options={preference.mealPreference}
//   onSelect={(value) => handleChange('meal', value, 'train')}
// />
// </View>
// <View className="mt-0 px-2 border-[1px] flex-col  border-slate-300 rounded-[16px] bg-slate-50 w-full flex justify-center items-center ">
// <Text className="font-cabin">
//   Bus Preference :
// </Text>
// <Select
//   currentOption={titleCase(formData.busPreference?.seat ?? "")}
//   title='Seat preference'
//   placeholder='Select Seat Preference'
//   options={preference.busSeatPreference}
//   onSelect={(value) => handleChange('seat', value, 'bus')}
// />
// <Select
//   currentOption={titleCase(formData.busPreference?.meal ?? "")}
//   title='Meal preference'
//   placeholder='Select Meal Preference'
//   options={preference.mealPreference}
//   onSelect={(value) => handleChange('meal', value, 'bus')}
// />
// </View>
// <View className="mt-0 px-2 border-[1px] flex-col  border-slate-300 rounded-[16px] bg-slate-50 w-full flex justify-center items-center  ">
// <Text className="font-cabin">
//   Hotel Preference :
// </Text>
// <Select
//   currentOption={titleCase(formData.hotelPreference?.roomType ?? "")}
//   options={preference.hotelPreference.roomType}
//   title='Room preference'
//   placeholder='Select Seat Preference'
//   onSelect={(value) => handleChange('roomType', value, 'hotel')}
// />
// <Select
//   title='Bed preference'
//   placeholder='Select Meal Preference'
//   currentOption={titleCase(formData.hotelPreference?.bedType ?? "")}
//   options={preference.hotelPreference.bedType}
//   onSelect={(value) => handleChange('bedType', value, 'hotel')}
// />
// </View>
// <View className="mt-0 px-2 border-[1px] flex-col lg:flex-row border-slate-300 rounded-[16px] bg-slate-50 w-full flex justify-center items-center  ">
// <Text className="font-cabin">
//   Emergency Contact  :
// </Text>
// <View className="translate-y-1 w-[400px]">
//   <Input
//     initialValue={formData.emergencyContact?.contactNumber}
//     // value={"formData.emergencyContact?.contactNumber"}
//     onChange={(value) => handleChange('contactNumber', value, 'contactDetails')}
//     title='Contact Number'
//     placeholder='Select Contact Number'
//   />
// </View>
// <Select
//   title='Relationship'
//   placeholder='Select Relationship'
//   currentOption={titleCase(formData.emergencyContact?.relationship ?? "")}
//   options={preference.relationship}
//   onSelect={(value) => handleChange('relationship', value, 'contactDetails')}
// />
// </View>
// <View className="mt-0 px-2 border-[1px] flex-col lg:flex-row border-slate-300  rounded-[16px] bg-slate-50 w-full flex justify-evenly items-center  ">
// <Text className="font-cabin">
//   Dietary Allergic  :
// </Text>
// <View className="translate-y-1 w-[400px] h-[150px]">
//   {/* <TextBox
//     title='Enter Allergic'
//     placeholder='Type about allergy related...'
//     name="myText"
//     initialValue={dietaryAllergyField}
//     onChange={(value) => handleChange('dietaryAllergy', value, 'dietary') }
//   /> */}
// </View>
// </View>