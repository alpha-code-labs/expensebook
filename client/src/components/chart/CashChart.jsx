import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatLargeNumber } from '../../utils/handyFunctions';


const processData = (data) => {
  const processed = data.map(trip => ({
    tripNumber: trip.tripNumber,
    totalExpense: trip.expenseAmountStatus.totalExpenseAmount + trip.expenseAmountStatus.totalAlreadyBookedExpenseAmount,
    totalExpenseAmount: trip.expenseAmountStatus.totalExpenseAmount,
    totalAlreadyBookedExpenseAmount: trip.expenseAmountStatus.totalAlreadyBookedExpenseAmount,
  }))
  .sort((a, b) => b.totalExpense - a.totalExpense)
  .slice(0, 4);

  // Fill with empty data if less than 8 entries
  while (processed.length < 4) {
    processed.push({ tripNumber: '-', totalExpense: 0, totalExpenseAmount: 0, totalAlreadyBookedExpenseAmount: 0 });
  }

  return processed;
};


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip rounded-md" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
       
        <p className='font-cabin font-medium'>{`Travel Expense: ${data.totalExpenseAmount.toLocaleString()}`}</p>
        <p className='font-cabin font-medium'>{`Already Booked Expense: ${data.totalAlreadyBookedExpenseAmount.toLocaleString()}`}</p>
        <div className='border-neutral-400 border my-2'/>
        <p className='font-cabin font-semibold'>{`Total Expense: ${data.totalExpense.toLocaleString()}`}</p>
      </div>
    );
  }

  return null;
};


const CashChart = ({data}) => {
  const processedData = processData(data);

  return (
    <ResponsiveContainer width="80%" height={400}>
      <BarChart
        data={processedData}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="tripNumber" />
        <YAxis tickFormatter={formatLargeNumber}/>
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'none' }}/>
        <Legend />
        <Bar 
          fill="#4C36F1" 
          barSize={60}
          label={{ position: 'top' }}
          background={{fill: '#eee'}}
          dataKey="totalExpense" 
         />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CashChart;


