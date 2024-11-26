import React, { useState, useEffect, useRef } from 'react';
import { cancel, info_icon } from '../assets/icon';
import Modal from '../components/common/Modal1';
import Button1 from '../components/common/Button1';
import Button from '../components/common/Button';
import PopupMessage from '../components/common/PopupMessage';
import { settleCashAdvanceApi, settleExpenseApi } from '../utils/api';
import { useParams } from 'react-router-dom';



const ExpenseMS = ({ visible, setVisible, src }) => {

  const  iframeRef = useRef(null);

  // const expenseBaseUrl = import.meta.env.VITE_EXPENSE_PAGE_URL
  // const {tenantId, empId} = useParams()
  // const [modalOpen , setModalOpen]=useState(false);
  // const [actionType, setActionType] = useState(true); 
  // const [isUploading,setIsUploading]=useState(false);
  // const [showPopup, setShowPopup] = useState(false);
  // const [message, setMessage] = useState(null);
  // const [apiData, setApiData] = useState(null);


  // const closeModal=()=>{
  //   setModalOpen(!modalOpen);
  // }


//   const openModal = (action) => {
//     setActionType(action);
//     setModalOpen(true);
//   };


//  const handleConfirm = async (action) => {
//     console.log('action from confirm ', action);
//     const {travelRequestId,cashAdvanceId,paidBy,expenseHeaderId}= apiData

//     let api;
  
//     switch (action) {
//       case "settleCashAdvance":
//       case "recoverCashAdvance":
        
//         api = settleCashAdvanceApi({ tenantId, empId, travelRequestId, cashAdvanceId , action, paidBy});
//         break;
//       case "settleTravelExpense":
//       case "settleNonTravelExpense":
//         api = settleExpenseApi({ tenantId, empId , travelRequestId,expenseHeaderId,action ,paidBy});
//         break;
//       default:
//         return; // If action doesn't match any case, exit the function
//     }
  
//     let validConfirm = true;
//    console.log('api hitted',api)
//     if (validConfirm) {
//       try {
//         setIsUploading(true);
//         const response = await api;
       
//         setIsUploading(false);
//         setShowPopup(true);
//         setMessage(response);
//         setTimeout(() => {
//           setShowPopup(false);
//           setIsUploading(false);
//           setMessage(null);
//           setModalOpen(false)
//           setApiData(null)
//           iframeRef.current.src = iframeRef.current.src;
//           //window.location.reload();
//         }, 3000);
//       } catch (error) {
//         setShowPopup(true);
//         setMessage(error.message);
//         setTimeout(() => {
//           setIsUploading(false);
//           setMessage(null);
//           setShowPopup(false);
//         }, 3000);
//       }
  
      
//     }
//   }; 
  


  // useEffect(() => {
  //   if (modalOpen) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = 'visible';
  //   }
  // }, [modalOpen]);

//   useEffect(() => {
//     const handleMessage = event => {
//       console.log(event)
//       // Check if the message is coming from the iframe
//       if (event.origin === expenseBaseUrl ) {
//         // Check the message content or identifier
//         if(event.data.popupMsg){
//           setShowPopup(true)
//           setMessage(event.data.popupMsg)
//           setTimeout(()=>(
//             setShowPopup(false),
//              setMessage(null)
//           ),5000)
//         }else{

//         console.log('settlement data',event.data.payload)
//         const action = event.data.action
//         openModal(action)
//         setApiData(event.data.payload)
//       }
        
//       }
//     };
//     // Listen for messages from the iframe
//     window.addEventListener('message', handleMessage);
  
//     return () => {
//       // Clean up event listener
//       window.removeEventListener('message', handleMessage);
//     };
//   }, []);


  // const getTitle = () => {
  //   switch (actionType) {
  //     case 'settleCashAdvance':
  //       return 'Settle Cash-Advance';
  //     case 'recoverCashAdvance':
  //       return 'Recover Cash-Advance';
  //     case 'settleTravelExpense':
  //       return 'Settle Travel Expense';
  //     case 'settleNonTravelExpense':
  //       return 'Settle Non-Travel Expense';
  //     default:
  //       return '';
  //   }
  // };

//   const getContent = () => {
//     switch (actionType) {
//       case 'settleCashAdvance':
//       case 'recoverCashAdvance':
//       case 'settleTravelExpense':
//       case 'settleNonTravelExpense':

//         return (
//           <>
//           <p className="text-md px-4 text-start font-cabin text-neutral-600">
//   {actionType === "settleCashAdvance"
//     ? 'Once you settle, the cash-advance amount will be paid to the employee.'
//     : actionType === "recoverCashAdvance"
//     ? 'Once you recover, the cancelled cash-advance amount will be recovered from the employee.'
//     : actionType === "settleTravelExpense" ? 'Once you settle, the travel expense amount will be paid to the employee.':'Once you settle, the non-travel expense amount will be paid to the employee.'}
// </p>

      
         
//                                 <div className="flex items-center gap-2 mt-10">
//                                 <Button1 loading={isUploading} active={isUploading} text='Confirm' onClick={()=>handleConfirm(actionType)} />
//                                 <Button   text='Cancel'  onClick={closeModal}/>
//                                 </div>
//                     </>
//         );
     
//       default:
//         return '';
//     }
//   };


  return (

    (
     
     <>
   
   <iframe
   ref={iframeRef}
  src={src}
  className="w-[100%] max-h-screen h-full overflow-hidden"
  title="Embedded Content"
  
  
></iframe>

{/* <Modal 
        isOpen={modalOpen} 
        onClose={()=>closeModal}
        content={
          <div className='w-full h-auto'>
          <div className='flex gap-2 justify-between items-center bg-indigo-100 w-auto p-4'>
            <div className='flex gap-2'>
              <img src={info_icon} className='w-5 h-5' alt="Info icon"/>
              <p className='font-inter text-base font-semibold text-indigo-600'>
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
      />  */}

{/* <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/> */}
    
     </>
     
    )
  );
};

export default ExpenseMS;


