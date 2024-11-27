//overview 

 // overview - travel
const travelRequests = [
    {
      travelRequestNumber:"TRAL000012",
      travelRequestStatus:"draft",
      travelRequestId:"",
      tripName:'',
    },
    {
      travelRequestNumber:"TRAL000012",
      travelRequestStatus:"draft"
    },
    {
      travelRequestNumber:"TRAL000012",
      travelRequestStatus:"draft"
    },
    {
      travelRequestNumber:"TRAL000012",
      travelRequestStatus:"draft"
    },
    {
      travelRequestNumber:"TRAL000012",
      travelRequestStatus:"draft"
    },
    {
      travelRequestNumber:"TRAL000012",
      travelRequestStatus:"draft"
    },
    {
      travelRequestNumber:"TRAL000012",
      travelRequestStatus:"draft"
    }
]

  // overview - expense
const travelExpense = [
    {
    "tripNumber": "TRIPAL000001",
    "tripId": "667a3a5be9a18ce3478d1a0d",
    "tripName":"us - del - mum",
    "travelExpenseData": [
      {
        "expenseHeaderNumber": "ERAL000001",
        "expenseHeaderId": "667a393fb043bb2aadca3017",
        "expenseLines": [
          {
            "expenseLineId": "667a3951b043bb2aadca304e",
            "isMultiCurrency": false,
            "isPersonalExpense": false,
            "Total Amount": "136",
            "Currency": {
              "countryCode": "IN",
              "fullName": "Indian Rupee",
              "shortName": "INR",
              "symbol": "₹"
            },
            "Category Name": "Meals",
            "convertedAmountDetails": null,
          },
        ],
        "defaultCurrency": {
          "countryCode": "IN",
          "fullName": "Indian Rupee",
          "shortName": "INR",
          "symbol": "₹"
        }
      },
    ]
  },
    {
      "tripId": "667a38e9e9a18ce3478d1261",
    "tripNumber": "TRIPAL000001",
    "tripPurpose": "Business",
    "tripName":"us - del - mum - gkr",
    "travelExpenseData": [
      {
        "travelAllocationFlags": {
          "level1": false,
          "level2": false,
          "level3": true
        },
        "tenantId": "66794853c61cc24ba97b5b0f",
        "tenantName": "alpha code labs",
        "travelRequestId": "667955dbb2e14ac28c9ec056",
        "travelRequestNumber": "TRAL000001",
        "expenseHeaderNumber": "ERAL000001",
        "expenseHeaderId": "667a393fb043bb2aadca3017",
        "expenseHeaderType": "travel",
        "expenseHeaderStatus": "pending settlement",
        "alreadyBookedExpenseLines": {
          "flights": [
            {
              "violations": {
                "class": null,
                "amount": null
              },
              "bkd_violations": {
                "class": null,
                "amount": ""
              },
              "bookingDetails": {
                "billDetails": {
                  "vendorName": "Ytra",
                  "taxAmount": null,
                  "totalAmount": "5000"
                },
                "docURL": null,
                "docType": null
              },
              "itineraryId": "66795e09b2e14ac28c9ed0c2",
              "formId": "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784f",
              "sequence": 2,
              "from": "Delhi",
              "to": "Lucknow",
              "date": "2024-06-24T00:00:00.000Z",
              "returnDate": null,
              "time": null,
              "returnTime": null,
              "travelClass": null,
              "isReturnTravel": false,
              "approvers": [
                {
                  "empId": "1002",
                  "name": "Emma Thompson",
                  "status": "approved",
                  "_id": "66795e09b2e14ac28c9ed0b7"
                }
              ],
              "bkd_from": "Delhi",
              "bkd_to": "Lucknow",
              "bkd_date": "2024-06-25T00:00:00.000Z",
              "bkd_returnDate": null,
              "bkd_time": null,
              "bkd_returnTime": null,
              "bkd_travelClass": null,
              "modified": false,
              "cancellationDate": null,
              "cancellationReason": null,
              "rejectionReason": null,
              "status": "booked",
              "_id": "66795e09b2e14ac28c9ed0b9"
            },
            {
              "violations": {
                "class": null,
                "amount": null
              },
              "bkd_violations": {
                "class": null,
                "amount": ""
              },
              "bookingDetails": {
                "billDetails": {
                  "vendorName": "yatra",
                  "taxAmount": "0",
                  "totalAmount": "5000"
                },
                "docURL": null,
                "docType": null
              },
              "itineraryId": "66795e09b2e14ac28c9ed0c3",
              "formId": "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784f",
              "sequence": 4,
              "from": "Lucknow",
              "to": "Delhi",
              "date": "2024-06-26T00:00:00.000Z",
              "returnDate": null,
              "time": null,
              "returnTime": null,
              "travelClass": null,
              "isReturnTravel": false,
              "approvers": [
                {
                  "empId": "1002",
                  "name": "Emma Thompson",
                  "status": "approved",
                  "_id": "66795e09b2e14ac28c9ed0b7"
                }
              ],
              "bkd_from": "Lucknow",
              "bkd_to": "Delhi",
              "bkd_date": "2024-06-27T00:00:00.000Z",
              "bkd_returnDate": null,
              "bkd_time": null,
              "bkd_returnTime": null,
              "bkd_travelClass": null,
              "modified": false,
              "cancellationDate": null,
              "cancellationReason": null,
              "rejectionReason": null,
              "status": "booked",
              "_id": "66795e09b2e14ac28c9ed0bb"
            }
          ],
          "buses": [],
          "trains": [],
          "hotels": [
            {
              "violations": {
                "class": null,
                "amount": null
              },
              "bkd_violations": {
                "class": null,
                "amount": ""
              },
              "bookingDetails": {
                "billDetails": {
                  "vendorName": "MMT",
                  "taxAmount": null,
                  "totalAmount": "5000"
                },
                "docURL": null,
                "docType": null
              },
              "itineraryId": "66795e09b2e14ac28c9ed0c5",
              "formId": "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784f",
              "sequence": 3,
              "location": "Lucknow",
              "locationPreference": null,
              "class": null,
              "checkIn": "2024-06-24T00:00:00.000Z",
              "checkOut": "2024-06-26T00:00:00.000Z",
              "approvers": [
                {
                  "empId": "1002",
                  "name": "Emma Thompson",
                  "status": "approved",
                  "_id": "66795e09b2e14ac28c9ed0b7"
                }
              ],
              "bkd_location": "Lucknow",
              "bkd_class": null,
              "bkd_checkIn": "2024-06-25T00:00:00.000Z",
              "bkd_checkOut": "2024-06-27T00:00:00.000Z",
              "modified": false,
              "cancellationDate": null,
              "cancellationReason": null,
              "status": "booked",
              "_id": "66795e09b2e14ac28c9ed0bd"
            }
          ],
          "cabs": [
            {
              "violations": {
                "class": null,
                "amount": null
              },
              "bookingDetails": {
                "billDetails": {
                  "vendorName": "Yatra",
                  "taxAmount": "000",
                  "totalAmount": null
                },
                "docURL": null,
                "docType": null
              },
              "itineraryId": "66795e09b2e14ac28c9ed0c4",
              "formId": "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784f",
              "sequence": 1,
              "date": "2024-06-24T00:00:00.000Z",
              "class": null,
              "time": null,
              "pickupAddress": "Office Address",
              "dropAddress": "Delhi airport",
              "approvers": [
                {
                  "empId": "1002",
                  "name": "Emma Thompson",
                  "status": "approved",
                  "_id": "66795e09b2e14ac28c9ed0b7"
                }
              ],
              "bkd_date": "2024-06-25T00:00:00.000Z",
              "bkd_class": null,
              "bkd_time": null,
              "bkd_pickupAddress": "Amax Office",
              "bkd_dropAddress": "Delhi Airport",
              "modified": false,
              "cancellationDate": null,
              "cancellationReason": null,
              "status": "booked",
              "type": "pickup",
              "_id": "66795e09b2e14ac28c9ed0bf"
            }
          ],
          "carRentals": [],
          "personalVehicles": [],
          "_id": "667a393fb043bb2aadca3019"
        },
        "approvers": [
          {
            "empId": "1002",
            "name": "Emma Thompson",
            "status": "approved",
            "_id": "667a393fb043bb2aadca3022"
          }
        ],
        "allocations": [],
        "violations": [],
        "travelType": "international",
        "_id": "667a393fb043bb2aadca3018",
        "expenseLines": [
          {
            "expenseLineId": "667a3951b043bb2aadca304e",
            "isMultiCurrency": false,
            "isPersonalExpense": false,
            "billImageUrl": "",
            "_id": "667a3951b043bb2aadca304f",
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
            "allocations": [
              {
                "headerName": "department",
                "headerValue": "Finance"
              },
              {
                "headerName": "legalEntity",
                "headerValue": "Company XYZ"
              },
              {
                "headerName": "profitCenter",
                "headerValue": "PC-101"
              },
              {
                "headerName": "division",
                "headerValue": "Corporate"
              }
            ],
            "policyValidation": [
              {
                "success": true,
                "greenFlag": true,
                "currencyName": "INR",
                "amountAllowed": 5000,
                "violationMessage": "Total amount is under the policy limit"
              },
              {
                "success": false,
                "message": "Group policies not found"
              }
            ],
            "expenseLineAllocation": []
          },
          {
            "expenseLineId": "667a3951b043bb2aadca304e",
            "isMultiCurrency": false,
            "isPersonalExpense": false,
            "billImageUrl": "",
            "_id": "667a3951b043bb2aadca304f",
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
            "allocations": [
              {
                "headerName": "department",
                "headerValue": "Finance"
              },
              {
                "headerName": "legalEntity",
                "headerValue": "Company XYZ"
              },
              {
                "headerName": "profitCenter",
                "headerValue": "PC-101"
              },
              {
                "headerName": "division",
                "headerValue": "Corporate"
              }
            ],
            "policyValidation": [
              {
                "success": true,
                "greenFlag": true,
                "currencyName": "INR",
                "amountAllowed": 5000,
                "violationMessage": "Total amount is under the policy limit"
              },
              {
                "success": false,
                "message": "Group policies not found"
              }
            ],
            "expenseLineAllocation": []
          },
          {
            "expenseLineId": "667a3951b043bb2aadca304e",
            "isMultiCurrency": false,
            "isPersonalExpense": false,
            "billImageUrl": "",
            "_id": "667a3951b043bb2aadca304f",
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
            "allocations": [
              {
                "headerName": "department",
                "headerValue": "Finance"
              },
              {
                "headerName": "legalEntity",
                "headerValue": "Company XYZ"
              },
              {
                "headerName": "profitCenter",
                "headerValue": "PC-101"
              },
              {
                "headerName": "division",
                "headerValue": "Corporate"
              }
            ],
            "policyValidation": [
              {
                "success": true,
                "greenFlag": true,
                "currencyName": "INR",
                "amountAllowed": 5000,
                "violationMessage": "Total amount is under the policy limit"
              },
              {
                "success": false,
                "message": "Group policies not found"
              }
            ],
            "expenseLineAllocation": []
          },
          {
            "expenseLineId": "667a3951b043bb2aadca304e",
            "isMultiCurrency": false,
            "isPersonalExpense": false,
            "billImageUrl": "",
            "_id": "667a3951b043bb2aadca304f",
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
            "allocations": [
              {
                "headerName": "department",
                "headerValue": "Finance"
              },
              {
                "headerName": "legalEntity",
                "headerValue": "Company XYZ"
              },
              {
                "headerName": "profitCenter",
                "headerValue": "PC-101"
              },
              {
                "headerName": "division",
                "headerValue": "Corporate"
              }
            ],
            "policyValidation": [
              {
                "success": true,
                "greenFlag": true,
                "currencyName": "INR",
                "amountAllowed": 5000,
                "violationMessage": "Total amount is under the policy limit"
              },
              {
                "success": false,
                "message": "Group policies not found"
              }
            ],
            "expenseLineAllocation": []
          },
         
        ],
        "defaultCurrency": {
          "countryCode": "IN",
          "fullName": "Indian Rupee",
          "shortName": "INR",
          "symbol": "₹"
        }
      },
      {
        "travelAllocationFlags": {
          "level1": false,
          "level2": false,
          "level3": true
        },
        "tenantId": "66794853c61cc24ba97b5b0f",
        "tenantName": "alpha code labs",
        "travelRequestId": "667955dbb2e14ac28c9ec056",
        "travelRequestNumber": "TRAL000001",
        "expenseHeaderNumber": "ERAL000001",
        "expenseHeaderId": "667a393fb043bb2aadca3017",
        "expenseHeaderType": "travel",
        "expenseHeaderStatus": "pending settlement",
        "alreadyBookedExpenseLines": {
          "flights": [
            {
              "violations": {
                "class": null,
                "amount": null
              },
              "bkd_violations": {
                "class": null,
                "amount": ""
              },
              "bookingDetails": {
                "billDetails": {
                  "vendorName": "Ytra",
                  "taxAmount": null,
                  "totalAmount": "5000"
                },
                "docURL": null,
                "docType": null
              },
              "itineraryId": "66795e09b2e14ac28c9ed0c2",
              "formId": "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784f",
              "sequence": 2,
              "from": "Delhi",
              "to": "Lucknow",
              "date": "2024-06-24T00:00:00.000Z",
              "returnDate": null,
              "time": null,
              "returnTime": null,
              "travelClass": null,
              "isReturnTravel": false,
              "approvers": [
                {
                  "empId": "1002",
                  "name": "Emma Thompson",
                  "status": "approved",
                  "_id": "66795e09b2e14ac28c9ed0b7"
                }
              ],
              "bkd_from": "Delhi",
              "bkd_to": "Lucknow",
              "bkd_date": "2024-06-25T00:00:00.000Z",
              "bkd_returnDate": null,
              "bkd_time": null,
              "bkd_returnTime": null,
              "bkd_travelClass": null,
              "modified": false,
              "cancellationDate": null,
              "cancellationReason": null,
              "rejectionReason": null,
              "status": "booked",
              "_id": "66795e09b2e14ac28c9ed0b9"
            },
            {
              "violations": {
                "class": null,
                "amount": null
              },
              "bkd_violations": {
                "class": null,
                "amount": ""
              },
              "bookingDetails": {
                "billDetails": {
                  "vendorName": "yatra",
                  "taxAmount": "0",
                  "totalAmount": "5000"
                },
                "docURL": null,
                "docType": null
              },
              "itineraryId": "66795e09b2e14ac28c9ed0c3",
              "formId": "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784f",
              "sequence": 4,
              "from": "Lucknow",
              "to": "Delhi",
              "date": "2024-06-26T00:00:00.000Z",
              "returnDate": null,
              "time": null,
              "returnTime": null,
              "travelClass": null,
              "isReturnTravel": false,
              "approvers": [
                {
                  "empId": "1002",
                  "name": "Emma Thompson",
                  "status": "approved",
                  "_id": "66795e09b2e14ac28c9ed0b7"
                }
              ],
              "bkd_from": "Lucknow",
              "bkd_to": "Delhi",
              "bkd_date": "2024-06-27T00:00:00.000Z",
              "bkd_returnDate": null,
              "bkd_time": null,
              "bkd_returnTime": null,
              "bkd_travelClass": null,
              "modified": false,
              "cancellationDate": null,
              "cancellationReason": null,
              "rejectionReason": null,
              "status": "booked",
              "_id": "66795e09b2e14ac28c9ed0bb"
            }
          ],
          "buses": [],
          "trains": [],
          "hotels": [
            {
              "violations": {
                "class": null,
                "amount": null
              },
              "bkd_violations": {
                "class": null,
                "amount": ""
              },
              "bookingDetails": {
                "billDetails": {
                  "vendorName": "MMT",
                  "taxAmount": null,
                  "totalAmount": "5000"
                },
                "docURL": null,
                "docType": null
              },
              "itineraryId": "66795e09b2e14ac28c9ed0c5",
              "formId": "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784f",
              "sequence": 3,
              "location": "Lucknow",
              "locationPreference": null,
              "class": null,
              "checkIn": "2024-06-24T00:00:00.000Z",
              "checkOut": "2024-06-26T00:00:00.000Z",
              "approvers": [
                {
                  "empId": "1002",
                  "name": "Emma Thompson",
                  "status": "approved",
                  "_id": "66795e09b2e14ac28c9ed0b7"
                }
              ],
              "bkd_location": "Lucknow",
              "bkd_class": null,
              "bkd_checkIn": "2024-06-25T00:00:00.000Z",
              "bkd_checkOut": "2024-06-27T00:00:00.000Z",
              "modified": false,
              "cancellationDate": null,
              "cancellationReason": null,
              "status": "booked",
              "_id": "66795e09b2e14ac28c9ed0bd"
            }
          ],
          "cabs": [
            {
              "violations": {
                "class": null,
                "amount": null
              },
              "bookingDetails": {
                "billDetails": {
                  "vendorName": "Yatra",
                  "taxAmount": "000",
                  "totalAmount": null
                },
                "docURL": null,
                "docType": null
              },
              "itineraryId": "66795e09b2e14ac28c9ed0c4",
              "formId": "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784f",
              "sequence": 1,
              "date": "2024-06-24T00:00:00.000Z",
              "class": null,
              "time": null,
              "pickupAddress": "Office Address",
              "dropAddress": "Delhi airport",
              "approvers": [
                {
                  "empId": "1002",
                  "name": "Emma Thompson",
                  "status": "approved",
                  "_id": "66795e09b2e14ac28c9ed0b7"
                }
              ],
              "bkd_date": "2024-06-25T00:00:00.000Z",
              "bkd_class": null,
              "bkd_time": null,
              "bkd_pickupAddress": "Amax Office",
              "bkd_dropAddress": "Delhi Airport",
              "modified": false,
              "cancellationDate": null,
              "cancellationReason": null,
              "status": "booked",
              "type": "pickup",
              "_id": "66795e09b2e14ac28c9ed0bf"
            }
          ],
          "carRentals": [],
          "personalVehicles": [],
          "_id": "667a393fb043bb2aadca3019"
        },
        "approvers": [
          {
            "empId": "1002",
            "name": "Emma Thompson",
            "status": "approved",
            "_id": "667a393fb043bb2aadca3022"
          }
        ],
        "allocations": [],
        "violations": [],
        "travelType": "international",
        "_id": "667a393fb043bb2aadca3018",
        "expenseLines": [
          {
            "expenseLineId": "667a3951b043bb2aadca304e",
            "isMultiCurrency": false,
            "isPersonalExpense": false,
            "billImageUrl": "",
            "_id": "667a3951b043bb2aadca304f",
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
            "allocations": [
              {
                "headerName": "department",
                "headerValue": "Finance"
              },
              {
                "headerName": "legalEntity",
                "headerValue": "Company XYZ"
              },
              {
                "headerName": "profitCenter",
                "headerValue": "PC-101"
              },
              {
                "headerName": "division",
                "headerValue": "Corporate"
              }
            ],
            "policyValidation": [
              {
                "success": true,
                "greenFlag": true,
                "currencyName": "INR",
                "amountAllowed": 5000,
                "violationMessage": "Total amount is under the policy limit"
              },
              {
                "success": false,
                "message": "Group policies not found"
              }
            ],
            "expenseLineAllocation": []
          }
        ],
        "defaultCurrency": {
          "countryCode": "IN",
          "fullName": "Indian Rupee",
          "shortName": "INR",
          "symbol": "₹"
        }
      }
    ]
  }
  
]

