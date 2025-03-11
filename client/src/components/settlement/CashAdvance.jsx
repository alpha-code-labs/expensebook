import React,{useState} from "react";
import { up_arrow, down_arrow ,calender_icon, frame_341} from "../../assets/icon";
import { titleCase } from "../../utils/handyFunctions";

const CashAdvance = () => {
  const [searchQuery ,  setSearchQuery]= useState("");
  const [searchReady ,  setSearchReady]= useState(false);

  const CAdetails = [
    {
      createdFor: [
        {
          empId: 'emp012',
          name: 'Rivaah Sonar'
        }
      ],
      trip: "Dehradun Nirvana Trip",
      amount: "$100.00",
      date: "20-Sep-2023 to 22-Sep-2023",
      mode: "cheque",
      status: "paid"
    },
    {
      createdFor: [
        {
          empId: 'emp013',
          name: 'John Doe'
        }
      ],
      trip: "Mountain Adventure",
      amount: "$150.00",
      date: "15-Oct-2023 to 18-Oct-2023",
      mode: "credit card",
      status: "paid"
    },
    {
      createdFor: [
        {
          empId: 'emp014',
          name: 'Alice Smith'
        }
      ],
      trip: "Beach Vacation",
      amount: "$200.00",
      date: "5-Nov-2023 to 10-Nov-2023",
      mode: "",
      status: "pending settlement"
    },
    {
      createdFor: [
        {
          empId: 'emp015',
          name: 'David Johnson'
        }
      ],
      trip: "Ski Trip",
      amount: "$120.00",
      date: "7-Dec-2023 to 10-Dec-2023",
      mode: "",
      status: "pending settlement"
    },
    {
      createdFor: [
        {
          empId: 'emp016',
          name: 'Emily White'
        }
      ],
      trip: "Cruise Vacation",
      amount: "$250.00",
      date: "20-Jan-2024 to 25-Jan-2024",
      mode: "",
      status: "pending settlement"
    },
    {
      createdFor: [
        {
          empId: 'emp017',
          name: 'Michael Brown'
        }
      ],
      trip: "Hiking Expedition",
      amount: "$80.00",
      date: "12-Feb-2024 to 14-Feb-2024",
      mode: "cash",
      status: "paid"
    },
    {
      createdFor: [
        {
          empId: 'emp018',
          name: 'Samantha Wilson'
        }
      ],
      trip: "City Getaway",
      amount: "$180.00",
      date: "10-Mar-2024 to 15-Mar-2024",
      mode: "cheque",
      status: "paid"
    },
    {
      createdFor: [
        {
          empId: 'emp019',
          name: 'William Taylor'
        }
      ],
      trip: "Desert Adventure",
      amount: "$170.00",
      date: "2-Apr-2024 to 6-Apr-2024",
      mode: "credit card",
      status: "paid"
    },
    {
      createdFor: [
        {
          empId: 'emp020',
          name: 'Olivia Lee'
        }
      ],
      trip: "Historical Tour",
      amount: "$110.00",
      date: "15-May-2024 to 20-May-2024",
      mode: "cash",
      status: "paid"
    },
    {
      createdFor: [
        {
          empId: 'emp021',
          name: 'James Harris'
        }
      ],
      trip: "Safari Expedition",
      amount: "$300.00",
      date: "7-Jun-2024 to 12-Jun-2024",
      mode: "cheque",
      status: "paid"
    }
  ];

  const searchByName = CAdetails.filter(
    (expense) =>
      !searchReady || expense.createdFor[0].name.toLowerCase().includes(searchQuery.toLowerCase())
  );



    return (
    <>
     <div className="">
       
          {/* <div className="flex flex-col items-start justify-start text-black"> */}
            
              <div className="absolute top-[22px] left-[44px] text-black">
                Cash Advance Reqeust
              </div>
              
<>
             <div className="absolute  h-[300px] top-[146px]  flex flex-col items-start justify-start gap-2 mx-3">
              {/* <div className="absolute flex flex-row justify-center items-start  h-14 w-auto text-gray-A500 gap-6 "> */}
               <div className="bg-white w-full max-w-[686px] flex flex-row items-center justify-start text-gray-A500">
              <div className="w-[140px] h-14 py-5 px-3 relative flex items-center justify-center shrink-0 text-center">
                <div className="font-cabin text-base font-medium  tracking-[0.03em]">
                Trip  
                </div>
               
              </div>
              <div className="w-[140px] h-14 py-5  relative  shrink-0 flex justify-center items-center">
                <div className="font-cabin text-base font-medium tracking-[0.03em]">
                Employee Name
                </div>
              </div>
              <div className="flex relative shrink-0 justify-center items-center w-[240px] h-14 py-5 px-3">
                <div className="font-cabin text-base font-medium absolute  tracking-[0.03em]  ">
                Dates 
                </div>
              </div>
              <div className="flex relative shrink-0 justify-center items-center w-[80px] h-14 py-5 px-2">
                <div className="font-cabin text-base font-medium absolute  tracking-[0.03em]  ">
                 Amount
                </div>
              </div> 
              <div className="flex relative shrink-0 justify-center
               items-center w-[100px] h-14 py-5 px-2">
                <div className="font-cabin text-base font-medium absolute  tracking-[0.03em]  ">
                 Mode
                </div>
              </div>
              </div>
              

              <div className="flex flex-col items-start justify-start text-sm pr-1 overflow-auto">

              {/* {CAdetails.map((details,index)=>( */}
              {searchByName.length===0 ? "data not found" :(searchByName.map((details,index)=>(
              <>
                <div className="flex flex-col items-center  justify-center" key={index}>
                {/* <div key={index} className=" absolute flex flex-row top-5 w-[907] h-14 mt-5 border-b border-black"> */}

                <div className="bg-white flex flex-row font-cabin items-start justify-center border-b-[1px] border-solid border-gray-100">
<div className="w-[140px] h-14 py-5 px-3  shrink-0 text-neutral-800">
  <div className="text-[14px] tracking-[0.03em] leading-normal truncate font-medium">
  {details.trip}
  </div>
</div>
  


  <div className="w-[140px] h-14 py-5 px-3">
  <div className="text-[14px] w-[130px] truncate tracking-[0.03em] leading-normal text-neutral-800 font-medium">
     {details.createdFor[0].name}
  </div>
    
  </div>
  <div className="flex flex-row gap-1 w-[240px] h-14 py-5 px-3">
  <img src={calender_icon} alt="calendar" className="w-[16px]" />
<div className=" tracking-[0.03em] leading-normal text-neutral-800 text-[14px] font-medium">
20-Sep-2023 to 22-Sep-2023
</div>

</div>
  <div className="w-[95px] h-14 py-5 px-3 ">
    <div className="tracking-[0.03em] leading-normal text-neutral-800 font-medium">{details.amount}</div>
  </div>
  <div className="w-[100px] h-14 py-5 px-2 flex ">               
                <div className="tracking-[0.03em] w-[80px] leading-normal text-neutral-800 font-medium text[14px]">
                { details.mode.length > 0 ? (titleCase(details.mode )) : "----" } 
                </div>
              </div>
  <div className="w-[197px] h-14 py-5 px-3 flex justify-center items-center">
    <div className={`w-[129px] h-8 flex justify-center items-center py-4 rounded-[48px] ${details.status==="paid" ? "bg-green-100 text-green-200" : "border  text-purple-500 border-purple-500"} `}>
    <div className="w-[130px] shrink-0 text-[14px] px-4 font-medium text-center   text[14px]">{ (details.status === "paid" ? "Settled" : "Mark as Settled")}</div>
  </div>
   
  </div>
 
</div>
</div>
</>)))}
</div>


             
              

             </div>
    
              
</>
              <div className="absolute top-[121.5px] left-[16.5px] box-border w-[883px] h-px border-t-[1px] border-solid border-ebgrey-100" />
              <div className="absolute top-[67px] left-[44px] flex flex-row items-center justify-start gap-[49px] text-justify text-xs text-ebgrey-400">
              <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-gray-600">
  
 

<input
  type="text"
  className="relative tracking-[0.01em] outline-none border-none"
  placeholder="Search by Employee"
  value={searchQuery}
  onChange={(e) => {
    setSearchQuery(e.target.value);
    setSearchReady(e.target.value.length >= 3);
  }}
/>



</div>
                <div className="flex flex-row items-start justify-start gap-[48px] text-left text-base text-gray-A500">
                  <div className="flex flex-row items-center justify-start gap-[8px]">
                    <div className="flex flex-row items-center justify-start gap-[3px]">
                      <img
                        className="relative w-6 h-6 overflow-hidden shrink-0"
                        alt=""
                        src={up_arrow}
                      />
                      <div className="flex flex-row items-end justify-start">
                        <div className="relative tracking-[0.03em] font-medium">
                          Dates Ascending
                        </div>
                      </div>
                    </div>
                    <img
                      className="relative rounded-2xl w-4 h-4 overflow-hidden shrink-0"
                      alt=""
                      src={frame_341}
                    />
                  </div>
                  <div className="flex flex-row items-center justify-start gap-[8px] text-sm">
                    <div className="flex flex-row items-center justify-start gap-[8px]">
                      <img
                        className="relative w-6 h-6 overflow-hidden shrink-0"
                        alt=""
                        src={down_arrow}
                      />
                      <div className="relative">Dates Ascending</div>
                      <div className="relative rounded-2xl box-border w-4 h-4 overflow-hidden shrink-0 border-[1px] border-solid border-ebgrey-400" />
                    </div>
             
                  </div>
                </div>
              </div>
            {/* </div> */}
         
    </div>
      </>
     
    );
  };
  
  export default CashAdvance;



  