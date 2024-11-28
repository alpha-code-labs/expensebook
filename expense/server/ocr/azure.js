import multer from 'multer';
import axios from 'axios';
import dotenv from 'dotenv';
import { indianAirports } from '../utils/airports.js';
import { getExpenseCategoryFields } from './categoryFields.js';
import { trimAndNormalize } from '../utils/date.js';


dotenv.config()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle file upload
export const uploadMiddleware = upload.single('file');

// Bill uploaded 
export const handleFileUpload = async (req, res) => {
  try {
    const fileContent = req.file.buffer;
    const {tenantId, travelType, category} = req.params

    console.log("file",fileContent , "category",category )

    const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
    const apiKey = process.env.FORM_RECOGNIZER_API_KEY;
    const modelId = process.env.FORM_RECOGNIZER_MODELID;

    const apiUrl = `${endpoint}/formrecognizer/documentModels/${modelId}:analyze?api-version=2023-07-31`;

    const response = await axios.post(
      apiUrl,
      fileContent,
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

    const tenantData = await getExpenseCategoryFields(tenantId, travelType, category) 

    console.log("tenantData fields ", JSON.stringify(tenantData,'',2))
    if (!tenantData) {
      return res.status(404).json({ error: 'Tenant data not found for the specified criteria', message: `Requested data not found for Tenant ID: ${tenantId}, Travel Type: ${travelType}, and Category: ${category}. Please verify these details and try again.`});
    }

    //to get form data 
    const finalResult = await makeApiCall(resultId, category, tenantData);

    if (!finalResult) {
      return res.status(500).json({ error: 'Failed to retrieve data from the external API.' });
    }

    return res.status(200).json(finalResult);

    //return res.status(200).json({ success: true, data: {from:'Chhatrapati Shivaji Maharaj International Airport', to:'John F. Kennedy International Airport', date:'2024-02-18', time:'11:30', 'Tax Amount': 2394, 'Total Amount':24000} });
  } catch (error) {
    console.error("Error calling Azure Form Recognizer:");
    console.error(error);

    res.status(500).json({ success: false, error: "An unexpected error occurred. Please try again later." });
  }
};

export  const makeApiCall = async (resultId, category,tenantData) => {
    const delayInMilliseconds = 10000; 
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    console.log("i am inside make api call", resultId)
    await delay(delayInMilliseconds );
    return await getResult(resultId, category,tenantData)
}

//get the ocr result
export const getResult = async (resultId,category,tenantData,res) => {
  try {
    console.log("i am inside get result", resultId)
    const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
    const apiKey = process.env.FORM_RECOGNIZER_API_KEY;
    const modelId = process.env.FORM_RECOGNIZER_MODELID;

    // `${endpoint}/documentintelligence/documentModels/${modelId}/analyzeResults/${resultId}?api-version=2023-10-31-preview&features=keyValuePairs`,
    const apiUrl = `${endpoint}/formrecognizer/documentModels/${modelId}/analyzeResults/${resultId}?api-version=2023-07-31`;
    const response = await axios.get(
      apiUrl,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey
        }
      }
    );
    
    console.log("get from Azure Form Recognizer:", response);
    console.log("typeof:", typeof response);

    if (response.status === 200 && response.data?.status === "succeeded") { 
      const getKeyValuePairs = response.data?.analyzeResult?.keyValuePairs
      .filter(pair => pair.confidence > 0.80)
      .map(pair=>{
        return {key: pair.key.content, value: pair.value.content}
      })
      // console.log("extracted data successfully", getKeyValuePairs); 
      const formFields = await  findMatchingFields(tenantData,getKeyValuePairs, response.data)

      // const[ ocrOutput, formFields, testing] = await  Promise.all([
      //   extractFormFields(response.data, category),
      //   findMatchingFields(tenantData,getKeyValuePairs, response.data),
      //   formFieldsBasedOnCategory(response.data,category)
      //   ]) 
      // const matched = formFields?.success === true ? { fields: formFields.data.fields } : null
      // return { success: true, getKeyValuePairs , ocrOutput, ...matched, testing};
      const matched = formFields?.success === true ? { fields: formFields.data.fields } : null
      const Currency = formFields?.success === true ? { Currency: formFields.data.Currency } : null
      return { success: true, getKeyValuePairs , ...matched , Currency};
  } else {
      // console.log("failed to extract, please try again");
      res.status(500).json({ success: false, error: "An unexpected error occurred. Please try again later." });
  }
    const ocrOutput = await extractFormFields(response.data, category)
    
    const allKeyValuePairs = response.data.analyzeResult.keyValuePairs
    .filter(pair=>pair.value!=undefined)
    .map(pair=>{
      return {key: pair.key.content, value: pair.value.content}
    })

    // console.log("allKeyValuePairs", allKeyValuePairs ,tenantData )
    // console.log(" response.data",  response.data)

    const formFields = await findMatchingFields(tenantData,allKeyValuePairs, response.data)
    return { success: true, data: ocrOutput, keyValuePairs: allKeyValuePairs, tenantData , formFields };
  } catch (error) {
    console.error("Error calling Azure Form Recognizer:", error);
    console.error(error);
    res.status(500).json({ success: false, error: "An unexpected error occurred. Please try again later." });
  }
}



