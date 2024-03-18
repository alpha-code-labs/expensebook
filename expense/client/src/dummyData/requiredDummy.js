// const expenseLineSchema = new mongoose.Schema({
//   expenseLineId:mongoose.Schema.Types.ObjectId,
//   travelType: String,
//   lineItemStatus: {
//     type: String,
//     enum: lineItemStatusEnums,
//   },
//   expenseAllocation : [{ //Travel expense allocation comes here
//     headerName: {
//       type: String,
//     },
//     headerValues: [{
//       type: String,
//     }],
//   }],
//   expenseAllocation_accountLine: String,
//   alreadySaved: Boolean, // when saving a expense line , make sure this field marked as true
//   expenseCategory: {
//     categoryName: String,
//     fields:[],
//     travelClass: String,
//   }, //expense category comes here, ex- flights, cabs for travel ,etc
//   modeOfPayment: String,
//   isInMultiCurrency: Boolean, // if currency is part of multiCurrency Table
//   multiCurrencyDetails: {
//     type: [{
//       nonDefaultCurrencyType: String,
//       originalAmountInNonDefaultCurrency: Number,
//       conversionRateToDefault: Number,
//       convertedAmountToDefaultCurrency: Number,
//     }],
//     required: function() {
//       return this.isInMultiCurrency === true;
//     },
//   },
//   isPersonalExpense: Boolean, //if bill has personal expense, can be partially or entire bill.
//   personalExpenseAmount: {
//     type: Number,
//     // This field is required if 'isPersonalExpense' is true
//     required: function() {
//       return this.isPersonalExpense === true;
//     },
//   },
//   nonPersonalExpenseAmount: {
//     type: Number,
//     // This field is required if 'isPersonalExpense' is true
//     required: function() {
//       return this.isPersonalExpense === true;
//     },
//   },
//   billImageUrl: String,
//   billRejectionReason: String,
// },{ strict: false });

