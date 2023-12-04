import React, { useState, useEffect, useMemo } from 'react';
import { createScheduler, createWorker } from 'tesseract.js';
import Modal from './common/Modal';
import BillFormHandler from './BillFormHandler';
import ExpenseForm from './ExpenseForm'; 
import { useNavigate } from 'react-router-dom';

const billTypes = [
  {
    type: 'Office Supplies',
    fields: ['Description', 'Quantity', 'Unit Cost', 'Total Cost'],
  },
  {
    type: 'Utilities',
    fields: ['Type of Utility', 'Total Cost'],
  },
  {
    type: 'Insurance',
    fields: ['Policy Type', 'Insurance Provider', 'Premium Amount'],
  },
];

const CaptureExpense = () => {
  const [selectedBill, setSelectedBill] = useState('');
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [isTextExtracted, setIsTextExtracted] = useState(false);
  const [worker, setWorker] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const scheduler = useMemo(() => createScheduler(), []);

  useEffect(() => {
    const loadWorkers = async () => {
      const worker = await createWorker();
      scheduler.addWorker(worker);
      setWorker(worker);
      // Cleanup worker on unmount
      return () => worker.terminate();
    };
    loadWorkers();
  }, [scheduler]);

  const handleSelect = (e) => {
    setSelectedBill(e.target.value);
    setImage(null);
    setText('');
    setModalOpen(false);
  };
 
  useEffect(() => {
    let extractionTimer;

    const extractTextFromImage = async () => {
      if (!selectedBill || !image) return;

      try {
        const { data } = await scheduler.addJob('recognize', image);
        setText(data.text);
        setIsTextExtracted(true);
        setModalOpen(true); // Open modal before navigation
      } catch (error) {
        // Display modal and navigate to ExpenseForm if text extraction fails
        setModalOpen(true);
      }
    };

    if (selectedBill && image) {
      // Initiate text extraction from the uploaded image
      extractionTimer = setTimeout(() => {
        extractTextFromImage();
      }, 5000); // Timeout for 5 seconds
    }

    return () => clearTimeout(extractionTimer);
  }, [selectedBill, image, scheduler]);

  const handleImageUpload = async (e) => {
        const imageFile = e.target.files[0];
        setImage(URL.createObjectURL(imageFile));
        setText(''); // Clear previous text on new image upload
        setIsTextExtracted(false);
    
        if (!selectedBill) {
          // Don't proceed if no bill type is selected
          return;
        }
        
    // Simulating text extraction using Tesseract (replace this with your actual code)
    const result = 'Sample extracted text'; // Replace this with your extracted text

    // Set the extracted text and mark it as extracted
    setText(result);
    setIsTextExtracted(true);

    // Pass the extracted data and bill type to BillFormHandler
    const selectedBillType = billTypes.find((bill) => bill.type === selectedBill);
    const extractedData = {
      billType: selectedBill,
      extractedText: result, // Replace this with the actual extracted text
    };
    
    // Pass the extracted data and bill type to BillFormHandler
    setFormFields(generateFormFields(selectedBillType));
    setModalOpen(true); // Open the modal with the extracted data
  };


  const handleContinue = () => {
    setModalOpen(false); // Close modal before navigation

    if (isTextExtracted) {
      navigate('/bill_form_handler', {
        state: { extractedData,selectedBillType: selectedBill, text, image},
      });
    } else {
      navigate('/travel_expense_form',{
        state: { extractedData,selectedBillType: selectedBill, image },
      });
    }
  };

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-3 bg-white rounded-md shadow-md dark:bg-gray-800">
        <h2 className="text-center text-xl font-semibold text-gray-700 dark:text-white">Capture Expense</h2>

        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200" htmlFor="billType">Bill Type</label>
          <select id="billType" value={selectedBill} onChange={handleSelect} className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring">
            <option value="">Select a bill type</option>
            {billTypes.map((billType, index) => (
              <option key={index} value={billType.type}>{billType.type}</option>
            ))}
          </select>
        </div>

        {selectedBill && (
          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200" htmlFor="upload">Upload Bill</label>
            <input type="file" id="upload" onChange={handleImageUpload} className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring" />
          </div>
        )}
 
        <Modal showModal={isModalOpen} setShowModal={setModalOpen} skipable={true}>
          {isTextExtracted ? (
            <BillFormHandler text={text} fields={formFields} selectedBillType={selectedBill} />
          ) : (
            <ExpenseForm billTypes={billTypes} fileUploaded={image} />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default CaptureExpense;



// import React, { useState, useEffect, useMemo } from 'react';
// import { createScheduler, createWorker } from 'tesseract.js';
// import Modal from './common/Modal';
// import BillFormHandler from './BillFormHandler';

// const billTypes = [
//   {
//     type: 'Office Supplies',
//     fields: ['Description', 'Quantity', 'Unit Cost', 'Total Cost'],
//   },
//   {
//     type: 'Utilities',
//     fields: ['Type of Utility', 'Total Cost'],
//   },
//   {
//     type: 'Insurance',
//     fields: ['Policy Type', 'Insurance Provider', 'Premium Amount'],
//   },
// ];

// const CaptureExpense = () => {
//   const [selectedBill, setSelectedBill] = useState();
//   const [image, setImage] = useState(null);
//   const [text, setText] = useState('');
//   const [worker, setWorker] = useState();
//   const [isTextExtracted, setIsTextExtracted] = useState(false);
//   const [formFields, setFormFields] = useState({});
//   const scheduler = useMemo(() => createScheduler(), []);
//   const [isModalOpen, setModalOpen] = useState(false);

//   useEffect(() => {
//     const loadWorkers = async () => {
//       const worker = await createWorker();
//       scheduler.addWorker(worker);
//       setWorker(worker);
//       // Cleanup worker on unmount
//       return () => worker.terminate();
//     };
//     loadWorkers();
//   }, [scheduler]);

//   const handleSelect = (e) => {
//     setSelectedBill(e.target.value);
//     // Reset image and text on selecting a new bill type
//     setImage(null);
//     setText('');
//     setModalOpen(false); // Close modal on selecting a new bill type
//   };

//   const handleImageUpload = async (e) => {
//     const imageFile = e.target.files[0];
//     setImage(URL.createObjectURL(imageFile));
//     setText(''); // Clear previous text on new image upload
//     setIsTextExtracted(false);

//     if (!selectedBill) {
//       // Don't proceed if no bill type is selected
//       return;
//     }

//     // Simulating text extraction using Tesseract (replace this with your actual code)
//     const result = 'Sample extracted text'; // Replace this with your extracted text

//     // Set the extracted text and mark it as extracted
//     setText(result);
//     setIsTextExtracted(true);

//     // Pass the extracted data and bill type to BillFormHandler
//     const selectedBillType = billTypes.find((bill) => bill.type === selectedBill);
//     const extractedData = {
//       billType: selectedBill,
//       extractedText: result, // Replace this with the actual extracted text
//     };

//     // Pass the extracted data and bill type to BillFormHandler
//     setFormFields(generateFormFields(selectedBillType));
//     setModalOpen(true); // Open the modal with the extracted data
//   };

//   const generateFormFields = (billType) => {
//     const formFields = {};
//     billType.fields.forEach((field) => {
//       formFields[field] = '';
//     });
//     return formFields;
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-3 bg-white rounded-md shadow-md dark:bg-gray-800">
//         <h2 className="text-center text-xl font-semibold text-gray-700 dark:text-white">Capture Expense</h2>

//         <div className="mt-4">
//           <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200" htmlFor="billType">Bill Type</label>
//           <select id="billType" value={selectedBill} onChange={handleSelect} className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring">
//             <option value="">Select a bill type</option>
//             {billTypes.map((billType, index) => (
//               <option key={index} value={billType.type}>{billType.type}</option>
//             ))}
//           </select>
//         </div>

//         {selectedBill && (
//           <div className="mt-4">
//             <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200" htmlFor="upload">Upload Bill</label>
//             <input type="file" id="upload" onChange={handleImageUpload} className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring" />
//           </div>
//         )}

//         <Modal showModal={isModalOpen} setShowModal={setModalOpen} skipable={true}>
//           {formFields && (
//             <BillFormHandler text={text} fields={formFields} selectedBillType={selectedBill} />
//           )}
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default CaptureExpense;
