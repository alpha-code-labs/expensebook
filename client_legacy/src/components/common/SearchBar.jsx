import React from "react";

const SearchBar = ({ searchType, handleSearchTypeChange, searchTerm, handleSearchChange }) => {
  return (
    <div className="absolute top-[67px] left-[36px] flex flex-row items-center justify-between gap-[24px] text-justify text-xs text-ebgrey-400">
      <div
        className={`rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-between py-2 px-4 border-[1px] border-solid border-ebgrey-200 ${
          searchType === "destination" ? "bg-blue-200" : ""
        }`}
        onClick={() => handleSearchTypeChange("destination")}
      >
        <div className="relative">Search by destination</div>
      </div>
      <div
          className={`rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-between py-2 px-4 border-[1px] border-solid border-ebgrey-200 ${
            searchType === "employeeName" ? "bg-blue-200" : ""
          }`}
          onClick={() => handleSearchTypeChange("employeeName")}
        >
          <div className="relative">Search by employee name</div>
       </div>
      <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-between py-2 px-4 border-[1px] border-solid border-ebgrey-200">
        <input
          type="text"
          placeholder={`Search by ${searchType === "destination" ? "destination" : searchType}`}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;
