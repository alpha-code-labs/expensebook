import Button from "../../components/common/Button"
import Icon from "../../components/common/Icon"
import { useNavigate, useParams } from "react-router-dom"
import HollowButton from "../../components/common/HollowButton"
import internatinal_travel_icon from '../../assets/in-flight.svg'
import domestic_travel_icon from '../../assets/briefcase.svg'
import local_travel_icon from '../../assets/map-pin.svg'
import non_travel_icon from '../../assets/paper-money-two.svg'
import arrow_down from "../../assets/chevron-down.svg";
import Checkbox from "../../components/common/Checkbox"
import Modal from "../../components/common/Modal"
import { useState, useEffect } from "react"
import { updateFormState_API } from "../../utils/api"
import MainSectionLayout from "../MainSectionLayout"
import EmptyHRData from "../../components/common/EmptyHRData"
import checkIcon from '../../assets/check.svg'

export default function ({progress, setProgress}){
    const navigate = useNavigate()
    const {tenantId} = useParams()
    const [showSkipModal, setShowSkipModal] = useState(false)

    const [internationalCompleted, setInternationalCompleted] = useState(false);
    const [domesticCompleted, setDomesticCompleted] = useState(false);
    const [localCompleted, setLocalCompleted] = useState(false);
    const [rembursementCompleted, setReimbursementCompleted] = useState(false);

    useEffect(()=>{
        const ip = progress?.sections['section 5']?.subsections.find(section=> section.name == 'International Policies');
        const dp = progress?.sections['section 5']?.subsections.find(section=> section.name == 'Domestic Policies');
        const lp = progress?.sections['section 5']?.subsections.find(section=> section.name == 'Local Policies');
        const rp = progress?.sections['section 5']?.subsections.find(section=> section.name == 'Reimbursement Policies');

        if(ip && ip.completed){
            setInternationalCompleted(true);
        }else setInternationalCompleted(false);

        if(dp && dp.completed){
            setDomesticCompleted(true);
        }else setDomesticCompleted(false);

        if(lp && lp.completed){
            setLocalCompleted(true);
        }else setLocalCompleted(false);

        if(rp && rp.completed){
            setReimbursementCompleted(true);
        }else setReimbursementCompleted(false);

    },[]);


    useEffect(()=>{
        if(showSkipModal){
            document.body.style.overflow = 'hidden'
        }
        else{
            document.body.style.overflow = 'visible'
        }
    },[showSkipModal])

    const handleSaveAsDraft = async ()=>{
        const update_res = await updateFormState_API({tenantId, state:'/setup-company-policies'})
        if(update_res.err){

        }

        //navigate
        window.location.href = 'https://google.com'
    }
    
    const handleContinue = async ()=>{
        const update_res = await updateFormState_API({tenantId, state:'/non-travel-expenses'})
        if(update_res.err){

        }


        setProgress(pre=>({...pre, activeSection: 'section 6', maxReach:'section 6'}))
        navigate(`/${tenantId}/others`)
    }

    return(<>
        <MainSectionLayout>
        {(progress == null || progress == undefined) && <Error message={null}/> }
            {(progress!=null && progress!=undefined) && <>

            {progress?.sections['section 2']?.coveredSubsections > 0 && <>
            <div className='px-6 py-10 bg-white'>
                <div className="flex justify-between">
                    <div className="gap-2">
                        <p className="text-neutral-700 text-xl font-semibold tracking-tight">
                            Setting up your Policies
                        </p>
                        <p className="text-gray-600 text-sm font-normal font-cabin" >
                            Use existing policies or add custom policies to your company's policy
                        </p>
                    </div>
                    <div className="">
                        <HollowButton title='Skip' showIcon={false} onClick={()=>setShowSkipModal(true)} />
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-4">

                    <CollapsedPolicy 
                        completed={internationalCompleted}
                        onClick={() => navigate('international')}
                        text='International Travel'
                        icon={internatinal_travel_icon}/>

                    <CollapsedPolicy 
                        completed={domesticCompleted}
                        onClick={() => navigate('domestic')}
                        text='Domestic Travel'
                        icon={domestic_travel_icon}/>

                    <CollapsedPolicy 
                        completed={localCompleted}
                        onClick={() => navigate('local')}
                        text='Local Travel'
                        icon={local_travel_icon}/>

                    <hr className="my-2 border-dashed border-indigo-600"/>
                    
                    <CollapsedPolicy 
                        completed={rembursementCompleted}
                        onClick={() => navigate('reimbursement')}
                        text='Reimbursement Policies'
                        icon={non_travel_icon}/>
                </div>

                <div className="mt-10 flex w-full justify-end">
                    {/* <Button variant='fit' text='Save As Draft' onClick={handleSaveAsDraft} /> */}
                    <Button variant='fit' text='Continue' onClick={handleContinue} />
                </div>
            </div>
        
            <Modal skippable={false} showModal={showSkipModal} setShowModa={setShowSkipModal}>
                <div className="p-10">
                    <p className="text-neutral-700 text">
                        We recommend you go through setting up company policies, with policy setup you can track limit violations. 
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
            </>}

            {progress?.sections['section 2']?.coveredSubsections < 1 && 
            <EmptyHRData 
                message='To configure company policies, please upload HR data first'
                buttonTitle = 'Take me to upload section'
                onclick = {()=>{navigate(`/${tenantId}/upload-hr-data`)}}
                />}
            </>}
        </MainSectionLayout>
    </>)
}

function CollapsedPolicy(props){
    const icon = props.icon
    const text = props.text || 'Enter text'
    const onClick = props.onClick || (() => {})
    const completed = props.completed??false;

    return(
        <>
            <div onClick={onClick} className="w-full h-[72px] p-3 sm:p-6 relative bg-white cursor-pointer rounded-xl border border-neutral-200 inline-flex items-center">
                <div className="flex justify-between items-center w-full">
                    <div className="justify-start items-center gap-8 inline-flex">
                        <div className="justify-start items-center gap-6 flex">
                            <div className="w-6 h-6 relative">
                                <img src={icon} />
                            </div>
                            <div className="text-neutral-700 text-base font-medium font-['Cabin']">{text}</div>
                        </div>
                    </div>

                    <div className="justify-start gap-4 sm:gap-[40px] items-start inline-flex">
                        {completed && <div className="p-1 rounded-full bg-[#bfebae]">
                            <img src={checkIcon} className="w-4 h-4 sm:w-5 sm:h-5"/>
                        </div>}
                        <div className="w-6 h-6 -rotate-90">
                            <img src={arrow_down} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}