import Button from "../../components/common/Button"
import Icon from "../../components/common/Icon"
import { useNavigate, useParams } from "react-router-dom"
import HollowButton from "../../components/common/HollowButton"
import { useEffect, useState } from "react"
import axios from 'axios'
import Checkbox from "../../components/common/Checkbox"



export default function (props){
    const navigate = useNavigate()
    const {tenantId} = useParams()
    const [options, setOptions] = useState({Cash:false, Cheque:false, ['Salary Account']:false, ['Prepaid Card']:false, ['NEFT Bank Transfer']:false})
    const [loading, setLoading] = useState(true)
    const [loadingError, setLoadingError] = useState(null)

    useEffect(()=>{
        (async function(){
            try{
                const res = await axios.get(`http://localhost:8001/api/tenant/${tenantId}/expense-settlement-options`)
                const expenseSettlementOptions = res.data.expenseSettlementOptions

                if(Object.keys(expenseSettlementOptions).length > 0){
                    setOptions(expenseSettlementOptions)
                }
                
                if(res.status == 200){
                    setLoading(false)
                    setLoadingError(null)    
                }

            }catch(e){
                if(e.response){
                    if(e.response.status == 404){
                        setLoadingError('Requested resource not found')
                    }
                    else{
                        setLoadingError('Something went wrong, please try again later')
                    }
                }
                else if(e.request){
                    setLoadingError('Internal server error')
                }
                else{
                    setLoadingError('Something went wrong, can not place this request at the moment')
                }

                console.log(e)
            }
        })()
    }, [])

    const handleOptionSelection = (e, optionKey) => {
        setOptions(pre=>({...pre, [optionKey]:e.target.checked}))
    }

    const saveExpenseSettlementOptions = async () =>{
        
        try{
            const res = await axios.post(`http://localhost:8001/api/tenant/${tenantId}/expense-settlement-options`, {expenseSettlementOptions:options})
            if(res.status == 200){
                alert('Expense Settlement Options Updated !')
                //navigate()
            }
        }
        catch(e){
            if(e.response){

            }
            else if(e.request){

            }
            else{

            }

            alert('Cant save changes at the moment, please try again later')
        }
    }

    return(<>
        
        <Icon/>
        {loading && <div className="bg-slate-50 min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
            <div className='px-6 py-10 bg-white rounded shadow'>
                {loadingError? loadingError : 'loading..'}
            </div>
        </div>}
        {!loading && <div className="bg-slate-50 min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
            <div className='px-6 py-10 bg-white rounded shadow'>
                <div className="flex justify-between">
                    <div className="gap-2">
                        <p className="text-neutral-700 text-xl font-semibold tracking-tight">
                            Expense Settlement options
                        </p>
                        <p className="text-gray-600 text-sm font-normal font-cabin" >
                            Here you can select modes by which your organization pays out expenses done by employee
                        </p>
                    </div>
                    <div className="">
                        <HollowButton title='Skip' showIcon={false} />
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

                <div className="mt-10 w-full">
                    <div className="w-fit">
                        <Button text='Save Expense Settlement Options' onClick={()=>saveExpenseSettlementOptions()} />
                    </div>
                </div>

            </div>
        </div>}
    </>)
}