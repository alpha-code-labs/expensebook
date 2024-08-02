import React from 'react';
import Button from './Button';
// import { LOGIN_PAGE_URL, logoutApi } from '../../utils/api';
import { handleLoginPageUrl } from '../../utils/actionHandler';
import { alert_circle, arrow1_icon, cancel_round, company_icon, hamburger_icon, logout_icon, user_icon } from '../../assets/icon';
import { Link } from 'react-router-dom';

const Navbar = ({setSidebarOpen, employeeRole,employeeInfo }) => {


const LOGIN_PAGE_URL = import.meta.env.VITE_LOGIN_PAGE_URL
  console.log('employee info from navbar',employeeInfo)
console.log("local storage navbar", localStorage  )

  const authToken = "helloworld whel" 
  
  let tenantId = localStorage.tenantId
  let empId = localStorage.empId
  return (
    <div className="h-[56px] p-4 flex flex-row justify-between items-center bg-indigo-600">

      <div className="flex flex-row items-center space-x-2 ">
      <div onClick={()=>setSidebarOpen(false)} className='md:hidden block hover:bg-indigo-100 rounded-full p-2'>
            <img src={hamburger_icon} className='w-4 h-4'/>
      </div>
        <div className=' bg-white-100 p-1 rounded-md shadow-md shadow-black'>
        <img src={company_icon} className='w-8 h-8' />
        </div>
      
        <div className="hidden lg:block text-lg font-medium text-indigo-50 capitalize ">{employeeInfo?.tenantName
}</div>
        
      </div>

      <div className=" justify-center items-center cursor-pointer flex flex-row gap-2">
        <div className='bg-white-100 rounded-full'>
        <Link to={`/${tenantId}/${empId}/profile`}>
          <img src={user_icon} className='w-8 h-8'/>
        </Link>
        </div>
      
      <div className="font-semibold  ">
        <p className=' text-sm text-white-100'>{employeeInfo?.employeeDetails?.name}</p>
        <p className=' text-xs text-indigo-100'>{employeeInfo?.email}</p>
      </div>
      <div className='bg-white-100 p-2 shadow-sm shadow-neutral-600 rounded-md' onClick={() => {window.location.href = `${LOGIN_PAGE_URL}`,localStorage.removeItem("empId"),localStorage.removeItem("tenantId",localStorage.removeItem('pageNo'))}}>
        <img src={logout_icon} className='w-5 h-5'/>
      </div>


        {/* <Button text='Logout' onClick={()=>(handleLoginPageUrl('login-page'))}/> */}
        {/* <Button text='Logout' onClick={()=>(logoutApi(authToken))}/> */}

      </div>
    </div>
  );
}

export default Navbar;

