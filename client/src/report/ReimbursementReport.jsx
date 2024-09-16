

import React, { useState } from 'react';
import { formatDate } from '../utils/handyFunctions';

const ReimbursementReport = ({visibleHeaders,data}) => {


  return (

    <div className="overflow-x-auto mx-4 capitalize text-neutral-700 text-base h-[40%]">
      <div className="min-w-max">
        <table className=" min-w-full bg-white border border-gray-300">
          <thead>
            <tr className=' '>
              {visibleHeaders.map((title, index) => (
                <th key={index} className="px-4 py-2 border-b border-gray-300 bg-gray-100 text-left text-base font-cabin capitalize font-medium text-neutral-700">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((exp, index) => (
              <tr key={index} className="hover:bg-gray-100">
                {visibleHeaders.includes('reimbursement number') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {exp?.expenseHeaderNumber}
                  </td>
                )}
                 {visibleHeaders.includes('expense status') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {exp?.expenseHeaderStatus}
                  </td>
                )}

                {visibleHeaders.includes('requested date') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {exp.travelType}
                  </td>
                )}

                {visibleHeaders.includes('expense number') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {exp.tripNumber}
                  </td>
                )}

                {visibleHeaders.includes('expense date') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {formatDate(exp.travelExpenseData.expenseHeaderDate)}
                  </td>
                )}

                {visibleHeaders.includes('expense amount') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {exp.travelExpenseData.totalAmount}
                  </td>
                )}

                {visibleHeaders.includes('created by') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {exp.travelExpenseData.createdBy.name}
                  </td>
                )}

                {visibleHeaders.includes('expense status') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {exp.travelExpenseData.expenseHeaderStatus}
                  </td>
                )}
                
                {visibleHeaders.includes('payment mode') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {exp.travelExpenseData.paymentMode}
                  </td>
                )}

                {visibleHeaders.includes('paid by') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {exp.travelExpenseData.paidBy.name}
                  </td>
                )}

                {visibleHeaders.includes('completion date') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
               
                    {formatDate(exp.tripCompletionDate)}
                  </td>
                )}
                
                {visibleHeaders.includes('expense approver') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {exp.travelExpenseData.approvers.map((approver, index) => (
                      <div key={index}>
                        {approver.name} ({approver.status})
                      </div>
                    ))}
                  </td>
                )}
                
                {visibleHeaders.includes('included bills') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                   7
                  </td>
                )}
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ReimbursementReport
