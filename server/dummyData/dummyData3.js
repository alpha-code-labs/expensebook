const travelRequests = [
    {
        "tenantId": "tenant123",
        "travelRequestId": "tenant123_emp000003_tr_001",
        "createdBy": "emp000003",
        "createdFor": [
            "emp000003",
            "emp000188"
        ],
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "travelRequestDate": "2023-09-14",
        "travelBookingDate": "2023-09-22",
        "travelCompletionDate": "2023-09-27",
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
    },
    {
        "tenantId": "tenant123",
        "travelRequestId": "tenant123_emp000003_tr_001",
        "createdBy": "emp000003",
        "createdFor": [
            "emp001129"
        ],
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "travelRequestDate": "2023-09-14",
        "travelBookingDate": "2023-09-22",
        "travelCompletionDate": "2024-09-27",
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
    },
    {
        "tenantId": "tenant123",
        "travelRequestId": "tenant123_emp000004_tr_001",
        "createdBy": "emp000004",
        "createdFor": [
            "emp01029"
        ],
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "travelRequestDate": "2023-09-14",
        "travelBookingDate": "2023-09-22",
        "travelCompletionDate": "2024-09-27",
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
        "travelRequestId": "tenant123_emp000003_tr_001",
        "createdBy": "emp000003",
        "createdFor": [
            "emp000003",
            "emp000188"
        ],
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "travelRequestDate": "2023-09-14",
        "travelBookingDate": "2023-09-22",
        "travelCompletionDate": "2024-09-27",
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
        "cashAdvanceId": "tenant123_emp000003_ca_001",
        "employeeId": "emp000003",
        "cashAdvanceAmount": 1000,
        "cashAdvanceCurrency": "USD",
        "cashAdvanceIssuedDate": "2023-09-14",
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
        "travelRequestId": "tenant123_emp000003_tr_001",
        "createdBy": "emp000003",
        "createdFor": [
            "emp001129"
        ],
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "travelRequestDate": "2023-09-14",
        "travelBookingDate": "2024-09-16",
        "travelCompletionDate": "2024-09-27",
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
        "cashAdvanceId": "tenant123_emp000003_ca_001",
        "employeeId": "emp000003",
        "cashAdvanceAmount": 800,
        "cashAdvanceCurrency": "USD",
        "cashAdvanceIssuedDate": "2023-09-14",
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
        "travelRequestId": "tenant123_emp000004_tr_001",
        "createdBy": "emp000004",
        "createdFor": [
            "emp01029"
        ],
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "travelRequestDate": "2023-09-14",
        "travelBookingDate": "2023-09-22",
        "travelCompletionDate": "2023-09-22",
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
        "cashAdvanceId": "tenant123_emp000004_ca_001",
        "employeeId": "emp000004",
        "cashAdvanceAmount": 1200,
        "cashAdvanceCurrency": "USD",
        "cashAdvanceIssuedDate": "2023-09-14",
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
