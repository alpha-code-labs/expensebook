import { useState } from 'react'
import './App.css'
import { BrowserRouter,Route,Routes,useParams } from 'react-router-dom';
import ViewTrip from './components/ViewTrip';
import CashAdvance from './pages/CashApproval';
import TravelRequestDetails from './components/TravelRequest/TravelRequestDetails';
import TravelApproval from './pages/TravelApproval';
import NonTravelExpenseApproval from './pages/NonTravelExpenses';
import TravelExpenseApproval from './pages/TravelExpenseApproval';
import NonTravelExpenseDetails from './components/NonTravelExpense/NonTravelExpenseDetails/NonTravelExpenseDetails';
import TravelExpenseDetails from './components/TravelExpense/TravelExpenseDetails/TravelExpenseDetails';
import TestingTravelRequestWithCash from './components/TravelRequest/trwithcash';



function App() {

  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<TravelApproval />}/>
        <Route path='/td/:travelRequestId' element={<TravelRequestDetails />} />
        <Route path='/view' element={<ViewTrip/>}/>
        <Route path='/dashCash' element={<CashAdvance />}/>
        <Route path='/travelExpenseApproval' element={<TravelExpenseApproval />}/>
        <Route path='/nonTravelExpenseApproval' element={<NonTravelExpenseApproval />}/>
        <Route path='/travelExpense/:ExpenseHeaderType/:ExpenseHeaderID/:EmpId' element={<TravelExpenseDetails />}/>
        <Route path='/expense/nonTravel/:ExpenseHeaderID/:BillNumber' element={<NonTravelExpenseDetails />}/>
        <Route path='/testing' element={<TestingTravelRequestWithCash/>}/>
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
