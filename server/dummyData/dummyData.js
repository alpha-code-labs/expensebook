const travelRequests = [
    {
        "tenantId": "tenant123",
        "travelRequestId": "tenant123_emp000079_tr_001",
        "createdBy": "emp000079",
        "travelName":"gutenburg branch meeting",
        "createdFor": [
            "emp000079",
            "emp000188"
        ],
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "travelRequestDate": "2023-11-29",
        "travelBookingDate": "2023-10-10",
        "travelCompletionDate": "2023-10-29",
        "travelAndNonTravelPolicies": {
            "travelPolicy": {
                "InternationalPolicy": {},
                "domesticPolicy": {},
                "localPolicy": {}
            },
            "nonTravelPolicy": {}
        },
        "itinerary": {
            "departureCity": "New York",
            "arrivalCity": "Guntenburg",
            "departureDate": "2023-10-19",
            "returnDate": "2023-10-30",
            "hotels": [
                "Hotel A",
                "Hotel B"
            ],
            "cabs": [
                "Cab X",
                "Cab Y"
            ],
            "flights": [
                "Flight 123",
                "Flight 456"
            ]
        },
        "travelDocuments": [
            "Document 1.pdf",
            "Document 2.pdf"
        ],
        "bookings": [
            {
                "vendorName": "Hotel A",
                "billNumber": "12345",
                "billDescription": "Hotel stay for 5 nights",
                "grossAmount": 500,
                "taxes": 50,
                "date": "2023-09-16",
                "imageUrl": "https://example.com/hotel_receipt.jpg"
            },
            {
                "vendorName": "Flight 123",
                "billNumber": "67890",
                "billDescription": "Round-trip flight ticket",
                "grossAmount": 300,
                "taxes": 30,
                "date": "2023-09-17",
                "imageUrl": "https://example.com/flight_receipt.jpg"
            }
        ],
        "approvers": [
            "approver1",
            "approver2"
        ],
        "preferences": [
            "preference1",
            "preference2"
        ],
        "travelViolations": [
            "violation1",
            "violation2"
        ],
        "travelRequestRejectionReason": "Not approved due to budget constraints"
    },
    {
        "tenantId": "tenant123",
        "travelRequestId": "tenant123_emp000079_tr_001",
        "createdBy": "emp000079",
        "travelName":"mysore team meeting",
        "createdFor": [
            "emp001129"
        ],
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "travelRequestDate": "2023-11-29",
        "travelBookingDate": "2023-12-27",
        "travelCompletionDate": "2024-12-29",
        "travelAndNonTravelPolicies": {
            "travelPolicy": {
                "InternationalPolicy": {},
                "domesticPolicy": {},
                "localPolicy": {}
            },
            "nonTravelPolicy": {}
        },
        "itinerary": {
            "departureCity": "Munich",
            "arrivalCity": "mysore",
            "departureDate": "2023-11-25",
            "returnDate": "2023-11-30",
            "hotels": [
                "Hotel A",
                "Hotel B"
            ],
            "cabs": [
                "Cab X",
                "Cab Y"
            ],
            "flights": [
                "Flight 123",
                "Flight 456"
            ]
        },
        "travelDocuments": [
            "Document 1.pdf",
            "Document 2.pdf"
        ],
        "bookings": [
            {
                "vendorName": "Hotel A",
                "billNumber": "12345",
                "billDescription": "Hotel stay for 5 nights",
                "grossAmount": 500,
                "taxes": 50,
                "date": "2023-09-16",
                "imageUrl": "https://example.com/hotel_receipt.jpg"
            },
            {
                "vendorName": "Flight 123",
                "billNumber": "67890",
                "billDescription": "Round-trip flight ticket",
                "grossAmount": 300,
                "taxes": 30,
                "date": "2023-09-17",
                "imageUrl": "https://example.com/flight_receipt.jpg"
            }
        ],
        "approvers": [
            "approver1",
            "approver2"
        ],
        "preferences": [
            "preference1",
            "preference2"
        ],
        "travelViolations": [
            "violation1",
            "violation2"
        ],
        "travelRequestRejectionReason": "Not approved due to budget constraints"
    },
    {
        "tenantId": "tenant123",
        "travelRequestId": "tenant123_emp000080_tr_001",
        "createdBy": "emp000080",
        "travelName":"poland Investors meeting",
        "createdFor": [
            "emp01029"
        ],
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "travelRequestDate": "2023-11-22",
        "travelBookingDate": "2023-12-25",
        "travelCompletionDate": "2024-12-29",
        "travelAndNonTravelPolicies": {
            "travelPolicy": {
                "InternationalPolicy": {},
                "domesticPolicy": {},
                "localPolicy": {}
            },
            "nonTravelPolicy": {}
        },
        "itinerary": {
            "departureCity": "New York",
            "arrivalCity": "Los Angeles",
            "departureDate": "2023-09-25",
            "returnDate": "2023-09-30",
            "hotels": [
                "Hotel A",
                "Hotel B"
            ],
            "cabs": [
                "Cab X",
                "Cab Y"
            ],
            "flights": [
                "Flight 123",
                "Flight 456"
            ]
        },
        "travelDocuments": [
            "Document 1.pdf",
            "Document 2.pdf"
        ],
        "bookings": [
            {
                "vendorName": "Hotel A",
                "billNumber": "12345",
                "billDescription": "Hotel stay for 5 nights",
                "grossAmount": 500,
                "taxes": 50,
                "date": "2023-09-16",
                "imageUrl": "https://example.com/hotel_receipt.jpg"
            },
            {
                "vendorName": "Flight 123",
                "billNumber": "67890",
                "billDescription": "Round-trip flight ticket",
                "grossAmount": 300,
                "taxes": 30,
                "date": "2023-09-17",
                "imageUrl": "https://example.com/flight_receipt.jpg"
            }
        ],
        "approvers": [
            "approver1",
            "approver2"
        ],
        "preferences": [
            "preference1",
            "preference2"
        ],
        "travelViolations": [
            "violation1",
            "violation2"
        ],
        "travelRequestRejectionReason": "Not approved due to budget constraints"
    }
  ];

