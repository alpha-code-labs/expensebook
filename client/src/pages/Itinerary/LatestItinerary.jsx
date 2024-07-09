
import React, { useCallback, useEffect, useState } from 'react';
import closeIcon from '../../assets/close.svg';
import Input from '../../components/common/Input';
import SlimDate from '../../components/common/SlimDate';
import PreferredTime from '../../components/common/PreferredTime';
// import DisplayItinerary from './DisplayItinerary';
import { dummyFlight, dummyCabs, dummyCarRentals, dummyHotel } from '../../data/dummy';
import DisplayItinerary from './DisplayItinerary';
import { generateUniqueIdentifier } from '../../utils/uuid';
import moment from 'moment';
import Select from '../../components/common/Select';
import { camelCaseToTitleCase } from '../../utils/handyFunctions';
import { left_arrow_icon } from "../../assets/icon";
import { useNavigate } from 'react-router-dom';
import itinerary_icon from '../../assets/itinerary.webp'
import Button from '../../components/common/Button';
import { updateTravelRequest_API } from '../../utils/api';
import Error from '../../components/common/Error';

export default function({formData, setFormData, onBoardingData, lastPage, nextPage}){
const navigate = useNavigate();

const itineraryItems = ['cab', 'flight', 'hotel', 'train', 'bus'];
const [modalContent, setModalContent] = useState(null);
const [visible, setVisible] = useState(false);
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL
const tenantId = formData.tenantId;
const [requestSubmitted, setRequestSubmitted] = useState(false)
const [showPopup, setShowPopup] = useState(false)
const [loadingErrMsg, setLoadingErrMsg] = useState(false)
const cashAdvanceAllowed = onBoardingData.cashAdvanceAllowed
const [showConfirm, setShowConfirm] = useState(false);
const [deleteId, setDeleteId] = useState()

function getNextSequenceNumber(){
  return Math.max(...flattenObjectToArray(formData.itinerary).map(item=>item.sequence), 0)+1;
}
  
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

  setFormData(newFormData);
 
},[formData.itinerary])