const regexPattern = {
  flight: {
    date: /date:|date|invoice date|travel date|booking date|bill date|trip date|date of journey|date of departure/i,
    flightNumber: /flight no|flight number|flight/i,
    departure: /departure|departure from|from|departure city|from city/i,
    arrival: /arrival to|to|arrival city|to city/i,
    airlinesName: /airlines name|airline|airline name/i,
    travelersName: /travelers name|traveler|traveler name|name|passenger name|customer name/i,
    class: /class|booked class|class type|class name/i,
    bookingReferenceNumber: /booking reference number|booking number|booking id|booking reference number|booking no/i,
    totalAmount:/total amount|total cash|total paid|total booking amount|amount|/i,
    taxAmount: /tax amount|tax/i
  },
  cab: {
  date: /date|invoicedate|traveldate|bookingdate|billdate|bill date/i,
  cabNumber: /cabnumber|vehiclenumber/i,
  pickupLocation: /pickuplocation|from|fromlocation|pickup|pickuploc|Pickup Location/i,
  dropLocation: /droplocation|to|tolocation|drop|droploc|DropOff Location/i,
  driverName: /drivername|driver/i,
  travelersName: /travelersname|passengername|travellername/i,
  class: /class|type|cartype|cabclass/i,
  bookingReferenceNumber: /bookingreferencenumber|bookingid|bookingref/i,
  totalAmount: /totalamount|amount|total/i,
  taxAmount: /taxamount|tax/i
},
hotel: {
  date: /date|invoicedate|checkindate|checkoutdate|bill date/i,
  hotelName: /hotelname|hotel/i,
  roomNumber: /roomnumber|roomno|room/i,
  checkinDate: /checkindate|checkin/i,
  checkoutDate: /checkoutdate|checkout/i,
  travelersName: /travelersname|guestname|travellername|booking name|name/i,
  bookingReferenceNumber: /bookingreferencenumber|bookingid|bookingref/i,
  totalAmount: /totalamount|amount|total/i,
  taxAmount: /taxamount|tax/i
},
  meals:{
    date: /date:|date|invoice date|travel date|booking date|bill date|trip date|date of journey|date of departure/i,
    billNumber:/(?:INVOICE\s*NO\.\s*|invoice\s*no(?:\.\s*)?|invoice\s*number|bill number|bill no|bill nos|invoice no|invoice nos|bill ref|bill reference|invoice ref|invoice reference)\s*:\s*([\w\d]+)/i,
    VendorName:/vendor name| seller name|shop name|hotel name|stall name|restaurant name|restaurant name /i,
    totalAmount:/total amount|total cash|total paid|total booking amount|amount|/i,
    Quantity:/qty|quantity|nos|quantity/i,
    UnitCost:/unit cost| unit cost|per no cost/i,
    taxAmount: /tax amount|tax/i
  }
};


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


