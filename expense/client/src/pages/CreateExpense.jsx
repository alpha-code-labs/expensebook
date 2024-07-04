
/* eslint-disable react/jsx-key */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
//prepleaf

import React,{ useState, useEffect , useRef} from "react";
import {BrowserRouter as Router, useParams} from 'react-router-dom';
import Icon from "../components/common/Icon";
import { getStatusClass, titleCase, urlRedirection } from "../utils/handyFunctions";
import Button from "../components/common/Button";
import Error from "../components/common/Error";
import PopupMessage from "../components/common/PopupMessage";
import { cab_purple as cab_icon, airplane_1 as airplane_icon ,house_simple , chevron_down,  cancel_icon, modify, check_tick, file_icon, validation_sym, validation_symb_icon, upcoming_trip, briefcase, money, user_icon, arrow_left} from "../assets/icon";
import { tripDummyData, tripDummyDataLevel2 } from "../dummyData/tripDummyData.js";
import { hrDummyData } from "../dummyData/requiredDummy";
import Select from "../components/common/Select"; 
import ActionButton from "../components/common/ActionButton";
import Input from "../components/common/Input";
import Upload from "../components/common/Upload";
import { cancelTravelExpenseHeaderApi, cancelTravelExpenseLineItemApi, getTravelExpenseApi, ocrScanApi, postMultiCurrencyForNonTravelExpenseApi, postMultiCurrencyForTravelExpenseApi, postTravelExpenseLineItemApi, submitOrSaveAsDraftApi, updateTravelExpenseLineItemApi } from "../utils/api.js";
import Search from "../components/common/Search.jsx";
import GoogleMapsSearch from "./GoogleMapsSearch.jsx";
import { classDropdown } from "../utils/data.js";
import Toggle from "../components/common/Toggle.jsx";
import AddMore from "../components/common/AddMore.jsx";
import { BlobServiceClient } from "@azure/storage-blob";

const currencyDropdown = [
  { fullName: "Argentine Peso", shortName: "ARS", symbol: "$", countryCode: "AR" },
  { fullName: "Australian Dollar", shortName: "AUD", symbol: "A$", countryCode: "AU" },
  { fullName: "United States Dollar", shortName: "USD", symbol: "$", countryCode: "US" },
  {
    fullName: "Chinese Yuan Renminbi",
    shortName: "CNY",
    symbol: "¥",
    countryCode: "CN"
  },
  {
    "fullName": "Bangladeshi Taka",
    "shortName": "BDT",
    "symbol": "৳",
    "countryCode": "BD"
  },
  {"countryCode": "IN","fullName": "Indian Rupee","shortName": "INR","symbol": "₹"}
];
const totalAmountNames = ['Total Fare','Total Amount',  'Subscription cost', 'Cost', 'Premium Cost'];
const dateForms = ['Invoice Date', 'Date', 'Visited Date', 'Booking Date',"Bill Date"];




export default function () {
  const {cancel , tenantId,empId,tripId} = useParams() ///these has to send to backend get api
  
  const az_blob_container = import.meta.env.VITE_AZURE_BLOB_CONTAINER
   const blob_endpoint = import.meta.env.VITE_AZURE_BLOB_CONNECTION_URL
   const dashboard_url = import.meta.env.VITE_DASHBOARD_URL
   const DASHBOARD_URL=`${dashboard_url}/${tenantId}/${empId}/overview`
 
   async function uploadFileToAzure(file) {
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
  

 
//if ocr data will be there
const ocrValues = {
  'Bill Date' : "2024-01-19",
  'Bill Number': '5497579396',
  'Vendor Name' :"Uncle Jack's",
  'Description': '', 
  'Quantity': "1",
  'Unit Cost' : "209", 
 'Tax Amount': "5.99", 
 'Total Amount':"136"
 }

  const [ocrFileSelected , setOcrFileSelected]=useState(false)
  const [ocrSelectedFile , setOcrSelectedFile]=useState(null)
  const [ocrField , setOcrField]=useState(ocrValues)

  const [errorMsg,setErrorMsg] = useState({
    currencyFlag:{set:false,msg:""},
    totalAmount:{set:false,msg:""}, 
    personalAmount:{set:false,msg:""},
    data:{set:false,msg:""},
    expenseSettlement:{set:false,msg:""},
    allocations: { set: false, msg: "" }
  })

  const [formVisible , setFormVisible]=useState(false) // for line item form visible
  
  

  // Get the last object
  

  const [onboardingData, setOnboadingData] = useState(null);
  const [travelAllocationFlag, setTravelAllocationFlag] = useState(null);
  const [travelExpenseAllocation,setTravelExpenseAllocation]=useState(null);
  const [approversList , setApproversList]=useState([])//form get approverlist
  const [categoryfields , setCategoryFields]=useState(null) ///this is for get field after select the category
  const [expenseHeaderId , setExpenseHeaderId]= useState(null)//for expense header id
  const [travelType, setTravelType]=useState(null)//for travel type from expenseData
  const [selectedAllocations , setSelectedAllocations]=useState([])//for saving allocations on line saving line item
  const [settlementOptions, setSettlementOptions]=useState([])
  const [currencyTableData, setCurrencyTableData] = useState(null) //for get data after conversion
  const [defaultCurrency , setDefaultCurrency] = useState(null) 
  const [totalAmount, setTotalAmount] = useState(0); ///for handling convert 
  const [date , setDate]=useState(null)
  const [flagExpenseHeaderStatus,setFlagExpenseHeaderStatus]=useState(null)


  
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState(null)
  // const [ocrField , setOcrField]=useState(null)
  const [travelRequestStatus, setTravelRequestStatus] = useState('pending approval')
  const [isUploading , setIsUploading]=useState(false)

  const [active , setActive]=useState({
    scan:false,
    edit:false,
    saveLineItem:false,
    convert:false,
    delete:{visible:false,id:null},
    deleteHeader:false,
    saveAsDraft:false,
    submit:false
  })

  const [isLoading, setIsLoading] = useState(true)
  
  const [loadingErrMsg, setLoadingErrMsg] = useState(null)
  const [lineItemDetails , setLineItemDetails]=useState()//line item save
  const [selectedFile ,setSelectedFile]=useState(null)
  const [fileSelected,setFileSelected]=useState(null)

  const [personalFlag,setPersonalFlag]=useState(false)

  const [showCancelModal, setShowCancelModal] = useState(false)
  const [ selectedExpenseSettlement,setSelectedExpenseSettlement] =useState(null)

  
  const [selectedTravelType, setSelectedTravelType] = useState(null); /// for level 2 
  const [formData, setFormData] = useState(null); //this is for get expense data
  const [getExpenseData, setGetExpenseData]=useState(); //to get data header level 
  const [getSavedAllocations,setGetSavedAllocations]=useState()  ///after save the allocation then i will get next time from here 
  const [openModal,setOpenModal]=useState(null);
  const [openLineItemForm,setOpenLineItemForm]=useState(true)
  const [headerReport,setHeaderReport]=useState(null)
  const [editLineItemById, setEditLineItemById]=useState(null)
  const [isMultiCurrency, setIsMultiCurrency]= useState(false);
  const [expenseAmountStatus , setExpenseAmountStatus] = useState({})



  //for level 2
  const handleTravelType = (type)=>{
    setSelectedTravelType(type)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getTravelExpenseApi(tenantId, empId, tripId);
        
        setOnboadingData(response)
        console.log('trip data fetched successfully', response)
        setIsLoading(false);  
      } catch (error) {
        setLoadingErrMsg(error.message);
        setMessage(error.message);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };
  
    // Call the fetchData function whenever tenantId, empId, or tripId changes
    fetchData();
  }, [tenantId, empId, tripId]);
 

 

  // useEffect(() => {

  //     // const onboardingData = tripDummyData;
  //     // setOnboadingData(onboardingData);
  //   // const onboardingData = tripDummyDataLevel2; //level 2 dummy data
  //   // const onboardingData = bookAnExpenseDatalevel; //level 2 dummy data

  //   const travelAllocationFlags = onboardingData?.companyDetails?.travelAllocationFlags;
   
  //   const onboardingLevel = Object.keys(travelAllocationFlags).find((level) => travelAllocationFlags[level] === true);
    
  //   const settlementOptionArray =onboardingData?.companyDetails?.expenseSettlementOptions
  //   const settlementOptions = Object.keys(settlementOptionArray).filter((option) => settlementOptionArray[option]);
  //   const approversList1 = onboardingData?.approvers && onboardingData?.approvers?.map((approver)=>(approver?.name))
  //   setApproversList( approversList1)
  //   setSettlementOptions(settlementOptions)
    
  //   setTravelAllocationFlag(onboardingLevel);
   
  //   const expenseCategoryAndFields = onboardingData?.companyDetails?.travelExpenseCategories
   
  //   setCategoryFields(expenseCategoryAndFields) //this is for get form fields
  //   //for get level
    
  //    if(onboardingLevel=== 'level1'){
  //     const expenseAllocation= onboardingData?.companyDetails?.expenseAllocation
  //     setTravelExpenseAllocation(expenseAllocation) 
  //    }

  //    //-------------------------------------------------

  //    // const hrData= hrDummyData
  //    const expenseData= onboardingData.travelExpenseData //get line items
  //    console.log('expenseData',expenseData)   
  //    ///where is newExpenseReport = true
  //    const headerReportData = expenseData.find((expense) => expense.newExpenseReport);
  //    setHeaderReport(headerReportData)
  //    setFormData({...onboardingData})
  //    // setGetSavedAllocations({...hrData});
  //    setGetExpenseData([...expenseData]);
  //    setTravelRequestStatus(onboardingData)
  //    setIsLoading(false)
     
  // }, [onboardingData]);
  const [activeIndex, setActiveIndex] = useState();

  const handleItemClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  useEffect(() => {
    if (onboardingData) {
       // const onboardingData = tripDummyData;
       // setOnboadingData(onboardingData);
       // const onboardingData = tripDummyDataLevel2; //    level 2 dummy data
       // const onboardingData = bookAnExpenseDatalevel; // level 2 dummy data

      const travelAllocationFlags = onboardingData?.companyDetails?.travelAllocationFlags;
      const onboardingLevel = Object.keys(travelAllocationFlags).find((level) => travelAllocationFlags[level] === true);
      setDefaultCurrency(onboardingData?.companyDetails?.defaultCurrency)
      
      
      const settlementOptionArray = onboardingData?.companyDetails?.expenseSettlementOptions;
      const settlementOptions = Object.keys(settlementOptionArray).filter((option) => settlementOptionArray[option]);
      const approversList1 = onboardingData?.approvers && onboardingData?.approvers?.map((approver) => (approver?.name));
      setApproversList(approversList1);
      setSettlementOptions(settlementOptions);
      setTravelAllocationFlag(onboardingLevel);
     
      const expenseCategoryAndFields = onboardingData?.companyDetails?.travelExpenseCategories;

      if(onboardingLevel == 'level1' || onboardingLevel == 'level2'){
        setCategoryFields(expenseCategoryAndFields); //this is for get form fields
      }      
      if(onboardingLevel == 'level3'){
        const categoryList1= Object.keys(expenseCategoryAndFields).map(key=>({[key]:expenseCategoryAndFields[key]}))
        setCategoryFields(categoryList1)
        console.log('categorylist1',categoryList1)
      }
      
      if (onboardingLevel === 'level1') {
        const expenseAllocation = onboardingData?.companyDetails?.travelAllocations?.expenseAllocation;
        setTravelExpenseAllocation(expenseAllocation);

        if(getSavedAllocations?.length>0){
          setSelectedAllocations(getSavedAllocations)
        }else{
          const initialExpenseAllocation = expenseAllocation && expenseAllocation.map(({ headerValues, ...rest }) => ({
            ...rest,
            headerValue: "" // Add "headerValue" and set it to an empty string
          }));
          setSelectedAllocations( initialExpenseAllocation)
        }
        console.log('expense Allocation level -1',expenseAllocation)
      }

      const expenseData = onboardingData?.travelExpenseData; //get line items
      setGetExpenseData(expenseData);
      console.log('expenseData', expenseData);
      const flagToOpen = onboardingData?.flagToOpen
      const findExpenseHeaderId = expenseData.find(item => item.expenseHeaderId == flagToOpen )
      setSelectedExpenseSettlement(findExpenseHeaderId?.expenseSettlement && findExpenseHeaderId?.expenseSettlement)
      setFlagExpenseHeaderStatus(findExpenseHeaderId?.expenseHeaderStatus)
      console.log('already saved expense settlement option',findExpenseHeaderId?.expenseSettlement)
      if(['level1','level2'].includes(onboardingLevel)){
        setGetSavedAllocations(findExpenseHeaderId?.allocations || [])
      }

      // if(['level3'].includes(onboardingLevel)){
      //   setGetSavedAllocations(findExpenseHeaderId?.allocations || [])
      // }
      setExpenseHeaderId(findExpenseHeaderId?.expenseHeaderId ||flagToOpen)
      setTravelType(findExpenseHeaderId?.travelType)
      if(['level1','level2'].includes(onboardingLevel)){
        setSelectedTravelType(findExpenseHeaderId?.travelType)
      }
      if(onboardingLevel === 'level3'){
        setSelectedTravelType(findExpenseHeaderId?.travelType)
      }
     
     
      console.log('openForSaveHeader id',findExpenseHeaderId?.expenseHeaderId,flagToOpen)
      console.log('saved allocations',getSavedAllocations)
      ///where is newExpenseReport = true
      // const headerReportData = expenseData.find((expense) => expense.newExpenseReport);

      setHeaderReport(findExpenseHeaderId);
      setFormData({ ...onboardingData });
      setExpenseAmountStatus(onboardingData && onboardingData?.expenseAmountStatus);
      
      // setGetSavedAllocations({ ...hrData });
      const initialIndex = onboardingData && onboardingData?.travelExpenseData
      const lastIndex =initialIndex?.length > 0 &&initialIndex.length - 1
      setActiveIndex(lastIndex)
      console.log('lastdigit',lastIndex);
      setTravelRequestStatus(onboardingData);
      setIsLoading(false);
    }
  }, [onboardingData]);
  console.log('get expense data', getExpenseData)
  console.log('approvers', approversList);
  console.log('onboardingData', onboardingData);
  console.log('approvers',approversList)
  console.log('expenseAmountStatus',expenseAmountStatus)
  console.log('selected Allocations',selectedAllocations)

  const [categoriesList , setCategoriesList] = useState([]);
  const [selectedCategory,setSelectedCategory]=useState(null)
  const [categoryFieldBySelect, setCategoryFieldBySelect]=useState([])

  const handleCategorySelection = (selectedCategory) => {
    setSelectedCategory(selectedCategory);
  };
  
 // this is handling travel categories name  arrya for level 1 and level 2
