const trips = [
    {
      "tripNumber": "TRIPST00001",
      "tripStatus": "transit",
      "travelType": "international",
      "allocations": [
        { "headerName": "department", "headerValue": ["finance", "tech", "hr"] },
        { "headerName": "legalEntity", "headerValue": ["legal value 1", "legal value 2"] }
      ],
      "defaultCurrency": {
        "countryCode": "IN",
        "fullName": "Indian Rupee",
        "shortName": "INR",
        "symbol": "₹"
      },
      "approvers": [],
      "tripPurpose": "client meeting"
    },
    {
      "tripNumber": "TRIPST00002",
      "tripStatus": "completed",
      "travelType": "domestic",
      "allocations": [
        { "headerName": "department", "headerValue": ["sales", "marketing"] },
        { "headerName": "legalEntity", "headerValue": ["legal value 3"] }
      ],
      "defaultCurrency": {
        "countryCode": "US",
        "fullName": "United States Dollar",
        "shortName": "USD",
        "symbol": "$"
      },
      "approvers": ["Alice Johnson"],
      "tripPurpose": "conference"
    },
    {
      "tripNumber": "TRIPST00003",
      "tripStatus": "cancelled",
      "travelType": "international",
      "allocations": [
        { "headerName": "department", "headerValue": ["it", "support"] },
        { "headerName": "legalEntity", "headerValue": ["legal value 4", "legal value 5"] }
      ],
      "defaultCurrency": {
        "countryCode": "EU",
        "fullName": "Euro",
        "shortName": "EUR",
        "symbol": "€"
      },
      "approvers": ["Bob Smith"],
      "tripPurpose": "training"
    },
    {
      "tripNumber": "TRIPST00004",
      "tripStatus": "pending",
      "travelType": "domestic",
      "allocations": [
        { "headerName": "department", "headerValue": ["development", "design"] },
        { "headerName": "legalEntity", "headerValue": ["legal value 6"] }
      ],
      "defaultCurrency": {
        "countryCode": "GB",
        "fullName": "British Pound",
        "shortName": "GBP",
        "symbol": "£"
      },
      "approvers": ["Charlie Brown"],
      "tripPurpose": "workshop"
    },
    {
      "tripNumber": "TRIPST00005",
      "tripStatus": "transit",
      "travelType": "international",
      "allocations": [
        { "headerName": "department", "headerValue": ["finance", "admin"] },
        { "headerName": "legalEntity", "headerValue": ["legal value 7", "legal value 8"] }
      ],
      "defaultCurrency": {
        "countryCode": "JP",
        "fullName": "Japanese Yen",
        "shortName": "JPY",
        "symbol": "¥"
      },
      "approvers": ["David Clark"],
      "tripPurpose": "site visit"
    },
    {
      "tripNumber": "TRIPST00006",
      "tripStatus": "completed",
      "travelType": "domestic",
      "allocations": [
        { "headerName": "department", "headerValue": ["operations", "logistics"] },
        { "headerName": "legalEntity", "headerValue": ["legal value 9"] }
      ],
      "defaultCurrency": {
        "countryCode": "AU",
        "fullName": "Australian Dollar",
        "shortName": "AUD",
        "symbol": "A$"
      },
      "approvers": ["Eve Davis"],
      "tripPurpose": "audit"
    },
    {
      "tripNumber": "TRIPST00007",
      "tripStatus": "cancelled",
      "travelType": "international",
      "allocations": [
        { "headerName": "department", "headerValue": ["hr", "recruitment"] },
        { "headerName": "legalEntity", "headerValue": ["legal value 10"] }
      ],
      "defaultCurrency": {
        "countryCode": "CA",
        "fullName": "Canadian Dollar",
        "shortName": "CAD",
        "symbol": "C$"
      },
      "approvers": ["Frank Edwards"],
      "tripPurpose": "seminar"
    },
    {
      "tripNumber": "TRIPST00008",
      "tripStatus": "pending",
      "travelType": "domestic",
      "allocations": [
        { "headerName": "department", "headerValue": ["management", "strategy"] },
        { "headerName": "legalEntity", "headerValue": ["legal value 11", "legal value 12"] }
      ],
      "defaultCurrency": {
        "countryCode": "CN",
        "fullName": "Chinese Yuan",
        "shortName": "CNY",
        "symbol": "¥"
      },
      "approvers": ["Grace Hall"],
      "tripPurpose": "business development"
    },
    {
      "tripNumber": "TRIPST00009",
      "tripStatus": "transit",
      "travelType": "international",
      "allocations": [
        { "headerName": "department", "headerValue": ["research", "innovation"] },
        { "headerName": "legalEntity", "headerValue": ["legal value 13", "legal value 14"] }
      ],
      "defaultCurrency": {
        "countryCode": "IN",
        "fullName": "Indian Rupee",
        "shortName": "INR",
        "symbol": "₹"
      },
      "approvers": ["Hannah Lee"],
      "tripPurpose": "client meeting"
    },
    {
      "tripNumber": "TRIPST00010",
      "tripStatus": "completed",
      "travelType": "domestic",
      "allocations": [
        { "headerName": "department", "headerValue": ["customer service", "support"] },
        { "headerName": "legalEntity", "headerValue": ["legal value 15"] }
      ],
      "defaultCurrency": {
        "countryCode": "SG",
        "fullName": "Singapore Dollar",
        "shortName": "SGD",
        "symbol": "S$"
      },
      "approvers": ["Ian Martinez"],
      "tripPurpose": "product launch"
    }
  ];
  