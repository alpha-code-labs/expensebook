import React, { useState } from 'react'
import Allocations from './Allocations'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Toggle from '../components/common/Toggle'
import CurrencyInput from '../Components/common/currency/CurrencyInput'
import { currenciesList } from '../utils/data/currencyList'
import {  TravelExpenseCurrencyConversionApi } from '../utils/api'

const LineItemForm = ({setErrorMsg,isUploading,defaultCurrency, currencyConversion, setCurrencyConversion, handleCurrencyConversion, formData,setFormData, onboardingLevel, categoryFields = [], classOptions, currencyTableData, allocationsList, handleAllocations, lineItemDetails, errorMsg}) => {
  const totalAmountKeys = ['Total Fare','Total Amount',  'Subscription Cost', 'Cost', 'Premium Cost'];
  const dateKeys = ['Invoice Date', 'Date', 'Visited Date', 'Booking Date',"Bill Date"];

  

console.log('error mgs',errorMsg.conversion)

  
  const [personalExpFlag , setPersonalExpFlag]=useState(false)
  

    console.log('categoryFields', categoryFields)

    const handleInputChange = (key, value) => {
      console.log(`Updating ${key} with value:`, value);
    
      setFormData((prevData) => {
        const updatedFields = {
          ...prevData.fields,
          [key]: value,
        };
    
        if (key === 'isPersonalExpense' && value === false) {
          updatedFields.personalExpenseAmount = "";  // Clear the input value
        }

        
       
        ///for conversion stop

        return {
          ...prevData,
          fields: updatedFields,
        };
      });

       if(totalAmountKeys.includes(key) ){
          setCurrencyConversion(prev =>({...prev,payload:{
            ...prev.payload,
           ["totalAmount"]:value
          }
          }))
        }

        if(key === "personalExpenseAmount"){
          setCurrencyConversion(prev =>({...prev,payload:{
            ...prev.payload,
           ["personalAmount"]:value
          }
          }))
        }
        setCurrencyConversion(prev =>({...prev,payload:{
          ...prev.payload,
          'currencyName':formData?.Currency?.shortName,
         
          ///nonPersonalAmount: Number(prev.payload.totalAmount) - Number(formData.personalExpenseAmount)
        }
        }))

        if(key==='Currency' && value.shortName !== defaultCurrency.shortName){
          setFormData(prev => ({
            ...prev,
            fields: {
              ...prev.fields, // Spread the existing fields object
              isMultiCurrency: true // Update the isMultiCurrency flag to true
            }
          }));
          handleCurrencyConversion()
        }else{
          if(key==='Currency'){
            setErrorMsg((prevErrors) => ({ ...prevErrors, conversion: { set: false, msg: "" } }));
          }
          
          setFormData(prev => ({
            ...prev,
            fields: {
              ...prev.fields, // Spread the existing fields object
              isMultiCurrency: false // Update the isMultiCurrency flag to true
            }
          }));
          
         
          //setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: true, msg: "Enter the amount" } }));
        }
    };

    

  return (
    <div className="w-full flex-row  p-2">

 <div className="w-full  flex-wrap flex items-center justify-center">
 {onboardingLevel=== 'level3' &&
( <>
<p className='text-start w-full  px-2 py-2 text-base text-neutral-700 font-inter'>Allocations</p>
 <div className='border-y flex items-center justify-center w-full  border-slate-300 px-2  pb-2'>
          <Allocations 
          errorMsg={errorMsg}
            onboardingLevel={onboardingLevel} 
            travelExpenseAllocation={allocationsList} 
            onAllocationSelection={handleAllocations} 
          />
  </div>
  </>)}
  {/* <div className="w-full border flex flex-wrap items-center justify-center"> */}
  {categoryFields.map((field) => {
  const isLocationOrDateField = ['From', 'To', 'Departure', 'Pickup Location', 'DropOff Location', 'Arrival'].includes(field.name);
  const isClassField = ['Class', 'Class of Service'].includes(field.name);
  const isTotalAmountField = ['Total Fare', 'Total Amount', 'Subscription Cost', 'Cost', 'Premium Cost'].includes(field.name);

  return (
    <React.Fragment key={field.name}>
      <div className="w-full flex justify-start items-center px-2 py-1">
        {isLocationOrDateField ? (
          <Input
            initialValue={lineItemDetails[field.name]}
            title={field.name}
            name={field.name}
            type="text"
            placeholder={`Enter ${field.name}`}
            //value={lineItemDetails[field.name] || ""}
            onChange={(value) => handleInputChange(field.name, value)}
          />
        ) : isClassField ? (
          <div className="w-full translate-y-[-6px] z-20">
            <Select
             variant={true}
             error={errorMsg.class}
              title={field.name}
              name={field.name}
              placeholder={`Select ${field.name}`}
              options={classOptions || []}
              currentOption={lineItemDetails[field.name] || ""}
              onSelect={(value) => handleInputChange(field.name, value)}
            />
          </div>
        ) : isTotalAmountField ? (
          <div className='w-full'>
          <CurrencyInput
          error={errorMsg.conversion}
          title={field.name}
          uploading={isUploading.conversion}
          currencyOptions={currenciesList.map(cr=>({...cr, imageUrl:`https://hatscripts.github.io/circle-flags/flags/${cr.countryCode.toLowerCase()}.svg`}))} 

            //for amount input---
             name={field.name}
            // placeholder={`Enter ${field.name}`}
            // value={lineItemDetails[field.name] || ""}
            currency={formData.Currency}
            onCurrencyChange={(value)=>handleInputChange('Currency',value)}
            onChange={(value) => handleInputChange(field.name, value)}
          />
          </div>
        ) : (
          <Input
            initialValue={lineItemDetails[field.name]}
            error={(totalAmountKeys.includes(field.name) && errorMsg.totalAmount) || (dateKeys.includes(field.name) && errorMsg.date) || field.name=== "Class" && errorMsg.class}
            title={field.name}
            name={field.name}
            variant={field.type === 'date' && 'w-fit'}
            type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : field.type === 'time' ? 'time' : 'text'}
            placeholder={`Enter ${field.name}`}
            value={lineItemDetails[field.name] || ""}
            onChange={(value) => handleInputChange(field.name, value)}
          />
        )}
      </div>
    </React.Fragment>
  );
})}

{/* {categoryFields.map((field)=>(
          <React.Fragment key={field.name}>
  <div key={field.name} className="w-full flex justify-center items-center px-2 py-1 ">
          {field.name === 'From' || field.name === 'To' || field.name === 'Departure' || field.name === 'Pickup Location' ||field.name === 'DropOff Location' || field.name === 'Arrival' ? ( 
       <>       
        <Input
        // inputRef={''}
        // inputRef={autocompleteRefs[field.name] || (autocompleteRefs[field.name] = useRef())}
        title={field.name}
        name={field.name}
        type={'text'}
        // initialValue={lineItemDetails[field.name]}
        placeholder={`Enter ${field.name}`}
        value={lineItemDetails[field.name  ||""]}
        onChange={(value)=>handleInputChange(field.name,value)}
      />
      </>
      ) : (field.name ==='Class' || field.name ==='Class of Service') ? (
          <div className="  w-full translate-y-[-6px] z-20">
        <Select
          title={field.name}
          name={field.name}
          placeholder={`Select ${field.name}`}
          options={classOptions || []} // Define your class options here
          currentOption={lineItemDetails[field.name] || ''}
          onSelect={(value)=>handleInputChange(field.name, value)}
          // violationMessage={`Your violation message for ${field.name}`}
          // error={{ set: true, message: `Your error message for ${field.name}` }}
        />
        </div>
      ) :(
        // Otherwise, render a regular input field
        <Input
          initialValue={lineItemDetails[field.name]}
          error={(totalAmountKeys.includes(field?.name) && errorMsg.totalAmount) || (dateKeys?.includes(field?.name) && errorMsg.dateErr )}
          title={field.name}
          name={field.name}
          type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : field.type === 'time' ? 'time' : 'text'}
          placeholder={`Enter ${field.name}`}
          value={lineItemDetails[field.name || '']}
          onChange={(value)=>handleInputChange(field.name , value)}
        />
      )}     
          </div>        
          </React.Fragment>
         ))} */}

         

  </div>

{/* //personal expense */}




<div className='px-2'>
<div className="flex flex-col md:flex-row  items-start gap-x-2 w-full"> 

<div >
<Toggle 
checked={personalExpFlag}
setChecked={setPersonalExpFlag}
title='Is personal expense?' 
initialValue={false}
onClick={(flag)=>handleInputChange("isPersonalExpense",flag)}/>
</div>
<div
  className={`w-full transition-all ease-in-out duration-300 ${personalExpFlag ? 'opacity-100 max-h-full' : 'opacity-0 max-h-0 overflow-hidden'}`}
>
<Input
    title='Personal Amount'
    error={errorMsg?.personalAmount}
    name='personalExpenseAmount'
    initialValue={formData.personalExpenseAmount || ""}
    type='text'
    onChange={(value) => handleInputChange('personalExpenseAmount', value)}
    key={personalExpFlag ? "visible" : "hidden"} // This forces the Input component to re-render and clear its state
  />
</div>

</div> 


{/* <div className="relative">
<div className=" h-[48px] w-full sm:w-[200px]  mb-10 mr-28 mt-[-10px] ">
   <Select
       title='Currency'
       currentOption={currencyDropdown[0].shortName}
       placeholder="Select Currency"
       options={currencyDropdown.map(currency => currency.shortName)} 
       onSelect={(value)=>handleCurrenctySelect(value)}
    
       error={errorMsg.currencyFlag} 
       />
</div>  

<div className='absolute top-6 left-[210px] w-fit'>
{selectDropdown == null || selectDropdown.shortName !== defaultCurrency?.shortName   &&
<ActionButton disabled={active?.convert} loading={active?.convert} active={active.convert} text="Convert" onClick={()=>handleConverter( totalAmount ,lineItemDetails?.personalExpenseAmount)}/>
}
</div>
</div> */}
{/* <div >
{currencyTableData?.currencyFlag  ? 
<div className={`flex gap-2 `}>
<div className="min-w-[200px] w-full  h-auto flex-col justify-start items-start gap-2 inline-flex mb-3">
<div className="text-zinc-600 text-sm font-cabin">Coverted Amount Details :</div>
<div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin  ">
  <div className="w-full h-full decoration:none  rounded-md border placeholder:text-zinc-400 border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600">
    <div className={`sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100  border  ${currencyTableData?.convertedPersonalAmount == undefined ? "rounded-md" :"rounded-t-md"}`}>
      <div className="text-[16px] font-semibold text-neutral-600">Total Amount </div> 
      <div className="text-neutral-600 font-cabin">{currencyTableData?.defaultCurrencyName} {currencyTableData?.convertedTotalAmount?.toFixed(2)}</div>
  </div>
{currencyTableData?.convertedPersonalAmount !== undefined &&
<>
    <div className="sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-100 ">
      <div className=" text-[16px] font-semibold text-neutral-600">Personal Amount </div> 
      <div className="text-neutral-600 font-cabin">{currencyTableData?.defaultCurrencyName} {currencyTableData?.convertedPersonalAmount?.toFixed(2)}</div>
  </div>
    <div className="sm:px-6 px-4  py-2  flex sm:flex-row flex-col  sm:items-center items-start justify-between  min-h-12 bg-slate-200 rounded-b-md border">
      <div className="  text-[16px] font-semibold text-neutral-600">Final Reimbursement Amount </div> 
      <div className="text-neutral-600 font-cabin">{currencyTableData?.defaultCurrencyName} {currencyTableData?.convertedBookableTotalAmount?.toFixed(2)}</div>
  </div>
  </>}
  </div>

</div>

</div>
</div>
   : 
  currencyTableData?.message !== undefined &&
  <div className={`flex items-center justify-center gap-2 border-[1px] px-4 py-2 rounded border-yellow-600  text-yellow-600 mt-6`} >
    <img src={validation_symb_icon} className='w-5 h-5'/>
  <h2 className=''>{currencyTableData?.message}</h2>
  </div>
 } 
</div> */}

<div className='flex w-fit mb-4'>
  <Select 
   title="Paid Through"
   name="mode of payment"
   placeholder="Select Mode"
   options={["Cash",'Cheque','Salary Account','Prepaid Card', "NEFT Bank Transfer"]}
   onSelect={(value)=>handleInputChange( ['Mode of Payment'],value)}/>
</div>


{/* ------////-------- */}


{/* <div className="w-full mt-4 flex items-center justify-center border-[1px] border-gray-50 ">
<Upload  
  selectedFile={selectedFile}
  setSelectedFile={ setSelectedFile}
  fileSelected={fileSelected}
  setFileSelected={setFileSelected}
  />
</div> */}
</div>
{/* <div className="w-full mt-5 px-4">
 <Button text="Save" 
 disabled={isUploading} 
 loading={isUploading} 
 active={active.saveLineItem}
 onClick={handleSaveLineItemDetails} />
</div>    */}

{/* -------------------- */}


     
     </div>
  )
}

export default LineItemForm
