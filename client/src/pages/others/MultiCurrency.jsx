import Button from "../../components/common/Button"
import Icon from "../../components/common/Icon"
import { useNavigate, useParams } from "react-router-dom"
import HollowButton from "../../components/common/HollowButton"
import { CircleFlag } from 'react-circle-flags'
import Select from "../../components/common/Select"
import { useEffect, useState } from "react"
import { updateFormState_API } from "../../utils/api"
import {currenciesList} from "../../data/currenciesList"
import { getTenantDefaultCurrency_API, getTenantMulticurrencyTable_API, postTenantMulticurrencyTable_API } from "../../utils/api"
import Prompt from "../../components/common/Prompt"
import Error from "../../components/common/Error"
import MainSectionLayout from "../MainSectionLayout"
import { postProgress_API } from "../../utils/api"
import remove_icon from "../../assets/close.svg"

export default function ({progress, setProgress}){
    const navigate = useNavigate()
    const {tenantId} = useParams()
    const [tenantDefaultCurrency, setTenantDefaultCurrency] =  useState({fullName:'', shortName:'', symbol:'', countryCode:''})
    const [currencyTable, setCurrencyTable] = useState([])
    const [prompt, setPrompt] = useState({showPrompt:false, promptMsg:null, sucesss:null})
    const [networkStates, setNetworkStates] = useState({isLoading:false, isUploading:false, loadingErrMsg:null})
    const [selectedCurrency, setSelectedCurrency] = useState(null)
    const [activeButton, setActiveButton] = useState(null)

    const handleCurrencySelection = (option)=>{
        setSelectedCurrency(option)
    }

    const addCurrency = ()=>{
        if(selectedCurrency!=null){
            let alreadyInTable = false

            if(currencyTable.length>0){
                currencyTable.forEach(entry=>{
                    if(entry.exchangeValue.currency.fullName.toLowerCase() == selectedCurrency.toLowerCase()){
                        alreadyInTable=true
                        return;
                    }
                })    
            }
            
            if(!alreadyInTable){
                const targetCurrency = currenciesList.filter(currency=>currency.fullName.toLowerCase() == selectedCurrency.toLowerCase())[0]
                const currencyTable_copy = JSON.parse(JSON.stringify(currencyTable))
                currencyTable_copy.push({currency:tenantDefaultCurrency, exchangeValue:{currency:targetCurrency, value:''}})
                console.log(currencyTable_copy)
                setCurrencyTable(currencyTable_copy)
            }
            else{
                alert('Currency already in table, please modify value')
            }
        }
        else{
            alert('Please select a currency to continue')
        }
    }

    const handleValueChange = (e, index)=>{
        let currencyTable_copy = JSON.parse(JSON.stringify(currencyTable))
        currencyTable_copy[index].exchangeValue.value = e.target.value
        
        setCurrencyTable(currencyTable_copy)
    }

    const handleSaveChanges = async ()=>{
        setActiveButton('Save and Continue')
        //upload non empty values to database
        const filteredEntries = currencyTable.filter(entry=>entry.exchangeValue.value!='')
        const exchangeValue = filteredEntries.map(entry=>entry.exchangeValue)
        console.log(exchangeValue)

        if(exchangeValue.length==0){
            alert('No values provided')
            return
        }

        try{
            setNetworkStates({isLoading:false, isUploading:true, loadingErrMsg:null})
            const res = await postTenantMulticurrencyTable_API({tenantId, multiCurrencyTable:{defaultCurrency:tenantDefaultCurrency, exchangeValue} })

            let currentSubSection = 'Currency Table'

            const progress_copy = JSON.parse(JSON.stringify(progress));

            progress_copy.sections['section 6'].subsections.forEach(subsection=>{
                if(subsection.name == currentSubSection) subsection.completed = true;
            });

            progress_copy.sections['section 6'].subsections.forEach(subsection=>{
                if(subsection.name == currentSubSection) subsection.completed = true;
            });

            const markCompleted = !progress_copy.sections['section 6'].subsections.some(subsection=>!subsection.completed)

            let totalCoveredSubsections = 0;
            progress_copy.sections['section 6'].subsections.forEach(subsection=>{
                if(subsection.completed) totalCoveredSubsections++;
            })

            progress_copy.sections['section 6'].coveredSubsections = progress_copy.sections['section 6'].subsections.filter(subsect=>subsect.completed).length //totalCoveredSubsections; 

            if(markCompleted){
                progress_copy.sections['section 6'].state = 'done';
                if(progress.maxReach==undefined || progress.maxReach==null || progress.maxReach.split(' ')[1] < 7){
                    progress_copy.maxReach = 'section 7';
                  }
            }else{
                progress_copy.sections['section 6'].state = 'attempted';
            }

            const progress_res = await postProgress_API({tenantId, progress: progress_copy})

            if(res.err || progress_res.err){
                setNetworkStates({isLoading:false, isUploading:false, loadingErrMsg:res.err})
                setPrompt({showPrompt:true, promptMsg: res.err??progress_res.err, sucess: false})
            }
            if(!res.err){
                setNetworkStates({isLoading:false, isUploading:false, loadingErrMsg:res.err})
                setPrompt({showPrompt:true, promptMsg: 'Multicurrency table updated', sucess: true})

                setTimeout(()=>{
                    setProgress(progress_copy);
                    navigate(`/${tenantId}/others/roles`);
                }, 3000)
            }

        }catch(e){
            console.log(e)
        }
    }

    const handleSaveAsDraft = async ()=>{
        setActiveButton('Save as Draft')
      //upload non empty values to database
      const filteredEntries = currencyTable.filter(entry=>entry.exchangeValue.value!='')
      const exchangeValue = filteredEntries.map(entry=>entry.exchangeValue)
      console.log(exchangeValue)

      if(exchangeValue.length!=0){
          // alert('No values provided')
        try{
            setNetworkStates({isLoading:false, isUploading:true, loadingErrMsg:null})
            const res = await postTenantMulticurrencyTable_API({tenantId, multiCurrencyTable:{defaultCurrency:tenantDefaultCurrency, exchangeValue} })
            
            if(!res.err){
                // alert('Multicurrency table updated')
                // navigate(`/${tenantId}/others/blanket-delegations`)
                setNetworkStates({isLoading:false, isUploading: false, loadingErrMsg:null})
                setPrompt({showPrompt:true, promptMsg:'Multicurrency table updated.', success: true})
                setTimeout(()=>{
                    window.location.href = import.meta.env.VITE_WEB_PAGE_URL
                }, 2700)
            }

        }catch(e){
            console.log(e)
        }
      }

      //update form state
      await updateFormState_API({tenantId, state:'others/multicurrency'})
      setTimeout(()=>{window.location.href = import.meta.env.VITE_WEB_PAGE_URL??'google.com'}, 3000)
    }

    const removeCurrency = async (index)=>{
       
        try{
            console.log('currency table copy', currencyTable)
            const currencyTable_copy = JSON.parse(JSON.stringify(currencyTable));
            currencyTable_copy.splice(index, 1);

            console.log(currencyTable_copy, 'currency table copy')

            const filteredEntries = currencyTable_copy.filter(entry=>entry.exchangeValue.value!='')
            const exchangeValue = filteredEntries.map(entry=>entry.exchangeValue)

        
            setNetworkStates({isLoading:false, isUploading:true, loadingErrMsg:null})
            const res = await postTenantMulticurrencyTable_API({tenantId, multiCurrencyTable:{defaultCurrency:tenantDefaultCurrency, exchangeValue} })

            if(res.err){
                setNetworkStates({isLoading:false, isUploading:false, loadingErrMsg:res.err})
                setPrompt({showPrompt:true, promptMsg: 'Something went wrong while removing currency from table', sucess: true})
            }
            if(!res.err){
                setNetworkStates({isLoading:false, isUploading:false, loadingErrMsg:res.err})
                setPrompt({showPrompt:true, promptMsg: 'Currency Removed', sucess: true})
                setCurrencyTable(currencyTable_copy)
            }

        }catch(e){
            console.log(e)
        }
    }

    useEffect(()=>{
        console.log(currencyTable)
    },[currencyTable])

    useEffect(()=>{
        (async function(){
            try{
                setNetworkStates(pre=>({isLoading:true}))
                const res = await getTenantMulticurrencyTable_API({tenantId})
                if(res.err){
                    setNetworkStates(pre=>({...pre, loadingErrMsg:res.err}))
                }
                const multiCurrencyData = res.data.multiCurrencyTable
                console.log(multiCurrencyData)
                if(multiCurrencyData.exchangeValue.length>0){
                    //This needs to be setup despite absence of any entry in exchangeValue...
                    setTenantDefaultCurrency(multiCurrencyData.defaultCurrency)

                    const currencyTable_copy = []
                    multiCurrencyData.exchangeValue.map(entry=>{
                        currencyTable_copy.push({currency:multiCurrencyData.defaultCurrency, exchangeValue:{currency:entry.currency, value:entry.value}})
                    })
                
                    setCurrencyTable(currencyTable_copy)
                }
                else{
                    //fetch default currency
                    const resD = await getTenantDefaultCurrency_API({tenantId})
                    console.log(resD.data, 'default')
                    if(!resD.err){
                        if(resD.data?.defaultCurrency?.shortName != '')
                            setTenantDefaultCurrency(resD.data.defaultCurrency)
                    }
                }

                setNetworkStates(pre=>({...pre, isLoading:false, isUploading:false, loadingErrMsg:null}))
                                
            }catch(e){
                console.log(e)
            }
        })()

    }, [])


    return(<>
    <MainSectionLayout>
        {networkStates.isLoading && <Error message={networkStates.loadingErrMsg}/>}
        {!networkStates.isLoading && <>
            <div className='px-6 py-10 bg-white'>
                <div className="flex justify-between">
                    <div className="gap-2">
                        <p className="text-neutral-700 text-xl font-semibold tracking-tight">
                            Currency Center
                        </p>
                        <p className="text-gray-600 text-sm font-normal font-cabin" >
                            Set currency conversion rates manually for your team
                        </p>
                    </div>
                    <div className="">
                        <HollowButton title='Skip' onClick={()=>navigate(`/${tenantId}/others/roles`)} showIcon={false} />
                    </div>
                </div>
                <div className="mt-8 bg-violet-100 rounded-xl border border-indigo-600 ">
                    <div className="p-4 text-base text-indigo-600 font-cabin">
                        <p className='font-medium'>Note</p>
                        <p className='font-medium'>These conversion rates are internal to the company and need to be updated manually in this version of expensebook</p>
                    </div>
                </div>
                <hr className='mt-8' />

                <div className='mt-10 flex flex-wrap gap-20'>
                    {currencyTable.length>0 && currencyTable.map((entry,index)=>(
                        <div className="w-fit flex gap-6 items-center">
                            <div className="flex gap-6 h-12 w-[230px] items-center">
                                <div className='flex items-center gap-4'>
                                    <div className='w-6 h-6'>
                                        <CircleFlag countryCode={entry.exchangeValue.currency.countryCode.toLowerCase()} />
                                    </div>
                                    <p className="text-neutral-700 whitespace-nowrap font-cabin font-normal text-sm">{`1 ${entry.exchangeValue.currency.shortName}  `}</p>
                                </div>

                                <div className="px-4 py-3 rounded-xl border border-gray-400 flex gap-8">
                                    <div className='flex items-center gap-4'>
                                        <div className='w-6 h-6'>
                                            <CircleFlag countryCode={entry?.currency?.countryCode.toLowerCase()} />
                                        </div>
                                        <div className='flex gap-2 text-neutral-700 font-cabin font-normal text-sm'>
                                            <p className="symbol">{entry.currency.symbol}</p>
                                            <input value={entry.exchangeValue.value} onChange={(e)=>handleValueChange(e,index)} className="border border-gray-200 rounded-md pl-1 w-12 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-6 bg-gray-100 rounded-full p-1">
                                <img src={remove_icon} className='w-4 hover:scale-125 cursor-pointer' onClick={()=>removeCurrency(index)} />
                            </div>
                        </div>
                    ))}
                </div>
                
                <hr className="mt-10" />

               <div className="mt-10 flex gap-4 md:justify-between items-end flex-wrap">

                    <div className='flex gap-4 items-end'>
                        <div className='w-[214px]'>
                            <Select title='Add Currency' 
                                drop='up'
                                titleCase={false}
                                onSelect={handleCurrencySelection} 
                                options={currenciesList.map(currency=>currency.fullName).sort()} />
                        </div>

                        <div>
                            <Button text='Add' onClick={addCurrency} />
                        </div>
                    </div>
                </div>

                <div className="flex w-full justify-end mt-10">
                   {/* <Button variant='fit' text='Save as Draft' onClick={handleSaveAsDraft} isLoading={networkStates.isUploading && activeButton == 'Save as Draft'} /> */}
                    <Button variant='fit' text='Save and Continue' onClick={handleSaveChanges} isLoading={networkStates.isUploading && activeButton == 'Save and Continue'} />
                </div>
                
                <Prompt prompt={prompt} setPrompt={setPrompt} timeout={3000} />
            </div>
        </>}
    </MainSectionLayout>
    </>)
}