
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

export default function(){
const sideBarWidth = '230px'

const itineraryItems = ['Flight', 'Hotel', 'Cab', 'Rental Cab', 'Train', 'Bus'];
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
  

const [shouldAddItem, setShouldAddItem] = useState(false);


const addItineraryItem = (item)=>{
    console.log(`clicked on ${item}`)
    switch(item){
      case 'Flight' : setModalContent(<FlightForm  handleAddToItinerary={handleAddToItinerary} action='create' />); break;
    }
    
    setVisible(true);
}

const deleteItineraryItem = useCallback((formId)=>{
  console.log('deleting item with formId', formId);
  const newItinerary = JSON.parse(JSON.stringify(itinerary));
  Object.keys(newItinerary).forEach(key=>{
    newItinerary[key] = itinerary[key].filter(item=>item.formId != formId);
  })

  setItinerary(newItinerary);
 
},[itinerary])

const editItineraryItem = useCallback((formId)=>{
  console.log('editing item with formId', formId); 
  let category = null;
  let item = null;

  for(let i=0; i<Object.keys(itinerary).length; i++){
    const key= Object.keys(itinerary)[i];
    item = itinerary[key].find(item=>item.formId == formId)

    if(item!=undefined){
      category = key;
      break;
    }
  }

  if(category == null || item == null || item == undefined) return;

  switch(category){
    case 'flights' : {
     setModalContent(<FlightForm setVisible={setVisible} handleAddToItinerary={handleAddToItinerary} action='edit' editId={formId} editData={{from:item.from, to:item.to, date:item.date, time:item.time}} />);
     break; 
    }
  }

  console.log('category', category);

  setVisible(true);
},[itinerary])

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
          newItem.approvers = []; //need to change it
          console.log('creating flight item', newItem);

          const newItinerary = JSON.parse(JSON.stringify(itinerary));
          newItinerary.flights.push(newItem);

          console.log(newItinerary);
          setItinerary(newItinerary)
        }

        if(data.action == 'edit'){
          const itineraryCopy = JSON.parse(JSON.stringify(itinerary)); 
          const item = Object.keys(itineraryCopy)

          for(let i=0; i<Object.keys(itineraryCopy).length; i++){
            const key = Object.keys(itineraryCopy)[i];

            const item = itineraryCopy[key].find(item=>item.formId == data.editId);
            if(item != undefined){
              item.from = data.formData.from;
              item.to = data.formData.to;
              item.date = data.formData.date;
              item.time = data.formData.time;
              break;
            }
          }
          setItinerary(itineraryCopy);
        }
      }
    }

    //add item to the itinerary

    setVisible(false);
  }catch(e){
    console.log(e);
  }
}


useEffect(()=>{
  console.log(itinerary, 'itinerary updated')
},[itinerary])

    return(<>
        <div className="min-w-[100%] min-h-[100%] flex">
            <div className={`w-[${sideBarWidth}] h-[100%] bg-blue-600`}>
                {/* sidebar for adding itinerary items */}
                <div className="flex-flex-row divide-y">
                    {itineraryItems.map(item=>(
                        <div 
                          key={item}
                          onClick={()=>addItineraryItem(item)}
                          className="flex p-4 w-[100%] h-[100px] gap-2 items-center justify-center cursor-pointer hover:bg-blue-700">
                        <p className="text-white text-lg ">{item}</p>
                        <p className="text-2xl text-white">+</p>
                    </div>))}
                </div>
            </div>

            <div className={`w-[calc(100%-${sideBarWidth})]`}>
                <DisplayItinerary itinerary={itinerary} setItinerary={setItinerary} handleDelete={deleteItineraryItem}  handleEdit={editItineraryItem}/>
                <Modal visible={visible} setVisible={setVisible}>
                    {modalContent}
                </Modal>
            </div>

        </div>
    </>)
}

const FlightForm = ({setVisible, handleAddToItinerary, action='create', editId = null, editData=null})=>{

  const [formData, setFormData] = useState({from:editData.from??'', to:editData.to??'', date:editData.date??getCurrentDate(), time:editData.time??'12pm - 3pm'});

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

    
    return(<>
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

        {action == 'create' && <div className='flex flex-row-reverse mt-6'>
            <div onClick={handleSubmit} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Add to Itinerary</div>
        </div>}

        {action == 'edit' && <div className='flex flex-row-reverse mt-6 gap-4'>
            <div onClick={handleCancel} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Cancel</div>
            <div onClick={handleSubmit} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Save Changes</div>
          </div>}
        
    </>)
}

const CabForm = ({setVisible, handleAddToItinerary, action='create', editId = null, editData=null})=>{

  const [formData, setFormData] = useState({pickupAddress:editData.pickupAddress??'', dropoAddress:editData.dropoAddress??'', date:editData.date??getCurrentDate(), time:editData.time??'12pm - 3pm'});

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

    
    return(<>
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

        {action == 'create' && <div className='flex flex-row-reverse mt-6'>
            <div onClick={handleSubmit} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Add to Itinerary</div>
        </div>}

        {action == 'edit' && <div className='flex flex-row-reverse mt-6 gap-4'>
            <div onClick={handleCancel} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Cancel</div>
            <div onClick={handleSubmit} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Save Changes</div>
          </div>}
        
    </>)
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

        <div className='fixed  w-[100%] h-[100%] left-0 top-0 bg-black/10 z-10' onClick={()=>setVisible(false)}>
        </div>

        <div className="fixed w-fit h-fit left-[50%] translate-x-[-50%] top-[10%] sm:rounded-lg shadow-lg z-[100] bg-white">
            {/* close icon */}
            <div onClick={()=>setVisible(false)} className='cursor-pointer absolute right-0 hover:bg-red-100 p-2 rounded-full mt-2 mr-4'>
                <img src={closeIcon} alt="" className='w-6 h-6' />
            </div>
            
            {/* childrens */}
            <div className='p-10'>
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





