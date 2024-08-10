import { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Finance from './pages/Finance';


function App() {
  
  return (
    <div className='min-w-[100%] min-h-[100%]'>
     <BrowserRouter>
        <Routes>
          <Route path='/:tenantId/:empId/settlement' element={<Finance />} /> 
        </Routes>
     </BrowserRouter>
    </div>
  )
}

export default App