//overview - non expense
const nonTravelExpense = [
    {
      "expenseHeaderId": "667babbeb043bb2aadcd2866",
      "expenseHeaderNumber": "REAL000006",
      "expenseHeaderStatus": "pending booking",
      "expenseLines": [
        {
          "lineItemId": "667babcdb043bb2aadcd2889",
          "lineItemStatus": "save",
          "expenseLineAllocation": [],
          "multiCurrencyDetails": null,
          "_id": "667babcdb043bb2aadcd288a",
          "group": {
            "limit": 0,
            "group": "Finance Team",
            "message": "Benjamin Clark is part of Finance Team. Highest limit found: 0"
          },
          "Category Name": "Meals",
          "Bill Date": "2024-06-27",
          "Bill Number": "",
          "Vendor Name": "",
          "Description": "",
          "Quantity": "",
          "Unit Cost": "",
          "Tax Amount": "",
          "Total Amount": "761",
          "Mode of Payment": "Cash",
          "Document": "",
          "Currency": {
            "countryCode": "IN",
            "fullName": "Indian Rupee",
            "shortName": "INR",
            "symbol": "₹"
          }
        },
        // {
        //   "lineItemId": "667babcdb043bb2aadcd2890",
        //   "lineItemStatus": "approved",
        //   "expenseLineAllocation": [],
        //   "multiCurrencyDetails": null,
        //   "_id": "667babcdb043bb2aadcd2891",
        //   "group": {
        //     "limit": 500,
        //     "group": "Sales Team",
        //     "message": "Benjamin Clark is part of Sales Team. Highest limit found: 500"
        //   },
        //   "Category Name": "Travel",
        //   "Bill Date": "2024-06-25",
        //   "Bill Number": "TRV12345",
        //   "Vendor Name": "XYZ Travels",
        //   "Description": "Flight to New York",
        //   "Quantity": "1",
        //   "Unit Cost": "5000",
        //   "Tax Amount": "500",
        //   "Total Amount": "5500",
        //   "Mode of Payment": "Credit Card",
        //   "Document": "",
        //   "Currency": {
        //     "countryCode": "IN",
        //     "fullName": "Indian Rupee",
        //     "shortName": "INR",
        //     "symbol": "₹"
        //   }
        // },
        // {
        //   "lineItemId": "667babcdb043bb2aadcd2892",
        //   "lineItemStatus": "submitted",
        //   "expenseLineAllocation": [],
        //   "multiCurrencyDetails": null,
        //   "_id": "667babcdb043bb2aadcd2893",
        //   "group": {
        //     "limit": 1000,
        //     "group": "Marketing Team",
        //     "message": "Benjamin Clark is part of Marketing Team. Highest limit found: 1000"
        //   },
        //   "Category Name": "Entertainment",
        //   "Bill Date": "2024-06-26",
        //   "Bill Number": "ENT45678",
        //   "Vendor Name": "ABC Events",
        //   "Description": "Team building event",
        //   "Quantity": "1",
        //   "Unit Cost": "10000",
        //   "Tax Amount": "1000",
        //   "Total Amount": "11000",
        //   "Mode of Payment": "Bank Transfer",
        //   "Document": "",
        //   "Currency": {
        //     "countryCode": "IN",
        //     "fullName": "Indian Rupee",
        //     "shortName": "INR",
        //     "symbol": "₹"
        //   }
        // },
        // {
        //   "lineItemId": "667babcdb043bb2aadcd2894",
        //   "lineItemStatus": "rejected",
        //   "expenseLineAllocation": [],
        //   "multiCurrencyDetails": null,
        //   "_id": "667babcdb043bb2aadcd2895",
        //   "group": {
        //     "limit": 0,
        //     "group": "HR Team",
        //     "message": "Benjamin Clark is part of HR Team. Highest limit found: 0"
        //   },
        //   "Category Name": "Stationery",
        //   "Bill Date": "2024-06-24",
        //   "Bill Number": "STN78901",
        //   "Vendor Name": "Office Supplies Ltd",
        //   "Description": "Office stationery purchase",
        //   "Quantity": "10",
        //   "Unit Cost": "50",
        //   "Tax Amount": "5",
        //   "Total Amount": "505",
        //   "Mode of Payment": "Cash",
        //   "Document": "",
        //   "Currency": {
        //     "countryCode": "IN",
        //     "fullName": "Indian Rupee",
        //     "shortName": "INR",
        //     "symbol": "₹"
        //   }
        // }
      ]
    },
]

