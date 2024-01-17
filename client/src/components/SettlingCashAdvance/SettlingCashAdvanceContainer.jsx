import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { arrowLeft } from "../../assets/icon.jsx";
import axios from "axios";
import {
  updateSettlementColumn,
  notUpdateSettlementColumn,
 
} from "../../redux/apiCalls.js";
import { useDispatch, useSelector } from "react-redux";

// const employeeData = [
//   {
//     name: "Employee1",
//     amount: 200,
//     currency: "$",
//     settlementMode: "Cash",
//   },
//   {
//     name: "Employee2",
//     amount: 500,
//     currency: "$",
//     settlementMode: "Cheque",
//   },
//   {
//     name: "Employee3",
//     amount: 5400,
//     currency: "Rs",
//     settlementMode: "Cash",
//   },
// ];

const SettlingCashAdvanceContainer = () => {
  // const [checkedValues, setCheckedValues] = useState([]);
  // console.log("LINE AT 30" , checkedValues);
  const [dummyValues , setDummyValues] = useState([])
  const dispatch = useDispatch();
  useEffect(() => {
    const getdummyCashAdvanceData = async () => {
      try {
        const data = await axios.get(
          "http://localhost:3000/api/cashAdvance/find"
        );
        setDummyValues(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getdummyCashAdvanceData();
    

  
  }, []);
  useEffect(() => {
    const postFullFinanceData = async () => {
      try {
        await axios.post(
        "http://localhost:3000/api/finance/post" , {dummyData:dummyValues}
       );
       console.log("LINE AT 60 'done'");
      
    } catch (error) {
      console.log(error);
    }
  };
  postFullFinanceData();

  
  }, );

  // console.log( "LINE AT 55" , dummyValues);
  const id = { ...dummyValues[0] }?._id;

  // const name = dummyValues[0]?.createdBy.name;
  // const amount = {...dummyValues[0]?.amountDetails}[0]?.amount;
  // const mode = {...dummyValues[0]?.amountDetails}[0]?.mode;
  // const employeeData = [{name , amount , mode}]

  // const updateSettlementColumn = async ()=>{
  // const data = {_id:id} ;
  //   try {
  //     await axios.put("http://localhost:3000/api/cashAdvance/settlement" , data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //  };
  //  const notUpdateSettlementColumn = async ()=>{
  //   const data = {_id:id} ;
  //   console.log("LINE AT 68" , data);
  //   try {
  //     await axios.put("http://localhost:3000/api/cashAdvance/unSettlement" , data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //  };

  
  const { isFetching } = useSelector((state) => state?.update);

  const fullDummyData = useSelector((state) => state?.update);
   console.log(fullDummyData.update);
  //  console.log(fullDummyData.update?.actionedUpon);

  const handleChange = (e) => {
    // const empData = e.target.value;
    const isSelected = e.target.checked;
    if (isSelected) {
      // setCheckedValues([...checkedValues, empData]);
      updateSettlementColumn(dispatch, id, "cashAdvance");
    } else {
      notUpdateSettlementColumn(dispatch, id, "cashAdvance");
      // setCheckedValues((prevData) => {
      //   return prevData.filter((empName) => {
      //     return empName !== empData;
      //   });
      // });
    }

    // console.log("LINE AT 107",  checkedValues);
  };

  return (
    <div className="flex space-x-4 ">
      {isFetching && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <div className="border-[1px] border-solid border-gainsboro-200 rounded-2xl box-border w-[912px] h-[422px]">
        <div className="m-8">
          <div className="flex justify-center space-x-2 bg-eb-primary-blue-50 text-eb-primary-blue-500 p-1 rounded-xl w-[100px] cursor-pointer my-2">
            <img
              className=" w-4 h-4 bg-eb-primary-blue-500 rounded-lg "
              alt=""
              src={arrowLeft}
            />
            <div>Dashboard</div>
          </div>
          <div className="text-base">Settling Cash Advance</div>
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
            {dummyValues.map((employee, index) => ( 
              //AS PER REQUIREMENT
              //fullDummyData.update?.actionedUpon &&
              <tr
                key={index}
                className="w-[800px] h-[70px] border-b border-solid border-gainsboro-200"
              >
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    id={`${employee.name}`}
                    value={`${employee.name}`}
                    className="mx-auto"
                    onChange={handleChange}
                    // checked={checkedValues.includes(employee.name)}
                  />
                </td>
                <td className="p-4 text-center">
                  {dummyValues[index]?.createdBy.name}
                </td>
                <td className="p-4 text-center">
                  {{ ...dummyValues[index]?.amountDetails }[0]?.amount}
                </td>
                <td className="p-4 text-center">{employee.currency}</td>
                <td className="p-4 text-center">
                  {{ ...dummyValues[index]?.amountDetails }[0]?.mode}
                </td>
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
            {/* {fullDummyData.update?.settlementFlag &&
            (checkedValues.map((employee, index) => (
              <tr
                key={index}
                className="w-[120px] h-[70px] border-b border-solid border-gainsboro-200"
              >
                <td className="p-2 text-center"></td>
                <td className="p-4 text-center">{employee}</td>
              </tr>
            )))} */}

            {fullDummyData.update?.settlementFlag && (
              <tr className="w-[120px] h-[70px] border-b border-solid border-gainsboro-200">
                <td className="p-2 text-center"></td>
                <td className="p-4 text-center">
                  {fullDummyData.update?.createdBy?.name}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettlingCashAdvanceContainer;
