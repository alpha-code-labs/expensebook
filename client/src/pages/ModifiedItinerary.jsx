import DateTime from "../components/common/DateTime";
import Input from "../components/common/Input";
import Search from "../components/common/MultiSearch";
import { useState, useEffect, useRef } from "react";
import SlimDate from "../components/common/SlimDate";
import Select from "../components/common/Select";
import { material_bus_black_icon, material_flight_black_icon, material_train_black_icon } from "../assets/icon";
import { formatDate3, titleCase } from "../utils/handyFunctions";
import { generateUniqueIdentifier } from "../utils/uuid";
import { dummyFlight, dummyCabs, dummyBus, dummyHotel, dummyTrain} from "../data/dummy"
import Button from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import NewItinerary from "./itinerary/NewItinerary";
import {motion} from 'framer-motion';

export default function ModifiedItinerary({formData, setFormData, nextPage, lastPage, currentFormState, setCurrentFormState}){

    const [oneWayTrip, setOneWayTrip] = useState(formData.tripType.oneWayTrip)
    const [roundTrip, setRoundTrip] = useState(formData.tripType.roundTrip)
    const [multiCityTrip, setMultiCityTrip] = useState(formData.tripType.multiCityTrip)

    const navigate = useNavigate();

    const datesDropdownRef = useRef([]);
    const datesDropdownParentRef = useRef([]);


    useEffect(() => {
        datesDropdownParentRef.current = datesDropdownParentRef.current.slice(0, currentFormState.itinerary.length);
        datesDropdownRef.current = datesDropdownRef.current.slice(0, currentFormState.itinerary.length);

    }, [currentFormState.itinerary.length]);



    //handle outside clicks for mode dropdown
    // useEffect(() => {
    //     const handleClick = (event) => {
    //       event.stopPropagation()
    //       if (datesDropdownRef.current && datesDropdownParentRef.current && !datesDropdownParentRef.current.contains(event.target) && !datesDropdownRef.current.contains(event.target)) {
    //           setFullDayCabDropdown(pre=>({...pre, visible:false}))
    //           console.log('removing dropdown because of outside click')
    //       }
    //     };
    //     document.addEventListener("click", handleClick)
  
    //     return () => {
    //       console.log('removing dropdown')
    //       document.removeEventListener("click", handleClick)
    //     }
  
    //   }, []);

    //convert formdata to currentFormState 
    useEffect(()=>{

        if(formData.tripType.onwWayTrip){
            let mode = '';
            let itemType = ''
            
            if(formData.itinerary.flights.length>0){
                mode = 'flight';
                itemType = 'flights'
            }
            if(formData.itinerary.trains.length>0){
                mode = 'train';
                itemType = 'trains';
            }
            if(formData.itinerary.buses.length>0){
                mode = 'bus';
                itemType = 'buses';
            }

            console.log(mode, itemType)
            if(mode != ''){

                const formId = formData.itinerary[itemType].formId;
                const from = formData.itinerary[itemType].from;
                const to = formData.itinerary[itemType].to;
                const date = formData.itinerary[itemType].date;
                const pickUpNeeded = formData.cabs.length>0;

                // setCurrentFormState({
                //     isReturnTravel: false,
                //     itinerary: [
                //     {
                //         formId,
                //         mode,
                //         from,
                //         to,
                //         date: date??new Date().toISOString,
                //         returnDate: undefined,
                //         hotelNights: 0,
                //         pickUpNeeded,
                //         dropNeeded: false,
                //         fullDayCabs: 0,
                //         fullDayCabDates: [],
                //         dateError:{set:false, message:null},
                //         returnDateError:{set:false, message:null},
                //         fromError: {set:false, message:null},
                //         toError: {set:false, message:null},
                //     }
                // ]})
            }

        }else if(formData.tripType.roundTrip){

        }else if(formData.tripType.multiCityTrip){

        }

    },[])

    const updateDepartureCity = (formId, city)=>{
        const newFormState = JSON.parse(JSON.stringify(currentFormState));
        newFormState.itinerary.find(item=>item.formId == formId).from = city;
        setCurrentFormState(newFormState)
    }

    const updateMode = (formId, mode)=>{
        const newFormState = JSON.parse(JSON.stringify(currentFormState));
        newFormState.itinerary.find(item=>item.formId == formId)['mode'] = mode;
        setCurrentFormState(newFormState)
    }

    const updateArrivalCity = (formId, city)=>{
        const newFormState = JSON.parse(JSON.stringify(currentFormState));
        newFormState.itinerary.find(item=>item.formId == formId).to = city;
        setCurrentFormState(newFormState)
    }

    const addAnotherCity = ()=>{
        const newFormState = JSON.parse(JSON.stringify(currentFormState));
        newFormState.isReturnTravel = false;

        //get last itinerary leg
        const lastItem = newFormState.itinerary[newFormState.itinerary.length-1]


        newFormState.itinerary.push({
            formId: newFormState.itinerary.length+1 + generateUniqueIdentifier(),
            mode : lastItem.mode,
            from : lastItem.to,
            to : '',
            date: lastItem.date??new Date().toISOString(),
            returnDate: undefined,
            hotelNights: 0,
            pickUpNeeded: lastItem.dropNeeded??false,
            dropNeeded: false,
            fullDayCabs: 0,
            fullDayCabDates: [],
            dateError:{set:false, message:null},
            returnDateError:{set:false, message:null},
            fromError: {set:false, message:null},
            toError: {set:false, message:null},
        })

        setCurrentFormState(newFormState)
    }

    const updateDepartureDate = (formId, newDate)=>{
        const newFormState = JSON.parse(JSON.stringify(currentFormState));
        const item = newFormState.itinerary.find(item=>item.formId == formId);
        const index = newFormState.itinerary.findIndex(item=>item.formId == formId)
        const isLastItem = index+1 == newFormState.itinerary.length;
        const isFirstItem = index==0;

        console.log(index, 'index of item', isLastItem)
        item.date = newDate


        //check if it's a multicity travel or roundtrip travel
        if(roundTrip && item.returnDate != undefined && item.returnDate != null){
            
            const numberOfNights = dateDiffInDays(newDate, item.returnDate);
            console.log(numberOfNights);
            
            if(numberOfNights < 0){
                item.hotelNights = 0;
                item.fullDayCabs = 0;
                item.fullDayCabDates = []
                item.returnDateError = {set:true, message:'Departure date can not be after return date'};
            }else{
                item.hotelNights = numberOfNights;   
                item.fullDayCabs = numberOfNights;
                item.fullDayCabDates = getAllDates(newDate, item.returnDate);
            }
        }

        if(multiCityTrip){
            if(isFirstItem){
                //check if next item exists
                if(newFormState.itinerary.length > 1){
                    //check if date is set
                    const nextItemDate = newFormState.itinerary[1].date;
                    const dateDiff = dateDiffInDays(newDate, nextItemDate);

                    if( nextItemDate != undefined){
                        if(dateDiff > 0){
                            item.hotelNights = dateDiff;
                            item.fullDayCabs = dateDiff;
                            item.fullDayCabDates = getAllDates(newDate, nextItemDate)
                        }
                    }else{
                        item.hotelNights = 0;
                    }
                }
            }

            if(isLastItem){
                if(newFormState.itinerary.length > 1){
                    //look for lastItem
                    const lastItemDate = newFormState.itinerary[index-1].date;
                    
                    if(lastItemDate != undefined){
                        const dateDiff = dateDiffInDays(lastItemDate, newDate)
                        if(dateDiff > 0){
                            newFormState.itinerary[index-1].hotelNights = dateDiff;
                            newFormState.itinerary[index-1].fullDayCabs = dateDiff;
                            newFormState.itinerary[index-1].fullDayCabDates = getAllDates(lastItemDate, newDate)
                        }
                    }else{
                        newFormState.itinerary[index-1].hotelNights = 0;
                        newFormState.itinerary[index-1].fullDayCabs = 0;
                        newFormState.itinerary[index-1].fullDayCabDates = [];
                    }
                }
            }

            if(!isLastItem && !isFirstItem){
                //update hotel nights for item before it.
                const lastItemDate = newFormState.itinerary[index-1].date;    
                if(lastItemDate != undefined){
                    const dateDiff = dateDiffInDays(lastItemDate, newDate)
                    if(dateDiff > 0){
                        newFormState.itinerary[index-1].hotelNights = dateDiff;
                        newFormState.itinerary[index-1].fullDayCabs = dateDiff;
                        newFormState.itinerary[index-1].fullDayCabDates = getAllDates(lastItemDate, newDate)
                    }
                }else{
                    newFormState.itinerary[index-1].hotelNights = 0;
                    newFormState.itinerary[index-1].fullDayCabs = 0;
                    newFormState.itinerary[index-1].fullDayCabDates = 0;
                }

                //update hotel nights for this line
                const nextItemDate = newFormState.itinerary[index+1].date;    

                if(nextItemDate != undefined){
                    const dateDiff = dateDiffInDays(newDate, nextItemDate)
                    if(dateDiff > 0){
                        newFormState.itinerary[index].hotelNights = dateDiff;
                        newFormState.itinerary[index].fullDayCabs = dateDiff;
                        newFormState.itinerary[index].fullDayCabDates = getAllDates(newDate, nextItemDate)
                    }
                }else{
                    newFormState.itinerary[index+1].hotelNights = 0;
                    newFormState.itinerary[index+1].fullDayCabs = 0;
                    newFormState.itinerary[index+1].fullDayCabDates = 0;
                }
                
                //update hotel nights for item after it... if that is not the last element (there is no effect)
                // if(ind+1 != newFormState.itinerary.length){
                //     const nextItemDate = newFormState.itinerary[index+1].date;    
                //     if(nextItemDate != undefined){
                //         const dateDiff = dateDiffInDays(newDate, nextItemDate)
                //         if(dateDiff > 0){
                //             newFormState.itinerary[index+1].hotelNights = dateDiff;
                //             newFormState.itinerary[index+1].fullDayCabs = dateDiff;
                //             newFormState.itinerary[index+1].fullDayCabDates = getAllDates(newDate, nextItemDate)
                //         }
                //     }else{
                //         newFormState.itinerary[index+1].hotelNights = 0;
                //         newFormState.itinerary[index+1].fullDayCabs = 0;
                //         newFormState.itinerary[index+1].fullDayCabDates = 0;
                //     }
                // }

            }
        }

        setCurrentFormState(newFormState)
    }
    
    const updateArrivalDate = (formId, newDate)=>{
        const newFormState = JSON.parse(JSON.stringify(currentFormState));
        newFormState.itinerary.find(item=>item.formId == formId).returnDate = newDate;

        const date = currentFormState.itinerary.find(item=>item.formId == formId).date;
        const numberOfNights = dateDiffInDays(date, newDate);

        console.log(numberOfNights);

        if(numberOfNights < 0){
            newFormState.itinerary.find(item=>item.formId == formId).hotelNights = 0;
            newFormState.itinerary.find(item=>item.formId == formId).fullDayCabs = 0;
            newFormState.itinerary.find(item=>item.formId == formId).fullDayCabDates = [];
            newFormState.itinerary.find(item=>item.formId == formId).returnDateError = {set:true, message:'Return date can not be before departure date'};
        }else{
            newFormState.itinerary.find(item=>item.formId == formId).hotelNights = numberOfNights;   
            newFormState.itinerary.find(item=>item.formId == formId).fullDayCabs = numberOfNights;
            newFormState.itinerary.find(item=>item.formId == formId).fullDayCabDates = getAllDates(date, newDate);
        }

        setCurrentFormState(newFormState)        
    }

    function selectTripType(type){
        console.log('this ran')
        const newFormState = JSON.parse(JSON.stringify(currentFormState));
       
        switch(type){
            case 'oneWay':{
                setOneWayTrip(true)
                setRoundTrip(false)
                setMultiCityTrip(false)
                setFormData(pre=>({...pre, tripType:{onwWayTrip:true, roundTrip:false, multiCityTrip:false}}))
                newFormState.isReturnTravel = false;
                newFormState.itinerary = newFormState.itinerary.filter((item,ind)=> ind == 0);
                newFormState.itinerary[0].hotelNights = 0;
                newFormState.itinerary[0].fullDayCabs = 0;
                newFormState.itinerary[0].fullDayCabDates = 0;
                newFormState.itinerary[0].dropNeeded = false;
                setCurrentFormState(newFormState)
                return
            }

            case 'round':{
                setOneWayTrip(false)
                setRoundTrip(true)
                setMultiCityTrip(false)
                setFormData(pre=>({...pre, tripType:{onwWayTrip:false, roundTrip:true, multiCityTrip:false}}))
                newFormState.isReturnTravel = true;
                newFormState.itinerary = newFormState.itinerary.filter((item,ind)=> ind == 0);
                newFormState.itinerary[0].hotelNights = 0;
                newFormState.itinerary[0].fullDayCabs = 0;
                newFormState.itinerary[0].fullDayCabDates = 0;
                newFormState.itinerary[0].dropNeeded = false;
                setCurrentFormState(newFormState)
                return
            }

            case 'multiCity':{
                setOneWayTrip(false)
                setRoundTrip(false)
                setMultiCityTrip(true)
                setFormData(pre=>({...pre, tripType:{onwWayTrip:false, roundTrip:false, multiCityTrip:true}}))
                newFormState.isReturnTravel = false;
                newFormState.itinerary = newFormState.itinerary.filter((item,ind)=> ind == 0);
                newFormState.itinerary[0].hotelNights = 0;
                newFormState.itinerary[0].fullDayCabs = 0;
                newFormState.itinerary[0].fullDayCabDates = 0;
                setCurrentFormState(newFormState)
                addAnotherCity();
                return
            }

            default : {
                setOneWayTrip(true)
                setRoundTrip(false)
                setMultiCityTrip(false)
                return
            }
        }
    }

    const updateNeedPickup = (formId, needed)=>{
        const newFormState = JSON.parse(JSON.stringify(currentFormState));
        newFormState.itinerary.find(item=>item.formId == formId).pickUpNeeded = needed;
        setCurrentFormState(newFormState)
    }

    const updateNeedDropoff = (formId, needed)=>{
        const newFormState = JSON.parse(JSON.stringify(currentFormState));
        newFormState.itinerary.find(item=>item.formId == formId).dropNeeded = needed;
        setCurrentFormState(newFormState)
    }

    const getMode=(mode)=>{
        console.log(mode)
        if(mode == 'flight') return 'flights';
        else if(mode == 'bus') return 'buses';
        else if(mode == 'train') return 'trains';
    }

    const getDummy=(mode)=>{
        if(mode == 'flight') return dummyFlight;
        else if(mode == 'train') return dummyTrain;
        else if(mode == 'bus') return dummyBus;   
    }

    const getPlatform = (mode)=>{
        if(mode == 'flight') return 'airport';
        else if(mode == 'train') return 'Railway Station';
        else if(mode == 'bus') return 'Bus Stand';
    }

    const handleContinue = ()=>{

        const itinerary = {
            cabs:[],
            hotels:[],
            flights:[],
            trains:[],
            buses:[],
            carRentals:[],
            personalVehicles:[],
        };

        if(oneWayTrip){
            const item = currentFormState.itinerary[0];
            const mode = item.mode;
            const date = item.date;
            const from = item.from;
            const to = item.to;
            console.log(getMode(mode))

            itinerary[getMode(mode)].push({
                ...getDummy(mode), 
                approvers:formData.approvers, 
                from,
                date,
                to,
                formId:item.formId})
            
            if(item.pickUpNeeded){
                itinerary.cabs.push({...dummyCabs,
                    formId:item.formId,
                    pickupAddress: 'predefined',
                    dropAddress : getPlatform(mode),
                    date,
                })
            }

            if(item.dropNeeded){
                itinerary.cabs.push({...dummyCabs,
                    formId:item.formId,
                    pickupAddress: getPlatform(mode),
                    dropAddress : 'Hotel',
                    date,
                })
            }

        }
        if(roundTrip){

            const item = currentFormState.itinerary[0];
            const mode = item.mode;
            const date = item.date;
            const from = item.from;
            const to = item.to;
            const returnDate = item.returnDate;

            console.log(getMode(mode))

            itinerary[getMode(mode)].push({
                ...getDummy(mode), 
                approvers:formData.approvers, 
                from,
                date,
                to,
                formId:item.formId})

            itinerary[getMode(mode)].push({
                ...getDummy(mode), 
                approvers:formData.approvers, 
                from:to,
                date:returnDate,
                to:from,
                formId:item.formId})
            
            if(item.pickUpNeeded){
                itinerary.cabs.push({...dummyCabs,
                    approvers:formData.approvers,
                    formId:item.formId,
                    pickupAddress: 'predefined',
                    dropAddress : `${from} ${getPlatform(mode)}`,
                    date,
                })
            }

            if(item.dropNeeded){
                itinerary.cabs.push({...dummyCabs,
                    approvers:formData.approvers,
                    formId:item.formId,
                    pickupAddress: `${to} ${getPlatform(mode)}`,
                    dropAddress : `Hotel in ${to}`,
                    date:returnDate,
                })
            }

            if(item.hotelNights > 0){
                itinerary.hotels.push({...dummyHotel,
                    approvers:formData.approvers,
                    formId: item.formId,
                    location: item.to,
                    checkIn: item.date,
                    checkOut: item.returnDate,  
                })
            }

        }
        if(multiCityTrip){
            currentFormState.itinerary.forEach((item, ind)=>{
                const mode = item.mode;
                const date = item.date;
                const from = item.from;
                const to = item.to;
                console.log(getMode(mode))

                itinerary[getMode(mode)].push({
                    ...getDummy(mode), 
                    approvers:formData.approvers, 
                    from,
                    date,
                    to,
                    formId:item.formId})

                    if(ind == 0){
                        if(item.pickUpNeeded){
                            itinerary.cabs.push({...dummyCabs,
                                approvers:formData.approvers,
                                formId:item.formId,
                                pickupAddress: 'predefined',
                                dropAddress : `${from} ${getPlatform(mode)}`,
                                date,
                            })
                        }
                    }
                    else{
                        if(ind+1 == currentFormState.itinerary.length){
                            if(item.pickUpNeeded){
                                itinerary.cabs.push({...dummyCabs,
                                    approvers:formData.approvers,
                                    formId:item.formId,
                                    pickupAddress: `Hotel in ${from}`,
                                    dropAddress : `${from} ${getPlatform(mode)}`,
                                    date,
                                })
                            }
                        }
                        else{
                            if(item.pickUpNeeded){
                                itinerary.cabs.push({...dummyCabs,
                                    approvers:formData.approvers,
                                    formId:item.formId,
                                    pickupAddress: `Hotel in ${from}`,
                                    dropAddress : `${from} ${getPlatform(mode)}`,
                                    date,
                                })
                            }
                        }
                    }
                    
                    if(item.dropNeeded){
                        itinerary.cabs.push({...dummyCabs,
                            approvers:formData.approvers,
                            formId:item.formId,
                            pickupAddress: `${to} ${getPlatform(mode)}`,
                            dropAddress : `Hotel in ${to}`,
                            date,
                        })
                    }
        
                    if(item.hotelNights > 0){
                        itinerary.hotels.push({...dummyHotel,
                            approvers:formData.approvers,
                            formId: item.formId,
                            location: item.to,
                            checkIn: item.date,
                            //look for next item date
                            checkOut: currentFormState.itinerary[ind+1].date,  
                        })
                    }
                
            })
        }


        setFormData(pre=>({...pre, itinerary}))
        
        //redirect to next page
        navigate(nextPage);

        console.log(itinerary)
    }

    const handleFullDayCabDates = (formId, date)=>{
        const newFormState = JSON.parse(JSON.stringify(currentFormState));
        const item = newFormState.itinerary.find(itm=>itm.formId == formId);
        
        console.log(date, 'incoming date');

        if(item.fullDayCabDates.includes(date)){
            console.log('date is already present')
            item.fullDayCabDates = item.fullDayCabDates.filter(d=>d != date);
        }else{
            console.log('date not present')
            item.fullDayCabDates.push(date);
        }
        
        item.fullDayCabs = item.fullDayCabDates.length;

        setCurrentFormState(newFormState)
    }

    let firstTime = true;

    useEffect(()=>{
        console.log(currentFormState)
    },[currentFormState])

    const [fullDayCabDropdown, setFullDayCabDropdown] = useState({visible:false, x:null, y:null, dates:[]})

    const handleFullDayDropdown = (e, startDate, endDate, itemIndex)=>{

        const parentRef = datesDropdownParentRef.current[itemIndex];
        const targetRef = datesDropdownRef.current[itemIndex];

        console.log(parentRef, 'parent ref')

        const x = e.pageX;
        const y = e.pageY;
        const dates = getAllDates(startDate, endDate)
        setFullDayCabDropdown(pre=>({visible:!pre.visible, x, y, dates}))

        const handleClick = (event) => {
            event.stopPropagation()
            if (parentRef.current && targetRef.current && !target.current.contains(event.target) && !parentRef.current.contains(event.target)) {
                setFullDayCabDropdown(pre=>({...pre, visible:false}))
                console.log('removing dropdown because of outside click')
                document.removeEventListener("click", handleClick)
            }
          };

        document.addEventListener("click", handleClick)
    
    }

    return(<>
        
        <div className="p-10 border border-sm rounded-xl w-[90%] mx-auto mt-10">

        {<div className="w-fit h-6 justify-start items-center gap-4 inline-flex mt-5">
            <div onClick={()=>{selectTripType('oneWay')}} className={`${ oneWayTrip? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer`}>One Way </div>
            <div onClick={()=>selectTripType('round')} className={`${ roundTrip? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer `}>Round Trip</div>
            <div onClick={()=>{selectTripType('multiCity')}} className={`${ multiCityTrip? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer `}>Multi City</div>
        </div>}

        <hr className="my-2" />

        {currentFormState.itinerary.map((item, itemIndex)=>(<div className="gap-4 items-center flex">

            <div key={item.formId} className="flex items-end gap-2 overflow-x-scroll no-scroll">
                <Mode onChange={(mode)=>updateMode(item.formId, mode)} />

                <Input 
                    value={item.from}
                    onChange={(e)=>updateDepartureCity(item.formId, e.target.value)}
                    title={'Leaving from?'}
                    placeholder={'City'} />

                <SlimDate 
                    date={item.date}
                    error = {item.dateError}
                    title={'On?'} 
                    onChange={(e)=>updateDepartureDate(item.formId, e.target.value)}/>

                <Input 
                    value={item.to}
                    onChange={(e)=>updateArrivalCity(item.formId, e.target.value)}
                    title={'Where to?'}
                    placeholder={'City'} />

                {roundTrip && <SlimDate value={item.returnDate} error = {item.returnDateError} onChange={(e)=>updateArrivalDate(item.formId, e.target.value)} title={'Returning on?'}/>}

                {<>
                    {(currentFormState.itinerary.length != itemIndex+1 || roundTrip) && <div className="h-[73px] font-cabin text-zinc-600 flex flex-col gap-2 text-sm">
                        <p className="whitespace-nowrap">Hotel</p>
                        <p className="h-[45px] py-2 whitespace-nowrap">{`${item.hotelNights} nights`}</p>
                    </div>}

                    <div className="h-[73px] font-cabin text-zinc-600 flex flex-col gap-2 text-sm">
                        <p className="whitespace-nowrap">Pick-up</p>
                        <div className="h-[45px] px-6 py-2 whitespace-nowrap">
                            <input type="checkbox" id={item.formId} name={`pickup_${item.formId}`} value={`pickup_${item.formId}`} checked={item.pickUpNeeded} onClick={()=>{updateNeedPickup(item.formId, !item.pickUpNeeded)} } />
                        </div>
                    </div>

                    {(currentFormState.itinerary.length != itemIndex+1 || roundTrip) && <div className="h-[73px] font-cabin text-zinc-600 flex flex-col gap-2 text-sm">
                        <p className="whitespace-nowrap">Drop-off</p>
                        <p className="h-[45px] px-6 py-2 whitespace-nowrap">
                            <input type="checkbox" id={item.formId} name={`dropoff_${item.formId}`} value={`dropoff_${item.formId}`} checked={item.dropNeeded} onClick={()=>updateNeedDropoff(item.formId, !item.dropNeeded)} />
                        </p>
                    </div>}

                    
                    {<FullDayCabs 
                        currentFormState={currentFormState} 
                        setCurrentFormState={setCurrentFormState} 
                        itemIndex={itemIndex} 
                        roundTrip={roundTrip}/>}
                </>}

            </div>

        </div>))}

        {multiCityTrip && <p className="w-fit text-indigo-600 hover:text-indigo-500 hover:cursor-pointer" onClick={addAnotherCity}>Add More +</p>}

        </div>

        <div className="mt-6 ml-[15%]">
            <Button text='Continue' variant='fit' onClick={handleContinue} />
        </div>
    </>);
}