// overview - in transit trips 
const trips = [
    {
      tripId: '667a3a5be9a18ce3478d1a0d',
      tripNumber: 'TRIPAL000003',
      "tripName": "DEL-BAN-LUC-DEL-BAN-DEL(9th Jul)",
      tripStartDate: '2024-06-26T00:00:00.000Z',
      tripCompletionDate: '2024-06-27T00:00:00.000Z',
      tripStatus: 'transit',
      travelRequestStatus: 'booked',
      isCashAdvanceTaken: true,
      totalCashAmount: 0,
      cashAdvances: [
        {
          cashAdvanceId: '667a39e4a1b88232721397fb',
          cashAdvanceNumber: 'CA0001',
          amountDetails: [
            {
              amount: 4000,
              currency: {
                countryCode: 'IN',
                fullName: 'Indian Rupee',
                shortName: 'INR',
                symbol: '₹',
              },
              mode: null,
              _id: '667a39e4a1b8823272139809',
            },
          ],
          cashAdvanceStatus: 'pending settlement',
        },
      ],
      travelExpenses: [],
      "itinerary":{
        "flights": [
            {
                "itineraryId": null,
                "formId": "c47879c9-075c-4e11-80fd-f6bf055aa82e",
                "date": "2024-07-12",
                "returnDate": null,
                "travelClass": null,
                "time": "12pm - 3pm",
                "returnTime": null,
                "from": "delhi",
                "to": "banaras",
                "isReturnTravel": false,
                "violations": {
                    "class": null,
                    "amount": null
                },
                "bkd_date": "2024-07-13",
                "bkd_returnDate": null,
                "bkd_travelClass": null,
                "bkd_time": "1pm - 4pm",
                "bkd_returnTime": null,
                "bkd_from": "delhi",
                "bkd_to": "banaras",
                "bkd_violations": {
                    "class": null,
                    "amount": null
                },
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "status": "draft",
                "bookingDetails": {
                    "docURL": null,
                    "docType": null,
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    }
                },
                "approvers": [
                    {
                        "empId": "1002",
                        "name": "Emma Thompson",
                        "status": "pending approval",
                        "_id": "668cd9d2c515a7f938787226"
                    }
                ],
                "rejectionReason": null,
                "travelAllocations": [],
                "sequence": 1
            },
            {
                "itineraryId": null,
                "formId": "19602fb6-1d95-4820-9851-9c993813da3a",
                "date": "2024-07-12",
                "returnDate": null,
                "travelClass": null,
                "time": "12pm - 3pm",
                "returnTime": null,
                "from": "lucknow",
                "to": "delhi",
                "isReturnTravel": false,
                "violations": {
                    "class": null,
                    "amount": null
                },
                "bkd_date": "2024-07-13",
                "bkd_returnDate": null,
                "bkd_travelClass": null,
                "bkd_time": "1pm - 4pm",
                "bkd_returnTime": null,
                "bkd_from": "lucknow",
                "bkd_to": "delhi",
                "bkd_violations": {
                    "class": null,
                    "amount": null
                },
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "status": "draft",
                "bookingDetails": {
                    "docURL": null,
                    "docType": null,
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    }
                },
                "approvers": [
                    {
                        "empId": "1002",
                        "name": "Emma Thompson",
                        "status": "pending approval",
                        "_id": "668cd9d2c515a7f938787226"
                    }
                ],
                "rejectionReason": null,
                "travelAllocations": [],
                "sequence": 3
            },
            {
                "itineraryId": null,
                "formId": "283f1900-ebe8-4158-90ab-fbed5f66eb5f",
                "date": "2024-07-09",
                "returnDate": null,
                "travelClass": null,
                "time": "12pm - 3pm",
                "returnTime": null,
                "from": "banaras ",
                "to": "delhi",
                "isReturnTravel": false,
                "violations": {
                    "class": null,
                    "amount": null
                },
                "bkd_date": "2024-07-10",
                "bkd_returnDate": null,
                "bkd_travelClass": null,
                "bkd_time": "1pm - 4pm",
                "bkd_returnTime": null,
                "bkd_from": "banaras",
                "bkd_to": "delhi",
                "bkd_violations": {
                    "class": null,
                    "amount": null
                },
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "status": "draft",
                "bookingDetails": {
                    "docURL": null,
                    "docType": null,
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    }
                },
                "approvers": [
                    {
                        "empId": "1002",
                        "name": "Emma Thompson",
                        "status": "pending approval",
                        "_id": "668cd9d2c515a7f938787226"
                    }
                ],
                "rejectionReason": null,
                "travelAllocations": [],
                "sequence": 5
            }
        ],
        "buses": [],
        "trains": [],
        "cabs": [
            {
                "itineraryId": null,
                "foromId": null,
                "date": "2024-07-09",
                "returnDate": "2024-07-09",
                "selectedDates": [],
                "class": "Regular",
                "time": "12pm - 3pm",
                "pickupAddress": "sandila",
                "dropAddress": "lucknow",
                "isFullDayCab": true,
                "violations": {
                    "class": null,
                    "amount": null
                },
                "bkd_date": "2024-07-10",
                "bkd_class": "Luxury",
                "bkd_time": "1pm - 4pm",
                "bkd_returnTime": "5pm - 8pm",
                "bkd_pickupAddress": "sandila",
                "bkd_dropAddress": "lucknow",
                "bkd_vioilations": {},
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "status": "draft",
                "bookingDetails": {
                    "docURL": null,
                    "docType": null,
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    }
                },
                "sequence": 4,
                "formId": "9d647a4a-18b9-4104-b7eb-b607ba4b70d6",
                "approvers": [
                    {
                        "empId": "1002",
                        "name": "Emma Thompson",
                        "status": "pending approval",
                        "_id": "668cd9d2c515a7f938787226"
                    }
                ]
            }
        ],
        "carRentals": [],
        "hotels": [
            {
                "itineraryId": null,
                "formId": "bee5aff2-324f-4508-9d05-68aa74313ea9",
                "location": "lucknow",
                "locationPreference": null,
                "class": "3-star",
                "checkIn": "2024-07-09",
                "checkOut": "2024-07-18",
                "needBrakfast": false,
                "needLunch": true,
                "needDinner": true,
                "needNonSmokingRoom": false,
                "violations": {
                    "class": null,
                    "amount": null
                },
                "bkd_location": "lucknow",
                "bkd_class": "4-star",
                "bkd_checkIn": "2024-07-10",
                "bkd_checkOut": "2024-07-19",
                "bkd_violations": {
                    "class": null,
                    "amount": null
                },
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "status": "draft",
                "bookingDetails": {
                    "docURL": null,
                    "docType": null,
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    }
                },
                "approvers": [
                    {
                        "empId": "1002",
                        "name": "Emma Thompson",
                        "status": "pending approval",
                        "_id": "668cd9d2c515a7f938787226"
                    }
                ],
                "needBreakfast": false,
                "time": "12pm - 3pm",
                "sequence": 2
            }
        ]
    }

    },
    {
      tripId: '667a3a5be9a18ce3478d1a0d',
      tripNumber: 'TRIPAL000003',
      travelRequestId: '66796b3bb2e14ac28c9eebb8',
      travelRequestNumber: 'TRAL000002',
      "tripName": "DEL-BAN-LUC-DEL-BAN-DEL(9th Jul)",
      tripPurpose: 'Business',
      tripStartDate: '2024-06-26T00:00:00.000Z',
      tripCompletionDate: '2024-06-27T00:00:00.000Z',
      travelRequestStatus: 'booked',
      isCashAdvanceTaken: true,
      totalCashAmount: 0,
      cashAdvances: [
        {
          cashAdvanceId: '667a39e4a1b88232721397fb',
          cashAdvanceNumber: 'CA0001',
          amountDetails: [
            {
              amount: 4000,
              currency: {
                countryCode: 'IN',
                fullName: 'Indian Rupee',
                shortName: 'INR',
                symbol: '₹',
              },
              mode: null,
              _id: '667a39e4a1b8823272139809',
            },
          ],
          cashAdvanceStatus: 'pending settlement',
        },
      ],
      travelExpenses: [],
      "itinerary":{
        "flights": [
            {
                "itineraryId": null,
                "formId": "c47879c9-075c-4e11-80fd-f6bf055aa82e",
                "date": "2024-07-12",
                "returnDate": null,
                "travelClass": null,
                "time": "12pm - 3pm",
                "returnTime": null,
                "from": "delhi",
                "to": "banaras",
                "isReturnTravel": false,
                "violations": {
                    "class": null,
                    "amount": null
                },
                "bkd_date": "2024-07-13",
                "bkd_returnDate": null,
                "bkd_travelClass": null,
                "bkd_time": "1pm - 4pm",
                "bkd_returnTime": null,
                "bkd_from": "delhi",
                "bkd_to": "banaras",
                "bkd_violations": {
                    "class": null,
                    "amount": null
                },
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "status": "draft",
                "bookingDetails": {
                    "docURL": null,
                    "docType": null,
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    }
                },
                "approvers": [
                    {
                        "empId": "1002",
                        "name": "Emma Thompson",
                        "status": "pending approval",
                        "_id": "668cd9d2c515a7f938787226"
                    }
                ],
                "rejectionReason": null,
                "travelAllocations": [],
                "sequence": 1
            },
            {
                "itineraryId": null,
                "formId": "19602fb6-1d95-4820-9851-9c993813da3a",
                "date": "2024-07-12",
                "returnDate": null,
                "travelClass": null,
                "time": "12pm - 3pm",
                "returnTime": null,
                "from": "lucknow",
                "to": "delhi",
                "isReturnTravel": false,
                "violations": {
                    "class": null,
                    "amount": null
                },
                "bkd_date": "2024-07-13",
                "bkd_returnDate": null,
                "bkd_travelClass": null,
                "bkd_time": "1pm - 4pm",
                "bkd_returnTime": null,
                "bkd_from": "lucknow",
                "bkd_to": "delhi",
                "bkd_violations": {
                    "class": null,
                    "amount": null
                },
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "status": "draft",
                "bookingDetails": {
                    "docURL": null,
                    "docType": null,
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    }
                },
                "approvers": [
                    {
                        "empId": "1002",
                        "name": "Emma Thompson",
                        "status": "pending approval",
                        "_id": "668cd9d2c515a7f938787226"
                    }
                ],
                "rejectionReason": null,
                "travelAllocations": [],
                "sequence": 3
            },
            {
                "itineraryId": null,
                "formId": "283f1900-ebe8-4158-90ab-fbed5f66eb5f",
                "date": "2024-07-09",
                "returnDate": null,
                "travelClass": null,
                "time": "12pm - 3pm",
                "returnTime": null,
                "from": "banaras ",
                "to": "delhi",
                "isReturnTravel": false,
                "violations": {
                    "class": null,
                    "amount": null
                },
                "bkd_date": "2024-07-10",
                "bkd_returnDate": null,
                "bkd_travelClass": null,
                "bkd_time": "1pm - 4pm",
                "bkd_returnTime": null,
                "bkd_from": "banaras",
                "bkd_to": "delhi",
                "bkd_violations": {
                    "class": null,
                    "amount": null
                },
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "status": "draft",
                "bookingDetails": {
                    "docURL": null,
                    "docType": null,
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    }
                },
                "approvers": [
                    {
                        "empId": "1002",
                        "name": "Emma Thompson",
                        "status": "pending approval",
                        "_id": "668cd9d2c515a7f938787226"
                    }
                ],
                "rejectionReason": null,
                "travelAllocations": [],
                "sequence": 5
            }
        ],
        "buses": [],
        "trains": [],
        "cabs": [
            {
                "itineraryId": null,
                "foromId": null,
                "date": "2024-07-09",
                "returnDate": "2024-07-09",
                "selectedDates": [],
                "class": "Regular",
                "time": "12pm - 3pm",
                "pickupAddress": "sandila",
                "dropAddress": "lucknow",
                "isFullDayCab": true,
                "violations": {
                    "class": null,
                    "amount": null
                },
                "bkd_date": "2024-07-10",
                "bkd_class": "Luxury",
                "bkd_time": "1pm - 4pm",
                "bkd_returnTime": "5pm - 8pm",
                "bkd_pickupAddress": "sandila",
                "bkd_dropAddress": "lucknow",
                "bkd_vioilations": {},
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "status": "draft",
                "bookingDetails": {
                    "docURL": null,
                    "docType": null,
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    }
                },
                "sequence": 4,
                "formId": "9d647a4a-18b9-4104-b7eb-b607ba4b70d6",
                "approvers": [
                    {
                        "empId": "1002",
                        "name": "Emma Thompson",
                        "status": "pending approval",
                        "_id": "668cd9d2c515a7f938787226"
                    }
                ]
            }
        ],
        "carRentals": [],
        "hotels": [
            {
                "itineraryId": null,
                "formId": "bee5aff2-324f-4508-9d05-68aa74313ea9",
                "location": "lucknow",
                "locationPreference": null,
                "class": "3-star",
                "checkIn": "2024-07-09",
                "checkOut": "2024-07-18",
                "needBrakfast": false,
                "needLunch": true,
                "needDinner": true,
                "needNonSmokingRoom": false,
                "violations": {
                    "class": null,
                    "amount": null
                },
                "bkd_location": "lucknow",
                "bkd_class": "4-star",
                "bkd_checkIn": "2024-07-10",
                "bkd_checkOut": "2024-07-19",
                "bkd_violations": {
                    "class": null,
                    "amount": null
                },
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "status": "draft",
                "bookingDetails": {
                    "docURL": null,
                    "docType": null,
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    }
                },
                "approvers": [
                    {
                        "empId": "1002",
                        "name": "Emma Thompson",
                        "status": "pending approval",
                        "_id": "668cd9d2c515a7f938787226"
                    }
                ],
                "needBreakfast": false,
                "time": "12pm - 3pm",
                "sequence": 2
            }
        ]
    }
    
      
    },
    
]


