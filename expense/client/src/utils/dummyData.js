export {levels,categoryLevel3,allocationLevel1,lineItems}

const levels = 
{"travelAllocationFlags": {
                "level1": false,
                "level2": false,
                "level3": true
            }}
//for level3 category
const categoryLevel3 = 
{"travelExpenseCategories": {
            "international" : 
            [
                {
                    "categoryName": "Flight",
                    "allocation": [
                        {
                            "headerName": "department",
                            "headerValues": [
                                "Finance",
                                "HR",
                                "Marketing",
                                "Engineering"
                            ]
                        },
                        {
                            "headerName": "legalEntity",
                            "headerValues": [
                                "Company XYZ",
                                "Company ABC"
                            ]
                        },
                        {
                            "headerName": "profitCenter",
                            "headerValues": [
                                "PC-101",
                                "PC-102",
                                "PC-103",
                                "PC-104",
                                "PC-105",
                                "PC-106",
                                "PC-107",
                                "PC-108",
                                "PC-109",
                                "PC-110",
                                "PC-111",
                                "PC-112",
                                "PC-113",
                                "PC-114",
                                "PC-115",
                                "PC-116",
                                "PC-117",
                                "PC-118",
                                "PC-119",
                                "PC-120"
                            ]
                        },
                        {
                            "headerName": "division",
                            "headerValues": [
                                "Corporate",
                                "Financial",
                                "Engineering",
                                "Marketing"
                            ]
                        }
                    ],
                    "expenseAllocation": [
                        {
                            "headerName": "department",
                            "headerValues": [
                                "Finance",
                                "HR",
                                "Marketing",
                                "Engineering"
                            ]
                        },
                        {
                            "headerName": "legalEntity",
                            "headerValues": [
                                "Company XYZ",
                                "Company ABC"
                            ]
                        },
                        {
                            "headerName": "profitCenter",
                            "headerValues": [
                                "PC-101",
                                "PC-102",
                                "PC-103",
                                "PC-104",
                                "PC-105",
                                "PC-106",
                                "PC-107",
                                "PC-108",
                                "PC-109",
                                "PC-110",
                                "PC-111",
                                "PC-112",
                                "PC-113",
                                "PC-114",
                                "PC-115",
                                "PC-116",
                                "PC-117",
                                "PC-118",
                                "PC-119",
                                "PC-120"
                            ]
                        },
                        {
                            "headerName": "division",
                            "headerValues": [
                                "Corporate",
                                "Financial",
                                "Engineering",
                                "Marketing"
                            ]
                        }
                    ],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Invoice Date",
                            "type": "date"
                        },
                        {
                            "name": "Flight Number",
                            "type": "text"
                        },
                        {
                            "name": "Departure",
                            "type": "text"
                        },
                        {
                            "name": "Arrival",
                            "type": "text"
                        },
                        {
                            "name": "Airlines name",
                            "type": "text"
                        },
                        {
                            "name": "Travelers Name",
                            "type": "text"
                        },
                        {
                            "name": "Class",
                            "type": "text"
                        },
                        {
                            "name": "Booking Reference Number",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        }
                    ],
                    "class": [
                        "Economy",
                        "Premium Economy",
                        "Business",
                        "First Class"
                    ],
                    "allocation_accountLine": "1001",
                    "expenseAllocation_accountLine": "1001"
                },
                {
                    "categoryName": "Train",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Invoice Date",
                            "type": "date"
                        },
                        {
                            "name": "Origin",
                            "type": "text"
                        },
                        {
                            "name": "Destination",
                            "type": "text"
                        },
                        {
                            "name": "Travelers Name",
                            "type": "text"
                        },
                        {
                            "name": "Class",
                            "type": "text"
                        },
                        {
                            "name": "Booking Reference No.",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        }
                    ],
                    "class": [
                        "First AC ",
                        "Second AC",
                        "Third AC",
                        "Sleeper",
                        "Chair Car"
                    ]
                },
                {
                    "categoryName": "Bus",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Invoice Date",
                            "type": "date"
                        },
                        {
                            "name": "Origin",
                            "type": "text"
                        },
                        {
                            "name": "Destination",
                            "type": "text"
                        },
                        {
                            "name": "Travelers Name",
                            "type": "text"
                        },
                        {
                            "name": "Class",
                            "type": "text"
                        },
                        {
                            "name": "Booking Reference No.",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        }
                    ],
                    "class": [
                        "Sleeper",
                        "Semi-Sleeper",
                        "Regular"
                    ]
                },
                {
                    "categoryName": "Cab",
                    "allocation": [
                        {
                            "headerName": "department",
                            "headerValues": [
                                "Finance",
                                "HR",
                                "Marketing",
                                "Engineering"
                            ]
                        },
                        {
                            "headerName": "legalEntity",
                            "headerValues": [
                                "Company XYZ",
                                "Company ABC"
                            ]
                        },
                        {
                            "headerName": "profitCenter",
                            "headerValues": [
                                "PC-101",
                                "PC-102",
                                "PC-103",
                                "PC-104",
                                "PC-105",
                                "PC-106",
                                "PC-107",
                                "PC-108",
                                "PC-109",
                                "PC-110",
                                "PC-111",
                                "PC-112",
                                "PC-113",
                                "PC-114",
                                "PC-115",
                                "PC-116",
                                "PC-117",
                                "PC-118",
                                "PC-119",
                                "PC-120"
                            ]
                        },
                        {
                            "headerName": "division",
                            "headerValues": [
                                "Corporate",
                                "Financial",
                                "Engineering",
                                "Marketing"
                            ]
                        }
                    ],
                    "expenseAllocation": [
                        {
                            "headerName": "department",
                            "headerValues": [
                                "Finance",
                                "HR",
                                "Marketing",
                                "Engineering"
                            ]
                        },
                        {
                            "headerName": "legalEntity",
                            "headerValues": [
                                "Company XYZ",
                                "Company ABC"
                            ]
                        },
                        {
                            "headerName": "profitCenter",
                            "headerValues": [
                                "PC-101",
                                "PC-102",
                                "PC-103",
                                "PC-104",
                                "PC-105",
                                "PC-106",
                                "PC-107",
                                "PC-108",
                                "PC-109",
                                "PC-110",
                                "PC-111",
                                "PC-112",
                                "PC-113",
                                "PC-114",
                                "PC-115",
                                "PC-116",
                                "PC-117",
                                "PC-118",
                                "PC-119",
                                "PC-120"
                            ]
                        },
                        {
                            "headerName": "division",
                            "headerValues": [
                                "Corporate",
                                "Financial",
                                "Engineering",
                                "Marketing"
                            ]
                        }
                    ],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Date",
                            "type": "date"
                        },
                        {
                            "name": "Time",
                            "type": "time"
                        },
                        {
                            "name": "Pickup Location",
                            "type": "text"
                        },
                        {
                            "name": "DropOff Location",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Receipt No.",
                            "type": "text"
                        },
                        {
                            "name": "Ride Distance",
                            "type": "text"
                        }
                    ],
                    "class": [
                        "Economy",
                        "Business",
                        "Executive"
                    ],
                    "allocation_accountLine": "1001",
                    "expenseAllocation_accountLine": "1001"
                },
                {
                    "categoryName": "Cab Rental",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Date",
                            "type": "date"
                        },
                        {
                            "name": "Time",
                            "type": "time"
                        },
                        {
                            "name": "Pickup Location",
                            "type": "text"
                        },
                        {
                            "name": "DropOff Location",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Receipt No.",
                            "type": "text"
                        },
                        {
                            "name": "Ride Distance",
                            "type": "text"
                        }
                    ],
                    "class": [
                        "Economy",
                        "Business",
                        "Executive"
                    ]
                },
                {
                    "categoryName": "Hotel",
                    "allocation": [
                        {
                            "headerName": "department",
                            "headerValues": [
                                "Finance",
                                "HR",
                                "Marketing",
                                "Engineering"
                            ]
                        },
                        {
                            "headerName": "legalEntity",
                            "headerValues": [
                                "Company XYZ",
                                "Company ABC"
                            ]
                        },
                        {
                            "headerName": "profitCenter",
                            "headerValues": [
                                "PC-101",
                                "PC-102",
                                "PC-103",
                                "PC-104",
                                "PC-105",
                                "PC-106",
                                "PC-107",
                                "PC-108",
                                "PC-109",
                                "PC-110",
                                "PC-111",
                                "PC-112",
                                "PC-113",
                                "PC-114",
                                "PC-115",
                                "PC-116",
                                "PC-117",
                                "PC-118",
                                "PC-119",
                                "PC-120"
                            ]
                        },
                        {
                            "headerName": "division",
                            "headerValues": [
                                "Corporate",
                                "Financial",
                                "Engineering",
                                "Marketing"
                            ]
                        }
                    ],
                    "expenseAllocation": [
                        {
                            "headerName": "department",
                            "headerValues": [
                                "Finance",
                                "HR",
                                "Marketing",
                                "Engineering"
                            ]
                        },
                        {
                            "headerName": "legalEntity",
                            "headerValues": [
                                "Company XYZ",
                                "Company ABC"
                            ]
                        },
                        {
                            "headerName": "profitCenter",
                            "headerValues": [
                                "PC-101",
                                "PC-102",
                                "PC-103",
                                "PC-104",
                                "PC-105",
                                "PC-106",
                                "PC-107",
                                "PC-108",
                                "PC-109",
                                "PC-110",
                                "PC-111",
                                "PC-112",
                                "PC-113",
                                "PC-114",
                                "PC-115",
                                "PC-116",
                                "PC-117",
                                "PC-118",
                                "PC-119",
                                "PC-120"
                            ]
                        },
                        {
                            "headerName": "division",
                            "headerValues": [
                                "Corporate",
                                "Financial",
                                "Engineering",
                                "Marketing"
                            ]
                        }
                    ],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Hotel Name",
                            "type": "text"
                        },
                        {
                            "name": "Check-In Date",
                            "type": "date"
                        },
                        {
                            "name": "Check-Out Date",
                            "type": "date"
                        },
                        {
                            "name": "City",
                            "type": "text"
                        },
                        {
                            "name": "Room Rates",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Guest Name",
                            "type": "text"
                        },
                        {
                            "name": "Booking Reference No.",
                            "type": "text"
                        }
                    ],
                    "class": [
                        "Motel",
                        "3 star",
                        "4 star",
                        "5 star"
                    ],
                    "allocation_accountLine": "1001",
                    "expenseAllocation_accountLine": "1001"
                },
                {
                    "categoryName": "Meals",
                    "allocation": [
                        {
                            "headerName": "department",
                            "headerValues": [
                                "Finance",
                                "HR",
                                "Marketing",
                                "Engineering"
                            ]
                        },
                        {
                            "headerName": "legalEntity",
                            "headerValues": [
                                "Company XYZ",
                                "Company ABC"
                            ]
                        },
                        {
                            "headerName": "profitCenter",
                            "headerValues": [
                                "PC-101",
                                "PC-102",
                                "PC-103",
                                "PC-104",
                                "PC-105",
                                "PC-106",
                                "PC-107",
                                "PC-108",
                                "PC-109",
                                "PC-110",
                                "PC-111",
                                "PC-112",
                                "PC-113",
                                "PC-114",
                                "PC-115",
                                "PC-116",
                                "PC-117",
                                "PC-118",
                                "PC-119",
                                "PC-120"
                            ]
                        },
                        {
                            "headerName": "division",
                            "headerValues": [
                                "Corporate",
                                "Financial",
                                "Engineering",
                                "Marketing"
                            ]
                        }
                    ],
                    "expenseAllocation": [
                        {
                            "headerName": "department",
                            "headerValues": [
                                "Finance",
                                "HR",
                                "Marketing",
                                "Engineering"
                            ]
                        },
                        {
                            "headerName": "legalEntity",
                            "headerValues": [
                                "Company XYZ",
                                "Company ABC"
                            ]
                        },
                        {
                            "headerName": "profitCenter",
                            "headerValues": [
                                "PC-101",
                                "PC-102",
                                "PC-103",
                                "PC-104",
                                "PC-105",
                                "PC-106",
                                "PC-107",
                                "PC-108",
                                "PC-109",
                                "PC-110",
                                "PC-111",
                                "PC-112",
                                "PC-113",
                                "PC-114",
                                "PC-115",
                                "PC-116",
                                "PC-117",
                                "PC-118",
                                "PC-119",
                                "PC-120"
                            ]
                        },
                        {
                            "headerName": "division",
                            "headerValues": [
                                "Corporate",
                                "Financial",
                                "Engineering",
                                "Marketing"
                            ]
                        }
                    ],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Bill Number",
                            "type": "text"
                        },
                        {
                            "name": "Vendor Name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ],
                    "allocation_accountLine": "1001",
                    "expenseAllocation_accountLine": "1001"
                },
                {
                    "categoryName": "Travel Reimbursement",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "From",
                            "type": "text"
                        },
                        {
                            "name": "To",
                            "type": "text"
                        },
                        {
                            "name": "Distance",
                            "type": "text"
                        },
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Bill Number",
                            "type": "text"
                        },
                        {
                            "name": "Vendor Name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Conference / Event",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Conference Name",
                            "type": "text"
                        },
                        {
                            "name": "Conference Date",
                            "type": "date"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Travel Insurance",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Invoice Date",
                            "type": "date"
                        },
                        {
                            "name": "Policy Type",
                            "type": "text"
                        },
                        {
                            "name": "Insurance Provider",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Baggage",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Airline name",
                            "type": "text"
                        },
                        {
                            "name": "Bill no.",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Tips",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Purpose",
                            "type": "text"
                        },
                        {
                            "name": "Tip Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Miscellaneous",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Bill Number",
                            "type": "text"
                        },
                        {
                            "name": "Vendor Name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Office Supplies",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Bill Number",
                            "type": "text"
                        },
                        {
                            "name": "Vendor Name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Utilities",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Type of Utilities",
                            "type": "text"
                        },
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Bill Number",
                            "type": "text"
                        },
                        {
                            "name": "Vender Name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Insurance",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Policy type",
                            "type": "text"
                        },
                        {
                            "name": "Insurance Provider",
                            "type": "text"
                        },
                        {
                            "name": "Premium Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Marketing and Advertising",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Marketing Campaign Description",
                            "type": "text"
                        },
                        {
                            "name": "Advertising Channels",
                            "type": "text"
                        },
                        {
                            "name": "Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Professional Fees",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Service Provider",
                            "type": "text"
                        },
                        {
                            "name": "Nature of Service",
                            "type": "text"
                        },
                        {
                            "name": "Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Software and Licenses",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Software Name",
                            "type": "text"
                        },
                        {
                            "name": "License Type",
                            "type": "text"
                        },
                        {
                            "name": "License Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Equipment",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Item Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Total Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Repairs and Maintenance",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Description of work",
                            "type": "text"
                        },
                        {
                            "name": "Service provider",
                            "type": "text"
                        },
                        {
                            "name": "Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Legal and Compliance",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Firm name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Service name",
                            "type": "text"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Communication",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Bill no. service provider",
                            "type": "text"
                        },
                        {
                            "name": "Bill date",
                            "type": "date"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Research and Development",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Research Project Description",
                            "type": "text"
                        },
                        {
                            "name": "Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Training",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Training Program Description",
                            "type": "text"
                        },
                        {
                            "name": "Trainer",
                            "type": "text"
                        },
                        {
                            "name": "Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Software Subscriptions",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Software Name",
                            "type": "text"
                        },
                        {
                            "name": "Subscription Type",
                            "type": "text"
                        },
                        {
                            "name": "Subscription Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Client Entertainment",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Total Amount",
                            "type": "text"
                        }
                    ]
                },
                {
                    "categoryName": "Client Gift",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Total Amount",
                            "type": "text"
                        }
                    ]
                }
            ],
            "domestic": [
                {
                    "categoryName": "Flight",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Invoice Date",
                            "type": "date"
                        },
                        {
                            "name": "Flight Number",
                            "type": "text"
                        },
                        {
                            "name": "Departure",
                            "type": "text"
                        },
                        {
                            "name": "Arrival",
                            "type": "text"
                        },
                        {
                            "name": "Airlines name",
                            "type": "text"
                        },
                        {
                            "name": "Travelers Name",
                            "type": "text"
                        },
                        {
                            "name": "Class",
                            "type": "text"
                        },
                        {
                            "name": "Booking Reference Number",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        }
                    ],
                    "class": [
                        "Economy",
                        "Premium Economy",
                        "Business",
                        "First Class"
                    ]
                },
                {
                    "categoryName": "Train",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Invoice Date",
                            "type": "date"
                        },
                        {
                            "name": "Origin",
                            "type": "text"
                        },
                        {
                            "name": "Destination",
                            "type": "text"
                        },
                        {
                            "name": "Travelers Name",
                            "type": "text"
                        },
                        {
                            "name": "Class",
                            "type": "text"
                        },
                        {
                            "name": "Booking Reference No.",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        }
                    ],
                    "class": [
                        "First AC ",
                        "Second AC",
                        "Third AC",
                        "Sleeper",
                        "Chair Car"
                    ]
                },
                {
                    "categoryName": "Bus",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Invoice Date",
                            "type": "date"
                        },
                        {
                            "name": "Origin",
                            "type": "text"
                        },
                        {
                            "name": "Destination",
                            "type": "text"
                        },
                        {
                            "name": "Travelers Name",
                            "type": "text"
                        },
                        {
                            "name": "Class",
                            "type": "text"
                        },
                        {
                            "name": "Booking Reference No.",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        }
                    ],
                    "class": [
                        "Sleeper",
                        "Semi-Sleeper",
                        "Regular"
                    ]
                },
                {
                    "categoryName": "Cab",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Date",
                            "type": "date"
                        },
                        {
                            "name": "Time",
                            "type": "time"
                        },
                        {
                            "name": "Pickup Location",
                            "type": "text"
                        },
                        {
                            "name": "DropOff Location",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Receipt No.",
                            "type": "text"
                        },
                        {
                            "name": "Ride Distance",
                            "type": "text"
                        }
                    ],
                    "class": [
                        "Economy",
                        "Business",
                        "Executive"
                    ]
                },
                {
                    "categoryName": "Cab Rental",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Date",
                            "type": "date"
                        },
                        {
                            "name": "Time",
                            "type": "time"
                        },
                        {
                            "name": "Pickup Location",
                            "type": "text"
                        },
                        {
                            "name": "DropOff Location",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Receipt No.",
                            "type": "text"
                        },
                        {
                            "name": "Ride Distance",
                            "type": "text"
                        }
                    ],
                    "class": [
                        "Economy",
                        "Business",
                        "Executive"
                    ]
                },
                {
                    "categoryName": "Hotel",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Hotel Name",
                            "type": "text"
                        },
                        {
                            "name": "Check-In Date",
                            "type": "date"
                        },
                        {
                            "name": "Check-Out Date",
                            "type": "date"
                        },
                        {
                            "name": "City",
                            "type": "text"
                        },
                        {
                            "name": "Room Rates",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Guest Name",
                            "type": "text"
                        },
                        {
                            "name": "Booking Reference No.",
                            "type": "text"
                        }
                    ],
                    "class": [
                        "Motel",
                        "3 star",
                        "4 star",
                        "5 star"
                    ]
                },
                {
                    "categoryName": "Meals",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Bill Number",
                            "type": "text"
                        },
                        {
                            "name": "Vendor Name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Travel Reimbursement",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "From",
                            "type": "text"
                        },
                        {
                            "name": "To",
                            "type": "text"
                        },
                        {
                            "name": "Distance",
                            "type": "text"
                        },
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Bill Number",
                            "type": "text"
                        },
                        {
                            "name": "Vendor Name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Conference / Event",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Conference Name",
                            "type": "text"
                        },
                        {
                            "name": "Conference Date",
                            "type": "date"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Travel Insurance",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Invoice Date",
                            "type": "date"
                        },
                        {
                            "name": "Policy Type",
                            "type": "text"
                        },
                        {
                            "name": "Insurance Provider",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Baggage",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Airline name",
                            "type": "text"
                        },
                        {
                            "name": "Bill no.",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Tips",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Purpose",
                            "type": "text"
                        },
                        {
                            "name": "Tip Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Miscellaneous",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Bill Number",
                            "type": "text"
                        },
                        {
                            "name": "Vendor Name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Office Supplies",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Bill Number",
                            "type": "text"
                        },
                        {
                            "name": "Vendor Name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Utilities",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Type of Utilities",
                            "type": "text"
                        },
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Bill Number",
                            "type": "text"
                        },
                        {
                            "name": "Vender Name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Insurance",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Policy type",
                            "type": "text"
                        },
                        {
                            "name": "Insurance Provider",
                            "type": "text"
                        },
                        {
                            "name": "Premium Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Marketing and Advertising",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Marketing Campaign Description",
                            "type": "text"
                        },
                        {
                            "name": "Advertising Channels",
                            "type": "text"
                        },
                        {
                            "name": "Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Professional Fees",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Service Provider",
                            "type": "text"
                        },
                        {
                            "name": "Nature of Service",
                            "type": "text"
                        },
                        {
                            "name": "Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Software and Licenses",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Software Name",
                            "type": "text"
                        },
                        {
                            "name": "License Type",
                            "type": "text"
                        },
                        {
                            "name": "License Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Equipment",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Item Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Total Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Repairs and Maintenance",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Description of work",
                            "type": "text"
                        },
                        {
                            "name": "Service provider",
                            "type": "text"
                        },
                        {
                            "name": "Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Legal and Compliance",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Firm name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Service name",
                            "type": "text"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Communication",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Bill no. service provider",
                            "type": "text"
                        },
                        {
                            "name": "Bill date",
                            "type": "date"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Research and Development",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Research Project Description",
                            "type": "text"
                        },
                        {
                            "name": "Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Training",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Training Program Description",
                            "type": "text"
                        },
                        {
                            "name": "Trainer",
                            "type": "text"
                        },
                        {
                            "name": "Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Software Subscriptions",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Software Name",
                            "type": "text"
                        },
                        {
                            "name": "Subscription Type",
                            "type": "text"
                        },
                        {
                            "name": "Subscription Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Client Entertainment",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Total Amount",
                            "type": "text"
                        }
                    ]
                },
                {
                    "categoryName": "Client Gift",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Total Amount",
                            "type": "text"
                        }
                    ]
                }
            ],
            "local": [
                {
                    "categoryName": "Flight",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Invoice Date",
                            "type": "date"
                        },
                        {
                            "name": "Flight Number",
                            "type": "text"
                        },
                        {
                            "name": "Departure",
                            "type": "text"
                        },
                        {
                            "name": "Arrival",
                            "type": "text"
                        },
                        {
                            "name": "Airlines name",
                            "type": "text"
                        },
                        {
                            "name": "Travelers Name",
                            "type": "text"
                        },
                        {
                            "name": "Class",
                            "type": "text"
                        },
                        {
                            "name": "Booking Reference Number",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        }
                    ],
                    "class": [
                        "Economy",
                        "Premium Economy",
                        "Business",
                        "First Class"
                    ]
                },
                {
                    "categoryName": "Train",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Invoice Date",
                            "type": "date"
                        },
                        {
                            "name": "Origin",
                            "type": "text"
                        },
                        {
                            "name": "Destination",
                            "type": "text"
                        },
                        {
                            "name": "Travelers Name",
                            "type": "text"
                        },
                        {
                            "name": "Class",
                            "type": "text"
                        },
                        {
                            "name": "Booking Reference No.",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        }
                    ],
                    "class": [
                        "First AC ",
                        "Second AC",
                        "Third AC",
                        "Sleeper",
                        "Chair Car"
                    ]
                },
                {
                    "categoryName": "Bus",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Invoice Date",
                            "type": "date"
                        },
                        {
                            "name": "Origin",
                            "type": "text"
                        },
                        {
                            "name": "Destination",
                            "type": "text"
                        },
                        {
                            "name": "Travelers Name",
                            "type": "text"
                        },
                        {
                            "name": "Class",
                            "type": "text"
                        },
                        {
                            "name": "Booking Reference No.",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        }
                    ],
                    "class": [
                        "Sleeper",
                        "Semi-Sleeper",
                        "Regular"
                    ]
                },
                {
                    "categoryName": "Cab",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Date",
                            "type": "date"
                        },
                        {
                            "name": "Time",
                            "type": "time"
                        },
                        {
                            "name": "Pickup Location",
                            "type": "text"
                        },
                        {
                            "name": "DropOff Location",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Receipt No.",
                            "type": "text"
                        },
                        {
                            "name": "Ride Distance",
                            "type": "text"
                        }
                    ],
                    "class": [
                        "Economy",
                        "Business",
                        "Executive"
                    ]
                },
                {
                    "categoryName": "Cab Rental",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Date",
                            "type": "date"
                        },
                        {
                            "name": "Time",
                            "type": "time"
                        },
                        {
                            "name": "Pickup Location",
                            "type": "text"
                        },
                        {
                            "name": "DropOff Location",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Receipt No.",
                            "type": "text"
                        },
                        {
                            "name": "Ride Distance",
                            "type": "text"
                        }
                    ],
                    "class": [
                        "Economy",
                        "Business",
                        "Executive"
                    ]
                },
                {
                    "categoryName": "Hotel",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Hotel Name",
                            "type": "text"
                        },
                        {
                            "name": "Check-In Date",
                            "type": "date"
                        },
                        {
                            "name": "Check-Out Date",
                            "type": "date"
                        },
                        {
                            "name": "City",
                            "type": "text"
                        },
                        {
                            "name": "Room Rates",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Guest Name",
                            "type": "text"
                        },
                        {
                            "name": "Booking Reference No.",
                            "type": "text"
                        }
                    ],
                    "class": [
                        "Motel",
                        "3 star",
                        "4 star",
                        "5 star"
                    ]
                },
                {
                    "categoryName": "Meals",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Bill Number",
                            "type": "text"
                        },
                        {
                            "name": "Vendor Name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Travel Reimbursement",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "From",
                            "type": "text"
                        },
                        {
                            "name": "To",
                            "type": "text"
                        },
                        {
                            "name": "Distance",
                            "type": "text"
                        },
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Bill Number",
                            "type": "text"
                        },
                        {
                            "name": "Vendor Name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Conference / Event",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Conference Name",
                            "type": "text"
                        },
                        {
                            "name": "Conference Date",
                            "type": "date"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Travel Insurance",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Invoice Date",
                            "type": "date"
                        },
                        {
                            "name": "Policy Type",
                            "type": "text"
                        },
                        {
                            "name": "Insurance Provider",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Baggage",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Airline name",
                            "type": "text"
                        },
                        {
                            "name": "Bill no.",
                            "type": "text"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Tips",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Purpose",
                            "type": "text"
                        },
                        {
                            "name": "Tip Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Miscellaneous",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Bill Number",
                            "type": "text"
                        },
                        {
                            "name": "Vendor Name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Office Supplies",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Bill Number",
                            "type": "text"
                        },
                        {
                            "name": "Vendor Name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Utilities",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Type of Utilities",
                            "type": "text"
                        },
                        {
                            "name": "Bill Date",
                            "type": "date"
                        },
                        {
                            "name": "Bill Number",
                            "type": "text"
                        },
                        {
                            "name": "Vender Name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Insurance",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Policy type",
                            "type": "text"
                        },
                        {
                            "name": "Insurance Provider",
                            "type": "text"
                        },
                        {
                            "name": "Premium Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Marketing and Advertising",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Marketing Campaign Description",
                            "type": "text"
                        },
                        {
                            "name": "Advertising Channels",
                            "type": "text"
                        },
                        {
                            "name": "Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Professional Fees",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Service Provider",
                            "type": "text"
                        },
                        {
                            "name": "Nature of Service",
                            "type": "text"
                        },
                        {
                            "name": "Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Software and Licenses",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Software Name",
                            "type": "text"
                        },
                        {
                            "name": "License Type",
                            "type": "text"
                        },
                        {
                            "name": "License Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Equipment",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Item Description",
                            "type": "text"
                        },
                        {
                            "name": "Quantity",
                            "type": "number"
                        },
                        {
                            "name": "Unit Cost",
                            "type": "amount"
                        },
                        {
                            "name": "Total Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Repairs and Maintenance",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Description of work",
                            "type": "text"
                        },
                        {
                            "name": "Service provider",
                            "type": "text"
                        },
                        {
                            "name": "Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Legal and Compliance",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Firm name",
                            "type": "text"
                        },
                        {
                            "name": "Description",
                            "type": "text"
                        },
                        {
                            "name": "Service name",
                            "type": "text"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Communication",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Bill no. service provider",
                            "type": "text"
                        },
                        {
                            "name": "Bill date",
                            "type": "date"
                        },
                        {
                            "name": "Tax Amount",
                            "type": "amount"
                        },
                        {
                            "name": "Total Amount",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Research and Development",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Research Project Description",
                            "type": "text"
                        },
                        {
                            "name": "Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Training",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Training Program Description",
                            "type": "text"
                        },
                        {
                            "name": "Trainer",
                            "type": "text"
                        },
                        {
                            "name": "Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Software Subscriptions",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Software Name",
                            "type": "text"
                        },
                        {
                            "name": "Subscription Type",
                            "type": "text"
                        },
                        {
                            "name": "Subscription Cost",
                            "type": "amount"
                        }
                    ]
                },
                {
                    "categoryName": "Client Entertainment",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Total Amount",
                            "type": "text"
                        }
                    ]
                },
                {
                    "categoryName": "Client Gift",
                    "allocation": [],
                    "expenseAllocation": [],
                    "allocationAccountLine": null,
                    "expenseAllcationAccountLine": null,
                    "fields": [
                        {
                            "name": "Total Amount",
                            "type": "text"
                        }
                    ]
                }
            ]
        }}


