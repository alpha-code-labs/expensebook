import { useState, useEffect} from "react";
import axios from 'axios'
import internatinal_travel_icon from '../../assets/in-flight.svg'
import domestic_travel_icon from '../../assets/briefcase.svg'
import local_travel_icon from '../../assets/map-pin.svg'
import non_travel_icon from '../../assets/paper-money-two.svg'
import arrow_down from "../../assets/chevron-down.svg";
import HollowButton from "../../components/common/HollowButton";
import ReimbursementPolicies from "./ReimbursementPolicies";
import PoliciesPageComponents from "./PoliciesPageComponents"


import { getTenantDefaultCurrency_API } from "../../utils/api";
import Error from "../../components/common/Error";
import MainSectionLayout from "../../layouts/MainSectionLayout";

const ONBOARDING_API = import.meta.env.VITE_PROXY_URL

export default function ({tenantId}){
  
  console.log(tenantId)

  //flags
  const [flags, setFlags] = useState({})   
  const [groups, setGroups] = useState(null)
  const [ruleEngineState, setRuleEngineState] = useState()
  const [groupsNotFound, setGroupsNotFound] = useState(false)

  const [ruleEngineData, setRuleEngineData] = useState({})

  const [nonTravelPolicies, setNonTravelPolicies] = useState({})
  const [currencySymbol, setCurrencySymbol] = useState('')
  const [networkStates, setNetworkStates] = useState({isLoading:true, isUploading:false, loadingErrMsg:null})
  const [showPage, setShowPage] = useState(null);

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


  return (
  <MainSectionLayout>
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
      <>
        {showPage == null && <div className="mt-10 flex flex-col gap-4">

            <CollapsedPolicy 
                onClick={() => setShowPage('international')}
                text='International Travel'
                icon={internatinal_travel_icon}/>

            <CollapsedPolicy 
                onClick={() => setShowPage('domestic')}
                text='Domestic Travel'
                icon={domestic_travel_icon}/>

            <CollapsedPolicy 
                onClick={() => setShowPage('local')}
                text='Local Travel'
                icon={local_travel_icon}/>

            <hr className="my-2 border-dashed border-indigo-600"/>

            <CollapsedPolicy 
                onClick={() => setShowPage('reimbursement')}
                text='Reimbursement Policies'
                icon={non_travel_icon}/>
        </div>}

        {showPage == 'international' &&  
            <PoliciesPageComponents 
                setShowPage={setShowPage}
                currencySymbol={currencySymbol}
                tenantId = {tenantId}
                ruleEngineState={ruleEngineState}
                setRuleEngineState={setRuleEngineState}
                travelType='international' />}

        {showPage == 'domestic' &&  
            <PoliciesPageComponents 
                setShowPage={setShowPage}
                currencySymbol={currencySymbol}
                tenantId = {tenantId}
                ruleEngineState={ruleEngineState}
                setRuleEngineState={setRuleEngineState}
                travelType='domestic' />}

        {showPage == 'local' &&  
            <PoliciesPageComponents 
                setShowPage={setShowPage}
                currencySymbol={currencySymbol}
                tenantId = {tenantId}
                ruleEngineState={ruleEngineState}
                setRuleEngineState={setRuleEngineState}
                travelType='local' />}

        {showPage == 'reimbursement' && 
            <ReimbursementPolicies 
                setShowPage={setShowPage}
                currencySymbol={currencySymbol}
                tenantId={tenantId}
                travelType={'nonTravel'}
                ruleEngineData={ruleEngineData}
                ruleEngineState={nonTravelPolicies} 
                setRuleEngineState={setNonTravelPolicies} />} 
      </>
      }
      </MainSectionLayout>)
}


function CollapsedPolicy(props){
    const icon = props.icon
    const text = props.text || 'Enter text'
    const onClick = props.onClick || (() => {})
    const completed = props.completed??false;

    return(
        <>
            <div onClick={onClick} className="w-full h-[72px] p-3 sm:p-6 relative bg-white cursor-pointer rounded-xl border border-neutral-200 inline-flex items-center">
                <div className="flex justify-between items-center w-full">
                    <div className="justify-start items-center gap-8 inline-flex">
                        <div className="justify-start items-center gap-6 flex">
                            <div className="w-6 h-6 relative">
                                <img src={icon} />
                            </div>
                            <div className="text-neutral-700 text-base font-medium font-['Cabin']">{text}</div>
                        </div>
                    </div>

                    <div className="justify-start gap-4 sm:gap-[40px] items-start inline-flex">
                        {completed && <div className="p-1 rounded-full bg-[#bfebae]">
                            <img src={checkIcon} className="w-4 h-4 sm:w-5 sm:h-5"/>
                        </div>}
                        <div className="w-6 h-6 -rotate-90">
                            <img src={arrow_down} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}