import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/common/Sidebar';
import Travel from './pages/Travel';
import Navbar from './components/common/Navbar';
import Overview from './pages/Overview';
import CashAdvance from './pages/CashAdvance';
import Approval from './pages/Approval';
import BookingAdmin from './pages/BookingAdmin';
import Expense from './pages/Expense';


function App() {
  
  return (
    <>     
      <BrowserRouter>
       <Navbar/>
      
      <Sidebar/>
      <Routes>
          <Route path="/" element={<Overview />}/>
          <Route path="/travel" element={<Travel />}/>
          <Route path="/cash-advance" element={<CashAdvance/>}/>
          <Route path="/expense" element={<Expense />}/>
          <Route path="/approval" element={<Approval />}/>
          <Route path="/settlement" element={<Overview />}/>
          <Route path="/booking" element={<BookingAdmin/>}/>         
      </Routes> 
      
      </BrowserRouter>      
    </>
  )
}
export default App


// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import './App.css';
// import Sidebar from './components/common/Sidebar';
// import Page_3 from './pages/Page_3';
// import Page_2 from './pages/Page_2';
// import Page_1 from './pages/Page_1';
// import Overview from './pages/Overview'



// function App() {
  
//   return (
//     <> 
//       <BrowserRouter>
      
//       <div className="overflow-hidden text-left text-base text-gray-9000 font-cabin lg:flex"> 
//       {/* <div className="w-full h-[832px] overflow-hidden text-left text-base text-gray-9000 font-cabin lg:flex">  */}
//       <Sidebar />
//         <Routes>
//           <Route path="/overview"      element={<Page_3 />}/>
//           <Route path="/page2" element={<Page_2 />}/>
//           <Route path="/page3" element={<Page_1 />}/>
//           <Route path="/"element={<Overview />}/>
//         </Routes>
//       </div>
//     </BrowserRouter>      
//     </>
//   )
// }
// export default App
