


import React from 'react';
import { blueTick_icon, cancel_icon } from '../../assets/icon';
import Block4 from './Block4';



const Pricing2 = () => {
   
  return (
    <>
    <div className='sm:px-[120px] px-6 sm:py-[80px] py-[48px] flex flex-col gap-12'>
       <h1 className=' w-auto leading-normal text-center font-extatica sm:leading-[56px]  gradient-text font-semibold  h-full sm:text-[36px] text-[28px]'>Choose a plan that suits your organizational needs</h1>

       <div className='max-w-full overflow-x-auto'>
      
      <table className="table-auto w-full flex flex-col border rounded-md border-slate-300 min-w-[1118px] ">
        <thead className=' flex'>
          <tr className='inline-flex flex-grow justify-end items-end'>
            <th className=" flex-1  px-6 py-6">
                <div className='flex gap-3 justify-center items-center font-inter'>
                    <input type='checkbox'/>
                    <p className='text-start text-[16px] font-medium leading-6 text-neutral-600 w-full shrink-0'>Hide Common Features</p>
                </div>
            </th>
            <th className="flex-1 px-6 py-6 justify-center items-center flex flex-col gap-6">
                <p className='text-center text-[20px] font-inter font-normal leading-6 tracking-[.3em] text-neutral-600' >FREE</p>
                <div className=' border-[1px] rounded border-blue-200/80 bg-blue-200/20 w-fit'>
                    <p className='px-3 py-2 font-inter text-[16px] font-medium leading-6 text-blue-100'>Sign up</p>
                </div>
            </th>
            <th className="flex-1 px-6 py-6 justify-center items-center flex flex-col gap-6">

                <p className='text-center text-[20px] font-inter font-normal leading-6 tracking-[.3em] text-neutral-600' >STANDARD</p>
                <div className=' border-[1px] rounded border-blue-200/80 bg-blue-200/20 w-fit'>
                    <p className='px-3 py-2 font-inter text-[16px] font-medium leading-6 text-blue-100'>Sign up</p>
                </div>
            </th>
            <th className="flex-1 px-6 py-6 justify-center items-center flex flex-col gap-6">

                <p className='text-center text-[20px] font-inter font-normal leading-6 tracking-[.3em] text-neutral-600' >PREMIUM</p>
                <div className=' border-[1px] rounded border-blue-200/80 bg-blue-200/20 w-fit'>
                    <p className='px-3 py-2 font-inter text-[16px] font-medium leading-6 text-blue-100'>Sign up</p>
                </div>
            </th>
            <th className="flex-1 px-6 py-6 justify-center items-center flex flex-col gap-6">

                <p className='text-center text-[20px] font-inter font-normal leading-6 tracking-[.3em] text-neutral-600' >ENTERPRISE</p>
                <div className=' border-[1px] rounded border-blue-200/80 bg-blue-200/20 w-fit'>
                    <p className='px-3 py-2 font-inter text-[16px] font-medium leading-6 text-blue-100'>Contact us</p>
                </div>
            </th>
           
            
        
          </tr>
        </thead>
        <tbody className='divide-y  '>
          <tr className='flex flex-row  shrink-0'>
            <td className="flex-1 p-6  bg-gray-200/60 text-inter font-semibold leading-6 text-[18px] text-neutral-600">Plan Details</td>
            <td className="flex-1 p-6 bg-gray-200/60"></td>
            <td className="flex-1 p-6 bg-gray-200/60"></td>
            <td className="flex-1 p-6 bg-gray-200/60"></td>
            <td className="flex-1 p-6 bg-gray-200/60"></td>
          </tr>
          <tr className='flex flex-row '>
            <td className="flex-1 p-6 font-inter text-[16px]  font-normal leading-5 text-neutral-600">Billed Annually</td>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal text-center leading-5 text-neutral-400">Free for 3 users</td>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal text-center leading-5 text-neutral-400">$179/user/month</td>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal text-center leading-5 text-neutral-400">$149/user/month</td>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal text-center leading-5 text-neutral-400">$229/user/month</td>
          </tr>
          <tr className='flex flex-row'>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal text-start leading-5 text-neutral-600">Billed Monthly</td>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal text-center leading-5 text-neutral-400">Free for 3 users</td>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal text-center leading-5 text-neutral-400">₹99/user</td>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal text-center leading-5 text-neutral-400">₹199/user</td>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal text-center leading-5 text-neutral-400">₹299/user</td>
          </tr>
          <tr className='flex flex-row'>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal leading-5 text-neutral-600">Additional User</td>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal text-center leading-5 text-neutral-400">NA</td>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal text-center leading-5 text-neutral-400">$99/user</td>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal text-center leading-5 text-neutral-400">$199/user</td>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal text-center leading-5 text-neutral-400">$299/user</td>
          </tr>
          <tr className='flex flex-row'>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal leading-5 text-neutral-600">Minimum User Count</td>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal text-center leading-5 text-neutral-400">NA</td>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal text-center leading-5 text-neutral-400">10</td>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal text-center leading-5 text-neutral-400">10</td>
            <td className="flex-1 p-6 font-inter text-[16px] font-normal text-center leading-5 text-neutral-400">100</td>
          </tr>
          <tr className='flex flex-row shrink-0'>
            <td className="flex-1 py-6 pl-6  bg-gray-200/60 w-full"><p className='text-inter font-semibold leading-6 text-[18px] text-neutral-600'>Receipts and Expenses</p></td>
            <td className="flex-1 p-6 bg-gray-200/60"></td>
            <td className="flex-1 p-6 bg-gray-200/60"></td>
            <td className="flex-1 p-6 bg-gray-200/60"></td>
            <td className="flex-1 p-6 bg-gray-200/60"></td>
          </tr>
          <tr className='flex flex-row '>
            <td className="flex-1 p-6 font-inter text-[16px] items-center justify-center  font-normal leading-5 text-neutral-600">Billed Annually</td>
            <td className="flex-1 p-6 font-inter flex items-center justify-center  "><img src={cancel_icon} className='w-[10px] h-[10px]'/></td>
            <td className="flex-1 p-6 font-inter flex items-center justify-center  text-[16px] font-normal text-center leading-5 text-neutral-400"><img className='w-[10px] h-[10px]' src={cancel_icon}/></td>
            <td className="flex-1 p-6 font-inter  flex items-center justify-center  text-[16px] font-normal text-center leading-5 text-neutral-400"><img className='w-[10px] h-[10px]' src={cancel_icon}/></td>
            <td className="flex-1 p-6 font-inter flex items-center justify-center  text-[16px] font-normal text-center leading-5 text-neutral-400"><img className='w-[20px] h-[20px]' src={blueTick_icon}/></td>
          </tr>
          <tr className='flex flex-row '>
            <td className="flex-1 p-6 font-inter text-[16px] items-center justify-center  font-normal leading-5 text-neutral-600">Billed Annually</td>
            <td className="flex-1 p-6 font-inter flex items-center justify-center  "><img src={cancel_icon} className='w-[10px] h-[10px]'/></td>
            <td className="flex-1 p-6 font-inter flex items-center justify-center  text-[16px] font-normal text-center leading-5 text-neutral-400"><img className='w-[10px] h-[10px]' src={cancel_icon}/></td>
            <td className="flex-1 p-6 font-inter  flex items-center justify-center  text-[16px] font-normal text-center leading-5 text-neutral-400"><img className='w-[10px] h-[10px]' src={cancel_icon}/></td>
            <td className="flex-1 p-6 font-inter flex items-center justify-center  text-[16px] font-normal text-center leading-5 text-neutral-400"><img className='w-[20px] h-[20px]' src={blueTick_icon}/></td>
          </tr>
          <tr className='flex flex-row'>
            <td className="flex-1 p-6 font-inter text-[16px] items-center justify-center  font-normal leading-5 text-neutral-600">Billed Annually</td>
            <td className="flex-1 p-6 font-inter flex items-center justify-center  "><img src={cancel_icon} className='w-[10px] h-[10px]'/></td>
            <td className="flex-1 p-6 font-inter flex items-center justify-center  text-[16px] font-normal text-center leading-5 text-neutral-400"><img className='w-[20px] h-[20px]' src={blueTick_icon}/></td>
            <td className="flex-1 p-6 font-inter flex items-center justify-center  text-[16px] font-normal text-center leading-5 text-neutral-400"><img className='w-[10px] h-[10px]' src={cancel_icon}/></td>
            <td className="flex-1 p-6 font-inter  flex items-center justify-center  text-[16px] font-normal text-center leading-5 text-neutral-400"><img className='w-[10px] h-[10px]' src={cancel_icon}/></td>
          </tr>
        </tbody>
      </table>


       </div>
      
    </div>
    <Block4/>
    </>
  )
}

export default Pricing2
