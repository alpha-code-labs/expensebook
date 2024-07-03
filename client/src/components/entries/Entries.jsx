import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTravelAndNonTravelExpenseData_API } from '../../utils/api';
import { toast } from 'react-toastify';
import SlimDate from '../common/SlimDate';

const Entries = ({ employeeRole }) => {
  const [isUploading, setIsUploading] = useState({ set: false, id: null });
  const [isChecked, setIsChecked] = useState(false);
  const [assignedEmployeeName, setAssignedEmployeeName] = useState(null);
  const [formData, setFormData] = useState({ fromDate: '', toDate: '' });
  const [selectedReportType, setSelectedReportType] = useState('expenseReports');

  const { tenantId } = useParams();
  console.log('employeeRole from Accounting entries', employeeRole);

  const handleCashAdvance = async () => {
    const data = {
      filterBy: selectedReportType,
      date: null,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
    };
    try {
      setIsUploading((prevState) => ({ ...prevState, set: true, id: tenantId }));
      const response = await getTravelAndNonTravelExpenseData_API(
        tenantId,
        data
      );
      setAssignedEmployeeName(employeeRole?.name);
      console.log('admin response', response);
      setIsUploading((prevState) => ({ ...prevState, set: false, id: null }));
      if (isChecked) {
        setAssignedEmployeeName(null);
      }
      if (response) {
        toast.success('Non Travel Expense paid and distributed');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
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
    <div className="flex flex-row items-center justify-between min-h-[56px] rounded-xl border-[1px] border-b-gray hover:border-indigo-600 shadow-md">
      <div className="flex h-[52px] items-center justify-start w-[221px] py-3 px-2">
      <select
          className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedReportType}
          title='Expense Report'
          onChange={handleReportTypeChange}
        >
          <option value="expenseReports">Expense Reports</option>
          <option value="nonTravelExpenseReports">Non Travel Expense Reports</option>
        </select>
        <div className='px-2 py-4'>
        <SlimDate
          format="date-month"
          date={formData.fromDate}
          onChange={(e) => handleDateChange(e.target.value, 'fromDate')}
          title="From-Date"
        />
        </div>
        <div className='px-2 py-4'>
        <SlimDate
          format="date-month"
          date={formData.toDate}
          onChange={(e) => handleDateChange(e.target.value, 'toDate')}
          title="To-Date"
        />
        </div>
        <div className='px-4 py-2 '>
        <button
          className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
          onClick={handleCashAdvance}
        >
          Generate Report
        </button>
        </div>
        
      </div>
      </div>
  );
};

export default Entries;
