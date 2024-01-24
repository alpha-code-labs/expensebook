import { cash_icon } from '../../../../assets/icon'
import { View } from 'react-native'


export default function AddMore(props){
    const onClick = props.onClick
    const text = props.text || 'Add More'

    return(<>
        <View onClick={onClick} 
            className=" h-12 cursor-pointer px-6 py-4 rounded-[32px] border border-indigo-600 justify-center items-center gap-2 inline-flex">
            <View className="text-center text-indigo-600 text-base font-medium font-cabin">{text}</View>
            <View className="w-6 h-6 " >
                <Image source={cash_icon} alt='add' />
            </View>
        </View>
    </>)
}