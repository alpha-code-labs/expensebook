import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import axios from 'axios'
import Home from "./policies/PoliciesHome";
import InternationalPolicies from "./policies/InternationalPolicies";
import DomesticPolicies from "./policies/DomesticPolicies";
import { rule } from "postcss";
import LocalPolicies from "./policies/LocalPolicies";
import NonTravelPolicies from "./policies/NonTravelPolicies";
import { useLocation } from "react-router-dom";

export default function (props){
  
  const {state} = useLocation();
  console.log(state, '...state')
  //flags
  const [flags, setFlags] = useState({})   

  const ruleEngineData = {
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
          text:'',
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
          text:'',
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
          text:'',
        },
      },

      nonTravel:{
        ['Office Supplies']:{
          limit: '',
        },

        ['Utilities']:{
          limit: '',
        },

        ['Insurance']:{
          limit: '',
        },

        ['Marketing and advertising']:{
          limit: '',
        },

        ['Professional Fees']:{
          limit: '',
        },

        ['Software and License']:{
          limit: '',
        },

        ['Equipment']:{
          limit: '',
        },

        ['Repair and Maintainance']:{
          limit: '',
        },

        ['Legal and Compliance']:{
          limit: '',
        },

        ['Communication']:{
          limit: '',
        },

        ['Research and Development']:{
          limit: '',
        },

        ['Training']:{
          limit: '',
        },

        ['Software Subscription']:{
          limit: '',
        },

        ['Legal Expenses']:{
          limit: '',
        },

        ['Client Entertainment']:{
          limit: '',
        },

        ['Client Gift']:{
          limit: '',
        },

      }
  }

  const [groups, setGroups] = useState(null)
  const [internationalRules, setInternationalRules] = useState()
  const [ruleEngineState, setRuleEngineState] = useState()

  useEffect(()=>{
    setGroups(state.groups)
    setRuleEngineState(state.groups.map(group=>({[group]:convertToObject(ruleEngineData)})))
  },[])


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
        
      })
    })
    return obj
  }


  useEffect(()=>{
    //console.log(ruleEngineState)
  },[ruleEngineState])



  return <>

      {!groups && <div className="bg-slate-50 px-[104px] py-20">
        no groups are found to setup policy</div>}

      <Routes>
        <Route path='/' 
              element={<Home 
                ruleEngineState={ruleEngineState} 
                setRuleEngineState={setRuleEngineState} />} />

        <Route path='/international'  
                element={<InternationalPolicies 
                  ruleEngineState={ruleEngineState} 
                  setRuleEngineState={setRuleEngineState}/>} />

        <Route path='/domestic' 
                element={<DomesticPolicies 
                  ruleEngineState={ruleEngineState} 
                  setRuleEngineState={setRuleEngineState} />} />
        
        <Route path='/local' 
                element={<LocalPolicies 
                  ruleEngineState={ruleEngineState} 
                  setRuleEngineState={setRuleEngineState} />} />
        
        <Route path='/non-travel' 
                element={<NonTravelPolicies
                  ruleEngineState={ruleEngineState} 
                  setRuleEngineState={setRuleEngineState} />} />

      </Routes>
  </>;
}
