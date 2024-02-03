import { SafeAreaView, Text, TouchableOpacity } from "react-native"
import TopBar from "./TopBar"
import { useEffect, useState } from "react"
import { View, Image, Keyboard} from "react-native"
import { material_arrow_forward_white_icon } from "../../../../assets/icon"
import Train from "./Train"
import Bus from "./Bus"
import Hotel from "./Hotel"
import Cab from "./Cab"
import CarRental from "./CarRental"
import Flight from "./Flight"

export default function({formData, setFormData}){

    const [activeTab, setActiveTab] = useState('flight')
    const [errors, setErrors] = useState({flightsError:[], cabsError:[], carRentalsError:[], hotelsError:[], busessError:[], trainsError:[], modeOfTransitError:null, travelClassError:null})

    const handleContinue = ()=>{
        console.log('handle continue')
    }

    useEffect(()=>{
        console.log(activeTab)
    },[activeTab])

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
            setKeyboardVisible(true); // or some other action
        }
        );
        const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
            setKeyboardVisible(false); // or some other action
        }
        );

        return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(()=>{
        console.log(isKeyboardVisible, 'kb visible')
    },[isKeyboardVisible])

    useEffect(()=>{
        console.log(formData)
    }, [formData])

    return(<SafeAreaView>

        <View className='h-full'>
            <TopBar activeTab={activeTab} setActiveTab={setActiveTab}/>
            {activeTab=='flight' && <Flight formData={formData} setFormData={setFormData} flightsError={errors.flightsError}/>}
            {activeTab=='train' && <Train formData={formData} setFormData={setFormData} trainsError={errors.trainsError}/>}
            {activeTab=='bus' && <Bus formData={formData} setFormData={setFormData} busesError={errors.busessError}/>}
            {activeTab=='hotel' && <Hotel formData={formData} setFormData={setFormData} hotelsError={errors.hotelsError}/>}
            {activeTab=='cab' && <Cab formData={formData} setFormData={setFormData} cabsError={errors.cabsError}/>}
            {activeTab=='carRental' && <CarRental formData={formData} setFormData={setFormData} carRentalsError={errors.carRentalsError}/>}
        </View>

        {!isKeyboardVisible && <TouchableOpacity onPress={handleContinue}>
            <View style={{elevation:5}} className='bottom-12 left-[75%] absolute bg-indigo-600 w-14 h-14 rounded-full flex flex-row items-center justify-center'>
                <Image source={material_arrow_forward_white_icon} className='w-[24px] h-[24px]' />
            </View>
        </TouchableOpacity>} 

    </SafeAreaView>)
}