// cash Advanvce  - travel
const TRCashadvance = [
    {
      tripId: "667a38e9e9a18ce3478d1263",
      travelRequestStatus:"cancelled",
      tripNumber: "TRIPAL000001",
      travelRequestId: "667955dbb2e14ac28c9ec056",
      travelRequestNumber: "TRAL000001",
      tripName: ["mum", "luc", "del"],
      cashAdvances: [
        {
          cashAdvanceId: "66795ea1a4b5e4e0e666cd4a",
          cashAdvanceNumber: "CA0001",
          amountDetails: [
            {
              amount: 400,
              currency: {
                countryCode: "IN",
                fullName: "Indian Rupee",
                shortName: "INR",
                symbol: "₹"
              },
              mode: null,
              _id: "66795ea1a4b5e4e0e666cd5a"
            },
            {
              amount: 500,
              currency: {
                countryCode: "IN",
                fullName: "Indian Rupee",
                shortName: "INR",
                symbol: "₹"
              },
              mode: null,
              _id: "66795ea1a4b5e4e0e666cd5a"
            }
          ],
          cashAdvanceStatus: "pending approval"
        },
        {
          cashAdvanceId: "66795ea1a4b5e4e0e666cd4a",
          cashAdvanceNumber: "CA0001",
          amountDetails: [
            {
              amount: 6000,
              currency: {
                countryCode: "IN",
                fullName: "Indian Rupee",
                shortName: "INR",
                symbol: "₹"
              },
              mode: null,
              _id: "66795ea1a4b5e4e0e666cd5a"
            }
          ],
          cashAdvanceStatus: "paid"
        }
      ]
    },
];

