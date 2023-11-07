import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import axios from 'axios'
import "./App.css";
import CreateTravelRequest from './pages/CreateTravelRequest';
import ModifyTravelRequest from './pages/ModifyTravelRequest';

function App() {
  

  return <>
    <Router>
      <Routes>
        <Route path='/create/*' element={<CreateTravelRequest />} />
        <Route path='/modify/:travelRequestId/*' element={<ModifyTravelRequest />} />
      </Routes>
    </Router>
  </>;
}

export default App;