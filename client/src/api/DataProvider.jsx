import { createContext, useContext, useState } from "react"
const DataContext = createContext()

export const DataProvider = ({children}) =>{
    const [employeeRoles, setEmployeeRoles] = useState(null)
    const [employeeData, setEmployeeData] = useState(null)
    const [managerRole, setManagerRole] = useState(null)
    const [travelAdminData, setTravelAdminData] = useState(null);
    const [financeData, setFinanceData] = useState(null)
    const [routeData, setRouteData] = useState(null)

    return(
        <DataContext.Provider
        value={{
            employeeRoles, 
            setEmployeeRoles,
            managerRole,
            setManagerRole,
            travelAdminData,
            setTravelAdminData,
            employeeData,
            financeData,
            routeData,
            setEmployeeData,
            setFinanceData,
            setRouteData
        }}
        >
            {children}
        </DataContext.Provider>
    )
}

export const useData = () =>{
    return useContext(DataContext)
}



