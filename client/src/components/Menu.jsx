import React, { useEffect, useState } from 'react'
import { aeroplane1_icon, airplane_icon1, cancel_icon, csv_icon, down_arrow_icon, export_icon, filter_icon, money, pdf_icon, receipt, reciept_icon, show_coloum_icon } from '../assets'
import Modal from './common/Modal';
import Input from './common/Input';
import Select from './common/Select';
import Search from './common/Search';
import { useParams } from 'react-router-dom';
import { employees, travelRequestStatus, travelType } from '../data/userData';
import MultiSearch from '../components/common/MultiSearch';
import Button from './common/Button';
import TripReport from '../report/TripReport';
import PopupMessage from './common/PopupMessage';
import ExpenseReport from '../report/ExpenseReport';
import { formatDate, formatFullDate ,formatDateToYYYYMMDD,handleCSVDownload} from '../utils/handyFunctions';
import TripChart from './chart/TripChart';
import { requiredCashAdvanceData, requiredExpenseData, requiredTripData } from '../data/tripData';
import Error from './common/Error';
import Sidebar from './common/Sidebar';
import { getfilteredReportDataAPI, getReportDataAPI } from '../utils/api';
import IconOption from '../components/common/IconOption'
import ExpenseChart from './chart/ExpenseChart';
import CashChart from './chart/CashChart';
import CashReport from '../report/CashReport';
import ReimbursementReport from '../report/ReimbursementReport';
import {reimbursementHeaders, cashAdvanceHeaders, travelExpenseHeaders, tripHeaders} from '../data/miscellaneousData'
import { flattedCashadvanceData, flattedTravelExpenseData, flattenNonTravelExpenseData, flattenTripData } from '../utils/transformer';
import NonTravelExpenseChart from './chart/NonTravelExpenseChart';
import MultiSelect from './common/MultiSelect';