// export const formFieldsBasedOnCategory = async (data, category) => {
//   const categoryNames = ['hotels', 'trains', 'cab', 'bus'];
//   const flightCategory = 'flights';

//   if (flightCategory === category) {
//       const [fromAndTo, otherFields] = await Promise.allSettled([
//           extractAirportPairs(data), extractFormFieldsForAll(data)
//       ]);

//       const fulfilledResults = [fromAndTo, otherFields].filter(result => result.status === 'fulfilled');
//       const rejectedResults = [fromAndTo, otherFields].filter(result => result.status === 'rejected');

//       if (fulfilledResults.length === 2) {
//           const flightFormFields = {
//               success: true,
//               data: {
//                   ...fulfilledResults[0].value.data,
//                   ...fulfilledResults[1].value.data
//               }
//           };
//           return flightFormFields;
//       } else {
//           const errorResult = {
//               success: false,
//               error: rejectedResults[0].reason.message
//           };
//           return errorResult;
//       }
//   } else if (categoryNames.includes(category)) {
//       const result = await extractFormFieldsForAll(data);
//       if (result.success) {
//           return result;
//       } else {
//           throw new Error(result.error);
//       }
//   } else {
//       try {
//           const [resultForAll, customResult] = await Promise.allSettled([
//               extractFormFieldsForAll(data),
//               extractFormFieldsCustom(data)
//           ]);

//           const fulfilledResults = [resultForAll, customResult].filter(result => result.status === 'fulfilled');
//           const rejectedResults = [resultForAll, customResult].filter(result => result.status === 'rejected');

//           if (fulfilledResults.length === 2) {
//               const combinedResult = {
//                   success: true,
//                   data: {
//                       ...fulfilledResults[0].value.data,
//                       ...fulfilledResults[1].value.data
//                   }
//               };
//               return combinedResult;
//           } else {
//               const errorResult = {
//                   success: false,
//                   error: rejectedResults[0].reason.message
//               };
//               return errorResult;
//           }
//       } catch (error) {
//           console.error("Error in processing form fields:", error);
//           throw new Error("Internal Server Error");
//       }
//   }
// };


