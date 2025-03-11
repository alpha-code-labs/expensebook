import { useState } from "react"
export default function Checkbox(props){
    
    const onClick = props.onClick
    const checked = props.checked
    const id = props.id
    const [isChecked, setIsChecked] = useState(false)

    return(<>
        <input 
            type='checkbox'
            onClick={(e)=>onClick(e, id)} 
            onChange={(e)=>setIsChecked(e.target.checked)}
            checked={checked}
            id={id}
            className='w-[18px] h-[18px] cursor-pointer font-thin accent-indigo-600 relative rounded border border-neutral-400' />
    </>)
}