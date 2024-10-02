
// import { LOGIN_PAGE_URL, logoutApi } from '../../utils/api';
import { useData } from '../../api/DataProvider';
import { arrow_left, chevron_down, company_icon, down_arrow, down_left_arrow, hamburger_icon, logout_icon, search_icon, user_icon } from '../../assets/icon';
import { NavLink,useLocation ,useNavigate} from 'react-router-dom';
import Input from './SearchInput';
import IconOption from './IconOption';
import { urlRedirection } from '../../utils/handyFunctions';

const Navbar = ({setSearchQuery,setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate()
  const pathname = location?.pathname?.split('/').pop()
  const {employeeRoles  } = useData(); 
  const employeeInfo = employeeRoles?.employeeInfo
const LOGIN_PAGE_URL = import.meta.env.VITE_LOGIN_PAGE_URL
  console.log('employee info from navbar',employeeInfo)

  function getFirstLetter(fullName) {
    if (!fullName) return '';
    return fullName.trim().charAt(0);  // Trim any spaces and take the first letter
}
function clearCookie(name) {
  document.cookie = name + '=; Max-Age=0; path=/'; // Set the cookie's max-age to 0 to delete it
}
  
 
  return (
    <div className=" h-[48px] border-b p-2 w-full flex flex-row justify-between items-center bg-slate-50   border-slate-200">

      <div className="flex w-full flex-row items-center justify-between ">
      <div onClick={()=>setSidebarOpen(false)} className='md:hidden block hover:bg-indigo-100 rounded-full p-2'>
            <img src={hamburger_icon} className='w-4 h-4'/>
      </div>
        
        { ["cash-advance","trip","expense","approval","bookings"].includes(pathname)&&
         <div className='w-full flex  items-center justify-center px-8'>
         <Input placeholder={`Search ${pathname}...`} type="search" icon={search_icon} onChange={(value)=>setSearchQuery(value)}/>
       </div>}
  
      
      
        
      </div>


      <div className=" px-2 shrink-0 justify-center items-center cursor-pointer flex flex-row gap-2">
      <IconOption
      buttonText={
        <div className='flex items-center justify-center h-[38px] '>
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
        {/* <div className=' flex gap-1 rounded-sm p-1'>
        <NavLink to={`profile`}>
          <img src={user_icon} className='w-8 h-8'/>
        </NavLink>
        <div className=" font-inter ">
        <p className=' text-xs font-medium text-neutral-700'>{employeeInfo?.employeeDetails?.name}</p>
        <p className=' text-xs text-neutral-500'>{employeeInfo?.email}</p>
      </div>
      
        </div> */}
      
    


   

      </div>
    </div>
  );
}

export default Navbar;

