const expense = [
  {
    tenantId: 'tenant2',
    expenseHeaderID: '910236',
    travelRequestId: 'tenant2_emp002_tr_002',
    expenseHeaderType: 'non travel', 
    tripPurpose: 'Holiday Retreat',
    createdBy: {
      empId: 'emp002',
      name: 'nami'
    },
    createdFor: [
      {
        empId: 'emp003',
        name: 'zoro'
      }
    ],
    teamMembers: [],
    expenseStatus: 'pending approval',
    expenseSubmissionDate: new Date('2023-10-17'),
    expenseLines: [
      {
        transactionData: {
          businessPurpose: 'Bengaluru Investors Meeting',
          vendorName: 'Hotel XYZ',
          billNumber: '51111621',
          billDate: '2023-01-02',
          grossAmount: 4000,
          taxes: 60,
          totalAmount: 4060,
          description: 'Food.'
        },
        expenseType: 'Accommodation',
        personalExpense: false,
        modeOfPayment: 'Internet Banking',
        billImageUrl: 'https://example.com/hotel_receipt.jpg'
      },
      { 
        transactionData: {
          businessPurpose: 'Bengaluru Investors Meeting',
          vendorName: 'MBA Food wala',
          billNumber: '1190',
          billDate: '2023-01-03',
          grossAmount: 2850,
          taxes: 15,
          totalAmount: 2865,
          description: 'Meals during the trip.'
        },
        expenseType: 'Food',
        personalExpense: true,
        modeOfPayment: 'UPI',
        billImageUrl: ''
      },{
        transactionData: {
          businessPurpose: 'Monthly Office Cleaning',
          vendorName: 'CleanUp Services, Inc.',
          billNumber: '1292279',
          billDate: '2023-10-12',
          grossAmount: 5200,
          taxes: 20,
          totalAmount: 5220,
          description: 'Professional office cleaning services.'
        },
        expenseType: 'Office Cleaning',
        personalExpense: false,
        modeOfPayment: 'Bank Transfer',
        billImageUrl: 'https://example.com/office_cleaning_receipt.jpg'
      },
      {
        transactionData: {
          businessPurpose: 'Marketing Campaign',
          vendorName: 'Ad Agency, Ltd.',
          billNumber: '12381',
          billDate: '2023-10-18',
          grossAmount: 65000,
          taxes: 300,
          totalAmount: 65300,
          description: 'Marketing and advertising campaign.'
        },
        expenseType: 'Marketing and Advertising',
        personalExpense: false,
        modeOfPayment: 'Credit Card',
        billImageUrl: 'https://example.com/marketing_receipt.jpg'
      },
      {
        transactionData: {
          businessPurpose: 'Monthly Subscriptions',
          vendorName: 'Subscription Service, Inc.',
          billNumber: '19201',
          billDate: '2023-10-25',
          grossAmount: 2350,
          taxes: 10,
          totalAmount: 2360,
          description: 'Payment for various software subscriptions.'
        },
        expenseType: 'Subscriptions',
        personalExpense: false,
        modeOfPayment: 'Debit Card',
        billImageUrl: 'https://example.com/subscriptions_receipt.jpg'
      },
      {
        transactionData: {
          businessPurpose: 'Monthly Office Rent',
          vendorName: 'Office Space LLC',
          billNumber: '123765',
          billDate: '2023-10-01',
          grossAmount: 240000,
          taxes: 100,
          totalAmount: 240100,
          description: 'Rent for office space.'
        },
        expenseType: 'Office Rent',
        personalExpense: false,
        modeOfPayment: 'Bank Transfer',
        billImageUrl: 'https://example.com/office_rent_receipt.jpg'
      }, {
        transactionData: {
          businessPurpose: 'Communication Services',
          vendorName: 'Telecom Provider, Inc.',
          billNumber: '541121',
          billDate: '2023-10-10',
          grossAmount: 8900,
          taxes: 1005,
          totalAmount: 9905,
          description: 'Payment for office phone and internet services.'
        },
        expenseType: 'Communication',
        personalExpense: false,
        modeOfPayment: 'Credit Card',
        billImageUrl: 'https://example.com/communication_receipt.jpg'
      },{
        transactionData: {
          businessPurpose: 'Annual Insurance Premium',
          vendorName: 'Insurance Company',
          billNumber: '2461280',
          billDate: '2023-11-01',
          grossAmount: 23000,
          taxes: 60,
          totalAmount: 23060,
          description: 'Insurance coverage for the office.'
        },
        expenseType: 'Insurance',
        personalExpense: false,
        modeOfPayment: 'Bank Transfer',
        billImageUrl: 'https://example.com/insurance_receipt.jpg'
      },
    ],
    approvers: [
      {
        empId: 'emp004',
        name: 'Brook'
      },
      {
        empId: 'emp001',
        name: 'Luffy'
      }
    ],
    expenseViolations: [],
    expenseRejectionReason: ''
  },{
    tenantId: 'tenant1',
    expenseHeaderID: '44444',
    travelRequestId: 'tenant1_emp001_tr_002',
    expenseHeaderType: 'non travel',
    tripPurpose: 'Branch Opening',
    createdBy: {
      empId: 'emp001',
      name: 'Luffy'
    },
    createdFor: [
      {
        empId: 'emp002',
        name: 'nami'
      },
      {
        empId: 'emp003',
        name: 'zoro'
      }
    ],
    teamMembers: [],
    expenseStatus: 'pending approval',
    expenseSubmissionDate: new Date('2023-10-19T12:00:00Z'),
    expenseLines: [
      {
        transactionData: {
          businessPurpose: 'Monthly Office Cleaning',
          vendorName: 'CleanUp Services, Inc.',
          billNumber: '135179',
          billDate: '2023-10-12',
          grossAmount: 7300,
          taxes: 20,
          totalAmount: 7320,
          description: 'Professional office cleaning services.'
        },
        expenseType: 'Office Cleaning',
        personalExpense: false,
        modeOfPayment: 'Bank Transfer',
        billImageUrl: 'https://example.com/office_cleaning_receipt.jpg'
      },
      {
        transactionData: {
          businessPurpose: 'Marketing Campaign',
          vendorName: 'Ad Agency, Ltd.',
          billNumber: '242681',
          billDate: '2023-10-18',
          grossAmount: 35000,
          taxes: 300,
          totalAmount: 35300,
          description: 'Marketing and advertising campaign.'
        },
        expenseType: 'Marketing and Advertising',
        personalExpense: false,
        modeOfPayment: 'Credit Card',
        billImageUrl: 'https://example.com/marketing_receipt.jpg'
      },
      {
        transactionData: {
          businessPurpose: 'Employee Benefits Program',
          vendorName: 'Benefits Provider, Inc.',
          billNumber: '3572291',
          billDate: '2023-10-22',
          grossAmount: 47000,
          taxes: 60,
          totalAmount: 47060,
          description: 'Employee health and benefits program.'
        },
        expenseType: 'Employee Benefits',
        personalExpense: false,
        modeOfPayment: 'Bank Transfer',
        billImageUrl: 'https://example.com/employee_benefits_receipt.jpg'
      },
      {
        transactionData: {
          businessPurpose: 'Legal and Accounting Services',
          vendorName: 'Law and Accounting Firm',
          billNumber: '4622802',
          billDate: '2023-10-10',
          grossAmount: 88500,
          taxes: 90,
          totalAmount: 88590,
          description: 'Legal and accounting services.'
        },
        expenseType: 'Legal and Accounting Services',
        personalExpense: false,
        modeOfPayment: 'Credit Card',
        billImageUrl: 'https://example.com/legal_accounting_receipt.jpg'
      },
      {
        transactionData: {
          businessPurpose: 'Office Security Services',
          vendorName: 'Security Solutions, Inc.',
          billNumber: '5722913',
          billDate: '2023-10-05',
          grossAmount: 46400,
          taxes: 25,
          totalAmount: 46425,
          description: 'Security services for the office.'
        },
        expenseType: 'Office Security',
        personalExpense: false,
        modeOfPayment: 'Bank Transfer',
        billImageUrl: 'https://example.com/security_services_receipt.jpg'
      },
    ],
    approvers: [
      {
        empId: 'emp004',
        name: 'Brook'
      }
    ],
    expenseViolations: [],
    expenseRejectionReason: ''
  },{
    tenantId: 'tenant2',
    expenseHeaderID: '1240',
    travelRequestId: 'tenant2_emp005_tr_001',
    expenseHeaderType: 'non travel',
    tripPurpose: 'Bengaluru Investors Meeting',
    createdBy: {
      empId: 'emp005',
      name: 'sanji'
    },
    createdFor: [
      {
        empId: 'emp003',
        name: 'zoro'
      }
    ],
    teamMembers: [],
    expenseStatus: 'pending approval',
    expenseSubmissionDate: new Date('2023-10-19T12:00:00Z'),
    expenseLines: [
      {
        transactionData: {
          businessPurpose: 'Bengaluru Investors Meeting',
          vendorName: 'Hotel XYZ',
          billNumber: '543227621',
          billDate: '2023-01-02',
          grossAmount: 600,
          taxes: 60,
          totalAmount: 660,
          description: 'Food.'
        },
        expenseType: 'Accommodation',
        personalExpense: false,
        modeOfPayment: 'Internet Banking',
        billImageUrl: 'https://example.com/hotel_receipt.jpg'
      },
      {
        transactionData: {
          businessPurpose: 'Bengaluru Investors Meeting',
          vendorName: 'MBA Food wala',
          billNumber: '678690',
          billDate: '2023-01-03',
          grossAmount: 9872,
          taxes: 100,
          totalAmount: 9972,
          description: 'Meals during the trip.'
        },
        expenseType: 'Food',
        personalExpense: true,
        modeOfPayment: 'UPI',
        billImageUrl: ''
      }
    ],
    approvers: [
      {
        empId: 'emp004',
        name: 'Brook'
      }
    ],
    expenseViolations: [],
    expenseRejectionReason: ''
  },{
    tenantId: 'tenant2',
    expenseHeaderID: '1242341',
    travelRequestId: 'tenant2_emp002_tr_003',
    expenseHeaderType: 'non travel',
    tripPurpose: 'Huston Expo',
    createdBy: {
      empId: 'emp002',
      name: 'nami'
    },
    createdFor: [
      {
        empId: 'emp003',
        name: 'zoro'
      }
    ],
    teamMembers: [],
    expenseStatus: 'pending approval',
    expenseSubmissionDate: new Date('2023-10-19T12:00:00Z'),
    expenseLines: [
      {
        transactionData: {
          businessPurpose: 'Marketing Campaign',
          vendorName: 'Ad Agency, Ltd.',
          billNumber: '24621181',
          billDate: '2023-10-18',
          grossAmount: 12918,
          taxes: 300,
          totalAmount: 13218 ,
          description: 'Marketing and advertising campaign.'
        },
        expenseType: 'Marketing and Advertising',
        personalExpense: false,
        modeOfPayment: 'Credit Card',
        billImageUrl: 'https://example.com/marketing_receipt.jpg'
      },
      {
        transactionData: {
          businessPurpose: 'Employee Benefits Program',
          vendorName: 'Benefits Provider, Inc.',
          billNumber: '3532791',
          billDate: '2023-10-22',
          grossAmount: 78000,
          taxes: 60,
          totalAmount: 78060,
          description: 'Employee health and benefits program.'
        },
        expenseType: 'Employee Benefits',
        personalExpense: false,
        modeOfPayment: 'Bank Transfer',
        billImageUrl: 'https://example.com/employee_benefits_receipt.jpg'
      },
      {
        transactionData: {
          businessPurpose: 'Legal and Accounting Services',
          vendorName: 'Law and Accounting Firm',
          billNumber: '4682102',
          billDate: '2023-10-10',
          grossAmount: 8519,
          taxes: 100,
          totalAmount: 8619,
          description: 'Legal and accounting services.'
        },
        expenseType: 'Legal and Accounting Services',
        personalExpense: false,
        modeOfPayment: 'Credit Card',
        billImageUrl: 'https://example.com/legal_accounting_receipt.jpg'
      },
      {
        transactionData: {
          businessPurpose: 'Office Security Services',
          vendorName: 'Security Solutions, Inc.',
          billNumber: '579113',
          billDate: '2023-10-05',
          grossAmount: 7000,
          taxes: 25,
          totalAmount: 7025,
          description: 'Security services for the office.'
        },
        expenseType: 'Office Security',
        personalExpense: false,
        modeOfPayment: 'Bank Transfer',
        billImageUrl: 'https://example.com/security_services_receipt.jpg'
      },
    ],
    approvers: [
      {
        empId: 'emp001',
        name: 'Luffy'
      }
    ],
    expenseViolations: [],
    expenseRejectionReason: ''
  }, {
    tenantId: 'tenant1',
    expenseHeaderID: '1235',
    travelRequestId: 'tenant1_emp001_tr_001',
    expenseHeaderType: 'non travel', // Changed to non-travel
    tripPurpose: 'AeroCity Investors Meeting',
    createdBy: {
      empId: 'emp001',
      name: 'Luffy'
    },
    createdFor: [
      {
        empId: 'emp002',
        name: 'nami'
      },
      {
        empId: 'emp003',
        name: 'zoro'
      }
    ],
    teamMembers: [],
    expenseStatus: 'pending approval',
    expenseSubmissionDate: new Date('2023-01-01'),
    expenseLines: [
      {
        transactionData: {
          businessPurpose: 'Marketing Campaign',
          vendorName: 'Ad Agency, Ltd.',
          billNumber: '246281',
          billDate: '2023-10-18',
          grossAmount: 1500,
          taxes: 300,
          totalAmount: 1530,
          description: 'Marketing and advertising campaign.'
        },
        expenseType: 'Marketing and Advertising',
        personalExpense: false,
        modeOfPayment: 'Credit Card',
        billImageUrl: 'https://example.com/marketing_receipt.jpg'
      },
      {
        transactionData: {
          businessPurpose: 'Employee Benefits Program',
          vendorName: 'Benefits Provider, Inc.',
          billNumber: '3579231',
          billDate: '2023-10-22',
          grossAmount: 12800,
          taxes: 60,
          totalAmount: 12860,
          description: 'Employee health and benefits program.'
        },
        expenseType: 'Employee Benefits',
        personalExpense: false,
        modeOfPayment: 'Bank Transfer',
        billImageUrl: 'https://example.com/employee_benefits_receipt.jpg'
      },
      {
        transactionData: {
          businessPurpose: 'Legal and Accounting Services',
          vendorName: 'Law and Accounting Firm',
          billNumber: '468102',
          billDate: '2023-10-10',
          grossAmount: 87100,
          taxes: 90,
          totalAmount: 87190,
          description: 'Legal and accounting services.'
        },
        expenseType: 'Legal and Accounting Services',
        personalExpense: false,
        modeOfPayment: 'Credit Card',
        billImageUrl: 'https://example.com/legal_accounting_receipt.jpg'
      },
      {
        transactionData: {
          businessPurpose: 'Office Security Services',
          vendorName: 'Security Solutions, Inc.',
          billNumber: '579313',
          billDate: '2023-10-05',
          grossAmount: 71000,
          taxes: 25,
          totalAmount: 71025,
          description: 'Security services for the office.'
        },
        expenseType: 'Office Security',
        personalExpense: false,
        modeOfPayment: 'Bank Transfer',
        billImageUrl: 'https://example.com/security_services_receipt.jpg'
      },
    ],
    approvers: [
      {
        empId: 'emp004',
        name: 'Brook'
      }
    ],
    expenseViolations: [],
    expenseRejectionReason: ''
  }
  ];
  
  export {expense}
  