import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CaptureExpense from './Components/CaptureExpense';
import ExpenseForm from './pages/ExpenseForm';
import AddExpense from './Components/AddExpense';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AddExpense />} />
        <Route path="/testing" element={<ExpenseForm />} />
        <Route path="/capture_travel_expense" element={<CaptureExpense />} />
        <Route path="/travel_expense_form" element={<ExpenseForm />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
