import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'
import CancelTrip from './pages/CancelTrip'
import TripRecovery from './pages/TravelRecovery'
import Page from './pages/Page'



function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path='/api/:tenandId/:empId/trips/:tripId' element={<CancelTrip />} />
        <Route path='/hello' element={<Page />} />
        <Route path='/api/:tenandId/:travelAdmin/trips/cancel/:tripId' element={<TripRecovery/>} />
      </Routes>
    </Router>
    </>
  )
}

export default App
