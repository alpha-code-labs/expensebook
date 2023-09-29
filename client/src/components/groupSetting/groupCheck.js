import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 


 
// Replace this with your actual database query logic.
// For now, we'll return hardcoded values.
function fetchFlagsFromHRDatabase() {
  return {
    GROUPING_FLAG: false,     // Change to false if needed
    ORG_HEADERS_FLAG: false, // Change to true if needed
  };
}

// Function to check the flags and print messages.
function checkAndPrintMessages() {
  // Fetch flags from the HR database.
  const flags = fetchFlagsFromHRDatabase();

  if (flags.GROUPING_FLAG) {
    console.log("We have identified the following values in your HR data that might potentially be used for creating Groups");
    // You can fetch and display group details here if needed.
  } else if (flags.ORG_HEADERS_FLAG) {
    console.log("We have identified the following values in your HR data that might potentially be used for creating Groups");
    // You can fetch and display group details here if needed.
  } else {
    console.log("We have not detected any values for you to create Groups.");
  }
};


const GroupCheck = () => {
  const navigate = useNavigate();


  const handleChoice = (event) => {
    const choice = event.target.value;

    if (choice === 'no') {
      // If user selects "No", navigate to the next page
      navigate('/next-page');
    } else if (choice === 'yes') {
      // If user selects "Yes," check the GROUPING_FLAG and display the corresponding message.
      checkAndPrintMessages();
    }
  };



  return (
    <div className="App">
    <div className="relative bg-white w-full h-[1068px] overflow-hidden text-left text-base text-white font-cabin">
      <div className="absolute top-[160px] left-[104px] rounded-xl bg-white w-[1072px] h-[897px] overflow-hidden">
        <div className="absolute top-[40px] left-[24px] flex flex-col items-start justify-start gap-[40px] text-[18px] text-ebgrey-500">
          <div className="flex flex-col items-start justify-start gap-[24px]">
          <div className="flex flex-col items-start justify-start gap-[24px]">
              {/* Flags are not available, only display the question and input */}
              <div className="flex flex-col items-start justify-start gap-[16px]">
                <label htmlFor="groupsQuestion" className="text-ebgrey-700 font-medium">
                  Do you have groups in your company on which T&E policies are applied?
                </label>
                <div id="groupsQuestion" className="flex items-start gap-[12px]">
                  <input type="radio" id="yesOption" name="groupsOption" value="yes" onChange={handleChoice} />
                  <label htmlFor="yesOption">Yes</label>
                  <input type="radio" id="noOption" name="groupsOption" value="no" onChange={handleChoice} />
                  <label htmlFor="noOption">No</label>
                </div>
              </div>
          </div>
          </div>
        </div>
      </div>
      <img
        className="absolute top-[80px] left-[calc(50% - 536px)] w-[229px] h-[55px] overflow-hidden"
        alt=""
        src="/frame-505.svg"
      />
    </div>
  </div>

  );
};

export default GroupCheck;
