export default function Checkbox(props){
    
    const onClick = props.onClick
    const checked = props.checked
    const id = props.id

    return(<>
        <input 
            type='checkbox'
            onClick={(e)=>onClick(e, id)} 
            checked={checked}
            id={id}
            className='w-[18px] h-[18px] cursor-pointer font-thin accent-indigo-600 relative rounded border border-neutral-400' />
    </>)
}