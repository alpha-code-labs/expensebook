import { useNavigate, useParams, useLocation, Route, Routes} from "react-router-dom"
import { useState, useEffect } from "react"
import back_icon from "../../../assets/arrow-left.svg"
import Error from "../../../components/common/Error"
import { getTenantTravelAllocations_API, getTenantOrgHeaders_API } from "../../../utils/api"
import Level3Home from "./Level3Home"
import International from "./International"
import Domestic from "./Domestic"
import Local from "./Local"

export default function ({progress, setProgress}){
    const {tenantId} = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const [networkStates, setNetworkStates] = useState({isLoading: false, isUploading: false, loadingErrMsg:null})


    const [allocations, setAllocations] = useState({});
    const [orgHeaders, setOrgHeaders] = useState({})

    useEffect(()=>{
        console.log(allocations, 'allocations level3')
    }, [allocations])


    useEffect(()=>{
        (async function(){
            setNetworkStates(pre=>({...pre, isLoading:true}))
            const res = await getTenantOrgHeaders_API({tenantId})
            const t_res = await getTenantTravelAllocations_API({tenantId})
            
            if(res.err || t_res.err){
                console.log(res.err)
                const errorMsg = res.err
                setNetworkStates(pre=>({...pre, loadingErrMsg:errorMsg??t_res.err}))
                //handle error
            }
            else{
                console.log(res.data, '...res.data')
                let orgHeadersData = res.data.orgHeaders
                let tmpOrgHeaders = []
                Object.keys(orgHeadersData).forEach(key => {
                    if(orgHeadersData[key].length !== 0){
                        tmpOrgHeaders.push({headerName:key, headerValues: orgHeadersData[key]})
                    }
                })
        
                console.log(tmpOrgHeaders, '...tmpOrgHeaders')
                setOrgHeaders(tmpOrgHeaders)

                if(Object.keys(t_res.data.travelAllocations).length == 0)
                    setAllocations(travel_allocations)
                else setAllocations(t_res.data.travelAllocations)
                
                setNetworkStates(pre=>({...pre, isLoading:false}))
            }

        })()
    },[])


    return(<>
        {networkStates.isLoading && <Error message={networkStates.loadingErrMsg} />}
        {!networkStates.isLoading && 
        <Routes>
            <Route path="/" element={<Level3Home progress={progress} setProgress={setProgress} />} />
            <Route path="/international" element={<International orgHeaders={orgHeaders} setOrgHeaders={setOrgHeaders} allocations={allocations} setAllocations={setAllocations} progress={progress} setProgress={setProgress} />} />
            <Route path="/domestic" element={<Domestic orgHeaders={orgHeaders} setOrgHeaders={setOrgHeaders} allocations={allocations} setAllocations={setAllocations} progress={progress} setProgress={setProgress} />} />
            <Route path="/local" element={<Local orgHeaders={orgHeaders} setOrgHeaders={setOrgHeaders} allocations={allocations} setAllocations={setAllocations} progress={progress} setProgress={setProgress} />} />
        </Routes>}
        </>)
}
