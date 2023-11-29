import plus_icon from '../../assets/plus.svg'

export default function AddMore(props){
    const onClick = props.onClick
    const text = props.text || 'Add More'

    return(<>
        <div onClick={onClick} 
            className=" h-12 cursor-pointer px-6 py-4 rounded-[32px] border border-indigo-600 justify-center items-center gap-2 inline-flex">
            <div className="text-center text-indigo-600 text-base font-medium font-cabin">{text}</div>
            <div className="w-6 h-6 " >
                <img src={plus_icon} alt='add' />
            </div>
        </div>
    </>)
}