//from drive structure

const dummyTravelWithCashAdvanceData = {
    travelRequestData: {
            tenantId: 'sampleTenantId',
            tenantName: 'Sample Tenant',
            companyName: 'Sample Company',
            travelRequestId: 'trID-jhfu767687',
            travelRequestNumber: 'TR123',
            tripPurpose: 'Business Trip',
            travelRequestStatus: 'pending approval',
            travelRequestState: 'section 0',
            createdBy: { empId: 'EMP001', name: 'John Doe' },
            createdFor: { empId: 'EMP002', name: 'Jane Doe' },
            teamMembers: [],
            travelAllocationHeaders: [],
            itinerary: {
              formState: [
                {
                  formId: 'Form001',
                  transfers: {
                    needsDeparturePickup: true,
                    needsDepartureDrop: true,
                    needsReturnPickup: false,
                    needsReturnDrop: false,
                  },
                  needsHotel: true,
                  needsCab: true,
                  needsVisa: false,
                  modeOfTransit: 'Air',
                  travelClass: 'Business',
                },
                {
                  formId: 'Form002',
                  transfers: {
                    needsDeparturePickup: false,
                    needsDepartureDrop: true,
                    needsReturnPickup: true,
                    needsReturnDrop: false,
                  },
                  needsHotel: false,
                  needsCab: true,
                  needsVisa: true,
                  modeOfTransit: 'Train',
                  travelClass: 'Economy',
                },
              ],
              flights: [
                {
                  itineraryId: "flightID76876ghgher",
                  formId: 'Form001',
                  from: 'CityA',
                  to: 'CityB',
                  date: '2023-01-01',
                  time: '09:00 AM',
                  travelClass: 'Business',
                  violations: { class: 'ClassA', isReturnTravel: false, amount: '500 USD' },
                  bkd_from: 'CityA',
                  bkd_to: 'CityB',
                  bkd_date: '2023-01-01',
                  bkd_time: '09:00 AM',
                  bkd_travelClass: 'Business',
                  bkd_violations: { class: 'ClassA', amount: '500 USD' },
                  modified: false,
                  cancellationDate: null,
                  cancellationReason: '',
                  status: 'pending approval',
                  bookingDetails: { docURL: 'booking-url', docType: 'PDF', billDetails: {} },
                },
              ],
              buses: [
                {
                  itineraryId: "buses-jshff7678gr",
                  formId: 'Form002',
                  from: 'CityM',
                  to: 'CityN',
                  date: '2023-02-15',
                  time: '02:30 PM',
                  travelClass: 'Standard',
                  isReturnTravel: false,
                  violations: { class: 'ClassF', amount: '150 USD' },
                  bkd_from: 'CityM',
                  bkd_to: 'CityN',
                  bkd_date: '2023-02-15',
                  bkd_time: '02:30 PM',
                  bkd_travelClass: 'Standard',
                  modified: false,
                  cancellationDate: null,
                  cancellationReason: '',
                  status: 'pending approval',
                  bookingDetails: { docURL: 'bus-booking-url', docType: 'PDF', billDetails: {} },
                },
              ],
              trains: [
                {
                  itineraryId: "trains768gjhgfff",
                  formId: 'Form001',
                  from: 'CityP',
                  to: 'CityQ',
                  date: '2023-03-01',
                  time: '08:30 AM',
                  travelClass: 'First Class',
                  isReturnTravel: false,
                  violations: { class: 'ClassC', amount: '700 USD' },
                  bkd_from: 'CityP',
                  bkd_to: 'CityQ',
                  bkd_date: '2023-03-01',
                  bkd_time: '08:30 AM',
                  bkd_travelClass: 'First Class',
                  bkd_violations: { class: 'ClassC', amount: '700 USD' },
                  modified: false,
                  cancellationDate: null,
                  cancellationReason: '',
                  status: 'approved',
                  bookingDetails: { docURL: 'train-booking-url', docType: 'PDF', billDetails: {} },
                },
              ],
              hotels: [
                {
                  itineraryId: "hotels-7687hgghjgsr",
                  formId: 'Form001',
                  location: 'Hotel Z',
                  locationPreference: 'CityZ',
                  class: 'Luxury',
                  checkIn: '2023-04-01',
                  checkOut: '2023-04-05',
                  checkInTime: '03:00 PM',
                  checkOutTime: '11:00 AM',
                  violations: { class: 'ClassD', amount: '200 USD' },
                  bkd_location: 'Hotel Z',
                  bkd_locationPreference: 'CityZ',
                  bkd_class: 'Luxury',
                  bkd_checkIn: '2023-04-01',
                  bkd_checkOut: '2023-04-05',
                  bkd_checkInTime: '03:00 PM',
                  bkd_checkOutTime: '11:00 AM',
                  bkd_violations: { class: 'ClassD', amount: '200 USD' },
                  modified: false,
                  cancellationDate: null,
                  cancellationReason: '',
                  status: 'pending approval',
                  bookingDetails: { docURL: 'hotel-booking-url', docType: 'PDF', billDetails: {} },
                },
              ],
              cabs: [
                {
                  itineraryId: "cabs-76ghgjhyutuyfs",
                  formId: 'Form002',
                  date: '2023-03-01',
                  class: 'SUV',
                  preferredTime: '09:00 AM',
                  pickupAddress: 'AddressX',
                  dropAddress: 'AddressY',
                  violations: { class: 'ClassG', amount: '80 USD' },
                  bkd_date: '2023-03-01',
                  bkd_class: 'SUV',
                  bkd_preferredTime: '09:00 AM',
                  bkd_pickupAddress: 'AddressX',
                  bkd_dropAddress: 'AddressY',
                  bkd_violations: { class: 'ClassG', amount: '80 USD' },
                  modified: false,
                  cancellationDate: null,
                  cancellationReason: '',
                  status: 'pending approval',
                  bookingDetails: { docURL: 'cab-booking-url', docType: 'PDF', billDetails: {} },
                  type: 'departure pickup',
                },
              ],
            },
            tripType: { oneWayTrip: true, roundTrip: false, multiCityTrip: false },
            travelDocuments: ['document1.pdf', 'document2.pdf'],
            bookings: [
              {
                itineraryReference: {},
                docURL: 'booking-url',
                details: {},
                status: {},
              },
            ],
            approvers: [
              {
                empId: 'Approver001',
                name: 'Approver Name',
                status: 'pending approval',
              },
            ],
            assignedTo: { empId: 'Assignee001', name: 'Assigned Person' },
            bookedBy: { empId: 'Booker001', name: 'Booking Person' },
            recoveredBy: { empId: 'Recover001', name: 'Recovery Person' },
            preferences: ['Preference1', 'Preference2'],
            travelViolations: {},
            travelRequestDate: '2023-01-01',
            travelBookingDate: '',
            travelCompletionDate: '',
            cancellationDate: null,
            travelRequestRejectionReason: '',
            isCancelled: false,
            cancellationReason: '',
            isCashAdvanceTaken: true,
            isAddALeg: false,
            sentToTrip: false,
          
    },
    cashAdvancesData: [
      {
        tenantId: 'sampleTenantId',
        travelRequestId: 'trID-jhfu767687',
        travelRequestNumber: 'TR123',
        cashAdvanceId: 'CA001',
        cashAdvanceNumber: 'CA123',
        createdBy: { empId: 'EMP001', name: 'John Doe' },
        cashAdvanceStatus: 'draft',
        cashAdvanceState: 'section 0',
        amountDetails: [
          { amount: 500, currency: { code: 'USD', symbol: '$' }, mode: 'credit card' },
          { amount: 200, currency: { code: 'EUR', symbol: '€' }, mode: 'cash' },
        ],
        
        approvers: [
          { empId: 'Approver001', name: 'Approver 1', status: 'approved' },
          { empId: 'Approver002', name: 'Approver 2', status: 'approved' },
        ],
        assignedTo: { empId: 'Assignee001', name: 'Assigned Person' },
        paidBy: { empId: 'Payer001', name: 'Payer Person' },
        recoveredBy: { empId: 'Recover001', name: 'Recovery Person' },
        cashAdvanceRequestDate: '2024-12-12',
        cashAdvanceApprovalDate: '2024-12-15',
        cashAdvanceSettlementDate: '2024-12-20',
        cashAdvanceViolations: 'No violations',
        cashAdvanceRejectionReason: '',
      },
      {
        tenantId: 'sampleTenantId',
        travelRequestId: 'trID-abc123',
        travelRequestNumber: 'TR456',
        cashAdvanceId: 'CA002',
        cashAdvanceNumber: 'CA456',
        createdBy: { empId: 'EMP002', name: 'Jane Doe' },
        cashAdvanceStatus: 'pending settlement',
        cashAdvanceState: 'section 1',
        amountDetails: [
          { amount: 700, currency: { code: 'USD', symbol: '$' }, mode: 'cheque' },
        ],
        approvers: [
          { empId: 'Approver003', name: 'Approver 3', status: 'pending approval' },
        ],
        assignedTo: { empId: 'Assignee002', name: 'Assigned Person 2' },
        paidBy: { empId: 'Payer002', name: 'Payer Person 2' },
        recoveredBy: { empId: 'Recover002', name: 'Recovery Person 2' },
        cashAdvanceRequestDate: '2024-12-18',
        cashAdvanceApprovalDate: null,
        cashAdvanceSettlementDate: null,
        cashAdvanceViolations: 'Some violations',
        cashAdvanceRejectionReason: '',
      },
      {
        tenantId: 'sampleTenantId',
        travelRequestId: 'trID-xyz789',
        travelRequestNumber: 'TR789',
        cashAdvanceId: 'CA003',
        cashAdvanceNumber: 'CA789',
        createdBy: { empId: 'EMP003', name: 'Bob Smith' },
        cashAdvanceStatus: 'approved',
        cashAdvanceState: 'section 2',
        amountDetails: [
          { amount: 300, currency: { code: 'GBP', symbol: '£' }, mode: 'bank transfer' },
        ],
        approvers: [
          { empId: 'Approver004', name: 'Approver 4', status: 'approved' },
        ],
        assignedTo: { empId: 'Assignee003', name: 'Assigned Person 3' },
        paidBy: { empId: 'Payer003', name: 'Payer Person 3' },
        recoveredBy: { empId: 'Recover003', name: 'Recovery Person 3' },
        cashAdvanceRequestDate: '2024-12-22',
        cashAdvanceApprovalDate: '2024-12-25',
        cashAdvanceSettlementDate: '2024-12-30',
        cashAdvanceViolations: 'Minor violations',
        cashAdvanceRejectionReason: '',
      },
      
    ],
  };






