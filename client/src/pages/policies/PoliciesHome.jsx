import Button from "../../components/common/Button"
import Icon from "../../components/common/Icon"
import { useNavigate } from "react-router-dom"
import HollowButton from "../../components/common/HollowButton"
import internatinal_travel_icon from '../../assets/in-flight.svg'
import domestic_travel_icon from '../../assets/briefcase.svg'
import local_travel_icon from '../../assets/map-pin.svg'
import non_travel_icon from '../../assets/paper-money-two.svg'
import arrow_down from "../../assets/chevron-down.svg";
import Checkbox from "../../components/common/Checkbox"



export default function (props){
    const navigate = useNavigate()

    return(<>
        <div className="bg-slate-50 px-[104px] py-20">
            <Icon/>
            <div className='px-6 py-10 bg-white mt-6 rounded shadow'>
                <div className="flex justify-between">
                    <div className="gap-2">
                        <p className="text-neutral-700 text-xl font-semibold tracking-tight">
                            Setting up your Expensbook
                        </p>
                        <p className="text-gray-600 text-sm font-normal font-cabin" >
                            Use existing policies or add custom policies to your company's travel policy
                        </p>
                    </div>
                    <div className="">
                        <HollowButton title='Skip' showIcon={false} />
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
                    
                    <CollapsedPolicy 
                        onClick={() => navigate('non-travel')}
                        text='Non Travel Expenses'
                        icon={non_travel_icon}/>


                </div>

            </div>
        </div>
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