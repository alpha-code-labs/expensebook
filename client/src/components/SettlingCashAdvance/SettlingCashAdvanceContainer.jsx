const SettlingCashAdvanceContainer = () => {
  return (
    <div className="border-[1px] border-solid border-gainsboro-200 rounded-2xl box-border w-[912px] h-[422px]">
      <div className="m-8">
        <p className="text-base">Settling Cash Advance</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-evenly items-center w-[800px] h-[30px] border-b border-solid  border-gainsboro-200 ">
          <div>Name of Employee</div>
          <div>Amount</div>
          <div>Currency Requested</div>
          <div>Mode of Settlement</div>
        </div>
        <div className="flex">
          <input
            type="checkbox"
            name="employee1"
            id="employee1"
            value="Employee1"
          />
          <div
            className="flex justify-evenly
         items-center w-[800px] h-[70px] border-b border-solid  border-gainsboro-200 "
          >
            <label htmlFor="employee1">
              <div>Employee1</div>
            </label>
            <div>200</div>
            <div>$</div>
            <div>Cash</div>
          </div>
        </div>
        <div className="flex">
          <input
            type="checkbox"
            name="employee2"
            id="employee2"
            value="Employee2"
          />
          <div
            className="flex justify-evenly
         items-center w-[800px] h-[70px] border-b border-solid  border-gainsboro-200 "
          >
            <label htmlFor="employee2">
              <div>Employee2</div>
            </label>
            <div>500</div>
            <div>$</div>
            <div>Cheque</div>
          </div>
        </div>
        <div className="flex">
          <input
            type="checkbox"
            name="employee3"
            id="employee3"
            value="Employee3"
          />
          <div
            className="flex justify-evenly
         items-center w-[800px] h-[70px] border-b border-solid  border-gainsboro-200 "
          >
            <label htmlFor="employee3">
              <div>Employee3</div>
            </label>
            <div>5400</div>
            <div>Rs</div>
            <div>Cash</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettlingCashAdvanceContainer;
