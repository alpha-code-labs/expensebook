/* eslint-disable react/jsx-key */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */

import React,{ useState, useEffect , createRef} from "react";
import {BrowserRouter as Router, useParams} from 'react-router-dom'
import Icon from "../components/common/Icon";
import { titleCase, urlRedirection } from "../utils/handyFunctions";
import Button from "../components/common/Button";
import Error from "../components/common/Error";
import PopupMessage from "../components/common/PopupMessage";
import { cab_purple as cab_icon, airplane_1 as airplane_icon ,house_simple , chevron_down,  cancel, modify} from "../assets/icon";
import tripDummyData from "../dummyData/tripDummyData";
import { hrDummyData } from "../dummyData/requiredDummy";
import Select from "../components/common/Select";
import ActionButton from "../components/common/ActionButton";
import Input from "../components/common/Input";
import Upload from "../components/common/Upload";
import { cancelTravelExpenseLineItemApi, getTravelExpenseApi, postMultiCurrencyForTravelExpenseApi, submitOrSaveAsDraftApi } from "../utils/api.js";
import { bookAnExpenseData } from "../dummyData/requiredDummy";
import Dropdown from "../components/common/DropDown.jsx";
import Search from "../components/common/Search.jsx";
import GoogleMapsSearch from "./GoogleMapsSearch.jsx";
import { classDropdown } from "../utils/data.js";
import Toggle from "../components/common/Toggle.jsx";



const approvalOptions=["Aarav Singh", "Arnav Patel"]

export default function () {

  const mapRef = createRef();
  const inputRef = createRef();

  useEffect(() => {
    const loadMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -33.8688, lng: 151.2195 },
        zoom: 13,
         // Apply your custom map styles here if any
      });

      const input = inputRef.current;
      const searchBox = new window.google.maps.places.SearchBox(input);

      map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

      map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds());
      });

      let markers = [];

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();

        if (places.length === 0) {
          return;
        }

        markers.forEach((marker) => {
          marker.setMap(null);
        });
        markers = [];

        const bounds = new window.google.maps.LatLngBounds();

        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
            console.log('Returned place contains no geometry');
            return;
          }

          const icon = {
            url: place.icon,
            size: new window.google.maps.Size(71, 71),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(17, 34),
            scaledSize: new window.google.maps.Size(25, 25),
          };

          markers.push(
            new window.google.maps.Marker({
              map,
              icon,
              title: place.name,
              position: place.geometry.location,
            })
          );
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    };

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = loadMap;
    document.head.appendChild(script);

    return () => {
      // Cleanup script
      document.head.removeChild(script);
    };
  }, [mapRef, inputRef]);


  //--------------------------------google search-----------------------------------------------
  const {cancelFlag , tenantId,empId,tripId} = useParams() ///these has to send to backend get api
 
  

 
  
  const [activeIndex, setActiveIndex] = useState(null);

  const handleItemClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  



  const [onboardingData, setOnboardingData] = useState(null);
  const [travelAllocationFlag, setTravelAllocationFlag] = useState(null);
  const [travelExpenseAllocation,setTravelExpenseAllocation]=useState(null);
  const [categoryfields , setCategoryFields]=useState(null) ///this is for get field after select the category


  const [selectedAllocations , setSelectedAllocations]=useState([])//for saving allocations on line saving line item
  const [settlementOptions, setSettlementOptions]=useState([])
  const [currencyTableData, setCurrencyTableData] = useState(null) //for get data after conversion
  

  useEffect(() => {
    const onboardingData = bookAnExpenseData;
    const travelAllocationFlags = onboardingData?.companyDetails?.travelAllocationFlags;
    const expenseCategoryAndFields = onboardingData?.companyDetails?.travelExpenseCategories
    const onboardingLevel = Object.keys(travelAllocationFlags).find((level) => travelAllocationFlags[level] === true);
    
    const settlementOptionArray =onboardingData?.companyDetails?.expenseSettlementOptions
    const settlementOptions = Object.keys(settlementOptionArray).filter((option) => settlementOptionArray[option]);
    setSettlementOptions(settlementOptions)
    
    setTravelAllocationFlag(onboardingLevel);
    setOnboardingData(onboardingData);
    setCategoryFields(expenseCategoryAndFields) //this is for get form fields
    //for get level

      const expenseAllocation= onboardingData?.companyDetails?.travelAllocations?.expenseAllocation
      setTravelExpenseAllocation(expenseAllocation)  

  }, [bookAnExpenseData]);
   

  const defaultCurrency =  onboardingData?.companyDetails?.defaultCurrency ?? 'N/A'

  // console.log(travelAllocationFlag)
  // console.log('expense allocation',travelExpenseAllocation)
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
        } else {
          setLoadingErrMsg(null);
          setOnboardingData(response.data);
  
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
    const categoryNames = categoryfields &&  categoryfields.map((category)=>(category.categoryName))
    
    useEffect(()=>{
      //this is for set intialvalue in categoryfield
      const categoryFields1 = selectedCategory && categoryfields.find((category) => category.categoryName === selectedCategory).fields.map((field) => field);
      console.log('categoryFieds',categoryFields1)
      setCategoryFieldBySelect(categoryFields1)
      
      const initialFormValues =selectedCategory &&  Object.fromEntries(categoryFields1.map((field)=>[field.name , '']))
      console.log('initial value',{...initialFormValues})
      setLineItemDetails({...initialFormValues})

    },[selectedCategory])



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
  
}


