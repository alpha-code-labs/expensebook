import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { HRCompanyContext } from '../../../components/api/HRCompanyDataContext';
import { line2, left_arrow, logo_with_name, cancel_dot } from '../../../assets/icons';
import Modal from '../../../components/common/Modal';

const CashAdvanceExpenseSettlement = () => {
  const [openLeftModal, setOpenLeftModal] = useState(false); 
  const [openRightModal, setOpenRightModal] = useState(false); 
  const { HRCompanyData } = useContext(HRCompanyContext);
  const [cashAdvanceInput, setCashAdvanceInput] = useState('');
  const [cashExpenseInput, setCashExpenseInput] = useState('');
  const [cashAdvanceOptions, setCashAdvanceOptions] = useState([]);
  const [cashExpenseOptions, setCashExpenseOptions] = useState([]);
  const [cashAdvanceToDelete, setCashAdvanceToDelete] = useState('');
  const [cashExpenseToDelete, setCashExpenseToDelete] = useState('');

  const iconItems = {
    left_arrow: {
      alt: 'Left Arrow',
      src: left_arrow,
    },
    line2: {
      alt: 'Line 2',
      src: line2,
    },
    logo_with_name: {
      alt: 'Logo with Name',
      src: logo_with_name,
    },
    cancel_dot: {
      alt: 'Cancel Dot',
      src: cancel_dot,
    },
  };

  // Merge HRCompanyData with user-added items
  const mergedCashAdvanceItems = [...cashAdvanceOptions, ...(HRCompanyData?.cashAdvanceOptions || [])];
  const mergedCashExpenseItems = [...cashExpenseOptions, ...(HRCompanyData?.cashExpenseOptions || [])];

  const handleLeftInputChange = (e) => {
    setCashAdvanceInput(e.target.value);
  };

  const handleRightInputChange = (e) => {
    setCashExpenseInput(e.target.value);
  };

  const handleLeftAddClick = () => {
    if (cashAdvanceInput.trim() !== '') {
      // Check if the item exists in the backend (HRCompanyData)
      if (!HRCompanyData?.cashAdvanceOptions.includes(cashAdvanceInput)) {
        // If not in the backend, remove from the state
        const updatedLeftItems = cashAdvanceOptions.filter((item) => item !== cashAdvanceInput);
        setCashAdvanceOptions(updatedLeftItems);
      }
      setCashAdvanceOptions([...cashAdvanceOptions, cashAdvanceInput]);
      setCashAdvanceInput('');
    }
  };

  const handleRightAddClick = () => {
    if (cashExpenseInput.trim() !== '') {
      // Check if the item exists in the backend (HRCompanyData)
      if (!HRCompanyData?.cashExpenseOptions.includes(cashExpenseInput)) {
        // If not in the backend, remove from the state
        const updatedRightItems = cashExpenseOptions.filter((item) => item !== cashExpenseInput);
        setCashExpenseOptions(updatedRightItems);
      }
      setCashExpenseOptions([...cashExpenseOptions, cashExpenseInput]);
      setCashExpenseInput('');
    }
  };

  const handleLeftDeleteClick = async (optionValue) => {
    console.log('Deleting left item:', optionValue);
    // Check if the item exists in the backend (HRCompanyData)
    if (!HRCompanyData?.cashAdvanceOptions.includes(optionValue)) {
      // If not in the backend, remove from the state
      const updatedLeftItems = cashAdvanceOptions.filter((item) => item !== optionValue);
      setCashAdvanceOptions(updatedLeftItems);
      return;
    }

    const tenantId = '603f3b07965db634c8769a081'; // Replace with your actual tenantId
    const optionType = 'cashAdvanceOptions';

    try {
      // Make an HTTP DELETE request to your backend route
      const response = await axios.delete(
        `http://localhost:3000/api/hrcompany/${tenantId}/options/${optionType}/${optionValue}`
      );
      console.log(response.data);

      // If the delete request was successful, remove the option from the state
      const updatedLeftItems = cashAdvanceOptions.filter((item) => item !== optionValue);
      setCashAdvanceOptions(updatedLeftItems);
      setOpenLeftModal(false); 
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleRightDeleteClick = async (optionValue) => {
    console.log('Deleting right item:', optionValue);
    // Check if the item exists in the backend (HRCompanyData)
    if (!HRCompanyData?.cashExpenseOptions.includes(optionValue)) {
      // If not in the backend, remove from the state
      const updatedRightItems = cashExpenseOptions.filter((item) => item !== optionValue);
      setCashExpenseOptions(updatedRightItems);
      return;
    }

    const tenantId = '603f3b07965db634c8769a081'; // Replace with your actual tenantId
    const optionType = 'cashExpenseOptions';

    try {
      // Make an HTTP DELETE request to your backend route
      const response = await axios.delete(
        `http://localhost:3000/api/hrcompanies/${tenantId}/options/${optionType}/${optionValue}`
      );
      console.log(response.data);

      // If the delete request was successful, remove the option from the state
      const updatedRightItems = cashExpenseOptions.filter((item) => item !== optionValue);
      setCashExpenseOptions(updatedRightItems);
      setOpenRightModal(false); 
    } catch (error) {
      console.error(error);
      
    }
  };

  const updateOptions = async () => {
    const url = 'http://localhost:3000/api/hrcompanies/603f3b07965db634c8769a081';

    const data = {
      cashAdvanceOptions: mergedCashAdvanceItems,
      cashExpenseOptions: mergedCashExpenseItems,
    };

    try {
      const response = await axios.patch(url, data);
      console.log(response.data);
      
    } catch (error) {
      console.error(error);
      
    }
  };

  return (
    <div className="relative bg-white w-full h-[832px] overflow-hidden text-left text-lg text-ebgrey-500 font-cabin">
      <div className="absolute top-[134px] left-[44px] rounded-xl bg-white w-[1192px] h-[647px] overflow-hidden">
        <div className="absolute top-[40px] left-[40px] flex flex-row items-center justify-start gap-[16px] text-darkslategray-100">
          <img
            className="relative w-6 h-6 overflow-hidden shrink-0"
            alt={iconItems.left_arrow.alt}
            src={iconItems.left_arrow.src}
          />
          <div className="flex flex-col items-start justify-start">
            <div className="relative tracking-[-0.04em] font-semibold">Settlement Configuration</div>
          </div>
        </div>
        <img
          className="absolute top-[103px] left-[535.5px] w-px h-[473.5px]"
          alt={iconItems.line2.alt}
          src={iconItems.line2.src}
        />
        <input
          type="text"
          value={cashExpenseInput}
          onChange={handleRightInputChange}
          className="font-cabin text-sm bg-white absolute top-[157px] left-[737px] rounded-md box-border w-[193px] h-12 flex flex-row items-center justify-start py-2 px-6 border-[1px] border-solid border-ebgrey-200"
          placeholder="Enter CE Option"
        />
        <input
          type="text"
          value={cashAdvanceInput}
          onChange={handleLeftInputChange}
          className="font-cabin text-sm bg-white absolute top-[157px] left-[138px] rounded-md box-border w-[193px] h-12 flex flex-row items-center justify-start py-2 px-6 border-[1px] border-solid border-ebgrey-200"
          placeholder="Enter CA Option"
        />
        <button
          onClick={handleLeftAddClick}
          className="cursor-pointer [border:none] py-4 px-8 bg-eb-primary-blue-500 absolute top-[161px] left-[382px] rounded-13xl h-10 flex flex-row items-center justify-center box-border"
        >
          <div className="relative text-base font-cabin text-white text-left">Add</div>
        </button>
        <button
          onClick={handleRightAddClick}
          className="cursor-pointer [border:none] py-4 px-8 bg-eb-primary-blue-500 absolute top-[165px] left-[969px] rounded-13xl h-10 flex flex-row items-center justify-center box-border"
        >
          <div className="relative text-base font-cabin text-white text-left">Add</div>
        </button>
        <div className="absolute top-[94px] left-[150px] text-[16px] font-medium">
          Cash Advance Options
        </div>
        <div className="absolute top-[94px] left-[737px] text-base font-medium">
          Cash Expense Options
        </div>
        <div
          className={`absolute overflow-auto top-[221px] left-[121px] rounded-2xl bg-white box-border w-[236px] h-[342px] text-darkslategray-200 border-[1px] border-solid border-gainsboro ${
            openRightModal ? 'hidden' : ''
          }`}
        >
          {mergedCashAdvanceItems.map((item, index) => (
            <div
              key={index}
              className="absolute top-[17px] left-[14px] rounded-md bg-white box-border w-[207px] h-12 overflow-hidden flex flex-row items-center justify-between py-3 px-4 border-[1px] border-solid border-darkgray-100"
              style={{ top: `${17 + index * 64}px` }}
            >
              <div className="relative font-medium w-[147px] h-6 shrink-0 truncate">{item}</div>
              <div
                onClick={() => {
                  setCashAdvanceToDelete(item);
                  setOpenLeftModal(true);
                }}
                className="cursor-pointer"
              >
                <img alt={iconItems.cancel_dot.alt} src={iconItems.cancel_dot.src}  className="bg-red-500 rounded-full" />
              </div>
              <Modal
                openModal={openLeftModal}
                onClose={() => setOpenLeftModal(false)}
                cashAdvanceToDelete={cashAdvanceToDelete}
                onDelete={() => {
                  handleLeftDeleteClick(cashAdvanceToDelete);
                  setOpenLeftModal(false);
                }}
              >
                <div className="text-center w-56">
                  <h1>Are you sure?</h1>
                  <p>
                    <span className="text-red-500">*</span>This action will delete the <br />
                    <span className="font-semibold text-eb-primary-blue-500">{cashAdvanceToDelete}</span> option.
                  </p>
                </div>
              </Modal>
            </div>
          ))}
        </div>
        <div
          className={`absolute overflow-auto top-[221px] left-[716px] rounded-2xl bg-white box-border w-[236px] h-[342px] text-darkslategray-200 border-[1px] border-solid border-gainsboro ${
            openLeftModal ? 'hidden' : ''
          }`}
        >
          {mergedCashExpenseItems.map((item, index) => (
            <div
              key={index}
              className="absolute top-[17px] left-[14px] rounded-md bg-white box-border w-[207px] h-12 overflow-hidden flex flex-row items-center justify-between py-3 px-4 border-[1px] border-solid border-darkgray-100"
              style={{ top: `${17 + index * 64}px` }}
            >
              <div className="relative font-medium w-[147px] h-6 shrink-0 truncate">{item}</div>
              <div
                onClick={() => {
                  setCashExpenseToDelete(item);
                  setOpenRightModal(true);
                }}
                className="cursor-pointer"
              >
                <img  alt={iconItems.cancel_dot.alt} src={iconItems.cancel_dot.src}
                 className="bg-red-500 rounded-full" />
              </div>
              <Modal
                openModal={openRightModal}
                onClose={() => setOpenRightModal(false)}
                cashExpenseToDelete={cashExpenseToDelete}
                onDelete={() => {
                  handleRightDeleteClick(cashExpenseToDelete);
                  setOpenRightModal(false);
                }}
              >
                <div className="text-center w-56">
                  <h1>Are you sure?</h1>
                  <p>
                    <span className="text-red-500">*</span>This action will delete the <br />
                    <span className="font-semibold text-eb-primary-blue-500">{cashExpenseToDelete}</span> option.
                  </p>
                </div>
              </Modal>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={updateOptions}
        className="cursor-pointer [border:none] py-4 px-8 bg-eb-primary-blue-500 absolute top-[713px] left-[1005px] rounded-13xl h-12 flex flex-row items-center justify-center box-border"
      >
        <div className="relative text-base font-medium font-cabin text-white text-center inline-block w-[70px] h-5 shrink-0">Save</div>
      </button>
      <div className='pl-16'>
        <img
          className="absolute top-[43px] left-[calc(50% - 536px)] w-[202px] h-[49px] overflow-hidden"
          alt={iconItems.logo_with_name.alt}
          src={iconItems.logo_with_name.src}
        />
      </div>
    </div>
  );
};

export default CashAdvanceExpenseSettlement;

