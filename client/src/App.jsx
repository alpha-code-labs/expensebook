import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import TryForFree from './pages/TryForFree'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='min-w-[100%] min-h-[100%]'>
     <BrowserRouter>
        <Routes>
          <Route path='/try-for-free/' element={<TryForFree />} />
        </Routes>
     </BrowserRouter>
    </div>
  )
}

export default App
