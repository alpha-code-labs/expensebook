import React from 'react'

const StatusButton = () => {
    function getStatusClass(status) {
        switch (status) {
          case 'Paid':
            return 'bg-green-100 text-green-200 px-4';
          case 'Cancelled':
          case 'Rejected':
            return 'bg-red-100 text-red-900';
          case 'Pending Settlement':
            return 'border-[1px] text-purple-500 border-purple-500';
          default:
            return '';
        }
      }
      
  return (
    <div>
        
      
    </div>
  )
}

export default StatusButton
