import internatinal_travel_icon from '../../assets/in-flight.svg'
import domestic_travel_icon from '../../assets/briefcase.svg'
import local_travel_icon from '../../assets/map-pin.svg'
import non_travel_icon from '../../assets/paper-money-two.svg'
import React from 'react'
import back_icon from '../../assets/arrow-left.svg'
import Icon from '../../components/common/Icon';
import arrow_down from "../../assets/chevron-down.svg";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Checkbox from '../../components/common/Checkbox';
import check_icon from '../../assets/check.svg'
import cross_icon from '../../assets/x.svg'
import Input from '../../components/common/Input';
import HollowButton from '../../components/common/HollowButton';
import Button from '../../components/common/Button'
import MultiSelect from '../../components/common/MultiSelect'
import { updateFormState_API, updateTravelPolicies_API } from '../../utils/api'
import Switch from '../../components/common/Switch'
import Prompt from '../../components/common/Prompt'
import { motion } from 'framer-motion'
import MainSectionLayout from '../MainSectionLayout'
import { postProgress_API } from '../../utils/api'
import { camelCaseToTitleCase, titleCaseToCamelCase } from '../../utils/handyFunctions'

const redirectionTimeout = import.meta.env.VITE_REDIRECT_TIMEOUT??3000
const promptTimeout = import.meta.env.VITE_PROMPT_TIMEOUT??2700