useEffect(()=>{
  
   if(!personalFlag){
    setLineItemDetails(({...lineItemDetails, personalExpenseAmount:"" ,isPersonalExpense:false}))
   }
  

},[personalFlag])




//for save selected allocations allocation in array
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


  const handleConverter = async (data ) => { 
  const {Currency , personalExpenseAmount , 'Total Amount': totalAmount} =data
    // const { Currency, personalExpenseAmount,} = lineItemDetails;
    // const totalAmount = lineItemDetails['Total Amount'];
    let allowForm = true;
  
    if (totalAmount === "") {
      setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: true, msg: "Enter total amount" } }));
      allowForm = false;
    } else {
      setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: false, msg: "" } }));
    }
  
    if (personalFlag && personalExpenseAmount === "") {
      setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: true, msg: "Enter personal amount" } }));
      allowForm = false;
    } else {
      setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: false, msg: "" } }));
    }
  
    if (allowForm) {
      const nonPersonalAmount = totalAmount - personalExpenseAmount;
  
      // Create an object with the dynamic field name and value
  
      const convertDetails = {
        currencyName: Currency,
        personalExpense: personalExpenseAmount || "",
        nonPersonalExpense: nonPersonalAmount || "",
        totalAmount: totalAmount || "",
       
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


    const [formData, setFormData] = useState(null); //this is for get expense data
    const [getExpenseData, setGetExpenseData]=useState(); //to get data header level 
    const [getSavedAllocations,setGetSavedAllocations]=useState()  ///after save the allocation then i will get next time from here 
    const [openModal,setOpenModal]=useState(false);
    const [openLineItemForm,setOpenLineItemForm]=useState(true)
    const [headerReport,setHeaderReport]=useState(null)


    const [editLineItemById, setEditLineItemById]=useState(null)
  
  
    useEffect(() => {

        const tripData = tripDummyData
        const hrData= hrDummyData
        const expenseData= tripDummyData.travelExpenseData //get line items
        console.log('expenseData',expenseData)   
        ///where is newExpenseReport = true
        const headerReportData = expenseData.find((expense) => expense.newExpenseReport);
        setHeaderReport(headerReportData)
        setFormData({...tripData})
        setGetSavedAllocations({...hrData});
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
      const dataWithCompanyDetails={
        companyDetails:companyDetails,
        expenseLines:[expenseLines],
        // expenseLines:[{...expenseLines}],
        allocations: selectedAllocations
      }
      console.log('save line item', dataWithCompanyDetails)
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


console.log('objectca',categoryfields)

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

        <div>
          <AllocationComponent travelExpenseAllocation={travelExpenseAllocation} onAllocationSelection={onAllocationSelection}/>
        </div>
        
        <div>
          <ExpenseHeader cancelFlag={cancelFlag}
              handleCancelExpenseHeader={handleCancelExpenseHeader}
              handleSubmitOrDraft={handleSubmitOrDraft}
              formData={formData} 
              approvalOptions={approvalOptions} 
              onReasonSelection={onReasonSelection} 
              settlementOptions={settlementOptions} 
              defaultCurrency={defaultCurrency} 
              />
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
   
    <EditForm handleConverter={handleConverter} selectedCategory={selectedCategory} categoryfields={categoryfields} lineItemDetails={lineItemDetails} classDropdownValues ={classDropdownValues} lineItem={lineItem} defaultCurrency={defaultCurrency}/>
    
    )  :

<div className="w-full flex-wrap flex justify-center items-center p-2">

<EditView lineItem={lineItem} index={index} newExpenseReport={item.newExpenseReport} setSelectedCategory={setSelectedCategory} setEditLineItemById={setEditLineItemById} handleDeleteLineItem={handleDeleteLineItem}/>
</div>
  ))}
{/* </div> */}

