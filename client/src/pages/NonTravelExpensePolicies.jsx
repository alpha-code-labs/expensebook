import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import axios from 'axios'
import Home from "./policies/PoliciesHome";
import InternationalPolicies from "./policies/InternationalPolicies";
import DomesticPolicies from "./policies/DomesticPolicies";
import { rule } from "postcss";
import LocalPolicies from "./policies/LocalPolicies";
import NonTravelPolicies from "./policies/NonTravelPolicies";
import Icon from "../components/common/Icon";
import { useLocation, useParams } from "react-router-dom";
import HollowButton from "../components/common/HollowButton";
import NonTravelPoliciesPageComponent from "./policies/NonTravelPoliciesPageComponent";

export default function (props){
  
  const {state} = useLocation();
  const {tenantId} = useParams()
  console.log(tenantId)

  //flags
  const [flags, setFlags] = useState({})   
  const [groups, setGroups] = useState(null)
  const [ruleEngineState, setRuleEngineState] = useState()
  const [groupsNotFound, setGroupsNotFound] = useState(false)


  const [ruleEngineData, setRuleEngineData] = useState()

  useEffect(() => {
    (async function () {
      try {
        //get travel expense categories..., travel allocation flags... and groups

        //const groups_data_response = await axios.get(`http://localhost:8001/api/tenant/${tenantId}/groups`);

        const policies_data_response = await axios.get(`http://localhost:8001/api/tenant/${tenantId}/policies/non-travel`);
        if(!policies_data_response.err){
          const rls = Object.keys(policies_data_response?.data?.policies??{}).map(key=>(policies_data_response.data.policies[key]))
          console.log(rls)
          setRuleEngineState(rls)
          return;
        }        

        // const groups = groups_data_response.data.groups
        // const policies = policies_data_response.data.policies
        // console.log(policies, 'policies')

        // if(!Array.isArray(policies)){
        //   //no policies has been setup yet
        //   if (groups.length > 0) {
        //     setGroups(groups.map(group => group.groupName));
        //     setRuleEngineState(groups.map(group => ({ [group.groupName]: convertToObject(ruleEngineData) })))
        //     setGroupsNotFound(false)
        //   } else {
        //     setGroupsNotFound(true);
        //   }
        // }

        // else{
        //   //policy setup was done previously..
        //   //there are two options...
        //   // 1) remove the existing policies and let him setup again if groups are changed
        //   // 2) check what groups are changed and patch existing policies with that information 


        //   //get group names from policies
        //   const latestGroupNames = groups.map(group => group.groupName)
        //   const existingGroupNames = policies.map(groupPolicies => Object.keys(groupPolicies)).flat()

        //   if(latestGroupNames.toString() === existingGroupNames.toString()){
        //     //group names are same... content may or may not be same but it doesn't matter

        //     //set rule engine state to existing policies
        //     setRuleEngineState(policies)
        //     setGroupsNotFound(false)
        //   }
        //   else{
        //     //groups don't match. Currently going with 1) option
        //     if (groups.length > 0) {
        //       setGroups(groups.map(group => group.groupName));
        //       setRuleEngineState(groups.map(group => ({ [group.groupName]: convertToObject(ruleEngineData) })))
        //       setGroupsNotFound(false)
        //     } else {
        //       setGroupsNotFound(true);
        //     }
        //   }

        // }
        
        // console.log('resolved.. ', groups.length);
      } catch (e) {
        if (e.response) {
          console.error(e.response);
        } else if (e.request) {
          console.error('Internal server error');
        } else {
          console.error('Something went wrong while placing the request', e);
        }
      }
    })();
  }, []);
  
  
  

  useEffect(()=>{
    console.log(ruleEngineState)
  },[ruleEngineState])

  return <>
    <NonTravelPoliciesPageComponent 
        tenantId = {tenantId}
        ruleEngineState={ruleEngineState}
        setRuleEngineState={setRuleEngineState}
        travelType='nonTravel' />
  </>;
}