import PoliciesPageComponents from "./PoliciesPageComponents"
import { useParams } from "react-router-dom"

export default function (props) {
    const ruleEngineState = props.ruleEngineState
    const setRuleEngineState = props.setRuleEngineState
    const {tenantId} = props.tenantId

  return(
    <PoliciesPageComponents 
        tenantId = {tenantId}
        ruleEngineState={ruleEngineState}
        setRuleEngineState={setRuleEngineState}
        travelType='international' />
  )  
}