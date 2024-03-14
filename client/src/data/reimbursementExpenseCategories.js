const reimbursementExpenseCategories = [
  {
    categoryName: 'Flight',
    fields: [
      { name: 'Invoice Date', type: 'date' },
      { name: 'Flight Number', type: 'text' },
      {name: 'Departure', type: 'text'},
      {name: 'Arrival', type: 'text'},
      { name: 'Airlines name', type: 'text' },
      { name: 'Travelers Name', type: 'text' },
      { name: 'Class', type: 'text' },
      { name: 'Booking Reference Number', type: 'text' },
      { name: 'Total Amount', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' }
    ],
    modeOfTranfer: true,
    class: ['Economy', 'Premium Economy', 'Business', 'First Class'],
  },
  {
    categoryName: 'Train',
    fields: [
      { name: 'Invoice Date', type: 'date' },
      { name: 'Origin', type: 'text' },
      { name: 'Destination', type: 'text' },
      { name: 'Travelers Name', type: 'text' },
      { name: 'Class', type: 'text' },
      { name: 'Booking Reference No.', type: 'text' },
      { name: 'Total Amount', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' }
    ],
    modeOfTranfer: true,
    class: ['First AC ', 'Second AC', 'Third AC', 'Sleeper', 'Chair Car'],
    
  },
  {
    categoryName: 'Bus',
    fields: [
      { name: 'Invoice Date', type: 'date' },
      { name: 'Origin', type: 'text' },
      { name: 'Destination', type: 'text' },
      { name: 'Travelers Name', type: 'text' },
      { name: 'Class', type: 'text' },
      { name: 'Booking Reference No.', type: 'text' },
      { name: 'Total Amount', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' }
    ],
    modeOfTranfer: true,
    class: ['Sleeper', 'Semi-Sleeper', 'Regular'],
    
  },
  {
    categoryName: 'Cab',
    fields: [
      { name: 'Date', type: 'date' },
      { name: 'Time', type: 'time' },
      { name: 'Pickup Location', type: 'text' },
      { name: 'DropOff Location', type: 'text' },
      { name: 'Total Amount', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' },
      { name: 'Payment Method', type: 'text' },
      { name: 'Receipt No.', type: 'text' },
      { name: 'Ride Distance', type: 'text' }
    ],
    modeOfTranfer:true,
    class: ['Economy', 'Business', 'Executive'],
   
  },
  {
    categoryName: 'Cab Rental',
    fields: [
      { name: 'Date', type: 'date' },
      { name: 'Time', type: 'time' },
      { name: 'Pickup Location', type: 'text' },
      { name: 'DropOff Location', type: 'text' },
      { name: 'Total Amount', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' },
      { name: 'Payment Method', type: 'text' },
      { name: 'Receipt No.', type: 'text' },
      { name: 'Ride Distance', type: 'text' }
    ],
    modeOfTranfer:true,
    class: ['Economy', 'Business', 'Executive'],
    
  },
  {
    categoryName: 'Hotel',
    fields: [
      { name: 'Hotel Name', type: 'text' },
      { name: 'Check-In Date', type: 'date' },
      { name: 'Check-Out Date', type: 'date' },
      { name: 'City', type: 'text'},
      { name: 'Room Rates', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' },
      {name: 'Total Amount', type: 'amount'},
      { name: 'Guest Name', type: 'text' },
      { name: 'Booking Reference No.', type: 'text' },
      { name: 'Payment Method', type: 'text' }
    ],
    modeOfTranfer:false,
    class: ['Motel', '3 star', '4 star', '5 star'],
    
  },
  {
    categoryName: 'Meals',
    fields: [
      { name: 'Bill Date', type: 'date' },
      { name: 'Bill Number', type: 'text' },
      { name: 'Vendor Name', type: 'text' },
      { name: 'Description', type: 'text' },
      { name: 'Quantity', type: 'number' },
      { name: 'Unit Cost', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' },
      { name: 'Total Amount', type: 'amount' }
    ],
    modeOfTranfer:false,

  },
  {
    categoryName: 'Travel Reimbursement',
    fields: [
      { name: 'From', type: 'text' },
      {name: 'To', type: 'text'},
      {name: 'Distance', type: 'text'},
      { name: 'Bill Date', type: 'date'},
      { name: 'Bill Number', type: 'text' },
      { name: 'Vendor Name', type: 'text' },
      { name: 'Description', type: 'text' },
      { name: 'Quantity', type: 'number' },
      { name: 'Unit Cost', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' },
      { name: 'Total Amount', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Conference / Event',
    fields: [
      { name: 'Conference Name', type: 'text' },
      { name: 'Conference Date', type: 'date' },
      { name: 'Total Amount', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' }
    ],
    modeOfTranfer:false,

  },
  {
    categoryName: 'Travel Insurance',
    fields: [
      { name: 'Policy Type', type: 'text' },
      { name: 'Insurance Provider', type: 'text' },
      { name: 'Total Amount', type: 'amount' }
    ],
    modeOfTranfer: false,

  },
  {
    categoryName: 'Baggage',
    fields: [
      { name: 'Airline name', type: 'text' },
      { name: 'Bill no.', type: 'text' },
      { name: 'Total Amount', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Tips',
    fields: [
      { name: 'Purpose', type: 'text' },
      { name: 'Tip Amount', type: 'amount' }
    ],
    modeOfTranfer:false,
    limit: null,
    currency: null,
  },
  {
    categoryName: 'Miscellaneous',
    fields: [
      { name: 'Bill Date', type: 'date' },
      { name: 'Bill Number', type: 'text' },
      { name: 'Vendor Name', type: 'text' },
      { name: 'Description', type: 'text' },
      { name: 'Quantity', type: 'number' },
      { name: 'Unit Cost', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' },
      { name: 'Total Amount', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Office Supplies',
    fields: [
      { name: 'Bill Date', type: 'date' },
      { name: 'Bill Number', type: 'text' },
      { name: 'Vendor Name', type: 'text' },
      { name: 'Description', type: 'text' },
      { name: 'Quantity', type: 'number' },
      { name: 'Unit Cost', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' },
      { name: 'Total Amount', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Utilities',
    fields: [
      { name: 'Type of Utilities', type: 'text' },
      { name: 'Bill Date', type: 'date' },
      { name: 'Bill Number', type: 'text' },
      { name: 'Vender Name', type: 'text' },
      { name: 'Description', type: 'text' },
      { name: 'Quantity', type: 'number' },
      { name: 'Unit Cost', type: 'amount' },
      { name: 'Tax Amount', type: 'amount' },
      { name: 'Total Amount', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Insurance',
    fields: [
      { name: 'Policy type', type: 'text' },
      { name: 'Insurance Provider', type: 'text' },
      { name: 'Premium Amount', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Marketing and Advertising',
    fields: [
      { name: 'Marketing Campaign Description', type: 'text' },
      { name: 'Advertising Channels', type: 'text' },
      { name: 'Cost', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Professional Fees',
    fields: [
      { name: 'Service Provider', type: 'text' },
      { name: 'Nature of Service', type: 'text' },
      { name: 'Cost', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Software and Licenses',
    fields: [
      { name: 'Software Name', type: 'text' },
      { name: 'License Type', type: 'text' },
      { name: 'License Cost', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Equipment',
    fields: [
      { name: 'Item Description', type: 'text' },
      { name: 'Quantity', type: 'number' },
      { name: 'Unit Cost', type: 'amount' },
      { name: 'Total Cost', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Repairs and Maintenance',
    fields: [
      { name: 'Description of repair/maintenance work', type: 'text' },
      { name: 'Service provider', type: 'text' },
      { name: 'Cost', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Legal and Compliance',
    fields: [
      { name: 'Firm name', type: 'text' },
      { name: 'Description', type: 'text' },
      { name: 'Service name', type: 'text' },
      { name: 'Tax Amount', type: 'amount' },
      { name: 'Total Amount', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Communication',
    fields: [
      { name: 'Bill no. service provider', type: 'text' },
      { name: 'Bill date', type: 'date' },
      { name: 'Tax Amount', type: 'amount' },
      { name: 'Total Amount', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Research and Development',
    fields: [
      { name: 'Research Project Description', type: 'text' },
      { name: 'Cost', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Training',
    fields: [
      { name: 'Training Program Description', type: 'text' },
      { name: 'Trainer', type: 'text' },
      { name: 'Cost', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Software Subscriptions',
    fields: [
      { name: 'Software Name', type: 'text' },
      { name: 'Subscription Type', type: 'text' },
      { name: 'Subscription Cost', type: 'amount' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Client entertainment',
    fields: [
      { name: 'Total Amount', type: 'text' }
    ],
    modeOfTranfer:false,
  },
  {
    categoryName: 'Client gift',
    fields: [
      { name: 'Total Amount', type: 'text' }
    ],
    modeOfTranfer:false,
  }
];
  
export {reimbursementExpenseCategories}