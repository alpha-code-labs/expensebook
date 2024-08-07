// import React from 'react';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

// const TravelExpenseTable = ({ travelExpense }) => {
//   const downloadExcel = () => {
//     const formattedData = travelExpense.map(expense => ({
//       'Employee Name': expense.createdBy.name,
//       'Expense To Settle': expense.expenseAmountStatus.totalRemainingCash,
//       'Expense Header Status': expense.expenseHeaderStatus,
//       'Travel Request ID': expense.expenseHeaderId
//     }));

//     const ws = XLSX.utils.json_to_sheet(formattedData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Travel Expenses");
//     const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//     saveAs(new Blob([wbout], { type: "application/octet-stream" }), "travel_expenses.xlsx");
//   };

//   return (
//     <div>
//       <div className="overflow-auto max-h-[400px] border flex space-between ">
//         <table className="min-w-full bg-white flex ">
//           <thead className="text-zinc-600">
//             <tr>
//               <th className="w-1/4 py-2">Employee Name</th>
//               <th className="w-1/4 py-2">Expense To Settle</th>
//               <th className="w-1/4 py-2">Expense Header Status</th>
//               <th className="w-1/4 py-2">Travel Request ID</th>
//             </tr>
//           </thead>
//           <tbody>
//             {travelExpense.map((expense, index) => (
//               <tr key={index} className="text-zinc-600">
//                 <td className="border px-4 py-2">{expense.createdBy.name}</td>
//                 <td className="border px-4 py-2">{expense.expenseAmountStatus.totalRemainingCash}</td>
//                 <td className="border px-4 py-2">{expense.expenseHeaderStatus}</td>
//                 <td className="border px-4 py-2">{expense.expenseHeaderId}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <button
//         className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
//         onClick={downloadExcel}
//       >
//         Download Excel
//       </button>
//     </div>
//   );
// };

// export default TravelExpenseTable;

import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const TravelExpenseTable = ({ travelExpense = [], nonTravelExpense = [] }) => {
const dataAvailable = travelExpense.length > 0 || nonTravelExpense.length > 0;

  const downloadExcel = () => {
    const formattedTravelData = travelExpense.map(expense => ({
      'Employee Name': expense.createdBy.name,
      'Expense To Settle': expense.expenseAmountStatus.totalRemainingCash,
      'Expense Header Status': expense.expenseHeaderStatus,
      'Expense Header ID': expense.expenseHeaderId,
    }));

    const formattedNonTravelData = nonTravelExpense.map(expense => ({
    'Employee Name': expense.createdBy.name,
    'Expense To Settle': " ",
    'Expense Header Status': expense.expenseHeaderStatus,
    'Expense Header ID': expense.expenseHeaderId,
    }));

    const formattedData = [...formattedTravelData, ...formattedNonTravelData];

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "expenses.xlsx");
};

return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center py-2 text-zinc-500">
        <div className="flex w-full">
          <th className="w-1/4 py-2">Employee Name</th>
          <th className="w-1/4 py-2">Expense To Settle</th>
          <th className="w-1/4 py-2">Expense Header Status</th>
          <th className="w-1/4 py-2">Travel Request ID</th>
        </div>
        {dataAvailable && (
          <button
            className="ml-4 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
            onClick={downloadExcel}
          >
            Download Excel
          </button>
        )}
      </div>
      <div className="overflow-auto max-h-[400px] border mt-2">
        <table className="min-w-full bg-white">
          <tbody>
            {travelExpense.length > 0 && travelExpense.map((expense, index) => (
              <tr key={index} className="text-zinc-600">
                <td className="border px-4 py-2 w-1/4">{expense.createdBy.name}</td>
                <td className="border px-4 py-2 w-1/4">{expense.expenseAmountStatus.totalRemainingCash}</td>
                <td className="border px-4 py-2 w-1/4">{expense.expenseHeaderStatus}</td>
                <td className="border px-4 py-2 w-1/4">{expense.expenseHeaderId}</td>
              </tr>
            ))}
            {nonTravelExpense.length > 0 && nonTravelExpense.map((expense, index) => (
              <tr key={index} className="text-zinc-600">
                <td className="border px-4 py-2 w-1/4">{expense.createdBy.name}</td>
                <td className="border px-4 py-2 w-1/4">{expense.expenseAmountStatus.totalRemainingCash || ""}</td>
                <td className="border px-4 py-2 w-1/4">{expense.expenseHeaderStatus}</td>
                <td className="border px-4 py-2 w-1/4">{expense.expenseHeaderId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TravelExpenseTable;
