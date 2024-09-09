const trips = [
    
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



const itinerary = {
"flights": [
            {
                "violations": {
                    "class": null,
                    "amount": null
                },
                "bkd_violations": {
                    "class": null,
                    "amount": null
                },
                "bookingDetails": {
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    },
                    "docURL": null,
                    "docType": null
                },
                "itineraryId": "66a8ad3c5839fcbbbc7b2133",
                "formId": "638dfe7c-7260-473f-9126-e4c389032267",
                "sequence": 1,
                "from": "Lucknow",
                "to": "Mumbai",
                "date": "2024-07-31",
                "returnDate": null,
                "time": "12pm - 3pm",
                "returnTime": null,
                "travelClass": null,
                "isReturnTravel": false,
                "approvers": [
                    {
                        "empId": "1002",
                        "name": "Emma Thompson",
                        "status": "booked",
                        "_id": "66a8ac9f5839fcbbbc7b2063"
                    }
                ],
                "bkd_from": null,
                "bkd_to": null,
                "bkd_date": null,
                "bkd_returnDate": null,
                "bkd_time": null,
                "bkd_returnTime": null,
                "bkd_travelClass": null,
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "rejectionReason": null,
                "status": "booked",
                "_id": "66a8ad3c5839fcbbbc7b2127"
            },
            {
                "violations": {
                    "class": null,
                    "amount": null
                },
                "bkd_violations": {
                    "class": null,
                    "amount": null
                },
                "bookingDetails": {
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    },
                    "docURL": null,
                    "docType": null
                },
                "itineraryId": "66a8ad3c5839fcbbbc7b2134",
                "formId": "512812c9-fead-4917-842c-caff338f524c",
                "sequence": 3,
                "from": "Goa",
                "to": "Madurai",
                "date": "2024-08-01",
                "returnDate": null,
                "time": "12pm - 3pm",
                "returnTime": null,
                "travelClass": null,
                "isReturnTravel": false,
                "approvers": [
                    {
                        "empId": "1002",
                        "name": "Emma Thompson",
                        "status": "pending booking",
                        "_id": "66a8ac9f5839fcbbbc7b2063"
                    }
                ],
                "bkd_from": null,
                "bkd_to": null,
                "bkd_date": null,
                "bkd_returnDate": null,
                "bkd_time": null,
                "bkd_returnTime": null,
                "bkd_travelClass": null,
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "rejectionReason": null,
                "status": "booked",
                "_id": "66a8ad3c5839fcbbbc7b2129"
            }
        ],
        "buses": [
            {
                "violations": {
                    "class": null,
                    "amount": null
                },
                "bookingDetails": {
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    },
                    "docURL": null,
                    "docType": null
                },
                "itineraryId": "66a8ad3c5839fcbbbc7b2137",
                "formId": "50afa770-5615-494b-9f2b-6592b40bc624",
                "sequence": 4,
                "from": "Madurai",
                "to": "Minakshi Temple",
                "date": "2024-08-02",
                "time": "12pm - 3pm",
                "travelClass": null,
                "isReturnTravel": false,
                "approvers": [
                    {
                        "empId": "1002",
                        "name": "Emma Thompson",
                        "status": "booked",
                        "_id": "66a8ac9f5839fcbbbc7b2063"
                    }
                ],
                "bkd_from": null,
                "bkd_to": null,
                "bkd_date": null,
                "bkd_time": null,
                "bkd_travelClass": null,
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "rejectionReason": null,
                "status": "pending booking",
                "_id": "66a8ad3c5839fcbbbc7b212b"
            }
        ],
        "trains": [
            {
                "violations": {
                    "class": null,
                    "amount": null
                },
                "bkd_violations": {
                    "class": null,
                    "amount": null
                },
                "bookingDetails": {
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    },
                    "docURL": null,
                    "docType": null
                },
                "itineraryId": "66a8ad3c5839fcbbbc7b2136",
                "formId": "1e15b372-fad6-4d3f-b752-cf2294a76bda",
                "sequence": 2,
                "from": "Mumbai",
                "to": "goa",
                "date": "2024-07-31",
                "time": "12pm - 3pm",
                "travelClass": null,
                "isReturnTravel": false,
                "approvers": [
                    {
                        "empId": "1002",
                        "name": "Emma Thompson",
                        "status": "pending approval",
                        "_id": "66a8ac9f5839fcbbbc7b2063"
                    }
                ],
                "bkd_from": null,
                "bkd_to": null,
                "bkd_date": null,
                "bkd_time": null,
                "bkd_travelClass": null,
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "rejectionReason": null,
                "status": "pending booking",
                "_id": "66a8ad3c5839fcbbbc7b212d"
            }
        ],
        "hotels": [{
          "itineraryId": null,
          "formId": "5794d75c-3b6a-429b-923a-04a10b02331e",
          "location": "Lucknow",
          "locationPreference": null,
          "class": "Any",
          "checkIn": "2024-07-31",
          "checkOut": "2024-08-02",
          "needBrakfast": false,
          "needLunch": false,
          "needDinner": false,
          "needNonSmokingRoom": false,
          "violations": {
              "class": null,
              "amount": null
          },
          "bkd_location": null,
          "bkd_class": null,
          "bkd_checkIn": null,
          "bkd_checkOut": null,
          "bkd_violations": {
              "class": null,
              "amount": null
          },
          "modified": false,
          "cancellationDate": null,
          "cancellationReason": null,
          "status": "booked",
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
                  "imageUrl": "https://blobstorage0401.blob.core.windows.net/avatars/IDR_PROFILE_AVATAR_37@1x.png",
                  "_id": "66a8baf25839fcbbbc7b250c"
              }
          ],
          "needBreakfast": false,
          "time": "12pm - 3pm",
          "sequence": 1
      }],
        "cabs": [
            {
                "violations": {
                    "class": null,
                    "amount": null
                },
                "bookingDetails": {
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    },
                    "docURL": null,
                    "docType": null
                },
                "itineraryId": "66a8ad3c5839fcbbbc7b2135",
                "formId": "43b33ab3-099c-4712-a7a5-14086a8113bf",
                "sequence": 5,
                "date": "2024-08-05",
                "returnDate": "2024-08-07",
                "selectedDates": [],
                "class": "Regular",
                "time": "12pm - 3pm",
                "pickupAddress": "Hotel States",
                "dropAddress": "Airport",
                "isFullDayCab": true,
                "approvers": [
                    {
                        "empId": "1002",
                        "name": "Emma Thompson",
                        "status": "pending booking",
                        "_id": "66a8ac9f5839fcbbbc7b2063"
                    }
                ],
                "bkd_date": null,
                "bkd_class": null,
                "bkd_time": null,
                "bkd_pickupAddress": null,
                "bkd_dropAddress": null,
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "status": "pending approval",
                "_id": "66a8ad3c5839fcbbbc7b212f"
            }
        ],
        "carRentals": [
            {
                "violations": {
                    "class": null,
                    "amount": null
                },
                "bookingDetails": {
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    },
                    "docURL": null,
                    "docType": null
                },
                "itineraryId": "66a8ad3c5839fcbbbc7b2138",
                "formId": "9d975f26-6595-4157-98bc-7e994c969255",
                "sequence": 6,
                "date": "2024-08-02",
                "returnDate": "2024-07-30",
                "selectedDates": [],
                "class": "Regular",
                "time": "12pm - 3pm",
                "pickupAddress": "Hotel States",
                "dropAddress": "Temple",
                "approvers": [
                    {
                        "empId": "1002",
                        "name": "Emma Thompson",
                        "status": "pending approval",
                        "_id": "66a8ac9f5839fcbbbc7b2063"
                    }
                ],
                "bkd_date": null,
                "bkd_class": null,
                "bkd_time": null,
                "bkd_pickupAddress": null,
                "bkd_dropAddress": null,
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "status": "pending booking",
                "_id": "66a8ad3c5839fcbbbc7b2131"
            }
        ],
        "personalVehicles": []
};

