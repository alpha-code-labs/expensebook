
const travelRequest = [
    {
      tenantId: 'tenant1',
      tenantName: 'Aramco industries',
      travelRequestId: 'tenant1_emp001_tr_001',
      tripPurpose: 'AeroCity Investors Meeting ',
      travelRequestStatus: 'pending approval',
      travelRequestState: 'section 1',
      createdBy: { empId: 'emp001', name: 'Luffy' },
      createdFor: [
        { empId: 'emp002', name: 'nami' },
        { empId: 'emp003', name: 'zoro' },
      ],
      travelAllocationHeaders: [
        { department: 'Dept1', percentage: 40 },
        { department: 'Dept2', percentage: 60 },
      ],
      // itinerary: {
      //   cities: [
      //     { from: 'Mumbai', to: 'Delhi', 
      // departure: { date: '2023-11-01', time: '09:00 AM' },
      // return: { date: '2023-11-05', time: '05:00 PM' } },
      //   ],
      //   hotels: [{ class: '5-star', checkIn: '2023-01-01', checkOut: '2023-01-05' }],
      //   cabs: [],
      //   modeOfTransit: 'Flight',
      //   travelClass: 'Business',
      //   needsVisa: false,
      //   needsAirportTransfer: true,
      //   needsHotel: true,
      //   needsFullDayCabs: true,
      //   tripType: { oneWayTrip: false, roundTrip: true, multiCityTrip: false },
      // },
      itinerary: [
        {
          "departure": {
            "itineraryId": "6123456789abcdef01234567",
            "from": "New York",
            "to": "London",
            "date": "2023-12-10",
            "time": "08:00",
            "modified": false,
            "isCancelled": false,
            "status": "pending approval",
            "bookingDetails": {
              "docURL": "https://example.com/doc1",
              "docType": "PDF",
              "billDetails": {}
            }
          },
          "return": {
            "itineraryId": "abcdef012345678901234567",
            "from": "London",
            "to": "New York",
            "date": "2023-12-20",
            "time": "12:00",
            "modified": false,
            "isCancelled": false,
            "status": "pending approval",
            "bookingDetails": {
              "docURL": "https://example.com/doc2",
              "docType": "PDF",
              "billDetails": {}
            }
          },
          "hotels": [
            {
              "location": "Paris",
              "class": "Luxury",
              "checkIn": "2023-12-12",
              "checkOut": "2023-12-15",
              "violations": {
                "class": "",
                "amount": ""
              },
              "modified": false,
              "isCancelled": false,
              "cancellationDate": "",
              "cancellationReason": "",
              "status": "pending approval",
              "bookingDetails": {
                "docURL": "https://example.com/doc3",
                "docType": "PDF",
                "billDetails": {}
              }
            }
          ],
          "cabs": [
            {
              "date": "2023-12-10",
              "class": "Sedan",
              "preferredTime": "10:00",
              "pickupAddress": "Airport",
              "dropAddress": "Hotel",
              "violations": {
                "class": "",
                "amount": ""
              },
              "modified": false,
              "isCancelled": false,
              "cancellationDate": "",
              "cancellationReason": "",
              "status": "pending approval",
              "bookingDetails": {
                "docURL": "https://example.com/doc4",
                "docType": "PDF",
                "billDetails": {}
              }
            }
          ],
          "modeOfTransit": "Flight",
          "travelClass": "Business",
          "needsVisa": false,
          "needsBoardingTransfer": true,
          "needsHotelTransfer": true,
          "boardingTransfer": {
            "date": "2023-12-10",
            "class": "Standard",
            "preferredTime": "09:00",
            "pickupAddress": "Hotel",
            "dropAddress": "Airport",
            "violations": {
              "class": "",
              "amount": ""
            },
            "modified": false,
            "isCancelled": false,
            "cancellationDate": "",
            "cancellationReason": "",
            "status": "pending approval",
            "bookingDetails": {
              "docURL": "https://example.com/doc5",
              "docType": "PDF",
              "billDetails": {}
            }
          },
          "hotelTransfer": {
            "date": "2023-12-12",
            "class": "Standard",
            "preferredTime": "15:00",
            "pickupAddress": "Hotel",
            "dropAddress": "Airport",
            "violations": {
              "class": "",
              "amount": ""
            },
            "modified": false,
            "isCancelled": false,
            "cancellationDate": "",
            "cancellationReason": "",
            "status": "pending approval",
            "bookingDetails": {
              "docURL": "https://example.com/doc6",
              "docType": "PDF",
              "billDetails": {}
            }
          },
          "needsHotel": true,
          "needsCab": true,
          "isCancelled": false,
          "cancellationDate": "",
          "cancellationReason": "",
          "status": "pending approval",
          "itineraryId": "0123456789abcdefabcdef01"
        }
      ],      
      travelDocuments: ['Document1.pdf', 'Document2.pdf'],
      bookings: [
        {
          vendorName: 'Hotel ABC',
          billNumber: '12345',
          billDescription: 'Hotel stay for 4 nights',
          grossAmount: 500,
          taxes: 50,
          date: '2023-01-01',
          imageUrl: 'https://example.com/hotel_receipt.jpg',
        },
        {
          vendorName: 'Flight XYZ',
          billNumber: '67890',
          billDescription: 'Round-trip flight ticket',
          grossAmount: 300,
          taxes: 30,
          date: '2023-01-01',
          imageUrl: 'https://example.com/flight_receipt.jpg',
        },
      ],
      approvers: [{ empId: 'emp004', name: 'Brook' }],
      preferences: ['Preference1', 'Preference2'],
      travelViolations: [],
      travelRequestDate: '2023-01-01',
      travelBookingDate: '2023-01-05',
      travelCompletionDate: '2023-01-10',
      travelRequestRejectionReason: '',
    },
    {
      tenantId: 'tenant2',
      travelRequestId: 'tenant2_emp002_tr_001',
      tripPurpose: 'Delhi Investors Meeting ',
      travelRequestStatus: 'pending approval',
      travelRequestState: 'section 5',
      createdBy: { empId: 'emp002', name: 'nami' },
      createdFor: [{ empId: 'emp003', name: 'zoro' }],
      travelAllocationHeaders: [],
      itinerary: [
        {
          "departure": {
            "itineraryId": "6123456789abcdef01234567",
            "from": "New York",
            "to": "London",
            "date": "2023-12-10",
            "time": "08:00",
            "modified": false,
            "isCancelled": false,
            "status": "pending approval",
            "bookingDetails": {
              "docURL": "https://example.com/doc1",
              "docType": "PDF",
              "billDetails": {}
            }
          },
          "return": {
            "itineraryId": "abcdef012345678901234567",
            "from": "London",
            "to": "New York",
            "date": "2023-12-20",
            "time": "12:00",
            "modified": false,
            "isCancelled": false,
            "status": "pending approval",
            "bookingDetails": {
              "docURL": "https://example.com/doc2",
              "docType": "PDF",
              "billDetails": {}
            }
          },
          "hotels": [
            {
              "location": "Paris",
              "class": "Luxury",
              "checkIn": "2023-12-12",
              "checkOut": "2023-12-15",
              "violations": {
                "class": "",
                "amount": ""
              },
              "modified": false,
              "isCancelled": false,
              "cancellationDate": "",
              "cancellationReason": "",
              "status": "pending approval",
              "bookingDetails": {
                "docURL": "https://example.com/doc3",
                "docType": "PDF",
                "billDetails": {}
              }
            }
          ],
          "cabs": [
            {
              "date": "2023-12-10",
              "class": "Sedan",
              "preferredTime": "10:00",
              "pickupAddress": "Airport",
              "dropAddress": "Hotel",
              "violations": {
                "class": "",
                "amount": ""
              },
              "modified": false,
              "isCancelled": false,
              "cancellationDate": "",
              "cancellationReason": "",
              "status": "pending approval",
              "bookingDetails": {
                "docURL": "https://example.com/doc4",
                "docType": "PDF",
                "billDetails": {}
              }
            }
          ],
          "modeOfTransit": "Flight",
          "travelClass": "Business",
          "needsVisa": false,
          "needsBoardingTransfer": true,
          "needsHotelTransfer": true,
          "boardingTransfer": {
            "date": "2023-12-10",
            "class": "Standard",
            "preferredTime": "09:00",
            "pickupAddress": "Hotel",
            "dropAddress": "Airport",
            "violations": {
              "class": "",
              "amount": ""
            },
            "modified": false,
            "isCancelled": false,
            "cancellationDate": "",
            "cancellationReason": "",
            "status": "pending approval",
            "bookingDetails": {
              "docURL": "https://example.com/doc5",
              "docType": "PDF",
              "billDetails": {}
            }
          },
          "hotelTransfer": {
            "date": "2023-12-12",
            "class": "Standard",
            "preferredTime": "15:00",
            "pickupAddress": "Hotel",
            "dropAddress": "Airport",
            "violations": {
              "class": "",
              "amount": ""
            },
            "modified": false,
            "isCancelled": false,
            "cancellationDate": "",
            "cancellationReason": "",
            "status": "pending approval",
            "bookingDetails": {
              "docURL": "https://example.com/doc6",
              "docType": "PDF",
              "billDetails": {}
            }
          },
          "needsHotel": true,
          "needsCab": true,
          "isCancelled": false,
          "cancellationDate": "",
          "cancellationReason": "",
          "status": "pending approval",
          "itineraryId": "0123456789abcdefabcdef01"
        }
      ], 
      "tripType": {
        "oneWayTrip": true,
        "roundTrip": false,
        "multiCityTrip": false
      },
      "travelDocuments": ["Passport", "Visa"],
      bookings: [],
      approvers: [{ empId: 'emp004', name: 'Brook' },{ empId: 'emp001', name: 'Luffy' }],
      "preferences": ["Window seat", "Non-smoking room"],
      "travelViolations": {},
      "travelRequestDate": "2023-12-01",
      "travelBookingDate": "2023-12-03",
      "travelCompletionDate": "2023-12-20",
      "travelRequestRejectionReason": "",
      "isCancelled": false,
      "cancellationDate": "",
      "cancellationReason": "",
      "isCashAdvanceTaken": true,
      "sentToTrip": false
      
    },
    {
        tenantId: 'tenant1',
        travelRequestId: 'tenant1_emp003_tr_001',
        tripPurpose: 'Release 1 Launch ',
        travelRequestStatus: 'pending approval',
        travelRequestState: 'section 1',
        createdBy: { empId: 'emp003', name: 'zoro' },
        createdFor: [
          { empId: 'emp002', name: 'nami' }
        ],
        travelAllocationHeaders: [
          { department: 'Dept1', percentage: 40 },
          { department: 'Dept2', percentage: 60 },
        ],
        itinerary: {
          cities: [
            { from: 'Tezpur', to: 'Itanagar', departure: { date: '2023-11-29', time: '09:00 AM' }, return: { date: '2023-12-02', time: '05:00 PM' } },
          ],
          hotels: [{ class: '3-star', checkIn: '2023-01-01', checkOut: '2023-01-05' }],
          cabs: [],
          modeOfTransit: 'Flight',
          travelClass: 'Business',
          needsVisa: false,
          needsAirportTransfer: true,
          needsHotel: true,
          needsFullDayCabs: true,
          tripType: { oneWayTrip: true, roundTrip: false, multiCityTrip: false },
        },
        travelDocuments: ['Document1.pdf', 'Document2.pdf'],
        bookings: [
          {
            vendorName: 'Hotel ABC',
            billNumber: '12345',
            billDescription: 'Hotel stay for 4 nights',
            grossAmount: 500,
            taxes: 50,
            date: '2023-01-01',
            imageUrl: 'https://example.com/hotel_receipt.jpg',
          },
          {
            vendorName: 'Flight XYZ',
            billNumber: '67890',
            billDescription: 'Round-trip flight ticket',
            grossAmount: 300,
            taxes: 30,
            date: '2023-01-01',
            imageUrl: 'https://example.com/flight_receipt.jpg',
          },
        ],
        approvers: [{ empId: 'emp004', name: 'Brook' }],
        preferences: ['Preference1', 'Preference2'],
        travelViolations: [],
        travelRequestDate: '2023-01-01',
        travelBookingDate: '2023-01-05',
        travelCompletionDate: '2023-01-10',
        travelRequestRejectionReason: '',
      },
      {
        tenantId: 'tenant2',
        travelRequestId: 'tenant2_emp005_tr_001',
        tripPurpose: 'Bengaluru Investors Meeting ',
        travelRequestStatus: 'pending approval',
        travelRequestState: 'section 2',
        createdBy: { empId: 'emp005', name: 'sanji' },
        createdFor: [{ empId: 'emp003', name: 'zoro' }],
        travelAllocationHeaders: [],
        itinerary: {
          cities: [
            { from: 'Jamshedpur', to: 'Belgavi', departure: { date: '2023-11-17', time: '09:00 AM' }, return: { date: '2023-11-19', time: '05:00 PM' } },
          ],
          hotels: [{ class: '5-star', checkIn: '2023-01-01', checkOut: '2023-01-05' }],
          cabs: [],
          modeOfTransit: 'Flight',
          travelClass: 'Business',
          needsVisa: false,
          needsAirportTransfer: true,
          needsHotel: true,
          needsFullDayCabs: true,
          tripType: { oneWayTrip: true, roundTrip: false, multiCityTrip: false },
        },
        travelDocuments: [],
        bookings: [],
        approvers: [{ empId: 'emp004', name: 'Brook' }],
        preferences: [],
        travelViolations: [],
        travelRequestDate: '2023-10-02',
        travelBookingDate: '',
        travelCompletionDate: '2023-11-20',
        travelRequestRejectionReason: '',
        
      }, {
        tenantId: 'tenant1',
        travelRequestId: 'tenant1_emp001_tr_002',
        tripPurpose: 'Branch Opening ',
        travelRequestStatus: 'pending approval',
        travelRequestState: 'section 0',
        createdBy: { empId: 'emp001', name: 'Luffy' },
        createdFor: [
          { empId: 'emp002', name: 'nami' },
          { empId: 'emp003', name: 'zoro' },
        ],
        travelAllocationHeaders: [
          { department: 'Dept1', percentage: 40 },
          { department: 'Dept2', percentage: 60 },
        ],
        itinerary: {
          cities: [
            { from: 'Mumbai', to: 'Aizawl', departure: { date: '2023-12-08', time: '09:00 AM' }, return: { date: '2023-12-14', time: '05:00 PM' } },
          ],
          hotels: [{ class: '5-star', checkIn: '2023-12-08', checkOut: '2023-12-14' }],
          cabs: [],
          modeOfTransit: 'Flight',
          travelClass: 'Business',
          needsVisa: false,
          needsAirportTransfer: true,
          needsHotel: true,
          needsFullDayCabs: true,
          tripType: { oneWayTrip:false, roundTrip: true, multiCityTrip: false },
        },
        travelDocuments: ['Document1.pdf', 'Document2.pdf'],
        bookings: [
          {
            vendorName: 'Hotel ABC',
            billNumber: '12345',
            billDescription: 'Hotel stay for 4 nights',
            grossAmount: 500,
            taxes: 50,
            date: '2023-01-01',
            imageUrl: 'https://example.com/hotel_receipt.jpg',
          },
          {
            vendorName: 'Flight XYZ',
            billNumber: '67890',
            billDescription: 'Round-trip flight ticket',
            grossAmount: 300,
            taxes: 30,
            date: '2023-01-01',
            imageUrl: 'https://example.com/flight_receipt.jpg',
          },
        ],
        approvers: [{ empId: 'emp004', name: 'Brook' }],
        preferences: ['Preference1', 'Preference2'],
        travelViolations: [],
        travelRequestDate: '2023-01-01',
        travelBookingDate: '2023-01-05',
        travelCompletionDate: '2023-01-10',
        travelRequestRejectionReason: '',
        
      },
      
    // Add more dummy data for other status
  ];
  
