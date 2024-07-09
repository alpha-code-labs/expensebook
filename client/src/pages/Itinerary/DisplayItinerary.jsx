import {closestCorners, DndContext, useSensors, useSensor, PointerSensor, TouchSensor} from '@dnd-kit/core';
import {useSortable, SortableContext, verticalListSortingStrategy, arrayMove} from '@dnd-kit/sortable'
import {restrictToVerticalAxis,} from '@dnd-kit/modifiers';
import {CSS} from '@dnd-kit/utilities'
import React, { useCallback, useEffect, useState } from "react";
import empty_itinerary_icon from '../../assets/empty_itinerary.png';
import { FlightCard, CabCard, HotelCard, RentalCabCard } from "./ItineraryCards";

const detectDeviceType = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      ? 'Mobile'
      : 'Desktop';
  console.log(detectDeviceType(), 'Device Type'); // "Mobile" or "Desktop"

const detectSensor = ()=>{
    console.log('sensor: ', detectDeviceType() == 'Mobile' ? 'ToucSensor' : 'PointerSensor');
    return detectDeviceType() == 'Mobile' ? TouchSensor : PointerSensor 
}

export default function({formData, setFormData, handleEdit, handleDelete}) {

    console.log('component rerendered');
    const [flattendItinerary, setFlattendedItinerary] = useState();

    const handleDragEnd = useCallback((event)=>{
        const {active, over} = event;

        const activeIndex = flattendItinerary.findIndex(item=>item.id == active.id)
        const overIndex = flattendItinerary.findIndex(item => item.id == over.id);
        //console.log(activeIndex, overIndex);
        //console.log(flattendItinerary, 'flattened before drag end');
        const movedArray = arrayMove(flattendItinerary, activeIndex, overIndex);
        //console.log(movedArray, 'after drag end flattened')
        //console.log(arrayToObject(movedArray.map((item,index)=>({...item, sequence:index+1}))), 'itinerary')

        const formData_copy = JSON.parse(JSON.stringify(formData));
        formData_copy.itinerary = arrayToObject(movedArray.map((item,index)=>({...item, sequence:index+1})));
        setFormData(formData_copy);
        
        setFlattendedItinerary(movedArray);
    
        //console.log(active.id, 'active, over ', over.id);
    },[flattendItinerary])


    useEffect(()=>{
        //console.log(flattendItinerary, 'flattendItinerary')
    },[flattendItinerary])

    useEffect(()=>{
        setFlattendedItinerary(flattenObjectToArray(formData.itinerary).filter(item=>item.id != null && item.id != undefined).sort((a,b)=> a.sequence - b.sequence));
    },[formData.itinerary])


    const sensors = useSensors(
        useSensor(detectSensor(), {
          activationConstraint: {
            distance: 8,
          },
        })
      )

    return(<div className='w-full border border-sm border-neutral-50 flex-col justify-center items-center'>
        <DndContext
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}>

            {flattendItinerary && flattendItinerary.length == 0 && <div className="min-w-[200px] min-h-[100px] sm:min-w-[280px] sm:min-h-[250px] md:min-w-[400px] md:min-h-[300px] flex justify-center items-center">
                    <div className="flex flex-col gap-4">
                        <img src={empty_itinerary_icon} className="w-[200px]"/>
                        <p className="text-xl font-cabin text-neutral-600">Your Itinerary will appear here</p>
                    </div>
                </div>}
            <div className='flex flex-col gap-4'>
                <SortableContext
                    strategy={verticalListSortingStrategy}
                    items={flattendItinerary??[]}>
                    {flattendItinerary != undefined && flattendItinerary.length>0 && flattendItinerary.map(item=>{
                        if(item.category == 'flights'){
                            //console.log('rendering flights')
                            return( 
                            <SortableItem id={item.id} key={item.id} >
                                    <FlightCard
                                        handleDelete={handleDelete}
                                        handleEdit={handleEdit}
                                        id={item.id} 
                                        from={item.from} 
                                        to={item.to} 
                                        date={item.date}
                                        returnDate={item.returnDate}
                                        returnTime={item.returnTime}
                                        travelClass={item.travelClass} 
                                        mode={'Flight'}
                                        time={item.time}/>
                            </SortableItem>)
                        }

                        if(item.category == 'trains'){
                            return (<SortableItem id={item.id} key={item.id} >
                                <FlightCard
                                    handleDelete={handleDelete}
                                    handleEdit={handleEdit}
                                    id={item.id} 
                                    from={item.from} 
                                    to={item.to} 
                                    date={item.date}
                                    travelClass={item.travelClass} 
                                    mode={'Train'}
                                    time={item.time}/>
                            </SortableItem>)
                        }

                        if(item.category == 'buses'){
                            return (<SortableItem id={item.id} key={item.id} >
                                <FlightCard
                                    handleDelete={handleDelete}
                                    handleEdit={handleEdit}
                                    id={item.id} 
                                    from={item.from} 
                                    to={item.to} 
                                    date={item.date}
                                    travelClass={item.travelClass} 
                                    mode={'Bus'}
                                    time={item.time}/>
                            </SortableItem>)
                        }

                        if(item.category == 'cabs'){
                            return (<SortableItem id={item.id} key={item.id} >
                                <CabCard
                                    handleDelete={handleDelete}
                                    handleEdit={handleEdit}
                                    id={item.id} 
                                    from={item.pickupAddress} 
                                    to={item.dropAddress} 
                                    date={item.date}
                                    returnDate={item.returnDate}
                                    isFullDayCab={item.isFullDayCab}
                                    travelClass={item.class} 
                                    mode={'Cab'}
                                    time={item.time}/>
                            </SortableItem>)
                        }

                        if(item.category == 'carRentals'){
                            return (<SortableItem id={item.id} key={item.id} >
                                <RentalCabCard
                                    handleDelete={handleDelete}
                                    handleEdit={handleEdit}
                                    id={item.id} 
                                    from={item.pickupAddress} 
                                    to={item.dropAddress} 
                                    date={item.date}
                                    returnDate={item.returnDate}
                                    travelClass={item.class} 
                                    mode={'Cab'}
                                    time={item.time}/>
                            </SortableItem>)
                        }

                        if(item.category == 'hotels'){
                            return (<SortableItem id={item.id} key={item.id} >
                                <HotelCard
                                    handleDelete={handleDelete}
                                    handleEdit={handleEdit}
                                    id={item.id} 
                                    checkIn={item.checkIn} 
                                    checkOut={item.checkOut} 
                                    location={item.location}
                                    time={item.preferredTime}
                                    needBreakfast={item.needBreakfast}
                                    needLunch={item.needLunch}
                                    needDinner={item.needDinner}
                                    needNonSmokingRoom={item.needNonSmokingRoom}
                                    />
                            </SortableItem>)
                        }

                    })}
                </SortableContext>
            </div>

        </DndContext>
    </div>)
}

const SortableItem = ({id, children})=>{
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});

    const style={
        transition,
        transform: CSS.Transform.toString(transform),
        touchAction: 'none'
    }
    
    return(<>
        <div className="hover:cursor-move flex items-center justify-center" ref={setNodeRef} {...attributes} {...listeners} style={style} key={id} >
            {children}
        </div>
    </>)
}

function flattenObjectToArray(obj) {
    return Object.entries(obj).reduce((acc, [key, val]) => {
      if (Array.isArray(val)) {
        const transformedArray = val.map(item => ({
          ...item,
          id: item.formId,
          category: key
        }));
        return acc.concat(transformedArray);
      }
      return acc;
    }, []);
  }

function arrayToObject(arr) {
    const fixedKeys = ['flights', 'buses', 'trains', 'cabs', 'carRentals', 'hotels'];

    // Initialize the object with fixed keys and empty arrays
    const result = fixedKeys.reduce((acc, key) => {
        acc[key] = [];
        return acc;
    }, {});

    // Populate the object with items from the array
    arr.forEach(item => {
        const { id, category, ...rest } = item;
        const newItem = { ...rest, formId: id };
        
        if (result[category]) {
        result[category].push(newItem);
        }
    });

    return result;
}
