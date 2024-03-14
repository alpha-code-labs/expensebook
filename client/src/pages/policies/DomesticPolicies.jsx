import PoliciesPageComponents from "./PoliciesPageComponents"
import { useParams } from "react-router-dom"

export default function ({ruleEngineState, setRuleEngineState, currencySymbol}) {
    const {tenantId} = useParams()
    
    return(
      <PoliciesPageComponents 
          tenantId = {tenantId}
          currencySymbol={currencySymbol}
          ruleEngineState={ruleEngineState}
          setRuleEngineState={setRuleEngineState}
          travelType='domestic' />
    )  
}