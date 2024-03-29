import React ,{useState,useEffect,useRef}from 'react';
import { cancelNonTravelExpenseHeaderApi, cancelNonTravelExpenseLineItemApi,  editNonTravelExpenseLineItemsApi, getCategoryFormElementApi, getNonTravelExpenseLineItemsApi, getNonTravelExpenseMiscellaneousDataApi, nonTravelOcrApi, postMultiCurrencyForNonTravelExpenseApi, postNonTravelExpenseLineItems, saveAsDraftNonTravelExpense, submitNonTravelExpenseApi, submitOrSaveAsDraftApi } from '../utils/api'
import { useParams } from 'react-router-dom';
import Error from '../components/common/Error';
import Button from '../components/common/Button';
import PopupMessage from '../components/common/PopupMessage';
import Icon from '../components/common/Icon';
import Input from '../components/common/Input';
import { arrow_left, briefcase, cancel_icon, cancel_round, chevron_down, file_icon, money, receipt, user_icon, validation_sym, validation_symb_icon } from '../assets/icon';
import {nonTravelExpenseData} from '../dummyData/nonTravelExpens';
import { titleCase, urlRedirection } from '../utils/handyFunctions';
import Upload from '../components/common/Upload';
import Select from '../components/common/Select';
import ActionButton from '../components/common/ActionButton';
import Modal from '../components/common/Modal';
import AddMore from "../components/common/AddMore.jsx";

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
  
  const {tenantId,empId,expenseHeaderId,cancel} =useParams()
  const dashboard_url = import.meta.env.VITE_DASHBOARD_URL
  const DASHBOARD_URL=`${dashboard_url}/${tenantId}/${empId}`
  

 
  const [headerDetails , setHeaderDetails]=useState(null)
  const [categoryList , setCategoryList]=useState(null);
      //this is for miscellaneous data
    //for get categories , dashboard to non tr expense ms 

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await getNonTravelExpenseMiscellaneousDataApi(tenantId, empId,);
          setCategoryList(response?.reimbursementExpenseCategory || [])
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

  
  


 

    const formData = [
              // { name:'Bill Date',type:'date'},
              // { name:'Bill Number',type:'numeric'},
              // { name:'Vendor Name',type:'text'},
              // { name: 'Description', type: 'text' },
              // { name: 'Quantity', type: 'numeric' },
              // { name: 'Unit Cost', type: 'numeric' },
              // { name: 'Tax Amount', type: 'numeric' },
              // { name: 'Total Amount', type: 'numeric' },        
    ];

    ///now this is dummy after data will set by ocr
    const ocrValue = {
        'Hotel Name' :'Seven Hills Inn',
        'Check-In Date' : '2019-03-26',
        'Check-Out Date': '2019-03-27',
        'City' : 'Behind Mango Market, Tiruchanoor Road, Thanapalli Cross, Chittoor Highway, Tirupati',
        'Room Rates' : '761', 
        'Guest Name' : ' Sumesh', 
        'Booking Reference No.' : '', 
        'Tax Amount' : '',
        'Total Amount' : '761',
          
    }

    const [expenseHeaderId1 , setExpenseHeaderId1]=useState(null); //from miscellaneous data
    const [expenseLineAllocation ,setExpenseLineAllocation]=useState(null)
    //const [categoryElement , setCategoryElement]=useState([...formData]); // this is for dummy
    const [categoryElement , setCategoryElement]=useState([]); //

    const [groupLimit,setGroupLimit]= useState({
      group:'',
      limit: 0,
      message:''
    })

    const [totalAmount, setTotalAmount] = useState(''); ///for handling convert 
    const [date ,setDate]= useState('')
    const [currencyTableData, setCurrencyTableData] = useState(null);
    const [lineItemsData,setLineItemsData]=useState([]) //for get all line item
    const [formDataValues, setFormDataValues] = useState(); 

    const [selectedLineItemId, setSelectedLineItemId]=useState(null)
    const [showModal , setShowModal]= useState(false)
    const [action1 , setAction] = useState(null)
    const [isLoading,setIsLoading]=useState(true)
    const [isUploading , setIsUploading]=useState(false)
    const [active , setActive]=useState({
      edit:{visible:false,id:null},
      saveLineItem:false,
      convert:false,
      delete:{visible:false,id:null},
      deleteHeader:false,
      saveAsDraft:false,
      submit:false
    })
    
    const [loadingErrorMsg, setLoadingErrorMsg]=useState(null)
    const [errorMsg,setErrorMsg]=useState({
      dateErr:{set:false,msg:""},
      currencyFlag:{set:false,msg:""},
      totalAmount:{set:false,msg:""},
      allocations: { set: false, msg: "" }
    })

    const [openLineItemForm,setOpenLineItemForm]=useState(false)
    const [openModal,setOpenModal]=useState(null);
    const [showPopup ,setShowPopup]=useState(false);
    const [message,setMessage]=useState(null)  

    


const handleModalVisible=()=>{
  setShowModal(!showModal)
}


//for save selected expenseLineAllocation allocation in array
const [selectedAllocations , setSelectedAllocations]=useState([])//for saving expenseLineAllocation on  line item   


const onAllocationSelection = (option, headerName) => {
  // Check if an allocation with the same headerName already exists
  const existingAllocationIndex = selectedAllocations.findIndex(allocation => allocation.headerName === headerName);

  // Create a new allocation object
  const newAllocation = { headerName: headerName, headerValue: option || "" };

  const newErrorMsg = { ...errorMsg };
  newErrorMsg[headerName] = { set: false, msg: "" };
  setErrorMsg(newErrorMsg);

  if (existingAllocationIndex !== -1) {
    // If allocation with the same headerName exists, replace it
    setSelectedAllocations(prevAllocations => {
      const updatedAllocations = [...prevAllocations];
      updatedAllocations.splice(existingAllocationIndex, 1, newAllocation);
      return updatedAllocations;
    });
  } else {
    // Otherwise, add the new allocation
   
    setSelectedAllocations(prevAllocations => [...prevAllocations, newAllocation]);
  }
};


const [selectedCategory , setSelectedCategory]= useState(null) 
const [selectedCurrency , setSelectedCurrency]= useState(null)  
const [defaultCurrency , setDefaultCurrency]=useState(null)

    // const handleCategoryChange=(value)=>{
    
    // setSelectedCategory(value)
    // console.log('selectedCategory',value)
    // setFormDataValues({...formDataValues,currencyName:value})
    // }
  
    ///Handle Edit
    const handleEdit=(id,category)=>{
      setIsUploading(true)
      setActive(prevState => ({ ...prevState, edit: { visible:true,id:id}}));
      setSelectedLineItemId(id)
      console.log("lineItemId for edit",id ,category)
      setSelectedCategory(category)
      console.log('category for edit',)
      handleGenerateExpense (category)
      setIsUploading(false)
      setActive(prevState => ({ ...prevState, edit: { visible:false,id:null}}));
  }

  //Handle Delete

  const handleDelete=async(lineItemId)=>{
    const expenseHeaderIds = expenseHeaderId || expenseHeaderId1 || expenseHeaderIdBySession
    const lineItemIds = {lineItemIds :[lineItemId]}

    try {
      setIsUploading(true)
      setActive(prevState => ({ ...prevState, delete: { visible:true,id:lineItemId}}));
      const response = await cancelNonTravelExpenseLineItemApi(tenantId,empId,expenseHeaderIds,lineItemIds);
      setShowPopup(true)
      setMessage(response?.message);
      console.log('line item deleted successfully',response);
      setIsUploading(false);
      setActive(prevState => ({ ...prevState, delete: { visible:false,id:null}}));
      const updatedLineItems = lineItemsData.filter(
        (item) => item.lineItemId !== lineItemId
      );
      setLineItemsData(updatedLineItems)
      setTimeout(() => {setShowPopup(false);setMessage(null)},5000);
    } catch (error) {
      console.log('Error in deleting line item', error.message);
      setLoadingErrorMsg(error.message);
      setIsUploading(false)
      setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
    }
  }


//Handle Generate    
const [miscellaneousData , setMiscellaneousData]=useState(null)
    const handleGenerateExpense = async (category) => {
      // const category1 = 
      console.log('generate category',category)   
      try {
        setIsUploading(true)
        setActive(true)
        const response = await getCategoryFormElementApi(tenantId,empId,category );

        setMiscellaneousData(response || {})
        setDefaultCurrency(response?.defaultCurrency)
        setCategoryElement(response?.fields || [])
        setExpenseLineAllocation(response?.newExpenseAllocation) || []
        const allocation1 = response?.newExpenseAllocation
        const initialExpenseAllocation = allocation1 && allocation1.map(({ headerValues, headerName }) => ({
          headerName,
          headerValue: "" // Add "headerValue" and set it to an empty string
        }));
        console.log('intial allocation',initialExpenseAllocation)

        setSelectedAllocations(initialExpenseAllocation) 
        setExpenseHeaderId1(response?.expenseHeaderId)
        
        setGroupLimit(response?.group)
        console.log('group limit 1',response?.group)
        sessionStorage.setItem("expenseHeaderId", response?.expenseHeaderId);
        setIsUploading(false);
        setActive(false)
        
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
        // setCategoryElement(formData)
    }
    console.log('miscellaneous data',miscellaneousData)


    let expenseHeaderIdBySession = sessionStorage.getItem("expenseHeaderId");
    console.log('expenseHeaderId by session',expenseHeaderIdBySession)

// Function to save the expenseHeaderId in local storage

// const saveExpenseHeaderIdToLocalstorage = () => {
//   localStorage.setItem('expenseHeaderId', expenseHeaderId1);

//   console.log('expense header id stored in ')
// };

// // Call the function when the component mounts
// useEffect(() => {
//   saveExpenseHeaderIdToLocalstorage();
// }, [miscellaneousData]);





// Call the function when the component mounts
// useEffect(() => {
  
//     const storedExpenseHeaderId = localStorage.getItem('expenseHeaderId');
//     if (storedExpenseHeaderId) {
//       setExpenseHeaderId1(storedExpenseHeaderId);
//     }
//     console.log('expense header id from storage', storedExpenseHeaderId)
  
// }, []);

     /// Get Line Items
     const [expenseDataByGet , setExpenseDataByGet]= useState(null)
     useEffect(() => {
      const expenseHeaderIds = expenseHeaderId || expenseHeaderId1 || expenseHeaderIdBySession
      console.log('expense header id1',expenseHeaderIds)
    
      const fetchData = async () => {
        try {
          const response = await getNonTravelExpenseLineItemsApi(tenantId, empId,expenseHeaderIds);
          setExpenseDataByGet(response?.expenseReport)
          setLineItemsData(response?.expenseReport?.expenseLines)
          setIsLoading(false);
          if(response.expenseReport===null){
          setDefaultCurrency(response?.expenseReport?.defaultCurrency)
        }
          console.log(response.data)
          console.log('expense line items fetched successfully.',response);
        } catch (error) {
          console.log('Error in fetching expense data for approval:', error.message);
          setLoadingErrorMsg(error.message);
          setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
        }
      };
  
      fetchData(); 
  
    }, [expenseHeaderId ||expenseHeaderId1]);
    console.log('line items data ',lineItemsData)
    console.log('data by report ', expenseDataByGet)
   


//intial form value with empty string

useEffect(()=>{
  const initialFormValues = Object.fromEntries(
    categoryElement && categoryElement?.map((field) => [
       field.name,
        ocrValue?.[field.name] || '',
     ])
   );
   setFormDataValues(initialFormValues)
   const foundDateKey = dateForms.find(key => Object.keys(initialFormValues).includes(key));
        const foundTotalAmtKey = totalAmountNames.find(key => Object.keys(initialFormValues).includes(key));
        const dateValue = foundDateKey ? initialFormValues[foundDateKey] : undefined;
        const totalAmountValue = foundTotalAmtKey ? initialFormValues[foundTotalAmtKey] : undefined;
        setDate({[foundDateKey]:dateValue})
        setTotalAmount(totalAmountValue)
  console.log('intialFormValues',initialFormValues)
  console.log('expense line allocation',expenseLineAllocation)

},[categoryElement])




 
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
   console.log('groupline',groupLimit)

      console.log('initial values',formDataValues)

    const handleInputChange = (name, value) => {

      
      console.log(`Updating ${name} with value:`, value);
      const sample = JSON.parse(JSON.stringify(formDataValues))
      console.log(sample, 'before chaning input')

     

      setFormDataValues(prevState=>({...prevState, [name]: value}))
      // setFormDataValues((prevState) => ({ ...prevState, [name]: value || "" }));
      console.log('onChange lineitem',formDataValues)
      
      if (totalAmountNames.includes(name)) {
        setTotalAmount(value);
        setErrorMsg(prevErrors => ({
          ...prevErrors,
          totalAmount: { set: !name, msg: name ? "" : `Enter ${name}` }
        }));
      }


      if(dateForms.includes(name)){
        setDate({[name] : value})
        setErrorMsg(prevErrors => ({
          ...prevErrors,
          dateErr: { set: !name, msg: name ? "" : `Enter ${name}` }
        }));
      }    

      if(totalAmountNames.includes(name)){
        const limit = groupLimit?.limit 
        if(value>limit){
          setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:true,msg:groupLimit?.message}}))
        }else{
          setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:false,msg:groupLimit?.message}}))
        }
      }

      
      
    };

    console.log('form data update ',formDataValues)
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

    const handleEmptyValues = () => {
      const updatedFormData = { ...formDataValues };
  
      // Loop through each property in formDataValues
      for (const key in updatedFormData) {
        // Check if the property is undefined or null
        if (updatedFormData[key] === undefined || updatedFormData[key] === null) {
          // Set it to an empty string
          updatedFormData[key] = "";
        }
      }
  
      // Update the state with the modified formDataValues
      setFormDataValues(updatedFormData);
    };


     
const [selectedFile  , setSelectedFile]=useState(null)
const [fileSelected ,setFileSelected]= useState(false)



      
      console.log('total amount', totalAmount)
      console.log("expense line",lineItemsData)
      console.log('category element',categoryElement)

// Handle Converter
const handleConverter =async ( totalAmount , selectedCurrency) => { 

        if(totalAmount=="" ||totalAmount==undefined){
          setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:true,msg:"Enter Total Amount"}}))
          console.log('total amount', totalAmount)
        }else{
          setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:false,msg:""}}))
        }
        console.log('convertbutton clicked',totalAmount,selectedCurrency)
        if (totalAmount !== undefined && totalAmount !== "") {
          console.log('convertbutton clicked',totalAmount,selectedCurrency)
      
        try {
          setIsUploading(true)
          setActive(prevState => ({...prevState,convert:true}))
          const response = await postMultiCurrencyForNonTravelExpenseApi(tenantId,totalAmount,selectedCurrency.shortName);
          setCurrencyTableData(response?.currencyConverterData || {})
          setIsUploading(false);
          setActive(prevState => ({...prevState,convert:false}))
          console.log('converted amount fetched',response.currencyConverterData);

        } catch (error) {
          console.log('Error in fetching expense data for approval:', error.message);
          setIsUploading(false)
          setActive(prevState => ({...prevState,convert:false}))
          setLoadingErrorMsg(error.message);
          setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
        }
      
      }
      };

      

  
