/* eslint-disable react/jsx-key */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
//prepleaf

import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  useParams,
  useNavigate,
} from "react-router-dom";
import Icon from "../components/common/Icon";
import {
  allocationLevel,
  extractValidExpenseLines,
  formatAmount,
  getStatusClass,
  removeSuffix,
  titleCase,
  urlRedirection,
} from "../utils/handyFunctions";
import Button from "../components/common/Button";
import Error from "../components/common/Error";
import PopupMessage from "../components/common/PopupMessage";
import {
  cab_purple as cab_icon,
  airplane_1 as airplane_icon,
  cancel_icon,
  modify_icon,
  check_tick,
  file_icon,
  validation_sym,
  validation_symb_icon,
  upcoming_trip,
  briefcase,
  money,
  user_icon,
  arrow_left,
  info_icon,
} from "../assets/icon";
import Select from "../components/common/Select";
import ActionButton from "../components/common/ActionButton";
import Input from "../components/common/Input";
import Upload from "../components/common/Upload";
import {
  cancelTravelExpenseHeaderApi,
  cancelTravelExpenseLineItemApi,
  getTravelExpenseApi,
  ocrScanApi,
  currencyConversionApi,
  postTravelExpenseLineItemApi,
  submitOrSaveAsDraftApi,
  updateTravelExpenseLineItemApi,
} from "../utils/api.js";
import { classDropdown } from "../utils/data.js";
import Toggle from "../components/common/Toggle.jsx";
import { BlobServiceClient } from "@azure/storage-blob";
import Button1 from "../components/common/Button1.jsx";
import CancelButton from "../components/common/CancelButton.jsx";
import { LineItemView } from "../travelExpenseSubcomponent/LineItemView.jsx";
import { DocumentPreview } from "../travelExpenseSubcomponent/BillPreview.jsx";
import Modal from "../components/common/Modal.jsx";
import LineItemForm from "../travelExpenseSubcomponent/LineItemForm.jsx";
import { RemoveFile, TitleModal } from "../components/common/TinyComponent.jsx";
import uploadFileToAzure from "../utils/azureBlob.js";
import { dateKeys, isClassField, totalAmountKeys } from "../utils/data/keyList.js";








export default function () {
  const { cancel, tenantId, empId, tripId } = useParams(); ///these has to send to backend get api
  const navigate = useNavigate();

  const az_blob_container = import.meta.env.VITE_AZURE_BLOB_CONTAINER
  const storage_sas_token = import.meta.env.VITE_AZURE_BLOB_SAS_TOKEN
  const storage_account = import.meta.env.VITE_AZURE_BLOB_ACCOUNT
  const blob_endpoint = `https://${storage_account}.blob.core.windows.net/?${storage_sas_token}`

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

  const [ocrSelectedFile, setOcrSelectedFile] = useState(null);

  const [errorMsg, setErrorMsg] = useState({
    currencyFlag: { set: false, msg: "" },
    totalAmount: { set: false, msg: "" },
    personalAmount: { set: false, msg: "" },
    data: { set: false, msg: "" },
    expenseSettlement: { set: false, msg: "" },
    allocations: { set: false, msg: "" },
  });

  const [formVisible, setFormVisible] = useState(false); // for line item form visible

  // Get the last object

  const [onboardingData, setOnboadingData] = useState(null);
  //const [travelAllocationFlag, setTravelAllocationFlag] = useState(null);
  const [travelExpenseAllocation, setTravelExpenseAllocation] = useState(null);
  const [approversList, setApproversList] = useState([]); //form get approverlist
  const [categoryfields, setCategoryFields] = useState(null); ///this is for get field after select the category
  //const [expenseHeaderId, setExpenseHeaderId] = useState(null); //for expense header id
  //const [travelType, setTravelType] = useState(null); //for travel type from expenseData
  const [selectedAllocations, setSelectedAllocations] = useState([]); //for saving allocations on line saving line item
  const [settlementOptions, setSettlementOptions] = useState([]);
  const [currencyTableData, setCurrencyTableData] = useState(null); //for get data after conversion
  //const [defaultCurrency, setDefaultCurrency] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0); ///for handling convert
  const [date, setDate] = useState(null);
  //const [flagExpenseHeaderStatus, setFlagExpenseHeaderStatus] = useState(null);
  const [selectedLineItemId, setSelectedLineItemId] = useState(null);

  // const [showPopup, setShowPopup] = useState(false);
  // const [message, setMessage] = useState(null);
  // const [ocrField , setOcrField]=useState(null)
  const [travelRequestStatus, setTravelRequestStatus] =
    useState("pending approval");
  const [isUploading, setIsUploading] = useState({
    scan: false,
    edit: false,
    saveLineItem: false,
    convert: false,
    delete: { visible: false, id: null },
    deleteHeader: false,
    saveAsDraft: false,
    submit: false,
    deleteLineItem: false,
    updateLineItem: false
  });

  const [active, setActive] = useState({});

  const [isLoading, setIsLoading] = useState(true);

  const [loadingErrMsg, setLoadingErrMsg] = useState(null);
  const [lineItemDetails, setLineItemDetails] = useState(); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [currencyConversion, setCurrencyConversion]=useState({
    payload:{
       'currencyName':"",
        personalAmount:"",
        totalAmount:"",
        nonPersonalAmount: ""
    },
    response:{}
  }) 
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [initialFile, setInitialFile] = useState("");

  const [personalFlag, setPersonalFlag] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  //const [selectedExpenseSettlement, setSelectedExpenseSettlement] = useState(null);

  const [selectedTravelType, setSelectedTravelType] = useState(null); /// for level 2
  const [formData, setFormData] = useState({
    fields:{}
  }); //this is for get expense data
  const [requiredObj, setRequiredObj] = useState({});
  //const [getSavedAllocations, setGetSavedAllocations] = useState(); ///after save the allocation then i will get next time from here
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);

  const [headerReport, setHeaderReport] = useState(null);
  

  //for level 2
  const handleTravelType = (type) => {
    setSelectedTravelType(type);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getTravelExpenseApi(tenantId, empId, tripId);

        setOnboadingData(response);
        console.log("trip data fetched successfully", response);
        const levelArray = response?.companyDetails?.travelAllocationFlags;
        const onboardingLevel = Object.keys(levelArray).find(
          (level) => levelArray[level] === true
        );
        setRequiredObj((prev) => ({
          ...prev,
          level: onboardingLevel,
          travelAllocations: response?.travelAllocationHeaders || [],
        }));

        setIsLoading(false);
      } catch (error) {
        setLoadingErrMsg(error.message);
        window.parent.postMessage({message:"expense message posted", 
        popupMsgData: { showPopup:true, message:error?.message, iconCode: "102" }}, dashboardBaseUrl);
        // setMessage(error.message);
        // setShowPopup(true);
        // setTimeout(() => {
        //   setShowPopup(false);
        // }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    // Call the fetchData function whenever tenantId, empId, or tripId changes
    fetchData();
  }, [tenantId, empId, tripId]);

  const [activeIndex, setActiveIndex] = useState();

  const handleItemClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const dashboardBaseUrl = `${import.meta.env.VITE_DASHBOARD_URL}`;

  useEffect(() => {
    if (onboardingData) {
      const travelAllocationFlag = allocationLevel(onboardingData?.companyDetails?.travelAllocationFlags)

      const settlementOptionArray =
        onboardingData?.companyDetails?.expenseSettlementOptions;
      const settlementOptions = Object.keys(settlementOptionArray).filter(
        (option) => settlementOptionArray[option]
      );

      setSettlementOptions(settlementOptions);
      const flagToOpen = onboardingData?.flagToOpen;
      const openedExpenseObj = (onboardingData?.travelExpenseData)?.find(expense => expense.expenseHeaderId === flagToOpen)
      const travelType = openedExpenseObj?.travelType;
      setSelectedTravelType(travelType)
      if(['level1','level2'].includes(travelAllocationFlag)){
        const allocationsList = onboardingData?.companyDetails?.travelAllocations?.expenseAllocation|| []
        const travelExpenseCategories = onboardingData?.companyDetails?.travelExpenseCategories || [];
        setRequiredObj(prev=>({
          ...prev,
          allocationsList,
          travelExpenseCategories,
          "level":travelAllocationFlag,
          travelType
        }))

        //level1 or level 2 allocation will save with empty string
        const allocations = allocationsList.map((allocation) => ({
          headerName: allocation.headerName,
          headerValue: "",
        }));
        setSelectedAllocations(allocations)
    
      }

      if(travelAllocationFlag==='level3'){
       
        console.log('travelType',travelAllocationFlag,travelType,flagToOpen, openedExpenseObj);
        const travelExpenseCategories = onboardingData?.companyDetails?.travelAllocations[travelType];
        setRequiredObj(prev=>({
          ...prev,
          travelExpenseCategories,
          level:travelAllocationFlag,
          travelType
        
        }));
      }
      
      
     
      
      setRequiredObj((prev) => ({
        ...prev,
        approverList: openedExpenseObj?.approvers,
        defaultCurrency:onboardingData?.companyDetails?.defaultCurrency,
        selectedSettlementOption:openedExpenseObj?.expenseSettlement ?? "",
        expenseHeaderStatus:openedExpenseObj?.expenseHeaderStatus,
        "expenseHeaderId":openedExpenseObj?.expenseHeaderId ?? flagToOpen,
        "travelType": openedExpenseObj?.travelType ?? "",
        "allocations": onboardingData?.travelAllocationHeaders || [],
        "travelExpenseData": onboardingData?.travelExpenseData || [],
        "expenseAmountStatus": onboardingData?.expenseAmountStatus
      }));      
      //console.log("saved allocations", getSavedAllocations);
      ///where is newExpenseReport = true
      // const headerReportData = expenseData.find((expense) => expense.newExpenseReport);

      setHeaderReport(openedExpenseObj);
      setFormData(prev => ({...prev, ...onboardingData }));
      // setExpenseAmountStatus(
      //   onboardingData && onboardingData?.expenseAmountStatus
      // );

      // setGetSavedAllocations({ ...hrData });
      const initialIndex = onboardingData && onboardingData?.travelExpenseData;
      const lastIndex = initialIndex?.length > 0 && initialIndex.length - 1;
      setActiveIndex(lastIndex);
      console.log("lastdigit", lastIndex);
      setTravelRequestStatus(onboardingData);
      setIsLoading(false);
    }
  }, [onboardingData]);

  //console.log("get expense data", getExpenseData);

  console.log("onboardingData", onboardingData);

  console.log("expenseAmountStatus", requiredObj?.expenseAmountStatus);
  console.log("selected Allocations", selectedAllocations);
  console.log("requiredObj", requiredObj);
  console.log("formData", formData);
  console.log("is file selected", isFileSelected)

  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryFieldBySelect, setCategoryFieldBySelect] = useState([]);




  console.log("category list", categoriesList);
  console.log("travelType", selectedTravelType);
  console.log("initial allocation", selectedAllocations);
  console.log("expense allocation", travelExpenseAllocation);
  console.log("travel allocations", requiredObj?.travelAllocations);
  console.log("expenseLine", headerReport?.expenseLines);
  console.log("total amount11", totalAmount);


  //selected category corresponding class & class of service value
  const [classDropdownValues, setClassDropdownValues] = useState(null);

  useEffect(() => {
    const category = classDropdown.find(
      (category) => category.categoryName === selectedCategory
    );
    if (category) {
      // Access the classes array and console.log it
      console.log(category.classes);
      setClassDropdownValues(category.classes);
    } else {
      console.log(`Category "${selectedCategory}" not found.`);
    }
  }, [selectedCategory]);
  //get travel request Id from params

  useEffect(() => {
    if (!personalFlag) {
      setLineItemDetails({
        ...lineItemDetails,
        personalExpenseAmount: 0,
        isPersonalExpense: false,
      });
    }
  }, [personalFlag]);

  // //level-1 store selected allocation in array
  console.log("selected allocations11", selectedAllocations);
  const onAllocationSelection = (option, headerName) => {
    const updatedExpenseAllocation = selectedAllocations.map((item) => {
      if (item.headerName === headerName) {
        return {
          ...item,
          headerValue: option,
        };
      }
      return item;
    });
    const newErrorMsg = { ...errorMsg };
    newErrorMsg[headerName] = { set: false, msg: "" };
    setErrorMsg(newErrorMsg);

    console.log("object111", updatedExpenseAllocation);
    setSelectedAllocations(updatedExpenseAllocation);
  };



  const onReasonSelection = (option) => {
    setRequiredObj(prev => ({...prev, selectedExpenseSettlement: option}))
    console.log(option);
  };

  const [selectDropdown, setSelectDropdown] = useState(null);

  const handleCurrencyConversion = async ( {currencyName,totalAmount,personalAmount}) => { 
    console.log('conversion _data',currencyName,totalAmount,personalAmount)
   
    const payload = {
     totalAmount, 
     personalAmount: personalAmount.toString(),
     currencyName,
     nonPersonalAmount:`${totalAmount-personalAmount||0}`
    }
    
    let allowForm = true;
    
    if ((!totalAmount || totalAmount === 0)){
      setCurrencyConversion(prev=>({...prev,response:null}))
      setErrorMsg((prevErrors) => ({ ...prevErrors, conversion: { set: true, msg: "Enter the amount" } }));
      allowForm = false;
    } else {
      setErrorMsg((prevErrors) => ({ ...prevErrors, conversion: { set: false, msg: "" } }));
    }
    
    if (formData.fields.isPersonalExpense && personalAmount ==="") {
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
           
            const response = await currencyConversionApi(tenantId,payload);
            if(response.currencyConverterData.currencyFlag){
              setCurrencyConversion(prev=>({...prev,response:response.currencyConverterData}))
              if(response.success){
                setFormData(prev => ({...prev,fields:{...prev.fields, convertedAmountDetails: response?.currencyConverterData}}))
              }
            }else{
              setErrorMsg((prev) => ({ ...prev, conversion: { set: true, msg: "Exchange rates not available. Kindly contact your administrator." } }));
              setCurrencyConversion(prev=>({...prev,response:{}}))
              setFormData(prev => ({...prev,fields:{...prev.fields, convertedAmountDetails: null}}))
            }
            setIsUploading(prev=>({...prev,conversion:{set:false,msg:''}}))
          } catch (error) {
            console.log('Error in fetching expense data for approval:', error.message);
            
            setIsUploading(prev=>({...prev,conversion:{set:false,msg:''}}))
            // setShowPopup(true)
            // setMessage(error.message);
            window.parent.postMessage({message:"expense message posted", 
            popupMsgData: { showPopup:true, message:error?.message, iconCode: "102" }}, dashboardBaseUrl);
            setCurrencyConversion(prev=>({...prev,response:{}}))
            setErrorMsg((prev) => ({ ...prev, conversion: { set: true, msg: "Exchange rates not available. Kindly contact your administrator." } }))
            //setTimeout(() => {setMessage(null);setShowPopup(false);},5000);
          }
    }
  };
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
    };
  
    const validateFields = (keys, errorKey, errorMsg) => {
      for (const key of keys) {
        if (formData.fields[key] === "") {
          newErrorMsg[errorKey] = { set: true, msg: `${errorMsg} cannot be empty` };
          allowForm = false;
        }
      }
    };

    // Validate fields
    validateFields(totalAmountKeys, 'conversion', 'Amount');
    validateFields(dateKeys, 'date', 'Date');
    validateFields(isClassField, 'class', 'Class');
  
    if (formData.fields.isPersonalExpense) {

      const personalAmount = parseFloat(formData.fields.personalExpenseAmount);
      const totalAmount = parseFloat(currencyConversion.payload.totalAmount);

      if (isNaN(personalAmount) || personalAmount === "") {
        newErrorMsg.personalAmount = { set: true, msg: "Personal Expense Amount cannot be empty" };
        allowForm = false;
      } else if (personalAmount > totalAmount) {
        newErrorMsg.personalAmount = { set: true, msg: "Personal Expense Amount cannot exceed Total Amount" };
        allowForm = false;
      }
    }
  
    if (formData.fields.isMultiCurrency && !formData.fields.convertedAmountDetails) {
      newErrorMsg.conversion = { set: true, msg: `Exchange rates not available. Kindly contact your administrator.` };
      allowForm = false;
    }
  
    for (const allocation of selectedAllocations) {
      if (allocation.headerValue.trim() === '') {
        newErrorMsg[allocation.headerName] = { set: true, msg: "Select the Allocation" };
        allowForm = false;
      }
    }
  
    setErrorMsg(newErrorMsg);
    let previewUrl = ""
    if (allowForm && selectedFile) {
      setIsUploading(prev => ({ ...prev, [action]: { set: true, msg: "" } }));
      try {
        const azureUploadResponse = await uploadFileToAzure(selectedFile);
        if (azureUploadResponse.success) {
           previewUrl = `https://${storage_account}.blob.core.windows.net/${az_blob_container}/${selectedFile.name}`;
          console.log('bill url',previewUrl)
          // setFormData(prev => ({
          //   ...prev,
          //   fields: { ...prev.fields, billImageUrl }
          // }));
        } else {
          console.error("Failed to upload file to Azure Blob Storage.");
        // setMessage("Failed to upload file to Azure Blob Storage.");
        // setShowPopup(true);
        window.parent.postMessage({message:"expense message posted", 
        popupMsgData: { showPopup:true, message:"Failed to upload file to Azure Blob Storage.", iconCode: "101" }}, dashboardBaseUrl);
        //setTimeout(() => setShowPopup(false), 3000);
        allowForm = false;
        }
      } catch (error) {
        console.error("Error uploading file to Azure Blob Storage:", error);
        // setMessage(error.message);
        // setShowPopup(true);
         window.parent.postMessage({message:"expense message posted", 
          popupMsgData: { showPopup:true, message:error?.message, iconCode: "102" }}, dashboardBaseUrl);
        //setTimeout(() => setShowPopup(false), 3000);
        allowForm = false;
      }
    }

    if (allowForm) {
      setIsUploading(prev => ({ ...prev, [action]: { set: true, msg: "" } }));
      const params = { tenantId, empId, tripId, expenseHeaderId: requiredObj.expenseHeaderId };
      const payload = {
       travelType: requiredObj?.travelType,
       expenseAmountStatus: requiredObj?.expenseAmountStatus,
       expenseLine: {
        ...formData.fields,
        "billImageUrl":isFileSelected ? previewUrl : formData?.fields?.billImageUrl,
        ...(requiredObj.level === 'level3' ? { allocations: selectedAllocations } : {})
      },
       expenseLineEdited: formData?.editedFields,
       allocations: requiredObj.level === 'level3' ? [] : selectedAllocations,
      };
  
      try {
        const response = await updateTravelExpenseLineItemApi({params, payload});
        // const response = await postTravelExpenseLineItemApi(params, payload);
        setIsUploading(prev => ({ ...prev, [action]: { set: false, msg: "" } }));
        // setShowPopup(true);
        // setMessage(response?.message);
        window.parent.postMessage({message:"expense message posted", 
        popupMsgData: { showPopup:true, message:response?.message, iconCode: "101" }}, dashboardBaseUrl);
        setTimeout(() => {
          // setShowPopup(false);
          // setMessage(null);
         setRequiredObj(prev=>({...prev, travelExpenseData : response?.travelExpenseData}))
         setFormData(prev => ({...prev, fields:{}}))
        }, 5000);
      } catch (error) {
        setIsUploading(prev => ({ ...prev, [action]: { set: false, msg: "" } }));
        // setMessage(error.message);
        // setShowPopup(true);
        //setTimeout(() => setShowPopup(false), 3000);
      }
    }
  };
