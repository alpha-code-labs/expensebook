import React, { useEffect, useState } from 'react';
import { allocationLevel1,  lineItems,  } from '../utils/dummyData';
import { cancel_icon, categoryIcons, info_icon, modify_icon, receipt,scan_icon } from '../assets/icon';
import Allocations from './Allocations';
import Modal from '../Components/common/Modal'
import Search from '../Components/common/Index';
import Button1 from '../Components/common/Button1';
import FileUpload from '../Components/common/FileUpload';
import { DocumentPreview } from './BillPreview';
import { allocationLevel, initializeFormFields, urlRedirection } from '../utils/handyFunctions';
import LineItemForm from './LineItemForm';
import { getTravelExpenseApi, postTravelExpenseLineItemApi, TravelExpenseCurrencyConversionApi } from '../utils/api';
import { useParams,useNavigate } from 'react-router-dom';
import Error from '../components/common/Error';
import PopupMessage from '../components/common/PopupMessage';
import CancelButton from '../Components/common/CancelButton';
import { BlobServiceClient } from "@azure/storage-blob";




const AddLineItem = () => {
  const az_blob_container = import.meta.env.VITE_AZURE_BLOB_CONTAINER
  const blob_endpoint = import.meta.env.VITE_AZURE_BLOB_CONNECTION_URL

  async function uploadFileToAzure(file) {
    console.log('file name', file.name)
    try {
        const blobServiceClient = new BlobServiceClient(blob_endpoint);
        const containerClient = blobServiceClient.getContainerClient(az_blob_container);
        const blobClient = containerClient.getBlobClient(file.name);
        const blockBlobClient = blobClient.getBlockBlobClient();

        const result = await blockBlobClient.uploadBrowserData(file, {
            blobHTTPHeaders: { blobContentType: file.type },
            blockSize: 4 * 1024 * 1024,
            concurrency: 20,
            onProgress: ev => console.log(ev)
        });

        const fileUrl = blobClient.url;
        console.log(`File uploaded to Azure Blob Storage. URL: ${fileUrl}`);
        return { success: true, fileUrl };
    } catch (e) {
        console.error("Error uploading file to Azure Blob Storage:", e);
        return { success: false, fileUrl: null };
    }
}
 
  const navigate = useNavigate()
  
  const totalAmountKeys = ['Total Fare','Total Amount',  'Subscription Cost', 'Cost', 'Premium Cost'];
  const dateKeys = ['Invoice Date', 'Date', 'Visited Date', 'Booking Date',"Bill Date"];
  const isClassField = ['Class', 'Class of Service']
const {tenantId,empId,tripId} = useParams();
const [showForm , setShowForm]=useState(false);  
const [selectedFile, setSelectedFile] = useState(null);
const [isFileSelected, setIsFileSelected] = useState(false);
const [currencyConversion, setCurrencyConversion]=useState({
  payload:{
     'currencyName':"",
      personalAmount:"",
          totalAmount:"",
          nonPersonalAmount: ""
  },
  response:{}
}) 
const dashboardBaseUrl = `${import.meta.env.VITE_DASHBOARD_URL}`
// const dashboardBaseUrl = `${import.meta.env.VITE_DASHBOARD_URL}/${tenantId}/${empId}/overview`


  


const [requiredObj, setRequiredObj] = useState(
    {"allocationsList":[],
        'travelExpenseCategories':[],
        'level': '',
        'category':''
    }
    )     
const [selectedAllocations,setSelectedAllocations]=useState([]);
const [modalOpen, setModalOpen]=useState(false)
const [isLoading, setIsLoading] = useState(true);
const [isUploading,setIsUploading]=useState({
  conversion:{set:false,msg:""},
  saveLineItem:{set:false,msg:""}
})
const [showPopup, setShowPopup] = useState(false);
const [message, setMessage] = useState(null);
const [loadingErrMsg, setLoadingErrMsg] = useState(null)
const [formData, setFormData]=useState({
    'fields': {}
})   



useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getTravelExpenseApi(tenantId, empId, tripId);
      const travelAllocationFlag = allocationLevel(response?.companyDetails?.travelAllocationFlags)
      //allocations for level 1 or level 2 
      if(['level1','level2'].includes(travelAllocationFlag)){
        const allocationsList = response?.companyDetails?.travelAllocations?.expenseAllocation|| []
        const travelExpenseCategories = response?.companyDetails?.travelExpenseCategories || [];
        setRequiredObj(prev=>({
          ...prev,
          allocationsList,
          travelExpenseCategories,
          level:travelAllocationFlag
        }))

        //level1 or level 2 allocation will save with empty string
        const allocations = allocationsList.map((allocation) => ({
          headerName: allocation.headerName,
          headerValue: "",
        }));
        selectedAllocations(allocations)
    
      }

      if(travelAllocationFlag==='level3'){
        const flagToOpen = response?.flagToOpen

        const openedExpenseObj = (response?.travelExpenseData)?.find(expense => expense.expenseHeaderId === flagToOpen)
        const travelType = openedExpenseObj?.travelType
        console.log('travelType',travelAllocationFlag,travelType,flagToOpen, openedExpenseObj)
        const travelExpenseCategories = response?.companyDetails?.travelAllocations[travelType]
        setRequiredObj(prev=>({
          ...prev,
          travelExpenseCategories,
          level:travelAllocationFlag,
          travelType
        }))
      }


      // for travelExpenseCategories data

      setRequiredObj(prev=>({
        ...prev,
        level:travelAllocationFlag,
        defaultCurrency:response?.companyDetails?.defaultCurrency,
        expenseHeaderId:response?.flagToOpen,
        expenseAmountStatus:response?.expenseAmountStatus
      }))

      console.log('trip data fetched successfully', response)
      setIsLoading(false);  
    } catch (error) {
      setLoadingErrMsg(error.message);
      setMessage(error.message);
      // setShowPopup(true);
      // setTimeout(() => {
      //   setShowPopup(false);
      // }, 3000);
    } 
  };

  // Call the fetchData function whenever tenantId, empId, or tripId changes
  fetchData();
}, [tenantId, empId, tripId]);


