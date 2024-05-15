import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useData } from '../../api/DataProvider';
import { Link } from 'react-router-dom';
import { filterTravelRequests, urlRedirection } from '../../utils/handyFunctions';
import axios from 'axios';
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
        { label: 'Travel', icon: airplane_1, icon1: airplane_icon1, url: '', count: countData?.rejectedTravelRequests },
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
        <div className={`  lg:w-full w-auto  min-h-screen h-full   bg-indigo-50   left-[0px] flex flex-col items-start justify-start  `}>
            <img
                className="w-[160px] pl-4 py-4"
                alt=""
                src={logo_with_text}
            />
            {sidebarItems.map((item, index) => (
                <Link
                    to={`${tenantId}/${empId}/${item.label.toLowerCase().replace(' ', '-')}`}
                    key={index}
                    onClick={() => handleItemClick(index)}
                    className={`w-full   ${activeIndex === index ? 'bg-purple-500 text-white-100' : ""} overflow-hidden flex flex-col items-center sm:items-start justify-start py-3 px-4 box-border cursor-pointer`}
                >
                    <div className="flex flex-row items-center justify-start gap-2 ">
                        <img src={activeIndex === index ? item.icon1 : item.icon} className='min-w-4 min-h-4 h-4 w-4' />
                        <div className={` ${activeIndex === index ? 'text-white-100' : 'text-indigo-800'} relative hidden lg:block tracking-[0.02em] w-auto md:w-[150px] font-inter  font-medium`} >
                            {item?.label}
                        </div>
                        {item?.count > 0 &&
                            <div className={`${activeIndex === index ? 'text-purple-500 bg-white-100 font-semibold' : "text-white-100 "} w-6 h-6 flex font-inter rounded-full bg-indigo-600  items-center justify-center float-right  text-xs  font-medium `}>
                                <p className=''> {item?.count}</p>
                        </div>}
                            


                    </div>
                </Link>
            ))}
        </div>
    );
}

export default Sidebar;


// import React, { useState,useEffect } from 'react';
// import { useLocation ,useParams} from 'react-router-dom';
// import { useData } from '../../api/DataProvider';
// import { Link } from 'react-router-dom';
// import { receipt, house_simple, airplane_1, money, logo_with_text, airplane, house_simple_1, money1, airplane_icon1, receipt_icon1, setting_icon, setting_icon1, businessAdmin_icon, businessAdmin1_icon, approval_icon, approval_w_icon } from '../../assets/icon';
// import { filterTravelRequests, urlRedirection } from '../../utils/handyFunctions';

// import axios from 'axios';


//   const Sidebar = ({fetchData}) => {
//     const [open , setOpen]=useState(true);
// let tenantId
// let empId
// const getPageNo = localStorage.getItem('pageNo');
// console.log('page',getPageNo)
//     if(!tenantId && !empId){
//       const retrievedTenantId = localStorage.getItem('tenantId');
//      const retrievedEmpId = localStorage.getItem('empId');
//      tenantId = retrievedTenantId
//      empId = retrievedEmpId

//     }



//   const {employeeRoles , employeeData } = useData();
//   console.log('employee roles from sidebar',employeeRoles?.employeeRoles)

//   const location = useLocation();
//   const [countData , setCountData]=useState({

//     travelRequests: 0,
//     rejectedTravelRequests:0,
//     rejectedCashAdvances:0
    
//   })
  
//   useEffect(()=>{
//     const data = employeeData && employeeData?.dashboardViews?.employee
//     const approvalData = employeeData && employeeData?.dashboardViews?.employeeManager
//     const businessAdminData = employeeData && employeeData?.dashboardViews?.businessAdmin
//     console.log('approvalData',approvalData)
  
//   // Filtered travelRequests array
//   let filteredData
  
//   if(data){
//     let filteredTravelRequests = filterTravelRequests(data?.travelRequests);
//     filteredData=filteredTravelRequests
//     console.log('filter travel requests sidebar',filteredTravelRequests);
//   }
//   //business admin > pending booking
//   let filteredPendingBookingData
//   if(businessAdminData){
//     let filteredPendingBookings = filterTravelRequests(businessAdminData?.pendingBooking);
//     filteredPendingBookingData=filteredPendingBookings
//     console.log('filter pending booking sidebar',filteredPendingBookings);
//   }
//   let filteredTrApprovalData 
//   if(approvalData){
//      filteredTrApprovalData =approvalData?.travelAndCash?.filter(item => ['approved','pending approval', 'upcoming', 'intransit'].includes(item?.travelRequestStatus) )

//   }

