import PoliciesPageComponents from "./PoliciesPageComponents"
import { useParams } from "react-router-dom"

export default function ({ruleEngineState, setRuleEngineState, currencySymbol}) {
    const {tenantId} = useParams()

  return(
    <PoliciesPageComponents 
        currencySymbol={currencySymbol}
        tenantId = {tenantId}
        ruleEngineState={ruleEngineState}
        setRuleEngineState={setRuleEngineState}
        travelType='international' />
  )  
}