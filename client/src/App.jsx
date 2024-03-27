import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import SignUp from './pages/SignUp'
import UserLogin from './pages/UserLogin'
import Login from './pages/Login'
import UpdatePassword from './pages/UpdatePassword'

function App() {
  
  const [count, setCount] = useState(0)

  return (
    <div className='min-w-[100%] min-h-[100%]'>
     <BrowserRouter>
        <Routes>
          <Route path='/sign-up/' element={<SignUp />} /> 
          <Route path='/user-login/:companyName' element={<UserLogin />} /> 
          <Route path='/user-login' element={<Login/>}/>
          <Route path='/update-password' element={<UpdatePassword/>} />
        </Routes>
     </BrowserRouter>
    </div>
  )
}

export default App