export default function ({tenantId, travelType, ruleEngineState, setRuleEngineState, currencySymbol, progress, setProgress}) {
    const icon = switchIcon(travelType)
    const [showAddExpenseCategoriesModal, setShowAddExpenseCategoriesModal] = useState(false)
    const [prompt, setPrompt] = useState({showPrompt:false, promptMsg:null, success:false})
    const [networkStates, setNetworkStates] = useState({isLoading:false, isUploading:false, loadingErrMsg:null})
    const [activeTabIndex, setActiveTabIndex] = useState(-2)
    const [expandedTab, setExpandedTab] = useState(-1);

    function switchIcon(travelType){

        switch (travelType){
            case 'international':
                return internatinal_travel_icon
            case 'domestic':
                return domestic_travel_icon
            case 'local':
                return local_travel_icon
            case 'nonTravel':
                return non_travel_icon
        }
    }

    function switchTitle(travelType){
            
            switch (travelType){
                case 'international':
                    return 'International Travel Policies'
                case 'domestic':
                    return 'Domestic Travel Policies'
                case 'local':
                    return 'Local Travel Policies'
                case 'nonTravel':
                    return 'Non Travel Policies'
            }
    }
    
    const navigate = useNavigate()
    const [policies, setPolicies] = useState([])

    useEffect(()=>{
        const policies = []
        if(ruleEngineState?.length>0){
            Object.keys(ruleEngineState[0][Object.keys(ruleEngineState[0])[0]][travelType]).map(item=>policies.push(item))
        }
        setPolicies(policies)
        // console.log(policies)
    },[ruleEngineState] )

    const savePolicies = async ()=>{
        console.log('save policies clicked....')
        //save policies to backend
        setNetworkStates(pre=>({...pre, isUploading:true}))
        const res = await updateTravelPolicies_API({tenantId, policies:ruleEngineState})

        let currentSubSection ;

        if(travelType == 'international') currentSubSection = 'International Policies';
        if(travelType == 'domestic') currentSubSection = 'Domestic Policies';
        if(travelType == 'local') currentSubSection = 'Local Policies';
        
        const progress_copy = JSON.parse(JSON.stringify(progress));

        progress_copy.sections['section 5'].subsections.forEach(subsection=>{
            if(subsection.name == currentSubSection) subsection.completed = true;
        });

        progress_copy.sections['section 5'].subsections.forEach(subsection=>{
            if(subsection.name == currentSubSection) subsection.completed = true;
        });

        const markCompleted = !progress_copy.sections['section 5'].subsections.some(subsection=>!subsection.completed)

        let totalCoveredSubsections = 0;
        progress_copy.sections['section 5'].subsections.forEach(subsection=>{
            if(subsection.completed) totalCoveredSubsections++;
        })

        progress_copy.sections['section 5'].coveredSubsections = totalCoveredSubsections; 

        const progress_res = await postProgress_API({tenantId, progress: progress_copy})

        setNetworkStates(pre=>({...pre, isUploading:false}))

        if(res.err || progress_res.err){
            setPrompt({showPrompt:true, promptMsg:'Can not update policies at the moment. Please try again later'})
        }
        else{
            setPrompt({showPrompt:true, promptMsg:`${camelCaseToTitleCase(travelType)} Policies Updated!`})
            console.log(res.data)
            updateFormState_API({tenantId, state:'/setup-company-policies'})
            
            
            setTimeout(() => {
                setProgress(progress_copy);    
                navigate(`/${tenantId}/setup-company-policies`)
            }, 3000);
            
        }
    }

    return(<>
        <MainSectionLayout>
        
            <div className='px-6 py-10 bg-white'>               
                {/* back button and title */}
                <div className='flex gap-4'>
                    <div className='w-6 h-6 cursor-pointer' onClick={()=>navigate(-1)}>
                        <img src={back_icon} />
                    </div>

                    <div className='flex gap-2'>
                        <div className="w-6 h-6 relative">
                            <img src={icon} />
                        </div>

                        <p className='text-neutral-700 text-base font-medium font-cabin tracking-tight'>
                            {switchTitle(travelType)}
                        </p>

                    </div>
                </div>

                {/* rest of the section */}
                <div className='mt-10 flex flex-col gap-4'>  
                    {policies.map((policy,index)=>{

                            if(ruleEngineState[0][Object.keys(ruleEngineState[0])[0]][travelType][policy]){
                                return (
                                <Policy 
                                    currencySymbol={currencySymbol} 
                                    key={index} 
                                    savePolicies={savePolicies} 
                                    title={policy} 
                                    tripType={travelType} 
                                    ruleEngineState={ruleEngineState} 
                                    setRuleEngineState={setRuleEngineState}
                                    networkStates={networkStates}
                                    activeTabIndex={activeTabIndex}
                                    setActiveTabIndex={setActiveTabIndex}
                                    expandedTab={expandedTab}
                                    setExpandedTab={setExpandedTab}
                                    tabIndex={index}
                                        />)
                            }
                        }
                    )}

                    <div>
                        <Button isLoading={networkStates.isUploading} variant='fit' text='Save and Continue' onClick={savePolicies} />
                    </div>

                        { travelType==='nonTravel' && 
                            <div className='mt-6'>
                                <HollowButton title='Add Expense Categories' onClick={()=>{setExistingCategory(false); setShowAddExpenseCategoriesModal(true)}} />
                            </div>
                        }  
                </div>

            </div>

            <Prompt prompt={prompt} setPrompt={setPrompt} timeout={3000} />
    
        </MainSectionLayout>
        </>
    );
  }

  function ClassTable(props){
    const tripType = props.tripType || 'international'
    const policy = props.policy || 'allowedTripPurpose'
    const groups = props.groups || ['Executives', 'Managers', "VC's"]
    const values = props.values || ['Client Meeting', 'Training', 'Audit', 'Conference']

    const ruleEngineState = props.ruleEngineState
    const setRuleEngineState = props.setRuleEngineState
    
    const colWidth = '134px'
    
    const handleCellState = (groupIndex, valIndex)=>{
        const ruleEngineState_copy = JSON.parse(JSON.stringify(ruleEngineState))
        ruleEngineState_copy[groupIndex][groups[groupIndex]][tripType][policy]['class'][values[valIndex]].allowed   =   !ruleEngineState_copy[groupIndex][groups[groupIndex]][tripType][policy]['class'][values[valIndex]].allowed
        setRuleEngineState(ruleEngineState_copy)
    }

   return(<>
    {/* top row */}
    <div className='flex justify-content divide-x'>
        <div className={`w-[${colWidth}]`} ></div>
        {groups.map((group,index)=><div key={index} className={`w-[${colWidth}] inline-flex justify-center items-center p-2 text-zinc-500 text-sm font-normal font-cabiin tracking-tight`} >{group}</div>)}
    </div>

    {values.map((value,valIndex) =>{
    
        return(<React.Fragment key={valIndex}>
            {/* rest of the rows */}
            <div className='flex justify-content divide-x'>
                <div className={`w-[${colWidth}] p-2 text-zinc-500 text-sm font-normal font-cabiin tracking-tight`} >{`${value} :`}</div>
                {groups.map((group,groupIndex)=><div key={groupIndex} className={`w-[${colWidth}] inline-flex justify-center items-center p-2 text-zinc-500 text-sm font-normal font-cabiin tracking-tight`} >

                    { ruleEngineState[groupIndex][groups[groupIndex]][tripType][policy]['class'][values[valIndex]].allowed ? <CheckIcon onClick={()=>handleCellState(groupIndex,valIndex)}/> : <CrossIcon onClick={()=>handleCellState(groupIndex,valIndex)}/>}
                </div>)}
            </div>

        </React.Fragment>)
    })}

   </>)
  }

  function CheckIcon(props){
    const onClick = props.onClick

    return(<>
        <div onClick={onClick} className="p-1 cursor-pointer bg-green-300 rounded-3xl justify-center items-center inline-flex">
            <div className="w-4 h-4">
                <img src={check_icon} />
            </div>
        </div>
    </>)
  }

  function CrossIcon(props){
    const onClick = props.onClick

    return(<>
        <div onClick={props.onClick} className="p-1 cursor-pointer bg-red-300 rounded-3xl justify-center items-center inline-flex">
            <div className="w-4 h-4">
                <img src={cross_icon} />
            </div>
        </div>
    </>)
  }

