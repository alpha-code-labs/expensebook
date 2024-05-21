import Button from "../../components/common/Button"
import Icon from "../../components/common/Icon"
import { useNavigate, useParams } from "react-router-dom"
import HollowButton from "../../components/common/HollowButton"
import { useEffect, useState } from "react"
import axios from 'axios'
import Checkbox from "../../components/common/Checkbox"
import { updateFormState_API } from "../../utils/api"
import Error from "../../components/common/Error"
import Prompt from "../../components/common/Prompt"
import MainSectionLayout from "../MainSectionLayout"
import { postProgress_API } from "../../utils/api"


const ONBOARDING_API = import.meta.env.VITE_PROXY_URL

export default function ({progress, setProgress}){
    const navigate = useNavigate()
    const {tenantId} = useParams()
    const [options, setOptions] = useState({Cash:false, Cheque:false, ['Salary Account']:false, ['Prepaid Card']:false, ['NEFT Bank Transfer']:false})
    const [loading, setLoading] = useState(true)
    const [loadingError, setLoadingError] = useState(null)
    const [prompt, setPrompt] = useState({showPrompt:false, promptMsg:false})

    useEffect(()=>{
        (async function(){
            try{
                const res = await axios.get(`${ONBOARDING_API}/tenant/${tenantId}/advance-settlement-options`)
                const advanceSettlementOptions = res.data.advanceSettlementOptions

                if(Object.keys(advanceSettlementOptions).length > 0){
                    setOptions(advanceSettlementOptions)
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
            const res = await axios.post(`${ONBOARDING_API}/tenant/${tenantId}/advance-settlement-options`, {advanceSettlementOptions:options})
            let currentSubSection = 'Cash Advance Settlement Optioins'

            const progress_copy = JSON.parse(JSON.stringify(progress));

            progress_copy.sections['section 6'].subsections.forEach(subsection=>{
                if(subsection.name == currentSubSection) subsection.completed = true;
            });

            progress_copy.sections['section 6'].subsections.forEach(subsection=>{
                if(subsection.name == currentSubSection) subsection.completed = true;
            });

            const markCompleted = !progress_copy.sections['section 6'].subsections.some(subsection=>!subsection.completed)

            let totalCoveredSubsections = 0;
            progress_copy.sections['section 6'].subsections.forEach(subsection=>{
                if(subsection.completed) totalCoveredSubsections++;
            })

            progress_copy.sections['section 6'].coveredSubsections = totalCoveredSubsections; 

            if(markCompleted){
                progress_copy.sections['section 6'].state = 'done';
                progress_copy.maxReach = 'section 6';
            }else{
                progress_copy.sections['section 6'].state = 'attempted';
            }

            const progress_res = await postProgress_API({tenantId, progress: progress_copy})

            if(res.status == 200){
                setPrompt({showPrompt:true, promptMsg: 'Advance Settlement Options Updated !'})
                updateFormState_API({tenantId, state:'/others/cash-expense-settlement-options'})

                setTimeout(()=>{
                    setProgress(progress_copy)
                    navigate(`/${tenantId}/others/cash-expense-settlement-options`)
                }, 3000)
                
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

    const handleSaveAsDraft = async ()=>{
        try{
            const res = await axios.post(`${ONBOARDING_API}/tenant/${tenantId}/advance-settlement-options`, {advanceSettlementOptions:options})
            if(res.status == 200){
                updateFormState_API({tenantId, state:'/others/cash-expense-settlement-options'})
                setPrompt({showPrompt:true, promptMsg: "Cash Advance Settlement Options Updated !" })
                setTimeout(()=>{
                    window.location.href = import.meta.env.VITE_WEB_PAGE_URL
                }, 2700)
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
    <MainSectionLayout>
        {loading && <Error message={loadingError}/>}

        {!loading &&
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
                    <div className="">
                        <HollowButton title='Skip' onClick={()=>navigate(`/${tenantId}/others/cash-expense-settlement-options`)} showIcon={false} />
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

                <div className="mt-10 w-full flex justify-between">
                    {/* <Button variant='fit' text='Save As draft' onClick={handleSaveAsDraft} /> */}
                    <Button variant='fit' text='Save Advance Settlement Options' onClick={()=>saveExpenseSettlementOptions()} />
                </div>

                <Prompt prompt={prompt} setPrompt={setPrompt} timeout={2700}/>
            </div>
        }
    </MainSectionLayout>
    </>)
}