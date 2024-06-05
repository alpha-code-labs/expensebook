import { material_flight_black_icon, 
    material_bus_black_icon, 
    material_train_black_icon,
    material_cab_black_icon,
    material_car_rental_black_icon,
    material_personal_black_icon,
    material_hotel_black_icon,
  } from "../../assets/icon"

import React from "react"

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
        <div className="flex items-center mt-10 gap-4 border-b border-indigo-600 overflow-x-scroll no-scroll">
            {tabs.map(tab=><React.Fragment key={tab.name}><TabItem activeTab={activeTab} setActiveTab={setActiveTab} tab={tab} /></React.Fragment>)}
        </div>
    </>)
}

function TabItem({activeTab, setActiveTab, tab}){

    return(
        <div className={`transition-all w-[100px] whitespace-nowrap flex flex-col gap-1 ${activeTab==tab.name? 'border-indigo-600 bg-gray-100' : 'border-white hover:shadow-sm  cursor-pointer'  } border-b  border-b-2  py-1 px-2 rounded-t justify-center items-center`} onClick={()=>setActiveTab(tab.name)}>
            <img src={spitImageSource(tab.name)} className={`w-6 ${activeTab==tab.name && 'shadow-b shadow-xl'}`}/>
            <p className={`text-sm ${activeTab==tab.name? 'text-indigo-600' : 'text-neutral-600'}  font-cabin`}>{tab.title}</p>
        </div>
    )
}

function spitImageSource(tabName){
    if(tabName == 'flight') return(material_flight_black_icon)
    if(tabName == 'train') return(material_train_black_icon)
    if(tabName == 'cab') return material_cab_black_icon
    if(tabName == 'carRental') return material_car_rental_black_icon
    if(tabName == 'personalVehicle') return material_personal_black_icon
    if(tabName == 'bus') return material_bus_black_icon
    if(tabName == 'hotel') return material_hotel_black_icon
}

  