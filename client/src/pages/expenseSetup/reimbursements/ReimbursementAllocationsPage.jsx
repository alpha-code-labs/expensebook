import internatinal_travel_icon from '../../../assets/in-flight.svg'
import domestic_travel_icon from '../../../assets/briefcase.svg'
import local_travel_icon from '../../../assets/map-pin.svg'
import non_travel_icon from '../../../assets/paper-money-two.svg'
import back_icon from '../../../assets/arrow-left.svg'
import Icon from '../../../components/common/Icon';
import arrow_down from "../../../assets/chevron-down.svg";
import { useNavigate } from 'react-router-dom';
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
import { getTenantOrgHeaders_API, getTenantReimbursementAllocations_API, postTenantReimbursementAllocations_API, postReimbursementCategories_API, updateFormState_API} from '../../../utils/api'
import Prompt from '../../../components/common/Prompt'
import { expenseCategories } from '../../../data/expenseCategories'
import { camelCaseToTitleCase } from '../../../utils/handyFunctions'
import MainSectionLayout from '../../MainSectionLayout'
import { postProgress_API } from '../../../utils/api'

const reimbursement_allocations = expenseCategories.map(category=>{
    if(category.hasOwnProperty('class')){
        return (
            {
                categoryName: category.categoryName,
                expenseAllocation: [],
                expenseAllcationAccountLine: null,
                fields:category.fields,
                class:category.class
            }
        )
    }

    else{
        return(
            {
                categoryName: category.categoryName,
                expenseAllocation: [],
                expenseAllcationAccountLine: null,
                fields:category.fields,
            }
        )
    }
})


const fixedFields = ['Total Amount', 'Date', 'Class', 'Tax Amount', 'Tip Amount', 'Premium Amount', 'Cost', 'Total Cost', 'License Cost', 'Subscription Cost', 'Total Fare', 'Premium Cost']

