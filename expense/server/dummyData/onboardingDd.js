const onBoardingData = {
    tenantId: "tenant456", 
    tenantName: "Dragon",
    companyName: "Dragon",
    flags: {
      DIY_FLAG: false,
      GROUPING_FLAG: true,
      ORG_HEADERS_FLAG: true,
    },
    companyDetails: {
      companyName: "Dragon",
      companyLogo: "https://example.com/logo.png",
      companyEmail: "info@dragoninc.com",
      companyHeadquarters: "Gurugram, India",
      companySize: "Large",
      defaultCurrency: "INR",
      industry: "Technology",
    },
    employees: [
        {
          employeeDetails: {
            name: "John Doe",
            email: "john.doe@abcinc.com",
            department: "Finance",
          },
          group: ["Finance"],
          employeeRoles: {
            employee: true,
            employeeManager: false,
            finance: true,
            businessAdmin: false,
            superAdmin: false,
          },
          canDelegate: true,
        },
        {
          employeeDetails: {
            name: "Jane Smith",
            email: "jane.smith@abcinc.com",
            department: "HR",
          },
          group: ["HR"],
          employeeRoles: {
            employee: true,
            employeeManager: true,
            finance: false,
            businessAdmin: false,
            superAdmin: false,
          },
          canDelegate: false,
        },
        // Add more employees below:
        {
          employeeDetails: {
            name: "Alice Johnson",
            email: "alice.johnson@abcinc.com",
            department: "Finance",
          },
          group: ["Finance"],
          employeeRoles: {
            employee: true,
            employeeManager: true,
            finance: false,
            businessAdmin: false,
            superAdmin: false,
          },
          canDelegate: false,
        },
        {
          employeeDetails: {
            name: "Bob Williams",
            email: "bob.williams@abcinc.com",
            department: "Finance",
          },
          group: ["Finance"],
          employeeRoles: {
            employee: true,
            employeeManager: false,
            finance: true,
            businessAdmin: true,
            superAdmin: false,
          },
          canDelegate: true,
        },
        {
          employeeDetails: {
            name: "Eva Brown",
            email: "eva.brown@abcinc.com",
            department: "HR",
          },
          group: ["HR"],
          employeeRoles: {
            employee: true,
            employeeManager: true,
            finance: true,
            businessAdmin: false,
            superAdmin: true,
          },
          canDelegate: true,
        },
      ],
    groups: [
        {
          groupName: "Finance",
          filters: [],
        },
        {
          groupName: "HR",
          filters: [],
        }, ],
    policies: {
        "travel": {
          "In-country travel policy": {
            "Allowed Trip Purpose": ["Business", "Personal", "Training", "Events", "Others"],
            "Pre-trip Approval Limit": "Monetary value",
            "Airfare Class": ["Economy", "Premium Economy", "Business", "First"],
            "Airfare Price allowed upto *": "INR",
            "Railway ticket Price allowed upto *": "INR",
            "Allowed Car rentals": ["Compact", "Intermediate", "Large"],
            "Car Rental Price allowed upto *": "",
            "Allowed Hotel booking class": ["Motel", "3-star", "4-star", "5-star"],
            "Hotel Price allowed upto *": "INR",
            "Per Diem allowance": "Monetary values per meal/lodging/incidental expenses",
            "Advance payment (Per diem x number of days trip)": "null",
            "Meal allowance allowed": "null",
            "Mileage Reimbursement Rate": "Currency per Mile/Kilometer (in relevant currency)",
            "Ground Transportation Allowance": "INR",
            "Expense Report Submission Deadline": "30 days",
            "Pre-approval required?": "False",
            "Pre-approval Thresholds": "INR",
            "Minimum days to book before travel": "4 days",
            "Expense Type Restrictions": ["Alcohol", "Entertainment"],
            "Non-compliant Travel Consequences": "Reimbursement Denied",
            "Policy Exceptions & Escalation Process": "Approval by Manager",
            "ignore approval for in transit trip": "Yes",
            "Approval flow": "L1, L1 + L2, L1+Finance etc",
          }}},
    groupHeaders: {},
    orgHeaders: {
        "Legal Entity Container": "ABC Legal",
        "Cost Centre Container": "Cost Center XYZ",
        "Profit Centre Container": "Profit Center 123",
        "Department Container": "Department ABC",
      },
    travelAllocation: [],
    travelExpenseAllocation: [
        {
          "flights": {
            "Date": "Date of flight",
            "Amount": "Cost of airfare",
            "Description": "Description of flight",
            "Category": "Flight",
            "Payment Method": "Payment method used",
            "Currency": "Currency of transaction",
            "Receipt": "Receipt or confirmation",
            "Location": "Departure/Arrival locations",
          },
        },
        {
          "hotels": {
            "Date": "Check-in/Check-out dates",
            "Amount": "Lodging expenses",
            "Description": "Hotel details",
            "Category": "Lodging",
            "Payment Method": "Payment method used",
            "Currency": "Currency of transaction",
            "Receipt": "Receipt or confirmation",
            "Location": "Hotel location",
          },
        },
        {
          "cab": {
            "Date": "Date of transportation",
            "Amount": "Transportation cost",
            "Description": "Transportation details",
            "Category": "Transportation",
            "Payment Method": "Payment method used",
            "Currency": "Currency of transaction",
            "Receipt": "Receipt or confirmation",
            "Location": "Start/End locations",
          },
        },
        {
          "food": {
            "Date": "Date of meal",
            "Amount": "Meal expenses",
            "Description": "Meal details",
            "Category": "Meals",
            "Payment Method": "Payment method used",
            "Currency": "Currency of transaction",
            "Receipt": "Receipt or confirmation",
            "Location": "Restaurant/location",
          },
        },
        {
          "miscellaneous": {
            "Date": "Date of expense",
            "Amount": "Other travel-related expenses",
            "Description": "Expense details",
            "Category": "Miscellaneous",
            "Payment Method": "Payment method used",
            "Currency": "Currency of transaction",
            "Receipt": "Receipt or confirmation",
            "Location": "Expense location",
          },
        },
        // Add more travel expenses as needed
      ],    
    nonTravelExpenseAllocation: [
        {
          "Office Supplies": "Description, quantity, unit cost, total cost",
        },
        {
          "Utilities": "Type of utility (e.g., electricity, water, gas), total cost",
        },
        {
          "Insurance": "Policy type, insurance provider, premium amount",
        },
        {
          "Marketing and Advertising": "Marketing campaign description, advertising channels, cost",
        },
        {
          "Professional Fees": "Service provider, nature of service, cost",
        },
        {
          "Software and Licenses": "Software name, license type, license cost",
        },
        {
          "Equipment": "Item description, quantity, unit cost, total cost",
        },
        {
          "Repairs and Maintenance": "Description of repair/maintenance work, service provider, cost",
        },
        {
          "Legal and Compliance": "Description, quantity, unit cost, total cost",
        },
        {
          "Communication": "Communication cost",
        },
        {
          "Research and Development": "Research project description, cost",
        },
        {
          "Training": "Training program description, trainer, cost",
        },
        {
          "Software Subscriptions": "Software name, subscription type, subscription cost",
        },
        {
          "Legal Expenses": "Legal service description, law firm, cost",
        },
        {
          "Client entertainment": "Bill and cost",
        },
        {
          "Client gift": "Bill and cost",
        },
        // Add additional non-travel expenses as needed
      ],   
    groupingLabels: [],
    accountLines: [
        {
            categoryName: "Expense Category 1",
            accountLine: "Account Line 123",
          },
          {
            categoryName: "Expense Category 2",
            accountLine: "Account Line ABC",
          },
    ],

    multiCurrencyTable: {
        defaultCurrency: {
          code: "INR",
          symbol: "₹", // Symbol for Indian Rupee
        },
        exchangeValue: [
          {
            currency: {
              code: "USD",
              name: "US Dollar",
              symbol: "$",
            },
            value: 0.014, // Example exchange rate for INR to USD
          },
          {
            currency: {
              code: "EUR",
              name: "Euro",
              symbol: "€",
            },
            value: 0.012, // Example exchange rate for INR to EUR
          },
          {
            currency: {
              code: "GBP",
              name: "British Pound",
              symbol: "£",
            },
            value: 0.011, // Example exchange rate for INR to GBP
          },
          // Additional exchange rates can be added here
        ],
      },
    expenseCategories: [],
    systemRelatedRoles: {
      finance: [],
      businessAdmin: [],
      superAdmin: [],
    },
    blanketDelegations: {
      groups: [],
      employees: [],
    },
    advanceSettlementOptions: {
      Cash: true,
      Cheque: true,
      "Salary Account": false,
      "Prepaid Card": false,
      "NEFT Bank Transfer": true,
    },
    expenseSettlementOptions: {
      Cash: true,
      Cheque: false,
      "Salary Account": true,
      "Prepaid Card": true,
      "NEFT Bank Transfer": false,
    },
  };
  
  // Assuming you have a function to create a new HRCompany instance
  const dummyHRCompany = new HRCompany(onBoardingData);
  
  export default dummyHRCompany;
  