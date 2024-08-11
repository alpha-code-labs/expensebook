import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Function to count the number of trips by status
const countTripsByStatus = (data) => {

  const counts = data.reduce((acc, trip) => {
    acc[trip.tripStatus] = (acc[trip.tripStatus] || 0) + 1;
    return acc;
  }, {});
  
  // Ensure specific statuses are included
  const requiredStatuses = ["upcoming", "transit", "completed", "cancelled","recovered"];
  return requiredStatuses.map(status => ({
    name: status,
    count: counts[status] || 0,
  }));
};

const TripChart = ({ data }) => {
  const tripCounts = countTripsByStatus(data);
  const maxCount = Math.max(...tripCounts.map(trip => trip.count));

  return (
    <ResponsiveContainer width="80%" height={400}>
      <BarChart data={tripCounts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis 
          domain={[0, maxCount]} 
          allowDecimals={false} 
        />
        <Tooltip cursor={{ fill: 'none' }} />
        <Legend />
        <Bar 
          dataKey="count" 
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
