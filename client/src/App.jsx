import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './api/DataProvider';
import { useParams } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Travel from './pages/Travel';
import Navbar from './components/common/Navbar';
import Overview from './pages/Overview';
import CashAdvance from './pages/CashAdvance';
import Approval from './pages/Approval';
import Booking from './pages/Booking';
import { useData } from './api/DataProvider';
import Expense from './pages/Expense';
import Settlement from './pages/Settlement';
import { getEmployeeData_API, getEmployeeRoles_API, logoutApi } from './utils/api';
import { handleLoginPageUrl } from './utils/actionHandler';
import Profile from './pages/Profile';




function App() {
  
  // const [employeeRole,setEmployeeRole]=useData(null)
 const [sidebarOpen,setSidebarOpen]=useState(false)
 const [tenantId, setTenantId]=useState(null);
 const [empId , setEmpId]= useState(null);
  const [authToken , setAuthToken] = useState("authtoken");
  const [isLoading , setIsLoading]=useState(true);
  const [loadingErrMsg, setLoadingErrMsg] = useState(null);
  const {employeeRoles , setEmployeeRoles, setEmployeeData , employeeData } = useData(); 
//  const [,setRouteData]=useState(null);
  
    const fetchData = async (tenantId, empId) => {
      try {
        const rolesResponse = await getEmployeeRoles_API(tenantId,empId)
        const employeeResponse = await getEmployeeData_API(tenantId, empId);
        localStorage.setItem('tenantId', tenantId);
        localStorage.setItem('empId', empId);
        console.log('employee data',rolesResponse)

        setEmployeeData(employeeResponse);
        setEmployeeRoles(rolesResponse)
        setTenantId(tenantId)
        setEmpId(empId)      
        setIsLoading(false)
      } catch (error) {       
        console.error('Error fetching data:', error.message);
        setLoadingErrMsg('Error danger',error.message);
        setIsLoading(false)
      }
    };


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
   

   
  

  console.log('object',employeeData,employeeRoles)



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



  return (<>
    {/* { isLoading && <Error message={loadingErrMsg}/>} */}
    { <div className='bg-slate-100'>
     
        <BrowserRouter>
        <section>
          <div>
             <Navbar setSidebarOpen={setSidebarOpen} employeeInfo={employeeRoles?.employeeInfo}  tenantId={tenantId} empId={empId}  />
          </div>
        </section>
        <section>
        <div className='flex flex-row'>
       
        
        <div 
       className={`fixed inset-0 z-0 md:static bg-indigo-50 min-h-screen w-64 transform transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'opacity-0 translate-x-[-100%]' : 'opacity-100 translate-x-0'
      }`}>
             <Sidebar setSidebarOpen={setSidebarOpen} fetchData={fetchData}  tenantId={tenantId} empId={empId}  />
        </div>
        
       
        <div className='min-h-screen w-full max-h-fit'>
          <Routes>
            <Route
              exact
              path="/:tenantId/:empId/overview"
              element={<Overview fetchData={fetchData} loadingErrMsg={loadingErrMsg} setLoadingErrMsg={setLoadingErrMsg} isLoading={isLoading} setIsLoading={setIsLoading} setAuthToken={setAuthToken} />}
            />
            <Route
              path="/:tenantId/:empId/trip"
              element={<Travel fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading} setIsLoading={setIsLoading} setAuthToken={setAuthToken} />}
            />
            <Route
              path="/:tenantId/:empId/cash-advance"
              element={<CashAdvance fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading} setAuthToken={setAuthToken} />}
            />
            <Route
              path="/:tenantId/:empId/expense"
              element={<Expense fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading} setAuthToken={setAuthToken} />}
            />
            <Route
              path="/:tenantId/:empId/approval"
              element={<Approval fetchData={fetchData}loadingErrMsg={loadingErrMsg} isLoading={isLoading} setAuthToken={setAuthToken} />}
            />
            <Route
              path="/:tenantId/:empId/settlement"
              element={<Settlement fetchData={fetchData}loadingErrMsg={loadingErrMsg} isLoading={isLoading} setAuthToken={setAuthToken} />}
            />
            <Route
              path="/:tenantId/:empId/bookings"
              element={<Booking fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading}   setAuthToken={setAuthToken} />}
            />
            <Route
              path="/:tenantId/:empId/profile"
              element={<Profile fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading} setAuthToken={setAuthToken}/>}
            />
            {/* <Route
              path="/create/:tenantId/:empId"
              element={<TravelMS setAuthToken={setAuthToken} />}
            /> */}
          </Routes>
          
          </div>
       
          
        </div>
        </section>

         
        </BrowserRouter>
     
    </div>}
    </>
  );
}

export default App;



// import React, { useEffect, useState } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { DataProvider } from './api/DataProvider';
// import { useParams } from 'react-router-dom';
// import Sidebar from './components/common/Sidebar';
// import Travel from './pages/Travel';
// import Navbar from './components/common/Navbar';
// import Overview from './pages/Overview';
// import CashAdvance from './pages/CashAdvance';
// import Approval from './pages/Approval';
// import Booking from './pages/Booking';
// import { useData } from './api/DataProvider';
// import Expense from './pages/Expense';
// import Settlement from './pages/Settlement';
// import { getEmployeeData_API, getEmployeeRoles_API, logoutApi } from './utils/api';
// import { handleLoginPageUrl } from './utils/actionHandler';
// import Profile from './pages/Profile';



