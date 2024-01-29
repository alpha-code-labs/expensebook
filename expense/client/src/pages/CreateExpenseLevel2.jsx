/* eslint-disable react/jsx-key */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */

import React,{ useState, useEffect} from "react";
import {BrowserRouter as Router, useParams} from 'react-router-dom'
import Icon from "../components/common/Icon";
import { titleCase, urlRedirection } from "../utils/handyFunctions";
import Button from "../components/common/Button";
import Error from "../components/common/Error";
import PopupMessage from "../components/common/PopupMessage";
import { cab_purple as cab_icon, airplane_1 as airplane_icon ,house_simple , chevron_down,  cancel, modify} from "../assets/icon";
import tripDummyData from "../dummyData/tripDummyData";
import { bookAnExpenseDataLevel2, hrDummyData } from "../dummyData/requiredDummy";
import Select from "../components/common/Select";
import ActionButton from "../components/common/ActionButton";
import Input from "../components/common/Input";
import Upload from "../components/common/Upload";
import { cancelTravelExpenseLineItemApi, postMultiCurrencyForTravelExpenseApi, submitOrSaveAsDraftApi } from "../utils/api.js";
import { bookAnExpenseData } from "../dummyData/requiredDummy";
import Dropdown from "../components/common/DropDown.jsx";
import Search from "../components/common/Search.jsx";


const approvalOptions=["Aarav Singh", "Arnav Patel"]

export default function () {
 
  
  const [activeIndex, setActiveIndex] = useState(0);

  const handleItemClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  


  const [onboardingData, setOnboardingData] = useState(null);
  const [travelAllocationFlag, setTravelAllocationFlag] = useState(null);
  const [travelExpenseAllocation,setTravelExpenseAllocation]=useState(null);
  const [categoryfields , setCategoryFields]=useState(null) ///this is for get field after select the category
  const [lineItemDetails , setLineItemDetails]=useState({})//line item save

  const [selectedAllocations , setSelectedAllocations]=useState([])//for saving allocations on line saving line item
  const [settlementOptions, setSettlementOptions]=useState([])

  const [currencyTableData, setCurrencyTableData] = useState(null) //for get data after conversion

  const [selectedTravelType, setSelectedTravelType] = useState(null);

 
  

  useEffect(() => {
    const onboardingData = bookAnExpenseDataLevel2;
    const travelAllocationFlags = onboardingData?.companyDetails?.travelAllocationFlags;
    

    const expenseCategoryAndFields = onboardingData?.companyDetails?.travelExpenseCategories
    // const expenseCategoryAndFields = onboardingData?.companyDetails?.travelExpenseCategories
    const onboardingLevel = Object.keys(travelAllocationFlags).find((level) => travelAllocationFlags[level] === true);
    
    const settlementOptionArray =onboardingData?.companyDetails?.expenseSettlementOptions
    const settlementOptions = Object.keys(settlementOptionArray).filter((option) => settlementOptionArray[option]);
    setSettlementOptions(settlementOptions)
    
    setTravelAllocationFlag(onboardingLevel);
    setOnboardingData(onboardingData);
    setCategoryFields(expenseCategoryAndFields) //this is for get form fields
    //for get level

      
    
    
      const expenseAllocation= onboardingData?.companyDetails?.travelAllocations[selectedTravelType]?.expenseAllocation
      setTravelExpenseAllocation(expenseAllocation)  

  }, [selectedTravelType]);
//   bookAnExpenseData
const handleTravelTypeSelect = (type) => {

    setSelectedTravelType(type);

  };
   

  const defaultCurrency =  onboardingData?.companyDetails?.defaultCurrency ?? 'N/A'

  // console.log(travelAllocationFlag)
  console.log('expense allocation',travelExpenseAllocation)
  // console.log('onboardingData',onboardingData)
  console.log('categoryViseFields',categoryfields)

  //categories array for search the category to get fields
  const categoryNames = categoryfields &&  categoryfields.map((category)=>(category[selectedTravelType]))
  console.log('ffff',categoryNames)
//   if (categoryNames) {
//     const categoriesForType = categoryNames[selectedTravelType].map((category) => category.categoryName);
//    console.log('objectcatt',categoriesForType)
//   }
//   const categoryNames = categoryfields &&  categoryfields.map((category)=>(category.categoryName))


  const [selectedCategory,setSelectedCategory]=useState(null)

  const handleCategorySelection = (selectedCategory) => {
    setSelectedCategory(selectedCategory);
  
    
  
    // Update lineItemDetails with empty strings for all fields of the selected category
    const emptyFields = categoryfields
      .find((category) => category.categoryName === selectedCategory)
      .fields.reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
      }, {});
  
    setLineItemDetails(emptyFields);
  };
  
 



  //get travel request Id from params
   
    const {cancelFlag , tenantId,empId,tripId} = useParams() ///these has to send to backend get api
    const DASHBOARD_URL=`http://localhost:3000/${tenantId}/${empId}`
    const [showPopup, setShowPopup] = useState(false)
    const [message, setMessage] = useState(null)
    
    const [travelRequestStatus, setTravelRequestStatus] = useState('pending approval')
    
    const [totalAmount, setTotalAmount] = useState(''); ///for line items
    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const [expenseLineForm, setExpenseLineForm]= useState({
      totalAmount:"",
      personalFlag:"",
    })

    const [selectedFile ,setSelectedFile]=useState(null)
    const [fileSelected,setFileSelected]=useState(null)
 

    const [personalFlag,setPersonalFlag]=useState(false)
    const [errorMsg,setErrorMsg]=useState({
        currencyFlag:{set:false,msg:""},//if currency is not in backend database for conversion
        totalAmount:{set:false,msg:""}, //"Total Amount"
        personalAmount:{set:false,msg:""}

      })



    const [showCancelModal, setShowCancelModal] = useState(false)
    const [ rejectionReason,setRejectionReason] =useState(null)
  
