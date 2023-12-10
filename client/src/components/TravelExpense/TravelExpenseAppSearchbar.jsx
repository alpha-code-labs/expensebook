import React from 'react';

const TravelExpenseSearchBar = () => {
  return (
    <div className="flex flex-row space-x-2">
      <div className="rounded-md bg-white box-border w-[206px] h-[31px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Trip Name"
            className="w-full border-none outline-none"
          />
        </div>
      </div>
      <div className="rounded-md bg-white box-border w-[206px] h-[31px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by destination"
            className="w-full border-none outline-none"
          />
        </div>
      </div>
      <div className="rounded-md bg-white box-border w-[206px] h-[31px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by employee name"
            className="w-full border-none outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export default TravelExpenseSearchBar;
