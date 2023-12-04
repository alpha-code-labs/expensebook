import { calendar, chevronDown, line2 } from "../assets/icon";

const Frame = () => {
    return (
      <div className="relative bg-white w-full h-[673px] overflow-hidden text-left text-xs text-black font-inter">
        <div className="absolute top-[11px] left-[62px] flex flex-col items-start justify-start gap-[10px]">
          <div className="relative bg-gainsboro box-border w-[728px] h-[502px] z-[0] border-[1px] border-solid border-black" />
          <div className="absolute my-0 mx-[!important] top-[80px] left-[20px] z-[1]">
            Cash Advance Amount
          </div>
          <div className="absolute my-0 mx-[!important] top-[80px] left-[176px] z-[2]">
            {" "}
            Amount Remaining
          </div>
          <div className="absolute my-0 mx-[!important] top-[9px] left-[4px] bg-gainsboro box-border w-[215px] h-10 z-[3] border-[1px] border-solid border-black" />
          <div className="absolute my-0 mx-[!important] top-[9px] left-[496px] bg-gainsboro box-border w-[215px] h-10 z-[4] border-[1px] border-solid border-black" />
          <div className="absolute my-0 mx-[!important] top-[21px] left-[37px] z-[5]">
            Travel Expense Report
          </div>
          <div className="absolute my-0 mx-[!important] top-[21px] left-[542px] z-[6]">
            Validate and Submit
          </div>
          <img
            className="absolute my-0 mx-[!important] top-[101px] left-[19px] w-[127px] h-[35px] z-[7]"
            alt=""
            src={calendar}
          />
          <img
            className="absolute my-0 mx-[!important] top-[101px] left-[168px] w-[127px] h-[35px] z-[8]"
            alt=""
            src={calendar}
          />
          <img
            className="absolute my-0 mx-[!important] top-[101px] left-[323px] w-[127px] h-[35px] z-[9]"
            alt=""
            src={calendar}
          />
          <img
            className="absolute my-0 mx-[!important] top-[101px] left-[478px] w-[127px] h-[35px] z-[10]"
            alt=""
            src={calendar}
          />
          <div className="absolute my-0 mx-[!important] top-[111px] left-[36px] z-[11]">
            Rs- 10,000 /-
          </div>
          <div className="absolute my-0 mx-[!important] top-[111px] left-[194px] z-[12]">
            Rs-2,827 /-
          </div>
          <div className="absolute my-0 mx-[!important] top-[111px] left-[343px] z-[13]">
            {chevronDown}
          </div>
          <div className="absolute my-0 mx-[!important] top-[111px] left-[507px] z-[14]">
            {chevronDown}
          </div>
          <img
            className="absolute my-0 mx-[!important] top-[142px] left-[0px] w-[726px] h-0.5 z-[15]"
            alt=""
            src={line2}
          />
        </div>
      </div>
    );
  };
  
  export default Frame;
  