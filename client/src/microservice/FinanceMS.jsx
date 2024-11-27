import React, { useState, useEffect, useRef } from 'react';
import { cancel, info_icon } from '../assets/icon';
import Modal from '../components/common/Modal1';
import Button1 from '../components/common/Button1';
import Button from '../components/common/Button';
import PopupMessage from '../components/common/PopupMessage';
import CommentBox from '../components/common/CommentBox';
import { settleCashAdvanceApi, settleExpenseApi } from '../utils/api';
import { useParams } from 'react-router-dom';
import uploadFileToAzure from '../utils/azureBlob';
import {useData} from '../api/DataProvider'



const FinanceMS = ({ visible, setVisible, src,fetchData }) => {

  const {initialPopupData,setPopupMsgData} = useData();

  const az_blob_container = import.meta.env.VITE_AZURE_BLOB_CONTAINER
  const storage_sas_token = import.meta.env.VITE_AZURE_BLOB_SAS_TOKEN
  const storage_account = import.meta.env.VITE_AZURE_BLOB_ACCOUNT
  const blob_endpoint = `https://${storage_account}.blob.core.windows.net/?${storage_sas_token}`

  const  iframeRef = useRef(null);

  const settlementBaseUrl = import.meta.env.VITE_SETTLEMENT_PAGE_URL
  const {tenantId, empId} = useParams()
  const [modalOpen , setModalOpen]=useState(false);
  const [actionType, setActionType] = useState(true); 
  const [isUploading,setIsUploading]=useState(false);
  // const [showPopup, setShowPopup] = useState(false);
  // const [message, setMessage] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [comment, setComment]=useState("");


  const closeModal=()=>{
    setModalOpen(!modalOpen);
    
  }


  const openModal = (action) => {
    setActionType(action);
    setModalOpen(true);
  };


 const handleConfirm = async (action) => {
    
    const {travelRequestId,cashAdvanceId,paidBy,expenseHeaderId,selectedFile}= apiData;
    console.log('action from confirm ', action,apiData);


    let api;
  
    
  
    let validConfirm = true;
   console.log('api hitted',api)
   let previewUrl
   if (selectedFile) {
    setIsUploading((prev) => ({ ...prev, [action]: { set: true, msg: "" } }));

    try {
      // Upload the file to Azure
      const azureUploadResponse = await uploadFileToAzure(selectedFile, blob_endpoint, az_blob_container);

      if (azureUploadResponse.success) {
        previewUrl = `https://${storage_account}.blob.core.windows.net/${az_blob_container}/${selectedFile.name}`;
        console.log('File uploaded successfully, bill url:', previewUrl);
      } else {
        throw new Error("Failed to upload file to Azure Blob Storage.");
      }
    } catch (error) {
      console.error("Error uploading file to Azure Blob Storage:", error);
      setPopupMsgData({showPopup:true, message: error.message, iconCode:"102"})
      setTimeout(() => setPopupMsgData(initialPopupData), 3000);
      setIsUploading((prev) => ({ ...prev, [action]: { set: false, msg: "" } }));
      return;
    }
  }


  switch (action) {
    case "settleCashAdvance":
    case "recoverCashAdvance":
      
      api = settleCashAdvanceApi({ tenantId, empId, travelRequestId, cashAdvanceId , action, payload:{getFinance:paidBy,settlementDetails:[{comment,url:previewUrl}]}});
      break;
    case "settleTravelExpense":
    case "settleNonTravelExpense":
      api = settleExpenseApi({ tenantId, empId , travelRequestId,expenseHeaderId,action ,payload:{getFinance:paidBy,settlementDetails:[{comment,url:previewUrl}]}});
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
        setPopupMsgData({showPopup:true, message:response, iconCode: "101"});
        setTimeout(() => {
          fetchData()
          setPopupMsgData(initialPopupData);
          setIsUploading(false);
          setModalOpen(false)
          setApiData(null)
          iframeRef.current.src = iframeRef.current.src;
          //window.location.reload();
        }, 3000);
      } catch (error) {
        // setShowPopup(true);
        // setMessage(error.message);
        setPopupMsgData({showPopup:true, message:error.message, iconCode: "102"});
        setTimeout(() => {
          setIsUploading(false);
          setPopupMsgData(initialPopupData);
        }, 3000);
      }
  
      
    }
  }; 
  
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [modalOpen]);

  useEffect(() => {
    const handleMessage = event => {
      console.log(event)
      // Check if the message is coming from the iframe
      if (event.origin === settlementBaseUrl ) {
        // Check the message content or identifier
        if(event.data.popupMsg){
          // setShowPopup(true)
          // setMessage(event.data.popupMsg)
          setPopupMsgData({showPopup:true, message:event.data.popupMsg, iconCode:"101"})
          setTimeout(()=>(
            // setShowPopup(false),
            //  setMessage(null)
            setPopupMsgData(initialPopupData)
          ),5000)
        }else{

        console.log('settlement data',event.data.payload)
        const action = event.data.action
        openModal(action)
        setApiData(event.data.payload)
      }
        
      }
    };
    // Listen for messages from the iframe
    window.addEventListener('message', handleMessage);
  
    return () => {
      // Clean up event listener
      window.removeEventListener('message', handleMessage);
    };
  }, []);


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
<CommentBox title='Settlement Remarks :' onchange={(e)=>setComment(e.target.value)} value={comment}/>

      
         
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

    (
     
     <>
   
   <iframe
   ref={iframeRef}
  src={src}
  className="w-[100%] max-h-screen h-full overflow-hidden "
  title="Embedded Content"
  
  
></iframe>

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

{/* <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/> */}
    
     </>
     
    )
  );
};

export default FinanceMS;