export const bookAnExpenseData= {
  tripId:'tripidflkjdslfk',
  tripPurpose:'Trip for Investor Meeting',
  newExpenseReport: true,
  expenseReportNumber: 'ExpenseNo.s7987979',
  alreadyBookedExpense: {
    "formState": [
        {
            "transfers": {
                "needsDeparturePickup": true,
                "needsDepartureDrop": true,
                "needsReturnPickup": false,
                "needsReturnDrop": true
            },
            "formId": "form123",
            "needsHotel": true,
            "needsCab": false,
            "needsVisa": true,
            "cancellationDate": " ",
            "cancellationReason": "Change in travel plans",
            "formStatus": "Submitted",
            "_id": "65815786e1751ead06a684c2"
        }
    ],

    "flights": [
        {
            "violations": {
                "class": "Type A",
                "amount": "100 USD"
            },
            "bkd_violations": {
                "class": "Type A",
                "amount": "100 USD"
            },
            "itineraryId": "5fec83753a4959001771449a",
            "formId": "form123",
            "from": "Mumbai",
            "to": "Delhi",
            "date": "2023-12-16T15:30:00.000Z",
            "time": "11:00",
            "travelClass": "Business Class",
            "bkd_from": "Mumbai",
            "bkd_to": "Delhi",
            "bkd_date": "2023-12-21T15:30:00.000Z",
            "bkd_time": "12:20",
            "bkd_travelClass": "Business Class",
            "modified": false,
            "cancellationDate": null,
            "cancellationReason": "Flight canceled by airline",
            "status": "booked",
            "_id": "65815786e1751ead06a684c3"
        }
    ],
    "buses": [
        {
            "violations": {
                "class": "Type D",
                "amount": "70 USD"
            },
            "itineraryId": "5fec83753a4959001771449d",
            "formId": "form126",
            "from": "City A",
            "to": "City B",
            "date": "2023-12-19T15:30:00.000Z",
            "time": "08:00",
            "travelClass": "Sleeper",
            "bkd_from": "City A",
            "bkd_to": "City B",
            "bkd_date": "2023-12-19T15:30:00.000Z",
            "bkd_time": "08:00",
            "bkd_travelClass": "Sleeper",
            "modified": false,
            "cancellationDate": null,
            "cancellationReason": "",
            "status": "booked",
            "_id": "65815786e1751ead06a684c4"
        }
    ],
    "hotels": [
        {
            "violations": {
                "class": "Type C",
                "amount": "120 USD"
            },
            "bkd_violations": {
                "class": "Type C",
                "amount": "120 USD"
            },
            "itineraryId": "5fec83753a4959001771449c",
            "formId": "form125",
            "location": "Hotel ABC",
            "locationPreference": "Near Airport",
            "class": "Luxury",
            "checkIn": "2023-12-18T15:30:00.000Z",
            "checkOut": "2023-12-22T15:30:00.000Z",
            "bkd_location": "Hotel ABC",
            "bkd_class": "Luxury",
            "bkd_checkIn": "2023-12-18T15:30:00.000Z",
            "bkd_checkOut": "2023-12-22T15:30:00.000Z",
            "modified": false,
            "cancellationDate": "",
            "cancellationReason": "",
            "status": "booked",
            "_id": "65815786e1751ead06a684c5"
        },
        {
            "violations": {
                "class": "Type C",
                "amount": "120 USD"
            },
            "bkd_violations": {
                "class": "Type C",
                "amount": "120 USD"
            },
            "itineraryId": "5fec83753a4959001771449c",
            "formId": "form125",
            "location": "Hotel ABC",
            "locationPreference": "Near Airport",
            "class": "Luxury",
            "checkIn": "2023-12-18T15:30:00.000Z",
            "checkOut": "2023-12-22T15:30:00.000Z",
            "bkd_location": "Hotel ABC",
            "bkd_class": "Luxury",
            "bkd_checkIn": "2023-12-18T15:30:00.000Z",
            "bkd_checkOut": "2023-12-22T15:30:00.000Z",
            "modified": false,
            "cancellationDate": "",
            "cancellationReason": "",
            "status": "booked",
            "_id": "65815786e1751ead06a684c6"
        }
    ],
    "cabs": [
        {
            "violations": {
                "class": "Type B",
                "amount": "80 USD"
            },
            "bkd_violations": {
                "class": "Type B",
                "amount": "80 USD"
            },
            "itineraryId": "5fec83753a4959001771449b",
            "formId": "form124",
            "date": "2023-12-20T15:30:00.000Z",
            "class": "Sedan",
            "preferredTime": "10:00",
            "pickupAddress": "Address 1",
            "dropAddress": "Address 2",
            "bkd_date": "2023-12-20T15:30:00.000Z",
            "bkd_class": "Sedan",
            "bkd_preferredTime": "10:00",
            "bkd_pickupAddress": "Address 1",
            "bkd_dropAddress": "Address 2",
            "modified": false,
            "cancellationDate": "",
            "cancellationReason": "",
            "status": "booked",
            "type": "departure pickup",
            "_id": "65815786e1751ead06a684c7"
        }
    ]
},
approvers: [
  {
    empId: 'emp999',
    name: 'Approver 1',
    status: 'pending approval',
  },
  {
    empId: 'emp888',
    name: 'Approver 2',
    status: 'pending approval',
  },
],


isCashAdvanceTaken: true,
totalCashAmount: '5000', //totol paid cash advance
remainingCash: "2000",
companyDetails:{
  defaultCurrency:"USD",
  travelAllocationFlags:{
  level1:true,
  level2:false,
  level3:false
 }
,
  travelAllocations:{
    // level1
    allocation: [
      { headerName: "Level1_Header", headerValues: ["Value1", "Value2"] }
    ],

  expenseAllocation: [
       { headerName: "cost centre", headerValues: ["cc1", "cc2"] }
      ,{ headerName: "legal entity", headerValues: ["LE1", "LE2"] }
      ,{ headerName: "profit center", headerValues: ["pc1", "pc2"] },
  ],

  reimbursementCategories : [
    {
      categoryName: 'Office Supplies',
     
      fields: [
        { name:'Bill Date',type:'date'},
        { name:'Bill Number',type:'numeric'},
        { name:'Vender Name',type:'text'},
        { name: 'Description', type: 'text' },
        { name: 'Quantity', type: 'numeric' },
        { name: 'Unit Cost', type: 'numeric' },
        { name: 'Tax Amount', type: 'numeric' },
        { name: 'Total Amount', type: 'numeric' },      
      ]
    },
    {
      categoryName: 'Travel Expenses',   
        fields: [
          { name:'Bill Date',type:'date'},
          { name:'Bill Number',type:'numeric'},
          { name: 'Description', type: 'text' },
          { name: 'Quantity', type: 'numeric' },
          { name: 'Unit Cost', type: 'numeric' },
          { name: 'Total Amount', type: 'numeric' },      
        ]     
    },
  ],

  allocation_accountLine: "Allocation_AccountLine_Value",
  expenseAllocation_accountLine: "Allocation_AccountLine_Value",
  },
// travel expense & reimbursement categories  combine array is there

travelExpenseCategories : [
  
  {
    categoryName: 'Flight',
    fields: [
      { name: 'Invoice Date', type: 'date' },
      { name: 'Flight number', type: 'text' },
      { name: 'Class of Service', type: 'text' },
      {name: 'Departure', type: 'text'},
      {name: 'Arrival', type: 'text'},
      { name: 'Airlines name', type: 'text' },
      { name: 'Travelers Name', type: 'text' },   
      { name: 'Booking Reference Number', type: 'text' },
      { name: 'Total Amount', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' }
    ],
    modeOfTranfer: true,
    class: ['Economy', 'Premium Economy', 'Business', 'First Class'],   
  
  },
  {
    categoryName: 'Train',
    fields: [
      { name: 'Invoice Date', type: 'date' },
      { name: 'Origin', type: 'text' },
      { name: 'Destination', type: 'text' },
      { name: 'Travelers Name', type: 'text' },
      { name: 'Class of Service', type: 'text' },
      { name: 'Booking Reference No.', type: 'text' },
      { name: 'Total Amount', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' },
      
    ],
    modeOfTranfer: true,
    class: ['First AC ', 'Second AC', 'Third AC', 'Sleeper', 'Chair Car'],
    
  },
  {
    categoryName: 'Bus',
    fields: [
      { name: 'Invoice Date', type: 'date' },
      { name: 'Origin', type: 'text' },
      { name: 'Destination', type: 'text' },
      { name: 'Travelers Name', type: 'text' },
      { name: 'Class of Service', type: 'text' },
      { name: 'Booking Reference No.', type: 'text' },
      { name: 'Total Amount', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' },
  
    ],
    modeOfTranfer: true,
    class: ['Sleeper', 'Semi-Sleeper', 'Regular'],
    
  },
  {
    categoryName: 'Cab',
    fields: [
      { name: 'Date', type: 'date' },
      { name: 'Time', type: 'time' },
      { name: 'Class of Service', type: 'text' },
      { name: 'Pickup Location', type: 'text' },
      { name: 'DropOff Location', type: 'text' },
      { name: 'Total Fare', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' },
      { name: 'Payment Method', type: 'text' },
      { name: 'Receipt No.', type: 'text' },
      { name: 'Ride Distance', type: 'text' }
    ],
    modeOfTranfer:true,
    class: ['Economy', 'Business', 'Executive'],
   
  },
  {
    categoryName: 'Cab Rental',
    fields: [
      { name: 'Date', type: 'date' },
      { name: 'Time', type: 'time' },
      { name: 'Class of Service', type: 'text' },
      { name: 'Pickup Location', type: 'text' },
      { name: 'DropOff Location', type: 'text' },    
      { name: 'Total Fare', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' },
      { name: 'Payment Method', type: 'text' },
      { name: 'Receipt No.', type: 'text' },
      { name: 'Ride Distance', type: 'text' },
     
    ],
    modeOfTranfer:true,
    class: ['Economy', 'Business', 'Executive'],
    
  },
  {
    categoryName: 'Hotel',
    fields: [
      { name: 'Guest name', type: 'text' },
      { name: 'Hotel Name', type: 'text' },
      { name: 'Check in date', type: 'date' },
      { name: 'Check out date', type: 'date' },
      {name: 'City', type: 'text'},
      { name: 'Class', type: 'text' },
      { name: 'Room rates', type: 'amount' },
      { name: 'Tax amount', type: 'amount' },
      { name: 'Total amount', type: 'amount' },
      { name: 'Booking Reference No.', type: 'text' },
      { name: 'Payment Method', type: 'text' }
    ],
    modeOfTranfer:true,
    class: ['Motel', '3 star', '4 star', '5 star'],
  },
  {
    categoryName: 'Meals',
    fields: [
      { name: 'Bill Date', type: 'date' },
      { name: 'Bill Number', type: 'text' },
      { name: 'Vendor Name', type: 'text' },
      { name: 'Description', type: 'text' },
      { name: 'Quantity', type: 'number' },
      { name: 'Unit Cost', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' },
      { name: 'Total Amount', type: 'amount' }
    ],
    modeOfTranfer:false,

  },
  {
    categoryName: 'Travel Reimbursement',
    fields: [
      { name: 'From', type: 'text' },
      { name: 'To', type: 'text' },
      { name: 'Distance', type: 'text' },
      { name: 'Bill Date', type: 'date' },
      { name: 'Bill Number', type: 'text' },
      { name: 'Vendor Name', type: 'text' },
      { name: 'Description', type: 'text' },
      { name: 'Quantity', type: 'number' },
      { name: 'Unit Cost', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' },
      { name: 'Total Amount', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Conference / Event',
    fields: [
      { name: 'Conference name', type: 'text' },
      { name: 'Conference date', type: 'date' },
      { name: 'Total amt', type: 'amount' },
      { name: 'Tax amt', type: 'amount' }
    ],
    modeOfTranfer:false,

  },
  {
    categoryName: 'Travel Insurance',
    fields: [
      { name: 'Policy type', type: 'text' },
      { name: 'Insurance provider', type: 'text' },
      { name: 'Premium amount', type: 'amount' }
    ],
    modeOfTranfer: false,

  },
  {
    categoryName: 'Baggage',
    fields: [
      { name: 'Airline name', type: 'text' },
      { name: 'Bill no.', type: 'text' },
      { name: 'Total amt', type: 'amount' },
      { name: 'Tax amt', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Tips',
    fields: [
      { name: 'Purpose', type: 'text' },
      { name: 'Amt', type: 'amount' }
    ],
    modeOfTranfer:false,
    limit: null,
    currency: null,
  },
  {
    categoryName: 'Miscellaneous',
    fields: [
      { name: 'Bill Date', type: 'date' },
      { name: 'Bill Number', type: 'text' },
      { name: 'Vendor Name', type: 'text' },
      { name: 'Description', type: 'text' },
      { name: 'Quantity', type: 'number' },
      { name: 'Unit Cost', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' },
      { name: 'Total Amount', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Office Supplies',
    fields: [
      { name: 'Bill Date', type: 'date' },
      { name: 'Bill Number', type: 'text' },
      { name: 'Vendor Name', type: 'text' },
      { name: 'Description', type: 'text' },
      { name: 'Quantity', type: 'number' },
      { name: 'Unit Cost', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' },
      { name: 'Total Amount', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Utilities',
    fields: [
      { name: 'Type of Utilities', type: 'text' },
      { name: 'Bill Date', type: 'date' },
      { name: 'Bill Number', type: 'text' },
      { name: 'Vender Name', type: 'text' },
      { name: 'Description', type: 'text' },
      { name: 'Quantity', type: 'number' },
      { name: 'Unit Cost', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' },
      { name: 'Total Amount', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Insurance',
    fields: [
      { name: 'Policy type', type: 'text' },
      { name: 'Insurance provider', type: 'text' },
      { name: 'Premium amount', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Marketing and Advertising',
    fields: [
      { name: 'Marketing campaign description', type: 'text' },
      { name: 'Advertising channels', type: 'text' },
      { name: 'Cost', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Professional Fees',
    fields: [
      { name: 'Service provider', type: 'text' },
      { name: 'Nature of service', type: 'text' },
      { name: 'Cost', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Software and Licenses',
    fields: [
      { name: 'Software name', type: 'text' },
      { name: 'License type', type: 'text' },
      { name: 'License cost', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Equipment',
    fields: [
      { name: 'Item description', type: 'text' },
      { name: 'Quantity', type: 'number' },
      { name: 'Unit cost', type: 'amount' },
      { name: 'Total cost', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Repairs and Maintenance',
    fields: [
      { name: 'Description of repair/maintenance work', type: 'text' },
      { name: 'Service provider', type: 'text' },
      { name: 'Cost', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Legal and Compliance',
    fields: [
      { name: 'Firm name', type: 'text' },
      { name: 'Description', type: 'text' },
      { name: 'Service name', type: 'text' },
      { name: 'Tax amt', type: 'amount' },
      { name: 'Total amt', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Communication',
    fields: [
      { name: 'Bill no. service provider', type: 'text' },
      { name: 'Bill date', type: 'date' },
      { name: 'Tax amt', type: 'amount' },
      { name: 'Total amt', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Research and Development',
    fields: [
      { name: 'Research project description', type: 'text' },
      { name: 'Cost', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Training',
    fields: [
      { name: 'Training program description', type: 'text' },
      { name: 'Trainer', type: 'text' },
      { name: 'Cost', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Software Subscriptions',
    fields: [
      { name: 'Software name', type: 'text' },
      { name: 'Subscription type', type: 'text' },
      { name: 'Subscription cost', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Client entertainment',
    fields: [
      { name: 'Bill and cost', type: 'text' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Client gift',
    fields: [
      { name: 'Bill and cost', type: 'text' }
    ],
    modeOfTranfer:false,
  }











  ///data get for nontravel expense after select the category
  
    // {
    //   categoryName: 'Flight',
    //   fields: [
    //     { name: 'Date of Travel', type: 'date' },
    //     { name: 'Flight number', type: 'text' },
    //     {name: 'Departure', type: 'text'},
    //     {name: 'Arrival', type: 'text'},
    //     { name: 'Airlines name', type: 'text' },
    //     { name: 'Travelers Name', type: 'text' },
    //     { name: 'Class of Service', type: 'text' },
    //     { name: 'Booking Reference Number', type: 'text' },
    //     { name: 'Total Amount', type: 'amount' },
    //     { name: 'Tax Amount', type: 'amount' }
    //   ],
    //   modeOfTranfer: true,
    //   class: ['Economy', 'Premium Economy', 'Business', 'First Class'],
      
    // },
    // {
    //   categoryName: 'Train',
    //   fields: [
    //     { name: 'Date of Travel', type: 'date' },
    //     { name: 'From', type: 'text' },
    //     { name: 'To', type: 'text' },
    //     { name: 'Travelers Name', type: 'text' },
    //     { name: 'Class of Service', type: 'text' },
    //     { name: 'Booking Reference No.', type: 'text' },
    //     { name: 'Total Amount', type: 'amount' },
    //     { name: 'Tax Amount', type: 'amount' }
    //   ],
    //   modeOfTranfer: true,
    //   class: ['First AC ', 'Second AC', 'Third AC', 'Sleeper', 'Chair Car'],
      
    // },
    // {
    //   categoryName: 'Bus',
    //   fields: [
    //     { name: 'Date of Travel', type: 'date' },
    //     { name: 'From', type: 'text' },
    //     { name: 'To', type: 'text' },
    //     { name: 'Travelers Name', type: 'text' },
    //     { name: 'Class of Service', type: 'text' },
    //     { name: 'Booking Reference No.', type: 'text' },
    //     { name: 'Total Amount', type: 'amount' },
    //     { name: 'Tax Amount', type: 'amount' }
    //   ],
    //   modeOfTranfer: true,
    //   class: ['Sleeper', 'Semi-Sleeper', 'Regular'],
      
    // },
    // {
    //   categoryName: 'Cab',
    //   fields: [
    //     { name: 'Date & Time', type: 'date' },
    //     { name: 'Pickup Location', type: 'text' },
    //     { name: 'DropOff Location', type: 'text' },
    //     { name: 'Total Fare', type: 'amount' },
    //     { name: 'Tax Amount', type: 'amount' },
    //     { name: 'Payment Method', type: 'text' },
    //     { name: 'Receipt No.', type: 'text' },
    //     { name: 'Ride Distance & Duration', type: 'text' }
    //   ],
    //   modeOfTranfer:true,
    //   class: ['Sedan', 'Mini', 'SUV'],
     
    // },
    // {
    //   categoryName: 'Cab Rental',
    //   fields: [
    //     { name: 'Date & Time', type: 'date' },
    //     { name: 'Pickup Location', type: 'text' },
    //     { name: 'DropOff Location', type: 'text' },
    //     { name: 'Total Fare', type: 'amount' },
    //     { name: 'Tax Amount', type: 'amount' },
    //     { name: 'Payment Method', type: 'text' },
    //     { name: 'Receipt No.', type: 'text' },
    //     { name: 'Ride Distance & Duration', type: 'text' }
    //   ],
    //   modeOfTranfer:true,
    //   class: ['Sedan', 'Miini', 'SUV'],
      
    // },
    // {
    //   categoryName: 'Hotel',
    //   fields: [
    //     { name: 'Hotel Name', type: 'text' },
    //     { name: 'Check in date', type: 'date' },
    //     { name: 'Check out date', type: 'date' },
    //     {name: 'City', type: 'text'},
    //     { name: 'Room rates', type: 'amount' },
    //     { name: 'Tax amount , Total amount', type: 'amount' },
    //     { name: 'Guest name', type: 'text' },
    //     { name: 'Booking Reference No.', type: 'text' },
    //     { name: 'Payment Method', type: 'text' }
    //   ],
    //   modeOfTranfer:false,
    //   class: ['Motel', '3 star', '4 star', '5 star'],
      
    // },
    // {
    //   categoryName: 'Meals',
    //   fields: [
    //     { name: 'Bill Date', type: 'date' },
    //     { name: 'Bill Number', type: 'text' },
    //     { name: 'Vendor Name', type: 'text' },
    //     { name: 'Description', type: 'text' },
    //     { name: 'Quantity', type: 'number' },
    //     { name: 'Unit Cost', type: 'amount' },
    //     { name: 'Tax Amount', type: 'amount' },
    //     { name: 'Total Amount', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,

    // },
    // {
    //     categoryName: 'Travel Reimbursement',
    //     fields: [
    //       { name: 'From', type: 'text' },
    //       { name: 'To', type: 'text' },
    //       { name: 'Distance', type: 'text' },
    //       { name: 'Bill Date', type: 'date' },
    //       { name: 'Bill Number', type: 'text' },
    //       { name: 'Vendor Name', type: 'text' },
    //       { name: 'Description', type: 'text' },
    //       { name: 'Quantity', type: 'number' },
    //       { name: 'Unit Cost', type: 'amount' },
    //       { name: 'Tax Amount', type: 'amount' },
    //       { name: 'Total Amount', type: 'amount' }
    //     ],
    //     modeOfTranfer:false,
  
    //   },
    // {
    //   categoryName: 'Conference / Event',
    //   fields: [
    //     { name: 'Conference name', type: 'text' },
    //     { name: 'Conference date', type: 'date' },
    //     { name: 'Total amt', type: 'amount' },
    //     { name: 'Tax amt', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,

    // },
    // {
    //   categoryName: 'Travel Insurance',
    //   fields: [
    //     { name: 'Policy type', type: 'text' },
    //     { name: 'Insurance provider', type: 'text' },
    //     { name: 'Premium amount', type: 'amount' }
    //   ],
    //   modeOfTranfer: false,

    // },
    // {
    //   categoryName: 'Baggage',
    //   fields: [
    //     { name: 'Airline name', type: 'text' },
    //     { name: 'Bill no.', type: 'text' },
    //     { name: 'Total amt', type: 'amount' },
    //     { name: 'Tax amt', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,
    // },
    // {
    //   categoryName: 'Tips',
    //   fields: [
    //     { name: 'Purpose', type: 'text' },
    //     { name: 'Amt', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,
    //   limit: null,
    //   currency: null,
    // },
    // {
    //   categoryName: 'Miscellaneous',
    //   fields: [
    //     { name: 'Bill Date', type: 'date' },
    //     { name: 'Bill Number', type: 'text' },
    //     { name: 'Vendor Name', type: 'text' },
    //     { name: 'Description', type: 'text' },
    //     { name: 'Quantity', type: 'number' },
    //     { name: 'Unit Cost', type: 'amount' },
    //     { name: 'Tax Amount', type: 'amount' },
    //     { name: 'Total Amount', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,
    // },
    // {
    //   categoryName: 'Office Supplies',
    //   fields: [
    //     { name: 'Bill Date', type: 'date' },
    //     { name: 'Bill Number', type: 'text' },
    //     { name: 'Vendor Name', type: 'text' },
    //     { name: 'Description', type: 'text' },
    //     { name: 'Quantity', type: 'number' },
    //     { name: 'Unit Cost', type: 'amount' },
    //     { name: 'Tax Amount', type: 'amount' },
    //     { name: 'Total Amount', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,
    // },
    // {
    //   categoryName: 'Utilities',
    //   fields: [
    //     { name: 'Type of Utilities', type: 'text' },
    //     { name: 'Bill Date', type: 'date' },
    //     { name: 'Bill Number', type: 'text' },
    //     { name: 'Vender Name', type: 'text' },
    //     { name: 'Description', type: 'text' },
    //     { name: 'Quantity', type: 'number' },
    //     { name: 'Unit Cost', type: 'amount' },
    //     { name: 'Tax Amount', type: 'amount' },
    //     { name: 'Total Amount', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,
    // },
    // {
    //   categoryName: 'Insurance',
    //   fields: [
    //     { name: 'Policy type', type: 'text' },
    //     { name: 'Insurance provider', type: 'text' },
    //     { name: 'Premium amount', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,
    // },
    // {
    //   categoryName: 'Marketing and Advertising',
    //   fields: [
    //     { name: 'Marketing campaign description', type: 'text' },
    //     { name: 'Advertising channels', type: 'text' },
    //     { name: 'Cost', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,
    // },
    // {
    //   categoryName: 'Professional Fees',
    //   fields: [
    //     { name: 'Service provider', type: 'text' },
    //     { name: 'Nature of service', type: 'text' },
    //     { name: 'Cost', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,
    // },
    // {
    //   categoryName: 'Software and Licenses',
    //   fields: [
    //     { name: 'Software name', type: 'text' },
    //     { name: 'License type', type: 'text' },
    //     { name: 'License cost', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,
    // },
    // {
    //   categoryName: 'Equipment',
    //   fields: [
    //     { name: 'Item description', type: 'text' },
    //     { name: 'Quantity', type: 'number' },
    //     { name: 'Unit cost', type: 'amount' },
    //     { name: 'Total cost', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,
    // },
    // {
    //   categoryName: 'Repairs and Maintenance',
    //   fields: [
    //     { name: 'Description of repair/maintenance work', type: 'text' },
    //     { name: 'Service provider', type: 'text' },
    //     { name: 'Cost', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,
    // },
    // {
    //   categoryName: 'Legal and Compliance',
    //   fields: [
    //     { name: 'Firm name', type: 'text' },
    //     { name: 'Description', type: 'text' },
    //     { name: 'Service name', type: 'text' },
    //     { name: 'Tax amt', type: 'amount' },
    //     { name: 'Total amt', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,
    // },
    // {
    //   categoryName: 'Communication',
    //   fields: [
    //     { name: 'Bill no. service provider', type: 'text' },
    //     { name: 'Bill date', type: 'date' },
    //     { name: 'Tax amt', type: 'amount' },
    //     { name: 'Total amt', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,
    // },
    // {
    //   categoryName: 'Research and Development',
    //   fields: [
    //     { name: 'Research project description', type: 'text' },
    //     { name: 'Cost', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,
    // },
    // {
    //   categoryName: 'Training',
    //   fields: [
    //     { name: 'Training program description', type: 'text' },
    //     { name: 'Trainer', type: 'text' },
    //     { name: 'Cost', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,
    // },
    // {
    //   categoryName: 'Software Subscriptions',
    //   fields: [
    //     { name: 'Software name', type: 'text' },
    //     { name: 'Subscription type', type: 'text' },
    //     { name: 'Subscription cost', type: 'amount' }
    //   ],
    //   modeOfTranfer:false,
    // },
    // {
    //   categoryName: 'Client entertainment',
    //   fields: [
    //     { name: 'Bill and cost', type: 'text' }
    //   ],
    //   modeOfTranfer:false,
    // },
    // {
    //   categoryName: 'Client gift',
    //   fields: [
    //     { name: 'Bill and cost', type: 'text' }
    //   ],
    //   modeOfTranfer:false,
    // }
  ]
 ,
  expenseSettlementOptions : {
    Cash: true,
    Cheque: false,
    'Salary Account': true,
    'Prepaid Card': false,
    'NEFT Bank Transfer': true
}

}

}


///this is according level1 + level2 in one page
export const bookAnExpenseDatalevel= {
  tripId:'tripidflkjdslfk',
  tripPurpose:'Trip for Investor Meeting',
  newExpenseReport: true,
  expenseReportNumber: 'ExpenseNo.s7987979',
  alreadyBookedExpense: {
    "formState": [
        {
            "transfers": {
                "needsDeparturePickup": true,
                "needsDepartureDrop": true,
                "needsReturnPickup": false,
                "needsReturnDrop": true
            },
            "formId": "form123",
            "needsHotel": true,
            "needsCab": false,
            "needsVisa": true,
            "cancellationDate": " ",
            "cancellationReason": "Change in travel plans",
            "formStatus": "Submitted",
            "_id": "65815786e1751ead06a684c2"
        }
    ],

    "flights": [
        {
            "violations": {
                "class": "Type A",
                "amount": "100 USD"
            },
            "bkd_violations": {
                "class": "Type A",
                "amount": "100 USD"
            },
            "itineraryId": "5fec83753a4959001771449a",
            "formId": "form123",
            "from": "Mumbai",
            "to": "Delhi",
            "date": "2023-12-16T15:30:00.000Z",
            "time": "11:00",
            "travelClass": "Business Class",
            "bkd_from": "Mumbai",
            "bkd_to": "Delhi",
            "bkd_date": "2023-12-21T15:30:00.000Z",
            "bkd_time": "12:20",
            "bkd_travelClass": "Business Class",
            "modified": false,
            "cancellationDate": null,
            "cancellationReason": "Flight canceled by airline",
            "status": "booked",
            "_id": "65815786e1751ead06a684c3"
        }
    ],
    "buses": [
        {
            "violations": {
                "class": "Type D",
                "amount": "70 USD"
            },
            "itineraryId": "5fec83753a4959001771449d",
            "formId": "form126",
            "from": "City A",
            "to": "City B",
            "date": "2023-12-19T15:30:00.000Z",
            "time": "08:00",
            "travelClass": "Sleeper",
            "bkd_from": "City A",
            "bkd_to": "City B",
            "bkd_date": "2023-12-19T15:30:00.000Z",
            "bkd_time": "08:00",
            "bkd_travelClass": "Sleeper",
            "modified": false,
            "cancellationDate": null,
            "cancellationReason": "",
            "status": "booked",
            "_id": "65815786e1751ead06a684c4"
        }
    ],
    "hotels": [
        {
            "violations": {
                "class": "Type C",
                "amount": "120 USD"
            },
            "bkd_violations": {
                "class": "Type C",
                "amount": "120 USD"
            },
            "itineraryId": "5fec83753a4959001771449c",
            "formId": "form125",
            "location": "Hotel ABC",
            "locationPreference": "Near Airport",
            "class": "Luxury",
            "checkIn": "2023-12-18T15:30:00.000Z",
            "checkOut": "2023-12-22T15:30:00.000Z",
            "bkd_location": "Hotel ABC",
            "bkd_class": "Luxury",
            "bkd_checkIn": "2023-12-18T15:30:00.000Z",
            "bkd_checkOut": "2023-12-22T15:30:00.000Z",
            "modified": false,
            "cancellationDate": "",
            "cancellationReason": "",
            "status": "booked",
            "_id": "65815786e1751ead06a684c5"
        },
        {
            "violations": {
                "class": "Type C",
                "amount": "120 USD"
            },
            "bkd_violations": {
                "class": "Type C",
                "amount": "120 USD"
            },
            "itineraryId": "5fec83753a4959001771449c",
            "formId": "form125",
            "location": "Hotel ABC",
            "locationPreference": "Near Airport",
            "class": "Luxury",
            "checkIn": "2023-12-18T15:30:00.000Z",
            "checkOut": "2023-12-22T15:30:00.000Z",
            "bkd_location": "Hotel ABC",
            "bkd_class": "Luxury",
            "bkd_checkIn": "2023-12-18T15:30:00.000Z",
            "bkd_checkOut": "2023-12-22T15:30:00.000Z",
            "modified": false,
            "cancellationDate": "",
            "cancellationReason": "",
            "status": "booked",
            "_id": "65815786e1751ead06a684c6"
        }
    ],
    "cabs": [
        {
            "violations": {
                "class": "Type B",
                "amount": "80 USD"
            },
            "bkd_violations": {
                "class": "Type B",
                "amount": "80 USD"
            },
            "itineraryId": "5fec83753a4959001771449b",
            "formId": "form124",
            "date": "2023-12-20T15:30:00.000Z",
            "class": "Sedan",
            "preferredTime": "10:00",
            "pickupAddress": "Address 1",
            "dropAddress": "Address 2",
            "bkd_date": "2023-12-20T15:30:00.000Z",
            "bkd_class": "Sedan",
            "bkd_preferredTime": "10:00",
            "bkd_pickupAddress": "Address 1",
            "bkd_dropAddress": "Address 2",
            "modified": false,
            "cancellationDate": "",
            "cancellationReason": "",
            "status": "booked",
            "type": "departure pickup",
            "_id": "65815786e1751ead06a684c7"
        }
    ]
},


isCashAdvanceTaken: true,
totalCashAmount: '5000', //totol paid cash advance
remainingCash: "2000",
companyDetails:{
  defaultCurrency:"USD",
  travelAllocationFlags:{
  level1:false,
  level2:true,
  level3:false
 }
 ,
 travelAllocations:{
   
   international: {
     allocation: [
         { headerName: "International Cost Center", headerValues: ["CC1", "CC2","CC3"] }
     ],
     expenseAllocation: [
       { headerName: "International Cost Center", headerValues: ["CC1", "CC2","CC3"] },
       { headerName: "international profit centre", headerValues: ["PC1", "PC2","PC3"] }
     ],
     allocation_accountLine: "International_Allocation_AccountLine_Value",
     expenseAllocation_accountLine: "International_Allocation_AccountLine_Value"
 },

 domestic: {
     allocation: [
         { headerName: "Domestic_Header", headerValues: ["Domestic_Value1", "Domestic_Value2"] }
     ],
     expenseAllocation: [
         { headerName: "Domestic_Header", headerValues: ["Domestic_Value1", "Domestic_Value2"] }
     ],
     allocation_accountLine: "Domestic_Allocation_AccountLine_Value",
     expenseAllocation_accountLine: "Domestic_Allocation_AccountLine_Value"
 },

 local: {
     allocation: [
         { headerName: "Local_Header", headerValues: ["Local_Value1", "Local_Value2"] }
     ],
     expenseAllocation: [
         { headerName: "Local_Header", headerValues: ["Local_Value1", "Local_Value2"] }
     ],
     allocation_accountLine: "Local_Allocation_AccountLine_Value",
     expenseAllocation_accountLine: "Local_Allocation_AccountLine_Value"
 },



 reimbursementCategories : [
   {
     categoryName: 'Office Supplies',

     fields: [
       { name:'Bill Date',type:'date'},
       { name:'Bill Number',type:'numeric'},
       { name:'Vender Name',type:'text'},
       { name: 'Description', type: 'text' },
       { name: 'Quantity', type: 'numeric' },
       { name: 'Unit Cost', type: 'numeric' },
       { name: 'Tax Amount', type: 'numeric' },
       { name: 'Total Amount', type: 'numeric' },      
     ]
   },
   {
     categoryName: 'Travel Expenses',   
       fields: [
         { name:'Bill Date',type:'date'},
         { name:'Bill Number',type:'numeric'},
         { name: 'Description', type: 'text' },
         { name: 'Quantity', type: 'numeric' },
         { name: 'Unit Cost', type: 'numeric' },
         { name: 'Total Amount', type: 'numeric' },      
       ]     
   },
 ],

 allocation_accountLine: "Allocation_AccountLine_Value",
 expenseAllocation_accountLine: "Allocation_AccountLine_Value",
 },

// travel expense & reimbursement categories  combine array is there

travelExpenseCategories:[
 {
   'international': [
     {
       categoryName: 'Flight',
       fields: [
         { name: 'Invoice Date', type: 'date' },
         { name: 'Flight number', type: 'text' },
         { name: 'Class of Service', type: 'text' },
         {name: 'Departure', type: 'text'},
         {name: 'Arrival', type: 'text'},
         { name: 'Airlines name', type: 'text' },
         { name: 'Travelers Name', type: 'text' },   
         { name: 'Booking Reference Number', type: 'text' },
         { name: 'Total Amount', type: 'amount' },
         { name: 'Tax Amount', type: 'amount' }
       ],
       modeOfTranfer: true,
       class: ['Economy', 'Premium Economy', 'Business', 'First Class'],   
     },
     {
       categoryName: 'Train',
       fields: [
         { name: 'Invoice Date', type: 'date' },
         { name: 'Origin', type: 'text' },
         { name: 'Destination', type: 'text' },
         { name: 'Travelers Name', type: 'text' },
         { name: 'Class of Service', type: 'text' },
         { name: 'Booking Reference No.', type: 'text' },
         { name: 'Total Amount', type: 'amount' },
         { name: 'Tax Amount', type: 'amount' },
         
       ],
       modeOfTranfer: true,
       class: ['First AC ', 'Second AC', 'Third AC', 'Sleeper', 'Chair Car'],
       
     },
     {
       categoryName: 'Bus',
       fields: [
         { name: 'Invoice Date', type: 'date' },
         { name: 'Origin', type: 'text' },
         { name: 'Destination', type: 'text' },
         { name: 'Travelers Name', type: 'text' },
         { name: 'Class of Service', type: 'text' },
         { name: 'Booking Reference No.', type: 'text' },
         { name: 'Total Amount', type: 'amount' },
         { name: 'Tax Amount', type: 'amount' },
     
       ],
       modeOfTranfer: true,
       class: ['Sleeper', 'Semi-Sleeper', 'Regular'],
       
     },
     {
       categoryName: 'Cab',
       fields: [
         { name: 'Date', type: 'date' },
         { name: 'Time', type: 'time' },
         { name: 'Class of Service', type: 'text' },
         { name: 'Pickup Location', type: 'text' },
         { name: 'DropOff Location', type: 'text' },
         { name: 'Total Fare', type: 'amount' },
         { name: 'Tax Amount', type: 'amount' },
         { name: 'Payment Method', type: 'text' },
         { name: 'Receipt No.', type: 'text' },
         { name: 'Ride Distance', type: 'text' }
       ],
       modeOfTranfer:true,
       class: ['Economy', 'Business', 'Executive'],
      
     },
     {
       categoryName: 'Cab Rental',
       fields: [
         { name: 'Date', type: 'date' },
         { name: 'Time', type: 'time' },
         { name: 'Class of Service', type: 'text' },
         { name: 'Pickup Location', type: 'text' },
         { name: 'DropOff Location', type: 'text' },    
         { name: 'Total Fare', type: 'amount' },
         { name: 'Tax Amount', type: 'amount' },
         { name: 'Payment Method', type: 'text' },
         { name: 'Receipt No.', type: 'text' },
         { name: 'Ride Distance', type: 'text' },
        
       ],
       modeOfTranfer:true,
       class: ['Economy', 'Business', 'Executive'],
       
     },
     {
       categoryName: 'Hotel',
       fields: [
         { name: 'Guest name', type: 'text' },
         { name: 'Hotel Name', type: 'text' },
         { name: 'Check in date', type: 'date' },
         { name: 'Check out date', type: 'date' },
         {name: 'City', type: 'text'},
         { name: 'Class', type: 'text' },
         { name: 'Room rates', type: 'amount' },
         { name: 'Tax amount', type: 'amount' },
         { name: 'Total amount', type: 'amount' },
         { name: 'Booking Reference No.', type: 'text' },
         { name: 'Payment Method', type: 'text' }
       ],
       modeOfTranfer:true,
       class: ['Motel', '3 star', '4 star', '5 star'],
     },
     {
       categoryName: 'Meals',
       fields: [
         { name: 'Bill Date', type: 'date' },
         { name: 'Bill Number', type: 'text' },
         { name: 'Vendor Name', type: 'text' },
         { name: 'Description', type: 'text' },
         { name: 'Quantity', type: 'number' },
         { name: 'Unit Cost', type: 'amount' },
         { name: 'Tax Amount', type: 'amount' },
         { name: 'Total Amount', type: 'amount' }
       ],
       modeOfTranfer:false,
   
     },
     {
       categoryName: 'Travel Reimbursement',
       fields: [
         { name: 'From', type: 'text' },
         { name: 'To', type: 'text' },
         { name: 'Distance', type: 'text' },
         { name: 'Bill Date', type: 'date' },
         { name: 'Bill Number', type: 'text' },
         { name: 'Vendor Name', type: 'text' },
         { name: 'Description', type: 'text' },
         { name: 'Quantity', type: 'number' },
         { name: 'Unit Cost', type: 'amount' },
         { name: 'Tax Amount', type: 'amount' },
         { name: 'Total Amount', type: 'amount' }
       ],
       modeOfTranfer:false,
     },
     {
       categoryName: 'Conference / Event',
       fields: [
         { name: 'Conference name', type: 'text' },
         { name: 'Conference date', type: 'date' },
         { name: 'Total amt', type: 'amount' },
         { name: 'Tax amt', type: 'amount' }
       ],
       modeOfTranfer:false,
   
     },
     {
       categoryName: 'Travel Insurance',
       fields: [
         { name: 'Policy type', type: 'text' },
         { name: 'Insurance provider', type: 'text' },
         { name: 'Premium amount', type: 'amount' }
       ],
       modeOfTranfer: false,
   
     },
     {
       categoryName: 'Baggage',
       fields: [
         { name: 'Airline name', type: 'text' },
         { name: 'Bill no.', type: 'text' },
         { name: 'Total amt', type: 'amount' },
         { name: 'Tax amt', type: 'amount' }
       ],
       modeOfTranfer:false,
     },
     {
       categoryName: 'Tips',
       fields: [
         { name: 'Purpose', type: 'text' },
         { name: 'Amt', type: 'amount' }
       ],
       modeOfTranfer:false,
       limit: null,
       currency: null,
     },
     {
       categoryName: 'Miscellaneous',
       fields: [
         { name: 'Bill Date', type: 'date' },
         { name: 'Bill Number', type: 'text' },
         { name: 'Vendor Name', type: 'text' },
         { name: 'Description', type: 'text' },
         { name: 'Quantity', type: 'number' },
         { name: 'Unit Cost', type: 'amount' },
         { name: 'Tax Amount', type: 'amount' },
         { name: 'Total Amount', type: 'amount' }
       ],
       modeOfTranfer:false,
     },
     {
       categoryName: 'Office Supplies',
       fields: [
         { name: 'Bill Date', type: 'date' },
         { name: 'Bill Number', type: 'text' },
         { name: 'Vendor Name', type: 'text' },
         { name: 'Description', type: 'text' },
         { name: 'Quantity', type: 'number' },
         { name: 'Unit Cost', type: 'amount' },
         { name: 'Tax Amount', type: 'amount' },
         { name: 'Total Amount', type: 'amount' }
       ],
       modeOfTranfer:false,
     },
     {
       categoryName: 'Utilities',
       fields: [
         { name: 'Type of Utilities', type: 'text' },
         { name: 'Bill Date', type: 'date' },
         { name: 'Bill Number', type: 'text' },
         { name: 'Vender Name', type: 'text' },
         { name: 'Description', type: 'text' },
         { name: 'Quantity', type: 'number' },
         { name: 'Unit Cost', type: 'amount' },
         { name: 'Tax Amount', type: 'amount' },
         { name: 'Total Amount', type: 'amount' }
       ],
       modeOfTranfer:false,
     },
     {
       categoryName: 'Insurance',
       fields: [
         { name: 'Policy type', type: 'text' },
         { name: 'Insurance provider', type: 'text' },
         { name: 'Premium amount', type: 'amount' }
       ],
       modeOfTranfer:false,
     },
     {
       categoryName: 'Marketing and Advertising',
       fields: [
         { name: 'Marketing campaign description', type: 'text' },
         { name: 'Advertising channels', type: 'text' },
         { name: 'Cost', type: 'amount' }
       ],
       modeOfTranfer:false,
     },
     {
       categoryName: 'Professional Fees',
       fields: [
         { name: 'Service provider', type: 'text' },
         { name: 'Nature of service', type: 'text' },
         { name: 'Cost', type: 'amount' }
       ],
       modeOfTranfer:false,
     },
     {
       categoryName: 'Software and Licenses',
       fields: [
         { name: 'Software name', type: 'text' },
         { name: 'License type', type: 'text' },
         { name: 'License cost', type: 'amount' }
       ],
       modeOfTranfer:false,
     },
     {
       categoryName: 'Equipment',
       fields: [
         { name: 'Item description', type: 'text' },
         { name: 'Quantity', type: 'number' },
         { name: 'Unit cost', type: 'amount' },
         { name: 'Total cost', type: 'amount' }
       ],
       modeOfTranfer:false,
     },
     {
       categoryName: 'Repairs and Maintenance',
       fields: [
         { name: 'Description of repair/maintenance work', type: 'text' },
         { name: 'Service provider', type: 'text' },
         { name: 'Cost', type: 'amount' }
       ],
       modeOfTranfer:false,
     },
     {
       categoryName: 'Legal and Compliance',
       fields: [
         { name: 'Firm name', type: 'text' },
         { name: 'Description', type: 'text' },
         { name: 'Service name', type: 'text' },
         { name: 'Tax amt', type: 'amount' },
         { name: 'Total amt', type: 'amount' }
       ],
       modeOfTranfer:false,
     },
     {
       categoryName: 'Communication',
       fields: [
         { name: 'Bill no. service provider', type: 'text' },
         { name: 'Bill date', type: 'date' },
         { name: 'Tax amt', type: 'amount' },
         { name: 'Total amt', type: 'amount' }
       ],
       modeOfTranfer:false,
     },
     {
       categoryName: 'Research and Development',
       fields: [
         { name: 'Research project description', type: 'text' },
         { name: 'Cost', type: 'amount' }
       ],
       modeOfTranfer:false,
     },
     {
       categoryName: 'Training',
       fields: [
         { name: 'Training program description', type: 'text' },
         { name: 'Trainer', type: 'text' },
         { name: 'Cost', type: 'amount' }
       ],
       modeOfTranfer:false,
     },
     {
       categoryName: 'Software Subscriptions',
       fields: [
         { name: 'Software name', type: 'text' },
         { name: 'Subscription type', type: 'text' },
         { name: 'Subscription cost', type: 'amount' }
       ],
       modeOfTranfer:false,
     },
     {
       categoryName: 'Client entertainment',
       fields: [
         { name: 'Bill and cost', type: 'text' }
       ],
       modeOfTranfer:false,
     },
     {
       categoryName: 'Client gift',
       fields: [
         { name: 'Bill and cost', type: 'text' }
       ],
       modeOfTranfer:false,
     }
     ]
},
{
   'domestic': [
       {
         categoryName: "foods",
         fields: [
             { name:'Bill Date',type:'date'},
             { name:'Bill Number',type:'numeric'},
             { name:'Vender Name',type:'text'},
             { name: 'Description', type: 'text' },
             { name: 'Quantity', type: 'numeric' },
             { name: 'Unit Cost', type: 'numeric' },
             { name: 'Tax Amount', type: 'numeric' },
             { name: 'Total Amount', type: 'numeric' },      
           ] 
       }
   ]
},
{
   'local': [
       {
         categoryName: "foods",
         fields: [
             { name:'Bill Date',type:'date'},
             { name:'Bill Number',type:'numeric'},
             { name:'Vender Name',type:'text'},
             { name: 'Description', type: 'text' },
             { name: 'Quantity', type: 'numeric' },
             { name: 'Unit Cost', type: 'numeric' },
             { name: 'Tax Amount', type: 'numeric' },
             { name: 'Total Amount', type: 'numeric' },      
           ] 
       }
   ]
}
]
 ,
  expenseSettlementOptions : {
    Cash: true,
    Cheque: false,
    'Salary Account': true,
    'Prepaid Card': false,
    'NEFT Bank Transfer': true
}

}

}





//level2 data this is for separate page level2
export const bookAnExpenseDataLevel2= {
  tripId:'tripidflkjdslfk',
  tripPurpose:'Trip for Investor Meeting',
  newExpenseReport: true,
  expenseReportNumber: 'ExpenseNo.s7987979',
  alreadyBookedExpense: {
    "formState": [
        {
            "transfers": {
                "needsDeparturePickup": true,
                "needsDepartureDrop": true,
                "needsReturnPickup": false,
                "needsReturnDrop": true
            },
            "formId": "form123",
            "needsHotel": true,
            "needsCab": false,
            "needsVisa": true,
            "cancellationDate": " ",
            "cancellationReason": "Change in travel plans",
            "formStatus": "Submitted",
            "_id": "65815786e1751ead06a684c2"
        }
    ],

    "flights": [
        {
            "violations": {
                "class": "Type A",
                "amount": "100 USD"
            },
            "bkd_violations": {
                "class": "Type A",
                "amount": "100 USD"
            },
            "itineraryId": "5fec83753a4959001771449a",
            "formId": "form123",
            "from": "Mumbai",
            "to": "Delhi",
            "date": "2023-12-16T15:30:00.000Z",
            "time": "11:00",
            "travelClass": "Business Class",
            "bkd_from": "Mumbai",
            "bkd_to": "Delhi",
            "bkd_date": "2023-12-21T15:30:00.000Z",
            "bkd_time": "12:20",
            "bkd_travelClass": "Business Class",
            "modified": false,
            "cancellationDate": null,
            "cancellationReason": "Flight canceled by airline",
            "status": "booked",
            "_id": "65815786e1751ead06a684c3"
        }
    ],
    "buses": [
        {
            "violations": {
                "class": "Type D",
                "amount": "70 USD"
            },
            "itineraryId": "5fec83753a4959001771449d",
            "formId": "form126",
            "from": "City A",
            "to": "City B",
            "date": "2023-12-19T15:30:00.000Z",
            "time": "08:00",
            "travelClass": "Sleeper",
            "bkd_from": "City A",
            "bkd_to": "City B",
            "bkd_date": "2023-12-19T15:30:00.000Z",
            "bkd_time": "08:00",
            "bkd_travelClass": "Sleeper",
            "modified": false,
            "cancellationDate": null,
            "cancellationReason": "",
            "status": "booked",
            "_id": "65815786e1751ead06a684c4"
        }
    ],
    "hotels": [
        {
            "violations": {
                "class": "Type C",
                "amount": "120 USD"
            },
            "bkd_violations": {
                "class": "Type C",
                "amount": "120 USD"
            },
            "itineraryId": "5fec83753a4959001771449c",
            "formId": "form125",
            "location": "Hotel ABC",
            "locationPreference": "Near Airport",
            "class": "Luxury",
            "checkIn": "2023-12-18T15:30:00.000Z",
            "checkOut": "2023-12-22T15:30:00.000Z",
            "bkd_location": "Hotel ABC",
            "bkd_class": "Luxury",
            "bkd_checkIn": "2023-12-18T15:30:00.000Z",
            "bkd_checkOut": "2023-12-22T15:30:00.000Z",
            "modified": false,
            "cancellationDate": "",
            "cancellationReason": "",
            "status": "booked",
            "_id": "65815786e1751ead06a684c5"
        },
        {
            "violations": {
                "class": "Type C",
                "amount": "120 USD"
            },
            "bkd_violations": {
                "class": "Type C",
                "amount": "120 USD"
            },
            "itineraryId": "5fec83753a4959001771449c",
            "formId": "form125",
            "location": "Hotel ABC",
            "locationPreference": "Near Airport",
            "class": "Luxury",
            "checkIn": "2023-12-18T15:30:00.000Z",
            "checkOut": "2023-12-22T15:30:00.000Z",
            "bkd_location": "Hotel ABC",
            "bkd_class": "Luxury",
            "bkd_checkIn": "2023-12-18T15:30:00.000Z",
            "bkd_checkOut": "2023-12-22T15:30:00.000Z",
            "modified": false,
            "cancellationDate": "",
            "cancellationReason": "",
            "status": "booked",
            "_id": "65815786e1751ead06a684c6"
        }
    ],
    "cabs": [
        {
            "violations": {
                "class": "Type B",
                "amount": "80 USD"
            },
            "bkd_violations": {
                "class": "Type B",
                "amount": "80 USD"
            },
            "itineraryId": "5fec83753a4959001771449b",
            "formId": "form124",
            "date": "2023-12-20T15:30:00.000Z",
            "class": "Sedan",
            "preferredTime": "10:00",
            "pickupAddress": "Address 1",
            "dropAddress": "Address 2",
            "bkd_date": "2023-12-20T15:30:00.000Z",
            "bkd_class": "Sedan",
            "bkd_preferredTime": "10:00",
            "bkd_pickupAddress": "Address 1",
            "bkd_dropAddress": "Address 2",
            "modified": false,
            "cancellationDate": "",
            "cancellationReason": "",
            "status": "booked",
            "type": "departure pickup",
            "_id": "65815786e1751ead06a684c7"
        }
    ]
},


isCashAdvanceTaken: true,
totalCashAmount: '5000', //totol paid cash advance
remainingCash: "2000",
companyDetails:{
  defaultCurrency:"USD",
  travelAllocationFlags:{
  level1:false,
  level2:true,
  level3:false
 }
,
  travelAllocations:{
    
    international: {
      allocation: [
          { headerName: "International Cost Center", headerValues: ["CC1", "CC2","CC3"] }
      ],
      expenseAllocation: [
        { headerName: "International Cost Center", headerValues: ["CC1", "CC2","CC3"] },
        { headerName: "international profit centre", headerValues: ["PC1", "PC2","PC3"] }
      ],
      allocation_accountLine: "International_Allocation_AccountLine_Value",
      expenseAllocation_accountLine: "International_Allocation_AccountLine_Value"
  },

  domestic: {
      allocation: [
          { headerName: "Domestic_Header", headerValues: ["Domestic_Value1", "Domestic_Value2"] }
      ],
      expenseAllocation: [
          { headerName: "Domestic_Header", headerValues: ["Domestic_Value1", "Domestic_Value2"] }
      ],
      allocation_accountLine: "Domestic_Allocation_AccountLine_Value",
      expenseAllocation_accountLine: "Domestic_Allocation_AccountLine_Value"
  },

  local: {
      allocation: [
          { headerName: "Local_Header", headerValues: ["Local_Value1", "Local_Value2"] }
      ],
      expenseAllocation: [
          { headerName: "Local_Header", headerValues: ["Local_Value1", "Local_Value2"] }
      ],
      allocation_accountLine: "Local_Allocation_AccountLine_Value",
      expenseAllocation_accountLine: "Local_Allocation_AccountLine_Value"
  },



  reimbursementCategories : [
    {
      categoryName: 'Office Supplies',
     
      fields: [
        { name:'Bill Date',type:'date'},
        { name:'Bill Number',type:'numeric'},
        { name:'Vender Name',type:'text'},
        { name: 'Description', type: 'text' },
        { name: 'Quantity', type: 'numeric' },
        { name: 'Unit Cost', type: 'numeric' },
        { name: 'Tax Amount', type: 'numeric' },
        { name: 'Total Amount', type: 'numeric' },      
      ]
    },
    {
      categoryName: 'Travel Expenses',   
        fields: [
          { name:'Bill Date',type:'date'},
          { name:'Bill Number',type:'numeric'},
          { name: 'Description', type: 'text' },
          { name: 'Quantity', type: 'numeric' },
          { name: 'Unit Cost', type: 'numeric' },
          { name: 'Total Amount', type: 'numeric' },      
        ]     
    },
  ],

  allocation_accountLine: "Allocation_AccountLine_Value",
  expenseAllocation_accountLine: "Allocation_AccountLine_Value",
  },

// travel expense & reimbursement categories  combine array is there

travelExpenseCategories:[
  {
    'international': [
  
      {
        categoryName: 'Flight',
        fields: [
          { name: 'Invoice Date', type: 'date' },
          { name: 'Flight number', type: 'text' },
          { name: 'Class of Service', type: 'text' },
          {name: 'Departure', type: 'text'},
          {name: 'Arrival', type: 'text'},
          { name: 'Airlines name', type: 'text' },
          { name: 'Travelers Name', type: 'text' },   
          { name: 'Booking Reference Number', type: 'text' },
          { name: 'Total Amount', type: 'amount' },
          { name: 'Tax Amount', type: 'amount' }
        ],
        modeOfTranfer: true,
        class: ['Economy', 'Premium Economy', 'Business', 'First Class'],   
      
      },
      {
        categoryName: 'Train',
        fields: [
          { name: 'Invoice Date', type: 'date' },
          { name: 'Origin', type: 'text' },
          { name: 'Destination', type: 'text' },
          { name: 'Travelers Name', type: 'text' },
          { name: 'Class of Service', type: 'text' },
          { name: 'Booking Reference No.', type: 'text' },
          { name: 'Total Amount', type: 'amount' },
          { name: 'Tax Amount', type: 'amount' },
          
        ],
        modeOfTranfer: true,
        class: ['First AC ', 'Second AC', 'Third AC', 'Sleeper', 'Chair Car'],
        
      },
      {
        categoryName: 'Bus',
        fields: [
          { name: 'Invoice Date', type: 'date' },
          { name: 'Origin', type: 'text' },
          { name: 'Destination', type: 'text' },
          { name: 'Travelers Name', type: 'text' },
          { name: 'Class of Service', type: 'text' },
          { name: 'Booking Reference No.', type: 'text' },
          { name: 'Total Amount', type: 'amount' },
          { name: 'Tax Amount', type: 'amount' },
      
        ],
        modeOfTranfer: true,
        class: ['Sleeper', 'Semi-Sleeper', 'Regular'],
        
      },
      {
        categoryName: 'Cab',
        fields: [
          { name: 'Date', type: 'date' },
          { name: 'Time', type: 'time' },
          { name: 'Class of Service', type: 'text' },
          { name: 'Pickup Location', type: 'text' },
          { name: 'DropOff Location', type: 'text' },
          { name: 'Total Fare', type: 'amount' },
          { name: 'Tax Amount', type: 'amount' },
          { name: 'Payment Method', type: 'text' },
          { name: 'Receipt No.', type: 'text' },
          { name: 'Ride Distance', type: 'text' }
        ],
        modeOfTranfer:true,
        class: ['Economy', 'Business', 'Executive'],
       
      },
      {
        categoryName: 'Cab Rental',
        fields: [
          { name: 'Date', type: 'date' },
          { name: 'Time', type: 'time' },
          { name: 'Class of Service', type: 'text' },
          { name: 'Pickup Location', type: 'text' },
          { name: 'DropOff Location', type: 'text' },    
          { name: 'Total Fare', type: 'amount' },
          { name: 'Tax Amount', type: 'amount' },
          { name: 'Payment Method', type: 'text' },
          { name: 'Receipt No.', type: 'text' },
          { name: 'Ride Distance', type: 'text' },
         
        ],
        modeOfTranfer:true,
        class: ['Economy', 'Business', 'Executive'],
        
      },
      {
        categoryName: 'Hotel',
        fields: [
          { name: 'Guest name', type: 'text' },
          { name: 'Hotel Name', type: 'text' },
          { name: 'Check in date', type: 'date' },
          { name: 'Check out date', type: 'date' },
          {name: 'City', type: 'text'},
          { name: 'Class', type: 'text' },
          { name: 'Room rates', type: 'amount' },
          { name: 'Tax amount', type: 'amount' },
          { name: 'Total amount', type: 'amount' },
          { name: 'Booking Reference No.', type: 'text' },
          { name: 'Payment Method', type: 'text' }
        ],
        modeOfTranfer:true,
        class: ['Motel', '3 star', '4 star', '5 star'],
      },
      {
        categoryName: 'Meals',
        fields: [
          { name: 'Bill Date', type: 'date' },
          { name: 'Bill Number', type: 'text' },
          { name: 'Vendor Name', type: 'text' },
          { name: 'Description', type: 'text' },
          { name: 'Quantity', type: 'number' },
          { name: 'Unit Cost', type: 'amount' },
          { name: 'Tax Amount', type: 'amount' },
          { name: 'Total Amount', type: 'amount' }
        ],
        modeOfTranfer:false,
    
      },
      {
        categoryName: 'Travel Reimbursement',
        fields: [
          { name: 'From', type: 'text' },
          { name: 'To', type: 'text' },
          { name: 'Distance', type: 'text' },
          { name: 'Bill Date', type: 'date' },
          { name: 'Bill Number', type: 'text' },
          { name: 'Vendor Name', type: 'text' },
          { name: 'Description', type: 'text' },
          { name: 'Quantity', type: 'number' },
          { name: 'Unit Cost', type: 'amount' },
          { name: 'Tax Amount', type: 'amount' },
          { name: 'Total Amount', type: 'amount' }
        ],
        modeOfTranfer:false,
      },
      {
        categoryName: 'Conference / Event',
        fields: [
          { name: 'Conference name', type: 'text' },
          { name: 'Conference date', type: 'date' },
          { name: 'Total amt', type: 'amount' },
          { name: 'Tax amt', type: 'amount' }
        ],
        modeOfTranfer:false,
    
      },
      {
        categoryName: 'Travel Insurance',
        fields: [
          { name: 'Policy type', type: 'text' },
          { name: 'Insurance provider', type: 'text' },
          { name: 'Premium amount', type: 'amount' }
        ],
        modeOfTranfer: false,
    
      },
      {
        categoryName: 'Baggage',
        fields: [
          { name: 'Airline name', type: 'text' },
          { name: 'Bill no.', type: 'text' },
          { name: 'Total amt', type: 'amount' },
          { name: 'Tax amt', type: 'amount' }
        ],
        modeOfTranfer:false,
      },
      {
        categoryName: 'Tips',
        fields: [
          { name: 'Purpose', type: 'text' },
          { name: 'Amt', type: 'amount' }
        ],
        modeOfTranfer:false,
        limit: null,
        currency: null,
      },
      {
        categoryName: 'Miscellaneous',
        fields: [
          { name: 'Bill Date', type: 'date' },
          { name: 'Bill Number', type: 'text' },
          { name: 'Vendor Name', type: 'text' },
          { name: 'Description', type: 'text' },
          { name: 'Quantity', type: 'number' },
          { name: 'Unit Cost', type: 'amount' },
          { name: 'Tax Amount', type: 'amount' },
          { name: 'Total Amount', type: 'amount' }
        ],
        modeOfTranfer:false,
      },
      {
        categoryName: 'Office Supplies',
        fields: [
          { name: 'Bill Date', type: 'date' },
          { name: 'Bill Number', type: 'text' },
          { name: 'Vendor Name', type: 'text' },
          { name: 'Description', type: 'text' },
          { name: 'Quantity', type: 'number' },
          { name: 'Unit Cost', type: 'amount' },
          { name: 'Tax Amount', type: 'amount' },
          { name: 'Total Amount', type: 'amount' }
        ],
        modeOfTranfer:false,
      },
      {
        categoryName: 'Utilities',
        fields: [
          { name: 'Type of Utilities', type: 'text' },
          { name: 'Bill Date', type: 'date' },
          { name: 'Bill Number', type: 'text' },
          { name: 'Vender Name', type: 'text' },
          { name: 'Description', type: 'text' },
          { name: 'Quantity', type: 'number' },
          { name: 'Unit Cost', type: 'amount' },
          { name: 'Tax Amount', type: 'amount' },
          { name: 'Total Amount', type: 'amount' }
        ],
        modeOfTranfer:false,
      },
      {
        categoryName: 'Insurance',
        fields: [
          { name: 'Policy type', type: 'text' },
          { name: 'Insurance provider', type: 'text' },
          { name: 'Premium amount', type: 'amount' }
        ],
        modeOfTranfer:false,
      },
      {
        categoryName: 'Marketing and Advertising',
        fields: [
          { name: 'Marketing campaign description', type: 'text' },
          { name: 'Advertising channels', type: 'text' },
          { name: 'Cost', type: 'amount' }
        ],
        modeOfTranfer:false,
      },
      {
        categoryName: 'Professional Fees',
        fields: [
          { name: 'Service provider', type: 'text' },
          { name: 'Nature of service', type: 'text' },
          { name: 'Cost', type: 'amount' }
        ],
        modeOfTranfer:false,
      },
      {
        categoryName: 'Software and Licenses',
        fields: [
          { name: 'Software name', type: 'text' },
          { name: 'License type', type: 'text' },
          { name: 'License cost', type: 'amount' }
        ],
        modeOfTranfer:false,
      },
      {
        categoryName: 'Equipment',
        fields: [
          { name: 'Item description', type: 'text' },
          { name: 'Quantity', type: 'number' },
          { name: 'Unit cost', type: 'amount' },
          { name: 'Total cost', type: 'amount' }
        ],
        modeOfTranfer:false,
      },
      {
        categoryName: 'Repairs and Maintenance',
        fields: [
          { name: 'Description of repair/maintenance work', type: 'text' },
          { name: 'Service provider', type: 'text' },
          { name: 'Cost', type: 'amount' }
        ],
        modeOfTranfer:false,
      },
      {
        categoryName: 'Legal and Compliance',
        fields: [
          { name: 'Firm name', type: 'text' },
          { name: 'Description', type: 'text' },
          { name: 'Service name', type: 'text' },
          { name: 'Tax amt', type: 'amount' },
          { name: 'Total amt', type: 'amount' }
        ],
        modeOfTranfer:false,
      },
      {
        categoryName: 'Communication',
        fields: [
          { name: 'Bill no. service provider', type: 'text' },
          { name: 'Bill date', type: 'date' },
          { name: 'Tax amt', type: 'amount' },
          { name: 'Total amt', type: 'amount' }
        ],
        modeOfTranfer:false,
      },
      {
        categoryName: 'Research and Development',
        fields: [
          { name: 'Research project description', type: 'text' },
          { name: 'Cost', type: 'amount' }
        ],
        modeOfTranfer:false,
      },
      {
        categoryName: 'Training',
        fields: [
          { name: 'Training program description', type: 'text' },
          { name: 'Trainer', type: 'text' },
          { name: 'Cost', type: 'amount' }
        ],
        modeOfTranfer:false,
      },
      {
        categoryName: 'Software Subscriptions',
        fields: [
          { name: 'Software name', type: 'text' },
          { name: 'Subscription type', type: 'text' },
          { name: 'Subscription cost', type: 'amount' }
        ],
        modeOfTranfer:false,
      },
      {
        categoryName: 'Client entertainment',
        fields: [
          { name: 'Bill and cost', type: 'text' }
        ],
        modeOfTranfer:false,
      },
      {
        categoryName: 'Client gift',
        fields: [
          { name: 'Bill and cost', type: 'text' }
        ],
        modeOfTranfer:false,
      }
    
    
    
    
    
    
    
    
    
    
    
      ///data get for nontravel expense after select the category
      
        // {
        //   categoryName: 'Flight',
        //   fields: [
        //     { name: 'Date of Travel', type: 'date' },
        //     { name: 'Flight number', type: 'text' },
        //     {name: 'Departure', type: 'text'},
        //     {name: 'Arrival', type: 'text'},
        //     { name: 'Airlines name', type: 'text' },
        //     { name: 'Travelers Name', type: 'text' },
        //     { name: 'Class of Service', type: 'text' },
        //     { name: 'Booking Reference Number', type: 'text' },
        //     { name: 'Total Amount', type: 'amount' },
        //     { name: 'Tax Amount', type: 'amount' }
        //   ],
        //   modeOfTranfer: true,
        //   class: ['Economy', 'Premium Economy', 'Business', 'First Class'],
          
        // },
        // {
        //   categoryName: 'Train',
        //   fields: [
        //     { name: 'Date of Travel', type: 'date' },
        //     { name: 'From', type: 'text' },
        //     { name: 'To', type: 'text' },
        //     { name: 'Travelers Name', type: 'text' },
        //     { name: 'Class of Service', type: 'text' },
        //     { name: 'Booking Reference No.', type: 'text' },
        //     { name: 'Total Amount', type: 'amount' },
        //     { name: 'Tax Amount', type: 'amount' }
        //   ],
        //   modeOfTranfer: true,
        //   class: ['First AC ', 'Second AC', 'Third AC', 'Sleeper', 'Chair Car'],
          
        // },
        // {
        //   categoryName: 'Bus',
        //   fields: [
        //     { name: 'Date of Travel', type: 'date' },
        //     { name: 'From', type: 'text' },
        //     { name: 'To', type: 'text' },
        //     { name: 'Travelers Name', type: 'text' },
        //     { name: 'Class of Service', type: 'text' },
        //     { name: 'Booking Reference No.', type: 'text' },
        //     { name: 'Total Amount', type: 'amount' },
        //     { name: 'Tax Amount', type: 'amount' }
        //   ],
        //   modeOfTranfer: true,
        //   class: ['Sleeper', 'Semi-Sleeper', 'Regular'],
          
        // },
        // {
        //   categoryName: 'Cab',
        //   fields: [
        //     { name: 'Date & Time', type: 'date' },
        //     { name: 'Pickup Location', type: 'text' },
        //     { name: 'DropOff Location', type: 'text' },
        //     { name: 'Total Fare', type: 'amount' },
        //     { name: 'Tax Amount', type: 'amount' },
        //     { name: 'Payment Method', type: 'text' },
        //     { name: 'Receipt No.', type: 'text' },
        //     { name: 'Ride Distance & Duration', type: 'text' }
        //   ],
        //   modeOfTranfer:true,
        //   class: ['Sedan', 'Mini', 'SUV'],
         
        // },
        // {
        //   categoryName: 'Cab Rental',
        //   fields: [
        //     { name: 'Date & Time', type: 'date' },
        //     { name: 'Pickup Location', type: 'text' },
        //     { name: 'DropOff Location', type: 'text' },
        //     { name: 'Total Fare', type: 'amount' },
        //     { name: 'Tax Amount', type: 'amount' },
        //     { name: 'Payment Method', type: 'text' },
        //     { name: 'Receipt No.', type: 'text' },
        //     { name: 'Ride Distance & Duration', type: 'text' }
        //   ],
        //   modeOfTranfer:true,
        //   class: ['Sedan', 'Miini', 'SUV'],
          
        // },
        // {
        //   categoryName: 'Hotel',
        //   fields: [
        //     { name: 'Hotel Name', type: 'text' },
        //     { name: 'Check in date', type: 'date' },
        //     { name: 'Check out date', type: 'date' },
        //     {name: 'City', type: 'text'},
        //     { name: 'Room rates', type: 'amount' },
        //     { name: 'Tax amount , Total amount', type: 'amount' },
        //     { name: 'Guest name', type: 'text' },
        //     { name: 'Booking Reference No.', type: 'text' },
        //     { name: 'Payment Method', type: 'text' }
        //   ],
        //   modeOfTranfer:false,
        //   class: ['Motel', '3 star', '4 star', '5 star'],
          
        // },
        // {
        //   categoryName: 'Meals',
        //   fields: [
        //     { name: 'Bill Date', type: 'date' },
        //     { name: 'Bill Number', type: 'text' },
        //     { name: 'Vendor Name', type: 'text' },
        //     { name: 'Description', type: 'text' },
        //     { name: 'Quantity', type: 'number' },
        //     { name: 'Unit Cost', type: 'amount' },
        //     { name: 'Tax Amount', type: 'amount' },
        //     { name: 'Total Amount', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
    
        // },
        // {
        //     categoryName: 'Travel Reimbursement',
        //     fields: [
        //       { name: 'From', type: 'text' },
        //       { name: 'To', type: 'text' },
        //       { name: 'Distance', type: 'text' },
        //       { name: 'Bill Date', type: 'date' },
        //       { name: 'Bill Number', type: 'text' },
        //       { name: 'Vendor Name', type: 'text' },
        //       { name: 'Description', type: 'text' },
        //       { name: 'Quantity', type: 'number' },
        //       { name: 'Unit Cost', type: 'amount' },
        //       { name: 'Tax Amount', type: 'amount' },
        //       { name: 'Total Amount', type: 'amount' }
        //     ],
        //     modeOfTranfer:false,
      
        //   },
        // {
        //   categoryName: 'Conference / Event',
        //   fields: [
        //     { name: 'Conference name', type: 'text' },
        //     { name: 'Conference date', type: 'date' },
        //     { name: 'Total amt', type: 'amount' },
        //     { name: 'Tax amt', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
    
        // },
        // {
        //   categoryName: 'Travel Insurance',
        //   fields: [
        //     { name: 'Policy type', type: 'text' },
        //     { name: 'Insurance provider', type: 'text' },
        //     { name: 'Premium amount', type: 'amount' }
        //   ],
        //   modeOfTranfer: false,
    
        // },
        // {
        //   categoryName: 'Baggage',
        //   fields: [
        //     { name: 'Airline name', type: 'text' },
        //     { name: 'Bill no.', type: 'text' },
        //     { name: 'Total amt', type: 'amount' },
        //     { name: 'Tax amt', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
        // },
        // {
        //   categoryName: 'Tips',
        //   fields: [
        //     { name: 'Purpose', type: 'text' },
        //     { name: 'Amt', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
        //   limit: null,
        //   currency: null,
        // },
        // {
        //   categoryName: 'Miscellaneous',
        //   fields: [
        //     { name: 'Bill Date', type: 'date' },
        //     { name: 'Bill Number', type: 'text' },
        //     { name: 'Vendor Name', type: 'text' },
        //     { name: 'Description', type: 'text' },
        //     { name: 'Quantity', type: 'number' },
        //     { name: 'Unit Cost', type: 'amount' },
        //     { name: 'Tax Amount', type: 'amount' },
        //     { name: 'Total Amount', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
        // },
        // {
        //   categoryName: 'Office Supplies',
        //   fields: [
        //     { name: 'Bill Date', type: 'date' },
        //     { name: 'Bill Number', type: 'text' },
        //     { name: 'Vendor Name', type: 'text' },
        //     { name: 'Description', type: 'text' },
        //     { name: 'Quantity', type: 'number' },
        //     { name: 'Unit Cost', type: 'amount' },
        //     { name: 'Tax Amount', type: 'amount' },
        //     { name: 'Total Amount', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
        // },
        // {
        //   categoryName: 'Utilities',
        //   fields: [
        //     { name: 'Type of Utilities', type: 'text' },
        //     { name: 'Bill Date', type: 'date' },
        //     { name: 'Bill Number', type: 'text' },
        //     { name: 'Vender Name', type: 'text' },
        //     { name: 'Description', type: 'text' },
        //     { name: 'Quantity', type: 'number' },
        //     { name: 'Unit Cost', type: 'amount' },
        //     { name: 'Tax Amount', type: 'amount' },
        //     { name: 'Total Amount', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
        // },
        // {
        //   categoryName: 'Insurance',
        //   fields: [
        //     { name: 'Policy type', type: 'text' },
        //     { name: 'Insurance provider', type: 'text' },
        //     { name: 'Premium amount', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
        // },
        // {
        //   categoryName: 'Marketing and Advertising',
        //   fields: [
        //     { name: 'Marketing campaign description', type: 'text' },
        //     { name: 'Advertising channels', type: 'text' },
        //     { name: 'Cost', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
        // },
        // {
        //   categoryName: 'Professional Fees',
        //   fields: [
        //     { name: 'Service provider', type: 'text' },
        //     { name: 'Nature of service', type: 'text' },
        //     { name: 'Cost', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
        // },
        // {
        //   categoryName: 'Software and Licenses',
        //   fields: [
        //     { name: 'Software name', type: 'text' },
        //     { name: 'License type', type: 'text' },
        //     { name: 'License cost', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
        // },
        // {
        //   categoryName: 'Equipment',
        //   fields: [
        //     { name: 'Item description', type: 'text' },
        //     { name: 'Quantity', type: 'number' },
        //     { name: 'Unit cost', type: 'amount' },
        //     { name: 'Total cost', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
        // },
        // {
        //   categoryName: 'Repairs and Maintenance',
        //   fields: [
        //     { name: 'Description of repair/maintenance work', type: 'text' },
        //     { name: 'Service provider', type: 'text' },
        //     { name: 'Cost', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
        // },
        // {
        //   categoryName: 'Legal and Compliance',
        //   fields: [
        //     { name: 'Firm name', type: 'text' },
        //     { name: 'Description', type: 'text' },
        //     { name: 'Service name', type: 'text' },
        //     { name: 'Tax amt', type: 'amount' },
        //     { name: 'Total amt', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
        // },
        // {
        //   categoryName: 'Communication',
        //   fields: [
        //     { name: 'Bill no. service provider', type: 'text' },
        //     { name: 'Bill date', type: 'date' },
        //     { name: 'Tax amt', type: 'amount' },
        //     { name: 'Total amt', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
        // },
        // {
        //   categoryName: 'Research and Development',
        //   fields: [
        //     { name: 'Research project description', type: 'text' },
        //     { name: 'Cost', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
        // },
        // {
        //   categoryName: 'Training',
        //   fields: [
        //     { name: 'Training program description', type: 'text' },
        //     { name: 'Trainer', type: 'text' },
        //     { name: 'Cost', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
        // },
        // {
        //   categoryName: 'Software Subscriptions',
        //   fields: [
        //     { name: 'Software name', type: 'text' },
        //     { name: 'Subscription type', type: 'text' },
        //     { name: 'Subscription cost', type: 'amount' }
        //   ],
        //   modeOfTranfer:false,
        // },
        // {
        //   categoryName: 'Client entertainment',
        //   fields: [
        //     { name: 'Bill and cost', type: 'text' }
        //   ],
        //   modeOfTranfer:false,
        // },
        // {
        //   categoryName: 'Client gift',
        //   fields: [
        //     { name: 'Bill and cost', type: 'text' }
        //   ],
        //   modeOfTranfer:false,
        // }
      ]
},
{
    'domestic': [
        {
          categoryName: "foods",
          fields: [
              { name:'Bill Date',type:'date'},
              { name:'Bill Number',type:'numeric'},
              { name:'Vender Name',type:'text'},
              { name: 'Description', type: 'text' },
              { name: 'Quantity', type: 'numeric' },
              { name: 'Unit Cost', type: 'numeric' },
              { name: 'Tax Amount', type: 'numeric' },
              { name: 'Total Amount', type: 'numeric' },      
            ] 
        }
    ]
},
{
    'local': [
        {
          categoryName: "foods",
          fields: [
              { name:'Bill Date',type:'date'},
              { name:'Bill Number',type:'numeric'},
              { name:'Vender Name',type:'text'},
              { name: 'Description', type: 'text' },
              { name: 'Quantity', type: 'numeric' },
              { name: 'Unit Cost', type: 'numeric' },
              { name: 'Tax Amount', type: 'numeric' },
              { name: 'Total Amount', type: 'numeric' },      
            ] 
        }
    ]
}
]
 ,
  expenseSettlementOptions : {
    Cash: true,
    Cheque: false,
    'Salary Account': true,
    'Prepaid Card': false,
    'NEFT Bank Transfer': true
}

}

}


///this is for non trave expeense after select the category
export const reimbursementAfterCategory = {

  
    reimbursementAllocation: [
      {
        headerName: 'Cost Center',
        headerValues: ['CC 1', 'CC 2']
      },
      {
        headerName: 'profit centre',
        headerValues: ['PC 1', 'PC 2']
      }
    ],

  
  
      fields: [
        { name:'Bill Date',type:'date'},
        { name:'Bill Number',type:'numeric'},
        { name: 'Description', type: 'text' },
        { name: 'Quantity', type: 'numeric' },
        { name: 'Unit Cost', type: 'numeric' },
        { name: 'Total Amount', type: 'numeric' },      
      ]
    
  
}













export const travelExpenseAllocations = {
  // LEVEL1 Structure
  allocation: [
      { headerName: "Level1_Header", headerValues: ["Value1", "Value2"] }
  ],
  expenseAllocation: [
      { headerName: "Level1_Header", headerValues: ["Value1", "Value2"] }
  ],
  allocation_accountLine: "Allocation_AccountLine_Value",
  expenseAllocation_accountLine: "Allocation_AccountLine_Value",

  // LEVEL2 Structure
  international: {
      allocation: [
          { headerName: "International_Header", headerValues: ["International_Value1", "International_Value2"] }
      ],
      expenseAllocation: [
          { headerName: "International_Header", headerValues: ["International_Value1", "International_Value2"] }
      ],
      allocation_accountLine: "International_Allocation_AccountLine_Value",
      expenseAllocation_accountLine: "International_Allocation_AccountLine_Value"
  },

  domestic: {
      allocation: [
          { headerName: "Domestic_Header", headerValues: ["Domestic_Value1", "Domestic_Value2"] }
      ],
      expenseAllocation: [
          { headerName: "Domestic_Header", headerValues: ["Domestic_Value1", "Domestic_Value2"] }
      ],
      allocation_accountLine: "Domestic_Allocation_AccountLine_Value",
      expenseAllocation_accountLine: "Domestic_Allocation_AccountLine_Value"
  },

  local: {
      allocation: [
          { headerName: "Local_Header", headerValues: ["Local_Value1", "Local_Value2"] }
      ],
      expenseAllocation: [
          { headerName: "Local_Header", headerValues: ["Local_Value1", "Local_Value2"] }
      ],
      allocation_accountLine: "Local_Allocation_AccountLine_Value",
      expenseAllocation_accountLine: "Local_Allocation_AccountLine_Value"
  },

  // LEVEL3 Structure
  internationalCategories: [
      {
          categoryName: "food",
          allocation: [
              { headerName: "Intl_Category1_Header", headerValues: ["Intl_Category1_Value1", "Intl_Category1_Value2"] }
          ],
          expenseAllocation: [
              { headerName: "Intl_Category1_Header", headerValues: ["Intl_Category1_Value1", "Intl_Category1_Value2"] }
          ],
          allocation_accountLine: "Intl_Category1_Allocation_AccountLine_Value",
          expenseAllocation_accountLine: "Intl_Category1_Allocation_AccountLine_Value"
      }
  ],

  domesticCategories: [
      {
          categoryName: "transport",
          allocation: [
              { headerName: "Dom_Category1_Header", headerValues: ["Dom_Category1_Value1", "Dom_Category1_Value2"] }
          ],
          expenseAllocation: [
              { headerName: "Dom_Category1_Header", headerValues: ["Dom_Category1_Value1", "Dom_Category1_Value2"] }
          ],
          allocation_accountLine: "Dom_Category1_Allocation_AccountLine_Value",
          expenseAllocation_accountLine: "Dom_Category1_Allocation_AccountLine_Value"
      }
  ],

  localCategories: [
      {
          categoryName: "utilities",
          allocation: [
              { headerName: "Local_Category1_Header", headerValues: ["Local_Category1_Value1", "Local_Category1_Value2"] }
          ],
          expenseAllocation: [
              { headerName: "Local_Category1_Header", headerValues: ["Local_Category1_Value1", "Local_Category1_Value2"] }
          ],
          allocation_accountLine: "Local_Category1_Allocation_AccountLine_Value",
          expenseAllocation_accountLine: "Local_Category1_Allocation_AccountLine_Value"
      }
  ]
};











export const hrDummyData={
    currencyDetails:{
        defaultCurrency:"INR"
    },
    travelExpenseAllocation:[
        {     
        category:"travel expense",
        allocation:{
          headers:"cost center",
          values:["sales","finance"]
        }
      }  
    ]   
}


export const responseConvertedCurrency={
 createdBy: {
    empId: "exampleEmpId",
    name: "John Doe",
  },
companyName:"",
defaultCurrency:"",
convertedCurrency:"",
currencyFlag:"",
convertedTotalAmount:"",
convertedPersonalAmount:"",
convertedNonPersonalAmount:"",}



export const currencyTable = {
    "tenantId": "603f3b07965db634c8769a081",
    "currencyTable": [
      {
        "currencyName": "INR",
        "exchangeValue": [
          {
            "currencyName": "USD",
            "value": 82.00
          },
          {
            "currencyName": "EURO",
            "value": 90.00
          },
          {
            "currencyName": "AUD",
            "value": 70.00
          }
        ]
      }]}