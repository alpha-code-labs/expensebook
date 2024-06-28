import { useState, useEffect, createContext } from "react";
import axios from 'axios'
import { useLocation, useParams } from "react-router-dom";
import NonTravelPoliciesPageComponent from "../../policies/NonTravelPoliciesPageComponent";
import { expenseCategories } from "../../../data/expenseCategories";
import ReimbursementAllocationsPage from "./ReimbursementAllocationsPage";
import Error from "../../../components/common/Error";

const defaultCategories = expenseCategories

export default function ({progress, setProgress}){
  
  const {state} = useLocation();
  const {tenantId} = useParams()
  console.log(tenantId)

  //flags
  const [flags, setFlags] = useState({})   
  const [groups, setGroups] = useState(null)
  const [ruleEngineState, setRuleEngineState] = useState()
  const [groupsNotFound, setGroupsNotFound] = useState(false)
  const [networkStates, setNetworkStates] = useState({isLoading: true, loadingErrMsg: null});


  const [ruleEngineData, setRuleEngineData] = useState({
      nonTravel:{
        ['Office Supplies']:{
          limit: '',
          fields: [{name:'Description', type:'text'}, 
                    {name:'Quantity', type:'number'}, 
                    {name:'Unit Cost', type:'amount'}, 
                    {name:'Total Cost', type:'amount'} ]
        },

        ['Utilities']:{
          limit: '',
          fields: [{name:'Type of Utility', type:'text'}, 
                    {name:'Total Cost', type:'amount'} ]
        },

        ['Insurance']:{
          limit: '',
          fields: [{name:'Policy Type', type:'text'}, 
                    {name:'Insurance Provider', type:'text'}, 
                    {name:'Premium Amount', type:'amount'},]
        },

        ['Marketing and advertising']:{
          limit: '',
          fields: [{name:'Description', type:'text'}, 
                    {name:'Advertising Channels', type:'text'},  
                    {name:'Cost', type:'amount'} ]
        },

        ['Professional Fees']:{
          limit: '',
          fields: [{name:'Service Providerr', type:'text'}, 
                    {name:'Nature of Service', type:'text'}, 
                    {name:'Total Cost', type:'amount'} ]
        },

        ['Software and License']:{
          limit: '',
          fields: [{name:'Software Name', type:'text'}, 
                    {name:'license Type', type:'text'},  
                    {name:'Total Cost', type:'amount'} ]
        },

        ['Equipment']:{
          limit: '',
          fields: [{name:'Description', type:'text'}, 
                    {name:'Quantity', type:'number'}, 
                    {name:'Unit Cost', type:'amount'}, 
                    {name:'Total Cost', type:'amount'} ]
        },

        ['Repair and Maintainance']:{
          limit: '',
          fields: [{name:'Description', type:'text'}, 
                    {name:'Service Provider', type:'number'}, 
                    {name:'Total Cost', type:'amount'} ]
        },

        ['Legal and Compliance']:{
          limit: '',
          fields: [
                    {name:'Total Cost', type:'amount'} ]
        },

        ['Communication']:{
          limit: '',
          fields: [
                    {name:'Total Cost', type:'amount'} ]
        },

        ['Research and Development']:{
          limit: '',
          fields: [{name:'Description', type:'text'}, 
                    {name:'Total Cost', type:'amount'} ]
        },

        ['Training']:{
          limit: '',
          fields: [{name:'Description', type:'text'}, 
                    {name:'Trainer', type:'text'},  
                    {name:'Total Cost', type:'amount'} ]
        },

        ['Software Subscription']:{
          limit: '',
          fields: [{name:'Software Name', type:'text'}, 
                    {name:'Subscription Type', type:'number'}, 
                    {name:'Total Cost', type:'amount'} ]
        },

        ['Legal Expenses']:{
          limit: '',
          fields: [{name:'Description', type:'text'}, 
                    {name:'Law Firm', type:'text'}, 
                    {name:'Total Cost', type:'amount'} ]
        },

        ['Client Entertainment']:{
          limit: '',
          fields: [
                    {name:'Total Cost', type:'amount'} ]
        },

        ['Client Gift']:{
          limit: '',
          fields: [
                    {name:'Total Cost', type:'amount'} ]
        },
      }
  })

  useEffect(() => {
    (async function () {
      if (!groups) {
        console.log('this ran..');
        if (state != null && state.groups != null && state.groups != []) {
          setGroups(state.groups);
          setRuleEngineState(state.groups.map(group => ({ [group]: convertToObject(ruleEngineData) })));
          setGroupsNotFound(false);
        } else {
          console.log('this ran..');
          try {
            setNetworkStates({isLoading: true, loadingErrMsg: null});
            const groups_data_response = await axios.get(`import.meta.VITE_PROXY_URL/tenant/${tenantId}/groups`);
            const policies_data_response = await axios.get(`import.meta.VITE_PROXY_URL/tenant/${tenantId}/policies/non-travel`);

            if(groups_data_response.err || policies_data_response.err){
              setNetworkStates({isLoading: true, loadingErrMsg: groups_data_response.err??policies_data_response.err??'Something went wrong please try again later' });
              return;
            }

            const groups = groups_data_response.data.groups
            const policies = policies_data_response.data.policies
            console.log(policies, 'policies')

            if(!Array.isArray(policies)){
              //no policies has been setup yet
              if (groups.length > 0) {
                setGroups(groups.map(group => group.groupName));
                setRuleEngineState(groups.map(group => ({ [group.groupName]: convertToObject(ruleEngineData) })))
                setGroupsNotFound(false)
              } else {
                setGroupsNotFound(true);
              }
            }

            else{
              //policy setup was done previously..
              //there are two options...
              // 1) remove the existing policies and let him setup again if groups are changed
              // 2) check what groups are changed and patch existing policies with that information 


              //get group names from policies
              const latestGroupNames = groups.map(group => group.groupName)
              const existingGroupNames = policies.map(groupPolicies => Object.keys(groupPolicies)).flat()

              if(latestGroupNames.toString() === existingGroupNames.toString()){
                //group names are same... content may or may not be same but it doesn't matter

                //set rule engine state to existing policies
                setRuleEngineState(policies)
                setGroupsNotFound(false)
              }
              else{
                //groups don't match. Currently going with 1) option
                if (groups.length > 0) {
                  setGroups(groups.map(group => group.groupName));
                  setRuleEngineState(groups.map(group => ({ [group.groupName]: convertToObject(ruleEngineData) })))
                  setGroupsNotFound(false)
                } else {
                  setGroupsNotFound(true);
                }
              }

            }
            
            console.log('resolved.. ', groups.length);
          } catch (e) {
            if (e.response) {
              console.error(e.response);
            } else if (e.request) {
              console.error('Internal server error');
            } else {
              console.error('Something went wrong while placing the request', e);
            }

            setGroupsNotFound(true);
          }

        }
      }
    })();
  }, []);
  
  function convertToObject(ruleEngineData){
    let obj = {}
    Object.keys(ruleEngineData).forEach((key) => {
      obj[key] = {}

      Object.keys(ruleEngineData[key]).forEach((key2) => {
        obj[key][key2] = {}
        
        if(ruleEngineData[key][key2]['class'] != undefined){
          obj[key][key2]['class'] = {}
          ruleEngineData[key][key2]['class'].forEach((item)=>{
            obj[key][key2]['class'][item] = {allowed: false, violationMessage:'policy violation'}
          })
        }

        if(ruleEngineData[key][key2]['limit']!=undefined){
          obj[key][key2]['limit'] = {amount:'', currency:'', violationMessage:'policy violation'}
        }

        if(ruleEngineData[key][key2]['dayLimit']!=undefined){
          obj[key][key2]['dayLimit'] = {days:'', violationMessage:'policy violation'}
        }

        if(ruleEngineData[key][key2]['text']!=undefined){
          obj[key][key2]['text'] = {text:'', violationMessage:'policy violation'}
        }

        if(ruleEngineData[key][key2]['approval']!=undefined){
          obj[key][key2]['approval'] = {approvers:[], violationMessage:'policy violation'}
        }

        if(ruleEngineData[key][key2]['fields']!=undefined){
          obj[key][key2]['fields'] = ruleEngineData[key][key2]['fields']
        }
      
      })
    })
    return obj
  }

  useEffect(()=>{
    console.log(ruleEngineState)
  },[ruleEngineState])

  return <>
  {networkStates.isLoading && <Error message={networkStates.loadingErrMsg} />}
  {!networkStates.isLoading && <ReimbursementAllocationsPage tenantId = {tenantId} progress={progress} setProgress={setProgress} />}
  </>;
}