import PoliciesPageComponents from "./PoliciesPageComponents"
import { useParams } from "react-router-dom"

export default function ({ruleEngineState, setRuleEngineState, currencySymbol, progress, setProgress}) {
    const {tenantId} = useParams()
    
    return(
      <PoliciesPageComponents 
          progress={progress}
          setProgress={setProgress}
          tenantId = {tenantId}
          currencySymbol={currencySymbol}
          ruleEngineState={ruleEngineState}
          setRuleEngineState={setRuleEngineState}
          travelType='domestic' />
    )  
}