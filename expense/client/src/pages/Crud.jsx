// const handleSubmit =()=>{
//   console.log("handle submit AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries", formValues);
// }


import React, { useState, useRef, useEffect } from 'react';

const Crud = () => {
  const formFields = [
    { name: 'Bill Date', type: 'date' },
    { name: 'Bill Number', type: 'numeric' },
    { name: 'PickUp', type: 'text' },
    { name: 'DropOff', type: 'text' },
    { name: 'City', type: 'text' },
    { name: 'Quantity', type: 'numeric' },
    { name: 'Unit Cost', type: 'numeric' },
    { name: 'Tax Amount', type: 'numeric' },
    { name: 'Total Amount', type: 'numeric' },
  ];

  const autocompleteRefs = {};

  const initialFormValues = Object.fromEntries(formFields.map((field) => [field.name, '']));
  const [formValues, setFormValues] = useState(initialFormValues);

  const handleChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handlePlaceSelect = (name, place) => {
    const formattedAddress = place.formatted_address;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: formattedAddress,
    }));
  };

  const initAutocomplete = (name) => {
    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRefs[name].current);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      handlePlaceSelect(name, place);
    });
  };

  const loadGoogleMapsScript = () => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places`;
    script.defer = true;
    script.async = true;
    script.onload = () => {
      // Initialize Autocomplete for specified fields
      formFields.forEach((field) => {
        if (field.name==='PickUp' || field.name ==="DropOff") {
          initAutocomplete(field.name);
        }
      });
    };
    document.head.appendChild(script);
  };

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);
  const handleSubmit =()=>{
    console.log("handle submit AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries", formValues);
  }

  return (
    <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
      {formFields.map((field) => (
        <div key={field.name} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {field.name}
          </label>
          {field.type === 'date' && (
            <input
              type="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              value={formValues[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          )}
          {field.type === 'numeric' && (
            <input
              type="number"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              value={formValues[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          )}
          {field.type === 'text' && (
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              value={formValues[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              ref={autocompleteRefs[field.name] || (autocompleteRefs[field.name] = useRef())}
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
};

export default Crud;



// import React, { useState, useRef } from 'react';

// const Crud = () => {
//   const formFields = [
//     { name: 'Bill Date', type: 'date' },
//     { name: 'Bill Number', type: 'numeric' },
//     { name: 'PickUp', type: 'text' },
//     { name: 'DropOff', type: 'text' },
//     { name: 'City', type: 'text' },
//     { name: 'Quantity', type: 'numeric' },
//     { name: 'Unit Cost', type: 'numeric' },
//     { name: 'Tax Amount', type: 'numeric' },
//     { name: 'Total Amount', type: 'numeric' },
//   ];

//   const autocompleteRefTo = useRef(null);
//   const autocompleteRefFrom = useRef(null);

//   const initialFormValues = Object.fromEntries(formFields.map((field) => [field.name, '']));
//   const [formValues, setFormValues] = useState(initialFormValues);

//   const handleChange = (name, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [name]: value,
//     }));
//   };

//   const handlePlaceSelect = (name, place) => {
//     const addressComponents = place.address_components;
//     const formattedAddress = place.formatted_address;

//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [name]: formattedAddress,
//     }));
//   };

//   const initAutocomplete = (name, ref) => {
//     const autocomplete = new window.google.maps.places.Autocomplete(ref.current);

//     autocomplete.addListener('place_changed', () => {
//       const place = autocomplete.getPlace();
//       handlePlaceSelect(name, place);
//     });
//   };

//   const loadGoogleMapsScript = () => {
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places`;
//     script.defer = true;
//     script.async = true;
//     script.onload = () => {
//       if (autocompleteRefTo.current) {
//         initAutocomplete('To', autocompleteRefTo);
//       }
//       if (autocompleteRefFrom.current) {
//         initAutocomplete('From', autocompleteRefFrom);
//       }
//     };
//     document.head.appendChild(script);
//   };

//   React.useEffect(() => {
//     loadGoogleMapsScript();
//   }, []);

//   const isGooglePlaceField = (name) => ['To', 'From','PickUp','DropOff'].includes(name);

//   const handleSubmit =()=>{
//     console.log("handle submit AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries", formValues);
//   }

//   return (
//     <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
//       {formFields.map((field) => (
//         <div key={field.name} className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             {field.name}
//           </label>
//           {field.type === 'date' && (
//             <input
//               type="date"
//               className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
//               value={formValues[field.name]}
//               onChange={(e) => handleChange(field.name, e.target.value)}
//             />
//           )}
//           {field.type === 'numeric' && (
//             <input
//               type="number"
//               className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
//               value={formValues[field.name]}
//               onChange={(e) => handleChange(field.name, e.target.value)}
//             />
//           )}
//           {field.type === 'text' && isGooglePlaceField(field.name) && (
//             <input
//               type="text"
//               className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
//               value={formValues[field.name]}
//               onChange={(e) => handleChange(field.name, e.target.value)}
//               ref={field.name === 'To' ? autocompleteRefTo : autocompleteRefFrom}
//             />
//           )}
//           {field.type === 'text' && !isGooglePlaceField(field.name) && (
//             <input
//               type="text"
//               className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
//               value={formValues[field.name]}
//               onChange={(e) => handleChange(field.name, e.target.value)}
//             />
//           )}
//         </div>
//       ))}
//       <button
//         type="submit"
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//       >
//         Submit
//       </button>
//     </form>
//   );
// };

// export default Crud;


// import React, { useState } from 'react';

// const Crud = () => {
//   const formFields = [
//     { name: 'Bill Date', type: 'date' },
//     { name: 'Bill Number', type: 'numeric' },
//     { name: 'To', type: 'text' },
//     { name: 'From', type: 'text' },
//     { name: 'Quantity', type: 'numeric' },
//     { name: 'Unit Cost', type: 'numeric' },
//     { name: 'Tax Amount', type: 'numeric' },
//     { name: 'Total Amount', type: 'numeric' },
//   ];

//   // Initialize formValues state with default empty strings for each field
//   const initialFormValues = Object.fromEntries(formFields.map((field) => [field.name, '']));
//   const [formValues, setFormValues] = useState(initialFormValues);

//   const handleChange = (name, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission with the values in formValues
//     console.log('Form Values:', formValues);
//   };

//   return (
//     <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
//       {formFields.map((field) => (
//         <div key={field.name} className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">
//             {field.name}
//           </label>
//           {field.type === 'date' && (
//             <input
//               type="date"
//               className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
//               value={formValues[field.name]}
//               onChange={(e) => handleChange(field.name, e.target.value)}
//             />
//           )}
//           {field.type === 'numeric' && (
//             <input
//               type="number"
//               className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
//               value={formValues[field.name]}
//               onChange={(e) => handleChange(field.name, e.target.value)}
//             />
//           )}
//           {field.type === 'text' && (
//             <input
//               type="text"
//               className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
//               value={formValues[field.name]}
//               onChange={(e) => handleChange(field.name, e.target.value)}
//             />
//           )}
//         </div>
//       ))}
//       <button
//         type="submit"
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//       >
//         Submit
//       </button>
//     </form>
//   );
// };

