import React,{useEffect} from 'react'
import { useParams } from 'react-router-dom'
import FinanceMS from '../microservice/FinanceMS'
import Error from '../components/common/Error'

const Settlement = ({isLoading,loadingErrMsg,fetchData}) => {
  const {tenantId,empId}= useParams()
  const settlementBaseUrl = import.meta.env.VITE_SETTLEMENT_PAGE_URL

  useEffect(()=>{

    fetchData(tenantId,empId)

  },[])

  return (
<>
    {isLoading ? <Error />:
    <div className='h-full p-4'>
      <FinanceMS fetchData={fetchData}  src={`${settlementBaseUrl}/${tenantId}/${empId}/settlement`}/>
    </div>}
</>    
  )
}

export default Settlement

