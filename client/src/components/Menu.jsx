import React, { useEffect, useState } from 'react'
import { aeroplane1_icon, csv_icon, down_arrow_icon, export_icon, filter_icon, pdf_icon, reciept_icon, show_coloum_icon } from '../assets'
import Modal from './common/Modal';
import Input from './common/Input';
import Select from './common/Select';
import Search from './common/Search';
import { employees, travelRequestStatus, travelType } from '../data/userData';
import MultiSearch from '../components/common/MultiSearch';
import Button from './common/Button';
import TripReport from '../report/TripReport';
import ExpenseReport from '../report/ExpenseReport';
import { formatDate, formatFullDate ,formatDateToYYYYMMDD,handleCSVDownload} from '../utils/handyFunctions';
import TripChart from './chart/TripChart';
import { requiredCashAdvanceData, requiredExpenseData, requiredTripData } from '../data/tripData';
import Error from './common/Error';
import Sidebar from './common/Sidebar';
import { getReportDataAPI } from '../utils/api';
import IconOption from '../components/common/IconOption'
import ExpenseChart from './chart/ExpenseChart';
import CashChart from './chart/CashChart';
import CashReport from '../report/CashReport';
import ReimbursementReport from '../report/ReimbursementReport';
import {reimbursementHeaders, cashAdvanceHeaders, travelExpenseHeaders, tripHeaders} from '../data/miscellaneousData'



const Menu = () => {
  const employeeRoles ={
    "employee": true,
    "employeeManager": true,
    "finance": true,
    "businessAdmin": true,
    "superAdmin": false
}
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
  const [reportingData , setReportingData]=useState(null);
  const [tripData,setTripData]=useState([]);
  const [isLoading , setIsLoading]=useState(true);
  const [loadingErrorMsg, setLoadingErrorMsg]=useState(null);
  const [reportTab , setReportTab]= useState("trip");
  const [showModal , setShowModal]=useState(false);
  const [modalTab , setModalTab]=useState("filterTab");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filterForm , setFilterForm]= useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
      'startDate':new Date(),
      'endDate':new Date()
    }));
  },[])

 


  const handleReportTab = (tab) => {
    setReportTab(tab);

    switch (tab) {
      case "trip":
        setVisibleHeaders(tripHeaders);
        break;
      case "expense":
        setVisibleHeaders(travelExpenseHeaders);
        break;
      case "cash-advance":
        setVisibleHeaders(cashAdvanceHeaders);
        break;
      case "reimbursement":
        setVisibleHeaders(reimbursementHeaders);
        break;
      default:
        setVisibleHeaders(tripHeaders);
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
      'startDate':selectedRange[0],
      'endDate':selectedRange[1]
    }));
  };

  console.log('end date', endDate)

  
  const handleFilterForm = (key, value) => {
    if(key === 'startDate'|| key === 'endDate'){
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
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getReportDataAPI('660a58ac1a308ce97b32213f', '1001');
      // setReportingData(response)

      console.log('trip data fetched successfully', response?.reportingViews?.employee?.trips);
      setTripData(response?.reportingViews?.employee?.trips)
      setIsLoading(false);  
    } catch (error) {
      setLoadingErrorMsg(error.message);
      setTimeout(() => {
        setIsLoading(false);
        setLoadingErrorMsg(null);
      }, 3000);
    } 
  };

//for generate customize report


const handleRunReport =()=>{
  console.log(filterForm)
}


useEffect(()=>{
  setReportingData(requiredTripData)
  setIsLoading(false)

  setTimeout(()=>{
    setLoadingErrorMsg('Something went wrong')
    setIsLoading(false)
    },3000)

  fetchData();

},[])
  

// download file

