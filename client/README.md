
// import React,{useState} from "react";
// import { logo_with_name , left_arrow , down_arrow , circle_flags_uk , circle_flags_india} from "../../../assets/icons";
// import Dropdown from '../../../components/common/Dropdown';
// import Input2 from '../../../components/common/Input2';
// import CurrencyInput from "../../../components/common/CurrencyInput";

// const iconItems={
//   left_arrow:{
//     alt:"left arrow",
//     src: left_arrow
//   },
//   down_arrow:{
//     alt:"down arrow",
//     src: down_arrow
//   },
//   circle_flags_uk:{
//     alt:"circle_flags_uk",
//     src: circle_flags_uk
//   },
//   circle_flags_india:{
//     alt:"circle_flags_india",
//     src: circle_flags_india
//   }
//   }

// const currencyOption = ["INR" , "USD" , "AUD" ,"EGP" ,"IQD"]


// const MultiCurrency = () => {
//   const [selectedExchangeCurrency, setselectedExchangeCurrency] = useState(null);
//   const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  

//   // Handle the selection when a currency is selected from the Dropdown
//   const handleCurrencySelect = (currency) => {
//     setselectedExchangeCurrency(currency);
//   };

//   // Handle the click event of the "Add" button
//   // const handleAddButtonClick = () => {
//   //   if (selectedExchangeCurrency) {
//   //     console.log("Selected currency:", selectedExchangeCurrency);
//   //   } else {
//   //     console.log("No currency selected.");
//   //   }
//   // };
//   const handleAddButtonClick = () => {
//     if (selectedExchangeCurrency) {
//       setSelectedCurrencies((prevCurrencies) => [
//         ...prevCurrencies,
//         selectedExchangeCurrency,
//       ]);
//       setselectedExchangeCurrency(null);
//     }
//   };
  
//   return (
//     <div className="relative bg-white w-full h-[939px] overflow-hidden text-left text-[20px] text-ebgrey-500 font-cabin">
//       <div className="absolute top-[149px] left-[92px] rounded-xl bg-white w-[1072px] h-[734px] overflow-hidden">
//         <div className="absolute top-[32px] left-[32px] flex flex-col items-start justify-start gap-[32px]">
//           <div className="flex flex-col items-start justify-start gap-[8px]">
         
//             <div className="relative tracking-[-0.04em] font-semibold flex items-center gap-[16px]">
//   <img
//     className="w-6 h-6 overflow-hidden shrink-0"
//     alt={iconItems.left_arrow.alt}
//     src={iconItems.left_arrow.src}
//   />
//   <div> Currency Center</div>
 
// </div>
//             <div className="relative text-sm tracking-[-0.04em] font-inter text-ebgrey-600 inline-block w-[355px]">
//               Set currency conversion rates manually for your teams.
//             </div>
//           </div>
//           <div className="flex flex-col items-start justify-start gap-[32px] text-base text-eb-primary-blue-500">
//             <div className="rounded-xl bg-eb-primary-blue-50 box-border w-[992px] flex flex-col items-start justify-start p-4 border-[1px] border-solid border-eb-primary-blue-500">
//               <div className="w-[887px] flex flex-col items-start justify-start gap-[12px]">
//                 <div className="relative font-medium">Note</div>
//                 <div className="relative inline-block w-[903px]">
//                   These conversion rates are internal for the company and need
//                   to be updated manually in this version of expensebook.
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-col items-start justify-start gap-[40px] text-sm text-ebgrey-500">
//               <div className="relative box-border w-[993px] h-px border-t-[1px] border-solid border-gainsboro" />
//               <div className="flex flex-row items-start justify-start gap-[88px]">
//                 {/* ///currency added */}
//               <div className="flex flex-row items-center justify-start gap-[24px]">
                
      
//               {selectedCurrencies.map((currency) => (
//     <div key={currency}>
//       <Input2
//         currencyCode={currency}
//         flagIconSrc={iconItems.circle_flags_uk.src}
//         exchangeRate="1"
//       />
//     </div>
//   ))}

//     <div>
//       <CurrencyInput
//         currencyIconSrc={iconItems.circle_flags_india.src}
//         currencySymbol="₹"
//         value="81"
//       />
//     </div>


//                     {/* default currency  close*/}
//                 </div>
                
                
                
                

             
//               {/* ///currency added */}
//               </div>
//               <div className="relative box-border w-[993px] h-px border-t-[1px] border-solid border-gainsboro" />
              
//               {/*-------add currency open--------- */}
//               <div className="flex flex-row items-center justify-start gap-[16px]">
//       <Dropdown
//   title="Add Currency"
//   placeholder="Select currency"
//   options={currencyOption}
//   onSelect={(currency) => {
//     handleCurrencySelect(currency);
   
//   }}
//   currentOption={selectedExchangeCurrency}
// />
            
