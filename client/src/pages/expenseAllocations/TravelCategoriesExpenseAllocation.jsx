import back_icon from '../../assets/arrow-left.svg'
import Icon from '../../components/common/Icon'
import HollowButton from '../../components/common/HollowButton';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useEffect, useState } from 'react';
import { getTenantOrgHeaders_API, updateTravelCategoriesAllocation_API, getTenantTravelCategoriesExpenseAllocation_API } from '../../utils/api';
import { camelCaseToTitleCase, titleCaseToCamelCase } from "../../utils/handyFunctions";
import UploadAdditionalHeaders from './UploadAdditionalHeaders';
import Checkbox from '../../components/common/Checkbox';
import close_icon from "../../assets/close.svg"
import Input from '../../components/common/Input';
import arrow_down from "../../assets/chevron-down.svg";
import remove_icon from '../../assets/XCircle.svg'
import cross_icon from '../../assets/x.svg'

export default function ({tenantId}) {
    const [showSkipModal, setShowSkipModal] = useState(false);
    const [travelCategoriesExpenseAllocationSetup, setTravelCategoriesExpenseAllocationSetup] =useState(true)
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const [orgHeaders, setOrgHeaders] = useState(true)
    const [showAddHeaderModal, setShowAddHeaderModal] = useState(false)
    const [showAddEditFieldsModal, setShowEditFieldsModal] = useState(false)
    const [updatedOrgHeadeers, setUpdatedOrgHeaders] = useState(null)
    const [selectedOrgHeaders, setSelectedOrgHeaders] = useState([])
    const [showAddCategoryNameModal, setShowAddCategoryNameModal] = useState(false)
    const [fields, setFields] = useState([
            {name:'Vendor Name', type:'text'},
            {name:'Bill Number', type:'number'},
            {name:'Bill Date', type:'date'},
            {name:'Description', type:'text'},
            {name: 'Unit Cost', type:'amount'},
            {name: 'Total Cost', type: 'amount'},
            {name: 'Tax Amount', type: 'amount'},
            {name: 'Total Amount', type: 'amount'}
          ])

    let tmpCategoryName = undefined

    useEffect(()=>{
        if(travelCategoriesExpenseAllocationSetup){
            (async function(){
                setIsLoading(true)
                const res = await getTenantOrgHeaders_API({tenantId})
                const categories_res = await getTenantTravelCategoriesExpenseAllocation_API({tenantId})
                console.log(categories_res.data)

                if(res.err || categories_res.err){
                    console.log(err)
                    setLoadingErrMsg(res.err??categories_res.err)
                    return
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
                    setSelectedOrgHeaders(categories_res.data.travelExpenseAllocation)
                    setCategories(categories_res.data?.travelExpenseAllocation?.map(al=>({name:al.categoryName, collapsed:true})))
                    setIsLoading(false)
                    setLoadingErrMsg(null)
                }
    
            })()
        }

    }, [travelCategoriesExpenseAllocationSetup])


    const handleAddCategory = (categoryName) => {
        if(categoryName == '' || categoryName == undefined){
            alert('Please enter category name to continue')
            return
        }
        setCategories(pre=>[...pre, {name:categoryName, state:{collapsed:true} }])
        setShowAddCategoryNameModal(false)
    }

    const handleAllocationHeaderChange = async (e, categoryName, index)=>{
        console.log(e.target.checked, index)
        let selectedOrgHeaders_copy = JSON.parse(JSON.stringify(selectedOrgHeaders))
        if(e.target.checked){
            const indexOfCategory = selectedOrgHeaders.findIndex(category=>category?.categoryName?.toLowerCase() == categoryName.toLowerCase())
            if(indexOfCategory > -1){
                const indexOfElement = selectedOrgHeaders[indexOfCategory].allocations.findIndex(header=>header.headerName == orgHeaders[index].headerName)
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

    const handleContinue = async ()=>{
        //assuming values are set
        setIsLoading(true)
        const res = await updateTravelCategoriesAllocation_API({tenantId, allocationHeaders: selectedOrgHeaders})
        if(res.err){
            setLoadingErrMsg(res.err)
            setIsLoading(false)
            console.log(res.err)
            return
        }

        //navigate to next page
    }

    const removeCategoryField = (index)=>{
        console.log(index, 'index...')
        const fields_copy = JSON.parse(JSON.stringify(fields))
        fields_copy.splice(index,1)
        console.log(fields_copy)
        setFields(fields_copy)
    }

    const handleCategoryFieldNameChange = (e, index)=>{
        let fields_copy = JSON.parse(JSON.stringify(expenseCategoryFields))
        fields_copy[index].name = e.target.value
        setFields(fields_copy)
    }

    const handleCategoryFieldTypeChange = (e, index)=>{
        let fields_copy = JSON.parse(JSON.stringify(expenseCategoryFields))
        fields_copy[index].type = e.target.value
        setFields(fields_copy)
    }

    const updateTravelCategoriesFields = ()=>{
        console.log(fields)
    }

    return(<>

        { <div className="bg-slate-50 h-[100vh] min-h-calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full">
            
            <div className='px-6 py-10 bg-white rounded shadow w-full'>
               
                {/* rest of the section */}
                {!travelCategoriesExpenseAllocationSetup &&
                <div className='mt-10 w-full flex flex-col gap-4 text text-lg font-cabin text-neutral-800 '>  
                Would you be interested in a more detailed breakdown of allocations, categorized by 
                different types of travel expenses such as flights, meals, and transportation (cabs, etc.)?
                <br/><br/>
                    
                    <div className='inline-flex w-full justify-between mt-10'>
                        <div className='w-[250px]'>
                            <Button text='Yes' onClick={()=>setTravelCategoriesExpenseAllocationSetup(true)} />
                        </div>
                        <div className='w-[250px] inline-flex justify-end'>
                            <HollowButton title='Skip' onClick={()=>setShowSkipModal(true)} />
                        </div>
                    </div>

                </div>}

                {travelCategoriesExpenseAllocationSetup && 
                <div>
                    <p className='font-cabin text-neutral-800 text-lg'>Let's setup you travel categories expense allocations..</p>
                    <div className='flex justify-between'>
                        <HollowButton title='Add New Category' className='mt-10' onClick={()=>setShowAddCategoryNameModal(true)} />
                    </div>

                    <div className='mt-4 w-fit h-10 inline-flex items-center'>
                        <p className='text-indigo-600 font-cabin text-sm cursor-pointer' onClick={()=>setShowEditFieldsModal(true)} > Add / Remove Captured Fields</p>
                    </div>

                    <div className='mt-2 flex flex-col gap-2'>
                        {categories?.length>0 && categories.map(category=>{
                            return (
                                <Categoy 
                                    title={category.name} 
                                    orgHeaders = {orgHeaders} 
                                    selectedOrgHeaders={selectedOrgHeaders} 
                                    handleAllocationHeaderChange = {handleAllocationHeaderChange} 
                                    setShowAddHeaderModal={setShowAddHeaderModal}
                                    isUploading={isLoading} />)
                        })}
                    </div>

                    {categories.length>0 && selectedOrgHeaders.length>0 &&
                    <div className='flex flex-row-reverse justify-between mt-10'>
                        <Button text='Save Changes' onClick={handleContinue} />
                    </div>}

                </div>}

            </div>
            
            <Modal showModal={showAddCategoryNameModal} setShowAddCategoryNameModal={setShowAddCategoryNameModal}>
                <div className='flex w-full h-10 items-center flex-row-reverse pr-6 pt-6'>
                    <img src={close_icon} onClick={()=>setShowAddHeaderModal(false)}/>
                </div>
                <div className='px-10 pb-10 pt-4'>
                    {/* allow user to add headers*/}
                        <p className='text-neutral-700 text-base font-cabin '>Enter Category Name</p>
                        {/* display empty boxes to add headers*/}
                        <div className='flex flex-wrap gap-2 mt-4'>
                            <div className='flex gap-2 items-center'>
                                <Input placeholder='Header Name' showTitle={false} onBlur={(e)=>{tmpCategoryName = e.target.value}} />
                            </div>
                        </div>

                        <div className='flex justify-between items-center mt-6  '>
                                <Button text='Done' onClick={()=>handleAddCategory(tmpCategoryName)} />
                        </div>
                </div>
            </Modal>


        { showAddEditFieldsModal &&
            <div className="fixed  z-[1000] max-h-[100vh]  overflow-hidden flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none">
                <div className='z-[10001] max-w-[600px] w-[90%] md:w-[75%] lg:w-[60%] min-h-[200px] scroll-none bg-white rounded-lg shadow-md'>
                    <div className=' relative p-10 text text-neutral-400 text-xs font-cabin'>
                        {'Edit Fields'}

                        <div className='mt-4 max-h-[200px] overflow-y-scroll'>
                            <div className='flex flex-col gap-2'>
                                {fields.length>0 && fields.map((field, index)=>(
                                    <div key={index} className='flex flex-wrap gap-4 items-center'>
                                        <Input  showTitle={false} placeholder='eg. Amount' value={field.name} onChange={(e)=>{handleCategoryFieldNameChange(e, index)}} readOnly={checkReadOnly(field?.name)} />
                                        <select value={field.type} disabled={checkReadOnly(field?.name)} onChange={e=>handleCategoryFieldTypeChange(e,index)} className='min-w-[200px] w-full md:w-fit max-w-[403px] h-[45px] flex-col justify-start items-start gap-2 inline-flex px-6 py-2 text-neutral-700 w-full  h-full text-sm font-normal font-cabin border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600'>
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
                                        {!checkReadOnly(field?.name) && <img src={remove_icon} onClick={()=>removeCategoryField(index)} />}
                                    </div>
                                ))}
                            </div>
                        </div>


                    <div className='flex flex-wrap mt-10 items-center justify-between'>
                        <div className='w-[200px] '>
                                <HollowButton title='Add Fields' onClick={()=>setFields(prev=>[...prev, {name:'', type:''}])} />
                            </div>

                            <Button text='Save Changes' onClick={updateTravelCategoriesFields} />
                           
                    </div>
                    <div className='absolute top-4 right-4'>
                            <img className='cursor-pointer' src={cross_icon} 
                                    onClick={()=>{
                                        setShowEditFieldsModal(false)
                                    }} />
                        </div>
                    </div>
                </div>
            </div>
        }

        </div>}


        </>
    );
  }


  function Categoy(props){
    const title = props.title || 'Title'
    const [collapse, setCollapse] = useState(true)
    const handleAllocationHeaderChange = props.handleAllocationHeaderChange
    const orgHeaders = props.orgHeaders
    const selectedOrgHeaders = props.selectedOrgHeaders
    const setShowAddHeaderModal = props.setShowAddHeaderModal
    const isUploading = props.isUploading??false

 
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
                <div className={`w-full h-fit bg-white transition-opacity transition-max-height delay-1000  ${collapse? 'hidden opacity-0 max-height-0': 'opacity-100 max-height-[1000px]' }`} >
                    <ExpenseAllocation selectedOrgHeaders={selectedOrgHeaders} orgHeaders={orgHeaders} setShowAddHeaderModal={setShowAddHeaderModal} handleAllocationHeaderChange={handleAllocationHeaderChange} category={title} />
                    <div className='mt-4 flex flex-row-reverse'>
                        {/* <HollowButton title='Save Changes' isLoading={isUploading} onClick={()=>savePolicies()} /> */}
                    </div>
                </div>
            </div>
        </div> 
        )
    }


    function ExpenseAllocation({orgHeaders, selectedOrgHeaders, setShowAddHeaderModal, handleAllocationHeaderChange, category}){
        return(<>
            {orgHeaders.length>0 && 
            <div className='mt-10'>
                <p className='text-base text-neutral-800'>Allocate Expenses for this category</p>
                <p className='text-sm text-neutral-600'>We have identified following entities on which you might be allocating non-Travel Expenses</p>
                <div className='flex flex-col gap-1 mt-2'>
                    {orgHeaders.map((header, headerIndex) => 
                    <div key={headerIndex} className='flex items-center justify-between'>
                        <p className='text-sm flex-1 text-neutral-700'>{camelCaseToTitleCase(header.headerName)}</p>
                        <div className='flex-1 inline-flex'>
                            <Checkbox checked={selectedOrgHeaders.find(c=>c.categoryName == category)?.allocations.some(h=>h.headerName == header.headerName)} onChange={(e)=>handleAllocationHeaderChange(e, category, headerIndex)} />
                        </div>
                    </div>)}
                </div>
            </div>}
        </>)
    }

    function checkReadOnly(text){
        if(text==null || text==undefined) return false
        else
        return  ['Vendor Name','Bill Number', 'Bill Date', 'Description', 'Unit Cost', 'Total Cost', 'Tax Amount', 'Total Amount'].includes(text)
    }