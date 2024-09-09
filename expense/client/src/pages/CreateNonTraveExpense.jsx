import React ,{useState,useEffect,useRef}from 'react';
import { cancelNonTravelExpenseHeaderApi, deleteNonTravelExpenseLineItemApi,  currencyConversionApi,  editNonTravelExpenseLineItemsApi, getCategoryFormElementApi, getNonTravelExpenseLineItemsApi, getNonTravelExpenseMiscellaneousDataApi, nonTravelOcrApi, postMultiCurrencyForNonTravelExpenseApi, postNonTravelExpenseLineItemApi, saveAsDraftNonTravelExpense, submitNonTravelExpenseApi, submitOrSaveAsDraftApi, submitOrSaveAsDraftNonTravelExpenseApi } from '../utils/api'
import { useParams } from 'react-router-dom';
import Error from '../components/common/Error';
import Button from '../components/common/Button';
import PopupMessage from '../components/common/PopupMessage';
import Icon from '../components/common/Icon';
import Input from '../components/common/Input';
import { arrow_left, briefcase, cancel_icon, cancel_round, categoryIcons, chevron_down, close_gray_icon, delete_icon, file_icon, info_icon, modify_icon, money, receipt, scan_icon, user_icon, validation_sym, validation_symb_icon } from '../assets/icon';
import { allocationLevel, initializenonTravelFormFields, titleCase, urlRedirection } from '../utils/handyFunctions';
import Upload from '../components/common/Upload';
import Select from '../components/common/Select';
import ActionButton from '../components/common/ActionButton';
import Modal from '../components/common/Modal';
import AddMore from "../components/common/AddMore.jsx";
import { BlobServiceClient } from "@azure/storage-blob";
import Button1 from '../Components/common/Button1.jsx';
import FileUpload from '../Components/common/FileUpload.jsx';
import Search from '../Components/common/Index.jsx';
import LineItemForm from '../nonTravelExpenseSubComponet/LineItemForm.jsx';
import { DocumentPreview } from '../travelExpenseSubcomponent/BillPreview.jsx';
import CancelButton from '../Components/common/CancelButton.jsx';
import { dateKeys, isClassField, totalAmountKeys } from '../utils/data/keyList.js';
import { LineItemView } from '../nonTravelExpenseSubComponet/LineItemView.jsx';
import uploadFileToAzure from '../utils/azureBlob.js';
import { act } from 'react';

///Cuurency on Save you have to save object of currency
const currencyDropdown = [
  { fullName: "Argentine Peso", shortName: "ARS", symbol: "$", countryCode: "AR" },
  { fullName: "Australian Dollar", shortName: "AUD", symbol: "A$", countryCode: "AU" },
  { fullName: "United States Dollar", shortName: "USD", symbol: "$", countryCode: "US" },
  {
    "fullName": "Bangladeshi Taka",
    "shortName": "BDT",
    "symbol": "৳",
    "countryCode": "BD"
  },
  {"countryCode": "IN","fullName": "Indian Rupee","shortName": "INR","symbol": "₹"}
];
const totalAmountNames = ['Total Fare','Total Amount',  'Subscription cost', 'Cost', 'Premium Cost'];
const dateForms = ['Invoice Date', 'Date', 'Visited Date', 'Booking Date','Bill Date','Check-In Date'];

const CreateNonTraveExpense = () => {
 
  
  const {tenantId,empId,expenseHeaderId} =useParams()
  const dashboardBaseUrl = `${import.meta.env.VITE_DASHBOARD_URL}`

  const az_blob_container = import.meta.env.VITE_AZURE_BLOB_CONTAINER
  const storage_sas_token = import.meta.env.VITE_AZURE_BLOB_SAS_TOKEN
  const storage_account = import.meta.env.VITE_AZURE_BLOB_ACCOUNT
  const blob_endpoint = `https://${storage_account}.blob.core.windows.net/?${storage_sas_token}`
  


  
  
const [currencyConversion, setCurrencyConversion]=useState({
  payload:{
     'currencyName':"",
      personalAmount:"",
      totalAmount:"",
      nonPersonalAmount: ""
  },
  response:{}
})

 const [requiredObj, setRequiredObj]=useState({
  "groupLimit":{
    group:'',
    limit: 0,
    message:''}
 });

 const [formData, setFormData] = useState({
  approvers:[],
  fields:{},
  editedFields:{}  
 })
 
  
  const [headerDetails , setHeaderDetails]=useState(null);
  const [categoryList , setCategoryList]=useState(null);
      //this is for miscellaneous data
    //for get categories , dashboard to non tr expense ms 
    

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await getNonTravelExpenseMiscellaneousDataApi(tenantId, empId,);
          setCategoryList(response?.reimbursementExpenseCategory || [])
          const expenseSettlementOptions = Object.keys(response?.expenseSettlementOptions).filter((option) => response?.expenseSettlementOptions[option]) || [];
          const travelAllocationFlag = allocationLevel(response?.travelAllocationFlags)
          setRequiredObj(prev=>({...prev,
            "expenseCategories":response?.reimbursementExpenseCategory || [],
           "level":travelAllocationFlag,
          "listOfAllManagers":response?.getApprovers?.listOfManagers || [],
            "APPROVAL_FLAG":response?.getApprovers?.APPROVAL_FLAG, //boolean
             "approvalFlow":response?.getApprovers?.approvalFlow ||[],
             "MANAGER_FLAG"  :response?.getApprovers?.MANAGER_FLAG, //boolean
             expenseSettlementOptions}))
          setHeaderDetails({
            name: response?.employeeName,
            defaultCurrency : response?.defaultCurrency
          })
         
          setIsLoading(false);
          console.log(response.data)
          console.log('expense data for approval fetched.');
        } catch (error) {
          console.log('Error in fetching expense data for approval:', error.message);
          setLoadingErrorMsg(error.message);
          setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
        }
      };
  
      fetchData(); 
      
  
    }, [tenantId,empId]);

  
  


 

    

 


    const [expenseLineAllocation ,setExpenseLineAllocation]=useState(null)
    //const [categoryElement , setCategoryElement]=useState([...editData]); // this is for dummy
   
    const [categorySearchVisible, setCategorySearchVisible] = useState(false);
    const [approversSearchVisible, setApproversSearchVisible] = useState(false);
    const [totalAmount, setTotalAmount] = useState(''); ///for handling convert 
  
 
    
    const [formDataValues, setFormDataValues] = useState(); 
    const [selectedAllocations , setSelectedAllocations]=useState([])
    const [selectedLineItemId, setSelectedLineItemId]=useState(null)
    const [modalOpen , setModalOpen]= useState(false)
    const [actionType, setActionType]=useState(false)
    const [isLoading,setIsLoading]=useState(true)
  
    const [isUploading , setIsUploading]=useState({
        edit:{visible:false,id:null},
        saveLineItem:false,
        convert:false,
        delete:{visible:false,id:null},
        deleteHeader:false,
        saveAsDraft:false,
        submit:false,
        autoScan:false,
        selectCategory:false
    })
    // const [active , setActive]=useState({
    //   edit:{visible:false,id:null},
    //   saveLineItem:false,
    //   convert:false,
    //   delete:{visible:false,id:null},
    //   deleteHeader:false,
    //   saveAsDraft:false,
    //   submit:false,
    //   autoScan:false
    // })
    
    const [loadingErrorMsg, setLoadingErrorMsg]=useState(null)
    const [errorMsg,setErrorMsg]=useState({
      category:{set:false,msg:""},
      dateErr:{set:false,msg:""},
      currencyFlag:{set:false,msg:""},
      totalAmount:{set:false,msg:""},
      allocations: { set: false, msg: "" },
      approversError:{set:false,msg:""},
      settlementError:{set:false,msg:""}
    })

    const [showForm,setShowForm]=useState(false)
    const [openModal,setOpenModal]=useState(null);
    const [showPopup ,setShowPopup]=useState(false);
    const [message,setMessage]=useState(null)  

    




const handleMannualBtn=async()=>{
  if(requiredObj.category){
    setShowForm(true)
    await setErrorMsg(prev => ({...prev,category:{ set: false, msg: "" },}))
     document.getElementById('newLineItem').scrollIntoView({ behavior: 'smooth' });
  }else{
    setErrorMsg(prev => ({...prev,category:{ set: true, msg: "Select the category" },}))
  }
}


//for save selected expenseLineAllocation allocation in array
//for saving expenseLineAllocation on  line item   




