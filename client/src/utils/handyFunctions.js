function titleCase(str){
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

function urlRedirection(url){
  window.location.href=(url)
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
  
  function formatDate2(inputDate) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if(!datePattern.test(inputDate)){
      return
    }

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    let [year, month, day] = inputDate.split('-')
    if(day<10) day=day%10
    const dayWithSuffix = addOrdinalIndicator(day);
    month = monthNames[month-1]

    return dayWithSuffix + ' ' + month + ' ' + year;
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
  

  function camelCaseToTitleCase(inputString) {
    // Use a regular expression to split words at capital letters
    const words = inputString.split(/(?=[A-Z])/);
  
    // Capitalize the first letter of each word and join them with spaces
    const titleCaseString = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
    return titleCaseString;
  }

  function titleCaseToCamelCase(inputString) {
    // Split the title case string into words using spaces
    const words = inputString.split(' ');
  
    // Capitalize the first letter of the first word and convert the rest to lowercase
    const camelCaseString = words[0].toLowerCase() + words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  
    return camelCaseString;
  }


  //password validation
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

   return (
    password.length >= minLength
    && hasUpperCase
    && hasLowerCase
    && hasDigit
    && hasSpecialChar
   );
};
  

export {validatePassword, titleCase, formatDate, formatDate2, formatDate3, camelCaseToTitleCase, titleCaseToCamelCase,urlRedirection}