export default function ({tenantId, progress, setProgress}) {

    const [showAddExpenseCategoriesModal, setShowAddExpenseCategoriesModal] = useState(false)

    useEffect(()=>{
        if(showAddExpenseCategoriesModal){
            document.body.style.overflow = 'hidden';
        }else{
            document.body.style.overflow = 'auto';
        }
    },[showAddExpenseCategoriesModal])
    
    const navigate = useNavigate()
    const [allocations, setAllocations] = useState({})


    const updateReimursementAllocations = async()=>{
        //update travelAllocations and travelExpenseCategories
        setNetworkStates(pre=>({...pre, setIsUploading:true}))

        const res = await postTenantReimbursementAllocations_API({tenantId, reimbursementAllocations: allocations})
        const reimbursementExpenseCategories = allocations.map(cat=>{
            if(cat.hasOwnProperty('class')){
                return ({categoryName:cat.categoryName, fields:cat.fields, class: cat.class})
            }
            else return ({categoryName:cat.categoryName, fields:cat.fields})
        })

        const cat_res = await postReimbursementCategories_API({tenantId, reimbursementExpenseCategories})

        setNetworkStates(pre=>({...pre, setIsUploading:false}))

        if(cat_res.err || res.err) setPrompt({showPrompt: true, success:false, promptMsg: cat_res.err??res.err})
        else setPrompt({showPrompt:true, success:true, promptMsg: 'Changes saved successfully!'})  
    } 

    

    const [expenseCategoryName, setExpenseCategoryName] = useState(null)
    const [expenseCategoryFields, setExpenseCategoryFieds] = useState([])
    const [existingCategory, setExistingCategory] = useState(false)
    const [existingCategoryName, setExistingCategoryName] = useState(null)
    const [orgHeaders, setOrgHeaders] = useState([])
    const [selectedOrgHeaders_cat, setSelectedOrgHeaders_cat] = useState([])
    const [selectedOrgHeaders_exp, setSelectedOrgHeaders_exp] = useState([])
    const [accountLine_cat, setAccountLine_cat] = useState(null)
    const [accountLine_exp, setAccountLine_exp] = useState(null)
    const [presentFieldLength, setPresentFieldLength] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const [openAccordion, setOpenAccordion] = useState('')


    const [prompt, setPrompt] = useState({showPrompt:false, promptMsg:null, success:false})
    const [networkStates, setNetworkStates] = useState({isLoading:false, isUploading:false, loadingErrMsg:null})
    
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
            setNetworkStates(pre=>({...pre, isLoading:true}))
            const res = await getTenantOrgHeaders_API({tenantId})
            const t_res = await getTenantReimbursementAllocations_API({tenantId})
            
            if(res.err || t_res.err){
                console.log(res.err)
                const errorMsg = res.err
                setNetworkStates(pre=>({...pre, loadingErrMsg:errorMsg??t_res.err}))
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

                if(t_res.data.reimbursementAllocations.length == 0)
                    setAllocations(reimbursement_allocations)
                else setAllocations(t_res.data.reimbursementAllocations)
                
                setNetworkStates(pre=>({...pre, isLoading:false}))
            }

        })()
    },[])


    const addCategoryField = ()=>{
        setExpenseCategoryFieds(prev=>[...prev, {name:'', type:''}])
    }

    const handleCategoryNameChange = (e)=>{
       // console.log(e.target.value)
        setExpenseCategoryName(e.target.value)
    }

    const handleRemoveCategory = (expenseCategoryName)=>{
        const res = confirm(`Are you sure you want to remove ${expenseCategoryName} category?`)

        if(res){
            const allocations_copy = allocations.filter(c=>c.categoryName != expenseCategoryName)
            setAllocations(allocations_copy)
        }
    }

    const handleAddCategory = async ()=>{
        if(expenseCategoryName==null || expenseCategoryName==''){
            setPrompt({showPrompt:true, success:false, promptMsg: 'Please provide expense category name e.g Office Supplies'})
            return
        }
        if(expenseCategoryFields.length==0){
            setPrompt({showPrompt:true, success:false, promptMsg: 'Please add atleast one field to continue'})
            return
        }

        for(let i=0; i<expenseCategoryFields.length; i++){
            for(let j=i+1; j<expenseCategoryFields.length; j++){
                console.log(expenseCategoryFields[i], '  ', expenseCategoryFields[j], 'fields');
                if(JSON.stringify(expenseCategoryFields[i]) == JSON.stringify(expenseCategoryFields[j])){
                    setPrompt({showPrompt:true, success:false, promptMsg: 'Added field name is already present'});
                    return;
                }
            }
        }

        //update existing category
        const allocations_copy = JSON.parse(JSON.stringify(allocations))

        allocations_copy.push({
            categoryName: expenseCategoryName,
            expenseAllocation: [],
            expenseAllcationAccountLine: null,
            fields: expenseCategoryFields,
        })

        setAllocations(allocations_copy)

        setExpenseCategoryFieds([])
        setExistingCategoryName(null)
        setExistingCategory(false)
        setExistingCategoryName(null)
        setShowAddExpenseCategoriesModal(false)

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
        
        if(!existingCategory) return

        if(expenseCategoryName==null || expenseCategoryName==''){
            setPrompt({showPrompt:true, success:false, promptMsg: 'Please provide expense category name e.g Office Supplies'})
            return
        }
        if(expenseCategoryFields.length==0){
            setPrompt({showPrompt:true, success:false, promptMsg: 'Please add atleast one field to continue'})
            return
        }

        if(expenseCategoryFields.some(category=> category.name == '' || category.name == undefined || category.type == '' || category.type == undefined)){
            setPrompt({showPrompt:true, success:false, promptMsg: 'Please provide filed name and field type'})
            return
        }

        for(let i=0; i<expenseCategoryFields.length; i++){
            for(let j=i+1; j<expenseCategoryFields.length; j++){
                if(JSON.stringify(expenseCategoryFields[i]) == JSON.stringify(expenseCategoryFields[j])){
                    setPrompt({showPrompt:true, success:false, promptMsg: 'Added field name is already present'});
                    return;
                }
            }
        }

        const allocations_copy = JSON.parse(JSON.stringify(allocations))
        console.log(existingCategoryName, allocations)
        const ind = allocations_copy.findIndex(c=>c.categoryName == existingCategoryName)
        allocations_copy[ind].categoryName = expenseCategoryName
        allocations_copy[ind].fields = expenseCategoryFields
        setAllocations(allocations_copy)

        setExpenseCategoryFieds([])
        setExistingCategoryName(null)
        setExistingCategory(false)
        setExistingCategoryName(null)

        setShowAddExpenseCategoriesModal(false)
    }

    const handleSaveAsDraft = async ()=>{
        //everhting should be already updated. Just update the form state
        const res = updateFormState_API({tenantId, state:'/non-travel-expenses/setup'})
        window.location.href = 'https://google.com'
    }

    const handleContinue = async ()=>{
        const res = updateFormState_API({tenantId, state: '/groups'})
        const progress_copy = JSON.parse(JSON.stringify(progress));

        progress_copy.sections['section 3'].subsections.forEach(subsection=>{
            if(subsection.name == 'Travel Allocations') subsection.completed = true;
        });

        progress_copy.sections['section 3'].subsections.forEach(subsection=>{
            if(subsection.name == 'Reimbursement Allocations') subsection.completed = true;
        });

        const markCompleted = !progress_copy.sections['section 3'].subsections.some(subsection=>!subsection.completed)

        let totalCoveredSubsections = 0;
        progress_copy.sections['section 3'].subsections.forEach(subsection=>{
            if(subsection.completed) totalCoveredSubsections++;
        })

        progress_copy.sections['section 3'].coveredSubsections = totalCoveredSubsections; 
        progress_copy.activeSection = 'section 4';

        if(markCompleted){
            progress_copy.sections['section 3'].state = 'done';
            if(progress.maxReach!=undefined || progress.maxReach!=null || progress.maxReach.split(' ')[1] < 4){
                progress_copy.maxReach = 'section 4';
              }
        }else{
            progress_copy.sections['section 3'].state = 'attempted';
        }

        const progress_res = await postProgress_API({tenantId, progress: progress_copy})

        setProgress(progress_copy);
        //naviage to others section
        navigate(`/${tenantId}/groups`)
    }

    //fetch entire allocations object
    useEffect(()=>{
        //axios call
        //for now dummy data
        console.log(reimbursement_allocations)
        setAllocations(reimbursement_allocations)
    },[])

    useEffect(()=>{
        if(updatedOrgHeadeers.length>0){
            setOrgHeaders(updatedOrgHeadeers)
        }
    },[updatedOrgHeadeers])

    return(<>
        <MainSectionLayout>
            {
                <div className='px-6 py-10 bg-white'>               
                {/* back button and title */}
                    <div className='flex gap-4'>
                        <div className='w-6 h-6 cursor-pointer' onClick={()=>navigate(-1)}>
                            <img src={back_icon} />
                        </div>

                        <div className='flex gap-2'>
                            <p className='text-neutral-700 text-base font-medium font-cabin tracking-tight'>
                                Reimbursement's Allocation
                            </p>

                        </div>
                    </div>

                    {/* rest of the section */}
                    <div className='mt-10 flex flex-col gap-4'>  
                        {allocations && allocations?.length>0 && allocations.map((category, index)=>{
                                return (
                                <Policy 
                                    key={index} 
                                    handleEditFields={handleEditFields}  
                                    saveChanges={updateReimursementAllocations} 
                                    categoryName={category.categoryName} 
                                    allocations={allocations}
                                    setAllocations={setAllocations}
                                    orgHeaders={orgHeaders} 
                                    handleRemoveCategory={handleRemoveCategory}
                                    setShowAddHeaderModal={setShowAddHeaderModal} />)
                            }
                        )}
                        
                        <div className='mt-6'>
                            <HollowButton title='Add Expense Categories' onClick={()=>{setExistingCategory(false); setShowAddExpenseCategoriesModal(true)}} />
                        </div>
                        
                        <div className='flex justify-between mt-10'>
                            {/* <Button text='Save As Draft' onClick={handleSaveAsDraft} /> */}
                            <Button text='Continue' onClick={handleContinue} />
                        </div>

                        <Prompt prompt={prompt} setPrompt={setPrompt} />
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
                            <div className='flex flex-col gap-2'>
                                {expenseCategoryFields.length>0 && expenseCategoryFields.map((field, index)=>(
                                    <div key={index} className='flex flex-wrap gap-4 items-center'>
                                        <Input  showTitle={false} placeholder='eg. Amount' value={field.name} onChange={(e)=>{handleCategoryFieldNameChange(e, index)}} readOnly={fixedFields.includes(field.name) && !existingCategory} />
                                        <select value={field.type} disabled={fixedFields.includes(field.name) && !existingCategory} onChange={e=>handleCategoryFieldTypeChange(e,index)} className='min-w-[200px] w-full md:w-fit max-w-[403px] h-[45px] flex-col justify-start items-start gap-2 inline-flex px-6 py-2 text-neutral-700 w-full  h-full text-sm font-normal font-cabin border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600'>
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
                                        setExpenseCategoryFieds([])
                                        setShowAddExpenseCategoriesModal(false)
                                    }} />
                        </div>
                    </div>
                </div>
                </div>}
        </MainSectionLayout>
        </>
    );
  }

function Policy({
        allocations, 
        setAllocations, 
        categoryName,
        setShowAddHeaderModal,
        handleEditFields,
        orgHeaders,
        networkStates,
        setNetworkStates,
        saveChanges, 
        handleRemoveCategory,
        openAccordion, 
        setOpenAccordion})
        {
    
    const [collapse, setCollapse] = useState(true)
    const categoryDetails = allocations.find(c=>c.categoryName == categoryName)
    
    const fields = categoryDetails?.fields
    const expenseAllcationAccountLine = categoryDetails?.expenseAllocation_accountLine


    const [cat, setCat] = useState(true)
    const [exp, setExp] = useState(false)
    
    const handleAccountLineChange = (value)=>{
        const allocations_copy = JSON.parse(JSON.stringify(allocations))
        const ind = allocations_copy.findIndex(itm=>itm.categoryName == categoryName)
        allocations_copy[ind].expenseAllocation_accountLine = value
        setAllocations(allocations_copy)
    }

    return (
        <div className={`w-full p-6 transition-max-height duration-1000 ${collapse? 'max-h-[75px]' : 'max-h-[2000px]'} bg-white rounded-xl border border-neutral-200 font-cabin`}>
            <div onClick={()=>{setCollapse(pre=>!pre)}} className="w-full relative bg-white cursor-pointer">
                <div className="flex justify-between items-center">
                    
                    <div className="justify-start items-center gap-8 inline-flex">
                        <div className="justify-start items-center gap-8 flex">
                            <div className="text-neutral-700 text-base font-medium font-cabin tracking-tight">{categoryName}</div>
                            {!collapse && <div onClick={()=>handleRemoveCategory(categoryName)} className='text-indigo-600 text-sm font-medium font-cabin tracking-tight'>Remove Category</div>}
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
            <hr className='mt-2'/>

            <div className={`w-full h-fit bg-white transition-opacity transition-max-height delay-1000  ${collapse? 'hidden opacity-0 max-height-0': 'opacity-100 max-height-[1000px]' }`} >
                <div className='mt-10'>
                    <p className='text-neutral-800 text-base'>Captured Fields</p>
                    <div className='flex gap-2 divide-x flex-wrap'>
                        {fields?.length>0 && fields.map((field, fieldIndex)=>
                            <div key={fieldIndex} className='flex gap-4 pl-1 items-center'>
                                <p className='text-neutral-700 whitespace-nowrap text-sm font-cabin'>{field.name}</p>
                                {/* <img className='w-4 h-4 cursor-pointer' src={close_icon} onClick={()=>removeField(index)} /> */}
                            </div>
                        )}
                    </div>
                </div>

                { 
                    <div className='mt-4 w-fit h-10 inline-flex items-center'>
                        <p className='text-indigo-600 font-cabin text-sm cursor-pointer' onClick={()=>handleEditFields({category:categoryName, fields})}> Add / Remove Captured Fields</p>
                    </div>
                }

                {/* account line */}
                <div className='mt-4 '>
                    <Input
                        value={expenseAllcationAccountLine}
                        onBlur={(e)=>handleAccountLineChange(e.target.value)}
                        placeholder={'eg. 814578226'} 
                        title='Expense Account Line' />
                </div>
                

                </div>
                
                <ExpenseAllocation orgHeaders={orgHeaders} setShowAddHeaderModal={setShowAddHeaderModal} allocations={allocations} setAllocations={setAllocations} categoryName={categoryName} />

            <div className='mt-4 flex flex-row-reverse'>
                <HollowButton title='Save Changes' isLoading={networkStates?.isUploading} onClick={()=>saveChanges()} />
            </div>

            </div>
        </div>)
      
}

