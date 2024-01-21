import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import axios from 'axios'
import "./App.css";
import CreateTravelRequest from './pages/CreateTravelRequest';
import ModifyTravelRequest from './pages/ModifyTravelRequest';
import CancelTravelRequest from './pages/CancelTravelRequest'
import ClearRejectedTravelRequest from './pages/ClearRejectedTravelRequest';
import Bookings from './pages/Bookings'
import SelectTravelType from './pages/SelectTravelType';
import NewItinerary from './pages/itinerary/NewItinerary';

function App() {
  return <>
    <Router>
      <Routes>
        <Route path='/create/*' element={<CreateTravelRequest />} />
        <Route path='/modify/:travelRequestId/*' element={<ModifyTravelRequest />} />
        <Route path='/bookings/:travelRequestId' element={<Bookings/>} />
        <Route path='/cancel/:travelRequestId' element={<CancelTravelRequest/>} />
        <Route path='/clear-rejected/:travelRequestId' element={<ClearRejectedTravelRequest />} />
        <Route path='/playground' element={<NewItinerary />} />
      </Routes>
    </Router>
  </>;
}

export default App;