// import Button from "../../../components/common/Button"
// import Icon from "../../../components/common/Icon"
// import { useNavigate, useParams, useLocation} from "react-router-dom"
// import HollowButton from "../../../components/common/HollowButton"
// import internatinal_travel_icon from '../../../assets/in-flight.svg'
// import domestic_travel_icon from '../../../assets/briefcase.svg'
// import local_travel_icon from '../../../assets/map-pin.svg'
// import non_travel_icon from '../../../assets/paper-money-two.svg'
// import arrow_down from "../../../assets/chevron-down.svg";
// import Checkbox from "../../../components/common/Checkbox"
// import Modal from "../../../components/common/Modal"
// import { useState, useEffect } from "react"
// import back_icon from "../../../assets/arrow-left.svg"
// import HeaderLevelAllocationForm from "./HeaderLevelAllocationForm"
// import HeaderLevel1Allocation from "./HeaderLevel1Allocation"
// import { getTenantTravelAllocations_API } from "../../../utils/api"
// import Error from "../../../components/common/Error"

// export default function (props){
//     const location = useLocation()
//     console.log(location.state)

//     const navigate = useNavigate()
//     const {tenantId} = useParams()
//     const [showSkipModal, setShowSkipModal] = useState(false)
//     const [isLoading, setIsLoading] = useState(true)
//     const [loadingErrMsg, setLoadingErrMsg] = useState(null)

//     const [state, setState] = useState({

//         travelAllocationFlags: {
//             expenseAtHeaderLevelOnly: false,
//             expenseAtHeaderLevel1: false,
//             expenseAtHeaderLevel2: true,
//         },

//         travelCategorySelections: {
//             selectedTravelTypes: ['Domestic', 'International'],
//             selectedInternationalCategories:['Flights', 'Cabs', 'Bus'],
//             selectedDomesticCategories:['Flights', 'Cabs', 'Bus'],
//             selectedInternationalCategories:['Flights', 'Cabs', 'Bus']
//         }
//     })

//     useEffect(()=>{
//         if(showSkipModal){
//             document.body.style.overflow = 'hidden'
//         }
//         else{
//             document.body.style.overflow = 'visible'
//         }
//     },[showSkipModal])

//     console.log(state)


//     useEffect(()=>{
//         (async function(){
//             setIsLoading(true)
//             const res = await getTenantTravelAllocations_API({tenantId})
//             if(res.err){
//                 //setLoadingErrMsg(res.err)
//                 setIsLoading(false)
//                 return
//             }

//             const state = res.data.state
//             setState(state)
//             setIsLoading(false)
//         })()
//     }, [])

//     return(<>
//         {isLoading && <Error message={loadingErrMsg} />}
//         {!isLoading && <>
//         <Icon/>
//         <div className="bg-slate-50 min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] lg:px-[104px] pb-10 w-full tracking-tight">
            
//             <div className='px-6 py-10 bg-white rounded shadow'>
//                  {/* back button and title */}
//                  <div className='flex gap-4'>
//                     <div className='w-6 h-6 cursor-pointer' onClick={()=>navigate(-1)}>
//                         <img src={back_icon} />
//                     </div>

//                     <div className='flex gap-2'>
//                         <p className='text-neutral-700 text-base font-medium font-cabin tracking-tight'>
//                             Setup Expense Book
//                         </p>
//                     </div>
//                 </div>


//                 {state.travelAllocationFlags.expenseAtHeaderLevel2 &&
//                     <div className="mt-10 flex flex-col gap-4">
//                     <CollapsedPolicy 
//                         onClick={() => navigate('international')}
//                         text='International Travel'
//                         icon={internatinal_travel_icon}/>

//                     <CollapsedPolicy 
//                         onClick={() => navigate('domestic')}
//                         text='Domestic Travel'
//                         icon={domestic_travel_icon}/>

//                     <CollapsedPolicy 
//                         onClick={() => navigate('local')}
//                         text='Local Travel'
//                         icon={local_travel_icon}/>
//                 </div>}

//                 {state.travelAllocationFlags.expenseAtHeaderLevel1 && <HeaderLevel1Allocation tenantId={tenantId} />}

//                 {state.travelAllocationFlags.expenseAtHeaderLevelOnly && <HeaderLevelAllocationForm tenantId={tenantId} travelType={'international'}/> }

//             </div>
//         </div>

//         <Modal skippable={false} showModal={showSkipModal} setShowModa={setShowSkipModal}>
//             <div className="p-10">
//                 <p className="text-neutral-700 text">
//                     If you skip this section you won't be able to track your expenses.
//                 </p>
//                 <div className=' mt-10 flex flex-wrap justify-between'>
//                     <div className='w-fit'>
//                         <Button text='Ok' onClick={()=>setShowSkipModal(false)} />
//                     </div>
//                     <div className='w-fit'>
//                         <HollowButton title='Skip For Now' showIcon={false} onClick={()=>navigate(`/${tenantId}/others`)} />
//                     </div>
//                 </div>
//             </div>
//         </Modal>
//         </>}
//     </>)
// }


// function CollapsedPolicy(props){
//     const icon = props.icon
//     const text = props.text || 'Enter text'
//     const onClick = props.onClick || (() => {})

//     return(
//         <>
//             <div onClick={onClick} className="w-full h-[72px] p-6 relative bg-white cursor-pointer rounded-xl border border-neutral-200">
//                 <div className="flex justify-between items-center">
//                     <div className="justify-start items-center gap-8 inline-flex">
//                         <div className="justify-start items-center gap-6 flex">
//                             <div className="w-6 h-6 relative">
//                                 <img src={icon} />
//                             </div>
//                             <div className="text-neutral-700 text-base font-medium font-['Cabin']">{text}</div>
//                         </div>
//                     </div>

//                     <div className="justify-start gap-12 items-start gap-2 inline-flex">
//                         <div className="w-6 h-6 -rotate-90">
//                             <img src={arrow_down} />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }