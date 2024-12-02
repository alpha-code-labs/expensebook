import React, { useState,useEffect } from 'react';
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
import Configure from './Configure';
import Error from '../components/common/Error';
import { getEmployeeData_API, getEmployeeRoles_API, logoutApi } from '../utils/api';
import { useData } from '../api/DataProvider';
import { handleLoginPageUrl } from '../utils/actionHandler';
import Report from './Report';
import PopupMessage from '../components/common/PopupMessage';
import Button1 from '../components/common/Button1';
import PopupModal from '../components/common/PopupModal';

const Home = () => {


const {tenantId,empId}= useParams()
const [sidebarOpen,setSidebarOpen]=useState(false);
const {microserviceModal,setMicroserviceModal,isOnline, employeeRoles, setEmployeeRoles, setEmployeeData, setRequiredData, employeeData,popupMsgData,initialPopupData,setPopupMsgData } = useData();

useEffect(()=>{
  if (!isOnline) {
    setPopupMsgData(prev => ({...prev, showPopup:true, message, iconCode:"102"}))
    
  }
  else
  {
    setPopupMsgData(initialPopupData);
  }

},[isOnline])

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
const [isLoading, setIsLoading] = useState({ loginData: false, roleData: true });
const [loadingErrMsg, setLoadingErrMsg] = useState(null);

const [searchQuery , setSearchQuery] = useState('');

const fetchData = async () => {

  try {
    // Conditionally fetch employee roles only if employeeRoles is null
    setLoadingErrMsg(null)
    let rolesResponse = employeeRoles;
    if (rolesResponse === null) {
      setIsLoading(prev => ({ ...prev, loginData: true })); // Start loading for role data
      rolesResponse = await getEmployeeRoles_API(tenantId, empId);
      setEmployeeRoles(rolesResponse);
      setIsLoading(prev => ({ ...prev, loginData: false })); // Stop loading for role data
    }
    setIsLoading(prev => ({ ...prev, roleData: true })); // Start loading for login data
    const employeeResponse = await getEmployeeData_API(tenantId, empId);
    setEmployeeData(employeeResponse);
    setRequiredData({"formValidations": employeeResponse?.dashboardViews?.employee?.formValidations,
                     "notifications": employeeResponse?.notifications ?? {}             
    });

    setIsLoading(prev => ({ ...prev, roleData: false })); // Stop loading for login data
  } catch (error) {
    console.error('Error fetching data:', error.message);
    if(isOnline){
      setPopupMsgData({showPopup: true , message: error?.message , iconCode: "102"})
    }
    
    //setLoadingErrMsg(error?.message);
    // Stop both loadings in case of error
    //setIsLoading({ loginData: false, roleData: false });
  }
};



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
    {isLoading.loginData ? <Error message={loadingErrMsg}/> : 

     <div className='bg-slate-100'>
      <section>
      <div className='flex flex-row'>
      <div 
      className={`fixed inset-0 z-10 md:static w-fit bg-indigo-50 min-h-screen   transform transition-all duration-300 ease-in-out ${
      sidebarOpen ? 'opacity-0 translate-x-[-100%]' : 'opacity-100 translate-x-0'
    }`}>
           <Sidebar setSidebarOpen={setSidebarOpen} fetchData={fetchData}  tenantId={tenantId} empId={empId}  />
      </div>
      <div className='h-screen overflow-y-auto scrollbar-hide w-full  bg-white'>
      <section>

      <Navbar setSearchQuery={setSearchQuery} setSidebarOpen={setSidebarOpen} notificationData={employeeData?.notifications|| []}  tenantId={tenantId} empId={empId}  />

</section>
        <Routes>
          <Route
            exact
            path="/overview"
            element={<Overview fetchData={fetchData} loadingErrMsg={loadingErrMsg}  isLoading={isLoading?.roleData} setIsLoading={setIsLoading} setAuthToken={setAuthToken} />}
          />
          <Route
            path="/trip"
            element={<Travel searchQuery={searchQuery} setSearchQuery={setSearchQuery} fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading?.roleData} setIsLoading={setIsLoading} setAuthToken={setAuthToken} />}
          />
          <Route
            path="/cash-advance"
            element={<CashAdvance searchQuery={searchQuery} setSearchQuery={setSearchQuery} fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading?.roleData} setAuthToken={setAuthToken} />}
          />
          <Route
            path="/expense"
            element={<Expense searchQuery={searchQuery} setSearchQuery={setSearchQuery} fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading?.roleData} setAuthToken={setAuthToken} />}
          />
          <Route
            path="/report"
            element={<Report  fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading?.roleData} setAuthToken={setAuthToken} />}
          />
          <Route
            path="/approval"
            element={<Approval searchQuery={searchQuery} setSearchQuery={setSearchQuery} fetchData={fetchData}loadingErrMsg={loadingErrMsg} isLoading={isLoading?.roleData} setAuthToken={setAuthToken} />}
          />
          <Route
            path="/settlement"
            element={<Settlement  fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading?.roleData} setAuthToken={setAuthToken} />}
          />
          <Route
            path="/bookings"
            element={<Booking searchQuery={searchQuery} setSearchQuery={setSearchQuery} fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading?.roleData}   setAuthToken={setAuthToken} />}
          />
          <Route
            path="/profile"
            element={<Profile fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading?.roleData} setAuthToken={setAuthToken}/>}
          />
          <Route
            path="/configure"
            element={<Configure fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading?.roleData} setAuthToken={setAuthToken}/>}
          />
        </Routes>  
        </div>
      </div>
      </section>
      <PopupMessage iconCode={popupMsgData.iconCode} showPopup={popupMsgData.showPopup} setShowPopup={setPopupMsgData} message={popupMsgData.message} initialPopupData={initialPopupData}/>
      <PopupModal  showModal={microserviceModal?.showPopup} >
            <div className="px-6 py-4">
                <p className="font-cabin text-zinc-500 text-xl">Review Scanned Details</p>
                <div className="mt-6 mb-6 text-normal text-neutral-800 font-cabin">
                    <p>We’ve scanned the bill and extracted its details. Please review the following information carefully before submission:</p>
                    <p className="mt-4">Verify that all the extracted values are accurate.</p>
                    <p>Enter any missing values or correct errors if necessary.</p>
                    <p className="mt-4">This step ensures that the information submitted is accurate. Once you’re satisfied with the details, click Submit to proceed.</p>
    
                </div>
                <Button1 text='OK' onClick={()=>setMicroserviceModal(false)}/>
            </div>
    </PopupModal>
    </div>
    }
  </>
  )
}

export default Home
