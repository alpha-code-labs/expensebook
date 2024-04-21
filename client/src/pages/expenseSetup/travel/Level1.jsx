import internatinal_travel_icon from '../../../assets/in-flight.svg'
import domestic_travel_icon from '../../../assets/briefcase.svg'
import local_travel_icon from '../../../assets/map-pin.svg'
import non_travel_icon from '../../../assets/paper-money-two.svg'
import back_icon from '../../../assets/arrow-left.svg'
import Icon from '../../../components/common/Icon';
import arrow_down from "../../../assets/chevron-down.svg";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Checkbox from '../../../components/common/Checkbox';
import check_icon from '../../../assets/check.svg'
import cross_icon from '../../../assets/x.svg'
import Input from '../../../components/common/Input';
import HollowButton from '../../../components/common/HollowButton';
import Button from '../../../components/common/Button'
import MultiSelect from '../../../components/common/MultiSelect'
import axios from 'axios'
import Modal from '../../../components/common/Modal'
import Select from '../../../components/common/Select'
import remove_icon from '../../../assets/XCircle.svg'
import close_icon from "../../../assets/close.svg"
import UploadAdditionalHeaders from '../../expenseAllocations/UploadAdditionalHeaders'
import { getTenantOrgHeaders_API, getTenantTravelAllocations_API, getTravelCategories_API, postProgress_API, postTenantTravelAllocations_API, postTravelCategories_API, updateFormState_API,  } from '../../../utils/api'
import expenseAllocations from '../../expenseAllocations/expenseAllocations'
import { camelCaseToTitleCase } from '../../../utils/handyFunctions'
import Prompt from '../../../components/common/Prompt'
import Error from '../../../components/common/Error'
import { expenseCategories } from '../../../data/expenseCategories'
import tooltip_icon from '../../../assets/tooltip.jpeg'
import LeftProgressBar from '../../../components/common/LeftProgressBar'
import Layout from '../../Layout'
import MainSectionLayout from '../../MainSectionLayout'

const travel_allocations = {
    allocation: [],
    expenseAllocation: [],
    allocation_accountLine: null,
    expenseAllocation_accountLine: null,
}

const defaultCategories = expenseCategories  
console.log(expenseCategories);

const fixedFields = ['Total Amount', 'Date', 'Class', 'Tax Amount', 'Tip Amount', 'Premium Amount', 'Cost', 'Total Cost', 'License Cost', 'Subscription Cost', 'Total Fare', 'Premium Cost']
  
