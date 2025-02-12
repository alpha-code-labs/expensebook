import React, { useState,useEffect } from 'react'
import { SettleNowBtn, StatusFilter } from '../common/TinyComponent'
import Input from '../common/SearchInput'
import Input1 from '../common/Input'
import { cancel, chevron_down_icon, close_icon, csv_icon, export_icon, file_icon, filter_icon, info_icon, pdf_icon, search_icon } from '../assets/icon'
import SettleCashAdvance from '../tabs/SettleCashAdvance'
import RecoverCashAdvance from '../tabs/RecoverCashAdvance'
import SettleTravelExpense from '../tabs/SettleTravelExpense'
import SettleNonTravelExpense from '../tabs/SettleNonTravelExpense'
import AccountEntry from '../tabs/AccountEntry'
import Error from '../common/Error'
import {TravelExpense, TRCashadvance} from '../utilis/dummyData'
import { useParams } from 'react-router-dom'
import { getAccountEntriesData_API, getFinanceData_API, settleCashAdvanceApi, settleExpenseApi } from '../utilis/api'
import { calculateDateRanges, filterByTimeRange, handleCSVDownload } from '../utilis/handyFunctions'
import Select from '../common/Select'
import Button1 from '../common/Button1'
import IconOption from '../common/IconOption'
import { flattenData } from '../utilis/dataToTable'
import uploadFileToAzure from '../utilis/azureBlob'
import Modal from '../common/Modal1'
import Button from '../common/Button'