function ExpenseAllocation({orgHeaders, setShowAddHeaderModal, allocations, setAllocations, categoryName}){

    const handleAllocationHeaderChange = (e, headerIndex)=>{
        console.log(e.target.value, categoryName, headerIndex)
        const allocations_copy = JSON.parse(JSON.stringify(allocations))
        const ind = allocations.findIndex(itm=>itm.categoryName == categoryName)

        if(e.target.checked){
            allocations_copy[ind].expenseAllocation.push(orgHeaders[headerIndex])
        }else{
            allocations_copy[ind].expenseAllocation = allocations_copy[ind].expenseAllocation.filter(itm=>itm.headerName != orgHeaders[headerIndex].headerName)
        }
    
        setAllocations(allocations_copy)
    }

    return(<>
        {orgHeaders.length>0 && 
        <div className='mt-10'>
            <p className='text-base text-neutral-800'>{`Allocate Expenses for this category`}</p>
            <p className='text-sm text-neutral-600'>We have identified following entities on which you might be allocating </p>
            <div className='flex flex-col gap-1 mt-2'>
                {orgHeaders.map((header, headerIndex) => 
                <div key={headerIndex} className='flex items-center justify-between'>
                    <p className='text-sm flex-1 text-neutral-700'>{camelCaseToTitleCase(header.headerName)}</p>
                    <div className='flex-1 inline-flex'>
                        <Checkbox checked={ allocations.find(c=>c.categoryName == categoryName).expenseAllocation.find(h=>h.headerName == header.headerName)} onChange={(e)=>handleAllocationHeaderChange(e, headerIndex)} />
                    </div>
                </div>)}
            </div>

            <div className='mt-4 w-fit h-10 inline-flex items-center'>
                <p className='text-indigo-600 font-cabin text-sm cursor-pointer' onClick={()=>setShowAddHeaderModal(true)}> Add additional org level entities</p>
            </div>
        </div>}
    </>)
}