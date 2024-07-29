import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Page3 from './pages/Page-3';
import { useEffect, useState } from 'react';
import ExpenseApproval from './pages/ExpenseApproval';
import { urlRedirection } from './utils/handyFunctions';
import { logoutApi } from './utils/api';




function App() {
  const LOGIN_PAGE_URL = import.meta.env.VITE_LOGIN_PAGE_URL
  const [authToken, setAuthToken] = useState("authtoken this is from app"); // Assuming you have a way to manage authentication

  const handleLogout = async () => {
    logoutApi(authToken)
    urlRedirection(LOGIN_PAGE_URL)
    console.log('User logged out due to inactivity.');
  };

  useEffect(() => {
    const inactivityTimeout = 60 * 60 * 1000; // 60 minutes
    //const inactivityTimeout = 6000; 
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      startTimer();
    };

    const startTimer = () => {
      timer = setTimeout(() => {
        handleLogout();
      }, inactivityTimeout);
    };

    const handleUserActivity = () => {
      resetTimer();
    };

    // Attach event listeners for user activity
    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('keypress', handleUserActivity);
    document.addEventListener('click', handleUserActivity);

    // Start the initial timer
    startTimer();

    // Clean up event listeners on component unmount
    return () => {
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('keypress', handleUserActivity);
      document.removeEventListener('click', handleUserActivity);
      clearTimeout(timer);
    };
  }, [authToken]);




  return (
    <>
    {/* //http://localhost:5173/page3/65c5c3bef21cc9ab3038e21f/1004/65c5dec8cf52af3ac3026c46 */}
    
    <Router>
      <Routes>
       <Route path='/:tenantId/:empId/:tripId/:expenseHeaderId/travel-expense-approval' element={<ExpenseApproval/>}/>
       <Route path='/:tenantId/:empId/:travelRequestId/travel-approval' element={<Page3/>}/>

      </Routes>
    </Router>
   
    </>
  )
}


export default App
