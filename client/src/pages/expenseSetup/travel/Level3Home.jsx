import Button from "../../../components/common/Button"
import { useNavigate, useParams, useLocation, Route} from "react-router-dom"
import HollowButton from "../../../components/common/HollowButton"
import internatinal_travel_icon from '../../../assets/in-flight.svg'
import domestic_travel_icon from '../../../assets/briefcase.svg'
import local_travel_icon from '../../../assets/map-pin.svg'
import arrow_down from "../../../assets/chevron-down.svg";
import Modal from "../../../components/common/Modal"
import { useState, useEffect } from "react"
import back_icon from "../../../assets/arrow-left.svg"
import Error from "../../../components/common/Error"
import MainSectionLayout from "../../MainSectionLayout"
import Prompt from "../../../components/common/Prompt"
import { postProgress_API } from "../../../utils/api"

export default function ({progress, setProgress}){
    const location = useLocation()
    const navigate = useNavigate()
    const {tenantId} = useParams()
    const [showSkipModal, setShowSkipModal] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)

    useEffect(()=>{
        if(showSkipModal){
            document.body.style.overflow = 'hidden'
        }
        else{
            document.body.style.overflow = 'visible'
        }
    },[showSkipModal])




    const [prompt, setPrompt] = useState({showPrompt:false, promptMsg:null})
    const [isUploading, setIsUploading] = useState(false);
    const [networkStates, setNetworkStates] = useState({isLoading:false, isUploading:false, errMsg:null})

    const handleContinue = async ()=>{
        try{
             //update categories
        setNetworkStates(pre=>({...pre, isUploading:true}))
        const progress_copy = JSON.parse(JSON.stringify(progress));

        progress_copy.sections['section 3'].subsections.forEach(subsection=>{
            if(subsection.name == 'Travel Allocations') subsection.completed = true;
        });

        progress_copy.sections['section 3'].subsections.forEach(subsection=>{
            if(subsection.name == 'Travel Allocations') subsection.completed = true;
        });

        const markCompleted = !progress_copy.sections['section 3'].subsections.some(subsection=>!subsection.completed)

        let totalCoveredSubsections = 0;
        progress_copy.sections['section 3'].subsections.forEach(subsection=>{
            if(subsection.completed) totalCoveredSubsections++;
        })

        progress_copy.sections['section 3'].coveredSubsections = totalCoveredSubsections; 

        if(markCompleted){
            progress_copy.sections['section 3'].state = 'done';
            if(progress.maxReach==undefined || progress.maxReach==null || progress.maxReach.split(' ')[1] < 4){
                progress_copy.maxReach = 'section 4';
              }
        }else{
            progress_copy.sections['section 3'].state = 'attempted';
        }

        const progress_res = await postProgress_API({tenantId, progress: progress_copy})

        setNetworkStates(pre=>({...pre, isUploading:false}))

        if(progress_res.err ){
            setPrompt({showPrompt:true, promptMsg:'Can not update data at the moment. Please try again later'})
        }
        else{
            setPrompt({showPrompt:true, promptMsg:'Travel Allocation setup saved successfully'})
            setProgress(progress_copy);
            setTimeout(()=>{
                navigate(`/${tenantId}/setup-expensebook`)
            }, 3000)
        }
        }catch(e){
            console.error('some error occured..', e)
        }
    }



    return(<>
    <MainSectionLayout>
        {<>   
            
            <div className='px-6 py-10 bg-white'>
                    {/* back button and title */}
                <div className='flex gap-4 sticky top-20'>
                    <div className='w-6 h-6 cursor-pointer' onClick={()=>navigate(-1)}>
                        <img src={back_icon} />
                    </div>

                    <div className='flex gap-2'>
                        <p className='text-neutral-700 text-base font-medium font-cabin tracking-tight'>
                            Setup Expense Book
                        </p>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-4">
                    <CollapsedPolicy 
                        onClick={() => navigate('international')}
                        text='International Travel'
                        icon={internatinal_travel_icon}/>

                    <CollapsedPolicy 
                        onClick={() => navigate('domestic')}
                        text='Domestic Travel'
                        icon={domestic_travel_icon}/>

                    <CollapsedPolicy 
                        onClick={() => navigate('local')}
                        text='Local Travel'
                        icon={local_travel_icon}/>
                </div>

                <Prompt prompt={prompt} setPrompt={setPrompt}/>

                <div className='flex mt-10 flex-row-reverse'>
                    {/* <Button variant='fit' text='Save As Draft' onClick={handleSaveAsDraft} /> */}
                    <Button variant='fit' text='Continue' isLoading={networkStates.isUploading} onClick={handleContinue} />
                </div>

            </div>
            
            <Modal skippable={false} showModal={showSkipModal} setShowModa={setShowSkipModal}>
                <div className="p-10">
                    <p className="text-neutral-700 text">
                        If you skip this section you won't be able to track your expenses.
                    </p>
                    <div className=' mt-10 flex flex-wrap justify-between'>
                        <div className='w-fit'>
                            <Button text='Ok' onClick={()=>setShowSkipModal(false)} />
                        </div>
                        <div className='w-fit'>
                            <HollowButton title='Skip For Now' showIcon={false} onClick={()=>navigate(`/${tenantId}/others`)} />
                        </div>
                    </div>
                </div>
            </Modal>

            <Prompt prompt={prompt} setPrompt={setPrompt}/>
        </>}
    </MainSectionLayout>
    </>)
}


function CollapsedPolicy(props){
    const icon = props.icon
    const text = props.text || 'Enter text'
    const onClick = props.onClick || (() => {})

    return(
        <>
            <div onClick={onClick} className="w-full h-[72px] p-6 relative bg-white cursor-pointer rounded-xl border border-neutral-200">
                <div className="flex justify-between items-center">
                    <div className="justify-start items-center gap-8 inline-flex">
                        <div className="justify-start items-center gap-6 flex">
                            <div className="w-6 h-6 relative">
                                <img src={icon} />
                            </div>
                            <div className="text-neutral-700 text-base font-medium font-['Cabin']">{text}</div>
                        </div>
                    </div>

                    <div className="justify-start gap-12 items-start gap-2 inline-flex">
                        <div className="w-6 h-6 -rotate-90">
                            <img src={arrow_down} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}