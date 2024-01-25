import { useState } from "react"
import { check_icon } from "../../../../assets/icon"
import { TouchableWithoutFeedback, Text, View, Image } from "react-native"

export default function Checkbox(props){
    
    const onClick = props.onClick
    const checked = props.checked
    const id = props.id
    const [isChecked, setIsChecked] = useState(checked)

    const handlePress = ()=>{
        setIsChecked(pre=>!pre)
        onClick({target:{checked:!isChecked}}, id)
    }

    // return(<>
    //     {/* <input 
    //         type='checkbox'
    //         onClick={(e)=>onClick(e, id)} 
    //         onChange={(e)=>setIsChecked(e.target.checked)}
    //         checked={checked}
    //         id={id}
    //         className='w-[18px] h-[18px] cursor-pointer font-thin accent-indigo-600 relative rounded border border-neutral-400' />
    //      */}

    //     {!isChecked && 
    //         <TouchableWithoutFeedback onPress={handlePress} className='w-[18px] h-[18px] border border-neutral-400'>

    //         </TouchableWithoutFeedback>
    //     }

    //     {/* {isChecked && 
    //     <TouchableWithoutFeedback onPress={handlePress} className='w-[18px] h-[18px] bg-indigo-600 border border-indigo-600 flex items-center justify-center'>
    //         <Image source={check_icon} className='w-[13px] h-[13px]'/>
    //     </TouchableWithoutFeedback>} */}

    //     </>)

    return(   
        <TouchableWithoutFeedback onPress={handlePress} >
            <View className={`w-[20px] h-[20px] ${isChecked? 'bg-indigo-600 border border-indigo-600' : 'border border-neutral-400' } flex items-center justify-center rounded-sm`}>
                {isChecked && <Image source={check_icon} className='w-[20px] h-[20px] rounded-sm'/>}
            </View>
        </TouchableWithoutFeedback>)

}