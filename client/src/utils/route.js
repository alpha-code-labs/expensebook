const tenantId = localStorage.getItem('tenantId');
const empId = localStorage.getItem('empId');


const travelBaseUrl      = import.meta.env.VITE_TRAVEL_PAGE_URL;
const loginBaseUrl       = import.meta.env.VITE_LOGIN_PAGE_URL;
const cashAdvanceBaseUrl = import.meta.env.VITE_CASHADVANCE_PAGE_URL;
const expenseBaseUrl     = import.meta.env.VITE_EXPENSE_PAGE_URL;
const approvalBaseUrl    = import.meta.env.VITE_APPROVAL_PAGE_URL;


export const loginPageRoutes = {

  login:{
    path:'/api/login-page',
    getUrl:`${loginBaseUrl}/login-page`
  }

}



export const travelRoutes = {
  create: {
    path: '/tr-create/:tenantId/:employeeId',
    getUrl: (tenantId,empId) => `${travelBaseUrl}/create/${tenantId}/${empId}`,
  },
  modify: {
   modify_tr_standalone:{ path: '/modify-tr/:tenantId/:empId/:travelRequestId',
    getUrl: ( empId,tenantId,travelRequestId) => `${travelBaseUrl}/modify/${travelRequestId}`,
  },
  
},

  cancel: {
    cancel_tr_standalone:{path: '/cancel/:tenantId/:empId/:travelRequestId',
    getUrl: (tenantId, empId ,travelRequestId) => `${travelBaseUrl}/cancel/${travelRequestId}`
  },
 
  },

  booking:{
    booking_tr_standalone:{
      path: '/booking-view-tr-standalone/:tenantId/:empId/:travelRequestId',
      getUrl: ( travelRequestId) => `${travelBaseUrl}/bookings/${travelRequestId}`,
    },
    
  },
};





export const cashAdvanceRoutes={
  create:{
    path:'/ca-create/:tenantId/:empId/:travelRequestId',
    getUrl:(travelRequestId,)=>`${cashAdvanceBaseUrl}/create/advance/${travelRequestId}`
  },
  nonTravel_ca_create:{
    path:'/ca-create/:tenantId/:empId/:travelRequestId',
    getUrl:()=>`${cashAdvanceBaseUrl}/non-travel/create/advance`
  },
  modify:{
    path:'/ca-modify/:tenantId/:empId/:travelRequestId/:cashAdvanceId',
    getUrl:(travelRequestId,cashAdvanceId,)=>`${cashAdvanceBaseUrl}/modify/advance/${travelRequestId}/${cashAdvanceId}`
  },
  cancel:{
    path:'/cancel/advance/:travelRequestId/:cashAdvanceId',
    getUrl:(travelRequestId,cashAdvanceId,)=>`${cashAdvanceBaseUrl}/cancel/advance/${travelRequestId}/${cashAdvanceId}`
  },
  clearRejected:{
    path:'/rejected/advance/:travelRequestId/:cashAdvanceId',
    getUrl:(empId , tenantId,travelRequestId,cashAdvanceId,)=>`${cashAdvanceBaseUrl}/ca-clear-rejected/${tenantId}/${empId}/${travelRequestId}/${cashAdvanceId}`
  },
  modify_tr_with_ca:{ path: '/modify-tr-ca/:tenantId/:empId/:travelRequestId',
  getUrl: (tenantId ,empId, travelRequestId) => `${cashAdvanceBaseUrl}/modify/travel/${travelRequestId}`,
},
  cancel_tr_with_ca:{
    path: '/cancel-tr-ca/:tenantId/:empId/:travelRequestId',
  getUrl: (tenantId ,empId, travelRequestId) => `${cashAdvanceBaseUrl}/cancel/travel/${travelRequestId}`
},
booking_tr_with_ca:{
  path: '/booking-view-tr-ca/:tenantId/:empId/:travelRequestId',
  getUrl: ( travelRequestId) =>`${cashAdvanceBaseUrl}/bookings/travel/${travelRequestId}`,
}, 
}


///travel expense routes




