import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/common/Navbar'
import { useState } from 'react'

function App() {
const [tenantId, setTenantId] = useState(null);
const [empId, setEmpId]=useState(null)
const [isLoading, setIsLoading] = useState(true);
const [loadingErrMsg, setLoadingErrMsg] = useState(null)
useData()

  const fetchData = async(tenantId, empId) => {
   try{

   } catch(error){
    console.error('Error Occurred while fetching data', error)
   }
  }

  return (
   <>
   <div className='bg-slate-100'>
   <BrowserRouter>
   <section>
          <div>
             <Navbar employeeInfo={employeeRoles?.employeeInfo}  tenantId={tenantId} empId={empId}  />
          </div>
        </section>
        <section>
        <div className='grid grid-cols-12'>
        <div className='col-span-1   md:col-span-3  xl:col-span-2  bg-indigo-50  min-h-screen  '>
             {/* <Sidebar fetchData={fetchData}  tenantId={tenantId} empId={empId}  /> */}
        </div>
        <div className='col-span-11  md:col-span-9  xl:col-span-10 min-h-screen '>
          <div>
            <Routes>
              <Route 
              path="/:tenantId/:empId/finance" 
              element={<Finance />} 
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




