import React from 'react';

const CustomButton = ({ onClick, label }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 bg-green-500 text-white rounded-md"
    >
      {label}
    </button>
  );
};

export default CustomButton
// Example usage:
// <CustomButton onClick={handleSave} label="Save" />
