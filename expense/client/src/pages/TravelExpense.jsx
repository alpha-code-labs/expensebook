import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LineItemForm from '../travelExpenseSubcomponent/AddLineItem';
import CreateExpense from './CreateExpense';
import ClearRejectedExpense from './ClearRejectedExpense';
import DashboardModal from '../dashboardModal/DashboardModal';

const TravelExpense = () => {
  return (
      <Routes>
        <Route path='new/:expenseHeaderId/line-item' element={<LineItemForm />} />
        <Route path='view/travel-expense' element={<CreateExpense />} />
        <Route path='view/:expenseHeaderId/travel-expense' element={<CreateExpense />} />
        <Route path='rejected/:expenseHeaderId' element={<ClearRejectedExpense/>} />
        <Route path='delete/:expenseHeaderId' element={<DashboardModal/>}/>
      </Routes>
  );
}

export default TravelExpense;

