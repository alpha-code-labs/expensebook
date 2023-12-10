import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { frame476, x } from "../../../assets/icon";
import Modal from "../../common/Modal";

const NonTravelExpenseDetails = () => {
  const { ExpenseHeaderID, BillNumber } = useParams();
  const [nonTravelDetails, setNonTravelDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [denyReason, setDenyReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/expense/nonTravel/${ExpenseHeaderID}/${BillNumber}`)
      .then((response) => {
        console.log("Data received:", response.data);
        setNonTravelDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [ExpenseHeaderID, BillNumber]);
  

  const handleApprove = (ExpenseHeaderID, BillNumber) => {
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

  const handleDeny = (ExpenseHeaderID, BillNumber) => {
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
    <div className="relative bg-white w-full h-[980px] overflow-hidden text-left text-[20px] text-ebgrey-500 font-cabin">
      <div className="absolute top-[0px] left-[0px] bg-gray-400 w-[1280px] h-[980px] overflow-hidden" />
      {        // Additional check to ensure the item has required properties
       nonTravelDetails && nonTravelDetails.ExpenseType && nonTravelDetails.TotalAmount &&
        
        <div>

          <div className="absolute top-[calc(50%-_458px)] left-[calc(50%-_276px)] rounded-3xl bg-white w-[553px] h-[912px] overflow-hidden text-sm text-dimgray">
          <img
            className="absolute top-[32px] left-[497px] w-6 h-6 overflow-hidden"
            alt=""
            src={x}
          />
          <div className="absolute top-[32px] left-[32px] flex flex-row items-center justify-start text-[24px] text-darkslategray-100">
            <div className="flex flex-col items-start justify-start">
              <div className="relative tracking-[-0.04em] font-semibold">{`Expense details `}</div>
            </div>
          </div>
          <div className="absolute top-[93px] left-[32px] w-[489px] flex flex-col items-start justify-start">
            <div className="flex flex-col items-center justify-start">
              <div className="w-[489px] flex flex-col items-start justify-start gap-[8px]">
                <div className="relative">Expense Type</div>
                <div className="self-stretch h-[49px] flex flex-row flex-wrap items-start justify-start text-justify text-ebgrey-500">
                  <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-start py-2 px-6 relative border-[1px] border-solid border-ebgrey-200">
                    <div className="absolute my-0 mx-[!important] top-[16px] left-[24px] z-[0]">
                      {nonTravelDetails.ExpenseType}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-[288px] left-[32px] w-[489px] flex flex-col items-start justify-start">
            <div className="flex flex-col items-center justify-start">
              <div className="w-[489px] flex flex-col items-start justify-start gap-[8px]">
                <div className="relative">Description </div>
                <div className="self-stretch h-[157px] flex flex-row flex-wrap items-start justify-start text-justify text-ebgrey-500">
                  <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-start py-2 px-6 relative border-[1px] border-solid border-ebgrey-200">
                    <div className="absolute my-0 mx-[!important] top-[16px] left-[24px] inline-block w-[355px] shrink-0 z-[0]">{nonTravelDetails.Description}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-[191px] left-[32px] flex flex-col items-start justify-start gap-[8px] text-justify text-ebgrey-500">
            <div className="relative font-medium text-darkslategray-200 text-left z-[0]">
              Total Amount
            </div>
            <div className="w-[175px] h-12 flex flex-row flex-wrap items-start justify-start z-[1]">
              <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-start py-2 px-6 relative border-[1px] border-solid border-ebgrey-200">
                <div className="absolute my-0 mx-[!important] top-[16px] left-[24px] z-[0]">
                  ₹
                </div>
              </div>
            </div>
            <div className="absolute my-0 mx-[!important] top-[41px] left-[49px] z-[2]">
              {nonTravelDetails.TotalAmount}
            </div>
          </div>
          <div className="absolute top-[494px] left-[32px] w-[489px] flex flex-col items-start justify-start gap-[8px]">
            <div className="relative">Vendor Name</div>
            <div className="self-stretch h-[49px] flex flex-row flex-wrap items-start justify-start text-justify text-ebgrey-500">
              <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-center justify-start py-2 px-6 relative border-[1px] border-solid border-ebgrey-200">
                <div className="absolute my-0 mx-[!important] top-[16px] left-[24px] z-[0]">
                  {nonTravelDetails.VendorName}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-[584px] left-[123px] rounded-xl bg-eb-primary-blue-100 h-8 flex flex-row items-center justify-center py-2 px-4 box-border text-center text-xs text-eb-primary-blue-500">
            <div className="relative font-medium">{nonTravelDetails.BillStatus}</div>
          </div> 
          <div className="absolute top-[584px] left-[32px] rounded-xl bg-eb-primary-blue-100 h-8 flex flex-row items-center justify-center py-2 px-4 box-border text-center text-xs text-eb-primary-blue-500">
            <div className="relative font-medium">{nonTravelDetails.PaymentType}</div>
          </div>
          <div className="absolute top-[640px] left-[32px] flex flex-col items-start justify-start gap-[16px] text-ebgrey-500">
            <div className="flex flex-row items-start justify-start gap-[16px]">
              <div className="flex flex-col items-start justify-start">
                <div className="relative font-medium">Invoice</div>
              </div>
              <div />
            </div>
            <div className="self-stretch rounded-md bg-whitesmoke box-border h-[153px] flex flex-row items-center justify-center py-2 px-6 border-[1px] border-dashed border-darkgray">
              <img
                className="relative w-20 h-[132px] overflow-hidden shrink-0 object-cover"
                alt=""
                src={frame476}
              />
            </div>
          </div>

          <div className="absolute top-[calc(50%_+_394px)] left-[32px] w-[180px] flex flex-row items-start justify-start gap-[8px] text-center text-white">
            <div className="flex-1 rounded-29xl bg-darkseagreen h-[34px] flex flex-row items-center justify-center py-4 px-8 box-border">
              <div className="relative font-medium flex items-center justify-center w-[71px] h-[18px] shrink-0" onClick={() => handleApprove(nonTravelDetails.ExpenseHeaderID, nonTravelDetails.BillNumber)}>
                Approve
              </div>
            </div>
            <div className="flex-1 rounded-29xl bg-rose-400 h-[34px] flex flex-row items-center justify-center py-4 px-8 box-border">
              <div className="relative font-medium flex items-center justify-center w-[71px] h-[18px] shrink-0" onClick={() => openDenyModal()}>
                Deny
              </div>
            </div>
          </div>

          </div>



        </div>
      }

     {/* Deny Modal */}
     <Modal
      openModal={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onDelete={() => handleDeny(ExpenseHeaderID, BillNumber)}
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
        <button onClick={() => handleDeny(ExpenseHeaderID, BillNumber)}>Submit</button>
      </div>
    </Modal>
  </div>
);
}

export default NonTravelExpenseDetails;