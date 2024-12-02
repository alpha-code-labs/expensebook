import multer from 'multer';
import axios from 'axios';
import dotenv from 'dotenv';
import OpenAI from "openai";
import { getExpenseCategoryFields } from './categoryFields.js';
// import { indianAirports } from '../data/airports.js';


dotenv.config()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const openai = new OpenAI({apiKey : process.env.OPEN_AI_API_KEY});

// Middleware to handle file upload
export const uploadMiddleware = upload.single('file');

// Bill uploaded 
export const handleFileUpload = async (req, res) => {
  try {
    //const fileContent = req.file.buffer;
    // const category = req.body.category;
    const fileContent = req.file.buffer;
    const {tenantId, travelType, category} = req.params

 
    // console.log(category, fileURL , 'category, fileURL');

    // console.log(category, fileURL , 'category, fileURL');

    const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
    const apiKey = process.env.FORM_RECOGNIZER_API_KEY;
    const modelId = process.env.FORM_RECOGNIZER_MODELID;

    const apiUrl = `${endpoint}/formrecognizer/documentModels/${modelId}:analyze?api-version=2023-07-31`;

    const response = await axios.post(
      apiUrl,
      fileContent,
    //   { "urlSource" : fileURL },
      {
        headers: {
          'Content-Type': 'application/pdf',
          'Ocp-Apim-Subscription-Key': apiKey
        },
        responseType: 'json'
      }
    );

    const { headers } = response;
    console.log('These are the headers: ', headers);

    const { 'apim-request-id': resultId } = headers;
    console.log(resultId);

    //Assuming you have a function makeApiCall defined somewhere
    const finalResult_res = await makeApiCall(resultId,tenantId,travelType, category);
    console.log("finalResult - after openai",finalResult_res, 'final result res')

    if(!finalResult_res.success){
      return res.status(200).json(({success: false, data: {}}))
    }

    const currency = finalResult_res?.currency;
    const fields =finalResult_res?.fields 

    return res.status(200).json({ success: true, fields, currency});

    //return res.status(200).json({ success: true, data: {from:'Chhatrapati Shivaji Maharaj International Airport', to:'John F. Kennedy International Airport', date:'2024-02-18', time:'11:30', 'Tax Amount': 2394, 'Total Amount':24000} });
  } catch (error) {
    console.error("Error calling Azure Form Recognizer:");
    console.error(error);

    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export  const makeApiCall = async (resultId,tenantId,travelType, category) => {
   try{
    const delayInMilliseconds = 10000; 
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    console.log("i am inside make api call", resultId)
    await delay(delayInMilliseconds );
    return await getResult(resultId,tenantId,travelType, category)
   }catch(e){
    return {success: false, }
   }
}

//get the ocr result
export const getResult = async (resultId,tenantId,travelType, category,res) => {
  try {
    console.log("i am inside get result", resultId, " ", category)
    const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
    const apiKey = process.env.FORM_RECOGNIZER_API_KEY;
    const modelId = process.env.FORM_RECOGNIZER_MODELID;
    let fieldsString = {};

    const tenantData = await getExpenseCategoryFields(tenantId, travelType, category) 

    console.log("tenantData fields ", JSON.stringify(tenantData,'',2))

    fieldsString= JSON.stringify(tenantData.fields)

    let getCurrency={
        "countryCode": "",
        "fullName": "",
        "shortName": "",
        "symbol": ""
    }

    const CurrencyPrompt = JSON.stringify(`send this as separate Currency json object, Identify the currency in the provided text and return the corresponding JSON object in the following format:
    {
        "countryCode": "IN",
        "fullName": "Indian Rupee",
        "shortName": "INR",
        "symbol": "₹"
    }
    If no currency match is found, return an empty object.`);


    const dateFormat = JSON.stringify(`from text next- extract any kind of date in this format - "2024-11-22", yyyy-mm-date`)
    
    let dataLogic = ""; 
    switch (tenantData.expenseCategory.toLowerCase()) { 
      case 'flight': 
        dataLogic += 'while extracting fields after this -If airport codes are found for departure/from and arrival/to fields, convert them to city names (e.g., DEL -> Delhi). extract bookingId'; 
        break;
      case 'meals':
        dataLogic = "Field name: 'Bill Date', Field value: Extract the date when the transaction occurred, labeled as 'Invoice Date' or 'Bill Date', " +
        "Field name: 'Bill Number', Field value: Extract the number uniquely identifying this bill, often labeled as 'Invoice No.' or 'Bill Number', " +
        "Field name: 'Vendor Name', Field value: Extract the name of the vendor or restaurant from the invoice, typically found near 'Restaurant Name' or 'Legal Entity Name', " +
        "Field name: 'Description', Field value: Summarize the description of items or services provided, look for labels like 'Service Description' or 'Particulars', " +
        "Field name: 'Quantity', Field value: Count the number of items purchased, detailed under 'Particulars' or 'Item(s) Total', exclude charges like 'Restaurant Packaging Charge', " +
        "Field name: 'Unit Cost', Field value: Extract the cost per item, look for patterns around each listed item under 'Particulars', do not consider additional fees or taxes, " +
        "Field name: 'Tax Amount', Field value: Sum the values of CGST and SGST if present to calculate total tax; if not, extract the total tax from a single 'Tax Amount' entry, " +
        "Field name: 'Total Amount', Field value: Extract the total payable amount, often found at the bottom of the invoice as 'Total Value' or 'Amount'.";
    }

    switch (tenantData.fields.name) { 
      case 'Booking Reference Number': 
      case 'Booking Reference No':
        dataLogic += "extract BOOKING ID/ booking reference number, don't take PNR/pnr,if not found send ''"; 
        break;
      case 'Invoice Date':
        dataLogic += "extract Invoice Date/booking Date, don't take date or start date , if not found send ''"
        break;
      case 'Total Amount':
          dataLogic += "only numeric and period is allowed, remove any other special characters expect period in between"
          break;
        
      default:
        dataLogic += "extract the fields by analyzing the invoice structure and how they are extracted as per standard"
        break;
    }

    // switch(category){
    //   case 'flights' : { 
    //     fieldsString = "field name: 'from' field value: 'departure airport full name', field name : 'to', field value: 'arrival airport full name', field name : date  field value: 'date of flight in format ISO 8601', field name : 'vendorName' field value: 'name of vendor', field name : 'totalAmount' field value: 'total fare for the ride', field name : 'taxAmount', field value:  'tax amount for the ride' ";
    //     break;
    //   }
    //   case 'trains' : { 
    //     fieldsString = "field name: 'from' field value: 'departure station full name', field name : 'to', field value: 'arrival station full name', field name : date  field value: 'date of train in format ISO 8601', field name : 'vendorName' field value: 'name of vendor', field name : 'totalAmount' field value: 'total fare for the ride', field name : 'taxAmount', field value:  'tax amount for the ride' ";
    //     break;
    //   }
    //   case 'buses' : { 
    //     fieldsString = "field name: 'from' field value: 'departure address', field name : 'to', field value: 'arrival address', field name : date  field value: 'date of bus in format ISO 8601', field name : 'vendorName' field value: 'name of vendor', field name : 'totalAmount' field value: 'total fare for the ride', field name : 'taxAmount', field value:  'tax amount for the ride' ";
    //     break;
    //   }
    //   case 'cabs' : { 
    //     fieldsString = "pickupAddress, dropAddress, date (date of cab in format ISO 8601), vendorName, totalAmount (total fare for the ride), taxAmount (tax amount for the ride)";
    //     break;
    //   }
    //   case 'hotels': {
    //     `location (location of the hotel), hotelName (Name of hotel), field name : checkIn field value : 'check in date in format ISO 8601', field name : checkOut field value : 'check out date in format ISO 8601' , field name : checkInTime field value: checkIn Time, field name : checkOutTime,  field value : check Out Time), totalAmount, taxAmount`;
    //     break;
    //   }
    // }

    // switch(category){
    //     case 'flights':
    //   {
    //     fieldsString = "field name: 'from', field value: 'departure airport full name', field name: 'to', field value: 'arrival airport full name', field name: 'date', field value: 'date of flight in format ISO 8601', field name: 'vendorName', field value: 'name of vendor', field name: 'totalAmount', field value: 'total fare for the ride', field name: 'taxAmount', field value: 'tax amount for the ride'";
    //     break;
    //   }
    // }

    // const formFields = await  findCurrency(tenantData,getKeyValuePairs, response.data)

    console.log("making api call");

    const apiUrl = `${endpoint}/formrecognizer/documentModels/${modelId}/analyzeResults/${resultId}?api-version=2023-07-31`;
    const response = await axios.get(
      apiUrl,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey
        }
      }
    );
    // console.log("get from Azure Form Recognizer:", response);
    
    console.log("dataLogic right before query", JSON.stringify(dataLogic,'',2))
    const allKeyValuePairs = response.data.analyzeResult.keyValuePairs
    .filter(pair=>pair.value!=undefined)
    .map(pair=>{
      return {key: pair.key.content, value: pair.value.content}
    })

    console.log("system prompt: ", `You are a helpful assistant. Extract following fields,if confidence is <75 , send that fields as "", ${fieldsString} ,from the provided data and return them in the JSON format: enclose the JSON with starting characters`);
    console.log("user prompt :", `data: ${JSON.stringify(response.data.analyzeResult.content)}` )
    console.log("getting structured result from chat-gpt...")

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
          { role: "system", content: `You are a helpful assistant.1)${dateFormat}${dataLogic}, Extract following fields, For any kind of amount field should have only numeric and period, remove others. fieldsString: ${fieldsString},from the provided data and return them in the JSON format like key and value pairs,like 1st one with key fields, 2nd object with key currency, do not add any comments send only JSON in response 2)from the fieldsString extract currency used for total ${CurrencyPrompt}`},
    
          {
              role: "user",
              content: `data: ${JSON.stringify(response.data.analyzeResult.content)}`,
          },
      ],
    });

    console.log("OPENAI_EXTRACTION",completion.choices[0].message.content , typeof completion.choices[0].message.content)
    
    console.log("what is typeof fields",typeof completion.choices[0].message.content.fields);

    const getData = JSON.parse(completion.choices[0].message.content)
    console.log("getData", typeof getData , getData)
    const fields = getData.fields
    const currency = getData.currency

    
    console.log("data found: finalResult", fields,currency )
    return { success: true, keyValuePairs: allKeyValuePairs, fields,currency };

  } catch (error) {
    console.error("Error calling Azure Form Recognizer:");
    console.error(error);

    return { success: false, error: "Internal Server Error" };
  }
}




























