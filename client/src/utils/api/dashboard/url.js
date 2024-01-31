//from expense route tenantId emp id are importing here...
const tenantId="TNTABG";
const empId = "empL001"
const travelBaseUrl = 'http://localhost:8080/api';


const loginBaseUrl = 'http://localhost:8080/api';

export const loginPageRoutes = {

  login:{
    path:'/api/login-page',
    getUrl:`${loginBaseUrl}/login-page`
  }

}





export const travelRoutes = {
  create: {
    path: '/tr-create/:tenantId/:empId',
    getUrl: () => `${travelBaseUrl}/tr-create/${tenantId}/${empId}`,
  },
  modify: {
   modify_tr_standalone:{ path: '/modify-tr/:tenantId/:empId/:travelRequestId',
    getUrl: ( travelRequestId) => `${travelBaseUrl}/modify-tr/${tenantId}/${empId}/${travelRequestId}`,
  },
   modify_tr_with_ca:{ path: '/modify-tr-ca/:tenantId/:empId/:travelRequestId',
    getUrl: ( travelRequestId) => `${travelBaseUrl}/modify-tr-ca/${tenantId}/${empId}/${travelRequestId}`,
  },
},

  cancel: {
    cancel_tr_standalone:{path: '/cancel-tr/:tenantId/:empId/:travelRequestId',
    getUrl: (travelRequestId) => `${travelBaseUrl}/cancel-tr/${tenantId}/${empId}/${travelRequestId}`
  },
  cancel_tr_with_ca:{path: '/cancel-tr-ca/:tenantId/:empId/:travelRequestId',
    getUrl: ( travelRequestId) => `${travelBaseUrl}/cancel-tr-ca/${tenantId}/${empId}/${travelRequestId}`
  },
  },

  booking:{
    booking_tr_standalone:{
      path: '/booking-view-tr-standalone/:tenantId/:empId/:travelRequestId',
      getUrl: ( travelRequestId) => `${travelBaseUrl}/booking-tr-standalone/${tenantId}/${empId}/${travelRequestId}`,
    },
    booking_tr_with_ca:{
      path: '/booking-view-tr-ca/:tenantId/:empId/:travelRequestId',
      getUrl: ( travelRequestId) =>`${travelBaseUrl}/booking-tr-ca/${tenantId}/${empId}/${travelRequestId}`,
    }, 
  },
};



const cashAdvanceBaseUrl = 'http://localhost:8080';

export const cashAdvanceRoutes={
  create:{
    path:'/ca-create/:tenantId/:empId/:travelRequestId',
    getUrl:(travelRequestId,)=>`${cashAdvanceBaseUrl}/ca-create/${tenantId}/${empId}/${travelRequestId}`
  },
  modify:{
    path:'/ca-modify/:tenantId/:empId/:travelRequestId/:cashAdvanceId',
    getUrl:(travelRequestId,cashAdvanceId,)=>`${cashAdvanceBaseUrl}/ca-modify/${tenantId}/${empId}/${travelRequestId}/${cashAdvanceId}`
  },
  cancel:{
    path:'/ca-cancel/:tenantId/:empId/:travelRequestId/:cashAdvanceId',
    getUrl:(travelRequestId,cashAdvanceId,)=>`${cashAdvanceBaseUrl}/ca-cancel/${tenantId}/${empId}/${travelRequestId}/${cashAdvanceId}`
  },
  clearRejected:{
    path:'/ca-clear-rejected/:tenantId/:empId/:travelRequestId/:cashAdvanceId',
    getUrl:(travelRequestId,cashAdvanceId,)=>`${cashAdvanceBaseUrl}/ca-clear-rejected/${tenantId}/${empId}/${travelRequestId}/${cashAdvanceId}`
  }
}


///travel expense routes


const expenseBaseUrl = 'http://localhost:5173/api/internal/expense/fe';

export const expenseRoutes={  
  create:{
    path:'travel/book-expense/:tenantId/:empId/:tripId',
    getUrl:(tripId,)=>`${expenseBaseUrl}/tr-ex-create/${tenantId}/${empId}/${tripId}`
  },
  modify:{
    path:'tr-ex-modify/:tenantId/:empId/:tripId/:cashAdvanceId',
    getUrl:(tripId,expenseHeaderId,)=>`${expenseBaseUrl}/tr-ex-modify/${tenantId}/${empId}/${tripId}/${expenseHeaderId}`
  },
  cancel:{
    path:'/tr-ex-cancel/:tenantId/:empId/:tripId/:expenseHeaderId',
    getUrl:(tripId,expenseHeaderId,)=>`${expenseBaseUrl}/tr-ex-cancel/${tenantId}/${empId}/${tripId}/${expenseHeaderId}`
  },
  clearRejected:{
    path:'/tr-ex-clear-rejected/:tenantId/:empId/:tripId/:expenseHeaderId',
    getUrl:(tripId,expenseHeaderId,)=>`${expenseBaseUrl}/tr-ex-clear-rejected/${tenantId}/${empId}/${tripId}/${expenseHeaderId}`
  }
}



//non-travel routes
const nonTravelBaseUrlExpense = 'http://localhost:8080';


export const nonExpenseRoutes={  
  create:{
    path:'/non-tr-ex-create/:tenantId/:empId',
    getUrl:()=>`${nonTravelBaseUrlExpense}/non-tr-ex-create/${tenantId}/${empId}`
  },
  modify:{
    path:'/non-tr-ex-modify/:tenantId/:empId/:cashAdvanceId',
    getUrl:(expenseHeaderId,)=>`${nonTravelBaseUrlExpense}/non-tr-ex-modify/${tenantId}/${empId}/${expenseHeaderId}`
  },
  cancel:{
    path:'/non-tr-ex-cancel/:tenantId/:empId/:expenseHeaderId',
    getUrl:(expenseHeaderId,)=>`${nonTravelBaseUrlExpense}/non-tr-ex-cancel/${tenantId}/${empId}/${expenseHeaderId}`
  },
  clearRejected:{
    path:'/non-tr-ex-clear-rejected/:tenantId/:empId/:expenseHeaderId',
    getUrl:(expenseHeaderId,)=>`${nonTravelBaseUrlExpense}/non-tr-ex-clear-rejected/${tenantId}/${empId}/${expenseHeaderId}`
  }
}


//travel request view for approval
const approvalBaseUrl = 'http://localhost:8080';


export const approvalViewRoutes={
  viewDetails:{
    viewDetails_tr_standalone:{
      path:'/approval-view-tr/:tenantId/:empId/:travelRequestId',
      getUrl:( travelRequestId) => `${approvalBaseUrl}/approval-view-tr/${tenantId}/${empId}/${travelRequestId}`,
    },
    viewDetails_tr_with_ca:{  
      path:'/approval-view-tr-ca/:tenantId/:empId/:travelRequestId',
      getUrl:( travelRequestId) => `${approvalBaseUrl}/approval-view-tr-ca/${tenantId}/${empId}/${travelRequestId}`,
    } ,
    viewDetails_tr_expense:{  
      path:'/approval-view-tr-expense/:tenantId/:empId/:travelRequestId',
      getUrl:( travelRequestId) => `${approvalBaseUrl}/approval-view-tr-expense/${tenantId}/${empId}/${travelRequestId}`,
    } 
  }
} 



//travel request view for approval
const tripBaseUrl = 'http://localhost:8080';


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