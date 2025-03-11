import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../../api/DataProvider';
import {  NavLink } from 'react-router-dom';
import { filterTravelRequests} from '../../utils/handyFunctions';

import {chevron_down,arrow1_icon, receipt, house_simple, airplane_1, money, logo_with_text, airplane, house_simple_1, money1, airplane_icon1, receipt_icon1, setting_icon, setting_icon1, businessAdmin_icon, businessAdmin1_icon, approval_icon, approval_w_icon, cancel_round, cancel, down_arrow, arrow_left, up_arrow, straight_arrow_icon, report_icon, report_white_icon, company_icon, overview_white_icon, trip_white_icon, cash_white_icon, expense_white_icon, approval_white_icon, booking_white_icon, configure_white_icon, configure_black_icon, trip_black_icon, overview_black_icon, cash_black_icon, expense_black_icon, report_black_icon, approval_black_icon, booking_black_icon } from '../../assets/icon';


const Sidebar = ({setSidebarOpen }) => {
   
    const location = useLocation();
    const pathname = location?.pathname?.split('/').pop()
    console.log('path name', location?.pathname?.split('/').pop())
    const { employeeRoles, employeeData } = useData();


    const [countData, setCountData] = useState({
        travelRequests: 0,
        rejectedTravelRequests: 0,
        rejectedCashAdvances: 0
    });

    useEffect(() => {
        const data = employeeData?.dashboardViews?.employee;
        const approvalData = employeeData?.dashboardViews?.employeeManager;
        const businessAdminData =  employeeData?.dashboardViews?.businessAdmin;
        const settlementCount = employeeData?.dashboardViews?.finance;
        console.log('approvalData', approvalData);
        // Filtered travelRequests array
        let filteredData;

        if (data) {
            let filteredTravelRequests = filterTravelRequests(data?.travelRequests);
            filteredData = filteredTravelRequests;
        }
        //business admin > pending booking
        let filteredPendingBookingData;
        if (businessAdminData) {
            let filteredPendingBookings = filterTravelRequests(businessAdminData?.pendingBooking);
            filteredPendingBookingData = filteredPendingBookings;
           
        }
        let filteredTrApprovalData;
        if (approvalData) {
            filteredTrApprovalData = approvalData?.travelAndCash?.filter(item => ['approved','pending booking', 'pending approval', 'upcoming', 'intransit','booked'].includes(item?.travelRequestStatus));
        }
        setCountData(prevStates => ({
            ...prevStates,
            travelRequests: filteredData?.length || 0,
            rejectedTravelRequests: data?.rejectedTravelRequests?.length || 0,
            rejectedCashAdvances: data?.rejectedCashAdvances?.length || 0,
            //employee manager
            itineraryApproval:approvalData?.trips?.length || 0,
            trApproval: filteredTrApprovalData?.length || 0,
            trExpApproval: approvalData?.travelExpenseReports?.length || 0,
            nonTrExpApproval :approvalData?.nonTravelExpenseReports?.length || 0,
            //business admin
            pendingBooking: filteredPendingBookingData?.length || 0,
            paidAndCancelledTrips: businessAdminData?.paidAndCancelled || 0,
            //finance
            settlement:settlementCount
        }));
    }, [employeeData]);

    console.log('travelRequestsCount', countData?.travelRequests);
    console.log('rejectedTravelRequestsCount', countData?.rejectedTravelRequests);
    console.log('rejectedCashAdvancesCount', countData?.rejectedCashAdvances);
    console.log('approvalTravelCount', countData?.trApproval);
    console.log('approvalExpenseCount', countData?.expApproval);
    console.log('pendingBookingCount', countData?.pendingBooking);

   

    const sidebarItems = [
        { label: 'Overview', icon: overview_black_icon, icon1: overview_white_icon, url: 'overview', count: '' },
        { label: 'Trip', icon: trip_black_icon, icon1: trip_white_icon, url: 'trip', count: countData?.rejectedTravelRequests },
        { label: 'Cash-Advance', icon: cash_black_icon, icon1: cash_white_icon, url: 'cash-advance', count: countData?.rejectedCashAdvances },
        { label: 'Expense', icon: expense_black_icon, icon1: expense_white_icon, url: 'expense', count: "" },
        { label: 'Report', icon: report_black_icon, icon1: report_white_icon, url: 'report', count: "" },
    ];

    if (employeeRoles) {

        if (employeeRoles?.employeeRoles?.employeeManager) {
            sidebarItems.push({ label: 'Approval', icon: approval_black_icon, icon1: approval_white_icon, url: 'approval', count: (countData?.trApproval + countData?.trExpApproval + countData?.nonTrExpApproval + countData?.itineraryApproval || 0) });
        }

        if (employeeRoles?.employeeRoles?.businessAdmin) {
            sidebarItems.push({ label: 'Bookings', icon: booking_black_icon, icon1: booking_white_icon, url: 'bookings', count: (countData?.pendingBooking + countData?.paidAndCancelledTrips) });
        }

        if (employeeRoles?.employeeRoles?.finance) {
            sidebarItems.push({ label: 'Settlement', icon: cash_black_icon, icon1: cash_white_icon, url: 'settlement', count: countData?.settlement });
        }

        if (employeeRoles?.employeeRoles?.superAdmin) {
            sidebarItems.push({ label: 'Configure', icon: configure_black_icon, icon1: configure_white_icon, url: 'configure', count: "" });
        }
        
    }
   

    return (
        <div className={` min-h-screen h-full  bg-gray-50 border-r-2 border-slate-200  left-[0px] flex flex-col items-start justify-start  `}>
            <div className='flex flex-row justify-between items-center w-full px-2 '>
                <div className='h-16'>
                <img
                className="w-[140px] h-16"
                alt=""
                src={logo_with_text}
            />
                </div>
            <div onClick={()=>setSidebarOpen(true)} className='md:hidden block hover:bg-indigo-100 rounded-full p-2'>
            <img src={chevron_down} className='w-5 h-5 rotate-90'/>
            </div>
            
            </div>
            <div className='flex flex-col justify-between h-full'>
            <nav className='w-full px-2'>
            {sidebarItems.map((item, index) => (
                
                <NavLink
                   
                    to={`${item.url.toLowerCase()}`}
                    key={index}
                    
                    className={`w-full   ${pathname === item.url ? 'bg-gray-200/10 text-neutral-900 font-semibold  ' : "text-neutral-700"} overflow-hidden flex flex-col items-start justify-start  rounded-md  box-border cursor-pointer`}
                >
                    <div className="flex flex-row items-center justify-between px-3  py-3 w-full ">
                        <div className='w-[150px] inline-flex gap-2 items-center  shrink-0 '>
                       
                        <img src={ item.icon1} alt={item.label} className='shrink-0 h-4 w-4' />
                        <div className={` relative inline-flex truncate  tracking-[0.02em] w-full  font-inter  `} >
                            {item?.label}
                        </div>
                        <div className={`${pathname === item.url ? 'text-neutral-900 bg-white font-semibold' : "text-neutral-900 "} ${item?.count > 0 ? 'block ': 'hidden '} w-9 border border-slate-300 h-6 flex font-inter rounded-full bg-gray-100 items-center justify-center float-right text-xs font-medium `}>
                                 <p className=''> {item?.count}</p>
                         </div>
                       
                        </div>
                       
                       
                    </div>
                </NavLink>
       
                
            ))}
            </nav>
            <div className='flex gap-1 items-center justify-start bg-slate-100  p-2  rounded-sm shadow-md'>
        <img src={company_icon} className='w-5 h-5' />
        <p className=" font-inter  text-medium font-medium text-neutral-700  capitalize ">{employeeRoles?.employeeInfo?.tenantName}</p>
        </div>
           
            </div>
           
        </div>
    );
}

export default Sidebar;

