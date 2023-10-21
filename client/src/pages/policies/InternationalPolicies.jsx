import PoliciesPageComponents from "./PoliciesPageComponents"

export default function (props) {
    const ruleEngineState = props.ruleEngineState
    const setRuleEngineState = props.setRuleEngineState
    
  return(
    <PoliciesPageComponents 
        ruleEngineState={ruleEngineState}
        setRuleEngineState={setRuleEngineState}
        travelType='international' />
  )  
}