// import multer from 'multer';
// import axios from 'axios';
// import dotenv from 'dotenv';
// import { indianAirports } from '../utils/airports.js';

// dotenv.config()

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Middleware to handle file upload
// export const uploadMiddleware = upload.single('file');

// // Bill uploaded 
// export const handleFileUpload = async (req, res) => {
//   try {
//     const fileContent = req.file.buffer;
//     const category = req.body.category;

//     const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;
//     const apiKey = process.env.FORM_RECOGNIZER_API_KEY;
//     const modelId = process.env.FORM_RECOGNIZER_MODELID;

//     const apiUrl = `${endpoint}/formrecognizer/documentModels/${modelId}:analyze?api-version=2023-07-31`;

//     const response = await axios.post(
//       apiUrl,
//       fileContent,
//       {
//         headers: {
//           'Content-Type': 'application/pdf',
//           'Ocp-Apim-Subscription-Key': apiKey
//         },
//         responseType: 'json'
//       }
//     );

//     const { headers } = response;
//     console.log('These are the headers: ', headers);

//     const { 'apim-request-id': resultId } = headers;
//     console.log(resultId);

//     // Assuming you have a function makeApiCall defined somewhere
//     const getFromAzure = await makeApiCall(resultId,category);

//     return res.status(200).json({ success: true, data: getFromAzure});
//   } catch (error) {
//     console.error("Error calling Azure Form Recognizer:");
//     console.error(error);

//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// };


// // app.post('/api/upload',uploadMiddleware, async (req, res) => {
// //   try {
// //     const fileContent = req.file.buffer;

// //     const endpoint = "https://expensebookocr1.cognitiveservices.azure.com";
// //     const apiKey = "965d6603ff174447a739c094d4e06123";
// //     const modelId = "prebuilt-document"

// // //  const apiUrl = `${endpoint}/documentintelligence/documentModels/${modelId}:analyze?api-version=2023-10-31-preview&features=keyValuePairs`

// //    const apiUrl = `${endpoint}/formrecognizer/documentModels/${modelId}:analyze?api-version=2023-07-31`;
   
// //    const response = await axios.post(
// //        apiUrl,
// //     //   requestData,
// //       fileContent,
// //       {
// //         headers: {
// //           'Content-Type': 'application/pdf',
// //           'Ocp-Apim-Subscription-Key': apiKey
// //         },
// //         responseType: 'json'
// //       }
// //     );

// //     // console.log("post to Azure Form Recognizer:", response);
// //     // console.log(response.data);
     
// //     const { headers } = response;
// //     console.log('These are the headers: ', headers);

// //     const { 'apim-request-id': resultId } = headers;
// //     console.log(resultId);
    
// //     const getFromAzure = await makeApiCall(resultId)
     
     
// //    return res.status(200).json({ success: true, data: response.data });
// //   } catch (error) {
// //     console.error("Error calling Azure Form Recognizer:");
// //     console.error(error);

// //     res.status(500).json({ success: false, error: "Internal Server Error" });
// //   }
// // });
  
// // wait for ocr result

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
    
//     const ocrOutput = await formFieldsBasedOnCategory(response,category,res)

//     if(ocrOutput){
//       res.status(200).json({ success: true, data: ocrOutput });
//     }
//   } catch (error) {
//     console.error("Error calling Azure Form Recognizer:");
//     console.error(error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// }

// // Based on bill category type use regex to extract fields and send as response
// export const formFieldsBasedOnCategory = async (data, category, res) => {
//   try{   
//     console.log(" form fields---------",data, category, res)
//    const categoryNames = ['hotels', 'trains', 'cab', 'bus'];
     
//   const flightCategory = 'flights';

//   if (flightCategory == category) {
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
//           return {success: true , data: flightFormFields};
//       } else {
//           const errorResult = {
//               success: false,
//               error: rejectedResults[0].reason.message
//           };
//           return {success: true, data:errorResult};
//       }
//   } else if (categoryNames.includes(category)) {
//       const result = await extractFormFieldsForAll(data);
//       if (result.success) {
//           return {success: true, data:result}
//       } else {
//           return  {success: false, data:result}
//       }
//   } 
//   else {
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
//               return  {success: true, data:combinedResult};
//           } else {
//               const errorResult = {
//                   success: false,
//                   error: rejectedResults[0].reason.message
//               };
//               return  {success: true, data:errorResult}; 
//           }
//       } catch (error) {
//           console.error("Error in processing form fields:", error);
//           return ({ success: false, error: "Internal Server Error" });
//       }
//   }} catch(error){
//     console.log('error occured here')
//     return ({ message: 'error occured', error})
//   }
// }


