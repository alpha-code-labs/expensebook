import { View, Text } from "react-native";
import Select from "../common/Select";



export default function(){

    const options= ["Business", 'Events', 'Others']

    return(
        <View>
            <Text>
                Basic Details
            </Text>

            <Select title='Trip Purpose' placeholder="Select Trip Purpose" options={options} />
        </View>
    )
}