import { useCallback } from "react";

const Login = () => {

  return (
    <div className="relative bg-white w-full h-[932px] overflow-hidden text-center text-[32px] text-ebgrey-500 font-cabin">
    <div className="absolute top-[0px] left-[0px] [background:linear-gradient(187.95deg,_rgba(76,_54,_241,_0),_rgba(76,_54,_241,_0.03)_9.19%,_rgba(76,_54,_241,_0.06)_17.67%,_rgba(76,_54,_241,_0.1)_25.54%,_rgba(76,_54,_241,_0.14)_32.86%,_rgba(76,_54,_241,_0.19)_39.72%,_rgba(76,_54,_241,_0.25)_46.19%,_rgba(76,_54,_241,_0.31)_52.36%,_rgba(76,_54,_241,_0.38)_58.3%,_rgba(76,_54,_241,_0.46)_64.08%,_rgba(76,_54,_241,_0.53)_69.79%,_rgba(76,_54,_241,_0.62)_75.51%,_rgba(76,_54,_241,_0.71)_81.31%,_rgba(76,_54,_241,_0.8)_87.28%,_rgba(76,_54,_241,_0.9)_93.48%,_#4c36f1)] w-[628px] h-[932px] overflow-hidden">
      <img
        className="absolute h-[51.13%] w-[80.73%] top-[45.06%] right-[9.55%] bottom-[3.81%] left-[9.71%] max-w-full overflow-hidden max-h-full"
        alt=""
        src="/tripamico.svg"
      />
      <div className="absolute top-[267px] left-[calc(50%_-_219.5px)] flex flex-col items-start justify-start">
        <div className="relative tracking-[-0.04em] font-semibold inline-block w-[438px]">
          Your business expense booking could not get simpler
        </div>
      </div>
      <img
        className="absolute top-[163px] left-[calc(50%_-_134px)] w-[267px] h-16 overflow-hidden"
        alt=""
        src="/frame-505.svg"
      />
    </div>
    <div className="absolute top-[calc(50%_-_103.5px)] left-[732px] flex flex-col items-start justify-start gap-[24px] text-left text-[24px]">
      <div className="flex flex-col items-start justify-start gap-[32px]">
        <div className="flex flex-col items-start justify-start">
          <div className="relative tracking-[-0.04em] font-semibold">
            Let’s get you started on Expensebook
          </div>
        </div>
        <div className="w-[403px] flex flex-col items-start justify-start text-sm">
          <div className="w-[403px] flex flex-col items-start justify-start gap-[8px]">
            <div className="relative font-medium">Email ID</div>
            <div className="w-[403px] h-[49px] flex flex-row flex-wrap items-start justify-start">
              <div
                className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-start py-2 px-6 relative cursor-pointer border-[1px] border-solid border-gainsboro"
              >
                <input
                  className="[border:none] font-cabin text-sm bg-[transparent] absolute my-0 mx-[!important] top-[16px] left-[24px] text-darkgray text-justify inline-block z-[0]"
                  placeholder="Eg. johnwilliams@acme.com"
                  type="email"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-[32px] bg-eb-primary-blue-100 w-[342px] h-12 flex flex-row items-center justify-center p-4 box-border">
        <button
          className="[border:none] p-0 bg-[transparent] relative text-[16px] font-medium font-cabin text-white text-left inline-block"
          autoFocus={true}
          disabled={true}
        >
          Continue
        </button>
      </div>
    </div>
  </div>
  );
};

export default Login;
