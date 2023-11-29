const travelRequests = [
    {
        "tenantId": "tenant123",
        "travelRequestId": "TR001",
        "tripPurpose": "Business Meeting",
        "travelRequestStatus": "booked",
        "travelRequestState": "section 5",
        "createdBy": { empId: "empL001", name: "Luffy" },
        "createdFor": [
            { empId: "empL001", name: "Luffy" },
        ],
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
          "departureDate": "2023-11-15",
          "arrivalDate": "2023-11-17"
        },
        "travelDocuments": ["Passport", "Visa"],
        "bookings": [
          {
            "vendorName": "Airline A",
            "billNumber": "B001",
            "billDescription": "Flight ticket",
            "grossAmount": 1500.0,
            "taxes": 50.0,
            "date": "2023-11-01",
            "imageUrl": "https://example.com/receipt1.jpg"
          },
          {
            "vendorName": "Hotel X",
            "billNumber": "B002",
            "billDescription": "Hotel stay",
            "grossAmount": 3300.0,
            "taxes": 30.0,
            "date": "2023-11-14",
            "imageUrl": "https://example.com/receipt2.jpg"
          }
        ],
        "approvers": [
          {
            "empId": "empG001",
            "name": "Garp",
            "status": "approved"
          },
          {
            "empId": "empM001",
            "name": "MarcoPolo",
            "status": "approved"
          }
        ],
        "preferences": ["Window seat", "Non-smoking room"],
        "travelViolations": {
          "violationType": "None",
          "violationDetails": ""
        },
        "travelRequestDate": "2023-10-28",
        "travelBookingDate": "2023-10-31",
        "travelCompletionDate": "2023-11-17",
        "travelRequestRejectionReason": "Not enough budget allocated",
        "travelAndNonTravelPolicies": {
          "policyType": "Business Travel",
          "policyDetails": "Comply with company travel policy"
        }
      },
      {
        "tenantId": "tenant123",
        "travelRequestId": "TR002",
        "tripPurpose": "Business Meeting",
        "travelRequestStatus": "booked",
        "travelRequestState": "section 5",
        "createdBy": { empId: "empL001", name: "Luffy" },
        "createdFor": [
            { empId: "empL001", name: "Luffy" },
        ],
        "teamMembers": [],
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
          "departureDate": "2023-11-15",
          "arrivalDate": "2023-11-17"
        },
        "travelDocuments": ["Passport", "Visa"],
        "bookings": [
          {
            "vendorName": "Airline A",
            "billNumber": "B001",
            "billDescription": "Flight ticket",
            "grossAmount": 500.0,
            "taxes": 50.0,
            "date": "2023-11-01",
            "imageUrl": "https://example.com/receipt1.jpg"
          },
          {
            "vendorName": "Hotel X",
            "billNumber": "B002",
            "billDescription": "Hotel stay",
            "grossAmount": 300.0,
            "taxes": 30.0,
            "date": "2023-11-14",
            "imageUrl": "https://example.com/receipt2.jpg"
          }
        ],
        "approvers": [
          {
            "empId": "empG001",
            "name": "Garp",
            "status": "approved"
          },
          {
            "empId": "empM001",
            "name": "MarcoPolo",
            "status": "approved"
          }
        ],
        "preferences": ["Window seat", "Non-smoking room"],
        "travelViolations": {
          "violationType": "None",
          "violationDetails": ""
        },
        "travelRequestDate": "2023-10-28",
        "travelBookingDate": "2023-10-31",
        "travelCompletionDate": "2023-11-17",
        "travelRequestRejectionReason": "Not enough budget allocated",
        "travelAndNonTravelPolicies": {
          "policyType": "Business Travel",
          "policyDetails": "Comply with company travel policy"
        }
      },
      {
        "tenantId": "tenant123",
        "travelRequestId": "TR003",
        "tripPurpose": "Business Meeting",
        "travelRequestStatus": "booked",
        "travelRequestState": "section 5",
        "createdBy": { empId: "empL001", name: "Luffy" },
        "createdFor": [
            { empId: "empN001", name: "Nami" },
        ],
        "teamMembers": [],
        "travelAllocationHeaders": [
          {
            "department": "Engineering",
            "percentage": 60
          },
          {
            "department": "Marketing",
            "percentage": 40
          }
        ],
        "itinerary": {
          "departureCity": "Delhi",
          "arrivalCity": "Mumbai",
          "departureDate": "2023-11-25",
          "arrivalDate": "2023-11-27"
        },
        "travelDocuments": ["Passport"],
        "bookings": [
          {
            "vendorName": "Akasa Airlines",
            "billNumber": "B00112",
            "billDescription": "Flight ticket",
            "grossAmount": 7500.0,
            "taxes": 50.0,
            "date": "2023-11-01",
            "imageUrl": "https://example.com/receipt1.jpg"
          },
          {
            "vendorName": "Hotel Hapleaf",
            "billNumber": "B002",
            "billDescription": "Hotel stay",
            "grossAmount": 9300.0,
            "taxes": 30.0,
            "date": "2023-11-14",
            "imageUrl": "https://example.com/receipt2.jpg"
          }
        ],
        "approvers": [
          {
            "empId": "empG001",
            "name": "Garp",
            "status": "approved"
          },
        ],
        "preferences": ["Window seat", "Non-smoking room"],
        "travelViolations": {
          "violationType": "None",
          "violationDetails": ""
        },
        "travelRequestDate": "2023-10-28",
        "travelBookingDate": "2023-10-31",
        "travelCompletionDate": "2023-11-27",
        "travelRequestRejectionReason": "",
        "travelAndNonTravelPolicies": {
          "policyType": "Business Travel",
          "policyDetails": "Comply with company travel policy"
        }
      }
  ];

