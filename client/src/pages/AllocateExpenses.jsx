import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom'
import axios from 'axios'
import { useLocation} from "react-router-dom";
import ExpenseAllocations from "./expenseAllocations/expenseAllocations";
import TravelAllocations from "./expenseAllocations/TravelAllocations";
import TravelRelatedExpenses from "./expenseAllocations/travelRelatedExpenses";
import NonTravelExpenses from "./expenseAllocations/nonTravelExpenses";


export default function (props){
  
  const {state} = useLocation();
  console.log(state, '...state')
  //flags
  const [flags, setFlags] = useState({ORG_HEADERS_FLAG:true})
  const [orgHeaders, setOrgHeaders] = useState([])
  const {tenantId} = useParams()
  console.log(tenantId)

  useEffect(() => {
    axios.get(`http://localhost:8001/api/tenant/${tenantId}/org-headers`)
    .then(res => {
      console.log(res.data, '...res.data')
      let orgHeadersData = res.data.orgHeaders
      let tmpOrgHeaders = []
      Object.keys(orgHeadersData).forEach(key => {
        if(orgHeadersData[key].length !== 0){
          tmpOrgHeaders.push(key)
        }
      })

      console.log(tmpOrgHeaders, '...tmpOrgHeaders')

      if(tmpOrgHeaders.length === 0){
        setFlags({ORG_HEADERS_FLAG:false})
      }
      else{
        setOrgHeaders(tmpOrgHeaders)
      }
      
    })
    .catch(err => console.log(err))
  },[])

  return <>

      {!flags.ORG_HEADERS_FLAG && <div className="bg-slate-50 px-[104px] py-20">
        no org headers found to allocate expenses</div>}

     {tenantId &&
      <Routes>
        <Route path={`/`} element={<ExpenseAllocations tenantId={tenantId} />} />
        <Route path="/travel" element={<TravelAllocations />} />
        <Route path="/travel-related" element={<TravelRelatedExpenses />} />
        <Route path="/non-travel" element={<NonTravelExpenses />} />
      </Routes>}
  </>;
}
