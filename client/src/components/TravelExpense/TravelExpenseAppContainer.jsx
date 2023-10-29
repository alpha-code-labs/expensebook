import TravelExpenseAppComponent from "./TravelExpenseAppComponent";
import TravelExpenseSearchBar from "./TravelExpenseAppSearchbar";



const TravelExpenseAppContainer = (props) => {
  
  const setShowModal = props.setShowModal
  const setExpenseDetails = props.setExpenseDetails

    return (   
    <div>
     <div className="relative rounded-2xl bg-white box-border w-[912px] h-[422px] overflow-hidden shrink-0 text-base text-black border-[1px] border-solid border-gainsboro-200">
       <div className="absolute top-[24px] left-[25px]">Travel Expenses</div>
     <TravelExpenseAppComponent 
        setShowModal={setShowModal}
        setExpenseDetails={setExpenseDetails} />
      {/* Search TE container */}
             <div className="absolute top-[67px] left-[36px] flex flex-row items-center justify-start gap-[24px] text-justify text-xs text-ebgrey-400">
                  <TravelExpenseSearchBar/>
              </div>
       {/* BorderLine  */}
       <div className="absolute top-[129.5px] left-[16.5px] box-border w-[883px] h-px border-t-[1px] border-solid border-ebgrey-100" />
     </div>
    </div>
    );
  };
  
 
export default TravelExpenseAppContainer;



// <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
//                     <div className="relative">Search Trip Name</div>
//                   </div>
//                   <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
//                     <div className="relative">Search by destination</div>
//                   </div>
//                   <div className="rounded-md bg-white box-border w-[206px] flex flex-row items-center justify-start py-2 px-4 border-[1px] border-solid border-ebgrey-200">
//                     <div className="relative">Search by employee name</div>
//                   </div>