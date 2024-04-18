export const dummyExpenseData = {
  tenantId: 'sampleTenantId',
  tenantName: 'Sample Tenant',
  companyName: 'Sample Company',
  tripPurpose:"for conference purpose",
  tripId: '5ffdf7df35da0e0017b816d9', 
  tripNumber: 'TRIP00066355', 
  expenseHeaderID: '5ffdf7df35da0e0017b816da', 
  expenseHeaderNumber: 'EXP00000123',
  expenseHeaderType: 'travel',
  expensePurpose: 'Conference expenses', 
  createdBy: { empId: 'EMP001', name: 'Ambrane Ardie' },
  createdFor: { empId: 'EMP002', name: 'Jane Doe' },
  teamMembers: [
    { empId: 'EMP003', name: 'Bob Smith' },
  ],

  travelExpenseAllocation:[
    
    
        {
          headers:"Cost Center",
          values:["sales","finance"]
        }
      
  ]
  
,
  expenseHeaderStatus: 'pending approval',
  expenseAmountStatus: {
    totalCashAmount: 1000.00,
    totalExpenseAmount: 2500,
    totalPersonalExpense: 500,
    remainingCash: -500,
  },
 
  expenseLines: [
    {
      categoryName: 'cab', 
      'Total Amount': '4000',
       currencyName:'$'
        
     
        
      
    },

    {
        categoryName: 'food',
        'Total Fair': '5000',
        currencyName:'$'
        
     
    },
    {
       categoryName: 'food',
      'Total Fair': '5000',
      currencyName:'$'
     
    },
    {
      categoryName: 'travel',
      'Total Fair': '5000',
      currencyName:'$'
      
    },
    {
      categoryName: 'cab',
      'Total Fair': '5000',
      currencyName:'$'
     
    },
    {
      categoryName: 'flight',
      'Total Fair': '5000',
      currencyName:'$'
     
    },
  
  ],
  approvers: [

    { empId: 'Approver001', name: 'Approver 1', status: 'pending approval' },
    // Add more approvers as needed
  ],
  alreadyBookedExpenseLines:{
     flights:[
        {amount:"5000"},
        {amount:"3000"},
        {amount:"6000"},
        {amount:"4000"},
      ],
      cabs:[
        {amount:"2000"},
        {amount:"3000"},
        {amount:"6000"},
        {amount:"4000"},
        {amount:"4000"},

      ],

      hotels:[
        {amount:"2000"},
        {amount:"3000"},
        {amount:"2000"},
        {amount:"4000"},

      ]
    },
  expenseViolations: ['Receipt missing', 'Exceeds policy limits'],
  expenseRejectionReason: 'Invalid expenses',
  expenseSubmissionDate: new Date(),
};  

  