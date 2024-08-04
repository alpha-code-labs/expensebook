import React,{useState,useEffect} from "react";
import { intransit_trip, arrow_left, down_arrow, chevron_down, cancel_round, cancel} from '../../assets/icon';
import Modal from '../../components/Modal';
import Dropdown from '../../components/Dropdown';
import Input from '../../components/Input';
import DateTime from '../../components/DateTime';
import Date from '../../components/Date';
import SlimDate from '../../components/SlimDate';
import Button from '../../components/common/Button';
import ShowCabDates from "../common/ShowCabDates";
import TimePicker from "../common/TimePicker";
import AddressInput from "../common/AddressInput";
import { submitLeg } from "../../utils/api";




const LegForm = ({handleOpenOverlay ,onClose}) => {
    const options = ['flight','bus','train', 'hotel', 'cab'];
    const [selectedOption, setSelectedOption] = useState(null);
    
  
    const handleDropdownChange = (value) => {
      setSelectedOption(value);
    };
  
   

    return (
      <div className="flex flex-col w-[632px] shrink flex-grow  min-h-[150px] h-auto rounded-lg bg-white-300 max-h-screen overflow-y-auto">
        <div className='flex flex-col h-auto justify-between p-4 '>
         <div className='flex flex-row justify-between'>
          <div className='flex flex-row gap-2 font-cabin text-sm mb-3' >
            {/* <img src={arrow_left} alt='left_arrow' width={20} height={20}/> */}
            <span className='text-lg font-medium leading-6 text-primary-light '>Add a Leg</span>
          </div>
          <div className='p-2 bg-slate-100 hover:bg-red-100 rounded-full' onClick={onClose}>
            <img src={cancel} alt='cancel' width={20} height={20}/>
          </div>
          </div>
         
  
          <div className='h-[48px] '>
            <Dropdown
          title="Itinerary"
          placeholder="Select Itinerary"
          options={options}
          onSelect={handleDropdownChange}
          // currentOption="" // Pass your initial selected option
          violationMessage="Your violation message" // Pass your violation message
          error={{ set: true, message: "Your error message" }} // Pass your error object
          required={true} // Specify if the field is required
          submitAttempted={false} // Indicate if a form submission has been attempted
        />
            
          </div>
        </div>
       <hr className='mt-10 border-[1px] border-slate-00'/>
        {/* Display "hello" div below the Dropdown */}
  
        <div className='m-4 '>
          {selectedOption === 'flight' && (<ModeOfTransit selectedOption={selectedOption}  onClose={onClose} handleOpenOverlay={handleOpenOverlay} />)}
          {selectedOption === 'train'  && (<ModeOfTransit selectedOption={selectedOption}  onClose={onClose} handleOpenOverlay={handleOpenOverlay}/>)}
          {selectedOption === 'bus'    && (<ModeOfTransit selectedOption={selectedOption} onClose={onClose} handleOpenOverlay={handleOpenOverlay}/>)}
          {selectedOption === 'hotel'  && (<Hotel />)}
          {selectedOption === 'cab'    && (<Cab selectedOption={selectedOption} onClose={onClose} handleOpenOverlay={handleOpenOverlay}/>)}
         
        </div>
        
      </div>
    );
  }
 
export default LegForm;





