export const tripDummyData = {
   "success": true,
    tripNumber:"TRIP000000232",
    tenantId: "TNTABG",
    tenantName: "Example Tenant",
    companyName: "Example Company",
    userId: {
      empId: "exampleEmpId",
      name: "John Doe",
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

    tripId: "6587f7d3f1bc28bda7fd77d4",
    tripPurpose: "Business Trip with instaMart",
    tripStatus: "approved",
    tripStartDate: "23-Dec-2023",
    tripCompletionDate: "25-Dec-2023",
    isSentToExpense: false,
    notificationSentToDashboardFlag: false,
    cashAdvancesData: [
      {
        tenantId: "exampleTenantId",
        travelRequestId: "exampleTravelRequestId",
        travelRequestNumber: "TR00001",
        cashAdvanceId: "exampleCashAdvanceId",
        cashAdvanceNumber: "CA00001",
        createdBy: {
          empId: "exampleCreatedByEmpId",
          name: "John Doe",
        },
        cashAdvanceStatus: "draft",
        cashAdvanceState: "section 0",
        amountDetails: [
          {
            amount: 1000,
            currency: {},
            mode: "Cash",
          },
        ],
        approvers: [
          {
            empId: "exampleApproverEmpId",
            name: "Approver 1",
            status: "pending approval",
          },
        ],
        assignedTo: { empId: "exampleAssignedToEmpId", name: "Assignee" },
        paidBy: { empId: "examplePaidByEmpId", name: "Payer" },
        recoveredBy: { empId: "exampleRecoveredByEmpId", name: "Recoverer" },
        cashAdvanceRequestDate: new Date(),
        cashAdvanceApprovalDate: new Date("2023-11-29"),
        cashAdvanceSettlementDate: new Date("2023-12-10"),
        cashAdvanceViolations: "Violations found",
        cashAdvanceRejectionReason: "Rejected due to XYZ",
      },
    ],
    expenseAmountStatus: {
      totalAlreadyBookedExpenseAmount:6000,
      totalCashAmount: 1000,
      totalExpenseAmount: 1500,
      totalPersonalExpense: 500,
      remainingCash: 500,
    },
    travelExpenseData:[  
      {
        "expenseHeaderStatus": "new",//
        "tenantId": "TNTABG",
        "tenantName": "AdithyaBirlaGroup",
        "companyName": "AdithyaBirlaGroup",
        "tripId": "6587f7d3f1bc28bda7fd77d4",
        "tripNumber": "TRIPABG000002",
        "tripPurpose": "Delhi Branch Opening",
        "newExpenseReport": false,
        "status":"paid",
        "expenseHeaderNumber": "ERTNT000000",
        "expenseHeaderId": "65c085cb9d011e81a15d248c",       
        "alreadyBookedExpenseLines": {
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
                    "from": "Lucknow",
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
            ],
            "trains": []
        },
        "totalExpenseAmount": 107226,
        "totalAlreadyBookedExpense": 107226,
       
        "totalCashAmount": "0",
        "remainingCash": "0",      
        "expenseLines":[         
          {
            _id:"id1sdff",
            'Bill Date': '2022-01-01',
            'Bill Number': '123456',
            Description: 'Lorem Ipsum',
            Quantity: '5',
            'Tax Amount': '10.50',
            'Total Amount': '100.00',
            'Unit Cost': '20.00',
            'Vender Name': 'ABC Corp',
            categoryName: 'travel',
            currencyName: 'AUD',
            document: 'example.pdf',
            isPersonalExpense: true,
            personalExpenseAmount: '23432'
          },
          {
            _id:"id1sd",
            'Bill Date': '2022-02-01',
            'Bill Number': '654321',
            Description: 'Dolor Sit Amet',
            Quantity: '3',
            'Tax Amount': '7.25',
            'Total Amount': '75.50',
            'Unit Cost': '25.00',
            'Vender Name': 'XYZ Ltd',
            categoryName: 'foods',
            currencyName: 'USD',
            document: 'receipt.png',
            isPersonalExpense: false,
            personalExpenseAmount: ''
          },
          {
            _id:"id1d",
            'Bill Date': '2022-03-01',
            'Bill Number': '987654',
            Description: 'Consectetur Adipiscing',
            Quantity: '2',
            'Tax Amount': '5.75',
            'Total Amount': '50.00',
            'Unit Cost': '22.50',
            'Vender Name': 'PQR Inc',
            categoryName: 'accommodation',
            currencyName: 'INR',
            document: 'invoice.docx',
            isPersonalExpense: true,
            personalExpenseAmount: '15000'
          },
         
        ],
        "approvers": [
          {
            "empId": "empG001",
            "name": "Garp",
            "_id": "65c085cb9d011e81a15d2495"
          },
          {
            "empId": "empM001",
            "name": "MarcoPolo",
            "_id": "65c085cb9d011e81a15d2496"
          }
        ],
        "violations": [],
    },
    {
      "tripId": "6587f7d3f1bc28bda7fd77d4",
      "tripNumber": "TRIPABG000002",
      "tripPurpose": "Delhi Branch Opening",
      "newExpenseReport": false,
      "status":"pending booking",
      "expenseHeaderId":"expheaderId",
      "expenseHeaderNumber": "ERTNT000000",
      "totalExpenseAmount": 107226,
      "totalAlreadyBookedExpense": 107226,
      "isCashAdvanceTaken": false,
      "totalCashAmount": "0",
      "remainingCash": "0",
      "expenseLines":
        [
          {
            _id:"id1",
            categoryName: 'Conference / Event',
            'Conference name': 'Sample Conference',
            'Conference date': '2023-10-23',
            'Total amt': '$150.00',
            'Tax amt': '$15.00',
            currencyName: 'USD',
            document: 'receipt.png',
            isPersonalExpense: false,
            personalExpenseAmount: ''
          },
          {
            _id:"id2",
            categoryName: 'Travel Insurance',
            'Policy type': 'Sample Policy',
            'Insurance provider': 'Sample Insurance Co.',
            'Premium amount': '$50.00',
            currencyName: 'INR',
            document: 'invoice.docx',
            isPersonalExpense: true,
            personalExpenseAmount: '15000'
          }
        ]
      } ,
  //   {
  //     "tripId": "6587f7d3f1bc28bda7fd77d4",
      
  //     "tripNumber": "TRIPABG000002",
  //     "tripPurpose": "Delhi Branch Opening",
  //     "newExpenseReport": true,
  //     "status":"pending booking",
  //     "expenseHeaderId":"expheaderId",
  //     "expenseHeaderNumber": "ERTNT000600",
  //     "totalExpenseAmount": 107226,
  //     "totalAlreadyBookedExpense": 107226,
  //     "isCashAdvanceTaken": false,
  //     "totalCashAmount": "0",
  //     "remainingCash": "0",
  //     "expenseLines":
  //       [
          
  // {
  //      _id:'idfkjds',
  //      "travelType":"international",
  //     'categoryName':'Cab',
  //     'Date': '2024-12-12',
  //     'Time': '08:29 AM',
  //     'Class of Service': 'Executive',
  //     'Pickup Location': 'Sample Pickup Location form Delhi to Lucknow to America',
  //     'DropOff Location': 'Sample DropOff Location',
  //     'Total Fare': '$50.00',
  //     'Tax Amount': '$5.00',
  //     'Payment Method': 'Credit Card',
  //     'Receipt No.': '123456',
  //     'Ride Distance': '10 miles', 
  //     'Currency': 'USD', 
  //     'Document'  : 'invoice3.docx',
  //     isPersonalExpense: true,
  //     personalExpenseAmount: '5000',
  //     policyViolation : {
  //       "yellowFlag": [
  //         {
  //           "group": "Finance",
  //           "typeAllowed": false,
  //           "travelModeAllowed": true,
  //           "travelClassAllowed": true,
  //           "totalAmountAllowed": true
  //         }
  //     ]
  //     }   
  // },
  // {
  //   _id:'idfkj32',
  //     "travelType":"international",
  //     'categoryName':'Meals',
  //     'Bill Date': '2023-10-23',
  //     'Bill Number': 'MB123456',
  //     'Vendor Name': 'Sample Vendor',
  //     'Description': 'Meal Expense',
  //     'Quantity': 2,
  //     'Unit Cost': '$15.00',
  //     'Tax Amount': '$2.00',
  //     'Total Amount': '$32.00',
  //     'Currency'   : 'CAD',
  //     'Document': 'https://humanium-metal.com/app/uploads/2020/03/im-logotype-rgb-digital.png',
  //     isPersonalExpense: true,
  //     personalExpenseAmount: '5000'
  // },
  // {
  //   _id:'idf67j32',
  //   "travelType":"international",
  //   'categoryName':'Travel Reimbursement',
  //   'From': 'Sample From, Sample To, 10 miles',
  //   'Bill Date': '2023-10-23',
  //   'Bill Number': '123ABC',
  //   'Vendor Name': 'Sample Vendor',
  //   'Description': 'Sample Description',
  //   'Quantity': 3,
  //   'Unit Cost': '$25.00',
  //   'Tax Amount': '$3.00',
  //   'Total Amount': '78.00',
  //   'Currency': 'CAD',
  //   'Document': '',
  //   isPersonalExpense: false,
  //   personalExpenseAmount: '',
  //   policyViolation : {
  //     "yellowFlag": [
  //       {
  //         "group": "Finance",
  //         "typeAllowed": false,
  //         "travelModeAllowed": true,
  //         "travelClassAllowed": true,
  //         "totalAmountAllowed": true
  //       },
  //       {
  //         "group": "HR",
  //         "typeAllowed": true,
  //         "travelModeAllowed": false,
  //         "travelClassAllowed": true,
  //         "totalAmountAllowed": false
  //       }
  //   ]
  //   }
  // },
  // {
  //   _id:'id76j32',
  //   "travelType":"international",
  //   'Bill Date': '2022-12-01',
  //   'Bill Number': '223344',
  //   Description: 'Sed Consectetur',
  //   Quantity: '2',
  //   'Tax Amount': '5.25',
  //   'Total Amount': '50.00',
  //   'Unit Cost': '25.00',
  //   'Vender Name': 'EFG Ltd',
  //   categoryName: 'Travel Expenses',
  //   currencyName: 'CAD',
  //   Document: 'https://www.africau.edu/images/default/sample.pdf',
  //   isPersonalExpense: false,
  //   personalExpenseAmount: ''
  // },
  //       ]
  //     } 
    ],  
   
    "isCashAdvanceTaken": false,//
    
///company details for hr data
    "companyDetails": {
      "defaultCurrency": "INR",//
      "travelAllocationFlags": {//
        "level1": true,
        "level2": false,
        "level3": false
    },
    "expenseAllocation_accountLine": "14544",
    expenseAllocation: [//
      { headerName: "cost centre", headerValues: ["cc1", "cc2"] }
     ,{ headerName: "legal entity", headerValues: ["LE1", "LE2"] }
     ,{ headerName: "profit center", headerValues: ["pc1", "pc2"] },
 ],

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
      ]
     ,
      expenseSettlementOptions : {
        Cash: true,
        Cheque: false,
        'Salary Account': true,
        'Prepaid Card': false,
        'NEFT Bank Transfer': true
    }    
      

  },
  };


  // has to update level2
