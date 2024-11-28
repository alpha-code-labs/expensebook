import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import React from 'react';
import axios from 'axios'
import "./App.css";
import Playgroung from './pages/Playground';

// import ModifyTravelRequest from './pages/ModifyTravelRequest';
// import Bookings from './pages/Bookings'
// import CashAdvance from './pages/CreateCashAdvance'
// import ModifyCashAdvance from './pages/modifyCashAdvance'
// import CancelCashAdvance from './pages/CancelCashAdvance';
// import ClearRejectedCashAdvance from './pages/ClearRejectedCashAdvance';
// import ClearRejectedTravelRequest from './pages/ClearRejectedTravelRequest';
// import CancelTravelRequest from './pages/CancelTravelRequest';

const ModifyTravelRequest = React.lazy(()=> import('./pages/ModifyTravelRequest'))
const Bookings = React.lazy(()=> import('./pages/Bookings'))
const CashAdvance = React.lazy(()=> import('./pages/CreateCashAdvance'))
const ModifyCashAdvance = React.lazy(()=> import('./pages/modifyCashAdvance'))
const CancelCashAdvance = React.lazy(()=> import('./pages/CancelCashAdvance'))
const ClearRejectedCashAdvance = React.lazy(()=> import('./pages/ClearRejectedCashAdvance'))
const ClearRejectedTravelRequest = React.lazy(()=> import('./pages/ClearRejectedTravelRequest'))
const CancelTravelRequest = React.lazy(()=> import('./pages/CancelTravelRequest'))



function App() {
  

  return <>
    <Router>
      <Routes>
        <Route path='/create/advance/:travelRequestId' element={<CashAdvance />} />
        <Route path='/modify/travel/:travelRequestId/*' element={<ModifyTravelRequest />} />
        <Route path='/cancel/travel/:travelRequestId' element={<CancelTravelRequest/>} />
        <Route path='/bookings/travel/:travelRequestId/*' element={<Bookings />} />
        <Route path='/rejected/travel/:travelRequestId' element={<ClearRejectedTravelRequest/>}/>
        <Route path='/modify/advance/:travelRequestId/:cashAdvanceId' element={<ModifyCashAdvance />} />
        <Route path='/cancel/advance/:travelRequestId/:cashAdvanceId' element={<CancelCashAdvance/>} />
        <Route path='/rejected/advance/:travelRequestId/:cashAdvanceId' element={<ClearRejectedCashAdvance/>} />
        <Route path='/playground' element={<Playgroung />} />
      </Routes>
    </Router>
  </>;
}

export default App;