const ModeOfTransit = ({ handleOpenOverlay, onClose , selectedOption }) => {
  const [activeTab, setActiveTab] = useState('One Way'); 
  const [modeOfTransitDetails, setModeOfTransitDetails] = useState({
    action: `add${selectedOption}`,
    modeOfTransitDetails: [
      {
        from: '',
        to: '',
        date: '',
        time: '',
        travelClass: '',
        isReturnTravel: false,
      },
     {
        from: '',
        to: '',
        date: '',
        time: '',
        travelClass: '',
        isReturnTravel: false,
      }, 
    ],
  });

  const [errors , setErrors]= useState({
    from :{set: false , message: ''},
    to:{set:false ,message:''},
    date:{set:false, message:''},
    time:{set:false,message:''},
    travelClass:{set:false,message:''},
  })

 

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
  };
  
  
  
  

  const handleInputChange = (value, key) => {
    setModeOfTransitDetails((prevMode) => {
      const newModeOfTransitDetails = [...prevMode.modeOfTransitDetails];
      newModeOfTransitDetails[0][key] = value;

      return {
        ...prevMode,
        modeOfTransitDetails: newModeOfTransitDetails,
      };
    });
  };



  const handleDropdownChange = (selectedOption) => {
    setModeOfTransitDetails((prevMode) => {
      const newModeOfTransitDetails = [...prevMode.modeOfTransitDetails];
      newModeOfTransitDetails[0].travelClass = selectedOption;
      if(activeTab === 'Round Trip'){
        newModeOfTransitDetails[0].isReturnTravel = true;
        
      }
      
      return {
        ...prevMode,
        modeOfTransitDetails: newModeOfTransitDetails,
      };
    });
  };



  const handleDateTimeChange = (date, time, key, isReturnTravel) => {
    setModeOfTransitDetails((prevMode) => {
      const newModeOfTransitDetails = [...prevMode.modeOfTransitDetails];
      const index = isReturnTravel ? 1 : 0;

      newModeOfTransitDetails[index][key] = isReturnTravel
        ? date // Use departure date for return date if Round Trip
        : date;

      newModeOfTransitDetails[index]['time'] = time;

      return {
        ...prevMode,
        modeOfTransitDetails: newModeOfTransitDetails,
      };
    });
  };

  const handleConfirm = async () => {
    // Destructure the current flight details
    const [outboundDetails, returnDetails] = modeOfTransitDetails.modeOfTransitDetails;
  
    if (activeTab === 'Round Trip') {
      // Swap "from" and "to" values in returnDetails
      returnDetails.from = outboundDetails.to;
      returnDetails.to = outboundDetails.from;
      returnDetails.isReturnTravel = true;
      returnDetails.travelClass = outboundDetails.travelClass;
  
      // Update the state with the modified flight details
      setModeOfTransitDetails((prevMode) => ({
        ...prevMode,
        modeOfTransitDetails: [outboundDetails, returnDetails],
      }));
    }
  
    // Set isReturnTravel to false in outboundDetails when not Round Trip
    outboundDetails.isReturnTravel = false;
  
    // Validation flag
    let formIsValid = true;
  
    // Validation function to check if a value is empty or null
    const isNullOrEmpty = (value) => {
      return value == null || value.trim() === '';
    };
  
    // Validation for "From" field
    if (isNullOrEmpty(outboundDetails.from)) {
      setErrors((prevErrors) => ({ ...prevErrors, from: { set: true, message: 'Enter departure location.' } }));
      formIsValid = false;
    }
  
    // Validation for "To" field
    if (isNullOrEmpty(outboundDetails.to)) {
      setErrors((prevErrors) => ({ ...prevErrors, to: { set: true, message: 'Enter destination location.' } }));
      formIsValid = false;
    }
  
    // Validation for "Travel Class" field
    if (isNullOrEmpty(outboundDetails.travelClass)) {
      setErrors((prevErrors) => ({ ...prevErrors, travelClass: { set: true, message: 'Select a travel class.' } }));
      formIsValid = false;
    }
  
    // Validation for "Departure Date and Time" field
    if (isNullOrEmpty(outboundDetails.date) || isNullOrEmpty(outboundDetails.time)) {
      setErrors((prevErrors) => ({ ...prevErrors, date: { set: true, message: 'Enter departure date and time.' } }));
      formIsValid = false;
    }
  
    // Validation for "Return Date and Time" field if activeTab is 'Round Trip'
    if (activeTab === 'Round Trip' && (isNullOrEmpty(returnDetails.date) || isNullOrEmpty(returnDetails.time))) {
      setErrors((prevErrors) => ({ ...prevErrors, date: { set: true, message: 'Enter return date and time.' } }));
      formIsValid = false;
    }
  
    // If form is not valid, stop the submission
    if (!formIsValid) {
      console.error('Validation Error: Please fill in all required fields.');
      return;
    }
  
    // Continue with form submission
    console.log('Sending data to backend:', modeOfTransitDetails);
  
    const tenantId = '65ddbe4f905e5ef67d8ab969';
    const tripId = 'TRIPABG000001';
    const empId = '1003';
  
    try {
      const response = await submitLeg(tenantId, tripId, empId, modeOfTransitDetails);
      console.log('Leg Submitted Successfully', response);
  
      // Refresh the dashboard
      onClose();
      handleOpenOverlay();
    } catch (error) {
      console.error('Error Submitting leg', error);
    }
  };
  
  
  //   // Destructure the current flight details
  //   const [outboundDetails, returnDetails] = modeOfTransitDetails.modeOfTransitDetails;
    
  
  //   if (activeTab === 'Round Trip') {
  //     // Swap "from" and "to" values in returnDetails
  //     returnDetails.from = outboundDetails.to;
  //     returnDetails.to = outboundDetails.from;
  //     returnDetails.isReturnTravel= true;
  //     returnDetails.travelClass=outboundDetails.travelClass
  
  //     // Update the state with the modified flight details
  //     setModeOfTransitDetails((prevMode) => ({
  //       ...prevMode,
  //       modeOfTransitDetails: [outboundDetails, returnDetails],
  //     }));
  //   }
  
  //   // Validation flag
  //   let formIsValid = true;
  
  //   // Validation function to check if a value is empty or null
  //   const isNullOrEmpty = (value) => {
  //     return value == null || value.trim() === '';
  //   };
  
  //   // Validation for "From" field
  //   if (isNullOrEmpty(outboundDetails.from)) {
  //     setErrors((prevErrors) => ({ ...prevErrors, from: { set: true, message: 'Enter departure location.' } }));
  //     formIsValid = false;
  //   }
  
  //   // Validation for "To" field
  //   if (isNullOrEmpty(outboundDetails.to)) {
  //     setErrors((prevErrors) => ({ ...prevErrors, to: { set: true, message: 'Enter destination location.' } }));
  //     formIsValid = false;
  //   }
  
  //   // Validation for "Travel Class" field
  //   if (isNullOrEmpty(outboundDetails.travelClass)) {
  //     setErrors((prevErrors) => ({ ...prevErrors, travelClass: { set: true, message: 'Select a travel class.' } }));
  //     formIsValid = false;
  //   }
  
  //   // Validation for "Departure Date and Time" field
  //   if (isNullOrEmpty(outboundDetails.date) || isNullOrEmpty(outboundDetails.time)) {
  //     setErrors((prevErrors) => ({ ...prevErrors, date: { set: true, message: 'Enter departure date and time.' } }));
  //     formIsValid = false;
  //   }
  
  //   // Validation for "Return Date and Time" field if activeTab is 'Round Trip'
  //   if (activeTab === 'Round Trip' && (isNullOrEmpty(returnDetails.date) || isNullOrEmpty(returnDetails.time))) {
  //     setErrors((prevErrors) => ({ ...prevErrors, date: { set: true, message: 'Enter return date and time.' } }));
  //     formIsValid = false;
  //   }
  
  //   // If form is not valid, stop the submission
  //   if (!formIsValid) {
  //     console.error('Validation Error: Please fill in all required fields.');
  //     return;
  //   }
  
  //   // Continue with form submission
  //   console.log('Sending data to backend:', modeOfTransitDetails);
  
  //   const tenantId = '65ddbe4f905e5ef67d8ab969';
  //   const tripId = 'TRIPABG000001';
  //   const empId = '1003';
  
  //   try {
  //     const response = await submitLeg(tenantId, tripId, empId, modeOfTransitDetails);
  //     console.log('Leg Submitted Successfully', response);
  
  //     // Refresh the dashboard
  //     onClose();
  //     handleOpenOverlay();
  //   } catch (error) {
  //     console.error('Error Submitting leg', error);
  //   }
  // };
  