//     setCountData(prevStates=>({...prevStates,
//       travelRequests: filteredData?.length || 0,
//       rejectedTravelRequests:data?.rejectedTravelRequests?.length || 0,
//       rejectedCashAdvances:data?.rejectedCashAdvances?.length ||0,
//       //employee manager
//       trApproval:filteredTrApprovalData?.length|| 0,
//       expApproval:approvalData?.travelExpenseReports?.length || 0,
//       //business admin
//       pendingBooking : filteredPendingBookingData?.length || 0

//       }))
//   },[employeeData])
 
//   console.log('travelRequestsCount',countData?.travelRequests)
//   console.log('rejectedTravelRequestsCount',countData?.rejectedTravelRequests)
//   console.log('rejectedCashAdvancesCount',countData?.rejectedCashAdvances)
//   console.log('approvalTravelCount', countData?.trApproval)
//   console.log('approvalExpenseCount', countData?.expApproval)
//   console.log('pendingBookingCount', countData?.pendingBooking)
  

//   // Function to check if the current route is /profile
//   const isProfileRoute = () => location.pathname === '/profile';

//   // Render Sidebar only if the current route is not /profile
//   if (isProfileRoute()) {
//     return null;
//   }


  
//   const [activeIndex , setActiveIndex]=useState(0)
  

//   useEffect(()=>{
//     setActiveIndex(getPageNo)
    

//   },[activeIndex])
//   console.log('activeindex',activeIndex)


//   const sidebarItems = [
//     { label: 'Overview', icon: house_simple , icon1:house_simple_1 , url:'' ,count:''},
//     { label: 'Travel', icon: airplane_1,icon1:airplane_icon1 , url:'' ,count:(countData?.rejectedCashAdvances)},
//     { label: 'Cash-Advance', icon: money,icon1:money1 , url:'' ,count:countData?.rejectedCashAdvances},
//     { label: 'Expense', icon: receipt ,icon1:receipt_icon1 , url:'',count:""},
//   ];


// if(employeeRoles){
//   if (employeeRoles?.employeeRoles?.employeeManager) {
//     sidebarItems.push({ label: 'Approval', icon: approval_icon ,icon1:approval_w_icon ,url:'',count:(countData?.trApproval+ countData?.expApproval)});
//   }

//   if (employeeRoles?.employeeRoles?.businessAdmin ) {
//     sidebarItems.push({ label: 'Bookings', icon: businessAdmin_icon,icon1:businessAdmin1_icon ,url:'',count: countData?.pendingBooking});
//   }

//   if (employeeRoles?.employeeRoles?.finance) {
//     sidebarItems.push({ label: 'Settlement', icon: money,icon1:money1 ,url:'',count:""});
//   }

//   if (employeeRoles?.employeeRoles?.superAdmin) {
   
//     sidebarItems.push({ label: 'Configure', icon: setting_icon, icon1:setting_icon1 , url:'',count:""});
//   }}
//   return (
//     // <div className=''>
      

//         <div className={`  lg:w-full w-auto  min-h-screen h-full   bg-indigo-50   left-[0px] flex flex-col items-start justify-start  `}>
//         <img
//           className="w-[160px] pl-4 py-4"
//           alt=""
//           src={logo_with_text}
//         />
//           {sidebarItems.map((item, index) => (
             
//             <Link to={`${tenantId}/${empId}/${item.label.toLowerCase().replace(' ', '-')}`} key={index} onClick={()=>{setActiveIndex(index);localStorage.setItem('pageNo', index);}} className={`w-full  ${activeIndex===index ? 'bg-purple-500 text-white-100' : ""} overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border cursor-pointer`}>
          
//               <div className="flex flex-row items-center justify-start gap-2 ">
//                 <img src={activeIndex===index ? item.icon1:item.icon} className='w-4 h-4'/>
                
//                 <div className={` ${activeIndex===index ? 'text-white-100':'text-indigo-800'} relative hidden lg:block tracking-[0.02em] w-auto md:w-[150px] font-inter  font-medium`} >
//                   {item?.label}
//                 </div>
//                 {item?.count>0 &&
//                 <div className={`${activeIndex===index ? 'text-purple-500 bg-white-100 font-semibold' : "text-white-100 "} w-6 h-6 flex font-inter rounded-full bg-indigo-600   float-right items-center justify-center text-xs  font-medium `}>
//                     <p > {item?.count}</p>
//                 </div>}
               
                
//               </div>
              
              
           
//             </Link>
          
//           ))}
          
//         </div>
      
//     // </div> 
//     // </div>
//   );
// }

