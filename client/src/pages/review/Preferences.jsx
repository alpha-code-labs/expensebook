import star_icon from '../../assets/ic_baseline-star.svg'
import vegetarian_icon from '../../assets/mdi_lacto-vegetarian.svg'
import seat_icon from '../../assets/seat.svg'

export default function Preferences(props){

    return (<>
        
        <div className="w-[312px] h-[110px] flex-col justify-start items-start gap-4 inline-flex">
        <div className="text-zinc-800 text-base font-medium font-cabin">Your preferences </div>
        <div className="justify-start items-start gap-20 inline-flex">
            <div className="flex-col justify-start items-start gap-4 inline-flex">
                <div className="text-zinc-800 text-base font-normal font-cabin">Hotel</div>
                <div className="justify-start items-start gap-6 inline-flex">
                    <div className="flex-col justify-center items-center gap-2 inline-flex">
                        <div className="flex-col justify-start items-center gap-2 flex">
                            <div className="justify-center items-center gap-2 inline-flex">
                            <div className="w-4 h-4 relative" >
                                    <img src={vegetarian_icon} />
                                </div>
                                <div className="text-center text-neutral-500 text-sm font-normal font-cabin">Veg</div>
                            </div>
                        </div>
                        <div className="text-center text-zinc-800 text-xs font-normal font-cabin">Food </div>
                    </div>
                    <div className="flex-col justify-center items-start gap-2 inline-flex">
                        <div className="justify-center items-center gap-1 inline-flex">
                            <div className="w-4 h-4 relative" >
                                <img src={star_icon} />
                            </div>
                            <div className="text-center text-neutral-500 text-sm font-normal font-cabin">5</div>
                        </div>
                        <div className="text-center text-zinc-800 text-xs font-normal font-cabin">Rating</div>
                    </div>
                </div>
            </div>
            <div className="flex-col justify-start items-start gap-4 inline-flex">
                <div className="text-zinc-800 text-base font-normal font-cabin">Flight</div>
                <div className="justify-start items-start gap-6 inline-flex">
                    <div className="flex-col justify-center items-center gap-2 inline-flex">
                        <div className="flex-col justify-start items-center gap-2 flex">
                            <div className="justify-center items-center gap-2 inline-flex">
                                <div className="w-4 h-4 relative" >
                                    <img src={vegetarian_icon} />
                                </div>
                                <div className="text-center text-neutral-500 text-sm font-normal font-cabin">Veg</div>
                            </div>
                        </div>
                        <div className="text-center text-zinc-800 text-xs font-normal font-cabin">Food </div>
                    </div>
                    <div className="flex-col justify-start items-center gap-2 inline-flex">
                        <div className="justify-start items-center inline-flex">
                            <div className="w-4 h-4 relative">
                                <div className="w-2.5 h-[13.50px] left-[3px] top-[1.50px] absolute">
                                    <img src={seat_icon} />
                                </div>
                            </div>
                            <div className="text-center text-neutral-500 text-xs font-normal font-cabin">Window</div>
                        </div>
                        <div className="text-center text-zinc-800 text-xs font-normal font-cabin">Seat</div>
                    </div>
                </div>
            </div>
        </div>
    </div>


        </>)
}