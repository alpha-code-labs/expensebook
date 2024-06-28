import arrow_down from "../../../assets/chevron-down.svg";
import { useState, useEffect, useRef } from 'react';
import Checkbox from '../../../components/common/Checkbox';
import cross_icon from '../../../assets/x.svg'
import Input from '../../../components/common/Input';
import HollowButton from '../../../components/common/HollowButton';
import Button from '../../../components/common/Button'
import remove_icon from '../../../assets/XCircle.svg'
import UploadAdditionalHeaders from '../../expenseAllocations/UploadAdditionalHeaders'
import { getTenantOrgHeaders_API, getTenantTravelAllocations_API, getTravelCategories_API, postTenantTravelAllocations_API, postTravelCategories_API} from '../../../utils/api'
import { camelCaseToTitleCase } from '../../../utils/handyFunctions'
import Prompt from '../../../components/common/Prompt'
import Error from '../../../components/common/Error'
import { expenseCategories } from '../../../data/expenseCategories'
import MainSectionLayout from '../../../layouts/MainSectionLayout'


const travel_allocations = {
    international:{
        allocation: [],
        expenseAllocation: [],
        allocation_accountLine: null,
        expenseAllocation_accountLine: null,
    },
    domestic:{
        allocation: [],
        expenseAllocation: [],
        allocation_accountLine: null,
        expenseAllocation_accountLine: null,
    },
    local:{
        allocation: [],
        expenseAllocation: [],
        allocation_accountLine: null,
        expenseAllocation_accountLine: null,
    }
}

const defaultCategories = [
    {international: expenseCategories},
    {domestic: expenseCategories},
    {local: expenseCategories}
]

const fixedFields = ['Total Amount', 'Date', 'Class', 'Tax Amount', 'Tip Amount', 'Premium Amount', 'Cost', 'Total Cost', 'License Cost', 'Subscription Cost', 'Total Fare', 'Premium Cost']