export const travelTestingData = {

  travelRequestData:{
    "tenantId": "65c5c3bef21cc9ab3038e21f",
    "tenantName": "Studio Innovate",
    "companyName": "Studio Innovate",
    "travelRequestId": "65c5dec8cf52af3ac3026c46",
    "travelRequestNumber": "TRST000000",
    "tripPurpose": "Business",
    "travelRequestStatus": "approved",
    "travelRequestState": "section 0",
    "createdBy": {
        "empId": "1002",
        "name": "Kanhaiya Verma",
        "_id": "65c5df2dcf52af3ac3026c4e"
    },
    "teamMembers": [],
    "travelAllocationHeaders": [
        {
            "headerName": "department",
            "headerValue": "HR"
        },
        {
            "headerName": "legalEntity",
            "headerValue": "Sudio Innovate"
        },
        {
            "headerName": "department",
            "headerValue": "Finance"
        }
    ],
    "itinerary": {
        "formState": [],
        "flights": [
            {
                "violations": {
                    "class": 'Select class is not in for this employee',
                    "amount": null
                },
                "bkd_violations": {
                    "class": null,
                    "amount": null
                },
                "bookingDetails": {
                    "docURL": null,
                    "docType": null,
                    "billDetails": {
                        "vendorName": "Book My Trip",
                        "taxAmount": "500",
                        "totalAmount": "6500"
                    }
                },
                "itineraryId": "65c5df2dcf52af3ac3026c55",
                "formId": "travel_8d8d4e61-e1b1-4573-806b-05ab941e18dc",
                "from": "Delhi",
                "to": "Mumbai",
                "date": "Sun Feb 25 2024 05:30:00 GMT+0530 (India Standard Time)",
                "returnDate": "2024-03-05T00:00:00.000Z",
                "time": "16:00",
                "returnTime": "17:00",
                "travelClass": null,
                "isReturnTravel": "false",
                "approvers": [
                    {
                        "empId": "1004",
                        "name": "Shivam Chauhan",
                        "status": "pending approval",
                        "_id": "65c5df2dcf52af3ac3026c50"
                    }
                ],
                "bkd_from": "Delhi",
                "bkd_to": "Mumbai",
                "bkd_date": "2024-02-26",
                "bkd_time": null,
                "bkd_returnTime": null,
                "bkd_travelClass": null,
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "rejectionReason": null,
                "status": "pending approval",
                "_id": "65c5df2dcf52af3ac3026c4f"
            }
        ],
        "buses": [],
        "trains": [
            {
                "violations": {
                    "class": 'Select class is not in for this employee',
                    "amount": null
                },
                "bkd_violations": {
                    "class": null,
                    "amount": null
                },
                "bookingDetails": {
                    "docURL": null,
                    "docType": null,
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    }
                },
                "itineraryId": null,
                "formId": "travel_0fd6a966-5c55-4f5f-812c-9e4e8e9c6f68",
                "from": "Delhi",
                "to": "Jaipur",
                "date": "Tue Feb 27 2024 05:30:00 GMT+0530 (India Standard Time)",
                "time": "16:00",
                "travelClass": null,
                "approvers": [
                    {
                        "empId": "1004",
                        "name": "Shivam Chauhan",
                        "status": "pending approval",
                        "_id": "65c5df2dcf52af3ac3026c52"
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
                "status": "draft",
                "_id": "65c5df2dcf52af3ac3026c51"
            }
        ],
        "hotels": [
            {
                "violations": {
                  "class": '',
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
                "itineraryId": "65c5df2dcf52af3ac026c56",
                "location": "Jaipur",
                "locationPreference": null,
                "class": null,
                "checkIn": "2024-02-28",
                "checkOut": "2024-02-29",
                "approvers": [
                    {
                        "empId": "1004",
                        "name": "Shivam Chauhan",
                        "status": "pending approval",
                        "_id": "65c5df2dcf52af3ac3026c54"
                    }
                ],
                "bkd_location": null,
                "bkd_class": null,
                "bkd_checkIn": "2024-02-29",
                "bkd_checkOut": "2024-02-29",
                "modified": false,
                "cancellationDate": null,
                "cancellationReason": null,
                "status": "draft",
                "_id": "65c5df2dcf52af3ac3026c53",
                "formId": "65c8710241410504c189662f"
            }
        ],
        "cabs": [
            {
                "violations": {
                  "class": '',
                    "amount": null
                },
                "bookingDetails": {
                    "docURL": null,
                    "docType": null,
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    }
                },
                "itineraryId": "65c7bb73a0ed26b99abb",
                "formId": "travel_68e28c13-e5fa-4f36-bfbd-0b4c6b37aa72",
                "date": "2024-02-29",
                "class": null,
                "time": "14:00",
                "pickupAddress": "A-32, Shanti Nagar, Merrut",
                "dropAddress": "B-55 Om Nagar, Merrut",
                "approvers": [
                    {
                        "empId": "1004",
                        "name": "Shivam Chauhan",
                        "status": "pending approval",
                        "_id": "65c72a46cf52af3ac3026cee"
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
                "status": "draft",
                "type": "regular",
                "_id": "65c7bb73a0ed26b8a99ab4a9"
            },
            {
                "violations": {
                  "class": 'Select class is not in for this employee 2',
                    "amount": null
                },
                "bookingDetails": {
                    "docURL": null,
                    "docType": null,
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    }
                },
                "itineraryId": "65c7bb73a0ed26b99abb",
                "formId": "travel_68e28c13-e5fa-4f36-bfbd-0b4c6b37aa72",
                "date": "2024-02-29",
                "class": null,
                "time": "14:00",
                "pickupAddress": "A-32, Shanti Nagar, Merrut",
                "dropAddress": "B-55 Om Nagar, Merrut",
                "approvers": [
                    {
                        "empId": "1004",
                        "name": "Shivam Chauhan",
                        "status": "pending approval",
                        "_id": "65c72a46cf52af3ac3026cee"
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
                "status": "draft",
                "type": "regular",
                "_id": "65c7bb73a0ed26b8a99ab4a9"
            },
            {
                "violations": {
                  "class": 'Select class is not in for this employee 2',
                    "amount": null
                },
                "bookingDetails": {
                    "docURL": null,
                    "docType": null,
                    "billDetails": {
                        "vendorName": null,
                        "taxAmount": null,
                        "totalAmount": null
                    }
                },
                "itineraryId": "65c7bb73adfsdfa0ed26b99abb",
                "formId": "travel_68e28c13-e5fa-4f36-bfbd-0b4c6b37aa72",
                "date": "2024-02-29",
                "class": null,
                "time": "14:00",
                "pickupAddress": "A-32, Shanti Nagar, Merrut",
                "dropAddress": "B-55 Om Nagar, Merrut",
                "approvers": [
                    {
                        "empId": "1004",
                        "name": "Shivam Chauhan",
                        "status": "pending approval",
                        "_id": "65c72a46cf52af3ac3026cee"
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
                "status": "draft",
                "type": "regular",
                "_id": "65c7bb73a0ed26b8a99ab4a9"
            }
        ],
        "carRentals": [],
        "personalVehicles": []
    },
    "tripType": {
        "oneWayTrip": true,
        "roundTrip": false,
        "multiCityTrip": false
    },
    "travelDocuments": [],
    "bookings": [],
    "approvers": [
        {
            "empId": "1004",
            "name": "Shivam Chauhan",
            "status": "pending approval",
            "_id": "65c72a46cf52af3ac3026cee"
        }
    ],
    "assignedTo": {},
    "bookedBy": {},
    "recoveredBy": {},
    "preferences": [],
    "travelViolations": {
        "tripPurpose": null,
        "class": null,
        "amount": null,
        "tripPurposeViolationMesssage": null
    },
    "travelRequestDate": "2024-02-10T18:49:43.707Z",
    "travelType": "international",
    "isCancelled": false,
    "isCashAdvanceTaken": true,
    "sentToTrip": false
},

cashAdvancesData: [
  {
    tenantId: 'sampleTenantId',
    travelRequestId: 'trID-jhfu767687',
    travelRequestNumber: 'TR123',
    cashAdvanceId: 'CA001',
    cashAdvanceNumber: 'CA123',
    createdBy: { empId: 'EMP001', name: 'John Doe' },
    cashAdvanceStatus: 'draft',
    cashAdvanceState: 'section 0',
    amountDetails: [
      { amount: 500, currency: { code: 'USD', symbol: '$' }, mode: 'credit card' },
      { amount: 200, currency: { code: 'EUR', symbol: '€' }, mode: 'cash' },
    ],
    
    approvers: [
      { empId: 'Approver001', name: 'Approver 1', status: 'approved' },
      { empId: 'Approver002', name: 'Approver 2', status: 'approved' },
    ],
    assignedTo: { empId: 'Assignee001', name: 'Assigned Person' },
    paidBy: { empId: 'Payer001', name: 'Payer Person' },
    recoveredBy: { empId: 'Recover001', name: 'Recovery Person' },
    cashAdvanceRequestDate: '2024-12-12',
    cashAdvanceApprovalDate: '2024-12-15',
    cashAdvanceSettlementDate: '2024-12-20',
    cashAdvanceViolations: '',
    cashAdvanceRejectionReason: '',
  },
  {
    tenantId: 'sampleTenantId',
    travelRequestId: 'trID-abc123',
    travelRequestNumber: 'TR456',
    cashAdvanceId: 'CA002',
    cashAdvanceNumber: 'CA456',
    createdBy: { empId: 'EMP002', name: 'Jane Doe' },
    cashAdvanceStatus: 'pending settlement',
    cashAdvanceState: 'section 1',
    amountDetails: [
      { amount: 700, currency: { code: 'USD', symbol: '$' }, mode: 'cheque' },
    ],
    approvers: [
      { empId: 'Approver003', name: 'Approver 3', status: 'pending approval' },
    ],
    assignedTo: { empId: 'Assignee002', name: 'Assigned Person 2' },
    paidBy: { empId: 'Payer002', name: 'Payer Person 2' },
    recoveredBy: { empId: 'Recover002', name: 'Recovery Person 2' },
    cashAdvanceRequestDate: '2024-12-18',
    cashAdvanceApprovalDate: null,
    cashAdvanceSettlementDate: null,
    cashAdvanceViolations: 'Some violations',
    cashAdvanceRejectionReason: '',
  },
  {
    tenantId: 'sampleTenantId',
    travelRequestId: 'trID-xyz789',
    travelRequestNumber: 'TR789',
    cashAdvanceId: 'CA003',
    cashAdvanceNumber: 'CA789',
    createdBy: { empId: 'EMP003', name: 'Bob Smith' },
    cashAdvanceStatus: 'approved',
    cashAdvanceState: 'section 2',
    amountDetails: [
      { amount: 300, currency: { code: 'GBP', symbol: '£' }, mode: 'bank transfer' },
    ],
    approvers: [
      { empId: 'Approver004', name: 'Approver 4', status: 'approved' },
    ],
    assignedTo: { empId: 'Assignee003', name: 'Assigned Person 3' },
    paidBy: { empId: 'Payer003', name: 'Payer Person 3' },
    recoveredBy: { empId: 'Recover003', name: 'Recovery Person 3' },
    cashAdvanceRequestDate: '2024-12-22',
    cashAdvanceApprovalDate: '2024-12-25',
    cashAdvanceSettlementDate: '2024-12-30',
    cashAdvanceViolations: 'Minor violations',
    cashAdvanceRejectionReason: '',
  },
  
],

}
  
export default dummyTravelWithCashAdvanceData;
  