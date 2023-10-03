import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { HRCompany } from './components/api/HRCompanyDataContext';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>  
    <HRCompany>
      <App />
    </HRCompany>
  </React.StrictMode>
);
  
