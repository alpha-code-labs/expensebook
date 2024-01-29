const tripDummyData = {
    tripNumber:"TRIP000000232",
    tenantId: "TNTABG",
    tenantName: "Example Tenant",
    companyName: "Example Company",
    userId: {
      empId: "exampleEmpId",
      name: "John Doe",
    },
    tripId: "6587f7d3f1bc28bda7fd77d4",
    tripPurpose: "Business Trip with instaMart",
    tripStatus: "approved",
    tripStartDate: "23-Dec-2023",
    tripCompletionDate: "25-Dec-2023",
    isSentToExpense: false,
    notificationSentToDashboardFlag: false,
    travelRequestData: {
      tenantId: "exampleTenantId",
      tenantName: "Example Tenant",
      companyName: "Example Company",
      travelRequestId: "exampleTravelRequestId",
      travelRequestNumber: "TR00001",
      tripPurpose: "Business Trip",
      travelRequestStatus: "draft",
      travelRequestState: "section 0",
      createdBy: {
        empId: "exampleCreatedByEmpId",
        name: "Jane Doe",
      },
      createdFor: {
        empId: "exampleCreatedForEmpId",
        name: "John Doe",
      },
      teamMembers: [],
      travelAllocationHeaders: [],
      itinerary: {
        formState: [
          {
            formId: "exampleFormId",
            transfers: {
              needsDeparturePickup: true,
              needsDepartureDrop: true,
              needsReturnPickup: true,
              needsReturnDrop: true,
            },
            needsHotel: true,
            needsCab: true,
            needsVisa: false,
            cancellationDate: "2023-11-28",
            cancellationReason: "Changed plans",
            formStatus: "draft",
          },
        ],
        flights: [
          {
            itineraryId: "exampleFlightItineraryId",
            formId: "exampleFormId",
            from: "City A",
            to: "City B",
            date: "2023-12-02",
            time: "08:00 AM",
            travelClass: "Business",
            isReturnTravel: "false",
            violations: {
              class: "Example Violation Class",
              amount: "Example Violation Amount",
            },
            bkd_from: "City A",
            bkd_to: "City B",
            bkd_date: "2023-12-02",
            bkd_time: "10:00 AM",
            bkd_travelClass: "Business",
            bkd_isReturnTravel: "false",
            modified: false,
            cancellationDate: new Date("2023-11-28"),
            cancellationReason: "Changed plans",
            status: "paid and cancelled",
            bookingDetails: {
              docURL: "exampleDocURL",
              docType: "exampleDocType",
              billDetails: {
                amount:"5000"
              },
            },
          },
          {
            itineraryId: "exampleFlightItineraryId2",
            formId: "exampleFormId",
            from: "City A",
            to: "City B",
            date: "2023-12-02",
            time: "08:00 AM",
            travelClass: "Business",
            isReturnTravel: "false",
            violations: {
              class: "Example Violation Class",
              amount: "Example Violation Amount",
            },
            bkd_from: "City A",
            bkd_to: "City B",
            bkd_date: "2023-12-02",
            bkd_time: "10:00 AM",
            bkd_travelClass: "Business",
            bkd_isReturnTravel: "false",
            modified: false,
            cancellationDate: new Date("2023-11-28"),
            cancellationReason: "Changed plans",
            status: "paid and cancelled",
            bookingDetails: {
              docURL: "exampleDocURL",
              docType: "exampleDocType",
              billDetails: {
                amount:"5000"
              },
            },
          },
        ],
        buses: [
            {
              itineraryId: "exampleBusItineraryId1",
              formId: "exampleFormId",
              from: "City C",
              to: "City D",
              date: "2023-12-03",
              time: "10:00 AM",
              travelClass: "Economy",
              isReturnTravel: "false",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_from: "City C",
              bkd_to: "City D",
              bkd_date: "2023-12-03",
              bkd_time: "01:00 PM",
              bkd_travelClass: "Economy",
              bkd_isReturnTravel: "false",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleBusDocURL",
                docType: "exampleBusDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
            {
              itineraryId: "exampleBusItineraryId2",
              formId: "exampleFormId",
              from: "City C",
              to: "City D",
              date: "2023-12-03",
              time: "10:00 AM",
              travelClass: "Economy",
              isReturnTravel: "false",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_from: "City C",
              bkd_to: "City D",
              bkd_date: "2023-12-03",
              bkd_time: "01:00 PM",
              bkd_travelClass: "Economy",
              bkd_isReturnTravel: "false",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleBusDocURL",
                docType: "exampleBusDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
          ],
          trains: [
            {
              itineraryId: "TrainItineraryId1",
              formId: "exampleFormId",
              from: "City E",
              to: "City F",
              date: "2023-12-04",
              time: "02:00 PM",
              travelClass: "First Class",
              isReturnTravel: "false",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_from: "City E",
              bkd_to: "City F",
              bkd_date: "2023-12-04",
              bkd_time: "05:00 PM",
              bkd_travelClass: "First Class",
              bkd_isReturnTravel: "false",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleTrainDocURL",
                docType: "exampleTrainDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
            {
              itineraryId: "TrainItineraryId2",
              formId: "exampleFormId",
              from: "City E",
              to: "City F",
              date: "2023-12-04",
              time: "02:00 PM",
              travelClass: "First Class",
              isReturnTravel: "false",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_from: "City E",
              bkd_to: "City F",
              bkd_date: "2023-12-04",
              bkd_time: "05:00 PM",
              bkd_travelClass: "First Class",
              bkd_isReturnTravel: "false",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleTrainDocURL",
                docType: "exampleTrainDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
          ],
          hotels: [
            {
              itineraryId: "HotelItineraryId",
              formId: "exampleFormId",
              location: "Hotel G",
              locationPreference: "City View",
              class: "Luxury",
              checkIn: "2023-12-05",
              checkOut: "2023-12-07",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_location: "Hotel G",
              bkd_class: "Luxury",
              bkd_checkIn: "2023-12-05",
              bkd_checkOut: "2023-12-07",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleHotelDocURL",
                docType: "exampleHotelDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
            {
              itineraryId: "HotelItineraryId2",
              formId: "exampleFormId",
              location: "Hotel G",
              locationPreference: "City View",
              class: "Luxury",
              checkIn: "2023-12-05",
              checkOut: "2023-12-07",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_location: "Hotel G",
              bkd_class: "Luxury",
              bkd_checkIn: "2023-12-05",
              bkd_checkOut: "2023-12-07",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleHotelDocURL",
                docType: "exampleHotelDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
          ],
          cabs: [
            {
              itineraryId: "exampleCabItineraryId",
              formId: "exampleFormId",
              date: "2023-12-08",
              class: "Sedan",
              preferredTime: "08:00 AM",
              pickupAddress: "City H",
              dropAddress: "City I",
              isReturnTravel: "false",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_date: "2023-12-08",
              bkd_class: "Sedan",
              bkd_preferredTime: "08:00 AM",
              bkd_pickupAddress: "City H",
              bkd_dropAddress: "City I",
              bkd_isReturnTravel: "false",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleCabDocURL",
                docType: "exampleCabDocType",
                billDetails: {
                  amount:"5000"
                },
              },
              type: "regular",
            },
          ],
        // Include similar data for buses, trains, hotels, and cabs
      },
      tripType: { oneWayTrip: true, roundTrip: false, multiCityTrip: false },
      travelDocuments: ["exampleDocument1", "exampleDocument2"],
      bookings: [
        {
          itineraryReference: {},
          docURL: "exampleDocURL",
          details: {},
          status: {},
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
      bookedBy: { empId: "exampleBookedByEmpId", name: "Booker" },
      recoveredBy: { empId: "exampleRecoveredByEmpId", name: "Recoverer" },
      preferences: ["Preference 1", "Preference 2"],
      travelViolations: {},
      travelRequestDate: "2023-11-25",
      travelBookingDate: new Date(),
      travelCompletionDate: new Date("2023-12-10"),
      cancellationDate: new Date("2023-11-28"),
      travelRequestRejectionReason: "Rejected due to XYZ",
      isCancelled: false,
      cancellationReason: "",
      isCashAdvanceTaken: false,
      sentToTrip: false,
    },
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
        "tripId": "6587f7d3f1bc28bda7fd77d4",
        "tripNumber": "TRIPABG000002",
        "tripPurpose": "Delhi Branch Opening",
        "newExpenseReport": false,
        "status":"paid",
        "expenseHeaderId":"expheaderId",
        "expenseReportNumber": "ERTNT000055",
        
        "alreadyBookedExpense": {
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
        "isCashAdvanceTaken": false,
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
      
    },
    {
      "tripId": "6587f7d3f1bc28bda7fd77d4",
      "tripNumber": "TRIPABG000002",
      "tripPurpose": "Delhi Branch Opening",
      "newExpenseReport": false,
      "status":"pending booking",
      "expenseHeaderId":"expheaderId",
      "expenseReportNumber": "ERTNT000000",
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
      "expenseReportNumber": "ERTNT000600",
      "totalExpenseAmount": 107226,
      "totalAlreadyBookedExpense": 107226,
      "isCashAdvanceTaken": false,
      "totalCashAmount": "0",
      "remainingCash": "0",
      "expenseLines":
        [
          
  {
    _id:'idfkjds',
      'categoryName':'Cab',
      'Date': '2024-12-12',
      'Time': '08:29 AM',
      'Class of Service': 'Executive',
      'Pickup Location': 'Sample Pickup Location',
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
      'Document': 'invoice3.docx',
      isPersonalExpense: true,
      personalExpenseAmount: '5000'
  },
  {
    _id:'idf67j32',
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
    'Document': 'invoice3.docx',
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
    'Bill Date': '2022-12-01',
    'Bill Number': '223344',
    Description: 'Sed Consectetur',
    Quantity: '2',
    'Tax Amount': '5.25',
    'Total Amount': '50.00',
    'Unit Cost': '25.00',
    'Vender Name': 'EFG Ltd',
    categoryName: 'travel',
    currencyName: 'CAD',
    document: 'invoice3.docx',
    isPersonalExpense: false,
    personalExpenseAmount: ''
  },
        ]
      } 
    ],  
   

///company details for hr data
    "companyDetails": {
      "defaultCurrency": "INR",
      "travelExpenseAllocation": [
          {
              "headerName": "department",
              "headerValues": [
                  "HR",
                  "Finance",
                  "Engineering",
                  "Marketing"
              ],
              "_id": "655e242506d917ccfd8933aa"
          },
          {
              "headerName": "costCenter",
              "headerValues": [
                  "CC-001",
                  "CC-002",
                  "CC-003",
                  "CC-004",
                  "CC-005",
              
              ],
              "_id": "655e242506d917ccfd8933ab"
          },
          {
              "headerName": "legalEntity",
              "headerValues": [
                  "Company XYZ",
                  "Company ABC"
              ],
              "_id": "655e242506d917ccfd8933ac"
          }
      ],

      "advanceSettlementOptions": {
          "Cash": true,
          "Cheque": true,
          "Salary Account": true,
          "Prepaid Card": true,
          "NEFT Bank Transfer": true
      },
      "expenseSettlementOptions": {
          "Cash": true,
          "Cheque": true,
          "Salary Account": true,
          "Prepaid Card": true,
          "NEFT Bank Transfer": true
      },     
      "travelCategoriesExpenseAllocation":[
        {
        categoryName: "food",
        allocations:[
          {
          headerName: "cost center",
          headerValues: ["cc1","cc2","cc3"],
        },
          {
          headerName: "profit centre",
          headerValues: ["pc1","pc2","pc3"],
        }
      ]
      },
        {
        categoryName: "travel",
        allocations:[{
          headerName: "legal entity",
          headerValues: ["le1","le2","le3"],
        }]
      },
        {
        categoryName: "others",
        allocations:[{
          headerName: "profit center",
          headerValues: ["pc1","pc2","pc3"],
        }]
      }
      ]

  },
  };
  
  export default tripDummyData




  export const NewsampleTripData = {
    tenantId: "sampleTenantId",
    tenantName: "Sample Tenant",
    companyName: "Sample Company",
    tripId: "tripid0sfdjh",
    tripNumber: "T123456",
    tripStatus: "upcoming",
    tripStartDate: new Date("2024-01-01"),
    tripCompletionDate: new Date("2024-01-10"),
    expenseAmountStatus: {
      totalCashAmount: 1000,
      totalAlreadyBookedExpenseAmount: 200,
      totalExpenseAmount: 800,
      totalPersonalExpenseAmount: 100,
      totalremainingCash: 700,
    },
    isSentToExpense: false,
    notificationSentToDashboardFlag: false,
    travelRequestData: {
      tenantId: "sampleTenantId",
      tenantName: "Sample Tenant",
      companyName: "Sample Company",
      travelRequestId: "trid7687shdfjhsg",
      travelRequestNumber: "TR123456",
      tripPurpose: "Sample Trip Purpose",
      travelRequestStatus: "draft",
      travelRequestState: "section 0",
      createdBy: {
        empId: "EMP001",
        name: "John Doe",
      },
      createdFor: {
        empId: "EMP002",
        name: "Jane Doe",
      },
      teamMembers: [],
      travelAllocationHeaders: [],
      itinerary: {
        formState: [
          {
            formId: "F001",
            transfers: {
              needsDeparturePickup: true,
              needsDepartureDrop: true,
              needsReturnPickup: false,
              needsReturnDrop: false,
            },
            needsHotel: true,
            needsCab: false,
            needsVisa: true,
            cancellationDate: "2024-01-05",
            cancellationReason: "Change of plans",
            formStatus: "draft",
          },
        ],
        flights: [
          {
            itineraryId: "itineraryIdsdfhg",
            formId: "F001",
            from: "City A",
            to: "City B",
            date: "2024-01-02",
            time: "10:00 AM",
            travelClass: "Economy",
            isReturnTravel: "yes",
            violations: {
              class: "Economy",
              amount: "50",
            },
            bkd_from: "City A",
            bkd_to: "City B",
            bkd_date: "2024-01-02",
            bkd_time: "10:00 AM",
            bkd_travelClass: "Economy",
            bkd_isReturnTravel: "yes",
            modified: false,
            cancellationDate: null,
            cancellationReason: null,
            status: "approved",
            bookingDetails: {
              docURL: "https://example.com/document.pdf",
              docType: "PDF",
              billDetails: {},
            },
          },
        ],
        // ... (similar structures for buses, trains, hotels, and cabs)
      },
      tripType: { oneWayTrip: true, roundTrip: false, multiCityTrip: false },
      travelDocuments: ["Passport", "Visa"],
      bookings: [
        {
          itineraryReference: {},
          docURL: "https://example.com/document.pdf",
          details: {},
          status: {},
        },
      ],
      approvers: [
        {
          empId: "EMP003",
          name: "Manager Smith",
          status: "pending approval",
        },
      ],
      assignedTo: { empId: "EMP003", name: "Manager Smith" },
      bookedBy: { empId: "EMP004", name: "Travel Agent" },
      recoveredBy: { empId: "EMP005", name: "Accountant" },
      preferences: ["Window Seat", "Vegetarian Meal"],
      travelViolations: {},
      travelRequestDate: "2024-01-01",
      travelBookingDate: new Date("2024-01-01"),
      travelCompletionDate: new Date("2024-01-10"),
      cancellationDate: null,
      travelRequestRejectionReason: null,
      isCancelled: false,
      cancellationReason: null,
      isCashAdvanceTaken: true,
      sentToTrip: false,
    },
    cashAdvancesData: [
      {
        tenantId: "sampleTenantId",
        travelRequestId: "tridjfsd",
        travelRequestNumber: "TR123456",
        cashAdvanceId: "caidhjhj",
        cashAdvanceNumber: "CA123456",
        createdBy: {
          empId: "EMP006",
          name: "Finance Manager",
        },
        cashAdvanceStatus: "draft",
        cashAdvanceState: "section 0",
        amountDetails: [
          {
            amount: 500,
            currency: {},
            mode: "Bank Transfer",
          },
        ],
        approvers: [
          {
            empId: "EMP007",
            name: "CEO",
            status: "pending approval",
          },
        ],
        assignedTo: { empId: "EMP007", name: "CEO" },
        paidBy: { empId: "EMP008", name: "Accountant" },
        recoveredBy: { empId: "EMP009", name: "Finance Manager" },
        cashAdvanceRequestDate: new Date("2024-01-02"),
        cashAdvanceApprovalDate: null,
        cashAdvanceSettlementDate: null,
        cashAdvanceViolations: null,
        cashAdvanceRejectionReason: null,
      },
    ],
    travelExpenseData: [
      {
        tenantId: "sampleTenantId",
        tenantName: "Sample Tenant",
        companyName: "Sample Company",
        travelRequestId: "tridsjdfh",
        travelRequestNumber: "TR123456",
        expenseHeaderId: "expenseIddfhg",
        expenseHeaderType: "travel",
        expenseHeaderStatus: "draft",
        alreadyBookedExpenseLines: [
          {
            formState: [
              {
                formId: "F002",
                transfers: {
                  needsDeparturePickup: false,
                  needsDepartureDrop: false,
                  needsReturnPickup: true,
                  needsReturnDrop: true,
                },
                needsHotel: false,
                needsCab: true,
                needsVisa: false,
                cancellationDate: "2024-01-06",
                cancellationReason: "Change of plans",
                formStatus: "draft",
              },
            ],
            flights: [
              {
                itineraryId: "itineraryIdskfj",
                formId: "F002",
                from: "City B",
                to: "City A",
                date: "2024-01-08",
                time: "02:00 PM",
                travelClass: "Business",
                isReturnTravel: "yes",
                violations: {
                  class: "Business",
                  amount: "100",
                },
                bkd_from: "City B",
                bkd_to: "City A",
                bkd_date: "2024-01-08",
                bkd_time: "02:00 PM",
                bkd_travelClass: "Business",
                bkd_isReturnTravel: "yes",
                modified: false,
                cancellationDate: null,
                cancellationReason: null,
                status: "approved",
                bookingDetails: {
                  docURL: "https://example.com/document.pdf",
                  docType: "PDF",
                  billDetails: {},
                },
              },
            ],
            // ... (similar structures for buses, trains, hotels, and cabs)
          },
        ],
        expenseLines: [
          {
            expenseLineId: "expensLineIhfjhs",
            transactionData: {
              businessPurpose: "Client Meeting",
              vendorName: "Vendor XYZ",
              billNumber: "B123456",
              billDate: "2024-01-05",
              taxes: 20,
              totalAmount: 200,
              description: "Client Dinner",
            },
            lineItemStatus: "draft",
            expenseLineAllocation: [
              {
                headerName: "Category A",
                headerValues: ["Value 1", "Value 2"],
              },
            ],
            alreadySaved: false,
            expenseLineCategory: [{ categoryName: "Meals" }],
            modeOfPayment: "Credit Card",
            isInMultiCurrency: false,
            multiCurrencyDetails: [],
            isPersonalExpense: true,
            personalExpenseAmount: 50,
            billImageUrl: "https://example.com/bill.jpg",
            billRejectionReason: null,
          },
        ],
        approvers: [
          {
            empId: "EMP010",
            name: "Manager Johnson",
            status: "pending approval",
          },
        ],
        expenseViolations: ["Category A violation"],
        expenseRejectionReason: null,
        expenseSubmissionDate: new Date("2024-01-10"),
      },
    ],
  };
  
 
  