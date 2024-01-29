import React ,{useState,useEffect}from 'react'
import { getCategoryFormElementApi, getNonTravelExpenseMiscellaneousDataApi, postMultiCurrencyForNonTravelExpenseApi, postNonTravelExpenseLineItems, saveAsDraftNonTravelExpense, submitNonTravelExpenseApi, submitOrSaveAsDraftApi } from '../utils/api'
import { useParams } from 'react-router-dom'
import Error from '../components/common/Error'
import Button from '../components/common/Button'
import PopupMessage from '../components/common/PopupMessage'
import Icon from '../components/common/Icon'
import Dropdown from '../components/common/DropDown'
import Input from '../components/common/Input'
import { chevron_down, file_icon, validation_sym } from '../assets/icon'
import {nonTravelExpenseData} from '../dummyData/nonTravelExpens'
import { titleCase, urlRedirection } from '../utils/handyFunctions'
import { reimbursementAfterCategory } from '../dummyData/requiredDummy'
import { categories } from '../utils/travelrequest'
import Upload from '../components/common/Upload'
import Select from '../components/common/Select'
import ActionButton from '../components/common/ActionButton'



 
const CreateNonTraveExpense = () => {
  const {tenantId,empId,cancelFlag} =useParams()


  const DASHBOARD_URL=`http://localhost:8080/${tenantId}/${empId}`
  const defaultCurrency= 'INR'
  
  ///get category list 
   const [categoryList , setCategoryList]=useState(null);

   useEffect(()=>{
    const getCategoryList = categories &&  categories.expenseCategories
    console.log('getCategoryList',getCategoryList)
    setCategoryList(getCategoryList)
   },[])


  useEffect(()=>{
    const categoriesData = reimbursementAfterCategory
    const expenseLineAllocation = categoriesData?.reimbursementAllocation
    setExpenseLineAllocation(expenseLineAllocation)
  },[])

 

    const formData = [
              { name:'Bill Date',type:'date'},
              { name:'Bill Number',type:'numeric'},
              { name:'Vendor Name',type:'text'},
              { name: 'Description', type: 'text' },
              { name: 'Quantity', type: 'numeric' },
              { name: 'Unit Cost', type: 'numeric' },
              { name: 'Tax Amount', type: 'numeric' },
              { name: 'Total Amount', type: 'numeric' },     
        
    ];

    
    const [miscellaneousData, setMiscellaneousData]=useState(null) //for onboarding dat
    const [expenseLineAllocation ,setExpenseLineAllocation]=useState(null)
    const [categoryElement , setCategoryElement]=useState(formData); //
   
    const [totalAmount, setTotalAmount] = useState(''); ///for handling convert 

    const [currencyTableData, setCurrencyTableData] = useState(null);
    const [lineItemsData,setLineItemsData]=useState([...nonTravelExpenseData.expenseLine]) //for get all line item
    const [headerData,setHeaderData]=useState({
      allocation:"",
      category:"",
      companyName:"company Name",
      defaultCurrency:"INR",
      employee:{
        empId:"empIddfhj",
        name: 'Employee Name'
       },
       expenseLineAllocation:[
        {
        headerName: "cost center",
        headerValues: ["cc1","cc2","cc3"],
      },
        {
        headerName: "profit centre",
        headerValues: ["pc1","pc2","pc3"],
      }
    ]
    }) ///  this data after click on generate btn
    


    
    const [selectedLineItemId, setSelectedLineItemId]=useState(null)
    const [isLoading,setIsLoading]=useState(false)
    const [loadingErrorMsg, setLoadingErrorMsg]=useState(null)
    const [errorMsg,setErrorMsg]=useState({
      currencyFlag:{set:false,msg:""},
      totalAmount:{set:false,msg:""} //"Total Amount"
    })

    const [openLineItemForm,setOpenLineItemForm]=useState(false)
    const [openModal,setOpenModal]=useState(false);
    const [showPopup ,setShowPopup]=useState(false);
    const [message,setMessage]=useState(null)  ///this is for modal message


   




//for save selected expenseLineAllocation allocation in array
const [selectedAllocations , setSelectedAllocations]=useState([])//for saving expenseLineAllocation on  line item   

const onAllocationSelection = (option, headerName) => {
  // Create a new allocation object
  const newAllocation = { headerName: headerName, headerValue: option  || ""};
  setSelectedAllocations((prevAllocations) => [...prevAllocations, newAllocation]);
};

const [selectedCategory , setSelectedCategory]= useState(null) //this is for dropdown

const initialFormValues = Object.fromEntries(categoryElement.map((field) => [field.name, '']));

const [formDataValues, setFormDataValues] = useState(initialFormValues); // for line items form



    // const handleCategoryChange=(value)=>{
    
    // setSelectedCategory(value)
    // console.log('selectedCategory',value)
    // setFormDataValues({...formDataValues,currencyName:value})
    // }
  

   

  
    //for add line item
    const handleModal=()=>{
        setOpenModal((prevState)=>(!prevState))
        setCategoryElement(formData)
    }
   

    // const handleInputChange = (name, value) => {
      
    //    setErrorMsg((prevErrors) => ({ ...prevErrors, totalAmount: { set: false, msg: "" } }));
    //   //  setErrorMsg((prevErrors) => ({ ...prevErrors, [name]: { set: false, msg: "" } }));
    //     setFormDataValues((prevValues) => ({
    //       ...prevValues,
    //       [name]: value,
    //     }));
    //     if (name === 'Total Amount') {
    //         setTotalAmount(value);
    //       }
    //   };

    const handleInputChange = (name, value) => {
      console.log(`Updating ${name} with value:`, value);
      setFormDataValues((prevState) => ({ ...prevState, [name]: value || "" }));
    };

    const handleEmptyValues = () => {
      const updatedFormData = { ...formDataValues };
  
      // Loop through each property in formDataValues
      for (const key in updatedFormData) {
        // Check if the property is undefined or null
        if (updatedFormData[key] === undefined || updatedFormData[key] === null) {
          // Set it to an empty string
          updatedFormData[key] = "";
        }
      }
  
      // Update the state with the modified formDataValues
      setFormDataValues(updatedFormData);
    };


     
const [selectedFile  , setSelectedFile]=useState(null)
const [fileSelected ,setFileSelected]= useState(false)


      
      console.log('total amount', totalAmount)
      console.log("expense line",lineItemsData)
      



    ///category has to sent in object

    const handleGenerateExpense = async () => {
        try {
          setIsLoading(true);
          const { data, error } = await getCategoryFormElementApi(tenantId,empId,selectedCategory);
    
          if (error) {
            setLoadingErrorMsg(error.message);
          } else {
            setCategoryElement(data);
            setLoadingErrorMsg(null)
            console.log(data)
          }
        } catch (error) {
          setLoadingErrorMsg(error.message);
        } finally {
          setIsLoading(false);
        }
      };


const handleConverter =async ( totalAmount , selectedCurrency) => { 
        if(totalAmount==""){
          setErrorMsg((prevErrors)=>({...prevErrors,totalAmount:{set:true,msg:"Enter Total Amount"}}))
        }
       
        if (totalAmount !== undefined && totalAmount !== "") {
            const convertDetails = {
              currencyName: selectedCurrency,
              totalAmount: totalAmount,
            };   

            console.log('handleConvertorClicked',convertDetails)
        ///api 
        try{
          setIsLoading(true)
          const response= await postMultiCurrencyForNonTravelExpenseApi(tenantId, convertDetails)
          if(response.error){
            setLoadingErrorMsg(response.error.message)
            setCurrencyTableData(null)
          }else{
            setLoadingErrorMsg(null)
            setCurrencyTableData(response.data) //here it war response
            if(currencyTableData.currencyFlag){              
              setErrorMsg((prevErrors)=>({...prevErrors,currencyFlag:{set:true,msg:"Currency not available,Please Contact Admin."}}))

            }
          }
        }catch(error){
          setLoadingErrorMsg(error.message)
          setMessage(error.message)
          setShowPopup(true)
          setTimeout(() => {
            setShowPopup(false)
          }, 3000);
          
        } finally{
          setIsLoading(false);
        }}
      };


    //this is for miscellaneous data
    //for get categories , dashboard to non tr expense ms 

    useEffect(() => {
        const fetchData = async () => {
          try {
            setIsLoading(true);
            const { data, error } = await getNonTravelExpenseMiscellaneousDataApi(tenantId,empId);
    
            if (error) {
              setLoadingErrorMsg(error.message);
            } else {
              setMiscellaneousData(data);
            }
          } catch (error) {
            setLoadingErrorMsg(error.message);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchData();
      }, []);
      console.log(miscellaneousData)   


    //i think this no need to do

//     useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const { data, error } = await getCategoryFormElementApi(tenantId, empId);

//         if (error) {
//           setLoadingErrorMsg(error.message);
//         } else {
//           setCategoryElement(data);
//         }
//       } catch (error) {
//         setLoadingErrorMsg(error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [tenantId, empId]);

      const handleEdit=(id)=>{
          setSelectedLineItemId(id)
          console.log("lineItemId",id)
      }


//cancel header 
const handleCancelExpenseHeader =()=>{
  console.log('handle cancel ')
}      


      ///save for lineitem
      ///on first submitting send whole array of line items and allocation multicurrency all stuf of header
      ////save allocation header , category , default currency ,companyName , empName > this data when you generate the category then you will get
      
      const handleSaveLineItem = async () => {
        try {
          setIsLoading(true);
          handleEmptyValues(); // Ensure that any undefined or null values in formDataValues are set to ""
      
          // Check if the user has made any changes to line item details
          const isLineItemModified = Object.keys(formDataValues).some(
            (key) => lineItemsData[selectedLineItemId]?.[key] !== formDataValues[key]
          );
      
          if (!isLineItemModified) {
            // If no changes, add empty values to formDataValues
            for (const key in formDataValues) {
              formDataValues[key] = "";
            }
          }
      
          const updatedFormData = {
            ...formDataValues,
            document: selectedFile || "",
            currencyTableData,
            lineItemAllocation :selectedAllocations,
          };
      
          setFormDataValues(updatedFormData);
          console.log('filledLineItemDetails', updatedFormData);
      
          setLineItemsData([...lineItemsData, updatedFormData]);
      
          const { error } = await postNonTravelExpenseLineItems(tenantId, empId);
      
          if (error) {
            setLoadingErrorMsg(error.message);
            setMessage(error.message);
          } else {
            setShowPopup(true);
            setMessage("Line Item has been added successfully.");
            setTimeout(() => {
              setShowPopup(false);
              location.reload();
            }, 5000);
          }
        } catch (error) {
          setLoadingErrorMsg(error.message);
          setShowPopup(true);
          setMessage(error.message);
          setTimeout(() => {
            setShowPopup(false);
          }, 3000);
        } finally {
          setIsLoading(false);
        }
      
        // Clear the selected file and reset the form data
        setSelectedFile(null);
        setFileSelected(false);
        setFormDataValues({});
      };
      
     
///on handle save as draft data has to send

      const handleSubmitOrDraft = async(action)=>{
        if (action=="submit"){
          try{
            setIsLoading(true)
            const response= await submitNonTravelExpenseApi(tenantId,empId,"data has to send")
            if(response.error){
              setLoadingErrorMsg(response.error.message)
              setCurrencyTableData(null)
            }else{
              setLoadingErrorMsg(null)
              setShowPopup(true)
              setMessage("Non Travel Expense has been Submitted")
              setTimeout(() => {
                setShowPopup(false)
              }, 5000);
              urlRedirection(DASHBOARD_URL)

              
            }
          }catch(error){
            setLoadingErrorMsg(error.message)
            setMessage(error.message)
            setShowPopup(true)
            setTimeout(() => {
              setShowPopup(false)
            }, 3000);
            
          } finally{
            setIsLoading(false);
          }

        }
        if(action=="save as draft"){
          try{
            setIsLoading(true)
            const {error} = await saveAsDraftNonTravelExpense(tenantId,empId,)
            if (error) {
              setLoadingErrorMsg(error.message);
              setShowPopup(true)
              setMessage("Ohh!",error.message)
            }
            setShowPopup(true)
            setMessage("Non Travel Expense has been submitted.")
            setTimeout(()=>{
              setShowPopup(false)
              location.reload()
            },5000)
            urlRedirection(DASHBOARD_URL)
      
          }catch(error){
            setLoadingErrorMsg(error.message)
          setMessage(error.message)
          setShowPopup(true)
          setTimeout(() => {
            setShowPopup(false)
          }, 3000);
          }finally{
            setIsLoading(false)
          }

        }
      }


  return (
    <div>
        {isLoading && <Error message={loadingErrorMsg}/>}
        {/* {loadingErrorMsg && <h2>{loadingErrorMsg}</h2>} */}
        {!isLoading  && 
        <div className="w-full h-full relative bg-white-100 md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
        {/* app icon */}
        <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
            <Icon/>
        </div>

        {/* Rest of the section */}
        <div className="w-full h-full mt-10 p-10 font-cabin tracking-tight">
        <p className='inline-flex'> 
        <img src={validation_sym} width={16} height={16} alt='validation'/> 
        <span className='text-red-500'> if category is not there contact admin.</span>
        </p>           
        <div className="flex flex-row justify-between">
        <div className='my-5  inline-flex gap-4'>

        <div className="h-[48px] w-[200px]">
       
      <Select
            title="Category"
           
          placeholder="Select Category"
          options={categoryList && categoryList || []}
        //   onSelect={handleDropdownChange}
          currentOption={categoryList && categoryList[0]}
          // violationMessage="Your violation message" 
        //   error={{ set: true, message: "Your error message" }} 
          required={true} 
          submitAttempted={false}
          icon={chevron_down}
          onChange={(value)=>setSelectedCategory(value)}
          />
         

          </div>

          <div className='mt-7'>
            <Button text="Generate" onClick={()=>handleGenerateExpense()}/>
        </div>
</div>

{lineItemsData.length!=0 &&
  <div className="flex gap-4">
                    {cancelFlag ?
                    (<div className="flex mt-10 flex-row-reverse">
                    <Button variant='fit' text='Cancel' onClick={()=>handleCancelExpenseHeader}/>
                   </div>):
                    (<>
                    <div className="flex mt-10 flex-row-reverse">
                    <Button text='Save as Draft' onClick={()=>handleSubmitOrDraft("save as draft")}/>
                   </div>
                    <div className="flex mt-10 flex-row-reverse">
                    <Button variant='fit' text='Submit' onClick={()=>handleSubmitOrDraft("submit")}/>
                   </div>
                   </>)}                                 
</div>
} 

            </div>
           
        
            <hr/>
            <HeaderComponent/>
           
     <hr/>
     <div>
     <div className="w-fit my-5" onClick={handleModal}>
           <Button text={"Add Line Item"}/>
     </div>
     </div>
{/* //----------- edit line item--start---------------------- */}

{lineItemsData && lineItemsData.map((lineItem , index)=>(
   lineItem.expenseLineId === selectedLineItemId ?
   
 <>

  <EditFormComponent
   expenseLineAllocation={expenseLineAllocation}
   categoryElement={categoryElement}
   key={index}
   lineItem={lineItem}
   handleSave={(updatedData) => handleSaveLineItem(updatedData, index)}
   defaultCurrency={defaultCurrency}
   handleConverter={handleConverter}/>

 </>
   
   
   :
<>
<div className='flex flex-col lg:flex-row border '>
  <div className='w-full lg:w-1/2 border'>
    bill details
  </div>
  <div className='w-full lg:w-1/2 border' key={index}>  
     <div >
     <EditComponent lineItem={lineItem} handleEdit={handleEdit}/>
     </div> 
  </div>
  </div> 
</>  
   ))}
 



{/* //----------- edit line item--end---------------------- */}


               
     
         
        
{/* //---------save line item form----------------------- */}

{openLineItemForm &&
<div className='flex flex-col lg:flex-row border '>
  <div className='w-full lg:w-1/2 border  flex justify-center items-center px-4 py-4'>
  
  <div className=' border-[5px] min-w-[100%] h-fit flex justify-center items-center'>
    {selectedFile ? 
    (
        <div className="w-full  flex flex-col justify-center">
          <p>Selected File: {selectedFile.name}</p>
          {/* <p>Size: {selectedFile.size} bytes</p>
          <p>Last Modified: {selectedFile.lastModifiedDate.toString()}</p> */}
          {selectedFile.type.startsWith('image/') ? (
            
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className=' h-[700px] w-full'
              
            />
            
          ) : selectedFile.type === 'application/pdf' ? (
            <embed
              src={URL.createObjectURL(selectedFile)}
              type="application/pdf"
              width="100%"
              height="700px"
            />
          ) : (
            <p>Preview not available for this file type.</p>
          )}
        </div>
      ) : 
      
      <div className='w-full h-[700px] flex justify-center items-center bg-white-100 opacity-30'>
        <img src={file_icon} className='w-40 h-40'/>
      </div>}
    </div>
      
  </div>
  <div className='w-full lg:w-1/2 border'>
  {openLineItemForm &&
  <> 
          
<div  className="w-full border flex flex-wrap items-start justify-between py-4 px-2">
  {expenseLineAllocation.length>0 && expenseLineAllocation.map((allItem , allIndex )=>(
    <div className='w-full px-2 flex justify-center py-2' key={allIndex}>
    <Select
    currentOption=""
    title={titleCase(allItem.headerName ?? "")}
    options={allItem.headerValues}
    placeholder='Select Allocations'
    onSelect={(value)=>onAllocationSelection(value,allItem.headerName)}/>  
    </div> 
  ))}

{categoryElement && categoryElement.map((element, index) => {
    return (
<React.Fragment key={index}>
 <div className='h-[73px] mt-2'>        
    <Input 
            placeholder={titleCase(`Enter ${element.name}`)}
            initialValue={""}
            title={element.name}
            error={element.name === "Total Amount" ? errorMsg.totalAmount : null}
            name={element.name}
            type={element.type === 'date' ? 'date' : element.type === 'amount' ? 'number' : 'text'}
            value={formDataValues[element.name] || ""}
            onChange={(value) => handleInputChange( element.name , value)}
    />
</div>   
</React.Fragment>
    );
  })}
</div>  

<div className='flex flex-col px-2 justify-between'>
<div className='flex flex-row items-center'>
<div className="h-[48px] w-[100px]  mb-10 mr-28 mt-[-10px] ">
           <Select
           title="Currency"
           name="currency"
           placeholder="Select Currency"
           options={['INR',"USD",'AUD']}
           onSelect={(value)=>(setFormDataValues({...formDataValues,['Currency']:value}))}
           />
</div>


<div className='w-fit'>
{ selectedCategory == null || selectedCategory !== defaultCurrency &&


<ActionButton text='Convert' onClick={handleConverter(totalAmount , selectedCategory)}/>

}
</div>

</div>
<div>
{currencyTableData?.currencyFlag ? 
<h2>Coverted Amount: {currencyTableData?.convertedAmount} ?? hello</h2> 
  : 
<h2 className='text-red-500'>{errorMsg.currencyFlag.msg}</h2>
}
</div>



<div className="w-full   flex items-center justify-center border-[1px] border-gray-50 ">
<Upload 
  selectedFile={selectedFile}
  setSelectedFile={setSelectedFile}
  fileSelected={fileSelected}
  setFileSelected={setFileSelected}
  />
</div>

</div>

  



 
                  
<div className="w-full px-2 py-4" >
  <Button text="Save" onClick={handleSaveLineItem} />
</div>
               
               
               


</>   
}



</div>
</div>}


{/* //---------save line item form end----------------------- */}
           {openModal && <div className="fixed overflow-hidden max-h-4/5 flex justify-center items-center inset-0 backdrop-blur-sm w-full h-full left-0 top-0 bg-gray-800/60 scroll-none" >
                <div className='z-10 max-w-4/5 w-2/5 min-h-4/5 max-h-4/5 scroll-none bg-white-100  rounded-lg shadow-md'>
                    <div className="p-10">
                        <p className="text-xl font-cabin">Seletct option for Enter Expense Line</p>
                        {/* <Select 
                            options={rejectionReasonOptions}
                            onSelect={onReasonSelection}
                            placeholder='Please select reason for rejection'
                        /> */}
                        <div className="flex mt-10 justify-between">
                            <Button variant='fit' text='Scan' onClick={handleModal} />
                            {/* setOpenLineItemForm(true) */}
                            <Button variant='fit' text='Manually' onClick={()=>{setOpenLineItemForm(true);handleModal()}} />
                        </div>
                    </div>
                </div>
                </div>
            }
           
        </div>
        
       
        </div>
      }
      <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} message={message}/>
        
      
    </div>
  )
}

export default CreateNonTraveExpense


function EditComponent({ lineItem, handleEdit }) {
  return (
    <>
      <div className="w-full border flex flex-wrap items-start justify-between py-4 px-4">
        {Object.entries(lineItem).map(([key, value]) => (
          key !== 'expenseLineId' && key !== 'Document' && key !== 'lineItemAllocation' &&(
            <React.Fragment key={key}>
              <div className='min-w-[200px]'>
                <div className="text-zinc-600 text-sm font-cabin">{titleCase(key)}</div>

                {/* Div with border styling */}
                <div className="w-full h-full bg-white items-center flex border border-neutral-300 rounded-md">
                  {/* Displaying key and value */}
                  <div key={key}>
                    <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin px-6 py-2">
                      {/* Display key and value */}
                      {` ${value}`}
                    </div>
                  </div>
                </div>
                <div className="w-full text-xs text-yellow-600 font-cabin">{['policyViolation']}</div>
              </div>
            </React.Fragment>
          )
        ))}

        {/* Mapping lineItemAllocation */}
        {lineItem.lineItemAllocation && lineItem.lineItemAllocation.map((allocation, index) => (
          <div key={index} className="min-w-[200px]">
            <div className="text-zinc-600 text-sm font-cabin">{titleCase(allocation.headerName)}</div>
            <div className="w-full h-full bg-white items-center flex border border-neutral-300 rounded-md">
              <div>
                <div className="text-neutral-700 w-full h-full text-sm font-normal font-cabin px-6 py-2">
                  {allocation.headerValue}
                </div>
              </div>
            </div>
            <div className="w-full text-xs text-yellow-600 font-cabin">{['policyViolation']}</div>
          </div>
        ))}
      </div>

      <div className="w-full px-2 py-4">
        <Button text="Edit" onClick={() => handleEdit(lineItem.expenseLineId)} />
      </div>
    </>
  );
}









function  EditFormComponent ({ lineItem, categoryElement, handleSave,expenseLineAllocation,handleConverter ,defaultCurrency}) {
  const [selectedFile  , setSelectedFile]=useState(null)
  const [fileSelected ,setFileSelected]= useState(false)
  const [selectedAllocations , setSelectedAllocations]=useState([])
  const [selectedCurrency, setSelectedCurrency]=useState(null)
  const [initialFile , setInitialFile]=useState(null)
  
const [formData, setFormData] = useState(lineItem);
 console.log('object',categoryElement)
 
  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };
 
  

  const onAllocationSelection = (option, headerName) => {
    // Create a new allocation object
    const newAllocation = { headerName: headerName, headerValue: option || "" };
    setSelectedAllocations((prevAllocations) => [...prevAllocations, newAllocation]);
  };
  

  useEffect(()=>{
    if (fileSelected) {
      setFormData({
        ...formData,
        ['Document']: selectedFile,
      });
    }
  },[(fileSelected)])

  useEffect(()=>{
    setFormData(({
      ...formData,
      lineItemAllocation: [...selectedAllocations],
    }));

  },[selectedAllocations])



  const handleSaveClick = () => {
    // Check if there are selectedAllocations

    console.log('Selected Allocations before update:');

    // If there are selectedAllocations, update lineItemAllocation in formData
   
      

    // If a file is selected, update the Document field in formData
    
  
    // Call your save function with the updated data
    console.log('Selected Allocations:', selectedAllocations);
    console.log('Updated FormData:', formData);
    // handleSave(formData);
  };
  
  useEffect(() => {
    // Set the initial file when the component is mounted
    setInitialFile(lineItem.Document);
  }, []);

  return (
   <>
 <div className='flex flex-col lg:flex-row border '>
  <div className='w-full lg:w-1/2 border  flex justify-center items-center px-4 py-4'>
   <DocumentPreview selectedFile={selectedFile} initialFile={initialFile}/>
  </div>
  <div className='w-full lg:w-1/2 border'>     
<div  className="w-full border flex flex-wrap items-start justify-between py-4 px-2"></div>
<div  className="w-full border flex flex-wrap items-start justify-between py-4 px-2">

  {expenseLineAllocation.length>0 && expenseLineAllocation.map((allItem , allIndex )=>(
    
    <div className='w-full px-2 flex justify-center py-2' key={allIndex}>
        <>
         <Select
         currentOption={''}
         title={titleCase(allItem.headerName ?? '')}
         options={allItem.headerValues}
         placeholder='Select Allocations'
         onSelect={(value) => onAllocationSelection(value, allItem.headerName)}
       />
       </>
      
</div> 
  ))} 
      {categoryElement && categoryElement.map((field) => (
        <div key={field.name} >
       
          <Input
            title={field.name}
            placeholder={titleCase(`Enter ${field.name}`)}
            type={field.type === 'date' ? 'date' : 'text'}
            name={field.name}
            initialValue={formData[field.name]}
            onChange={(value) => handleChange(field.name, value)}
            // onChange={(e) => handleChange(field.name, e.target.value)}
            className='mt-1 p-2 w-full border rounded-md'
          />  

        </div>  
      ))}
  <div className='flex flex-col  justify-between w-full'>
<div className='flex flex-row items-center'>
<div className="h-[48px] w-[100px]  mb-10 mr-28 mt-[-10px] ">
           <Select
           currentOption={lineItem['Currency']}
           title="Currency"
           name="currency"
           placeholder="Select Currency"
           options={['INR',"USD",'AUD']}
           onSelect={(value) =>{ handleChange( 'Currency' , value),setSelectedCurrency(value)}}
         
           />
</div>


<div className='w-fit'>
{selectedCurrency == null ||selectedCurrency !== defaultCurrency &&


<ActionButton text='Convert' onClick={()=>handleConverter("5000",selectedCurrency)}/>

}
</div>

</div>
{/* <div>
{currencyTableData?.currencyFlag ? 
<h2>Coverted Amount: {currencyTableData?.convertedAmount} ?? hello</h2> 
  : 
<h2 className='text-red-500'>{errorMsg.currencyFlag.msg}</h2>
}
</div> */}



<div className="w-full   flex items-center justify-center border-[1px] border-gray-50 ">
<Upload 
  selectedFile={selectedFile}
  setSelectedFile={setSelectedFile}
  fileSelected={fileSelected}
  setFileSelected={setFileSelected}
  
  />
</div>

</div>  

</div>


      <div className="w-full px-2 py-4" >
       <Button text="Update" onClick={handleSaveClick} />
    </div>
    </div>
</div>
    
      </>
   
  );
}