export const tripDummyDataLevel2 = {
   "success": true,
    tripNumber:"TRIP000000232",
    tenantId: "TNTABG",
    tenantName: "Example Tenant",
    companyName: "Example Company",
    userId: {
      empId: "exampleEmpId",
      name: "John Doe",
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

    tripId: "6587f7d3f1bc28bda7fd77d4",
    tripPurpose: "Business Trip with instaMart",
    tripStatus: "approved",
    tripStartDate: "23-Dec-2023",
    tripCompletionDate: "25-Dec-2023",
    isSentToExpense: false,
    notificationSentToDashboardFlag: false,
    cashAdvancesData: [
      {
        tenantId: "exampleTenantId",
        travelRequestId: "exampleTravelRequestId",
        travelRequestNumber: "TR00001",
        cashAdvanceId: "exampleCashAdvanceId",
        cashAdvanceNumber: "CA00001",
        createdBy: {
          empId: "exampleCreatedByEmpId",
          name: "John Doe",
        },
        cashAdvanceStatus: "draft",
        cashAdvanceState: "section 0",
        amountDetails: [
          {
            amount: 1000,
            currency: {},
            mode: "Cash",
          },
        ],
        approvers: [
          {
            empId: "exampleApproverEmpId",
            name: "Approver 1",
            status: "pending approval",
          },
        ],
        assignedTo: { empId: "exampleAssignedToEmpId", name: "Assignee" },
        paidBy: { empId: "examplePaidByEmpId", name: "Payer" },
        recoveredBy: { empId: "exampleRecoveredByEmpId", name: "Recoverer" },
        cashAdvanceRequestDate: new Date(),
        cashAdvanceApprovalDate: new Date("2023-11-29"),
        cashAdvanceSettlementDate: new Date("2023-12-10"),
        cashAdvanceViolations: "Violations found",
        cashAdvanceRejectionReason: "Rejected due to XYZ",
      },
    ],
    
    expenseAmountStatus: {
      totalAlreadyBookedExpenseAmount:6000,
      totalCashAmount: 1000,
      totalExpenseAmount: 1500,
      totalPersonalExpense: 500,
      remainingCash: 500,
    },
    travelExpenseData:[  
      {
        "expenseHeaderStatus": "new",//
        "tenantId": "TNTABG",
        "tenantName": "AdithyaBirlaGroup",
        "companyName": "AdithyaBirlaGroup",
        "tripId": "6587f7d3f1bc28bda7fd77d4",
        "tripNumber": "TRIPABG000002",
        "tripPurpose": "Delhi Branch Opening",
        "newExpenseReport": false,
        "status":"paid",
        "expenseHeaderNumber": "ERTNT000000",
        "expenseHeaderId": "65c085cb9d011e81a15d248c",       
        "alreadyBookedExpenseLines": {
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
            ],
            "trains": []
        },
        "totalExpenseAmount": 107226,
        "totalAlreadyBookedExpense": 107226,
       
        "totalCashAmount": "0",
        "remainingCash": "0",      
        "expenseLines":[         
          {
            _id:"id1sdff",
            'Bill Date': '2022-01-01',
            'Bill Number': '123456',
            Description: 'Lorem Ipsum',
            Quantity: '5',
            'Tax Amount': '10.50',
            'Total Amount': '100.00',
            'Unit Cost': '20.00',
            'Vender Name': 'ABC Corp',
            categoryName: 'travel',
            currencyName: 'AUD',
            document: 'example.pdf',
            isPersonalExpense: true,
            personalExpenseAmount: '23432'
          },
          {
            _id:"id1sd",
            'Bill Date': '2022-02-01',
            'Bill Number': '654321',
            Description: 'Dolor Sit Amet',
            Quantity: '3',
            'Tax Amount': '7.25',
            'Total Amount': '75.50',
            'Unit Cost': '25.00',
            'Vender Name': 'XYZ Ltd',
            categoryName: 'foods',
            currencyName: 'USD',
            document: 'receipt.png',
            isPersonalExpense: false,
            personalExpenseAmount: ''
          },
          {
            _id:"id1d",
            'Bill Date': '2022-03-01',
            'Bill Number': '987654',
            Description: 'Consectetur Adipiscing',
            Quantity: '2',
            'Tax Amount': '5.75',
            'Total Amount': '50.00',
            'Unit Cost': '22.50',
            'Vender Name': 'PQR Inc',
            categoryName: 'accommodation',
            currencyName: 'INR',
            document: 'invoice.docx',
            isPersonalExpense: true,
            personalExpenseAmount: '15000'
          },
         
        ],
        "approvers": [
          {
            "empId": "empG001",
            "name": "Garp",
            "_id": "65c085cb9d011e81a15d2495"
          },
          {
            "empId": "empM001",
            "name": "MarcoPolo",
            "_id": "65c085cb9d011e81a15d2496"
          }
        ],
        "violations": [],
    },
    {
      "tripId": "6587f7d3f1bc28bda7fd77d4",
      "tripNumber": "TRIPABG000002",
      "tripPurpose": "Delhi Branch Opening",
      "newExpenseReport": false,
      "status":"pending booking",
      "expenseHeaderId":"expheaderId",
      "expenseHeaderNumber": "ERTNT000000",
      "totalExpenseAmount": 107226,
      "totalAlreadyBookedExpense": 107226,
      "isCashAdvanceTaken": false,
      "totalCashAmount": "0",
      "remainingCash": "0",
      "expenseLines":
        [
          {
            _id:"id1",
            categoryName: 'Conference / Event',
            'Conference name': 'Sample Conference',
            'Conference date': '2023-10-23',
            'Total amt': '$150.00',
            'Tax amt': '$15.00',
            currencyName: 'USD',
            document: 'receipt.png',
            isPersonalExpense: false,
            personalExpenseAmount: ''
          },
          {
            _id:"id2",
            categoryName: 'Travel Insurance',
            'Policy type': 'Sample Policy',
            'Insurance provider': 'Sample Insurance Co.',
            'Premium amount': '$50.00',
            currencyName: 'INR',
            document: 'invoice.docx',
            isPersonalExpense: true,
            personalExpenseAmount: '15000'
          }
        ]
      } ,
    {
      "tripId": "6587f7d3f1bc28bda7fd77d4",
      
      "tripNumber": "TRIPABG000002",
      "tripPurpose": "Delhi Branch Opening",
      "newExpenseReport": true,
      "status":"pending booking",
      "expenseHeaderId":"expheaderId",
      "expenseHeaderNumber": "ERTNT000600",
      "totalExpenseAmount": 107226,
      "totalAlreadyBookedExpense": 107226,
      "isCashAdvanceTaken": false,
      "totalCashAmount": "0",
      "remainingCash": "0",
      "expenseLines":
        [
          
  {
       _id:'idfkjds',
       "travelType":"international",
      'categoryName':'Cab',
      'Date': '2024-12-12',
      'Time': '08:29 AM',
      'Class of Service': 'Executive',
      'Pickup Location': 'Sample Pickup Location form Delhi to Lucknow to America',
      'DropOff Location': 'Sample DropOff Location',
      'Total Fare': '$50.00',
      'Tax Amount': '$5.00',
      'Payment Method': 'Credit Card',
      'Receipt No.': '123456',
      'Ride Distance': '10 miles', 
      'Currency': 'USD', 
      'Document'  : 'invoice3.docx',
      isPersonalExpense: true,
      personalExpenseAmount: '5000',
      policyViolation : {
        "yellowFlag": [
          {
            "group": "Finance",
            "typeAllowed": false,
            "travelModeAllowed": true,
            "travelClassAllowed": true,
            "totalAmountAllowed": true
          }
      ]
      }   
  },
  {
    _id:'idfkj32',
      "travelType":"international",
      'categoryName':'Meals',
      'Bill Date': '2023-10-23',
      'Bill Number': 'MB123456',
      'Vendor Name': 'Sample Vendor',
      'Description': 'Meal Expense',
      'Quantity': 2,
      'Unit Cost': '$15.00',
      'Tax Amount': '$2.00',
      'Total Amount': '$32.00',
      'Currency'   : 'CAD',
      'Document': 'https://humanium-metal.com/app/uploads/2020/03/im-logotype-rgb-digital.png',
      isPersonalExpense: true,
      personalExpenseAmount: '5000'
  },
  {
    _id:'idf67j32',
    "travelType":"international",
    'categoryName':'Travel Reimbursement',
    'From': 'Sample From, Sample To, 10 miles',
    'Bill Date': '2023-10-23',
    'Bill Number': '123ABC',
    'Vendor Name': 'Sample Vendor',
    'Description': 'Sample Description',
    'Quantity': 3,
    'Unit Cost': '$25.00',
    'Tax Amount': '$3.00',
    'Total Amount': '78.00',
    'Currency': 'CAD',
    'Document': '',
    isPersonalExpense: false,
    personalExpenseAmount: '',
    policyViolation : {
      "yellowFlag": [
        {
          "group": "Finance",
          "typeAllowed": false,
          "travelModeAllowed": true,
          "travelClassAllowed": true,
          "totalAmountAllowed": true
        },
        {
          "group": "HR",
          "typeAllowed": true,
          "travelModeAllowed": false,
          "travelClassAllowed": true,
          "totalAmountAllowed": false
        }
    ]
    }
  },
  {
    _id:'id76j32',
    "travelType":"international",
    'Bill Date': '2022-12-01',
    'Bill Number': '223344',
    Description: 'Sed Consectetur',
    Quantity: '2',
    'Tax Amount': '5.25',
    'Total Amount': '50.00',
    'Unit Cost': '25.00',
    'Vender Name': 'EFG Ltd',
    categoryName: 'Travel Expenses',
    currencyName: 'CAD',
    Document: 'https://www.africau.edu/images/default/sample.pdf',
    isPersonalExpense: false,
    personalExpenseAmount: ''
  },
        ]
      } 
    ],  
   
    "isCashAdvanceTaken": false,//
    
///company details for hr data
    "companyDetails": {
      "defaultCurrency": "INR",//
      "travelAllocationFlags": {//
        "level1": false,
        "level2": true,
        "level3": false
    },
    travelAllocations:{
   
      'international': {
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
      

  },
  };
  









 
  