export const findMatchingFields = async (tenantData, keyValuePairs, data) => {
    // const trimAndNormalize = (str) => str.trim().replace(/\s+/g, '').toLowerCase();
    const trimAndNormalize = (str) => str.trim().replace(/\s+/g, '').replace(/[.,|:-]/g, '').toLowerCase();
  
  
    const matchFieldWithKey = (fieldName, category) => {
      const lowerCaseFieldName = trimAndNormalize(fieldName);
      // console.log(`Normalized field name: ${lowerCaseFieldName}`);
  
      const categoryRegexPattern = regexPattern[category] || {};
      // console.log(`Category regex pattern:`, categoryRegexPattern);
  
      for (const [key, regex] of Object.entries(categoryRegexPattern)) {
        // console.log(`Checking key: ${key} with regex: ${regex}`);
        if (regex.test(lowerCaseFieldName)) {
          const matchingPair = keyValuePairs.find(pair => regex.test(trimAndNormalize(pair.key)));
          // console.log(`Matching pair for ${key}:`, matchingPair);
          return matchingPair ? matchingPair.value : '';
        }
      }
  
      return '';
    };
  
    // console.log("tenanat data fields", JSON.stringify(tenantData,'',2))
  if(!tenantData.fields){
    return ( `message:"Contact Admin for further information"`)
  }
     let Currency = {}
    const fields = await Promise.all(tenantData?.fields?.map(async field => {
      const { name, type } = field;
      // console.log(`Processing field: ${name} of type: ${type}`);
      
      let value = await matchFieldWithKey(name, tenantData?.expenseCategory);
      console.log(`Matched value for ${name}: ${value}`);
    
      // const Departure = /departure|departure from|from|departure city|from city/i;
      // const Arrival = /arrival to|to|arrival city|to city|arrival/i;
  
      const Departure = /\b(departure|departure from|from|departure city|from city)\b/i;
      const Arrival = /\b(arrival to|to|arrival city|to city|arrival)\b/i;
      const totalAmountRegex = /^total\s*(amount|cash|paid|booking\s*amount)$/i;
      const billNumberRegex = /(?:INVOICE\s*NO\.\s*|invoice\s*no(?:\.\s*)?|invoice\s*number|bill number|bill no|bill nos|invoice no|invoice nos|bill ref|bill reference|invoice ref|invoice reference)\s*:\s*([\w\d]+)/i;
      const vendorNameRegex=/vendor name|restaurant name/i;
      const extractTaxAmountRegex = /(?:tax\s*amount|total\s*tax|tax|gst|cgst|sgst|igst|service\s*tax|vat)\s*(?:amount|value|charge|paid|payable)\s*(?:@|at|on|is|:)?\s*(?:INR|rs|₹)?\s*[\d,]+(?:\.\d+)?/i;
      const improvedTaxAmountRegex = /(?:tax\s*(?:amount|amt|amont|\s)?(?:@|at|on|is|:)?\s*(?:INR|rs|₹)?\s*[\d,]+(?:\.\d+)?)/i;
  
  
      if (Departure.test(name)) {
        const res = extractAirportPairs(data);
        console.log("the airport from and to", res);
    
        // Assuming res always has at least one object
        const firstAirport = res[0];
    
        // Update value directly based on the match
        if (firstAirport.Departure) {
          value = firstAirport.Departure;
        }
      } else if (Arrival.test(name)) {
        const res = extractAirportPairs(data);
        console.log("the airport from and to", res);
    
        // Assuming res always has at least one object
        const firstAirport = res[0];
    
        // Update value directly based on the match
        if (firstAirport.Arrival) {
          value = firstAirport.Arrival;
        }
      } 
      else if (totalAmountRegex.test(name)) {
        const res = extractTotalAmount(keyValuePairs);
        console.log("dabbulu", res);
        if(!res){
          return {name,type,value}
        }
        const {total, getCurrency} = handleResponse(res); 
        // console.log("Final Response:Currency and total",total, getCurrency , typeof total , typeof getCurrency);
        value = total;
        Currency = getCurrency
      } else if(billNumberRegex.test(name)){
        const res = extractBillNumber(keyValuePairs);
        if(!res){
          return {name,type,value}
        }
        value = res; // Update value with bill number
      } else if (vendorNameRegex.test(name)){
       const res = extractVendorName(data)
       if(!res){
        return {name,type,value}
       }
       value=res
      } else if (improvedTaxAmountRegex.test(name)){
        const res = extractTaxAmount(keyValuePairs);
        if(!res){
          return {name,type,value}
        }
        const {total, getCurrency} = handleResponse(res); 
        // console.log("res", res, "Tax amount Response:Currency and total",total, getCurrency , typeof total , typeof getCurrency);
        value = total;
      }
      return { name, type, value };
    }));
  
    // console.log(`Final fields:`, fields);
    return { success: true, data: { fields,Currency } };
  };


















