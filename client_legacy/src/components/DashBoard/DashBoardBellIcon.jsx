import { useNavigate } from "react-router-dom";
import { bell } from "../../assets/icon";


const DashboardBellIcon = () => {
const navigate = useNavigate();

const redirectShowNotifications = () => {
    navigate('/showNotifications')
}

return(
    <div className="absolute top-[38px] left-[1184px] w-14 h-14 overflow-hidden text-center text-white">
    <div className="absolute top-[calc(50%_-_20px)] left-[calc(50%_-_23px)] rounded-81xl bg-white box-border w-10 h-10 border-[1px] border-solid border-eb-primary-blue-300">
      <img
        className="absolute top-[calc(50%_-_12px)] left-[calc(50%_-_12px)] w-6 h-6 overflow-hidden"
        alt=""
        src={bell}
      />
      <div className="absolute top-[-4px] left-[29px] rounded-2xl bg-lightcoral-200 box-border w-5 h-5 overflow-hidden border-[1px] border-solid border-lightcoral-100">
        <div className="absolute top-[3px] left-[7px] font-medium" onClick={redirectShowNotifications}>9</div>
      </div>
    </div>
  </div>
    
);
};

export default DashboardBellIcon