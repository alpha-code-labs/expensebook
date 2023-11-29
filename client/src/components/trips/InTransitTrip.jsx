import React from 'react';
import { calender, double_arrow, cab, location, intransit_trip } from '../../assets/icon';

export const InTransitContent = ({ travelName, from, to, departureDate, returnDate }) => (
  <div>
    <div className="absolute top-[72px] left-[23px] flex flex-row items-start justify-start gap-[16px] text-sm text-darkslategray">
      <div className="flex flex-row items-start justify-start">
        <div className="flex flex-col items-start justify-start gap-[12px]">
          <div className="relative tracking-[0.03em] font-medium">{travelName}</div>
          <div className="flex flex-col items-start justify-start gap-[16px] text-xs text-dimgray">
            <div className="flex flex-row items-end justify-start gap-[8px]">
              <div className="relative">{from}</div>
              <img className="relative w-4 h-4 overflow-hidden shrink-0" alt="" src={double_arrow} />
              <div className="relative">{to}</div>
            </div>
            <div className="flex flex-row items-end justify-start gap-[4px]">
              <img className="relative w-4 h-4 overflow-hidden shrink-0" alt="" src={calender} />
              <div className="flex flex-row items-start justify-start gap-[8px]">
                <div className="relative">{departureDate}</div>
                <div className="relative">to</div>
                <div className="relative">{returnDate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[201px] flex flex-row items-start justify-start gap-[16px] text-center text-purple-500"></div>
      {/* ///button */}
      <div className="absolute float-right ml-[165px] w-[400px] flex flex-row items-start justify-start gap-[16px] text-center text-purple-500">
       <div className='w-[120px]'>
        <ActionButton label="Book Expense" />
        </div>
        <div className='w-[85px]'>
        <ActionButton label="View Trip" />
        </div>
      </div>
      {/* ///button */}
    </div>
    <div className="absolute top-[165px] left-[23px] rounded-xl bg-purple-300 w-[399px] h-[93px] overflow-hidden text-xs text-gray-900">
      <div className="absolute top-[12px] left-[24px]">2:00 PM</div>
      <div className="absolute top-[35px] left-[24px] text-base">Cab Booking</div>
      
      <div className='ml-6'>
      <InfoRow icon={location} text="LnT Office Building, Gurugram" />
      </div>

      <div className='ml-[211px]'>
      <InfoRow icon={cab} text="Cab Number: DL-02-0123" />
      </div>
      
      
      
      
     
    </div>
  </div>
);

export const NoInTransitContent = () => (
  <div className="absolute flex flex-row self-stretch top-[72px] left-[23px] items-start justify-start gap-[16px] text-sm">
    <img src={intransit_trip} alt="NoTrip" />
    <div className="absolute top-[140px] w-[191px] flex flex-col justify-center items-start gap-4 text-gray-400">
      <div className="flex flex-col items-start justify-center">
        <div className="tracking-[0.02em]">No trips in transit right now</div>
      </div>
      {/* <ActionButton label="View previous" /> */}
      <div className="rounded-lg h-8 flex flex-row items-center justify-center py-4 px-0 box-border text-center text-sm text-gray-400">
        <b className="relative tracking-[0.02em]">View previous</b>
       </div>
    </div>
  </div>
);

const ActionButton = ({ label }) => (
  <div className="rounded-[32px] w-full box-border h-[33px] flex flex-row items-center justify-center py-4 px-4 relative cursor-pointer border-[1px] border-solid border-purple-500">
    <div className="absolute top-[8px] left-[16px] font-medium z-[0]">{label}</div>
  </div>
);

const InfoRow = ({ icon, text }) => (
  <div className="absolute top-[62px]  flex flex-row items-center justify-start gap-[4px]">
    <img className="relative w-4 h-4 overflow-hidden shrink-0" alt="" src={icon} />
    <div className="relative">{text}</div>
  </div>
);

