import leftFrame from '../assets/newLeftFrame.svg'
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import { getOnboarderInfo_API } from '../utils/api';
import { useEffect } from 'react'
import Error from '../components/common/Error';
import { camelCaseToTitleCase } from '../utils/handyFunctions';


export default function (props) {
    const [showSkipModal, setShowSkipModal] = useState(false);
    const [onboarderName, setOnboarderName] = useState(null);
    const [isLoading, setIsLoading] = useState(null)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null);
    const navigate = useNavigate();
    const {tenantId} = useParams()


    useEffect(()=>{
        (async function(){
            setIsLoading(true)
          const res = await getOnboarderInfo_API({tenantId})
          if(!res.err){
            const onboarder = res.data.onboarder
            console.log(onboarder)
            if(onboarder.name != undefined && onboarder.name != null){
                const firstName = onboarder.name.split(' ')[0];
                setOnboarderName(firstName??'')
            }
            setIsLoading(false);
            setLoadingErrMsg(false);
          }
        })()
      },[])

    return (
        <>
            {isLoading && <Error message={loadingErrMsg}/>}
            {!isLoading && 
            <div className="flex bg-white w-full h-full overflow-x-hidden font-cabin tracking-tight">
        
                <div className='fixed left-0 top-0 h-[100vh] w-[40vw] flex flex-col justify-center items-center [background:linear-gradient(187.95deg,_rgba(76,_54,_241,_0),_rgba(76,_54,_241,_0.03)_9.19%,_rgba(76,_54,_241,_0.06)_17.67%,_rgba(76,_54,_241,_0.1)_25.54%,_rgba(76,_54,_241,_0.14)_32.86%,_rgba(76,_54,_241,_0.19)_39.72%,_rgba(76,_54,_241,_0.25)_46.19%,_rgba(76,_54,_241,_0.31)_52.36%,_rgba(76,_54,_241,_0.38)_58.3%,_rgba(76,_54,_241,_0.46)_64.08%,_rgba(76,_54,_241,_0.53)_69.79%,_rgba(76,_54,_241,_0.62)_75.51%,_rgba(76,_54,_241,_0.71)_81.31%,_rgba(76,_54,_241,_0.8)_87.28%,_rgba(76,_54,_241,_0.9)_93.48%,_#4c36f1)]'>
                <img src={leftFrame} />
                </div>
        
                <div className='absolute left-0 w-[100%] md:left-[50%] md:w-[50%] top-0 overflow-x-hidden flex justify-center items-center'>
                    <div class="pr-8 py-8 w-full">
                    <h1 class="text-3xl font-bold mb-4">{`${camelCaseToTitleCase(onboarderName)}, Welcome to Expensebook.AI!`}</h1>

                    <p class="text-gray-600 mb-6">Congratulations on taking the first step toward effortless expense management!</p>

                    <p class="text-gray-800 mb-6">We're thrilled to have you on board. In the next few minutes, we'll guide you through a seamless onboarding experience to set up your Expensebook account.</p>

                    <div class="mb-6">
                        <strong class="block mb-2 font-cabin">What to expect:</strong>
                        <ul class="list-disc pl-5">
                            <li>Personalized Setup: We'll tailor the onboarding process to suit your business and company needs.</li>
                            <li>Quick and Easy: Our user-friendly interface makes setup a breeze.</li>
                            <li>Flexibility as per your needs: Customise expensebook as per your companies needs.</li>
                        </ul>
                    </div>

                    <p class="text-gray-800 mb-6">Let's get started!</p>

                    <div className='flex flex-row-reverse mt-20 pr-20'>
                        <div className='w-[200px]'>
                            <div onClick={()=>navigate(`/${tenantId}/company-info`)} className={` w-fit bg-indigo-600 hover:bg-indigo-500  text-white cursor-pointer h-12 px-8 py-4 rounded-[32px] justify-center items-center gap-2 inline-flex`}>
                                <div className="w-full h-5 text-center text-white text-base font-medium font-cabin flex gap-1 items-center">
                                    Next
                                </div>
                            </div>
                        </div>
                    </div>

                    </div>
                </div>
        
            </div> }
        </>
      );

  }

