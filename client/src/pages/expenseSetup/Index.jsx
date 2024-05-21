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


export default function (props){
    const navigate = useNavigate()
    const {tenantId} = useParams()
    const [showSkipModal, setShowSkipModal] = useState(false)

    useEffect(()=>{
        if(showSkipModal){
            document.body.style.overflow = 'hidden'
        }
        else{
            document.body.style.overflow = 'visible'
        }
    },[showSkipModal])

    const handleContinue = ()=>{
        //navigate to groups
        navigate(`/${tenantId}/groups`)
    }

    const handleSaveAsDraft = async ()=>{
        //update state
        const res = await updateFormState_API({tenantId, state: `/${tenantId}/setup-expense-book`})
        //navigate to home page
        window.location.href = 'google.com'
    }

    return(<>
        
        <div className="mt-[63px] ml-[230px] md:px-[10px] lg:px-[100px] w-[calc(100%-230px)] min-h-[calc(100vh-107px)] tracking-tight">
            <div className='px-6 py-10 bg-white'>
                <div className="flex justify-between">
                    <div className="gap-2">
                        <p className="text-neutral-700 text-xl font-semibold tracking-tight">
                            Setup your expensebook
                        </p>
                        <p className="text-gray-600 text-sm font-normal font-cabin" >
                            Allocate Expenses
                        </p>
                    </div>
                    <div className="">
                        <HollowButton title='Skip' showIcon={false} onClick={()=>setShowSkipModal(true)} />
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-4">

                    <CollapsedPolicy 
                        onClick={() => navigate('travel')}
                        text='Travel'
                        icon={internatinal_travel_icon}/>

                    <CollapsedPolicy 
                        onClick={() => navigate('reimbursements')}
                        text='Employee Expense Reimursements'
                        icon={non_travel_icon}/>

                </div>

                <div className="mt-10 flex justify-end">
                    {/* <Button variant='fit' text='Save as Draft' onClick={handleSaveAsDraft} /> */}
                    <Button variant='fit' text='Continue' onClick={handleContinue} />
                </div>

            </div>
        </div>

        <Modal skippable={false} showModal={showSkipModal} setShowModa={setShowSkipModal}>
            <div className="p-10">
                <p className="text-neutral-700 text">
                    You can always set it up later. 
                </p>
                <div className=' mt-10 flex flex-wrap justify-between'>
                    <div className='w-fit'>
                        {/* <Button text='Ok' onClick={()=>setShowSkipModal(false)} /> */}
                        <Button text='Ok' onClick={()=>navigate(`/${tenantId}/groups`)} />
                    </div>
                    {/* <div className='w-fit'>
                        <HollowButton title='Skip For Now' showIcon={false} onClick={()=>navigate(`/${tenantId}/groups`)} />
                    </div> */}
                </div>
            </div>
        </Modal>

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
