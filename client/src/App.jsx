import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import axios from 'axios'
import "./App.css";
import CreateTravelRequest from './pages/CreateTravelRequest';
import ModifyTravelRequest from './pages/ModifyTravelRequest';
import Bookings from './pages/Bookings'

function App() {
  

  return <>
    <Router>
      <Routes>
        <Route path='/create/*' element={<CreateTravelRequest />} />
        <Route path='/modify/:travelRequestId/*' element={<ModifyTravelRequest />} />
        <Route path='/bookings/:travelRequestId' element={<Bookings/>} />
      </Routes>
    </Router>
  </>;
}

export default App;