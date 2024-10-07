import React from 'react';
import { formatDate } from '../utils/handyFunctions';
import { TableLayout } from '../components/common/Table';

const TripReport = ({ visibleHeaders, tripData }) => {

  // Render table headers dynamically
  const renderHeaders = () => (
    <thead className='bg-slate-100 font-inter text-xs text-left'>
      <tr>
        {visibleHeaders.map((title, index) => (
          <th
            key={index}
            className={`px-4 py-2 border-b sticky top-0  bg-gray-300 border-gray-300 text-left capitalize font-medium text-neutral-900 ${index === 0 ? 'rounded-tl-lg' : ''} ${index === visibleHeaders.length - 1 ? 'rounded-tr-lg' : ''}`}
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
      {tripData?.map((trip, index) => (
        <tr
          key={index}
          className={`divide-y border-y font-cabin text-sm text-neutral-700 hover:cursor-pointer hover:bg-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
        >
          {visibleHeaders.map((header, headerIndex) => (
            <td key={headerIndex} className="px-4 py-2 border-b border-gray-300 ">
              {renderCellContent(trip, header)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  // Helper function to render cell content based on header
  const renderCellContent = (trip, header) => {
    switch (header) {
      case 'trip name':
        return trip?.tripName   ?? "-";
      case 'travel request number':
        return trip?.travelRequestNumber   ?? "-";
      case 'start date':
        return formatDate(trip?.tripStartDate);
      case 'end date':
        return formatDate(trip?.tripCompletionDate);
      case 'trip number':
        return trip?.tripNumber  ?? "-";
      case 'travel type':
        return trip?.travelType;
      case 'trip status':
        return trip?.tripStatus;
      case 'created by':
        return trip?.createdBy;
      case 'approver':
        return trip?.approvers
      case 'group':
        return trip?.group
      case 'trip purpose':
        return trip?.tripPurpose;
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
}

export default TripReport;