console.log('categoryname;',miscellaneousData?.categoryName)



   




/// Save Line Item
     
      const handleSaveLineItem = async () => {
        console.log('lineitem on save',formDataValues)
        const expenseHeaderId= miscellaneousData?.expenseHeaderId
        const expenseHeaderNumber = miscellaneousData?.expenseHeaderNumber
        const companyName = miscellaneousData?. companyName
        const createdBy  = miscellaneousData?.createdBy
        const defaultCurrency = miscellaneousData?.defaultCurrency
        console.log('nearby save' ,formDataValues)

       let  allowForm = true

        ///for date validation
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

        const firstKey = Object.keys(date)[0]
        if(selectedCurrency?.shortName !== defaultCurrency.shortName &&( !currencyTableData?.currencyFlag || currencyTableData ===null)){
          setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: true, msg: `conversion not available!` } }));
          allowForm = false;
        }else {
          setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: false, msg: "" } }));
        }  

      if(!['Travel Insurance','Hotel'].includes(formDataValues?.['Category Name']) && (!date[firstKey] || date[firstKey]=== "")){
        setErrorMsg((prevErrors) => ({ ...prevErrors, dateErr: { set: true, msg: `Enter the ${firstKey}` } }));
        allowForm = false;
        console.log('date  is empty1' , date[firstKey])
      }else {
        setErrorMsg((prevErrors) => ({ ...prevErrors, dateErr: { set: false, msg: "" } }));
      }

        if(totalAmount=="" ||totalAmount==undefined){
          setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:true,msg:"Enter Total Amount"}}))
          console.log('total amount', totalAmount)
          allowForm = false
        }else{
          setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:false,msg:""}}))
        }
     
        handleEmptyValues(); // Ensure that any undefined or null values in formDataValues are set to ""
      
        const updatedFormData = {
          companyName,
          createdBy,
          expenseHeaderNumber,
          defaultCurrency,
          
          lineItem :{
            group:groupLimit,
            'Category Name':selectedCategory || "",
            ...formDataValues,
            'Document': selectedFile || "",
            'Currency': selectedCurrency || defaultCurrency || "",
            multiCurrencyDetails :currencyTableData,
            expenseLineAllocation :selectedAllocations,
          }
        } 
    
        // setFormDataValues(updatedFormData);
        console.log('filledLineItemDetails', updatedFormData);
    
       if(allowForm){   
        try {
          setIsUploading(true)
          setActive(prevState => ({...prevState,saveLineItem:true}))
          
          const response = await postNonTravelExpenseLineItems(tenantId,empId,expenseHeaderId,updatedFormData);
          setShowPopup(true)
          setMessage(response?.message)
         console.log('line item saved successfully',response?.message )
         const newLine = {...updatedFormData?.lineItem , lineItemId : response?.lineItemId}
         setLineItemsData([...lineItemsData, newLine]);   
         setIsUploading(false)
         setActive(prevState => ({...prevState,saveLineItem:false}))
         setOpenLineItemForm(false)
         setTimeout(() => {setShowPopup(false);setMessage(null);},5000)
         setCurrencyTableData(null)

        } catch (error) {
          console.log('Error in fetching expense data for approval:', error.message);
          setIsUploading(false)
          setActive(prevState => ({...prevState,saveLineItem:false}))
          setLoadingErrorMsg(error.message);
        
          setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
        }}
        // Clear the selected file and reset the form data
        setSelectedFile(null);
        setFileSelected(false);
        // setFormDataValues({});
      };


/// Update Line Item
      
const handleUpdateLineItem = async (lineItem ,data,totalAmount,date) => {

  const lineItemId= lineItem.lineItemId;
  let allowForm = true
  const foundTotalAmtKey = totalAmountNames.find(key => Object.keys(lineItem).includes(key));
  const expenseHeaderId1= expenseHeaderId || miscellaneousData?.expenseHeaderId
  console.log('update line item ',data ,lineItem)
  const data1 = {lineItem:data}


  const firstKey = Object.keys(date)[0]

      if(!currencyTableData  && currencyTableData?.currencyFlag){
        setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: true, msg: `conversion not available!` } }));
        allowForm = false;
      }else {
        setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: false, msg: "" } }));
      }

      if(!['Travel Insurance'].includes(formDataValues?.['Category Name']) && (!date[firstKey] || date[firstKey]=== "")){
        setErrorMsg((prevErrors) => ({ ...prevErrors, dateErr: { set: true, msg: `Enter the ${firstKey}` } }));
        allowForm = false;
        console.log('date  is empty1' , date[firstKey])
      }else {
        setErrorMsg((prevErrors) => ({ ...prevErrors, dateErr: { set: false, msg: "" } }));
      }

  if (totalAmount === 0 || totalAmount === undefined || totalAmount ==="" ){
    setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: true, msg: `Enter ${foundTotalAmtKey}` } }));
    allowForm = false;
    // console.log('total amount  is empty' , totalAmount)
  } else {
    setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: false, msg: "" } }));
  }
  
  handleEmptyValues(); // Ensure that any undefined or null values in formDataValues are set to ""

  // const updatedFormData = {
    
  //   lineItem :{
  //     group:groupLimit,
  //     'Category Name':selectedCategory || "",
  //     ...formDataValues,
  //     'Document': selectedFile || "",
  //     'Currency':selectedCurrency || "",
  //     multiCurrencyDetails :currencyTableData,
  //     expenseLineAllocation :selectedAllocations,
  //   }
  // } 

  // setFormDataValues(updatedFormData);
  // console.log('filledLineItemDetails', updatedFormData);

if(allowForm){   
  try {
    setIsUploading(true)
    setActive(prevState => ({ ...prevState, saveLineItem: true }));
    const response = await editNonTravelExpenseLineItemsApi(tenantId,empId,expenseHeaderId1,lineItemId,data1);
    setShowPopup(true)
    setMessage(response?.message)
   console.log('line item saved successfully',response?.message)
  //  const newLine = {...updatedFormData?.lineItem , lineItemId : response?.lineItemId}
   setLineItemsData([...lineItemsData]);   
   setIsUploading(false)
   setActive(prevState => ({ ...prevState, saveLineItem: false }));
   setOpenLineItemForm(false)
   setSelectedLineItemId(null)
   setTimeout(() => {setShowPopup(false);setMessage(null);},5000)

  } catch (error) {
    console.log('Error in fetching expense data for approval:', error.message);
    setLoadingErrorMsg(error.message);
    setActive(prevState => ({ ...prevState, saveLineItem: false }));
    setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
  }
}
  
  // Clear the selected file and reset the form data
  setSelectedFile(null);
  setFileSelected(false);
  setFormDataValues({});
};      



