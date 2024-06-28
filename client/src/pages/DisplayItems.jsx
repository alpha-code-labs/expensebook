import {closestCorners, DndContext} from '@dnd-kit/core';
import { useState } from 'react';
import {useSortable, SortableContext, verticalListSortingStrategy, arrayMove} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'

const itinerary__ = [
    {
        "itineraryId": {
            "$oid": "66795e09b2e14ac28c9ed0c2"
        },
        formId: "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784f",
        "sequence": {
            "$numberInt": "2"
        },
        "from": "Jaipur",
        "to": "Delhi",
        "date": "12-16-14",
        "returnDate": null,
        "time": null,
        "returnTime": null,
        "travelClass": null,
        "isReturnTravel": false,
        "violations": {
            "class": null,
            "amount": null
        },
        "approvers": [
            {
                "empId": "1002",
                "name": "Emma Thompson",
                "status": "pending approval",
                "_id": {
                    "$oid": "66795e09b2e14ac28c9ed0ba"
                }
            }
        ],
        "bkd_from": null,
        "bkd_to": null,
        "bkd_date": null,
        "bkd_returnDate": null,
        "bkd_time": null,
        "bkd_returnTime": null,
        "bkd_travelClass": null,
        "bkd_violations": {
            "class": null,
            "amount": null
        },
        "modified": false,
        "cancellationDate": null,
        "cancellationReason": null,
        "rejectionReason": null,
        "status": "pending approval",
        "bookingDetails": {
            "docURL": null,
            "docType": null,
            "billDetails": {
                "vendorName": null,
                "taxAmount": null,
                "totalAmount": null
            }
        },
        "_id": {
            "$oid": "66795e09b2e14ac28c9ed0b9"
        },

        "category" : 'flight'
    },

    {
        "category" : 'flight',
        "itineraryId": {
            "$oid": "66795e09b2e14ac28c9ed0c2"
        },
        formId: "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784j",
        "sequence": {
            "$numberInt": "2"
        },
        "from": "Delhi",
        "to": "Lucknow",
        "date": "12-24-14",
        "returnDate": null,
        "time": null,
        "returnTime": null,
        "travelClass": null,
        "isReturnTravel": false,
        "violations": {
            "class": null,
            "amount": null
        },
        "approvers": [
            {
                "empId": "1002",
                "name": "Emma Thompson",
                "status": "pending approval",
                "_id": {
                    "$oid": "66795e09b2e14ac28c9ed0ba"
                }
            }
        ],
        "bkd_from": null,
        "bkd_to": null,
        "bkd_date": null,
        "bkd_returnDate": null,
        "bkd_time": null,
        "bkd_returnTime": null,
        "bkd_travelClass": null,
        "bkd_violations": {
            "class": null,
            "amount": null
        },
        "modified": false,
        "cancellationDate": null,
        "cancellationReason": null,
        "rejectionReason": null,
        "status": "pending approval",
        "bookingDetails": {
            "docURL": null,
            "docType": null,
            "billDetails": {
                "vendorName": null,
                "taxAmount": null,
                "totalAmount": null
            }
        },
        "_id": {
            "$oid": "66795e09b2e14ac28c9ed0b9"
        }
    },

    {
        "category" : 'flight',
        "itineraryId": {
            "$oid": "66795e09b2e14ac28c9ed0c2"
        },
        formId: "travel_5b5c964a-e99a-436f-a22c-fa7d49f4784k",
        "sequence": {
            "$numberInt": "2"
        },
        "from": "Delhi",
        "to": "Lucknow",
        "date": '"12-25-14"',
        "returnDate": null,
        "time": null,
        "returnTime": null,
        "travelClass": null,
        "isReturnTravel": false,
        "violations": {
            "class": null,
            "amount": null
        },
        "approvers": [
            {
                "empId": "1002",
                "name": "Emma Thompson",
                "status": "pending approval",
                "_id": {
                    "$oid": "66795e09b2e14ac28c9ed0ba"
                }
            }
        ],
        "bkd_from": null,
        "bkd_to": null,
        "bkd_date": null,
        "bkd_returnDate": null,
        "bkd_time": null,
        "bkd_returnTime": null,
        "bkd_travelClass": null,
        "bkd_violations": {
            "class": null,
            "amount": null
        },
        "modified": false,
        "cancellationDate": null,
        "cancellationReason": null,
        "rejectionReason": null,
        "status": "pending approval",
        "bookingDetails": {
            "docURL": null,
            "docType": null,
            "billDetails": {
                "vendorName": null,
                "taxAmount": null,
                "totalAmount": null
            }
        },
        "_id": {
            "$oid": "66795e09b2e14ac28c9ed0b9"
        }
    },
]

const itinerary_ = [
    {formId:1, category:'flight', date: '14-06-2024'},
    {formId:2, category:'bus', date: '16-06-2024'},
    {formId:3, category:'cab', date: '18-06-2024'},
]

export default function(){

    const [itemsList, setItemsList] = useState([{id:1, name: 'Flight', date:'12-06-2024'}, {id:2, name: 'Bus', date:'14-06-2024'}, {id:3, name: 'Cab', date: '12-06-2024'}]);
    const [itinerary, setItinerary] = useState( [
        {id:1, formId:1, category:'flight', date: '14-06-2024'},
        {id:2, formId:2, category:'bus', date: '16-06-2024'},
        {id:3, formId:3, category:'cab', date: '18-06-2024'},
    ]);

    const handleDragEnd = (event)=>{
        console.log('drag end called');
        const {active, over} = event;

        setItinerary(items=>{
            const activeIndex = items.findIndex(item=> item.formId == active.id);
            const overIndex = items.findIndex(item=> item.formId == over.id);
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
                    items={itinerary}>

                    {itinerary.map(item=> <SortableItem key={item.id} id={item.id}>
                        <Card item={item}/>
                    </SortableItem>)}

                </SortableContext>
            </div>
        </DndContext>
    )
}


const Card=({item})=>{

    return(
    <div className='flex gap-4 w-full h-12 bg-slate-50'>
        <p>{item.formId}</p>
        <p>{item.category}</p>
        <p>{item.date}</p>
    </div>)
}


const SortableItem = ({id, key, children})=>{
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});

    const style={
        transition,
        transform: CSS.Transform.toString(transform)
    }
    
    return(<>
        <div ref={setNodeRef} {...attributes} {...listeners} style={style} key={key} >
            <div className='p-4 border  border-gray-400'>
                {children}
            </div>
        </div>
    </>)
}
 