// export default Crud;




// import React, { useEffect, useState } from 'react';
// import { currencyTable } from '../dummyData/requiredDummy';
// import Upload from '../components/common/Upload';
// import Error from '../components/common/Error';
// import Input from '../components/common/Input';
// import { generateRandomId } from '../utils/handyFunctions';
// import { cancel, house_simple, lock_icon, modify, validation_sym } from '../assets/icon';
// import {   postExpenseLineItems, postMultiCurrencyForTravelExpenseApi } from '../utils/api';
// import Button from '../components/common/Button';
// import { titleCase } from '../utils/handyFunctions';


// //this you can use when value update is combine like form submitted at a time
// ///setLineItemDetails(({...lineItemDetails,[e.target.name]:e.target.value}))
// //this call back using when you are passing value one by one individually like setErrors
// ///setLineItemDetails((prevItems)({...prevItems,[e.target.name]:e.target.value}))


// ///look at the last chat gpt code in office email


// const Crud = ({openLineItemForm,setLineItemForm ,setMessage,setShowPopup,cancelFlag,newExpenseReport,travelCategoryAllocation,tenanId}) => {


//    const [data,setData]=useState(null)
//    const [isLoading,setIsLoading]=useState(true)
//    const [loadingErrMsg, setLoadingErrorMsg]=useState(null)
//    const [editId,setEditId]=useState(-1)


//    const category = ['food','travel','taxes','cab']
//    const allocationHeaderOption=['Cost Center','Legal Entity','Department']
//    const [currencyTableData,setCurrencyTableData]=useState(null)
//    const [isPersonalFlag,setIsPersonalFlag]=useState(false)
//    const [selectedFile , setSelectedFile]=useState("")
//    const [fileSelected,setFileSelected]=useState("")
//    const [lineItemArray, setLineItemArray]=useState([])
//    const [selectedAllocations, setSelectedAllocations] = useState([]);
//    const [convertBtnVisible , setConvertBtnVisible]=useState(false)
//    //currencyName converter
//    const [convertedAmount, setConvertedAmount]=useState(0)
   

//    ///----------
//    const initialState={ 
//     category: "",
//     currencyName: "",
//     totalAmount: "",
//     convertedTotalAmount:"",
//     isPersonalExpense: false,
//     personalAmount: "",
//     convertedPersonalAmount:"",
//     document: "fileName.jpg",
//     nonPersonalAmount:"",
//     convertedNonPersonalAmount:"",
//     allocations:[
//       // {
//       //   headerName:"",
//       //   valueName:""
//       // },
//     ]
//    }
   
// ///for currencyName convert handle

// //this data has to come and u can map here and show where you want okkay
// //add setError for this seperate show loaading on button setState
// // {conversionResult && conversionResult.currencyFlag ? (
// //   <div>
// //     <p>Data converted successfully:</p>
// //     {/* Display the converted data here */}
// //     {/* For example, if data is an array, you can map through it and display the values */}
// //     {conversionResult.data.map((item) => (
// //       <div key={item.id}>{/* Your rendering logic for each item */}</div>
// //     ))}
// //   </div>
// // ) : (
// //   <p>No data available</p>
// // )}



//    const handleConverter =async () => {
//     const {totalAmount,personalAmount,currencyName}=lineItemDetails  
//    const nonPersonalAmount = totalAmount-personalAmount
//    const convertDetails={
//       totalAmount: totalAmount,
//       personalAmount:personalAmount,
//       currencyName:currencyName,
//       nonPersonalAmount: nonPersonalAmount 
//   }


//     ///api 
//     try{
//       setIsLoading(true)
//       const response= await postMultiCurrencyForTravelExpenseApi(tenanId, convertDetails)
//       if(response.error){
//         setLoadingErrorMsg(response.error.message)
//         setCurrencyTableData(null)
//       }else{
//         setLoadingErrorMsg(null)
//         setCurrencyTableData(response.data) //here it war response
//       }
//     }catch(error){
//       setLoadingErrorMsg(error.message)
//     } finally{
//       setIsLoading(false);
//     }
//   };

  
//     const [errorMsg,setErrorMsg]=useState({
//       category: {set:false,msg:""},
//       totalAmount: {set:false,msg:""},
//       currencyName: {set:false,msg:""},
//       isPersonalExpense: {set:false,msg:""},
//       personalAmount: {set:false,msg:""},
//       document: {set:false,msg:""},
      
//     })
//     const handleIsPersonalFlag =()=>{
//       if (isPersonalFlag===true){
//          setLineItemDetails({...lineItemDetails,personalAmount:""})
//         return setIsPersonalFlag(false);
//         }else{
//           setLineItemDetails({...lineItemDetails,isPersonalExpense:true})
//           return setIsPersonalFlag(true)
//           }
//     }
//   const [lineItemDetails, setLineItemDetails]=useState(initialState)




//   ///for get multicurrency 


//   useEffect(()=>{
  
//     setCurrencyTableData(currencyTable.currencyTable)

//   },[])


//     ///for get multicurrency  end 


//   // const handleInputChange=(e)=>{
//   //   const {name ,value}=e.target
    
//   //   setErrorMsg((prevErrors)=>({...prevErrors,[name]:{set:false,msg:""}}))

//   //   setLineItemDetails(({...lineItemDetails,[name]:value}))


//   //   if(isPersonalFlag && name === "personalAmount" && parseFloat(value) > parseFloat(lineItemDetails.totalAmount) ){
//   //     setErrorMsg((prevErrors)=>({...prevErrors,personalAmount:{set:true,msg:"totalAmount should be less or equal to totalAmount"}}))
//   //   }
    
//   //   console.log(e.target.value)
//   //   console.log(e.target.name)
    
//   // }



//   const handleInputChange = (e) => {

//     // const { tenantId, tripId, empId } = route
//     // const { expenseReportId, totalExpenseAmount, totalAlreadyBookedExpenseAmount, totalPersonalAmount, remainingCash, expenseLines } = req.body;

//     const { name, value } = e.target;
//     const defaultCurrency="EURO"
//     setErrorMsg((prevErrors) => ({ ...prevErrors, [name]: { set: false, msg: "" } }));
//     setLineItemDetails((prevState) => ({ ...prevState, [name]: value }));

//     ///this will be get value when fetching data from Create Expense useeffect
  
//     if (name === "currencyName" && (lineItemDetails.currencyName === "" && lineItemDetails.currencyName !== defaultCurrency)) {
//       setConvertBtnVisible(true);
//     }
//     if (
//       isPersonalFlag &&
//       name === "personalAmount" &&
//       parseFloat(value) > parseFloat(lineItemDetails.totalAmount)
//     ) {
//       setErrorMsg((prevErrors) => ({
//         ...prevErrors,
//         personalAmount: {
//           set: true,
//           msg: "totalAmount should be less or equal to totalAmount",
//         },
//       }));
//     }
  
//     console.log(e.target.value);
//     console.log(e.target.name);
//   };
  
//   //----------------------
//    useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const { data, error } = awai();

//         if (error) {
//           setLoadingErrorMsg(error.message);
//         } else {
//           setData(data);
//         }
//       } catch (error) {
//         setLoadingErrorMsg(error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);
//   console.log(data)

// //--------------------------------------------

//   const handleModification = (id) => {
//     const selectedItem = data.find((item) => item.id === id);
//     setLineItemDetails({
//       ...initialState,
//       ...selectedItem,
//       category: titleCase(selectedItem.category),
//     });
//     setIsPersonalFlag(selectedItem.isPersonalExpense);
//     setSelectedFile(""); // Assuming you want to clear the file selection during modification
//     setEditId(id);
//   };

//   const handleEdit = (id) => {
//     handleModification(id);
//   };

//   const handleDeleteItem=(id)=>{
//     deleteExpenseLineItemsApi(id)
//   }
 
//   // const handleEdit=(id)=>{
//   //   setEditId(id)
//   // }
//  //-------------------------------------------------

//  const  validation=(field)=>{
//     return field ===''
//   }
// ///for allocation
//   // const handleAllocationChange = (headerName, selectedValue) => {
//   //   setSelectedAllocations((prevAllocations) => [
//   //     ...prevAllocations,
//   //     { headerName, valueName: selectedValue },
//   //   ]);
//   // };
//   const handleAllocationChange = (headerName, selectedValue) => {
//     // Check if the allocation already exists
//     const isDuplicate = lineItemDetails.allocations.some(
//       (allocation) => allocation.headerName === headerName && allocation.valueName === selectedValue
//     );
  
//     if (!isDuplicate) {
//       // Add the new allocation
//       setLineItemDetails((prevState) => ({
//         ...prevState,
//         allocations: [
//           ...prevState.allocations,
//           { headerName, valueName: selectedValue },
//         ],
//       }));
//     }
//   };
  
  
//   const handleSave=async()=>{
//     setLineItemDetails((prevState) => ({
//       ...prevState,
//       allocations: selectedAllocations,
//     }));
//     if (editId !== -1) {
//       // Handle modification save
//       const updatedData = data.map((item) =>
//         item.id === editId ? { ...item, ...lineItemDetails } : item
//       );
//       setData(updatedData);
//       setEditId(-1);
//     } else { ///for saving

//     const newItineraryId = generateRandomId()
//   setLineItemDetails((prevState)=>({...prevState,id:newItineraryId}))
//     let isFormValid=true
//     if(fileSelected && selectedFile){
//       setLineItemDetails(((preveState)=>({...preveState,document:selectedFile}))) 
//     }
//     //validation
//     if(validation(lineItemDetails.category)){
//       isFormValid=false
//       setErrorMsg((prevErrors)=>({...prevErrors, category: {set: true, msg: "Select the category"}}));
//     }
//     console.log(errorMsg?.category.set && errorMsg?.category.msg)
//     if(validation(lineItemDetails.totalAmount)){
//       isFormValid=false
//        setErrorMsg((prevErrors)=>({...prevErrors, totalAmount:{set:true,msg:"Select the totalAmount"}}))
      
//     }
//     if(validation(lineItemDetails.currencyName)){
//     isFormValid=false
//        setErrorMsg((prevErrors)=>({...prevErrors, currencyName:{set:true,msg:"Select the currencyName"}}))
      
//     }
//     if(validation(lineItemDetails.personalAmount) && isPersonalFlag ){
//       isFormValid=false
//       setErrorMsg((prevErrors)=>({...prevErrors,personalAmount:{set:true,msg:"Enter personal totalAmount"}}))
     
//   }
//   if(isPersonalFlag && parseFloat(lineItemDetails.personalAmount)>parseFloat(lineItemDetails.totalAmount)){
//     isFormValid=false
//     setErrorMsg((prevErrors)=>(
//       { ...prevErrors , personalAmount : {set: true, msg: "Should be greater than or equal to Expense totalAmount"}})) 
// }
      
    
//     if(validation(lineItemDetails.document) ){
//     isFormValid=false
//        setErrorMsg( (prevErrors)=>({...prevErrors,document:{set:true,msg:"Select the document"}}))
//        console.log(errorMsg.document.msg)
       
//     }
//     if (!isFormValid) {
//       console.log("Please check for any missing fields");
//       return; // Do not proceed with form submission
//     }
//     handleConverter()
//     console.log("data with arg header",lineItemDetails)
    
//     try{
//       setIsLoading(true)
//       const {error} = await postExpenseLineItems(lineItemDetails)
//       if (error) {
//         setLoadingErrorMsg(error.message);
//       }
//       setShowPopup(true)
//       setMessage("Line Item has been added successfully.")
//       setTimeout(()=>{
//         setShowPopup(false)
//         location.reload()
//       },5000)

//     }catch(error){
//       setLoadingErrorMsg(error.message)
//       setTimeout(()=>{
//         setShowPopup(false)
//       },3000)
      
//     }finally{
//       setIsLoading(false)
//     }
    


//       console.log(lineItemDetails)
//       console.log(lineItemArray)


//     setLineItemDetails(initialState)
//     // setSelectedFile(null)
//     // setFileSelected(null)
//     setIsPersonalFlag(false)
//     setErrorMsg(errorMsg)
//     setConvertedAmount(0)} 
//     setLineItemForm(false)
//   }


//   return (
//    <>
//    {/* instead of this has to show loading */}
//       {isLoading &&  <h2>Loading2....</h2>} 
//       {loadingErrMsg && <div>{loadingErrMsg}</div>}

//       <div>
//       {data && (

// data.map((item,index)=>(
//   item.id == editId ?  
//   ////edit form
//   <>
//   <form className='bg-b-gray'>
//         <div className=' flex flex-row border border-black justify-between'>
// <div className='h-10'>

// <select name='category' value={lineItemDetails.category || ''} onChange={handleInputChange}>
// <option value="">select category</option>
//             {travelCategoryAllocation && travelCategoryAllocation.map((item ,index)=>(
              
//               <React.Fragment key={index}>
               
//                 <option value={item.categoryName}>{item.categoryName}</option>
//               </React.Fragment>
//             ))}
//           </select>

//           {errorMsg.category?.set   && <h2 className='text-red-500'>{errorMsg.category.msg}</h2>}
// </div>
     
//           {/* {errorMsg.category?.set && <h2 className='text-red-500'>{errorMsg.category}</h2> } */}
// <div>
//           <select name='currencyName' value={lineItemDetails.currencyName} onChange={handleInputChange}>
//            {currencyTableData && currencyTableData[0].exchangeValue.map((item,index)=>(
//             <React.Fragment key={index}>
//               <option>{item.currencyName}</option>
//               </React.Fragment>
//            ))}
//           </select>
//           {errorMsg.currencyName?.set   && <h2 className='text-red-500'>{errorMsg.currencyName.msg}</h2>}

//           </div>          

// <div className='h-8'>
// <Input error={errorMsg.totalAmount} name='totalAmount' title='totalAmount' type='number' value={lineItemDetails.totalAmount || ""} onChange={handleInputChange}/>
// </div>






//        <div onClick={handleIsPersonalFlag}>
//         {
//           isPersonalFlag ? <h1 className='text-green-500 bg-blue-400'>True</h1> : <h1 className='text-red-500'>False</h1>
//         }
//        </div>

