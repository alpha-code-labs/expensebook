import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import { urlRedirection } from './utils/handyFunctions.js';
import './App.css';
import dummyTravelWithCashAdvanceData from './dummyData/travelWithCash';
import CreateExpense from './pages/CreateExpense';
import Crud from './pages/Crud.jsx';
import ClearRejectedExpense from './pages/ClearRejectedExpense.jsx';
import CreateNonTraveExpense from './pages/CreateNonTraveExpense.jsx';
import CreateExpenseLevel2 from './pages/CreateExpenseLevel2.jsx';
import GetAirport from './pages/GoogleMapsSearch.jsx';
import { logoutApi } from './utils/api.js';


function App() {

  const [authToken, setAuthToken] = useState("authtoken this is from app"); // Assuming you have a way to manage authentication

  const handleLogout = async () => {
    logoutApi(authToken)
    urlRedirection('http://localhost:8080/user-login/:companyName')
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
       <Route path='api/internal/expense/fe/tr-ex-create/:tenantId/:empId/:tripId' element={<CreateExpense/>}/>
       <Route path='tr-ex-create/:tenantId/:empId/:tripId/2' element={<CreateExpenseLevel2/>}/>
       <Route path='tr-ex-create/:tenantId/:empId/:tripId/:cancelFlag?' element={<CreateExpense/>}/> 
       <Route path='/clear-rejected' element={<ClearRejectedExpense/>}/>    
       <Route path='/' element={<Crud/>}/>    
       <Route path='/:tenantId/:empId/non-travel-expense' element={<CreateNonTraveExpense/>}/>
       <Route path='/non-travel-expense/:cancelFlag?' element={<CreateNonTraveExpense/>}/>
       <Route path='/' element={<GetAirport/>}/>
       
      </Routes>
    </Router>
    </>
  )
}

export default App