const cashAdvances = [ 
    {
    tenantId: "tenant123",
    travelRequestId: "TR001",
    embeddedTravelRequest: {
      "tenantId": "tenant123",
      "travelRequestId": "TR001",
      "tripPurpose": "Business Meeting",
      "travelRequestStatus": "booked",
      "travelRequestState": "section 5",
      "createdBy": { empId: "empL001", name: "Luffy" },
      "createdFor": [
        { empId: "empL001", name: "Luffy" },
      ],
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
        "departureDate": "2023-11-15",
        "arrivalDate": "2023-11-17"
      },
      "travelDocuments": ["Passport", "Visa"],
      "bookings": [
        {
          "vendorName": "Airline A",
          "billNumber": "B001",
          "billDescription": "Flight ticket",
          "grossAmount": 500.0,
          "taxes": 50.0,
          "date": "2023-11-01",
          "imageUrl": "https://example.com/receipt1.jpg"
        },
        {
          "vendorName": "Hotel X",
          "billNumber": "B002",
          "billDescription": "Hotel stay",
          "grossAmount": 300.0,
          "taxes": 30.0,
          "date": "2023-11-14",
          "imageUrl": "https://example.com/receipt2.jpg"
        }
      ],
      "approvers": [
        {
          "empId": "empG001",
          "name": "Garp",
          "status": "approved"
        },
        {
          "empId": "empM001",
          "name": "MarcoPolo",
          "status": "approved"
        },
      ],
      "preferences": ["Window seat", "Non-smoking room"],
      "travelViolations": {
        "violationType": "None",
        "violationDetails": ""
      },
      "travelRequestDate": "2023-10-28",
      "travelBookingDate": "2023-10-31",
      "travelCompletionDate": "2023-11-17",
      "travelRequestRejectionReason": "Not enough budget allocated",
      "travelAndNonTravelPolicies": {
        "policyType": "Business Travel",
        "policyDetails": "Comply with company travel policy"
      },
    },
    cashAdvances: [
      {
        tenantId: "tenant123",
        travelRequestId: "TR001",
        cashAdvanceId: "CA002",
        createdBy: { empId: "empL001", name: "Luffy" },
        createdFor: { empId: "empL001", name: "Luffy" },
        cashAdvanceStatus: "draft",
        cashAdvanceState: "section 0",
        amountDetails: [
          {
            amount: 150.0,
            currency: "USD",
            mode: "Credit Card",
          },
        ],
        approvers: [
          {
            empId: "empG001",
            name: "Garp",
            status: "approved",
          },
        ],
        cashAdvanceRequestDate: new Date(),
        cashAdvanceApprovalDate: new Date(),
        cashAdvanceSettlementDate: new Date(),
        cashAdvanceViolations: [],
        cashAdvanceRejectionReason: "",
        notificationSentToDashboardFlag: false,
      },
      {
        tenantId: "tenant123",
        travelRequestId: "TR001",
        cashAdvanceId: "CA002A",
        createdBy: { empId: "empL001", name: "Luffy" },
        createdFor: { empId: "empL001", name: "Luffy" },
        cashAdvanceStatus: "paid",
        cashAdvanceState: "section 1",
        amountDetails: [
          {
            amount: 150.0,
            currency: "INR",
            mode: "Credit Card",
          },
        ],
        approvers: [
          {
            empId: "empG001",
            name: "Garp",
            status: "approved",
          },
        ],
        cashAdvanceRequestDate: new Date(),
        cashAdvanceApprovalDate: new Date(),
        cashAdvanceSettlementDate: new Date(),
        cashAdvanceViolations: [],
        cashAdvanceRejectionReason: "",
        notificationSentToDashboardFlag: false,
      },
    ],
  },
  {
        tenantId: "tenant123",
        travelRequestId: "TR002",
        embeddedTravelRequest: {
          "tenantId": "tenant123",
          "travelRequestId": "TR002",
          "tripPurpose": "Business Meeting",
          "travelRequestStatus": "booked",
          "travelRequestState": "section 5",
          "createdBy": { empId: "empL001", name: "Luffy" },
          "createdFor": [
            { empId: "empL001", name: "Luffy" },
          ],
          "teamMembers": [],
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
            "departureDate": "2023-11-15",
            "arrivalDate": "2023-11-17"
          },
          "travelDocuments": ["Passport", "Visa"],
          "bookings": [
            {
              "vendorName": "Airline A",
              "billNumber": "B001",
              "billDescription": "Flight ticket",
              "grossAmount": 500.0,
              "taxes": 50.0,
              "date": "2023-11-01",
              "imageUrl": "https://example.com/receipt1.jpg"
            },
            {
              "vendorName": "Hotel X",
              "billNumber": "B002",
              "billDescription": "Hotel stay",
              "grossAmount": 300.0,
              "taxes": 30.0,
              "date": "2023-11-14",
              "imageUrl": "https://example.com/receipt2.jpg"
            }
          ],
          "approvers": [
            {
              "empId": "empG001",
              "name": "Garp",
              "status": "approved"
            },
            {
              "empId": "empM001",
              "name": "MarcoPolo",
              "status": "approved"
            }
          ],
          "preferences": ["Window seat", "Non-smoking room"],
          "travelViolations": {
            "violationType": "None",
            "violationDetails": ""
          },
          "travelRequestDate": "2023-10-28",
          "travelBookingDate": "2023-10-31",
          "travelCompletionDate": "2023-11-17",
          "travelRequestRejectionReason": "Not enough budget allocated",
          "travelAndNonTravelPolicies": {
            "policyType": "Business Travel",
            "policyDetails": "Comply with company travel policy"
          }
        },
        cashAdvances: [
          {
            tenantId: "tenant123",
            travelRequestId: "TR002",
            cashAdvanceId: "CA001",
            createdBy: { empId: "empL001", name: "Luffy" },
            createdFor: { empId: "empL001", name: "Luffy" },
            cashAdvanceStatus: "draft",
            cashAdvanceState: "section 0",
            amountDetails: [
              {
                amount: 100.0,
                currency: "USD",
                mode: "Credit Card",
              },
            ],
            approvers: [
              {
                empId: "empG001",
                name: "Garp",
                status: "approved",
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
      {
        tenantId: "tenant123",
        travelRequestId: "TR003",
        embeddedTravelRequest: {
          "tenantId": "tenant123",
          "travelRequestId": "TR003",
          "tripPurpose": "Business Meeting",
          "travelRequestStatus": "booked",
          "travelRequestState": "section 5",
          "createdBy": { empId: "empL001", name: "Luffy" },
          "createdFor": { empId: "empN001", name: "Nami" }, // Changed to object
          "teamMembers": [],
          "travelAllocationHeaders": [
            {
              "department": "Engineering",
              "percentage": 60
            },
            {
              "department": "Marketing",
              "percentage": 40
            }
          ],
          "itinerary": {
            "departureCity": "Delhi",
            "arrivalCity": "Mumbai",
            "departureDate": "2023-11-25",
            "arrivalDate": "2023-11-27"
          },
          "travelDocuments": ["Passport"],
          "bookings": [
            {
              "vendorName": "Akasa Airlines",
              "billNumber": "B00112",
              "billDescription": "Flight ticket",
              "grossAmount": 7500.0,
              "taxes": 50.0,
              "date": "2023-11-01",
              "imageUrl": "https://example.com/receipt1.jpg"
            },
            {
              "vendorName": "Hotel Hapleaf",
              "billNumber": "B002",
              "billDescription": "Hotel stay",
              "grossAmount": 9300.0,
              "taxes": 30.0,
              "date": "2023-11-14",
              "imageUrl": "https://example.com/receipt2.jpg"
            }
          ],
          "approvers": [
            {
              "empId": "empG001",
              "name": "Garp",
              "status": "approved"
            },
          ],
          "preferences": ["Window seat", "Non-smoking room"],
          "travelViolations": {
            "violationType": "None",
            "violationDetails": ""
          },
          "travelRequestDate": "2023-10-28",
          "travelBookingDate": "2023-10-31",
          "travelCompletionDate": "2023-11-27",
          "travelRequestRejectionReason": "",
          "travelAndNonTravelPolicies": {
            "policyType": "Business Travel",
            "policyDetails": "Comply with company travel policy"
          }
        },
        cashAdvances: [
          {
            tenantId: "tenant123",
            travelRequestId: "TR003",
            cashAdvanceId: "CA003",
            createdBy: { empId: "empL001", name: "Luffy" },
            createdFor: { empId: "empN001", name: "Nami" }, // Changed to object
            cashAdvanceStatus: "paid",
            cashAdvanceState: "section 1",
            amountDetails: [
              {
                amount: 1200.0,
                currency: "INR",
                mode: "Credit Card",
              },
            ],
            approvers: [
              {
                empId: "empG001",
                name: "Garp",
                status: "approved",
              },
            ],
            cashAdvanceRequestDate: new Date(),
            cashAdvanceApprovalDate: new Date(),
            cashAdvanceSettlementDate: new Date(),
            cashAdvanceViolations: [],
            cashAdvanceRejectionReason: "",
            notificationSentToDashboardFlag: false,
          },
        ],
      },      
];

export { travelRequests, cashAdvances };