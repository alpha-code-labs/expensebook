import Button from "../../../components/common/Button"
import Icon from "../../../components/common/Icon"
import { useNavigate, useParams, useLocation} from "react-router-dom"
import HollowButton from "../../../components/common/HollowButton"
import internatinal_travel_icon from '../../../assets/in-flight.svg'
import domestic_travel_icon from '../../../assets/briefcase.svg'
import local_travel_icon from '../../../assets/map-pin.svg'
import non_travel_icon from '../../../assets/paper-money-two.svg'
import arrow_down from "../../../assets/chevron-down.svg";
import Checkbox from "../../../components/common/Checkbox"
import Modal from "../../../components/common/Modal"
import { useState, useEffect } from "react"
import back_icon from "../../../assets/arrow-left.svg"
import { getTenantTravelAllocations_API, updateFormState_API, postTravelAllocationFlags_API, getTravelAllocationFlags_API } from "../../../utils/api"
import Error from "../../../components/common/Error"
import LeftProgressBar from "../../../components/common/LeftProgressBar"
import MainSectionLayout from "../../MainSectionLayout"

export default function (props){
    const location = useLocation()
    console.log(location.state)

    const navigate = useNavigate()
    const {tenantId} = useParams()
    const [showSkipModal, setShowSkipModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const [flags, setFlags] = useState({level1:true, level2:false, level3:false})

    useEffect(()=>{
        if(showSkipModal){
            document.body.style.overflow = 'hidden'
        }
        else{
            document.body.style.overflow = 'visible'
        }
    },[showSkipModal])


    const handleflagChange = (e, level)=>{

        switch(level){
            case 'level1' : setFlags({level1:true, level2:false, level3:false}); break;
            case 'level2' : setFlags({level1:false, level2:true, level3:false}); break;
            case 'level3' : setFlags({level1:false, level2:false, level3:true}); break;
        }
    }

    const handleSaveAsDraft = async ()=>{
        const res = await updateFormState_API({tenantId}, {state: 'setup-expense-book/travel'})
        location.href = 'google.com'
    }

    //header level allocation 1 

    const handleContinue = async ()=>{
        //save flags to backend
        const res = await postTravelAllocationFlags_API({tenantId, travelAllocationFlags:flags})
        //rdirect to next page

        if(flags.level1) navigate('level1', {flags})
        if(flags.level2) navigate('level2', {flags})
        if(flags.level3) navigate('level3', {flags})
    }

    useEffect(()=>{
        (async function(){
            const res = await getTravelAllocationFlags_API({tenantId})
            console.log(res.data)
            if(res.err){
                alert('Error while fetching details')
                return
            }
            const travelAllocationFlags = res.data.travelAllocationFlags
            
            if(Object.keys(travelAllocationFlags).length != 0)
                setFlags(travelAllocationFlags)
        })()
    },[])

    return(<>
        <MainSectionLayout>
            {isLoading && <Error message={loadingErrMsg} />}
            {!isLoading && <>
            
            <div className='px-6 py-10 bg-white'>
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


                <fieldset className='mt-4'>
                    <legend className='font-cabin mt-4 text-neutral-700 text-lg'>At what level do you allocate travel in your organization?</legend>

                    <div className='flex gap-4 border border-neutral-300 max-w-[350px] accent-indigo-600 px-6 py-2 rounded mt-4'>
                        <input type="radio" id="level1" name="drone" value="Trave" checked={flags.level1} onChange={(e)=>handleflagChange(e, 'level1')} />
                        <div>
                            <p className='font-cabin text-neutral-800 text-lg tracking-wider'> Travel </p>
                            <p className='font-cabin -mt-1 text-neutral-600 text-sm tracking-tight'>No further categorization needed</p>
                        </div>
                    </div>

                    <div className='flex gap-4 border border-neutral-300 max-w-[350px] accent-indigo-600 px-6 py-2 rounded mt-4'>
                        <input type="radio" id="level2" name="drone" value="Trave" checked={flags.level2} onChange={(e)=>handleflagChange(e, 'level2')} />
                        <div>
                            <p className='font-cabin text-neutral-800 text-lg tracking-wider'> Travel Type </p>
                            <p className='font-cabin -mt-1 text-neutral-600 text-sm tracking-tight'>International, Domestic, Local</p>
                        </div>
                    </div>

                    <div className='flex gap-4 border border-neutral-300 max-w-[350px] accent-indigo-600 px-6 py-2 rounded mt-4'>
                        <input type="radio" id="level3" name="drone" value="Trave" checked={flags.level3} onChange={(e)=>handleflagChange(e, 'level3')} />
                        <div>
                            <p className='font-cabin text-neutral-800 text-lg tracking-wider'> Travel Categories </p>
                            <p className='font-cabin -mt-1 text-neutral-600 text-sm tracking-tight'>Flights, Trains, Meals.. etc</p>
                        </div>
                    </div>

                </fieldset>

                <div className='mt-10 flex flex-row-reverse justify-between'>
                    {/* <Button variant='fit' text='Save as Draft' onClick={handleSaveAsDraft}  /> */}
                    <Button variant='fit' text='Next' onClick={handleContinue}  />
                </div>

            </div>

            <Modal skippable={false} showModal={showSkipModal} setShowModa={setShowSkipModal}>
                <div className="p-10">
                    <p className="text-neutral-700 text">
                        If you skip this section you won't be able to track your expenses.
                    </p>
                    <div className=' mt-10 flex flex-wrap justify-between'>
                        <div className='w-fit'>
                            <Button text='Ok' onClick={()=>setShowSkipModal(false)} />
                        </div>
                        <div className='w-fit'>
                            <HollowButton title='Skip For Now' showIcon={false} onClick={()=>navigate(`/${tenantId}/others`)} />
                        </div>
                    </div>
                </div>
            </Modal>
            
            </>}
        </MainSectionLayout>
    </>)
}

