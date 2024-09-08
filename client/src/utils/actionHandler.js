import { urlRedirection } from "./handyFunctions";
import { approvalViewRoutes, expenseRoutes, nonExpenseRoutes, travelRoutes, tripRoutes,cashAdvanceRoutes, loginPageRoutes } from "./route";



export const handleLoginPageUrl = (action)=>{

  let url
  if(action ==='login-page'){
    url = loginPageRoutes.login.getUrl
  }
  urlRedirection(url)
}


///travel and cashadvance handleis in travel component has to update
export const handleTravel = (travelRequestId, isCashAdvanceTaken, action) => {
  let url;

   if(action==='booking-view-tr'){
    if(isCashAdvanceTaken){
      url=cashAdvanceRoutes.booking_tr_with_ca.getUrl(travelRequestId)
    }else{
      url=travelRoutes.booking.booking_tr_standalone.getUrl(travelRequestId)
    }

  }
   else {
    throw new Error('Invalid action');
  }

  urlRedirection(url);
};



/////cash advance handler
export const handleCashAdvance = ( travelRequestId, cashAdvanceId, action) => {
  let url;

  if (action === 'ca-create') {
    url = cashAdvanceRoutes.create.getUrl( travelRequestId);
    return url
  } else if (action === 'ca-modify') {
    url = cashAdvanceRoutes.modify.getUrl( travelRequestId, cashAdvanceId);
    return url
  } else if (action === 'ca-cancel') {
    url = cashAdvanceRoutes.cancel.getUrl( travelRequestId, cashAdvanceId);
  } else if( action === 'non-tr-ca-create'){ 
    url = cashAdvanceRoutes.nonTravel_ca_create.getUrl( );
  return url}
  else {
    throw new Error('Invalid action');
  }
  urlRedirection(url);
};


//travel expense
export const handleTravelExpense=({tenantId,empId,tripId,expenseHeaderId,action})=>{
  console.log('route data', tripId,expenseHeaderId,action)
    let url ;
    if (action==="trip-ex-create"){
      url=expenseRoutes.create.getUrl({tenantId,empId,tripId})
    }
    else if(action==="trip-ex-modify"){
      url= expenseRoutes.modify.getUrl({tenantId,empId,tripId,expenseHeaderId});
    } else if (action==="trip-ex-cancel"){
      url =expenseRoutes.cancel.getUrl({tenantId,empId,tripId,expenseHeaderId})
    }else if (action=="trip-ex-clear-rejected"){
        url=expenseRoutes.clearRejected.getUrl({tenantId,empId,tripId,expenseHeaderId})
    }
    else {
      throw new Error('Invalid action');
    }
    
    //urlRedirection(url);
    return url
   }


//handle trip 
export const handleTrip=(tripId,action)=>{
  let url;
  if (action==="trip-recovery-view"){
    url=tripRoutes.tripRecoveryView.getUrl(tripId)
  }else if (action==="trip-cancelletion-view"){
    url=tripRoutes.cancel.getUrl(tripId)
  }
  else {
    throw new Error('Invalid action');
  }
  urlRedirection(url)

}   


//handle non travel expense
export const handleNonTravelExpense=({tenantId,empId,expenseHeaderId,action})=>{
    let url ;
    if (action==="non-tr-ex-create"){
      url=nonExpenseRoutes.create.getUrl(tenantId,empId)
    }
    else if(action==="non-tr-ex-modify"){
      url= nonExpenseRoutes.modify.getUrl(tenantId,empId,expenseHeaderId);
    } else if (action==="non-tr-ex-cancel"){
      url =nonExpenseRoutes.cancel.getUrl(tenantId,empId,expenseHeaderId)
    }else if (action=="non-tr-ex-clear-rejected"){
      url=nonExpenseRoutes.clearRejected.getUrl(tenantId,empId,expenseHeaderId)
    }
    else {
      throw new Error('Invalid action');
    }
    return (url);
   }

    
 export const handleApproval=({tenantId,empId,travelRequestId ,tripId, expenseHeaderId ,action} )=>{
  let url ;
  if (action==="travel-approval-view"){
    return url=approvalViewRoutes.viewDetails.viewDetails_tr_standalone.getUrl(tenantId,empId,travelRequestId)
  }
  else if (action==="travelExpense-approval-view"){
    url=approvalViewRoutes.viewDetails.viewDetails_tr_expense.getUrl(tenantId,empId,tripId,expenseHeaderId)
  }
  else if (action==="nontravelExpense-approval-view"){
    url=approvalViewRoutes.viewDetails.viewDetails_nonTr_expense.getUrl(tenantId,empId,expenseHeaderId)
  }
  else {
    throw new Error('Invalid action');
  }
  return(url)
 }


   