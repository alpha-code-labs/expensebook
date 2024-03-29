import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import React ,{useState,useEffect}from "react"; 
import './App.css'
import CancelTrip from './pages/CancelTrip'
import TripRecovery from './pages/TravelRecovery'
import dummyForRecovery from './dummyData/dummyForRecovery'
import { transformTripData } from './utils/transformer';
import { logoutApi } from './utils/tripApi';
import { urlRedirection } from './utils/handyFunctions';

function App() { 
 const LOGIN_PAGE_URL =import.meta.env.VITE_LOGIN_PAGE_URL
  const [authToken, setAuthToken] = useState("authtoken this is from app"); // Assuming you have a way to manage authentication

  const handleLogout = async () => {
    logoutApi(authToken)
    urlRedirection(LOGIN_PAGE_URL)
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

  // //data for trip cancellection for user
  // const transformedTripData=transformTripData(dummyTripData)


  // data for paid and cancelled and recoverd
  const transformedRecoveryData= transformTripData(dummyForRecovery)

 



  return (
    <>
    <Router>
      <Routes>
        <Route path='/api/:tenantId/:empId/:tripId/trips' element={<CancelTrip />}/>
        <Route path='/api/:tenantId/:empId/recovery/:tripId' element={<TripRecovery transformedRecoveryData={transformedRecoveryData}/>} />
      </Routes>
    </Router>
    </>
  )
}

export default App
