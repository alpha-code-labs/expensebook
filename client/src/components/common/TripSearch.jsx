import React, { useState, useEffect, useRef } from 'react';
import { briefcase, calender_icon } from '../../assets/icon';
import { formatDate, splitTripName } from '../../utils/handyFunctions';
import { TripName } from './TinyComponent';

const TripSearch = ({requestType, validation, data, onSelect, title, error, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (data) {
      setFilteredOptions(data);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (searchTerm.length >= 3) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = data?.filter(option =>
        option.tripName.toLowerCase().includes(lowercasedSearchTerm) ||
        option.travelRequestNumber?.toLowerCase().includes(lowercasedSearchTerm) ||
        option.tripNumber?.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(data);
    }
  }, [searchTerm, data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        setHighlightedIndex((prevIndex) => Math.min(prevIndex + 1, filteredOptions.length - 1));
      } else if (event.key === 'ArrowUp') {
        setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      } else if (event.key === 'Enter') {
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredOptions, highlightedIndex]);

  const handleSelect = (option) => {

    setSearchTerm(option.travelRequestNumber || option.tripNumber);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    onSelect(option);
  };

  function restrictBookExpense(travelType, tripCompletionDate, formValidations) {
    if(requestType !== "travel_Expense"){
      return {flag:false, message: ""}
    }
    const travelSettings = formValidations[travelType];
    if (!travelSettings) return { flag: false, message: "Invalid travel type." };

    const allowedDays = parseInt(travelSettings.expenseReportDeadline.dayLimit.days);
       
    const tripCompletion = new Date(tripCompletionDate);
    const currentDate = new Date();


    const expenseDeadline = new Date(tripCompletion);
    console.log('expense deadline data', expenseDeadline, allowedDays)
    expenseDeadline.setDate(expenseDeadline.getDate() + allowedDays);
    console.log('expense deadline data', expenseDeadline)
     // const violationMessage = travelSettings.expenseReportDeadline.dayLimit.violationMessage;
    //const violationMessage = "Expense raising period exceeded for this trip.";
    const violationMessage = `Expense raising period exceeded on ${[formatDate(expenseDeadline)]}.`

    if (currentDate > expenseDeadline) {
        return { flag: true, message: violationMessage };
    } else {
        return { flag: false, message: "" };
    }
}

  return (
    <div className="relative h-[73px]" ref={dropdownRef}>
      <div className="text-zinc-600 text-sm font-cabin text-start pb-2">{title}</div>
      <div className="rounded-md text-base bg-white box-border flex flex-row items-center justify-start py-3 px-4 border-[1px] border-solid hover:border-neutral-900 border-ebgrey-200">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="relative tracking-[0.01em] text-sm text-neutral-700 placeholder:text-zinc-400 font-cabin placeholder:text-sm outline-none border-none w-full focus-visible:outline-0 focus-visible:border-neutral-900"
          onFocus={() => setIsDropdownOpen(true)}
        />
      </div>
      {isDropdownOpen && (
        <ul className="absolute left-0 w-full bg-white border border-slate-300 rounded-b-md shadow-lg max-h-60 overflow-y-auto mt-0 z-10">
          {loading ? (
            <li className="p-2 text-center text-gray-500">loading...</li>
          ) : (
            filteredOptions.length === 0 ? (
              <div className='h-12 text-start flex justify-start px-4 items-center font-inter text-xs text-zinc-400'>trips not found...</div>
            ) : (
              filteredOptions.map((option, index) => 
                {
                  const {message,flag} = restrictBookExpense(option?.travelType, option?.tripCompletionDate,validation );
                  console.log("validataion",message,flag)
                  return (
                    <li
                  key={option.travelRequestId || option.tripId}
                  onClick={() => {flag? console.log("diabled") : handleSelect(option)}}
                  className={`flex flex-col-reverse gap-y-2 justify-between  p-2 px-4 border-b border-slate-300 ${flag ? "cursor-not-allowed" : "cursor-pointer"} ${highlightedIndex === index ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                >
              <div className='  flex flex-col  items-start whitespace-nowrap'>
                   
              <TripName tripName={option?.tripName}/>
              <p className='mt-1 text-xs font-cabin text-red-200'>{message}</p>
                  </div>
                  <div className='flex justify-between items-start'>
                  <div className='     flex flex-col justify-center items-start'>
                   
                    <div className='font-medium   text-xs font-cabin text-neutral-400'>
                      {option.tripNumber ? "Trip No." : "Travel Request No."}
                    </div>
                    <div className='text-xs font-cabin text-start text-neutral-700'>
                      {option.tripNumber || option.travelRequestNumber}
                    </div>
                  </div>
                  <div className='     flex flex-col justify-center items-start'>
                   
                    <div className='font-medium   text-xs font-cabin text-neutral-400'>
                      {"Completed Date"}
                    </div>
                    <div className='flex gap-1 items-center justify-center text-xs font-cabin text-start text-neutral-700'>
                      <img src={calender_icon} className='w-3 h-3'/>
                      {formatDate(option.tripCompletionDate)}
                    </div>
                    
                    
                  </div>
                  </div>
                 
                </li>

                  )
                }
              )
            )
            
          )}
        </ul>
      )}

      <div className="absolute text-xs text-red-600 left-0 px-6 top-[68px]">
        {error.set && error.message}
      </div>
    </div>
  );
};

export default TripSearch;



const extractAndFormatDate = (inputString) => {
  const datePattern = /(\d{1,2})(st|nd|rd|th) (\w{3})/;
  const match = inputString.match(datePattern);

  if (match) {
    const [, day, suffix, month] = match;
    return (
      <>
        {day}
        <span className="align-super text-xs">{suffix}</span> {month}
      </>
    );
  }

  return null;
};

