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

const TripChart = ({ data }) => {
  const tripCounts = countTripsByStatus(data);
  const maxCount = Math.max(...tripCounts.map(trip => trip["Trips"]));

  return (
    <ResponsiveContainer width="80%" height={400}>
      <BarChart data={tripCounts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis 
          domain={[0, maxCount]} 
          allowDecimals={false} 
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'none' }} />
        <Legend />
        <Bar 
          dataKey="Trips" 
          fill="#4C36F1" 
          barSize={60}
          label={{ position: 'top' }}
         
          background={{ fill: '#eee' }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TripChart;
