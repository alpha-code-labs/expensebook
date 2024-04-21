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
import { getTenantOrgHeaders_API, getTenantTravelAllocations_API, postTenantTravelAllocations_API, postTravelCategories_API, updateFormState_API, updateNonTravelAllocation_API, updateNonTravelPolicies_API } from '../../../utils/api'
import Prompt from '../../../components/common/Prompt'
import { expenseCategories } from '../../../data/expenseCategories'
import MainSectionLayout from '../../MainSectionLayout'

const travel_allocations__ = {
	international:[
	
    {
		categoryName: 'Flight',
		allocation: [],
		expenseAllocation: [],
		allocationAccountLine: null,
		expenseAllcationAccountLine: null,
        fields:[{name: 'Vendor Name', type: 'text'}, {name: 'Amount', type: 'amount'}],
	},

	{
		categoryName: 'Train',
		allocation: [],
		expenseAllocation: [],
		allocationAccountLine: null,
		expenseAllcationAccountLine: null,
        fields:[{name: 'Vendor Name', type: 'text'}, {name: 'Amount', type: 'amount'}],
	},

	{
		categoryName: 'Cab',
		allocation: [],
		expenseAllocation: [],
		allocationAccountLine: null,
		expenseAllcationAccountLine: null,
        fields:[{name: 'Vendor Name', type: 'text'}, {name: 'Amount', type: 'amount'}],
	},
	
	],
	domestic:[
		{
			categoryName: 'Flight',
			allocation: [],
			expenseAllocation: [],
			allocationAccountLine: null,
			expenseAllcationAccountLine: null,
            fields:[{name: 'Vendor Name', type: 'text'}, {name: 'Amount', type: 'amount'}],
		},
		{
			categoryName: 'Train',
			allocation: [],
			expenseAllocation: [],
			allocationAccountLine: null,
			expenseAllcationAccountLine: null,
            fields:[{name: 'Vendor Name', type: 'text'}, {name: 'Amount', type: 'amount'}],
		},
		{
			categoryName: 'Cab',
			allocation: [],
			expenseAllocation: [],
			allocationAccountLine: null,
			expenseAllcationAccountLine: null,
            fields:[{name: 'Vendor Name', type: 'text'}, {name: 'Amount', type: 'amount'}],
		},
	],
	local:[
		{
			categoryName: 'Flight',
			allocation: [],
			expenseAllocation: [],
			allocationAccountLine: null,
			expenseAllcationAccountLine: null,
            fields:[{name: 'Vendor Name', type: 'text'}, {name: 'Amount', type: 'amount'}],
		},
		{
			categoryName: 'Train',
			allocation: [],
			expenseAllocation: [],
			allocationAccountLine: null,
			expenseAllcationAccountLine: null,
            fields:[{name: 'Vendor Name', type: 'text'}, {name: 'Amount', type: 'amount'}],
		},
		{
			categoryName: 'Cab',
			allocation: [],
			expenseAllocation: [],
			allocationAccountLine: null,
			expenseAllcationAccountLine: null,
            fields:[{name: 'Vendor Name', type: 'text'}, {name: 'Amount', type: 'amount'}],
		},
	]
}


const travel_allocations = {
    international: expenseCategories.map(category=>{
        if(category.hasOwnProperty('class')){
            return {
                categoryName: category.categoryName,
                allocation: [],
                expenseAllocation: [],
                allocationAccountLine: null,
                expenseAllcationAccountLine: null,
                fields:category.fields, 
                class:category.class,
            }
        }
        else {
            return {
                categoryName: category.categoryName,
                allocation: [],
                expenseAllocation: [],
                allocationAccountLine: null,
                expenseAllcationAccountLine: null,
                fields:category.fields, 
            }
        }
    }),

    domestic: expenseCategories.map(category=>{
        if(category.hasOwnProperty('class')){
            return {
                categoryName: category.categoryName,
                allocation: [],
                expenseAllocation: [],
                allocationAccountLine: null,
                expenseAllcationAccountLine: null,
                fields:category.fields, 
                class:category.class,
            }
        }
        else {
            return {
                categoryName: category.categoryName,
                allocation: [],
                expenseAllocation: [],
                allocationAccountLine: null,
                expenseAllcationAccountLine: null,
                fields:category.fields, 
            }
        }
    }),

    local: expenseCategories.map(category=>{
        if(category.hasOwnProperty('class')){
            return {
                categoryName: category.categoryName,
                allocation: [],
                expenseAllocation: [],
                allocationAccountLine: null,
                expenseAllcationAccountLine: null,
                fields:category.fields, 
                class:category.class,
            }
        }
        else {
            return {
                categoryName: category.categoryName,
                allocation: [],
                expenseAllocation: [],
                allocationAccountLine: null,
                expenseAllcationAccountLine: null,
                fields:category.fields, 
            }
        }
    }),
}