const Finance = () => {
  const travelExpense = [
    {
      tripName: "SD-SA(13th Jan 2025)",
      travelRequestId: "6784ff78f05f402f9d41010d",
      expenseAmountStatus: {
        totalCashAmount: 0,
        totalAlreadyBookedExpenseAmount: 4324,
        totalExpenseAmount: 220331.2,
        totalPersonalExpenseAmount: 0,
        totalRemainingCash: -216007.2,
      },
      createdBy: {
        empId: "1018",
        name: "Lily Flores",
        _id: "6784ff78f05f402f9d41010f",
      },
      travelExpenseData: [
        {
          "expenseHeaderStatus": "pending settlement",
          "expenseAmountStatus": {
              "totalCashAmount": 0,
              "totalAlreadyBookedExpenseAmount": 4324,
              "totalExpenseAmount": 220331.2,
              "totalPersonalExpenseAmount": 0,
              "totalRemainingCash": -216007.2
          },
          "expenseHeaderId": "67877b1e0f122xx72801e582cc6e",
          "expenseHeaderNumber": "ERQUA000004",
          "defaultCurrency": {
              "countryCode": "IN",
              "fullName": "Indian Rupee",
              "shortName": "INR",
              "symbol": "₹"
          },
          "settlementBy": {
              "empId": null,
              "name": null
          },
          "actionedUpon": false,
        
         
      },
        {
          expenseHeaderStatus: "pending settlement",
          expenseAmountStatus: {
            totalCashAmount: 0,
            totalAlreadyBookedExpenseAmount: 4324,
            totalExpenseAmount: 220331.2,
            totalPersonalExpenseAmount: 0,
            totalRemainingCash: -216007.2,
          },
          expenseHeaderId: "67877bss1e0sdfsf172801e582cc6e",
          expenseHeaderNumber: "ERQUA000004",
          defaultCurrency: {
            countryCode: "IN",
            fullName: "Indian Rupee",
            shortName: "INR",
            symbol: "₹",
          },
          settlementBy: {
            empId: null,
            name: null,
          },
          actionedUpon: false,
        },
        {
          expenseHeaderStatus: "pending settlement",
          expenseAmountStatus: {
            totalCashAmount: 0,
            totalAlreadyBookedExpenseAmount: 4324,
            totalExpenseAmount: 220331.2,
            totalPersonalExpenseAmount: 0,
            totalRemainingCash: -216007.2,
          },
          expenseHeaderId: "67877b1e0faasdfs33172801e582cc6e",
          expenseHeaderNumber: "ERQUA000004",
          defaultCurrency: {
            countryCode: "IN",
            fullName: "Indian Rupee",
            shortName: "INR",
            symbol: "₹",
          },
          settlementBy: {
            empId: null,
            name: null,
          },
          actionedUpon: false,
        },
      ],
    },
    {
      tripName: "SD-SA(13th Jan 2025)",
      travelRequestId: "6784ff72332ss128f05f402f9d41010d",
      expenseAmountStatus: {
        totalCashAmount: 0,
        totalAlreadyBookedExpenseAmount: 4324,
        totalExpenseAmount: 220331.2,
        totalPersonalExpenseAmount: 0,
        totalRemainingCash: -216007.2,
      },
      createdBy: {
        empId: "1018",
        name: "Lily Flores",
        _id: "6784ff78f05f402f9d41010f",
      },
      travelExpenseData: [
        {
          expenseHeaderStatus: "pending settlement",
          expenseAmountStatus: {
            totalCashAmount: 0,
            totalAlreadyBookedExpenseAmount: 4324,
            totalExpenseAmount: 220331.2,
            totalPersonalExpenseAmount: 0,
            totalRemainingCash: -216007.2,
          },
          expenseHeaderId: "67877b1e0f17280178e582cc6e",
          expenseHeaderNumber: "ERQUA000004",
          defaultCurrency: {
            countryCode: "IN",
            fullName: "Indian Rupee",
            shortName: "INR",
            symbol: "₹",
          },
          settlementBy: {
            empId: null,
            name: null,
          },
          actionedUpon: false,
        },
        {
          expenseHeaderStatus: "pending settlement",
          expenseAmountStatus: {
            totalCashAmount: 0,
            totalAlreadyBookedExpenseAmount: 4324,
            totalExpenseAmount: 220331.2,
            totalPersonalExpenseAmount: 0,
            totalRemainingCash: -216007.2,
          },
          expenseHeaderId: "67877b1e0sdfsf342172801e582cc6e",
          expenseHeaderNumber: "ERQUA000004",
          defaultCurrency: {
            countryCode: "IN",
            fullName: "Indian Rupee",
            shortName: "INR",
            symbol: "₹",
          },
          settlementBy: {
            empId: null,
            name: null,
          },
          actionedUpon: false,
        },
        {
          expenseHeaderStatus: "pending settlement",
          expenseAmountStatus: {
            totalCashAmount: 0,
            totalAlreadyBookedExpenseAmount: 4324,
            totalExpenseAmount: 220331.2,
            totalPersonalExpenseAmount: 0,
            totalRemainingCash: -216007.2,
          },
          expenseHeaderId: "67877b1e0fsdfs3317cc2801e582cc6e",
          expenseHeaderNumber: "ERQUA000004",
          defaultCurrency: {
            countryCode: "IN",
            fullName: "Indian Rupee",
            shortName: "INR",
            symbol: "₹",
          },
          settlementBy: {
            empId: null,
            name: null,
          },
          actionedUpon: false,
        },
      ],
    },
  ];
  
  const {tenantId,empId}=useParams()
  const [activeTab, setActiveTab] = useState("Settle Cash-Advances");
  const [financeData, setFinanceData] =useState({travelExpense});
  const [AcEntryData, setAcEntryData]= useState({'travelExpense': [], 'nonTravelExpense':  [], 'cash': []})
  const [paidBy , setPaidBy]=useState(null);
  const [isLoading, setIsLoading]=useState(true);
  // const [isUploading, setIsUploading] =useState(false)
  const [errorMsg, setErrorMsg]= useState(null);
  const dashboardBaseUrl = import.meta.env.VITE_DASHBOARD_PAGE_URL
  const [selectedFile, setSelectedFile]= useState(null);
  const [fileSelected, setFileSelected]=useState(false);
  const [isUploading, setIsUploading]=useState(false);
  const [fileId, setFileId] = useState(null);
  const [filesForUpload, setFilesForUpload] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectAll, setSelectAll]= useState([]);
  const [modalOpen , setModalOpen]=useState(false);
  const [actionType, setActionType] = useState(true); 
  const [selectedData, setSelectedData] = useState({
    dataType:"",
    selectedData: []
  });

  const closeModal=()=>{
    setModalOpen(!modalOpen);
  }

  const handleSelectAll = (action, obj) => {
    const lengthCount = countTravelData(selectedData?.data, selectedData?.dataType);
    console.log("total length count", lengthCount);

    if(lengthCount !== selectAll.length) 
      {

        let  dataForSettlement = [];
        if(selectedData?.dataType === "nonTravelExpense")
        {
          dataForSettlement = selectedData?.data?.map((item)=>(
            {
              tenantId,
              expenseHeaderId:item?.expenseHeaderId,
              settlementDetails:[
                {
                  comment: null,
                  url:null
                }
              ]
            }
          ))

        }else
        {
          dataForSettlement = selectedData?.data?.flatMap(item=> item[selectedData?.dataType].map(expense=> ({
            tenantId,
            travelRequestId: item.travelRequestId,
            ...(expense?.expenseHeaderId ? {expenseHeaderId: expense.expenseHeaderId} : {cashAdvanceId : expense?.cashAdvanceId} ),
          
            settlementDetails:[
              {
                comment: null,
                url:null
              }
            ]
          })))

        }
        

        setSelectAll(dataForSettlement);
      }
      else{
        setSelectAll([]);
      }
  }
  
  
  const handleSelect = (action, obj) => {
    setSelectAll((prevSelected) => {
      const isExpense = obj.expenseHeaderId !== undefined;
      const idKey = isExpense ? "expenseHeaderId" : "cashAdvanceId";
      
      const isSelected = prevSelected.some(
        (item) =>
          item[idKey] === obj[idKey] && item.travelRequestId === obj.travelRequestId
      );
  
      if (isSelected) {
        // Remove only the item that matches both `idKey` and `travelRequestId`
        return prevSelected.filter(
          (item) => item[idKey] !== obj[idKey] || item.travelRequestId !== obj.travelRequestId
        );
      } else {
        // Add the new item
        const newItem = {
         ...(obj.travelRequestId && {travelRequestId: obj.travelRequestId}),
          [idKey]: obj[idKey],
          tenantId,
          settlementDetails:[
            {
              comment: null,
              url:null
            }
          ]

        };
        return [...prevSelected, newItem];
      }
    });
  };
  
  
    console.log('select all data', selectAll);

  const handleRemoveFile=()=>{
    setSelectedFile(null)
    setFileSelected(false)
  }

  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("page 3 my Params:", tenantId, empId);
        const response = await getFinanceData_API(tenantId, empId);
       setFinanceData(response.finance);  
       setPaidBy(response.employeeData);
       setSelectedData(
        {
          dataType:"cashAdvance",
          data:response?.finance?.cashAdvanceToSettle ||[]
        }
       )
       setActionType("settleCashAdvance")
        setIsLoading(false);
        console.log('travel data for approval fetched.');
      } catch (error) {
        console.log('Error in fetching travel data for approval:', error.message);
        setErrorMsg(error.message);
        // setTimeout(() => {setErrorMsg(null);setIsLoading(false)},5000);
      }
    };

    fetchData(); 

  },[tenantId, empId ]);

 console.log('finance data', financeData);

 const settleCashAdvanceData= financeData?.cashAdvanceToSettle     || []
 const recoverCashAdvanceData = financeData?.paidAndCancelledCash  || []
 //const settleTravelExpenseData = travelExpense        || []
