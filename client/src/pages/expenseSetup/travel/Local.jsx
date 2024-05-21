import { useNavigate, useParams } from "react-router-dom"
import AllocationPageComponent from "./AllocationPageComponent"

export default function({allocations, setAllocations, orgHeaders, setOrgHeaders}){

    const {tenantId} = useParams()

    return(<>
        <AllocationPageComponent orgHeaders={orgHeaders} setOrgHeaders={setOrgHeaders} allocations={allocations} setAllocations={setAllocations} tenantId={tenantId} travelType={'local'} />
    </>)
}