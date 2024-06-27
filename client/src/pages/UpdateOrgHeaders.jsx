import Button from "../components/common/Button"
import { useEffect, useState } from "react"
import { getTenantOrgHeaders_API } from "../utils/api"
import Error from "../components/common/Error"
import { camelCaseToTitleCase } from "../utils/handyFunctions"
import UploadAdditionalHeaders from "./expenseAllocations/UploadAdditionalHeaders"


export default function ({tenantId}){
    const [loading, setLoading] = useState(true)
    const [loadingError, setLoadingError] = useState(null)
    const [orgHeaders, setOrgHeaders] = useState([])
    const [showAddHeaderModal, setShowAddHeaderModal] = useState(false)
    const [updatedOrgHeadeers, setUpdatedOrgHeaders] = useState(null)

    useEffect(()=>{
        (async function(){
            setLoading(true)
            const res = await getTenantOrgHeaders_API({tenantId})
            if(res.err){
                setLoadingError(res.err)
                return
            }

            console.log(res.data)

            let orgHeadersData = res.data.orgHeaders
            let tmpOrgHeaders = []
            Object.keys(orgHeadersData).forEach(key => {
                if(orgHeadersData[key].length !== 0){
                    tmpOrgHeaders.push({headerName:key, headerValues:orgHeadersData[key]})
                }
            })

            setOrgHeaders(tmpOrgHeaders)

            setLoading(false)
            setLoadingError(null)    
        })()
    }, [])
    
    return(<>
        
        {loading && <Error message={loadingError} />}
        {!loading && <div className="min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
            <div className='px-6 py-10'>
                <div className="flex justify-between">
                    <div className="gap-2">
                        <p className="text-gray-600 text-base font-semibold font-cabin" >
                            Org Headers
                        </p>
                    </div>
                </div>
                <div className='mt-4 w-fit h-10 inline-flex items-center'>
                    <p className='text-indigo-600 font-cabin text-sm cursor-pointer' onClick={()=>setShowAddHeaderModal(true)}> Add additional org level entities</p>
                </div>
                <hr className="mt-8" />

                <div className='mt-10'>
                    {orgHeaders.map((header, index) => {
                        return <div key={index} className='flex justify-between items-center px-4 py-2 border-b border-grey-200'>
                            <div className='text text-sm font-cabin text-neutral-700'>{camelCaseToTitleCase(header.headerName)}</div>
                        </div>
                    })}    
                </div>
            </div>

            {showAddHeaderModal && 
                <UploadAdditionalHeaders 
                    showAddHeaderModal={showAddHeaderModal} 
                    tenantId={tenantId}
                    setUpdatedOrgHeaders={setUpdatedOrgHeaders}
                    setShowAddHeaderModal={setShowAddHeaderModal} />}

        </div>}
    </>)
}