const allocationLevel1 =
 [
                        {
                            "headerName": "department",
                            "headerValues": [
                                "Finance",
                                "HR",
                                "Marketing",
                                "Engineering"
                            ]
                        },
                        {
                            "headerName": "legalEntity",
                            "headerValues": [
                                "Company XYZ",
                                "Company ABC"
                            ]
                        },
                        {
                            "headerName": "profitCenter",
                            "headerValues": [
                                "PC-101",
                                "PC-102",
                                "PC-103",
                                "PC-104",
                                "PC-105",
                                "PC-106",
                                "PC-107",
                                "PC-108",
                                "PC-109",
                                "PC-110",
                                "PC-111",
                                "PC-112",
                                "PC-113",
                                "PC-114",
                                "PC-115",
                                "PC-116",
                                "PC-117",
                                "PC-118",
                                "PC-119",
                                "PC-120"
                            ]
                        },
                        {
                            "headerName": "division",
                            "headerValues": [
                                "Corporate",
                                "Financial",
                                "Engineering",
                                "Marketing"
                            ]
                        }
                    ]

const selectedAllocations= {"allocations": [
            {
                "headerName": "department",
                "headerValue": "HR"
            },
            {
                "headerName": "legalEntity",
                "headerValue": "Company ABC"
            },
            {
                "headerName": "profitCenter",
                "headerValue": "PC-102"
            },
            {
                "headerName": "division",
                "headerValue": "Financial"
            }
        ]}