const settleTravelExpenseData = financeData?.travelExpense        || []
 const settleNonTravelExpenseData = financeData?.nonTravelExpense  || []

 const settleCashAdvanceCount = financeData?.cashAdvanceToSettle?.length || 0;
const recoverCashAdvanceCount = financeData?.paidAndCancelledCash?.length || 0;
const settleTravelExpenseCount = financeData?.travelExpense?.length || 0;
const settleNonTravelExpenseCount = financeData?.nonTravelExpense?.length || 0;



const handleFileUpload = (travelRequestId, expenseHeaderId, file) => {
  const updatedExpenses = travelExpense.map((trip) => {
    if (trip.travelRequestId === travelRequestId) {
      trip.travelExpenseData = trip.travelExpenseData.map((expense) => {
        if (expense.expenseHeaderId === expenseHeaderId) {
          expense.file = file;
        }
        return expense;
      });
    }
    return trip;
  });

  setFinanceData((prev) => ({
    ...prev,
    travelExpense: updatedExpenses,
  }));

  // Update the array of file uploads
  setFilesForUpload((prev) => {
    const existingIndex = prev.findIndex(
      (entry) =>
        entry.expenseHeaderId === expenseHeaderId &&
        entry.travelRequestId === travelRequestId
    );

    if (existingIndex !== -1) {
      // Update the existing entry
      const updatedFiles = [...prev];
      updatedFiles[existingIndex].url = file;
      return updatedFiles;
    }

    // Add a new entry if no match is found
    return [
      ...prev,
      { expenseHeaderId, travelRequestId, url: file },
    ];
  });
};
const handleCommentChange = (travelRequestId, expenseHeaderId, key, value) => {
  setComments((prev) => {
    const existingIndex = prev.findIndex(
      (entry) =>
        entry.expenseHeaderId === expenseHeaderId &&
        entry.travelRequestId === travelRequestId
    );

    if (existingIndex !== -1) {
      // Update the existing comment
      const updatedComments = [...prev];
      updatedComments[existingIndex][key] = value;
      return updatedComments;
    }

    // Add a new comment entry
    return [
      ...prev,
      {
        travelRequestId,
        expenseHeaderId,
        [key]: value,
      },
    ];
  });
};



