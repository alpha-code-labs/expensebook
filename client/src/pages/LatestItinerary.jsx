
import React, { useCallback, useEffect, useState } from 'react';
import closeIcon from '../assets/close.svg';
import Input from '../components/common/Input';
import SlimDate from '../components/common/SlimDate';
import PreferredTime from '../components/common/PreferredTime';
// import DisplayItinerary from './DisplayItinerary';
import { dummyFlight, dummyCabs, dummyBus, dummyHotel } from '../data/dummy';
import {Draggable} from 'react-beautiful-dnd'
import DisplayItems from './DisplayItems'
import DisplayItinerary from './DisplayItinerary';
import { generateUniqueIdentifier } from '../utils/uuid';
import moment from 'moment';
import Select from '../components/common/Select';
import { camelCaseToTitleCase } from '../utils/handyFunctions';
import { left_arrow_icon } from "../assets/icon";
import { useNavigate } from 'react-router-dom';

export default function({formData, setFormData, onboardingData, lastPage, nextPage}){
const sideBarWidth = '230px'
const navigate = useNavigate();

const itineraryItems = ['cab', 'flight', 'hotel', 'train', 'bus'];
const [modalContent, setModalContent] = useState(null);
const [visible, setVisible] = useState(false);

function getNextSequenceNumber(){
  return Math.max(...flattenObjectToArray(itinerary).map(item=>item.sequence), 0)+1;
}

const [itinerary, setItinerary] = useState({
    flights: [
      {
        violations: {
          class: null,
          amount: null
        },
        bkd_violations: {
          class: null,
          amount: null
        },
        bookingDetails: {
          billDetails: {
            vendorName: null,
            taxAmount: null,
            totalAmount: null
          },
          docURL: null,
          docType: null
        },
        itineraryId: "66795e09b2e14ac28c9ed0c2",
        formId: "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784f",
        sequence: 2,
        from: "Delhi",
        to: "Lucknow",
        date: "2024-06-24T00:00:00.000Z",
        returnDate: null,
        time: null,
        returnTime: null,
        travelClass: null,
        isReturnTravel: false,
        approvers: [
          {
            empId: "1002",
            name: "Emma Thompson",
            status: "pending approval",
            _id: "66795e09b2e14ac28c9ed0ba"
          }
        ],
        bkd_from: null,
        bkd_to: null,
        bkd_date: null,
        bkd_returnDate: null,
        bkd_time: null,
        bkd_returnTime: null,
        bkd_travelClass: null,
        modified: false,
        cancellationDate: null,
        cancellationReason: null,
        rejectionReason: null,
        status: "pending approval",
        _id: "66795e09b2e14ac28c9ed0b9"
      },
      {
        violations: {
          class: null,
          amount: null
        },
        bkd_violations: {
          class: null,
          amount: null
        },
        bookingDetails: {
          billDetails: {
            vendorName: null,
            taxAmount: null,
            totalAmount: null
          },
          docURL: null,
          docType: null
        },
        itineraryId: "66795e09b2e14ac28c9ed0c3",
        formId: "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784j",
        sequence: 4,
        from: "Lucknow",
        to: "Delhi",
        date: "2024-06-26T00:00:00.000Z",
        returnDate: null,
        time: null,
        returnTime: null,
        travelClass: null,
        isReturnTravel: false,
        approvers: [
          {
            empId: "1002",
            name: "Emma Thompson",
            status: "pending approval",
            _id: "66795e09b2e14ac28c9ed0bc"
          }
        ],
        bkd_from: null,
        bkd_to: null,
        bkd_date: null,
        bkd_returnDate: null,
        bkd_time: null,
        bkd_returnTime: null,
        bkd_travelClass: null,
        modified: false,
        cancellationDate: null,
        cancellationReason: null,
        rejectionReason: null,
        status: "pending approval",
        _id: "66795e09b2e14ac28c9ed0bb"
      }
    ],
    buses: [],
    trains: [],
    hotels: [
      {
        violations: {
          class: null,
          amount: null
        },
        bkd_violations: {
          class: null,
          amount: null
        },
        bookingDetails: {
          billDetails: {
            vendorName: null,
            taxAmount: null,
            totalAmount: null
          },
          docURL: null,
          docType: null
        },
        itineraryId: "66795e09b2e14ac28c9ed0c5",
        formId: "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784k",
        sequence: 3,
        location: "Lucknow",
        locationPreference: null,
        class: null,
        checkIn: "2024-06-24T00:00:00.000Z",
        checkOut: "2024-06-26T00:00:00.000Z",
        approvers: [
          {
            empId: "1002",
            name: "Emma Thompson",
            status: "pending approval",
            _id: "66795e09b2e14ac28c9ed0be"
          }
        ],
        bkd_location: null,
        bkd_class: null,
        bkd_checkIn: null,
        bkd_checkOut: null,
        modified: false,
        cancellationDate: null,
        cancellationReason: null,
        status: "pending approval",
        _id: "66795e09b2e14ac28c9ed0bd"
      }
    ],
    cabs: [
      {
        violations: {
          class: null,
          amount: null
        },
        bookingDetails: {
          billDetails: {
            vendorName: null,
            taxAmount: null,
            totalAmount: null
          },
          docURL: null,
          docType: null
        },
        itineraryId: "66795e09b2e14ac28c9ed0c4",
        formId: "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784l",
        sequence: 1,
        date: "2024-06-24T00:00:00.000Z",
        class: null,
        time: null,
        pickupAddress: "Office Address",
        dropAddress: "Delhi airport",
        approvers: [
          {
            empId: "1002",
            name: "Emma Thompson",
            status: "pending approval",
            _id: "66795e09b2e14ac28c9ed0c0"
          }
        ],
        bkd_date: null,
        bkd_class: null,
        bkd_time: null,
        bkd_pickupAddress: null,
        bkd_dropAddress: null,
        modified: false,
        cancellationDate: null,
        cancellationReason: null,
        status: "pending approval",
        type: "pickup",
        _id: "66795e09b2e14ac28c9ed0bf"
      }
    ],
    carRentals: [],
    personalVehicles: []
  });
  
const addItineraryItem = (item)=>{
    console.log(`clicked on ${item}`)
    setVisible(true);

    switch(item){
      case 'Cab' : setModalContent(<CabForm handleAddToItinerary={handleAddToItinerary} action='create' />); return;
      case 'Flight' : setModalContent(<FlightForm  handleAddToItinerary={handleAddToItinerary} action='create' />); return;
      case 'Hotel': setModalContent(<HotelForm  handleAddToItinerary={handleAddToItinerary} action='create' />); return;
      case 'Train': setModalContent(<TrainForm  handleAddToItinerary={handleAddToItinerary} action='create' />); return;
      case 'Bus': setModalContent(<BusForm  handleAddToItinerary={handleAddToItinerary} action='create' />); return;
    }
}

const deleteItineraryItem = useCallback((formId)=>{
  console.log('deleting item with formId', formId);
  const newFormData = JSON.parse(JSON.stringify(formData));
  Object.keys(newFormData.itinerary).forEach(key=>{
    newFormData.itinerary[key] = formData.itinerary[key].filter(item=>item.formId != formId);
  })

  setItinerary(newFormData);
 
},[formData.itinerary])

const editItineraryItem = useCallback((formId)=>{
  console.log('editing item with formId', formId); 
  let category = null;
  let item = null;

  for(let i=0; i<Object.keys(formData.itinerary).length; i++){
    const key= Object.keys(formData.itinerary)[i];
    item = formData.itinerary[key].find(item=>item.formId == formId)

    if(item!=undefined){
      category = key;
      break;
    }
  }

  if(category == null || item == null || item == undefined) return;

  console.log('category', category, item);
  setVisible(true);

  switch(category){
    case 'flights' : {
     setModalContent(<FlightForm setVisible={setVisible} handleAddToItinerary={handleAddToItinerary} action='edit' editId={formId} editData={{from:item.from, to:item.to, date:item.date, time:item.time}} />);
     return; 
    }
    case 'trains' : {
      setModalContent(<TrainForm setVisible={setVisible} handleAddToItinerary={handleAddToItinerary} action='edit' editId={formId} editData={{from:item.from, to:item.to, date:item.date, time:item.time}} />);
      return; 
     }
     case 'buses' : {
      setModalContent(<BusForm setVisible={setVisible} handleAddToItinerary={handleAddToItinerary} action='edit' editId={formId} editData={{from:item.from, to:item.to, date:item.date, time:item.time}} />);
      return; 
     }
    case 'cabs' : {
      setModalContent(<CabForm setVisible={setVisible} handleAddToItinerary={handleAddToItinerary} action='edit' editId={formId} editData={{pickupAddress:item.pickupAddress, dropAddress:item.dropAddress, class:item.class, time:item.time, date:item.date, returnDate:item.returnDate}} />);
      return;
    }
    case 'carRentals' : {
      setModalContent(<CabForm setVisible={setVisible} handleAddToItinerary={handleAddToItinerary} action='edit' editId={formId} editData={{pickupAddress:item.pickupAddress, dropAddress:item.dropAddress, class:item.class, time:item.time, date:item.date, returnDate:item.returnDate}} />);
      return;
    }
    case 'hotels' : {
      setModalContent(<HotelForm setVisible={setVisible} handleAddToItinerary={handleAddToItinerary} action='edit' editId={formId} editData={{checkIn:item.checkIn, checkOut:item.checkOut, class:item.class, location:item.location, time:item.time, needBreakfast:item.needBreakfast, needLunch: item.needLunch, needDinner:item.needDinner, needNonSmokingRoom:item.needNonSmokingRoom}} />);
      return;
    }
  }
  
},[formData.itinerary])

const handleAddToItinerary = (category, data)=>{
  try{
    console.log('clicked on add to itinerary')
    console.log('received formData', data);

    switch(category){
      case 'flights' : {
        if(data.action == 'create'){
          const newItem = JSON.parse(JSON.stringify(dummyFlight));
          newItem.from = data.formData.from;
          newItem.to = data.formData.to;
          newItem.date = data.formData.date;
          newItem.time = data.formData.time;
          newItem.sequence = getNextSequenceNumber();
          newItem.formId = generateUniqueIdentifier();
          newItem.approvers = formData.approvers; 
          console.log('creating flight item', newItem);

          const formData_copy = JSON.parse(JSON.stringify(formData));
          formData_copy.itinerary.flights.push(newItem);

          console.log(formData.itinerary);
          setFormData(formData_copy);
        }

        if(data.action == 'edit'){
          const formData_copy = JSON.parse(JSON.stringify(formData)); 

          for(let i=0; i<Object.keys(formData_copy.itinerary).length; i++){
            const key = Object.keys(formData_copy.itinerary)[i];

            const item = formData_copy.itinerary[key].find(item=>item.formId == data.editId);
            if(item != undefined){
              item.from = data.formData.from;
              item.to = data.formData.to;
              item.date = data.formData.date;
              item.time = data.formData.time;

              break;
            }
          }
          setFormData(formData_copy);
        }

        setVisible(false);
        return;
      }

      case 'trains' : {
        if(data.action == 'create'){
          const newItem = JSON.parse(JSON.stringify(dummyFlight));
          newItem.from = data.formData.from;
          newItem.to = data.formData.to;
          newItem.date = data.formData.date;
          newItem.time = data.formData.time;
          newItem.sequence = getNextSequenceNumber();
          newItem.formId = generateUniqueIdentifier();
          newItem.approvers = formData.approvers; 
          console.log('creating train item', newItem);

          const formData_copy = JSON.parse(JSON.stringify(formData));
          formData_copy.itinerary.trains.push(newItem);

          console.log(formData_copy.itinerary);
          setFormData(formData_copy);
        }

        if(data.action == 'edit'){
          const formData_copy = JSON.parse(JSON.stringify(formData)); 

          for(let i=0; i<Object.keys(formData_copy.itinerary).length; i++){
            const key = Object.keys(formData_copy.itinerary)[i];

            const item =formData_copy.itinerary[key].find(item=>item.formId == data.editId);
            if(item != undefined){
              item.from = data.formData.from;
              item.to = data.formData.to;
              item.date = data.formData.date;
              item.time = data.formData.time;
              break;
            }
          }
          setFormData(formData_copy);
        }

        setVisible(false);
        return;
      }

      case 'buses' : {
        if(data.action == 'create'){
          const newItem = JSON.parse(JSON.stringify(dummyFlight));
          newItem.from = data.formData.from;
          newItem.to = data.formData.to;
          newItem.date = data.formData.date;
          newItem.time = data.formData.time;
          newItem.sequence = getNextSequenceNumber();
          newItem.formId = generateUniqueIdentifier();
          newItem.approvers = formData.approvers; 
          console.log('creating bus item', newItem);

          const formData_copy = JSON.parse(JSON.stringify(formData));
          formData_copy.itinerary.buses.push(newItem);

          console.log(formData_copy.itinerary);
          setFormData(formData_copy);
        }

        if(data.action == 'edit'){
          const formData_copy = JSON.parse(JSON.stringify(formData)); 

          for(let i=0; i<Object.keys(formData_copy.itinerary).length; i++){
            const key = Object.keys(formData_copy.itinerary)[i];

            const item = formData_copy.itinerary[key].find(item=>item.formId == data.editId);
            if(item != undefined){
              item.from = data.formData.from;
              item.to = data.formData.to;
              item.date = data.formData.date;
              item.time = data.formData.time;
              break;
            }
          }
          setFormData(formData_copy);
        }

        setVisible(false);
        return;
      }

      case 'cabs' : {
        if(data.action == 'create'){
          const newItem = JSON.parse(JSON.stringify(dummyCabs));
          newItem.pickupAddress = data.formData.pickupAddress;
          newItem.dropAddress = data.formData.dropAddress;
          newItem.class = data.formData.class;
          newItem.date = data.formData.date;
          newItem.returnDate = data.formData.returnDate;
          newItem.isFullDayCab = data.formData.isFullDayCab;
          newItem.time = data.formData.time;
          newItem.sequence = getNextSequenceNumber();
          newItem.formId = generateUniqueIdentifier();
          newItem.approvers = formData.approvers; 
          console.log('creating cab item', newItem);

          const formData_copy = JSON.parse(JSON.stringify(formData));
          formData_copy.itinerary.cabs.push(newItem);

          console.log(formData_copy.itinerary);
          setFormData(formData_copy)
        }

        if(data.action == 'edit'){
          const formData_copy = JSON.parse(JSON.stringify(formData)); 

          for(let i=0; i<Object.keys(formData_copy.itinerary).length; i++){
            const key = Object.keys(formData_copy.itinerary)[i];
            const item = formData_copy.itinerary[key].find(item=>item.formId == data.editId);

            if(item != undefined){
              item.pickupAddress = data.formData.pickupAddress;
              item.dropAddress = data.formData.dropAddress;
              item.class = data.formData.class;
              item.date = data.formData.date;
              item.returnDate = data.formData.returnDate;
              item.isFullDayCab = data.formData.isFullDayCab;
              item.time = data.formData.time;
            }
          }
          setFormData(formData_copy);
        }

        setVisible(false);
        return;
      }

      case 'rentalCabs' : {
        if(data.action == 'create'){
          const newItem = JSON.parse(JSON.stringify(dummyCabs));
          newItem.pickupAddress = data.formData.pickupAddress;
          newItem.dropAddress = data.formData.dropAddress;
          newItem.class = data.formData.class;
          newItem.date = data.formData.date;
          newItem.returnDate = data.formData.returnDate;
          newItem.isFullDayCab = data.formData.isFullDayCab;
          newItem.time = data.formData.time;
          newItem.sequence = getNextSequenceNumber();
          newItem.formId = generateUniqueIdentifier();
          newItem.approvers = formData.approvers; 
          console.log('creating rental cab item', newItem);

          const formData_copy = JSON.parse(JSON.stringify(formData));
          formData_copy.itinerary.carRentals.push(newItem);

          console.log(formData_copy.itinerary);
          setFormData(formData_copy)
        }

        if(data.action == 'edit'){
          const formData_copy = JSON.parse(JSON.stringify(formData)); 

          for(let i=0; i<Object.keys(formData_copy.itinerary).length; i++){
            const key = Object.keys(formData_copy.itinerary)[i];
            const item = formData_copy.itinerary[key].find(item=>item.formId == data.editId);

            if(item != undefined){
              item.pickupAddress = data.formData.pickupAddress;
              item.dropAddress = data.formData.dropAddress;
              item.class = data.formData.class;
              item.date = data.formData.date;
              item.returnDate = data.formData.returnDate;
              item.isFullDayCab = data.formData.isFullDayCab;
              item.time = data.formData.time;
            }
          }
          setFormData(formData_copy);
        }

        setVisible(false);
        return;
      }

      case 'hotels' : {
        if(data.action == 'create'){
          const newItem = JSON.parse(JSON.stringify(dummyHotel));
          newItem.checkIn = data.formData.checkIn;
          newItem.checkOut = data.formData.checkOut;
          newItem.class = data.formData.class;
          newItem.location = data.formData.location;
          newItem.needBreakfast = data.formData.needBreakfast;
          newItem.needLunch = data.formData.needLunch;
          newItem.needDinner = data.formData.needDinner;
          newItem.needNonSmokingRoom = data.formData.needNonSmokingRoom;
          newItem.time = data.formData.time;
          newItem.sequence = getNextSequenceNumber();
          newItem.formId = generateUniqueIdentifier();
          newItem.approvers = formData.approvers; 
          console.log('creating hotel item', newItem);

          const formData_copy = JSON.parse(JSON.stringify(formData));
          formData_copy.itinerary.hotels.push(newItem);

          console.log(formData_copy.itinerary);
          setFormData(formData_copy)
        }

        if(data.action == 'edit'){
          const formData_copy = JSON.parse(JSON.stringify(formData)); 

          for(let i=0; i<Object.keys(formData_copy.itinerary).length; i++){
            
            const key = Object.keys(formData_copy.itinerary)[i];
            const item = formData_copy.itinerary[key].find(item=>item.formId == data.editId);

            if(item != undefined){
              item.checkIn = data.formData.checkIn;
              item.checkOut = data.formData.checkOut;
              item.location = data.formData.location;
              item.time = data.formData.time;
              item.class = data.formData.class;
              item.needBreakfast = data.formData.needBreakfast;
              item.needLunch = data.formData.needLunch;
              item.needDinner = data.formData.needDinner;
              item.needNonSmokingRoom = data.formData.needNonSmokingRoom;
            }
          }
          setFormData(formData_copy);
        }

        setVisible(false);
        return;
      } 
    }

    //add item to the itinerary

    setVisible(false);
  }catch(e){
    console.log(e);
  }
}

useEffect(()=>{
  console.log(formData.itinerary, 'itinerary updated')
},[formData.itinerary])

    return(<>
    
        
        <div className="min-w-[100%] min-h-[100%] flex">
            <div className={`w-[${sideBarWidth}] h-[100%] bg-white`}>
                {/* sidebar for adding itinerary items */}
                <div className="flex-flex-row divide-y">
                    {itineraryItems.map(item=>(
                        <div 
                          key={item}
                          onClick={()=>addItineraryItem(camelCaseToTitleCase(item))}
                          className="flex flex-col p-4 w-[100%] h-[100px] gap-2 items-center justify-center cursor-pointer hover:bg-blue-100">
                        <div className={`sprite ic-${item}`}/>
                        <p className="text-neutral-800 text-sm">{camelCaseToTitleCase(item)}</p>
                    </div>))}
                </div>
            </div>
      
            <div className={`w-[calc(100vw-${sideBarWidth})] px-6 py-4 sm:px-12 md:px-24`}>
                <DisplayItinerary formData={formData} setFormData={setFormData} handleDelete={deleteItineraryItem}  handleEdit={editItineraryItem}/>
                
                <Modal visible={visible} setVisible={setVisible}>
                    {modalContent}
                </Modal>
            </div>

        </div>

        {/* back link */}
        <div className='flex items-center gap-4 cursor-pointer py-10 w-[90%] mx-auto'>
            <img className='w-[24px] h-[24px]' src={left_arrow_icon} onClick={()=>navigate(lastPage)} />
            <p className='text-indigo-500 text-md font-semibold font-cabin'>Back</p>
        </div>

        
    </>)
}

