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
  function formatDateAndTime(date = Date.now()) {
    // Get the current timestamp
    const currentTimestamp = date;
  
    // Check if the date is already formatted
    if (isDateInFormat(currentTimestamp)) {
      return currentTimestamp;
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
  
    // Get the hour, minute, and format it to AM/PM
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert 24-hour format to 12-hour format
    hours = hours % 12 || 12;
  
    // Format the time as "11:24 AM"
    const formattedTime = `${hours}:${minutes} ${ampm}`;
  
    // Combine the date and time as "24th Aug 2023 11:24 AM"
    const formattedDateTime = `${dayWithOrdinal} ${month} ${year} ${formattedTime}`;
  
    return formattedDateTime;
  }
  
  // Helper function to add the ordinal indicator
 
  
  // Placeholder for the isDateInFormat function

  
  
  function tripsAsPerExpenseFlag(trips, requiredData) {
    return trips.filter(trip => {
        // Filter by travel type (international, local, domestic)
        if (trip.travelType !== 'international' && trip.travelType !== 'local' && trip.travelType !== 'domestic') {
            return false;
        }
  
        // If status is "intransit", check the allowed permission
        if (trip?.tripStatus === 'transit') {
            const allowed = requiredData?.formValidation?.[trip?.travelType]?.expenseReportSubmissionDuringTravel?.permission?.allowed;
            // If allowed is false, remove this trip
  
            
            if ( allowed === false) {
                return false;
            }
        }
  
        // Keep the trip if all conditions pass
        return true;
    });
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

  const sortTripsForBooking = (trips) => {
    const currentDate = new Date();
    // Reset time to start of the day to compare only date values
    currentDate.setHours(0, 0, 0, 0);
  
    return trips.sort((a, b) => {
      const dateA = a.tripStartDate ? new Date(a.tripStartDate) : null;
      const dateB = b.tripStartDate ? new Date(b.tripStartDate) : null;
  
      if (dateA === null && dateB === null) return 0;
      if (dateA === null) return 1;
      if (dateB === null) return -1;
  
      // Reset time to start of the day for comparison
      dateA.setHours(0, 0, 0, 0);
      dateB.setHours(0, 0, 0, 0);
  
      const isDateAUpcoming = dateA >= currentDate;
      const isDateBUpcoming = dateB >= currentDate;
  
      if (isDateAUpcoming && isDateBUpcoming) {
        return dateA - dateB; // Both dates are in the future or today, sort ascending
      } else if (!isDateAUpcoming && !isDateBUpcoming) {
        return dateA - dateB; // Both dates are in the past, sort ascending
      } else if (isDateAUpcoming) {
        return -1; // Date A is in the future or today, move it before Date B
      } else {
        return 1; // Date B is in the future or today, move it before Date A
      }
    });
  };
  
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
        return ' border-green-200 opacity-80 bg-green-100 text-green-900 font-medium rounded-full';
      case "rejected":
      case "cancelled":  
      case "paid and cancelled":  
        return ' border-red-900 bg-red-100 text-red-900 rounded-full font-medium';
      case "pending settlement":
      case "pending approval": 
      case "new":
      case "pending booking": 
      case "awaiting pending settlement":
      case "pending": 
      case "transit":
      case "draft":
        return ' border-yellow-100  bg-yellow-100 text-yellow-600 rounded-full font-medium';
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
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 2); // 48 hours end
  const sevenDaysEnd = new Date(todayStart);
  sevenDaysEnd.setDate(sevenDaysEnd.getDate() + 7); // 7 days end
  const thirtyDaysEnd = new Date(todayStart);
  thirtyDaysEnd.setDate(thirtyDaysEnd.getDate() + 30); // 30 days end

  return data.filter(item => {
    const startDate = new Date(item.tripStartDate);

    switch (range) {
      case "48 Hours":
        // Trips within the next 48 hours
        return startDate >= todayStart && startDate < tomorrowEnd;

      case "7 Days":
        // Trips within the next 7 days but not within the next 48 hours
        return startDate >= tomorrowEnd && startDate < sevenDaysEnd;

      case "Within 30 Days":
        // Trips within the next 30 days but not within the next 7 days
        return startDate >= sevenDaysEnd && startDate < thirtyDaysEnd;

      case "Beyond 30 Days":
        // Trips beyond 30 days from today
        return startDate >= thirtyDaysEnd;

      default:
        return false;
    }
  });
};

// const filterByTimeRange = (data, range) => {
//   const now = new Date();
//   const todayStart = new Date(now.setHours(0, 0, 0, 0));
//   const tomorrowEnd = new Date(todayStart);
//   tomorrowEnd.setDate(tomorrowEnd.getDate() + 2);
//   const sevenDaysEnd = new Date(todayStart);
//   sevenDaysEnd.setDate(sevenDaysEnd.getDate() + 7);
//   const thirtyDaysEnd = new Date(todayStart);
//   thirtyDaysEnd.setDate(thirtyDaysEnd.getDate() + 30);

//   return data.filter(item => {
//     const startDate = new Date(item.tripStartDate);

//     switch (range) {
//       case "48 Hours":
//         return startDate >= todayStart && startDate < tomorrowEnd;
//       case "7 Days":
//         return startDate >= todayStart && startDate < sevenDaysEnd;
//       case "Within 30 Days":
//         return startDate >= todayStart && startDate < thirtyDaysEnd;
//       case "Beyond 30 Days":
//         return startDate >= thirtyDaysEnd;
//       default:
//         return false;
//     }
//   });
// };

//in 48 hours
function checkUpcomingTrip(tripStartDate) {
  const tripDate = new Date(tripStartDate);
  const currentDate = new Date();

  // Set hours to zero for comparison
  currentDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(currentDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  // Also set trip date hours to zero for comparison
  tripDate.setHours(0, 0, 0, 0);

  if (tripDate.getTime() === currentDate.getTime() || tripDate.getTime() === tomorrowDate.getTime()) {
      return `*Trip is scheduled to start within the next 48 hours.`;
  } 
}

const handleDownloadFile = async (url) => {
  const fileName = url.split('/').pop();
  console.log('file name:', fileName);

  try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      const aTag = document.createElement("a");
      aTag.href = downloadUrl;
      aTag.setAttribute('download', fileName);
      document.body.appendChild(aTag);
      aTag.click();

      // Clean up
      aTag.remove();
      URL.revokeObjectURL(downloadUrl);
  } catch (error) {
      console.error("Download failed:", error);
  }
};
  

export {handleDownloadFile,formatDateAndTime,tripsAsPerExpenseFlag,sortTripsForBooking,checkUpcomingTrip, filterByTimeRange,extractTripNameStartDate, sortTripsByDate, splitTripName, titleCase, formatDate, filterTravelRequests,formatDate2 ,getStatusClass ,addOrdinalIndicator ,formatDate3 ,getCashAdvanceButtonText,urlRedirection,formatAmount}  

