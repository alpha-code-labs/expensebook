import { chevronDown } from "../../assets/icon";
import Select from "../common/Select";
import Search from "../common/searchNonTravel";
import NonTravelExpenseComponent from "./NonTravelExpenseComponent";
import NonTravelExpenseSearchBar from "./NonTravelExpenseSearchbar";


const NonTravelExpenseContainer = () => {
  
    return (
      <div>
        <div className="relative rounded-2xl bg-white box-border w-[912px] h-[504px] overflow-hidden shrink-0 text-base text-black border-[1px] border-solid border-gainsboro-200">
          <div className="absolute top-[24px] left-[44px]">
            Non Travel Expenses
          </div>

          <div className="absolute top-[140px] left-[24px] right-[49] bottom-[5] flex flex-col items-start justify-start gap-[8px] text-sm text-ebgrey-600 ">
             <div className="w-[826px] flex flex-col items-start justify-start">
              <div className="bg-white w-[826px] flex flex-row items-start justify-start">
                <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
                  <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_50px)] font-medium">
                    Employee Name
                  </div>
                </div>
                <div className="relative w-[126px] h-14 overflow-hidden shrink-0">
                  <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_31px)] font-medium">
                    Amount
                  </div>
                </div>
                <div className="relative w-14 h-14 overflow-hidden shrink-0">
                  <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_21px)] font-medium">
                    Invoice
                  </div>
                </div>
                <div className="relative w-[126px] h-14 overflow-hidden shrink-0">
                  <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_27px)] font-medium">
                    Category
                  </div>
                </div>
                <div className="relative w-[126px] h-14 overflow-hidden shrink-0">
                  <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_17px)] font-medium">
                    Date
                  </div>
                </div>
                <div className="relative w-[126px] h-14 overflow-hidden shrink-0">
                  <div className="absolute top-[calc(50%_-_8px)] left-[calc(50%_-_15px)] font-medium">
                  Payment
                  </div>
                </div>
              </div>
             </div>
             <NonTravelExpenseComponent />
          </div>
           <NonTravelExpenseSearchBar/>
          {/* Searchbar 
          <div className="flex mt-14 px-6 py-2 gap-8">

            <Search options={['Ajay', 'Sumesh', 'Kanhaiya', 'Ravindra']} placeholder='search category' />

          </div> */}

          <div className="absolute top-[130.5px] left-[16.5px] box-border w-[883px] h-px border-t-[1px] border-solid border-ebgrey-100" />
        </div>
      </div>    
    );
  };
  
  export default NonTravelExpenseContainer;
  



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