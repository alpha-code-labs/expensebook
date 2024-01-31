import React,{useEffect, useState} from 'react'
import { View,Text, ActivityIndicator,Image } from 'react-native'
import { getPreferenceDataApi } from '../../../../utils/api/dashboardApi'
import { travelPreferences,preference } from '../../../../dummyData/dashboard/profile'
import { profile_bg,arrow_left, mail_icon, location_icon } from '../../../../../assets/icon'
import Input from '../../../../components/common/Input'
// import Select from '../../../../components/common/Select'

const Profile = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const [isUploading  , setIsUploading]=useState(false)
    const [preferenceData , setPreferenceData]= useState(null) //get preferences option
    
    
    useEffect(()=>{
       (async function(){
        const {data ,error} = getPreferenceDataApi()
        if(error){
            setLoadingErrMsg(error.message)
            console.log('Error in fetching preference data')
        }else{
            setPreferenceData(data)
            console.log('Preference data fetched.')
            setIsLoading(false)
        }
       })

    },[])


    const [formData, setFormData] = useState({
        flightPreference: { seat: '', meal: '' },
        busPreference: { seat: '', meal: '' },
        trainPreference: { seat: '', meal: '' },
        hotelPreference: { roomType: '', bedType: '' },
        emergencyContact: { contactNumber: '', relationship: '' },
        dietaryAllergy: '',
      });
    
    
     
      const [showPopup , setShowPopup]= useState(false)
      const [message , setMessage]=useState(null)
    
    
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
    
    
    
      const handleSaveProfile = async() => {
        console.log(formData);
    
        // Add logic to send formData to the backend for saving/updating
        try{
          setIsLoading(true)
          const response= await postTravelPreference_API(formData)
          if(response.error){
            setLoadingErrMsg(response.error.message)
          }else{
            setLoadingErrMsg('Profile has been updated successfully.')
    
          }
        }catch(error){
          setLoadingErrMsg(error.message)
          setMessage(error.message)
          setShowPopup(true)
          setTimeout(() => {
            setShowPopup(false)
          }, 3000);
          
        } finally{
          setIsLoading(false);
        }}



  return (
    <View>
        <View className="w-full h-full relative bg-white-100 md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
          <View className="flex flex-col h-full  ">
            <View className="flex rounded-t-[16px] bg-slate-50  border-[1px] border-slate-300 flex-row justify-between px-4 py-5">
            {/* <View className="inline-flex gap-2 p-4 font-cabin text-base font-medium">
              <Image source={arrow_left} alt="arrow-left" />
              <Text>Your Profile</Text>
            </View> */}
            {/* <View className="w-fit">
              <Button onClick={handleSaveProfile} text='Save' textAndBgColor='bg-indigo-600 text-white-100' />
            </View> */}
            </View>
            <View className="flex justify-center items-center flex-col">
              <View className='h-[10px]'>
                <Image source={profile_bg} alt="profile-bg" className='h-32'/>
              </View>
              <View className="translate-y-[-50px] bottom-[-50px]">
                <View className="  rounded-full bg-indigo-100 flex shrink  w-[104px] h-[104px] items-center justify-center  mx-auto  shadow-md border-4 border-white-100 transition duration-200 transform hover:scale-110">
                  <Text className="text-white">K V</Text>
                </View>
                <View className="flex flex-col items-center">
                  <Text className="font-cabin text-lg text-neutral-800">Ashneer Grover</Text>
                  <Text className="font-cabin text-medium text-neutral-600">CEO</Text>
                </View>
              </View>
            </View>
            <View className="border-[1px] border-slate-300 gap-8 rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-[70px] ">
              <View className="w-full flex md:flex-row flex-col justify-center items-center gap-2">
                <View className="flex-1 inline-flex items-center justify-center ">
                  <Image source={mail_icon} alt="mail-icon" className="w-5 h-5" />
                  <Text className="text-center text-base font-cabin">ashneergrover@bharatpay.com</Text>
                </View>
                <View className="flex-1 inline-flex items-center justify-center">
                  <Image source={location_icon} alt="mail-icon" className="w-5 h-5" />
                  <Text className="text-center text-base font-cabin">Delhi,India</Text>
                </View>
              </View>
            </View>
            <View className="flex-col mt-4 py-4 border-[1px] border-slate-300 gap-8 rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-full px-4">
              <View className="mt-0 px-2 border-[1px] flex-col lg:flex-row border-slate-300 gap-8 rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-auto py-5">
                <Text className="font-cabin">
                  Flight Preference :
                </Text>
                {/* <Select
                  currentOption={titleCase(formData.busPreference?.seat ?? "")}
                  title='Seat preference'
                  placeholder='Select Seat Preference'
                  options={preference.flightSeatPreference}
                  onSelect={(value) => handleChange('seat', value, 'flight')}
                />
                <Select
                  currentOption={titleCase(formData.flightPreference?.meal ?? "")}
                  title='Meal preference'
                  placeholder='Select Meal Preference'
                  options={preference.mealPreference}
                  onSelect={(value) => handleChange('meal', value, 'flight')}
                /> */}
              </View>
              <View className="mt-0 px-2 border-[1px] flex-col lg:flex-row border-slate-300 gap-8 rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-auto py-5">
                <Text className="font-cabin">
                  Train Preference :
                </Text>
                {/* <Select
                  currentOption={titleCase(formData.trainPreference?.seat ?? "")}
                  title='Seat preference'
                  placeholder='Select Seat Preference'
                  options={preference.trainSeatPreference}
                  onSelect={(value) => handleChange('seat', value, 'train')}
                />
                <Select
                  currentOption={titleCase(formData.trainPreference?.meal ?? "")}
                  title='Meal preference'
                  placeholder='Select Meal Preference'
                  options={preference.mealPreference}
                  onSelect={(value) => handleChange('meal', value, 'train')}
                /> */}
              </View>
              <View className="mt-0 px-2 border-[1px] flex-col lg:flex-row border-slate-300 gap-8 rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-auto py-5">
                <Text className="font-cabin">
                  Bus Preference :
                </Text>
                {/* <Select
                  currentOption={titleCase(formData.busPreference?.seat ?? "")}
                  title='Seat preference'
                  placeholder='Select Seat Preference'
                  options={preference.busSeatPreference}
                  onSelect={(value) => handleChange('seat', value, 'bus')}
                />
                <Select
                  currentOption={titleCase(formData.busPreference?.meal ?? "")}
                  title='Meal preference'
                  placeholder='Select Meal Preference'
                  options={preference.mealPreference}
                  onSelect={(value) => handleChange('meal', value, 'bus')}
                /> */}
              </View>
              <View className="mt-0 px-2 border-[1px] flex-col lg:flex-row border-slate-300 gap-8 rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-auto py-5">
                <Text className="font-cabin">
                  Hotel Preference :
                </Text>
                {/* <Select
                  currentOption={titleCase(formData.hotelPreference?.roomType ?? "")}
                  options={preference.hotelPreference.roomType}
                  title='Room preference'
                  placeholder='Select Seat Preference'
                  onSelect={(value) => handleChange('roomType', value, 'hotel')}
                />
                <Select
                  title='Bed preference'
                  placeholder='Select Meal Preference'
                  currentOption={titleCase(formData.hotelPreference?.bedType ?? "")}
                  options={preference.hotelPreference.bedType}
                  onSelect={(value) => handleChange('bedType', value, 'hotel')}
                /> */}
              </View>
              <View className="mt-0 px-2 border-[1px] flex-col lg:flex-row border-slate-300 gap-8 rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-auto py-5">
                <Text className="font-cabin">
                  Emergency Contact  :
                </Text>
                <View className="translate-y-1 w-[400px]">
                  <Input
                    initialValue={formData.emergencyContact?.contactNumber}
                    // value={"formData.emergencyContact?.contactNumber"}
                    onChange={(value) => handleChange('contactNumber', value, 'contactDetails')}
                    title='Contact Number'
                    placeholder='Select Contact Number'
                  />
                </View>
                {/* <Select
                  title='Relationship'
                  placeholder='Select Relationship'
                  currentOption={titleCase(formData.emergencyContact?.relationship ?? "")}
                  options={preference.relationship}
                  onSelect={(value) => handleChange('relationship', value, 'contactDetails')}
                /> */}
              </View>
              <View className="mt-0 px-2 border-[1px] flex-col lg:flex-row border-slate-300 gap-8 rounded-[16px] bg-slate-50 w-full flex justify-evenly items-center h-auto py-5">
                <Text className="font-cabin">
                  Dietary Allergic  :
                </Text>
                <View className="translate-y-1 w-[400px] h-[150px]">
                  {/* <TextBox
                    title='Enter Allergic'
                    placeholder='Type about allergy related...'
                    name="myText"
                    initialValue={dietaryAllergyField}
                    onChange={(value) => handleChange('dietaryAllergy', value, 'dietary') }
                  /> */}
                </View>
              </View>
            </View>
          </View>
        </View>
    </View>
  )
}

export default Profile