{/* get lineItem data from backend end*/}


{/* </div> */}



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
  <div className="w-full border flex flex-wrap items-center justify-center py-4 gap-2">
{selectedCategory&&categoryFieldBySelect && categoryFieldBySelect.map((field)=>(
          <>
          <div key={field.name} className="w-1/2 flex justify-center items-center">
          
          {field.name === 'From' || field.name === 'To' || field.name === 'Departure' || field.name === 'Pickup Location' ||field.name === 'DropOff Location' || field.name === 'Arrival' ? (
       
       <>       
        <Input
        inputRef={inputRef}
        title={field.name}
        name={field.name}
        type={'text'}
        // type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
        placeholder={`Enter ${field.name}`}
        value={lineItemDetails[field.name  ||""]}
        onChange={(value)=>handleInputChange(field.name,value)}
      />
      <div ref={mapRef} className="map"></div>
     {/* <GoogleMapsSearch mapRef={mapRef} inputRef={inputRef} /> */}
      </>
      ) : (field.name ==='Class' || field.name ==='Class of Service') ? (
          <div className=" w-full">
        <Select
          label={field.name}
          name={field.name}
          placeholder={`Select ${field.name}`}
          options={classDropdownValues || []}// Define your class options here
          currentOption={lineItemDetails[field.name] || ''}
          onSelect={(value)=>handleInputChange(field.name, value)}
          // violationMessage={`Your violation message for ${field.name}`}
          // error={{ set: true, message: `Your error message for ${field.name}` }}
        />
        </div>
      ) :(
        // Otherwise, render a regular input field
        <Input
          title={field.name}
          name={field.name}
          type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
          placeholder={`Enter ${field.name}`}
          value={lineItemDetails[field.name || '']}
          onChange={(value)=>handleInputChange(field.name , value)}
        />
      )}     
          </div>        
          </>
         ))}
         </div>

{/* //personal expense */}




<div className='flex flex-col px-4 justify-between'>

<div className="flex flex-row justify-between items-center h-[73px]"> 
<div className="">
<Toggle label={'Personal Flag'} initialValue={false}  onClick={handlePersonalFlag}/>
</div>


<div>
  {personalFlag &&
  <Input
  title='Personal Amount'
  error={ errorMsg.personalAmount}
  name='personalExpenseAmount'
  type={'text'}
  value={lineItemDetails.personalExpenseAmount || ""}
  onChange={(value)=>handleInputChange( ['personalExpenseAmount'],value)}
  />}

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

</div>

   
{/* end //lineItemform */}


    </div>      


              
               
            </div>
            </div>
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





//expense allocation

function AllocationComponent ({travelExpenseAllocation , onAllocationSelection}) {

  return(
     <div  className="flex md:flex-row flex-col my-5 justify-evenly items-center flex-wrap">            
             
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
     </div> )}




