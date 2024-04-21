import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom'
import TravelHome from "./expenseSetup/travel/index"
import Reimbursements from "./expenseSetup/reimbursements/index"
import Index from "./expenseSetup/index"

import International from "./expenseSetup/travel/international"
import Domestic from "./expenseSetup/travel/domestic"
import Local from "./expenseSetup/travel/local"

import Level1 from './expenseSetup/travel/level1'
import Level2 from './expenseSetup/travel/Level2'
import Level3 from './expenseSetup/travel/Level3'

import Layout from './Layout'



export default function ({progress, setProgress}){
  
    const {tenantId} = useParams() 

  return <>
     {tenantId &&
  
        <Routes>
          <Route path={`/`} element={<Index progress={progress} setProgress={setProgress} />} />
          <Route path="/travel" element={<TravelHome progress={progress} setProgress={setProgress} />} />
          <Route path="/travel/level2" element={<Level2 progress={progress} setProgress={setProgress} />} />
          <Route path="/travel/level1" element={<Level1 progress={progress} setProgress={setProgress} />} />
          <Route path="/travel/level3" element={<Level3 progress={progress} setProgress={setProgress} />} />

          <Route path="/travel/level3/international" element={<International progress={progress} setProgress={setProgress} />} />
          <Route path="/travel/level3/domestic" element={<Domestic progress={progress} setProgress={setProgress} />} />
          <Route path="/travel/level3/local" element={<Local progress={progress} setProgress={setProgress} />} />

          <Route path="/reimbursements" element={<Reimbursements progress={progress} setProgress={setProgress} />} />
        </Routes>
      }
  </>;
}
