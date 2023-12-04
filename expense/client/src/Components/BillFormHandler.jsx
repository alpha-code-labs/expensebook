import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from './ExpenseForm';

const BillFormHandler = ({ extractedData, text, selectedBillType, image }) => {
  const [formToDisplay, setFormToDisplay] = useState(null);
  const navigate = useNavigate();

  const filterText = () => {
    const extractedFields = {};

    selectedBillType.fields.forEach((field) => {
      const regex = new RegExp(`${field}:(.*)`, 'i');
      const match = text.match(regex);

      if (match && match[1]) {
        extractedFields[field] = match[1].trim();
      }
    });

    return extractedFields;
  };

  useEffect(() => {
    let timer;
    const startTime = Date.now();

    const extractedFields = filterText();
    const extractedFieldKeys = Object.keys(extractedFields);
    const billTypeFieldKeys = selectedBillType.fields;

    // Check if the extraction time exceeds 5 seconds
    timer = setTimeout(() => {
      if (Date.now() - startTime > 5000) {
        // If partial extraction occurs, autopopulate matched fields
        if (extractedFieldKeys.length > 0) {
          setFormToDisplay(
            <ExpenseForm
              billType={selectedBillType}
              extractedValues={extractedFields}
              onSave={(updatedFields) => {
                console.log('Saving edited form:', updatedFields);
              }}
            />
          );
        } else {
          // If extraction fails, navigate to manual entry form
          navigate('/travel_expense_form',{
            state: { selectedBillType, image },
          });
        }
      }
    }, 5000);

    // Clean up the timer
    return () => clearTimeout(timer);
  }, [text, selectedBillType, navigate]);

  return formToDisplay;
};

export default BillFormHandler;
