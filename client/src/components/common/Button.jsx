export default function Button(props){

    const text = props.text
    const onClick = props.onClick

    return(<>
    <div
        onClick={onClick} 
        className="w-full h-10 px-8 py-4 bg-indigo-600 rounded-[32px] justify-center items-center gap-2 inline-flex cursor-pointer">
        <div className="w-full h-5 whitespace-nowrap text-center text-white text-base font-medium font-cabin">{text}</div>
    </div>
    </>)
}