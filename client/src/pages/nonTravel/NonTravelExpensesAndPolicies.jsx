import { useState, useEffect, createContext } from "react";
import NonTravelPoliciesPageComponent from "./NonTravelPoliciesPageComponent";
import { getTenantGroups_API, getTenantNonTravelPolicies_API } from "../../utils/api";

export default function ({tenantId}){
  
  const state = null
  console.log(tenantId)

  //flags
  const [flags, setFlags] = useState({})   
  const [groups, setGroups] = useState(null)
  const [ruleEngineState, setRuleEngineState] = useState()
  const [groupsNotFound, setGroupsNotFound] = useState(false)
  const [loading, setLoading] = useState(false)


  const [ruleEngineData, setRuleEngineData] = useState({
      nonTravel:{
        ['Office Supplies']:{
          limit: '',
          fields: [
            {name:'Vendor Name', type:'text'},
            {name:'Bill Number', type:'number'},
            {name:'Bill Date', type:'date'},
            {name:'Description', type:'text'},
            {name: 'Unit Cost', type:'amount'},
            {name: 'Total Cost', type: 'amount'},
            {name: 'Tax Amount', type: 'amount'},
            {name: 'Total Amount', type: 'amount'} ]
        },

        ['Utilities']:{
          limit: '',
          fields: [
            {name:'Vendor Name', type:'text'},
            {name:'Bill Number', type:'number'},
            {name:'Bill Date', type:'date'},
            {name:'Description', type:'text'},
            {name: 'Unit Cost', type:'amount'},
            {name: 'Total Cost', type: 'amount'},
            {name: 'Tax Amount', type: 'amount'},
            {name: 'Total Amount', type: 'amount'} ]
        },

        ['Insurance']:{
          limit: '',
          fields: [
            {name:'Vendor Name', type:'text'},
            {name:'Bill Number', type:'number'},
            {name:'Bill Date', type:'date'},
            {name:'Description', type:'text'},
            {name: 'Unit Cost', type:'amount'},
            {name: 'Total Cost', type: 'amount'},
            {name: 'Tax Amount', type: 'amount'},
            {name: 'Total Amount', type: 'amount'},]
        },

        ['Marketing and advertising']:{
          limit: '',
          fields: [
            {name:'Vendor Name', type:'text'},
            {name:'Bill Number', type:'number'},
            {name:'Bill Date', type:'date'},
            {name:'Description', type:'text'},
            {name: 'Unit Cost', type:'amount'},
            {name: 'Total Cost', type: 'amount'},
            {name: 'Tax Amount', type: 'amount'},
            {name: 'Total Amount', type: 'amount'} ]
        },

        ['Professional Fees']:{
          limit: '',
          fields: [
            {name:'Vendor Name', type:'text'},
            {name:'Bill Number', type:'number'},
            {name:'Bill Date', type:'date'},
            {name:'Description', type:'text'},
            {name: 'Unit Cost', type:'amount'},
            {name: 'Total Cost', type: 'amount'},
            {name: 'Tax Amount', type: 'amount'},
            {name: 'Total Amount', type: 'amount'} ]
        },

        ['Software and License']:{
          limit: '',
          fields: [
            {name:'Vendor Name', type:'text'},
            {name:'Bill Number', type:'number'},
            {name:'Bill Date', type:'date'},
            {name:'Description', type:'text'},
            {name: 'Unit Cost', type:'amount'},
            {name: 'Total Cost', type: 'amount'},
            {name: 'Tax Amount', type: 'amount'},
            {name: 'Total Amount', type: 'amount'} ]
        },

        ['Equipment']:{
          limit: '',
          fields: [
            {name:'Vendor Name', type:'text'},
            {name:'Bill Number', type:'number'},
            {name:'Bill Date', type:'date'},
            {name:'Description', type:'text'},
            {name: 'Unit Cost', type:'amount'},
            {name: 'Total Cost', type: 'amount'},
            {name: 'Tax Amount', type: 'amount'},
            {name: 'Total Amount', type: 'amount'} ]
        },

        ['Repair and Maintainance']:{
          limit: '',
          fields: [
            {name:'Vendor Name', type:'text'},
            {name:'Bill Number', type:'number'},
            {name:'Bill Date', type:'date'},
            {name:'Description', type:'text'},
            {name: 'Unit Cost', type:'amount'},
            {name: 'Total Cost', type: 'amount'},
            {name: 'Tax Amount', type: 'amount'},
            {name: 'Total Amount', type: 'amount'} ]
        },

        ['Legal and Compliance']:{
          limit: '',
          fields: [
            {name:'Vendor Name', type:'text'},
            {name:'Bill Number', type:'number'},
            {name:'Bill Date', type:'date'},
            {name:'Description', type:'text'},
            {name: 'Unit Cost', type:'amount'},
            {name: 'Total Cost', type: 'amount'},
            {name: 'Tax Amount', type: 'amount'},
            {name: 'Total Amount', type: 'amount'} ]
        },

        ['Communication']:{
          limit: '',
          fields: [
            {name:'Vendor Name', type:'text'},
            {name:'Bill Number', type:'number'},
            {name:'Bill Date', type:'date'},
            {name:'Description', type:'text'},
            {name: 'Unit Cost', type:'amount'},
            {name: 'Total Cost', type: 'amount'},
            {name: 'Tax Amount', type: 'amount'},
            {name: 'Total Amount', type: 'amount'} ]
        },

        ['Research and Development']:{
          limit: '',
          fields: [
            {name:'Vendor Name', type:'text'},
            {name:'Bill Number', type:'number'},
            {name:'Bill Date', type:'date'},
            {name:'Description', type:'text'},
            {name: 'Unit Cost', type:'amount'},
            {name: 'Total Cost', type: 'amount'},
            {name: 'Tax Amount', type: 'amount'},
            {name: 'Total Amount', type: 'amount'} ]
        },

        ['Training']:{
          limit: '',
          fields: [
            {name:'Vendor Name', type:'text'},
            {name:'Bill Number', type:'number'},
            {name:'Bill Date', type:'date'},
            {name:'Description', type:'text'},
            {name: 'Unit Cost', type:'amount'},
            {name: 'Total Cost', type: 'amount'},
            {name: 'Tax Amount', type: 'amount'},
            {name: 'Total Amount', type: 'amount'} ]
        },

        ['Software Subscription']:{
          limit: '',
          fields: [
            {name:'Vendor Name', type:'text'},
            {name:'Bill Number', type:'number'},
            {name:'Bill Date', type:'date'},
            {name:'Description', type:'text'},
            {name: 'Unit Cost', type:'amount'},
            {name: 'Total Cost', type: 'amount'},
            {name: 'Tax Amount', type: 'amount'},
            {name: 'Total Amount', type: 'amount'} ]
        },

        ['Legal Expenses']:{
          limit: '',
          fields: [
            {name:'Vendor Name', type:'text'},
            {name:'Bill Number', type:'number'},
            {name:'Bill Date', type:'date'},
            {name:'Description', type:'text'},
            {name: 'Unit Cost', type:'amount'},
            {name: 'Total Cost', type: 'amount'},
            {name: 'Tax Amount', type: 'amount'},
            {name: 'Total Amount', type: 'amount'} ]
        },

        ['Client Entertainment']:{
          limit: '',
          fields: [
            {name:'Vendor Name', type:'text'},
            {name:'Bill Number', type:'number'},
            {name:'Bill Date', type:'date'},
            {name:'Description', type:'text'},
            {name: 'Unit Cost', type:'amount'},
            {name: 'Total Cost', type: 'amount'},
            {name: 'Tax Amount', type: 'amount'},
            {name: 'Total Amount', type: 'amount'}]
        },

        ['Client Gift']:{
          limit: '',
          fields: [
            {name:'Vendor Name', type:'text'},
            {name:'Bill Number', type:'number'},
            {name:'Bill Date', type:'date'},
            {name:'Description', type:'text'},
            {name: 'Unit Cost', type:'amount'},
            {name: 'Total Cost', type: 'amount'},
            {name: 'Tax Amount', type: 'amount'},
            {name: 'Total Amount', type: 'amount'}]
        },


      }
  })


  useEffect(() => {
    (async function () {
    
        setLoading(true)
        console.log('this ran..');
        
        const groups_data_response = await getTenantGroups_API({tenantId})
        const policies_data_response = await getTenantNonTravelPolicies_API({tenantId})

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
        
        setLoading(false)
        console.log('resolved.. ', groups.length);
    
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
    <NonTravelPoliciesPageComponent 
        tenantId = {tenantId}
        ruleEngineState={ruleEngineState}
        setRuleEngineState={setRuleEngineState}
        travelType='nonTravel' />
  </>;
}