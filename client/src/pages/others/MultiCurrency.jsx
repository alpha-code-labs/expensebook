import Button from "../../components/common/Button"
import Icon from "../../components/common/Icon"
import { useNavigate, useParams } from "react-router-dom"
import HollowButton from "../../components/common/HollowButton"
import { CircleFlag } from 'react-circle-flags'
import Select from "../../components/common/Select"
import { useEffect, useState } from "react"
import axios from "axios"
import { updateFormState_API } from "../../utils/api"
import {currenciesList} from "../../data/currenciesList"
import { getTenantDefaultCurrency_API, getTenantMulticurrencyTable_API, postTenantMulticurrencyTable_API } from "../../utils/api"

export default function (props){
    const navigate = useNavigate()
    const {tenantId} = useParams()
    const [tenantDefaultCurrency, setTenantDefaultCurrency] =  useState({fullName:'', shortName:'', symbol:'', countryCode:''})
    const [currencyTable, setCurrencyTable] = useState([])
    
    const [selectedCurrency, setSelectedCurrency] = useState(null)
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
        //upload non empty values to database
        const filteredEntries = currencyTable.filter(entry=>entry.exchangeValue.value!='')
        const exchangeValue = filteredEntries.map(entry=>entry.exchangeValue)
        console.log(exchangeValue)

        if(exchangeValue.length==0){
            alert('No values provided')
            return
        }

        try{
            const res = await postTenantMulticurrencyTable_API({tenantId, multiCurrencyTable:{defaultCurrency:tenantDefaultCurrency, exchangeValue} })
            if(res.status === 200){
                alert('Multicurrency table updated')
                navigate(`/${tenantId}/others/roles`)
            }

        }catch(e){
            console.log(e)
        }
    }

    const handleSaveAsDraft = async ()=>{
      //upload non empty values to database
      const filteredEntries = currencyTable.filter(entry=>entry.exchangeValue.value!='')
      const exchangeValue = filteredEntries.map(entry=>entry.exchangeValue)
      console.log(exchangeValue)

      if(exchangeValue.length!=0){
          // alert('No values provided')
        try{
            const res = await postTenantMulticurrencyTable_API({tenantId, multiCurrencyTable:{defaultCurrency:tenantDefaultCurrency, exchangeValue} })
            if(res.status === 200){
                // alert('Multicurrency table updated')
                // navigate(`/${tenantId}/others/blanket-delegations`)
            }

        }catch(e){
            console.log(e)
        }
      }

      //update form state
      await updateFormState_API({tenantId, state:'others/multicurrency'})
      //redirect to homepage
      window.location.href = 'http://google.com'
    }

    useEffect(()=>{
        console.log(currencyTable)
    },[currencyTable])

    useEffect(()=>{
        
    },[])
      
    useEffect(()=>{
        (async function(){
            try{
                const res = await getTenantMulticurrencyTable_API({tenantId})
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
                    if(!resD.err){
                        if(resD.data?.defaultCurrency?.shortName != '')
                            setTenantDefaultCurrency(resD.data.defaultCurrency)
                    }
                }
                                
            }catch(e){
                console.log(e)
            }
        })()

    }, [])


    return(<>
        
        <Icon/>
        <div className="bg-slate-50 min-h-[calc(100vh-107px)] px-[20px] md:px-[50px] overflow-y-auto lg:px-[104px] pb-10 w-full tracking-tight">
            <div className='px-6 py-10 bg-white rounded shadow'>
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
                        <HollowButton title='Skip' onClick={()=>navigate(`/${tenantId}/others/blanket-delegations`)} showIcon={false} />
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
                        <div className="flex gap-6 h-12 w-[230px] items-center">
                            <div className='flex items-center gap-4'>
                                <div className='w-6 h-6'>
                                    <CircleFlag countryCode={entry.exchangeValue.currency.countryCode.toLowerCase()} />
                                </div>
                                <p className="text-neutral-700 font-cabin font-normal text-sm">{entry.exchangeValue.currency.shortName}</p>
                            </div>

                            <div className="px-4 py-3 rounded-xl border border-gray-400 flex gap-8">
                                <div className='flex items-center gap-4'>
                                    <div className='w-6 h-6'>
                                        <CircleFlag countryCode={entry.currency.countryCode.toLowerCase()} />
                                    </div>
                                    <div className='flex gap-2 text-neutral-700 font-cabin font-normal text-sm'>
                                        <p className="symbol">{entry.currency.symbol}</p>
                                        <input value={entry.exchangeValue.value} onChange={(e)=>handleValueChange(e,index)} className="border border-gray-200 w-8 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600" />
                                    </div>
                                </div>
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

                <div className="flex w-full justify-between mt-10">
                   <Button variant='fit' text='Save as Draft' onClick={handleSaveAsDraft} />
                    <Button variant='fit' text='Save and Continue' onClick={handleSaveChanges} />
                </div>

            </div>
        </div>
    </>)
}