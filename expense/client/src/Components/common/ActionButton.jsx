import { loading_icon } from '../../assets/icon'
import { titleCase } from '../../utils/handyFunctions'


const ActionButton = ({loading ,text ,onClick ,variant , disabled,active}) => {
  const handleClick = (e)=>{
    if(!disabled){
        onClick(e)
    }
    else{
        console.log('disabled')
    }
}

  return (
    <div onClick={handleClick} className={`${variant==='red' ? 'bg-red-500' : 'bg-green-200'}flex  justify-center items-center py-2 px-3 ${loading ? 'bg-indigo-400  cursor-wait':'bg-purple-500 cursor-pointer'} text-white-100 rounded-full w-full h-[34px]`}>
    {loading && active ? <div className='translate-y-[-2px]'><img src={loading_icon} alt='loading' className='an animate-spin w-6 h-6'/> </div> :<p className=' font-cabin text-sm  text-center'> {titleCase(text || "")}</p>}
  </div>
  )
}


export default ActionButton