const conirmDeleteItineraryItem = (formId)=>{
  setShowConfirm(true);
  setDeleteId(formId);
}

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
      setModalContent(<CabForm setVisible={setVisible} handleAddToItinerary={handleAddToItinerary} action='edit' editId={formId} editData={{pickupAddress:item.pickupAddress, dropAddress:item.dropAddress, class:item.class, time:item.time, date:item.date, returnDate:item.returnDate, isFullDayCab:item.isFullDayCab}} />);
      return;
    }
    case 'carRentals' : {
      setModalContent(<CabForm setVisible={setVisible} handleAddToItinerary={handleAddToItinerary} action='edit' editId={formId} editData={{pickupAddress:item.pickupAddress, dropAddress:item.dropAddress, class:item.class, time:item.time, date:item.date, returnDate:item.returnDate, isRentalCab:true}} />);
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


          const formData_copy = JSON.parse(JSON.stringify(formData));
          formData_copy.itinerary.flights.push(newItem);
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

          const formData_copy = JSON.parse(JSON.stringify(formData));
          formData_copy.itinerary.trains.push(newItem);
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

          const formData_copy = JSON.parse(JSON.stringify(formData));
          formData_copy.itinerary.buses.push(newItem);

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


          const formData_copy = JSON.parse(JSON.stringify(formData));
          formData_copy.itinerary.cabs.push(newItem);

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
          const newItem = JSON.parse(JSON.stringify(dummyCarRentals));
          newItem.pickupAddress = data.formData.pickupAddress;
          newItem.dropAddress = data.formData.dropAddress;
          newItem.class = data.formData.class;
          newItem.date = data.formData.date;
          newItem.returnDate = data.formData.returnDate;
          newItem.time = data.formData.time;
          newItem.sequence = getNextSequenceNumber();
          newItem.formId = generateUniqueIdentifier();
          newItem.approvers = formData.approvers; 

          const formData_copy = JSON.parse(JSON.stringify(formData));
          formData_copy.itinerary.carRentals.push(newItem);

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

          const formData_copy = JSON.parse(JSON.stringify(formData));
          formData_copy.itinerary.hotels.push(newItem);

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

const handleNext = async ()=>{
  console.log('clicked on next');
  if(nextPage == undefined && formData.travelRequestId){
    //submission logic
      console.log('sending call')
      setShowPopup(true)
      setRequestSubmitted(false)
      const res = await updateTravelRequest_API({travelRequest:{...formData, isCashAdvanceTaken:false}, submitted:true})
      
      if(res.err){
          setLoadingErrMsg(res.err)
          return
      }
      else{
          setRequestSubmitted(true)
      }
  }
  else navigate(nextPage);
}

const handleCashAdvance = async (needed)=>{
  //send data to backend
  if(needed){
      window.parent.postMessage(`raiseAdvance ${tenantId} ${formData.travelRequestId}`, DASHBOARD_URL);
      setShowPopup(false)
  }    
  else{
      //post message to close iframe
      window.parent.postMessage('closeIframe', DASHBOARD_URL);
  }

}

useEffect(()=>{
  //update trip name 
  const sortedItinerary = [...formData.itinerary.flights, ...formData.itinerary.trains, ...formData.itinerary.buses].sort((a,b)=>a.sequence-b.sequence);
  const flattend = sortedItinerary.map(item=>([item.from, item.to])).flat(2);
  const cityString = flattend.filter((item,index)=> flattend[index-1] != item).map(item=>item.substr(0,3).toUpperCase()).join('-');
  const startDate = sortedItinerary[0]?.date;

  setFormData(pre=>({...pre, tripName:generateTripName(pre.tripPurpose, cityString, startDate)}))
},[formData.itinerary])

    return(<>     
        <div className="max-w-[712px] mx-auto min-h-[100%] flex flex-col sm:px-8 px-6 py-6">
            {/* back link */}
            <div className='flex items-center gap-4 cursor-pointer mb-4'>
                <img className='w-[24px] h-[24px]' src={left_arrow_icon} onClick={()=>navigate(lastPage)} />
                <img className='w-6 h-6' src={itinerary_icon}/>
                <p className='text-neutral-700 text-md font-semibold font-cabin'>Itinerary</p>
            </div>
            
            <div className='flex flex-col w-full h-full'>


              {/* sidebar for adding itinerary items */}
              <div className="flex flex-row transition-all rounded-lg bg-white">
                  {itineraryItems.map(item=>(
                      <div 
                        key={item}
                        onClick={()=>addItineraryItem(camelCaseToTitleCase(item))}
                        className="flex relative flex-col w-[100%] h-[100px] gap-2 items-center justify-center cursor-pointer group">
                      <div className={`sprite ic-${item} group-hover:ic-${item}-hovered`}/>
                      <p className="text-neutral-800 text-sm group-hover:text-indigo-600 group-hover:font-semibold">{camelCaseToTitleCase(item)}</p>
                      <div className='absolute bottom-0 w-full h-1 bg-white group-hover:bg-indigo-600'></div>
                  </div>))}
              </div>
        
              <div className={`py-4`}>
                  <DisplayItinerary formData={formData} setFormData={setFormData} handleDelete={conirmDeleteItineraryItem}  handleEdit={editItineraryItem}/>
                  
                  <Modal visible={visible} setVisible={setVisible}>
                      {modalContent}
                  </Modal>
              </div>
            </div>

            <div className='flex w-full justify-end'>
                <Button disabled={nextPage == 'undefined' && formData.itinerary } text={`${nextPage == undefined ? 'Submit' : 'Continue'}`} onClick={handleNext}/>
            </div>
            
            <Modal visible={showPopup} setVisible={setShowPopup} skipable={true}>
                {!requestSubmitted && 
                  <div className='w-[150px] h-[150px]'>
                    <Error message={loadingErrMsg} />
                  </div>}
                {requestSubmitted && <div className='p-10'>
                    <p className='text-2xl text-neutral-700 font-semibold font-cabin'>Travel Request Submitted !</p>
                    { cashAdvanceAllowed && <> 
                        <p className='text-zinc-800 text-base font-medium font-cabin mt-4'>Would you like to raise a cash advance request for this trip?</p>
                        <div className='flex gap-10 justify-between mt-10'>
                            <Button text='Yes' onClick={()=>handleCashAdvance(true)} />
                            <Button text='No' onClick={()=>handleCashAdvance(false)} />
                        </div>
                      </>
                    }

                    {!cashAdvanceAllowed && <div className='flex gap-10 justify-between mt-10'>
                            <Button text='Ok' onClick={()=>handleCashAdvance(false)} />
                        </div>}

                </div>}
            </Modal>
            
            <Confirm visible={showConfirm} setVisible={setShowConfirm} itemId = {deleteId} actionHandler={deleteItineraryItem} />
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

    return(<div className='max-w-[440px]'>
    <   div className='pb-4 sm:pb-10 text-lg text-neutral-700 font-cabin'>Flight</div>
        
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
                title={'Preferred Time'}
                value={formData.time}
                onChange={handleTimeChange}  />
            </div>
        </div>

        {action == 'create' && <div className='flex flex-row-reverse mt-6'>
            <div onClick={handleSubmit} className='w-fit px-4 py-2 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Add to Itinerary</div>
        </div>} 

        {action == 'edit' && <div className='flex flex-row-reverse mt-6 gap-4'>
            <div onClick={handleCancel} className='w-fit px-4 py-2 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Cancel</div>
            <div onClick={handleSubmit} className='w-fit px-4 py-2 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Save Changes</div>
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

    
    return(<div className='max-w-[440px]'>
    <   div className='pb-4 sm:pb-10 text-lg text-neutral-700 font-cabin'>Train</div>
        
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
                title={'Preferred Time'}
                value={formData.time}
                onChange={handleTimeChange}  />
            </div>
        </div>

        {action == 'create' && <div className='flex flex-row-reverse mt-6'>
            <div onClick={handleSubmit} className='w-fit px-4 py-2 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Add to Itinerary</div>
        </div>} 

        {action == 'edit' && <div className='flex flex-row-reverse mt-6 gap-4'>
            <div onClick={handleCancel} className='w-fit px-4 py-2 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Cancel</div>
            <div onClick={handleSubmit} className='w-fit px-4 py-2 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Save Changes</div>
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

    
    return(<div className='max-w-[440px]'>
    <   div className='pb-4 sm:pb-10 text-lg text-neutral-700 font-cabin'>Flight</div>
        
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
                title={'Preferred Time'}
                value={formData.time}
                onChange={handleTimeChange}  />
            </div>
        </div>

        {action == 'create' && <div className='flex flex-row-reverse mt-6'>
            <div onClick={handleSubmit} className='w-fit px-4 py-2 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Add to Itinerary</div>
        </div>} 

        {action == 'edit' && <div className='flex flex-row-reverse mt-6 gap-4'>
            <div onClick={handleCancel} className='w-fit px-4 py-2 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Cancel</div>
            <div onClick={handleSubmit} className='w-fit px-4 py-2 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Save Changes</div>
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


    
    return(<div className=''>
    < div className='pb-4 sm:pb-10 text-lg text-neutral-700 font-cabin'>Cab</div>
        
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

           <div className='flex flex-col sm:flex-row gap-2 w-full'>
            <Select
              maxWidth = {'200px'}
              currentOption = {'Regular'}
              title={'Cab Type'}
              onSelect = {handleClassChange}
              options={['Regular', 'Sedan', 'SUV']} 
              />

            <div className='flex gap-2'>
              <PreferredTime
                value={formData.time}
                onChange={handleTimeChange}  />

              {(!formData.isFullDayCab && !formData.isRentalCab) && <SlimDate 
                format='date-month'
                min={0}
                date={formData?.date}
                onChange = {handleDateChange}
                title={`${(formData.isFullDayCab || formData.isRentalCab)? 'From Date' : 'On?'}`} />}
            </div>

           </div>
              
            <div className='flex flex-col gap-2 w-full'>
              <Input 
                maxWidth = {'400px'}
                showLocationSymbol = {true}
                title='Pickup Address?'  
                placeholder='pickup address' 
                value={formData.pickupAddress}
                error={errors?.pickupError} 
                onBlur={(e)=>updateCity(e, 'pickupAddress')} />

              <Input 
                maxWidth = {'400px'}
                showLocationSymbol = {true}
                title='Drop Address?' 
                placeholder='drop address' 
                value={formData.dropAddress} 
                error={errors?.dropError}
                onBlur={(e)=>updateCity(e, 'dropAddress')} />
            </div>

            {(formData.isFullDayCab || formData.isRentalCab) && <div className='flex gap-2 flex-wrap'>
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
                </div>

              {(formData.isFullDayCab || formData.isRentalCab) && <div className='w-fit h-[73px] flex flex-col gap-2'>
                  <p className='whitespace-nowrap text-zinc-600 text-sm font-cabin'>Total Days</p>
                  <div className='px-6 py-2 border rounded-md border border-neutral-300'>{dateDiffInDays(formData.date, formData.returnDate)+1}</div>
                </div>}
            </div>}
            

            </div>
        </div>

        {action == 'create' && <div className='flex flex-row-reverse mt-10'>
            <div onClick={handleSubmit} className='w-fit px-4 py-2 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Add to Itinerary</div>
        </div>}

        {action == 'edit' && <div className='flex flex-row-reverse mt-10 gap-4'>
            <div onClick={handleCancel} className='w-fit px-4 py-2 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Cancel</div>
            <div onClick={handleSubmit} className='w-fit px-4 py-2 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Save Changes</div>
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

 
    return(<div className='max-w-[440px]'>
    <   div className='pb-4 sm:pb-10 text-lg text-neutral-700 font-cabin'>Hotel</div>
        
        <div className='w-[100%] h-[100%] bg-white flex gap-4 flex-wrap items-end'>
          
          <div className='flex flex-col sm:flex-row gap-2'>
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

            <div className='flex flex-col sm:flex-row gap-2'>
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
              </div>

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
            <div onClick={handleSubmit} className='w-fit px-4 py-2 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Add to Itinerary</div>
        </div>} 

        {action == 'edit' && <div className='flex flex-row-reverse mt-10 gap-4'>
            <div onClick={handleCancel} className='w-fit px-4 py-2 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Cancel</div>
            <div onClick={handleSubmit} className='w-fit px-4 py-2 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Save Changes</div>
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
      <div className='relative'>

        <div className='fixed  w-[100%] h-[100%] left-0 top-0 bg-black/30 z-10' onClick={()=>setVisible(false)}>
        </div>

        <div className="fixed w-[90%] sm:w-fit max-w-[100%] h-fit max-h-[90%] overflow-y-scroll sm:overflow-y-hidden left-[50%] translate-x-[-50%] top-[5%] sm:top-[10%] rounded-lg shadow-lg z-[100] bg-white">
            {/* close icon */}
            <div onClick={()=>setVisible(false)} className='cursor-pointer absolute right-0 hover:bg-red-100 p-2 rounded-full mt-2 mr-4'>
                <img src={closeIcon} alt="" className='w-6 h-6' />
            </div>
            
            {/* childrens */}
            <div className='p-4 sm:p-10 max-w-[100%] rounded-md'>
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

function generateTripName(tripPurpose, tripString, startDate){
  try{
    const dateString = startDate? moment(startDate).format('Do MMM') : ''; 
    if(tripString == '') return `${tripPurpose}-trip-(${dateString})`;
    return tripString+=`(${dateString})`;

  }catch(e){
    console.log(e)
    return 'Trip';
  }
}

const Confirm = ({ visible, setVisible, actionHandler, itemId}) => {

  useEffect(()=>{
    if(visible){
      document.body.style.overflowY='hidden';
    }
    else 
    document.body.style.overflowY= 'visible'
  }, [visible]);

  const onConfirm = ()=>{
      actionHandler(itemId);
      setVisible(false);
  }

  return (
    visible && (
      <div className='relative'>

        <div className='fixed  w-[100%] h-[100%] left-0 top-0 bg-black/30 z-10' onClick={()=>setVisible(false)}>
        </div>

        <div className="fixed w-[90%] sm:w-fit max-w-[100%] h-fit max-h-[90%] overflow-y-scroll sm:overflow-y-hidden left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] rounded-sm shadow-lg z-[100] bg-white">
      
            {/* childrens */}
            <div className='p-6 sm:p-10 max-w-[100%] rounded-sm'>
                <div className="flex flex-col">
                      <p className='text-lg sm:text-xl text-neutral-800 font-cabin'>Are you sure you want to delete this item from your itinerary?</p>
                      <p className='text-sm text-neutral-400 font-cabin mt-6'>Once you delete, it's gone for good</p>
                      <div className="flex gap-2 mt-10">
                          <div className='flex flex-row-reverse'>
                              <div onClick={onConfirm} className='w-fit px-4 py-2 hover:bg-blue-800 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Delete Item</div>
                          </div>

                          <div className='flex flex-row-reverse'>
                              <div onClick={()=>setVisible(false)} className='w-fit px-4 py-2 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Cancel</div>
                          </div>
                      </div>
                </div>
            </div>
        </div>

        </div>
    )
  );
};