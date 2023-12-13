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

const SettlingTravelExpenseContainer = () => {
  return(
  
  <div className="border-[1px] border-solid border-gainsboro-200 rounded-2xl box-border w-[912px] h-[500px]">
      <div className="m-8">
        <p className="text-base">Settling Cash Advance</p>
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
                />
              </td>
              <td className="p-4 text-center">{employee.name}</td>
              {index %2 == 0 ? <td className="p-4 text-center text-red">{employee.amount}</td> : <td className="p-4 text-center text-green">{employee.amount}</td>}
              <td className="p-4 text-center">{employee.currency}</td>
              <td className="p-4 text-center">{employee.settlementMode}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
      <div className="m-4">
        <div className="flex justify-start items-center">
        <div className="bg-red box-border w-[10px] h-[10px] border-[1px] border-solid "></div> 
        <p> --{">"} denotes amount to be paid </p>
        </div>
        <div className="flex justify-start items-center">
        <div className="bg-green box-border w-[10px] h-[10px] border-[1px] border-solid "></div> 
        <p> --{">"} denotes amount to be received </p>
        </div>
        <div className="flex justify-end ">
          <div className=" p-5 bg-darkslategray text-white rounded-xl">Go Back</div>
        </div>
      </div>

    </div>
    )
  };
  
 
export default SettlingTravelExpenseContainer;



// <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
//                     <div className="relative">Search Trip Name</div>
//                   </div>
//                   <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
//                     <div className="relative">Search by destination</div>
//                   </div>
//                   <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
//                     <div className="relative">Search by employee name</div>
//                   </div>