//        {isPersonalFlag &&  <Input name='personalAmount'  value={lineItemDetails.personalAmount} onChange={handleInputChange} error={errorMsg.personalAmount}/>}

       
//     {/* ////allocationHeader   */}

//     {lineItemDetails.category &&
//   travelCategoryAllocation
//     .find((category) => category.categoryName === lineItemDetails.category)
//     ?.allocations.map((item, index) => (
//       <React.Fragment key={index}>
//         <div className='flex flex-col'>
//           <h2>{item.headerName}</h2>
//           <select
//             onChange={(e) => handleAllocationChange(item.headerName, e.target.value)}
//           >
//             {item.headerValues.map((value, valueIndex) => (
//               <option key={valueIndex} value={value}>
//                 {value}
//               </option>
//             ))}
//           </select>
//         </div>
//       </React.Fragment>
//     ))
// }
//       <Upload  
//       selectedFile={selectedFile}
//       setSelectedFile={setSelectedFile}
//       fileSelected={fileSelected}
//       setFileSelected={setFileSelected}/>


//       {errorMsg.document?.set && !selectedFile    && <h2 className='text-red-500'>{errorMsg.document.msg}</h2>}
     

//       {
//         fileSelected  ? <h1 className='text-blue-500'>{ selectedFile && selectedFile.name}</h1> : null 
//       }
         
// <div>
//       {convertBtnVisible && <Button onClick={handleConverter}  text="Convert"/>}
  
//   <h2 className='text-red-400'> Final Amount </h2>
// </div>
// <div>
// <Button onClick={handleSave}  text="Save"/>
// </div>


 
//         </div>
      

       
//  </form>
//       </>
//   ////edit form
//   :
  
//   <React.Fragment key={index}>
//      <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
//  <img src={house_simple} className='w-4 h-4' />
//  <div className="w-full flex sm:block">
//      <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
//          <div className="w-[100px]">
//             Sr.{index + 1}   
//          </div>
//          <div className="flex-1">
//              Category   
//          </div>
//          <div className="flex-1" >
//              Currency     
//          </div>
//          <div className="flex-1" >
//              Bill Amount     
//          </div>

//          <div className="flex-1">
//                 Is Personal Expense?
//          </div>
//          <div className="flex-1">
//             Expense Allocation
//          </div>
//          <div className="flex-1">
//              Bills
//          </div>
//      </div>

//      <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
//      <div className="w-[100px]">
           
//          </div>
//          <div className="flex-1">
//              {titleCase(item.category)}     
//          </div>
//          <div className="flex-1">
//              {(item.currencyName)}     
//          </div>
//          <div className="flex-1 flex-col">
//              {/* {date} */}
//              <h2>Bill Amt- {(item.totalAmount)} </h2>
//              <h2>Converted Amt-{(item.convertedTotalAmount)}</h2>
//          </div>
//          <div className="flex-1">
//              {item.isPersonalExpense ? 'Yes':'No'}
//          </div>
         
         
//          <div className='flex-1 flex-col'>

//              <img src={house_simple} alt='document'/>
//              {(item?.document?.name??"file not found")}
//          </div>
//      </div>
//  </div>

 
// <div className='flex flex-1 justify-center items-end gap-4 pt-3 px-3'>
//   {cancelFlag ? 
//   <div onClick={()=>handleDeleteItem(item.id)}   className='flex items-center  justify-center w-6 h-6 bg-[#FFC2C6] rounded-full cursor-pointer' >
//  <img src={cancel} alt='cancel' width={20} height={20} />
// </div> :
// (newExpenseReport && 
// <>
// {/* <div onClick={()=>handleDeleteItem(item.id)}   className='flex items-center  justify-center w-6 h-6 bg-[#FFC2C6] rounded-full cursor-pointer' >
//  <img src={lock_icon} alt='cancel' width={16} height={16} />
// </div> */}
// <div onClick={()=>handleEdit(item.id)}  className='flex cursor-pointer items-center justify-center w-6 h-6 bg-purple-50 rounded-full '>
//  <img src={modify} alt='modify' width={12} height={12} />
// </div>
// </>)}


// </div>

//  </div>
//   </React.Fragment>


// ))

// )}
          
          
//           <LineItemForm 
//           handleAllocationChange={handleAllocationChange}
//           lineItemDetails={lineItemDetails}
//           setLineItemDetails ={setLineItemDetails}
//           generateId={generateRandomId}
//           initialState={initialState}
//           handleInputChange={handleInputChange}
//           handleConverter={handleConverter}
//           errorMsg={errorMsg}
//           setErrorMsg={setErrorMsg}
//           category={category}
//           handleIsPersonalFlag={handleIsPersonalFlag}
//           allocationHeaderOption={allocationHeaderOption}
//   currencyTableData={currencyTableData}
//   setCurrencyTableData={setCurrencyTableData}
//   isPersonalFlag={isPersonalFlag}
//   setIsPersonalFlag={setIsPersonalFlag}
//   selectedFile={selectedFile}
//   setSelectedFile={setSelectedFile}
//   fileSelected={fileSelected}
//   setFileSelected={setFileSelected}
//   lineItemArray={lineItemArray}
//   setLineItemArray={setLineItemArray}
//   convertedAmount={convertedAmount}
//   setConvertedAmount={setConvertedAmount}
//   handleSave={handleSave}
//   convertBtnVisible={convertBtnVisible}
//   travelCategoryAllocation={travelCategoryAllocation}
//   openLineItemForm={openLineItemForm}


//           />
//         {/* <div>Data: {JSON.stringify(data)}</div> */}
//         </div>
      
     
      
//       </>
//   )
// }

// export default Crud


// const LineItemForm = ({
//   openLineItemForm,
//   lineItemDetails,
//   handleInputChange,
//   currencyTableData,
//   isPersonalFlag,
//   convertBtnVisible,
//   selectedFile,
//   setSelectedFile,
//   fileSelected,
//   setFileSelected,
//   convertedAmount,
//   travelCategoryAllocation,
//   handleAllocationChange,
//   handleSave,
//   errorMsg,
//   handleConverter,
//   handleIsPersonalFlag,
// }) => {
//   return (
//     <div>
//       {openLineItemForm && (
//         <form>
//           <div className='h-32 flex flex-row border border-black justify-between items-center'>
//             <div>
//              {travelCategoryAllocation && travelCategoryAllocation.length<=0 ? 
//               <div className='h-8'>
//               <Input
//                 error={errorMsg.category}
//                 name='category'
//                 title='category'
//                 type='text'
//                 value={lineItemDetails.category || ''}
//                 onChange={handleInputChange}
//               />
//               <h2 className='text-red-400'>Converted Amount</h2>
//             </div>

             
//              :(<select name='category' value={lineItemDetails.category || ''} onChange={handleInputChange}>
//                 <option value=''>Select Category</option>
//                 {travelCategoryAllocation &&
//                   travelCategoryAllocation.map((item, index) => (
//                     <React.Fragment key={index}>
//                       <option value={item.categoryName}>{item.categoryName}</option>
//                     </React.Fragment>
//                   ))}
//               </select>)}
//               {errorMsg.category?.set && <h2 className='text-red-500'>{errorMsg.category.msg}</h2>}
//             </div>

