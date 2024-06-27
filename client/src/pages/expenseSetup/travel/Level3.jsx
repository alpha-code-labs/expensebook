
import { useState, useEffect } from "react"
import Error from "../../../components/common/Error"
import { getTenantTravelAllocations_API, getTenantOrgHeaders_API } from "../../../utils/api"
import internatinal_travel_icon from '../../../assets/in-flight.svg'
import domestic_travel_icon from '../../../assets/briefcase.svg'
import local_travel_icon from '../../../assets/map-pin.svg'
import MainSectionLayout from "../../../layouts/MainSectionLayout"
import Prompt from "../../../components/common/Prompt"
import arrow_down from "../../../assets/chevron-down.svg";
import AllocationPageComponent from "./AllocationPageComponent"


export default function ({tenantId}){

    const [networkStates, setNetworkStates] = useState({isLoading: false, isUploading: false, loadingErrMsg:null})
    const [allocations, setAllocations] = useState({});
    const [orgHeaders, setOrgHeaders] = useState({})
    const [showTravelType, setShowTravelType] = useState(null);
    const [prompt, setPrompt] = useState({success: false, showPrompt: false, promptMsg: null});

    useEffect(()=>{
        console.log(allocations, 'allocations level3')
    }, [allocations])

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

    return(<>
        {networkStates.isLoading && <Error message={networkStates.loadingErrMsg} />}
        {!networkStates.isLoading && <>
            
            {showTravelType == null && 
                <MainSectionLayout>
                    {<>   
                        
                        <div className='px-6 py-10 bg-white'>
                                {/* back button and title */}
                            <div className='flex gap-4 sticky top-20'>
                                <div className='flex gap-2'>
                                    <p className='text-neutral-700 text-base font-medium font-cabin tracking-tight'>
                                        Setup Expense Book
                                    </p>
                                </div>
                            </div>
            
                            <div className="mt-10 flex flex-col gap-4">
                                <CollapsedPolicy 
                                    onClick={() => setShowTravelType('international')}
                                    text='International Travel'
                                    icon={internatinal_travel_icon}/>
            
                                <CollapsedPolicy 
                                    onClick={() => setShowTravelType('domestic')}
                                    text='Domestic Travel'
                                    icon={domestic_travel_icon}/>
            
                                <CollapsedPolicy 
                                    onClick={() => setShowTravelType('local')}
                                    text='Local Travel'
                                    icon={local_travel_icon}/>
                            </div>
            
                        </div>
                        
                        <Prompt prompt={prompt} setPrompt={setPrompt}/>
                    </>}
                </MainSectionLayout>
            
            }
        
            {showTravelType == 'international' && <AllocationPageComponent allocations={allocations} setAllocations={setAllocations} orgHeaders={orgHeaders} setOrgHeaders={setOrgHeaders} tenantId={tenantId} travelType={'international'} setShowTravelType={setShowTravelType} />}
            {showTravelType == 'domestic' && <AllocationPageComponent allocations={allocations} setAllocations={setAllocations} orgHeaders={orgHeaders} setOrgHeaders={setOrgHeaders} tenantId={tenantId} travelType={'domestic'} setShowTravelType={setShowTravelType} /> }
            {showTravelType == 'local' && <AllocationPageComponent allocations={allocations} setAllocations={setAllocations} orgHeaders={orgHeaders} setOrgHeaders={setOrgHeaders} tenantId={tenantId} travelType={'local'} setShowTravelType={setShowTravelType} />}
        
        </>
        }
        </>)
}


function CollapsedPolicy(props){
    const icon = props.icon
    const text = props.text || 'Enter text'
    const onClick = props.onClick || (() => {})

    return(
        <>
            <div onClick={onClick} className="w-full h-[72px] p-6 relative bg-white cursor-pointer rounded-xl border border-neutral-200">
                <div className="flex justify-between items-center">
                    <div className="justify-start items-center gap-8 inline-flex">
                        <div className="justify-start items-center gap-6 flex">
                            <div className="w-6 h-6 relative">
                                <img src={icon} />
                            </div>
                            <div className="text-neutral-700 text-base font-medium font-['Cabin']">{text}</div>
                        </div>
                    </div>

                    <div className="justify-start gap-12 items-start gap-2 inline-flex">
                        <div className="w-6 h-6 -rotate-90">
                            <img src={arrow_down} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}