//   const handleConfirm = async() => {
//     // Destructure the current flight details
    // const [outboundDetails, returnDetails] = modeOfTransitDetails.modeOfTransitDetails;
  
    // if (activeTab === 'Round Trip') {
    //   // Swap "from" and "to" values in returnDetails
    //   returnDetails.from = outboundDetails.to;
    //   returnDetails.to = outboundDetails.from;
  
    //   // Update the state with the modified flight details
    //   setModeOfTransitDetails((prevMode) => ({
    //     ...prevMode,
    //     modeOfTransitDetails: [outboundDetails, returnDetails],
    //   }));
    // }
  
//     // Now you can send modeOfTransitDetails to the backend using Axios
//     console.log('Sending data to backend:', modeOfTransitDetails);


//     const tenantId = '65ddbe4f905e5ef67d8ab969';
//     const tripId = 'TRIPABG000001';
//     const empId = '1003';

//     try{
//       const response = await submitLeg(
//         tenantId,
//         tripId,
//         empId,
//         modeOfTransitDetails
//       )
// console.log('Leg Submitted Succussfully'), response
// ///refresh the dashboard
// onClose()
// handleOpenOverlay()
//     }catch(error){
//       console.error('Error Submitting leg', error)
//     }

// };


  return (
    <div>
      <h1 className="text-start pb-3 font-cabin font-medium text-base">Flight Details :</h1>
      <div className="flex flex-row items-center justify-start text-center font-cabin">
        <div
          className={`py-1 px-2 rounded-xl ${
            activeTab === 'One Way' ? 'font-medium bg-purple-500 text-white text-xs rounded-xl' : ''
          }`}
          onClick={() => handleTabChange('One Way')}
        >
          One Way
        </div>
        <div
          className={`py-1 px-2 rounded-xl ${
            activeTab === 'Round Trip' ? 'font-medium bg-purple-500 text-white text-xs ' : ''
          }`}
          onClick={() => handleTabChange('Round Trip')}
        >
          Round Trip
        </div>
      </div>

      <hr className="mt-2 mb-4 border border-b-gray" />
      <div className="flex max-w-[600px] flex-wrap gap-4 col-span-2 row-span-2 items-start">
        <div className="min-w-[270px]">
          <Input
            title="From"
            placeholder="Enter departure location"
            onChange={(value) => handleInputChange(value, "from")}
            error={errors.from}
          />
        </div>
        <div className="min-w-[270px]">
          <Input
            title="To"
            placeholder="Enter destination location"
            onChange={(value) => handleInputChange(value, "to")}
            error={errors.to}
          />
        </div>

        <div className="w-[270px]">
          <Dropdown
            title="Travel Class"
            placeholder="Select Travel Class"
            options={['Economy', 'Business']}
            onSelect={handleDropdownChange}
            violationMessage="Your violation message"
            error={errors.travelClass}
            required={true}
            submitAttempted={false}
          />
        </div>
        {<div className="w-[270px]" />}
        <div className="mt-2">
        <DateTime
          title="Departure Date and Time"
          date={modeOfTransitDetails.modeOfTransitDetails[0].date}
          time={modeOfTransitDetails.modeOfTransitDetails[0].time}
          onDateChange={(date) => handleDateTimeChange(date, modeOfTransitDetails.modeOfTransitDetails[0].time, 'date', false)}
          onTimeChange={(time) => handleDateTimeChange(modeOfTransitDetails.modeOfTransitDetails[0].date, time, 'time', false)}
          error={errors.date}
        />
      </div>

      {activeTab === 'Round Trip' && (
        <div className="mt-2">
          <DateTime
            title="Return Date and Time"
            date={modeOfTransitDetails.modeOfTransitDetails[1].date}
            time={modeOfTransitDetails.modeOfTransitDetails[1].time}
            onDateChange={(date) => handleDateTimeChange(date, modeOfTransitDetails.modeOfTransitDetails[1].time, 'date', true)}
            onTimeChange={(time) => handleDateTimeChange(modeOfTransitDetails.modeOfTransitDetails[1].date, time, 'time', true)}
            error={errors.date}
          />
        </div>
      )}
      </div>
      <div className="relative float-right mr-4 bg-gray-50 mt-8 w-[134px]">
        <Button text={'Submit'} onClick={handleConfirm} textAndBgColor={'bg-purple-500 text-white'} />
      </div>
    </div>
  );
};



