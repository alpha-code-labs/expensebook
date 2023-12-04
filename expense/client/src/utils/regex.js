const regex_collection = ['netamount','grandtotal','total', 'rate', 'rupees', 'amount', 'sale', 'invoiceamount', 'rs.']
import vendors from "./companies"




//const line  = 'Rate:amount..80.65hra'
//const dateString = 'abcdatt13/7/23  23 mar 2023'

//console.log(dateString.match(dateRegex))
//console.log(dateString.search(dateRegex2))

function extractDateFromText(data){

    let data_copy = data.slice()

    const _reg = /\bbooking(?:\s*date)?\b/gi
    const _p = data_copy.toLowerCase().search(_reg)
    console.log('bk', _p)

    if(_p!=-1){
        data_copy = data_copy.substr(_p, data_copy.length-_p)
    }
    
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    const dateRegex = [
        /(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})/i, 
        /\d{1,2}\s+(?:january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|october|oct|november|nov|december|dec)+\s\d{2,4}/i,
        /(\d{1,2})[-/]+(?:january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|october|oct|november|nov|december|dec)+[-/](\d{2,4})/i,
      /(\d{1,2})\s+(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{2,4})/i,   // DD Month YYYY
      /(\d{1,2})[-/]+(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)[-/](\d{2,4})/i,  // DD-Month-YYYY or DD/Month/YYYY
      /(\d{4})[-/](\d{1,2})[-/](\d{1,2})/,                           // YYYY-MM-DD or YYYY/MM/DD
      /(\d{1,2})[-/](\d{4})/            
    ]

    for (const regex of dateRegex) {
        const match = data_copy.match(regex);
        console.log(match)
        if (match) {
          return match[0]
        }
      }
    return `${day}/${month}/${year}`
  }

function extractTotalAmountFromText(line) {
    let totalAmount = null;
    let str = ''
    const length = []

    regex_collection.forEach(reg=> length.push(reg.length))
  
    const lowerLine = line.toLowerCase()
      regex_collection.forEach((regex, index) => {
        const pos = lowerLine.search(regex)
       // console.log(pos, regex)
        if (pos !== -1) {
         str = line.substr(pos+length[index],line.length-(pos+length[index]))
         
          const sp_i = str.indexOf(' ')
          if(sp_i !== -1){
            //console.log(sp_i, 'h')
            str = str.substr(0,sp_i)
          }

          const firstDigitIndex = str.search(/\d/)
         // console.log(firstDigitIndex, 'first')
          str = str.substr(firstDigitIndex, str.length-firstDigitIndex)

          let decimalFound = false
          
          for(let c in str){
            //console.log(str[c])
            if(!str[c].match(/[\d]/)){
              //console.log('not digit')
              if(str[c].match(/[.]/) && !decimalFound){
                //console.log('dot')
                decimalFound = true
              }
              else{
                str = str.substr(0,c)
                break
              }
            }            
          }

         // console.log(str, 'str...')
        }
      });
  
      if(str.match(/\d/)){
        //console.log(str, 'str...')
       return str
     }
     else return -1
  }

  function extractTotalAmountFromText2(text) {
    let totalAmount = null;
    let str = ''
    const length = []
    //let readyToReturn = fasle
    const regexPattern = /[^A-Za-z0-9/(/)/./:/-]/g  
    text = text.replace(regexPattern,"")


    regex_collection.forEach(reg=> length.push(reg.length))
  

       for(const regex of regex_collection) {
        //console.log(regex, 'from.. 2')
        let lowerLine = text.slice().toLowerCase() // copy of text in lower case
        let pos = lowerLine.search(regex)
        let count =0
        
        while(pos!=-1){
         // console.log('hello')
       // console.log(pos, regex)
          
         str = lowerLine.substr(pos+regex.length,lowerLine.length-(pos+regex.length))
         
          const firstDigitIndex = str.search(/\d/)
         // console.log(firstDigitIndex, 'first')
          str = str.substr(firstDigitIndex, str.length-firstDigitIndex)

          let decimalFound = false
          
          for(let c in str){
            //console.log(str[c])
            if(!str[c].match(/[\d]/)){
              //console.log('not digit')
              if(str[c].match(/[.]/) && !decimalFound){
                //console.log('dot')
                decimalFound = true
              }
              else{
                str = str.substr(0,c)
                break
              }
            }            
          }

         // console.log(str, 'str...')
         //trim the copy of tex and search for regex again

          lowerLine = lowerLine.substr(pos+regex.length, lowerLine.length-(pos+regex.length))
         pos = lowerLine.search(regex)

        //  console.log(lowerLine)
          
           if(str.match(/\d/) && pos== -1){
             // console.log(str, 'str...')
             return str
           }

        }

      }
  
     return -1
  }

  function extractVendorName(data){
    
    //some cleaning before searching
    const _p = data.search(/[a-zA-Z]/g)
    data = data.substr(_p, data.length - _p)
    console.log('starting from...', data[0])

    //look for vendor in vendor list.. 
    //make a copy of data in small case
    const data_copy = data.slice().toLowerCase()
    for(const vendor of vendors){
        let found = true
        for(const keyword of vendor.keywords){
            const tokens = keyword.split('+') 
            found = true
            for(const token of tokens){
                console.log('looking for..', token)
                if(data_copy.search(token) === -1){
                    found=false
                    break
                }
            }

            if(found) return vendor.name
        }
    }

    
    //regex collection for detecting CAPITAL CASE and Title Case words followed by a new line 
    const vendorNameRegex = [/\b[A-Z]([A-Z0-9]*[a-z][a-z0-9]*[A-Z]|[a-z0-9]*[A-Z][A-Z0-9]*[a-z])[A-Za-z0-9]*\b\n/, /\b[A-Z][a-zA-Z\d]*(?:\s+[A-Z][a-zA-Z\d]*)*\b\n/g, /\b[A-Z\d]{2,}\b/g ]  

    //if not found in vendor list look for regex pattern in text
    for(const regex of vendorNameRegex){
      console.log(regex)
        const vName = data.match(regex)
        console.log(vName)
        if(vName)
            return vName[0]
    }

  return ''
  }

  export {extractDateFromText, extractTotalAmountFromText, extractTotalAmountFromText2, extractVendorName}




 