import React from 'react';
import { Link } from 'react-router-dom';
import { aeroplane1_icon, receipt, receipt_icon1, down_arrow_icon, airplane_icon1, money, money1 } from '../../assets';

const Sidebar = ({setReportTab,setFilterForm, fetchData, employeeRoles, handleReportTab, reportTab, activeView, setActiveView }) => {
    
    const reportTypes = [
        { label: "trip", icon1: airplane_icon1, icon: aeroplane1_icon },
        { label: "cash-advance", icon1: money1, icon: money },
        { label: "travel expense", icon1: receipt_icon1, icon: receipt },
        { label: "non-travel expense", icon1: receipt_icon1, icon: receipt }
    ];

    const handleViewToggle = (view) => {
        if (activeView !== view) {
            setActiveView(view);
            setFilterForm(prev=>({...prev, "role":view}))
            if(view==="financeView"){
                setReportTab("cash-advance")
            }
            fetchData(view);
        }
    };

    const shouldShowView = (roles) => {
        const { employeeManager, finance, businessAdmin, superAdmin } = employeeRoles;
        return roles ? (employeeManager || finance || businessAdmin || superAdmin) : finance;
    };

    const renderLinks = (view) => {
        const filteredReportTypes = view === 'financeView' && employeeRoles?.finance 
            ? reportTypes.filter(type => type.label !== "trip")
            : reportTypes;
    
        return filteredReportTypes.map((item, index) => (
            <Link
                key={index}
                onClick={() => handleReportTab(item.label)}
                className={`whitespace-nowrap border-none font-inter text-xs w-full flex items-center justify-start py-3 pl-4 pr-8 cursor-pointer ${reportTab === item.label ? 'bg-purple-500 text-white' : ''}`}
            >
                <img src={reportTab === item.label ? item.icon1 : item.icon} className="h-4 w-4" alt={item.label} />
                <div className={`ml-2 capitalize ${reportTab === item.label ? 'text-white' : 'text-indigo-800'}`}>{item.label}</div>
            </Link>
        ));
    };

    const renderSection = (view, title) => (
        <>
            <div onClick={() => handleViewToggle(view)} className="cursor-pointer text-base  whitespace-nowrap px-4 py-4 inline-flex justify-between items-center w-full">
                <h2 className={`font-semibold ${activeView === view ? 'text-indigo-600' : 'text-neutral-700'}`}>{title}</h2>
                <img src={down_arrow_icon} className={`transition-transform ${activeView === view ? 'rotate-0' : '-rotate-90'} w-5 h-5`} />
            </div>
            {activeView === view && renderLinks(view)}
        </>
    );

    return (
        <div className="min-h-screen divide-y divide-slate-300  bg-indigo-50 text-white">
            {renderSection('myView', 'My View')}
            {shouldShowView(true) && renderSection('myTeamView', 'My Team View')}
            {shouldShowView(false) && renderSection('financeView', 'Finance View')}
        </div>
    );
};

export default Sidebar;