//   const [activeTab, setActiveTab] = useState('One Way'); 
//   const [modeOfTransitDetails, setModeOfTransitDetails] = useState({
//     action: `add${selectedOption}`,
//     modeOfTransitDetails: [
//       {
//         from: '',
//         to: '',
//         date: '',
//         time: '',
//         travelClass: '',
//         isReturnTravel: false,
//       },
//      {
//         from: '',
//         to: '',
//         date: '',
//         time: '',
//         travelClass: '',
//         isReturnTravel: false,
//       }, 
//     ],
//   });

//   const [errors , setErrors]= useState({
//     from :{set: false , message: ''},
//     to:{set:false ,message:''},
//     date:{set:false, message:''},
//     time:{set:false,message:''},
//     travelClass:{set:false,message:''},
//   })

 

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
    
//   };

//   const handleInputChange = (value, key) => {
//     setModeOfTransitDetails((prevMode) => {
//       const newModeOfTransitDetails = [...prevMode.modeOfTransitDetails];
//       newModeOfTransitDetails[0][key] = value;

//       return {
//         ...prevMode,
//         modeOfTransitDetails: newModeOfTransitDetails,
//       };
//     });
//   };



//   const handleDropdownChange = (selectedOption) => {
//     setModeOfTransitDetails((prevMode) => {
//       const newModeOfTransitDetails = [...prevMode.modeOfTransitDetails];
//       newModeOfTransitDetails[0].travelClass = selectedOption;
//       if(activeTab === 'Round Trip'){
//         newModeOfTransitDetails[1].travelClass = selectedOption;
//       }
      
//       return {
//         ...prevMode,
//         modeOfTransitDetails: newModeOfTransitDetails,
//       };
//     });
//   };



//   const handleDateTimeChange = (date, time, key, isReturnTravel) => {
//     setModeOfTransitDetails((prevMode) => {
//       const newModeOfTransitDetails = [...prevMode.modeOfTransitDetails];
//       const index = isReturnTravel ? 1 : 0;

//       newModeOfTransitDetails[index][key] = isReturnTravel
//         ? date // Use departure date for return date if Round Trip
//         : date;

//       newModeOfTransitDetails[index]['time'] = time;

//       return {
//         ...prevMode,
//         modeOfTransitDetails: newModeOfTransitDetails,
//       };
//     });
//   };
  

//   const handleConfirm = async() => {
//     // Destructure the current flight details
//     const [outboundDetails, returnDetails] = modeOfTransitDetails.modeOfTransitDetails;
  
//     if (activeTab === 'Round Trip') {
//       // Swap "from" and "to" values in returnDetails
//       returnDetails.from = outboundDetails.to;
//       returnDetails.to = outboundDetails.from;
  
//       // Update the state with the modified flight details
//       setModeOfTransitDetails((prevMode) => ({
//         ...prevMode,
//         modeOfTransitDetails: [outboundDetails, returnDetails],
//       }));
//     }
  
//     // Now you can send modeOfTransitDetails to the backend using Axios
//     console.log('Sending data to backend:', modeOfTransitDetails);


//     const tenantId = '65ddbe4f905e5ef67d8ab969';
//     const tripId = 'TRIPABG000001';
//     const empId = '1003';

//     try{
//       const response = await submitLeg(
//         tenantId,
//         tripId,
//         empId,
//         modeOfTransitDetails
//       )
// console.log('Leg Submitted Succussfully'), response
// ///refresh the dashboard
// onClose()
// handleOpenOverlay()
//     }catch(error){
//       console.error('Error Submitting leg', error)
//     }

