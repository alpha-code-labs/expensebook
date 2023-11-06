import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import axios from 'axios'
import "./App.css";
import Groups from "./pages/Groups";
import CompanyPolicies from "./pages/CompanyPolicies";
import CompanyAndHRInformation from "./pages/CompanyAndHRInformation";
import AllocateExpenses from "./pages/AllocateExpenses";
import UploadFile from "./components/common/UploadFile";

function App() {
  //flags
  const [flags, setFlags] = useState({})  

  return <>
    <Router>
      <Routes>
        <Route path='/company-info'
            element={<CompanyAndHRInformation/>} />
        <Route path='/:tenantId/expense-allocations/*' element={<AllocateExpenses />}/>
        <Route path={`/:tenantId/groups/*`} 
            element={<Groups/>} />
        <Route path="/:tenantId/setup-company-policies/*" 
            element={<CompanyPolicies
                flags={flags}
                />} />
        <Route path='/playground' element={<UploadFile/>} />
        
      </Routes>
    </Router>
  </>;
}

export default App;