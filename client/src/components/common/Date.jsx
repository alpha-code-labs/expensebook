import chevron_icon from '../../assets/chevron-down.svg'
import { formatDate } from '../../utils/handyFunctions'

export default function Date(){

    return (<div className="w-[270px] h-[84px] pl-[55.50px] pr-[54.50px] pt-4 pb-[21px] bg-white rounded-xl border border-neutral-200 justify-center items-center inline-flex">
    <div className="self-stretch flex-col justify-start items-start gap-2 inline-flex">
        <div className="text-zinc-500 text-xs font-normal font-cabin">Select dates for cab</div>
        <div className="justify-start items-center gap-2 inline-flex">
            <div className="text-gray-600 text-xl font-medium font-cabin]">{formatDate()}</div>
            <div className="w-6 h-6 relative">
                <img src={chevron_icon} />
            </div>
        </div>
    </div>
</div>)
}