const expense = [
    {
      tenantId: 'tenant2',
      expenseHeaderID: '009136',
      travelRequestId: 'tenant2_emp002_tr_002',
      expenseHeaderType: 'non travel', 
      purpose: 'Monthly Company Expense ',
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
            billNumber: '511621',
            billDate: '2023-01-02',
            grossAmount: 7600,
            taxes: 60,
            totalAmount: 7660,
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
            billNumber: '612690',
            billDate: '2023-01-03',
            grossAmount: 7150,
            taxes: 15,
            totalAmount: 7165,
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
            billNumber: '1352279',
            billDate: '2023-10-12',
            grossAmount: 32200,
            taxes: 20,
            totalAmount: 32220,
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
            billNumber: '2462381',
            billDate: '2023-10-18',
            grossAmount: 15000,
            taxes: 300,
            totalAmount: 15300,
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
            billNumber: '7801901',
            billDate: '2023-10-25',
            grossAmount: 3150,
            taxes: 10,
            totalAmount: 3160,
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
            billNumber: '1198765',
            billDate: '2023-10-01',
            grossAmount: 182000,
            taxes: 100,
            totalAmount: 182100,
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
            billNumber: '5432321',
            billDate: '2023-10-10',
            grossAmount: 13100,
            taxes: 1005,
            totalAmount: 14105,
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
            billNumber: '2462380',
            billDate: '2023-11-01',
            grossAmount: 7700,
            taxes: 60,
            totalAmount: 7760,
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
      expenseHeaderID: '412321',
      travelRequestId: 'tenant1_emp001_tr_002',
      expenseHeaderType: 'non travel',
      purpose: '10th year celebration',
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
            billNumber: '13579',
            billDate: '2023-10-12',
            grossAmount: 300,
            taxes: 20,
            totalAmount: 320,
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
            billNumber: '24681',
            billDate: '2023-10-18',
            grossAmount: 5000,
            taxes: 300,
            totalAmount: 5300,
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
            billNumber: '35791',
            billDate: '2023-10-22',
            grossAmount: 1000,
            taxes: 60,
            totalAmount: 1060,
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
            billNumber: '46802',
            billDate: '2023-10-10',
            grossAmount: 1500,
            taxes: 90,
            totalAmount: 1590,
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
            billNumber: '57913',
            billDate: '2023-10-05',
            grossAmount: 400,
            taxes: 25,
            totalAmount: 425,
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
      expenseHeaderID: '112340',
      travelRequestId: 'tenant2_emp005_tr_001',
      expenseHeaderType: 'non travel',
      purpose: 'Office Expenses',
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
            billNumber: '5437621',
            billDate: '2023-01-02',
            grossAmount: 7600,
            taxes: 60,
            totalAmount: 7660,
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
            billNumber: '6788690',
            billDate: '2023-01-03',
            grossAmount: 17150,
            taxes: 15,
            totalAmount: 17165,
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
      purpose: 'Huston Expo',
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
            billNumber: '2461181',
            billDate: '2023-10-18',
            grossAmount: 12000,
            taxes: 300,
            totalAmount: 12300,
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
            grossAmount: 16000,
            taxes: 60,
            totalAmount: 16060,
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
            grossAmount: 86500,
            taxes: 90,
            totalAmount: 86590,
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
            billNumber: '5791313',
            billDate: '2023-10-05',
            grossAmount: 27000,
            taxes: 25,
            totalAmount: 27025,
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
      expenseHeaderID: '12389235',
      travelRequestId: 'tenant1_emp001_tr_001',
      expenseHeaderType: 'non travel', 
      purpose: 'Office expense bills',
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
            billNumber: '2462381',
            billDate: '2023-10-18',
            grossAmount: 15000,
            taxes: 300,
            totalAmount: 15300,
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
            grossAmount: 17000,
            taxes: 60,
            totalAmount: 17060,
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
            billNumber: '46802',
            billDate: '2023-10-10',
            grossAmount: 81100,
            taxes: 90,
            totalAmount: 81190,
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
            billNumber: '5792313',
            billDate: '2023-10-05',
            grossAmount: 40000,
            taxes: 25,
            totalAmount: 40025,
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
    