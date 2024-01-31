export const travelApprovalData = [
    {
      travelRequestId:"tr-sdffiuo",
      travelRequestNumber:"TRAM00000001",
      isCashAdvanceTaken:true,
      tripPurpose: 'Training Workshop in Las Vegas Las Vegas',
      travelRequestStatus: 'pending booking',
      cashAdvances: [
        {
          cashAdvanceNumber: '#CA0005',
          cashAdvanceId: '#CA0004',
          amountdetails: [
            {
              amount: '180.75',
              currencyType: 'USD',
            },
            {
              amount: '2000.75',
              currencyType: 'INR',
            },
          ],
          date: '05-Feb-2024',
          violation: 'amt is within the limit',
          cashAdvanceStatus: 'pending approval',
        },
        {
          cashAdvanceNumber: '#CA0004',
          cashAdvanceId: '#CA0004',

          amountdetails: [
          
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
          cashAdvanceStatus: 'pending approval',
        },
      ],
      itinerary: {
        formState: [
          {
            formId: "exampleFormId",
            transfers: {
              needsDeparturePickup: true,
              needsDepartureDrop: true,
              needsReturnPickup: true,
              needsReturnDrop: true,
            },
            needsHotel: true,
            needsCab: true,
            needsVisa: false,
            cancellationDate: "2023-11-28",
            cancellationReason: "Changed plans",
            formStatus: "draft",
          },
        ],
        flights: [
          {
            itineraryId: "exampleFlightItineraryId",
            formId: "exampleFormId",
            from: "City A",
            to: "City B",
            date: "2023-12-02",
            time: "08:00 AM",
            travelClass: "Business",
            isReturnTravel: "false",
            violations: {
              class: "Example Violation Class",
              amount: "Example Violation Amount",
            },
            bkd_from: "City A",
            bkd_to: "City B",
            bkd_date: "2023-12-02",
            bkd_time: "10:00 AM",
            bkd_travelClass: "Business",
            bkd_isReturnTravel: "false",
            modified: false,
            cancellationDate: new Date("2023-11-28"),
            cancellationReason: "Changed plans",
            status: "paid and cancelled",
            bookingDetails: {
              docURL: "exampleDocURL",
              docType: "exampleDocType",
              billDetails: {
                amount:"5000"
              },
            },
          },
          {
            itineraryId: "exampleFlightItineraryId2",
            formId: "exampleFormId",
            from: "City A",
            to: "City B",
            date: "2023-12-02",
            time: "08:00 AM",
            travelClass: "Business",
            isReturnTravel: "false",
            violations: {
              class: "Example Violation Class",
              amount: "Example Violation Amount",
            },
            bkd_from: "City A",
            bkd_to: "City B",
            bkd_date: "2023-12-02",
            bkd_time: "10:00 AM",
            bkd_travelClass: "Business",
            bkd_isReturnTravel: "false",
            modified: false,
            cancellationDate: new Date("2023-11-28"),
            cancellationReason: "Changed plans",
            status: "paid and cancelled",
            bookingDetails: {
              docURL: "exampleDocURL",
              docType: "exampleDocType",
              billDetails: {
                amount:"5000"
              },
            },
          },
        ],
        buses: [
            {
              itineraryId: "exampleBusItineraryId1",
              formId: "exampleFormId",
              from: "City C",
              to: "City D",
              date: "2023-12-03",
              time: "10:00 AM",
              travelClass: "Economy",
              isReturnTravel: "false",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_from: "City C",
              bkd_to: "City D",
              bkd_date: "2023-12-03",
              bkd_time: "01:00 PM",
              bkd_travelClass: "Economy",
              bkd_isReturnTravel: "false",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleBusDocURL",
                docType: "exampleBusDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
            {
              itineraryId: "exampleBusItineraryId2",
              formId: "exampleFormId",
              from: "City C",
              to: "City D",
              date: "2023-12-03",
              time: "10:00 AM",
              travelClass: "Economy",
              isReturnTravel: "false",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_from: "City C",
              bkd_to: "City D",
              bkd_date: "2023-12-03",
              bkd_time: "01:00 PM",
              bkd_travelClass: "Economy",
              bkd_isReturnTravel: "false",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleBusDocURL",
                docType: "exampleBusDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
          ],
          trains: [
            {
              itineraryId: "TrainItineraryId1",
              formId: "exampleFormId",
              from: "City E",
              to: "City F",
              date: "2023-12-04",
              time: "02:00 PM",
              travelClass: "First Class",
              isReturnTravel: "false",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_from: "City E",
              bkd_to: "City F",
              bkd_date: "2023-12-04",
              bkd_time: "05:00 PM",
              bkd_travelClass: "First Class",
              bkd_isReturnTravel: "false",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleTrainDocURL",
                docType: "exampleTrainDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
            {
              itineraryId: "TrainItineraryId2",
              formId: "exampleFormId",
              from: "City E",
              to: "City F",
              date: "2023-12-04",
              time: "02:00 PM",
              travelClass: "First Class",
              isReturnTravel: "false",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_from: "City E",
              bkd_to: "City F",
              bkd_date: "2023-12-04",
              bkd_time: "05:00 PM",
              bkd_travelClass: "First Class",
              bkd_isReturnTravel: "false",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleTrainDocURL",
                docType: "exampleTrainDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
          ],
          hotels: [
            {
              itineraryId: "HotelItineraryId",
              formId: "exampleFormId",
              location: "Hotel G",
              locationPreference: "City View",
              class: "Luxury",
              checkIn: "2023-12-05",
              checkOut: "2023-12-07",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_location: "Hotel G",
              bkd_class: "Luxury",
              bkd_checkIn: "2023-12-05",
              bkd_checkOut: "2023-12-07",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleHotelDocURL",
                docType: "exampleHotelDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
            {
              itineraryId: "HotelItineraryId2",
              formId: "exampleFormId",
              location: "Hotel G",
              locationPreference: "City View",
              class: "Luxury",
              checkIn: "2023-12-05",
              checkOut: "2023-12-07",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_location: "Hotel G",
              bkd_class: "Luxury",
              bkd_checkIn: "2023-12-05",
              bkd_checkOut: "2023-12-07",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleHotelDocURL",
                docType: "exampleHotelDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
          ],
          cabs: [
            {
              itineraryId: "exampleCabItineraryId",
              formId: "exampleFormId",
              date: "2023-12-08",
              class: "Sedan",
              preferredTime: "08:00 AM",
              pickupAddress: "City H",
              dropAddress: "City I",
              isReturnTravel: "false",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_date: "2023-12-08",
              bkd_class: "Sedan",
              bkd_preferredTime: "08:00 AM",
              bkd_pickupAddress: "City H",
              bkd_dropAddress: "City I",
              bkd_isReturnTravel: "false",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleCabDocURL",
                docType: "exampleCabDocType",
                billDetails: {
                  amount:"5000"
                },
              },
              type: "regular",
            },
          ],
        // Include similar data for buses, trains, hotels, and cabs
      },
    },
    {
      travelRequestId:"tr-sdffiuo",
      travelRequestNumber:"TRAM00000001",
      isCashAdvanceTaken:false ,
      tripPurpose: 'Training Workshop in Las Vegas Las Vegas',
      travelRequestStatus: 'pending approval',
      
    },
    {
      travelRequestId:"tr-sdffiuo",
      travelRequestNumber:"TRAM00000001",
      isCashAdvanceTaken:false ,
      tripPurpose: 'Training Workshop in Las Vegas Las Vegas',
      travelRequestStatus: 'pending approval',
    },
    {
      travelRequestId:"tr-sdffiuo",
      travelRequestNumber:"TRAM00000001",
      isCashAdvanceTaken:false ,
      tripPurpose: 'Training Workshop in Las Vegas Las Vegas',
      travelRequestStatus: 'pending settlement',
      cashAdvances: [
        {
          cashAdvanceNumber: '#CA0004',
          cashAdvanceId: '#CA0004',

          amountdetails: [
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
          date: '05-Feb-2024',
          violation: 'amt is within the limit',
          cashAdvanceStatus: 'pending approval',
        },
        {
          cashAdvanceNumber: '#CA0004',
          cashAdvanceId: '#CA0004',

          amountdetails: [
          
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
          cashAdvanceStatus: 'pending approval',
        },
      ],
    },
   
  ];



export const expenseApprovalData = [
    {
      tripNumber: '#TRIP00031',
      tripId: "fdlkjioqwu",
      tripPurpose: "Site Visit in Barcelona",
      tripStatus:'transit',
      travelExpense: [
        { expenseHeaderId: "#TREX00037", expenseHeaderNumber: "#EXH00001", date: "15-Jul-2024", },
      
      ]
    },
    {
      tripNumber: '#TRIP00032',
      tripId: "fndjiosauy",
      tripStatus:'completed',
      tripPurpose: "Seminar in Berlin",
      travelExpense: [
        { expenseHeaderId: "#TREX00039", expenseHeaderNumber: "#EXH00003", date: "20-Aug-2024",   },

      ]
    },
    {
      tripNumber: '#TRIP00033',
      tripId: "fdskljeiw",
      tripStatus:'transit',
      tripPurpose: "Sales Pitch in Madrid",
      travelExpense: [
        { expenseHeaderId: "#TREX00041", expenseHeaderNumber: "#EXH00005", date: "10-Sep-2024",   },
      ]
    },
    {
      tripNumber: '#TRIP00034',
      tripId: "fdskjiewr",
      tripStatus:'transit',
      tripPurpose: "Training Workshop in Amsterdam",
      travelExpense: [
        { expenseHeaderId: "#TREX00043", expenseHeaderNumber: "#EXH00007", date: "5-Oct-2024",   },
      ]
    },
    {
      tripNumber: '#TRIP00035',
      tripId: "fdskjiewp",
      tripStatus:'completed',
      tripPurpose: "Product Demo in Shanghai",
      travelExpense: [
        { expenseHeaderId: "#TREX00045", expenseHeaderNumber: "#EXH00009", expenseHeaderStatus: "Pending" },
      ]
    },
    {
      tripNumber: '#TRIP00036',
      tripId: "fdskjiweru",
      tripStatus:'completed',
      tripPurpose: "Business Summit in Dubai",
      travelExpense: [
        { expenseHeaderId: "#TREX00047", expenseHeaderNumber: "#EXH00011", date: "1-Dec-2024",   },
      ]
    },
    {
      tripNumber: '#TRIP00037',
      tripId: "fdskjiweyr",
      tripStatus:'completed',
      tripPurpose: "Trade Show in Singapore",
      travelExpense: [
        { expenseHeaderId: "#TREX00049", expenseHeaderNumber: "#EXH00013", date: "20-Jan-2025",  }
      ]
    },
    {
      tripNumber: '#TRIP00038',
      tripId: "fdskjiweyt",
      tripStatus:'completed',
      tripPurpose: "Executive Retreat in Maldives",
      travelExpense: [
        { expenseHeaderId: "#TREX00051", expenseHeaderNumber: "#EXH00015", date: "15-Feb-2025"},
      ]
    },
    {
      tripNumber: '#TRIP00039',
      tripId: "fdskjiweyj",
      tripStatus:'completed',
      tripPurpose: "Product Training in Hong Kong",
      travelExpense: [
        { expenseHeaderId: "#TREX00053", expenseHeaderNumber: "#EXH00017", date: "10-Mar-2025"},

      ]
    },
    {
      tripNumber: '#TRIP00040',
      tripId: "fdskjiweyk",
      tripStatus:'completed',
      tripPurpose: "Tech Expo in San Francisco",
      travelExpense: [
        { expenseHeaderId: "#TREX00055", expenseHeaderNumber: "#EXH00019", date: "1-Apr-2025" },

      ]
    }
  ];
