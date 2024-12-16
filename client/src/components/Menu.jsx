import React, { useEffect, useState } from 'react'
import { add_icon, aeroplane1_icon, airplane_icon1, cancel_icon, cash_white_icon, csv_icon, down_arrow_icon, expense_white_icon, export_icon, filter_icon, money, pdf_icon, receipt, reciept_icon, remove_icon, show_coloum_icon, trip_white_icon } from '../assets'
import Modal from './common/Modal';
import Input from './common/Input';
import Select from './common/Select';
import { useParams } from 'react-router-dom';
import { employees, travelRequestStatus, travelType } from '../data/userData';
import MultiSearch from '../components/common/MultiSearch';
import Button1 from './common/Button1';
import TripReport from '../report/TripReport';
import PopupMessage from './common/PopupMessage';
import ExpenseReport from '../report/ExpenseReport';
import { formatDate, formatFullDate ,formatDateToYYYYMMDD,handleCSVDownload, datePresets, titleCase} from '../utils/handyFunctions';
import TripChart from './chart/TripChart';
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
import jsPDF from "jspdf";
import "jspdf-autotable";
// import "jspdf-autotable";

const Menu = () => {
  const {tenantId,empId}= useParams();
  const dashboardBaseUrl = `${import.meta.env.VITE_DASHBOARD_URL}`;

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
      },
     "departments":[] 
    }
  });

  const [isLoading , setIsLoading]=useState(true);
  const [isUploading,setIsUploading]=useState({"filterReport":false});
  const [loadingErrorMsg, setLoadingErrorMsg]=useState(null);
  const [reportTab , setReportTab]= useState("trip");
  const [exportData, setExportData]=useState([]);
  const [showModal , setShowModal]=useState(false);
  const [modalTab , setModalTab]=useState("filterTab");
  //for show on title
  
  const intialFilterForm ={
    'fromDate':new Date(),
    'toDate':new Date(),
    'role':activeView,
    "empNames":reportData?.filterData?.listOfEmployees ||[]
  }

  const [reportDate, setReportDate]=useState(intialFilterForm)
  const [filterForm , setFilterForm]= useState({...intialFilterForm});
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

  const tabIcon = (tab) => { 
    switch (tab) {
      case "trip":
        return trip_white_icon;
        
      case "cash-advance":
        return cash_white_icon;
  
      case "travel expense":
        return expense_white_icon;
  
      case "non-travel expense":
        return expense_white_icon;
  
      default:
        return trip_white_icon;
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
    setFilterForm({...intialFilterForm,role:activeView})
  };
  
  const handlePresetChange = (value) => {
    const selectedRange = datePresets.find(preset=> preset.label === value).range    
    setFilterForm((prevForm) => ({
      ...prevForm,
      'fromDate':selectedRange[0],
      'toDate':selectedRange[1]
    }));
  };

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
          "listOfGroups":response?.reports?.hrDetails?.getAllGroups,
          "statuses":{
            "approverStatusList":response?.reports?.hrDetails?.getEnums?.approverStatusEnums,
            "cashadvanceStatusList":response?.reports?.hrDetails?.getEnums?.cashAdvanceStatusEnum,
            "expenseHeaderStatusList":response?.reports?.hrDetails?.getEnums?.expenseHeaderStatusEnums,
            "tripStatusList":response?.reports?.hrDetails?.getEnums?.tripStatusEnum
          },
          "departments": response?.reports?.hrDetails?.getAllDepartments || []
        }
      }))
      setExportData(flattenTripData(response?.reports?.trips || []));
      console.log('Report Data', response);
      setIsLoading(false);  
    } catch (error) {
      setLoadingErrorMsg(error.message);
      // setTimeout(() => {
      //   setIsLoading(false);
      //   setLoadingErrorMsg(null);
      // }, 3000);
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
        // setShowPopup(true)
        // setMessage(message);
        window.parent.postMessage({message:"approval message posted" , 
        popupMsgData: { showPopup:true, message:message, iconCode: "102" }}, dashboardBaseUrl);
        setFilterForm((prevForm) => ({
          role: prevForm?.role,
          fromDate:prevForm?.fromDate,
          toDate: prevForm?.toDate
        }));

      } else {
        switch (reportData) {
          case "tripData":
            setExportData(flattenTripData(response?.reports?.trips));
            break;
          
          case "travel expense":
            setExportData(flattedTravelExpenseData(response?.reports?.trips));
            break;
          
          case "non-travel expense":
            setExportData(flattenNonTravelExpenseData(response?.reports?.reimbursement));
            break;
          
          case "cash-advance":
            setExportData(flattedCashadvanceData(response?.reports?.trips));
            break;
          
          default:
            // Handle default case if necessary
            console.warn("Unknown report data type:", reportData);
        }
        setFilterForm((prevForm) => ({
          ...prevForm,
          role: prevForm?.role,
          fromDate:prevForm?.fromDate,
          toDate: prevForm?.toDate
        }));

        setReportData((prev) => ({
          ...prev,
          [dataMap[reportTab]]: newData,
        }));
        
      }
    };
    
    // Set the report data based on the current reportTab
    setDataByReportTab(reportTab, response);
    setFilterForm((prevForm) => ({
      ...prevForm,
      fromDate:prevForm?.fromDate,
      toDate: prevForm?.toDate
    }));

    // setTimeout(()=>{
    //   setShowPopup(false)
    //   setMessage(null)
    // },3000)
    setShowModal(false)

    console.log('Report Data Set:', response);

    // Stop the loading state once the data is set
    setIsUploading((prev) => ({ ...prev, filterReport: false, }));
    setShowModal(false)
  } catch (error) {
    // setShowPopup(true)
    // setMessage(error.message)
    window.parent.postMessage({message:"approval message posted" , 
    popupMsgData: { showPopup:true, message:error?.message, iconCode: "102" }}, dashboardBaseUrl);
    setTimeout(() => {setIsUploading((prev) => ({ ...prev, filterReport: false }));},3000);
  }

};



