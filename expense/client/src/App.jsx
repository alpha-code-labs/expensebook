import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import { urlRedirection } from './utils/handyFunctions.js';
import './App.css';
import CreateExpense from './pages/CreateExpense';
import Crud from './pages/Crud.jsx';

import ClearRejectedExpense from './pages/ClearRejectedExpense.jsx';
import CreateNonTraveExpense from './pages/CreateNonTraveExpense.jsx';

import { logoutApi } from './utils/api.js';
import Page_2 from './pages/Page_2.jsx';

function App() {
  
  const [authToken, setAuthToken] = useState("authtoken this is from app"); // Assuming you have a way to manage authentication

  const handleLogout = async () => {
    logoutApi(authToken)
    urlRedirection('http://localhost:8080/user-login/')
    console.log('User logged out due to inactivity.');
  };

  useEffect(() => {
    const inactivityTimeout = 60 * 60 * 1000; // 60 minutes
    // const inactivityTimeout = 6000; 
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
    <Router>
      <Routes>
        {/* ///if there is cancel then flag will there --/:cancelFlag? */}
       <Route path='/:tenantId/:empId/:tripId/book/travel-expense' element={<CreateExpense/>}/>
       <Route path='/:tenantId/:empId/:tripId/:cancel/travel-expense' element={<CreateExpense/>}/> 
       <Route path='/:tenantId/:empId/:tripId/:expenseHeaderId/clear-rejection/travel-expense' element={<ClearRejectedExpense/>}/>    
       <Route path='/' element={<Page_2/>}/>    
       <Route path='/:tenantId/:empId/book/reimbursement' element={<CreateNonTraveExpense/>}/>
       <Route path='/:tenantId/:empId/:expenseHeaderId/:cancel/reimbursement' element={<CreateNonTraveExpense/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App

