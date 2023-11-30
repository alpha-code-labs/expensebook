import { useEffect, useState } from 'react';
import { logo_with_text, arrow_left, chevron_down, cancel } from '../assets/icon';
import Dropdown from '../component/common/Dropdown';
import Button from '../component/common/Button';
import Input from '../component/common/Input';
import MultiSearch from '../component/common/MultiSearch';
import Modal from '../component/common/Modal';
import { currencyTable } from '../../currencyTable'; //currency table fron onboarding
import { createCashAdvanceAPI ,getTravelRequestDetails } from '../utils/api';


const Page2 = () => {
  const exchangeValues=currencyTable.currencyTable[0].exchangeValue
  const [openModal, setOpenModal] = useState(false);
  const [cashAdvanceDataForModal, setCashAdvanceDataForModal] = useState(null);
  const [travelRequestDetails ,setTravelRequestDetails] = useState(null);
  const [approvers, setApprovers] = useState([]);
  const [cashAdvanceData, setCashAdvanceData] = useState([
    {
      currency: '',
      amount: '',
      mode: '',
    },
  ]);

  if(travelRequestDetails){
    var approverFLAG= travelRequestDetails.cashAdvanceFlag
  }

 
  const handleSelectedApprovers = (selected) => {
    setApprovers(selected);
  };



  const handleAddMore = () => {
    setCashAdvanceData([...cashAdvanceData, { currency: '', amount: '', mode: '' }]);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedFormData = [...cashAdvanceData];
    updatedFormData[index][name] = value;
    setCashAdvanceData(updatedFormData);
  };

  const handleDropdownChange = (index, name, selectedValue) => {
    const updatedFormData = [...cashAdvanceData];
    
    if (name === 'currency' && selectedValue.includes(' ')) {
      // For currency options, split the value
      updatedFormData[index][name] = selectedValue.split(' ')[0]; // Extract the currency code
    } else {
      // For other options (e.g., payment options), set the value as is
      updatedFormData[index][name] = selectedValue;
    }
  
    setCashAdvanceData(updatedFormData);
  };
  


//---------currency conversion----------------------------

let totalAmount = 0;

cashAdvanceData.forEach((item) => {
  const { currency, amount } = item;

  // Find the exchange rate for the currency
  const currencyData = exchangeValues.find((data) => data.currencyName.toUpperCase() === currency.toUpperCase());

  if (currencyData) {
    const exchangeRate = currencyData.value;
    const numericAmount = parseFloat(amount);
    totalAmount += numericAmount * exchangeRate;
  } else {
    // If currencyData is not found, assume the currency is already in the desired currency
    totalAmount += parseFloat(amount);
  }
});

// Log the total amount
console.log('Total Amount:', totalAmount);
 //------------------------------------------  
 
 const [showViolationMessage, setShowViolationMessage] = useState(false);

 useEffect(() => {
   if (travelRequestDetails && travelRequestDetails.cashAdvance) {
     const cashAdvance = travelRequestDetails.cashAdvance;
     const cashAdvanceAmount = cashAdvance.amount;
     
     
     if (totalAmount > cashAdvanceAmount) {
       setShowViolationMessage(true);
     } else {
       setShowViolationMessage(false);
     }
   }
 }, [travelRequestDetails, totalAmount]);
  


  const handleSubmit = () => {  
    // Create the data object to send to the backend
    const cashAdvanceViolationsMessage = travelRequestDetails.cashAdvance.violationMessage
    const requestData = {
      amountDetails: cashAdvanceData,
    };
  
    if (approverFLAG) {
      requestData.approvers = approvers;
    }else{
      requestData.approvers=[]
    }
    if(showViolationMessage===true){
      requestData.cashAdvanceViolations=[cashAdvanceViolationsMessage]|| ["string message limit message"]
    }else{
      requestData.cashAdvanceViolations=[];
    }
    
    
    

    const postCashAdvance = async()=>{
      try{
        const response = await createCashAdvanceAPI(requestData);
        console.log({'Respose Data':response.data })
    
    
      }catch(error){
        console.error({'Error':error})
    
      }
     }
  
    console.log(requestData);
    postCashAdvance()

  
    // After submitting, you can open the modal
    handleModalClick();
  };

  ///handle remove 


  

  

  const handleModalClick = () => {
    setOpenModal(true);
    setCashAdvanceDataForModal(cashAdvanceData);
  };

  const handleCashAdvanceLineRemove =(index)=>{
    const updatedFormData= [...cashAdvanceData]
    updatedFormData.splice(index,1)
    setCashAdvanceData(updatedFormData)
   }


  
 
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

useEffect(() => {
  async function fetchData() {
    try {
      const data = await getTravelRequestDetails();
      setTravelRequestDetails(data);
    } catch (error) {
      console.error(error);
    }
  }

  fetchData();
  
}, []
);
console.log(travelRequestDetails);


  

  



    
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
           
              
              {cashAdvanceData.map((data, index) => (
                <div key={index} className="flex flex-col gap-6 sm:flex-row text-base mb-4">
                  <div className="w-[175px] h-[48px] sm:w-[133px]">
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
                  
                 
                  <div className="flex  items-center font-cabin shadow-orange-100 text-red-600 justify-center text-center mt-7 " onClick={handleCashAdvanceLineRemove}>
                    <img src={cancel} alt="Cancel" height={50} />  
                  </div>
                </div>
              ))}
            </div>
          </div>
          {approverFLAG && (<div className='mt-7'>
            
            <MultiSearch
              title='Who will Approve this?'
              placeholder="Name's of managers approving this"
              onSelect = {handleSelectedApprovers} // option will be object : {name:'', empId:''}
              currentOption={approvers} // list of currently selected managers
              options={listOfAllManagers}
              />
              </div>)}
          


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
        cashAdvanceData={cashAdvanceDataForModal} 
        approvers={approvers} 
        handleSubmit={handleSubmit}
        violationMessage={showViolationMessage}
        approverFLAG={approverFLAG}
        />
         </>
  );
};

export default Page2;
