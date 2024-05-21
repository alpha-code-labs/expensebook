import { useNavigate, useParams } from "react-router-dom"
import AllocationPageComponent from "./AllocationPageComponent"

export default function({allocations, setAllocations, orgHeaders, setOrgHeaders}){

    const {tenantId} = useParams()

    return(<>
        <AllocationPageComponent allocations={allocations} setAllocations={setAllocations} orgHeaders={orgHeaders} setOrgHeaders={setOrgHeaders} tenantId={tenantId} travelType={'international'} />
    </>)
}