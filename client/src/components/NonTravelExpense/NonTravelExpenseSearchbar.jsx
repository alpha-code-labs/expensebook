import React from 'react';
import { useState } from 'react';
import { chevronDown } from '../../assets/icon';

const NonTravelExpenseSearchBar = () => {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
    
      const [selectedMonth, setSelectedMonth] = useState('Aug');
      const [showDropdown, setShowDropdown] = useState(false);
    
      const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
      };
    
      const handleMonthSelect = (month) => {
        setSelectedMonth(month);
        toggleDropdown();
      };
    

  return (
    <div>
      {/* Container */}
      <div className="absolute top-[67px] left-[44px] flex flex-row items-center justify-start gap-[24px] text-justify text-xs text-ebgrey-400">
          {/* searchbar-1 */}
        <div className="rounded-md bg-white box-border w-[206px] h-[31px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by category"
              className="w-full border-none outline-none"
            />
          </div>
        </div>

        {/* searchbar-2 */}
        <div className="rounded-md bg-white box-border w-[206px] h-[31px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Employee Name"
              className="w-full border-none outline-none"
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-start gap-[8px] text-left text-darkslategray">
    <div className="relative font-medium">Select Month</div>
    <div className="relative w-[133px] h-8 text-sm text-black">
      <div className="absolute top-[0px] left-[0px] rounded-md bg-white box-border w-[93px] h-8 border-[1px] border-solid border-ebgrey-200">
        <div className="absolute top-[4px] left-[calc(50%_-_27.5px)] flex flex-row items-center justify-start gap-[8px]">
          <div className="flex flex-row items-center justify-center">
            <div className="flex flex-row items-center justify-center">
              <div className="relative">Oct</div>
            </div>
          </div>
          <img
            className="relative w-6 h-6 overflow-hidden shrink-0"
            alt=""
            src={chevronDown}
          />
        </div>
      </div>
    </div>
  </div>
        {/* <div>
            <div className="flex flex-row w-69px h-15px items-center justify-start gap-[8px] text-left text-darkslategray">
        <div className="relative font-medium">Select Month</div>
        <div className="relative w-[93px] h-[25px] text-sm text-black border-[1px]">
          <div className="absolute top-[0px] left-[0px] rounded-md bg-white box-border w-[73px] h-12 border-[1px] border-solid border-ebgrey-200">
            <div
              className={`relative w-full h-full ${showDropdown ? 'overflow-auto scroll-smooth overflow-x-hidden ' : 'overflow-y-hidden'}`}
            >
              <div
                className="absolute top-[4px] left-[calc(50% - 27.5px)] flex flex-row items-center justify-start gap-[8px]"
                onClick={toggleDropdown}
              >
                <div className="flex flex-row items-center justify-center">
                  <div className="flex flex-row items-center justify-center">
                    <div className="relative" onClick={toggleDropdown}>
                      {selectedMonth}
                    </div>
                  </div>
                </div>
                <img
                  className="relative w-6 h-6 overflow-hidden shrink-0 cursor-pointer"
                  alt=""
                  src={chevronDown}
                  onClick={toggleDropdown}
                />
              </div>
              {showDropdown && (
                <div
                  className="absolute top-[100%] left-0 w-full bg-white border-[1px] border-solid border-ebgrey-200"
                >
                  {months.map((month, index) => (
                    <div
                      key={month}
                      className={`relative w-full p-2 text-black cursor-pointer ${
                        selectedMonth === month ? 'bg-gray-200' : ''
                      }`}
                      onClick={() => handleMonthSelect(month)}
                      tabIndex="0"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleMonthSelect(month);
                      }}
                    >
                      {month}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
            </div>
        </div> */}


      </div>
    </div>
  );
}

export default NonTravelExpenseSearchBar;





















 {/* searchbar-3 */}
        {/* <div className="flex flex-row items-center justify-start gap-[8px] text-left text-darkslategray">
          <div className="relative font-medium">Select Month</div>
          <div className="relative w-[133px] h-8 text-sm text-black">
            <div className="absolute top-[0px] left-[0px] rounded-md bg-white box-border w-[93px] h-8 border-[1px] border-solid border-ebgrey-200">
              <div className="absolute top-[4px] left-[calc(50% - 27.5px)] flex flex-row items-center justify-start gap-[8px]">
                <div className="flex flex-row items-center justify-center">
                  <div className="flex flex-row items-center justify-center">
                    <div className="relative">Aug</div>
                  </div>
                </div>
                <img
                  className="relative w-6 h-6 overflow-hidden shrink-0"
                  alt=""
                  src={chevronDown}
                />
              </div>
            </div>
          </div>
        </div> */}
