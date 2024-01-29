export const dummyData = [{
                  tenantId: "tenant123",
                  tenantName: "Example Company",
                  companyName: "ABC Corp",
                  travelRequestId: "tenant123_createdBy_tr_#123",
                  embdedTravelRequest:{
                  tenantId: "tenant123",
                  tenantName: "Example Company",
                  companyName: "ABC Corp",
                  travelRequestId: "tenant123_createdBy_tr_#123",
                  tripPurpose: "Business Meeting",
                  travelRequestStatus: "draft",
                  travelRequestState: "section 0",
                  createdBy: { empId: "emp001", name: "John Doe" },
                  createdFor: { empId: "emp001", name: "Jane Doe" },
                  teamMembers: [{ empId: "emp0r3", name: "Jane Doe" },{ empId: "emp022", name: " Doe" }],
                  travelAllocationHeaders: [],
                  itinerary: [

                    {
                      departure: {
                        itineraryId: 'DPR_XYZ0GF',
                        from: "City A",
                        to: "City B",
                        date: "2023-12-01",
                        time: "09:00 AM",
                        modified: false,
                        isCancelled: false,
                        status: "draft",
                        bookingDetails: {
                          docURL: "http://example.com/document.pdf",
                          docType: "PDF",
                          billDetails: {},
                        },
                      },
                      return: {
                        itineraryId: 'RTN_XYRE7',
                        from: "City B",
                        to: "City A",
                        date: "2023-12-10",
                        time: "05:00 PM",
                        modified: false,
                        isCancelled: false,
                        status: "draft",
                        bookingDetails: {
                          docURL: "http://example.com/document.pdf",
                          docType: "PDF",
                          billDetails: {},
                        },
                      },
                      hotels: [
                        {
                          location: "Hotel X",
                          class: "5-star",
                          checkIn: "2023-12-01",
                          checkOut: "2023-12-05",
                          violations: {
                            class: "None",
                            amount: "0",
                          },
                          modified: false,
                          isCancelled: false,
                          status: "draft",
                          bookingDetails: {
                            docURL: "http://example.com/document.pdf",
                            docType: "PDF",
                            billDetails: {},
                          },
                        },
                      ],
                      cabs: [
                        {
                          date: "2023-12-01",
                          class: "Sedan",
                          preferredTime: "10:00 AM",
                          pickupAddress: "Office Address",
                          dropAddress: "Hotel X",
                          violations: {
                            class: "None",
                            amount: "0",
                          },
                          modified: false,
                          isCancelled: false,
                          status: "draft",
                          bookingDetails: {
                            docURL: "http://example.com/document.pdf",
                            docType: "PDF",
                            billDetails: {},
                          },
                        },
                      ],
                      modeOfTransit: "Flight",
                      travelClass: "Business",
                      needsVisa: false,
                      needsBoardingTransfer: true,
                      needsHotelTransfer: true,
                      boardingTransfer: {
                        date: "2023-12-01",
                        class: "Business",
                        preferredTime: "08:00 AM",
                        pickupAddress: "Hotel X",
                        dropAddress: "Airport",
                        violations: {
                          class: "None",
                          amount: "0",
                        },
                        modified: false,
                        isCancelled: false,
                        status: "draft",
                        bookingDetails: {
                          docURL: "http://example.com/document.pdf",
                          docType: "PDF",
                          billDetails: {},
                        },
                      },
                      hotelTransfer: {
                        date: "2023-12-05",
                        class: "Business",
                        preferredTime: "04:00 PM",
                        pickupAddress: "Airport",
                        dropAddress: "Hotel X",
                        violations: {
                          class: "None",
                          amount: "0",
                        },
                        modified: false,
                        isCancelled: false,
                        status: "draft",
                        bookingDetails: {
                          docURL: "http://example.com/document.pdf",
                          docType: "PDF",
                          billDetails: {},
                        },
                      },
                      needsHotel: true,
                      needsCab: true,
                      isCancelled: false,
                      cancellationDate: "",
                      cancellationReason: "",
                      status: "draft",
                      modeOfTransitViolations: {
                        class: "Bussiness",
                        amount: "$500",
                      },
                      itineraryId: '0076767',
                    },
                  ],
                  tripType: { oneWayTrip: true, roundTrip: false, multiCityTrip: false },
                  travelDocuments: ["http://example.com/document1.pdf", "http://example.com/document2.pdf"],
                  bookings: [
                    {
                      itineraryReference: {},
                      docURL: "http://example.com/document.pdf",
                      details: {},
                      status: {},
                    },
                  ],
                  approvers: [
                    { empId: "approver001", name: "Manager A", status: "pending approval" },
                    { empId: "approver002", name: "Manager B", status: "approved" },
                  ],
                  preferences: ["Vegetarian Meal", "Non-Smoking Room"],
                  travelViolations: {},
                  travelRequestDate: "2023-11-30",
                  travelBookingDate: "2023-12-01",
                  travelCompletionDate: "",
                  travelRequestRejectionReason: "",
                  isCancelled: false,
                  cancellationDate: "",
                  cancellationReason: "",
                  isCashAdvanceTaken: "",
                  sentToTrip: false,
                },
                cashAdvances:[
                    // Cash Advance 1
                    {
                      tenantId: "tenant123",
                      travelRequestId: "tenant123_createdBy_tr_#123",
                      cashAdvanceId: "cashAdvance123",
                      createdBy: { empId: "emp001", name: "John Doe" },
                      cashAdvanceStatus: "draft",
                      cashAdvanceState: "section 0",
                      amountDetails: [
                        { amount: 500, currency: "USD", mode: "Credit Card" },
                        { amount: 300, currency: "EUR", mode: "Cash" },
                      ],
                      approvers: [
                        { empId: "approver001", name: "Manager A", status: "pending approval" },
                        { empId: "approver002", name: "Manager B", status: "approved" },
                      ],
                      cashAdvanceRequestDate: new Date("2023-12-01"),
                      cashAdvanceApprovalDate: null,
                      cashAdvanceSettlementDate: null,
                      cashAdvanceViolations: ["Exceeds policy limit"],
                      cashAdvanceRejectionReason: "",
                    },
                  
                    // Cash Advance 2
                    {
                      tenantId: "tenant456",
                      travelRequestId: "tenant456_createdBy_tr_#456",
                      cashAdvanceId: "cashAdvance456",
                      createdBy: { empId: "emp002", name: "Jane Doe" },
                      cashAdvanceStatus: "draft",
                      cashAdvanceState: "section 0",
                      amountDetails: [
                        { amount: 700, currency: "USD", mode: "Credit Card" },
                        { amount: 200, currency: "GBP", mode: "Cash" },
                      ],
                      approvers: [
                        { empId: "approver003", name: "Manager C", status: "pending approval" },
                        { empId: "approver004", name: "Manager D", status: "approved" },
                      ],
                      cashAdvanceRequestDate: new Date("2023-12-02"),
                      cashAdvanceApprovalDate: null,
                      cashAdvanceSettlementDate: null,
                      cashAdvanceViolations: ["No violations"],
                      cashAdvanceRejectionReason: "",
                    },
                  
                    // Cash Advance 3
                    {
                      tenantId: "tenant789",
                      travelRequestId: "tenant789_createdBy_tr_#789",
                      cashAdvanceId: "cashAdvance789",
                      createdBy: { empId: "emp003", name: "Bob Smith" },
                      cashAdvanceStatus: "draft",
                      cashAdvanceState: "section 0",
                      amountDetails: [
                        { amount: 800, currency: "USD", mode: "Credit Card" },
                        { amount: 150, currency: "EUR", mode: "Cash" },
                      ],
                      approvers: [
                        { empId: "approver005", name: "Manager E", status: "pending approval" },
                        { empId: "approver006", name: "Manager F", status: "approved" },
                      ],
                      cashAdvanceRequestDate: new Date("2023-12-03"),
                      cashAdvanceApprovalDate: null,
                      cashAdvanceSettlementDate: null,
                      cashAdvanceViolations: ["Exceeds policy limit"],
                      cashAdvanceRejectionReason: "",
                    },
                  ]
                }
              ];
              
             





