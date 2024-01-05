import internatinal_travel_icon from '../../assets/in-flight.svg'
import domestic_travel_icon from '../../assets/briefcase.svg'
import local_travel_icon from '../../assets/map-pin.svg'
import non_travel_icon from '../../assets/paper-money-two.svg'

import back_icon from '../../assets/arrow-left.svg'
import Icon from '../../components/common/Icon';
import arrow_down from "../../assets/chevron-down.svg";
import { useState, useEffect, useRef } from 'react';
import Checkbox from '../../components/common/Checkbox';
import check_icon from '../../assets/check.svg'
import cross_icon from '../../assets/x.svg'
import Input from '../../components/common/Input';
import HollowButton from '../../components/common/HollowButton';
import Button from '../../components/common/Button'
import MultiSelect from '../../components/common/MultiSelect'
import axios from 'axios'
import Modal from '../../components/common/Modal'
import { EmitFlags } from 'typescript'
import Select from '../../components/common/Select'
import remove_icon from '../../assets/XCircle.svg'
import { updateFormState_API } from '../../utils/api'

export default function (props) {
    const [ruleEngineState, setRuleEngineState] = [props.ruleEngineState, props.setRuleEngineState]
    const tenantId = props.tenantId
    const travelType = props.travelType
    const icon = switchIcon(travelType)
    const [showAddExpenseCategoriesModal, setShowAddExpenseCategoriesModal] = useState(false)
    const setShowPolicyType = props.setShowPolicyType

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
    
    const [policies, setPolicies] = useState([])

    useEffect(()=>{
        const policies = []
        if(ruleEngineState?.length>0){
            Object.keys(ruleEngineState[0][Object.keys(ruleEngineState[0])[0]][travelType]).map(item=>policies.push(item))
        }
        setPolicies(policies)
    },[ruleEngineState] )

    const savePolicies = async ()=>{
        //save policies to backend
        axios.post(`http://localhost:8001/api/tenant/${tenantId}/policies/travel`, {policies:ruleEngineState})
        .then(res=>{
            console.log(res.data)
            updateFormState_API({tenantId, state:'/setup-company-policies'})
            alert('Changes Saved')
        })
        .catch(error=>{
            if(error.response){
                console.log(error.response.error)
            }
            else if(error.request){
                console.log('server error')
            }   
            else{
                //can not place request
                console.log('can not place request')
            }
        })
    }

    const [expenseCategoryName, setExpenseCategoryName] = useState(null)
    const [expenseCategoryFields, setExpenseCategoryFieds] = useState([])
    const [existingCategory, setExistingCategory] = useState(false)
    const [existingCategoryName, setExistingCategoryName] = useState(null)


    useEffect(()=>{
        console.log(expenseCategoryName)
        console.log(expenseCategoryFields)

    }, [expenseCategoryFields, expenseCategoryName])

    const addCategoryField = ()=>{
        setExpenseCategoryFieds(prev=>[...prev, {name:'', type:''}])
    }

    const handleCategoryNameChange = (e)=>{
       // console.log(e.target.value)
        setExpenseCategoryName(e.target.value)
    }

    const handleAddCategory = async ()=>{
        if(expenseCategoryName==null || expenseCategoryName==''){
            alert('Please provide expense category name e.g Office Supplies')
            return
        }
        if(expenseCategoryFields.length==0){
            alert('Please add atleast one field to continue')
            return
        }

        //update existing category
        const ruleEngineState_copy = JSON.parse(JSON.stringify(ruleEngineState))
        const groupsCount = Object.keys(ruleEngineState_copy)

        try{
            groupsCount.forEach(index=>{
                console.log(index)
                const group = Object.keys(ruleEngineState_copy[index])[0]
                console.log(group)

            const limitContent =  {amount:'', currency:'', violationMessage:''}
            
                ruleEngineState_copy[index][group]['nonTravel'] = {...ruleEngineState_copy[index][group]['nonTravel'], [expenseCategoryName]:{['limit']:limitContent, ['fields']:expenseCategoryFields} }
            })

            console.log(ruleEngineState_copy)
            setRuleEngineState(ruleEngineState_copy)
            setShowAddExpenseCategoriesModal(false)

            const res = await axios.post(`http://localhost:8001/api/tenant/${tenantId}/policies`, {policies:ruleEngineState_copy})

            alert('category added')
        }
        catch(e){
            if(e.response){
                console.error(e.response.data)
            }
            if(e.request){
                console.error('Internal server error', e)
            }
            else{
                console.error('something went wrong, please try later', e)
            }
        }

        setExpenseCategoryFieds([])
        setExistingCategoryName(null)
        setExistingCategory(false)
        setExistingCategoryName(null)

    }

    const removeCategoryField = (index)=>{
        console.log(index, 'index...')
        const expenseCategoryFields_copy = JSON.parse(JSON.stringify(expenseCategoryFields))
        expenseCategoryFields_copy.splice(index,1)
        console.log(expenseCategoryFields_copy)
        setExpenseCategoryFieds(expenseCategoryFields_copy)
    }

    const handleCategoryFieldNameChang = (e, index)=>{
        let expenseCategoryFields_copy = JSON.parse(JSON.stringify(expenseCategoryFields))
        expenseCategoryFields_copy[index].name = e.target.value
        setExpenseCategoryFieds(expenseCategoryFields_copy)
    }

    const handleCategoryFieldTypeChange = (e, index)=>{
        let expenseCategoryFields_copy = JSON.parse(JSON.stringify(expenseCategoryFields))
        expenseCategoryFields_copy[index].type = e.target.value
        setExpenseCategoryFieds(expenseCategoryFields_copy)
    }

    const handleEditFields = ({category, fields})=>{
        setExistingCategory(true)
        setExistingCategoryName(category)
        setExpenseCategoryName(category)
        setExpenseCategoryFieds(fields)
        setShowAddExpenseCategoriesModal(true)
    }

    const handleEditCategory = async ()=>{
        
        if(expenseCategoryName==null || expenseCategoryName==''){
            alert('Please provide expense category name e.g Office Supplies')
            return
        }
        if(expenseCategoryFields.length==0){
            alert('Please add atleast one field to continue')
            return
        }
 
        try{
                //update existing category
            const ruleEngineState_copy = JSON.parse(JSON.stringify(ruleEngineState))
            const groupsCount = Object.keys(ruleEngineState_copy)
            groupsCount.forEach(index=>{
                console.log(index)
                const group = Object.keys(ruleEngineState_copy[index])[0]
                console.log(group)

            const currentLimitContent =  ruleEngineState_copy[index][group]['nonTravel'][existingCategoryName]['limit'] 
            
                
            if(existingCategoryName.toLowerCase() === expenseCategoryName.toLowerCase()){
                ruleEngineState_copy[index][group]['nonTravel'][existingCategoryName]['fields'] = expenseCategoryFields
            }

            else{
                delete ruleEngineState_copy[index][group]['nonTravel'][existingCategoryName]
                ruleEngineState_copy[index][group]['nonTravel'] = {...ruleEngineState_copy[index][group]['nonTravel'], [expenseCategoryName]:{['limit']:currentLimitContent, ['fields']:expenseCategoryFields} }
            }
            })

            console.log(ruleEngineState_copy)
            setRuleEngineState(ruleEngineState_copy)
            setShowAddExpenseCategoriesModal(false)

            const res = await axios.post(`http://localhost:8001/api/tenant/${tenantId}/policies`, {policies:ruleEngineState_copy})

            alert('category added')
        }
        catch(e){
            if(e.response){
                console.error(e.response.data)
            }
            if(e.request){
                console.error('Internal server error', e)
            }
            else{
                console.error('something went wrong, please try later', e)
            }
        }

        setExpenseCategoryFieds([])
        setExistingCategoryName(null)
        setExistingCategory(false)
        setExistingCategoryName(null)
    }

    return(<>
        {
        <div className="bg-slate-50 min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
            <div className='px-6 py-10 bg-white rounded shadow'>               
               {/* back button and title */}
                <div className='flex gap-4'>
                    <div className='w-6 h-6 cursor-pointer' onClick={()=>setShowPolicyType(null)}>
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
                                return (<Policy key={index} handleEditFields={handleEditFields} savePolicies={savePolicies} title={policy} tripType={travelType} ruleEngineState={ruleEngineState} setRuleEngineState={setRuleEngineState} />)
                            }
                        }
                    )}
                        { travelType==='nonTravel' && 
                            <div className='mt-6'>
                                <HollowButton title='Add Expense Categories' onClick={()=>{setExistingCategory(false); setShowAddExpenseCategoriesModal(true)}} />
                            </div>
                        }  
                </div>

            </div>
        </div>}
        
        {showAddExpenseCategoriesModal &&
        <div className="fixed  z-[1000]  overflow-hidden flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
            <div className='z-[10001] max-w-[600px] w-[90%] md:w-[75%] lg:w-[60%] min-h-[200px] scroll-none bg-white rounded-lg shadow-md'>
                <div className=' relative p-10 text text-neutral-400 text-xs font-cabin'>
                    {existingCategory? 'Edit Expense Category' : 'Add Expense Category'}

                    <div className='mt-4'>
                        <Input title='Category Name' value={expenseCategoryName} placeholder='eg. Utilities' onChange={handleCategoryNameChange} />
                        <hr className='my-2'/>
                        <div className='flex flex-col gap-2'>
                            {expenseCategoryFields.length>0 && expenseCategoryFields.map((field, index)=>(
                                <div key={index} className='flex flex-wrap gap-4 items-center'>
                                    <Input  showTitle={false} placeholder='eg. Amount' value={field.name} onChange={(e)=>{handleCategoryFieldNameChang(e, index)}} />
                                    <select value={field.type} onChange={e=>handleCategoryFieldTypeChange(e,index)} className='min-w-[200px] w-full md:w-fit max-w-[403px] h-[45px] flex-col justify-start items-start gap-2 inline-flex px-6 py-2 text-neutral-700 w-full  h-full text-sm font-normal font-cabin border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600'>
                                        <option value='default'>
                                            Select Type
                                        </option>
                                        <option value='text'>
                                            Text
                                        </option>
                                        <option value='amount'>
                                            Amount
                                        </option>
                                        <option value='number'>
                                            Number
                                        </option>
                                        <option value='days'>
                                            days
                                        </option>
                                        <option value='true/false'>
                                            True / False
                                        </option>
                                    </select>
                                    <img src={remove_icon} onClick={()=>removeCategoryField(index)} />
                                </div>
                            ))}
                        </div>
                    </div>


                <div className='flex flex-wrap mt-10 items-center justify-between'>
                    <div className='w-[200px] '>
                            <HollowButton title='Add Fields' onClick={()=>addCategoryField()} />
                        </div>
                        {!existingCategory && <div className='w-fit '>
                            <Button text='Add Category' onClick={handleAddCategory} />
                        </div>}
                        {existingCategory && <div className='w-fit '>
                            <Button text='Save Changes' onClick={handleEditCategory} />
                        </div> }
                </div>
                <div className='absolute top-4 right-4'>
                        <img className='cursor-pointer' src={cross_icon} 
                                onClick={()=>{
                                    setExpenseCategoryName(null) 
                                    setExpenseCategoryFieds([])
                                    setShowAddExpenseCategoriesModal(false)
                                }} />
                    </div>
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
    const handleEditFields = props.handleEditFields

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

    if(types.includes('fields')){
        fields = ruleEngineState[0][Object.keys(ruleEngineState[0])][tripType][title]['fields']
      //  console.log('fields..', fields)
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
            {!approvalSetup && types.length==2 && !types.includes('fields') &&
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
                <div className={`w-full h-fit bg-white transition-max-height  ${collapse? 'hidden max-height-0': 'max-height-[1000px]' }`} >
                    {/* table */}
                    <div className='mt-10'>
                        <ClassTable tripType={tripType} policy={title} groups={groups} values={values} ruleEngineState={ruleEngineState} setRuleEngineState={setRuleEngineState} />
                    </div>
                </div>}

            {!approvalSetup && byBudget && 
            <div className={`w-full h-fit bg-white transition-opacity transition-max-height delay-1000  ${collapse? 'hidden opacity-0 max-height-0': 'opacity-100 max-height-[1000px]' }`} >
                {/* table */}
                <div className='mt-10'>
                    <AmountTable tripType={tripType} types={types} policy={title} groups={groups} ruleEngineState={ruleEngineState} setRuleEngineState={setRuleEngineState} />
                </div>
            </div>}

            {approvalSetup && 
                <div className={`w-full h-fit bg-white transition-opacity transition-max-height delay-1000  ${collapse? 'hidden opacity-0 max-height-0': 'opacity-100 max-height-[1000px]' }`} >
                    <div className='mt-10'>
                        <ApprovalSetup tripType={tripType} policy={title} groups={groups} ruleEngineState={ruleEngineState} setRuleEngineState={setRuleEngineState}/>
                    </div>
                </div> }
                
           {types.includes('fields') && 
            <div className='mt-4 w-fit h-10 inline-flex items-center float-left'>
                <p className='text-indigo-600 font-cabin text-sm cursor-pointer' onClick={()=>handleEditFields({category:title, fields})}>Edit Category name/captured fields</p>
            </div>}

            <div className='mt-4 float-right'>
                <HollowButton title='Save Policies' onClick={()=>savePolicies()} />
            </div>

            </div>
        </div>)
      
}