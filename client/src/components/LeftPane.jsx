import * as ScrollArea from '@radix-ui/react-scroll-area';
import './LeftPaneStyles.css'
import { useState, useEffect } from 'react';
import app_icon from '../assets/app_icon.svg';
import app_symbol from '../assets/app_symbol.svg';
import React from 'react';
import hamburger_menu_icon from '../assets/hamburger.svg';
import left_arrow_icon from '../assets/arrow-left.svg'



const options = [
    [ 
        {name:'Company Info', link:'company-info'} 
    ],

    [   
        {name:'Travel Allocation Level', link:'travel-allocation-level'},
        {name:'Travel Allocations', link:'travel-allocations'},
        {name:'Reimbursement Allocations', link:'reimbursement-allocations'},
    ],

    [
        {name:'Grouping Labels', link:'grouping-labels'},
        {name:'Groups', link:'groups'},
        {name:'Company Policies', link:'travel-policies'},
    ],

    [
        {name:'Multicurrency', link:'multicurrency'},
        {name:'System Roles', link:'system-roles'},
        {name:'Cash Advance Settlement Options', link:'advance-settlement-options'},
        {name:'Expense Settlement Options', link:'expense-settlement-options'}
    ],

    [
        {name:'Configure New Employees', link:'update-hr-master'},
        {name:'Configure Org Headers', link:'update-org-headers'}
    ]
]


const ScrollAreaDemo = ({loadLink, dashboardLink}) => {
    const [selectedOption, setSelectedOption] = useState('Company Info')
    const handleOptionSelect = (option, link)=>{
        setSelectedOption(option)
        loadLink(link)
    }

    const [showLeftPaneModal, setShowLeftPaneModal] = useState(false);
    const [showHamburger, setShowHamburger] = useState(true);
  
    const handleMenuClick = ()=>{
      console.log('hamburger clicked')
      setShowHamburger(false);
      setShowLeftPaneModal(true);
    }
  
    useEffect(()=>{
      console.log(showLeftPaneModal, 'left pane modal')
    },[showLeftPaneModal])


    return(
        <>
        <div className='hidden sm:block w-[270px] h-[100vh] max-h-[100vh] overflow-hidden fixed bg-slate-100'>
            <ScrollArea.Root className="ScrollAreaRoot bg-slate-100">
                <ScrollArea.Viewport className="ScrollAreaViewport">
                <div onClick={()=> window.location.href = dashboardLink} className="flex items-center h-[12] pt-8 w-fit justify-center px-4 cursor-pointer">
                    <img className='w-[23px] h-[23px]' src={app_symbol} />
                    <img className='w-[168px] h-[27px] -ml-[7px]' src={app_icon} />
                </div>
                <div className='text-sm font-inter pt-10 text-neutral-900'>
                    {options.map((groups, index) => (
                        <React.Fragment key={index}>
                        <div className='py-1'>
                            {groups.map(option=>
                            <div 
                                onClick={()=>handleOptionSelect(option.name, option.link)}
                                className={`tag px-4 py-2 cursor-pointer ${selectedOption == option.name? 'text-indigo-600' : 'text-neutral-900'} hover:bg-indigo-100`} key={option.name}>
                                {option.name}
                            </div>
                            )
                            }
                        </div>
                        <hr/>
                        </React.Fragment>
                    ))}
                </div>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
                <ScrollArea.Thumb className="ScrollAreaThumb" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="horizontal">
                <ScrollArea.Thumb className="ScrollAreaThumb" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner className="ScrollAreaCorner" />
            </ScrollArea.Root>
        </div>
        
        <div className='sm:hidden z-[1000]'>
            {showHamburger && <div onClick={()=>handleMenuClick()} className='fixed left-4 top-4 not-sr-only'>
            <img onClick={handleMenuClick} src={hamburger_menu_icon} className='w-6 h-6' />
            </div>}
            {showLeftPaneModal && <div onClick={()=>{setShowHamburger(true); setShowLeftPaneModal(false)}} className='w-[100vw] h-[100vh] left-0 top-0 fixed bg-black/30'>
                <div className='w-[270px] h-[100%]'>
                    <ScrollArea.Root className="ScrollAreaRoot bg-slate-100">
                        <ScrollArea.Viewport className="ScrollAreaViewport">
                        <div onClick={()=> window.location.href = dashboardLink} className="flex items-center h-[12] pt-8 w-fit justify-center px-4 cursor-pointer">
                            <img className='w-[23px] h-[23px]' src={app_symbol} />
                            <img className='w-[168px] h-[27px] -ml-[7px]' src={app_icon} />
                        </div>
                        <div className='text-sm font-inter pt-10 text-neutral-900'>
                            {options.map((groups, index) => (
                                <React.Fragment key={index}>
                                <div className='py-1'>
                                    {groups.map(option=>
                                    <div 
                                        onClick={()=>handleOptionSelect(option.name, option.link)}
                                        className={`tag px-4 py-2 cursor-pointer ${selectedOption == option.name? 'text-indigo-600' : 'text-neutral-900'} hover:bg-indigo-100`} key={option.name}>
                                        {option.name}
                                    </div>
                                    )
                                    }
                                </div>
                                <hr/>
                                </React.Fragment>
                            ))}
                        </div>
                        </ScrollArea.Viewport>
                        <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
                        <ScrollArea.Thumb className="ScrollAreaThumb" />
                        </ScrollArea.Scrollbar>
                        <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="horizontal">
                        <ScrollArea.Thumb className="ScrollAreaThumb" />
                        </ScrollArea.Scrollbar>
                        <ScrollArea.Corner className="ScrollAreaCorner" />
                    </ScrollArea.Root>
                </div>
            </div>}
        </div>


        <div className='fixed right-4 top-4 p-2 bg-white rounded-full z-[1000]'>
            <div className='rounded-full border border-indigo-600 py-2 px-4 cursor-pointer bg-white' onClick={()=> window.location.href = `${dashboard_url}/${tenantId}/overview`}>
                <div className='flex gap-2 items-center'>
                <img src={left_arrow_icon} className='w-4' />
                <p className='text-indigo-600 text-sm font-inter'>Back to Dashboard</p>
                </div>
            </div>
        </div>
    </>
    );
}

export default ScrollAreaDemo;