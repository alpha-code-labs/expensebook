//first time click on book expense
export const addLineItemClicked={
    "success": true,//
    "tripId": "6587f7d3f1bc28bda7fd77d4",//
    "tripNumber": "TRIPABG000002",//
    "tripPurpose": "Delhi Branch Opening",//
    "newExpenseReport": true,
    "expenseHeaderNumber": "ERTNT000000",
    "expenseAmountStatus": {
        "totalCashAmount": 8000,
        "totalAlreadyBookedExpenseAmount": 7.297809128007959e+24,
        "totalExpenseAmount": 7.297809128007959e+24,
        "totalPersonalExpenseAmount": 0,
        "totalremainingCash": 8000
    },
    "travelExpenseData": [
        {
            "tenantId": "TNTABG",
            "tenantName": "AdithyaBirlaGroup",
            "companyName": "AdithyaBirlaGroup",
            "travelRequestId": "65883f225d22551868c70972",
            "travelRequestNumber": "65888fec0ac57bd7a553530e",
            "expenseHeaderNumber": "ERTNT000000",
            "expenseHeaderId": "65c085cb9d011e81a15d248c",
            "expenseHeaderType": "travel",
            "travelAllocationFlags": {
                "level1": true,
                "level2": false,
                "level3": false
            },
            "expenseHeaderStatus": "new",
            "alreadyBookedExpenseLines": [
                {
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
                            "formStatus": "Submitted",
                            "_id": "65815786e1751ead06a684c2"
                        }
                    ],
                    "flights": [
                        {
                            "itineraryId": "5fec83753a4959001771449a",
                            "formId": "form123",
                            "from": "Mumbai",
                            "to": "Delhi",
                            "date": "2023-12-16T15:30:00.000Z",
                            "time": "11:00",
                            "travelClass": "Business Class",
                            "violations": {
                                "class": "Type A",
                                "amount": "100 USD"
                            },
                            "bkd_from": "Mumbai",
                            "bkd_to": "Delhi",
                            "bkd_date": "2023-12-21T15:30:00.000Z",
                            "bkd_time": "12:20",
                            "bkd_travelClass": "Business Class",
                            "bkd_violations": {
                                "class": "Type A",
                                "amount": "100 USD"
                            },
                            "modified": false,
                            "cancellationDate": null,
                            "cancellationReason": "Flight canceled by airline",
                            "status": "booked",
                            "bookingDetails": {
                                "docURL": "https://example.com/booking.pdf",
                                "docType": "PDF",
                                "billDetails": {
                                    "totalAmount": "72978"
                                }
                            },
                            "_id": "65815786e1751ead06a684c3"
                        }
                    ],
                    "buses": [
                        {
                            "itineraryId": "5fec83753a4959001771449d",
                            "formId": "form126",
                            "from": "City A",
                            "to": "City B",
                            "date": "2023-12-19T15:30:00.000Z",
                            "time": "08:00",
                            "travelClass": "Sleeper",
                            "violations": {
                                "class": "Type D",
                                "amount": "70 USD"
                            },
                            "bkd_from": "City A",
                            "bkd_to": "City B",
                            "bkd_date": "2023-12-19T15:30:00.000Z",
                            "bkd_time": "08:00",
                            "bkd_travelClass": "Sleeper",
                            "modified": false,
                            "cancellationDate": null,
                            "cancellationReason": "",
                            "status": "booked",
                            "bookingDetails": {
                                "docURL": "https://example.com/bus-booking.pdf",
                                "docType": "PDF",
                                "billDetails": {
                                    "totalAmount": "9128"
                                }
                            },
                            "_id": "65815786e1751ead06a684c4"
                        }
                    ],
                    "trains": [],
                    "hotels": [
                        {
                            "itineraryId": "5fec83753a4959001771449c",
                            "formId": "form125",
                            "location": "Hotel ABC",
                            "locationPreference": "Near Airport",
                            "class": "Luxury",
                            "checkIn": "2023-12-18T15:30:00.000Z",
                            "checkOut": "2023-12-22T15:30:00.000Z",
                            "violations": {
                                "class": "Type C",
                                "amount": "120 USD"
                            },
                            "bkd_location": "Hotel ABC",
                            "bkd_class": "Luxury",
                            "bkd_checkIn": "2023-12-18T15:30:00.000Z",
                            "bkd_checkOut": "2023-12-22T15:30:00.000Z",
                            "bkd_violations": {
                                "class": "Type C",
                                "amount": "120 USD"
                            },
                            "modified": false,
                            "cancellationDate": "",
                            "cancellationReason": "",
                            "status": "booked",
                            "bookingDetails": {
                                "docURL": "https://example.com/hotel-booking.pdf",
                                "docType": "PDF",
                                "billDetails": {
                                    "totalAmount": "7959"
                                }
                            },
                            "_id": "65815786e1751ead06a684c5"
                        },
                        {
                            "itineraryId": "5fec83753a4959001771449c",
                            "formId": "form125",
                            "location": "Hotel ABC",
                            "locationPreference": "Near Airport",
                            "class": "Luxury",
                            "checkIn": "2023-12-18T15:30:00.000Z",
                            "checkOut": "2023-12-22T15:30:00.000Z",
                            "violations": {
                                "class": "Type C",
                                "amount": "120 USD"
                            },
                            "bkd_location": "Hotel ABC",
                            "bkd_class": "Luxury",
                            "bkd_checkIn": "2023-12-18T15:30:00.000Z",
                            "bkd_checkOut": "2023-12-22T15:30:00.000Z",
                            "bkd_violations": {
                                "class": "Type C",
                                "amount": "120 USD"
                            },
                            "modified": false,
                            "cancellationDate": "",
                            "cancellationReason": "",
                            "status": "booked",
                            "bookingDetails": {
                                "docURL": "https://example.com/hotel-booking.pdf",
                                "docType": "PDF",
                                "billDetails": {
                                    "totalAmount": "8765"
                                }
                            },
                            "_id": "65815786e1751ead06a684c6"
                        }
                    ],
                    "cabs": [
                        {
                            "itineraryId": "5fec83753a4959001771449b",
                            "formId": "form124",
                            "date": "2023-12-20T15:30:00.000Z",
                            "class": "Sedan",
                            "preferredTime": "10:00",
                            "pickupAddress": "Address 1",
                            "dropAddress": "Address 2",
                            "violations": {
                                "class": "Type B",
                                "amount": "80 USD"
                            },
                            "bkd_date": "2023-12-20T15:30:00.000Z",
                            "bkd_class": "Sedan",
                            "bkd_preferredTime": "10:00",
                            "bkd_pickupAddress": "Address 1",
                            "bkd_dropAddress": "Address 2",
                            "bkd_violations": {
                                "class": "Type B",
                                "amount": "80 USD"
                            },
                            "modified": false,
                            "cancellationDate": "",
                            "cancellationReason": "",
                            "status": "booked",
                            "bookingDetails": {
                                "docURL": "https://example.com/cab-booking.pdf",
                                "docType": "PDF",
                                "billDetails": {
                                    "totalAmount": "8396"
                                }
                            },
                            "type": "departure pickup",
                            "_id": "65815786e1751ead06a684c7"
                        }
                    ],
                    "_id": "65c085cb9d011e81a15d248e"
                }
            ],
            "approvers": [
                {
                    "empId": "empG001",
                    "name": "Garp",
                    "_id": "65c085cb9d011e81a15d2495"
                },
                {
                    "empId": "empM001",
                    "name": "MarcoPolo",
                    "_id": "65c085cb9d011e81a15d2496"
                }
            ],
            "violations": [],
            "_id": "65c085cb9d011e81a15d248d",
            "expenseLines": []
        }
    ],
    "isCashAdvanceTaken": true,
    "companyDetails": {
        "defaultCurrency": "rupee",
        "travelAllocationFlags": {
            "level1": true,
            "level2": false,
            "level3": false
        },
        "expenseAllocation": [
            {
                "headerName": "department",
                "headerValues": [
                    "Finance",
                    "Engineering",
                    "HR",
                    "Marketing"
                ]
            }
        ],
        "expenseAllocation_accountLine": "14544",
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
        "expenseSettlementOptions": {
            "Cash": true,
            "Cheque": true,
            "Salary Account": true,
            "Prepaid Card": false,
            "NEFT Bank Transfer": false
        }
    }
}