//             <div>
//               <select name='currencyName' value={lineItemDetails.currencyName} onChange={handleInputChange}>
//                 {currencyTableData &&
//                   currencyTableData[0].exchangeValue.map((item, index) => (
//                     <React.Fragment key={index}>
//                       <option>{item.currencyName}</option>
//                     </React.Fragment>
//                   ))}
//               </select>
//               {errorMsg.currencyName?.set && <h2 className='text-red-500'>{errorMsg.currencyName.msg}</h2>}
//             </div>

//             <div className='h-8'>
//               <Input
//                 error={errorMsg.totalAmount}
//                 name='totalAmount'
//                 title='totalAmount'
//                 type='number'
//                 value={lineItemDetails.totalAmount || ''}
//                 onChange={handleInputChange}
//               />
//               <h2 className='text-red-400'>Converted Amount</h2>
//             </div>

//             <div>
//               {convertedAmount > 0 && (
//                 <div>
//                   <h2>Converted Bill Amount</h2>
//                   <p>
//                     {lineItemDetails.currencyName}: {convertedAmount}
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div onClick={handleIsPersonalFlag}>
//               {isPersonalFlag ? (
//                 <h1 className='text-green-500 bg-blue-400'>True</h1>
//               ) : (
//                 <h1 className='text-red-500'>False</h1>
//               )}
//             </div>

//             {isPersonalFlag && (
//               <div>
//                 <Input
//                   name='personalAmount'
//                   value={lineItemDetails.personalAmount}
//                   onChange={handleInputChange}
//                   error={errorMsg.personalAmount}
//                 />
//                 <h2 className='text-red-400'>Converted Amount</h2>
//               </div>
//             )}

//             {lineItemDetails.category &&
//               travelCategoryAllocation
//                 .find((category) => category.categoryName === lineItemDetails.category)
//                 ?.allocations.map((item, index) => (
//                   <React.Fragment key={index}>
//                     <div className='flex flex-col'>
//                       <h2>{item.headerName}</h2>
//                       <select onChange={(e) => handleAllocationChange(item.headerName, e.target.value)}>
//                         {item.headerValues.map((value, valueIndex) => (
//                           <option key={valueIndex} value={value}>
//                             {value}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </React.Fragment>
//                 ))}
            
//             <Upload selectedFile={selectedFile} setSelectedFile={setSelectedFile} fileSelected={fileSelected} setFileSelected={setFileSelected}/>
//             {errorMsg.document?.set && !selectedFile && <h2 className='text-red-500'>{errorMsg.document.msg}</h2>}

//             {fileSelected ? (
//               <h1 className='text-blue-500'>{selectedFile && selectedFile?.name}</h1>
//             ) : null}

//             <div>
//               {convertBtnVisible && <Button onClick={handleConverter} text='Convert' />}
//               <h2 className='text-red-400'>Final Amount</h2>
//             </div>

//             <div>
//               <Button onClick={handleSave} text='Save' />
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };


















// // const LineItemForm = ({openLineItemForm, lineItemDetails,handleInputChange ,

// //   currencyTableData,

// //   isPersonalFlag,
// //   convertBtnVisible,
// //   selectedFile,
// //   setSelectedFile,
// //   fileSelected,
// //   setFileSelected,
// //   convertedAmount,
// //   travelCategoryAllocation,
// //   handleAllocationChange,
// // handleSave ,
// // errorMsg,
// // handleConverter,
// // handleIsPersonalFlag}) => {



 


  


// //   // console.log(currencyTableData[0].exchangeValue)
// //   // const showErrorMsg = errorMsg?.set 

// //   return (
// //     <div>
// //      {openLineItemForm && <form>
// //         <div className='h-32 flex flex-row border border-black justify-between items-center'>
          

// //           {/* <select name='category' value={lineItemDetails.category || ''} onChange={handleInputChange}>
// //             {category.map((item ,index)=>(
// //               <React.Fragment key={index}>
// //                 <option value={item}>{item}</option>
// //               </React.Fragment>
// //             ))}
// //           </select> */}
// //           <div>
// //            <select name='category' value={lineItemDetails.category || ''} onChange={handleInputChange}>
// //            <option value="">select category</option>
// //             {travelCategoryAllocation && travelCategoryAllocation.map((item ,index)=>(
// //               <React.Fragment key={index}>
                 
// //                 <option value={item.categoryName}>{item.categoryName}</option>
// //               </React.Fragment>
// //             ))}
// //           </select>

// //           {errorMsg.category?.set   && <h2 className='text-red-500'>{errorMsg.category.msg}</h2>}
// //           </div>
          
// //           {/* {errorMsg.category?.set && <h2 className='text-red-500'>{errorMsg.category}</h2> } */}
// // <div>
// //           <select name='currencyName' value={lineItemDetails.currencyName} onChange={handleInputChange}>
// //            {currencyTableData && currencyTableData[0].exchangeValue.map((item,index)=>(
// //             <React.Fragment key={index}>
// //               <option >{item.currencyName}</option>
// //               </React.Fragment>
// //            ))}
// //           </select>
// //           {errorMsg.currencyName?.set   && <h2 className='text-red-500'>{errorMsg.currencyName.msg}</h2>}
// //           </div>

// // <div className='h-8'>
// // <Input error={errorMsg.totalAmount} name='totalAmount' title='totalAmount' type='number' value={lineItemDetails.totalAmount || ""} onChange={handleInputChange}/>
// // <h2 className='text-red-400'> Converted Amount </h2>
// // </div>


// // {/* {errorMsg?.totalAmount?.set && <h2 className='text-red-500'>{errorMsg?.totalAmount.msg}</h2>} */}


// // <div> 
  
// //  { convertedAmount>0 && 
// //  <div>
// // <h2> Conveted bill Amount</h2>
// //    <p>{lineItemDetails.currencyName}: {convertedAmount }</p>
// //  </div>
   
// //  }

// // </div>



// //        <div onClick={handleIsPersonalFlag}>
// //         {
// //           isPersonalFlag ? <h1 className='text-green-500 bg-blue-400'>True</h1> : <h1 className='text-red-500'>False</h1>
// //         }
// //        </div>

// //        {isPersonalFlag &&  
// //        <div>
// //        <Input name='personalAmount'  value={lineItemDetails.personalAmount} onChange={handleInputChange} error={errorMsg.personalAmount}/>
// //        <h2 className='text-red-400'> Converted Amount </h2>
// //        </div>
// //        }

// // {lineItemDetails.category &&
// //   travelCategoryAllocation
// //     .find((category) => category.categoryName === lineItemDetails.category)
// //     ?.allocations.map((item, index) => (
// //       <React.Fragment key={index}>
// //         <div className='flex flex-col'>
// //           <h2>{item.headerName}</h2>
// //           <select
// //             onChange={(e) => handleAllocationChange(item.headerName, e.target.value)}
// //           >
// //             {item.headerValues.map((value, valueIndex) => (
// //               <option key={valueIndex} value={value}>
// //                 {value}
// //               </option>
// //             ))}
// //           </select>
// //         </div>
// //       </React.Fragment>
// //     ))
// // }
// //       {/* <select name='allocationHeader' value={lineItemDetails.allocationHeader} onChange={handleInputChange}>
// //         {
// //           allocationHeaderOption.map((item,index)=>(
// //             <React.Fragment key={index}> <option>{item}</option></React.Fragment>
// //           ))
// //         }
       