// cash Advance - non travel
const NonTRCashAdvances = [
    {
      cashAdvanceId: "66795ea1a4b5e4e0e666cd4a",
      cashAdvanceNumber: "CA0001",
      amountDetails: [
        {
          amount: 400,
          currency: {
            countryCode: "IN",
            fullName: "Indian Rupee",
            shortName: "INR",
            symbol: "₹"
          },
          mode: null,
          _id: "66795ea1a4b5e4e0e666cd5a"
        },
        {
          amount: 500,
          currency: {
            countryCode: "IN",
            fullName: "Indian Rupee",
            shortName: "INR",
            symbol: "₹"
          },
          mode: null,
          _id: "66795ea1a4b5e4e0e666cd5b"
        }
      ],
      cashAdvanceStatus: "pending settlement"
    },
    {
      cashAdvanceId: "66795ea1a4b5e4e0e666cd4b",
      cashAdvanceNumber: "CA0002",
      amountDetails: [
        {
          amount: 6000,
          currency: {
            countryCode: "IN",
            fullName: "Indian Rupee",
            shortName: "INR",
            symbol: "₹"
          },
          mode: null,
          _id: "66795ea1a4b5e4e0e666cd5c"
        }
      ],
      cashAdvanceStatus: "pending settlement"
    },
    {
      cashAdvanceId: "66795ea1a4b5e4e0e666cd4c",
      cashAdvanceNumber: "CA0003",
      amountDetails: [
        {
          amount: 1500,
          currency: {
            countryCode: "US",
            fullName: "US Dollar",
            shortName: "USD",
            symbol: "$"
          },
          mode: null,
          _id: "66795ea1a4b5e4e0e666cd5d"
        },
        {
          amount: 2000,
          currency: {
            countryCode: "US",
            fullName: "US Dollar",
            shortName: "USD",
            symbol: "$"
          },
          mode: null,
          _id: "66795ea1a4b5e4e0e666cd5e"
        }
      ],
      cashAdvanceStatus: "approved"
    }
];

//--------------

