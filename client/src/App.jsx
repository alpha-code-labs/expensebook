import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LeftPane from './components/LeftPane'
import RenderPage from './pages/RenderPage'
import left_arrow_icon from './assets/arrow-left.svg'

function App() {
  const [currentPage, setCurrentPage] = useState('company-info')
  const dashboard_url = import.meta.env.VITE_DASHBOARD_URL
  const url = window.location.href;
  const tenantId = url.split(':')[2].split('/')[1];
  console.log(url.split(':')[2], 'use params hook')

  return (
    <>
    
    <div className='flex'>
      
      <div className='w-[270px] h-[100vh] max-h-[100vh] overflow-hidden fixed'>
        <LeftPane loadLink={setCurrentPage} dashboardLink={`${dashboard_url}/${tenantId}/overview`} />
      </div>

      <div className='absolute w-[calc(100%-270px)] left-[270px] top-0'>
          <RenderPage page={currentPage} tenantId={tenantId} />
          <div className='fixed right-4 top-4 p-2 bg-white rounded-full'>
            <div className='rounded-full border border-indigo-600 py-2 px-4 cursor-pointer bg-white' onClick={()=> window.location.href = `${dashboard_url}/${tenantId}/overview`}>
                <div className='flex gap-2 items-center'>
                  <img src={left_arrow_icon} className='w-4' />
                  <p className='text-indigo-600 text-sm font-inter'>Back to Dashboard</p>
                </div>
            </div>
          </div>
      </div>

    </div>

    </>
  )
}

export default App
