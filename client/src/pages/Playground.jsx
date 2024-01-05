import UploadAdditionalHeaders from "./expenseAllocations/UploadAdditionalHeaders";
import { useParams } from "react-router-dom";
import { useState } from "react";
export default function(){
    const {tenantId} = useParams()
    const [showAddHeaderModal, setShowAddHeaderModal] = useState(true)

    return(
        <UploadAdditionalHeaders    
            tenantId={tenantId} 
            showAddHeaderModal={showAddHeaderModal} 
            setShowAddHeaderModal={setShowAddHeaderModal}/>
    )
}