// export default Sidebar;
// // import React, { useState,useEffect } from 'react';
// // import { useLocation ,useParams} from 'react-router-dom';
// // import { useData } from '../../api/DataProvider';
// // import { Link } from 'react-router-dom';
// // import { receipt, house_simple, airplane_1, money, logo_with_text, airplane, house_simple_1, money1, airplane_icon1, receipt_icon1, setting_icon, setting_icon1 } from '../../assets/icon';
// // import { urlRedirection } from '../../utils/handyFunctions';
// // import { CONFIGURATION } from '../../utils/url';
// // import axios from 'axios';


// // const Sidebar = ({employeeRole,tenantId,empId}) => {
// //   const { employeeData } = useData();
// //   const location = useLocation();
// //   const [countData , setCountData]=useState({
// //     travelRequests: 0,
// //     rejectedTravelRequests:0,
// //     rejectedCashAdvances : 0

// //   })
// //   useEffect(()=>{
// //     const data = employeeData && employeeData?.employee

// //     setCountData(prevStates=>({...prevStates,travelRequests: data?.travelRequests.length || 0,
// //       rejectedTravelRequests:data?.rejectedTravelRequests?.length || 0,
// //       rejectedCashAdvances:data?.rejectedCashAdvances?.length ||0}))
// //   },[employeeData])
 
// //   console.log('travelRequestsCount',countData?.travelRequests)
// //   console.log('rejectedTravelRequestsCount',countData?.rejectedTravelRequests)
// //   console.log('rejectedCashAdvancesCount',countData?.rejectedCashAdvances)
  

// //   // Function to check if the current route is /profile
// //   const isProfileRoute = () => location.pathname === '/profile';

// //   // Render Sidebar only if the current route is not /profile
// //   if (isProfileRoute()) {
// //     return null;
// //   }


// //   // const handleFinanceButtonClick = () => {
// //   //   // Replace tenantId and empId with actual values or variables
// //   //   const tenantId = 'yourTenantId';
// //   //   const empId = 'yourEmpId';

// //   //   axios.get(`/backend/api/${tenantId}/${empId}`)
// //   //     .then(function (response) {
// //   //       // Handle successful response
// //   //       const data = response.data;

// //   //       // Redirect to the dashboard microservice with the obtained data
// //   //       window.location.href = '/dashboard?data=' + encodeURIComponent(JSON.stringify(data));
// //   //     })
// //   //     .catch(function (error) {
// //   //       // Handle error
// //   //       console.error('Error fetching data:', error);
// //   //     });
// //   // };
// //   const [activeIndex , setActiveIndex]=useState(0)

  


// //   const sidebarItems = [
// //     { label: 'Overview', icon: house_simple , icon1:house_simple_1 , url:'' ,count:''},
// //     { label: 'Travel', icon: airplane_1,icon1:airplane_icon1 , url:'' ,count:(countData?.travelRequests+ countData?.rejectedCashAdvances)},
// //     { label: 'Cash-Advance', icon: money,icon1:money1 , url:'' ,count:countData?.rejectedCashAdvances},
// //     { label: 'Expense', icon: receipt ,icon1:receipt_icon1 , url:'',count:""},
// //   ];

// //   if (employeeRole.employeeRoles.employeeManager) {
// //     sidebarItems.push({ label: 'Approval', icon: '' ,url:'',count:''});
// //   }

// //   if (employeeRole.employeeRoles.travelAdmin) {
// //     sidebarItems.push({ label: 'Bookings', icon: '' ,url:'',count:""});
// //   }

// //   if (employeeRole.employeeRoles.finance) {
// //     sidebarItems.push({ label: 'Settlement', icon: '' ,url:'',count:""});
// //   }

// //   if (employeeRole.employeeRoles.superAdmin) {
   
// //     sidebarItems.push({ label: 'Configure', icon: setting_icon, icon1:setting_icon1 , url:'',count:""});
// //   }


// //   return (
// //     <div className='lg:block hidden bg-white w-64 rounded-none border-none h-full  bg-indigo-50  min-h-full border border-black  '>
// //       {/* <div className="absolute top-[0px] left-[0px]  w-[244px]  overflow-hidden bg-slate-100 h-full"> */}
// //         <div className="absolute min-h-fi w-auto bg-indigo-50 top-[76px] border-black border left-[0px] flex flex-col items-start justify-start  ">
// //           {sidebarItems.map((item, index) => (
             
// //             <Link to={`${tenantId}/${empId}/${item.label.toLowerCase().replace(' ', '-')}`} key={index} onClick={()=>setActiveIndex(index)} className={`w-full  ${activeIndex===index ? 'bg-purple-500 text-white-100' : ""} overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border cursor-pointer`}>
          
