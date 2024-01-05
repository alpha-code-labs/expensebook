import Button from "../../components/common/Button"
import { useEffect, useState } from "react"
import Checkbox from "../../components/common/Checkbox"
import { getTenantAdvanceSettlementOptions_API, updateFormState_API, updateTenantAdvanceSettlementOptions_API } from "../../utils/api"
import Error from "../../components/common/Error"


export default function ({tenantId}){
    const [options, setOptions] = useState({Cash:false, Cheque:false, ['Salary Account']:false, ['Prepaid Card']:false, ['NEFT Bank Transfer']:false})
    const [loading, setLoading] = useState(true)
    const [loadingError, setLoadingError] = useState(null)

    useEffect(()=>{
        (async function(){
            setLoading(true)
            const res = await getTenantAdvanceSettlementOptions_API({tenantId})
            if(res.err){
                setLoadingError(res.err)
                return
            }

            console.log(res.data)

            const advanceSettlementOptions = res.data.advanceSettlementOptions
            if(Object.keys(advanceSettlementOptions).length > 0){
                setOptions(advanceSettlementOptions)
            }
            setLoading(false)
            setLoadingError(null)    
        })()
    }, [])

    const handleOptionSelection = (e, optionKey) => {
        setOptions(pre=>({...pre, [optionKey]:e.target.checked}))
    }

    const saveExpenseSettlementOptions = async () =>{
        setLoading(true)
        const res = await updateTenantAdvanceSettlementOptions_API({tenantId, advanceSettlementOptions:options}) 
        setLoading(false)
        if(res.err){
            alert('Could not update Cash Advance Settlement options. Please try again later')
            return
        }
        
        alert('Expense Settlement Options Updated !')
        
    }


    return(<>
        
        {loading && <Error message={loadingError} />}
        {!loading && <div className="bg-slate-50 min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
            <div className='px-6 py-10 bg-white rounded shadow'>
                <div className="flex justify-between">
                    <div className="gap-2">
                        <p className="text-neutral-700 text-xl font-semibold tracking-tight">
                            Advance Settlement options
                        </p>
                        <p className="text-gray-600 text-sm font-normal font-cabin" >
                            Here you can select modes by which your organization pays out cash advance
                        </p>
                    </div>
                </div>
                <hr className="mt-8" />

                <div className='mt-10'>
                    {Object.keys(options).map((option,index) => {
                        return <div key={index} className='flex justify-between items-center px-6 py-4 border-b border-grey-200'>
                            <div className='text text-md font-cabin text-neutral-700'>{option}</div>
                            <div className='text text-base font-cabin text-neutral-700'>
                                <Checkbox checked={options[option]} id={index} onClick={(e, id)=>handleOptionSelection(e, Object.keys(options)[id])} />
                            </div>
                        </div>
                    })}    
                </div>

                <div className="mt-10 w-full flex flex-row-reverse justify-between">
                    <Button variant='fit' text='Save Advance Settlement Options' onClick={()=>saveExpenseSettlementOptions()} />
                </div>

            </div>
        </div>}
    </>)
}