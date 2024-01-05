import { useParams } from "react-router-dom";
import Template from "./Template";


export default function (){
    const {tenantId} = useParams()

    return(<>
        <Template type='travel related' next={`/${tenantId}/expense-allocations/travel-categories-related`} tenantId={tenantId} />
    </>)
}