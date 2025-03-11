import React from 'react'
import ReactDOM from 'react-dom/client'
import { DataProvider } from './api/DataProvider';
import App from './App.jsx'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <DataProvider>
        <App />
      </DataProvider>
  </React.StrictMode>
)
