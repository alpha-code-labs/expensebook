import React, { useState } from 'react';




const Group = () => {


  return (
    <div className="relative bg-white w-full h-[1068px] overflow-hidden text-left text-base text-white font-cabin">
      <div className="absolute top-[160px] left-[104px] rounded-xl bg-white w-[1072px] h-[897px] overflow-hidden">
        <div className="absolute top-[825px] left-[24px] rounded-13xl bg-eb-primary-blue-500 w-[342px] h-12 flex flex-row items-center justify-center p-4 box-border">
          <div className="relative font-medium">
            
            Create Group</div>
        </div>
        <div className="absolute top-[40px] left-[24px] flex flex-col items-start justify-start gap-[40px] text-[18px] text-ebgrey-500">
          <div className="flex flex-col items-start justify-start gap-[24px]">
            <div className="flex flex-col items-start justify-start gap-[24px]">
              <div className="relative tracking-[-0.02em] font-medium">
                Apply filters to set groups
              </div>
              <div className="w-[951px] flex flex-row items-start justify-start gap-[40px] text-sm text-gray">
                <div className="w-[214px] flex flex-col items-start justify-start gap-[8px]">
                  <div className="relative font-medium">Designation</div>
                  <div className="self-stretch h-12 flex flex-row flex-wrap items-start justify-start text-darkgray-200">
                    <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-between py-2 px-6 border-[1px] border-solid border-gainsboro-300">
                      <div className="flex-1 flex flex-row items-center justify-between">
                        <div className="relative">Select Category</div>
                        <img
                          className="relative w-6 h-6 overflow-hidden shrink-0"
                          alt=""
                          src="/chevrondown.svg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[203px] flex flex-col items-start justify-start gap-[8px]">
                  <div className="relative font-medium">Location</div>
                  <div className="self-stretch rounded-md bg-white box-border h-12 overflow-hidden shrink-0 flex flex-col items-start justify-center py-3 px-4 text-darkgray-200 border-[1px] border-solid border-gainsboro-300">
                    <div className="flex flex-row items-center justify-center gap-[8px]">
                      <img
                        className="relative w-4 h-4 overflow-hidden shrink-0"
                        alt=""
                        src="/mappin.svg"
                      />
                      <div className="relative inline-block w-[107px] shrink-0">
                        Enter Location
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[207px] flex flex-col items-start justify-start gap-[8px]">
                  <div className="relative font-medium">
                    Years of experience
                  </div>
                  <div className="self-stretch h-12 flex flex-row flex-wrap items-start justify-start text-darkgray-200">
                    <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-between py-2 px-6 border-[1px] border-solid border-gainsboro-300">
                      <div className="flex-1 flex flex-row items-center justify-between">
                        <div className="relative">Select Years</div>
                        <img
                          className="relative w-6 h-6 overflow-hidden shrink-0"
                          alt=""
                          src="/chevrondown.svg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-1 flex flex-col items-start justify-start gap-[8px]">
                  <div className="relative font-medium">Name of manager</div>
                  <div className="self-stretch rounded-md bg-white box-border h-12 overflow-hidden shrink-0 flex flex-col items-start justify-center py-3 px-4 text-darkgray-200 border-[1px] border-solid border-darkgray-100">
                    <div className="flex flex-row items-center justify-center gap-[16px]">
                      <img
                        className="relative w-4 h-4 overflow-hidden shrink-0"
                        alt=""
                        src="/search.svg"
                      />
                      <div className="flex flex-row items-center justify-start">
                        <div className="relative">Select Years</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-13xl bg-eb-primary-blue-500 h-10 flex flex-row items-center justify-center py-4 px-8 box-border text-base text-white">
              <div className="relative font-medium">Apply Filters</div>
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-[40px] text-sm text-dimgray">
            <div className="relative box-border w-[1025px] h-px border-t-[1px] border-solid border-gainsboro-200" />
            <div className="flex flex-col items-start justify-start gap-[32px]">
              <div className="relative rounded-xl bg-white box-border w-[1024px] h-[385px] border-[1px] border-solid border-gainsboro-100">
                <div className="absolute top-[32px] left-[calc(50%_-_390px)] flex flex-row items-center justify-start gap-[112px]">
                  <div className="flex flex-col items-start justify-start gap-[32px]">
                    <div className="relative box-border w-4 h-4 overflow-hidden shrink-0 border-[1px] border-solid border-darkgray-200" />
                    <img
                      className="relative w-4 h-4 overflow-hidden shrink-0"
                      alt=""
                      src="/frame-325.svg"
                    />
                    <img
                      className="relative w-4 h-4 overflow-hidden shrink-0"
                      alt=""
                      src="/frame-325.svg"
                    />
                    <img
                      className="relative w-4 h-4 overflow-hidden shrink-0"
                      alt=""
                      src="/frame-325.svg"
                    />
                    <img
                      className="relative w-4 h-4 overflow-hidden shrink-0"
                      alt=""
                      src="/frame-325.svg"
                    />
                    <img
                      className="relative w-4 h-4 overflow-hidden shrink-0"
                      alt=""
                      src="/frame-325.svg"
                    />
                    <div className="relative box-border w-4 h-4 overflow-hidden shrink-0 border-[1px] border-solid border-darkgray-200" />
                  </div>
                  <div className="flex flex-col items-start justify-start gap-[24px]">
                    <div className="flex flex-col items-center justify-start">
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_38.08px)] tracking-[-0.04em]">
                          Employee ID
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-[16px] text-ebgrey-500">
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_19.83px)] tracking-[-0.04em]">
                          12032
                        </div>
                      </div>
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_19.83px)] tracking-[-0.04em]">
                          12033
                        </div>
                      </div>
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_19.83px)] tracking-[-0.04em]">
                          12034
                        </div>
                      </div>
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_19.83px)] tracking-[-0.04em]">
                          12035
                        </div>
                      </div>
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_19.83px)] tracking-[-0.04em]">
                          12036
                        </div>
                      </div>
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_19.83px)] tracking-[-0.04em]">
                          12037
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-start gap-[24px]">
                    <div className="flex flex-col items-start justify-start">
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_19px)] tracking-[-0.04em]">
                          Name
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-[16px] text-ebgrey-500">
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_43.5px)] tracking-[-0.04em]">
                          Deepak Singh
                        </div>
                      </div>
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_31.5px)] tracking-[-0.04em]">
                          Smit Patel
                        </div>
                      </div>
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_42.5px)] tracking-[-0.04em]">
                          Alakh Pandey
                        </div>
                      </div>
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_40.5px)] tracking-[-0.04em]">
                          Shivam Rana
                        </div>
                      </div>
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_40.5px)] tracking-[-0.04em]">
                          Aakash Shah
                        </div>
                      </div>
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_42.5px)] tracking-[-0.04em]">
                          Shlok Sharma
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-start gap-[24px]">
                    <div className="flex flex-col items-center justify-start">
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_36.25px)] tracking-[-0.04em]">
                          Designation
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-[16px] text-ebgrey-500">
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_28.17px)] tracking-[-0.04em]">
                          Designer
                        </div>
                      </div>
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_28.17px)] tracking-[-0.04em]">
                          Designer
                        </div>
                      </div>
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_28.17px)] tracking-[-0.04em]">
                          Designer
                        </div>
                      </div>
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_28.17px)] tracking-[-0.04em]">
                          Designer
                        </div>
                      </div>
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_28.17px)] tracking-[-0.04em]">
                          Designer
                        </div>
                      </div>
                      <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_28.17px)] tracking-[-0.04em]">
                          Designer
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[342px] flex flex-col items-start justify-start gap-[8px] text-darkslategray">
                <div className="relative font-medium">Group Name</div>
                <div className="self-stretch h-12 flex flex-row flex-wrap items-start justify-start text-base text-darkgray-200">
                  <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-start py-2 px-6 border-[1px] border-solid border-darkgray-200">
                    <div className="relative">Eg. Pied Piper</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        className="absolute top-[80px] left-[calc(50%_-_536px)] w-[229px] h-[55px] overflow-hidden"
        alt=""
        src="/frame-505.svg"
      />
    </div>
  );
};

export default Group;
