import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const HRCompanyContext = createContext();

const HRCompany = ({ children }) => {
  const [HRCompanyData, setHRCompanyData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function getHRCompanyData() {
      
      try {
        const response = await axios.get('http://localhost:3000/api/hrcompany/603f3b07965db634c8769a081');
        setHRCompanyData(response.data.hrCompany); // Access response.data to get the actual data
        setError(null); // Clear any previous errors if the request is successful
      } catch (error) {
        setError('An error occurred while fetching HR company data.');
        console.error("error message:", error);
      }
    }

    getHRCompanyData();
  }, []);
  console.log(HRCompanyData)

  return (
    <div>
      <HRCompanyContext.Provider value={{ HRCompanyData, error }}>
        {children}
      </HRCompanyContext.Provider>
    </div>
  );
};

export { HRCompany, HRCompanyContext };