/// Submit Expense || Draft Expense || Delete
      const handleSubmitOrDraft = async(action)=>{
        
        const expenseHeaderId1= expenseHeaderId || miscellaneousData?.expenseHeaderId ||expenseDataByGet?.expenseHeaderId
       let api ;
       if(action === "submit") {
        api =submitNonTravelExpenseApi(tenantId,empId, expenseHeaderId1)
       }else if (action === "save as draft"){
        api =saveAsDraftNonTravelExpense(tenantId,empId, expenseHeaderId1)
       }else if (action1 === "delete"){
         api = cancelNonTravelExpenseHeaderApi(tenantId, empId ,expenseHeaderId1)
       }

       try {
        setIsLoading(true);
       const response = await api
       console.log('responsemessage',response)
      
       setShowPopup(true)
       setMessage(response?.message )
       setIsLoading(false)
       setTimeout(() => {setShowPopup(false);setMessage(null)
        if(action === "submit" ||action === "delete" ){
          urlRedirection(`${DASHBOARD_URL}/overview`)}
          else{
            window.location.reload()
          }}
       ,5000);
         } catch (error) {
        setLoadingErrorMsg(`Please retry again : ${error.message}`); 
        setTimeout(() => {setIsLoading(false);setLoadingErrorMsg(null)},2000);
      }
      setAction(null)
      }

      const handleOpenModal=(id)=>{
        if(id==='upload'){
          setOpenModal('upload')
        }
        if(id==='form'){
          setOpenModal('form')
        }
       }

       const handleCurrency = (value)=>{
        const selectedCurrencyObject = currencyDropdown.find(currency => currency.shortName === value);
        setSelectedCurrency(selectedCurrencyObject)

        if(value === defaultCurrency?.shortName){
          setCurrencyTableData(null)
        }
        
       }


      const [ocrFileSelected , setOcrFileSelected]=useState(false)
      const [ocrSelectedFile , setOcrSelectedFile]=useState(null)
      const [ocrField , setOcrField]=useState(null)
      const handleOcrScan = async () => {
        // console.log('ocrfile from handle', ocrSelectedFile);
      
        const ocrData = new FormData();
          ocrData.append('categoryName', selectedCategory);
          ocrData.append('file', ocrSelectedFile);
      
        console.log('ocrfile from handle',ocrData)
      
           setIsUploading(prevState =>({...prevState, scan: true}));
          
          setTimeout(() => {
            setOpenLineItemForm(true) ;setOpenModal(null); setShowPopup(false);setIsUploading(false);
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
      
      // const handleOcrScan = async () => {
      //   // console.log('ocrfile from handle', ocrSelectedFile);
      
      //   const formData = new FormData();
      //     formData.append('file', ocrSelectedFile);
      
      //   console.log('ocrfile from handle',formData)
      
      //   try {

      //     setIsUploading(true);
          
      //     // Assuming ocrScanApi is an asynchronous function
      //     const response = await nonTravelOcrApi(formData);
      
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

  return (
    <div>
        {isLoading && <Error message={loadingErrorMsg}/>}
        {!isLoading  && 
        <div className=" w-full h-full relative bg-white-100 md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 ">
        
         <div className='w-full flex justify-center pl-10  md:justify-start lg:justify-start '>
        <div className="flex items-center cursor-pointer " onClick={()=>(urlRedirection(`${DASHBOARD_URL}/overview`))}>
        <img src={arrow_left} className="w-6 h-6"/>
       </div>
            <Icon/>
        </div>

        {/* Rest of the section */}
        <div className="w-full h-full mt-10 p-10 font-cabin tracking-tight">
        <div className='inline-flex p-2 gap-2 border-[1px] w-full rounded-md border-indigo-600 bg-indigo-50'> 
        <img src={validation_sym} width={16} height={16} alt='validation'/> 
        <span className='text-indigo-600'> If require category are unavailable, please contact the administrator.</span>
        </div>           
        <div className="flex flex-col lg:flex-row justify-between  items-center lg:items-end my-5 gap-2">
        {/* {categoryList?.length >=0  &&miscellaneousData?.categoryName ==  undefined&& */}
         <div className='  inline-flex gap-4'>
         <div className="h-[48px] w-[200px]">
       <Select
           title="Category"
           placeholder="Select Category"
           options={categoryList || []}
           currentOption={categoryList && categoryList[0]}
           // violationMessage="Your violation message" 
         //   error={{ set: true, message: "Your error message" }} 
           required={true} 
           submitAttempted={false}
           icon={chevron_down}
           onSelect={(value)=>setSelectedCategory(value)}
           />
          
 
           </div>
 
           <div className='mt-7'>
             <Button loading={isUploading} active={active} text="Generate" onClick={()=>handleGenerateExpense(selectedCategory)} disabled={!selectedCategory}/>
         </div>
       </div>
      {/* //  }   */}
       

{lineItemsData.length!=0 &&
  <div className="flex gap-4 ">
                    {cancel ?
                    (<div className="flex  flex-row-reverse">
                    <Button variant='fit' text='Cancel' onClick={()=>{setShowModal(true);setAction("delete")}}/>
                   </div>):
                    (<>
                    {expenseDataByGet?.expenseHeaderStatus !== 'pending settlement'  &&
                    <>
                     <div className="flex  flex-row-reverse">
                     <Button text='Save as Draft' onClick={()=>{handleSubmitOrDraft("save as draft")}}/>
                    </div>
                   
                    <div className="flex  flex-row-reverse">
                    <Button variant='fit' text='Submit' onClick={()=>{handleSubmitOrDraft("submit")}}/>
                   </div>
                   </>}
                   </>)}                                 
</div>
} 

            </div>
           
        
            <hr/>
            <HeaderComponent headerDetails={headerDetails} miscellaneousData={ miscellaneousData} expenseDataByGet={expenseDataByGet && expenseDataByGet}/>
           
     <hr/>
     {categoryElement.length>0 && <div className="w-fit my-5" >
           <AddMore text={"Add Line Item"} onClick={()=>handleOpenModal('form')}/>
     </div>}
    

{/* //----------- edit line item--start---------------------- */}

{lineItemsData && lineItemsData?.map((lineItem , index)=>(
   (lineItem.lineItemId === selectedLineItemId && categoryElement.length>0) ?
   
 <React.Fragment key={index}>

  <EditFormComponent
  index={index}
  setCurrencyTableData={setCurrencyTableData}
  active={active}
  isUploading={isUploading}
   handleUpdateLineItem={handleUpdateLineItem}
   currencyTableData={currencyTableData}
   setErrorMsg={setErrorMsg}
   errorMsg={errorMsg}
   expenseLineAllocation={expenseLineAllocation}
   categoryElement={categoryElement}
   key={index}
   lineItem={lineItem}
   handleSave={(updatedData) => handleSaveLineItem(updatedData, index)}
   defaultCurrency={defaultCurrency}
   handleConverter={handleConverter}/>

 </React.Fragment>
   
   
   :
<>
<div className='flex flex-col lg:flex-row border '>
  <div className='w-full lg:w-1/2 border'>
    <DocumentPreview initialFile={lineItem.Document}/>

  </div>
  <div className='w-full lg:w-1/2 border h-full' key={index}>  
     <div className=' h-[710px]'>
     <EditComponent index={index} lineItem={lineItem} handleEdit={handleEdit} isUploading={isUploading} active={active} handleDelete={handleDelete}/>
     </div> 
  </div>
  </div> 
</>  
   ))}
 



{/* //----------- edit line item--end---------------------- */}


               
     
         
        
{/* //---------save line item form----------------------- */}

{openLineItemForm &&
<div className='flex flex-col lg:flex-row border '>
  <div className='w-full lg:w-1/2 border  flex justify-center items-center '>
  {/* <div className=' border-[5px] min-w-[100%] h-fit min-h-[713px] flex justify-center items-center'>
    {selectedFile ? 
    (
        <div className="w-full  flex flex-col justify-center">
          <p>Selected File: {selectedFile.name}</p>
          
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
       <div className='w-full  flex justify-center items-center bg-white-100 opacity-30'>
        <img src={file_icon} className='w-40 h-40'/>
      </div>
      }
    </div> */}
  <DocumentPreview selectedFile={ocrSelectedFile ||selectedFile}/>
  </div>
  <div className='w-full lg:w-1/2 border lg:h-[715px] overflow-y-auto scrollbar-hide'>
  {openLineItemForm &&
  <> 
  <div className="w-full flex items-center justify-start h-[52px] border px-4 ">
      <p className="text-zinc-600 text-medium font-semibold font-cabin capitalize">   Category -{selectedCategory}</p>
    </div>
          
<div  className="w-full border flex flex-wrap items-start justify-between  px-2">
  {expenseLineAllocation.length>0 && expenseLineAllocation.map((allItem , allIndex )=>(
    <div className='w-full px-2 flex justify-center py-2' key={allIndex}>
    <Select
    error={errorMsg[allItem?.headerName]}
    title={titleCase(allItem.headerName ?? "")}
    options={allItem.headerValues}
    placeholder='Select Allocations'
    onSelect={(value)=>onAllocationSelection(value,allItem.headerName)}/>  
    </div> 
  ))}

{categoryElement && categoryElement.map((element, index) => {
    return (
<React.Fragment key={index}>
 <div className='h-[73px] my-2'>        
    <Input 
      placeholder={titleCase(`Enter ${element.name}`)}
      initialValue={formDataValues[element.name]}
      // initialValue={ocrValue[element.name]}
      title={element.name}
      // error={totalAmountNames.includes(element?.name)? errorMsg.totalAmount : null}
      error={(totalAmountNames.includes(element?.name) && errorMsg.totalAmount) || (dateForms.includes(element?.name) && errorMsg.dateErr )}
      // error={element.name === "Total Amount" || element.name === "Total Fare" ? errorMsg.totalAmount : null}
      type={element.type === 'date' ? 'date' : element.type === 'amount' ? 'number' : 'text'}
      onChange={(value) => handleInputChange(element.name,value)}
    />
</div>  
</React.Fragment>);
  })}
</div>  

<div className='flex flex-col px-2 py-2 justify-between'>
  <div className={`flex justify-between ${currencyTableData?.message !== undefined ? 'md:flex-col' : 'md:flex-row'}   flex-col`}>
<div className='flex flex-row items-center'>
<div className="h-[48px] w-[100px]  mb-10 mr-28 mt-[-10px] ">
           <Select
           currentOption={defaultCurrency?.shortName}
           title="Currency"
           error={errorMsg.currencyFlag}
           placeholder="Select Currency"
           options={currencyDropdown.map(item=>item.shortName)}
           onSelect={(value)=>{handleCurrency(value)}}
           />
</div>


<div className='w-fit' >
{ selectedCurrency == null || selectedCurrency?.shortName !== defaultCurrency?.shortName &&


<ActionButton disabled={active?.convert} loading={active?.convert} active={active.convert} text='Convert' onClick={()=>handleConverter(totalAmount , selectedCurrency)}/>

}
</div>

</div>



</div>
<div >
{currencyTableData?.currencyFlag  ? 
<div className=''>
<div className="min-w-[200px] w-full  h-auto flex-col justify-start items-start gap-2 inline-flex mb-3">
<div className="text-zinc-600 text-sm font-cabin">Coverted Amount Details :</div>
<div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin  ">
  <div className="w-full h-full decoration:none  rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600">
    <div className={`sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100  border rounded-md`}>
      <div className="text-[16px] font-semibold text-neutral-600">Total Amount </div> 
      <div className="text-neutral-600 font-cabin">{currencyTableData?.convertedCurrency} {currencyTableData?.convertedAmount.toFixed(2)}</div>
  </div>
  </div>
</div>
</div>
</div> 

//--------
  : 
  currencyTableData?.message !== undefined &&
  <div className=' flex   items-center justify-center gap-2 border-[1px] px-4 py-2 rounded border-yellow-600  text-yellow-600'>
    <img src={validation_symb_icon} className='w-5 h-5'/>
  <h2 className=''>{currencyTableData?.message}</h2>
  </div>
}
</div>


<div className='flex w-fit mb-4'>
  <Select 
  //currentOption={defaultCurrency}
   title="Mode of Payment"
   name="mode of payment"
   placeholder="Select MOD"
   options={['Credit Card',"Cash",'Debit Card','NEFT']}
   onSelect={(value)=>{setFormDataValues({...formDataValues,['Mode of Payment']:value})}}/>
</div>
<div className="w-full   flex items-center justify-center border-[1px] border-gray-50">
<Upload 
  selectedFile={selectedFile}
  setSelectedFile={setSelectedFile}
  fileSelected={fileSelected}
  setFileSelected={setFileSelected}
/>
</div>
</div>         
<div className="w-full px-2 py-4" >
  <Button 
   disabled={isUploading} 
   loading={isUploading} 
   active={active.saveLineItem}
   text="Save" onClick={handleSaveLineItem} />
</div>
</>   
}
</div>
</div>}


{/* //---------save line item form end----------------------- */}

           {openModal==='form' && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 " >
                <div className='z-10 max-w-4/5  md:mx-0 mx-4   sm:w-2/5 w-full min-h-4/5 max-h-4/5  bg-white-100  rounded-lg shadow-md'>
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
                            <Button variant='' text='Manually' onClick={()=>{setOpenLineItemForm(true);handleModal()}} />
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            }

{/* {openModal==='upload' && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 " >
                <div className='z-10 max-w-5/5 w-2/5 min-h-4/5 max-h-4/5  bg-white-100  rounded-lg shadow-md'>
                  <div onClick={()=>{setOpenModal(null);setOcrSelectedFile(null);setOcrFileSelected(false)}} className=' w-10 h-10 flex mr-5 mt-5 justify-center items-center float-right   hover:bg-red-300 rounded-full'>
                      <img src={cancel} className='w-8 h-8'/>
                  </div>
                    <div className="p-10 ">
                     
                      <div className="flex flex-col justify-center items-center">
                       

                       
                        {ocrFileSelected ? 
                        
                        <div className="w-full  flex flex-col justify-center items-center h-[500px]  overflow-x-auto">
                        <p>Document Name: {ocrSelectedFile.name}</p>
                        <Button  text='reupload' onClick={()=>{setOcrFileSelected(false);setOcrSelectedFile(null)}}/>
                    
                        {ocrSelectedFile.type.startsWith('image/') ? (
                          
                          <img
                            src={URL.createObjectURL(ocrSelectedFile)}
                            alt="Preview"
                            className=' w-full'
                            
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

                         <Button loading={isUploading} variant='fit' text='Scan' onClick={handleOcrScan} />
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
            } */}

{openModal==='upload' && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none " >
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
        
       
        </div>
      }
      <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>

      <Modal 
      skipable={true}
      showModal={showModal} 
      setShowModal={setShowModal}
      handleConfirm={handleSubmitOrDraft} 
      handleModalVisible={handleModalVisible}
      content={<div> Are you sure about deleting it? </div>}/>
    </div>
  )
}

export default CreateNonTraveExpense


function EditComponent({index, lineItem, handleEdit ,handleDelete,isUploading,active}) {
  const excludedKeys = ['Category Name','expenseLineId','Currency', 'Document', 'expenseLineAllocation', 'multiCurrencyDetails', 'lineItemStatus','lineItemId', '_id'];
  const includedKeys =['Total Fair','Total Fare','Total Amount',  'Subscription Cost', 'Cost', 'Premium Cost'];
  
  return (
    <>
    <div className='flex flex-col justify-between  h-[710px] overflow-y-auto scrollbar-hide'>
    <div className="w-full flex justify-between items-center h-12  px-4 border-dashed border-b-[1px] border-slate-500 py-4">
      <p className="text-zinc-600 text-medium font-semibold font-cabin">Sr. {index + 1} </p>
      <p className="text-zinc-600 text-medium font-semibold font-cabin capitalize">   Category -{lineItem?.['Category Name']}</p>
    </div>  
    <div className=''>
     <div className=" px-4 py-2">
     {lineItem?.expenseLineAllocation &&
        lineItem?.expenseLineAllocation?.map((allocation, index) => (
          <div key={index} className="min-w-[200px] min-h-[52px] ">
            <div className="text-zinc-600 text-sm font-cabin capitalize">{allocation.headerName}</div>
            <div className="w-full h-12 bg-white items-center flex border border-neutral-300 rounded-md">
              <div>
                <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin px-6 py-2">
                  {allocation.headerValue}
                </div>
              </div>
            </div>

          </div> 
        ))}
     </div>
      <div className="w-full border-dashed border-slate-500 border-b-[1px] flex flex-wrap items-start justify-between py-4 px-4 gap-y-4">
         {/* Mapping lineItemAllocation */}
        
      
    
   
{Object.entries(lineItem).map(([key, value]) => (
  !excludedKeys.includes(key) && (
    <React.Fragment key={key}>
      <div className='min-w-[200px] min-h-[52px] relative '>
        {key !== 'Currency' && (
          <div className="text-zinc-600 text-sm font-cabin">
            {titleCase(key)}
          </div>
        )}

        {/* Div with border styling */}
        <div className="w-full h-[48px]  items-center bg-white justify-start flex border border-neutral-300 rounded-md">
          {/* Displaying key and value */}
          <div key={key} className="text-neutral-700 w-full h-10 text-sm font-normal font-cabin px-6 py-2">
            {includedKeys.includes(key) ? `${lineItem['Currency']?.shortName} ${value} ` : ` ${key === 'group' ? value?.group : value}`}
          </div>
        </div>
        {includedKeys.includes(key) && ((lineItem?.multiCurrencyDetails?.convertedAmount || value) >( lineItem?.group?.limit || 0) ) && <div  className=" w-[200px] h-full line-clamp-2 text-xs text-yellow-600 font-cabin">{lineItem?.group?.message}</div>}
      </div>
    </React.Fragment>
  )
))}
</div>
      <div>
      {lineItem?.multiCurrencyDetails &&
<div className='px-4'>

<div className="min-w-[200px] w-full  h-auto flex-col justify-start items-start gap-2 inline-flex mb-3">
<div className="text-zinc-600 text-sm font-cabin">Coverted Amount Details :</div>
<div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin  ">
  <div className="w-full h-full decoration:none  rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600">
    <div className={`sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100  border rounded-md`}>
      <div className="text-[16px] font-semibold text-neutral-600">Total Amount </div> 
      <div className="text-neutral-600 font-cabin">{lineItem?.multiCurrencyDetails?.defaultCurrency} {lineItem?.multiCurrencyDetails?.convertedAmount?.toFixed(2)}</div>
  </div>

  </div>

</div>


</div>
</div>}
        </div>
        </div>
 <div className='flex flex-row gap-4 items-center px-4 py-2 '>
      <div className="w-fit">
        <Button text="Edit" disabled={isUploading} loading={isUploading} active={(active?.edit?.id === lineItem?.lineItemId ? active?.edit?.visible : false)} onClick={() => handleEdit(lineItem?.lineItemId , lineItem?.['Category Name'])} />
      </div>
      <div className="w-fit  ">
        <Button text="Delete"  disabled={isUploading} loading={isUploading} active={(active?.delete?.id === lineItem?.lineItemId ? active?.delete?.visible : false)} onClick={() => handleDelete(lineItem?.lineItemId)} />
      </div>
  </div>   
  </div> 
    </>
  );
}









function  EditFormComponent ({index,setCurrencyTableData,active,isUploading,handleUpdateLineItem ,currencyTableData ,errorMsg,setErrorMsg, lineItem, categoryElement, handleSave,expenseLineAllocation,handleConverter ,defaultCurrency}) {
  const [selectedFile  , setSelectedFile]=useState(null)
  const [fileSelected ,setFileSelected]= useState(false)
  const [selectedAllocations , setSelectedAllocations]=useState([])
  const [selectedCurrency, setSelectedCurrency]=useState(null)
  const [initialFile , setInitialFile]=useState(null)
  const [totalAmount , setTotalAmount]=useState(0)
  const [isMultiCurrency,setIsMultiCurrency]=useState(true);
  const [date , setDate]=useState("")
  
const groupLimit = lineItem?.group
  console.log('lineitem', lineItem.expenseLineAllocation)
const [formData, setFormData] = useState(lineItem);
 console.log('object',categoryElement)
 console.log('line item from edit form compoent', lineItem)

 
 const  handleCurrenctySelect= (shortName)=>{

  const selectedCurrencyObject = currencyDropdown.find(currency => currency.shortName === shortName);
  setSelectedCurrency(selectedCurrencyObject)
  if(shortName === defaultCurrency?.shortName){
    setCurrencyTableData(null)
    setFormData((prevState)=>({...prevState,multiCurrencyDetails:null}))
  }
  handleChange( 'Currency' , selectedCurrencyObject)

  if(shortName !== defaultCurrency?.shortName){
    setIsMultiCurrency(true)
    

  }else{
    setIsMultiCurrency(false)

  }
}
  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));

    //  if (key === 'Total Amount' || key === 'Total Fair' || key === "Total Fare") {
    //             setTotalAmount(value);
    //           }
    //   if((key === "Total Fare" ||key === 'Total Amount' || key === 'Total Fair' )){
    //     const limit = groupLimit?.limit 
    //     if(value>limit){
    //       setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:true,msg:groupLimit?.message}}))
    //     }else{
    //       setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:false,msg:groupLimit?.message}}))
    //     }
    //   }
    if (totalAmountNames.includes(key)) {
      setTotalAmount(value);
    }
    if (dateForms.includes(key)) {
      setDate({[key]:value});
    }
  
    if (totalAmountNames.includes(key)) {
      const limit = groupLimit?.limit;
      const isExceedingLimit = value > limit;
      
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        totalAmount: { set: isExceedingLimit, msg: groupLimit?.message }
      }));
    }
  };
  console.log('selected allocation from update',selectedAllocations)
  const onAllocationSelection = (option, headerName) => {
    // Create a new allocation object
    const updatedExpenseAllocation = selectedAllocations.map(item => {
      if (item.headerName === headerName) {
        return {
          ...item,
          headerValue: option
        };
      }
      return item;
    });
    setFormData(({
          ...formData,
          expenseLineAllocation: updatedExpenseAllocation,
        }))
    setSelectedAllocations(updatedExpenseAllocation);
  };
  // const onAllocationSelection = (option, headerName) => {
  //   // Create a new allocation object
   
  //   const newAllocation = { headerName: headerName, headerValue: option || "" };
  //   setSelectedAllocations((prevAllocations) => [...prevAllocations, newAllocation]);
  // };

  // const onAllocationSelection = (option, headerName ) => {
  //   // Check if an allocation with the same headerName already exists
  //   const existingAllocationIndex = selectedAllocations.findIndex(allocation => allocation.headerName === headerName);
  //   // Create a new allocation object
  //   const newAllocation = { headerName: headerName, headerValue: option || "" };
  //   if (existingAllocationIndex !== -1) {
  //     // If allocation with the same headerName exists, replace it
  //     setSelectedAllocations(prevAllocations => {
  //       const updatedAllocations = [...prevAllocations];
  //       updatedAllocations.splice(existingAllocationIndex, 1, newAllocation);
  //       return updatedAllocations;
  //     });
  //   } else {
  //     // Otherwise, add the new allocation
  //     setSelectedAllocations(prevAllocations => [...prevAllocations, newAllocation]);
  //   }
  // };
  

  useEffect(()=>{
    if (fileSelected) {
      setFormData({
        ...formData,
        ['Document']: selectedFile,
      });
    }
  },[(fileSelected)])

  useEffect(()=>{
    setFormData({
      ...formData,
      ['multiCurrencyDetails']: currencyTableData,
    });
  },[currencyTableData])

  // useEffect(()=>{
  //   if(selectedAllocations.length > 0 ) {
  //   setFormData(({
  //     ...formData,
  //     expenseLineAllocation: selectedAllocations,
  //   }))
  // }

  // },[selectedAllocations])
  // useEffect(()=>{
  //   if(selectedAllocations.length > 0 ) {
  //   setFormData(({
  //     ...formData,
  //     expenseLineAllocation: selectedAllocations,
  //   }))
  // }

  // },[selectedAllocations])


