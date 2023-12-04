import React from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./common/Modal";
import { teenyIconDocSolid, upload, xGray } from "../assets/icon";


const ModalWithButtons = ({ showModal, setShowModal, skipable }) => {
  const navigate = useNavigate();

  const handleUploadFile = () => {
    navigate('/capture_travel_expense');
  };

  const handleEnterExpenseForm = () => {
    navigate('/travel_expense_form');
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Modal showModal={showModal} setShowModal={closeModal} skipable={skipable}>
      <div className="flex justify-end p-4">
        <img src={xGray} alt="Close" className="cursor-pointer w-6 h-6" onClick={closeModal} />
      </div>
      
      <div className="text-center mb-4">
        <p className="text-gray-700 font-semibold">Select your travel expense upload options</p>
      </div>

      <div className="flex justify-center items-center mb-8">
        <button onClick={handleUploadFile} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
          <img className="inline-block w-4 h-4 mr-2" alt="Upload File" src={upload} />
          Upload File
        </button>
        <button onClick={handleEnterExpenseForm} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4">
          <img className="inline-block w-4 h-4 mr-2" alt="Enter Expense Form" src={teenyIconDocSolid} />
          Enter Expense Form
        </button>
      </div>
    </Modal>
  );
};

export default ModalWithButtons;