// };


//   return (
//     <div>
//       <h1 className="text-start pb-3 font-cabin font-medium text-base">Flight Details :</h1>
//       <div className="flex flex-row items-center justify-start text-center font-cabin">
//         <div
//           className={`py-1 px-2 rounded-xl ${
//             activeTab === 'One Way' ? 'font-medium bg-purple-500 text-white text-xs rounded-xl' : ''
//           }`}
//           onClick={() => handleTabChange('One Way')}
//         >
//           One Way
//         </div>
//         <div
//           className={`py-1 px-2 rounded-xl ${
//             activeTab === 'Round Trip' ? 'font-medium bg-purple-500 text-white text-xs ' : ''
//           }`}
//           onClick={() => handleTabChange('Round Trip')}
//         >
//           Round Trip
//         </div>
//       </div>

//       <hr className="mt-2 mb-4 border border-b-gray" />
//       <div className="flex max-w-[600px] flex-wrap gap-4 col-span-2 row-span-2 items-start">
//         <div className="min-w-[270px]">
//           <Input
//             title="From"
//             placeholder="Enter departure location"
//             onChange={(value) => handleInputChange(value, "from")}
//             error={errors.from}
//           />
//         </div>
//         <div className="min-w-[270px]">
//           <Input
//             title="To"
//             placeholder="Enter destination location"
//             onChange={(value) => handleInputChange(value, "to")}
//             error={errors.to}
//           />
//         </div>

//         <div className="w-[270px]">
//           <Dropdown
//             title="Travel Class"
//             placeholder="Select Travel Class"
//             options={['Economy', 'Business']}
//             onSelect={handleDropdownChange}
//             violationMessage="Your violation message"
//             error={errors.travelClass}
//             required={true}
//             submitAttempted={false}
//           />
//         </div>
//         {<div className="w-[270px]" />}
//         <div className="mt-2">
//         <DateTime
//           title="Departure Date and Time"
//           date={modeOfTransitDetails.modeOfTransitDetails[0].date}
//           time={modeOfTransitDetails.modeOfTransitDetails[0].time}
//           onDateChange={(date) => handleDateTimeChange(date, modeOfTransitDetails.modeOfTransitDetails[0].time, 'date', false)}
//           onTimeChange={(time) => handleDateTimeChange(modeOfTransitDetails.modeOfTransitDetails[0].date, time, 'time', false)}
//           error={errors.date}
//         />
//       </div>

//       {activeTab === 'Round Trip' && (
//         <div className="mt-2">
//           <DateTime
//             title="Return Date and Time"
//             date={modeOfTransitDetails.modeOfTransitDetails[1].date}
//             time={modeOfTransitDetails.modeOfTransitDetails[1].time}
//             onDateChange={(date) => handleDateTimeChange(date, modeOfTransitDetails.modeOfTransitDetails[1].time, 'date', true)}
//             onTimeChange={(time) => handleDateTimeChange(modeOfTransitDetails.modeOfTransitDetails[1].date, time, 'time', true)}
//             error={errors.date}
//           />
//         </div>
//       )}
//       </div>
//       <div className="relative float-right mr-4 bg-gray-50 mt-8 w-[134px]">
//         <Button text={'Submit'} onClick={handleConfirm} textAndBgColor={'bg-purple-500 text-white'} />
//       </div>
//     </div>
//   );
// };





//   const [hotelDetails, setHotelDetails] = useState({
//     action: 'addhotel',
//     hotelDetails: [
//       {
//         location: '',
//         locationPreference: '',
//         class: '',
//         checkIn: '',
//         checkOut: '',
//       },
//     ],
//   });

//   const [errors , setErrors]= useState({
//     location: { set: false, message: '' },
//     locationPreference :{ set: false, message: '' } ,
//     class : { set: false, message: '' } ,
//     checkIn :{ set: false, message: '' },
//     checkOut : { set: false, message: '' },
//   })





//   const options = ['Economy', 'Business'];

//   const handleDropdownChange = (selectedOption) => {
//     setHotelDetails((prevDetails) => ({
//       ...prevDetails,
//       hotelDetails: [
//         {
//           ...prevDetails.hotelDetails[0],
//           class: selectedOption,
//         },
//       ],
//     }));
//     setErrors((prevErrors) => ({ ...prevErrors, class: { set: false, message: '' } }));
//   };

//   const handleInputChange = (title ,value, key) => {
//     setHotelDetails((prevDetails) => ({
//       ...prevDetails,
//       hotelDetails: [
//         {
//           ...prevDetails.hotelDetails[0],
//           [key]: value,
//         },
//       ],
//     }));
//     if (errors[title]?.set && value.trim() !== '') {
//       setErrors((prevErrors) => ({ ...prevErrors, [title]: { set: false, message: '' } }));
//     }
//   };

