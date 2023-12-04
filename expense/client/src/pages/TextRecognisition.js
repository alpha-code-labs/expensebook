import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';

const TextRecognition = ({ selectedImage }) => {
  const [recognizedText, setRecognizedText] = useState('');

  useEffect(() => {
    const recognizeText = async () => {
      if (selectedImage) {
        Tesseract.recognize(
          selectedImage,
          'eng', // Specify the language for text recognition
          { logger: (info) => console.log(info) } // Optional logger
        )
          .then(({ data: { text } }) => {
            setRecognizedText(text);
          })
          .catch((error) => {
            console.error('Error recognizing text:', error);
          });
      }
    };
    recognizeText();
  }, [selectedImage]);

  return (
    <div>
      <h2>Recognized Text:</h2>
      <p>{recognizedText}</p>
    </div>
  );
};

export default TextRecognition;