const [categorySearchVisible, setCategorySearchVisible] = useState(false);

const [errorMsg,setErrorMsg] = useState({
    currencyFlag:{set:false,msg:""},
    totalAmount:{set:false,msg:""}, 
    personalAmount:{set:false,msg:""},
    data:{set:false,msg:""},
    expenseSettlement:{set:false,msg:""},
    allocations: { set: false, msg: "" },
    category:{ set: false, msg: "" },
    conversion:{ set: false, msg: "" },
    date:{ set: false, msg: "" },
  })




const handleAllocations = (headerName, headerValue) => {
    console.log('allocation handle', headerName, headerValue);
  
    const updatedExpenseAllocation = selectedAllocations.map(item => {
      if (item.headerName === headerName) {
        return {
          ...item,
          headerValue: headerValue
        };
      }
      return item;
    });
  
    // Assuming `setSelectedAllocations` is updating the `allocations` key in the state
    setSelectedAllocations(updatedExpenseAllocation)
    
  };


const handleSelectCategory = (option) => {
  console.log('handle category',option)
  setRequiredObj((prev) => ({
    ...prev,
    category: option.categoryName,
    selectedCategoryData: option,
  }));

  let updatedFields = initializeFormFields(option.fields, {
    defaultCurrency: requiredObj.defaultCurrency || "", // or any other logic to set default values
    travelType: requiredObj.travelType || "",
    categoryName: option.categoryName || "",
  });

  // Only add allocations if level3 is present
  if (requiredObj.level === 'level3') {
    const allocations = (option.expenseAllocation || []).map((allocation) => ({
      headerName: allocation.headerName,
      headerValue: "",
    }));
    setSelectedAllocations(allocations)
  }

  setFormData((prevData) => ({
    ...prevData,
    fields: updatedFields,
  }));
};


const handleMannualBtn=()=>{
  if(requiredObj.category){
    setShowForm(true)
    setErrorMsg(prev => ({...prev,category:{ set: false, msg: "" },}))
  }else{
    setErrorMsg(prev => ({...prev,category:{ set: true, msg: "Select the category" },}))
  }
}


