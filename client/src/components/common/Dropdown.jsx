import React, { useState } from 'react';
import { titleCase } from '../../utils/handyFunctions';

const Dropdown = ({icon , label , options,htmlFor,id ,name , onChange}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  

 

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (value) => {
    setSelectedOption(value);
    setIsOpen(false);
    if (onChange) {
      onChange(value);
    }
  };

  

  return (
    <>
      <label htmlFor={htmlFor} className="font-medium text-gray-400 font-cabin  leading-normal text-[14px]">
        {label}
      </label>
      <div className="flex w-full h-full mt-[6px] bg-white-100 rounded-md">
        <button
          onClick={toggleDropdown}
          type="button"
          className="flex justify-between items-center w-full rounded-md border-[1px] border-solid border-gray-600 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:border-purple-500 focus:border-purple-500"
          id="options-menu"
          aria-haspopup="listbox"
          aria-expanded="true"
        >
          <div className='truncate'>
          {titleCase(selectedOption || options[0])}
          {/* {titleCase(selectedOption || "Select")} */}
          </div>
          <img src={icon} className="ml-2" alt="Dropdown Icon" />
        </button>
      </div>

      {isOpen && (
        <div className="relative w-full h-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40">
          <div
            className="py-1 h-36 overflow-auto "
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
            id={id}
            name={name}
          >
            {options.map((value, index) => (
              <div
                key={index}
                onClick={() => selectOption(value)}
                className="px-4 py-2  text-sm text-gray-700 hover:bg-indigo-500 hover:text-white cursor-pointer bg-white-100 "
                role="menuitem"
              >
                {titleCase(value)}
              </div>
            ))}
          </div>
        </div>
      )}
      
    </>
  );
};

export default Dropdown;
