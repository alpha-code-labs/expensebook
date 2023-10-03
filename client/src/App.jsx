import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
//import axios from 'axios'

import "./App.css";
import Page_1 from './pages/Page_1'
import Page_2 from './pages/Page_2'
import Page_3 from './pages/Page_3'
import Page_4 from './pages/Page_4'



function App() {
  
  const TRAVEL_MICROSERVICE_SERVER_URL = "";
  
  //flags
  
/*
  axios
    .get(`${TRAVEL_MICROSERVICE_SERVER_URL}/initial-data`)
    .then((response) => {

    })
    .catch(err=>{ 
      console.err(err)
      //handle possible scenarios
    })
*/

  return <>
    <Router>
      <Routes>
        <Route path='/' element={<Page_1 />} />
        <Route path='/section0' element={<Page_1 />} />
        <Route path='/section1' element={<Page_2 />} />
        <Route path='/section2' element={<Page_3 />} />
        <Route path='/section3' element={<Page_4 />} />
      </Routes>
    </Router>
  </>;
}

export default App;