const generatePDF = (data) => {
  const doc = new jsPDF({ orientation: "landscape" }); // Set to landscape

  // Extract keys from the first object as table headers
  const headers = Object.keys(data[0]);

  // Map data into array of arrays (rows)
  const tableData = data.map((obj) => headers.map((key) => obj[key]));

  // Generate the table with no wrapping for content
  doc.autoTable({
    head: [headers],
    body: tableData,
    theme: "grid", // Optional: can be 'plain', 'striped', or 'grid'
    startY: 20, // Start below the title
    styles: {
      whiteSpace: "nowrap",
       // Ensure no text wrapping
    },
    headStyles: {
      fillColor: [22, 160, 133], // Header color (optional)
      textColor: [255, 255, 255], // Header text color (optional)
    },
    didDrawPage: function (data) {
      // Optional: Add a title or other custom elements to each page
      doc.setFontSize(14);
      doc.text("Report", 14, 10);
    },
    margin: { top: 20 },
    pageBreak: 'auto', // Handles page breaks
  });

  // Save the PDF
  doc.save("report.pdf");
};

// download file
const handleDownloadfile=(file,data)=>{
  const fileName  = `${reportTab}_report ${formatDate(reportDate?.fromDate)} - ${formatDate(reportDate?.toDate)}`
  if(file === 'PDF'){
    //handleCSVDownload(json.employees)
    generatePDF(data)
  }else if (file === 'CSV'){
    handleCSVDownload(data,fileName)
  }
}

console.log(' data', exportData)

const tripData = flattenTripData(reportData?.tripData)
const cashadvanceData = flattedCashadvanceData(reportData?.cashadvanceData,'cashAdvances')
const travelExpenseData = flattedTravelExpenseData(reportData?.travelExpenseData)
console.log('export data', exportData,cashadvanceData)

console.log('flatted reports',travelExpenseData)


