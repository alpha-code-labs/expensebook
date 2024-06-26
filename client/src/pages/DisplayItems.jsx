import {closestCorners, DndContext} from '@dnd-kit/core';
import { useState } from 'react';
import {useSortable, SortableContext, verticalListSortingStrategy, arrayMove} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'


export default function(){

    const [itemsList, setItemsList] = useState(['Flight', 'Bus', 'Cab']);

    const handleDragEnd = (event)=>{
        console.log('drag end called');
        const {active, over} = event;

        setItemsList(items=>{
            const activeIndex = items.indexOf(active.id);
            const overIndex = items.indexOf(over.id);

            return arrayMove(items, activeIndex, overIndex);
        })
    
        console.log(active.id, 'active, over ', over.id);
    }
    
    return(
        <DndContext
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}>

            <div className='p-4 w-[500px]'>
                <SortableContext
                    strategy={verticalListSortingStrategy}
                    items={itemsList}>

                    {itemsList.map(item=> <SortableItem key={item} id={item}>
                        {item}
                    </SortableItem>)}

                </SortableContext>
            </div>

        </DndContext>
    )
}


const SortableItem = ({id, key, children})=>{
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});

    const style={
        transition,
        transform: CSS.Transform.toString(transform)
    }
    
    return(<>
        <div ref={setNodeRef} {...attributes} {...listeners} style={style} key={key} >
            <div className='p-4  border  border-gray-400'>
                {children}
            </div>
        </div>
    </>)
}
 