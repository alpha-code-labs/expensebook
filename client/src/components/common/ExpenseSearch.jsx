import React, { useState } from 'react';

const reimbursementExpense = [
                                               
  {
    _id: "667bdf0db02acc12783e876f",
    tenantId: "66794853c61cc24ba97b5b0f",
    expenseHeaderId: "667bdf01b043bb2aadcd9303",
    __v: 0,
    companyName: "alpha code labs",
    createdBy: {
      empId: "1001",
      name: "Benjamin Clark",
      _id: "667bdf0db043bb2aadcd9326"
    },
    expenseHeaderNumber: "REAL000001",
    expenseHeaderStatus: "pending settlement",
    expenseHeaderType: "reimbursement",
    expenseLines: [
      {
        lineItemId: "667bdf0db043bb2aadcd9320",
        lineItemStatus: "save",
        expenseLineAllocation: [
          {
            headerName: "department",
            _id: "667bdf0db043bb2aadcd9322",
            headerValue: "Finance"
          },
          {
            headerName: "legalEntity",
            _id: "667bdf0db043bb2aadcd9323",
            headerValue: "Company XYZ"
          },
          {
            headerName: "profitCenter",
            _id: "667bdf0db043bb2aadcd9324",
            headerValue: "PC-101"
          },
          {
            headerName: "division",
            _id: "667bdf0db043bb2aadcd9325",
            headerValue: "Corporate"
          }
        ],
        multiCurrencyDetails: null,
        _id: "667bdf0db043bb2aadcd9321",
        group: {
          limit: 5000,
          group: "Finance Team",
          message: "Benjamin Clark is part of Finance Team. Highest limit found: 5000"
        },
        "Category Name": "Hotel",
        "Hotel Name": "Seven Hills Inn",
        "Check-In Date": "2019-03-26",
        "Check-Out Date": "2019-03-27",
        City: "Behind Mango Market, Tiruchanoor Road, Thanapalli Cross, Chittoor Highway, Tirupati",
        "Room Rates": "761",
        "Tax Amount": "",
        "Total Amount": "761",
        "Guest Name": " Sumesh",
        "Booking Reference No": { "": "" },
        "Payment Method": "",
        "Mode of Payment": "Cash",
        Document: "",
        Currency: {
          countryCode: "IN",
          fullName: "Indian Rupee",
          shortName: "INR",
          symbol: "₹"
        }
      }
    ],
    expenseViolations: [],
    tenantName: "alpha code labs"
  },
  {
    _id: "667bdf0db02acc12783e876f",
    tenantId: "66794853c61cc24ba97b5b0f",
    expenseHeaderId: "667bdf01b043bb2aadcd9303",
    __v: 0,
    companyName: "hello world",
    createdBy: {
      empId: "1001",
      name: "Benjamin Clark",
      _id: "667bdf0db043bb2aadcd9326"
    },
    expenseHeaderNumber: "REAL000001",
    expenseHeaderStatus: "pending settlement",
    expenseHeaderType: "my expense",
    expenseLines: [
      {
        lineItemId: "667bdf0db043bb2aadcd9320",
        lineItemStatus: "saveMy",
        expenseLineAllocation: [
          {
            headerName: "sector45",
            _id: "667bdf0db043bb2aadcd9322",
            headerValue: "Finance"
          },
          {
            headerName: "legalEntity",
            _id: "667bdf0db043bb2aadcd9323",
            headerValue: "Company XYZ"
          },
          {
            headerName: "profitCenter",
            _id: "667bdf0db043bb2aadcd9324",
            headerValue: "PC-101"
          },
          {
            headerName: "division",
            _id: "667bdf0db043bb2aadcd9325",
            headerValue: "Corporaz"
          }
        ],
        multiCurrencyDetails: null,
        _id: "667bdf0db043bb2aadcd9321",
        group: {
          limit: 15456,
          group: "Finance Team",
          message: "Benjamin Clark is part of Finance Team. Highest limit found: 5000"
        },
        "Category Name": "Meals",
        "Hotel Name": "Seven Hills Inn",
        "Check-In Date": "2019-03-26",
        "Check-Out Date": "2019-03-27",
        City: "Behind Mango Market, Tiruchanoor Road, Thanapalli Cross, Chittoor Highway, Tirupati",
        "Room Rates": "761",
        "Tax Amount": "",
        "Total Amount": "761",
        "Guest Name": " Sumesh",
        "Booking Reference No": { "": "" },
        "Payment Method": "",
        "Mode of Payment": "Cash",
        Document: "",
        Currency: {
          countryCode: "IN",
          fullName: "Indian Rupee",
          shortName: "INR",
          symbol: "₹"
        }
      }
    ],
    expenseViolations: [],
    tenantName: "alpha code labs"
  },
  // Copy the second item here...
];

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState(reimbursementExpense);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = reimbursementExpense.filter(expense =>
      JSON.stringify(expense).toLowerCase().includes(term)
    );
    setFilteredExpenses(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <div>
        {filteredExpenses.map(expense => (
          <div key={expense._id} className="p-4 mb-2 border border-gray-200 rounded">
            <h2 className="text-xl font-bold">{expense.companyName}</h2>
            <p>Created by: {expense.createdBy.name}</p>
            <p>Status: {expense.expenseHeaderStatus}</p>
            {/* Render other details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchComponent;
