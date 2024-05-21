import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom'
import TravelHome from "./expenseSetup/travel/index"
import Reimbursements from "./expenseSetup/reimbursements/index"
import Index from "./expenseSetup/Index"

import Level1 from './expenseSetup/travel/Level1'
import Level2 from './expenseSetup/travel/Level2'
import Level3 from './expenseSetup/travel/Level3'

import { useEffect } from 'react'

export default function ({progress, setProgress}){
  
    const {tenantId} = useParams() 

    useEffect(()=>{
      if(progress!= undefined && progress?.activeSection != 'section 3'){
        setProgress(pre=>({...pre, activeSection:'section 3'}))
      }
    },[progress])

  return <>
     {tenantId &&
  
        <Routes>
          <Route path={`/`} element={<Index progress={progress} setProgress={setProgress} />} />
          <Route path="/travel" element={<TravelHome progress={progress} setProgress={setProgress} />} />
          <Route path="/travel/level2" element={<Level2 progress={progress} setProgress={setProgress} />} />
          <Route path="/travel/level1" element={<Level1 progress={progress} setProgress={setProgress} />} />
          <Route path="/travel/level3/*" element={<Level3 progress={progress} setProgress={setProgress} />} />
          <Route path="/reimbursements" element={<Reimbursements progress={progress} setProgress={setProgress} />} />
        </Routes>
      }
  </>;
}
