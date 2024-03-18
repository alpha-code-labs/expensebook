
///this copy is just befor do connection with backend


/* eslint-disable react/jsx-key */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */

import React,{ useState, useEffect , useRef} from "react";
import {BrowserRouter as Router, useParams} from 'react-router-dom';
import Icon from "../components/common/Icon";
import { titleCase, urlRedirection } from "../utils/handyFunctions";
import Button from "../components/common/Button";
import Error from "../components/common/Error";
import PopupMessage from "../components/common/PopupMessage";
import { cab_purple as cab_icon, airplane_1 as airplane_icon ,house_simple , chevron_down,  cancel, modify, check_tick, file_icon} from "../assets/icon";
import { tripDummyData, tripDummyDataLevel2 } from "../dummyData/tripDummyData.js";
import { hrDummyData } from "../dummyData/requiredDummy";
import Select from "../components/common/Select"; 
import ActionButton from "../components/common/ActionButton";
import Input from "../components/common/Input";
import Upload from "../components/common/Upload";
import { cancelTravelExpenseLineItemApi, getTravelExpenseApi, ocrScanApi, postMultiCurrencyForTravelExpenseApi, submitOrSaveAsDraftApi } from "../utils/api.js";
import Search from "../components/common/Search.jsx";
import GoogleMapsSearch from "./GoogleMapsSearch.jsx";
import { classDropdown } from "../utils/data.js";
import Toggle from "../components/common/Toggle.jsx";



export default function () {
  


 
//if ocr data will be there
  const ocrValues = {
   'Invoice Date' : "2024-12-12",
   'Flight number':" UA89765",
   'Class of Service': 'Executive',
   'Departure' :"Sandila",
   'Arrival': 'Lucknow', 
   'Airlines name': "Indira gandhi",
   'Travelers Name' : "Arti Yadav", 
  'Booking Reference Number': "", 
  'Total Amount' : "5000", 
  'Tax Amount':""
  }



  const [errorMsg,setErrorMsg]=useState({
    currencyFlag:{set:false,msg:""},//if currency is not in backend database for conversion
    totalAmount:{set:false,msg:""}, //"Total Amount"
    personalAmount:{set:true,msg:""}

  })



  const [formVisible , setFormVisible]=useState(false)// for line item form visible
  const {cancelFlag , tenantId,empId,tripId} = useParams() ///these has to send to backend get api
  const [activeIndex, setActiveIndex] = useState(null);

  const handleItemClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const [onboardingData, setOnboardingData] = useState(null);
  const [travelAllocationFlag, setTravelAllocationFlag] = useState(null);
  const [travelExpenseAllocation,setTravelExpenseAllocation]=useState(null);
  const [approversList , setApproversList]=useState([])//form get approverlist
  const [categoryfields , setCategoryFields]=useState(null) ///this is for get field after select the category

  const [selectedAllocations , setSelectedAllocations]=useState([])//for saving allocations on line saving line item
  const [settlementOptions, setSettlementOptions]=useState([])
  const [currencyTableData, setCurrencyTableData] = useState(null) //for get data after conversion
  
  const [selectedTravelType, setSelectedTravelType] = useState(null); /// for level 2 
  useEffect(() => {
      const onboardingData = tripDummyData;
    // const onboardingData = tripDummyDataLevel2; //level 2 dummy data
    // const onboardingData = bookAnExpenseDatalevel; //level 2 dummy data

    const travelAllocationFlags = onboardingData?.companyDetails?.travelAllocationFlags;
   
    const onboardingLevel = Object.keys(travelAllocationFlags).find((level) => travelAllocationFlags[level] === true);
    
    const settlementOptionArray =onboardingData?.companyDetails?.expenseSettlementOptions
    const settlementOptions = Object.keys(settlementOptionArray).filter((option) => settlementOptionArray[option]);
    const approversList1 = onboardingData?.approvers && onboardingData?.approvers?.map((approver)=>(approver?.name))
    setApproversList( approversList1)
    setSettlementOptions(settlementOptions)
    
    setTravelAllocationFlag(onboardingLevel);
    setOnboardingData(onboardingData);
    const expenseCategoryAndFields = onboardingData?.companyDetails?.travelExpenseCategories
   
      
      setCategoryFields(expenseCategoryAndFields) //this is for get form fields
    
    
   
   
    //for get level
    
     if(onboardingLevel=== 'level1'){
      const expenseAllocation= onboardingData?.companyDetails?.expenseAllocation
      setTravelExpenseAllocation(expenseAllocation) 
     }
     
  }, [onboardingData]);

  console.log('approvers',approversList)


  const [categoriesList , setCategoriesList] = useState([]); // this is handling travel categories name  arrya for level 1 and level 2
///for level 2 allocation & categories list after select the travel type

  useEffect(()=>{

    console.log('travel allocation after travel type selected')
    if (travelAllocationFlag=== 'level2'){
      const expenseAllocation= onboardingData?.companyDetails?.travelAllocations?.[selectedTravelType]?.expenseAllocation
      console.log('travel allocation level 2 ', expenseAllocation)

      setTravelExpenseAllocation(expenseAllocation)
      //level2
      const categories = categoryfields.find(category => category.hasOwnProperty(selectedTravelType)); 
      
      if (categories) {
        const categoryNames = categories[selectedTravelType].map(category => category.categoryName);
        console.log(`${selectedTravelType} categoryies` ,categoryNames);
        setCategoriesList(categoryNames);
      } else {
        console.log('International category not found');
      }
     }

  },[selectedTravelType])

   

  const defaultCurrency =  onboardingData?.companyDetails?.defaultCurrency ?? 'N/A'
  console.log('travelType', selectedTravelType)
  console.log(travelAllocationFlag)
  console.log('expense allocation',travelExpenseAllocation)
  // console.log('onboardingData',onboardingData)
  // console.log('categoryViseFields',categoryfields)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getTravelExpenseApi(tenantId, empId, tripId);
  
        if (response.error) {
          setLoadingErrMsg(response.error.message);
          setOnboardingData(null);
          console.log('data fetching is failed.')
        } else {
          setLoadingErrMsg(null);
          setOnboardingData(response.data);
          console.log('data fetched.')
  
          if (!response.data.currencyFlag) {
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              currencyFlag: { set: true, msg: "Currency not available, Please Contact Admin." },
            }));
            console.log("Currency is not found in onboarding");
          }
        }
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
  



  const [selectedCategory,setSelectedCategory]=useState(null)
   const [categoryFieldBySelect, setCategoryFieldBySelect]=useState([])
  const handleCategorySelection = (selectedCategory) => {
    setSelectedCategory(selectedCategory);
  };

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
        
        const initialFormValues =selectedCategory &&  Object.fromEntries(categoryFields1.map((field)=>[field.name , ocrValues?.[field.name] || '']))
        console.log('initial value',{...initialFormValues})
        setLineItemDetails({...initialFormValues})
      }

      //this has to do
      if(travelAllocationFlag==='level2'){
        const categories = categoryfields.find(category => category.hasOwnProperty(selectedTravelType)); 
        const desiredCategory =categories && categories?.[selectedTravelType].find(category => category.categoryName === selectedCategory);
      const categoryFields1 = desiredCategory?.fields.map(field => ({ ...field })) || [];
      console.log('categoryfieldafterselect the category',categoryFields1)
      setCategoryFieldBySelect(categoryFields1)        
        const initialFormValues =selectedCategory &&  Object.fromEntries(categoryFields1.map((field)=>[field.name , ocrValues?.[field.name] || '']))
        console.log('initial value',{...initialFormValues})
        setLineItemDetails({...initialFormValues})
      }
      
    },[selectedCategory])

    console.log('selected category',selectedCategory)



    const [lineItemDetails , setLineItemDetails]=useState()//line item save
 
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
   

    const DASHBOARD_URL=`http://localhost:3000/${tenantId}/${empId}`
    const [showPopup, setShowPopup] = useState(false)
    const [message, setMessage] = useState(null)
    
    const [travelRequestStatus, setTravelRequestStatus] = useState('pending approval')
    const [isUploading , setIsUploading]=useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const [expenseLineForm, setExpenseLineForm]= useState({
      totalAmount:"",
      personalFlag:"",
    })

    const [selectedFile ,setSelectedFile]=useState(null)
    const [fileSelected,setFileSelected]=useState(null)
 

    const [personalFlag,setPersonalFlag]=useState(false)




    const [showCancelModal, setShowCancelModal] = useState(false)
    const [ rejectionReason,setRejectionReason] =useState(null)
  
const handlePersonalFlag=()=>{
  setPersonalFlag((prev)=>(!prev))
  
}


useEffect(()=>{
  
   if(!personalFlag){
    setLineItemDetails(({...lineItemDetails, personalExpenseAmount:"" ,isPersonalExpense:false}))
   }
  

},[personalFlag])




//level-1 store selected allocation in array
const onAllocationSelection = (option, headerName) => {
  // Create a new allocation object
  const newAllocation = { headerName: headerName, headerValue: option };
  setSelectedAllocations((prevAllocations) => [...prevAllocations, newAllocation]);
};





const onReasonSelection = (option) => {
        setRejectionReason(option)
        console.log(option)
    }
    const [selectDropdown , setSelectDropdown]= useState(null)

    const handleDropdownChange = (value, dropdownType) => {
      if (dropdownType === 'Class' || dropdownType === 'Class of Service') {
        const key = dropdownType === 'Class' ? 'Class' : 'Class of Service';
        setLineItemDetails((prevState) => ({ ...prevState, [key]: value }));
      } else if (dropdownType === 'categoryName') {
        setExpenseLineForm({ ...expenseLineForm, categoryName: value });
      } else if (dropdownType === 'currencyName') {
        setLineItemDetails((prevState) => ({ ...prevState, currencyName: value }));
        setSelectDropdown(value);
      }
    };

    console.log(lineItemDetails?.personalExpenseAmount)
  // const handleInputChange=(e)=>{
  //   const {name , value} = e.target
  //   setLineItemDetails((prevState)=>({...prevState,[name]:value}))

  // }
  const handleInputChange=(name, value)=>{
    console.log(`Updating ${name} with value:`, value);
    setLineItemDetails((prevState) => ({ ...prevState, [name]: value || "" }));
    
  }

  ///handle convertor to exchagne value behalf of default currency
  const handleConverter = async (data ) => { 
    const { Currency, personalExpenseAmount, 'Total Amount': totalAmount, 'Total Fare': totalFare } = data || {};


    let allowForm = true;
  
    if (totalAmount === "" || totalFare === "") {
      setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: true, msg: "Enter total amount" } }));
      allowForm = false;
    } else {
      setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: false, msg: "" } }));
    }
  
    if (personalFlag && (personalExpenseAmount === "" || personalExpenseAmount === undefined)) {

      setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: true, msg: "Enter personal amount" } }));
      allowForm = false;

    } else {
      setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: false, msg: "" } }));
      allowForm = false;
    }

    const nonPersonalAmount = (totalAmount || totalFare) - personalExpenseAmount;
    
    const validPersonalAmount =( totalAmount || totalFare ) - personalExpenseAmount
    if (validPersonalAmount <0 ) {
      setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: true, msg: "Personal Expense amount should be less than Total Expenditure" } }));
      allowForm = false;
    }
    
    console.log(`total amount is ${totalAmount} and personal amount is ${personalExpenseAmount}`)
    
  
    if (allowForm) {
     
      const convertDetails = {
        currencyName: Currency,
        personalExpense: personalExpenseAmount || "",
        nonPersonalExpense: nonPersonalAmount || "",
        totalAmount: totalAmount || totalFare,
       
      };
      console.log('sent converted details',convertDetails)
    
      ///api 
    try{
      setIsLoading(true)
      const response= await postMultiCurrencyForTravelExpenseApi(tenantId, convertDetails)
      if(response.error){
        setLoadingErrMsg(response.error.message)
        setCurrencyTableData(null)
      }else{
        setLoadingErrMsg(null)
        setCurrencyTableData(response.data) //here it war response
        if(!currencyTableData.currencyFlag){              
          setErrorMsg((prevErrors)=>({...prevErrors,currencyFlag:{set:true,msg:"Currency not available,Please Contact Admin."}}))
          console.log("currency is not found in onboarding")
        }
      }
    }catch(error){
      setLoadingErrMsg(error.message)
      setMessage(error.message)
      setShowPopup(true)
      setTimeout(() => {
        setShowPopup(false)
      }, 3000);
      
    } finally{
      setIsLoading(false);
    }
     
      

  

    }
  };


    const [formData, setFormData] = useState(null); //this is for get expense data
    const [getExpenseData, setGetExpenseData]=useState(); //to get data header level 
    const [getSavedAllocations,setGetSavedAllocations]=useState()  ///after save the allocation then i will get next time from here 
    const [openModal,setOpenModal]=useState(null);
    // const [openModal,setOpenModal]=useState(false);
    const [openLineItemForm,setOpenLineItemForm]=useState(true)
    const [headerReport,setHeaderReport]=useState(null)


    const [editLineItemById, setEditLineItemById]=useState(null)
  
  
    useEffect(() => {

        const tripData = tripDummyData
        // const hrData= hrDummyData
        const expenseData= tripDummyData.travelExpenseData //get line items
        console.log('expenseData',expenseData)   
        ///where is newExpenseReport = true
        const headerReportData = expenseData.find((expense) => expense.newExpenseReport);
        setHeaderReport(headerReportData)
        setFormData({...tripData})
        // setGetSavedAllocations({...hrData});
        setGetExpenseData([...expenseData]);
        setTravelRequestStatus(tripData)
        setIsLoading(false)
      },[])


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

     const handleCancelExpenseHeader=()=>{
        console.log("cancel header")
     }



    // console.log("getExpenseData",getExpenseData)
///----------------------------------------  




//handler for  submit and draft
const handleSubmitOrDraft=async(action)=>{
    const expenseHeaderId="expenshhID"
    console.log('submit')
    
    setIsLoading(true)

    try{
        await submitOrSaveAsDraftApi(action,tenantId,empId,tripId,expenseHeaderId,headerReport)
        setIsLoading(false)
        setShowPopup(true)
        setMessage("HeaderReport has been submitted.")
        setTimeout(()=>{
          setShowPopup(false)
          urlRedirection(DASHBOARD_URL)
        },5000)
  
      }catch(error){
        setShowPopup(true)
        setMessage("try again")
        setTimeout(()=>{
          setShowPopup(false)
        },3000)
        console.error('Error confirming trip:', error.message);
      }  

    }


//handle save line items

    const handleSaveLineItemDetails = () => { 
      // Create a new object with the updated category
      
      const expenseLines = { ...lineItemDetails, category: selectedCategory ,isPersonalExpense:personalFlag , document : fileSelected ? selectedFile : ""};  
      // Set the updated line item details
      // setLineItemDetails((prevState)=>({...prevState ,expenseLines}));
      //for companyDetails
      const companyDetails = onboardingData?.companyDetails
      // Log the updated details
      let dataWithCompanyDetails 
       dataWithCompanyDetails={
        companyDetails:companyDetails,
        expenseLines:[expenseLines],
        // expenseLines:[{...expenseLines}],
        allocations: selectedAllocations
      }

     if(travelAllocationFlag==='level2'){
      dataWithCompanyDetails = {...dataWithCompanyDetails , travelType:selectedTravelType}
     }
      console.log('save line item', dataWithCompanyDetails)
      setSelectedCategory(null)
    };


  
    

    const handleDeleteLineItem=async(lineItemId)=>{
      try{
        setIsLoading(true)
        const response= await cancelTravelExpenseLineItemApi(lineItemId) //pass tripId, headerexpense report and lineItemId
        if(response.error){
          setLoadingErrMsg(response.error.message)
          setCurrencyTableData(null)
        }else{
          setLoadingErrMsg(null)
          setLoadingErrMsg(response.data) 
        }
      }catch(error){
        setLoadingErrMsg(error.message)
        setMessage(error.message)
        setShowPopup(true)
        setTimeout(() => {
          setShowPopup(false)
        }, 3000);
        
      } finally{
        setIsLoading(false);
      }

    }


console.log('all categoryfields',categoryfields)



///////////////////----------modify lineitem start



const handleModifyLineItem = () => {
  const expenseLines = { ...lineItemDetails, category: selectedCategory ,isPersonalExpense:personalFlag , document : fileSelected ? selectedFile : ""};  
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

const [ocrFileSelected , setOcrFileSelected]=useState(false)
const [ocrSelectedFile , setOcrSelectedFile]=useState(null)
const [ocrField , setOcrField]=useState(null)




const handleOcrScan = async () => {
  // console.log('ocrfile from handle', ocrSelectedFile);

  const ocrData = new FormData();
    ocrData.append('categoryName', selectedCategory);
    ocrData.append('file', ocrSelectedFile);

  console.log('ocrfile from handle',ocrData)

  try {
    setIsUploading(true);

    // Assuming ocrScanApi is an asynchronous function
    const response = await ocrScanApi(ocrData);

    if (response.error) {
      setLoadingErrMsg(response.error.message);
      setCurrencyTableData(null);
    } else {
      setLoadingErrMsg(null);
      setOcrField(response.data);

      if (!currencyTableData.currencyFlag) {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          currencyFlag: { set: true, msg: 'OCR failed, Please try again' },
        }));
        console.log('Currency is not found in onboarding');
      }
    }
  } catch (error) {
    setLoadingErrMsg(error.message);
    setMessage(error.message);
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  } finally {
    setIsUploading(false);
  }
};

/////////-------------------google search start----------------------------------
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
}, [selectedCategory]);

////---------------------------google search end--------------------------