useEffect(()=>{
  setIsLoading(true)
 
  fetchData("myView");
  
},[])
return (
  <>
<div className='flex overflow-auto h-screen scrollbar-hide'>
    <div className='  '>
        <Sidebar fetchData={(tab)=>fetchData(tab)} setFilterForm={setFilterForm} employeeRoles={reportData?.employeeRoles} activeView={activeView} setActiveView={setActiveView} setReportTab={setReportTab} handleReportTab={handleReportTab} reportTab={reportTab} />
    </div>  
{isLoading ? <Error message={loadingErrorMsg}/>:
<div className=' flex flex-col w-screen'>

  <div className=' mx-4 px-4 py-2 border-slate-300 border  bg-gray-200/10 rounded-md text-neutral-700 flex flex-row justify-between items-center h-[48px]'>
    <div className='flex  items-center gap-2 font-inter text-base'>
      <img src={tabIcon(reportTab)} className='w-4 h-4'/>
      <h1 className='font-sm capitalize  text-neutral-900'>{reportTab}</h1>
    </div>

  <div className='flex gap-2 font-inter capitalize items-center bg-gray-200/50 rounded-md 0 px-2 py-1 '>
    {/* <img src={filter_icon} className='w-4 h-4'/> */}
      <p className='text-neutral-800 text-sm '>{`start date : ${formatDate(reportDate?.fromDate)} - ${formatDate(reportDate?.toDate)}`}</p> 
      <div className='cursor-pointer' onClick={()=>{setShowModal(!showModal);handlePresetChange(datePresets[0].label)}}>
        <p className='text-sm text-neutral-900 font-semibold'>Customize</p>
      </div> 
  </div> 

      <IconOption 
        buttonText={
          <div className='inline-flex justify-center items-center gap-2'>
          <img src={export_icon} className='w-4 h-4 -rotate-90'/>
          <div className='cursor-pointer'>
            <p className='text-sm font-semibold font-inter text-neutral-900'>Export As</p>
          </div>
          <img src={down_arrow_icon} className='w-4 h-4 '/>
          </div>
        }
      >
        {
          // {name:'PDF',icon:pdf_icon},
          [ {name:'CSV',icon:csv_icon }].map((ele)=>(
            <div onClick={()=>handleDownloadfile(ele.name,exportData)} key={ele.name}  className='flex items-center gap-2 px-2 py-2 hover:bg-slate-100 rounded-md cursor-pointer'>
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
    <CashChart activeView={activeView} data={[...reportData?.cashadvanceData]}/>
  </div> 
  <CashReport toggleModal={toggleModal} visibleHeaders={visibleHeaders} data={cashadvanceData}/>
</>} 

{reportTab === "travel expense" && 
<>
<div className='flex items-center justify-center'>  
  <ExpenseChart activeView={activeView} data={[...reportData?.travelExpenseData]}/>
</div> 
 <ExpenseReport toggleModal={toggleModal} visibleHeaders={visibleHeaders} expenseData={travelExpenseData}/>
</>} 


{reportTab === "non-travel expense" && 
<> 
<div className='flex items-center justify-center'>  
  <NonTravelExpenseChart activeView={activeView} data={[...reportData?.nonTravelExpenseData]}/>
</div> 
 <ReimbursementReport toggleModal={toggleModal} visibleHeaders={visibleHeaders} data={reportData?.nonTravelExpenseData}/>
</>} 


  <Modal showModal={showModal} setShowModal={setShowModal} skipable={true}>  
    <div className='h-full'>
      <div className='sticky top-0 z-10 flex gap-2 justify-between items-center bg-gray-100 w-auto  p-4'>
            <div className='flex gap-2'>
              {/* <img src={info_icon} className='w-5 h-5' alt="Info icon"/> */}
              <p className='font-inter capitalize text-base font-semibold text-neutral-900'>
              {`${reportTab}s Report`}
              </p>
            </div>
            <div onClick={() => {setShowModal(false),setFilterForm((prevForm) => ({
          role: prevForm?.role,
          fromDate:prevForm?.fromDate,
          toDate: prevForm?.toDate
        }))}} className='bg-red-100 cursor-pointer rounded-full border border-white'>
              <img src={cancel_icon} className='w-5 h-5' alt="Cancel icon"/>
            </div>
          </div>
    <div className='px-4 py-2'>
    <div className='h-[48px]  flex-row  px-5 flex justify-between items-center border-b w-full'>
      <div className='flex flex-row space-x-4'>
      <div className={` ${modalTab === "filterTab" ? ' border-neutral-900 text-neutral-900 ' : 'border-white text-neutral-700'}  border-b-2 hover:bg-gray-200/10 px-2 py-1   flex items-center gap-2 cursor-pointer`} onClick={()=>handleModalTab("filterTab")}> 
      <img src={filter_icon} className='w-4 h-5'/>
        <h1 className='text-start  text-inter text-base font-cabin '>
          Filters
        </h1>
      </div>
      <div className={`${modalTab === "columnTab" ? '  border-neutral-900 text-neutral-900' : ' border-white text-neutral-900'}  border-b-2 hover:bg-gray-200/10 px-2 py-1   flex items-center gap-2 cursor-pointer`}  onClick={()=>handleModalTab("columnTab")}> 
      <img src={show_coloum_icon} className='w-4 h-4'/>
        <h1 className='text-start whitespace-nowrap truncate  text-inter text-sm font-inter '>
          Show/Hide Column
        </h1>
      </div>
      </div>
    <h1 className='text-sm text-neutral-900 font-semibold font-inter'>Reset Filters</h1>
    </div>

    {modalTab === "filterTab" &&

    <div className=''>
     <div className='flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4'>
  <div className='lg:w-fit w-full'>
    <Select
    
      options={datePresets.map(preset => preset.label)}
      title="Custom"
      onSelect={(value)=>{handlePresetChange(value)}}
    />
  </div>

  <div className='flex flex-col md:flex-row lg:items-center gap-2 lg:gap-4 w-full lg:w-auto'>
    <div className='lg:w-fit w-full'>
      <Input
        title="From"
        type="date"
        value={formatDateToYYYYMMDD(filterForm?.fromDate)}
        onChange={(value) => handleFilterForm('fromDate', value)}
      />
    </div>

    <div className='lg:w-fit w-full md:w-[200px]'>
      <Input
        title="Till"
        type="date"
        value={formatDateToYYYYMMDD(filterForm?.toDate)}
        onChange={(value) => handleFilterForm('toDate', value)}
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
      {["myTeamView","financeView"].includes(activeView) &&(reportData?.employeeRoles.employeeManager || reportData?.employeeRoles.finance || reportData?.employeeRoles.businessAdmin || reportData?.employeeRoles.superAdmin) && (
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
        currentOption={ filterForm?.travelType}
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
      
      <div className='w-full'>
       <MultiSelect
       onSelect={(value)=>handleFilterForm('getGroups',value)}
       placeholder={'Select group'}
       title={('groups')} 
       options={reportData?.filterData?.listOfGroups|| []}/>
     </div>


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

     {(["myTeamView","financeView"].includes(activeView) && reportData?.employeeRoles?.superAdmin) && 
    <div className='w-full'>
    <MultiSelect 
    onSelect={(value)=>handleFilterForm('getDepartments',value)} 
    placeholder={'i.e. Finance'}  
    title={('Select Departments')} 
    options={reportData?.filterData?.departments || []}/>
  </div>
      }
      </div>}

    

    {modalTab === "columnTab" && 
      
        <div className="bg-white p-4 rounded text-neutral-700 font-cabin">
          <div className="flex gap-2">
            <div className="w-1/2 p-2 border border-slate-300">
              <h3 className="mb-2 text-neutral-900 font-base ">Hidden Headers</h3>
              <div className='h-[200px] overflow-y-auto'>
              {hiddenHeaders.map((header, index) => (
        <div key={index} className="flex gap-2 items-center capitalize px-2 py-1">
          <div
            onClick={() => showHeader(header)}
            className="bg-slate-300 cursor-pointer text-base font-inter text-white h-6 w-6 flex items-center justify-center rounded-full focus:outline-none"
            aria-label={`Hide ${header}`}
          >
            <img src={add_icon} className='w-4 h-4' />
          </div>
          <p>{header}</p>
        </div>
      ))}
            </div>
            </div>
            <div className="w-1/2 p-2 capitalize font-inter text-base border border-slate-300">
              <h3 className="mb-2 text-base text-neutral-900">Visible Headers</h3>
              <div className='h-[200px] overflow-y-auto'>
              {visibleHeaders.map((header, index) => (
                <div key={index} className="flex items-center gap-2 px-2 py-1">
                  <div
            onClick={() => hideHeader(header)}
            className="bg-slate-300 cursor-pointer font-inter text-base  h-6 w-6 flex items-center justify-center rounded-full focus:outline-none"
            aria-label={`Hide ${header}`}
          > <img src={remove_icon} className='w-4 h-4' />  
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
        <Button1 loading={isUploading.filterReport} text="Run Report" onClick={handleRunReport}/>
      </div>
      </div>
    
  
    </div>
  </Modal>
</div>}

</div>
{/* <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/> */}
</>
  )

}

export default Menu

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
      {validAllocationFlags.includes(travelAllocationFlag)  &&
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