// import multer from 'multer';
// import axios from 'axios';
// import dotenv from 'dotenv';
// import { indianAirports } from '../data/airports.js';


// dotenv.config()

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Middleware to handle file upload
// export const uploadMiddleware = upload.single('file');

// // Bill uploaded 
// export const handleFileUpload = async (req, res) => {
//   try {
//     //const fileContent = req.file.buffer;
//     const category = req.body.category;
//     const fileURL = req.body.fileURL;

//     console.log(category, fileURL , 'category, fileURL');

//     const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
//     const apiKey = process.env.FORM_RECOGNIZER_API_KEY;
//     const modelId = process.env.FORM_RECOGNIZER_MODELID;

//     const apiUrl = `${endpoint}/formrecognizer/documentModels/${modelId}:analyze?api-version=2023-07-31`;

//     const response = await axios.post(
//       apiUrl,
//       //fileContent,
//       { "urlSource" : fileURL },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Ocp-Apim-Subscription-Key': apiKey
//         },
//         responseType: 'json'
//       }
//     );

//     const { headers } = response;
//     console.log('These are the headers: ', headers);

//     const { 'apim-request-id': resultId } = headers;
//     console.log(resultId);

//     //Assuming you have a function makeApiCall defined somewhere
//     const finalResult = await makeApiCall(resultId, category);

