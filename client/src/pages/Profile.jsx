/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
import { useState, useEffect } from "react";
import { titleCase } from "../utils/handyFunctions";
import Error from "../components/common/Error";
import PopupMessage from "../components/common/PopupMessage";
import {profile_bg, app_icon, airplane_1 as airplane_icon, arrow_left, mail_icon, location_pin } from "../assets/icon";
import Select from "../components/common/Select";
import Button from "../components/common/Button";
import Input from "../components/common/SearchInput";
import TextBox from "../components/common/TextBox";
import { travelPreferences,preference } from "../dummyData/profile";
import { postTravelPreference_API } from "../utils/api";

const Profile = () => {

  const [formData, setFormData] = useState({
    flightPreference: { seat: '', meal: '' },
    busPreference: { seat: '', meal: '' },
    trainPreference: { seat: '', meal: '' },
    hotelPreference: { roomType: '', bedType: '' },
    emergencyContact: { contactNumber: '', relationship: '' },
    dietaryAllergy: '',
  });


  const [isLoading, setIsLoading] = useState(false)
  const [loadingErrMsg, setLoadingErrMsg] = useState(null)
  const [showPopup , setShowPopup]= useState(false)
  const [message , setMessage]=useState(null)


  //get data 
  useEffect(()=>{
    // const backendData = {
      // flightPreference: { seat: 'aisle seat', meal: 'veg meal' },
      // busPreference: { seat: 'window seat', meal: 'non-veg meal' },
      // trainPreference: { seat: 'upper birth', meal: 'vegan' },
      // hotelPreference: { roomType: 'single', bedType: 'king' },
      // emergencyContact: { contactNumber: '1234567890', relationship: 'sister' },
      // dietaryAllergy: 'No allergies',
    // };
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
      const response= await postTravelPreference_API({tenantId , empId ,formData})
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
    }
  
  }

  return (
    <>
      {isLoading && <Error message={loadingErrMsg} />}
      {!isLoading && 
        <div className="w-full h-full relative bg-white-100 md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
          <div className="flex flex-col h-full  ">
            <div className="flex rounded-t-[16px] bg-slate-50  border-[1px] border-slate-300 flex-row justify-between px-4 py-5">
            <div className="inline-flex gap-2 p-4 font-cabin text-base font-medium">
              <img src={arrow_left} alt="arrow-left" />
              <p>Your Profile</p>
            </div>
            <div className="w-fit">
              <Button onClick={handleSaveProfile} text='Save' textAndBgColor='bg-indigo-600 text-white-100' />
            </div>
            </div>
            <div className="flex justify-center items-center flex-col">
              <div className=' w-full  lg:h-[200px] h-[150px] flex justify-center  md:justify-start lg:justify-start'>
                <img src={profile_bg} alt="profile-bg" />
              </div>
              <div className="translate-y-[-50px] bottom-[-50px]">
                <div className="  rounded-full bg-indigo-100 flex shrink  w-[104px] h-[104px] items-center justify-center  mx-auto  shadow-md border-4 border-white-100 transition duration-200 transform hover:scale-110">
                  <h2 className="text-white">K V</h2>
                </div>
                <div className="flex flex-col items-center">
                  <div className="font-cabin text-lg text-neutral-800">Ashneer Grover</div>
                  <div className="font-cabin text-medium text-neutral-600">CEO</div>
                </div>
              </div>
            </div>
            <div className="border-[1px] border-slate-300 gap-8 rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-[70px] ">
              <div className="w-full flex md:flex-row flex-col justify-center items-center gap-2">
                <div className="flex-1 inline-flex items-center justify-center ">
                  <img src={mail_icon} alt="mail-icon" className="w-5 h-5" />
                  <div className="text-center text-base font-cabin">ashneergrover@bharatpay.com</div>
                </div>
                <div className="flex-1 inline-flex items-center justify-center">
                  <img src={location_pin} alt="mail-icon" className="w-5 h-5" />
                  <div className="text-center text-base font-cabin">Delhi,India</div>
                </div>
              </div>
            </div>
            <div className="flex-col mt-4 py-4 border-[1px] border-slate-300 gap-8 rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-full px-4">
              <div className="mt-0 px-2 border-[1px] flex-col lg:flex-row border-slate-300 gap-8 rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-auto py-5">
                <div className="font-cabin">
                  Flight Preference :
                </div>
                <Select
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
                />
              </div>
              <div className="mt-0 px-2 border-[1px] flex-col lg:flex-row border-slate-300 gap-8 rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-auto py-5">
                <div className="font-cabin">
                  Train Preference :
                </div>
                <Select
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
                />
              </div>
              <div className="mt-0 px-2 border-[1px] flex-col lg:flex-row border-slate-300 gap-8 rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-auto py-5">
                <div className="font-cabin">
                  Bus Preference :
                </div>
                <Select
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
                />
              </div>
              <div className="mt-0 px-2 border-[1px] flex-col lg:flex-row border-slate-300 gap-8 rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-auto py-5">
                <div className="font-cabin">
                  Hotel Preference :
                </div>
                <Select
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
                />
              </div>
              <div className="mt-0 px-2 border-[1px] flex-col lg:flex-row border-slate-300 gap-8 rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-auto py-5">
                <div className="font-cabin">
                  Emergency Contact  :
                </div>
                <div className="translate-y-1 w-[400px]">
                  <Input
                    initialValue={formData.emergencyContact?.contactNumber}
                    // value={"formData.emergencyContact?.contactNumber"}
                    onChange={(value) => handleChange('contactNumber', value, 'contactDetails')}
                    title='Contact Number'
                    placeholder='Select Contact Number'
                  />
                </div>
                <Select
                  title='Relationship'
                  placeholder='Select Relationship'
                  currentOption={titleCase(formData.emergencyContact?.relationship ?? "")}
                  options={preference.relationship}
                  onSelect={(value) => handleChange('relationship', value, 'contactDetails')}
                />
              </div>
              <div className="mt-0 px-2 border-[1px] flex-col lg:flex-row border-slate-300 gap-8 rounded-[16px] bg-slate-50 w-full flex justify-evenly items-center h-auto py-5">
                <div className="font-cabin">
                  Dietary Allergic  :
                </div>
                <div className="translate-y-1 w-[400px] h-[150px]">
                  <TextBox
                    title='Enter Allergic'
                    placeholder='Type about allergy related...'
                    name="myText"
                    initialValue={dietaryAllergyField}
                    onChange={(value) => handleChange('dietaryAllergy', value, 'dietary') }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
       <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>
    </>
  )
}

export default Profile;