// for all
export const formFieldsBasedOnCategory = async (data, category) => {
  const categoryNames = ['hotel', 'train', 'cab', 'bus'];
  const flightCategory = 'flight';

  if (flightCategory === category) {
    console.log("flight category",)
    const [fromAndTo, otherFields] = await Promise.allSettled([
      extractAirportPairs(data), extractFormFieldsForAll(data)
    ]);

    const fulfilledResults = [fromAndTo, otherFields].filter(result => result.status === 'fulfilled');
    const rejectedResults = [fromAndTo, otherFields].filter(result => result.status === 'rejected');

    console.log('Fulfilled results:', fulfilledResults);
    console.log('Rejected results:', rejectedResults);

    if (fulfilledResults.length === 2) {
      if (fulfilledResults[0].value && fulfilledResults[1].value) {
        console.log('fulfilledResults[0].value:', fulfilledResults[0].value);
        console.log('fulfilledResults[0].value.data:', fulfilledResults[0].value.data);
        console.log('fulfilledResults[1].value:', fulfilledResults[1].value);
        console.log('fulfilledResults[1].value.data:', fulfilledResults[1].value.data);

        const flightFormFields = {
          success: true,
          data: {
            ...fulfilledResults[0].value.data,
            ...fulfilledResults[1].value.data
          }
        };
        return flightFormFields;
      } else {
        const errorResult = {
          success: false,
          error: 'One or both fulfilled results are undefined'
        };
        console.error('Error in processing form fields:', errorResult);
        return errorResult;
      }
    } else {
      const errorResult = {
        success: false,
        error: rejectedResults[0] ? rejectedResults[0].reason.message : 'Unknown error'
      };
      console.error('Error in processing form fields:', errorResult);
      return errorResult;
    }
  } else if (categoryNames.includes(category)) {
    const result = await extractFormFieldsForAll(data);
    if (result.success) {
      return result;
    } else {
      throw new Error(result.error);
    }
  } else {
    try {
      const [resultForAll, customResult] = await Promise.allSettled([
        extractFormFieldsForAll(data),
        extractFormFieldsCustom(data)
      ]);

      const fulfilledResults = [resultForAll, customResult].filter(result => result.status === 'fulfilled');
      const rejectedResults = [resultForAll, customResult].filter(result => result.status === 'rejected');

      console.log('Fulfilled results:', fulfilledResults);
      console.log('Rejected results:', rejectedResults);

      if (fulfilledResults.length === 2) {
        if (fulfilledResults[0].value && fulfilledResults[1].value) {
          console.log('fulfilledResults[0].value:', fulfilledResults[0].value);
          console.log('fulfilledResults[0].value.data:', fulfilledResults[0].value.data);
          console.log('fulfilledResults[1].value:', fulfilledResults[1].value);
          console.log('fulfilledResults[1].value.data:', fulfilledResults[1].value.data);

          const combinedResult = {
            success: true,
            data: {
              ...fulfilledResults[0].value.data,
              ...fulfilledResults[1].value.data
            }
          };
          return combinedResult;
        } else {
          const errorResult = {
            success: false,
            error: 'One or both fulfilled results are undefined'
          };
          console.error('Error in processing form fields:', errorResult);
          return errorResult;
        }
      } else {
        const errorResult = {
          success: false,
          error: rejectedResults[0] ? rejectedResults[0].reason.message : 'Unknown error'
        };
        console.error('Error in processing form fields:', errorResult);
        return errorResult;
      }
    } catch (error) {
      console.error("Error in processing form fields:", error);
      throw new Error("Internal Server Error");
    }
  }
};