const [selectedCategory , setSelectedCategory]= useState(null)   
 


    // const handleCategoryChange=(value)=>{
    
    // setSelectedCategory(value)
    // console.log('selectedCategory',value)
    // setFormDataValues({...formDataValues,currencyName:value})
    // }
  
    ///Handle Edit
    const handleEdit=async(lineItem)=>{
      console.log('lineItem for edit',lineItem)
      setIsUploading(prev => ({...prev,editLineItem:true}))
      setActionType("editLineItem")
      setSelectedLineItemId(lineItem?.lineItemId)
      setFormData(prev=>({...prev,"editedFields":lineItem, "fields":lineItem}))
      await handleSelectCategory(lineItem['Category Name'])
      setIsUploading(prev => ({...prev,editLineItem:false}))
    }

  //Handle Delete

  const handleDeleteLineItem=async()=>{
    const expenseHeaderIds = expenseHeaderId || requiredObj?.expenseHeaderId
    const lineItemIds = {lineItemIds :[selectedLineItemId]}

    try {
      setIsUploading(prev=>({...prev,deleteLineItem:true}))

      const response = await deleteNonTravelExpenseLineItemApi(tenantId,empId,expenseHeaderIds,lineItemIds);
      setShowPopup(true)
      setMessage(response?.message);
      console.log('line item deleted successfully',response);
      setIsUploading(prev=>({...prev,deleteLineItem:false}))
      setModalOpen(false)
      const updatedLineItems = requiredObj?.expenseLines?.filter(
        (item) => item.lineItemId !== selectedLineItemId
      );
      setRequiredObj(prev =>({...prev, "expenseLines":updatedLineItems}))
      setTimeout(() => {setShowPopup(false);setMessage(null)},3000);
    } catch (error) {
      console.log('Error in deleting line item', error.message);
      setLoadingErrorMsg(error.message);
      setIsUploading(prev=>({...prev,deleteLineItem:false}))
      setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},3000);
    }
  }




    const handleGenerateExpense = async (category) => {
      console.log('generate category',category)   
      let expenseHeaderId 
      let api

      try {
        setIsUploading(true)
       // setActive(true)
        if(requiredObj?.expenseHeaderId){
          expenseHeaderId =requiredObj?.expenseHeaderId
          api = await getCategoryFormElementApi(tenantId,empId,category,expenseHeaderId)
        }
        else{
          api = await getCategoryFormElementApi(tenantId,empId,category)
        }
        const response = api
        //setMiscellaneousData(response || {})
        //setDefaultCurrency(response?.defaultCurrency)
        //setCategoryElement(response?.fields || [])
        setExpenseLineAllocation(response?.newExpenseAllocation) || []
        const allocation1 = response?.newExpenseAllocation
        const initialExpenseAllocation = allocation1 && allocation1.map(({  headerName }) => ({
          headerName,
          headerValue: "" // Add "headerValue" and set it to an empty string
        }));
        console.log('intial allocation',initialExpenseAllocation)


        setRequiredObj(prev => ({...prev,
          "defaultCurrency":response?.defaultCurrency,
         // "fields":response?.fields || [],
          "expenseHeaderId":response?.expenseHeaderId ?? null,
          "expenseHeaderNumber":response?.expenseHeaderNumber,
          "expenseHeaderStatus": response?.expenseHeaderStatus,
          "createdBy":response?.createdBy,
          "category":response?.categoryName,
          "groupLimit":response?.group || {},
          "allocation":response?.newExpenseAllocation || []
        }))

        
        // sessionStorage.setItem("expenseHeaderId", response?.expenseHeaderId);
        //setReimbursementHeaderId(response?.expenseHeaderId)
        setIsUploading(false);
       // setActive(false)
        
        console.log('expense data for approval fetched.',response);
        // setSelectedCategory(null)
      } catch (error) {
        console.log('Error in fetching expense data for approval:', error.message);
        setLoadingErrorMsg('message',error.message);
        setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
      }
      };

     
    //for add line item
    const handleModal=()=>{
        setOpenModal((prevState)=>(!prevState))
      
    }

    //console.log('miscellaneous data',miscellaneousData)


    

    const getTitle = () => {
      switch (actionType) {
        case 'closeAddExpense':
          return 'Leave this Page';
        case 'cancelExpense':
          return 'Delete Expense';
        case 'deleteLineItem':
          return 'Delete Line-Item';
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
          case 'cancelExpense':
          case 'deleteLineItem': 
         
            return (
              
              <>
              <p className="text-md px-4 text-start font-cabin text-neutral-600">
              If you delete this {actionType==="cancelExpense" ? 'expense': 'line-item'}, you cannot retrieve it. Are you sure you want to delete?
              </p>
                                    <div className="flex items-center gap-2 mt-10">
                                      <Button1 loading={isUploading.deleteHeader || isUploading.deleteLineItem}  text='Delete' onClick={()=>{actionType==="cancelExpense" ?handleSubmitOrDraft("deleteHeader"): handleDeleteLineItem()}} />
                                      <CancelButton   text='Cancel'  onClick={()=>setModalOpen(false)}/>
                                    </div>
              </>
            );  
       
          default:
          return '';
      }
    };

  useEffect(() => {
   
    const expenseHeaderIds =  expenseHeaderId || requiredObj?.expenseHeaderId 
    console.log('expense header id1',expenseHeaderIds)
  
    const fetchData = async () => {
      try {
        const response = await getNonTravelExpenseLineItemsApi(tenantId, empId, expenseHeaderIds);

        //setExpenseDataByGet(response?.expenseReport)
        
        setRequiredObj(prev => ({...prev,
          "defaultCurrency":response?.expenseReport?.defaultCurrency,
          //"fields":response?.expenseReport?.fields || [],
          "expenseHeaderId":response?.expenseReport?.expenseHeaderId ?? null,
          "expenseHeaderNumber":response?.expenseReport?.expenseHeaderNumber,
          "expenseHeaderStatus": response?.expenseReport?.expenseHeaderStatus,
          "createdBy":response?.expenseReport?.createdBy,
          //"category":response?.expenseReport?.categoryName,
          "groupLimit":response?.expenseReport?.group || {},
          //"allocation":response?.expenseReport?.newExpenseAllocation || [],
          "expenseLines":response?.expenseReport?.expenseLines
        }))
        setFormData(prev=>({...prev,"approvers":response?.expenseReport?.approvers}))


        //setLineItemsData(response?.expenseReport?.expenseLines)
        setIsLoading(false);
        if(response.expenseReport===null){
          setRequiredObj(prev => ({...prev,defaultCurrency:response?.expenseReport?.defaultCurrency}))
        //setDefaultCurrency(response?.expenseReport?.defaultCurrency)
      }
        
        console.log('expense line items fetched successfully.',response);
      } catch (error) {
        console.log('Error in fetching expense data for approval:', error.message);
        setLoadingErrorMsg(error.message);
        setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
      }
    };

    if(expenseHeaderId || requiredObj?.expenseHeaderId){
      fetchData(); 
    }
    

  }, [expenseHeaderId || requiredObj?.expenseHeaderId ])
console.log('form data 1',formData)
  



    
   


//intial form value with empty string

// useEffect(()=>{
//   const initialFormValues = Object.fromEntries(
//     categoryElement && categoryElement?.map((field) => [
//        field.name,
//         ocrValue?.[field.name] || '',
//      ])
//    );
//    setFormDataValues(initialFormValues)
//    const foundDateKey = dateForms.find(key => Object.keys(initialFormValues).includes(key));
//         const foundTotalAmtKey = totalAmountNames.find(key => Object.keys(initialFormValues).includes(key));
//         const dateValue = foundDateKey ? initialFormValues[foundDateKey] : undefined;
//         const totalAmountValue = foundTotalAmtKey ? initialFormValues[foundTotalAmtKey] : undefined;
//         setDate({[foundDateKey]:dateValue})
//         setTotalAmount(totalAmountValue)
//   console.log('intialFormValues',initialFormValues)
//   console.log('expense line allocation',expenseLineAllocation)

