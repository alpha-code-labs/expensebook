import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreateNonTraveExpense from './CreateNonTraveExpense';

const NonTravelExpense = () => {
    
    return(
  <Routes>
    {/* Route for creating a new non-travel expense */}
    <Route path=':expenseHeaderId/view' element={<CreateNonTraveExpense />} />
    {/* Route for viewing a specific non-travel expense */}
    <Route path='new' element={<CreateNonTraveExpense />} />
  </Routes>
)};

export default NonTravelExpense;