///for level 2 allocation & categories list after select the travel type

  useEffect(()=>{
    console.log('travel allocation after travel type selected')
    if (['level1','level2','level3'].includes(travelAllocationFlag)){

      if(['level1','level2'].includes(travelAllocationFlag)){
      const expenseAllocation= onboardingData?.companyDetails?.travelAllocations?.[selectedTravelType]?.expenseAllocation
      console.log('travel allocation level 2', expenseAllocation)
      setTravelExpenseAllocation(expenseAllocation)
      // for same with empty sting
      if(getSavedAllocations.length>0){
        setSelectedAllocations(getSavedAllocations)
      }else{
        const initialExpenseAllocation = expenseAllocation && expenseAllocation.map(({ headerValues, ...rest }) => ({
          ...rest,
          headerValue: "" // Add "headerValue" and set it to an empty string
        }));
        setSelectedAllocations( initialExpenseAllocation)
      }
    }
    
    //   if(['level3'].includes(travelAllocationFlag)){
    //   const expenseAllocation= onboardingData?.companyDetails?.travelAllocations?.[selectedTravelType]?.expenseAllocation
    //   console.log('travel allocation level 2', expenseAllocation)
    //   setTravelExpenseAllocation(expenseAllocation)
    //   // for same with empty sting
    //   if(getSavedAllocations.length>0){
    //     setSelectedAllocations(getSavedAllocations)
    //   }else{
    //     const initialExpenseAllocation = expenseAllocation && expenseAllocation.map(({ headerValues, ...rest }) => ({
    //       ...rest,
    //       headerValue: "" // Add "headerValue" and set it to an empty string
    //     }));
    //     setSelectedAllocations( initialExpenseAllocation)

    //   }
    // }
      
      //level2
      const categories = categoryfields.find(category => category.hasOwnProperty(selectedTravelType)); 
      
      if (categories) {
        const categoryNames = categories[selectedTravelType].map(category => category.categoryName);
        console.log(`${selectedTravelType} categoryies11` ,categoryNames);
        setCategoriesList(categoryNames);
      } else {
        console.log('International category not found');
      }
     }

  },[selectedTravelType])
  

  console.log('category list',categoriesList)
  console.log('travelType', selectedTravelType)
  console.log(travelAllocationFlag)
  console.log('initial allocation',selectedAllocations)
  console.log('expense allocation',travelExpenseAllocation)
  console.log('expenseLine',headerReport?.expenseLines)
  // console.log('onboardingData',onboardingData)
  // console.log('categoryViseFields',categoryfields)
  //categories array for search the category to get fields

    useEffect (()=>{
      console.log('categoryNames',categoriesList)
      if(travelAllocationFlag =='level1'){
        const categoryNames = categoryfields &&  categoryfields.map((category)=>(category.categoryName))
        console.log('category name ', categoryNames)
        setCategoriesList(categoryNames)
        
      }
    },[travelAllocationFlag])

      
    useEffect(()=>{
      //this is for set intialvalue in categoryfield
      if(travelAllocationFlag==='level1'){
        const categoryFields1 = selectedCategory && categoryfields.find((category) => category.categoryName === selectedCategory).fields.map((field) => field);
        console.log('categoryFieds',categoryFields1)
        setCategoryFieldBySelect(categoryFields1)
        
        const initialFormValues =selectedCategory &&  Object.fromEntries(categoryFields1.map((field)=>[field.name , ocrField?.[field.name] || '']))
        console.log('initial value',{...initialFormValues})
        setLineItemDetails({...initialFormValues})
        //level1 for set values
        if(initialFormValues){
          const foundDateKey = dateForms?.find(key => Object.keys(initialFormValues).includes(key));
          const foundTotalAmtKey = totalAmountNames.find(key => Object.keys(initialFormValues).includes(key));
          const dateValue = foundDateKey ? initialFormValues[foundDateKey] : undefined;
          const totalAmountValue = foundTotalAmtKey ? initialFormValues[foundTotalAmtKey] : undefined;
          setDate({[foundDateKey]:dateValue})
          setTotalAmount(totalAmountValue)
         
        }
        
      }
      //this has to do
      if(['level2','level3'].includes(travelAllocationFlag)){
        const categories = categoryfields.find(category => category.hasOwnProperty(selectedTravelType)); 
        const desiredCategory =categories && categories?.[selectedTravelType].find(category => category.categoryName === selectedCategory);
      const categoryFields1 = desiredCategory?.fields?.map(field => ({ ...field })) || [];
      console.log('categoryFieds',categoryFields1)
      console.log('desired category',desiredCategory)
      const selectedCategoryAllocation = desiredCategory?.expenseAllocation
      if(travelAllocationFlag=== 'level3'){
      setTravelExpenseAllocation(selectedCategoryAllocation)}
       //For level three
       if(['level3'].includes(travelAllocationFlag)){
        // for same with empty sting
        if(getSavedAllocations?.length>0){
          setSelectedAllocations(getSavedAllocations)
        }else{
          const initialExpenseAllocation = selectedCategoryAllocation && selectedCategoryAllocation.map(({ headerValues, ...rest }) => ({
            ...rest,
            headerValue: "" // Add "headerValue" and set it to an empty string
          }));
          setSelectedAllocations( initialExpenseAllocation)
        }
      }
        //For level three
      setCategoryFieldBySelect(categoryFields1)        
        const initialFormValues = selectedCategory &&  Object.fromEntries(categoryFields1.map((field)=>[field.name , ocrValues?.[field.name] || '']))
        //for get data
        if(initialFormValues){
        const foundDateKey = dateForms?.find(key => Object.keys(initialFormValues).includes(key));
        const foundTotalAmtKey = totalAmountNames.find(key => Object.keys(initialFormValues).includes(key));
        const dateValue = foundDateKey ? initialFormValues[foundDateKey] : undefined;
        const totalAmountValue = foundTotalAmtKey ? initialFormValues[foundTotalAmtKey] : undefined;
        setDate({[foundDateKey]:dateValue})
        setTotalAmount(totalAmountValue)
        console.log('initial value',{...initialFormValues},dateValue)
        setLineItemDetails({...initialFormValues})}
      }
    },[selectedCategory ])


    console.log('selected category',selectedCategory)
    console.log('total amount11',totalAmount)



  
 
    //selected category corresponding class & class of service value
    const [classDropdownValues,setClassDropdownValues]=useState(null)

    useEffect(() => {
      const category = classDropdown.find(category => category.categoryName === selectedCategory);
      if (category) {
        // Access the classes array and console.log it
        console.log(category.classes);
        setClassDropdownValues(category.classes);
      } else {
        console.log(`Category "${selectedCategory}" not found.`);
      }
    }, [selectedCategory]);
  //get travel request Id from params

const handlePersonalFlag=()=>{
  setPersonalFlag((prev)=>(!prev))
}


useEffect(()=>{
  
   if(!personalFlag){
    setLineItemDetails(({...lineItemDetails, personalExpenseAmount:0 ,isPersonalExpense:false}))
   }
},[personalFlag])




// //level-1 store selected allocation in array
console.log('selected allocations11', selectedAllocations);
const onAllocationSelection = (option, headerName) => {
  

  const updatedExpenseAllocation = selectedAllocations.map(item => {
    if (item.headerName === headerName) {
      return {
        ...item,
        headerValue: option
      };
    }
    return item;
  });
  const newErrorMsg = { ...errorMsg };
    newErrorMsg[headerName] = { set: false, msg: "" };
    setErrorMsg(newErrorMsg);

  console.log('object111',updatedExpenseAllocation);
  setSelectedAllocations(updatedExpenseAllocation)
};


//level-1 store selected allocation in array
// const onAllocationSelection = (option, headerName) => {
//   // Check if the allocation for the headerName is already in the selectedAllocations
//   const existingAllocationIndex = selectedAllocations.findIndex(item => item.headerName === headerName);

//   // If the allocation exists, update it; otherwise, add a new allocation
//   if (existingAllocationIndex !== -1) {
//     const updatedExpenseAllocation = selectedAllocations.map((item, index) => {
//       if (index === existingAllocationIndex) {
//         // Update only the selected allocation
//         return {
//           ...item,
//           headerValue: option
//         };
//       }
//       return item;
//     });
//     setSelectedAllocations(updatedExpenseAllocation);
//   } else {
//     // Add a new allocation if it doesn't exist
//     setSelectedAllocations([
//       ...selectedAllocations,
//       {
//         headerName: headerName,
//         headerValue: option
//       }
//     ]);
//   }
// };






const onReasonSelection = (option) => {
        setSelectedExpenseSettlement(option)
        console.log(option)
    }

const [selectDropdown , setSelectDropdown]= useState(null)

    // const handleDropdownChange = (value, dropdownType) => {
    //   if (dropdownType === 'Class' || dropdownType === 'Class of Service') {
    //     const key = dropdownType === 'Class' ? 'Class' : 'Class of Service';
    //     setLineItemDetails((prevState) => ({ ...prevState, [key]: value }));
    //   } else if (dropdownType === 'categoryName') {
    //     setExpenseLineForm({ ...expenseLineForm, categoryName: value });
    //   } else if (dropdownType === 'currencyName') {
    //     setLineItemDetails((prevState) => ({ ...prevState, currencyName: value }));
    //     setSelectDropdown(value);
    //   }
    // };

  console.log(lineItemDetails?.personalExpenseAmount)
  console.log('default cuurency use state',defaultCurrency)

//Handle Currency Select
const  handleCurrenctySelect= (shortName)=>{

  const selectedCurrencyObject = currencyDropdown.find(currency => currency.shortName === shortName);
  setSelectDropdown(selectedCurrencyObject)
  // setLineItemDetails({...lineItemDetails,['Currency']:selectedCurrencyObject}),setSelectDropdown(selectedCurrencyObject)
  if(shortName !== defaultCurrency?.shortName){
    setIsMultiCurrency(true)
  }else{
    setIsMultiCurrency(false)
  }
  if(shortName === defaultCurrency?.shortName){
    setCurrencyTableData(null)
  }

 
}
console.log('selected Currency',selectDropdown)



// Handle Input Change
  const handleInputChange=(name, value)=>{
    console.log(`Updating ${name} with value:`, value);
    setLineItemDetails((prevState) => ({ ...prevState, [name]: value || "" }));

    if (totalAmountNames.includes(name)) {
      setTotalAmount(value);
    }
    if(dateForms.includes(name)){
      setDate({[name] : value})
    }
// if(totalAmountNames.includes(name)){
// const limit = groupLimit?.limit 
// if(value>limit){
// setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:true,msg:groupLimit?.message}}))
// }else{
// setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:false,msg:groupLimit?.message}}))
// }
// } 
  }
 
