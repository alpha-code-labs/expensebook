



import { CircleFlag } from 'react-circle-flags';
// import CloseButton from './common/closeButton';
import { useRef, useEffect, useState } from 'react';
import Search from './Index';

const CurrencyInput = ({conversionAmount,dataMsg,uploading,title,id,placeholder, onChange ,error,initialValue,type='number',inputRef, amount, currency, mode, onModeChange, currencyOptions, cashAdvanceOptions, onAmountChange, onCurrencyChange, setSearchParam, removeItem })=>{
  const [inputValue, setInputValue] = useState("");

  console.log('selected currency',currency)
  useEffect(()=>{
    setInputValue(initialValue|| "")

  },[inputValue])

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
       <div className="w-full h-fit  flex-col justify-start items-start    inline-flex  ">
      {/* title */}
      <div className='flex gap-2 flex-col w-full h-full'>
      <div className="text-zinc-600 text-sm font-cabin">{title}</div>
          <div className='relative flex  items-center w-full  h-full'>
              <div className='relative h-full '>
              <div 
                ref={dropdownTriggerRef}
                onClick={(e)=>{e.stopPropagation; console.log('state-', isDropdownOpen); setIsDropdownOpen(pre=>!pre)}}
                className={`flex items-center gap-4 md:gap-6 cursor-pointer px-4 py-2 h-full rounded-l-md border  hover:bg-gray-100 ${isDropdownOpen ? 'border-indigo-600' : 'border-r'} `}>
                <div className='w-6 h-6'>
                    <CircleFlag countryCode={currency?.countryCode.toLowerCase()??'in'} />
                </div>
                <p className="symbol w-6 text-neutral-700">{currency?.shortName??'INR'}</p>
              </div>
              {isDropdownOpen &&   
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
              <div className="text-neutral-700 w-full h-[42px] text-sm font-normal font-cabin">
          <input
            ref={inputRef}
            onChange={(e) => {
              setInputValue(e.target.value);
              onChange && onChange(e.target.value);
            }}
            type={type}
            className="w-full h-full placeholder:normal-case border-l-0 capitalize decoration:none px-6 py-2 rounded-r-md border placeholder:text-zinc-400 border-neutral-300  focus-visible:outline-0 focus-visible:border-indigo-600 focus-visible:border-l"
            value={inputValue}
            placeholder={placeholder}
          />
           </div>
          
        
              
          </div>
          </div>
         <div className='space-y-0'>
          {error?.set && (
        <div className="   w-full text-xs text-red-500 font-cabin">
          {error?.msg} 
        </div>
      )} 

           {/* {conversionAmount?.currencyFlag && (
        <div className="   w-full text-xs text-neutral-900 font-cabin">
      {`Amount in ${conversionAmount?.defaultCurrencyName} ${(conversionAmount?.convertedTotalAmount).toFixed(2)} | 1 ${conversionAmount?.convertedCurrencyName} = ${conversionAmount?.defaultCurrencyName} ${conversionAmount?.conversionRate}`}
        </div>
      )}  */}
           {uploading?.set ? (
        <div className="   w-full text-xs text-neutral-700 font-cabin">
          {uploading?.msg}
        </div>
      ):
      conversionAmount?.currencyFlag && (
        <div className="   w-full text-xs text-neutral-900 font-cabin">
      {`Amount in ${conversionAmount?.defaultCurrencyName} ${(conversionAmount?.convertedTotalAmount)?.toFixed(2)} | 1 ${conversionAmount?.convertedCurrencyName} = ${conversionAmount?.defaultCurrencyName} ${conversionAmount?.conversionRate}`}
        </div>
      ) } 
           {dataMsg?.set && (
        <div className="   w-full text-xs text-yellow-200 font-cabin">
          {dataMsg?.msg}
        </div>
      )} 
      </div>
      </div>
    </>)
  }


export default CurrencyInput;



// import { CircleFlag } from 'react-circle-flags';
// // import CloseButton from './common/closeButton';
// import { useRef, useEffect, useState } from 'react';
// import Search from './Index';

// const CurrencyInput = ({id, amount, currency, mode, onModeChange, currencyOptions, cashAdvanceOptions, onAmountChange, onCurrencyChange, setSearchParam, removeItem })=>{

//     console.log(currencyOptions);
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const dropdownRef = useRef(null);
//     const dropdownTriggerRef = useRef(null);
  
//     //close dropdown on outside click
  
  
//   // //for closing the dropdown on outside click
//   // useEffect(() => {
//   //   const handleClick = (event) => {
//   //     if (dropdownRef.current && dropdownTriggerRef && !dropdownTriggerRef.current.contains(event.target) && !dropdownRef.current.contains(event.target)) {
//   //         setIsDropdownOpen(false)
//   //         console.log('this ran');
//   //     }
//   //   };
//   //   document.addEventListener("click", handleClick)
  
//   //   return () => {
//   //     console.log('removing dropdown') 
//   //     document.removeEventListener("click", handleClick);
//   //   }
  
//   // }, []);
  
  
//     return (<>
//         <div className="px-2 sm:px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 flex gap-8 w-fit">
//           <div className='relative flex items-center gap-4'>
//               <div className='relative'>
//               <div 
//                 ref={dropdownTriggerRef}
//                 onClick={(e)=>{e.stopPropagation; console.log('state-', isDropdownOpen); setIsDropdownOpen(pre=>!pre)}}
//                 className='flex items-center gap-4 md:gap-6 cursor-pointer p-2 rounded-md hover:bg-gray-100'>
//                 <div className='w-6 h-6'>
//                     <CircleFlag countryCode={currency?.countryCode.toLowerCase()??'in'} />
//                 </div>
//                 <p className="symbol w-6 text-neutral-700">{currency?.shortName??'INR'}</p>
//               </div>
//               {isDropdownOpen &&   
//                 <div className='-left-[15px] top-[54px] z-30  absolute'>
//                     <Search
//                       visible={isDropdownOpen}
//                       setVisible={setIsDropdownOpen}
//                       searchChildren={'fullName'}
//                       title='Select Currency'
//                       placeholder='Select Currency'
//                       options={currencyOptions}
//                       currentOption=''
//                       onSelect={(option) => { onCurrencyChange(option)} }
//                     />
//                   </div>
//                   }
//               </div>
//               <div className='flex items-center gap-2 text-neutral-700 font-cabin font-normal text-sm'>
//                   <input value={amount}  placeholder='amount' onChange={(e)=>onAmountChange(e.target.value, id)} className="border border-gray-200 w-[70px] sm:w-[110px]  h-10 rounded-md p-4 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600" />
//                   {/* <select placeholder='mode' value={mode??undefined} onChange={(e)=>onModeChange(e.target.value, id)} className="font-cabin border border-gray-200 w-[80px] sm:w-[110px] h-10 rounded-md border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600" >
//                     {cashAdvanceOptions != undefined && cashAdvanceOptions.length>0 ? cashAdvanceOptions.map((caoption,index)=><option key={index}>{caoption}</option>) : <option>Default</option>}
//                   </select> */}
//               </div>
              
//           </div>
//       </div>
//     </>)
//   }


// export default CurrencyInput;