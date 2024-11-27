/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
import { useState, useEffect } from "react";
import { titleCase } from "../utils/handyFunctions";
import Error from "../components/common/Error";
import PopupMessage from "../components/common/PopupMessage";
import {profile_bg, app_icon, airplane_1 as airplane_icon, arrow_left, mail_icon, location_pin, categoryIcons, user_icon, city_icon, profile_newBg, profile_buildBg, dietary, contact} from "../assets/icon";

import { 
  material_flight_black_icon, 
  material_bus_black_icon, 
  material_hotel_black_icon, 
  material_personal_black_icon, 
} from "../assets/icon";
import Select from "../components/common/Select";
import Button from "../components/common/Button";
import Input from "../components/common/SearchInput";
import TextBox from "../components/common/TextBox";
import{useParams} from "react-router-dom";
import { travelPreferences,preference } from "../dummyData/profile";
import { getTravelPreference_API, postTravelPreference_API } from "../utils/api";
import { useData } from "../api/DataProvider";

const Profile = ({fetchData}) => {
  const { employeeData, employeeRoles} = useData()
  const {tenantId, empId, page} = useParams()
  const [formData, setFormData] = useState({
    flightPreference: { seat: '', meal: '' },
    busPreference: { seat: '', meal: '' },
    trainPreference: { seat: '', meal: '' },
    hotelPreference: { roomType: '', bedType: '' },
    emergencyContact: { contactNumber: '', relationship: '' },
    dietaryAllergy: '',
    imageUrl: '',
    employeeName: '',
    location:'',
    emailId:'',
    department:'',
  });

  const [isLoading, setIsLoading] = useState(false)
  const [loadingErrMsg, setLoadingErrMsg] = useState(null)
  const [showPopup , setShowPopup]= useState(false)
  const [message , setMessage]=useState(null)

  useEffect(() => {
    console.log('Profile Tenant ID:', tenantId);
    console.log('Profile Employee ID:', empId);

    if (tenantId && empId) {
      fetchData(tenantId, empId, page);
    }
  }, []);

  useEffect(()=>{
    console.log('profile Tenant ID:', tenantId);
    console.log('profile Employee ID:', empId);

     const fetchProfileData = async() => {
      try{
        setIsLoading(true)
        const response= await getTravelPreference_API({tenantId , empId })
        console.log("response profile", response)
        if(response.error){
          setLoadingErrMsg(response.error.message)
        }else {
          setFormData({
              flightPreference: response?.flightPreference || { seat: '', meal: '' },
              busPreference: response?.busPreference || { seat: '', meal: '' },
              trainPreference: response?.trainPreference || { seat: '', meal: '' },
              hotelPreference: response?.hotelPreference || { roomType: '', bedType: '' },
              emergencyContact: response?.emergencyContact || { contactNumber: '', relationship: '' },
              dietaryAllergy: response?.dietaryAllergy || '',
              imageUrl: response.imageUrl || '',
              employeeName: response.employeeName ??'',
              location:response.location ?? '',
              emailId:response.emailId ?? '',
              department:response.department ??'',
          });
  
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
    if (tenantId && empId) {
      fetchProfileData();
    }
  
  },[tenantId, empId])
  
  const handleChange = (field, value, fieldFor) => {
    setFormData((prevData) => {
      let updatedData = {};
  
      if (fieldFor === 'flight') {
        updatedData = { flightPreference: { ...prevData.flightPreference, [field]: value } };
      } else if (fieldFor === 'train') {
        updatedData = { trainPreference: { ...prevData.trainPreference, [field]: value } };
      } else if (fieldFor === 'bus') {
        updatedData = { busPreference: { ...prevData.busPreference, [field]: value } };
      } else if (fieldFor === 'hotel') {
        updatedData = { hotelPreference: { ...prevData.hotelPreference, [field]: value } };
      } else if (fieldFor === 'contactDetails') {
        updatedData = { emergencyContact: { ...prevData.emergencyContact, [field]: value } };
      } else if (fieldFor === 'dietary') {
        updatedData = { dietaryAllergy: value };
      }
  
      return {
        ...prevData,
        ...updatedData,
      };
    });
  };
  
  const handleSaveProfile = async () => {
    console.log('Form Data before saving:', formData);
    console.log('Tenant ID:', tenantId);
    console.log('Employee ID:', empId);
  
    try {
      setIsLoading(true);
      const response = await postTravelPreference_API(tenantId, empId, formData);
      if (response.error) {
        setLoadingErrMsg(response.error.message);
      } else {
        setLoadingErrMsg('Profile has been updated successfully.');
      }
    } catch (error) {
      setLoadingErrMsg(error.message);
      setMessage(error.message);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (url) => {
   setFormData({
    ...formData,
    imageUrl:url,
   });
  };

  const getInitials = (name) => {
    if (!name) return '';
    const initials = name.split(' ').map(word => word[0]).join('');
    return initials.toUpperCase();
  };

  return (
    <>
      {isLoading && <Error message={loadingErrMsg} />}
      {!isLoading && 
        <div className="w-full min-h-screen bg-white px-4 sm:px-6 md:px-12 lg:px-7 py-6">
          <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="flex rounded-t-[16px] bg-slate-50 border border-slate-300 flex-col sm:flex-row justify-between px-4 py-5 mb-4">
              <div className="inline-flex gap-2 p-4 font-cabin text-base font-medium items-center mb-2 sm:mb-0">
                <p>Your Profile</p>
              </div>

              <div className="flex items-center w-full sm:w-auto">
                <Button 
                  onClick={handleSaveProfile} 
                  text='Save' 
                  textAndBgColor='bg-indigo-600 text-white w-full sm:w-auto'
                />
              </div>
            </div>

            {/* Profile Image Section */}
            <div className="flex justify-center items-center flex-col">
              <div className='w-full h-[150px] md:h-[200px] flex justify-center md:justify-start lg:justify-start overflow-hidden'>
                <img 
                  src={profile_buildBg} 
                  alt="profile-bg" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="-mt-12 md:-mt-16 text-center">
                <div className="rounded-full bg-black-400 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center mx-auto shadow-md border-4 border-white hover:scale-110 transition duration-200">
                  {formData ? (
                    <img 
                      src={profile_newBg}
                      alt={getInitials(formData.employeeName)} 
                      className="rounded-full w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="flex items-center justify-center text-white font-italic text-2xl tracking-wide">
                      {getInitials(formData.employeeName)}
                    </div>
                  )}
                </div>

                
                {formData?.employeeName && (
                  <div className="mt-4">
                    <div className="font-cabin text-lg md:text-xl text-neutral-800">
                      {formData?.employeeName}
                    </div>
                    <div className="font-cabin text-sm text-neutral-600">
                      {formData?.department}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info Section */}
            {formData && (
              <div className="mt-4 border border-slate-300 rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-[70px]">
                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4">
                  <div className="flex-1 inline-flex items-center justify-center">
                    <img src={mail_icon} alt="mail-icon" className="w-5 h-5 mr-2" />
                    <div className="text-center text-base font-cabin">{formData?.emailId}</div>
                  </div>
                  <div className="flex-1 inline-flex items-center justify-center">
                    <img src={location_pin} alt="location-icon" className="w-5 h-5 mr-2" />
                    <div className="text-center text-base font-cabin">{formData?.location}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Section */}
            <div className="flex-col mt-4 py-4 border border-slate-300 rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-full px-4 space-y-4">
              {formData && (
                <>
                  {/* Flight Preference */}
                  <div className="mt-0 px-2 border border-slate-300 flex-col lg:flex-row rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-auto py-5">
                    <div className="font-cabin mr-4 mb-2 lg:mb-0">
                    <img src={material_flight_black_icon} alt="Flight-icon" className="w-5 h-5"/>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                      <Select
                        currentOption={titleCase(formData?.flightPreference?.seat ?? "Select Seat")}
                        title='Seat preference'
                        options={preference.flightSeatPreference}
                        onSelect={(value) => handleChange('seat', value, 'flight')}
                      />
                      <Select
                        currentOption={titleCase(formData.flightPreference?.meal ?? "Select Meal")}
                        title='Meal preference'
                        options={preference.mealPreference}
                        onSelect={(value) => handleChange('meal', value, 'flight')}
                      />
                    </div>
                  </div>

                  {/* Bus Preference */}
                  <div className="mt-0 px-2 border border-slate-300 flex-col lg:flex-row rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-auto py-5">
                    <div className="font-cabin mr-4 mb-2 lg:mb-0">
                    <img src={material_bus_black_icon} alt="Bus-Icon" className="w-5 h-5"/>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                      <Select
                        currentOption={titleCase(formData.busPreference?.seat ?? "")}
                        title='Seat preference'
                        placeholder='Select Seat'
                        options={preference.busSeatPreference}
                        onSelect={(value) => handleChange('seat', value, 'bus')}
                      />
                      <Select
                        currentOption={titleCase(formData.busPreference?.meal ?? "")}
                        title='Meal preference'
                        placeholder='Select Meal'
                        options={preference.mealPreference}
                        onSelect={(value) => handleChange('meal', value, 'bus')}
                      />
                    </div>
                  </div>

                  {/* Hotel Preference */}
                  <div className="mt-0 px-2 border border-slate-300 flex-col lg:flex-row rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-auto py-5">
                    <div className="font-cabin mr-4 mb-2 lg:mb-0">
                      <img src={material_hotel_black_icon} alt="Hotel-icon" className="w-5 h-5"/>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                      <Select
                        currentOption={titleCase(formData.hotelPreference?.roomType ?? "")}
                        options={preference.hotelPreference.roomType}
                        title='Room preference'
                        placeholder='Select Room Type'
                        onSelect={(value) => handleChange('roomType', value, 'hotel')}
                      />
                      <Select
                        title='Bed preference'
                        placeholder='Select Bed Type'
                        currentOption={titleCase(formData.hotelPreference?.bedType ?? "")}
                        options={preference.hotelPreference.bedType}
                        onSelect={(value) => handleChange('bedType', value, 'hotel')}
                      />
                    </div>
                  </div>

                  {/* Emergency Contact */}
                <div className="mt-0 px-2 border border-slate-300 flex-col lg:flex-row rounded-[16px] bg-slate-50 w-full flex justify-center items-center h-auto py-5">
                    <div className="font-cabin mr-4 mb-2 lg:mb-0">
                      <img src={contact} alt="Emergency-contact-icon" className="w-5 h-5"/>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
                      <div className="w-full max-w-sm">
                        <label
                        htmlFor="contactNumber"
                        className="text-sm font-medium text-gray-400 mb-1"
                        >
                        Emergency Contact Number
                        </label>
                        <Input
                          initialValue={formData.emergencyContact?.contactNumber}
                          value={formData.emergencyContact?.contactNumber}
                          onChange={(value) => {
                            const numericAndSpecial = value.replace(/[a-zA-Z]/g, "");
                            if (value !== numericAndSpecial) {
                              alert("Only numbers and special characters are allowed");
                            }
                          handleChange('contactNumber', numericAndSpecial, 'contactDetails')
                          }}
                          title='Contact Number'
                          placeholder='Enter Contact Number'
                        />
                      </div>
                      <div className="w-full max-w-sm">
                        <Select
                          title='Relationship'
                          placeholder='Select Relationship'
                          currentOption={titleCase(formData.emergencyContact?.relationship ?? "")}
                          options={preference.relationship}
                          onSelect={(value) => handleChange('relationship', value, 'contactDetails')}
                        />
                      </div>
                    </div>
                  </div> 

                  {/* Dietary Allergies */}
                  <div className="mt-0 px-2 border border-slate-300 flex-col lg:flex-row rounded-[16px] bg-slate-50 w-full flex justify-evenly items-center h-auto py-5">
                <div className="font-cabin mr-4 mb-2 lg:mb-0">
                  <img src={dietary} alt="Dietary-Allergies-icon" className="w-5 h-5"/>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
                <div className="w-full max-w-sm">
                  <TextBox
                    title='Enter Allergic'
                    placeholder='Type about allergy related...'
                    name="myText"
                    initialValue={formData?.dietaryAllergy}
                    value = {formData?.dietaryAllergy}
                    onChange={(value) => handleChange('dietaryAllergy', value, 'dietary') }
                  />
                </div>
              </div>
              </div>
              </>
            )}
            </div>
          </div>
        </div>
      }
      <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>
    </>
  )
}

export default Profile;




































