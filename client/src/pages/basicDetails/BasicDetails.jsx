import { useState, useEffect } from 'react'
import leftArrow_icon from '../../assets/arrow-left.svg'
import Select from '../../components/common/Select'
import ObjectSelect from '../../components/custom/page_1/ObjectSelect'
import MultiSearch from '../../components/common/MultiSearch'
import Button from '../../components/common/Button'
import { useNavigate } from 'react-router-dom'
import Icon from '../../components/common/Icon'
import InputPercentage from '../../components/common/InputPercentage'
import Checkbox from '../../components/common/Checkbox'
import TableItem from '../../components/table/TableItem'
import { postTravelRequest_API, updateTravelRequest_API, policyValidation_API } from '../../utils/api'
import CloseButton from '../../components/common/closeButton'
import PopupMessage from '../../components/common/PopupMessage'
import Error from '../../components/common/Error'
import { useQuery } from '../../utils/hooks'
import { camelCaseToTitleCase } from '../../utils/handyFunctions'
import CommentBox from '../../components/common/CommentBox'
import { close_icon, close_gray_icon } from '../../assets/icon'
import Search from '../../components/Search/Index'


export default function BasicDetails({ onBoardingData, formData, setFormData }) {
    const DASHBOARD_URL = import.meta.env.DASHBOARD_URL;

    const navigate = useNavigate()
    //loader state
    const [isLoading, setIsLoading] = useState(false)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    

    //onboarding data...
    const APPROVAL_FLAG = onBoardingData?.APPROVAL_FLAG
    const MANAGER_FLAG = onBoardingData?.MANAGER_FLAG
    const DELEGATED_FLAG = onBoardingData?.DELEGATED_FLAG
    const listOfAllManagers = onBoardingData?.listOfManagers
    const travelAllocations = onBoardingData?.travelAllocations?.allocation
    const tripPurposeOptions = onBoardingData?.tripPurposeOptions
    const delegatedFor = onBoardingData?.delegatedFor
    const employeeGroups = onBoardingData?.employeeGroups ?? []
    const travelAllocationFlags = onBoardingData?.travelAllocationFlags ?? { level1: false, level2: false, level3: false }

    //console.log(onBoardingData)

    //popup message
    const [showPopup, setshowPopup] = useState(false)
    const [popupMessage, setPopupMessage] = useState(null)
    const [tripPurposeSearchVisible, setTripPurposeSearchVisible] = useState(false);
    const [approversSearchVisible, setApproversSearchVisible] = useState(false);

    //console.log(formData, 'form data')


    //local states
    const [tripPurposeViolationMessage, setTripPurposeViiolationMessage] = useState(formData.travelViolations.tripPurposeViolationMessage)
    const [errors, setErrors] = useState({ tripPurposeError: { set: false, message: 'Trip Purpose is required' }, tripPurposeDescriptionError: { set: false, message: 'Trip Purpose description is required' }, approversError: { set: false, message: 'Please select approvers' } })

    async function checkRequiredFields() {
        return new Promise((resolve, reject) => {

            let allowSubmit = true;

            if (formData.tripPurpose == null || formData.tripPurpose == 'Not Selected') {
                setErrors(pre => {
                    return { ...pre, tripPurposeError: { ...pre.tripPurposeError, set: true } }
                })
            }
            else {
                setErrors(pre => {
                    return { ...pre, tripPurposeError: { ...pre.tripPurposeError, set: false } }
                })
            }

            if (formData.tripPurposeDescription == null) {
                setErrors(pre => {
                    return { ...pre, tripPurposeDescriptionError: { ...pre.tripPurposeDescriptionError, set: true } }
                })
            }
            else {
                setErrors(pre => {
                    return { ...pre, tripPurposeDescriptionError: { ...pre.tripPurposeDescription, set: false } }
                })
            }

            // if(!formData?.approvers?.length>0){
            //     setErrors(pre=>{
            //         return {...pre, approversError:{...pre.approversError, set:true}}
            //     })
            // } 
            // else{
            //     setErrors(pre=>{
            //         return {...pre, approversError:{...pre.approversError, set:false}}
            //     })
            // }

            if (onBoardingData.approvalFlow != null && formData?.approvers?.length != onBoardingData?.approvalFlow?.length) {
                setErrors(pre => {
                    return { ...pre, approversError: { ...pre.approversError, message: `Please select ${onBoardingData?.approvalFlow?.length} approver/s`, set: true } }
                })
            }
            else {
                setErrors(pre => {
                    return { ...pre, approversError: { ...pre.approversError, set: false } }
                })
            }

            if (formData.tripPurpose == null || formData.tripPurposeDescription == null || (onBoardingData.approvalFlow != null && formData?.approvers?.length != onBoardingData?.approvalFlow?.length)) {
                allowSubmit = false
            }
            else allowSubmit = true

            resolve(allowSubmit)
        })
    }

    const handleContinueButton = async () => {
        setIsLoading(true)

        //console.log(formData)
        let allowSubmit = false
        //check required fields
        //console.log('checking required fields');

        allowSubmit = await checkRequiredFields()

        //console.log('submission allowed :', allowSubmit)

        setIsLoading(false)

        if (allowSubmit) {
            setIsLoading(true)
            //console.log('submit allowed')
            if (!formData.travelRequestId) {
                //console.log('posting tr')
                const res = await postTravelRequest_API({ ...formData, travelRequestState: 'section 0', travelRequestStatus: 'draft', })

                if (res.err) {
                    //console.log('Error in submission')
                    //setLoadingErrMsg(res.err)
                    window.parent.postMessage({message:"cash message posted" , 
                    popupMsgData: { showPopup:true, message:res.err, iconCode: "102" }}, DASHBOARD_URL);
                    return
                }

                const travelRequestId = res.data.travelRequestId

                //console.log(travelRequestId, 'travel request id')
                const formData_copy = JSON.parse(JSON.stringify(formData))
                formData_copy.travelRequestId = travelRequestId
                setFormData(formData_copy)
                navigate(`/modify/travel/${travelRequestId}/section1`)
            }
            else {
                setIsLoading(true)
                navigate(`/modify/travel/${formData.travelRequestId}/section1`)
            }
        }
    }

    useEffect(() => {
        //console.log(errors, 'errors')
    }, [errors])

    //update form data
    const updateTripPurpose = async (option) => {

        let tripPurposeViolationMessage_ = null
        //console.log(employeeGroups, 'employeeGroups')
        const res = await policyValidation_API({ tenantId: formData.tenantId, type: formData.travelType, policy: 'Allowed Trip Purpose', value: option, groups: employeeGroups })
        if (!res.err) {
            tripPurposeViolationMessage_ = res.data.response.violationMessage
            setTripPurposeViiolationMessage(tripPurposeViolationMessage_)
            //console.log(tripPurposeViolationMessage_)
            //console.log(res.data)
        }

        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.tripPurpose = option
        formData_copy.travelViolations.tripPurposeViolationMesssage = tripPurposeViolationMessage_
        setFormData(formData_copy)
    }

    const updateApprovers = (option) => {
        //console.log(option, 'option')
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.approvers.push({ name: option.employeeName, empId: option.employeeId, status: 'pending approval', imageUrl:option.imageUrl });
        setFormData(formData_copy);
    }

    const updateTravelRequestCreatedFor = (option) => {
        //update form data
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.createdFor = { name: option.name, empId: option.empId }


        //update delegator satates if applicable
        if (DELEGATED_FLAG && option.empId) {

            formData_copy.raisingForDelegator = true

            const delegator = delegatedFor.filter(employee => employee.empId == formData_copy.createdFor.empId)
            const nameOfDelegator = delegator[0].name

            formData_copy.nameOfDelegator = nameOfDelegator

            const teamMembers = delegator[0].teamMembers
            formData_copy.delegatorsTeamMembers = teamMembers

            //this logic might not be right if there is a fuckup in integrating the company.
            //some explicit variable from backend might be needed
            formData_copy.isDelegatorManager = teamMembers && teamMembers.length > 0
        }

        else {
            formData_copy.raisingForDelegator = false
            formData_copy.nameOfDelegator = null
            formData_copy.delegatorsTeamMembers = []
            formData_copy.isDelegatorManager = false
        }

        setFormData(formData_copy)
    }

    const handleBookingForSelf = () => {
        //update form data
        const formData_copy = JSON.parse(JSON.stringify(formData))
        if (formData_copy.bookingForSelf) {
            formData_copy.bookingForSelf = false
            formData_copy.bookingForTeam = true
        }
        else {
            formData_copy.bookingForSelf = true
            formData_copy.bookingForTeam = false
        }

        formData_copy.createdFor = { name: null, empId: null }
        formData_copy.selectedTravelAllocationHeaders = []
        formData_copy.selectDelegatorTeamMembers = false
        formData_copy.isDelegatorManager = false
        formData_copy.delegatorsTeamMembers = []
        formData_copy.raisingForDelegator = false
        formData_copy.nameOfDelegator = null
        formData_copy.teamMembers = []
        setFormData(formData_copy)
    }

    const handleBookingForTeam = () => {
        //update form data
        const formData_copy = JSON.parse(JSON.stringify(formData))
        if (formData_copy.bookingForTeam) {
            formData_copy.bookingForSelf = true
            formData_copy.bookingForTeam = false
        }
        else {
            formData_copy.bookingForSelf = false
            formData_copy.bookingForTeam = true
        }

        formData_copy.createdFor = { name: null, empId: null }
        formData_copy.selectedTravelAllocationHeaders = []
        formData_copy.isDelegatorManager = false
        formData_copy.delegatorsTeamMembers = []
        formData_copy.raisingForDelegator = false
        formData_copy.nameOfDelegator = null
        formData_copy.selectDelegatorTeamMembers = false
        formData_copy.teamMembers = []
        setFormData(formData_copy)
    }

    const updateSelectDelegatorTeamMembers = (value) => {
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.selectDelegatorTeamMembers = value
        formData_copy.teamMembers = []
        setFormData(formData_copy)
    }

    const handleDescriptionChange = (e)=>{
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.tripPurposeDescription = e.target.value;
        setFormData(formData_copy)
    }

    //form states
    const [selectedTravelAllocationHeaders, setSelectedTravelAllocationHeaders] = useState(formData.travelAllocationHeaders)
    //team member state 
    const [selectedTeamMembers, setSelectedTeamMembers] = useState(formData?.teamMembers?.map(item => item.empId))

    useEffect(() => {
        //console.log(formData.teamMembers)
    }, [selectedTeamMembers])

    const handleTeamMemberSelect = (e, id) => {

        //console.log(id)
        //console.log(selectedTeamMembers.includes(id))
        let updatedTeamMembers = []

        if (e.target.checked) {
            if (!selectedTeamMembers.includes(id)) {
                updatedTeamMembers = selectedTeamMembers.slice()
                updatedTeamMembers.push(id)
                setSelectedTeamMembers(updatedTeamMembers)
            }
        }
        else {
            if (selectedTeamMembers.includes(id)) {
                //console.log('this also ran')
                const index = selectedTeamMembers.indexOf(id)
                updatedTeamMembers = selectedTeamMembers.slice()
                updatedTeamMembers.splice(index, 1)
                //console.log(updatedTeamMembers)
                setSelectedTeamMembers(updatedTeamMembers)
            }
        }


        const formData_copy = JSON.parse(JSON.stringify(formData))

        let teamMembers_ = []

        if (formData.selectDelegatorTeamMembers && !formData.bookingForTeam) {
            formData.delegatorsTeamMembers.forEach(item => {
                if (updatedTeamMembers.includes(item.empId)) {
                    teamMembers_.push(item)
                }
            })
        }

        if (formData.bookingForTeam && !formData.selectDelegatorTeamMembers) {
            teamMembers.forEach(item => {
                if (updatedTeamMembers.includes(item.empId)) {
                    teamMembers_.push(item)
                }
            })
        }


        formData_copy.teamMembers = teamMembers_
        setFormData(formData_copy)
    }

    const handleAllocationHeaderSelect = (headerName, option) => {
        let optionPresent = false

        if (selectedTravelAllocationHeaders && selectedTravelAllocationHeaders.length > 0) {
            selectedTravelAllocationHeaders.forEach(item => {
                if (item.headerName.toLowerCase() === headerName.toLowerCase() && item.headerValue.toLowerCase() == option.toLowerCase()) {
                    optionPresent = true
                    return
                }
            })
        }

        if (!optionPresent) {
            setSelectedTravelAllocationHeaders((pre) => [...pre, { headerName, headerValue: option }])
        }

    }

    useEffect(() => {
        //update form data
        const formData_copy = JSON.parse(JSON.stringify(formData))
        formData_copy.travelAllocationHeaders = selectedTravelAllocationHeaders
        setFormData(formData_copy)
    }, [selectedTravelAllocationHeaders])

    return (<>
        {isLoading && <Error message={loadingErrMsg} />}
        {!isLoading && <>
            <div className="w-fit min-w-[400px] h-full relative bg-white sm:px-8 px-6 py-6 select-none mx-auto">
                {/* Rest of the section */}
                <div className="w-full h-full px-6">
                    {/* back link */}
                    <div className='flex items-center gap-4 cursor-pointer'>
                        {/* <img className='w-[24px] h-[24px]' src={leftArrow_icon} onClick={()=>navigate(props.lastPage)} /> */}
                        <p className='text-neutral-600 text-md font-semibold font-sans-serif'>{`Travel Request`}</p>
                    </div>

                    {/* Rest of the section */}

                    <legend className='font-cabin text-neutral-700 text-sm mt-6'>Select type of travel?</legend>
                    <fieldset className='flex flex-col sm:flex-row gap-4 sm:justify-between'>
                        <div>
                            <div className='flex gap-4 border border-indigo-400 max-w-[300px] accent-indigo-600 px-6 py-2 rounded mt-4 cursor-pointer'  onClick={() => setFormData(pre => ({ ...pre, travelType: 'international' }))}>
                                <input type="radio" id="International" name="travelType" value="traveltype" checked={formData.travelType == 'international'} readOnly />
                                <div>
                                    <p className='font-cabin text-neutral-800 text-normal tracking-wider'> International </p>
                                    <p className='font-cabin -mt-1 text-neutral-600 text-xs tracking-tight'>Travelling out of country</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className='flex gap-4 border border-indigo-400 max-w-[300px] accent-indigo-600 px-6 py-2 rounded mt-4 cursor-pointer'   onClick={() => setFormData(pre => ({ ...pre, travelType: 'domestic' }))}>
                                <input type="radio" id="Domestic" name="travelType" value="traveltype" checked={formData.travelType == 'domestic'} readOnly />
                                <div>
                                    <p className='font-cabin text-neutral-800 text-normal tracking-wider'> Domestic </p>
                                    <p className='font-cabin -mt-1 text-neutral-600 text-xs tracking-tight'>Travelling within country</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className='flex gap-4 border border-indigo-400 max-w-[300px] accent-indigo-600 px-6 py-2 rounded mt-4 cursor-pointer'   onClick={() => setFormData(pre => ({ ...pre, travelType: 'local' }))} >
                                <input type="radio" id="Local" name="travelType" value="traveltype" checked={formData.travelType == 'local'} readOnly />
                                <div>
                                    <p className='font-cabin text-neutral-800 text-normal tracking-wider'> Local </p>
                                    <p className='font-cabin -mt-1 text-neutral-600 text-xs tracking-tight'>Travelling nearby</p>
                                </div>
                            </div>
                        </div>

                    </fieldset>

                    {/* only for manager */}
                    {MANAGER_FLAG && <>
                        <div className="w-fit h-6 justify-start items-center gap-4 inline-flex mt-5">
                            <div onClick={handleBookingForSelf} className={`${formData.bookingForSelf ? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500'} text-xs font-medium font-cabin cursor-pointer transition`}>For You </div>
                            <div onClick={handleBookingForTeam} className={`${formData.bookingForTeam ? 'text-zinc-100 bg-indigo-600 px-2 py-1 rounded-xl' : 'text-zinc-500'} text-xs font-medium font-cabin cursor-pointer transition`}>For Team</div>
                        </div>

                        <hr className='mt-2 -mb-4' /> </>}
                    {/* only for manager.. ends.... */}

                    {/* form */}

                    <div className='flex flex-col sm:flex-row gap-10'>
                        {/* Trip Purpose */} 
                        <div className='mt-8 flex gap-8 flex-wrap items-center'>
                            <div className='relative flex flex-col h-[73px] justify-start item-start gap-2'>
                                <div className="text-zinc-600 text-sm font-cabin select-none">Select trip purpose</div>
                                <div onClick={(e)=>{e.stopPropagation(); setTripPurposeSearchVisible(pre=>!pre)}} className='h-[40px] w-full px-4 py-1 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-sm items-center transition ease-out hover:ease-in cursor-pointer'>
                                    <div className="text-neutral-700 text-normal font-normal font-cabin">{formData.tripPurpose}</div>
                                </div>

                                {errors?.tripPurposeError?.set && (formData.tripPurpose == null || formData.tripPurpose == undefined || formData.tripPurpose == '' || formData.tripPurpose == 'Not Selected')  && <p className='absolute top-[58px] text-red-600 font-cabin text-sm whitespace-nowrap'>{errors?.tripPurposeError?.message}</p>}

                                {tripPurposeSearchVisible && <div className='absolute top-[73px]'>
                                    <Search 
                                        visible={tripPurposeSearchVisible}
                                        setVisible={setTripPurposeSearchVisible}
                                        title='Select trip purpose'
                                        placeholder='Select purpose of trip'
                                        options={tripPurposeOptions}
                                        currentOption={formData.tripPurpose}
                                        onSelect={(option) => { updateTripPurpose(option) }}/>
                                </div>}
                            </div>
                            
                        </div>
                    
                        {/* Approvers */}
                        {APPROVAL_FLAG && <div className='mt-8 flex items-center relative'>
                            <div className='flex flex-col h-[73px] justify-start item-start gap-2'>
                                <div className="text-zinc-600 text-sm font-cabin select-none">Approvers</div>
                                <div className='flex gap-2 flex-wrap'>
                                    {formData.approvers && formData.approvers.length>0 && formData.approvers.map((approver, index)=>
                                    <div
                                        key={index}
                                        onClick={()=>setFormData(pre=>({...pre, approvers:pre.approvers.filter(emp=>emp.employeeId != approver.employeeId)}))}
                                        className='h-[40px] px-2 py-.5 flex gap-2 bg-gray-100 hover:bg-gray-200 rounded-sm items-center transition ease-out hover:ease-in cursor-pointer'>
                                        <img src={approver?.imageUrl??'https://blobstorage0401.blob.core.windows.net/avatars/IDR_PROFILE_AVATAR_27@1x.png'} className='w-8 h-8 rounded-full' />
                                        <div className="text-neutral-700 text-normal text-sm sm:text-[14.5px] font-cabin -mt-1 sm:mt-0">{approver.name}</div>
                                        <div className='-mt-1'>
                                            <img src={close_gray_icon} className='w-4 h-4'/>
                                        </div>
                                    </div>)}
                                    {formData.approvers.length < onBoardingData?.approvalFlow?.length && formData.approvers.length != 0 && <p onClick={()=>setApproversSearchVisible(pre=>!pre)} className='text-sm text-blue-700 hover:text-blue-800 underline cursor-pointer'>Add More</p>}
                                    {formData.approvers && formData.approvers.length == 0 && <p onClick={(e)=>{e.stopPropagation(); setApproversSearchVisible(pre=>!pre)}} className='text-sm text-neutral-500 font-cabin cursor-pointer'>{'Unassigned'}</p>}
                                    {errors?.approversError?.set && formData?.approvers?.length < onBoardingData?.approvalFlow?.length  && <p className='absolute top-[58px] text-red-600 font-cabin text-sm whitespace-nowrap'>{errors?.approversError?.message}</p>}
                                </div>
                            </div>

                            {approversSearchVisible && <div className='absolute'>
                                <Search
                                    visible={approversSearchVisible}
                                    setVisible={setApproversSearchVisible}
                                    searchChildren={'employeeName'}
                                    title='Who will Approve this?'
                                    placeholder="Name's of managers approving this"
                                    onSelect={(option) => { updateApprovers(option) }}
                                    error={errors.approversError}
                                    currentOption={formData.approvers && formData.approvers.length > 0 ? formData.approvers : []}
                                    options={listOfAllManagers} />
                                </div>}
                        </div>}
                    </div>
                    
                    <div className='mt-8'>
                        <CommentBox title='Trip Purpose Description' onchange={handleDescriptionChange} value={formData.tripPurposeDescription} error={errors.tripPurposeDescriptionError} />
                    </div>
                    

                    <hr className='my-8' />


                    {/* allocating travel budget... will be displayed if travel allocation headers are present */}
                    {!travelAllocationFlags.level3 && travelAllocations?.length > 0 && <div>
                        <p className='text-base font-medium text-neutral-700 font-cabin'>Allocate travel.</p>

                        <div className='mt-8 flex flex-wrap gap-4'>
                            {travelAllocations?.length > 0 && travelAllocations.map((header, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <Select
                                            currentOption={formData?.travelAllocationHeaders[index]?.headerValue}
                                            options={travelAllocations[index].headerValues}
                                            onSelect={(option) => { handleAllocationHeaderSelect(travelAllocations[index].headerName, option) }}
                                            placeholder={`Select ${travelAllocations[index].headerName}`}
                                            title={camelCaseToTitleCase(travelAllocations[index].headerName)} />
                                    </React.Fragment>
                                )
                            })}
                        </div>

                        {selectedTravelAllocationHeaders && selectedTravelAllocationHeaders.length == 0 &&
                            <div className='mt-6 flex gap-4'>
                                <input type='radio' />
                                <p className='text-zinc-800 text-sm font-medium font-cabin'>Not Sure</p>
                            </div>}

                    </div>}

                    {/* slect team members */}
                    {((MANAGER_FLAG && formData.bookingForTeam) || formData.isDelegatorManager) && <div className='mt-8'>
                        <div className='flex gap-4 items-center'>
                            {formData.isDelegatorManager && !formData.bookingForTeam && <Checkbox checked={formData.selectDelegatorTeamMembers} onClick={(e) => { updateSelectDelegatorTeamMembers(e.target.checked) }} />}
                            <p className='text-base font-medium text-neutral-700 font-cabin'>{`${formData.isDelegatorManager && !formData.bookingForTeam ? `Select ${formData.nameOfDelegator.split(' ')[0]}'s team members for this trip` : 'Select team members for this trip'}`}</p>
                        </div>

                        {/* table */}
                        {(formData.selectDelegatorTeamMembers || formData.bookingForTeam) &&
                            <div className='mt-4 w-full h-fit max-h-[800px] px-auto py-8 border border-neutral-200 inline-flex rounded-xl justify-center items-center'>
                                <div className='w-3/4 mx-1/4 flex flex-row justify-between '>

                                    {MANAGER_FLAG && teamMembers && !formData.selectDelegatorTeamMembers &&
                                        <>
                                            <CheckboxCol checked={selectedTeamMembers} onClick={(e, id) => handleTeamMemberSelect(e, id)} employees={teamMembers} />
                                            <EmpIdCol employees={teamMembers} />
                                            <NameCol employees={teamMembers} />
                                            <DesignationCol employees={teamMembers} />

                                        </>
                                    }

                                    {formData.isDelegatorManager && formData.delegatorsTeamMembers && formData.selectDelegatorTeamMembers && !formData.bookingForTeam &&
                                        <>
                                            <CheckboxCol checked={selectedTeamMembers} onClick={(e, id) => handleTeamMemberSelect(e, id)} employees={formData.delegatorsTeamMembers} />
                                            <EmpIdCol employees={formData.delegatorsTeamMembers} />
                                            <NameCol employees={formData.delegatorsTeamMembers} />
                                            <DesignationCol employees={formData.delegatorsTeamMembers} />
                                        </>
                                    }

                                </div>
                            </div>}

                    </div>}

                    <div className='my-8 w-full flex justify-end items-center'>
                        <Button
                            variant='fit'
                            text='Continue'
                            onClick={handleContinueButton} />
                    </div>

                </div>
            </div>
            <PopupMessage message={popupMessage} showPopup={showPopup} setshowPopup={setshowPopup} />
        </>}
    </>)
}