// Handle Convert

  const handleConverter = async (totalAmount ,personalExpenseAmount ) => { 
    let allowForm = true;
    if (totalAmount === 0 || totalAmount === undefined || totalAmount ===""){
      setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: true, msg: "Enter total amount" } }));
      allowForm = false;
      console.log('total amount  is empty' , totalAmount)
    } else {
      setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: false, msg: "" } }));
    }
  
    if (personalFlag && (personalExpenseAmount === "" || personalExpenseAmount === undefined)) {
      setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: true, msg: "Enter personal amount" } }));
      allowForm = false;
    } else {
      setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: false, msg: "" } }));   
    }

    

    const nonPersonalAmount = (totalAmount || 0) - personalExpenseAmount;
    
    const validPersonalAmount =( totalAmount ||0 ) - personalExpenseAmount
    if (validPersonalAmount <=0 ) {
      setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: true, msg: "Personal Expense amount should be less than Total Expenditure" } }));
      allowForm = false;
    }
    const convertDetails = {
      currencyName: selectDropdown?.shortName,
      personalAmount: personalExpenseAmount || "",
      nonPersonalAmount: nonPersonalAmount || "",
      totalAmount: totalAmount 
     
    };

    console.log('convert details', convertDetails)
    console.log(`total amount is ${totalAmount} and personal amount is ${personalExpenseAmount} ${selectDropdown?.shortName}`)
    
  
    if (allowForm) {
     
      const convertDetails = {
        currencyName: selectDropdown?.shortName,
        personalAmount: personalExpenseAmount || "",
        nonPersonalAmount: nonPersonalAmount || "",
        totalAmount: totalAmount 
       
      };
      console.log('sent converted details',convertDetails)
    
      ///api 
          try {
            setActive(prevState => ({ ...prevState, convert: true }));
            const response = await postMultiCurrencyForTravelExpenseApi(tenantId,convertDetails);
           
            setCurrencyTableData(response?.currencyConverterData || {})
            setActive(prevState => ({ ...prevState, convert: false }));
            console.log('converted amount fetched',response?.currencyConverterData);
            
            if (selectDropdown?.shortName !== defaultCurrency?.shortName && !response?.currencyConverterData?.currencyFlag){
              setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: true, msg: "Conversion not available, Please contact admin" } }));
              console.log('converted flag no' , )
            } else {
              setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: false, msg: "" } }));
            }
          } catch (error) {
            console.log('Error in fetching expense data for approval:', error.message);
            setShowPopup(true)
            setMessage(error.message);
            setTimeout(() => {setMessage(null);setShowPopup(false);setActive(prevState => ({ ...prevState, convert: false }));},5000);
          }
    }
  };




// console.log('headerdata',headerReport)
// console.log("formdata",formData)
      
    useEffect(()=>{
        if(showCancelModal){
            document.body.style.overflow = 'hidden'
        }
        else{
            document.body.style.overflow = 'auto'
        }
    },[showCancelModal])

     const handleOpenModal=(id)=>{
      if(id==='upload'){
        setOpenModal('upload')
      }
      if(id==='category'){
        setOpenModal('category')
      }
     }
//  const handleOpenModal=()=>{
//    setOpenModal((prevState)=>(!prevState))
//  }
//Handle Delete header

     const handleCancelExpenseHeader=async()=>{
      const expenseAmountStatus= formData?.expenseAmountStatus
      const travelExpenseReport = getExpenseData.find(expense => expense.expenseHeaderId === expenseHeaderId)  ;
      const data = {
        expenseAmountStatus,
        travelExpenseReport,
      }
        console.log("cancel header")
        try{
          setIsUploading(true)
          setActive(prevState => ({ ...prevState, deleteHeader: true }))
          const response = await cancelTravelExpenseHeaderApi(tenantId,empId,tripId,expenseHeaderId,data)
        
         setIsLoading(false)
         setShowPopup(true)
         setMessage(response.message)
         setIsUploading(false)
        setActive(prevState => ({ ...prevState, deleteHeader: false }))
         setTimeout(()=>{
           setShowPopup(false)
           setMessage(null)
           urlRedirection(`${dashboard_url}/${tenantId}/${empId}/overview`)
         },5000)
       }catch(error){
         setIsUploading(false)
        setActive(prevState => ({ ...prevState, deleteHeader:false }))
         setShowPopup(true)
         setMessage(error.message)
         setTimeout(()=>{
           setShowPopup(false)
           setMessage(null)
         },5000)
         console.error('Error confirming trip:', error.message);
       }  
 
     }



    // console.log("getExpenseData",getExpenseData)
///----------------------------------------  




// Handle Submit Draft
const handleSubmitOrDraft=async(action)=>{
  let allowForm = true
  const data ={ expenseSettlement: selectedExpenseSettlement}
  // if(!selectedExpenseSettlement){
  //   setErrorMsg((prevErrors)=>({...prevErrors,expenseSettlement:{set:true, msg:'Select Expense Settlement'}}))
  //   allowForm= false
  // }else{
  //   setErrorMsg((prevErrors)=>({...prevErrors,expenseSettlement:{set:false, msg:''}}))
  //   allowForm = true
  // }
  
    console.log('submit',data)
    if(allowForm){
    try{
         setIsUploading(true)
         if(action === "draft"){
          setActive(prevState => ({ ...prevState, saveAsDraft: true }));
         }else if (action === "submit"){
          setActive(prevState => ({ ...prevState, submit: true }))
         }
         
        
        const response = await submitOrSaveAsDraftApi(action,tenantId,empId,tripId,expenseHeaderId,data)
        setIsLoading(false)
        setShowPopup(true)
        setMessage(response.message)

        setIsUploading(false)
        if(action === "draft"){
          setActive(prevState => ({ ...prevState, saveAsDraft: false }));
         }else if (action === "submit"){
          setActive(prevState => ({ ...prevState, submit: false }))
         }
        setTimeout(()=>{
          setShowPopup(false)
          setMessage(null)
         
          if(action === "submit"){
          urlRedirection(`${dashboard_url}/${tenantId}/${empId}/overview`)}
          else{
            window.location.reload()
          }
         
        },5000)
       
  
      }catch(error){
        setIsUploading(false)
        if(action === "draft"){
          setActive(prevState => ({ ...prevState, saveAsDraft:false }));
         }else if (action === "submit"){
          setActive(prevState => ({ ...prevState, submit:false }))
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


// Handle Save Line Item
console.log('date value', selectedAllocations)
const handleSaveLineItemDetails = async() => { 
  let allowForm = true

  const newErrorMsg = { ...errorMsg };

    // Reset all error messages
    Object.keys(newErrorMsg).forEach(key => {
      newErrorMsg[key] = { set: false, msg: "" };
    });
    for (const allocation of selectedAllocations) {
      if (allocation.headerValue.trim() === '') {
        newErrorMsg[allocation.headerName] = { set: true, msg: "Select the Allocation" };
      }
      
    }

    setErrorMsg(newErrorMsg);
    const anyErrorSet = Object.values(newErrorMsg).some(error => error.set);

// Update allowForm based on whether any error is set
allowForm = !anyErrorSet;

console.log("All Errors Filled:", !anyErrorSet);
    // const allErrorsFilled = Object.values(newErrorMsg).every(error => error.set);
    // if (allErrorsFilled) {
    //   console.log("All1 ",allErrorsFilled);
    //   allowForm=false
    // }else{
    //   allowForm=true
    //   console.log("All2",allErrorsFilled);

    // }
    
    // if (Object.values(newErrorMsg).every(error => !error.set)) {
    //   allowForm=true
    // }
    

  const foundTotalAmtKey = totalAmountNames.find(key => Object.keys(lineItemDetails).includes(key));
  console.log('foundTotalAmtKey',foundTotalAmtKey)
      
      const { personalExpenseAmount } = lineItemDetails;
      console.log('line item on save',lineItemDetails)
      const firstKey = Object.keys(date)[0]

      ///for date validation
      if(!['Travel Insurance'].includes(lineItemDetails?.['Category Name']) && (!date[firstKey] || date[firstKey]=== "")){
        setErrorMsg((prevErrors) => ({ ...prevErrors, dateErr: { set: true, msg: `Enter the ${firstKey}` } }));
        allowForm = false;
        console.log('date  is empty1' , date[firstKey])
      }else {
        setErrorMsg((prevErrors) => ({ ...prevErrors, dateErr: { set: false, msg: "" } }));
      }
      //for total amount validation
      if (totalAmount === 0 || totalAmount === undefined || totalAmount ==="" ){
        setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: true, msg: `Enter ${foundTotalAmtKey}` } }));
        allowForm = false;
        console.log('total amount  is empty' , totalAmount)
      } else {
        setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: false, msg: "" } }));
      }
      const validPersonalAmount = (totalAmount || 0) - (personalExpenseAmount || 0);

if ((personalFlag && validPersonalAmount <= 0) || (personalFlag && (personalExpenseAmount === "" || personalExpenseAmount === undefined))) {
  setErrorMsg((prevErrors) => ({
    ...prevErrors,
    personalAmount: {
      set: true,
      msg: validPersonalAmount <= 0
        ? "Personal Expense amount should be less than Total Expenditure"
        : "Enter personal amount"
    }
  }));
  allowForm = false;
} else {
  setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: false, msg: "" } }));
}

if (selectDropdown?.shortName !== defaultCurrency?.shortName && !currencyTableData?.currencyFlag){
  setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: true, msg: "Conversion not available!" } }));
  allowForm = false;
  console.log('converted flag no' , )
} else {
  setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: false, msg: "" } }));
}

      
      // Create a new object with the updated category
      
      let expenseLines 

      if( ['level1','level2'].includes(travelAllocationFlag)){
        expenseLines={ ...lineItemDetails,"Currency": selectDropdown || defaultCurrency, "Category Name": selectedCategory,isMultiCurrency:isMultiCurrency ,"isPersonalExpense":personalFlag , billImageUrl : fileSelected ? selectedFile : "" ,convertedAmountDetails: currencyTableData };  
      }else if ( travelAllocationFlag === 'level3'){
        expenseLines={ ...lineItemDetails,"Currency": selectDropdown || defaultCurrency, "Category Name": selectedCategory,isMultiCurrency:isMultiCurrency ,"isPersonalExpense":personalFlag , billImageUrl : fileSelected ? selectedFile : "" ,convertedAmountDetails: currencyTableData ,allocations: selectedAllocations};  
      }
      const expenseAmountStatus= formData?.expenseAmountStatus
      // Log the updated details
      let dataWithCompanyDetails 
      if( ['level1','level2'].includes(travelAllocationFlag)){
        dataWithCompanyDetails={
       // companyDetails:companyDetails,
          travelType,
          expenseAmountStatus,
          defaultCurrency,
          expenseLine:expenseLines,
          allocations: selectedAllocations
        }
      }else if(travelAllocationFlag === 'level3'){
        dataWithCompanyDetails={
          // companyDetails:companyDetails,
             travelType,
             expenseAmountStatus,
             defaultCurrency,
             expenseLine:expenseLines,
             allocations: []
           }
      }
     if(['level2','level3'].includes(travelAllocationFlag)){
      dataWithCompanyDetails = {...dataWithCompanyDetails ,travelType:selectedTravelType}
     }
      console.log('save line item', dataWithCompanyDetails)
      const data = dataWithCompanyDetails
      if(allowForm){
      try {
        setIsUploading(true)
        setActive(prevState => ({ ...prevState, saveLineItem: true }));
        const response = await postTravelExpenseLineItemApi(tenantId,empId,tripId,expenseHeaderId,data);
        expenseLines={...expenseLines,expenseLineId :response?.expenseLineId}
        const updatedExpenseData= getExpenseData.map(expense=>{
          if(expense.expenseHeaderId===expenseHeaderId){
            return {...expense, expenseLines:[...expense.expenseLines,expenseLines]
            };
        }
        return expense})
       setExpenseAmountStatus(response?.expenseAmountStatus)
        setGetExpenseData(updatedExpenseData)
        setFormVisible(false)
        setShowPopup(true)
        setCurrencyTableData(null)
        setMessage(response?.message)
        setIsUploading(false)
        setActive(prevState => ({ ...prevState, saveLineItem: false }));
        setOpenLineItemForm(false)
        setTimeout(() => {setShowPopup(false);setMessage(null);},5000)
      } catch (error) {
        setMessage(error.message);
        setShowPopup(true);
        setIsUploading(false);
        setActive(prevState => ({ ...prevState, saveLineItem: false }));
        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
      } }
      // setSelectedCategory(null)
    };
    console.log('error message for allocation', errorMsg?.allocations)

// Handle Edit