// //               <div className="flex flex-row items-center justify-start gap-2 ">
// //                 {/* <div className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"></div> */}
// //                 <img src={activeIndex===index ? item.icon1:item.icon} className='w-4 h-4'/>
                
// //                 <div className={` ${activeIndex===index ? 'text-white-100':'text-indigo-800'} relative tracking-[0.02em] w-[150px] font-inter  font-medium`} >
// //                   {item.label}
// //                 </div>
// //                 {item?.count>0 &&
// //                 <div className={`${activeIndex===index ? 'text-purple-500 bg-white-100 font-semibold' : "text-white-100 "} w-6 h-6 flex font-inter rounded-full bg-indigo-600   float-right items-center justify-center text-xs  font-medium `}>
// //                     <p > {item?.count}</p>
// //                 </div>}
               
                
// //               </div>
              
              
           
// //             </Link>
          
// //           ))}
          
// //         </div>
// //         <img
// //           className="absolute top-[26px] left-[20px] w-[160px]"
// //           alt=""
// //           src={logo_with_text}
// //         />
// //       {/* </div> */}
// //     </div>
// //   );
// // }

// // export default Sidebar;



























// // import React from 'react';
// // import { Link } from 'react-router-dom';
// // import { receipt,
// //     house_simple,
// //     airplane_1,
// //     money,
// //     briefcase,
// //     bell,
// //     logo_with_text} from '../../assets/icon'

// // const Sidebar = ({ employeeRoles }) => {



  

// //   const sidebarItems = [
// //     { label: 'Overview', icon: '' },
// //     { label: 'Travel', icon: '' },
// //     { label: 'Cash Advance', icon: '' },
// //     { label: 'Expense', icon: '' },
// //     { label: 'Approvals', icon: '' },
// //     { label: 'Bookings', icon: '' },
// //     { label: 'Settlement', icon: '' },
// //     { label: 'Configure', icon: '' },

// //   ];

// //   // Conditionally add additional items based on employee roles
// //   if (employeeRoles.employeeManager) {
// //     sidebarItems.push({ label: 'Manager View', icon: '' });
// //   }

// //   if (employeeRoles.finance) {
// //     sidebarItems.push({ label: 'Settlement', icon: '' });
// //     sidebarItems.push({ label: 'Approvals', icon: '' });
// //   }

// //   return (
// //     <div className='lg:block hidden bg-white w-64  fixed rounded-none border-none '>
// //     <div className="absolute top-[0px] left-[0px] bg-gray-A100  w-[244px] h-[845px] overflow-hidden ">
// //     <div className="absolute top-[76px] left-[0px] flex flex-col items-start justify-start gap-[2px]">
// //        {sidebarItems.map((item, index) => (
// //             <div key={index} className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
// //               <div className="flex flex-row items-center justify-start gap-[12px]">
// //                 {/* Use your icon or image here */}
// //                 <div className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"></div>
// //                 <div className="relative tracking-[0.02em]">
// //                   <Link to={`/${item.label.toLowerCase().replace(' ', '-')}`}>{item.label}</Link>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //       {/* <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
// //         <div className="flex flex-row items-center justify-start gap-[12px]">
// //           <img
// //             className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
// //             alt=""
// //             src={receipt}
// //           />
// //           <div className="relative tracking-[0.02em]"><Link to="/settlement">Settlement</Link></div>
// //         </div>
// //       </div>
// //       <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
// //         <div className="flex flex-row items-center justify-start gap-[12px]">
// //           <img
// //             className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
// //             alt=""
// //             src={receipt}
// //           />
// //           <div className="relative tracking-[0.02em]"><Link to="booking">Bookings</Link></div>
// //         </div>
// //       </div>
// //       <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
// //         <div className="flex flex-row items-center justify-start gap-[12px]">
// //           <img
// //             className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
// //             alt=""
// //             src={receipt}
// //           />
// //           <div className="relative tracking-[0.02em]"><Link to="booking">Configure</Link></div>
// //         </div>
// //       </div> */}
     
// //     </div>


// //     <img
// //       className="absolute top-[26px] left-[20px] w-[160px]"
// //       alt=""
// //       src={logo_with_text}
// //     />
// //   </div>
// //   </div>
// //   )
// // }

// // export default Sidebar



// // import React from 'react';
// // import { Link } from 'react-router-dom';
// // import { receipt,
// //     house_simple,
// //     airplane_1,
// //     money,
// //     briefcase,
// //     bell,
// //     logo_with_text} from '../../assets/icon'

