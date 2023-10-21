import internatinal_travel_icon from '../../assets/in-flight.svg'
import domestic_travel_icon from '../../assets/briefcase.svg'
import local_travel_icon from '../../assets/map-pin.svg'
import non_travel_icon from '../../assets/paper-money-two.svg'

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


export default function (props) {
    const [ruleEngineState, setRuleEngineState] = [props.ruleEngineState, props.setRuleEngineState]
    
    const travelType = props.travelType
    const icon = switchIcon(travelType)
    

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
        if(ruleEngineState.length>0){
            Object.keys(ruleEngineState[0][Object.keys(ruleEngineState[0])[0]][travelType]).map(item=>policies.push(item))
        }
        setPolicies(policies)
    },[] )

    return(<>
        { <div className="bg-slate-50 px-[104px] py-20">
            <Icon/>
            <div className='px-6 py-10 bg-white mt-6 rounded shadow'>
               
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
                                return (<Policy key={index} title={policy} tripType={travelType} ruleEngineState={ruleEngineState} setRuleEngineState={setRuleEngineState} />)
                            }
                        }
                    )}
                             
                </div>

            </div>
        </div>}
        
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
    
        return(<>
            {/* rest of the rows */}
            <div className='flex justify-content divide-x'>
                <div className={`w-[${colWidth}] p-2 text-zinc-500 text-sm font-normal font-cabiin tracking-tight`} >{`${value} :`}</div>
                {groups.map((group,groupIndex)=><div key={groupIndex} className={`w-[${colWidth}] inline-flex justify-center items-center p-2 text-zinc-500 text-sm font-normal font-cabiin tracking-tight`} >

                    { ruleEngineState[groupIndex][groups[groupIndex]][tripType][policy]['class'][values[valIndex]].allowed ? <CheckIcon onClick={()=>handleCellState(groupIndex,valIndex)}/> : <CrossIcon onClick={()=>handleCellState(groupIndex,valIndex)}/>}
                </div>)}
            </div>

        </>)
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
            setSymbol('₹')
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
            
            {types[0]!= 'text' && <div className='flex flex-col gap-6'>
                {groups.map((group,index)=> <div key={index} className='flex gap-32 items-center'>
                    <div key={index} className='text inline-flex w-[132px] text-sm tracking-tight text-zinc-500 font-normal font-cabin'>{group}</div>
                    <div> 
                            {symbol!=null && <div className="relative text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                            <input
                                onChange={(e)=>handleAmountChange(index,e)} 
                                className=" w-full h-full decoration:none w-[172px] h-[34px] pl-11 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " 
                                value={ruleEngineState[index][groups[index]][tripType][policy][types[0]][unit]}
                                />
                            <p className="absolute left-6 top-2 text-black text-sm font-normal font-cabin">{symbol}</p>
                        </div>}

                        {symbol==null && <div className="relative text-neutral-700 w-full  h-full text-sm font-normal font-cabin">
                            <input
                                onChange={(e)=>handleAmountChange(index,e)} 
                                className=" w-full h-full decoration:none w-[172px] h-[34px] px-6 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " 
                                value={ruleEngineState[index][groups[index]][tripType][policy][types[0]][unit]}
                                placeholder={placeholder}
                                /></div>}
                        
                         </div>
                </div>)}
            </div>}

            {types[0]== 'text' && <div className='flex flex divide-x flex-wrap'>
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


        </div>
    </>)
}


function Policy(props){
    const title = props.title || 'Title'
    const [collapse, setCollapse] = useState(true)
    const tripType = props.tripType 
    const ruleEngineState = props.ruleEngineState
    const setRuleEngineState = props.setRuleEngineState

    const types = Object.keys(ruleEngineState[0][Object.keys(ruleEngineState[0])[0]][tripType][title])

    const [byClass, setByClass] = useState(types.includes('class')? true : false)
    const [byBudget, setByBudget] = useState(types.includes('class')? false : true)

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

    if(types.includes('class')){
        values = Object.keys(ruleEngineState[0][Object.keys(ruleEngineState[0])]['international'][title]['class'])
    }

    return (
        <div className={`w-full p-6 transition-max-height duration-1000 ${collapse? 'max-h-[75px]' : 'max-h-[900px]'} bg-white rounded-xl border border-neutral-200`}>
            <div onClick={()=>setCollapse(pre=>!pre)} className="w-full relative bg-white cursor-pointer">
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

            <div className={`transition-max-height transition-all duration-1000 ${collapse? 'max-h-0 h-0 hidden': 'max-h-[1000px]'} `}>
            {types.length==2 &&
                <div>
                    {/* by class, by budget*/}
                    <div className="w-fit h-6 justify-start items-center gap-4 inline-flex mt-5">
                        <div onClick={()=>{selectPolicyType('byClass')}} className={`${ byClass? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer`}>By Class </div>
                        <div onClick={()=>selectPolicyType('byBudget')} className={`${ byBudget? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer `}>By Budget</div>
                    </div> 
                    <hr className='mt-2'/>
                </div>}

            {/* table */}
            {byClass && 
                <div className={`w-full h-fit bg-white transition-max-height  ${collapse? 'hidden max-height-0': 'max-height-[1000px]' }`} >
                    {/* table */}
                    <div className='mt-10'>
                        <ClassTable tripType={tripType} policy={title} groups={groups} values={values} ruleEngineState={ruleEngineState} setRuleEngineState={setRuleEngineState} />
                    </div>
                </div>}

            {byBudget && 
            <div className={`w-full h-fit bg-white transition-opacity transition-max-height delay-1000  ${collapse? 'hidden opacity-0 max-height-0': 'opacity-100 max-height-[1000px]' }`} >
                {/* table */}
                <div className='mt-10'>
                    <AmountTable tripType={tripType} types={types} policy={title} groups={groups} ruleEngineState={ruleEngineState} setRuleEngineState={setRuleEngineState} />
                </div>
            </div>}
                

            <div className='mt-4 float-right'>
                <HollowButton title='Save Policies' />
            </div>

            </div>
        </div>)
      
}