export const extractFormFieldsForAll = async(data) => {
try {
console.log("Data:", data);

  // Total Booking Amount extraction  
 //   const totalAmountRegex = /Total\s*([\w\s]+)\s*Amount[\s\S]*?([\d.]+)/i;
 const totalAmountRegex = /(?:Total|TOTAL|total|Amount|amt|Amt|price|Price|Fair|fair)\s*([\w\s]+)\s*Amount[\s\S]*?([\d.]+)/i;
  const totalAmountMatch = await data.analyzeResult.content.match(totalAmountRegex);
console.log("")
 if (totalAmountMatch) {
  const amountType = totalAmountMatch[1].trim();
  const totalAmountNumber = parseFloat(totalAmountMatch[2]);

  if (!isNaN(totalAmountNumber)) {
    console.log(`Extracted ${amountType} Total Amount:`, totalAmountNumber);
  } else {
    throw new Error(`Failed to convert ${amountType} total amount to a number.`);
  }
} else {
  console.error('Total amount not found in the content.');
}

// Customer Name extraction
//   const customerNameRegex = /CUSTOMER NAME\s*([\w\s]+)/i;
  const customerNameRegex = /(?:customer name|full name|guest name|name|traveler name)\s*:\s*([\w\s]+)/i;
  const customerNameMatch = data.analyzeResult.content.match(customerNameRegex);

  if (customerNameMatch) {
    const customerName = customerNameMatch[1].trim();
    console.log('Extracted Customer Name:', customerName);
  } else {
    console.error('Customer Name not found in the content.');
  }

  // Invoice No extraction
  const invoiceNoRegex = /(?:INVOICE\s*NO\.\s*|invoice\s*no(?:\.\s*)?|invoice\s*number)\s*:\s*([\w\d]+)/i;
  
  const invoiceNoMatch = data.analyzeResult.content.match(invoiceNoRegex);

  if (invoiceNoMatch) {
    const invoiceNo = invoiceNoMatch[1];
    console.log('Extracted Invoice No:', invoiceNo);
  } else {
    console.error('Invoice No not found in the content.');
  }

  const taxAmountRegex = /(?:tax|total tax)\s*(?:amount)?\s*:\s*([\d.]+)/i;
  const taxAmountMatch = data.analyzeResult.content.match(taxAmountRegex);

  if (taxAmountMatch) {
      const taxAmount = parseFloat(taxAmountMatch[1]);
      console.log('Extracted Tax Amount:', taxAmount);
  } else {
      console.error('Tax Amount not found in the content.');
  }

  // Date extraction , check in and checkout date 
  const dateRegex = /(?:DATE|INVOICE DATE|Invoice Date|Date|invoicedate|invoice Date|Invoice Date|check\s*in\s*Date|check\s*out\s*Date|check\s*in|check\s*out|billdate|invoicedate|date|invoice\s*date)\s*[\-:\s]*([\d/]+)/i;
  // const dateRegex = /\b(?:billdate|invoicedate|date|invoice\s*date)\s*[\-:\s]*\b/i;
  const dateFormatPattern = /\b\d{4}[-/:\s]\d{2}[-/:\s]\d{2}\b/g;
  const checkInRegex = /\bcheck\s*[\-:\s]*in\s*[\-:\s]*\b/i;
  const checkOutRegex = /\bcheck\s*[\-:\s]*out\s*[\-:\s]*\b/i;

  const dateMatch = data.analyzeResult.content.match(dateRegex);
  const dateFormats = data.analyzeResult.content.match(dateFormatPattern);
  const checkInMatch = data.analyzeResult.content.match(checkInRegex);
  const checkOutMatch = data.analyzeResult.content.match(checkOutRegex);
 
  if (checkInMatch) {
    return `Pattern Match: checkIn - ${dateFormats ? dateFormats.join(', ') : 'No date found'}`;
} else if (checkOutMatch) {
    return `Pattern Match: checkOut - ${dateFormats ? dateFormats.join(', ') : 'No date found'}`;
} else if (dateMatch) {
    const patternMatch = dateMatch[0];
    return `Pattern Match: ${patternMatch} and ${patternMatch} date - ${dateFormats ? dateFormats.join(', ') : 'No date found'}`;
} else {
    return 'No match found';
}

} catch (error) {
  console.error('Error:', error.message);
}
};

// custom fields
export const extractFormFieldsCustom = async (data) => {
try {
console.log("Data:", data);

    // Custom Logic for Quantity extraction
    const quantityRegex = /(?:qty|items|quantity|)\s*:\s*([\d.]+)/i;
    const quantityMatch = data.analyzeResult.content.match(quantityRegex);

    if (quantityMatch) {
        const quantity = parseFloat(quantityMatch[1]);
        console.log('Extracted Quantity:', quantity);
    } else {
        console.error('Quantity not found in the content.');
    }

} catch (error) {
    console.error('Error:', error.message);
}
};

export const extractAirportPairs = (data) => {
  const regexPattern = /([A-Z]{3})\s*-\s*([A-Z]{3})/g;
  console.log("extractAirportPairs - data:", data);

  const matches = [...data.analyzeResult.content.matchAll(regexPattern)];

  if (matches.length > 0) {
    console.log("Matches found:", matches);

    const airportPairs = matches.map(match => {
      const [, from, to] = match;

      const departureFull = indianAirports[from] ?? from;
      const arrivalFull = indianAirports[to] ?? to;

      const departure = `${from} - ${departureFull}`;
      const arrival = `${to} - ${arrivalFull}`;

      console.log(`Traveling from ${departure} to ${arrival}`);

      return {
        Departure: departure,
        Arrival: arrival
      };
    });

    console.log("Airport pairs:", airportPairs);
    return airportPairs;
  } else {
    console.log("No matches found.");
    return [];
  }
};