const [editFields, setEditFields]= useState({});

  const handleEdit = (lineItemId,categoryName,travelType)=>{
     if(travelAllocationFlag ==='level2' ){
      // const internationalData = categoryfields && categoryfields.find(
      //   (category) => category.hasOwnProperty(headerReport?.travelType ) //there has to manage
      // )?.[headerReport?.travelType];
      // setCategoryFields(internationalData)
      // console.log('level2 fields after got travelType',internationalData,categoryfields,headerReport?.travelType)

      //this is travelType

      const data = categoryfields && categoryfields.find((item) => item[headerReport?.travelType]);

      if (data && data[headerReport?.travelType]) {
        const categoryData = data[headerReport?.travelType].find((item) => item.categoryName === categoryName);
        if (categoryData) {
          console.log('level 2 categoryfields',categoryData.fields) 
          // setCategoryFields(categoryData)
           setEditFields(categoryData)
      setEditLineItemById (lineItemId)
      setSelectedCategory(categoryName)
        }
      }
    }
    //this is for level3
     if(travelAllocationFlag ==='level3' ){
      // const internationalData = categoryfields && categoryfields.find(
      //   (category) => category.hasOwnProperty(headerReport?.travelType ) //there has to manage
      // )?.[headerReport?.travelType];
      // setCategoryFields(internationalData)
      // console.log('level2 fields after got travelType',internationalData,categoryfields,headerReport?.travelType)

      //this is travelType

      const data = categoryfields && categoryfields.find((item) => item[headerReport?.travelType]);

      if (data && data[headerReport?.travelType]) {
        const categoryData = data[headerReport?.travelType].find((item) => item.categoryName === categoryName);
        if (categoryData) {
          console.log('level 2 categoryfields',categoryData.fields) 
          // setCategoryFields(categoryData)
           setEditFields(categoryData)
      setEditLineItemById (lineItemId)
      setSelectedCategory(categoryName)
        }
      }
    }
    if(travelAllocationFlag ==='level1'){
      const searchedFields = categoryfields && categoryfields.find((category)=>category.categoryName === categoryName)
      console.log('seacth', searchedFields)
      setEditFields(searchedFields)
      setEditLineItemById (lineItemId)
      setSelectedCategory(categoryName)
      console.log('handleEdit', lineItemId,categoryName ,categoryfields)
    }
    
  }
  


  
    //Handle Delete
 
    const handleDeleteLineItem=async(lineItem)=>{
      console.log('expense data1' , onboardingData?.expenseAmountStatus)
     const data = { expenseAmountStatus: onboardingData?.expenseAmountStatus, expenseLine:lineItem}
      try{
        setIsUploading(true)
        setActive(prevState => ({ ...prevState, delete: { visible:true,id:lineItem?.expenseLineId}}));
        console.log('deletions',active.delete.visible,active.delete.id);
        const response= await cancelTravelExpenseLineItemApi(tenantId,empId,tripId,expenseHeaderId,data) 
        const updatedExpenseData = getExpenseData.map(expense => {
          if (expense.expenseHeaderId === expenseHeaderId) {
            const updatedExpenseLines = expense.expenseLines.filter(
              line => line.expenseLineId !== lineItem?.expenseLineId
            );
            return { ...expense, expenseLines: updatedExpenseLines };
          }
          return expense;
        });
        setGetExpenseData(updatedExpenseData);
        setShowPopup(true)
        setMessage(response?.message)
        setIsUploading(false)
        setActive(prevState => ({ ...prevState, delete: { visible:false,id:null}}));

        setTimeout(()=>{
          setShowPopup(false);setMessage(null);
        },5000)
      }catch(error){
        // setLoadingErrMsg(error.message)
        setIsUploading(false)
        setActive(prevState => ({ ...prevState, delete: { visible:false,id:null}}));
        setMessage(error.message)
        setShowPopup(true)
        setTimeout(() => {
          setShowPopup(false)
        }, 3000);
        
      } 
    }
    console.log('expense lines before deleting', headerReport)
    console.log('deletions',active.delete.visible,active.delete.id);

console.log('all categoryfields',categoryfields)




///////////////////---------- Update Line Item



const handleModifyLineItem = () => {
  const expenseLines = { ...lineItemDetails, category: selectedCategory ,isPersonalExpense:personalFlag , billImageUrl : fileSelected ? selectedFile : ""};  
  // Set the updated line item details
  // setLineItemDetails((prevState)=>({...prevState ,expenseLines}));
  
  
  //for companyDetails
  const companyDetails = onboardingData?.companyDetails
  // Log the updated details
  const dataWithCompanyDetails={
    companyDetails:companyDetails,
    expenseLines:[{...expenseLines}],
    allocations: selectedAllocations
  }
  console.log('save line item', dataWithCompanyDetails)
};





const handleOcrScan = async () => {
  // console.log('ocrfile from handle', ocrSelectedFile);

  const ocrData = new FormData();
    ocrData.append('categoryName', selectedCategory);
    ocrData.append('file', ocrSelectedFile);

  console.log('ocrfile from handle',ocrData)

     setIsUploading(prevState =>({...prevState, scan: true}));
    
    setTimeout(() => {
      setFormVisible(true) ;setOpenModal(null); setShowPopup(false);setIsUploading(false);
    }, 5000);
  // try {
  //   setIsUploading(prevState =>({...prevState, scan: true}));

  //  // Assuming ocrScanApi is an asynchronous function
  //   const response = await ocrScanApi(ocrData); important 

   

    

  //   setIsUploading(prevState =>({...prevState, scan: false}));
    
  //   setTimeout(() => {
  //     setFormVisible(true) ;setOpenModal(null); setShowPopup(false);
  //   }, 3000);
    
  // } catch (error) {
  //   setIsUploading(prevState =>({...prevState, scan: false}));
  //   setLoadingErrMsg(error.message);
  //   setMessage(error.message);
  //   setShowPopup(true);

  //   setTimeout(() => {
  //     setShowPopup(false);
  //   }, 3000);
  // } 
};