const handleCurrencyConversion = async ( ) => { 
  let allowForm = true;
  
  if (currencyConversion.payload.totalAmount==="" || currencyConversion.payload.totalAmount===undefined){
    setErrorMsg((prevErrors) => ({ ...prevErrors, conversion: { set: true, msg: "Enter the amount" } }));
    allowForm = false;
  } else {
    setErrorMsg((prevErrors) => ({ ...prevErrors, conversion: { set: false, msg: "" } }));
  }

  if (formData.fields.isPersonalExpense && currencyConversion.payload.personalAmount ==="") {
    setErrorMsg((prev) => ({ ...prev, personalAmount: { set: true, msg: "Enter the personal expense amount" } }));
    allowForm = false;
  } else {
    setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: false, msg: "" } }));   
  }

  

  

  if (allowForm) {
    ///api 
    setErrorMsg((prev) => ({ ...prev, conversion: { set: false, msg: "" } }));
    setIsUploading(prev=>({...prev,conversion:{set:true,msg:'fetching exchange rates...'}}))
        try {
         
          const response = await TravelExpenseCurrencyConversionApi(tenantId,currencyConversion.payload);
          if(response.currencyConverterData.currencyFlag){
            setCurrencyConversion(prev=>({...prev,response:response.currencyConverterData}))
          }else{
            setErrorMsg((prev) => ({ ...prev, conversion: { set: true, msg: "Exchange rates not available. Kindly contact your administrator." } }));
          }
          setIsUploading(prev=>({...prev,conversion:{set:false,msg:''}}))
        } catch (error) {
          console.log('Error in fetching expense data for approval:', error.message);
          setIsUploading(prev=>({...prev,conversion:{set:false,msg:''}}))
          setShowPopup(true)
          setMessage(error.message);
          setTimeout(() => {setMessage(null);setShowPopup(false)},5000);
        }
  }
};


// const handleSaveLineItem = ()=>{

//  let allowForm = true
//   // for allocation validation  ----------------
//   const newErrorMsg = {...errorMsg };
//   Object.keys(newErrorMsg).forEach(key => {
//     newErrorMsg[key] = { set: false, msg: "" };
//   });
//   for (const allocation of selectedAllocations) {
//     if (allocation.headerValue.trim() === '') {
//       newErrorMsg[allocation.headerName] = { set: true, msg: "Select the Allocation" };
//     }
//   }
//   setErrorMsg(newErrorMsg);
//   const anyErrorSet = Object.values(newErrorMsg).some(error => error.set);
// // Update allowForm based on whether any error is set
// allowForm = !anyErrorSet;
// if(allowForm){
//   console.log('formdata for save',formData.fields)
// }
// // for allocation validation  ----------------

// }

const handleDashboardRedirection=()=>{
  console.log(dashboardBaseUrl)
  window.parent.postMessage('closeIframe', dashboardBaseUrl);
}


