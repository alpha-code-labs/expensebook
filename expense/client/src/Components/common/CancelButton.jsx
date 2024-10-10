

// const CancelButton = (props) => {
//     const text= props.text
//     const textAndBgColor=props.textAndBgColor
//     const onClick =props.onClick
//   return (
//     <div onClick={onClick} className={`${textAndBgColor} ${"text-neutral-700 hover:text-indigo-600  w-fit h-8 px-6 py-4 border border-slate-300   rounded-md justify-center items-center gap-2 inline-flex cursor-pointer"}`}>
//         <div className= " w-full h-5 text-center   text-[16px] font-medium font-cabin">
//             {text}

//         </div>
      
//     </div>
//   )
// }

// export default CancelButton

import React, { useState } from 'react';
import { loading_icon } from '../../assets/icon';




export default function CancelButton(props) {

  const text = props.text;
  const onClick = props.onClick;
  const variant = props.variant ?? 'fit';
  const disabled = props.disabled ?? false;
  const loading = props.loading ?? false;

  const handleClick = (e) => {
    if ( !disabled && !loading) {
    // if (!disabled && !loading) {
      onClick(e);

      // Assuming the onClick function might trigger an asynchronous operation.
      // After the operation is done, set loading back to false.
      // You may need to adjust this based on your actual use case.
      // Example:
      // async onClickHandler() {
      //   // Some asynchronous operation
      //   await yourAsyncOperation();
      //   setLoading(false);
      // }
    } else {
      console.log('disabled or already loading',disabled);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`${variant === 'fit' ? 'w-fit' : 'w-full'} ${
          disabled 
            ? 'hover:bg-neutral-200   bg-white   cursor-not-allowed '
            : 'hover:bg-neutral-200 border-slate-300 bg-white text-neutral-700  cursor-pointer'
        } h-8 px-4 py-4  rounded-md text-neutral-700 border border-slate-300 justify-center items-center gap-2 inline-flex`}
      >
        {loading ? (
          <div className='flex gap-1 text-center items-center'>
          <img src={loading_icon} className="animate-spin w-5 h-5" />
          <div className="w-full max-w-[75px] sm:max-w-full whitespace-nowrap truncate h-5 text-center text-base font-medium font-cabin">
            {text}
          </div>
          </div>
        ) : (
          <div className="w-auto  whitespace-nowrap truncate h-5 text-center  text-base font-medium font-cabin">
            {text}
          </div>
        )}
      </div>
    </>
  );
}