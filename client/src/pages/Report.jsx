import React,{useEffect} from 'react'
import { useParams } from 'react-router-dom'
import FinanceMS from '../microservice/FinanceMS'
import Error from '../components/common/Error'
import ReportMS from '../microservice/Report'
import { useData } from '../api/DataProvider'

const Report = ({isLoading,loadingErrMsg,fetchData}) => {
  const {tenantId,empId}= useParams();
  const {setPopupMsgData,initialPopupData} = useData()
  
  const reportBaseUrl = import.meta.env.VITE_REPORT_PAGE_URL

  useEffect(()=>{

    fetchData(tenantId,empId)
    

  },[])


  useEffect(() => {
    const handleMessage = event => {
      console.log('event',event)
      // Check if the message is coming from the iframe
      if (event.origin === reportBaseUrl ) {
         if(event.data.popupMsgData)
          {
            const expensePopupData = event.data.popupMsgData;
            setPopupMsgData(expensePopupData)
            setTimeout(() => {
              setPopupMsgData(initialPopupData); 
            }, 5000);
          }

      }
    };
    // Listen for messages from the iframe
    window.addEventListener('message', handleMessage);
  
    return () => {
      // Clean up event listener
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  

  return (
<>
    {isLoading ? <Error message={loadingErrMsg}/>:
    <div className='h-full'>
      <ReportMS  src={`${reportBaseUrl}/${tenantId}/${empId}`}/>
    </div>}
</>    
  )
}

export default Report