//     let finalResult_ = {}

//     if(category == 'flights'){
//       finalResult_ = {
//         from: 'Indira Gandhi International Airport',
//         to: 'Chaudhary Charan Singh International Airport',
//         date: '2019-01-27',
//         vendorName: 'Yatra',
//         taxAmount: 0,
//         totalAmount: 5258
//       }
//     }

//     if(category == 'trains'){
//       finalResult_ = {
//         from: 'H. Nizammudin',
//         to: 'Raipur JN',
//         date: '2012-03-09',
//         vendorName: 'IRCTC',
//         taxAmount: 0,
//         totalAmount: 438,
//       }
//     }

//     if(category == 'hotels'){
//       finalResult_ = {
//         location: 'Behind Mango Market, Tiruchanoor Road, Thanapalli Cross, Chittoor Highway, Tirupati',
//         hotelName: 'OYO 19985 Seven Hills Inn,No 247/1 & 248 /2,',
//         checkIn: '2019-09-26',
//         checkOut: '2019-09-26',
//         vendorName: 'Oravel Travels Pvt. Ltd.',
//         taxAmount: 0,
//         totalAmount: 761
//       }
//     }

//     return res.status(200).json({ success: true, data: finalResult_});

//     //return res.status(200).json({ success: true, data: {from:'Chhatrapati Shivaji Maharaj International Airport', to:'John F. Kennedy International Airport', date:'2024-02-18', time:'11:30', 'Tax Amount': 2394, 'Total Amount':24000} });
//   } catch (error) {
//     console.error("Error calling Azure Form Recognizer:");
//     console.error(error.message);

