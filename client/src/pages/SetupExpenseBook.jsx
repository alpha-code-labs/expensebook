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



export default function (){
  
    const {tenantId} = useParams() 

  return <>
     {tenantId &&
      <Routes>
        <Route path={`/`} element={<Index />} />
        <Route path="/travel" element={<TravelHome />} />
        <Route path="/travel/level2" element={<Level2 />} />
        <Route path="/travel/level1" element={<Level1 />} />
        <Route path="/travel/level3" element={<Level3 />} />

        <Route path="/travel/level3/international" element={<International />} />
        <Route path="/travel/level3/domestic" element={<Domestic />} />
        <Route path="/travel/level3/local" element={<Local />} />

        <Route path="/reimbursements" element={<Reimbursements />} />
      </Routes>
      }
  </>;
}