// //       </select>
// //       {errorMsg.allocationHeader?.set   && <h2 className='text-red-500'>{errorMsg.allocationHeader.msg}</h2>} */}

// //       <Upload  
// //       selectedFile={selectedFile}
// //       setSelectedFile={setSelectedFile}
// //       fileSelected={fileSelected}
// //       setFileSelected={setFileSelected}/>
// //       {errorMsg.document?.set && !selectedFile    && <h2 className='text-red-500'>{errorMsg.document.msg}</h2>}
     

// //       {
// //         fileSelected  ? <h1 className='text-blue-500'>{ selectedFile && selectedFile.name}</h1> : null 
// //       }

// //   <div>
// //       {convertBtnVisible && <Button onClick={handleConverter}  text="Convert"/>}
// //       <h2 className='text-red-400'> Final Amount </h2>
// //   </div>
   


// //   <div>
// // <Button onClick={handleSave}  text="Save"/>
// // </div>
 
// //         </div>
      

       
// //       </form>}
      
// //     </div>
// //   )
// // }
































// // import React, { useEffect, useState } from 'react';
// // import { currencyTable } from '../dummyData/requiredDummy';
// // import Upload from '../components/common/Upload';
// // import Input from '../components/common/Input';
// // import { generateRandomId } from '../utils/handyFunctions';
// // import { cancel, house_simple, modify, validation_sym } from '../assets/icon';
// // import , postExpenseLineItems } from '../utils/tripApi';
// // import Button from '../components/common/Button';
// // import { titleCase } from '../utils/handyFunctions';

// // //this you can use when value update is combine like form submitted at a time
// // ///setLineItemDetails(({...lineItemDetails,[e.target.name]:e.target.value}))
// // //this call back using when you are passing value one by one individually like setErrors
// // ///setLineItemDetails((prevItems)({...prevItems,[e.target.name]:e.target.value}))



// // const Crud = () => {
// //    const [data,setData]=useState(null)
// //    const [isLoading,setIsLoading]=useState(true)
// //    const [loadingErrMsg, setLoadingErrorMsg]=useState(null)
// //    const [editId,setEditId]=useState(-1)


// //    const category = ['food','travel','taxes','cab']
// //    const allocationHeaderOption=['Cost Center','Legal Entity','Department']
// //    const [currencyTableData,setCurrencyTableData]=useState(null)
// //    const [isPersonalFlag,setIsPersonalFlag]=useState(false)
// //    const [selectedFile , setSelectedFile]=useState("")
// //    const [fileSelected,setFileSelected]=useState("")
// //    const [lineItemArray, setLineItemArray]=useState([])
 
// //    //currencyName converter
// //    const [convertedAmount, setConvertedAmount]=useState(0)

// //    ///----------
// //    const initialState={ 
  
// //     category: "",
// //     currencyName: "",
// //     totalAmount: "",
// //     convertedTotalAmount:"",
// //     isPersonalExpense: false,
// //     personalAmount: "",
// //     convertedPersonalAmount:"",
// //     document: "fileName.jpg",
// //     allocationHeader: "",
// //     convertedNonPersonalAmount:""
   
// //    }

// //    const handleConverter = () => {
// //     const exchangeValue = currencyTableData[0].exchangeValue.find(
// //       (exchange) => exchange.currencyName === lineItemDetails.currencyName
// //     );
// //     const convertedTotalAmount = lineItemDetails.totalAmount * exchangeValue.value;
// //     if (exchangeValue) {
// //       setConvertedAmount(convertedTotalAmount || "");
// //       setLineItemDetails((prevState) => ({ ...prevState, convertedTotalAmount }));
  
// //       let convertedPersonalAmount = (lineItemDetails.personalAmount || 0) * exchangeValue.value;
  
// //       if (isPersonalFlag && exchangeValue) {
// //         setLineItemDetails((prevState) => ({ ...prevState, convertedPersonalAmount }));
// //       }
  
// //       const convertedNonPersonalAmount =
// //        convertedTotalAmount - (convertedPersonalAmount || 0);
// //       console.log(convertedNonPersonalAmount);
  
// //       setLineItemDetails((prevState) => ({ ...prevState, convertedNonPersonalAmount }));
// //     }
// //   };
  
// //     const [errorMsg,setErrorMsg]=useState({
// //       category: {set:false,msg:""},
// //       totalAmount: {set:false,msg:""},
// //       currencyName: {set:false,msg:""},
// //       isPersonalExpense: {set:false,msg:""},
// //       personalAmount: {set:false,msg:""},
// //       document: {set:false,msg:""},
// //       allocationHeader: {set:false,msg:""} 
// //     })
  
  
  
// //     const handleIsPersonalFlag =()=>{
// //       if (isPersonalFlag===true){
// //          setLineItemDetails({...lineItemDetails,personalAmount:""})
// //         return setIsPersonalFlag(false);
// //         }else{
// //           setLineItemDetails({...lineItemDetails,isPersonalExpense:true})
// //           return setIsPersonalFlag(true)
// //           }
// //     }
// //   const [lineItemDetails, setLineItemDetails]=useState(initialState)


// //   useEffect(()=>{
    
// //     setCurrencyTableData(currencyTable.currencyTable)
   
    
// //   },[])
// //   const handleInputChange=(e)=>{
// //     const {name ,value}=e.target
    
// //     setErrorMsg((prevErrors)=>({...prevErrors,[name]:{set:false,msg:""}}))

// //     setLineItemDetails(({...lineItemDetails,[name]:value}))


// //     if(isPersonalFlag && name === "personalAmount" && parseFloat(value) > parseFloat(lineItemDetails.totalAmount) ){
// //       setErrorMsg((prevErrors)=>({...prevErrors,personalAmount:{set:true,msg:"totalAmount should be less or equal to totalAmount"}}))
// //     }

// // console.log("Value:", value);
// // console.log("LineItemDetails Amount:", lineItemDetails.totalAmount);
// // console.log("Condition:", parseFloat(value) > parseFloat(lineItemDetails.totalAmount));
    
// //     console.log(e.target.value)
// //     console.log(e.target.name)
    
// //   }
// //   //----------------------





// //    useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setIsLoading(true);
// //         const { data, error } = awai();

// //         if (error) {
// //           setLoadingErrorMsg(error.message);
// //         } else {
// //           setData(data);
// //         }
// //       } catch (error) {
// //         setLoadingErrorMsg(error.message);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, []);
// //   console.log(data)


// //   const handleEdit=(id)=>{
// //     setEditId(id)
// //   }

// //  //-------------------------------------------------

// //  const  validation=(field)=>{
// //     return field ===''
// //   }
  