//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// };

// export  const makeApiCall = async (resultId, category) => {
//     const delayInMilliseconds = 10000; 
//     const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//     console.log("i am inside make api call", resultId)
//     await delay(delayInMilliseconds );
//     return await getResult(resultId, category)
// }

// //get the ocr result
// export const getResult = async (resultId,category,res) => {
//   try {
//     console.log("i am inside get result", resultId)
//     const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
//     const apiKey = process.env.FORM_RECOGNIZER_API_KEY;
//     const modelId = process.env.FORM_RECOGNIZER_MODELID;

//     // `${endpoint}/documentintelligence/documentModels/${modelId}/analyzeResults/${resultId}?api-version=2023-10-31-preview&features=keyValuePairs`,
//     const apiUrl = `${endpoint}/formrecognizer/documentModels/${modelId}/analyzeResults/${resultId}?api-version=2023-07-31`;
//     const response = await axios.get(
//       apiUrl,
//       {
//         headers: {
//           'Ocp-Apim-Subscription-Key': apiKey
//         }
//       }
//     );
//     console.log("get from Azure Form Recognizer:", response);
    
//     const ocrOutput = await extractFormFields(response.data, category)
    
//     const allKeyValuePairs = response.data.analyzeResult.keyValuePairs
//     .filter(pair=>pair.value!=undefined)
//     .map(pair=>{
//       return {key: pair.key.content, value: pair.value.content}
//     })

//     return { success: true, data: ocrOutput, keyValuePairs: allKeyValuePairs };
//   } catch (error) {
//     console.error("Error calling Azure Form Recognizer:");
//     console.error(error);

//     return { success: false, error: "Internal Server Error" };
//   }
// }

// // Based on bill category type use regex to extract fields and send as response
// export const formFieldsBasedOnCategory = async (data, category, res) => {
// const categoryNames = ['hotels', 'trains', 'cab', 'bus'];

// const flightCategory = 'flights';

