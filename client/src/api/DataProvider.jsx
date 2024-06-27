import { createContext, useContext, useState } from "react"
const DataContext = createContext()

export const DataProvider = ({children}) =>{
    const [employeeData, setEmployeeData] = useState(null)
    const [financeData, setFinanceData] = useState(null)
    const [routeData, setRouteData] = useState(null)

    return(
        <DataContext.Provider
        value={{
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

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () =>{
    return useContext(DataContext)
}



