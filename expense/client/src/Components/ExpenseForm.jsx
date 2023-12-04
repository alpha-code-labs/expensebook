import React, { useState, useEffect } from 'react';

const ExpenseForm = ({ selectedBillType, extractedValues, image, onSave }) => {
  const initialFormFields = {
    type: selectedBillType,
    ...Object.fromEntries(selectedBillType.fields.map((field) => [field.toLowerCase(), extractedValues[field] || ''])),
  };

  const [formFields, setFormFields] = useState(initialFormFields);

  useEffect(() => {
    setFormFields({
      type: selectedBillType,
      ...Object.fromEntries(selectedBillType.fields.map((field) => [field.toLowerCase(), extractedValues[field] || ''])),
    });
  }, [selectedBillType, extractedValues]);

  const handleSave = () => {
    onSave(formFields);
  };

  const handleChange = (fieldName, value) => {
    setFormFields({
      ...formFields,
      [fieldName]: value,
    });
  };

  return (
    <div className="flex flex-wrap">
      {/* Right Side - Image or Upload Button */}
      <div className="w-full lg:w-1/2">
        {image ? (
          <img src={image} alt="Uploaded" className="w-full h-auto" />
        ) : (
          <label htmlFor="upload" className="block w-full h-full border-dashed border-2 border-gray-300 p-4 text-center">
            Upload Image
            <input type="file" id="upload" className="hidden" />
          </label>
        )}
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 p-4">
        <form>
          {Object.keys(formFields).map((fieldName) => (
            <div key={fieldName} className="mb-2">
              <label className="mr-2">{fieldName}:</label>
              <input
                type="text"
                value={formFields[fieldName]}
                onChange={(e) => handleChange(fieldName, e.target.value)}
              />
            </div>
          ))}
          <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
