import { CircleFlag } from 'react-circle-flags';
// import CloseButton from './common/closeButton';
import { useRef, useEffect, useState } from 'react';
import Search from './Index';

const CurrencyInput = ({id, amount, currency, mode, onModeChange, currencyOptions, cashAdvanceOptions, onAmountChange, onCurrencyChange, setSearchParam, removeItem })=>{

    console.log(currencyOptions);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dropdownTriggerRef = useRef(null);
  
    //close dropdown on outside click
  
  
  // //for closing the dropdown on outside click
  // useEffect(() => {
  //   const handleClick = (event) => {
  //     if (dropdownRef.current && dropdownTriggerRef && !dropdownTriggerRef.current.contains(event.target) && !dropdownRef.current.contains(event.target)) {
  //         setIsDropdownOpen(false)
  //         console.log('this ran');
  //     }
  //   };
  //   document.addEventListener("click", handleClick)
  
  //   return () => {
  //     console.log('removing dropdown') 
  //     document.removeEventListener("click", handleClick);
  //   }
  
  // }, []);
  
  
    return (<>
        <div className="px-2 sm:px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 flex gap-8 w-fit">
          <div className='relative flex items-center gap-4'>
              <div className='relative'>
              <div 
                ref={dropdownTriggerRef}
                onClick={(e)=>{e.stopPropagation; console.log('state-', isDropdownOpen); setIsDropdownOpen(pre=>!pre)}}
                className='flex items-center gap-4 md:gap-6 cursor-pointer p-2 rounded-md hover:bg-gray-100'>
                <div className='w-6 h-6'>
                    <CircleFlag countryCode={currency?.countryCode.toLowerCase()??'in'} />
                </div>
                <p className="symbol w-6 text-neutral-700">{currency?.shortName??'INR'}</p>
              </div>
              {isDropdownOpen && 

                // <div ref={dropdownRef} className='z-[100] shadow-lg pt-4 flex flex-col items-center justify-center w-[150px] -left-[7%] -top-[248px] absolute shadow-sm border-sm border-gray-400'>
                //       <div className='relative bg-white border border-gray-200'>
                //           <div className='absolute top-1 left-0 px-1'>
                //             <input type='text' className='px-2 py-1 rounded-md w-[140px] text-xs border border-gray-400 bg-gray-100 focus-visible:bg-white focus-visible:outline-0 focus-visible:border-indigo-600'  onChange={(e)=>setSearchParam(e.target.value)} />
                //           </div>
                          
                //           <div className='mt-8 h-[200px] w-[150px] px-0 py-4 overflow-y-scroll scroll flex flex-col divide-y font-cabin text-sm gap-1 text-neutral-700'>
                //               {currencyOptions && currencyOptions.length>0 && currencyOptions.map((option,index)=><div key={index} className='hover:bg-indigo-600 hover:text-gray-100' onClick={(e)=>{onCurrencyChange(option.currency,id); setIsDropdownOpen(false)}}>
                //               <p className='px-2 py-1'>{option.currency.fullName}-({option.currency.shortName})</p>
                //               </div>)}
                //           </div>
                //       </div>
                //   </div>
                  
                <div className='-left-[15px] top-[54px] z-30  absolute'>
                    <Search
                      visible={isDropdownOpen}
                      setVisible={setIsDropdownOpen}
                      searchChildren={'fullName'}
                      title='Select Currency'
                      placeholder='Select Currency'
                      options={currencyOptions}
                      currentOption=''
                      onSelect={(option) => { onCurrencyChange(option)} }
                    />
                  </div>
                  }
              </div>
              <div className='flex items-center gap-2 text-neutral-700 font-cabin font-normal text-sm'>
                  <input value={amount}  placeholder='amount' onChange={(e)=>onAmountChange(e.target.value, id)} className="border border-gray-200 w-[70px] sm:w-[110px]  h-10 rounded-md p-4 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600" />
                  {/* <select placeholder='mode' value={mode??undefined} onChange={(e)=>onModeChange(e.target.value, id)} className="font-cabin border border-gray-200 w-[80px] sm:w-[110px] h-10 rounded-md border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600" >
                    {cashAdvanceOptions != undefined && cashAdvanceOptions.length>0 ? cashAdvanceOptions.map((caoption,index)=><option key={index}>{caoption}</option>) : <option>Default</option>}
                  </select> */}
              </div>
              {/* <div className=''>
                <CloseButton onClick={()=>removeItem(id)} />
              </div> */}
          </div>
      </div>
    </>)
  }


export default CurrencyInput;