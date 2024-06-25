import RecoveringPaidandCanceledCashAdvanceContainer from "../components/RecoveringPaidandCanceledCashAdvance/RecoveringPaidandCanceledCashAdvanceContainer.jsx";
import DashboardApprovalOptions from "../components/DashBoard/DashboardApprovalOptions.jsx";
import DashboardBellIcon from "../components/DashBoard/DashBoardBellIcon.jsx";
import DashBoardProfile from "../components/DashBoard/DashBoardProfile.jsx";
import DashboardOptions from "../components/DashBoard/DashBoardOptions.jsx";




const RecoveringPaidandCanceledCashAdvance = () => {


  return (
    <div className="relative bg-white w-full h-[832px] overflow-hidden text-left text-xs text-gray-200 font-cabin">
      <div className="absolute top-[126px] left-[292px] flex flex-col items-start justify-start gap-[24px]">
        <DashboardApprovalOptions /> 
        <RecoveringPaidandCanceledCashAdvanceContainer />
      </div>
    <DashBoardProfile />
    <DashboardBellIcon />
    <DashboardOptions/>    
    </div>
  );
};  

export default RecoveringPaidandCanceledCashAdvance;