const reimbursementExpense = [
    {
          "_id": "667bdf0db02acc12783e876f",
          "tenantId": "66794853c61cc24ba97b5b0f",
          "expenseHeaderId": "667bdf01b043bb2aadcd9303",
          "__v": 0,
          "companyName": "alpha code labs",
          "createdBy": {
              "empId": "1001",
              "name": "Benjamin Clark",
              "_id": "667bdf0db043bb2aadcd9326"
          },
          "expenseHeaderNumber": "REAL000001",
          "expenseHeaderStatus": "pending settlement",
          "expenseHeaderType": "reimbursement",
          "expenseLines": [
              {
                  "lineItemId": "667bdf0db043bb2aadcd9320",
                  "lineItemStatus": "save",
                  "expenseLineAllocation": [
                      {
                          "headerName": "department",
                          "_id": "667bdf0db043bb2aadcd9322",
                          "headerValue": "Finance"
                      },
                      {
                          "headerName": "legalEntity",
                          "_id": "667bdf0db043bb2aadcd9323",
                          "headerValue": "Company XYZ"
                      },
                      {
                          "headerName": "profitCenter",
                          "_id": "667bdf0db043bb2aadcd9324",
                          "headerValue": "PC-101"
                      },
                      {
                          "headerName": "division",
                          "_id": "667bdf0db043bb2aadcd9325",
                          "headerValue": "Corporate"
                      }
                  ],
                  "multiCurrencyDetails": null,
                  "_id": "667bdf0db043bb2aadcd9321",
                  "group": {
                      "limit": 5000,
                      "group": "Finance Team",
                      "message": "Benjamin Clark is part of Finance Team. Highest limit found: 5000"
                  },
                  "Category Name": "Hotel",
                  "Hotel Name": "Seven Hills Inn",
                  "Check-In Date": "2019-03-26",
                  "Check-Out Date": "2019-03-27",
                  "City": "Behind Mango Market, Tiruchanoor Road, Thanapalli Cross, Chittoor Highway, Tirupati",
                  "Room Rates": "761",
                  "Tax Amount": "",
                  "Total Amount": "761",
                  "Guest Name": " Sumesh",
                  "Booking Reference No": {
                      "": ""
                  },
                  "Payment Method": "",
                  "Mode of Payment": "Cash",
                  "Document": "",
                  "Currency": {
                      "countryCode": "IN",
                      "fullName": "Indian Rupee",
                      "shortName": "INR",
                      "symbol": "₹"
                  }
              }
          ],
          "expenseViolations": [],
          "tenantName": "alpha code labs"
      },
    {
          "_id": "667bdf0db02acc12783e876f",
          "tenantId": "66794853c61cc24ba97b5b0f",
          "expenseHeaderId": "667bdf01b043bb2aadcd9303",
          "__v": 0,
          "companyName": "alpha code labs",
          "createdBy": {
              "empId": "1001",
              "name": "Benjamin Clark",
              "_id": "667bdf0db043bb2aadcd9326"
          },
          "expenseHeaderNumber": "REAL000001",
          "expenseHeaderStatus": "pending settlement",
          "expenseHeaderType": "reimbursement",
          "expenseLines": [
              {
                  "lineItemId": "667bdf0db043bb2aadcd9320",
                  "lineItemStatus": "save",
                  "expenseLineAllocation": [
                      {
                          "headerName": "department",
                          "_id": "667bdf0db043bb2aadcd9322",
                          "headerValue": "Finance"
                      },
                      {
                          "headerName": "legalEntity",
                          "_id": "667bdf0db043bb2aadcd9323",
                          "headerValue": "Company XYZ"
                      },
                      {
                          "headerName": "profitCenter",
                          "_id": "667bdf0db043bb2aadcd9324",
                          "headerValue": "PC-101"
                      },
                      {
                          "headerName": "division",
                          "_id": "667bdf0db043bb2aadcd9325",
                          "headerValue": "Corporate"
                      }
                  ],
                  "multiCurrencyDetails": null,
                  "_id": "667bdf0db043bb2aadcd9321",
                  "group": {
                      "limit": 5000,
                      "group": "Finance Team",
                      "message": "Benjamin Clark is part of Finance Team. Highest limit found: 5000"
                  },
                  "Category Name": "Hotel",
                  "Hotel Name": "Seven Hills Inn",
                  "Check-In Date": "2019-03-26",
                  "Check-Out Date": "2019-03-27",
                  "City": "Behind Mango Market, Tiruchanoor Road, Thanapalli Cross, Chittoor Highway, Tirupati",
                  "Room Rates": "761",
                  "Tax Amount": "",
                  "Total Amount": "761",
                  "Guest Name": " Sumesh",
                  "Booking Reference No": {
                      "": ""
                  },
                  "Payment Method": "",
                  "Mode of Payment": "Cash",
                  "Document": "",
                  "Currency": {
                      "countryCode": "IN",
                      "fullName": "Indian Rupee",
                      "shortName": "INR",
                      "symbol": "₹"
                  }
              }
          ],
          "expenseViolations": [],
          "tenantName": "alpha code labs"
      }
]

