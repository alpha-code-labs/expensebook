const travelRequests = 
  {
    "tenantId": "TNTBAMBOOHR",
    "tenantName": "BambooHr",
    "companyName": "BambooHr",
    "travelRequestId": "TNTBAMBOOHR_Luffy_tr_#1",
    "tripPurpose": "Business Trip",
    "travelRequestStatus": "booked",
    "travelRequestState": "section 0",
    "createdBy": {
      "empId": "empL001",
      "name": "Luffy"
    },
    "createdFor": {
      "empId": "empZ001",
      "name": "Zoro"
    },
    "teamMembers": [
      {"empId": "empN001", "name": "Nami"},
      {"empId": "empU001", "name": "Usopp"}
    ],
    "travelAllocationHeaders": [
      {"allocationType": "Flights", "allocationAmount": 1000},
      {"allocationType": "Hotels", "allocationAmount": 800}
    ],
    itinerary: {
      "formState": [
        {
          "formId": "Form1",
          "transfers": {
            "needsDeparturePickup": true,
            "needsDepartureDrop": false,
            "needsReturnPickup": true,
            "needsReturnDrop": false
          },
          "needsHotel": true,
          "needsCab": false,
          "needsVisa": true,
          "cancellationDate": null,
          "cancellationReason": null,
          "formStatus": "booked"
        },
        {
          "formId": "Form2",
          "transfers": {
            "needsDeparturePickup": false,
            "needsDepartureDrop": true,
            "needsReturnPickup": false,
            "needsReturnDrop": true
          },
          "needsHotel": false,
          "needsCab": true,
          "needsVisa": false,
          "cancellationDate": "2023-12-15",
          "cancellationReason": "Change of plans",
          "formStatus": "Cancelled"
        }
      ],
    
      "flights": [
        {
          "itineraryId": "5f72f04e2d1c6b4e234b49c1",
          "formId": "Form1",
          "from": "CityA",
          "to": "CityB",
          "date": "2023-12-20",
          "time": "10:00 AM",
          "travelClass": "Business",
          "isReturnTravel": "No",
          "violations": {
            "class": "None",
            "amount": "0"
          },
          "bkd_from": "CityA",
          "bkd_to": "CityB",
          "bkd_date": "2023-12-20",
          "bkd_time": "10:00 AM",
          "bkd_travelClass": "Business",
          "bkd_isReturnTravel": "No",
          "modified": false,
          "cancellationDate": null,
          "cancellationReason": null,
          "status": "booked",
          "bookingDetails": {
            "docURL": "https://example.com/ticket",
            "docType": "E-Ticket",
            "billDetails": {}
          }
        },
        {
          "itineraryId": "5f72f04e2d1c6b4e234b49c2",
          "formId": "Form2",
          "from": "CityX",
          "to": "CityY",
          "date": "2023-12-25",
          "time": "2:00 PM",
          "travelClass": "Economy",
          "isReturnTravel": "Yes",
          "violations": {
            "class": "Overweight",
            "amount": "50"
          },
          "bkd_from": "CityX",
          "bkd_to": "CityY",
          "bkd_date": "2023-12-25",
          "bkd_time": "2:00 PM",
          "bkd_travelClass": "Economy",
          "bkd_isReturnTravel": "Yes",
          "modified": true,
          "cancellationDate": "2023-12-22",
          "cancellationReason": "Change of plans",
          "status": "booked",
          "bookingDetails": {
            "docURL": "https://example.com/ticket-cancelled",
            "docType": "E-Ticket",
            "billDetails": {}
          }
        }
      ],
    
      "buses": [
        {
          "itineraryId": "6123456789abcdef01234567",
          "formId": "B001",
          "from": "CityA",
          "to": "CityB",
          "date": "2023-12-10",
          "time": "12:00 PM",
          "travelClass": "Economy",
          "isReturnTravel": "No",
          "violations": {
            "class": "ClassA",
            "amount": "50"
          },
          "bkd_from": "CityA",
          "bkd_to": "CityB",
          "bkd_date": "2023-12-10",
          "bkd_time": "12:00 PM",
          "bkd_travelClass": "Economy",
          "bkd_isReturnTravel": "No",
          "modified": false,
          "cancellationDate": null,
          "cancellationReason": null,
          "status": "booked",
          "bookingDetails": {
            "docURL": "http://example.com/ticket",
            "docType": "PDF",
            "billDetails": {}
          }
        },
        {
          "itineraryId": "6123456789abcdef01234568",
          "formId": "B002",
          "from": "CityC",
          "to": "CityD",
          "date": "2023-12-12",
          "time": "02:00 PM",
          "travelClass": "Business",
          "isReturnTravel": "Yes",
          "violations": {
            "class": "ClassB",
            "amount": "75"
          },
          "bkd_from": "CityC",
          "bkd_to": "CityD",
          "bkd_date": "2023-12-12",
          "bkd_time": "02:00 PM",
          "bkd_travelClass": "Business",
          "bkd_isReturnTravel": "Yes",
          "modified": false,
          "cancellationDate": null,
          "cancellationReason": null,
          "status": "booked",
          "bookingDetails": {
            "docURL": "http://example.com/ticket2",
            "docType": "PDF",
            "billDetails": {}
          }
        }
      ],
    
      "trains": [
        {
          "itineraryId": "6123456789abcdef01234569",
          "formId": "T001",
          "from": "StationX",
          "to": "StationY",
          "date": "2023-12-15",
          "time": "08:00 AM",
          "travelClass": "Sleeper",
          "isReturnTravel": "No",
          "violations": {
            "class": "ClassC",
            "amount": "60"
          },
          "bkd_from": "StationX",
          "bkd_to": "StationY",
          "bkd_date": "2023-12-15",
          "bkd_time": "08:00 AM",
          "bkd_travelClass": "Sleeper",
          "bkd_isReturnTravel": "No",
          "bkd_violations": {
            "class": "ClassD",
            "amount": "80"
          },
          "modified": false,
          "cancellationDate": null,
          "cancellationReason": null,
          "status": "booked",
          "bookingDetails": {
            "docURL": "http://example.com/ticket3",
            "docType": "PDF",
            "billDetails": {}
          }
        },
        {
          "itineraryId": "6123456789abcdef0123456a",
          "formId": "T002",
          "from": "StationZ",
          "to": "StationW",
          "date": "2023-12-18",
          "time": "10:30 AM",
          "travelClass": "AC",
          "isReturnTravel": "Yes",
          "violations": {
            "class": "ClassE",
            "amount": "90"
          },
          "bkd_from": "StationZ",
          "bkd_to": "StationW",
          "bkd_date": "2023-12-18",
          "bkd_time": "10:30 AM",
          "bkd_travelClass": "AC",
          "bkd_isReturnTravel": "Yes",
          "bkd_violations": {
            "class": "ClassF",
            "amount": "100"
          },
          "modified": false,
          "cancellationDate": null,
          "cancellationReason": null,
          "status": "booked",
          "bookingDetails": {
            "docURL": "http://example.com/ticket4",
            "docType": "PDF",
            "billDetails": {}
          }
        }
      ],
    
      "hotels": [
        {
          "itineraryId": "6123456789abcdef0123456b",
          "formId": "H001",
          "location": "CityX",
          "locationPreference": "Downtown",
          "class": "Luxury",
          "checkIn": "2023-12-20",
          "checkOut": "2023-12-25",
          "violations": {
            "class": "ClassG",
            "amount": "120"
          },
          "bkd_location": "CityX",
          "bkd_class": "Luxury",
          "bkd_checkIn": "2023-12-20",
          "bkd_checkOut": "2023-12-25",
          "bkd_violations": {
            "class": "ClassH",
            "amount": "150"
          },
          "modified": false,
          "cancellationDate": null,
          "cancellationReason": null,
          "status": "booked",
          "bookingDetails": {
            "docURL": "http://example.com/bookingconfirmation",
            "docType": "PDF",
            "billDetails": {}
          }
        },
        {
          "itineraryId": "6123456789abcdef0123456c",
          "formId": "H002",
          "location": "CityY",
          "locationPreference": "Suburb",
          "class": "Standard",
          "checkIn": "2023-12-28",
          "checkOut": "2024-01-02",
          "violations": {
            "class": "ClassI",
            "amount": "80"
          },
          "bkd_location": "CityY",
          "bkd_class": "Standard",
          "bkd_checkIn": "2023-12-28",
          "bkd_checkOut": "2024-01-02",
          "bkd_violations": {
            "class": "ClassJ",
            "amount": "100"
          },
          "modified": false,
          "cancellationDate": null,
          "cancellationReason": null,
          "status": "booked",
          "bookingDetails": {
            "docURL": "http://example.com/bookingconfirmation2",
            "docType": "PDF",
            "billDetails": {}
          }
        }
      ],
    
      "cabs": [
        {
          "itineraryId": "6123456789abcdef0123456d",
          "formId": "C001",
          "date": "2023-12-22",
          "class": "Sedan",
          "preferredTime": "09:00 AM",
          "pickupAddress": "LocationA",
          "dropAddress": "LocationB",
          "isReturnTravel": "No",
          "violations": {
            "class": "ClassK",
            "amount": "40"
          },
          "bkd_date": "2023-12-22",
          "bkd_class": "Sedan",
          "bkd_preferredTime": "09:00 AM",
          "bkd_pickupAddress": "LocationA",
          "bkd_dropAddress": "LocationB",
          "bkd_isReturnTravel": "No",
          "bkd_violations": {
            "class": "ClassL",
            "amount": "60"
          },
          "modified": false,
          "cancellationDate": null,
          "cancellationReason": null,
          "status": "booked",
          "bookingDetails": {
            "docURL": "http://example.com/cabbooking",
            "docType": "PDF",
            "billDetails": {}
          },
          "type": "departure pickup"
        },
        {
          "itineraryId": "6123456789abcdef0123456e",
          "formId": "C002",
          "date": "2023-12-30",
          "class": "SUV",
          "preferredTime": "03:00 PM",
          "pickupAddress": "LocationC",
          "dropAddress": "LocationD",
          "isReturnTravel": "Yes",
          "violations": {
            "class": "ClassM",
            "amount": "50"
          },
          "bkd_date": "2023-12-30",
          "bkd_class": "SUV",
          "bkd_preferredTime": "03:00 PM",
          "bkd_pickupAddress": "LocationC",
          "bkd_dropAddress": "LocationD",
          "bkd_isReturnTravel": "Yes",
          "bkd_violations": {
            "class": "ClassN",
            "amount": "70"
          },
          "modified": false,
          "cancellationDate": null,
          "cancellationReason": null,
          "status": "booked",
          "bookingDetails": {
            "docURL": "http://example.com/cabbooking2",
            "docType": "PDF",
            "billDetails": {}
          },
        }
      ] },
              "approvers": [
                {
                  "empId": "empM001",
                  "name": "Sanji",
                  "status": "approved"
                },
                {
                  "empId": "empR001",
                  "name": "Robin",
                  "status": "approved"
                }
              ],
              "preferences": ["Window seat", "Non-smoking room"],
              "travelViolations": {},
              "travelRequestDate": "2023-12-08T15:30:00.000Z",
              "assignedTo": {"empId": "empZ001", "name": "Zoro"},
              "bookedBy": {"empId": "empL001", "name": "Luffy"},
              "travelBookingDate": "2023-12-16T15:30:00.000Z",
              "travelCompletionDate": "2023-12-29T15:30:00.000Z",
              "travelRequestRejectionReason": "Not enough budget allocated",
              "isCancelled": false,
              "cancellationDate": '',
              "cancellationReason": '',
              "isCashAdvanceTaken": true,

            }
      
const cashAdvances = [ 
            {
              tenantId: "TNTBAMBOOHR",
              tenantName: "BambooHr",
              companyName: "BambooHr",
              travelRequestId: "TRBHR000001",
              cashAdvanceId: "CABHR000001",
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
              tenantId: "TNTBAMBOOHR",
              tenantName: "BambooHr",
              companyName: "BambooHr",
              travelRequestId: "TRBHR000001",
              cashAdvanceId: "CABHR000002",
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
    ]

export { travelRequests, cashAdvances};