function AmountTable(props){
    const groups = props.groups || ['Executives', 'Managers', "VC's"]
    const currencySymbol = props.currencySymbol
    const tripType = props.tripType
    const policy = props.policy
    const ruleEngineState = props.ruleEngineState
    const setRuleEngineState = props.setRuleEngineState
    let types = props.types
    const [unit, setUnit] = useState('')
    const [placeholder, setPlaceholder] = useState('')
    const [symbol, setSymbol] = useState(null)

    useEffect(()=>{
        if(types.includes('limit')){
            //maybe default currency
            setUnit('amount')
            setPlaceholder('maximum amount')
            //default currency...
            setSymbol(currencySymbol)
        }
        else if(types.includes('dayLimit')){
            setUnit('days')
            setPlaceholder('days')
            setSymbol(null)
        }
        else if(types.includes('text')){
            setUnit('text')
            setPlaceholder('description')
        }
    },[types])

    if(types.includes('class')){
        const ind = types.indexOf('class')
        types.splice(ind,1)
    }

    const handleAmountChange = (index, e)=>{
        const ruleEngineState_copy = JSON.parse(JSON.stringify(ruleEngineState))
        ruleEngineState_copy[index][groups[index]][tripType][policy][types[0]][unit] = e.target.value
        setRuleEngineState(ruleEngineState_copy)
    }


    return(<>
        <div className='py-6 px-auto'>
            
            {types[0]!= 'text' && types[0]!= 'permission' && <div className='flex flex-col gap-6'>
                {groups.map((group,index)=> <div key={index} className='flex gap-32 items-center'>
                    <div key={index} className='text inline-flex w-[132px] text-sm tracking-tight text-zinc-500 font-normal font-cabin'>{group}</div>
                    <div> 
                            {symbol!=null && <div className="relative text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                            <input
                                onChange={(e)=>handleAmountChange(index,e)} 
                                className=" w-full h-full decoration:none w-[172px] h-[34px] pl-11 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " 
                                value={ruleEngineState[index][groups[index]][tripType][policy][types[0]][unit]??''}
                                placeholder='maximum amount'
                                />
                            <p className="absolute left-6 top-2 text-black text-sm font-normal font-cabin">{symbol}</p>
                        </div>}

                        {symbol==null && <div className="relative text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                            <input
                                onChange={(e)=>handleAmountChange(index,e)} 
                                className=" w-full h-full decoration:none w-[172px] h-[34px] px-6 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " 
                                value={ruleEngineState[index][groups[index]][tripType][policy][types[0]][unit]??''}
                                placeholder={placeholder}
                                /></div>}
                        
                         </div>
                </div>)}
            </div>}

            {types[0]== 'text' && types[0]!= 'permission' && <div className='flex flex divide-x flex-wrap'>
                {groups.map((group,index)=> 
                
                <div key={index} className='div flex w-[337px] h-[178px] flex-col gap-3 px-6 items-center justify-center'>
                    <div key={index} className='text inline-flex w-[132px] text-sm tracking-tight text-zinc-500 font-normal font-cabin'>{group}</div>
                   
                    <div className="relative text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                        <textarea
                            onChange={(e)=>handleAmountChange(index,e)} 
                            className=" w-full h-full decoration:none w-[289px] h-[135px] p-4 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " 
                            value={ruleEngineState[index][groups[index]][tripType][policy][types[0]][unit]}
                            placeholder={placeholder}
                            />
                    </div>    

                </div>)}

            

            </div>}
            
            {types[0] == 'permission' && <div className='flex flex-col gap-3 flex-wrap'>
                {groups.map((group,index)=> 
                
                <div key={index} className='div inline-flex w-[337px] gap-3 px-6 items-center justify-center'>
                    <div key={index} className='text inline-flex w-[132px] text-sm tracking-tight text-zinc-500 font-normal font-cabin'>{group}</div>
                    <div>
                        <Switch 
                            label = {'Allow'}
                            isChecked= {ruleEngineState[index][groups[index]][tripType][policy][types[0]].allowed} 
                            setIsChecked = {(checked)=>{
                                const ruleEngineState_copy = JSON.parse(JSON.stringify(ruleEngineState))
                                ruleEngineState_copy[index][groups[index]][tripType][policy][types[0]].allowed = checked
                                setRuleEngineState(ruleEngineState_copy)
                            }} 
                            />
                    </div>
                </div>)}

            </div>}

        </div>
    </>)
}

