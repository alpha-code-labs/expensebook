const tripArray = [
    {
      "tripNumber":"TRIPAM0000001",
      tripId:"trip-3234hjuy",
      travelRequestId:"tr-sdkfji676",
      travelName: 'Business Meeting with Nirvana Association',
      from: 'New York',
      to: 'Los Angeles',
      departureDate: '20-Sep-2023',
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

  export {tripArray}