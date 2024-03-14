import loader_icon from '../../assets/spinning-loading.gif'
import loader_icon_2 from '../../assets/spinner.gif'
import { useEffect } from 'react'

export default function Button(props){

    const text = props.text
    const onClick = props.onClick
    const variant = props.variant?? 'fit'
    let disabled = props.disabled?? false
    const isLoading = props.isLoading?? false
    console.log(isLoading, 'isLoading')
    console.log(disabled)

    const handleClick = (e)=>{
        if(!disabled && !isLoading){
            onClick(e)
        }
        else{
            console.log('disabled')
        }
    }

    useEffect(()=>{
        if(isLoading){
            disabled = true
        }
    }, [isLoading])

    return(<>
    <div
        onClick={handleClick} 
        className={`${variant=='fit'? 'w-fit':'w-full' } ${disabled ? 'hover:bg-indigo-400 hover:text-gray-400 bg-indigo-400 text-gray-400 cursor-not-allowed': 'bg-indigo-600 hover:bg-indigo-500  text-white cursor-pointer' } h-12 px-8 py-4 rounded-[32px] justify-center items-center gap-2 inline-flex`}>
        <div className="w-full h-5 text-center text-white text-base font-medium font-cabin flex gap-1 items-center">
            {(isLoading && <img src={loader_icon_2} className='w-4 h-4'/>)} {text}
        </div>
    </div>
    </>)
}