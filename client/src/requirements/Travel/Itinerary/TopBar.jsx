import React from "react"
import { Text,Image, View, FlatList, TouchableOpacity } from "react-native"
import { material_flight_icon } from "../../../../assets/icon"
import { bell_icon } from "../../../../assets/icon"
import { 
        material_flight_black_icon,
        material_flight_white_icon,
        material_train_black_icon,
        material_train_white_icon,
        material_cab_black_icon,
        material_cab_white_icon,
        material_car_rental_black_icon,
        material_car_rental_white_icon,
        material_bus_black_icon,
        material_bus_white_icon,
        material_hotel_black_icon,
        material_hotel_white_icon,
        material_personal_black_icon,
        material_personal_white_icon,
     } from "../../../../assets/icon"



const tabs = [
    {title:'Flight', name:'flight'},
    {title:'Train', name:'train'},
    {title:'Buses', name:'bus'},
    {title:'Hotels', name:'hotel'},
    {title:'Cabs', name:'cab'},
    {title:'Car Rentals', name:'carRental'},
    {title:'Personal Vehicle', name:'personalVehicle'},
 ]


export default function({activeTab, setActiveTab}){
    
    return(<>
        <View className="flex items-center mt-10 gap-4 border-b border-indigo-600 overflow-x-scroll no-scroll">
            <FlatList
                data={tabs}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={(({item})=><React.Fragment key={item.name}><TabItem activeTab={activeTab} setActiveTab={setActiveTab} tab={item} /></React.Fragment>)}
            />
            {/* {tabs.map(tab=><React.Fragment key={tab.name}><TabItem activeTab={activeTab} setActiveTab={setActiveTab} tab={tab} /></React.Fragment>)} */}
        </View>
    </>)
}

function TabItem({activeTab, setActiveTab, tab}){

    return(
        <TouchableOpacity onPress={()=>setActiveTab(tab.name)}>
            <View className={`transition-all w-[140px] flex flex-col gap-1 ${activeTab==tab.name? 'border-indigo-600 bg-indigo-600' : 'border-gray-200 '  }  py-2 px-6 justify-center items-center`}>
                <Image source={spitImageSource(tab.name, activeTab)} className="w-6 h-6"/>
                <Text style={{fontFamily:'Cabin'}} numberOfLines={1} className={`text-sm  ${activeTab==tab.name? 'text-white' : 'text-neutral-600'}  font-cabin`}>{tab.title}</Text>
            </View>
        </TouchableOpacity>
        
    )
}

function spitImageSource(tabName, activeTab){
    console.log(tabName, activeTab, '...tabs name activetab')
    if(tabName == 'flight'){
        if(activeTab == tabName) return(material_flight_white_icon)
        else return material_flight_black_icon
    } 
    if(tabName == 'train'){
        if(activeTab == tabName) return(material_train_white_icon)
        else return material_train_black_icon
    }
    if(tabName == 'cab'){
        if(activeTab == tabName) return(material_cab_white_icon)
        else return material_cab_black_icon
    }
    if(tabName == 'carRental'){
        if(activeTab == tabName) return(material_car_rental_white_icon)
        else return material_car_rental_black_icon
    }
    if(tabName == 'personalVehicle'){
        if(activeTab == tabName) return(material_personal_white_icon)
        else return material_personal_black_icon
    }
    if(tabName == 'bus') {
        if(activeTab == tabName) return(material_bus_white_icon)
        else return material_bus_black_icon
    }
    if(tabName == 'hotel'){
        if(activeTab == tabName) return(material_hotel_white_icon)
        else return material_hotel_black_icon
    }
}

//spitImageSource(tab.name)