const cashAdvances = [
    {
        "tenantId": "tenant123",
        "travelRequestId": "tenant123_emp000079_tr_001",
        "createdBy": "emp000079",
        "createdFor": [
            "emp000079",
            "emp000188"
        ],
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "travelRequestDate": "2023-11-29",
        "travelBookingDate": "2024-12-27",
        "travelCompletionDate": "2024-12-29",
        "travelAndNonTravelPolicies": {
            "travelPolicy": {
                "InternationalPolicy": {},
                "domesticPolicy": {},
                "localPolicy": {}
            },
            "nonTravelPolicy": {}
        },
        "itinerary": {
            "departureCity": "New York",
            "arrivalCity": "Los Angeles",
            "departureDate": "2023-09-25",
            "returnDate": "2023-09-30",
            "hotels": [
                "Hotel A",
                "Hotel B"
            ],
            "cabs": [
                "Cab X",
                "Cab Y"
            ],
            "flights": [
                "Flight 123",
                "Flight 456"
            ]
        },
        "travelDocuments": [
            "Document 1.pdf",
            "Document 2.pdf"
        ],
        "bookings": [
            {
                "vendorName": "Hotel A",
                "billNumber": "12345",
                "billDescription": "Hotel stay for 5 nights",
                "grossAmount": 500,
                "taxes": 50,
                "date": "2023-09-16",
                "imageUrl": "https://example.com/hotel_receipt.jpg"
            },
            {
                "vendorName": "Flight 123",
                "billNumber": "67890",
                "billDescription": "Round-trip flight ticket",
                "grossAmount": 300,
                "taxes": 30,
                "date": "2023-09-17",
                "imageUrl": "https://example.com/flight_receipt.jpg"
            }
        ],
        "approvers": [
            "approver1",
            "approver2"
        ],
        "preferences": [
            "preference1",
            "preference2"
        ],
        "travelViolations": [
            "violation1",
            "violation2"
        ],
        "travelRequestRejectionReason": "Not approved due to budget constraints",
        "cashAdvanceId": "tenant123_emp000079_ca_001",
        "employeeId": "emp000079",
        "cashAdvanceAmount": 1000,
        "cashAdvanceCurrency": "USD",
        "cashAdvanceIssuedDate": "2023-11-29",
        "cashAdvancePurpose": "Travel expenses",
        "cashAdvanceStatus": "approved",
        "cashAdvanceApprover": "approver1",
        "cashAdvanceDisbursementDate": "2023-09-15",
        "cashAdvanceDisbursementMethod": "bank transfer",
        "cashAdvanceBankDetails": {
            "bankName": "Bank X",
            "accountHolder": "John Doe",
            "accountNumber": "123456789",
            "routingNumber": "987654321"
        }
    },
    {
        "tenantId": "tenant123",
        "travelRequestId": "tenant123_emp000079_tr_001",
        "createdBy": "emp000079",
        "createdFor": [
            "emp001129"
        ],
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "travelRequestDate": "2023-11-29",
        "travelBookingDate": "2024-09-16",
        "travelCompletionDate": "2024-12-29",
        "travelAndNonTravelPolicies": {
            "travelPolicy": {
                "InternationalPolicy": {},
                "domesticPolicy": {},
                "localPolicy": {}
            },
            "nonTravelPolicy": {}
        },
        "itinerary": {
            "departureCity": "New York",
            "arrivalCity": "Los Angeles",
            "departureDate": "2023-09-25",
            "returnDate": "2023-09-30",
            "hotels": [
                "Hotel A",
                "Hotel B"
            ],
            "cabs": [
                "Cab X",
                "Cab Y"
            ],
            "flights": [
                "Flight 123",
                "Flight 456"
            ]
        },
        "travelDocuments": [
            "Document 1.pdf",
            "Document 2.pdf"
        ],
        "bookings": [
            {
                "vendorName": "Hotel A",
                "billNumber": "12345",
                "billDescription": "Hotel stay for 5 nights",
                "grossAmount": 500,
                "taxes": 50,
                "date": "2023-09-16",
                "imageUrl": "https://example.com/hotel_receipt.jpg"
            },
            {
                "vendorName": "Flight 123",
                "billNumber": "67890",
                "billDescription": "Round-trip flight ticket",
                "grossAmount": 300,
                "taxes": 30,
                "date": "2023-09-17",
                "imageUrl": "https://example.com/flight_receipt.jpg"
            }
        ],
        "approvers": [
            "approver1",
            "approver2"
        ],
        "preferences": [
            "preference1",
            "preference2"
        ],
        "travelViolations": [
            "violation1",
            "violation2"
        ],
        "travelRequestRejectionReason": "Not approved due to budget constraints",
        "cashAdvanceId": "tenant123_emp000079_ca_001",
        "employeeId": "emp000079",
        "cashAdvanceAmount": 800,
        "cashAdvanceCurrency": "USD",
        "cashAdvanceIssuedDate": "2023-11-29",
        "cashAdvancePurpose": "Travel expenses",
        "cashAdvanceStatus": "approved",
        "cashAdvanceApprover": "approver2",
        "cashAdvanceDisbursementDate": "2023-09-15",
        "cashAdvanceDisbursementMethod": "check",
        "cashAdvanceCheckDetails": {
            "payeeName": "John Doe",
            "checkNumber": "12345"
        }
    },
    {
        "tenantId": "tenant123",
        "travelRequestId": "tenant123_emp000080_tr_001",
        "createdBy": "emp000080",
        "createdFor": [
            "emp01029"
        ],
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "travelRequestDate": "2023-11-29",
        "travelBookingDate": "2024-12-27",
        "travelCompletionDate": "2024-12-27",
        "travelAndNonTravelPolicies": {
            "travelPolicy": {
                "InternationalPolicy": {},
                "domesticPolicy": {},
                "localPolicy": {}
            },
            "nonTravelPolicy": {}
        },
        "itinerary": {
            "departureCity": "Rio",
            "arrivalCity": "Oslo",
            "departureDate": "2023-09-25",
            "returnDate": "2023-09-30",
            "hotels": [
                "Hotel A",
                "Hotel B"
            ],
            "cabs": [
                "Cab X",
                "Cab Y"
            ],
            "flights": [
                "Flight 123",
                "Flight 456"
            ]
        },
        "travelDocuments": [
            "Document 1.pdf",
            "Document 2.pdf"
        ],
        "bookings": [
            {
                "vendorName": "Hotel A",
                "billNumber": "12345",
                "billDescription": "Hotel stay for 5 nights",
                "grossAmount": 500,
                "taxes": 50,
                "date": "2023-09-16",
                "imageUrl": "https://example.com/hotel_receipt.jpg"
            },
            {
                "vendorName": "Flight 123",
                "billNumber": "67890",
                "billDescription": "Round-trip flight ticket",
                "grossAmount": 300,
                "taxes": 30,
                "date": "2023-09-17",
                "imageUrl": "https://example.com/flight_receipt.jpg"
            }
        ],
        "approvers": [
            "approver1",
            "approver2"
        ],
        "preferences": [
            "preference1",
            "preference2"
        ],
        "travelViolations": [
            "violation1",
            "violation2"
        ],
        "travelRequestRejectionReason": "Not approved due to budget constraints",
        "cashAdvanceId": "tenant123_emp000080_ca_001",
        "employeeId": "emp000080",
        "cashAdvanceAmount": 1200,
        "cashAdvanceCurrency": "USD",
        "cashAdvanceIssuedDate": "2023-11-29",
        "cashAdvancePurpose": "Travel expenses",
        "cashAdvanceStatus": "approved",
        "cashAdvanceApprover": "approver1",
        "cashAdvanceDisbursementDate": "2023-09-15",
        "cashAdvanceDisbursementMethod": "bank transfer",
        "cashAdvanceBankDetails": {
            "bankName": "Bank Y",
            "accountHolder": "Jane Smith",
            "accountNumber": "987654321",
            "routingNumber": "123456789"
        }
    }
        
];

export { travelRequests, cashAdvances };
