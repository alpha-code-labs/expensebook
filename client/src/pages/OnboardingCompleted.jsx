import { useParams } from "react-router-dom"
import Button from "../components/common/Button"
import Icon from "../components/common/Icon"
import { onboardingCompleted_API } from "../utils/api"
import { useEffect } from "react"

export default function (props){

    const {tenantId} = useParams()

    useEffect(()=>{
        //send onboarding completed message to backend
        (async function(){
            try{
                const res = await onboardingCompleted_API({tenantId})
                if(!res.err){
                    //redirect to dashboard, for now google
                    //window.location.href = 'www.google.com'
                    console.log('onboarding completed')
                }
            }catch(e){
                console.log(e)
            }
        })()
    },[])

    return(<>
        <Icon/>
 
        <div className="bg-slate-50 min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
            <div className='px-6 py-10 bg-white rounded shadow'>
                <p className="text-3xl text-center font-cabin">Onboarding Completed !</p>
            </div>
        </div>
    </>)
}