import React, { useState } from 'react';
import { logo_with_text, arrow_left, chevron_down, cancel_round, cancel } from '../assets/icon';
import Dropdown from '../component/common/Dropdown';
import Button from '../component/common/Button';
import Input from '../component/common/Input';
import MultiSearch from '../component/common/MultiSearch';
import Modal from '../component/common/Modal';
import { currencyTable } from '../../currencyTable';

const Page2 = () => {
  const exchangeValues=currencyTable.currencyTable[0].exchangeValue

  

  const [openModal, setOpenModal] = useState(false);
  const [formDataForModal, setFormDataForModal] = useState(null);
  // const [approverFLAG, setApproverFlag] = useState(true);
  const approverFLAG= false

  const [approvers, setApprovers] = useState([]);
  const handleSelectedApprovers = (selected) => {
    setApprovers(selected);
  };

  const [formData, setFormData] = useState([
    {
      currency: '',
      amount: '',
      mode: '',
    },
  ]);

  const handleAddMore = () => {
    setFormData([...formData, { currency: '', amount: '', mode: '' }]);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedFormData = [...formData];
    updatedFormData[index][name] = value;
    setFormData(updatedFormData);
  };

  // const handleDropdownChange = (index, name, selectedValue) => {
  //   const updatedFormData = [...formData];
  //   updatedFormData[index][name] = selectedValue;
  //   setFormData(updatedFormData);
  // };


  const handleDropdownChange = (index, name, selectedValue) => {
    let currencyCode = selectedValue;
    
    // Check if the selectedValue contains a currency symbol (e.g., "INR ₹")
    if (selectedValue.includes(' ')) {
      currencyCode = selectedValue.split(' ')[0]; // Extract the first part (the currency code)
    }
  
    const updatedFormData = [...formData];
    updatedFormData[index][name] = currencyCode;
    setFormData(updatedFormData);
  };
  

  // const handleSubmit = () => {
  //   // Create the data object to send to the backend
  //   const requestData = {
  //     amountDetails: formData,
  //   };

  //   if (approverFLAG) {
  //     requestData.approvers = approvers;
  //   }

  //   // Now, you can send this requestData to the backend
  //   // You need to implement your API request here (e.g., using fetch or axios).
  //   // Ensure that you send this data to your server endpoint.

  //   console.log(requestData);

  //   // After submitting, you can open the modal
  //   handleModalClick();
  // };

  const handleSubmit = () => {
    // Calculate the total amount
    let totalAmount = 0;
  
    formData.forEach((item) => {
      const { currency, amount } = item;
  
      // Find the exchange rate for the currency
      const currencyData = exchangeValues.find((data) => data.currencyName.toUpperCase() === currency.toUpperCase());
  
      if (currencyData) {
        const exchangeRate = currencyData.value;
        const numericAmount = parseFloat(amount);
        totalAmount += numericAmount * exchangeRate;
      }
    });
  
    // Log the total amount
    console.log('Total Amount:', totalAmount);
  
    // Create the data object to send to the backend
    const requestData = {
      amountDetails: formData,
    };
  
    if (approverFLAG) {
      requestData.approvers = approvers;
    }
  
    // Now, you can send this requestData to the backend
    // You need to implement your API request here (e.g., using fetch or axios).
    // Ensure that you send this data to your server endpoint.
  
    console.log(requestData);
  
    // After submitting, you can open the modal
    handleModalClick();
  };
  

  const handleModalClick = () => {
    setOpenModal(true);
    setFormDataForModal(formData);
  };
 
  const paymentOptions = ['Petty Cash', 'Neft', 'Cheque', 'Prepaid Cards'];
  const currencyOptions = [
    'USD $',
    'EUR €',
    'GBP £',
    'JPY ¥',
    'AUD $',
    'CAD $',
    'CHF Fr',
    'CNY ¥',
    'INR ₹',
    'SGD $',
  ];


  const listOfAllManagers = [
    { name: 'Ashneer Grover', empId: '08hdfh' },
    { name: 'Advika', empId: '08sehf' },
    { name: 'Ajay', empId: '6ghghg' },
    { name: 'Vineeta Singh', empId: '7hdfjh' },
    { name: 'Namita Thapper', empId: '67hgfhg' },
    { name: 'Piyush Banshal', empId: '788hhjh' },
  ];
  
  return (
    <>
    <div className="flex w-full overflow-hidden  h-[939px] px-104 py-43 flex-col items-start gap-41">
      <div className="relative pt-[43px] pb-[439px] pl-[104px] pr-[844px]">
        <div className="flex w-[202px] h-[49px] py-[8px] px-[4px] items-center justify-center">
          <img className="absolute top-[43px] left-[104px] w-[202px] h-[49px]" alt="" src={logo_with_text} />
        </div>
        <div className="flex items-center gap-[16px] font-cabin my-[41px]">
          <img src={arrow_left} alt="Arrow Left" />
          <h1 className="text-[18px] tracking-[-0.04em] not-italic font-semibold">Create Cash Advance</h1>
        </div>
       
          <div>
            <div className="flex h-auto flex-col items-start gap-[16px] mt-[41px]">
              <h2 className="font-cabin text-[16px] not-italic text-[#333] font-medium mb-4 leading-normal">
                Request for cash advance
              </h2>
              
            </div>
            <div className='h-[265px] overflow-auto'>
              
              {formData.map((data, index) => (
                <div key={index} className="flex flex-col gap-6 sm:flex-row text-base mb-4">
                  <div className="w-[175px] h-[48px] sm:w-[133px] ">
                    <Dropdown
                      name="currency"
                      id={`currency-${index}`}
                      value={data.currency}
                      onChange={(selectedValue) => {handleDropdownChange(index, 'currency', selectedValue),console.log(selectedValue)}}
                      icon={chevron_down}
                      label="Select Currency"
                      options={currencyOptions}
                    />
                  </div>
                  <div className="w-[175px] flex flex-col mt-2 sm:mt-0">
                    <Input
                      label='Enter Amount'
                      type="number"
                      id={`amount-${index}`}
                      value={data.amount}
                      onChange={(e) => handleInputChange(index, e)}
                      htmlFor={`amount-${index}`}
                      name="amount"
                    />
                  </div>
                  <div className="h-[48px] w-[175px] sm:w-[133px] ">
                    <Dropdown
                      name="mode"
                      id={`mode-${index}`}
                      value={data.mode}
                      onChange={(selectedValue) => handleDropdownChange(index, 'mode', selectedValue)}
                      icon={chevron_down}
                      label="Select Mode"
                      options={paymentOptions}
                     
                    />
                  </div>
                 
                  <div className="flex items-center justify-center text-center mt-7 ">
                    <img src={cancel} alt="Cancel" height={50} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {approverFLAG === true ? (<div className='mt-7'>
            
            <MultiSearch
              title='Who will Approve this?'
              placeholder="Name's of managers approving this"
              onSelect = {handleSelectedApprovers} // option will be object : {name:'', empId:''}
              currentOption={approvers} // list of currently selected managers
              options={listOfAllManagers}/>
              </div>):""}
          


              <div className="absolute flex flex-row md:flex-row top-[654px] gap-7 xl:gap-[854px]">
          <div className="text-white-100 w-[141px]" onClick={handleAddMore}>
            <Button text="Add more" textAndBgColor="bg-white-100 text-purple-500 border border-purple-500" />
          </div>
          <div onClick={handleModalClick} className="bg-white-100">
            <Button type="button" text="Request" textAndBgColor="bg-purple-500 text-white-100 border" />
          </div>
        </div>
        
      </div>
     
      
    </div>
        <Modal 
        isOpen={openModal} onClose={() => setOpenModal(false)} 
        formData={formDataForModal} 
        approvers={approvers} 
        handleSubmit={handleSubmit}/>


       
     
    
    </>
  );
};

export default Page2;
