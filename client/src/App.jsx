import { useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SignUp from './pages/SignUp';
import VerifyUser from './pages/VerifyUser';
import Login from './pages/Login';
import UpdatePassword from './pages/UpdatePassword';
import PopupMessage from './components/common/PopupMessage';

function App() {

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  const message = "You are offline. Please check your internet connection."
  useEffect(()=>{
    if (!isOnline) {
      setPopupMsgData(prev => ({...prev, showPopup:true, message, iconCode:"102"}))
      
    }
    else
    {
      setPopupMsgData(initialPopupData);
    }
  
  },[isOnline])



  const initialPopupData = {
    showPopup:false,
    message:null,
    iconCode:""
  }

  const [popupMsgData, setPopupMsgData]= useState(initialPopupData);

  return (
    <div className='min-w-[100%] min-h-[100%]'>
     <BrowserRouter>
        <Routes>
          <Route path='/sign-up' element={<SignUp  popupMsgData={popupMsgData} setPopupMsgData={setPopupMsgData} initialPopupData={initialPopupData}/>} /> 
          <Route path='/verify-user/:tenantId' element={<VerifyUser  popupMsgData={popupMsgData} setPopupMsgData={setPopupMsgData} initialPopupData={initialPopupData}/>} /> 
          <Route path='/sign-in' element={<Login popupMsgData={popupMsgData} setPopupMsgData={setPopupMsgData} initialPopupData={initialPopupData}/>}/>
          <Route path='/update-password' element={<UpdatePassword popupMsgData={popupMsgData} setPopupMsgData={setPopupMsgData} initialPopupData={initialPopupData}/>} />
        </Routes>
     </BrowserRouter>
     <PopupMessage initialPopupData={initialPopupData} iconCode={popupMsgData?.iconCode} showPopup={popupMsgData?.showPopup} setShowPopup={setPopupMsgData} message={popupMsgData?.message}/>
    </div>
  )
}

export default App
