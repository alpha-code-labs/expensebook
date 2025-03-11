import React, { createContext, useContext, useState,useEffect } from 'react';
const DataContext = createContext();

export const DataProvider = ({ children }) => {

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const initialPopupData = {
    showPopup:false,
    message:null,
    iconCode:""
  };
  const [employeeData, setEmployeeData] = useState(null);
  const [managerData, setManagerData] = useState(null);
  const [travelAdminData, setTravelAdminData] = useState(null);
  const [employeeRoles , setEmployeeRoles]=useState(null);
  const [routeData, setRouteData] = useState(null);
  const [requiredData, setRequiredData] = useState({});
  const [microserviceModal, setMicroserviceModal]=useState(initialPopupData);

  const [popupMsgData, setPopupMsgData] = useState(initialPopupData);
  

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
        setRequiredData,
        popupMsgData,
        setPopupMsgData,
        initialPopupData,
        isOnline,
        microserviceModal,
        setMicroserviceModal
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};