///expense details on header
function ExpenseHeader({formData
   ,approvalOptions
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
<div className='flex flex-col lg:flex-row border '> 
<div className="border w-full lg:w-1/2">
  bill view
  {lineItem.document}
</div>
<div className="border w-full lg:w-1/2">
    <div className="w-full flex-row  border mt-2">
      <h2>LineItem {index+1}</h2>
     <div className="w-full flex items-center justify-start h-[52px] border px-4 ">
      <p className="text-zinc-600 text-medium font-semibold font-cabin">Category -{titleCase(lineItem.categoryName)}</p>
    </div>   
    <div key={index} className="w-full  border flex flex-wrap items-center px-4 justify-between  py-4">
        {Object.entries(lineItem).map(([key, value]) => (

        key!== 'categoryName' && key!== 'isPersonalExpense' &&    key !== '_id' && key !== 'policyViolation' && key !== 'document' &&(

              <>
        <div className="min-w-[200px] w-full md:w-fit   flex-col justify-start items-start gap-2 ">
                    
        <div className="text-zinc-600 text-sm font-cabin">{titleCase(key)}</div>
        
    
        <div className=" w-full h-full bg-white items-center flex border border-neutral-300 rounded-md">
        
      
              <div key={key}>
                <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin px-6 py-2">
                 
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
</div>
</>
  )
}




function EditForm({selectedCategory ,categoryfields ,lineItemDetails,classDropdownValues,lineItem,defaultCurrency,handleConverter }){

  const[ personalFlag , setPersonalFlag]=useState()

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
    <div className="w-full flex-wrap flex justify-center items-center p-2">
    <div className="border w-full lg:w-1/2">
     bill view
    </div>
    <div className="border w-full lg:w-1/2">
     <div>
        Category {selectedCategory}
      </div>
    
   <div className="w-full flex-row  border">

   {/* <div className="w-full border flex flex-wrap items-center justify-center"> */}
  {selectedCategory &&
         categoryfields.find((category)=>category.categoryName === selectedCategory).fields.map((field)=>(
          <>
          <div key={field.name} className="w-1/2 flex justify-center items-center flex-wrap gap-2">

            
          
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
      <GoogleMapsSearch inputId="pac-input" />
      <div id="map"></div>
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
<div className=" ">
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
<div className="h-[48px] w-1/2 justify-center items-center inline-flex gap-4 ">
   <div className="w-[150px] h-auto">
   <Select
         label="Currency"
        
       placeholder="Select Currency"
       options={['INR',"USD",'AUD']} //this data will get from currency  api
      //  onSelect={(value) => handleDropdownChange(value, 'currencyName')}
      currentOption={lineItem['Currency']}
       violationMessage="Your violation message" 
       error={{ set: true, message: "Your error message" }} 
       onSelect={(value) =>{ handleEditChange('Currency',value),setSelectedCurrency(value)}}
       />
        {/* <Select
       title='Currency'
       currentOption={'AUD'}
       placeholder="Select Currency"
       options={['INR',"USD",'AUD']} 
       onSelect={(value)=>{setLineItemDetails({...lineItemDetails,['Currency']:value}),setSelectDropdown(value)}}
       
       violationMessage="Your violation message" 
       error={{ set: true, message: "Your error message" }} 
       /> */}

</div>  
{ selectedCurrency == null || selectedCurrency !== defaultCurrency   &&
<div className='mt-6'>
<ActionButton text="Convert" onClick={()=>handleConverter(editFormData)}/>


{/* {currencyTableData?.currencyFlag ? <h2>Coverted Amount: {currencyTableData?.convertedAmount ??" converted amt not there"}</h2> : <h2 className='text-red-500'>{errorMsg.currencyFlag.msg}</h2>} */}

</div>}   
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

</div>

<div className="w-full flex items-center justify-center border-[1px] border-gray-50 mt-5">
<Upload  
  selectedFile={selectedFile}
  setSelectedFile={setSelectedFile}
  fileSelected={fileSelected}
  setFileSelected={setFileSelected}
  />
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

