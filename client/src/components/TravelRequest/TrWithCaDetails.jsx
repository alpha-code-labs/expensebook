import { arrowLeft, arrowRight, frame505, teenyIconDocSolid, upload, vector5 } from "../../assets/icon";

const TRwithCaDetails = () => {
    return (
      <div className="relative bg-whitesmoke-200 w-full h-[1769px] overflow-hidden text-left text-base text-darkslategray-200 font-cabin">
        <div className="absolute top-[119px] left-[calc(50%_-_536px)] rounded-xl bg-white w-[1072px] h-[1546px] overflow-hidden">
          <div className="absolute top-[32px] left-[32px] flex flex-row items-center justify-start gap-[16px] text-[20px] text-darkslategray-100">
            <img
              className="relative w-6 h-6 overflow-hidden shrink-0"
              alt=""
              src={arrowLeft}
            />
            <div className="flex flex-col items-start justify-start">
              <div className="relative tracking-[-0.04em] font-semibold">
                Upload Flight Details
              </div>
            </div>
          </div>
          <div className="absolute top-[523px] left-[40px] text-sm tracking-[0.03em] font-medium" />
          <div className="absolute top-[80px] left-[37px] flex flex-col items-start justify-start">
            <div className="flex flex-col items-start justify-start gap-[24px]">
              <div className="flex flex-col items-start justify-start gap-[8px]">
                <div className="relative tracking-[0.03em] font-medium">
                  Mayank Singh
                </div>
                <div className="relative text-xs tracking-[0.03em] text-ebgrey-600">
                  Sr.Manager
                </div>
              </div>
              <div className="relative rounded-13xl bg-eb-primary-blue-300 w-[1003px] h-[241px] overflow-hidden shrink-0 text-5xl text-white">
                <img
                  className="absolute h-[301.4%] w-[212.21%] top-[0%] right-[-112.21%] bottom-[-201.4%] left-[0%] max-w-full overflow-hidden max-h-full"
                  alt=""
                  src="/group-1.svg"
                />
                <img
                  className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] max-w-full overflow-hidden max-h-full"
                  alt=""
                  src="/group-2.svg"
                />
                <div className="absolute top-[40px] left-[calc(50%_-_109.5px)] flex flex-row items-center justify-start">
                  <div className="flex flex-col items-start justify-start">
                    <div className="relative tracking-[-0.04em] font-semibold">
                      Gurgaon Client Meeting
                    </div>
                  </div>
                </div>
                <div className="absolute top-[91px] left-[calc(50%_-_236.5px)] flex flex-row flex-wrap items-center justify-start gap-[40px] text-base text-whitesmoke-300">
                  <div className="relative rounded-xl bg-eb-primary-blue-500 w-[179px] h-[115px] overflow-hidden shrink-0">
                    <div className="absolute top-[12px] left-[calc(50%_-_57.5px)] flex flex-col items-center justify-start gap-[8px]">
                      <div className="relative text-5xl tracking-[-0.04em] font-semibold text-white">{`Mumbai `}</div>
                      <img
                        className="relative w-[115px] h-px"
                        alt=""
                        src={vector5}
                      />
                      <div className="relative tracking-[-0.04em]">
                        12 Aug 2023, Wed
                      </div>
                      <div className="relative tracking-[-0.04em]">6:00PM</div>
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
                    <div className="absolute top-[12px] left-[calc(50%_-_57.5px)] flex flex-col items-center justify-start gap-[8px]">
                      <div className="relative text-5xl tracking-[-0.04em] font-semibold text-white">
                        Delhi
                      </div>
                      <img
                        className="relative w-[115px] h-px"
                        alt=""
                        src={vector5}
                      />
                      <div className="relative tracking-[-0.04em]">
                        12 Aug 2023, Wed
                      </div>
                      <div className="relative tracking-[-0.04em]">12:00PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-[427px] left-[38px] flex flex-col items-start justify-start gap-[43px]">
            <div className="w-[1003px] flex flex-col items-start justify-start">
              <div className="self-stretch flex flex-col items-start justify-start gap-[15px]">
                <div className="flex flex-row items-end justify-start">
                  <div className="relative font-medium">Flight Details</div>
                </div>
                <div className="self-stretch flex flex-col items-start justify-start gap-[16px] text-ebgrey-500">
                  <div className="self-stretch rounded-xl bg-ebgrey-50 overflow-hidden flex flex-col items-center justify-center py-2.5 px-[88px] gap-[8px]">
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
                    <div className="relative text-xs text-blueviolet text-right inline-block w-[415px]">
                      Air class request is beyond user’s group.
                    </div>
                  </div>
                  <div className="flex flex-row items-end justify-start gap-[24px] text-darkslategray-200">
                    <div className="flex flex-col items-start justify-start gap-[16px]">
                      <div className="relative font-medium">Uploaded Ticket</div>
                      <div className="rounded-md bg-whitesmoke-100 box-border w-[280px] h-[72px] flex flex-row items-center justify-center py-2 px-6 text-center text-sm text-dimgray border-[1px] border-dashed border-darkgray">
                        <div className="w-[163px] flex flex-col items-center justify-center gap-[16px]">
                          <img
                            className="relative w-6 h-6 overflow-hidden shrink-0"
                            alt=""
                            src={upload}
                          />
                          <div className="relative tracking-[-0.04em] inline-block w-[229px]">
                            <span>{`Drag and drop or `}</span>
                            <span className="[text-decoration:underline] text-blueviolet">
                              Browse
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row items-start justify-start text-xs text-black">
                      <div className="flex flex-col items-center justify-start gap-[4px]">
                        <img
                          className="relative w-12 h-12 overflow-hidden shrink-0"
                          alt=""
                          src={teenyIconDocSolid}
                        />
                        <div className="relative font-medium">Vistara EQ1...</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[1003px] flex flex-col items-start justify-start">
              <div className="self-stretch flex flex-col items-start justify-start gap-[15px]">
                <div className="flex flex-row items-end justify-start">
                  <div className="relative font-medium">Flight Details</div>
                </div>
                <div className="self-stretch flex flex-col items-start justify-start gap-[16px] text-ebgrey-500">
                  <div className="self-stretch rounded-xl bg-ebgrey-50 overflow-hidden flex flex-col items-center justify-start py-2.5 px-[88px] gap-[8px]">
                    <div className="flex flex-row items-center justify-start gap-[56px]">
                      <div className="relative tracking-[-0.04em]">Delhi</div>
                      <div className="flex flex-row items-start justify-start gap-[40px] text-xs text-ebgrey-400">
                        <div className="flex flex-col items-start justify-start gap-[8px]">
                          <div className="relative tracking-[-0.04em]">Date</div>
                          <div className="relative text-base tracking-[-0.04em] text-ebgrey-500">
                            16-Aug-2023
                          </div>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-[8px]">
                          <div className="relative tracking-[-0.04em]">
                            Preferred Time
                          </div>
                          <div className="relative text-base tracking-[-0.04em] text-ebgrey-500">
                            5:00PM
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
                    <div className="relative text-xs text-blueviolet text-right inline-block w-[415px]">
                      Air class request is beyond user’s group.
                    </div>
                  </div>
                  <div className="flex flex-row items-end justify-start gap-[24px] text-darkslategray-200">
                    <div className="flex flex-col items-start justify-start gap-[16px]">
                      <div className="relative font-medium">Uploaded Ticket</div>
                      <div className="rounded-md bg-whitesmoke-100 box-border w-[280px] h-[72px] flex flex-row items-center justify-center py-2 px-6 text-center text-sm text-dimgray border-[1px] border-dashed border-darkgray">
                        <div className="w-[163px] flex flex-col items-center justify-center gap-[16px]">
                          <img
                            className="relative w-6 h-6 overflow-hidden shrink-0"
                            alt=""
                            src="/upload1.svg"
                          />
                          <div className="relative tracking-[-0.04em] inline-block w-[229px]">
                            <span>{`Drag and drop or `}</span>
                            <span className="[text-decoration:underline] text-blueviolet">
                              Browse
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row items-start justify-start text-xs text-black">
                      <div className="flex flex-col items-center justify-start gap-[4px]">
                        <img
                          className="relative w-12 h-12 overflow-hidden shrink-0"
                          alt=""
                          src={teenyIconDocSolid}
                        />
                        <div className="relative font-medium">Vistara EQ1...</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[1003px] flex flex-col items-start justify-start gap-[24px]">
              <div className="w-[1003px] flex flex-col items-start justify-start gap-[15px]">
                <div className="flex flex-row items-end justify-start">
                  <div className="relative font-medium">Hotel Request</div>
                </div>
                <div className="self-stretch relative rounded-xl bg-ebgrey-50 h-[63px] overflow-hidden shrink-0 text-xs text-ebgrey-400">
                  <div className="absolute top-[calc(50%_-_9.5px)] left-[352px] text-base tracking-[-0.04em] text-ebgrey-500">
                    Delhi
                  </div>
                  <div className="absolute top-[11px] left-[443px] flex flex-col items-start justify-start gap-[8px]">
                    <div className="relative tracking-[-0.04em]">Check In</div>
                    <div className="relative text-base tracking-[-0.04em] text-ebgrey-500">
                      12-Aug-2023
                    </div>
                  </div>
                  <div className="absolute top-[11px] left-[566px] flex flex-col items-start justify-start gap-[8px]">
                    <div className="relative tracking-[-0.04em]">Check Out</div>
                    <div className="relative text-base tracking-[-0.04em] text-ebgrey-500">
                      15-Aug-2023
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-end justify-start gap-[24px]">
                  <div className="flex flex-col items-start justify-start gap-[16px]">
                    <div className="relative font-medium">Hotel Details</div>
                    <div className="rounded-md bg-whitesmoke-100 box-border w-[280px] h-[72px] flex flex-row items-center justify-center py-2 px-6 text-center text-sm text-dimgray border-[1px] border-dashed border-darkgray">
                      <div className="w-[163px] flex flex-col items-center justify-center gap-[16px]">
                        <img
                          className="relative w-6 h-6 overflow-hidden shrink-0"
                          alt=""
                          src={upload}
                        />
                        <div className="relative tracking-[-0.04em] inline-block w-[229px]">
                          <span>{`Drag and drop or `}</span>
                          <span className="[text-decoration:underline] text-blueviolet">
                            Browse
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-start justify-start text-xs text-black">
                    <div className="flex flex-col items-center justify-start gap-[4px]">
                      <img
                        className="relative w-12 h-12 overflow-hidden shrink-0"
                        alt=""
                        src={teenyIconDocSolid}
                      />
                      <div className="relative font-medium">Vistara EQ1...</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[15px]">
                <div className="flex flex-row items-end justify-start">
                  <div className="relative font-medium">Cab Request</div>
                </div>
                <div className="self-stretch relative rounded-xl bg-ebgrey-50 h-[63px] overflow-hidden shrink-0 text-ebgrey-500">
                  <div className="absolute top-[22px] left-[calc(50%_-_67.5px)] tracking-[-0.04em]">
                    12 Aug, 15 Aug, 23 Aug
                  </div>
                </div>
                <div className="flex flex-row items-end justify-start gap-[24px]">
                  <div className="flex flex-col items-start justify-start gap-[16px]">
                    <div className="relative font-medium">Cab Details</div>
                    <div className="rounded-md bg-whitesmoke-100 box-border w-[280px] h-[72px] flex flex-row items-center justify-center py-2 px-6 text-center text-sm text-dimgray border-[1px] border-dashed border-darkgray">
                      <div className="w-[163px] flex flex-col items-center justify-center gap-[16px]">
                        <img
                          className="relative w-6 h-6 overflow-hidden shrink-0"
                          alt=""
                          src={upload}
                        />
                        <div className="relative tracking-[-0.04em] inline-block w-[229px]">
                          <span>{`Drag and drop or `}</span>
                          <span className="[text-decoration:underline] text-blueviolet">
                          ₹{item.TotalAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-start justify-start text-xs text-black">
                    <div className="flex flex-col items-center justify-start gap-[4px]">
                      <img
                        className="relative w-12 h-12 overflow-hidden shrink-0"
                        alt=""
                        src={teenyIconDocSolid}
                      />
                      <div className="relative font-medium">Vistara EQ1...</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute right-[24px] bottom-[32px] rounded-13xl bg-eb-primary-blue-500 h-12 flex flex-row items-center justify-center py-4 px-8 box-border text-center text-white">
            <div className="relative font-medium inline-block w-[70px] h-5 shrink-0">
              Continue
            </div>
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
  
  export default TRwithCaDetails;
  