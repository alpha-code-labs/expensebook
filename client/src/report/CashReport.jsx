import React from 'react';
import { formatAmount, formatDate } from '../utils/handyFunctions';
import { TableLayout } from '../components/common/Table';

const CashReport = ({ visibleHeaders, data }) => {
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
      {data.map((cash, index) => (
        <tr
          key={index}
          className={`divide-y border-y font-cabin text-sm text-neutral-700 hover:cursor-pointer hover:bg-gray-300 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
        >
          {visibleHeaders.map((header, headerIndex) => (
            <td key={headerIndex} className="px-4 py-2 border-b border-gray-300 whitespace-nowrap">
              {renderCellContent(cash, header)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // Helper function to render cell content based on header
  const renderCellContent = (cash, header) => {
    switch (header) {
      case 'travel request number':
        return cash?.travelRequestNumber;
      case 'travel request status':
        return cash?.travelRequestStatus;
      case 'travel type':
        return cash?.travelType;
      case 'cash-advance number':
        return cash?.cashAdvanceNumber;
      case 'requested date':
        return formatDate(cash?.cashAdvanceRequestDate);
      case 'created by':
        return cash?.createdBy;
      case 'cash-advance status':
        return cash?.cashAdvanceStatus;
      case 'amount':
        return `${cash?.currency} ${formatAmount(cash?.amount)}`;
      case 'payment mode':
        return cash?.paymentMode;
      case 'paid by':
        return cash?.paidBy ;
      case 'recovered by':
        return cash?.recoveredBy ;
      case 'approver':
        return cash?.approvers ?? "-"
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

export default CashReport;

