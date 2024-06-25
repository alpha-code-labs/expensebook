import DashboardApprovalOptions from "../components/DashBoard/DashboardApprovalOptions";
import DashBoardProfile from "../components/DashBoard/DashBoardProfile";
import DashboardBellIcon from "../components/DashBoard/DashBoardBellIcon";
import DashboardOptions from "../components/DashBoard/DashBoardOptions";
import SettlingCashAdvanceContainer from "../components/SettlingCashAdvance/SettlingCashAdvanceContainer";

//CashAdvance in dashboard MacBookAir156
const SettlingCashAdvance = () => {

return (
  <div className="relative bg-white w-full h-[832px] overflow-hidden text-left text-xs text-gray-200 font-cabin">
    <div className="absolute top-[126px] left-[292px] flex flex-col items-start justify-start gap-[24px]">
     <DashboardApprovalOptions />  
     <SettlingCashAdvanceContainer />
    </div>
  <DashBoardProfile />
  <DashboardBellIcon />
  <DashboardOptions />
  </div>
    );
  };
  
  export default SettlingCashAdvance;
  