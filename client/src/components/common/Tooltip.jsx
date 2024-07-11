// Tooltip.js
import React, { useState } from 'react';

const Tooltip = ({ children, tooltipText }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="font-cabin absolute -right-16 z-50 px-2 py-1 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm transition-opacity duration-300 opacity-100 dark:bg-gray-700">
          {tooltipText}
          {/* <div className="absolute w-2 h-2 bg-gray-900 dark:bg-gray-700" style={{ transform: 'rotate(45deg)', bottom: '-0.5rem', left: '50%', marginLeft: '-0.5rem' }}></div> */}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
