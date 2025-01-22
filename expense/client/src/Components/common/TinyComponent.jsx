import { cancel_icon, delete_icon, info_icon, loading_icon, plus_icon } from "../../assets/icon"
import { getStatusClass } from "../../utils/handyFunctions"


const StatusBox = ({status})=>(
    <div className='flex justify-center items-center gap-2'>
    <div className={`text-center rounded-sm ${getStatusClass(status?? "-")}`}>
    <p className='px-1 py-1 text-xs text-center capitalize font-cabin'>{(status === "save" ? "Saved" : status) ?? "-"}</p>
  </div>
  </div>
  )
 


  
export {StatusBox, TitleModal, RemoveFile}  
function TitleModal ({onClick, text, iconFlag= false}){
  return (
    <div className='flex gap-2 justify-between items-center bg-gray-200/20 w-full p-4'>
       <div className='flex gap-2 items-center justify-start'>
            {iconFlag && <img src={info_icon} className='w-5 h-5' alt="Info icon"/>}
            <p className='font-inter text-base font-semibold  text-neutral-900'>
              {text}
            </p>
          </div>
          
              <div onClick={onClick} className='bg-red-100 cursor-pointer rounded-full border border-white'>
              <img src={cancel_icon} className='w-5 h-5'/>
              </div>
    </div>
  )
}
function RemoveFile ({onClick}){
  return (
    
      <div
        onClick={onClick}
        className={`absolute rounded-md top-8 left-8 p-4 bg-white shadow-lg shadow-black/40  sm:block cursor-pointer hidden`}
      >
        <img src={delete_icon} className="w-6 h-6" />
      </div>
    
  )
}


export default function HeaderButton(props) {
  const icon = props.icon;
  const text = props.text;
  const onClick = props.onClick;
  const variant = props.variant ?? 'fit';
  const disabled = props.disabled ?? false;
  const loading = props.loading ?? false;

  const handleClick = (e) => {

    if ( !disabled && !loading) {
    // if (!disabled && !loading) {
      onClick(e);

      // Assuming the onClick function might trigger an asynchronous operation.
      // After the operation is done, set loading back to false.
      // You may need to adjust this based on your actual use case.
      // Example:
      // async onClickHandler() {
      //   // Some asynchronous operation
      //   await yourAsyncOperation();
      //   setLoading(false);
      // }
    } else {
      console.log('disabled or already loading',disabled);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`${variant === 'fit' ? 'w-fit' : 'w-full'} ${
          disabled 
            ? 'hover:hover:bg-neutral-700  hover:text-gray-400 bg-indigo-400 text-gray-400  cursor-not-allowed '
            : 'hover:hover:bg-neutral-700 text-white cursor-pointer'
        } px-2 py-1 bg-neutral-900 rounded-md  justify-center items-center gap-2 inline-flex`}
      >
        {loading ? (
          <div className='flex gap-1 text-center items-center'>
          <img src={loading_icon} className="animate-spin w-4 h-4" />
          <div className="w-full max-w-[75px] sm:max-w-full whitespace-nowrap truncate  text-center text-white text-xs font-medium font-cabin">
            {text}
          </div>
          </div>
        ) : (
          <div className='flex gap-1 text-center items-center'>
          {icon && <img src={plus_icon} className="w-3 h-3" />}
          <div className="w-full max-w-[75px] sm:max-w-full whitespace-nowrap truncate  text-center text-white text-xs font-medium font-cabin">
            {text}
          </div>
          </div>
        )}
      </div>
    </>
  );
}