// // for all
// export const extractFormFieldsForAll = async(data) => {
//     try {
//       console.log("Data:", data);
  
//       // Total Booking Amount extraction  
//      //   const totalAmountRegex = /Total\s*([\w\s]+)\s*Amount[\s\S]*?([\d.]+)/i;
//      const totalAmountRegex = /(?:Total|TOTAL|total|Amount|amt|Amt|price|Price|Fair|fair)\s*([\w\s]+)\s*Amount[\s\S]*?([\d.]+)/i;
//       const totalAmountMatch = await data.analyzeResult.content.match(totalAmountRegex);

//      if (totalAmountMatch) {
//       const amountType = totalAmountMatch[1].trim();
//       const totalAmountNumber = parseFloat(totalAmountMatch[2]);

//       if (!isNaN(totalAmountNumber)) {
//         console.log(`Extracted ${amountType} Total Amount:`, totalAmountNumber);
//       } else {
//         throw new Error(`Failed to convert ${amountType} total amount to a number.`);
//       }
//     } else {
//       console.error('Total amount not found in the content.');
//     }
  
//     // Customer Name extraction
//     //   const customerNameRegex = /CUSTOMER NAME\s*([\w\s]+)/i;
//       const customerNameRegex = /(?:customer name|full name|guest name|name|traveller name)\s*:\s*([\w\s]+)/i;
//       const customerNameMatch = data.analyzeResult.content.match(customerNameRegex);
  
//       if (customerNameMatch) {
//         const customerName = customerNameMatch[1].trim();
//         console.log('Extracted Customer Name:', customerName);
//       } else {
//         console.error('Customer Name not found in the content.');
//       }
  
//       // Invoice No extraction
//       const invoiceNoRegex = /(?:INVOICE\s*NO\.\s*|invoice\s*no(?:\.\s*)?|invoice\s*number)\s*:\s*([\w\d]+)/i;
      
//       const invoiceNoMatch = data.analyzeResult.content.match(invoiceNoRegex);
  
//       if (invoiceNoMatch) {
//         const invoiceNo = invoiceNoMatch[1];
//         console.log('Extracted Invoice No:', invoiceNo);
//       } else {
//         console.error('Invoice No not found in the content.');
//       }
  
//       const taxAmountRegex = /(?:tax|total tax)\s*(?:amount)?\s*:\s*([\d.]+)/i;
//       const taxAmountMatch = data.analyzeResult.content.match(taxAmountRegex);

//       if (taxAmountMatch) {
//           const taxAmount = parseFloat(taxAmountMatch[1]);
//           console.log('Extracted Tax Amount:', taxAmount);
//       } else {
//           console.error('Tax Amount not found in the content.');
//       }

//       // Date extraction , check in and checkout date 
//     //   const dateRegex = /(?:DATE|INVOICE DATE|Invoice Date|Date|invoicedate|invoice Date|Invoice Date|check\s*in\s*Date|check\s*out\s*Date|check\s*in|check\s*out):\s*([\d/]+)/i;
//       const dateRegex = /\b(?:billdate|invoicedate|date|invoice\s*date)\s*[\-:\s]*\b/i;
//       const dateFormatPattern = /\b\d{4}[-/:\s]\d{2}[-/:\s]\d{2}\b/g;
//       const checkInRegex = /\bcheck\s*[\-:\s]*in\s*[\-:\s]*\b/i;
//       const checkOutRegex = /\bcheck\s*[\-:\s]*out\s*[\-:\s]*\b/i;

//       const dateMatch = data.analyzeResult.content.match(dateRegex);
//       const dateFormats = data.analyzeResult.content.match(dateFormatPattern);
//       const checkInMatch = data.analyzeResult.content.match(checkInRegex);
//       const checkOutMatch = data.analyzeResult.content.match(checkOutRegex);
     