export const expenseRoutes={  
  create:{
    path:'travel/book-expense/:tenantId/:empId/:tripId',
    getUrl:({tenantId,empId,tripId})=>`${expenseBaseUrl}/${tenantId}/${empId}/${tripId}/new/line-item`
  },
  modify:{
    path:'tr-ex-modify/:tenantId/:empId/:tripId/:cashAdvanceId',
    getUrl:({tenantId,empId,tripId},)=>`${expenseBaseUrl}/${tenantId}/${empId}/${tripId}/view/travel-expense`
  },
  cancel:{
    path:'/tr-ex-cancel/:tenantId/:empId/:tripId/:expenseHeaderId',
    getUrl:({tenantId,empId,tripId})=>`${expenseBaseUrl}/${tenantId}/${empId}/${tripId}/cancel/travel-expense`
  },
  clearRejected:{
    path:'/tr-ex-clear-rejected/:tenantId/:empId/:tripId/:expenseHeaderId',
    getUrl:({tenantId,empId,tripId,expenseHeaderId})=>`${expenseBaseUrl}/tr-ex-clear-rejected/${tenantId}/${empId}/${tripId}/${expenseHeaderId}`
  }
}



//non-travel routes



export const nonExpenseRoutes={  
  create:{
    path:'/non-tr-ex-create/:tenantId/:empId',
    getUrl:(tenantId,empId)=>`${expenseBaseUrl}/${tenantId}/${empId}/non-travel-expense/new`
  },
  modify:{
    path:'/non-tr-ex-modify/:tenantId/:empId/:cashAdvanceId',
    getUrl:(tenantId,empId,expenseHeaderId)=>`${expenseBaseUrl}/${tenantId}/${empId}/non-travel-expense/${expenseHeaderId}/view`
  },
  cancel:{
    path:'/non-tr-ex-cancel/:tenantId/:empId/:expenseHeaderId',
    getUrl:(tenantId,empId,expenseHeaderId,)=>`${expenseBaseUrl}/${tenantId}/${empId}/${expenseHeaderId}/cancel/reimbursement`
  },
  // clearRejected:{
  //   path:'/non-tr-ex-clear-rejected/:tenantId/:empId/:expenseHeaderId',
  //   getUrl:(expenseHeaderId,)=>`${nonTravelBaseUrlExpense}/non-tr-ex-clear-rejected/${tenantId}/${empId}/${expenseHeaderId}`
  // }
}


//travel request view for approval



export const approvalViewRoutes={
  viewDetails:{
    viewDetails_tr_standalone:{
      path:'/:tenantId/:empId/:travelRequestId',
      getUrl:(tenantId, empId, travelRequestId) => `${approvalBaseUrl}/${tenantId}/${empId}/${travelRequestId}/travel-approval`,
    },
    viewDetails_tr_expense:{  
      path:'/expense/:tenantId/:empId/:tripId/:expenseHeaderId/travel-expense',
      getUrl:(tenantId, empId, tripId,expenseHeaderId) => `${approvalBaseUrl}/${tenantId}/${empId}/${tripId}/${expenseHeaderId}/travel-expense-approval`,
    }, 
    viewDetails_nonTr_expense:{  
      path:'/expense/:tenantId/:empId/:tripId/:expenseHeaderId/travel-expense',
      getUrl:(tenantId, empId,expenseHeaderId) => `${approvalBaseUrl}/${tenantId}/${empId}/${expenseHeaderId}/approval/non-travel`,
    } 
  }
} 



//travel request view for approval
const tripBaseUrl = import.meta.env.VITE_TRIP_BASE_URL;


export const tripRoutes={
    tripRecoveryView:{
      path:'/trip-recovery-view-tr/:tenantId/:empId/:tripId',
      getUrl:( tripId) => `${tripBaseUrl}/trip-recovery-view-tr/${tenantId}/${empId}/${tripId}`,
    },
    cancel:{
      path:"/trip-cancel-view/:tenantId/:empId/:tripId",
      getUrl:(tripId)=>`${tripBaseUrl}/trip-cancel-view/${tenantId}/${empId}/${tripId}`
    } 
} 