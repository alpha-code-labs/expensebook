import Button from "../../components/common/Button"
import Icon from "../../components/common/Icon"
import { useNavigate, useParams } from "react-router-dom"
import HollowButton from "../../components/common/HollowButton"
import internatinal_travel_icon from '../../assets/in-flight.svg'
import domestic_travel_icon from '../../assets/briefcase.svg'
import local_travel_icon from '../../assets/map-pin.svg'
import non_travel_icon from '../../assets/paper-money-two.svg'
import arrow_down from "../../assets/chevron-down.svg";
import Checkbox from "../../components/common/Checkbox"
import Modal from "../../components/common/Modal"
import { useState, useEffect } from "react"
import PoliciesPageComponents from "./PoliciesPageComponents"
import axios from "axios"


export default function ({tenantId}){

    const [showPolicyType, setShowPolicyType] = useState(null)
      //flags
    const [flags, setFlags] = useState({})   
    const [groups, setGroups] = useState([])
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
        console.log('this ran..');
        try {
            const groups_data_response = await axios.get(`http://localhost:8001/api/tenant/${tenantId}/groups`);
            const policies_data_response = await axios.get(`http://localhost:8001/api/tenant/${tenantId}/policies/travel`);

            
            const groups = groups_data_response.data.groups
            const policies = policies_data_response.data.policies
            console.log(policies, 'policies')

            if(!Array.isArray(policies)){
                //no policies has been setup yet        
                setGroups(['All', ...groups.filter(group => group.groupName!='All').map(group=>group.groupName)]);
                console.log('true groups...', ['All', ...groups.filter(group => group.groupName!='All').map(group=>group.groupName)])
                setRuleEngineState(['All', ...groups.filter(group => group.groupName!='All').map(group=>group.groupName)].map(group => ({ [group.groupName]: convertToObject(ruleEngineData) })))
    
            }

            else{
            //policy setup was done previously..
            //there are two options...
            // 1) remove the existing policies and let him setup again if groups are changed
            // 2) check what groups are changed and patch existing policies with that information 


            //get group names from policies
            const latestGroupNames = ['All', ...groups.filter(group => group.groupName!='All').map(group=>group.groupName)]
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
                    setGroups(['All', ...groups.filter(group => group.groupName!='All').map(group=>group.groupName)]);
                } 

                setRuleEngineState(latestGroupNames.map(group => ({ [group.groupName]: convertToObject(ruleEngineData) })))
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
  

    return <>

    {groupsNotFound && <> 
      <div className="bg-slate-50 min-h-[calc(100vh-107px)] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
          <div className='px-6 py-10 bg-white rounded shadow'>
            <div className="text text-xl font-cabin">No groups are found to setup company policies. Please setup groups first</div>
          </div>
      </div>
      </>
    }

    {!groupsNotFound && <>
      <div className="bg-slate-50 min-h-[calc(100vh-107px)]  md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
          {showPolicyType == null && <div className='px-6 py-10 bg-white rounded shadow'>
              <div className="flex justify-between">
                  <div className="gap-2">
                      <p className="text-neutral-700 text-xl font-semibold tracking-tight">
                          Setting up your Travel Related Policies
                      </p>
                      <p className="text-gray-600 text-sm font-normal font-cabin" >
                          Use existing policies or add custom policies to your company's travel policy
                      </p>
                  </div>
              </div>

              <div className="mt-10 flex flex-col gap-4">

                  <CollapsedPolicy 
                      onClick={() => setShowPolicyType('international')}
                      text='International Travel'
                      icon={internatinal_travel_icon}/>

                  <CollapsedPolicy 
                      onClick={() => setShowPolicyType('domestic')}
                      text='Domestic Travel'
                      icon={domestic_travel_icon}/>

                  <CollapsedPolicy 
                      onClick={() => setShowPolicyType('local')}
                      text='Local Travel'
                      icon={local_travel_icon}/>
              </div>

          </div>}

          {showPolicyType == 'international' &&     
              <PoliciesPageComponents 
                  tenantId = {tenantId}
                  ruleEngineState={ruleEngineState}
                  setShowPolicyType={setShowPolicyType}
                  setRuleEngineState={setRuleEngineState}
                  travelType='international' />}

          {showPolicyType == 'domestic' &&     
              <PoliciesPageComponents 
                  tenantId = {tenantId}
                  ruleEngineState={ruleEngineState}
                  setShowPolicyType={setShowPolicyType}
                  setRuleEngineState={setRuleEngineState}
                  travelType='domestic' />}

          {showPolicyType == 'local' &&     
              <PoliciesPageComponents 
                  tenantId = {tenantId}
                  ruleEngineState={ruleEngineState}
                  setShowPolicyType={setShowPolicyType}
                  setRuleEngineState={setRuleEngineState}
                  travelType='local' />}

      </div>
      
    </>}
</>;
}


function CollapsedPolicy(props){
    const icon = props.icon
    const text = props.text || 'Enter text'
    const onClick = props.onClick || (() => {})

    return(
        <>
            <div onClick={onClick} className="w-full h-[72px] p-6 relative bg-white cursor-pointer rounded-xl border border-neutral-200">
                <div className="flex justify-between items-center">
                    <div className="justify-start items-center gap-8 inline-flex">
                        <div className="justify-start items-center gap-6 flex">
                            <div className="w-6 h-6 relative">
                                <img src={icon} />
                            </div>
                            <div className="text-neutral-700 text-base font-medium font-['Cabin']">{text}</div>
                        </div>
                    </div>

                    <div className="justify-start gap-12 items-start gap-2 inline-flex">
                        <div className="w-6 h-6 -rotate-90">
                            <img src={arrow_down} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