export default function ({progress, setProgress, travelType}) {

    const {tenantId} = useParams()
    const [showAddExpenseCategoriesModal, setShowAddExpenseCategoriesModal] = useState(false)
    const [categories, setCategories] = useState(defaultCategories)
    const [orgSetup, setOrgSetup] = useState(false)

    useEffect(()=>{
        if(showAddExpenseCategoriesModal){
            document.body.style.overflow = 'hidden'
        }
        else document.body.style.overflow = 'auto'
    },[showAddExpenseCategoriesModal])
    
    const navigate = useNavigate()
    const [allocations, setAllocations] = useState({})

    const [expenseCategoryName, setExpenseCategoryName] = useState(null)
    const [expenseCategoryFields, setExpenseCategoryFields] = useState([])
    const [existingCategory, setExistingCategory] = useState(false)
    const [existingCategoryName, setExistingCategoryName] = useState(null)
    const [orgHeaders, setOrgHeaders] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const [prompt, setPrompt] = useState({showPrompt:false, promptMsg:null, success:false})
    const [networkStates, setNetworkStates] = useState({isLoading:false, isUploading:false, loadingErrMsg:null})
    
    useEffect(()=>{
        console.log(allocations)
    }, [allocations])
    

    //###File upload related
    const [showAddHeaderModal, setShowAddHeaderModal] = useState(false)
    const [updatedOrgHeaders, setUpdatedOrgHeaders] = useState([])

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
            setNetworkStates(pre=>({...pre, isLoading:true}))
            const res = await getTenantOrgHeaders_API({tenantId})
            const t_res = await getTenantTravelAllocations_API({tenantId})
            const cat_res = await getTravelCategories_API({tenantId})

            if(res.err || t_res.err || cat_res.err){
                console.log(res.err)
                const errorMsg = res.err
                setNetworkStates(pre=>({...pre, loadingErrMsg:errorMsg??t_res.err??cat_res.err}))
                //handle error
            }
            else{
                console.log(res.data, '...res.data')
                let orgHeadersData = res.data.orgHeaders
                let tmpOrgHeaders = []
                Object.keys(orgHeadersData).forEach(key => {
                    console.log(key, ' key ', orgHeadersData[key], ' orgHeaders values ', orgHeadersData[key].length, ' length')
                    if(orgHeadersData[key].length !== 0){
                        tmpOrgHeaders.push({headerName:key, headerValues: orgHeadersData[key]})
                    }
                })
        
                console.log(tmpOrgHeaders, '...tmpOrgHeaders')
                setOrgHeaders(tmpOrgHeaders)

                if(Object.keys(t_res.data.travelAllocations).length == 0)
                    setAllocations(travel_allocations)
                else setAllocations(t_res.data.travelAllocations)
                
                if(Object.keys(cat_res.data.travelExpenseCategories) == 0)
                    setCategories(defaultCategories)
                else setCategories(cat_res.data.travelExpenseCategories)

                setNetworkStates(pre=>({...pre, isLoading:false}))
            }

        })()
    },[])

    const addCategoryField = ()=>{
        setExpenseCategoryFields(prev=>[...prev, {name:'', type:''}])
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

        setCategories(pre=>[...pre, {categoryName:expenseCategoryName, fields:expenseCategoryFields}])
        
        setExpenseCategoryFields([])
        setExistingCategoryName(null)
        setExistingCategory(false)
        setExistingCategoryName(null)

    }

    const removeCategoryField = (index)=>{
        console.log(index, 'index...')
        setExpenseCategoryFields(pre=>pre.filter((_,ind)=> ind !=index ) )
        // const expenseCategoryFields_copy = JSON.parse(JSON.stringify(expenseCategoryFields))
        // expenseCategoryFields_copy.splice(index,1)
        // console.log(expenseCategoryFields_copy)
        // setExpenseCategoryFields(expenseCategoryFields_copy)
    }

    const handleCategoryFieldNameChange = (e, index)=>{
        let expenseCategoryFields_copy = JSON.parse(JSON.stringify(expenseCategoryFields))
        expenseCategoryFields_copy[index].name = e.target.value
        setExpenseCategoryFields(expenseCategoryFields_copy)
    }

    const handleCategoryFieldTypeChange = (e, index)=>{
        let expenseCategoryFields_copy = JSON.parse(JSON.stringify(expenseCategoryFields))
        expenseCategoryFields_copy[index].type = e.target.value
        setExpenseCategoryFields(expenseCategoryFields_copy)
    }

    const handleEditFields = ({category, fields})=>{
        setExistingCategory(true)
        setExistingCategoryName(category)
        setExpenseCategoryName(category)
        setExpenseCategoryFields(fields)
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

        if(expenseCategoryFields.some(field=> field.name == '' || field.name == undefined || field.type == '' || field.type == undefined)){
            alert('Please provide filed name and field type')
            return
        }

        console.log({categoryName:expenseCategoryName, fields:expenseCategoryFields})
        console.log({existingCategoryName: existingCategoryName})
        const categoryIndex = categories.findIndex(item=>item.categoryName == existingCategoryName)
        
        if(categoryIndex > -1){
            const categories_copy = JSON.parse(JSON.stringify(categories))
            //console.log(categories_copy[categoryIndex], 'category....' )
            categories_copy[categoryIndex].categoryName = expenseCategoryName 
            categories_copy[categoryIndex].fields =  expenseCategoryFields
            setCategories(categories_copy)  
        }
        
        // setCategories(pre=>([...pre, {categoryName: expenseCategoryName, fields: expenseCategoryFields} ]))
        setShowAddExpenseCategoriesModal(false)

        setExpenseCategoryFields([])
        setExistingCategoryName(null)
        setExistingCategory(false)
        setExistingCategoryName(null)
    }

    const handleSaveAsDraft = async ()=>{
        //everhting should be already updated. Just update the form state
        await saveChanges()

        const res = updateFormState_API({tenantId, state: '/setup-expense-book/travel/level1'})
        window.location.href = 'https://google.com'
    }

    const handleContinue = async ()=>{
        const res = await updateFormState_API({tenantId, state: '/setup-expense-book/travel/level1'})
        //naviage to others section
        navigate(`/${tenantId}/others`)
    }

    const saveCategories = async ()=>{
        //save updated categories
    }

    const saveChanges = async ()=>{
        //update categories
        setNetworkStates(pre=>({...pre, isUploading:true}))
        const cat_res = await postTravelCategories_API({tenantId, travelExpenseCategories: categories})
        const all_res = await postTenantTravelAllocations_API({tenantId, travelAllocations:allocations})
        const res = updateFormState_API({tenantId, state: '/setup-expense-book/travel/level1'})
        const progress_copy = JSON.parse(JSON.stringify(progress));

        progress_copy.sections['section 3'].subsections.forEach(subsection=>{
            if(subsection.name == 'Travel Allocations') subsection.completed = true;
        });

        progress_copy.sections['section 3'].subsections.forEach(subsection=>{
            if(subsection.name == 'Travel Allocations') subsection.completed = true;
        });

        const markCompleted = !progress_copy.sections['section 3'].subsections.some(subsection=>!subsection.completed)

        let totalCoveredSubsections = 0;
        progress_copy.sections['section 3'].subsections.forEach(subsection=>{
            if(subsection.completed) totalCoveredSubsections++;
        })

        progress_copy.sections['section 3'].coveredSubsections = totalCoveredSubsections; 

        if(markCompleted){
            progress_copy.sections['section 3'].state = 'done';
            progress_copy.maxReach = 'section 4';
        }else{
            progress_copy.sections['section 3'].state = 'attempted';
        }

        const progress_res = await postProgress_API({tenantId, progress: progress_copy})

        setProgress(progress_copy);

        setNetworkStates(pre=>({...pre, isUploading:false}))

        if(cat_res.err || all_res.err || progress_res.err ){
            setPrompt({showPrompt:true, promptMsg:'Can not update data at the moment. Please try again later'})
        }
        else{
            setPrompt({showPrompt:true, promptMsg:'Changes Saved Successfully'})
            setTimeout(()=>{
                navigate(`/${tenantId}/setup-expensebook`)
            }, 3000)
        }
    }

    //fetch entire allocations object
    useEffect(()=>{
        //axios call
        //for now dummy data
        console.log(travel_allocations[travelType], travelType)
        setAllocations(travel_allocations)
    },[])

    useEffect(()=>{
        if(Object.keys(updatedOrgHeaders).length>0){
            console.log()

            let orgHeadersData = updatedOrgHeaders
            let tmpOrgHeaders = []
            Object.keys(orgHeadersData).forEach(key => {
                console.log(key, ' key ', orgHeadersData[key], ' orgHeaders values ', orgHeadersData[key].length, ' length')
                if(orgHeadersData[key].length !== 0){
                    tmpOrgHeaders.push({headerName:key, headerValues: orgHeadersData[key]})
                }
            })
    
            console.log(tmpOrgHeaders, '...tmpOrgHeaders')
            setOrgHeaders(tmpOrgHeaders)
        }

        console.log(updatedOrgHeaders, 'updated org headers ...')
    },[updatedOrgHeaders])

    return(<>
    
    <MainSectionLayout>
        {networkStates.isLoading && <Error message={networkStates.loadingErrMsg} />}
        {!networkStates.isLoading && <>
        
        <div className='px-6 py-10 bg-white relative'>               
        {/* back button and title */}
        <div className='flex gap-4'>
                <div className='w-6 h-6 cursor-pointer' onClick={()=>navigate(-1)}>
                    <img src={back_icon} />
                </div>

                <div className='flex gap-2'>
                    <p className='text-neutral-700 text-base font-medium font-cabin tracking-tight'>
                        Setup Expense Book
                    </p>
                </div>

            </div>
            
            {/* rest of the section */}
            <div className='mt-10 flex flex-col gap-4'>  
            
            <Policy 
                categories={categories}
                setCategories={setCategories}
                handleEditFields={handleEditFields}  
                saveChanges={saveChanges} 
                categoryName={'Travel'}
                travelType={travelType} 
                allocations={allocations}
                setAllocations={setAllocations}
                orgHeaders={orgHeaders} 
                setShowAddHeaderModal={setShowAddHeaderModal} />

                <div className='flex justify-between mt-10'>
                    {/* <Button text='Save As Draft' onClick={handleSaveAsDraft} /> */}
                    <Button isLoading={networkStates?.isUploading} text='Save Changes' onClick={saveChanges} /> 
                </div>

            </div>

        </div>
    
        
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
                        <div className='flex flex-col gap-2 max-h-[200px] overflow-y-scroll'>
                            {expenseCategoryFields.length>0 && expenseCategoryFields.map((field, index)=>(
                                <div key={field.name} className='flex flex-wrap gap-4 items-center'>
                                    <Input  showTitle={false} placeholder='eg. Amount' value={field.name} onChange={(e)=>{handleCategoryFieldNameChange(e, index)}} readOnly={fixedFields.includes(field.name)} />
                                    <select value={field.type} disabled={fixedFields.includes(field.name)} onChange={(e)=>handleCategoryFieldTypeChange(e, index)} className='max-w-[200px] w-full md:w-fit max-w-[403px] h-[45px] flex-col justify-start items-start gap-2 inline-flex px-6 py-2 text-neutral-700 w-full  h-full text-sm font-normal font-cabin border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600'>
                                        <option value='default'>
                                            Select Type
                                        </option>
                                        <option value='text'>
                                            text
                                        </option>
                                        <option value='amount'>
                                            amount
                                        </option>
                                        <option value='number'>
                                            number
                                        </option>
                                        <option value='days'>
                                            days
                                        </option>
                                        <option value='days'>
                                            date
                                        </option>
                                        <option value='true/false'>
                                            true / false
                                        </option>
                                    </select>
                                    {!fixedFields.includes(field.name) && <img src={remove_icon} onClick={()=>setExpenseCategoryFields(pre=>pre.filter((_,ind)=>ind!=index))} />}
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
                                    setExpenseCategoryFields([])
                                    setShowAddExpenseCategoriesModal(false)
                                }} />
                    </div>
                </div>
            </div>
        </div>}
    
        <Prompt prompt={prompt} setPrompt={setPrompt} />

        </>}
    </MainSectionLayout>

  </>)

}


