import React from "react";

// Define a button component with props for label, onClick, and color
const Button = ({ label, onClick, color }) => {
  // Define the responsive classes for different screen sizes
  const responsiveClasses = "lg:w-1/4 md:w-1/3 sm:w-1/2 w-full";
  
  // Define the Tailwind CSS classes for button styling based on color prop
  const buttonClasses = `px-4 py-2 rounded-md text-white ${
    color === "darkseagreen" ? "bg-darkseagreen" : "bg-lightcoral"
  } ${responsiveClasses}`;

  return (
    <button className={buttonClasses} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;



































// import React from 'react';
// const Button = ({ label, onClick, color }) => {
//   return (
//     <button
//       className={`cursor-pointer [border:none] py-4 px-8 bg-${color} rounded-13xl w-[194px] h-12 flex flex-row items-center justify-center box-border`}
//       autoFocus={true}
//       onClick={onClick}
//     >
//       <div className="relative text-base font-medium font-cabin text-white text-center">
//         {label}
//       </div>
//     </button>
//   );
// };
// export default Button;
