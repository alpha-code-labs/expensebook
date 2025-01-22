import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LineItemForm from '../travelExpenseSubcomponent/AddLineItem';
import CreateExpense from './CreateExpense';
import ClearRejectedExpense from './ClearRejectedExpense';

const TravelExpense = () => {
  return (
    
      <Routes>

        <Route path='new/:expenseHeaderId/line-item' element={<LineItemForm />} />
        <Route path='view/travel-expense' element={<CreateExpense />} />
        <Route path='view/:expenseHeaderId/travel-expense' element={<CreateExpense />} />
        <Route path='rejected/:expenseHeaderId' element={<ClearRejectedExpense/>} />
        
      </Routes>
    
  );
}

export default TravelExpense;