function CheckboxCol(props) {
    const employees = props.employees
    const onClick = props.onClick
    const checked = props.checked || []

    return (
        <div className='flex-col justify-start items-start gap-6 inline-flex'>
            <div className="flex-col justify-start items-center gap-2 flex">
                <div className="max-w-[134px] py-2 h-10 justify-start items-center inline-flex">
                </div>
                {employees && employees.map((employee, index) =>
                    <div key={index} className="max-w-[134px] shrink py-2 h-10 justify-start items-center inline-flex">
                        <Checkbox onClick={(e, id) => onClick(e, id)} checked={checked.includes(employee.empId)} id={employee.empId} />
                    </div>)}
            </div>
        </div>
    )
}

function NameCol(props) {
    const employees = props.employees

    return (
        <div className='flex-col justify-start items-start gap-6 inline-flex'>
            <div className="flex-col justify-start items-center gap-2 flex">
                <TableItem text='Name' header='true' />
                {employees && employees.map((employee, index) => <TableItem key={index} text={employee.name} />)}
            </div>
        </div>
    )
}

function EmpIdCol(props) {
    const employees = props.employees

    return (
        <div className='flex-col sr-only md:sr-only lg:not-sr-only justify-start items-start gap-6 inline-flex'>
            <div className="flex-col justify-start items-center gap-2 flex">
                <TableItem text='Employee Id' header='true' />
                {employees && employees.map((employee, index) => <TableItem key={index} text={employee.empId} />)}
            </div>
        </div>
    )
}

function DesignationCol(props) {
    const employees = props.employees
    return (
        <div className='flex-col sr-only md:not-sr-only justify-start items-start gap-6 inline-flex'>
            <div className="flex-col justify-start items-center gap-2 flex">
                <TableItem text='Designation' header='true' />
                {employees && employees.map((employee, index) => <TableItem key={index} text={employee.designation} />)}
            </div>
        </div>
    )
}