const handleConfirm = async () => {
    const action = actionType
  //const {travelRequestId,cashAdvanceId,paidBy,expenseHeaderId,selectedFile}= apiData;
  //console.log('action from confirm ', action,apiData);


  let api;

  

  let validConfirm = true;
 console.log('api hitted',action)
 let previewUrl
//  if (selectedFile) {
//   setIsUploading((prev) => ({ ...prev, [action]: { set: true, msg: "" } }));

//   try {
//     // Upload the file to Azure
//     const azureUploadResponse = await uploadFileToAzure(selectedFile, blob_endpoint, az_blob_container);

//     if (azureUploadResponse.success) {
//       previewUrl = `https://${storage_account}.blob.core.windows.net/${az_blob_container}/${selectedFile.name}`;
//       console.log('File uploaded successfully, bill url:', previewUrl);
//     } else {
//       throw new Error("Failed to upload file to Azure Blob Storage.");
//     }
//   } catch (error) {
//     console.error("Error uploading file to Azure Blob Storage:", error);
//     // setPopupMsgData({showPopup:true, message: error.message, iconCode:"102"})
//     // setTimeout(() => setPopupMsgData(initialPopupData), 3000);
//     setIsUploading((prev) => ({ ...prev, [action]: { set: false, msg: "" } }));
//     return;
//   }
// }


switch (action) {
  case "settleCashAdvance"  :
  case "recoverCashAdvance" :
    api = settleCashAdvanceApi({ tenantId, empId , action, payload:{getFinance:paidBy,selections:selectAll}});
    break;
  case "settleTravelExpense"    :
  case "settleNonTravelExpense" :
    api = settleExpenseApi({ tenantId, empId , action ,payload:{getFinance:paidBy,selections:selectAll}});
    break;
  default:
    return; // If action doesn't match any case, exit the function
}
  if (validConfirm) {
    try {
      setIsUploading(true);
      const response = await api;
     
      setIsUploading(false);
      setModalOpen(false);
      // setShowPopup(true);
      // setMessage(response);
      // setPopupMsgData({showPopup:true, message:response, iconCode: "101"});
      // setTimeout(() => {
      //   fetchData()
      //   setPopupMsgData(initialPopupData);
      //   setIsUploading(false);
      //   setModalOpen(false)
      //   setApiData(null)
      //   iframeRef.current.src = iframeRef.current.src;
      //   window.location.reload();
      // }, 3000);
      window.location.reload();
      window.parent.postMessage({message:"expense message posted", popupMsgData: { showPopup:true, message:response, iconCode: "101" }}, dashboardBaseUrl);
     console.log("response from finance",response)
    } catch (error) {
      // setShowPopup(true);
      // setMessage(error.message);
     // setPopupMsgData({showPopup:true, message:error.message, iconCode: "102"});
      setTimeout(() => {
        setIsUploading(false);
       // setPopupMsgData(initialPopupData);
      }, 3000);
    }

    
  }
}; 