function FullDayCabs({currentFormState, setCurrentFormState, itemIndex, roundTrip}){

    const dropdownRef = useRef(null);
    const dropdownParentRef = useRef(null);

    const [fullDayCabDropdown, setFullDayCabDropdown] = useState({visible:false, x:null, y:null, dates:[]})
    const item = currentFormState.itinerary[itemIndex]

    useEffect(() => {
        const handleClick = (event) => {
          event.stopPropagation()
          if (dropdownRef.current && dropdownParentRef.current && !dropdownParentRef.current.contains(event.target) && !dropdownRef.current.contains(event.target)) {
            console.log('outside clicked...')
            setFullDayCabDropdown(pre=>({...pre, visible:false}))
          }
        };
        document.addEventListener("click", handleClick)
  
        return () => {
          console.log('removing dropdown')
          document.removeEventListener("click", handleClick)
        }
  
      }, []);


    const handleFullDayCabDates = (formId, date)=>{
        const newFormState = JSON.parse(JSON.stringify(currentFormState));
        const item = newFormState.itinerary.find(itm=>itm.formId == formId);
        
        console.log(date, 'incoming date');

        if(item.fullDayCabDates.includes(date)){
            console.log('date is already present')
            item.fullDayCabDates = item.fullDayCabDates.filter(d=>d != date);
        }else{
            console.log('date not present')
            item.fullDayCabDates.push(date);
        }
        
        item.fullDayCabs = item.fullDayCabDates.length;

        setCurrentFormState(newFormState)
    }

    const handleFullDayDropdown = (e, startDate, endDate, itemIndex)=>{
        const x = e.pageX;
        const y = e.pageY;
        const dates = getAllDates(startDate, endDate)
        setFullDayCabDropdown(pre=>({visible:!pre.visible, x, y, dates}))

    }

    const list = { hidden: { opacity: 0 }, visible: {opacity: 1} }
    const itm = { hidden: { y: -10, opacity: 0 }, visible:{y:0, opacity:1} }

    return(<>
        {(currentFormState.itinerary.length != itemIndex+1 || roundTrip) && 
        <motion.div 
        initial={{
            height: '0px'
        }}
        animate={{
            height: '73px'
        }}
        transition={{
            ease : 'linear',
        }}
        className="h-[73px] font-cabin text-zinc-600 flex flex-col gap-2 text-sm">
            <p className="whitespace-nowrap">Full Day Cabs</p>
            <p ref={dropdownParentRef} className="h-[45px] py-2 whitespace-nowrap px-2 border border-m border-neutral-100 rounded-md cursor-pointer" onClick={(e)=>handleFullDayDropdown(e, item.date, roundTrip? item.returnDate : currentFormState.itinerary[itemIndex+1].date, itemIndex)}>{item.fullDayCabs}</p>
            {fullDayCabDropdown.visible && <div ref={dropdownRef} style={{left:`calc(${fullDayCabDropdown.x}px - 55px)`, top:`${fullDayCabDropdown.y+16}px`}} className={`dropdown fixed w-[110px] bg-white rounded z-[101] shadow-xl cursor-pointer`}>
                <p className="py-2 font-cabin text-neutral-600 px-2">Select Dates:</p>
                <motion.ul  variants={list} initial='hidden' animate='visible' className="flex flex-col divide-y gap-2 px-2 overflow-y-scroll no-scroll h-[140px]">
                    {fullDayCabDropdown.dates.map(d=>(<div className="flex justify-between items-center" onClick={()=>handleFullDayCabDates(item.formId, d)}>
                        <motion.li variants={itm} className="font-cabin pt-2 text-neutral-600  divided-y ">
                            {formatDate3(d)}
                        </motion.li>
                            <input type="checkbox" checked={item.fullDayCabDates.length>0 ? item.fullDayCabDates.includes(d) : false} readOnly/>
                        </div>))}

                </motion.ul>
            </div>}
        </motion.div>}
    </>)
}