const extractDate = (data)=>{
  let date = undefined;

  data.analyzeResult.keyValuePairs.forEach(pair=>{
    if(pair.value != undefined){
      const tokens = pair.key.content.split(' ');

      if(tokens.length>0){
        tokens.forEach(token=>{
          if(['date', 'Date', 'date:', 'Date:', 'date :', 'Date :'].includes(token)){
              date = pair.value.content;
              return;
          }
        })
          
      }
      
    }
  })

  return date;
}

const extractTotalAmount = (keyValuePairs) => {
  let totalAmount;

  // Define valid tokens for matching the key
  const validTokens = ['totalamount', 'totalfare', 'total', 'amount', 'fare', 'paid', 'totalpaid', 'totalbookingamount'];

  // Log the input key-value pairs
  console.log("I am inside RBI", keyValuePairs);

  for (let i = 0; i < keyValuePairs.length; i++) {
    const pair = keyValuePairs[i];

    if (pair.value !== undefined) {
      // Normalize the key by removing special characters and spaces, and converting to lowercase
      let key = pair.key.toLowerCase().replace(/[^a-z]/gi, '');

      // Check if the normalized key matches any of the valid tokens
      for (let j = 0; j < validTokens.length; j++) {
        const token = validTokens[j];
        if (key.includes(token)) {
          totalAmount = pair.value;
          console.log("Total Booking Amount:", totalAmount);
          return totalAmount;
        }
      }
    }
  }

  return undefined;
}


const handleResponse = (response) => {
  const defaultResponse = {
    countryCode: "",
    fullName: "",
    shortName: "",
    symbol: "",
    total: ""
  };

  if (!response) {
    return defaultResponse;
  }

  let result = response.match(/([A-Za-z]+|\d+(\.\d+)?|[^\w\s])/g);
  result = result || [];

  const responseObj = result.reduce((acc, item) => {
    if (/^\d+(\.\d+)?$/.test(item)) {
      acc.total = item;
    } else if (/^[A-Za-z]{1,4}$/.test(item)) {
      acc.shortName += item;
    } else if (/^[A-Za-z]{5,}$/.test(item)) {
      acc.fullName += item;
    } else if (item !== '.') {
      acc.symbol += item;
    }
    return acc;
  }, {...defaultResponse});

  const {total , ...getCurrency} = responseObj
  console.log("Response Object:", total , getCurrency);
  return {total, getCurrency};
};

// const extractTaxAmount = (data)=>{
//   let totalAmount;
//   const pairs = data.analyzeResult.keyValuePairs;

//   for(let i=0; i<pairs.length; i++){
//     const pair = pairs[i];

//     if(pair.value != undefined){
//       const validTokens = ['tax amount', 'total tax', 'tax', 'gst', 'cgst', 'igst']
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


const extractTaxAmount = (keyValuePairs) => {
  let taxAmount;

  const validTokens = ['tax amount', 'total tax', 'tax', 'gst', 'cgst', 'igst','taxes','taxs','Tax','TAX','Tax Amount','tax amount','Tax amount']

  // Log the input key-value pairs
  // console.log("I am inside Tax amount", keyValuePairs);

  for (let i = 0; i < keyValuePairs.length; i++) {
    const pair = keyValuePairs[i];

    if (pair.value !== undefined) {
      // Normalize the key by removing special characters and spaces, and converting to lowercase
      let key = pair.key.toLowerCase().replace(/[^a-z]/gi, '');

      // Check if the normalized key matches any of the valid tokens
      for (let j = 0; j < validTokens.length; j++) {
        const token = validTokens[j];
        if (key.includes(token)) {
          taxAmount = pair.value;
          console.log("Tax Amount:", taxAmount);
          return taxAmount;
        }
      }
    }
  }

  return undefined;
}

const extractVendorName = (data)=>{
  const pairs = data.analyzeResult.keyValuePairs;
  for(let i=0; i<pairs.length; i++){
    const pair = pairs[i];

    if(pair.value != undefined){
      const validTokens = ['vendor', 'vendor name' , 'restaurantname', 'food stall name', 'stall name', 'food court']
      let key = pair.key.content.toLowerCase();

      //sanitize key
      key = key.replace(/[^a-z]/gi, '').trim()

      if(validTokens.includes(key)){
        const res = pair.value.content
        console.log("vendor name", res)
        return res
      }

    }
  }

  return undefined;
}

