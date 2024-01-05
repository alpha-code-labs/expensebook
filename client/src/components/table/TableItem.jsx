export default function TableItem(props){
    const text = props.text || 'text'
    const header = props.header || false

    return(
            <div className="w-[134px] shrink text-ellipsis overflow-hidden py-2 h-10 justify-start items-center inline-flex">
                <div className={`${header? 'text-neutral-500' : 'text-neutral-700'} text-sm font-normal font-cabin`}>{text}</div>
            </div>
    )
}