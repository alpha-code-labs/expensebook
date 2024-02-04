import { TouchableOpacity, Image, View } from 'react-native'
import { x_b_icon } from '../../../../assets/icon'

export default function({onClick}){

    return(<>
        <TouchableOpacity  onPress={onClick}>
            <View className="w-[24px] h-[24px] cursor-pointer rounded-full bg-gray-100">
                <Image source={x_b_icon} className='w-6 h-6' />
            </View>
        </TouchableOpacity>
        </>)
}