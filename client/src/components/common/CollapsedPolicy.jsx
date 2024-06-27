
import checkIcon from '../../assets/check.svg'
import arrow_down from "../../assets/chevron-down.svg";

export default function CollapsedPolicy(props){
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