export default function Button(props){

    const text = props.text
    const onClick = props.onClick
    const variant = props.variant??'fit'

    return(<>
    <div
        onClick={onClick} 
        className={`${variant=='fit'? 'w-fit':'w-full' } h-12 px-8 py-4 bg-indigo-600 rounded-[32px] justify-center items-center gap-2 inline-flex cursor-pointer`}>
        <div className="w-full h-5 text-center text-white text-base font-medium font-cabin">{text}</div>
    </div>
    </>)
}