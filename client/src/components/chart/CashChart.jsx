import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatLargeNumber, titleCase } from '../../utils/handyFunctions';

// Function to process the data
const processData = (data) => {
  const statusCounts = {
    'pending approval': 0,
    'pending settlement': 0,
    'paid': 0,
    'paid and cancelled': 0,
    '-': 0,
  };

  // Loop through all the cash advances and "Cash-Advances" statuses
  data.forEach(travel => {
    travel.cashAdvances?.forEach(cashAdvance => {
      const status = cashAdvance.cashAdvanceStatus.toLowerCase();
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      }
    });
  });

  // Convert the statusCounts object to an array for the chart
  return Object.keys(statusCounts).map(status => ({
    status:titleCase(status),
    "Cash-Advances": statusCounts[status],
  }));
};

// Custom Tooltip Component (optional)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload?.length) {
    const data = payload[0]?.payload;
    return (
      <div className="custom-tooltip rounded-md" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p className='font-cabin font-medium'>{`Status: ${data?.status}`}</p>
        <p className='font-cabin font-semibold'>{`Total: ${data?.["Cash-Advances"]}`}</p>
      </div>
    );
  }

  return null;
};

const CashChart = ({data}) => {
  const processedData = processData(data);
  const maxCount=  Math.max(...processedData.map(cash=>cash?.["Cash-Advances"]))

  return (
    <ResponsiveContainer width="80%" height={400}>
      <BarChart
        data={processedData}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <XAxis dataKey="status" />
        <YAxis domain={[0, maxCount]}  tickFormatter={formatLargeNumber} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'none' }}/>
        <Legend />
        <Bar 
          fill="#4C36F1" 
          barSize={60}
          label={{ position: 'top' }}
          background={{ fill: '#eee' }}
          dataKey="Cash-Advances"
          
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CashChart;



