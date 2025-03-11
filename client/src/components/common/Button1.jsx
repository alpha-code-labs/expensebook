import React, { useState } from 'react';
import { loading_icon } from '../../assets/icon';




export default function Button1(props) {

  const text = props.text;
  const onClick = props.onClick;
  const variant = props.variant ?? 'fit';
  const disabled = props.disabled ?? false;
  const active = props.active ?? false;
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
            ? 'text-white bg-neutral-700 cursor-not-allowed'
            : 'bg-neutral-900 text-white hover:bg-neutral-700 cursor-pointer'
        } h-8 px-4 py-4 bg-indigo-600 rounded-md  justify-center items-center gap-2 inline-flex`}
      >
        {loading && active ? (
          <div className='flex gap-1 text-center items-center'>
          <img src={loading_icon} className="animate-spin w-5 h-5" />
          <div className="w-full h-5 text-center text-white text-base font-medium font-cabin">
            {text}
          </div>
          </div>
        ) : (
          <div className="w-full h-5 text-center text-white text-base font-medium font-cabin">
            {text}
          </div>
        )}
      </div>
    </>
  );
}