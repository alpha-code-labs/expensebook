import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PopupMessage from '../components/PopupMessage.jsx'; 

function EditTripDetails() {
  const [tripDetails, setTripDetails] = useState({});
  const [editableFields, setEditableFields] = useState({});
  const [tripIdInput, setTripIdInput] = useState(''); // State to store the entered tripId
  const [showPopup, setShowPopup] = useState(false); // State to manage the popup visibility
  const [messageContent, setMessageContent] = useState(''); // State to store the popup message content

  // Function to filter out restricted fields
  const filterRestrictedFields = (data) => {
    const restrictedFields = ['tripStatus', 'travelRequestStatus', 'cashAdvanceStatus'];
    const filteredData = { ...data };
    for (const field of restrictedFields) {
      delete filteredData[field];
    }
    return filteredData;
  };

  // Function to fetch trip details by tripId using Axios
  const fetchTripDetails = async () => {
    try {
      // Use the tripId entered by the user
      const tripId = tripIdInput.trim(); // Remove any leading/trailing spaces

      const response = await axios.get(`http://localhost:8080/trips/status/${tripId}`);
      if (response.status === 200) {
        const data = response.data;
        const filteredData = filterRestrictedFields(data);
        setTripDetails(filteredData);
        setEditableFields(filteredData);

        // Handle different messages based on the server response
        if (data.message) {
          // Set the message content in state
          setMessageContent(data.message);
          // Show the popup message
          togglePopup();
        }
      } else if (response.status === 400) {
        // Handle the case where the server responds with a 400 status
        // Display the error message to the user
        alert('Error: ' + response.data.message);
      } else {
        throw new Error(`Failed to fetch trip details (${response.status})`);
      }
    } catch (error) {
      console.error('Error fetching trip details:', error);
      // Display a generic error message to the user
      alert('Error fetching trip details. Please try again later.');
    }
  };

  // Function to toggle the display of the popup message
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // Function to handle form field changes
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    // Check if the field is not restricted before allowing changes
    if (!['tripStatus', 'travelRequestStatus', 'cashAdvanceStatus'].includes(name)) {
      setEditableFields({ ...editableFields, [name]: value });
    }
  };

  // Function to save updated trip details using Axios
  const saveTripDetails = async () => {
    try {
      const response = await axios.put('/api/update-trip-details', editableFields, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        fetchTripDetails(); // Reload trip details after saving
        alert('Trip details updated successfully!');
      } else {
        throw new Error(`Failed to update trip details (${response.status})`);
      }
    } catch (error) {
      console.error('Error updating trip details:', error);
      alert('Error updating trip details. Please try again later.');
    }
  };

  // Function to render input fields for trip details
  const renderInputFields = () => {
    return Object.keys(tripDetails).map((fieldName) => (
      <div className="mb-4" key={fieldName}>
        <label className="block mb-2">{fieldName}</label>
        <input
          type="text"
          name={fieldName}
          value={editableFields[fieldName] || ''}
          onChange={handleFieldChange}
          className="border rounded-md p-2"
          placeholder={`${fieldName}...`}
          // Disable editing of restricted fields
          disabled={['tripStatus', 'travelRequestStatus', 'cashAdvanceStatus'].includes(fieldName)}
        />
      </div>
    ));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Trip Details</h1>
      <div>
        <label className="block mb-2">Enter Trip ID:</label>
        <input
          type="text"
          value={tripIdInput}
          onChange={(e) => setTripIdInput(e.target.value)}
          className="border rounded-md p-2 mb-4"
          placeholder="Enter Trip ID..."
        />
        <button
          type="button"
          onClick={fetchTripDetails}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Fetch Trip Details
        </button>
      </div>
      <form>
        {renderInputFields()}

        {/* Save button */}
        <button
          type="button"
          onClick={saveTripDetails}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Save
        </button>
      </form>

      {/* Conditionally render the PopupMessage */}
      {showPopup && (
        <PopupMessage
          title="Trip Details"
          message={messageContent}
          onClose={togglePopup}
        />
      )}
    </div>
  );
}

export default EditTripDetails;
