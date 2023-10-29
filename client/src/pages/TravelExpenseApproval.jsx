import DashboardBellIcon from "../components/DashBoard/DashBoardBellIcon"
import DashboardOptions from "../components/DashBoard/DashBoardOptions"
import DashBoardProfile from "../components/DashBoard/DashBoardProfile"
import DashboardApprovalOptions from "../components/DashBoard/DashboardApprovalOptions"
import TravelExpenseAppContainer from "../components/TravelExpense/TravelExpenseAppContainer"


const TravelExpenseApproval = () => {
   return(
    <div className="relative bg-white w-full h-[832px] overflow-hidden text-left text-xs text-gray-200 font-cabin">
        <div className="absolute top-[126px] left-[292px] flex flex-col items-start justify-start gap-[24px]">
           <DashboardApprovalOptions /> 
           <TravelExpenseAppContainer />
        </div>
          <DashBoardProfile /> 
          <DashboardBellIcon />
          <DashboardOptions/>
        <b className="absolute top-[27px] left-[308px] tracking-[0.02em] text-gray-300">
          Approvals
        </b>
    </div>
    )
}

export default TravelExpenseApproval