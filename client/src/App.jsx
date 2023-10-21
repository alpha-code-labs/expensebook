import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import axios from 'axios'
import "./App.css";
import Groups from "./pages/Gropus";
import CreatedGroups from "./pages/CreatedGroups";
import employeeData from './data/Employee_Data.json'
import CompanyPolicies from "./pages/CompanyPolicies";

function App() {
  //flags
  const [flags, setFlags] = useState({})  
  const [groupData, setGroupData] = useState([])
  const [groupHeaders, setGroupHeaders] = useState(['department', 'designation', 'grade', 'years'])



  return <>
    <Router>
      <Routes>
        <Route path='/setup-group' 
            element={<Groups 
                flags={flags} 
                groupData={groupData} 
                groupHeaders={groupHeaders}
                employeeData={employeeData}
                setGroupData={setGroupData} />} />
        <Route path="/created-groups" 
            element={<CreatedGroups 
                groupData={groupData}
                groupHeaders={groupHeaders} 
                setGroupData={setGroupData} />} />
        <Route path="/setup-company-policies/*" 
            element={<CompanyPolicies
                flags={flags}
                />} />
      </Routes>
    </Router>
  </>;
}

export default App;