const lineItemData= {...formData}
  // const handleUpdateLineItem = () => {
  //   console.log('Selected Allocations:', selectedAllocations);
  //   console.log('Updated FormData:', formData);
  //   // handleSave(formData);
  //   // const lineItem1= setFormData()
  //   console.log('updated line item',{
      

  //   })
  // };
  
  useEffect(() => {
    // Set the initial file when the component is mounted
    setInitialFile(lineItem.Document);
    const matchedKey = totalAmountNames.find(key => lineItem?.[key]);
    const totalAmount = matchedKey ? lineItem[matchedKey] : null;
    setTotalAmount(totalAmount);
    
    const foundDateKey = dateForms.find(key => Object.keys(lineItem).includes(key));
    const dateValue = foundDateKey ? lineItem[foundDateKey] : undefined;
    setDate({[foundDateKey]:dateValue})
    setSelectedAllocations(lineItem?.expenseLineAllocation)

    
    // setTotalAmount(lineItem?.['Total Amount'] || lineItem?.['Total Fair'])
  }, []);

  return (
   <>
 <div className='flex flex-col lg:flex-row border '>
  <div className='w-full lg:w-1/2 border  flex justify-center items-center  '>
   <DocumentPreview selectedFile={selectedFile} initialFile={initialFile}/>
  </div>
  <div className='w-full lg:w-1/2 border lg:h-[710px] overflow-y-auto scrollbar-hide'>     
  <div className="w-full flex justify-between items-center h-12  px-4 border-dashed border-b-[1px] border-slate-500 py-4">
      <p className="text-zinc-600 text-medium font-semibold font-cabin">Sr. {index +1} </p>
      <p className="text-zinc-600 text-medium font-semibold font-cabin capitalize">   Category -{lineItem?.['Category Name']}</p>
    </div> 
<div  className="w-full border-dashed border-b-[1px] border-slate-500 flex flex-wrap items-start justify-between py-4 px-4">
 
  {expenseLineAllocation?.length>0 && expenseLineAllocation?.map((allItem , allIndex )=>(
   
      <div className='w-full px-2 flex justify-center py-2' key={allIndex}>
      <>
       <Select
       currentOption={lineItem?.expenseLineAllocation.find(item => item.headerName === allItem.headerName)?.headerValue ?? ''}
       title={titleCase(allItem.headerName ?? '')}
       options={allItem.headerValues}
       placeholder='Select Allocations'
       onSelect={(value) => onAllocationSelection(value, allItem.headerName)}
     />
     </>
    
</div> 
    
   
  ))} 
      {categoryElement && categoryElement.map((field) => (
        <div key={field.name} >
          <Input
            title={field.name}
            placeholder={titleCase(`Enter ${field.name}`)}
            type={field.type === 'date' ? 'date' : 'text'}
            name={field.name}
            initialValue={formData[field.name]}
            onChange={(value) => handleChange(field.name, value)}
            // error={field.name === "Total Amount" ? errorMsg.totalAmount : null}
            error={(totalAmountNames.includes(field?.name) && errorMsg.totalAmount) || (dateForms.includes(field?.name) && errorMsg.dateErr )}
            className='mt-1 p-2 w-full border rounded-md'
          />  
        </div>  
      ))}
  <div className='flex flex-col  justify-between w-full mt-4'>
<div className={`flex justify-between ${currencyTableData?.message !== undefined ? 'md:flex-col' : 'md:flex-row'}   flex-col`}>
{/* <div className='flex sm:flex-row flex-col justify-between'> */}
<div className='flex flex-row items-center'>
<div className="h-[48px] w-[100px]  mb-10 mr-28 mt-[-10px] ">
           <Select
           error={errorMsg.currencyFlag}
           currentOption={lineItem['Currency']?.shortName}
           title="Currency"
           name="currency"
           placeholder="Select Currency"
           options={currencyDropdown.map(item=>item.shortName)}
           onSelect={(value) =>{ handleCurrenctySelect(value)}}
           />
</div>


<div className='w-fit'>
{selectedCurrency == null ||selectedCurrency.shortName !== defaultCurrency.shortName &&


<ActionButton loading={isUploading} active={active.convert} text='Convert'  onClick={()=>handleConverter(totalAmount,selectedCurrency)}/>

}
</div>
</div>
<div>

</div>


</div>
<div>
{( currencyTableData?.currencyFlag && currencyTableData!==null) ? 
<div className=''>
<div className=''>

<div className="min-w-[200px] w-full  h-auto flex-col justify-start items-start gap-2 inline-flex mb-3">
<div className="text-zinc-600 text-sm font-cabin">Coverted Amount Details :</div>
<div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin  ">
  <div className="w-full h-full decoration:none  rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600">
    <div className={`sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100  border rounded-md`}>
      <div className="text-[16px] font-semibold text-neutral-600">Total Amount </div> 
      <div className="text-neutral-600 font-cabin">{currencyTableData?.convertedCurrency} {currencyTableData?.convertedAmount.toFixed(2)}</div>
  </div>

  </div>

</div>


</div>
</div> 
</div>
  : 
  currencyTableData?.message !== undefined &&
  <div className='flex items-center justify-center gap-2 border-[1px] px-4 py-2 rounded border-yellow-600  text-yellow-600'>
    <img src={validation_symb_icon} className='w-5 h-5'/>
  <h2 className=''>{currencyTableData?.message}</h2>
  </div>
}
{isMultiCurrency && lineItem?.multiCurrencyDetails && currencyTableData ==null  &&

<div className=''>

<div className="min-w-[200px] w-full  h-auto flex-col justify-start items-start gap-2 inline-flex mb-3">
<div className="text-zinc-600 text-sm font-cabin">Coverted Amount Details :</div>
<div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin  ">
  <div className="w-full h-full decoration:none  rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600">
    <div className={`sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100  border rounded-md`}>
      <div className="text-[16px] font-semibold text-neutral-600">Total Amount </div> 
      <div className="text-neutral-600 font-cabin">{lineItem?.multiCurrencyDetails?.convertedCurrency} {lineItem?.multiCurrencyDetails?.convertedAmount?.toFixed(2)}</div>
  </div>
</div>

</div>


</div>
</div> }
</div>
<div className='flex w-fit mb-4'>
  <Select 
   currentOption={lineItem['Mode of Payment']}
   title="mode of payment"
   name="mode of payment"
   placeholder="Select MOD"
   options={['Credit Card',"Cash",'Debit Card','NEFT']}
   onSelect={(value)=>{handleChange( 'Mode of Payment',value)}}
   />
</div>
{/* <div>
{currencyTableData?.currencyFlag ? 
<h2>Coverted Amount: {currencyTableData?.convertedAmount} ?? hello</h2> 
  : 
<h2 className='text-red-500'>{errorMsg.currencyFlag.msg}</h2>
}
</div> */}



<div className="w-full   flex items-center justify-center border-[1px] border-gray-50 ">
<Upload 
  selectedFile={selectedFile}
  setSelectedFile={setSelectedFile}
  fileSelected={fileSelected}
  setFileSelected={setFileSelected}
  />
</div>

</div>  


    </div>
      <div className="w-full px-4 py-2">
        <Button loading={isUploading}  active={active.saveLineItem} text="Update" onClick={()=>handleUpdateLineItem(lineItem, lineItemData,totalAmount,date)} />
      </div>
    </div>
</div>
    
      </>
   
  );
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
        <img src={!initialFile && file_icon || initialFile} className='w-40 h-40'/>
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
        <img src={initialFile} alt="Initial Document Preview" className='w-40 h-40' />
      )}
      </div>
      }
    </div>
  )
}

const  HeaderComponent =({headerDetails ,miscellaneousData , expenseDataByGet}) =>{
  const miscellaneousData1 = miscellaneousData
  console.log(miscellaneousData1)
  console.log(expenseDataByGet)

  return(
    <div className='my-5'>

          {/* <div> 
                <div className="flex gap-2 font-cabin text-xs tracking-tight ">
                    <p className="w-[150px] text-neutral-600">Expense Header Number:</p>
                    <p className="text-neutral-700">{(miscellaneousData1?.expenseHeaderNumber || expenseDataByGet?.expenseHeaderNumber) ?? '-'}</p>
                </div>
                <div className="flex gap-2 font-cabin text-xs tracking-tight ">
                    <p className="w-[150px] text-neutral-600">Default Currency:</p>
                    <p className="text-neutral-700">{(miscellaneousData1?.defaultCurrency?.shortName || expenseDataByGet?.defaultCurrency?.shortName) ?? '-'}</p>
                </div>
                <div className="flex gap-2 font-cabin text-xs tracking-tight">
                    <p className="w-[150px] text-neutral-600">Category :</p>
                    <p className="text-neutral-700">{miscellaneousData1?.categoryName ?? '-'}</p>
                </div> 
                <div className="flex gap-2 font-cabin text-xs tracking-tight">
                    <p className="w-[150px] text-neutral-600">Status :</p>
                    {((miscellaneousData1?.expenseHeaderStatus || expenseDataByGet?.expenseHeaderStatus) !== null) && (
  <p className="text-neutral-700 capitalize">
    {miscellaneousData1?.expenseHeaderStatus || expenseDataByGet?.expenseHeaderStatus}
  </p>
)}


                </div> 
                
          </div>   */}
    <div className="flex md:flex-row flex-col gap-2 justify-between w-full  ">
  <div className=" md:w-1/5 w-full  flex  border-[1px] border-slate-300 rounded-md flex-row items-center gap-2 p-2 ">
    <div className="bg-slate-200 rounded-full p-4 shrink-0 w-auto">
      <img src={user_icon} className="w-[22px] h-[22px] "/>
      </div>
<div className='font-cabin '>
      <p className=" text-neutral-600 text-xs ">Created By</p>
     {((miscellaneousData1?.expenseHeaderStatus || expenseDataByGet?.expenseHeaderStatus) !== null) && (
  <p className="text-purple-500 capitalize">
    {headerDetails?.name  ||miscellaneousData1?.expenseHeaderStatus || expenseDataByGet?.expenseHeaderStatus}
  </p>
)}
</div>
  </div>
  <div className="   flex md:w-3/5 w-full border-[1px] border-slate-300 rounded-md flex-row items-center gap-2 p-2 ">
    <div className="bg-slate-200 rounded-full p-4 shrink-0 w-auto ">
      <img src={receipt} className="w-5 h-5  "/>
      </div>
  <div className="flex flex-row justify-between w-full gap-2 ">
     
      <div className=' flex-1 font-cabin  px-2 '>
      <p className=" text-neutral-600 text-xs line-clamp-1">Expense Header No.</p>
     
      <p className="text-purple-500 text-medium font-medium">{(miscellaneousData1?.expenseHeaderNumber || expenseDataByGet?.expenseHeaderNumber) ?? 'not available'}</p>
      </div>

      <div className=' flex-1 font-cabin  px-2  '>
      <p className=" text-neutral-600 text-xs line-clamp-1">Status</p>
     
      <p className="text-purple-500 pl-3  text-medium font-medium capitalize">{(miscellaneousData1?.expenseHeaderStatus || expenseDataByGet?.expenseHeaderStatus) ?? ` ${' - '}`}</p>
      
      </div>
      
      </div> 
       
  </div>
  <div className="   flex md:w-1/5 w-full border-[1px] border-slate-300 rounded-md flex-row items-center gap-2 p-2 ">

    <div className="bg-slate-200 rounded-full p-4 shrink-0 w-auto">
      <img src={briefcase} className="w-4 h-4 "/>
      </div>
  
      <div className='font-cabin '>
      <p className=" text-neutral-600 text-xs ">Default Currency</p>
      <p className="text-purple-500 text-medium font-medium">{(headerDetails?.defaultCurrency?.shortName||miscellaneousData1?.defaultCurrency?.shortName || expenseDataByGet?.defaultCurrency?.shortName) ??  "not available"}</p>
      </div>
     
      
  </div>
 
 
   
        
   
       
   
</div>   
            
           </div>
  )
}
// import React ,{useState,useEffect,useRef}from 'react'
// import { cancelNonTravelExpenseHeaderApi, cancelNonTravelExpenseLineItemApi,  editNonTravelExpenseLineItemsApi, getCategoryFormElementApi, getNonTravelExpenseLineItemsApi, getNonTravelExpenseMiscellaneousDataApi, nonTravelOcrApi, postMultiCurrencyForNonTravelExpenseApi, postNonTravelExpenseLineItems, saveAsDraftNonTravelExpense, submitNonTravelExpenseApi, submitOrSaveAsDraftApi } from '../utils/api'
// import { useParams } from 'react-router-dom'
// import Error from '../components/common/Error'
// import Button from '../components/common/Button'
// import PopupMessage from '../components/common/PopupMessage'
// import Icon from '../components/common/Icon'
// import Input from '../components/common/Input'
// import { briefcase, cancel, cancel_round, chevron_down, file_icon, money, receipt, user_icon, validation_sym, validation_symb_icon } from '../assets/icon'
// import {nonTravelExpenseData} from '../dummyData/nonTravelExpens'
// import { titleCase, urlRedirection } from '../utils/handyFunctions'
// import Upload from '../components/common/Upload'
// import Select from '../components/common/Select'
// import ActionButton from '../components/common/ActionButton'
// import Modal from '../components/common/Modal'

// ///Cuurency on Save you have to save object of currency
// const currencyDropdown = [
//   { fullName: "Argentine Peso", shortName: "ARS", symbol: "$", countryCode: "AR" },
//   { fullName: "Australian Dollar", shortName: "AUD", symbol: "A$", countryCode: "AU" },
//   { fullName: "United States Dollar", shortName: "USD", symbol: "$", countryCode: "US" },
//   {
//     "fullName": "Bangladeshi Taka",
//     "shortName": "BDT",
//     "symbol": "৳",
//     "countryCode": "BD"
//   },
//   {"countryCode": "IN","fullName": "Indian Rupee","shortName": "INR","symbol": "₹"}
// ];
// const totalAmountNames = ['Total Fare','Total Amount',  'Subscription cost', 'Cost', 'Premium Cost'];
// const dateForms = ['Invoice Date', 'Date', 'Visited Date', 'Booking Date','Bill Date'];

// const CreateNonTraveExpense = () => {
  
