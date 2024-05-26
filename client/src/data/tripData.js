const trip = {
    "_id": { "$oid": "6603be4983f2d4546e4c281e" },
    "tenantId": "65f7d5442f8fdd7d542eed0700",
    "travelRequestData": {
      "itinerary": {
        "flights": [
          {
            "itineraryId": { "$oid": "6603bb535a8f60af9de10f3c" },
            "formId": "travel_8c90ca3a-4193-44c0-bcdd-82db2dedf865",
            "from": "Delhi",
            "to": "Lucknow",
            "date": { "$date": { "$numberLong": "1711584000000" } },
            "returnDate": null,
            "time": "16:00",
            "returnTime": null,
            "travelClass": null,
            "isReturnTravel": false,
            "violations": { "class": null, "amount": null },
            "approvers": [],
            "bkd_from": "Indira Gandhi International Airport",
            "bkd_to": "Chaudhary Charan Singh International Airport",
            "bkd_date": { "$date": { "$numberLong": "1711497600000" } },
            "bkd_returnDate": null,
            "bkd_time": null,
            "bkd_returnTime": null,
            "bkd_travelClass": null,
            "bkd_violations": { "class": null, "amount": null },
            "modified": false,
            "cancellationDate": null,
            "cancellationReason": null,
            "rejectionReason": null,
            "status": "booked",
            "bookingDetails": {
              "docURL": "https://blobstorage318.blob.core.windows.net/images/images/flight_ticket_1.pdf",
              "docType": null,
              "billDetails": {
                "vendorName": "Yatra",
                "taxAmount": "0",
                "totalAmount": "5258"
              }
            },
            "_id": { "$oid": "6603bb535a8f60af9de10f3b" }
          }
        ],
        "buses": [],
        "trains": [],
        "hotels": [],
        "cabs": [],
        "carRentals": [],
        "personalVehicles": [],
        "formState": []
      },
      "tripType": {
        "oneWayTrip": true,
        "roundTrip": false,
        "multiCityTrip": false
      },
      "tenantId": "65f7d5442f8fdd7d542eed07",
      "tenantName": "Studio Innovate",
      "companyName": "Studio Innovate",
      "travelRequestId": { "$oid": "6603fbbbaddb846073b1a565" },
      "travelRequestNumber": "TRST000045",
      "travelType": "international",
      "tripPurpose": "Business",
      "travelRequestStatus": "booked",
      "travelRequestState": "section 0",
      "createdBy": {
        "empId": "1001",
        "name": "Ajay Singh",
        "_id": { "$oid": "6603bb535a8f60af9de10f3a" }
      },
      "createdFor": null,
      "teamMembers": [],
      "travelAllocationHeaders": [
        { "headerName": "department", "headerValue": "Finance" },
        { "headerName": "legalEntity", "headerValue": "Company XYZ" }
      ],
      "travelDocuments": [],
      "bookings": [],
      "approvers": [],
      "preferences": [],
      "travelViolations": {
        "tripPurpose": null,
        "class": null,
        "amount": null,
        "tripPurposeViolationMesssage": null
      },
      "travelRequestDate": "2024-03-27T06:23:15.233Z",
      "cancellationDate": null,
      "isCancelled": false,
      "cancellationReason": null,
      "isCashAdvanceTaken": true,
      "isAddALeg": false,
      "sentToTrip": true
    },
    "tenantName": "Studio Innovate00",
    "__v": { "$numberInt": "0" },
    "cashAdvancesData": [
      {
        "tenantId": "65f7d5442f8fdd7d542eed07",
        "travelRequestId": { "$oid": "6603bb265a8f60af9de10f35" },
        "travelRequestNumber": "TRST000040",
        "cashAdvanceId": { "$oid": "6603bb67eda697652d60d894" },
        "cashAdvanceNumber": "CA0001",
        "createdBy": {
          "empId": "1001",
          "name": "Ajay Singh"
        },
        "cashAdvanceStatus": "pending settlement",
        "cashAdvanceState": "section 0",
        "amountDetails": [
          {
            "amount": { "$numberInt": "15000" },
            "currency": {
              "countryCode": "IN",
              "fullName": "Indian Rupee",
              "shortName": "INR",
              "symbol": "₹"
            },
            "mode": "Cheque",
            "_id": { "$oid": "6603bb68eda697652d60d89b" }
          }
        ],
        "approvers": [],
        "cashAdvanceRequestDate": { "$date": { "$numberLong": "1711520627313" } },
        "cashAdvanceApprovalDate": { "$date": { "$numberLong": "1711520627313" } },
        "cashAdvanceSettlementDate": null,
        "cashAdvanceViolations": null,
        "cashAdvanceRejectionReason": null,
        "_id": { "$oid": "6603bb68eda697652d60d89a" }
      }
    ],
    "createdBy": {
      "empId": "1001",
      "name": "Ajay Singh",
      "_id": { "$oid": "6603bb535a8f60af9de10f3a" }
    },
    "expenseAmountStatus": {
      "totalAlreadyBookedExpenseAmount": { "$numberInt": "5258" },
      "totalCashAmount": { "$numberInt": "15000" },
      "totalExpenseAmount": { "$numberDouble": "5263.99" },
      "totalPersonalExpenseAmount": { "$numberInt": "0" },
      "totalRemainingCash": { "$numberDouble": "14994.01" }
    },
    "isSentToExpense": null,
    "notificationSentToDashboardFlag": null,
    "travelExpenseData": [
      {
        "tenantId": "65f7d5442f8fdd7d542eed07",
        "tenantName": "Studio Innovate",
        "travelRequestId": { "$oid": "6603bb265a8f60af9de10f35" },
        "travelRequestNumber": "TRST000040",
        "expenseHeaderNumber": "ERST000000",
        "expenseHeaderId": { "$oid": "6603c821f341d643c0c63dfd" },
        "expenseHeaderType": "travel",
        "travelAllocationFlags": { "level1": true, "level2": false, "level3": false },
        "expenseHeaderStatus": "pending settlement",
        "alreadyBookedExpenseLines": {
          "formState": [],
          "flights": [
            {
              "itineraryId": { "$oid": "6603bb535a8f60af9de10f3c" },
              "formId": "travel_8c90ca3a-4193-44c0-bcdd-82db2dedf865",
              "from": "Delhi",
              "to": "Lucknow",
              "date": { "$date": { "$numberLong": "1711584000000" } },
              "returnDate": null,
              "time": "16:00",
              "returnTime": null,
              "travelClass": null,
              "isReturnTravel": false,
              "violations": { "class": null, "amount": null },
              "approvers": [],
              "bkd_from": "Indira Gandhi International Airport",
              "bkd_to": "Chaudhary Charan Singh International Airport",
              "bkd_date": { "$date": { "$numberLong": "1711497600000" } },
              "bkd_returnDate": null,
              "bkd_time": null,
              "bkd_returnTime": null,
              "bkd_travelClass": null,
              "bkd_violations": { "class": null, "amount": null },
              "modified": false,
              "cancellationDate": null,
              "cancellationReason": null,
              "rejectionReason": null,
              "status": "booked",
              "bookingDetails": {
                "docURL": "https://blobstorage318.blob.core.windows.net/images/images/flight_ticket_1.pdf",
                "docType": null,
                "billDetails": {
                  "vendorName": "Yatra",
                  "taxAmount": "0",
                  "totalAmount": "5258"
                }
              },
              "_id": { "$oid": "6603bb535a8f60af9de10f3b" }
            }
          ],
          "buses": [],
          "trains": [],
          "hotels": [],
          "cabs": [],
          "carRentals": [],
          "personalVehicles": [],
          "_id": { "$oid": "6603c821f341d643c0c63dff" }
        },
        "expenseLines": [
          {
            "expenseLineId": { "$oid": "6603cd850e047c9ef4a14c67" },
            "expenseLineAllocation": [],
            "isMultiCurrency": false,
            "isPersonalExpense": false,
            "billImageUrl": "",
            "_id": { "$oid": "6603cd850e047c9ef4a14c68" },
            "Bill Date": "2024-01-19",
            "Bill Number": "5497579396",
            "Vendor Name": "Uncle Jack's",
            "Description": "",
            "Quantity": "1",
            "Unit Cost": "209",
            "Tax Amount": "5.99",
            "Total Amount": "136",
            "Mode of Payment": "Cash",
            "Currency": {
              "countryCode": "IN",
              "fullName": "Indian Rupee",
              "shortName": "INR",
              "symbol": "₹"
            },
            "Category Name": "Meals",
            "convertedAmountDetails": null,
            "policyValidation": [
              {
                "success": true,
                "greenFlag": true,
                "currencyName": "INR",
                "amountAllowed": { "$numberInt": "0" },
                "violationMessage": "Total amount is under the policy limit"
              },
              { "success": false, "message": "Group policies not found" },
              { "success": false, "message": "Group policies not found" }
            ]
          }
        ],
        "approvers": [],
        "defaultCurrency": {
          "countryCode": "IN",
          "fullName": "Indian Rupee",
          "shortName": "INR",
          "symbol": "₹"
        },
        "allocations": [
          { "headerName": "department", "headerValue": "Finance" },
          { "headerName": "legalEntity", "headerValue": "Company ABC" }
        ],
        "violations": [],
        "travelType": "international",
        "_id": { "$oid": "6603c821f341d643c0c63dfe" }
      }
    ],
    "tripCompletionDate": { "$date": { "$numberLong": "1711584000000" } },
    "tripId": { "$oid": "6603be3d061a3acf6172b503" },
    "tripNumber": "TRIPST00001",
    "tripStartDate": { "$date": { "$numberLong": "1711497600000" } },
    "tripStatus": "transit",
  }