// if (flightCategory == category) {
//     const [fromAndTo, otherFields] = await Promise.allSettled([
//         extractAirportPairs(data), extractFormFieldsForAll(data)
//     ]);

//     const fulfilledResults = [fromAndTo, otherFields].filter(result => result.status === 'fulfilled');
//     const rejectedResults = [fromAndTo, otherFields].filter(result => result.status === 'rejected');

//     if (fulfilledResults.length === 2) {
//         const flightFormFields = {
//             success: true,
//             data: {
//                 ...fulfilledResults[0].value.data,
//                 ...fulfilledResults[1].value.data
//             }
//         };
//         return res.status(200).json(flightFormFields);
//     } else {
//         const errorResult = {
//             success: false,
//             error: rejectedResults[0].reason.message
//         };
//         return res.status(500).json(errorResult);
//     }
// } else if (categoryNames.includes(category)) {
//     const result = await extractFormFieldsForAll(data);
//     if (result.success) {
//         return res.status(200).json(result);
//     } else {
//         return res.status(500).json(result);
//     }
// } 
// else {
//     try {
//         const [resultForAll, customResult] = await Promise.allSettled([
//             extractFormFieldsForAll(data),
//             extractFormFieldsCustom(data)
//         ]);

//         const fulfilledResults = [resultForAll, customResult].filter(result => result.status === 'fulfilled');
//         const rejectedResults = [resultForAll, customResult].filter(result => result.status === 'rejected');

//         if (fulfilledResults.length === 2) {
//             const combinedResult = {
//                 success: true,
//                 data: {
//                     ...fulfilledResults[0].value.data,
//                     ...fulfilledResults[1].value.data
//                 }
//             };
//             return res.status(200).json(combinedResult);
//         } else {
//             const errorResult = {
//                 success: false,
//                 error: rejectedResults[0].reason.message
//             };
//             return res.status(500).json(errorResult);
//         }
//     } catch (error) {
//         console.error("Error in processing form fields:", error);
//         return res.status(500).json({ success: false, error: "Internal Server Error" });
//     }
// }
// }

// // for all
// export const extractFormFieldsForAll = async(data) => {
// try {
// console.log("Data:", data);

//   // Total Booking Amount extraction  
//  //   const totalAmountRegex = /Total\s*([\w\s]+)\s*Amount[\s\S]*?([\d.]+)/i;
//  const totalAmountRegex = /(?:Total|TOTAL|total|Amount|amt|Amt|price|Price|Fair|fair)\s*([\w\s]+)\s*Amount[\s\S]*?([\d.]+)/i;
//   const totalAmountMatch = await data.analyzeResult.content.match(totalAmountRegex);

//  if (totalAmountMatch) {
//   const amountType = totalAmountMatch[1].trim();
//   const totalAmountNumber = parseFloat(totalAmountMatch[2]);

//   if (!isNaN(totalAmountNumber)) {
//     console.log(`Extracted ${amountType} Total Amount:`, totalAmountNumber);
//   } else {
//     throw new Error(`Failed to convert ${amountType} total amount to a number.`);
//   }
// } else {
//   console.error('Total amount not found in the content.');
// }

// // Customer Name extraction
// //   const customerNameRegex = /CUSTOMER NAME\s*([\w\s]+)/i;
//   const customerNameRegex = /(?:customer name|full name|guest name|name|traveller name)\s*:\s*([\w\s]+)/i;
//   const customerNameMatch = data.analyzeResult.content.match(customerNameRegex);

//   if (customerNameMatch) {
//     const customerName = customerNameMatch[1].trim();
//     console.log('Extracted Customer Name:', customerName);
//   } else {
//     console.error('Customer Name not found in the content.');
//   }

//   // Invoice No extraction
//   const invoiceNoRegex = /(?:INVOICE\s*NO\.\s*|invoice\s*no(?:\.\s*)?|invoice\s*number)\s*:\s*([\w\d]+)/i;
  
//   const invoiceNoMatch = data.analyzeResult.content.match(invoiceNoRegex);