const handleDownloadfile=(file)=>{
  if(file === 'PDF'){
    //handleCSVDownload(json.employees)
  }else if (file === 'CSV'){
    handleCSVDownload(requiredTripData)
  }
}

  return (
<div className='flex'>

    <div className='w-[20%]'>
        <Sidebar activeView={activeView} setActiveView={setActiveView} handleReportTab={handleReportTab} reportTab={reportTab} />
    </div>  
{isLoading && <Error message={loadingErrorMsg}/>}
{!isLoading &&
<div className='w-[80%] h-screen over overflow-y-auto'>
      

  <div className='mx-4 px-4 py-2 bg-indigo-200 rounded-md text-neutral-700 flex flex-row justify-between items-center h-[48px]'>
  
    <div className='flex items-center gap-2 font-cabin  text-base '>
      <img src={aeroplane1_icon} className='w-4 h-4'/>
      <h1 className='capitalize font-semibold text-indigo-600'>{reportTab}</h1>
    </div>

  <div className='flex gap-2 capitalize items-center'>
    <img src={filter_icon} className='w-4 h-4'/>
      <p className='text-neutral-800 font-semibold'>{`start date : ${formatDate(filterForm.startDate)} - ${formatDate(filterForm.endDate)}`}</p> 
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
  <TripChart data={tripData}/>
</div> 
<TripReport toggleModal={toggleModal} tripData={tripData} visibleHeaders={visibleHeaders}/>
</>} 


{reportTab === "cash-advance" && 

<>
  <div className='flex items-center justify-center'>  
    <CashChart data={requiredExpenseData}/>
  </div> 

  <CashReport toggleModal={toggleModal} visibleHeaders={visibleHeaders} data={requiredCashAdvanceData}/>
</>} 

{reportTab === "expense" && 
<>

<div className='flex items-center justify-center'>  
  <ExpenseChart data={requiredExpenseData}/>
</div> 

 <ExpenseReport toggleModal={toggleModal} visibleHeaders={visibleHeaders} expenseData={requiredExpenseData}/>
</>} 
{reportTab === "reimbursement" && 
<>
<div className='flex items-center justify-center'>  
  <ExpenseChart data={requiredExpenseData}/>
</div> 

 <ReimbursementReport toggleModal={toggleModal} visibleHeaders={visibleHeaders} data={requiredExpenseData}/>
</>} 


  <Modal showModal={showModal} setShowModal={setShowModal} skipable={true}>  
    < >
    <div className='h-[48px] rounded-t-lg   bg-purple-100 px-5 flex justify-start items-center'>
        <h1 className='text-start text-inter text-lg font-semibold text-purple-500 capitalize'>{`${reportTab}s Report`}</h1>
    </div>
    <div className='px-4 py-2'>
    <div className='h-[48px]  flex-row rounded-t-lg px-5 flex justify-between items-center border-b w-full'>
      <div className='flex flex-row space-x-4'>
      <div className={` ${modalTab === "filterTab" ? 'bg-indigo-300 ' : ''} px-2 py-1 rounded-lg  flex items-center gap-2 cursor-pointer`} onClick={()=>handleModalTab("filterTab")}> 
      <img src={filter_icon} className='w-4 h-4'/>
        <h1 className='text-start text-neutral-700 text-inter text-base font-cabin '>
          Filters
        </h1>
      </div>
      <div className={`${modalTab === "columnTab" ? 'bg-indigo-300' : ''} px-2 py-1 rounded-lg  flex items-center gap-2 cursor-pointer`}  onClick={()=>handleModalTab("columnTab")}> 
      <img src={show_coloum_icon} className='w-4 h-4'/>
        <h1 className='text-start text-neutral-700 text-inter text-base font-cabin '>
          Show/Hide Column
        </h1>
      </div>
      </div>
    <h1 className='text-start text-inter text-base font-cabin font-semibold text-purple-500 '>Reset Filters</h1>
    </div>

    {modalTab === "filterTab" &&
    <div>
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
          value={formatDateToYYYYMMDD(startDate)}
          onChange={(value)=>handleFilterForm('startDate',value)}
        />
      </div>
    <div className='w-[200px]'>
      <Input
        title="Till"
        type="date"
        value={formatDateToYYYYMMDD(endDate)}
        onChange={(value)=>handleFilterForm('endDate',value)}
        // min={startDate}
      />
    </div>
    </div>
    </div>
      <div className='w-full'>
        <Select 
        title="Trip Status" 
        options={travelRequestStatus}
        onSelect={(value)=>handleFilterForm('status',value)}/>
      </div>

      <div className='w-full'>
      <MultiSearch
        options={employees}
        // currentOption={selectedOptions}
        onSelect={(value)=>handleFilterForm('employees',value)}
        title="Search Employees"
        placeholder="Start typing employee name..."
        // error={{ set: true, message: "Please select at least one employee." }}
      />
      </div>
      <div className='w-full'>
        <Select 
        options={travelType}
        onSelect={value=>handleFilterForm('travelType',value)}
        title="Type of Trip"/>
      </div>
      </div>}



    {modalTab === "columnTab" && 
      
        <div className="bg-white p-4 rounded text-neutral-700 font-cabin">
          <div className="flex ">
            <div className="w-1/2 p-2">
              <h3 className="mb-2 font-semibold ">Hidden Headers</h3>
              <div className='h-[200px] overflow-y-auto'>
              {hiddenHeaders.map((header, index) => (
                <div key={index} className="flex items-center mb-2 capitalize">
                  <button onClick={() => showHeader(header)} className="mr-2 bg-green-500  text-white px-2 py-1 rounded">+</button>
                  {header}
                </div>
              ))}
            </div>
            </div>
            <div className="w-1/2 p-2 capitalize font-cabin text-base">
              <h3 className="mb-2 font-semibold">Visible Headers</h3>
              <div className='h-[200px] overflow-y-auto'>
              {visibleHeaders.map((header, index) => (
                <div key={index} className="flex items-center mb-2 ">
                  <button onClick={() => hideHeader(header)} className="mr-2 bg-red-500 text-white  px-2 py-1 rounded">-</button>
                  {header}
                </div>
              ))}
              </div>
            </div>
          </div>

        </div>
      }  

      <div className='pt-4'>
        <Button text="Run Report" onClick={handleRunReport}/>
      </div>
      </div>
    
  
    </>
  </Modal>
</div>}

</div>
  )
}

export default Menu