const handlePersonalFlag=()=>{
  setPersonalFlag((prev)=>(!prev))
  if(!personalFlag){
    setLineItemDetails({...lineItemDetails,personalAmount:"" ,isPersonalExpense:false})
  }
}





const onAllocationSelection = (option, headerName) => {
  // Create a new allocation object
  const newAllocation = { headerName: headerName, headerValue: option };
  // Update the allocations array
  setSelectedAllocations((prevAllocations) => [...prevAllocations, newAllocation]);
};

    const onReasonSelection = (option) => {
        setRejectionReason(option)
        console.log(option)
    }


   

    const [selectDropdown , setSelectDropdown]= useState(null)
    const handleDropdownChange=(value ,dropdownType)=>{
    if (dropdownType === 'categoryName') {
      setExpenseLineForm({ ...expenseLineForm, categoryName: value
       });
    }
    else if (dropdownType === 'currencyName') {
      setLineItemDetails((prevState)=>({ ...prevState, currencyName: value }));
      setSelectDropdown(value)
    } 
  }


  const handleInputChange=(e)=>{
    const {name , value} = e.target
    setLineItemDetails((prevState)=>({...prevState,[name]:value}))

  }


  const handleConverter = async () => { 
    const { currencyName, personalAmount,} = lineItemDetails;
    const totalAmount = lineItemDetails['Total Amount']; // Access 'Total Amount' using square brackets
  
    let allowForm = true;
  
    if (totalAmount === "") {
      setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: true, msg: "Enter total amount" } }));
      allowForm = false;
    } else {
      setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: false, msg: "" } }));
    }
  
    if (personalFlag && personalAmount === "") {
      setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: true, msg: "Enter personal amount" } }));
      allowForm = false;
    } else {
      setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: false, msg: "" } }));
    }
  
    if (allowForm) {
      const nonPersonalAmount = totalAmount - personalAmount;
  
      // Create an object with the dynamic field name and value
  
      const convertDetails = {
        currencyName: currencyName,
        personalExpense: personalAmount,
        nonPersonalExpense: nonPersonalAmount,
        totalAmount: totalAmount,
       
      };
  console.log(convertDetails)
      
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


    const [formData, setFormData] = useState(); //this is for get expense data
    const [getExpenseData, setGetExpenseData]=useState(); //to get data header level 
    const [travelCategoryAllocation,setTravelCategoryAllocation]=useState(null)
    const [getSavedAllocations,setGetSavedAllocations]=useState()  ///after save the allocation then i will get next time from here 
    const [openModal,setOpenModal]=useState(false);
    const [openLineItemForm,setOpenLineItemForm]=useState(true)
    const [headerReport,setHeaderReport]=useState(null)


    const [editLineItemById, setEditLineItemById]=useState(null)

   console.log('object',editLineItemById)
  
    


    useEffect(() => {

        const tripData = tripDummyData
        const hrData= hrDummyData
        const expenseData= tripDummyData.travelExpenseData //get line items
        console.log('expenseData',expenseData)
        const travelCategoriesExpenseAllocation = tripDummyData?.companyDetails?.travelCategoriesExpenseAllocation
        ///where is newExpenseReport = true
        const headerReportData = expenseData.find((expense) => expense.newExpenseReport);
        setHeaderReport(headerReportData)
        setFormData({...tripData})
        setGetSavedAllocations({...hrData});
        setGetExpenseData([...expenseData]);
        setTravelRequestStatus(tripData)
        setTravelCategoryAllocation([...travelCategoriesExpenseAllocation])
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



    

     const handleOpenModal=()=>{
       setOpenModal(true)
     }

     const handleCancelExpenseHeader=()=>{
        console.log("cancel header")
     }
    // console.log("getExpenseData",getExpenseData)
///----------------------------------------  
// line item categories if has




const handleSubmitOrDraft=async(action)=>{
    const expenseHeaderId="expenshhID"
    console.log('submit')
    
    setIsLoading(true)

    try{
        await submitOrSaveAsDraftApi(action,tenantId,empId,tripId,expenseHeaderId,headerReport)
        setIsLoading(false)
        setShowPopup(true)
        setMessage("Line Item Has Been Successfully Added")
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
      setLineItemDetails((prevState)=>({...prevState ,expenseLines}));
      
      
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

    const handleModifyLineItem=()=>{
      const expenseLines = { ...lineItemDetails, category: selectedCategory ,isPersonalExpense:personalFlag , document : fileSelected ? selectedFile : ""};  
      // Set the updated line item details
      setLineItemDetails((prevState)=>({...prevState ,expenseLines}));
      
      
      //for companyDetails
      // const companyDetails = onboardingData?.companyDetails
      // Log the updated details
      // const dataWithCompanyDetails={
      //   companyDetails:companyDetails,
      //   expenseLines:[{...expenseLines}],
      //   allocations: selectedAllocations
      // }
      console.log('save line item', expenseLines)

    }

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
        <div  className="flex md:flex-row flex-col my-5 justify-evenly items-center flex-wrap">
            <Select 
            placeholder='Travel Type'
            title='Select Travel Type'
            options={['international','domestic','local']}
            onSelect={handleTravelTypeSelect}

            
            />            
             
         {travelExpenseAllocation && travelExpenseAllocation.map((expItem , index)=>(
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
          

        </div>
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

            <div className="h-[48px]">
            <Select 
              options={approvalOptions}
              onSelect={onReasonSelection}
              placeholder='Select Approver'
              title="Select Approver"
            />
          </div>

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
            <hr/>

            <div className="form mt-5">

            <div className="w-fit">
            <Button onClick={()=>setOpenModal(true)} text={"Add Line Item"}/>
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
            <div>{`Header Report Number : ${item?.expenseReportNumber ?? 'N/a'}`}</div>
            <div>{activeIndex === index ? '▲' : '▼'}</div>
          </div>
          {activeIndex === index && (
            <div className="bg-white p-4">
{/* ///already booked travel details */}
<div className="mt-5 flex flex-col gap-4">
{['flights', 'trains', 'buses', 'cabs', 'hotels'].map((itnItem, itnItemIndex) => {
  if (item?.alreadyBookedExpense && item.alreadyBookedExpense[itnItem]?.length > 0) {
    return (
      <div key={itnItemIndex}>
        <details>
          <summary>
            <p className="inline-flex text-xl text-neutral-700">
              {`${titleCase(itnItem)} `}
            </p>
          </summary>
          <div className='flex flex-col gap-1'>
            {item.alreadyBookedExpense[itnItem].map((item, itemIndex) => {
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
                      // onClick={()=>handleCancel(itnItem.slice(0, -1), itemIndex, item.formId)}
                      itnId={item.itineraryId}
                      // handleLineItemAction={handleLineItemAction}
                      // showActionButtons={travelRequestStatus !== 'pending approval' && item.status == 'pending approval'} 
                      from={item.pickupAddress} to={item.dropAddress} date={item.date} time={item.time} travelClass={item.travelClass} isTransfer={item.type !== 'regular'} />
                  </div>
                );
              } else if (itnItem === 'hotels') {
                return (
                  <div key={itemIndex}>
                    <HotelCard 
                      // onClick={()=>handleCancel(itnItem.slice(0, -1), itemIndex, item.formId)}
                      itnId={item.itineraryId}
                      // handleLineItemAction={handleLineItemAction}
                      // showActionButtons={travelRequestStatus !== 'pending approval' && item.status == 'pending approval'} 
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
<div className=" w-full flex flex-col  lg:flex-row  ">

<div className="border w-full lg:w-1/2">
  bill view
</div>


<div className="border w-full lg:w-1/2">


{/* get lineitem data from backend start*/}

<div className="w-full flex-wrap flex flex-col justify-center items-center p-2">


{item.expenseLines.map((lineItem, index) => (

    lineItem._id === editLineItemById ? 
    (<>
    <div className=" w-full flex-wrap flex flex-col justify-center items-center p-2">
    <div className="w-1/2">
      <Search 
      defaultValue={lineItem.category}
      title="Category" 
      placeholder='Select Category' 
      options={categoryNames}
      onSelect={(category)=>handleCategorySelection(category)}/>
     </div>   
   <div className="w-full flex-row  border">
   <div className="w-full border flex flex-wrap items-center justify-center">

     


    {selectedCategory &&
        categoryfields.find((category) => category.categoryName === selectedCategory).fields.map((field) => (
          <>
            <div key={field.name} className="w-1/2 flex justify-center items-center">
              <Input
                title={field.name}
                name={field.name}
                type={field.type == 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
                placeholder={`Enter ${field.name}`}
                value={lineItem[field.name] !== undefined ? lineItem[field.name] : lineItem[field.name] || ""}
                onChange={handleInputChange}
              />
            </div>
          </>
        ))}

{/* //personal expense */}
<div className=" ">
<div className="flex flex-row gap-4">
<div className="w-1/2 flex-row  h-[52px] flex items-center justify-center  mb-5">

<div className="w-[100px] flex flex-col">
<h2 className="text-zinc-600 text-sm font-cabin">Is Persona Expense?</h2>
<div>
<ActionButton variant='red' text={personalFlag ? "NO"  : "YES" } onClick={handlePersonalFlag}/>
</div>
</div>
</div>

<div className="w-1/2">
{personalFlag &&
<Input
title='Personal Amount'
error={ errorMsg.personalAmount}
name='personalAmount'
type={'text'}
value={lineItemDetails.personalAmount || lineItem.personalAmount}
onChange={handleInputChange}
/>}

</div> 
</div>
{/* //personal expense */}
<div className="h-[48px] w-1/2 justify-center items-center inline-flex gap-4 ">
   <div className="w-[150px] h-auto">
   <Dropdown
         label="Currency"
         name="currency"
         id='currency'
         htmlFor='currency'
       placeholder="Select Currency"
       options={['INR',"USD",'AUD']} //this data will get from currency  api
      //  onSelect={(value) => handleDropdownChange(value, 'currencyName')}
       defaultOption={lineItem.currencyName}
       violationMessage="Your violation message" 
       error={{ set: true, message: "Your error message" }} 
       required={true} 
       submitAttempted={false}
       icon={chevron_down}
       onChange={(value) => handleDropdownChange(value, 'currencyName')}
       />

</div>  
{ selectDropdown == null || selectDropdown !== defaultCurrency   &&
<div className='mt-6'>
<ActionButton text="Convert" onClick={handleConverter}/>

{/* {currencyTableData?.currencyFlag ? <h2>Coverted Amount: {currencyTableData?.convertedAmount ??" converted amt not there"}</h2> : <h2 className='text-red-500'>{errorMsg.currencyFlag.msg}</h2>} */}

</div>}   
</div>

{currencyTableData?.currencyFlag &&
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
 }

</div>


<div>

  
</div>

<div className="w-full flex items-center justify-center border-[1px] border-gray-50 mt-5">
<Upload  
  selectedFile={selectedFile}
  setSelectedFile={setSelectedFile}
  fileSelected={fileSelected}
  setFileSelected={setFileSelected}
  />
</div>

<div className="w-full mt-5 px-4" >
 <Button text="Save" 
  onClick={handleModifyLineItem} />
</div>     

{/* -------------------- */}


     </div>
     </div>
   </div>
    
    </>)  :
    <div className="w-full flex-row  border mt-2">
        <h2>LineItem {index+1}</h2>
     <div className="w-full flex items-center justify-start h-[52px] border px-4 ">
      <p className="text-zinc-600 text-medium font-semibold font-cabin">Category -{titleCase(lineItem.category)}</p>
    </div>   
    <div key={index} className="w-full  border flex flex-wrap items-center px-4 justify-between  py-4">
        {Object.entries(lineItem).map(([key, value]) => (
            key !== '_id' && (
              <>
        <div className="min-w-[200px] w-full md:w-fit   flex-col justify-start items-start gap-2 ">
                    
        <div className="text-zinc-600 text-sm font-cabin">{titleCase(key)}</div>
        
        {/* Div with border styling */}
        <div className=" w-full h-full bg-white items-center flex border border-neutral-300 rounded-md">
          {/* Displaying key and value */}
      
              <div key={key}>
                <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin px-6 py-2">
                  {/* Display key and value */}
                  {` ${value}`}
                </div>
              </div>
           
        </div>
        </div>
        </>
         )
         ))}
     
     <div className="w-full mt-5 m-4 flex justify-end gap-4" >
      <Button text="Edit" onClick={()=>(setEditLineItemById(lineItem._id))} />
      <Button text="Delete" onClick={()=>(handleDeleteLineItem(lineItem._id))} />
     </div>
    </div>
    
    </div>
    
  ))}
</div>

{/* get lineItem data from backend end*/}


</div>

</div>

 </div>
          )}
        </div>))}
      
 </div>

{/*start new //lineItemform */}
   
    <div className=" w-full flex flex-col  lg:flex-row  ">

<div className="border w-full lg:w-1/2">
  bill view
</div>
<div className="border w-full lg:w-1/2">
  input fields
  
    <>
    
    <div className=" w-full flex-wrap flex flex-col justify-center items-center p-2">
    <div className="w-1/2">
      <Search 
      title="Category" 
      placeholder='Select Category' 
      options={categoryNames}
      onSelect={(category)=>handleCategorySelection(category)}/>
     </div>   
 <div className="w-full flex-row  border">
  <div className="w-full border flex flex-wrap items-center justify-center  py-4">
     {selectedCategory &&
         categoryfields.find((category)=>category.categoryName === selectedCategory).fields.map((field)=>(
          <>
          <div key={field.name} className="w-1/2 flex justify-center items-center">
          
            <Input
            title={field.name}
            name={field.name}
            type={field.type == 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
            placeholder={`Enter ${field.name}`} 
            value={lineItemDetails[field.name || ""]} 
            onChange={handleInputChange}                      
            />
           
          </div>
   
          
          
          </>
         ))}

{/* //personal expense */}
<div className=" flex flex-wrap">
<div className="w-1/2 flex-row  h-[52px] flex items-center justify-center  mb-5">

<div className="w-fit">
<h2 className="text-zinc-600 text-sm font-cabin">Is Persona Expense?</h2>
<ActionButton variant='red' text={personalFlag ? "NO"  : "YES" } onClick={handlePersonalFlag}/>
</div>
</div>

<div className="w-1/2">
{personalFlag &&
<Input
title='Personal Amount'
error={ errorMsg.personalAmount}
name='personalAmount'
type={'text'}
value={lineItemDetails.personalAmount || ""}
onChange={handleInputChange}
/>}

</div> 

{/* //personal expense */}
<div className="h-[48px] w-1/2 justify-center items-center inline-flex gap-4 ">
   <div className="w-[100px] h-auto ">
   <Dropdown
         label="Currency"
         name="currency"
         id='currency'
         htmlFor='currency'
       placeholder="Select Currency"
       options={['INR',"USD",'AUD']} //this data will get from currency  api
      //  onSelect={(value) => handleDropdownChange(value, 'currencyName')}
       currentOption=""
       violationMessage="Your violation message" 
       error={{ set: true, message: "Your error message" }} 
       required={true} 
       submitAttempted={false}
       icon={chevron_down}
       onChange={(value) => handleDropdownChange(value, 'currencyName')}
       />

</div>  
{ selectDropdown == null || selectDropdown !== defaultCurrency   &&
<div className='mt-6'>
<ActionButton text="Convert" onClick={handleConverter}/>

{/* {currencyTableData?.currencyFlag ? <h2>Coverted Amount: {currencyTableData?.convertedAmount ??" converted amt not there"}</h2> : <h2 className='text-red-500'>{errorMsg.currencyFlag.msg}</h2>} */}

</div>}   
</div>

{currencyTableData?.currencyFlag &&
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
 }

</div>


<div>

  
</div>

<div className="w-full flex items-center justify-center border-[1px] border-gray-50 mt-5">
<Upload  
  selectedFile={selectedFile}
  setSelectedFile={setSelectedFile}
  fileSelected={fileSelected}
  setFileSelected={setFileSelected}
  />
</div>

<div className="w-full mt-5 px-4" >
 <Button text="Save" 
  onClick={handleSaveLineItemDetails} />
</div>     

{/* -------------------- */}


     </div>
     </div>
   </div>
   
  
    </>
 
 
</div>

</div>

   
{/* end //lineItemform */}
    </div>      


              
               
            </div>
            </div>
           
           
      


{/* {lineItemManually &&
<LineItem/>
} */}


  





            {openModal && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none" >
                <div className='z-10 max-w-4/5 w-2/5 min-h-4/5 max-h-4/5 scroll-none bg-white-100  rounded-lg shadow-md'>
                    <div className="p-10">
                        <p className="text-xl font-cabin">Seletct option for Enter Expense Line</p>
                        <div className="flex mt-10 justify-between">
                            <Button variant='fit' text='Scan' onClick={""} />
                            <Button variant='fit' text='Manually' onClick={()=>{setOpenLineItemForm(true);setOpenModal(false)}} />
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


{/* <div className="mt-5">
    <div> <Button text="Add Line Item"/></div>
<div>

<div className="form w-[50px] flex flex-row gap-2">
<Select 
         options={travelExpenseCategoryOptions}
         onSelect={onReasonSelection}
         placeholder='Select Category'
         title='Category'
/>
<div className="inline-flex">
<Input title='Amount' placeholder='Enter Amount' /> 

<Select 
         options={travelExpenseCategoryOptions}
         onSelect={onReasonSelection}
         placeholder='Select Currency'
         title="Currency"
/>
<div className="w-full flex flex-row gap-4 m-2">
<ActionButton text="convert"/>
    <div>
        <h2>Coverted Amt:<strong> INR50000</strong></h2>
    </div>
</div>
<Select 
         options={travelExpenseCategoryOptions}
         onSelect={onReasonSelection}
         placeholder='Allocation Header'
         title="Allocation Header"
/>

    <div>
    <h1> Personal Expense</h1>
    <button
        className={`${
          isPersonalExpense ? 'bg-green-500' : 'bg-red-500'
        } text-white font-bold py-2 px-2 rounded-full`}
        onClick={handleButtonClick}
      >
        {isPersonalExpense ? 'YES': 'NO'}
      </button>
    </div>



<div className="pb-8 ml-4">
            <div className="flex gap-2">
                <p className='text-base font-medium text-neutral-700 font-cabin'>Upload Bills</p>
                <p className='text-base font-medium text-neutral-500 font-cabin'>{`(Optional)`}</p>
            </div>
<div className=""> 
<Upload selectedFile={selectedFile} 
                    setSelectedFile={setSelectedFile} 
                    fileSelected={fileSelected} 
                    setFileSelected={setFileSelected} />
</div>
            

            {fileSelected ? (
                <div className="flex flex-col items-start justify-start gap-[8px] text-[12px]">
                <img
                  className="relative w-10 h-10 overflow-hidden shrink-0"
                  alt=""
                  src={file_icon}
                />
                <div className="relative font-medium inline-block overflow-hidden text-ellipsis whitespace-nowrap w-[43px]">
                  {selectedFile.name}
                </div>
              </div>
            ) : (
              null
            )}

            <hr className='mt-8' />
 </div>
<div className="m-4 flex gap-2">
 <ActionButton text="Save"/>
 <ActionButton text="modify"/>
 <ActionButton text="delete"/>
 </div>




</div>

</div>
</div>
</div>    */}