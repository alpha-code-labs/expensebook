import { useParams } from "react-router-dom";
import Template from "./Template";


export default function (){
    const {tenantId} = useParams()

    return(<>
        <Template type='travel' next={`/${tenantId}/expense-allocations/travel-related`} tenantId={tenantId} />
    </>)
}