const FlightForm = ({setVisible, handleAddToItinerary, action='create', editId = null, editData=null})=>{

  const [formData, setFormData] = useState({from:editData?.from??'', to:editData?.to??'', date:editData?.date??getCurrentDate(), time:editData?.time??'12pm - 3pm'});

  const [errors, setErrors] = useState({fromError:{set:false, message:null}, toError:{set:false, message:null}, dateError:{set:false, message:null}, timeError:{set:false, message:null}});

  const updateCity = (e, field)=>{
      const formData_copy = JSON.parse(JSON.stringify(formData))
      formData_copy[field] = e.target.value
      setFormData(formData_copy)
  }

  const handleTimeChange = (value)=>{
      const formData_copy = JSON.parse(JSON.stringify(formData))
      formData_copy.time = value
      setFormData(formData_copy)
  }

  const handleDateChange = (e)=>{
      const formData_copy = JSON.parse(JSON.stringify(formData))
      formData_copy.date = e.target.value
      setFormData(formData_copy)
  }

  const handleSubmit = ()=>{

    console.log('form submitted')
    let goAhead = true;

    if(formData.from == null || formData.from == undefined || formData.from == ''){
      setErrors(pre=>({...pre, fromError: {set: true, message: 'Please enter departure city'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, fromError:{set:false, message:null} }));

    if(formData.to == null || formData.to == undefined || formData.to == ''){
      setErrors(pre=>({...pre, toError:{set:true, message:'Please enter destination city'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, toError:{set:false, message:null} }));

    if(formData.date == null || formData.date == undefined || formData.date == ''){
      setErrors(pre=>({...pre, dateError: {set:true, message: 'Plese select date'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, dateError:{set:false, message:null} }));

    if(formData.time == null && formData.time == undefined){
      setErrors(pre=>({...pre, timeError:{set: true, message : 'Please select preferred time'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, timeError:{set:false, message:null} }));


    
    if(goAhead){
      handleAddToItinerary('flights', {action, editId, formData});
    }
    
  }

  const handleCancel = ()=>{
    setVisible(false);
  }

  useEffect(()=>{
    console.log(formData, 'form data');
  },[formData])

  useEffect(()=>{
    console.log(errors, 'flight form errors')
  }, [errors])

    
    return(<div className='max-w-[440px]'>
    <   div className='pb-10 text-lg text-neutral-700 font-cabin'>Flight</div>
        
        <div className='w-[100%] h-[100%] bg-white flex gap-2 flex-wrap items-end'>
          <Input 
            title='Leaving From'  
            placeholder='City' 
            value={formData.from}
            error={errors?.fromError} 
            onBlur={(e)=>updateCity(e, 'from')} />

          <Input 
            title='Where To?' 
            placeholder='City' 
            value={formData.to} 
            error={errors?.toError}
            onBlur={(e)=>updateCity(e, 'to')} />

            <div className='flex gap-2'>
              <SlimDate 
                format='date-month'
                min={0}
                date={formData.date}
                onChange = {handleDateChange}
                title='On?' />

              <PreferredTime
                value={formData.time}
                onChange={handleTimeChange}  />
            </div>
        </div>

        {action == 'create' && <div className='flex flex-row-reverse mt-6'>
            <div onClick={handleSubmit} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Add to Itinerary</div>
        </div>} 

        {action == 'edit' && <div className='flex flex-row-reverse mt-6 gap-4'>
            <div onClick={handleCancel} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Cancel</div>
            <div onClick={handleSubmit} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Save Changes</div>
          </div>}
        
    </div>)
}

const TrainForm = ({setVisible, handleAddToItinerary, action='create', editId = null, editData=null})=>{

  const [formData, setFormData] = useState({from:editData?.from??'', to:editData?.to??'', date:editData?.date??getCurrentDate(), time:editData?.time??'12pm - 3pm'});

  const [errors, setErrors] = useState({fromError:{set:false, message:null}, toError:{set:false, message:null}, dateError:{set:false, message:null}, timeError:{set:false, message:null}});

  const updateCity = (e, field)=>{
      const formData_copy = JSON.parse(JSON.stringify(formData))
      formData_copy[field] = e.target.value
      setFormData(formData_copy)
  }

  const handleTimeChange = (value)=>{
      const formData_copy = JSON.parse(JSON.stringify(formData))
      formData_copy.time = value
      setFormData(formData_copy)
  }

  const handleDateChange = (e)=>{
      const formData_copy = JSON.parse(JSON.stringify(formData))
      formData_copy.date = e.target.value
      setFormData(formData_copy)
  }

  const handleSubmit = ()=>{

    console.log('form submitted')
    let goAhead = true;

    if(formData.from == null || formData.from == undefined || formData.from == ''){
      setErrors(pre=>({...pre, fromError: {set: true, message: 'Please enter departure city'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, fromError:{set:false, message:null} }));

    if(formData.to == null || formData.to == undefined || formData.to == ''){
      setErrors(pre=>({...pre, toError:{set:true, message:'Please enter destination city'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, toError:{set:false, message:null} }));

    if(formData.date == null || formData.date == undefined || formData.date == ''){
      setErrors(pre=>({...pre, dateError: {set:true, message: 'Plese select date'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, dateError:{set:false, message:null} }));

    if(formData.time == null && formData.time == undefined){
      setErrors(pre=>({...pre, timeError:{set: true, message : 'Please select preferred time'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, timeError:{set:false, message:null} }));


    
    if(goAhead){
      handleAddToItinerary('trains', {action, editId, formData});
    }
    
  }

  const handleCancel = ()=>{
    setVisible(false);
  }

  useEffect(()=>{
    console.log(formData, 'form data');
  },[formData])

  useEffect(()=>{
    console.log(errors, 'train form errors')
  }, [errors])

    
    return(<div className='max-w-[440px]'>
    <   div className='pb-10 text-lg text-neutral-700 font-cabin'>Train</div>
        
        <div className='w-[100%] h-[100%] bg-white flex gap-2 flex-wrap items-end'>
          <Input 
            title='Leaving From'  
            placeholder='City' 
            value={formData.from}
            error={errors?.fromError} 
            onBlur={(e)=>updateCity(e, 'from')} />

          <Input 
            title='Where To?' 
            placeholder='City' 
            value={formData.to} 
            error={errors?.toError}
            onBlur={(e)=>updateCity(e, 'to')} />

            <div className='flex gap-2'>
              <SlimDate 
                format='date-month'
                min={0}
                date={formData.date}
                onChange = {handleDateChange}
                title='On?' />

              <PreferredTime
                value={formData.time}
                onChange={handleTimeChange}  />
            </div>
        </div>

        {action == 'create' && <div className='flex flex-row-reverse mt-6'>
            <div onClick={handleSubmit} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Add to Itinerary</div>
        </div>} 

        {action == 'edit' && <div className='flex flex-row-reverse mt-6 gap-4'>
            <div onClick={handleCancel} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Cancel</div>
            <div onClick={handleSubmit} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Save Changes</div>
          </div>}
        
    </div>)
}

const BusForm = ({setVisible, handleAddToItinerary, action='create', editId = null, editData=null})=>{

  const [formData, setFormData] = useState({from:editData?.from??'', to:editData?.to??'', date:editData?.date??getCurrentDate(), time:editData?.time??'12pm - 3pm'});

  const [errors, setErrors] = useState({fromError:{set:false, message:null}, toError:{set:false, message:null}, dateError:{set:false, message:null}, timeError:{set:false, message:null}});

  const updateCity = (e, field)=>{
      const formData_copy = JSON.parse(JSON.stringify(formData))
      formData_copy[field] = e.target.value
      setFormData(formData_copy)
  }

  const handleTimeChange = (value)=>{
      const formData_copy = JSON.parse(JSON.stringify(formData))
      formData_copy.time = value
      setFormData(formData_copy)
  }

  const handleDateChange = (e)=>{
      const formData_copy = JSON.parse(JSON.stringify(formData))
      formData_copy.date = e.target.value
      setFormData(formData_copy)
  }

  const handleSubmit = ()=>{

    console.log('form submitted')
    let goAhead = true;

    if(formData.from == null || formData.from == undefined || formData.from == ''){
      setErrors(pre=>({...pre, fromError: {set: true, message: 'Please enter departure city'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, fromError:{set:false, message:null} }));

    if(formData.to == null || formData.to == undefined || formData.to == ''){
      setErrors(pre=>({...pre, toError:{set:true, message:'Please enter destination city'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, toError:{set:false, message:null} }));

    if(formData.date == null || formData.date == undefined || formData.date == ''){
      setErrors(pre=>({...pre, dateError: {set:true, message: 'Plese select date'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, dateError:{set:false, message:null} }));

    if(formData.time == null && formData.time == undefined){
      setErrors(pre=>({...pre, timeError:{set: true, message : 'Please select preferred time'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, timeError:{set:false, message:null} }));


    
    if(goAhead){
      handleAddToItinerary('buses', {action, editId, formData});
    }
    
  }

  const handleCancel = ()=>{
    setVisible(false);
  }

  useEffect(()=>{
    console.log(formData, 'form data');
  },[formData])

  useEffect(()=>{
    console.log(errors, 'Bus form errors')
  }, [errors])

    
    return(<div className='max-w-[440px]'>
    <   div className='pb-10 text-lg text-neutral-700 font-cabin'>Flight</div>
        
        <div className='w-[100%] h-[100%] bg-white flex gap-2 flex-wrap items-end'>
          <Input 
            title='Leaving From'  
            placeholder='City' 
            value={formData.from}
            error={errors?.fromError} 
            onBlur={(e)=>updateCity(e, 'from')} />

          <Input 
            title='Where To?' 
            placeholder='City' 
            value={formData.to} 
            error={errors?.toError}
            onBlur={(e)=>updateCity(e, 'to')} />

            <div className='flex gap-2'>
              <SlimDate 
                format='date-month'
                min={0}
                date={formData.date}
                onChange = {handleDateChange}
                title='On?' />

              <PreferredTime
                value={formData.time}
                onChange={handleTimeChange}  />
            </div>
        </div>

        {action == 'create' && <div className='flex flex-row-reverse mt-6'>
            <div onClick={handleSubmit} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Add to Itinerary</div>
        </div>} 

        {action == 'edit' && <div className='flex flex-row-reverse mt-6 gap-4'>
            <div onClick={handleCancel} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Cancel</div>
            <div onClick={handleSubmit} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Save Changes</div>
          </div>}
        
    </div>)
}

const CabForm = ({setVisible, handleAddToItinerary, action='create', editId = null, editData=null})=>{

  const [formData, setFormData] = useState( 
    {
      pickupAddress:editData?.pickupAddress??'', 
      dropAddress:editData?.dropAddress??'', 
      class:editData?.class??'Regular', 
      date:editData?.date??getCurrentDate(), 
      returnDate: editData?.returnDate??getCurrentDate(1), 
      time:editData?.time??'12pm - 3pm', 
      isFullDayCab:editData?.isFullDayCab??false, 
      isRentalCab: editData?.isRentalCab??false 
    });

  const [errors, setErrors] = useState(
    {
      pickupError:{set:false, message:null}, 
      dropError:{set:false, message:null}, 
      dateError:{set:false, message:null}, 
      returnDateError:{set: false, message:null},  
      timeError:{set:false, message:null}
    });


  const updateCity = (e, field)=>{
      const formData_copy = JSON.parse(JSON.stringify(formData))
      formData_copy[field] = e.target.value
      setFormData(formData_copy)
  }

  const handleTimeChange = (value)=>{
      const formData_copy = JSON.parse(JSON.stringify(formData))
      formData_copy.time = value
      setFormData(formData_copy)
  }

  const handleDateChange = (e)=>{
      const formData_copy = JSON.parse(JSON.stringify(formData))
      formData_copy.date = e.target.value
      setFormData(formData_copy)
  }

  const handleReturnDateChange = (e)=>{
    const formData_copy = JSON.parse(JSON.stringify(formData))
    formData_copy.returnDate = e.target.value
    setFormData(formData_copy)
  }

  const handleSubmit = ()=>{

    console.log('form submitted')
    let goAhead = true;

    if(formData.pickupAddress == null || formData.pickupAddress == undefined || formData.pickupAddress == ''){
      setErrors(pre=>({...pre, pickupError: {set: true, message: 'Please enter pickup address'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, pickupError:{set:false, message:null} }));

    if(formData.dropAddress == null || formData.dropAddress == undefined || formData.dropAddress == ''){
      setErrors(pre=>({...pre, dropError:{set:true, message:'Please enter drop address'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, dropError:{set:false, message:null} }));

    if(formData.date == null || formData.date == undefined || formData.date == ''){
      setErrors(pre=>({...pre, dateError: {set:true, message: 'Plese select date'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, dateError:{set:false, message:null} }));

    if(formData.isFullDayCab && (formData.returnDate == null || formData.returnDate == undefined || formData.returnDate == '') ){
      setErrors(pre=>({...pre, returnDateError: {set: true, message: 'Please select return date'} }));
      goAhead=false;
    }

    if(formData.time == null && formData.time == undefined){
      setErrors(pre=>({...pre, timeError:{set: true, message : 'Please select preferred time'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, timeError:{set:false, message:null} }));

    if(goAhead){
      if(formData.isRentalCab) {
        handleAddToItinerary('rentalCabs', {action, editId, formData});
      }else handleAddToItinerary('cabs', {action, editId, formData});
    }
    
  }

  const handleCancel = ()=>{
    setVisible(false);
  }

  const handleFullDayCabCheckbox = (e)=>{
    if(e.target.checked){
      setFormData(pre=>({...pre, isFullDayCab:e.target.checked, isRentalCab:false}))
      return;
    }
    
    setFormData(pre=>({...pre, isFullDayCab:e.target.checked}))
  }

  const handleClassChange = (option)=>{

    setFormData(pre=>({...pre, class:option}));
  }

  const handleRentalCabCheckbox = (e)=>{
    if(e.target.checked){
      setFormData(pre=>({...pre, isRentalCab:e.target.checked, isFullDayCab:false}))
      return;
    }
    
    setFormData(pre=>({...pre, isRentalCab:e.target.checked}))
  }

  useEffect(()=>{
    console.log(formData, 'form data');
  },[formData])

  useEffect(()=>{
    console.log(errors, 'flight form errors')
  }, [errors])

    
    return(<div className=''>
    <   div className='pb-10 text-lg text-neutral-700 font-cabin'>Cab</div>
        
        <div className='flex gap-6'>
          <div className='flex gap-2 mb-8'>
              <input className='cursor-pointer w-4 h-4 rounded-sm' onChange={handleFullDayCabCheckbox} name='full-day-cab' type='checkbox' checked={formData.isFullDayCab} />
              <label htmlFor='full-day-cab' className='font-cabin text-sm text-neutral-700'>Full Day Cab</label>
          </div>

          <div className='flex gap-2 mb-8'>
              <input className='cursor-pointer w-4 h-4 rounded-sm' onChange={handleRentalCabCheckbox} name='rental-cab' type='checkbox' checked={formData.isRentalCab} />
              <label htmlFor='rental-cab' className='font-cabin text-sm text-neutral-700'>Rental Cab / Self Drive </label>
          </div>
        </div>

        <div className='w-[100%] h-[100%] bg-white flex gap-2 flex-wrap items-end'>

           <div className='flex flex-col gap-4 items-start relative'>

           <div className='flex gap-2 w-full'>
            <Select
              maxWidth = {'200px'}
              currentOption = {'Regular'}
              title={'Cab Type'}
              onSelect = {handleClassChange}
              options={['Regular', 'Sedan', 'SUV']} 
              />

            <PreferredTime
              value={formData.time}
              onChange={handleTimeChange}  />
           </div>
              
            <div className='flex flex-col gap-2 w-full'>
              <Input 
                maxWidth = {'400px'}
                showLocationSymbol = {true}
                title='Pickup Address?'  
                placeholder='pickup address' 
                value={formData.pickupAddress}
                error={errors?.fromError} 
                onBlur={(e)=>updateCity(e, 'pickupAddress')} />

              <Input 
                showLocationSymbol = {true}
                title='Drop Address?' 
                placeholder='drop address' 
                value={formData.dropAddress} 
                error={errors?.toError}
                onBlur={(e)=>updateCity(e, 'dropAddress')} />
            </div>

            <div className='flex gap-2'>
              <SlimDate 
                format='date-month'
                min={0}
                date={formData?.date}
                onChange = {handleDateChange}
                title={`${(formData.isFullDayCab || formData.isRentalCab)? 'From Date' : 'On?'}`} />

              {(formData.isFullDayCab || formData.isRentalCab) && <SlimDate 
                format='date-month'
                min={dateDiffInDays(formData.date, getCurrentDate())}
                date={formData?.returnDate}
                onChange = {handleReturnDateChange}
                title={`Till Date?`} />}

              {(formData.isFullDayCab || formData.isRentalCab) && <div className='w-fit h-[73px] flex flex-col gap-2'>
                  <p className='whitespace-nowrap text-zinc-600 text-sm font-cabin'>Total Days</p>
                  <div className='px-6 py-2 border rounded-md border border-neutral-300'>{dateDiffInDays(formData.date, formData.returnDate)+1}</div>
                </div>}
            </div>
            

            </div>
        </div>

        {action == 'create' && <div className='flex flex-row-reverse mt-10'>
            <div onClick={handleSubmit} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Add to Itinerary</div>
        </div>}

        {action == 'edit' && <div className='flex flex-row-reverse mt-10 gap-4'>
            <div onClick={handleCancel} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Cancel</div>
            <div onClick={handleSubmit} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Save Changes</div>
          </div>}
        
    </div>)
}

const HotelForm = ({setVisible, handleAddToItinerary, action='create', editId = null, editData = null})=>{

  const [formData, setFormData] = useState(
    {checkIn:editData?.checkIn??getCurrentDate(), 
      checkOut:editData?.checkOut??getCurrentDate(), 
      class:editData?.date??'Any', 
      location:editData?.location??'', 
      needBreakfast:editData?.needBreakfast??false,
      needLunch:editData?.needLunch??false,
      needDinner:editData?.needDinner??false,
      needNonSmokingRoom:editData?.needNonSmokingRoom??false,
      time:editData?.time??'12pm - 3pm'});

  const [errors, setErrors] = useState({checkInError:{set:false, message:null}, checkOutError:{set:false, message:null}, locationError:{set:false, message:null}, timeError:{set:false, message:null}});

  const updateCity = (e)=>{
      const formData_copy = JSON.parse(JSON.stringify(formData))
      formData_copy.location = e.target.value
      setFormData(formData_copy)
  }

  const updateClass = (option)=>{
    const formData_copy = JSON.parse(JSON.stringify(formData));
    formData_copy.class = option;
    setFormData(formData_copy);
  }

  const handleTimeChange = (value)=>{
      const formData_copy = JSON.parse(JSON.stringify(formData))
      formData_copy.time = value
      setFormData(formData_copy)
  }

  const handleDateChange = (e, field)=>{
      const formData_copy = JSON.parse(JSON.stringify(formData))
      formData_copy[field] = e.target.value
      setFormData(formData_copy)
  }

  const handlePreferences = (e, field)=>{
    setFormData(pre=>({...pre, [field]:e.target.checked}))
  }

  const handleSubmit = ()=>{

    console.log('form submitted')
    let goAhead = true;

    if(formData.checkIn == null || formData.checkIn == undefined || formData.checkIn == ''){
      setErrors(pre=>({...pre, checkInError: {set: true, message: 'Please select check-In date'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, checkInError:{set:false, message:null} }));

    if(formData.checkOut == null || formData.checkOut == undefined || formData.checkOut == ''){
      setErrors(pre=>({...pre, checkOutError:{set:true, message:'Please select check-Out date'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, checkOutError:{set:false, message:null} }));

    if(dateDiffInDays(formData.checkIn, formData.checkOut) < 1 ){
      setErrors(pre=>({...pre, checkOutError:{set:true, message:'check out date should be higher'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, checkOutError:{set:false, message:null} }));

    if(formData.location == null || formData.location == undefined || formData.location == ''){
      setErrors(pre=>({...pre, locationError: {set:true, message: 'Plese enter hotel location'}}))
      goAhead=false;
    }else setErrors(pre=>({...pre, locationError:{set:false, message:null} }));
 
    if(goAhead){
      handleAddToItinerary('hotels', {action, editId, formData});
    }
    
  }

  const handleCancel = ()=>{
    setVisible(false);
  }

  useEffect(()=>{
    console.log(formData, 'form data');
  },[formData])

  useEffect(()=>{
    console.log(errors, 'hotel form errors')
  }, [errors])

    
    return(<div className='max-w-[440px]'>
    <   div className='pb-10 text-lg text-neutral-700 font-cabin'>Hotel</div>
        
        <div className='w-[100%] h-[100%] bg-white flex gap-4 flex-wrap items-end'>
          
          <div className='flex gap-2'>
            <Input 
              maxWidth={'200px'}
              title='Location'  
              placeholder='City' 
              value={formData.location}
              error={errors?.locationError} 
              onBlur={(e)=>updateCity(e)} />

            <Select
              maxWidth={'150px'}
              currentOption={'Any'}
              title='Hotel Rating'
              onSelect={updateClass} 
              options={['Any', '3-star', '4-star', '5-star']} />
            </div>

            <div className='flex gap-2'>
              <SlimDate 
                format='date-month'
                min={0}
                date={formData.checkIn}
                error={errors.checkInError}
                onChange = {(e)=>handleDateChange(e, 'checkIn')}
                title='Check-In' />
              
              <SlimDate 
                format='date-month'
                min={0}
                date={formData.checkOut}
                error={errors.checkOutError}
                onChange = {(e)=>handleDateChange(e,'checkOut')}
                title='Check-Out' />

              <div className='w-fit h-[73px] flex flex-col gap-2'>
                <p className='whitespace-nowrap text-zinc-600 text-sm font-cabin'>Total Nights</p>
                <div className='px-6 py-2 border rounded-md border border-neutral-300'>{dateDiffInDays(formData.checkIn, formData.checkOut)}</div>
              </div>
            </div>

            <div className=''>
              <p className='text-neutral-600 text-sm mb-4'>Preferences</p>

              <div className='flex gap-2 flex-wrap'>
                  <div className='flex gap-2 items-center'>
                    <input onChange={(e)=>handlePreferences(e, 'needBreakfast')} type='checkbox' className='w-4 h-4 cursor-pointer' checked={formData.needBreakfast}/>
                    <p className='text-sm text-neutral-600'>Breakfast</p>
                  </div>

                  <div className='flex gap-2 items-center'>
                    <input onChange={(e)=>handlePreferences(e, 'needLunch')} type='checkbox' className='w-4 h-4 cursor-pointer' checked={formData.needLunch}/>
                    <p className='text-sm text-neutral-600'>Lunch</p>
                  </div>

                  <div className='flex gap-2 items-center'>
                    <input onChange={(e)=>handlePreferences(e, 'needDinner')} type='checkbox' className='w-4 h-4 cursor-pointer' checked={formData.needDinner}/>
                    <p className='text-sm text-neutral-600'>Dinner</p>
                  </div>

                  <div className='flex gap-2 items-center'>
                    <input onChange={(e)=>handlePreferences(e, 'needNonSmokingRoom')} type='checkbox' className='w-4 h-4 cursor-pointer' checked={formData.needNonSmokingRoom}/>
                    <p className='text-sm text-neutral-600'>Non-Smoking Room</p>
                  </div>
              </div>
            </div>
        </div>

        {action == 'create' && <div className='flex flex-row-reverse mt-10'>
            <div onClick={handleSubmit} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Add to Itinerary</div>
        </div>} 

        {action == 'edit' && <div className='flex flex-row-reverse mt-10 gap-4'>
            <div onClick={handleCancel} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Cancel</div>
            <div onClick={handleSubmit} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Save Changes</div>
          </div>}
        
    </div>)
}

const Modal = ({ visible, setVisible, children }) => {


  useEffect(()=>{
    if(visible){
      document.body.style.overflowY='hidden';
    }
    else 
    document.body.style.overflowY= 'visible'
  }, [visible])

  return (
    visible && (
      <div className='relative '>

        <div className='fixed  w-[100%] h-[100%] left-0 top-0 bg-black/30 z-10' onClick={()=>setVisible(false)}>
        </div>

        <div className="fixed w-fit h-fit left-[50%] translate-x-[-50%] top-[10%] sm:rounded-lg shadow-lg z-[100] bg-white">
            {/* close icon */}
            <div onClick={()=>setVisible(false)} className='cursor-pointer absolute right-0 hover:bg-red-100 p-2 rounded-full mt-2 mr-4'>
                <img src={closeIcon} alt="" className='w-6 h-6' />
            </div>
            
            {/* childrens */}
            <div className='p-10 max-w-[440px]'>
                {children}
            </div>
        </div>

        </div>
    )
  );
};

function getCurrentDate(){
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function flattenObjectToArray(obj) {
  return Object.values(obj).reduce((acc, val) => acc.concat(val), []);
}

function dateDiffInDays(a, b) {
  try{
    const date1 = moment(a);
    const date2 = moment(b);    
    // Calculate the difference in days
    const diffInDays = date2.diff(date1, 'days');
    return diffInDays;
  }catch(e){
    return 0;
  }
}