const handleSaveLineItem = async (action) => {
  console.log('line item action',action)
  let allowForm = true;

  // Reset error messages
  const newErrorMsg = {
    currencyFlag: { set: false, msg: "" },
    totalAmount: { set: false, msg: "" },
    personalAmount: { set: false, msg: "" },
    data: { set: false, msg: "" },
    expenseSettlement: { set: false, msg: "" },
    allocations: { set: false, msg: "" },
    category: { set: false, msg: "" },
    conversion: { set: false, msg: "" },
    date: { set: false, msg: "" },
    
    
  };

  // Check total amount keys
  for (const key of totalAmountKeys) {
    if (formData.fields[key] === "") {
      newErrorMsg.conversion = { set: true, msg: `${key} cannot be empty` };
      allowForm = false;
    }
  }

  // Check date keys
  for (const key of dateKeys) {
    if (formData.fields[key] === "") {
      newErrorMsg.date = { set: true, msg: `${key} cannot be empty` };
      allowForm = false;
    }
  }

  // Check if Class is empty
  for (const key of isClassField) {
    if (formData.fields[key] === "") {
      newErrorMsg.class = { set: true, msg: "Class cannot be empty" };
      allowForm = false;
    }
  }

  // Check if personalExpenseAmount is empty when isPersonalExpense is true
  if (formData.fields.isPersonalExpense) {
    const personalAmount = parseFloat(formData.fields.personalExpenseAmount);
    const totalAmount = parseFloat(currencyConversion.payload.totalAmount);
  
    if (isNaN(personalAmount)) {
      newErrorMsg.personalAmount = { set: true, msg: "Personal Expense Amount cannot be empty" };
      allowForm = false;
    } else if (personalAmount > totalAmount) {
      newErrorMsg.personalAmount = { set: true, msg: "Personal Expense Amount cannot exceed Total Amount" };
      allowForm = false;
    } else {
      newErrorMsg.personalAmount = { set: false, msg: "" }; // Clear error if everything is valid
    }
  }

  if((formData.fields.isMultiCurrency) && (formData.fields.convertedAmountDetails===null)){
    newErrorMsg.conversion = { set: true, msg: `Exchange rates not available. Kindly contact your administrator.` };
    allowForm = false
  }
  
  
  

  // Validate allocations
  for (const allocation of selectedAllocations) {
    if (allocation.headerValue.trim() === '') {
      newErrorMsg[allocation.headerName] = { set: true, msg: "Select the Allocation" };
      allowForm = false;
    }
  }
  
  


  

  // Set the error messages only if there are any errors
  setErrorMsg(newErrorMsg);
//   try {
//     const azureUploadResponse = await uploadFileToAzure(selectedFile);
//     if (azureUploadResponse.success) {
//         allowForm = true;
//         const billImageUrl = azureUploadResponse.fileUrl;
//         setFormData(prev => ({
//           ...prev,
//           fields: {
//               ...prev.fields,
//               billImageUrl
//           }
//       }));
      
//     } else {
//         console.error("Failed to upload file to Azure Blob Storage.");
//     }
// } catch (error) {
//     allowForm=false
//     console.error("Error uploading file to Azure Blob Storage:", error);
// }


  if (allowForm) {
    // No errors, proceed with the save operation
    setIsUploading((prev) => ({ ...prev, [action]: { set: true, msg: "" } }));
    const params = {tenantId,empId,tripId,expenseHeaderId:requiredObj.expenseHeaderId}
    const payload = {
      allocations: [], // Default to an empty array
      defaultCurrency: requiredObj?.defaultCurrency,
      expenseAmountStatus: requiredObj.expenseAmountStatus,
      travelType: requiredObj?.travelType,
      expenseLine: {
        ...formData.fields,
        ...(requiredObj.level === 'level3' ? { allocations: selectedAllocations } : {})
      }
    };
    
    // If level is not 'level3', move selectedAllocations to allocations
    if (requiredObj.level !== 'level3') {
      payload.allocations = selectedAllocations;
    }

    try {
      const response = await postTravelExpenseLineItemApi(params,payload);
      setIsUploading((prev) => ({ ...prev, [action]: { set: false, msg: "" } }));
      setShowPopup(true);
      setMessage(response?.message);
      setTimeout(() => {
        setShowPopup(false);
        setMessage(null);
        switch(action) {
          case "saveAndSubmit":
            return navigate(`/${tenantId}/${empId}/${tripId}/view/travel-expense`);
          case "saveAndNew":
            return window.location.reload(); // Reload the page
          default:
            break;
        }
        
        
      }, 5000);
    } catch (error) {
      setIsUploading((prev) => ({ ...prev, [action]: { set: false, msg: "" } }));
      setMessage(error.message);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  }
};

  console.log(selectedAllocations,'selected allocations')
  console.log('form data',formData)
  console.log('required object',requiredObj)
  console.log('currency conversion',currencyConversion.payload)
  const [actionType, setActionType]=useState("")


  const getTitle = () => {
    switch (actionType) {
      case 'closeAddExpense':
        return 'Leave this Page';
      default:
        return '';
    }
  };

  const getContent = () => {
    switch (actionType) {
      case 'closeAddExpense':
        return (
          <>
          <p className="text-md px-4 text-start font-cabin text-neutral-600">
            If you leave this page, unsaved changes will be lost. Are you sure you want to leave this page?
          </p>

                                <div className="flex items-center gap-2 mt-10">
                                  <Button1  text='Stay on this Page' onClick={()=>setModalOpen(false)} />
                                  <CancelButton   text='Leave this Page'  onClick={()=>handleDashboardRedirection()}/>
                                </div>
                    </>
        );  
      default:
        return '';
    }
  };


  return (
    <>
   {isLoading ? <Error  message={loadingErrMsg}/>:
    <div className=''>
     
      <div className='w-full min-w-[400px] border h-full relative bg-white sm:px-8 px-6 py-6 select-none mx-auto'>
      <div className='flex items-center gap-2 cursor-pointer'>
                        <img className='w-5 h-5' src={receipt}  />
                        <p className='text-neutral-600 text-md font-semibold font-sans-serif'>{`Add an Expense`}</p>
                    </div>

                    {/* Rest of the section */}

      {/* <legend className='font-cabin text-neutral-700 text-sm mt-6'>Select type of travel?</legend>
      <fieldset className='flex flex-col sm:flex-row gap-4 '>
                        <div>
                            <div className='flex gap-4 border border-indigo-400 max-w-[300px] accent-indigo-600 px-6 py-2 rounded mt-4 cursor-pointer'  onClick={() => setRequiredObj(pre => ({ ...pre, travelType: 'international' }))}>
                                <input type="radio" id="International" name="travelType" value="traveltype" checked={requiredObj.travelType == 'international'} readOnly />
                                <div>
                                    <p className='font-cabin text-neutral-800 text-normal tracking-wider'> International </p>
                                    <p className='font-cabin -mt-1 text-neutral-600 text-xs tracking-tight'>Travelling out of country</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className='flex gap-4 border border-indigo-400 max-w-[300px] accent-indigo-600 px-6 py-2 rounded mt-4 cursor-pointer'   onClick={() => setRequiredObj(pre => ({ ...pre, travelType: 'domestic' }))}>
                                <input type="radio" id="Domestic" name="travelType" value="traveltype" checked={requiredObj.travelType == 'domestic'} readOnly />
                                <div>
                                    <p className='font-cabin text-neutral-800 text-normal tracking-wider'> Domestic </p>
                                    <p className='font-cabin -mt-1 text-neutral-600 text-xs tracking-tight'>Travelling within country</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className='flex gap-4 border border-indigo-400 max-w-[300px] accent-indigo-600 px-6 py-2 rounded mt-4 cursor-pointer'   onClick={() => setRequiredObj(pre => ({ ...pre, travelType: 'local' }))} >
                                <input type="radio" id="Local" name="travelType" value="traveltype" checked={requiredObj.travelType == 'local'} readOnly />
                                <div>
                                    <p className='font-cabin text-neutral-800 text-normal tracking-wider'> Local </p>
                                    <p className='font-cabin -mt-1 text-neutral-600 text-xs tracking-tight'>Travelling nearby</p>
                                </div>
                            </div>
                        </div>

      </fieldset> */}

{['level1','level2'].includes(requiredObj.level) &&
 <Allocations
 onAllocationSelection={handleAllocations}
 travelExpenseAllocation={requiredObj.allocationsList}
/>
}
<div className='flex md:flex-row flex-col items-start gap-2'> 
<div className='relative flex flex-col h-[73px] justify-start item-start gap-2'>
      <div className="text-zinc-600 text-sm font-cabin select-none mt-2">Categories</div>
      <div onClick={(e)=>{e.stopPropagation(); setCategorySearchVisible(pre=>!pre)}} className={`min-h-[50px] h-fit min-w-[200px] w-fit px-2 py-2 border  flex gap-2 bg-gray-100 ${errorMsg.category.set ? 'border-red-600' : 'border-slate-300'}  hover:bg-gray-200 rounded-sm items-center transition ease-out hover:ease-in cursor-pointer`}>
                                         {requiredObj.category && <div className="bg-white p-2 rounded-full " >                            
                                         <img src={categoryIcons[requiredObj.category]} className='w-4 h-4 rounded-full'/>
                                         </div>}

                                        <div className="text-neutral-700 text-normal text-sm sm:text-[14.5px] font-cabin -mt-1 sm:mt-0">{!requiredObj.category ? 'Select Category' : requiredObj?.category }</div>
                                        </div>
      
      {categorySearchVisible &&
      <div className='absolute top-[84px]'>
       <Search
       visible={categorySearchVisible}
       setVisible={setCategorySearchVisible}
       searchChildren={'categoryName'}
       onSelect={(option) => { handleSelectCategory(option)}}
       options={requiredObj?.travelExpenseCategories} 
       title='Select the requied category.'
       />
       </div>}
     

</div>

<div className='mt-12 inline-flex space-x-2'>
    <FileUpload selectedFile={selectedFile} setSelectedFile={setSelectedFile} isFileSelected={isFileSelected} setIsFileSelected={setIsFileSelected}  text={<div className='inline-flex items-center space-x-1'><img src={scan_icon} className='w-5 h-5'/> <p>Auto Scan</p></div>}/>
    <Button1 onClick={handleMannualBtn} text={<div className='inline-flex items-center space-x-1'><img src={modify_icon} className='w-5 h-5'/> <p>Manually</p></div>}/>
</div>
</div>    



     


      </div>
      {showForm &&
<div className='w-full flex flex-col md:flex-row relative border-t-2 border-slate-300 h-screen p-4 pb-16 '>
    <div className='w-full md:w-3/5 md:block hidden  h-full overflow-auto'>
        <DocumentPreview isFileSelected={isFileSelected} setIsFileSelected={setIsFileSelected} selectedFile={selectedFile} setSelectedFile={setSelectedFile} initialFile=""/>
    </div>
    <div className='w-full md:w-2/5 h-full overflow-auto'>
       <LineItemForm 
       setErrorMsg={setErrorMsg}
       isUploading={isUploading}
       defaultCurrency={requiredObj.defaultCurrency}
       setCurrencyConversion={setCurrencyConversion}
       handleCurrencyConversion={handleCurrencyConversion}
       setFormData={setFormData}
       formData={formData.fields}
       handleAllocations={handleAllocations}
       onboardingLevel={requiredObj.level}
       allocationsList={requiredObj?.selectedCategoryData?.allocation}
       errorMsg={errorMsg}
       lineItemDetails={formData.fields}
       categoryFields={requiredObj?.selectedCategoryData?.fields || []}
       classOptions={requiredObj?.selectedCategoryData?.class}
       categoryName={requiredObj?.category}
       />
    </div>
    <div className='absolute -left-4 mx-4 inset-x-0 w-full  z-20 bg-slate-100   h-16 border border-slate-300 bottom-0'>
      <ActionBoard handleClick={handleSaveLineItem} isUploading={isUploading} setModalOpen={setModalOpen} setActionType={setActionType}/>
    </div>
</div>}
    </div>}
    
    <Modal 
        isOpen={modalOpen} 
        onClose={()=>setModalOpen(!modalOpen)}
        content={
          <div className='w-full h-auto'>
          <div className='flex gap-2 justify-between items-center bg-indigo-100 w-auto p-4'>
            <div className='flex gap-2'>
              <img src={info_icon} className='w-5 h-5' alt="Info icon"/>
              <p className='font-inter text-base font-semibold text-indigo-600'>
                {getTitle()}
              </p>
            </div>
            <div onClick={() => setModalOpen(false)} className='bg-red-100 cursor-pointer rounded-full border border-white'>
              <img src={cancel_icon} className='w-5 h-5' alt="Cancel icon"/>
            </div>
          </div>

          <div className="p-4">
           {getContent()}
            
          </div>
        </div>}
      />  
<PopupMessage skipable={true} showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>
    </>
  )
}

export default AddLineItem



const ActionBoard = ({handleClick,isUploading,setModalOpen, setActionType})=>{

  return(
    <div className='flex justify-end px-4 items-center h-full w-full'>
      {/* <div>
      <Button1 loading={isUploading?.saveLineItem?.set} text='Submit' onClick={()=>handleClick()}/>
      </div> */}
    <div className='flex gap-1'>
      <Button1  loading={isUploading?.saveAndNew?.set}      text='Save and New'    onClick={()=>handleClick("saveAndNew")}/>
      <Button1  loading={isUploading?.saveAndSubmit?.set}      text='Save and Submit' onClick={()=>handleClick("saveAndSubmit")}/>
      <CancelButton  loading={isUploading?.saveLineItem?.set} text='Cancel'          onClick={()=>{setModalOpen(true);setActionType("closeAddExpense")}}/>
    </div>

    
    </div>
  )
}

