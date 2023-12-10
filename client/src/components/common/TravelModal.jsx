import React from "react";

const Modal = ({ onClose, openModal, children, onDelete }) => {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${
        openModal ? "visible bg-black/10" : "invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl shadow-md p-6 transition-all ${
          openModal ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        <div>{children}</div>
        <div className="mt-4 flex justify-center gap-5">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2 items-start"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            Delete
          </button>
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover-bg-gray-400" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
