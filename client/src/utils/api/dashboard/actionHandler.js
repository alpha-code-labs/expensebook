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

  if (action === 'create-tr') {
    url = travelRoutes.create.getUrl();
  } else if (action === 'modify-tr') {
    if (isCashAdvanceTaken) {
      url = travelRoutes.modify.modify_tr_with_ca.getUrl( travelRequestId);
    } else {
      url = travelRoutes.modify.modify_tr_standalone.getUrl( travelRequestId);
    }
  } else if (action === 'cancel-tr') {
    if (isCashAdvanceTaken) {
      url = travelRoutes.cancel.cancel_tr_with_ca.getUrl( travelRequestId);
    } else {
      url = travelRoutes.cancel.cancel_tr_standalone.getUrl( travelRequestId);
    }
  }else if(action==='booking-view-tr'){
    if(isCashAdvanceTaken){
      url=travelRoutes.booking.booking_tr_with_ca.getUrl(travelRequestId)
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
  } else if (action === 'ca-modify') {
    url = cashAdvanceRoutes.modify.getUrl( travelRequestId, cashAdvanceId);
  } else if (action === 'ca-cancel') {
    url = cashAdvanceRoutes.cancel.getUrl( travelRequestId, cashAdvanceId);
  } else {
    throw new Error('Invalid action');
  }
  urlRedirection(url);
};


//travel expense
export const handleTravelExpense=(tripId,expenseHeaderId,action)=>{
    let url ;
    if (action==="trip-ex-create"){
      url=expenseRoutes.create.getUrl(tripId)
    }
    else if(action==="trip-ex-modify"){
      url= expenseRoutes.modify.getUrl(tripId,expenseHeaderId);
    } else if (action==="trip-ex-cancel"){
      url =expenseRoutes.cancel.getUrl(tripId,expenseHeaderId)
    }else if (action=="trip-ex-clear-rejected"){
        url=expenseRoutes.clearRejected.getUrl(tripId,expenseHeaderId)
    }
    else {
      throw new Error('Invalid action');
    }
    
    urlRedirection(url);
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
export const handleNonTravelExpense=(expenseHeaderId,action)=>{
    let url ;
    if (action==="non-tr-ex-create"){
      url=nonExpenseRoutes.create.getUrl()
    }
    else if(action==="non-tr-ex-modify"){
      url= nonExpenseRoutes.modify.getUrl(expenseHeaderId);
    } else if (action==="non-tr-ex-cancel"){
      url =nonExpenseRoutes.cancel.getUrl(expenseHeaderId)
    }else if (action=="non-tr-ex-clear-rejected"){
      url=nonExpenseRoutes.clearRejected.getUrl(expenseHeaderId)
    }
    else {
      throw new Error('Invalid action');
    }
    urlRedirection(url);
   }

    
 export const handleApproval=(travelRequestId , expenseHeaderId ,action, )=>{
  let url ;
  if (action==="approval-view-tr"){
    url=approvalViewRoutes.viewDetails.viewDetails_tr_standalone.getUrl(travelRequestId)
  }else if (action==="approval-view-tr-ca"){
    url=approvalViewRoutes.viewDetails.viewDetails_tr_with_ca.getUrl(travelRequestId)
  }else if (action==="approval-view-tr-expense"){
    url=approvalViewRoutes.viewDetails.viewDetails_tr_expense.getUrl(expenseHeaderId)
  }
  else {
    throw new Error('Invalid action');
  }
  urlRedirection(url)
 }


   