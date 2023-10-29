import React, { useEffect, useState } from "react";
import axios from "axios";
import { theFoodBill } from "../assets/icon";

function ExpenseDetails(props) {
  const [expenseType, setExpenseType] = useState("Default Expense Type");
  const [campaignAmount, setCampaignAmount] = useState(0);
  const [campaignDescription, setCampaignDescription] = useState("No description available");
  const [campaignChannels, setCampaignChannels] = useState([]);

  useEffect(() => {
    axios
      .get("your-api-endpoint")
      .then((response) => {
        const data = response.data;
        setExpenseType(data.expenseType);
        setCampaignAmount(data.campaignAmount);
        setCampaignDescription(data.campaignDescription);
        setCampaignChannels(data.campaignChannels);
        setInvoiceUrl(data.invoiceUrl);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleApprove = () => {
  };

  const handleDeny = () => {
  };

  return (
    <div className="self-center flex w-[489px] max-w-full flex-col mt-8 mb-7">
      <header>
        <h2 className="text-neutral-700 text-2xl font-semibold tracking-tighter">
          Expense details
        </h2>
        <img
          src={theFoodBill}
          className="aspect-square object-cover object-center w-6 overflow-hidden max-w-full self-start"
          alt="Expense details"
        />
      </header>
      <section>
        <div className="text-zinc-600 text-xs self-start whitespace-nowrap">
          Expense Type
        </div>
        <div className="text-neutral-700 text-justify text-base items-center border border-[color:var(--eb-grey-200,#C8C9D0)] bg-white w-full grow mt-2 px-5 py-4 rounded-md border-solid self-start whitespace-nowrap max-md:max-w-full max-md:pl-1">
          {expenseType}
        </div>
      </section>
      <section className="items-start flex w-[175px] max-w-full flex-col mt-7 self-start">
        <div className="text-zinc-800 text-sm font-medium tracking-wide self-start whitespace-nowrap">
          Total Campaign Amount
        </div>
        <div className="items-center border border-[color:var(--eb-grey-200,#C8C9D0)] bg-white flex w-full grow flex-col mt-2 px-5 py-4 rounded-md border-solid self-start">
          <div className="flex w-[82px] max-w-full items-start gap-4 self-start max-md:ml-1">
            <div className="text-neutral-700 text-justify text-base self-stretch">
              ₹
            </div>
            <div className="text-neutral-700 text-justify text-base self-stretch whitespace-nowrap">
              {campaignAmount}
            </div>
          </div>
        </div>
      </section>
      <section className="items-start flex w-full flex-col mt-6 self-start max-md:max-w-full">
        <div className="text-zinc-600 text-xs self-start whitespace-nowrap">
          Campaign Description
        </div>
        <div className="text-neutral-700 text-justify text-base w-full max-w-full items-center border border-[color:var(--eb-grey-200,#C8C9D0)] bg-white grow mt-2 pt-4 pb-20 px-5 rounded-md border-solid self-start max-md:max-w-full max-md:pl-1 max-md:pb-2.5">
          {campaignDescription}
        </div>
      </section>
      <section className="items-start flex w-full flex-col mt-7 self-start max-md:max-w-full">
        <div className="text-zinc-600 text-xs self-start whitespace-nowrap">
          Campaign Channels
        </div>
        <div className="text-neutral-700 text-justify text-base items-center border border-[color:var(--eb-grey-200,#C8C9D0)] bg-white w-full grow mt-2 px-5 py-4 rounded-md border-solid self-start whitespace-nowrap max-md:max-w-full max-md:pl-1">
          {campaignChannels.map((channel, index) => (
            <div key={index}>{channel}</div>
          ))}
        </div>
      </section>
      <section className="flex w-[194px] max-w-full items-start gap-4 mt-5 self-start">
        <button
          className="text-indigo-600 text-center text-xs font-medium self-stretch justify-center items-center bg-violet-200 w-[75px] max-w-full px-4 py-2.5 rounded-xl whitespace-nowrap"
          onClick={handleApprove}
        >
          Approve
        </button>
        <button
          className="text-indigo-600 text-center text-xs font-medium self-stretch justify-center items-center bg-violet-200 w-[103px] max-w-full px-4 py-2.5 rounded-xl whitespace-nowrap"
          onClick={handleDeny}
        >
          Deny
        </button>
      </section>
    </div>
  );
}

export default ExpenseDetails;
