import { forwardRef, useState } from "react"

export default forwardRef(function Checkbox(props, ref){
    
    const onClick = props.onClick || null
    const checked = props.checked
    const onChange = props.onChange || null
    const id = props.id
    const [isChecked, setIsChecked] = useState(false)

    const handleOnChange = (e) => {
        console.log('running handle change')
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
            ref={ref}
            type='checkbox'
            onClick={(e)=>handleClick(e, id)} 
            onChange={handleOnChange}
            checked={checked}
            id={id}
            className='w-[18px] h-[18px] cursor-pointer font-thin accent-indigo-600 relative rounded border border-neutral-400' />
    </>)
})