//             <div className="cursor-pointer rounded-13xl bg-eb-primary-blue-500 h-10 flex flex-row items-center justify-center py-4 px-8 box-border text-base text-white font-cabin" onClick={handleAddButtonClick}>
//         <div className="relative">Add</div>
//       </div>
//         </div>
      
//               {/*-------add currency open--------- */}
//             </div>
//           </div>
//         </div>
//         <div className="absolute top-[654px] left-[842px] rounded-13xl bg-eb-primary-blue-500 h-12 flex flex-row items-center justify-center py-4 px-8 box-border text-center text-base text-white">
//           <div className="relative font-medium inline-block w-[134px] h-5 shrink-0">
//             Save Currencies
//           </div>
//         </div>
//       </div>
//       <img
//         className="absolute top-[68px] left-[calc(50%_-_548px)] w-[202px] h-[49px] overflow-hidden"
//         alt=""
//         src={logo_with_name}
//       />
//     </div>
//   );
// };

// export default MultiCurrency;



import React from "react";
import { logo_with_name , left_arrow , down_arrow , circle_flags_uk , circle_flags_india , cancel_dot} from "../../assets/icons";

const CurrencyInfo = ({ currencyCode,  exchangeRate, currencySymbol, value ,deleteIcon ,onValueChange}) => {

  
  return (
    <>
    <div className="flex flex-row items-center justify-start gap-[24px]">
    <div className="flex flex-row items-center justify-start gap-[16px]">
      <img
        className="relative w-6 h-6 overflow-hidden shrink-0"
        alt={`Flag for`}
        src={circle_flags_uk}
      />
      <div className="flex flex-row items-center justify-start">
        <div className="flex flex-row items-center justify-start gap-[8px]">
          <div className="relative">{currencyCode}</div>
          <div className="relative text-base font-inter text-dark-200">
            {exchangeRate}
          </div>
        </div>
      </div>
    </div>
     <div className="flex flex-row items-start justify-start">
     <div className="flex flex-col items-start justify-start">
       <div className="self-stretch rounded-md bg-white overflow-hidden flex flex-col items-start justify-start py-3 px-4 border-[1px] border-solid border-darkgray">
         <div className="flex flex-row items-center justify-start gap-[32px]">
           <img
             className="relative w-6 h-6 overflow-hidden shrink-0"
             alt="Currency Icon"
             src={circle_flags_india}
           />
           <div className="flex flex-row items-center justify-start gap-[8px]">
             <div className="relative">{currencySymbol}</div>
             <input
               type="text"
               className="w-[20px] relative text-base font-inter text-dark-200 bg-transparent border-none outline-none focus:ring-0"
               value={value}
              //  onChange={(e) => onValueChange(e.target.value)}
              onChange={onValueChange}
             />
           </div>
         </div>
       </div>
     </div>
     <div
                className="flex items-center justify-center cursor-pointer "
              >
                <img  alt="" src={deleteIcon}
                 className="bg-red-500 rounded-full" />
              </div>
   </div>
   </div>
   </>
  );
};

export default CurrencyInfo;




import React,{useEffect, useState} from "react";
import { logo_with_name , left_arrow , down_arrow , circle_flags_uk , circle_flags_india , cancel_dot} from "../../../assets/icons";
import Dropdown from '../../../components/common/Dropdown';
import Input2 from '../../../components/common/Input2';
import axios from "axios";


const iconItems={
  left_arrow:{
    alt:"left arrow",
    src: left_arrow
  },
  down_arrow:{
    alt:"down arrow",
    src: down_arrow
  },
  circle_flags_uk:{
    alt:"circle_flags_uk",
    src: circle_flags_uk
  },
  circle_flags_india:{
    alt:"circle_flags_india",
    src: circle_flags_india
  }
  ,
  cancel_dot:{
    alt:'cancel dot',
    src :cancel_dot
  }
  }

const currencyOption = ["INR" , "USD" , "AUD" ,"EGP" ,"IQD"]




