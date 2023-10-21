import plus_icon from '../../assets/plus.svg'


export default function (props){
    const onClick = props.onClick
    const title = props.title
    const showIcon = props.showIcon || false
    const icon = props.icon || plus_icon

    return(<>
        <div onClick={onClick} 
            className=" h-10 cursor-pointer px-8 py-4 rounded-[32px] border border-indigo-600 justify-center items-center gap-2 inline-flex">
            <div className="text-center tracking-tight text-indigo-600 text-base font-medium font-cabin">{title}</div>
            {showIcon && <div className="w-6 h-6" >
                <img src={icon} alt='add' />
            </div>}
        </div>
    </>)
}