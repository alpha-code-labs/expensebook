
import { 
    material_flight_black_icon, 
    material_train_black_icon, 
    material_bus_black_icon, 
    material_cab_black_icon, 
    material_car_rental_black_icon, 
    material_hotel_black_icon, 
    material_personal_black_icon, 
    straight_arrow_icon,
    calender_icon,
    clock_icon,
    location_icon,
    hotel_class_icon,
    edit_icon,
    delete_icon,
    smoking_icon,
    no_smoking_icon,
    restraunt_icon,
    download_ticket_icon,
 } from "../../assets/icon";
import { getStatusClass, titleCase } from "../../utils/handyFunctions";
import moment from "moment";
import { TooltipBtn } from "../common/TinyComponent";

export function FlightCard({handleDownloadFile,disabled, status,from, to, date, returnDate, time, travelClass, onClick, mode = 'Flight', id, handleEdit, handleDelete }) {
  console.log("disabled flag for download", disabled)
    return (
        <CardLayout status={status} >
            <div className="flex flex-col gap-1 justify-center items-center ">
                <img src={spitImageSource(mode)} className='w-6 h-6 shrink-0' />
                {['pending booking'].includes(status) && 
            <div className={`${getStatusClass(status)} capitalize text-center rounded-sm px-1  right-0 top-0`}>
            <p className="text-[10px] text-nowrap">{status}</p>
        </div>}
            </div>
            <CardItemsLayout>
                <div className='flex  items-center gap-1 lg:justify-center'>
                    <div className="text-base semibold">
                        {titleCase(from)}
                    </div>
                    <img src={straight_arrow_icon} className="w-5 rotate-90" />
                    <div className=" text-base semibold">
                        {titleCase(to)}
                    </div>
                </div>
                <CardItemLayout title="Departure Date" imageSource={calender_icon} value={isoString(date)}  />
                <CardItemLayout title="Time" imageSource={clock_icon} value={formattedTime(time)}  />
            </CardItemsLayout>

            <TooltipBtn onClick={handleDownloadFile} onHover={'Download Ticket'} icon={download_ticket_icon} disabled={disabled}/>
            {/* <ActionButtons id={id} handleDelete={handleDelete} handleEdit={handleEdit} /> */} 
        </CardLayout>
    )
}

export function CabCard({handleDownloadFile, disabled, status, from, to, date, returnDate, time, isFullDayCab, travelClass, mode, id, handleDelete, handleEdit }) {
    console.log('isFullDay cab', isFullDayCab)
    return (
        <CardLayout status={status} >
           
            <div className='font-semibold gap-1 items-center flex flex-col'>
                <img src={spitImageSource(mode)} className='w-6 h-6 shrink-0' />
                {isFullDayCab && <p className="text-xs whitespace-nowrap ">Full Day</p>}
                {['pending booking'].includes(status) && 
            <div className={`${getStatusClass(status)} capitalize text-center rounded-sm px-1  right-0 top-0`}>
            <p className="text-[10px] text-nowrap">{status}</p>
        </div>}
            </div>

            <CardItemsLayout>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 capitalize">      
                        <CardItemLayout title="Pickup Location" imageSource={location_icon} value={from}  />
                        <CardItemLayout title="Drop Location" imageSource={location_icon} value={to}  />
                    </div>

                    <div className="flex flex-col gap-2  sm:flex-row sm:gap-6 ">
                        {!isFullDayCab && <CardItemLayout title={`Cab Date`} imageSource={calender_icon} value={isoString(date)}  />}
                        {isFullDayCab && <CardItemLayout title={`Cab Dates`} imageSource={calender_icon} value={`${isoString(date)} - ${isoString(returnDate)}`} whitespace='nowrap' />}
                        <CardItemLayout title="Time" imageSource={clock_icon} value={formattedTime(time)}  />
                        <CardItemLayout title="Cab Type" imageSource={null} value={travelClass}  />
                    </div>
                </div>
                
                
            </CardItemsLayout>
            <TooltipBtn onClick={handleDownloadFile} onHover={'Download Ticket'} icon={download_ticket_icon} disabled={disabled}/>
            

            {/* <ActionButtons id={id} handleDelete={handleDelete} handleEdit={handleEdit} /> */}
    </CardLayout>)
}

export function RentalCabCard({handleDownloadFile, disabled, status,from, to, date, returnDate, time, travelClass, mode, id, handleDelete, handleEdit }) {
    return (
        <CardLayout status={status}>
           
            <div className='font-semibold items-center flex gap-1 flex-col'>
                <img src={spitImageSource(mode)} className='w-6 md:h-6' />
                <p className="text-xs whitespace-nowrap">Self Drive</p>
                {['pending booking'].includes(status) && 
            <div className={`${getStatusClass(status)} capitalize text-center rounded-sm px-1  right-0 top-0`}>
            <p className="text-[10px] text-nowrap">{status}</p>
        </div>}
            </div>
            <CardItemsLayout>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 capitalize">      
                        <CardItemLayout title="Pickup Location" imageSource={location_icon} value={from}  />
                        <CardItemLayout title="Drop Location" imageSource={location_icon} value={to}  />
                    </div>

                    <div className="flex flex-col gap-2  sm:flex-row sm:gap-6 ">
                        <CardItemLayout title={`Cab Dates`} imageSource={calender_icon} value={`${isoString(date)} - ${isoString(returnDate)}`} whitespace='nowrap' />
                        <CardItemLayout title="Time" imageSource={clock_icon} value={formattedTime(time)}  />
                        <CardItemLayout title="Cab Type" imageSource={null} value={travelClass}  />
                    </div>
                </div>
                
                
            </CardItemsLayout>
            <TooltipBtn onClick={handleDownloadFile} onHover={'Download Ticket'} icon={download_ticket_icon} disabled={disabled}/>
            
            
            {/* <ActionButtons id={id} handleDelete={handleDelete} handleEdit={handleEdit} /> */}
        </CardLayout>)
}

