import * as ScrollArea from '@radix-ui/react-scroll-area';
import './LeftPaneStyles.css'
import { useState } from 'react';
import Icon from './common/Icon';



const options = [
    [{name:'Company Info', link:'company-info'}],

    [{name:'Travel Allocations', link:'travel-allocations'},
    {name:'Travel Expense Allocations', link:'travel-expense-allocations'},
    {name:'Travel Categories Expense Allocations', link:'travel-categories-expense-allocations'},
    ],

    [{name:'Grouping Labels', link:'grouping-labels'},
        {name:'Groups', link:'groups'},
    {name:'Travel Policies', link:'travel-policies'},
    {name:'non-Travel Expenses And Policies', link:'non-travel-expenses-and-policies'}],

    [{name:'Account Lines', link:'account-lines'},
    {name:'Multicurrency', link:'multicurrency'},
    {name:'System Roles', link:'system-roles'},
    {name:'Advance Reimbursement Options', link:'advance-settlement-options'},
    {name:'Expense Reimbursement Options', link:'expense-settlement-options'}],

    [{name:'Configure New Employees', link:'update-hr-master'},
    {name:'Configure Org Headers', link:'update-org-headers'}]
]


const ScrollAreaDemo = ({loadLink}) => {
    const [selectedOption, setSelectedOption] = useState(null)
    const handleOptionSelect = (option, link)=>{
        setSelectedOption(option)
        loadLink(link)
    }
    return(
    <ScrollArea.Root className="ScrollAreaRoot bg-slate-100">
        <ScrollArea.Viewport className="ScrollAreaViewport">
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