function ApprovalSetup(props){
    const groups = props.groups || ['Executives', 'Managers', "VC's"]
    const tripType = props.tripType
    const policy = props.policy
    const ruleEngineState = props.ruleEngineState
    const setRuleEngineState = props.setRuleEngineState

    const handleSelect = (options, index)=>{
        console.log(options)
        const ruleEngineState_copy = JSON.parse(JSON.stringify(ruleEngineState))
        ruleEngineState_copy[index][groups[index]][tripType][policy]['approval']['approvers'] = options
        setRuleEngineState(ruleEngineState_copy)
    }

    return(<>
        <div className='py-6 px-auto'>

            {<div className='flex flex divide-x flex-wrap'>
                {groups.map((group,index)=> 
                
                <div key={index} className='div flex w-[337px] h-[110px] flex-col gap-3 px-6 items-center justify-center'>
                    <div key={index} className='text inline-flex w-[132px] text-sm tracking-tight text-zinc-500 font-normal font-cabin'>{group}</div>
                   
                    <div className="relative text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                        <MultiSelect 
                            title='Who needs to approve this group?'
                            placeholder='Approval flow'
                            currentOption={ruleEngineState[index][groups[index]][tripType][policy]['approval']['approvers']}
                            options={['L1', 'L2', 'L3', 'Finance']}
                            onSelect={(options)=>handleSelect(options, index)}
                            />
                    </div>    

                </div>)}

            </div>}


        </div>
    </>)

}