const dummyPaidAndCancelledTrips =[

//   {
//     "tripId":"66a789d1b419ebf1bfe780227",
//     "travelRequestId": "66a7891b419ebf1bfe780227",
//     "travelRequestNumber": "TRAL000092",
//     "tripPurposeDescription": "Investor",
//     "tripName": "LUC-MUM(20th Jul 2024)",
//     "tripStartDate": "2024-08-05T00:00:00.000Z",
//     "travelRequestStatus": "paid and cancelled",
//     "createdBy": {
//                             "empId": "1002",
//                             "name": "Emma Thompson",
//                             "_id": "66a878ab5839fcbbbc7b1707"
//                         },
    
// },
// {
//   "tripId":"6xa789d1b419ebf1bfe780227",
//     "travelRequestId": "66a793ee419ebf1bfe78087c",
//     "travelRequestNumber": "TRAL000096",
//     "tripPurposeDescription": "investors",
//     "tripName": "LUC-DEL(29th Jul 2024)",
//     "tripStartDate": "2024-08-02T00:00:00.000Z",
//     "travelRequestStatus": "paid and cancelled",
//     "createdBy": {
//                             "empId": "1002",
//                             "name": "Emma Thompson",
//                             "_id": "66a878ab5839fcbbbc7b1707"
//                         },
// },
// {
//   "tripId":"66a789d1b419ebf1bfe7802f7",
//     "travelRequestId": "66a878ab5839fcbbbc7b1705",
//     "travelRequestNumber": "TRAL000098",
//     "tripPurposeDescription": "for investor",
//     "tripName": "JAI-KOL(30th Jul 2024)",
//     "tripStartDate": "2024-07-28T00:00:00.000Z",
//     "travelRequestStatus": "pending approval",
//     "createdBy": {
//                             "empId": "1002",
//                             "name": "Emma Thompson",
//                             "_id": "66a878ab5839fcbbbc7b1707"
//                         },
// },
// {
//     "tripId":"66a789dcxb419ebf1bfe780227",
//     "travelRequestId": "66a87ba35839fcbbbc7b185d",
//     "travelRequestNumber": "TRAL000099",
//     "tripPurposeDescription": "investor",
//     "tripName": "KOL-DEL(30th Jul 2024)",
//     "tripStartDate": "2024-08-01T00:00:00.000Z",
//     "travelRequestStatus": "pending approval",
//     "createdBy": {
//                             "empId": "1002",
//                             "name": "Engine Thompson",
//                             "_id": "66a878ab5839fcbbbc7b1707"
//                         },
// },
// {
//     "tripId":"6uya789d1b419ebf1bfe780227",
//     "travelRequestId": "66a78946419ebf1bfe780367",
//     "travelRequestNumber": "TRAL000093",
//     "tripPurposeDescription": "meal",
//     "tripName": "MUM-GOA(15th Aug 2024)",
//     "tripStartDate": "2024-09-15T00:00:00.000Z",
//     "travelRequestStatus": "pending approval",
//     "createdBy": {
//                             "empId": "1002",
//                             "name": "Benjamin Thompson",
//                             "_id": "66a878ab5839fcbbbc7b1707"
//                         },
// },
// {
//     "tripId":"66a789d1b419bvcebf1bfe780227",
//     "travelRequestId": "66a87c5e5839fcbbbc7b19a1",
//     "travelRequestNumber": "TRAL000100",
//     "tripPurposeDescription": "investors",
//     "tripName": "LON-IND(30th Jul 2024)",
//     "tripStartDate": "2024-09-08T00:00:00.000Z",
//     "travelRequestStatus": "pending approval",
//     "createdBy": {
//                             "empId": "1002",
//                             "name": "Rawbard Thompson",
//                             "_id": "66a878ab5839fcbbbc7b1707"
//                         },
// }

]

    
const dummyTravelReq =[

  {
    "travelRequestId": "66a7891b419ebf1bfe780227",
    "travelRequestNumber": "TRAL000092",
    "tripPurposeDescription": "Investor",
    "tripName": "LUC-MUM(20th Jul 2024)",
    "tripStartDate": "2024-08-05T00:00:00.000Z",
    "travelRequestStatus": "paid and cancelled",
    "createdBy": {
                            "empId": "1002",
                            "name": "Emma Thompson",
                            "_id": "66a878ab5839fcbbbc7b1707"
                        },
    
},
{
    "travelRequestId": "66a793ee419ebf1bfe78087c",
    "travelRequestNumber": "TRAL000096",
    "tripPurposeDescription": "investors",
    "tripName": "LUC-DEL(29th Jul 2024)",
    "tripStartDate": "2024-08-02T00:00:00.000Z",
    "travelRequestStatus": "pending approval",
    "createdBy": {
                            "empId": "1002",
                            "name": "Emma Thompson",
                            "_id": "66a878ab5839fcbbbc7b1707"
                        },
},
{
    "travelRequestId": "66a878ab5839fcbbbc7b1705",
    "travelRequestNumber": "TRAL000098",
    "tripPurposeDescription": "for investor",
    "tripName": "JAI-KOL(30th Jul 2024)",
    "tripStartDate": "2024-07-28T00:00:00.000Z",
    "travelRequestStatus": "pending approval",
    "createdBy": {
                            "empId": "1002",
                            "name": "Emma Thompson",
                            "_id": "66a878ab5839fcbbbc7b1707"
                        },
},
{
    "travelRequestId": "66a87ba35839fcbbbc7b185d",
    "travelRequestNumber": "TRAL000099",
    "tripPurposeDescription": "investor",
    "tripName": "KOL-DEL(30th Jul 2024)",
    "tripStartDate": "2024-08-01T00:00:00.000Z",
    "travelRequestStatus": "pending approval",
    "createdBy": {
                            "empId": "1002",
                            "name": "Engine Thompson",
                            "_id": "66a878ab5839fcbbbc7b1707"
                        },
},
{
    "travelRequestId": "66a78946419ebf1bfe780367",
    "travelRequestNumber": "TRAL000093",
    "tripPurposeDescription": "meal",
    "tripName": "MUM-GOA(15th Aug 2024)",
    "tripStartDate": "2024-09-15T00:00:00.000Z",
    "travelRequestStatus": "pending approval",
    "createdBy": {
                            "empId": "1002",
                            "name": "Benjamin Thompson",
                            "_id": "66a878ab5839fcbbbc7b1707"
                        },
},
{
    "travelRequestId": "66a87c5e5839fcbbbc7b19a1",
    "travelRequestNumber": "TRAL000100",
    "tripPurposeDescription": "investors",
    "tripName": "LON-IND(30th Jul 2024)",
    "tripStartDate": "2024-08-04T00:00:00.000Z",
    "travelRequestStatus": "pending approval",
    "createdBy": {
                            "empId": "1002",
                            "name": "Rawbard Thompson",
                            "_id": "66a878ab5839fcbbbc7b1707"
                        },
}

]


