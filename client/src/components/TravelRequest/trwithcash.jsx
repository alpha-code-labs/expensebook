import { useNavigate } from "react-router-dom";
import { arrowLeft, arrowRight, chevronDown, group1, group2, vector1, vector5, x } from "../../assets/icon";


const TestingTravelRequestWithCash = () => {
    const navigate = useNavigate();
 
      
 const closeOnClick = () => {
    navigate('/')
 }

  return (
    <div className=" max-w-md mx-auto bg-white rounded-xl  shadow-md overflow-hidden md:max-w-2xl text-xs text-darkslategray-300 font-cabin">
      <div className="md:flex border-gray-200 border-[1px] overflow-hidden text-base text-white">
        <div className="absolute left-[(calc((100%-710px)/2))] top-2 border border-gray-200 rounded-3xl bg-white w-[710px] h-[759px] overflow-hidden">
          <div className="absolute top-[0px] left-[0px] bg-eb-primary-blue-300 w-[710px] h-[241px] overflow-hidden text-5xl">
            <img
              className="absolute h-[301.4%] w-[175.49%] top-[0%] right-[75.49%] bottom-[-201.4%] left-[0%] max-w-full overflow-hidden max-h-full"
              alt=""
              src={group1}
            />
            <img
              className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] max-w-full overflow-hidden max-h-full"
              alt=""
              src={group1}
            />
            <div className="absolute top-[40px] left-[calc(50%_-_110px)] flex flex-row items-center justify-start">
              <div className="flex flex-col items-start justify-start">
                <div className="relative tracking-[-0.04em] font-semibold">
                  Gurgaon Client Meeting
                </div>
              </div>
            </div>
            <div className="absolute top-[91px] left-[calc(50%_-_237px)] flex flex-row flex-wrap items-center justify-start gap-[40px]">
              <div className="relative rounded-xl bg-eb-primary-blue-500 w-[179px] h-[115px] overflow-hidden shrink-0">
                <div className="absolute top-[23px] left-[calc(50%_-_57.5px)] flex flex-col items-center justify-start gap-[8px]">
                  <div className="relative tracking-[-0.04em] font-semibold">{`Mumbai `}</div>
                  <img
                    className="relative w-[115px] h-px"
                    alt=""
                    src={vector5}
                  />
                  <div className="relative text-base tracking-[-0.04em] text-whitesmoke-300">
                    12 Aug 2023, Wed
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start justify-start gap-[24px]">
                <img
                  className="relative w-[39.5px] h-[22.09px]"
                  alt=""
                  src={arrowRight}
                />
                <img
                  className="relative w-[39.5px] h-[22.09px]"
                  alt=""
                  src={arrowLeft}
                />
              </div>
              <div className="relative rounded-xl bg-eb-primary-blue-500 w-[179px] h-[115px] overflow-hidden shrink-0">
                <div className="absolute top-[23px] left-[calc(50%_-_57.5px)] flex flex-col items-center justify-start gap-[8px]">
                  <div className="relative tracking-[-0.04em] font-semibold">
                    Delhi
                  </div>
                  <img
                    className="relative w-[115px] h-px"
                    alt=""
                    src={vector5}
                  />
                  <div className="relative text-base tracking-[-0.04em] text-whitesmoke-300">
                    12 Aug 2023, Wed
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img
            className="absolute top-[40px] right-[32px] w-6 h-6 overflow-hidden cursor-pointer"
            alt=""
            src={x}
          onClick={closeOnClick}/> 

          <div className="absolute top-[281px] left-5 w-[607px] flex flex-col items-start justify-start gap-[43px] text-ebgrey-500">
           {/* //flight details main */}
            <div className="self-stretch flex flex-col items-start justify-start gap-[15px]">
              <div className="flex flex-row items-end justify-start text-darkslategray-300">
                <div className="relative font-medium">Flight Details</div>
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[16px]">
                <div className="self-stretch rounded-xl bg-ebgrey-50 overflow-hidden flex flex-col items-start justify-start py-2.5 px-[88px]">
                  <div className="flex flex-row items-center justify-start gap-[56px]">
                    <div className="relative tracking-[-0.04em]">Mumbai</div>
                    <div className="flex flex-row items-start justify-start gap-[40px] text-xs text-ebgrey-400">
                      <div className="flex flex-col items-start justify-start gap-[8px]">
                        <div className="relative tracking-[-0.04em]">Date</div>
                        <div className="relative text-base tracking-[-0.04em] text-ebgrey-500">
                          12-Aug-2023
                        </div>
                      </div>
                      <div className="flex flex-col items-start justify-start gap-[8px]">
                        <div className="relative tracking-[-0.04em]">
                          Preferred Time
                        </div>
                        <div className="relative text-base tracking-[-0.04em] text-ebgrey-500">
                          4:00PM
                        </div>
                      </div>
                      <div className="flex flex-col items-start justify-start gap-[8px]">
                        <div className="relative tracking-[-0.04em]">
                          Booking Class
                        </div>
                        <div className="relative text-base tracking-[-0.04em] text-ebgrey-500">
                          Business
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* //violation message displayed below */}
                <div className="relative text-xs text-blueviolet inline-block w-[503px]">
                  Business class is not a part of your policy and can cause your
                  request to get rejected.
                </div>
              </div>

              {/* //Flight details */}
              <div className="self-stretch flex flex-col items-start justify-start gap-[16px]">
                <div className="self-stretch rounded-xl bg-ebgrey-50 overflow-hidden flex flex-col items-start justify-start py-2.5 px-[88px]">
                  <div className="flex flex-row items-center justify-start gap-[56px]">
                    <div className="relative tracking-[-0.04em]">Delhi</div>
                    <div className="flex flex-row items-start justify-start gap-[40px] text-xs text-ebgrey-400">
                      <div className="flex flex-col items-start justify-start gap-[8px]">
                        <div className="relative tracking-[-0.04em]">Date</div>
                        <div className="relative text-base tracking-[-0.04em] text-ebgrey-500">
                          12-Aug-2023
                        </div>
                      </div>
                      <div className="flex flex-col items-start justify-start gap-[8px]">
                        <div className="relative tracking-[-0.04em]">
                          Preferred Time
                        </div>
                        <div className="relative text-base tracking-[-0.04em] text-ebgrey-500">
                          4:00PM
                        </div>
                      </div>
                      <div className="flex flex-col items-start justify-start gap-[8px]">
                        <div className="relative tracking-[-0.04em]">
                          Booking Class
                        </div>
                        <div className="relative text-base tracking-[-0.04em] text-ebgrey-500">
                          Business
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* //violation is displayed here */}
                <div className="relative text-xs text-blueviolet inline-block w-[530px]">
                  Business class is not a part of your policy and can cause your
                  request to get rejected.
                </div>
              </div>
            </div>

            {/* //Hotel */}
            <div className="self-stretch flex flex-row items-start justify-start gap-[24px] text-darkslategray-300">
              <div className="flex flex-col items-start justify-start gap-[15px]">
                <div className="flex flex-row items-end justify-start">
                  <div className="relative font-medium">Hotel Request</div>
                </div>
                <div className="relative rounded-xl bg-ebgrey-50 w-[366px] h-[63px] overflow-hidden shrink-0 text-xs text-ebgrey-400">
                  <div className="absolute top-[calc(50%_-_9.5px)] left-[23px] text-base tracking-[-0.04em] text-ebgrey-500">
                    Delhi
                  </div>
                  <div className="absolute top-[11px] left-[114px] flex flex-col items-start justify-start gap-[8px]">
                    <div className="relative tracking-[-0.04em]">Check In</div>
                    <div className="relative text-base tracking-[-0.04em] text-ebgrey-500">
                      12-Aug-2023
                    </div>
                  </div>
                  <div className="absolute top-[11px] left-[237px] flex flex-col items-start justify-start gap-[8px]">
                    <div className="relative tracking-[-0.04em]">Check Out</div>
                    <div className="relative text-base tracking-[-0.04em] text-ebgrey-500">
                      15-Aug-2023
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-start justify-start gap-[15px]">
                <div className="flex flex-row items-end justify-start">
                  <div className="relative font-medium">Cab Request</div>
                </div>
                <div className="self-stretch relative rounded-xl bg-ebgrey-50 h-[63px] overflow-hidden shrink-0 text-ebgrey-500">
                  <div className="absolute top-[22px] left-[calc(50%_-_67.5px)] tracking-[-0.04em]">
                    12 Aug, 15 Aug, 23 Aug
                  </div>
                </div>
              </div>
            </div>

          </div>
            {/* //add this part of the code and push below part of code after this part styling is adjusted to fit in. */}
             <div className="self-stretch flex flex-col items-start justify-start gap-[15px]">
              <div className="flex flex-row items-end justify-start text-darkslategray-300">
                <div className="relative font-medium">Cash Advance</div>
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[16px]">
                <div className="self-stretch rounded-xl bg-ebgrey-50 overflow-hidden flex flex-col items-start justify-start py-2.5 px-[88px]">
                  <div className="flex flex-row items-center justify-start gap-[56px]">
                    <div className="relative tracking-[-0.04em]">Mumbai</div>
                    <div className="flex flex-row items-start justify-start gap-[40px] text-xs text-ebgrey-400">
                      <div className="flex flex-col items-start justify-start gap-[8px]">
                        <div className="relative tracking-[-0.04em]">Date</div>
                        <div className="relative text-base tracking-[-0.04em] text-ebgrey-500">
                          12-Aug-2023
                        </div>
                      </div>
                      <div className="flex flex-col items-start justify-start gap-[8px]">
                        <div className="relative tracking-[-0.04em]">
                          Preferred Time
                        </div>
                        <div className="relative text-base tracking-[-0.04em] text-ebgrey-500">
                          4:00PM
                        </div>
                      </div>
                      <div className="flex flex-col items-start justify-start gap-[8px]">
                        <div className="relative tracking-[-0.04em]">
                          Booking Class
                        </div>
                        <div className="relative text-base tracking-[-0.04em] text-ebgrey-500">
                          Business
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* //violation message displayed below */}
                <div className="relative text-xs text-blueviolet inline-block w-[503px]">
                  Business class is not a part of your policy and can cause your
                  request to get rejected.
                </div>
              </div>
             </div>



          <div>
          <div className="absolute text-eb-primary-blue-500 bottom-[31px] left-[326px] rounded-full box-border border-[1px] h-12 flex 
          flex-row cursor-pointer items-center justify-center py-4 px-8 text-center border-solid  
           border-eb-primary-blue-500 hover:border-red-700 hover:bg-[#ffc2c6] hover:text-red-700 font-medium">
  <div className="relative font-medium inline-block w-[70px] h-5 shrink-0">
    Reject
  </div>
</div>
       <div className="absolute text-eb-primary-blue-500 bottom-[31px] left-[484px] rounded-full  box-border border-[1px] h-12 flex
        flex-row cursor-pointer items-center justify-center py-4 px-8 text-center border-solid  
         border-eb-primary-blue-500 hover:text-green-700 hover:bg-[#7BEB9E] hover:border-green-700 w-[194px]  font-medium">
  <div className="flex-1 relative font-medium inline-block h-5 hover:text-green-700">
    Approve
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingTravelRequestWithCash;






