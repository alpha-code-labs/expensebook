import chevron_down from "../../assets/chevron-down.svg";

export default function Date(props){
    return(<>
<div className="w-[269px] h-[138px] px-[31px] py-2.5 bg-white rounded-xl border border-neutral-200 flex-col justify-start items-center gap-2 inline-flex">
    <div className="flex-col justify-start items-start gap-3 flex">
        <div className="flex-col justify-start items-start gap-2 flex">
            <div className="text-zinc-500 text-xs font-normal font-cabin">Departure Date</div>
            <div className="justify-start items-center gap-2 inline-flex cursor-pointer">
                <div className="text-neutral-700 text-lg font-medium font-cabin">24th Aug 2023</div>
                <div className="w-6 h-6 relative" >
                    <img src={chevron_down} />
                </div>
            </div>
        </div>
        <div className="h-[47px] flex-col justify-start items-start gap-2 flex">
            <div className="text-zinc-500 text-xs font-normal font-cabin">Preferred Time </div>
            <div className="justify-start items-center gap-2 inline-flex cursor-pointer">
                <div className="text-neutral-700 text-lg font-medium font-cabin">16:00:00</div>
                <div className="w-6 h-6 relative " >
                    <img src={chevron_down} />
                </div>
            </div>
        </div>
    </div>
</div>
    </>)
}