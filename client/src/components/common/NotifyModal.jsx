import React from 'react';
import { check_tick } from '../../assets/icon';

const NotifyModal = () => {
  return (
   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog" aria-modal="true" aria-labelledby="modal-headline">
            <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <img src={check_tick} alt='check' width={20} height={20}/>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                        Submitted
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Your request has been submitted.
                        </p>
                    </div>
                </div>
            </div>
            
        </div>
        </div>
  )
}

export default NotifyModal