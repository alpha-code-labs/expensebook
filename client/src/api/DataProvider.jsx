import React, { createContext, useContext, useState } from 'react';
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [employeeData, setEmployeeData] = useState(null);
  const [managerData, setManagerData] = useState(null);
  const [travelAdminData, setTravelAdminData] = useState(null);
  const [employeeRoles , setEmployeeRoles]=useState(null);
  const [routeData, setRouteData] = useState(null);
  const [requiredData, setRequiredData] = useState({});

  return (
    <DataContext.Provider
      value={{
        employeeData,
        setEmployeeData,
        managerData,
        setManagerData,
        travelAdminData,
        setTravelAdminData,
        employeeRoles,
        setEmployeeRoles,
        routeData,
        setRouteData,
        requiredData,
        setRequiredData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};

