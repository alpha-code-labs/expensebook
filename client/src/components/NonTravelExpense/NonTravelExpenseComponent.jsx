import { useNavigate } from "react-router-dom";
import { theFoodBill } from "../../assets/icon";
import { useState,useEffect } from "react";
import axios from "axios";

const NonTravelExpenseComponent = () => {
  const navigate = useNavigate();
  const [nonTravelExpense, setNonTravelExpense] = useState([]);
  

  useEffect(() => {
    axios.get('http://localhost:8080/expense/nonTravel/emp004')
      .then(response => {
        setNonTravelExpense(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  const redirectToNonTravelExpenseDetails =(ExpenseHeaderID,BillNumber) => {
    navigate(`/expense/nonTravel/${ExpenseHeaderID}/${BillNumber}`)
  }


  return ( 
    <div className="overflow-auto overflow-x-hidden overflow-y-scroll h-[230px] ">
    {nonTravelExpense.map((item, index) => (
      <div key={index} className="bg-white flex flex-row items-start justify-start border-b-[1px] border-solid border-ebgrey-100">
        <div className="relative w-[140px] h-14 overflow-hidden shrink-0 text-darkslategray">
          <div className="absolute top-[calc(50%_-_9px)] left-[calc(50%-_42px)] font-medium">
            {item.EmployeeName}
          </div>
        </div>
        <div className="relative w-[126px] h-14 overflow-hidden shrink-0 text-darkslategray">
          <div className="absolute top-[calc(50%-_7px)] left-[calc(50%-_15px)]">
            ₹{item.TotalAmount}
          </div>
        </div>
        <div className="relative w-14 h-14 overflow-hidden shrink-0">
          <div className="absolute top-[calc(50%-_16px)] left-[calc(50%-_16px)] rounded-81xl bg-ebgrey-800 w-8 h-8 overflow-hidden">
            <img
              className="absolute top-[1px] left-[8px] w-[15px] h-[30px] object-cover"
              alt=""
              src={theFoodBill}
            />
          </div>
        </div>
        <div className="relative w-[126px] h-14 overflow-hidden shrink-0 text-xs">
          <div className="absolute top-[calc(50%-_7px)] left-[calc(50%-_13px)]">
            {item.Category}
          </div>
        </div>
        <div className="relative w-[126px] h-14 overflow-hidden shrink-0 text-xs">
          <div className="absolute top-[calc(50%-_7px)] left-[calc(50%-_21px)]">
            {item.Date}
          </div>
        </div>
        <div className="relative w-[126px] h-14 overflow-hidden shrink-0 text-xs">
          <div className="absolute top-[calc(50%-_7px)] left-[calc(50%-_21px)]">
            {item.PaymentType}
          </div>
        </div>
        <div className="relative w-[137px] h-14 overflow-hidden shrink-0 text-center text-eb-primary-blue-500">
          <div className="absolute top-[calc(50%-_16px)] left-[calc(50%-_64.5px)] rounded-29xl box-border w-[129px] h-8 flex flex-row items-center justify-center py-4 px-4 border-[1px] border-solid border-eb-primary-blue-500">
            <div className="relative font-medium" onClick={() => redirectToNonTravelExpenseDetails(item.ExpenseHeaderID, item.BillNumber)}>View Details</div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
};

export default NonTravelExpenseComponent;
