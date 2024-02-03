export const allTravelRequest = [
    {       
      travelRequestNumber:"TRAM00000001",
      travelRequestId:"tr000878hjjyuy1",
      rejectionReason:"too many violations",
      tripPurpose: 'Training Workshop in Las Vegas for Internal works',
      from: 'Denver',
      to: 'Las Vegas',
      departureDate: '09-dec-2023',
      returnDate: '09-Feb-2024',
      travelRequestStatus: 'pending settlement',
      isCashAdvanceTaken :true,
      cashAdvances: [
        {
          cashAdvanceId: '#CA0004',           
          cashAdvanceNumber: 'CAN1',
          amountDetails: [
            {
              amount: '180.75',
              currencyType: 'USD',
            },
            {
              amount: '20000.75',
              currencyType: 'INR',
            },
            // {
            //   amount: '20000.00',
            //   currencyType: 'INR',
            // },
          ],
          date: '05-Dec-2024',
          violation: 'amt is within the limit',
          status: 'rejected',
        },
        {
          cashAdvanceId: '#CA0005',
          
       cashAdvanceNumber: 'CAN1',


          amountDetails: [
          
            {
              amount: '180.25',
              currencyType: 'GBP',
            },
            {
              amount: '1500.00',
              currencyType: 'JPY',
            },
          ],
          date: '10-Feb-2024',
          violation: '',
          status: 'pending',
        },
      ],
    },
    {
       travelRequestNumber:"TRAM00000001",
      travelRequestId:"tr000878hjjyuy2",
      rejectionReason:"too many violations",
      tripPurpose: 'Conference in Paris',
      from: 'New York',
      to: 'Paris',
      departureDate: '06-dec-2023',
      returnDate: '20-Mar-2024',
      travelRequestStatus: 'approved',
      isCashAdvanceTaken :false,
       cashAdvances: [
        {
          cashAdvanceId: '#CA0006',
          
          cashAdvanceNumber: 'CAN1',


          amountDetails: [
            {
              amount: '300.00',
              currencyType: 'USD',
            },
            {
              amount: '350.75',
              currencyType: 'EUR',
            },
            {
              amount: '3000.00',
              currencyType: 'EUR',
            },
          ],
          date: '10-Mar-2024',
          violation: 'amt is within the limit',
          status: 'approved',
        },
      ],
    },
    {
       travelRequestNumber:"TRAM00000001",
      travelRequestId:"tr000878hjjyuy3",
       rejectionReason:"too many violations",
      tripPurpose: 'Vacation in Tokyo',
      from: 'Los Angeles',
      to: 'Tokyo',
      departureDate: '10-dec-2022',
      returnDate: '10-Apr-2024',
      travelRequestStatus: 'cancelled',
      isCashAdvanceTaken :true,
       cashAdvances: [
        {
          cashAdvanceId: '#CA0007',
          
cashAdvanceNumber: 'CAN1',


          amountDetails: [
            {
              amount: '400.00',
              currencyType: 'USD',
            },
            {
              amount: '450.50',
              currencyType: 'JPY',
            },
            {
              amount: '4000.00',
              currencyType: 'JPY',
            },
          ],
          date: '05-Apr-2024',
          violation: 'amt is within the limit',
          status: 'approved',
        },
      ],
    },
    {
      itineraryId: 'I1',
      rejectionReason: 'Flight canceled',
      status: 'rejected',
      travelRequestId: 'ID3',
      travelRequestNumber: 'TRAM00000001',
      tripPurpose: 'Training',
      travelRequestStatus: 'approved'
  },
    {
       travelRequestNumber:"TRAM00000001",
      travelRequestId:"tr000878hjjyuy3",
       rejectionReason:"too many violations",
      tripPurpose: 'Vacation in Tokyo',
      from: 'Los Angeles',
      to: 'Tokyo',
      departureDate: '12-Dec-2024',
      returnDate: '10-Apr-2024',
      travelRequestStatus: 'rejected',
      isCashAdvanceTaken :true,
       cashAdvances: [
        {
          cashAdvanceId: '#CA0007',
          
cashAdvanceNumber: 'CAN1',


          amountDetails: [
            {
              amount: '400.00',
              currencyType: 'USD',
            },
            {
              amount: '450.50',
              currencyType: 'JPY',
            },
            {
              amount: '4000.00',
              currencyType: 'JPY',
            },
          ],
          date: '05-Apr-2024',
          violation: 'amt is within the limit',
          status: 'approved',
        },
      ],
    },
    {
       travelRequestNumber:"TRAM00000001",
      travelRequestId:"tr000878hjjyuy4",
       rejectionReason:"too many violations",
      tripPurpose: 'Business Trip to London',
      from: 'San Francisco',
      to: 'London',
      departureDate: '15-May-2024',
      returnDate: '20-May-2024',
      travelRequestStatus: 'approved',
      isCashAdvanceTaken :false
//          cashAdvances: [
//           {
//             cashAdvanceId: '#CA0008',
// cashAdvanceNumber: 'CAN1',
        


//             amountDetails: [
//               {
//                 amount: '250.00',
//                 currencyType: 'USD',
//               },
//               {
//                 amount: '280.75',
//                 currencyType: 'GBP',
//               },
//               {
//                 amount: '2500.00',
//                 currencyType: 'GBP',
//               },
//             ],
//             date: '10-May-2024',
//             violation: 'amt is within the limit',
//             status: 'approved',
//           },
//         ],
    },
    {
       travelRequestNumber:"TRAM00000001",
      travelRequestId:"tr000878hjjyuy5",
      rejectionReason:"too many violations",
      tripPurpose: 'Exploring Sydney',
      from: 'Chicago',
      to: 'Sydney',
      departureDate: '08-dec-2023',
      returnDate: '10-Jun-2024',
      travelRequestStatus: 'pending approval',
      isCashAdvanceTaken :true,
       cashAdvances: [
        {
          cashAdvanceId: '#CA0009',
          
cashAdvanceNumber: 'CAN1',


          amountDetails: [
            {
              amount: '350.00',
              currencyType: 'USD',
            },
            {
              amount: '400.80',
              currencyType: 'AUD',
            },
            {
              amount: '3500.00',
              currencyType: 'AUD',
            },
          ],
          date: '01-Jun-2024',
          violation: 'amt is within the limit',
          status: 'pending approval',
        },
        {
          cashAdvanceId: '#CA0010',
          
cashAdvanceNumber: 'CAN1',


          amountDetails: [
            {
              amount: '350.00',
              currencyType: 'USD',
            },
            
          ],
          date: '01-Jun-2024',
          violation: 'amt is within the limit',
          status: 'approved',
        },
      ],
    },
  ];