//       if (checkInMatch) {
//         return `Pattern Match: checkIn - ${dateFormats ? dateFormats.join(', ') : 'No date found'}`;
//     } else if (checkOutMatch) {
//         return `Pattern Match: checkOut - ${dateFormats ? dateFormats.join(', ') : 'No date found'}`;
//     } else if (dateMatch) {
//         const patternMatch = dateMatch[0];
//         return `Pattern Match: ${patternMatch} and ${patternMatch} date - ${dateFormats ? dateFormats.join(', ') : 'No date found'}`;
//     } else {
//         return 'No match found';
//     }
   
//     } catch (error) {
//       console.error('Error:', error.message);
//     }
// };

// // custom fields
// export const extractFormFieldsCustom = async (data) => {
//     try {
//         console.log("Data:", data);

//         // Custom Logic for Quantity extraction
//         const quantityRegex = /(?:qty|items|quantity|)\s*:\s*([\d.]+)/i;
//         const quantityMatch = data.analyzeResult.content.match(quantityRegex);

//         if (quantityMatch) {
//             const quantity = parseFloat(quantityMatch[1]);
//             console.log('Extracted Quantity:', quantity);
//         } else {
//             console.error('Quantity not found in the content.');
//         }

//     } catch (error) {
//         console.error('Error:', error.message);
//     }
// };

// // To extract Airport names from ticket
// export const extractAirportPairs = (data) => {
//     const regexPattern = /([A-Z]+)\s*-\s*([A-Z]+)/g;
//     const matches = data.analyzeResult.content.match(regexPattern);
  
//     if (matches) {
//       console.log("Matches found:", matches);
  
//       const airportPairs = matches.map(match => {
//         const [fullMatch, from, to] = regexPattern.exec(match);
        
//         console.log(`Travelling ${from} / ${indianAirports[from]}, ${to} / ${indianAirports[to]}`);
        
//         return {
//           from: indianAirports[from],
//           to: indianAirports[to]
//         };
//       });
  
//       console.log("Airport pairs:", airportPairs);
//       return airportPairs;
//     } else {
//       console.log("No matches found.");
//       return null;
//     }
//   };

import multer from 'multer';
import axios from 'axios';
import dotenv from 'dotenv';
import { indianAirports } from '../utils/airports.js';


dotenv.config()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle file upload
export const uploadMiddleware = upload.single('file');

