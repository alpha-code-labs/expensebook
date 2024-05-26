import React from 'react'
import { BrowserRouter, Route , Routes} from 'react-router-dom'
import Menu from './components/Menu'; 


const App = () => {
  return (
   <BrowserRouter>
   <Routes>
   <Route  path='/' element={<Menu/>}/>
   </Routes>
   </BrowserRouter>
  )
}

export default App