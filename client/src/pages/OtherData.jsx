import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import axios from 'axios'
import { useLocation, useParams } from "react-router-dom";
import Home from "./others/Home"
import AccountLines from "./others/AccountLines";
import MultiCurrency from "./others/MultiCurrency";
import Roles from "./others/Roles";
import CashExpenseOptions from "./others/CashExpenseOptions";
import CashSettlementOptions from "./others/CashSettlementOptions";
import BlanketDelegation from "./others/BlanketDelegation";


export default function (props){
  
  const {state} = useLocation();
  console.log(state, '...state')
  const {tenantId} = useParams() 
  console.log(tenantId)


  const [groupData, setGroupData] = useState([])

  return <>

     {tenantId &&
      <Routes>
        <Route path={'/'} element={<Home />} />
        <Route path={`/account-lines`} element={<AccountLines />} />
        <Route path='/multicurrency' element={<MultiCurrency />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/cash-advance-settlement-options" element={<CashSettlementOptions />} />
        <Route path="/cash-expense-settlement-options" element={<CashExpenseOptions />} />
        <Route path="/blanket-delegations" element={<BlanketDelegation />} />
      </Routes>}
  </>;
}
