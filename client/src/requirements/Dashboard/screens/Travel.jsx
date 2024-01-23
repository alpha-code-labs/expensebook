import React from 'react'
import { View ,Text} from 'react-native'
import Button from '../../../components/common/Button'

const Travel = ({navigation}) => {
  return (
    <View>
         <Text>
         Travel
</Text>
<Button onPress={()=>navigation.navigate('createTravel')} text='Create Travel Request'/>


     
    </View>
  )
}

export default Travel