const handleRemoveFile=()=>{
  setFormData(prev => ({
    ...prev,
    fields: {
      ...prev.fields,
      billImageUrl: ""
    }
  }))
  setSelectedFile(null);
  setIsFileSelected(false);
  setInitialFile("");
}
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

  console.log(lineItemDetails?.personalExpenseAmount);
  //console.log("default cuurency use state", defaultCurrency);

  //Handle Currency Select
  // const handleCurrenctySelect = (shortName) => {
  //   const selectedCurrencyObject = currencyDropdown.find(
  //     (currency) => currency.shortName === shortName
  //   );
  //   setSelectDropdown(selectedCurrencyObject);
  //   // setLineItemDetails({...lineItemDetails,['Currency']:selectedCurrencyObject}),setSelectDropdown(selectedCurrencyObject)
  //   if (shortName !== requiredObj?.defaultCurrency?.shortName) {
  //     setIsMultiCurrency(true);
  //   } else {
  //     setIsMultiCurrency(false);
  //   }
  //   if (shortName === requiredObj?.defaultCurrency?.shortName) {
  //     setCurrencyTableData(null);
  //   }
  // };
  console.log("selected Currency", selectDropdown);

  // Handle Input Change
  const handleInputChange = (name, value) => {
    console.log(`Updating ${name} with value:`, value);
    setLineItemDetails((prevState) => ({ ...prevState, [name]: value || "" }));

    if (totalAmountKeys.includes(name)) {
      setTotalAmount(value);
    }
    if (dateKeys.includes(name)) {
      setDate({ [name]: value });
    }
  };

  // Handle Convert

  const handleConverter = async (totalAmount, personalExpenseAmount) => {
    let allowForm = true;
    if (totalAmount === 0 || totalAmount === undefined || totalAmount === "") {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        totalAmount: { set: true, msg: "Enter total amount" },
      }));
      allowForm = false;
      console.log("total amount  is empty", totalAmount);
    } else {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        totalAmount: { set: false, msg: "" },
      }));
    }

    if (
      personalFlag &&
      (personalExpenseAmount === "" || personalExpenseAmount === undefined)
    ) {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        personalAmount: { set: true, msg: "Enter personal amount" },
      }));
      allowForm = false;
    } else {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        personalAmount: { set: false, msg: "" },
      }));
    }

    const nonPersonalAmount = (totalAmount || 0) - personalExpenseAmount;

    const validPersonalAmount = (totalAmount || 0) - personalExpenseAmount;
    if (validPersonalAmount <= 0) {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        personalAmount: {
          set: true,
          msg: "Personal Expense amount should be less than Total Expenditure",
        },
      }));
      allowForm = false;
    }
    const convertDetails = {
      currencyName: selectDropdown?.shortName,
      personalAmount: personalExpenseAmount || "",
      nonPersonalAmount: nonPersonalAmount || "",
      totalAmount: totalAmount,
    };

    console.log("convert details", convertDetails);
    console.log(
      `total amount is ${totalAmount} and personal amount is ${personalExpenseAmount} ${selectDropdown?.shortName}`
    );

    if (allowForm) {
      const convertDetails = {
        currencyName: selectDropdown?.shortName,
        personalAmount: personalExpenseAmount || "",
        nonPersonalAmount: nonPersonalAmount || "",
        totalAmount: totalAmount,
      };
      console.log("sent converted details", convertDetails);

      ///api
      try {
        setActive((prevState) => ({ ...prevState, convert: true }));
        const response = await currencyConversionApi(tenantId, convertDetails);

        setCurrencyTableData(response?.currencyConverterData || {});
        setActive((prevState) => ({ ...prevState, convert: false }));
        console.log(
          "converted amount fetched",
          response?.currencyConverterData
        );

        if (
          selectDropdown?.shortName !== requiredObj?.defaultCurrency?.shortName &&
          !response?.currencyConverterData?.currencyFlag
        ) {
          setErrorMsg((prevErrors) => ({
            ...prevErrors,
            currencyFlag: {
              set: true,
              msg: "Conversion not available, Please contact admin",
            },
          }));
          console.log("converted flag no");
        } else {
          setErrorMsg((prevErrors) => ({
            ...prevErrors,
            currencyFlag: { set: false, msg: "" },
          }));
        }
      } catch (error) {
        console.log(
          "Error in fetching expense data for approval:",
          error.message
        );
        // setShowPopup(true);
        // setMessage(error.message);
        window.parent.postMessage({message:"expense message posted", 
        popupMsgData: { showPopup:true, message:error.message, iconCode: "101" }}, dashboardBaseUrl);
        
        setTimeout(() => {
          // setMessage(null);
          // setShowPopup(false);
          setActive((prevState) => ({ ...prevState, convert: false }));
        }, 5000);
      }
    }
  };
  // console.log('headerdata',headerReport)
  // console.log("formdata",formData)

  useEffect(() => {
    if (showCancelModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showCancelModal]);

  //Handle Delete header

  const handleCancelExpenseHeader = async () => {
    const expenseAmountStatus = formData?.expenseAmountStatus;
    const travelExpenseReport = requiredObj?.travelExpenseData?.find(
      (expense) => expense.expenseHeaderId === requiredObj?.expenseHeaderId
    );
    const data = {
      expenseAmountStatus,
      travelExpenseReport,
    };
    console.log("cancel header");
    try {
      setIsUploading((prevState) => ({ ...prevState, deleteHeader: true }));
      const response = await cancelTravelExpenseHeaderApi({ tenantId, empId, tripId, expenseHeaderId:requiredObj?.expenseHeaderId, data});
      // setShowPopup(true);
      // setMessage(response.message);
      setModalOpen(false);
      window.parent.postMessage({message:"expense message posted", 
        popupMsgData: { showPopup:true, message:response?.message, iconCode: "101" }}, dashboardBaseUrl);
      setIsUploading((prevState) => ({ ...prevState, deleteHeader: false }));
      setTimeout(() => {
        // setShowPopup(false);
        // setMessage(null);
        handleDashboardRedirection();
      }, 5000);
    } catch (error) {
      setIsUploading((prevState) => ({ ...prevState, deleteHeader: false }));
      // setShowPopup(true);
      // setMessage(error.message);
      window.parent.postMessage({message:"expense message posted", 
      popupMsgData: { showPopup:true, message:error?.message, iconCode: "101" }}, dashboardBaseUrl);
      // setTimeout(() => {
      //   setShowPopup(false);
      //   setMessage(null);
      // }, 5000);
      console.error("Error confirming trip:", error.message);
    }
  };

  // console.log("getExpenseData",getExpenseData)
  ///----------------------------------------

  // Handle Submit Draft
  const handleSubmitOrDraft = async (action) => {
    let allowForm = true;
    const data = {
      expenseSettlement: requiredObj?.selectedExpenseSettlement || "",
      approvers: requiredObj?.travelExpenseData?.[0]?.approvers || [],
    };
    if (!requiredObj?.selectedExpenseSettlement) {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        expenseSettlement: { set: true, msg: "Select the settlement mode" },
      }));
      allowForm = false;
    } else {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        expenseSettlement: { set: false, msg: "" },
      }));
      allowForm = true;
    }

    console.log("submit", data);
    if (allowForm) {
      try {
        if (action === "draft") {
          setIsUploading((prevState) => ({ ...prevState, saveAsDraft: true }));
        } else if (action === "submit") {
          setIsUploading((prevState) => ({ ...prevState, submit: true }));
        }

        const response = await submitOrSaveAsDraftApi(
         { action,
          tenantId,
          empId,
          tripId,
          expenseHeaderId : requiredObj?.expenseHeaderId,
          data}
        );
        setIsLoading(false);
        // setShowPopup(true);
        // setMessage(response.message);
        window.parent.postMessage({message:"expense message posted", 
        popupMsgData: { showPopup:true, message:response?.message, iconCode: "101" }}, dashboardBaseUrl);

        setIsUploading(false);
        if (action === "draft") {
          setActive((prevState) => ({ ...prevState, saveAsDraft: false }));
        } else if (action === "submit") {
          setActive((prevState) => ({ ...prevState, submit: false }));
        }
        setTimeout(() => {
          // setShowPopup(false);
          // setMessage(null);

          if (action === "submit") {
            // urlRedirection(`${dashboard_url}/${tenantId}/${empId}/overview`)}
            handleDashboardRedirection();
          } else {
            window.location.reload();
          }
        }, 5000);
      } catch (error) {
        setIsUploading(false);
        if (action === "draft") {
          setActive((prevState) => ({ ...prevState, saveAsDraft: false }));
        } else if (action === "submit") {
          setActive((prevState) => ({ ...prevState, submit: false }));
        }
        // setShowPopup(true);
        // setMessage(error.message);
        window.parent.postMessage({message:"expense message posted", 
        popupMsgData: { showPopup:true, message:error?.message, iconCode: "101" }}, dashboardBaseUrl);
        // setTimeout(() => {
        //   setShowPopup(false);
        //   setMessage(null);
        // }, 3000);
        console.error("Error confirming trip:", error.message);
      }
    }
  };

  // Handle Save Line Item
  console.log("date value", selectedAllocations);
  // const handleSaveLineItemDetails = async () => {
  console.log("error message for allocation", errorMsg?.allocations);

  // Handle Edit
  const [editFields, setEditFields] = useState({});

  const handleEdit = (lineItem) => {



    if(['level3'].includes(requiredObj?.level)){
      const selectedCategoryData =  requiredObj?.travelExpenseCategories?.find(item => item?.categoryName === lineItem?.["Category Name"])
      setRequiredObj(prev=> ({...prev, selectedCategoryData}));

    }

    setFormData((prev) => ({
      ...prev, 
      editedFields: lineItem, //prev line item
      fields: lineItem})); //line item

      setSelectedAllocations(lineItem?.allocations);
      setCurrencyConversion(prev => ({...prev, response:lineItem?.convertedAmountDetails}));
      setInitialFile(lineItem?.billImageUrl)


    // if (requiredObj?.level === "level2") {
     

    //   const data =
    //     categoryfields &&
    //     categoryfields.find((item) => item[headerReport?.travelType]);

    //   if (data && data[headerReport?.travelType]) {
    //     const categoryData = data[headerReport?.travelType].find(
    //       (item) => item.categoryName === categoryName
    //     );
    //     if (categoryData) {
    //       console.log("level 2 categoryfields", categoryData.fields);
    //       // setCategoryFields(categoryData)
    //       setEditFields(categoryData);
    //       //setEditLineItemById(lineItemId);
    //       //setSelectedCategory(categoryName);
    //     }
    //   }
    // }
    // //this is for level3
    // if (requiredObj?.level === "level3") {
     
    //   const data = categoryfields?.find((item) => item[headerReport?.travelType]);

    //   if (data && data[headerReport?.travelType]) {
    //     const categoryData = data[headerReport?.travelType].find(
    //       (item) => item.categoryName === categoryName
    //     );
    //     if (categoryData) {
    //       console.log("level 2 categoryfields", categoryData.fields);
    //       // setCategoryFields(categoryData)
    //       setEditFields(categoryData);
    //       setEditLineItemById(lineItemId);
    //       setSelectedCategory(categoryName);
    //     }
    //   }
    // }
    // if (requiredObj?.level === "level1") {
    //   const searchedFields =
    //     categoryfields &&
    //     categoryfields.find(
    //       (category) => category.categoryName === categoryName
    //     );
    //   console.log("seacth", searchedFields);
    //   setEditFields(searchedFields);
    //   setEditLineItemById(lineItemId);
    //   setSelectedCategory(categoryName);
    //   console.log("handleEdit", lineItemId, categoryName, categoryfields);
    // }
  };

  //Handle Delete
  const handleDeleteLineItem = async () => {
    const data = {
      expenseAmountStatus: onboardingData?.expenseAmountStatus,
      expenseLine: selectedLineItemId,
    }; // stored whole lineItem
    try {
      setIsUploading((prev) => ({ ...prev, deleteLineItem: true }));

      const response = await cancelTravelExpenseLineItemApi(
        tenantId,
        empId,
        tripId,
        requiredObj?.expenseHeaderId,
        data
      );
      const updatedExpenseData = requiredObj?.travelExpenseData?.map((expense) => {
        if (expense.expenseHeaderId === requiredObj?.expenseHeaderId) {
          const updatedExpenseLines = expense.expenseLines.filter(
            (line) => line.expenseLineId !== selectedLineItemId?.expenseLineId
          );
          return { ...expense, expenseLines: updatedExpenseLines };
        }
        return expense;
      });
      //setGetExpenseData(updatedExpenseData);
      setRequiredObj( prev => ({...prev, "travelExpenseData":updatedExpenseData}))
      setModalOpen(false);
      // setShowPopup(true);
      // setMessage(response?.message);
      window.parent.postMessage({message:"expense message posted", 
      popupMsgData: { showPopup:true, message:response?.message, iconCode: "101" }}, dashboardBaseUrl);
      setIsUploading((prev) => ({ ...prev, deleteLineItem: false }));
      // setTimeout(() => {
      //   setShowPopup(false);
      //   setMessage(null);
      // }, 5000);
    } catch (error) {
      setIsUploading((prev) => ({ ...prev, deleteLineItem: false }));
      window.parent.postMessage({message:"expense message posted", 
      popupMsgData: { showPopup:true, message:error?.message, iconCode: "101" }}, dashboardBaseUrl);
      // setTimeout(() => {
      //   setShowPopup(false);
      // }, 3000);
    }
  };
  console.log("expense lines before deleting", headerReport);
  // console.log('deletions',active.delete.visible,active.delete.id);

  console.log("all categoryfields", categoryfields);

  ///////////////////---------- Update Line Item

  /////////-------------------google search start---------------------

  // const autocompleteRefs = {};
  // const handlePlaceSelect = (name, place) => {
  //   const formattedAddress = place.formatted_address;

  //   setLineItemDetails((prevValues) => ({
  //     ...prevValues,
  //     [name]: formattedAddress,
  //   }));
  // };

  // const initAutocomplete = (name) => {
  //   const autocomplete = new window.google.maps.places.Autocomplete(
  //     autocompleteRefs[name].current
  //   );

  //   autocomplete.addListener("place_changed", () => {
  //     const place = autocomplete.getPlace();
  //     handlePlaceSelect(name, place);
  //   });
  // };


  // const loadGoogleMapsScript = async () => {
  //   console.log("Checking Google API load...");

  //   if (!window.google) {
  //     console.log("Google API not found, loading...");

  //     const loadScript = () => {
  //       return new Promise((resolve, reject) => {
  //         const script = document.createElement("script");
  //         script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places`;
  //         script.defer = true;
  //         script.async = true;
  //         script.onload = resolve;
  //         script.onerror = reject;
  //         document.head.appendChild(script);
  //       });
  //     };

  //     try {
  //       await loadScript();
  //       console.log("Google API loaded successfully");

  //       // Initialize Autocomplete for specified fields
  //       categoryFieldBySelect.forEach((field) => {
  //         if (field.name === "PickUp" || field.name === "DropOff") {
  //           initAutocomplete(field.name);
  //         }
  //       });
  //     } catch (error) {
  //       console.error("Error loading Google Maps script:", error);
  //     }
  //   } else {
  //     console.log("Google API already loaded");
  //   }
  // };

  // useEffect(() => {
  //   loadGoogleMapsScript();
  // }, [selectedCategory, openLineItemForm]);

  //BLOB Storage

 // console.log("blob storage", az_blob_container, blob_endpoint);

  ////---------------------------google search end--------------------------

  console.log("categoryfields by selected", categoryFieldBySelect);

  const handleDashboardRedirection = () => {
    console.log(dashboardBaseUrl);
    window.parent.postMessage("closeIframe", dashboardBaseUrl);
  };

  
  const getTitle = () => {
    switch (actionType) {
      case "closeAddExpense":
        return "Leave this Page";
      case "cancelExpense":
        return "Delete Expense";
      case "deleteLineItem":
        return "Delete Line-Item";
      default:
        return "";
    }
  };

  const getContent = () => {
    switch (actionType) {
      case "closeAddExpense":
        return (
          <>
            <p className="text-md px-4 text-start font-cabin text-neutral-600">
              If you leave this page, unsaved changes will be lost. Are you sure
              you want to leave this page?
            </p>

            <div className="flex items-center gap-2 mt-10">
              <Button1
                text="Stay on this Page"
                onClick={() => setModalOpen(false)}
              />
              <CancelButton
                text="Leave this Page"
                onClick={() => handleDashboardRedirection()}
              />
            </div>
          </>
        );
      case "cancelExpense":
      case "deleteLineItem":
        return (
          <>
            <p className="text-md px-4 text-start font-cabin text-neutral-600">
              If you delete this{" "}
              {actionType === "cancelExpense" ? "expense" : "line-item"}, you
              cannot retrieve it. Are you sure you want to delete?
            </p>
            <div className="flex items-center gap-2 mt-10">
              <Button1
                loading={isUploading.deleteHeader || isUploading.deleteLineItem}
                text="Delete"
                onClick={() => {
                  actionType === "cancelExpense"
                    ? handleCancelExpenseHeader()
                    : handleDeleteLineItem();
                }}
              />
              <CancelButton text="Cancel" onClick={() => setModalOpen(false)} />
            </div>
          </>
        );

      default:
        return "";
    }
  };

  return (
    <>
      {/* <Error message={loadingErrMsg}/> */}
      {isLoading ? (
        <Error message={loadingErrMsg} />
      ) : (
        <>
          {" "}
          <div className="w-full h-full  relative bg-white   select-none p-4">
            {/* Rest of the section */}
            <div className="w-full h-full  font-cabin tracking-tight">
              {/* {travelAllocationFlag === 'level1' &&  <div className="font-cabin font-medium">Expense Type: {travelType}</div>} */}

              {/* ///-level2 - */}
              
              <div className="flex md:flex-row flex-col gap-4  justify-between md:items-center items-center mb-10">
                <fieldset className="flex flex-col sm:flex-row gap-4">
                  <div>
                    <div
                      className={`flex gap-4 border border-indigo-400 max-w-[300px] accent-indigo-600 px-6 py-2 rounded   ${
                        requiredObj?.travelType && requiredObj?.travelType !== "international"
                          ? "cursor-not-allowed bg-white opacity-30"
                          : "cursor-pointer"
                      } ${
                        selectedTravelType === "international"
                          ? "border border-indigo-600"
                          : "border border-neutral-400"
                      }`}
                      onClick={() =>
                        !requiredObj?.travelType && handleTravelType("international")
                      }
                    >
                      <input
                        type="radio"
                        id="International"
                        name="travelType"
                        value="traveltype"
                        checked={selectedTravelType == "international"}
                        readOnly
                      />
                      <div>
                        <p className="font-cabin text-neutral-800 text-normal tracking-wider">
                          {" "}
                          International{" "}
                        </p>
                        <p className="font-cabin -mt-1 text-neutral-600 text-xs tracking-tight">
                          Travelling out of country
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div
                      className={`flex gap-4 border border-indigo-400 max-w-[300px] accent-indigo-600 px-6 py-2 rounded   ${
                        requiredObj?.travelType && requiredObj?.travelType !== "domestic"
                          ? "cursor-not-allowed "
                          : "cursor-pointer"
                      }${
                        selectedTravelType === "domestic"
                          ? "border border-indigo-600"
                          : "border border-neutral-400"
                      } `}
                      onClick={() =>
                        !requiredObj?.travelType && handleTravelType("domestic")
                      }
                    >
                      <input
                        type="radio"
                        id="Domestic"
                        name="travelType"
                        value="traveltype"
                        checked={selectedTravelType == "domestic"}
                        readOnly
                      />
                      <div>
                        <p className="font-cabin text-neutral-800 text-normal tracking-wider">
                          {" "}
                          Domestic{" "}
                        </p>
                        <p className="font-cabin -mt-1 text-neutral-600 text-xs tracking-tight">
                          Travelling within country
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      className={`flex gap-4 border border-indigo-400 max-w-[300px] accent-indigo-600 px-6 py-2 rounded   ${
                        requiredObj?.travelType && requiredObj?.travelType !== "local"
                          ? "cursor-not-allowed "
                          : "cursor-pointer"
                      }  ${
                        selectedTravelType === "local"
                          ? "border border-indigo-600"
                          : "border border-neutral-400"
                      }`}
                      onClick={() => !requiredObj?.travelType && handleTravelType("local")}>
                      <input
                        type="radio"
                        id="Local"
                        name="travelType"
                        value="traveltype"
                        checked={selectedTravelType == "local"}
                        readOnly
                      />
                      <div>
                        <p className="font-cabin text-neutral-800 text-normal tracking-wider">
                          {" "}
                          Local{" "}
                        </p>
                        <p className="font-cabin -mt-1 text-neutral-600 text-xs tracking-tight">
                          Travelling nearby
                        </p>
                      </div>
                    </div>
                  </div>
                </fieldset>

                <div className="flex gap-2 flex-row items-center">
                  <Button1
                    loading={isUploading.submit}
                    variant="fit"
                    text="Submit"
                    onClick={() => handleSubmitOrDraft("submit")}
                  />
                  {["draft", "new"].includes(requiredObj?.expenseHeaderStatus) && (
                    <Button1
                      loading={isUploading.saveAsDraft}
                      text="Save as Draft"
                      onClick={() => handleSubmitOrDraft("draft")}
                    />
                  )}
                  <CancelButton
                    loading={isUploading.deleteHeader}
                    active={active.deleteHeader}
                    variant="fit"
                    text="Delete"
                    onClick={() => {
                      setModalOpen(true);
                      setActionType("cancelExpense");
                    }}
                  />
                   <div
                      className="flex items-center justify-center rounded-sm bg-gray-200 p-1 h-fit cursor-pointer"
                      onClick={() => handleDashboardRedirection()}
                    >
                      <img src={cancel_icon} className="w-5 h-5" />
                    </div>
                </div>
              </div>
             

              {/* ///-level2- */}
              {["level1", "level2"].includes(requiredObj?.level) && (
                <div>
                  <AllocationComponent
                    errorMsg={errorMsg}
                    getSavedAllocations={getSavedAllocations}
                    travelAllocationFlag={requiredObj?.level}
                    travelExpenseAllocation={travelExpenseAllocation}
                    onAllocationSelection={onAllocationSelection}
                  />
                </div>
              )}

              <div>
                <ExpenseHeader
                  handleAddLineItem={() =>
                    navigate(`/${tenantId}/${empId}/${tripId}/new/line-item`)
                  }
                  selectedExpenseSettlement={requiredObj?.selectedSettlementOption                  }
                  errorMsg={errorMsg}
                  expenseHeaderStatus={requiredObj?.expenseHeaderStatus}
                  tripPurpose={formData?.tripPurpose}
                  tripNumber={formData?.tripNumber}
                  name={formData?.createdBy?.name}
                  expenseAmountStatus={requiredObj?.expenseAmountStatus}
                  isUploading={isUploading}
                  active={active}
                  cancel={cancel}
                  handleCancelExpenseHeader={handleCancelExpenseHeader}
                  handleSubmitOrDraft={handleSubmitOrDraft}
                  formData={formData}
                  approversList={requiredObj?.approverList}
                  onReasonSelection={onReasonSelection}
                  settlementOptions={settlementOptions}
                  defaultCurrency={requiredObj?.defaultCurrency}
                />
              </div>

              <div className="w-full mt-4">
                {/* <h1 className="text-2xl font-bold mb-4">Header Report</h1> */}
                {requiredObj?.travelExpenseData?.map((item, index) => (
                    <React.Fragment key={index}>
                      <div className="mb-4">
                        <div
                          className="flex w-full justify-between  items-center bg-gray-200/10 py-2 px-6 border-[1px]  border-slate-300 rounded-md cursor-pointer"
                          onClick={() => handleItemClick(index)}
                        >
                          <div className="max-w-full overflow-hidden whitespace-nowrap text-neutral-700 ">
                            <p className="overflow-hidden text-ellipsis ">
                              {`Header Report Number : ${
                                item?.expenseHeaderNumber ?? "N/a"
                              }`}
                            </p>
                          </div>

                          <div className="flex gap-4 items-center  text-neutral-900">
                            <div
                              className={`${getStatusClass(
                                item?.expenseHeaderStatus
                              )} px-2 py-1 rounded-sm ring-1 ring-white  text-sm capitalize font-normal font-cabin`}
                            >
                              <p>{item?.expenseHeaderStatus}</p>
                            </div>
                            <div>{activeIndex === index ? "▲" : "▼"}</div>
                          </div>
                        </div>
                        {activeIndex === index && (
                          <div className="bg-white  w-full  ">
                            {/* ///already booked travel details */}
                            <div className=" flex flex-col gap-4 py-2">
                              {["flights", "trains", "buses", "cabs", "hotels"]
                                .filter(
                                  (it) =>
                                    item?.alreadyBookedExpenseLines &&
                                    item.alreadyBookedExpenseLines[it]?.length >
                                      0
                                )
                                .map((itnItem, itnItemIndex) => (
                                  <React.Fragment key={itnItemIndex}>
                                    <details>
                                      <summary>
                                        <p className="inline-flex text-xl text-neutral-700 capitalize">
                                          {`${itnItem} `}
                                        </p>
                                      </summary>
                                      <div className="flex flex-col gap-1 ">
                                        {item.alreadyBookedExpenseLines[
                                          itnItem
                                        ].map((item, itemIndex) => {
                                          if (
                                            [
                                              "flights",
                                              "trains",
                                              "buses",
                                            ].includes(itnItem)
                                          ) {
                                            return (
                                              <React.Fragment
                                                key={`flight_${itemIndex}`}
                                              >
                                                <FlightCard
                                                  allocations={
                                                    requiredObj?.travelAllocations?.find(
                                                      (header) =>
                                                        header?.categoryName ===
                                                        removeSuffix(itnItem)
                                                    )?.allocations || []
                                                  }
                                                  defaultCurrency={
                                                    requiredObj?.defaultCurrency
                                                  }
                                                  amount={
                                                    item?.bookingDetails
                                                      ?.billDetails?.totalAmount
                                                  }
                                                  from={item.bkd_from}
                                                  to={item.bkd_to}
                                                  itnId={item.itineraryId}
                                                  showActionButtons={
                                                    travelRequestStatus !==
                                                      "pending approval" &&
                                                    item.status ===
                                                      "pending approval"
                                                  }
                                                  date={item.date}
                                                  time={item.time}
                                                  travelClass={item.travelClass}
                                                  mode={titleCase(
                                                    itnItem.slice(0, -1) ?? ""
                                                  )}
                                                />
                                              </React.Fragment>
                                            );
                                          } else if (itnItem === "cabs") {
                                            return (
                                              <React.Fragment
                                                key={`cab_${itemIndex}`}
                                              >
                                                <CabCard
                                                  allocations={
                                                    requiredObj?.travelAllocations?.find(
                                                      (header) =>
                                                        header?.categoryName ===
                                                        removeSuffix(itnItem)
                                                    )?.allocations || []
                                                  }
                                                  defaultCurrency={
                                                    requiredObj?.defaultCurrency
                                                  }
                                                  amount={
                                                    item?.bookingDetails
                                                      ?.billDetails?.totalAmount
                                                  }
                                                  itnId={item.itineraryId}
                                                  from={item.bkd_pickupAddress}
                                                  to={item.bkd_dropAddress}
                                                  date={item.date}
                                                  time={item.time}
                                                  travelClass={item.travelClass}
                                                  isTransfer={
                                                    item.type !== "regular"
                                                  }
                                                />
                                              </React.Fragment>
                                            );
                                          } else if (itnItem === "hotels") {
                                            return (
                                              <React.Fragment
                                                key={`hotel_${itemIndex}`}
                                              >
                                                <HotelCard
                                                  allocations={
                                                    requiredObj?.travelAllocations?.find(
                                                      (header) =>
                                                        header?.categoryName ===
                                                        removeSuffix(itnItem)
                                                    )?.allocations || []
                                                  }
                                                  location={item?.bkd_location}
                                                  defaultCurrency={
                                                    requiredObj?.defaultCurrency
                                                  }
                                                  amount={
                                                    item?.bookingDetails
                                                      ?.billDetails?.totalAmount
                                                  }
                                                  itnId={item.itineraryId}
                                                  checkIn={item.bkd_checkIn}
                                                  checkOut={item.checkOut}
                                                  date={item.data}
                                                  time={item.time}
                                                  travelClass={item.travelClass}
                                                  mode="Train"
                                                />
                                              </React.Fragment>
                                            );
                                          }
                                        })}
                                      </div>
                                    </details>
                                  </React.Fragment>
                                ))}
                            </div>

                            <div className="space-y-2">
                              {item.expenseLines.map((lineItem, index) =>
                                lineItem.expenseLineId === formData?.fields?.expenseLineId ? (
                                  <div key={`${index} line-item`} className="w-full border flex flex-col md:flex-row relative border-t-2 border-slate-300 h-screen p-4 pb-16 ">
                                    <div className="relative w-full sm:w-3/5 h-full border border-slate-300 rounded-md hidden sm:block">
                                    
                                    {(isFileSelected || initialFile )&& <RemoveFile 
                                     onClick={handleRemoveFile}/>}
                                      <DocumentPreview
                                        isFileSelected={isFileSelected} 
                                        setIsFileSelected={setIsFileSelected} 
                                        selectedFile={selectedFile} 
                                        setSelectedFile={setSelectedFile}
                                        initialFile={initialFile}
                                      />
                                    </div>
                                    <div className="w-full sm:w-2/5 overflow-auto h-full">
                                      <LineItemForm 
                                      expenseLines={extractValidExpenseLines(requiredObj?.travelExpenseData, "travelExpense", lineItem?.expenseLineId )}
                                      categoryName={lineItem?.['Category Name']}
                                      setErrorMsg={setErrorMsg}
                                      isUploading={isUploading}
                                      defaultCurrency={requiredObj?.defaultCurrency}
                                      currencyConversion={currencyConversion}
                                      setCurrencyConversion={setCurrencyConversion}
                                      handleCurrencyConversion={handleCurrencyConversion}
                                      setFormData={setFormData}
                                      formData={formData.fields}
                                      handleAllocations={handleAllocations}
                                      onboardingLevel={requiredObj.level}
                                      allocationsList={requiredObj?.selectedCategoryData?.expenseAllocation}
                                      errorMsg={errorMsg}
                                      lineItemDetails={formData.fields}
                                      categoryFields={requiredObj?.selectedCategoryData?.fields || []}
                                      classOptions={requiredObj?.selectedCategoryData?.class}
                                     
                                       />
                                    </div>
                                    <div className="absolute -left-4 mx-4 inset-x-0 w-full  z-20 bg-slate-100   h-16 border border-slate-300 bottom-0">
                                      <ActionBoard
                                        showButton={true}
                                        title1={"Delete"}
                                        title={"Update"}
                                        handleDeleteLineItem={() => {
                                          setModalOpen(true);
                                          setActionType("deleteLineItem");
                                          setSelectedLineItemId(lineItem);
                                        }}
                                        handleClick={() =>
                                          handleSaveLineItem("updateLineItem")
                                        }
                                        isUploading={isUploading}
                                        setModalOpen={setModalOpen}
                                        setActionType={setActionType}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex flex-col lg:flex-row  w-full h-screen">
                                      <div className="  w-full lg:w-3/5 border border-slate-300 h-[800px] md:h-full rounded-md">
                                        <DocumentPreview
                                          emptyPreview={true}
                                          initialFile={lineItem?.billImageUrl}
                                        />
                                      </div>
                                      <div className="w-full lg:w-2/5 h-full">
                                        <LineItemView
                                          expenseHeaderStatus={item?.expenseHeaderStatus}
                                          lineItem={lineItem}
                                          isUploading={isUploading}
                                          index={index}
                                          handleEdit={handleEdit}
                                          handleDeleteLineItem={() => {
                                            setModalOpen(true);
                                            setActionType("deleteLineItem");
                                            setSelectedLineItemId(lineItem);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </>
                                )
                              )}
                            </div>
                           
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
              </div>

              {/*start new //lineItemform */}
              {formVisible && (
                <div className=" w-full flex flex-col  lg:flex-row">
                  <div className="border w-full lg:w-1/2  border-slate-300 rounded-md">
                    <DocumentPreview
                      selectedFile={ocrSelectedFile || selectedFile}
                    />
                  </div>
                  <div className="border w-full lg:w-1/2 lg:h-[710px] overflow-y-auto scrollbar-hide">
                    <div className="w-full flex items-center justify-start h-[52px] border-b-[1px] px-4">
                      <p className="text-zinc-600 text-medium font-semibold font-cabin capitalize">
                        {" "}
                        Category -{selectedCategory}
                      </p>
                    </div>
                    <>
                      <div className=" w-full flex-wrap flex flex-col justify-center items-center p-2">
                        <div className="w-full flex-row">
                          <div className="w-full  flex-wrap flex items-center justify-center">
                            {requiredObj?.level === "level3" && (
                              <div>
                                <AllocationComponent
                                  errorMsg={errorMsg}
                                  getSavedAllocations={getSavedAllocations}
                                  travelAllocationFlag={requiredObj?.level}
                                  travelExpenseAllocation={
                                    travelExpenseAllocation
                                  }
                                  onAllocationSelection={onAllocationSelection}
                                />
                              </div>
                            )}
                            {/* <div className="w-full border flex flex-wrap items-center justify-center"> */}
                            {selectedCategory &&
                              categoryFieldBySelect &&
                              categoryFieldBySelect.map((field) => (
                                <React.Fragment key={field.name}>
                                  <div
                                    key={field.name}
                                    className="sm:w-1/2 w-full flex justify-center  items-center px-2 py-1 "
                                  >
                                    {field.name === "From" ||
                                    field.name === "To" ||
                                    field.name === "Departure" ||
                                    field.name === "Pickup Location" ||
                                    field.name === "DropOff Location" ||
                                    field.name === "Arrival" ? (
                                      <>
                                        <Input
                                          inputRef={""}
                                          title={field.name}
                                          name={field.name}
                                          type={"text"}
                                          initialValue={
                                            lineItemDetails[field.name]
                                          }
                                          placeholder={`Enter ${field.name}`}
                                          value={
                                            lineItemDetails[field.name || ""]
                                          }
                                          onChange={(value) =>
                                            handleInputChange(field.name, value)
                                          }
                                        />
                                      </>
                                    ) : field.name === "Class" ||
                                      field.name === "Class of Service" ? (
                                      <div className="  w-full translate-y-[-6px] z-20">
                                        <Select
                                          title={field.name}
                                          name={field.name}
                                          placeholder={`Select ${field.name}`}
                                          options={classDropdownValues || []} // Define your class options here
                                          currentOption={
                                            lineItemDetails[field.name] || ""
                                          }
                                          onSelect={(value) =>
                                            handleInputChange(field.name, value)
                                          }
                                          // violationMessage={`Your violation message for ${field.name}`}
                                          // error={{ set: true, message: `Your error message for ${field.name}` }}
                                        />
                                      </div>
                                    ) : (
                                      // Otherwise, render a regular input field
                                      <Input
                                        initialValue={
                                          lineItemDetails[field.name]
                                        }
                                        // error={field.name=== 'Total Amount' ? errorMsg.totalAmount : null}
                                        // error={totalAmountKeys.includes(field?.name) ? errorMsg.totalAmount : null}
                                        error={
                                          (totalAmountKeys.includes(
                                            field?.name
                                          ) &&
                                            errorMsg.totalAmount) ||
                                          (dateKeys.includes(field?.name) &&
                                            errorMsg.dateErr)
                                        }
                                        title={field.name}
                                        name={field.name}
                                        // type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
                                        type={
                                          field.type === "date"
                                            ? "date"
                                            : field.type === "numeric"
                                            ? "number"
                                            : field.type === "time"
                                            ? "time"
                                            : "text"
                                        }
                                        placeholder={`Enter ${field.name}`}
                                        value={
                                          lineItemDetails[field.name || ""]
                                        }
                                        // inputRef={autocompleteRefs[field.name] || (autocompleteRefs[field.name] = useRef())}
                                        onChange={(value) =>
                                          handleInputChange(field.name, value)
                                        }
                                      />
                                    )}
                                  </div>
                                </React.Fragment>
                              ))}
                          </div>

                          {/* //personal expense */}
                          <div className="flex flex-col px-2 justify-between">
                            <div className="flex flex-row justify-evenly items-center h-[73px]">
                              {/* <div className="flex-1 bg-white">
<Toggle label={'Personal Flag'} initialValue={false}  onClick={handlePersonalFlag}/>
</div> */}
                              {console.log(
                                "perosnal amount error",
                                errorMsg.personalAmount
                              )}
                              <div className=" flex-1 pl-2 justify-end">
                                <div className="w-full ">
                                  {personalFlag && (
                                    <Input
                                      title="Personal Amount"
                                      error={errorMsg?.personalAmount}
                                      name="personalExpenseAmount"
                                      type={"text"}
                                      onChange={(value) =>
                                        handleInputChange(
                                          ["personalExpenseAmount"],
                                          value
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="relative">
                              <div className=" h-[48px] w-full sm:w-[200px]  mb-10 mr-28 mt-[-10px] ">
                                <Select
                                  title="Currency"
                                  //currentOption={currencyDropdown[0].shortName}
                                  placeholder="Select Currency"
                                  //options={currencyDropdown.map(
                                  //   (currency) => currency.shortName
                                  // )}
                                  // onSelect={(value) =>
                                  //   handleCurrenctySelect(value)
                                  // }
                                  //  onSelect={(value)=>{setLineItemDetails({...lineItemDetails,['Currency']:value}),setSelectDropdown(value)}}
                                  violationMessage="Your violation message"
                                  error={errorMsg.currencyFlag}
                                />
                              </div>
                              {/* ////-------- */}
                              <div className="absolute top-6 left-[210px] w-fit">
                                {selectDropdown == null ||
                                  (selectDropdown.shortName !==
                                    requiredObj?.defaultCurrency?.shortName && (
                                    <ActionButton
                                      disabled={active?.convert}
                                      loading={active?.convert}
                                      active={active.convert}
                                      text="Convert"
                                      onClick={() =>
                                        handleConverter(
                                          totalAmount,
                                          lineItemDetails?.personalExpenseAmount
                                        )
                                      }
                                    />
                                  ))}
                              </div>
                            </div>
                            <div>
                              {currencyTableData?.currencyFlag ? (
                                <div className={`flex gap-2 `}>
                                  <div className="min-w-[200px] w-full  h-auto flex-col justify-start items-start gap-2 inline-flex mb-3">
                                    <div className="text-zinc-600 text-sm font-cabin">
                                      Coverted Amount Details :
                                    </div>
                                    <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin  ">
                                      <div className="w-full h-full decoration:none  rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600">
                                        <div
                                          className={`sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100  border  ${
                                            currencyTableData?.convertedPersonalAmount ==
                                            undefined
                                              ? "rounded-md"
                                              : "rounded-t-md"
                                          }`}
                                        >
                                          <div className="text-[16px] font-semibold text-neutral-600">
                                            Total Amount{" "}
                                          </div>
                                          <div className="text-neutral-600 font-cabin">
                                            {
                                              currencyTableData?.defaultCurrencyName
                                            }{" "}
                                            {currencyTableData?.convertedTotalAmount?.toFixed(
                                              2
                                            )}
                                          </div>
                                        </div>
                                        {currencyTableData?.convertedPersonalAmount !==
                                          undefined && (
                                          <>
                                            <div className="sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100 ">
                                              <div className=" text-[16px] font-semibold text-neutral-600">
                                                Personal Amount{" "}
                                              </div>
                                              <div className="text-neutral-600 font-cabin">
                                                {
                                                  currencyTableData?.defaultCurrencyName
                                                }{" "}
                                                {currencyTableData?.convertedPersonalAmount?.toFixed(
                                                  2
                                                )}
                                              </div>
                                            </div>
                                            <div className="sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-200 rounded-b-md border">
                                              <div className="  text-[16px] font-semibold text-neutral-600">
                                                Final Reimbursement Amount{" "}
                                              </div>
                                              <div className="text-neutral-600 font-cabin">
                                                {
                                                  currencyTableData?.defaultCurrencyName
                                                }{" "}
                                                {currencyTableData?.convertedBookableTotalAmount?.toFixed(
                                                  2
                                                )}
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                currencyTableData?.message !== undefined && (
                                  <div
                                    className={`flex items-center justify-center gap-2 border-[1px] px-4 py-2 rounded border-yellow-600  text-yellow-600 mt-6`}
                                  >
                                    <img
                                      src={validation_symb_icon}
                                      className="w-5 h-5"
                                    />
                                    <h2 className="">
                                      {currencyTableData?.message}
                                    </h2>
                                  </div>
                                )
                              )}
                            </div>

                            <div className="flex w-fit mb-4">
                              <Select
                                //currentOption={defaultCurrency}
                                title="Paid Through"
                                name="mode of payment"
                                placeholder="Select MOD"
                                options={[
                                  "Credit Card",
                                  "Cash",
                                  "Debit Card",
                                  "NEFT",
                                ]}
                                onSelect={(value) =>
                                  handleInputChange(["Mode of Payment"], value)
                                }
                              />
                            </div>

                            {/* ------////-------- */}

                            <div className="w-full mt-4 flex items-center justify-center border-[1px] border-gray-50 ">
                              <Upload
                                selectedFile={selectedFile}
                                setSelectedFile={setSelectedFile}
                                fileSelected={fileSelected}
                                setFileSelected={setFileSelected}
                              />
                            </div>
                          </div>
                          <div className="w-full mt-5 px-4">
                            <Button
                              text="Save"
                              disabled={isUploading}
                              loading={isUploading}
                              active={active.saveLineItem}
                            //  onClick={handleSaveLineItemDetails}
                            />
                          </div>

                          {/* -------------------- */}
                        </div>
                      </div>
                    </>
                  </div>
                </div>
              )}
              {/* end //lineItemform */}

             
            </div>
          </div>
        </>
      )}

      {/* <PopupMessage
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        message={message}
      /> */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(!modalOpen)}
        content={
          <div className="w-full h-auto">
            
             <TitleModal iconFlag={true} text={getTitle()} onClick={() => setModalOpen(false)}/>

            <div className="p-4">{getContent()}</div>
          </div>
        }
      />
    </>
  );
}

//expense allocation
function AllocationComponent({
  errorMsg,
  getSavedAllocations,
  travelExpenseAllocation,
  travelAllocationFlag,
  onAllocationSelection,
}) {
  const validAllocationFlags = ["level1", "level2", "level3"];
  console.log("saved allocation from");
  return (
    <div className="flex md:flex-row flex-col my-5 justify-evenly items-center flex-wrap">
      {validAllocationFlags.includes(travelAllocationFlag) &&
        travelExpenseAllocation &&
        travelExpenseAllocation?.map((expItem, index) => (
          <React.Fragment key={index}>
            <div className="h-[48px] inline-flex my-4 mx-2">
              <Select
                // error={errorMsg.allocations}
                error={errorMsg[expItem?.headerName]}
                currentOption={
                  getSavedAllocations?.find(
                    (item) => item?.headerName === expItem?.headerName
                  )?.headerValue ?? ""
                }
                options={expItem.headerValues}
                onSelect={(option) =>
                  onAllocationSelection(option, expItem.headerName)
                }
                placeholder="Select Allocation"
                title={`${titleCase(expItem.headerName ?? "")}`}
              />
            </div>
          </React.Fragment>
        ))}
    </div>
  );
}

///expense details on header
function ExpenseHeader({
  selectedExpenseSettlement,
  errorMsg,
  handleAddLineItem,
  expenseHeaderStatus,
  tripPurpose,
  tripNumber,
  name,
  formData,
  isUploading,
  active,
  approversList,
  onReasonSelection,
  settlementOptions,
  defaultCurrency,
  cancel,
  handleCancelExpenseHeader,
  handleSubmitOrDraft,
  expenseAmountStatus,
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 justify-between w-full ">
        {[
          {
            icon: user_icon,
            label: "Created By",
            value: name ?? "not available",
          },
          {
            icon: briefcase,
            label: "Trip Number",
            value: tripNumber ?? "not available",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 w-full md:w-1/5 border border-slate-300 rounded-md"
          >
            <div className="bg-slate-200 rounded-full p-2 shrink-0">
              <img src={item.icon} className="w-4 h-4" />
            </div>
            <div className="font-cabin">
              <p className="text-neutral-600 text-xs">{item.label}</p>
              <p className="text-neutral-900 text-sm ">{item.value}</p>
            </div>
          </div>
        ))}
        <div className="flex  flex-row gap-2 p-2 w-full md:w-3/5 border border-slate-300 rounded-md items-center">
          <div className="bg-slate-200 rounded-full p-2 shrink-0">
            <img src={money} className="w-4 h-4" />
          </div>
          {[
            {
              label: "Total Cash Advance",
              value:
                expenseAmountStatus?.totalCashAmount?.toFixed(2) ??
                "not available",
            },
            {
              label: "Remaining Cash Advance",
              value:
                expenseAmountStatus?.totalRemainingCash?.toFixed(2) > 0
                  ? expenseAmountStatus?.totalRemainingCash?.toFixed(2)
                  : "0.00" ?? "not available",
            },
            {
              label: "Total Expense",
              value:
                expenseAmountStatus?.totalExpenseAmount?.toFixed(2) > 0
                  ? expenseAmountStatus?.totalExpenseAmount?.toFixed(2)
                  : "0.00" ?? "not available",
            },
            {
              label: "Default Currency",
              value: defaultCurrency?.shortName ?? "not available",
            },
          ].map((item, index) => (
            <div key={index} className="flex-1 px-2 font-cabin">
              <p className="text-neutral-600 text-xs line-clamp-1">
                {item.label}
              </p>
              <p className="text-neutral-900 text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className=" flex items-start  justify-start flex-col gap-2  border-b-2  py-4">
        <div className="flex  flex-col md:flex-row gap-2 items-start justify-start">
          {approversList?.length > 0 &&
            approversList.map((approver, index) => (
              <div className="w-full h-full" key={`${index} approver`}>
                <p className="capitalize text-zinc-600 truncate whitespace-nowrap text-sm font-normal font-cabin pb-2.5">
                  {"Approvers"}
                </p>
                <div className="border rounded-md inline-flex justify-start items-center h-[44px]  w-full border-slate-300 text-neutral-700 truncate text-sm font-normal font-cabin px-4">
                  <p>{approver?.name}</p>
                </div>
              </div>
            ))}

          {settlementOptions?.length > 0 && (
            <div className="">
              <Select
                currentOption={selectedExpenseSettlement}
                options={settlementOptions}
                onSelect={onReasonSelection}
                error={errorMsg?.expenseSettlement}
                placeholder="Select Travel Expense "
                title="Expense Settlement"
              />
            </div>
          )}
        </div>

        <Button1 text="Add Expense" onClick={() => handleAddLineItem()} />
      </div>
    </>
  );
}

function spitImageSource(modeOfTransit) {
  if (modeOfTransit === "Flight") return airplane_icon;
  else if (modeOfTransit === "Train") return cab_icon;
  else if (modeOfTransit === "Bus") return cab_icon;
}

function FlightCard({
  allocations,
  defaultCurrency,
  amount,
  from,
  to,
  mode = "Flight",
  showActionButtons,
  itnId,
  handleLineItemAction,
}) {
  console.log("travel allocations", allocations);
  return (
    <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
      <img src={spitImageSource(mode)} className="w-4 h-4" />
      <div className="w-full flex sm:block">
        <div className="mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">
          <div className="flex-1">Destination</div>
          <div className="flex-1">Allocation</div>
          <div className="flex-1">Amount</div>
          <div className="flex-1">Already Booked</div>
        </div>

        <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
          <div className="flex-1 capitalize ">
            {from ?? "not provided"} <span className="  lowercase">to</span>{" "}
            {to ?? "not provided"}
          </div>
          <div className="flex-1 capitalize ">
            {allocations.map((allocation, index) => (
              <div
                key={index}
                className="flex w-full text-neutral-900 font-cabin flex-row items-center space-x-1 text-sm"
              >
                <p className="font-medium">{`${allocation.headerName}:`}</p>
                <p className="text-neutral-600">
                  {allocation.headerValue ?? "-"}
                </p>
              </div>
            ))}
          </div>
          <div className="flex-1">
            {defaultCurrency?.shortName ?? "-"} {formatAmount(amount) ?? "N/A"}
          </div>
          <div className="flex-1">
            <input type="checkbox" defaultChecked />
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
    </div>
  );
}

function HotelCard({
  defaultCurrency,
  amount,
  location,
  hotelClass,
  onClick,
  preference = "close to airport,",
}) {
  return (
    <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
      <p className="font-semibold text-base text-neutral-600">Hotel</p>
      <div className="w-full flex sm:block">
        <div className="mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">
          <div className="flex-1">Location</div>
          <div className="flex-1">Amount</div>

          <div className="flex-1">Already Booked</div>
        </div>

        <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
          <div className="flex-1">{location}</div>
          <div className="flex-1">
            {defaultCurrency?.shortName ?? "-"} {formatAmount(amount) ?? "N/A"}
          </div>
          <div className="flex-1">
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}

function CabCard({
  defaultCurrency,
  amount,
  from,
  to,
  date,
  time,
  travelClass,
  onClick,
  mode,
  isTransfer = false,
  showActionButtons,
  itnId,
  handleLineItemAction,
}) {
  return (
    <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
      <div className="font-semibold text-base text-neutral-600">
        <img src={cab_icon} className="w-6 h-6" />
        <p className="text-xs text-neutral-500">
          {isTransfer ? "Transfer Cab" : "Cab"}
        </p>
      </div>
      <div className="w-full flex sm:block">
        <div className="mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">
          <div className="flex-1">Pickup</div>
          {/* <div className="flex-1" >
            Travel Allocation   
            </div> */}
          {/* <div className="flex-1">
                    Date
            </div> */}
          <div className="flex-1">Amount</div>
          {<div className="flex-1">Already Booked</div>}
        </div>

        <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
          {/* <div className="flex-1">
                {from??'not provided'}     
            </div> */}
          <div className="flex-1">{from ?? "not provided"}</div>
          {/* <div className="flex-1">
                {date??'not provided'}
            </div> */}
          <div className="flex-1">
            {defaultCurrency?.shortName ?? "-"} {formatAmount(amount) ?? "N/A"}
          </div>

          <div className="flex-1">
            <input type="checkbox" defaultChecked={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

const ActionBoard = ({handleDeleteLineItem, isUploading, setModalOpen, setActionType, handleClick})=>{

  return(
    <div className='flex flex-col-reverse py-2 sm:flex-row justify-between px-4 items-center h-full w-full'>
      {/* <div>
      <Button1 loading={isUploading?.saveLineItem?.set} text='Submit' onClick={()=>handleClick()}/>
      </div> */}
       <p className='text-start whitespace-nowrap left-14 top-8 text-red-600 text-sm font-inter'><sup>*</sup>Kindly check the fields before saving the line item.</p>
    <div className='flex gap-1'>
      <Button1  loading={isUploading?.updateLineItem?.set}      text='Update'    onClick={()=>handleClick("saveAndNew")}/>
      <Button1  loading={isUploading?.deleteLineItem?.set}      text='Delete' onClick={()=>handleDeleteLineItem()}/>
      <CancelButton  loading={isUploading?.saveLineItem?.set} text='Cancel'          onClick={()=>{setModalOpen(true);setActionType("closeAddExpense")}}/>
    </div>

    
    </div>
  )
}

// function EditView({expenseHeaderStatus,isUploading,active,flagToOpen,expenseHeaderId,lineItem, index ,newExpenseReport ,handleEdit, handleDeleteLineItem}){
//   console.log('lineItems for edit view', lineItem)

//   return(
//     <>
// <div className=" w-full lg:w-3/5 border border-slate-300 rounded-md">
//   <DocumentPreview initialFile={lineItem?.billImageUrl}/>
// </div>

// <div className="w-full lg:w-2/5">
//   <LineItemView expenseHeaderId={expenseHeaderStatus} lineItem={lineItem} active={active} index={index} handleEdit={handleEdit} handleDeleteLineItem={()=>{setModalOpen(true);setActionType("deleteLineItem");setSelectedLineItemId(lineItem?.lineItemId)}}/>
// </div>

// </>
//   )
// }

// const EditForm = ({
//   setExpenseAmountStatus,
//   setGetExpenseData,
//   setEditLineItemById,
//   setIsUploading,
//   routeData,
//   companyDetails,
//   selectedAllocations,
//   expenseAmountStatus,
//   travelType,
//   active,
//   isUploading,
//   setActive,
//   setShowPopup,
//   setMessage,
//   selectedCategory,
//   travelAllocationFlag,
//   editFields,
//   categoryFields,
//   lineItemDetails,
//   classDropdownValues,
//   lineItem,
//   defaultCurrency,
// }) => {
//   //   const prevStageLineItem = lineItem && lineItem
//   //   const { tenantId,empId,tripId,expenseHeaderId }= routeData
//   //   const [editFormData ,setEditFormData]=useState(lineItem)
//   //   const [selectedCurrency , setSelectedCurrency]=useState(null)
//   //   const [selectedFile ,setSelectedFile]=useState(null)
//   //   const [fileSelected,setFileSelected]=useState(false)
//   //   const [totalAmount ,setTotalAmount]=useState(null)
//   //   const [date , setDate]=useState(null)
//   //   const [currencyTableData ,setCurrencyTableData]=useState(null)

//   //   const[ personalFlag , setPersonalFlag]=useState()
//   //   const [errorMsg,setErrorMsg]=useState({
//   //     currencyFlag:{set:false,msg:""},
//   //     totalAmount:{set:false,msg:""},
//   //     personalAmount:{set:false,msg:""},
//   //     dateErr:{set:false, msg :""}
//   //   })

//   //   // const[categoryFields, setCategoryFields]=useState(null)
//   //   const [initialFile , setInitialFile]=useState(null)
//   //   useEffect(() => {
//   //     // Set the initial file when the component is mounted
//   //     setInitialFile(lineItem?.Document);
//   //     console.log('line item form edit',lineItem)
//   //     const foundKey = totalAmountKeys.find(key => Object.keys(lineItem).includes(key));
//   //     const totalAmountValue = foundKey ? lineItem[foundKey] : undefined;
//   //     setTotalAmount(totalAmountValue)
//   //     const foundDateKey = dateKeys.find(key => Object.keys(lineItem).includes(key));
//   //     const dateValue = foundDateKey ? lineItem[foundDateKey] : undefined;
//   //     setDate(dateValue)
//   //     setPersonalFlag(lineItem?.isPersonalExpense)
//   //   }, []);

//   //   console.log('categoryFields1', personalFlag)

//   // //  useEffect(()=>{
//   // //   if(travelAllocationFlag ==='level2'){
//   // //     const internationalData = categoryfields && categoryfields.find(
//   // //       (category) => category.hasOwnProperty(lineItem.travelType)
//   // //     )?.international;
//   // //     setCategoryFields(internationalData)
//   // //     console.log('level2 fields after got travelType',internationalData)
//   // //   }
//   // //   if(travelAllocationFlag ==='level1'){
//   // //     setCategoryFields(categoryfields)
//   // //   }

//   // //  },[])

//   // //Edit Handle
//   // console.log('total amount11',totalAmount)
//   // const  handleCurrenctySelect= (shortName)=>{

//   //   const selectedCurrencyObject = currencyDropdown.find(currency => currency.shortName === shortName);
//   //   console.log('currency',selectedCurrencyObject)

//   //   setSelectedCurrency(selectedCurrencyObject)
//   //   setEditFormData((prevState)=>({...prevState,Currency:selectedCurrencyObject}))
//   //   if(shortName !== defaultCurrency?.shortName){
//   //     setEditFormData((prevState)=>({...prevState,isMultiCurrency:true}))

//   //   }else{
//   //     // setIsMultiCurrency(false)
//   //     setEditFormData((prevState)=>({...prevState,isMultiCurrency:false}))
//   //     setEditFormData((prevState)=>({...prevState,convertedAmountDetails:null}))
//   //   }
//   //   if(shortName === defaultCurrency?.shortName){
//   //     setCurrencyTableData(null)
//   //   }
//   //   setSelectedCurrency(shortName)
//   // }
//   // console.log('currency for edit ',selectedCurrency)

//   // //Edit Handle
//   //   const handlePersonalFlag=()=>{
//   //      setPersonalFlag((prev)=>(!prev))
//   //      if(personalFlag){
//   //      setEditFormData({...editFormData,isPersonalExpense: false,personalExpenseAmount:""})
//   //     //  if(selectedCurrency?.shortName !==defaultCurrency?.shortName ){
//   //     //   setEditFormData((prevData)=>({...prevData, convertedAmountDetails:{convertedBookableTotalAmount}}))
//   //     //  }

//   //     }else{
//   //        setEditFormData((prevData) => ({ ...prevData, isPersonalExpense:true}))
//   //}}

//   // useEffect(()=>{
//   //   if (fileSelected) {
//   //     setEditFormData((prevData)=>({
//   //       ...prevData,
//   //       ['Document']: selectedFile,
//   //     }));
//   //   }
//   // },[(selectedFile)])
//   // Edit Handle
//   // const handleEditChange = (key , value)=>{

//   //   setEditFormData((prevData)=>({...prevData , [key]: value}))
//   //   if (totalAmountKeys.includes(key)) {
//   //     setTotalAmount(value);
//   //   }
//   //   if (dateKeys.includes(key)) {
//   //     setDate(value);
//   //   }

//   // }
//   // console.log('total amount for edit', totalAmount)
//   // console.log('date for edit', date)

//   //Edit Handle
//   // const handleConverter = async (totalAmount ,personalExpenseAmount ) => {

//   //   let allowForm = true;
//   //   if (totalAmount === 0 || totalAmount === undefined || totalAmount ===""){
//   //     setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: true, msg: "Enter total amount" } }));
//   //     allowForm = false;
//   //     console.log('total amount  is empty' , totalAmount)
//   //   } else {
//   //     setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: false, msg: "" } }));
//   //   }
//   //   if (personalFlag && (personalExpenseAmount === "" || personalExpenseAmount === undefined)) {
//   //     setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: true, msg: "Enter personal amount" } }));
//   //     allowForm = false;
//   //   } else {
//   //     setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: false, msg: "" } }));
//   //   }
//   //   const nonPersonalAmount = (totalAmount || 0) - personalExpenseAmount;

//   //   const validPersonalAmount =( totalAmount ||0 ) - personalExpenseAmount
//   //   if (validPersonalAmount <=0 ) {
//   //     setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: true, msg: "Personal Expense amount should be less than Total Expenditure" } }));
//   //     allowForm = false;
//   //   }

//   //   if (allowForm) {

//   //     const convertDetails = {
//   //       currencyName: selectedCurrency,
//   //       personalAmount: personalExpenseAmount || "",
//   //       nonPersonalAmount: nonPersonalAmount || "",
//   //       totalAmount: totalAmount

//   //     };
//   //     console.log('sent converted details',convertDetails)

//   //     ///api
//   //         try {
//   //           setIsUploading(true)
//   //           setActive(prevState => ({ ...prevState, convert: true }));
//   //           const response = await currencyConversionApi (tenantId,convertDetails);
//   //           setCurrencyTableData(response?.currencyConverterData || {})
//   //           setEditFormData({...editFormData,convertedAmountDetails:response?.currencyConverterData || {}})

//   //           if (selectedCurrency !== defaultCurrency?.shortName && !response?.currencyConverterData?.currencyFlag){
//   //             setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: true, msg: "Conversion not available, Please contact admin" } }));
//   //             console.log('converted flag no' , )
//   //           } else {
//   //             setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: false, msg: "" } }));
//   //           }
//   //           setActive(prevState => ({ ...prevState, convert: false }));
//   //           setIsUploading(false)
//   //           console.log('converted amount fetched',response.currencyConverterData);
//   //         } catch (error) {
//   //           setIsUploading(false)
//   //           setActive(prevState => ({ ...prevState, convert: false }));
//   //           console.log('Error in fetching expense data for approval:', error.message);
//   //           setShowPopup(true)
//   //           setMessage(error.message);
//   //           setTimeout(() => {setMessage(null);setShowPopup(false);setActive(prevState => ({ ...prevState, convert: false }));},5000);
//   //         }
//   //   }
//   // };

//   //Edit Handle

//   return (
//     <>
//       <div className="w-full border flex flex-col md:flex-row relative border-t-2 border-slate-300 h-screen p-4 pb-16 ">
//         <div className="w-full sm:w-3/5 h-full border border-slate-300 rounded-md hidden sm:block">
//           <DocumentPreview
//             selectedFile={selectedFile}
//             initialFile={initialFile}
//           />
//         </div>

//         <div className="w-full sm:w-2/5 overflow-auto h-full">
//           <LineItemForm />
//         </div>
//       </div>
//     </>
//   );
// };

// <div className="w-full flex items-center justify-start h-[52px] border px-4 ">

//      <p className="text-zinc-600 text-medium font-semibold font-cabin capitalize">   Category -{lineItem?.['Category Name']}</p>
//    </div>

//      <div  className="w-full border flex flex-wrap items-start sm:justify-between justify-center sm:gap-0 gap-4 py-4 px-2">

//  {selectedCategory && editFields && editFields?.fields.map((field)=>(

//          <>
//  <div key={field.name} >

//    {field.name === 'From' || field.name === 'To' || field.name === 'Departure' || field.name === 'Pickup Location' ||field.name === 'DropOff Location' || field.name === 'Arrival' ? (
//       <>
//        <Input
//        id="pac-input"
//        title={field.name}
//        name={field.name}
//        initialValue={editFormData[field.name]}
//        type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : field.type === 'time' ? 'time' : 'text'}
//        placeholder={`Enter ${field.name}`}
//        onChange={(value)=> handleEditChange(field.name, value)}
//      />
//      </>
//      ) : (field.name ==='Class' || field.name ==='Class of Service') ? (
//        <div className="relative">
//        <Select
//          title={field.name}
//          placeholder={`Select ${field.name}`}
//          options={classDropdownValues || []}
//          currentOption={lineItem['Class of Service'] || lineItem['Class']}
//          onSelect={(value) => handleEditChange(field.name ,value)}
//        />
//        </div>

//      ) :(

//        <Input
//          title={field.name}
//          name={field.name}
//          type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : field.type === 'time' ? 'time' : 'text'}
//          placeholder={`Enter ${field.name}`}
//          initialValue={editFormData[field.name]}
//          onChange={(value)=> handleEditChange(field.name,value)}
//          error={(totalAmountKeys.includes(field?.name) && errorMsg.totalAmount) || (dateKeys.includes(field?.name) && errorMsg.dateErr )}
//        />
//      )} </div>

//          </>
//         ))}

// <div className='flex flex-col  sm:justify-between justify-center w-full'>
// <div className="flex flex-col md:flex-row gap-4">
// <div className="w-1/2 sm:flex-row flex-col  h-[52px] flex items-center justify-center   mb-5">

// <div className="w-[100px] flex flex-col items-center">
// <div>

// <Toggle initialValue={false} label={'Personal Flag'} setChecked={setPersonalFlag}  checked={personalFlag} onClick={handlePersonalFlag}/>
// </div>
// </div>
// </div>

// <div className="w-1/2 ">
// {personalFlag &&
// <Input
// title='Personal Amount'
// error={ errorMsg.personalAmount}
// name='personalAmount'
// type={'text'}
// initialValue={editFormData?.['personalExpenseAmount']}
// onChange={(value)=>handleEditChange('personalExpenseAmount',value)}
// />}
// </div>
// </div>

// <div className="flex flex-row items-center">
// <div className="h-[48px] w-[100px] mb-10 mr-28 mt-[-10px]">
//   <Select
//       placeholder="Select Currency"
//       title="Currency"
//       options={currencyDropdown.map(currency => currency.shortName)}

//       currentOption={lineItem?.['Currency']?.shortName}
//       violationMessage="Your violation message"
//       error={errorMsg.currencyFlag}
//       onSelect={(value) =>{ handleCurrenctySelect(value)}}
//       />
// </div>
// <div className="w-fit">
// { selectedCurrency == null || selectedCurrency !== defaultCurrency?.shortName   &&
// <ActionButton loading={isUploading} active={active.convert}  text="Convert" onClick={()=>handleConverter(totalAmount, editFormData?.personalExpenseAmount)}/>
// }
// </div>

// </div>

// <div >
// {editFormData?.convertedAmountDetails?.currencyFlag ?
// <div className='flex gap-2'>
// <div className="min-w-[200px] w-full  h-auto flex-col justify-start items-start gap-2 inline-flex mb-3">
// <div className="text-zinc-600 text-sm font-cabin">Coverted Amount Details :</div>
// <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin">
//  <div className="w-full h-full decoration:none  rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600">
//    <div className={`sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100  ${editFormData?.convertedAmountDetails?.convertedPersonalAmount == undefined ? "rounded-md":"rounded-t-md"}`}>
//      <div className="text-[16px] font-semibold text-neutral-600">Total Amount </div>
//      <div className="text-neutral-600 font-cabin">{editFormData?.convertedAmountDetails?.defaultCurrencyName} {editFormData?.convertedAmountDetails?.convertedTotalAmount?.toFixed(2)}</div>
//  </div>
// {editFormData?.convertedAmountDetails?.convertedPersonalAmount !== undefined &&
// <>
//    <div className="sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between min-h-12 bg-slate-100 rounded-t-md">
//      <div className=" text-[16px] font-semibold text-neutral-600">Personal Amount </div>
//      <div className="text-neutral-600 font-cabin">{editFormData?.convertedAmountDetails?.defaultCurrencyName} {editFormData?.convertedAmountDetails?.convertedPersonalAmount?.toFixed(2)}</div>
//  </div>
//    <div className="sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between min-h-12 bg-slate-200 rounded-b-md">
//      <div className="  text-[16px] font-semibold text-neutral-600">Final Reimbursement Amount </div>
//      <div className="text-neutral-600 font-cabin">{editFormData?.convertedAmountDetails?.defaultCurrencyName} {editFormData?.convertedAmountDetails?.convertedBookableTotalAmount?.toFixed(2)}</div>
//  </div>
//  </>}
//  </div>
// </div>
// </div>
// </div>
//   :
//  currencyTableData?.message !== undefined &&
//  <div className=' flex items-center justify-center gap-2 border-[1px] px-4 py-2 rounded border-yellow-600  text-yellow-600 mt-6'>
//    <img src={validation_symb_icon} className='w-5 h-5'/>
//  <h2 className=''>{currencyTableData?.message}</h2>
//  </div>
// }
// </div>

// <div className="w-full flex items-center justify-center border-[1px] border-gray-50">
// <Upload
//  selectedFile={selectedFile}
//  setSelectedFile={setSelectedFile}
//  fileSelected={fileSelected}
//  setFileSelected={setFileSelected}
//  />

// </div>
// </div>
// <div className="w-full mt-5 px-4">
// <Button text="Update"
// loading={isUploading.updateLineItme}
// active={active?.saveLineItem}
// onClick={handleSaveLineItemDetails} />
// </div>
// {/* -------------------- */}
//  </div>