function Policy(props){
    const title = props.title || 'Title'
    const [collapse, setCollapse] = useState(true)
    const tripType = props.tripType 
    const ruleEngineState = props.ruleEngineState
    const setRuleEngineState = props.setRuleEngineState
    const savePolicies = props.savePolicies
    const currencySymbol = props.currencySymbol
    const networkStates = props.networkStates
    const tabIndex = props.tabIndex
    const activeTabIndex = props.activeTabIndex
    const setActiveTabIndex = props.setActiveTabIndex
    const expandedTab = props.expandedTab
    const setExpandedTab = props.setExpandedTab

    const [fieldsPresent, setFieldsPresent] = useState(false)
    let types = Object.keys(ruleEngineState[0][Object.keys(ruleEngineState[0])[0]][tripType][title])

    let indexOfFileds = types.indexOf('fields')
    if(indexOfFileds){
     //   types.splice(indexOfFileds, 1)
     //   setFieldsPresent(true)
    }

    const [byClass, setByClass] = useState(types.includes('class')? true : false)
    const [byBudget, setByBudget] = useState((types.includes('class'))? false : true)
    const [approvalSetup, setApprovalSetup] = useState(types.includes('approval')? true: false)

    const selectPolicyType = (type)=>{
        if(type.includes('byClass')){
            setByClass(true)
            setByBudget(false)
        }else{
            setByClass(false)
            setByBudget(true)
        }
    }

    const groups = ruleEngineState.map(item=>Object.keys(item)[0])

    //for non-amount based
    let values = []
    let fields = []

    if(types.includes('class')){
        values = Object.keys(ruleEngineState[0][Object.keys(ruleEngineState[0])][tripType][title]['class'])
    }

    const handleExpandedTab = ()=>{
        if(collapse){
            setExpandedTab(tabIndex)
        }
        else{
            setExpandedTab(-1)
        }
    }


    useEffect(()=>{
        if(expandedTab != tabIndex){
            setCollapse(true)
        }else{
            setCollapse(false)
        }
    }, [expandedTab])

    return (
        <motion.div 
            animate={{
                maxHeight: collapse? '75px' : '100000px'
            }}
            transition={{
                ease : 'linear',
            }}
            className={`w-full p-6  ${collapse? 'max-h-[75px] z-[20]' : 'max-h-[100000px] z-[50]'} bg-white rounded-xl border border-neutral-200`}>
            <div onClick={handleExpandedTab} className="w-full relative bg-white cursor-pointer">
                <div className="flex justify-between items-center">
                    
                    <div className="justify-start items-center gap-8 inline-flex">
                        <div className="justify-start items-center gap-6 flex">
                            <div className="text-neutral-700 text-base font-medium font-cabin tracking-tight">{title}</div>
                        </div>
                    </div>

                    <div className="justify-start gap-12 items-start gap-2 inline-flex">
                        <div className={`w-6 h-6 transition ${collapse? '' : 'rotate-180' }`}>
                            <img src={arrow_down} />
                        </div>
                    </div>

                </div>
            </div>

            <motion.div 
                initial={{
                    maxHeight: collapse? '0px' : '100000px'
                }}
                animate={{
                    maxHeight: collapse? '0px' : '100000px'
                }}
                transition={{
                    ease : 'linear',
                }}
                className={`${collapse? 'max-h-0 h-0 hidden': 'max-h-[10000px]'} `}>
            {!approvalSetup && types.includes('class') && types.includes('limit') &&
                <div>
                    {/* by class, by budget*/}
                    <div className="w-fit h-6 justify-start items-center gap-4 inline-flex mt-5">
                        <div onClick={()=>{selectPolicyType('byClass')}} className={`${ byClass? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer`}>By Class </div>
                        <div onClick={()=>selectPolicyType('byBudget')} className={`${ byBudget? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer `}>By Budget</div>
                    </div> 
                    <hr className='mt-2'/>
                </div>}

            {/* table */}
            {!approvalSetup && byClass && 
                <div className={`w-full h-fit bg-white transition-max-height  ${collapse? 'hidden max-height-0': 'max-height-[10000px]' }`} >
                    {/* table */}
                    <div className='mt-10'>
                        <ClassTable tripType={tripType} policy={title} groups={groups} values={values} ruleEngineState={ruleEngineState} setRuleEngineState={setRuleEngineState} />
                    </div>
                </div>}

            {!approvalSetup && byBudget && 
            <div className={`w-full h-fit bg-white transition-opacity transition-max-height delay-1000  ${collapse? 'hidden opacity-0 max-height-0': 'opacity-100 max-height-[10000px]' }`} >
                {/* table */}
                <div className='mt-10'>
                    <AmountTable currencySymbol={currencySymbol} tripType={tripType} types={types} policy={title} groups={groups} ruleEngineState={ruleEngineState} setRuleEngineState={setRuleEngineState} />
                </div>
            </div>}

            {approvalSetup && 
                <div className={`w-full h-fit bg-white transition-opacity transition-max-height delay-1000  ${collapse? 'hidden opacity-0 max-height-0': 'opacity-100 max-height-[10000px]' }`} >
                    <div className='mt-10'>
                        <ApprovalSetup tripType={tripType} policy={title} groups={groups} ruleEngineState={ruleEngineState} setRuleEngineState={setRuleEngineState}/>
                    </div>
                </div> }
        
            <div className='mt-4 float-right'>
                {/* <HollowButton 
                    isLoading={networkStates.isUploading && activeTabIndex == tabIndex}
                    title='Save Policies' 
                    onClick={()=>{setActiveTabIndex(tabIndex); savePolicies()}} /> */}
            </div>

            </motion.div>
        </motion.div>)
      
}