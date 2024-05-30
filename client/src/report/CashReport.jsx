

import React, { useState } from 'react';
import { formatDate } from '../utils/handyFunctions';

const CashReport = ({visibleHeaders,data}) => {


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
            {data.map((cash, index) => (
              <tr key={index} className="hover:bg-gray-100">
                {visibleHeaders.includes('travel request number') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {cash?.travelRequestData?.travelRequestNumber}
                  </td>
                )}

                 {visibleHeaders.includes('travel request status') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {cash?.travelRequestData?.travelRequestStatus}
                  </td>
                )}

                {visibleHeaders.includes('travel type') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {cash?.travelRequestData?.travelType}
                  </td>
                )}

                {visibleHeaders.includes('cash-advance number') && (
                    <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                        {cash.cashAdvancesData.cashAdvanceNumber}
                    </td>
                )}

               

                {visibleHeaders.includes('requested date') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {formatDate(cash?.cashAdvancesData?.cashAdvanceRequestDate)}
                  </td>
                )}

              

                {visibleHeaders.includes('created by') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {cash?.cashAdvancesData?.createdBy?.name}

                  </td>
                )}

                {visibleHeaders.includes('cash-advance status') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {cash.cashAdvancesData.cashAdvanceStatus}
                  </td>
                )}
                
                {visibleHeaders.includes('payment mode') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {cash?.cashAdvancesData?.paymentMode}
                  </td>
                )}

                {visibleHeaders.includes('paid by') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {cash?.cashAdvancesData?.paidBy?.name}
                  </td>
                )}

             
                
                {visibleHeaders.includes('expense approver') && (
                  <td className="px-4 py-2 border-b border-gray-300 min-w-[200px]">
                    {cash.travelExpenseData.approvers.map((approver, index) => (
                      <div key={index}>
                        {approver.name} ({approver.status})
                      </div>
                    ))}
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

export default CashReport
