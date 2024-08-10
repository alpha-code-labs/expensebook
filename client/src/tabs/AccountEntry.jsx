import React from 'react'
import Select from '../common/Select'
import Input from '../common/Input'

const AccountEntry = () => {

  
  const formatDateToYYYYMMDD = (dateString) => {
    const date = new Date(dateString); 
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  
  const subtractDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };
  
  const startOfWeek = (date) => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = result.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    result.setDate(diff);
    return result;
  };
  
  const endOfWeek = (date) => {
    const result = startOfWeek(date);
    result.setDate(result.getDate() + 6);
    return result;
  };
  
  const startOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };
  
  const endOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };
  
  const presets = [
    { label: 'Today', range: [new Date(), new Date()] },
    { label: 'Yesterday', range: [subtractDays(new Date(), 1), subtractDays(new Date(), 1)] },
    { label: 'Last 7 Days', range: [subtractDays(new Date(), 6), new Date()] },
    { label: 'This Week', range: [startOfWeek(new Date()), endOfWeek(new Date())] },
    { label: 'This Month', range: [startOfMonth(new Date()), endOfMonth(new Date())] },
  ];


  return (
    <div>
     <div className='flex items items-center  justify-between'>
          <div>
            <Select
              options={presets.map(preset => preset.label)}
              onSelect={(value)=> handlePresetChange(value)}
              title="Custom"/>
          </div>
          <div className='flex gap-2'>
          <div className='w-[200px]'>
            <Input
              title="From"
              type="date"
              value={formatDateToYYYYMMDD(startDate)}
              onChange={(value)=>handleFilterForm('startDate',value)}
            />
          </div>
        <div className='w-[200px]'>
          <Input
            title="Till"
            type="date"
            value={formatDateToYYYYMMDD(endDate)}
            onChange={(value)=>handleFilterForm('endDate',value)}
            // min={startDate}
          />
        </div>
        </div>
        </div>
    </div>
  )
}

export default AccountEntry
