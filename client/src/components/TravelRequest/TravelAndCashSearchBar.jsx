import React, { useState } from 'react';

const TravelAndCashSearchBar = ({onSearch}) => {
  const [tripPurpose, setTripPurpose] = useState('');
  const [destination, setDestination] = useState('');
  const [employeeName, setEmployeeName] = useState('');

 const handleSearch = () => {
  onSearch({tripPurpose, destination, employeeName});
 }

 const handleInputChange = (e) => {
  // Update the corresponding state based on input name
  const { name, value } = e.target;
  switch (name) {
    case 'tripPurpose':
      setTripPurpose(value);
      break;
    case 'destination':
      setDestination(value);
      break;
    case 'employeeName':
      setEmployeeName(value);
      break;
    default:
      break;
  }
};

return (
  <div className="absolute top-[67px] left-[36px] flex flex-row items-center justify-start gap-[24px] text-justify text-xs text-ebgrey-400">
    <div className="rounded-md bg-white box-border w-[206px] h-[31px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
      <div className="relative">
        <input
          type="text"
          name="tripPurpose"
          placeholder="Search Travel Name"
          value={tripPurpose}
          onChange={handleInputChange}
          className="w-full border-none outline-none"
        />
      </div>
    </div>
    <div className="rounded-md bg-white box-border w-[206px] h-[31px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
      <div className="relative">
        <input
          type="text"
          name="destination"
          placeholder="Search by destination"
          value={destination}
          onChange={handleInputChange}
          className="w-full border-none outline-none"
        />
      </div>
    </div>
    <div className="rounded-md bg-white box-border w-[206px] h-[31px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
      <div className="relative">
        <input
          type="text"
          name="employeeName"
          placeholder="Search by employee name"
          value={employeeName}
          onChange={handleInputChange}
          className="w-full border-none outline-none"
        />
      </div>
    </div>
    <button onClick={handleSearch}>Search</button>
  </div>
);
};


export default TravelAndCashSearchBar;