//   const {tenantId,empId,expenseHeaderId,cancel} =useParams()


//   const DASHBOARD_URL=`http://localhost:8080/${tenantId}/${empId}`
  

 
//   const [headerDetails , setHeaderDetails]=useState(null)
//   const [categoryList , setCategoryList]=useState(null);
//       //this is for miscellaneous data
//     //for get categories , dashboard to non tr expense ms 

//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           const response = await getNonTravelExpenseMiscellaneousDataApi(tenantId, empId,);
//           setCategoryList(response?.reimbursementExpenseCategory || [])
//           setHeaderDetails({
//             name: response?.employeeName,
//             defaultCurrency : response?.defaultCurrency
//           })
         
//           setIsLoading(false);
//           console.log(response.data)
//           console.log('expense data for approval fetched.');
//         } catch (error) {
//           console.log('Error in fetching expense data for approval:', error.message);
//           setLoadingErrorMsg(error.message);
//           setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
//         }
//       };
  
//       fetchData(); 
  
//     }, [tenantId,empId]);

  
  


// ///this is get category list from dummy data
//   //  useEffect(()=>{
//   //   const getCategoryList = categories &&  categories.expenseCategories
//   //   console.log('getCategoryList',getCategoryList)
//   //   setCategoryList(getCategoryList)
//   //  },[])


//   //with dummy data
//   // useEffect(()=>{
//   //   const categoriesData = reimbursementAfterCategory
//   //   const expenseLineAllocation = categoriesData?.reimbursementAllocation
//   //   setExpenseLineAllocation(expenseLineAllocation)
//   // },[])

 

//     const formData = [
//               // { name:'Bill Date',type:'date'},
//               // { name:'Bill Number',type:'numeric'},
//               // { name:'Vendor Name',type:'text'},
//               // { name: 'Description', type: 'text' },
//               // { name: 'Quantity', type: 'numeric' },
//               // { name: 'Unit Cost', type: 'numeric' },
//               // { name: 'Tax Amount', type: 'numeric' },
//               // { name: 'Total Amount', type: 'numeric' },        
//     ];

//     ///now this is dummy after data will set by ocr
//     const ocrValue = {
//       //  'Bill Date' :'2023-12-12',
//       //  'Bill Number' : 'sdfsd',
//       //  'Vendor Name': 'Hello Vendor',
//       //  'Description' : 'Hello Description',
//       //  'Quantity' : '23', 
//       //  'Unit Cost' : '23',
//       //  'Tax Amount' : '45',
//       // 'Total Amount': '2500'     
//     }

//     const [expenseHeaderId1 , setExpenseHeaderId1]=useState(null); //from miscellaneous data
//     const [expenseLineAllocation ,setExpenseLineAllocation]=useState(null)
//     //const [categoryElement , setCategoryElement]=useState([...formData]); // this is for dummy
//     const [categoryElement , setCategoryElement]=useState([]); //

//     const [groupLimit,setGroupLimit]= useState({
//       group:'',
//       limit: 0,
//       message:''
//     })

//     const [totalAmount, setTotalAmount] = useState(''); ///for handling convert 
//     const [date ,setDate]= useState('')
//     const [currencyTableData, setCurrencyTableData] = useState(null);
//     const [lineItemsData,setLineItemsData]=useState([]) //for get all line item
//     const [formDataValues, setFormDataValues] = useState(); 

//     const [selectedLineItemId, setSelectedLineItemId]=useState(null)
//     const [showModal , setShowModal]= useState(false)
//     const [action1 , setAction] = useState(null)
//     const [isLoading,setIsLoading]=useState(true)
//     const [isUploading , setIsUploading]=useState(false)
//     const [active , setActive]=useState({
//       edit:{visible:false,id:null},
//       saveLineItem:false,
//       convert:false,
//       delete:{visible:false,id:null},
//       deleteHeader:false,
//       saveAsDraft:false,
//       submit:false
//     })
    
//     const [loadingErrorMsg, setLoadingErrorMsg]=useState(null)
//     const [errorMsg,setErrorMsg]=useState({
//       currencyFlag:{set:false,msg:""},
//       totalAmount:{set:false,msg:""} //"Total Amount"

//     })

//     const [openLineItemForm,setOpenLineItemForm]=useState(false)
//     const [openModal,setOpenModal]=useState(null);
//     const [showPopup ,setShowPopup]=useState(false);
//     const [message,setMessage]=useState(null)  

    


// const handleModalVisible=()=>{
//   setShowModal(!showModal)
// }


// //for save selected expenseLineAllocation allocation in array
// const [selectedAllocations , setSelectedAllocations]=useState([])//for saving expenseLineAllocation on  line item   


// const onAllocationSelection = (option, headerName) => {
//   // Check if an allocation with the same headerName already exists
//   const existingAllocationIndex = selectedAllocations.findIndex(allocation => allocation.headerName === headerName);

//   // Create a new allocation object
//   const newAllocation = { headerName: headerName, headerValue: option || "" };

//   if (existingAllocationIndex !== -1) {
//     // If allocation with the same headerName exists, replace it
//     setSelectedAllocations(prevAllocations => {
//       const updatedAllocations = [...prevAllocations];
//       updatedAllocations.splice(existingAllocationIndex, 1, newAllocation);
//       return updatedAllocations;
//     });
//   } else {
//     // Otherwise, add the new allocation
//     setSelectedAllocations(prevAllocations => [...prevAllocations, newAllocation]);
//   }
// };


// const [selectedCategory , setSelectedCategory]= useState(null) 
// const [selectedCurrency , setSelectedCurrency]= useState(null)  
// const [defaultCurrency , setDefaultCurrency]=useState(null)





//     // const handleCategoryChange=(value)=>{
    
//     // setSelectedCategory(value)
//     // console.log('selectedCategory',value)
//     // setFormDataValues({...formDataValues,currencyName:value})
//     // }
  
//     ///Handle Edit
//     const handleEdit=(id,category)=>{
//       setIsUploading(true)
//       setActive(prevState => ({ ...prevState, edit: { visible:true,id:id}}));
//       setSelectedLineItemId(id)
//       console.log("lineItemId for edit",id ,category)
//       setSelectedCategory(category)
//       console.log('category for edit',)
//       handleGenerateExpense (category)
//       setIsUploading(false)
//       setActive(prevState => ({ ...prevState, edit: { visible:false,id:null}}));
//   }

//   //Handle Delete

//   const handleDelete=async(lineItemId)=>{
//     const expenseHeaderIds = expenseHeaderId || expenseHeaderId1 || expenseHeaderIdBySession
//     const lineItemIds = {lineItemIds :[lineItemId]}

//     try {
//       setIsUploading(true)
//       setActive(prevState => ({ ...prevState, delete: { visible:true,id:lineItemId}}));
//       const response = await cancelNonTravelExpenseLineItemApi(tenantId,empId,expenseHeaderIds,lineItemIds);
//       setShowPopup(true)
//       setMessage(response?.message);
//       console.log('line item deleted successfully',response);
//       setIsUploading(false);
//       setActive(prevState => ({ ...prevState, delete: { visible:false,id:null}}));
//       const updatedLineItems = lineItemsData.filter(
//         (item) => item.lineItemId !== lineItemId
//       );
//       setLineItemsData(updatedLineItems)
//       setTimeout(() => {setShowPopup(false);setMessage(null)},5000);
//     } catch (error) {
//       console.log('Error in deleting line item', error.message);
//       setLoadingErrorMsg(error.message);
//       setIsUploading(false)
//       setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
//     }
//   }


// //Handle Generate    
// const [miscellaneousData , setMiscellaneousData]=useState(null)
//     const handleGenerateExpense = async (category) => {
//       // const category1 = 
//       console.log('generate category',category)   
//       try {
//         setIsUploading(true)
//         setActive(true)
//         const response = await getCategoryFormElementApi(tenantId,empId,category );

//         setMiscellaneousData(response || {})
//         setDefaultCurrency(response?.defaultCurrency)
//         setCategoryElement(response?.fields || [])
//         setExpenseLineAllocation(response?.newExpenseAllocation) || []
//         setExpenseHeaderId1(response?.expenseHeaderId)
        
//         setGroupLimit(response?.group)
//         console.log('group limit 1',response?.group)
//         sessionStorage.setItem("expenseHeaderId", response?.expenseHeaderId);
//         setIsUploading(false);
//         setActive(false)
        
//         console.log('expense data for approval fetched.',response);
//         // setSelectedCategory(null)
//       } catch (error) {
//         console.log('Error in fetching expense data for approval:', error.message);
//         setLoadingErrorMsg('message',error.message);
//         setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
//       }
//       };

     
//     //for add line item
//     const handleModal=()=>{
//         setOpenModal((prevState)=>(!prevState))
//         // setCategoryElement(formData)
//     }
//     console.log('miscellaneous data',miscellaneousData)


//     let expenseHeaderIdBySession = sessionStorage.getItem("expenseHeaderId");
//     console.log('expenseHeaderId by session',expenseHeaderIdBySession)

// // Function to save the expenseHeaderId in local storage

// // const saveExpenseHeaderIdToLocalstorage = () => {
// //   localStorage.setItem('expenseHeaderId', expenseHeaderId1);

// //   console.log('expense header id stored in ')
// // };

// // // Call the function when the component mounts
// // useEffect(() => {
// //   saveExpenseHeaderIdToLocalstorage();
// // }, [miscellaneousData]);





// // Call the function when the component mounts
// // useEffect(() => {
  
// //     const storedExpenseHeaderId = localStorage.getItem('expenseHeaderId');
// //     if (storedExpenseHeaderId) {
// //       setExpenseHeaderId1(storedExpenseHeaderId);
// //     }
// //     console.log('expense header id from storage', storedExpenseHeaderId)
  
// // }, []);

//      /// Get Line Items
//      const [expenseDataByGet , setExpenseDataByGet]= useState(null)
//      useEffect(() => {
//       const expenseHeaderIds = expenseHeaderId || expenseHeaderId1 || expenseHeaderIdBySession
//       console.log('expense header id1',expenseHeaderIds)
    
//       const fetchData = async () => {
//         try {
//           const response = await getNonTravelExpenseLineItemsApi(tenantId, empId,expenseHeaderIds);
//           setExpenseDataByGet(response?.expenseReport)
//           setLineItemsData(response?.expenseReport?.expenseLines)
//           setIsLoading(false);
//           if(response.expenseReport===null){
//           setDefaultCurrency(response?.expenseReport?.defaultCurrency)
//         }
//           console.log(response.data)
//           console.log('expense line items fetched successfully.',response);
//         } catch (error) {
//           console.log('Error in fetching expense data for approval:', error.message);
//           setLoadingErrorMsg(error.message);
//           setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
//         }
//       };
  
//       fetchData(); 
  
//     }, [expenseHeaderId ||expenseHeaderId1]);
//     console.log('line items data ',lineItemsData)
//     console.log('data by report ', expenseDataByGet)
   


// //intial form value with empty string

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




 
// // for line items form
   

//     // const handleInputChange = (name, value) => {
      
//     //    setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: false, msg: "" } }));
//     //   //  setErrorMsg((prevErrors) => ({ ...prevErrors, [name]: { set: false, msg: "" } }));
//     //     setFormDataValues((prevValues) => ({
//     //       ...prevValues,
//     //       [name]: value,
//     //     }));
//     //     if (name === 'Total Amount' || name === 'Total Fair') {
//     //         setTotalAmount(value);
//     //       }
//     //   };

//     // const handleInputChange = (name, value) => {
//     //   console.log(`Updating ${name} with value:`, value);
    
//     //   setFormDataValues(prevState => {
//     //     const updatedState = { ...prevState };
    
//     //     // Check if the name already exists
//     //     if (updatedState.hasOwnProperty(name)) {
//     //       // If the name exists, replace its value
//     //       updatedState[name] = value || "";
//     //     } else {
//     //       // If the name doesn't exist, add a new key-value pair
//     //       updatedState[name] = value || "";
//     //     }
    
//     //     return updatedState;
//     //   });
    
//     //   if (name === 'Total Amount' || name === 'Total Fair') {
//     //     setTotalAmount(value);
//     //   }
//     // };
//    console.log('groupline',groupLimit)

//       console.log('initial values',formDataValues)

//     const handleInputChange = (name, value) => {

      
//       console.log(`Updating ${name} with value:`, value);
//       const sample = JSON.parse(JSON.stringify(formDataValues))
//       console.log(sample, 'before chaning input')

//       setFormDataValues(prevState=>({...prevState, [name]: value}))
//       // setFormDataValues((prevState) => ({ ...prevState, [name]: value || "" }));

      
//       console.log('onChange lineitem',formDataValues)
//       if (totalAmountNames.includes(name)) {
//                 setTotalAmount(value);
//               }
//       if(dateForms.includes(name)){
//         setDate({[name] : value})
//       }    
//       if(totalAmountNames.includes(name)){
//         const limit = groupLimit?.limit 
//         if(value>limit){
//           setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:true,msg:groupLimit?.message}}))
//         }else{
//           setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:false,msg:groupLimit?.message}}))
//         }
//       }
//     };
//     // const handleInputChange = (name, value) => {
//     //   console.log(`Updating ${name} with value:`, value);
//     //   setFormDataValues((prevState) => ({ ...prevState, [name]: value || "" }));
//     //   if ((name === 'Total Amount' || name === 'Total Fare')) {
//     //             setTotalAmount(value);
//     //           }
//     //   if((name === 'Total Amount' || name === 'Total Fare') ){
//     //     const limit = groupLimit?.limit 
//     //     if(value>limit){
//     //       setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:true,msg:groupLimit?.message}}))
//     //     }else{
//     //       setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:false,msg:groupLimit?.message}}))
//     //     }
//     //   }
//     // };
   
// console.log('selected category',selectedCategory)

//     const handleEmptyValues = () => {
//       const updatedFormData = { ...formDataValues };
  
//       // Loop through each property in formDataValues
//       for (const key in updatedFormData) {
//         // Check if the property is undefined or null
//         if (updatedFormData[key] === undefined || updatedFormData[key] === null) {
//           // Set it to an empty string
//           updatedFormData[key] = "";
//         }
//       }
  
//       // Update the state with the modified formDataValues
//       setFormDataValues(updatedFormData);
//     };


     
// const [selectedFile  , setSelectedFile]=useState(null)
// const [fileSelected ,setFileSelected]= useState(false)



      
//       console.log('total amount', totalAmount)
//       console.log("expense line",lineItemsData)
//       console.log('category element',categoryElement)

// // Handle Converter
// const handleConverter =async ( totalAmount , selectedCurrency) => { 

//         if(totalAmount=="" ||totalAmount==undefined){
//           setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:true,msg:"Enter Total Amount"}}))
//           console.log('total amount', totalAmount)
//         }else{
//           setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:false,msg:""}}))
//         }
//         console.log('convertbutton clicked',totalAmount,selectedCurrency)
//         if (totalAmount !== undefined && totalAmount !== "") {
//           console.log('convertbutton clicked',totalAmount,selectedCurrency)
      