export const travelRequestData = [{

                  
                  tenantId: "tenant123",
                  tenantName: "Example Company",
                  companyName: "ABC Corp",
                  travelRequestId: "tenant123_createdBy_tr_#123",
                  tripPurpose: "Business Meeting",
                  travelRequestStatus: "draft",
                  travelRequestState: "section 0",
                  createdBy: { empId: "emp001", name: "John Doe" },
                  createdFor: { empId: "emp001", name: "Jane Doe" },
                  teamMembers: [{ empId: "emp0r3", name: "Jane Doe" },{ empId: "emp022", name: " Doe" }],
                  travelAllocationHeaders: [],
                  itinerary: [

                    {
                      departure: {
                        itineraryId: 'DPR_XYZ0GF',
                        from: "City A",
                        to: "City B",
                        date: "2023-12-01",
                        time: "09:00 AM",
                        modified: false,
                        isCancelled: false,
                        status: "draft",
                        bookingDetails: {
                          docURL: "http://example.com/document.pdf",
                          docType: "PDF",
                          billDetails: {},
                        },
                      },
                      return: {
                        itineraryId: 'RTN_XYRE7',
                        from: "City B",
                        to: "City A",
                        date: "2023-12-10",
                        time: "05:00 PM",
                        modified: false,
                        isCancelled: false,
                        status: "draft",
                        bookingDetails: {
                          docURL: "http://example.com/document.pdf",
                          docType: "PDF",
                          billDetails: {},
                        },
                      },
                      hotels: [
                        {
                          location: "Hotel X",
                          class: "5-star",
                          checkIn: "2023-12-01",
                          checkOut: "2023-12-05",
                          violations: {
                            class: "None",
                            amount: "0",
                          },
                          modified: false,
                          isCancelled: false,
                          status: "draft",
                          bookingDetails: {
                            docURL: "http://example.com/document.pdf",
                            docType: "PDF",
                            billDetails: {},
                          },
                        },
                      ],
                      cabs: [
                        {
                          date: "2023-12-01",
                          class: "Sedan",
                          preferredTime: "10:00 AM",
                          pickupAddress: "Office Address",
                          dropAddress: "Hotel X",
                          violations: {
                            class: "None",
                            amount: "0",
                          },
                          modified: false,
                          isCancelled: false,
                          status: "draft",
                          bookingDetails: {
                            docURL: "http://example.com/document.pdf",
                            docType: "PDF",
                            billDetails: {},
                          },
                        },
                      ],
                      modeOfTransit: "Flight",
                      travelClass: "Business",
                      needsVisa: false,
                      needsBoardingTransfer: true,
                      needsHotelTransfer: true,
                      boardingTransfer: {
                        date: "2023-12-01",
                        class: "Business",
                        preferredTime: "08:00 AM",
                        pickupAddress: "Hotel X",
                        dropAddress: "Airport",
                        violations: {
                          class: "None",
                          amount: "0",
                        },
                        modified: false,
                        isCancelled: false,
                        status: "draft",
                        bookingDetails: {
                          docURL: "http://example.com/document.pdf",
                          docType: "PDF",
                          billDetails: {},
                        },
                      },
                      hotelTransfer: {
                        date: "2023-12-05",
                        class: "Business",
                        preferredTime: "04:00 PM",
                        pickupAddress: "Airport",
                        dropAddress: "Hotel X",
                        violations: {
                          class: "None",
                          amount: "0",
                        },
                        modified: false,
                        isCancelled: false,
                        status: "draft",
                        bookingDetails: {
                          docURL: "http://example.com/document.pdf",
                          docType: "PDF",
                          billDetails: {},
                        },
                      },
                      needsHotel: true,
                      needsCab: true,
                      isCancelled: false,
                      cancellationDate: "",
                      cancellationReason: "",
                      status: "draft",
                      modeOfTransitViolations: {
                        class: "Bussiness",
                        amount: "$500",
                      },
                      itineraryId: '0076767',
                    },
                  ],
                  tripType: { oneWayTrip: true, roundTrip: false, multiCityTrip: false },
                  travelDocuments: ["http://example.com/document1.pdf", "http://example.com/document2.pdf"],
                  bookings: [
                    {
                      itineraryReference: {},
                      docURL: "http://example.com/document.pdf",
                      details: {},
                      status: {},
                    },
                  ],
                  approvers: [
                    { empId: "approver001", name: "Manager A", status: "pending approval" },
                    { empId: "approver002", name: "Manager B", status: "approved" },
                  ],
                  preferences: ["Vegetarian Meal", "Non-Smoking Room"],
                  travelViolations: {},
                  travelRequestDate: "2023-11-30",
                  travelBookingDate: "2023-12-01",
                  travelCompletionDate: "",
                  travelRequestRejectionReason: "",
                  isCancelled: false,
                  cancellationDate: "",
                  cancellationReason: "",
                  isCashAdvanceTaken: "",
                  sentToTrip: false,
               
               
                }
              ];
  
              

             




