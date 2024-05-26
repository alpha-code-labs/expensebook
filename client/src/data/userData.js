const travelRequestStatus = [
    "draft",
    "pending approval",
    "approved",
    "rejected",
    "pending booking",
    "booked",
    "transit",
    "cancelled",
    "recovered",
    "paid and cancelled",
  ];

  const definedDate = {
    current:[
      "today",
      "this week",
      "this month",
      "this year",
      "this quarter"
    ],
    previous:[
      "yesterday",
      "previous week",
      "previous month",
      "previous quarter",
      "previous year"
    ],
    custom:"custom"
  }


  

  const allocations= [
    { "headerName": "department", "headerValue": ["finance","tech","hr"] },
    { "headerName": "legalEntity", "headerValue": ["legal value 1","legal value 2"] }
  ]
  
  const approval= [
    "sumesh",
    "Adele",
    "morris garage",
  ]

  const travelType = [
    'international', 'domestic', 'local'
  ]

  const allocation = [
    'cost center', 'profit center' , 'department'
  ]

const employees = [
    { employeeId: 1, employeeName: 'John Doe', designation: 'Manager', department: 'Sales' },
    { employeeId: 2, employeeName: 'Jane Smith', designation: 'Developer', department: 'Engineering' },

];

export { travelRequestStatus , approval ,  employees , travelType , allocation}  