export const expenseData= [
  {
    "tripStartDate" : "2023-12-24T08:00:00.000+00:00",
    "tripCompletionDate" : "2023-12-29T15:30:00.000+00:00",
    "tripStatus":"transit",
      "tripNumber": "TRIPST00001",
    "createdBy": {
      "empId": "1001",
      "name": "Ajay Singh",
      "_id": { "$oid": "6603bb535a8f60af9de10f3a" }
    },
    
    "travelAllocationHeaders": [
      {
        "headerName": "department",
        "headerValue": "Finance"
      },
      {
        "headerName": "legalEntity",
        "headerValue": "Company XYZ"
      },
      {
        "headerName": "costCenter",
        "headerValue": "CC-001"
      }
    ],
  }
]  




  export const requiredTripData= [

    {
      "tripStartDate" : "2023-12-24T08:00:00.000+00:00",
      "tripCompletionDate" : "2023-12-29T15:30:00.000+00:00",
      "tripStatus":"transit",
      "tripNumber": "TRIPST00001",
      "travelRequestData": {
        // "itinerary": {
        //   "flights": [
        //     {
        //       "itineraryId": { "$oid": "6603bb535a8f60af9de10f3c" },
        //       "formId": "travel_8c90ca3a-4193-44c0-bcdd-82db2dedf865",
        //       "from": "Delhi",
        //       "to": "Lucknow",
        //       "date": { "$date": { "$numberLong": "1711584000000" } },
        //       "returnDate": null,
        //       "time": "16:00",
        //       "returnTime": null,
        //       "travelClass": null,
        //       "isReturnTravel": false,
        //       "violations": { "class": null, "amount": null },
        //       "approvers": [],
        //       "bkd_from": "Indira Gandhi International Airport",
        //       "bkd_to": "Chaudhary Charan Singh International Airport",
        //       "bkd_date": { "$date": { "$numberLong": "1711497600000" } },
        //       "bkd_returnDate": null,
        //       "bkd_time": null,
        //       "bkd_returnTime": null,
        //       "bkd_travelClass": null,
        //       "bkd_violations": { "class": null, "amount": null },
        //       "modified": false,
        //       "cancellationDate": null,
        //       "cancellationReason": null,
        //       "rejectionReason": null,
        //       "status": "booked",
        //       "bookingDetails": {
        //         "docURL": "https://blobstorage318.blob.core.windows.net/images/images/flight_ticket_1.pdf",
        //         "docType": null,
        //         "billDetails": {
        //           "vendorName": "Yatra",
        //           "taxAmount": "0",
        //           "totalAmount": "5258"
        //         }
        //       },
        //       "_id": { "$oid": "6603bb535a8f60af9de10f3b" }
        //     }
        //   ],
        //   "buses": [],
        //   "trains": [],
        //   "hotels": [],
        //   "cabs": [],
        //   "carRentals": [],
        //   "personalVehicles": [],
        //   "formState": []
        // },
        "tripType": {
          "oneWayTrip": true,
          "roundTrip": false,
          "multiCityTrip": false
        },
        "tenantId": "65f7d5442f8fdd7d542eed07",
        "tenantName": "Studio Innovate",
        "companyName": "Studio Innovate",
        "travelRequestId": { "$oid": "6603fbbbaddb846073b1a565" },
        "travelRequestNumber": "TRST000045",
        "travelType": "international",
        "tripPurpose": "Business",
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "createdBy": {
          "empId": "1001",
          "name": "Ajay Singh",
          "_id": { "$oid": "6603bb535a8f60af9de10f3a" }
        },
        "createdFor": null,
        "teamMembers": [],
        "travelAllocationHeaders": [
          { "headerName": "department", "headerValue": "Finance" },
          { "headerName": "legalEntity", "headerValue": "Company XYZ" }
        ],
        "travelDocuments": [],
        "bookings": [],
        "approvers": [{
          empId : "1004",
          name: "Shivam Chauhan",
          status:"pending approval"}],
        "preferences": [],
        "travelViolations": {
          "tripPurpose": null,
          "class": null,
          "amount": null,
          "tripPurposeViolationMesssage": null
        },
        "travelRequestDate": "2024-03-27T06:23:15.233Z",
        "cancellationDate": null,
        "isCancelled": false,
        "cancellationReason": null,
        "isCashAdvanceTaken": true,
        "isAddALeg": false,
        "sentToTrip": true
      },
    },
    {
      "tripStartDate" : "2023-12-24T08:00:00.000+00:00",
      "tripCompletionDate" : "2023-12-29T15:30:00.000+00:00",
      "tripStatus":"transit",
      "tripNumber": "TRIPST00001",
      "travelRequestData": {
        // "itinerary": {
        //   "flights": [
        //     {
        //       "itineraryId": { "$oid": "6603bb535a8f60af9de10f3c" },
        //       "formId": "travel_8c90ca3a-4193-44c0-bcdd-82db2dedf865",
        //       "from": "Delhi",
        //       "to": "Lucknow",
        //       "date": { "$date": { "$numberLong": "1711584000000" } },
        //       "returnDate": null,
        //       "time": "16:00",
        //       "returnTime": null,
        //       "travelClass": null,
        //       "isReturnTravel": false,
        //       "violations": { "class": null, "amount": null },
        //       "approvers": [],
        //       "bkd_from": "Indira Gandhi International Airport",
        //       "bkd_to": "Chaudhary Charan Singh International Airport",
        //       "bkd_date": { "$date": { "$numberLong": "1711497600000" } },
        //       "bkd_returnDate": null,
        //       "bkd_time": null,
        //       "bkd_returnTime": null,
        //       "bkd_travelClass": null,
        //       "bkd_violations": { "class": null, "amount": null },
        //       "modified": false,
        //       "cancellationDate": null,
        //       "cancellationReason": null,
        //       "rejectionReason": null,
        //       "status": "booked",
        //       "bookingDetails": {
        //         "docURL": "https://blobstorage318.blob.core.windows.net/images/images/flight_ticket_1.pdf",
        //         "docType": null,
        //         "billDetails": {
        //           "vendorName": "Yatra",
        //           "taxAmount": "0",
        //           "totalAmount": "5258"
        //         }
        //       },
        //       "_id": { "$oid": "6603bb535a8f60af9de10f3b" }
        //     }
        //   ],
        //   "buses": [],
        //   "trains": [],
        //   "hotels": [],
        //   "cabs": [],
        //   "carRentals": [],
        //   "personalVehicles": [],
        //   "formState": []
        // },
        "tripType": {
          "oneWayTrip": true,
          "roundTrip": false,
          "multiCityTrip": false
        },
        "tenantId": "65f7d5442f8fdd7d542eed07",
        "tenantName": "Studio Innovate",
        "companyName": "Studio Innovate",
        "travelRequestId": { "$oid": "6603fbbbaddb846073b1a565" },
        "travelRequestNumber": "TRST000045",
        "travelType": "international",
        "tripPurpose": "Business",
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "createdBy": {
          "empId": "1001",
          "name": "Ajay Singh",
          "_id": { "$oid": "6603bb535a8f60af9de10f3a" }
        },
        "createdFor": null,
        "teamMembers": [],
        "travelAllocationHeaders": [
          { "headerName": "department", "headerValue": "Finance" },
          { "headerName": "legalEntity", "headerValue": "Company XYZ" }
        ],
        "travelDocuments": [],
        "bookings": [],
        "approvers": [{
          empId : "1004",
          name: "Shivam Chauhan",
          status:"pending approval"}],
        "preferences": [],
        "travelViolations": {
          "tripPurpose": null,
          "class": null,
          "amount": null,
          "tripPurposeViolationMesssage": null
        },
        "travelRequestDate": "2024-03-27T06:23:15.233Z",
        "cancellationDate": null,
        "isCancelled": false,
        "cancellationReason": null,
        "isCashAdvanceTaken": true,
        "isAddALeg": false,
        "sentToTrip": true
      },
    },
    {
      "tripStartDate" : "2023-12-24T08:00:00.000+00:00",
      "tripCompletionDate" : "2023-12-29T15:30:00.000+00:00",
      "tripStatus":"transit",
      "tripNumber": "TRIPST00001",
      "travelRequestData": {
        // "itinerary": {
        //   "flights": [
        //     {
        //       "itineraryId": { "$oid": "6603bb535a8f60af9de10f3c" },
        //       "formId": "travel_8c90ca3a-4193-44c0-bcdd-82db2dedf865",
        //       "from": "Delhi",
        //       "to": "Lucknow",
        //       "date": { "$date": { "$numberLong": "1711584000000" } },
        //       "returnDate": null,
        //       "time": "16:00",
        //       "returnTime": null,
        //       "travelClass": null,
        //       "isReturnTravel": false,
        //       "violations": { "class": null, "amount": null },
        //       "approvers": [],
        //       "bkd_from": "Indira Gandhi International Airport",
        //       "bkd_to": "Chaudhary Charan Singh International Airport",
        //       "bkd_date": { "$date": { "$numberLong": "1711497600000" } },
        //       "bkd_returnDate": null,
        //       "bkd_time": null,
        //       "bkd_returnTime": null,
        //       "bkd_travelClass": null,
        //       "bkd_violations": { "class": null, "amount": null },
        //       "modified": false,
        //       "cancellationDate": null,
        //       "cancellationReason": null,
        //       "rejectionReason": null,
        //       "status": "booked",
        //       "bookingDetails": {
        //         "docURL": "https://blobstorage318.blob.core.windows.net/images/images/flight_ticket_1.pdf",
        //         "docType": null,
        //         "billDetails": {
        //           "vendorName": "Yatra",
        //           "taxAmount": "0",
        //           "totalAmount": "5258"
        //         }
        //       },
        //       "_id": { "$oid": "6603bb535a8f60af9de10f3b" }
        //     }
        //   ],
        //   "buses": [],
        //   "trains": [],
        //   "hotels": [],
        //   "cabs": [],
        //   "carRentals": [],
        //   "personalVehicles": [],
        //   "formState": []
        // },
        "tripType": {
          "oneWayTrip": true,
          "roundTrip": false,
          "multiCityTrip": false
        },
        "tenantId": "65f7d5442f8fdd7d542eed07",
        "tenantName": "Studio Innovate",
        "companyName": "Studio Innovate",
        "travelRequestId": { "$oid": "6603fbbbaddb846073b1a565" },
        "travelRequestNumber": "TRST000045",
        "travelType": "international",
        "tripPurpose": "Business",
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "createdBy": {
          "empId": "1001",
          "name": "Ajay Singh",
          "_id": { "$oid": "6603bb535a8f60af9de10f3a" }
        },
        "createdFor": null,
        "teamMembers": [],
        "travelAllocationHeaders": [
          { "headerName": "department", "headerValue": "Finance" },
          { "headerName": "legalEntity", "headerValue": "Company XYZ" }
        ],
        "travelDocuments": [],
        "bookings": [],
        "approvers": [{
          empId : "1004",
          name: "Shivam Chauhan",
          status:"pending approval"}],
        "preferences": [],
        "travelViolations": {
          "tripPurpose": null,
          "class": null,
          "amount": null,
          "tripPurposeViolationMesssage": null
        },
        "travelRequestDate": "2024-03-27T06:23:15.233Z",
        "cancellationDate": null,
        "isCancelled": false,
        "cancellationReason": null,
        "isCashAdvanceTaken": true,
        "isAddALeg": false,
        "sentToTrip": true
      },
    },
    {
      "tripStartDate" : "2023-12-24T08:00:00.000+00:00",
      "tripCompletionDate" : "2023-12-29T15:30:00.000+00:00",
      "tripStatus":"transit",
      "tripNumber": "TRIPST00001",
      "travelRequestData": {
        // "itinerary": {
        //   "flights": [
        //     {
        //       "itineraryId": { "$oid": "6603bb535a8f60af9de10f3c" },
        //       "formId": "travel_8c90ca3a-4193-44c0-bcdd-82db2dedf865",
        //       "from": "Delhi",
        //       "to": "Lucknow",
        //       "date": { "$date": { "$numberLong": "1711584000000" } },
        //       "returnDate": null,
        //       "time": "16:00",
        //       "returnTime": null,
        //       "travelClass": null,
        //       "isReturnTravel": false,
        //       "violations": { "class": null, "amount": null },
        //       "approvers": [],
        //       "bkd_from": "Indira Gandhi International Airport",
        //       "bkd_to": "Chaudhary Charan Singh International Airport",
        //       "bkd_date": { "$date": { "$numberLong": "1711497600000" } },
        //       "bkd_returnDate": null,
        //       "bkd_time": null,
        //       "bkd_returnTime": null,
        //       "bkd_travelClass": null,
        //       "bkd_violations": { "class": null, "amount": null },
        //       "modified": false,
        //       "cancellationDate": null,
        //       "cancellationReason": null,
        //       "rejectionReason": null,
        //       "status": "booked",
        //       "bookingDetails": {
        //         "docURL": "https://blobstorage318.blob.core.windows.net/images/images/flight_ticket_1.pdf",
        //         "docType": null,
        //         "billDetails": {
        //           "vendorName": "Yatra",
        //           "taxAmount": "0",
        //           "totalAmount": "5258"
        //         }
        //       },
        //       "_id": { "$oid": "6603bb535a8f60af9de10f3b" }
        //     }
        //   ],
        //   "buses": [],
        //   "trains": [],
        //   "hotels": [],
        //   "cabs": [],
        //   "carRentals": [],
        //   "personalVehicles": [],
        //   "formState": []
        // },
        "tripType": {
          "oneWayTrip": true,
          "roundTrip": false,
          "multiCityTrip": false
        },
        "tenantId": "65f7d5442f8fdd7d542eed07",
        "tenantName": "Studio Innovate",
        "companyName": "Studio Innovate",
        "travelRequestId": { "$oid": "6603fbbbaddb846073b1a565" },
        "travelRequestNumber": "TRST000045",
        "travelType": "international",
        "tripPurpose": "Business",
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "createdBy": {
          "empId": "1001",
          "name": "Ajay Singh",
          "_id": { "$oid": "6603bb535a8f60af9de10f3a" }
        },
        "createdFor": null,
        "teamMembers": [],
        "travelAllocationHeaders": [
          { "headerName": "department", "headerValue": "Finance" },
          { "headerName": "legalEntity", "headerValue": "Company XYZ" }
        ],
        "travelDocuments": [],
        "bookings": [],
        "approvers": [{
          empId : "1004",
          name: "Shivam Chauhan",
          status:"pending approval"}],
        "preferences": [],
        "travelViolations": {
          "tripPurpose": null,
          "class": null,
          "amount": null,
          "tripPurposeViolationMesssage": null
        },
        "travelRequestDate": "2024-03-27T06:23:15.233Z",
        "cancellationDate": null,
        "isCancelled": false,
        "cancellationReason": null,
        "isCashAdvanceTaken": true,
        "isAddALeg": false,
        "sentToTrip": true
      },
    },
    {
      "tripStartDate" : "2023-12-24T08:00:00.000+00:00",
      "tripCompletionDate" : "2023-12-29T15:30:00.000+00:00",
      "tripStatus":"transit",
      "tripNumber": "TRIPST00001",
      "travelRequestData": {
        // "itinerary": {
        //   "flights": [
        //     {
        //       "itineraryId": { "$oid": "6603bb535a8f60af9de10f3c" },
        //       "formId": "travel_8c90ca3a-4193-44c0-bcdd-82db2dedf865",
        //       "from": "Delhi",
        //       "to": "Lucknow",
        //       "date": { "$date": { "$numberLong": "1711584000000" } },
        //       "returnDate": null,
        //       "time": "16:00",
        //       "returnTime": null,
        //       "travelClass": null,
        //       "isReturnTravel": false,
        //       "violations": { "class": null, "amount": null },
        //       "approvers": [],
        //       "bkd_from": "Indira Gandhi International Airport",
        //       "bkd_to": "Chaudhary Charan Singh International Airport",
        //       "bkd_date": { "$date": { "$numberLong": "1711497600000" } },
        //       "bkd_returnDate": null,
        //       "bkd_time": null,
        //       "bkd_returnTime": null,
        //       "bkd_travelClass": null,
        //       "bkd_violations": { "class": null, "amount": null },
        //       "modified": false,
        //       "cancellationDate": null,
        //       "cancellationReason": null,
        //       "rejectionReason": null,
        //       "status": "booked",
        //       "bookingDetails": {
        //         "docURL": "https://blobstorage318.blob.core.windows.net/images/images/flight_ticket_1.pdf",
        //         "docType": null,
        //         "billDetails": {
        //           "vendorName": "Yatra",
        //           "taxAmount": "0",
        //           "totalAmount": "5258"
        //         }
        //       },
        //       "_id": { "$oid": "6603bb535a8f60af9de10f3b" }
        //     }
        //   ],
        //   "buses": [],
        //   "trains": [],
        //   "hotels": [],
        //   "cabs": [],
        //   "carRentals": [],
        //   "personalVehicles": [],
        //   "formState": []
        // },
        "tripType": {
          "oneWayTrip": true,
          "roundTrip": false,
          "multiCityTrip": false
        },
        "tenantId": "65f7d5442f8fdd7d542eed07",
        "tenantName": "Studio Innovate",
        "companyName": "Studio Innovate",
        "travelRequestId": { "$oid": "6603fbbbaddb846073b1a565" },
        "travelRequestNumber": "TRST000045",
        "travelType": "international",
        "tripPurpose": "Business",
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "createdBy": {
          "empId": "1001",
          "name": "Ajay Singh",
          "_id": { "$oid": "6603bb535a8f60af9de10f3a" }
        },
        "createdFor": null,
        "teamMembers": [],
        "travelAllocationHeaders": [
          { "headerName": "department", "headerValue": "Finance" },
          { "headerName": "legalEntity", "headerValue": "Company XYZ" }
        ],
        "travelDocuments": [],
        "bookings": [],
        "approvers": [{
          empId : "1004",
          name: "Shivam Chauhan",
          status:"pending approval"}],
        "preferences": [],
        "travelViolations": {
          "tripPurpose": null,
          "class": null,
          "amount": null,
          "tripPurposeViolationMesssage": null
        },
        "travelRequestDate": "2024-03-27T06:23:15.233Z",
        "cancellationDate": null,
        "isCancelled": false,
        "cancellationReason": null,
        "isCashAdvanceTaken": true,
        "isAddALeg": false,
        "sentToTrip": true
      },
    },
    {
      "tripStartDate" : "2023-12-24T08:00:00.000+00:00",
      "tripCompletionDate" : "2023-12-29T15:30:00.000+00:00",
      "tripStatus":"transit",
      "tripNumber": "TRIPST00001",
      "travelRequestData": {
        // "itinerary": {
        //   "flights": [
        //     {
        //       "itineraryId": { "$oid": "6603bb535a8f60af9de10f3c" },
        //       "formId": "travel_8c90ca3a-4193-44c0-bcdd-82db2dedf865",
        //       "from": "Delhi",
        //       "to": "Lucknow",
        //       "date": { "$date": { "$numberLong": "1711584000000" } },
        //       "returnDate": null,
        //       "time": "16:00",
        //       "returnTime": null,
        //       "travelClass": null,
        //       "isReturnTravel": false,
        //       "violations": { "class": null, "amount": null },
        //       "approvers": [],
        //       "bkd_from": "Indira Gandhi International Airport",
        //       "bkd_to": "Chaudhary Charan Singh International Airport",
        //       "bkd_date": { "$date": { "$numberLong": "1711497600000" } },
        //       "bkd_returnDate": null,
        //       "bkd_time": null,
        //       "bkd_returnTime": null,
        //       "bkd_travelClass": null,
        //       "bkd_violations": { "class": null, "amount": null },
        //       "modified": false,
        //       "cancellationDate": null,
        //       "cancellationReason": null,
        //       "rejectionReason": null,
        //       "status": "booked",
        //       "bookingDetails": {
        //         "docURL": "https://blobstorage318.blob.core.windows.net/images/images/flight_ticket_1.pdf",
        //         "docType": null,
        //         "billDetails": {
        //           "vendorName": "Yatra",
        //           "taxAmount": "0",
        //           "totalAmount": "5258"
        //         }
        //       },
        //       "_id": { "$oid": "6603bb535a8f60af9de10f3b" }
        //     }
        //   ],
        //   "buses": [],
        //   "trains": [],
        //   "hotels": [],
        //   "cabs": [],
        //   "carRentals": [],
        //   "personalVehicles": [],
        //   "formState": []
        // },
        "tripType": {
          "oneWayTrip": true,
          "roundTrip": false,
          "multiCityTrip": false
        },
        "tenantId": "65f7d5442f8fdd7d542eed07",
        "tenantName": "Studio Innovate",
        "companyName": "Studio Innovate",
        "travelRequestId": { "$oid": "6603fbbbaddb846073b1a565" },
        "travelRequestNumber": "TRST000045",
        "travelType": "international",
        "tripPurpose": "Business",
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "createdBy": {
          "empId": "1001",
          "name": "Ajay Singh",
          "_id": { "$oid": "6603bb535a8f60af9de10f3a" }
        },
        "createdFor": null,
        "teamMembers": [],
        "travelAllocationHeaders": [
          { "headerName": "department", "headerValue": "Finance" },
          { "headerName": "legalEntity", "headerValue": "Company XYZ" }
        ],
        "travelDocuments": [],
        "bookings": [],
        "approvers": [{
          empId : "1004",
          name: "Shivam Chauhan",
          status:"pending approval"}],
        "preferences": [],
        "travelViolations": {
          "tripPurpose": null,
          "class": null,
          "amount": null,
          "tripPurposeViolationMesssage": null
        },
        "travelRequestDate": "2024-03-27T06:23:15.233Z",
        "cancellationDate": null,
        "isCancelled": false,
        "cancellationReason": null,
        "isCashAdvanceTaken": true,
        "isAddALeg": false,
        "sentToTrip": true
      },
    },
    {
      "tripStartDate" : "2023-12-24T08:00:00.000+00:00",
      "tripCompletionDate" : "2023-12-29T15:30:00.000+00:00",
      "tripStatus":"transit",
      "tripNumber": "TRIPST00001",
      "travelRequestData": {
        // "itinerary": {
        //   "flights": [
        //     {
        //       "itineraryId": { "$oid": "6603bb535a8f60af9de10f3c" },
        //       "formId": "travel_8c90ca3a-4193-44c0-bcdd-82db2dedf865",
        //       "from": "Delhi",
        //       "to": "Lucknow",
        //       "date": { "$date": { "$numberLong": "1711584000000" } },
        //       "returnDate": null,
        //       "time": "16:00",
        //       "returnTime": null,
        //       "travelClass": null,
        //       "isReturnTravel": false,
        //       "violations": { "class": null, "amount": null },
        //       "approvers": [],
        //       "bkd_from": "Indira Gandhi International Airport",
        //       "bkd_to": "Chaudhary Charan Singh International Airport",
        //       "bkd_date": { "$date": { "$numberLong": "1711497600000" } },
        //       "bkd_returnDate": null,
        //       "bkd_time": null,
        //       "bkd_returnTime": null,
        //       "bkd_travelClass": null,
        //       "bkd_violations": { "class": null, "amount": null },
        //       "modified": false,
        //       "cancellationDate": null,
        //       "cancellationReason": null,
        //       "rejectionReason": null,
        //       "status": "booked",
        //       "bookingDetails": {
        //         "docURL": "https://blobstorage318.blob.core.windows.net/images/images/flight_ticket_1.pdf",
        //         "docType": null,
        //         "billDetails": {
        //           "vendorName": "Yatra",
        //           "taxAmount": "0",
        //           "totalAmount": "5258"
        //         }
        //       },
        //       "_id": { "$oid": "6603bb535a8f60af9de10f3b" }
        //     }
        //   ],
        //   "buses": [],
        //   "trains": [],
        //   "hotels": [],
        //   "cabs": [],
        //   "carRentals": [],
        //   "personalVehicles": [],
        //   "formState": []
        // },
        "tripType": {
          "oneWayTrip": true,
          "roundTrip": false,
          "multiCityTrip": false
        },
        "tenantId": "65f7d5442f8fdd7d542eed07",
        "tenantName": "Studio Innovate",
        "companyName": "Studio Innovate",
        "travelRequestId": { "$oid": "6603fbbbaddb846073b1a565" },
        "travelRequestNumber": "TRST000045",
        "travelType": "international",
        "tripPurpose": "Business",
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "createdBy": {
          "empId": "1001",
          "name": "Ajay Singh",
          "_id": { "$oid": "6603bb535a8f60af9de10f3a" }
        },
        "createdFor": null,
        "teamMembers": [],
        "travelAllocationHeaders": [
          { "headerName": "department", "headerValue": "Finance" },
          { "headerName": "legalEntity", "headerValue": "Company XYZ" }
        ],
        "travelDocuments": [],
        "bookings": [],
        "approvers": [{
          empId : "1004",
          name: "Shivam Chauhan",
          status:"pending approval"}],
        "preferences": [],
        "travelViolations": {
          "tripPurpose": null,
          "class": null,
          "amount": null,
          "tripPurposeViolationMesssage": null
        },
        "travelRequestDate": "2024-03-27T06:23:15.233Z",
        "cancellationDate": null,
        "isCancelled": false,
        "cancellationReason": null,
        "isCashAdvanceTaken": true,
        "isAddALeg": false,
        "sentToTrip": true
      },
    },
    {
      "tripStartDate" : "2023-12-24T08:00:00.000+00:00",
      "tripCompletionDate" : "2023-12-29T15:30:00.000+00:00",
      "tripStatus":"transit",
      "tripNumber": "TRIPST00001",
      "travelRequestData": {
        // "itinerary": {
        //   "flights": [
        //     {
        //       "itineraryId": { "$oid": "6603bb535a8f60af9de10f3c" },
        //       "formId": "travel_8c90ca3a-4193-44c0-bcdd-82db2dedf865",
        //       "from": "Delhi",
        //       "to": "Lucknow",
        //       "date": { "$date": { "$numberLong": "1711584000000" } },
        //       "returnDate": null,
        //       "time": "16:00",
        //       "returnTime": null,
        //       "travelClass": null,
        //       "isReturnTravel": false,
        //       "violations": { "class": null, "amount": null },
        //       "approvers": [],
        //       "bkd_from": "Indira Gandhi International Airport",
        //       "bkd_to": "Chaudhary Charan Singh International Airport",
        //       "bkd_date": { "$date": { "$numberLong": "1711497600000" } },
        //       "bkd_returnDate": null,
        //       "bkd_time": null,
        //       "bkd_returnTime": null,
        //       "bkd_travelClass": null,
        //       "bkd_violations": { "class": null, "amount": null },
        //       "modified": false,
        //       "cancellationDate": null,
        //       "cancellationReason": null,
        //       "rejectionReason": null,
        //       "status": "booked",
        //       "bookingDetails": {
        //         "docURL": "https://blobstorage318.blob.core.windows.net/images/images/flight_ticket_1.pdf",
        //         "docType": null,
        //         "billDetails": {
        //           "vendorName": "Yatra",
        //           "taxAmount": "0",
        //           "totalAmount": "5258"
        //         }
        //       },
        //       "_id": { "$oid": "6603bb535a8f60af9de10f3b" }
        //     }
        //   ],
        //   "buses": [],
        //   "trains": [],
        //   "hotels": [],
        //   "cabs": [],
        //   "carRentals": [],
        //   "personalVehicles": [],
        //   "formState": []
        // },
        "tripType": {
          "oneWayTrip": true,
          "roundTrip": false,
          "multiCityTrip": false
        },
        "tenantId": "65f7d5442f8fdd7d542eed07",
        "tenantName": "Studio Innovate",
        "companyName": "Studio Innovate",
        "travelRequestId": { "$oid": "6603fbbbaddb846073b1a565" },
        "travelRequestNumber": "TRST000045",
        "travelType": "international",
        "tripPurpose": "Business",
        "travelRequestStatus": "booked",
        "travelRequestState": "section 0",
        "createdBy": {
          "empId": "1001",
          "name": "Ajay Singh",
          "_id": { "$oid": "6603bb535a8f60af9de10f3a" }
        },
        "createdFor": null,
        "teamMembers": [],
        "travelAllocationHeaders": [
          { "headerName": "department", "headerValue": "Finance" },
          { "headerName": "legalEntity", "headerValue": "Company XYZ" }
        ],
        "travelDocuments": [],
        "bookings": [],
        "approvers": [{
          empId : "1004",
          name: "Shivam Chauhan",
          status:"pending approval"}],
        "preferences": [],
        "travelViolations": {
          "tripPurpose": null,
          "class": null,
          "amount": null,
          "tripPurposeViolationMesssage": null
        },
        "travelRequestDate": "2024-03-27T06:23:15.233Z",
        "cancellationDate": null,
        "isCancelled": false,
        "cancellationReason": null,
        "isCashAdvanceTaken": true,
        "isAddALeg": false,
        "sentToTrip": true
      },
    },
    {
      "tripStartDate": "2024-01-15T09:00:00.000+00:00",
      "tripCompletionDate": "2024-01-20T18:00:00.000+00:00",
      "tripStatus": "completed",
      "tripNumber": "TRIPST00002",
      "travelRequestData": {
        "tripType": {
          "oneWayTrip": false,
          "roundTrip": true,
          "multiCityTrip": false
        },
        "tenantId": "65f7d5442f8fdd7d542eed08",
        "tenantName": "Tech Solutions",
        "companyName": "Tech Solutions",
        "travelRequestId": { "$oid": "6603fbbbaddb846073b1a566" },
        "travelRequestNumber": "TRST000046",
        "travelType": "domestic",
        "tripPurpose": "Conference",
        "travelRequestStatus": "completed",
        "travelRequestState": "section 1",
        "createdBy": {
          "empId": "1002",
          "name": "Ravi Kumar",
          "_id": { "$oid": "6603bb535a8f60af9de10f3d" }
        },
        "createdFor": null,
        "teamMembers": [],
        "travelAllocationHeaders": [
          { "headerName": "department", "headerValue": "IT" },
          { "headerName": "legalEntity", "headerValue": "Company ABC" }
        ],
        "travelDocuments": [],
        "bookings": [],
        "approvers": [{
          "empId": "1005",
          "name": "Ankit Sharma",
          "status": "approved"
        }],
        "preferences": [],
        "travelViolations": {
          "tripPurpose": null,
          "class": null,
          "amount": null,
          "tripPurposeViolationMesssage": null
        },
        "travelRequestDate": "2024-02-01T12:00:00.000Z",
        "cancellationDate": null,
        "isCancelled": false,
        "cancellationReason": null,
        "isCashAdvanceTaken": false,
        "isAddALeg": false,
        "sentToTrip": true
      }
    },
    {
      "tripStartDate": "2024-03-10T14:00:00.000+00:00",
      "tripCompletionDate": "2024-03-18T20:00:00.000+00:00",
      "tripStatus": "planned",
      "tripNumber": "TRIPST00003",
      "travelRequestData": {
        "tripType": {
          "oneWayTrip": false,
          "roundTrip": false,
          "multiCityTrip": true
        },
        "tenantId": "65f7d5442f8fdd7d542eed09",
        "tenantName": "Global Ventures",
        "companyName": "Global Ventures",
        "travelRequestId": { "$oid": "6603fbbbaddb846073b1a567" },
        "travelRequestNumber": "TRST000047",
        "travelType": "international",
        "tripPurpose": "Client Meeting",
        "travelRequestStatus": "booked",
        "travelRequestState": "section 2",
        "createdBy": {
          "empId": "1003",
          "name": "Sneha Gupta",
          "_id": { "$oid": "6603bb535a8f60af9de10f3e" }
        },
        "createdFor": null,
        "teamMembers": [],
        "travelAllocationHeaders": [
          { "headerName": "department", "headerValue": "Sales" },
          { "headerName": "legalEntity", "headerValue": "Company LMN" }
        ],
        "travelDocuments": [],
        "bookings": [],
        "approvers": [{
          "empId": "1006",
          "name": "Kunal Roy",
          "status": "approved"
        }],
        "preferences": [],
        "travelViolations": {
          "tripPurpose": null,
          "class": null,
          "amount": null,
          "tripPurposeViolationMesssage": null
        },
        "travelRequestDate": "2024-02-15T08:30:00.000Z",
        "cancellationDate": null,
        "isCancelled": false,
        "cancellationReason": null,
        "isCashAdvanceTaken": true,
        "isAddALeg": false,
        "sentToTrip": true
      }
    },
    {
      "tripStartDate": "2024-03-10T14:00:00.000+00:00",
      "tripCompletionDate": "2024-03-18T20:00:00.000+00:00",
      "tripStatus": "planned",
      "tripNumber": "TRIPST00003",
      "travelRequestData": {
        "tripType": {
          "oneWayTrip": false,
          "roundTrip": false,
          "multiCityTrip": true
        },
        "tenantId": "65f7d5442f8fdd7d542eed09",
        "tenantName": "Global Ventures",
        "companyName": "Global Ventures",
        "travelRequestId": { "$oid": "6603fbbbaddb846073b1a567" },
        "travelRequestNumber": "TRST000047",
        "travelType": "international",
        "tripPurpose": "Client Meeting",
        "travelRequestStatus": "booked",
        "travelRequestState": "section 2",
        "createdBy": {
          "empId": "1003",
          "name": "Sneha Gupta",
          "_id": { "$oid": "6603bb535a8f60af9de10f3e" }
        },
        "createdFor": null,
        "teamMembers": [],
        "travelAllocationHeaders": [
          { "headerName": "department", "headerValue": "Sales" },
          { "headerName": "legalEntity", "headerValue": "Company LMN" }
        ],
        "travelDocuments": [],
        "bookings": [],
        "approvers": [{
          "empId": "1006",
          "name": "Kunal Roy",
          "status": "approved"
        }],
        "preferences": [],
        "travelViolations": {
          "tripPurpose": null,
          "class": null,
          "amount": null,
          "tripPurposeViolationMesssage": null
        },
        "travelRequestDate": "2024-02-15T08:30:00.000Z",
        "cancellationDate": null,
        "isCancelled": false,
        "cancellationReason": null,
        "isCashAdvanceTaken": true,
        "isAddALeg": false,
        "sentToTrip": true
      }
    },
    {
      "tripStartDate": "2024-03-10T14:00:00.000+00:00",
      "tripCompletionDate": "2024-03-18T20:00:00.000+00:00",
      "tripStatus": "planned",
      "tripNumber": "TRIPST00003",
      "travelRequestData": {
        "tripType": {
          "oneWayTrip": false,
          "roundTrip": false,
          "multiCityTrip": true
        },
        "tenantId": "65f7d5442f8fdd7d542eed09",
        "tenantName": "Global Ventures",
        "companyName": "Global Ventures",
        "travelRequestId": { "$oid": "6603fbbbaddb846073b1a567" },
        "travelRequestNumber": "TRST000047",
        "travelType": "international",
        "tripPurpose": "Client Meeting",
        "travelRequestStatus": "booked",
        "travelRequestState": "section 2",
        "createdBy": {
          "empId": "1003",
          "name": "Sneha Gupta",
          "_id": { "$oid": "6603bb535a8f60af9de10f3e" }
        },
        "createdFor": null,
        "teamMembers": [],
        "travelAllocationHeaders": [
          { "headerName": "department", "headerValue": "Sales" },
          { "headerName": "legalEntity", "headerValue": "Company LMN" }
        ],
        "travelDocuments": [],
        "bookings": [],
        "approvers": [{
          "empId": "1006",
          "name": "Kunal Roy",
          "status": "approved"
        }],
        "preferences": [],
        "travelViolations": {
          "tripPurpose": null,
          "class": null,
          "amount": null,
          "tripPurposeViolationMesssage": null
        },
        "travelRequestDate": "2024-02-15T08:30:00.000Z",
        "cancellationDate": null,
        "isCancelled": false,
        "cancellationReason": null,
        "isCashAdvanceTaken": true,
        "isAddALeg": false,
        "sentToTrip": true
      }
    }
  ]



  {
    "_id": {
      "$oid": "660a7859b202f54c53ef040e"
    },
    "tenantId": "660a58ac1a308ce97b32213f",
    "travelRequestData": {
      "itinerary": {
        "flights": [
          {
            "itineraryId": {
              "$oid": "660a6dcc4b838b3120f96413"
            },
            "formId": "travel_050b32d6-045d-4b40-b4a3-649b38be7e59",
            "from": "Delhi",
            "to": "Lucknow",
            "date": {
              "$date": {
                "$numberLong": "1713312000000"
              }
            },
            "returnDate": null,
            "time": "14:00",
            "returnTime": null,
            "travelClass": null,
            "isReturnTravel": false,
            "violations": {
              "class": null,
              "amount": null
            },
            "approvers": [
              {
                "empId": "1002",
                "name": "Sumesh Nayar",
                "status": "approved",
                "_id": {
                  "$oid": "660a6dcb4b838b3120f9640b"
                }
              }
            ],
            "bkd_from": "Indira Gandhi International Airport",
            "bkd_to": "Chaudhary Charan Singh International Airport",
            "bkd_date": {
              "$date": {
                "$numberLong": "1711929600000"
              }
            },
            "bkd_returnDate": null,
            "bkd_time": "14:00",
            "bkd_returnTime": null,
            "bkd_travelClass": null,
            "bkd_violations": {
              "class": null,
              "amount": null
            },
            "modified": false,
            "cancellationDate": null,
            "cancellationReason": null,
            "rejectionReason": null,
            "status": "booked",
            "bookingDetails": {
              "docURL": "https://blobstorage318.blob.core.windows.net/images/images/flight_ticket_1.pdf",
              "docType": null,
              "billDetails": {
                "vendorName": "Yatra",
                "taxAmount": "0",
                "totalAmount": "5258"
              }
            },
            "_id": {
              "$oid": "660a6dcc4b838b3120f9640d"
            }
          }
        ],
        "buses": [],
        "trains": [
          {
            "itineraryId": {
              "$oid": "660a6dcc4b838b3120f96414"
            },
            "formId": "travel_a4a79d70-93fd-42ab-9e61-19700dbe78f3",
            "from": "Delhi",
            "to": "Raipur",
            "date": {
              "$date": {
                "$numberLong": "1712102400000"
              }
            },
            "time": "13:00",
            "travelClass": null,
            "violations": {
              "class": null,
              "amount": null
            },
            "approvers": [
              {
                "empId": "1002",
                "name": "Sumesh Nayar",
                "status": "approved",
                "_id": {
                  "$oid": "660a6dcb4b838b3120f9640b"
                }
              }
            ],
            "bkd_from": "H. Nizammudin",
            "bkd_to": "Raipur JN",
            "bkd_date": {
              "$date": {
                "$numberLong": "1712016000000"
              }
            },
            "bkd_time": null,
            "bkd_travelClass": null,
            "bkd_violations": {
              "class": null,
              "amount": null
            },
            "modified": false,
            "cancellationDate": null,
            "cancellationReason": null,
            "rejectionReason": null,
            "status": "booked",
            "bookingDetails": {
              "docURL": "https://blobstorage318.blob.core.windows.net/images/images/train_ticket_1.pdf",
              "docType": null,
              "billDetails": {
                "vendorName": "IRCTC",
                "taxAmount": "0",
                "totalAmount": "438"
              }
            },
            "_id": {
              "$oid": "660a6dcc4b838b3120f9640f"
            }
          }
        ],
        "hotels": [
          {
            "itineraryId": {
              "$oid": "660a6dcc4b838b3120f96415"
            },
            "location": "Tirupati",
            "locationPreference": null,
            "class": null,
            "checkIn": {
              "$date": {
                "$numberLong": "1712016000000"
              }
            },
            "checkOut": {
              "$date": {
                "$numberLong": "1712275200000"
              }
            },
            "violations": {
              "class": null,
              "amount": null
            },
            "approvers": [
              {
                "empId": "1002",
                "name": "Sumesh Nayar",
                "status": "approved",
                "_id": {
                  "$oid": "660a6dcb4b838b3120f9640b"
                }
              }
            ],
            "bkd_location": "Behind Mango Market, Tiruchanoor Road, Thanapalli Cross, Chittoor Highway, Tirupati",
            "bkd_class": null,
            "bkd_checkIn": {
              "$date": {
                "$numberLong": "1712016000000"
              }
            },
            "bkd_checkOut": {
              "$date": {
                "$numberLong": "1712102400000"
              }
            },
            "bkd_violations": {
              "class": null,
              "amount": null
            },
            "modified": false,
            "cancellationDate": null,
            "cancellationReason": null,
            "status": "booked",
            "bookingDetails": {
              "docURL": "https://blobstorage318.blob.core.windows.net/images/images/Hotel_bill_1.pdf",
              "docType": null,
              "billDetails": {
                "vendorName": "Oravel Travels Pvt. Ltd.",
                "taxAmount": "0",
                "totalAmount": "761"
              }
            },
            "_id": {
              "$oid": "660a6dcc4b838b3120f96411"
            }
          }
        ],
        "cabs": [],
        "carRentals": [],
        "personalVehicles": [],
        "formState": []
      },
      "tripType": {
        "oneWayTrip": true,
        "roundTrip": false,
        "multiCityTrip": false
      },
      "assignedTo": {
        "empId": "1003",
        "name": "Kanhaiya Verma"
      },
      "tenantId": "660a58ac1a308ce97b32213f",
      "tenantName": "Studio Innovate",
      "companyName": "Studio Innovate",
      "travelRequestId": {
        "$oid": "660a6d654b838b3120f96404"
      },
      "travelRequestNumber": "TRST000001",
      "travelType": "international",
      "tripPurpose": "Business",
      "travelRequestStatus": "booked",
      "travelRequestState": "section 0",
      "createdBy": {
        "empId": "1001",
        "name": "Ajay Singh",
        "_id": {
          "$oid": "660a6dcb4b838b3120f9640c"
        }
      },
      "createdFor": null,
      "teamMembers": [],
      "travelAllocationHeaders": [
        {
          "headerName": "department",
          "headerValue": "Finance"
        },
        {
          "headerName": "legalEntity",
          "headerValue": "Company XYZ"
        },
        {
          "headerName": "costCenter",
          "headerValue": "CC-001"
        }
      ],
      "travelDocuments": [],
      "bookings": [],
      "approvers": [
        {
          "empId": "1002",
          "name": "Sumesh Nayar",
          "status": "approved",
          "_id": {
            "$oid": "660a6dcb4b838b3120f9640b"
          }
        }
      ],
      "preferences": [],
      "travelViolations": {
        "tripPurpose": null,
        "class": null,
        "amount": null,
        "tripPurposeViolationMesssage": null
      },
      "travelRequestDate": "2024-04-01T08:18:20.047Z",
      "cancellationDate": null,
      "isCancelled": false,
      "cancellationReason": null,
      "isCashAdvanceTaken": true,
      "isAddALeg": false,
      "sentToTrip": true
    },
    "__v": {
      "$numberInt": "10"
    },
    "cashAdvancesData": [
      {
        "tenantId": "660a58ac1a308ce97b32213f",
        "travelRequestId": {
          "$oid": "660a6d654b838b3120f96404"
        },
        "travelRequestNumber": "TRST000001",
        "cashAdvanceId": {
          "$oid": "660a6dd0f061a127e132d5a6"
        },
        "cashAdvanceNumber": "CA0001",
        "createdBy": {
          "empId": "1001",
          "name": "Ajay Singh"
        },
        "cashAdvanceStatus": "paid",
        "cashAdvanceState": "section 0",
        "amountDetails": [
          {
            "amount": {
              "$numberInt": "60000"
            },
            "currency": {
              "countryCode": "IN",
              "fullName": "Indian Rupee",
              "shortName": "INR",
              "symbol": "₹"
            },
            "mode": "Cheque",
            "_id": {
              "$oid": "660a6dd0f061a127e132d5b3"
            }
          }
        ],
        "approvers": [
          {
            "empId": "1002",
            "name": "Sumesh Nayar",
            "status": "approved",
            "_id": {
              "$oid": "660a6dcb4b838b3120f9640b"
            }
          }
        ],
        "cashAdvanceRequestDate": {
          "$date": {
            "$numberLong": "1711959530092"
          }
        },
        "cashAdvanceApprovalDate": null,
        "cashAdvanceSettlementDate": null,
        "cashAdvanceViolations": "Cash Advance exceeds maximum allowed limit of 50000",
        "_id": {
          "$oid": "660a6dd0f061a127e132d5b2"
        }
      }
    ],
    "createdBy": {
      "empId": "1001",
      "name": "Ajay Singh",
      "_id": {
        "$oid": "660a6dcb4b838b3120f9640c"
      }
    },
    "tenantName": "Studio Innovate",
    "tripCompletionDate": {
      "$date": {
        "$numberLong": "1712102400000"
      }
    },
    "tripId": {
      "$oid": "660a78127900b0e04830e106"
    },
    "tripNumber": "TRIPST000000",
    "tripStartDate": {
      "$date": {
        "$numberLong": "1711929600000"
      }
    },
    "tripStatus": "transit",
    "expenseAmountStatus": {
      "totalAlreadyBookedExpenseAmount": {
        "$numberInt": "6457"
      },
      "totalCashAmount": {
        "$numberInt": "60000"
      },
      "totalExpenseAmount": {
        "$numberInt": "6457"
      },
      "totalPersonalExpenseAmount": {
        "$numberInt": "0"
      },
      "totalRemainingCash": {
        "$numberInt": "60000"
      }
    },
    "travelExpenseData": [
      {
        "tenantId": "660a58ac1a308ce97b32213f",
        "tenantName": "Studio Innovate",
        "travelRequestId": {
          "$oid": "660a6d654b838b3120f96404"
        },
        "travelRequestNumber": "TRST000001",
        "expenseHeaderNumber": "ERST000001",
        "expenseHeaderId": {
          "$oid": "660a7ff9ebdfa9056d7358df"
        },
        "expenseHeaderType": "travel",
        "travelAllocationFlags": {
          "level1": true,
          "level2": false,
          "level3": false
        },
        "expenseHeaderStatus": "paid",
        "alreadyBookedExpenseLines": {
          "formState": [],
          "flights": [
            {
              "itineraryId": {
                "$oid": "660a6dcc4b838b3120f96413"
              },
              "formId": "travel_050b32d6-045d-4b40-b4a3-649b38be7e59",
              "from": "Delhi",
              "to": "Lucknow",
              "date": {
                "$date": {
                  "$numberLong": "1713312000000"
                }
              },
              "returnDate": null,
              "time": "14:00",
              "returnTime": null,
              "travelClass": null,
              "isReturnTravel": false,
              "violations": {
                "class": null,
                "amount": null
              },
              "approvers": [
                {
                  "empId": "1002",
                  "name": "Sumesh Nayar",
                  "status": "approved",
                  "_id": {
                    "$oid": "660a6dcb4b838b3120f9640b"
                  }
                }
              ],
              "bkd_from": "Indira Gandhi International Airport",
              "bkd_to": "Chaudhary Charan Singh International Airport",
              "bkd_date": {
                "$date": {
                  "$numberLong": "1711929600000"
                }
              },
              "bkd_returnDate": null,
              "bkd_time": "14:00",
              "bkd_returnTime": null,
              "bkd_travelClass": null,
              "bkd_violations": {
                "class": null,
                "amount": null
              },
              "modified": false,
              "cancellationDate": null,
              "cancellationReason": null,
              "rejectionReason": null,
              "status": "booked",
              "bookingDetails": {
                "docURL": "https://blobstorage318.blob.core.windows.net/images/images/flight_ticket_1.pdf",
                "docType": null,
                "billDetails": {
                  "vendorName": "Yatra",
                  "taxAmount": "0",
                  "totalAmount": "5258"
                }
              },
              "_id": {
                "$oid": "660a6dcc4b838b3120f9640d"
              }
            }
          ],
          "buses": [],
          "trains": [
            {
              "itineraryId": {
                "$oid": "660a6dcc4b838b3120f96414"
              },
              "formId": "travel_a4a79d70-93fd-42ab-9e61-19700dbe78f3",
              "from": "Delhi",
              "to": "Raipur",
              "date": {
                "$date": {
                  "$numberLong": "1712102400000"
                }
              },
              "time": "13:00",
              "travelClass": null,
              "violations": {
                "class": null,
                "amount": null
              },
              "approvers": [
                {
                  "empId": "1002",
                  "name": "Sumesh Nayar",
                  "status": "approved",
                  "_id": {
                    "$oid": "660a6dcb4b838b3120f9640b"
                  }
                }
              ],
              "bkd_from": "H. Nizammudin",
              "bkd_to": "Raipur JN",
              "bkd_date": {
                "$date": {
                  "$numberLong": "1712016000000"
                }
              },
              "bkd_time": null,
              "bkd_travelClass": null,
              "bkd_violations": {
                "class": null,
                "amount": null
              },
              "modified": false,
              "cancellationDate": null,
              "cancellationReason": null,
              "rejectionReason": null,
              "status": "booked",
              "bookingDetails": {
                "docURL": "https://blobstorage318.blob.core.windows.net/images/images/train_ticket_1.pdf",
                "docType": null,
                "billDetails": {
                  "vendorName": "IRCTC",
                  "taxAmount": "0",
                  "totalAmount": "438"
                }
              },
              "_id": {
                "$oid": "660a6dcc4b838b3120f9640f"
              }
            }
          ],
          "hotels": [
            {
              "itineraryId": {
                "$oid": "660a6dcc4b838b3120f96415"
              },
              "location": "Tirupati",
              "locationPreference": null,
              "class": null,
              "checkIn": {
                "$date": {
                  "$numberLong": "1712016000000"
                }
              },
              "checkOut": {
                "$date": {
                  "$numberLong": "1712275200000"
                }
              },
              "violations": {
                "class": null,
                "amount": null
              },
              "approvers": [
                {
                  "empId": "1002",
                  "name": "Sumesh Nayar",
                  "status": "approved",
                  "_id": {
                    "$oid": "660a6dcb4b838b3120f9640b"
                  }
                }
              ],
              "bkd_location": "Behind Mango Market, Tiruchanoor Road, Thanapalli Cross, Chittoor Highway, Tirupati",
              "bkd_class": null,
              "bkd_checkIn": {
                "$date": {
                  "$numberLong": "1712016000000"
                }
              },
              "bkd_checkOut": {
                "$date": {
                  "$numberLong": "1712102400000"
                }
              },
              "bkd_violations": {
                "class": null,
                "amount": null
              },
              "modified": false,
              "cancellationDate": null,
              "cancellationReason": null,
              "status": "booked",
              "bookingDetails": {
                "docURL": "https://blobstorage318.blob.core.windows.net/images/images/Hotel_bill_1.pdf",
                "docType": null,
                "billDetails": {
                  "vendorName": "Oravel Travels Pvt. Ltd.",
                  "taxAmount": "0",
                  "totalAmount": "761"
                }
              },
              "_id": {
                "$oid": "660a6dcc4b838b3120f96411"
              }
            }
          ],
          "cabs": [],
          "carRentals": [],
          "personalVehicles": [],
          "_id": {
            "$oid": "660a7ff9ebdfa9056d7358e1"
          }
        },
        "approvers": [
          {
            "empId": "1002",
            "name": "Sumesh Nayar",
            "status": "pending approval",
            "_id": {
              "$oid": "660a7ff9ebdfa9056d7358e8"
            }
          }
        ],
        "allocations": [],
        "violations": [],
        "travelType": "international",
        "_id": {
          "$oid": "660a7ff9ebdfa9056d7358e0"
        },
        "expenseLines": [],
        "expenseSettlement": "Cash"
      },
      {
        "tenantId": "660a58ac1a308ce97b32213f",
        "tenantName": "Studio Innovate",
        "travelRequestId": {
          "$oid": "660a6d654b838b3120f96404"
        },
        "travelRequestNumber": "TRST000001",
        "expenseHeaderNumber": "ERST000001",
        "expenseHeaderId": {
          "$oid": "660a85cdcd25f6c01b8d6631"
        },
        "expenseHeaderType": "travel",
        "travelAllocationFlags": {
          "level1": true,
          "level2": false,
          "level3": false
        },
        "expenseHeaderStatus": "new",
        "approvers": [
          {
            "empId": "1002",
            "name": "Sumesh Nayar",
            "status": "pending approval",
            "_id": {
              "$oid": "660a85cdcd25f6c01b8d6633"
            }
          }
        ],
        "allocations": [],
        "violations": [],
        "travelType": "international",
        "_id": {
          "$oid": "660a85cdcd25f6c01b8d6632"
        },
        "expenseLines": []
      }
    ]
  }
  