//         try {
//           setIsUploading(true)
//           setActive(prevState => ({...prevState,convert:true}))
//           const response = await postMultiCurrencyForNonTravelExpenseApi(tenantId,totalAmount,selectedCurrency.shortName);
//           setCurrencyTableData(response?.currencyConverterData || {})
//           setIsUploading(false);
//           setActive(prevState => ({...prevState,convert:false}))
//           console.log('converted amount fetched',response.currencyConverterData);

//         } catch (error) {
//           console.log('Error in fetching expense data for approval:', error.message);
//           setIsUploading(false)
//           setActive(prevState => ({...prevState,convert:false}))
//           setLoadingErrorMsg(error.message);
//           setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
//         }
      
//       }
//       };

      

  
// console.log('categoryname;',miscellaneousData?.categoryName)



   




// /// Save Line Item
//       console.log('date for save',date)
//       const handleSaveLineItem = async () => {
//         console.log('lineitem on save',formDataValues)
//         const expenseHeaderId= miscellaneousData?.expenseHeaderId
//         const expenseHeaderNumber = miscellaneousData?.expenseHeaderNumber
//         const companyName = miscellaneousData?. companyName
//         const createdBy  = miscellaneousData?.createdBy
//         const defaultCurrency = miscellaneousData?.defaultCurrency
//         console.log('nearby save' ,formDataValues)

//        let  allowForm = true

//         ///for date validation

//         const firstKey = Object.keys(date)[0]
//         if(selectedCurrency?.shortName !== defaultCurrency.shortName &&( !currencyTableData?.currencyFlag || currencyTableData ===null)){
//           setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: true, msg: `conversion not available!` } }));
//           allowForm = false;
//         }else {
//           setErrorMsg((prevErrors) => ({ ...prevErrors, currencyFlag: { set: false, msg: "" } }));
//         }  

//       if(!['Travel Insurance'].includes(formDataValues?.['Category Name']) && (!date[firstKey] || date[firstKey]=== "")){
//         setErrorMsg((prevErrors) => ({ ...prevErrors, dateErr: { set: true, msg: `Enter the ${firstKey}` } }));
//         allowForm = false;
//         console.log('date  is empty1' , date[firstKey])
//       }else {
//         setErrorMsg((prevErrors) => ({ ...prevErrors, dateErr: { set: false, msg: "" } }));
//       }
//         if(totalAmount=="" ||totalAmount==undefined){
//           setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:true,msg:"Enter Total Amount"}}))
//           console.log('total amount', totalAmount)
//           allowForm = false
//         }else{
//           setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:false,msg:""}}))
//         }
     
//         handleEmptyValues(); // Ensure that any undefined or null values in formDataValues are set to ""
      
//         const updatedFormData = {
//           companyName,
//           createdBy,
//           expenseHeaderNumber,
//           defaultCurrency,
          
//           lineItem :{
//             group:groupLimit,
//             'Category Name':selectedCategory || "",
//             ...formDataValues,
//             'Document': selectedFile || "",
//             'Currency': selectedCurrency || defaultCurrency || "",
//             multiCurrencyDetails :currencyTableData,
//             expenseLineAllocation :selectedAllocations,
//           }
//         } 
    
//         // setFormDataValues(updatedFormData);
//         console.log('filledLineItemDetails', updatedFormData);
    
//        if(allowForm){   
//         try {
//           setIsUploading(true)
//           setActive(prevState => ({...prevState,saveLineItem:true}))
          
//           const response = await postNonTravelExpenseLineItems(tenantId,empId,expenseHeaderId,updatedFormData);
//           setShowPopup(true)
//           setMessage(response?.message)
//          console.log('line item saved successfully',response?.message )
//          const newLine = {...updatedFormData?.lineItem , lineItemId : response?.lineItemId}
//          setLineItemsData([...lineItemsData, newLine]);   
//          setIsUploading(false)
//          setActive(prevState => ({...prevState,saveLineItem:false}))
//          setOpenLineItemForm(false)
//          setTimeout(() => {setShowPopup(false);setMessage(null);},5000)
//          setCurrencyTableData(null)

//         } catch (error) {
//           console.log('Error in fetching expense data for approval:', error.message);
//           setIsUploading(false)
//           setActive(prevState => ({...prevState,saveLineItem:false}))
//           setLoadingErrorMsg(error.message);
        
//           setTimeout(() => {setLoadingErrorMsg(null);setIsLoading(false)},5000);
//         }}
//         // Clear the selected file and reset the form data
//         setSelectedFile(null);
//         setFileSelected(false);
//         // setFormDataValues({});
//       };


// /// Update Line Item
      
// const handleUpdateLineItem = async (lineItem ,data,totalAmount,date) => {

//   const lineItemId= lineItem.lineItemId;
//   let allowForm = true
//   const foundTotalAmtKey = totalAmountNames.find(key => Object.keys(lineItem).includes(key));
//   const expenseHeaderId1= expenseHeaderId || miscellaneousData?.expenseHeaderId
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
//     const response = await editNonTravelExpenseLineItemsApi(tenantId,empId,expenseHeaderId1,lineItemId,data1);
//     setShowPopup(true)
//     setMessage(response?.message)
//    console.log('line item saved successfully',response?.message)
//   //  const newLine = {...updatedFormData?.lineItem , lineItemId : response?.lineItemId}
//    setLineItemsData([...lineItemsData]);   
//    setIsUploading(false)
//    setActive(prevState => ({ ...prevState, saveLineItem: false }));
//    setOpenLineItemForm(false)
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
//   setFileSelected(false);
//   setFormDataValues({});
// };      



// /// Submit Expense || Draft Expense || Delete
//       const handleSubmitOrDraft = async(action)=>{
        
//         const expenseHeaderId1= expenseHeaderId || miscellaneousData?.expenseHeaderId ||expenseDataByGet?.expenseHeaderId
//        let api ;
//        if(action === "submit") {
//         api =submitNonTravelExpenseApi(tenantId,empId, expenseHeaderId1)
//        }else if (action === "save as draft"){
//         api =saveAsDraftNonTravelExpense(tenantId,empId, expenseHeaderId1)
//        }else if (action1 === "delete"){
//          api = cancelNonTravelExpenseHeaderApi(tenantId, empId ,expenseHeaderId1)
//        }

//        try {
//         setIsLoading(true);
//        const response = await api
//        console.log('responsemessage',response)
      
//        setShowPopup(true)
//        setMessage(response?.message )
//        setIsLoading(false)
//        setTimeout(() => {setShowPopup(false);setMessage(null)},8000);
//       //  window.location.reload()
      
//       } catch (error) {
//         setLoadingErrorMsg(`Please retry again : ${error.message}`); 
//         setTimeout(() => {setIsLoading(false);setLoadingErrorMsg(null)},2000);
//       }
//       setAction(null)

//       }

//       const handleOpenModal=(id)=>{
//         if(id==='upload'){
//           setOpenModal('upload')
//         }
//         if(id==='form'){
//           setOpenModal('form')
//         }
//        }

//        const handleCurrency = (value)=>{
//         const selectedCurrencyObject = currencyDropdown.find(currency => currency.shortName === value);
//         setSelectedCurrency(selectedCurrencyObject)

//         if(value === defaultCurrency?.shortName){
//           setCurrencyTableData(null)
//         }
        
//        }


//       const [ocrFileSelected , setOcrFileSelected]=useState(false)
//       const [ocrSelectedFile , setOcrSelectedFile]=useState(null)
//       const [ocrField , setOcrField]=useState(null)
      
//       const handleOcrScan = async () => {
//         // console.log('ocrfile from handle', ocrSelectedFile);
      
//         const formData = new FormData();
//           formData.append('file', ocrSelectedFile);
      
//         console.log('ocrfile from handle',formData)
      
//         try {

//           setIsUploading(true);
          
//           // Assuming ocrScanApi is an asynchronous function
//           const response = await nonTravelOcrApi(formData);
      
//           if (response.error) {
//             loadingErrorMsg(response.error.message);
//             setCurrencyTableData(null);
//           } else {
//             loadingErrorMsg(null);
//             setOcrField(response.data);
      
//             if (!currencyTableData.currencyFlag) {
//               setErrorMsg((prevErrors) => ({
//                 ...prevErrors,
//                 currencyFlag: { set: true, msg: 'OCR failed, Please try again' },
//               }));
//               console.log('Currency is not found in onboarding');
//             }
//           }
//         } catch (error) {
//           loadingErrorMsg(error.message);
//           setMessage(error.message);
//           setShowPopup(true);
      
//           setTimeout(() => {
//             setShowPopup(false);
//           }, 3000);
//         } finally {
//           setIsUploading(false);
//         }
//       };

//   return (
//     <div>
//         {isLoading && <Error message={loadingErrorMsg}/>}
//         {!isLoading  && 
//         <div className=" w-full h-full relative bg-white-100 md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 ">
//         {/* app icon */}
//         <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
//             <Icon/>
//         </div>

//         {/* Rest of the section */}
//         <div className="w-full h-full mt-10 p-10 font-cabin tracking-tight">
//         <p className='inline-flex'> 
//         <img src={validation_sym} width={16} height={16} alt='validation'/> 
//         <span className='text-red-500'> if category is not there contact admin.</span>
//         </p>           
//         <div className="flex flex-row justify-between">
//         {/* {categoryList?.length >=0  &&miscellaneousData?.categoryName ==  undefined&& */}
//          <div className='my-5  inline-flex gap-4'>
//          <div className="h-[48px] w-[200px]">
//        <Select
//            title="Category"
//            placeholder="Select Category"
//            options={categoryList || []}
//            currentOption={categoryList && categoryList[0]}
//            // violationMessage="Your violation message" 
//          //   error={{ set: true, message: "Your error message" }} 
//            required={true} 
//            submitAttempted={false}
//            icon={chevron_down}
//            onSelect={(value)=>setSelectedCategory(value)}
//            />
          
 
//            </div>
 
//            <div className='mt-7'>
//              <Button loading={isUploading} active={active} text="Generate" onClick={()=>handleGenerateExpense(selectedCategory)} disabled={!selectedCategory}/>
//          </div>
//        </div>
//       {/* //  }   */}
       

// {lineItemsData.length!=0 &&
//   <div className="flex gap-4 ">
//                     {cancel ?
//                     (<div className="flex  flex-row-reverse">
//                     <Button variant='fit' text='Cancel' onClick={()=>{setShowModal(true);setAction("delete")}}/>
//                    </div>):
//                     (<>
//                     {expenseDataByGet?.expenseHeaderStatus !== 'pending settlement'  &&
//                     <>
//                      <div className="flex  flex-row-reverse">
//                      <Button text='Save as Draft' onClick={()=>{handleSubmitOrDraft("save as draft")}}/>
//                     </div>
                   
//                     <div className="flex  flex-row-reverse">
//                     <Button variant='fit' text='Submit' onClick={()=>{handleSubmitOrDraft("submit")}}/>
//                    </div>
//                    </>}
//                    </>)}                                 
// </div>
// } 

//             </div>
           
        
//             <hr/>
//             <HeaderComponent headerDetails={headerDetails} miscellaneousData={ miscellaneousData} expenseDataByGet={expenseDataByGet && expenseDataByGet}/>
           
//      <hr/>
//      {categoryElement.length>0 && <div className="w-fit my-5" >
//            <Button text={"Add Line Item"} onClick={()=>handleOpenModal('form')}/>
//      </div>}
    

// {/* //----------- edit line item--start---------------------- */}

// {lineItemsData && lineItemsData?.map((lineItem , index)=>(
//    (lineItem.lineItemId === selectedLineItemId && categoryElement.length>0) ?
   
//  <React.Fragment key={index}>

//   <EditFormComponent
//   setCurrencyTableData={setCurrencyTableData}
//   active={active}
//   isUploading={isUploading}
//    handleUpdateLineItem={handleUpdateLineItem}
//    currencyTableData={currencyTableData}
//    setErrorMsg={setErrorMsg}
//    errorMsg={errorMsg}
//    expenseLineAllocation={expenseLineAllocation}
//    categoryElement={categoryElement}
//    key={index}
//    lineItem={lineItem}
//    handleSave={(updatedData) => handleSaveLineItem(updatedData, index)}
//    defaultCurrency={defaultCurrency}
//    handleConverter={handleConverter}/>

//  </React.Fragment>
   
   
//    :
// <>
// <div className='flex flex-col lg:flex-row border '>
//   <div className='w-full lg:w-1/2 border'>
//     <DocumentPreview initialFile={lineItem.Document}/>

//   </div>
//   <div className='w-full lg:w-1/2 border h-full' key={index}>  
//      <div className=' h-[700px]'>
//      <EditComponent  lineItem={lineItem} handleEdit={handleEdit} isUploading={isUploading} active={active} handleDelete={handleDelete}/>
//      </div> 
//   </div>
//   </div> 
// </>  
//    ))}
 



// {/* //----------- edit line item--end---------------------- */}


               
     
         
        
// {/* //---------save line item form----------------------- */}

// {openLineItemForm &&
// <div className='flex flex-col lg:flex-row border '>
//   <div className='w-full lg:w-1/2 border  flex justify-center items-center px-4 py-4'>
  
//   <div className=' border-[5px] min-w-[100%] h-fit min-h-[700px] flex justify-center items-center'>
//     {selectedFile ? 
//     (
//         <div className="w-full  flex flex-col justify-center">
//           <p>Selected File: {selectedFile.name}</p>
//           {/* <p>Size: {selectedFile.size} bytes</p>
//           <p>Last Modified: {selectedFile.lastModifiedDate.toString()}</p> */}
//           {selectedFile.type.startsWith('image/') ? (
            
//             <img
//               src={URL.createObjectURL(selectedFile)}
//               alt="Preview"
//               className=' h-[700px] w-full'
              
//             />
//           ) : selectedFile.type === 'application/pdf' ? (
//             <embed
//               src={URL.createObjectURL(selectedFile)}
//               type="application/pdf"
//               width="100%"
//               height="700px"
//             />
//           ) : (
//             <p>Preview not available for this file type.</p>
//           )}
//         </div>
//       ) : 
//        <div className='w-full  flex justify-center items-center bg-white-100 opacity-30'>
//         <img src={file_icon} className='w-40 h-40'/>
//       </div>
//       }
//     </div>
//   </div>
//   <div className='w-full lg:w-1/2 border lg:h-[715px] overflow-y-auto scrollbar-hide'>
//   {openLineItemForm &&
//   <> 
//   <div className="w-full flex items-center justify-start h-[52px] border px-4 mt-4">
//       <p className="text-zinc-600 text-medium font-semibold font-cabin capitalize">   Category -{selectedCategory}</p>
//     </div>
          
// <div  className="w-full border flex flex-wrap items-start justify-between  px-2">
//   {expenseLineAllocation.length>0 && expenseLineAllocation.map((allItem , allIndex )=>(
//     <div className='w-full px-2 flex justify-center py-2' key={allIndex}>
//     <Select
//     title={titleCase(allItem.headerName ?? "")}
//     options={allItem.headerValues}
//     placeholder='Select Allocations'
//     onSelect={(value)=>onAllocationSelection(value,allItem.headerName)}/>  
//     </div> 
//   ))}

