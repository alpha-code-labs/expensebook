function titleCase(str){
  
  try{
    str = str.toLowerCase().split(' ')
    str = str.map(word=>{
        if(word.length>0 && word){
            return word.trim()
        }
    })
    str = str.filter(word=>word!=undefined)
    str= str.map(word=>word.replace(word[0],word[0].toUpperCase()))
    return str.join(' ')
  }catch(e){
    console.log(e)
    return(str)
  }
}


function splitTripName(tripName){
  if(tripName){ 
  return tripName?.split('(')[0];}
  else{
    "-"
  }
}

// Example usage:
// titleCase("hello world"); // replace with your own test cases


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
  

  function urlRedirection(url){
    window.location.href=(url)
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

  export function formattedTime(timeValue){
    try{
        if(timeValue == null || timeValue == undefined) return timeValue
        const hours = timeValue.split(':')[0]>=12? timeValue.split(':')[0]-12 : timeValue.split(':')[0]
        const minutes = timeValue.split(':')[1]
        const suffix = timeValue.split(':')[0]>=12? 'PM' : 'AM'

        return `${hours}:${minutes} ${suffix}`
    }
    catch(e){
        return timeValue
    }
}
  

export function isoString(dateString){
  console.log('receivedDate', dateString)
  if(dateString==null || dateString == undefined) return ''
  // Convert string to Date object
  const dateObject = new Date(dateString);
  // Convert Date object back to ISO string
  const isoDateString = dateObject.toDateString();
  console.log(isoDateString);
  return isoDateString
}
  function formatAmount(number) {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  

export {splitTripName, titleCase, formatDate, formatDate2 ,getStatusClass,urlRedirection,formatAmount}  