function Policy({
        allocations, 
        setAllocations, 
        categoryName,
        setShowAddHeaderModal,
        handleEditFields,
        categories,
        setCategories,
        orgHeaders,
        networkStates,
        setNetworkStates,
        saveChanges, 
        openAccordion, 
        setOpenAccordion})
        {
    
    const [collapse, setCollapse] = useState(false)
    const categoryDetails = allocations
    console.log(categoryName)
    const fields = categoryDetails?.fields

    const [cat, setCat] = useState(true)
    const [exp, setExp] = useState(false)
    
    const handleAccountLineChange = (type, value)=>{
        if(type == 'cat'){
            setAllocations(pre=>({...pre, allocation_accountLine:value}))
        }

        if(type == 'exp'){
            setAllocations(pre=>({...pre, expenseAllocation_accountLine:value}))
        }
    }

    const handleRemoveCategory = (category)=>{
        console.log(category, category.categoryName)
        const categories_copy = categories.filter(cat=>cat.categoryName != category.categoryName)
        setCategories(categories_copy)
    }

    return (
        <div className={`w-full p-6 transition-max-height duration-1000 ${collapse? 'max-h-[75px]' : 'max-h-[100000px]'} bg-white rounded-xl border border-neutral-200 font-cabin`}>
            <div className="w-full relative bg-white cursor-pointer">
                <div className="flex justify-between items-center">
                    
                    <div className="justify-start items-center gap-8 inline-flex">
                        <div className="justify-start items-center gap-6 flex">
                            <div className="text-neutral-700 text-base font-medium font-cabin tracking-tight">{categoryName}</div>
                        </div>
                    </div>

                    {/* <div className="justify-start gap-12 items-start gap-2 inline-flex">
                        <div className={`w-6 h-6 transition ${collapse? '' : 'rotate-180' }`}>
                            <img src={arrow_down} />
                        </div>
                    </div> */}

                </div>
            </div>

            <div className={`transition-max-height transition-all duration-1000 ${collapse? 'max-h-0 h-0 hidden': 'max-h-[100000px]'} `}>

            <div>
                {/* by class, by budget*/}
                <div className='relative'>
                    <div className="w-fit h-6 justify-start gap-2 items-center inline-flex mt-5">
                        <div onClick={()=>{setCat(true); setExp(false)}} className={`${ cat? 'text-zinc-100 bg-indigo-600 ' : 'text-zinc-500 bg-indigo-100' } px-2 py-1 rounded-sm text-sm font-medium font-cabin cursor-pointer`}>Travel Allocations</div>
                        <div onClick={()=>{setCat(false); setExp(true)}} className={`${ exp? 'text-zinc-100 bg-indigo-600 ' : 'text-zinc-500 bg-indigo-100' } px-2 py-1 rounded-sm text-sm font-medium font-cabin cursor-pointer `}>Travel Expense Allocations</div>
                    </div> 
                    <div className='absolute top-[21px] left-[290px] inline-flex items-center gap-1' >
                        <img src={tooltip_icon} className='w-4 h-4' />
                        <p className='text-sm text-neutral-500 font-cabin'>You can allocate travel and travel expenses seprately</p>
                    </div>
                </div>
                <hr className='mt-2'/>
            </div>
            
            <div className={`w-full h-fit bg-white transition-opacity transition-max-height delay-1000  ${collapse? 'hidden opacity-0 max-height-0': 'opacity-100 max-height-[10000px]' }`} >
            
                {/* account line */}
                
                { cat && 
                    <div className='mt-4 '>
                        <div className='relative'>
                            <Input
                                value={allocations.allocation_accountLine}
                                onChange={(e)=>handleAccountLineChange('cat', e.target.value)} 
                                placeholder={'eg. 54148888'}
                                title='Category Account Line' />

                            <div className='absolute top-[42px] left-[211px] flex items-center justify-center gap-1'>
                                <img src={tooltip_icon} className='w-4 h-4' />
                                <p className='text-sm text-neutral-500 font-cabin'>Optional</p>
                            </div>
                        </div>
                        <ExpenseAllocation type='cat' orgHeaders={orgHeaders} setShowAddHeaderModal={setShowAddHeaderModal} allocations={allocations} setAllocations={setAllocations} categoryName={categoryName} />
                    </div>
                }

                { exp && 
                    <div className='mt-4 '>
                        <div className='relative'>
                        <Input
                            value={allocations.expenseAllocation_accountLine} 
                            onChange={(e)=>handleAccountLineChange('exp', e.target.value)} 
                            placeholder={'eg. 54148888'}
                            title='Expense Account Line' />

                            <div className='absolute top-[42px] left-[211px] flex items-center justify-center gap-1'>
                                <img src={tooltip_icon} className='w-4 h-4' />
                                <p className='text-sm text-neutral-500 font-cabin'>Optional</p>
                            </div>
                        </div>
                        
                        <ExpenseAllocation type="exp" orgHeaders={orgHeaders} setShowAddHeaderModal={setShowAddHeaderModal} allocations={allocations} setAllocations={setAllocations} categoryName={categoryName} />
                    </div>
                }

            </div>

                <hr className='py-6' />

                <div className='flex flex-col gap-2'>
                    <details>
                        <summary className='font-cabin text-neutral-700 bt-4'>Categories and Captured Fields</summary>
                        {categories.length>0 && categories.map((category, index)=>(
                            
                            <div key={`${category.categoryName}-${index}`} className='border border-neutral-300 px-4 py-2 rounded'>
                        
                                <div className='mt-2 flex flex-col flex-wrap  gap-4 '>
                                    <div className='flex flex-row items-center gap-2'>
                                        <p className='text-neutral-600 text-sm font-cabin'>{'Category Name:'}</p>
                                        <p className='text-neutral-700 text-sm font-cabin'>{category.categoryName}</p>
                                    </div> 
                                    <div className='flex flex-wrap gap-2 divide-x'>
                                        <p className='text-neutral-600 text-sm font-cabin'>{'Category Fields:'}</p>
                                        {category.fields?.length>0 && category.fields.map((field, fieldIndex)=>
                                            <div key={fieldIndex} className='flex gap-4 pl-1 items-center'>
                                                <p className='text-neutral-400 text-sm font-cabin'>{field.name}</p>
                                                {/* <img className='w-4 h-4 cursor-pointer' src={close_icon} onClick={()=>removeField(index)} /> */}
                                            </div>
                                        )}
                                    </div>

                                    <div className='flex flex-row divide-x gap-4'>
                                        <p className='text-indigo-600 font-cabin text-sm cursor-pointer' onClick={()=>handleEditFields({category: category.categoryName, fields:category.fields})}> Edit Fields</p>
                                        <p className='text-indigo-600 font-cabin text-sm cursor-pointer' onClick={()=>handleRemoveCategory(category)}> Remove This Category</p>
                                    </div>
                                    
                                </div> 

                            </div>))}
                    </details>
                </div>

            {/* <div className='mt-4 flex flex-row-reverse'>
                <HollowButton title='Save Changes' isLoading={networkStates?.isUploading} onClick={()=>saveChanges()} />
            </div> */}

            </div>
        </div>)
      
}

