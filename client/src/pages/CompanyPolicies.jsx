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

export default function (props){
  
  const {state} = useLocation();
  const {tenantId} = useParams()
  console.log(tenantId)

  //flags
  const [flags, setFlags] = useState({})   
  const [groups, setGroups] = useState(null)
  const [ruleEngineState, setRuleEngineState] = useState()
  const [groupsNotFound, setGroupsNotFound] = useState(false)


  const [ruleEngineData, setRuleEngineData] = useState({
      international:{
        ['Allowed Trip Purpose']: {
          class: ['Business', 'Personal', 'Training', 'Events', 'Others'],
        },

        ['Flights']:{
          class: ['Economy', 'Premium Economy', 'Business', 'First'],
          limit: '',
        },

        ['Trains']:{
          class: ['AC 1st Class', 'AC 2nd Class', 'AC 3rd Class', 'Sleeper Class', 'General'],
          limit: '',
        },
        
        ['Car Rentals']:{
          class: ['Compact', 'Intermediate', 'Large'],
          limit: '',
        },
        
        ['Hotels']:{
          class: ['3 Star', '4 Star', '5 Star'],
          limit: '',
        },
        
        ['Meals']:{
          limit: '',
        },

        ['Advance Payment']:{
          limit: '',
        },

        ['Expense Report Submission Deadline']:{
          dayLimit: '',
        },

        ['Minimum Days to Book Before Travel']:{
          dayLimit: '',
        },
        ['Expense Type Restriction']:{
          class: ['Alcohol', 'Entertainment' ]
        },
        ['Policy Exception And Esclation Process']:{
          text:'',
        },
        
        ['Approval Flow']:{
          approval:'',
        },
      },

      domestic:{
        ['Allowed Trip Purpose']: {
          class: ['Business', 'Personal', 'Training', 'Events', 'Others'],
        },

        ['Flights']:{
          class: ['Economy', 'Premium Economy', 'Business', 'First'],
          limit: '',
        },

        ['Trains']:{
          class: ['AC 1st Class', 'AC 2nd Class', 'AC 3rd Class', 'Sleeper Class', 'General'],
          limit: '',
        },
        
        ['Car Rentals']:{
          class: ['Compact', 'Intermediate', 'Large'],
          limit: '',
        },
        
        ['Hotels']:{
          class: ['3 Star', '4 Star', '5 Star'],
          limit: '',
        },
        
        ['Meals']:{
          limit: '',
        },

        ['Advance Payment']:{
          limit: '',
        },

        ['Expense Report Submission Deadline']:{
          dayLimit: '',
        },

        ['Minimum Days to Book Before Travel']:{
          dayLimit: '',
        },
        ['Expense Type Restriction']:{
          class: ['Alcohol', 'Entertainment' ]
        },
        ['Policy Exception And Esclation Process']:{
          text:'',
        },
        
        ['Approval Flow']:{
          approval:'',
        },
      },

      local:{
        ['Allowed Car Rentals']: {
          class: ['Compact', 'Intermediate', 'Large'],
          limit: '',
        },

        ['Maximum Number of kilometers per day']:{
          limit: '',
        },

        ['Meals']:{
          limit: '',
        },

        ['Milage Reimbursement Rate [Car]']:{
          limit: ''
        },

        ['Milage Reimbursement Rate [Bike]']:{
          limit: ''
        },

        ['Ground Transportation Allowance']:{
          limit:''
        },

        ['Expense Report Submission Deadline']:{
          dayLimit: '',
        },

        ['Minimum Days to Book Before Travel']:{
          dayLimit: '',
        },

        ['Non Compliant travel Consequences']:{
          text:''
        },

        ['Policy Exception And Esclation Process']:{
          text:'',
        },
        
        ['Approval Flow']:{
          approval:'',
        },
      },
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
            const groups_data_response = await axios.get(`http://localhost:8001/api/tenant/${tenantId}/groups`);
            const policies_data_response = await axios.get(`http://localhost:8001/api/tenant/${tenantId}/policies/travel`);

            
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

      {groupsNotFound && <> 
      <Icon/>
        <div className="bg-slate-50 min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
            <div className='px-6 py-10 bg-white rounded shadow'>
              <div className="text text-xl font-cabin">No groups are found to setup company policies. Click <a className="underline text-indigo-600" href={`/${tenantId}/groups`}>here</a> to setup groups</div>
              <div className='w-fit'>
                <HollowButton title='Skip' onClick={`/others`} />
              </div>
            </div>
        </div>
        </>
      }

      {!groupsNotFound &&
      <Routes>
        <Route path='/' 
              element={<Home 
                ruleEngineData={ruleEngineData}
                ruleEngineState={ruleEngineState} 
                setRuleEngineState={setRuleEngineState} />} />

        <Route path='/international'  
                element={<InternationalPolicies 
                  ruleEngineData={ruleEngineData}
                  ruleEngineState={ruleEngineState} 
                  setRuleEngineState={setRuleEngineState}/>} />

        <Route path='/domestic' 
                element={<DomesticPolicies 
                  ruleEngineData={ruleEngineData}
                  ruleEngineState={ruleEngineState} 
                  setRuleEngineState={setRuleEngineState} />} />
        
        <Route path='/local' 
                element={<LocalPolicies 
                  ruleEngineData={ruleEngineData}
                  ruleEngineState={ruleEngineState} 
                  setRuleEngineState={setRuleEngineState} />} />
      </Routes>}
  </>;
}
