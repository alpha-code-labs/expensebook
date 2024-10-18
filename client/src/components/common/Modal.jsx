import React from 'react';
import Button from './Button';
import { cancel } from '../../assets/icon';

const Modal = (props) => {

  const isOpen = props.isOpen;
  const onClose = props.onClose;
  const cashAdvanceData = props.cashAdvanceData;
  const approvers = props.approvers;
  const handleSubmit = props.handleSubmit;
  const violationMessage=props.violationMessage;
  const approverFLAG = props.approverFLAG;

  

  if (!isOpen) return null;

  return (
    <div className='fixed w-full h-full inset-0 flex justify-center items-center visible bg-black/20 backdrop-blur-sm'>
      <div className="p-10 w-[1085px] bg-white rounded-2xl">
        <div className='float-right cursor-pointer' onClick={onClose}>
          <img src={cancel} className='hover:via-black' />
        </div>
        <div className="w-full max-w-xl sm:rounded-2xl bg-white">
          <div className='w-full'>
            <div className='mb-[35px] font-cabin text-[24px] not-italic tracking-[-0.96px] leading-normal font-semibold'>
              Cash Advance Details
            </div>
            <div className='w-full h-[200px] mt-26 inline-flex flex-start flex-col gap-4'>
              <div className='text-[#333] font-cabin leading-normal text-[16px] font-medium'>
                Request For Cash Advance
              </div>
              {/* {cashAdvanceData.map((data, index) => (
                 <>
                 
               
                <div key={index} className='flex items-center flex-col md:flex-row mb-12 h-[200px]'>
                  <div className='w-[173px] h-[19px]'>
                    <div>Currency</div>
                    <div className="w-[133px] h-[48px] mt-2 flex flex-row items-center justify-start border border-gray-600 rounded-md hover:border-purple-500 focus:border-purple-500">
                      <div className="flex-1 w-5 px-6 border-none outline-none placeholder:text-gray-200 placeholder:text-[14px] placeholder:font-normal">
                        {data.currency}
                      </div>
                    </div>
                  </div>
                  <div className='w-[173px] h-[19px]'>
                    <div>Amount</div>
                    <div className="w-[133px] h-[48px] mt-2 flex flex-row items-center justify-start border border-gray-600 rounded-md hover:border-purple-500 focus:border-purple-500">
                      <div className="flex-1 w-5 px-6 border-none outline-none placeholder:text-gray-200 placeholder:text-[14px] placeholder:font-normal">
                        {data.amount}
                      </div>
                    </div>
                  </div>
                  <div className='w-[173px] h-[19px]'>
                    <div>Mode</div>
                    <div className="w-[133px] h-[48px] mt-2 flex flex-row items-center justify-start border border-gray-600 rounded-md hover:border-purple-500 focus:border-purple-500">
                      <div className="flex-1 w-5 px-6 border-none outline-none placeholder:text-gray-200 placeholder:text-[14px] placeholder:font-normal">
                        {data.mode}
                      </div>
                    </div>
                  </div>
                </div>
                
              </>
              ))}
              <div className='flex '>
                <div className='w-[133px] h-[19px]'>
                  <div>Approvers</div>
                  <div className=" h-[48px] mt-2 flex flex-row items-center justify-start border border-gray-600 rounded-md hover:border-purple-500 focus:border-purple-500">
                    <div className="flex  flex-row  px-3 py-2 truncate border-none outline-none placeholder:text-gray-200 placeholder:text-[14px] placeholder:font-normal">
                      {approvers.map((approver ,index)=>(
                        <h3 key={index}>{approver.name},&nbsp;</h3>


                      ))}
                     
                    </div>
                  </div>
                </div>
              </div> */}
              <div className='h-[84px] overflow-auto'>
                {cashAdvanceData.map((amountDetails,index)=>(
                  <>
                  <div key={index} className='flex flex-start gap-6 mb-2 flex-col sm:flex-row'>

<div className='flex flex-col flex-start gap-2'>
  <div className='font-cabin text-[14px] font-medium text-[#333]'>
    Currency
  </div>
  <div className='w-[133px] h-[48px] border border-gray-600  rounded-[6px] py-3 px-4'>
    <div className='text-[#000] font-normal leading-normal'>
      {amountDetails.currency}
    </div>
  </div>

</div>
<div className='flex flex-col flex-start gap-2'>
  <div className='font-cabin text-[14px] font-medium text-[#333]'>
    Amount
  </div>
  <div className='w-[175px] h-[48px] border border-gray-600 rounded-[6px] py-3 px-4'>
    <div className='text-[#000] font-normal leading-normal'>
      {amountDetails.amount}
    </div>
  </div>

</div>
<div className='flex flex-col flex-start gap-2'>
  <div className='font-cabin text-[14px] font-medium text-[#333]'>
    Mode
  </div>
  <div className='w-[133px] h-[48px] border border-gray-600 rounded-[6px] py-3 px-4'>
    <div className='text-[#000] font-normal leading-normal'>
      {amountDetails.mode}
    </div>
  </div>

</div>
<div>
</div>
<div>
</div>

</div>
                  </>
                ))}
              
            
              </div>
              {violationMessage && ( <div className='text-purple-500 font-inter text-xs leading-normal mt-0'>
               <span className='font-semibold'>Note:</span> The amount you are requesting is above your group limit
              </div>)}
             

              <div className='flex '>
                {approverFLAG && (<div className='w-[133px] h-[19px]'>
                  <div>Approvers</div>
                  <div className=" h-[48px] w-[200px] mt-2 flex flex-row items-center justify-start border border-gray-600 rounded-md hover:border-purple-500 focus:border-purple-500">
                    <div className="flex  flex-row  px-3 py-2 truncate border-none outline-none placeholder:text-gray-200 placeholder:text-[14px] placeholder:font-normal">
                     

                      {approvers.map((approver ,index)=>(
                        <h3 key={index}>{approver.name},&nbsp;</h3>


                      ))}
                     
                    </div>
                  </div>
                </div>)}
               
                
            
               
              </div>
            </div>
          </div>
        </div>
        <div className='w-[194px]  mt-8 float-right' onClick={
          ()=>(handleSubmit(),
            onClose())
        }>
          <Button text='Submit Request' textAndBgColor='text-white bg-purple-500' />
        </div>
      </div>
    </div>
  );
};

export default Modal;

