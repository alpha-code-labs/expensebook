import { TouchableOpacity, View, Text } from "react-native"

export default function Button(props){

    const text = props.text
    const onClick = props.onClick
    const variant = props.variant?? 'fit'
    const disabled = props.disabled?? false
    const isLoading = props.isLoading?? false
    console.log(disabled)

    const handleClick = (e)=>{
        if(!disabled){
            onClick(e)
        }
        else{
            console.log('disabled')
        }
    }

    return(<>
    <TouchableOpacity onPress={handleClick}>
        <View 
            className={`${variant=='fit'? 'w-fit':'w-full' } ${disabled? 'hover:bg-indigo-400 hover:text-gray-400 bg-indigo-400 text-gray-400 cursor-not-allowed': 'hover:bg-indigo-500  text-white cursor-pointer' } h-12 px-8 py-4 bg-indigo-600 rounded-[32px] justify-center items-center inline-flex cursor-pointer`}>
            <Text style={{fontFamily:'Cabin'}} className="w-full h-6 text-center text-white text-base font-medium font-cabin">{text}</Text>
        </View>
    </TouchableOpacity>
    </>)
}