

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
      return(str) 
    }
    }
    
    function formatDate(inputDate) {
      if(!inputDate){
        return "-"
      }
      const date = new Date(inputDate);
    
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
    
      function getOrdinalSuffix(day) {
        if (day > 3 && day < 21) return 'th'; 
        switch (day % 10) {
          case 1: return "st";
          case 2: return "nd";
          case 3: return "rd";
          default: return "th";
        }
      }
    
      const dayWithSuffix = day + getOrdinalSuffix(day);
    
      return `${dayWithSuffix} ${month} ${year}`;
    }
    const formatFullDate = (date) => {
      return new Date(date).toString();
    };
    
      function formatDateMonth(date=Date.now()) {
        // Get the current timestamp
        const currentTimestamp = date
        
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
      
        // Format the date as "24 Aug"
        const formattedDate = `${day} ${month}`;

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

      const formatDateToYYYYMMDD = (dateString) => {
        const date = new Date(dateString); 
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const convertJsonToCsv = (json) => {
        const keys = Object.keys(json[0]);
        const csvRows = [keys.join(','), ...json.map(row => keys.map(key => row[key]).join(','))];
        return csvRows.join('\n');
      };

      const handleCSVDownload = (jsonData) => {
        const csvData = convertJsonToCsv(jsonData);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'employees.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      function formatAmount(number) {
        // Convert to a number if it isn't already
        const amount = parseFloat(number) || 0;
        return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      const convertJsonToPdf = (json) => {
        const keys = Object.keys(json[0]);
        const pdfContent = `
          <html>
          <head>
            <style>
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 8px; text-align: left; }
            </style>
          </head>
          <body>
            <table>
              <thead>
                <tr>${keys.map(key => `<th>${key}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${json.map(row => `<tr>${keys.map(key => `<td>${row[key]}</td>`).join('')}</tr>`).join('')}
              </tbody>
            </table>
          </body>
          </html>
        `;
      
        const pdfWindow = window.open('', '', 'width=800,height=600');
        pdfWindow.document.write(pdfContent);
        pdfWindow.document.close();
        pdfWindow.print();
      };

//convert large count to sym i.e. K,Million, Trillon
      const formatLargeNumber = (tickItem) => {
        if (Math.abs(tickItem) >= 1e12) {
          return `${(tickItem / 1e12)}T`;
        } else if (Math.abs(tickItem) >= 1e9) {
          return `${(tickItem / 1e9)}B`;
        } else if (Math.abs(tickItem) >= 1e6) {
          return `${(tickItem / 1e6)}M`;
        } else if (Math.abs(tickItem) >= 1e3) {
          return `${(tickItem / 1e3)}k`;
        } else {
          return tickItem.toString();
        }
      };
      
    export {formatAmount, titleCase, formatDateMonth, formatDate,formatFullDate, formatDate2, formatDate3, camelCaseToTitleCase,formatDateToYYYYMMDD, titleCaseToCamelCase ,convertJsonToCsv,handleCSVDownload,formatLargeNumber}