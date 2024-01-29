//verified by neo

export const categories= {
    "success": true,
    "message": "These are the nonTravelExpenseAllocation, expense categories, and Groups (if selected) found for Jane Smith",
    "groups": [],
    "expenseCategories": [
        "Office Supplies",
        "Utilities",
        "Insurance",
        "Marketing and advertising",
        "Professional Fees",
        "Software and License",
        "Equipment",
        "Repair and Maintainance",
        "Legal and Compliance",
        "Communication",
        "Research and Development",
        "Training",
        "Software Subscription",
        "Legal Expenses",
        "Client Entertainment",
        "Client Gift"
    ],
    "nonTravelExpenseAllocation":[]
}


export const firstTimeBookTravelExpense= {
  "tripId": "6587f7d3f1bc28bda7fd77d4",
  "tripNumber": "TRIPABG000002",
  "tripPurpose": "Delhi Branch Opening",
  "newExpenseReport": true,
  "expenseReportNumber": "ERTNT000000",
  "alreadyBookedExpense": {
      "formState": [
          {
              "transfers": {
                  "needsDeparturePickup": true,
                  "needsDepartureDrop": true,
                  "needsReturnPickup": false,
                  "needsReturnDrop": true
              },
              "formId": "form123",
              "needsHotel": true,
              "needsCab": false,
              "needsVisa": true,
              "cancellationDate": " ",
              "cancellationReason": "Change in travel plans",
              "formStatus": "Submitted",
              "_id": "65815786e1751ead06a684c2"
          }
      ],
      "flights": [
          {
              "violations": {
                  "class": "Type A",
                  "amount": "100 USD"
              },
              "bkd_violations": {
                  "class": "Type A",
                  "amount": "100 USD"
              },
              "bookingDetails": {
                  "docURL": "https://example.com/booking.pdf",
                  "docType": "PDF",
                  "billDetails": {
                      "totalAmount": 72978
                  }
              },
              "itineraryId": "5fec83753a4959001771449a",
              "formId": "form123",
              "from": "Mumbai",
              "to": "Delhi",
              "date": "2023-12-16T15:30:00.000Z",
              "time": "11:00",
              "travelClass": "Business Class",
              "bkd_from": "Mumbai",
              "bkd_to": "Delhi",
              "bkd_date": "2023-12-21T15:30:00.000Z",
              "bkd_time": "12:20",
              "bkd_travelClass": "Business Class",
              "modified": false,
              "cancellationDate": null,
              "cancellationReason": "Flight canceled by airline",
              "status": "booked",
              "_id": "65815786e1751ead06a684c3"
          }
      ],
      "buses": [
          {
              "violations": {
                  "class": "Type D",
                  "amount": "70 USD"
              },
              "bookingDetails": {
                  "docURL": "https://example.com/bus-booking.pdf",
                  "docType": "PDF",
                  "billDetails": {
                      "totalAmount": 9128
                  }
              },
              "itineraryId": "5fec83753a4959001771449d",
              "formId": "form126",
              "from": "City A",
              "to": "City B",
              "date": "2023-12-19T15:30:00.000Z",
              "time": "08:00",
              "travelClass": "Sleeper",
              "bkd_from": "City A",
              "bkd_to": "City B",
              "bkd_date": "2023-12-19T15:30:00.000Z",
              "bkd_time": "08:00",
              "bkd_travelClass": "Sleeper",
              "modified": false,
              "cancellationDate": null,
              "cancellationReason": "",
              "status": "booked",
              "_id": "65815786e1751ead06a684c4"
          }
      ],
      "hotels": [
          {
              "violations": {
                  "class": "Type C",
                  "amount": "120 USD"
              },
              "bkd_violations": {
                  "class": "Type C",
                  "amount": "120 USD"
              },
              "bookingDetails": {
                  "docURL": "https://example.com/hotel-booking.pdf",
                  "docType": "PDF",
                  "billDetails": {
                      "totalAmount": 7959
                  }
              },
              "itineraryId": "5fec83753a4959001771449c",
              "formId": "form125",
              "location": "Hotel ABC",
              "locationPreference": "Near Airport",
              "class": "Luxury",
              "checkIn": "2023-12-18T15:30:00.000Z",
              "checkOut": "2023-12-22T15:30:00.000Z",
              "bkd_location": "Hotel ABC",
              "bkd_class": "Luxury",
              "bkd_checkIn": "2023-12-18T15:30:00.000Z",
              "bkd_checkOut": "2023-12-22T15:30:00.000Z",
              "modified": false,
              "cancellationDate": "",
              "cancellationReason": "",
              "status": "booked",
              "_id": "65815786e1751ead06a684c5"
          },
          {
              "violations": {
                  "class": "Type C",
                  "amount": "120 USD"
              },
              "bkd_violations": {
                  "class": "Type C",
                  "amount": "120 USD"
              },
              "bookingDetails": {
                  "docURL": "https://example.com/hotel-booking.pdf",
                  "docType": "PDF",
                  "billDetails": {
                      "totalAmount": 8765
                  }
              },
              "itineraryId": "5fec83753a4959001771449c",
              "formId": "form125",
              "location": "Hotel ABC",
              "locationPreference": "Near Airport",
              "class": "Luxury",
              "checkIn": "2023-12-18T15:30:00.000Z",
              "checkOut": "2023-12-22T15:30:00.000Z",
              "bkd_location": "Hotel ABC",
              "bkd_class": "Luxury",
              "bkd_checkIn": "2023-12-18T15:30:00.000Z",
              "bkd_checkOut": "2023-12-22T15:30:00.000Z",
              "modified": false,
              "cancellationDate": "",
              "cancellationReason": "",
              "status": "booked",
              "_id": "65815786e1751ead06a684c6"
          }
      ],
      "cabs": [
          {
              "violations": {
                  "class": "Type B",
                  "amount": "80 USD"
              },
              "bkd_violations": {
                  "class": "Type B",
                  "amount": "80 USD"
              },
              "bookingDetails": {
                  "docURL": "https://example.com/cab-booking.pdf",
                  "docType": "PDF",
                  "billDetails": {
                      "totalAmount": 8396
                  }
              },
              "itineraryId": "5fec83753a4959001771449b",
              "formId": "form124",
              "date": "2023-12-20T15:30:00.000Z",
              "class": "Sedan",
              "preferredTime": "10:00",
              "pickupAddress": "Address 1",
              "dropAddress": "Address 2",
              "bkd_date": "2023-12-20T15:30:00.000Z",
              "bkd_class": "Sedan",
              "bkd_preferredTime": "10:00",
              "bkd_pickupAddress": "Address 1",
              "bkd_dropAddress": "Address 2",
              "modified": false,
              "cancellationDate": "",
              "cancellationReason": "",
              "status": "booked",
              "type": "departure pickup",
              "_id": "65815786e1751ead06a684c7"
          }
      ],
      "trains": []
  },
  "totalExpenseAmount": 107226,
  "totalAlreadyBookedExpense": 107226,
  "isCashAdvanceTaken": true,
  "totalCashAmount": 8000,
  "remainingCash": 8000,
  "companyDetails": {
      "defaultCurrency": "",
      "travelAllocationFlags": {
          "level1": true,
          "level2": false,
          "level3": false
      },
      "travelAllocations": {
          "allocation": [],
          "expenseAllocation": [],
          "allocation_accountLine": null,
          "expenseAllocation_accountLine": null
      },
      "travelExpenseCategories": [
          {
              "categoryName": "Flight",
              "fields": [
                  {
                      "name": "Invoice Date",
                      "type": "date"
                  },
                  {
                      "name": "Flight number",
                      "type": "text"
                  },
                  {
                      "name": "Departure",
                      "type": "text"
                  },
                  {
                      "name": "Arrival",
                      "type": "text"
                  },
                  {
                      "name": "Airlines name",
                      "type": "text"
                  },
                  {
                      "name": "Travelers Name",
                      "type": "text"
                  },
                  {
                      "name": "Class of Service",
                      "type": "text"
                  },
                  {
                      "name": "Booking Reference Number",
                      "type": "text"
                  },
                  {
                      "name": "Total Amount",
                      "type": "amount"
                  },
                  {
                      "name": "Tax Amount",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": true,
              "class": [
                  "Economy",
                  "Premium Economy",
                  "Business",
                  "First Class"
              ]
          },
          {
              "categoryName": "Train",
              "fields": [
                  {
                      "name": "Invoice Date",
                      "type": "date"
                  },
                  {
                      "name": "Origin",
                      "type": "text"
                  },
                  {
                      "name": "Destination",
                      "type": "text"
                  },
                  {
                      "name": "Travelers Name",
                      "type": "text"
                  },
                  {
                      "name": "Class of Service",
                      "type": "text"
                  },
                  {
                      "name": "Booking Reference No.",
                      "type": "text"
                  },
                  {
                      "name": "Total Amount",
                      "type": "amount"
                  },
                  {
                      "name": "Tax Amount",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": true,
              "class": [
                  "First AC ",
                  "Second AC",
                  "Third AC",
                  "Sleeper",
                  "Chair Car"
              ]
          },
          {
              "categoryName": "Bus",
              "fields": [
                  {
                      "name": "Invoice Date",
                      "type": "date"
                  },
                  {
                      "name": "Origin",
                      "type": "text"
                  },
                  {
                      "name": "Destination",
                      "type": "text"
                  },
                  {
                      "name": "Travelers Name",
                      "type": "text"
                  },
                  {
                      "name": "Class of Service",
                      "type": "text"
                  },
                  {
                      "name": "Booking Reference No.",
                      "type": "text"
                  },
                  {
                      "name": "Total Amount",
                      "type": "amount"
                  },
                  {
                      "name": "Tax Amount",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": true,
              "class": [
                  "Sleeper",
                  "Semi-Sleeper",
                  "Regular"
              ]
          },
          {
              "categoryName": "Cab",
              "fields": [
                  {
                      "name": "Date",
                      "type": "date"
                  },
                  {
                      "name": "Time",
                      "type": "time"
                  },
                  {
                      "name": "Pickup Location",
                      "type": "text"
                  },
                  {
                      "name": "DropOff Location",
                      "type": "text"
                  },
                  {
                      "name": "Total Fare",
                      "type": "amount"
                  },
                  {
                      "name": "Tax Amount",
                      "type": "amount"
                  },
                  {
                      "name": "Payment Method",
                      "type": "text"
                  },
                  {
                      "name": "Receipt No.",
                      "type": "text"
                  },
                  {
                      "name": "Ride Distance",
                      "type": "text"
                  }
              ],
              "modeOfTranfer": true,
              "class": [
                  "Economy",
                  "Business",
                  "Executive"
              ]
          },
          {
              "categoryName": "Cab Rental",
              "fields": [
                  {
                      "name": "Date",
                      "type": "date"
                  },
                  {
                      "name": "Time",
                      "type": "time"
                  },
                  {
                      "name": "Pickup Location",
                      "type": "text"
                  },
                  {
                      "name": "DropOff Location",
                      "type": "text"
                  },
                  {
                      "name": "Total Fare",
                      "type": "amount"
                  },
                  {
                      "name": "Tax Amount",
                      "type": "amount"
                  },
                  {
                      "name": "Payment Method",
                      "type": "text"
                  },
                  {
                      "name": "Receipt No.",
                      "type": "text"
                  },
                  {
                      "name": "Ride Distance",
                      "type": "text"
                  }
              ],
              "modeOfTranfer": true,
              "class": [
                  "Economy",
                  "Business",
                  "Executive"
              ]
          },
          {
              "categoryName": "Hotel",
              "fields": [
                  {
                      "name": "Hotel Name",
                      "type": "text"
                  },
                  {
                      "name": "Check in date",
                      "type": "date"
                  },
                  {
                      "name": "Check out date",
                      "type": "date"
                  },
                  {
                      "name": "City",
                      "type": "text"
                  },
                  {
                      "name": "Room rates",
                      "type": "amount"
                  },
                  {
                      "name": "Tax amount , Total amount",
                      "type": "amount"
                  },
                  {
                      "name": "Guest name",
                      "type": "text"
                  },
                  {
                      "name": "Booking Reference No.",
                      "type": "text"
                  },
                  {
                      "name": "Payment Method",
                      "type": "text"
                  }
              ],
              "modeOfTranfer": false,
              "class": [
                  "Motel",
                  "3 star",
                  "4 star",
                  "5 star"
              ]
          },
          {
              "categoryName": "Meals",
              "fields": [
                  {
                      "name": "Bill Date",
                      "type": "date"
                  },
                  {
                      "name": "Bill Number",
                      "type": "text"
                  },
                  {
                      "name": "Vendor Name",
                      "type": "text"
                  },
                  {
                      "name": "Description",
                      "type": "text"
                  },
                  {
                      "name": "Quantity",
                      "type": "number"
                  },
                  {
                      "name": "Unit Cost",
                      "type": "amount"
                  },
                  {
                      "name": "Tax Amount",
                      "type": "amount"
                  },
                  {
                      "name": "Total Amount",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Travel Reimbursement",
              "fields": [
                  {
                      "name": "From , To , Distance",
                      "type": "text"
                  },
                  {
                      "name": "Bill Date",
                      "type": "date"
                  },
                  {
                      "name": "Bill Number",
                      "type": "text"
                  },
                  {
                      "name": "Vendor Name",
                      "type": "text"
                  },
                  {
                      "name": "Description",
                      "type": "text"
                  },
                  {
                      "name": "Quantity",
                      "type": "number"
                  },
                  {
                      "name": "Unit Cost",
                      "type": "amount"
                  },
                  {
                      "name": "Tax Amount",
                      "type": "amount"
                  },
                  {
                      "name": "Total Amount",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Conference / Event",
              "fields": [
                  {
                      "name": "Conference name",
                      "type": "text"
                  },
                  {
                      "name": "Conference date",
                      "type": "date"
                  },
                  {
                      "name": "Total amt",
                      "type": "amount"
                  },
                  {
                      "name": "Tax amt",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Travel Insurance",
              "fields": [
                  {
                      "name": "Policy type",
                      "type": "text"
                  },
                  {
                      "name": "Insurance provider",
                      "type": "text"
                  },
                  {
                      "name": "Premium amount",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Baggage",
              "fields": [
                  {
                      "name": "Airline name",
                      "type": "text"
                  },
                  {
                      "name": "Bill no.",
                      "type": "text"
                  },
                  {
                      "name": "Total amt",
                      "type": "amount"
                  },
                  {
                      "name": "Tax amt",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Tips",
              "fields": [
                  {
                      "name": "Purpose",
                      "type": "text"
                  },
                  {
                      "name": "Amt",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false,
              "limit": null,
              "currency": null
          },
          {
              "categoryName": "Miscellaneous",
              "fields": [
                  {
                      "name": "Bill Date",
                      "type": "date"
                  },
                  {
                      "name": "Bill Number",
                      "type": "text"
                  },
                  {
                      "name": "Vendor Name",
                      "type": "text"
                  },
                  {
                      "name": "Description",
                      "type": "text"
                  },
                  {
                      "name": "Quantity",
                      "type": "number"
                  },
                  {
                      "name": "Unit Cost",
                      "type": "amount"
                  },
                  {
                      "name": "Tax Amount",
                      "type": "amount"
                  },
                  {
                      "name": "Total Amount",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Office Supplies",
              "fields": [
                  {
                      "name": "Bill Date",
                      "type": "date"
                  },
                  {
                      "name": "Bill Number",
                      "type": "text"
                  },
                  {
                      "name": "Vendor Name",
                      "type": "text"
                  },
                  {
                      "name": "Description",
                      "type": "text"
                  },
                  {
                      "name": "Quantity",
                      "type": "number"
                  },
                  {
                      "name": "Unit Cost",
                      "type": "amount"
                  },
                  {
                      "name": "Tax Amount",
                      "type": "amount"
                  },
                  {
                      "name": "Total Amount",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Utilities",
              "fields": [
                  {
                      "name": "Type of Utilities",
                      "type": "text"
                  },
                  {
                      "name": "Bill Date",
                      "type": "date"
                  },
                  {
                      "name": "Bill Number",
                      "type": "text"
                  },
                  {
                      "name": "Vender Name",
                      "type": "text"
                  },
                  {
                      "name": "Description",
                      "type": "text"
                  },
                  {
                      "name": "Quantity",
                      "type": "number"
                  },
                  {
                      "name": "Unit Cost",
                      "type": "amount"
                  },
                  {
                      "name": "Tax Amount",
                      "type": "amount"
                  },
                  {
                      "name": "Total Amount",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Insurance",
              "fields": [
                  {
                      "name": "Policy type",
                      "type": "text"
                  },
                  {
                      "name": "Insurance provider",
                      "type": "text"
                  },
                  {
                      "name": "Premium amount",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Marketing and Advertising",
              "fields": [
                  {
                      "name": "Marketing campaign description",
                      "type": "text"
                  },
                  {
                      "name": "Advertising channels",
                      "type": "text"
                  },
                  {
                      "name": "Cost",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Professional Fees",
              "fields": [
                  {
                      "name": "Service provider",
                      "type": "text"
                  },
                  {
                      "name": "Nature of service",
                      "type": "text"
                  },
                  {
                      "name": "Cost",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Software and Licenses",
              "fields": [
                  {
                      "name": "Software name",
                      "type": "text"
                  },
                  {
                      "name": "License type",
                      "type": "text"
                  },
                  {
                      "name": "License cost",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Equipment",
              "fields": [
                  {
                      "name": "Item description",
                      "type": "text"
                  },
                  {
                      "name": "Quantity",
                      "type": "number"
                  },
                  {
                      "name": "Unit cost",
                      "type": "amount"
                  },
                  {
                      "name": "Total cost",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Repairs and Maintenance",
              "fields": [
                  {
                      "name": "Description of repair/maintenance work",
                      "type": "text"
                  },
                  {
                      "name": "Service provider",
                      "type": "text"
                  },
                  {
                      "name": "Cost",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Legal and Compliance",
              "fields": [
                  {
                      "name": "Firm name",
                      "type": "text"
                  },
                  {
                      "name": "Description",
                      "type": "text"
                  },
                  {
                      "name": "Service name",
                      "type": "text"
                  },
                  {
                      "name": "Tax amt",
                      "type": "amount"
                  },
                  {
                      "name": "Total amt",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Communication",
              "fields": [
                  {
                      "name": "Bill no. service provider",
                      "type": "text"
                  },
                  {
                      "name": "Bill date",
                      "type": "date"
                  },
                  {
                      "name": "Tax amt",
                      "type": "amount"
                  },
                  {
                      "name": "Total amt",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Research and Development",
              "fields": [
                  {
                      "name": "Research project description",
                      "type": "text"
                  },
                  {
                      "name": "Cost",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Training",
              "fields": [
                  {
                      "name": "Training program description",
                      "type": "text"
                  },
                  {
                      "name": "Trainer",
                      "type": "text"
                  },
                  {
                      "name": "Cost",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Software Subscriptions",
              "fields": [
                  {
                      "name": "Software name",
                      "type": "text"
                  },
                  {
                      "name": "Subscription type",
                      "type": "text"
                  },
                  {
                      "name": "Subscription cost",
                      "type": "amount"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Client entertainment",
              "fields": [
                  {
                      "name": "Bill and cost",
                      "type": "text"
                  }
              ],
              "modeOfTranfer": false
          },
          {
              "categoryName": "Client gift",
              "fields": [
                  {
                      "name": "Bill and cost",
                      "type": "text"
                  }
              ],
              "modeOfTranfer": false
          }
      ],
      "expenseSettlementOptions": {}
  }
}  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  // const TravelRequestData = {
  //   tenantId: 'tenantId_87867',
  //   tenantName: 'Example Tenant',
  //   companyName: 'Example Company',
  //   travelRequestId: 'TRID_5654XYTRR',
  //   tripPurpose: 'Business Meeting',
  //   travelRequestStatus: 'paid and cancelled',
  //   tripStatus: 'paid and cancelled',
  //   travelRequestState: 'section 0',
  //   createdBy: {
  //     empId: 'exampleEmployeeId',
  //     name: 'John Doe',
  //   },
  //   createdFor: {
  //     empId: 'EMPID_DR565',
  //     name: 'Jane Doe',
  //   },
  //   teamMembers: ['Team Member 1', 'Team Member 2'],
  //   travelAllocationHeaders: ['Allocation Header 1', 'Allocation Header 2'],
  //   itinerary: [
  //     {
  //       journey: {
  //         from: 'Lucknow',
  //         to: 'Delhi',
  //         departure: {
  //           itineraryId: 'DEP_ABC12',
  //           date: '2023-01-01',
  //           time: '08:00 AM',
  //           isModified: false,
  //           isCancelled: false,
  //           cancellationDate: '',
  //           cancellationReason: '',
  //           status: 'booked',
  //         },
  //         return: {
  //           itineraryId: '',
  //           date: '',
  //           time: '',
  //           isModified: false,
  //           isCancelled: false,
  //           cancellationDate: '',
  //           cancellationReason: '',
  //           status: 'booked',
  //         },
  //       },
  //       hotels: [
  //         {
  //           locationPreference: 'near to bus stand',
  //           itineraryId: 'HOTEL_ABC12',
  //           class: 'Standard',
  //           checkIn: '2023-01-01',
  //           checkOut: '2023-01-05',
  //           hotelClassViolationMessage: '',
  //           isCancelled: false,
  //           cancellationDate: '',
  //           status: 'paid and cancelled',
  //         },
  //         {
  //           itineraryId: 'HOTEL_XYZ34',
  //           class: 'Standard',
  //           checkIn: '2023-01-01',
  //           checkOut: '2023-01-05',
  //           hotelClassViolationMessage: '',
  //           isCancelled: false,
  //           cancellationDate: '',
  //           status: 'paid and cancelled',
  //         },
  //       ],
  //       cabs: [
  //         {
  //           itineraryId: 'CAB_ABC12',
  //           date: '2023-01-02',
  //           class: 'Sedan',
  //           prefferedTime: '10:00 AM',
  //           pickupAddress: 'Pickup Location',
  //           dropAddress: 'Drop Location',
  //           cabClassVioilationMessage: '',
  //           isModified: false,
  //           isCancelled: false,
  //           cancellationDate: '',
  //           cancellationReason: '',
  //           status: 'paid and cancelled',
  //         },
  //       ],
  //       modeOfTransit: 'Airplane',
  //       travelClass: 'Business',
  //       needsVisa: true,
  //       needsBoardingTransfer: true,
  //       needsHotelTransfer: true,
  //       boardingTransfer: {
  //         itineraryId: 'BOARD_ABC12',
  //         prefferedTime: '12:00 PM',
  //         pickupAddress: 'Boarding Pickup Location',
  //         dropAddress: 'Boarding Drop Location',
  //         isModified: false,
  //         isCancelled: false,
  //         cancellationDate: '',
  //         cancellationReason: '',
  //         status: 'paid and cancelled',
  //       },
  //       hotelTransfer: {
  //         itineraryId: 'HTL_TRNS_XYZ34',
  //         prefferedTime: '2:00 PM',
  //         pickupAddress: 'Hotel Pickup Location',
  //         dropAddress: 'Hotel Drop Location',
  //         isModified: false,
  //         isCancelled: false,
  //         cancellationDate: '',
  //         cancellationReason: '',
  //         status: 'paid and cancelled',
  //       },
  //       needsHotel: true,
  //       needsCab: true,
  //       status: 'paid and cancelled',
  //     },
  //     {
  //       journey: {
  //         from: 'Bengaleru',
  //         to: 'Mumbai',
  //         departure: {
  //           itineraryId: 'DEP_ABF3G',
  //           date: '2023-01-01',
  //           time: '08:00 AM',
  //           isModified: false,
  //           isCancelled: false,
  //           cancellationDate: '',
  //           cancellationReason: '',
  //           status: 'paid and cancelled',
  //         },
  //         return: {
  //           itineraryId: 'RET_XYG24',
  //           date: '2023-01-10',
  //           time: '06:00 PM',
  //           isModified: false,
  //           isCancelled: false,
  //           cancellationDate: '',
  //           cancellationReason: '',
  //           status: 'booked',
  //         },
  //       },
  //       hotels: [
  //         { 
  //           locationPrefrence:'near to bus stand',
  //           itineraryId: 'HOTEL_ABC22',
  //           class: 'Standard',
  //           checkIn: '2023-01-01',
  //           checkOut: '2023-01-05',
  //           hotelClassViolationMessage: '',
  //           isCancelled: false,
  //           cancellationDate: '',
  //           status: 'booked',
  //         },
  //       ],
  //       cabs: [
  //         {
  //           itineraryId: 'CAB_ARE12',
  //           date: '2023-01-02',
  //           class: 'Sedan',
  //           prefferedTime: '10:00 AM',
  //           pickupAddress: 'Pickup Location',
  //           dropAddress: 'Drop Location',
  //           cabClassVioilationMessage: '',
  //           isModified: false,
  //           isCancelled: false,
  //           cancellationDate: '',
  //           cancellationReason: '',
  //           status: 'paid and cancelled',
  //         },
  //         {
  //           itineraryId: 'CAB_A54XE',
  //           date: '2023-01-02',
  //           class: 'Sedan',
  //           prefferedTime: '10:00 AM',
  //           pickupAddress: 'Pickup Location',
  //           dropAddress: 'Drop Location',
  //           cabClassVioilationMessage: '',
  //           isModified: false,
  //           isCancelled: false,
  //           cancellationDate: '',
  //           cancellationReason: '',
  //           status: 'paid and cancelled',
  //         },
  //       ],
  //       modeOfTransit: 'Train',
  //       travelClass: 'Business',
  //       needsVisa: true,
  //       needsBoardingTransfer: true,
  //       needsHotelTransfer: true,
  //       boardingTransfer: {
  //         itineraryId: 'BOARD_0006',
  //         prefferedTime: '12:00 PM',
  //         pickupAddress: 'Boarding Pickup Location',
  //         dropAddress: 'Boarding Drop Location',
  //         isModified: false,
  //         isCancelled: false,
  //         cancellationDate: '',
  //         cancellationReason: '',
  //         status: 'booked',
  //       },
  //       hotelTransfer: {
  //         itineraryId: '0007',
  //         prefferedTime: '2:00 PM',
  //         pickupAddress: 'Hotel Pickup Location',
  //         dropAddress: 'Hotel Drop Location',
  //         isModified: false,
  //         isCancelled: false,
  //         cancellationDate: '',
  //         cancellationReason: '',
  //         status: 'paid and cancelled',
  //       },
  //       needsHotel: true,
  //       needsCab: true,
  //       status: 'booked',
  //     },
  //     {
  //       journey: {
  //         from: 'Bengaleru',
  //         to: 'Mumbai',
  //         departure: {
  //           itineraryId: 'DEP_AB065',
  //           date: '2023-01-01',
  //           time: '08:00 AM',
  //           isModified: false,
  //           isCancelled: false,
  //           cancellationDate: '',
  //           cancellationReason: '',
  //           status: 'paid and cancelled',
  //         },
  //         return: {
  //           itineraryId: 'RET_XCD34',
  //           date: '2023-01-10',
  //           time: '06:00 PM',
  //           isModified: false,
  //           isCancelled: false,
  //           cancellationDate: '',
  //           cancellationReason: '',
  //           status: 'paid and cancelled',
  //         },
  //       },
  //       hotels: [
  //         { 
  //           locationPrefrence:'near to bus stand',
  //           itineraryId: 'HOTEL_ABC32',
  //           class: 'Standard',
  //           checkIn: '2023-01-01',
  //           checkOut: '2023-01-05',
  //           hotelClassViolationMessage: '',
  //           isCancelled: false,
  //           cancellationDate: '',
  //           status: 'paid and cancelled',
  //         },
  //       ],
  //       cabs: [
  //         {
  //           itineraryId: 'CAB_ATRCF',
  //           date: '2023-01-02',
  //           class: 'Sedan',
  //           prefferedTime: '10:00 AM',
  //           pickupAddress: 'Pickup Location',
  //           dropAddress: 'Drop Location',
  //           cabClassVioilationMessage: '',
  //           isModified: false,
  //           isCancelled: false,
  //           cancellationDate: '',
  //           cancellationReason: '',
  //           status: 'booked',
  //         },
  //         {
  //           itineraryId: 'CAB_AXDER',
  //           date: '2023-01-02',
  //           class: 'Sedan',
  //           prefferedTime: '10:00 AM',
  //           pickupAddress: 'Pickup Location',
  //           dropAddress: 'Drop Location',
  //           cabClassVioilationMessage: '',
  //           isModified: false,
  //           isCancelled: false,
  //           cancellationDate: '',
  //           cancellationReason: '',
  //           status: 'paid and cancelled',
  //         },
  //       ],
  //       modeOfTransit: 'Airplane',
  //       travelClass: 'Business',
  //       needsVisa: true,
  //       needsBoardingTransfer: true,
  //       needsHotelTransfer: true,
  //       boardingTransfer: {
  //         itineraryId: 'gy56',
  //         prefferedTime: '12:00 PM',
  //         pickupAddress: 'Boarding Pickup Location',
  //         dropAddress: 'Boarding Drop Location',
  //         isModified: false,
  //         isCancelled: false,
  //         cancellationDate: '',
  //         cancellationReason: '',
  //         status: 'paid and cancelled',
  //       },
  //       hotelTransfer: {
  //         itineraryId: '0007',
  //         prefferedTime: '2:00 PM',
  //         pickupAddress: 'Hotel Pickup Location',
  //         dropAddress: 'Hotel Drop Location',
  //         isModified: false,
  //         isCancelled: false,
  //         cancellationDate: '',
  //         cancellationReason: '',
  //         status: 'paid and cancelled',
  //       },
  //       needsHotel: true,
  //       needsCab: true,
  //       status: 'booked',
  //     },

  //     {
  //       journey: {
  //         from: 'Sandila',
  //         to: 'Jaipur',
  //         departure: {
  //           itineraryId: 'DEP-QWE01',
  //           date: '2023-01-01',
  //           time: '08:00 AM',
  //           isModified: false,
  //           isCancelled: false,
  //           cancellationDate: '',
  //           cancellationReason: '',
  //           status: 'paid and cancelled',
  //         },
  //         return: {
  //           itineraryId: 'RET_XTR25',
  //           date: '2023-01-10',
  //           time: '06:00 PM',
  //           isModified: false,
  //           isCancelled: false,
  //           cancellationDate: '',
  //           cancellationReason: '',
  //           status: 'paid and cancelled',
  //         },
  //       },
  //       hotels: [
  //         { locationPrefrence:'near to bus stand',
  //           itineraryId: 'HOTEL_ARC65',
  //           class: 'Standard',
  //           checkIn: '2023-01-01',
  //           checkOut: '2023-01-05',
  //           hotelClassViolationMessage: '',
  //           isCancelled: false,
  //           cancellationDate: '',
  //           status: 'paid and cancelled',
  //         },
  //         {
  //           itineraryId: 'HOTEL_ABCDE',
  //           class: 'Standard',
  //           checkIn: '2023-01-01',
  //           checkOut: '2023-01-05',
  //           hotelClassViolationMessage: '',
  //           isCancelled: false,
  //           cancellationDate: '',
  //           status: 'paid and cancelled',
  //         },
  //         {
  //           itineraryId: 'HOTEL_ABCYT',
  //           class: 'Standard',
  //           checkIn: '2023-01-01',
  //           checkOut: '2023-01-05',
  //           hotelClassViolationMessage: '',
  //           isCancelled: false,
  //           cancellationDate: '',
  //           status: 'paid and cancelled',
  //         },
  //       ],
  //       cabs: [
  //         {
  //           itineraryId: 'CAB_AXDEE',
  //           date: '2023-01-02',
  //           class: 'Sedan',
  //           preferredTime: '10:00 AM',
  //           pickupAddress: '123 Business Street, Suite 789, Urban City, State 56789',
  //           dropAddress: '456 Corporate Avenue, City Center, State 56789',
  //           cabClassViolationMessage: '',
  //           isModified: false,
  //           isCancelled: false,
  //           cancellationDate: '',
  //           cancellationReason: '',
  //           status: 'paid and cancelled',
  //         },
  //       ],
  //       modeOfTransit: 'Bus',
  //       travelClass: 'Business',
  //       needsVisa: true,
  //       needsBoardingTransfer: true,
  //       needsHotelTransfer: true,
  //       boardingTransfer: {
  //         itineraryId: 'BORTR_YTR54',
  //         prefferedTime: '12:00 PM',
  //         pickupAddress: '789 Travel Plaza, Downtown, State 56789',
  //         dropAddress: '101 Boarding Street, City Hub, State 56789',
  //         isModified: false,
  //         isCancelled: false,
  //         cancellationDate: '',
  //         cancellationReason: '',
  //         status: 'paid and cancelled',
  //       },
  //       hotelTransfer: {
  //         itineraryId: 'HOTELTR_A6712',
  //         prefferedTime: '2:00 PM',
  //         pickupAddress: '321 Hotel Lane, Suburbia, State 56789',
  //         dropAddress: '567 Vacation Court, Resort Area, State 56789',
  //         isModified: false,
  //         isCancelled: false,
  //         cancellationDate: '',
  //         cancellationReason: '',
  //         status: 'paid and cancelled',
  //       },
  //       needsHotel: true,
  //       needsCab: true,
  //       status: 'booked',
  //     }
  //   ],
  //   tripType: { oneWayTrip: false, roundTrip: true, multiCityTrip: false },
  //   travelDocuments: ['Document 1', 'Document 2'],
  //   bookings: [
  //     {
  //       itineraryReference: {},
  //       docURL: 'exampleDocumentURL',
  //       details: {},
  //       status: {},
  //     },
  //   ],
  //   approvers: [
  //     {
  //       empId: 'approverEmployeeId',
  //       name: 'Approver Name',
  //       status: 'pending approval',
  //     },
  //   ],
  //   preferences: ['Preference 1', 'Preference 2'],
  //   travelViolations: {},
  //   travelRequestDate: '2023-01-01',
  //   travelBookingDate: '2023-01-02',
  //   travelCompletionDate: '2023-01-15',
  //   travelRequestRejectionReason: '',
  //   isCancelled: false,
  //   cancellationDate: '',
  //   cancellationReason: '',
  //   isCashAdvanceTaken: 'No',
  //   sentToTrip: false,
  // };
  // // console.log(sampleTravelRequest);

  // export default TravelRequestData;



 

  // // const dataArray = [
  // //   {
  // //     cashadvanceFlag: false,
  // //     data: {
  // //       name: 'john doe',
  // //       email: 'john.doe@example.com',
  // //       phone: '1234567890',
  // //     },
  // //   },
    
  // //   {
  // //     cashadvanceFlag: true,
  // //     data: {
  // //       name: 'bob johnson',
  // //       email: 'bob.johnson@example.com',
  // //       phone: '5555555555',
  // //     }

  // //   },
  // //   {
  // //     cashadvanceFlag: false,
  // //     data: {
  // //       name: 'jane smith',
  // //       email: 'jane.smith@example.com',
  // //       phone: '9876543210',
  // //     },
  // //   },
  // //   {
  // //     cashadvanceFlag: true,
  // //     data: {
  // //       name: 'alice brown',
  // //       email: 'alice.brown@example.com',
  // //       phone: '1111111111',
  // //     }
  // //   },
  // //   {
  // //     cashadvanceFlag: true,
  // //     data: {
  // //       name: 'charlie white',
  // //       email: 'charlie.white@example.com',
  // //       phone: '2222222222',
  // //     }
  // //   },
  // // ];

  // // const dataArrayCashAdvance = [
    
  // //   {
  // //     cashadvanceFlag: true,
  // //     data: {
  // //       name: 'bob johnson',
  // //       email: 'bob.johnson@example.com',
  // //       phone: '5555555555',
  // //     },
  // //     cashadvance:{
  // //       amount: 1000,
  // //       startDate: '2021-01-01',
  // //     }

  // //   },
  // //   {
  // //     cashadvanceFlag: true,
  // //     data: {
  // //       name: 'alice brown',
  // //       email: 'alice.brown@example.com',
  // //       phone: '1111111111',
  // //     },
  // //     cashadvance:{
  // //       amount: 1200,
  // //       startDate: '2021-01-01',
  // //     }
  // //   },
  // //   {
  // //     cashadvanceFlag: true,
  // //     data: {
  // //       name: 'charlie white',
  // //       email: 'charlie.white@example.com',
  // //       phone: '2222222222',
  // //     },
  // //     cashadvance:{
  // //       amount: 100,
  // //       startDate: '2021-01-01',
  // //     }
  // //   },
  // // ];