import {
  airplay,
  airplay1,
  // airplay2,
  airplay3,
  circleOutline,
  frame505,
  checklist,
} from "../../assets/icon.jsx";
import { useNavigate } from "react-router-dom";

const DashboardOptions = () => {
  const navigate = useNavigate();

  // const redirectToCash = () => {
  //   navigate("/dashCash");
  // };

  // const redirectToTravel = () => {
  //   navigate('/TravelRequestMicroservice');
  // }

  // const redirectToExpense = () => {
  //   navigate('/expenseMicroservice');
  // }

  const redirectToApprovals = () => {
    navigate("/");
  };

  return (
    <div className="absolute top-[0px] left-[0px] bg-gray-100 box-border w-[244px] h-[832px] overflow-hidden text-ebgrey-400 border-[1px] border-solid border-gray-300">
      <div className="absolute top-[101px] left-[0px] flex flex-col items-start justify-start gap-[16px]">
        {/* Overview */}
        <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
          <div className="absolute top-[calc(50% - 8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
            <img
              className="relative w-4 h-4 overflow-hidden shrink-0"
              alt=""
              src={airplay}
            />
            <div className="relative">Overview</div>
          </div>
        </div>

        {/* Travel */}
        <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
          <div className="absolute top-[calc(50% - 8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
            <img
              className="relative w-4 h-4 overflow-hidden shrink-0"
              alt=""
              src={airplay1}
            />
            <div className="relative">Travel Requests & Cash Advances</div>
          </div>
        </div>

        {/* Cash Advances */}
        {/* <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
          <div className="absolute top-[calc(50% - 8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
            <img className="relative w-4 h-4 overflow-hidden shrink-0" alt="" src={airplay2} />
            <div className="relative" onClick={redirectToCash}>Cash Advances</div>
          </div>
        </div> */}

        {/* Expenses */}
        <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
          <div className="absolute top-[calc(50% - 8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
            <img
              className="relative w-4 h-4 overflow-hidden shrink-0"
              alt=""
              src={airplay3}
            />
            <div className="relative">Expenses</div>
          </div>
        </div>

        {/* Approvals */}
        <div className="relative w-[244px] h-8 overflow-hidden shrink-0">
          <div className="absolute top-[calc(50% - 8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
            <img
              className="relative w-4 h-4 overflow-hidden shrink-0"
              alt=""
              src={circleOutline}
            />
            <div className="relative">Approvals</div>
          </div>
        </div>

        {/* Settlements */}
        <div className="relative bg-eb-primary-blue-50 w-[244px] h-8 overflow-hidden shrink-0 text-eb-primary-blue-500">
          <div className="absolute top-[calc(50% - 8px)] left-[32px] flex flex-row items-center justify-start gap-[8px]">
            <img
              className="relative w-4 h-4 overflow-hidden shrink-0"
              alt=""
              src={checklist}
            />
            <div className="relative font-medium" onClick={redirectToApprovals}>
              Settlements
            </div>
          </div>
        </div>

         
      </div>

      <img
        className="absolute top-[37px] left-[20px] w-[149px] h-10 overflow-hidden"
        alt=""
        src={frame505}
      />
    </div>
  );
};

export default DashboardOptions;
