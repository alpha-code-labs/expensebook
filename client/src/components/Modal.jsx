import React, { useRef, useState, useEffect } from 'react';
import { cancelTrip } from '../utils/tripApi';

const Modal = ({ isOpen, onClose, content,  onCancel ,itineraryId , routeData}) => {
  
  const modalRef = useRef();
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

// ...

const handleConfirm = async () => {
  try {
    // Assuming you have the correct values for tenantId, empId, and itineraryId
    const { tenantId, empId, tripId } = routeData;

    if (itineraryId) {
      // If itineraryId is present, it means cancellation is initiated from the itinerary
      // You need to obtain the correct tripId from your data
      await cancelTrip(tenantId, empId, tripId, itineraryId);
    } else {
      // If itineraryId is not present, it means cancellation is initiated from the header
      // You need to obtain the correct tripId from your data
      await cancelTrip(tenantId, empId, tripId);
    }

    // If the API call is successful, close the modal
    onClose();
  } catch (error) {
    console.error('Error confirming trip:', error.message);
    // Handle error or show a notification to the user
  }
};

// const handleConfirm = async () => {
//   try {
//     // Assuming you have the correct values for tenantId, empId, and itineraryId
//     const tenantId = routeData.tenantId
//     const empId = routeData.empId;
//     const tripId = routeData.tripId
    

//     if (itineraryId) {
//       // If itineraryId is present, it means cancellation is initiated from the itinerary
//        // You need to obtain the correct tripId from your data
//       await cancelTrip(tenantId, empId, tripId, itineraryId, 'itinerary');
//     } else {
//       // If itineraryId is not present, it means cancellation is initiated from the header
//       // You need to obtain the correct tripId from your data
//       await cancelTrip(tenantId, empId, tripId, null, 'header');
//     }

//     // If the API call is successful, close the modal
//     onClose();
//   } catch (error) {
//     console.error('Error confirming trip:', error.message);
//     // Handle error or show a notification to the user
//   }
// };


 


  return (
    <div className={`fixed inset-0 flex items-center justify-center ${isOpen ? 'visible' : 'hidden'}`} onClick={handleClickOutside} aria-hidden="true">
      <div className="absolute inset-0 bg-gray-500 opacity-75 z-10"></div>
      <div
        ref={modalRef}
        className={`relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-md z-20`}
      >
        <div className="bg-white-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="flex justify-center items-center text-center font-inter">
            {content}
          </div>
        </div>
       
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              onClick={handleConfirm}
            >
              Confirm
            </button>

            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={() => {
                onCancel();
                onClose();
              }}
            >
              Cancel
            </button>
          </div>
       
      </div>
    </div>
  );
};

export default Modal;

