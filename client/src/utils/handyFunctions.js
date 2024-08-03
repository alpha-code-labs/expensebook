function titleCase(str){
  if(!str){
    return '';
  }
    str = str.toLowerCase().split(' ')
    str = str.map(word=>{
        if(word.length>0 && word){
            return word.trim()
        }
    })
   str = str.filter(word=>word!=undefined)
    str= str.map(word=>word.replace(word[0],word[0].toUpperCase()))
    return str.join(' ')
  }

  
function formatDate(date=Date.now()){
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

  const sortTripsByDate = (trips) => {
    return trips.sort((a, b) => {
      const dateA = new Date(a.tripStartDate);
      const dateB = new Date(b.tripStartDate);
      return dateA - dateB;
    });
  };

  function extractTripNameStartDate(inputString) {
    // Regular expression to match the date part within parentheses
    const dateRegex = /\((\d{1,2})(?:st|nd|rd|th) (\w{3}) (\d{4})\)/;
    const match = inputString.match(dateRegex);
    
    if (match) {
      const day = parseInt(match[1]);
      const month = match[2];
      const year = parseInt(match[3]);
  
      // Month abbreviations and their corresponding numbers
      const months = {
        "Jan": 0,
        "Feb": 1,
        "Mar": 2,
        "Apr": 3,
        "May": 4,
        "Jun": 5,
        "Jul": 6,
        "Aug": 7,
        "Sep": 8,
        "Oct": 9,
        "Nov": 10,
        "Dec": 11
      };
  
      // Check if any part is missing or invalid
      if (!day || !month || !year || !(month in months)) {
        return "";
      }
  
      // Create a new Date object in UTC
      const date = new Date(Date.UTC(year, months[month], day));
      
      // Convert the date to ISO string format with Z timezone
      const isoString = date.toISOString();
      
      return isoString;
    } else {
      return "";
    }
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
        return 'border border-green-200 bg-green-100 text-green-200 rounded-full';
      case "rejected":
      case "cancelled":  
      case "paid and cancelled":  
        return 'border border-red-900 bg-red-100 text-red-900 rounded-full';
      case "pending settlement":
      case "pending approval": 
      case "pending booking": 
      case "pending": 
      case "transit":
      case "draft":
        return 'border border-yellow-200 bg-yellow-100 text-yellow-200 rounded-full';
      default:
        return " ";  

    }
  }  

  function formatAmount(number) {
    // Convert to a number if it isn't already
    const amount = parseFloat(number) || 0;
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  function formatDate3(inputDate) {
    
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if(!datePattern.test(inputDate)){
      return
    }

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    let [year, month, day] = inputDate.split('-')
    if(day<10) day=day%10
    const dayWithSuffix = addOrdinalIndicator(day);
    month = monthNames[month-1]

    return dayWithSuffix + ' ' + month;
  }

  function getCashAdvanceButtonText(departureDateStr) {
    // Convert the departure date to a JavaScript Date object
    const departureDate = new Date(departureDateStr);
  
    // Get today's date
    const today = new Date();
  
    // Calculate the difference in days between today and the departure date
    const daysUntilDeparture = Math.floor((today - departureDate  ) / (1000 * 60 * 60 * 24));
  
    // Determine the button text based on conditions
    if (daysUntilDeparture <= 10) {
      return 'Priority Cash Advance';
    } else {
      return 'Cash Advance';
    }
  }

  function urlRedirection(url){
    window.location.href=(url)
  }


  function filterTravelRequests(travelRequests) {
    let map = new Map();
    
  if (!travelRequests){
    return [];
  }
    travelRequests.forEach(request => {
        const { travelRequestId, isCashAdvanceTaken } = request;
        if (isCashAdvanceTaken || !map.has(travelRequestId)) {
            map.set(travelRequestId, request);
        }
    });

    return Array.from(map.values());
}

function splitTripName(tripName){
  if(tripName){ 
  return tripName?.split('(')[0];}
  else{
    "-"
  }
}


// filterUtils.js
// src/utils/filterData.js



const filterByTimeRange = (data, range) => {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const tomorrowEnd = new Date(todayStart);
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 2);
  const sevenDaysEnd = new Date(todayStart);
  sevenDaysEnd.setDate(sevenDaysEnd.getDate() + 7);
  const thirtyDaysEnd = new Date(todayStart);
  thirtyDaysEnd.setDate(thirtyDaysEnd.getDate() + 30);

  return data.filter(item => {
    const startDate = new Date(item.tripStartDate);

    switch (range) {
      case "48 Hours":
        return startDate >= todayStart && startDate < tomorrowEnd;
      case "7 Days":
        return startDate >= todayStart && startDate < sevenDaysEnd;
      case "30 Days":
        return startDate >= todayStart && startDate < thirtyDaysEnd;
      case "Beyond the month":
        return startDate >= thirtyDaysEnd;
      default:
        return false;
    }
  });
};



  

export {filterByTimeRange,extractTripNameStartDate, sortTripsByDate, splitTripName, titleCase, formatDate, filterTravelRequests,formatDate2 ,getStatusClass ,addOrdinalIndicator ,formatDate3 ,getCashAdvanceButtonText,urlRedirection,formatAmount}  

