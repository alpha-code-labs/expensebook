import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../../api/DataProvider';
import {  NavLink } from 'react-router-dom';
import { filterTravelRequests} from '../../utils/handyFunctions';

import {arrow1_icon, receipt, house_simple, airplane_1, money, logo_with_text, airplane, house_simple_1, money1, airplane_icon1, receipt_icon1, setting_icon, setting_icon1, businessAdmin_icon, businessAdmin1_icon, approval_icon, approval_w_icon, cancel_round, cancel, down_arrow, arrow_left, up_arrow, straight_arrow_icon, report_icon, report_white_icon } from '../../assets/icon';


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
        const data = employeeData && employeeData?.dashboardViews?.employee;
        const approvalData = employeeData && employeeData?.dashboardViews?.employeeManager;
        const businessAdminData = employeeData && employeeData?.dashboardViews?.businessAdmin;
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
            filteredTrApprovalData = approvalData?.travelAndCash?.filter(item => ['approved', 'pending approval', 'upcoming', 'intransit','booked'].includes(item?.travelRequestStatus));
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
            paidAndCancelledTrips: businessAdminData?.paidAndCancelled || 0
        }));
    }, [employeeData]);

    console.log('travelRequestsCount', countData?.travelRequests);
    console.log('rejectedTravelRequestsCount', countData?.rejectedTravelRequests);
    console.log('rejectedCashAdvancesCount', countData?.rejectedCashAdvances);
    console.log('approvalTravelCount', countData?.trApproval);
    console.log('approvalExpenseCount', countData?.expApproval);
    console.log('pendingBookingCount', countData?.pendingBooking);

   

    const sidebarItems = [
        { label: 'Overview', icon: house_simple, icon1: house_simple_1, url: 'overview', count: '' },
        { label: 'Trip', icon: airplane_1, icon1: airplane_icon1, url: 'trip', count: countData?.rejectedTravelRequests },
        { label: 'Cash-Advance', icon: money, icon1: money1, url: 'cash-advance', count: countData?.rejectedCashAdvances },
        { label: 'Expense', icon: receipt, icon1: receipt_icon1, url: 'expense', count: "" },
        { label: 'Report', icon: report_icon, icon1: report_white_icon, url: 'report', count: "" },
    ];

    if (employeeRoles) {

        if (employeeRoles?.employeeRoles?.employeeManager) {
            sidebarItems.push({ label: 'Approval', icon: approval_icon, icon1: approval_w_icon, url: 'approval', count: (countData?.trApproval + countData?.trExpApproval + countData?.nonTrExpApproval + countData?.itineraryApproval || 0) });
        }

        if (employeeRoles?.employeeRoles?.businessAdmin) {
            sidebarItems.push({ label: 'Bookings', icon: businessAdmin_icon, icon1: businessAdmin1_icon, url: 'bookings', count: (countData?.pendingBooking + countData?.paidAndCancelledTrips) });
        }

        if (employeeRoles?.employeeRoles?.finance) {
            sidebarItems.push({ label: 'Settlement', icon: money, icon1: money1, url: 'settlement', count: "" });
        }

        if (employeeRoles?.employeeRoles?.superAdmin) {
            sidebarItems.push({ label: 'Configure', icon: setting_icon, icon1: setting_icon1, url: 'configure', count: "" });
        }
        
    }
   

    return (
        <div className={` border-r border-indigo-600    min-h-screen h-full   bg-indigo-50   left-[0px] flex flex-col items-start justify-start`}>
            <div className='flex flex-row justify-between items-center w-full px-2 '>
                <div className='h-16'>
                <img
                className="w-[140px] h-16"
                alt=""
                src={logo_with_text}
            />
                </div>
           
            <div onClick={()=>setSidebarOpen(true)} className='md:hidden block hover:bg-indigo-100 rounded-full p-2'>
            <img src={arrow1_icon} className='w-4 h-4 rotate-180'/>
            </div>
            
            </div>
            <nav className='w-full'>
            {sidebarItems.map((item, index) => (
                
                <NavLink
                   
                    to={`${item.url.toLowerCase()}`}
                    key={index}
                    
                    className={`w-full   ${pathname === item.url ? 'bg-purple-500 text-white' : "text-indigo-600"} overflow-hidden flex flex-col items-start justify-start   box-border cursor-pointer`}
                >
                    <div className="flex flex-row items-center justify-between px-3 py-3 w-full ">
                        <div className='flex gap-2 items-center'>
                       
                        <img src={pathname === item.url ? item.icon1 : item.icon} alt={item.label} className='min-w-4 min-h-4 h-4 w-4' />
                        <div className={`   relative  tracking-[0.02em] w-auto md:w-[140px] font-inter  font-medium`} >
                            {item?.label}
                        </div>
                        </div>
                        {item?.count > 0 &&
                             <div className={`${pathname === item.url ? 'text-purple-500 bg-white font-semibold' : "text-white "} w-6 h-6 flex font-inter rounded-full bg-indigo-600 items-center justify-center float-right text-xs font-medium `}>
                                 <p className=''> {item?.count}</p>
                         </div>} 
                    </div>
                </NavLink>
       
                
            ))}
            </nav>
        </div>
    );
}

export default Sidebar;

