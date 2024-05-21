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


export default function ({progress, setProgress}){
  
  const {state} = useLocation();
  console.log(state, '...state')
  const {tenantId} = useParams() 
  console.log(tenantId)


  const [groupData, setGroupData] = useState([])

  useEffect(()=>{
    if(progress != undefined && progress.activeSection != 'section 6'){
      setProgress(pre=>({...pre, activeSection: 'section 6'}))
    }
  },[progress])

  return <>

     {tenantId &&
      <Routes>
        <Route path={'/'} element={<Home progress={progress} setProgress={setProgress} />} />
        <Route path={`/account-lines`} element={<AccountLines progress={progress} setProgress={setProgress} />} />
        <Route path='/multicurrency' element={<MultiCurrency progress={progress} setProgress={setProgress} />} />
        <Route path="/roles" element={<Roles progress={progress} setProgress={setProgress} />} />
        <Route path="/cash-advance-settlement-options" element={<CashSettlementOptions progress={progress} setProgress={setProgress} />} />
        <Route path="/cash-expense-settlement-options" element={<CashExpenseOptions progress={progress} setProgress={setProgress} />} />
        <Route path="/blanket-delegations" element={<BlanketDelegation progress={progress} setProgress={setProgress} />} />
      </Routes>}
  </>;
}
