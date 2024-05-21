import Button from "../../components/common/Button"
import Icon from "../../components/common/Icon"
import { useNavigate, useParams } from "react-router-dom"
import HollowButton from "../../components/common/HollowButton"
import { useEffect, useState } from "react"
import axios from 'axios'
import Input from "../../components/common/Input"
import { updateFormState_API } from "../../utils/api"

export default function (props){
    const navigate = useNavigate()
    const {tenantId} = useParams()

    const [loading, setLoading] = useState(true)
    const [loadingError, setLoadingError] = useState(null)
    const [accountLines, setAccountLines] = useState([])


    useEffect(()=>{
        //get tenant expense data
        (async function(){
            try{
                const acc_lines_response = await axios.get(`import.meta.VITE_PROXY_URL/tenant/${tenantId}/account-lines`)

                const accountLines = acc_lines_response.data.accountLines

                if(accountLines.length>0){
                    setAccountLines(accountLines)
                    setLoading(false)
                    setLoadingError(null)
                }
                else{
                    setLoadingError('data not found for setting accountLines')
                }
                console.log(accountLines, 'account lines')
            }
            catch(e){
                if(e.response){
                    console.error(e.response.data)
                    setLoadingError('Sorry, can not fetch account lines data at the moment')
                }
                else if(e.request){
                    console.error('Internal server error', e)
                    setLoadingError('Something went wrong, this is on us! We will fix it soon. Please try again later')
                }
                else{
                    console.error('Something went wrong', e)
                    setLoadingError('Something went wrong, this is on us! We will fix it soon. Please try again later')
                }
            }
        })()

    },[])



    useEffect(()=>{
        console.log(loadingError, 'loading error')
    }, [loadingError])

    useEffect(()=>{
        console.log(accountLines, 'account lines')
    },[accountLines])

    const handleAccountLineChange = (e, index)=>{
        const accountLines_copy = JSON.parse(JSON.stringify(accountLines))
        accountLines_copy[index].accountLine = e.target.value
        setAccountLines(accountLines_copy)
    }   

    const saveAccountLines = async () => {
        //save data to backend
        //do some validation

        try{
            const res = await axios.post(`import.meta.VITE_PROXY_URL/tenant/${tenantId}/account-lines`, {accountLines})
            if(res.status == 200){
                alert('Account Lines Updated !')
                navigate(`/${tenantId}/others/roles`)
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

        const update_res = await updateFormState_API({tenantId, state:'/others/roles'})
    }

    const handleSaveAsDraft = async ()=>{
       
        try{
            const res = await axios.post(`import.meta.VITE_PROXY_URL/tenant/${tenantId}/account-lines`, {accountLines})
            if(res.status == 200){
                alert('Account Lines Updated !')
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


        const update_res = await updateFormState_API({tenantId, state:'/others/account-lines'})
        window.location.href = 'https://google.com'

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
                            Setup Account Lines
                        </p>
                        <p className="text-gray-600 text-sm font-normal font-cabin" >
                            Here you can add Account lines against your expense categories
                        </p>
                    </div>
                    <div className="">
                        <HollowButton title='Skip' onClick={()=>navigate(`/${tenantId}/others/roles`)} showIcon={false} />
                    </div>
                </div>

                <hr className='mt-4' />

                <div className="mt-10 flex flex-col gap-4">
                    {accountLines.length>0 && accountLines.map((accountLine, index)=>(
                        <>
                            <div className="flex flex-wrap gap-4 lg:gap-8 items-center mt-2">
                                <p className='text whitespace-wrap text-base font-cabin text-neutral-700 w-[300px]'>
                                    {accountLine.categoryName}
                                </p>
                                <div className=''>
                                    <Input showTitle={false} value={accountLine.accountLine} placeholder='Account Line' onChange={(e)=>handleAccountLineChange(e, index)} />
                                </div>
                            </div>
                        </>
                    )

                    )}
                </div>
                    
                <div className="mt-10 w-full flex justify-between">
                    <Button variant='fit' text='Save As Draft' onClick={handleSaveAsDraft} />
                    <Button variant='fit' text='Save and Continue' onClick={()=>saveAccountLines()} />
                </div>

            </div>
        </div>}
    </>)
}