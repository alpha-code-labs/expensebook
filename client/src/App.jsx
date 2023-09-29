import { useState } from 'react'
import './App.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import ViewTrip from './components/ViewTrip';
import EditCash from './pages/EditCash';
import EditTravelRequest from './pages/EditTravelRequest';
import UpcomingTrips from './pages/UpcomingTrips';
import ModifyTripSubmitted  from './components/ModifyTripSubmitted';


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ViewTrip />}/>
        <Route path='/modifyTripSubmitted' element={<ModifyTripSubmitted />}/>
        <Route path='/upcomingTrips' element={<UpcomingTrips />}/>
        <Route path='/editCash' element={<EditCash />}/>
        <Route path='/editTravelRequest' element={<EditTravelRequest />}/>
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