//   if (invoiceNoMatch) {
//     const invoiceNo = invoiceNoMatch[1];
//     console.log('Extracted Invoice No:', invoiceNo);
//   } else {
//     console.error('Invoice No not found in the content.');
//   }

//   const taxAmountRegex = /(?:tax|total tax)\s*(?:amount)?\s*:\s*([\d.]+)/i;
//   const taxAmountMatch = data.analyzeResult.content.match(taxAmountRegex);

//   if (taxAmountMatch) {
//       const taxAmount = parseFloat(taxAmountMatch[1]);
//       console.log('Extracted Tax Amount:', taxAmount);
//   } else {
//       console.error('Tax Amount not found in the content.');
//   }

//   // Date extraction , check in and checkout date 
// //   const dateRegex = /(?:DATE|INVOICE DATE|Invoice Date|Date|invoicedate|invoice Date|Invoice Date|check\s*in\s*Date|check\s*out\s*Date|check\s*in|check\s*out):\s*([\d/]+)/i;
//   const dateRegex = /\b(?:billdate|invoicedate|date|invoice\s*date)\s*[\-:\s]*\b/i;
//   const dateFormatPattern = /\b\d{4}[-/:\s]\d{2}[-/:\s]\d{2}\b/g;
//   const checkInRegex = /\bcheck\s*[\-:\s]*in\s*[\-:\s]*\b/i;
//   const checkOutRegex = /\bcheck\s*[\-:\s]*out\s*[\-:\s]*\b/i;

//   const dateMatch = data.analyzeResult.content.match(dateRegex);
//   const dateFormats = data.analyzeResult.content.match(dateFormatPattern);
//   const checkInMatch = data.analyzeResult.content.match(checkInRegex);
//   const checkOutMatch = data.analyzeResult.content.match(checkOutRegex);
 
//   if (checkInMatch) {
//     return `Pattern Match: checkIn - ${dateFormats ? dateFormats.join(', ') : 'No date found'}`;
// } else if (checkOutMatch) {
//     return `Pattern Match: checkOut - ${dateFormats ? dateFormats.join(', ') : 'No date found'}`;
// } else if (dateMatch) {
//     const patternMatch = dateMatch[0];
//     return `Pattern Match: ${patternMatch} and ${patternMatch} date - ${dateFormats ? dateFormats.join(', ') : 'No date found'}`;
// } else {
//     return 'No match found';
// }

// } catch (error) {
//   console.error('Error:', error.message);
// }
// };

// // custom fields
// export const extractFormFieldsCustom = async (data) => {
// try {
// console.log("Data:", data);

//     // Custom Logic for Quantity extraction
//     const quantityRegex = /(?:qty|items|quantity|)\s*:\s*([\d.]+)/i;
//     const quantityMatch = data.analyzeResult.content.match(quantityRegex);

//     if (quantityMatch) {
//         const quantity = parseFloat(quantityMatch[1]);
//         console.log('Extracted Quantity:', quantity);
//     } else {
//         console.error('Quantity not found in the content.');
//     }

// } catch (error) {
//     console.error('Error:', error.message);
// }
// };

// // To extract Airport names from ticket
// export const extractAirportPairs = (data) => {
//   const regexPattern = /([A-Z]{3})\s*-\s*([A-Z]{3})/g;
//   const matches = data.analyzeResult.content.match(regexPattern);


//   if (matches) {
//     console.log("Matches found:", matches);
//     const [fullMatch, from, to] = regexPattern.exec(matches[0]);

//     return {
//       from: indianAirports[from],
//       to: indianAirports[to]
//     };
    
//     // const airportPairs = matches.map(match => {
//     //   const [fullMatch, from, to] = regexPattern.exec(match);
      
//     //   console.log(`Travelling ${from} / ${indianAirports[from]}, ${to} / ${indianAirports[to]}`);
      
//     //   return {
//     //     from: indianAirports[from],
//     //     to: indianAirports[to]
//     //   };
//     // });
    
//     // console.log("Airport pairs:", airportPairs);
//     // return airportPairs;
//   } else {
//     console.log("No matches found.");
//     return {from: undefined, to:undefined};
//   }
// };