const cashAdvances = [
{
  "tenantId": "tenant1",
  "travelRequestId": "tenant1_emp001_tr_001",
  "cashAdvanceId": "tenant1_emp001_CA_001",
  "createdBy": { empId: 'emp001', name: 'Luffy' },
  "cashAdvanceStatus": "pending approval",
  "cashAdvanceState": "section 3",
  "amountDetails": [
      {
          "amount": 1300,
          "currency": "INR",
          "mode": "UPI",
      }
  ],
  "approvers": [{ empId: 'emp004', name: 'Brook' }],
  "cashAdvanceRequestDate": "2023-10-16T16:18:58.828Z",
  "cashAdvanceApprovalDate": null,
  "cashAdvanceSettlementDate": null,
  "cashAdvanceViolations": [],
  "cashAdvanceRejectionReason": null,
  "additionalCashAdvanceField": null,
  "embeddedTravelRequest": {
    tenantId: 'tenant1',
    travelRequestId: 'tenant1_emp001_tr_001',
    tripPurpose: 'AeroCity Investors Meeting ',
    travelRequestStatus: 'pending approval',
    travelRequestState: 'section 1',
    createdBy: { empId: 'emp001', name: 'Luffy' },
    createdFor: [
      { empId: 'emp002', name: 'nami' },
      { empId: 'emp003', name: 'zoro' },
    ],
    travelAllocationHeaders: [
      { department: 'Dept1', percentage: 40 },
      { department: 'Dept2', percentage: 60 },
    ],
    itinerary: {
      cities: [
        { from: 'Mumbai', to: 'Delhi', departure: { date: '2023-11-01', time: '09:00 AM' }, return: { date: '2023-11-05', time: '05:00 PM' } },
      ],
      hotels: [{ class: '5-star', checkIn: '2023-01-01', checkOut: '2023-01-05' }],
      cabs: [],
      modeOfTransit: 'Flight',
      travelClass: 'Business',
      needsVisa: false,
      needsAirportTransfer: true,
      needsHotel: true,
      needsFullDayCabs: true,
      tripType: { oneWayTrip: false, roundTrip: true, multiCityTrip: false },
    },
    travelDocuments: ['Document1.pdf', 'Document2.pdf'],
    bookings: [
      {
        vendorName: 'Hotel ABC',
        billNumber: '12345',
        billDescription: 'Hotel stay for 4 nights',
        grossAmount: 500,
        taxes: 50,
        date: '2023-01-01',
        imageUrl: 'https://example.com/hotel_receipt.jpg',
      },
      {
        vendorName: 'Flight XYZ',
        billNumber: '67890',
        billDescription: 'Round-trip flight ticket',
        grossAmount: 300,
        taxes: 30,
        date: '2023-01-01',
        imageUrl: 'https://example.com/flight_receipt.jpg',
      },
    ],
    approvers: [{ empId: 'emp004', name: 'Brook' }],
    preferences: ['Preference1', 'Preference2'],
    travelViolations: [],
    travelRequestDate: '2023-01-01',
    travelBookingDate: '2023-01-05',
    travelCompletionDate: '2023-01-10',
    travelRequestRejectionReason: '',
},},
{
"tenantId": "tenant2",
"travelRequestId": "tenant2_emp002_tr_001",
"cashAdvanceId": "tenant2_emp002_CA_53",
"createdBy": { empId: 'emp002', name: 'nami' },
"cashAdvanceStatus": "pending approval",
"cashAdvanceState": "section 3",
"amountDetails": [
    {
        "amount": 9800,
        "currency": "INR",
        "mode": "NEFT",
    }
],
"approvers": [{ empId: 'emp004', name: 'Brook' },{ empId: 'emp001', name: 'Luffy' }],
"cashAdvanceRequestDate": "2023-10-18T16:18:58.828Z",
"cashAdvanceApprovalDate": null,
"cashAdvanceSettlementDate": null,
"cashAdvanceViolations": [],
"cashAdvanceRejectionReason": null,
"additionalCashAdvanceField": null,
"embeddedTravelRequest": { tenantId: 'tenant2',
travelRequestId: 'tenant2_emp002_tr_001',
tripPurpose: 'Delhi Investors Meeting ',
travelRequestStatus: 'pending approval',
travelRequestState: 'section 5',
createdBy: { empId: 'emp002', name: 'nami' },
createdFor: [{ empId: 'emp003', name: 'zoro' }],
travelAllocationHeaders: [],
itinerary: {
  cities: [
    { from: 'Hyderabad', to: 'Delhi', departure: { date: '2023-12-22', time: '09:00 AM' }, return: { date: '2023-12-27', time: '05:00 PM' } },
  ],
  hotels: [{ class: '4-star', checkIn: '2023-01-01', checkOut: '2023-01-05' }],
  cabs: [],
  modeOfTransit: 'Flight',
  travelClass: 'Economy',
  needsVisa: false,
  needsAirportTransfer: true,
  needsHotel: true,
  needsFullDayCabs: true,
  tripType: { oneWayTrip: false, roundTrip: true, multiCityTrip: false },
},
travelDocuments: [],
bookings: [],
approvers: [{ empId: 'emp004', name: 'Brook' },{ empId: 'emp001', name: 'Luffy' }],
preferences: [],
travelViolations: [],
travelRequestDate: '2023-10-12',
travelBookingDate: '',
travelCompletionDate: '2023-11-2',
travelRequestRejectionReason: '',
},},
{
  "tenantId": "tenant1",
  tenantName: 'Aramco industries',
  "travelRequestId": "tenant1_emp003_tr_001",
  "cashAdvanceId": "tenant1_emp003_CA_006",
  "createdBy": { empId: 'emp003', name: 'zoro' },
  "cashAdvanceStatus": "pending approval",
  "cashAdvanceState": "section 3",
  "amountDetails": [
      {
          "amount": 124200,
          "currency": "INR",
          "mode": "Check",
      }
  ],
  "approvers": [{ empId: 'emp004', name: 'Brook' }],
  "cashAdvanceRequestDate": "2023-10-12T16:18:58.828Z",
  "cashAdvanceApprovalDate": null,
  "cashAdvanceSettlementDate": null,
  "cashAdvanceViolations": ["Exceeded the limit set by the T&E policy"],
  "cashAdvanceRejectionReason": null,
  "additionalCashAdvanceField": null,
  "embeddedTravelRequest": {
    tenantId: 'tenant1',
    tenantName: 'Aramco industries',
    travelRequestId: 'tenant1_emp003_tr_001',
    tripPurpose: 'Release 1 Launch ',
    travelRequestStatus: 'pending approval',
    travelRequestState: 'section 1',
    createdBy: { empId: 'emp003', name: 'zoro' },
    createdFor: [
      { empId: 'emp002', name: 'nami' }
    ],
    travelAllocationHeaders: [
      { department: 'Dept1', percentage: 40 },
      { department: 'Dept2', percentage: 60 },
    ],
    itinerary: {
      cities: [
        { from: 'Tezpur', to: 'Itanagar', departure: { date: '2023-11-29', time: '09:00 AM' }, return: { date: '2023-12-02', time: '05:00 PM' } },
      ],
      hotels: [{ class: '3-star', checkIn: '2023-01-01', checkOut: '2023-01-05' }],
      cabs: [],
      modeOfTransit: 'Flight',
      travelClass: 'Business',
      needsVisa: false,
      needsAirportTransfer: true,
      needsHotel: true,
      needsFullDayCabs: true,
      tripType: { oneWayTrip: true, roundTrip: false, multiCityTrip: false },
    },
    travelDocuments: ['Document1.pdf', 'Document2.pdf'],
    bookings: [
      {
        vendorName: 'Hotel ABC',
        billNumber: '12345',
        billDescription: 'Hotel stay for 4 nights',
        grossAmount: 500,
        taxes: 50,
        date: '2023-01-01',
        imageUrl: 'https://example.com/hotel_receipt.jpg',
      },
      {
        vendorName: 'Flight XYZ',
        billNumber: '67890',
        billDescription: 'Round-trip flight ticket',
        grossAmount: 300,
        taxes: 30,
        date: '2023-01-01',
        imageUrl: 'https://example.com/flight_receipt.jpg',
      },
    ],
    approvers: [{ empId: 'emp004', name: 'Brook' }],
    preferences: ['Preference1', 'Preference2'],
    travelViolations: [],
    travelRequestDate: '2023-01-01',
    travelBookingDate: '2023-01-05',
    travelCompletionDate: '2023-01-10',
    travelRequestRejectionReason: '',
    
  },},
];

export { travelRequest, cashAdvances };