console.log('categoryfields by selected', categoryFieldBySelect)
  return <>
{/* <Error message={loadingErrMsg}/> */}
    {isLoading && <Error/>}
    {loadingErrMsg&& <h2>{loadingErrMsg}</h2>}
      {!isLoading && 
        <div className="w-full h-full relative bg-white-100 md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
        {/* app icon */}
        <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
            <Icon/>
        </div>

       

        {/* Rest of the section */}
        <div className="w-full h-full mt-10 p-10 font-cabin tracking-tight">
        <div>
               Expense Type: Travel
        </div>

        {/* ///-level2 - */}
{travelAllocationFlag === 'level2' && <div className="flex flex-col md:flex-row gap-4 justify-evenly">  
   
   <div  onClick={() => setSelectedTravelType('international')} className={`flex gap-x-4 flex-row items-center ${selectedTravelType === 'international' ? 'border border-indigo-600' : 'border border-neutral-400'} max-w-[350px] accent-indigo-600 px-6 py-2 rounded`}>
     <div className={`w-[20px] h-[20px] ${selectedTravelType === 'international' ? 'bg-indigo-600 border border-indigo-600' : 'border border-neutral-400'} flex items-center justify-center rounded-sm`}>
       {selectedTravelType === 'international' && <img src={check_tick} alt="Check Icon" className='w-[20px] h-[20px] rounded-sm' />}
     </div>

     <div>
       <p className='font-Cabin text-neutral-800 text-lg tracking-wider'> International </p>
       <p className='font-Cabin -mt-1 text-neutral-600 text-sm tracking-tight'>Travelling out of country</p>
     </div>
   </div>

   <div onClick={() => setSelectedTravelType('domestic')} className={`flex gap-x-4 flex-row items-center ${selectedTravelType === 'domestic' ? 'border border-indigo-600' : 'border border-neutral-400'} max-w-[350px] accent-indigo-600 px-6 py-2 rounded `}>
     <div className={`w-[20px] h-[20px] ${selectedTravelType === 'domestic' ? 'bg-indigo-600 border border-indigo-600' : 'border border-neutral-400'} flex items-center justify-center rounded-sm`}>
       {selectedTravelType === 'domestic' && <img src={check_tick} alt="Check Icon" className='w-[20px] h-[20px] rounded-sm' />}
     </div>

     <div>
       <p className='font-Cabin text-neutral-800 text-lg tracking-wider'> Domestic </p>
       <p className='font-Cabin -mt-1 text-neutral-600 text-sm tracking-tight'>Travelling within the country</p>
     </div>
   </div>

   <div onClick={() => setSelectedTravelType('local')}  className={`flex gap-x-4 flex-row items-center ${selectedTravelType === 'local' ? 'border border-indigo-600' : 'border border-neutral-400'} max-w-[350px] accent-indigo-600 px-6 py-2 rounded `}>
     <div className={`w-[20px] h-[20px] ${selectedTravelType === 'local' ? 'bg-indigo-600 border border-indigo-600' : 'border border-neutral-400'} flex items-center justify-center rounded-sm`}>
       {selectedTravelType === 'local' && <img src={check_tick} alt="Check Icon" className='w-[20px] h-[20px] rounded-sm' />}
     </div>

     <div>
       <p className='font-Cabin text-neutral-800 text-lg tracking-wider'> Local </p>
       <p className='font-Cabin -mt-1 text-neutral-600 text-sm tracking-tight'>Travelling nearby</p>
     </div>
   </div>
</div>  }
        {/* ///-level2- */}

        <div>
          <AllocationComponent travelAllocationFlag={travelAllocationFlag} travelExpenseAllocation={travelExpenseAllocation} onAllocationSelection={onAllocationSelection}/>
        </div>
        
        <div>
          <ExpenseHeader cancelFlag={cancelFlag}
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
            <Button disabled={selectedCategory !== null} onClick={()=>handleOpenModal('category')} text={"Add Line Item"}/>
            </div>
            <div className=" w-full flex flex-row mt-5">
             
  <div className="flex flex-col w-full">         
      <div className="container mx-auto ">
      <h1 className="text-2xl font-bold mb-4">Header Report</h1>
      {getExpenseData.map((item,index)=>(
       <div key={index} className="mb-4">
          <div
            className="flex justify-between items-center bg-gray-200 p-4 cursor-pointer"
            onClick={() => handleItemClick(index)}
          >
            <div>{`Header Report Number : ${item?.expenseHeaderNumber ?? 'N/a'}`}</div>
            <div>{activeIndex === index ? '▲' : '▼'}</div>
          </div>
          {activeIndex === index && (
            <div className="bg-white p-4">
{/* ///already booked travel details */}
<div className="mt-5 flex flex-col gap-4">
{['flights', 'trains', 'buses', 'cabs', 'hotels'].map((itnItem, itnItemIndex) => {
  if (item?.alreadyBookedExpenseLines && item.alreadyBookedExpenseLines[itnItem]?.length > 0) {
    return (
      <div key={itnItemIndex}>
        <details>
          <summary>
            <p className="inline-flex text-xl text-neutral-700">
              {`${titleCase(itnItem)} `}
            </p>
          </summary>
          <div className='flex flex-col gap-1'>
            {item.alreadyBookedExpenseLines[itnItem].map((item, itemIndex) => {
              if (['flights', 'trains', 'buses'].includes(itnItem)) {
                return (
                  <div key={itemIndex}>
                    <FlightCard
                      // onClick={()=>handleCancel(itnItem.slice(0, -1), itemIndex, item.formId, item.isReturnTravel)} 
                      from={item.from} 
                      to={item.to} 
                      itnId={item.itineraryId}
                      // handleLineItemAction={handleLineItemAction}
                      showActionButtons={travelRequestStatus !== 'pending approval' && item.status == 'pending approval'}
                      date={item.date} time={item.time} travelClass={item.travelClass} mode={titleCase(itnItem.slice(0, -1))} />
                  </div>
                );
              } else if (itnItem === 'cabs') {
                return (
                  <div key={itemIndex}>
                    <CabCard 
                      itnId={item.itineraryId}
                      from={item.pickupAddress} to={item.dropAddress} date={item.date} time={item.time} travelClass={item.travelClass} isTransfer={item.type !== 'regular'} />
                  </div>
                );

              } else if (itnItem === 'hotels') {
                return (
                  <div key={itemIndex}>
                    <HotelCard 
                      itnId={item.itineraryId}        
                      checkIn={item.checkIn} checkOut={item.checkOut} date={item.data} time={item.time} travelClass={item.travelClass} mode='Train' />
                  </div>
                );
              }
            })}
          </div>
        </details>
      </div>
    );
  }
  return null; // Return null if no items in the itinerary
})}
</div>
{/* ///alreadybooked travel details */}

{/* ///saved lineItem */}







{/* get lineitem data from backend start*/}

{item.expenseLines.map((lineItem, index) => (

    lineItem._id === editLineItemById ? 
    (
    <EditForm 
    handleConverter={handleConverter} 
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

<EditView lineItem={lineItem} index={index} newExpenseReport={item.newExpenseReport} setSelectedCategory={setSelectedCategory} setEditLineItemById={setEditLineItemById} handleDeleteLineItem={handleDeleteLineItem}/>
</div>
</>
  ))}
{/* </div> */}

{/* get lineItem data from backend end*/}


{/* </div> */}



 </div>
          )}
        </div>))}
      
 </div>

{/*start new //lineItemform */}
 {formVisible &&  
<div className=" w-full flex flex-col  lg:flex-row">

<div className="border w-full lg:w-1/2">
 <DocumentPreview selectedFile={selectedFile}/>
</div>
<div className="border w-full lg:w-1/2 lg:h-[700px] overflow-y-auto scrollbar-hide">
<div className="w-full flex items-center justify-start h-[52px] border px-4 ">
      <p className="text-zinc-600 text-medium font-semibold font-cabin">   Category -{titleCase(selectedCategory ?? '')}</p>
    </div>
    <>
    
<div className=" w-full flex-wrap flex flex-col justify-center items-center p-2">

    {/* <div className="w-1/2">
      <Search 
      title="Category" 
      placeholder='Select Category' 
      options={categoriesList}
      onSelect={(category)=>handleCategorySelection(category)}/>
     </div>*/}

 <div className="w-full flex-row  border">
  <div className="w-full border flex flex-wrap  items-center justify-center">
{selectedCategory&&categoryFieldBySelect && categoryFieldBySelect.map((field)=>(
          <>
  <div key={field.name} className="w-1/2 flex justify-center items-center px-4">
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
          <div className=" w-full translate-y-[-6px] z-20">
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
          title={field.name}
          name={field.name}
          type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
          placeholder={`Enter ${field.name}`}
          value={lineItemDetails[field.name || '']}
          inputRef={autocompleteRefs[field.name] || (autocompleteRefs[field.name] = useRef())}
          onChange={(value)=>handleInputChange(field.name , value)}
        />
      )}     
          </div>        
          </>
         ))}
         </div>

{/* //personal expense */}




<div className='flex flex-col px-4 justify-between'>

<div className="flex flex-row justify-evenly items-center h-[73px]"> 
<div className="flex-1 bg-white-100">
<Toggle label={'Personal Flag'} initialValue={false}  onClick={handlePersonalFlag}/>
</div>
{console.log('perosnal amount error',errorMsg.personalAmount)}
<div className=" flex-1 pl-2 justify-end">
  <div className="w-full max-w-[350px]">
  {personalFlag &&
  <Input
  title='Personal Amount'
  error={errorMsg?.personalAmount}
  
  name='personalExpenseAmount'
  type={'text'}
  value={lineItemDetails.personalExpenseAmount || ""}
  onChange={(value)=>handleInputChange( ['personalExpenseAmount'],value)}
  />}

</div>
</div>
</div> 

 

{/* //personal expense */}


{/* {currencyTableData?.currencyFlag &&
<div className="w-1/2 text-sm ">
  <div>
    <h2>Converted Amount Details:</h2>
    <p>total amount: {currencyTableData?.convertedAmount ?? " - "}</p>
    {
      lineItemDetails?.personalFlag  &&
      (<div>
        <p>personal amount: {currencyTableData?.convertedPersonalAmount ?? " - "}</p>
        <p>Non Personal Amount: {currencyTableData?.convertedNonPersonalAmount ?? " - "}</p>
        </div>
      )
     
    }
    

  </div>

</div>
 } */}

<div className="relative">
<div className=" h-[48px] w-[100px]  mb-10 mr-28 mt-[-10px] ">
   <Select
       title='Currency'
       currentOption={'AUD'}
       placeholder="Select Currency"
       options={['INR',"USD",'AUD']} 
       onSelect={(value)=>{setLineItemDetails({...lineItemDetails,['Currency']:value}),setSelectDropdown(value)}}
       
       violationMessage="Your violation message" 
       error={{ set: true, message: "Your error message" }} 
       />

</div>  

{/* ////-------- */}
<div className='absolute top-6 left-[210px] w-fit'>
{selectDropdown == null || selectDropdown !== defaultCurrency   &&
<ActionButton text="Convert" onClick={()=>handleConverter(lineItemDetails)}/>
}
</div>
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
<div className="w-full mt-5 px-4" >
 <Button text="Save" 
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
            {openModal =='category' && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none" >
                <div className='z-10 max-w-4/5 w-2/5 min-h-4/5 max-h-4/5 scroll-none bg-white-100  rounded-lg shadow-md'>
                <div onClick={()=>{setOpenModal(null);}} className=' w-10 h-10 flex mr-5 mt-5 justify-center items-center float-right   hover:bg-red-300 rounded-full'>
                      <img src={cancel} className='w-8 h-8'/>
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
                            <Button variant='fit' text='Scan Bill' onClick={()=>handleOpenModal('upload')} disabled={selectedCategory== null}/>
                            <Button variant='fit' text='Manually' onClick={()=>{setOpenLineItemForm(true);setOpenModal(false);setFormVisible(true)}} disabled={selectedCategory== null}/>
                        </div>
                        </div>

                    </div>
                </div>
                </div>
            }
            {openModal==='upload' && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none" >
                <div className='z-10 max-w-4/5 w-2/5 min-h-4/5 max-h-4/5 scroll-none bg-white-100  rounded-lg shadow-md'>
                <div onClick={()=>{setOpenModal(null);setOcrSelectedFile(null);setOcrFileSelected(false);setSelectedCategory(null)}} className=' w-10 h-10 flex justify-center items-center float-right  mr-5 mt-5 hover:bg-red-300 rounded-full'>
                      <img src={cancel} className='w-8 h-8'/>
                      </div>
                    <div className="p-10">
                    
                      <div className="flex flex-col justify-center items-center">
                       

                       
                        {ocrFileSelected ? 
                        
                        <div className="w-full  flex flex-col justify-center h-[500px]  overflow-x-auto">
                        <p>Document Name: {ocrSelectedFile.name}</p>
                        <div className={` w-fit`}>
                        <Button disabled={isUploading}  text='reupload' onClick={()=>{setOcrFileSelected(false);setOcrSelectedFile(null)}}/>
                        </div>
                        {/* <p>Size: {selectedFile.size} bytes</p>
                        <p>Last Modified: {selectedFile.lastModifiedDate.toString()}</p> */}
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

                         <Button loading={isUploading} variant='fit' text='Scan' onClick={handleOcrScan} disabled={selectedCategory== null}/>
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

function AllocationComponent ({travelExpenseAllocation ,travelAllocationFlag , onAllocationSelection}) {
  const validAllocationFlags = ['level1', 'level2'];
  return(
     <div  className="flex md:flex-row flex-col my-5 justify-evenly items-center flex-wrap">            
             
         {validAllocationFlags.includes(travelAllocationFlag)  && travelExpenseAllocation && travelExpenseAllocation.map((expItem , index)=>(
              <>
             
              <div key={index}  className="h-[48px] inline-flex my-4 mx-2">
               
                <Select 
                  options={expItem.headerValues}
                  onSelect={(option) => onAllocationSelection(option, expItem.headerName)}
                  placeholder='Select Allocation'
                  title={`${titleCase(expItem.headerName ?? "")}`}
                />
               
              </div>
              </>
       ))}       
     </div> )}




///expense details on header
function ExpenseHeader({formData
   ,approversList
   ,onReasonSelection
   ,settlementOptions,
    defaultCurrency,
    cancelFlag,
    handleCancelExpenseHeader,
    handleSubmitOrDraft,
   }){
  return(
    <>
    <div className='flex flex-col md:flex-row mb-2 justify-between items-center'>
              <div>
                <p className="text-2xl text-neutral-600 mb-5">{`${formData?.tripPurpose?? "N/A"}`}</p>
              </div>
                <div className="inline-flex gap-4 justify-center items-center">
                    {cancelFlag ?
                    
                    (<div className="flex mt-10 flex-row-reverse">
                    <Button variant='fit' text='Cancel' onClick={()=>handleCancelExpenseHeader}/>
                   </div>):
                  
                    (<>
                    <div className="flex mt-10 flex-row-reverse">
                    <Button text='Save as Draft' onClick={()=>handleSubmitOrDraft("save as draft")}/>
                   </div>
                    <div className="flex mt-10 flex-row-reverse">
                    <Button variant='fit' text='Submit' onClick={()=>handleSubmitOrDraft("submit")}/>
                   </div>
                   </>)}
                   

                   
                   
                </div>
             
            </div>

    <div className="flex flex-col md:flex-row justify-between items-center">
<div>
    <div className="flex gap-2 font-cabin text-xs tracking-tight">
        <p className="w-[200px] text-neutral-600">Created By:</p>
        <p className="text-neutral-700">{formData?.userId?.name}</p>
    </div>
    <div className="flex gap-2 font-cabin text-xs tracking-tight">
        <p className="w-[200px] text-neutral-600">Trip Number:</p>
        <p className="text-neutral-700">{formData?.tripNumber?? "not available"}</p>
    </div>
    <div className="flex gap-2 font-cabin text-xs tracking-tight">
        <p className="w-[200px] text-neutral-600">Total CashAdvance:</p>
        <p className="text-neutral-700">{formData?.expenseAmountStatus?.totalCashAmount??"not available"}</p>
    </div>
    <div className="flex gap-2 font-cabin text-xs tracking-tight">
        <p className="w-[200px] text-neutral-600">Default Currency:</p>
        <p className="text-neutral-700">{defaultCurrency}</p>
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


<div>
<Select 
  options={settlementOptions}
  onSelect={onReasonSelection}
  placeholder='Select Travel Expense '
  title="Expense Settlement"
/>

</div>
</div>
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
            <div className="flex-1">
                {titleCase(from)}     
            </div>
            
            <div className="flex-1">
                {amount??'N/A'}
            </div>
            <div className='flex-1'>
                <input type="checkbox" checked={true}/>
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
                <input type="checkbox" checked/>
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
                <input type="checkbox" checked/>
            </div>
        </div>
    </div>
  
    </div>)
}



function EditView({lineItem, index ,newExpenseReport ,setEditLineItemById,setSelectedCategory, handleDeleteLineItem}){

  return(
    <>
<div className="border w-full lg:w-1/2">
  {/* {lineItem.Document} */}
  <DocumentPreview initialFile={lineItem.Document}/>
</div>
<div className="border w-full lg:w-1/2">
    <div className="w-full flex-row  border">
     
     <div className="w-full flex justify-between items-center  h-[52px]  px-4 ">
      <p className="text-zinc-600 text-medium font-semibold font-cabin">Sr. {index+1} </p>
      <p className="text-zinc-600 text-medium font-semibold font-cabin">   Category -{titleCase(lineItem.categoryName)}</p>
    </div>   
    <div key={index} className="w-full  border flex flex-wrap items-start  justify-between py-4 px-4">
        {Object.entries(lineItem).map(([key, value]) => (

    key!== 'travelType' && value !== "" &&   key!== 'categoryName' && key!== 'isPersonalExpense' &&    key !== '_id' && key !== 'policyViolation' && key !== 'document' &&(

              <>
        <div className="min-w-[180px] w-full md:w-fit   flex-col justify-start items-start ">
                    
        <div className="text-zinc-600 text-sm font-cabin">{titleCase(key)}</div>
        
    
        <div className=" w-auto md:max-w-[180px] overflow-x-scroll  overflow-hidden scrollbar-hide h-full bg-white items-center flex border border-neutral-300 rounded-md ">
        
      
              <div key={key}>
                <div className="text-neutral-700  truncate  w-full h-full text-sm font-normal font-cabin px-6 py-2 ">
                 
                  {` ${value}`}
                </div>
               
              </div>
              
           
        </div>
        <div className=" w-full text-xs text-yellow-600   font-cabin">{['policyViolation']}</div>
        </div>
        </>
         )
         ))}
         
      {
      // item.newExpenseReport 
      newExpenseReport &&
          <div className="w-full mt-5 m-4 flex justify-end gap-4" >
            <Button text="Edit"   onClick={()=>(setEditLineItemById(lineItem._id,setSelectedCategory(lineItem.categoryName)))} />
            <Button text="Delete" onClick={()=>(handleDeleteLineItem(lineItem._id))} />
          </div>
      }    
    </div>
    
    </div>
</div>

</>
  )
}




function EditForm({selectedCategory, travelAllocationFlag ,categoryfields ,lineItemDetails,classDropdownValues,lineItem,defaultCurrency,handleConverter }){

  const[ personalFlag , setPersonalFlag]=useState()
  const[categoryFields, setCategoryFields]=useState(null)
  const [initialFile , setInitialFile]=useState(null)
  useEffect(() => {
    // Set the initial file when the component is mounted
    setInitialFile(lineItem.Document);
  }, []);

 useEffect(()=>{
  if(travelAllocationFlag ==='level2'){
    const internationalData = categoryfields && categoryfields.find(
      (category) => category.hasOwnProperty(lineItem.travelType)
    )?.international;
    setCategoryFields(internationalData)
    console.log('level2 fields after got travelType',internationalData)
  }
  if(travelAllocationFlag ==='level1'){
    setCategoryFields(categoryfields)
  }

 },[])
 
  

  const handlePersonalFlag=()=>{
     setPersonalFlag((prev)=>(!prev))
     if(!personalFlag){
     setEditFormData((prevData)=>({...prevData, isPersonalExpense: false , personalExpenseAmount:""}))
    }else{
       setEditFormData((prevData) => ({ ...prevData, isPersonalExpense:true}))

  }}

  const [editFormData ,setEditFormData]=useState(lineItem)
  const [selectedCurrency , setSelectedCurrency]=useState(null)

  const [selectedFile ,setSelectedFile]=useState(null)
  const [fileSelected,setFileSelected]=useState(false)

   

  useEffect(()=>{
    if (fileSelected) {
      setEditFormData((prevData)=>({
        ...prevData,
        ['Document']: selectedFile,
      }));
    }
  },[(selectedFile)])

    const handleEditChange = (key , value)=>{

      setEditFormData((prevData)=>({...prevData , [key]: value}))
      
    }


    const handleEditLineItem =()=>{

      console.log('editFormData',editFormData)

    }

  return(
    <>
    <div className="flex flex-col lg:flex-row border">
    <div className="border w-full lg:w-1/2">
    <div className='w-full  border  flex justify-center items-center px-4 py-4'>
       <DocumentPreview selectedFile={selectedFile} initialFile={initialFile}/>
    </div>
    </div>
    <div className="border w-full lg:w-1/2 max-h-[800px] scrollbar-hide overflow-hidden overflow-y-auto">
    <div className="w-full flex items-center justify-start h-[52px] border px-4 ">
      {/* <p className="text-zinc-600 text-medium font-semibold font-cabin">Sr. {index+1} </p> */}
      <p className="text-zinc-600 text-medium font-semibold font-cabin">   Category -{titleCase(lineItem.categoryName)}</p>
    </div> 
    
      <div  className="w-full border flex flex-wrap items-start justify-between py-4 px-2">

   {/* <div className="w-full border flex flex-wrap items-center justify-center"> */}
  {selectedCategory && categoryFields && categoryFields.find((category)=>category.categoryName === selectedCategory).fields.map((field)=>(
          <>
  <div key={field.name} >

    {field.name === 'From' || field.name === 'To' || field.name === 'Departure' || field.name === 'Pickup Location' ||field.name === 'DropOff Location' || field.name === 'Arrival' ? (
       <>       
        <Input
        id="pac-input"
        title={field.name}
        name={field.name}
        initialValue={editFormData[field.name]}
        type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
        placeholder={`Enter ${field.name}`}
        onChange={(value)=> handleEditChange(field.name , value)}
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
          type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
          placeholder={`Enter ${field.name}`}
          initialValue={editFormData[field.name]}
          onChange={(value)=> handleEditChange(field.name,value)}
        />
      )}
           
          </div>
          </>
         ))}       

{/* //personal expense */}
<div className='flex flex-col  justify-between w-full'>
<div className="flex flex-row gap-4">
<div className="w-1/2 flex-row  h-[52px] flex items-center justify-center  mb-5">

<div className="w-[100px] flex flex-col">
<div>
{/* <ActionButton variant='red' text={personalFlag ? "NO"  : "YES" } onClick={handlePersonalFlag}/> */}
<Toggle label={'Personal Flag'} initialValue={lineItem.isPersonalExpense || false} checked={personalFlag} onClick={handlePersonalFlag}/>
</div>
</div>
</div>

<div className="w-1/2">
{!personalFlag &&
<Input
title='Personal Amount'
// error={ errorMsg.personalAmount}
name='personalAmount'
type={'text'}
initialValue={editFormData['personalExpenseAmount']}
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
       placeholder="Select Currency"
       options={['INR',"USD",'AUD']} //this data will get from currency  api
      //  onSelect={(value) => handleDropdownChange(value, 'currencyName')}
      currentOption={lineItem['Currency']}
       violationMessage="Your violation message" 
       error={{ set: true, message: "Your error message" }} 
       onSelect={(value) =>{ handleEditChange('Currency',value),setSelectedCurrency(value)}}
       />
</div>  

<div className="w-fit">
{ selectedCurrency == null || selectedCurrency !== defaultCurrency   &&

<ActionButton text="Convert" onClick={()=>handleConverter(editFormData)}/>

// {/* {currencyTableData?.currencyFlag ? <h2>Coverted Amount: {currencyTableData?.convertedAmount ??" converted amt not there"}</h2> : <h2 className='text-red-500'>{errorMsg.currencyFlag.msg}</h2>} */}

}  

</div>
 
</div>

{/* {currencyTableData?.currencyFlag &&
<div className="w-1/2 text-sm ">
  <div>
    <h2>Converted Amount Details:</h2>
    <p>total amount: {currencyTableData?.convertedAmount ?? " - "}</p>
    {
      lineItemDetails?.personalFlag  &&
      (<div>
        <p>personal amount: {currencyTableData?.convertedPersonalAmount ?? " - "}</p>
        <p>Non Personal Amount: {currencyTableData?.convertedNonPersonalAmount ?? " - "}</p>
        </div>
      )
     
    }
    

  </div>

</div>
 } */}


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
  onClick={handleEditLineItem} />
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
          <p>Selected File: {selectedFile.name}</p>
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










// /* eslint-disable react/jsx-key */
// /* eslint-disable react-refresh/only-export-components */
// /* eslint-disable react/display-name */

// import React,{ useState, useEffect , createRef} from "react";
// import {BrowserRouter as Router, useParams} from 'react-router-dom';
// import Icon from "../components/common/Icon";
// import { titleCase, urlRedirection } from "../utils/handyFunctions";
// import Button from "../components/common/Button";
// import Error from "../components/common/Error";
// import PopupMessage from "../components/common/PopupMessage";
// import { cab_purple as cab_icon, airplane_1 as airplane_icon ,house_simple , chevron_down,  cancel, modify, check_tick} from "../assets/icon";
// import tripDummyData from "../dummyData/tripDummyData";
// import { bookAnExpenseDatalevel, hrDummyData } from "../dummyData/requiredDummy";
// import Select from "../components/common/Select";
// import ActionButton from "../components/common/ActionButton";
// import Input from "../components/common/Input";
// import Upload from "../components/common/Upload";
// import { cancelTravelExpenseLineItemApi, getTravelExpenseApi, ocrScanApi, postMultiCurrencyForTravelExpenseApi, submitOrSaveAsDraftApi } from "../utils/api.js";
// import { bookAnExpenseData } from "../dummyData/requiredDummy";
// import Dropdown from "../components/common/DropDown.jsx";
// import Search from "../components/common/Search.jsx";
// import GoogleMapsSearch from "./GoogleMapsSearch.jsx";
// import { classDropdown } from "../utils/data.js";
// import Toggle from "../components/common/Toggle.jsx";



// const approvalOptions=["Aarav Singh", "Arnav Patel"]

// export default function () {

//   const mapRef = createRef();
//   const inputRef = createRef();



//   useEffect(() => {
//     const loadMap = () => {
//       const map = new window.google.maps.Map(mapRef.current, {
//         center: { lat: -33.8688, lng: 151.2195 },
//         zoom: 13,
//          // Apply your custom map styles here if any
//       });

//       const input = inputRef.current;
//       const searchBox = new window.google.maps.places.SearchBox(input);

//       map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

//       map.addListener('bounds_changed', () => {
//         searchBox.setBounds(map.getBounds());
//       });

//       let markers = [];

//       searchBox.addListener('places_changed', () => {
//         const places = searchBox.getPlaces();

//         if (places.length === 0) {
//           return;
//         }

//         markers.forEach((marker) => {
//           marker.setMap(null);
//         });
//         markers = [];

//         const bounds = new window.google.maps.LatLngBounds();

//         places.forEach((place) => {
//           if (!place.geometry || !place.geometry.location) {
//             console.log('Returned place contains no geometry');
//             return;
//           }

//           const icon = {
//             url: place.icon,
//             size: new window.google.maps.Size(71, 71),
//             origin: new window.google.maps.Point(0, 0),
//             anchor: new window.google.maps.Point(17, 34),
//             scaledSize: new window.google.maps.Size(25, 25),
//           };

//           markers.push(
//             new window.google.maps.Marker({
//               map,
//               icon,
//               title: place.name,
//               position: place.geometry.location,
//             })
//           );
//           if (place.geometry.viewport) {
//             bounds.union(place.geometry.viewport);
//           } else {
//             bounds.extend(place.geometry.location);
//           }
//         });
//         map.fitBounds(bounds);
//       });
//     };

//     // Load Google Maps script
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places&v=weekly`;
//     script.async = true;
//     script.defer = true;
//     script.onload = loadMap;
//     document.head.appendChild(script);

//     return () => {
//       // Cleanup script
//       document.head.removeChild(script);
//     };
//   }, [mapRef, inputRef]);


//   //--------------------------------google search-----------------------------------------------

 
// //if ocr data will be there
//   const ocrValues = {
//    'Invoice Date' : "2024-12-12",
//    'Flight number':" UA89765",
//    'Class of Service': 'Executive',
//    'Departure' :"Sandila",
//    'Arrival': 'Lucknow', 
//    'Airlines name': "Indira gandhi",
//    'Travelers Name' : "Arti Yadav", 
//   'Booking Reference Number': "", 
//   'Total Amount' : "5000", 
//   'Tax Amount':""
//   }

//   const {cancelFlag , tenantId,empId,tripId} = useParams() ///these has to send to backend get api
//   const [activeIndex, setActiveIndex] = useState(null);

//   const handleItemClick = (index) => {
//     setActiveIndex(index === activeIndex ? null : index);
//   };
  



//   const [onboardingData, setOnboardingData] = useState(null);
//   const [travelAllocationFlag, setTravelAllocationFlag] = useState(null);
//   const [travelExpenseAllocation,setTravelExpenseAllocation]=useState(null);
//   const [categoryfields , setCategoryFields]=useState(null) ///this is for get field after select the category


//   const [selectedAllocations , setSelectedAllocations]=useState([])//for saving allocations on line saving line item
//   const [settlementOptions, setSettlementOptions]=useState([])
//   const [currencyTableData, setCurrencyTableData] = useState(null) //for get data after conversion
  
//   const [selectedTravelType, setSelectedTravelType] = useState(null); /// for level 2 
//   useEffect(() => {
//     // const onboardingData = bookAnExpenseData;
//     const onboardingData = bookAnExpenseDatalevel; //level 2 dummy data

//     const travelAllocationFlags = onboardingData?.companyDetails?.travelAllocationFlags;
   
//     const onboardingLevel = Object.keys(travelAllocationFlags).find((level) => travelAllocationFlags[level] === true);
    
//     const settlementOptionArray =onboardingData?.companyDetails?.expenseSettlementOptions
//     const settlementOptions = Object.keys(settlementOptionArray).filter((option) => settlementOptionArray[option]);
//     setSettlementOptions(settlementOptions)
    
//     setTravelAllocationFlag(onboardingLevel);
//     setOnboardingData(onboardingData);
//     const expenseCategoryAndFields = onboardingData?.companyDetails?.travelExpenseCategories
//     setCategoryFields(expenseCategoryAndFields) //this is for get form fields
//     //for get level
    
//      if(onboardingLevel=== 'level1'){
//       const expenseAllocation= onboardingData?.companyDetails?.travelAllocations?.expenseAllocation
//       setTravelExpenseAllocation(expenseAllocation) 
//      }
     
//   }, [bookAnExpenseData]);


//   const [categoriesList , setCategoriesList] = useState([]); // this is handling travel categories name  arrya for level 1 and level 2
// ///for level 2 allocation & categories list after select the travel type

//   useEffect(()=>{

//     console.log('travel allocation after travel type selected')
//     if (travelAllocationFlag=== 'level2'){
//       const expenseAllocation= onboardingData?.companyDetails?.travelAllocations?.[selectedTravelType]?.expenseAllocation
//       console.log('travel allocation level 2 ', expenseAllocation)
//       setTravelExpenseAllocation(expenseAllocation)
//       //level2
//       const categories = categoryfields.find(category => category.hasOwnProperty(selectedTravelType)); 
      
//       if (categories) {
//         const categoryNames = categories[selectedTravelType].map(category => category.categoryName);
//         console.log(`${selectedTravelType} categoryies` ,categoryNames);
//         setCategoriesList(categoryNames);
//       } else {
//         console.log('International category not found');
//       }
//      }

//   },[selectedTravelType])

   

//   const defaultCurrency =  onboardingData?.companyDetails?.defaultCurrency ?? 'N/A'
//   console.log('travelType', selectedTravelType)
//   console.log(travelAllocationFlag)
//   // console.log('expense allocation',travelExpenseAllocation)
//   // console.log('onboardingData',onboardingData)
//   // console.log('categoryViseFields',categoryfields)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const response = await getTravelExpenseApi(tenantId, empId, tripId);
  
//         if (response.error) {
//           setLoadingErrMsg(response.error.message);
//           setOnboardingData(null);
//         } else {
//           setLoadingErrMsg(null);
//           setOnboardingData(response.data);
  
//           if (!response.data.currencyFlag) {
//             setErrorMsg((prevErrors) => ({
//               ...prevErrors,
//               currencyFlag: { set: true, msg: "Currency not available, Please Contact Admin." },
//             }));
//             console.log("Currency is not found in onboarding");
//           }
//         }
//       } catch (error) {
//         setLoadingErrMsg(error.message);
//         setMessage(error.message);
//         setShowPopup(true);
//         setTimeout(() => {
//           setShowPopup(false);
//         }, 3000);
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     // Call the fetchData function whenever tenantId, empId, or tripId changes
//     fetchData();
//   }, [tenantId, empId, tripId]);
  



//   const [selectedCategory,setSelectedCategory]=useState(null)
//    const [categoryFieldBySelect, setCategoryFieldBySelect]=useState([])
//   const handleCategorySelection = (selectedCategory) => {
//     setSelectedCategory(selectedCategory);
//   };

//     //categories array for search the category to get fields
//     useEffect (()=>{
//       console.log('categoryNames',categoriesList)
//       if(travelAllocationFlag =='level1'){
//         const categoryNames = categoryfields &&  categoryfields.map((category)=>(category.categoryName))
//         console.log('category name ', categoryNames)
//         setCategoriesList(categoryNames)
        
//       }
//     },[travelAllocationFlag])
    


    
//     useEffect(()=>{
//       //this is for set intialvalue in categoryfield
//       if(travelAllocationFlag==='level1'){
//         const categoryFields1 = selectedCategory && categoryfields.find((category) => category.categoryName === selectedCategory).fields.map((field) => field);
//         console.log('categoryFieds',categoryFields1)
//         setCategoryFieldBySelect(categoryFields1)
        
//         const initialFormValues =selectedCategory &&  Object.fromEntries(categoryFields1.map((field)=>[field.name , ocrValues?.[field.name] || '']))
//         console.log('initial value',{...initialFormValues})
//         setLineItemDetails({...initialFormValues})
//       }

//       //this has to do
//       if(travelAllocationFlag==='level2'){
//         const categories = categoryfields.find(category => category.hasOwnProperty(selectedTravelType)); 
//         const desiredCategory =categories && categories?.[selectedTravelType].find(category => category.categoryName === selectedCategory);
//       const categoryFields1 = desiredCategory?.fields.map(field => ({ ...field })) || [];
//       console.log('categoryfieldafterselect the category',categoryFields1)
//       setCategoryFieldBySelect(categoryFields1)        
//         const initialFormValues =selectedCategory &&  Object.fromEntries(categoryFields1.map((field)=>[field.name , ocrValues?.[field.name] || '']))
//         console.log('initial value',{...initialFormValues})
//         setLineItemDetails({...initialFormValues})
//       }
      
//     },[selectedCategory])
//     console.log('selected category',selectedCategory)



//     const [lineItemDetails , setLineItemDetails]=useState()//line item save
 
//     //selected category corresponding class & class of service value
//     const [classDropdownValues,setClassDropdownValues]=useState(null)

//     useEffect(() => {
      
//       const category = classDropdown.find(category => category.categoryName === selectedCategory);
//       if (category) {
//         // Access the classes array and console.log it
//         console.log(category.classes);
//         setClassDropdownValues(category.classes);
//       } else {
//         console.log(`Category "${selectedCategory}" not found.`);
//       }
//     }, [selectedCategory]);
    
  
//   //get travel request Id from params
   

//     const DASHBOARD_URL=`http://localhost:3000/${tenantId}/${empId}`
//     const [showPopup, setShowPopup] = useState(false)
//     const [message, setMessage] = useState(null)
    
//     const [travelRequestStatus, setTravelRequestStatus] = useState('pending approval')
//     const [isUploading , setIsUploading]=useState(false)
//     const [isLoading, setIsLoading] = useState(true)
//     const [loadingErrMsg, setLoadingErrMsg] = useState(null)
//     const [expenseLineForm, setExpenseLineForm]= useState({
//       totalAmount:"",
//       personalFlag:"",
//     })

//     const [selectedFile ,setSelectedFile]=useState(null)
//     const [fileSelected,setFileSelected]=useState(null)
 

//     const [personalFlag,setPersonalFlag]=useState(false)
//     const [errorMsg,setErrorMsg]=useState({
//         currencyFlag:{set:false,msg:""},//if currency is not in backend database for conversion
//         totalAmount:{set:false,msg:""}, //"Total Amount"
//         personalAmount:{set:false,msg:""}

//       })



//     const [showCancelModal, setShowCancelModal] = useState(false)
//     const [ rejectionReason,setRejectionReason] =useState(null)
  
// const handlePersonalFlag=()=>{
//   setPersonalFlag((prev)=>(!prev))
  
// }


// useEffect(()=>{
  
//    if(!personalFlag){
//     setLineItemDetails(({...lineItemDetails, personalExpenseAmount:"" ,isPersonalExpense:false}))
//    }
  

// },[personalFlag])




// //level-1 store selected allocation in array
// const onAllocationSelection = (option, headerName) => {
//   // Create a new allocation object
//   const newAllocation = { headerName: headerName, headerValue: option };
//   setSelectedAllocations((prevAllocations) => [...prevAllocations, newAllocation]);
// };





// const onReasonSelection = (option) => {
//         setRejectionReason(option)
//         console.log(option)
//     }
//     const [selectDropdown , setSelectDropdown]= useState(null)

//     const handleDropdownChange = (value, dropdownType) => {
//       if (dropdownType === 'Class' || dropdownType === 'Class of Service') {
//         const key = dropdownType === 'Class' ? 'Class' : 'Class of Service';
//         setLineItemDetails((prevState) => ({ ...prevState, [key]: value }));
//       } else if (dropdownType === 'categoryName') {
//         setExpenseLineForm({ ...expenseLineForm, categoryName: value });
//       } else if (dropdownType === 'currencyName') {
//         setLineItemDetails((prevState) => ({ ...prevState, currencyName: value }));
//         setSelectDropdown(value);
//       }
//     };

//     console.log(lineItemDetails?.personalExpenseAmount)
//   // const handleInputChange=(e)=>{
//   //   const {name , value} = e.target
//   //   setLineItemDetails((prevState)=>({...prevState,[name]:value}))

//   // }
//   const handleInputChange=(name, value)=>{
//     console.log(`Updating ${name} with value:`, value);
//     setLineItemDetails((prevState) => ({ ...prevState, [name]: value || "" }));
    
//   }



//   ///handle convertor to exchagne value behalf of default currency
//   const handleConverter = async (data ) => { 
//   const {Currency , personalExpenseAmount , 'Total Amount': totalAmount ,'Total Fare': totalFare} =data
//     // const { Currency, personalExpenseAmount,} = lineItemDetails;
//     // const totalAmount = lineItemDetails['Total Amount'];
//     let allowForm = true;
  
//     if (totalAmount === "") {
//       setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: true, msg: "Enter total amount" } }));
//       allowForm = false;
//     } else {
//       setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: false, msg: "" } }));
//     }
  
//     if (personalFlag && personalExpenseAmount === "") {
//       setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: true, msg: "Enter personal amount" } }));
//       allowForm = false;
//     } else {
//       setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: false, msg: "" } }));
//     }
  
//     if (allowForm) {
//       const nonPersonalAmount = totalAmount || totalFare - personalExpenseAmount;
  
//       // Create an object with the dynamic field name and value
  
//       const convertDetails = {
//         currencyName: Currency,
//         personalExpense: personalExpenseAmount || "",
//         nonPersonalExpense: nonPersonalAmount || "",
//         totalAmount: totalAmount || totalFare,
       
//       };
//       console.log(convertDetails)
      
// ///api 
//     try{
//       setIsLoading(true)
//       const response= await postMultiCurrencyForTravelExpenseApi(tenantId, convertDetails)
//       if(response.error){
//         setLoadingErrMsg(response.error.message)
//         setCurrencyTableData(null)
//       }else{
//         setLoadingErrMsg(null)
//         setCurrencyTableData(response.data) //here it war response
//         if(!currencyTableData.currencyFlag){              
//           setErrorMsg((prevErrors)=>({...prevErrors,currencyFlag:{set:true,msg:"Currency not available,Please Contact Admin."}}))
//           console.log("currency is not found in onboarding")
//         }
//       }
//     }catch(error){
//       setLoadingErrMsg(error.message)
//       setMessage(error.message)
//       setShowPopup(true)
//       setTimeout(() => {
//         setShowPopup(false)
//       }, 3000);
      
//     } finally{
//       setIsLoading(false);
//     }
  

//     }
//   };


//     const [formData, setFormData] = useState(null); //this is for get expense data
//     const [getExpenseData, setGetExpenseData]=useState(); //to get data header level 
//     const [getSavedAllocations,setGetSavedAllocations]=useState()  ///after save the allocation then i will get next time from here 
//     const [openModal,setOpenModal]=useState(null);
//     // const [openModal,setOpenModal]=useState(false);
//     const [openLineItemForm,setOpenLineItemForm]=useState(true)
//     const [headerReport,setHeaderReport]=useState(null)


//     const [editLineItemById, setEditLineItemById]=useState(null)
  
  
//     useEffect(() => {

//         const tripData = tripDummyData
//         const hrData= hrDummyData
//         const expenseData= tripDummyData.travelExpenseData //get line items
//         console.log('expenseData',expenseData)   
//         ///where is newExpenseReport = true
//         const headerReportData = expenseData.find((expense) => expense.newExpenseReport);
//         setHeaderReport(headerReportData)
//         setFormData({...tripData})
//         setGetSavedAllocations({...hrData});
//         setGetExpenseData([...expenseData]);
//         setTravelRequestStatus(tripData)
//         setIsLoading(false)
//       },[])


// // console.log('headerdata',headerReport)
// // console.log("formdata",formData)
      
//     useEffect(()=>{
//         if(showCancelModal){
//             document.body.style.overflow = 'hidden'
//         }
//         else{
//             document.body.style.overflow = 'auto'
//         }
//     },[showCancelModal])



    

//      const handleOpenModal=(id)=>{
//       if(id==='upload'){
//         setOpenModal('upload')
//       }
//       if(id==='category'){
//         setOpenModal('category')
//       }
//      }
//     //  const handleOpenModal=()=>{
//     //    setOpenModal((prevState)=>(!prevState))
//     //  }

//      const handleCancelExpenseHeader=()=>{
//         console.log("cancel header")
//      }



//     // console.log("getExpenseData",getExpenseData)
// ///----------------------------------------  




// //handler for  submit and draft
// const handleSubmitOrDraft=async(action)=>{
//     const expenseHeaderId="expenshhID"
//     console.log('submit')
    
//     setIsLoading(true)

//     try{
//         await submitOrSaveAsDraftApi(action,tenantId,empId,tripId,expenseHeaderId,headerReport)
//         setIsLoading(false)
//         setShowPopup(true)
//         setMessage("HeaderReport has been submitted.")
//         setTimeout(()=>{
//           setShowPopup(false)
//           urlRedirection(DASHBOARD_URL)
//         },5000)
  
//       }catch(error){
//         setShowPopup(true)
//         setMessage("try again")
//         setTimeout(()=>{
//           setShowPopup(false)
//         },3000)
//         console.error('Error confirming trip:', error.message);
//       }  

//     }


// //handle save line items

//     const handleSaveLineItemDetails = () => { 
//       // Create a new object with the updated category
      
//       const expenseLines = { ...lineItemDetails, category: selectedCategory ,isPersonalExpense:personalFlag , document : fileSelected ? selectedFile : ""};  
//       // Set the updated line item details
//       // setLineItemDetails((prevState)=>({...prevState ,expenseLines}));
//       //for companyDetails
//       const companyDetails = onboardingData?.companyDetails
//       // Log the updated details
//       let dataWithCompanyDetails 
//        dataWithCompanyDetails={
//         companyDetails:companyDetails,
//         expenseLines:[expenseLines],
//         // expenseLines:[{...expenseLines}],
//         allocations: selectedAllocations
//       }

//      if(travelAllocationFlag==='level2'){
//       dataWithCompanyDetails = {...dataWithCompanyDetails , travelType:selectedTravelType}
//      }
//       console.log('save line item', dataWithCompanyDetails)
//       setSelectedCategory(null)
//     };


  
    

//     const handleDeleteLineItem=async(lineItemId)=>{
//       try{
//         setIsLoading(true)
//         const response= await cancelTravelExpenseLineItemApi(lineItemId) //pass tripId, headerexpense report and lineItemId
//         if(response.error){
//           setLoadingErrMsg(response.error.message)
//           setCurrencyTableData(null)
//         }else{
//           setLoadingErrMsg(null)
//           setLoadingErrMsg(response.data) 
//         }
//       }catch(error){
//         setLoadingErrMsg(error.message)
//         setMessage(error.message)
//         setShowPopup(true)
//         setTimeout(() => {
//           setShowPopup(false)
//         }, 3000);
        
//       } finally{
//         setIsLoading(false);
//       }

//     }


// console.log('all categoryfields',categoryfields)

// ///////////////////----------modify lineitem start



// const handleModifyLineItem = () => {
//   const expenseLines = { ...lineItemDetails, category: selectedCategory ,isPersonalExpense:personalFlag , document : fileSelected ? selectedFile : ""};  
//   // Set the updated line item details
//   // setLineItemDetails((prevState)=>({...prevState ,expenseLines}));
  
  
//   //for companyDetails
//   const companyDetails = onboardingData?.companyDetails
//   // Log the updated details
//   const dataWithCompanyDetails={
//     companyDetails:companyDetails,
//     expenseLines:[{...expenseLines}],
//     allocations: selectedAllocations
//   }
//   console.log('save line item', dataWithCompanyDetails)
// };

// const [ocrFileSelected , setOcrFileSelected]=useState(false)
// const [ocrSelectedFile , setOcrSelectedFile]=useState(null)
// const [ocrField , setOcrField]=useState(null)




// const handleOcrScan = async () => {
//   // console.log('ocrfile from handle', ocrSelectedFile);

//   const formData = new FormData();
//     formData.append('categoryName', selectedCategory);
//     formData.append('file', ocrSelectedFile);

//   console.log('ocrfile from handle',formData)

//   try {
//     setIsUploading(true);

//     // Assuming ocrScanApi is an asynchronous function
//     const response = await ocrScanApi(formData);

//     if (response.error) {
//       setLoadingErrMsg(response.error.message);
//       setCurrencyTableData(null);
//     } else {
//       setLoadingErrMsg(null);
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
//     setLoadingErrMsg(error.message);
//     setMessage(error.message);
//     setShowPopup(true);

//     setTimeout(() => {
//       setShowPopup(false);
//     }, 3000);
//   } finally {
//     setIsUploading(false);
//   }
// };




//   return <>
// {/* <Error message={loadingErrMsg}/> */}
//     {isLoading && <Error/>}
//     {loadingErrMsg&& <h2>{loadingErrMsg}</h2>}
//       {!isLoading && 
//         <div className="w-full h-full relative bg-white-100 md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
//         {/* app icon */}
//         <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
//             <Icon/>
//         </div>

       

//         {/* Rest of the section */}
//         <div className="w-full h-full mt-10 p-10 font-cabin tracking-tight">
//         <div>
//                Expense Type: Travel
//         </div>

//         {/* ///-level2 - */}
// {travelAllocationFlag === 'level2' && <div className="flex flex-col md:flex-row gap-4 justify-evenly">  
   
//    <div  onClick={() => setSelectedTravelType('international')} className={`flex gap-x-4 flex-row items-center ${selectedTravelType === 'international' ? 'border border-indigo-600' : 'border border-neutral-400'} max-w-[350px] accent-indigo-600 px-6 py-2 rounded`}>
//      <div className={`w-[20px] h-[20px] ${selectedTravelType === 'international' ? 'bg-indigo-600 border border-indigo-600' : 'border border-neutral-400'} flex items-center justify-center rounded-sm`}>
//        {selectedTravelType === 'international' && <img src={check_tick} alt="Check Icon" className='w-[20px] h-[20px] rounded-sm' />}
//      </div>

//      <div>
//        <p className='font-Cabin text-neutral-800 text-lg tracking-wider'> International </p>
//        <p className='font-Cabin -mt-1 text-neutral-600 text-sm tracking-tight'>Travelling out of country</p>
//      </div>
//    </div>

//    <div onClick={() => setSelectedTravelType('domestic')} className={`flex gap-x-4 flex-row items-center ${selectedTravelType === 'domestic' ? 'border border-indigo-600' : 'border border-neutral-400'} max-w-[350px] accent-indigo-600 px-6 py-2 rounded `}>
//      <div className={`w-[20px] h-[20px] ${selectedTravelType === 'domestic' ? 'bg-indigo-600 border border-indigo-600' : 'border border-neutral-400'} flex items-center justify-center rounded-sm`}>
//        {selectedTravelType === 'domestic' && <img src={check_tick} alt="Check Icon" className='w-[20px] h-[20px] rounded-sm' />}
//      </div>

//      <div>
//        <p className='font-Cabin text-neutral-800 text-lg tracking-wider'> Domestic </p>
//        <p className='font-Cabin -mt-1 text-neutral-600 text-sm tracking-tight'>Travelling within the country</p>
//      </div>
//    </div>

//    <div onClick={() => setSelectedTravelType('local')}  className={`flex gap-x-4 flex-row items-center ${selectedTravelType === 'local' ? 'border border-indigo-600' : 'border border-neutral-400'} max-w-[350px] accent-indigo-600 px-6 py-2 rounded `}>
//      <div className={`w-[20px] h-[20px] ${selectedTravelType === 'local' ? 'bg-indigo-600 border border-indigo-600' : 'border border-neutral-400'} flex items-center justify-center rounded-sm`}>
//        {selectedTravelType === 'local' && <img src={check_tick} alt="Check Icon" className='w-[20px] h-[20px] rounded-sm' />}
//      </div>

//      <div>
//        <p className='font-Cabin text-neutral-800 text-lg tracking-wider'> Local </p>
//        <p className='font-Cabin -mt-1 text-neutral-600 text-sm tracking-tight'>Travelling nearby</p>
//      </div>
//    </div>
// </div>  }
//         {/* ///-level2- */}

//         <div>
//           <AllocationComponent travelAllocationFlag={travelAllocationFlag} travelExpenseAllocation={travelExpenseAllocation} onAllocationSelection={onAllocationSelection}/>
//         </div>
        
//         <div>
//           <ExpenseHeader cancelFlag={cancelFlag}
//               handleCancelExpenseHeader={handleCancelExpenseHeader}
//               handleSubmitOrDraft={handleSubmitOrDraft}
//               formData={formData} 
//               approvalOptions={approvalOptions} 
//               onReasonSelection={onReasonSelection} 
//               settlementOptions={settlementOptions} 
//               defaultCurrency={defaultCurrency} 
//               />
//         </div>


           
//             <hr/>

//             <div className="form mt-5">

//             <div className="w-fit">
//             <Button disabled={selectedCategory !== null} onClick={()=>handleOpenModal('category')} text={"Add Line Item"}/>
//             </div>
//             <div className=" w-full flex flex-row mt-5">
             
//   <div className="flex flex-col w-full">         
//       <div className="container mx-auto ">
//       <h1 className="text-2xl font-bold mb-4">Header Report</h1>
//       {getExpenseData.map((item,index)=>(
//        <div key={index} className="mb-4">
//           <div
//             className="flex justify-between items-center bg-gray-200 p-4 cursor-pointer"
//             onClick={() => handleItemClick(index)}
//           >
//             <div>{`Header Report Number : ${item?.expenseHeaderNumber ?? 'N/a'}`}</div>
//             <div>{activeIndex === index ? '▲' : '▼'}</div>
//           </div>
//           {activeIndex === index && (
//             <div className="bg-white p-4">
// {/* ///already booked travel details */}
// <div className="mt-5 flex flex-col gap-4">
// {['flights', 'trains', 'buses', 'cabs', 'hotels'].map((itnItem, itnItemIndex) => {
//   if (item?.alreadyBookedExpenseLines && item.alreadyBookedExpenseLines[itnItem]?.length > 0) {
//     return (
//       <div key={itnItemIndex}>
//         <details>
//           <summary>
//             <p className="inline-flex text-xl text-neutral-700">
//               {`${titleCase(itnItem)} `}
//             </p>
//           </summary>
//           <div className='flex flex-col gap-1'>
//             {item.alreadyBookedExpenseLines[itnItem].map((item, itemIndex) => {
//               if (['flights', 'trains', 'buses'].includes(itnItem)) {
//                 return (
//                   <div key={itemIndex}>
//                     <FlightCard
//                       // onClick={()=>handleCancel(itnItem.slice(0, -1), itemIndex, item.formId, item.isReturnTravel)} 
//                       from={item.from} 
//                       to={item.to} 
//                       itnId={item.itineraryId}
//                       // handleLineItemAction={handleLineItemAction}
//                       showActionButtons={travelRequestStatus !== 'pending approval' && item.status == 'pending approval'}
//                       date={item.date} time={item.time} travelClass={item.travelClass} mode={titleCase(itnItem.slice(0, -1))} />
//                   </div>
//                 );
//               } else if (itnItem === 'cabs') {
//                 return (
//                   <div key={itemIndex}>
//                     <CabCard 
//                       itnId={item.itineraryId}
//                       from={item.pickupAddress} to={item.dropAddress} date={item.date} time={item.time} travelClass={item.travelClass} isTransfer={item.type !== 'regular'} />
//                   </div>
//                 );

//               } else if (itnItem === 'hotels') {
//                 return (
//                   <div key={itemIndex}>
//                     <HotelCard 
//                       itnId={item.itineraryId}        
//                       checkIn={item.checkIn} checkOut={item.checkOut} date={item.data} time={item.time} travelClass={item.travelClass} mode='Train' />
//                   </div>
//                 );
//               }
//             })}
//           </div>
//         </details>
//       </div>
//     );
//   }
//   return null; // Return null if no items in the itinerary
// })}
// </div>
// {/* ///alreadybooked travel details */}

// {/* ///saved lineItem */}







// {/* get lineitem data from backend start*/}

// {item.expenseLines.map((lineItem, index) => (

//     lineItem._id === editLineItemById ? 
//     (
   
//     <EditForm handleConverter={handleConverter} selectedCategory={selectedCategory} categoryfields={categoryfields} lineItemDetails={lineItemDetails} classDropdownValues ={classDropdownValues} lineItem={lineItem} defaultCurrency={defaultCurrency}/>
    
//     )  :

// <div className="w-full flex-wrap flex justify-center items-center p-2">

// <EditView lineItem={lineItem} index={index} newExpenseReport={item.newExpenseReport} setSelectedCategory={setSelectedCategory} setEditLineItemById={setEditLineItemById} handleDeleteLineItem={handleDeleteLineItem}/>
// </div>
//   ))}
// {/* </div> */}

// {/* get lineItem data from backend end*/}


// {/* </div> */}



//  </div>
//           )}
//         </div>))}
      
//  </div>

// {/*start new //lineItemform */}
   
// <div className=" w-full flex flex-col  lg:flex-row">

// <div className="border w-full lg:w-1/2">
//   bill view
// </div>
// <div className="border w-full lg:w-1/2">
//   input fields
  
//     <>
    
// <div className=" w-full flex-wrap flex flex-col justify-center items-center p-2">
//     {/* <div className="w-1/2">
//       <Search 
//       title="Category" 
//       placeholder='Select Category' 
//       options={categoriesList}
//       onSelect={(category)=>handleCategorySelection(category)}/>
//      </div>    */}
//  <div className="w-full flex-row  border">
//   <div className="w-full border flex flex-wrap  items-center justify-center  ">

// {selectedCategory&&categoryFieldBySelect && categoryFieldBySelect.map((field)=>(
//           <>
//   <div key={field.name} className="w-1/2 flex justify-center items-center px-4">
//           {field.name === 'From' || field.name === 'To' || field.name === 'Departure' || field.name === 'Pickup Location' ||field.name === 'DropOff Location' || field.name === 'Arrival' ? ( 
//        <>       
//         <Input
//         inputRef={inputRef}
//         title={field.name}
//         name={field.name}
//         type={'text'}
//         initialValue={lineItemDetails[field.name]}
//         placeholder={`Enter ${field.name}`}
//         value={lineItemDetails[field.name  ||""]}
//         onChange={(value)=>handleInputChange(field.name,value)}
//       />
//       <div ref={mapRef} className="map"></div>
//      {/* <GoogleMapsSearch mapRef={mapRef} inputRef={inputRef} /> */}
//       </>
//       ) : (field.name ==='Class' || field.name ==='Class of Service') ? (
//           <div className=" w-full translate-y-[-6px]">
//         <Select
//           title={field.name}
//           name={field.name}
//           placeholder={`Select ${field.name}`}
//           options={classDropdownValues || []}// Define your class options here
//           currentOption={lineItemDetails[field.name] || ''}
//           onSelect={(value)=>handleInputChange(field.name, value)}
//           // violationMessage={`Your violation message for ${field.name}`}
//           // error={{ set: true, message: `Your error message for ${field.name}` }}
//         />
//         </div>
//       ) :(
//         // Otherwise, render a regular input field
//         <Input
//          initialValue={lineItemDetails[field.name]}
//           title={field.name}
//           name={field.name}
//           type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
//           placeholder={`Enter ${field.name}`}
//           value={lineItemDetails[field.name || '']}
//           onChange={(value)=>handleInputChange(field.name , value)}
//         />
//       )}     
//           </div>        
//           </>
//          ))}
//          </div>

// {/* //personal expense */}




// <div className='flex flex-col px-4 justify-between'>

// <div className="flex flex-row justify-evenly items-center h-[73px]"> 
// <div className="flex-1">
// <Toggle label={'Personal Flag'} initialValue={false}  onClick={handlePersonalFlag}/>
// </div>


// <div className="w-full ">
//   {personalFlag &&
//   <Input
//   title='Personal Amount'
//   error={ errorMsg.personalAmount}
//   name='personalExpenseAmount'
//   type={'text'}
//   value={lineItemDetails.personalExpenseAmount || ""}
//   onChange={(value)=>handleInputChange( ['personalExpenseAmount'],value)}
//   />}

// </div>
// </div> 

 

// {/* //personal expense */}


// {/* {currencyTableData?.currencyFlag &&
// <div className="w-1/2 text-sm ">
//   <div>
//     <h2>Converted Amount Details:</h2>
//     <p>total amount: {currencyTableData?.convertedAmount ?? " - "}</p>
//     {
//       lineItemDetails?.personalFlag  &&
//       (<div>
//         <p>personal amount: {currencyTableData?.convertedPersonalAmount ?? " - "}</p>
//         <p>Non Personal Amount: {currencyTableData?.convertedNonPersonalAmount ?? " - "}</p>
//         </div>
//       )
     
//     }
    

//   </div>

// </div>
//  } */}

// <div className="relative">
// <div className=" h-[48px] w-[100px]  mb-10 mr-28 mt-[-10px] ">
//    <Select
//        title='Currency'
//        currentOption={'AUD'}
//        placeholder="Select Currency"
//        options={['INR',"USD",'AUD']} 
//        onSelect={(value)=>{setLineItemDetails({...lineItemDetails,['Currency']:value}),setSelectDropdown(value)}}
       
//        violationMessage="Your violation message" 
//        error={{ set: true, message: "Your error message" }} 
//        />

// </div>  

// {/* ////-------- */}
// <div className='absolute top-6 left-[210px] w-fit'>
// {selectDropdown == null || selectDropdown !== defaultCurrency   &&
// <ActionButton text="Convert" onClick={()=>handleConverter(lineItemDetails)}/>
// }
// </div>
// </div>
// {/* ------////-------- */}


// <div className="w-full mt-4 flex items-center justify-center border-[1px] border-gray-50 ">
// <Upload  
//   selectedFile={selectedFile}
//   setSelectedFile={setSelectedFile}
//   fileSelected={fileSelected}
//   setFileSelected={setFileSelected}
//   />
// </div>
// </div>
// <div className="w-full mt-5 px-4" >
//  <Button text="Save" 
//   onClick={handleSaveLineItemDetails} />
// </div>   

// {/* -------------------- */}


     
//      </div>
// </div>
   
  
//     </>
 
 
// </div>

// </div>

   
// {/* end //lineItemform */}


//     </div>      


              
               
//             </div>
//             </div>
//             {openModal =='category' && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none" >
//                 <div className='z-10 max-w-4/5 w-2/5 min-h-4/5 max-h-4/5 scroll-none bg-white-100  rounded-lg shadow-md'>
//                     <div className="p-10">
//                       <div className="flex flex-col justify-center items-center">
//                         <p className="text-xl font-cabin">Select the expense  category for this line item:</p>
//                                   <div className="w-fit">
//                                     <Search 
//                                     title='.'
//                                     placeholder='Search Category' 
//                                     options={categoriesList}
//                                     onSelect={(category)=>handleCategorySelection(category)}/>
//                                   </div>   
//                         <div className="flex w-full mt-10 justify-evenly">
//                             <Button variant='fit' text='Scan Bill' onClick={()=>handleOpenModal('upload')} disabled={selectedCategory== null}/>
//                             <Button variant='fit' text='Manually' onClick={()=>{setOpenLineItemForm(true);setOpenModal(false)}} disabled={selectedCategory== null}/>
//                         </div>
//                         </div>

//                     </div>
//                 </div>
//                 </div>
//             }
//             {openModal==='upload' && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none" >
//                 <div className='z-10 max-w-4/5 w-2/5 min-h-4/5 max-h-4/5 scroll-none bg-white-100  rounded-lg shadow-md'>
//                 <div onClick={()=>{setOpenModal(null);setOcrSelectedFile(null);setOcrFileSelected(false);setSelectedCategory(null)}} className=' w-10 h-10 flex justify-center items-center float-right  mr-5 mt-5 hover:bg-red-300 rounded-full'>
//                       <img src={cancel} className='w-8 h-8'/>
//                       </div>
//                     <div className="p-10">
                    
//                       <div className="flex flex-col justify-center items-center">
                       

                       
//                         {ocrFileSelected ? 
                        
//                         <div className="w-full  flex flex-col justify-center h-[500px]  overflow-x-auto">
//                         <p>Document Name: {ocrSelectedFile.name}</p>
//                         <div className={` w-fit`}>
//                         <Button disabled={isUploading}  text='reupload' onClick={()=>{setOcrFileSelected(false);setOcrSelectedFile(null)}}/>
//                         </div>
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

//                          <Button loading={isUploading} variant='fit' text='Scan' onClick={handleOcrScan} disabled={selectedCategory== null}/>
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


//         <div>

//         </div>
        
        
        
//         </div>
//       }

//       <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>

//   </>;
// }





// //expense allocation

// function AllocationComponent ({travelExpenseAllocation ,travelAllocationFlag , onAllocationSelection}) {
//   const validAllocationFlags = ['level1', 'level2'];
//   return(
//      <div  className="flex md:flex-row flex-col my-5 justify-evenly items-center flex-wrap">            
             
//          {validAllocationFlags.includes(travelAllocationFlag)  && travelExpenseAllocation && travelExpenseAllocation.map((expItem , index)=>(
//               <>
             
//               <div key={index}  className="h-[48px] inline-flex my-4 mx-2">
               
//                 <Select 
//                   options={expItem.headerValues}
//                   onSelect={(option) => onAllocationSelection(option, expItem.headerName)}
//                   placeholder='Select Allocation'
//                   title={`${titleCase(expItem.headerName ?? "")}`}
//                 />
               
//               </div>
//               </>
//        ))}       
//      </div> )}




// ///expense details on header
// function ExpenseHeader({formData
//    ,approvalOptions
//    ,onReasonSelection
//    ,settlementOptions,
//     defaultCurrency,
//     cancelFlag,
//     handleCancelExpenseHeader,
//     handleSubmitOrDraft,
//    }){
//   return(
//     <>
//     <div className='flex flex-col md:flex-row mb-2 justify-between items-center'>
//               <div>
//                 <p className="text-2xl text-neutral-600 mb-5">{`${formData?.tripPurpose?? "N/A"}`}</p>
//               </div>
//                 <div className="inline-flex gap-4 justify-center items-center">
//                     {cancelFlag ?
                    
//                     (<div className="flex mt-10 flex-row-reverse">
//                     <Button variant='fit' text='Cancel' onClick={()=>handleCancelExpenseHeader}/>
//                    </div>):
                  
//                     (<>
//                     <div className="flex mt-10 flex-row-reverse">
//                     <Button text='Save as Draft' onClick={()=>handleSubmitOrDraft("save as draft")}/>
//                    </div>
//                     <div className="flex mt-10 flex-row-reverse">
//                     <Button variant='fit' text='Submit' onClick={()=>handleSubmitOrDraft("submit")}/>
//                    </div>
//                    </>)}
                   

                   
                   
//                 </div>
             
//             </div>

//     <div className="flex flex-col md:flex-row justify-between items-center">
// <div>
//     <div className="flex gap-2 font-cabin text-xs tracking-tight">
//         <p className="w-[200px] text-neutral-600">Created By:</p>
//         <p className="text-neutral-700">{formData?.userId?.name}</p>
//     </div>
//     <div className="flex gap-2 font-cabin text-xs tracking-tight">
//         <p className="w-[200px] text-neutral-600">Trip Number:</p>
//         <p className="text-neutral-700">{formData?.tripNumber?? "not available"}</p>
//     </div>
//     <div className="flex gap-2 font-cabin text-xs tracking-tight">
//         <p className="w-[200px] text-neutral-600">Total CashAdvance:</p>
//         <p className="text-neutral-700">{formData?.expenseAmountStatus?.totalCashAmount??"not available"}</p>
//     </div>
//     <div className="flex gap-2 font-cabin text-xs tracking-tight">
//         <p className="w-[200px] text-neutral-600">Default Currency:</p>
//         <p className="text-neutral-700">{defaultCurrency}</p>
//     </div>
// </div>

// <div className=" flex flex-col gap-2 lg:flex-row">

// <div className="h-[48px]">
// <Select 
//   options={approvalOptions}
//   onSelect={onReasonSelection}
//   placeholder='Select Approver'
//   title="Select Approver"
// />
// </div>

// <div>
// <Select 
//   options={settlementOptions}
//   onSelect={onReasonSelection}
//   placeholder='Select Travel Expense '
//   title="Expense Settlement"
// />

// </div>
// </div>
// </div>
// </>
//   )
// }









// function spitImageSource(modeOfTransit){
//     if(modeOfTransit === 'Flight')
//         return airplane_icon
//     else if(modeOfTransit === 'Train')
//         return cab_icon
//     else if(modeOfTransit === 'Bus')
//         return cab_icon
// }





// function FlightCard({amount,from, mode='Flight', showActionButtons, itnId, handleLineItemAction}){
//     return(
//     <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
//     <img src={spitImageSource(mode)} className='w-4 h-4' />
//     <div className="w-full flex sm:block">
//         <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
//             <div className="flex-1">
//                 Travel Allocation   
//             </div>
           
//             <div className="flex-1">
//                 Amount
//             </div>
//             <div className="flex-1">
//                 Already Booked
//             </div>
//         </div>

//         <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
//             <div className="flex-1">
//                 {titleCase(from)}     
//             </div>
            
//             <div className="flex-1">
//                 {amount??'N/A'}
//             </div>
//             <div className='flex-1'>
//                 <input type="checkbox" checked={true}/>
//             </div>
//         </div>
//     </div>

//     {/* {showActionButtons && 
//     <div className={`flex items-center gap-2 px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100  hover:bg-red-100  hover:text-red-900 `} onClick={onClick}>
//         <div onClick={()=>handleLineItemAction(itnId, 'approved')}>
//             <ActionButton text={'approve'}/>
//         </div>
//         <div onClick={()=>handleLineItemAction(itnId, 'rejected')}>
//             <ActionButton text={'reject'}/>   
//         </div>   
//     </div>} */}

//     </div>)
// }



// function HotelCard({amount, hotelClass, onClick, preference='close to airport,'}){
//     return(
//     <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
//     <p className='font-semibold text-base text-neutral-600'>Hotel</p>
//     <div className="w-full flex sm:block">
//         <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
//            <div className="flex-1">
//            Travel Allocation   
//             </div>
//             <div className="flex-1">
//                 Amount
//             </div>
            
//             <div className='flex-1'>
//                 Already Booked
//             </div>
//         </div>

//         <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
//             <div className="flex-1">
//                 {/* {checkIn}      */}
//                 Deparment
//             </div>
//             <div className="flex-1">
//                 {hotelClass??'N/A'}
//             </div>
//             <div className='flex-1'>
//                 <input type="checkbox" checked/>
//             </div>
//         </div>

//     </div>

   

//     </div>)
// }

// function CabCard({amount,from, to, date, time, travelClass, onClick, mode, isTransfer=false, showActionButtons, itnId, handleLineItemAction}){
//     return(
//     <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
//     <div className='font-semibold text-base text-neutral-600'>
//     <img src={cab_icon} className='w-6 h-6' />
//         <p className="text-xs text-neutral-500">{isTransfer? 'Transfer Cab': 'Cab'}</p>
//     </div>
//     <div className="w-full flex sm:block">
//         <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
//             {/* <div className="flex-1">
//                 Pickup     
//             </div> */}
//             <div className="flex-1" >
//             Travel Allocation   
//             </div>
//             {/* <div className="flex-1">
//                     Date
//             </div> */}
//             <div className="flex-1">
//                 Amount
//             </div>
//             {<div className="flex-1">
//                Already Booked
//             </div>}
//         </div>

//         <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
//             {/* <div className="flex-1">
//                 {from??'not provided'}     
//             </div> */}
//             <div className="flex-1">
//                 {/* {to??'not provided'}      */}
//                 Legal Entity
//             </div>
//             {/* <div className="flex-1">
//                 {date??'not provided'}
//             </div> */}
//             <div className="flex-1">
//                 {amount??'N/A'}
//             </div>
//            {/* {!isTransfer && <div className="flex-1">
//                 {travelClass??'N/A'}
//             </div>} */}
//              <div className='flex-1'>
//                 <input type="checkbox" checked/>
//             </div>
//         </div>
//     </div>
  
//     </div>)
// }



// function EditView({lineItem, index ,newExpenseReport ,setEditLineItemById,setSelectedCategory, handleDeleteLineItem}){
//   return(
//     <>
// <div className='flex flex-col lg:flex-row border '> 
// <div className="border w-full lg:w-1/2">
//   bill view
//   {lineItem.document}
// </div>
// <div className="border w-full lg:w-1/2">
//     <div className="w-full flex-row  border mt-2">
//       <h2>LineItem {index+1}</h2>
//      <div className="w-full flex items-center justify-start h-[52px] border px-4 ">
//       <p className="text-zinc-600 text-medium font-semibold font-cabin">Category -{titleCase(lineItem.categoryName)}</p>
//     </div>   
//     <div key={index} className="w-full  border flex flex-wrap items-center px-4 justify-between  py-4">
//         {Object.entries(lineItem).map(([key, value]) => (

//         key!== 'categoryName' && key!== 'isPersonalExpense' &&    key !== '_id' && key !== 'policyViolation' && key !== 'document' &&(

//               <>
//         <div className="min-w-[200px] w-full md:w-fit   flex-col justify-start items-start gap-2 ">
                    
//         <div className="text-zinc-600 text-sm font-cabin">{titleCase(key)}</div>
        
    
//         <div className=" w-full h-full bg-white items-center flex border border-neutral-300 rounded-md">
        
      
//               <div key={key}>
//                 <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin px-6 py-2">
                 
//                   {` ${value}`}
//                 </div>
               
//               </div>
              
           
//         </div>
//         <div className=" w-full text-xs text-yellow-600   font-cabin">{['policyViolation']}</div>
//         </div>
//         </>
//          )
//          ))}
         
//       {
//       // item.newExpenseReport 
//       newExpenseReport &&
//           <div className="w-full mt-5 m-4 flex justify-end gap-4" >
//             <Button text="Edit"   onClick={()=>(setEditLineItemById(lineItem._id,setSelectedCategory(lineItem.categoryName)))} />
//             <Button text="Delete" onClick={()=>(handleDeleteLineItem(lineItem._id))} />
//           </div>
//       }    
//     </div>
    
//     </div>
// </div>
// </div>
// </>
//   )
// }




// function EditForm({selectedCategory ,categoryfields ,lineItemDetails,classDropdownValues,lineItem,defaultCurrency,handleConverter }){

//   const[ personalFlag , setPersonalFlag]=useState()

//   const handlePersonalFlag=()=>{
//      setPersonalFlag((prev)=>(!prev))
//      if(!personalFlag){
//      setEditFormData((prevData)=>({...prevData, isPersonalExpense: false , personalExpenseAmount:""}))
//     }else{
//        setEditFormData((prevData) => ({ ...prevData, isPersonalExpense:true}))

//   }}

//   const [editFormData ,setEditFormData]=useState(lineItem)
//   const [selectedCurrency , setSelectedCurrency]=useState(null)

//   const [selectedFile ,setSelectedFile]=useState(null)
//   const [fileSelected,setFileSelected]=useState(false)



//   useEffect(()=>{
//     if (fileSelected) {
//       setEditFormData((prevData)=>({
//         ...prevData,
//         ['Document']: selectedFile,
//       }));
//     }
//   },[(selectedFile)])

//     const handleEditChange = (key , value)=>{

//       setEditFormData((prevData)=>({...prevData , [key]: value}))
      
//     }


//     const handleEditLineItem =()=>{

//       console.log('editFormData',editFormData)

//     }

//   return(
//     <>
//     <div className="w-full flex-wrap flex justify-center items-center p-2">
//     <div className="border w-full lg:w-1/2">
//      bill view
//     </div>
//     <div className="border w-full lg:w-1/2">
//      <div>
//         Category {selectedCategory}
//       </div>
    
//    <div className="w-full flex-row  border">

//    {/* <div className="w-full border flex flex-wrap items-center justify-center"> */}
//   {selectedCategory &&
//          categoryfields.find((category)=>category.categoryName === selectedCategory).fields.map((field)=>(
//           <>
//           <div key={field.name} className="w-1/2 flex justify-center items-center flex-wrap gap-2">

            
          
//           {field.name === 'From' || field.name === 'To' || field.name === 'Departure' || field.name === 'Pickup Location' ||field.name === 'DropOff Location' || field.name === 'Arrival' ? (
//        <>       
//         <Input
//         id="pac-input"
//         title={field.name}
//         name={field.name}
//         initialValue={editFormData[field.name]}
//         type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
//         placeholder={`Enter ${field.name}`}
//         onChange={(value)=> handleEditChange(field.name , value)}
//       />
//       <GoogleMapsSearch inputId="pac-input" />
//       <div id="map"></div>
//       </>
//       ) : (field.name ==='Class' || field.name ==='Class of Service') ? (
        
//         // <div className=" w-fit">
//         <div className="relative">
//         <Select

//           title={field.name}
//           placeholder={`Select ${field.name}`}
//           options={classDropdownValues || []}// Define your class options here
//           // onSelect={(value) => handleDropdownChange(value, field.name)} // You might need to handle the dropdown selection
//           currentOption={lineItem['Class of Service'] || lineItem['Class']}
//           // violationMessage={`Your violation message for ${field.name}`}
//           // error={{ set: true, message: `Your error message for ${field.name}` }}
//           onSelect={(value) => handleEditChange(field.name ,value)}
//         />
//         </div>
       
//         // </div>
//       ) :(
       
//         <Input
//           title={field.name}
//           name={field.name}
//           type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
//           placeholder={`Enter ${field.name}`}
//           initialValue={editFormData[field.name]}
//           onChange={(value)=> handleEditChange(field.name,value)}
//         />
//       )}
           
//           </div>
//           </>
//          ))}       

// {/* //personal expense */}
// <div className=" ">
// <div className="flex flex-row gap-4">
// <div className="w-1/2 flex-row  h-[52px] flex items-center justify-center  mb-5">

// <div className="w-[100px] flex flex-col">
// <div>
// {/* <ActionButton variant='red' text={personalFlag ? "NO"  : "YES" } onClick={handlePersonalFlag}/> */}
// <Toggle label={'Personal Flag'} initialValue={lineItem.isPersonalExpense || false} checked={personalFlag} onClick={handlePersonalFlag}/>
// </div>
// </div>
// </div>

// <div className="w-1/2">
// {!personalFlag &&
// <Input
// title='Personal Amount'
// // error={ errorMsg.personalAmount}
// name='personalAmount'
// type={'text'}
// initialValue={editFormData['personalExpenseAmount']}
// onChange={(value)=>handleEditChange('personalExpenseAmount',value)}
// />}
// </div> 
// </div>
// {/* //personal expense */}
// <div className="h-[48px] w-1/2 justify-center items-center inline-flex gap-4 ">
//    <div className="w-[150px] h-auto">
//    <Select
//          label="Currency"
        
//        placeholder="Select Currency"
//        options={['INR',"USD",'AUD']} //this data will get from currency  api
//       //  onSelect={(value) => handleDropdownChange(value, 'currencyName')}
//       currentOption={lineItem['Currency']}
//        violationMessage="Your violation message" 
//        error={{ set: true, message: "Your error message" }} 
//        onSelect={(value) =>{ handleEditChange('Currency',value),setSelectedCurrency(value)}}
//        />
//         {/* <Select
//        title='Currency'
//        currentOption={'AUD'}
//        placeholder="Select Currency"
//        options={['INR',"USD",'AUD']} 
//        onSelect={(value)=>{setLineItemDetails({...lineItemDetails,['Currency']:value}),setSelectDropdown(value)}}
       
//        violationMessage="Your violation message" 
//        error={{ set: true, message: "Your error message" }} 
//        /> */}

// </div>  
// { selectedCurrency == null || selectedCurrency !== defaultCurrency   &&
// <div className='mt-6'>
// <ActionButton text="Convert" onClick={()=>handleConverter(editFormData)}/>


// {/* {currencyTableData?.currencyFlag ? <h2>Coverted Amount: {currencyTableData?.convertedAmount ??" converted amt not there"}</h2> : <h2 className='text-red-500'>{errorMsg.currencyFlag.msg}</h2>} */}

// </div>}   
// </div>

// {/* {currencyTableData?.currencyFlag &&
// <div className="w-1/2 text-sm ">
//   <div>
//     <h2>Converted Amount Details:</h2>
//     <p>total amount: {currencyTableData?.convertedAmount ?? " - "}</p>
//     {
//       lineItemDetails?.personalFlag  &&
//       (<div>
//         <p>personal amount: {currencyTableData?.convertedPersonalAmount ?? " - "}</p>
//         <p>Non Personal Amount: {currencyTableData?.convertedNonPersonalAmount ?? " - "}</p>
//         </div>
//       )
     
//     }
    

//   </div>

// </div>
//  } */}

// </div>

// <div className="w-full flex items-center justify-center border-[1px] border-gray-50 mt-5">
// <Upload  
//   selectedFile={selectedFile}
//   setSelectedFile={setSelectedFile}
//   fileSelected={fileSelected}
//   setFileSelected={setFileSelected}
//   />
// </div>

// <div className="w-full mt-5 px-4">
//  <Button text="Update" 
//   onClick={handleEditLineItem} />
// </div>     
// {/* -------------------- */}  
//   </div>
   
//    </div>
//    </div>
    
//     </>
//   )
// }









































// /* eslint-disable react/jsx-key */
// /* eslint-disable react-refresh/only-export-components */
// /* eslint-disable react/display-name */

// import React,{ useState, useEffect , createRef} from "react";
// import {BrowserRouter as Router, useParams} from 'react-router-dom'
// import Icon from "../components/common/Icon";
// import { titleCase, urlRedirection } from "../utils/handyFunctions";
// import Button from "../components/common/Button";
// import Error from "../components/common/Error";
// import PopupMessage from "../components/common/PopupMessage";
// import { cab_purple as cab_icon, airplane_1 as airplane_icon ,house_simple , chevron_down,  cancel, modify} from "../assets/icon";
// import tripDummyData from "../dummyData/tripDummyData";
// import { hrDummyData } from "../dummyData/requiredDummy";
// import Select from "../components/common/Select";
// import ActionButton from "../components/common/ActionButton";
// import Input from "../components/common/Input";
// import Upload from "../components/common/Upload";
// import { cancelTravelExpenseLineItemApi, getTravelExpenseApi, ocrScanApi, postMultiCurrencyForTravelExpenseApi, submitOrSaveAsDraftApi } from "../utils/api.js";
// import { bookAnExpenseData } from "../dummyData/requiredDummy";
// import Dropdown from "../components/common/DropDown.jsx";
// import Search from "../components/common/Search.jsx";
// import GoogleMapsSearch from "./GoogleMapsSearch.jsx";
// import { classDropdown } from "../utils/data.js";
// import Toggle from "../components/common/Toggle.jsx";



// const approvalOptions=["Aarav Singh", "Arnav Patel"]

// export default function () {

//   const mapRef = createRef();
//   const inputRef = createRef();



//   useEffect(() => {
//     const loadMap = () => {
//       const map = new window.google.maps.Map(mapRef.current, {
//         center: { lat: -33.8688, lng: 151.2195 },
//         zoom: 13,
//          // Apply your custom map styles here if any
//       });

//       const input = inputRef.current;
//       const searchBox = new window.google.maps.places.SearchBox(input);

//       map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

//       map.addListener('bounds_changed', () => {
//         searchBox.setBounds(map.getBounds());
//       });

//       let markers = [];

//       searchBox.addListener('places_changed', () => {
//         const places = searchBox.getPlaces();

//         if (places.length === 0) {
//           return;
//         }

//         markers.forEach((marker) => {
//           marker.setMap(null);
//         });
//         markers = [];

//         const bounds = new window.google.maps.LatLngBounds();

//         places.forEach((place) => {
//           if (!place.geometry || !place.geometry.location) {
//             console.log('Returned place contains no geometry');
//             return;
//           }

//           const icon = {
//             url: place.icon,
//             size: new window.google.maps.Size(71, 71),
//             origin: new window.google.maps.Point(0, 0),
//             anchor: new window.google.maps.Point(17, 34),
//             scaledSize: new window.google.maps.Size(25, 25),
//           };

//           markers.push(
//             new window.google.maps.Marker({
//               map,
//               icon,
//               title: place.name,
//               position: place.geometry.location,
//             })
//           );
//           if (place.geometry.viewport) {
//             bounds.union(place.geometry.viewport);
//           } else {
//             bounds.extend(place.geometry.location);
//           }
//         });
//         map.fitBounds(bounds);
//       });
//     };

//     // Load Google Maps script
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places&v=weekly`;
//     script.async = true;
//     script.defer = true;
//     script.onload = loadMap;
//     document.head.appendChild(script);

//     return () => {
//       // Cleanup script
//       document.head.removeChild(script);
//     };
//   }, [mapRef, inputRef]);


//   //--------------------------------google search-----------------------------------------------

 
// //if ocr data will be there
//   const ocrValues = {
//    'Invoice Date' : "2024-12-12",
//    'Flight number':" UA89765",
//    'Class of Service': 'Executive',
//    'Departure' :"Sandila",
//    'Arrival': 'Lucknow', 
//    'Airlines name': "Indira gandhi",
//    'Travelers Name' : "Arti Yadav", 
//   'Booking Reference Number': "", 
//   'Total Amount' : "5000", 
//   'Tax Amount':""
//   }

//   const {cancelFlag , tenantId,empId,tripId} = useParams() ///these has to send to backend get api
//   const [activeIndex, setActiveIndex] = useState(null);

//   const handleItemClick = (index) => {
//     setActiveIndex(index === activeIndex ? null : index);
//   };
  



//   const [onboardingData, setOnboardingData] = useState(null);
//   const [travelAllocationFlag, setTravelAllocationFlag] = useState(null);
//   const [travelExpenseAllocation,setTravelExpenseAllocation]=useState(null);
//   const [categoryfields , setCategoryFields]=useState(null) ///this is for get field after select the category


//   const [selectedAllocations , setSelectedAllocations]=useState([])//for saving allocations on line saving line item
//   const [settlementOptions, setSettlementOptions]=useState([])
//   const [currencyTableData, setCurrencyTableData] = useState(null) //for get data after conversion
  

//   useEffect(() => {
//     const onboardingData = bookAnExpenseData;
//     const travelAllocationFlags = onboardingData?.companyDetails?.travelAllocationFlags;
//     const expenseCategoryAndFields = onboardingData?.companyDetails?.travelExpenseCategories
//     const onboardingLevel = Object.keys(travelAllocationFlags).find((level) => travelAllocationFlags[level] === true);
    
//     const settlementOptionArray =onboardingData?.companyDetails?.expenseSettlementOptions
//     const settlementOptions = Object.keys(settlementOptionArray).filter((option) => settlementOptionArray[option]);
//     setSettlementOptions(settlementOptions)
    
//     setTravelAllocationFlag(onboardingLevel);
//     setOnboardingData(onboardingData);
//     setCategoryFields(expenseCategoryAndFields) //this is for get form fields
//     //for get level

//       const expenseAllocation= onboardingData?.companyDetails?.travelAllocations?.expenseAllocation
//       setTravelExpenseAllocation(expenseAllocation)  

//   }, [bookAnExpenseData]);
   

//   const defaultCurrency =  onboardingData?.companyDetails?.defaultCurrency ?? 'N/A'

//   console.log(travelAllocationFlag)
//   // console.log('expense allocation',travelExpenseAllocation)
//   // console.log('onboardingData',onboardingData)
//   // console.log('categoryViseFields',categoryfields)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const response = await getTravelExpenseApi(tenantId, empId, tripId);
  
//         if (response.error) {
//           setLoadingErrMsg(response.error.message);
//           setOnboardingData(null);
//         } else {
//           setLoadingErrMsg(null);
//           setOnboardingData(response.data);
  
//           if (!response.data.currencyFlag) {
//             setErrorMsg((prevErrors) => ({
//               ...prevErrors,
//               currencyFlag: { set: true, msg: "Currency not available, Please Contact Admin." },
//             }));
//             console.log("Currency is not found in onboarding");
//           }
//         }
//       } catch (error) {
//         setLoadingErrMsg(error.message);
//         setMessage(error.message);
//         setShowPopup(true);
//         setTimeout(() => {
//           setShowPopup(false);
//         }, 3000);
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     // Call the fetchData function whenever tenantId, empId, or tripId changes
//     fetchData();
//   }, [tenantId, empId, tripId]);
  



//   const [selectedCategory,setSelectedCategory]=useState(null)
//    const [categoryFieldBySelect, setCategoryFieldBySelect]=useState([])
//   const handleCategorySelection = (selectedCategory) => {
//     setSelectedCategory(selectedCategory);
//   };

//     //categories array for search the category to get fields
//     const categoryNames = categoryfields &&  categoryfields.map((category)=>(category.categoryName))
    
//     useEffect(()=>{
//       //this is for set intialvalue in categoryfield
//       const categoryFields1 = selectedCategory && categoryfields.find((category) => category.categoryName === selectedCategory).fields.map((field) => field);
//       console.log('categoryFieds',categoryFields1)
//       setCategoryFieldBySelect(categoryFields1)
      
//       const initialFormValues =selectedCategory &&  Object.fromEntries(categoryFields1.map((field)=>[field.name , ocrValues?.[field.name] || '']))
//       console.log('initial value',{...initialFormValues})
//       setLineItemDetails({...initialFormValues})

//     },[selectedCategory])



//     const [lineItemDetails , setLineItemDetails]=useState()//line item save
 
//     //selected category corresponding class & class of service value
//     const [classDropdownValues,setClassDropdownValues]=useState(null)
//     useEffect(() => {
      
//       const category = classDropdown.find(category => category.categoryName === selectedCategory);
//       if (category) {
//         // Access the classes array and console.log it
//         console.log(category.classes);
//         setClassDropdownValues(category.classes);
//       } else {
//         console.log(`Category "${selectedCategory}" not found.`);
//       }
//     }, [selectedCategory]);
    
  
//   //get travel request Id from params
   

//     const DASHBOARD_URL=`http://localhost:3000/${tenantId}/${empId}`
//     const [showPopup, setShowPopup] = useState(false)
//     const [message, setMessage] = useState(null)
    
//     const [travelRequestStatus, setTravelRequestStatus] = useState('pending approval')
    
//     const [isUploading , setIsUploading]=useState(false)
//     const [isLoading, setIsLoading] = useState(true)
//     const [loadingErrMsg, setLoadingErrMsg] = useState(null)
//     const [expenseLineForm, setExpenseLineForm]= useState({
//       totalAmount:"",
//       personalFlag:"",
//     })

//     const [selectedFile ,setSelectedFile]=useState(null)
//     const [fileSelected,setFileSelected]=useState(null)
 

//     const [personalFlag,setPersonalFlag]=useState(false)
//     const [errorMsg,setErrorMsg]=useState({
//         currencyFlag:{set:false,msg:""},//if currency is not in backend database for conversion
//         totalAmount:{set:false,msg:""}, //"Total Amount"
//         personalAmount:{set:false,msg:""}

//       })



//     const [showCancelModal, setShowCancelModal] = useState(false)
//     const [ rejectionReason,setRejectionReason] =useState(null)
  
// const handlePersonalFlag=()=>{
//   setPersonalFlag((prev)=>(!prev))
  
// }


// useEffect(()=>{
  
//    if(!personalFlag){
//     setLineItemDetails(({...lineItemDetails, personalExpenseAmount:"" ,isPersonalExpense:false}))
//    }
  

// },[personalFlag])




// //level-1 store selected allocation in array
// const onAllocationSelection = (option, headerName) => {
//   // Create a new allocation object
//   const newAllocation = { headerName: headerName, headerValue: option };
//   setSelectedAllocations((prevAllocations) => [...prevAllocations, newAllocation]);
// };





// const onReasonSelection = (option) => {
//         setRejectionReason(option)
//         console.log(option)
//     }
//     const [selectDropdown , setSelectDropdown]= useState(null)

//     const handleDropdownChange = (value, dropdownType) => {
//       if (dropdownType === 'Class' || dropdownType === 'Class of Service') {
//         const key = dropdownType === 'Class' ? 'Class' : 'Class of Service';
//         setLineItemDetails((prevState) => ({ ...prevState, [key]: value }));
//       } else if (dropdownType === 'categoryName') {
//         setExpenseLineForm({ ...expenseLineForm, categoryName: value });
//       } else if (dropdownType === 'currencyName') {
//         setLineItemDetails((prevState) => ({ ...prevState, currencyName: value }));
//         setSelectDropdown(value);
//       }
//     };

//     console.log(lineItemDetails?.personalExpenseAmount)
//   // const handleInputChange=(e)=>{
//   //   const {name , value} = e.target
//   //   setLineItemDetails((prevState)=>({...prevState,[name]:value}))

//   // }
//   const handleInputChange=(name, value)=>{
//     console.log(`Updating ${name} with value:`, value);
//     setLineItemDetails((prevState) => ({ ...prevState, [name]: value || "" }));
    
//   }



//   ///handle convertor to exchagne value behalf of default currency
//   const handleConverter = async (data ) => { 
//   const {Currency , personalExpenseAmount , 'Total Amount': totalAmount ,'Total Fare': totalFare} =data
//     // const { Currency, personalExpenseAmount,} = lineItemDetails;
//     // const totalAmount = lineItemDetails['Total Amount'];
//     let allowForm = true;
  
//     if (totalAmount === "") {
//       setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: true, msg: "Enter total amount" } }));
//       allowForm = false;
//     } else {
//       setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: false, msg: "" } }));
//     }
  
//     if (personalFlag && personalExpenseAmount === "") {
//       setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: true, msg: "Enter personal amount" } }));
//       allowForm = false;
//     } else {
//       setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: false, msg: "" } }));
//     }
  
//     if (allowForm) {
//       const nonPersonalAmount = totalAmount || totalFare - personalExpenseAmount;
  
//       // Create an object with the dynamic field name and value
  
//       const convertDetails = {
//         currencyName: Currency,
//         personalExpense: personalExpenseAmount || "",
//         nonPersonalExpense: nonPersonalAmount || "",
//         totalAmount: totalAmount || totalFare,
       
//       };
//       console.log(convertDetails)
      
// ///api 
//     try{
//       setIsLoading(true)
//       const response= await postMultiCurrencyForTravelExpenseApi(tenantId, convertDetails)
//       if(response.error){
//         setLoadingErrMsg(response.error.message)
//         setCurrencyTableData(null)
//       }else{
//         setLoadingErrMsg(null)
//         setCurrencyTableData(response.data) //here it war response
//         if(!currencyTableData.currencyFlag){              
//           setErrorMsg((prevErrors)=>({...prevErrors,currencyFlag:{set:true,msg:"Currency not available,Please Contact Admin."}}))
//           console.log("currency is not found in onboarding")
//         }
//       }
//     }catch(error){
//       setLoadingErrMsg(error.message)
//       setMessage(error.message)
//       setShowPopup(true)
//       setTimeout(() => {
//         setShowPopup(false)
//       }, 3000);
      
//     } finally{
//       setIsLoading(false);
//     }
  

//     }
//   };


//     const [formData, setFormData] = useState(null); //this is for get expense data
//     const [getExpenseData, setGetExpenseData]=useState(); //to get data header level 
//     const [getSavedAllocations,setGetSavedAllocations]=useState()  ///after save the allocation then i will get next time from here 
//     const [openModal,setOpenModal]=useState(null);
//     // const [openModal,setOpenModal]=useState(false);
//     const [openLineItemForm,setOpenLineItemForm]=useState(true)
//     const [headerReport,setHeaderReport]=useState(null)


//     const [editLineItemById, setEditLineItemById]=useState(null)
  
  
//     useEffect(() => {

//         const tripData = tripDummyData
//         const hrData= hrDummyData
//         const expenseData= tripDummyData.travelExpenseData //get line items
//         console.log('expenseData',expenseData)   
//         ///where is newExpenseReport = true
//         const headerReportData = expenseData.find((expense) => expense.newExpenseReport);
//         setHeaderReport(headerReportData)
//         setFormData({...tripData})
//         setGetSavedAllocations({...hrData});
//         setGetExpenseData([...expenseData]);
//         setTravelRequestStatus(tripData)
//         setIsLoading(false)
//       },[])


// // console.log('headerdata',headerReport)
// // console.log("formdata",formData)
      
//     useEffect(()=>{
//         if(showCancelModal){
//             document.body.style.overflow = 'hidden'
//         }
//         else{
//             document.body.style.overflow = 'auto'
//         }
//     },[showCancelModal])



    

//      const handleOpenModal=(id)=>{
//       if(id==='upload'){
//         setOpenModal('upload')
//       }
//       if(id==='category'){
//         setOpenModal('category')
//       }
//      }
//     //  const handleOpenModal=()=>{
//     //    setOpenModal((prevState)=>(!prevState))
//     //  }

//      const handleCancelExpenseHeader=()=>{
//         console.log("cancel header")
//      }



//     // console.log("getExpenseData",getExpenseData)
// ///----------------------------------------  




// //handler for  submit and draft
// const handleSubmitOrDraft=async(action)=>{
//     const expenseHeaderId="expenshhID"
//     console.log('submit')
    
//     setIsLoading(true)

//     try{
//         await submitOrSaveAsDraftApi(action,tenantId,empId,tripId,expenseHeaderId,headerReport)
//         setIsLoading(false)
//         setShowPopup(true)
//         setMessage("HeaderReport has been submitted.")
//         setTimeout(()=>{
//           setShowPopup(false)
//           urlRedirection(DASHBOARD_URL)
//         },5000)
  
//       }catch(error){
//         setShowPopup(true)
//         setMessage("try again")
//         setTimeout(()=>{
//           setShowPopup(false)
//         },3000)
//         console.error('Error confirming trip:', error.message);
//       }  

//     }


// //handle save line items

//     const handleSaveLineItemDetails = () => { 
//       // Create a new object with the updated category
      
//       const expenseLines = { ...lineItemDetails, category: selectedCategory ,isPersonalExpense:personalFlag , document : fileSelected ? selectedFile : ""};  
//       // Set the updated line item details
//       // setLineItemDetails((prevState)=>({...prevState ,expenseLines}));
      
      
//       //for companyDetails
//       const companyDetails = onboardingData?.companyDetails
//       // Log the updated details
//       const dataWithCompanyDetails={
//         companyDetails:companyDetails,
//         expenseLines:[expenseLines],
//         // expenseLines:[{...expenseLines}],
//         allocations: selectedAllocations
//       }
//       console.log('save line item', dataWithCompanyDetails)
//       setSelectedCategory(null)
//     };


  
    

//     const handleDeleteLineItem=async(lineItemId)=>{
//       try{
//         setIsLoading(true)
//         const response= await cancelTravelExpenseLineItemApi(lineItemId) //pass tripId, headerexpense report and lineItemId
//         if(response.error){
//           setLoadingErrMsg(response.error.message)
//           setCurrencyTableData(null)
//         }else{
//           setLoadingErrMsg(null)
//           setLoadingErrMsg(response.data) 
//         }
//       }catch(error){
//         setLoadingErrMsg(error.message)
//         setMessage(error.message)
//         setShowPopup(true)
//         setTimeout(() => {
//           setShowPopup(false)
//         }, 3000);
        
//       } finally{
//         setIsLoading(false);
//       }

//     }


// console.log('objectca',categoryfields)

// ///////////////////----------modify lineitem start



// const handleModifyLineItem = () => {
//   const expenseLines = { ...lineItemDetails, category: selectedCategory ,isPersonalExpense:personalFlag , document : fileSelected ? selectedFile : ""};  
//   // Set the updated line item details
//   // setLineItemDetails((prevState)=>({...prevState ,expenseLines}));
  
  
//   //for companyDetails
//   const companyDetails = onboardingData?.companyDetails
//   // Log the updated details
//   const dataWithCompanyDetails={
//     companyDetails:companyDetails,
//     expenseLines:[{...expenseLines}],
//     allocations: selectedAllocations
//   }
//   console.log('save line item', dataWithCompanyDetails)
// };

// const [ocrFileSelected , setOcrFileSelected]=useState(false)
// const [ocrSelectedFile , setOcrSelectedFile]=useState(null)
// const [ocrField , setOcrField]=useState(null)




// const handleOcrScan = async () => {
//   // console.log('ocrfile from handle', ocrSelectedFile);

//   const formData = new FormData();
//     formData.append('categoryName', selectedCategory);
//     formData.append('file', ocrSelectedFile);

//   console.log('ocrfile from handle',formData)

//   try {
//     setIsUploading(true);

//     // Assuming ocrScanApi is an asynchronous function
//     const response = await ocrScanApi(formData);

//     if (response.error) {
//       setLoadingErrMsg(response.error.message);
//       setCurrencyTableData(null);
//     } else {
//       setLoadingErrMsg(null);
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
//     setLoadingErrMsg(error.message);
//     setMessage(error.message);
//     setShowPopup(true);

//     setTimeout(() => {
//       setShowPopup(false);
//     }, 3000);
//   } finally {
//     setIsUploading(false);
//   }
// };




//   return <>
// {/* <Error message={loadingErrMsg}/> */}
//     {isLoading && <Error/>}
//     {loadingErrMsg&& <h2>{loadingErrMsg}</h2>}
//       {!isLoading && 
//         <div className="w-full h-full relative bg-white-100 md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
//         {/* app icon */}
//         <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
//             <Icon/>
//         </div>

       

//         {/* Rest of the section */}
//         <div className="w-full h-full mt-10 p-10 font-cabin tracking-tight">
//         <div>
//                Expense Type: Travel
//         </div>

//         <div>
//           <AllocationComponent travelAllocationFlag={travelAllocationFlag} travelExpenseAllocation={travelExpenseAllocation} onAllocationSelection={onAllocationSelection}/>
//         </div>
        
//         <div>
//           <ExpenseHeader cancelFlag={cancelFlag}
//               handleCancelExpenseHeader={handleCancelExpenseHeader}
//               handleSubmitOrDraft={handleSubmitOrDraft}
//               formData={formData} 
//               approvalOptions={approvalOptions} 
//               onReasonSelection={onReasonSelection} 
//               settlementOptions={settlementOptions} 
//               defaultCurrency={defaultCurrency} 
//               />
//         </div>


           
//             <hr/>

//             <div className="form mt-5">

//             <div className="w-fit">
//             <Button disabled={selectedCategory !== null} onClick={()=>handleOpenModal('category')} text={"Add Line Item"}/>
//             </div>
//             <div className=" w-full flex flex-row mt-5">
             
//   <div className="flex flex-col w-full">         
//       <div className="container mx-auto ">
//       <h1 className="text-2xl font-bold mb-4">Header Report</h1>
//       {getExpenseData.map((item,index)=>(
//        <div key={index} className="mb-4">
//           <div
//             className="flex justify-between items-center bg-gray-200 p-4 cursor-pointer"
//             onClick={() => handleItemClick(index)}
//           >
//             <div>{`Header Report Number : ${item?.expenseHeaderNumber ?? 'N/a'}`}</div>
//             <div>{activeIndex === index ? '▲' : '▼'}</div>
//           </div>
//           {activeIndex === index && (
//             <div className="bg-white p-4">
// {/* ///already booked travel details */}
// <div className="mt-5 flex flex-col gap-4">
// {['flights', 'trains', 'buses', 'cabs', 'hotels'].map((itnItem, itnItemIndex) => {
//   if (item?.alreadyBookedExpenseLines && item.alreadyBookedExpenseLines[itnItem]?.length > 0) {
//     return (
//       <div key={itnItemIndex}>
//         <details>
//           <summary>
//             <p className="inline-flex text-xl text-neutral-700">
//               {`${titleCase(itnItem)} `}
//             </p>
//           </summary>
//           <div className='flex flex-col gap-1'>
//             {item.alreadyBookedExpenseLines[itnItem].map((item, itemIndex) => {
//               if (['flights', 'trains', 'buses'].includes(itnItem)) {
//                 return (
//                   <div key={itemIndex}>
//                     <FlightCard
//                       // onClick={()=>handleCancel(itnItem.slice(0, -1), itemIndex, item.formId, item.isReturnTravel)} 
//                       from={item.from} 
//                       to={item.to} 
//                       itnId={item.itineraryId}
//                       // handleLineItemAction={handleLineItemAction}
//                       showActionButtons={travelRequestStatus !== 'pending approval' && item.status == 'pending approval'}
//                       date={item.date} time={item.time} travelClass={item.travelClass} mode={titleCase(itnItem.slice(0, -1))} />
//                   </div>
//                 );
//               } else if (itnItem === 'cabs') {
//                 return (
//                   <div key={itemIndex}>
//                     <CabCard 
//                       itnId={item.itineraryId}
//                       from={item.pickupAddress} to={item.dropAddress} date={item.date} time={item.time} travelClass={item.travelClass} isTransfer={item.type !== 'regular'} />
//                   </div>
//                 );

//               } else if (itnItem === 'hotels') {
//                 return (
//                   <div key={itemIndex}>
//                     <HotelCard 
//                       itnId={item.itineraryId}        
//                       checkIn={item.checkIn} checkOut={item.checkOut} date={item.data} time={item.time} travelClass={item.travelClass} mode='Train' />
//                   </div>
//                 );
//               }
//             })}
//           </div>
//         </details>
//       </div>
//     );
//   }
//   return null; // Return null if no items in the itinerary
// })}
// </div>
// {/* ///alreadybooked travel details */}

// {/* ///saved lineItem */}







// {/* get lineitem data from backend start*/}

// {item.expenseLines.map((lineItem, index) => (

//     lineItem._id === editLineItemById ? 
//     (
   
//     <EditForm handleConverter={handleConverter} selectedCategory={selectedCategory} categoryfields={categoryfields} lineItemDetails={lineItemDetails} classDropdownValues ={classDropdownValues} lineItem={lineItem} defaultCurrency={defaultCurrency}/>
    
//     )  :

// <div className="w-full flex-wrap flex justify-center items-center p-2">

// <EditView lineItem={lineItem} index={index} newExpenseReport={item.newExpenseReport} setSelectedCategory={setSelectedCategory} setEditLineItemById={setEditLineItemById} handleDeleteLineItem={handleDeleteLineItem}/>
// </div>
//   ))}
// {/* </div> */}

// {/* get lineItem data from backend end*/}


// {/* </div> */}



//  </div>
//           )}
//         </div>))}
      
//  </div>

// {/*start new //lineItemform */}
   
// <div className=" w-full flex flex-col  lg:flex-row">

// <div className="border w-full lg:w-1/2">
//   bill view
// </div>
// <div className="border w-full lg:w-1/2">
//   input fields
  
//     <>
    
// <div className=" w-full flex-wrap flex flex-col justify-center items-center p-2">
//     {/* <div className="w-1/2">
//       <Search 
//       title="Category" 
//       placeholder='Select Category' 
//       options={categoriesList}
//       onSelect={(category)=>handleCategorySelection(category)}/>
//      </div>    */}
//  <div className="w-full flex-row  border">
//   <div className="w-full border flex flex-wrap  items-center justify-center  ">

// {selectedCategory&&categoryFieldBySelect && categoryFieldBySelect.map((field)=>(
//           <>
//   <div key={field.name} className="w-1/2 flex justify-center items-center px-4">
//           {field.name === 'From' || field.name === 'To' || field.name === 'Departure' || field.name === 'Pickup Location' ||field.name === 'DropOff Location' || field.name === 'Arrival' ? ( 
//        <>       
//         <Input
//         inputRef={inputRef}
//         title={field.name}
//         name={field.name}
//         type={'text'}
//         initialValue={lineItemDetails[field.name]}
//         placeholder={`Enter ${field.name}`}
//         value={lineItemDetails[field.name  ||""]}
//         onChange={(value)=>handleInputChange(field.name,value)}
//       />
//       <div ref={mapRef} className="map"></div>
//      {/* <GoogleMapsSearch mapRef={mapRef} inputRef={inputRef} /> */}
//       </>
//       ) : (field.name ==='Class' || field.name ==='Class of Service') ? (
//           <div className=" w-full translate-y-[-6px]">
//         <Select
//           title={field.name}
//           name={field.name}
//           placeholder={`Select ${field.name}`}
//           options={classDropdownValues || []}// Define your class options here
//           currentOption={lineItemDetails[field.name] || ''}
//           onSelect={(value)=>handleInputChange(field.name, value)}
//           // violationMessage={`Your violation message for ${field.name}`}
//           // error={{ set: true, message: `Your error message for ${field.name}` }}
//         />
//         </div>
//       ) :(
//         // Otherwise, render a regular input field
//         <Input
//          initialValue={lineItemDetails[field.name]}
//           title={field.name}
//           name={field.name}
//           type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
//           placeholder={`Enter ${field.name}`}
//           value={lineItemDetails[field.name || '']}
//           onChange={(value)=>handleInputChange(field.name , value)}
//         />
//       )}     
//           </div>        
//           </>
//          ))}
//          </div>

// {/* //personal expense */}




// <div className='flex flex-col px-4 justify-between'>

// <div className="flex flex-row justify-evenly items-center h-[73px]"> 
// <div className="flex-1">
// <Toggle label={'Personal Flag'} initialValue={false}  onClick={handlePersonalFlag}/>
// </div>


// <div className="w-full ">
//   {personalFlag &&
//   <Input
//   title='Personal Amount'
//   error={ errorMsg.personalAmount}
//   name='personalExpenseAmount'
//   type={'text'}
//   value={lineItemDetails.personalExpenseAmount || ""}
//   onChange={(value)=>handleInputChange( ['personalExpenseAmount'],value)}
//   />}

// </div>
// </div> 

 

// {/* //personal expense */}


// {/* {currencyTableData?.currencyFlag &&
// <div className="w-1/2 text-sm ">
//   <div>
//     <h2>Converted Amount Details:</h2>
//     <p>total amount: {currencyTableData?.convertedAmount ?? " - "}</p>
//     {
//       lineItemDetails?.personalFlag  &&
//       (<div>
//         <p>personal amount: {currencyTableData?.convertedPersonalAmount ?? " - "}</p>
//         <p>Non Personal Amount: {currencyTableData?.convertedNonPersonalAmount ?? " - "}</p>
//         </div>
//       )
     
//     }
    

//   </div>

// </div>
//  } */}

// <div className="relative">
// <div className=" h-[48px] w-[100px]  mb-10 mr-28 mt-[-10px] ">
//    <Select
//        title='Currency'
//        currentOption={'AUD'}
//        placeholder="Select Currency"
//        options={['INR',"USD",'AUD']} 
//        onSelect={(value)=>{setLineItemDetails({...lineItemDetails,['Currency']:value}),setSelectDropdown(value)}}
       
//        violationMessage="Your violation message" 
//        error={{ set: true, message: "Your error message" }} 
//        />

// </div>  

// {/* ////-------- */}
// <div className='absolute top-6 left-[210px] w-fit'>
// {selectDropdown == null || selectDropdown !== defaultCurrency   &&
// <ActionButton text="Convert" onClick={()=>handleConverter(lineItemDetails)}/>
// }
// </div>
// </div>
// {/* ------////-------- */}


// <div className="w-full mt-4 flex items-center justify-center border-[1px] border-gray-50 ">
// <Upload  
//   selectedFile={selectedFile}
//   setSelectedFile={setSelectedFile}
//   fileSelected={fileSelected}
//   setFileSelected={setFileSelected}
//   />
// </div>
// </div>
// <div className="w-full mt-5 px-4" >
//  <Button text="Save" 
//   onClick={handleSaveLineItemDetails} />
// </div>   

// {/* -------------------- */}


     
//      </div>
// </div>
   
  
//     </>
 
 
// </div>

// </div>

   
// {/* end //lineItemform */}


//     </div>      


              
               
//             </div>
//             </div>
//             {openModal =='category' && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none" >
//                 <div className='z-10 max-w-4/5 w-2/5 min-h-4/5 max-h-4/5 scroll-none bg-white-100  rounded-lg shadow-md'>
//                     <div className="p-10">
//                       <div className="flex flex-col justify-center items-center">
//                         <p className="text-xl font-cabin">Select the expense  category for this line item:</p>
//                                   <div className="w-fit">
//                                     <Search 
//                                     title='.'
//                                     placeholder='Search Category' 
//                                     options={categoryNames}
//                                     onSelect={(category)=>handleCategorySelection(category)}/>
//                                   </div>   
//                         <div className="flex w-full mt-10 justify-evenly">
//                             <Button variant='fit' text='Scan Bill' onClick={()=>handleOpenModal('upload')} disabled={selectedCategory== null}/>
//                             <Button variant='fit' text='Manually' onClick={()=>{setOpenLineItemForm(true);setOpenModal(false)}} disabled={selectedCategory== null}/>
//                         </div>
//                         </div>

//                     </div>
//                 </div>
//                 </div>
//             }
//             {openModal==='upload' && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none" >
//                 <div className='z-10 max-w-4/5 w-2/5 min-h-4/5 max-h-4/5 scroll-none bg-white-100  rounded-lg shadow-md'>
//                 <div onClick={()=>{setOpenModal(null);setOcrSelectedFile(null);setOcrFileSelected(false);setSelectedCategory(null)}} className=' w-10 h-10 flex justify-center items-center float-right  mr-5 mt-5 hover:bg-red-300 rounded-full'>
//                       <img src={cancel} className='w-8 h-8'/>
//                       </div>
//                     <div className="p-10">
                    
//                       <div className="flex flex-col justify-center items-center">
                       

                       
//                         {ocrFileSelected ? 
                        
//                         <div className="w-full  flex flex-col justify-center h-[500px]  overflow-x-auto">
//                         <p>Document Name: {ocrSelectedFile.name}</p>
//                         <div className={` w-fit`}>
//                         <Button disabled={isUploading}  text='reupload' onClick={()=>{setOcrFileSelected(false);setOcrSelectedFile(null)}}/>
//                         </div>
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

//                          <Button loading={isUploading} variant='fit' text='Scan' onClick={handleOcrScan} disabled={selectedCategory== null}/>
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


//         <div>

//         </div>
        
        
        
//         </div>
//       }

//       <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>

//   </>;
// }





// //expense allocation

// function AllocationComponent ({travelExpenseAllocation ,travelAllocationFlag , onAllocationSelection}) {

//   return(
//      <div  className="flex md:flex-row flex-col my-5 justify-evenly items-center flex-wrap">            
             
//          {travelAllocationFlag ==='level1' && travelExpenseAllocation && travelExpenseAllocation.map((expItem , index)=>(
//               <>
             
//               <div key={index}  className="h-[48px] inline-flex my-4 mx-2">
               
//                 <Select 
//                   options={expItem.headerValues}
//                   onSelect={(option) => onAllocationSelection(option, expItem.headerName)}
//                   placeholder='Select Allocation'
//                   title={`${titleCase(expItem.headerName ?? "")}`}
//                 />
               
//               </div>
//               </>
//        ))}       
//      </div> )}




// ///expense details on header
// function ExpenseHeader({formData
//    ,approvalOptions
//    ,onReasonSelection
//    ,settlementOptions,
//     defaultCurrency,
//     cancelFlag,
//     handleCancelExpenseHeader,
//     handleSubmitOrDraft,
//    }){
//   return(
//     <>
//     <div className='flex flex-col md:flex-row mb-2 justify-between items-center'>
//               <div>
//                 <p className="text-2xl text-neutral-600 mb-5">{`${formData?.tripPurpose?? "N/A"}`}</p>
//               </div>
//                 <div className="inline-flex gap-4 justify-center items-center">
//                     {cancelFlag ?
                    
//                     (<div className="flex mt-10 flex-row-reverse">
//                     <Button variant='fit' text='Cancel' onClick={()=>handleCancelExpenseHeader}/>
//                    </div>):
                  
//                     (<>
//                     <div className="flex mt-10 flex-row-reverse">
//                     <Button text='Save as Draft' onClick={()=>handleSubmitOrDraft("save as draft")}/>
//                    </div>
//                     <div className="flex mt-10 flex-row-reverse">
//                     <Button variant='fit' text='Submit' onClick={()=>handleSubmitOrDraft("submit")}/>
//                    </div>
//                    </>)}
                   

                   
                   
//                 </div>
             
//             </div>

//     <div className="flex flex-col md:flex-row justify-between items-center">
// <div>
//     <div className="flex gap-2 font-cabin text-xs tracking-tight">
//         <p className="w-[200px] text-neutral-600">Created By:</p>
//         <p className="text-neutral-700">{formData?.userId?.name}</p>
//     </div>
//     <div className="flex gap-2 font-cabin text-xs tracking-tight">
//         <p className="w-[200px] text-neutral-600">Trip Number:</p>
//         <p className="text-neutral-700">{formData?.tripNumber?? "not available"}</p>
//     </div>
//     <div className="flex gap-2 font-cabin text-xs tracking-tight">
//         <p className="w-[200px] text-neutral-600">Total CashAdvance:</p>
//         <p className="text-neutral-700">{formData?.expenseAmountStatus?.totalCashAmount??"not available"}</p>
//     </div>
//     <div className="flex gap-2 font-cabin text-xs tracking-tight">
//         <p className="w-[200px] text-neutral-600">Default Currency:</p>
//         <p className="text-neutral-700">{defaultCurrency}</p>
//     </div>
// </div>

// <div className=" flex flex-col gap-2 lg:flex-row">

// <div className="h-[48px]">
// <Select 
//   options={approvalOptions}
//   onSelect={onReasonSelection}
//   placeholder='Select Approver'
//   title="Select Approver"
// />
// </div>

// <div>
// <Select 
//   options={settlementOptions}
//   onSelect={onReasonSelection}
//   placeholder='Select Travel Expense '
//   title="Expense Settlement"
// />

// </div>
// </div>
// </div>
// </>
//   )
// }









// function spitImageSource(modeOfTransit){
//     if(modeOfTransit === 'Flight')
//         return airplane_icon
//     else if(modeOfTransit === 'Train')
//         return cab_icon
//     else if(modeOfTransit === 'Bus')
//         return cab_icon
// }





// function FlightCard({amount,from, mode='Flight', showActionButtons, itnId, handleLineItemAction}){
//     return(
//     <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
//     <img src={spitImageSource(mode)} className='w-4 h-4' />
//     <div className="w-full flex sm:block">
//         <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
//             <div className="flex-1">
//                 Travel Allocation   
//             </div>
           
//             <div className="flex-1">
//                 Amount
//             </div>
//             <div className="flex-1">
//                 Already Booked
//             </div>
//         </div>

//         <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
//             <div className="flex-1">
//                 {titleCase(from)}     
//             </div>
            
//             <div className="flex-1">
//                 {amount??'N/A'}
//             </div>
//             <div className='flex-1'>
//                 <input type="checkbox" checked={true}/>
//             </div>
//         </div>
//     </div>

//     {/* {showActionButtons && 
//     <div className={`flex items-center gap-2 px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] text-gray-600 cursor-pointer bg-slate-100  hover:bg-red-100  hover:text-red-900 `} onClick={onClick}>
//         <div onClick={()=>handleLineItemAction(itnId, 'approved')}>
//             <ActionButton text={'approve'}/>
//         </div>
//         <div onClick={()=>handleLineItemAction(itnId, 'rejected')}>
//             <ActionButton text={'reject'}/>   
//         </div>   
//     </div>} */}

//     </div>)
// }



// function HotelCard({amount, hotelClass, onClick, preference='close to airport,'}){
//     return(
//     <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
//     <p className='font-semibold text-base text-neutral-600'>Hotel</p>
//     <div className="w-full flex sm:block">
//         <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
//            <div className="flex-1">
//            Travel Allocation   
//             </div>
//             <div className="flex-1">
//                 Amount
//             </div>
            
//             <div className='flex-1'>
//                 Already Booked
//             </div>
//         </div>

//         <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
//             <div className="flex-1">
//                 {/* {checkIn}      */}
//                 Deparment
//             </div>
//             <div className="flex-1">
//                 {hotelClass??'N/A'}
//             </div>
//             <div className='flex-1'>
//                 <input type="checkbox" checked/>
//             </div>
//         </div>

//     </div>

   

//     </div>)
// }

// function CabCard({amount,from, to, date, time, travelClass, onClick, mode, isTransfer=false, showActionButtons, itnId, handleLineItemAction}){
//     return(
//     <div className="shadow-sm min-h-[76px] bg-slate-50 rounded-md border border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x">
//     <div className='font-semibold text-base text-neutral-600'>
//     <img src={cab_icon} className='w-6 h-6' />
//         <p className="text-xs text-neutral-500">{isTransfer? 'Transfer Cab': 'Cab'}</p>
//     </div>
//     <div className="w-full flex sm:block">
//         <div className='mx-2 text-xs text-neutral-600 flex justify-between flex-col sm:flex-row'>
//             {/* <div className="flex-1">
//                 Pickup     
//             </div> */}
//             <div className="flex-1" >
//             Travel Allocation   
//             </div>
//             {/* <div className="flex-1">
//                     Date
//             </div> */}
//             <div className="flex-1">
//                 Amount
//             </div>
//             {<div className="flex-1">
//                Already Booked
//             </div>}
//         </div>

//         <div className="mx-2 text-sm w-full flex justify-between flex-col sm:flex-row">
//             {/* <div className="flex-1">
//                 {from??'not provided'}     
//             </div> */}
//             <div className="flex-1">
//                 {/* {to??'not provided'}      */}
//                 Legal Entity
//             </div>
//             {/* <div className="flex-1">
//                 {date??'not provided'}
//             </div> */}
//             <div className="flex-1">
//                 {amount??'N/A'}
//             </div>
//            {/* {!isTransfer && <div className="flex-1">
//                 {travelClass??'N/A'}
//             </div>} */}
//              <div className='flex-1'>
//                 <input type="checkbox" checked/>
//             </div>
//         </div>
//     </div>
  
//     </div>)
// }



// function EditView({lineItem, index ,newExpenseReport ,setEditLineItemById,setSelectedCategory, handleDeleteLineItem}){
//   return(
//     <>
// <div className='flex flex-col lg:flex-row border '> 
// <div className="border w-full lg:w-1/2">
//   bill view
//   {lineItem.document}
// </div>
// <div className="border w-full lg:w-1/2">
//     <div className="w-full flex-row  border mt-2">
//       <h2>LineItem {index+1}</h2>
//      <div className="w-full flex items-center justify-start h-[52px] border px-4 ">
//       <p className="text-zinc-600 text-medium font-semibold font-cabin">Category -{titleCase(lineItem.categoryName)}</p>
//     </div>   
//     <div key={index} className="w-full  border flex flex-wrap items-center px-4 justify-between  py-4">
//         {Object.entries(lineItem).map(([key, value]) => (

//         key!== 'categoryName' && key!== 'isPersonalExpense' &&    key !== '_id' && key !== 'policyViolation' && key !== 'document' &&(

//               <>
//         <div className="min-w-[200px] w-full md:w-fit   flex-col justify-start items-start gap-2 ">
                    
//         <div className="text-zinc-600 text-sm font-cabin">{titleCase(key)}</div>
        
    
//         <div className=" w-full h-full bg-white items-center flex border border-neutral-300 rounded-md">
        
      
//               <div key={key}>
//                 <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin px-6 py-2">
                 
//                   {` ${value}`}
//                 </div>
               
//               </div>
              
           
//         </div>
//         <div className=" w-full text-xs text-yellow-600   font-cabin">{['policyViolation']}</div>
//         </div>
//         </>
//          )
//          ))}
         
//       {
//       // item.newExpenseReport 
//       newExpenseReport &&
//           <div className="w-full mt-5 m-4 flex justify-end gap-4" >
//             <Button text="Edit"   onClick={()=>(setEditLineItemById(lineItem._id,setSelectedCategory(lineItem.categoryName)))} />
//             <Button text="Delete" onClick={()=>(handleDeleteLineItem(lineItem._id))} />
//           </div>
//       }    
//     </div>
    
//     </div>
// </div>
// </div>
// </>
//   )
// }




// function EditForm({selectedCategory ,categoryfields ,lineItemDetails,classDropdownValues,lineItem,defaultCurrency,handleConverter }){

//   const[ personalFlag , setPersonalFlag]=useState()

//   const handlePersonalFlag=()=>{
//      setPersonalFlag((prev)=>(!prev))
//      if(!personalFlag){
//      setEditFormData((prevData)=>({...prevData, isPersonalExpense: false , personalExpenseAmount:""}))
//     }else{
//        setEditFormData((prevData) => ({ ...prevData, isPersonalExpense:true}))

//   }}

//   const [editFormData ,setEditFormData]=useState(lineItem)
//   const [selectedCurrency , setSelectedCurrency]=useState(null)

//   const [selectedFile ,setSelectedFile]=useState(null)
//   const [fileSelected,setFileSelected]=useState(false)



//   useEffect(()=>{
//     if (fileSelected) {
//       setEditFormData((prevData)=>({
//         ...prevData,
//         ['Document']: selectedFile,
//       }));
//     }
//   },[(selectedFile)])

//     const handleEditChange = (key , value)=>{

//       setEditFormData((prevData)=>({...prevData , [key]: value}))
      
//     }


//     const handleEditLineItem =()=>{

//       console.log('editFormData',editFormData)

//     }

//   return(
//     <>
//     <div className="w-full flex-wrap flex justify-center items-center p-2">
//     <div className="border w-full lg:w-1/2">
//      bill view
//     </div>
//     <div className="border w-full lg:w-1/2">
//      <div>
//         Category {selectedCategory}
//       </div>
    
//    <div className="w-full flex-row  border">

//    {/* <div className="w-full border flex flex-wrap items-center justify-center"> */}
//   {selectedCategory &&
//          categoryfields.find((category)=>category.categoryName === selectedCategory).fields.map((field)=>(
//           <>
//           <div key={field.name} className="w-1/2 flex justify-center items-center flex-wrap gap-2">

            
          
//           {field.name === 'From' || field.name === 'To' || field.name === 'Departure' || field.name === 'Pickup Location' ||field.name === 'DropOff Location' || field.name === 'Arrival' ? (
//        <>       
//         <Input
//         id="pac-input"
//         title={field.name}
//         name={field.name}
//         initialValue={editFormData[field.name]}
//         type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
//         placeholder={`Enter ${field.name}`}
//         onChange={(value)=> handleEditChange(field.name , value)}
//       />
//       <GoogleMapsSearch inputId="pac-input" />
//       <div id="map"></div>
//       </>
//       ) : (field.name ==='Class' || field.name ==='Class of Service') ? (
        
//         // <div className=" w-fit">
//         <div className="relative">
//         <Select

//           title={field.name}
//           placeholder={`Select ${field.name}`}
//           options={classDropdownValues || []}// Define your class options here
//           // onSelect={(value) => handleDropdownChange(value, field.name)} // You might need to handle the dropdown selection
//           currentOption={lineItem['Class of Service'] || lineItem['Class']}
//           // violationMessage={`Your violation message for ${field.name}`}
//           // error={{ set: true, message: `Your error message for ${field.name}` }}
//           onSelect={(value) => handleEditChange(field.name ,value)}
//         />
//         </div>
       
//         // </div>
//       ) :(
       
//         <Input
//           title={field.name}
//           name={field.name}
//           type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
//           placeholder={`Enter ${field.name}`}
//           initialValue={editFormData[field.name]}
//           onChange={(value)=> handleEditChange(field.name,value)}
//         />
//       )}
           
//           </div>
//           </>
//          ))}       

// {/* //personal expense */}
// <div className=" ">
// <div className="flex flex-row gap-4">
// <div className="w-1/2 flex-row  h-[52px] flex items-center justify-center  mb-5">

// <div className="w-[100px] flex flex-col">
// <div>
// {/* <ActionButton variant='red' text={personalFlag ? "NO"  : "YES" } onClick={handlePersonalFlag}/> */}
// <Toggle label={'Personal Flag'} initialValue={lineItem.isPersonalExpense || false} checked={personalFlag} onClick={handlePersonalFlag}/>
// </div>
// </div>
// </div>

// <div className="w-1/2">
// {!personalFlag &&
// <Input
// title='Personal Amount'
// // error={ errorMsg.personalAmount}
// name='personalAmount'
// type={'text'}
// initialValue={editFormData['personalExpenseAmount']}
// onChange={(value)=>handleEditChange('personalExpenseAmount',value)}
// />}
// </div> 
// </div>
// {/* //personal expense */}
// <div className="h-[48px] w-1/2 justify-center items-center inline-flex gap-4 ">
//    <div className="w-[150px] h-auto">
//    <Select
//          label="Currency"
        
//        placeholder="Select Currency"
//        options={['INR',"USD",'AUD']} //this data will get from currency  api
//       //  onSelect={(value) => handleDropdownChange(value, 'currencyName')}
//       currentOption={lineItem['Currency']}
//        violationMessage="Your violation message" 
//        error={{ set: true, message: "Your error message" }} 
//        onSelect={(value) =>{ handleEditChange('Currency',value),setSelectedCurrency(value)}}
//        />
//         {/* <Select
//        title='Currency'
//        currentOption={'AUD'}
//        placeholder="Select Currency"
//        options={['INR',"USD",'AUD']} 
//        onSelect={(value)=>{setLineItemDetails({...lineItemDetails,['Currency']:value}),setSelectDropdown(value)}}
       
//        violationMessage="Your violation message" 
//        error={{ set: true, message: "Your error message" }} 
//        /> */}

// </div>  
// { selectedCurrency == null || selectedCurrency !== defaultCurrency   &&
// <div className='mt-6'>
// <ActionButton text="Convert" onClick={()=>handleConverter(editFormData)}/>


// {/* {currencyTableData?.currencyFlag ? <h2>Coverted Amount: {currencyTableData?.convertedAmount ??" converted amt not there"}</h2> : <h2 className='text-red-500'>{errorMsg.currencyFlag.msg}</h2>} */}

// </div>}   
// </div>

// {/* {currencyTableData?.currencyFlag &&
// <div className="w-1/2 text-sm ">
//   <div>
//     <h2>Converted Amount Details:</h2>
//     <p>total amount: {currencyTableData?.convertedAmount ?? " - "}</p>
//     {
//       lineItemDetails?.personalFlag  &&
//       (<div>
//         <p>personal amount: {currencyTableData?.convertedPersonalAmount ?? " - "}</p>
//         <p>Non Personal Amount: {currencyTableData?.convertedNonPersonalAmount ?? " - "}</p>
//         </div>
//       )
     
//     }
    

//   </div>

// </div>
//  } */}

// </div>

// <div className="w-full flex items-center justify-center border-[1px] border-gray-50 mt-5">
// <Upload  
//   selectedFile={selectedFile}
//   setSelectedFile={setSelectedFile}
//   fileSelected={fileSelected}
//   setFileSelected={setFileSelected}
//   />
// </div>

// <div className="w-full mt-5 px-4">
//  <Button text="Update" 
//   onClick={handleEditLineItem} />
// </div>     
// {/* -------------------- */}  
//   </div>
   
//    </div>
//    </div>
    
//     </>
//   )
// }




///------------------------------------------------------------
import React ,{useState,useEffect}from 'react'
import { getCategoryFormElementApi, getNonTravelExpenseMiscellaneousDataApi, nonTravelOcrApi, postMultiCurrencyForNonTravelExpenseApi, postNonTravelExpenseLineItems, saveAsDraftNonTravelExpense, submitNonTravelExpenseApi, submitOrSaveAsDraftApi } from '../utils/api'
import { useParams } from 'react-router-dom'
import Error from '../components/common/Error'
import Button from '../components/common/Button'
import PopupMessage from '../components/common/PopupMessage'
import Icon from '../components/common/Icon'
import Dropdown from '../components/common/DropDown'
import Input from '../components/common/Input'
import { cancel, cancel_round, chevron_down, file_icon, validation_sym } from '../assets/icon'
import {nonTravelExpenseData} from '../dummyData/nonTravelExpens'
import { titleCase, urlRedirection } from '../utils/handyFunctions'
import { reimbursementAfterCategory } from '../dummyData/requiredDummy'
import { categories } from '../utils/travelrequest'
import Upload from '../components/common/Upload'
import Select from '../components/common/Select'
import ActionButton from '../components/common/ActionButton'



 
const CreateNonTraveExpense = () => {
  const {tenantId,empId,cancelFlag} =useParams()


  const DASHBOARD_URL=`http://localhost:8080/${tenantId}/${empId}`
  const defaultCurrency= 'INR'
  
  ///get category list 
   const [categoryList , setCategoryList]=useState(null);

   useEffect(()=>{
    const getCategoryList = categories &&  categories.expenseCategories
    console.log('getCategoryList',getCategoryList)
    setCategoryList(getCategoryList)
   },[])


  useEffect(()=>{
    const categoriesData = reimbursementAfterCategory
    const expenseLineAllocation = categoriesData?.reimbursementAllocation
    setExpenseLineAllocation(expenseLineAllocation)
  },[])

 

    const formData = [
              { name:'Bill Date',type:'date'},
              { name:'Bill Number',type:'numeric'},
              { name:'Vendor Name',type:'text'},
              { name: 'Description', type: 'text' },
              { name: 'Quantity', type: 'numeric' },
              { name: 'Unit Cost', type: 'numeric' },
              { name: 'Tax Amount', type: 'numeric' },
              { name: 'Total Amount', type: 'numeric' },        
    ];

    ///now this is dummy after data will set by ocr
    const ocrValue = {
       'Bill Date' :'2023-12-12',
       'Bill Number' : 'sdfsd',
       'Vendor Name': 'Hello Vendor',
       'Description' : 'Hello Description',
       'Quantity' : '23', 
       'Unit Cost' : '23',
       'Tax Amount' : '45',
      'Total Amount': '2500'     
    }

    
    const [miscellaneousData, setMiscellaneousData]=useState(null) //for onboarding dat
    const [expenseLineAllocation ,setExpenseLineAllocation]=useState(null)
    const [categoryElement , setCategoryElement]=useState(formData); //
   
    const [totalAmount, setTotalAmount] = useState(''); ///for handling convert 

    const [currencyTableData, setCurrencyTableData] = useState(null);
    const [lineItemsData,setLineItemsData]=useState([...nonTravelExpenseData.expenseLine]) //for get all line item
    const [headerData,setHeaderData]=useState({
      allocation:"",
      category:"",
      companyName:"company Name",
      defaultCurrency:"INR",
      employee:{
        empId:"empIddfhj",
        name: 'Employee Name'
       },
       expenseLineAllocation:[
        {
        headerName: "cost center",
        headerValues: ["cc1","cc2","cc3"],
      },
        {
        headerName: "profit centre",
        headerValues: ["pc1","pc2","pc3"],
      }
    ]
    }) ///  this data after click on generate btn
    


    
    const [selectedLineItemId, setSelectedLineItemId]=useState(null)
    const [isLoading,setIsLoading]=useState(false)
    const [isUploading,setIsUploading]=useState(false)
    const [loadingErrorMsg, setLoadingErrorMsg]=useState(null)
    const [errorMsg,setErrorMsg]=useState({
      currencyFlag:{set:false,msg:""},
      totalAmount:{set:false,msg:""} //"Total Amount"
    })

    const [openLineItemForm,setOpenLineItemForm]=useState(false)
    const [openModal,setOpenModal]=useState(null);
    const [showPopup ,setShowPopup]=useState(false);
    const [message,setMessage]=useState(null)  ///this is for modal message


   




//for save selected expenseLineAllocation allocation in array
const [selectedAllocations , setSelectedAllocations]=useState([])//for saving expenseLineAllocation on  line item   

const onAllocationSelection = (option, headerName) => {
  // Create a new allocation object
  const newAllocation = { headerName: headerName, headerValue: option  || ""};
  setSelectedAllocations((prevAllocations) => [...prevAllocations, newAllocation]);
};

const [selectedCategory , setSelectedCategory]= useState(null) //this is for dropdown

// const initialFormValues = Object.fromEntries(categoryElement.map((field) => [field.name, '']));
const initialFormValues = Object.fromEntries(
  categoryElement.map((field) => [
    field.name,
     ocrValue?.[field.name] || '',
  ])
);

const [formDataValues, setFormDataValues] = useState(initialFormValues); // for line items form



    // const handleCategoryChange=(value)=>{
    
    // setSelectedCategory(value)
    // console.log('selectedCategory',value)
    // setFormDataValues({...formDataValues,currencyName:value})
    // }
  

   

  
    //for add line item
    const handleModal=()=>{
        setOpenModal((prevState)=>(!prevState))
        setCategoryElement(formData)
    }
   

    // const handleInputChange = (name, value) => {
      
    //    setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: false, msg: "" } }));
    //   //  setErrorMsg((prevErrors) => ({ ...prevErrors, [name]: { set: false, msg: "" } }));
    //     setFormDataValues((prevValues) => ({
    //       ...prevValues,
    //       [name]: value,
    //     }));
    //     if (name === 'Total Amount') {
    //         setTotalAmount(value);
    //       }
    //   };

    const handleInputChange = (name, value) => {
      console.log(`Updating ${name} with value:`, value);
      setFormDataValues((prevState) => ({ ...prevState, [name]: value || "" }));
    };


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
      



    ///category has to sent in object

    const handleGenerateExpense = async () => {
        try {
          setIsLoading(true);
          const { data, error } = await getCategoryFormElementApi(tenantId,empId,selectedCategory);
    
          if (error) {
            setLoadingErrorMsg(error.message);
          } else {
            setCategoryElement(data);
            setLoadingErrorMsg(null)
            console.log(data)
          }
        } catch (error) {
          setLoadingErrorMsg(error.message);
        } finally {
          setIsLoading(false);
        }
      };


const handleConverter =async ( totalAmount , selectedCurrency) => { 
        if(totalAmount==""){
          setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:true,msg:"Enter Total Amount"}}))
        }
       
        if (totalAmount !== undefined && totalAmount !== "") {
            const convertDetails = {
              currencyName: selectedCurrency,
              totalAmount: totalAmount,
            };   

            console.log('handleConvertorClicked',convertDetails)
        ///api 
        try{
          setIsLoading(true)
          const response= await postMultiCurrencyForNonTravelExpenseApi(tenantId, convertDetails)
          if(response.error){
            setLoadingErrorMsg(response.error.message)
            setCurrencyTableData(null)
          }else{
            setLoadingErrorMsg(null)
            setCurrencyTableData(response.data) //here it war response
            if(currencyTableData.currencyFlag){              
              setErrorMsg((prevErrors)=>({...prevErrors,currencyFlag:{set:true,msg:"Currency not available,Please Contact Admin."}}))

            }
          }
        }catch(error){
          setLoadingErrorMsg(error.message)
          setMessage(error.message)
          setShowPopup(true)
          setTimeout(() => {
            setShowPopup(false)
          }, 3000);
          
        } finally{
          setIsLoading(false);
        }}
      };


    //this is for miscellaneous data
    //for get categories , dashboard to non tr expense ms 

    // useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         setIsLoading(true);
    //         const { data, error } = await getNonTravelExpenseMiscellaneousDataApi(tenantId,empId);
    
    //         if (error) {
    //           setLoadingErrorMsg(error.message);
    //         } else {
    //           setMiscellaneousData(data);
    //         }
    //       } catch (error) {
    //         setLoadingErrorMsg(error.message);
    //       } finally {
    //         setIsLoading(false);
    //       }
    //     };
    
    //     fetchData();
    //   }, []);
    //   console.log(miscellaneousData)   


    //i think this no need to do

//     useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const { data, error } = await getCategoryFormElementApi(tenantId, empId);

//         if (error) {
//           setLoadingErrorMsg(error.message);
//         } else {
//           setCategoryElement(data);
//         }
//       } catch (error) {
//         setLoadingErrorMsg(error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [tenantId, empId]);

      const handleEdit=(id)=>{
          setSelectedLineItemId(id)
          console.log("lineItemId",id)
      }


//cancel header 
const handleCancelExpenseHeader =()=>{
  console.log('handle cancel ')
}      


      ///save for lineitem
      ///on first submitting send whole array of line items and allocation multicurrency all stuf of header
      ////save allocation header , category , default currency ,companyName , empName > this data when you generate the category then you will get
      
      const handleSaveLineItem = async () => {
        try {
          setIsLoading(true);
          handleEmptyValues(); // Ensure that any undefined or null values in formDataValues are set to ""
      
          // Check if the user has made any changes to line item details
          const isLineItemModified = Object.keys(formDataValues).some(
            (key) => lineItemsData[selectedLineItemId]?.[key] !== formDataValues[key]
          );
      
          if (!isLineItemModified) {
            // If no changes, add empty values to formDataValues
            for (const key in formDataValues) {
              formDataValues[key] = "";
            }
          }
      
          const updatedFormData = {
            ...formDataValues,
            document: selectedFile || "",
            currencyTableData,
            lineItemAllocation :selectedAllocations,
          };
      
          setFormDataValues(updatedFormData);
          console.log('filledLineItemDetails', updatedFormData);
      
          setLineItemsData([...lineItemsData, updatedFormData]);
      
          const { error } = await postNonTravelExpenseLineItems(tenantId, empId);
      
          if (error) {
            setLoadingErrorMsg(error.message);
            setMessage(error.message);
          } else {
            setShowPopup(true);
            setMessage("Line Item has been added successfully.");
            setTimeout(() => {
              setShowPopup(false);
              location.reload();
            }, 5000);
          }
        } catch (error) {
          setLoadingErrorMsg(error.message);
          setShowPopup(true);
          setMessage(error.message);
          setTimeout(() => {
            setShowPopup(false);
          }, 3000);
        } finally {
          setIsLoading(false);
        }
      
        // Clear the selected file and reset the form data
        setSelectedFile(null);
        setFileSelected(false);
        setFormDataValues({});
      };
      
     
///on handle save as draft data has to send

      const handleSubmitOrDraft = async(action)=>{
        if (action=="submit"){
          try{
            setIsLoading(true)
            const response= await submitNonTravelExpenseApi(tenantId,empId,"data has to send")
            if(response.error){
              setLoadingErrorMsg(response.error.message)
              setCurrencyTableData(null)
            }else{
              setLoadingErrorMsg(null)
              setShowPopup(true)
              setMessage("Non Travel Expense has been Submitted")
              setTimeout(() => {
                setShowPopup(false)
              }, 5000);
              urlRedirection(DASHBOARD_URL)

              
            }
          }catch(error){
            setLoadingErrorMsg(error.message)
            setMessage(error.message)
            setShowPopup(true)
            setTimeout(() => {
              setShowPopup(false)
            }, 3000);
            
          } finally{
            setIsLoading(false);
          }

        }
        if(action=="save as draft"){
          try{
            setIsLoading(true)
            const {error} = await saveAsDraftNonTravelExpense(tenantId,empId,)
            if (error) {
              setLoadingErrorMsg(error.message);
              setShowPopup(true)
              setMessage("Ohh!",error.message)
            }
            setShowPopup(true)
            setMessage("Non Travel Expense has been submitted.")
            setTimeout(()=>{
              setShowPopup(false)
              location.reload()
            },5000)
            urlRedirection(DASHBOARD_URL)
      
          }catch(error){
            setLoadingErrorMsg(error.message)
          setMessage(error.message)
          setShowPopup(true)
          setTimeout(() => {
            setShowPopup(false)
          }, 3000);
          }finally{
            setIsLoading(false)
          }

        }
      }

      const handleOpenModal=(id)=>{
        if(id==='upload'){
          setOpenModal('upload')
        }
        if(id==='form'){
          setOpenModal('form')
        }
       }


      const [ocrFileSelected , setOcrFileSelected]=useState(false)
      const [ocrSelectedFile , setOcrSelectedFile]=useState(null)
      const [ocrField , setOcrField]=useState(null)
      
      const handleOcrScan = async () => {
        // console.log('ocrfile from handle', ocrSelectedFile);
      
        const formData = new FormData();
          formData.append('file', ocrSelectedFile);
      
        console.log('ocrfile from handle',formData)
      
        try {

          setIsUploading(true);
          
          // Assuming ocrScanApi is an asynchronous function
          const response = await nonTravelOcrApi(formData);
      
          if (response.error) {
            loadingErrorMsg(response.error.message);
            setCurrencyTableData(null);
          } else {
            loadingErrorMsg(null);
            setOcrField(response.data);
      
            if (!currencyTableData.currencyFlag) {
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                currencyFlag: { set: true, msg: 'OCR failed, Please try again' },
              }));
              console.log('Currency is not found in onboarding');
            }
          }
        } catch (error) {
          loadingErrorMsg(error.message);
          setMessage(error.message);
          setShowPopup(true);
      
          setTimeout(() => {
            setShowPopup(false);
          }, 3000);
        } finally {
          setIsUploading(false);
        }
      };

  return (
    <div>
        {isLoading && <Error message={loadingErrorMsg}/>}
        {/* {loadingErrorMsg && <h2>{loadingErrorMsg}</h2>} */}
        {!isLoading  && 
        <div className="w-full h-full relative bg-white-100 md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
        {/* app icon */}
        <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
            <Icon/>
        </div>

        {/* Rest of the section */}
        <div className="w-full h-full mt-10 p-10 font-cabin tracking-tight">
        <p className='inline-flex'> 
        <img src={validation_sym} width={16} height={16} alt='validation'/> 
        <span className='text-red-500'> if category is not there contact admin.</span>
        </p>           
        <div className="flex flex-row justify-between">
        <div className='my-5  inline-flex gap-4'>

        <div className="h-[48px] w-[200px]">
       
      <Select
            title="Category"
           
          placeholder="Select Category"
          options={categoryList && categoryList || []}
        //   onSelect={handleDropdownChange}
          currentOption={categoryList && categoryList[0]}
          // violationMessage="Your violation message" 
        //   error={{ set: true, message: "Your error message" }} 
          required={true} 
          submitAttempted={false}
          icon={chevron_down}
          onChange={(value)=>setSelectedCategory(value)}
          />
         

          </div>

          <div className='mt-7'>
            <Button text="Generate" onClick={()=>handleGenerateExpense()}/>
        </div>
</div>

{lineItemsData.length!=0 &&
  <div className="flex gap-4">
                    {cancelFlag ?
                    (<div className="flex mt-10 flex-row-reverse">
                    <Button variant='fit' text='Cancel' onClick={()=>handleCancelExpenseHeader}/>
                   </div>):
                    (<>
                    <div className="flex mt-10 flex-row-reverse">
                    <Button text='Save as Draft' onClick={()=>handleSubmitOrDraft("save as draft")}/>
                   </div>
                    <div className="flex mt-10 flex-row-reverse">
                    <Button variant='fit' text='Submit' onClick={()=>handleSubmitOrDraft("submit")}/>
                   </div>
                   </>)}                                 
</div>
} 

            </div>
           
        
            <hr/>
            <HeaderComponent/>
           
     <hr/>
     <div>
     <div className="w-fit my-5" onClick={()=>handleOpenModal('form')}>
           <Button text={"Add Line Item"}/>
     </div>
     </div>
{/* //----------- edit line item--start---------------------- */}

{lineItemsData && lineItemsData.map((lineItem , index)=>(
   lineItem.expenseLineId === selectedLineItemId ?
   
 <>

  <EditFormComponent
   expenseLineAllocation={expenseLineAllocation}
   categoryElement={categoryElement}
   key={index}
   lineItem={lineItem}
   handleSave={(updatedData) => handleSaveLineItem(updatedData, index)}
   defaultCurrency={defaultCurrency}
   handleConverter={handleConverter}/>

 </>
   
   
   :
<>
<div className='flex flex-col lg:flex-row border '>
  <div className='w-full lg:w-1/2 border'>
    <DocumentPreview initialFile={lineItem.Document}/>

  </div>
  <div className='w-full lg:w-1/2 border' key={index}>  
     <div >
     <EditComponent lineItem={lineItem} handleEdit={handleEdit}/>
     </div> 
  </div>
  </div> 
</>  
   ))}
 



{/* //----------- edit line item--end---------------------- */}


               
     
         
        
{/* //---------save line item form----------------------- */}

{openLineItemForm &&
<div className='flex flex-col lg:flex-row border '>
  <div className='w-full lg:w-1/2 border  flex justify-center items-center px-4 py-4'>
  
  <div className=' border-[5px] min-w-[100%] h-fit flex justify-center items-center'>
    {selectedFile ? 
    (
        <div className="w-full  flex flex-col justify-center">
          <p>Selected File: {selectedFile.name}</p>
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
      
      <div className='w-full h-[700px] flex justify-center items-center bg-white-100 opacity-30'>
        <img src={file_icon} className='w-40 h-40'/>
      </div>}
    </div>
      
  </div>
  <div className='w-full lg:w-1/2 border'>
  {openLineItemForm &&
  <> 
          
<div  className="w-full border flex flex-wrap items-start justify-between py-4 px-2">
  {expenseLineAllocation.length>0 && expenseLineAllocation.map((allItem , allIndex )=>(
    <div className='w-full px-2 flex justify-center py-2' key={allIndex}>
    <Select
    currentOption=""
    title={titleCase(allItem.headerName ?? "")}
    options={allItem.headerValues}
    placeholder='Select Allocations'
    onSelect={(value)=>onAllocationSelection(value,allItem.headerName)}/>  
    </div> 
  ))}

{categoryElement && categoryElement.map((element, index) => {
    return (
<React.Fragment key={index}>
 <div className='h-[73px] mt-2'>        
    <Input 
            placeholder={titleCase(`Enter ${element.name}`)}
            initialValue={formDataValues[element.name]}
            // initialValue={ocrValue[element.name]}
            title={element.name}
            error={element.name === "Total Amount" ? errorMsg.totalAmount : null}
            // name={element.name}
            type={element.type === 'date' ? 'date' : element.type === 'amount' ? 'number' : 'text'}
            // value={formDataValues[element.name] || ""}
            onChange={(value) => handleInputChange( element.name , value)}
    />
</div>   
</React.Fragment>
    );
  })}
</div>  

<div className='flex flex-col px-2 justify-between'>
<div className='flex flex-row items-center'>
<div className="h-[48px] w-[100px]  mb-10 mr-28 mt-[-10px] ">
           <Select
           title="Currency"
           name="currency"
           placeholder="Select Currency"
           options={['INR',"USD",'AUD']}
           onSelect={(value)=>(setFormDataValues({...formDataValues,['Currency']:value}))}
           />
</div>


<div className='w-fit'>
{ selectedCategory == null || selectedCategory !== defaultCurrency &&


<ActionButton text='Convert' onClick={handleConverter(totalAmount , selectedCategory)}/>

}
</div>

</div>
<div>
{currencyTableData?.currencyFlag ? 
<h2>Coverted Amount: {currencyTableData?.convertedAmount} ?? hello</h2> 
  : 
<h2 className='text-red-500'>{errorMsg.currencyFlag.msg}</h2>
}
</div>



<div className="w-full   flex items-center justify-center border-[1px] border-gray-50 ">
<Upload 
  selectedFile={selectedFile}
  setSelectedFile={setSelectedFile}
  fileSelected={fileSelected}
  setFileSelected={setFileSelected}
  />
</div>

</div>

  



 
                  
<div className="w-full px-2 py-4" >
  <Button text="Save" onClick={handleSaveLineItem} />
</div>
               
               
               


</>   
}



</div>
</div>}


{/* //---------save line item form end----------------------- */}
           {openModal==='form' && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none" >
                <div className='z-10 max-w-4/5 w-2/5 min-h-4/5 max-h-4/5 scroll-none bg-white-100  rounded-lg shadow-md'>
                <div onClick={()=>{setOpenModal(null);}} className=' w-10 h-10 flex mr-5 mt-5 justify-center items-center float-right   hover:bg-red-300 rounded-full'>
                      <img src={cancel} className='w-8 h-8'/>
                  </div>
                    <div className="p-10">
                        <p className="text-xl  text-center font-cabin">Seletct option for Enter Expense Line</p>
                        {/* <Select 
                            options={rejectionReasonOptions}
                            onSelect={onReasonSelection}
                            placeholder='Please select reason for rejection'
                        /> */}
                        <div className="flex mt-10 justify-between">
                            <Button variant='fit' text='Scan' onClick={()=>handleOpenModal('upload')}  />
                            {/* setOpenLineItemForm(true) */}
                            <Button variant='fit' text='Manually' onClick={()=>{setOpenLineItemForm(true);handleModal()}} />
                        </div>
                    </div>
                </div>
                </div>
            }

{openModal==='upload' && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none" >
                <div className='z-10 max-w-5/5 w-2/5 min-h-4/5 max-h-4/5 scroll-none bg-white-100  rounded-lg shadow-md'>
                  <div onClick={()=>{setOpenModal(null);setOcrSelectedFile(null);setOcrFileSelected(false)}} className=' w-10 h-10 flex mr-5 mt-5 justify-center items-center float-right   hover:bg-red-300 rounded-full'>
                      <img src={cancel} className='w-8 h-8'/>
                  </div>
                    <div className="p-10 ">
                     
                      <div className="flex flex-col justify-center items-center">
                       

                       
                        {ocrFileSelected ? 
                        
                        <div className="w-full  flex flex-col justify-center items-center h-[500px]  overflow-x-auto">
                        <p>Document Name: {ocrSelectedFile.name}</p>
                        <Button  text='reupload' onClick={()=>{setOcrFileSelected(false);setOcrSelectedFile(null)}}/>
                        {/* <p>Size: {selectedFile.size} bytes</p>
                        <p>Last Modified: {selectedFile.lastModifiedDate.toString()}</p> */}
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
            }
           
        </div>
        
       
        </div>
      }
      <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>
        
      
    </div>
  )
}

export default CreateNonTraveExpense


function EditComponent({ lineItem, handleEdit }) {
  return (
    <>
      <div className="w-full border flex flex-wrap items-start justify-between py-4 px-4">
        {Object.entries(lineItem).map(([key, value]) => (
          key !== 'expenseLineId' && key !== 'Document' && key !== 'lineItemAllocation' &&(
            <React.Fragment key={key}>
              <div className='min-w-[200px]'>
                <div className="text-zinc-600 text-sm font-cabin">{titleCase(key)}</div>

                {/* Div with border styling */}
                <div className="w-full h-full bg-white items-center flex border border-neutral-300 rounded-md">
                  {/* Displaying key and value */}
                  <div key={key}>
                    <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin px-6 py-2">
                      {/* Display key and value */}
                      {` ${value}`}
                    </div>
                  </div>
                </div>
                <div className="w-full text-xs text-yellow-600 font-cabin">{['policyViolation']}</div>
              </div>
            </React.Fragment>
          )
        ))}

        {/* Mapping lineItemAllocation */}
        {lineItem.lineItemAllocation && lineItem.lineItemAllocation.map((allocation, index) => (
          <div key={index} className="min-w-[200px]">
            <div className="text-zinc-600 text-sm font-cabin">{titleCase(allocation.headerName)}</div>
            <div className="w-full h-full bg-white items-center flex border border-neutral-300 rounded-md">
              <div>
                <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin px-6 py-2">
                  {allocation.headerValue}
                </div>
              </div>
            </div>
            <div className="w-full text-xs text-yellow-600 font-cabin">{['policyViolation']}</div>
          </div>
        ))}
      </div>

      <div className="w-full px-2 py-4">
        <Button text="Edit" onClick={() => handleEdit(lineItem.expenseLineId)} />
      </div>
    </>
  );
}









function  EditFormComponent ({ lineItem, categoryElement, handleSave,expenseLineAllocation,handleConverter ,defaultCurrency}) {
  const [selectedFile  , setSelectedFile]=useState(null)
  const [fileSelected ,setFileSelected]= useState(false)
  const [selectedAllocations , setSelectedAllocations]=useState([])
  const [selectedCurrency, setSelectedCurrency]=useState(null)
  const [initialFile , setInitialFile]=useState(null)
  
const [formData, setFormData] = useState(lineItem);
 console.log('object',categoryElement)
 
  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };
  
  const onAllocationSelection = (option, headerName) => {
    // Create a new allocation object
    const newAllocation = { headerName: headerName, headerValue: option || "" };
    setSelectedAllocations((prevAllocations) => [...prevAllocations, newAllocation]);
  };
  

  useEffect(()=>{
    if (fileSelected) {
      setFormData({
        ...formData,
        ['Document']: selectedFile,
      });
    }
  },[(fileSelected)])

  useEffect(()=>{
    setFormData(({
      ...formData,
      lineItemAllocation: [...selectedAllocations],
    }));

  },[selectedAllocations])



  const handleSaveClick = () => {
    // Check if there are selectedAllocations

    console.log('Selected Allocations before update:');

    // If there are selectedAllocations, update lineItemAllocation in formData
   
      

    // If a file is selected, update the Document field in formData
    
  
    // Call your save function with the updated data
    console.log('Selected Allocations:', selectedAllocations);
    console.log('Updated FormData:', formData);
    // handleSave(formData);
  };
  
  useEffect(() => {
    // Set the initial file when the component is mounted
    setInitialFile(lineItem.Document);
  }, []);

  return (
   <>
 <div className='flex flex-col lg:flex-row border '>
  <div className='w-full lg:w-1/2 border  flex justify-center items-center px-4 py-4'>
   <DocumentPreview selectedFile={selectedFile} initialFile={initialFile}/>
  </div>
  <div className='w-full lg:w-1/2 border'>     

<div  className="w-full border flex flex-wrap items-start justify-between py-4 px-2">

  {expenseLineAllocation.length>0 && expenseLineAllocation.map((allItem , allIndex )=>(
    
    <div className='w-full px-2 flex justify-center py-2' key={allIndex}>
        <>
         <Select
         currentOption={''}
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
            // onChange={(e) => handleChange(field.name, e.target.value)}
            className='mt-1 p-2 w-full border rounded-md'
          />  

        </div>  
      ))}
  <div className='flex flex-col  justify-between w-full'>
<div className='flex flex-row items-center'>
<div className="h-[48px] w-[100px]  mb-10 mr-28 mt-[-10px] ">
           <Select
           currentOption={lineItem['Currency']}
           title="Currency"
           name="currency"
           placeholder="Select Currency"
           options={['INR',"USD",'AUD']}
           onSelect={(value) =>{ handleChange( 'Currency' , value),setSelectedCurrency(value)}}
         
           />
</div>


<div className='w-fit'>
{selectedCurrency == null ||selectedCurrency !== defaultCurrency &&


<ActionButton text='Convert' onClick={()=>handleConverter("5000",selectedCurrency)}/>

}
</div>

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


      <div className="w-full px-2 py-4" >
       <Button text="Update" onClick={handleSaveClick} />
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
          <p>Selected File: {selectedFile.name}</p>
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

function HeaderComponent(){
  return(
    <div className='my-5'>

          <div> 
                <div className="flex gap-2 font-cabin text-xs tracking-tight ">
                    <p className="w-[150px] text-neutral-600">Expense Header Number:</p>
                    <p className="text-neutral-700">Traveh8796876</p>
                </div>
                <div className="flex gap-2 font-cabin text-xs tracking-tight ">
                    <p className="w-[150px] text-neutral-600">Default Currency:</p>
                    <p className="text-neutral-700">INR</p>
                </div>
                <div className="flex gap-2 font-cabin text-xs tracking-tight ">
                    <p className="w-[150px] text-neutral-600">Category :</p>
                    <p className="text-neutral-700">Utilities</p>
                </div> 
                <div className="flex gap-2 font-cabin text-xs tracking-tight ">
                    <p className="w-[150px] text-neutral-600">Allocation Header and value to select :</p>
                    <p className="text-neutral-700">dropdown and values</p>
                </div> 
          </div>           
           </div>
  )
}