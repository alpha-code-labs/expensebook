//from drive structure
export const travelApprovaldata = {
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
                  itineraryId: "flightID76876ghgh",
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
                  itineraryId: "buses-jshff7678",
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
                  itineraryId: "trains768gjhg",
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
                  itineraryId: "hotels-7687hgghjg",
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
                  itineraryId: "cabs-76ghgjhyutuy",
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
        rejectionReason: 'amount value is too high',
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
        cashAdvanceViolations: '',
        rejectionReason: 'amount value is too high',
      },
      {
        tenantId: 'sampleTenantId',
        travelRequestId: 'trID-xyz789',
        travelRequestNumber: 'TR789',
        cashAdvanceId: 'CA003',
        cashAdvanceNumber: 'CA789',
        createdBy: { empId: 'EMP003', name: 'Bob Smith' },
        cashAdvanceStatus: 'pending approval',
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
        rejectionReason: 'amount value is too high',
      },
      
    ],
  };


  export const expenseDataForApproval = {
    tenantId: 'sampleTenantId',
    tenantName: 'Sample Tenant',
    companyName: 'Sample Company',
    tripPurpose:"for conference purpose",
    tripId: '5ffdf7df35da0e0017b816d9', 
    tripNumber: 'TRIP00066355', 
    expenseHeaderID: '5ffdf7df35da0e0017b816da', 
    expenseHeaderNumber: 'EXP00000123',
    expenseHeaderType: 'travel',
    expensePurpose: 'Conference expenses', 
    createdBy: { empId: 'EMP001', name: 'Ambrane Ardie' },
    createdFor: { empId: 'EMP002', name: 'Jane Doe' },
    teamMembers: [
      { empId: 'EMP003', name: 'Bob Smith' },
    ],
 
    travelExpenseAllocation:[
      
      
          {
            headers:"Cost Center",
            values:["sales","finance"]
          }
        
    ]
    
  ,
    expenseHeaderStatus: 'pending approval',
    expenseAmountStatus: {
      totalCashAmount: 1000.00,
      totalExpenseAmount: 2500,
      totalPersonalExpense: 500,
      remainingCash: -500,
    },
   
    expenseLines: [
      {
        categoryName: 'cab', 
         'Total Amount': '4000'
          
       
          
        
      },

      {
          categoryName: 'food',
          'Total Fair': '5000'
          
       
      },
      {
         categoryName: 'food',
        'Total Fair': '5000'
       
      },
      {
        categoryName: 'travel',
        'Total Fair': '5000'
        
      },
      {
        categoryName: 'cab',
        'Total Fair': '5000'
       
      },
      {
        categoryName: 'flight',
        'Total Fair': '5000'
       
      },
    
    ],
    approvers: [
      { empId: 'Approver001', name: 'Approver 1', status: 'pending approval' },
      // Add more approvers as needed
    ],
    alreadyBookedExpenseLines:{
       flights:[
          {amount:"5000"},
          {amount:"3000"},
          {amount:"6000"},
          {amount:"4000"},
        ],
        cabs:[
          {amount:"2000"},
          {amount:"3000"},
          {amount:"6000"},
          {amount:"4000"},
          {amount:"4000"},

        ],

        hotels:[
          {amount:"2000"},
          {amount:"3000"},
          {amount:"2000"},
          {amount:"4000"},

        ]

      
      },
    expenseViolations: ['Receipt missing', 'Exceeds policy limits'],
    expenseRejectionReason: 'Invalid expenses',
    expenseSubmissionDate: new Date(),
  };  