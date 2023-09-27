import { useState, useEffect } from 'react'
import app_icon from '../assets/app_icon.svg'
import app_symbol from '../assets/app_symbol.svg'
import leftArrow_icon from '../assets/arrow-left.svg'
import Select from '../components/common/Select'
import Search from '../components/common/Search'
import Button from '../components/common/Button'


const options = ['Meeting with client', 'Sales Trip', 'Business Trip', 'Meeting with client', 'Sales Trip', 'Business Trip', 'Meeting with client', 'Sales Trip', 'Business Trip' ]
const names = ['Ajay Singh', 'Abhijay Singh', 'Akshay Kumar', 'Anandhu Ashok K.', 'kanhaiya']

export default function Page_1(){

    const [tripPurpose, setTripPurpose] = useState(null)


    return(<>
        <div className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12">
            {/* app icon */}
            <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
                <div className="flex items-center">
                    <img className='w-[23px] h-[23px]' src={app_symbol} />
                    <img className='w-[168px] h-[27px] -ml-[7px]' src={app_icon} />
                </div>
            </div>

            {/* Rest of the section */}
            <div className="w-full h-full mt-10 p-10">
                {/* back link */}
                <div className='flex items-center gap-4 cursor-pointer'>
                    <img className='w-[24px] h-[24px]' src={leftArrow_icon} />
                    <p className='text-neutral-700 text-md font-semibold font-cabin'>Create travel request</p>
                </div>

                {/* form */}

                {/* Trip Purpose */}
                <div className="mt-8">
                    <Select 
                        title='Select trip purpose'
                        placeholder='Select puropse of trip'
                        options={options}
                        onSelect = {(option)=> {setTripPurpose(option)}} />
                </div>


                <div className='mt-8 flex gap-8 flex-wrap'>
                    {/* Booking for  */}
                    <Search
                        options={names}
                        placeholder='Name of the travelling employeee' 
                        title='Assign request for' />

                    {/* Select approvers */}
                    <Search
                        placeholder='Name of manager approving this' 
                        title='Who will Approve this?' />
                </div>
                <hr className='my-8' />
                
                <p className='text-base font-medium text-neutral-700 font-cabin'>Select responsible departments for this journey.</p>
                <div className='mt-8'>
                    <Select
                        placeholder='Select department' 
                        title='Select department' />
                </div>
                
                <div className='mt-6 flex gap-4'>
                    <input type='radio' />
                    <p className='text-zinc-800 text-sm font-medium font-cabin'>Not Sure</p>
                </div>

                <div className='w-[134px] float-bottom float-right'>
                    <Button 
                        text='Continue' 
                        onClick={()=>{console.log('clicked on continue')}} />
                </div> 
            </div>

</div>
    </>)
}