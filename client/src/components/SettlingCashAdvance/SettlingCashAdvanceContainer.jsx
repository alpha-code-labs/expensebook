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
]
const SettlingCashAdvanceContainer = () => {
  return (
    <div className="border-[1px] border-solid border-gainsboro-200 rounded-2xl box-border w-[912px] h-[422px]">
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
              <td className="p-4 text-center">{employee.amount}</td>
              <td className="p-4 text-center">{employee.currency}</td>
              <td className="p-4 text-center">{employee.settlementMode}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SettlingCashAdvanceContainer;
