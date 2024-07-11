import React from 'react';
import { getStatusClass, titleCase } from '../../utils/handyFunctions';
import { down_left_arrow } from '../../assets/icon';

const CancelledTrip = ({ handleTrip, tripId }) => {
  // Static data for demonstration purposes
  const tripsData = [
    {
      tripId: "tr-sdffiuo",
      tripNumber: "TRAM00000001",
      tripStatus: 'paid and cancelled',
    },
    {
      tripId: "tr-sdffiuo",
      tripNumber: "TRAM00000001",
      tripStatus: 'transit',
      itinerary: [
        {
          itineraryId: '87687',
          from: 'newyork',
          to: 'phoenix',
          status: 'paid and cancelled',
        },
        {
          itineraryId: 'tijfjhfjhf',
          from: 'sydney',
          to: 'seol',
          status: 'paid and cancelled',
        },
      ],
    },
    {
      tripId: "tr-sdffiuo",
      tripNumber: "TRAM00000001",
      tripStatus: 'paid and cancelled',
      itinerary: [
        {
          itineraryId: 'iti678sfd',
          from: 'florida',
          to: 'new delhi',
          status: 'paid and cancelled',
        },
        {
          itineraryId: 'itinesdhfjh',
          from: 'new delhi',
          to: 'new delhi',
          status: 'paid and cancelled',
        },
      ],
    },
  ];

  return (
    <>
      {tripsData.map((item, index) => (
        <div key={index} className='border border-slate-300 rounded-md mb-2 shadow-md  flex flex-col   justify-between '>
          <div className=' border-b border-slate-300 px-4 py-2 flex flex-col md:flex-row h-[52px] items-center justify-between'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='flex items-center gap-2'>
                <div className='text-[16px] md:text-[14px] font-medium text-neutral-800'>
                  {item?.tripNumber}
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              {item?.tripStatus === 'paid and cancelled' && (
                <div className={`flex items-center px-3 py-2 rounded-[12px] text-[14px] font-medium ${getStatusClass(item?.tripStatus)}`}>
                  {titleCase(item?.tripStatus ?? "")}
                </div>
              )}
              <div
                className='flex items-center justify-center rounded-[32px] w-[140px]  cursor-pointer '
                onClick={() => handleTrip(tripId, "trip-recovery-view")}
              >
                <div className='font-bold text-[14px] text-purple-500'>
                  View Details
                </div>
              </div>
            </div>
          </div>

          <div className={`${item?.itinerary?.length>0 ? 'mt-4': ''}`}>
            {item?.itinerary && item?.itinerary.map((itnItem, itnIndex) => (
              <div key={itnIndex} className='flex flex-row items-center ml-0 md:ml-32 sm:ml-28 gap-2 text-gray-700'>
                <div className='w-auto min-w-[20px] flex justify-center items-center px-3 py-3'>
                  <img className='w-6 h-[20px] translate-y-[-2px]' src={down_left_arrow} alt='arrow'/>
                </div>
                <div className='w-auto min-w-[200px] flex justify-center items-center px-3 py-2'>
                  <div className='text-[14px] tracking-[0.02em] font-bold'>
                    {itnItem.itineraryId}
                  </div>
                </div>

                {item.tripStatus !== 'paid and cancelled' && (
                  <div className={`flex items-center px-3 py-2 rounded-[12px] text-[14px] font-medium ${getStatusClass(itnItem?.status)}`}>
                    {titleCase(itnItem?.status ?? "")}
                  </div>
                )}

                {item?.tripStatus === 'pending approval' && itnItem.status === 'pending approval' && (
                  <div
                    className='flex-1 flex items-center justify-end py-2 px-3 cursor-pointer'
                    onClick={() => handleTrip(tripId, "trip-recovery-view")}
                  >
                    <b className='text-purple-500 text-[14px]'>
                      View Details
                    </b>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default CancelledTrip;



// import React,{useState,useEffect} from 'react';
// import { getStatusClass ,titleCase, urlRedirection } from '../../utils/handyFunctions';
// import {  airplane_1, calender_icon, double_arrow, down_left_arrow, validation_sym } from '../../assets/icon'

// import { useData } from '../../api/DataProvider';

// const CancelledTrip = ({handleTrip ,tripId }) => {
// //for get data from backend 
// const {travelAdminData}=useData()

// // const [tripData,setTripData]=useState(null)
// // ///this is for backend data when we will get
// // useEffect(()=>{
// //   const tripsAndLineItemsData = travelAdminData?.travelRequests
// //   setTripData(tripsAndLineItemsData)   
// // },[travelAdminData])

// //data with line item in this array
//   const tripsData = [
//     {
//       tripId:"tr-sdffiuo",
//       tripNumber:"TRAM00000001",
//       tripStatus: 'paid and cancelled',      
//     },
//     {
//       tripId:"tr-sdffiuo",
//       tripNumber:"TRAM00000001",
//       tripStatus: 'transit',
//       itinerary:[{
//         itineraryId:'87687',
//         from:'newyork',
//         to:'phoenix',
//         status:'paid and cancelled'
//       },{
//         itineraryId:'tijfjhfjhf',
//         from:'sydney',
//         to:'seol',
//         status:'paid and cancelled'
//       }]
      
      
//     }, {
//       tripId:"tr-sdffiuo",
//       tripNumber:"TRAM00000001",
//       tripStatus: 'paid and cancelled',
//       itinerary:[{
//         itineraryId:'iti678sfd',
//         from:'florida',
//         to:'new delhi',
//         status:'paid and cancelled'
//       },{
//         itineraryId:'itinesdhfjh',
//         from:'new delhi',
//         to:'new delhi',
//         status:'paid and cancelled'
//       }]
      
      
//     },
//   ];

//   return (
   
//  <>
//    {tripsData.map((item, index)=>(
//       <React.Fragment>
//          <div className=' border border-slate-300 rounded-md  mx-4 m-2'>

// <>
// <div className=''>
// <div className="flex  flex-row   w-auto  items-center  h-auto max-h-[200px] lg:h-[52px] md:justify-between justify-between  ">    
// {/* <div className='flex  flex-row w-auto  gap-2'> */}
// <div className='flex  flex-col md:flex-row sm:gap-0 md:gap-4 lg:gap-4 xl:gap-6'>



// <div className="flex h-[52px] w-auto min-w-[100px]  items-center justify-start  py-0 md:py-3 px-2 order-1 gap-2">
// {/* xl:w-auto lg:w-[100px] md:w-[170px] md:min-w-[180px] */}
// <div className=" md:text-[14px] w-auto     text-[16px] text-left font-medium tracking-[0.03em] leading-normal text-neutral-800 font-cabin  ">
// {item?.tripNumber}
// </div>
// </div> 
// </div>

// <div className='flex   items-end md:items-center justify-around    flex-col md:flex-row gap-2'>
// {item?.tripStatus == 'paid and cancelled' &&
// <div className="flex h-[52px]  items-center justify-start md:w-[190px]  xl:w-[200px] lg:[100px] py-0 md:py-3 px-2  gap-2">
// <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] ${
//      getStatusClass(item?.tripStatus)
//     }`}
//   >
//     {titleCase(item?.tripStatus ?? "")}
    
//   </div>
// </div> }
// {/* View Details */}
// <div className="rounded-[32px] box-border w-[140px]  h-[52px] flex flex-row items-center justify-center  cursor-pointer " onClick={()=>handleTrip(tripId,"trip-recovery-view")}>
// <div className="font-bold text-[14px]  min-w-[72px] truncate w-auto max-w-[140px]   lg:truncate   h-[17px] text-purple-500 text-center">
// View Details
// </div>
// </div>
// </div>


// {/* </div> */}

// </div>

// </div>

// <div>

// </div>
// {/* </div> */}

// {/* </div> */}
// </>

// {/* //   ))}
// </div> */}
// <div className='h-auto'>
//   {item?.itinerary && item?.itinerary.map((itnItem,index)=>(
//     <>
//     <div key={index} className='flex flex-row items-center ml-0   lg:ml-32  sm:ml-28 gap-2 text-gray-200'>
//   <div className='w-auto  mi min-w-[20px] flex justify-center items-center px-3 py-3 '>
//   <img className='w-6 h-[20px] translate-y-[-2px]' src={down_left_arrow}/>
      
      
//   </div>
  
//   <div className='w-auto min-w-[200px] flex justify-center items-center px-3 py-2'>
 
  
//     <div className='  text-[14px] tracking-[0.02em]  font-bold'>
//        {itnItem.itineraryId}
//       </div>
//   </div>
//   {/* <div className=' flex justify-center items-center w-auto min-w-[130px] h-[44px] px-3 py-2 sr-only  sm:not-sr-only'>
//     <div className=' tracking-[0.03em] leading-normal text-[14px] text-center'>
//       {item.date}
//     </div>
//   </div>  */}
//   <div className='flex w-auto sm:w-[170px] min-w-[120px] justify-center items-center px-0 sm:py-2 sm:px-3 font-cabin gap-2'>
//     {/* <div className='w-5 h-5'>
//     {item.violation.length>0 ?(
//     <img src={validation_sym} alt='three dot' className='w-[20px] h-[20px] ' />
//     ) :""}
//     </div> */}
//   {/* <div className=' '>
    
//       {item?.amountdetails.map((item,index)=>(
//       <>
//       <div className='text-[14px]'>
//       {item.currency}
//       {item.amount},
//       </div>
//       </>
//     ))}
//   </div> */}
// </div>

// {item.tripStatus !== 'paid and cancelled' &&
// <div className={`flex items-center px-3 pt-[6px] pb-2 py-3 rounded-[12px] text-[14px] font-medium tracking-[0.03em] ${
//      getStatusClass(itnItem?.status)
//     }`}
//   >
//     {titleCase(itnItem?.status ?? "")}
    
//   </div> }

//   {item?.tripStatus && item?.tripStatus ==='pending approval' && itnItem.status=='pending approval' &&
//    <div onClick={()=>handleTrip(tripId,"trip-recovery-view")} className="flex-1 flex items-center justify-end py-2 px-3 cursor-pointer">
//    <b className="text-purple-500 text-[14px] tracking-[0.02em] w-[98px] font-bold">
//      View Details
     
//    </b>
//  </div>}
//   </div>
//     </>
//   ))}
//   </div>


// </div>
//       </React.Fragment>
//     ))
    
    
//    }
//  </>
//   )
// }

// export default CancelledTrip
