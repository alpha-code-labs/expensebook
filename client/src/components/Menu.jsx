import React, { useEffect, useState } from 'react'
import { aeroplane1_icon, filter_icon, reciept_icon, show_coloum_icon } from '../../assets'
import Modal from './common/Modal';
import Input from './common/Input';
import Select from './common/Select';
import Search from './common/Search';
import { employees, travelRequestStatus, travelType } from '../data/userData';
import MultiSearch from '../components/common/MultiSearch';
import Button from './common/Button';
import TripReport from '../report/TripReport';
import { formatDate, formatFullDate } from '../utils/handyFunctions';
import TripChart from './chart/TripChart';
import { requiredTripData } from '../data/tripData';
import Sidebar from './common/Sidebar';



const Menu = () => {
  const [reportTab , setReportTab]= useState();
  const [showModal , setShowModal]=useState(false);
  const [modalTab , setModalTab]=useState()
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filterForm , setFilterForm]= useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

 


  const handleReportTab=(tab)=>{
    setReportTab(tab)
  };

  const formatDateToYYYYMMDD = (dateString) => {
    const date = new Date(dateString); 
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    }else{
    setFilterForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }))}
  };
  
  console.log('filtered form', filterForm)

  const tripTitles= [
    "start date",
    "completion date",
    "trip number",
    "travel type",
    "trip status",
    "created by",
    "approver",
    "trip purpose",
]

const [visibleHeaders, setVisibleHeaders] = useState(tripTitles);
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
  
  return (
<div className='flex'>

    <div className='w-[20%]'>
        <Sidebar handleReportTab={handleReportTab} reportTab={reportTab} />
    </div>  

    <div className='w-[80%] h-screen over overflow-y-auto'>
         

      <div className='mx-4 px-4 py-2 bg-indigo-200 rounded-md text-neutral-700 flex flex-row justify-between items-center h-[48px]'>
      
        <div className='flex items-center gap-2 font-cabin  text-base '>
          <img src={aeroplane1_icon} className='w-4 h-4'/>
          <h1>Trips</h1>
        </div>

      <div className='flex gap-2 capitalize items-center'>
        <img src={filter_icon} className='w-4 h-4'/>
          <p className='text-neutral-800 font-semibold'>{`start date : ${formatDate(filterForm.startDate)} - ${formatDate(filterForm.endDate)}`}</p> 
          <div className='cursor-pointer' onClick={()=>{setShowModal(!showModal);handlePresetChange(presets[0].label)}}>
            <p className='text-base text-indigo-600 font-semibold'>Customize</p>
          </div> 
      </div> 
      </div> 

      
    {reportTab === "trip" && 
    <>
    <div className='flex items-center justify-center'>  
      <TripChart data={requiredTripData}/>
    </div> 
    <TripReport toggleModal={toggleModal} visibleHeaders={visibleHeaders}/>
    </>} 
    {reportTab === "expense" && 
    <>
    <div className='flex items-center justify-center'>  
      <TripChart data={requiredTripData}/>
    </div> 
    <TripReport toggleModal={toggleModal} visibleHeaders={visibleHeaders}/>
    </>} 


    
      <Modal showModal={showModal} setShowModal={setShowModal} skipable={true}>  
        < >
        <div className='h-[48px] rounded-t-lg   bg-purple-100 px-5 flex justify-start items-center'>
                <h1 className='text-start text-inter text-lg font-semibold text-purple-500'>Trips Report</h1>
        </div>
        <div>
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

          <div >
            <Button text="Run Report" onClick={()=>console.log(filterForm)}/>
          </div>
          </div>
        
      
        </>
      </Modal>
    </div>

</div>
  )
}

export default Menu
