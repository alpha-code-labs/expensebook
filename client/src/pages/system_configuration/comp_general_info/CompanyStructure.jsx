const CompanyStructure = () => {
    return (
      <div className="relative bg-white w-full h-[2173px] overflow-hidden text-left text-base text-ebgrey-500 font-cabin">
        <div className="absolute top-[133px] left-[144px] flex flex-row items-center justify-start gap-[8px]">
          <img
            className="relative w-6 h-6 overflow-hidden shrink-0"
            alt=""
            src="/briefcase.svg"
          />
          <div className="relative tracking-[-0.04em] font-medium">
            Configure Company Structure
          </div>
        </div>
        <img
          className="absolute top-[133px] left-[104px] w-6 h-[25px] overflow-hidden"
          alt=""
          src="/arrowleft.svg"
        />
        <div className="absolute top-[181px] left-[105px] flex flex-col items-start justify-start gap-[16px]">
          <div className="rounded-xl bg-white box-border w-[1040px] overflow-hidden flex flex-row items-center justify-between p-6 border-[1px] border-solid border-gainsboro-200">
            <div className="flex flex-col items-center justify-start">
              <div className="flex flex-row items-center justify-start">
                <div className="relative tracking-[-0.04em] font-medium">{`Cost Center `}</div>
              </div>
            </div>
            <img
              className="relative w-6 h-6 overflow-hidden shrink-0"
              alt=""
              src="/chevrondown.svg"
            />
          </div>
          <div className="self-stretch relative rounded-xl bg-white box-border h-[882px] overflow-hidden shrink-0 text-center text-eb-primary-blue-500 border-[1px] border-solid border-gainsboro-200">
            <div className="absolute top-[25px] left-[24px] flex flex-col items-start justify-start text-left text-ebgrey-500">
              <div className="flex flex-row items-center justify-start">
                <div className="relative tracking-[-0.04em] font-medium">
                  Legal Entity
                </div>
              </div>
            </div>
            <img
              className="absolute top-[calc(50%_-_418px)] left-[992px] w-6 h-6 overflow-hidden"
              alt=""
              src="/chevrondown1.svg"
            />
            <div className="absolute top-[229px] left-[calc(50%_-_434px)] rounded-2xl bg-white box-border w-[868px] h-[546px] text-white border-[1px] border-solid border-gainsboro-300">
              <div className="absolute top-[24px] left-[calc(50%_-_221px)] flex flex-col items-start justify-start gap-[24px] text-left text-sm text-ebgrey-400">
                <div className="flex flex-row items-center justify-start gap-[128px]">
                  <div className="flex flex-col items-center justify-start">
                    <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                      <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_59px)] tracking-[-0.04em]">
                        C-Level Executives
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-start justify-start">
                    <div className="rounded-md flex flex-row items-center justify-start">
                      <input
                        className="font-cabin text-sm bg-white relative rounded-md box-border w-[172px] h-[34px] overflow-hidden shrink-0 border-[1px] border-solid border-darkgray"
                        placeholder="500"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-start gap-[128px]">
                  <div className="flex flex-col items-center justify-start">
                    <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                      <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_59px)] tracking-[-0.04em]">
                        Senior Partners
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-start justify-start">
                    <div className="flex flex-row items-center justify-start">
                      <input
                        className="font-cabin text-sm bg-white relative rounded-md box-border w-[172px] h-[34px] overflow-hidden shrink-0 border-[1px] border-solid border-darkgray"
                        placeholder="500"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-start gap-[128px]">
                  <div className="flex flex-col items-center justify-start">
                    <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                      <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_59px)] tracking-[-0.04em]">
                        Junior Partners
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-start justify-start text-center text-gray-200">
                    <div className="flex flex-row items-center justify-start">
                      <div className="relative rounded-md bg-white box-border w-[172px] h-[34px] overflow-hidden shrink-0 border-[1px] border-solid border-darkgray">
                        <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_55px)] flex flex-row items-center justify-start">
                          <div className="w-[107px] flex flex-row items-center justify-start">
                            <div className="relative inline-block w-[107px] shrink-0">
                              500
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-start gap-[128px]">
                  <div className="flex flex-col items-center justify-start">
                    <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                      <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_59px)] tracking-[-0.04em]">
                        Designers
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-start justify-start text-center text-gray-200">
                    <div className="rounded-md flex flex-row items-center justify-start">
                      <div className="relative rounded-md bg-white box-border w-[172px] h-[34px] overflow-hidden shrink-0 border-[1px] border-solid border-darkgray">
                        <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_55px)] flex flex-row items-center justify-start">
                          <div className="w-[107px] flex flex-row items-center justify-start">
                            <div className="relative inline-block w-[107px] shrink-0">
                              500
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-start gap-[128px]">
                  <div className="flex flex-col items-center justify-start">
                    <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                      <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_59px)] tracking-[-0.04em]">
                        Developers
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md flex flex-row items-start justify-start text-center text-gray-200">
                    <div className="flex flex-row items-center justify-start">
                      <div className="relative rounded-md bg-white box-border w-[172px] h-[34px] overflow-hidden shrink-0 border-[1px] border-solid border-darkgray">
                        <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_55px)]" />
                        <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_55px)] flex flex-row items-center justify-start">
                          <div className="w-[107px] flex flex-row items-center justify-start">
                            <div className="relative inline-block w-[107px] shrink-0">
                              500
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-start gap-[128px]">
                  <div className="flex flex-col items-center justify-start">
                    <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                      <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_59px)] tracking-[-0.04em]">
                        IT Team
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-start justify-start text-center text-gray-200">
                    <div className="rounded-md flex flex-row items-center justify-start">
                      <div className="relative rounded-md bg-white box-border w-[172px] h-[34px] overflow-hidden shrink-0 border-[1px] border-solid border-darkgray">
                        <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_55px)] flex flex-row items-center justify-start">
                          <div className="w-[107px] flex flex-row items-center justify-start">
                            <div className="relative inline-block w-[107px] shrink-0">
                              500
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-start gap-[128px]">
                  <div className="flex flex-col items-center justify-start">
                    <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                      <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_59px)] tracking-[-0.04em]">
                        Junior Employees
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-start justify-start text-center text-gray-200">
                    <div className="rounded-md flex flex-row items-center justify-start">
                      <div className="relative rounded-md bg-white box-border w-[172px] h-[34px] overflow-hidden shrink-0 border-[1px] border-solid border-darkgray">
                        <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_15.5px)]" />
                        <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_55px)] flex flex-row items-center justify-start">
                          <div className="w-[107px] flex flex-row items-center justify-start">
                            <div className="relative inline-block w-[107px] shrink-0">
                              500
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-start gap-[128px]">
                  <div className="flex flex-col items-center justify-start">
                    <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                      <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_59px)] tracking-[-0.04em]">
                        Associates
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md flex flex-row items-start justify-start text-center text-gray-200">
                    <div className="rounded-md flex flex-row items-center justify-start">
                      <div className="relative rounded-md bg-white box-border w-[172px] h-[34px] overflow-hidden shrink-0 border-[1px] border-solid border-darkgray">
                        <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_55px)] flex flex-row items-center justify-start">
                          <div className="flex flex-row items-center justify-start">
                            <div className="w-[107px] flex flex-row items-center justify-start">
                              <div className="relative inline-block w-[107px] shrink-0">
                                500
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-start gap-[128px]">
                  <div className="flex flex-col items-center justify-start">
                    <div className="relative w-[134px] h-[31px] overflow-hidden shrink-0">
                      <div className="absolute top-[calc(50%_-_8.5px)] left-[calc(50%_-_59px)] tracking-[-0.04em]">
                        Interns
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-start justify-start text-center text-gray-200">
                    <div className="rounded-md flex flex-row items-center justify-start">
                      <div className="relative rounded-md bg-white box-border w-[172px] h-[34px] overflow-hidden shrink-0 border-[1px] border-solid border-darkgray">
                        <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_55px)] flex flex-row items-center justify-start">
                          <div className="flex flex-row items-center justify-start">
                            <div className="flex flex-row items-center justify-start">
                              <div className="w-[107px] flex flex-row items-center justify-start">
                                <div className="relative inline-block w-[107px] shrink-0">
                                  500
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-[27px] left-[682px] rounded-13xl bg-lightcoral w-[79px] h-[29px] flex flex-row items-center justify-center py-4 px-8 box-border">
                <div className="relative font-medium">Deny</div>
              </div>
              <div className="absolute top-[85px] left-[682px] rounded-13xl bg-lightcoral w-[79px] h-[29px] flex flex-row items-center justify-center py-4 px-8 box-border">
                <div className="relative font-medium">Deny</div>
              </div>
              <div className="absolute top-[142px] left-[682px] rounded-13xl bg-lightcoral w-[79px] h-[29px] flex flex-row items-center justify-center py-4 px-8 box-border">
                <div className="relative font-medium">Deny</div>
              </div>
            </div>
            <div className="absolute top-[810px] left-[44px] rounded-13xl box-border w-[166px] h-10 flex flex-row items-center justify-center py-4 px-6 gap-[8px] border-[1px] border-solid border-eb-primary-blue-500">
              <div className="relative font-medium">Add More</div>
              <img
                className="relative w-6 h-6 overflow-hidden shrink-0"
                alt=""
                src="/plus.svg"
              />
            </div>
            <div className="absolute top-[810px] left-[842px] rounded-13xl box-border h-10 flex flex-row items-center justify-center py-4 px-8 border-[1px] border-solid border-eb-primary-blue-500">
              <div className="relative font-medium inline-block w-[102px] h-5 shrink-0">
                Save Policy
              </div>
            </div>
            <div className="absolute top-[86px] left-[0px] w-[1040px] flex flex-col items-start justify-start gap-[8px]">
              <div />
              <div className="self-stretch relative box-border h-px border-t-[1px] border-solid border-gainsboro-100" />
            </div>
            <div className="absolute top-[142px] left-[86px] w-[868px] flex flex-col items-end justify-start text-left text-xs text-darkslategray">
              <div className="w-[868px] flex flex-row items-center justify-between">
                <div className="flex flex-col items-start justify-center gap-[8px]">
                  <div className="relative font-medium">Search Group</div>
                  <div className="w-[175px] h-10 flex flex-row flex-wrap items-center justify-end text-justify text-sm text-ebgrey-400">
                    <div className="flex-1 rounded-md bg-white box-border h-10 flex flex-row items-center justify-start py-2 px-6 border-[1px] border-solid border-ebgrey-200">
                      <div className="flex flex-row items-center justify-start gap-[16px]">
                        <img
                          className="relative w-4 h-4 overflow-hidden shrink-0"
                          alt=""
                          src="/search.svg"
                        />
                        <div className="relative">Group Name</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row flex-wrap items-center justify-center gap-[13px] text-dimgray">
                  <div className="flex flex-row items-start justify-start gap-[8px]">
                    <div className="relative tracking-[-0.04em] font-medium">{`1-10 `}</div>
                    <div className="relative tracking-[-0.04em] text-gray-100">
                      out of
                    </div>
                    <div className="relative tracking-[-0.04em] font-medium">
                      50
                    </div>
                  </div>
                  <div className="flex flex-row items-start justify-start gap-[24px]">
                    <img
                      className="relative w-[18px] h-[18px] overflow-hidden shrink-0"
                      alt=""
                      src="/chevronright.svg"
                    />
                    <img
                      className="relative w-[18px] h-[18px] overflow-hidden shrink-0"
                      alt=""
                      src="/chevronright1.svg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white box-border w-[1040px] overflow-hidden flex flex-row items-center justify-between p-6 border-[1px] border-solid border-gainsboro-200">
            <div className="w-[81px] flex flex-row items-start justify-center gap-[8px]">
              <div className="flex flex-row items-center justify-start">
                <div className="relative tracking-[-0.04em] font-medium">
                  Railway class
                </div>
              </div>
              <div className="flex-1 h-5" />
            </div>
            <img
              className="relative w-6 h-6 overflow-hidden shrink-0"
              alt=""
              src="/chevrondown2.svg"
            />
          </div>
          <div className="rounded-xl bg-white box-border w-[1040px] overflow-hidden flex flex-row items-center justify-between p-6 border-[1px] border-solid border-gainsboro-200">
            <div className="w-[125px] flex flex-row items-start justify-center gap-[8px]">
              <div className="flex flex-row items-center justify-start">
                <div className="relative tracking-[-0.04em] font-medium">
                  Allowed Car Rentals
                </div>
              </div>
              <div className="flex-1 h-5" />
            </div>
            <img
              className="relative w-6 h-6 overflow-hidden shrink-0"
              alt=""
              src="/chevrondown3.svg"
            />
          </div>
          <div className="rounded-xl bg-white box-border w-[1040px] overflow-hidden flex flex-row items-center justify-between p-6 border-[1px] border-solid border-gainsboro-200">
            <div className="w-[172px] flex flex-row items-start justify-center gap-[8px]">
              <div className="flex flex-row items-center justify-start">
                <div className="relative tracking-[-0.04em] font-medium">
                  Allowed hotel booking class
                </div>
              </div>
              <div className="flex-1 h-5" />
            </div>
            <img
              className="relative w-6 h-6 overflow-hidden shrink-0"
              alt=""
              src="/chevrondown4.svg"
            />
          </div>
          <div className="rounded-xl bg-white box-border w-[1040px] overflow-hidden flex flex-row items-center justify-between p-6 border-[1px] border-solid border-gainsboro-200">
            <div className="w-[127px] flex flex-row items-start justify-center gap-[8px]">
              <div className="flex flex-row items-center justify-start">
                <div className="relative tracking-[-0.04em] font-medium">
                  Per Diem Allowance
                </div>
              </div>
              <div className="flex-1 h-5" />
            </div>
            <img
              className="relative w-6 h-6 overflow-hidden shrink-0"
              alt=""
              src="/chevrondown5.svg"
            />
          </div>
          <div className="rounded-xl bg-white box-border w-[1040px] overflow-hidden flex flex-row items-center justify-between p-6 border-[1px] border-solid border-gainsboro-200">
            <div className="w-[151px] flex flex-row items-start justify-center gap-[8px]">
              <div className="flex flex-row items-center justify-start">
                <div className="relative tracking-[-0.04em] font-medium">
                  Allowed Cash Advance
                </div>
              </div>
              <div className="flex-1 h-5" />
            </div>
            <img
              className="relative w-6 h-6 overflow-hidden shrink-0"
              alt=""
              src="/chevrondown6.svg"
            />
          </div>
          <div className="rounded-xl bg-white box-border w-[1040px] overflow-hidden flex flex-row items-center justify-between p-6 border-[1px] border-solid border-gainsboro-200">
            <div className="w-[152px] flex flex-row items-start justify-center gap-[8px]">
              <div className="flex flex-row items-center justify-start">
                <div className="relative tracking-[-0.04em] font-medium">
                  Meal Allowance Allowed
                </div>
              </div>
              <div className="flex-1 h-5" />
            </div>
            <img
              className="relative w-6 h-6 overflow-hidden shrink-0"
              alt=""
              src="/chevrondown7.svg"
            />
          </div>
          <div className="rounded-xl bg-white box-border w-[1040px] overflow-hidden flex flex-row items-center justify-between p-6 border-[1px] border-solid border-gainsboro-200">
            <div className="w-[231px] flex flex-row items-start justify-center gap-[8px]">
              <div className="flex flex-row items-center justify-start">
                <div className="relative tracking-[-0.04em] font-medium">{`Expense Report Submission deadline `}</div>
              </div>
              <div className="flex-1 h-5 flex flex-col items-start justify-start">
                <div className="relative rounded-xl bg-eb-primary-blue-50 w-8 h-5 overflow-hidden shrink-0">
                  <div className="absolute top-[4px] right-[4px] rounded-xl bg-eb-primary-blue-500 w-3 h-3 overflow-hidden" />
                </div>
              </div>
            </div>
            <img
              className="relative w-6 h-6 overflow-hidden shrink-0"
              alt=""
              src="/chevrondown8.svg"
            />
          </div>
          <div className="rounded-xl bg-white box-border w-[1040px] overflow-hidden flex flex-row items-center justify-between p-6 border-[1px] border-solid border-gainsboro-200">
            <div className="w-[155px] flex flex-row items-start justify-center gap-[8px]">
              <div className="flex flex-row items-center justify-start">
                <div className="relative tracking-[-0.04em] font-medium">{`Expense type restrictions `}</div>
              </div>
              <div className="flex-1 h-5 flex flex-col items-start justify-start">
                <div className="relative rounded-xl bg-eb-primary-blue-50 w-8 h-5 overflow-hidden shrink-0">
                  <div className="absolute top-[4px] right-[4px] rounded-xl bg-eb-primary-blue-500 w-3 h-3 overflow-hidden" />
                </div>
              </div>
            </div>
            <img
              className="relative w-6 h-6 overflow-hidden shrink-0"
              alt=""
              src="/chevrondown9.svg"
            />
          </div>
        </div>
        <img
          className="absolute top-[49px] left-[calc(50%_-_535px)] w-[202px] h-[49px] overflow-hidden"
          alt=""
          src="/frame-505.svg"
        />
      </div>
    );
  };
  
  export default CompanyStructure;
  