// },[categoryElement])




 
// for line items form
   

    // const handleInputChange = (name, value) => {
      
    //    setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: false, msg: "" } }));
    //   //  setErrorMsg((prevErrors) => ({ ...prevErrors, [name]: { set: false, msg: "" } }));
    //     setFormDataValues((prevValues) => ({
    //       ...prevValues,
    //       [name]: value,
    //     }));
    //     if (name === 'Total Amount' || name === 'Total Fair') {
    //         setTotalAmount(value);
    //       }
    //   };

    // const handleInputChange = (name, value) => {
    //   console.log(`Updating ${name} with value:`, value);
    
    //   setFormDataValues(prevState => {
    //     const updatedState = { ...prevState };
    
    //     // Check if the name already exists
    //     if (updatedState.hasOwnProperty(name)) {
    //       // If the name exists, replace its value
    //       updatedState[name] = value || "";
    //     } else {
    //       // If the name doesn't exist, add a new key-value pair
    //       updatedState[name] = value || "";
    //     }
    
    //     return updatedState;
    //   });
    
    //   if (name === 'Total Amount' || name === 'Total Fair') {
    //     setTotalAmount(value);
    //   }
    // };
   console.log('grouplimit',requiredObj?.groupLimit)
   console.log('initial values',formDataValues)

    // const handleInputChange = (name, value) => {
    //   console.log(`Updating ${name} with value:`, value);

     

    //   setFormDataValues(prevState=>({...prevState, [name]: value}))
    //   // setFormDataValues((prevState) => ({ ...prevState, [name]: value || "" }));
    //   console.log('onChange lineitem',formDataValues)
      
    //   if (totalAmountNames.includes(name)) {
    //     setTotalAmount(value);
    //     setErrorMsg(prevErrors => ({
    //       ...prevErrors,
    //       totalAmount: { set: !name, msg: name ? "" : `Enter ${name}` }
    //     }));
    //   }


    //   if(dateForms.includes(name)){
    //     setDate({[name] : value})
    //     setErrorMsg(prevErrors => ({
    //       ...prevErrors,
    //       dateErr: { set: !name, msg: name ? "" : `Enter ${name}` }
    //     }));
    //   }    

    //   if(totalAmountNames.includes(name)){
    //     const limit = requiredObj?.groupLimit?.limit 
    //     if(value>limit){
    //       setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:true,msg:requiredObj?.groupLimit?.message}}))
    //     }else{
    //       setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:false,msg:requiredObj?.groupLimit?.message}}))
    //     }
    //   }

      
      
    // };


    // const handleInputChange = (key, value) => {
    //   console.log(`Updating ${key} with value:`, value);
    
    //   setFormData((prevData) => {
    //     const updatedFields = {
    //       ...prevData.fields,
    //       [key]: value,
    //     };
    
       

        
       
    //     ///for conversion stop

    //     return {
    //       ...prevData,
    //       fields: updatedFields,
    //     };
    //   });

    //    if(totalAmountKeys.includes(key) ){
    //       setCurrencyConversion(prev =>({...prev,payload:{
    //         ...prev.payload,
    //        ["totalAmount"]:value
    //       }
    //       }))
    //     }

    //     if(key === "personalExpenseAmount"){
    //       setCurrencyConversion(prev =>({...prev,payload:{
    //         ...prev.payload,
    //        ["personalAmount"]:value
    //       }
    //       }))
    //     }
    //     setCurrencyConversion(prev =>({...prev,payload:{
    //       ...prev.payload,
    //       'currencyName':formData?.Currency?.shortName,
         
    //       ///nonPersonalAmount: Number(prev.payload.totalAmount) - Number(formData.personalExpenseAmount)
    //     }
    //     }))

    //     if(key==='Currency' && value.shortName !== requiredObj?.defaultCurrency.shortName){
    //       setFormData(prev => ({
    //         ...prev,
    //         fields: {
    //           ...prev.fields, // Spread the existing fields object
    //           isMultiCurrency: true 
    //         }
    //       }));
    //       handleCurrencyConversion()
    //     }else{
    //       if(key==='Currency'){
    //         setErrorMsg((prevErrors) => ({ ...prevErrors, conversion: { set: false, msg: "" } }));
    //       }
          
    //       setFormData(prev => ({
    //         ...prev,
    //         fields: {
    //           ...prev.fields, // Spread the existing fields object
    //           isMultiCurrency: false 
    //         }
    //       }));
          
         
    //       //setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: true, msg: "Enter the amount" } }));
    //     }
    // };
    // const handleInputChange = (name, value) => {
    //   console.log(`Updating ${name} with value:`, value);
    //   setFormDataValues((prevState) => ({ ...prevState, [name]: value || "" }));
    //   if ((name === 'Total Amount' || name === 'Total Fare')) {
    //             setTotalAmount(value);
    //           }
    //   if((name === 'Total Amount' || name === 'Total Fare') ){
    //     const limit = groupLimit?.limit 
    //     if(value>limit){
    //       setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:true,msg:groupLimit?.message}}))
    //     }else{
    //       setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:false,msg:groupLimit?.message}}))
    //     }
    //   }
    // };
   
console.log('selected category',selectedCategory)

 

     
const [selectedFile  , setSelectedFile]=useState(null)
const [isFileSelected ,setIsFileSelected]= useState(false)



      
      console.log('total amount', totalAmount)
      //console.log("expense line",lineItemsData)
      console.log('category element',requiredObj.fields)



      console.log('form data 1',formData)

  
//console.log('categoryname;',miscellaneousData?.categoryName)



   




/// Save Line Item
     

console.log('selected allocations',selectedAllocations)
// const handleSaveLineItem = async (action) => {
//   console.log('line item action',action)
//   let allowForm = true;

//   // Reset error messages
//   const newErrorMsg = {
//     currencyFlag: { set: false, msg: "" },
//     totalAmount: { set: false, msg: "" },
//     personalAmount: { set: false, msg: "" },
//     data: { set: false, msg: "" },
//     expenseSettlement: { set: false, msg: "" },
//     allocations: { set: false, msg: "" },
//     category: { set: false, msg: "" },
//     conversion: { set: false, msg: "" },
//     date: { set: false, msg: "" }
//   };

//   // Check total amount keys
//   for (const key of totalAmountKeys) {
//     if (formData.fields[key] === "") {
//       newErrorMsg.conversion = { set: true, msg: `${key} cannot be empty` };
//       allowForm = false;
//     }
//   }

//   // Check date keys
//   for (const key of dateKeys) {
//     if (formData.fields[key] === "") {
//       newErrorMsg.date = { set: true, msg: `${key} cannot be empty` };
//       allowForm = false;
//     }
//   }

//   // Check if Class is empty
//   for (const key of isClassField) {
//     if (formData.fields[key] === "") {
//       newErrorMsg.class = { set: true, msg: "Class cannot be empty" };
//       allowForm = false;
//     }
//   }

//   // Validate allocations
  
//   for (const allocation of selectedAllocations) {
//     if (allocation.headerValue.trim() === '') {
//       newErrorMsg[allocation.headerName] = { set: true, msg: "Select the Allocation" };
//       allowForm = false;
//     }
//   }

//   console.log('allowform', allowForm ,selectedAllocations)
// // 
  

//   // Set the error messages only if there are any errors
//   setErrorMsg(newErrorMsg);
//   let previewUrl = ""

//   if (allowForm && selectedFile) {
//     
//     setIsUploading(prev => ({ ...prev, [action]: { set: true, msg: "" } }));
    
//     try {
//         // Await the Azure upload response
//         const azureUploadResponse = await uploadFileToAzure(selectedFile, blob_endpoint, az_blob_container);
        
//         if (azureUploadResponse.success) {
//             console.log('File uploaded successfully');
            
//             // Construct the preview URL for the uploaded file
//             previewUrl = `https://${storage_account}.blob.core.windows.net/${az_blob_container}/${selectedFile.name}`;
//             console.log('bill url', previewUrl);
//         } else {
//             // Handle the failure of the file upload
//             console.error("Failed to upload file to Azure Blob Storage.");
//             setMessage("Failed to upload file to Azure Blob Storage.");
//             setShowPopup(true);
//             setTimeout(() => setShowPopup(false), 3000);
//             allowForm = false;
//         }
//     } catch (error) {
//         // Catch any unexpected errors during the file upload process
//         console.error("Error uploading file to Azure Blob Storage:", error);
//         setMessage(error.message);
//         setShowPopup(true);
//         setTimeout(() => setShowPopup(false), 3000);
//         allowForm = false;
//     }
// }


//   if (allowForm) {
//     // No errors, proceed with the save operation
//     setIsUploading((prev) => ({ ...prev, [action]: { set: true, msg: "" } }));
//     const params = {tenantId,empId,expenseHeaderId:requiredObj.expenseHeaderId}
//     const payload = {
//       ...formData?.approvers||[] ,
//       "companyName":requiredObj?.companyName,
//       "createdBy": requiredObj?.createdBy,
//       "expenseHeaderNumber":requiredObj?.expenseHeaderNumber,
//       "defaultCurrency": requiredObj?.defaultCurrency,
//       "lineItem": {
//         "billImageUrl":previewUrl,
//         ...formData.fields,
//         ...(requiredObj.level === 'level3' ? { allocations: selectedAllocations } : {})
//       }
//     };
    
//     // If level is not 'level3', move selectedAllocations to allocations
//     if (requiredObj.level !== 'level3') {
//       payload.allocations = selectedAllocations;
//     }

//     try {
//       const response = await postNonTravelExpenseLineItemApi(params,payload);
//       setIsUploading((prev) => ({ ...prev, [action]: { set: false, msg: "" } }));
//       setShowPopup(true);
//       setMessage(response?.message);
//       setTimeout(() => {
//         setShowPopup(false);
//         setMessage(null);
//         setShowForm(false)
//         setLineItemsData(prev=>({...prev,fields:{}}))
//         switch(action) {
//           case "saveAndSubmit":
//             return 'add logic for modal open warning then submit';
//           case "saveAndNew":
//             return window.location.reload(); // Reload the page
//           default:
//             break;
//         }
        
        
//       }, 5000);
//     } catch (error) {
//       setIsUploading((prev) => ({ ...prev, [action]: { set: false, msg: "" } }));
//       setMessage(error.message);
//       setShowPopup(true);
//       setTimeout(() => {
//         setShowPopup(false);
//       }, 3000);
//     }
//   }
// };

