import Button from "../../components/common/Button"
import { useEffect, useState } from "react"
import axios from 'axios'
import Checkbox from "../../components/common/Checkbox"
import { updateFormState_API } from "../../utils/api"
import Error from "../../components/common/Error"
import Prompt from "../../components/common/Prompt"
import MainSectionLayout from "../../layouts/MainSectionLayout"


const ONBOARDING_API = import.meta.env.VITE_PROXY_URL

export default function ({tenantId}){
    const [options, setOptions] = useState({Cash:false, Cheque:false, ['Salary Account']:false, ['Prepaid Card']:false, ['NEFT Bank Transfer']:false})
    const [networkStates, setNetworkStates] = useState({isLoading:false, isUploading:false, loadingErrMsg:null})
    const [prompt, setPrompt] = useState({showPrompt:false, promptMsg:false})

    useEffect(()=>{
        (async function(){
            try{
                setNetworkStates(pre=>({...pre, isLoading:true, loadingErrMsg:null}))
                const res = await axios.get(`${ONBOARDING_API}/tenant/${tenantId}/advance-settlement-options`)
                const advanceSettlementOptions = res.data.advanceSettlementOptions

                if(Object.keys(advanceSettlementOptions).length > 0){
                    setOptions(advanceSettlementOptions)
                }
                
                if(res.status == 200){
                    setNetworkStates(pre=>({...pre, isLoading:false, loadingErrMsg:null}))    
                }

            }catch(e){
                if(e.response){
                    if(e.response.status == 404){
                        setNetworkStates(pre=>({...pre, loadingErrMsg:'Requested resource not found'}))
                    }
                    else{
                        setNetworkStates(pre=>({...pre, loadingErrMsg:'Something went wrong, please try again later'}))
                    }
                }
                else if(e.request){
                    setNetworkStates(pre=>({...pre, loadingErrMsg:'Internal server error'}))
                }
                else{
                    setNetworkStates(pre=>({...pre, loadingErrMsg:'Something went wrong, can not place this request at the moment'}))
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
            setNetworkStates(pre=>({...pre, isUploading:true}))
            const res = await axios.post(`${ONBOARDING_API}/tenant/${tenantId}/advance-settlement-options`, {advanceSettlementOptions:options})
            setNetworkStates(pre=>({...pre, isUploading:false}))

            if(res.status == 200){
                setPrompt({showPrompt:true, promptMsg: 'Advance Settlement Options Updated !', success: true })
                updateFormState_API({tenantId, state:'/others/cash-expense-settlement-options'}) 
            }
        }
        catch(e){
            if(e.response){

            }
            else if(e.request){

            }
            else{

            }

            setPrompt({showPrompt:true, promptMsg: "Cant save changes at the moment, please try again later", success: true })
        }
    }


    return(<>
    <MainSectionLayout>
        {networkStates.isLoading && <Error message={networkStates.loadingErrMsg}/>}

        {!networkStates.isLoading &&
            <div className='px-6 py-10 bg-white'>
                <div className="flex justify-between">
                    <div className="gap-2">
                        <p className="text-neutral-700 text-xl font-semibold tracking-tight">
                            Cash Advance Settlement options
                        </p>
                        <p className="text-gray-600 text-sm font-normal font-cabin" >
                            Here you can set modes by which your organization pays out cash advance
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

                <div className="mt-10 w-full flex justify-end">
                    {/* <Button variant='fit' text='Save As draft' onClick={handleSaveAsDraft} /> */}
                    <Button isLoading={networkStates.isUploading} variant='fit' text='Save Advance Settlement Options' onClick={()=>saveExpenseSettlementOptions()} />
                </div>

                <Prompt prompt={prompt} setPrompt={setPrompt} timeout={2700}/>
            </div>
        }
    </MainSectionLayout>
    </>)
}