const RecoveringPaidandCanceledCashAdvanceContainer = () => {
  const employeeData = [
    {
      name: "Employee1",
      amount: 200,
      currency: "$",
      settlementMode: "Cash",
      recovered: "Yes",
    },
    {
      name: "Employee2",
      amount: 500,
      currency: "$",
      settlementMode: "Cheque",
      recovered: "No",
    },
    {
      name: "Employee3",
      amount: 5400,
      currency: "Rs",
      settlementMode: "Cash",
      recovered: "No",
    },
  ];

  return (
    <div className="border-[1px] border-solid border-gainsboro-200 rounded-2xl box-border w-[912px] h-[422px] overflow-auto">
      <div className="m-8 text-base">Recovering paid and cancelled cash advance</div>
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
              <td className="p-2 text-center">
                <button className="bg-green-500 text-black rounded-full py-2 px-4 bg-green-700 ">
                  Recovered
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecoveringPaidandCanceledCashAdvanceContainer;

{
  /* <div className="absolute top-[67px] left-[36px] flex flex-row items-center justify-start gap-[24px] text-justify text-xs text-ebgrey-400">
        <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
          <div className="relative">Search Trip Name</div>
        </div>
        <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
          <div className="relative">Search by destination</div>
        </div>
        <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
          <div className="relative">Search by employee name</div>
        </div>
      </div> */
}
