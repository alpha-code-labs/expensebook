import React from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { alertCircle, checkGreen, theFoodBill, x, xRed } from '../../../assets/icon';
import Loading from '../../common/Loading';
import { useParams } from 'react-router-dom';

const TravelExpenseDetails = ({ExpenseHeaderType, ExpenseHeaderID, EmpId, setShoModal}) => {
  console.log(ExpenseHeaderType, ExpenseHeaderID, EmpId, '......rr')
  const [isLoading, setIsLoading] = useState(true);
  const [expenseLines, setExpenseLines] = useState([]);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [amountRemaining, setAmountRemaining] = useState(0);


  useEffect(() => {
    const fetchExpenseLines = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/travelExpense/${ExpenseHeaderType}/${ExpenseHeaderID}/${EmpId}`);
        const data = response.data; 

        setExpenseLines(data.expenseLines); // Populate expenseLines
        setAdvanceAmount(data.advanceAmount);
        setAmountRemaining(data.amountRemaining);
      } catch (error) {
        console.error("Error Fetching Travel Expense Details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenseLines();
  }, [ExpenseHeaderType, ExpenseHeaderID, EmpId]);
  
  
  const handleApproveAll = (ExpenseHeaderID, BillNumber) => {
    axios
      .put(`http://localhost:8080/expense/nonTravel/billStatusApproved/${ExpenseHeaderID}/${BillNumber}`, {
        billStatus: "approved",
      })
      .then(() => {
        console.log("Bill has been approved.");
      })
      .catch((error) => {
        console.error("Error approving the bill:", error);
      });
  };

  const openDenyModal = () => {
    setIsModalOpen(true);
  };

  const handleDenyAll = (ExpenseHeaderID, BillNumber) => {
    axios
      .put(`http://localhost:8080/expense/nonTravel/billStatusRejected/${ExpenseHeaderID}/${BillNumber}`, {
        billStatus: "rejected",
        reasonForRejection: denyReason,
      })
      .then(() => {
        console.log("Bill has been Rejected.");
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error Rejecting the bill:", error);
      });
  };

  return (
    <div className="relative w-fit overflow-hidden text-left text-xs text-ebgrey-500 font-cabin">
      {isLoading ? (
          <Loading />
        ) : (
      <div className="relative rounded-3xl bg-white w-[744px] h-[531px] overflow-hidden text-ebgrey-600">
      
     <div>
      <img className="absolute top-[24px] left-[698px] w-6 h-6 overflow-hidden" alt="" src={x} onClick={()=>setShoModal(false)} />
      
      <div className="absolute top-[24px] left-[24px] text-xl font-medium text-ebgrey-500">
        {expenseLines[0].TripPurpose}
      </div>

        <div className="absolute top-[calc(50%-_156.5px)] left-[500px] w-[180px] flex flex-row items-start justify-start gap-[8px] text-center text-sm text-white">
          <div className="flex-1 rounded-29xl bg-darkseagreen h-[34px] flex flex-row items-center justify-center py-4 px-8 box-border">
            <div className="relative font-medium flex items-center justify-center w-[71px] h-[18px] shrink-0" onClick={() => handleApproveAll(item.ExpenseHeaderID, item.ExpenseHeaderType, item.EmpId)}>
              Approve All
            </div>
          </div>
          <div className="flex-1 rounded-29xl bg-rose-400 w-[86px] h-[34px] flex flex-row items-center justify-center py-4 px-8 box-border">
            <div className="relative font-medium flex items-center justify-center w-[71px] h-[18px] shrink-0" onClick={() => handleDenyAll(item.ExpenseHeaderID, item.ExpenseHeaderType, item.EmpId)}>
              Deny All
            </div>
          </div>
        </div>

        <div className="absolute top-[96px] left-[34px] flex flex-row items-start justify-start gap-[24px] text-xl text-ebgrey-500">
          {<div className="flex flex-col items-start justify-start gap-[8px]">
            <div className="relative inline-block w-[130px]">{advanceAmount}</div>
            <div className="relative text-xs text-ebgrey-400">
            AdvanceAmount
            </div>
          </div>}
          {<div className="flex flex-col items-start justify-start gap-[8px]">
            <div className="relative inline-block w-[130px]">  {amountRemaining}</div>
            <div className="relative text-xs text-ebgrey-400">
              AmountRemaining
            </div>
          </div>}
        </div>
         
        <div className="absolute top-[175px] left-[27px] flex flex-row items-start justify-start">
          <div className="bg-white flex flex-col max-h-[300px] overflow-y-scroll items-start justify-start border-b-[1px] border-solid border-ebgrey-100">
           {expenseLines.map((item, index) => (
            <div key={index} className='flex flex-row'>
            <div className="relative w-14 h-14 overflow-hidden shrink-0">
              <div className="absolute top-[calc(50%-_16px)] left-[calc(50%-_16px)] rounded-81xl bg-ebgrey-800 w-8 h-8 overflow-hidden">
                <img className="absolute top-[1px] left-[8px] w-[15px] h-[30px] object-cover" alt="" src={theFoodBill} />
              </div>
            </div>

            
           
            {<div className="relative w-[126px] h-14 overflow-hidden shrink-0 text-sm text-eb-primary-blue-500">
              <div className="absolute top-[21px] left-[24px] flex flex-row items-end justify-start gap-[8px]">
                {{amountRemaining} < 0 && (
                    <img className="relative w-4 h-4 overflow-hidden shrink-0" alt="" src={alertCircle} />
                   )}

                <div className="relative">{item.TotalAmount}</div>
              </div>
            </div>}
           
            
            {<div className="relative w-[126px] h-14 overflow-hidden shrink-0">
              <div className="absolute top-[calc(50%-_7px)] left-[calc(50%-_13px)]">
                {item.ExpenseType}
              </div>
            </div>}
            {<div className="relative w-[126px] h-14 overflow-hidden shrink-0">
              <div className="absolute top-[calc(50%-_7px)] left-[calc(50%-_21px)]">
                {item.BillDate}
              </div>
            </div>}
            <div className="relative w-[126px] h-14 overflow-hidden shrink-0">
              <div className="absolute top-[calc(50%-_7px)] left-[39px]">
                12:00 PM
              </div>
            </div>
            {<div className="relative w-[126px] h-14 overflow-hidden shrink-0">
              <div className="absolute top-[16px] left-[32px] flex flex-row items-start justify-start gap-[16px]">
                <div className="rounded-29xl bg-darkseagreen w-6 h-6 flex flex-row items-center justify-center p-2 box-border">
                  <img className="relative w-4 h-4 overflow-hidden shrink-0" alt="" src={checkGreen} />
                </div>
                <div className="rounded-29xl bg-rose-400 white w-6 h-6 flex flex-row items-center justify-center p-2 box-border">
                  <img className="relative w-6 h-6 overflow-hidden shrink-0" alt="" src={xRed} />
                </div>
              </div>
            </div>}
            </div>
         ))}
          </div>
        </div>

        {{amountRemaining} < 0 && (
       <div className="absolute top-[215px] left-[104px] rounded-lg bg-white box-border w-[301px] h-8 overflow-hidden text-blueviolet border-[1px] border-solid border-ebgrey-100">
          <div className="absolute top-[calc(50%-_7px)] left-[11px]">
          <span className="font-medium">{`Note: `}</span>
          <span>This amount violates this employee's group limit.</span>
       </div>
      </div>
       )}
        
        </div>
        {/* Deny Modal */}
     <Modal
      openModal={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onDelete={() => handleDenyAll(ExpenseHeaderID, BillNumber)}
    >
      <div>
        <div>Title: Reject with Reasons</div>
        <input
         type="text"
         value={denyReason}
         onChange={(e) => setDenyReason(e.target.value)}
         placeholder="Enter 200 characters of deny reason"
         maxLength={200}
        />
        <button onClick={() => handleDenyA(ExpenseHeaderID, BillNumber)}>Submit</button>
      </div>
    </Modal>
        
      )
      </div>
      
      
    )}
  </div>
  
);
}

export default TravelExpenseDetails;