const extractFrom = (data)=>{
  const pairs = data.analyzeResult.keyValuePairs;
  for(let i=0; i<pairs.length; i++){
    const pair = pairs[i];

    if(pair.value != undefined){
      const validTokens = ['from', 'departure', 'source', 'source station']
      let key = pair.key.content.toLowerCase();

      //sanitize key
      key = key.replace(/[^a-z]/gi, '').trim()

      if(validTokens.includes(key)){
        return pair.value.content
      }

    }
  }

  return undefined;
}

const extractTo = (data)=>{
  const pairs = data.analyzeResult.keyValuePairs;
  for(let i=0; i<pairs.length; i++){
    const pair = pairs[i];

    if(pair.value != undefined){
      const validTokens = ['to', 'destination', 'arrival', 'destination station']
      let key = pair.key.content.toLowerCase();

      //sanitize key
      key = key.replace(/[^a-z]/gi, '').trim()

      if(validTokens.includes(key)){
        return pair.value.content
      }

    }
  }

  return undefined;
}

const extractFormFields = async (data, category)=>{
  let from, to;

  if(category == 'flight'){
   const pair =  extractAirportPairs(data)
   from = pair.from;
   to = pair.to;
  }else{
    from = extractFrom(data)
    to = extractTo(data)
  }
  
  const date = extractDate(data);
  const totalAmount = extractTotalAmount(data)
  const taxAmount = extractTaxAmount(data);
  const vendorName = extractVendorName(data);
  console.log(from, to, date, totalAmount, taxAmount, vendorName, 'extracted fields from content....')
  return {from:from, to:to, date:date, totalAmount:totalAmount, taxAmount:taxAmount, vendorName:vendorName};
}











// export const getResult = async (resultId,category,tenantData,res) => {
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
//     console.log("typeof:", typeof response);

//     if (response.status === 200 && response.data?.status === "succeeded") { 
//       const getKeyValuePairs = response.data?.analyzeResult?.keyValuePairs
//       .filter(pair => pair.confidence > 0.80)
//       // .map(pair => ({
//       //     [pair.key.content.trim()]: pair.value.content
//       // }));
//       .map(pair=>{
//         return {key: pair.key.content, value: pair.value.content}
//       })
//       console.log("extracted data successfully", getKeyValuePairs); 
//       const[ ocrOutput, formFields, testing] = await  Promise.all([
//       extractFormFields(response.data, category),
//       findMatchingFields(tenantData,getKeyValuePairs, response.data),
//       formFieldsBasedOnCategory(response.data,category)
//       ]) 
//       const matched = formFields?.success === true ? { fields: formFields.data.fields } : null
//       return { success: true, getKeyValuePairs , ocrOutput, ...matched, testing};
//   } else {
//       console.log("failed to extract, please try again");
//       return { success: false, message: "failed to extract, please try again" }; 
//   }
//     const ocrOutput = await extractFormFields(response.data, category)
    
//     const allKeyValuePairs = response.data.analyzeResult.keyValuePairs
//     .filter(pair=>pair.value!=undefined)
//     .map(pair=>{
//       return {key: pair.key.content, value: pair.value.content}
//     })

//     console.log("allKeyValuePairs", allKeyValuePairs ,tenantData )
//     console.log(" response.data",  response.data)

//     const formFields = await findMatchingFields(tenantData,allKeyValuePairs, response.data)
//     return { success: true, data: ocrOutput, keyValuePairs: allKeyValuePairs, tenantData , formFields };
//   } catch (error) {
//     console.error("Error calling Azure Form Recognizer:", error);
//     console.error(error);

//     return { success: false, error: "Internal Server Error" };
//   }
// }





















