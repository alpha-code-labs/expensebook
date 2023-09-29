



//Need to work on the code
import { useNavigate } from 'react-router-dom';
import {arrowLeft,chevronDown, frame505, } from '../assets/icon';

//MacBookAir-269
const EditCash = () => {
  const navigate= useNavigate();

  const onFrameContainer13Click = () => {
    // Use the navigate function to navigate to the desired link
    navigate("/macbookair145");
    //macbookair145
  };

  const onClickSkip =() => {
    navigate('/skip')
  }

 
  return (
    
    <div className="relative bg-white w-full h-[894px] overflow-hidden text-left text-base text-darkslategray-200 font-cabin">
      <div className="absolute top-[135px] left-[calc(50%_-_537px)] rounded-xl bg-white w-[1072px] h-[729px] overflow-hidden">
        <div className="absolute top-[32px] left-[29px] flex flex-row items-center justify-start gap-[16px] text-[20px] text-darkslategray-100">
          <img
            className="relative w-6 h-6 overflow-hidden shrink-0"
            alt=""
            src={arrowLeft}
          />
          <div className="flex flex-col items-start justify-start">
            <div className="relative tracking-[-0.04em] font-semibold">
              Modify Cash Advance
            </div>
          </div>
        </div>
        <div className="absolute top-[523px] left-[40px] text-sm font-medium" />
        <div className="absolute top-[88px] left-[29px] flex flex-col items-start justify-start gap-[16px]">
          <div className="relative font-medium">Request for cash advance</div>
          <div className="flex flex-row items-start justify-start gap-[24px] text-sm">
            <div className="flex flex-col items-start justify-start gap-[8px]">
              <div className="relative font-medium">Select Currency</div>
              <div className="relative w-[133px] h-12 text-black">
                <div className="absolute top-[0px] left-[0px] rounded-md bg-white box-border w-[133px] h-12 border-[1px] border-solid border-ebgrey-200">
                  <div className="absolute top-[12px] left-[16px] flex flex-row items-center justify-start gap-[24px]">
                    <div className="flex flex-row items-center justify-center">
                      <div className="flex flex-row items-center justify-center gap-[16px]">
                        <div className="relative">USD</div>
                        <div className="relative">$</div>
                      </div>
                    </div>
                    <img
                      className="relative w-6 h-6 overflow-hidden shrink-0"
                      alt=""
                      src={chevronDown}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-[8px]">
              <div className="relative font-medium">Enter amount</div>
              <div className="w-[175px] h-12 flex flex-row flex-wrap items-start justify-start text-justify text-ebgrey-400">
                <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-start py-2 px-6 relative border-[1px] border-solid border-ebgrey-200">
                  <div className="absolute my-0 mx-[!important] top-[16px] left-[24px] z-[0]">
                    Amount
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-[649px] left-[748px] rounded-13xl box-border h-12 flex flex-row items-center justify-center py-4 px-8 text-center text-eb-primary-blue-500 border-[1px] border-solid border-eb-primary-blue-500">
          <div className="relative font-medium inline-block w-[70px] h-5 shrink-0" onClick={onClickSkip}>
            Skip
          </div>
        </div>
      </div>
      <div
        className="absolute top-[784px] left-[1009px] rounded-13xl bg-eb-primary-blue-500 h-12 flex flex-row items-center justify-center py-4 px-8 box-border cursor-pointer text-center text-white"
        onClick={onFrameContainer13Click}
      >
        <div className="relative font-medium inline-block w-[70px] h-5 shrink-0">
          Continue
        </div>
      </div>
      <img
        className="absolute top-[43px] left-[calc(50%_-_536px)] w-[202px] h-[49px] overflow-hidden"
        alt=""
        src={frame505}
      />
    </div>
  );
};

export default EditCash;
