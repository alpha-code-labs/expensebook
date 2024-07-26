import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useData } from '../../api/DataProvider';
import { Link } from 'react-router-dom';
import { filterTravelRequests} from '../../utils/handyFunctions';
import { receipt, house_simple, airplane_1, money, logo_with_text, airplane, house_simple_1, money1, airplane_icon1, receipt_icon1, setting_icon, setting_icon1, businessAdmin_icon, businessAdmin1_icon, approval_icon, approval_w_icon } from '../../assets/icon';


const Sidebar = ({ fetchData }) => {
    const [open, setOpen] = useState(true);
    let tenantId;
    let empId;
    const getPageNo = localStorage.getItem('pageNo');
    console.log('page', getPageNo);
    if (!tenantId && !empId) {
        const retrievedTenantId = localStorage.getItem('tenantId');
        const retrievedEmpId = localStorage.getItem('empId');
        tenantId = retrievedTenantId;
        empId = retrievedEmpId;
    }

    const { employeeRoles, employeeData } = useData();
    console.log('employee roles from sidebar', employeeRoles?.employeeRoles);

    const location = useLocation();
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
            console.log('filter travel requests sidebar', filteredTravelRequests);
        }
        //business admin > pending booking
        let filteredPendingBookingData;
        if (businessAdminData) {
            let filteredPendingBookings = filterTravelRequests(businessAdminData?.pendingBooking);
            filteredPendingBookingData = filteredPendingBookings;
            console.log('filter pending booking sidebar', filteredPendingBookings);
        }
        let filteredTrApprovalData;
        if (approvalData) {
            filteredTrApprovalData = approvalData?.travelAndCash?.filter(item => ['approved', 'pending approval', 'upcoming', 'intransit'].includes(item?.travelRequestStatus));
        }

        setCountData(prevStates => ({
            ...prevStates,
            travelRequests: filteredData?.length || 0,
            rejectedTravelRequests: data?.rejectedTravelRequests?.length || 0,
            rejectedCashAdvances: data?.rejectedCashAdvances?.length || 0,
            //employee manager
            trApproval: filteredTrApprovalData?.length || 0,
            expApproval: approvalData?.travelExpenseReports?.length || 0,
            //business admin
            pendingBooking: filteredPendingBookingData?.length || 0
        }));
    }, [employeeData]);

    console.log('travelRequestsCount', countData?.travelRequests);
    console.log('rejectedTravelRequestsCount', countData?.rejectedTravelRequests);
    console.log('rejectedCashAdvancesCount', countData?.rejectedCashAdvances);
    console.log('approvalTravelCount', countData?.trApproval);
    console.log('approvalExpenseCount', countData?.expApproval);
    console.log('pendingBookingCount', countData?.pendingBooking);

    const [activeIndex, setActiveIndex] = useState(getPageNo ? parseInt(getPageNo) : 0);
    console.log('activeindex', activeIndex);

    const handleItemClick = (index) => {
        setActiveIndex(index);
        localStorage.setItem('pageNo', index);
    };

    const sidebarItems = [
        { label: 'Overview', icon: house_simple, icon1: house_simple_1, url: '', count: '' },
        { label: 'Trip', icon: airplane_1, icon1: airplane_icon1, url: '', count: countData?.rejectedTravelRequests },
        { label: 'Cash-Advance', icon: money, icon1: money1, url: '', count: countData?.rejectedCashAdvances },
        { label: 'Expense', icon: receipt, icon1: receipt_icon1, url: '', count: "" },
    ];

    if (employeeRoles) {

        if (employeeRoles?.employeeRoles?.employeeManager) {
            sidebarItems.push({ label: 'Approval', icon: approval_icon, icon1: approval_w_icon, url: '', count: (countData?.trApproval + countData?.expApproval) });
        }

        if (employeeRoles?.employeeRoles?.businessAdmin) {
            sidebarItems.push({ label: 'Bookings', icon: businessAdmin_icon, icon1: businessAdmin1_icon, url: '', count: countData?.pendingBooking });
        }

        if (employeeRoles?.employeeRoles?.finance) {
            sidebarItems.push({ label: 'Settlement', icon: money, icon1: money1, url: '', count: "" });
        }

        if (employeeRoles?.employeeRoles?.superAdmin) {
            sidebarItems.push({ label: 'Configure', icon: setting_icon, icon1: setting_icon1, url: '', count: "" });
        }
        
    }

    return (
        <div className={`lg:w-full w-auto  min-h-screen h-full   bg-indigo-50   left-[0px] flex flex-col items-start justify-start  `}>
            <div>
            <img
                className="w-[160px] pl-4 py-4 hidden sm:block  "
                alt=""
                src={logo_with_text}
            />
            </div>
            
            {sidebarItems.map((item, index) => (
                <Link
                    to={`${tenantId}/${empId}/${item.label.toLowerCase().replace(' ', '-')}`}
                    key={index}
                    onClick={() => handleItemClick(index)}
                    className={`w-full   ${activeIndex === index ? 'bg-purple-500 text-white-100' : ""} overflow-hidden flex flex-col items-center sm:items-start justify-start   box-border cursor-pointer`}
                >
                    <div className="flex sm:flex-row flex-col items-center justify-between px-3 py-3 gap-2 md:gap-0">
                        <div className='flex gap-2'>
                        <img src={activeIndex === index ? item.icon1 : item.icon} className='min-w-4 min-h-4 h-4 w-4' />
                        <div className={` ${activeIndex === index ? 'text-white-100' : 'text-indigo-800'} relative hidden lg:block tracking-[0.02em] w-auto md:w-[140px] font-inter  font-medium`} >
                            {item?.label}
                        </div>
                        </div>
                        {item?.count > 0 &&
                            <div className={`${activeIndex === index ? 'text-purple-500 bg-white-100 font-semibold' : "text-white-100 "} w-6 h-6 flex font-inter rounded-full bg-indigo-600 items-center justify-center float-right text-xs font-medium `}>
                                <p className=''> {item?.count}</p>
                        </div>} 
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default Sidebar;
