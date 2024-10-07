import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getStatusClass, titleCase } from '../../utils/handyFunctions';

// Function to process and count expense statuses
const processData = (activeView,data) => {
  const statusCounts = activeView ==="financeView" ? {
   
    'pending settlement': 0,
    'paid': 0,
    'paid and cancelled': 0,
    'Recovered': 0,
  }:{
    'rejected': 0,
    'pending approval': 0,
    'pending settlement': 0,
    'paid': 0,
    'paid and cancelled': 0,
  };

  // Loop through all the expenses and count statuses
  data.forEach(expense => {
    const status = expense.expenseHeaderStatus.toLowerCase();
    if (statusCounts.hasOwnProperty(status)) {
      statusCounts[status]++;
    }
  });

  // Convert the statusCounts object into an array for the chart
  return Object.keys(statusCounts).map(status => ({
    status: titleCase(status),
    count: statusCounts[status],
  }));
};

// Custom tooltip for the bar chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip rounded-md" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p className='font-cabin font-medium'>{`Status: ${data.status}`}</p>
        <p className='font-cabin font-semibold'>{`Total: ${data.count}`}</p>
      </div>
    );
  }

  return null;
};

const CustomXAxisTick = ({ x, y, payload }) => {
 
  return (
    <g transform={`translate(${x}, ${y})`}>
    
      
      <text 
        dy={14} // Positioning the text vertically
        textAnchor="middle" 
        
        className="text-neutral-900 font-inter font-semibold text-xs" // Tailwind CSS classes for text
      >
        {(payload.value ?? "-")}
      </text>
    </g>
  );
};


// The main component for displaying the bar chart
const NonTravelExpenseChart = ({ activeView,data }) => {
  
  const processedData = processData(activeView, data);

  return (
    <ResponsiveContainer width="80%" height={300}>
      <BarChart
        data={processedData}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <defs>
        <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#434343" stopOpacity={1} />
        <stop offset="100%" stopColor="#EFEFEF" stopOpacity={1} />
        </linearGradient>
        </defs>
        <XAxis dataKey="status"  tick={<CustomXAxisTick />}/>
        <YAxis />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'none' }} />
        <Legend />
        <Bar 
            radius={[10, 10, 0, 0]}
            fill="url(#gradientFill)"
            barSize={60}
            label={{ position: 'top' }}
            background={{fill: '#f8fafc',radius:[10, 10, 0, 0]}}
           dataKey="count" 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default NonTravelExpenseChart;






