import React,{useEffect} from 'react'
import { useParams } from 'react-router-dom'
import FinanceMS from '../microservice/FinanceMS'
import Error from '../components/common/Error'
import ReportMS from '../microservice/Report'

const Report = ({isLoading,loadingErrMsg,fetchData}) => {
  const {tenantId,empId}= useParams()
  const reportBaseUrl = import.meta.env.VITE_REPORT_PAGE_URL

  useEffect(()=>{

    fetchData(tenantId,empId)
    

  },[])

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
