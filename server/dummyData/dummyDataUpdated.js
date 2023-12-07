
const travelRequest = [
    {
      tenantId: 'tenant456',
      tenantName: 'Dragon',
      travelRequestId: '65719fa874eb31742e095c0a',
      tripPurpose: 'AeroCity Investors Meeting ',
      travelRequestStatus: 'pending approval',
      travelRequestState: 'section 1',
      createdBy: { empId: 'emp001', name: 'Luffy' },
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
            "itineraryId": "65719fa874eb31742e095c0a",
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
      "isCashAdvanceTaken": false,
      "sentToTrip": false
    },
  ];


const cashAdvances = [ 
  {
        tenantId: "tenant456",
        tenantName: "Dragon",
        companyName: "Dragon",
        travelRequestId: "65719fa874eb31742e095c0a",
        embeddedTravelRequest:     {
          "tenantId": "tenant456",
          "tenantName": "Dragon",
          "companyName": "Dragon",
          "travelRequestId": "65719fa874eb31742e095c0a",
          "tripPurpose": "Delhi Branch Opening",
          "travelRequestStatus": "pending approval",
          "travelRequestState": "section 5",
          "createdBy": { empId: "empL001", name: "Luffy" },
          "createdFor": 
              { empId: "empL001", name: "Luffy" },
          "teamMembers": [
              { empId: "empZ001", name: "Zoro" },
              { empId: "empN001", name: "Nami" },
              { empId: "empS001", name: "Sanji" },
              { empId: "empC001", name: "Chopper" },
          ],
          "travelAllocationHeaders": [
            {
              "department": "Sales",
              "percentage": 30
            },
            {
              "department": "Marketing",
              "percentage": 70
            }
          ],
          "itinerary": {
            "departureCity": "New York",
            "arrivalCity": "Los Angeles",
            "departureDate": "2023-12-15",
            "arrivalDate": "2023-12-17"
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
          "approvers": [
            {
              "empId": 'emp004',
              "name":  'Brook' , 
              "status": "pending approval"
              
            },
            {
              "empId": "EMP002",
              "name": "Jane Smith",
              "status": "approved"
            },
          ],
          preferences: ['Preference1', 'Preference2'],
          travelViolations: [],
          travelRequestDate: '2023-01-01',
          travelBookingDate: '2023-01-05',
          travelCompletionDate: '2023-01-10',
          travelRequestRejectionReason: '',
          "isCashAdvanceTaken": false,
          "sentToTrip": false
            },
        cashAdvances: [
          {
            tenantId: "tenant456",
            tenantName: "Dragon",
            companyName: "Dragon",
            travelRequestId: "65719fa874eb31742e095c0a",
            cashAdvanceId: "6570c7b5a3b82db944d7caf3",
            createdBy: { empId: "empL001", name: "Luffy" },
            createdFor: { empId: "empL001", name: "Luffy" },
            cashAdvanceStatus: "draft",
            cashAdvanceState: "section 0",
            amountDetails: [
              {
                amount: 8300.0,
                currency: "INR",
                mode: "Credit Card",
              },
              
            ],
            approvers: [
              {
                empId: "empG001",
                name: "Garp",
                status: "pending approval",
              },
            ],
            cashAdvanceRequestDate: new Date(),
            cashAdvanceApprovalDate: new Date(),
            cashAdvanceSettlementDate: new Date(),
            cashAdvanceViolations: [],
            cashAdvanceRejectionReason: "",
            notificationSentToDashboardFlag: true,
          },
          {
            tenantId: "tenant456",
            tenantName: "Dragon",
            companyName: "Dragon",
            travelRequestId: "65719fa874eb31742e095c0a",
            cashAdvanceId: "65719fa874eb31742e09ca0a",
            createdBy: { empId: "empL001", name: "Luffy" },
            createdFor: { empId: "empL001", name: "Luffy" },
            cashAdvanceStatus: "pending approval",
            cashAdvanceState: "section 0",
            amountDetails: [
              {
                amount: 19000.0,
                currency: "INR",
                mode: "UPI",
              },
            ],
            approvers: [
              {
                empId: "empG001",
                name: "Garp",
                status: "pending approval",
              },
              {
                empId: "empG002",
                name: "Gates",
                status: "pending approval",
              },
            ],
            cashAdvanceRequestDate: new Date(),
            cashAdvanceApprovalDate: new Date(),
            cashAdvanceSettlementDate: new Date(),
            cashAdvanceViolations: [],
            cashAdvanceRejectionReason: "",
            notificationSentToDashboardFlag: true,
          },
        ],
      },    
];

export { travelRequest, cashAdvances };
