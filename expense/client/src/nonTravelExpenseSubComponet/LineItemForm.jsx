import React, { useEffect, useState } from 'react'
import Allocations from '../travelExpenseSubcomponent/Allocations'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import CurrencyInput from '../Components/common/currency/CurrencyInput'
import { currenciesList } from '../utils/data/currencyList'
import { categoryIcons } from '../assets/icon'
import { dateKeys, invoiceNoKeys, totalAmountKeys } from '../utils/data/keyList'

const LineItemForm = ({expenseLines, categoryName, setErrorMsg,isUploading,defaultCurrency, currencyConversion, setCurrencyConversion, handleCurrencyConversion, formData,setFormData, onboardingLevel, categoryFields = [], classOptions, currencyTableData, allocationsList, handleAllocations,  errorMsg}) => {

console.log("non travel expense lines", expenseLines)
  const conversionAmount= currencyConversion?.response || {}
  
  const checkIfRecorded = (keys, fieldName, errorMsg,value) => {
    const isRecorded = expenseLines.some(expenseLine => 
      keys.some(key => expenseLine[key] && expenseLine[key].toString().toLowerCase() === value.toLowerCase())
    );
  
    setErrorMsg(prev => ({
      ...prev,
      [fieldName]: { set: isRecorded, msg: isRecorded ? errorMsg : "" }
    }));
  };


    const handleInputChange = (key, value) => {
      console.log(`Updating ${key} with value:`, value);
      if ( totalAmountKeys.includes(key)){
        checkIfRecorded(totalAmountKeys, "totalAmount", "Entered amount has already been recorded.",value);
      }
      if ( invoiceNoKeys.includes(key)){
        checkIfRecorded(invoiceNoKeys, "invoiceNumber", "Entered invoice no. has already been recorded.",value);
      }
    
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

       if(totalAmountKeys.includes(key)){
          
          if (formData?.Currency?.shortName !== defaultCurrency.shortName){
            handleCurrencyConversion({currencyName:formData?.Currency?.shortName , totalAmount:value})
            setCurrencyConversion(prev =>({...prev,payload:{
              ...prev.payload,
             ["totalAmount"]:value
            }
            }))
          }else{
            setCurrencyConversion(prev =>({...prev,payload:{
              ...prev.payload,
             ["totalAmount"]:value
            }
            }))
          }
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
          // setFormData(prev => ({
          //   ...prev,
          //   fields: {
          //     ...prev.fields, // Spread the existing fields object
          //     isMultiCurrency: true // Update the isMultiCurrency flag to true
          //   }
          // }));
          handleCurrencyConversion({currencyName:value.shortName,"totalAmount":currencyConversion.payload.totalAmount})
        }else if (key==='Currency' && value.shortName === defaultCurrency.shortName){
          
            setErrorMsg((prevErrors) => ({ ...prevErrors, conversion: { set: false, msg: "" } }));
          
          setFormData(prev => ({
            ...prev,
            fields: {
              ...prev.fields, 
              isMultiCurrency: false, 
              convertedAmountDetails:null
            }
            
            
          }));
         
         setCurrencyConversion(prev =>({...prev, response:null}))
          
         
          //setErrorMsg((prevErrors) => ({ ...prevErrors, personalAmount: { set: true, msg: "Enter the amount" } }));
        }
    };



    

  return (
 <div className="w-full flex-row h-full">
   <div className="sticky top-0 bg-white z-20 w-full flex items-center h-12 px-4 border-dashed  border-y border-slate-300 py-4">
        <div className="flex items-center justify-center gap-2">
          <div className="bg-slate-100 p-2 rounded-full">
            <img src={categoryIcons[categoryName]} className="w-4 h-4 rounded-full" />
          </div>
          <p>{categoryName}</p>
        </div>
      </div>
 <div className="w-full  flex-wrap flex items-center justify-center">

 {onboardingLevel=== 'level3' && allocationsList.length >0 &&
( <>
<p className='text-start w-full  px-2 py-2 text-base text-neutral-700 font-inter'>Allocations</p>
 <div className='border-y flex items-center justify-center w-full  border-slate-300 px-2  pb-2'>
          <Allocations 
            getSavedAllocations={formData?.allocations}
            errorMsg={errorMsg}
            onboardingLevel={onboardingLevel} 
            travelExpenseAllocation={allocationsList} 
            onAllocationSelection={handleAllocations} 
          />
  </div>
  </>
  )
   }
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
            initialValue={formData[field.name]}
            title={field.name}
            name={field.name}
            type="text"
            placeholder={`Enter ${field.name}`}
            //value={formData[field.name] || ""}
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
              currentOption={formData[field.name] || ""}
              onSelect={(value) => handleInputChange(field.name, value)}
            />
          </div>
        ) : isTotalAmountField ? (
          <div className='w-full'>
          <CurrencyInput
          dataMsg={errorMsg?.totalAmount}
          conversionAmount={conversionAmount}
          initialValue={formData[field.name]}
          error={errorMsg?.conversion}
          title={field.name}
          uploading={isUploading.conversion}
          currencyOptions={currenciesList.map(cr=>({...cr, imageUrl:`https://hatscripts.github.io/circle-flags/flags/${cr.countryCode.toLowerCase()}.svg`}))} 
          //for amount input---
          name={field.name}
          currency={formData.Currency}
          onCurrencyChange={(value)=>handleInputChange('Currency',value)}
          onChange={(value) => handleInputChange(field.name, value)}
          />
          </div>
        ) : (
          <Input
          dataMsg={invoiceNoKeys.includes(field.name) && errorMsg.invoiceNumber}
            initialValue={formData[field.name]}
            error={(totalAmountKeys.includes(field.name) && errorMsg.totalAmount) || (dateKeys.includes(field.name) && errorMsg.date) || field.name=== "Class" && errorMsg.class}
            title={field.name}
            name={field.name}
            variant={field.type === 'date' && 'w-fit'}
            type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : field.type === 'time' ? 'time' : 'text'}
            placeholder={`Enter ${field.name}`}
            value={formData[field.name] || ""}
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
        // initialValue={formData[field.name]}
        placeholder={`Enter ${field.name}`}
        value={formData[field.name  ||""]}
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
          currentOption={formData[field.name] || ''}
          onSelect={(value)=>handleInputChange(field.name, value)}
          // violationMessage={`Your violation message for ${field.name}`}
          // error={{ set: true, message: `Your error message for ${field.name}` }}
        />
        </div>
      ) :(
        // Otherwise, render a regular input field
        <Input
          initialValue={formData[field.name]}
          error={(totalAmountKeys.includes(field?.name) && errorMsg.totalAmount) || (dateKeys?.includes(field?.name) && errorMsg.dateErr )}
          title={field.name}
          name={field.name}
          type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : field.type === 'time' ? 'time' : 'text'}
          placeholder={`Enter ${field.name}`}
          value={formData[field.name || '']}
          onChange={(value)=>handleInputChange(field.name , value)}
        />
      )}     
          </div>        
          </React.Fragment>
         ))} */}

         

  </div>

{/* //personal expense */}




<div className='px-2'>


<div className='flex w-fit mb-4'>
  <Select 
  currentOption={formData['Mode of Payment']}
   title="Paid Through"
   name="mode of payment"
   placeholder="Select Mode"
   options={["Cash",'Cheque','Salary Account','Prepaid Card', "NEFT Bank Transfer"]}
   onSelect={(value)=>handleInputChange( ['Mode of Payment'],value)}/>
</div>



</div>
     
     </div>
  )
}

export default LineItemForm
