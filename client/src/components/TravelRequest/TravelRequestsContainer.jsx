import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TravelRequestComponent from "./TravelRequestComponent";
import TravelAndCashSearchBar from "./TravelAndCashSearchBar";

const TravelRequestsContainer = () => {
  const navigate = useNavigate();

  // Redirect to TR Details
  const redirectToTRDetails = (id) => {
    navigate(`/trDetails/${id}`);
  };

  return (
    <div className="relative rounded-2xl bg-white box-border w-[912px] h-[439px] overflow-hidden shrink-0 text-base text-black border-[1px] border-solid border-gainsboro-200">
      <div className="absolute top-[20px] left-[36px]">Travel Requests & Cash Advances</div>
      <TravelAndCashSearchBar/>
      <div className="overflow-y-auto" style={{ maxHeight: "calc(100% - 109px)" }}>
        <TravelRequestComponent />
      </div>
    </div>
  );
};

export default TravelRequestsContainer;




{/* <div className="absolute top-[67px] left-[36px] flex flex-row items-center justify-start gap-[24px] text-justify text-xs text-ebgrey-400">
        <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
          <div className="relative">Search Trip Name</div>
        </div>
        <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
          <div className="relative">Search by destination</div>
        </div>
        <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
          <div className="relative">Search by employee name</div>
        </div>
      </div> */}