export default function ({tenantId}) {


    const [showAddExpenseCategoriesModal, setShowAddExpenseCategoriesModal] = useState(false)
    const [categories, setCategories] = useState(defaultCategories)

    console.log('Expense at header level only')
    const [allocations, setAllocations] = useState({})

    const [expenseCategoryName, setExpenseCategoryName] = useState(null)
    const [expenseCategoryFields, setExpenseCategoryFields] = useState([])
    const [existingCategory, setExistingCategory] = useState(false)
    const [travelType, setTravelType] = useState(null)
    const [existingCategoryName, setExistingCategoryName] = useState(null)
    const [orgHeaders, setOrgHeaders] = useState([])
    const [presentFieldLength, setPresentFieldLength] = useState([])
    const [openAccordion, setOpenAccordion] = useState('')


    const [prompt, setPrompt] = useState({showPrompt:false, promptMsg:null, success:false})
    const [networkStates, setNetworkStates] = useState({isLoading:false, isUploading:false, loadingErrMsg:null})
    

    useEffect(()=>{
        if(showAddExpenseCategoriesModal){
            document.body.style.overflow = 'hidden';
        }else{
            document.body.style.overflow = 'auto';
        }
    },[showAddExpenseCategoriesModal])
    

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
                console.log(t_res.data)
                let orgHeadersData = res.data.orgHeaders
                let tmpOrgHeaders = []
                Object.keys(orgHeadersData).forEach(key => {
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

        const categories_copy = JSON.parse(JSON.stringify(categories))
        const index = categories.findIndex(itm=>Object.keys(itm)[0] == travelType)
        categories_copy[index][travelType] = [...categories_copy[index][travelType], {categoryName: expenseCategoryName, fields: expenseCategoryFields} ]
        setCategories(categories_copy)
 
        setExpenseCategoryFields([])
        setExistingCategoryName(null)
        setExistingCategory(false)
        setExistingCategoryName(null)
    }

    const removeCategoryField = (index)=>{
        console.log(index, 'index...')
        const expenseCategoryFields_copy = JSON.parse(JSON.stringify(expenseCategoryFields))
        expenseCategoryFields_copy.splice(index,1)
        console.log(expenseCategoryFields_copy)
        setExpenseCategoryFields(expenseCategoryFields_copy)
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

    const handleEditFields = ({category, fields, travelType})=>{
        setExistingCategory(true)
        setExistingCategoryName(category)
        setExpenseCategoryName(category)
        setExpenseCategoryFields(fields)
        setTravelType(travelType)
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

        if(expenseCategoryFields.some(field=> field.name == '' || field.name == undefined || field.type == '' || field.type == undefined)){
            alert('Please provide filed name and field type')
            return
        }

        const categories_copy = JSON.parse(JSON.stringify(categories))
        const index = categories.findIndex(itm=>Object.keys(itm)[0] == travelType)

        // console.log({categoryName:expenseCategoryName, fields:expenseCategoryFields})
        // console.log({existingCategoryName: existingCategoryName})
        
        const categoryIndex = categories[index][travelType].findIndex(item=>item.categoryName == existingCategoryName)
        
        if(categoryIndex > -1){
            console.log(categories_copy[categoryIndex], 'category....' )
            categories_copy[index][travelType][categoryIndex].categoryName = expenseCategoryName 
            categories_copy[index][travelType][categoryIndex].fields =  expenseCategoryFields

            console.log(categories_copy)
            setCategories(categories_copy)  
        }

        setShowAddExpenseCategoriesModal(false)
        setExpenseCategoryFields([])
        setExistingCategory(false)
        setExistingCategoryName(null)
    }

    const handleSaveAsDraft = async ()=>{
        //everhting should be already updated. Just update the form state
        await saveChanges()

        const res = updateFormState_API({tenantId, state: '/setup-expense-book/travel/level2'})
        window.location.href = 'https://google.com'
    }

    const handleContinue = async ()=>{
        await saveChanges();
    }

    const saveCategories = async ()=>{
        //save updated categories
    }

    const saveChanges = async ()=>{
        //update categories
        const cat_res = await postTravelCategories_API({tenantId, travelExpenseCategories: categories})
        const all_res = await postTenantTravelAllocations_API({tenantId, travelAllocations:allocations})

        if(cat_res.err || all_res.err){
            setPrompt({showPrompt:true, promptMsg:'Can not update data at the moment. Please try again later', succes: false})
        }
        else{
            setPrompt({showPrompt:true, promptMsg:'Changes Saved Successfully', success: true});
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
        {networkStates.isLoading && <Error message={networkStates.loadingErrMsg}/>}

        {!networkStates.isLoading && <>
        {
        
        <div className='bg-white'>               
            {/* back button and title */}

            <div className='flex gap-4'>
                <div className='flex gap-2'>
                    <p className='text-neutral-700 text-base font-medium font-cabin tracking-tight'>
                        Setup Expense Book
                    </p>
                </div>
            </div>

            {/* rest of the section */}
            <div className='mt-10 flex flex-col gap-4'>  
                
            {Object.keys(allocations).map(travelType=>{
                console.log(travelType)
                return (
                <Policy 
                openAccordion={openAccordion}
                setOpenAccordion={setOpenAccordion}
                travelType={travelType}
                categories={categories}
                setCategories={setCategories}
                handleEditFields={handleEditFields}  
                saveChanges={saveChanges} 
                categoryName={travelType} 
                allocations={allocations}
                setAllocations={setAllocations}
                orgHeaders={orgHeaders} 
                setShowAddHeaderModal={setShowAddHeaderModal} />)
            })}
{/* 
            <CategoryWrapper 
                categories={categories}  
                handleEditFields={handleEditFields}
                saveChanges={saveCategories} 
                setNetworkStates={setNetworkStates}
                networkStates={networkStates}  /> */}
                    
                {/* <div className='mt-6'>
                    <HollowButton title='Add Expense Categories' onClick={()=>{setExistingCategory(false); setShowAddExpenseCategoriesModal(true)}} />
                </div>
                    */}

                <div className='flex justify-between mt-10'>
                    {/* <Button text='Save As Draft' onClick={handleSaveAsDraft} /> */}
                    <Button isLoading={networkStates.isUploading} text='Save Changes' onClick={handleContinue} />
                </div>


            </div>
        </div>
        }
        
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
                        <div className='slim-scroll flex max-h-[200px] overflow-y-scroll flex-col gap-2'>
                            {expenseCategoryFields.length>0 && expenseCategoryFields.map((field, index)=>(
                                <div key={`${field.name}-${index}`} className='flex flex-wrap gap-4 items-center'>
                                    <Input  showTitle={false} placeholder='eg. Amount' value={field.name} onBlur={(e)=>{handleCategoryFieldNameChange(e, index)}} readOnly={fixedFields.includes(field.name)} />
                                    <select value={field.type} disabled={fixedFields.includes(field.name)} onChange={e=>handleCategoryFieldTypeChange(e, index)} className='min-w-[200px] w-full md:w-fit max-w-[403px] h-[45px] flex-col justify-start items-start gap-2 inline-flex px-6 py-2 text-neutral-700 w-full  h-full text-sm font-normal font-cabin border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600'>
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
                                    {!fixedFields.includes(field.name) && <img src={remove_icon} onClick={()=>removeCategoryField(index)} />}
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
    </>);
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
        travelType,
        networkStates,
        setNetworkStates,
        saveChanges, 
        openAccordion, 
        setOpenAccordion})
        {
    
    const [collapse, setCollapse] = useState(true)
    const categoryDetails = allocations

    console.log(categories)
    console.log(categoryName, 'cat', travelType, 'travelType')
    const fields = categoryDetails?.fields

    const [cat, setCat] = useState(true)
    const [exp, setExp] = useState(false)
    
    const handleAccountLineChange = (type, value)=>{
        if(type == 'cat'){
            const allocations_copy = JSON.parse(JSON.stringify(allocations))
            allocations_copy[travelType].allocation_accountLine = value
            setAllocations(allocations_copy)
        }

        if(type == 'exp'){
            const allocations_copy = JSON.parse(JSON.stringify(allocations))
            allocations_copy[travelType].expenseAllocation_accountLine = value
            setAllocations(allocations_copy)
        }
    }

    const handleRemoveCategory = (category, type)=>{
        let index = 0
        if(type == 'international') index=0
        if(type == 'domestic') index=1
        if(type == 'local') index=2

        const categories_copy = JSON.parse(JSON.stringify(categories))
        categories_copy[index][type] = categories[index][type].filter(cat=>cat.categoryName != category.categoryName)
        setCategories(categories_copy)
    }

    const handleAccordion = ()=>{
        if(collapse){
            console.log('settingt to', travelType)
            setOpenAccordion(travelType)
        }else{
            setOpenAccordion('');
        }
    }

    useEffect(()=>{
        if(openAccordion != travelType){
            setCollapse(true)
        }else{
            setCollapse(false)
        }
    }, [openAccordion])

    return (
        <div className={`w-full p-6 transition-max-height duration-1000 ${collapse? 'max-h-[75px]' : 'max-h-[100000px]'} bg-white rounded-xl border border-neutral-200 font-cabin`}>
            <div className="w-full relative bg-white cursor-pointer" onClick={handleAccordion} >
                <div className="flex justify-between items-center">
                    
                    <div className="justify-start items-center gap-8 inline-flex">
                        <div className="justify-start items-center gap-6 flex">
                            <div className="text-neutral-700 text-base font-medium font-cabin tracking-tight">{camelCaseToTitleCase(categoryName)}</div>
                        </div>
                    </div>

                    <div className="justify-start gap-12 items-start gap-2 inline-flex" >
                        <div className={`w-6 h-6 transition ${collapse? '' : 'rotate-180' }`}>
                            <img src={arrow_down} />
                        </div>
                    </div>

                </div>
            </div>

            <div className={`transition-max-height transition-all duration-1000 ${collapse? 'max-h-0 h-0 hidden': 'max-h-[100000px]'} `}>

            <div>
                {/* by class, by budget*/}
                <div className="w-fit h-6 justify-start items-center gap-4 inline-flex mt-5">
                    <div onClick={()=>{setCat(true); setExp(false)}} className={`${ cat? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer`}>Allocation</div>
                    <div onClick={()=>{setCat(false); setExp(true)}} className={`${ exp? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer `}>Expense Allocation</div>
                </div> 
                <hr className='mt-2'/>
            </div>
            
            <div className={`w-full h-fit bg-white transition-opacity transition-max-height delay-1000  ${collapse? 'hidden opacity-0 max-height-0': 'opacity-100 max-height-[10000px]' }`} >
            
                {/* account line */}
                
                { cat && 
                    <div className='mt-4 '>
                        <Input
                            value={allocations[travelType]?.allocation_accountLine}
                            onChange={(e)=>handleAccountLineChange('cat', e.target.value)} 
                            title='Category Account Line' />
                        <ExpenseAllocation type='cat' orgHeaders={orgHeaders} setShowAddHeaderModal={setShowAddHeaderModal} allocations={allocations} setAllocations={setAllocations} categoryName={categoryName} travelType={travelType} />
                    </div>
                }

                { exp && 
                    <div className='mt-4 '>
                        <Input
                            value={allocations[travelType]?.expenseAllocation_accountLine} 
                            onChange={(e)=>handleAccountLineChange('exp', e.target.value)} 
                            title='Expense Account Line' />

                        <ExpenseAllocation type="exp" orgHeaders={orgHeaders} setShowAddHeaderModal={setShowAddHeaderModal} allocations={allocations} setAllocations={setAllocations} categoryName={categoryName} travelType={travelType} />
                    </div>
                }

            </div>
                
                

                <hr className='py-6' />

                <div className='flex flex-col gap-2'>
                    <details>
                        <summary className='font-cabin text-neutral-700 bt-4'>Categories and Captured Fields</summary>
                        {categories.find(type=>Object.keys(type)[0] == travelType)[travelType].length>0 && categories.find(type=>Object.keys(type)[0] == travelType)[travelType].map((category,index)=>(
                            
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
                                        <p className='text-indigo-600 font-cabin text-sm cursor-pointer' onClick={()=>handleEditFields({category: category.categoryName, fields:category.fields, travelType})}> Edit Fields</p>
                                        <p className='text-indigo-600 font-cabin text-sm cursor-pointer' onClick={()=>handleRemoveCategory(category, travelType)}> Remove This Category</p>
                                    </div>
                                    
                                </div>
                            </div>
                        ))} 
                    </details>
                </div>
                                    
            <div className='mt-4 flex flex-row-reverse'>
                {/* <HollowButton title='Save Changes' isLoading={networkStates?.isUploading} onClick={()=>saveChanges()} /> */}
            </div>

            </div>
        </div>)
      
}

function ExpenseAllocation({orgHeaders, type, setShowAddHeaderModal, allocations, setAllocations, travelType}){

    const handleAllocationHeaderChange = (e, headerIndex)=>{
        console.log(e.target.checked)

        if(type == 'cat'){
            const currentAllocations = allocations[travelType]?.allocation
            const allocations_copy = JSON.parse(JSON.stringify(allocations))
            if(e.target.checked){
                currentAllocations.push(orgHeaders[headerIndex])
                allocations_copy[travelType].allocation = currentAllocations
            }
            else{
                allocations_copy[travelType].allocation = currentAllocations.filter(h=>h.headerName != orgHeaders[headerIndex].headerName)
            }

            setAllocations(allocations_copy)
        }

        if(type == 'exp'){
            const currentAllocations = allocations[travelType]?.expenseAllocation
            const allocations_copy = JSON.parse(JSON.stringify(allocations))

            if(e.target.checked){
                currentAllocations.push(orgHeaders[headerIndex])
                allocations_copy[travelType].expenseAllocation = currentAllocations
            }
            else{
                allocations_copy[travelType].allocation = currentAllocations.filter(h=>h.headerName != orgHeaders[headerIndex].headerName)
            }

            setAllocations(allocations_copy)
        }
    }

    return(<>
        {orgHeaders.length>0 && 
        <div className='mt-10'>
            <p className='text-base text-neutral-800'>{`Allocate ${type=='exp'? 'Expenses for' : ''} this category`}</p>
            <p className='text-sm text-neutral-600'>We have identified following entities on which you might be allocating </p>
            <div className='flex flex-col gap-1 mt-2'>
                {orgHeaders.map((header, headerIndex) => 
                <div key={headerIndex} className='flex items-center justify-between'>
                    <p className='text-sm flex-1 text-neutral-700'>{camelCaseToTitleCase(header.headerName)}</p>
                    <div className='flex-1 inline-flex'>
                        <Checkbox checked={type == 'exp'? allocations[travelType].expenseAllocation.find(h=>h.headerName == header.headerName) : allocations[travelType].allocation.find(h=>h.headerName == header.headerName)} onChange={(e)=>handleAllocationHeaderChange(e, headerIndex)} />
                    </div>
                </div>)}
            </div>

            <div className='mt-4 w-fit h-10 inline-flex items-center'>
                <p className='text-indigo-600 font-cabin text-sm cursor-pointer' onClick={()=>setShowAddHeaderModal(true)}> Add additional org level entities</p>
            </div>
        </div>}
    </>)
}
