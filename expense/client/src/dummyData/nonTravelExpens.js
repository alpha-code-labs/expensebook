//when user will click book and expense
//- in route tenant , empId
//=get the categories , default curreccny , empName , company name 
//- select the category ---
//send back- in route tenantId , empId , in body -expense category 
//response -- body - tenantId , tenantName , companyName , createdBy , expenseHeaderId , expenseHeaderNumber ,defaultCurrency , reimbursementAllocations , hightLimitGroup --i.e. hr group  , limit- amt , fields , categoryName









export const nonTravelExpenseData = {
   companyName:"company Name",
   employee:{
    empId:"empIddfhj",
    name: 'Employee Name'
   }  ,
   defaultCurrency:"INR",
   expenseHeaderNumber:"expheader867687",
   expenseCategory:"expense Category",
   allocations:[
    {
    headerName: "cost center",
    headerValues: ["cc1","cc2","cc3"],
  },
    {
    headerName: "profit centre",
    headerValues: ["pc1","pc2","pc3"],
  }
], 
   expenseLine: [
    {

        expenseLineId:"id656",
        'Bill Date': '2024-01-20',
        'Bill Number': 'B12345',
        'Vendor Name': 'XYZ Corporation',
        'Description': 'Travel slip for luggage',
        'Quantity': 10,
        'Unit Cost': 50.00,
        'Tax Amount': 10.00,
        'Total Amount': 550.00,
        'Currency': 'USD',
        'Document': 'https://humanium-metal.com/app/uploads/2020/03/im-logotype-rgb-digital.png',
        lineItemAllocation:[
          {
            headerName:"Cost Centre",
            headerValue:'CC 1'
          },
          {
            headerName: "profit centre",
            headerValue:'PC 1'
          }
        ]

      
    },
    {

      expenseLineId:"id6563",
      'Bill Date': '2024-01-20',
      'Bill Number': 'B12345',
      'Vendor Name': 'XYZ Corporation',
      'Description': 'Travel slip for luggage',
      'Quantity': 10,
      'Unit Cost': 50.00,
      'Tax Amount': 10.00,
      'Total Amount': 550.00,
      'Currency': 'INR',
      'Document': 'https://www.africau.edu/images/default/sample.pdf',
      lineItemAllocation:[
        {
          headerName:"Cost Centre",
          headerValue:'CC 1'
        },
        {
          headerName: "profit centre",
          headerValue:'PC 1'
        }
      ]

    
  },

    // {
    //  expenseLineId:"id65687",
     
    //   'Marketing campaign description': 'Summer Sale Promotion',
    //   'Advertising channels': 'Social Media, Email Marketing',
    //   'Cost': 5000.00,
    //   'Currency': 'INR',
    //    document: " data.jsp",
    // },
  
  ]

};
  
  console.log(nonTravelExpenseData);
  