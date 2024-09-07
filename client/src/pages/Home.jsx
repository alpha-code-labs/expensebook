import React, { useState,useEffect } from 'react'
import {  Routes, Route, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Overview from './Overview';
import Travel from './Travel';
import CashAdvance from './CashAdvance';
import Expense from './Expense';
import Approval from './Approval';
import Settlement from './Settlement';
import Booking from './Booking';
import Profile from './Profile';
import Error from '../components/common/Error';
import { getEmployeeData_API, getEmployeeRoles_API, logoutApi } from '../utils/api';
import { useData } from '../api/DataProvider';
import { handleLoginPageUrl } from '../utils/actionHandler';

const Home = () => {

const {tenantId,empId}= useParams()
const [sidebarOpen,setSidebarOpen]=useState(false)

useEffect(() => {
  // Function to update state based on screen width
  const handleResize = () => {
    setSidebarOpen(window.innerWidth <= 768);
  };

  // Add event listener for window resize
  window.addEventListener('resize', handleResize);

  // Remove event listener on cleanup
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

const [authToken , setAuthToken] = useState("authtoken");
const [isLoading , setIsLoading]=useState(true);
const [loadingErrMsg, setLoadingErrMsg] = useState(null);
const {employeeRoles , setEmployeeRoles, setEmployeeData , employeeData } = useData(); 
  const fetchData = async () => {
    try {
      // Conditionally fetch employee roles only if employeeRoles is null
      let rolesResponse = employeeRoles;
      if (rolesResponse === null) {
        rolesResponse = await getEmployeeRoles_API(tenantId, empId);
        setEmployeeRoles(rolesResponse);
      }
  
      const employeeResponse = await getEmployeeData_API(tenantId, empId);
  
      
      // Set the state with the fetched data
      setEmployeeData(employeeResponse);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setLoadingErrMsg('Error danger', error.message);
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    fetchData()

  },[])
  
  const handleLogout = async () => {
    logoutApi(authToken)
    handleLoginPageUrl('login-page')
    console.log('User logged out due to inactivity.');
  };

  // useEffect(() => {
  //   const inactivityTimeout = 60 * 60 * 1000; 
  //   // const inactivityTimeout = 6000; 

  //   let timer;
  //   const resetTimer = () => {
  //     clearTimeout(timer);
  //     startTimer();
  //   };

  //   const startTimer = () => {
  //     timer = setTimeout(() => {
  //       handleLogout();
  //     }, inactivityTimeout);
  //   };

  //   const handleUserActivity = () => {
  //     resetTimer();
  //   };

  //   // Attach event listeners for user activity
  //   document.addEventListener('mousemove', handleUserActivity);
  //   document.addEventListener('keypress', handleUserActivity);
  //   document.addEventListener('click', handleUserActivity);

  //   // Start the initial timer
  //   startTimer();

  //   // Clean up event listeners on component unmount
  //   return () => {
  //     document.removeEventListener('mousemove', handleUserActivity);
  //     document.removeEventListener('keypress', handleUserActivity);
  //     document.removeEventListener('click', handleUserActivity);
  //     clearTimeout(timer);
  //   };
  // }, [authToken]);
  


  return (
    <>
    {isLoading ? <Error message={loadingErrMsg}/> : 
     <div className='bg-slate-100'>
     
      <section>

           <Navbar setSidebarOpen={setSidebarOpen}   tenantId={tenantId} empId={empId}  />
       
      </section>
      <section>
      <div className='flex flex-row'>
     
      
      <div 
     className={`fixed inset-0 z-10 md:static w-fit bg-indigo-50 min-h-screen shadow-lg shadow-black/50  transform transition-all duration-300 ease-in-out ${
      sidebarOpen ? 'opacity-0 translate-x-[-100%]' : 'opacity-100 translate-x-0'
    }`}>
           <Sidebar setSidebarOpen={setSidebarOpen} fetchData={fetchData}  tenantId={tenantId} empId={empId}  />
      </div>
      
     
      <div className='h-screen overflow-auto scrollbar-hide w-full max-h-fit bg-white'>
        <Routes>
          <Route
            exact
            path="/overview"
            element={<Overview fetchData={fetchData} loadingErrMsg={loadingErrMsg} setLoadingErrMsg={setLoadingErrMsg} isLoading={isLoading} setIsLoading={setIsLoading} setAuthToken={setAuthToken} />}
          />
          <Route
            path="/trip"
            element={<Travel fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading} setIsLoading={setIsLoading} setAuthToken={setAuthToken} />}
          />
          <Route
            path="/cash-advance"
            element={<CashAdvance fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading} setAuthToken={setAuthToken} />}
          />
          <Route
            path="/expense"
            element={<Expense fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading} setAuthToken={setAuthToken} />}
          />
          <Route
            path="/approval"
            element={<Approval fetchData={fetchData}loadingErrMsg={loadingErrMsg} isLoading={isLoading} setAuthToken={setAuthToken} />}
          />
          <Route
            path="/settlement"
            element={<Settlement  fetchData={fetchData}loadingErrMsg={loadingErrMsg} isLoading={isLoading} setAuthToken={setAuthToken} />}
          />
          <Route
            path="/bookings"
            element={<Booking fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading}   setAuthToken={setAuthToken} />}
          />
          <Route
            path="/profile"
            element={<Profile fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading} setAuthToken={setAuthToken}/>}
          />
        </Routes>
        
        </div>
     
        
      </div>
      </section>

       
     
   
    </div>
    }
  </>
  )
}

export default Home