const MultiCurrency = () => {
  const [selectedExchangeCurrency, setselectedExchangeCurrency] = useState(null);
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  const [multiCurrencyData , setMultiCurrencyData]=useState(null);
  const [inputMultiCurrency , setInputMultiCurrency]=useState("81")
  const [error , setError] = useState(null)

  const handleInputMultiCurrency = (e) => {
    setInputMultiCurrency(e.target.value); 
    console.log(inputMultiCurrency)// Update the input value when it changes
  };
 

  // useEffect(() => {
  //   const getMultiCurrencyData = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:3000/api/multicurrency/603f3b07965db634c8769a081'); // Use a config or environment variable for the base URL
  //       setMultiCurrencyData(response.data.multiCurrency);
  //       setError(null);
  //     } catch (error) {
  //       setError({ message: "Error while fetching data" });
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   getMultiCurrencyData();
  // }, []);
 
  
  //   console.log('multicurrency', multiCurrencyData ); 


    //------------------------------

    
    //------------------------------

  
  

  // Handle the selection when a currency is selected from the Dropdown
  const handleCurrencySelect = (currency) => {
    setselectedExchangeCurrency(currency);
  };

  // Handle the click event of the "Add" button
  // const handleAddButtonClick = () => {
  //   if (selectedExchangeCurrency) {
  //     console.log("Selected currency:", selectedExchangeCurrency);
  //   } else {
  //     console.log("No currency selected.");
  //   }
  // };
    const handleValueChange = (currency, newValue) => {
    setSelectedCurrencies((prevCurrencies) => ({
      ...prevCurrencies,
      [currency]: parseFloat(newValue),
    }));
    
  };
  const handleAddButtonClick = () => {
    if (selectedExchangeCurrency) {
      setSelectedCurrencies((prevCurrencies) => [
        ...prevCurrencies,
        selectedExchangeCurrency,
      ]);
      setselectedExchangeCurrency(null);
    }
  };
  



  return (
    <div className="relative bg-white w-full h-[939px] overflow-hidden text-left text-[20px] text-ebgrey-500 font-cabin">
    {/* // <div className="relative bg-white w-full h-[939px] overflow-hidden text-left text-[20px] text-ebgrey-500 font-cabin"> */}
      <div className="absolute top-[149px] left-[92px] rounded-xl bg-white w-[1072px] h-[734px] overflow-hidden">
        <div className="absolute top-[32px] left-[32px] flex flex-col items-start justify-start gap-[32px]">
          <div className="flex flex-col items-start justify-start gap-[8px]">
         
            <div className="relative tracking-[-0.04em] font-semibold flex items-center gap-[16px]">
  <img
    className="w-6 h-6 overflow-hidden shrink-0"
    alt={iconItems.left_arrow.alt}
    src={iconItems.left_arrow.src}
  />
  <div> Currency Center</div>
 
</div>
            <div className="relative text-sm tracking-[-0.04em] font-inter text-ebgrey-600 inline-block w-[355px]">
              Set currency conversion rates manually for your teams.
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-[32px] text-base text-eb-primary-blue-500">
            <div className="rounded-xl bg-eb-primary-blue-50 box-border w-[992px] flex flex-col items-start justify-start p-4 border-[1px] border-solid border-eb-primary-blue-500">
              <div className="w-[887px] flex flex-col items-start justify-start gap-[12px]">
                <div className="relative font-medium">Note</div>
                <div className="relative inline-block w-[903px]">
                  These conversion rates are internal for the company and need
                  to be updated manually in this version of expensebook.
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-[40px] text-sm text-ebgrey-500">
              <div className="relative box-border w-[993px] h-px border-t-[1px] border-solid border-gainsboro" />
             {/* //------------- */}
      <div className="h-[200px] overflow-auto">
        <div className="flex flex-wrap gap-[88px] justify-start items-start">
          {selectedCurrencies.map((currency, index) => (
            <div
              key={`${currency}-${index}`}
              className={`w-[calc(33.33% - 88px)] ${
                index % 3 === 0 ? '' : 'first:ml-0'
              }`}
            >
              <Input2
                currencyCode={currency}
                exchangeRate="1" 
                currencySymbol="₹"
                value={inputMultiCurrency}
                // onValueChange={(newValue) => handleValueChange(currency, newValue)}
                onValueChange={handleInputMultiCurrency}

                deleteIcon={cancel_dot}
              />
            </div>
          ))}
        </div>
      </div>


             {/* //------------- */}
              <div className="relative box-border w-[993px] h-px border-t-[1px] border-solid border-gainsboro" />
              
              {/*-------add currency open--------- */}
              <div className="flex flex-row items-center justify-center gap-[16px]">
      <Dropdown
  title="Add Currency"
  placeholder="Select currency"
  options={currencyOption}
  onSelect={(currency) => {
    handleCurrencySelect(currency);
   
  }}
  currentOption={selectedExchangeCurrency}
  handleAddButtonClick={handleAddButtonClick}
/>

{/*             
            <div className="cursor-pointer rounded-13xl bg-eb-primary-blue-500 h-10 flex flex-row items-center justify-center py-4 px-8 box-border text-base text-white font-cabin" onClick={handleAddButtonClick}>
        <div className="relative">Add</div>
</div> 
*/}
        </div>
      
              {/*-------add currency open--------- */}
            </div>
          </div>
        </div>
        <div className="absolute top-[654px] left-[842px] rounded-13xl bg-eb-primary-blue-500 h-12 flex flex-row items-center justify-center py-4 px-8 box-border text-center text-base text-white">
          <div className="relative font-medium inline-block w-[134px] h-5 shrink-0">
            Save Currencies
          </div>
        </div>
      </div>
      <img
        className="absolute top-[68px] left-[calc(50%_-_548px)] w-[202px] h-[49px] overflow-hidden"
        alt=""
        src={logo_with_name}
      />
    </div>
  );
};

export default MultiCurrency;
