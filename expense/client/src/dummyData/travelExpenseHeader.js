<div className='w-full flex flex-col  lg:flex-row '>
  <div className='border w-full lg:w-1/2'>Bill View</div>
  <div className='border w-full lg:w-1/2'>
   <div className="w-full justify-evenly flex flex-wrap  border-[1px]  mt-5 gap-y-9 px-4">  
  {lineItemsData && lineItemsData.map((lineItem , index)=>(
   lineItem.expenseLineId === selectedLineItemId  ?
   ( <>
    <div className="w-full max-w-md mx-auto p-4 border-[1px] border-b-gray">               
    <form>
 
    {categoryElement &&
categoryElement.map((element, index) => {
return (
<React.Fragment key={index}>
<div className='flex flex-col'>
<div className='flex flex-row gap-5 justify-between items-center'>
<div className=" w-full h-full decoration:none px-6 py-2 border rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " >
<h2 className="block text-gray-700 text-sm font-bold mb-2 ">
 {element.name}
</h2>
</div>

<div className=''>

<Input
error={element.name === "Total Amount" ? errorMsg.totalAmount : null}
name={element.name}
type={element.type === "numeric" ? "number" : "text"}
value={formDataValues[element.name] !== undefined ? formDataValues[element.name] : lineItem[element.name] || ""}
// value={formDataValues[element.name] || ""}
onChange={(e) => handleInputChange(element.name, e.target.value)}
/>
</div>

</div>

</div>

</React.Fragment>
);
})}

<div>
<div>
<div className='flex flex-row gap-4'>
<div className=" w-[200px] h-full decoration:none px-6 py-2 border rounded-md  border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " >
<h2 className="block text-gray-700 text-sm font-bold mb-2 ">
 Select Currency
</h2>
</div>
<div className="h-[48px] w-[200px] float-right">

<Dropdown
//  label="Currency"
name="currency"
id='currency'
htmlFor='currency'
placeholder="Select Currency"
options={['INR',"USD",'AUD']}
//   onSelect={handleDropdownChange}
currentOption=""
violationMessage="Your violation message" 
//   error={{ set: true, message: "Your error message" }} 
required={true} 
submitAttempted={false}
icon={chevron_down}
onChange={handleCategoryChange}
/>
</div>


</div>

{ selectedCategory == null || selectedCategory !== defaultCurrency   &&
<div className='w-fit h-fit mt-8'>
<Button text="Convert" onClick={handleConverter}/>

{currencyTableData?.currencyFlag ? <h2>Coverted Amount: {currencyTableData?.convertedAmount ??" converted amt not there"}</h2> : <h2 className='text-red-500'>{errorMsg.currencyFlag.msg}</h2>}

</div>}

{/* <h2 className="block text-gray-700 text-sm font-bold mb-2 ">
 Upload Bills
</h2> */}
</div>
{/* <input
name="document"
type="file"
onChange={handleFileUpload}
/> */}
<div className="w-full flex items-center justify-center border-[1px] border-gray-50 mt-5">
<Upload 
  selectedFile={selectedFile}
  setSelectedFile={setSelectedFile}
  fileSelected={fileSelected}
  setFileSelected={setFileSelected}
  />
</div>
</div>


    </form>
   
    <div className="w-full mt-5" >
    <Button text="Update" onClick={handleSaveLineItem} />
</div>



</div>
</>)

    : 

    <React.Fragment key={index}>
 
              <>
          {Object.entries(lineItem).map(([key, value]) =>(
            
              key !== 'expenseLineId' && //dont show
              <React.Fragment  key={key}>
                <div className="min-w-[200px] w-full md:w-fit h-[48px] flex-col justify-start items-center gap-2 ">
                    
                    <div className="text-zinc-600 text-sm font-cabin">{titleCase(key)}</div>
                    
                    {/* Div with border styling */}
                    <div className=" w-full h-full bg-white items-center flex border border-neutral-300 rounded-md">
                      {/* Displaying key and value */}
                  
                          <div key={key}>
                            <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin px-6 py-2">
                              {/* Display key and value */}
                              {` ${value}`}
                            </div>
                           
                          </div>
                          
                       
                    </div>
                    <div className=" w-full text-xs text-yellow-600   font-cabin">{['policyViolation']}</div>
                </div>
               
              </React.Fragment>))}
            
        
          
          <div>
        <div>
            <div className='flex flex-row gap-4'>
            <div className=" w-[200px] h-full decoration:none px-6 py-2 border rounded-md  border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 " >
                    <h2 className="block text-gray-700 text-sm font-bold mb-2 ">
                        Select Currency
                   </h2>
            </div>
            <div className="h-[48px] w-[200px] float-right">
               
               <Dropdown
                    //label="Currency"
                     name="currency"
                     id='currency'
                     htmlFor='currency'
                     placeholder="Select Currency"
                     options={['INR',"USD",'AUD']}
                    //onSelect={handleDropdownChange}
                   currentOption=""
                   violationMessage="Your violation message" 
                 //   error={{ set: true, message: "Your error message" }} 
                   required={true} 
                   submitAttempted={false}
                   icon={chevron_down}
                   onChange={handleCategoryChange}
                   />
                   </div>       
                   </div>
        
        { selectedCategory == null || selectedCategory !== defaultCurrency   &&
         <div className='w-fit h-fit mt-8'>
         <Button text="Convert" onClick={handleConverter}/>
        
        {currencyTableData?.currencyFlag ? <h2>Coverted Amount: {currencyTableData?.convertedAmount ??" converted amt not there"}</h2> : <h2 className='text-red-500'>{errorMsg.currencyFlag.msg}</h2>}
         
        </div>}

           {/* <div>
                    <h2 className="block text-gray-700 text-sm font-bold mb-2 ">
                        Upload Bills
                   </h2>
                   <input
          name="document"
          type="file"
          onChange={handleFileUpload}
        />
        </div> */}
                    </div>
                   
         </div>
        
        
        
                  
         <div className="w-full mt-5" >
                   <Button text="Edit" onClick={()=>handleEdit(lineItem.expenseLineId)} />
     </div>
     </> 
    
  </React.Fragment>
  ))}  
  </div>
  </div>
</div>