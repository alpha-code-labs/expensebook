




//Need to work on the code
import { airplay, airplay1,airplay2,airplay3,clarityTwoWayArrowsLine,
 map, calender1, chevronDown, vector1, briefcase, frame260, bell, teenyIconDocSolid, frame490, clarityOneWayArrowsLine} from "../assets/icon";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

//MacBookAir-272
 const EditTravelRequest = () => {
  const navigate = useNavigate();

  const onXIconClick =() => {
    navigate('/');
  }

  return (
    <div className="relative bg-white w-full h-[1596px] overflow-hidden text-left text-xs text-white font-cabin">
      <div className="absolute top-[0px] left-[0px] bg-gray-100 box-border w-[244px] h-[832px] overflow-hidden text-ebgrey-400 border-[1px] border-solid border-gray-300">
        <div className="absolute top-[101px] left-[0px] flex flex-col items-start justify-start gap-[16px]">
          <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
            <div className="absolute top-[calc(50%_-_8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src={airplay}
              />
              <div className="relative">Overview</div>
            </div>
          </div>
          <div className="relative bg-eb-primary-blue-50 w-[244px] h-8 overflow-hidden shrink-0 text-eb-primary-blue-500">
            <div className="absolute top-[calc(50%_-_8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src={airplay1}
              />
              <div className="relative font-medium">Travel</div>
            </div>
          </div>
          <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
            <div className="absolute top-[calc(50%_-_8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src={airplay2}
              />
              <div className="relative">Cash Advances</div>
            </div>
          </div>
          <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
            <div className="absolute top-[calc(50%_-_8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
              <img
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src={airplay3}
              />
              <div className="relative">Expenses</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-[126px] left-[332px] flex flex-col items-end justify-start gap-[24px] text-center text-base">
        <div className="rounded-13xl bg-eb-primary-blue-500 h-12 flex flex-row items-center justify-center py-4 px-8 box-border">
          <div className="relative font-medium">New Travel Request</div>
        </div>
        <div className="flex flex-col items-start justify-start gap-[24px] text-left text-darkslategray-300">
          <div className="flex flex-row items-start justify-start gap-[24px]">
            <div className="relative rounded-2xl bg-white box-border w-[402px] h-[273px] overflow-hidden shrink-0 border-[1px] border-solid border-gainsboro-300">
              <div className="absolute top-[-41px] left-[7px]">In Transit</div>
              <div className="absolute top-[60px] left-[1px] bg-white box-border w-[400px] h-[114px] overflow-hidden text-sm border-b-[1px] border-solid border-ebgrey-100">
                <div className="absolute top-[17px] left-[25px] w-[349px] flex flex-row items-start justify-between">
                  <div className="flex flex-col items-start justify-start gap-[12px]">
                    <div className="relative font-medium">
                      Gurgaon Conference
                    </div>
                    <div className="flex flex-col items-start justify-start gap-[16px] text-xs text-dimgray-100">
                      <div className="flex flex-row items-end justify-start gap-[8px]">
                        <div className="relative">Pune</div>
                        <img
                          className="relative w-4 h-4 overflow-hidden shrink-0"
                          alt=""
                          src={clarityTwoWayArrowsLine}
                        />
                        <div className="relative">Gurgaon</div>
                      </div>
                      <div className="flex flex-row items-end justify-start gap-[4px]">
                        <img
                          className="relative w-4 h-4 overflow-hidden shrink-0"
                          alt=""
                          src={calender1}
                        />
                        <div className="flex flex-row items-start justify-start gap-[8px]">
                          <div className="relative font-medium">
                            12-Aug-2023
                          </div>
                          <div className="relative">{`to `}</div>
                          <div className="relative font-medium">
                            15-Aug-2023
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-13xl box-border h-[33px] flex flex-row items-center justify-center py-4 px-8 relative text-center text-eb-primary-blue-500 border-[1px] border-solid border-eb-primary-blue-500">
                    <div className="absolute my-0 mx-[!important] top-[8px] left-[16px] font-medium z-[0]">
                      View Trip
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-[174px] left-[1px] bg-white w-[400px] h-[114px] overflow-hidden text-sm">
                <div className="absolute top-[17px] left-[25px] w-[349px] flex flex-row items-start justify-between">
                  <div className="flex flex-col items-start justify-start gap-[12px]">
                    <div className="relative font-medium">
                      Gurgaon Conference
                    </div>
                    <div className="flex flex-col items-start justify-start gap-[16px] text-xs text-dimgray-100">
                      <div className="flex flex-row items-end justify-start gap-[8px]">
                        <div className="relative">Pune</div>
                        <img
                          className="relative w-4 h-4 overflow-hidden shrink-0"
                          alt=""
                          src={clarityOneWayArrowsLine}
                        />
                        <div className="relative">Gurgaon</div>
                      </div>
                      <div className="flex flex-row items-end justify-start gap-[4px]">
                        <img
                          className="relative w-4 h-4 overflow-hidden shrink-0"
                          alt=""
                          src={calender1}
                        />
                        <div className="flex flex-row items-start justify-start gap-[8px]">
                          <div className="relative font-medium">
                            12-Aug-2023
                          </div>
                          <div className="relative">{`to `}</div>
                          <div className="relative font-medium">
                            15-Aug-2023
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-13xl box-border w-[87px] h-[33px] flex flex-row items-center justify-center py-4 px-8 relative text-center text-eb-primary-blue-500 border-[1px] border-solid border-eb-primary-blue-500">
                    <div className="absolute my-0 mx-[!important] top-[8px] left-[16px] font-medium z-[0]">
                      View Trip
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-[24px] left-[24px] flex flex-row items-center justify-start gap-[16px] text-ebgrey-500">
                <img
                  className="relative w-6 h-6 overflow-hidden shrink-0"
                  alt=""
                  src={briefcase}
                />
                <div className="relative font-medium">Upcoming Trips</div>
              </div>
            </div>
            <div className="relative rounded-2xl bg-white box-border w-[402px] h-[273px] overflow-hidden shrink-0 text-black border-[1px] border-solid border-gainsboro-300">
              <div className="absolute top-[-41px] left-[7px]">In Transit</div>
              <div className="absolute top-[calc(50%_-_81.5px)] left-[calc(50%_-_146.5px)] flex flex-col items-center justify-start gap-[16px] text-ebgrey-600">
                <img
                  className="relative w-32 h-32 overflow-hidden shrink-0"
                  alt=""
                  src={frame260}
                />
                <div className="relative">{`You do not have any trip in transit right now `}</div>
              </div>
              <div className="absolute top-[24px] left-[64px] font-medium text-ebgrey-500">
                In Transit
              </div>
              <img
                className="absolute top-[21px] left-[24px] w-6 h-6 overflow-hidden"
                alt=""
                src={map}
              />
            </div>
          </div>
          <div className="relative rounded-2xl bg-white box-border w-[828px] h-[257px] overflow-hidden shrink-0 text-dimgray-100 border-[1px] border-solid border-gainsboro-300">
            <div className="absolute top-[24px] left-[24px] text-black">{`All Trips `}</div>
            <div className="absolute top-[296px] left-[calc(50%_-_412px)] text-ebgrey-600">{`You do not have any trip in transit right now `}</div>
            <div className="absolute top-[66px] left-[0px] bg-white box-border w-[827px] h-[65px] overflow-hidden text-xs border-b-[1px] border-solid border-gainsboro-300">
              <div className="absolute top-[20px] left-[594px] rounded-xl bg-honeydew w-20 h-6 flex flex-row items-center justify-center p-2 box-border text-center text-forestgreen">
                <div className="relative font-medium">Approved</div>
              </div>
              <div className="absolute top-[calc(50%_-_8.5px)] left-[415px] flex flex-row items-end justify-start gap-[2px]">
                <div className="relative">Pune</div>
                <img
                  className="relative w-4 h-4 overflow-hidden shrink-0"
                  alt=""
                  src={clarityOneWayArrowsLine}
                />
                <div className="relative">Gurgaon</div>
              </div>
              <div className="absolute top-[calc(50%_-_16.5px)] left-[714px] rounded-13xl box-border w-[87px] h-[33px] flex flex-row items-center justify-center py-4 px-8 text-center text-sm text-eb-primary-blue-500 border-[1px] border-solid border-eb-primary-blue-500">
                <div className="absolute my-0 mx-[!important] top-[8px] left-[16px] font-medium z-[0]">
                  View Trip
                </div>
              </div>
              <div className="absolute top-[25px] left-[27px] font-medium text-darkslategray-300">
                Gurgaon Conference
              </div>
              <div className="absolute top-[24px] left-[183px] flex flex-row items-end justify-start gap-[4px]">
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
            <div className="absolute top-[131px] left-[1px] bg-white box-border w-[827px] h-[65px] overflow-hidden text-xs border-b-[1px] border-solid border-gainsboro-300">
              <div className="absolute top-[24px] left-[415px] flex flex-row items-center justify-start gap-[2px]">
                <div className="relative">Pune</div>
                <img
                  className="relative w-4 h-4 overflow-hidden shrink-0"
                  alt=""
                  src={clarityOneWayArrowsLine}
                />
                <div className="relative">Mumbai</div>
                <img
                  className="relative w-4 h-4 overflow-hidden shrink-0"
                  alt=""
                  src={clarityTwoWayArrowsLine}
                />
                <div className="relative">Chennai</div>
              </div>
              <div className="absolute top-[calc(50%_-_12.5px)] left-[593px] rounded-xl bg-cornsilk w-20 h-6 flex flex-row items-center justify-center p-2 box-border text-center text-goldenrod">
                <div className="relative font-medium">Pending</div>
              </div>
              <div className="absolute top-[25px] left-[24px] font-medium text-darkslategray-300">
                Mumbai Meetup
              </div>
              <div className="absolute top-[24px] left-[180px] flex flex-row items-end justify-start gap-[4px]">
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
              <div className="absolute top-[calc(50%_-_16.5px)] left-[713px] rounded-13xl box-border w-[87px] h-[33px] flex flex-row items-center justify-center py-4 px-8 text-center text-sm text-eb-primary-blue-500 border-[1px] border-solid border-eb-primary-blue-500">
                <div className="absolute my-0 mx-[!important] top-[8px] left-[16px] font-medium z-[0]">
                  View Trip
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-[50px] left-[284px] flex flex-row items-center justify-start gap-[8px] text-base text-black">
        <img
          className="relative rounded-81xl w-8 h-8 overflow-hidden shrink-0 object-cover"
          alt=""
          src={frame490}
        />
        <div className="relative tracking-[-0.04em]">Hello Neo</div>
      </div>
      <div className="absolute top-[38px] left-[1184px] w-14 h-14 overflow-hidden text-center">
        <div className="absolute top-[calc(50%_-_20px)] left-[calc(50%_-_23px)] rounded-81xl bg-white box-border w-10 h-10 border-[1px] border-solid border-eb-primary-blue-300">
          <img
            className="absolute top-[calc(50%_-_12px)] left-[calc(50%_-_12px)] w-6 h-6 overflow-hidden"
            alt=""
            src={bell}
          />
          <div className="absolute top-[-4px] left-[29px] rounded-2xl bg-lightcoral-200 box-border w-5 h-5 overflow-hidden border-[1px] border-solid border-lightcoral-100">
            <div className="absolute top-[3px] left-[7px] font-medium">3</div>
          </div>
        </div>
      </div>
      <div className="absolute top-[0px] left-[0px] bg-gray-400 w-[1280px] h-[1596px] overflow-hidden" />
      <div className="absolute top-[calc(50%_-_766px)] left-[calc(50%_-_542px)] rounded-3xl bg-white w-[1085px] h-[1517px] overflow-hidden text-[24px] text-darkslategray-200">
        <img
          className="absolute top-[40px] left-[1021px] w-6 h-6 overflow-hidden cursor-pointer"
          alt=""
          src="/x.svg"
          onClick={onXIconClick}
        />
        <div className="absolute top-[40px] left-[40px] flex flex-row items-center justify-start">
          <div className="flex flex-col items-start justify-start">
            <div className="relative tracking-[-0.04em] font-semibold">
              Trip Booking Details
            </div>
          </div>
        </div>
        <div className="absolute top-[93px] left-[40px] flex flex-col items-start justify-start gap-[40px] text-sm text-darkslategray-300">
          <div className="flex flex-col items-start justify-start gap-[24px] text-dimgray-200">
            <div className="w-[1005px] flex flex-row items-center justify-start gap-[24px]">
              <div className="flex flex-col items-start justify-start gap-[8px]">
                <div className="relative">{`From `}</div>
                <div className="w-[198px] h-12 flex flex-row flex-wrap items-start justify-start text-justify text-black">
                  <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-start py-2 px-6 relative border-[1px] border-solid border-ebgrey-200">
                    <div className="absolute my-0 mx-[!important] top-[16px] left-[24px] font-medium z-[0]">
                      Mumbai
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start justify-start gap-[8px]">
                <div className="relative">To</div>
                <div className="w-[198px] h-12 flex flex-row flex-wrap items-start justify-start text-justify text-black">
                  <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-start py-2 px-6 relative border-[1px] border-solid border-ebgrey-200">
                    <div className="absolute my-0 mx-[!important] top-[16px] left-[24px] font-medium z-[0]">
                      Los Angeles
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white box-border w-[268px] overflow-hidden shrink-0 flex flex-col items-center justify-start py-2.5 px-[31px] text-xs text-gray-200 border-[1px] border-solid border-gainsboro-200">
                <div className="flex flex-col items-start justify-start gap-[12px]">
                  <div className="flex flex-col items-start justify-start gap-[8px]">
                    <div className="relative">Departure Date</div>
                    <div className="flex flex-row items-center justify-start gap-[8px] text-lg text-darkslategray-100">
                      <div className="relative font-medium">24th Aug 2023</div>
                      <img
                        className="relative w-6 h-6 overflow-hidden shrink-0"
                        alt=""
                        src={chevronDown}
                      />
                    </div>
                  </div>
                  <img
                    className="relative w-[207px] h-px"
                    alt=""
                    src={vector1}
                  />
                  <div className="w-[135px] flex flex-col items-start justify-start gap-[8px]">
                    <div className="relative">{`Preferred Time `}</div>
                    <div className="flex flex-row items-center justify-start gap-[8px] text-lg text-darkslategray-100">
                      <div className="relative font-medium">16:00:00</div>
                      <img
                        className="relative w-6 h-6 overflow-hidden shrink-0"
                        alt=""
                        src={chevronDown}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white box-border w-[268px] overflow-hidden shrink-0 flex flex-col items-center justify-start py-2.5 px-[31px] text-xs text-gray-200 border-[1px] border-solid border-gainsboro-200">
                <div className="flex flex-col items-start justify-start gap-[12px]">
                  <div className="flex flex-col items-start justify-start gap-[8px]">
                    <div className="relative">Departure Date</div>
                    <div className="flex flex-row items-center justify-start gap-[8px] text-lg text-darkslategray-100">
                      <div className="relative font-medium">24th Aug 2023</div>
                      <img
                        className="relative w-6 h-6 overflow-hidden shrink-0"
                        alt=""
                        src={chevronDown}
                      />
                    </div>
                  </div>
                  <img
                    className="relative w-[207px] h-px"
                    alt=""
                    src={vector1 }
                  />
                  <div className="w-[135px] flex flex-col items-start justify-start gap-[8px]">
                    <div className="relative">{`Preferred Time `}</div>
                    <div className="flex flex-row items-center justify-start gap-[8px] text-lg text-darkslategray-100">
                      <div className="relative font-medium">16:00:00</div>
                      <img
                        className="relative w-6 h-6 overflow-hidden shrink-0"
                        alt=""
                        src={chevronDown}
                      />
                    </div>
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
                <div className="relative font-medium">Air india DQ1...</div>
              </div>
            </div>
            <div className="relative box-border w-[993px] h-px border-t-[1px] border-solid border-gainsboro-100" />
            <div className="w-[1005px] flex flex-row items-center justify-start gap-[24px]">
              <div className="flex flex-col items-start justify-start gap-[8px]">
                <div className="relative">{`From `}</div>
                <div className="w-[198px] h-12 flex flex-row flex-wrap items-start justify-start text-justify text-black">
                  <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-start py-2 px-6 relative border-[1px] border-solid border-ebgrey-200">
                    <div className="absolute my-0 mx-[!important] top-[16px] left-[24px] font-medium z-[0]">
                      Bengaluru
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start justify-start gap-[8px]">
                <div className="relative">To</div>
                <div className="w-[198px] h-12 flex flex-row flex-wrap items-start justify-start text-justify text-black">
                  <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-start py-2 px-6 relative border-[1px] border-solid border-ebgrey-200">
                    <div className="absolute my-0 mx-[!important] top-[16px] left-[24px] font-medium z-[0]">
                      Los Angeles
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white box-border w-[268px] overflow-hidden shrink-0 flex flex-col items-center justify-start py-2.5 px-[31px] text-xs text-gray-200 border-[1px] border-solid border-gainsboro-200">
                <div className="flex flex-col items-start justify-start gap-[12px]">
                  <div className="flex flex-col items-start justify-start gap-[8px]">
                    <div className="relative">Departure Date</div>
                    <div className="flex flex-row items-center justify-start gap-[8px] text-lg text-darkslategray-100">
                      <div className="relative font-medium">24th Aug 2023</div>
                      <img
                        className="relative w-6 h-6 overflow-hidden shrink-0"
                        alt=""
                        src={chevronDown}
                      />
                    </div>
                  </div>
                  <img
                    className="relative w-[207px] h-px"
                    alt=""
                    src={vector1}
                  />
                  <div className="w-[135px] flex flex-col items-start justify-start gap-[8px]">
                    <div className="relative">{`Preferred Time `}</div>
                    <div className="flex flex-row items-center justify-start gap-[8px] text-lg text-darkslategray-100">
                      <div className="relative font-medium">16:00:00</div>
                      <img
                        className="relative w-6 h-6 overflow-hidden shrink-0"
                        alt=""
                        src={chevronDown}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white box-border w-[268px] overflow-hidden shrink-0 flex flex-col items-center justify-start py-2.5 px-[31px] text-xs text-gray-200 border-[1px] border-solid border-gainsboro-200">
                <div className="flex flex-col items-start justify-start gap-[12px]">
                  <div className="flex flex-col items-start justify-start gap-[8px]">
                    <div className="relative">Departure Date</div>
                    <div className="flex flex-row items-center justify-start gap-[8px] text-lg text-darkslategray-100">
                      <div className="relative font-medium">24th Aug 2023</div>
                      <img
                        className="relative w-6 h-6 overflow-hidden shrink-0"
                        alt=""
                        src={chevronDown}
                      />
                    </div>
                  </div>
                  <img
                    className="relative w-[207px] h-px"
                    alt=""
                    src={vector1}
                  />
                  <div className="w-[135px] flex flex-col items-start justify-start gap-[8px]">
                    <div className="relative">{`Preferred Time `}</div>
                    <div className="flex flex-row items-center justify-start gap-[8px] text-lg text-darkslategray-100">
                      <div className="relative font-medium">16:00:00</div>
                      <img
                        className="relative w-6 h-6 overflow-hidden shrink-0"
                        alt=""
                        src={chevronDown}
                      />
                    </div>
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
                <div className="relative font-medium">Air india EQ1...</div>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-start justify-start gap-[112px]">
            <div className="w-[403px] flex flex-col items-start justify-start gap-[8px]">
              <div className="relative font-medium">Mode of travel</div>
              <div className="self-stretch h-12 flex flex-row flex-wrap items-start justify-start text-black">
                <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-between py-2 px-6 border-[1px] border-solid border-ebgrey-200">
                  <div className="flex-1 flex flex-row items-center justify-between">
                    <div className="relative">Flight</div>
                    <img
                      className="relative w-6 h-6 overflow-hidden shrink-0"
                      alt=""
                      src={chevronDown}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[403px] flex flex-col items-start justify-start gap-[8px]">
              <div className="relative font-medium">Travel class</div>
              <div className="self-stretch h-12 flex flex-row flex-wrap items-start justify-start text-black">
                <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-between py-2 px-6 border-[1px] border-solid border-ebgrey-200">
                  <div className="flex-1 flex flex-row items-center justify-between">
                    <div className="relative">Economy</div>
                    <img
                      className="relative w-6 h-6 overflow-hidden shrink-0"
                      alt=""
                      src={chevronDown}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[979px] flex flex-row items-start justify-start gap-[112px]">
            <div className="w-[403px] flex flex-col items-start justify-start gap-[8px]">
              <div className="relative font-medium">Hotel class</div>
              <div className="self-stretch h-12 flex flex-row flex-wrap items-start justify-start text-black">
                <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-between py-2 px-6 border-[1px] border-solid border-ebgrey-200">
                  <div className="flex-1 flex flex-row items-center justify-between">
                    <div className="relative inline-block w-[61px] shrink-0">
                      4 Star
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
            <div className="flex flex-row items-start justify-start gap-[28px]">
              <div className="flex flex-col items-start justify-start gap-[8px]">
                <div className="relative font-medium">Check In</div>
                <div className="w-[217px] h-12 flex flex-row flex-wrap items-start justify-start text-base text-ebgrey-600">
                  <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-between py-2 px-6 border-[1px] border-solid border-ebgrey-200">
                    <div className="flex-1 flex flex-row items-center justify-between">
                      <div className="flex flex-row items-center justify-start gap-[8px]">
                        <div className="relative font-medium">
                          24th Aug 2023
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
              </div>
              <div className="flex flex-col items-start justify-start gap-[8px]">
                <div className="relative font-medium">Check Out</div>
                <div className="w-[217px] h-12 flex flex-row flex-wrap items-start justify-start text-base text-ebgrey-600">
                  <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-between py-2 px-6 border-[1px] border-solid border-ebgrey-200">
                    <div className="flex-1 flex flex-row items-center justify-between">
                      <div className="flex flex-row items-center justify-start gap-[8px]">
                        <div className="relative font-medium">
                          24th Aug 2023
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
              <div className="relative font-medium">indus hotels...</div>
            </div>
          </div>
          <div className="relative box-border w-[993px] h-px border-t-[1px] border-solid border-gainsboro-100" />
          <div className="w-[979px] flex flex-row items-start justify-start gap-[112px]">
            <div className="w-[403px] flex flex-col items-start justify-start gap-[8px]">
              <div className="relative font-medium">Hotel class</div>
              <div className="self-stretch h-12 flex flex-row flex-wrap items-start justify-start text-black">
                <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-between py-2 px-6 border-[1px] border-solid border-ebgrey-200">
                  <div className="flex-1 flex flex-row items-center justify-between">
                    <div className="relative inline-block w-[61px] shrink-0">
                      4 Star
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
            <div className="flex flex-row items-start justify-start gap-[28px]">
              <div className="flex flex-col items-start justify-start gap-[8px]">
                <div className="relative font-medium">Check In</div>
                <div className="w-[217px] h-12 flex flex-row flex-wrap items-start justify-start text-base text-ebgrey-600">
                  <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-between py-2 px-6 border-[1px] border-solid border-ebgrey-200">
                    <div className="flex-1 flex flex-row items-center justify-between">
                      <div className="flex flex-row items-center justify-start gap-[8px]">
                        <div className="relative font-medium">
                          24th Nov 2023
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
              </div>
              <div className="flex flex-col items-start justify-start gap-[8px]">
                <div className="relative font-medium">Check Out</div>
                <div className="w-[217px] h-12 flex flex-row flex-wrap items-start justify-start text-base text-ebgrey-600">
                  <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-between py-2 px-6 border-[1px] border-solid border-ebgrey-200">
                    <div className="flex-1 flex flex-row items-center justify-between">
                      <div className="flex flex-row items-center justify-start gap-[8px]">
                        <div className="relative font-medium">
                          24th Nov 2023
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
              <div className="relative font-medium">Louis</div>
            </div>
          </div>
          <div className="relative box-border w-[993px] h-px border-t-[1px] border-solid border-gainsboro-100" />
          <div className="flex flex-row items-start justify-start gap-[112px]">
            <div className="w-[403px] flex flex-col items-start justify-start gap-[8px]">
              <div className="relative font-medium">All day cab class</div>
              <div className="self-stretch h-12 flex flex-row flex-wrap items-start justify-start text-black">
                <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-between py-2 px-6 border-[1px] border-solid border-ebgrey-200">
                  <div className="flex-1 flex flex-row items-center justify-between">
                    <div className="relative">Sedan</div>
                    <img
                      className="relative w-6 h-6 overflow-hidden shrink-0"
                      alt=""
                      src={chevronDown}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[462px] flex flex-col items-start justify-start gap-[8px]">
              <div className="relative font-medium">Cab Dates</div>
              <div className="w-[462px] h-12 flex flex-row flex-wrap items-start justify-start text-xs text-ebgrey-600">
                <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-between py-2 px-6 border-[1px] border-solid border-ebgrey-200">
                  <div className="flex flex-row items-center justify-start">
                    <div className="relative font-medium">
                      12 Nov, 15 Nov, 21 Nov
                    </div>
                  </div>
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
              <div className="relative font-medium">Cab .</div>
            </div>
          </div>
        </div>
      </div>
      <div>
       <h1>MacBook Air 272</h1>
        {/* Use Link to navigate to MacBook Air 271  */}
       <Link to="/ViewTrip">Go to MacBook Air 271</Link>
       </div>
    </div>
  );
};

export default EditTravelRequest;
