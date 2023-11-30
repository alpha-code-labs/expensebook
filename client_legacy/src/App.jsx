import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Page_1 from './pages/Page_1'
import Page_2 from './pages/Page_2'
import Modal from './component/common/Modal';
import Page_3 from './pages/Page_3';

function App() {

  return (
    <>
      
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page_1 />} />
        <Route  path="/page2" element={<Page_2/>}/>
        <Route path="/page3" element={<Page_3/>}/>
        
      </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App