const dummyTravelReqForBooking = dummyTravelReq.map(travel=>({...travel,itinerary}))



const travelExpense = [
  {
  "tripNumber": "TRIPAL000001",
  "tripId": "667a3a5be9a18ce3478d1a0d",
  "tripPurpose": "Business",
  "tripName":"us - del - mum",
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
      "expenseHeaderStatus": "paid",
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
          "Tax Amount": "2000",
          "Total Amount": "7000",
          "Mode of Payment": "Cash",
          "Currency": {
            "countryCode": "IN",
            "fullName": "Indian Rupee",
            "shortName": "INR",
            "symbol": "₹"
          },
          "Category Name": "Flight",
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
          "Tax Amount": "180",
          "Total Amount": "1000",
          "Mode of Payment": "Cash",
          "Currency": {
            "countryCode": "IN",
            "fullName": "Indian Rupee",
            "shortName": "INR",
            "symbol": "₹"
          },
          "Category Name": "Cab Rental",
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
      "expenseHeaderStatus": "pending approval",
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
          "Tax Amount": "369",
          "Total Amount": "2050",
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
},
  {
    "tripId": "667a38e9e9a18ce3478d1261",
  "tripNumber": "TRIPAL000001",
  "tripPurpose": "Business",
  "tripName": "DEL-BAN-LUC-DEL-BAN-DEL(9th Jul)",
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
];

const TrExpenseForApproval = [
  {
    "createdBy": {
      "empId": "1002",
      "name": "Calicus Trivera",
      "_id": "667babcdb043bb2aadcd288b"
    },
    "tripNumber": "TRIPAL000001",
    "tripId": "667a3a5be9a18ce3478d1a0d",
    "tripPurpose": "Business",
    "tripName":"DEL-BAN-LUC-DEL-BAN-DEL(9th Jul)",
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
        "expenseHeaderStatus": "paid",
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
            "lineItemStatus": "pending approval",
            "expenseLineId": "667a3951b043bb2a4dca304e",
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
            "expenseLineAllocation": [],
            "lineItemStatus":"rejected"
          },
          {
            "lineItemStatus": "pending approval",
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
            "expenseLineAllocation": [],
            "lineItemStatus":"rejected"
          },
          {
            "lineItemStatus": "pending approval",
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
            "expenseLineAllocation": [],
            "lineItemStatus":"rejected"
          },
          {
            "lineItemStatus": "approved",
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
            "expenseLineAllocation": [],
            "lineItemStatus":"rejected"
          },
          {
            "lineItemStatus": "rejected",
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
            "expenseLineAllocation": [],
            "lineItemStatus":"rejected"
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
            "expenseLineAllocation": [],
            "lineItemStatus":"rejected"
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
            "expenseLineAllocation": [],
            "lineItemStatus":"rejected"
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
            "expenseLineAllocation": [],
            "lineItemStatus":"rejected"
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
            "expenseLineAllocation": [],
            "lineItemStatus":"rejected"
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
            "expenseLineAllocation": [],
            "lineItemStatus":"rejected"
          },
          {
            "lineItemStatus":"pending approval",
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
            "Tax Amount": "2000",
            "Total Amount": "7000",
            "Mode of Payment": "Cash",
            "Currency": {
              "countryCode": "IN",
              "fullName": "Indian Rupee",
              "shortName": "INR",
              "symbol": "₹"
            },
            "Category Name": "Flight",
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
            "lineItemStatus":"approved",
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
            "Tax Amount": "180",
            "Total Amount": "1000",
            "Mode of Payment": "Cash",
            "Currency": {
              "countryCode": "IN",
              "fullName": "Indian Rupee",
              "shortName": "INR",
              "symbol": "₹"
            },
            "Category Name": "Cab Rental",
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
      ,
      
  },
    {
      "createdBy": {
      "empId": "100b",
      "name": "Lyklii heliana",
      "_id": "667babcdb043bb2aadcd288b"
    },
      "tripId": "667a38e9e9a18ce3478d1261",
    "tripNumber": "TRIPAL000001",
    "tripPurpose": "Business",
    "tripName": "DEL-LUC-LUC-DEL-BAN-DEL(9th Jul)",
 
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
      
     
  }
]

const NonTrExpenseForApproval = [
  {
    "_id": "667babcdb02acc127897f405",
    "expenseHeaderId": "667babbeb043bb2aadcd2866",
    "tenantId": "66794853c61cc24ba97b5b0f",
    "__v": 0,
    "companyName": "alpha code labs",
    "createdBy": {
      "empId": "1002",
      "name": "Benjamin Clark",
      "_id": "667babcdb043bb2aadcd288b"
    },
    "expenseHeaderNumber": "NEAL000007",
    "expenseHeaderStatus": "draft",
    "expenseHeaderType": "reimbursement",
    "expenseLines": [
      {
        "expenseLineId": "667babcdb043bb2aadcd2889",
        "lineItemStatus": "pending approval",
        "expenseLineAllocation": [],
        "multiCurrencyDetails": null,
        "_id": "667babcdb043bb2aadcd288a",
        "group": {
          "limit": 0,
          "group": "Finance Team",
          "message": "Benjamin Clark is part of Finance Team. Highest limit found: 0"
        },
        "Category Name": "Luggage",
        "Bill Date": "2024-06-27",
        "Bill Number": "",
        "Vendor Name": "",
        "Description": "",
        "Quantity": "",
        "Unit Cost": "",
        "Tax Amount": "",
        "Total Amount": "888",
        "Mode of Payment": "Cash",
        "Document": "",
        "Currency": {
          "countryCode": "IN",
          "fullName": "Indian Rupee",
          "shortName": "INR",
          "symbol": "₹"
        }
      },
      {
        "expenseLineId": "667babcdb0x3bb2aadcd2889",
        "lineItemStatus": "rejected",
        "expenseLineAllocation": [],
        "multiCurrencyDetails": null,
        "_id": "667babcdb043bb2aadcd288a",
        "group": {
          "limit": 0,
          "group": "Finance Team",
          "message": "Benjamin Clark is part of Finance Team. Highest limit found: 0"
        },
        "Category Name": "Luggage",
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
      {
        "expenseLineId": "6127babcdb0x3bb2aadcd2889",
        "lineItemStatus": "approved",
        "expenseLineAllocation": [],
        "multiCurrencyDetails": null,
        "_id": "667babcdb043bb2aadcd288a",
        "group": {
          "limit": 0,
          "group": "Finance Team",
          "message": "Benjamin Clark is part of Finance Team. Highest limit found: 0"
        },
        "Category Name": "Luggage",
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
      {
        "expenseLineId": "6127babcdb0x3bb2aadcdx889",
        "lineItemStatus": "pending approval",
        "expenseLineAllocation": [],
        "multiCurrencyDetails": null,
        "_id": "667babcdb043bb2aadcd288a",
        "group": {
          "limit": 0,
          "group": "Finance Team",
          "message": "Benjamin Clark is part of Finance Team. Highest limit found: 0"
        },
        "Category Name": "Luggage",
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
    ]
  },
  {
    "_id": "667babcdb02acc127897f405",
    "expenseHeaderId": "667babbeb043bb2aadcd2866",
    "tenantId": "66794853c61cc24ba97b5b0f",
    "__v": 0,
    "companyName": "alpha code labs",
    "createdBy": {
      "empId": "1002",
      "name": "Benjamin Clark",
      "_id": "667babcdb043bb2aadcd288b"
    },
    "expenseHeaderNumber": "REAL000007",
    "expenseHeaderStatus": "paid",
    "expenseHeaderType": "reimbursement",
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
      {
        "lineItemId": "667babcdb043bb2aadcd2890",
        "lineItemStatus": "approved",
        "expenseLineAllocation": [],
        "multiCurrencyDetails": null,
        "_id": "667babcdb043bb2aadcd2891",
        "group": {
          "limit": 500,
          "group": "Sales Team",
          "message": "Benjamin Clark is part of Sales Team. Highest limit found: 500"
        },
        "Category Name": "Flight",
        "Bill Date": "2024-06-25",
        "Bill Number": "TRV12345",
        "Vendor Name": "XYZ Travels",
        "Description": "Flight to New York",
        "Quantity": "1",
        "Unit Cost": "5000",
        "Tax Amount": "500",
        "Total Amount": "5500",
        "Mode of Payment": "Credit Card",
        "Document": "",
        "Currency": {
          "countryCode": "IN",
          "fullName": "Indian Rupee",
          "shortName": "INR",
          "symbol": "₹"
        }
      },
      {
        "lineItemId": "667babc7b043bb2aadcd2892",
        "lineItemStatus": "submitted",
        "expenseLineAllocation": [],
        "multiCurrencyDetails": null,
        "_id": "667babcdb043bb2aadcd2893",
        "group": {
          "limit": 1000,
          "group": "Marketing Team",
          "message": "Benjamin Clark is part of Marketing Team. Highest limit found: 1000"
        },
        "Category Name": "Entertainment",
        "Bill Date": "2024-06-26",
        "Bill Number": "ENT45678",
        "Vendor Name": "ABC Events",
        "Description": "Team building event",
        "Quantity": "1",
        "Unit Cost": "10000",
        "Tax Amount": "1000",
        "Total Amount": "11000",
        "Mode of Payment": "Bank Transfer",
        "Document": "",
        "Currency": {
          "countryCode": "IN",
          "fullName": "Indian Rupee",
          "shortName": "INR",
          "symbol": "₹"
        }
      },
     
    ]
  },
]

const nonTravelExpense = [
  {
    "_id": "667babcdb02acc127897f405",
    "expenseHeaderId": "667babbeb043bb2aadcd2866",
    "tenantId": "66794853c61cc24ba97b5b0f",
    "__v": 0,
    "companyName": "alpha code labs",
    "createdBy": {
      "empId": "1002",
      "name": "anamila",
      "_id": "667babcdb043bb2aadcd288b"
    },
    "expenseHeaderNumber": "REAL000006",
    "expenseHeaderStatus": "pending booking",
    "expenseHeaderType": "reimbursement",
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
  {
    "_id": "667babcdb02acc127897f405",
    "expenseHeaderId": "667babbeb043bb2aadcd2866",
    "tenantId": "66794853c61cc24ba97b5b0f",
    "__v": 0,
    "companyName": "alpha code labs",
    "createdBy": {
      "empId": "1002",
      "name": "Benjamin Clark",
      "_id": "667babcdb043bb2aadcd288b"
    },
    "expenseHeaderNumber": "REAL000007",
    "expenseHeaderStatus": "draft",
    "expenseHeaderType": "reimbursement",
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
        "Category Name": "Luggage",
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
  {
    "_id": "667babcdb02acc127897f405",
    "expenseHeaderId": "667babbeb043bb2aadcd2866",
    "tenantId": "66794853c61cc24ba97b5b0f",
    "__v": 0,
    "companyName": "alpha code labs",
    "createdBy": {
      "empId": "1002",
      "name": "Benjamin Clark",
      "_id": "667babcdb043bb2aadcd288b"
    },
    "expenseHeaderNumber": "REAL000007",
    "expenseHeaderStatus": "paid",
    "expenseHeaderType": "reimbursement",
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
      {
        "lineItemId": "667babcdb043bb2aadcd2890",
        "lineItemStatus": "approved",
        "expenseLineAllocation": [],
        "multiCurrencyDetails": null,
        "_id": "667babcdb043bb2aadcd2891",
        "group": {
          "limit": 500,
          "group": "Sales Team",
          "message": "Benjamin Clark is part of Sales Team. Highest limit found: 500"
        },
        "Category Name": "Flight",
        "Bill Date": "2024-06-25",
        "Bill Number": "TRV12345",
        "Vendor Name": "XYZ Travels",
        "Description": "Flight to New York",
        "Quantity": "1",
        "Unit Cost": "5000",
        "Tax Amount": "500",
        "Total Amount": "5500",
        "Mode of Payment": "Credit Card",
        "Document": "",
        "Currency": {
          "countryCode": "IN",
          "fullName": "Indian Rupee",
          "shortName": "INR",
          "symbol": "₹"
        }
      },
      {
        "lineItemId": "667babcdb043bb2aadcd2892",
        "lineItemStatus": "submitted",
        "expenseLineAllocation": [],
        "multiCurrencyDetails": null,
        "_id": "667babcdb043bb2aadcd2893",
        "group": {
          "limit": 1000,
          "group": "Marketing Team",
          "message": "Benjamin Clark is part of Marketing Team. Highest limit found: 1000"
        },
        "Category Name": "Entertainment",
        "Bill Date": "2024-06-26",
        "Bill Number": "ENT45678",
        "Vendor Name": "ABC Events",
        "Description": "Team building event",
        "Quantity": "1",
        "Unit Cost": "10000",
        "Tax Amount": "1000",
        "Total Amount": "11000",
        "Mode of Payment": "Bank Transfer",
        "Document": "",
        "Currency": {
          "countryCode": "IN",
          "fullName": "Indian Rupee",
          "shortName": "INR",
          "symbol": "₹"
        }
      },
      {
        "lineItemId": "667babcdb043bb2aadcd2894",
        "lineItemStatus": "rejected",
        "expenseLineAllocation": [],
        "multiCurrencyDetails": null,
        "_id": "667babcdb043bb2aadcd2895",
        "group": {
          "limit": 0,
          "group": "HR Team",
          "message": "Benjamin Clark is part of HR Team. Highest limit found: 0"
        },
        "Category Name": "Office Supplies",
        "Bill Date": "2024-06-24",
        "Bill Number": "STN78901",
        "Vendor Name": "Office Supplies Ltd",
        "Description": "Office stationery purchase",
        "Quantity": "10",
        "Unit Cost": "50",
        "Tax Amount": "5",
        "Total Amount": "505",
        "Mode of Payment": "Cash",
        "Document": "",
        "Currency": {
          "countryCode": "IN",
          "fullName": "Indian Rupee",
          "shortName": "INR",
          "symbol": "₹"
        }
      },
      {
        "lineItemId": "667babcdb043bb2aadcd2894",
        "lineItemStatus": "rejected",
        "expenseLineAllocation": [],
        "multiCurrencyDetails": null,
        "_id": "667babcdb043bb2aadcd2895",
        "group": {
          "limit": 0,
          "group": "HR Team",
          "message": "Benjamin Clark is part of HR Team. Highest limit found: 0"
        },
        "Category Name": "Office Supplies",
        "Bill Date": "2024-06-24",
        "Bill Number": "STN78901",
        "Vendor Name": "Office Supplies Ltd",
        "Description": "Office stationery purchase",
        "Quantity": "10",
        "Unit Cost": "50",
        "Tax Amount": "5",
        "Total Amount": "505",
        "Mode of Payment": "Cash",
        "Document": "",
        "Currency": {
          "countryCode": "IN",
          "fullName": "Indian Rupee",
          "shortName": "INR",
          "symbol": "₹"
        }
      }
    ]
  },
];

const TRCashadvance = [
  {
    tripId:"667a38e9e9a18ce3478d1263",
    travelRequestStatus:"pending approval",
    tripNumber: "TRIPAL000001",
    travelRequestId: "667a9de68daacf93aefceb12",
    travelRequestNumber: "TRAL000001",
    "tripName": "DEL-BAN-LUC-DEL-BAN-DEL(1st Jul)",
    "createdBy": {
                        "empId": "1002",
                        "name": "Benjamin Clark",
                        "_id": "667aa2d3b043bb2aadcb0c88"
                    },
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
  {
    travelRequestStatus:"booked",
    tripId: "667a38e9e9a18ce3478d126r",
    tripNumber: "TRIPAL000002",
    travelRequestId: "667955dbb2e14ac28c9ec052",
    travelRequestNumber: "TRAL000001",
    "tripName": "DEL-BAN-LUC-DEL-BAN-DEL(9th Jul)",
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
        cashAdvanceStatus: "draft"
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
        cashAdvanceStatus: "cancelled"
      }
    ]
  },
  {
    travelRequestStatus:"pending approval",
    tripId: "667a38e9e9a18ce3478d126x",
    tripNumber: "TRIPAL000003",
    travelRequestId: "66796b3bb2e14ac28c9eebb3",
    travelRequestNumber: "TRAL000001",
    "tripName": "DEL-BAN-LUC-DEL-BAN-DEL(9th Jul)",
    cashAdvances: [
      {
        cashAdvanceId: "667a39e4a1b88232721397fb",
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
        cashAdvanceStatus: "paid and cancelled"
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
        cashAdvanceStatus: "pending settlement"
      }
    ]
  },
  {
    travelRequestStatus:"draft",
    tripId: "667a38e9e9a18ce3478d1265",
    tripNumber: "TRIPAL000004",
    travelRequestId: "667955dbb2e14ac28c9ec054",
    travelRequestNumber: "TRAL000001",
    "tripName": "DEL-BAN-LUC-DEL-BAN-DEL(9th Jul)",
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
        cashAdvanceStatus: "pending settlement"
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
        cashAdvanceStatus: "pending settlement"
      }
    ]
  },
  {
    travelRequestStatus:"pending booking",
    tripId: "667a38e9e9a18ce3478d126b",
    tripNumber: "TRIPAL000005",
    travelRequestId: "667955dbb2e14ac28c9ec055",
    travelRequestNumber: "TRAL000001",
    "tripName": "DEL-BAN-LUC-DEL-BAN-DEL(9th Jul)",
    cashAdvances: [
      {
        cashAdvanceId: "66795ea1a4b5e4e0e666cd4a",
        cashAdvanceNumber: "CA0001",
        amountDetails: [
          {
            amount: 200,
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
        cashAdvanceStatus: "pending settlement"
      },
      {
        cashAdvanceId: "66795ea1a4b5e4e0e666cd4a",
        cashAdvanceNumber: "CA0001",
        amountDetails: [
          {
            amount: 100,
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
        cashAdvanceStatus: "pending settlement"
      }
    ]
  }
];

const NonTRCashAdvances = [
  // {
  //   cashAdvanceId: "66795ea1a4b5e4e0e666cd4a",
  //   cashAdvanceNumber: "CA0001",
  //   amountDetails: [
  //     {
  //       amount: 400,
  //       currency: {
  //         countryCode: "IN",
  //         fullName: "Indian Rupee",
  //         shortName: "INR",
  //         symbol: "₹"
  //       },
  //       mode: null,
  //       _id: "66795ea1a4b5e4e0e666cd5a"
  //     },
  //     {
  //       amount: 500,
  //       currency: {
  //         countryCode: "IN",
  //         fullName: "Indian Rupee",
  //         shortName: "INR",
  //         symbol: "₹"
  //       },
  //       mode: null,
  //       _id: "66795ea1a4b5e4e0e666cd5b"
  //     }
  //   ],
  //   cashAdvanceStatus: "pending settlement"
  // },
  // {
  //   cashAdvanceId: "66795ea1a4b5e4e0e666cd4b",
  //   cashAdvanceNumber: "CA0002",
  //   amountDetails: [
  //     {
  //       amount: 6000,
  //       currency: {
  //         countryCode: "IN",
  //         fullName: "Indian Rupee",
  //         shortName: "INR",
  //         symbol: "₹"
  //       },
  //       mode: null,
  //       _id: "66795ea1a4b5e4e0e666cd5c"
  //     }
  //   ],
  //   cashAdvanceStatus: "pending settlement"
  // },
  // {
  //   cashAdvanceId: "66795ea1a4b5e4e0e666cd4c",
  //   cashAdvanceNumber: "CA0003",
  //   amountDetails: [
  //     {
  //       amount: 1500,
  //       currency: {
  //         countryCode: "US",
  //         fullName: "US Dollar",
  //         shortName: "USD",
  //         symbol: "$"
  //       },
  //       mode: null,
  //       _id: "66795ea1a4b5e4e0e666cd5d"
  //     },
  //     {
  //       amount: 2000,
  //       currency: {
  //         countryCode: "US",
  //         fullName: "US Dollar",
  //         shortName: "USD",
  //         symbol: "$"
  //       },
  //       mode: null,
  //       _id: "66795ea1a4b5e4e0e666cd5e"
  //     }
  //   ],
  //   cashAdvanceStatus: "approved"
  // }
];

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

const dummytravelRequests = [
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
  },
  {
    travelRequestNumber:"TRAL000012",
    travelRequestStatus:"draft"
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

export {dummyPaidAndCancelledTrips,  dummyTravelReqForBooking,NonTrExpenseForApproval, TrExpenseForApproval, nonTravelExpense, NonTRCashAdvances, tripArray, travelExpense, reimbursementExpense, dummytravelRequests, trips, TRCashadvance}