const tripArray = [
      {
        "tripNumber":"TRIPAM0000001",
        tripId:"trip-3234hjuy",
        travelRequestId:"tr-sdkfji676",
        travelName: 'Business Meeting with Nirvana Association',
        from: 'New York',
        to: 'Los Angeles',
        departureDate: '20-Sep-2025',
        returnDate: '22-Sep-2023',
        status: 'cancelled',
        tripStatus: 'upcoming',
        "travelRequestNumber":"TRAM00000001",
        travelRequestStatus:"pending approval",
        itinerary:[
          {
            itineraryId:"0003fjhkhe767",
            status:"pending approval"
          }
        ],
        
        cashAdvances : [
          {
            cashAdvanceId: "CA0001",
            cashAdvanceRequestDate: "01-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: ""
            },
            amountDetails: [
              {
                amount: 50000,
                currency: "USD",
                mode: "Credit Card"
              },
              {
                amount: 50000,
                currency: "INR",
                mode: "UPI"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0002",
            cashAdvanceRequestDate: "02-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "100"
            },
            amountDetails: [
              {
                amount: 1000,
                currency: "EUR",
                mode: "Bank Transfer"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0003",
            cashAdvanceRequestDate: "03-Dec-2023",
            cashAdvanceStatus: "rejected",
            cashAdvanceViolations: {
              class: "",
              amount: ""
            },
            amountDetails: [
              {
                amount: 750,
                currency: "GBP",
                mode: "Cash"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0004",
            cashAdvanceRequestDate: "04-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "25"
            },
            amountDetails: [
              {
                amount: 300,
                currency: "CAD",
                mode: "Expense Card"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0005",
            cashAdvanceRequestDate: "05-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "200"
            },
            amountDetails: [
              {
                amount: 1200,
                currency: "AUD",
                mode: "PayPal"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0006",
            cashAdvanceRequestDate: "06-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "30"
            },
            amountDetails: [
              {
                amount: 400,
                currency: "JPY",
                mode: "Wire Transfer"
              }
            ]
          }
        ],
        travelExpense: [
          { expenseHeaderId: "#TREX00023", date: "15-Dec-2023", category: "office expense" },
          { expenseHeaderId: "#TREX00022", date: "15-Dec-2013", category: "expense for Delhi to Mumbai" }
        ]
      },
      {
        tripId:"trip-3234hjuy",
        travelRequestId:"tr-sdkfji6723",
        travelName: 'Vacation',
        from: 'London',
        to: 'Paris',
        departureDate: '10-Jul-2023',
        returnDate: '18-Jul-2023',
        status: 'inTransit',
        tripStatus: 'upcoming',
        cashAdvances : [
          {
            cashAdvanceId: "#CA0001",
            cashAdvanceRequestDate: "01-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: ""
            },
            amountDetails: [
              {
                amount: 50000,
                currency: "USD",
                mode: "Credit Card"
              },
              {
                amount: 50000,
                currency: "INR",
                mode: "UPI"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0002",
            cashAdvanceRequestDate: "02-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "100"
            },
            amountDetails: [
              {
                amount: 1000,
                currency: "EUR",
                mode: "Bank Transfer"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0003",
            cashAdvanceRequestDate: "03-Dec-2023",
            cashAdvanceStatus: "rejected",
            cashAdvanceViolations: {
              class: "",
              amount: ""
            },
            amountDetails: [
              {
                amount: 750,
                currency: "GBP",
                mode: "Cash"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0004",
            cashAdvanceRequestDate: "04-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "25"
            },
            amountDetails: [
              {
                amount: 300,
                currency: "CAD",
                mode: "Expense Card"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0005",
            cashAdvanceRequestDate: "05-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "200"
            },
            amountDetails: [
              {
                amount: 1200,
                currency: "AUD",
                mode: "PayPal"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0006",
            cashAdvanceRequestDate: "06-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "30"
            },
            amountDetails: [
              {
                amount: 400,
                currency: "JPY",
                mode: "Wire Transfer"
              }
            ]
          }
        ],
        travelExpense: [
          { expenseHeaderId: "#TREX00023", date: "15-Dec-2023", category: "office expense" },
          { expenseHeaderId: "#TREX00022", date: "15-Dec-2013", category: "expense for Delhi to Mumbai" }
        ]
      },
      {
        travelRequestId:"tr-sdkfji67656",
        tripId:"trip-3234h34juy",
        travelName: 'Conference',
        from: 'San Francisco',
        to: 'Chicago',
        departureDate: '05-Oct-2023',
        returnDate: '07-Oct-2023',
        status: 'upcoming',
        tripStatus: 'upcoming',
        cashAdvances : [
          {
            cashAdvanceId: "#CA0001",
            cashAdvanceRequestDate: "01-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: ""
            },
            amountDetails: [
              {
                amount: 50000,
                currency: "USD",
                mode: "Credit Card"
              },
              {
                amount: 50000,
                currency: "INR",
                mode: "UPI"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0002",
            cashAdvanceRequestDate: "02-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "100"
            },
            amountDetails: [
              {
                amount: 1000,
                currency: "EUR",
                mode: "Bank Transfer"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0003",
            cashAdvanceRequestDate: "03-Dec-2023",
            cashAdvanceStatus: "rejected",
            cashAdvanceViolations: {
              class: "",
              amount: ""
            },
            amountDetails: [
              {
                amount: 750,
                currency: "GBP",
                mode: "Cash"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0004",
            cashAdvanceRequestDate: "04-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "25"
            },
            amountDetails: [
              {
                amount: 300,
                currency: "CAD",
                mode: "Expense Card"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0005",
            cashAdvanceRequestDate: "05-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "200"
            },
            amountDetails: [
              {
                amount: 1200,
                currency: "AUD",
                mode: "PayPal"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0006",
            cashAdvanceRequestDate: "06-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "30"
            },
            amountDetails: [
              {
                amount: 400,
                currency: "JPY",
                mode: "Wire Transfer"
              }
            ]
          }
        ],
        travelExpense: [
          { expenseHeaderId: "#TREX00023", date: "15-Dec-2023", category: "office expense" },
          { expenseHeaderId: "#TREX00022", date: "15-Dec-2013", category: "expense for Delhi to Mumbai" }
        ]
      },
      {
        travelRequestId:"tr-sdkfji6jht7",
        tripId:"trip-3234hjuyre",
        travelName: 'Family Reunion',
        from: 'Miami',
        to: 'Orlando',
        departureDate: '12-Aug-2023',
        returnDate: '15-Aug-2023',
        status: 'approved',
        tripStatus: 'inTransit',
        cashAdvances : [
          {
            cashAdvanceId: "#CA0001",
            cashAdvanceRequestDate: "01-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: ""
            },
            amountDetails: [
              {
                amount: 50000,
                currency: "USD",
                mode: "Credit Card"
              },
              {
                amount: 50000,
                currency: "INR",
                mode: "UPI"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0002",
            cashAdvanceRequestDate: "02-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "100"
            },
            amountDetails: [
              {
                amount: 1000,
                currency: "EUR",
                mode: "Bank Transfer"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0003",
            cashAdvanceRequestDate: "03-Dec-2023",
            cashAdvanceStatus: "rejected",
            cashAdvanceViolations: {
              class: "",
              amount: ""
            },
            amountDetails: [
              {
                amount: 750,
                currency: "GBP",
                mode: "Cash"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0004",
            cashAdvanceRequestDate: "04-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "25"
            },
            amountDetails: [
              {
                amount: 300,
                currency: "CAD",
                mode: "Expense Card"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0005",
            cashAdvanceRequestDate: "05-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "200"
            },
            amountDetails: [
              {
                amount: 1200,
                currency: "AUD",
                mode: "PayPal"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0006",
            cashAdvanceRequestDate: "06-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "30"
            },
            amountDetails: [
              {
                amount: 400,
                currency: "JPY",
                mode: "Wire Transfer"
              }
            ]
          }
        ],
        travelExpense: [
          { expenseHeaderId: "#TREX00023", date: "15-Dec-2023", category: "office expense" },
          { expenseHeaderId: "#TREX00022", date: "15-Dec-2013", category: "expense for Delhi to Mumbai" }
        ]
      },
      {
        travelRequestId:"tr-sdkfji6bgff",
        tripId:"trip-3234hjub565",
        travelName: 'Adventure Trip',
        from: 'Sydney',
        to: 'Auckland',
        departureDate: '25-Nov-2023',
        returnDate: '30-Nov-2023',
        status: 'cancelled',
        tripStatus: 'not',
        cashAdvances : [
          {
            cashAdvanceId: "#CA0001",
            cashAdvanceRequestDate: "01-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: ""
            },
            amountDetails: [
              {
                amount: 50000,
                currency: "USD",
                mode: "Credit Card"
              },
              {
                amount: 50000,
                currency: "INR",
                mode: "UPI"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0002",
            cashAdvanceRequestDate: "02-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "100"
            },
            amountDetails: [
              {
                amount: 1000,
                currency: "EUR",
                mode: "Bank Transfer"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0003",
            cashAdvanceRequestDate: "03-Dec-2023",
            cashAdvanceStatus: "rejected",
            cashAdvanceViolations: {
              class: "",
              amount: ""
            },
            amountDetails: [
              {
                amount: 750,
                currency: "GBP",
                mode: "Cash"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0004",
            cashAdvanceRequestDate: "04-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "25"
            },
            amountDetails: [
              {
                amount: 300,
                currency: "CAD",
                mode: "Expense Card"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0005",
            cashAdvanceRequestDate: "05-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "200"
            },
            amountDetails: [
              {
                amount: 1200,
                currency: "AUD",
                mode: "PayPal"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0006",
            cashAdvanceRequestDate: "06-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "30"
            },
            amountDetails: [
              {
                amount: 400,
                currency: "JPY",
                mode: "Wire Transfer"
              }
            ]
          }
        ],
        travelExpense: [
          { expenseHeaderId: "#TREX00023", date: "15-Dec-2023", category: "office expense" },
          { expenseHeaderId: "#TREX00022", date: "15-Dec-2013", category: "expense for Delhi to Mumbai" }
        ]
      },
      {
        travelRequestId:"tr-sdkfji6t6",
        tripId:"trip-3234hjuyht6",
        travelName: 'Client Visit',
        from: 'Chicago',
        to: 'Dallas',
        departureDate: '02-Dec-2023',
        returnDate: '04-Dec-2023',
        status: 'approved',
        tripStatus: '',
        cashAdvances : [
          {
            cashAdvanceId: "#CA0001",
            cashAdvanceRequestDate: "01-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: ""
            },
            amountDetails: [
              {
                amount: 50000,
                currency: "USD",
                mode: "Credit Card"
              },
              {
                amount: 50000,
                currency: "INR",
                mode: "UPI"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0002",
            cashAdvanceRequestDate: "02-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "100"
            },
            amountDetails: [
              {
                amount: 1000,
                currency: "EUR",
                mode: "Bank Transfer"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0003",
            cashAdvanceRequestDate: "03-Dec-2023",
            cashAdvanceStatus: "rejected",
            cashAdvanceViolations: {
              class: "",
              amount: ""
            },
            amountDetails: [
              {
                amount: 750,
                currency: "GBP",
                mode: "Cash"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0004",
            cashAdvanceRequestDate: "04-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "25"
            },
            amountDetails: [
              {
                amount: 300,
                currency: "CAD",
                mode: "Expense Card"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0005",
            cashAdvanceRequestDate: "05-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "200"
            },
            amountDetails: [
              {
                amount: 1200,
                currency: "AUD",
                mode: "PayPal"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0006",
            cashAdvanceRequestDate: "06-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "30"
            },
            amountDetails: [
              {
                amount: 400,
                currency: "JPY",
                mode: "Wire Transfer"
              }
            ]
          }
        ],
        travelExpense: [
          { expenseHeaderId: "#TREX00023", date: "15-Dec-2023", category: "office expense" },
          { expenseHeaderId: "#TREX00022", date: "15-Dec-2013", category: "expense for Delhi to Mumbai" }
        ]
      },
      {
        travelRequestId:"tr-sdkfji6u76",
        tripId:"trip-3234hjuybh",
        travelName: 'Honeymoon',
        from: 'Venice',
        to: 'Santorini',
        departureDate: '08-Jun-2023',
        returnDate: '15-Jun-2023',
        status: 'rejected',
        tripStatus: 'completed',
        cashAdvances : [
          {
            cashAdvanceId: "#CA0001",
            cashAdvanceRequestDate: "01-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: ""
            },
            amountDetails: [
              {
                amount: 50000,
                currency: "USD",
                mode: "Credit Card"
              },
              {
                amount: 50000,
                currency: "INR",
                mode: "UPI"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0002",
            cashAdvanceRequestDate: "02-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "100"
            },
            amountDetails: [
              {
                amount: 1000,
                currency: "EUR",
                mode: "Bank Transfer"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0003",
            cashAdvanceRequestDate: "03-Dec-2023",
            cashAdvanceStatus: "rejected",
            cashAdvanceViolations: {
              class: "",
              amount: ""
            },
            amountDetails: [
              {
                amount: 750,
                currency: "GBP",
                mode: "Cash"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0004",
            cashAdvanceRequestDate: "04-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "25"
            },
            amountDetails: [
              {
                amount: 300,
                currency: "CAD",
                mode: "Expense Card"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0005",
            cashAdvanceRequestDate: "05-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "200"
            },
            amountDetails: [
              {
                amount: 1200,
                currency: "AUD",
                mode: "PayPal"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0006",
            cashAdvanceRequestDate: "06-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "30"
            },
            amountDetails: [
              {
                amount: 400,
                currency: "JPY",
                mode: "Wire Transfer"
              }
            ]
          }
        ],
        travelExpense: [
          { expenseHeaderId: "#TREX00023", date: "15-Dec-2023", category: "office expense" },
          { expenseHeaderId: "#TREX00022", date: "15-Dec-2013", category: "expense for Delhi to Mumbai" }
        ]
      },
      {
        travelRequestId:"tr-sdkfjijh67t",
        tripId:"trip-3234hjuybg6",
        travelName: 'Family Vacation',
        from: 'Orlando',
        to: 'Miami',
        departureDate: '03-Jul-2023',
        returnDate: '08-Jul-2023',
        status: 'approved',
        tripStatus: 'pending',
        cashAdvances : [
          {
            cashAdvanceId: "#CA0001",
            cashAdvanceRequestDate: "01-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: ""
            },
            amountDetails: [
              {
                amount: 50000,
                currency: "USD",
                mode: "Credit Card"
              },
              {
                amount: 50000,
                currency: "INR",
                mode: "UPI"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0002",
            cashAdvanceRequestDate: "02-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "100"
            },
            amountDetails: [
              {
                amount: 1000,
                currency: "EUR",
                mode: "Bank Transfer"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0003",
            cashAdvanceRequestDate: "03-Dec-2023",
            cashAdvanceStatus: "rejected",
            cashAdvanceViolations: {
              class: "",
              amount: ""
            },
            amountDetails: [
              {
                amount: 750,
                currency: "GBP",
                mode: "Cash"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0004",
            cashAdvanceRequestDate: "04-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "25"
            },
            amountDetails: [
              {
                amount: 300,
                currency: "CAD",
                mode: "Expense Card"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0005",
            cashAdvanceRequestDate: "05-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "200"
            },
            amountDetails: [
              {
                amount: 1200,
                currency: "AUD",
                mode: "PayPal"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0006",
            cashAdvanceRequestDate: "06-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "30"
            },
            amountDetails: [
              {
                amount: 400,
                currency: "JPY",
                mode: "Wire Transfer"
              }
            ]
          }
        ],
        travelExpense: [
          { expenseHeaderId: "#TREX00023", date: "15-Dec-2023", category: "office expense" },
          { expenseHeaderId: "#TREX00022", date: "15-Dec-2013", category: "expense for Delhi to Mumbai" }
        ]
      },
      {
        travelRequestId:"tr-sdkfji6h65",
        tripId:"trip-3234hjuy54b",
        travelName: 'Training Seminar',
        from: 'Houston',
        to: 'Atlanta',
        departureDate: '17-Sep-2023',
        returnDate: '19-Sep-2023',
        status: 'pending',
        tripStatus: 'cancelled',
        cashAdvances : [
          {
            cashAdvanceId: "#CA0001",
            cashAdvanceRequestDate: "01-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: ""
            },
            amountDetails: [
              {
                amount: 50000,
                currency: "USD",
                mode: "Credit Card"
              },
              {
                amount: 50000,
                currency: "INR",
                mode: "UPI"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0002",
            cashAdvanceRequestDate: "02-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "100"
            },
            amountDetails: [
              {
                amount: 1000,
                currency: "EUR",
                mode: "Bank Transfer"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0003",
            cashAdvanceRequestDate: "03-Dec-2023",
            cashAdvanceStatus: "rejected",
            cashAdvanceViolations: {
              class: "",
              amount: ""
            },
            amountDetails: [
              {
                amount: 750,
                currency: "GBP",
                mode: "Cash"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0004",
            cashAdvanceRequestDate: "04-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "25"
            },
            amountDetails: [
              {
                amount: 300,
                currency: "CAD",
                mode: "Expense Card"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0005",
            cashAdvanceRequestDate: "05-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "200"
            },
            amountDetails: [
              {
                amount: 1200,
                currency: "AUD",
                mode: "PayPal"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0006",
            cashAdvanceRequestDate: "06-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "30"
            },
            amountDetails: [
              {
                amount: 400,
                currency: "JPY",
                mode: "Wire Transfer"
              }
            ]
          }
        ],
        travelExpense: [
          { expenseHeaderId: "#TREX00023", date: "15-Dec-2023", category: "office expense" },
          { expenseHeaderId: "#TREX00022", date: "15-Dec-2013", category: "expense for Delhi to Mumbai" }
        ]
      },
      {
        travelRequestId:"tr-sdkfji767g6",
        tripId:"trip-3234hjuyh65",
        travelName: 'Ski Trip',
        from: 'Denver',
        to: 'Aspen',
        departureDate: '12-Jan-2023',
        returnDate: '15-Jan-2023',
        status: 'approved',
        tripStatus: 'not',
        cashAdvances : [
          {
            cashAdvanceId: "#CA0001",
            cashAdvanceRequestDate: "01-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: ""
            },
            amountDetails: [
              {
                amount: 50000,
                currency: "USD",
                mode: "Credit Card"
              },
              {
                amount: 50000,
                currency: "INR",
                mode: "UPI"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0002",
            cashAdvanceRequestDate: "02-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "100"
            },
            amountDetails: [
              {
                amount: 1000,
                currency: "EUR",
                mode: "Bank Transfer"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0003",
            cashAdvanceRequestDate: "03-Dec-2023",
            cashAdvanceStatus: "rejected",
            cashAdvanceViolations: {
              class: "",
              amount: ""
            },
            amountDetails: [
              {
                amount: 750,
                currency: "GBP",
                mode: "Cash"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0004",
            cashAdvanceRequestDate: "04-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "25"
            },
            amountDetails: [
              {
                amount: 300,
                currency: "CAD",
                mode: "Expense Card"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0005",
            cashAdvanceRequestDate: "05-Dec-2023",
            cashAdvanceStatus: "pending settlement",
            cashAdvanceViolations: {
              class: "Major",
              amount: "200"
            },
            amountDetails: [
              {
                amount: 1200,
                currency: "AUD",
                mode: "PayPal"
              }
            ]
          },
          {
            cashAdvanceId: "#CA0006",
            cashAdvanceRequestDate: "06-Dec-2023",
            cashAdvanceStatus: "approved",
            cashAdvanceViolations: {
              class: "Minor",
              amount: "30"
            },
            amountDetails: [
              {
                amount: 400,
                currency: "JPY",
                mode: "Wire Transfer"
              }
            ]
          }
        ],
        travelExpense: [
          { expenseHeaderId: "#TREX00023", date: "15-Dec-2023", category: "office expense" },
          { expenseHeaderId: "#TREX00022", date: "15-Dec-2013", category: "expense for Delhi to Mumbai" }
        ]
      },
];

export {nonTravelExpense,NonTRCashAdvances,tripArray,travelExpense,reimbursementExpense,travelRequests,trips,TRCashadvance}