console.log("files for upload", filesForUpload);
console.log("comment for upload", comments);

  const handleSwitchTab = (value)=>{
    setActiveTab(value);
    handleRemoveFile();
    let data;
    let actionType;
    switch(value)
    {
      case "Settle Travel Expenses":
        data = {
          dataType:"travelExpenseData",
          data: settleTravelExpenseData,
        }
        actionType = "settleTravelExpense"
        break;
      case "Settle Cash-Advances":
          data = {
            dataType:"cashAdvance",
            data:settleCashAdvanceData
          }
          actionType="settleCashAdvance"
          break;  
      // case "Recover Cash-Advances":
      //     data = {
      //       dataType:"cashAdvance",
      //       data:settleCashAdvanceData
      //     }
      //     actionType="settleCashAdvance"
      //     break;  
      case "Settle Non-Travel Expenses":
          data = {
            dataType:"nonTravelExpense",
            data:settleNonTravelExpenseData
          }
          actionType="settleNonTravelExpense"
          break;  
    }
    setSelectedData(data);
    setActionType(actionType);
    setSelectAll([]);
  }

  const openModal = (action) => {
    setActionType(action);
    setModalOpen(true);
  };
  
  const handleActionConfirm = (action, apiData) => {
    openModal(action)
    apiData.paidBy= paidBy
    apiData.selectedFile = selectedFile
    const data = {
      message: 'message posted',
      action,
      payload: apiData,
    };
    window.parent.postMessage(data, dashboardBaseUrl);

  };

  const handleGenerateEntry = async (data) => {
    console.log('action from confirm ', data);
   let api = getAccountEntriesData_API({tenantId,empId,data})
   let validConfirm = true;
   console.log('api hitted',api);
    if (validConfirm) {
      try {
        setIsUploading(true);
        const response = await api;
        console.log('account entry response',response)
        setAcEntryData({'travelExpense':response?.travelExpense || [], 'nonTravelExpense': response?.nonTravelExpense || [], 'cash': response?.cash || []})
        setIsUploading(false);
        // setShowPopup(true);
        // setMessage(response);
        // setTimeout(() => {
        //   setShowPopup(false);
        //   setIsUploading(false);
        //   setMessage(null);
        //   setModalOpen(false)
        //   setApiData(null)
        //   iframeRef.current.src = iframeRef.current.src;
        //   //window.location.reload();
        // }, 3000);

      } catch (error) {
        console.log('error from entry',error.message)
        setIsUploading(false)
        window.parent.postMessage({popupMsg:error.message}, dashboardBaseUrl);
        // setShowPopup(true);
        //setMessage(error.message);
        // setTimeout(() => {
        //   setIsUploading(false);
        //   setMessage(null);
        //   setShowPopup(false);
        // }, 3000);
      }
    }
  };

  console.log('account entry',AcEntryData);

  function countTravelData(data, dataKey) {
    console.log("data key",dataKey);
    if(dataKey === "nonTravelExpense")
    {
      return data?.length ||0;

    }else
    {
      return data.reduce((total, trip) => {
        return total + (trip[dataKey]?.length || 0);
      }, 0);

    }
    
  }
  
  

  function Tab () {
    switch (activeTab) {
      case "Settle Cash-Advances":
        return dataFilterByDate(settleCashAdvanceData).map((trip, index)=>( <SettleCashAdvance selectAll={selectAll} handleSelect={handleSelect} comments={comments} filesForUpload={filesForUpload} handleFileUpload={handleFileUpload}  handleCommentChange={handleCommentChange} trip={trip} key={index} handleActionConfirm={handleActionConfirm} handleRemoveFile={handleRemoveFile} setFileId={setFileId} fileId={fileId} fileSelected={fileSelected} setFileSelected={setFileSelected} selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>));
      case "Recover Cash-Advances":
        return dataFilterByDate(recoverCashAdvanceData).map((trip, index)=>( <RecoverCashAdvance trip={trip} key={index} handleActionConfirm={handleActionConfirm} handleRemoveFile={handleRemoveFile} setFileId={setFileId} fileId={fileId} fileSelected={fileSelected} setFileSelected={setFileSelected} selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>));
      case "Settle Travel Expenses":
        return settleTravelExpenseData?.map((expense,index)=>( <SettleTravelExpense length={countTravelData(settleTravelExpenseData, "travelExpenseData")}  selectAll={selectAll} comments={comments} filesForUpload={filesForUpload} handleFileUpload={handleFileUpload}  handleCommentChange={handleCommentChange}  handleSelect={handleSelect}   trip={expense} key={index} handleActionConfirm={handleActionConfirm} handleRemoveFile={handleRemoveFile} fileSelected={fileSelected} setFileId={setFileId} fileId={fileId} setFileSelected={setFileSelected} selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>));
      case "Settle Non-Travel Expenses":
        return settleNonTravelExpenseData.map((expense,index)=>( <SettleNonTravelExpense length={countTravelData(settleTravelExpenseData, "travelExpenseData")}  selectAll={selectAll} comments={comments} filesForUpload={filesForUpload} handleFileUpload={handleFileUpload}  handleCommentChange={handleCommentChange}  handleSelect={handleSelect}  trip={expense} key={index} handleActionConfirm={handleActionConfirm} handleRemoveFile={handleRemoveFile} fileSelected={fileSelected} setFileId={setFileId} fileId={fileId} setFileSelected={setFileSelected} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />));
      case "Account Entries":
        return <AccountEntry data={AcEntryData}/>;
      default:
        return null; 
     }
   }

    const [searchQuery, setSearchQuery]= useState(null)
    const [selectedRange , setSelectedRange]=useState("")

    const handleTabClick = (range) => {
      setSelectedRange(selectedRange === range ? "" : range);
    };

    const getStatusClass = (status) => {
      return 'bg-indigo-100 text-indigo-600 border border-indigo-600'; // Adjust this based on your styling requirements
    };
    
    const getStatusCount = (status,tripData) => {

      const tripsForBooking =tripData?.tripsForBooking  || []
      
        return filterByTimeRange(tripsForBooking, status).length;

    };

    function dataFilterByDate(data) {
      let filteredData = data;
    
      // if (selectedDateRange) {
      //     filteredData = filterByTimeRange(filteredData, selectedDateRange);
      // }
    
      if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredData = filteredData.filter(trip => JSON.stringify(trip).toLowerCase().includes(query));
      }
    
      return filteredData;
    }

    

    const tabs = [
      { name: "Settle Cash-Advances", count: settleCashAdvanceData.length },
      { name: "Recover Cash-Advances", count: recoverCashAdvanceData.length },
      { name: "Settle Travel Expenses", count: settleTravelExpenseData.length },
      { name: "Settle Non-Travel Expenses", count: settleNonTravelExpenseData.length },
      { name: "Account Entries", count: 0 } // assuming no count for this
    ];

    const getTitle = () => {
      switch (actionType) {
        case 'settleCashAdvance':
          return 'Settle Cash-Advance';
        case 'recoverCashAdvance':
          return 'Recover Cash-Advance';
        case 'settleTravelExpense':
          return 'Settle Travel Expense';
        case 'settleNonTravelExpense':
          return 'Settle Non-Travel Expense';
        default:
          return '';
      }
    };
  
    const getContent = () => {
      switch (actionType) {
        case 'settleCashAdvance':
        case 'recoverCashAdvance':
        case 'settleTravelExpense':
        case 'settleNonTravelExpense':
          return (
            <>
            <p className="text-md px-4 text-start font-cabin text-neutral-600">
    {actionType === "settleCashAdvance"
      ? 'Once you settle, the cash-advance amount will be paid to the employee.'
      : actionType === "recoverCashAdvance"
      ? 'Once you recover, the cancelled cash-advance amount will be recovered from the employee.'
      : actionType === "settleTravelExpense" ? 'Once you settle, the travel expense amount will be paid to the employee.':'Once you settle, the non-travel expense amount will be paid to the employee.'}
  </p>
  {/* <CommentBox title='Settlement Remarks :' onchange={(e)=>setComment(e.target.value)} value={comment}/> */}
  
        
           
                                  <div className="flex items-center gap-2 mt-10">
                                  <Button1 loading={isUploading} active={isUploading} text='Confirm' onClick={()=>handleConfirm(actionType)} />
                                  <Button   text='Cancel'  onClick={closeModal}/>
                                  </div>
                      </>
          );
       
        default:
          return '';
      }
    };
  return (
    <>
    {isLoading ? 
    <Error message={errorMsg}/> :
    (<div className='p-4 bg-white min-h-screen border-slate-400 w-full h-[100%] flex-col  flex items-start gap-2  '>
      <div className='static md:sticky border p-2 rounded-md top-0 w-full space-y-2 bg-white '>
      <div className=' bg-white  flex  justify-start items-center overflow-x-auto w-full'>
      {
  tabs?.map((tab, index) => (
    <div
      onClick={() => handleSwitchTab(tab.name)}
      key={index}
      className={`text-sm shrink-0 flex justify-center items-center font-cabin text-center truncate h-10 px-2 py-2 ${activeTab === tab.name ? 'border-b-2 border-neutral-900 hover:border-0' : ' '} hover:border-slate-300 hover:border-b-2 hover:text-neutral-500 text-neutral-700 cursor-pointer `}
    >
      <p className="flex items-center justify-center gap-1">
        {tab.name}
        {tab.count > 0 && (
          <div className={`shadow-sm w-5 h-5 shadow-black/30 font-semibold ring-1 rounded-full ring-white min-w-6 min-h-6 flex justify-center items-center text-center text-xs bg-slate-100 text-neutral-700 border border-slate-300 ml-2`}>
            <p>{tab.count}</p>
          </div>
        )}
      </p>
    </div>
  ))
}
      </div>
      <div className=' border border-slate-300  rounded-md  w-full flex flex-wrap items-start gap-2 px-2 py-2'>
    {/* <div className='flex  space-x-2 space-y-2  overflow-x-auto '>
      <div className='flex gap-2  items-center justify-center p-2 bg-slate-100/50 rounded-full border border-slate-300 '>
      <div className='px-4 '>
      <img src={filter_icon} className='min-w-5 w-5 h-5 min-h-5'/>
      </div>
{["draft","pending approval", "pending settlement", "paid","rejected",  "cancelled", "paid and cancelled"].map((status) => {
  const statusCount = getStatusCount(status, [...travelExpenses.flatMap(te => te?.travelExpenses ), ...nonTravelExpenses]);
  const isDisabled = statusCount === 0;
  
  return (
    <div key={status} className={`flex items-center  ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <div
        onClick={() => !isDisabled && handleStatusClick(status)}
        className={`ring-1 ring-white flex py-1 pr-3 text-center rounded-sm ${selectedStatuses.includes(status) ? getStatusClass(status ?? "-") : "bg-slate-100 text-neutral-700 border border-slate-300"}`}
      >
        <p className='px-1 py-1 text-sm text-center capitalize font-cabin whitespace-nowrap '>{status ?? "-"}</p>
      </div>
      <div className={`shadow-md shadow-black/30 font-semibold -translate-x-3 ring-1 rounded-full ring-white w-6 h-6 flex justify-center items-center text-center text-xs ${selectedStatuses.includes(status) ? getStatusClass(status ?? "-") : "bg-slate-100 text-neutral-700 border border-slate-300 "}`}>
        <p>{statusCount}</p>
      </div>
    </div>
  );
})}
 </div>
<div className='text-neutral-700 text-base flex justify-center items-center hover:text-red-200 hover:font-semibold text-center w-auto h-[36px] font-cabin cursor-pointer whitespace-nowrap' onClick={() => setSelectedStatuses([])}>Clear All</div>
</div> */}
{/* <StatusFilter
statuses={["48 Hours", "7 Days", "Within 30 Days", "Beyond 30 Days"]}
tripData={tripData}
selectedStatuses={selectedRange}
handleStatusClick={handleTabClick}
filter_icon={filter_icon}
getStatusClass={getStatusClass}
getStatusCount={getStatusCount}
setSelectedStatuses={setSelectedRange}
/> */}


{activeTab === 'Account Entries' ? 
 <AccountEntryComponent isLoading={isUploading} handleConfirm={handleGenerateEntry} data={AcEntryData} /> :
<div className='flex gap-4'>
<div className='flex flex-row gap-8 w-full items-center'>
<div className=' flex items-center justify-between gap-2'>
<input checked={(selectAll?.length!== 0 && selectAll?.length === countTravelData(selectedData.data, selectedData.dataType))} onChange={handleSelectAll} type='checkbox' className='w-4 h-4 accent-neutral-900'/>
 <div className=' text-center'>
  Select All
 </div>
 </div>
 <SettleNowBtn
  onClick={()=>handleActionConfirm(actionType,"")}
  text={"Settle Now"}/>

</div>
 <Input placeholder="Search Expense..." type="search" icon={search_icon} onChange={(value)=>setSearchQuery(value)}/>

  </div>}
     </div>
       </div>

    <div className=' w-full flex flex-col'>
      {Tab()}
    </div>
  
  </div>)}
  <Modal
        isOpen={modalOpen} 
        onClose={()=>closeModal}
        content={
          <div className='w-full h-auto'>
          <div className='flex gap-2 justify-between items-center text-neutral-900 bg-gray-200/20 w-auto p-4'>
            <div className='flex gap-2'>
              <img src={info_icon} className='w-5 h-5' alt="Info icon"/>
              <p className='font-inter text-base font-semibold text-neutral-900'>
                {getTitle()}
              </p>
            </div>
            <div onClick={() => setModalOpen(false)} className='bg-red-100 cursor-pointer rounded-full border border-white'>
              <img src={cancel} className='w-5 h-5' alt="Cancel icon"/>
            </div>
          </div>
         

          <div className="p-4">
          
            {getContent()}
            
            
          </div>
        </div>}
      /> 

    </>


   

    
   
  )
}