// function App() {
  
//   // const [employeeRole,setEmployeeRole]=useData(null)

//  const [tenantId, setTenantId]=useState(null);
//  const [empId , setEmpId]= useState(null);
//   const [authToken , setAuthToken] = useState("authtoken");
//   const [isLoading , setIsLoading]=useState(true);
//   const [loadingErrMsg, setLoadingErrMsg] = useState(null);
//   const {employeeRoles , setEmployeeRoles, setEmployeeData , employeeData } = useData(); 
// //  const [,setRouteData]=useState(null);
  
//     const fetchData = async (tenantId, empId) => {
//       try {
//         const rolesResponse = await getEmployeeRoles_API(tenantId,empId)
//         const employeeResponse = await getEmployeeData_API(tenantId, empId);
//         localStorage.setItem('tenantId', tenantId);
//         localStorage.setItem('empId', empId);
//         console.log('employee data',rolesResponse)

//         setEmployeeData(employeeResponse);
//         setEmployeeRoles(rolesResponse)
//         setTenantId(tenantId)
//         setEmpId(empId)      
//         setIsLoading(false)
//       } catch (error) {       
//         console.error('Error fetching data:', error.message);
//         setLoadingErrMsg('Error danger',error.message);
//         setIsLoading(false)
//       }
//     };

   

   
  

//   console.log('object',employeeData,employeeRoles)



//   const handleLogout = async () => {
//     logoutApi(authToken)
//     handleLoginPageUrl('login-page')
//     console.log('User logged out due to inactivity.');
//   };

//   // useEffect(() => {
//   //   const inactivityTimeout = 60 * 60 * 1000; 
//   //   // const inactivityTimeout = 6000; 

//   //   let timer;
//   //   const resetTimer = () => {
//   //     clearTimeout(timer);
//   //     startTimer();
//   //   };

//   //   const startTimer = () => {
//   //     timer = setTimeout(() => {
//   //       handleLogout();
//   //     }, inactivityTimeout);
//   //   };

//   //   const handleUserActivity = () => {
//   //     resetTimer();
//   //   };

//   //   // Attach event listeners for user activity
//   //   document.addEventListener('mousemove', handleUserActivity);
//   //   document.addEventListener('keypress', handleUserActivity);
//   //   document.addEventListener('click', handleUserActivity);

//   //   // Start the initial timer
//   //   startTimer();

//   //   // Clean up event listeners on component unmount
//   //   return () => {
//   //     document.removeEventListener('mousemove', handleUserActivity);
//   //     document.removeEventListener('keypress', handleUserActivity);
//   //     document.removeEventListener('click', handleUserActivity);
//   //     clearTimeout(timer);
//   //   };
//   // }, [authToken]);



//   return (<>
//     {/* { isLoading && <Error message={loadingErrMsg}/>} */}
//     { <div className='bg-slate-100'>
     
//         <BrowserRouter>
//         <section>
//           <div>
//              <Navbar employeeInfo={employeeRoles?.employeeInfo}  tenantId={tenantId} empId={empId}  />
//           </div>
//         </section>
//         <section>
//         <div className='grid grid-cols-12'>
//         <div className='col-span-1   md:col-span-3  xl:col-span-2  bg-indigo-50  min-h-screen  '>
//              <Sidebar fetchData={fetchData}  tenantId={tenantId} empId={empId}  />
//         </div>
//         <div className='col-span-11  md:col-span-9  xl:col-span-10 min-h-screen '>
//         <div className=''>
//           <Routes>
//             <Route
//               exact
//               path="/:tenantId/:empId/overview"
//               element={<Overview fetchData={fetchData} loadingErrMsg={loadingErrMsg} setLoadingErrMsg={setLoadingErrMsg} isLoading={isLoading} setIsLoading={setIsLoading} setAuthToken={setAuthToken} />}
//             />
//             <Route
//               path="/:tenantId/:empId/trip"
//               element={<Travel fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading} setIsLoading={setIsLoading} setAuthToken={setAuthToken} />}
//             />
//             <Route
//               path="/:tenantId/:empId/cash-advance"
//               element={<CashAdvance fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading} setAuthToken={setAuthToken} />}
//             />
//             <Route
//               path="/:tenantId/:empId/expense"
//               element={<Expense fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading} setAuthToken={setAuthToken} />}
//             />
//             <Route
//               path="/:tenantId/:empId/approval"
//               element={<Approval fetchData={fetchData}loadingErrMsg={loadingErrMsg} isLoading={isLoading} setAuthToken={setAuthToken} />}
//             />
//             <Route
//               path="/:tenantId/:empId/settlement"
//               element={<Settlement fetchData={fetchData}loadingErrMsg={loadingErrMsg} isLoading={isLoading} setAuthToken={setAuthToken} />}
//             />
//             <Route
//               path="/:tenantId/:empId/bookings"
//               element={<Booking fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading}   setAuthToken={setAuthToken} />}
//             />
//             <Route
//               path="/:tenantId/:empId/profile"
//               element={<Profile fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading} setAuthToken={setAuthToken}/>}
//             />
//             {/* <Route
//               path="/create/:tenantId/:empId"
//               element={<TravelMS setAuthToken={setAuthToken} />}
//             /> */}
//           </Routes>
          
//           </div>
//         </div>
       
          
//         </div>
//         </section>

         
//         </BrowserRouter>
     
//     </div>}
//     </>
//   );
// }

// export default App;