const Menu = () => {
  const {tenantId,empId}= useParams()

  const reportConfigInputs = {
    trips: [
      { name: 'tripStatus', type: 'dropdown', options: [...travelRequestStatus] },
      { name: 'tripStartDate', type: 'date' },
      { name: 'travelPurpose', type: 'dropdown' ,options:[...travelType] },
    ],
    cashAdvance: [
      { name: 'advanceAmount', type: 'number' },
      { name: 'requestDate', type: 'date' },
    ],
    expenses: [
      { name: 'expenseType', type: 'dropdown', options: ['Travel', 'Food', 'Accommodation'] },
      { name: 'expenseDate', type: 'date' },
      { name: 'currencies', type: 'multisearch' },
      { name: 'paymentMode', type: 'multisearch' },
    ],
    reimbursements: [
      { name: 'expenseType', type: 'dropdown', options: ['Travel', 'Food', 'Accommodation'] },
      { name: 'expenseDate', type: 'date' },
      { name: 'currencies',  type: 'multisearch' },
      { name: 'paymentMode', type: 'multisearch' },
    ],
    common: [
      { name: 'fromDate', type: 'date' },
      { name: 'toDate', type: 'date' },
      { name: 'status', type: 'dropdown' },
    ],
  };


  
  



  const [activeView, setActiveView] = useState("myView");
  const [reportData , setReportData]=useState({
    "employeeRoles": {},
    "tripData": [],
    "cashadvanceData":[],
    "travelExpenseData":[],
    "nonTravelExpenseData":  [],
    "filterData":{
      "apporvers": [],
      "statuses":{
        "approverStatusList":[],
        "cashadvanceStatusList":[],
        "expenseHeaderStatusList":[],
        "tripStatusList":[]
      }
    }
  });
  const [isLoading , setIsLoading]=useState(true);
  const [isUploading,setIsUploading]=useState({"filterReport":false})
  const [loadingErrorMsg, setLoadingErrorMsg]=useState(null);
  const [reportTab , setReportTab]= useState("trip");
  const [exportData, setExportData]=useState("trip")
  const [showModal , setShowModal]=useState(false);
  const [modalTab , setModalTab]=useState("filterTab");
  const [filterForm , setFilterForm]= useState({});
  const [fromDate, setStartDate] = useState('');
  const [toDate, setEndDate] = useState('');
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState(null)

  if(activeView==="myTeamView"){

    Object.keys(reportConfigInputs).forEach((key)=>{
      if(key!=="common"){
      reportConfigInputs[key].push({ name: "Employees", type: "multisearch", options: [] })
      }
    })
    

  }


  const handleModalTab =(tab)=>{
    setModalTab(tab)
  }
 



  useEffect(()=>{
    setEndDate(formatDateToYYYYMMDD(new Date()))
    setStartDate(formatDateToYYYYMMDD(new Date()))
    setFilterForm((prevForm) => ({
      ...prevForm,
      'fromDate':new Date(),
      'toDate':new Date()
    }));
  },[])

 
  const tabIcon = (tab) => { 
    switch (tab) {
      case "trip":
        return aeroplane1_icon;
        
      case "cash-advance":
        return money;
  
      case "travel expense":
        return receipt;
  
      case "non-travel expense":
        return receipt;
  
      default:
        return airplane_icon1;
    }
  }
  

  const handleReportTab = (tab) => {
    setReportTab(tab);

    switch (tab) {
      case "trip":
        setVisibleHeaders(tripHeaders);
        setExportData(tripData);
        break;
      case "travel expense":
        setVisibleHeaders(travelExpenseHeaders);
        setExportData(travelExpenseData);
        break;
      case "cash-advance":
        setVisibleHeaders(cashAdvanceHeaders);
        setExportData(cashadvanceData);
        break;
      case "non-travel expense":
        setVisibleHeaders(reimbursementHeaders);
        setExportData(reportData?.nonTravelExpenseData);
        break;
      default:
        setVisibleHeaders(tripHeaders);
        setExportData(tripData)
    }
  };
  
  const subtractDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };
  
  const startOfWeek = (date) => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = result.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    result.setDate(diff);
    return result;
  };
  
  const endOfWeek = (date) => {
    const result = startOfWeek(date);
    result.setDate(result.getDate() + 6);
    return result;
  };
  
  const startOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };
  
  const endOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };
  
  const presets = [
    { label: 'Today', range: [new Date(), new Date()] },
    { label: 'Yesterday', range: [subtractDays(new Date(), 1), subtractDays(new Date(), 1)] },
    { label: 'Last 7 Days', range: [subtractDays(new Date(), 6), new Date()] },
    { label: 'This Week', range: [startOfWeek(new Date()), endOfWeek(new Date())] },
    { label: 'This Month', range: [startOfMonth(new Date()), endOfMonth(new Date())] },
  ];
  
  const handlePresetChange = (value) => {
    const selectedRange = presets.find(preset=> preset.label === value).range
    setStartDate(selectedRange[0]);
    setEndDate(selectedRange[1]);
    
    setFilterForm((prevForm) => ({
      ...prevForm,
      'fromDate':selectedRange[0],
      'toDate':selectedRange[1]
    }));
  };

  console.log('end date', toDate)

  
  const handleFilterForm = (key, value) => {
    if(key === 'fromDate'|| key === 'toDate'){
      setFilterForm((prevForm) => ({
        ...prevForm,
        [key]: formatFullDate(value.target.value),
      }));
    }else {
    setFilterForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }))}
  };
  
console.log('filtered form', filterForm)

const [visibleHeaders, setVisibleHeaders] = useState(tripHeaders);
const [hiddenHeaders, setHiddenHeaders] = useState([]);

// Modal visibility state
const [isModalOpen, setIsModalOpen] = useState(false);

// Toggle modal visibility
const toggleModal = () => {
  setIsModalOpen(!isModalOpen);
};

// Handle header visibility
const showHeader = (header) => {
  setVisibleHeaders([...visibleHeaders, header]);
  setHiddenHeaders(hiddenHeaders.filter((h) => h !== header));
};

const hideHeader = (header) => {
  setVisibleHeaders(visibleHeaders.filter((h) => h !== header));
  setHiddenHeaders([...hiddenHeaders, header]);
};


