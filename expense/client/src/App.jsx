import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TravelExpense from './pages/TravelExpense';
import NonTravelExpense from './pages/NonTravelExpense';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main route for TravelExpense */}
        <Route path='/:tenantId/:empId/non-travel-expense/*' element={<NonTravelExpense />} />
        <Route path='/:tenantId/:empId/:tripId/*' element={<TravelExpense />} />
        {/* Main route for NonTravelExpense */}
      </Routes>
    </Router>
  );
}

export default App;



