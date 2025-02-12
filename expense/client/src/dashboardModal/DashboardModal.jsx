import React,{useState,useEffect,useRef} from "react";
import { useParams,useNavigate } from "react-router-dom";
import Modal from "../components/common/Modal";
import { TitleModal } from "../components/common/TinyComponent";
import CancelButton from "../components/common/CancelButton";
import Button1 from "../components/common/Button1";
import { classDropdown } from "../utils/data";
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
import { allocationLevel } from "../utils/handyFunctions";

const DashboardModal = () => {

  const { cancel, tenantId, empId, tripId , expenseHeaderId} = useParams(); ///these has to send to backend get api
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
  const [travelRequestStatus, setTravelRequestStatus] = useState("pending approval");
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


  function consolidateLineItem(data) {
    const updatedData = data?.reduce((acc, item) => {
      // Check if the category exists in the accumulator object
      if (!acc[item?.["Category Name"]]) {
        acc[item?.["Category Name"]] = []; // Initialize as an empty array if it doesn't exist
      }
  
      // Push the current item into the array for its category
      acc[item?.["Category Name"]].push(item);
  
      return acc; // Return the updated accumulator for the next iteration
    }, {});
  
    return updatedData; // Return the grouped object
  }
  
  const [activeIndex, setActiveIndex] = useState();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState();


  const handleItemClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const handleCategoryIndexTab=(index)=>{
    setActiveCategoryIndex(index === activeCategoryIndex ? null : index)
  }



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
      const openedExpenseObj = (onboardingData?.travelExpenseData)?.find(expense => expense.expenseHeaderId === flagToOpen);
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
        setSelectedAllocations(allocations);
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
      //alreadyBookedExpenseLines
      const travelExpenseData = onboardingData?.travelExpenseData || [];
const firstAlreadyBookedExpense = travelExpenseData[0]?.alreadyBookedExpenseLines;

const spreadAlreadyBookedExpenseInOvertheExpenseData = onboardingData?.travelExpenseData?.map((item) => {
  if (!item?.alreadyBookedExpenseLines) {
    return {
      ...item,
      alreadyBookedExpenseLines: firstAlreadyBookedExpense || [] // Ensure firstAlreadyBookedExpense is defined
    };
  }
  return item;
});

// Apply filter if expenseHeaderId is available

const filteredData = expenseHeaderId
  ? spreadAlreadyBookedExpenseInOvertheExpenseData.filter(
      (expense) => expense.expenseHeaderId === expenseHeaderId
    )
  : spreadAlreadyBookedExpenseInOvertheExpenseData.filter(item => ["draft","rejected","pending approval"].includes(item?.expenseHeaderStatus))
      

      setRequiredObj((prev) => ({
        ...prev,
        approverList: openedExpenseObj?.approvers,
        defaultCurrency:onboardingData?.companyDetails?.defaultCurrency,
        selectedSettlementOption:openedExpenseObj?.expenseSettlement ?? "",
        expenseHeaderStatus:openedExpenseObj?.expenseHeaderStatus,
        "expenseHeaderId":openedExpenseObj?.expenseHeaderId ?? flagToOpen,
        "travelType": openedExpenseObj?.travelType ?? "",
        "allocations": onboardingData?.travelAllocationHeaders || [],
        "travelExpenseData": filteredData || [],
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
  console.log("is file selected", isFileSelected);

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
  const handleSubmitOrDraft = async (action,expenseHeaderId) => {
    let allowForm = true;
    const data = {
      expenseSettlement: requiredObj?.selectedExpenseSettlement || "",
      approvers: requiredObj?.travelExpenseData?.[0]?.approvers || [],
    };
    if (!requiredObj?.selectedExpenseSettlement && requiredObj?.expenseAmountStatus?.totalRemainingCash?.toFixed(2) < 0) {
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
          //expenseHeaderId : requiredObj?.expenseHeaderId,
          expenseHeaderId,
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

  const getContent = (actionType) => {
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
              <CancelButton text="Cancel" onClick={() => handleDashboardRedirection()} />
            </div>
          </>
        );

      default:
        return "";
    }
  };
  return (
    <>
    
      {/* <Modal
        isOpen={true}
        onClose={() => setModalOpen(!modalOpen)}
        content={
          <div className="w-full h-auto">
            
             <TitleModal iconFlag={true} text={"Delete Expense"} onClick={() => setModalOpen(false)}/>
            <div className="p-4">{getContent("cancelExpense")}</div>
          </div>
        }
      /> */}
      <div
          className=" h-full  flex items-start justify-center z-20"
          //onClick={handleClickOutside}
          // initial="hidden"
          // animate="visible"
          // exit="hidden"
          // variants={backdropVariants}
          // transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
           <div className=" inset-0 bg-gray-500 opacity-75 z-10"></div>
          <div
            //ref={modalRef}
            className=" border bg-white h-auto rounded-b-lg text-left overflow-visible transform z-20 shadow-lg md:w-[60%] w-full xl:w-auto"
            // initial="hidden"
            // animate="visible"
            // exit="hidden"
            // variants={modalVariants}
            // transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 0.5 }}
          >
            <div className="flex max-h-screen justify-center items-start text-center font-inter w-full">
            <div className="w-full h-auto">
            
            <TitleModal iconFlag={true} text={"Delete Expense"} onClick={() => setModalOpen(false)}/>
           <div className="p-4">{getContent("cancelExpense")}</div>
         </div>
            </div>
          </div>
        </div>
      
    </>
  );
};

export default DashboardModal;
