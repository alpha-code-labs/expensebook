import React, { useState, useEffect, useRef } from 'react';
import { briefcase } from '../../assets/icon';

const TripSearch = ({ data, onSelect, title, error, placeholder }) => {
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

  return (
    <div className="relative h-[73px]" ref={dropdownRef}>
      <div className="text-zinc-600 text-sm font-cabin text-start pb-2">{title}</div>
      <div className="rounded-md text-base bg-white box-border flex flex-row items-center justify-start py-3 px-4 border-[1px] border-solid hover:border-indigo-600 border-ebgrey-200">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="relative tracking-[0.01em] text-sm text-neutral-700 placeholder:text-zinc-400 font-cabin placeholder:text-sm outline-none border-none w-full focus-visible:outline-0 focus-visible:border-indigo-600"
          onFocus={() => setIsDropdownOpen(true)}
        />
      </div>
      {isDropdownOpen && (
        <ul className="absolute left-0 w-full bg-white-100 border border-slate-300 rounded-b-md shadow-lg max-h-60 overflow-y-auto mt-0 z-10">
          {loading ? (
            <li className="p-2 text-center text-gray-500">loading...</li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option.travelRequestId || option.tripId}
                onClick={() => handleSelect(option)}
                className={`flex justify-between p-2 border-b border-slate-300 cursor-pointer ${highlightedIndex === index ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              >
                <div className='flex-1 flex flex-col justify-center items-start'>
                  <div className='font-medium text-sm font-cabin text-neutral-400'>{option.travelRequestNumber ? "Travel Request No." : "Trip No."}</div>
                  <div className='text-sm font-cabin text-start text-neutral-700'>{option.travelRequestNumber || option.tripNumber}</div>
                </div>

                <div className='flex-1 flex gap-2 items-center '>
                  <img src={briefcase} className='w-4 h-4'/>
                  <div className='font-medium font-cabin text-md uppercase text-neutral-700'>
                    {option.tripName}
                  </div>
                </div>
              </li>
            ))
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

