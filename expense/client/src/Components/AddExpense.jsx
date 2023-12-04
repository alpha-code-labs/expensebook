import React, { useState } from "react";
import ModalWithButtons from "./ModalWithButtons"; 

const AddExpense = () => {
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const handleAddExpense = () => {
    // Show the expense modal when the "Add Expense" button is clicked
    setShowExpenseModal(true);
  };

  const closeModal = () => {
    // Close the expense modal
    setShowExpenseModal(false);
  };

  return (
    <div>
      <button onClick={handleAddExpense} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Expense
      </button>
      {/* Render the ModalWithButtons component when showExpenseModal is true */}
      {showExpenseModal && (
        <ModalWithButtons
          showModal={showExpenseModal}
          setShowModal={setShowExpenseModal}
          skipable={true} // Change this based on your requirement
        >
          <button onClick={closeModal}>Close</button>
        </ModalWithButtons>
      )}
    </div>
  );
};

export default AddExpense;
