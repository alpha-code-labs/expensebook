import React from 'react';
import Button from './Button';
import { logoutApi } from '../../utils/api';
import { handleLoginPageUrl } from '../../utils/actionHandler';
import { alert_circle, company_icon, logout_icon } from '../../assets/icon';

const Navbar = ({ employeeRole,employeeInfo }) => {
  // Assuming `employeeRole` is an object with relevant details
  const { employeeDetails, companyDetails } = employeeRole;
  console.log('employee info11',employeeInfo)

  const authToken = "helloworld whel" 
  
  
  
  return (
    <div className="lg:h-[56px] p-4 flex flex-row justify-between items-center bg-indigo-600">

      <div className="flex flex-row items-center space-x-2">
        <div className=' bg-white-100 p-1 rounded-md shadow-md shadow-black'>
        <img src={company_icon} className='w-8 h-8' />
        </div>
      
        <div className="hidden lg:block text-lg font-medium text-indigo-50 capitalize ">{employeeInfo?.tenantName
}</div>
        
      </div>

      <div className=" justify-center items-center cursor-pointer flex flex-row gap-4">
      <div className="font-semibold  ">
        <p className=' text-sm text-white-100'>{employeeInfo?.employeeDetails?.name}</p>
        <p className=' text-xs text-indigo-100'>{employeeInfo?.email}</p>
      </div>
      <div className='bg-white-100 p-2 shadow-sm shadow-neutral-600 rounded-md' onClick={() => window.location.href = 'http://192.168.1.10:5176/user-login'}>
        <img src={logout_icon} className='w-5 h-5'/>
      </div>

     
        {/* <Button text='Logout' onClick={()=>(handleLoginPageUrl('login-page'))}/> */}
        {/* <Button text='Logout' onClick={()=>(logoutApi(authToken))}/> */}

      </div>
    </div>
  );
}

export default Navbar;