export default Finance







const AccountEntryComponent = ({isLoading, handleConfirm,data}) => {
  const tableData = flattenData(data)
  
  const [filterForm, setFilterForm] = useState({
    startDate: '',
    endDate: '',
    reportType:''
  });

  useEffect(() => {
    const today = new Date();
    const formattedToday = formatDateToYYYYMMDD(today);
    setFilterForm({
      startDate: formattedToday,
      endDate: formattedToday,
      reportType:'all'
    });
  }, []);

  const handlePresetChange = (label) => {
    const selectedRange = presetOptions.find(preset => preset.label === label).range;
    setFilterForm(prevForm =>({...prevForm,
      startDate: formatDateToYYYYMMDD(selectedRange[0]),
      endDate: formatDateToYYYYMMDD(selectedRange[1])
    }));
  };
  const reportTypes = [{title:'All',name:'all'},{ title:'Cash-Advances' ,name:"cash"}, {title:'Travel Expenses',name:'travel'},{title: 'Non-Travel Expenses', name:'nonTravel'}]
  
  const handleFilterForm = (key, value) => {
    console.log('value', value);
    
    if (key === 'reportType') {
      // Find the selected report type object based on the title
      const selectedReportType = reportTypes.find(item => item.title === value);
      
      // Store the 'name' property of the selected report type
      setFilterForm(prevForm => ({
        ...prevForm,
        [key]: selectedReportType ? selectedReportType.name : '' // Use an empty string if not found
      }));
    } else {
      setFilterForm(prevForm => ({
        ...prevForm,
        [key]: value
      }));
    }
  };

  const formatDateToYYYYMMDD = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const presets = () => {
    const today = new Date();
    const ranges = calculateDateRanges(today,1);

    return [
      { label: 'Today', range: [today, today] },
      { label: 'Yesterday', range: [ranges.subtractedDate, ranges.subtractedDate] },
      { label: 'Last 7 Days', range: [calculateDateRanges(today, 6).subtractedDate, today] },
      { label: 'This Week', range: [ranges.startWeek, ranges.endWeek] },
      { label: 'This Month', range: [ranges.startMonth, ranges.endMonth] }
    ];
  };

  console.log('filter data', filterForm)

  const presetOptions = presets();

  const handleDownloadfile=(file)=>{
    const fileName = `Account_Entry(${filterForm.startDate}-${filterForm.endDate})`
    if(tableData.length===0){
      console.log('table data not available')
    }else{
      if(file === 'PDF'){
        //handleCSVDownload(json.employees)
      }else if (file === 'CSV'){
        console.log('CSV data',tableData)
        handleCSVDownload(tableData,fileName)
      }
    }
  }
  

  return (
    <>
    <div className='flex flex-col md:flex-row gap-2 md:gap-8 items-start border-b border-slate-300 p-4 w-full '>
    <div className='flex-1 w-full'>
      <Select
        variant='min-w-[200px] w-full'
        options={reportTypes.map((item)=>(item.title))}
        onSelect={(value) => handleFilterForm('reportType', value)}
        title="Report Type"
      />
    </div>
  
    <div className='flex flex-col md:flex-row gap-4 md:gap-8 items-center w-full'>
      <Select
        variant='lg:max-w-[150px]'
        options={presetOptions.map(preset => preset.label)}
        onSelect={(value) => handlePresetChange(value)}
        title="Custom"
      />
      
      <div className='flex sm:flex-row flex-col gap-2 md:gap-4  w-full'>
        <Input1
          title="From"
          type="date"
          value={filterForm.startDate}
          onChange={(value) => handleFilterForm('startDate', value.target.value)}
        />
        <Input1
          title="Till"
          type="date"
          value={filterForm.endDate}
          onChange={(value) => handleFilterForm('endDate', value.target.value)}
        />
      </div>
      
    </div>
   
    
   
  
  </div>
   <div>
   <Button1
     onClick={() => handleConfirm(filterForm)}
     loading={isLoading}
     active={isLoading}
     text='Generate'
   />
   </div>
   <IconOption 
        buttonText={
          <div className='inline-flex justify-center items-center gap-2'>
          <img src={export_icon} className='w-4 h-4 -rotate-90'/>
          <div className='cursor-pointer'>
            <p className='text-base text-neutral-900 font-semibold'>Export As</p>
          </div>
         
          </div>
        }
      >
        {
          [{name:'PDF',icon:pdf_icon}, {name:'CSV',icon:csv_icon }].map((ele)=>(
            
            <div onClick={()=>handleDownloadfile(ele.name)} key={ele.name}  className='flex items-center gap-2 px-2 py-2 hover:bg-gray-200/40 rounded-md cursor-pointer'>
            <img src={ele.icon} className='w-4 h-4'/>
            <p className='font-inter text-neutral-900 text-sm '>{ele.name}</p>
          </div>
          ))
        }
      </IconOption>
   </>
  
  );
};








