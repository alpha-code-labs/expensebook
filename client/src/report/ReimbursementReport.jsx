import React from 'react';
import { formatAmount, formatDate } from '../utils/handyFunctions';
import { TableLayout } from '../components/common/Table';

const ReimbursementReport = ({ visibleHeaders, data }) => {
  // Render table headers dynamically
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
      {data.map((expense, index) => (
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
      case 'expense number':
        return expense?.expenseHeaderNumber;
      case 'expense type':
        return expense?.expenseType;
      case 'submitted on':
        return formatDate(expense?.expenseSubmissionDate);
      
      case 'created by':
        return expense?.createdBy;
      case 'expense status':
        return expense?.expenseHeaderStatus;
      
      case 'paid by':
        return expense?.paidBy?.name || 'N/A';
      case 'expense amount':
        return `${expense?.defaultCurrency} ${formatAmount(expense?.totalExpenseAmount)}`; 
      case 'approver':
        return expense?.approvers ?? "-"
      default:
        return null;
    }
  };

  return (
    <TableLayout>
    {renderHeaders()}
    {renderRows()}
 </TableLayout>
  );
};

export default ReimbursementReport;


