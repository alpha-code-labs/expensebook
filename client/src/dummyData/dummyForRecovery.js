const dummyForRecovery = {
    tripNumber:"TRIP000000232",
    tenantId: "TNTABG",
    tenantName: "Example Tenant",
    companyName: "Example Company",
    userId: {
      empId: "exampleEmpId",
      name: "John Doe",
    },
    tripId: "6587f7d3f1bc28bda7fd77d4",
    
    tripPurpose: "Business Trip",
    tripStatus: "paid and cancelled",
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
            status: "paid and recover",
            bookingDetails: {
              docURL: "exampleDocURL",
              docType: "exampleDocType",
              billDetails: {},
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
            status: "paid and recover",
            bookingDetails: {
              docURL: "exampleDocURL",
              docType: "exampleDocType",
              billDetails: {},
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
              bkd_date: "2024-02-18T00:00:00.000Z",
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
                billDetails: {},
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
                billDetails: {},
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
                billDetails: {},
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
                billDetails: {},
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
              bkd_checkIn: "2024-02-11T00:00:00.000Z",
              bkd_checkOut: "2023-12-07",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleHotelDocURL",
                docType: "exampleHotelDocType",
                billDetails: {},
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
              bkd_checkIn: "2024-02-18T00:00:00.000Z",
              bkd_checkOut: "2023-12-07",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleHotelDocURL",
                docType: "exampleHotelDocType",
                billDetails: {},
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
              bkd_date: "2024-02-18T00:00:00.000Z",
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
                billDetails: {},
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
  };
  
  export default dummyForRecovery

  

//   "trip": {
//     "expenseAmountStatus": {
//         "totalCashAmount": 0,
//         "totalAlreadyBookedExpenseAmount": 0,
//         "totalExpenseAmount": 0,
//         "totalPersonalExpenseAmount": 0,
//         "totalremainingCash": 0
//     },
//     "travelRequestData": {
//         "itinerary": {
//             "formState": [],
//             "flights": [
//                 {
//                     "violations": {
//                         "class": null,
//                         "amount": null
//                     },
//                     "bkd_violations": {
//                         "class": null,
//                         "amount": null
//                     },
//                     "bookingDetails": {
//                         "billDetails": {
//                             "vendorName": "Book My Trip",
//                             "taxAmount": "500",
//                             "totalAmount": "6500"
//                         },
//                         "docURL": null,
//                         "docType": null
//                     },
//                     "itineraryId": "65c5df2dcf52af3ac3026c55",
//                     "formId": "travel_8d8d4e61-e1b1-4573-806b-05ab941e18dc",
//                     "from": "Delhi",
//                     "to": "Mumbai",
//                     "date": "2024-02-25T00:00:00.000Z",
//                     "returnDate": "2024-03-05T00:00:00.000Z",
//                     "time": "16:00",
//                     "returnTime": "17:00",
//                     "travelClass": null,
//                     "isReturnTravel": false,
//                     "approvers": [
//                         {
//                             "empId": "1004",
//                             "name": "Shivam Chauhan",
//                             "status": "approved",
//                             "_id": "65c5df2dcf52af3ac3026c50"
//                         }
//                     ],
//                     "bkd_from": "Delhi",
//                     "bkd_to": "Mumbai",
//                     "bkd_date": "2024-02-24T00:00:00.000Z",
//                     "bkd_time": "08:00",
//                     "bkd_returnTime": null,
//                     "bkd_travelClass": null,
//                     "modified": false,
//                     "cancellationDate": null,
//                     "cancellationReason": null,
//                     "rejectionReason": null,
//                     "status": "booked",
//                     "_id": "65c5df2dcf52af3ac3026c4f"
//                 }
//             ],
//             "buses": [],
//             "trains": [
//                 {
//                     "violations": {
//                         "class": null,
//                         "amount": null
//                     },
//                     "bkd_violations": {
//                         "class": null,
//                         "amount": "Allowed limit exceeded"
//                     },
//                     "bookingDetails": {
//                         "billDetails": {
//                             "vendorName": "IRCTC",
//                             "taxAmount": "500",
//                             "totalAmount": "30000"
//                         },
//                         "docURL": null,
//                         "docType": null
//                     },
//                     "itineraryId": null,
//                     "formId": "travel_0fd6a966-5c55-4f5f-812c-9e4e8e9c6f68",
//                     "from": "Delhi",
//                     "to": "Jaipur",
//                     "date": "2024-02-27T00:00:00.000Z",
//                     "time": "16:00",
//                     "travelClass": null,
//                     "approvers": [
//                         {
//                             "empId": "1004",
//                             "name": "Shivam Chauhan",
//                             "status": "approved",
//                             "_id": "65c5df2dcf52af3ac3026c52"
//                         }
//                     ],
//                     "bkd_from": "Delhi",
//                     "bkd_to": "Jaipur",
//                     "bkd_date": "2024-02-27T00:00:00.000Z",
//                     "bkd_time": "16:00",
//                     "bkd_travelClass": null,
//                     "modified": false,
//                     "cancellationDate": null,
//                     "cancellationReason": null,
//                     "rejectionReason": null,
//                     "status": "booked",
//                     "_id": "65c5df2dcf52af3ac3026c51"
//                 }
//             ],
//             "hotels": [
//                 {
//                     "violations": {
//                         "class": null,
//                         "amount": null
//                     },
//                     "bkd_violations": {
//                         "class": null,
//                         "amount": "Allowed limit exceeded"
//                     },
//                     "bookingDetails": {
//                         "billDetails": {
//                             "vendorName": "Taj Hotels",
//                             "taxAmount": "2950",
//                             "totalAmount": "500"
//                         },
//                         "docURL": null,
//                         "docType": null
//                     },
//                     "itineraryId": "65c5df2dcf52af3ac3026c56",
//                     "location": "Jaipur",
//                     "locationPreference": null,
//                     "class": null,
//                     "checkIn": "Sun Feb 25 2024 05:30:00 GMT+0530 (India Standard Time)",
//                     "checkOut": "Tue Feb 27 2024 05:30:00 GMT+0530 (India Standard Time)",
//                     "approvers": [
//                         {
//                             "empId": "1004",
//                             "name": "Shivam Chauhan",
//                             "status": "approved",
//                             "_id": "65c5df2dcf52af3ac3026c54"
//                         }
//                     ],
//                     "bkd_location": "Jaipur",
//                     "bkd_class": null,
//                     "bkd_checkIn": "Sun Feb 25 2024 05:30:00 GMT+0530 (India Standard Time)",
//                     "bkd_checkOut": "Tue Feb 27 2024 05:30:00 GMT+0530 (India Standard Time)",
//                     "modified": false,
//                     "cancellationDate": null,
//                     "cancellationReason": null,
//                     "status": "booked",
//                     "_id": "65c5df2dcf52af3ac3026c53"
//                 }
//             ],
//             "cabs": [
//                 {
//                     "violations": {
//                         "class": null,
//                         "amount": null
//                     },
//                     "bookingDetails": {
//                         "billDetails": {
//                             "vendorName": "Uber",
//                             "taxAmount": "170",
//                             "totalAmount": "900"
//                         },
//                         "docURL": null,
//                         "docType": null
//                     },
//                     "itineraryId": "65c7bb73a0ed26b8a99ab4ab",
//                     "formId": "travel_68e28c13-e5fa-4f36-bfbd-0b4c6b37aa72",
//                     "date": "2024-02-29",
//                     "class": null,
//                     "time": "14:00",
//                     "pickupAddress": "A-32, Shanti Nagar, Merrut",
//                     "dropAddress": "B-55 Om Nagar, Merrut",
//                     "approvers": [
//                         {
//                             "empId": "1004",
//                             "name": "Shivam Chauhan",
//                             "status": "approved",
//                             "_id": "65c72a46cf52af3ac3026cee"
//                         }
//                     ],
//                     "bkd_date": "2024-02-29T00:00:00.000Z",
//                     "bkd_class": null,
//                     "bkd_time": "14:00",
//                     "bkd_pickupAddress": "A-32 Delhi",
//                     "bkd_dropAddress": "B-7 somewhere",
//                     "modified": false,
//                     "cancellationDate": null,
//                     "cancellationReason": null,
//                     "status": "booked",
//                     "type": "regular",
//                     "_id": "65c7bb73a0ed26b8a99ab4a9"
//                 }
//             ],
//             "carRentals": [],
//             "personalVehicles": []
//         },
//         "tripType": {
//             "oneWayTrip": true,
//             "roundTrip": false,
//             "multiCityTrip": false
//         },
//         "tenantId": "65c5c3bef21cc9ab3038e21f",
//         "tenantName": "Studio Innovate",
//         "companyName": "Studio Innovate",
//         "travelRequestId": "65c5dec8cf52af3ac3026c46",
//         "travelRequestNumber": "TRST000000",
//         "travelType": "international",
//         "tripPurpose": "Business",
//         "travelRequestStatus": "booked",
//         "travelRequestState": "section 0",
//         "createdBy": {
//             "empId": "1002",
//             "name": "Kanhaiya Verma",
//             "_id": "65c5df2dcf52af3ac3026c4e"
//         },
//         "createdFor": null,
//         "teamMembers": [],
//         "travelAllocationHeaders": [
//             {
//                 "headerName": "department",
//                 "headerValue": "HR"
//             },
//             {
//                 "headerName": "legalEntity",
//                 "headerValue": "Sudio Innovate"
//             },
//             {
//                 "headerName": "department",
//                 "headerValue": "Finance"
//             }
//         ],
//         "travelDocuments": [],
//         "bookings": [],
//         "approvers": [
//             {
//                 "empId": "1004",
//                 "name": "Shivam Chauhan",
//                 "status": "pending approval",
//                 "_id": "65c72a46cf52af3ac3026cee"
//             }
//         ],
//         "preferences": [],
//         "travelViolations": {
//             "tripPurpose": null,
//             "class": null,
//             "amount": null,
//             "tripPurposeViolationMesssage": null
//         },
//         "travelRequestDate": "2024-02-11T12:26:50.523Z",
//         "cancellationDate": null,
//         "isCancelled": false,
//         "cancellationReason": null,
//         "isCashAdvanceTaken": true,
//         "sentToTrip": false,
//         "_id": "65c5dec8cf52af3ac3026c47"
//     },
//     "_id": "65c8c90e1a60fe75c58bf101",
//     "cashAdvancesData": [
//         {
//             "createdBy": {
//                 "empId": "1002",
//                 "name": "Kanhaiya Verma"
//             },
//             "tenantId": "65c5c3bef21cc9ab3038e21f",
//             "travelRequestId": "65c5dec8cf52af3ac3026c46",
//             "travelRequestNumber": "TRST000000",
//             "cashAdvanceId": "65c8c90e1a60fe75c58bf100",
//             "cashAdvanceNumber": "CA0001",
//             "cashAdvanceStatus": "pending approval",
//             "cashAdvanceState": "section 0",
//             "amountDetails": [
//                 {
//                     "amount": 5000,
//                     "currency": {
//                         "fullName": "United States Dollar",
//                         "shortName": "USD",
//                         "symbol": "$",
//                         "countryCode": "US"
//                     },
//                     "mode": null,
//                     "_id": "65c8c90e1a60fe75c58bf10e"
//                 }
//             ],
//             "approvers": [
//                 {
//                     "empId": "1004",
//                     "name": "Shivam Chauhan",
//                     "status": "pending approval",
//                     "_id": "65c72a46cf52af3ac3026cee"
//                 }
//             ],
//             "cashAdvanceRequestDate": "2024-02-11T13:45:41.662Z",
//             "cashAdvanceApprovalDate": null,
//             "cashAdvanceSettlementDate": null,
//             "cashAdvanceViolations": "Cash Advance exceeds maximum allowed limit of 50000",
//             "cashAdvanceRejectionReason": null,
//             "_id": "65c8c90e1a60fe75c58bf10d"
//         },
//         {
//             "createdBy": {
//                 "empId": "1002",
//                 "name": "Kanhaiya Verma"
//             },
//             "tenantId": "65c5c3bef21cc9ab3038e21f",
//             "travelRequestId": "65c5dec8cf52af3ac3026c46",
//             "travelRequestNumber": "TRST000000",
//             "cashAdvanceId": "65c9b9d3f2f3d0444f4e9c2f",
//             "cashAdvanceNumber": "CA0001",
//             "cashAdvanceStatus": "pending approval",
//             "cashAdvanceState": "section 0",
//             "amountDetails": [
//                 {
//                     "amount": 900,
//                     "currency": {
//                         "fullName": "Australian Dollar",
//                         "shortName": "AUD",
//                         "symbol": "A$",
//                         "countryCode": "AU"
//                     },
//                     "mode": null,
//                     "_id": "65c9b9d3f2f3d0444f4e9c35"
//                 }
//             ],
//             "approvers": [
//                 {
//                     "empId": "1004",
//                     "name": "Shivam Chauhan",
//                     "status": "pending approval",
//                     "_id": "65c72a46cf52af3ac3026cee"
//                 }
//             ],
//             "cashAdvanceRequestDate": "2024-02-12T08:25:42.191Z",
//             "cashAdvanceApprovalDate": null,
//             "cashAdvanceSettlementDate": null,
//             "cashAdvanceViolations": "Cash Advance exceeds maximum allowed limit of 50000",
//             "cashAdvanceRejectionReason": null,
//             "_id": "65c9b9d3f2f3d0444f4e9c34"
//         },
//         {
//             "createdBy": {
//                 "empId": "1002",
//                 "name": "Kanhaiya Verma"
//             },
//             "tenantId": "65c5c3bef21cc9ab3038e21f",
//             "travelRequestId": "65c5dec8cf52af3ac3026c46",
//             "travelRequestNumber": "TRST000000",
//             "travelType": "international",
//             "cashAdvanceId": "65c9d6c447379a04a6ecbe26",
//             "cashAdvanceNumber": "CA0003",
//             "cashAdvanceStatus": "draft",
//             "cashAdvanceState": "section 0",
//             "amountDetails": [
//                 {
//                     "amount": 0,
//                     "currency": {
//                         "countryCode": "IN",
//                         "fullName": "Indian Rupee",
//                         "shortName": "INR",
//                         "symbol": "₹"
//                     },
//                     "mode": null,
//                     "_id": "65c9d6c447379a04a6ecbe32"
//                 }
//             ],
//             "approvers": [
//                 {
//                     "empId": "1004",
//                     "name": "Shivam Chauhan",
//                     "status": "pending approval",
//                     "_id": "65c72a46cf52af3ac3026cee"
//                 }
//             ],
//             "cashAdvanceRequestDate": "2024-02-12T08:28:52.156Z",
//             "cashAdvanceApprovalDate": null,
//             "cashAdvanceSettlementDate": null,
//             "cashAdvanceViolations": null,
//             "cashAdvanceRejectionReason": null,
//             "_id": "65c9d6c447379a04a6ecbe31"
//         },
//         {
//             "createdBy": {
//                 "empId": "1002",
//                 "name": "Kanhaiya Verma"
//             },
//             "tenantId": "65c5c3bef21cc9ab3038e21f",
//             "travelRequestId": "65c5dec8cf52af3ac3026c46",
//             "travelRequestNumber": "TRST000000",
//             "travelType": "international",
//             "cashAdvanceId": "65c9d61647379a04a6ecbdb8",
//             "cashAdvanceNumber": "CA0002",
//             "cashAdvanceStatus": "cancelled",
//             "cashAdvanceState": "section 0",
//             "amountDetails": [
//                 {
//                     "amount": 5000,
//                     "currency": {
//                         "countryCode": "IN",
//                         "fullName": "Indian Rupee",
//                         "shortName": "INR",
//                         "symbol": "₹"
//                     },
//                     "mode": "Cheque",
//                     "_id": "65c9d61647379a04a6ecbdc1"
//                 }
//             ],
//             "approvers": [
//                 {
//                     "empId": "1004",
//                     "name": "Shivam Chauhan",
//                     "status": "pending approval",
//                     "_id": "65c72a46cf52af3ac3026cee"
//                 }
//             ],
//             "cashAdvanceRequestDate": "2024-02-12T08:26:52.805Z",
//             "cashAdvanceApprovalDate": null,
//             "cashAdvanceSettlementDate": null,
//             "cashAdvanceRejectionReason": null,
//             "_id": "65c9d61647379a04a6ecbdc0"
//         }
//     ],
//     "__v": 0,
//     "tenantId": "65c5c3bef21cc9ab3038e21f",
//     "tripStatus": "upcoming",
//     "tripCompletionDate": "2024-02-29T14:00:00.000Z",
//     "tripStartDate": "2024-02-24T08:00:00.000Z",
//     "tripNumber": "TRIP-STU000001",
//     "isSentToExpense": false,
//     "notificationSentToDashboardFlag": false,
//     "tripId": "65cdbcb3d76b04b8a121ff84",
//     "travelExpenseData": []
// }
// }