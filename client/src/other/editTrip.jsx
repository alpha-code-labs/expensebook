




//Working on it now
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TripForm = () => {
  const [tripDetails, setTripDetails] = useState({});
  const [formData, setFormData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await axios.get('/api/trip-details');
        setTripDetails(response.data);
        // Set initial form data here and disable fields that should be restricted
        setFormData({
          destination: response.data.destination || '',
          startDate: response.data.startDate || '',
          status: 'Pending', // Example of a restricted field
          // Add other form fields here
        });
      } catch (error) {
        console.error('Failed to fetch trip details:', error);
      }
    };

    fetchTripDetails();
  }, []);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const isFieldEditable = (fieldName) => {
    // Define which fields should be editable based on your requirements
    const editableFields = ['destination', 'startDate', /* Add other editable fields here */];
    return editableFields.includes(fieldName);
  };

  const renderFormFields = () => {
    return (
      <div>
        {Object.entries(formData).map(([fieldName, fieldValue]) => (
          <div key={fieldName}>
            <label htmlFor={fieldName}>{fieldName}</label>
            <input
              type="text"
              id={fieldName}
              name={fieldName}
              value={fieldValue}
              onChange={handleInputChange}
              disabled={!isFieldEditable(fieldName)} // Disable non-editable fields
            />
          </div>
        ))}
      </div>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      {renderFormFields()}
      <button onClick={nextPage} disabled={currentPage === 6}>
        {currentPage === 6 ? 'Submit' : 'Next'}
      </button>
    </div>
  );
};

export default TripForm;
