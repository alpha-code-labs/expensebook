import React from 'react';
import { useApi } from '../utils/contextApi';
import { double_arrow,airplane,validation_sym ,cab_purple} from '../assets/icon';
import CashAdvanceDetails from '../itinerary/CashAdvanceDetails';
import ActionButton from '../components/common/ActionButton';
import SubItinerary from '../itinerary/subItinerary';
import Itinerary from '../itinerary/Itinerary';
import Mod from '../itinerary/Mod';



const Page_1 = () => {

  const approvalData = useApi();
  console.log('from page1',approvalData)
     
  return (
    // <div className='h-auto w-auto border border-black flex flex-row mt-4'>
      <>
        <div className='travel + ca flex flex-col flex-grow'>
        <div className='travel request  border border-black '>
          <div className='flex flex-inline justify-between'>
        <div className='py-4 px-6'>
             <h2 className='text-lg font-cabin font-semibold text-gray-800 tracking-[0.03em] leading-normal'>Travel Request Details</h2>
        </div>
        <div className='py-4 px-6 flex flex-inline gap-2'>
          {/* <div> */}
          {/* <h2 className='text-lg font-cabin font-semibold text-gray-800 tracking-[0.03em] leading-normal'>approve</h2> */}
          <ActionButton text={'approve'}/>
          {/* </div> */}
          {/* <div> */}
          <ActionButton text={'deny'}/>
          {/* <h2 className='text-lg font-cabin font-semibold text-gray-800 tracking-[0.03em] leading-normal'>reject</h2> */}
          {/* </div> */}
             
        </div>
        </div>


        <div className='flex flex-row justify-between'>
          <div>travel allocaton header </div>
          <div>preference</div>
        </div>
        <div className='travel details mentioned border border-black'>
          
{approvalData.map((approvalDetails,index)=><React.Fragment key={index}>

<div className='MOT details flex flex-col py-3 px-2 border-b-[2px] border-dashed border-purple-500'>
<details open>
  <summary className=''>
  <div className='py-2 px-2 inline-flex items-center justify-start gap-2'> 
    <img src={airplane} alt="calendar" width={16} height={16} />                  
  <h2 className='text-basefont-cabin font-semibold text-gray-800 tracking-[0.03em] leading-normal'>Flight Details :</h2>
  </div>
  
  </summary >
  <div> 
    <Mod approvalDetails={approvalDetails}/>
  </div>
  
  </details>
         
        
 


            <details open>
                   <summary>
                   <div className='inline-flex py-2 px-2'>
                   <h2 className=' gap-2 text-basefont-cabin font-semibold text-gray-800 tracking-[0.03em] leading-normal'>Hotel Details :</h2>
                  </div>
                   </summary>
                   
                   <div><Itinerary /></div> 
                  
               </details>
               <details open>
                   <summary>
                   <div className='inline-flex py-2 px-2'>
                   <h2 className=' gap-2 text-basefont-cabin font-semibold text-gray-800 tracking-[0.03em] leading-normal'>Cab Details :</h2>
                  </div>
                   </summary>
                   
                   <div><Itinerary /></div> 
                  
               </details>



 
  </div>
                 {/* //cab details */}
                


                
                
                
    
</React.Fragment>)}
       

        <div>

        </div>



        </div>

        </div>
        <div className='cash advance  border border-black mt-4 py-2 px-2'>
        <CashAdvanceDetails />
        {/* <Itinerary/> */}
        </div>
        </div>

        {/* <div className='side violation h-auto min-w-[300px] border border-black sr-only lg:not-sr-only'>
         violation notification
        </div> */}

     
      
    {/* </div> */}
    </> 
   

  )
}

export default Page_1








