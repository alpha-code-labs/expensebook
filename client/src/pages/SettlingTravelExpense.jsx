import DashboardBellIcon from "../components/DashBoard/DashBoardBellIcon"
import DashboardOptions from "../components/DashBoard/DashBoardOptions"
import DashBoardProfile from "../components/DashBoard/DashBoardProfile"
import DashboardApprovalOptions from "../components/DashBoard/DashboardApprovalOptions"
import SettlingTravelExpenseContainer from "../components/SettlingTravelExpense/SettlingTravelExpenseContainer"


const SettlingTravelExpense = () => {
   return(
    <div className="relative bg-white w-full h-[832px] overflow-hidden text-left text-xs text-gray-200 font-cabin">
        <div className="absolute top-[126px] left-[292px] flex flex-col items-start justify-start gap-[24px]">
           <DashboardApprovalOptions /> 
           <SettlingTravelExpenseContainer />
        </div>
          <DashBoardProfile /> 
          <DashboardBellIcon />
          <DashboardOptions/>
    </div>
    )
}

export default SettlingTravelExpense