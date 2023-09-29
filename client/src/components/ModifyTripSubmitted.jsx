import React from "react";
import { useNavigate } from "react-router-dom";
import { x } from "../assets/icon";

const ModifyTripSubmitted = () => {
  const navigate = useNavigate();

  const redirectContinue = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 backdrop-blur-md"></div>
      <div className="bg-white rounded-lg p-6 shadow-md max-w-md w-full relative">
        <img
          className="absolute top-2 right-2 cursor-pointer"
          alt="X"
          src={x}
          onClick={redirectContinue}
        />
        <div className="text-center">
          <div className="font-semibold text-2xl text-gray-900">
            Trip request submitted
          </div>
          <p className="text-gray-600 mt-2">
            The request for this trip has been sent for approval. You will
            receive an update once it's approved or denied.
          </p>
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={redirectContinue}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyTripSubmitted;