// //   const handleSave=()=>{
// //     const newItineraryId = generateId()
// //   setLineItemDetails((prevState)=>({...prevState,id:newItineraryId}))
// //     let isFormValid=true
// //     if(fileSelected && selectedFile){
// //       setLineItemDetails(((preveState)=>({...preveState,document:selectedFile}))) 
// //     }
// //     //validation
// //     if(validation(lineItemDetails.category)){
// //       isFormValid=false
// //       setErrorMsg((prevErrors)=>({...prevErrors, category: {set: true, msg: "Select the category"}}));
// //     }
// //     console.log(errorMsg?.category.set && errorMsg?.category.msg)
// //     if(validation(lineItemDetails.totalAmount)){
// //       isFormValid=false
// //        setErrorMsg((prevErrors)=>({...prevErrors, totalAmount:{set:true,msg:"Select the totalAmount"}}))
      
// //     }
// //     if(validation(lineItemDetails.currencyName)){
// //     isFormValid=false
// //        setErrorMsg((prevErrors)=>({...prevErrors, currencyName:{set:true,msg:"Select the currencyName"}}))
      
// //     }
// //     if(validation(lineItemDetails.personalAmount) && isPersonalFlag ){
// //       isFormValid=false
// //       setErrorMsg((prevErrors)=>({...prevErrors,personalAmount:{set:true,msg:"Enter personal totalAmount"}}))
     
// //   }
// //   if(isPersonalFlag && parseFloat(lineItemDetails.personalAmount)>parseFloat(lineItemDetails.totalAmount)){
// //     isFormValid=false
// //     setErrorMsg((prevErrors)=>(
// //       { ...prevErrors , personalAmount : {set: true, msg: "Should be greater than or equal to Expense totalAmount"}})) 
// // }
      
// //     if(validation(lineItemDetails.allocationHeader)){
// //     isFormValid=false
// //        setErrorMsg((prevErrors)=>({...prevErrors, allocationHeader:{set:true,msg:"Select the allocation header"}}))

// //     }
// //     if(validation(lineItemDetails.document) ){
// //     isFormValid=false
// //        setErrorMsg( (prevErrors)=>({...prevErrors,document:{set:true,msg:"Select the document"}}))
// //        console.log(errorMsg.document.msg)
       
// //     }
// //     if (!isFormValid) {
// //       console.log("Please check for any missing fields");
// //       return; // Do not proceed with form submission
// //     }
// //     handleConverter()
   
    
// //     postExpenseLineItems(lineItemDetails)
// // ///this is for storing object in array for mapping 
// //     // const {category,
// //     //   totalAmount
// //     //   ,currencyName
// //     //   ,isPersonalExpense
// //     //   ,personalAmount
// //     //   ,document
// //     //   ,allocationHeader}=lineItemDetails

// //       setLineItemArray({...lineItemArray,lineItemDetails})

// //       console.log(lineItemDetails)
// //       console.log(lineItemArray)


// //     setLineItemDetails(initialState)
// //     // setSelectedFile(null)
// //     // setFileSelected(null)
// //     setIsPersonalFlag(false)
// //     setErrorMsg(errorMsg)
// //     setConvertedAmount(0)
   

    
  
// //   }
// //   return (
// //    <>
// //       {isLoading && <div>Loading...</div>}
// //       {loadingErrMsg && <div>{loadingErrMsg}</div>}

// //       <div>
// //       {data && (

// // data.map((item,index)=>(
// //   item.id == editId ?  
// //   ////edit form
// //   <>
// //   <form>
// //         <div className='h-32 flex flex-row border border-black justify-between'>

// //           <select name='category' value={lineItemDetails.category || ''} onChange={handleInputChange}>
// //             {category.map((item ,index)=>(
// //               <React.Fragment key={index}>
// //                 <option value={item}>{item}</option>
// //               </React.Fragment>
// //             ))}
// //           </select>
// //           {errorMsg.category?.set   && <h2 className='text-red-500'>{errorMsg.category.msg}</h2>}
// //           {/* {errorMsg.category?.set && <h2 className='text-red-500'>{errorMsg.category}</h2> } */}

// //           <select name='currencyName' value={lineItemDetails.currencyName} onChange={handleInputChange}>
// //            {currencyTableData && currencyTableData[0].exchangeValue.map((item,index)=>(
// //             <React.Fragment key={index}>
// //               <option>{item.currencyName}</option>
// //               </React.Fragment>
// //            ))}
// //           </select>
// //           {errorMsg.currencyName?.set   && <h2 className='text-red-500'>{errorMsg.currencyName.msg}</h2>}

// // <div className='h-8'>
// // <Input error={errorMsg.totalAmount} name='totalAmount' title='totalAmount' type='number' value={lineItemDetails.totalAmount || ""} onChange={handleInputChange}/>
// // </div>
// // {/* {errorMsg?.totalAmount?.set && <h2 className='text-red-500'>{errorMsg?.totalAmount.msg}</h2>} */}


// // <div>
// //   <div onClick={handleConverter} className='p-4 text-green-400 bg-b-gray cursor-pointer'>Convert</div>
  
// //  { convertedAmount>0 && 
// //  <div>
// // <h2> Conveted bill Amount</h2>
// //    <p>{lineItemDetails.currencyName}: {convertedAmount }</p>
// //  </div>
   
// //  }

// // </div>



// //        <div onClick={handleIsPersonalFlag}>
// //         {
// //           isPersonalFlag ? <h1 className='text-green-500 bg-blue-400'>True</h1> : <h1 className='text-red-500'>False</h1>
// //         }
// //        </div>

// //        {isPersonalFlag &&  <Input name='personalAmount'  value={lineItemDetails.personalAmount} onChange={handleInputChange} error={errorMsg.personalAmount}/>}

       
      

// //       <select name='allocationHeader' value={lineItemDetails.allocationHeader} onChange={handleInputChange}>
// //         {
// //           allocationHeaderOption.map((item,index)=>(
// //             <React.Fragment key={index}> <option>{item}</option></React.Fragment>
// //           ))
// //         }
       

// //       </select>
// //       {errorMsg.allocationHeader?.set   && <h2 className='text-red-500'>{errorMsg.allocationHeader.msg}</h2>}

// //       <Upload  
// //       selectedFile={selectedFile}
// //       setSelectedFile={setSelectedFile}
// //       fileSelected={fileSelected}
// //       setFileSelected={setFileSelected}/>


// //       {errorMsg.document?.set && !selectedFile    && <h2 className='text-red-500'>{errorMsg.document.msg}</h2>}
     

// //       {
// //         fileSelected  ? <h1 className='text-blue-500'>{ selectedFile && selectedFile.name}</h1> : null 
// //       }
         

// //          <div className='m-2' onClick={handleSave}>Save</div>
 
// //         </div>
      

       
// //       </form>
// //       </>
// //   ////edit form
// //   :
  
// //   <React.Fragment key={index}>
// //      <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
// //  <img src={house_simple} className='w-4 h-4' />
// //  <div className="w-full flex sm:block">
// //      <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
// //          <div className="w-[100px]">
// //             Sr.{index + 1}   
// //          </div>
// //          <div className="flex-1">
// //              Category   
// //          </div>
// //          <div className="flex-1" >
// //              Currency     
// //          </div>
// //          <div className="flex-1" >
// //              Bill Amount     
// //          </div>

// //          <div className="flex-1">
// //                 Is Personal Expense?
// //          </div>
// //          <div className="flex-1">
// //             Expense Allocation
// //          </div>
// //          <div className="flex-1">
// //              Bills
// //          </div>
// //      </div>

