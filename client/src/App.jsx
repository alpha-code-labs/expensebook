import { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import SignUp from './pages/SignUp';
import VerifyUser from './pages/VerifyUser';
import Login from './pages/Login';
import UpdatePassword from './pages/UpdatePassword';
import PopupMessage from './components/common/PopupMessage';

function App() {
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