// {categoryElement && categoryElement.map((element, index) => {
//     return (
// <React.Fragment key={index}>
//  <div className='h-[73px] my-2'>        
//     <Input 
//       placeholder={titleCase(`Enter ${element.name}`)}
//       initialValue={formDataValues[element.name]}
//       // initialValue={ocrValue[element.name]}
//       title={element.name}
//       // error={totalAmountNames.includes(element?.name)? errorMsg.totalAmount : null}
//       error={(totalAmountNames.includes(element?.name) && errorMsg.totalAmount) || (dateForms.includes(element?.name) && errorMsg.dateErr )}
//       // error={element.name === "Total Amount" || element.name === "Total Fare" ? errorMsg.totalAmount : null}
//       type={element.type === 'date' ? 'date' : element.type === 'amount' ? 'number' : 'text'}
//       onChange={(value) => handleInputChange(element.name,value)}
//     />
// </div>  
// </React.Fragment>);
//   })}
// </div>  

// <div className='flex flex-col px-2 py-2 justify-between'>
//   <div className={`flex justify-between ${currencyTableData?.message !== undefined ? 'md:flex-col' : 'md:flex-row'}   flex-col`}>
// <div className='flex flex-row items-center'>
// <div className="h-[48px] w-[100px]  mb-10 mr-28 mt-[-10px] ">
//            <Select
//            currentOption={defaultCurrency?.shortName}
//            title="Currency"
//            error={errorMsg.currencyFlag}
//            placeholder="Select Currency"
//            options={currencyDropdown.map(item=>item.shortName)}
//            onSelect={(value)=>{handleCurrency(value)}}
//            />
// </div>


// <div className='w-fit' >
// { selectedCurrency == null || selectedCurrency?.shortName !== defaultCurrency?.shortName &&


// <ActionButton disabled={active?.convert} loading={active?.convert} active={active.convert} text='Convert' onClick={()=>handleConverter(totalAmount , selectedCurrency)}/>

// }
// </div>

// </div>



// </div>
// <div >
// {currencyTableData?.currencyFlag  ? 
// <div className=''>
// <div className="min-w-[200px] w-full  h-auto flex-col justify-start items-start gap-2 inline-flex mb-3">
// <div className="text-zinc-600 text-sm font-cabin">Coverted Amount Details :</div>
// <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin  ">
//   <div className="w-full h-full decoration:none  rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600">
//     <div className={`sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100  border rounded-md`}>
//       <div className="text-[16px] font-semibold text-neutral-600">Total Amount </div> 
//       <div className="text-neutral-600 font-cabin">{currencyTableData?.convertedCurrency} {currencyTableData?.convertedAmount.toFixed(2)}</div>
//   </div>
//   </div>
// </div>
// </div>
// </div> 

// //--------
//   : 
//   currencyTableData?.message !== undefined &&
//   <div className=' flex   items-center justify-center gap-2 border-[1px] px-4 py-2 rounded border-yellow-600  text-yellow-600'>
//     <img src={validation_symb_icon} className='w-5 h-5'/>
//   <h2 className=''>{currencyTableData?.message}</h2>
//   </div>
// }
// </div>


// <div className='flex w-fit mb-4'>
//   <Select 
//   //currentOption={defaultCurrency}
//    title="mode of payment"
//    name="mode of payment"
//    placeholder="Select MOD"
//    options={['Credit Card',"Cash",'Debit Card','NEFT']}
//    onSelect={(value)=>{setFormDataValues({...formDataValues,['Mode of Payment']:value})}}/>
// </div>
// <div className="w-full   flex items-center justify-center border-[1px] border-gray-50">
// <Upload 
//   selectedFile={selectedFile}
//   setSelectedFile={setSelectedFile}
//   fileSelected={fileSelected}
//   setFileSelected={setFileSelected}
// />
// </div>
// </div>         
// <div className="w-full px-2 py-4" >
//   <Button 
//    disabled={isUploading} 
//    loading={isUploading} 
//    active={active.saveLineItem}
//    text="Save" onClick={handleSaveLineItem} />
// </div>
// </>   
// }
// </div>
// </div>}


// {/* //---------save line item form end----------------------- */}

//            {openModal==='form' && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 " >
//                 <div className='z-10 max-w-4/5  md:mx-0 mx-4   sm:w-2/5 w-full min-h-4/5 max-h-4/5  bg-white-100  rounded-lg shadow-md'>
//                 <div onClick={()=>setOpenModal(null)} className=' w-10 h-10 flex mr-5 mt-5 justify-center items-center float-right   hover:bg-red-300 rounded-full'>
//                       <img src={cancel} className='w-8 h-8'/>
//                   </div>
//                     <div className="p-10">
//                         <p className="text-xl  text-center font-cabin">Seletct option for Enter Expense Line</p>
//                         <div className="flex mt-10 md:gap-24  gap-4 justify-between md:flex-row flex-col">
//                           <div className='w-full'> 
//                             <Button className='fit' variant='' text='Scan' onClick={()=>handleOpenModal('upload')}  />
//                             </div>
//                             <div className='w-full'> 
//                             <Button variant='' text='Manually' onClick={()=>{setOpenLineItemForm(true);handleModal()}} />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 </div>
//             }

// {openModal==='upload' && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 " >
//                 <div className='z-10 max-w-5/5 w-2/5 min-h-4/5 max-h-4/5  bg-white-100  rounded-lg shadow-md'>
//                   <div onClick={()=>{setOpenModal(null);setOcrSelectedFile(null);setOcrFileSelected(false)}} className=' w-10 h-10 flex mr-5 mt-5 justify-center items-center float-right   hover:bg-red-300 rounded-full'>
//                       <img src={cancel} className='w-8 h-8'/>
//                   </div>
//                     <div className="p-10 ">
                     
//                       <div className="flex flex-col justify-center items-center">
                       

                       
//                         {ocrFileSelected ? 
                        
//                         <div className="w-full  flex flex-col justify-center items-center h-[500px]  overflow-x-auto">
//                         <p>Document Name: {ocrSelectedFile.name}</p>
//                         <Button  text='reupload' onClick={()=>{setOcrFileSelected(false);setOcrSelectedFile(null)}}/>
//                         {/* <p>Size: {selectedFile.size} bytes</p>
//                         <p>Last Modified: {selectedFile.lastModifiedDate.toString()}</p> */}
//                         {ocrSelectedFile.type.startsWith('image/') ? (
                          
//                           <img
//                             src={URL.createObjectURL(ocrSelectedFile)}
//                             alt="Preview"
//                             className=' w-full'
                            
//                           />
                          
//                         ) : ocrSelectedFile.type === 'application/pdf' ? (
//                           <embed
                          
//                             src={URL.createObjectURL(ocrSelectedFile)}
//                             type="application/pdf"
//                             width="100%"
//                             height="100%"
//                             onScroll={false}
//                           />
//                         ) : (

//                           <p>Preview not available for this file type.</p>

//                         )}

//                          <Button loading={isUploading} variant='fit' text='Scan' onClick={handleOcrScan} />
//                       </div>:
//                       <>
//                        <p className="text-xl font-cabin">Upload the document for scan the fields.</p>
//                                   <div className="w-fit">
//                                    <Upload
//                                    selectedFile={ocrSelectedFile}
//                                    setSelectedFile={setOcrSelectedFile}
//                                    fileSelected={ocrFileSelected}
//                                    setFileSelected={setOcrFileSelected}/>
//                                   </div>
//                                   </> }

//                         </div>

//                     </div>
//                 </div>
//                 </div>
//             }
           
//         </div>
        
       
//         </div>
//       }
//       <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>

//       <Modal 
//       skipable={true}
//       showModal={showModal} 
//       setShowModal={setShowModal}
//       handleConfirm={handleSubmitOrDraft} 
//       handleModalVisible={handleModalVisible}
//       content={<div> Are you sure about deleting it? </div>}/>
//     </div>
//   )
// }

// export default CreateNonTraveExpense


// function EditComponent({ lineItem, handleEdit ,handleDelete,isUploading,active}) {
//   const excludedKeys = ['expenseLineId','Currency', 'Document', 'expenseLineAllocation', 'multiCurrencyDetails', 'lineItemStatus','lineItemId', '_id'];
//   const includedKeys =['Total Fair','Total Fare','Total Amount',  'Subscription Cost', 'Cost', 'Premium Cost'];
  
//   return (
//     <>
//     <div className='flex flex-col justify-between  h-[700px] overflow-y-auto scrollbar-hide'>
//     <div className=''>
//      <div className="py-4 px-4">
//      {lineItem?.expenseLineAllocation &&
//         lineItem?.expenseLineAllocation?.map((allocation, index) => (
//           <div key={index} className="min-w-[200px] min-h-[52px] py-1">
//             <div className="text-zinc-600 text-sm font-cabin capitalize">{allocation.headerName}</div>
//             <div className="w-full h-12 bg-white items-center flex border border-neutral-300 rounded-md">
//               <div>
//                 <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin px-6 py-2">
//                   {allocation.headerValue}
//                 </div>
//               </div>
//             </div>

//           </div> 
//         ))}
//      </div>
//       <div className="w-full border flex flex-wrap items-start justify-between py-4 px-4 gap-y-4">
//          {/* Mapping lineItemAllocation */}
        
      
       
// {Object.entries(lineItem).map(([key, value]) => (
//   !excludedKeys.includes(key) && (
//     <React.Fragment key={key}>
//       <div className='min-w-[200px] min-h-[52px] relative '>
//         {key !== 'Currency' && (
//           <div className="text-zinc-600 text-sm font-cabin">
//             {titleCase(key)}
//           </div>
//         )}

//         {/* Div with border styling */}
//         <div className="w-full h-[48px]  items-center bg-white justify-start flex border border-neutral-300 rounded-md">
//           {/* Displaying key and value */}
//           <div key={key} className="text-neutral-700 w-full h-10 text-sm font-normal font-cabin px-6 py-2">
//             {includedKeys.includes(key) ? `${lineItem['Currency']?.shortName} ${value} ` : ` ${key === 'group' ? value?.group : value}`}
//           </div>
//         </div>
//         {includedKeys.includes(key) && ((lineItem?.multiCurrencyDetails?.convertedAmount || value) >( lineItem?.group?.limit || 0) ) && <div  className=" w-[200px] h-full line-clamp-2 text-xs text-yellow-600 font-cabin">{lineItem?.group?.message}</div>}
//       </div>
//     </React.Fragment>
//   )
// ))}
// </div>
//       <div>
//       {lineItem?.multiCurrencyDetails &&
// <div className='px-4'>

// <div className="min-w-[200px] w-full  h-auto flex-col justify-start items-start gap-2 inline-flex mb-3">
// <div className="text-zinc-600 text-sm font-cabin">Coverted Amount Details :</div>
// <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin  ">
//   <div className="w-full h-full decoration:none  rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600">
//     <div className={`sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100  border rounded-md`}>
//       <div className="text-[16px] font-semibold text-neutral-600">Total Amount </div> 
//       <div className="text-neutral-600 font-cabin">{lineItem?.multiCurrencyDetails?.defaultCurrency} {lineItem?.multiCurrencyDetails?.convertedAmount?.toFixed(2)}</div>
//   </div>

//   </div>

// </div>


// </div>
// </div>}
//         </div>
//         </div>
//  <div className='flex flex-row gap-4 items-center px-4 py-2 '>
//       <div className="w-fit">
//         <Button text="Edit" disabled={isUploading} loading={isUploading} active={(active?.edit?.id === lineItem?.lineItemId ? active?.edit?.visible : false)} onClick={() => handleEdit(lineItem?.lineItemId , lineItem?.['Category Name'])} />
//       </div>
//       <div className="w-fit  ">
//         <Button text="Delete"  disabled={isUploading} loading={isUploading} active={(active?.delete?.id === lineItem?.lineItemId ? active?.delete?.visible : false)} onClick={() => handleDelete(lineItem?.lineItemId)} />
//       </div>
//   </div>   
//   </div> 
//     </>
//   );
// }









// function  EditFormComponent ({setCurrencyTableData,active,isUploading,handleUpdateLineItem ,currencyTableData ,errorMsg,setErrorMsg, lineItem, categoryElement, handleSave,expenseLineAllocation,handleConverter ,defaultCurrency}) {
//   const [selectedFile  , setSelectedFile]=useState(null)
//   const [fileSelected ,setFileSelected]= useState(false)
//   const [selectedAllocations , setSelectedAllocations]=useState([])
//   const [selectedCurrency, setSelectedCurrency]=useState(null)
//   const [initialFile , setInitialFile]=useState(null)
//   const [totalAmount , setTotalAmount]=useState(0)
//   const [isMultiCurrency,setIsMultiCurrency]=useState(true);
//   const [date , setDate]=useState("")
  
// const groupLimit = lineItem?.group
//   console.log('lineitem', lineItem.expenseLineAllocation)
// const [formData, setFormData] = useState(lineItem);
//  console.log('object',categoryElement)
//  console.log('line item from edit form compoent', lineItem)

 
//  const  handleCurrenctySelect= (shortName)=>{

//   const selectedCurrencyObject = currencyDropdown.find(currency => currency.shortName === shortName);
//   setSelectedCurrency(selectedCurrencyObject)
//   if(shortName === defaultCurrency?.shortName){
//     setCurrencyTableData(null)
//     setFormData((prevState)=>({...prevState,multiCurrencyDetails:null}))
//   }
//   handleChange( 'Currency' , selectedCurrencyObject)

//   if(shortName !== defaultCurrency?.shortName){
//     setIsMultiCurrency(true)
    

//   }else{
//     setIsMultiCurrency(false)

//   }
// }
//   const handleChange = (key, value) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [key]: value,
//     }));

//     //  if (key === 'Total Amount' || key === 'Total Fair' || key === "Total Fare") {
//     //             setTotalAmount(value);
//     //           }
//     //   if((key === "Total Fare" ||key === 'Total Amount' || key === 'Total Fair' )){
//     //     const limit = groupLimit?.limit 
//     //     if(value>limit){
//     //       setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:true,msg:groupLimit?.message}}))
//     //     }else{
//     //       setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:false,msg:groupLimit?.message}}))
//     //     }
//     //   }
//     if (totalAmountNames.includes(key)) {
//       setTotalAmount(value);
//     }
//     if (dateForms.includes(key)) {
//       setDate({[key]:value});
//     }
  
//     if (totalAmountNames.includes(key)) {
//       const limit = groupLimit?.limit;
//       const isExceedingLimit = value > limit;
      
//       setErrorMsg((prevErrors) => ({
//         ...prevErrors,
//         totalAmount: { set: isExceedingLimit, msg: groupLimit?.message }
//       }));
//     }
//   };
//   const onAllocationSelection = (option, headerName) => {
//     // Create a new allocation object
//     const newAllocation = { headerName: headerName, headerValue: option || "" };
//     setSelectedAllocations((prevAllocations) => [...prevAllocations, newAllocation]);
//   };