// //      <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
// //      <div className="w-[100px]">
           
// //          </div>
// //          <div className="flex-1">
// //              {titleCase(item.category)}     
// //          </div>
// //          <div className="flex-1">
// //              {(item.currencyName)}     
// //          </div>
// //          <div className="flex-1 flex-col">
// //              {/* {date} */}
// //              <h2>Bill Amt- {(item.totalAmount)} </h2>
// //              <h2>Converted Amt-{(item.convertedTotalAmount)}</h2>
// //          </div>
// //          <div className="flex-1">
// //              {item.isPersonalExpense ? 'Yes':'No'}
// //          </div>
// //          <div className='flex-1'>
// //              {titleCase(item.allocationHeader)}
// //          </div>
// //          <div className='flex-1 flex-col'>

// //              <img src={house_simple} alt='document'/>
// //              {(item?.document?.name??"file not found")}
// //          </div>
// //      </div>
// //  </div>

 
// // <div className='flex flex-1 justify-center items-end gap-4 pt-3 px-3'>
// // <div   className='flex items-center  justify-center w-6 h-6 bg-[#FFC2C6] rounded-full cursor-pointer' >
// //  <img src={cancel} alt='cancel' width={20} height={20} />
// // </div>
// // <div onClick={()=>handleEdit(item.id)}  className='flex cursor-pointer items-center justify-center w-6 h-6 bg-purple-50 rounded-full '>
// //  <img src={modify} alt='modify' width={12} height={12} />
// // </div>
// // </div>

// //  </div>
// //   </React.Fragment>
// // ))

// // )}
          
          
// //           <LineItemForm 
// //           lineItemDetails={lineItemDetails}
// //           setLineItemDetails ={setLineItemDetails}
// //           generateId={generateRandomId}
// //           initialState={initialState}
// //           handleInputChange={handleInputChange}
// //           handleConverter={handleConverter}
// //           errorMsg={errorMsg}
// //           setErrorMsg={setErrorMsg}
// //           category={category}
// //           handleIsPersonalFlag={handleIsPersonalFlag}
// //           allocationHeaderOption={allocationHeaderOption}
// //   currencyTableData={currencyTableData}
// //   setCurrencyTableData={setCurrencyTableData}
// //   isPersonalFlag={isPersonalFlag}
// //   setIsPersonalFlag={setIsPersonalFlag}
// //   selectedFile={selectedFile}
// //   setSelectedFile={setSelectedFile}
// //   fileSelected={fileSelected}
// //   setFileSelected={setFileSelected}
// //   lineItemArray={lineItemArray}
// //   setLineItemArray={setLineItemArray}
// //   convertedAmount={convertedAmount}
// //   setConvertedAmount={setConvertedAmount}
// //   handleSave={handleSave}


// //           />
// //         <div>Data: {JSON.stringify(data)}</div>
// //         </div>
      
     
      
// //       </>
// //   )
// // }

// // export default Crud






// // const LineItemForm = ({generateId , lineItemDetails,setLineItemDetails ,initialState,handleInputChange ,category,
// //   allocationHeaderOption,
// //   currencyTableData,
// //   setCurrencyTableData,
// //   isPersonalFlag,
// //   setIsPersonalFlag,
// //   selectedFile,
// //   setSelectedFile,
// //   fileSelected,
// //   setFileSelected,
// //   lineItemArray,
// //   setLineItemArray,
// //   convertedAmount,
// //   setConvertedAmount,
// // handleSave ,
// // errorMsg,
// // handleConverter,
// // handleIsPersonalFlag}) => {



 


  


// //   // console.log(currencyTableData[0].exchangeValue)
// //   // const showErrorMsg = errorMsg?.set 

// //   return (
// //     <div>
// //       <form>
// //         <div className='h-32 flex flex-row border border-black justify-between'>

// //           <select name='category' value={lineItemDetails.category || ''} onChange={handleInputChange}>
// //             {category.map((item ,index)=>(
// //               <React.Fragment key={index}>
// //                 <option value={item}>{item}</option>
// //               </React.Fragment>
// //             ))}
// //           </select>
// //           {errorMsg.category?.set   && <h2 className='text-red-500'>{errorMsg.category.msg}</h2>}
// //           {/* {errorMsg.category?.set && <h2 className='text-red-500'>{errorMsg.category}</h2> } */}

// //           <select name='currencyName' value={lineItemDetails.currencyName} onChange={handleInputChange}>
// //            {currencyTableData && currencyTableData[0].exchangeValue.map((item,index)=>(
// //             <React.Fragment key={index}>
// //               <option>{item.currencyName}</option>
// //               </React.Fragment>
// //            ))}
// //           </select>
// //           {errorMsg.currencyName?.set   && <h2 className='text-red-500'>{errorMsg.currencyName.msg}</h2>}

// // <div className='h-8'>
// // <Input error={errorMsg.totalAmount} name='totalAmount' title='totalAmount' type='number' value={lineItemDetails.totalAmount || ""} onChange={handleInputChange}/>
// // </div>
// // {/* {errorMsg?.totalAmount?.set && <h2 className='text-red-500'>{errorMsg?.totalAmount.msg}</h2>} */}


// // <div>
// //   <div onClick={handleConverter} className='p-4 text-green-400 bg-b-gray cursor-pointer'>Convert</div>
  
// //  { convertedAmount>0 && 
// //  <div>
// // <h2> Conveted bill Amount</h2>
// //    <p>{lineItemDetails.currencyName}: {convertedAmount }</p>
// //  </div>
   
// //  }

// // </div>



// //        <div onClick={handleIsPersonalFlag}>
// //         {
// //           isPersonalFlag ? <h1 className='text-green-500 bg-blue-400'>True</h1> : <h1 className='text-red-500'>False</h1>
// //         }
// //        </div>

// //        {isPersonalFlag &&  <Input name='personalAmount'  value={lineItemDetails.personalAmount} onChange={handleInputChange} error={errorMsg.personalAmount}/>}

       
      

// //       <select name='allocationHeader' value={lineItemDetails.allocationHeader} onChange={handleInputChange}>
// //         {
// //           allocationHeaderOption.map((item,index)=>(
// //             <React.Fragment key={index}> <option>{item}</option></React.Fragment>
// //           ))
// //         }
       

// //       </select>
// //       {errorMsg.allocationHeader?.set   && <h2 className='text-red-500'>{errorMsg.allocationHeader.msg}</h2>}

// //       <Upload  
// //       selectedFile={selectedFile}
// //       setSelectedFile={setSelectedFile}
// //       fileSelected={fileSelected}
// //       setFileSelected={setFileSelected}/>
// //       {errorMsg.document?.set && !selectedFile    && <h2 className='text-red-500'>{errorMsg.document.msg}</h2>}
     

// //       {
// //         fileSelected  ? <h1 className='text-blue-500'>{ selectedFile && selectedFile.name}</h1> : null 
// //       }
         

// //          <div className='m-2' onClick={handleSave}>Save</div>
 
// //         </div>
      

       
// //       </form>
      
// //     </div>
// //   )
// // }



