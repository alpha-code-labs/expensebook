import React,{useState} from "react";
import { calender_icon, double_arrow } from "../../assets/icon";
import { titleCase } from "../../utils/handyFunctions";

const TravelExpense = () => {
    
  const TrExpense = [
        {
          createdFor: [
            {
              empId: 'emp012',
              name: 'Rivaah Sonar'
            }
          ],
          trip: "Dehradun Nirvana Trip",
          amount: "$1000.00",
          date: "20-Sep-2023 to 22-Sep-2023",
          mode: "",
          status: "pending settlement",
          from: "Delhi",
          to: "Vinci"
        },
        {
          createdFor: [
            {
              empId: 'emp013',
              name: 'John Doe'
            }
          ],
          trip: "Mountain Adventure",
          amount: "$1500.00",
          date: "15-Oct-2023 to 18-Oct-2023",
          mode: "credit card",
          status: "Paid",
          from: "Seattle",
          to: "Denver"
        },
        {
          createdFor: [
            {
              empId: 'emp014',
              name: 'Alice Smith'
            }
          ],
          trip: "Beach Vacation",
          amount: "$800.00",
          date: "5-Nov-2023 to 10-Nov-2023",
          mode: "",
          status: "pending settlement",
          from: "Miami",
          to: "Cancun"
        },
        {
          createdFor: [
            {
              empId: 'emp015',
              name: 'David Johnson'
            }
          ],
          trip: "Ski Trip",
          amount: "$1200.00",
          date: "7-Dec-2023 to 10-Dec-2023",
          mode: "cheque",
          status: "Paid",
          from: "Aspen",
          to: "Vail"
        },
        {
          createdFor: [
            {
              empId: 'emp016',
              name: 'Emily White'
            }
          ],
          trip: "Cruise Vacation",
          amount: "$2500.00",
          date: "20-Jan-2024 to 25-Jan-2024",
          mode: "",
          status: "pending settlement",
          from: "Miami",
          to: "Bahamas"
        },
        {
          createdFor: [
            {
              empId: 'emp017',
              name: 'Michael Brown'
            }
          ],
          trip: "Hiking Expedition",
          amount: "$800.00",
          date: "12-Feb-2024 to 14-Feb-2024",
          mode: "",
          status: "pending settlement",
          from: "Denver",
          to: "Boulder"
        },
        {
          createdFor: [
            {
              empId: 'emp018',
              name: 'Samantha Wilson'
            }
          ],
          trip: "City Getaway",
          amount: "$1800.00",
          date: "10-Mar-2024 to 15-Mar-2024",
          mode: "cheque",
          status: "Paid",
          from: "New York",
          to: "Boston"
        },
        {
          createdFor: [
            {
              empId: 'emp019',
              name: 'William Taylor'
            }
          ],
          trip: "Desert Adventure",
          amount: "$1700.00",
          date: "2-Apr-2024 to 6-Apr-2024",
          mode: "credit card",
          status: "Paid",
          from: "Phoenix",
          to: "Sedona"
        },
        {
          createdFor: [
            {
              empId: 'emp020',
              name: 'Olivia Lee'
            }
          ],
          trip: "Historical Tour",
          amount: "$1100.00",
          date: "15-May-2024 to 20-May-2024",
          mode: "",
          status: "pending settlement",
          from: "Rome",
          to: "Florence"
        },
        {
          createdFor: [
            {
              empId: 'emp021',
              name: 'James Harris'
            }
          ],
          trip: "Safari Expedition",
          amount: "$3000.00",
          date: "7-Jun-2024 to 12-Jun-2024",
          mode: "",
          status: "pending settlement",
          from: "Nairobi",
          to: "Serengeti"
        }
      ];


  const [searchQuery , setSearchQuery] =useState("");
  const [searchToFrom , setToFrom]=useState("");
  const [searchDestination , setSearchDestination]=useState("");
  const [searchReady, setSearchReady ]= useState(false);

 
const searchByName = TrExpense.filter((expense) => {
  return (
    (!searchReady || expense.createdFor[0].name.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (expense.from.toLowerCase().includes(searchToFrom.toLowerCase()) || expense.to.toLowerCase().includes(searchToFrom.toLowerCase())) &&
    (!searchDestination || expense.trip.toLowerCase().includes(searchDestination.toLowerCase()))
  );
});  
  return (
    <>
  <div className="absolute top-[24px] left-[36px]">Travel Requests</div>
  <div className="absolute top-[178px] left-[8px] flex flex-col items-start justify-start gap-[4px] text-ebgrey-600">
    <div className="bg-white flex flex-row items-start justify-center gap-3">
      <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
        <div className="absolute top-[calc(50%-_8px)] left-[27px] tracking-[0.03em] font-medium">
          Employee Name
        </div>
      </div>
      
      <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
        <div className="absolute top-[calc(50%-_8px)] left-[calc(50%-_26px)] tracking-[0.03em] font-medium">
          Trip Name
        </div>
      </div>
      <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
        <div className="absolute top-[20px] left-[calc(50%-_32px)] tracking-[0.03em] font-medium">
          Destinations
        </div>
      </div>
      <div className="relative w-60 h-14 overflow-hidden shrink-0">
        <div className="absolute top-[20px] left-[calc(50%-_32px)] tracking-[0.03em] font-medium">
          Dates
        </div>
      </div>
    </div>
    <div className="h-[230px] pr-2 overflow-auto">
    <div className="flex flex-col  items-start justify-start text-sm">
      {searchByName.length===0 ? "data not found" :(searchByName.map((tr, index) =>(

        <>
          <div className="flex flex-col items-center justify-start " key={index}>
            <div className="bg-white w-[890px] flex flex-row font-cabin items-start justify-center border-b-[1px] border-solid border-gray-100 ">
              <div className="w-[120px] h-14 py-5 px-3 shrink-0 text-neutral-800 flex items-start">
                <div className="text-[14px] tracking-[0.03em] leading-normal truncate font-medium">
                  {tr.createdFor[0].name}
                </div>
              </div>
              <div className="w-[140px] h-14 py-5 ">
                <div className="text-[14px] w-[130px] truncate tracking-[0.03em] leading-normal text-neutral-800 font-medium px-2">
                  {tr.trip}
                </div>
              </div>
              <div className="flex flex-row gap-1 w-[240px] py-5 h-14 ">
                <img src={calender_icon} alt="calendar" className="w-[16px]" />
                <div className="tracking-[0.03em]  leading-normal text-neutral-800 text-[14px] font-medium">
                  {tr.date}
                </div>
              </div>


<div className="w-[120px] h-14 py-5 px-3">
  <div className="tracking-[0.03em] leading-normal text-neutral-800 font-medium flex flex-1 flex-row justify-center items-center" style={{ whiteSpace: 'nowrap' }}>
    <div className="">{tr.from}</div>
    <img className="w-4 h-4 overflow-hidden shrink-0" alt="" src={double_arrow} />
    <div className="">{tr.to}</div>
  </div>
</div>

              <div className={`w-[100px] h-14 py-5 px-2 flex `}>
                <div className="tracking-[0.03em] w-[80px] leading-normal text-neutral-800 font-medium text[14px]">
                {tr.mode.length>0 ? (titleCase(tr.mode )) : "---"} 
                </div>
              </div>
              <div className="w-[197px] h-14 py-5 px-3 flex justify-center items-center">
                <div className={`w-[129px] h-8 flex justify-center items-center border rounded-[48px] cursor-pointer  py-4 ${tr.status==="pending settlement" ? "border  text-purple-500 border-purple-500 " : " bg-green-100 text-green-200 border-none" } `}>
                  <div className={`w-[130px] shrink-0 text-[14px] px-4 font-medium text-center  text[14px] `}  >
                    {tr.status === 'pending settlement' ? "View Details" : "Settled"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>     
      )))}
    </div>
    </div>
  </div>
  <div className="absolute top-[67px] left-[36px] flex flex-row items-start justify-start gap-[16px] text-xs text-darkslategray">
    <div className="flex flex-col items-start justify-center gap-[8px]">
      <div className="relative font-medium">Search by Employee</div>
      <div className="w-[175px] h-10 flex flex-row flex-wrap items-start justify-center text-justify text-sm text-ebgrey-400">
        <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-start justify-center py-3 px-6 relative border-[1px] border-solid border-ebgrey-200">

         <input 
          type="text" 
          placeholder="Employee Name" 
          className="absolute tracking-[0.01em] outline-none border-none"
          value={searchQuery}
          onChange={(e) => {setSearchQuery(e.target.value);
                            setSearchReady(e.target.value.length >= 3)}}
          />

        </div>
      </div>
    </div>
    <div className="flex flex-col items-start justify-center gap-[8px]">
      <div className="relative font-medium">Search by destination</div>
      <div className="w-[175px] h-10 flex flex-row flex-wrap items-start justify-center text-justify text-sm text-ebgrey-400">
        <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-start justify-center py-3 px-6 relative border-[1px] border-solid border-ebgrey-200">
          
          <input type="text"
           placeholder="Destination" 
           className="absolute tracking-[0.01em] outline-none border-none"
           value={searchToFrom}
           onChange={(e) => {setToFrom(e.target.value);
                            setSearchReady(e.target.value.length >= 3);}}
           />

        </div>
      </div>
    </div>
    <div className="flex flex-col items-start justify-center gap-[8px]">
      <div className="relative font-medium">Search by Trip Name</div>
      <div className="w-[175px] h-10 flex flex-row flex-wrap items-start justify-center text-justify text-sm text-ebgrey-400">
        <div className="self-stretch flex-1 rounded-md bg-white flex flex-row items-start justify-center py-3 px-6 relative border-[1px] border-solid border-ebgrey-200">

           <input type="text" 
           placeholder="Trip Name" 
           className="absolute tracking-[0.01em] outline-none border-none"
           value={searchDestination}
           onChange={(e) => {setSearchDestination(e.target.value);
                            setSearchReady(e.target.value.length >= 3);}}
           />


        </div>
      </div>
    </div>
  </div>
  <div className="absolute top-[153.5px] left-[16.5px] box-border w-[883px] h-px border-t-[1px] border-solid border-ebgrey-100" />
</>

  );
};

export default TravelExpense;
