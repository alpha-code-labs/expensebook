import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { arrowLeft } from "../../assets/icon.jsx";
import axios from 'axios';


const employeeData = [
  {
    name: "Employee1",
    amount: 200,
    currency: "$",
    settlementMode: "Cash",
  },
  {
    name: "Employee2",
    amount: 500,
    currency: "$",
    settlementMode: "Cheque",
  },
  {
    name: "Employee3",
    amount: 5400,
    currency: "Rs",
    settlementMode: "Cash",
  },
];

const SettlingNonTravelExpenseContainer = () => {
  const [dummyValues, setDummyValues] = useState([]);

  useEffect(()=>{
    const getdummytravelExpenseData = async ()=>{
      try {
        const data = await axios.get("http://localhost:3000/api/travelExpense/find");
        setDummyValues(data.data);
        
      } catch (error) {
        console.log(error);
      }
    }
     getdummytravelExpenseData();
  } , []);
  console.log(dummyValues);
  const [checkedValues, setCheckedValues] = useState([]);
  // console.log(checkedValues);

  const handleChange = (e) => {
    const empData = e.target.value;
    const isSelected = e.target.checked;
    if (isSelected) {
      setCheckedValues([...checkedValues, empData]);
    } else {
      setCheckedValues((prevData) => {
        return prevData.filter((empName) => {
          return empName !== empData;
        });
      });
    }

    // console.log(checkedValues);
  };
  const [wait  , setWait] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setWait(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
    return (
      <div className="flex space-x-4 ">
        {wait && <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      
    >
      <CircularProgress color="inherit" />
    </Backdrop>}
      <div className="border-[1px] border-solid border-gainsboro-200 rounded-2xl box-border w-[912px] h-[422px]">
        <div className="m-8">
        <div className="flex justify-center space-x-2 bg-eb-primary-blue-50 text-eb-primary-blue-500 p-1 rounded-xl w-[100px] cursor-pointer my-2">
            <img className=" w-4 h-4 bg-eb-primary-blue-500 rounded-lg " alt="" src={arrowLeft} />
            <div>Dashboard</div>
          </div>
          <p className="text-base">Settling Non Travel Expense</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-solid border-gainsboro-200">
              <th className="p-2"></th>
              <th className="p-4 text-lg text-center">Name of Employee</th>
              <th className="p-4 text-lg text-center">Amount</th>
              <th className="p-4 text-lg text-center">Currency Requested</th>
              <th className="p-4 text-lg text-center">Mode of Settlement</th>
              <th className="p-4 text-lg text-center"></th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((employee, index) => (
              <tr
                key={index}
                className="w-[800px] h-[70px] border-b border-solid border-gainsboro-200"
              >
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    name={`employee${index + 1}`}
                    id={`employee${index + 1}`}
                    value={employee.name}
                    className="mx-auto"
                    onChange={handleChange}
                    checked={checkedValues.includes(employee.name)}
                  />
                </td>
                <td className="p-4 text-center">{employee.name}</td>
                <td className="p-4 text-center">{employee.amount}</td>
                <td className="p-4 text-center">{employee.currency}</td>
                <td className="p-4 text-center">{employee.settlementMode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Settled Employee */}
      <div className="border-[1px] border-solid border-gainsboro-200 rounded-2xl box-border w-[150px] h-[422px] bg-dimgray">
        <div className="m-4">
          <p className="text-base">Settled Employee</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-solid border-gainsboro-200">
              <th className="p-2"></th>
              <th className="p-4 text-lg text-center">Name of Employee</th>
              <th className="p-4 text-lg text-center"></th>
            </tr>
          </thead>
          <tbody>
            {checkedValues.map((employee, index) => (
              <tr
                key={index}
                className="w-[120px] h-[70px] border-b border-solid border-gainsboro-200"
              >
                <td className="p-2 text-center">
                 
                </td>
                <td className="p-4 text-center">{employee}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>  
    );
  };
  
  export default SettlingNonTravelExpenseContainer;
  



//   <div className="absolute top-[67px] left-[44px] flex flex-row items-center justify-start gap-[24px] text-justify text-xs text-ebgrey-400">
//   <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
//     <div className="relative">Search by category</div>
//   </div>
//   <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
//     <div className="relative">Search by Employee Name</div>
//   </div>
//   <div className="flex flex-row items-center justify-start gap-[8px] text-left text-darkslategray">
//     <div className="relative font-medium">Select Month</div>
//     <div className="relative w-[133px] h-8 text-sm text-black">
//       <div className="absolute top-[0px] left-[0px] rounded-md bg-white box-border w-[93px] h-8 border-[1px] border-solid border-ebgrey-200">
//         <div className="absolute top-[4px] left-[calc(50%_-_27.5px)] flex flex-row items-center justify-start gap-[8px]">
//           <div className="flex flex-row items-center justify-center">
//             <div className="flex flex-row items-center justify-center">
//               <div className="relative">Aug</div>
//             </div>
//           </div>
//           <img
//             className="relative w-6 h-6 overflow-hidden shrink-0"
//             alt=""
//             src={chevronDown}
//           />
//         </div>
//       </div>
//     </div>
//   </div>
// </div>