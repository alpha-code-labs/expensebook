import { useState } from "react"
export default function Checkbox(props){
    
    const onClick = props.onClick || null
    const checked = props.checked
    const onChange = props.onChange || null
    const id = props.id
    const [isChecked, setIsChecked] = useState(false)

    const handleOnChange = (e) => {
        setIsChecked(e.target.checked)
        if(onChange){
            onChange(e)
        }
    }

    const handleClick = (e, id)=>{
        if(onClick){
            onClick(e, id)
        }
    }

    return(<>
        <input 
            type='checkbox'
            onClick={(e)=>handleClick(e, id)} 
            onChange={handleOnChange}
            checked={checked}
            id={id}
            className='w-[18px] h-[18px] cursor-pointer font-thin accent-indigo-600 relative rounded border border-neutral-400' />
    </>)
}