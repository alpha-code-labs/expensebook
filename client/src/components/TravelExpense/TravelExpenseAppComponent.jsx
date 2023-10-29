import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { calendar, clarityTwoWayArrowsLine } from "../../assets/icon";
import axios from "axios";
import { formatDate } from "../common/dateUtils";

const TravelExpenseAppComponent = () => {
const navigate = useNavigate();
const [travelExpenseApproval, setTravelExpenseApproval] = useState([]);

useEffect(() => {
    axios
      .get("http://localhost:8080/travelExpense/list/emp004")
      .then((response) => {
        setTravelExpenseApproval(response.data);
      })
      .catch((error) => {
        console.log("Error Fetching Travel Requests:", error);
      });
  }, []);


const redirectToTravelExpenses=(ExpenseHeaderType,ExpenseHeaderID,EmpId)=>{
    navigate(`/travelExpense/${ExpenseHeaderType}/${ExpenseHeaderID}/${EmpId}`)
}
    return (
            <div className="absolute top-[154px] left-[calc(50%_-_448px)] flex flex-col items-start justify-start gap-[4px] text-sm text-ebgrey-600">
                  {/* Headers */}
                  <div className="bg-white flex flex-row items-start justify-center gap-[24px]">
                    <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
                      <div className="absolute top-[calc(50%_-_8px)] left-[27px] font-medium">
                        Employee Name
                      </div>
                    </div>
                    <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
                      <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_26px)] font-medium">
                        Trip Name
                      </div>
                    </div>
                    <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
                      <div className="absolute top-[20px] left-[calc(50%_-_32px)] font-medium">
                        Destinations
                      </div>
                    </div>
                    <div className="relative w-60 h-14 overflow-hidden shrink-0">
                      <div className="absolute top-[20px] left-[calc(50%_-_32px)] font-medium">
                        Dates
                      </div>
                    </div>
                  </div>

                  {/* container box */}
                  
                  <div className="">
                  <div className="flex flex-col items-start justify-start gap-[6px] text-darkslategray overflow-auto h-[200px] ">
                  
                  {travelExpenseApproval.map((travelExpense,index) => (

                    <div key={index} className="bg-white flex  flex-row items-start justify-center gap-[24px] border-b-[1px] border-solid border-ebgrey-100 ">
                      <div className="relative w-[140px] h-14 overflow-hidden shrink-0 ">
                        <div className="absolute top-[calc(50%_-_9px)] left-[calc(50%_-_42px)] font-medium">
                        {travelExpense.EmployeeName}
                        </div>
                      </div>
                      <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
                        <div className="absolute top-[calc(50%_-_8px)] left-[8.2px] font-medium">
                        {travelExpense.TripPurpose}
                        </div>
                      </div>
                      <div className="relative w-[140px] h-14 overflow-hidden shrink-0 text-xs text-dimgray">
                        <div className="absolute top-[calc(50%_-_8px)] left-[25px] flex flex-row items-end justify-start gap-[2px]">
                          <div className="relative">{formatDate(travelExpense.departureCity[0].departure?.date)}</div>
                          <img
                            className="relative w-4 h-4 overflow-hidden shrink-0"
                            alt=""
                            src={clarityTwoWayArrowsLine}
                          />
                          <div className="relative">{formatDate(travelExpense.departureCity[0].return?.date)}</div>
                        </div>
                      </div>

                      <div className="relative w-60 h-14 overflow-hidden shrink-0 text-xs text-dimgray">

                        <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_91px)] flex flex-row items-end justify-start gap-[4px]">
                          <img
                            className="relative w-4 h-4 overflow-hidden shrink-0"
                            alt=""
                            src={calendar}
                          />
                          <div className="flex flex-row items-start justify-start gap-[8px]">
                            <div className="relative font-medium">{travelExpense.departureCity[0].from}</div>
                            <div className="relative">{`to `}</div>
                            <div className="relative font-medium">{travelExpense.departureCity[0].to}</div>
                          </div>
                        </div>
                      </div>
                      <div className="relative w-[130px] h-14 overflow-hidden shrink-0 text-center text-eb-primary-blue-500">
                        <div className="absolute top-[calc(50%_-_16px)] left-[calc(50%_-_64px)] rounded-29xl box-border w-[129px] h-8 flex flex-row items-center justify-center py-4 px-4 border-[1px] border-solid border-eb-primary-blue-500">
                          <div className="relative font-medium" onClick={() => redirectToTravelExpenses(travelExpense.ExpenseHeaderType,travelExpense.ExpenseHeaderID,travelExpense.EmpId)}>View Expenses</div>
                        </div>
                      </div>
                    </div>
                  ))};
                  </div>

                  </div>
                </div>
     );
    };
 export default TravelExpenseAppComponent;


 
    