// // const Sidebar = ({ employeeRoles }) => {



  

// //   const sidebarItems = [
// //     { label: 'Overview', icon: '' },
// //     { label: 'Travel', icon: '' },
// //     { label: 'Cash Advance', icon: '' },
// //     { label: 'Expense', icon: '' },
// //     { label: 'Approvals', icon: '' }
// //   ];

// //   // Conditionally add additional items based on employee roles
// //   if (employeeRoles.employeeManager) {
// //     sidebarItems.push({ label: 'Manager View', icon: '' });
// //   }

// //   return (
// //     <div className='lg:block hidden bg-white w-64  fixed rounded-none border-none '>
// //     <div className="absolute top-[0px] left-[0px] bg-gray-A100  w-[244px] h-[845px] overflow-hidden ">
// //     <div className="absolute top-[76px] left-[0px] flex flex-col items-start justify-start gap-[2px]">
// //       <div className="self-stretch overflow-hidden flex flex-col items-start justify-start py-3 px-4 active:bg-purple-50 focus:bg-purple-50">
// //         <div className="flex flex-row items-center justify-start gap-[12px] ">
          
// //           <img
// //             className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
// //             alt=""
// //             src={house_simple}
// //           />
// //           <div className="relative tracking-[0.02em]"> <Link to="/">Overview </Link> </div>
       
// //         </div>
// //       </div>
// //       <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border text-purple-500">
// //         <div className="flex flex-row items-center justify-start gap-[12px]">
          
// //           <img
// //             className="relative w-4 h-4 overflow-hidden shrink-0"
// //             alt=""
// //             src={airplane_1}
// //           />
// //           <b className="relative tracking-[0.02em]"> <Link to="/travel">Travel</Link> </b>
         
// //         </div>
// //       </div>
// //       <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
// //         <div className="flex flex-row items-center justify-start gap-[12px]">
// //           <img
// //             className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
// //             alt=""
// //             src={money}
// //           />
// //           <div className="relative tracking-[0.02em]"><Link to="/cash-advance">Cash Advances</Link>  </div>
// //         </div>
// //       </div>
// //       <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
// //         <div className="flex flex-row items-center justify-start gap-[12px]">
// //           <img
// //             className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
// //             alt=""
// //             src={receipt}
// //           />
// //           <div className="relative tracking-[0.02em]"><Link to="/expense">Expenses</Link></div>
// //         </div>
// //       </div>
// //       {/* <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
// //         <div className="flex flex-row items-center justify-start gap-[12px]">
// //           <img
// //             className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
// //             alt=""
// //             src={receipt}
// //           />
// //           <div className="relative tracking-[0.02em]"><Link to="/approval">Approvals</Link></div>
// //         </div>
// //       </div> */}
// //        {sidebarItems.map((item, index) => (
// //             <div key={index} className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
// //               <div className="flex flex-row items-center justify-start gap-[12px]">
// //                 {/* Use your icon or image here */}
// //                 <div className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"></div>
// //                 <div className="relative tracking-[0.02em]">
// //                   <Link to={`/${item.label.toLowerCase().replace(' ', '-')}`}>{item.label}</Link>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //       <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
// //         <div className="flex flex-row items-center justify-start gap-[12px]">
// //           <img
// //             className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
// //             alt=""
// //             src={receipt}
// //           />
// //           <div className="relative tracking-[0.02em]"><Link to="/settlement">Settlement</Link></div>
// //         </div>
// //       </div>
// //       <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
// //         <div className="flex flex-row items-center justify-start gap-[12px]">
// //           <img
// //             className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
// //             alt=""
// //             src={receipt}
// //           />
// //           <div className="relative tracking-[0.02em]"><Link to="booking">Bookings</Link></div>
// //         </div>
// //       </div>
// //       <div className="w-[244px] overflow-hidden flex flex-col items-start justify-start py-3 px-4 box-border">
// //         <div className="flex flex-row items-center justify-start gap-[12px]">
// //           <img
// //             className="relative w-4 h-4 overflow-hidden shrink-0 opacity-[0.5]"
// //             alt=""
// //             src={receipt}
// //           />
// //           <div className="relative tracking-[0.02em]"><Link to="booking">Configure</Link></div>
// //         </div>
// //       </div>
     
// //     </div>


// //     <img
// //       className="absolute top-[26px] left-[20px] w-[160px]"
// //       alt=""
// //       src={logo_with_text}
// //     />
// //   </div>
// //   </div>
// //   )
// // }

// // export default Sidebar
