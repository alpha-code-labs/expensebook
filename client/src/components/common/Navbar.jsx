import React from 'react'

const Navbar = () => {
  return (
//     <div className='h-[56px] flex flex-row justify-between'>
//     <div className='flex flex-row'>
//         <div>
//         Logo
//     </div>
//     <div>Company Name</div>
//     <div>Employee</div></div>
    
//     <div>Profile</div>

//   </div>
     <div className="lg:h-[56px]  p-4 flex flex-row justify-between items-center bg-purple-50">
  
  <div className="flex flex-row items-center space-x-2">
    <div className="text-xl font-bold">Logo</div>
    <div className="hidden lg:block">Company Name</div>
    <div className="">Employee</div>
  </div>

  
  <div className="text-lg">
    Profile
  </div>
</div>
   
  )
}

export default Navbar
