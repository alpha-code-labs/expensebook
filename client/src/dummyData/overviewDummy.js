export const transitTrip1= [   
    {
        "travelRequestId": "6587f7d3f1bc28bda7fd77d4",
        "tripId": "6587f7d3f1bc28bda7fd77d4",
        "travelRequestNumber": "TRN1",
        "tripPurpose": "Business Trip",
        "totalCashAmount": 1000,
        "totalremainingCash": 200,
        itinerary: {
          formState: [
            {
              formId: "F001",
              transfers: {
                needsDeparturePickup: true,
                needsDepartureDrop: true,
                needsReturnPickup: false,
                needsReturnDrop: false,
              },
              needsHotel: true,
              needsCab: false,
              needsVisa: true,
              cancellationDate: "2024-01-05",
              cancellationReason: "Change of plans",
              formStatus: "draft",
            },
          ],
          flights: [
            {
              itineraryId: "itineraryIdsdfhg",
              formId: "F001",
              from: "City A",
              to: "City B",
              date: "2024-01-02",
              time: "10:00 AM",
              travelClass: "Economy",
              isReturnTravel: "yes",
              violations: {
                class: "Economy",
                amount: "50",
              },
              bkd_from: "City A",
              bkd_to: "City B",
              bkd_date: "2024-01-02",
              bkd_time: "10:00 AM",
              bkd_travelClass: "Economy",
              bkd_isReturnTravel: "yes",
              modified: false,
              cancellationDate: null,
              cancellationReason: null,
              status: "approved",
              bookingDetails: {
                docURL: "https://example.com/document.pdf",
                docType: "PDF",
                billDetails: {},
              },
            },
          ],
          trains: [
            {
              itineraryId: "ITRID000037H",
              formId: 'form1',
              from: 'City E',
              to: 'City F',
              date: '2023-01-03',
              time: '08:00 AM',
              travelClass: 'First Class',
              isReturnTravel: false,
              violations: {
                class: 'Minor Violation',
                amount: '50 USD',
              },
              bkd_from: 'City E',
              bkd_to: 'City F',
              bkd_date: '2023-01-03',
              bkd_time: '08:00 AM',
              bkd_travelClass: 'First Class',
              bkd_violations: {
                class: 'Minor Violation',
                amount: '50 USD',
              },
              modified: false,
              cancellationDate: null,
              cancellationReason: '',
              status: 'draft',
              bookingDetails: {
                docURL: 'https://booking-example.com/train',
                docType: 'PDF',
                billDetails: {},
              },
            },
          ],
          hotels: [
            {
              itineraryId: "ITRID0000383",
              formId: 'form1',
              location: 'Hotel X',
              locationPreference: 'City G',
              class: 'Luxury',
              checkIn: '2023-01-04',
              checkOut: '2023-01-06',
              checkInTime: '02:00 PM',
              checkOutTime: '12:00 PM',
              violations: {
                class: 'Major Violation',
                amount: '300 USD',
              },
              bkd_location: 'Hotel X',
              bkd_locationPreference: 'City G',
              bkd_class: 'Luxury',
              bkd_checkIn: '2023-01-04',
              bkd_checkOut: '2023-01-06',
              bkd_checkInTime: '02:00 PM',
              bkd_checkOutTime: '12:00 PM',
              bkd_violations: {
                class: 'Major Violation',
                amount: '300 USD',
              },
              modified: false,
              cancellationDate: null,
              cancellationReason: '',
              status: 'draft',
              bookingDetails: {
                docURL: 'https://booking-example.com/hotel',
                docType: 'PDF',
                billDetails: {},
              },
            },
          ],
          cabs: [
            {
              itineraryId: "ITRID000737",
              formId: 'form1',
              date: '2023-01-07',
              class: 'Sedan',
              preferredTime: '04:00 PM',
              pickupAddress: 'City H',
              dropAddress: 'City I',
              violations: {
                class: 'Minor Violation',
                amount: '50 USD',
              },
              bkd_date: '2023-01-07',
              bkd_class: 'Sedan',
              bkd_preferredTime: '04:00 PM',
              bkd_pickupAddress: 'City H',
              bkd_dropAddress: 'City I',
              bkd_violations: {
                class: 'Minor Violation',
                amount: '50 USD',
              },
              modified: false,
              cancellationDate: null,
              cancellationReason: '',
              status: 'draft',
              bookingDetails: {
                docURL: 'https://booking-example.com/cab',
                docType: 'PDF',
                billDetails: {},
              },
              type: 'regular',
            },
          ],
          
        },
        "cashAdvances": [
            {
                "cashAdvanceId": "CA1",
                "cashAdvanceNumber": "CAN1",
                "cashAdvanceStatus": "pending settlement",
                "amountDetails": {
                    "currency": "USD",
                    "amount": 500
                }
            },
            {
                "cashAdvanceId": "CA1",
                "cashAdvanceNumber": "CAN1",
                "cashAdvanceStatus": "pending settlement",
                "amountDetails": {
                    "currency": "USD",
                    "amount": 500
                }
            },
            // Additional cash advances associated with this trip
        ],
        "travelExpenses": [
            {
                "tripId": "T1",
                "expenseHeaderId": "EH1",
                "expenseHeaderNumber": "EHN1",
                "expenseHeaderStatus": "pending approval"
            },
            // Additional travel expenses for this trip
        ]
    },
    // Additional trips in transit
]
export const upcomingTrip1= [   
    {
        "travelRequestId": "6587f7d3f1bc28bda7fd77d4",
        "tripId": "6587f7d3f1bc28bda7fd77d4",
        "travelRequestNumber": "TRN1",
        "tripPurpose": "Business Trip",
        "totalCashAmount": 1000,
        "totalremainingCash": 200,
        itinerary: {
          formState: [
            {
              formId: "F001",
              transfers: {
                needsDeparturePickup: true,
                needsDepartureDrop: true,
                needsReturnPickup: false,
                needsReturnDrop: false,
              },
              needsHotel: true,
              needsCab: false,
              needsVisa: true,
              cancellationDate: "2024-01-05",
              cancellationReason: "Change of plans",
              formStatus: "draft",
            },
          ],
          flights: [
            {
              itineraryId: "itineraryIdsdfhg",
              formId: "F001",
              from: "City A",
              to: "City B",
              date: "2024-01-02",
              time: "10:00 AM",
              travelClass: "Economy",
              isReturnTravel: "yes",
              violations: {
                class: "Economy",
                amount: "50",
              },
              bkd_from: "City A",
              bkd_to: "City B",
              bkd_date: "2024-01-02",
              bkd_time: "10:00 AM",
              bkd_travelClass: "Economy",
              bkd_isReturnTravel: "yes",
              modified: false,
              cancellationDate: null,
              cancellationReason: null,
              status: "approved",
              bookingDetails: {
                docURL: "https://example.com/document.pdf",
                docType: "PDF",
                billDetails: {},
              },
            },
          ],
          trains: [
            {
              itineraryId: "ITRID000037H",
              formId: 'form1',
              from: 'City E',
              to: 'City F',
              date: '2023-01-03',
              time: '08:00 AM',
              travelClass: 'First Class',
              isReturnTravel: false,
              violations: {
                class: 'Minor Violation',
                amount: '50 USD',
              },
              bkd_from: 'City E',
              bkd_to: 'City F',
              bkd_date: '2023-01-03',
              bkd_time: '08:00 AM',
              bkd_travelClass: 'First Class',
              bkd_violations: {
                class: 'Minor Violation',
                amount: '50 USD',
              },
              modified: false,
              cancellationDate: null,
              cancellationReason: '',
              status: 'draft',
              bookingDetails: {
                docURL: 'https://booking-example.com/train',
                docType: 'PDF',
                billDetails: {},
              },
            },
          ],
          hotels: [
            {
              itineraryId: "ITRID0000383",
              formId: 'form1',
              location: 'Hotel X',
              locationPreference: 'City G',
              class: 'Luxury',
              checkIn: '2023-01-04',
              checkOut: '2023-01-06',
              checkInTime: '02:00 PM',
              checkOutTime: '12:00 PM',
              violations: {
                class: 'Major Violation',
                amount: '300 USD',
              },
              bkd_location: 'Hotel X',
              bkd_locationPreference: 'City G',
              bkd_class: 'Luxury',
              bkd_checkIn: '2023-01-04',
              bkd_checkOut: '2023-01-06',
              bkd_checkInTime: '02:00 PM',
              bkd_checkOutTime: '12:00 PM',
              bkd_violations: {
                class: 'Major Violation',
                amount: '300 USD',
              },
              modified: false,
              cancellationDate: null,
              cancellationReason: '',
              status: 'draft',
              bookingDetails: {
                docURL: 'https://booking-example.com/hotel',
                docType: 'PDF',
                billDetails: {},
              },
            },
          ],
          cabs: [
            {
              itineraryId: "ITRID000737",
              formId: 'form1',
              date: '2023-01-07',
              class: 'Sedan',
              preferredTime: '04:00 PM',
              pickupAddress: 'City H',
              dropAddress: 'City I',
              violations: {
                class: 'Minor Violation',
                amount: '50 USD',
              },
              bkd_date: '2023-01-07',
              bkd_class: 'Sedan',
              bkd_preferredTime: '04:00 PM',
              bkd_pickupAddress: 'City H',
              bkd_dropAddress: 'City I',
              bkd_violations: {
                class: 'Minor Violation',
                amount: '50 USD',
              },
              modified: false,
              cancellationDate: null,
              cancellationReason: '',
              status: 'draft',
              bookingDetails: {
                docURL: 'https://booking-example.com/cab',
                docType: 'PDF',
                billDetails: {},
              },
              type: 'regular',
            },
          ],
          
        },
        "cashAdvances": [
            {
                "cashAdvanceId": "CA1",
                "cashAdvanceNumber": "CAN1",
                "cashAdvanceStatus":"pending settlement",
                "amountDetails": [{
                    "currency": "USD",
                    "amount": 500
                }]
            },
            {
                "cashAdvanceId": "CA1",
                "cashAdvanceNumber": "CAN2",
                "cashAdvanceStatus":"pending settlement",
                "amountDetails": [{
                    "currency": "USD",
                    "amount": 500
                }]
            },
            // Additional cash advances associated with this trip
        ],
        "travelExpenses": [
            {
                "tripId": "T1",
                "expenseHeaderId": "expense1",
                "expenseHeaderNumber": "EHN1",
                "expenseHeaderStatus": "Pending Approval"
            },
            // Additional travel expenses for this trip
        ]
    },
    {
        "travelRequestId": "6587f7d3f1bc28bda7fd77d4",
        "tripId": "6587f7d3f1bc28bda7fd77d4",
        "travelRequestNumber": "TRN1",
        "tripPurpose": "Business Trip",
        "totalCashAmount": 1000,
        "totalremainingCash": 200,
        itinerary: {
          formState: [
            {
              formId: "F001",
              transfers: {
                needsDeparturePickup: true,
                needsDepartureDrop: true,
                needsReturnPickup: false,
                needsReturnDrop: false,
              },
              needsHotel: true,
              needsCab: false,
              needsVisa: true,
              cancellationDate: "2024-01-05",
              cancellationReason: "Change of plans",
              formStatus: "draft",
            },
          ],
          flights: [
            {
              itineraryId: "itineraryIdsdfhg",
              formId: "F001",
              from: "City A",
              to: "City B",
              date: "2024-01-02",
              time: "10:00 AM",
              travelClass: "Economy",
              isReturnTravel: "yes",
              violations: {
                class: "Economy",
                amount: "50",
              },
              bkd_from: "City A",
              bkd_to: "City B",
              bkd_date: "2024-01-02",
              bkd_time: "10:00 AM",
              bkd_travelClass: "Economy",
              bkd_isReturnTravel: "yes",
              modified: false,
              cancellationDate: null,
              cancellationReason: null,
              status: "approved",
              bookingDetails: {
                docURL: "https://example.com/document.pdf",
                docType: "PDF",
                billDetails: {},
              },
            },
          ],
          trains: [
            {
              itineraryId: "ITRID000037H",
              formId: 'form1',
              from: 'City E',
              to: 'City F',
              date: '2023-01-03',
              time: '08:00 AM',
              travelClass: 'First Class',
              isReturnTravel: false,
              violations: {
                class: 'Minor Violation',
                amount: '50 USD',
              },
              bkd_from: 'City E',
              bkd_to: 'City F',
              bkd_date: '2023-01-03',
              bkd_time: '08:00 AM',
              bkd_travelClass: 'First Class',
              bkd_violations: {
                class: 'Minor Violation',
                amount: '50 USD',
              },
              modified: false,
              cancellationDate: null,
              cancellationReason: '',
              status: 'draft',
              bookingDetails: {
                docURL: 'https://booking-example.com/train',
                docType: 'PDF',
                billDetails: {},
              },
            },
          ],
          hotels: [
            {
              itineraryId: "ITRID0000383",
              formId: 'form1',
              location: 'Hotel X',
              locationPreference: 'City G',
              class: 'Luxury',
              checkIn: '2023-01-04',
              checkOut: '2023-01-06',
              checkInTime: '02:00 PM',
              checkOutTime: '12:00 PM',
              violations: {
                class: 'Major Violation',
                amount: '300 USD',
              },
              bkd_location: 'Hotel X',
              bkd_locationPreference: 'City G',
              bkd_class: 'Luxury',
              bkd_checkIn: '2023-01-04',
              bkd_checkOut: '2023-01-06',
              bkd_checkInTime: '02:00 PM',
              bkd_checkOutTime: '12:00 PM',
              bkd_violations: {
                class: 'Major Violation',
                amount: '300 USD',
              },
              modified: false,
              cancellationDate: null,
              cancellationReason: '',
              status: 'draft',
              bookingDetails: {
                docURL: 'https://booking-example.com/hotel',
                docType: 'PDF',
                billDetails: {},
              },
            },
          ],
          cabs: [
            {
              itineraryId: "ITRID000737",
              formId: 'form1',
              date: '2023-01-07',
              class: 'Sedan',
              preferredTime: '04:00 PM',
              pickupAddress: 'City H',
              dropAddress: 'City I',
              violations: {
                class: 'Minor Violation',
                amount: '50 USD',
              },
              bkd_date: '2023-01-07',
              bkd_class: 'Sedan',
              bkd_preferredTime: '04:00 PM',
              bkd_pickupAddress: 'City H',
              bkd_dropAddress: 'City I',
              bkd_violations: {
                class: 'Minor Violation',
                amount: '50 USD',
              },
              modified: false,
              cancellationDate: null,
              cancellationReason: '',
              status: 'draft',
              bookingDetails: {
                docURL: 'https://booking-example.com/cab',
                docType: 'PDF',
                billDetails: {},
              },
              type: 'regular',
            },
          ],
          
        },
        "cashAdvances":[
          {
              "cashAdvanceId": "CA1",
              "cashAdvanceNumber": "CAN11",
              "cashAdvanceStatus":"pending settlement",
              "amountDetails": [{
                  "currency": "USD",
                  "amount": 500
              }]
          },
          {
              "cashAdvanceId": "CA1",
              "cashAdvanceNumber": "CAN22",
              "cashAdvanceStatus":"pending settlement",
              "amountDetails": [{
                  "currency": "USD",
                  "amount": 500
              }]
          },
          {
              "cashAdvanceId": "CA1",
              "cashAdvanceNumber": "CAN333",
              "cashAdvanceStatus":"pending settlement",
              "amountDetails": [{
                  "currency": "USD",
                  "amount": 500
              }]
          },
      ],
        "travelExpenses": [
            {
                "tripId": "T1 hlello2",
                "expenseHeaderId": "expense2",
                "expenseHeaderNumber": "EHN1",
                "expenseHeaderStatus": "Pending Approval"
            },
        ]
    },
    // Additional trips in transit
]
