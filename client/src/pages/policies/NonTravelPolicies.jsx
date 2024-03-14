import PoliciesPageComponents from "./PoliciesPageComponents"
import { useParams } from "react-router-dom"
import NonTravelPoliciesPageComponent from "./NonTravelPoliciesPageComponent"
import { useEffect } from "react"

export default function (props) {
    const ruleEngineState = props.ruleEngineState
    const setRuleEngineState = props.setRuleEngineState
    const {tenantId} = useParams()

    useEffect(()=>{
      
    },[])

  return(
    <PoliciesPageComponents 
        tenantId = {tenantId}
        ruleEngineState={ruleEngineState}
        setRuleEngineState={setRuleEngineState}
        travelType='nonTravel' />
  )  
}