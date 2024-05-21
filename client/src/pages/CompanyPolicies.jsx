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
import ReimbursementPolicies from "./policies/ReimbursementPolicies";
import { getTenantDefaultCurrency_API } from "../utils/api";
import Error from "../components/common/Error";

const ONBOARDING_API = import.meta.env.VITE_PROXY_URL

export default function ({progress, setProgress}){
  
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
          title:'Allowed Trip Purpose',
          enabled:true,
          class: ['Business', 'Personal', 'Training', 'Events', 'Others'],
        },

        ['Flight']:{
          enabled:true,
          title: 'Flights',
          class: ['Economy', 'Premium Economy', 'Business', 'First'],
          limit: '',
          currency: {}
        },

        ['Train']:{
          enabled:true,
          title: 'Trains',
          class: ['AC 1st Class', 'AC 2nd Class', 'AC 3rd Class', 'Sleeper Class', 'General'],
          limit: '',
          currency: {}
        },
        
        ['Cab']:{
          enabled:true,
          title:'Cabs',
          class: ['Compact', 'Intermediate', 'Large'],
          limit: '',
          currency: {}
        },

        ['Car Rentals']:{
          enabled:true,
          title: 'Car Rentals',
          class: ['Compact', 'Intermediate', 'Large'],
          limit: '',
          currency: {}
        },
        
        ['Hotel']:{
          enabled:true,
          title: 'Hotels',
          class: ['3 Star', '4 Star', '5 Star'],
          limit: '',
          currency: {}
        },
        
        ['Meals']:{
          enabled:true,
          fixed:false,
          title:'Meals',
          limit: '',
          currency: {}
        },

        ['Mileage Reimbursement Rates (per Kilometer)']:{
          fixed:true,
          enabled:true,
          title:'Mileage Reimbursement Rates (per Kilometer)',
          limit: '',
          currency: {}                                               
        },

        ['Conference event Amount alowed upto']:{
          enabled:true,
          limit: '',
          currency: {}                                               
        },

        ['Travel Insurance Amount alowed upto']:{
          enabled:true,
          limit: '',
          currency: {}                                               
        },

        ['Baggage fee amount alowed upto']:{
          enabled:true,
          limit: '',
          currency: {}                                               
        },

        ['Tips (amount alowed upto)']:{
          enabled:true,
          limit: '',
          currency: {}                                               
        },

        ['Advance Payment']:{
          enabled:true,
          limit: '',
          currency: {}
        },

        ['Expense Report Submission Deadline']:{
          enabled:true,
          dayLimit: '',
        },

        ['Minimum Days to Book Before Travel']:{
          enabled:true,
          dayLimit: '',
        },

        ['Expense Type Restriction']:{
          enabled:true,
          class: ['Alcohol', 'Entertainment' ]
        },

        ['Policy Exception And Esclation Process']:{
          enabled:true,
          text:'',
        },
        
        ['Approval Flow']:{
          enabled:true,
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

  const [nonTravelPolicies, setNonTravelPolicies] = useState({})
  const [currencySymbol, setCurrencySymbol] = useState('')
  const [networkStates, setNetworkStates] = useState({isLoading:true, isUploading:false, loadingErrMsg:null})

  useEffect(() => {
    (async function () {
      try {
         setNetworkStates(pre=>({...pre, isLoading:true}))
        //get travel expense categories..., travel allocation flags... and groups

        //const groups_data_response = await axios.get(`import.meta.VITE_PROXY_URL/tenant/${tenantId}/groups`);

        const policies_data_response = await axios.get(`${ONBOARDING_API}/tenant/${tenantId}/policies/travel`);
        const res = await axios.get(`${ONBOARDING_API}/tenant/${tenantId}/policies/non-travel`);
        const dc_res = await getTenantDefaultCurrency_API({tenantId})
        setCurrencySymbol(dc_res.data?.defaultCurrency?.symbol??'')
        
        const rls = Object.keys(policies_data_response?.data?.policies??{}).map(key=>(policies_data_response.data.policies[key]))
        console.log(rls)
        setRuleEngineState(rls)
        setNonTravelPolicies(res.data.policies)
        setNetworkStates(pre=>({...pre, isLoading:false}))
        return;
               
      } catch (e) {
        if (e.response) {
          console.error(e.response);
          setNetworkStates(pre=>({...pre, loadingErrMsg:e.response.message}))
        } else if (e.request) {
          console.error('Internal server error');
          setNetworkStates(pre=>({...pre, loadingErrMsg:e.message}))
        } else {
          setNetworkStates(pre=>({...pre, loadingErrMsg:e.message}))
          console.error('Something went wrong while placing the request', e);
        }
      }
    })();
  }, []);
  

  useEffect(()=>{
    console.log(currencySymbol, 'currencySymbol')
  },[currencySymbol])

  useEffect(()=>{
    console.log(ruleEngineState)
  },[ruleEngineState])


  useEffect(()=>{
    if(progress!= undefined && progress?.activeSection != 'section 5'){
      setProgress(pre=>({...pre, activeSection:'section 5'}))
    }
  },[progress])

  return <>
      {groupsNotFound && <> 
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

      {networkStates.isLoading && <Error message={networkStates.loadingErrMsg}/>}
      {!networkStates.isLoading &&
      <Routes>
        <Route path='/' 
              element={<Home 
                progress={progress}
                setProgress={setProgress}
                currencySymbol={currencySymbol}
                ruleEngineData={ruleEngineData}
                ruleEngineState={ruleEngineState} 
                setRuleEngineState={setRuleEngineState} />} />

        <Route path='/international'  
                element={<InternationalPolicies 
                  progress={progress}
                  setProgress={setProgress}
                  currencySymbol={currencySymbol}
                  ruleEngineData={ruleEngineData}
                  ruleEngineState={ruleEngineState} 
                  setRuleEngineState={setRuleEngineState}/>} />

        <Route path='/domestic' 
                element={<DomesticPolicies 
                  progress={progress}
                  setProgress={setProgress}
                  currencySymbol={currencySymbol}
                  ruleEngineData={ruleEngineData}
                  ruleEngineState={ruleEngineState} 
                  setRuleEngineState={setRuleEngineState} />} />
        
        <Route path='/local' 
                element={<LocalPolicies 
                  progress={progress}
                  setProgress={setProgress}
                  currencySymbol={currencySymbol}
                  ruleEngineData={ruleEngineData}
                  ruleEngineState={ruleEngineState} 
                  setRuleEngineState={setRuleEngineState} />} />

        <Route path='/reimbursement' 
                element={<ReimbursementPolicies 
                  progress={progress}
                  setProgress={setProgress}
                  currencySymbol={currencySymbol}
                  tenantId={tenantId}
                  travelType={'nonTravel'}
                  ruleEngineData={ruleEngineData}
                  ruleEngineState={nonTravelPolicies} 
                  setRuleEngineState={setNonTravelPolicies} />} />
      </Routes>}
  </>;

}
