import React from 'react';
import Select from '../components/common/Select';
import { camelCaseToTitleCase, titleCase } from '../utils/handyFunctions';

const Allocations = ({ errorMsg, getSavedAllocations, travelExpenseAllocation, travelAllocationFlag, onAllocationSelection }) => {
  const validAllocationFlags = ['level1', 'level2', 'level3'];
  
  return (
    <div className="flex flex-wrap mb-5 justify-start md:justify-center items-center gap-2">
      {travelExpenseAllocation?.map((expItem, index) => (
        <React.Fragment key={index}>
          <div className="h-[48px]  my-4 space-x-2">
            <Select 
              // error={errorMsg.allocations}
              error={errorMsg[expItem?.headerName]}
              currentOption={getSavedAllocations?.find(item => item?.headerName === expItem?.headerName)?.headerValue ?? ''}
              options={expItem.headerValues}
              onSelect={(option) => onAllocationSelection(expItem.headerName ,option )}
              placeholder={`Select ${camelCaseToTitleCase(expItem.headerName ?? "")}`}
              title={`${camelCaseToTitleCase(expItem.headerName ?? "")}`}
            />            
          </div>
        </React.Fragment>
      ))}       
    </div>
  );
}

export default Allocations;


