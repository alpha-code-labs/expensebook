import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { aeroplane1_icon, cancel_icon, receipt, receipt_icon1, down_arrow_icon, airplane_icon1, money, money1, logo_with_text } from '../../assets';

const Sidebar = ({fetchData, employeeRoles,handleReportTab, reportTab , activeView , setActiveView }) => {
    
    const reportTypes = [
        { label: "trip", icon1: airplane_icon1, icon: aeroplane1_icon },
        { label: "cash-advance", icon1: money1, icon: money },
        { label: "travel expense", icon1: receipt_icon1, icon: receipt },
        { label: "non-travel expense", icon1: receipt_icon1, icon: receipt }
    ];

    const handleViewToggle = (view) => {
        if (activeView !== view) {
            setActiveView(view);
        }
        fetchData(view)

    };

    const shouldShowMyTeamView = () => {
        return employeeRoles.employeeManager || employeeRoles.finance || employeeRoles.businessAdmin || employeeRoles.superAdmin;
    };

    return (
        <div className="min-h-screen bg-indigo-50 text-white">
           
            <div onClick={() => handleViewToggle('myView')} className='cursor-pointer px-4 py-4 inline-flex items-center justify-between w-full'>
                <h2 className={`font-inter font-semibold text-md ${activeView === "myView" ? 'text-indigo-600' : 'text-neutral-700'}`}>My View</h2>
                <img src={down_arrow_icon}
                    className={`transition-transform duration-300 ${activeView === "myView" ? 'text-indigo-600 rotate-0' : 'text-neutral-700 -rotate-90'} w-5 h-5`}
                />
            </div>
            {activeView === 'myView' && (
                <div>
                    {reportTypes.map((item, index) => (
                        <Link
                            key={index}
                            onClick={() => handleReportTab(item?.label)}
                            className={`w-full overflow-hidden flex flex-col items-center sm:items-start justify-start py-3 px-4 box-border cursor-pointer ${
                                'animate-slideIn'
                            } ${reportTab === item.label ? 'bg-purple-500 text-white' : ''}`}
                        >
                            <div className="flex flex-row text-xs items-center justify-start gap-2">
                                <img src={reportTab === item.label ? item.icon1 : item.icon} className='shrink-0 h-4 w-4' />
                                <div className={`relative whitespace-nowrap tracking-[0.02em] w-auto md:w-[150px] font-inter font-medium capitalize ${reportTab === item.label ? 'text-white' : 'text-indigo-800'}`}>
                                    {item.label}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {shouldShowMyTeamView() && (
                <>
                    <div onClick={() => handleViewToggle('myTeamView')} className={`cursor-pointer px-4 py-4 inline-flex items-center justify-between w-full mt-2`}>
                        <h2 className={`font-inter font-semibold text-md ${activeView === "myTeamView" ? 'text-indigo-600' : 'text-neutral-700'}`}>My Team View</h2>
                        <img
                            src={down_arrow_icon}
                            className={`transition-transform duration-300 ${activeView === "myTeamView" ? 'text-indigo-600 rotate-0' : 'text-neutral-700 -rotate-90'} w-5 h-5`}
                        />
                    </div>
                    {activeView === 'myTeamView' && (
                        <div>
                            {reportTypes.map((item, index) => (
                                <Link
                                    key={index}
                                    onClick={() => handleReportTab(item.label)}
                                    className={`w-full overflow-hidden flex flex-col items-center sm:items-start justify-start py-3 px-4 box-border cursor-pointer ${
                                        'animate-slideIn'
                                    } ${reportTab === item.label ? 'bg-purple-500 text-white' : ''}`}
                                >
                                    <div className="flex flex-row text-xs items-center justify-start gap-2">
                                        <img src={reportTab === item.label ? item.icon1 : item.icon} className='min-w-4 min-h-4 h-4 w-4' />
                                        <div className={`relative whitespace-nowrap tracking-[0.02em] w-auto md:w-[150px] font-inter font-medium capitalize ${reportTab === item.label ? 'text-white' : 'text-indigo-800'}`}>
                                            {item.label}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Sidebar;
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { aeroplane1_icon, cancel_icon, receipt, receipt_icon1, down_arrow_icon, airplane_icon1, money, money1, logo_with_text } from '../../assets';

// const Sidebar = ({fetchData, employeeRoles,handleReportTab, reportTab , activeView , setActiveView }) => {
    
//     const reportTypes = [
//         { label: "trip", icon1: airplane_icon1, icon: aeroplane1_icon },
//         { label: "cash-advance", icon1: money1, icon: money },
//         { label: "travel expense", icon1: receipt_icon1, icon: receipt },
//         { label: "non-travel expense", icon1: receipt_icon1, icon: receipt }
//     ];

//     const handleViewToggle = (view) => {
//         if (activeView !== view) {
//             setActiveView(view);
//         }
//         fetchData(view)

//     };

//     const shouldShowMyTeamView = () => {
//         return employeeRoles.employeeManager || employeeRoles.finance || employeeRoles.businessAdmin || employeeRoles.superAdmin;
//     };

//     return (
//         <div className="min-h-screen bg-indigo-50 text-white">
//             {/* <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
              
//                 <div className='h-16'>
//                 <img
//                 className="w-[140px] h-16"
//                 alt=""
//                 src={logo_with_text}
//             />
//                 </div>
//             </div> */}

//             <div onClick={() => handleViewToggle('myView')} className='cursor-pointer px-4 py-4 inline-flex items-center justify-between w-full'>
//                 <h2 className={`font-inter font-semibold text-md ${activeView === "myView" ? 'text-indigo-600' : 'text-neutral-700'}`}>My View</h2>
//                 <img src={down_arrow_icon}
//                     className={`transition-transform duration-300 ${activeView === "myView" ? 'text-indigo-600 rotate-0' : 'text-neutral-700 -rotate-90'} w-5 h-5`}
//                 />
//             </div>
//             {activeView === 'myView' && (
//                 <div>
//                     {reportTypes.map((item, index) => (
//                         <Link
//                             key={index}
//                             onClick={() => handleReportTab(item.label)}
//                             className={`w-full overflow-hidden flex flex-col items-center sm:items-start justify-start py-3 px-4 box-border cursor-pointer ${
//                                 'animate-slideIn'
//                             } ${reportTab === item.label ? 'bg-purple-500 text-white' : ''}`}
//                         >
//                             <div className="flex flex-row items-center justify-start gap-2">
//                                 <img src={reportTab === item.label ? item.icon1 : item.icon} className='min-w-4 min-h-4 h-4 w-4' />
//                                 <div className={`relative whitespace-nowrap tracking-[0.02em] w-auto md:w-[150px] font-inter font-medium capitalize ${reportTab === item.label ? 'text-white' : 'text-indigo-800'}`}>
//                                     {item.label}
//                                 </div>
//                             </div>
//                         </Link>
//                     ))}
//                 </div>
//             )}

//             {shouldShowMyTeamView() && (
//                 <>
//                     <div onClick={() => handleViewToggle('myTeamView')} className={`cursor-pointer px-4 py-4 inline-flex items-center justify-between w-full mt-2`}>
//                         <h2 className={`font-inter font-semibold text-md ${activeView === "myTeamView" ? 'text-indigo-600' : 'text-neutral-700'}`}>My Team View</h2>
//                         <img
//                             src={down_arrow_icon}
//                             className={`transition-transform duration-300 ${activeView === "myTeamView" ? 'text-indigo-600 rotate-0' : 'text-neutral-700 -rotate-90'} w-5 h-5`}
//                         />
//                     </div>
//                     {activeView === 'myTeamView' && (
//                         <div>
//                             {reportTypes.map((item, index) => (
//                                 <Link
//                                     key={index}
//                                     onClick={() => handleReportTab(item.label)}
//                                     className={`w-full overflow-hidden flex flex-col items-center sm:items-start justify-start py-3 px-4 box-border cursor-pointer ${
//                                         'animate-slideIn'
//                                     } ${reportTab === item.label ? 'bg-purple-500 text-white' : ''}`}
//                                 >
//                                     <div className="flex flex-row items-center justify-start gap-2">
//                                         <img src={reportTab === item.label ? item.icon1 : item.icon} className='min-w-4 min-h-4 h-4 w-4' />
//                                         <div className={`relative whitespace-nowrap tracking-[0.02em] w-auto md:w-[150px] font-inter font-medium capitalize ${reportTab === item.label ? 'text-white' : 'text-indigo-800'}`}>
//                                             {item.label}
//                                         </div>
//                                     </div>
//                                 </Link>
//                             ))}
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };

// export default Sidebar;
