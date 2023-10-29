import { alertCircle, calendar, calender1 } from "../../assets/icon"


const CashAdvanceApproval = () => {

    return(
        <div className="relative rounded-2xl bg-white box-border w-[912px] h-[418px] overflow-hidden shrink-0 text-black border-[1px] border-solid border-gainsboro-200">
            <div className="absolute top-[24px] left-[25px] text-base">
              Cash Advance Request
            </div>

            <div className="absolute top-[224px] left-[591px] rounded-lg bg-white box-border w-[301px] h-8 overflow-hidden text-blueviolet border-[1px] border-solid border-ebgrey-100">
              <div className="absolute top-[calc(50%_-_7px)] left-[11px]">
                <span className="font-medium">{`Note: `}</span>
                <span>This request violates this employees group limit.</span>
              </div>
            </div>

            <div className="absolute top-[170px] left-[0px] flex flex-col items-start justify-start gap-[8px] text-sm text-ebgrey-600">
              <div className="bg-white flex flex-row items-start justify-center gap-[24px]">
                <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
                  <div className="absolute top-[calc(50%_-_8px)] left-[27px] font-medium">
                    Employee Name
                  </div>
                </div>
                <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
                  <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_31px)] font-medium">
                    Trip Name
                  </div>
                </div>
                <div className="relative w-60 h-14 overflow-hidden shrink-0">
                  <div className="absolute top-[20px] left-[calc(50%_-_32px)] font-medium">
                    Dates
                  </div>
                </div>
                <div className="relative w-[94px] h-14 overflow-hidden shrink-0">
                  <div className="absolute top-[20px] left-[calc(50%_-_27px)] font-medium">
                    Amount
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end justify-start gap-[8px] text-darkslategray">
                <div className="bg-white flex flex-row items-start justify-center gap-[24px] border-b-[1px] border-solid border-ebgrey-100">
                  <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
                    <div className="absolute top-[calc(50%_-_9px)] left-[calc(50%_-_42px)] font-medium">
                      Mayank Singh
                    </div>
                  </div>
                  <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
                    <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_61px)] font-medium">
                      Gurgaon Conference
                    </div>
                  </div>
                  <div className="relative w-60 h-14 overflow-hidden shrink-0 text-xs text-dimgray">
                    <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_91px)] flex flex-row items-end justify-start gap-[4px]">
                      <img
                        className="relative w-4 h-4 overflow-hidden shrink-0"
                        alt=""
                        src={calendar}
                      />
                      <div className="flex flex-row items-start justify-start gap-[8px]">
                        <div className="relative font-medium">12-Aug-2023</div>
                        <div className="relative">{`to `}</div>
                        <div className="relative font-medium">15-Aug-2023</div>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-[94px] h-14 overflow-hidden shrink-0 text-ebgrey-500">
                    <div className="absolute top-[20px] left-[calc(50%_-_34px)] flex flex-row items-end justify-start">
                      <div className="relative font-semibold">₹25,000.0</div>
                    </div>
                  </div>
                  <div className="relative w-[197px] h-14 overflow-hidden shrink-0 text-center text-white">
                    <div className="absolute top-[calc(50%_-_17px)] left-[calc(50%_-_90px)] flex flex-row items-start justify-start gap-[8px]">
                      <button
                        className="cursor-pointer [border:none] py-4 px-8 bg-darkseagreen rounded-29xl w-[86px] h-[34px] flex flex-row items-center justify-center box-border"
                        autoFocus={true}
                      >
                        <button
                          className="cursor-pointer [border:none] p-0 bg-[transparent] relative text-sm font-medium font-cabin text-white text-center flex items-center justify-center w-[54px] h-[18px] shrink-0"
                          autoFocus={true}
                        >
                          Approve
                        </button>
                      </button>
                      <div className="rounded-29xl bg-lightcoral-200 w-[86px] h-[34px] flex flex-row items-center justify-center py-4 px-8 box-border">
                        <div className="relative font-medium flex items-center justify-center w-[54px] h-[18px] shrink-0">
                          Deny
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-start gap-[8px] text-darkslategray">
                <div className="bg-white flex flex-row items-start justify-center gap-[24px] border-b-[1px] border-solid border-ebgrey-100">
                  <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
                    <div className="absolute top-[calc(50%_-_9px)] left-[calc(50%_-_42px)] font-medium">
                      Mayank Singh
                    </div>
                  </div>
                  <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
                    <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_41px)] font-medium">
                      Pune Meeting
                    </div>
                  </div>
                  <div className="relative w-60 h-14 overflow-hidden shrink-0 text-xs text-dimgray">
                    <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_91px)] flex flex-row items-end justify-start gap-[4px]">
                      <img
                        className="relative w-4 h-4 overflow-hidden shrink-0"
                        alt=""
                        src={calender1}
                      />
                      <div className="flex flex-row items-start justify-start gap-[8px]">
                        <div className="relative font-medium">12-Aug-2023</div>
                        <div className="relative">{`to `}</div>
                        <div className="relative font-medium">15-Aug-2023</div>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-[94px] h-14 overflow-hidden shrink-0 text-eb-primary-blue-500">
                    <div className="absolute top-[20px] left-[calc(50%_-_43px)] flex flex-row items-end justify-start gap-[2px]">
                      <img
                        className="relative w-4 h-4 overflow-hidden shrink-0"
                        alt=""
                        src={alertCircle}
                      />
                      <div className="relative font-semibold">₹25,000.0</div>
                    </div>
                  </div>
                  <div className="relative w-[197px] h-14 overflow-hidden shrink-0 text-center text-white">
                    <div className="absolute top-[calc(50%_-_17px)] left-[calc(50%_-_90px)] flex flex-row items-start justify-start gap-[8px]">
                      <button className="cursor-pointer [border:none] py-4 px-8 bg-darkseagreen rounded-29xl w-[86px] h-[34px] flex flex-row items-center justify-center box-border">
                        <div className="relative text-sm font-medium font-cabin text-white text-center flex items-center justify-center w-[54px] h-[18px] shrink-0">
                          Approve
                        </div>
                      </button>
                      <div className="rounded-29xl bg-lightcoral-200 w-[86px] h-[34px] flex flex-row items-center justify-center py-4 px-8 box-border">
                        <div className="relative font-medium flex items-center justify-center w-[54px] h-[18px] shrink-0">
                          Deny
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>









                <div  className="bg-white flex flex-row items-start justify-center gap-[24px]">
                  <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
                    <div className="absolute top-[calc(50%_-_9px)] left-[calc(50%_-_42px)] font-medium">
                      Mayank Singh
                    </div>
                  </div>
                  <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
                    <div className="absolute top-[calc(50%_-_8px)] left-[8.2px] font-medium">
                      Gurgaon Conference
                    </div>
                  </div>
                  <div className="relative w-60 h-14 overflow-hidden shrink-0 text-xs text-dimgray">
                    <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_91px)] flex flex-row items-end justify-start gap-[4px]">
                      <img
                        className="relative w-4 h-4 overflow-hidden shrink-0"
                        alt=""
                        src={calendar}
                      />
                      <div className="flex flex-row items-start justify-start gap-[8px]">
                        <div className="relative font-medium">12-Aug-2023</div>
                        <div className="relative">{`to `}</div>
                        <div className="relative font-medium">15-Aug-2023</div>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-[94px] h-14 overflow-hidden shrink-0 text-ebgrey-500">
                    <div className="absolute top-[20px] left-[calc(50%_-_34px)] flex flex-row items-end justify-start">
                      <div className="relative font-semibold">₹25,000.0</div>
                    </div>
                  </div>
                  <div className="relative w-[197px] h-14 overflow-hidden shrink-0 text-center text-white">
                    <div className="absolute top-[calc(50%_-_17px)] left-[calc(50%_-_90px)] flex flex-row items-start justify-start gap-[8px]">
                      <div className="rounded-29xl bg-darkseagreen w-[86px] h-[34px] flex flex-row items-center justify-center py-4 px-8 box-border">
                        <div className="relative font-medium flex items-center justify-center w-[54px] h-[18px] shrink-0">
                          Approve
                        </div>
                      </div>
                      <div className="rounded-29xl bg-lightcoral-200 w-[86px] h-[34px] flex flex-row items-center justify-center py-4 px-8 box-border">
                        <div className="relative font-medium flex items-center justify-center w-[54px] h-[18px] shrink-0">
                          Deny
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div className="absolute top-[59px] left-[25px] flex flex-col items-start justify-center gap-[8px] text-darkslategray">
              <div className="relative font-medium">Search by Employee</div>
              <div className="w-[175px] h-10 flex flex-row flex-wrap items-start justify-center text-justify text-sm text-ebgrey-400">
                <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-start justify-center py-2 px-6 relative border-[1px] border-solid border-ebgrey-200">
                  <div className="absolute my-0 mx-[!important] top-[11px] left-[31px] z-[0]">
                    Employee Name
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-[145.5px] left-[16.5px] box-border w-[883px] h-px border-t-[1px] border-solid border-ebgrey-100" />
          </div>
    )
}

export default CashAdvanceApproval