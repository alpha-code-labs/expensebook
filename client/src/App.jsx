  import { useState, useEffect, createContext } from "react";
  import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom'
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
  import Layout from "./pages/Layout.jsx";
  import { getProgress_API } from "./utils/api.js";

  function App() {
    //flags
    const {tenantId} = useParams();
    console.log(useParams())
    console.log(tenantId, 'tenantId...')

    const [flags, setFlags] = useState({})  

    const [progress, setProgress] = useState(undefined);



    return <>
      <Router>
        <Layout progress={progress} setProgress={setProgress}>
          <Routes>
          <Route path='/:tenantId/welcome'
                element={<OnboardingHome progress={progress} setProgress={setProgress} />} />
            <Route path='/:tenantId/company-info'
                element={<CompanyAndHRInformation progress={progress} setProgress={setProgress}/>} />
            <Route path='/:tenantId/upload-hr-data'
                element={<UploadHRInformation progress={progress} setProgress={setProgress}/>} />

            <Route path='/:tenantId/setup-expensebook/*'
              element={<SetupExpenseBook progress={progress} setProgress={setProgress} />} />

            {/* <Route path='/:tenantId/expense-allocations/*' element={<AllocateExpenses />}/> */}
            <Route path={`/:tenantId/groups/*`} 
                element={<Groups progress={progress} setProgress={setProgress}/>} />
            <Route path="/:tenantId/setup-company-policies/*" 
                element={<CompanyPolicies progress={progress} setProgress={setProgress}
                    flags={flags}
                    />} />
            <Route path="/:tenantId/non-travel-policies/" 
                element={<NonTravelExpensePoliciesHome progress={progress} setProgress={setProgress}
                    flags={flags}
                    />} />
            <Route path="/:tenantId/non-travel-policies/setup" 
                element={<NonTravelExpensePolicies progress={progress} setProgress={setProgress}
                    flags={flags}
                    />} />
            <Route path='/:tenantId/others/*' element={<OtherData progress={progress} setProgress={setProgress} />}/>
            <Route path='/:tenantId/onboarding-completed/' element={<OnboardingCompleted progress={progress} setProgress={setProgress} />}/>
            <Route path='/playground/*' element={<Playground/>} />
            
          </Routes>
        </Layout>
      </Router>
    </>;
  }

  export default App;