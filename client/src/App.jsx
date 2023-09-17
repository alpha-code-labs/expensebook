import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const TRAVEL_MICROSERVICE_SERVER_URL = "";
  
  //flags
  

  axios
    .get(`${TRAVEL_MICROSERVICE_SERVER_URL}/initial-data`)
    .then((response) => {

    })
    .catch(err=>{ 
      console.err(err)
      //handle possible scenarios
    })

  return <>
    <Router>
      <Routes>
        <Route path='/travel-request' element={} />
        <Route path='/travel-request/section0' element={} />
        <Route path='/travel-request/section1' element={} />
        <Route path='/travel-request/section2' element={} />
        <Route path='/travel-request/section3' element={} />
        <Route path='/travel-request/section4' element={} />
        <Route path='/travel-request/section5' element={} />
      </Routes>
    </Router>
  </>;
}

export default App;
