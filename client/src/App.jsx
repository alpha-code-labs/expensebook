import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import CreateTravelRequest from './pages/CreateTravelRequest';
import ModifyTravelRequest from './pages/ModifyTravelRequest';
import CancelTravelRequest from './pages/CancelTravelRequest'
import ClearRejectedTravelRequest from './pages/ClearRejectedTravelRequest';
import Bookings from './pages/Bookings'
import React from 'react';


function App() {
  return <>
    <Router>
      <Routes>
        <Route path='/create/:tenantId/:employeeId/*' element={<CreateTravelRequest />} />
        <Route path='/modify/:travelRequestId/*' element={<ModifyTravelRequest />} />
        <Route path='/bookings/:travelRequestId' element={<Bookings/>} />
        <Route path='/cancel/:travelRequestId' element={<CancelTravelRequest/>} />
        <Route path='/rejected/:travelRequestId' element={<ClearRejectedTravelRequest />} />
        {/* <Route path='/playground' element={<LatestItinerary />} /> */}
      </Routes>
    </Router>
  </>;
}

export default App;