function DocumentPreview({selectedFile , initialFile}){


  return(
    <div className=' border-[5px] min-w-[100%] h-fit flex justify-center items-center'>
    {selectedFile ? 
    (
        <div className="w-full  flex flex-col justify-center">
          <p>Selected File: {selectedFile.name}</p>
          {/* <p>Size: {selectedFile.size} bytes</p>
          <p>Last Modified: {selectedFile.lastModifiedDate.toString()}</p> */}
          {selectedFile.type.startsWith('image/') ? (
            
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className=' h-[700px] w-full'
              
            />
            
          ) : selectedFile.type === 'application/pdf' ? (
            <embed
              src={URL.createObjectURL(selectedFile)}
              type="application/pdf"
              width="100%"
              height="700px"
            />
          ) : (
            <p>Preview not available for this file type.</p>
          )}
        </div>
      ) : 
      !initialFile ?
      <div className='w-full h-[700px] flex justify-center items-center bg-white-100 opacity-30'>
        <img src={!initialFile && file_icon || initialFile} className='w-40 h-40'/>
      </div> :
      <div className='w-full h-[700px] flex justify-center items-center '>
       {initialFile.toLowerCase().endsWith('.pdf') ? (
        // Display a default PDF icon or text for PDF files
        <div className='w-full'>
          <embed
            src={initialFile}
            type="application/pdf"
            width="100%"
            height="700px"
          />
        </div>
      ) : (
        // Display the image preview for other file types
        <img src={initialFile} alt="Initial Document Preview" className='w-40 h-40' />
      )}
      </div>
      }
    </div>

  )
}

function HeaderComponent(){
  return(
    <div className='my-5'>

          <div> 
                <div className="flex gap-2 font-cabin text-xs tracking-tight ">
                    <p className="w-[150px] text-neutral-600">Expense Header Number:</p>
                    <p className="text-neutral-700">Traveh8796876</p>
                </div>
                <div className="flex gap-2 font-cabin text-xs tracking-tight ">
                    <p className="w-[150px] text-neutral-600">Default Currency:</p>
                    <p className="text-neutral-700">INR</p>
                </div>
                <div className="flex gap-2 font-cabin text-xs tracking-tight ">
                    <p className="w-[150px] text-neutral-600">Category :</p>
                    <p className="text-neutral-700">Utilities</p>
                </div> 
                <div className="flex gap-2 font-cabin text-xs tracking-tight ">
                    <p className="w-[150px] text-neutral-600">Allocation Header and value to select :</p>
                    <p className="text-neutral-700">dropdown and values</p>
                </div> 
          </div>           
           </div>
  )
}