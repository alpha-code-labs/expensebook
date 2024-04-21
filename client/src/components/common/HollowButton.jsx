import plus_icon from '../../assets/plus.svg'
import loader_icon from '../../assets/spinner.gif'


export default function (props){
    const onClick = props.onClick
    const title = props.title
    const sizeMax = props.sizeMax??false;
    const showIcon = props.showIcon || false
    const icon = props.icon || plus_icon
    const className = props.className??''
    const isLoading = props.isLoading??false

    const handleClick = ()=>{
        if(isLoading) return;
        onClick()
    }

    return(<>
        <div onClick={handleClick} 
            className={`${className} h-10 cursor-pointer px-8 py-4 rounded-[32px] border border-indigo-600 justify-center items-center gap-2 inline-flex`}>
            
            {(isLoading && <img src={loader_icon} className='w-4 h-4'/>)} 

            <div className={`text-center tracking-tight text-indigo-600 ${sizeMax? 'text-2xl' : 'text-base'} font-medium font-cabin`}>
                {title}
            </div>

            {showIcon && <div className="w-6 h-6" >
                <img src={icon} alt='add' />
            </div>}
        </div>
    </>)
}