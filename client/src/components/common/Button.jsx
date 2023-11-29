export default function Button(props){

    const text = props.text
    const onClick = props.onClick
    let disabled = props.disabled
    if(disabled==undefined){
        disabled=false
    }

    const handleButtonClick = ()=>{
        if(disabled){

        }
        else{
            onClick()
        }
    }

    return(<>
    <div
        onClick={handleButtonClick} 
        className={`${disabled? 'hover:bg-indigo-100 hover:text-gray-400 bg-indigo-100 text-gray-400': 'hover:bg-indigo-500  text-white' }  w-full h-10 px-8 py-4 bg-indigo-600 rounded-[32px] justify-center items-center gap-2 inline-flex cursor-pointer`} >
        <div className="w-full h-5 whitespace-nowrap text-center text-base font-medium font-cabin">{text}</div>
    </div>
    </>)
}