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