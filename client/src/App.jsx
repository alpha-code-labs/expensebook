import React from 'react';
import Sidebar from '../src/components/sidebar/Sidebar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CompanyInfo from '../src/pages/system_configuration/comp_general_info/CompanyInfo';
import CashAdvanceExpenseSettlement from './pages/system_configuration/comp_general_info/CashAdvanceExpenseSettlement';
import MultiCurrency from './pages/system_configuration/comp_general_info/MultiCurrency';
import CompanyStructure from './pages/system_configuration/comp_general_info/CompanyStructure';

const App = () => {
  
  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Sidebar />}/>
            <Route path="/companyinfo" element={<CompanyInfo />}/>
            <Route path="/cash-advance-expense_settlement" element={<CashAdvanceExpenseSettlement />}/>
            <Route path="/multicurrency" element={<MultiCurrency />}/>
            <Route path="/configure-company-structure" element={<CompanyStructure />}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;




// import { BrowserRouter, Routes, Route} from 'react-router-dom';
// import ConfigureCompanyAccount from './components/routes/ConfigureCompanyAccount';
// import CompanyGeneralInfo from './components/routes/configuration/CompanyGeneralInfo';

// // Import individual Company General Info components
// import CompanyInfo from './components/pages/system_configuration/comp_general_info/CompanyInfo';
// import CashAdvanceSettlement from './components/pages/system_configuration/comp_general_info/CashAdvanceSettlement';
// import CashExpenseSettlement from './components/pages/system_configuration/comp_general_info/CashExpenseSettlement';
// import MultiCurrency from './components/pages/system_configuration/comp_general_info/MultiCurrency';
// import PageNotFound from './components/pages/PageNotFound';
// import Home from './components/pages/Home';


// function App() {
//   return ( 
   
//      <BrowserRouter>
//       <Routes>
//         {/* company account Section */}
//         <Route path='/' element={<Home/>}>

//         <Route path="/configure-company" element={<ConfigureCompanyAccount/>}>
//           {/* company general info Subsection */}
//           <Route path="general-info" element={<CompanyGeneralInfo />}>
//             {/* company general info Routes */}
//             <Route path="companyinfo" element={<CompanyInfo />} />
//             <Route path="cashadvance" element={<CashAdvanceSettlement />} />
//             <Route path="cashexpense" element={<CashExpenseSettlement />} />
//             <Route path="multicurrency" element={<MultiCurrency />} />
//           </Route>
//           </Route>
//           </Route>
          
//         <Route path='*' element={<PageNotFound/>}/>
         
       
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

