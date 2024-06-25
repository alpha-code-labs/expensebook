import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DashboardApprovalOptions = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('TravelRequests');

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    navigate(`/${option.toLowerCase()}`);
  };

  const options = [
    { key: 'settlingCashAdvance', label: 'Settling Cash Advance' },
    { key: 'settlingTravelExpense', label: 'Settling Travel Expense' },
    { key: 'settlingNonTravelExpense', label: 'Settling Non Travel Expense' },
    { key: 'recoveringPaidandCanceledCashAdvance', label: 'Recovering Paid and Canceled Cash Advance' },
    { key: 'settlingAccountingEntriesforAllExpenses', label: 'Settling accounting entries for all expenses' },
    { key: 'otherFinanceRequirements', label: 'Other Finance Requirements' },
  ];

  return (
    <div className="flex flex-row items-start justify-start gap-[8px]">
      <div className="flex flex-col items-start justify-start py-0 pr-0 pl-4">
        <div className="flex flex-row items-center justify-start gap-[16px]">
          {options.map((option) => (
            <div
              key={option.key}
              className={`whitespace-nowrap cursor-pointer rounded-xl flex flex-row items-start justify-start py-1 px-2 ${
                selectedOption === option.key ? 'bg-eb-primary-blue-500 text-white' : 'text-[#7C7C7C]'
              }`}
              onClick={() => handleOptionClick(option.key)}
            >
              <div className="font-medium">{option.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative box-border w-[901px] h-px border-t-[1px] border-solid border-gainsboro-100" />
    </div>
  );
};

export default DashboardApprovalOptions;
