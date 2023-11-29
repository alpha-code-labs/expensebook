import React from 'react';
import { Link } from 'react-router-dom';
import { receipt,
    house_simple,
    airplane_1,
    money,
    briefcase,
    bell,
    logo_with_text} from '../../assets/icon'

const Sidebar = () => {

   const sidebarItmes=[
        {
            label:"Overview",
            icon:""
        },
        {
            label:"Travel",
            icon:""
        },
        {
            label:"Cash Advance",
            icon:""
        },
        {
            label:"Expense",
            icon:""
        },
        {
            label:"Approvals",
            icon:""
        }

    ]

  return (
    <div className='lg:block hidden bg-white w-64  fixed rounded-none border-none '>
    <div className="absolute top-[0px] left-[0px] bg-gray-A100  w-[244px] h-[845px] overflow-hidden ">
    <div className="absolute top-[76px] left-[0px] flex flex-col items-start justify-start gap-[2px]">
      <div className="self-stretch overflow-hidden flex flex-col items-start justify-start py-3 px-4 active:bg-purple-50 focus:bg-purple-50">
        <div className="flex flex-row items-center justify-start gap-[12px] ">
          
          <img
            className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
            alt=""
            src={house_simple}
          />
          <div className="relative tracking-[0.02em]"> <Link to="/">Overview </Link> </div>
       
        </div>
      </div>
      <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border text-purple-500">
        <div className="flex flex-row items-center justify-start gap-[12px]">
          
          <img
            className="relative w-4 h-4 overflow-hidden shrink-0"
            alt=""
            src={airplane_1}
          />
          <b className="relative tracking-[0.02em]"> <Link to="/travel">Travel</Link> </b>
         
        </div>
      </div>
      <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
        <div className="flex flex-row items-center justify-start gap-[12px]">
          <img
            className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
            alt=""
            src={money}
          />
          <div className="relative tracking-[0.02em]"><Link to="/cash-advance">Cash Advances</Link>  </div>
        </div>
      </div>
      <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
        <div className="flex flex-row items-center justify-start gap-[12px]">
          <img
            className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
            alt=""
            src={receipt}
          />
          <div className="relative tracking-[0.02em]"><Link to="/expense">Expenses</Link></div>
        </div>
      </div>
      <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
        <div className="flex flex-row items-center justify-start gap-[12px]">
          <img
            className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
            alt=""
            src={receipt}
          />
          <div className="relative tracking-[0.02em]"><Link to="/approval">Approvals</Link></div>
        </div>
      </div>
      <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
        <div className="flex flex-row items-center justify-start gap-[12px]">
          <img
            className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
            alt=""
            src={receipt}
          />
          <div className="relative tracking-[0.02em]"><Link to="/settlement">Settlement</Link></div>
        </div>
      </div>
      <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
        <div className="flex flex-row items-center justify-start gap-[12px]">
          <img
            className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
            alt=""
            src={receipt}
          />
          <div className="relative tracking-[0.02em]"><Link to="booking">Bookings</Link></div>
        </div>
      </div>
    </div>


    <img
      className="absolute top-[26px] left-[20px] w-[160px]"
      alt=""
      src={logo_with_text}
    />
  </div>
  </div>
  )
}

export default Sidebar
