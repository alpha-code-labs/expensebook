import { useEffect, useState } from 'react'
import Tesseract from 'tesseract.js'
import './App.css'
import convertToGrayscale from './grayScale'

import {extractTotalAmountFromText, extractTotalAmountFromText2, extractDateFromText, extractVendorName} from './regex'



async function App() {
  const [output, setOutput] = useState(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('N/A')
  const [processedImage, setProcessedImage] = useState()
  const [extractedAmount, setExtractedAmount] = useState(null)
  const [extractedAmount2, setExtractedAmount2] = useState(null)
  const [extractedDate, setExtractedDate] = useState(null)
  const [extractedVendorName, setExtractedVendorName] = useState(null)

  const showConverted = false

  //animatin transition type
  const spring = {
    type: 'spring',
    damping: 10,
    stiffness: 100
  }


  useEffect(()=>{
    if(showConverted)
    (async ()=>{
      const image = await convertToGrayscale(billImage)
      setProcessedImage(image)
    })()

    //const inputText = 'net sub total Rs. 300, grand total Rs. 800 17/10/2016'
    //const doc = nlp(inputText);
    //const entities = doc.dates().json()
    //console.log(entities, 'entities');

  },[])


  useEffect(()=>{
      let dontChange = false
      //let outputCopy = output.slice()
      output && output.lines.map(line=>{
      const regexPattern = /[^A-Za-z0-9/(/)/./:]/g
      let text = line.text.replace(regexPattern,"").toLowerCase()
      const amount = extractTotalAmountFromText(text)
       
      //console.log('line:', text)
      //console.log('amount:', amount)
      //console.log(text.search('total'), 'dontChange....')

      if(amount !== -1 && (!dontChange || text.search('total'))!= -1 ){
        setExtractedAmount(amount)
        if(text.search('total')!= -1) dontChange=true
      }

    })
   
  },[output])

   // Test the function with sample OCR-generated text



}

export default tesseractExtraction
