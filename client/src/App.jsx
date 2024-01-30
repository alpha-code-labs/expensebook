import './App.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom';

import SettlingCashAdvance from './pages/SettlingCashAdvance';
import RecoveringPaidandCanceledCashAdvance from './pages/RecoveringPaidandCanceledCashAdvance';
import SettlingNonTravelExpense from './pages/SettlingNonTravelExpense';
import SettlingTravelExpense from './pages/SettlingTravelExpense';
import SettlingAccountingEntriesforAllExpenses from './pages/SettlingAccountingEntriesforAllExpenses';
import OtherFinanceRequirements from './pages/OtherFinanceRequirements';



function App() {

  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SettlingCashAdvance />}/>
        <Route path='/settlingCashAdvance'element={<SettlingCashAdvance />}/>
        <Route path='/settlingCashAdvance/:tenantId/:travelRequest' element={<SettlingCashAdvance />}/>
        <Route path='/settlingTravelExpense' element={<SettlingTravelExpense />}/>
        <Route path='/settlingNonTravelExpense' element={<SettlingNonTravelExpense />}/>
        <Route path='/recoveringPaidandCanceledCashAdvance' element={<RecoveringPaidandCanceledCashAdvance />}/>
        <Route path='/settlingAccountingEntriesforAllExpenses' element={<SettlingAccountingEntriesforAllExpenses />}/>
        <Route path='/otherFinanceRequirements' element={<OtherFinanceRequirements />}/>
        
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
