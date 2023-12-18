export const tripDummyData = {
    "tenantId":"TNTABG",
    "tenantName":"AdithyaBirlaGroup",
    "companyName":"AdithyaBirlaGroup",
    "tripId":"TRIPABG000001",
    "userId": "empL001",
    "tripPurpose":"to expanding bussiness operations",
    "tripStatus":"upcoming",
    "tripStartDate":"2023-12-16T15:30:00.000Z",
    "tripCompletionDate":"2023-12-29T15:30:00.000Z",
    "notificationSentToDashboardFlag":true,
          "travelRequestId": "TRABG000001",
          "tripPurpose": "Delhi Branch Opening",
          "travelRequestStatus": "booked",
          "travelRequestState": "section 3",
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
              "formState": [
                {
                  "formId": "form123",
                  "transfers": {
                    "needsDeparturePickup": true,
                    "needsDepartureDrop": true,
                    "needsReturnPickup": false,
                    "needsReturnDrop": true
                  },
                  "needsHotel": true,
                  "needsCab": false,
                  "needsVisa": true,
                  "cancellationDate": " ",
                  "cancellationReason": "Change in travel plans",
                  "formStatus": "Submitted"
                }
              ],
              "flights": [
                {
                  "itineraryId": "5fec83753a4959001771449a",
                  "formId": "form123",
                  "from": "Mumbai",
                  "to": "Delhi",
                  "date": "2023-12-16T15:30:00.000Z"            ,
                  "time": "11:00",
                  "travelClass": "Business Class",
                  "violations": {
                    "class": "Type A",
                    "amount": "100 USD"
                  },
                  "bkd_from": "Mumbai",
                  "bkd_to": "Delhi",
                  "bkd_date": "2023-12-21T15:30:00.000Z"            ,
                  "bkd_time": "12:20",
                  "bkd_travelClass": "Business Class",
                  "bkd_violations": {
                    "class": "Type A",
                    "amount": "100 USD"
                  },
                  "modified": false,
                  "cancellationDate": "",
                  "cancellationReason": "Flight canceled by airline",
                  "status": "booked",
                  "bookingDetails": {
                    "docURL": "https://example.com/booking.pdf",
                    "docType": "PDF",
                    "billDetails": {}
                  }
                }
              ],
              cabs: [
                {
                  itineraryId: "5fec83753a4959001771449b",
                  formId: "form124",
                  date: "2023-12-20T15:30:00.000Z",
                  class: "Sedan",
                  preferredTime: "10:00",
                  pickupAddress: "Address 1",
                  dropAddress: "Address 2",
                  violations: {
                    class: "Type B",
                    amount: "80 USD"
                  },
                  bkd_date: "2023-12-20T15:30:00.000Z",
                  bkd_class: "Sedan",
                  bkd_preferredTime: "10:00",
                  bkd_pickupAddress: "Address 1",
                  bkd_dropAddress: "Address 2",
                  bkd_violations: {
                    class: "Type B",
                    amount: "80 USD"
                  },
                  modified: false,
                  cancellationDate: "",
                  cancellationReason: "",
                  status: "booked",
                  bookingDetails: {
                    docURL: "https://example.com/cab-booking.pdf",
                    docType: "PDF",
                    billDetails: {}
                  },
                  type: "departure pickup"
                },
              ],
              hotels: [
                {
                  itineraryId: "5fec83753a4959001771449c",
                  formId: "form125",
                  location: "Hotel ABC",
                  locationPreference: "Near Airport",
                  class: "Luxury",
                  checkIn: "2023-12-18T15:30:00.000Z",
                  checkOut: "2023-12-22T15:30:00.000Z",
                  violations: {
                    class: "Type C",
                    amount: "120 USD"
                  },
                  bkd_location: "Hotel ABC",
                  bkd_class: "Luxury",
                  bkd_checkIn: "2023-12-18T15:30:00.000Z",
                  bkd_checkOut: "2023-12-22T15:30:00.000Z",
                  bkd_violations: {
                    class: "Type C",
                    amount: "120 USD"
                  },
                  modified: false,
                  cancellationDate: "",
                  cancellationReason: "",
                  status: "booked",
                  bookingDetails: {
                    docURL: "https://example.com/hotel-booking.pdf",
                    docType: "PDF",
                    billDetails: {}
                  }
                },
                {
                    itineraryId: "5fec83753a4959001771449c",
                    formId: "form125",
                    location: "Hotel ABC",
                    locationPreference: "Near Airport",
                    class: "Luxury",
                    checkIn: "2023-12-18T15:30:00.000Z",
                    checkOut: "2023-12-22T15:30:00.000Z",
                    violations: {
                      class: "Type C",
                      amount: "120 USD"
                    },
                    bkd_location: "Hotel ABC",
                    bkd_class: "Luxury",
                    bkd_checkIn: "2023-12-18T15:30:00.000Z",
                    bkd_checkOut: "2023-12-22T15:30:00.000Z",
                    bkd_violations: {
                      class: "Type C",
                      amount: "120 USD"
                    },
                    modified: false,
                    cancellationDate: "",
                    cancellationReason: "",
                    status: "booked",
                    bookingDetails: {
                      docURL: "https://example.com/hotel-booking.pdf",
                      docType: "PDF",
                      billDetails: {}
                    }
                  },
              ],
              buses: [
                {
                  itineraryId: "5fec83753a4959001771449d",
                  formId: "form126",
                  from: "City A",
                  to: "City B",
                  date: "2023-12-19T15:30:00.000Z",
                  time: "08:00",
                  travelClass: "Sleeper",
                  violations: {
                    class: "Type D",
                    amount: "70 USD"
                  },
                  bkd_from: "City A",
                  bkd_to: "City B",
                  bkd_date: "2023-12-19T15:30:00.000Z",
                  bkd_time: "08:00",
                  bkd_travelClass: "Sleeper",
                  modified: false,
                  cancellationDate: "",
                  cancellationReason: "",
                  status: "booked",
                  bookingDetails: {
                    docURL: "https://example.com/bus-booking.pdf",
                    docType: "PDF",
                    billDetails: {}
                  }
                }
              ]
            },
          "travelDocuments": ["Passport", "Visa"],
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
          "travelRequestDate": "2023-12-08T15:30:00.000Z"    ,
          "travelBookingDate": "2023-12-16T15:30:00.000Z"    ,
          "travelCompletionDate": "2023-12-29T15:30:00.000Z",
          "travelRequestRejectionReason": "Not enough budget allocated",
          "travelAndNonTravelPolicies": {
            "policyType": "Business Travel",
            "policyDetails": "Comply with company travel policy"
          },
        cashAdvances: [
          {
            tenantId: "TNTABG",
            tenantName: "AdithyaBirlaGroup",
            companyName: "AdithyaBirlaGroup",
            travelRequestId: "TRABG000001",
            cashAdvanceId: "CAABG000001",
            createdBy: { empId: "empL001", name: "Luffy" },
            createdFor: { empId: "empL001", name: "Luffy" },
            cashAdvanceStatus: "approved",
            cashAdvanceState: "section 0",
            amountDetails: [
              {
                amount: 6900.0,
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
            cashAdvanceRequestDate: "2023-12-08T15:30:00.000Z" ,
            cashAdvanceApprovalDate: "2023-12-15T15:30:00.000Z" ,
            cashAdvanceSettlementDate: "2023-12-19T10:40:00.000Z",
            cashAdvanceViolations: [],
            cashAdvanceRejectionReason: "funds excess transferred",
            notificationSentToDashboardFlag: true,
          },
          {
            tenantId: "TNTABG",
            tenantName: "AdithyaBirlaGroup",
            companyName: "AdithyaBirlaGroup",
            travelRequestId: "TRABG000001",
            cashAdvanceId: "CAAM000001",
            createdBy: { empId: "empL001", name: "Luffy" },
            createdFor: { empId: "empL001", name: "Luffy" },
            cashAdvanceStatus: "paid",
            cashAdvanceState: "section 0",
            amountDetails: [
              {
                amount: 8000.0,
                currency: "INR",
                mode: "UPI",
              },
            ],
            approvers: [
              {
                empId: "empG001",
                name: "Garp",
                status: "approved",
              },
            ],
            cashAdvanceRequestDate: "2023-12-08T15:30:00.000Z",
            cashAdvanceApprovalDate: "2023-12-08T05:30:00.000Z",
            cashAdvanceSettlementDate: "2023-12-19T10:40:00.000Z",
            cashAdvanceViolations: [],
            cashAdvanceRejectionReason: "reason",
            notificationSentToDashboardFlag: true,
          },
        ],   
}