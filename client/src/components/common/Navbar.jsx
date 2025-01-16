
// import { LOGIN_PAGE_URL, logoutApi } from '../../utils/api';
import { useData } from '../../api/DataProvider';
import { arrow_left, chevron_down,bell_icon, company_icon, down_arrow, down_left_arrow, hamburger_icon, logout_icon, search_icon, user_icon, violation_icon, alert_bell_icon, info_bell_icon, warning_bell_icon, cancel, cancel_black_icon } from '../../assets/icon';
import { NavLink,useLocation ,useNavigate} from 'react-router-dom';
import Input from './SearchInput';
import IconOption from './IconOption';
import { formatDate, formatDateAndTime, urlRedirection } from '../../utils/handyFunctions';
import { TripName } from './TinyComponent';
import { warning } from 'framer-motion';
import NotificationBox from './NotificationBox';
import { updateNotificationReadFlagApi } from '../../utils/api';
import { useEffect, useState } from 'react';

const Navbar = ({setSearchQuery,setSidebarOpen,tenantId,empId }) => {

  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location?.pathname?.split('/').pop();
  const {employeeRoles, requiredData  } = useData(); 
  const employeeInfo = employeeRoles?.employeeInfo;

const LOGIN_PAGE_URL = import.meta.env.VITE_LOGIN_PAGE_URL
const notificationData = [
  ...(requiredData?.notifications?.employee ?? []),
  ...(requiredData?.notifications?.employeeManager ?? []),
  ...(requiredData?.notifications?.businessAdmin ?? []),
  ...(requiredData?.notifications?.finance ?? []),
]



const [notificationArray, setNotificationArray]=useState([])
useEffect(() => {
  setNotificationArray(notificationData);
  //setNotificationArray(notificationData)
}, [requiredData]);
console.log("notification data", notificationArray ,notificationData.some(notification => notification.isRead))



function alertIcon(sign) {
  switch(sign) {
    case 'urgent':
      return (
        <div className='p-1 ring-1 ring-white rounded-full shrink-0 bg-red-600'>
          <img src={alert_bell_icon} className='w-3 h-3 ' alt="Urgent Icon" />
        </div>
      );
    case 'information':
      return (
        <div className='p-1 ring-1 ring-white rounded-full shrink-0 bg-neutral-900 rotate-180'>
          <img src={info_bell_icon} className='w-3 h-3 ' alt="Urgent Icon" />
        </div>
      );
    case 'action':
      return (
        <div className='p-1 ring-1 ring-white rounded-full shrink-0 bg-yellow-200 '>
        <img src={warning_bell_icon} className='w-3 h-3 ' alt="Urgent Icon" />
      </div>
      );
    default:
      return null; // Handle unexpected values
  }
}



  function getFirstLetter(fullName) {
    if (!fullName) return '';
    return fullName.trim().charAt(0);  // Trim any spaces and take the first letter
}
function clearCookie(name) {
  document.cookie = name + '=; Max-Age=0; path=/'; // Set the cookie's max-age to 0 to delete it
}

  const currentDate = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(currentDate.getDate() + 3);

  // Filter trips to only include those that start within the next 3 days
  // const tripThreeDays = notificationData.filter(trip => {
  //   const tripStartDate = new Date(trip.tripStartDate);
  //   return tripStartDate >= currentDate && tripStartDate <= threeDaysLater;
  // }).map(trip => {
  //   const tripStartDate = new Date(trip.tripStartDate);
  //   const timeDiff = tripStartDate - currentDate;
  //   const daysCount = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  //   const daysLeft = `${daysCount} ${daysCount>1 ? 'days': 'day'}`
    

  //   return {
  //     ...trip,
  //     daysLeft 
  //   };
  // });
  

  
 
 const handleIsReadNotification = async (payload) => {
  console.log("notification payload", payload);
  try {
    const params = { tenantId, empId };
    const response = await updateNotificationReadFlagApi({ params, payload });
    
    if (response?.success) {
      const messageIdToRemove = payload?.messageId;
      const updatedArray = notificationArray.filter(
        (item) => item.messageId !== messageIdToRemove
      );
      setNotificationArray(updatedArray);  // Update the state with the new array
    }

    console.log("response for notification", response);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    
  }
};

const handleFilterNotification = (value)=>{
 
  if(value === "unread")
  {
    const updatedArray = notificationArray.filter(
      (item) => item.isRead == false
    );
    setNotificationArray(updatedArray)
  }
  if (value === "all")
  {
    setNotificationArray(notificationData);
  }

}

  return (
    <div className=" h-[48px] border-b p-2 w-full flex flex-row justify-between items-center bg-slate-50   border-slate-200">

      <div className="flex w-full flex-row items-center justify-between ">
      <div onClick={()=>setSidebarOpen(false)} className='md:hidden rounded-md block hover:bg-indigo-100 p-2 border border-slate-300 shrink-0 '>
            <img src={hamburger_icon} className='shrink-0 w-4 h-4'/> 
      </div>
        
        { ["cash-advance","trip","expense","approval","bookings"].includes(pathname)&&
         <div className='w-full flex  items-center justify-center px-8'>
         <Input placeholder={`Search ${pathname}...`} type="search" icon={search_icon} onChange={(value)=>setSearchQuery(value)}/>
       </div>}
      </div>

      <div className=" px-2 shrink-0 justify-center items-center cursor-pointer flex flex-row gap-2">
        <NotificationBox
        disable={notificationData.length > 0 ? false: true}
        buttonText={
          <div className="p-1 relative ">
     <span 
  className={`${(notificationData.length > 0 && notificationData.some(notification => !notification.isRead)) 
    ? 'block' 
    : 'hidden'} 
    absolute flex h-2 w-2 right-1`}
>
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
</span>

<img src={bell_icon} className="w-6 h-6"/>
            
            </div>
        }>
<div className=' flex flex-col justify-start  gap-2 p-2 px-3 border border-slate-300 h-full rounded-md w-full '>
<select
          
          onChange={(e) => handleFilterNotification(e.target.value)}
          className="p-3 border rounded-lg text-gray-700 bg-slate-50 focus:outline-none hover:bg-gray-100"
        >
          <option value="all">All</option>
          <option value="unread">Unread</option>
        </select>
  <div className='space-y-1 overflow-x-auto p-2'>
{notificationArray?.map((ele)=>(
  < >
   <div  key={ele.name + "navbar"}  className={`w-full h-fit ${ele.status === 'urgent' ? ' bg-gradient-to-t from-red-50/50 to-white  ' : ele.status ==='action' ? ' bg-gradient-to-t to-yellow-50/50 from-white  ': 'bg-gradient-to-t from-white to-indigo-50/50  '} bg-none flex w-[300px] gap-2 py-2  items-start  text-neutral-900  bg-gray-200/10 rounded-md hover:border-none p-2 cursor-pointer `}>
           
              {alertIcon(ele?.status)}
            <div className='space-y-2  '>
              <p className='font-inter text-xs text-neutral-900 '>{ele?.message}</p>
              <p className='text-xs font-cabin text-neutral-700'>{formatDateAndTime(ele?.createdAt)}</p>
              </div>
              <div className='p-1 ring-1 ring-white bg-slate-100 h-6 w-6 shrink-0 flex items-center justify-center'>
              <img onClick={()=>handleIsReadNotification({
                ...(ele?.messageId && { messageId: ele.messageId }),
                ...(ele?.travelRequestId && { travelRequestId: ele.travelRequestId }),
                ...(ele?.expenseHeaderId && { expenseHeaderId: ele.expenseHeaderId }),
              })} src={cancel_black_icon}
              className='w-3 h-3 shrink-0 '/> 
              </div>
          
            </div>
   
  
  </> 
          ))
         
        }
        </div>
          </div>

        </NotificationBox>


      <IconOption
      buttonText={
        <div className=' flex items-center justify-center h-[38px] '>
        {/* <NavLink to={`profile`}> */}
        <div className='bg-purple-500 p-2 rounded-full shrink-0 grow-0 flex items-center justify-center w-8 h-8'>
            <p className='text-white text-center text-xl'>{getFirstLetter(employeeInfo?.employeeDetails?.name)}</p>
        </div>
        {/* </NavLink> */}
        <div className="font-inter ml-2"> {/* Add margin for spacing */}
            <p className='text-xs font-medium text-neutral-700'>{employeeInfo?.employeeDetails?.name}</p>
            <p className='text-xs text-neutral-500'>{employeeInfo?.email}</p>
        </div>
        <img src={chevron_down} className='ml-2  w-5 h-5'/>
    </div>
      }
      >
        {
          [{name:'Profie',icon:user_icon, action: () => { navigate('profile'); console.log('Navigating to profile'); }}, {name:'Logout',icon:logout_icon, action: ()=>{urlRedirection(LOGIN_PAGE_URL),clearCookie('authToken')} }].map((ele)=>(
            <div onClick={ele.action} key={ele.name}  className='flex items-center gap-2 px-2 py-2 hover:bg-gray-200/10 rounded-md cursor-pointer'>
              <img src={ele.icon} className='w-4 h-4'/>
              <p className='font-inter text-neutral-900 text-sm '>{ele.name}</p>
            </div>
          ))
        }
       

      </IconOption>
      
        
      </div>
    </div>
  );
}

export default Navbar;

