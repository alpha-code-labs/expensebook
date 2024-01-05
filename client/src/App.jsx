import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import axios from 'axios'
import "./App.css";
import ModifyTravelRequest from './pages/ModifyTravelRequest';
import Bookings from './pages/Bookings'
import CashAdvance from './pages/CreateCashAdvance'
import ModifyCashAdvance from './pages/modifyCashAdvance'
import CancelCashAdvance from './pages/CancelCashAdvance';
import ClearRejectedCashAdvance from './pages/ClearRejectedCashAdvance';

function App() {
  

  return <>
    <Router>
      <Routes>
        <Route path='/create/advance/:travelRequestId' element={<CashAdvance />} />
        <Route path='/modify/travel/:travelRequestId/*' element={<ModifyTravelRequest />} />
        <Route path='/modify/advance/:travelRequestId/:cashAdvanceId' element={<ModifyCashAdvance />} />
        <Route path='/cancel/advance/:travelRequestId/:cashAdvanceId' element={<CancelCashAdvance/>} />
        <Route path='/rejected/advance/:travelRequestId/:cashAdvanceId' element={<ClearRejectedCashAdvance/>} />
      </Routes>
    </Router>
  </>;
}

export default App;