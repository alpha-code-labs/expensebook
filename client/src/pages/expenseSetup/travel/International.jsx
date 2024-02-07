import { useNavigate, useParams } from "react-router-dom"
import AllocationPageComponent from "./AllocationPageComponent"

export default function(){

    const {tenantId} = useParams()

    return(<>
        <AllocationPageComponent tenantId={tenantId} travelType={'international'} />
    </>)
}