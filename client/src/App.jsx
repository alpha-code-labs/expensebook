import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/common/Navbar'
import { useState } from 'react'
import Settlement from '../src/pages/Settlement';
import Sidebar from './components/common/Sidebar';
import { getEmployeeData_API, getEmployeeRoles_API } from './utils/api';
import { useData } from './api/DataProvider';
import InternalRedirect from './components/redirect/InternalRedirect';
import Toast from './components/common/Toast';

function App() {
const [tenantId, setTenantId] = useState(null);
const [empId, setEmpId]=useState(null)
const [isLoading, setIsLoading] = useState(true);
const [loadingErrMsg, setLoadingErrMsg] = useState(null)
const [authToken , setAuthToken] = useState("authtoken");
const { employeeRoles, setEmployeeRoles, employeeData, setEmployeeData} = useData()

const fetchData = async (tenantId, empId) => {
  try {
    const rolesResponse = await getEmployeeRoles_API(tenantId,empId)
    const employeeResponse = await getEmployeeData_API(tenantId, empId);
    localStorage.setItem('tenantId', tenantId);
    localStorage.setItem('empId', empId);
    console.log('rolesResponse',rolesResponse)
    console.log('employeeResponse',employeeResponse)

    setEmployeeData(employeeResponse);
    setEmployeeRoles(rolesResponse)
    setTenantId(tenantId)
    setEmpId(empId)
    // setRouteData(
    //   {
    //     tenantId:tenantId,
    //     empId:empId
    //   }
    // )
    
    // setIsLoading(false)
   
    setIsLoading(false)
    
    

  } catch (error) {
    
    console.error('Error fetching data:', error.message);
    setLoadingErrMsg('Error danger',error.message);
    setIsLoading(false)
    
  }
};

console.log('finance server',employeeData,employeeRoles)
const handleLogout = async () => {
  logoutApi(authToken)
  handleLoginPageUrl('login-page')
  console.log('User logged out due to inactivity.');
};

  return (
   <>
   <div className='bg-slate-100'>
   <Toast/>
   <BrowserRouter>
   <section>
          <div>
             <Navbar employeeInfo={employeeRoles?.employeeInfo}  tenantId={tenantId} empId={empId}  />
          </div>
        </section>
        <section>
        <div className='grid grid-cols-12'>
        <div className='col-span-1   md:col-span-3  xl:col-span-2  bg-indigo-50  min-h-screen  '>
            <Sidebar fetchData={fetchData}  tenantId={tenantId} empId={empId}  /> 
        </div>
        <div className='col-span-11  md:col-span-9  xl:col-span-10 min-h-screen '>
          <div>
            <Routes>
            <Route
              path="/:tenantId/:empId/overview"
              element={<InternalRedirect addon='overview' loadingErrMsg={loadingErrMsg} isLoading={isLoading} />}
              />
              <Route
                path="/:tenantId/:empId/travel"
                element={<InternalRedirect   addon='travel' loadingErrMsg={loadingErrMsg} isLoading={isLoading} />}
              />
              <Route
                path="/:tenantId/:empId/cash-advance"
                element={<InternalRedirect addon='cash-advance'loadingErrMsg={loadingErrMsg} isLoading={isLoading} />}
              />
              <Route
                path="/:tenantId/:empId/expense"
                element={<InternalRedirect addon='expense' loadingErrMsg={loadingErrMsg} isLoading={isLoading} />}
              />
              <Route
                path="/:tenantId/:empId/approval"
                element={<InternalRedirect addon='approval'loadingErrMsg={loadingErrMsg} isLoading={isLoading} />}
              />
              <Route
                path='/'
                element={<Navigate to='/:tenantId/:empId/settlement'/>}
              />
              <Route 
              path="/:tenantId/:empId/settlement" 
              element={<Settlement fetchData={fetchData} loadingErrMsg={loadingErrMsg} isLoading={isLoading} setAuthToken={setAuthToken}/>} 
              />
              <Route
                path="/:tenantId/:empId/bookings"
                element={<InternalRedirect addon='bookings' loadingErrMsg={loadingErrMsg} isLoading={isLoading} />}
              />
            </Routes>
          </div>
        </div>
        </div>
      </section>
   </BrowserRouter>
   </div>
   </>
  )
}

export default App




