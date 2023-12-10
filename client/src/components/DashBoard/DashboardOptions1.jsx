import React from "react";
import { Airplane01, HouseSimple01, Money01, frame505, receipt01 } from "../../assets/icon";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DashboardOptions1 = () => {
const navigate = useNavigate();
const [selectedOption, setSelectedOption] = useState('Overview'); 

    const redirectToTravel = () => {
      navigate('/TravelRequest');
      setSelectedOption('Travel Requests & Cash Advances');
    }
  
    const redirectToExpense = () => {
      navigate('/travelExpenseApproval');
      setSelectedOption('Expenses');
    }
  
    const redirectToApprovals = () => {
      navigate('/');
      setSelectedOption('Overview');
    }

    return (
      <div className="absolute top-[0px] left-[0px] text-eb-primary-blue-500 text-[#7C7C7C] bg-white w-[244px] h-[833px] overflow-hidden">
        <img className="absolute top-[37px] left-[20px] w-[149px] h-10 overflow-hidden" alt="" src={frame505} />
        <div className="absolute top-[76px] left-[0px] flex flex-col items-start justify-start gap-[2px]">
          <div className="self-stretch overflow-hidden flex flex-col items-start justify-start py-6 px-4 text-eb-primary-blue-500">
            <div className="flex flex-row items-center justify-start gap-[12px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src={HouseSimple01}
              />
              <div
                className={`relative tracking-[0.02em] whitespace-nowrap cursor-pointer rounded-xl ${selectedOption === 'Overview' ? 'bg-eb-primary-blue-500 text-white' : 'text-[#7C7C7C]'}`}
                onClick={redirectToApprovals}
              >
                Overview
              </div>
            </div>
          </div>
          <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
            <div className="flex flex-row items-center justify-start gap-[12px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
                alt=""
                src={Airplane01}
              />
              <div
                className={`relative cursor-pointer rounded-xl ${selectedOption === 'Travel Requests & Cash Advances' ? 'text-eb-primary-blue-500 bg-white' : 'text-[#7C7C7C]'}`}
                onClick={redirectToTravel}
              >
                Travel Requests & Cash Advances
              </div>
            </div>
          </div>
          <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
            <div className="flex flex-row items-center justify-start gap-[12px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
                alt=""
                src={Money01}
              />
              <div
                className={`relative tracking-[0.02em] whitespace-nowrap cursor-pointer rounded-xl ${selectedOption === 'Expenses' ? 'text-eb-primary-blue-500 bg-white' : 'text-[#7C7C7C]'}`}
                onClick={redirectToExpense}
              >
                Expenses
              </div>
            </div>
            </div>
            <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
            <div className="flex flex-row items-center justify-start gap-[12px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
                alt=""
                src={receipt01}
              />
              <div
                className={`relative tracking-[0.02em]  whitespace-nowrap cursor-pointer rounded-xl ${selectedOption === 'Approvals' ? 'text-eb-primary-blue-500 bg-white' : 'text-[#7C7C7C]'}`}
                onClick={redirectToApprovals}
              >
                Approvals
              </div>
            </div>
            </div>
          </div>
        </div>
    );
}

export default DashboardOptions1;
