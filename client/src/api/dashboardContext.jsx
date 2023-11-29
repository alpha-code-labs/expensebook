import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const DashboardContext = createContext();



const Dashboard = ({ children }) => {
  
  const [nonTravelExpenseData, setNonTravelExpenseData] = useState(null);
  const [error, setError] = useState(null);

  const nonTravelExpenseURL = 'http://localhost:8080/nonTravelExpense/api/get-non-travel-expenses'; 

  

  useEffect(() => {
    async function getNonTravelExpenseData() {
      try {
        const response = await axios.get(nonTravelExpenseURL);
        setNonTravelExpenseData(response.data.nonTravelExpenses); // Correct the data property name
        setError(null); // Clear any previous errors if the request is successful
      } catch (error) {
        setError('An error occurred while fetching HR company data.');
        console.error("error message:", error);
      }
    }

    getNonTravelExpenseData();
  }, []);

  console.log(nonTravelExpenseData);
 

  return (
    <div>
      <DashboardContext.Provider value={{ nonTravelExpenseData, error }}>
        {children}
      </DashboardContext.Provider> {/* Use DashboardContext.Provider */}
      <div>
     

      </div>
    </div>
    
  );
};

export { Dashboard, DashboardContext };
