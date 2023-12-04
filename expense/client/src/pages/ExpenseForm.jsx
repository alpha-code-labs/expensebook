import React, { useState, useEffect } from 'react';

const ExpenseForm = () => {
  const [paymentType, setPaymentType] = useState('');
  const [expenseType, setExpenseType] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [date, setDate] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [billFile, setBillFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [billFileURL, setBillFileURL] = useState('');

  // Simulating autopopulated data or edit mode based on some condition
  useEffect(() => {
    // Simulated condition: If there's autopopulated data or an edit request, set edit mode and populate fields
    const autopopulatedData = {
      paymentType: 'Credit Card',
      expenseType: 'Travel',
      vendorName: 'Sample Vendor',
      date: '2023-11-15',
      totalAmount: '250',
      // billFile: someFile, // You can set this if needed
    };

    // Check if autopopulatedData exists
    if (autopopulatedData) {
      setEditMode(true);
      setPaymentType(autopopulatedData.paymentType || '');
      setExpenseType(autopopulatedData.expenseType || '');
      setVendorName(autopopulatedData.vendorName || '');
      setDate(autopopulatedData.date || '');
      setTotalAmount(autopopulatedData.totalAmount || '');
      // setBillFile(autopopulatedData.billFile || null); // Uncomment if needed
    }
  }, []); // Empty dependency array ensures this effect runs once on mount
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setBillFile(file);

    // Display the uploaded file
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setBillFileURL(fileURL);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Logic to handle form submission (sending data to the backend)
    // use Axios or Fetch API to make a POST request to your backend API here
    // Include paymentType, expenseType, vendorName, date, totalAmount, and billFile data
  };

  const handleGoBack = () => {
    
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-3xl font-bold mb-6">Expense Details Form</h1>
    <form
      onSubmit={handleFormSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/2"
    >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Payment Type:
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
              type="text"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              disabled={!editMode} // Disable if not in edit mode
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Expense Type:
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
              type="text"
              value={expenseType}
              onChange={(e) => setExpenseType(e.target.value)}
              disabled={!editMode} // Disable if not in edit mode
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Vendor Name:
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              disabled={!editMode} // Disable if not in edit mode
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Date:
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={!editMode} // Disable if not in edit mode
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Total Amount:
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
              type="text"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              disabled={!editMode} // Disable if not in edit mode
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Bill File:
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
              type="file"
              onChange={(e) => setBillFile(e.target.files[0])}
              disabled={!editMode} // Disable if not in edit mode
            />
          </label>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            disabled={!editMode}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleGoBack}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
          >
            Back
          </button>
        </div>
      </form>
      {/* Display area for the uploaded bill file */}
      {billFileURL && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Uploaded Bill</h2>
          <img src={billFileURL} alt="Uploaded Bill" className="max-w-xs" />
        </div>
      )}
    </div>
  );
};

export default ExpenseForm;
