import React from 'react';
import { formatAmount, formatDate } from '../utils/handyFunctions';

const ExpenseReport = ({ visibleHeaders, expenseData }) => {

  // Render table headers dynamically based on visible headers
  const renderHeaders = () => (
    <thead className='bg-slate-100 font-inter text-xs text-left'>
      <tr>
        {visibleHeaders.map((title, index) => (
          <th
            key={index}
            className={`px-4 py-2 border-b sticky top-0 z-10 bg-indigo-100 border-gray-300 text-left capitalize font-medium text-neutral-700 ${index === 0 ? 'rounded-tl-lg' : ''} ${index === visibleHeaders.length - 1 ? 'rounded-tr-lg' : ''}`}
          >
            {title}
          </th>
        ))}
      </tr>
    </thead>
  );

  // Render table rows dynamically based on data and headers
  const renderRows = () => (
    <tbody>
      {expenseData.map((expense, index) => (
        <tr
          key={index}
          className={`divide-y border-y font-cabin text-sm text-neutral-700 hover:cursor-pointer hover:bg-gray-300 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
        >
          {visibleHeaders.map((header, headerIndex) => (
            <td key={headerIndex} className="px-4 py-2 border-b border-gray-300 whitespace-nowrap">
              {renderCellContent(expense, header)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // Helper function to render cell content based on header
  const renderCellContent = (expense, header) => {
    switch (header) {
      case 'trip name':
        return expense?.tripName;
      case 'trip number':
        return expense?.tripNumber;
      case 'trip status':
        return expense?.tripStatus;
      case 'travel type':
        return expense?.travelType;
      case 'expense number':
        return expense?.expenseNumber;
      case 'expense date':
        return formatDate(expense?.travelExpenseData?.expenseHeaderDate);
      case 'expense amount':
        return formatAmount(expense?.travelExpenseData?.totalAmount);
      case 'created by':
        return expense?.createdBy;
      case 'expense status':
        return expense?.expenseHeaderStatus;
      case 'payment mode':
        return expense?.travelExpenseData?.paymentMode;
      case 'paid by':
        return expense?.paidBy ?? "-";
      case 'completion date':
        return formatDate(expense?.tripCompletionDate);
      case 'approver':
        return expense?.approvers?? "-"
      case 'included bills':
        return 7; // Assuming this is a placeholder, update this as needed
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto mx-4 capitalize text-neutral-700 text-base">
      <div className="min-w-max scrollbar-hide">
        <table className="min-w-full bg-white">
          {renderHeaders()}
          {renderRows()}
        </table>
      </div>
    </div>
  );
};

export default ExpenseReport;

