

import React, { useState } from 'react';
import { formatDate } from '../utils/handyFunctions';

const ExpenseReport = ({visibleHeaders,expenseData}) => {


  return (
    <div className="overflow-x-auto mx-4 capitalize text-neutral-700 text-base h-[40%]">
      <div className="min-w-max ">
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
            {expenseData.map((trip, index) => (
              <tr key={index} className="hover:bg-gray-100">
                {visibleHeaders.includes('trip number') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {trip.tripNumber}
                  </td>
                )}
                 {visibleHeaders.includes('trip status') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {trip.tripStatus}
                  </td>
                )}

                {visibleHeaders.includes('travel type') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {trip.travelType}
                  </td>
                )}

                {visibleHeaders.includes('expense number') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {trip.tripNumber}
                  </td>
                )}

                {visibleHeaders.includes('expense date') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {formatDate(trip.travelExpenseData.expenseHeaderDate)}
                  </td>
                )}

                {visibleHeaders.includes('expense amount') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {trip.travelExpenseData.totalAmount}
                  </td>
                )}

                {visibleHeaders.includes('created by') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {trip.travelExpenseData.createdBy.name}
                  </td>
                )}

                {visibleHeaders.includes('expense status') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {trip.travelExpenseData.expenseHeaderStatus}
                  </td>
                )}
                
                {visibleHeaders.includes('payment mode') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {trip.travelExpenseData.paymentMode}
                  </td>
                )}

                {visibleHeaders.includes('paid by') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {trip.travelExpenseData.paidBy.name}
                  </td>
                )}

                {visibleHeaders.includes('completion date') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
               
                    {formatDate(trip.tripCompletionDate)}
                  </td>
                )}
                
                {visibleHeaders.includes('expense approver') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {trip.travelExpenseData.approvers.map((approver, index) => (
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

export default ExpenseReport
