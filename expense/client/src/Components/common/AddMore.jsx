import React, { useState } from 'react';
import { loading_icon } from '../../assets/icon';
import { plus_icon } from "../../assets/icon"

export default function Button(props) {
  

  const text = props.text;
  const onClick = props.onClick;
  const variant = props.variant ?? 'fit';
  const disabled = props.disabled ?? false;
  const active = props.active ?? false;
  const loading = props.loading ?? false

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
        // className={`${variant === 'fit' ? 'w-fit' : 'w-full'} ${
        //   disabled 
        //     ? 'hover:bg-indigo-400  hover:text-gray-400 bg-indigo-400 text-gray-400  cursor-not-allowed '
        //     : 'hover:bg-indigo-500  text-white cursor-pointer'
        // }
        //  h-12 px-8 py-4 bg-white-100 border border-indigo-600 rounded-[32px] justify-center items-center gap-2 inline-flex`}
      className='h-12 cursor-pointer px-6 py-4 rounded-[32px] border border-indigo-600 justify-center items-center gap-2 inline-flex'
      >
        {loading && active ? (
          <img src={loading_icon} className="animate-spin w-8 h-8" />
        ) : (
            <>
            <div className="text-center text-indigo-600 text-base font-medium font-cabin">{text}</div>
                         <div className="w-6 h-6 " >
                             <img src={plus_icon} alt='add' />
                         </div>
           </>
        )}
      </div>
    </>
  );
}
// import { plus_icon } from "../../assets/icon"

// export default function AddMore(props){
//     const handleClick = (e) => {
//         if ( !disabled && !loading) {
//         // if (!disabled && !loading) {
//           onClick(e);
    
//           // Assuming the onClick function might trigger an asynchronous operation.
//           // After the operation is done, set loading back to false.
//           // You may need to adjust this based on your actual use case.
//           // Example:
//           // async onClickHandler() {
//           //   // Some asynchronous operation
//           //   await yourAsyncOperation();
//           //   setLoading(false);
//           // }
//         } else {
//           console.log('disabled or already loading',disabled);
//         }
//       };
//     const onClick = props.onClick
//     const text = props.text || 'Add More'

//     return(<>
//         <div onClick={onClick} 
//             className=" h-12 cursor-pointer px-6 py-4 rounded-[32px] border border-indigo-600 justify-center items-center gap-2 inline-flex">
//             <div className="text-center text-indigo-600 text-base font-medium font-cabin">{text}</div>
//             <div className="w-6 h-6 " >
//                 <img src={plus_icon} alt='add' />
//             </div>
//         </div>
//     </>)
// }