// const extractDate = (data)=>{
//   let date = undefined;

//   data.analyzeResult.keyValuePairs.forEach(pair=>{
//     if(pair.value != undefined){
//       const tokens = pair.key.content.split(' ');

//       if(tokens.length>0){
//         tokens.forEach(token=>{
//           if(['date', 'Date', 'date:', 'Date:', 'date :', 'Date :'].includes(token)){
//               date = pair.value.content;
//               return;
//           }
//         })
          
//       }
      
//     }
//   })

//   return date;
// }

// const extractTotalAmount = (data)=>{
//   let totalAmount;
//   const pairs = data.analyzeResult.keyValuePairs;

//   for(let i=0; i<pairs.length; i++){
//     const pair = pairs[i];

//     if(pair.value != undefined){
//       const validTokens = ['total amount', 'total fare', 'total', 'amount', 'fare', 'paid', 'total paid']
//       let key = pair.key.content.toLowerCase();

//       //sanitize key
//       key = key.replace(/[^a-z]/gi, '').trim()

//       if(validTokens.includes(key)){
//         return pair.value.content
//       }
//     }
//   }

//   return undefined;
// }

// const extractTaxAmount = (data)=>{
//   let totalAmount;
//   const pairs = data.analyzeResult.keyValuePairs;

//   for(let i=0; i<pairs.length; i++){
//     const pair = pairs[i];

//     if(pair.value != undefined){
//       const validTokens = ['tax amount', 'total tax', 'tax', 'gst', 'igst']
//       let key = pair.key.content.toLowerCase();

//       //sanitize key
//       key = key.replace(/[^a-z]/gi, '').trim()

//       if(validTokens.includes(key)){
//         return pair.value.content
//       }

//     }
//   }

//   return undefined;
// }

// const extractVendorName = (data)=>{
//   const pairs = data.analyzeResult.keyValuePairs;
//   for(let i=0; i<pairs.length; i++){
//     const pair = pairs[i];

//     if(pair.value != undefined){
//       const validTokens = ['vendor', 'vendor name']
//       let key = pair.key.content.toLowerCase();

//       //sanitize key
//       key = key.replace(/[^a-z]/gi, '').trim()

//       if(validTokens.includes(key)){
//         return pair.value.content
//       }

//     }
//   }

//   return undefined;
// }

// const extractFrom = (data)=>{
//   const pairs = data.analyzeResult.keyValuePairs;
//   for(let i=0; i<pairs.length; i++){
//     const pair = pairs[i];

//     if(pair.value != undefined){
//       const validTokens = ['from', 'departure', 'source', 'source station']
//       let key = pair.key.content.toLowerCase();

//       //sanitize key
//       key = key.replace(/[^a-z]/gi, '').trim()

//       if(validTokens.includes(key)){
//         return pair.value.content
//       }

//     }
//   }

//   return undefined;
// }

// const extractTo = (data)=>{
//   const pairs = data.analyzeResult.keyValuePairs;
//   for(let i=0; i<pairs.length; i++){
//     const pair = pairs[i];

//     if(pair.value != undefined){
//       const validTokens = ['to', 'destination', 'arrival', 'destination station']
//       let key = pair.key.content.toLowerCase();

//       //sanitize key
//       key = key.replace(/[^a-z]/gi, '').trim()

//       if(validTokens.includes(key)){
//         return pair.value.content
//       }

//     }
//   }

//   return undefined;
// }

// const extractFormFields = async (data, category)=>{
//   let from, to;

//   if(category == 'flights'){
//    const pair =  extractAirportPairs(data)
//    from = pair.from;
//    to = pair.to;
//   }else{
//     from = extractFrom(data)
//     to = extractTo(data)
//   }
  
//   const date = extractDate(data);
//   const totalAmount = extractTotalAmount(data)
//   const taxAmount = extractTaxAmount(data);
//   const vendorName = extractVendorName(data);
//   console.log(from, to, date, totalAmount, taxAmount, vendorName, 'extracted fields....')
//   return {from:from, to:to, date:date, totalAmount:totalAmount, taxAmount:taxAmount, vendorName:vendorName};
// }