const lineItems = 
[ 
    {
    "categoryName": "Flight",
    "allocation": [
        {
            "headerName": "department",
            "headerValues": [
                "Finance",
                "HR",
                "Marketing",
                "Engineering"
            ]
        },
        {
            "headerName": "legalEntity",
            "headerValues": [
                "Company XYZ",
                "Company ABC"
            ]
        },
        {
            "headerName": "profitCenter",
            "headerValues": [
                "PC-101",
                "PC-102",
                "PC-103",
                "PC-104",
                "PC-105",
                "PC-106",
                "PC-107",
                "PC-108",
                "PC-109",
                "PC-110",
                "PC-111",
                "PC-112",
                "PC-113",
                "PC-114",
                "PC-115",
                "PC-116",
                "PC-117",
                "PC-118",
                "PC-119",
                "PC-120"
            ]
        },
        {
            "headerName": "division",
            "headerValues": [
                "Corporate",
                "Financial",
                "Engineering",
                "Marketing"
            ]
        }
    ],
    "expenseAllocation": [
        {
            "headerName": "department",
            "headerValues": [
                "Finance",
                "HR",
                "Marketing",
                "Engineering"
            ]
        },
        {
            "headerName": "legalEntity",
            "headerValues": [
                "Company XYZ",
                "Company ABC"
            ]
        },
        {
            "headerName": "profitCenter",
            "headerValues": [
                "PC-101",
                "PC-102",
                "PC-103",
                "PC-104",
                "PC-105",
                "PC-106",
                "PC-107",
                "PC-108",
                "PC-109",
                "PC-110",
                "PC-111",
                "PC-112",
                "PC-113",
                "PC-114",
                "PC-115",
                "PC-116",
                "PC-117",
                "PC-118",
                "PC-119",
                "PC-120"
            ]
        },
        {
            "headerName": "division",
            "headerValues": [
                "Corporate",
                "Financial",
                "Engineering",
                "Marketing"
            ]
        }
    ],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Invoice Date",
            "type": "date"
        },
        {
            "name": "Flight Number",
            "type": "text"
        },
        {
            "name": "Departure",
            "type": "text"
        },
        {
            "name": "Arrival",
            "type": "text"
        },
        {
            "name": "Airlines name",
            "type": "text"
        },
        {
            "name": "Travelers Name",
            "type": "text"
        },
        {
            "name": "Class",
            "type": "text"
        },
        {
            "name": "Booking Reference Number",
            "type": "text"
        },
        {
            "name": "Total Amount",
            "type": "amount"
        },
        {
            "name": "Tax Amount",
            "type": "amount"
        }
    ],
    "class": [
        "Economy",
        "Premium Economy",
        "Business",
        "First Class"
    ],
    "allocation_accountLine": "1001",
    "expenseAllocation_accountLine": "1001"
},
{
    "categoryName": "Train",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Invoice Date",
            "type": "date"
        },
        {
            "name": "Origin",
            "type": "text"
        },
        {
            "name": "Destination",
            "type": "text"
        },
        {
            "name": "Travelers Name",
            "type": "text"
        },
        {
            "name": "Class",
            "type": "text"
        },
        {
            "name": "Booking Reference No.",
            "type": "text"
        },
        {
            "name": "Total Amount",
            "type": "amount"
        },
        {
            "name": "Tax Amount",
            "type": "amount"
        }
    ],
    "class": [
        "First AC ",
        "Second AC",
        "Third AC",
        "Sleeper",
        "Chair Car"
    ]
},
{
    "categoryName": "Bus",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Invoice Date",
            "type": "date"
        },
        {
            "name": "Origin",
            "type": "text"
        },
        {
            "name": "Destination",
            "type": "text"
        },
        {
            "name": "Travelers Name",
            "type": "text"
        },
        {
            "name": "Class",
            "type": "text"
        },
        {
            "name": "Booking Reference No.",
            "type": "text"
        },
        {
            "name": "Total Amount",
            "type": "amount"
        },
        {
            "name": "Tax Amount",
            "type": "amount"
        }
    ],
    "class": [
        "Sleeper",
        "Semi-Sleeper",
        "Regular"
    ]
},
{
    "categoryName": "Cab",
    "allocation": [
        {
            "headerName": "department",
            "headerValues": [
                "Finance",
                "HR",
                "Marketing",
                "Engineering"
            ]
        },
        {
            "headerName": "legalEntity",
            "headerValues": [
                "Company XYZ",
                "Company ABC"
            ]
        },
        {
            "headerName": "profitCenter",
            "headerValues": [
                "PC-101",
                "PC-102",
                "PC-103",
                "PC-104",
                "PC-105",
                "PC-106",
                "PC-107",
                "PC-108",
                "PC-109",
                "PC-110",
                "PC-111",
                "PC-112",
                "PC-113",
                "PC-114",
                "PC-115",
                "PC-116",
                "PC-117",
                "PC-118",
                "PC-119",
                "PC-120"
            ]
        },
        {
            "headerName": "division",
            "headerValues": [
                "Corporate",
                "Financial",
                "Engineering",
                "Marketing"
            ]
        }
    ],
    "expenseAllocation": [
        {
            "headerName": "department",
            "headerValues": [
                "Finance",
                "HR",
                "Marketing",
                "Engineering"
            ]
        },
        {
            "headerName": "legalEntity",
            "headerValues": [
                "Company XYZ",
                "Company ABC"
            ]
        },
        {
            "headerName": "profitCenter",
            "headerValues": [
                "PC-101",
                "PC-102",
                "PC-103",
                "PC-104",
                "PC-105",
                "PC-106",
                "PC-107",
                "PC-108",
                "PC-109",
                "PC-110",
                "PC-111",
                "PC-112",
                "PC-113",
                "PC-114",
                "PC-115",
                "PC-116",
                "PC-117",
                "PC-118",
                "PC-119",
                "PC-120"
            ]
        },
        {
            "headerName": "division",
            "headerValues": [
                "Corporate",
                "Financial",
                "Engineering",
                "Marketing"
            ]
        }
    ],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Date",
            "type": "date"
        },
        {
            "name": "Time",
            "type": "time"
        },
        {
            "name": "Pickup Location",
            "type": "text"
        },
        {
            "name": "DropOff Location",
            "type": "text"
        },
        {
            "name": "Total Amount",
            "type": "amount"
        },
        {
            "name": "Tax Amount",
            "type": "amount"
        },
        {
            "name": "Receipt No.",
            "type": "text"
        },
        {
            "name": "Ride Distance",
            "type": "text"
        }
    ],
    "class": [
        "Economy",
        "Business",
        "Executive"
    ],
    "allocation_accountLine": "1001",
    "expenseAllocation_accountLine": "1001"
},
{
    "categoryName": "Cab Rental",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Date",
            "type": "date"
        },
        {
            "name": "Time",
            "type": "time"
        },
        {
            "name": "Pickup Location",
            "type": "text"
        },
        {
            "name": "DropOff Location",
            "type": "text"
        },
        {
            "name": "Total Amount",
            "type": "amount"
        },
        {
            "name": "Tax Amount",
            "type": "amount"
        },
        {
            "name": "Receipt No.",
            "type": "text"
        },
        {
            "name": "Ride Distance",
            "type": "text"
        }
    ],
    "class": [
        "Economy",
        "Business",
        "Executive"
    ]
},
{
    "categoryName": "Hotel",
    "allocation": [
        {
            "headerName": "department",
            "headerValues": [
                "Finance",
                "HR",
                "Marketing",
                "Engineering"
            ]
        },
        {
            "headerName": "legalEntity",
            "headerValues": [
                "Company XYZ",
                "Company ABC"
            ]
        },
        {
            "headerName": "profitCenter",
            "headerValues": [
                "PC-101",
                "PC-102",
                "PC-103",
                "PC-104",
                "PC-105",
                "PC-106",
                "PC-107",
                "PC-108",
                "PC-109",
                "PC-110",
                "PC-111",
                "PC-112",
                "PC-113",
                "PC-114",
                "PC-115",
                "PC-116",
                "PC-117",
                "PC-118",
                "PC-119",
                "PC-120"
            ]
        },
        {
            "headerName": "division",
            "headerValues": [
                "Corporate",
                "Financial",
                "Engineering",
                "Marketing"
            ]
        }
    ],
    "expenseAllocation": [
        {
            "headerName": "department",
            "headerValues": [
                "Finance",
                "HR",
                "Marketing",
                "Engineering"
            ]
        },
        {
            "headerName": "legalEntity",
            "headerValues": [
                "Company XYZ",
                "Company ABC"
            ]
        },
        {
            "headerName": "profitCenter",
            "headerValues": [
                "PC-101",
                "PC-102",
                "PC-103",
                "PC-104",
                "PC-105",
                "PC-106",
                "PC-107",
                "PC-108",
                "PC-109",
                "PC-110",
                "PC-111",
                "PC-112",
                "PC-113",
                "PC-114",
                "PC-115",
                "PC-116",
                "PC-117",
                "PC-118",
                "PC-119",
                "PC-120"
            ]
        },
        {
            "headerName": "division",
            "headerValues": [
                "Corporate",
                "Financial",
                "Engineering",
                "Marketing"
            ]
        }
    ],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Bill Date",
            "type": "date"
        },
        {
            "name": "Hotel Name",
            "type": "text"
        },
        {
            "name": "Check-In Date",
            "type": "date"
        },
        {
            "name": "Check-Out Date",
            "type": "date"
        },
        {
            "name": "City",
            "type": "text"
        },
        {
            "name": "Room Rates",
            "type": "amount"
        },
        {
            "name": "Tax Amount",
            "type": "amount"
        },
        {
            "name": "Total Amount",
            "type": "amount"
        },
        {
            "name": "Guest Name",
            "type": "text"
        },
        {
            "name": "Booking Reference No.",
            "type": "text"
        }
    ],
    "class": [
        "Motel",
        "3 star",
        "4 star",
        "5 star"
    ],
    "allocation_accountLine": "1001",
    "expenseAllocation_accountLine": "1001"
},
{
    "categoryName": "Meals",
    "allocation": [
        {
            "headerName": "department",
            "headerValues": [
                "Finance",
                "HR",
                "Marketing",
                "Engineering"
            ]
        },
        {
            "headerName": "legalEntity",
            "headerValues": [
                "Company XYZ",
                "Company ABC"
            ]
        },
        {
            "headerName": "profitCenter",
            "headerValues": [
                "PC-101",
                "PC-102",
                "PC-103",
                "PC-104",
                "PC-105",
                "PC-106",
                "PC-107",
                "PC-108",
                "PC-109",
                "PC-110",
                "PC-111",
                "PC-112",
                "PC-113",
                "PC-114",
                "PC-115",
                "PC-116",
                "PC-117",
                "PC-118",
                "PC-119",
                "PC-120"
            ]
        },
        {
            "headerName": "division",
            "headerValues": [
                "Corporate",
                "Financial",
                "Engineering",
                "Marketing"
            ]
        }
    ],
    "expenseAllocation": [
        {
            "headerName": "department",
            "headerValues": [
                "Finance",
                "HR",
                "Marketing",
                "Engineering"
            ]
        },
        {
            "headerName": "legalEntity",
            "headerValues": [
                "Company XYZ",
                "Company ABC"
            ]
        },
        {
            "headerName": "profitCenter",
            "headerValues": [
                "PC-101",
                "PC-102",
                "PC-103",
                "PC-104",
                "PC-105",
                "PC-106",
                "PC-107",
                "PC-108",
                "PC-109",
                "PC-110",
                "PC-111",
                "PC-112",
                "PC-113",
                "PC-114",
                "PC-115",
                "PC-116",
                "PC-117",
                "PC-118",
                "PC-119",
                "PC-120"
            ]
        },
        {
            "headerName": "division",
            "headerValues": [
                "Corporate",
                "Financial",
                "Engineering",
                "Marketing"
            ]
        }
    ],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Bill Date",
            "type": "date"
        },
        {
            "name": "Bill Number",
            "type": "text"
        },
        {
            "name": "Vendor Name",
            "type": "text"
        },
        {
            "name": "Description",
            "type": "text"
        },
        {
            "name": "Quantity",
            "type": "number"
        },
        {
            "name": "Unit Cost",
            "type": "amount"
        },
        {
            "name": "Tax Amount",
            "type": "amount"
        },
        {
            "name": "Total Amount",
            "type": "amount"
        }
    ],
    "allocation_accountLine": "1001",
    "expenseAllocation_accountLine": "1001"
},
{
    "categoryName": "Travel Reimbursement",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "From",
            "type": "text"
        },
        {
            "name": "To",
            "type": "text"
        },
        {
            "name": "Distance",
            "type": "text"
        },
        {
            "name": "Bill Date",
            "type": "date"
        },
        {
            "name": "Bill Number",
            "type": "text"
        },
        {
            "name": "Vendor Name",
            "type": "text"
        },
        {
            "name": "Description",
            "type": "text"
        },
        {
            "name": "Quantity",
            "type": "number"
        },
        {
            "name": "Unit Cost",
            "type": "amount"
        },
        {
            "name": "Tax Amount",
            "type": "amount"
        },
        {
            "name": "Total Amount",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Conference / Event",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Conference Name",
            "type": "text"
        },
        {
            "name": "Conference Date",
            "type": "date"
        },
        {
            "name": "Total Amount",
            "type": "amount"
        },
        {
            "name": "Tax Amount",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Travel Insurance",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Invoice Date",
            "type": "date"
        },
        {
            "name": "Policy Type",
            "type": "text"
        },
        {
            "name": "Insurance Provider",
            "type": "text"
        },
        {
            "name": "Total Amount",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Baggage",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Airline name",
            "type": "text"
        },
        {
            "name": "Bill no.",
            "type": "text"
        },
        {
            "name": "Total Amount",
            "type": "amount"
        },
        {
            "name": "Tax Amount",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Tips",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Purpose",
            "type": "text"
        },
        {
            "name": "Tip Amount",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Miscellaneous",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Bill Date",
            "type": "date"
        },
        {
            "name": "Bill Number",
            "type": "text"
        },
        {
            "name": "Vendor Name",
            "type": "text"
        },
        {
            "name": "Description",
            "type": "text"
        },
        {
            "name": "Quantity",
            "type": "number"
        },
        {
            "name": "Unit Cost",
            "type": "amount"
        },
        {
            "name": "Tax Amount",
            "type": "amount"
        },
        {
            "name": "Total Amount",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Office Supplies",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Bill Date",
            "type": "date"
        },
        {
            "name": "Bill Number",
            "type": "text"
        },
        {
            "name": "Vendor Name",
            "type": "text"
        },
        {
            "name": "Description",
            "type": "text"
        },
        {
            "name": "Quantity",
            "type": "number"
        },
        {
            "name": "Unit Cost",
            "type": "amount"
        },
        {
            "name": "Tax Amount",
            "type": "amount"
        },
        {
            "name": "Total Amount",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Utilities",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Type of Utilities",
            "type": "text"
        },
        {
            "name": "Bill Date",
            "type": "date"
        },
        {
            "name": "Bill Number",
            "type": "text"
        },
        {
            "name": "Vender Name",
            "type": "text"
        },
        {
            "name": "Description",
            "type": "text"
        },
        {
            "name": "Quantity",
            "type": "number"
        },
        {
            "name": "Unit Cost",
            "type": "amount"
        },
        {
            "name": "Tax Amount",
            "type": "amount"
        },
        {
            "name": "Total Amount",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Insurance",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Policy type",
            "type": "text"
        },
        {
            "name": "Insurance Provider",
            "type": "text"
        },
        {
            "name": "Premium Amount",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Marketing and Advertising",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Marketing Campaign Description",
            "type": "text"
        },
        {
            "name": "Advertising Channels",
            "type": "text"
        },
        {
            "name": "Cost",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Professional Fees",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Service Provider",
            "type": "text"
        },
        {
            "name": "Nature of Service",
            "type": "text"
        },
        {
            "name": "Cost",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Software and Licenses",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Software Name",
            "type": "text"
        },
        {
            "name": "License Type",
            "type": "text"
        },
        {
            "name": "License Cost",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Equipment",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Item Description",
            "type": "text"
        },
        {
            "name": "Quantity",
            "type": "number"
        },
        {
            "name": "Unit Cost",
            "type": "amount"
        },
        {
            "name": "Total Cost",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Repairs and Maintenance",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Description of work",
            "type": "text"
        },
        {
            "name": "Service provider",
            "type": "text"
        },
        {
            "name": "Cost",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Legal and Compliance",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Firm name",
            "type": "text"
        },
        {
            "name": "Description",
            "type": "text"
        },
        {
            "name": "Service name",
            "type": "text"
        },
        {
            "name": "Tax Amount",
            "type": "amount"
        },
        {
            "name": "Total Amount",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Communication",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Bill no. service provider",
            "type": "text"
        },
        {
            "name": "Bill date",
            "type": "date"
        },
        {
            "name": "Tax Amount",
            "type": "amount"
        },
        {
            "name": "Total Amount",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Research and Development",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Research Project Description",
            "type": "text"
        },
        {
            "name": "Cost",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Training",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Training Program Description",
            "type": "text"
        },
        {
            "name": "Trainer",
            "type": "text"
        },
        {
            "name": "Cost",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Software Subscriptions",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Software Name",
            "type": "text"
        },
        {
            "name": "Subscription Type",
            "type": "text"
        },
        {
            "name": "Subscription Cost",
            "type": "amount"
        }
    ]
},
{
    "categoryName": "Client Entertainment",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Total Amount",
            "type": "text"
        }
    ]
},
{
    "categoryName": "Client Gift",
    "allocation": [],
    "expenseAllocation": [],
    "allocationAccountLine": null,
    "expenseAllcationAccountLine": null,
    "fields": [
        {
            "name": "Total Amount",
            "type": "text"
        }
    ]
}]                    


     

        







