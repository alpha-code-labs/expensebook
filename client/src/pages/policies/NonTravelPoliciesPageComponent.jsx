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
import Button from '../../components/common/Button'
import MultiSelect from '../../components/common/MultiSelect'
import axios from 'axios'
import Modal from '../../components/common/Modal'
import Select from '../../components/common/Select'
import remove_icon from '../../assets/XCircle.svg'
import close_icon from "../../assets/close.svg"
import UploadAdditionalHeaders from '../expenseAllocations/UploadAdditionalHeaders'
import { getTenantOrgHeaders_API, updateFormState_API, updateNonTravelAllocation_API, updateNonTravelPolicies_API } from '../../utils/api'


export default function (props) {
    const [ruleEngineState, setRuleEngineState] = [props.ruleEngineState, props.setRuleEngineState]
    const tenantId = props.tenantId
    const travelType = props.travelType
    const icon = switchIcon(travelType)
    const [showAddExpenseCategoriesModal, setShowAddExpenseCategoriesModal] = useState(false)

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
                    return 'Vendor Payments'
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
    },[ruleEngineState] )

    const savePolicies = ()=>{
        //save policies to backend
        axios.post(`import.meta.VITE_PROXY_URL/tenant/${tenantId}/policies/non-travel`, {policies:ruleEngineState})
        .then(res=>{
            console.log(res.data)
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

    const savePolicyAndAllocationHeaders = async()=>{
        setIsUploading(true)
        const allocation_res = await updateNonTravelAllocation_API({tenantId, allocationHeaders: selectedOrgHeaders})
        if(allocation_res.err){
            console.log(err)
            return
        }

        const policies_res = await updateNonTravelPolicies_API({tenantId, policies:ruleEngineState})

        if(policies_res.err){
            console.log(res.err)
            return
        }

        alert('Changes Saved !')
        setIsUploading(false)
        //update non-travel expense allocations
    } 

    const [expenseCategoryName, setExpenseCategoryName] = useState(null)
    const [expenseCategoryFields, setExpenseCategoryFieds] = useState([])
    const [existingCategory, setExistingCategory] = useState(false)
    const [existingCategoryName, setExistingCategoryName] = useState(null)
    const [orgHeaders, setOrgHeaders] = useState([])
    const [selectedOrgHeaders, setSelectedOrgHeaders] = useState([])
    const [presentFieldLength, setPresentFieldLength] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    
    //###File upload related
    const [showAddHeaderModal, setShowAddHeaderModal] = useState(false)
    const [updatedOrgHeadeers, setUpdatedOrgHeaders] = useState([])

    useEffect(()=>{
        if(showAddHeaderModal){
            document.body.style.overflow = 'hidden'
        }
        else{
            document.body.style.overflow = 'visible'
        }

    },[showAddHeaderModal])
    //##File upload related --- end
    useEffect(()=>{
        (async function(){
            const res = await getTenantOrgHeaders_API({tenantId})
            if(res.err){
                console.log(err)
                //handle error
            }
            else{
                console.log(res.data, '...res.data')
                let orgHeadersData = res.data.orgHeaders
                let tmpOrgHeaders = []
                Object.keys(orgHeadersData).forEach(key => {
                if(orgHeadersData[key].length !== 0){
                    tmpOrgHeaders.push({headerName:key, headerValues: orgHeadersData[key]})
                }
                })
        
                console.log(tmpOrgHeaders, '...tmpOrgHeaders')
                setOrgHeaders(tmpOrgHeaders)
            }

        })()
    },[])

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

            const res = await axios.post(`import.meta.VITE_PROXY_URL/tenant/${tenantId}/policies`, {policies:ruleEngineState_copy})

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

    const handleCategoryFieldNameChange = (e, index)=>{
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
        setPresentFieldLength(fields.length)
        console.log('present field length', fields.length)
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

        if(expenseCategoryFields.some(category=> category.name == '' || category.name == undefined || category.type == '' || category.type == undefined)){
            alert('Please provide filed name and field type')
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

            // const res = await axios.post(`import.meta.VITE_PROXY_URL/tenant/${tenantId}/policies/non-travel`, {policies:ruleEngineState_copy})
            const res = await updateNonTravelPolicies_API({tenantId, policies:ruleEngineState_copy})

            alert(`${existingCategory? 'category updated!' : 'category added'}`)
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

    const handleAllocationHeaderChange = async (e, categoryName, index)=>{
        console.log(e.target.checked, index)
        let selectedOrgHeaders_copy = JSON.parse(JSON.stringify(selectedOrgHeaders))
        if(e.target.checked){
            const indexOfCategory = selectedOrgHeaders.findIndex(category=>category.categoryName.toLowerCase() == categoryName.toLowerCase())
            if(indexOfCategory > -1){
                const indexOfElement = selectedOrgHeaders[indexOfCategory].allocations.findIndex(header=>header.headerName.toLowerCase() == orgHeaders[index].headerName.toLowerCase())
                console.log(indexOfElement, 'ioe')
                if(indexOfElement>-1) return
                selectedOrgHeaders_copy[indexOfCategory].allocations.push(orgHeaders[index])
            }
            else{
                selectedOrgHeaders_copy.push({categoryName, allocations:[{...orgHeaders[index]}]})
            }
            
            console.log(orgHeaders[index])

        }
        else{
            const indexOfCategory = selectedOrgHeaders.findIndex(category=>category.categoryName.toLowerCase() == categoryName.toLowerCase())
            const indexOfElement = selectedOrgHeaders[indexOfCategory].allocations.findIndex(header=>header.headerName.toLowerCase() == orgHeaders[index].headerName.toLowerCase())
            if(indexOfElement<0) return
            selectedOrgHeaders_copy[indexOfCategory].allocations = selectedOrgHeaders[indexOfCategory].allocations.filter((_,ind)=> ind!=indexOfElement)
        }

        console.log(selectedOrgHeaders_copy)
        setSelectedOrgHeaders(selectedOrgHeaders_copy)
    }

    const handleSaveAsDraft = async ()=>{
        //everhting should be already updated. Just update the form state
        const res = updateFormState_API({tenantId, state:'/non-travel-expenses/setup'})
        window.location.href = 'https://google.com'
    }

    const handleContinue = async ()=>{
        const res = updateFormState_API({tenantId, state: '/others'})
        //naviage to others section
        navigate(`/${tenantId}/others`)
    }

    useEffect(()=>{
        if(updatedOrgHeadeers.length>0){
            setOrgHeaders(updatedOrgHeadeers)
        }
    },[updatedOrgHeadeers])

    return(<>
        <Icon />
        {
        <div className="bg-slate-50 min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
            <div className='px-6 py-10 bg-white rounded shadow'>               
               
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
                                return (<Policy key={index} handleEditFields={handleEditFields} isUploading={isUploading} savePolicies={savePolicyAndAllocationHeaders} title={policy} tripType={travelType} ruleEngineState={ruleEngineState} setRuleEngineState={setRuleEngineState} selectedOrgHeaders={selectedOrgHeaders} orgHeaders={orgHeaders} handleAllocationHeaderChange={handleAllocationHeaderChange} setShowAddHeaderModal={setShowAddHeaderModal} />)
                            }
                        }
                    )}
                     
                    <div className='mt-6'>
                        <HollowButton title='Add Expense Categories' onClick={()=>{setExistingCategory(false); setShowAddExpenseCategoriesModal(true)}} />
                    </div>
                    
                    <div className='flex justify-between mt-10'>
                        <Button text='Save As Draft' onClick={handleSaveAsDraft} />
                        <Button text='Continue' onClick={handleContinue} />
                    </div>
                </div>

            </div>
        </div>}
        
        {showAddHeaderModal && 
        <UploadAdditionalHeaders 
            showAddHeaderModal={showAddHeaderModal} 
            tenantId={tenantId}
            setUpdatedOrgHeaders={setUpdatedOrgHeaders}
            setShowAddHeaderModal={setShowAddHeaderModal} />}

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
                                    <Input  showTitle={false} placeholder='eg. Amount' value={field.name} onChange={(e)=>{handleCategoryFieldNameChange(e, index)}} readOnly={index<presentFieldLength?true:false} />
                                    <select value={field.type} disabled={index<presentFieldLength?true:false} onChange={e=>handleCategoryFieldTypeChange(e,index)} className='min-w-[200px] w-full md:w-fit max-w-[403px] h-[45px] flex-col justify-start items-start gap-2 inline-flex px-6 py-2 text-neutral-700 w-full  h-full text-sm font-normal font-cabin border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600'>
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
    const savePolicies = props.savePolicies
    const handleEditFields = props.handleEditFields
    const handleAllocationHeaderChange = props.handleAllocationHeaderChange
    const orgHeaders = props.orgHeaders
    const selectedOrgHeaders = props.selectedOrgHeaders
    const setShowAddHeaderModal = props.setShowAddHeaderModal
    const isUploading = props.isUploading??false

    const [fieldsPresent, setFieldsPresent] = useState(false)

    let types = Object.keys(ruleEngineState[0][Object.keys(ruleEngineState[0])[0]][tripType][title])
    let indexOfFileds = types.indexOf('fields')
    if(indexOfFileds){
     //   types.splice(indexOfFileds, 1)
     //   setFieldsPresent(true)
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
        <div className={`w-full p-6 transition-max-height duration-1000 ${collapse? 'max-h-[75px]' : 'max-h-[2000px]'} bg-white rounded-xl border border-neutral-200 font-cabin`}>
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
            { 
            <div className={`w-full h-fit bg-white transition-opacity transition-max-height delay-1000  ${collapse? 'hidden opacity-0 max-height-0': 'opacity-100 max-height-[1000px]' }`} >
                <div className='mt-10'>
                    <p className='text-neutral-800 text-base'>Captured Fields</p>
                    <div className='flex gap-2 divide-x'>
                        {fields.map((field, fieldIndex)=>
                            <div key={fieldIndex} className='flex gap-4 pl-1 items-center'>
                                <p className='text-neutral-700 text-sm font-cabin'>{field.name}</p>
                                {/* <img className='w-4 h-4 cursor-pointer' src={close_icon} onClick={()=>removeField(index)} /> */}
                            </div>
                        )}
                    </div>
                </div>

                {
                    types.includes('fields') && 
                    <div className='mt-4 w-fit h-10 inline-flex items-center'>
                        <p className='text-indigo-600 font-cabin text-sm cursor-pointer' onClick={()=>handleEditFields({category:title, fields})}> Add / Remove Captured Fields</p>
                    </div>
                }

                {/* table */}
                <div className='mt-10 text-base text-neutral-800'>Set Limit</div>
                <div className='mt-2'>
                    <AmountTable tripType={tripType} types={types} policy={title} groups={groups} ruleEngineState={ruleEngineState} setRuleEngineState={setRuleEngineState} />
                </div>
                </div>}
                
                <ExpenseAllocation orgHeaders={orgHeaders} setShowAddHeaderModal={setShowAddHeaderModal} handleAllocationHeaderChange={handleAllocationHeaderChange} title={title} />

            <div className='mt-4 flex flex-row-reverse'>
                <HollowButton title='Save Changes' isLoading={isUploading} onClick={()=>savePolicies()} />
            </div>

            </div>
        </div>)
      
}

function ExpenseAllocation({orgHeaders, setShowAddHeaderModal, handleAllocationHeaderChange, title}){
    return(<>
        {orgHeaders.length>0 && 
        <div className='mt-10'>
            <p className='text-base text-neutral-800'>Allocate Expenses for this category</p>
            <p className='text-sm text-neutral-600'>We have identified following entities on which you might be allocating non-Travel Expenses</p>
            <div className='flex flex-col gap-1 mt-2'>
                {orgHeaders.map((header, headerIndex) => 
                <div key={headerIndex} className='flex items-center justify-between'>
                    <p className='text-sm flex-1 text-neutral-700'>{header.headerName}</p>
                    <div className='flex-1 inline-flex'>
                        <Checkbox onChange={(e)=>handleAllocationHeaderChange(e, title, headerIndex)} />
                    </div>
                </div>)}
            </div>

            <div className='mt-4 w-fit h-10 inline-flex items-center'>
                <p className='text-indigo-600 font-cabin text-sm cursor-pointer' onClick={()=>setShowAddHeaderModal(true)}> Add additional org level entities</p>
            </div>
        </div>}
    </>)
}