// for fetch the data
  const fetchData = async (tab) => {
    try {
      setIsLoading(true);
      const response = await getReportDataAPI(tenantId, empId,tab);
      console.log('from api data',response)
      setReportData(prev=>({...prev,
        "employeeRoles":response?.employeeRoles || {},
        "tripData": response?.reports?.trips || [],
        "cashadvanceData": response?.reports?.trips || [],
        "travelExpenseData": response?.reports?.trips || [],
        "nonTravelExpenseData": flattenNonTravelExpenseData(response?.reports?.reimbursement) || [],
        "filterData":{
          "listOfEmployees":response?.reports?.listOfEmployees  || [],
          "listOfApprovers":response?.reports?.listOfApprovers  || [],
          "statuses":{
            "approverStatusList":response?.reports?.hrDetails?.getEnums?.approverStatusEnums,
            "cashadvanceStatusList":response?.reports?.hrDetails?.getEnums?.cashAdvanceStatusEnum,
            "expenseHeaderStatusList":response?.reports?.hrDetails?.getEnums?.expenseHeaderStatusEnums,
            "tripStatusList":response?.reports?.hrDetails?.getEnums?.tripStatusEnum
          }
        }
      }))
      console.log('Report Data', response);
      setIsLoading(false);  
    } catch (error) {
      setLoadingErrorMsg(error.message);
      setTimeout(() => {
        setIsLoading(false);
        setLoadingErrorMsg(null);
      }, 3000);
    } 
  };

console.log('Report Data1',reportData)
//for generate customize report
const handleRunReport = async () => {
  console.log('Filter Form:', filterForm);
  // Prepare the payload with filterForm and dynamically add filterBy based on the reportTab
  const payload = { ...filterForm };

  // Function to determine the value for "filterBy" based on reportTab
  const getFilterBy = (reportTab) => {
    switch (reportTab) {
      case "trip":
        return "trips";
      case "travel expense":
        return "travel-expenses";
      case "non-travel expense":
        return "non-travel-expenses";
      case "cash-advance":
        return "trips";
      default:
        return ""; // Fallback value in case reportTab doesn't match
    }
  };

  try {
    // Set the loading state for filtering the report
    setIsUploading((prev) => ({ ...prev, filterReport: true }));

    // Call the API to get the filtered report data with the payload and filterBy
    const response = await getfilteredReportDataAPI(
      { tenantId, empId, filterBy: getFilterBy(reportTab) },
      payload
    );

    console.log('API Response:', response);

    // Dynamically set report data based on the reportTab value
    // const setDataByReportTab = (reportTab, response) => {
    //   switch (reportTab) {
    //     case "trip":
    //       if(response?.trips?.length > 0 ){

          
    //       setReportData((prev) => ({
    //         ...prev,
    //         tripData: response?.trips || [],
    //       }));}else{
    //         setShowPopup(true)
    //         setMessage("No trips found for the current criteria.")
    //       }
    //       break;
    //     case "cash-advance":
    //       setReportData((prev) => ({
    //         ...prev,
    //         cashadvanceData: response?.trips || [],
    //       }));
    //       break;
    //     case "travel expense":
    //       setReportData((prev) => ({
    //         ...prev,
    //         travelExpenseData: response?.trips || [],
    //       }));
    //       break;
    //     case "non-travel expense":
    //       setReportData((prev) => ({
    //         ...prev,
    //         nonTravelExpenseData: flattenNonTravelExpenseData(
    //           response?.reports
    //         ) || [],
    //       }));
    //       break;
    //     default:
    //       // Fallback handling, if any
    //       setReportData((prev) => ({
    //         ...prev,
    //         tripData: response?.trips || [],
    //       }));
    //   }
    // };
    const setDataByReportTab = (reportTab, response) => {
      const dataMap = {
        trip: "tripData",
        "cash-advance": "cashadvanceData",
        "travel expense": "travelExpenseData",
        "non-travel expense": "nonTravelExpenseData"
      };
    
      const newData = reportTab === "non-travel expense"
        ? flattenNonTravelExpenseData(response?.reports)
        : response?.trips || [];
    
      // Check if data is empty and handle popup message for each tab
      if (newData.length === 0) {
        setShowPopup(true);
        
        let message = "";
        switch (reportTab) {
          case "trip":
            message = "No trips found for the current criteria.";
            break;
          case "cash-advance":
            message = "No cash advances found for the current criteria.";
            break;
          case "travel expense":
            message = "No travel expenses found for the current criteria.";
            break;
          case "non-travel expense":
            message = "No non-travel expenses found for the current criteria.";
            break;
          default:
            message = "No data found for the selected criteria.";
        }
        setShowPopup(true)
        setMessage(message);

      } else {
        setReportData((prev) => ({
          ...prev,
          [dataMap[reportTab]]: newData,
        }));
      }
    };
    
    // Set the report data based on the current reportTab
    setDataByReportTab(reportTab, response);
    setFilterForm((prevForm) => ({
      fromDate:prevForm?.fromDate,
      toDate: prevForm?.toDate
    }));
    setTimeout(()=>{
      setShowPopup(false)
      setMessage(null)
    },3000)
    setShowModal(false)


    console.log('Report Data Set:', response);

    // Stop the loading state once the data is set
    setIsUploading((prev) => ({ ...prev, filterReport: false, }));
    setShowModal(false)
  } catch (error) {
    setShowPopup(true)
    setMessage(error.message)
    setTimeout(() => {setIsUploading((prev) => ({ ...prev, filterReport: false }));setMessage(null);setShowPopup(false)},3000);
   
  }
};



