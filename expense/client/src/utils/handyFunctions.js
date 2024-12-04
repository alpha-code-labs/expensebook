function titleCase(str ) {
  str = str.toLowerCase().split(' ')
  str = str.map(word => {
      if (word.length > 0 && word.trim()) {
          return word.trim();
      }
  })
  str = str.filter(word => word != undefined)
  str = str.map(word => word.replace(word[0], word[0].toUpperCase()))
  return str.join(' ')
}

function formatDate(date=Date.now()) {
    // Get the current timestamp
    const currentTimestamp = date

    if(isDateInFormat(currentTimestamp)){
      return currentTimestamp
    }
    
    // Create a Date object from the timestamp
    const currentDate = new Date(currentTimestamp);
    
    // Define an array of month names for conversion
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    // Get the day, month, and year
    const day = currentDate.getDate();
    const month = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();
  
    // Add the appropriate ordinal indicator to the day
    const dayWithOrdinal = addOrdinalIndicator(day);
  
    // Format the date as "24th Aug 2023"
    const formattedDate = `${dayWithOrdinal} ${month} ${year}`;
  
    return formattedDate;
  }
  
  function addOrdinalIndicator(day) {
    if (day >= 11 && day <= 13) {
      return day + "th";
    }
    switch (day % 10) {
      case 1:
        return day + "st";
      case 2:
        return day + "nd";
      case 3:
        return day + "rd";
      default:
        return day + "th";
    }
  }
  
  function isDateInFormat(dateString) {
    // Define a regular expression pattern for the "24th Aug 2023" format
    const customFormatPattern = /^(\d{1,2})(st|nd|rd|th)\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$/;
  
    // Use the regular expression to test the input date string
    return customFormatPattern.test(dateString);
  }
  
  function urlRedirection(url){
    window.location.href=(url)
  }

  function formatDate2(inputDate) {

    if(isDateInFormat(inputDate)){
      return inputDate
    }

    const date = new Date(inputDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
  
    // Extract the day
    const day = date.getDate();
  
    // Add 'th', 'st', 'nd', or 'rd' to the day
    let daySuffix = '';
    if (day >= 11 && day <= 13) {
      daySuffix = 'th';
    } else {
      switch (day % 10) {
        case 1:
          daySuffix = 'st';
          break;
        case 2:
          daySuffix = 'nd';
          break;
        case 3:
          daySuffix = 'rd';
          break;
        default:
          daySuffix = 'th';
          break;
      }
    }
  
    // Construct the final formatted date
    const finalFormattedDate = `${day}${daySuffix} ${formattedDate}`;
  
    return finalFormattedDate;
  }

  

  function rearrangeKeyForLineItem(data, includedKeys) {
    const rearrangedData = {};
    let personalExpenseAdded = false;

    Object.keys(data).forEach(key => {
        rearrangedData[key] = data[key];
        
        if (includedKeys.includes(key) && !personalExpenseAdded) {
            rearrangedData['personalExpenseAmount'] = data['personalExpenseAmount'];
            personalExpenseAdded = true;
        }
    });

    if (!personalExpenseAdded) {
        rearrangedData['personalExpenseAmount'] = data['personalExpenseAmount'];
    }

    return rearrangedData;
}


  
  
  function getStatusClass(status){
    switch(status){
      case "approved":
        case "completed":
        case "booked":
        case "intransit":
        case "upcoming":
        case "save":
        case "paid":
        case "recovered":
        return 'border border-green-200 bg-green-100 text-green-200 rounded-full whitespace-nowrap';
      case "rejected":
      case "cancelled":  
      case "paid and cancelled":  
        return 'border border-red-900 bg-red-100 text-red-900 rounded-full whitespace-nowrap';
      case "pending settlement":
      case "pending approval": 
      case "pending booking": 
      case "pending": 
      case "transit":
      case "draft":
        return 'border border-yellow-200 bg-yellow-100 text-yellow-200 rounded-full whitespace-nowrap ';
      default:
        return " ";  

    }
  }    


  const generateRandomId = () => {
    const randomNumber = Math.random();
    const stringifiedNumber = String(randomNumber).replace('.', '');
    const randomId = stringifiedNumber.substring(0, 8);
  
    return randomId;
  };  

  function camelCaseToTitleCase(inputString) {
    // Use a regular expression to split words at capital letters
    const words = inputString.split(/(?=[A-Z])/);
  
    // Capitalize the first letter of each word and join them with spaces
    const titleCaseString = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
    return titleCaseString;
  }

  function initializeFormFields(fields,data) {
    const {defaultCurrency,travelType, categoryName} = data

    const initialData = {};
    fields.forEach((field) => {
      initialData[field.name] = ""; // Initialize each field with an empty string
    });

  initialData.isMultiCurrency = false;
  initialData.billImageUrl = "";
  initialData.convertedAmountDetails = null;
  initialData.Currency = defaultCurrency;
  initialData.isPersonalExpense = false;
  initialData.personalExpenseAmount = "";
  // initialData.travelType = travelType;
  initialData["Category Name"] = categoryName;
    return initialData;
  }


  function initializenonTravelFormFields(fields,data) {
    const {defaultCurrency, categoryName,group} = data

    const initialData = {};
    fields.forEach((field) => {
      initialData[field.name] = ""; // Initialize each field with an empty string
    });
  // initialData.isPersonalExpense = false;
  // initialData.personalExpenseAmount = "";
  initialData.isMultiCurrency = false;
  initialData.billImageUrl = "";
  initialData.convertedAmountDetails = null;
  initialData["Mode of Payment"]= ""
  initialData.Currency = defaultCurrency;
  initialData.group= group || {}
  // initialData.travelType = travelType;
  initialData["Category Name"] = categoryName;
    return initialData;
  }

  function allocationLevel(levels) {
    if(!levels){
      return 'null'
    }
    try {
      // Ensure levels and travelAllocationFlags are valid objects
      if (!levels  || typeof levels !== 'object') {
        throw new Error('Invalid levels or travelAllocationFlags data');
      }
  
      // Find the first key where the value is true
      const array = Object.keys(levels).find(
        (level) => levels[level] === true
      );
  
      // If no key is found, return an empty array
      return array|| [] ;
    } catch (error) {
      console.error('Error in allocationLevel function:', error.message);
      // Handle the error gracefully, possibly returning an empty array or a default value
      return [];
    }
  }
  
  function formatAmount(number) {
    // Convert to a number if it isn't already
    const amount = parseFloat(number) || 0;
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  function removeSuffix(text) {
    if (text.endsWith('es')) {
      return text.slice(0, -2);  // Remove 'es'
    } else if (text.endsWith('s')) {
      return text.slice(0, -1);  // Remove 's'
    }
    return text;  // Return the original text if neither 'es' nor 's' is found
  }

  function extractValidExpenseLines (expenseData, expenseType, id=null) {
    console.log('remove line id to duplicate',id)
    if(expenseData?.length ===0 ) return [];
  if( expenseType === "travelExpense"){ 
    return expenseData?.flatMap(item => 
        item.expenseLines
            .filter(line => (!["cancelled"].includes(line?.lineItemStatus) && line?.expenseLineId !== id))
            .map(line => ({
                ...line,
                expenseHeaderId: item.expenseHeaderId 
            }))
    );
  }
  if( expenseType === "nonTravelExpense")
    return expenseData?.filter(line => ((!["cancelled"].includes(line?.lineItemStatus) && line?.lineItemId !== id)))
  }


  function formatDateToYYYYMMDD(dateInput) {
    // Parse the input date
    const date = new Date(dateInput);
    // Check if the date is valid
    if (isNaN(date)) {
        return dateInput;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
  
export {formatDateToYYYYMMDD,extractValidExpenseLines,removeSuffix,rearrangeKeyForLineItem, allocationLevel,initializenonTravelFormFields, initializeFormFields, camelCaseToTitleCase, titleCase, formatDate, formatDate2 ,getStatusClass ,generateRandomId,urlRedirection,formatAmount}  

