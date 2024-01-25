import { plus_icon } from '../../../../assets/icon'
import { View, Image, Text, TouchableOpacity } from 'react-native'


export default function AddMore(props){
    const onClick = props.onClick
    const text = props.text || 'Add More'

    return(<>
        <TouchableOpacity onPress={onClick} 
            className="h-10 cursor-pointer px-6 py-2 rounded-[32px] border border-indigo-600 justify-center items-center flex flex-row">
            <Text className="h-6 text-center text-indigo-600 text-base font-medium font-Cabin">{text}</Text>
            <View className="w-6 h-6 flex flex-row items-center justify-center " >
                <Image className="w-5 h-5 " source={plus_icon} alt='add' />
            </View>
        </TouchableOpacity>
    </>)
}