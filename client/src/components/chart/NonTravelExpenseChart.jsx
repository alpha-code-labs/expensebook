import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { titleCase } from '../../utils/handyFunctions';

// Function to process and "Non-Travel Expense" expense statuses
const processData = (data) => {
  const statusCounts = {
    'new': 0,
    'pending approval': 0,
    'pending settlement': 0,
    'paid': 0,
    'paid and cancelled': 0,
  };

  // Loop through all the expenses and "Non-Travel Expense" statuses
  data.forEach(expense => {
    const status = expense.expenseHeaderStatus.toLowerCase();
    if (statusCounts.hasOwnProperty(status)) {
      statusCounts[status]++;
    }
  });

  // Convert the statusCounts object into an array for the chart
  return Object.keys(statusCounts).map(status => ({
    status: titleCase(status),
    "Non-Travel Expense": statusCounts[status],
  }));
};

// Custom tooltip for the bar chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip rounded-md" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p className='font-cabin font-medium'>{`Status: ${data.status}`}</p>
        <p className='font-cabin font-semibold'>{`Total: ${data?.["Non-Travel Expense"]}`}</p>
      </div>
    );
  }

  return null;
};

// The main component for displaying the bar chart
const NonTravelExpenseChart = ({ data }) => {
  const processedData = processData(data);

  return (
    <ResponsiveContainer width="80%" height={400}>
      <BarChart
        data={processedData}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <XAxis dataKey="status" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'none' }} />
        <Legend />
        <Bar 
          fill="#4C36F1" 
          barSize={60}
          label={{ position: 'top' }}
          background={{ fill: '#eee' }}
          dataKey="Non-Travel Expense"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default NonTravelExpenseChart;






