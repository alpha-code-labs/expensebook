import { useParams } from "react-router-dom"
import Button from "../components/common/Button"
import Icon from "../components/common/Icon"
import { onboardingCompleted_API } from "../utils/api"
import { useEffect, useState } from "react"
import Error from "../components/common/Error"
import React from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'


export default function (props){

    const {tenantId} = useParams()

    const [isLoading, setIsLoading] = useState(true);
    const [loadingErrMsg, setLoadingErrMsg] = useState(null);

    useEffect(()=>{
        //send onboarding completed message to backend
        (async function(){
            try{
                const res = await onboardingCompleted_API({tenantId})
                if(res.err){
                    setLoadingErrMsg(res.err);
                    return;
                }
                if(!res.err){
                    //redirect to dashboard, for now google
                    //window.location.href = 'www.google.com'
                    console.log('onboarding completed')
                    setIsLoading(false)

                    setTimeout(()=>{
                        window.location.href = 'http://192.168.1.7:5177/user-login/Alpha Code Labs'
                    }, 3000)
                }
            }catch(e){
                console.log(e)
            }
        })()
    },[])

    const { width, height } = useWindowSize()

    return(<>
        {isLoading && <Error message={loadingErrMsg}/>}

        {!isLoading && <div>  
            <Confetti
                width={width}
                height={height}
            />
            <Icon/>
            <div className="bg-slate-50 min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
                <div className='px-6 py-10 bg-white rounded shadow'>
                    <p className="text-3xl text-center font-cabin">Onboarding Completed!</p>
                    <p className="text-lg mt-10 text-center font-cabin">Redirecting to the Login Page... Please Login again to view the Dashboard</p>
                </div>
            </div>
        </div>}
    </>)
}