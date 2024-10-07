import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { titleCase } from '../../utils/handyFunctions';

// Function to count the number of trips by status
const countTripsByStatus = (data) => {

  const counts = data.reduce((acc, trip) => {
    acc[trip.tripStatus] = (acc[trip.tripStatus] || 0) + 1;
    return acc;
  }, {});
  
  // Ensure specific statuses are included
  const requiredStatuses = ["upcoming", "transit", "completed", "cancelled","recovered"];
  return requiredStatuses.map(status => ({
    name: titleCase(`${status} Trips`),
    "Trips": counts[status] || 0,
  }));
};
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip rounded-md" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p className='font-cabin font-medium'>{`Status: ${data?.name}`}</p>
        <p className='font-cabin font-semibold'>{`Total: ${data?.["Trips"]}`}</p>
      </div>
    );
  }

  return null;
};
const CustomXAxisTick = ({ x, y, payload }) => {
 
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text 
        dy={14} 
        textAnchor="middle" 
       
        className="text-neutral-900 truncate shrink-0 font-inter font-semibold text-xs" 
      > 
        {(payload.value ?? "-")} 
      </text>
    </g>
  );
};
const TripChart = ({ data }) => {
  const tripCounts = countTripsByStatus(data);
  const maxCount = Math.max(...tripCounts.map(trip => trip["Trips"]));

  return (
    <ResponsiveContainer  width="70%" height={300}>
      <BarChart   data={tripCounts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
         <defs>
        <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#434343" stopOpacity={1} />
        <stop offset="100%" stopColor="#EFEFEF" stopOpacity={1} />
        </linearGradient>
        </defs>
        <XAxis dataKey="name" tick={<CustomXAxisTick />}/>
        <YAxis 
        
          domain={[0, maxCount]} 
          allowDecimals={false} 
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'none' }} />
        <Legend />
        <Bar 
          radius={[10, 10, 0, 0]}
          dataKey="Trips" 
          fill="url(#gradientFill)"
          barSize={60}
          label={{ position: 'top' }}
          background={{fill: '#f8fafc',radius:[10, 10, 0, 0]}}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TripChart;
