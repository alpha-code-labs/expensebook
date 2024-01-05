import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import CompanyInfo from "./CompanyInfo";
import TravelAllocations from "./expenseAllocations/TravelAllocations";
import TravelRelatedExpenses from "./expenseAllocations/TravelRelatedExpenses";
import TravelCategoriesExpenseAllocation from "./expenseAllocations/TravelCategoriesExpenseAllocation";
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



export default function ({page, tenantId, employeeId}) {
  //flags
  const [flags, setFlags] = useState({})  

  switch(page){
    case 'company-info': return (<CompanyInfo tenantId={tenantId} />)
    case 'travel-allocations': return(<TravelAllocations tenantId={tenantId} />)
    case 'travel-expense-allocations': return(<TravelRelatedExpenses tenantId={tenantId} />)
    case 'travel-categories-expense-allocations': return(<TravelCategoriesExpenseAllocation tenantId={tenantId} />)
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
