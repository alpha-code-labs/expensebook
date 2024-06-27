import { useState, useEffect } from "react";
import CompanyInfo from "./CompanyInfo";
import TravelAllocationLevel from './expenseSetup/travel/Index';
import NonTravelExpensesAndPolicies from "./nonTravel/NonTravelExpensesAndPolicies";
import AccountLines from "./others/AccountLines";
import Multicurrency from "./others/Multicurrency";
import Roles from "./others/Roles";
import CashAdvanceOptions from "./others/CashAdvanceOptions";
import ExpenseSettlementOptions from "./others/ExpenseSettlementOptions";

import PoliciesHome from "./policies/PoliciesHome"
import GroupingLabels from "./groups/GroupingLabels";
import Groups from "./groups/Groups";

import UpdateOrgHeaders from "./UpdateOrgHeaders";
import UpdateEmployeeInfo from "./UpdateEmployeeInfo";
import { getTravelAllocationFlags_API } from "../utils/api";
import Error from "../components/common/Error";

import Level1 from './expenseSetup/travel/Level1';
import Level2 from "./expenseSetup/travel/Level2";
import Level3 from "./expenseSetup/travel/Level3";

import ReimbursementAllocations from "./expenseSetup/reimbursements/ReimbursementAllocationsPage";

export default function ({page, tenantId, employeeId}) {
  //flags
  const [flags, setFlags] = useState({})  
  const [allocationLevel, setAllocationLevel] = useState({})

  useEffect(()=>{
    if(page == 'travel-allocations'){
      //first fetch the travel allocations flags
      (async function(){
        const res = await getTravelAllocationFlags_API({tenantId});
        if(res.err || Object.keys(res.data) == 0 ){
          setAllocationLevel({})
          return;
        }

        const travelAllocationFlags = res.data.travelAllocationFlags;
        setAllocationLevel(travelAllocationFlags)
        console.log(res, 'allocations flag res', travelAllocationFlags);
      })()
    }
  },[page])

  useEffect(()=>{

  })


  switch(page){
    case 'company-info': return (<CompanyInfo tenantId={tenantId} />)
    case 'travel-allocation-level':  return (<TravelAllocationLevel tenantId={tenantId} />)
    case 'travel-allocations': {
      if(allocationLevel.level1) return (<Level1 tenantId={tenantId} />);
      if(allocationLevel.level2) return (<Level2 tenantId={tenantId}/>);
      if(allocationLevel.level3) return (<Level3 tenantId={tenantId}/>);
      return (<Error message={'Sorry something went wrong'}/>)
    };
    case 'reimbursement-allocations' : return(<ReimbursementAllocations tenantId={tenantId} />)
    case 'travel-policies': return(<PoliciesHome tenantId={tenantId} />)
    case 'grouping-labels': return(<GroupingLabels tenantId={tenantId} />)
    case 'groups': return(<Groups tenantId={tenantId} />)
    case 'non-travel-expenses-and-policies': return(<NonTravelExpensesAndPolicies tenantId={tenantId} />)
    case 'account-lines': return(<AccountLines tenantId={tenantId} />)
    case 'multicurrency': return(<Multicurrency tenantId={tenantId} />)
    case 'system-roles': return(<Roles tenantId={tenantId}/>)
    case 'advance-settlement-options': return(<CashAdvanceOptions tenantId={tenantId} />)
    case 'expense-settlement-options': return(<ExpenseSettlementOptions tenantId={tenantId}/>)
    case 'update-org-headers': return(<UpdateOrgHeaders tenantId={tenantId}/>)
    case 'update-hr-master': return(<UpdateEmployeeInfo tenantId={tenantId}/>)
  }
}
