
import {spinner_icon} from "../../assets/icon"

export default function ({message=null}){
    return(
        <div className="w-full h-full flex items-center justify-center">
            {!message && <div className='w-[200px] '>
                    <img src={spinner_icon} alt='spinner' />
                </div>}    
            {message && <div className='p-10 border border-gray-300 roundex-xl'>
                <p className="text-xl text-neutral-700 font-cabin">{message}</p>
                </div>}
        </div>)
}





// <>
// <div className="w-full flex-wrap flex justify-center items-center p-2">
// <div className="border w-full lg:w-1/2">
//  bill view
// </div>
// <div className="border w-full lg:w-1/2">
//  <div>
//     Category {selectedCategory}
//   </div>

// <div className="w-full flex-row  border">

// {selectedCategory &&
//      categoryfields.find((category)=>category.categoryName === selectedCategory).fields.map((field)=>(
//       <>
//       <div key={field.name} className="w-1/2 flex justify-center items-center flex-wrap gap-2">

        
      
//       {field.name === 'From' || field.name === 'To' || field.name === 'Departure' || field.name === 'Pickup Location' ||field.name === 'DropOff Location' || field.name === 'Arrival' ? (
//    <>       
//     <Input
//     id="pac-input"
//     title={field.name}
//     name={field.name}
//     type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
//     placeholder={`Enter ${field.name}`}
//     value={lineItemDetails[field.name  ||""]}
//     onChange={handleInputChange}
//   />
//   <GoogleMapsSearch inputId="pac-input" />
//   <div id="map"></div>
//   </>
//   ) : (field.name ==='Class' || field.name ==='Class of Service') ? (
    
   
//     <div className="relative">
//     <Select
//       label={field.name}
//       placeholder={`Select ${field.name}`}
//       options={classDropdownValues || []}// Define your class options here

//       defaultOption={ lineItemDetails[field.name] || ''}
//       violationMessage={`Your violation message for ${field.name}`}
//       error={{ set: true, message: `Your error message for ${field.name}` }}
//       required={true}
//       submitAttempted={false}
//       icon={chevron_down}
//       onChange={(value) => handleDropdownChange(value, field.name)}
//     />
//     </div>
   
   
//   ) :(
   
//     <Input
//       title={field.name}
//       name={field.name}
//       type={field.type === 'date' ? 'date' : field.type === 'numeric' ? 'number' : 'text'}
//       placeholder={`Enter ${field.name}`}
//       initialValue={lineItem[field.name]}
//       onChange={(value)=> handleInputChange(field.name,value)}
//     />
//   )}
       
//       </div>

      
      
//       </>
//      ))}       

// {/* //personal expense */}
// <div className=" ">
// <div className="flex flex-row gap-4">
// <div className="w-1/2 flex-row  h-[52px] flex items-center justify-center  mb-5">

// <div className="w-[100px] flex flex-col">

// <div>
// {/* <ActionButton variant='red' text={personalFlag ? "NO"  : "YES" } onClick={handlePersonalFlag}/> */}
// <Toggle label={'Personal Flag'} initialValue={lineItem.isPersonalExpense || false} checked={personalFlag} onClick={handlePersonalFlag}/>
// </div>
// </div>
// </div>

// <div className="w-1/2">
// {!personalFlag &&
// <Input
// title='Personal Amount'
// error={ errorMsg.personalAmount}
// name='personalAmount'
// type={'text'}
// initialValue={lineItem['personalExpenseAmount']}
// onChange={handleInputChange}
// />}
// </div> 
// </div>
// {/* //personal expense */}
// <div className="h-[48px] w-1/2 justify-center items-center inline-flex gap-4 ">
// <div className="w-[150px] h-auto">
// <Dropdown
//      label="Currency"
//      name="currency"
//      id='currency'
//      htmlFor='currency'
//    placeholder="Select Currency"
//    options={['INR',"USD",'AUD']} //this data will get from currency  api
//   //  onSelect={(value) => handleDropdownChange(value, 'currencyName')}
//    defaultOption={lineItem.currencyName}
//    violationMessage="Your violation message" 
//    error={{ set: true, message: "Your error message" }} 
//    required={true} 
//    submitAttempted={false}
//    icon={chevron_down}
//    onChange={(value) => handleDropdownChange(value, 'currencyName')}
//    />

// </div>  
// { selectDropdown == null || selectDropdown !== defaultCurrency   &&
// <div className='mt-6'>
// <ActionButton text="Convert" onClick={handleConverter}/>


// {/* {currencyTableData?.currencyFlag ? <h2>Coverted Amount: {currencyTableData?.convertedAmount ??" converted amt not there"}</h2> : <h2 className='text-red-500'>{errorMsg.currencyFlag.msg}</h2>} */}

// </div>}   
// </div>

// {currencyTableData?.currencyFlag &&
// <div className="w-1/2 text-sm ">
// <div>
// <h2>Converted Amount Details:</h2>
// <p>total amount: {currencyTableData?.convertedAmount ?? " - "}</p>
// {
//   lineItemDetails?.personalFlag  &&
//   (<div>
//     <p>personal amount: {currencyTableData?.convertedPersonalAmount ?? " - "}</p>
//     <p>Non Personal Amount: {currencyTableData?.convertedNonPersonalAmount ?? " - "}</p>
//     </div>
//   )
 
// }


// </div>

// </div>
// }

// </div>



// <div className="w-full flex items-center justify-center border-[1px] border-gray-50 mt-5">
// <Upload  
// selectedFile={selectedFile}
// setSelectedFile={setSelectedFile}
// fileSelected={fileSelected}
// setFileSelected={setFileSelected}
// />
// </div>

// <div className="w-full mt-5 px-4" >
// <Button text="Update" 
// onClick={handleModifyLineItem} />
// </div>     

// {/* -------------------- */}


 
//  </div>

// </div>
// </div>

// </>