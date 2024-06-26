import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import CreateTravelRequest from './pages/CreateTravelRequest';
import ModifyTravelRequest from './pages/ModifyTravelRequest';
import CancelTravelRequest from './pages/CancelTravelRequest'
import ClearRejectedTravelRequest from './pages/ClearRejectedTravelRequest';
import Bookings from './pages/Bookings'
import React, { useState, useRef, useEffect } from 'react';
import ModifiedItinerary from './pages/ModifiedItinerary'
import LatestItinerary from './pages/latestItinerary';


function App() {
  return <>
    <Router>
      <Routes>
        <Route path='/create/:tenantId/:employeeId/*' element={<CreateTravelRequest />} />
        <Route path='/modify/:travelRequestId/*' element={<ModifyTravelRequest />} />
        <Route path='/bookings/:travelRequestId' element={<Bookings/>} />
        <Route path='/cancel/:travelRequestId' element={<CancelTravelRequest/>} />
        <Route path='/rejected/:travelRequestId' element={<ClearRejectedTravelRequest />} />
        <Route path='/playground' element={<LatestItinerary />} />
      </Routes>
    </Router>
  </>;
}


const Crud = () => {
  const formFields = [
    { name: 'Bill Date', type: 'date' },
    { name: 'Bill Number', type: 'numeric' },
    { name: 'PickUp', type: 'text' },
    { name: 'DropOff', type: 'text' },
    { name: 'City', type: 'text' },
    { name: 'Quantity', type: 'numeric' },
    { name: 'Unit Cost', type: 'numeric' },
    { name: 'Tax Amount', type: 'numeric' },
    { name: 'Total Amount', type: 'numeric' },
  ];

  const autocompleteRefs = {};

  const initialFormValues = Object.fromEntries(formFields.map((field) => [field.name, '']));
  const [formValues, setFormValues] = useState(initialFormValues);

  const handleChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handlePlaceSelect = (name, place) => {
    const formattedAddress = place.formatted_address;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: formattedAddress,
    }));
  };

  const initAutocomplete = (name) => {
    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRefs[name].current);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      handlePlaceSelect(name, place);
    });
  };

  const loadGoogleMapsScript = () => {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places';
    script.defer = true;
    script.async = true;
    script.onload = () => {
      // Initialize Autocomplete for specified fields
      formFields.forEach((field) => {
        if (field.name==='PickUp' || field.name ==="DropOff") {
          initAutocomplete(field.name);
        }
      });
    };
    document.head.appendChild(script);
  };

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);
  
  const handleSubmit =()=>{
    console.log("handle submit", formValues);
  }

  return (
    <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
      {formFields.map((field) => (
        <div key={field.name} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {field.name}
          </label>
          {field.type === 'date' && (
            <input
              type="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              value={formValues[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          )}
          {field.type === 'numeric' && (
            <input
              type="number"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              value={formValues[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          )}
          {field.type === 'text' && (
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              value={formValues[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              ref={autocompleteRefs[field.name] || (autocompleteRefs[field.name] = useRef())}
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
};


export default App;