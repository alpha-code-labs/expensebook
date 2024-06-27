import Button from "../../../components/common/Button"
import { useState, useEffect } from "react"
import {postTravelAllocationFlags_API, getTravelAllocationFlags_API } from "../../../utils/api"
import Error from "../../../components/common/Error"
import MainSectionLayout from "../../../layouts/MainSectionLayout"
import Prompt from "../../../components/common/Prompt"

export default function ({tenantId}){

    const [isLoading, setIsLoading] = useState(false)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)
    const [flags, setFlags] = useState({level1:true, level2:false, level3:false})
    const [prompt, setPrompt] = useState({showPrompt:false, promptMsg:null, success:false})


    const handleflagChange = (e, level)=>{

        switch(level){
            case 'level1' : setFlags({level1:true, level2:false, level3:false}); break;
            case 'level2' : setFlags({level1:false, level2:true, level3:false}); break;
            case 'level3' : setFlags({level1:false, level2:false, level3:true}); break;
        }
    }

    //header level allocation 1 

    const handleContinue = async ()=>{
        //save flags to backend
        const res = await postTravelAllocationFlags_API({tenantId, travelAllocationFlags:flags})
        if(res.err){
            setPrompt({showPrompt: true, success:false, promptMsg: res.err??'Failed to update Allocation Level'})
        }
        setPrompt({showPrompt:true, success:true, promptMsg: 'Allocation Level updated Successfully!. Now you need to setup your travel allocations as per your company structure'}) 
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
                    <Button variant='fit' text='Save Changes' onClick={handleContinue}  />
                </div>

            </div>

            <Prompt prompt={prompt} setPrompt={setPrompt} />

            </>}
        </MainSectionLayout>
    </>)
}

