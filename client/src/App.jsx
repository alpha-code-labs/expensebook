import { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SignUp from './pages/SignUp';
import VerifyUser from './pages/VerifyUser';
import Login from './pages/Login';
import UpdatePassword from './pages/UpdatePassword';

function App() {
  
 

  return (
    <div className='min-w-[100%] min-h-[100%]'>
     <BrowserRouter>
        <Routes>
          <Route path='/sign-up' element={<SignUp />} /> 
          <Route path='/verify-user/:tenantId' element={<VerifyUser  />} /> 
          <Route path='/sign-in' element={<Login/>}/>
          <Route path='/update-password' element={<UpdatePassword/>} />
        </Routes>
     </BrowserRouter>
    </div>
  )
}

export default App