const handleRemoveFile = ()=>{
  console.log('file removed')
  setSelectedFile(null)
}
const handleSaveLineItem = async (action) => {
  console.log('line item action', action);
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
    class: { set: false, msg: "" }
  };

  // Validate total amount keys
  for (const key of totalAmountKeys) {
    if (formData.fields[key] === "") {
      newErrorMsg.conversion = { set: true, msg: `${key} cannot be empty` };
      allowForm = false;
    }
  }

  // Validate date keys
  for (const key of dateKeys) {
    if (formData.fields[key] === "") {
      newErrorMsg.date = { set: true, msg: `${key} cannot be empty` };
      allowForm = false;
    }
  }

  // Validate class field
  for (const key of isClassField) {
    if (formData.fields[key] === "") {
      newErrorMsg.class = { set: true, msg: "Class cannot be empty" };
      allowForm = false;
    }
  }

  if (formData.fields.isMultiCurrency && !formData.fields.convertedAmountDetails) {
    newErrorMsg.conversion = { set: true, msg: `Exchange rates not available. Kindly contact your administrator.` };
    allowForm = false;
  }

  // Validate allocations
  for (const allocation of selectedAllocations) {
    if (allocation.headerValue.trim() === '') {
      newErrorMsg[allocation.headerName] = { set: true, msg: "Select the Allocation" };
      allowForm = false;
    }
  }

  // Set error messages if validation fails
  setErrorMsg(newErrorMsg);

  if (!allowForm) return;

  let previewUrl = "";

  if (selectedFile) {
    setIsUploading((prev) => ({ ...prev, [action]: { set: true, msg: "" } }));

    try {
      // Upload the file to Azure
      const azureUploadResponse = await uploadFileToAzure(selectedFile, blob_endpoint, az_blob_container);

      if (azureUploadResponse.success) {
        previewUrl = `https://${storage_account}.blob.core.windows.net/${az_blob_container}/${selectedFile.name}`;
        console.log('File uploaded successfully, bill url:', previewUrl);
      } else {
        throw new Error("Failed to upload file to Azure Blob Storage.");
      }
    } catch (error) {
      console.error("Error uploading file to Azure Blob Storage:", error);
      setMessage(error.message);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      setIsUploading((prev) => ({ ...prev, [action]: { set: false, msg: "" } }));
      return;
    }
  }

  // Prepare payload
  const params = { tenantId, empId, expenseHeaderId: requiredObj.expenseHeaderId , lineItemId:formData?.editedFields?.lineItemId ?? ""};
  let payload ={}
  let api
  if(action ==="saveAndSubmit"){
  
    payload = {
      companyName: requiredObj?.companyName,
      createdBy: requiredObj?.createdBy,
      expenseHeaderNumber: requiredObj?.expenseHeaderNumber,
      defaultCurrency: requiredObj?.defaultCurrency,
      lineItem: {
        ...formData.fields,
        billImageUrl: previewUrl || undefined,
        ...(requiredObj.level === 'level3' ? { allocations: selectedAllocations } : {})
      }
    };
    api = postNonTravelExpenseLineItemApi(params, payload);
  }else{
   
    payload= {
      "travelType":requiredObj?.travelType,
      "expenseAmountStatus": requiredObj?.expenseAmountStatus,
      "expenseLine":formData?.fields ?? {},
      "editedExpesneLine":formData?.editedFields ?? {},
      "allocations":[]

    }
    api= editNonTravelExpenseLineItemsApi(params,payload)
  }
  

  if (requiredObj.level !== 'level3') {
    payload.allocations = selectedAllocations;
  }

  // Save the data
  setIsUploading((prev) => ({ ...prev, [action]: { set: true, msg: "" } }));
  



  try {

    const response = await api
    // const response = await postNonTravelExpenseLineItemApi(params, payload);
    setShowPopup(true);
    setMessage(response?.message);
    setShowForm(false)
    setFormData({approvers:[],fields:{}})
    setRequiredObj((prev)=>({...prev,"category":""}))
    setTimeout(async () => {
        setShowPopup(false);
        setMessage(null);
        setShowForm(false);
        
        

        try {
            const res = await getNonTravelExpenseLineItemsApi(tenantId, empId, requiredObj.expenseHeaderId);
            setRequiredObj((prev) => ({
                ...prev,
                "expenseLines": res?.expenseReport?.expenseLines||[],
            }));
        } catch (fetchError) {
            console.error("Error fetching expense line items:", fetchError);
            setMessage("Failed to update expense lines. Please try again.");
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
        }

        switch (action) {
            case "saveAndSubmit":
                return setSelectedFile(null), setIsFileSelected(false)
            case "saveAndNew":
                return window.location.reload(); // Reload the page
            default:
                break;
        }
    }, 5000);
} catch (error) {
    console.error("Error saving line item:", error);
    setIsUploading((prev) => ({ ...prev, [action]: { set: false, msg: "" } }));
    setMessage(error.message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
} finally {
    setIsUploading((prev) => ({ ...prev, [action]: { set: false, msg: "" } }));
}

};
console.log('form data 1',formData)


const handleOCRScan=()=>{
  
  if(requiredObj?.category){
    console.log('scanning for ocr...',requiredObj?.category)
    setErrorMsg(prev => ({...prev,category:{ set: false, msg: "" },}))
    if(requiredObj.category=== 'Utilities'){
      setCurrencyConversion(prev=>({...prev,payload:{...prev.payload,totalAmount:"209.00"}}))
      setFormData(prev => ({...prev,fields:{
        ...prev.fields,
          "Type of Utilities": "",
          "Bill Date": "2024-08-26",
          "Bill Number": "405-9950112-2887558",
          "Vender Name": "Jio Prepaid",
          "Description": "",
          "Quantity": "",
          "Unit Cost": "",
          "Tax Amount": "",
          "Total Amount": "209.00",
          "Mode of Payment": "",
          "Currency": {
              "countryCode": "IN",
              "fullName": "Indian Rupee",
              "shortName": "INR",
              "symbol": "₹"
          },
          
          "Category Name": "Utilities"
      
      
      
      }}))
      
    }if (requiredObj.category=== 'Meals' ){
      setFormData(prev => ({...prev,fields:{
        ...prev.fields,
          "Bill Date": "2024-07-21",
          "Bill Number": "24VHMPXU00013373",
          "Category Name": "Meals",
          "Currency": {
              countryCode: 'IN',
              fullName: 'Indian Rupee',
              shortName: 'INR',
              symbol: '₹'
          },
          "Quantity": "5",
          "Tax Amount": "7.575",
          "Total Amount": "318.15",
          "Vendor Name": "The Burger Club",
      }}))
      setCurrencyConversion(prev=>({...prev,payload:{...prev.payload,totalAmount:"318.15"}}))
    }
    
    
  }else{
    setErrorMsg(prev => ({...prev,category:{ set: true, msg: "Select the category" },}))
  }
 
}

