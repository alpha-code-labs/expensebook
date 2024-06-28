
import React, { useEffect, useState } from 'react';
import closeIcon from '../assets/close.svg';
import Input from '../components/common/Input';
import SlimDate from '../components/common/SlimDate';
import PreferredTime from '../components/common/PreferredTime';
// import DisplayItinerary from './DisplayItinerary';
import { dummyFlight, dummyCabs, dummyBus, dummyHotel } from '../data/dummy';
import {Draggable} from 'react-beautiful-dnd'
import DisplayItems from './DisplayItems'
import DisplayItinerary from './DisplayItinerary';

export default function(){
const sideBarWidth = '230px'

const itineraryItems = ['Flight', 'Hotel', 'Cab', 'Rental Cab', 'Train', 'Bus'];
const [modalContent, setModalContent] = useState(null);
const [visible, setVisible] = useState(false);

const [itinerary, setItinerary] = useState({
    flights: [
      {
        category:'flights',
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
        id: "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784f",
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
        category:'flights',
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
        id: "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784j",
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
        category:'hotels',
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
        id: "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784k",
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
        category:'cabs',
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
        id: "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784l",
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

  useEffect(()=>{
    const itinerary_copy = JSON.parse(JSON.stringify(itinerary));
    itinerary_copy.flights.push(dummyFlight);
    setItinerary(itinerary_copy);
  },[])

const addItineraryItem = (item)=>{
    console.log(`clicked on ${item}`)
    setModalContent(<FlightForm handleAddToItinerary={handleAddToItinerary}/>)
    setVisible(true);
}

const handleAddToItinerary = ()=>{
    console.log('clicked on add to itinerary')
    setShouldAddItem(true);
    setVisible(false);
}


    return(<>
        <div className="min-w-[100%] min-h-[100%] flex">
            <div className={`w-[${sideBarWidth}] h-[100%] bg-blue-600`}>
                {/* sidebar for adding itinerary items */}
                <div className="flex-flex-row divide-y">
                    {itineraryItems.map(item=>(
                        <div onClick={()=>addItineraryItem(item)} 
                            className="flex p-4 w-[100%] h-[100px] gap-2 items-center justify-center cursor-pointer hover:bg-blue-700">
                        <p className="text-white text-lg ">{item}</p>
                        <p className="text-2xl text-white">+</p>
                    </div>))}
                </div>
            </div>
            <div className={`w-[calc(100%-${sideBarWidth})]`}>
                <DisplayItinerary itinerary={itinerary} setItinerary={setItinerary}/>
                <Modal visible={visible} setVisible={setVisible}>
                    {modalContent}
                </Modal>
            </div>

        </div>
    </>)
}

const FlightForm = ({handleAddToItinerary})=>{
    
    return(<>
    <   div className='pb-10 text-lg text-neutral-700 font-cabin'>Flight</div>
        <div className='w-[100%] h-[100%] bg-white flex gap-2 flex-wrap items-end'>
            <Input
                on 
                title='Leaving From?' />
            <Input title='Where To?' />
            <SlimDate title='On?' />
            <PreferredTime  />
        </div>
        <div className='flex flex-row-reverse mt-6'>
            <div onClick={handleAddToItinerary} className='w-fit px-2 py-1 bg-blue-600  rounded-md border-bg-blue-800 text-gray-100 text-sm hover:bg-blue-500 cursor-pointer'>Add to Itinerary</div>
        </div>
        
        
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