/////////-------------------google search start---------------------
const autocompleteRefs = {};
const handlePlaceSelect = (name, place) => {
  const formattedAddress = place.formatted_address;

  setLineItemDetails((prevValues) => ({
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
const loadGoogleMapsScript = async () => {
  console.log('Checking Google API load...');
  
  if (!window.google) {
    console.log('Google API not found, loading...');
    
    const loadScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places`;
        script.defer = true;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    try {
      await loadScript();
      console.log('Google API loaded successfully');
      
      // Initialize Autocomplete for specified fields
      categoryFieldBySelect.forEach((field) => {
        if (field.name === 'PickUp' || field.name === 'DropOff') {
          initAutocomplete(field.name);
        }
      });
    } catch (error) {
      console.error('Error loading Google Maps script:', error);
    }
  } else {
    console.log('Google API already loaded');
  }
};
  
useEffect(() => {
  loadGoogleMapsScript();
}, [selectedCategory,openLineItemForm]);

//BLOB Storage

console.log('blob storage', az_blob_container,blob_endpoint)

async function uploadFileToAzure(file) {
  try{
      const blobServiceClient = new BlobServiceClient(blob_endpoint);
      const containerClient = blobServiceClient.getContainerClient(az_blob_container);
      const blobClient = containerClient.getBlobClient(file.name);
      const blockBlobClient = blobClient.getBlockBlobClient();
    
      const result = await blockBlobClient.uploadBrowserData(file, {
          blobHTTPHeaders: {blobContentType: file.type},
          blockSize: 4 * 1024 * 1024,
          concurrency: 20,
          onProgress: ev => console.log(ev)
      });
      console.log(`Upload of file '${file.name}' completed`);
      return {success:true}
  }catch(e){
      console.error(e)
      return {success:false}   
  }
}
////---------------------------google search end--------------------------

console.log('categoryfields by selected', categoryFieldBySelect)
  return <>
{/* <Error message={loadingErrMsg}/> */}
    {isLoading && <Error  message={loadingErrMsg}/>}
      {!isLoading && 
        <div className="w-full h-full  relative bg-white-100  py-12 select-none">
        {/* app icon */}
        {/* <div className='w-full flex justify-center pl-10  md:justify-start lg:justify-start'>
            <Icon/>
        </div> */}
         <div className='w-full flex justify-center pl-10  md:justify-start lg:justify-start'>
        <div className="flex items-center cursor-pointer" onClick={()=>urlRedirection(DASHBOARD_URL)}>
        <img src={arrow_left} className="w-6 h-6"/>
       </div>
            <Icon/>
        </div>

       

        {/* Rest of the section */}
        <div className="w-full h-full xl:px-32 lg:px-16 md:px-4 px-4 font-cabin tracking-tight">
    {/* {travelAllocationFlag === 'level1' &&  <div className="font-cabin font-medium">Expense Type: {travelType}</div>} */}
       

{/* ///-level2 - */}
{['level1','level2','level3'].includes(travelAllocationFlag) && <div className="flex flex-col md:flex-row gap-4 justify-evenly items-center mt-10">  
   
   <div onClick={() => !travelType && handleTravelType('international')} className={`flex-1 gap-x-4 ${travelType && travelType !== 'international' ? 'cursor-not-allowed bg-white-100 opacity-30' : 'cursor-pointer'}  inline-flex items-center ${selectedTravelType === 'international' ? 'border border-indigo-600' : 'border border-neutral-400'} max-w-[250px] accent-indigo-600 px-6 py-2 rounded h-[65px]`}>
     <div className={`w-[20px] h-[20px] ${selectedTravelType === 'international' ? 'bg-indigo-600 border border-indigo-600' : 'border border-neutral-400'} flex items-center justify-center rounded-sm`}>
       {selectedTravelType === 'international' && <img src={check_tick} alt="Check Icon" className='w-[20px] h-[20px] rounded-sm' />}
     </div>

     <div>
       <p className='font-Cabin text-neutral-800 text-lg tracking-wider'> International </p>
       <p className='font-Cabin -mt-1 text-neutral-600 text-sm tracking-tight truncate'>Travelling out of country</p>
     </div>
   </div>

   <div onClick={() => !travelType && handleTravelType('domestic')} className={`  flex-1 gap-x-4 ${travelType && travelType !== 'domestic'? 'cursor-not-allowed bg-white-100 opacity-30' : 'cursor-pointer'} inline-flex items-center ${selectedTravelType === 'domestic' ? 'border border-indigo-600' : 'border border-neutral-400'} max-w-[250px] accent-indigo-600 px-6 py-2 rounded h-[65px]`}>
     <div className={`w-[20px] h-[20px] ${selectedTravelType === 'domestic' ? 'bg-indigo-600 border border-indigo-600' : 'border border-neutral-400'} flex items-center justify-center rounded-sm`}>
       {selectedTravelType === 'domestic' && <img src={check_tick} alt="Check Icon" className='w-[20px] h-[20px] rounded-sm' />}
     </div>

     <div>
       <p className='font-Cabin text-neutral-800 text-lg tracking-wider'> Domestic </p>
       <p className='font-Cabin -mt-1 text-neutral-600 text-sm tracking-tight  truncate'>Travelling within the country</p>
     </div>
   </div>

   <div onClick={() => !travelType && handleTravelType('local')}  className={`flex-1 gap-x-4 ${travelType && travelType !== 'local'? 'cursor-not-allowed bg-white-100 opacity-30' : 'cursor-pointer'} inline-flex items-center ${selectedTravelType === 'local' ? 'border border-indigo-600' : 'border border-neutral-400'} max-w-[250px] accent-indigo-600 px-6 py-2 rounded h-[65px]`}>
     <div className={`w-[20px] h-[20px] ${selectedTravelType === 'local' ? 'bg-indigo-600 border border-indigo-600' : 'border border-neutral-400'} flex items-center justify-center rounded-sm`}>
       {selectedTravelType === 'local' && <img src={check_tick} alt="Check Icon" className='w-[20px] h-[20px] rounded-sm' />}
     </div>

     <div>
       <p className='font-Cabin text-neutral-800 text-lg tracking-wider'> Local </p>
       <p className='font-Cabin -mt-1 text-neutral-600 text-sm tracking-tight truncate'>Travelling nearby</p>
     </div>
   </div>
</div> 
 }
        {/* ///-level2- */}
        {['level1','level2'].includes(travelAllocationFlag) && 
                <div>
                  <AllocationComponent 
                     errorMsg={errorMsg} 
                    getSavedAllocations={getSavedAllocations} 
                    travelAllocationFlag={travelAllocationFlag} 
                    travelExpenseAllocation={travelExpenseAllocation}
                    onAllocationSelection={onAllocationSelection}
                  />
                </div>
        }
        
        <div>
          <ExpenseHeader 
              selectedExpenseSettlement={selectedExpenseSettlement}
              errorMsg={errorMsg} 
              expenseHeaderStatus={flagExpenseHeaderStatus} 
              tripPurpose={formData?.tripPurpose} 
              tripNumber={formData?.tripNumber} 
              name={formData?.createdBy?.name} 
              expenseAmountStatus={expenseAmountStatus} 
              isUploading={isUploading}
              active={active}
              cancel={cancel}
              handleCancelExpenseHeader={handleCancelExpenseHeader}
              handleSubmitOrDraft={handleSubmitOrDraft}
              formData={formData} 
              approversList={approversList} 
              onReasonSelection={onReasonSelection} 
              settlementOptions={settlementOptions} 
              defaultCurrency={defaultCurrency} 
          />
        </div>


           
            <hr/>

            <div className="form mt-5">

            <div className="w-fit">
            {/* <Button disabled={(formVisible === true || (travelAllocationFlag=== 'level2' || travelAllocationFlag=== 'level3'? !selectedTravelType : !travelType) ? true : false )} onClick={()=>handleOpenModal('category')} text={"Add Line Item"}/> */}
            <AddMore text={'Add Line Item'} disabled={(formVisible === true || (travelAllocationFlag=== 'level2' || travelAllocationFlag=== 'level3'? !selectedTravelType : !travelType) ? true : false )} onClick={()=>handleOpenModal('category')} text={"Add Line Item"}/>
            </div>
  
  <div className=" w-full flex flex-row mt-5">         
  <div className="flex flex-col w-full">       
      <div className="container mx-auto ">
      <h1 className="text-2xl font-bold mb-4">Header Report</h1>
      {getExpenseData && getExpenseData.map((item,index)=>(
       <React.Fragment key={index} >
        <div className="mb-4">
          <div
            className="flex w-full justify-between items-center bg-indigo-50 py-2 px-6 border-[1px] rounded-xl border-indigo-600 cursor-pointer"
            onClick={() => handleItemClick(index)}
          >
           
           
<div className="max-w-full overflow-hidden whitespace-nowrap text-indigo-600 ">
  <p className="overflow-hidden text-ellipsis ">
    {`Header Report Number : ${item?.expenseHeaderNumber ?? 'N/a'}`}
  </p>
</div>

            <div className="flex gap-4 items-center  text-indigo-600">
              <div className={`${getStatusClass(item?.expenseHeaderStatus)} rounded-xl px-4 py-2 text-sm capitalize font-medium font-cabin`}><p>{item?.expenseHeaderStatus}</p></div>
            <div >{activeIndex === index ? '▲' : '▼'}</div>
            </div>
          
           
          </div>
          {activeIndex === index && (
            <div className="bg-white py-2 px-4 ">
{/* ///already booked travel details */}
<div className="mt-5 flex flex-col gap-4">

 
{['flights', 'trains', 'buses', 'cabs', 'hotels']
.filter(it=> item?.alreadyBookedExpenseLines && item.alreadyBookedExpenseLines[it]?.length > 0)
.map((itnItem, itnItemIndex) => 
      (
      <React.Fragment key={itnItemIndex}>
        <details>
          <summary>
            <p className="inline-flex text-xl text-neutral-700 capitalize">
              {`${itnItem} `}
            </p>
          </summary>
          <div className='flex flex-col gap-1'>
            {/* {item.alreadyBookedExpenseLines[itnItem].map((item, itemIndex) => {
              if (['flights', 'trains', 'buses'].includes(itnItem)) {
                return (
                  <div key={itemIndex}>
                    <FlightCard
                      // onClick={()=>handleCancel(itnItem.slice(0, -1), itemIndex, item.formId, item.isReturnTravel)} 
                      from={item.from} 
                      to={item.to} 
                      itnId={item.itineraryId}
                      // handleLineItemAction={handleLineItemAction}
                      key={`flights_${itemIndex}_${Math.random()}`}
                      showActionButtons={travelRequestStatus !== 'pending approval' && item.status == 'pending approval'}
                      date={item.date} time={item.time} travelClass={item.travelClass} mode={titleCase(itnItem.slice(0, -1) ?? "")} />
                  </div>
                );
              } else if (itnItem === 'cabs') {
                return (
                  <div key={itemIndex}>
                    <CabCard 
                    key={`cabs_${itemIndex}_${Math.random()}`}
                      itnId={item.itineraryId}
                      from={item.pickupAddress} to={item.dropAddress} date={item.date} time={item.time} travelClass={item.travelClass} isTransfer={item.type !== 'regular'} />
                  </div>
                );

              } else if (itnItem === 'hotels') {
                return (
                  <div key={itemIndex}>
                    <HotelCard 
                      key={`hotels_${itemIndex}_${Math.random()}`}
                      itnId={item.itineraryId}        
                      checkIn={item.checkIn} checkOut={item.checkOut} date={item.data} time={item.time} travelClass={item.travelClass} mode='Train' />
                  </div>
                );
              }
            })} */}
            {item.alreadyBookedExpenseLines[itnItem].map((item, itemIndex) => {
    if (['flights', 'trains', 'buses'].includes(itnItem)) {
        return (
            <React.Fragment key={`flight_${itemIndex}`}>
                <FlightCard
                    from={item.from}
                    to={item.to}
                    itnId={item.itineraryId}
                    showActionButtons={travelRequestStatus !== 'pending approval' && item.status === 'pending approval'}
                    date={item.date} time={item.time} travelClass={item.travelClass} mode={titleCase(itnItem.slice(0, -1) ?? "")} />
            </React.Fragment>
        );
    } else if (itnItem === 'cabs') {
        return (
            <React.Fragment key={`cab_${itemIndex}`}>
                <CabCard
                    itnId={item.itineraryId}
                    from={item.pickupAddress} to={item.dropAddress} date={item.date} time={item.time} travelClass={item.travelClass} isTransfer={item.type !== 'regular'} />
            </React.Fragment>
        );
    } else if (itnItem === 'hotels') {
        return (
            <React.Fragment key={`hotel_${itemIndex}`}>
                <HotelCard
                    itnId={item.itineraryId}
                    checkIn={item.checkIn} checkOut={item.checkOut} date={item.data} time={item.time} travelClass={item.travelClass} mode='Train' />
            </React.Fragment>
        );
    }
})}

          </div>
        </details>
      </React.Fragment>
    )
  
   )}

</div>
{/* ///alreadybooked travel details */}

{/* ///saved lineItem */}
{/* get lineitem data from backend start*/}

{item.expenseLines.map((lineItem, index) => (

    lineItem.expenseLineId === editLineItemById ? 
    (
    <EditForm
    setExpenseAmountStatus={setExpenseAmountStatus}
    setGetExpenseData={setGetExpenseData}
    setEditLineItemById={setEditLineItemById}
    setIsUploading={setIsUploading}
    isUploading={isUploading} 
    companyDetails={onboardingData?.companyDetails}
    selectedAllocations= {selectedAllocations}
     expenseAmountStatus={onboardingData?.expenseAmountStatus}
     travelType={travelType}
    // tenantId={tenantId}
    routeData={{tenantId,empId,tripId,expenseHeaderId}}
    active ={active}
    setActive= {setActive}
    setShowPopup={setShowPopup}
    setMessage={setMessage}

    editFields={editFields}   
    travelAllocationFlag={travelAllocationFlag} 
    selectedCategory={selectedCategory} 
    categoryfields={categoryfields} 
    lineItemDetails={lineItemDetails} 
    classDropdownValues ={classDropdownValues} 
    lineItem={lineItem} 
    defaultCurrency={defaultCurrency}/>
    
    )  :
<>
<div className="flex flex-col lg:flex-row border">

<EditView 

expenseHeaderStatus={item?.expenseHeaderStatus}
isUploading={isUploading} 
active={active}
flagToOpen={onboardingData?.flagToOpen} 
expenseHeaderId={item?.expenseHeaderId} 
lineItem={lineItem} 
index={index} 
handleEdit={handleEdit}
newExpenseReport={item.newExpenseReport} 
handleDeleteLineItem={handleDeleteLineItem}/>
</div>
</>
  ))}
{/* </div> */}

{/* get lineItem data from backend end*/}


{/* </div> */}



 </div>
          )}
       </div>
        </React.Fragment>))}
      
 </div>

{/*start new //lineItemform */}
 {formVisible &&  
<div className=" w-full flex flex-col  lg:flex-row">

<div className="border w-full lg:w-1/2">
 <DocumentPreview selectedFile={ocrSelectedFile ||selectedFile}/>
</div>
<div className="border w-full lg:w-1/2 lg:h-[710px] overflow-y-auto scrollbar-hide">
<div className="w-full flex items-center justify-start h-[52px] border-b-[1px] px-4 ">
  <p className="text-zinc-600 text-medium font-semibold font-cabin capitalize">   Category -{selectedCategory}</p>
</div>
    <>
    
<div className=" w-full flex-wrap flex flex-col justify-center items-center p-2">

  <div className="w-full flex-row">
 <div className="w-full  flex-wrap flex items-center justify-center ">
 {travelAllocationFlag=== 'level3' &&
 <div>
          <AllocationComponent 
            errorMsg={errorMsg} 
            getSavedAllocations={getSavedAllocations} 
            travelAllocationFlag={travelAllocationFlag} 
            travelExpenseAllocation={travelExpenseAllocation}
            onAllocationSelection={onAllocationSelection}
          />
  </div>}
  {/* <div className="w-full border flex flex-wrap items-center justify-center"> */}
{selectedCategory&&categoryFieldBySelect && categoryFieldBySelect.map((field)=>(
          <React.Fragment key={field.name}>
  <div key={field.name} className="sm:w-1/2 w-full flex justify-center  items-center px-2 py-1 ">
          {field.name === 'From' || field.name === 'To' || field.name === 'Departure' || field.name === 'Pickup Location' ||field.name === 'DropOff Location' || field.name === 'Arrival' ? ( 
       <>       
        <Input
        // inputRef={''}
        // inputRef={autocompleteRefs[field.name] || (autocompleteRefs[field.name] = useRef())}
        title={field.name}
        name={field.name}
        type={'text'}
        initialValue={lineItemDetails[field.name]}
        placeholder={`Enter ${field.name}`}
        value={lineItemDetails[field.name  ||""]}
        onChange={(value)=>handleInputChange(field.name,value)}
      />
      </>
      ) : (field.name ==='Class' || field.name ==='Class of Service') ? (
          <div className="  w-full translate-y-[-6px] z-20">
        <Select
          title={field.name}
          name={field.name}
          placeholder={`Select ${field.name}`}
          options={classDropdownValues || []} // Define your class options here
          currentOption={lineItemDetails[field.name] || ''}
          onSelect={(value)=>handleInputChange(field.name, value)}
          // violationMessage={`Your violation message for ${field.name}`}
          // error={{ set: true, message: `Your error message for ${field.name}` }}
        />
        </div>
      ) :(
        // Otherwise, render a regular input field
        <Input
          initialValue={lineItemDetails[field.name]}
          // error={field.name=== 'Total Amount' ? errorMsg.totalAmount : null}
          // error={totalAmountNames.includes(field?.name) ? errorMsg.totalAmount : null}
          error={(totalAmountNames.includes(field?.name) && errorMsg.totalAmount) || (dateForms.includes(field?.name) && errorMsg.dateErr )}
          title={field.name}
          name={field.name}
          // type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
          type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : field.type === 'time' ? 'time' : 'text'}

          placeholder={`Enter ${field.name}`}
          value={lineItemDetails[field.name || '']}
          // inputRef={autocompleteRefs[field.name] || (autocompleteRefs[field.name] = useRef())}
          onChange={(value)=>handleInputChange(field.name , value)}
        />
      )}     
          </div>        
          </React.Fragment>
         ))}

  </div>

{/* //personal expense */}




<div className='flex flex-col px-2 justify-between'>
<div className="flex flex-row justify-evenly items-center h-[73px]"> 
<div className="flex-1 bg-white-100">
<Toggle label={'Personal Flag'} initialValue={false}  onClick={handlePersonalFlag}/>
</div>
{console.log('perosnal amount error',errorMsg.personalAmount)}
<div className=" flex-1 pl-2 justify-end">
  <div className="w-full ">
  {personalFlag &&
  <Input
  title='Personal Amount'
  error={errorMsg?.personalAmount}
  name='personalExpenseAmount'
  type={'text'}
  onChange={(value)=>handleInputChange( ['personalExpenseAmount'],value)}
  />}
</div>
</div>
</div> 

<div className="relative">
<div className=" h-[48px] w-full sm:w-[200px]  mb-10 mr-28 mt-[-10px] ">
   <Select
       title='Currency'
       currentOption={currencyDropdown[0].shortName}
       placeholder="Select Currency"
       options={currencyDropdown.map(currency => currency.shortName)} 
       onSelect={(value)=>handleCurrenctySelect(value)}
      //  onSelect={(value)=>{setLineItemDetails({...lineItemDetails,['Currency']:value}),setSelectDropdown(value)}}
       violationMessage="Your violation message" 
       error={errorMsg.currencyFlag} 
       />
</div>  
{/* ////-------- */}
<div className='absolute top-6 left-[210px] w-fit'>
{selectDropdown == null || selectDropdown.shortName !== defaultCurrency?.shortName   &&
<ActionButton disabled={active?.convert} loading={active?.convert} active={active.convert} text="Convert" onClick={()=>handleConverter( totalAmount ,lineItemDetails?.personalExpenseAmount)}/>
}
</div>
</div>
<div >
{currencyTableData?.currencyFlag  ? 
<div className={`flex gap-2 `}>
<div className="min-w-[200px] w-full  h-auto flex-col justify-start items-start gap-2 inline-flex mb-3">
<div className="text-zinc-600 text-sm font-cabin">Coverted Amount Details :</div>
<div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin  ">
  <div className="w-full h-full decoration:none  rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600">
    <div className={`sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100  border  ${currencyTableData?.convertedPersonalAmount == undefined ? "rounded-md" :"rounded-t-md"}`}>
      <div className="text-[16px] font-semibold text-neutral-600">Total Amount </div> 
      <div className="text-neutral-600 font-cabin">{currencyTableData?.defaultCurrencyName} {currencyTableData?.convertedTotalAmount?.toFixed(2)}</div>
  </div>
{currencyTableData?.convertedPersonalAmount !== undefined &&
<>
    <div className="sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100 ">
      <div className=" text-[16px] font-semibold text-neutral-600">Personal Amount </div> 
      <div className="text-neutral-600 font-cabin">{currencyTableData?.defaultCurrencyName} {currencyTableData?.convertedPersonalAmount?.toFixed(2)}</div>
  </div>
    <div className="sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-200 rounded-b-md border">
      <div className="  text-[16px] font-semibold text-neutral-600">Final Reimbursement Amount </div> 
      <div className="text-neutral-600 font-cabin">{currencyTableData?.defaultCurrencyName} {currencyTableData?.convertedBookableTotalAmount?.toFixed(2)}</div>
  </div>
  </>}
  </div>

</div>

</div>
</div>
   : 
  currencyTableData?.message !== undefined &&
  <div className={`flex items-center justify-center gap-2 border-[1px] px-4 py-2 rounded border-yellow-600  text-yellow-600 mt-6`} >
    <img src={validation_symb_icon} className='w-5 h-5'/>
  <h2 className=''>{currencyTableData?.message}</h2>
  </div>
 } 
</div>

<div className='flex w-fit mb-4'>
  <Select 
  //currentOption={defaultCurrency}
   title="Paid Through"
   name="mode of payment"
   placeholder="Select MOD"
   options={['Credit Card',"Cash",'Debit Card','NEFT']}
   onSelect={(value)=>handleInputChange( ['Mode of Payment'],value)}/>
</div>


{/* ------////-------- */}


<div className="w-full mt-4 flex items-center justify-center border-[1px] border-gray-50 ">
<Upload  
  selectedFile={selectedFile}
  setSelectedFile={ setSelectedFile}
  fileSelected={fileSelected}
  setFileSelected={setFileSelected}
  />
</div>
</div>
<div className="w-full mt-5 px-4">
 <Button text="Save" 
 disabled={isUploading} 
 loading={isUploading} 
 active={active.saveLineItem}
 onClick={handleSaveLineItemDetails} />
</div>   

{/* -------------------- */}


     
     </div>
</div>
   
  
    </>
 
 
</div>

</div>}

   
{/* end //lineItemform */}


           </div>              
            </div>
            </div>
            {openModal =='category' && 
            <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 " >
                <div className='z-20  min-h-4/5 max-h-4/5 scroll-none bg-white-100  rounded-lg shadow-md'>
                <div onClick={()=>{setOpenModal(null);}} className=' w-10 h-10 flex translate-y-[-15px] translate-x-[-10px] mt-5 justify-center items-center float-right   hover:bg-red-300 rounded-full'>
                      <img src={cancel_icon} className='w-8 h-8'/>
                  </div>
                    <div className="p-10">
                      <div className="flex flex-col justify-center items-center">
                        <p className="text-xl font-cabin">Select the expense  category for this line item:</p>
                                  <div className="w-fit">
                                    <Search 
                                    title='.'
                                    placeholder='Search Category' 
                                    options={categoriesList}
                                    onSelect={(category)=>handleCategorySelection(category)}/>
                                  </div>   
                        <div className="flex w-full mt-10 justify-evenly">
                            <Button variant='fit' text='Scan Bill' onClick={()=>handleOpenModal('upload')} disabled={selectedCategory== null? true : false}/>
                            <Button variant='fit' text='Manually' onClick={()=>{setOpenLineItemForm(true);setOpenModal(false);setFormVisible(true)}} disabled={selectedCategory== null}/>
                        </div>
                        </div>

                    </div>
                </div>
                </div>
            }

            {openModal==='upload' && 
            <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none " >
                <div className='z-10  md:w-3/5 w-full mx-8  min-h-4/5 max-h-4/5 scroll-none bg-white-100  rounded-lg shadow-md'>
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
                        {/* <p>Size: {selectedFile.size} bytes</p>
                        <p>Last Modified: {selectedFile.lastModifiedDate.toString()}</p> */}
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
                                   fileSelected={ocrFileSelected}
                                   setFileSelected={setOcrFileSelected}/>
                                  </div>
                                  </> }
                        
                           
                        
                        </div>

                    </div>
                </div>
                </div>
            }


        </div>


        <div>

        </div>
        </div>
      }

      <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>

  </>;
}





//expense allocation
function AllocationComponent ({errorMsg, getSavedAllocations,travelExpenseAllocation ,travelAllocationFlag , onAllocationSelection}) {
  const validAllocationFlags = ['level1', 'level2','level3'];
  console.log('saved allocation from',)
  return(
     <div  className="flex md:flex-row flex-col my-5 justify-evenly items-center flex-wrap">            
         {validAllocationFlags.includes(travelAllocationFlag)  && travelExpenseAllocation && travelExpenseAllocation?.map((expItem , index)=>(
              <React.Fragment key={index}>
              <div className="h-[48px] inline-flex my-4 mx-2">
                <Select 
                  // error={errorMsg.allocations}
                  error={errorMsg[expItem?.headerName]}
                  currentOption={getSavedAllocations?.find(item => item?.headerName === expItem?.headerName)?.headerValue ?? ''}
                  options={expItem.headerValues}
                  onSelect={(option) => onAllocationSelection(option, expItem.headerName)}
                  placeholder='Select Allocation'
                  title={`${titleCase(expItem.headerName ?? "")}`}
                />            
              </div>
              </React.Fragment>
       ))}       
     </div> )}




///expense details on header
function ExpenseHeader({
  selectedExpenseSettlement,
  errorMsg,
  expenseHeaderStatus,
  tripPurpose,
  tripNumber,
  name,
  formData
  ,isUploading,
    active
   ,approversList
   ,onReasonSelection
   ,settlementOptions,
    defaultCurrency,
    cancel,
    handleCancelExpenseHeader,
    handleSubmitOrDraft,
    expenseAmountStatus
   }){
  return(
    <>
    <div className='flex flex-col md:flex-row mb-2 justify-between items-center'>
              <div>
                <p className="text-2xl text-neutral-600 mb-5">{`${tripPurpose?? "N/A"}`}</p>
              </div>
                <div className="inline-flex gap-4 justify-center items-center">
                    {cancel ?
                    
                    (<div className="flex mt-10 flex-row-reverse">
                    <Button loading={isUploading} active={active.deleteHeader} variant='fit' text='Cancel' onClick={()=>handleCancelExpenseHeader()}/>
                   </div>):
                  
                    (<>
                    {['draft','new'].includes(expenseHeaderStatus) && 
                    <div className="flex mt-10 flex-row-reverse">
                    <Button loading={isUploading} active={active.saveAsDraft} text='Save as Draft' onClick={()=>handleSubmitOrDraft("draft")}/>
                   </div>}
                    <div className="flex mt-10 flex-row-reverse">
                    <Button loading={isUploading} active={active.submit} variant='fit' text='Submit' onClick={()=>handleSubmitOrDraft("submit")}/>
                   </div>
                   </>)}   
                </div>
            </div>

   
<div className="flex md:flex-row flex-col gap-2 justify-between w-full  ">
  <div className=" md:w-1/5 w-full  flex  border-[1px] border-slate-300 rounded-md flex-row items-center gap-2 p-2 ">
    <div className="bg-slate-200 rounded-full p-4 shrink-0 w-auto">
      <img src={user_icon} className="w-4 h-4 "/>
      </div>
      <div className='font-cabin '>
      <p className=" text-neutral-600 text-xs ">Created By</p>
      <p className="text-purple-500 text-medium font-medium">{name?? "not available"}</p>
      </div>
  </div>
  <div className="   flex md:w-1/5 w-full border-[1px] border-slate-300 rounded-md flex-row items-center gap-2 p-2 ">

    <div className="bg-slate-200 rounded-full p-4 shrink-0 w-auto">
      <img src={briefcase} className="w-4 h-4 "/>
      </div>
  
      <div className='font-cabin '>
      <p className=" text-neutral-600 text-xs ">Trip Number</p>
      <p className="text-purple-500 text-medium font-medium">{tripNumber?? "not available"}</p>
      </div>
  </div>
  <div className="   flex md:w-3/5 w-full border-[1px] border-slate-300 rounded-md flex-row items-center gap-2 p-2 ">
    <div className="bg-slate-200 rounded-full p-4 shrink-0 w-auto ">
      <img src={money} className="w-4 h-4  "/>
      </div>
  <div className="flex flex-row justify-between w-full gap-2 ">
      <div className='flex-1 font-cabin flex-grow '>
      <p className=" text-neutral-600 text-xs line-clamp-1">Total CashAdvance</p>
      <p className="text-purple-500 text-medium font-medium">{expenseAmountStatus?.totalCashAmount?.toFixed(2)??"not available"}</p>
      </div>
      <div className='flex-1 font-cabin  px-2 '>
      <p className=" text-neutral-600 text-xs line-clamp-1   ">Remaining  CashAdvance</p>
      <p className="text-purple-500 text-medium font-medium">{expenseAmountStatus?.totalRemainingCash?.toFixed(2)??"not available"}</p>
      </div>
      <div className=' flex-1 font-cabin  px-2 '>
      <p className=" text-neutral-600 text-xs line-clamp-1">Default Currency</p>
      <p className="text-purple-500 text-medium font-medium">{defaultCurrency?.shortName ?? "not available"}</p>
      </div>
      </div>  
  </div>
 
   
        
   
       
   
</div>



<div className=" flex flex-col gap-2 lg:flex-row">
{approversList?.length>0 && <div className="h-[48px]">
<Select 
  
  options={approversList}
  onSelect={onReasonSelection}
  placeholder='Select Approver'
  title="Select Approver"
/>
</div>}

{settlementOptions.length>0 &&
<div>

<Select 
  currentOption={selectedExpenseSettlement}
  options={settlementOptions}
  onSelect={onReasonSelection}
  error={errorMsg?.expenseSettlement}
  placeholder='Select Travel Expense '
  title="Expense Settlement"
/>

</div>}
</div>
</>
  )
}









function spitImageSource(modeOfTransit){
    if(modeOfTransit === 'Flight')
        return airplane_icon
    else if(modeOfTransit === 'Train')
        return cab_icon
    else if(modeOfTransit === 'Bus')
        return cab_icon
}





function FlightCard({amount,from, mode='Flight', showActionButtons, itnId, handleLineItemAction}){
    return(
    <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
    <img src={spitImageSource(mode)} className='w-4 h-4' />
    <div className="w-full flex sm:block">
        <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
            <div className="flex-1">
                Travel Allocation   
            </div>
            <div className="flex-1">
                Amount
            </div>
            <div className="flex-1">
                Already Booked
            </div>
        </div>

        <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
            <div className="flex-1 capitalize">
                {from}     
            </div>
            
            <div className="flex-1">
                {amount??'N/A'}
            </div>
            <div className='flex-1'>
                <input type="checkbox" defaultChecked/>
              
            </div>
        </div>
    </div>

    {/* {showActionButtons && 
    <div className={`flex items-center gap-2 px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100  hover:bg-red-100  hover:text-red-900 `} onClick={onClick}>
        <div onClick={()=>handleLineItemAction(itnId, 'approved')}>
            <ActionButton text={'approve'}/>
        </div>
        <div onClick={()=>handleLineItemAction(itnId, 'rejected')}>
            <ActionButton text={'reject'}/>   
        </div>   
    </div>} */}

    </div>)
}



function HotelCard({amount, hotelClass, onClick, preference='close to airport,'}){
    return(
    <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
    <p className='font-semibold text-base text-neutral-600'>Hotel</p>
    <div className="w-full flex sm:block">
        <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
           <div className="flex-1">
           Travel Allocation   
            </div>
            <div className="flex-1">
                Amount
            </div>
            
            <div className='flex-1'>
                Already Booked
            </div>
        </div>

        <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
            <div className="flex-1">
                {/* {checkIn}      */}
                Deparment
            </div>
            <div className="flex-1">
                {hotelClass??'N/A'}
            </div>
            <div className='flex-1'>
                <input type="checkbox" defaultChecked/>
            </div>
        </div>

    </div>

   

    </div>)
}

function CabCard({amount,from, to, date, time, travelClass, onClick, mode, isTransfer=false, showActionButtons, itnId, handleLineItemAction}){
    return(
    <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
    <div className='font-semibold text-base text-neutral-600'>
    <img src={cab_icon} className='w-6 h-6' />
        <p className="text-xs text-neutral-500">{isTransfer? 'Transfer Cab': 'Cab'}</p>
    </div>
    <div className="w-full flex sm:block">
        <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
            {/* <div className="flex-1">
                Pickup     
            </div> */}
            <div className="flex-1" >
            Travel Allocation   
            </div>
            {/* <div className="flex-1">
                    Date
            </div> */}
            <div className="flex-1">
                Amount
            </div>
            {<div className="flex-1">
               Already Booked
            </div>}
        </div>

        <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
            {/* <div className="flex-1">
                {from??'not provided'}     
            </div> */}
            <div className="flex-1">
                {/* {to??'not provided'}      */}
                Legal Entity
            </div>
            {/* <div className="flex-1">
                {date??'not provided'}
            </div> */}
            <div className="flex-1">
                {amount??'N/A'}
            </div>
           {/* {!isTransfer && <div className="flex-1">
                {travelClass??'N/A'}
            </div>} */}
             <div className='flex-1'>
                <input type="checkbox" defaultChecked/>
            </div>
        </div>
    </div>
  
    </div>)
}



function EditView({expenseHeaderStatus,isUploading,active,flagToOpen,expenseHeaderId,lineItem, index ,newExpenseReport ,handleEdit, handleDeleteLineItem}){
  console.log('lineItems for edit view', lineItem)
  const excludedKeys=["policyValidation" , "lineItemStatus","expenseLineId","alreadySaved","isPersonalExpense","isMultiCurrency","expenseLineAllocation","billImageUrl","_id",'travelType','Category Name','Currency','allocations' ,'isPersonalExpense' ,'policyViolation','billImageUrl']
  const includedKeys =['Total Fair','Total Fare','Total Amount',  'Subscription Cost', 'Cost', 'Premium Cost','personalExpenseAmount'];
  return(
    <>
<div className="border w-full lg:w-1/2">
  {/* {lineItem.Document} */}
  <DocumentPreview initialFile={lineItem.Document}/>
</div>
<div className="border w-full lg:w-1/2 flex justify-between flex-col h-[710px] overflow-y-auto scrollbar-hide">
    <div className="w-full flex-row   ">
     
     <div className="w-full flex justify-between items-center h-12  px-4 border-dashed border-b-[1px]">
      <p className="text-zinc-600 text-medium font-semibold font-cabin">Sr. {index+1} </p>
      <p className="text-zinc-600 text-medium font-semibold font-cabin capitalize">   Category -{lineItem?.['Category Name']}</p>
    </div>   
    <div className="pb-4 px-4">
    {lineItem?.allocations ? 
        lineItem?.allocations?.map((allocation, index) => (
          <div key={index} className="min-w-[200px] min-h-[52px] ">
            <div className="text-zinc-600 text-sm font-cabin capitalize py-1">{allocation.headerName}</div>
            <div className="w-full h-12 bg-white items-center flex border border-neutral-300 rounded-md">
              <div>
                <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin px-6 py-2">
                  {allocation.headerValue}
                </div>
              </div>
            </div>
            {/* <div className="w-full text-xs text-yellow-600 font-cabin">{['policyViolation']}</div> */}
          </div> 
        )): ""}
    </div>

    <div key={index} className="w-full  flex flex-wrap items-start gap-y-8  justify-between py-4 px-4">
        {Object.entries(lineItem).map(([key, value]) => (

     !excludedKeys.includes(key)  && value !== null && value !== 0 &&(

  <React.Fragment key={key}>
   {key !== 'convertedAmountDetails'&& 
      <div className="min-w-[180px] w-full md:w-fit  h-[48px]  flex-col justify-start items-start ">
                        
            <div className="text-zinc-600 text-sm font-cabin capitalize"> {(key !== 'convertedAmountDetails' && key === 'personalExpenseAmount') ? 'Personal Expense' : key}</div>
            <div className=" w-auto md:max-w-[180px] overflow-x-scroll  overflow-hidden scrollbar-hide h-full bg-white items-center flex border border-neutral-300 rounded-md ">
            
            
                  <div key={key}>
                    <div className="text-neutral-700  truncate  w-full h-full text-sm font-normal font-cabin px-6 py-2 ">
                      
                    {includedKeys.includes(key) ? `${(lineItem['Currency']?.shortName)} ${parseFloat(value).toFixed(2)}` : `${key === 'group' ? value?.group : value}`}
                    </div>
                    
                  </div>
                  
                
            </div> 
            
            {/* <div className=" w-full text-xs text-yellow-600 font-cabin">{['policyViolation']}</div> */}
      </div>}

  {key === 'convertedAmountDetails' &&   
<div className="min-w-[200px] w-full  h-auto flex-col justify-start items-start gap-2 inline-flex my-6">
<div className="text-zinc-600 text-sm font-cabin">Coverted Amount Details :</div>
<div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin  ">
  <div className="w-full h-full decoration:none  rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600">
    <div className={`sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start min-h-12  justify-between bg-slate-100 rounded-t-md ${!value?.convertedPersonalAmount ? "rounded-md" :"rounded-t-md" }`}>
      <div className="text-[16px] font-medium text-neutral-600">Total Amount </div> 
      <div className="text-neutral-600 font-cabin">{value?.defaultCurrencyName} {value?.convertedTotalAmount && parseFloat(value?.convertedTotalAmount).toFixed(2)}</div>
  </div>

{value?.convertedPersonalAmount && (
  <>
    <div className="sm:px-6 px-4  py-2 flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100">
      <div className="text-[16px] font-medium text-neutral-600">Personal Amount </div>
      <div className="text-neutral-600 font-cabin">
        {value?.defaultCurrencyName} {parseFloat(value?.convertedPersonalAmount ?? 0).toFixed(2)}
      </div>
    </div>
    <div className="sm:px-6 px-4 py-2 flex sm:flex-row flex-col  sm:items-center items-start justify-between min-h-12 bg-slate-200 rounded-b-md">
      <div className="text-[16px] font-medium text-neutral-600 max-w-full  whitespace-nowrap"><p className=" text-ellipsis">Final Reimbursement Amount </p></div>
      <div className="text-neutral-600 font-cabin">
        {value?.defaultCurrencyName} {parseFloat(value?.convertedBookableTotalAmount ?? 0).toFixed(2)}
      </div>
    </div>
  </>
)}

  </div>

</div>

</div>} 
        </React.Fragment>
         )
         ))}
         
    
         
       
    </div>
   
    
    </div>
    <div className='p-2 border-dashed border-t-[1px]'>
    {  !['paid', 'paid and distribute'].includes(expenseHeaderStatus) &&<div className="w-full flex sm:justify-start justify-center gap-4" >
            <Button text="Edit"   onClick={()=>handleEdit(lineItem?.expenseLineId,lineItem?.['Category Name'],lineItem.travelType)} />
            <Button  loading={isUploading} active={(active?.delete?.id === lineItem?.expenseLineId ? active?.delete?.visible : false)}  text="Delete" onClick={()=>(handleDeleteLineItem(lineItem))} />
          </div>}
    </div>      
</div>

</>
  )
}




const EditForm =({ setExpenseAmountStatus,setGetExpenseData,setEditLineItemById,setIsUploading,routeData,companyDetails,selectedAllocations ,expenseAmountStatus,travelType,active,isUploading ,setActive,setShowPopup,setMessage ,selectedCategory, travelAllocationFlag ,editFields, categoryFields ,lineItemDetails,classDropdownValues,lineItem,defaultCurrency} )=>{
  const prevStageLineItem = lineItem && lineItem
  const { tenantId,empId,tripId,expenseHeaderId }= routeData
  const [editFormData ,setEditFormData]=useState(lineItem)
  const [selectedCurrency , setSelectedCurrency]=useState(null)
  const [selectedFile ,setSelectedFile]=useState(null)
  const [fileSelected,setFileSelected]=useState(false)
  const [totalAmount ,setTotalAmount]=useState(null)
  const [date , setDate]=useState(null)
  const [currencyTableData ,setCurrencyTableData]=useState(null)

  const[ personalFlag , setPersonalFlag]=useState()
  const [errorMsg,setErrorMsg]=useState({
    currencyFlag:{set:false,msg:""},
    totalAmount:{set:false,msg:""}, 
    personalAmount:{set:false,msg:""},
    dateErr:{set:false, msg :""}
  })
 
  // const[categoryFields, setCategoryFields]=useState(null)
  const [initialFile , setInitialFile]=useState(null)
  useEffect(() => {
    // Set the initial file when the component is mounted
    setInitialFile(lineItem?.Document);
    console.log('line item form edit',lineItem)
    const foundKey = totalAmountNames.find(key => Object.keys(lineItem).includes(key));
    const totalAmountValue = foundKey ? lineItem[foundKey] : undefined;
    setTotalAmount(totalAmountValue)
    const foundDateKey = dateForms.find(key => Object.keys(lineItem).includes(key));
    const dateValue = foundDateKey ? lineItem[foundDateKey] : undefined;
    setDate(dateValue)
    setPersonalFlag(lineItem?.isPersonalExpense)
  }, []);

  console.log('categoryFields1', personalFlag)
 

//  useEffect(()=>{
//   if(travelAllocationFlag ==='level2'){
//     const internationalData = categoryfields && categoryfields.find(
//       (category) => category.hasOwnProperty(lineItem.travelType)
//     )?.international;
//     setCategoryFields(internationalData)
//     console.log('level2 fields after got travelType',internationalData)
//   }
//   if(travelAllocationFlag ==='level1'){
//     setCategoryFields(categoryfields)
//   }

//  },[])
 

//Edit Handle
console.log('total amount11',totalAmount)
const  handleCurrenctySelect= (shortName)=>{

  const selectedCurrencyObject = currencyDropdown.find(currency => currency.shortName === shortName);
  console.log('currency',selectedCurrencyObject)
 
  setSelectedCurrency(selectedCurrencyObject)
  setEditFormData((prevState)=>({...prevState,Currency:selectedCurrencyObject}))
  if(shortName !== defaultCurrency?.shortName){
    setEditFormData((prevState)=>({...prevState,isMultiCurrency:true}))
    
      
  }else{
    // setIsMultiCurrency(false)
    setEditFormData((prevState)=>({...prevState,isMultiCurrency:false}))
    setEditFormData((prevState)=>({...prevState,convertedAmountDetails:null}))
  }
  if(shortName === defaultCurrency?.shortName){
    setCurrencyTableData(null)
  }
  setSelectedCurrency(shortName)
}
console.log('currency for edit ',selectedCurrency)

//Edit Handle
  const handlePersonalFlag=()=>{
     setPersonalFlag((prev)=>(!prev))
     if(personalFlag){
     setEditFormData({...editFormData,isPersonalExpense: false,personalExpenseAmount:""})
    //  if(selectedCurrency?.shortName !==defaultCurrency?.shortName ){
    //   setEditFormData((prevData)=>({...prevData, convertedAmountDetails:{convertedBookableTotalAmount}}))
    //  }
     
    }else{
       setEditFormData((prevData) => ({ ...prevData, isPersonalExpense:true}))
  }}



   

  useEffect(()=>{
    if (fileSelected) {
      setEditFormData((prevData)=>({
        ...prevData,
        ['Document']: selectedFile,
      }));
    }
  },[(selectedFile)])
// Edit Handle
    const handleEditChange = (key , value)=>{

      setEditFormData((prevData)=>({...prevData , [key]: value}))
      if (totalAmountNames.includes(key)) {
        setTotalAmount(value);
      }
      if (dateForms.includes(key)) {
        setDate(value);
      }
      
    }
    console.log('total amount for edit', totalAmount)
    console.log('date for edit', date)


  
//Edit Handle
    const handleConverter = async (totalAmount ,personalExpenseAmount ) => { 

      let allowForm = true;
      if (totalAmount === 0 || totalAmount === undefined || totalAmount ===""){
        setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: true, msg: "Enter total amount" } }));
        allowForm = false;
        console.log('total amount  is empty' , totalAmount)
      } else {
        setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: false, msg: "" } }));
      }
      if (personalFlag && (personalExpenseAmount === "" || personalExpenseAmount === undefined)) {
        setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: true, msg: "Enter personal amount" } }));
        allowForm = false;
      } else {
        setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: false, msg: "" } }));   
      }
      const nonPersonalAmount = (totalAmount || 0) - personalExpenseAmount;
      
      const validPersonalAmount =( totalAmount ||0 ) - personalExpenseAmount
      if (validPersonalAmount <=0 ) {
        setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: true, msg: "Personal Expense amount should be less than Total Expenditure" } }));
        allowForm = false;
      }
      
    
      if (allowForm) {
       
        const convertDetails = {
          currencyName: selectedCurrency,
          personalAmount: personalExpenseAmount || "",
          nonPersonalAmount: nonPersonalAmount || "",
          totalAmount: totalAmount 
         
        };
        console.log('sent converted details',convertDetails)
      
        ///api 
            try {
              setIsUploading(true)
              setActive(prevState => ({ ...prevState, convert: true }));
              const response = await postMultiCurrencyForTravelExpenseApi(tenantId,convertDetails);
              setCurrencyTableData(response?.currencyConverterData || {})
              setEditFormData({...editFormData,convertedAmountDetails:response?.currencyConverterData || {}})
            
              if (selectedCurrency !== defaultCurrency?.shortName && !response?.currencyConverterData?.currencyFlag){
                setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: true, msg: "Conversion not available, Please contact admin" } }));
                console.log('converted flag no' , )
              } else {
                setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: false, msg: "" } }));
              }
              setActive(prevState => ({ ...prevState, convert: false }));
              setIsUploading(false)
              console.log('converted amount fetched',response.currencyConverterData);
            } catch (error) {
              setIsUploading(false)
              setActive(prevState => ({ ...prevState, convert: false }));
              console.log('Error in fetching expense data for approval:', error.message);
              setShowPopup(true)
              setMessage(error.message);
              setTimeout(() => {setMessage(null);setShowPopup(false);setActive(prevState => ({ ...prevState, convert: false }));},5000);
            }
      }
    };


//Edit Handle
    const handleSaveLineItemDetails = async() => { 
      const {personalExpenseAmount,convertedAmountDetails}=editFormData
      let allowForm = true
      const foundTotalAmtKey = totalAmountNames.find(key => Object.keys(lineItemDetails).includes(key));
      const foundDateKey = dateForms.find(key => Object.keys(lineItemDetails).includes(key));

      if(!['Travel Insurance'].includes(lineItem?.['Category Name']) && (!date || date=== "")){
        setErrorMsg((prevErrors) => ({ ...prevErrors, dateErr: { set: true, msg: `Enter ${foundDateKey}` } }));
        allowForm = false;
        console.log('total amount  is empty1' , date)
      }else {
        setErrorMsg((prevErrors) => ({ ...prevErrors, dateErr: { set: false, msg: "" } }));
      }
      if (selectedCurrency !== defaultCurrency?.shortName && !convertedAmountDetails?.currencyFlag){
        setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: true, msg: "Conversion not available!" } }));
        allowForm = false;
        console.log('converted flag no' , )
      } else {
        setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: false, msg: "" } }));
      }

      if (totalAmount === 0 || totalAmount === undefined || totalAmount ==="" ){
        setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: true, msg: `Enter ${foundTotalAmtKey}` } }));
        allowForm = false;
        // console.log('total amount  is empty' , totalAmount)
      } else {
        setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: false, msg: "" } }));
      }
      const validPersonalAmount = (totalAmount || 0) - (personalExpenseAmount || 0);

      if ((personalFlag && validPersonalAmount <= 0) || (personalFlag && (personalExpenseAmount === "" || personalExpenseAmount === undefined))) {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          personalAmount: {
            set: true,
            msg: validPersonalAmount < 0
              ? "Personal Expense amount should be less than Total Expenditure"
              : "Enter personal amount"
          }
        }));
        allowForm = false;
      } else {
        setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: false, msg: "" } }));
      }
    // const companyDetails = onboardingData?.companyDetails
       const dataWithCompanyDetails={
        companyDetails,
        travelType,
        expenseAmountStatus,
        expenseLineEdited:editFormData,
        expenseLine:prevStageLineItem,
        allocations: selectedAllocations
      }

    //  if(travelAllocationFlag==='level2'){
    //   dataWithCompanyDetails = {...dataWithCompanyDetails , travelType:selectedTravelType}
    //  }
      console.log('save line item1', dataWithCompanyDetails)
      const data = dataWithCompanyDetails
      if(allowForm){
      try {
        setIsUploading(true)
        setActive(prevState => ({ ...prevState, saveLineItem: true }));
        const response = await updateTravelExpenseLineItemApi(tenantId,empId,tripId,expenseHeaderId,data); 
        setGetExpenseData(response?.travelExpenseData);
        setEditLineItemById(null)
        setExpenseAmountStatus(response?.expenseAmountStatus)
        // setGetExpenseData(updatedExpenseData)
        // setFormVisible(false)
        setShowPopup(true)
        setMessage(response?.message)
        setIsUploading(false)
        setActive(prevState => ({ ...prevState, saveLineItem: false }));
        
        setTimeout(() => {setShowPopup(false);setMessage(null);},5000)
      } catch (error) {
        
        setMessage(error.message);
        setShowPopup(true);
        setIsUploading(false);
        setActive(prevState => ({ ...prevState, saveLineItem: false }));
        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
      } }
      // setSelectedCategory(null)
    };

  

  return(
    <>
    <div className="flex flex-col lg:flex-row border">
    <div className="border w-full lg:w-1/2">
    <div className='w-full  border  flex justify-center items-center '>
       <DocumentPreview selectedFile={selectedFile} initialFile={initialFile}/>
    </div>
    </div>
    <div className="border w-full lg:w-1/2 h-[710px] scrollbar-hide overflow-hidden overflow-y-auto">
    <div className="w-full flex items-center justify-start h-[52px] border px-4 ">
      {/* <p className="text-zinc-600 text-medium font-semibold font-cabin">Sr. {index+1} </p> */}
      <p className="text-zinc-600 text-medium font-semibold font-cabin capitalize">   Category -{lineItem?.['Category Name']}</p>
    </div> 
    
      <div  className="w-full border flex flex-wrap items-start sm:justify-between justify-center sm:gap-0 gap-4 py-4 px-2">

   {/* <div className="w-full border flex flex-wrap items-center justify-center"> */}
  {selectedCategory && editFields && editFields?.fields.map((field)=>(
  // {selectedCategory && categoryFields && categoryFields.find((category)=>category.categoryName === selectedCategory).fields.map((field)=>(
          <>
  <div key={field.name} >

    {field.name === 'From' || field.name === 'To' || field.name === 'Departure' || field.name === 'Pickup Location' ||field.name === 'DropOff Location' || field.name === 'Arrival' ? (
       <>       
        <Input
        id="pac-input"
        title={field.name}
        name={field.name}
        initialValue={editFormData[field.name]}
        // type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
        type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : field.type === 'time' ? 'time' : 'text'}
        placeholder={`Enter ${field.name}`}
        onChange={(value)=> handleEditChange(field.name, value)}
      />
      </>
      ) : (field.name ==='Class' || field.name ==='Class of Service') ? (
        
        // <div className=" w-fit">
        <div className="relative">
        <Select
          title={field.name}
          placeholder={`Select ${field.name}`}
          options={classDropdownValues || []}// Define your class options here
          // onSelect={(value) => handleDropdownChange(value, field.name)} // You might need to handle the dropdown selection
          currentOption={lineItem['Class of Service'] || lineItem['Class']}
          // violationMessage={`Your violation message for ${field.name}`}
          // error={{ set: true, message: `Your error message for ${field.name}` }}
          onSelect={(value) => handleEditChange(field.name ,value)}
        />
        </div>
        // </div>
      ) :(
       
        <Input
          title={field.name}
          name={field.name}
          // type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
          type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : field.type === 'time' ? 'time' : 'text'}
          placeholder={`Enter ${field.name}`}
          initialValue={editFormData[field.name]}
          onChange={(value)=> handleEditChange(field.name,value)}
          error={(totalAmountNames.includes(field?.name) && errorMsg.totalAmount) || (dateForms.includes(field?.name) && errorMsg.dateErr )}
          // error={totalAmountNames.includes(field?.name) ? errorMsg.totalAmount : null}
        />
      )} </div>

          </>
         ))}       

{/* //personal expense */}
<div className='flex flex-col  sm:justify-between justify-center w-full'>
<div className="flex flex-col md:flex-row gap-4">
<div className="w-1/2 sm:flex-row flex-col  h-[52px] flex items-center justify-center   mb-5">

<div className="w-[100px] flex flex-col items-center">
<div>
{/* <ActionButton variant='red' text={personalFlag ? "NO"  : "YES" } onClick={handlePersonalFlag}/> */}
<Toggle initialValue={personalFlag} label={'Personal Flag'}  checked={personalFlag} onClick={handlePersonalFlag}/>
</div>
</div>
</div>

<div className="w-1/2 ">
{personalFlag &&
<Input
title='Personal Amount'
error={ errorMsg.personalAmount}
name='personalAmount'
type={'text'}
initialValue={editFormData?.['personalExpenseAmount']}
onChange={(value)=>handleEditChange('personalExpenseAmount',value)}
/>}
</div> 
</div>

{/* //personal expense */}
<div className="flex flex-row items-center">
<div className="h-[48px] w-[100px]  mb-10 mr-28 mt-[-10px] ">
   <Select
       placeholder="Select Currency"
       title="Currency"
       options={currencyDropdown.map(currency => currency.shortName)} 
      //  onSelect={(value) => handleDropdownChange(value, 'currencyName')}
       currentOption={lineItem?.['Currency']?.shortName}
       violationMessage="Your violation message" 
       error={errorMsg.currencyFlag} 
       onSelect={(value) =>{ handleCurrenctySelect(value)}}
       />
</div>  
<div className="w-fit">
{ selectedCurrency == null || selectedCurrency !== defaultCurrency?.shortName   &&
<ActionButton loading={isUploading} active={active.convert}  text="Convert" onClick={()=>handleConverter(totalAmount, editFormData?.personalExpenseAmount)}/>
}  
</div>
 
</div>

<div >
{editFormData?.convertedAmountDetails?.currencyFlag ? 
<div className='flex gap-2'>
<div className="min-w-[200px] w-full  h-auto flex-col justify-start items-start gap-2 inline-flex mb-3">
<div className="text-zinc-600 text-sm font-cabin">Coverted Amount Details :</div>
<div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin">
  <div className="w-full h-full decoration:none  rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600">
    <div className={`sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100  ${editFormData?.convertedAmountDetails?.convertedPersonalAmount == undefined ? "rounded-md":"rounded-t-md"}`}>
      <div className="text-[16px] font-semibold text-neutral-600">Total Amount </div> 
      <div className="text-neutral-600 font-cabin">{editFormData?.convertedAmountDetails?.defaultCurrencyName} {editFormData?.convertedAmountDetails?.convertedTotalAmount?.toFixed(2)}</div>
  </div>
{editFormData?.convertedAmountDetails?.convertedPersonalAmount !== undefined &&
<>
    <div className="sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between min-h-12 bg-slate-100 rounded-t-md">
      <div className=" text-[16px] font-semibold text-neutral-600">Personal Amount </div> 
      <div className="text-neutral-600 font-cabin">{editFormData?.convertedAmountDetails?.defaultCurrencyName} {editFormData?.convertedAmountDetails?.convertedPersonalAmount?.toFixed(2)}</div>
  </div>
    <div className="sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between min-h-12 bg-slate-200 rounded-b-md">
      <div className="  text-[16px] font-semibold text-neutral-600">Final Reimbursement Amount </div> 
      <div className="text-neutral-600 font-cabin">{editFormData?.convertedAmountDetails?.defaultCurrencyName} {editFormData?.convertedAmountDetails?.convertedBookableTotalAmount?.toFixed(2)}</div>
  </div>
  </>}
  </div>
</div>
</div>
</div>
   : 
  currencyTableData?.message !== undefined &&
  <div className=' flex items-center justify-center gap-2 border-[1px] px-4 py-2 rounded border-yellow-600  text-yellow-600 mt-6'>
    <img src={validation_symb_icon} className='w-5 h-5'/>
  <h2 className=''>{currencyTableData?.message}</h2>
  </div>
 } 
</div>
{/* <div >
{currencyTableData?.currencyFlag  ? 
<div className='flex gap-2'>
<div className="min-w-[200px] w-full  h-auto flex-col justify-start items-start gap-2 inline-flex mb-3">
<div className="text-zinc-600 text-sm font-cabin">Coverted Amount Details :</div>
<div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin  ">
  <div className="w-full h-full decoration:none  rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600">
    <div className="  px-6  flex flex-row justify-between items-center h-12 bg-slate-300">
      <div className="text-[16px] font-semibold text-neutral-600">Total Amount </div> 
      <div className="text-neutral-600 font-cabin">{currencyTableData?.defaultCurrencyName} {currencyTableData?.convertedTotalAmount?.toFixed(2)}</div>
  </div>
{currencyTableData?.convertedPersonalAmount !== undefined &&
<>
    <div className="px-6 flex flex-row justify-between items-center h-12 bg-slate-300">
      <div className=" text-[16px] font-semibold text-neutral-600">Personal Amount </div> 
      <div className="text-neutral-600 font-cabin">{currencyTableData?.defaultCurrencyName} {currencyTableData?.convertedPersonalAmount?.toFixed(2)}</div>
  </div>
    <div className="px-6 flex flex-row justify-between items-center h-12 bg-slate-400">
      <div className="  text-[16px] font-semibold text-neutral-600">Final Reimbursement Amount </div> 
      <div className="text-neutral-600 font-cabin">{currencyTableData?.defaultCurrencyName} {currencyTableData?.convertedBookableTotalAmount?.toFixed(2)}</div>
  </div>
  </>}
  </div>

</div>

</div>
</div>
   : 
  currencyTableData?.message !== undefined &&
  <div className=' flex items-center justify-center gap-2 border-[1px] px-4 py-2 rounded border-yellow-600  text-yellow-600'>
    <img src={validation_symb_icon} className='w-5 h-5'/>
  <h2 className=''>{currencyTableData?.message}</h2>
  </div>
 } 
</div> */}




<div className="w-full flex items-center justify-center border-[1px] border-gray-50 ">
<Upload  
  selectedFile={selectedFile}
  setSelectedFile={setSelectedFile}
  fileSelected={fileSelected}
  setFileSelected={setFileSelected}
  />
</div>
</div>


<div className="w-full mt-5 px-4">
 <Button text="Update" 
 loading={isUploading}
 active={active?.saveLineItem}
 onClick={handleSaveLineItemDetails} />
</div>     
{/* -------------------- */}  
  </div>
   
   </div>
   </div>
    
    </>
  )
}

function DocumentPreview({selectedFile , initialFile}){


  return(
    <div className=' border-[5px] min-w-[100%] h-fit flex justify-center items-center'>
    {selectedFile ? 
    (
        <div className="w-full  flex flex-col justify-center">
          {/* <p>Selected File: {selectedFile.name}</p> */}
          {/* <p>Size: {selectedFile.size} bytes</p>
          <p>Last Modified: {selectedFile.lastModifiedDate.toString()}</p> */}
          {selectedFile.type.startsWith('image/') ? (
            
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className=' h-[700px] w-full'
              
            />
            
          ) : selectedFile.type === 'application/pdf' ? (
            <embed
              src={URL.createObjectURL(selectedFile)}
              type="application/pdf"
              width="100%"
              height="700px"
            />
          ) : (
            <p>Preview not available for this file type.</p>
          )}
        </div>
      ) : 
      !initialFile ?
      <div className='w-full h-[700px] flex justify-center items-center bg-white-100 opacity-30'>
        <img src={!initialFile && file_icon|| initialFile} className='w-40 h-40'/>
      </div> :
      <div className='w-full h-[700px] flex justify-center items-center '>
       {initialFile.toLowerCase().endsWith('.pdf') ? (
        // Display a default PDF icon or text for PDF files
        <div className='w-full'>
          <embed
            src={initialFile}
            type="application/pdf"
            width="100%"
            height="700px"
          />
        </div>
      ) : (
        // Display the image preview for other file types
        <img src={initialFile ? initialFile : file_icon} alt="Initial Document Preview" className='w-40 h-40' />
      )}
      </div>
      }
    </div>

  )
}
