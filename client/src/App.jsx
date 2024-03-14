import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import axios from 'axios'
import "./App.css";
import Groups from "./pages/Groups";
import CompanyPolicies from "./pages/CompanyPolicies";
import CompanyAndHRInformation from "./pages/CompanyAndHRInformation";
import AllocateExpenses from "./pages/AllocateExpenses";
import UploadFile from "./components/common/UploadFile";
import OtherData from "./pages/OtherData";
import OnboardingHome from "./pages/OnboardingHome"
import NonTravelExpensePoliciesHome from "./pages/NonTravelExpensePoliciesHome";
import NonTravelExpensePolicies from "./pages/NonTravelExpensePolicies";
import UploadHRInformation from "./pages/UploadHRInformation";
import Playground from './pages/Playground'
import OnboardingCompleted from "./pages/OnboardingCompleted";
import SetupExpenseBook from "./pages/SetupExpenseBook.jsx"
import Progress from "./components/common/Progress.jsx";
import Icon from "./components/common/Icon.jsx";

function App() {
  //flags
  const [flags, setFlags] = useState({})  

  return <>
    <Router>
      <Routes>
      <Route path='/:tenantId/welcome'
            element={<OnboardingHome/>} />
        <Route path='/:tenantId/company-info'
            element={<CompanyAndHRInformation/>} />
        <Route path='/:tenantId/upload-hr-data'
            element={<UploadHRInformation/>} />

        <Route path='/:tenantId/setup-expensebook/*'
          element={<SetupExpenseBook />} />

        {/* <Route path='/:tenantId/expense-allocations/*' element={<AllocateExpenses />}/> */}
        <Route path={`/:tenantId/groups/*`} 
            element={<Groups/>} />
        <Route path="/:tenantId/setup-company-policies/*" 
            element={<CompanyPolicies
                flags={flags}
                />} />
        <Route path="/:tenantId/non-travel-policies/" 
            element={<NonTravelExpensePoliciesHome
                flags={flags}
                />} />
        <Route path="/:tenantId/non-travel-policies/setup" 
            element={<NonTravelExpensePolicies
                flags={flags}
                />} />
        <Route path='/:tenantId/others/*' element={<OtherData/>}/>
        <Route path='/:tenantId/onboarding-completed/' element={<OnboardingCompleted />}/>
        <Route path='/playground/:tenantId' element={<Playground/>} />
        
      </Routes>
    </Router>

    {/* <Progress/> */}
  </>;
}

export default App;