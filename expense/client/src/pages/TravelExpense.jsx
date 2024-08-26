import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LineItemForm from '../travelExpenseSubcomponent/AddLineItem';
import CreateExpense from './CreateExpense';

const TravelExpense = () => {
  return (
    
      <Routes>
        {/* Nested route for adding a new line item */}
        <Route path='new/line-item' element={<LineItemForm />} />
        {/* Nested route for viewing and creating a travel expense */}
        <Route path='view/travel-expense' element={<CreateExpense />} />
      </Routes>
    
  );
}

export default TravelExpense;

