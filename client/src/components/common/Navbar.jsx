
// import { LOGIN_PAGE_URL, logoutApi } from '../../utils/api';
import { useData } from '../../api/DataProvider';
import { company_icon, hamburger_icon, logout_icon, user_icon } from '../../assets/icon';
import { NavLink } from 'react-router-dom';

const Navbar = ({setSidebarOpen }) => {

  const {employeeRoles  } = useData(); 
  const employeeInfo = employeeRoles?.employeeInfo
const LOGIN_PAGE_URL = import.meta.env.VITE_LOGIN_PAGE_URL
  console.log('employee info from navbar',employeeInfo)


  
 
  return (
    <div className=" h-[48px] p-2 flex flex-row justify-between items-center bg-indigo-600">

      <div className="flex flex-row items-center ">
      <div onClick={()=>setSidebarOpen(false)} className='md:hidden block hover:bg-indigo-100 rounded-full p-2'>
            <img src={hamburger_icon} className='w-4 h-4'/>
      </div>
        <div className='flex gap-1 items-center justify-center bg-slate-100  p-2  rounded-sm shadow-md'>
        <img src={company_icon} className='w-5 h-5' />
        <p className="hidden lg:block font-inter  text-medium font-medium text-neutral-700  capitalize ">{employeeInfo?.tenantName}</p>
        </div>
      
      
        
      </div>

      <div className=" justify-center items-center cursor-pointer flex flex-row gap-2">
        <div className='bg-slate-100  flex gap-1 rounded-sm p-1'>
        <NavLink to={`profile`}>
          <img src={user_icon} className='w-8 h-8'/>
        </NavLink>
        <div className="font-inter  ">
        <p className=' text-xs font-medium text-neutral-700'>{employeeInfo?.employeeDetails?.name}</p>
        <p className=' text-xs text-neutral-500'>{employeeInfo?.email}</p>
      </div>
        </div>
      
      
      <div className='bg-slate-100 p-2 hover:shadow-sm hover:shadow-gray-500 rounded-sm' onClick={() => {window.location.href = `${LOGIN_PAGE_URL}`,localStorage.removeItem("empId"),localStorage.removeItem("tenantId",localStorage.removeItem('pageNo'))}}>
        <img src={logout_icon} className='w-5 h-5'/>
      </div>


        {/* <Button text='Logout' onClick={()=>(handleLoginPageUrl('login-page'))}/> */}
        {/* <Button text='Logout' onClick={()=>(logoutApi(authToken))}/> */}

      </div>
    </div>
  );
}

export default Navbar;

