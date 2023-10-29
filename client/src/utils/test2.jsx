import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YourComponent = () => {
  const [nonTravelDetails, setNonTravelDetails] = useState([]);

  useEffect(() => {
    // Make an Axios API call to fetch the data
    axios.get('your-api-endpoint')
      .then(response => {
        // Assuming the response is an array of objects
        setNonTravelDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  return (
    <div className="overflow-auto overflow-x-hidden">
      {nonTravelDetails.map((item, index) => (
        <div key={index} className="bg-white flex flex-row items-start justify-start border-b-[1px] border-solid border-ebgrey-100">
          <div className="relative w-[140px] h-14 overflow-hidden shrink-0 text-darkslategray">
            <div className="absolute top-[calc(50%_-_9px)] left-[calc(50%-_42px)] font-medium">
              {item.employeeName}
            </div>
          </div>
          <div className="relative w-[126px] h-14 overflow-hidden shrink-0 text-darkslategray">
            <div className="absolute top-[calc(50%-_7px)] left-[calc(50%-_15px)]">
              ₹{item.amount}
            </div>
          </div>
          <div className="relative w-14 h-14 overflow-hidden shrink-0">
            <div className="absolute top-[calc(50%-_16px)] left-[calc(50%-_16px)] rounded-81xl bg-ebgrey-800 w-8 h-8 overflow-hidden">
              <img
                className="absolute top-[1px] left-[8px] w-[15px] h-[30px] object-cover"
                alt=""
                src={item.invoice}
              />
            </div>
          </div>
          <div className="relative w-[126px] h-14 overflow-hidden shrink-0 text-xs">
            <div className="absolute top-[calc(50%-_7px)] left-[calc(50%-_13px)]">
              {item.category}
            </div>
          </div>
          <div className="relative w-[126px] h-14 overflow-hidden shrink-0 text-xs">
            <div className="absolute top-[calc(50%-_7px)] left-[calc(50%-_21px)]">
              {item.date}
            </div>
          </div>
          <div className="relative w-[126px] h-14 overflow-hidden shrink-0 text-xs">
            <div className="absolute top-[calc(50%-_7px)] left-[39px]">
              {item.status}
            </div>
          </div>
          <div className="relative w-[139px] h-14 overflow-hidden shrink-0 text-center text-eb-primary-blue-500">
            <div className="absolute top-[calc(50%-_16px)] left-[calc(50%-_64.5px)] rounded-29xl box-border w-[129px] h-8 flex flex-row items-center justify-center py-4 px-8 border-[1px] border-solid border-eb-primary-blue-500">
              <div className="relative font-medium" onClick={redirectToNonTravelExpenseDetails}>View Details</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YourComponent;