console.log('form data 1',formData)
useEffect(() => {
  if (isFileSelected) {
    setIsUploading((prev) => ({ ...prev, autoScan: true }));

    setTimeout(() => {
      setIsUploading((prev) => ({ ...prev, autoScan: false }));
      setShowForm(true);

      // Ensure that scroll happens after the form is shown
      setTimeout(() => {
        const element = document.getElementById('newLineItem');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0); // Immediate timeout to allow DOM update
    }, 5000);
  }
}, [isFileSelected]);


/// Update Line Item
      
// const handleUpdateLineItem = async (lineItem ,data,totalAmount,date) => {

//   const lineItemId= lineItem.lineItemId;
//   let allowForm = true
//   const foundTotalAmtKey = totalAmountNames.find(key => Object.keys(lineItem).includes(key));
//   const expenseHeaderId1= expenseHeaderId || requiredObj?.expenseHeaderId
//   console.log('update line item ',data ,lineItem)
//   const data1 = {lineItem:data}


//   const firstKey = Object.keys(date)[0]

//       if(!currencyTableData  && currencyTableData?.currencyFlag){
//         setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: true, msg: `conversion not available!` } }));
//         allowForm = false;
//       }else {
//         setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: false, msg: "" } }));
//       }

//       if(!['Travel Insurance'].includes(formDataValues?.['Category Name']) && (!date[firstKey] || date[firstKey]=== "")){
//         setErrorMsg((prevErrors) => ({ ...prevErrors, dateErr: { set: true, msg: `Enter the ${firstKey}` } }));
//         allowForm = false;
//         console.log('date  is empty1' , date[firstKey])
//       }else {
//         setErrorMsg((prevErrors) => ({ ...prevErrors, dateErr: { set: false, msg: "" } }));
//       }

//   if (totalAmount === 0 || totalAmount === undefined || totalAmount ==="" ){
//     setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: true, msg: `Enter ${foundTotalAmtKey}` } }));
//     allowForm = false;
//     // console.log('total amount  is empty' , totalAmount)
//   } else {
//     setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: false, msg: "" } }));
//   }
  
//   handleEmptyValues(); // Ensure that any undefined or null values in formDataValues are set to ""

//   // const updatedFormData = {
    
//   //   lineItem :{
//   //     group:groupLimit,
//   //     'Category Name':selectedCategory || "",
//   //     ...formDataValues,
//   //     'Document': selectedFile || "",
//   //     'Currency':selectedCurrency || "",
//   //     multiCurrencyDetails :currencyTableData,
//   //     expenseLineAllocation :selectedAllocations,
//   //   }
//   // } 

//   // setFormDataValues(updatedFormData);
//   // console.log('filledLineItemDetails', updatedFormData);

// if(allowForm){   
//   try {
//     setIsUploading(true)
//     setActive(prevState => ({ ...prevState, saveLineItem: true }));
//     const response = await editNonTravelExpenseLineItemsApi(tenantId,empId,(requiredObj?.expenseHeaderId),lineItemId,data1);
//     setShowPopup(true)
//     setMessage(response?.message)
//    console.log('line item saved successfully',response?.message)
//   //  const newLine = {...updatedFormData?.lineItem , lineItemId : response?.lineItemId}
//    //setLineItemsData([...lineItemsData]);
//    setRequiredObj(prev => ({...prev, "expenseLines": [...requiredObj]})) 
//    setIsUploading(false)
//    setActive(prevState => ({ ...prevState, saveLineItem: false }));
//    setShowForm(false)
//    setSelectedLineItemId(null)
//    setTimeout(() => {setShowPopup(false);setMessage(null);},5000)

//   } catch (error) {
//     console.log('Error in fetching expense data for approval:', error.message);
//     setLoadingErrorMsg(error.message);
//     setActive(prevState => ({ ...prevState, saveLineItem: false }));
//     setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
//   }
// }
  
//   // Clear the selected file and reset the form data
//   setSelectedFile(null);
//   setIsFileSelected(false);
//   setFormDataValues({});
// };     
console.log('currency conversion',currencyConversion)
const handleCurrencyConversion = async ( {currencyName}) => { 
  const payload = {
    ...currencyConversion.payload,
    currencyName
  }
  let allowForm = true;
  
  if (currencyConversion.payload.totalAmount==="" || currencyConversion.payload.totalAmount===undefined){
    setErrorMsg((prevErrors) => ({ ...prevErrors, conversion: { set: true, msg: "Enter the amount" } }));
    allowForm = false;
  } else {
    setErrorMsg((prevErrors) => ({ ...prevErrors, conversion: { set: false, msg: "" } }));
  }

  if (allowForm) {
    ///api 
    setErrorMsg((prev) => ({ ...prev, conversion: { set: false, msg: "" } }));
    setIsUploading(prev=>({...prev,conversion:{set:true,msg:'fetching exchange rates...'}}))
    try {
         
      const response = await currencyConversionApi(tenantId,payload);
      if(response.currencyConverterData.currencyFlag){
        setCurrencyConversion(prev=>({...prev,response:response.currencyConverterData}))
        if(response.success){
          setFormData(prev => ({...prev,fields:{...prev.fields,isMultiCurrency:true, convertedAmountDetails: response?.currencyConverterData}}))
        }
      }else{
        
        setErrorMsg((prev) => ({ ...prev, conversion: { set: true, msg: "Exchange rates not available. Kindly contact your administrator." } }));
        setCurrencyConversion(prev=>({...prev,response:{}}))
        setFormData(prev => ({...prev,fields:{...prev.fields,
           isMultiCurrency:false, convertedAmountDetails: null}}))
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

const handleDashboardRedirection=()=>{
  console.log(dashboardBaseUrl)
  window.parent.postMessage('closeIframe', dashboardBaseUrl);
}

const handleSubmitOrDraft=async(action)=>{
  let allowForm = true
  const payload = {
    approvers:formData.approvers || [],
    expenseSettlement: formData.expenseSettlement || "",
  }


 
  // const data ={ expenseSettlement: selectedExpenseSettlement}
  // if(!selectedExpenseSettlement){
  //   setErrorMsg((prevErrors)=>({...prevErrors,expenseSettlement:{set:true, msg:'Select Expense Settlement'}}))
  //   allowForm= false
  // }else{
  //   setErrorMsg((prevErrors)=>({...prevErrors,expenseSettlement:{set:false, msg:''}}))
  //   allowForm = true
  // }
  const expenseHeaderIds = requiredObj?.expenseHeaderId  ||  expenseHeaderId
  console.log('main action ',expenseHeaderIds)
  if (action === "submit") { 
    let isValid = true;

    // Check for approval flow and approvers
    if (requiredObj?.approvalFlow && formData?.approvers?.length !== requiredObj?.approvalFlow?.length) {
        setErrorMsg(prev => ({
            ...prev,
            approversError: { 
                ...prev.approversError, 
                msg: `Please select ${requiredObj?.approvalFlow?.length} approver/s`, 
                set: true 
            }
        }));
        isValid = false;
    } else {
        setErrorMsg(prev => ({
            ...prev,
            approversError: { 
                ...prev.approversError, 
                set: false 
            }
        }));
    }

    // Check for expense settlement
    if (!formData?.expenseSettlement) {
        setErrorMsg(prev => ({
            ...prev,
            settlementError: { 
                ...prev.settlementError, 
                msg: 'Select the settlement mode', 
                set: true 
            }
        }));
        isValid = false;
    } else {
        setErrorMsg(prev => ({
            ...prev,
            settlementError: { 
                ...prev.settlementError, 
                set: false 
            }
        }));
    }

    // Set the final allowForm state based on validation
    allowForm = isValid;
}

   
    if(allowForm){
    try{
         if(action === "draft"){
          setIsUploading(prevState => ({ ...prevState, saveAsDraft: true }));
         }else if (action === "submit"){
          setIsUploading(prevState => ({ ...prevState, submit: true }))
         }else if (action === "deleteHeader"){
          setIsUploading(prevState => ({ ...prevState, deleteHeader: true }))
         }
        const response = await submitOrSaveAsDraftNonTravelExpenseApi({action,tenantId,empId,expenseHeaderId:expenseHeaderIds,payload})
        setIsLoading(false)
        setShowPopup(true)
        setMessage(response.message)

        setIsUploading(false)
        if(action === "draft"){
          setIsUploading(prevState => ({ ...prevState, saveAsDraft: false }));
         }else if (action === "submit"){
          setIsUploading(prevState => ({ ...prevState, submit: false }))
         }else if (action === "deleteHeader"){
          setIsUploading(prevState => ({ ...prevState, deleteHeader: false }))
         }
        setTimeout(()=>{
          setShowPopup(false)
          setMessage(null)
         
          if(action === "deleteHeader" || action === "submit"  ){
          // urlRedirection(`${dashboard_url}/${tenantId}/${empId}/overview`)}
          handleDashboardRedirection()
          }
        },5000)

      }catch(error){
        setIsUploading(false)
        if(action === "draft"){
          setIsUploading(prevState => ({ ...prevState, saveAsDraft:false }));
         }else if (action === "submit"){
          setIsUploading(prevState => ({ ...prevState, submit:false }))
         }else if (action === "deleteHeader"){
          setIsUploading(prevState => ({ ...prevState, deleteHeader:false }))
         }
        setShowPopup(true)
        setMessage(error.message)
        setTimeout(()=>{
          setShowPopup(false)
          setMessage(null)
        },3000)
        console.error('Error confirming trip:', error.message);
      }  }

    }


      // const handleOpenModal=(id)=>{
      //   if(id==='upload'){
      //     setOpenModal('upload')
      //   }
      //   if(id==='form'){
      //     setOpenModal('form')
      //   }
      //  }

      //  const handleCurrency = (value)=>{
      //   const selectedCurrencyObject = currencyDropdown.find(currency => currency.shortName === value);
      //   setSelectedCurrency(selectedCurrencyObject)

      //   if(value === requiredObj?.defaultCurrency?.shortName){
      //     setCurrencyTableData(null)
      //   }
        
      //  }


      
     
   
      // const handleOcrScan = async () => {
      //   // console.log('ocrfile from handle', ocrSelectedFile);
      
      //   const ocrData = new FormData();
      //     ocrData.append('categoryName', selectedCategory);
      //     ocrData.append('file', ocrSelectedFile);
      
      //   console.log('ocrfile from handle',ocrData)
      
      //      setIsUploading(prevState =>({...prevState, scan: true}));
          
      //     setTimeout(() => {
      //       setShowForm(true) ;setOpenModal(null); setShowPopup(false);setIsUploading(false);
      //     }, 5000);
      //   // try {
      //   //   setIsUploading(prevState =>({...prevState, scan: true}));
      
      //   //  // Assuming ocrScanApi is an asynchronous function
      //   //   const response = await ocrScanApi(ocrData); important 
      
         
      
          
      
      //   //   setIsUploading(prevState =>({...prevState, scan: false}));
          
      //   //   setTimeout(() => {
      //   //     setFormVisible(true) ;setOpenModal(null); setShowPopup(false);
      //   //   }, 3000);
          
      //   // } catch (error) {
      //   //   setIsUploading(prevState =>({...prevState, scan: false}));
      //   //   setLoadingErrMsg(error.message);
      //   //   setMessage(error.message);
      //   //   setShowPopup(true);
      
      //   //   setTimeout(() => {
      //   //     setShowPopup(false);
      //   //   }, 3000);
      //   // } 
      // };
      
      // const handleOcrScan = async () => {
      //   // console.log('ocrfile from handle', ocrSelectedFile);
      
      //   const editData = new FormData();
      //     editData.append('file', ocrSelectedFile);
      
      //   console.log('ocrfile from handle',editData)
      
      //   try {

      //     setIsUploading(true);
          
      //     // Assuming ocrScanApi is an asynchronous function
      //     const response = await nonTravelOcrApi(editData);
      
      //     if (response.error) {
      //       loadingErrorMsg(response.error.message);
      //       setCurrencyTableData(null);
      //     } else {
      //       loadingErrorMsg(null);
      //       setOcrField(response.data);
      
      //       if (!currencyTableData.currencyFlag) {
      //         setErrorMsg((prevErrors) => ({
      //           ...prevErrors,
      //           currencyFlag: { set: true, msg: 'OCR failed, Please try again' },
      //         }));
      //         console.log('Currency is not found in onboarding');
      //       }
      //     }
      //   } catch (error) {
      //     loadingErrorMsg(error.message);
      //     setMessage(error.message);
      //     setShowPopup(true);
      
      //     setTimeout(() => {
      //       setShowPopup(false);
      //     }, 3000);
      //   } finally {
      //     setIsUploading(false);
      //   }
      // };
      const handleSettlementMethod = (option)=>{
        setFormData(prev => ({...prev,expenseSettlement:option}))
       }

      const handleSelectCategory = async(option) => {
        console.log('handle category',option)
        // setRequiredObj((prev) => ({
        //   ...prev,
        //   category: option,
        // }));
        let expenseHeaderId 
        let api
  
        try {
          setIsUploading(prev=>({...prev, "selectCategory":true}))
          //setActive(true)
          if(requiredObj?.reimbursementHeaderId){
            expenseHeaderId =requiredObj?.reimbursementHeaderId
            api = await getCategoryFormElementApi(tenantId,empId,option,expenseHeaderId)
          }
          else{
            api = await getCategoryFormElementApi(tenantId,empId,option)
          }
          const response = api
          setIsUploading(prev=>({...prev, "selectCategory":false}))
          
          setExpenseLineAllocation(response?.newExpenseAllocation) || []
          const allocation1 = response?.newExpenseAllocation
          const initialExpenseAllocation = allocation1 && allocation1.map(({  headerName }) => ({
            headerName,
            headerValue: "" // Add "headerValue" and set it to an empty string
          }));

          console.log('intial allocation on category11', initialExpenseAllocation)
          setSelectedAllocations(initialExpenseAllocation)
          
         // sessionStorage.setItem('sessionExpenseHeaderId', (response?.expenseHeaderId ?? null));
         console.log('required fields',response?.fields)
         //const expenseSettlementOptions = Object.keys(response?.expenseSettlementOptions).filter((option) => response?.expenseSettlementOptions[option]) || [];
         console.log('expense settlement options', response?.expenseSettlementOptions)

          setRequiredObj(prev => ({...prev,
            "companyName":response?.companyName,
            "defaultCurrency":response?.defaultCurrency,
            "fields":response?.fields || [],
            "class":response?.class || [],
            "expenseHeaderStatus":response?.expenseHeaderStatus?? "-",
            "expenseHeaderId":response?.expenseHeaderId ?? null,
            "expenseHeaderNumber":response?.expenseHeaderNumber,
            "createdBy":response?.createdBy,
            "category":response?.categoryName,
            "groupLimit":response?.group || {},
            "allocation":response?.newExpenseAllocation || [],
            //---approvers data
            // "listOfAllManagers":response?.getApprovers?.listOfManagers || [],
            // "APPROVAL_FLAG":response?.getApprovers?.APPROVAL_FLAG, //boolean
            //  "approvalFlow":response?.getApprovers?.approvalFlow ||[],
            //  "MANAGER_FLAG"  :response?.getApprovers?.MANAGER_FLAG, //boolean
            //  expenseSettlementOptions
           //---approvers data --end
          }))
  
          
          
          // sessionStorage.setItem("expenseHeaderId", response?.expenseHeaderId);
          //setReimbursementHeaderId(response?.expenseHeaderId)
          
          console.log('expense data for approval fetched.',response);
          let updatedFields = initializenonTravelFormFields(response?.fields, {
            "defaultCurrency": response.defaultCurrency || "", // or any other logic to set default values
            categoryName: option || "",
            group:response?.group || {}
          });
          
          // if (!actionType==="editLineItem"){
            setFormData((prevData) => ({
              ...prevData,
              fields: updatedFields,
            }));
          
         

          console.log('Updated FormData:', updatedFields);
         
        } catch (error) {
          setIsUploading(prev=>({...prev, "selectCategory":false}))
          console.log('Error in fetching expense data for approval:', error.message);
          setLoadingErrorMsg('message',error.message);
          setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
        }
        
        
      

      };
      console.log('both state',requiredObj,formData)
      
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

    console.log('required object', requiredObj) 
    console.log('form data', formData) 
    console.log('selected allocation', selectedAllocations) 
    const updateApprovers = (option) => {
      // Create a deep copy of formData
      const formData_copy = JSON.parse(JSON.stringify(formData));
      
      // Push the new approver to the approvers array
      formData_copy.approvers.push({
          name: option.employeeName,
          empId: option.employeeId,
          status: 'pending approval',
          imageUrl: option.imageUrl
      });
      
      
      setFormData(formData_copy);
  };
  

     const listOfAllManagers = requiredObj?.listOfAllManagers
    const APPROVAL_FLAG = requiredObj?.APPROVAL_FLAG
    

  return (
    <div>
        {isLoading ? <Error message={loadingErrorMsg}/> :
        <>      
        <div className="w-full h-full  font-cabin tracking-tight ">
          <div className='p-4'>
        <div className='inline-flex p-2 gap-2 border-[1px] w-full  border-indigo-600 bg-indigo-50'> 
        <img src={validation_sym} width={16} height={16} alt='validation'/> 
        <span className='text-indigo-600'> 
If the required category is unavailable, Kindly contact the administrator.</span>
        </div>           
        <div className="flex flex-col lg:flex-row justify-between  items-start lg:items-end my-5 gap-2">
<div className='flex sm:flex-row flex-col items-start gap-2'> 
<div className='relative flex flex-col h-[73px] justify-start item-start gap-2'>
      <div className="text-zinc-600 text-sm font-cabin select-none mt-2">Categories</div>
      <div onClick={(e)=>{e.stopPropagation(); setCategorySearchVisible(pre=>!pre)}} className={`min-h-[50px] h-fit min-w-[200px] w-fit px-2 py-2 border  flex gap-2 bg-gray-100 ${errorMsg?.category?.set ? 'border-red-600' : 'border-slate-300'}  hover:bg-gray-200 rounded-sm items-center transition ease-out hover:ease-in cursor-pointer`}>
                                         {requiredObj.category && <div className="bg-white p-2 rounded-full " >                            
                                         <img src={isUploading.selectCategory? "" :categoryIcons[requiredObj.category]} className='w-4 h-4 rounded-full'/>
                                         </div>}
                                        
                                        <div className="text-neutral-700 text-normal text-sm sm:text-[14.5px] font-cabin -mt-1 sm:mt-0"> {isUploading?.selectCategory ? "loading..." :( !requiredObj.category ? 'Select Category' : requiredObj?.category )}</div>
                                        </div>
      
      {categorySearchVisible &&
      <div className='absolute top-[84px] z-10'>
       <Search
       visible={categorySearchVisible}
       setVisible={setCategorySearchVisible}
       searchChildren={'categoryName'}
       onSelect={(option) => { handleSelectCategory(option)}}
       options={requiredObj?.expenseCategories} 
       title='Select the requied category.'
       />
       </div>}
     

</div>

<div className='mt-4 sm:mt-12 inline-flex space-x-2'>
    <FileUpload loading={isUploading.autoScan} onClick={handleOCRScan} selectedFile={selectedFile} setSelectedFile={setSelectedFile} isFileSelected={isFileSelected} setIsFileSelected={setIsFileSelected}  text={<div className='inline-flex items-center space-x-1'><img src={scan_icon} className='w-5 h-5'/> <p>Auto Scan</p></div>}/>
    <Button1 onClick={handleMannualBtn} text={<div className='inline-flex items-center space-x-1'><img src={modify_icon} className='w-5 h-5'/> <p>Manually</p></div>}/>
</div>
</div>


      {/* //  }   */}
       

{requiredObj?.expenseLines?.length > 0 && (
  <div className="flex gap-2 flex-col sm:flex-row">
    {requiredObj?.expenseHeaderStatus !== 'pending settlement' && (
      <>
        <Button1 loading={isUploading.submit} variant="fit" text="Submit" onClick={() => handleSubmitOrDraft("submit")} />
        <Button1 loading={isUploading.saveAsDraft} text="Save as Draft" onClick={() => handleSubmitOrDraft("draft")} />
      </>
    )}
    <CancelButton variant="fit" text="Delete" onClick={()=>{setModalOpen(true);setActionType("cancelExpense")}} />
    <div className="flex items-center justify-center rounded-sm hover:bg-slate-100 p-1 cursor-pointer" onClick={()=>handleDashboardRedirection()}>
          <img src={cancel_icon} className="w-5 h-5"/> 
    </div> 
  </div>
)}


        </div>
        <div className='flex flex-col sm:flex-row gap-2 gap-y-2'>
        {APPROVAL_FLAG && <div className='flex items-center relative '>
                            <div className='flex flex-col h-[73px] justify-start item-start gap-2'>
                                <div className="text-zinc-600 text-sm font-cabin select-none">Approvers</div>
                                <div className='flex gap-2 flex-wrap'>
                                    {formData.approvers && formData.approvers.length>0 && formData.approvers.map((approver, index)=>
                                    <div
                                        key={index}
                                        onClick={()=>setFormData(pre=>({...pre, approvers:pre.approvers.filter(emp=>emp.employeeId != approver.employeeId)}))}
                                        className={`max-h-12 h-fit min-w-[200px] w-fit px-2 py-2 border  flex gap-2 bg-white  border-slate-300  hover:bg-gray-200 rounded-md items-center transition ease-out hover:ease-in cursor-pointer`}>
                                        <img src={approver?.imageUrl??'https://blobstorage0401.blob.core.windows.net/avatars/IDR_PROFILE_AVATAR_27@1x.png'} className='w-8 h-8 rounded-full' />
                                        <div className="text-neutral-700 text-normal text-sm sm:text-[14.5px] font-cabin -mt-1 sm:mt-0">{approver.name}</div>
                                        <div className='-mt-1'>
                                            <img src={close_gray_icon} className='w-4 h-4'/>
                                        </div>
                                    </div>)}
                                    {formData?.approvers?.length < requiredObj?.approvalFlow?.length && formData?.approvers?.length != 0 && <p onClick={()=>setApproversSearchVisible(pre=>!pre)} className='text-sm text-blue-700 hover:text-blue-800 underline cursor-pointer'>Add More</p>}
                                    {formData.approvers && formData.approvers.length == 0 && <p onClick={(e)=>{e.stopPropagation(); setApproversSearchVisible(pre=>!pre)}} className={`min-h-12 h-fit min-w-[200px] w-fit px-2 py-2 border  flex gap-2 bg-gray-100 border-slate-300  hover:bg-gray-200 rounded-sm items-center transition ease-out hover:ease-in cursor-pointer`}>{'Unassigned'}</p>}
                                    {errorMsg?.approversError?.set && formData?.approvers?.length < requiredObj?.approvalFlow?.length  && <p className='absolute top-[72px] text-red-600 font-cabin text-sm whitespace-nowrap'>{errorMsg?.approversError?.msg}</p>}
                                </div>
                            </div>

                            {approversSearchVisible && <div className='absolute'>
                                <Search
                                    visible={approversSearchVisible}
                                    setVisible={setApproversSearchVisible}
                                    searchChildren={'employeeName'}
                                    title='Who will Approve this?'
                                    placeholder="Name's of managers approving this"
                                    onSelect={(option) => { updateApprovers(option) }}
                                    error={errorMsg.approversError}
                                    currentOption={formData.approvers && formData.approvers.length > 0 ? formData.approvers : []}
                                    options={listOfAllManagers} />
                                </div>}
                        </div>}
                        <Select 
                        variant="max-w-[200px]"
                        currentOption={requiredObj?.expenseSettlement}
                        options={requiredObj?.expenseSettlementOptions}
                        onSelect={handleSettlementMethod}
                        error={errorMsg?.settlementError}
                        placeholder='Select Travel Expense'
                        title='Expense Settlement'
                      />
</div>


{requiredObj?.createdBy && 
 requiredObj?.expenseHeaderNumber && 
 requiredObj?.expenseHeaderStatus && 
 requiredObj?.defaultCurrency && (
  <HeaderComponent 
    createdBy={requiredObj.createdBy}
    expenseHeaderNumber={requiredObj.expenseHeaderNumber}
    expenseHeaderStatus={requiredObj.expenseHeaderStatus}
    defaultCurrency={requiredObj.defaultCurrency}
  />
)}

        </div>
    
     {/* {categoryElement.length>0 && <div className="w-fit my-5" >
           <AddMore text={"Add Line Item"} onClick={()=>handleOpenModal('form')}/>
     </div>} */}


    

{/* //----------- edit line item--start---------------------- */}
<div className=''>
{(requiredObj?.expenseLines)?.map((lineItem , index)=>(

   (lineItem.lineItemId === selectedLineItemId && requiredObj?.fields.length>0 && actionType==="editLineItem") ?
  //edit form view
  <>
  
<div className='w-full border flex flex-col md:flex-row relative border-t-2 border-slate-300 h-screen p-4 pb-16 '>
  <div className='w-full sm:w-3/5 h-full border border-slate-300 rounded-md'>
    <DocumentPreview initialFile={lineItem.billImageUrl}/>
   
  </div>
  <div className='w-full sm:w-2/5 overflow-auto h-full' key={index}>  
 
     <LineItemForm 
  currencyConversion={currencyConversion}
  categoryName={requiredObj.category}
  setErrorMsg={setErrorMsg} 
  isUploading={isUploading}
  defaultCurrency={requiredObj.defaultCurrency}
  setCurrencyConversion={setCurrencyConversion}
  handleCurrencyConversion={handleCurrencyConversion}
  setFormData={setFormData}
  formData={formData?.fields}
  handleAllocations={handleAllocations}
  allocationsList={requiredObj.allocation}
  errorMsg={errorMsg}
  onboardingLevel={requiredObj.level ?? "level3"}
  lineItemDetails={formData?.fields}
  categoryFields={requiredObj?.fields}
  classOptions={requiredObj?.class}
  />
     
  </div>
  <div className='absolute -left-4 mx-4 inset-x-0 w-full  z-20 bg-slate-100   h-16 border border-slate-300 bottom-0'>
      <ActionBoard 
      showButton={true} 
      title1={"Delete"} 
      title={"Update"} 
      handleDelete={()=>{setModalOpen(true);setActionType("deleteLineItem");setSelectedLineItemId(lineItem?.lineItemId)}}
      handleClick={()=>handleSaveLineItem("updateLineItem")} 
      isUploading={isUploading} 
      setModalOpen={setModalOpen} 
      setActionType={setActionType} />
    </div>
</div> 
</> 
   :
<>
<div className='w-full flex flex-col sm:flex-row h-screen px-4 mt-2'>
  <div className='w-full sm:w-3/5 h-full border border-slate-300 rounded-md'>
    <DocumentPreview initialFile={lineItem.billImageUrl}/>
  </div>
  <div className='w-full sm:w-2/5 h-full' key={index}>  
     <div className=''>
     <LineItemView  index={index}  lineItem={lineItem} handleEdit={handleEdit} isUploading={isUploading}  handleDeleteLineItem={()=>{setModalOpen(true);setActionType("deleteLineItem");setSelectedLineItemId(lineItem?.lineItemId)}}/>
     </div> 
  </div>
</div> 
</>  
   ))}
</div>   
 



{/* //----------- edit line item--end---------------------- */}


               
     
         
        
{/* //---------save line item form----------------------- */}
<div id='newLineItem'>
{showForm &&
<div  className='w-full border flex flex-col md:flex-row relative border-t-2 border-slate-300 h-screen p-4 pb-16 '>
  {selectedFile &&
<div onClick={()=>handleRemoveFile()} className={`absolute rounded-md top-8 left-8 p-4 bg-white shadow-lg shadow-black/40  sm:block cursor-pointer hidden`}>
      <img src={delete_icon} className='w-6 h-6'/>
</div>}
<div className='w-full md:w-3/5 md:block hidden h-full overflow-auto border border-slate-300 rounded-md'>
    <DocumentPreview isFileSelected={isFileSelected} setIsFileSelected={setIsFileSelected} selectedFile={selectedFile} setSelectedFile={setSelectedFile} initialFile=""/>
    
  </div>
  <div className='w-full md:w-2/5 h-full overflow-auto'>
  
  <LineItemForm 
  currencyConversion={currencyConversion}
  categoryName={requiredObj.category}
  setErrorMsg={setErrorMsg} 
  isUploading={isUploading}
  defaultCurrency={requiredObj.defaultCurrency}
  setCurrencyConversion={setCurrencyConversion}
  handleCurrencyConversion={handleCurrencyConversion}
  setFormData={setFormData}
  formData={formData.fields}
  handleAllocations={handleAllocations}
  allocationsList={requiredObj.allocation}
  errorMsg={errorMsg}
  onboardingLevel={requiredObj.level ?? "level3"}
  lineItemDetails={formData.fields}
  categoryFields={requiredObj?.fields}
  classOptions={requiredObj?.class}
  />




</div>
<div className='absolute -left-4 mx-4 inset-x-0 w-full  z-20 bg-slate-100   h-16 border border-slate-300 bottom-0'>
    <ActionBoard title={"Save"} handleClick={()=>handleSaveLineItem("saveAndSubmit")} isUploading={isUploading} setModalOpen={setModalOpen} setActionType={setActionType}/>
</div>
</div>}
</div>

{/* //---------save line item form end----------------------- */}

           {/* {openModal==='form' && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 " >
                <div className='z-10 max-w-4/5  md:mx-0 mx-4   sm:w-2/5 w-full min-h-4/5 max-h-4/5  bg-white  rounded-lg shadow-md'>
                <div onClick={()=>setOpenModal(null)} className=' w-10 h-10 flex mr-5 mt-5 justify-center items-center float-right   hover:bg-red-300 rounded-full'>
                      <img src={cancel_icon} className='w-8 h-8'/>
                  </div>
                    <div className="p-10">
                        <p className="text-xl  text-center font-cabin">Seletct option for Enter Expense Line</p>
                        <div className="flex mt-10 md:gap-24  gap-4 justify-between md:flex-row flex-col">
                          <div className='w-full'> 
                            <Button className='fit' variant='' text='Scan' onClick={()=>handleOpenModal('upload')}  />
                            </div>
                            <div className='w-full'> 
                            <Button variant='' text='Manually' onClick={()=>{setShowForm(true);handleModal()}} />
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            } */}

{/* {openModal==='upload' && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none " >
                <div className='z-10  md:w-3/5 w-full mx-8  min-h-4/5 max-h-4/5 scroll-none bg-white  rounded-lg shadow-md'>
                <div onClick={()=>{setOpenModal(null);setOcrSelectedFile(null);setOcrFileSelected(false);setSelectedCategory(null)}} className=' w-10 h-10 flex justify-center items-center float-right  mr-5 mt-5 hover:bg-red-300 rounded-full'>
                      <img src={cancel_icon} className='w-8 h-8'/>
                      </div>
                    <div className="p-10">
                    
                      <div className="flex flex-col justify-center items-center">
                       

                       
                        {ocrFileSelected ? 
                        
                        <div className="w-full  flex flex-col justify-center gap-4   ">
                        <p>Document Name: {ocrSelectedFile.name}</p>
                        <div className={` w-fit`}>
                        <Button disabled={isUploading}  text='reupload' onClick={()=>{setOcrFileSelected(false);setOcrSelectedFile(null)}}/>
                        </div>
                        <p>Size: {selectedFile.size} bytes</p>
                        <p>Last Modified: {selectedFile.lastModifiedDate.toString()}</p>
                        <div className="w-full  px-4 h-[500px]">
                        {ocrSelectedFile.type.startsWith('image/') ? (
                          
                          <img
                            src={URL.createObjectURL(ocrSelectedFile)}
                            alt="Preview"
                            width="100%"
                            height="100%"
                            
                          />
                          
                        ) : ocrSelectedFile.type === 'application/pdf' ? (
                          <embed
                            src={URL.createObjectURL(ocrSelectedFile)}
                            type="application/pdf"
                            width="100%"
                            height="100%"
                            onScroll={false}
                          />
                        ) : (

                          <p>Preview not available for this file type.</p>

                        )}
                        </div>
                         <Button loading={isUploading?.scan} active={isUploading?.scan} variant='fit' text='Scan' onClick={handleOcrScan} disabled={selectedCategory== null ? true : false}/>
                      </div>:
                      <>
                       <p className="text-xl font-cabin">Upload the document for scan the fields.</p>
                                  <div className="w-fit">
                                   <Upload
                                   selectedFile={ocrSelectedFile}
                                   setSelectedFile={setOcrSelectedFile}
                                   isFileSelected={ocrFileSelected}
                                   setIsFileSelected={setOcrFileSelected}/>
                                  </div>
                                  </> }
                        
                           
                        
                        </div>

                    </div>
                </div>
                </div>
            } */}
           
        </div>
        
       
        
        </>
         }
      
      <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>
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
    </div>
  )
}

export default CreateNonTraveExpense


// function LineItemView({ index, lineItem, handleEdit, handleDeleteLineItem, isUploading, active }) {
//   const excludedKeys = ['isMultiCurrency', 'Category Name', 'expenseLineId', 'Currency', 'billImageUrl', 'group', 'expenseLineAllocation', 'multiCurrencyDetails', 'lineItemStatus', 'lineItemId', '_id'];

//   return (
//     <div className="flex flex-col justify-between h-screen overflow-y-auto scrollbar-hide ">
//       <div className="sticky top-0 bg-white z-20 w-full flex items-center h-12 px-4 border-dashed  border-y border-slate-300 py-4">
//         <div className="flex items-center justify-center gap-2">
//           <div className="bg-slate-100 p-2 rounded-full">
//             <img src={categoryIcons[lineItem?.['Category Name']]} className="w-4 h-4 rounded-full" />
//           </div>
//           <p>{index + 1}. {lineItem?.['Category Name']}</p>
//         </div>
//       </div>

//       <div className="px-4">
//         {lineItem?.expenseLineAllocation?.map((allocation, i) => (
//           <div key={i} className="w-full min-h-[52px]">
//             <div className="text-zinc-600 text-sm font-cabin capitalize">{allocation.headerName}</div>
//             <div className="w-full h-12 bg-white flex items-center border border-neutral-300 rounded-md">
//               <div className="text-neutral-700 w-full h-full text-sm font-cabin px-6 py-2">{allocation.headerValue}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="w-full flex flex-col items-start py-4 px-4 gap-y-4">
//         {Object.entries(lineItem).map(([key, value]) => (
//           !excludedKeys.includes(key) && (
//             <div key={key} className="w-full min-h-[52px]">
//               {key !== 'Currency' && <div className="text-zinc-600 text-sm font-cabin">{titleCase(key)}</div>}
//               <div className="w-full h-[48px] bg-white flex items-center border border-neutral-300 rounded-md">
//                 <div className="text-neutral-700 w-full h-10 text-sm font-cabin px-6 py-2">
//                   {totalAmountKeys.includes(key)
//                     ? `${lineItem['Currency']?.shortName} ${value}`
//                     : `${key === 'group' ? value?.group : value}`}
//                 </div>
//               </div>
//               {totalAmountKeys.includes(key) && (lineItem?.multiCurrencyDetails?.convertedAmount > (lineItem?.group?.limit || 0)) && (
//                 <div className="w-[200px] text-xs text-yellow-600 font-cabin line-clamp-2">{lineItem?.group?.message}</div>
//               )}
//             </div>
//           )
//         ))}

//         {lineItem?.multiCurrencyDetails && (
//           <div className="px-4 mb-3">
//             <div className="min-w-[200px] w-full h-auto flex flex-col gap-2">
//               <div className="text-zinc-600 text-sm font-cabin">Converted Amount Details:</div>
//               <div className="w-full h-full text-sm font-cabin border border-neutral-300 rounded-md">
//                 <div className="sm:px-6 px-4 py-2 flex sm:flex-row flex-col justify-between bg-slate-100 rounded-md">
//                   <div className="text-[16px] font-semibold text-neutral-600">Total Amount</div>
//                   <div className="text-neutral-600">{lineItem?.multiCurrencyDetails?.defaultCurrency} {lineItem?.multiCurrencyDetails?.convertedAmount?.toFixed(2)}</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="sticky bottom-0 bg-white flex flex-row gap-4 items-center px-4 py-2 border-t border-t-slate-300 ">
//         <Button1 text="Edit" disabled={isUploading} loading={isUploading} active={active?.edit?.id === lineItem?.lineItemId && active?.edit?.visible} onClick={() => handleEdit(lineItem?.lineItemId, lineItem?.['Category Name'])} />
//         <Button1 text="Delete" disabled={isUploading} loading={isUploading} active={active?.delete?.id === lineItem?.lineItemId && active?.delete?.visible} onClick={() => handleDeleteLineItem(lineItem?.lineItemId)} />
//       </div>
//     </div>
//   );
// }








const  HeaderComponent =({createdBy, expenseHeaderNumber, expenseHeaderStatus ,defaultCurrency }) =>(

    <div className='my-5'>
    <div className="flex md:flex-row flex-col gap-2 justify-between w-full  ">
  <div className=" md:w-1/5 w-full  flex  border-[1px] border-slate-300 rounded-md flex-row items-center gap-2 p-2 ">
    <div className="bg-slate-200 rounded-full p-4 shrink-0 w-auto">
      <img src={user_icon} className="w-[22px] h-[22px] "/>
      </div>
<div className='font-cabin '>
      <p className=" text-neutral-600 text-xs ">Created By</p>

  <p className="text-purple-500 capitalize">
    { createdBy?.name ?? "-"}
  </p>

</div>
  </div>
  <div className="   flex md:w-3/5 w-full border-[1px] border-slate-300 rounded-md flex-row items-center gap-2 p-2 ">
    <div className="bg-slate-200 rounded-full p-4 shrink-0 w-auto ">
      <img src={receipt} className="w-5 h-5  "/>
      </div>
  <div className="flex flex-row justify-between w-full gap-2 ">
     
      <div className=' flex-1 font-cabin  px-2 '>
      <p className=" text-neutral-600 text-xs line-clamp-1">Expense Header No.</p>
     
      <p className="text-purple-500 text-medium font-medium">{expenseHeaderNumber}</p>
      </div>

      <div className=' flex-1 font-cabin  px-2  '>
      <p className=" text-neutral-600 text-xs line-clamp-1">Status</p>
     
      <p className="text-purple-500   text-medium font-medium capitalize">{expenseHeaderStatus}</p>
      
      </div>
      
      </div> 
       
  </div>
  <div className="   flex md:w-1/5 w-full border-[1px] border-slate-300 rounded-md flex-row items-center gap-2 p-2 ">

    <div className="bg-slate-200 rounded-full p-4 shrink-0 w-auto">
      <img src={briefcase} className="w-4 h-4 "/>
      </div>
  
      <div className='font-cabin '>
      <p className=" text-neutral-600 text-xs ">Default Currency</p>
      <p className="text-purple-500 text-medium font-medium">{defaultCurrency?.shortName}</p>
      </div>
     
      
  </div>
 
 
   
        
   
       
   
</div>   
            
    </div> 
  
)

const ActionBoard = ({showButton= false,title, handleDelete, title1, handleClick,isUploading,setModalOpen, setActionType})=>{

  return(
    <div className='flex justify-between px-4 items-center h-full w-full'>
             <p className='text-start whitespace-nowrap left-14 top-8 text-red-600 text-sm font-inter'><sup>*</sup>Kindly check the fields before saving the line item.</p>
    <div className='flex gap-1'>
      {/* <Button1  loading={isUploading?.saveAndNew?.set}      text='Save and New'    onClick={()=>handleClick("saveAndNew")}/> */}
      <Button1  loading={isUploading?.saveAndSubmit?.set}      text={title} onClick={handleClick}/>
      {showButton &&<CancelButton  loading={isUploading?.saveLineItem?.set} text={title1}          onClick={handleDelete}/>} 
      <CancelButton  loading={isUploading?.saveLineItem?.set} text='Cancel'          onClick={()=>{setModalOpen(true);setActionType("closeAddExpense")}}/>
    
    </div>

    
    </div>
  )
}