//   // const onAllocationSelection = (option, headerName ) => {
//   //   // Check if an allocation with the same headerName already exists
//   //   const existingAllocationIndex = selectedAllocations.findIndex(allocation => allocation.headerName === headerName);
//   //   // Create a new allocation object
//   //   const newAllocation = { headerName: headerName, headerValue: option || "" };
//   //   if (existingAllocationIndex !== -1) {
//   //     // If allocation with the same headerName exists, replace it
//   //     setSelectedAllocations(prevAllocations => {
//   //       const updatedAllocations = [...prevAllocations];
//   //       updatedAllocations.splice(existingAllocationIndex, 1, newAllocation);
//   //       return updatedAllocations;
//   //     });
//   //   } else {
//   //     // Otherwise, add the new allocation
//   //     setSelectedAllocations(prevAllocations => [...prevAllocations, newAllocation]);
//   //   }
//   // };
  

//   useEffect(()=>{
//     if (fileSelected) {
//       setFormData({
//         ...formData,
//         ['Document']: selectedFile,
//       });
//     }
//   },[(fileSelected)])

//   useEffect(()=>{
//     setFormData({
//       ...formData,
//       ['multiCurrencyDetails']: currencyTableData,
//     });
//   },[currencyTableData])

//   useEffect(()=>{
//     if(selectedAllocations.length > 0 ) {
//     setFormData(({
//       ...formData,
//       expenseLineAllocation: [...selectedAllocations],
//     }))}

//   },[selectedAllocations])


// const lineItemData= {...formData,...selectedAllocations}
//   // const handleUpdateLineItem = () => {
//   //   console.log('Selected Allocations:', selectedAllocations);
//   //   console.log('Updated FormData:', formData);
//   //   // handleSave(formData);
//   //   // const lineItem1= setFormData()
//   //   console.log('updated line item',{
      

//   //   })
//   // };
  
//   useEffect(() => {
//     // Set the initial file when the component is mounted
//     setInitialFile(lineItem.Document);
//     const matchedKey = totalAmountNames.find(key => lineItem?.[key]);
//     const totalAmount = matchedKey ? lineItem[matchedKey] : null;
//     setTotalAmount(totalAmount);
    
//     const foundDateKey = dateForms.find(key => Object.keys(lineItem).includes(key));
//     const dateValue = foundDateKey ? lineItem[foundDateKey] : undefined;
//     setDate({[foundDateKey]:dateValue})

    
//     // setTotalAmount(lineItem?.['Total Amount'] || lineItem?.['Total Fair'])
//   }, []);

//   return (
//    <>
//  <div className='flex flex-col lg:flex-row border '>
//   <div className='w-full lg:w-1/2 border  flex justify-center items-center px-4 py-4'>
//    <DocumentPreview selectedFile={selectedFile} initialFile={initialFile}/>
//   </div>
//   <div className='w-full lg:w-1/2 border lg:h-[700px] overflow-y-auto scrollbar-hide'>     

// <div  className="w-full border flex flex-wrap items-start justify-between py-4 px-2">

//   {expenseLineAllocation?.length>0 && expenseLineAllocation?.map((allItem , allIndex )=>(
   
//       <div className='w-full px-2 flex justify-center py-2' key={allIndex}>
//       <>
//        <Select
//        currentOption={lineItem?.expenseLineAllocation.find(item => item.headerName === allItem.headerName)?.headerValue ?? ''}
//        title={titleCase(allItem.headerName ?? '')}
//        options={allItem.headerValues}
//        placeholder='Select Allocations'
//        onSelect={(value) => onAllocationSelection(value, allItem.headerName)}
//      />
//      </>
    
// </div> 
    
   
//   ))} 
//       {categoryElement && categoryElement.map((field) => (
//         <div key={field.name} >
       
//           <Input
//             title={field.name}
//             placeholder={titleCase(`Enter ${field.name}`)}
//             type={field.type === 'date' ? 'date' : 'text'}
//             name={field.name}
//             initialValue={formData[field.name]}
//             onChange={(value) => handleChange(field.name, value)}
//             // error={field.name === "Total Amount" ? errorMsg.totalAmount : null}
//             error={(totalAmountNames.includes(field?.name) && errorMsg.totalAmount) || (dateForms.includes(field?.name) && errorMsg.dateErr )}
//             className='mt-1 p-2 w-full border rounded-md'
//           />  
//         </div>  
//       ))}
//   <div className='flex flex-col  justify-between w-full mt-4'>
// <div className={`flex justify-between ${currencyTableData?.message !== undefined ? 'md:flex-col' : 'md:flex-row'}   flex-col`}>
// {/* <div className='flex sm:flex-row flex-col justify-between'> */}
// <div className='flex flex-row items-center'>
// <div className="h-[48px] w-[100px]  mb-10 mr-28 mt-[-10px] ">
//            <Select
//            error={errorMsg.currencyFlag}
//            currentOption={lineItem['Currency']?.shortName}
//            title="Currency"
//            name="currency"
//            placeholder="Select Currency"
//            options={currencyDropdown.map(item=>item.shortName)}
//            onSelect={(value) =>{ handleCurrenctySelect(value)}}
//            />
// </div>


// <div className='w-fit'>
// {selectedCurrency == null ||selectedCurrency.shortName !== defaultCurrency.shortName &&


// <ActionButton loading={isUploading} active={active.convert} text='Convert'  onClick={()=>handleConverter(totalAmount,selectedCurrency)}/>

// }
// </div>
// </div>
// <div>

// </div>


// </div>
// <div>
// {( currencyTableData?.currencyFlag && currencyTableData!==null) ? 
// <div className=''>
// <div className=''>

// <div className="min-w-[200px] w-full  h-auto flex-col justify-start items-start gap-2 inline-flex mb-3">
// <div className="text-zinc-600 text-sm font-cabin">Coverted Amount Details :</div>
// <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin  ">
//   <div className="w-full h-full decoration:none  rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600">
//     <div className={`sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100  border rounded-md`}>
//       <div className="text-[16px] font-semibold text-neutral-600">Total Amount </div> 
//       <div className="text-neutral-600 font-cabin">{currencyTableData?.convertedCurrency} {currencyTableData?.convertedAmount.toFixed(2)}</div>
//   </div>

//   </div>

// </div>


// </div>
// </div> 
// </div>
//   : 
//   currencyTableData?.message !== undefined &&
//   <div className='flex items-center justify-center gap-2 border-[1px] px-4 py-2 rounded border-yellow-600  text-yellow-600'>
//     <img src={validation_symb_icon} className='w-5 h-5'/>
//   <h2 className=''>{currencyTableData?.message}</h2>
//   </div>
// }
// {isMultiCurrency && lineItem?.multiCurrencyDetails && currencyTableData ==null  &&

// <div className=''>

// <div className="min-w-[200px] w-full  h-auto flex-col justify-start items-start gap-2 inline-flex mb-3">
// <div className="text-zinc-600 text-sm font-cabin">Coverted Amount Details :</div>
// <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin  ">
//   <div className="w-full h-full decoration:none  rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600">
//     <div className={`sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100  border rounded-md`}>
//       <div className="text-[16px] font-semibold text-neutral-600">Total Amount </div> 
//       <div className="text-neutral-600 font-cabin">{lineItem?.multiCurrencyDetails?.convertedCurrency} {lineItem?.multiCurrencyDetails?.convertedAmount?.toFixed(2)}</div>
//   </div>
// </div>

// </div>


// </div>
// </div> }
// </div>
// <div className='flex w-fit mb-4'>
//   <Select 
//    currentOption={lineItem['Mode of Payment']}
//    title="mode of payment"
//    name="mode of payment"
//    placeholder="Select MOD"
//    options={['Credit Card',"Cash",'Debit Card','NEFT']}
//    onSelect={(value)=>{handleChange( 'Mode of Payment',value)}}
//    />
// </div>
// {/* <div>
// {currencyTableData?.currencyFlag ? 
// <h2>Coverted Amount: {currencyTableData?.convertedAmount} ?? hello</h2> 
//   : 
// <h2 className='text-red-500'>{errorMsg.currencyFlag.msg}</h2>
// }
// </div> */}



// <div className="w-full   flex items-center justify-center border-[1px] border-gray-50 ">
// <Upload 
//   selectedFile={selectedFile}
//   setSelectedFile={setSelectedFile}
//   fileSelected={fileSelected}
//   setFileSelected={setFileSelected}
//   />
// </div>

// </div>  


//     </div>
//       <div className="w-full px-2 py-4">
//         <Button loading={isUploading}  active={active.saveLineItem} text="Update" onClick={()=>handleUpdateLineItem(lineItem, lineItemData,totalAmount,date)} />
//       </div>
//     </div>
// </div>
    
//       </>
   
//   );
// }





// function DocumentPreview({selectedFile , initialFile}){


//   return(
//     <div className=' border-[5px] min-w-[100%] h-fit flex justify-center items-center'>
//     {selectedFile ? 
//     (
//         <div className="w-full  flex flex-col justify-center">
//           <p>Selected File: {selectedFile.name}</p>
//           {/* <p>Size: {selectedFile.size} bytes</p>
//           <p>Last Modified: {selectedFile.lastModifiedDate.toString()}</p> */}
//           {selectedFile.type.startsWith('image/') ? (
            
//             <img
//               src={URL.createObjectURL(selectedFile)}
//               alt="Preview"
//               className=' h-[700px] w-full'
              
//             />
            
//           ) : selectedFile.type === 'application/pdf' ? (
//             <embed
//               src={URL.createObjectURL(selectedFile)}
//               type="application/pdf"
//               width="100%"
//               height="700px"
//             />
//           ) : (
//             <p>Preview not available for this file type.</p>
//           )}
//         </div>
//       ) : 
//       !initialFile ?
//       <div className='w-full h-[700px] flex justify-center items-center bg-white-100 opacity-30'>
//         <img src={!initialFile && file_icon || initialFile} className='w-40 h-40'/>
//       </div> :
//       <div className='w-full h-[700px] flex justify-center items-center '>
//        {initialFile.toLowerCase().endsWith('.pdf') ? (
//         // Display a default PDF icon or text for PDF files
//         <div className='w-full'>
//           <embed
//             src={initialFile}
//             type="application/pdf"
//             width="100%"
//             height="700px"
//           />
//         </div>
//       ) : (
//         // Display the image preview for other file types
//         <img src={initialFile} alt="Initial Document Preview" className='w-40 h-40' />
//       )}
//       </div>
//       }
//     </div>
//   )
// }

// const  HeaderComponent =({headerDetails ,miscellaneousData , expenseDataByGet}) =>{
//   const miscellaneousData1 = miscellaneousData
//   console.log(miscellaneousData1)
//   console.log(expenseDataByGet)

//   return(
//     <div className='my-5'>

//           {/* <div> 
//                 <div className="flex gap-2 font-cabin text-xs tracking-tight ">
//                     <p className="w-[150px] text-neutral-600">Expense Header Number:</p>
//                     <p className="text-neutral-700">{(miscellaneousData1?.expenseHeaderNumber || expenseDataByGet?.expenseHeaderNumber) ?? '-'}</p>
//                 </div>
//                 <div className="flex gap-2 font-cabin text-xs tracking-tight ">
//                     <p className="w-[150px] text-neutral-600">Default Currency:</p>
//                     <p className="text-neutral-700">{(miscellaneousData1?.defaultCurrency?.shortName || expenseDataByGet?.defaultCurrency?.shortName) ?? '-'}</p>
//                 </div>
//                 <div className="flex gap-2 font-cabin text-xs tracking-tight">
//                     <p className="w-[150px] text-neutral-600">Category :</p>
//                     <p className="text-neutral-700">{miscellaneousData1?.categoryName ?? '-'}</p>
//                 </div> 
//                 <div className="flex gap-2 font-cabin text-xs tracking-tight">
//                     <p className="w-[150px] text-neutral-600">Status :</p>
//                     {((miscellaneousData1?.expenseHeaderStatus || expenseDataByGet?.expenseHeaderStatus) !== null) && (
//   <p className="text-neutral-700 capitalize">
//     {miscellaneousData1?.expenseHeaderStatus || expenseDataByGet?.expenseHeaderStatus}
//   </p>
// )}


//                 </div> 
                
//           </div>   */}
//     <div className="flex md:flex-row flex-col gap-2 justify-between w-full  ">
//   <div className=" md:w-1/5 w-full  flex  border-[1px] border-slate-300 rounded-md flex-row items-center gap-2 p-2 ">
//     <div className="bg-slate-200 rounded-full p-4 shrink-0 w-auto">
//       <img src={user_icon} className="w-[22px] h-[22px] "/>
//       </div>
// <div className='font-cabin '>
//       <p className=" text-neutral-600 text-xs ">Created By</p>
//      {((miscellaneousData1?.expenseHeaderStatus || expenseDataByGet?.expenseHeaderStatus) !== null) && (
//   <p className="text-purple-500 capitalize">
//     {headerDetails?.name  ||miscellaneousData1?.expenseHeaderStatus || expenseDataByGet?.expenseHeaderStatus}
//   </p>
// )}
// </div>
//   </div>
//   <div className="   flex md:w-3/5 w-full border-[1px] border-slate-300 rounded-md flex-row items-center gap-2 p-2 ">
//     <div className="bg-slate-200 rounded-full p-4 shrink-0 w-auto ">
//       <img src={receipt} className="w-5 h-5  "/>
//       </div>
//   <div className="flex flex-row justify-between w-full gap-2 ">
     
//       <div className=' flex-1 font-cabin  px-2 '>
//       <p className=" text-neutral-600 text-xs line-clamp-1">Expense Header No.</p>
     
//       <p className="text-purple-500 text-medium font-medium">{(miscellaneousData1?.expenseHeaderNumber || expenseDataByGet?.expenseHeaderNumber) ?? 'not available'}</p>
//       </div>

//       <div className=' flex-1 font-cabin  px-2 '>
//       <p className=" text-neutral-600 text-xs line-clamp-1">Status</p>
     
//       <p className="text-purple-500 text-medium font-medium capitalize">{(miscellaneousData1?.expenseHeaderStatus || expenseDataByGet?.expenseHeaderStatus) ?? 'not available'}</p>
//       </div>
      
//       </div> 
       
//   </div>
//   <div className="   flex md:w-1/5 w-full border-[1px] border-slate-300 rounded-md flex-row items-center gap-2 p-2 ">

//     <div className="bg-slate-200 rounded-full p-4 shrink-0 w-auto">
//       <img src={briefcase} className="w-4 h-4 "/>
//       </div>
  
//       <div className='font-cabin '>
//       <p className=" text-neutral-600 text-xs ">Default Currency</p>
//       <p className="text-purple-500 text-medium font-medium">{(headerDetails?.defaultCurrency?.shortName||miscellaneousData1?.defaultCurrency?.shortName || expenseDataByGet?.defaultCurrency?.shortName) ??  "not available"}</p>
//       </div>
     
      
//   </div>
 
 
   
        
   
       
   
// </div>   
            
//            </div>
//   )
// }