function Mode({onChange}){

    const [showDropdown, setShowDropdown] = useState(false)
    const [coordinates, setCoordinates] = useState({x:null, y:null});

    const [mode, setMode] = useState('flight');

    const spitSource = (type)=>{
        switch(type){
            case 'flight' : return material_flight_black_icon;
            case 'train' : return material_train_black_icon;
            case 'bus' : return material_bus_black_icon; 
        }
    }

    const dropdownRef = useRef(null);
    const dropdownParentRef = useRef(null);

    const handleDropdown = (e)=>{
        console.log(dropdownParentRef.current.getBoundingClientRect())
        const parentBounderies =  dropdownParentRef.current.getBoundingClientRect();
        setShowDropdown(pre=>!pre)
        setCoordinates({x:parentBounderies.x, y:parentBounderies.y})
    }

    useEffect(() => {
        const handleClick = (event) => {
          event.stopPropagation()
          if (dropdownRef.current && dropdownParentRef.current && !dropdownParentRef.current.contains(event.target) && !dropdownRef.current.contains(event.target)) {
              setShowDropdown(false)
          }
        };
        document.addEventListener("click", handleClick)
  
        return () => {
          console.log('removing dropdown')
          document.removeEventListener("click", handleClick)
        }
  
      }, []);

    const modes = ['flight', 'train', 'bus']

    const onModeChange = (mode)=>{
        setMode(mode)
        onChange(mode)
    }

    const list = { 
        hidden:{width: "50px", maxHeight:'50px', opacity:.8}, 
        visible:{
            width: '110px', 
            maxHeight: '150px',
            opacity:1, 
            transition:{when: 'beforeChildren', ease: 'linear', duration:.05}
        }};

    const listItem = {hidden: {opacity:0}, visible:{opacity:1, duration:.01}}

    return(

        <div ref={dropdownParentRef} className="relative h-[45px] py-2 rounded border border-md border-neutral-300 items-center justify-center flex hover:cursor-pointer" onClick={(e)=>handleDropdown(e)}>

            <div className="pl-6 w-[112px] h-[45px] flex items-center gap-2" >
                <img src={spitSource(mode)} className="w-4 h-4"/>
                <p className="font-cabin text-neutral-700 text-md">{titleCase(mode)}</p>
            </div>

            {showDropdown && 
            <motion.div 
                initial='hidden' 
                animate='visible' 
                variants={list} 
                ref={dropdownRef} 
                style={{top: `${coordinates.y+47}px` , left: `${coordinates.x}px`}} 
                className="fixed flex flex-col w-[114px] bg-white rounded shadow-xl border border-md border-neutral-300 z-[101]">
                
                {modes.map((mode,index)=>(
                    <motion.div variants={listItem}  key={index} className="w-full pl-6 z-[100] h-[45px] flex items-center py-2 gap-2 hover:bg-slate-100 hover:scale-1.5" onClick={()=>onModeChange(mode)}>
                        <img src={spitSource(mode)} className="w-4 h-4"/>
                        <p className="font-cabin text-neutral-700 text-md">{titleCase(mode)}</p>
                    </motion.div>
                ))}

            </motion.div>}

        </div>
    )
}

function dateDiffInDays(a, b) {
    a = new Date(a);
    b = new Date(b);
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

function shortDateFormat(inputDate){
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if(!datePattern.test(inputDate)){
      return
    }

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    let [year, month, day] = inputDate.split('-')
    if(day<10) day=day%10
    const dayWithSuffix = addOrdinalIndicator(day);
    month = monthNames[month-1]

    return dayWithSuffix + ' ' + month;
}

const getAllDates = (a, b)=>{

    if(a == undefined || b == undefined) return [];
    const startDate = new Date(a);
    const endDate = new Date(b);
    const dates = [];
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    // Get the UTC timestamps for start and end dates
    const startUTC = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endUTC = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    // Calculate the number of days between the two dates
    const daysDifference = Math.floor((endUTC - startUTC) / _MS_PER_DAY);

    // Iterate through each day and add it to the array
    for (let i = 0; i <= daysDifference; i++) {
        const currentDate = new Date(startUTC + (i * _MS_PER_DAY));
        dates.push(currentDate.toISOString().split('T')[0]); // Push ISO date without time
    }

    return dates;        
}