function ExpenseAllocation({orgHeaders, type, setShowAddHeaderModal, allocations, setAllocations}){


    const handleAllocationHeaderChange = (e, headerIndex)=>{
        
        if(type == 'cat'){
            const currentAllocations = allocations.allocation
            if(e.target.checked){
                currentAllocations.push(orgHeaders[headerIndex])
                setAllocations(pre=>({...pre, allocation: currentAllocations}))
            }
            else{
                //remove from allocations
                setAllocations(pre=>({...pre, allocation: currentAllocations.filter(h=>h.headerName != orgHeaders[headerIndex].headerName)}))
            }
        }

        if(type == 'exp'){
            const currentAllocations = allocations.expenseAllocation
            if(e.target.checked){
                currentAllocations.push(orgHeaders[headerIndex])
                setAllocations(pre=>({...pre, expenseAllocation: currentAllocations}))
            }
            else{
                //remove from allocations
                setAllocations(pre=>({...pre, expenseAllocation: currentAllocations.filter(h=>h.headerName != orgHeaders[headerIndex].headerName)}))
            }
        }
    }

    return(<>
        {orgHeaders.length>0 && 
        <div className='mt-10'>
            <p className='text-base text-neutral-800'>{`Allocate ${type=='exp'? 'Expenses for' : ''} this category`}</p>
            <p className='text-sm text-neutral-700'>{`We have identified following entities on which you might be allocating travel ${type=='exp'? 'expenses' : ''}. This is coming from your HR Data.`} </p>
            <div className='flex flex-col gap-1 mt-4'>
                {orgHeaders.map((header, headerIndex) => 
                <div key={headerIndex} className='flex items-center justify-between'>
                    <p className='text-sm flex-1 text-neutral-700'>{camelCaseToTitleCase(header.headerName)}</p>
                    <div className='flex-1 inline-flex'>
                        <Checkbox checked={type == 'exp'? allocations?.expenseAllocation?.find(h=>h.headerName == header.headerName) : allocations.allocation.find(h=>h.headerName == header.headerName)} onChange={(e)=>handleAllocationHeaderChange(e, headerIndex)} />
                    </div>
                </div>)}
            </div>

            <div className='mt-4 w-fit h-10 inline-flex items-center'>
                <p className='text-indigo-600 font-cabin text-sm cursor-pointer' onClick={()=>setShowAddHeaderModal(true)}> Add additional org level entities</p>
            </div>
        </div>}
    </>)
}
