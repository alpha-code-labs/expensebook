import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreateNonTraveExpense from './CreateNonTraveExpense';
import NewLineItem from '../nonTravelExpenseSubComponet/NewLineItem';

const NonTravelExpense = () => {
    
    return(
  <Routes>
    {/* Route for creating a new non-travel expense */}
    <Route path=':expenseHeaderId/view' element={<CreateNonTraveExpense />} />
    {/* Route for viewing a specific non-travel expense */}
    <Route path='new' element={<CreateNonTraveExpense />} />
    <Route path='new/:expenseHeaderId' element={<NewLineItem />} />
  </Routes>
)};

export default NonTravelExpense;