export function HotelCard({handleDownloadFile, disabled, status, checkIn, checkOut, location, ratings='any', onClick, id, handleDelete, handleEdit, needBreakfast, needLunch, needDinner, needNonSmokingRoom }) {
    return (
        <CardLayout status={status}>
          <div className="flex flex-col gap-1 items-center justify-center">
            <img src={material_hotel_black_icon} className="w-6 md:h-6" />
            {['pending booking'].includes(status) && 
            <div className={`${getStatusClass(status)} capitalize text-center rounded-sm px-1  right-0 top-0`}>
            <p className="text-[10px] text-nowrap">{status}</p>
        </div>}
        </div>

            <CardItemsLayout>
                <div className="flex flex-col w-full gap-2">
                
                    <div className="flex flex-col sm:flex-row gap-y-2 sm:gap-2 justify-between w-full">
                        <CardItemLayout title={'Location'} imageSource={calender_icon} value={location} />
                        <CardItemLayout title={'Hotel Ratings'} imageSource={hotel_class_icon} value={titleCase(ratings)} />
                        
                        <CardItemLayout title={'CheckIn Date'} imageSource={calender_icon} value={isoString(checkIn)} />
                        <CardItemLayout title={'CheckOut Date'} imageSource={calender_icon} value={isoString(checkOut)} />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-8">
                        <CardItemLayout title={'Smoking Preference'} imageSource={needNonSmokingRoom? no_smoking_icon : smoking_icon } value={needNonSmokingRoom ? 'Non-Smoking Room' : 'Smoking Room'} />
                        <CardItemLayout title={'Food Requirements'} imageSource={restraunt_icon} value={!needBreakfast&&!needLunch&&!needDinner? '-' : `${needBreakfast ? 'Breakfast' : ''} ${needLunch? 'Lunch' : ''} ${needDinner? 'Dinner' : ''}`} />
                    </div>
                
                </div>
            </CardItemsLayout>
            <TooltipBtn onClick={handleDownloadFile} onHover={'Download Ticket'} icon={download_ticket_icon} disabled={disabled}/>

            {/* <ActionButtons id={id} handleDelete={handleDelete} handleEdit={handleEdit} /> */}
        </CardLayout>)
}

function CardLayout({ children ,status }) {
    console.log('status',status)
    return (
        <div className={`relative shadow-sm    min-h-[76px] bg-white rounded-md hover:bg-slate-100 border  shadow-slate-300 border-slate-300 w-full px-6 py-4 flex flex-col sm:flex-row gap-4 items-center sm:divide-x`}>
            {children}
        </div>)
}

function ActionButtons({ id, handleDelete, handleEdit }) {
    return (
        <div className="pl-2 flex flex-row sm:flex-col sm:w-8 gap-8 sm:gap-4 cursor-pointer justify-center">
            <div onClick={() => { handleEdit(id) }} className="w-6 h-6 flex items-center justify-center">
                <img src={edit_icon} className="w-6 h-6 hover:w-5 hover:h-5" />
            </div>

            <div onClick={() => { handleDelete(id) }} className="w-6 h-6 flex items-center justify-center">
                <img src={delete_icon} className="w-6 h-6 hover:w-5 hover:h-5" />
            </div>
        </div>
    )
}

function CardItemsLayout({ children }) {
    return (<div className="w-full flex flex-col font-cabin  items-start  text-sm gap-1  sm:flex-row sm:justify-between sm:items-center pl-2">
        {children}
    </div>)
}

function CardItemLayout({ title, imageSource, value, altValue='-', whitespace='wrap'}) {
    return (<div className="flex flex-col justify-center">
        <p className="text-xs text-neutral-600 flex justify-between flex-col sm:flex-row">{title}</p>
        <div className="flex items-center gap-1">
            {imageSource && <img src={imageSource} className="w-4 h-4" />}
            {!imageSource && <p> </p>}
            <p className={`text-xs whitespace-${whitespace}`}>{value ?? '-'}</p>
        </div>
    </div>)
}

function spitImageSource(modeOfTransit) {
    if (modeOfTransit === 'Flight')
        return material_flight_black_icon
    else if (modeOfTransit === 'Train')
        return material_train_black_icon
    else if (modeOfTransit === 'Bus')
        return material_bus_black_icon
    else if (modeOfTransit === 'Cab')
        return material_cab_black_icon
    else if (modeOfTransit === 'Cab Rentals')
        return material_car_rental_black_icon
    else if (modeOfTransit === 'Personal Vehicle')
        return material_personal_black_icon
}

function isoString(dateString) {
    if (dateString == null || dateString == undefined) return ''
    try {
        return moment(dateString).format('ddd DD MMM');
    } catch (e) {
        console.error(e);
        return dateString;
    }
}

function formattedTime(timeValue) {
    if(timeValue)
    return timeValue.split(' ').join('');
}