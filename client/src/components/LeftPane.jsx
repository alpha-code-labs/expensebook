import * as ScrollArea from '@radix-ui/react-scroll-area';
import './LeftPaneStyles.css'
import { useState } from 'react';
import app_icon from '../assets/app_icon.svg';
import app_symbol from '../assets/app_symbol.svg';



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
    const [selectedOption, setSelectedOption] = useState(null)
    const handleOptionSelect = (option, link)=>{
        setSelectedOption(option)
        loadLink(link)
    }
    return(
    <ScrollArea.Root className="ScrollAreaRoot bg-slate-100">
        <ScrollArea.Viewport className="ScrollAreaViewport">
        <div onClick={()=> window.location.href = dashboardLink} className="flex items-center h-[12] pt-8 w-fit justify-center px-4 cursor-pointer">
            <img className='w-[23px] h-[23px]' src={app_symbol} />
            <img className='w-[168px] h-[27px] -ml-[7px]' src={app_icon} />
        </div>
        <div className='text-sm font-inter pt-10 text-neutral-900'>
            {options.map((groups) => (
                <>
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
                </>
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
    );
}

export default ScrollAreaDemo;