import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatLargeNumber, titleCase } from '../../utils/handyFunctions';


const processData = (activeView,data) => {
  const statusCounts = activeView ==="financeView"? {
   
    'pending settlement': 0,
    'paid': 0,
    'paid and cancelled': 0,
    'Recovered': 0,
  }:{
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

const CustomXAxisTick = ({ x, y, payload }) => {
 
  return (
    <g transform={`translate(${x}, ${y})`}>
    
      
      <text 
        dy={14} // Positioning the text vertically
        textAnchor="middle" 
        // style={{ fill: '#1D4ED8' }}
        className="text-neutral-900 font-inter font-semibold text-xs" // Tailwind CSS classes for text
      >
        {(payload.value ?? "-")}
      </text>
    </g>
  );
};


const BarChartComponent = ({activeView,data}) => {
  const processedData = processData(activeView,data);

  return (
    <ResponsiveContainer width="60%" height={300}>
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
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="status" tick={<CustomXAxisTick />}/>
        <YAxis tickFormatter={formatLargeNumber} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'none' }}/>
        <Legend />
        <Bar 
          radius={[10, 10, 0, 0]}
          fill="url(#gradientFill)"  
          barSize={60}
          label={{ position: 'top' }}
          background={{fill: '#f8fafc',radius:[10, 10, 0, 0]}}
          dataKey="Travel Expense"
         />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;


