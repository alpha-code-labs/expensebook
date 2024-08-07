import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getNonTravelExpenseDataEntries_API, getTravelExpenseDataEntries_API } from '../../utils/api'; // Assume you have a different API function for travel expenses
import { toast } from 'react-toastify';
import SlimDate from '../common/SlimDate';
import TravelExpenseTable from './TravelExpenseTable';

const Entries = ({ employeeRole }) => {
  const [isUploading, setIsUploading] = useState({ set: false, id: null });
  const [isChecked, setIsChecked] = useState(false);
  const [assignedEmployeeName, setAssignedEmployeeName] = useState(null);
  const [formData, setFormData] = useState({ fromDate: '', toDate: '' });
  const [selectedReportType, setSelectedReportType] = useState('expenseReports');
const [nonTravelData, setNonTravelData] = useState(null);
const [travelExpenseData, setTravelExpenseData] = useState([]);

const { tenantId } = useParams();

useEffect(() => {
    setAssignedEmployeeName(employeeRole?.name);
}, [employeeRole]);

const handleCashAdvance = async () => {
    const data = {
    fromDate: formData.fromDate,
    toDate: formData.toDate,
    };

    const employee = {
      empId: employeeRole?.empId,
      name: employeeRole?.name,
    };

    console.log("data from entries", data, employee);
    try {
      setIsUploading((prevState) => ({ ...prevState, set: true, id: tenantId }));
      
      let response;
      if (selectedReportType === 'TravelExpenseReports') {
        response = await getTravelExpenseDataEntries_API(tenantId, employee.empId, data);
        setTravelExpenseData(response.travelExpense);
      } else {
        response = await getNonTravelExpenseDataEntries_API(tenantId, employee.empId, data);
        setNonTravelData(response.nonTravelExpense);
      }
    
      setAssignedEmployeeName(employeeRole?.name);
      console.log('Entries data from server', response);
      setIsUploading((prevState) => ({ ...prevState, set: false, id: null }));
      if (isChecked) {
        setAssignedEmployeeName(null);
      }
      if (response.ok) {
        toast.success('Report generated successfully');
      } else {
        toast.error('Failed to generate report');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setIsUploading((prevState) => ({ ...prevState, set: false, id: null }));
    }
  };

  const handleDateChange = (date, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: date,
    }));
  };

  const handleReportTypeChange = (event) => {
    setSelectedReportType(event.target.value);
  };

  return (
    <>
   <div className="flex flex-col items-center justify-between min-h-[74px] rounded-xl border-[1px] border-b-gray hover:border-indigo-600 shadow-md">
  <div className="flex h-[85px] items-center justify-between w-full py-3 px-2">
    <div className="flex items-center space-x-4">
      <div>
        <label className="px-2 text-zinc-600 text-sm font-cabin">Expense Report</label>
        <select
          className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedReportType}
          onChange={handleReportTypeChange}
        >
          <option value="TravelExpenseReports">Travel Expense Reports</option>
          <option value="nonTravelExpenseReports">Non Travel Expense Reports</option>
        </select>
      </div>
      
      <div className="px-2 py-2">
        <SlimDate
          format="date-month"
          date={formData.fromDate}
          onChange={(e) => handleDateChange(e.target.value, 'fromDate')}
          title="From Date"
        />
      </div>
      
      <div className="px-2 py-2">
        <SlimDate
          format="date-month"
          date={formData.toDate}
          onChange={(e) => handleDateChange(e.target.value, 'toDate')}
          title="To Date"
        />
      </div>
      
      <div className="px-2 py-6">
        <button
          className="bg-indigo-500 text-white px-6 py-1 rounded-md hover:bg-indigo-600"
          onClick={handleCashAdvance}
        >
          Generate Report
        </button>
      </div>
    </div>
  </div>
</div>

    <div className="flex flex-col items-center justify-between min-h-[240px] rounded-xl border-[1px] border-b-gray hover:border-indigo-600 shadow-md">
    {travelExpenseData && (<TravelExpenseTable travelExpense={travelExpenseData}/>
    )}
    {nonTravelData && (<TravelExpenseTable nonTravelExpense={nonTravelData}/>
    )}
    </div>
    </>
  );
};

export default Entries;















// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getNonTravelExpenseDataEntries_API,  getTravelExpenseDataEntries_API, } from '../../utils/api'; // Assume you have a different API function for travel expenses
// import { toast } from 'react-toastify';
// import SlimDate from '../common/SlimDate';

// const Entries = ({ employeeRole }) => {
//   const [isUploading, setIsUploading] = useState({ set: false, id: null });
//   const [isChecked, setIsChecked] = useState(false);
//   const [assignedEmployeeName, setAssignedEmployeeName] = useState(null);
//   const [formData, setFormData] = useState({ fromDate: '', toDate: '' });
//   const [selectedReportType, setSelectedReportType] = useState('expenseReports');
//   const [nonTravelData, setNonTravelData] = useState(null);

//   const { tenantId } = useParams();

//   useEffect(() => {
//     setAssignedEmployeeName(employeeRole?.name);
//   }, [employeeRole]);

//   const handleCashAdvance = async () => {
//     const data = {
//       fromDate: formData.fromDate,
//       toDate: formData.toDate,
//     };

//     const employee = {
//       empId: employeeRole?.empId,
//       name: employeeRole?.name,
//     };

//     console.log("data from entries", data, employee);
//     try {
//       setIsUploading((prevState) => ({ ...prevState, set: true, id: tenantId }));
      
//       let response;
//       if (selectedReportType === 'TravelExpenseReports') {
//         response = await getTravelExpenseDataEntries_API(tenantId, employee.empId, data);
//       } else {
//         response = await getNonTravelExpenseDataEntries_API(tenantId, employee.empId, data);
//       }
    
//       setAssignedEmployeeName(employeeRole?.name);
//       console.log('Entries data from server', response);
//       setIsUploading((prevState) => ({ ...prevState, set: false, id: null }));
//       if (isChecked) {
//         setAssignedEmployeeName(null);
//       }
//       if (response) {
//         toast.success('Report generated and distributed');
//         setNonTravelData(response);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error.message);
//       setIsUploading((prevState) => ({ ...prevState, set: false, id: null }));
//     }
//   };

//   const handleDateChange = (date, field) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [field]: date,
//     }));
//   };

//   const handleReportTypeChange = (event) => {
//     setSelectedReportType(event.target.value);
//   };

//   return (
//     <div className="flex flex-row items-center justify-between min-h-[74px] rounded-xl border-[1px] border-b-gray hover:border-indigo-600 shadow-md">
//       <div className="flex h-[85px] items-center justify-start w-[221px] py-3 px-2">
//         <div>
//           <label className="px-2 text-zinc-600 text-sm font-cabin">Expense Report</label>
//           <select
//             className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             value={selectedReportType}
//             onChange={handleReportTypeChange}
//           >
//             <option value="TravelExpenseReports">Travel Expense Reports</option>
//             <option value="nonTravelExpenseReports">Non Travel Expense Reports</option>
//           </select>
//         </div>

//         <div className='px-2 py-2'>
//           <SlimDate
//             format="date-month"
//             date={formData.fromDate}
//             onChange={(e) => handleDateChange(e.target.value, 'fromDate')}
//             title="From"
//           />
//         </div>
//         <div className='px-2 py-2'>
//           <SlimDate
//             format="date-month"
//             date={formData.toDate}
//             onChange={(e) => handleDateChange(e.target.value, 'toDate')}
//             title="Till"
//           />
//         </div>
//         <div className='px-2 py-2'>
//           <button
//             className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
//             onClick={handleCashAdvance}
//           >
//             Generate Report
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Entries;
