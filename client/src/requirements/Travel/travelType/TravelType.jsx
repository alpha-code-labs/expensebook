import { useEffect, useState } from "react"
import Error from "../common/Error"
import Button from "../common/Button"
import Checkbox from "../common/Checkbox"
import { View, Text, TouchableWithoutFeedback, Image } from "react-native"
import { check_icon } from "../../../../assets/icon"
import { useIsFocused } from "@react-navigation/native"
import { getOnboardingData_API } from "../../../utils/api/travelApi"

export default function({setShowBackButton, formData, setFormData, onBoardingData, setOnBoardingData, nextPage, navigation}){
    
    
    const [travelType, setTravelType] = useState('international')
    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const isFocused = useIsFocused()

    //const navigation = useNavigation()

    const EMPLOYEE_ID  = '1001'
    const tenantId = 'tynod76eu'
    const EMPLOYEE_NAME = 'Abhishek Kumar'
    const companyName = 'Amex'


    useEffect(()=>{
        setIsLoading(false)
        console.log('rendering travel type...')
        if(isFocused) setShowBackButton(true)
    }, [isFocused])

    useEffect(()=>{
        console.log(travelType)
    }, [travelType])


    const handleContinueButton = ()=>{
        if(travelType == null || travelType == undefined){
            return
        }

        //navigation.navigate to creating page
        setFormData(pre=>({...pre, travelType:travelType}))
        setShowBackButton(false)
        navigation.navigate(nextPage)
    }

    const switchTravelType = (id)=>{
        switch(id){
            case 1: setTravelType('international'); return;
            case 2: setTravelType('domestic'); return;
            case 3: setTravelType('local'); return;
        }
    }

    useEffect(() => {
        (async function(){
          const response = await getOnboardingData_API({tenantId, EMPLOYEE_ID, travelType})
          if(response.err){
            setLoadingErrMsg(response.err)
            console.log('Error in fetching onboaridn gdata', response.err)
          }  
          else{
            setOnBoardingData(response.data.onboardingData)
            console.log('onboarding data fetched..')
            setIsLoading(false)
          }
        })()
      },[travelType])

      console.log(nextPage, 'nextPage')

    return(<>
        {isLoading && <Error message={null}/> }

        {!isLoading && <>
        <View className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">

        {/* Rest of the section */}
        <View className="w-full h-full mt-10 p-10">


            <TouchableWithoutFeedback onPress={()=>setTravelType('international')}>
                <View className={`flex gap-x-4 flex-row items-center ${travelType=='international'? 'border border-indigo-600' : 'border border-neutral-400' } max-w-[350px] accent-indigo-600 px-6 py-2 rounded`}>
                    
                    <View className={`w-[20px] h-[20px] ${travelType=='international'? 'bg-indigo-600 border border-indigo-600' : 'border border-neutral-400' } flex items-center justify-center rounded-sm`}>
                        {travelType=='international' && <Image source={check_icon} className='w-[20px] h-[20px] rounded-sm'/>}
                    </View>

                    <View className=''>
                        <Text style={{fontFamily:'Cabin'}} className='font-Cabin text-neutral-800 text-lg tracking-wider'> International </Text>
                        <Text style={{fontFamily:'Cabin'}} className='font-Cabin -mt-1 text-neutral-600 text-sm tracking-tight'>Travelling out of country</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={()=>setTravelType('domestic')}>
                <View className={`flex gap-x-4 flex-row items-center ${travelType=='domestic'? 'border border-indigo-600' : 'border border-neutral-400' } max-w-[350px] accent-indigo-600 px-6 py-2 rounded mt-4`}>
                    <View className={`w-[20px] h-[20px] ${travelType=='domestic'? 'bg-indigo-600 border border-indigo-600' : 'border border-neutral-400' } flex items-center justify-center rounded-sm`}>
                        {travelType=='domestic' && <Image source={check_icon} className='w-[20px] h-[20px] rounded-sm'/>}
                    </View>

                    <View>
                        <Text style={{fontFamily:'Cabin'}} className='font-Cabin text-neutral-800 text-lg tracking-wider'> Domestic </Text>
                        <Text style={{fontFamily:'Cabin'}} className='font-Cabin -mt-1 text-neutral-600 text-sm tracking-tight'>Travelling within country</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={()=>setTravelType('local')}>
                <View className={`flex gap-x-4 flex-row items-center ${travelType=='local'? 'border border-indigo-600' : 'border border-neutral-400' } max-w-[350px] accent-indigo-600 px-6 py-2 rounded mt-4`}>
                    <View className={`w-[20px] h-[20px] ${travelType=='local'? 'bg-indigo-600 border border-indigo-600' : 'border border-neutral-400' } flex items-center justify-center rounded-sm`}>
                        {travelType=='local' && <Image source={check_icon} className='w-[20px] h-[20px] rounded-sm'/>}
                    </View>
                    
                    <View>
                        <Text style={{fontFamily:'Cabin'}} className='font-Cabin text-neutral-800 text-lg tracking-wider'> Local </Text>
                        <Text style={{fontFamily:'Cabin'}} className='font-Cabin -mt-1 text-neutral-600 text-sm tracking-tight'>Travelling nearby</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>



                <View className='mt-10 w-full flex justify-between items-center flex-row-reverse'> 
                    <Button 
                        variant='fit'
                        text='Continue' 
                        onClick={handleContinueButton} />
                </View>

        </View>

        </View>
    </>}
</>)
}