//   const handleDateChange = (date, key) => {
//     setHotelDetails((prevDetails) => ({
//       ...prevDetails,
//       hotelDetails: [
//         {
//           ...prevDetails.hotelDetails[0],
//           [key]: date,
//         },
//       ],
//     }));
//   };

//   const handleConfirm = () => {
//     // Handle form submission
//     console.log('Submitting hotel details:', hotelDetails);
//   };

const Hotel = ({ onClose, handleOpenOverlay }) => {
  // const [submitAttempted, setSubmitAttempted] = useState(false);

  const [hotelDetails, setHotelDetails] = useState({
    action: 'addhotel',
    hotelDetails: [
      {
        location: '',
        locationPreference: '',
        class: '',
        checkIn: '',
        checkOut: '',
      },
    ],
  });

  const [errors, setErrors] = useState({
    location: { set: false, message: '' },
    locationPreference: { set: false, message: '' },
    class: { set: false, message: '' },
    checkIn: { set: false, message: '' },
    checkOut: { set: false, message: '' },
  });

  const options = ['Economy', 'Business'];

  const handleDropdownChange = (value) => {
    setHotelDetails((prevDetails) => ({
      ...prevDetails,
      hotelDetails: [
        {
          ...prevDetails.hotelDetails[0],
          class: value,
        },
      ],
    }));
    setErrors((prevErrors) => ({ ...prevErrors, class: { set: false, message: '' } }));
  };

  const handleInputChange = (value, key) => {
    setHotelDetails((prevDetails) => ({
      ...prevDetails,
      hotelDetails: [
        {
          ...prevDetails.hotelDetails[0],
          [key]: value,
        },
      ],
    }));

    // Clear corresponding error when input changes, but only if there was an error before
    if (errors[key]?.set && value.trim() !== '') {
      setErrors((prevErrors) => ({ ...prevErrors, [key]: { set: false, message: '' } }));
    }
  };

  const handleDateChange = (date, key) => {
    setHotelDetails((prevDetails) => ({
      ...prevDetails,
      hotelDetails: [
        {
          ...prevDetails.hotelDetails[0],
          [key]: date,
        },
      ],
    }));

    // Clear corresponding error when date changes, but only if there was an error before
    if (errors[key]?.set) {
      setErrors((prevErrors) => ({ ...prevErrors, [key]: { set: false, message: '' } }));
    }
  };

  const handleConfirm = async () => {
    // Validate input fields
    let formIsValid = true;
  
    if (!hotelDetails.hotelDetails[0].location) {
      setErrors((prevErrors) => ({ ...prevErrors, location: { set: true, message: 'Enter a location.' } }));
      formIsValid = false;
    }
  
    if (!hotelDetails.hotelDetails[0].locationPreference) {
      setErrors((prevErrors) => ({ ...prevErrors, locationPreference: { set: true, message: 'Enter a location preference.' } }));
      formIsValid = false;
    }
  
    if (!hotelDetails.hotelDetails[0].checkIn) {
      setErrors((prevErrors) => ({ ...prevErrors, checkIn: { set: true, message: 'Enter a check In.' } }));
      formIsValid = false;
    }
  
    if (!hotelDetails.hotelDetails[0].checkOut) {
      setErrors((prevErrors) => ({ ...prevErrors, checkOut: { set: true, message: 'Enter a check Out.' } }));
      formIsValid = false;
    }
  
    if (!hotelDetails.hotelDetails[0].class) {
      setErrors((prevErrors) => ({ ...prevErrors, class: { set: true, message: 'Select a cab class.' } }));
      formIsValid = false;
    }
  
    console.log('Submitting hotel details:', hotelDetails);
  
    if (!formIsValid) {
      // Log specific errors for each field
      console.error('Validation Error: Please fill in all required fields.');
      console.error('Errors:', errors);
      return;
    }
  
    // Check if form is valid before submitting to the backend
    // Handle form submission
    const tenantId = '65ddbe4f905e5ef67d8ab969';
    const tripId = 'TRIPABG000001';
    const empId = '1003';
  
    try {
      const response = await submitLeg(
        tenantId,
        tripId,
        empId,
        hotelDetails
      );
      console.log('Leg Submitted Successfully', response);
  
      // Refresh the dashboard
      onClose();
      handleOpenOverlay();
    } catch (error) {
      console.error('Error Submitting Leg', error);
    }
  };
  
 
  return (
    <div>
      <div className="text-start font-cabin text-base font-medium">
        <h1>Hotel Details :</h1>
      </div>
      <hr className="mt-2 mb-4 border border-b-gray" />
      <div className="flex max-w-[560px]  flex-wrap gap-4 col-span-2 row-span-2 items-start justify-around">
        <div className="min-w-[270px]">
          <Dropdown
            title="Hotel Class"
            placeholder="Select Hotel Class"
            options={options}
            onSelect={handleDropdownChange}
            violationMessage="Your violation message"
            error={errors.class}
            required={true}
            submitAttempted={false}
          />
        </div>
        <div className="min-w-[270px]" />

        <div className="min-w-[270px]">
          <Input
            placeholder="Enter Location"
            title="Location"
            onChange={(value) => handleInputChange(value, 'location')}
            error={errors.location}
          />
        </div>
        <div className="min-w-[270px]">
          <Input
            placeholder="Enter Location Preference"
            title="Location Preference"
            onChange={(value) => handleInputChange(value, 'locationPreference')}
            error={errors.locationPreference}
          />
        </div>
        <div>
        <SlimDate
  title="Check In"
  date={hotelDetails.hotelDetails[0].checkIn}
  onChange={(date) => handleDateChange(date, 'checkIn')}
  error={errors.checkIn}

/>
        </div>
        <div>
          <SlimDate
            title="Check Out"
            date={hotelDetails.hotelDetails[0].checkOut}
            onChange={(date) => handleDateChange(date, 'checkOut')}
            error={errors.checkOut}
          />
        </div>
      </div>
      <div className="relative float-right mr-4 bg-gray-50 mt-8 w-[134px]">
        <Button text={'Submit'} onClick={handleConfirm} textAndBgColor={'bg-purple-500 text-white'} />
      </div>
    </div>
  );
};


  //  const [hotelDetails , setHotelDetails]=useState(
  //   {
  //     action : "addhotel",
  //     hotelDetails:[
  //        {
  //          location:"",
  //          locationPreference: "",
  //          class: "",
  //          checkIn: "",
  //          checkOut: ""
  //        }
  //      ]
     
  //  })
  
  //   const options = ['Economy', 'Business'];
  
    
  
    
  
  //   const dateError = {
  //     set: true,
  //     message: "Your error message for date",
  //   };
  
  //   // const handleConfirm = async () => {
  //   //   // Validate input fields
  //   //   if (!selectedOption  || !checkInDate || !checkOutDate) {
  //   //     // Handle validation error
  //   //     console.error('Validation Error: Please fill in all required fields.');
  //   //     return;
  //   //   }
  
  //     // Prepare the data object to be sent to the API
     
  
  //   return (
  //     <div>
  //       <div className='text-start font-cabin text-base font-medium'>
  //         <h1>Hotel Details :</h1>
  //       </div>
  //       <hr className='mt-2 mb-4 border border-b-gray' />
  //       <div className='flex max-w-[560px]  flex-wrap gap-4 col-span-2 row-span-2 items-start justify-around'>
  //         <div className="min-w-[270px]">
  //           <Dropdown
  //             title="Hotel Class"
  //             placeholder="Select Hotel Class"
  //             options={options}
  //             onSelect={handleDropdownChange}
  //             violationMessage="Your violation message"
  //             error={{ set: true, message: "Your error message" }}
  //             required={true}
  //             submitAttempted={false}
  //           />
  //         </div>
  //         <div className='min-w-[270px]'/>


  //         <div className='min-w-[270px]'>
  //           <Input
  //             placeholder="Enter Location"

  //             title="Location"
  //             onChange={""}
  //             error={{ set: false, message: "show error" }}
  //           />
  //         </div>
  //         <div className='min-w-[270px]'>
  //           <Input
  //             placeholder="Enter Location Preference"
  //             title="Location Preference"
  //             onChange={""}
  //             error={{ set: false, message: "show error" }}
  //           />
  //         </div>
  //         <div>
  //           <SlimDate
  //             title="Check In"
  //             date={checkInDate}
  //             onChange={(date) => handleDateChange(date, "check-in")}
  //             error={dateError}
  //           />
  //         </div>
  //         <div>
  //           <SlimDate
  //             title="Check Out"
  //             date={checkOutDate}
  //             onChange={(date) => handleDateChange(date, "check-out")}
  //             error={dateError}
  //           />
  //         </div>
  //       </div>
  //       <div className="relative float-right mr-4 bg-gray-50 mt-8 w-[134px]">
  //         <Button text={'Submit'} onClick={handleConfirm} textAndBgColor={'bg-purple-500 text-white'} />
  //       </div>
  //     </div>
  //   );
  // };
  
  const Cab = ({ selectedOption, onClose, handleOpenOverlay }) => {
    
    const [cabDetails, setCabDetails] = useState({
      date: "8-12-2024",
      preferredTime: '',
      class: '',
      pickupAddress: '',
      dropAddress: '',
    });
    
  
    // Single state object for all errors
    const [errors, setErrors] = useState({
      date: { set: false, message: '' },
      time: { set: false, message: '' },
      class: { set: false, message: '' },
      pickup: { set: false, message: '' },
      drop: { set: false, message: '' },
    });
  

    const handleTimeChange = (e) => {
      setCabDetails((prevDetails) => ({
        ...prevDetails,
        preferredTime: e.target.value,
      }));
      // Clear time error when user starts typing
      setErrors((prevErrors) => ({ ...prevErrors, time: { set: false, message: '' } }));
    };
  
    const handleDateSelect = (selectedDate) => {
      setCabDetails((prevDetails) => ({ ...prevDetails, date: selectedDate }));
      // Clear date error when date is selected
      setErrors((prevErrors) => ({ ...prevErrors, date: { set: false, message: '' } }));
    };
  
    const handleAddressChange = (title, e) => {
      const address = e.target.value;
      
      setCabDetails((prevDetails) => ({
        ...prevDetails,
        [title]: address,
      }));
      
      // Clear corresponding error when address changes, but only if there was an error before
      if (errors[title]?.set && address.trim() !== '') {
        setErrors((prevErrors) => ({ ...prevErrors, [title]: { set: false, message: '' } }));
      }
    };
    
  
    const options = ['Sedan', 'Prime', 'Economy', 'Luxury'];
  
    const handleDropdownChange = (value) => {
      setCabDetails((prevDetails) => ({
        ...prevDetails,
        class: value,
      }));
      // Clear class error when dropdown value changes
      setErrors((prevErrors) => ({ ...prevErrors, class: { set: false, message: '' } }));
    };
  
    const handleConfirm = async () => {
      // Validate input fields
      let formIsValid = true;

      // Validate date
      if (!cabDetails.date) {
        setErrors((prevErrors) => ({ ...prevErrors, date: { set: true, message: 'Select a date.' } }));
        formIsValid = false;
      }
    
      // Validate time
      if (!cabDetails.preferredTime) {
        setErrors((prevErrors) => ({ ...prevErrors, time: { set: true, message: 'Select a preferred time.' } }));
        formIsValid = false;
      }
    
      // Validate class
      if (!cabDetails.class) {
        setErrors((prevErrors) => ({ ...prevErrors, class: { set: true, message: 'Select a cab class.' } }));
        formIsValid = false;
      }
    
      // Validate pickup address
      if (!cabDetails.pickupAddress) {
        setErrors((prevErrors) => ({ ...prevErrors, pickup: { set: true, message: 'Enter a pickup address.' } }));
        formIsValid = false;
      }
    
      // Validate drop address
      if (!cabDetails.dropAddress) {
        setErrors((prevErrors) => ({ ...prevErrors, drop: { set: true, message: 'Enter a drop address.' } }));
        formIsValid = false;
      }
    
      if (!formIsValid) {
        // Handle validation error
        console.error('Validation Error: Please fill in all required fields.');
        return;
      }
     
      const tenantId = '65ddbe4f905e5ef67d8ab969';
      const tripId = 'TRIPABG000001';
      const empId = '1003';
  
      try {
        // Call the API to submit leg
        const response = await submitLeg(
          tenantId,
          tripId,
          empId,
          {
            action: `add${selectedOption}`,
            cabDetails: [
              {
                ...cabDetails,
                isReturnTravel: 'false',
              },
            ],
          }
        );
  
        // Handle API response as needed
        console.log('Leg Submitted Successfully:', response);
  
        // Reset the form after successful submission
        setCabDetails({
          date: '',
          preferredTime: '',
          class: '',
          pickupAddress: '',
          dropAddress: '',
        });
  
        // Additional actions after form submission
        onClose();
        handleOpenOverlay();
      } catch (error) {
        // Handle API error
        console.error('Error submitting leg:', error.message);
      }
    };
  
    return (
      <div>
        <h1 className='text-start pb-3 font-cabin font-medium text-base'>Cab Details :</h1>
        <hr className='mt-2 mb-4 border border-b-gray' />
        <div className='flex max-w-[600px]  flex-wrap gap-4 col-span-2 row-span-2 items-start'>
          <div className="min-w-[270px]">
            <Date
              date={cabDetails.date}
              onSelect={handleDateSelect}
              error={errors.date}
            />
          </div>
          <div className='min-w-[270px]'>
            <TimePicker
              title="Preferred Time"
              time={cabDetails.preferredTime}
              onTimeChange={handleTimeChange}
              error={errors.time}
            />
          </div>
          <div className='w-[270px] mb-4'>
            <Dropdown
              title="Cab Class"
              placeholder="Select Cab Class"
              options={options}
              onSelect={handleDropdownChange}
              violationMessage="Your violation message"
              error={errors.class}
              required={true}
              submitAttempted={false}
            />
          </div>
          <div className='min-w-[270px]' />
  
          <div className='min-w-[270px]'>
            <AddressInput
              title="Pick Up"
              address={cabDetails.pickupAddress}
              onChange={(e) => handleAddressChange("pickupAddress", e)}
              error={errors.pickup}
            />
          </div>
          <div className='min-w-[270px]'>
            <AddressInput
              title="Drop Off"
              address={cabDetails.dropAddress}
              onChange={(e) => handleAddressChange("dropAddress", e)}
              error={errors.drop}
            />
          </div>
        </div>
  
        <div className="relative float-right mr-4 bg-gray-50 mt-8 w-[134px]">
          <Button text={'Submit'} onClick={handleConfirm} textAndBgColor={'bg-purple-500 text-white'} />
        </div>
      </div>
    );
  };

