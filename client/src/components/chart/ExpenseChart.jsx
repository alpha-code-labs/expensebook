import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatLargeNumber, titleCase } from '../../utils/handyFunctions';


const processData = (data) => {
  const statusCounts = {
    'new': 0,
    'pending approval': 0,
    'pending settlement': 0,
    'paid': 0,
    'paid and cancelled': 0,
    
  };

  // Loop through all the cash advances and "Travel Expense" statuses
  data.forEach(travel => {
    travel.travelExpenses?.forEach(travelExpense => {
      const status = travelExpense.expenseHeaderStatus.toLowerCase();
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      }
    });
  });

  // Convert the statusCounts object to an array for the chart
  return Object.keys(statusCounts).map(status => ({
    status:titleCase(status),
    "Travel Expense": statusCounts[status],
  }));
};


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload?.length) {
    const data = payload[0]?.payload;
    return (
      <div className="custom-tooltip rounded-md" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p className='font-cabin font-medium'>{`Status: ${data?.status}`}</p>
        <p className='font-cabin font-semibold'>{`Total: ${data?.["Travel Expense"]}`}</p>
      </div>
    );
  }

  return null;
};


const BarChartComponent = ({data}) => {
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
        <XAxis dataKey="status" />
        <YAxis tickFormatter={formatLargeNumber}/>
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'none' }}/>
        <Legend />
        <Bar 
          fill="#4C36F1" 
          barSize={60}
          label={{ position: 'top' }}
          background={{fill: '#eee'}}
          dataKey="Travel Expense"
         />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;