// Bill uploaded 
export const handleFileUpload = async (req, res) => {
  try {
    const fileContent = req.file.buffer;
    const category = req.body.category;

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

    //Assuming you have a function makeApiCall defined somewhere
    const finalResult = await makeApiCall(resultId, category);

    return res.status(200).json(finalResult);

    //return res.status(200).json({ success: true, data: {from:'Chhatrapati Shivaji Maharaj International Airport', to:'John F. Kennedy International Airport', date:'2024-02-18', time:'11:30', 'Tax Amount': 2394, 'Total Amount':24000} });
  } catch (error) {
    console.error("Error calling Azure Form Recognizer:");
    console.error(error);

    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export  const makeApiCall = async (resultId, category) => {
    const delayInMilliseconds = 10000; 
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    console.log("i am inside make api call", resultId)
    await delay(delayInMilliseconds );
    return await getResult(resultId, category)
}

//get the ocr result
export const getResult = async (resultId,category,res) => {
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
    
    const ocrOutput = await extractFormFields(response.data, category)
    
    const allKeyValuePairs = response.data.analyzeResult.keyValuePairs
    .filter(pair=>pair.value!=undefined)
    .map(pair=>{
      return {key: pair.key.content, value: pair.value.content}
    })

    return { success: true, data: ocrOutput, keyValuePairs: allKeyValuePairs };
  } catch (error) {
    console.error("Error calling Azure Form Recognizer:");
    console.error(error);

    return { success: false, error: "Internal Server Error" };
  }
}

// Based on bill category type use regex to extract fields and send as response
export const formFieldsBasedOnCategory = async (data, category, res) => {
const categoryNames = ['hotels', 'trains', 'cab', 'bus'];

const flightCategory = 'flights';

if (flightCategory == category) {
    const [fromAndTo, otherFields] = await Promise.allSettled([
        extractAirportPairs(data), extractFormFieldsForAll(data)
    ]);

    const fulfilledResults = [fromAndTo, otherFields].filter(result => result.status === 'fulfilled');
    const rejectedResults = [fromAndTo, otherFields].filter(result => result.status === 'rejected');

    if (fulfilledResults.length === 2) {
        const flightFormFields = {
            success: true,
            data: {
                ...fulfilledResults[0].value.data,
                ...fulfilledResults[1].value.data
            }
        };
        return res.status(200).json(flightFormFields);
    } else {
        const errorResult = {
            success: false,
            error: rejectedResults[0].reason.message
        };
        return res.status(500).json(errorResult);
    }
} else if (categoryNames.includes(category)) {
    const result = await extractFormFieldsForAll(data);
    if (result.success) {
        return res.status(200).json(result);
    } else {
        return res.status(500).json(result);
    }
} 
else {
    try {
        const [resultForAll, customResult] = await Promise.allSettled([
            extractFormFieldsForAll(data),
            extractFormFieldsCustom(data)
        ]);

        const fulfilledResults = [resultForAll, customResult].filter(result => result.status === 'fulfilled');
        const rejectedResults = [resultForAll, customResult].filter(result => result.status === 'rejected');

        if (fulfilledResults.length === 2) {
            const combinedResult = {
                success: true,
                data: {
                    ...fulfilledResults[0].value.data,
                    ...fulfilledResults[1].value.data
                }
            };
            return res.status(200).json(combinedResult);
        } else {
            const errorResult = {
                success: false,
                error: rejectedResults[0].reason.message
            };
            return res.status(500).json(errorResult);
        }
    } catch (error) {
        console.error("Error in processing form fields:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}
}

// for all
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
  const customerNameRegex = /(?:customer name|full name|guest name|name|traveller name)\s*:\s*([\w\s]+)/i;
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
//   const dateRegex = /(?:DATE|INVOICE DATE|Invoice Date|Date|invoicedate|invoice Date|Invoice Date|check\s*in\s*Date|check\s*out\s*Date|check\s*in|check\s*out):\s*([\d/]+)/i;
  const dateRegex = /\b(?:billdate|invoicedate|date|invoice\s*date)\s*[\-:\s]*\b/i;
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

// To extract Airport names from ticket
export const extractAirportPairs = (data) => {
  const regexPattern = /([A-Z]{3})\s*-\s*([A-Z]{3})/g;
  const matches = data.analyzeResult.content.match(regexPattern);


  if (matches) {
    console.log("Matches found:", matches);
    const [fullMatch, from, to] = regexPattern.exec(matches[0]);

    return {
      from: indianAirports[from],
      to: indianAirports[to]
    };
    
    // const airportPairs = matches.map(match => {
    //   const [fullMatch, from, to] = regexPattern.exec(match);
      
    //   console.log(`Travelling ${from} / ${indianAirports[from]}, ${to} / ${indianAirports[to]}`);
      
    //   return {
    //     from: indianAirports[from],
    //     to: indianAirports[to]
    //   };
    // });
    
    // console.log("Airport pairs:", airportPairs);
    // return airportPairs;
  } else {
    console.log("No matches found.");
    return {from: undefined, to:undefined};
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

const extractTotalAmount = (data)=>{
  let totalAmount;
  const pairs = data.analyzeResult.keyValuePairs;

  for(let i=0; i<pairs.length; i++){
    const pair = pairs[i];

    if(pair.value != undefined){
      const validTokens = ['total amount', 'total fare', 'total', 'amount', 'fare', 'paid', 'total paid']
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

const extractTaxAmount = (data)=>{
  let totalAmount;
  const pairs = data.analyzeResult.keyValuePairs;

  for(let i=0; i<pairs.length; i++){
    const pair = pairs[i];

    if(pair.value != undefined){
      const validTokens = ['tax amount', 'total tax', 'tax', 'gst', 'igst']
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

const extractVendorName = (data)=>{
  const pairs = data.analyzeResult.keyValuePairs;
  for(let i=0; i<pairs.length; i++){
    const pair = pairs[i];

    if(pair.value != undefined){
      const validTokens = ['vendor', 'vendor name']
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

  if(category == 'flights'){
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
  console.log(from, to, date, totalAmount, taxAmount, vendorName, 'extracted fields....')
  return {from:from, to:to, date:date, totalAmount:totalAmount, taxAmount:taxAmount, vendorName:vendorName};
}


