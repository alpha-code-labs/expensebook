import { useState,useEffect } from 'react';
import { useData } from '../api/DataProvider';
import { receipt} from '../assets/icon';
import { handleCashAdvance} from '../utils/actionHandler';
import { useParams } from 'react-router-dom';
import RecoveringCashAdvance from '../components/cashAdvance/RecoveringCashAdvance';
import SettleCashAdvance from '../components/cashAdvance/SettlleCashAdvance';
import SettlingTravelExpense from '../components/travelExpense/SettlingTravelExpense';
import SettlingNonTravelExpense from '../components/nonTravelExpense/nonTravelExpense';
import Entries from '../components/entries/Entries';



const Settlement = ({fetchData}) => {  

const {employeeData, employeeRoles} = useData()
const {tenantId, empId, page} = useParams()

const [cashAdvanceData, setCashAdvanceData ]=useState(null)
const [recoverCashAdvance , setRecoverCashAdvance]=useState(null)
const [travelExpenseData, setTravelExpenseData] = useState(null)
const [nonTravelExpenseData, setNonTravelExpenseData] = useState(null)
const [entries, setEntries] = useState(null)
const [activeScreen, setActiveScreen] = useState('Settling CashAdvance');

const employeeRole= employeeRoles?.employeeInfo?.employeeDetails

const handleScreenChange = (screen) => {
  setActiveScreen(screen);
};

  useEffect(() =>{
    fetchData(tenantId, empId, page)
  },[])

  useEffect(()=>{
    const data = employeeData && employeeData?.dashboardViews?.finance

    setCashAdvanceData(data?.cashAdvanceToSettle)
    setRecoverCashAdvance(data?.paidAndCancelledCash)
    setTravelExpenseData(data?.travelExpense)
    setNonTravelExpenseData(data?.nonTravelExpense)
    setEntries(data?.entries)
  },[employeeData])


  useEffect(()=>{
    console.log(activeScreen, 'active screen')
  },[activeScreen])

  console.log("whats travelExpenseData", travelExpenseData)
  console.log('Finance cashAdvance to settle employee',cashAdvanceData  )
  console.log('Finance cashAdvance to recoverCashAdvance employee',recoverCashAdvance  )
  console.log('Finance cashAdvance  employee details',employeeRoles?.employeeInfo?.employeeDetails)


  return (
    <>
      {/* <div className="bg-white-100 lg:flex"> */}
      <div className="px-2 lg:px-10 xl:px-20 relative w-auto h-dvh  flex flex-col items-center  pt-[50px] bg-slate-100">
         
          <div className="  flex flex-row items-center justify-start gap-2 sm:gap-4 font-cabin mb-2">
          {/* Settling CashAdvance  */}
            <div className='relative'>
              {cashAdvanceData && cashAdvanceData.length > 0 &&  <div className=' absolute right-[-1px] top-[-8px] w-fit p-[6px] bg-green-200 border border-white-100 rounded-full '/>}
                  <div
                    className={`cursor-pointer rounded-xl  py-1 px-2 w-auto min-w-[100px] truncate${
                      activeScreen === 'Settling CashAdvance' ? 'font-medium rounded-xl bg-indigo-400 text-xs text-white-100 w-auto min-w-[100px] truncate' : 'bg-white-100 text-neutral-800'
                    }`}
                    onClick={() => handleScreenChange('Settling CashAdvance')}
                  >
                    Settling CashAdvance 
                  </div>
            </div>
                {/* </div> */}
                {/* Recovering CashAdvance */}
                <div className='relative'>
                  {recoverCashAdvance && recoverCashAdvance.length > 0 &&  <div className=' absolute right-[-1px] top-[-8px] w-fit p-[6px] bg-green-200 border border-white-100 rounded-full '/>}
                <div
                  className={` rounded-xl cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate ${
                    activeScreen === 'Recovering CashAdvance' ? 'font-medium rounded-xl bg-indigo-400 text-xs text-white-100 w-auto min-w-[100px] truncate' : 'bg-white-100 text-neutral-800'
                  }`}
                  onClick={() => handleScreenChange('Recovering CashAdvance')}
                >
                Recovering CashAdvance
                </div>
                </div>

                {/* Settling Travel Expense */}
                <div className='relative'>
                  {travelExpenseData && travelExpenseData.length > 0 &&  <div className=' absolute right-[-1px] top-[-8px] w-fit p-[6px] bg-green-200 border border-white-100 rounded-full '/>}
                <div
                  className={` rounded-xl cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate ${
                    activeScreen === 'Settling Travel Expense' ? 'font-medium rounded-xl bg-indigo-400 text-xs text-white-100 w-auto min-w-[100px] truncate' : 'bg-white-100 text-neutral-800'
                  }`}
                  onClick={() => handleScreenChange('Settling Travel Expense')}
                >
                Travel Expense
                </div>
                </div>

                {/* Settling Non Travel Expense */}
                <div className='relative'>
                  {nonTravelExpenseData && nonTravelExpenseData.length > 0 &&  <div className=' absolute right-[-1px] top-[-8px] w-fit p-[6px] bg-green-200 border border-white-100 rounded-full '/>}
                <div
                  className={` rounded-xl cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate ${
                    activeScreen === 'Settling Non Travel Expense' ? 'font-medium rounded-xl bg-indigo-400 text-xs text-white-100 w-auto min-w-[100px] truncate' : 'bg-white-100 text-neutral-800'
                  }`}
                  onClick={() => handleScreenChange('Settling Non Travel Expense')}
                >
                Non Travel Expense
                </div>
                </div>

                 {/* Settling Accounting Entries for All Expenses */}
                 <div className='relative'>
                  {entries && entries.length == 0 &&  <div className=' absolute right-[-1px] top-[-8px] w-fit p-[6px] bg-green-200 border border-white-100 rounded-full '/>}
                <div
                  className={` rounded-xl cursor-pointer py-1 px-2 w-auto min-w-[100px] truncate ${
                    activeScreen === 'Settling Accounting Entries' ? 'font-medium rounded-xl bg-indigo-400 text-xs text-white-100 w-auto min-w-[100px] truncate' : 'bg-white-100 text-neutral-800'
                  }`}
                  onClick={() => handleScreenChange('Settling Accounting Entries')}
                >
                Accounting Entries
                </div>
                </div>

              {/* </div> */}
            {/* </div> */}
          </div>










          <div className="w-full bg-white-100 h-[80%] rounded-lg  border-[1px] border-indigo-500 shrink-0 font-cabin mt-3 sm:mt-6 ">
          {activeScreen === 'Settling CashAdvance' && 
            <>
  {/* <div className='flex flex-row justify-between items-end px-8'> */}
  <div className=" px-8 w-full h-6 flex flex-row gap-3 mt-7 items-center">
    <img className="w-6 h-6" src={receipt} alt="receipt" />
    <div className="text-base tracking-[0.02em] font-bold">Settling CashAdvance </div>
  </div>

          <div className="box-border mx-4  mt-[46px]  w-auto    border-[1px]  border-b-gray "/>
            <div className='overflow-y-auto overflow-x-hidden  mt-6  w-dvh px-10'>
              {cashAdvanceData && cashAdvanceData?.map((travelDetails , index)=>{ 
                console.log("travelDetails", travelDetails) 
                return (
                  <div key={index} className=' pb-2'>
                  <SettleCashAdvance 
                  travelDetails={travelDetails} 
                  handleCashAdvance={handleCashAdvance}  
                  employeeRole={employeeRole}
                  />
                  </div>
                )
                })}
            </div>
            </>
          }
          {activeScreen=== 'Recovering CashAdvance' && 
            <>
      <div className="w-auto h-6 flex flex-row gap-3 ml-8 mt-7 items-center">
        <img className="w-6 h-6" src={receipt} alt="receipt" />
        <div className="text-base tracking-[0.02em] font-bold w-auto">Recovering paid and cancelled CashAdvance</div>
      </div>


    <div className="box-border mx-4  mt-[46px]  w-auto    border-[1px]  border-b-gray "/>
    <div className='overflow-y-auto overflow-x-hidden  mt-6  w-dvh px-10'>
           {recoverCashAdvance && recoverCashAdvance?.map((recoverDetails, index) => {
            return(
                <div key={index} className='pb-2'>
                  <RecoveringCashAdvance 
                  recoverDetails={recoverDetails} 
                  employeeRole={employeeRole}
                  />
                </div>
            )})}
           </div>
            </>
          }
          {activeScreen=== 'Settling Travel Expense' && 
            <>
      <div className="w-auto h-6 flex flex-row gap-3 ml-8 mt-7 items-center">
        <img className="w-6 h-6" src={receipt} alt="receipt" />
        <div className="text-base tracking-[0.02em] font-bold w-auto">Settling Travel Expense</div>
      </div>
      

    <div className="box-border mx-4  mt-[46px]  w-auto    border-[1px]  border-b-gray "/>
    <div className='overflow-y-auto overflow-x-hidden  mt-6  w-dvh px-10'>
           {travelExpenseData && travelExpenseData?.map((travelExpenseDetails, index) => {
            return(
                <div key={index} className='pb-2'>
                  <SettlingTravelExpense 
                  travelExpenseDetails={travelExpenseDetails} 
                  employeeRole={employeeRole}
                  />
                </div>
            )})}
           </div>
            </>
          }
          {/* Settling Non Travel Expense */}
          {activeScreen=== 'Settling Non Travel Expense' && 
            <>
      <div className="w-auto h-6 flex flex-row gap-3 ml-8 mt-7 items-center">
        <img className="w-6 h-6" src={receipt} alt="receipt" />
        <div className="text-base tracking-[0.02em] font-bold w-auto">Settling Non Travel Expense</div>
      </div>
      

    <div className="box-border mx-4  mt-[46px]  w-auto    border-[1px]  border-b-gray "/>
    <div className='overflow-y-auto overflow-x-hidden  mt-6  w-dvh px-10'>
           {nonTravelExpenseData && nonTravelExpenseData?.map((nonTravelExpenseDetails, index) => {
            return(
                <div key={index} className='pb-2'>
                  <SettlingNonTravelExpense 
                  nonTravelExpenseDetails={nonTravelExpenseDetails} 
                  employeeRole={employeeRole}
                  />
                </div>
            )})}
           </div>
            </>
          }
          {/* Accounting Entries */}
          {activeScreen=== 'Settling Accounting Entries' && 
            <>
      <div className="w-auto h-4 flex flex-row gap-3 ml-8 mt-4 items-center">
        <img className="w-6 h-6" src={receipt} alt="receipt" />
        <div className="text-base tracking-[0.02em] font-bold w-auto">Settling Accounting Entries For All Expenses</div>
      </div>

    <div className="box-border mx-4  mt-[27px]  w-auto    border-[1px]  border-b-gray "/>
    <div className='overflow-y-auto overflow-x-hidden  mt-6  w-dvh px-10'>
    <Entries 
    employeeRole={employeeRole}
    />
    {/* {entries && entries?.map((entriesDetails, index) => {
            return(
                <div key={index} className='pb-2'>
                  <Entries 
                  entriesDetails={entriesDetails} 
                  employeeRole={employeeRole}
                  />
                </div>
            )})} */}
          </div>
            </>
          }
          </div>
        </div>
      {/* </div> */}
    </>
  );
};

export default Settlement;