useEffect(()=>{
  // setReportData(requiredTripData)
  setIsLoading(false)

  setTimeout(()=>{
    setLoadingErrorMsg('Something went wrong')
    setIsLoading(false)
    },3000)

  fetchData("myView");

},[])





// download file
const handleDownloadfile=(file)=>{
  if(file === 'PDF'){
    //handleCSVDownload(json.employees)
  }else if (file === 'CSV'){
    handleCSVDownload(exportData)
  }
}
const tripData = flattenTripData(reportData?.tripData)
const cashadvanceData = flattedCashadvanceData(reportData?.cashadvanceData,'cashAdvances')
const travelExpenseData = flattedTravelExpenseData(reportData?.travelExpenseData)

console.log('flatted reports',travelExpenseData)
return (
  <>
<div className='flex overflow-auto h-screen scrollbar-hide'>
    <div className='w-[180px]'>
        <Sidebar fetchData={(tab)=>fetchData(tab)} employeeRoles={reportData?.employeeRoles} activeView={activeView} setActiveView={setActiveView} handleReportTab={handleReportTab} reportTab={reportTab} />
    </div>  
{isLoading && <Error message={loadingErrorMsg}/>}
{!isLoading &&
<div className=' flex flex-col w-screen  '>

  <div className='mx-4 px-4 py-2  bg-indigo-200 rounded-md text-neutral-700 flex flex-row justify-between items-center h-[48px]'>
  
    <div className='flex items-center gap-2 font-cabin text-base'>
      <img src={tabIcon(reportTab)} className='w-4 h-4'/>
      <h1 className='capitalize font-semibold text-indigo-600'>{reportTab}</h1>
    </div>

  <div className='flex gap-2 capitalize items-center'>
    <img src={filter_icon} className='w-4 h-4'/>
      <p className='text-neutral-800 font-semibold'>{`start date : ${formatDate(filterForm.fromDate)} - ${formatDate(filterForm.toDate)}`}</p> 
      <div className='cursor-pointer' onClick={()=>{setShowModal(!showModal);handlePresetChange(presets[0].label)}}>
        <p className='text-base text-indigo-600 font-semibold'>Customize</p>
      </div> 
  </div> 

      <IconOption 
        buttonText={
          <div className='inline-flex justify-center items-center gap-2'>
          <img src={export_icon} className='w-4 h-4 -rotate-90'/>
          <div className='cursor-pointer'>
            <p className='text-base text-indigo-600 font-semibold'>Export As</p>
          </div>
          <img src={down_arrow_icon} className='w-4 h-4 translate-y-1'/>
          </div>
        }
      >
        {
          [{name:'PDF',icon:pdf_icon}, {name:'CSV',icon:csv_icon }].map((ele)=>(
            <div onClick={()=>handleDownloadfile(ele.name)} key={ele.name}  className='flex items-center gap-2 px-2 py-2 hover:bg-indigo-50 rounded-md cursor-pointer'>
              <img src={ele.icon} className='w-4 h-4'/>
              <p className='font-cabin text-base '>{ele.name}</p>
            </div>
          ))
        }
      </IconOption>
  </div> 
  
{reportTab === "trip" && 
<>
<div className='flex items-center justify-center'>  
  <TripChart data={reportData?.tripData}/>
</div> 

<TripReport toggleModal={toggleModal} tripData={tripData} visibleHeaders={visibleHeaders}/>
</>} 


{reportTab === "cash-advance" && 
<>
  <div className='flex items-center justify-center'>  
    <CashChart data={[...reportData?.cashadvanceData]}/>
  </div> 
  <CashReport toggleModal={toggleModal} visibleHeaders={visibleHeaders} data={cashadvanceData}/>
</>} 

{reportTab === "travel expense" && 
<>

<div className='flex items-center justify-center'>  
  <ExpenseChart data={[...reportData?.travelExpenseData]}/>
</div> 
 <ExpenseReport toggleModal={toggleModal} visibleHeaders={visibleHeaders} expenseData={travelExpenseData}/>
</>} 
{reportTab === "non-travel expense" && 
<> 
<div className='flex items-center justify-center'>  
  <NonTravelExpenseChart data={[...reportData?.nonTravelExpenseData]}/>
</div> 
 <ReimbursementReport toggleModal={toggleModal} visibleHeaders={visibleHeaders} data={reportData?.nonTravelExpenseData}/>
</>} 


  <Modal showModal={showModal} setShowModal={setShowModal} skipable={true}>  
    <div className='h-full'>
    {/* <div className='h-[48px] rounded-t-lg   bg-purple-100 px-5 flex justify-start items-center'>
        <h1 className='text-start text-inter text-lg font-semibold text-purple-500 capitalize'>{`${reportTab}s Report`}</h1>
    </div> */}
      <div className='sticky top-0 z-10 flex gap-2 justify-between items-center bg-indigo-100 w-auto  p-4'>
            <div className='flex gap-2'>
              {/* <img src={info_icon} className='w-5 h-5' alt="Info icon"/> */}
              <p className='font-inter capitalize text-base font-semibold text-indigo-600'>
              {`${reportTab}s Report`}
              </p>
            </div>
            <div onClick={() => {setShowModal(false);setFilterForm({})}} className='bg-red-100 cursor-pointer rounded-full border border-white'>
              <img src={cancel_icon} className='w-5 h-5' alt="Cancel icon"/>
            </div>
          </div>
    <div className='px-4 py-2'>
    <div className='h-[48px]  flex-row rounded-t-lg px-5 flex justify-between items-center border-b w-full'>
      <div className='flex flex-row space-x-4'>
      <div className={` ${modalTab === "filterTab" ? 'border-b-2 border-indigo-600 text-indigo-600 ' : 'text-neutral-700'} hover:rounded-md hover:bg-indigo-200 px-2 py-1   flex items-center gap-2 cursor-pointer`} onClick={()=>handleModalTab("filterTab")}> 
      <img src={filter_icon} className='w-3 h-3'/>
        <h1 className='text-start  text-inter text-base font-cabin '>
          Filters
        </h1>
      </div>
      <div className={`${modalTab === "columnTab" ? ' border-b-2 border-indigo-600 text-indigo-600' : 'text-neutral-700'}  hover:bg-indigo-200 px-2 py-1 hover:rounded-md  flex items-center gap-2 cursor-pointer`}  onClick={()=>handleModalTab("columnTab")}> 
      <img src={show_coloum_icon} className='w-4 h-4'/>
        <h1 className='text-start  text-inter text-sm font-cabin '>
          Show/Hide Column
        </h1>
      </div>
      </div>
    <h1 className='text-start text-inter text-base font-cabin hover:font-medium cursor-pointer text-purple-500 '>Reset Filters</h1>
    </div>

    {modalTab === "filterTab" &&
    <div className=''>
      <div className='flex items items-center  justify-between'>
      <div>
        <Select
          options={presets.map(preset => preset.label)}
          onSelect={(value)=> handlePresetChange(value)}
          title="Custom"/>
      </div>
      <div className='flex gap-2'>
      <div className='w-[200px]'>
        <Input
          title="From"
          type="date"
          value={formatDateToYYYYMMDD(fromDate)}
          onChange={(value)=>handleFilterForm('fromDate',value)}
        />
      </div>
    <div className='w-[200px]'>
      <Input
        title="Till"
        type="date"
        value={formatDateToYYYYMMDD(toDate)}
        onChange={(value)=>handleFilterForm('toDate',value)}
        // min={fromDate}
      />
    </div>
    </div>
    </div>
    {['travel expense', 'trip'].includes(reportTab) &&
      <div className='w-full'>
        <MultiSelect
       onSelect={(value)=>handleFilterForm('tripStatus',value)}
        placeholder={'i.e. Upcoming Trip'}
        title={('trip status')} 
        options={reportData?.filterData?.statuses?.tripStatusList|| []}/>
      </div>}
     

      {(reportData?.employeeRoles.employeeManager || reportData?.employeeRoles.finance || reportData?.employeeRoles.businessAdmin || reportData?.employeeRoles.superAdmin) && (
      <div className='w-full'>
      <MultiSearch
        options={reportData?.filterData?.listOfEmployees}
        // currentOption={selectedOptions}
        onSelect={(value)=>handleFilterForm('empNames',value)}
        title="Search Employees"
        placeholder="Start typing employee name..."
        // error={{ set: true, message: "Please select at least one employee." }}
      />
      </div>)}
      <div className='w-full'>
        <Select 
        options={travelType}
        onSelect={value=>handleFilterForm('travelType',value)}
        title="Type of Trip"/>
      </div>
      {reportTab==="cash-advance" &&
       <div className='w-full'>
       <MultiSelect
       onSelect={(value)=>handleFilterForm('cashAdvanceStatus',value)}
       placeholder={'i.e. Pending Settlement'}
       title={('cash-advance status')} 
       options={reportData?.filterData?.statuses?.cashadvanceStatusList|| []}/>
     </div>}
     {['travel expense', 'non-travel expense'].includes(reportTab)&&
      <div className='w-full'>
      <MultiSelect
      onSelect={(value)=>handleFilterForm('expenseHeaderStatus',value)}
      placeholder={'i.e. Pending Settlement'}
      title={('Expense status')} 
      options={reportData?.filterData?.statuses?.expenseHeaderStatusList|| []}/>
    </div>}
     
     {["myView"].includes(activeView) && <MultiSearch
        options={reportData?.filterData?.listOfApprovers}
        // currentOption={selectedOptions}
        onSelect={(value)=>handleFilterForm('approvers',value)}
        title="Search Approvers"
        placeholder="Start typing approver name..."
        // error={{ set: true, message: "Please select at least one employee." }}
      />}
      </div>}

    {modalTab === "columnTab" && 
      
        <div className="bg-white p-4 rounded text-neutral-700 font-cabin">
          <div className="flex gap-2">
            <div className="w-1/2 p-2 border border-slate-300">
              <h3 className="mb-2 text-neutral-500 ">Hidden Headers</h3>
              <div className='h-[200px] overflow-y-auto'>
              {hiddenHeaders.map((header, index) => (
        <div key={index} className="flex gap-2 items-center capitalize">
          <div
            onClick={() => showHeader(header)}
            className="bg-green-600 cursor-pointer text-white h-4 w-4 flex items-center justify-center rounded-full focus:outline-none"
            aria-label={`Hide ${header}`}
          >
            <span className='text-lg text-center'>+</span>
          </div>
          <p>{header}</p>
        </div>
      ))}
            </div>
            </div>
            <div className="w-1/2 p-2 capitalize font-cabin text-base border border-slate-300">
              <h3 className="mb-2 text-neutral-500">Visible Headers</h3>
              <div className='h-[200px] overflow-y-auto'>
              {visibleHeaders.map((header, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
            onClick={() => hideHeader(header)}
            className="bg-red-600 cursor-pointer text-white h-4 w-4 flex items-center justify-center rounded-full focus:outline-none"
            aria-label={`Hide ${header}`}
          >
            <span className='text-lg text-center'>−</span>
          </div>
                  <p>{header}</p>
                </div>
              ))}
              </div>
            </div>
          </div>

        </div>
      }  

      <div className='pt-4'>
        <Button loading={isUploading.filterReport} text="Run Report" onClick={handleRunReport}/>
      </div>
      </div>
    
  
    </div>
  </Modal>
</div>}

</div>
<PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>
</>
  )

}

export default Menu