const defaultCategories = [
    {international: expenseCategories},
    {domestic: expenseCategories},
    {local: expenseCategories}
]

const fixedFields = ['Total Amount', 'Date', 'Class', 'Tax Amount', 'Tip Amount', 'Premium Amount', 'Cost', 'Total Cost', 'License Cost', 'Subscription Cost', 'Total Fare', 'Premium Cost']

export default function (props) {

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
                return 'International Travel'
            case 'domestic':
                return 'Domestic Travel'
            case 'local':
                return 'Local Travel'
        }
    }
    
    const navigate = useNavigate()
    const [allocations, setAllocations] = useState({})


    const updateTravelAllocations = async()=>{
        //update travelAllocations and travelExpenseCategories
        setNetworkStates(pre=>({...pre, setIsUploading:true}))

        const res = await postTenantTravelAllocations_API({tenantId, travelAllocations: allocations})
        const travelExpenseCategories = Object.keys(allocations).map(traveltype=>{
            return ({[traveltype]: allocations[traveltype].map(cat=>{
                if(cat.hasOwnProperty('class')) return({categoryName:cat.categoryName, fields:cat.fields, class:cat.class})
                else return({categoryName:cat.categoryName, fields:cat.fields, class:cat.class})
            })
        })      
        })
        const cat_res = await postTravelCategories_API({tenantId, travelExpenseCategories})

        setNetworkStates(pre=>({...pre, setIsUploading:false}))

        if(cat_res.err || res.err) setPrompt({showPrompt: true, success:false, promptMsg: cat_res.err??res.err})
        else setPrompt({showPrompt:true, success:true, promptMsg: 'Changes saved successfully !'})  
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

                if(Object.keys(t_res.data.travelAllocations).length == 0)
                    setAllocations(travel_allocations)
                else setAllocations(t_res.data.travelAllocations)
                
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
            let allocations_copy = JSON.parse(JSON.stringify(allocations))
            allocations_copy[travelType] = allocations[travelType].filter(c=>c.categoryName != expenseCategoryName)
            setAllocations(allocations_copy)
        }
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
        const allocations_copy = JSON.parse(JSON.stringify)

        allocations_copy[travelType].push({
            categoryName: expenseCategoryName,
            allocation: [],
            expenseAllocation: [],
            allocationAccountLine: null,
            expenseAllcationAccountLine: null,
            fields: expenseCategoryFields,
        })

        setAllocations(allocations_copy)

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
        
        if(!existingCategory) return

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

        const allocations_copy = JSON.parse(JSON.stringify(allocations))
        console.log(existingCategoryName, travelType, allocations[travelType])
        const ind = allocations_copy[travelType].findIndex(c=>c.categoryName == existingCategoryName)
        allocations_copy[travelType][ind].categoryName = expenseCategoryName
        allocations_copy[travelType][ind].fields = expenseCategoryFields
        setAllocations(allocations_copy)

        setExpenseCategoryFieds([])
        setExistingCategoryName(null)
        setExistingCategory(false)
        setExistingCategoryName(null)

        setShowAddExpenseCategoriesModal(false)
    }

    const handleAllocationHeaderChange_cat = async (e, categoryName, index)=>{
        console.log(e.target.checked, index)
        let selectedOrgHeaders_copy = JSON.parse(JSON.stringify(selectedOrgHeaders_cat))
        if(e.target.checked){
            const indexOfCategory = selectedOrgHeaders_cat.findIndex(category=>category.categoryName.toLowerCase() == categoryName.toLowerCase())
            if(indexOfCategory > -1){
                const indexOfElement = selectedOrgHeaders_cat[indexOfCategory].allocations.findIndex(header=>header.headerName.toLowerCase() == orgHeaders[index].headerName.toLowerCase())
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
            const indexOfCategory = selectedOrgHeaders_cat.findIndex(category=>category.categoryName.toLowerCase() == categoryName.toLowerCase())
            const indexOfElement = selectedOrgHeaders_cat[indexOfCategory].allocations.findIndex(header=>header.headerName.toLowerCase() == orgHeaders[index].headerName.toLowerCase())
            if(indexOfElement<0) return
            selectedOrgHeaders_copy[indexOfCategory].allocations = selectedOrgHeaders_cat[indexOfCategory].allocations.filter((_,ind)=> ind!=indexOfElement)
        }

        console.log(selectedOrgHeaders_copy)
        setSelectedOrgHeaders_cat(selectedOrgHeaders_copy)
    }

    const handleAllocationHeaderChange_exp = async (e, categoryName, index)=>{
        console.log(e.target.checked, index)
        let selectedOrgHeaders_copy = JSON.parse(JSON.stringify(selectedOrgHeaders_exp))
        if(e.target.checked){
            const indexOfCategory = selectedOrgHeaders_exp.findIndex(category=>category.categoryName.toLowerCase() == categoryName.toLowerCase())
            if(indexOfCategory > -1){
                const indexOfElement = selectedOrgHeaders_exp[indexOfCategory].allocations.findIndex(header=>header.headerName.toLowerCase() == orgHeaders[index].headerName.toLowerCase())
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
            const indexOfCategory = selectedOrgHeaders_exp.findIndex(category=>category.categoryName.toLowerCase() == categoryName.toLowerCase())
            const indexOfElement = selectedOrgHeaders_cat[indexOfCategory].allocations.findIndex(header=>header.headerName.toLowerCase() == orgHeaders[index].headerName.toLowerCase())
            if(indexOfElement<0) return
            selectedOrgHeaders_copy[indexOfCategory].allocations = selectedOrgHeaders_exp[indexOfCategory].allocations.filter((_,ind)=> ind!=indexOfElement)
        }

        console.log(selectedOrgHeaders_copy)
        setSelectedOrgHeaders_exp(selectedOrgHeaders_copy)
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
        {
        
            <div className='relative px-6 py-10 bg-white'>               
               {/* back button and title */}
                <div className='flex gap-4 absolute py-10 bg-white z-[50]'>
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
                <div className='mt-28 flex flex-col gap-4'>  
                    {allocations && allocations[travelType]?.length>0 && allocations[travelType]?.map((category, index)=>{
                            return (
                            <Policy 
                                key={index} 
                                handleEditFields={handleEditFields}  
                                saveChanges={updateTravelAllocations} 
                                categoryName={category.categoryName}
                                handleRemoveCategory={handleRemoveCategory}
                                travelType={travelType} 
                                allocations={allocations}
                                setAllocations={setAllocations}
                                orgHeaders={orgHeaders} 
                                setShowAddHeaderModal={setShowAddHeaderModal} />)
                        }
                    )}
                     
                    <div className='mt-6'>
                        <HollowButton title='Add Expense Categories' onClick={()=>{setExistingCategory(false); setShowAddExpenseCategoriesModal(true)}} />
                    </div>
                    
                    {/* <div className='flex justify-between mt-10'>
                        <Button text='Save As Draft' onClick={handleSaveAsDraft} />
                        <Button text='Continue' onClick={handleContinue} />
                    </div> */}

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
                                    <Input  showTitle={false} placeholder='eg. Amount' value={field.name} onChange={(e)=>{handleCategoryFieldNameChange(e, index)}} readOnly={fixedFields.includes(field.name)} />
                                    <select value={field.type} disabled={fixedFields.includes(field.name)} onChange={e=>handleCategoryFieldTypeChange(e,index)} className='min-w-[200px] w-full md:w-fit max-w-[403px] h-[45px] flex-col justify-start items-start gap-2 inline-flex px-6 py-2 text-neutral-700 w-full  h-full text-sm font-normal font-cabin border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600'>
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
                                    {fixedFields.includes(field.name) && <img src={remove_icon} onClick={()=>removeCategoryField(index)} />}
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
        travelType, 
        categoryName,
        setShowAddHeaderModal,
        handleEditFields,
        handleRemoveCategory,
        orgHeaders,
        networkStates,
        setNetworkStates,
        saveChanges, 
        openAccordion, 
        setOpenAccordion})
        {
    
    const [collapse, setCollapse] = useState(true)
    const categoryDetails = allocations[travelType].find(c=>c.categoryName == categoryName)
    
    const fields = categoryDetails?.fields
    const allocationAccountLine =  categoryDetails?.allocation_accountLine
    const expenseAllcationAccountLine = categoryDetails?.expenseAllocation_accountLine


    const [cat, setCat] = useState(true)
    const [exp, setExp] = useState(false)
    
    const handleAccountLineChange = (type, value)=>{
        const allocations_copy = JSON.parse(JSON.stringify(allocations))
        const ind = allocations_copy[travelType].findIndex(itm=>itm.categoryName == categoryName)
        if(type == 'exp'){
            allocations_copy[travelType][ind].expenseAllocation_accountLine = value
        } else allocations_copy[travelType][ind].allocation_accountLine = value
        
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

            <div>
                {/* by class, by budget*/}
                <div className="w-fit h-6 justify-start items-center gap-4 inline-flex mt-5">
                    <div onClick={()=>{setCat(true); setExp(false)}} className={`${ cat? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer`}>Allocation</div>
                    <div onClick={()=>{setCat(false); setExp(true)}} className={`${ exp? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500' } text-xs font-medium font-cabin cursor-pointer `}>Expense Allocation</div>
                </div> 
                <hr className='mt-2'/>
            </div>
            
            <div className={`w-full h-fit bg-white transition-opacity transition-max-height delay-1000  ${collapse? 'hidden opacity-0 max-height-0': 'opacity-100 max-height-[1000px]' }`} >
                <div className='mt-10'>
                    <p className='text-neutral-800 text-base'>Captured Fields</p>
                    <div className='flex gap-2 divide-x'>
                        {fields?.length>0 && fields.map((field, fieldIndex)=>
                            <div key={fieldIndex} className='flex gap-4 pl-1 items-center'>
                                <p className='text-neutral-700 text-sm font-cabin'>{field.name}</p>
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
                
                { cat && 
                    <div className='mt-4 '>
                        <Input
                            value={allocationAccountLine}
                            onChange={(e)=>handleAccountLineChange('cat', e.target.value)} 
                            title='Category Account Line' />
                    </div>
                }

                { exp && 
                    <div className='mt-4 '>
                        <Input
                            value={expenseAllcationAccountLine}
                            onChange={(e)=>handleAccountLineChange('exp', e.target.value)} 
                            title='Expense Account Line' />
                    </div>
                }

                </div>
                
                {cat && <ExpenseAllocation type='cat' orgHeaders={orgHeaders} setShowAddHeaderModal={setShowAddHeaderModal} allocations={allocations} setAllocations={setAllocations} categoryName={categoryName} travelType={travelType} />}
                {exp && <ExpenseAllocation type="exp" orgHeaders={orgHeaders} setShowAddHeaderModal={setShowAddHeaderModal} allocations={allocations} setAllocations={setAllocations} categoryName={categoryName} travelType={travelType} />}

            <div className='mt-4 flex flex-row-reverse'>
                <HollowButton title='Save Changes' isLoading={networkStates?.isUploading} onClick={()=>saveChanges()} />
            </div>

            </div>
        </div>)
      
}

function ExpenseAllocation({orgHeaders, type, setShowAddHeaderModal, allocations, setAllocations, categoryName, travelType}){

    const handleAllocationHeaderChange = (e, headerIndex)=>{
        console.log(e.target.value, categoryName, headerIndex)
        const allocations_copy = JSON.parse(JSON.stringify(allocations))
        const ind = allocations[travelType].findIndex(itm=>itm.categoryName == categoryName)

        if(type == 'exp'){
            if(e.target.checked){
                allocations_copy[travelType][ind].expenseAllocation.push(orgHeaders[headerIndex])
            }else{
                allocations_copy[travelType][ind].expenseAllocation = allocations_copy[travelType][ind].expenseAllocation.filter(itm=>itm.headerName != orgHeaders[headerIndex].headerName)
            }
        }else{
            if(e.target.checked){
                allocations_copy[travelType][ind].allocation.push(orgHeaders[headerIndex])
            }else{
                allocations_copy[travelType][ind].allocation = allocations_copy[travelType][ind].expenseAllocation.filter(itm=>itm.headerName != orgHeaders[headerIndex].headerName)
            }
        }

        setAllocations(allocations_copy)
        
    }

    return(<>
        {orgHeaders.length>0 && 
        <div className='mt-10'>
            <p className='text-base text-neutral-800'>{`Allocate ${type=='exp'? 'Expenses for' : ''} this category`}</p>
            <p className='text-sm text-neutral-600'>We have identified following entities on which you might be allocating </p>
            <div className='flex flex-col gap-1 mt-2'>
                {orgHeaders.map((header, headerIndex) => 
                <div key={headerIndex} className='flex items-center justify-between'>
                    <p className='text-sm flex-1 text-neutral-700'>{header.headerName}</p>
                    <div className='flex-1 inline-flex'>
                        <Checkbox checked={ type == 'exp'? allocations[travelType].find(c=>c.categoryName == categoryName).expenseAllocation.find(h=>h.headerName == header.headerName) : allocations[travelType].find(c=>c.categoryName == categoryName).allocation.find(h=>h.headerName == header.headerName)} onChange={(e)=>handleAllocationHeaderChange(e, headerIndex)} />
                    </div>
                </div>)}
            </div>

            <div className='mt-4 w-fit h-10 inline-flex items-center'>
                <p className='text-indigo-600 font-cabin text-sm cursor-pointer' onClick={()=>setShowAddHeaderModal(true)}> Add additional org level entities</p>
            </div>
        </div>}
    </>)
}