export const rejectedTravelRequests=[
  {
      travelRequestNumber:"TRAM00000001",
      travelRequestId:"tr000878hjjyuy1",
      rejectionReason:"too many violations",
      tripPurpose: 'Training Workshop in Las Vegas for Internal works',
  },
  
    {
        "travelRequestNumber": "TRAM00000002",
        "travelRequestId": "tr000879hjjyuy2",
        "rejectionReason": "insufficient details",
        "tripPurpose": "Client Meeting in New York"
    },
    {
        "travelRequestNumber": "TRAM00000003",
        "travelRequestId": "tr000880hjjyuy3",
        "rejectionReason": "conflict with schedule",
        "tripPurpose": "Product Launch in San Francisco"
    },
    {
        "travelRequestNumber": "TRAM00000004",
        "travelRequestId": "tr000881hjjyuy4",
        "rejectionReason": "budget constraints",
        "tripPurpose": "Business Conference in Chicago"
    },
    {
        "travelRequestNumber": "TRAM00000005",
        "travelRequestId": "tr000882hjjyuy5",
        "rejectionReason": "lack of documentation",
        "tripPurpose": "Team Building in Miami"
    },
    {
        "travelRequestNumber": "TRAM00000006",
        "travelRequestId": "tr000883hjjyuy6",
        "rejectionReason": "security concerns",
        "tripPurpose": "Sales Training in Dallas"
    },
    {
        "travelRequestNumber": "TRAM00000007",
        "travelRequestId": "tr000884hjjyuy7",
        "rejectionReason": "unapproved destination",
        "tripPurpose": "Product Demo in Seattle"
    },
    {
        "travelRequestNumber": "TRAM00000008",
        "travelRequestId": "tr000885hjjyuy8",
        "rejectionReason": "incomplete itinerary",
        "tripPurpose": "Strategic Planning in Denver"
    },
    {
        "travelRequestNumber": "TRAM00000009",
        "travelRequestId": "tr000886hjjyuy9",
        "rejectionReason": "medical concerns",
        "tripPurpose": "Health and Safety Training in Houston"
    },
    {
        "travelRequestNumber": "TRAM00000010",
        "travelRequestId": "tr000887hjjyuy10",
        "rejectionReason": "weather-related issues",
        "tripPurpose": "Product Launch in Orlando"
    },
    {
        "travelRequestNumber": "TRAM00000011",
        "travelRequestId": "tr000888hjjyuy11",
        "rejectionReason": "non-compliance with policies",
        "tripPurpose": "Marketing Campaign in Los Angeles"
    }


]  